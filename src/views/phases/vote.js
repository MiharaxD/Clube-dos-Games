// Fase "votando": votação por aprovação na prateleira 3D. Votar rasga o ticket no picote e cola a
// etiqueta VOTADO na capa; o canhoto que sobra desfaz. Clicar na capinha abre a caixinha (manual).
// A proibição de votar no próprio jogo é garantida nas firestore.rules; aqui a UI só explica.
import { castVote, changeStatus, listAllVotes, removeVote } from '../../api.js';
import { calma } from '../../lib/motion.js';
import { leaders, rankGames } from '../../lib/tally.js';
import { RICKROLL_URL } from '../../lib/rickroll.js';
import { confirmInline, esc, toast, withBusy } from '../../lib/util.js';
import { memberName, stamp } from '../parts.js';
import { openReading } from '../caixinha.js';
import { bindTilt, caseHtml, nicho, postit, rackHtml, vitrine } from '../rack.js';
import { revelaVencedor, sorteiaEmpate } from '../sorteio.js';
import { bindTema, temaHtml } from '../tema.js';

const ETIQUETA = '<span class="etiqueta" data-etiqueta hidden>Votado</span>';

// Pegadinha: cada pessoa só pode desfazer voto 2 vezes por rodada. Na 3ª tentativa leva bronca;
// insistindo, abre o Rick Roll em outra janela. É brincadeira só da UI (as rules continuam deixando
// desfazer), então o contador mora no aparelho: sobrevive ao ctx.refresh() e ao recarregar a página.
const MAX_DESFAZER = 2;
const chaveDesfez = (roundId, uid) => `clube:desfez:${roundId}:${uid}`;
const lerDesfez = (roundId, uid) => {
  try {
    return Number(localStorage.getItem(chaveDesfez(roundId, uid))) || 0;
  } catch {
    return 0;
  }
};
const gravarDesfez = (roundId, uid, n) => {
  try {
    localStorage.setItem(chaveDesfez(roundId, uid), String(n));
  } catch { /* sem storage: o contador vale só até recarregar */ }
};
let teimosia = 0; // tentativas depois do limite, só na memória

export function renderVote(container, data, ctx) {
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
    ${temaHtml(data.round, ctx.session.isAdmin)}
    ${rackHtml(slots, 'Jogos sugeridos nesta rodada')}`;
  container.setAttribute('aria-labelledby', 'shelf-title');
  const rack = container.querySelector('.rack');
  bindTilt(rack);
  bindTema(container, data.round, ctx);

  const countVotes = () => {
    const count = document.getElementById('vote-count');
    if (count) count.textContent = myVotes.size;
  };

  // Vota ou desfaz pelo ticket da prateleira (o da caixinha chama a mesma função).
  // Devolve se o jogo está votado depois da tentativa.
  // `ancora` = onde a confirmação aparece (na caixinha o ticket da prateleira está atrás do modal).
  const alterna = async (ticket, ancora = ticket) => {
    if (!ticket || ticket.disabled || ticket.classList.contains('rasgando')) return undefined;
    const gameId = ticket.dataset.vote;
    const label = ticket.closest('.rack__slot').querySelector('[data-etiqueta]');
    const body = ticket.querySelector('.ticket__corpo');
    const voted = myVotes.has(gameId);
    body.classList.remove('volta');

    if (voted) {
      const feitos = lerDesfez(data.round.id, uid);
      if (feitos >= MAX_DESFAZER) {
        // Sem await antes: o window.open precisa nascer do clique, senão o navegador bloqueia o popup.
        teimosia += 1;
        if (teimosia === 1) toast('não pode mais otario xD', 'pop');
        else window.open(RICKROLL_URL, '_blank', 'noopener');
        return true;
      }
      const restam = MAX_DESFAZER - feitos;
      const certeza = await confirmInline(ancora, `Desfazer o voto? Você só pode desfazer ${restam === 1 ? 'mais 1 vez' : `${restam} vezes`} nessa rodada.`, 'Desfazer');
      if (!certeza) return true;
      // desfazer: o ticket volta inteiro e a etiqueta sai
      const ok = await withBusy(ticket, () => removeVote(data.round.id, gameId, uid).then(() => true));
      if (!ok) return myVotes.has(gameId);
      gravarDesfez(data.round.id, uid, feitos + 1);
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
      return false;
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
      return myVotes.has(gameId);
    }
    myVotes.add(gameId);
    ticket.setAttribute('aria-pressed', 'true');
    label.hidden = false;
    label.classList.remove('cola');
    void label.offsetWidth;
    label.classList.add('cola'); // em reduced-motion o CSS troca a colada por um fade curto
    countVotes();
    ticket.focus();
    return true;
  };

  rack.addEventListener('click', (event) => {
    // capinha: abre a caixinha em modo leitura, com o voto ali dentro (menos no jogo da própria pessoa)
    const abrir = event.target.closest('[data-abrir]');
    if (abrir) {
      const slot = abrir.closest('.rack__slot');
      const game = games.find((g) => g.id === slot.dataset.game);
      const fonte = slot.querySelector('.case');
      const votar = game.id === uid ? null : { voted: () => myVotes.has(game.id), toggle: (ancora) => alterna(slot.querySelector('[data-vote]'), ancora) };
      openReading({ game, members, uid, fonte, gatilho: abrir, front: slot.querySelector('.case__front').innerHTML, votar,
        recados: { roundId: data.round.id, isAdmin: ctx.session.isAdmin } });
      return;
    }
    alterna(event.target.closest('[data-vote]'));
  });
}

// ------------------------------------------------------------ admin: fechar votação

// Conta os votos no cliente. Vencedor único: confirma e revela. Empate: overlay do sorteio
// (src/views/sorteio.js), que sorteia, grava e só depois anima o resultado.
export async function closeVoting(data, ctx, button) {
  const { round, games } = data;
  const votesByGame = await listAllVotes(round.id, games); // lê de novo pra pegar votos recentes
  const ranking = rankGames(games, votesByGame);
  const top = leaders(ranking);
  const votos = ranking[0]?.count ?? 0;
  const plural = (n) => `${n} ${n === 1 ? 'voto' : 'votos'}`;

  if (top.length === 1) {
    const ok = await confirmInline(button, `Fechar a votação? “${top[0].name}” ganhou com ${plural(votos)}.`, 'Fechar e revelar');
    if (!ok) return;
    await revelaVencedor({ game: top[0], votos, grava: () => saveWinner(top[0], null, data), ctx, gatilho: button });
    return;
  }
  await sorteiaEmpate({ jogos: top, votos, grava: (game, ids) => saveWinner(game, ids, data), ctx, gatilho: button });
}

// Grava o vencedor (mesmo payload de sempre). Devolve true/false; o withBusy avisa o erro.
function saveWinner(game, tiedIds, data) {
  const extra = {
    winnerGameId: game.id,
    // Cópia do vencedor na rodada: a estante e o anúncio não precisam ler os jogos.
    winner: { name: game.name, cover: game.cover ?? '', coverData: game.coverData ?? '', suggestedBy: game.suggestedBy },
  };
  if (tiedIds) extra.tiebreak = { candidates: tiedIds };
  return withBusy(null, () => changeStatus(data.round, 'jogando', { extra }).then(() => true)).then(Boolean);
}
