// Novidades "não vistas": guarda no aparelho a hora da coisa mais nova que a pessoa já viu em cada
// lugar (recados de um jogo, quadro de jogando, quadro da resenha). Sem campo novo no Firestore (é só
// aviso de UI): trocar de aparelho ou limpar o navegador mostra o balão de novo, e tudo bem.
// Itens: recados ({ createdBy, createdAt }) ou docs dos quadros ({ uid | id, updatedAt }).
const chave = (roundId, gameId, uid) => `clube:visto:${roundId}:${gameId}:${uid}`;
const ms = (c) => (c.createdAt ?? c.updatedAt)?.toMillis?.() ?? 0;
export const autor = (c) => c.createdBy ?? c.uid ?? c.id;

function lerVisto(roundId, gameId, uid) {
  try {
    return Number(localStorage.getItem(chave(roundId, gameId, uid))) || 0;
  } catch {
    return 0;
  }
}

// Itens dos outros mais novos que o último visto (os da própria pessoa nunca contam), do mais velho ao mais novo.
export function naoVistos(roundId, gameId, uid, comments = []) {
  const visto = lerVisto(roundId, gameId, uid);
  return comments.filter((c) => autor(c) !== uid && ms(c) > visto).sort((a, b) => ms(a) - ms(b));
}

// Marca como visto até o item mais novo da lista (usa a hora do servidor, não o relógio do aparelho).
export function marcaVisto(roundId, gameId, uid, comments = []) {
  const ultimo = Math.max(lerVisto(roundId, gameId, uid), ...comments.map(ms));
  try {
    localStorage.setItem(chave(roundId, gameId, uid), String(ultimo));
  } catch { /* sem storage: o balão volta ao recarregar */ }
}
