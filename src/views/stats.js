// Stats do clube. Tudo calculado no cliente a partir das rodadas que já têm vencedor.
// Cada número aparece junto da prova (as notas ou rodadas que o produziram).
import { listGames, listRatings, listRounds } from '../api.js';
import { average, gameKey, stdDev } from '../lib/tally.js';
import { esc, fmtScore } from '../lib/util.js';
import { cover, empty, memberChip, memberName } from './parts.js';

const MIN_FOR_CONTROVERSY = 3; // "mais polêmico" só com pelo menos 3 notas

export async function renderStats(main, { session }) {
  const members = session.members;
  const rounds = (await listRounds()).filter((r) => r.winnerGameId);
  const [gamesPerRound, ratingsPerRound] = await Promise.all([
    Promise.all(rounds.map((r) => listGames(r.id))),
    Promise.all(rounds.map((r) => listRatings(r.id))),
  ]);

  // Uma linha por rodada decidida: vencedor + notas.
  const played = rounds.map((round, i) => {
    const scores = ratingsPerRound[i].map((r) => r.score);
    return { round, winner: round.winner ?? {}, scores, avg: average(scores), dev: stdDev(scores) };
  });

  // Mais bem avaliado: maior média (desempate: mais notas).
  const best = played
    .filter((p) => p.scores.length)
    .sort((a, b) => b.avg - a.avg || b.scores.length - a.scores.length)[0];

  // Mais polêmico: maior desvio padrão entre as notas.
  const controversial = played
    .filter((p) => p.scores.length >= MIN_FOR_CONTROVERSY)
    .sort((a, b) => b.dev - a.dev)[0];

  // Quem mais ganhou: conta vitórias por quem sugeriu.
  const wins = new Map();
  for (const p of played) {
    const uid = p.winner.suggestedBy;
    if (!wins.has(uid)) wins.set(uid, []);
    wins.get(uid).push(p);
  }
  const winners = [...wins.entries()].sort((a, b) => b[1].length - a[1].length);

  // Sugestões que nunca ganharam: jogos únicos (id RAWG ou nome) que nunca venceram.
  const winnerKeys = new Set(
    rounds.map((r, i) => gamesPerRound[i].find((g) => g.id === r.winnerGameId)).filter(Boolean).map(gameKey),
  );
  const losers = new Map();
  rounds.forEach((_, i) => {
    for (const game of gamesPerRound[i]) {
      const key = gameKey(game);
      if (winnerKeys.has(key)) continue;
      const entry = losers.get(key) ?? { name: game.name, cover: game.cover, times: 0, by: new Set() };
      entry.times += 1;
      entry.by.add(game.suggestedBy);
      losers.set(key, entry);
    }
  });
  const neverWon = [...losers.values()].sort((a, b) => b.times - a.times || a.name.localeCompare(b.name, 'pt-BR'));

  if (!played.length) {
    main.innerHTML = `<div class="page-head"><h1>Stats</h1></div>${empty('Sem histórico ainda', 'As stats aparecem depois que a primeira votação for fechada.')}`;
    return;
  }

  main.innerHTML = `
    <div class="page-head"><h1>Stats</h1><p class="muted">${played.length} ${played.length === 1 ? 'rodada decidida' : 'rodadas decididas'}</p></div>
    <div class="stats-grid">
      ${highlight('Mais bem avaliado', best, best && `média ${fmtScore(best.avg)}`, 'Ninguém deu nota ainda.')}
      ${highlight('Mais polêmico', controversial, controversial && `desvio de ${fmtScore(controversial.dev)} pontos`, `Precisa de um jogo com pelo menos ${MIN_FOR_CONTROVERSY} notas.`)}
    </div>

    <section aria-labelledby="wins-title">
      <h2 id="wins-title">Quem mais ganhou</h2>
      <ol class="list">${winners.map(([uid, list]) => `
        <li>
          ${memberChip(members.find((m) => m.id === uid) ?? { name: memberName(members, uid) })}
          <span><span class="sticker sticker--num">${list.length}</span> ${list.length === 1 ? 'vitória' : 'vitórias'}
          <span class="small muted">· ${list.map((p) => esc(p.winner.name)).join(', ')}</span></span>
        </li>`).join('')}</ol>
    </section>

    <section aria-labelledby="never-title">
      <h2 id="never-title">Sugestões que nunca ganharam</h2>
      ${neverWon.length ? `<div class="shelf-row shelf-row--mini">${neverWon.map((g) => `
        <article class="box">
          <div class="box__art">${cover(g)}${g.times > 1 ? `<span class="price">${g.times}×</span>` : ''}</div>
          <h3 class="box__name">${esc(g.name)}</h3>
          <p class="box__by">por ${[...g.by].map((id) => esc(memberName(members, id))).join(', ')}</p>
        </article>`).join('')}</div><div class="shelf-lip"></div>` : empty('Nenhuma', 'Todo jogo sugerido já ganhou alguma vez. Que clube eficiente.')}
    </section>`;
}

// Destaque com a prova: capa, nome, o número e as notas que o produziram.
function highlight(title, entry, figure, emptyText) {
  if (!entry) {
    return `<section class="panel stat"><h2>${esc(title)}</h2><p class="muted">${esc(emptyText)}</p></section>`;
  }
  return `
    <section class="panel stat">
      <h2>${esc(title)}</h2>
      <a class="stat__game" href="#/rodada/${esc(entry.round.id)}">
        <span class="stat__cover">${cover(entry.winner)}</span>
        <span>
          <strong class="stat__name">${esc(entry.winner.name)}</strong>
          <span class="sticker sticker--lime">${esc(figure)}</span>
          <span class="small muted">Fase ${esc(entry.round.number)}</span>
        </span>
      </a>
      <p class="small muted">Notas: ${[...entry.scores].sort((a, b) => b - a).map(fmtScore).join(' · ')}</p>
    </section>`;
}
