// Stats do clube. Tudo calculado no cliente a partir das rodadas que já têm vencedor.
// Cada número aparece junto da prova (as notas ou rodadas que o produziram).
import { listGames, listRatings, listRounds } from '../api.js';
import { entrar } from '../lib/motion.js';
import { average, gameKey, stdDev } from '../lib/tally.js';
import { esc, fmtScore, listJoin, safeUrl } from '../lib/util.js';
import { avatar, cover, empty, memberName, stamp, sticker, tv } from './parts.js';

const MIN_FOR_CONTROVERSY = 3; // "mais polêmico" só com pelo menos 3 notas
const NO_GENRE = 'Sem gênero';

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

export async function renderStats(main, { session }) {
  const members = session.members;
  const me = session.user?.uid;
  const quem = (uid) => (uid === me ? 'Você' : memberName(members, uid));

  const rounds = (await listRounds()).filter((r) => r.winnerGameId);
  const [gamesPerRound, ratingsPerRound] = await Promise.all([
    Promise.all(rounds.map((r) => listGames(r.id))),
    Promise.all(rounds.map((r) => listRatings(r.id))),
  ]);

  // Uma linha por rodada decidida: vencedor (com o gênero do jogo da rodada) + notas.
  const played = rounds.map((round, i) => {
    const game = gamesPerRound[i].find((g) => g.id === round.winnerGameId);
    const scores = ratingsPerRound[i].map((r) => r.score);
    return {
      round,
      winner: round.winner ?? game ?? {},
      genre: String(game?.genre ?? '').trim() || NO_GENRE,
      scores,
      avg: average(scores),
      dev: stdDev(scores),
    };
  });

  const linha = plural(played.length, 'rodada', 'rodadas');
  const head = (resumo) => `
    <div class="cabeca"><h1>Stats</h1><p>${esc(resumo)}</p></div>
    ${tv({ osd: 'CH STATS', title: 'Stats', line: linha })}`;

  if (!played.length) {
    main.innerHTML = `<div class="stats stats--vazio">
      ${head('Nada pra contar ainda.')}
      <div class="stats__vazio">${empty('Sem histórico ainda', 'As stats aparecem depois que a primeira votação fechar. Até lá, é tudo achismo.')}</div>
    </div>`;
    return;
  }

  // Mais bem avaliado: maior média (desempate: mais notas).
  const best = played
    .filter((p) => p.scores.length)
    .sort((a, b) => b.avg - a.avg || b.scores.length - a.scores.length)[0];

  // Mais polêmico: maior desvio padrão entre as notas.
  const controversial = played
    .filter((p) => p.scores.length >= MIN_FOR_CONTROVERSY)
    .sort((a, b) => b.dev - a.dev)[0];

  // Quem mais emplacou jogo: conta vitórias por quem sugeriu.
  // (sócios aprovados entram com zero, pra barra vazia também contar a história)
  const wins = new Map(members.filter((m) => m.approved).map((m) => [m.id, []]));
  for (const p of played) {
    const uid = p.winner.suggestedBy;
    if (!wins.has(uid)) wins.set(uid, []);
    wins.get(uid).push(p);
  }
  const winners = [...wins.entries()].sort(
    (a, b) => b[1].length - a[1].length || quem(a[0]).localeCompare(quem(b[0]), 'pt-BR'),
  );

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

  const totalRatings = played.reduce((n, p) => n + p.scores.length, 0);
  const totalSuggested = gamesPerRound.reduce((n, games) => n + games.length, 0);

  main.innerHTML = `<div class="stats">
    ${head(`${plural(played.length, 'rodada decidida', 'rodadas decididas')}, ${plural(totalRatings, 'nota', 'notas')} no caderninho e resenha que não acaba mais.`)}
    ${genresSection(played)}
    ${factsSection({ best, controversial, neverWon, played, totalRatings, totalSuggested })}
    ${partnerSection(winners, played.length, members, quem, me)}
    ${neverWonSection(neverWon, members)}
  </div>`;

  entrar(main.querySelectorAll('.fato'), 120, 60);
}

// ------------------------------------------------------------ gêneros

// Hue estável por nome: a lombada do mesmo jogo tem sempre a mesma cor.
const hueOf = (name) => [...String(name ?? '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 360;

function genresSection(played) {
  const byGenre = new Map();
  for (const p of played) {
    if (!byGenre.has(p.genre)) byGenre.set(p.genre, []);
    byGenre.get(p.genre).push(p);
  }
  const genres = [...byGenre.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'pt-BR'));
  const max = genres[0][1].length;
  const tops = genres.filter(([, list]) => list.length === max).map(([g]) => g);

  let nota;
  if (played.length === 1) nota = `Só uma rodada até agora, e deu ${tops[0]}.`;
  else if (max === 1) nota = 'Cada rodada um gênero diferente. Clube eclético ou indeciso?';
  else if (tops.length > 1) nota = `Empate: ${listJoin(tops)}, com ${max} jogos cada.`;
  else {
    const resto = genres.length > 1 && genres.slice(1).every(([, list]) => list.length === 1);
    nota = `${tops[0]} ganhou ${max} das ${played.length} rodadas.${resto ? ' Os outros gêneros ganharam uma vez só.' : ''}`;
  }

  const rows = genres.map(([genre, list]) => {
    const top = list.length === max && max > 1;
    const spines = list.map((p) => {
      const name = p.winner.name ?? '';
      const hue = hueOf(name);
      const alt = 110 + ((Number(p.round.number) || 0) * 7) % 16;
      return `<span class="lombada" style="--hue: ${hue}; --alt: ${alt}px" data-dica="${esc(name)} · Fase ${esc(p.round.number)}"><span>${esc(name)}</span></span>`;
    }).join('');
    return `<li class="gen${top ? ' gen--top' : ''}">
      <span class="gen__nome">${esc(genre)}</span>
      <span class="gen__lombadas" style="--n: ${list.length}" aria-hidden="true">${spines}${top ? stamp('Mais alugado') : ''}</span>
      <span class="gen__n" aria-hidden="true">${list.length}</span>
      <span class="sr-only">: ${plural(list.length, 'jogo', 'jogos')} (${list.map((p) => esc(p.winner.name)).join(', ')})${top ? ', o mais escolhido' : ''}</span>
    </li>`;
  }).join('');

  return `<section class="stats__generos" aria-labelledby="st-generos">
    <h2 id="st-generos">O que o clube mais aluga</h2>
    <p class="stats__nota">${esc(nota)}</p>
    <ol class="generos" aria-label="Jogos escolhidos por gênero">${rows}</ol>
  </section>`;
}

// ------------------------------------------------------------ curiosidades

// Jogo de prova dentro do papel: capa pequena + nome, leva pra rodada.
const proofGame = (p) => `
  <a class="fato__jogo" href="#/rodada/${esc(p.round.id)}">
    <span class="fato__capa">${cover(p.winner)}</span>
    <span><strong class="fato__nome">${esc(p.winner.name)}</strong><span class="fato__fase">Fase ${esc(p.round.number)}</span></span>
  </a>`;

const proofScores = (scores) =>
  `<p class="fato__prova">Notas: ${[...scores].sort((a, b) => b - a).map(fmtScore).join(' · ')}</p>`;

const fact = (n, text, proof = '') =>
  `<li class="fato"><span class="fato__n">${esc(n)}</span><p class="fato__txt">${esc(text)}</p>${proof}</li>`;

function factsSection({ best, controversial, neverWon, played, totalRatings, totalSuggested }) {
  const facts = [];

  facts.push(best
    ? fact(fmtScore(best.avg), 'de média: o mais bem avaliado do clube até agora.', proofGame(best) + proofScores(best.scores))
    : fact('0', 'notas dadas até agora. Nota é de graça, gente.'));

  facts.push(controversial
    ? fact(fmtScore(controversial.dev), 'pontos de desvio: o mais polêmico. Metade amou, metade quer o dinheiro da locação de volta.',
      proofGame(controversial) + proofScores(controversial.scores))
    : fact(String(MIN_FOR_CONTROVERSY), 'notas num mesmo jogo é o mínimo pra eleger o mais polêmico. Ainda não rolou briga.'));

  const losers = neverWon.length;
  facts.push(fact(String(losers),
    losers
      ? `${losers === 1 ? 'sugestão nunca ganhou' : 'sugestões nunca ganharam'}. Tão pegando poeira na prateleira lá embaixo.`
      : 'sugestões encalhadas. Todo jogo sugerido já ganhou alguma vez. Que clube eficiente.',
    losers ? `<p class="fato__prova">A mais insistente: ${esc(neverWon[0].name)} (${plural(neverWon[0].times, 'vez', 'vezes')}).</p>` : ''));

  const first = played.at(-1);
  const last = played[0];
  facts.push(fact(String(played.length),
    `${played.length === 1 ? 'rodada decidida' : 'rodadas decididas'}, com ${plural(totalSuggested, 'jogo sugerido', 'jogos sugeridos')} e ${plural(totalRatings, 'nota', 'notas')} no caderninho.`,
    played.length > 1
      ? `<p class="fato__prova">De ${esc(first.winner.name)} (Fase ${esc(first.round.number)}) a ${esc(last.winner.name)} (Fase ${esc(last.round.number)}).</p>`
      : `<p class="fato__prova">A primeira foi ${esc(last.winner.name)}.</p>`));

  return `<section class="stats__fatos" aria-labelledby="st-fatos">
    <h2 id="st-fatos">Curiosidades</h2>
    <ul class="fatos">${facts.join('')}</ul>
  </section>`;
}

// ------------------------------------------------------------ sócio do mês

// Retrato quadrado: foto do Google por cima da inicial em Bebas (se a foto falhar, fica a inicial).
function portrait(member) {
  const photo = safeUrl(member?.photoURL);
  const initial = `<span class="retrato__inicial" aria-hidden="true">${esc((member?.name ?? '?').trim().charAt(0).toUpperCase())}</span>`;
  return photo ? `${initial}<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : initial;
}

function partnerSection(winners, total, members, quem, me) {
  const [kingId, kingList] = winners[0];
  const max = kingList.length;
  const king = members.find((m) => m.id === kingId);
  const tied = winners.slice(1).filter(([, list]) => list.length === max).map(([uid]) => quem(uid));
  const genres = [...new Set(kingList.map((p) => p.genre))];
  const de = kingId === me ? 'sua' : `de ${quem(kingId)}`;

  let bilhete;
  if (tied.length) bilhete = `Empatado com ${listJoin(tied)}. Desempate na próxima rodada.`;
  else if (max > 1 && genres.length === 1 && genres[0] !== NO_GENRE) bilhete = `Os ${max} são ${genres[0].toLowerCase()}. O clube percebeu.`;
  else bilhete = `Emplacou ${listJoin(kingList.map((p) => p.winner.name ?? ''))}.`;

  const bars = winners.map(([uid, list]) => `<li>
    ${avatar(members.find((m) => m.id === uid) ?? { name: quem(uid) }, 'sm')}
    <span class="barra__nome">${esc(quem(uid))}</span>
    <span class="barra__trilho" aria-hidden="true"><span class="barra__cheia" style="--p: ${(list.length / max) * 100}%"></span></span>
    <span class="barra__n">${list.length}<span class="sr-only"> ${list.length === 1 ? 'jogo' : 'jogos'}</span></span>
  </li>`).join('');

  return `<section class="stats__socio" aria-labelledby="st-socio">
    <h2 id="st-socio">Quem mais emplaca jogo</h2>
    <div class="retrato-wrap">
      <span class="luz-quadro" aria-hidden="true">
        <svg viewBox="0 0 120 26"><path d="M56 0h8v8h-8z" fill="#6b4a2f"/><path d="M58 6h4v8h-4z" fill="#8c6646"/><path d="M8 12h104l-8 12H16z" fill="#c99a2e"/><path d="M8 12h104v3H8z" fill="#f1cf6e"/><path d="M18 22h84v2H18z" fill="#fff0b0" opacity="0.8"/></svg>
        <span class="luz-quadro__poca" data-luz="abajur"></span>
      </span>
      <figure class="retrato">
        <div class="retrato__foto">${portrait(king ?? { name: quem(kingId) })}</div>
        <figcaption class="retrato__placa">Sócio do mês</figcaption>
      </figure>
      <p class="socio__nome">${esc(quem(kingId))}</p>
      <p class="socio__txt"><strong>${max}</strong> dos ${total} jogos escolhidos ${max === 1 ? 'foi' : 'foram'} sugestão ${esc(de)}.</p>
      <p class="bilhete">${esc(bilhete)}</p>
    </div>
    <div class="panel stats__barras">
      <h3 class="panel__title">Jogos escolhidos por sócio</h3>
      <ol class="barras">${bars}</ol>
    </div>
  </section>`;
}

// ------------------------------------------------------------ nunca ganharam

function neverWonSection(neverWon, members) {
  const body = neverWon.length
    ? `<div class="shelf-row shelf-row--mini">${neverWon.map((g) => `
        <article class="box">
          <div class="box__art">${cover(g)}${g.times > 1 ? `<span class="nunca__vezes">${sticker(`${g.times}×`, { num: true, srSuffix: ' sugestões' })}</span>` : ''}</div>
          <h3 class="box__name">${esc(g.name)}</h3>
          <p class="box__by">por ${[...g.by].map((id) => esc(memberName(members, id))).join(', ')}</p>
        </article>`).join('')}</div><div class="shelf-lip"></div>`
    : empty('Prateleira vazia', 'Todo jogo sugerido já ganhou alguma vez. Que clube eficiente.');

  return `<section class="stats__nunca" aria-labelledby="st-nunca">
    <h2 id="st-nunca">Sugestões que nunca ganharam</h2>
    <p class="stats__nota">Insistência é uma virtude. Às vezes.</p>
    ${body}
  </section>`;
}
