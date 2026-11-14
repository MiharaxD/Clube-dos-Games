// Plataformas agrupadas em famílias. A mesma lista existe nas firestore.rules.
export const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Mac', 'Linux'];

// Traduz o "parent_platforms" do RAWG para as nossas famílias.
const RAWG_SLUG_TO_FAMILY = {
  pc: 'PC',
  playstation: 'PlayStation',
  xbox: 'Xbox',
  nintendo: 'Nintendo',
  ios: 'Mobile',
  android: 'Mobile',
  mac: 'Mac',
  linux: 'Linux',
};

export function familiesFromRawg(parentPlatforms = []) {
  const families = parentPlatforms
    .map((entry) => RAWG_SLUG_TO_FAMILY[entry?.platform?.slug])
    .filter(Boolean);
  return [...new Set(families)];
}

// Quantos membros aprovados conseguem jogar um jogo (têm ao menos uma plataforma em comum).
export function playableCount(gamePlatforms, members) {
  const approved = members.filter((m) => m.approved);
  const able = approved.filter((m) => (m.platforms ?? []).some((p) => gamePlatforms.includes(p)));
  return { able: able.length, total: approved.length };
}
