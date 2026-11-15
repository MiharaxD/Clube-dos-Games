// Fase "votando": votação por aprovação na prateleira 3D. Votar rasga o ticket no picote e cola a
// etiqueta VOTADO na capa; o canhoto que sobra desfaz. Clicar na capinha abre a caixinha (manual).
// A proibição de votar no próprio jogo é garantida nas firestore.rules; aqui a UI só explica.
import { castVote, changeStatus, listAllVotes, removeVote } from '../../api.js';
import { icon } from '../../lib/icons.js';
import { calma } from '../../lib/motion.js';
import { drawIndex, leaders, rankGames } from '../../lib/tally.js';
import { confirmInline, esc, toast, withBusy } from '../../lib/util.js';
import { memberName, stamp } from '../parts.js';
import { openReading } from '../caixinha.js';
import { bindTilt, caseHtml, nicho, postit, rackHtml, vitrine } from '../rack.js';
import { spinRoulette } from '../roulette.js';

const ETIQUETA = '<span class="etiqueta" data-etiqueta hidden>Votado</span>';

export function renderVote(container, data) {
  const { games, members, uid, myVotes } = data;
  const meta = (g) => [g.year, g.genre].filter(Boolean).map(esc).join(' · ');

  const slots = games.map((g, i) => {
    const num = String(i + 1).padStart(4, '0');
    if (g.id === uid) {
      return `<li class="rack__slot" data-game="${esc(g.id)}">
        ${vitrine(nicho(caseHtml(g, `${stamp('Seu', { tone: 'pink' })}<span class="bilhete">esse é seu, calma</span>`)), `Abrir a caixinha de ${esc(g.name)}`)}
        <div class="rack__info">${postit(esc(g.name), [meta(g), 'sugestão sua <span class="sr-only">(esse é seu, calma)</span>'])}
          <div class="rack__acoes">
            <button class="ticket" type="button" disabled>
              <span class="ticket__canhoto" aria-hidden="true"><span class="ticket__num">Nº 00</span></span>
              <span class="ticket__corpo"><b>Sua sugestão</b></span>
            </button>
          </div>
        </div>
      </li>`;
    }
    const voted = myVotes.has(g.id);
    return `<li class="rack__slot" data-game="${esc(g.id)}">
      ${vitrine(nicho(caseHtml(g, voted ? ETIQUETA.replace(' hidden', '') : ETIQUETA)), `Abrir a caixinha de ${esc(g.name)}: manual do jogo`)}
      <div class="rack__info">${postit(esc(g.name), [meta(g), `sugestão de ${esc(memberName(members, g.suggestedBy))}`])}
        <div class="rack__acoes">
          <button class="ticket" type="button" aria-pressed="${voted}" data-vote="${esc(g.id)}">
            <span class="sr-only">Votar em ${esc(g.name)}</span>
            <span class="ticket__canhoto" aria-hidden="true"><span class="ticket__num">Nº ${num}</span><span class="ticket__feito"><b>Votado</b><small>desfazer</small></span></span>
            <span class="ticket__corpo" aria-hidden="true"><b>Votar</b><small>admite 1</small></span>
          </button>
        </div>
      </div>
    </li>`;
  });

  container.innerHTML = `
    <h2 class="estante__titulo" id="shelf-title">Na prateleira</h2>
    <p class="estante__nota">Marca todos que você toparia jogar. O mais votado vira o jogo da rodada. Toca na capinha pra ler o manual.</p>
    ${rackHtml(slots, 'Jogos sugeridos nesta rodada')}`;
  container.setAttribute('aria-labelledby', 'shelf-title');
  const rack = container.querySelector('.rack');
  bindTilt(rack);

  const countVotes = () => {
    const count = document.getElementById('vote-count');
    if (count) count.textContent = myVotes.size;
  };

  rack.addEventListener('click', async (event) => {
    // capinha: abre a caixinha em modo leitura
    const abrir = event.target.closest('[data-abrir]');
    if (abrir) {
      const slot = abrir.closest('.rack__slot');
      const game = games.find((g) => g.id === slot.dataset.game);
      const fonte = slot.querySelector('.case');
      openReading({ game, members, uid, fonte, gatilho: abrir, front: slot.querySelector('.case__front').innerHTML });
      return;
    }

    const ticket = event.target.closest('[data-vote]');
    if (!ticket || ticket.disabled || ticket.classList.contains('rasgando')) return;
    const gameId = ticket.dataset.vote;
    const label = ticket.closest('.rack__slot').querySelector('[data-etiqueta]');
    const body = ticket.querySelector('.ticket__corpo');
    const voted = myVotes.has(gameId);
    body.classList.remove('volta');

    if (voted) {
      // desfazer: o ticket volta inteiro e a etiqueta sai
      const ok = await withBusy(ticket, () => removeVote(data.round.id, gameId, uid).then(() => true));
      if (!ok) return;
      myVotes.delete(gameId);
      ticket.setAttribute('aria-pressed', 'false');
      label.hidden = true;
      label.classList.remove('cola');
      if (!calma.matches) {
        void body.offsetWidth;
        body.classList.add('volta');
      }
      countVotes();
      ticket.focus();
      return;
    }

    // votar: grava enquanto o ticket rasga; se o servidor recusar, o corpo volta
    const rasgou = new Promise((resolve) => {
      if (calma.matches) return resolve();
      ticket.classList.add('rasgando');
      body.addEventListener('animationend', resolve, { once: true });
    });
    const ok = await withBusy(null, () => castVote(data.round.id, gameId, uid).then(() => true));
    await rasgou;
    ticket.classList.remove('rasgando');
    if (!ok) {
      if (!calma.matches) body.classList.add('volta');
      return;
    }
    myVotes.add(gameId);
    ticket.setAttribute('aria-pressed', 'true');
    label.hidden = false;
    label.classList.remove('cola');
    if (!calma.matches) {
      void label.offsetWidth;
      label.classList.add('cola');
    }
    countVotes();
    ticket.focus();
  });
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
    const ok = await confirmInline(button, `Fechar a votação? “${top[0].name}” ganhou com ${plural(votes)}.`, 'Fechar e revelar');
    if (!ok) return;
    await saveWinner(top[0], null, data, ctx);
    return;
  }

  panel.innerHTML = `
    <div class="desempate">
      <h3 class="desempate__titulo">Empate entre ${top.length} jogos com ${plural(votes)} cada</h3>
      <p class="muted">O sorteio é feito aqui e o resultado fica gravado na rodada.</p>
      <div id="roulette"></div>
      <div class="actions actions--center"><button class="btn btn--primary" id="spin">${icon('dice')} Sortear</button></div>
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
