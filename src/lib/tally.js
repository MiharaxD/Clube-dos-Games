// Contas feitas no cliente (sem Cloud Functions): votos, médias e stats.

// Ranking de votos: [{ game, voters: [uid], count }], do mais votado pro menos.
export function rankGames(games, votesByGame) {
  return games
    .map((game) => {
      const voters = votesByGame[game.id] ?? [];
      return { game, voters, count: voters.length };
    })
    .sort((a, b) => b.count - a.count || a.game.name.localeCompare(b.game.name, 'pt-BR'));
}

// Jogos empatados no topo (1 = vencedor direto; 2+ = vai pro sorteio).
export function leaders(ranking) {
  if (!ranking.length) return [];
  const top = ranking[0].count;
  return ranking.filter((r) => r.count === top).map((r) => r.game);
}

export function average(numbers) {
  if (!numbers.length) return null;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// Desvio padrão populacional: quanto as notas se espalham em volta da média.
export function stdDev(numbers) {
  const avg = average(numbers);
  if (avg === null) return null;
  return Math.sqrt(average(numbers.map((n) => (n - avg) ** 2)));
}

// Sorteio justo entre os empatados (crypto em vez de Math.random).
export function drawIndex(length) {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % length;
}

// Chave pra reconhecer "o mesmo jogo" entre rodadas: id do RAWG ou nome normalizado.
export function gameKey(game) {
  if (game.rawgId) return `rawg:${game.rawgId}`;
  const name = game.name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return `nome:${name}`;
}
