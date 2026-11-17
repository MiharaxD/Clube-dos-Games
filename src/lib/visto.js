// Recados "não vistos": guarda no aparelho a hora do recado mais novo que a pessoa já viu em cada jogo.
// Sem campo novo no Firestore (é só aviso de UI): trocar de aparelho ou limpar o navegador mostra o
// balão de novo, e tudo bem.
const chave = (roundId, gameId, uid) => `clube:visto:${roundId}:${gameId}:${uid}`;
const ms = (c) => c.createdAt?.toMillis?.() ?? 0;

function lerVisto(roundId, gameId, uid) {
  try {
    return Number(localStorage.getItem(chave(roundId, gameId, uid))) || 0;
  } catch {
    return 0;
  }
}

// Recados dos outros mais novos que o último visto (os da própria pessoa nunca contam).
export function naoVistos(roundId, gameId, uid, comments = []) {
  const visto = lerVisto(roundId, gameId, uid);
  return comments.filter((c) => c.createdBy !== uid && ms(c) > visto);
}

// Marca como visto até o recado mais novo da lista (usa a hora do servidor, não o relógio do aparelho).
export function marcaVisto(roundId, gameId, uid, comments = []) {
  const ultimo = Math.max(lerVisto(roundId, gameId, uid), ...comments.map(ms));
  try {
    localStorage.setItem(chave(roundId, gameId, uid), String(ultimo));
  } catch { /* sem storage: o balão volta ao recarregar */ }
}
