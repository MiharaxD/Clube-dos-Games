// Prateleira 3D (portada de rodada-votando.html): o móvel de madeira com nichos em perspectiva,
// cada jogo é um estojo de 6 faces em pé, com o post-it embaixo e as ações na frente do móvel.
// REGRA: nada de filter/opacity/blend/mask/clip-path nos ancestrais da cadeia 3D.
import { DURATION_LABEL, MODE_LABEL, esc, coverSrc } from '../lib/util.js';
import { calma } from '../lib/motion.js';
import { coverPalette, genericCover, priceTag } from './parts.js';

// Props decorativos em cima do móvel (abajur, consoles, capinhas deitadas). O abajur acende a poça âmbar.
export const CENARIO = `<div class="cenario" aria-hidden="true">
  <span class="abajur" data-luz="abajur">
    <svg viewBox="0 0 60 92">
      <defs>
        <linearGradient id="cupula" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a6" /><stop offset="1" stop-color="#e8a04a" /></linearGradient>
      </defs>
      <path d="M15 6h30l11 34H4z" fill="url(#cupula)" />
      <path d="M4 40h52v3H4z" fill="#ffd27a" />
      <path d="M28 43h4v35h-4z" fill="#4a3222" />
      <path d="M16 78h28l5 8H11z" fill="#3a2618" />
      <path d="M16 78h28v2H16z" fill="#6b4a2f" />
    </svg>
  </span>
  <!-- híbrido na base: joy-cons azul e vermelho dos lados, tela apagada pegando o teal da TV -->
  <span class="console-obj console-obj--switch">
    <svg viewBox="0 0 120 80">
      <ellipse cx="60" cy="78" rx="56" ry="2.5" fill="#0c0609" />
      <path d="M25 6h-7A10 10 0 0 0 8 16v48a8 8 0 0 0 8 8h9z" fill="#1d8bad" />
      <path d="M95 6h7a10 10 0 0 1 10 10v48a8 8 0 0 1-8 8h-9z" fill="#c4423a" />
      <path d="M25 6h-7A10 10 0 0 0 8 16v2a10 10 0 0 1 10-10h7z" fill="#5cc3e2" opacity="0.5" />
      <path d="M95 6h7a10 10 0 0 1 10 10v2a10 10 0 0 0-10-10h-7z" fill="#f08a7f" opacity="0.4" />
      <circle cx="16.5" cy="19" r="3.6" fill="#0f4a5e" />
      <path d="M15 39h3v3h-3zM15 47h3v3h-3zM11 43h3v3h-3zM19 43h3v3h-3z" fill="#0f4a5e" />
      <circle cx="103.5" cy="17" r="1.8" fill="#6a1f1a" /><circle cx="103.5" cy="27" r="1.8" fill="#6a1f1a" />
      <circle cx="98.5" cy="22" r="1.8" fill="#6a1f1a" /><circle cx="108.5" cy="22" r="1.8" fill="#6a1f1a" />
      <circle cx="103.5" cy="45" r="3.6" fill="#6a1f1a" />
      <rect x="25" y="6" width="70" height="26" fill="#131216" />
      <rect x="30" y="10" width="60" height="20" fill="#16282a" />
      <path d="M70 10h12L64 30H52z" fill="#46c3b5" opacity="0.12" />
      <path d="M28 25h64l3 53H25z" fill="#232227" />
      <path d="M28 25h64l.3 3H27.8z" fill="#3a3940" />
      <path d="M44 25h32" stroke="#0c0609" stroke-width="1.5" />
      <circle cx="31" cy="72" r="1.1" class="led" fill="#7be36f" />
    </svg>
  </span>
  <!-- console de cartucho empilhado em cima do console de mesa fininho com a barra de luz azul -->
  <span class="console-obj console-obj--pilha so-pc">
    <svg class="snes" viewBox="0 0 140 50">
      <path d="M46 2h48v16H46z" fill="#5c5957" />
      <rect x="52" y="4" width="36" height="9" fill="#f4ecd2" /><rect x="52" y="4" width="36" height="2.5" fill="#b3213f" />
      <rect x="36" y="13" width="68" height="12" rx="3" fill="#77736f" />
      <rect x="4" y="18" width="132" height="30" rx="10" fill="#8f8b86" />
      <rect x="8" y="18" width="124" height="4" rx="2" fill="#aaa6a0" />
      <rect x="14" y="25" width="13" height="5" rx="1.5" fill="#54486f" />
      <rect x="113" y="25" width="13" height="5" rx="1.5" fill="#54486f" />
      <rect x="62" y="27" width="16" height="4" rx="2" fill="#625e94" />
      <rect x="20" y="36" width="12" height="7" rx="1.5" fill="#3a3836" /><rect x="36" y="36" width="12" height="7" rx="1.5" fill="#3a3836" />
      <circle cx="58" cy="39.5" r="1.3" class="led" fill="#ff5c5c" />
    </svg>
    <svg class="ps" viewBox="0 0 180 40">
      <ellipse cx="90" cy="38" rx="86" ry="2" fill="#0c0609" />
      <path d="M11 4h167l-7 17H4z" fill="#1b1a1e" />
      <path d="M11 4h167l-.8 2H10.2z" fill="#3c3b42" />
      <path d="M30 12.5h70" stroke="#0a090c" stroke-width="1.6" />
      <path d="M4 21h167l-1 3H5z" fill="#0c0b0e" />
      <rect x="62" y="18.5" width="48" height="8" fill="#4aa8ff" opacity="0.18" class="led" />
      <rect x="66" y="21.4" width="40" height="2" fill="#6cb8ff" class="led" />
      <path d="M5 24h165l-5 12H11z" fill="#242328" />
    </svg>
  </span>
  <!-- console branco em pé, com o anel verde aceso -->
  <span class="console-obj console-obj--x360">
    <svg viewBox="0 0 44 112">
      <defs>
        <linearGradient id="x360" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c2bdb3" /><stop offset="0.6" stop-color="#a39e94" /><stop offset="1" stop-color="#7f7a72" /></linearGradient>
      </defs>
      <rect x="1" y="104" width="42" height="7" rx="2" fill="#2b2a2f" />
      <path d="M5 4h34q-6 50 0 100H5q6-50 0-100z" fill="url(#x360)" />
      <path d="M5 4h34" stroke="#ddd8cf" stroke-width="1.5" />
      <path d="M29 34v58" stroke="#6e6a62" stroke-width="1.6" stroke-linecap="round" />
      <circle cx="20" cy="18" r="9" fill="#7be36f" opacity="0.16" class="led" />
      <circle cx="20" cy="18" r="5.6" fill="none" stroke="#7be36f" stroke-width="2.2" class="led" />
      <circle cx="20" cy="18" r="3.3" fill="#d8d4cb" />
      <rect x="27" y="14" width="4" height="8" rx="2" fill="#8a857c" />
      <rect x="13" y="76" width="12" height="20" rx="2" fill="none" stroke="#8a857c" stroke-width="1" />
    </svg>
  </span>
  <!-- console preto em pé na base, frente frisada -->
  <span class="console-obj console-obj--ps2 so-pc">
    <svg viewBox="0 0 34 120">
      <path d="M2 110h30l-2 8H4z" fill="#3a3940" />
      <rect x="7" y="4" width="20" height="106" fill="#1a191e" />
      <rect x="7" y="4" width="20" height="2" fill="#3a3941" />
      <rect x="9" y="9" width="16" height="44" fill="#141318" />
      <path d="M10 60h14M10 64h14M10 68h14M10 72h14M10 76h14M10 80h14M10 84h14M10 88h14M10 92h14" stroke="#2d2c33" stroke-width="1.6" />
      <circle cx="13" cy="15" r="1.3" class="led" fill="#62d26a" /><circle cx="21" cy="15" r="1.3" class="led" fill="#3f8cff" />
    </svg>
  </span>
  <!-- portátil de bolso encostado nas capinhas -->
  <span class="console-obj console-obj--gb so-pc">
    <svg viewBox="0 0 40 66">
      <path d="M3 2h34v50q0 12-12 12H5q-2 0-2-2z" fill="#9d998f" />
      <path d="M3 2h34v2H3z" fill="#bdb9ae" />
      <rect x="7" y="7" width="26" height="22" rx="2" fill="#46444f" />
      <rect x="11" y="10" width="18" height="15" fill="#6c7a38" />
      <path d="M9 40h4v-4h3v4h4v3h-4v4h-3v-4H9z" fill="#232227" />
      <circle cx="28" cy="42" r="2.7" fill="#7d2643" /><circle cx="33.5" cy="38.5" r="2.7" fill="#7d2643" />
      <path d="M26 58l6-5M29 60l6-5" stroke="#76726a" stroke-width="1.2" />
    </svg>
  </span>
  <span class="capas-pilha">
    <span class="capinha capinha--mario">Super Mario World</span>
    <span class="capinha capinha--sims"><span class="capinha__losango"></span>The Sims 2</span>
    <span class="capinha capinha--tlou">The Last of Us</span>
    <span class="capinha capinha--gta">GTA San Andreas</span>
  </span>
</div>`;

const FACES = '<span class="rack__face rack__wall"></span><span class="rack__face rack__ceil"></span><span class="rack__face rack__floor"></span><span class="rack__face rack__side rack__side--l"></span><span class="rack__face rack__side rack__side--r"></span>';

// O nicho 3D (decorativo) com o que vai dentro, e o beiço de madeira embaixo.
export const nicho = (dentro) =>
  `<div class="rack__bay" aria-hidden="true"><div class="rack__scene">${FACES}<div class="rack__stage">${dentro}</div></div></div><div class="rack__beico" aria-hidden="true"></div>`;

// Frente do estojo: capa (imagem da RAWG ou caixa genérica), tarja, etiqueta de preço e o que vier por cima.
export function caseFront(game, extra = '') {
  const url = coverSrc(game);
  const img = url ? `<img class="cover__img" src="${esc(url)}" alt="" loading="lazy" onerror="this.remove()">` : '';
  const tag = [DURATION_LABEL[game.duration], MODE_LABEL[game.mode]].filter(Boolean).join(' · ');
  const price = Number.isInteger(game.price) ? priceTag(game.price) : '';
  return `${genericCover(game.name)}${img}${tag ? `<span class="tarja">${esc(tag)}</span>` : ''}${price}${extra}`;
}

// Estojo fechado de 6 faces (frente, lombada, lado, topo).
export function caseHtml(game, extra = '') {
  const { hue } = coverPalette(game.name);
  return `<div class="case" style="--hue: ${hue}">
    <span class="case__face case__front">${caseFront(game, extra)}</span>
    <span class="case__face case__spine"><span>${esc(game.name)}</span></span>
    <span class="case__face case__side"></span><span class="case__face case__top"></span>
  </div>`;
}

// Estojo vazio de plástico: a sua vaga na prateleira.
export const emptyCase = () =>
  '<div class="case case--vazio" style="--hue: 270"><span class="case__face case__front"><span class="capa-vazia"><span>Sua<br>vaga</span></span></span><span class="case__face case__spine"></span><span class="case__face case__side"></span><span class="case__face case__top"></span></div>';

// Post-it de papel colado na frente do móvel (nome à mão + metadados). title e lines já escapados.
export const postit = (title, lines = []) =>
  `<div class="postit"><h3 class="rack__nome">${title}</h3>${lines.filter(Boolean).map((l) => `<p class="rack__meta">${l}</p>`).join('')}</div>`;

// Nicho clicável: um botão invisível por cima da capinha (fora da cadeia 3D) abre a caixinha.
export const vitrine = (inner, label) =>
  `<div class="rack__vitrine">${inner}<button class="rack__abrir" type="button" data-abrir aria-haspopup="dialog"><span class="sr-only">${label}</span></button></div>`;

// Completa a grade com nichos vazios (2 colunas no celular, 4 no PC) pra fileira não ficar banguela.
function fill(slots) {
  const n = slots.length;
  const cel = n % 2;
  const pc = (4 - (n % 4)) % 4;
  const vazios = [];
  for (let i = 0; i < pc; i++) {
    const soPc = i >= cel;
    vazios.push(`<li class="rack__slot rack__slot--vazio${soPc ? ' so-pc' : ''}" aria-hidden="true">${nicho('<span class="rack__spacer"></span>')}<div class="rack__info"></div></li>`);
  }
  return slots.join('') + vazios.join('');
}

// O móvel inteiro: cenário em cima, chão, coroa, a lista de nichos e o rodapé do móvel.
export function rackHtml(slots, label) {
  return `${CENARIO}
    <div class="chao" aria-hidden="true"><div class="chao__carpete"></div></div>
    <div class="movel">
      <span class="movel__coroa" aria-hidden="true"></span>
      <ul class="rack" aria-label="${esc(label)}">${fill(slots)}</ul>
      <span class="movel__base" aria-hidden="true"></span>
    </div>`;
}

// PC com mouse: a caixa inclina e o reflexo do plástico segue o ponteiro.
export function bindTilt(rack) {
  const fino = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 760px)');
  const TILT = ['--tilt-x', '--tilt-y', '--sx', '--sy', '--sa'];
  const reset = (el) => TILT.forEach((p) => el.style.removeProperty(p));
  let current = null;
  let last = null;
  let frame = 0;
  rack.addEventListener('pointermove', (e) => {
    if (!fino.matches || calma.matches) return;
    const box = e.target.closest('.rack__slot')?.querySelector('.case') ?? null;
    if (current && current !== box) reset(current);
    current = box;
    last = e;
    if (!box || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!current) return;
      const r = current.parentElement.getBoundingClientRect();
      const clamp = (v) => Math.max(-0.5, Math.min(0.5, v));
      const x = clamp((last.clientX - r.left) / r.width - 0.5);
      const y = clamp((last.clientY - r.top) / r.height - 0.5);
      current.style.setProperty('--tilt-y', `${(x * 12).toFixed(2)}deg`);
      current.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
      current.style.setProperty('--sx', `${((x + 0.5) * 100).toFixed(1)}%`);
      current.style.setProperty('--sy', `${((y + 0.5) * 100).toFixed(1)}%`);
      current.style.setProperty('--sa', '0.2');
    });
  });
  rack.addEventListener('pointerleave', () => {
    if (current) reset(current);
    current = null;
  });
}
