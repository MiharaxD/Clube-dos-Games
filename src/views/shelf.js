// Estante: todas as rodadas encerradas, com capa, vencedor, quem sugeriu e nota média.
import { listRatings, listRounds } from '../api.js';
import { average } from '../lib/tally.js';
import { esc, fmtScore } from '../lib/util.js';
import { cover, empty, memberName, shelf } from './parts.js';

export async function renderShelf(main, { session }) {
  const rounds = (await listRounds()).filter((r) => r.status === 'encerrada');
  const ratings = await Promise.all(rounds.map((r) => listRatings(r.id)));

  const boxes = rounds.map((round, i) => {
    const scores = ratings[i].map((r) => r.score);
    const avg = average(scores);
    const winner = round.winner ?? {};
    return `
      <article class="box">
        <a class="box__link" href="#/rodada/${esc(round.id)}">
          ${cover(winner)}
          <span class="price">${avg === null ? 's/ nota' : fmtScore(avg)}</span>
          <span class="tag">Fase ${esc(round.number)}</span>
          <h3 class="box__name">${esc(winner.name)}</h3>
        </a>
        <p class="box__by">sugestão de ${esc(memberName(session.members, winner.suggestedBy))}</p>
        <p class="box__meta">${avg === null ? 'Ninguém deu nota' : `Nota média ${fmtScore(avg)} · ${scores.length} ${scores.length === 1 ? 'nota' : 'notas'}`}</p>
      </article>`;
  });

  main.innerHTML = `
    <div class="page-head"><h1>Estante</h1><p class="muted">${rounds.length} ${rounds.length === 1 ? 'jogo zerado' : 'jogos zerados'} pelo clube</p></div>
    ${rounds.length ? shelf(boxes.join('')) : empty('Estante vazia', 'Quando a primeira rodada for encerrada, o jogo vem morar aqui.')}`;
}
