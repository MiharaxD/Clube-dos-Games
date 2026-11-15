// Pedaços de interface repetidos entre telas. Tudo devolve string HTML já escapada.
import { STATUS_LABEL, STATUS_ORDER, esc, fmtPrice, safeUrl } from '../lib/util.js';
import { icon } from '../lib/icons.js';

// ------------------------------------------------------------ letreiro de neon (logo)

// Um traço por letra, núcleo claro, tubo apagado atrás e glow em 3 camadas. Único neon do sistema.
const GLIFOS = {
  C: 'M21 5C19 1 15 0 11 0C3 0 1 8 1 16C1 24 3 32 11 32C15 32 19 31 21 27',
  L: 'M2 0V32H21',
  U: 'M1 0V21C1 28 5 32 11 32C17 32 21 28 21 21V0',
  B: 'M2 15H12C17 15 20 12 20 7.5C20 3 17 0 12 0H2V32H12C18 32 21 28.5 21 23.5C21 18.5 18 15 12 15',
  E: 'M21 0H2V16H16H2V32H21',
  D: 'M2 0V32H9C17 32 21 25 21 16C21 7 17 0 9 0Z',
  O: 'M11 0C3 0 1 8 1 16C1 24 3 32 11 32C19 32 21 24 21 16C21 8 19 0 11 0Z',
  S: 'M20 5C18 1 15 0 11 0C5 0 2 3 2 8C2 14 8 15 11 16C16 17 21 19 21 24C21 29 17 32 11 32C6 32 3 30 1 27',
  J: 'M21 0V22C21 29 17 32 11 32C5 32 2 29 1 25',
  G: 'M20 5C18 1 15 0 11 0C3 0 1 8 1 16C1 24 3 32 11 32C19 32 21 26 21 18H12',
};
// "CLUBE DOS" na primeira linha, "JOGOS" na segunda: [letra, x, y]
const LETRAS = [
  ['C', 0, 0], ['L', 29, 0], ['U', 58, 0], ['B', 87, 0], ['E', 116, 0],
  ['D', 157, 0], ['O', 186, 0], ['S', 215, 0],
  ['J', 49.5, 42], ['O', 78.5, 42], ['G', 107.5, 42], ['O', 136.5, 42], ['S', 165.5, 42],
];

export function neonSign() {
  const defs = Object.entries(GLIFOS).map(([k, d]) => `<path id="neon-${k}" d="${d}"/>`).join('');
  const off = LETRAS.map(([k, x, y]) => `<use href="#neon-${k}" x="${x}" y="${y}"/>`).join('');
  const on = LETRAS.map(([k, x, y]) =>
    `<g class="neon__l" transform="translate(${x} ${y})"><use class="neon__tubo" href="#neon-${k}"/><use class="neon__nucleo" href="#neon-${k}"/></g>`,
  ).join('');
  return `<svg class="neon" viewBox="-10 -10 260 96" role="img" aria-label="Clube dos Jogos" data-luz="neon">
    <defs>
      <filter id="neon-glow" x="-20%" y="-40%" width="140%" height="180%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="a"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="c"/>
        <feMerge><feMergeNode in="c"/><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      ${defs}
    </defs>
    <path class="neon__fio" d="M236 18C252 22 252 60 248 86"/>
    <rect class="neon__grampo" x="38" y="33" width="6" height="4"/><rect class="neon__grampo" x="128" y="33" width="6" height="4"/><rect class="neon__grampo" x="205" y="33" width="6" height="4"/>
    <rect class="neon__grampo" x="72" y="75" width="6" height="4"/><rect class="neon__grampo" x="158" y="75" width="6" height="4"/>
    <g class="neon__apagado">${off}</g>
    <g filter="url(#neon-glow)">${on}</g>
  </svg>`;
}

// ------------------------------------------------------------ membro

export function avatar(member, size = '') {
  const cls = `avatar ${size ? `avatar--${size}` : ''}`;
  const photo = safeUrl(member?.photoURL);
  if (photo) return `<img class="${cls}" src="${esc(photo)}" alt="" referrerpolicy="no-referrer">`;
  const initial = (member?.name ?? '?').trim().charAt(0).toUpperCase();
  return `<span class="${cls}" aria-hidden="true">${esc(initial)}</span>`;
}

// "Mobília fixa" do membro: avatar + nome (+ plataformas), igual em qualquer lista.
export function memberChip(member, { platforms = false } = {}) {
  const plats = platforms
    ? `<span class="member__plats">${esc((member?.platforms ?? []).join(' · ') || 'sem plataformas marcadas')}</span>`
    : '';
  return `<span class="member">${avatar(member, 'sm')}<span><span class="member__name">${esc(member?.name ?? 'Ex-sócio')}</span>${plats ? `<br>${plats}` : ''}</span></span>`;
}

export const memberName = (members, uid) => members.find((m) => m.id === uid)?.name ?? 'Ex-sócio';

// ------------------------------------------------------------ tempo da rodada

// Faixa de 4 etapas: o único eixo do tempo, lida da esquerda pra direita.
export function phaseSteps(status) {
  const current = STATUS_ORDER.indexOf(status);
  return `<ol class="faixa" aria-label="Etapas da rodada">${STATUS_ORDER.map((s, i) => {
    if (i < current) return `<li class="feita">${STATUS_LABEL[s]}<span class="sr-only"> (concluída)</span></li>`;
    if (i === current) return `<li aria-current="step">${STATUS_LABEL[s]}</li>`;
    return `<li>${STATUS_LABEL[s]}</li>`;
  }).join('')}</ol>`;
}

// TV de tubo com o cartaz da tela (decorativa: o cartaz repete o título, por isso aria-hidden).
// osd = canto do vidro ("CH 02", "CH ESTANTE"), title = texto grande, line = linha de baixo,
// art = imagem opcional do jogo da rodada dentro do vidro.
export function tv({ osd = '', title = '', line = '', art = '' } = {}) {
  const url = safeUrl(art);
  const arte = url ? `<img class="tv__arte" src="${esc(url)}" alt="" loading="lazy" onerror="this.remove()">` : '';
  const cartaz = url
    ? ''
    : `<div class="tv__cartaz">
        ${osd ? `<span class="tv__osd">${esc(osd)}</span>` : ''}
        <span class="tv__fase">${esc(title)}</span>
        ${line ? `<span class="tv__linha">· ${esc(line)} ·</span>` : ''}
      </div>`;
  // 3D: .tv-palco gira TV + rack juntos; cada um é uma caixa de faces (frente no fluxo, lados/topo/tubo girados).
  // a TV é decorativa (aria-hidden); o único pedaço interativo é o botão que liga o easter egg
  return `<div class="mesa-tv">
    <span class="tv__brilho" aria-hidden="true"></span>
    <div class="tv-palco" aria-hidden="true">
      <div class="tv">
        <i class="tv__lado tv__lado--u"></i><i class="tv__lado tv__lado--l"></i><i class="tv__lado tv__lado--r"></i>
        <div class="tv__tubo"><i class="tv__lado--u"></i><i class="tv__lado--l"></i><i class="tv__lado--r"></i><i class="tv__tubo-fundo"></i></div>
        <span class="tv__antena"></span>
        <div class="tv__caixa">
          <div class="tv__moldura">
            <div class="tv__vidro" data-luz="tv">${arte}${cartaz}<span class="tv__rolo"></span></div>
          </div>
          <div class="tv__painel"><span class="tv__botao"></span><span class="tv__botao"></span><span class="tv__grade"></span></div>
        </div>
      </div>
      <div class="movel-tv">
        <i class="movel-tv__tampo"></i><i class="movel-tv__lado movel-tv__lado--l"></i><i class="movel-tv__lado movel-tv__lado--r"></i>
        <div class="movel-tv__corpo"><div class="movel-tv__nicho"><span class="console"></span></div></div>
      </div>
    </div>
    <div class="poeira" aria-hidden="true"><span class="cisco cisco--a"></span><span class="cisco cisco--b"></span><span class="cisco cisco--c"></span></div>
    <button class="tv__liga" type="button" data-tv-liga><span class="sr-only">Ligar a TV</span></button>
  </div>`;
}

// ------------------------------------------------------------ capa 3:4

// Caixa genérica por código (sem imagem): cor e risca por hash do nome, motivo geométrico, nome em Bebas.
// hue = matiz da lombada/lados do estojo 3D (mesma família da capa)
const PALETAS = [
  { capa: '#1f3446', risca: '#8fb8c9', hue: 212 }, { capa: '#33452a', risca: '#d9b45a', hue: 92 },
  { capa: '#4a1d26', risca: '#e0704a', hue: 352 }, { capa: '#3a2848', risca: '#d58ab0', hue: 292 },
  { capa: '#4a2f1c', risca: '#c99a5e', hue: 28 }, { capa: '#1d3e3c', risca: '#ff8a6a', hue: 176 },
  { capa: '#2a2f4a', risca: '#a9b6e8', hue: 232 }, { capa: '#3e3416', risca: '#e8c46a', hue: 48 },
];
const MOTIVOS = [
  '<path d="M50 4 92 50 50 96 8 50z" fill="none" stroke="#e8f0f2" stroke-width="7"/><path d="M50 30 70 50 50 70 30 50z" fill="#e8f0f2"/>',
  '<circle cx="82" cy="10" r="12" fill="#f0d27a"/><path d="M4 40h92v7H4zM4 58h92v7H4zM4 76h92v7H4z" fill="#5a7d40"/>',
  '<path d="M50 8 94 86H6z" fill="none" stroke="#f2b07a" stroke-width="7"/><path d="M50 44 68 76H32z" fill="#f2b07a"/>',
  '<path d="M2 88 36 30 54 58 68 40 98 88z" fill="#f2c4d8"/><path d="M36 30 44 44 36 40 28 44z" fill="#fff3fa"/>',
  '<circle cx="50" cy="50" r="22" fill="#f4a95a"/><ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#f3e6d8" stroke-width="5" transform="rotate(-18 50 50)"/>',
  '<path d="M8 20h44v44H8z" fill="none" stroke="#ffc2a8" stroke-width="7"/><path d="M48 40h44v44H48z" fill="#ffc2a8"/>',
];
const norm = (s) => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export const coverPalette = (name) => PALETAS[hash(norm(name) || 'x') % PALETAS.length];

export function genericCover(name) {
  const h = hash(norm(name) || 'x');
  const pal = PALETAS[h % PALETAS.length];
  const motivo = MOTIVOS[(h >>> 4) % MOTIVOS.length];
  return `<span class="capa" style="--capa: ${pal.capa}; --risca: ${pal.risca}" aria-hidden="true">
    <svg class="capa__motivo" viewBox="0 0 100 100">${motivo}</svg>
    <span class="capa__nome">${esc(name ?? '')}</span>
  </span>`;
}

// Capa 3:4 com imagem (RAWG); sem imagem ou se a imagem falhar, fica a caixa genérica por baixo.
export function cover(game) {
  const url = safeUrl(game?.cover);
  const img = url
    ? `<img class="cover__img" src="${esc(url)}" alt="Capa de ${esc(game.name)}" loading="lazy" onerror="this.remove()">`
    : '';
  const label = url ? '' : `<span class="sr-only">Capa de ${esc(game?.name ?? '')}</span>`;
  return `<div class="cover">${genericCover(game?.name)}${img}${label}</div>`;
}

// ------------------------------------------------------------ peças da locadora

// Etiqueta de preço âmbar escrita à mão (canto superior direito da capa).
export const priceTag = (price) => `<span class="preco">${esc(fmtPrice(price))}</span>`;

// Carimbo girado sobre a capa. tone: 'amber' (SEPARADO, VENCEDOR, SORTEADO) ou 'pink' (SEU).
export function stamp(text, { tone = 'amber', hit = false } = {}) {
  const cls = ['carimbo', tone === 'pink' ? 'carimbo--pink' : '', hit ? 'bate' : ''].filter(Boolean).join(' ');
  return `<span class="${cls}">${esc(text)}</span>`;
}

// Adesivo âmbar fora da capa: frase à mão; número sozinho em Bebas (num); teal destaca prova de stat.
export function sticker(text, { num = false, tone = 'amber', srSuffix = '' } = {}) {
  const cls = ['sticker', num ? 'sticker--num' : '', tone === 'teal' ? 'sticker--teal' : ''].filter(Boolean).join(' ');
  return `<span class="${cls}">${esc(text)}${srSuffix ? `<span class="sr-only">${esc(srSuffix)}</span>` : ''}</span>`;
}

// Chip de estado (papel, texto + ícone, nunca só cor).
export const stateChip = (text, iconName) => `<span class="chip">${icon(iconName)}${esc(text)}</span>`;

export function empty(title, text) {
  return `<div class="empty"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`;
}
