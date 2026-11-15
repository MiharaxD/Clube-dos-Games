// A cena atrás da interface: luz motivada (as poças nascem dos objetos na tela),
// flicker raro do letreiro e parallax da parede no PC. Tudo decorativo.
import { calma } from './motion.js';

// Objetos que emitem luz: marque com data-luz="tv" | "abajur" | "neon".
// Objeto ausente na tela = luz apagada (raio 0).
const FONTES = {
  tv: { fy: 0.5, raio: (r) => r.width * 2.6, vars: ['--tv-x', '--tv-y', '--tv-r'] },
  abajur: { fy: 0.35, raio: (r) => r.width * 4.5, vars: ['--lamp-x', '--lamp-y', '--lamp-r'] },
};

export function placeLights() {
  const luz = document.getElementById('cena-luz');
  if (!luz) return;
  const page = document.body.getBoundingClientRect();
  const set = (k, v) => luz.style.setProperty(k, `${Math.round(v)}px`);
  const visible = (el) => el && el.getClientRects().length > 0;

  for (const [nome, f] of Object.entries(FONTES)) {
    const el = document.querySelector(`[data-luz="${nome}"]`);
    if (!visible(el)) {
      set(f.vars[2], 0);
      continue;
    }
    const r = el.getBoundingClientRect();
    set(f.vars[0], r.left - page.left + r.width / 2);
    set(f.vars[1], r.top - page.top + r.height * f.fy);
    set(f.vars[2], f.raio(r));
  }

  const neon = document.querySelector('[data-luz="neon"]');
  if (visible(neon)) {
    const r = neon.getBoundingClientRect();
    set('--neon-x', r.left - page.left + r.width / 2);
    set('--neon-y', r.top - page.top + r.height / 2);
    set('--neon-w', r.width * 0.85);
    set('--neon-h', r.height * 0.9);
  } else {
    set('--neon-w', 0);
    set('--neon-h', 0);
  }
}

// Flicker do letreiro: uma letra, um quadro, no máximo a cada 20–40 s. Desliga em reduced-motion/contraste.
function flickerLater() {
  setTimeout(() => {
    const letters = document.querySelectorAll('.neon__l');
    if (!calma.matches && document.visibilityState === 'visible' && letters.length) {
      const l = letters[Math.floor(Math.random() * letters.length)];
      l.classList.add('apaga');
      setTimeout(() => l.classList.remove('apaga'), 70);
    }
    flickerLater();
  }, 20000 + Math.random() * 20000);
}

// Parallax do PC: a parede acompanha o olho (amplitude ≤ 20px, só transform).
function wallParallax() {
  const fino = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 760px)');
  const wall = document.getElementById('cena-parede');
  if (!wall) return;
  let px = 0;
  let py = 0;
  let frame = 0;
  window.addEventListener('pointermove', (e) => {
    if (!fino.matches || calma.matches) return;
    px = e.clientX / innerWidth - 0.5;
    py = e.clientY / innerHeight - 0.5;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      wall.style.transform = `translate3d(${(px * 18).toFixed(1)}px, ${(py * 10).toFixed(1)}px, 0)`;
      // a TV 3D gira um pouco com o mesmo olhar (ver .tv-palco em scene.css)
      for (const p of document.querySelectorAll('.tv-palco')) {
        p.style.setProperty('--olho-x', px.toFixed(3));
        p.style.setProperty('--olho-y', py.toFixed(3));
      }
    });
  }, { passive: true });
  calma.addEventListener('change', () => {
    if (!calma.matches) return;
    wall.style.removeProperty('transform');
    for (const p of document.querySelectorAll('.tv-palco')) {
      p.style.removeProperty('--olho-x');
      p.style.removeProperty('--olho-y');
    }
  });
}

let started = false;
export function startScene() {
  if (started) return;
  started = true;
  new ResizeObserver(() => placeLights()).observe(document.body);
  document.fonts?.ready.then(placeLights);
  flickerLater();
  wallParallax();
}
