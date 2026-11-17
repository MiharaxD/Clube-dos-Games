// Tela da rodada: cabeçalho (fase + faixa de etapas + ficha do sócio), painel do admin
// e o corpo da fase atual (sugerir, votar, jogar/encerrada).
import {
  changeStatus,
  createRound,
  getMyVotes,
  listAllComments,
  listAllVotes,
  listDateVotes,
  listDiario,
  listGames,
  listQuestions,
  listRatings,
  listRounds,
  listZerei,
} from '../api.js';
import { buildAnnouncement } from '../lib/announce.js';
import { icon } from '../lib/icons.js';
import { rankGames } from '../lib/tally.js';
import { STATUS_LABEL, STATUS_ORDER, confirmInline, copyText, esc, toast, withBusy } from '../lib/util.js';
import { ENTRA_RAPIDO, SAI, anim, calma } from '../lib/motion.js';
import { memberChip, memberName, phaseSteps, tv } from './parts.js';
import { renderSuggest } from './phases/suggest.js';
import { closeVoting, renderVote } from './phases/vote.js';
import { renderPlay } from './phases/play.js';

export async function renderRound(main, ctx) {
  const { session, params } = ctx;
  const rounds = await listRounds();
  const latest = rounds[0];
  const round = params[0] ? rounds.find((r) => r.id === params[0]) : latest;

  if (!round) {
    main.innerHTML = params[0]
      ? `<div class="empty" role="alert"><strong>Fita não encontrada</strong><p>Essa rodada não existe (ou foi devolvida). <a href="#/">Voltar pra rodada atual</a></p></div>`
      : noRoundYet(session);
    bindCreateRound(main, ctx, 1);
    return;
  }

  // ---------- carrega o que a fase precisa
  const uid = session.user.uid;
  const games = await listGames(round.id);
  const data = { round, games, members: session.members, uid, isLatest: round.id === latest.id };

  if (round.status === 'sugerindo' || round.status === 'votando') {
    // recados de todos os jogos: o balão com a foto de quem comentou e a pessoa ainda não viu
    data.comments = await listAllComments(round.id, games).catch(() => ({}));
  }
  if (round.status === 'votando') {
    data.myVotes = await getMyVotes(round.id, games, uid);
    // Voto secreto: só o admin lê todos os votos enquanto a votação está aberta.
    if (session.isAdmin) data.votesByGame = await listAllVotes(round.id, games);
  }
  if (round.status === 'jogando' || round.status === 'encerrada') {
    const [votesByGame, dateVotes, ratings, questions, zerei, diario] = await Promise.all([
      listAllVotes(round.id, games),
      listDateVotes(round.id),
      listRatings(round.id),
      listQuestions(round.id),
      listZerei(round.id),
      listDiario(round.id),
    ]);
    Object.assign(data, { votesByGame, dateVotes, ratings, questions, zerei, diario });
    data.ranking = rankGames(games, votesByGame);
  }

  data.me = session.member;
  const announce = async () => {
    const text = buildAnnouncement({
      round,
      games,
      ranking: data.ranking,
      ratings: data.ratings,
      nameOf: (id) => memberName(session.members, id),
    });
    toast((await copyText(text)) ? 'Mensagem copiada. É só colar no grupo.' : 'Não deu pra copiar.', 'ok');
  };
  const balcao = session.isAdmin && data.isLatest ? adminPanel(data) : '';
  const steps = phaseSteps(round.status);
  const next = todo(data);
  const cta = next.cta ? `<button class="btn btn--primary" type="button" data-cta="${next.cta.action}">${esc(next.cta.label)}</button>` : '';

  // ---------- jogando/encerrada: a mesa (faixa de pano no lugar do h1)
  if (round.status === 'jogando' || round.status === 'encerrada') {
    renderPlay(main, data, ctx, { steps, todo: next.main, cta, announce, balcao });
    if (balcao) bindAdmin(main, data, ctx);
    bindCta(main);
    return;
  }

  // ---------- sugerindo/votando: cabeçalho, faixa, ficha, TV e a prateleira
  const channel = String(round.number).padStart(2, '0');
  main.innerHTML = `
    <div class="rodada">
      <div class="cabeca">
        <h1>Fase ${esc(round.number)}</h1>
        <p>${subtitle(data)}${data.isLatest ? '' : ' · <a href="#/">ir pra rodada atual</a>'}</p>
      </div>
      ${steps}
      <section class="ficha" aria-labelledby="ficha-title">
        <span class="ficha__stamp">${esc(STATUS_LABEL[round.status])}</span>
        <h2 class="ficha__title" id="ficha-title">Ficha do sócio</h2>
        <p class="ficha__socio">Sócio: ${esc(session.member?.name ?? '')}</p>
        <p class="ficha__todo">${next.main}</p>
        ${next.extra ? `<p class="ficha__resto">${next.extra}</p>` : ''}
        <div class="actions">
          ${cta}
          ${session.isAdmin ? `<button class="btn" type="button" id="announce">${icon('copy')} Copiar mensagem pro grupo</button>` : ''}
        </div>
      </section>
      ${tv({ osd: `CH ${channel}`, title: `Fase ${round.number}`, line: round.status === 'sugerindo' ? 'Sugestões' : 'Votação' })}
      <section class="estante" id="phase"></section>
    </div>
    ${balcao}`;

  main.querySelector('#announce')?.addEventListener('click', announce);
  if (balcao) bindAdmin(main, data, ctx);

  const phase = main.querySelector('#phase');
  if (round.status === 'sugerindo') renderSuggest(phase, data, ctx);
  else renderVote(phase, data, ctx);
  bindCta(main);
}

// Botão principal da ficha / do bilhete: leva (ou abre) o lugar onde a ação da fase acontece,
// que fica várias telas abaixo no celular.
function bindCta(main) {
  main.querySelector('[data-cta]')?.addEventListener('click', (event) => {
    const suave = calma.matches ? 'auto' : 'smooth';
    const por = (sel) => main.querySelector(sel);
    switch (event.currentTarget.dataset.cta) {
      case 'form': { // abre a caixinha da sugestão (a vaga ou o estojo do próprio sócio)
        const slot = por('#slot-meu');
        slot?.scrollIntoView({ block: 'center' });
        slot?.querySelector('[data-add], [data-edit]')?.click();
        break;
      }
      case 'votar': { // foca o primeiro ticket ainda não votado
        const ticket = por('[data-vote][aria-pressed="false"]') ?? por('[data-vote]');
        ticket?.scrollIntoView({ block: 'center', behavior: suave });
        ticket?.focus({ preventScroll: true });
        break;
      }
      case 'nota': { // jogando: o slider fica inline na página
        const campo = por('#score');
        campo?.scrollIntoView({ block: 'center', behavior: suave });
        campo?.focus({ preventScroll: true });
        break;
      }
      case 'datas': por('[data-obj="cal-obj"]')?.click(); break;
      case 'quadro': por('[data-obj="quadro-obj"]')?.click(); break;
      default:
    }
  });
}

// ------------------------------------------------------------ textos da ficha

function subtitle({ round, games }) {
  const n = games.length;
  const jogos = `${n} ${n === 1 ? 'jogo' : 'jogos'} na prateleira`;
  if (round.status === 'jogando' || round.status === 'encerrada') return esc(round.winner?.name ?? '');
  return jogos;
}

// "O que falta você fazer": a próxima ação desta pessoa, nesta fase.
// cta = { action, label }: o botão principal que leva até onde a pessoa faz isso (ver bindCta).
function todo({ round, games, uid, myVotes, dateVotes, ratings }) {
  const line = (main, extra = '', cta = null) => ({ main, extra, cta });

  if (round.status === 'sugerindo') {
    const mine = games.some((g) => g.id === uid);
    return mine
      ? line('Sua sugestão já tá na prateleira.', 'Dá pra editar ou trocar até a votação abrir. Sem pressa.', { action: 'form', label: 'Editar minha sugestão' })
      : line('Bota sua sugestão na prateleira.', 'Um jogo por pessoa. Pode fazer com calma, a prateleira fica aberta até o admin abrir a votação.', { action: 'form', label: 'Adicionar minha sugestão' });
  }
  if (round.status === 'votando') {
    const others = games.filter((g) => g.id !== uid).length;
    return line(
      'Separa todo jogo que você toparia jogar.',
      `Você separou <strong id="vote-count">${myVotes.size}</strong> de ${others}. Vota quando puder e muda quando quiser, até o admin fechar. Ninguém vê seu voto antes disso.`,
      others ? { action: 'votar', label: 'Ver os jogos e votar' } : null,
    );
  }
  const hasRating = ratings.some((r) => r.id === uid);
  if (round.status === 'jogando') {
    const hasDates = dateVotes.some((d) => d.id === uid);
    if ((round.dateOptions?.length ?? 0) > 0 && !hasDates && !round.meetingDate) {
      return line('Falta você: marcar seus dias no calendário da mesa.', 'Toca no calendário.', { action: 'datas', label: 'Marcar meus dias' });
    }
    if (!hasRating) return line('Joga e depois prega sua resenha no quadro.', 'Dá pra mudar a nota até a rodada fechar e depois também.', { action: 'nota', label: 'Dar minha nota' });
    return line('Tudo certo por aqui.', 'Agora é jogar e trazer assunto pra reunião.');
  }
  return hasRating
    ? line('Rodada encerrada. Valeu! Sua resenha tá no quadro.')
    : line('Rodada encerrada. Ainda dá tempo da sua resenha: toca no quadro.', '', { action: 'quadro', label: 'Pregar minha resenha' });
}

// ------------------------------------------------------------ admin

function noRoundYet(session) {
  return `
    <div class="rodada rodada--vazia">
      <div class="cabeca"><h1>Clube dos Jogos</h1><p>Nenhuma fita na locadora ainda.</p></div>
      ${tv({ osd: 'CH 00', title: 'Sem sinal', line: 'Volte já' })}
      <div class="empty rodada__vazia">
        <strong>Prateleira vazia</strong>
        <p>${session.isAdmin ? 'Ainda não tem nenhuma rodada. Abre a primeira!' : 'Ainda não tem nenhuma rodada. Assim que o admin abrir a primeira, ela aparece aqui.'}</p>
        ${session.isAdmin ? '<div class="actions actions--center"><button class="btn btn--primary" id="new-round">Abrir a Fase 1</button></div>' : ''}
      </div>
    </div>`;
}

// Finalizar a encerrada: tudo da mesa voa pra cima antes de abrir a próxima fase.
function voaTudo(main) {
  const molas = [...main.querySelectorAll('.mesa .obj > .mola')];
  if (!molas.length || calma.matches) return Promise.resolve();
  main.querySelector('.mesa-sec').dataset.ocupado = '1';
  return Promise.all(molas.map((mola, i) => {
    const giro = (i % 2 ? -1 : 1) * (6 + (i * 5) % 12);
    return anim(mola, [
      { transform: 'none', easing: SAI },
      { transform: 'translateY(6px) scale(1.06, 0.9)', offset: 0.16, easing: 'cubic-bezier(0.3, 0, 0.6, 1)' },
      { transform: 'translateY(-30px) scale(0.94, 1.1)', offset: 0.3, easing: ENTRA_RAPIDO },
      { transform: `translateY(-1400px) rotateZ(${giro}deg) scale(0.97, 1.05)` },
    ], { duration: 900, delay: i * 90 });
  }));
}

function bindCreateRound(main, { refresh }, number, { finaliza = false } = {}) {
  main.querySelector('#new-round')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    if (finaliza && !(await confirmInline(button, `Finalizar a rodada? Ela vai pra estante e abre a Fase ${number}.`, 'Finalizar rodada'))) return;
    const ok = await withBusy(button, () => createRound(number).then(() => true));
    if (ok) {
      if (finaliza) await voaTudo(main);
      toast(`Fase ${number} aberta!`);
      location.hash = '#/';
      await refresh();
    }
  });
}

// Só o admin lê os votos durante "votando": quem aprovado ainda não marcou nenhum jogo.
function faltaVotar({ games, members, votesByGame = {}, uid }) {
  const votaram = new Set(Object.values(votesByGame).flat());
  // quem não tem em quem votar (só o próprio jogo na prateleira) não conta
  const podeVotar = (m) => games.some((g) => g.id !== m.id);
  const elegiveis = members.filter((m) => m.approved && podeVotar(m));
  const faltam = elegiveis.filter((m) => !votaram.has(m.id));
  if (!faltam.length) return '<p class="balcao__dica balcao__falta">Todo mundo já votou. Pode fechar.</p>';
  return `<div class="balcao__falta">
      <p class="balcao__dica">Falta${faltam.length === 1 ? '' : 'm'} votar <b>${faltam.length}</b> de ${elegiveis.length}:</p>
      <ul class="balcao__faltam">${faltam.map((m) => `<li>${memberChip(m)}${m.id === uid ? ' <small>(você)</small>' : ''}</li>`).join('')}</ul>
    </div>`;
}

function adminPanel(data) {
  const { round, games } = data;
  const i = STATUS_ORDER.indexOf(round.status);
  const buttons = [];

  if (round.status === 'sugerindo') {
    buttons.push(`<button class="btn btn--primary" data-status="votando" ${games.length < 2 ? 'disabled' : ''}>Abrir votação</button>`);
  }
  if (round.status === 'votando') {
    buttons.push('<button class="btn btn--primary" id="close-voting">Fechar votação e ver o vencedor</button>');
    buttons.push('<button class="btn btn--danger" data-status="sugerindo">Voltar pra sugestões</button>');
  }
  if (round.status === 'jogando') {
    buttons.push('<button class="btn btn--primary" data-status="encerrada">Encerrar rodada</button>');
    buttons.push('<button class="btn btn--danger" data-status="votando">Voltar pra votação</button>');
  }
  if (round.status === 'encerrada') {
    buttons.push(`<button class="btn btn--primary" id="new-round">Finalizar e abrir a Fase ${round.number + 1}</button>`);
    buttons.push('<button class="btn btn--danger" data-status="jogando">Reabrir rodada</button>');
  }

  const hint = round.status === 'sugerindo' && games.length < 2
    ? '<p class="balcao__dica">Precisa de pelo menos 2 jogos pra abrir a votação.</p>'
    : '';

  return `
    <section class="balcao" aria-labelledby="admin-title">
      <h2 class="panel__title" id="admin-title">Balcão do admin</h2>
      <p class="balcao__dica">Etapa <b>${i + 1} de 4</b>. Avance quando o grupo já tiver tido tempo.</p>
      <div class="balcao__acoes">${buttons.join('')}</div>
      ${hint}
      ${round.status === 'votando' ? faltaVotar(data) : ''}
    </section>`;
}

const CONFIRM_BACK = {
  sugerindo: (n) => `Voltar pra sugestões apaga ${n} ${n === 1 ? 'voto' : 'votos'} desta rodada. Continuar?`,
  votando: () => 'Voltar pra votação apaga o vencedor gravado (os votos continuam). Continuar?',
  jogando: () => 'Reabrir a rodada volta ela pra "Jogando". Continuar?',
};

function bindAdmin(main, data, ctx) {
  const { round, games } = data;
  bindCreateRound(main, ctx, round.number + 1, { finaliza: round.status === 'encerrada' });

  main.querySelector('#close-voting')?.addEventListener('click', (event) => closeVoting(data, ctx, event.currentTarget));

  main.querySelectorAll('[data-status]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = button.dataset.status;
      const goingBack = STATUS_ORDER.indexOf(target) < STATUS_ORDER.indexOf(round.status);
      if (goingBack) {
        const totalVotes = Object.values(data.votesByGame ?? {}).reduce((s, v) => s + v.length, 0);
        const label = { sugerindo: 'Voltar e apagar votos', votando: 'Voltar pra votação', jogando: 'Reabrir' }[target];
        if (!(await confirmInline(button, CONFIRM_BACK[target](totalVotes), label))) return;
      }
      const ok = await withBusy(button, () => changeStatus(round, target, { games }).then(() => true));
      if (ok) {
        toast(`Rodada agora em "${STATUS_LABEL[target]}".`);
        await ctx.refresh();
      }
    });
  });
}
