// Autocomplete de jogos pela API pública do RAWG (https://rawg.io/apidocs).
// Opcional: sem VITE_RAWG_API_KEY, ou se a API falhar, o formulário segue no manual.
import { familiesFromRawg } from './platforms.js';

const KEY = import.meta.env.VITE_RAWG_API_KEY;

export const rawgEnabled = Boolean(KEY);

export async function searchGames(term, signal) {
  const url = new URL('https://api.rawg.io/api/games');
  url.search = new URLSearchParams({ key: KEY, search: term, page_size: '6' }).toString();
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`RAWG respondeu ${response.status}`);
  const json = await response.json();
  return (json.results ?? []).map((r) => ({
    rawgId: r.id,
    name: r.name,
    cover: r.background_image ?? '',
    year: r.released ? Number(r.released.slice(0, 4)) : null,
    genre: r.genres?.[0]?.name ?? '',
    platforms: familiesFromRawg(r.parent_platforms),
  }));
}
