// Roleta de cassino do desempate, montada dentro do vidro da TV (sorteio.js). Fatias iguais com a
// capa de cada empatado, aro dourado com pinos, cubo e ponteiro fixo no topo.
// O sorteado é escolhido ANTES (crypto, drawIndex) e já está gravado: a roda só encena o resultado.
import { anim } from '../lib/motion.js';
import { cover } from './parts.js';

const TONS = ['#3a1622', '#1e1218', '#2b1a12'];

// Fatia i ocupa [i·s, (i+1)·s] em graus, no sentido horário a partir do topo.
export function rodaHtml(games) {
  const n = games.length;
  const s = 360 / n;
  // n ímpar: 3 tons, pra fatia vizinha nunca repetir na emenda
  const tons = games.map((_, i) => TONS[n % 2 && i === n - 1 ? 2 : i % 2]);
  const fundo = `conic-gradient(${tons.map((c, i) => `${c} ${i * s}deg ${(i + 1) * s}deg`).join(', ')})`;
  // largura da capa (fração do diâmetro): borda de fora a 4% do aro; a de dentro (mais estreita)
  // ainda cabe na corda da fatia e não encosta no cubo
  const sen = Math.sin(Math.PI / n);
  const larg = Math.min(0.24, (0.92 * sen) / (1 + 2.667 * sen));
  const fatias = games.map((g, i) => `<div class="roda__fatia" style="--a:${i * s + s / 2}deg">
      <div class="roda__capa" style="--cw:${(larg * 100).toFixed(2)}%">${cover(g)}</div>
    </div>`).join('');
  const pinos = games.map((_, i) => `<i class="roda__pino" style="--a:${i * s}deg"></i>`).join('');
  return `<div class="roda" aria-hidden="true">
    <div class="roda__disco" style="--fatias:${fundo};--s:${s}deg">${fatias}${pinos}</div>
    <span class="roda__aro"></span>
    <span class="roda__cubo"></span>
    <span class="roda__ponteiro"></span>
  </div>`;
}

// Ângulo final: o centro da fatia sorteada para sob o ponteiro (± 20% da fatia, sem sair dela).
export function anguloFinal(n, indice, voltas = 6, folga = Math.random() * 2 - 1) {
  const s = 360 / n;
  return voltas * 360 - (indice * s + s / 2) + folga * s * 0.2;
}

// Fatia sob o ponteiro para uma rotação θ do disco.
export const fatiaNoTopo = (n, theta) => Math.floor((((-theta % 360) + 360) % 360) / (360 / n)) % n;

// Gira e devolve quando parar. aoTrocar(i) avisa a fatia sob o ponteiro (o OSD da TV mostra o nome).
export function giraRoda(roda, n, indice, { ms = 6000, aoTrocar = () => {} } = {}) {
  const disco = roda.querySelector('.roda__disco');
  const ponteiro = roda.querySelector('.roda__ponteiro');
  const fim = anguloFinal(n, indice);
  const s = 360 / n;
  let atual = -1;
  let ultimo = 0;
  let rodando = true;

  // Lê o ângulo do quadro atual: o ponteiro bate nos pinos e o OSD acompanha a fatia.
  const olha = () => {
    if (!rodando || !roda.isConnected) return; // parou ou o overlay saiu no meio
    const m = new DOMMatrixReadOnly(getComputedStyle(disco).transform);
    const theta = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    const i = fatiaNoTopo(n, theta);
    if (i !== atual) {
      atual = i;
      aoTrocar(i);
    }
    // o pino mais perto do ponteiro empurra a lingueta (forte na volta lenta, de leve rodando rápido)
    const vel = Math.abs(((theta - ultimo + 540) % 360) - 180);
    ultimo = theta;
    const resto = (((-theta % s) + s) % s) / s; // 0 = pino bem embaixo do ponteiro
    const empurra = resto < 0.35 ? 1 - resto / 0.35 : 0;
    ponteiro.style.rotate = `${(-(vel > 20 ? 8 : 22) * empurra).toFixed(1)}deg`;
    requestAnimationFrame(olha);
  };
  requestAnimationFrame(olha);

  // antecipação: recua um pouco antes de soltar; depois desacelera bem devagar até parar
  return anim(disco, [
    { transform: 'rotate(0deg)', easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
    { transform: 'rotate(-12deg)', offset: 0.05, easing: 'cubic-bezier(0.12, 0.62, 0.06, 1)' },
    { transform: `rotate(${fim}deg)` },
  ], { duration: ms }).then(() => {
    rodando = false;
    ponteiro.style.rotate = '';
    aoTrocar(indice);
  });
}
