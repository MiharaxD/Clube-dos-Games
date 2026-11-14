// Fase "votando": votação por aprovação (marca todos que toparia jogar, menos o seu).
// A proibição de votar no próprio jogo é garantida nas firestore.rules; aqui a UI só explica.
import { castVote, changeStatus, listAllVotes, removeVote } from '../../api.js';
import { icon } from '../../lib/icons.js';
import { drawIndex, leaders, rankGames } from '../../lib/tally.js';
import { confirmInline, esc, toast, withBusy } from '../../lib/util.js';
import { gameBox, shelf } from '../parts.js';
import { spinRoulette } from '../roulette.js';

const SEPARADO = '<span class="stamp stamp--lime">Separado</span>';

export function renderVote(container, data) {
  const { games, members, uid, myVotes } = data;

  const boxes = games.map((g) => {
    if (g.id === uid) {
      return gameBox(g, members, {
        cls: 'is-mine is-locked',
        note: '<span class="note">esse é seu, calma</span>',
        actions: '<button class="btn btn--vote" disabled>Sua sugestão</button>',
      });
    }
    const voted = myVotes.has(g.id);
    return gameBox(g, members, {
      cls: voted ? 'is-voted' : '',
      stamp: voted ? SEPARADO : '',
      actions: voteButton(g, voted),
    });
  });

  container.innerHTML = `
    <section aria-labelledby="vote-title">
      <h2 id="vote-title">Na prateleira</h2>
      ${shelf(boxes.join(''))}
    </section>`;

  container.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-vote]');
    if (!button) return;
    const gameId = button.dataset.vote;
    const box = button.closest('.box');
    const voted = myVotes.has(gameId);

    const ok = await withBusy(button, () =>
      (voted ? removeVote(data.round.id, gameId, uid) : castVote(data.round.id, gameId, uid)).then(() => true),
    );
    if (!ok) return;

    // Atualiza só o card (sem recarregar a página) e bate o carimbo.
    if (voted) myVotes.delete(gameId);
    else myVotes.add(gameId);
    const game = games.find((g) => g.id === gameId);
    box.classList.toggle('is-voted', !voted);
    box.querySelector('.stamp')?.remove();
    if (!voted) {
      box.querySelector('.cover').insertAdjacentHTML('afterend', SEPARADO);
      box.querySelector('.stamp').classList.add('is-new');
    }
    button.outerHTML = voteButton(game, !voted);
    box.querySelector('[data-vote]').focus();
    const count = document.getElementById('vote-count');
    if (count) count.textContent = myVotes.size;
  });
}

function voteButton(game, voted) {
  return voted
    ? `<button class="btn btn--vote" data-vote="${esc(game.id)}" aria-pressed="true">${icon('check')} Separado<span class="sr-only"> pra mim: ${esc(game.name)}</span></button>`
    : `<button class="btn btn--vote" data-vote="${esc(game.id)}" aria-pressed="false">Topo jogar<span class="sr-only"> ${esc(game.name)}</span></button>`;
}

// ------------------------------------------------------------ admin: fechar votação

// Conta os votos no cliente. Vencedor único: grava direto. Empate: mostra a roleta.
export async function closeVoting(panel, data, ctx, button) {
  const { round, games } = data;
  const votesByGame = await listAllVotes(round.id, games); // lê de novo pra pegar votos recentes
  const ranking = rankGames(games, votesByGame);
  const top = leaders(ranking);
  const votes = ranking[0]?.count ?? 0;
  const plural = (n) => `${n} ${n === 1 ? 'voto' : 'votos'}`;

  if (top.length === 1) {
    const ok = await confirmInline(button, `Fechar a votação? "${top[0].name}" ganhou com ${plural(votes)}.`, 'Fechar e revelar');
    if (!ok) return;
    await saveWinner(top[0], null, data, ctx);
    return;
  }

  panel.innerHTML = `
    <div style="margin-top:16px">
      <h3>Empate entre ${top.length} jogos com ${plural(votes)} cada</h3>
      <p class="small muted">O sorteio é feito aqui e o resultado fica gravado na rodada.</p>
      <div id="roulette"></div>
      <div class="actions" style="margin-top:12px"><button class="btn btn--primary" id="spin">${icon('dice')} Sortear</button></div>
    </div>`;
  const stage = panel.querySelector('#roulette');
  spinRoulette(stage, top, null); // mostra os candidatos parados
  panel.querySelector('#spin').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    const winnerIndex = drawIndex(top.length);
    await spinRoulette(stage, top, winnerIndex);
    await saveWinner(top[winnerIndex], top.map((g) => g.id), data, ctx);
  });
}

async function saveWinner(game, tiedIds, data, ctx) {
  const extra = {
    winnerGameId: game.id,
    // Cópia do vencedor na rodada: a estante e o anúncio não precisam ler os jogos.
    winner: { name: game.name, cover: game.cover ?? '', suggestedBy: game.suggestedBy },
  };
  if (tiedIds) extra.tiebreak = { candidates: tiedIds };
  const ok = await withBusy(null, () => changeStatus(data.round, 'jogando', { extra }).then(() => true));
  if (ok) {
    toast(`Deu ${game.name}! Bora jogar.`);
    await ctx.refresh();
  }
}
