// Estante (implementada no Marco 6).
import { empty } from './parts.js';
export async function renderShelf(main) {
  main.innerHTML = empty('Em obra', 'A estante chega num próximo marco.');
}
