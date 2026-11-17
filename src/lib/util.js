// Utilitários pequenos usados pelas telas.

// Escapa texto antes de colocar dentro de innerHTML.
// TODO conteúdo vindo do usuário (nomes, pitch, comentários) passa por aqui.
export function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Só aceita URLs http(s) para imagens e links (evita "javascript:" etc.).
// Capa enviada do aparelho: JPEG em data URL (gerada por fotoParaCapa), com o mesmo limite das rules.
export const CAPA_DATA_MAX = 100000;
export function safeImgData(value) {
  const v = String(value ?? '');
  return v.length <= CAPA_DATA_MAX && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v) ? v : '';
}
// Qualquer origem de imagem aceita: link http(s) ou capa enviada.
export const imgSrc = (value) => safeUrl(value) || safeImgData(value);
// Capa de um jogo: a enviada do aparelho ganha da URL.
export const coverSrc = (game) => safeImgData(game?.coverData) || safeUrl(game?.cover);

// Foto do aparelho -> capa 3:4 (corte central, 300x400, JPEG). Sem Storage: vai no doc do jogo.
export async function fotoParaCapa(file) {
  if (!file?.type?.startsWith('image/')) throw new Error('nao-imagem');
  const bmp = await createImageBitmap(file);
  const W = 300;
  const H = 400;
  const escala = Math.max(W / bmp.width, H / bmp.height);
  const sw = W / escala;
  const sh = H / escala;
  const tela = document.createElement('canvas');
  tela.width = W;
  tela.height = H;
  tela.getContext('2d').drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, W, H);
  bmp.close?.();
  for (const q of [0.8, 0.65, 0.5]) {
    const url = tela.toDataURL('image/jpeg', q);
    if (url.length <= CAPA_DATA_MAX) return url;
  }
  throw new Error('grande-demais');
}

// Foto pro quadro livre (e a prova do zerei, com lado maior): sem corte, mesmo limite da capa.
export async function fotoParaQuadro(file, lado = 360) {
  if (!file?.type?.startsWith('image/')) throw new Error('nao-imagem');
  const bmp = await createImageBitmap(file);
  const escala = Math.min(1, lado / Math.max(bmp.width, bmp.height));
  const tela = document.createElement('canvas');
  tela.width = Math.max(1, Math.round(bmp.width * escala));
  tela.height = Math.max(1, Math.round(bmp.height * escala));
  const g = tela.getContext('2d');
  g.fillStyle = '#fff'; // PNG transparente vira fundo branco no JPEG
  g.fillRect(0, 0, tela.width, tela.height);
  g.drawImage(bmp, 0, 0, tela.width, tela.height);
  bmp.close?.();
  for (const q of [0.8, 0.65, 0.5, 0.35]) {
    const url = tela.toDataURL('image/jpeg', q);
    if (url.length <= CAPA_DATA_MAX) return url;
  }
  throw new Error('grande-demais');
}

export function safeUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

// Trailer: aceita link do YouTube (watch?v=, youtu.be/, shorts/, embed/, live/) e devolve só o ID do vídeo
// (11 caracteres), ou '' se não for do YouTube. As rules aceitam só https://(www.|m.)youtube.com|youtu.be.
export function youtubeId(value) {
  let url;
  try {
    url = new URL(String(value ?? '').trim());
  } catch {
    return '';
  }
  if (url.protocol !== 'https:') return '';
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = '';
  if (host === 'youtu.be') id = url.pathname.split('/')[1] ?? '';
  else if (host === 'youtube.com') {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? '';
  }
  return /^[\w-]{11}$/.test(id) ? id : '';
}

export const STATUS_ORDER =['sugerindo', 'votando', 'jogando', 'encerrada'];

export const STATUS_LABEL = {
  sugerindo: 'Sugerindo',
  votando: 'Votando',
  jogando: 'Jogando',
  encerrada: 'Encerrada',
};

export const DURATION_LABEL = { curto: 'Curto', medio: 'Médio', longo: 'Longo' };
export const MODE_LABEL = { solo: 'Solo', coop: 'Co-op', multi: 'Multi' };

// "2026-12-05" -> "05/12" ; "2026-12-05T20:00" -> "sex, 05/12 às 20:00"
export function fmtDay(isoDate) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate.slice(0, 10)}T12:00`);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// "Hades, Celeste e Tunic"
export function listJoin(items) {
  return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(items);
}

export function fmtDateTime(isoDateTime) {
  if (!isoDateTime) return '';
  const date = new Date(isoDateTime);
  const day = date
    .toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
    .replace('.', ''); // "dom., 20/12" -> "dom, 20/12"
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day} às ${time}`;
}

export function fmtPrice(price) {
  return price === 0 ? 'Grátis' : `R$ ${price}`;
}

export function fmtScore(score) {
  return score.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Aviso rápido no rodapé da tela. O balão é só visual (aria-hidden); quem usa leitor de tela ouve
// uma região sempre presente (status; erro vai no alert). Erro fica mais tempo e some ao toque.
let toastTimer;
export function toast(message, kind = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
  el.hidden = true; // esconde e mostra de novo: reinicia a animação do 'pop' se já estava na tela
  void el.offsetWidth;
  el.hidden = false;
  el.onclick = () => (el.hidden = true);
  // limpa e escreve depois: região que já tinha o mesmo texto não anunciaria de novo
  const voz = document.getElementById(kind === 'error' ? 'toast-alert' : 'toast-status');
  if (voz) {
    voz.textContent = '';
    setTimeout(() => (voz.textContent = message), 50);
  }
  clearTimeout(toastTimer);
  // 'pop' = aviso rápido que pipoca e some sozinho (não precisa fechar)
  toastTimer = setTimeout(() => (el.hidden = true), kind === 'error' ? 8000 : kind === 'pop' ? 2500 : 4000);
}

// Roda uma ação assíncrona com o botão travado e mostra erro amigável se falhar.
export async function withBusy(button, action) {
  if (button) button.disabled = true;
  try {
    return await action();
  } catch (error) {
    console.error(error);
    const denied = error?.code === 'permission-denied';
    toast(denied ? 'O servidor recusou essa ação. Recarrega a página e tenta de novo.' : 'Deu ruim. Tenta de novo?', 'error');
    return undefined;
  } finally {
    if (button) button.disabled = false;
  }
}

// Copia texto pra área de transferência (com plano B pra navegador antigo).
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

// Confirmação dentro da página (uma "ficha" logo abaixo do botão), no lugar do confirm() do navegador.
// Uso: if (!(await confirmInline(botao, 'Tem certeza?', 'Apagar'))) return;
export function confirmInline(anchor, message, okLabel = 'Confirmar') {
  document.querySelectorAll('.confirm').forEach((el) => el.remove());
  const host = anchor.closest('.actions') ?? anchor;
  const box = document.createElement('div');
  box.className = 'confirm';
  box.setAttribute('role', 'alertdialog');
  box.setAttribute('aria-label', 'Confirmação');
  box.innerHTML = `
    <p>${esc(message)}</p>
    <div class="actions">
      <button class="btn btn--primary" type="button" data-ok>${esc(okLabel)}</button>
      <button class="btn" type="button" data-cancel>Cancelar</button>
    </div>`;
  host.insertAdjacentElement('afterend', box);
  box.querySelector('[data-ok]').focus();
  return new Promise((resolve) => {
    const done = (answer) => {
      box.remove();
      anchor.focus?.();
      resolve(answer);
    };
    box.querySelector('[data-ok]').addEventListener('click', () => done(true));
    box.querySelector('[data-cancel]').addEventListener('click', () => done(false));
    box.addEventListener('keydown', (event) => event.key === 'Escape' && done(false));
  });
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
