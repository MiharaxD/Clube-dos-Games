// Estante (portada de estante.html): todo jogo que já foi escolhido, da rodada mais nova pra mais
// velha, na prateleira 3D. Clicar na capinha abre a caixinha (manual); dali dá pra rever a mesa da rodada.
// Sem a fila de "quem zerou" do mock: quem zerou aparece na mesa da rodada (zerei/{uid}).
import { listGames, listRatings, listRounds } from '../api.js';
import { average } from '../lib/tally.js';
import { esc, fmtScore } from '../lib/util.js';
import { memberName, stamp, sticker, tv } from './parts.js';
import { openReading } from './caixinha.js';
import { bindTilt, caseHtml, nicho, postit, rackHtml, vitrine } from './rack.js';

export async function renderShelf(main, { session }) {
  const members = session.members;
  const rounds = (await listRounds()).filter((r) => r.status === 'encerrada');
  const [gamesPerRound, ratingsPerRound] = await Promise.all([
    Promise.all(rounds.map((r) => listGames(r.id))),
    Promise.all(rounds.map((r) => listRatings(r.id))),
  ]);

  // O jogo vencedor completo (gênero, preço…) quando existe; senão a cópia gravada na rodada.
  const entries = rounds.map((round, i) => {
    const game = { ...(round.winner ?? {}), ...(gamesPerRound[i].find((g) => g.id === round.winnerGameId) ?? {}) };
    const scores = ratingsPerRound[i].map((r) => r.score);
    return { round, game, scores, avg: average(scores) };
  });

  const slots = entries.map(({ round, game, scores, avg }) => `
    <li class="rack__slot" data-round="${esc(round.id)}">
      ${vitrine(nicho(caseHtml(game, stamp(round.tiebreak?.candidates?.length ? 'Sorteado' : 'Vencedor'))), `Abrir a caixinha de ${esc(game.name)}, Fase ${esc(round.number)}`)}
      <div class="rack__info">
        ${postit(esc(game.name), [`Fase ${esc(round.number)}`, `sugestão de ${esc(memberName(members, game.suggestedBy))}`])}
        <p class="estante__nota-jogo">${avg === null
          ? 'Ninguém deu nota'
          : `${sticker(fmtScore(avg), { num: true, srSuffix: ' de média' })} ${scores.length} ${scores.length === 1 ? 'nota' : 'notas'}`}</p>
      </div>
    </li>`);

  const desde = rounds.length ? rounds[rounds.length - 1].createdAt?.toDate?.() : null;
  const desdeTxt = desde ? `Desde ${desde.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')} · ` : '';

  main.innerHTML = `
    <div class="rodada tela-estante">
      <div class="cabeca">
        <h1>Estante</h1>
        <p>${rounds.length} ${rounds.length === 1 ? 'jogo zerado' : 'jogos zerados'} pelo clube</p>
      </div>
      <section class="ficha" aria-labelledby="ficha-title">
        <span class="ficha__stamp">Arquivo</span>
        <h2 class="ficha__title" id="ficha-title">Ficha do clube</h2>
        <p class="ficha__socio">${esc(desdeTxt)}${rounds.length} ${rounds.length === 1 ? 'rodada fechada' : 'rodadas fechadas'}</p>
        <p class="ficha__todo">${rounds.length ? 'Tira uma capinha da estante pra reler o manual.' : 'A estante tá esperando a primeira fita.'}</p>
        <p class="ficha__resto">Cada jogo escolhido vem morar aqui quando a rodada fecha. Da caixinha dá pra voltar na mesa da rodada e reler o quadro de resenhas.</p>
      </section>
      ${tv({ osd: 'CH ESTANTE', title: 'Estante', line: `${rounds.length} ${rounds.length === 1 ? 'rodada' : 'rodadas'}` })}
      <section class="estante" aria-labelledby="estante-titulo">
        <h2 class="estante__titulo" id="estante-titulo">Já passaram por aqui</h2>
        ${entries.length
          ? `<p class="estante__nota">Da rodada mais nova pra mais velha.</p>${rackHtml(slots, 'Jogos escolhidos pelo clube')}`
          : '<div class="empty"><strong>Estante vazia</strong><p>Quando a primeira rodada for encerrada, o jogo vem morar aqui. Por enquanto só tem poeira.</p></div>'}
      </section>
    </div>`;

  const rack = main.querySelector('.rack');
  if (!rack) return;
  bindTilt(rack);
  rack.addEventListener('click', (event) => {
    const abrir = event.target.closest('[data-abrir]');
    if (!abrir) return;
    const slot = abrir.closest('.rack__slot');
    const { round, game } = entries.find((e) => e.round.id === slot.dataset.round);
    openReading({
      game,
      members,
      uid: session.user.uid,
      fonte: slot.querySelector('.case'),
      gatilho: abrir,
      front: slot.querySelector('.case__front').innerHTML,
      extraActions: `<a class="btn btn--primary" href="#/rodada/${esc(round.id)}">Ver a mesa da rodada</a>`,
    });
  });
}
