// Fase "sugerindo": a prateleira com as sugestões e o formulário da sua.
import { createGame, deleteGame, updateGame } from '../../api.js';
import { icon } from '../../lib/icons.js';
import { PLATFORMS } from '../../lib/platforms.js';
import { rawgEnabled, searchGames } from '../../lib/rawg.js';
import { DURATION_LABEL, MODE_LABEL, esc, safeUrl, toast, withBusy } from '../../lib/util.js';
import { empty, gameBox, shelf } from '../parts.js';

const PITCH_MAX = 200;

export function renderSuggest(container, data, ctx) {
  const { games, members, uid } = data;
  const mine = games.find((g) => g.id === uid);
  // O seu jogo vem primeiro na prateleira.
  const ordered = mine ? [mine, ...games.filter((g) => g !== mine)] : games;

  const boxes = ordered.map((g) => {
    if (g.id !== uid) return gameBox(g, members);
    return gameBox(g, members, {
      cls: 'is-mine',
      stamp: '<span class="stamp stamp--orange">Seu</span>',
      actions: `
        <button class="btn btn--sm" data-edit>${icon('pencil')} Editar</button>
        <button class="btn btn--sm btn--danger" data-remove>${icon('trash')} Tirar da prateleira</button>`,
    });
  });

  container.innerHTML = `
    <section aria-labelledby="shelf-title">
      <h2 id="shelf-title">Na prateleira</h2>
      ${games.length ? shelf(boxes.join('')) : empty('Prateleira vazia', 'Ninguém sugeriu ainda. Abre os trabalhos!')}
    </section>
    <section id="form-wrap" aria-labelledby="form-title" ${mine ? 'hidden' : ''}>
      <h2 id="form-title">${mine ? 'Editar sua sugestão' : 'Sua sugestão'}</h2>
      ${gameForm(mine)}
    </section>`;

  const wrap = container.querySelector('#form-wrap');
  container.querySelector('[data-edit]')?.addEventListener('click', () => {
    wrap.hidden = false;
    wrap.querySelector('input[name=name]').focus();
    wrap.scrollIntoView({ block: 'start' });
  });

  container.querySelector('[data-remove]')?.addEventListener('click', async (event) => {
    if (!confirm(`Tirar "${mine.name}" da prateleira?`)) return;
    const ok = await withBusy(event.currentTarget, () => deleteGame(data.round.id, uid).then(() => true));
    if (ok) {
      toast('Sugestão removida. A vaga é sua de novo.');
      await ctx.refresh();
    }
  });

  bindForm(wrap.querySelector('form'), data, ctx, mine);
}

// ------------------------------------------------------------ formulário

function gameForm(game = {}) {
  const has = new Set(game.platforms ?? []);
  const option = (labels, value) =>
    Object.entries(labels).map(([v, label]) => `<option value="${v}" ${v === value ? 'selected' : ''}>${label}</option>`).join('');

  const search = rawgEnabled
    ? `<div class="field search">
         <label for="rawg-q"><span>Buscar jogo</span></label>
         <input class="input" id="rawg-q" type="search" autocomplete="off" placeholder="Digite o nome e escolha na lista" aria-describedby="rawg-hint">
         <small id="rawg-hint">Preenche capa, ano, gênero e plataformas. Dá pra ajustar tudo depois.</small>
         <ul class="search__list" id="rawg-results" hidden></ul>
       </div>`
    : '<p class="small muted">Busca automática desligada (sem chave do RAWG). Preenche à mão mesmo.</p>';

  return `
    <form class="form" novalidate>
      ${search}
      <input type="hidden" name="rawgId" value="${esc(game.rawgId ?? '')}">
      <label class="field"><span>Nome do jogo</span>
        <input class="input" name="name" required maxlength="100" value="${esc(game.name ?? '')}">
      </label>
      <label class="field"><span>Por que você quer jogar isso?</span>
        <textarea class="input" name="pitch" required maxlength="${PITCH_MAX}" aria-describedby="pitch-count">${esc(game.pitch ?? '')}</textarea>
        <span class="counter" id="pitch-count" aria-live="polite"></span>
      </label>
      <label class="field"><span>Link da capa</span>
        <input class="input" name="cover" type="url" inputmode="url" placeholder="https://…" value="${esc(game.cover ?? '')}">
        <small>Opcional. Uma imagem em pé fica melhor na prateleira.</small>
      </label>
      <div class="field-row">
        <label class="field"><span>Ano</span>
          <input class="input" name="year" type="number" inputmode="numeric" min="1950" max="2100" value="${esc(game.year ?? '')}">
        </label>
        <label class="field"><span>Gênero</span>
          <input class="input" name="genre" maxlength="60" value="${esc(game.genre ?? '')}">
        </label>
      </div>
      <div class="field-row">
        <label class="field"><span>Duração</span>
          <select class="input" name="duration">${option(DURATION_LABEL, game.duration ?? 'medio')}</select>
        </label>
        <label class="field"><span>Modo</span>
          <select class="input" name="mode">${option(MODE_LABEL, game.mode ?? 'solo')}</select>
        </label>
      </div>
      <label class="field"><span>Preço aproximado (R$)</span>
        <input class="input" name="price" type="number" inputmode="numeric" min="0" max="10000" step="1" required value="${esc(game.price ?? '')}">
        <small>0 se for grátis.</small>
      </label>
      <fieldset class="field"><legend>Plataformas</legend>
        <div class="checks">${PLATFORMS.map((p) => `
          <label class="check"><input type="checkbox" name="platforms" value="${p}" ${has.has(p) ? 'checked' : ''}>${p}</label>`).join('')}
        </div>
      </fieldset>
      <p class="small" id="form-error" role="alert" style="color:var(--pink)"></p>
      <div class="actions">
        <button class="btn btn--primary" type="submit">${game.name ? 'Salvar alterações' : 'Pôr na prateleira'}</button>
      </div>
    </form>`;
}

function bindForm(form, data, ctx, mine) {
  const pitch = form.elements.pitch;
  const counter = form.querySelector('#pitch-count');
  const updateCounter = () => {
    const left = PITCH_MAX - pitch.value.length;
    counter.textContent = `${pitch.value.length}/${PITCH_MAX}`;
    counter.classList.toggle('is-over', left < 0);
  };
  pitch.addEventListener('input', updateCounter);
  updateCounter();

  if (rawgEnabled) bindRawg(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = form.querySelector('#form-error');
    const result = readForm(form);
    if (typeof result === 'string') {
      error.textContent = result;
      return;
    }
    error.textContent = '';
    const button = form.querySelector('[type=submit]');
    const ok = await withBusy(button, () =>
      (mine ? updateGame(data.round.id, data.uid, result) : createGame(data.round.id, data.uid, result)).then(() => true),
    );
    if (ok) {
      toast(mine ? 'Sugestão atualizada.' : 'Tá na prateleira!');
      await ctx.refresh();
    }
  });
}

// Lê e valida o formulário. Devolve os dados ou uma mensagem de erro.
// (As mesmas regras valem no servidor, nas firestore.rules.)
function readForm(form) {
  const f = form.elements;
  const name = f.name.value.trim();
  const pitch = f.pitch.value.trim();
  const coverRaw = f.cover.value.trim();
  const cover = coverRaw ? safeUrl(coverRaw) : '';
  const year = f.year.value ? Number(f.year.value) : null;
  const price = f.price.value === '' ? NaN : Number(f.price.value);
  const rawgId = f.rawgId.value ? Number(f.rawgId.value) : null;

  if (!name) return 'Faltou o nome do jogo.';
  if (!pitch) return 'Conta em uma frase por que vale a pena jogar.';
  if (pitch.length > PITCH_MAX) return `O pitch passou de ${PITCH_MAX} caracteres. Enxuga um pouco.`;
  if (coverRaw && !cover) return 'O link da capa precisa começar com http:// ou https://.';
  if (year !== null && (!Number.isInteger(year) || year < 1950 || year > 2100)) return 'Ano esquisito. Confere aí.';
  if (!Number.isInteger(price) || price < 0 || price > 10000) return 'Preço em reais, número inteiro (0 se for grátis).';

  return {
    name,
    pitch,
    cover,
    year,
    genre: f.genre.value.trim(),
    duration: f.duration.value,
    mode: f.mode.value,
    price,
    platforms: [...form.querySelectorAll('input[name=platforms]:checked')].map((i) => i.value),
    rawgId: Number.isInteger(rawgId) ? rawgId : null,
  };
}

// ------------------------------------------------------------ RAWG

function bindRawg(form) {
  const input = form.querySelector('#rawg-q');
  const list = form.querySelector('#rawg-results');
  const hint = form.querySelector('#rawg-hint');
  let timer;
  let controller;
  let results = [];

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const term = input.value.trim();
    if (term.length < 3) {
      list.hidden = true;
      return;
    }
    // Espera a pessoa parar de digitar antes de chamar a API.
    timer = setTimeout(async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        results = await searchGames(term, controller.signal);
        list.innerHTML = results.length
          ? results.map((r, i) => `
              <li><button type="button" data-pick="${i}">
                ${safeUrl(r.cover) ? `<img src="${esc(r.cover)}" alt="" loading="lazy">` : '<img alt="">'}
                <span><strong>${esc(r.name)}</strong><br><span class="small muted">${esc([r.year, r.genre].filter(Boolean).join(' · '))}</span></span>
              </button></li>`).join('')
          : '<li class="small muted" style="padding:8px">Nada encontrado. Preenche à mão.</li>';
        list.hidden = false;
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.warn(error);
        list.hidden = true;
        hint.textContent = 'A busca não respondeu agora. Preenche à mão mesmo.';
      }
    }, 350);
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pick]');
    if (!button) return;
    const r = results[Number(button.dataset.pick)];
    const f = form.elements;
    f.name.value = r.name;
    f.cover.value = r.cover;
    f.year.value = r.year ?? '';
    f.genre.value = r.genre;
    f.rawgId.value = r.rawgId;
    form.querySelectorAll('input[name=platforms]').forEach((box) => (box.checked = r.platforms.includes(box.value)));
    list.hidden = true;
    input.value = '';
    toast(`Preenchido com ${r.name}. Agora o pitch é com você.`);
    f.pitch.focus();
  });
}
