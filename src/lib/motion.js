// Motor de movimento (WAAPI), extraído dos mocks. Personalidade "objeto físico": plástico rígido,
// quase sem overshoot (exceção: `elastico`, só no sorteio). Só anima transform e opacity.
// Durações: rápida 140–260ms (controles), padrão 560–760ms (tampa, voo), camada secundária ~1300ms.

// Reduced-motion: tudo pula direto para o quadro final. (Contraste alto não mexe no movimento:
// só tira grão, scanlines e brilho, em motion.css.)
export const calma = window.matchMedia('(prefers-reduced-motion: reduce)');

// Curvas: assinatura (entradas e voo), na tela, saída rápida e queda.
export const SAI = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
export const NA_TELA = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const ENTRA_RAPIDO = 'cubic-bezier(0.4, 0, 1, 1)';
export const GRAVIDADE = 'cubic-bezier(0.55, 0, 1, 0.45)';

// Só para revisar o movimento em dev: ?lento=8 deixa tudo 8x mais devagar.
const LENTO = import.meta.env.DEV
  ? Math.max(1, Number(new URLSearchParams(location.search).get('lento')) || 1)
  : 1;

export const espera = (ms) => new Promise((r) => setTimeout(r, calma.matches ? 0 : ms * LENTO));

// Anima e "grava" o quadro final no estilo do elemento (commitStyles), para não depender de fill.
export function anim(el, quadros, opts = {}) {
  if (calma.matches) {
    const { offset, easing, composite, ...fim } = quadros[quadros.length - 1];
    Object.assign(el.style, fim);
    return Promise.resolve();
  }
  const a = el.animate(quadros, {
    fill: 'both',
    ...opts,
    duration: (opts.duration ?? 0) * LENTO,
    delay: (opts.delay ?? 0) * LENTO,
  });
  return a.finished
    .then(() => {
      a.commitStyles();
      a.cancel();
    })
    .catch(() => {});
}

export const entrar = (els, atraso = 0, passo = 0) =>
  Promise.all(
    [...els].map((el, i) =>
      anim(el, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], {
        duration: 260,
        delay: atraso + i * passo,
        easing: SAI,
      }),
    ),
  );

export const sumir = (els, dur = 160) =>
  Promise.all(
    [...els].map((el) =>
      anim(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(6px)' }], {
        duration: dur,
        easing: ENTRA_RAPIDO,
      }),
    ),
  );

// O Chrome não rola sozinho uma área de rolagem dentro de contexto 3D (preserve-3d):
// a roda do mouse e o dedo rolam o elemento na mão (no fim dele, a rolagem passa pra página).
export function rolaNaMao(el) {
  el.addEventListener(
    'wheel',
    (e) => {
      const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1);
      const max = el.scrollHeight - el.clientHeight;
      if ((d < 0 && el.scrollTop <= 0) || (d > 0 && el.scrollTop >= max - 1)) return;
      e.preventDefault();
      el.scrollTop = Math.max(0, Math.min(max, el.scrollTop + d));
    },
    { passive: false },
  );
  let y0 = null;
  let s0 = 0;
  el.addEventListener('touchstart', (e) => {
    y0 = e.touches[0].clientY;
    s0 = el.scrollTop;
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    if (y0 === null) return;
    const max = el.scrollHeight - el.clientHeight;
    const novo = s0 + (y0 - e.touches[0].clientY);
    if (novo < 0 || novo > max) return;
    e.preventDefault();
    el.scrollTop = novo;
  }, { passive: false });
  el.addEventListener('touchend', () => {
    y0 = null;
  });
}

// Elástico: SÓ para a sequência do sorteio (DESIGN.md, exceção registrada); no resto do site
// o movimento continua "quase sem overshoot". Simula uma mola amortecida de 0 a 1 e devolve
// keyframes amostrados (sem linear(), que iPhone antigo não tem). quadro(p) recebe o progresso
// (passa de 1 e volta) e devolve o keyframe. Uso: const e = elastico(fn); anim(el, e.quadros, { duration: e.ms }).
export function elastico(quadro, { rigidez = 180, amortece = 13, amostras = 36 } = {}) {
  const dt = 1 / 600;
  const xs = [0];
  let x = 0;
  let v = 0;
  for (let t = 0; t < 3; t += dt) {
    v += (-rigidez * (x - 1) - amortece * v) * dt;
    x += v * dt;
    xs.push(x);
    if (Math.abs(x - 1) < 0.002 && Math.abs(v) < 0.02) break;
  }
  const quadros = [];
  for (let i = 0; i < amostras; i++) {
    const p = i === amostras - 1 ? 1 : xs[Math.round((i / (amostras - 1)) * (xs.length - 1))];
    quadros.push({ ...quadro(p), offset: i / (amostras - 1) });
  }
  return { quadros, ms: Math.round(xs.length * dt * 1000) };
}
