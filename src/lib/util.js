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
export function safeUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

export const STATUS_ORDER = ['sugerindo', 'votando', 'jogando', 'encerrada'];

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

// Aviso rápido no rodapé da tela (lido por leitores de tela via aria-live).
let toastTimer;
export function toast(message, kind = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 4000);
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
