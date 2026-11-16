// Fase "sugerindo": a prateleira 3D com as sugestões; a sua vaga (ou o seu estojo) abre a caixinha
// que vira o formulário: passo 1 a capa (nome + imagem), passo 2 o manual (o resto). Ao finalizar,
// a tampa fecha, o carimbo SEU bate e a caixa volta pro nicho.
import { createGame, deleteGame, updateGame } from '../../api.js';
import { icon } from '../../lib/icons.js';
import { PLATFORMS } from '../../lib/platforms.js';
import { rawgEnabled, searchGames } from '../../lib/rawg.js';
import { SAI, anim, entrar, espera, sumir } from '../../lib/motion.js';
import { DURATION_LABEL, MODE_LABEL, confirmInline, esc, fmtPrice, fotoParaCapa, safeImgData, safeUrl, toast, withBusy } from '../../lib/util.js';
import { genericCover, memberName, stamp } from '../parts.js';
import { Estojo, openReading } from '../caixinha.js';
import { bindTilt, caseHtml, emptyCase, nicho, postit, rackHtml, vitrine } from '../rack.js';
import { bindTema, temaHtml } from '../tema.js';

const PITCH_MAX = 200;

export function renderSuggest(container, data, ctx) {
  const { games, members, uid } = data;
  const mine = games.find((g) => g.id === uid);
  const others = games.filter((g) => g !== mine);
  const meta = (g) => [g.year, g.genre].filter(Boolean).map(esc).join(' · ');

  const slotMine = mine
    ? `<li class="rack__slot" id="slot-meu" data-game="${esc(mine.id)}">${vitrine(nicho(caseHtml(mine, stamp('Seu', { tone: 'pink' }))), `Abrir a caixinha de ${esc(mine.name)}: manual e recados`)}
        <div class="rack__info">${postit(esc(mine.name), [meta(mine), 'sugestão sua'])}
          <div class="rack__acoes rack__acoes--meu">
            <button class="btn" type="button" data-edit>${icon('pencil')} Editar</button>
            <div class="actions"><button class="btn btn--danger btn--block" type="button" data-remove>Tirar da prateleira</button></div>
          </div>
        </div>
      </li>`
    : `<li class="rack__slot rack__slot--vaga" id="slot-meu">${nicho(emptyCase())}
        <div class="rack__info">${postit('Sua vaga', ['Um jogo por pessoa. Dá pra trocar até a votação abrir.'])}
          <div class="rack__acoes"><button class="btn btn--primary" type="button" data-add>${icon('plus')} Adicionar sugestão</button></div>
        </div>
      </li>`;
  const slotOther = (g) =>
    `<li class="rack__slot" data-game="${esc(g.id)}">${vitrine(nicho(caseHtml(g)), `Abrir a caixinha de ${esc(g.name)}: manual e recados`)}<div class="rack__info">${postit(esc(g.name), [meta(g), `sugestão de ${esc(memberName(members, g.suggestedBy))}`])}</div></li>`;

  container.innerHTML = `
    <h2 class="estante__titulo" id="shelf-title">Na prateleira</h2>
    <p class="estante__nota">${others.length || mine ? 'Um jogo por pessoa. Bota o seu e espia o dos outros.' : 'Ninguém sugeriu ainda. Abre os trabalhos!'}</p>
    ${temaHtml(data.round, ctx.session.isAdmin)}
    ${rackHtml([slotMine, ...others.map(slotOther)], 'Jogos sugeridos nesta rodada')}`;
  container.setAttribute('aria-labelledby', 'shelf-title');
  bindTilt(container.querySelector('.rack'));
  bindTema(container, data.round, ctx);

  // capinha: abre a caixinha em modo leitura (manual + recados), igual à votação
  container.querySelector('.rack').addEventListener('click', (event) => {
    const abrir = event.target.closest('[data-abrir]');
    if (!abrir) return;
    const slotEl = abrir.closest('.rack__slot');
    const game = games.find((g) => g.id === slotEl.dataset.game);
    if (!game) return;
    openReading({
      game, members, uid, fonte: slotEl.querySelector('.case'), gatilho: abrir,
      front: slotEl.querySelector('.case__front').innerHTML,
      recados: { roundId: data.round.id, isAdmin: ctx.session.isAdmin },
    });
  });

  const slot = container.querySelector('#slot-meu');
  const open = (button) => openForm(slot.querySelector('.case'), button, mine, data, ctx);
  container.querySelector('[data-add]')?.addEventListener('click', (e) => open(e.currentTarget));
  container.querySelector('[data-edit]')?.addEventListener('click', (e) => open(e.currentTarget));

  container.querySelector('[data-remove]')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    if (!(await confirmInline(button, `Tirar “${mine.name}” da prateleira?`, 'Tirar da prateleira'))) return;
    const ok = await withBusy(button, () => deleteGame(data.round.id, uid).then(() => true));
    if (ok) {
      toast('Sugestão removida. A vaga é sua de novo.');
      await ctx.refresh();
    }
  });
}

// ------------------------------------------------------------ caixinha-formulário

function frontHtml() {
  return `
    ${genericCover('')}
    <span class="tampa__vazia" aria-hidden="true"><span>Sua<br>vaga</span></span>
    <span class="tarja" data-tarja hidden></span>
    <span class="preco" data-preco hidden></span>
    <span class="carimbo carimbo--pink" data-carimbo hidden>Seu</span>
    <fieldset class="capa-escolha">
      <legend>Imagem da capa</legend>
      <div class="capa-escolha__opcoes" data-opcoes></div>
      <input class="campo-link" name="coverLink" type="url" inputmode="url" placeholder="https://… link da imagem" aria-label="Link da imagem da capa" hidden>
      <div class="capa-foto" data-foto hidden>
        <label class="btn btn--sm capa-foto__btn">${icon('upload')}<span data-foto-txt>Escolher imagem</span>
          <input class="sr-only" type="file" name="coverFile" accept="image/*"></label>
        <span class="capa-foto__dica" data-foto-dica>Vira capa 3:4 (corta o centro).</span>
      </div>
    </fieldset>
    <div class="placa">
      <label class="placa__rotulo" for="sg-nome">Nome do jogo</label>
      <input class="placa__input" id="sg-nome" name="name" autocomplete="off" maxlength="100" required
        placeholder="${rawgEnabled ? 'Digita pra buscar' : 'Nome do jogo'}" aria-describedby="sg-busca-status">
      ${rawgEnabled ? '<ul class="busca" data-busca aria-label="Jogos encontrados" hidden></ul>' : ''}
      <span class="sr-only" id="sg-busca-status" aria-live="polite">${rawgEnabled ? '' : 'Busca automática desligada. Preenche à mão mesmo.'}</span>
    </div>`;
}

function manualHtml(game = {}) {
  const has = new Set(game.platforms ?? []);
  const radios = (name, labels, value) =>
    Object.entries(labels).map(([v, label]) => `<label class="mchip mchip--radio"><input type="radio" name="${name}" value="${v}" ${v === value ? 'checked' : ''}><span>${label}</span></label>`).join('');
  return `
    <p class="manual__cabeca" aria-hidden="true"><span>Manual de instruções</span><span class="manual__pag">pág. 1</span></p>
    <p class="manual__jogo" data-manual-jogo>${esc(game.name || 'Seu jogo')}</p>
    <input type="hidden" name="rawgId" value="${esc(game.rawgId ?? '')}">
    <label class="mcampo"><span>Por que a gente deve jogar?</span>
      <textarea name="pitch" maxlength="${PITCH_MAX + 60}" rows="3" aria-describedby="sg-pitch-cont">${esc(game.pitch ?? '')}</textarea>
      <span class="mcampo__cont" id="sg-pitch-cont" aria-live="polite">0/${PITCH_MAX}</span>
    </label>
    <div class="mdupla">
      <label class="mcampo"><span>Ano</span><input name="year" type="number" inputmode="numeric" min="1950" max="2100" value="${esc(game.year ?? '')}"></label>
      <label class="mcampo"><span>Gênero</span><input name="genre" maxlength="60" value="${esc(game.genre ?? '')}"></label>
    </div>
    <fieldset class="mcampo"><legend>Tempo pra zerar</legend><div class="mchips">${radios('duration', DURATION_LABEL, game.duration ?? 'medio')}</div></fieldset>
    <fieldset class="mcampo"><legend>Modo</legend><div class="mchips">${radios('mode', MODE_LABEL, game.mode ?? 'solo')}</div></fieldset>
    <label class="mcampo"><span>Preço aproximado (R$)</span>
      <input name="price" type="number" inputmode="numeric" min="0" max="10000" step="1" value="${esc(game.price ?? '')}" aria-describedby="sg-preco-ajuda">
      <small id="sg-preco-ajuda">0 se for grátis.</small>
    </label>
    <fieldset class="mcampo"><legend>Plataformas</legend>
      <div class="mchips">${PLATFORMS.map((p) => `<label class="mchip"><input type="checkbox" name="platforms" value="${p}" ${has.has(p) ? 'checked' : ''}><span>${p}</span></label>`).join('')}</div>
    </fieldset>`;
}

async function openForm(fonte, gatilho, mine, data, ctx) {
  const cx = new Estojo({
    form: true,
    title: 'Sua sugestão: a capa',
    hint: rawgEnabled ? 'Busca o jogo e escolhe a capa. Depois a gente abre a caixinha.' : 'Escreve o nome e escolhe a capa. Depois a gente abre a caixinha.',
    front: frontHtml(),
    manual: manualHtml(mine),
    actions: `<button class="btn btn--ghost" type="button" data-cancelar hidden>Cancelar</button>
      <button class="btn" type="button" data-secundario>Cancelar</button>
      <button class="btn btn--primary" type="submit" data-primario>Avançar</button>`,
  });
  const form = cx.formEl;
  const f = form.elements;
  const q = (sel) => cx.el.querySelector(sel);
  const escolha = q('.capa-escolha');
  const placa = q('.placa');
  const vazia = q('.tampa__vazia');
  const link = f.coverLink;
  const btnPri = q('[data-primario]');
  const btnSec = q('[data-secundario]');
  const btnCancelar = q('[data-cancelar]');

  // estado da capa: 'rawg' (imagem da busca), 'gen' (caixa genérica), 'link' (URL colada)
  // ou 'foto' (enviada do aparelho, comprimida em data URL no próprio doc)
  const st = { passo: 1, capa: 'gen', rawgCover: '', foto: '', ocupado: false };
  const fotoBox = q('[data-foto]');
  const arquivo = f.coverFile;
  if (safeImgData(mine?.coverData)) Object.assign(st, { capa: 'foto', foto: mine.coverData });
  else if (mine?.cover) {
    if (mine.rawgId) Object.assign(st, { capa: 'rawg', rawgCover: mine.cover });
    else st.capa = 'link';
    link.value = st.capa === 'link' ? mine.cover : '';
  }
  f.name.value = mine?.name ?? '';
  vazia.hidden = Boolean(mine); // só a vaga nova sai vazia da prateleira
  cx.frente.classList.remove('vestida');

  const coverUrl = () => (st.capa === 'rawg' ? safeUrl(st.rawgCover) : st.capa === 'link' ? safeUrl(link.value.trim()) : '');
  const coverData = () => (st.capa === 'foto' ? safeImgData(st.foto) : '');

  // Seletor segmentado: rádios nativos (setas do teclado) com ícone + rótulo visível.
  function opcoesCapa() {
    const ops = [
      ...(st.rawgCover ? [{ v: 'rawg', rotulo: 'Busca', img: safeUrl(st.rawgCover) }] : []),
      { v: 'gen', rotulo: 'Genérica', txt: 'Aa' },
      { v: 'link', rotulo: 'Link', ico: 'link' },
      { v: 'foto', rotulo: 'Aparelho', ico: 'upload', img: safeImgData(st.foto) },
    ];
    if (!ops.some((o) => o.v === st.capa)) st.capa = 'gen';
    q('[data-opcoes]').innerHTML = ops.map((o) => {
      const sinal = o.img
        ? `<span class="amostra__mini" style="background-image: url(&quot;${esc(o.img)}&quot;)"></span>`
        : o.ico ? icon(o.ico) : `<span class="amostra__aa">${o.txt}</span>`;
      return `<label class="amostra"><input type="radio" name="capa" value="${o.v}" ${o.v === st.capa ? 'checked' : ''}>
        <span class="amostra__cara">${sinal}<span class="amostra__rotulo">${o.rotulo}</span></span></label>`;
    }).join('');
    mostraCampos();
  }
  // campo extra só da opção escolhida (link ou botão de enviar)
  function mostraCampos() {
    link.hidden = st.capa !== 'link';
    fotoBox.hidden = st.capa !== 'foto';
    q('[data-foto-txt]').textContent = st.foto ? 'Trocar imagem' : 'Escolher imagem';
  }

  // Repinta a capa da tampa, o rótulo do CD e o nome no manual.
  function pintaCapa() {
    const nome = f.name.value.trim();
    const capa = q('.tampa__frente > .capa');
    capa.outerHTML = genericCover(nome || 'Seu jogo');
    q('.tampa__frente > .cover__img')?.remove();
    const url = coverData() || coverUrl();
    if (url) q('.tampa__frente > .capa').insertAdjacentHTML('afterend', `<img class="cover__img" src="${esc(url)}" alt="" onerror="this.remove()">`);
    cx.setDisc(nome || 'Seu jogo', url);
    q('[data-manual-jogo]').textContent = nome || 'Seu jogo';
  }

  function contaPitch() {
    const n = f.pitch.value.length;
    const cont = q('#sg-pitch-cont');
    cont.textContent = `${n}/${PITCH_MAX}`;
    cont.classList.toggle('estourou', n > PITCH_MAX);
  }

  function passo(n) {
    st.passo = n;
    cx.frente.inert = n !== 1;
    cx.verso.inert = n !== 2;
    cx.titulo.textContent = n === 1 ? 'Sua sugestão: a capa' : 'Sua sugestão: o manual';
    cx.dica.textContent = n === 1
      ? (rawgEnabled ? 'Busca o jogo e escolhe a capa. Depois a gente abre a caixinha.' : 'Escreve o nome e escolhe a capa. Depois a gente abre a caixinha.')
      : 'Preenche o manual. Quando fechar a caixinha, ela vai pra prateleira.';
    btnPri.textContent = n === 1 ? 'Avançar' : 'Finalizar';
    btnSec.textContent = n === 1 ? 'Cancelar' : 'Voltar pra capa';
    btnCancelar.hidden = n === 1;
  }

  // Validação do manual (as mesmas regras valem no servidor, nas firestore.rules).
  function leManual() {
    const pitch = f.pitch.value.trim();
    const year = f.year.value ? Number(f.year.value) : null;
    const price = f.price.value === '' ? NaN : Number(f.price.value);
    const rawgId = f.rawgId.value ? Number(f.rawgId.value) : null;
    if (!pitch) return ['Conta em uma frase por que vale a pena jogar.', f.pitch];
    if (pitch.length > PITCH_MAX) return [`O pitch passou de ${PITCH_MAX} caracteres. Enxuga um pouco.`, f.pitch];
    if (year !== null && (!Number.isInteger(year) || year < 1950 || year > 2100)) return ['Ano esquisito. Confere aí.', f.year];
    if (!Number.isInteger(price) || price < 0 || price > 10000) return ['Preço em reais, número inteiro (0 se for grátis).', f.price];
    return {
      name: f.name.value.trim(),
      pitch,
      cover: coverUrl(),
      coverData: coverData(),
      year,
      genre: f.genre.value.trim(),
      duration: f.duration.value,
      mode: f.mode.value,
      price,
      platforms: [...form.querySelectorAll('input[name=platforms]:checked')].map((i) => i.value),
      rawgId: st.capa === 'rawg' && Number.isInteger(rawgId) ? rawgId : null,
    };
  }

  // ---------- coreografia
  opcoesCapa();
  pintaCapa();
  contaPitch();
  passo(1);
  cx.ocupado = true;
  await cx.voaDe(fonte, gatilho, [
    vazia.hidden ? null : anim(vazia, [{ opacity: 1 }, { opacity: 0 }], { duration: 240, delay: 520, easing: 'ease-out' }),
    entrar([escolha, placa], 560, 70),
  ]);
  cx.ocupado = false;
  cx.estojo.classList.add('plano');
  f.name.focus();

  async function avanca() {
    if (!f.name.value.trim()) return falha('Faltou o nome do jogo.', f.name);
    if (st.capa === 'link' && !coverUrl()) return falha('O link da capa precisa começar com http:// ou https://.', link);
    if (st.capa === 'foto' && !coverData()) return falha('Escolhe a imagem do aparelho (ou outra opção de capa).', arquivo);
    cx.ocupado = true;
    cx.erro.textContent = '';
    q('[data-busca]')?.setAttribute('hidden', '');
    await sumir([escolha, placa]);
    cx.estojo.classList.remove('plano');
    passo(2);
    const campos = [...cx.manual.children];
    await Promise.all([cx.abreTampa(), entrar(campos, 520, 40), entrar([cx.titulo, cx.dica], 0)]);
    cx.ocupado = false;
    f.pitch.focus({ preventScroll: true });
  }

  async function volta() {
    cx.ocupado = true;
    cx.erro.textContent = '';
    await cx.fechaTampa();
    passo(1);
    await Promise.all([entrar([escolha, placa], 0, 70), entrar([cx.titulo, cx.dica], 0)]);
    cx.ocupado = false;
    cx.estojo.classList.add('plano');
    f.name.focus();
  }

  // Finalizar: grava, fecha a tampa acelerando até o "clack", a capa ganha tarja e preço,
  // o carimbo SEU bate e a caixa voa de volta pro nicho.
  async function finaliza() {
    const dados = leManual();
    if (Array.isArray(dados)) return falha(...dados);
    cx.ocupado = true;
    cx.erro.textContent = '';
    btnPri.disabled = true;
    const saved = await withBusy(null, () =>
      (mine ? updateGame(data.round.id, data.uid, dados) : createGame(data.round.id, data.uid, dados)).then(() => true),
    );
    btnPri.disabled = false;
    if (!saved) {
      cx.ocupado = false;
      cx.erro.textContent = 'O servidor não aceitou. Confere os campos e tenta de novo.';
      return;
    }
    cx.frente.classList.add('vestida');
    [escolha, placa].forEach((el) => (el.style.opacity = '0'));
    await cx.fechaTampa(560, 'cubic-bezier(0.55, 0, 0.85, 0.35)');
    const tarja = q('[data-tarja]');
    const preco = q('[data-preco]');
    const carimbo = q('[data-carimbo]');
    tarja.textContent = `${DURATION_LABEL[dados.duration]} · ${MODE_LABEL[dados.mode]}`;
    preco.textContent = fmtPrice(dados.price);
    tarja.hidden = false;
    preco.hidden = false;
    await Promise.all([
      // squash do fechamento: o plástico bate e assenta
      anim(cx.corpo, [{ transform: 'none' }, { transform: 'scale(1.025, 0.985)', offset: 0.35 }, { transform: 'none' }], { duration: 220, easing: 'ease-out' }),
      anim(tarja, [{ transform: 'translateX(-24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: SAI }),
      anim(preco, [{ transform: 'translateY(-18px) rotate(-14deg)', opacity: 0 }, { transform: 'rotate(5deg)', opacity: 1 }], { duration: 280, delay: 80, easing: SAI }),
      espera(120).then(() => {
        carimbo.hidden = false;
        carimbo.classList.add('bate'); // em reduced-motion o CSS troca a batida por um fade curto
      }),
    ]);
    await espera(300);
    await cx.voaDeVolta(560);
    toast(mine ? 'Sugestão atualizada.' : 'Tá na prateleira!');
    await ctx.refresh();
  }

  async function cancela() {
    if (cx.ocupado) return;
    cx.ocupado = true;
    cx.erro.textContent = '';
    cx.estojo.classList.remove('plano');
    if (st.passo === 2) await cx.fechaTampa(440);
    await sumir([escolha, placa]);
    if (!vazia.hidden) await anim(vazia, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
    await cx.voaDeVolta(520);
  }

  function falha(msg, campo) {
    cx.erro.textContent = msg;
    cx.tremer();
    campo?.focus();
  }

  // ---------- eventos
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cx.ocupado) return;
    if (st.passo === 1) avanca();
    else finaliza();
  });
  btnSec.addEventListener('click', () => {
    if (cx.ocupado) return;
    if (st.passo === 1) cancela();
    else volta();
  });
  btnCancelar.addEventListener('click', cancela);
  cx.el.addEventListener('keydown', (e) => e.key === 'Escape' && cancela());
  cx.fundo.addEventListener('click', cancela);
  q('[data-opcoes]').addEventListener('change', (e) => {
    st.capa = e.target.value;
    mostraCampos();
    if (st.capa === 'link') link.focus();
    // primeira vez no "Aparelho": já abre o seletor de arquivo (o clique do usuário ainda vale)
    if (st.capa === 'foto' && !st.foto) arquivo.click();
    pintaCapa();
  });
  arquivo.addEventListener('change', async () => {
    const file = arquivo.files?.[0];
    arquivo.value = '';
    if (!file) return;
    const dica = q('[data-foto-dica]');
    dica.textContent = 'Encolhendo a imagem…';
    try {
      st.foto = await fotoParaCapa(file);
      st.capa = 'foto';
      dica.textContent = 'Pronto. Vira capa 3:4 (corta o centro).';
      opcoesCapa();
      pintaCapa();
    } catch (err) {
      console.error(err);
      dica.textContent = err?.message === 'nao-imagem' ? 'Isso não é imagem. Tenta um JPG ou PNG.' : 'Não deu pra usar essa imagem. Tenta outra.';
    }
  });
  link.addEventListener('input', pintaCapa);
  f.name.addEventListener('input', pintaCapa);
  f.pitch.addEventListener('input', contaPitch);
  if (rawgEnabled) bindRawg(cx, st, { opcoesCapa, pintaCapa });
}

// ------------------------------------------------------------ RAWG

// Busca no RAWG pela placa do nome; escolher um resultado preenche capa, ano, gênero e plataformas.
// Sem chave (rawgEnabled falso) ou com erro, segue no modo manual.
function bindRawg(cx, st, { opcoesCapa, pintaCapa }) {
  const form = cx.formEl;
  const f = form.elements;
  const input = f.name;
  const list = cx.el.querySelector('[data-busca]');
  const status = cx.el.querySelector('#sg-busca-status');
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
              <li><button class="busca__item" type="button" data-pick="${i}">
                <span class="busca__capa" ${safeUrl(r.cover) ? `style="background-image: url(&quot;${esc(safeUrl(r.cover))}&quot;)"` : ''} aria-hidden="true"></span>
                <span>${esc(r.name)}<small>${esc([r.year, r.genre].filter(Boolean).join(' · '))}</small></span>
              </button></li>`).join('')
          : '<li class="busca__vazio">Nada encontrado. Preenche à mão.</li>';
        list.hidden = false;
        status.textContent = results.length ? `${results.length} jogos encontrados.` : 'Nada encontrado.';
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.warn(error);
        list.hidden = true;
        status.textContent = 'A busca não respondeu agora. Preenche à mão mesmo.';
      }
    }, 350);
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pick]');
    if (!button) return;
    const r = results[Number(button.dataset.pick)];
    f.name.value = r.name;
    f.year.value = r.year ?? '';
    f.genre.value = r.genre ?? '';
    f.rawgId.value = r.rawgId ?? '';
    form.querySelectorAll('input[name=platforms]').forEach((box) => (box.checked = r.platforms.includes(box.value)));
    st.rawgCover = r.cover ?? '';
    st.capa = st.rawgCover ? 'rawg' : 'gen';
    list.hidden = true;
    opcoesCapa();
    pintaCapa();
    status.textContent = `Preenchido com ${r.name}.`;
    toast(`Preenchido com ${r.name}. Agora o pitch é com você.`);
    input.focus();
  });
}
