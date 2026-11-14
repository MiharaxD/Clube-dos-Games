// Ícones desenhados à mão, todos no mesmo grid 24x24 com traço de 2px "pixelado" (sem curvas).
// Uso: icon('check') -> string SVG decorativa (aria-hidden).
const PATHS = {
  check: 'M4 12h3v3h3v-3h3V9h3V6h3v3h-3v3h-3v3h-3v3H7v-3H4z',
  copy: 'M8 3h12v12h-3V6H8zM4 8h12v13H4zm3 3v7h6v-7z',
  pencil: 'M15 3h3v3h3v3h-3v3h-3v3h-3v3H9v3H3v-6h3v-3h3V9h3V6h3zm-9 15v0h3v-3H6z',
  trash: 'M9 3h6v2h5v3H4V5h5zM6 9h12v12H6zm3 3v6h2v-6zm4 0v6h2v-6z',
  link: 'M11 3h10v10h-3V8h-2v2h-2v2h-2v2h-2v-2H8v-2h2V8h2V6h-1zM3 7h6v3H6v8h8v-3h3v6H3z',
  dice: 'M4 4h16v16H4zm3 3v3h3V7zm7 0v3h3V7zm-3.5 3.5v3h3v-3zM7 14v3h3v-3zm7 0v3h3v-3z',
  eye: 'M8 6h8v2h3v3h2v2h-2v3h-3v2H8v-2H5v-3H3v-2h2V8h3zm2 4v4h4v-4z',
  logout: 'M3 3h11v5h-3V6H6v12h5v-2h3v5H3zm13 4h3v3h2v4h-2v3h-3v-3h-5v-4h5z',
};

export function icon(name, label = '') {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="icon" viewBox="0 0 24 24" ${a11y}><path fill="currentColor" fill-rule="evenodd" d="${PATHS[name]}"/></svg>`;
}
