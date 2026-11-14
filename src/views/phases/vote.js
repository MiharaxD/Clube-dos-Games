// Fase "votando" (implementada no Marco 4).
import { empty } from '../parts.js';
export function renderVote(container) {
  container.innerHTML = empty('Em obra', 'A votação chega no próximo marco.');
}
export function closeVoting() {}
