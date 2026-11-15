// Ícones próprios, todos no mesmo grid 24x24 com traço "pixelado" (sem curvas), em currentColor.
// Uso: icon('check') -> string SVG decorativa (aria-hidden); icon('warn', 'Atenção') -> com rótulo.
const PATHS = {
  check: 'M4 12h3v3h3v-3h3V9h3V6h3v3h-3v3h-3v3h-3v3H7v-3H4z',
  copy: 'M8 3h12v12h-3V6H8zM4 8h12v13H4zm3 3v7h6v-7z',
  pencil: 'M15 3h3v3h3v3h-3v3h-3v3h-3v3H9v3H3v-6h3v-3h3V9h3V6h3zm-9 15v0h3v-3H6z',
  trash: 'M9 3h6v2h5v3H4V5h5zM6 9h12v12H6zm3 3v6h2v-6zm4 0v6h2v-6z',
  link: 'M11 3h10v10h-3V8h-2v2h-2v2h-2v2h-2v-2H8v-2h2V8h2V6h-1zM3 7h6v3H6v8h8v-3h3v6H3z',
  dice: 'M4 4h16v16H4zm3 3v3h3V7zm7 0v3h3V7zm-3.5 3.5v3h3v-3zM7 14v3h3v-3zm7 0v3h3v-3z',
  eye: 'M8 6h8v2h3v3h2v2h-2v3h-3v2H8v-2H5v-3H3v-2h2V8h3zm2 4v4h4v-4z',
  logout: 'M3 3h11v5h-3V6H6v12h5v-2h3v5H3zm13 4h3v3h2v4h-2v3h-3v-3h-5v-4h5z',
  close: 'M2 2h4v2h-4zM18 2h4v2h-4zM2 4h6v2h-6zM16 4h6v2h-6zM4 6h6v2h-6zM14 6h6v2h-6zM6 8h12v2h-12zM8 10h8v2h-8zM8 12h8v2h-8zM6 14h12v2h-12zM4 16h6v2h-6zM14 16h6v2h-6zM2 18h6v2h-6zM16 18h6v2h-6zM2 20h4v2h-4zM18 20h4v2h-4z',
  plus: 'M10 2h4v2h-4zM10 4h4v2h-4zM10 6h4v2h-4zM10 8h4v2h-4zM2 10h20v2h-20zM2 12h20v2h-20zM10 14h4v2h-4zM10 16h4v2h-4zM10 18h4v2h-4zM10 20h4v2h-4z',
  // selos genéricos: estrela (ZERADO) e chama (MAIS VOTADO)
  star: 'M10 0h4v2h-4zM10 2h4v2h-4zM8 4h8v2h-8zM0 6h24v2h-24zM2 8h20v2h-20zM4 10h16v2h-16zM6 12h12v2h-12zM6 14h12v2h-12zM4 16h6v2h-6zM14 16h6v2h-6zM4 18h4v2h-4zM16 18h4v2h-4zM2 20h4v2h-4zM18 20h4v2h-4z',
  flame: 'M10 0h2v2h-2zM8 2h4v2h-4zM8 4h6v2h-6zM6 6h8v2h-8zM18 6h2v2h-2zM6 8h10v2h-10zM18 8h4v2h-4zM4 10h18v2h-18zM4 12h8v2h-8zM14 12h8v2h-8zM2 14h8v2h-8zM16 14h6v2h-6zM2 16h6v2h-6zM18 16h4v2h-4zM2 18h6v2h-6zM18 18h4v2h-4zM4 20h6v2h-6zM16 20h4v2h-4zM6 22h12v2h-12z',
  // aviso de plataforma incompatível
  warn: 'M10 0h4v2h-4zM8 2h8v2h-8zM8 4h8v2h-8zM6 6h4v2h-4zM14 6h4v2h-4zM6 8h4v2h-4zM14 8h4v2h-4zM4 10h6v2h-6zM14 10h6v2h-6zM4 12h6v2h-6zM14 12h6v2h-6zM2 14h20v2h-20zM2 16h8v2h-8zM14 16h8v2h-8zM0 18h24v2h-24zM0 20h24v2h-24z',
  // chips de estado: CALL MARCADA e JOGANDO
  calendar: 'M4 0h4v2h-4zM16 0h4v2h-4zM0 2h24v2h-24zM0 4h24v2h-24zM0 6h4v2h-4zM20 6h4v2h-4zM0 8h4v2h-4zM6 8h4v2h-4zM12 8h4v2h-4zM20 8h4v2h-4zM0 10h4v2h-4zM20 10h4v2h-4zM0 12h4v2h-4zM6 12h4v2h-4zM12 12h4v2h-4zM20 12h4v2h-4zM0 14h4v2h-4zM20 14h4v2h-4zM0 16h4v2h-4zM6 16h4v2h-4zM20 16h4v2h-4zM0 18h4v2h-4zM20 18h4v2h-4zM0 20h24v2h-24z',
  gamepad: 'M2 4h20v2h-20zM0 6h24v2h-24zM0 8h4v2h-4zM6 8h8v2h-8zM16 8h8v2h-8zM0 10h2v2h-2zM8 10h12v2h-12zM22 10h2v2h-2zM0 12h4v2h-4zM6 12h8v2h-8zM16 12h8v2h-8zM0 14h24v2h-24zM0 16h8v2h-8zM16 16h8v2h-8zM2 18h4v2h-4zM18 18h4v2h-4z',
};

export function icon(name, label = '') {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="icon" viewBox="0 0 24 24" ${a11y}><path fill="currentColor" fill-rule="evenodd" d="${PATHS[name]}"/></svg>`;
}
