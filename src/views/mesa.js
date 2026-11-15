// A mesa 3D das fases jogando/encerrada (portada de rodada-jogando.html e rodada-encerrada.html).
// CSS 3D puro: palco (perspectiva + escala) → mundo (câmera) → mesa → objetos (.obj → .mola → caixas).
// Os cliques ficam em botões reais (.alvo) por cima da projeção dos objetos, fora da cadeia 3D.
// Sem filtro, blend, opacidade, máscara ou clip-path em quem tem filhos 3D.
import { calma } from '../lib/motion.js';
import { esc, safeUrl } from '../lib/util.js';
import { placeLights } from '../lib/scene.js';
import { coverPalette } from './parts.js';

// caixa de faces (sem fundo): base no chão do objeto; faces = quais desenhar (f u l r b)
export function caixa({ w, h, t, x = 0, y = 0, z = 0, cls = '', faces = 'fulr', f = '', u = '', l = '', r = '', s = '' }) {
  const face = (k, c) => (faces.includes(k) ? `<i class="${k}">${c}</i>` : '');
  return `<div class="bx ${cls}" style="--w:${w}px;--h:${h}px;--t:${t}px;--bx:${x}px;--by:${y}px;--bz:${z}px;${s}">${face('f', f)}${face('u', u)}${face('l', l)}${face('r', r)}${face('b', '')}</div>`;
}
const obj = (id, [x, z, ry = 0], s, inner) =>
  `<div class="obj" id="${id}" style="--x:${x}px;--z:${z}px;--ry:${ry}deg;--s:${s}"><div class="mola">${inner}</div></div>`;

// Duas composições da mesma mesa: PC (larga) e celular (mais funda). Sem o botão ZEREI e as
// estatuetas dos mocks: "zerou" não existe no modelo de dados.
const LAYOUTS = {
  jogando: {
    pc: { W: 1040, H: 540, cy: 280, cam: -26, mesa: [1000, 440], lamp: [-440, -170, 0], cal: [-300, -10, 20], caso: [-40, 30, -8], console: [260, 10, -12], controle: [200, 150, 14], esc: { cal: 1, caso: 1, console: 1 }, nota: [400, 150] },
    cel: { W: 600, H: 620, cy: 318, cam: -30, mesa: [580, 560], lamp: [-248, -238, 0], cal: [-150, -96, 18], caso: [-40, 120, -6], console: [150, -60, -18], controle: [170, 110, 22], esc: { cal: 0.95, caso: 0.9, console: 0.8 }, nota: [150, 240] },
  },
  encerrada: {
    pc: { W: 1040, H: 560, cy: 300, cam: -26, mesa: [1000, 440], lamp: [-150, -185, 0], quadro: [-305, -40, 16], caso: [40, 40, -4], console: [300, 0, -12], esc: { quadro: 1, caso: 1, console: 1 }, nota: [130, 175], marca: [-130, 165] },
    cel: { W: 600, H: 640, cy: 330, cam: -30, mesa: [580, 560], lamp: [40, -250, 0], quadro: [-150, -150, 14], caso: [-60, 150, -4], console: [160, 60, -18], esc: { quadro: 0.78, caso: 0.85, console: 0.8 }, nota: [60, 250], marca: [-240, 240] },
  },
  // Login: mesa vazia; caem o videogame (esquerda), a TV (direita) e a prancheta do contrato (meio).
  login: {
    pc: { W: 1040, H: 600, cy: 330, cam: -24, mesa: [1000, 440], console: [-300, -20, 16], tv: [280, -50, -16], prancheta: [-10, 90, 0], esc: { console: 0.95, tv: 1, prancheta: 1 } },
    cel: { W: 520, H: 640, cy: 330, cam: -38, mesa: [500, 560], console: [-140, -190, 16], tv: [100, -170, -12], prancheta: [0, 150, 0], esc: { console: 0.6, tv: 0.78, prancheta: 0.8 } },
  },
};

// ------------------------------------------------------------ peças

function mesaHtml(L, nota) {
  const [W, D] = L.mesa;
  const ponto = (x, z) => `left:${x + W / 2}px;top:${z + D / 2}px`;
  const sombra = ([x, z], w, d, de) => `<span class="decal decal--sombra" data-de="${de}" style="${ponto(x, z)};width:${w}px;height:${d}px"></span>`;
  const [lx, lz] = L.lamp ?? [0, 0];
  const decals = [
    L.lamp ? `<span class="decal decal--luz" data-de="abajur-obj" style="${ponto(lx + 180, lz + 120)};width:${W * 0.75}px;height:${D * 1.1}px"></span>` : '',
    L.tv ? `<span class="decal decal--luz decal--luz-tv" style="${ponto(L.tv[0] - 60, L.tv[1] + 160)};width:${W * 0.7}px;height:${D}px"></span>` : '',
    L.cal ? sombra(L.cal, 200 * L.esc.cal, 110 * L.esc.cal, 'cal-obj') : '',
    L.quadro ? sombra(L.quadro, 360 * L.esc.quadro, 110 * L.esc.quadro, 'quadro-obj') : '',
    L.caso ? sombra(L.caso, 190 * L.esc.caso, 60 * L.esc.caso, 'caso-obj') : '',
    L.console ? sombra(L.console, 280 * L.esc.console, 220 * L.esc.console, 'console-obj') : '',
    L.controle ? sombra(L.controle, 150 * L.esc.console, 90 * L.esc.console, 'controle-obj') : '',
    L.tv ? sombra(L.tv, 340 * L.esc.tv, 250 * L.esc.tv, 'tv-obj') : '',
    L.prancheta ? sombra(L.prancheta, 240 * L.esc.prancheta, 90 * L.esc.prancheta, 'prancheta-obj') : '',
    L.lamp ? sombra(L.lamp, 90, 40, 'abajur-obj') : '',
    L.lamp ? `<span class="decal decal--marca" style="${ponto(...(L.marca ?? [lx + 70, lz + 70]))};width:58px;height:58px"></span>` : '',
    nota ? `<span class="decal decal--nota" style="${ponto(...L.nota)}">${esc(nota)}</span>` : '',
  ].join('');
  const pernas = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) =>
    caixa({ w: 44, h: 320, t: 44, x: a * (W / 2 - 56), z: b * (D / 2 - 56), y: -348, cls: 'm-perna', faces: 'flr' })).join('');
  return caixa({ w: W, h: 28, t: D, y: -28, cls: 'm-tampo', u: decals })
    + caixa({ w: W - 90, h: 54, t: D - 90, y: -82, cls: 'm-saia', faces: 'flr' })
    + pernas;
}

function abajurHtml() {
  return `<div class="abajur"><span class="abajur__halo" data-luz="abajur"></span>
    <svg viewBox="0 0 140 190">
      <path d="M14 186q32-16 64 0z" fill="#3a2a22"/><path d="M14 186h64" stroke="#1a1013" stroke-width="3"/>
      <path d="M46 176 L34 104 L92 62" stroke="#8c6646" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="34" cy="104" r="5.5" fill="#8c6646"/><circle cx="92" cy="62" r="5" fill="#8c6646"/>
      <g transform="rotate(32 96 62)">
        <path d="M80 44h32l18 36H62z" fill="#2f4a3e"/><path d="M80 44h32l4 8H76z" fill="#3e6152"/>
        <ellipse cx="96" cy="80" rx="34" ry="7" fill="#ffe3b0"/><ellipse cx="96" cy="80" rx="20" ry="4" fill="#fff6e2"/>
      </g>
    </svg></div>`;
}

// Coroinha de metal do vencedor (joias nas cores de luz da cena).
export function coroaSvg(id) {
  return `<svg viewBox="0 0 72 48" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset="0.45" stop-color="#e3b341"/><stop offset="1" stop-color="#8a6312"/></linearGradient></defs>
    <path d="M8 40 4 14 20 26 36 6 52 26 68 14 64 40Z" fill="url(#${id})" stroke="#0c0609" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M14 30 20 26 36 6" fill="none" stroke="#fff6d6" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <rect x="6" y="38" width="60" height="9" fill="#c99a2e" stroke="#0c0609" stroke-width="2.5"/>
    <g stroke="#0c0609" stroke-width="2"><circle cx="4" cy="13" r="3.6" fill="#fff0b0"/><circle cx="36" cy="5" r="4" fill="#fff0b0"/><circle cx="68" cy="13" r="3.6" fill="#fff0b0"/>
    <circle cx="36" cy="27" r="4.6" fill="#ff5c8a"/><circle cx="21" cy="33" r="2.8" fill="#46c3b5"/><circle cx="51" cy="33" r="2.8" fill="#46c3b5"/></g>
  </svg>`;
}

// Capinha do jogo em pé na mesa, com a coroa. front = HTML da capa (já escapado).
function casoHtml(name, front) {
  return caixa({ w: 168, h: 224, t: 22, cls: 'm-estojo', f: front, l: `<span>${esc(name)}</span>`, s: `--hue:${coverPalette(name).hue}` })
    + `<div class="coroa" style="--cx:-22px;--cy:224px">${coroaSvg('coroa-mesa')}</div>`;
}

function consoleHtml() {
  const frente = `<span class="cn__fenda"></span><span class="cn__led"></span><span class="cn__power"></span>
    <span class="cn__porta cn__porta--1"></span><span class="cn__porta cn__porta--2"></span><span class="cn__marca">SX 64</span>`;
  return caixa({ w: 250, h: 54, t: 190, cls: 'm-console', f: frente, u: '<span class="cn__logo">SEXTA</span>' })
    + caixa({ w: 236, h: 6, t: 176, y: -6, cls: 'm-console', faces: 'f' });
}

function controleHtml() {
  const corpo = 'M30 22h96c14 0 24 10 28 26l2 30c1 12-10 18-20 10l-18-16H38L20 88c-10 8-21 2-20-10l2-30C6 32 16 22 30 22z';
  const camadas = [0, 2, 4, 6].map((dy) => `<div class="camada" style="--dy:${dy}px"><svg viewBox="0 0 156 100"><path d="${corpo}" fill="#141217"/></svg></div>`).join('');
  const topo = `<div class="camada" style="--dy:8px"><svg viewBox="0 0 156 100">
    <path d="${corpo}" fill="#2b2930"/><path d="M30 22h96c14 0 24 10 28 26" fill="none" stroke="#45424c" stroke-width="2"/>
    <path d="M38 44h8v-8h8v8h8v8h-8v8h-8v-8h-8z" fill="#111014"/>
    <circle cx="114" cy="38" r="5" fill="#ff5c8a"/><circle cx="126" cy="48" r="5" fill="#46c3b5"/><circle cx="102" cy="48" r="5" fill="#ffc15e"/><circle cx="114" cy="58" r="5" fill="#9fd16b"/>
    <circle cx="62" cy="70" r="9" fill="#111014"/><circle cx="94" cy="70" r="9" fill="#111014"/></svg></div>`;
  return `<div class="controle3d">${camadas}${topo}</div>`;
}

// Calendário de mesa (cavalete): a folha da frente é a miniatura da folha do modal.
// mini = { mes, ano, ini, fim, of: Set(dias oferecidos), sel: Set(dias seus), nota }
function calHtml(mini) {
  let g = '<span></span>'.repeat(mini.ini);
  for (let d = 1; d <= mini.fim; d++) g += `<span class="${mini.sel.has(d) ? 'sel' : mini.of.has(d) ? 'of' : ''}">${d}</span>`;
  return `<div class="cal3d"><div class="cal3d__tras"></div><div class="cal3d__frente" data-cal-frente>
    <div class="mini__aros"></div><div class="mini__topo">${esc(mini.mes)} <small>${mini.ano}</small></div><div class="mini__grade">${g}</div>
    <span class="mini__nota">${esc(mini.nota)}</span></div></div>`;
}

// Quadro de cortiça no cavalete: miniaturas das páginas (foto + rabiscos); o texto fica no modal.
const ROTQ = ['-2.4deg', '1.8deg', '-1deg', '2.6deg', '-1.8deg', '0.8deg', '-2.8deg', '1.2deg'];
const TACHAS = ['var(--amber)', 'var(--teal)', 'var(--pink)', 'var(--paper)'];
function quadroHtml(pages) {
  const minis = pages.slice(0, 8).map((p, i) => {
    const c = i % 4;
    const r = Math.floor(i / 4);
    const w = ['82%', '64%', '74%', '56%'];
    const rabiscos = [0, 1, 2].map((k) => `<span class="qm__rabisco" style="--w:${w[(i + k) % 4]}"></span>`).join('');
    const photo = safeUrl(p.photo);
    const foto = photo ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer">` : `<b>${esc(p.initial)}</b>`;
    return `<span class="qm" style="left:${26 + c * 70}px;top:${48 + r * 92}px;--r:${ROTQ[i % ROTQ.length]};--tacha:${TACHAS[i % TACHAS.length]}">
      <span class="qm__foto">${foto}</span>${rabiscos}<span class="tacha"></span></span>`;
  }).join('');
  const face = `<span class="qm-faixa">Resenha</span>${minis}`;
  return caixa({ w: 40, h: 30, t: 74, x: -112, cls: 'm-perna' }) + caixa({ w: 40, h: 30, t: 74, x: 112, cls: 'm-perna' })
    + `<div class="quadro3d">${caixa({ w: 320, h: 244, t: 16, y: 24, cls: 'm-quadro', f: face })}</div>`;
}

// TV de tubo da mesa do login: carcaça + tubo atrás; o vidro repete o texto da tela (aria-hidden,
// o texto de verdade fica num h1/p escondido na seção).
function tvHtml(titulo, texto) {
  const frente = `<span class="tvm__caixa"><span class="tvm__moldura"><span class="tvm__vidro" data-luz="tv">
      <span class="tvm__osd">CANAL 3</span><span class="tvm__titulo">${esc(titulo)}</span><span class="tvm__texto">${esc(texto)}</span>
      <span class="tvm__rolo"></span></span></span>
    <span class="tvm__painel"><span class="tvm__botao"></span><span class="tvm__botao"></span><span class="tvm__grade"></span></span></span>`;
  return caixa({ w: 330, h: 250, t: 230, cls: 'm-tv', faces: 'fulrb', f: frente })
    + caixa({ w: 230, h: 170, t: 120, y: 34, z: -175, cls: 'm-tubo', faces: 'ulrb' })
    + '<div class="tvm__antena"></div>';
}

// Conteúdo do contrato (usado na prancheta 3D e na prancheta em evidência).
export function contratoHtml(idTitulo = '') {
  return `<span class="contrato__clipe"></span>
    <span class="contrato__papel">
      <span class="contrato__titulo"${idTitulo ? ` id="${idTitulo}" tabindex="-1"` : ''}>Contrato de sócio</span>
      <span class="contrato__clausula">1. Sugerir um jogo por rodada.</span>
      <span class="contrato__clausula">2. Votar nos jogos dos outros (no seu não, calma).</span>
      <span class="contrato__clausula">3. Jogar e aparecer na resenha.</span>
      <span class="contrato__botao">Entrar com Google</span>
      <span class="contrato__assina"><span>x</span></span>
    </span>`;
}

// Prancheta apoiada num cavalete, inclinada pra câmera.
function pranchetaHtml() {
  return `<div class="prancheta3d"><div class="prancheta3d__tras"></div><div class="prancheta prancheta3d__frente">${contratoHtml()}</div></div>`;
}

// Videogame do login: console + controle ao lado (o controle voa no clique, por isso .voo).
function videogameHtml() {
  return consoleHtml() + `<div class="controle-pos"><div class="voo">${controleHtml()}</div></div>`;
}

// ------------------------------------------------------------ montagem

// opts: { fase: 'jogando'|'encerrada', game, front, mini, pages, nota, alvos: [{ obj, label, attr }] }
export function mesaSection(opts) {
  const alvos = opts.alvos.map((a) =>
    `<button class="alvo" type="button" data-obj="${a.obj}" ${a.attr ?? ''} ${a.popup === false ? '' : 'aria-haspopup="dialog"'}><span class="sr-only">${a.label}</span></button>`).join('');
  return `<section class="mesa-sec" aria-labelledby="mesa-titulo">
    <h2 class="sr-only" id="mesa-titulo">A mesa da rodada</h2>
    <div class="palco-wrap">
      <div class="palco" aria-hidden="true"><div class="mundo"><div class="mesa"></div></div></div>
      <span class="palco-chao" aria-hidden="true"></span>
      ${alvos}
    </div>
  </section>`;
}

// Desenha a mesa dentro da seção e liga escala, alvos e câmera. Devolve { remonta, objetos }.
export function mountMesa(section, opts) {
  const wrap = section.querySelector('.palco-wrap');
  const palco = section.querySelector('.palco');
  const mundo = section.querySelector('.mundo');
  const mesa = section.querySelector('.mesa');
  const largo = window.matchMedia('(min-width: 760px)');
  let L;

  function monta() {
    L = LAYOUTS[opts.fase][largo.matches ? 'pc' : 'cel'];
    palco.style.width = `${L.W}px`;
    palco.style.height = `${L.H}px`;
    mundo.style.top = `${L.cy}px`;
    mundo.style.setProperty('--cam', `${L.cam}deg`);
    let html = mesaHtml(L, opts.nota) + (L.lamp ? obj('abajur-obj', L.lamp, 1, abajurHtml()) : '');
    if (L.cal) html += obj('cal-obj', L.cal, L.esc.cal, calHtml(opts.mini));
    if (L.quadro) html += obj('quadro-obj', L.quadro, L.esc.quadro, quadroHtml(opts.pages ?? []));
    if (L.caso) html += obj('caso-obj', L.caso, L.esc.caso, casoHtml(opts.game.name, opts.front));
    if (L.console) html += obj('console-obj', L.console, L.esc.console, L.tv ? videogameHtml() : consoleHtml());
    if (L.tv) html += obj('tv-obj', L.tv, L.esc.tv, tvHtml(opts.tvTitulo, opts.tvTexto));
    if (L.prancheta) html += obj('prancheta-obj', L.prancheta, L.esc.prancheta, pranchetaHtml());
    if (L.controle) html += obj('controle-obj', L.controle, L.esc.console, controleHtml());
    mesa.innerHTML = html;
    escala();
  }

  function escala() {
    if (!section.isConnected) return;
    const k = Math.min(1.08, wrap.clientWidth / L.W);
    palco.style.scale = k;
    wrap.style.height = `${Math.round(L.H * k)}px`;
    posicionaAlvos();
    placeLights();
  }

  // Os botões reais ficam por cima da projeção dos objetos (mínimo 44px).
  const PECAS = {
    'cal-obj': ['[data-cal-frente]'],
    'caso-obj': ['.m-estojo > .f', '.coroa'],
    'quadro-obj': ['.m-quadro > .f'],
    'console-obj': ['.m-console', '.controle3d .camada'],
    'tv-obj': ['.m-tv > .f', '.m-tv > .u'],
    'prancheta-obj': ['.prancheta3d__frente'],
  };
  function posicionaAlvos() {
    const base = wrap.getBoundingClientRect();
    wrap.querySelectorAll('.alvo').forEach((alvo) => {
      const o = mesa.querySelector(`#${alvo.dataset.obj}`);
      const pecas = PECAS[alvo.dataset.obj];
      const els = pecas ? pecas.flatMap((s) => [...(o?.querySelectorAll(s) ?? [])]) : [o?.querySelector('.bx')].filter(Boolean);
      if (!els.length) return;
      const rs = els.map((e) => e.getBoundingClientRect());
      const l = Math.min(...rs.map((r) => r.left));
      const t = Math.min(...rs.map((r) => r.top));
      const rw = Math.max(...rs.map((r) => r.right)) - l;
      const rh = Math.max(...rs.map((r) => r.bottom)) - t;
      const w = Math.max(44, rw + 12);
      const h = Math.max(44, rh + 12);
      Object.assign(alvo.style, { left: `${l - base.left + rw / 2 - w / 2}px`, top: `${t - base.top + rh / 2 - h / 2}px`, width: `${w}px`, height: `${h}px` });
    });
  }

  // Câmera acompanha o mouse de leve (só PC com mouse, sem reduced-motion).
  const fino = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 760px)');
  const cam = { y: 0, p: 0, ay: 0, ap: 0, on: false };
  function passoCam() {
    cam.y += (cam.ay - cam.y) * 0.08;
    cam.p += (cam.ap - cam.p) * 0.08;
    mundo.style.setProperty('--yaw', `${cam.y.toFixed(3)}deg`);
    mundo.style.setProperty('--pitch', `${cam.p.toFixed(3)}deg`);
    posicionaAlvos();
    if (Math.abs(cam.ay - cam.y) + Math.abs(cam.ap - cam.p) > 0.01) requestAnimationFrame(passoCam);
    else cam.on = false;
  }
  const liga = () => {
    if (!cam.on) {
      cam.on = true;
      requestAnimationFrame(passoCam);
    }
  };
  section.addEventListener('pointermove', (e) => {
    if (!fino.matches || calma.matches || section.dataset.ocupado) return;
    const r = wrap.getBoundingClientRect();
    cam.ay = ((e.clientX - r.left) / r.width - 0.5) * 8;
    cam.ap = ((e.clientY - r.top) / r.height - 0.5) * -4;
    liga();
  });
  section.addEventListener('pointerleave', () => {
    cam.ay = 0;
    cam.ap = 0;
    liga();
  });

  // hover/foco no botão real levanta o objeto (feedback < 200ms)
  const levanta = (e, sim) => {
    const b = e.target.closest?.('.alvo');
    if (b) mesa.querySelector(`#${b.dataset.obj}`)?.classList.toggle('ativo', sim);
  };
  wrap.addEventListener('pointerover', (e) => levanta(e, true));
  wrap.addEventListener('pointerout', (e) => levanta(e, false));
  wrap.addEventListener('focusin', (e) => levanta(e, true));
  wrap.addEventListener('focusout', (e) => levanta(e, false));

  monta();
  new ResizeObserver(() => escala()).observe(wrap);
  largo.addEventListener('change', () => section.isConnected && monta());
  document.fonts?.ready.then(() => section.isConnected && escala());

  return {
    mesa,
    alinha: posicionaAlvos,
    remonta: (novo) => {
      Object.assign(opts, novo);
      monta();
    },
    escalaAtual: () => (parseFloat(palco.style.scale) || 1) * Math.cos((L.cam * Math.PI) / 180),
  };
}
