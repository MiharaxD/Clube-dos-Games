// A mesa 3D das fases jogando/encerrada (portada de rodada-jogando.html e rodada-encerrada.html).
// CSS 3D puro: palco (perspectiva + escala) → mundo (câmera) → mesa → objetos (.obj → .mola → caixas).
// Os cliques ficam em botões reais (.alvo) por cima da projeção dos objetos, fora da cadeia 3D.
// Sem filtro, blend, opacidade, máscara ou clip-path em quem tem filhos 3D.
import { GRAVIDADE, SAI, anim, calma } from '../lib/motion.js';
import { esc, safeUrl } from '../lib/util.js';
import { placeLights } from '../lib/scene.js';
import { coverPalette } from './parts.js';

// caixa de faces (sem fundo): base no chão do objeto; faces = quais desenhar (f u l r b)
export function caixa({ w, h, t, x = 0, y = 0, z = 0, cls = '', faces = 'fulr', f = '', u = '', l = '', r = '', s = '' }) {
  const face = (k, c) => (faces.includes(k) ? `<i class="${k}">${c}</i>` : '');
  return `<div class="bx ${cls}" style="--w:${w}px;--h:${h}px;--t:${t}px;--bx:${x}px;--by:${y}px;--bz:${z}px;${s}">${face('f', f)}${face('u', u)}${face('l', l)}${face('r', r)}${face('b', '')}</div>`;
}
// y (opcional) sobe o objeto: a capinha em pé em cima do videogame
const obj = (id, [x, z, ry = 0], s, inner, y = 0, extra = '') =>
  `<div class="obj" id="${id}" style="--x:${x}px;--z:${z}px;--y:${y}px;--ry:${ry}deg;--s:${s};${extra}"><div class="mola">${inner}</div></div>`;

// Duas composições da mesma mesa: PC (larga) e celular (mais funda).
// Jogando: videogame no meio com a capinha em pé em cima, botão ZEREI na ponta e o quadro de
// jogando (diario) grande à direita; estatuetas de quem zerou na prateleira da parede, atrás da mesa (est).
// Encerrada: quadro de resenha + o quadro de jogando guardado no fundo.
const LAYOUTS = {
  jogando: {
    pc: { W: 1040, H: 1000, cy: 740, po: 532, cam: -26, mesa: [1000, 440], lamp: [-440, -170, 0], cal: [-315, -10, 20], console: [-70, 40, -8], controle: [105, 172, 14], retrato: [-310, 188, 10],
      est: { dx: 150, larg: 960, z: -270, s: 0.95, y: 230 }, botao: [432, 130, -12], diario: [235, -60, -8],
      esc: { cal: 1, caso: 1, console: 1, botao: 0.95, diario: 1.02, retrato: 0.82 }, nota: [-300, 160], notaZ: [330, 196] },
    cel: { W: 600, H: 960, cy: 680, po: 444, cam: -30, mesa: [580, 560], lamp: [-248, -238, 0], cal: [-178, -112, 18], console: [-8, 118, -6], controle: [62, 238, 18], retrato: [-215, 150, 14],
      est: { dx: 90, larg: 560, z: -295, s: 0.62, y: 200 }, botao: [205, 196, -12], diario: [160, -70, -6],
      esc: { cal: 0.95, caso: 0.85, console: 0.8, botao: 0.85, diario: 0.74, retrato: 0.85 }, nota: [-205, 70], notaZ: [180, 272] },
  },
  encerrada: {
    pc: { W: 1040, H: 560, cy: 300, cam: -26, mesa: [1000, 440], lamp: [-150, -185, 0], quadro: [-305, -40, 16], caso: [40, 40, -4], console: [300, 0, -12], diario: [205, -168, -8], esc: { quadro: 1, caso: 1, console: 1, diario: 0.72 }, nota: [130, 175], marca: [-130, 165] },
    cel: { W: 600, H: 640, cy: 330, cam: -30, mesa: [580, 560], lamp: [40, -250, 0], quadro: [-150, -150, 14], caso: [-60, 150, -4], console: [160, 60, -18], diario: [178, -196, -10], esc: { quadro: 0.78, caso: 0.85, console: 0.8, diario: 0.52 }, nota: [60, 250], marca: [-240, 240] },
  },
  // Login: mesa vazia; caem o videogame (esquerda), a TV (direita) e a prancheta do contrato (meio).
  login: {
    pc: { W: 1040, H: 600, cy: 330, cam: -24, mesa: [1000, 440], console: [-300, -20, 16], tv: [280, -50, -16], prancheta: [-10, 90, 0], esc: { console: 0.95, tv: 1, prancheta: 1 } },
    cel: { W: 520, H: 640, cy: 330, cam: -38, mesa: [500, 560], console: [-140, -190, 16], tv: [100, -170, -12], prancheta: [0, 150, 0], esc: { console: 0.6, tv: 0.78, prancheta: 0.8 } },
  },
};

// ------------------------------------------------------------ peças

// Prateleira de parede atrás da mesa: uma tábua flutuando (com mão-francesa), com uma vaga por
// sócio (opts.vagas). est = { dx: vão ideal, larg: largura máx. da tábua, z, s: escala, y: altura }.
// Com muita gente o vão encolhe pra caber na largura (e os balões passam a alternar altura).
function geoPrat(est, vagas) {
  const cols = Math.max(1, vagas);
  const dx = Math.min(est.dx, est.larg / cols);
  return { ...est, cols, dx, x0: -((cols - 1) * dx) / 2 };
}
// Assentos: o 1º no meio da tábua, o 2º à esquerda dele, o 3º à direita, 4º mais à esquerda...
const assento = (i) => (i === 0 ? 0 : i % 2 ? -(i + 1) / 2 : i / 2);
const meioAssentos = (n) => (-Math.floor(n / 2) + Math.floor((n - 1) / 2)) / 2;
// lugar da estatueta i: [x, z, altura da tábua]
const slot = (L, i) => [(assento(i) - meioAssentos(L.est.cols)) * L.est.dx, L.est.z, L.est.y];
// paridade do assento (da esquerda pra direita), pra alternar a altura dos balões
const parAssento = (L, i) => (assento(i) + Math.floor(L.est.cols / 2)) % 2;
// tamanho por posição: o 1º é o maior de longe
const TAMANHO = [1.4, 1.15, 1.05];
const tam = (i) => TAMANHO[i] ?? 0.9;
function prateleiraHtml(L) {
  const { dx, z, cols, y } = L.est;
  const w = cols * dx + 24;
  const mao = (lado) => caixa({ w: 8, h: 34, t: 30, x: lado * (w / 2 - 30), y: y - 44, z: -8, cls: 'm-prat m-prat--mao', faces: 'flr' });
  return obj('prat-obj', [0, z, 0], 1, caixa({ w, h: 10, t: 46, y: y - 10, cls: 'm-prat', faces: 'fulr' }) + mao(-1) + mao(1));
}

function mesaHtml(L, nota, notaZ) {
  const [W, D] = L.mesa;
  const ponto = (x, z) => `left:${x + W / 2}px;top:${z + D / 2}px`;
  const sombra = ([x, z], w, d, de) => `<span class="decal decal--sombra" data-de="${de}" style="${ponto(x, z)};width:${w}px;height:${d}px"></span>`;
  const [lx, lz] = L.lamp ?? [0, 0];
  const decals = [
    L.lamp ? `<span class="decal decal--luz" data-de="abajur-obj" style="${ponto(lx + 180, lz + 120)};width:${W * 0.75}px;height:${D * 1.1}px"></span>` : '',
    L.tv ? `<span class="decal decal--luz decal--luz-tv" style="${ponto(L.tv[0] - 60, L.tv[1] + 160)};width:${W * 0.7}px;height:${D}px"></span>` : '',
    L.cal ? sombra(L.cal, 200 * L.esc.cal, 110 * L.esc.cal, 'cal-obj') : '',
    L.retrato ? sombra(L.retrato, 130 * L.esc.retrato, 70 * L.esc.retrato, 'retrato-obj') : '',
    L.quadro ? sombra(L.quadro, 360 * L.esc.quadro, 110 * L.esc.quadro, 'quadro-obj') : '',
    L.caso ? sombra(L.caso, 190 * L.esc.caso, 60 * L.esc.caso, 'caso-obj') : '',
    L.diario ? sombra(L.diario, 360 * L.esc.diario, 110 * L.esc.diario, 'diario-obj') : '',
    L.botao ? sombra(L.botao, 140 * L.esc.botao, 130 * L.esc.botao, 'botao-obj') : '',
    L.console ? sombra(L.console, 280 * L.esc.console, 220 * L.esc.console, 'console-obj') : '',
    L.controle ? sombra(L.controle, 150 * L.esc.console, 90 * L.esc.console, 'controle-obj') : '',
    L.tv ? sombra(L.tv, 340 * L.esc.tv, 250 * L.esc.tv, 'tv-obj') : '',
    L.prancheta ? sombra(L.prancheta, 240 * L.esc.prancheta, 90 * L.esc.prancheta, 'prancheta-obj') : '',
    L.lamp ? sombra(L.lamp, 90, 40, 'abajur-obj') : '',
    L.lamp ? `<span class="decal decal--marca" style="${ponto(...(L.marca ?? [lx + 70, lz + 70]))};width:58px;height:58px"></span>` : '',
    nota ? `<span class="decal decal--nota" style="${ponto(...L.nota)}">${esc(nota)}</span>` : '',
    notaZ && L.notaZ ? `<span class="decal decal--nota decal--nota-z" style="${ponto(...L.notaZ)}">${esc(notaZ)}</span>` : '',
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

// Porta-retrato de mesa (jogando): a foto do ganhador da votação, que o admin põe clicando nele.
// foto = JPEG em data URL (ou vazio); nome = de quem sugeriu o jogo; vazio = moldura esperando a foto.
function retratoHtml(foto, nome, podeTrocar) {
  const dentro = foto
    ? `<img src="${esc(foto)}" alt="">`
    : `<span class="retrato3d__vazio">${podeTrocar ? 'toca pra pôr a foto do ganhador' : 'foto do ganhador em breve'}</span>`;
  return `<div class="retrato3d"><div class="retrato3d__pe"></div><div class="retrato3d__frente" data-retrato>
    <span class="retrato3d__foto">${dentro}</span>${nome ? `<span class="retrato3d__placa">${esc(nome)}</span>` : ''}</div></div>`;
}

// Quadro de cortiça no cavalete: miniaturas das páginas (foto + rabiscos); o texto fica no modal.
const ROTQ = ['-2.4deg', '1.8deg', '-1deg', '2.6deg', '-1.8deg', '0.8deg', '-2.8deg', '1.2deg'];
const TACHAS = ['var(--amber)', 'var(--teal)', 'var(--pink)', 'var(--paper)'];
function quadroHtml(pages) {
  return cavalete('Resenha', pages.slice(0, 8).map((p, i) => {
    const c = i % 4;
    const r = Math.floor(i / 4);
    const w = ['82%', '64%', '74%', '56%'];
    const rabiscos = [0, 1, 2].map((k) => `<span class="qm__rabisco" style="--w:${w[(i + k) % 4]}"></span>`).join('');
    const photo = safeUrl(p.photo);
    const foto = photo ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer">` : `<b>${esc(p.initial)}</b>`;
    return `<span class="qm" style="left:${26 + c * 70}px;top:${48 + r * 92}px;--r:${ROTQ[i % ROTQ.length]};--tacha:${TACHAS[i % TACHAS.length]}">
      <span class="qm__foto">${foto}</span>${rabiscos}<span class="tacha"></span></span>`;
  }).join(''));
}
// Quadro de jogando: post-its miniatura das notinhas (de todas as páginas), sem texto.
const PAPEIS = ['#ffd77a', '#9fe0d4', '#ffb3c6', '#d6ef9f', '#fbf6e6'];
function diarioHtml(qtd) {
  const minis = Array.from({ length: Math.min(qtd, 10) }, (_, i) => {
    const c = i % 5;
    const r = Math.floor(i / 5);
    return `<span class="qn" style="left:${28 + c * 56}px;top:${58 + r * 80}px;--r:${ROTQ[(i + 3) % ROTQ.length]};--papel:${PAPEIS[i % PAPEIS.length]};--tacha:${TACHAS[i % TACHAS.length]}">
      <span class="qm__rabisco" style="--w:80%"></span><span class="qm__rabisco" style="--w:56%"></span><span class="tacha"></span></span>`;
  }).join('');
  return cavalete('Jogando', minis);
}
function cavalete(titulo, minis) {
  const face = `<span class="qm-faixa">${titulo}</span>${minis}`;
  return caixa({ w: 40, h: 30, t: 74, x: -112, cls: 'm-perna' }) + caixa({ w: 40, h: 30, t: 74, x: 112, cls: 'm-perna' })
    + `<div class="quadro3d">${caixa({ w: 320, h: 244, t: 16, y: 24, cls: 'm-quadro', f: face })}</div>`;
}

// ------------------------------------------------------------ zerei: botão e estatuetas

// material por posição: ouro, prata, bronze e depois metais próprios (até 12 pessoas)
export const METAIS = [
  { nome: 'ouro', m: '#e3b341', m2: '#fff0b0', m3: '#8a6312' },
  { nome: 'prata', m: '#c4c9d1', m2: '#f4f6fa', m3: '#6e737c' },
  { nome: 'bronze', m: '#c27a43', m2: '#f2c08e', m3: '#6d3f1c' },
  { nome: 'pátina', m: '#8fa36b', m2: '#d8e6b4', m3: '#4c5a32' },
  { nome: 'ametista', m: '#a585c4', m2: '#e2d2f2', m3: '#55406e' },
  { nome: 'cobre rosé', m: '#d68a7c', m2: '#f6cdc4', m3: '#7a3f36' },
  { nome: 'jade', m: '#5fae98', m2: '#bfe7da', m3: '#2c5c4f' },
  { nome: 'ferro', m: '#9a8e88', m2: '#d6ccc6', m3: '#4a403c' },
  { nome: 'âmbar', m: '#d79a4a', m2: '#f6d6a2', m3: '#6e4a1c' },
  { nome: 'cobalto', m: '#7d93c9', m2: '#d0dbf3', m3: '#3a4a74' },
  { nome: 'latão', m: '#b8a960', m2: '#ece2ad', m3: '#5e5428' },
  { nome: 'granada', m: '#b9636f', m2: '#ecbcc3', m3: '#5f2b33' },
];
const PEDESTAL = [36, 30, 26];
const metalVars = (i) => {
  const m = METAIS[i % METAIS.length];
  return `--m:${m.m};--m2:${m.m2};--m3:${m.m3}`;
};

// botão de fliperama: base com plaquinha + cúpula de discos empilhados
function botaoHtml(placa) {
  const discos = Array.from({ length: 8 }, (_, i) => `<span class="disco${i === 7 ? ' disco--topo' : ''}" style="--dy:${i * 2}px;${i < 7 ? `background:${i < 3 ? '#8f5e1b' : '#b77b26'}` : ''}"></span>`).join('');
  return caixa({ w: 112, h: 34, t: 112, cls: 'm-base', f: `<span class="placa-zerei">${esc(placa)}</span>` })
    + `<div class="cupula">${discos}</div>`;
}

// Balões de recado: têm sempre o mesmo tamanho na tela (desfazem o tamanho da estatueta). Se o vão
// entre estatuetas é mais largo que o balão (.balao3d tem 140px), cada um fica em cima da sua cabeça;
// senão todos alinham numa linha só, alternando dois andares pela paridade do assento, com o andar
// mais alto que o balão mais alto (10 linhas). Assim nenhum tampa o outro.
const BALAO_LARG = 150;
const BALAO_ANDAR = 192;
const BALAO_SOBE = 150; // da base do boneco (y0) até o pé do balão
const COROA = 34; // o 1º tem coroa na cabeça: o balão sobe isso
function balaoPos(L, i) {
  const k = tam(i);
  const y0 = (PEDESTAL[i] ?? 22) + 6;
  if (L.est.dx / L.est.s >= BALAO_LARG) return { hy: y0 + BALAO_SOBE + (i === 0 ? COROA : 0), k };
  const linha = TAMANHO[0] * (PEDESTAL[0] + 6 + BALAO_SOBE + COROA); // acima da cabeça mais alta
  return { hy: (linha + parAssento(L, i) * BALAO_ANDAR) / k, k };
}

// Glória do pódio (atrás e em volta do boneco, sempre virada pra câmera):
// 1º = raios dourados girando + holofote + brilhos piscando + coroa; 2º e 3º = aura do metal + brilhos.
function gloriaHtml(i, y0, idCoroa) {
  if (i > 2) return '';
  const brilhos = (n) => Array.from({ length: n }, (_, k) => `<span class="brilho" style="--b:${k}"></span>`).join('');
  if (i > 0) return `<div class="bb3d aura3d" style="--hy:${y0 + 60}px;--bz:-24px"><span class="aura"></span>${brilhos(3)}</div>`;
  return `<div class="bb3d holofote3d" style="--hy:${-6}px;--bz:-34px"></div>`
    + `<div class="bb3d gloria3d" style="--hy:${y0 + 66}px;--bz:-40px"><span class="raios"></span><span class="raios raios--2"></span>${brilhos(6)}</div>`
    + `<div class="bb3d coroa3d" style="--hy:${y0 + 130}px">${coroaSvg(idCoroa)}</div>`;
}

// estatueta: pedestal de pedra + boneco de metal; a cabeça é a foto (ou inicial) de quem zerou.
// balao = { hy, k } (opcional): o recado vira um balãozinho em cima, sempre virado pra câmera.
function estatuetaCorpo(membro, i, balao = null, idCoroa = 'coroa-est') {
  const ph = PEDESTAL[i] ?? 22;
  const y0 = ph + 6;
  const photo = safeUrl(membro?.photoURL);
  const rosto = photo
    ? `<img src="${esc(photo)}" alt="" referrerpolicy="no-referrer">`
    : `<b>${esc((membro?.name ?? '?').trim().charAt(0).toUpperCase())}</b>`;
  return gloriaHtml(i, y0, idCoroa)
    + caixa({ w: 58, h: ph, t: 58, cls: 'm-pedra', f: `<span class="est__placa">${i + 1}º</span>` })
    + caixa({ w: 62, h: 6, t: 62, y: ph, cls: 'm-metal' })
    + caixa({ w: 24, h: 34, t: 14, y: y0, cls: 'm-metal est__pernas', faces: 'flr' })
    + caixa({ w: 34, h: 36, t: 18, y: y0 + 34, cls: 'm-metal' })
    + `<div class="braco" style="--ax:-15px;--ay:${y0 + 64}px;--a:-34deg">${caixa({ w: 8, h: 30, t: 8, cls: 'm-metal' })}</div>`
    + `<div class="braco" style="--ax:15px;--ay:${y0 + 64}px;--a:34deg">${caixa({ w: 8, h: 30, t: 8, cls: 'm-metal' })}</div>`
    + caixa({ w: 12, h: 6, t: 10, y: y0 + 70, cls: 'm-metal', faces: 'flr' })
    + `<div class="cabeca3d" style="--hy:${y0 + 106}px">${rosto}</div>`
    + (membro?.recado && balao ? `<div class="balao3d" style="--hy:${Math.round(balao.hy)}px;--kb:${(1 / balao.k).toFixed(3)}"><span>${esc(membro.recado)}</span></div>` : '');
}
function estatuetaHtml(L, membro, i) {
  const [x, z, y] = slot(L, i);
  const top = i < 3 ? ' est--top' : '';
  return obj(`est-${i}`, [x, z, -6 + (i % 5) * 3], L.est.s * tam(i), `<div class="est__corpo${top}">${estatuetaCorpo(membro, i, balaoPos(L, i))}</div>`, y, metalVars(i));
}

// Estatueta sozinha, grande, fora da mesa (o modal de quando você clica nela).
// Mesmo boneco 3D: palco próprio com perspectiva e câmera fixa de 3/4.
export function estatuetaSoloHtml(membro, i) {
  return `<div class="est-solo" aria-hidden="true"><div class="est-solo__mundo">
    <div class="obj" style="--x:0px;--z:0px;--ry:0deg;--s:2;${metalVars(i)}"><div class="mola"><div class="est__corpo${i < 3 ? ' est--top' : ''}">${estatuetaCorpo({ ...membro, recado: '' }, i, null, 'coroa-solo')}</div></div></div>
  </div></div>`;
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
      ${idTitulo ? '<button class="contrato__botao" type="button" data-reentrar>Entrar com Google</button>' : '<span class="contrato__botao">Entrar com Google</span>'}
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

// opts: { fase: 'jogando'|'encerrada', game, front, mini, pages, nota, alvos: [{ obj, label, attr }],
//         fotoVencedor/nomeVencedor/podeTrocarFoto: o porta-retrato do jogando,
//         zerados: [membro] em ordem de chegada, vagas: quantos sócios (lugares na prateleira), placa (texto do botão), notaZ (bilhete do botão),
//         notinhas: quantas notinhas tem o quadro de jogando }
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
    ${opts.depois ?? ''}
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
    const base = LAYOUTS[opts.fase][largo.matches ? 'pc' : 'cel'];
    // a prateleira tem uma vaga por sócio (nunca menos que quem já zerou)
    L = base.est ? { ...base, est: geoPrat(base.est, Math.max(opts.vagas ?? 6, opts.zerados?.length ?? 0)) } : base;
    palco.style.width = `${L.W}px`;
    palco.style.height = `${L.H}px`;
    mundo.style.top = `${L.cy}px`;
    // po: ponto de fuga em px (cena mais alta por causa da prateleira, mesma perspectiva na mesa)
    palco.style.perspectiveOrigin = L.po ? `50% ${L.po}px` : '';
    mundo.style.setProperty('--cam', `${L.cam}deg`);
    const zerados = L.est ? (opts.zerados ?? []) : [];
    let html = mesaHtml(L, opts.nota, opts.notaZ) + (L.lamp ? obj('abajur-obj', L.lamp, 1, abajurHtml()) : '');
    if (L.est) html += prateleiraHtml(L);
    if (L.cal) html += obj('cal-obj', L.cal, L.esc.cal, calHtml(opts.mini));
    if (L.retrato) html += obj('retrato-obj', L.retrato, L.esc.retrato, retratoHtml(opts.fotoVencedor, opts.nomeVencedor, opts.podeTrocarFoto));
    if (L.quadro) html += obj('quadro-obj', L.quadro, L.esc.quadro, quadroHtml(opts.pages ?? []));
    if (L.diario) html += obj('diario-obj', L.diario, L.esc.diario, diarioHtml(opts.notinhas ?? 0));
    if (L.caso) html += obj('caso-obj', L.caso, L.esc.caso, casoHtml(opts.game.name, opts.front));
    // sem lugar próprio (jogando): a capinha fica em pé em cima do videogame
    else if (opts.game && L.console) html += obj('caso-obj', L.console, L.esc.caso, casoHtml(opts.game.name, opts.front), 60 * L.esc.console);
    if (L.console) html += obj('console-obj', L.console, L.esc.console, L.tv ? videogameHtml() : consoleHtml());
    if (L.botao) html += obj('botao-obj', L.botao, L.esc.botao, botaoHtml(opts.placa ?? 'Zerei!'));
    html += zerados.map((m, i) => estatuetaHtml(L, m, i)).join('');
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
    'retrato-obj': ['[data-retrato]'],
    'caso-obj': ['.m-estojo > .f', '.coroa'],
    'quadro-obj': ['.m-quadro > .f'],
    'diario-obj': ['.m-quadro > .f'],
    'botao-obj': ['.m-base > .f', '.disco--topo'],
    'console-obj': ['.m-console', '.controle3d .camada'],
    'tv-obj': ['.m-tv > .f', '.m-tv > .u'],
    'prancheta-obj': ['.prancheta3d__frente'],
  };
  function posicionaAlvos() {
    const base = wrap.getBoundingClientRect();
    wrap.querySelectorAll('.alvo').forEach((alvo) => {
      const o = mesa.querySelector(`#${alvo.dataset.obj}`);
      const pecas = PECAS[alvo.dataset.obj] ?? (alvo.dataset.obj.startsWith('est-') ? ['.bx', '.cabeca3d'] : null);
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

  // ---------- a queda da estatueta: gravidade → impacto (squash) → quique → mesa pula
  function pulinho(mola, alto, atraso, giro = 0) {
    if (!mola) return Promise.resolve();
    return anim(mola, [
      { transform: 'none' },
      { transform: `translateY(${-alto}px) rotateZ(${giro}deg)`, offset: 0.35, easing: GRAVIDADE },
      { transform: `translateY(0) rotateZ(${-giro * 0.5}deg)`, offset: 0.7, easing: SAI },
      { transform: `translateY(${-alto * 0.18}px)`, offset: 0.85 },
      { transform: 'none' },
    ], { duration: 520, delay: atraso, easing: SAI });
  }
  function impacto(i, est) {
    anim(mesa, [
      { transform: 'none', easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: 'translateY(9px)', offset: 0.12, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: 'translateY(-15px)', offset: 0.42, easing: GRAVIDADE },
      { transform: 'translateY(3px)', offset: 0.68, easing: SAI },
      { transform: 'translateY(-3px)', offset: 0.84 },
      { transform: 'none' },
    ], { duration: 640 });
    anim(palco, [{ translate: '0 0' }, { translate: '0 5px' }, { translate: '0 -3px' }, { translate: '0 1px' }, { translate: '0 0' }], { duration: 260, easing: 'ease-out' });
    // onda: quem está mais perto pula antes e mais alto
    const [ix, iz] = slot(L, i);
    mesa.querySelectorAll(':scope > .obj').forEach((o) => {
      if (o === est) return;
      const x = parseFloat(o.style.getPropertyValue('--x'));
      const z = parseFloat(o.style.getPropertyValue('--z'));
      const d = Math.hypot(x - ix, z - iz);
      const forca = 1 / (1 + d / 260);
      const giro = o.id.startsWith('est-') ? (Math.random() < 0.5 ? -5 : 5) * forca : 0;
      pulinho(o.querySelector('.mola'), 6 + 22 * forca, 60 + d * 0.12, giro);
    });
  }
  // a estatueta i cai do céu na mesa (sem movimento: só aparece)
  async function solta(i) {
    const est = mesa.querySelector(`#est-${i}`);
    const corpo = est?.querySelector('.est__corpo');
    if (!corpo || calma.matches) return;
    // parte de logo acima da borda de cima da tela, pra queda inteira ser vista
    const cabeca = corpo.querySelector('.cabeca3d').getBoundingClientRect();
    const k = (parseFloat(palco.style.scale) || 1) * L.est.s * tam(i) * Math.cos((L.cam * Math.PI) / 180);
    const tela = Math.max(260, cabeca.bottom + 40);
    const alto = tela / k;
    const QUEDA = Math.round(Math.min(760, Math.max(480, 360 + tela * 0.45)));
    await anim(corpo, [
      { transform: `translateY(${-alto}px) rotateZ(-12deg) scale(0.97, 1.03)` },
      { transform: `translateY(${-alto * 0.18}px) rotateZ(-4deg) scale(0.93, 1.1)`, offset: 0.8 },
      { transform: 'translateY(0) rotateZ(0deg) scale(0.92, 1.12)' },
    ], { duration: QUEDA, easing: GRAVIDADE });
    impacto(i, est);
    sacodePrateleira();
    if (i < 3) explode(est);
    await anim(corpo, [
      { transform: 'translateY(0) scale(0.92, 1.12)', easing: 'cubic-bezier(0.2, 0, 0.4, 1)' },
      { transform: 'translateY(0) scale(1.18, 0.78)', offset: 0.1, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: 'translateY(-52px) rotateZ(3deg) scale(0.97, 1.05)', offset: 0.4, easing: GRAVIDADE },
      { transform: 'translateY(0) rotateZ(0deg) scale(1.08, 0.9)', offset: 0.64, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: 'translateY(-11px) scale(0.99, 1.02)', offset: 0.78, easing: GRAVIDADE },
      { transform: 'translateY(0) scale(1.03, 0.97)', offset: 0.88, easing: SAI },
      { transform: 'none' },
    ], { duration: 820 });
  }
  // a tábua balança no impacto (presa na parede pela mão-francesa)
  function sacodePrateleira() {
    const tabua = mesa.querySelector('#prat-obj > .mola');
    if (!tabua) return;
    anim(tabua, [
      { transform: 'none' }, { transform: 'translateY(7px) rotateZ(-1.2deg)', offset: 0.15 },
      { transform: 'translateY(-3px) rotateZ(0.7deg)', offset: 0.45 }, { transform: 'translateY(1px) rotateZ(-0.3deg)', offset: 0.7 },
      { transform: 'none' },
    ], { duration: 620, easing: SAI });
  }
  // pódio: a glória nasce do impacto (raios/aura abrem com exagero e assentam)
  function explode(est) {
    est.querySelectorAll('.gloria3d, .aura3d').forEach((g) => anim(g, [
      { scale: '0.1', opacity: 0 }, { scale: '1.7', opacity: 1, offset: 0.35 }, { scale: '1' },
    ], { duration: 900, easing: SAI }));
    est.querySelectorAll('.coroa3d').forEach((c) => anim(c, [
      { translate: '0 -160px', rotate: '-30deg', opacity: 0 }, { translate: '0 -160px', rotate: '-30deg', opacity: 1, offset: 0.3 },
      { translate: '0 6px', rotate: '6deg', offset: 0.75, easing: GRAVIDADE }, { translate: '0 0', rotate: '0deg' },
    ], { duration: 1100, delay: 250, easing: SAI }));
  }

  // o botão afunda e volta
  async function aperta() {
    const cupula = mesa.querySelector('#botao-obj .cupula');
    if (!cupula || calma.matches) return;
    await anim(cupula, [{ transform: 'translateY(-34px)' }, { transform: 'translateY(-26px)' }], { duration: 90, easing: 'cubic-bezier(0.4, 0, 1, 1)' });
    anim(cupula, [{ transform: 'translateY(-26px)' }, { transform: 'translateY(-36px)', offset: 0.6 }, { transform: 'translateY(-34px)' }], { duration: 240, easing: SAI });
  }

  return {
    mesa,
    solta,
    aperta,
    alinha: posicionaAlvos,
    remonta: (novo) => {
      Object.assign(opts, novo);
      monta();
    },
    escalaAtual: () => (parseFloat(palco.style.scale) || 1) * Math.cos((L.cam * Math.PI) / 180),
  };
}
