// Pedaços de interface repetidos entre telas. Tudo devolve string HTML já escapada.
import { DURATION_LABEL, MODE_LABEL, STATUS_LABEL, STATUS_ORDER, esc, fmtPrice, safeUrl } from '../lib/util.js';
import { playableCount } from '../lib/platforms.js';

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

// Faixa de fases: sempre no mesmo lugar, lida da esquerda pra direita.
export function phaseSteps(status) {
  const current = STATUS_ORDER.indexOf(status);
  return `<ol class="steps" aria-label="Fases da rodada">${STATUS_ORDER.map((s, i) => {
    const cls = i < current ? 'is-done' : i === current ? 'is-now' : '';
    const label = i < current ? `${STATUS_LABEL[s]}<span class="sr-only"> (concluída)</span>` : STATUS_LABEL[s];
    return `<li class="${cls}" ${i === current ? 'aria-current="step"' : ''}>${label}</li>`;
  }).join('')}</ol>`;
}

// Capa 3:4. Sem imagem, mostra o nome sobre um fundo listrado de "caixa sem encarte".
export function cover(game) {
  const url = safeUrl(game?.cover);
  const blank = `<span class="cover__blank" ${url ? 'hidden' : ''}>${esc(game?.name ?? '')}</span>`;
  const img = url
    ? `<img src="${esc(url)}" alt="Capa de ${esc(game.name)}" loading="lazy" onerror="this.remove();this.nextElementSibling.hidden=false">`
    : '';
  return `<div class="cover">${img}${blank}</div>`;
}

export function playBadge(game, members) {
  if (!game.platforms?.length) return `<p class="plat plat--warn">Plataforma não informada</p>`;
  const { able, total } = playableCount(game.platforms, members);
  const warn = able < total ? 'plat--warn' : '';
  return `<p class="plat ${warn}">${able} de ${total} conseguem jogar</p>`;
}

// Card de jogo na prateleira. Partes opcionais entram por "slots".
export function gameBox(game, members, { cls = '', stamp = '', note = '', actions = '', showPitch = true } = {}) {
  const meta = [game.year, game.genre].filter(Boolean).map(esc).join(' · ');
  return `
    <article class="box ${cls}" data-game="${esc(game.id)}">
      <div class="box__art">
        ${cover(game)}
        <span class="price">${esc(fmtPrice(game.price))}</span>
        <span class="tag">${esc(DURATION_LABEL[game.duration] ?? '')} · ${esc(MODE_LABEL[game.mode] ?? '')}</span>
        ${stamp}${note}
      </div>
      <h3 class="box__name">${esc(game.name)}</h3>
      ${meta ? `<p class="box__meta">${meta}</p>` : ''}
      <p class="box__by">sugestão de ${esc(memberName(members, game.suggestedBy))}</p>
      ${playBadge(game, members)}
      ${showPitch && game.pitch ? `<p class="box__pitch">“${esc(game.pitch)}”</p>` : ''}
      ${actions ? `<div class="box__actions">${actions}</div>` : ''}
    </article>`;
}

export function shelf(boxesHtml) {
  return `<div class="shelf-row">${boxesHtml}</div><div class="shelf-lip"></div>`;
}

export function empty(title, text) {
  return `<div class="empty"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`;
}
