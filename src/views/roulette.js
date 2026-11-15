// Roleta do desempate: uma luz pula de capa em capa, desacelera e para no sorteado.
// O sorteado é escolhido ANTES (crypto) e a animação só encena o resultado.
import { esc } from '../lib/util.js';
import { calma } from '../lib/motion.js';
import { cover, stamp } from './parts.js';

export function spinRoulette(stage, games, winnerIndex) {
  stage.innerHTML = `
    <ol class="roulette" aria-label="Candidatos do sorteio">
      ${games.map((g) => `
        <li class="roulette__item">
          <div class="roulette__art">${cover(g)}</div>
          <span class="roulette__name">${esc(g.name)}</span>
        </li>`).join('')}
    </ol>
    <p class="sr-only" aria-live="assertive" id="roulette-result"></p>`;
  if (winnerIndex === null) return Promise.resolve();

  const items = [...stage.querySelectorAll('.roulette__item')];
  const finish = () => {
    items.forEach((el, i) => el.classList.toggle('is-lit', i === winnerIndex));
    items[winnerIndex].classList.add('is-winner');
    items[winnerIndex].querySelector('.roulette__art')
      .insertAdjacentHTML('beforeend', stamp('Sorteado', { hit: !calma.matches }));
    stage.querySelector('#roulette-result').textContent = `Sorteado: ${games[winnerIndex].name}`;
  };

  // Reduced-motion/contraste alto: sem luz pulando, já mostra o sorteado.
  if (calma.matches) {
    finish();
    return new Promise((resolve) => setTimeout(resolve, 900));
  }

  // Dá várias voltas (no mínimo ~14 pulos) e para no vencedor; cada pulo demora mais (desacelera).
  const laps = Math.max(3, Math.ceil(14 / games.length));
  const totalHops = games.length * laps + winnerIndex;
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
