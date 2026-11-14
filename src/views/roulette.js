// Roleta do desempate: uma luz pula de capa em capa, desacelera e para no sorteado.
// O sorteado é escolhido ANTES (crypto) e a animação só encena o resultado.
import { esc, prefersReducedMotion } from '../lib/util.js';
import { cover } from './parts.js';

export function spinRoulette(stage, games, winnerIndex) {
  stage.innerHTML = `
    <ol class="roulette" aria-label="Candidatos do sorteio">
      ${games.map((g) => `<li class="roulette__item">${cover(g)}<span class="roulette__name">${esc(g.name)}</span></li>`).join('')}
    </ol>
    <p class="sr-only" aria-live="assertive" id="roulette-result"></p>`;
  if (winnerIndex === null) return Promise.resolve();

  const items = [...stage.querySelectorAll('.roulette__item')];
  const finish = () => {
    items.forEach((el, i) => el.classList.toggle('is-lit', i === winnerIndex));
    items[winnerIndex].classList.add('is-winner');
    items[winnerIndex].insertAdjacentHTML('beforeend', '<span class="stamp stamp--lime is-new">Sorteado</span>');
    stage.querySelector('#roulette-result').textContent = `Sorteado: ${games[winnerIndex].name}`;
  };

  if (prefersReducedMotion()) {
    finish();
    return new Promise((resolve) => setTimeout(resolve, 900));
  }

  // Dá 3 voltas inteiras e para no vencedor; cada pulo demora um pouco mais (desacelera).
  const totalHops = games.length * 3 + winnerIndex;
  return new Promise((resolve) => {
    let hop = 0;
    const step = () => {
      items.forEach((el, i) => el.classList.toggle('is-lit', i === hop % games.length));
      if (hop === totalHops) {
        finish();
        setTimeout(resolve, 1200);
        return;
      }
      const progress = hop / totalHops;
      hop += 1;
      setTimeout(step, 70 + 380 * progress ** 3);
    };
    step();
  });
}
