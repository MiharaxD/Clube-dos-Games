// Fases "jogando" e "encerrada" (rodada-jogando.html / rodada-encerrada.html): faixa de pano no
// lugar do h1, a mesa 3D (abajur, calendário, capinha com coroa, console; na encerrada o quadro de
// cortiça), a ficha do jogo, o placar da votação, as resenhas (notas), as perguntas e o balcão.
// Sem o botão ZEREI e as estatuetas dos mocks: "zerou" não existe no modelo de dados.
import {
  addQuestion,
  listBoard,
  deleteQuestion,
  saveDateVote,
  saveRating,
  updateQuestion,
  updateRound,
  updateRoundDates,
} from '../../api.js';
import { icon } from '../../lib/icons.js';
import { ENTRA_RAPIDO, NA_TELA, SAI, anim, calma, entrar } from '../../lib/motion.js';
import { average } from '../../lib/tally.js';
import { confirmInline, esc, fmtDateTime, fmtDay, fmtPrice, listJoin, safeUrl, toast, withBusy, DURATION_LABEL, MODE_LABEL } from '../../lib/util.js';
import { avatar, empty, memberName, stamp } from '../parts.js';
import { openReading } from '../caixinha.js';
import { caseFront } from '../rack.js';
import { coroaSvg, mesaSection, mountMesa } from '../mesa.js';
import { montaQuadro } from '../quadro.js';

const QUESTION_MAX = 300;

// Nota em estrelas: 5 estrelas com meia; no banco continua 0–10 (1 ponto = meia estrela).
const fmtEstrelas = (score) => String(Math.round(score) / 2).replace('.', ',');
const rotEstrelas = (score) => `${fmtEstrelas(score)} de 5 estrelas`;
function estrelas(score, extra = '') {
  const linha = icon('star').repeat(5);
  return `<span class="estrelas ${extra}" style="--p:${Math.round(score) * 10}%" role="img" aria-label="${rotEstrelas(score)}"><span class="estrelas__vazia" aria-hidden="true">${linha}</span><span class="estrelas__cheia" aria-hidden="true">${linha}</span></span>`;
}
const COMMENT_MAX = 1000;
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// main = <main>; extra = { todo, announce, steps, balcao } montados pelo round.js
export function renderPlay(main, data, ctx, extra) {
  const { round, games, members, uid } = data;
  const playing = round.status === 'jogando';
  const game = { ...(round.winner ?? {}), ...(games.find((g) => g.id === round.winnerGameId) ?? {}) };
  const canEdit = ctx.session.isAdmin && data.isLatest && playing;
  const tied = (round.tiebreak?.candidates ?? []).map((id) => games.find((g) => g.id === id)?.name).filter(Boolean);
  const front = caseFront(game, stamp(tied.length ? 'Sorteado' : 'Vencedor'));
  const mini = miniCalendar(data);
  const pages = ratingPages(data);

  const alvos = [{ obj: 'caso-obj', label: `Abrir a caixinha de ${esc(game.name)}: manual do jogo` }];
  if (playing) alvos.push({ obj: 'cal-obj', label: 'Abrir o calendário e marcar os dias que você pode na reunião' });
  else alvos.push({ obj: 'quadro-obj', label: 'Abrir o quadro de resenhas' });

  main.innerHTML = `
    <div class="rodada--mesa">
      <div class="cabeca">
        <div class="varal">
          <span class="varal__corda varal__corda--e" aria-hidden="true"></span>
          <span class="varal__corda varal__corda--d" aria-hidden="true"></span>
          <span class="banner-sombra" aria-hidden="true"></span>
          <h1 class="banner"><span>${playing ? 'Jogo escolhido' : 'Encerrado'}</span></h1>
        </div>
        <p>Fase ${esc(round.number)} · ${playing ? 'agora é jogar' : 'hora da resenha'}${data.isLatest ? '' : ` · <a href="#/">ir pra rodada atual</a>`}</p>
      </div>
      ${extra.steps}
      <div class="falta papel"><p>${extra.todo}</p>${extra.cta ?? ''}</div>
      ${mesaSection({ alvos })}
      ${infoSection(data, game, tied, ctx.session.isAdmin)}
      ${resultSection(data)}
    </div>
    ${playing ? `<section class="resenhas" aria-labelledby="quadro-titulo">${boardHtml(data, pages)}</section>` : ''}
    ${questionsSection(data, ctx)}
    ${canEdit ? adminForms(round) : ''}
    ${extra.balcao}`;

  const sec = main.querySelector('.mesa-sec');
  const notaMesa = playing
    ? (round.meetingDate ? `reunião ${fmtDateTime(round.meetingDate)}` : 'marca teus dias')
    : `${data.ratings.length} de ${members.filter((m) => m.approved).length} deram nota`;
  const mesa = mountMesa(sec, { fase: playing ? 'jogando' : 'encerrada', game, front, mini, pages, nota: notaMesa });

  // capinha da mesa → caixinha (manual do jogo, só leitura)
  sec.querySelector('[data-obj="caso-obj"]').addEventListener('click', (e) => {
    const fonte = mesa.mesa.querySelector('#caso-obj .m-estojo > .f');
    openReading({ game, members, uid, fonte, gatilho: e.currentTarget, front, coroa: coroaSvg('coroa-caixinha') });
  });
  sec.querySelector('[data-obj="cal-obj"]')?.addEventListener('click', (e) => openCalendar(e.currentTarget, mesa, data, ctx));
  sec.querySelector('[data-obj="quadro-obj"]')?.addEventListener('click', (e) => openBoard(e.currentTarget, mesa, data, ctx, pages));

  main.querySelector('[data-announce]')?.addEventListener('click', extra.announce);
  if (playing) bindRating(main.querySelector('.resenhas'), data, ctx);
  bindInfo(main, data, ctx);
  bindDates(main, data, ctx);
  bindQuestions(main, data, ctx);
  entrar(main.querySelectorAll('.falta, .info, .placar'), 120, 60);
}

// ------------------------------------------------------------ ficha do jogo + placar da votação

function infoSection({ round, members, ranking, me }, game, tied, isAdmin) {
  const votes = ranking.find((r) => r.game.id === round.winnerGameId)?.count ?? 0;
  const call = safeUrl(round.callLink);
  const mine = new Set(me?.platforms ?? []);
  const fatos = [
    ['Ano', game.year], ['Gênero', game.genre], ['Duração', DURATION_LABEL[game.duration]], ['Modo', MODE_LABEL[game.mode]],
    ['Preço', Number.isInteger(game.price) ? fmtPrice(game.price) : ''],
    ['Prazo pra jogar', round.deadline ? fmtDay(round.deadline) : 'sem prazo'],
    ['Reunião', round.meetingDate ? fmtDateTime(round.meetingDate) : 'data a decidir'],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  const by = memberName(members, game.suggestedBy);
  return `
    <section class="info" aria-labelledby="jogo-nome">
      <div class="info__topo">
        <h2 class="info__nome" id="jogo-nome">${esc(game.name)}</h2>
        <p class="info__por">Sugerido por <b>${esc(by)}</b> · ganhou com ${votes} ${votes === 1 ? 'voto' : 'votos'}</p>
        ${tied.length ? `<p class="info__por">Deu empate e saiu no sorteio entre ${esc(listJoin(tied))}.</p>` : ''}
      </div>
      <ul class="fatos">${fatos.map(([k, v]) => `<li class="fato"><span class="fato__rot">${k}</span><span class="fato__val">${esc(v)}</span></li>`).join('')}</ul>
      ${call ? `<p class="info__bloco"><a class="btn btn--primary" href="${esc(call)}" target="_blank" rel="noopener">${icon('link')} Entrar na call</a></p>` : ''}
      ${game.platforms?.length ? `
        <div class="info__bloco">
          <h3 class="painel__titulo">Onde jogar</h3>
          <ul class="plats">${game.platforms.map((p) => mine.has(p)
            ? `<li class="sua">${icon('check')}${esc(p)}<span class="sr-only"> (você tem)</span></li>`
            : `<li>${esc(p)}</li>`).join('')}</ul>
        </div>` : ''}
      ${game.pitch ? `
        <div class="info__bloco">
          <h3 class="painel__titulo">Por que jogar</h3>
          <figure class="pitch"><blockquote>${esc(game.pitch)}</blockquote><figcaption>${esc(by)}, quando sugeriu</figcaption></figure>
        </div>` : ''}
      ${isAdmin ? `<div class="info__bloco actions"><button class="btn" type="button" data-announce>${icon('copy')} Copiar mensagem pro grupo</button></div>` : ''}
    </section>`;
}

function resultSection({ round, ranking, members }) {
  const max = Math.max(1, ...ranking.map((r) => r.count));
  return `
    <section class="placar" aria-labelledby="result-title">
      <h2 class="painel__titulo" id="result-title">Como foi a votação</h2>
      <div class="tally">
        ${ranking.map((r) => `
          <div class="tally__row ${r.game.id === round.winnerGameId ? 'is-top' : ''}">
            <span><strong>${esc(r.game.name)}</strong> <span class="small muted">de ${esc(memberName(members, r.game.suggestedBy))}</span></span>
            <span class="tally__num">${r.count}</span>
            <span class="tally__bar" aria-hidden="true"><i style="width:${(r.count / max) * 100}%"></i></span>
            ${r.voters.length ? `<span class="small muted tally__quem">${r.voters.map((id) => esc(memberName(members, id))).join(', ')}</span>` : ''}
          </div>`).join('')}
      </div>
    </section>`;
}

// ------------------------------------------------------------ calendário (enquete de datas)

const dayOf = (iso) => iso.slice(0, 10);

// Miniatura da folha na mesa: mês da primeira data oferecida (ou o mês atual).
function miniCalendar({ round, dateVotes, uid }) {
  const options = round.dateOptions ?? [];
  const mine = new Set(dateVotes.find((d) => d.id === uid)?.dates ?? []);
  const ref = options.length ? new Date(`${dayOf(options[0])}T12:00`) : new Date();
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const inMonth = (iso) => {
    const d = new Date(`${dayOf(iso)}T12:00`);
    return d.getFullYear() === y && d.getMonth() === m;
  };
  const of = new Set(options.filter(inMonth).map((iso) => Number(iso.slice(8, 10))));
  const sel = new Set([...mine].filter(inMonth).map((iso) => Number(iso.slice(8, 10))));
  const n = new Set([...mine].map(dayOf)).size;
  return {
    mes: MESES[m], ano: y, ini: new Date(y, m, 1).getDay(), fim: new Date(y, m + 1, 0).getDate(), of, sel,
    nota: !options.length ? 'sem datas ainda' : n ? `${n} dia${n > 1 ? 's' : ''} seu${n > 1 ? 's' : ''}` : 'marca teus dias',
  };
}

const CIRCULO = '<svg class="dia__circulo" viewBox="0 0 60 50" preserveAspectRatio="none" aria-hidden="true"><path d="M8 26C6 12 20 5 33 5c14 0 23 8 22 19-1 13-13 21-27 20C14 43 5 35 8 22c1-4 4-7 7-9" fill="none" stroke="#b3213f" stroke-width="3" stroke-linecap="round"/></svg>';

// A folha do calendário: uma grade por mês com as datas oferecidas. Se algum dia tiver mais de
// um horário, cada horário vira um botão próprio embaixo da grade (o voto é por data+hora).
function folhaHtml({ round, dateVotes, uid }, picked) {
  const options = [...(round.dateOptions ?? [])].sort();
  const votersOf = (iso) => dateVotes.filter((d) => d.dates.includes(iso)).length;
  const byDay = new Map();
  options.forEach((iso) => byDay.set(dayOf(iso), [...(byDay.get(dayOf(iso)) ?? []), iso]));
  const months = [...new Set(options.map((iso) => iso.slice(0, 7)))];
  const multi = [...byDay.values()].some((l) => l.length > 1);

  const grids = months.map((ym) => {
    const [y, m] = ym.split('-').map(Number);
    const ini = new Date(y, m - 1, 1).getDay();
    const fim = new Date(y, m, 0).getDate();
    let cells = '<span class="dia"></span>'.repeat(ini);
    for (let d = 1; d <= fim; d++) {
      const key = `${ym}-${String(d).padStart(2, '0')}`;
      const list = byDay.get(key);
      if (!list) {
        cells += `<span class="dia" aria-hidden="true">${d}</span>`;
        continue;
      }
      const confirmed = list.includes(round.meetingDate);
      if (multi && list.length > 1) {
        cells += `<span class="dia dia--varios" aria-hidden="true">${d}</span>`;
        continue;
      }
      const iso = list[0];
      const on = picked.has(iso);
      cells += `<button class="dia dia--op" type="button" data-dia="${esc(iso)}" aria-pressed="${on}" ${round.status === 'jogando' ? '' : 'disabled'}>
        <span>${d}</span><span class="dia__qtd">${votersOf(iso)}</span>${CIRCULO}
        <span class="sr-only">${esc(fmtDateTime(iso))}, ${votersOf(iso)} ${votersOf(iso) === 1 ? 'pode' : 'podem'}${confirmed ? ', reunião marcada' : ''}</span></button>`;
    }
    return `<p class="folha__mesano">${MESES[m - 1]} ${y}</p>
      <div class="semana" aria-hidden="true"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div>
      <div class="grade" role="group" aria-label="Dias oferecidos em ${MESES[m - 1]}">${cells}</div>`;
  }).join('');

  const horarios = multi
    ? `<div class="folha__horarios" role="group" aria-label="Dias com mais de um horário">${[...byDay.values()].filter((l) => l.length > 1).flat().map((iso) => `
        <button class="horario" type="button" data-dia="${esc(iso)}" aria-pressed="${picked.has(iso)}" ${round.status === 'jogando' ? '' : 'disabled'}>
          ${esc(fmtDateTime(iso))} <span class="dia__qtd">${votersOf(iso)}</span></button>`).join('')}</div>`
    : '';
  const titulo = months.length ? MESES[Number(months[0].slice(5, 7)) - 1] : 'Calendário';
  return `
    <div class="folha__aros" aria-hidden="true"></div>
    <div class="folha__topo"><h2 class="folha__mes" tabindex="-1" data-titulo>${titulo}</h2><span class="folha__ano">${months[0]?.slice(0, 4) ?? ''}</span></div>
    <div class="folha__corpo">
      ${options.length
        ? `<p class="folha__dica">Os dias tracejados são os que o admin ofereceu. Circula os que você pode.</p>${grids}${horarios}
           <p class="folha__legenda">O número embaixo é quanta gente já topou.${round.meetingDate ? ` Reunião marcada: <strong>${esc(fmtDateTime(round.meetingDate))}</strong>.` : ' O admin marca a que juntar mais gente.'}</p>`
        : '<p class="folha__dica">O admin ainda não ofereceu datas pra reunião. Volta aqui depois.</p>'}
    </div>
    <div class="acoes">
      ${options.length && round.status === 'jogando' ? '<button class="btn btn--primary" type="button" data-salvar>Salvar meus dias</button>' : ''}
      <button class="btn" type="button" data-fechar>Fechar</button>
    </div>`;
}

async function openCalendar(gatilho, mesa, data, ctx) {
  const { round, dateVotes, uid } = data;
  const picked = new Set(dateVotes.find((d) => d.id === uid)?.dates ?? []);
  const modal = document.createElement('div');
  modal.className = 'modal modal--folha';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `<div class="modal__fundo" data-fechar></div><div class="folha papel">${folhaHtml(data, picked)}</div>`;
  modal.querySelector('[data-titulo]').id = 'cal-titulo';
  modal.setAttribute('aria-labelledby', 'cal-titulo');
  let board = [];
  try { board = await listBoard(data.round.id); } catch (err) { console.error(err); }
  const livre = montaQuadro(modal.querySelector('.ql'), { roundId: data.round.id, uid: data.uid, pages, board, pagina: pageHtml });
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const folha = modal.querySelector('.folha');
  const calObj = mesa.mesa.querySelector('#cal-obj');
  const mini = () => mesa.mesa.querySelector('[data-cal-frente]');
  const deMini = () => {
    const a = mini().getBoundingClientRect();
    const b = folha.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };
  document.getElementById('app').inert = true;
  document.documentElement.classList.add('trava');
  const longe = deMini();
  calObj.style.visibility = 'hidden';
  anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
  await anim(folha, [
    { transform: `${longe} rotateX(0deg)`, opacity: 0.6 },
    { opacity: 1, offset: 0.2 },
    { transform: 'translateY(-26px) scale(1.04) rotateX(-12deg)', offset: 0.66 },
    { transform: 'none', opacity: 1 },
  ], { duration: 580, easing: NA_TELA });
  const dias = [...folha.querySelectorAll('.dia--op')];
  dias.forEach((d, k) => anim(d, [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'none' }], { duration: 200, delay: k * 40, easing: SAI }));
  modal.querySelector('#cal-titulo').focus();

  let fechando = false;
  const fecha = async (salvou = false) => {
    if (fechando) return;
    fechando = true;
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
    await anim(folha, [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(-14px) scale(1.02) rotateX(-6deg)', offset: 0.25 },
      { transform: `${deMini()} rotateX(0deg)`, opacity: 1, offset: 0.9 },
      { transform: `${deMini()} rotateX(0deg)`, opacity: 0 },
    ], { duration: 440, easing: NA_TELA });
    calObj.style.visibility = '';
    modal.remove();
    document.getElementById('app').inert = false;
    document.documentElement.classList.remove('trava');
    gatilho.focus({ preventScroll: true });
    if (salvou) await ctx.refresh();
  };

  modal.addEventListener('click', async (e) => {
    const dia = e.target.closest('[data-dia]');
    if (dia && !dia.disabled) {
      const iso = dia.dataset.dia;
      if (picked.has(iso)) picked.delete(iso);
      else picked.add(iso);
      dia.setAttribute('aria-pressed', String(picked.has(iso)));
      return;
    }
    if (e.target.closest('[data-salvar]')) {
      const dates = [...picked].filter((d) => (round.dateOptions ?? []).includes(d)); // as rules só aceitam datas propostas
      const ok = await withBusy(e.target.closest('[data-salvar]'), () => saveDateVote(round.id, uid, dates).then(() => true));
      if (ok) {
        toast(dates.length ? 'Anotado. O admin marca a data que juntar mais gente.' : 'Sem dias marcados. Avisa quando souber.');
        fecha(true);
      }
      return;
    }
    if (e.target.closest('[data-fechar]')) fecha();
  });
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
}

// ------------------------------------------------------------ quadro de resenhas (notas)

const ROTQ = ['-2.4deg', '1.8deg', '-1deg', '2.6deg', '-1.8deg', '0.8deg', '-2.8deg', '1.2deg'];
const TACHAS = ['var(--amber)', 'var(--teal)', 'var(--pink)', 'var(--paper)'];

// Cada nota vira uma página de caderno pregada no quadro (resenha = comentário da nota).
function ratingPages({ ratings, members, uid }) {
  return [...ratings].sort((a, b) => b.score - a.score).map((r) => {
    const m = members.find((x) => x.id === r.id) ?? { name: 'Ex-sócio' };
    return { ...r, member: m, photo: m.photoURL, initial: (m.name ?? '?').trim().charAt(0).toUpperCase(), voce: r.id === uid };
  });
}

function pageHtml(p, i) {
  const comment = !p.comment
    ? '<p class="pagina__txt pagina__txt--vazia">Deu nota e não falou nada. Clássico.</p>'
    : p.spoiler
      ? `<details class="spoiler"><summary>${icon('eye')} <span class="spoiler__closed">Tem spoiler. Mostrar</span><span class="spoiler__open">Esconder spoiler</span></summary><p class="pagina__txt">${esc(p.comment)}</p></details>`
      : `<p class="pagina__txt">${esc(p.comment)}</p>`;
  return `<li class="pagina" style="--r:${ROTQ[i % ROTQ.length]};--tacha:${TACHAS[i % TACHAS.length]}">
    <span class="tacha" aria-hidden="true"></span>
    <div class="pagina__topo">${avatar(p.member, 'sm')}<p class="pagina__quem">${p.voce ? 'Você' : esc(p.member.name)}</p>
      ${estrelas(p.score, 'estrelas--pagina')}</div>
    ${comment}
  </li>`;
}

function boardHtml(data, pages) {
  const { ratings, uid } = data;
  const mine = ratings.find((r) => r.id === uid);
  const avg = average(ratings.map((r) => r.score));
  const score = mine?.score ?? 5;
  return `
    <div class="quadro"><div class="quadro__cortica">
      <h2 class="quadro__titulo" id="quadro-titulo" tabindex="-1"><span class="tacha" aria-hidden="true"></span><span class="tacha" aria-hidden="true"></span>Resenha</h2>
      <p class="quadro__media">${avg === null ? 'Ninguém deu nota ainda. Estreia o quadro!' : `${estrelas(avg, 'estrelas--media')} média de ${ratings.length} ${ratings.length === 1 ? 'nota' : 'notas'}`}</p>
      <ul class="quadro__grade">
        ${pages.map(pageHtml).join('')}
        ${formHtml(mine, score)}
      </ul>
    </div></div>`;
}

function formHtml(mine, score) {
  return `
        <li class="pagina pagina--nova papel">
          <form data-rating-form novalidate>
            <label class="pagina__rotulo" for="score">Sua nota</label>
            <div class="score-picker score-picker--estrelas">
              <div class="estrelas-in">
                ${estrelas(score, 'estrelas--grande')}
                <input type="range" id="score" name="score" min="0" max="10" step="1" value="${Math.round(score)}" aria-valuetext="${rotEstrelas(score)}" aria-describedby="score-out">
              </div>
              <output id="score-out" class="score-out" for="score">${fmtEstrelas(score)}</output>
            </div>
            <label class="sr-only" for="rating-comment">Sua resenha</label>
            <textarea class="campo-papel" id="rating-comment" name="comment" maxlength="${COMMENT_MAX}" placeholder="Opcional. O que achou?">${esc(mine?.comment ?? '')}</textarea>
            <label class="check check--papel"><input type="checkbox" name="spoiler" ${mine?.spoiler ? 'checked' : ''}> Tem spoiler (fica escondido até clicar)</label>
            <button class="btn btn--primary" type="submit">${mine ? 'Atualizar minha página' : 'Pregar no quadro'}</button>
          </form>
        </li>`;
}

function bindRating(root, data, ctx, after) {
  const form = root.querySelector('[data-rating-form]');
  const range = form.elements.score;
  const out = form.querySelector('#score-out');
  const vis = form.querySelector('.estrelas--grande');
  const mostra = () => {
    const v = Number(range.value);
    out.textContent = fmtEstrelas(v);
    vis.style.setProperty('--p', `${v * 10}%`);
    range.setAttribute('aria-valuetext', rotEstrelas(v));
  };
  range.addEventListener('input', mostra);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const score = Number(range.value);
    const comment = form.elements.comment.value.trim();
    const spoiler = form.elements.spoiler.checked;
    const ok = await withBusy(event.submitter, () => saveRating(data.round.id, data.uid, { score, comment, spoiler }).then(() => true));
    if (ok) {
      toast(`Nota de ${rotEstrelas(score)} pregada no quadro.`);
      // after devolve true quando já resolveu a tela (quadro livre fica aberto)
      if (after && (await after({ score, comment, spoiler }))) return;
      await ctx.refresh();
    }
  });
}

// Encerrada: o quadro da mesa vem pra frente (voo entre a projeção 3D e o quadro aberto).
async function openBoard(gatilho, mesa, data, ctx, pages) {
  const modal = document.createElement('div');
  modal.className = 'modal modal--quadro';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'quadro-titulo');
  const mine = data.ratings.find((r) => r.id === data.uid);
  modal.innerHTML = `<div class="modal__fundo"></div><div class="quadro-palco quadro-palco--livre"><div class="ql"></div>
    <ul class="ql-form">${formHtml(mine, mine?.score ?? 5)}</ul>
    <div class="modal__acoes"><button class="btn" type="button" data-fechar>Fechar o quadro</button></div></div>`;
  let board = [];
  try { board = await listBoard(data.round.id); } catch (err) { console.error(err); }
  const livre = montaQuadro(modal.querySelector('.ql'), { roundId: data.round.id, uid: data.uid, pages, board, pagina: pageHtml });
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const quadro = modal.querySelector('.quadro');
  const quadroObj = mesa.mesa.querySelector('#quadro-obj');
  const face = () => mesa.mesa.querySelector('#quadro-obj .m-quadro > .f');
  const deQuadro = () => {
    const a = face().getBoundingClientRect();
    const b = quadro.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };
  document.getElementById('app').inert = true;
  document.documentElement.classList.add('trava');
  const longe = deQuadro();
  quadroObj.style.visibility = 'hidden';
  anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
  const pags = [...modal.querySelectorAll('.ql-nota, .ql-form .pagina')];
  pags.forEach((p) => (p.style.opacity = calma.matches ? '' : '0'));
  await anim(quadro, [{ transform: longe }, { transform: 'none' }], { duration: 600, easing: NA_TELA });
  entrar(pags, 0, 50);
  entrar([modal.querySelector('.modal__acoes')], 120);
  modal.querySelector('#quadro-titulo').focus({ preventScroll: true });

  let fechando = false;
  const fecha = async () => {
    if (fechando) return;
    fechando = true;
    livre.fecha();
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
    await anim(quadro, [{ transform: 'none' }, { transform: deQuadro() }], { duration: 460, easing: NA_TELA });
    quadroObj.style.visibility = '';
    modal.remove();
    document.getElementById('app').inert = false;
    document.documentElement.classList.remove('trava');
    if (sujo) await ctx.refresh();
    else if (gatilho.isConnected) gatilho.focus({ preventScroll: true });
  };
  // salvar a nota não fecha o quadro: troca a página ali mesmo; a tela de trás atualiza ao fechar
  let sujo = false;
  bindRating(modal, data, ctx, async (nota) => {
    sujo = true;
    const resto = data.ratings.filter((r) => r.id !== data.uid);
    data.ratings = [...resto, { id: data.uid, ...nota }];
    livre.trocaNotas(ratingPages(data));
    modal.querySelector('[data-rating-form] [type="submit"]').textContent = 'Atualizar minha página';
    return true;
  });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-fechar]') || e.target === fundo || e.target === modal) fecha();
  });
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
}

// ------------------------------------------------------------ perguntas

function questionsSection({ questions, members, uid }, ctx) {
  const isAdmin = ctx.session.isAdmin;
  return `
    <section class="perguntas" aria-labelledby="questions-title">
      <h2 id="questions-title">Perguntas pra reunião</h2>
      <p class="muted">Qualquer sócio pode deixar uma pergunta pra puxar a conversa.</p>
      ${questions.length ? `<ol class="list questions">${questions.map((q) => `
        <li data-question="${esc(q.id)}">
          <div class="question__body">
            <p class="question__text">${esc(q.text)}</p>
            <p class="small muted">${esc(memberName(members, q.createdBy))}${q.updatedAt ? ' · editada' : ''}</p>
          </div>
          <span class="actions">
            ${q.createdBy === uid ? `<button class="btn btn--ghost btn--icon" data-edit-q>${icon('pencil')}<span class="sr-only">Editar pergunta</span></button>` : ''}
            ${q.createdBy === uid || isAdmin ? `<button class="btn btn--ghost btn--icon" data-delete-q>${icon('trash')}<span class="sr-only">Apagar pergunta</span></button>` : ''}
          </span>
        </li>`).join('')}</ol>` : empty('Nenhuma pergunta ainda', 'Qual foi a parte que mais te pegou? Começa por aí.')}
      <form class="form perguntas__form" id="question-form">
        <label class="field"><span>Nova pergunta</span>
          <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required placeholder="Ex.: o final fez sentido pra você?"></textarea>
        </label>
        <div class="actions"><button class="btn btn--primary" type="submit">Adicionar pergunta</button></div>
      </form>
    </section>`;
}

function bindQuestions(container, data, ctx) {
  const roundId = data.round.id;
  container.querySelector('#question-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = event.currentTarget.elements.text.value.trim();
    if (!text) return;
    const ok = await withBusy(event.submitter, () => addQuestion(roundId, data.uid, text).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.querySelector('.perguntas').addEventListener('click', async (event) => {
    const item = event.target.closest('[data-question]');
    if (!item) return;
    const id = item.dataset.question;
    const question = data.questions.find((q) => q.id === id);

    const deleteBtn = event.target.closest('[data-delete-q]');
    if (deleteBtn) {
      if (!(await confirmInline(deleteBtn, 'Apagar essa pergunta?', 'Apagar'))) return;
      const ok = await withBusy(null, () => deleteQuestion(roundId, id).then(() => true));
      if (ok) await ctx.refresh();
    }

    if (event.target.closest('[data-edit-q]')) {
      // Edição no lugar: troca o texto por um campo.
      item.querySelector('.question__body').innerHTML = `
        <form class="form" data-edit-form>
          <label class="field"><span class="sr-only">Editar pergunta</span>
            <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required>${esc(question.text)}</textarea>
          </label>
          <div class="actions">
            <button class="btn btn--primary btn--sm" type="submit">Salvar</button>
            <button class="btn btn--sm" type="button" data-cancel>Cancelar</button>
          </div>
        </form>`;
      item.querySelector('textarea').focus();
      item.querySelector('[data-cancel]').addEventListener('click', () => ctx.refresh());
      item.querySelector('[data-edit-form]').addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
        const text = submitEvent.currentTarget.elements.text.value.trim();
        if (!text) return;
        const ok = await withBusy(submitEvent.submitter, () => updateQuestion(roundId, id, text).then(() => true));
        if (ok) await ctx.refresh();
      });
    }
  });
}

// ------------------------------------------------------------ admin: prazo, call e datas

function adminForms(round) {
  const options = round.dateOptions ?? [];
  return `
    <section class="balcao balcao--largo" aria-labelledby="admin-info-title">
      <h2 class="panel__title" id="admin-info-title">Prazo, call e datas</h2>
      <form class="form" id="info-form">
        <div class="field-row">
          <label class="field"><span>Prazo pra jogar</span>
            <input class="input" type="date" name="deadline" value="${esc(round.deadline ?? '')}">
          </label>
          <label class="field"><span>Link da call</span>
            <input class="input" type="url" name="callLink" placeholder="https://meet…" value="${esc(round.callLink ?? '')}">
          </label>
        </div>
        <div class="actions"><button class="btn btn--primary" type="submit">Salvar prazo e call</button></div>
      </form>
      ${options.length ? `<ul class="list balcao__datas">${options.map((date) => `
        <li class="${round.meetingDate === date ? 'is-confirmed' : ''}">
          <span>${esc(fmtDateTime(date))}${round.meetingDate === date ? ' <span class="pill">Marcada</span>' : ''}</span>
          <span class="actions">
            ${round.meetingDate === date ? '' : `<button class="btn btn--sm" type="button" data-confirm-date="${esc(date)}">Marcar esta</button>`}
            <button class="btn btn--ghost btn--icon" type="button" data-remove-date="${esc(date)}">${icon('trash')}<span class="sr-only">Remover opção ${esc(fmtDateTime(date))}</span></button>
          </span>
        </li>`).join('')}</ul>` : '<p class="muted">Nenhuma data oferecida ainda.</p>'}
      <form class="form" id="add-date">
        <label class="field"><span>Oferecer nova data</span>
          <input class="input" type="datetime-local" name="date" required>
        </label>
        <div class="actions"><button class="btn btn--primary" type="submit">Adicionar data</button></div>
      </form>
    </section>`;
}

function bindInfo(container, data, ctx) {
  const form = container.querySelector('#info-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deadline = form.elements.deadline.value;
    const rawLink = form.elements.callLink.value.trim();
    const callLink = rawLink ? safeUrl(rawLink) : '';
    if (rawLink && !callLink) return toast('O link da call precisa começar com https://', 'error');
    const ok = await withBusy(form.querySelector('[type=submit]'), () => updateRound(data.round.id, { deadline, callLink }).then(() => true));
    if (ok) {
      toast('Prazo e call salvos.');
      await ctx.refresh();
    }
  });
}

function bindDates(container, data, ctx) {
  const { round } = data;
  const options = round.dateOptions ?? [];
  container.querySelector('#add-date')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = event.currentTarget.elements.date.value; // "2026-12-05T20:00"
    if (!date) return;
    if (options.includes(date)) return toast('Essa data já tá na lista.', 'error');
    if (options.length >= 20) return toast('Já tem 20 datas. Remove alguma antes.', 'error');
    const next = [...options, date].sort();
    const ok = await withBusy(event.submitter, () => updateRoundDates(round.id, next, round.meetingDate).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.querySelector('.balcao__datas')?.addEventListener('click', async (event) => {
    const confirmBtn = event.target.closest('[data-confirm-date]');
    const removeBtn = event.target.closest('[data-remove-date]');
    if (confirmBtn) {
      const date = confirmBtn.dataset.confirmDate;
      const ok = await withBusy(confirmBtn, () => updateRoundDates(round.id, options, date).then(() => true));
      if (ok) {
        toast(`Reunião marcada: ${fmtDateTime(date)}.`);
        await ctx.refresh();
      }
    }
    if (removeBtn) {
      const date = removeBtn.dataset.removeDate;
      if (!(await confirmInline(removeBtn, `Remover ${fmtDateTime(date)} da enquete?`, 'Remover data'))) return;
      const meeting = round.meetingDate === date ? null : round.meetingDate;
      const ok = await withBusy(removeBtn, () => updateRoundDates(round.id, options.filter((d) => d !== date), meeting).then(() => true));
      if (ok) await ctx.refresh();
    }
  });
}

