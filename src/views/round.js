// Tela da rodada: cabeçalho (fase + faixa de etapas + ficha do sócio), painel do admin
// e o corpo da fase atual (sugerir, votar, jogar/encerrada).
import {
  changeStatus,
  createRound,
  getMyVotes,
  listAllVotes,
  listDateVotes,
  listGames,
  listQuestions,
  listRatings,
  listRounds,
} from '../api.js';
import { buildAnnouncement } from '../lib/announce.js';
import { icon } from '../lib/icons.js';
import { rankGames } from '../lib/tally.js';
import { STATUS_LABEL, STATUS_ORDER, copyText, esc, toast, withBusy } from '../lib/util.js';
import { memberName, phaseSteps } from './parts.js';
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
      ? `<div class="empty"><strong>Fita não encontrada</strong><p>Essa rodada não existe. <a href="#/">Voltar pra rodada atual</a></p></div>`
      : noRoundYet(session);
    bindCreateRound(main, ctx, 1);
    return;
  }

  // ---------- carrega o que a fase precisa
  const uid = session.user.uid;
  const games = await listGames(round.id);
  const data = { round, games, members: session.members, uid, isLatest: round.id === latest.id };

  if (round.status === 'votando') {
    data.myVotes = await getMyVotes(round.id, games, uid);
    // Voto secreto: só o admin lê todos os votos enquanto a votação está aberta.
    if (session.isAdmin) data.votesByGame = await listAllVotes(round.id, games);
  }
  if (round.status === 'jogando' || round.status === 'encerrada') {
    const [votesByGame, dateVotes, ratings, questions] = await Promise.all([
      listAllVotes(round.id, games),
      listDateVotes(round.id),
      listRatings(round.id),
      listQuestions(round.id),
    ]);
    Object.assign(data, { votesByGame, dateVotes, ratings, questions });
    data.ranking = rankGames(games, votesByGame);
  }

  // ---------- cabeçalho
  main.innerHTML = `
    <div class="page-head">
      <h1>Fase ${esc(round.number)}</h1>
      <p class="muted">${subtitle(data)}</p>
    </div>
    ${data.isLatest ? '' : `<p class="muted" style="margin-bottom:12px">Você está vendo uma rodada antiga. <a href="#/">Ir pra rodada atual</a></p>`}
    ${phaseSteps(round.status)}
    <section class="ficha" aria-labelledby="ficha-title">
      <span class="ficha__stamp">${esc(STATUS_LABEL[round.status])}</span>
      <h2 class="ficha__title" id="ficha-title">Ficha do sócio</h2>
      ${todo(data)}
      <div class="actions">
        <button class="btn btn--sm" id="announce">${icon('copy')} Copiar mensagem pro grupo</button>
      </div>
    </section>
    ${session.isAdmin && data.isLatest ? adminPanel(data) : ''}
    <div id="phase"></div>`;

  main.querySelector('#announce').addEventListener('click', async () => {
    const text = buildAnnouncement({
      round,
      games,
      ranking: data.ranking,
      ratings: data.ratings,
      nameOf: (id) => memberName(session.members, id),
    });
    toast((await copyText(text)) ? 'Mensagem copiada. É só colar no grupo.' : 'Não deu pra copiar.', 'ok');
  });

  if (session.isAdmin && data.isLatest) bindAdmin(main, data, ctx);

  // ---------- corpo da fase
  const phase = main.querySelector('#phase');
  if (round.status === 'sugerindo') renderSuggest(phase, data, ctx);
  else if (round.status === 'votando') renderVote(phase, data, ctx);
  else renderPlay(phase, data, ctx);
}

// ------------------------------------------------------------ textos da ficha

function subtitle({ round, games }) {
  const n = games.length;
  const jogos = `${n} ${n === 1 ? 'jogo' : 'jogos'} na prateleira`;
  if (round.status === 'jogando' || round.status === 'encerrada') return esc(round.winner?.name ?? '');
  return jogos;
}

// "O que falta você fazer": a próxima ação desta pessoa, nesta fase.
function todo({ round, games, uid, myVotes, dateVotes, ratings }) {
  const line = (main, extra = '') =>
    `<p class="ficha__todo">${main}</p>${extra ? `<p>${extra}</p>` : ''}`;

  if (round.status === 'sugerindo') {
    const mine = games.some((g) => g.id === uid);
    return mine
      ? line('Sua sugestão já tá na prateleira.', 'Dá pra editar ou trocar até a votação abrir. Sem pressa.')
      : line('Bota sua sugestão na prateleira.', 'Um jogo por pessoa. Pode fazer com calma, a prateleira fica aberta até o admin abrir a votação.');
  }
  if (round.status === 'votando') {
    const others = games.filter((g) => g.id !== uid).length;
    return line(
      'Separa todo jogo que você toparia jogar.',
      `Você separou <strong id="vote-count">${myVotes.size}</strong> de ${others}. Vota quando puder e muda quando quiser, até o admin fechar. Ninguém vê seu voto antes disso.`,
    );
  }
  const hasRating = ratings.some((r) => r.id === uid);
  if (round.status === 'jogando') {
    const hasDates = dateVotes.some((d) => d.id === uid);
    if ((round.dateOptions?.length ?? 0) > 0 && !hasDates && !round.meetingDate) {
      return line('Marca as datas que você pode pra reunião.', 'Lá embaixo, na enquete de datas.');
    }
    if (!hasRating) return line('Joga e depois deixa sua nota.', 'Dá pra mudar a nota até a rodada fechar e depois também.');
    return line('Tudo certo por aqui.', 'Agora é jogar e trazer assunto pra reunião.');
  }
  return hasRating
    ? line('Rodada encerrada. Valeu!', 'Sua nota tá registrada. Dá uma olhada nas perguntas e comentários.')
    : line('Rodada encerrada. Ainda dá tempo da sua nota.', 'Lá embaixo, em "Notas".');
}

// ------------------------------------------------------------ admin

function noRoundYet(session) {
  return `
    <div class="page-head"><h1>Clube dos Jogos</h1></div>
    <div class="empty">
      <strong>Prateleira vazia</strong>
      <p>${session.isAdmin ? 'Ainda não tem nenhuma rodada. Abre a primeira!' : 'Ainda não tem nenhuma rodada. Assim que o admin abrir a primeira, ela aparece aqui.'}</p>
      ${session.isAdmin ? '<p style="margin-top:12px"><button class="btn btn--primary" id="new-round">Abrir a Fase 1</button></p>' : ''}
    </div>`;
}

function bindCreateRound(main, { refresh }, number) {
  main.querySelector('#new-round')?.addEventListener('click', async (event) => {
    const ok = await withBusy(event.currentTarget, () => createRound(number).then(() => true));
    if (ok) {
      toast(`Fase ${number} aberta!`);
      location.hash = '#/';
      await refresh();
    }
  });
}

function adminPanel({ round, games }) {
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
    buttons.push(`<button class="btn btn--primary" id="new-round">Abrir a Fase ${round.number + 1}</button>`);
    buttons.push('<button class="btn btn--danger" data-status="jogando">Reabrir rodada</button>');
  }

  const hint = round.status === 'sugerindo' && games.length < 2
    ? '<p class="small muted" style="margin-top:8px">Precisa de pelo menos 2 jogos pra abrir a votação.</p>'
    : '';

  return `
    <section class="panel panel--admin" aria-labelledby="admin-title">
      <h2 class="panel__title" id="admin-title">Balcão do admin</h2>
      <p class="small muted" style="margin-bottom:10px">Etapa ${i + 1} de 4. Avance quando o grupo já tiver tido tempo.</p>
      <div class="actions">${buttons.join('')}</div>
      ${hint}
      <div id="tie"></div>
    </section>`;
}

const CONFIRM_BACK = {
  sugerindo: (n) => `Voltar pra sugestões apaga ${n} ${n === 1 ? 'voto' : 'votos'} desta rodada. Continuar?`,
  votando: () => 'Voltar pra votação apaga o vencedor gravado (os votos continuam). Continuar?',
  jogando: () => 'Reabrir a rodada volta ela pra "Jogando". Continuar?',
};

function bindAdmin(main, data, ctx) {
  const { round, games } = data;
  bindCreateRound(main, ctx, round.number + 1);

  main.querySelector('#close-voting')?.addEventListener('click', () => closeVoting(main.querySelector('#tie'), data, ctx));

  main.querySelectorAll('[data-status]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = button.dataset.status;
      const goingBack = STATUS_ORDER.indexOf(target) < STATUS_ORDER.indexOf(round.status);
      if (goingBack) {
        const totalVotes = Object.values(data.votesByGame ?? {}).reduce((s, v) => s + v.length, 0);
        if (!confirm(CONFIRM_BACK[target](totalVotes))) return;
      }
      const ok = await withBusy(button, () => changeStatus(round, target, { games }).then(() => true));
      if (ok) {
        toast(`Rodada agora em "${STATUS_LABEL[target]}".`);
        await ctx.refresh();
      }
    });
  });
}
