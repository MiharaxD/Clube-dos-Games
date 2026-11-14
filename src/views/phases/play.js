// Fases "jogando" e "encerrada": o jogo vencedor, prazo e call, resultado da votação,
// enquete de datas, notas (com spoiler) e perguntas pra discussão.
import {
  addQuestion,
  deleteQuestion,
  saveDateVote,
  saveRating,
  updateQuestion,
  updateRound,
  updateRoundDates,
} from '../../api.js';
import { icon } from '../../lib/icons.js';
import { average } from '../../lib/tally.js';
import { esc, fmtDateTime, fmtDay, fmtScore, safeUrl, toast, withBusy } from '../../lib/util.js';
import { cover, empty, memberChip, memberName } from '../parts.js';

const QUESTION_MAX = 300;
const COMMENT_MAX = 1000;

export function renderPlay(container, data, ctx) {
  const { round } = data;
  const playing = round.status === 'jogando';
  const canEdit = ctx.session.isAdmin && data.isLatest && playing;

  container.innerHTML = `
    ${winnerSection(data, canEdit)}
    ${resultSection(data)}
    ${playing || round.dateOptions?.length ? datesSection(data, canEdit, playing) : ''}
    ${ratingsSection(data)}
    ${questionsSection(data, ctx)}`;

  bindInfo(container, data, ctx);
  bindDates(container, data, ctx);
  bindRating(container, data, ctx);
  bindQuestions(container, data, ctx);
}

// ------------------------------------------------------------ vencedor + prazo + call

function winnerSection({ round, games, members, ranking }, canEdit) {
  const game = games.find((g) => g.id === round.winnerGameId) ?? round.winner;
  const votes = ranking.find((r) => r.game.id === round.winnerGameId)?.count ?? 0;
  const tied = (round.tiebreak?.candidates ?? []).map((id) => games.find((g) => g.id === id)?.name).filter(Boolean);
  const call = safeUrl(round.callLink);

  return `
    <section class="winner" aria-labelledby="winner-title">
      <div class="winner__cover">${cover(game)}<span class="stamp stamp--lime">${tied.length ? 'Sorteado' : 'Vencedor'}</span></div>
      <div class="winner__info">
        <h2 id="winner-title">${esc(game.name)}</h2>
        <p>Sugestão de <strong>${esc(memberName(members, game.suggestedBy))}</strong> · ${votes} ${votes === 1 ? 'voto' : 'votos'}</p>
        ${tied.length ? `<p class="muted small">Deu empate e saiu no sorteio entre ${tied.map(esc).join(', ')}.</p>` : ''}
        ${game.pitch ? `<p class="box__pitch">“${esc(game.pitch)}”</p>` : ''}
        <dl class="facts">
          <div><dt>Prazo pra jogar</dt><dd>${round.deadline ? esc(fmtDay(round.deadline)) : 'sem prazo ainda'}</dd></div>
          <div><dt>Reunião</dt><dd>${round.meetingDate ? esc(fmtDateTime(round.meetingDate)) : 'data em votação'}</dd></div>
        </dl>
        ${call ? `<p><a class="btn btn--primary" href="${esc(call)}" target="_blank" rel="noopener">${icon('link')} Entrar na call</a></p>` : ''}
        ${canEdit ? `
          <form class="form panel panel--admin" id="info-form" style="margin-top:16px">
            <p class="panel__title">Prazo e call</p>
            <div class="field-row">
              <label class="field"><span>Prazo pra jogar</span>
                <input class="input" type="date" name="deadline" value="${esc(round.deadline ?? '')}">
              </label>
              <label class="field"><span>Link da call</span>
                <input class="input" type="url" name="callLink" placeholder="https://meet…" value="${esc(round.callLink ?? '')}">
              </label>
            </div>
            <div class="actions"><button class="btn btn--primary" type="submit">Salvar prazo e call</button></div>
          </form>` : ''}
      </div>
    </section>`;
}

function bindInfo(container, data, ctx) {
  const form = container.querySelector('#info-form');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const deadline = form.elements.deadline.value;
    const rawLink = form.elements.callLink.value.trim();
    const callLink = rawLink ? safeUrl(rawLink) : '';
    if (rawLink && !callLink) return toast('O link da call precisa começar com https://', 'error');
    const ok = await withBusy(form.querySelector('[type=submit]'), () =>
      updateRound(data.round.id, { deadline, callLink }).then(() => true),
    );
    if (ok) {
      toast('Prazo e call salvos.');
      await ctx.refresh();
    }
  });
}

// ------------------------------------------------------------ resultado da votação

function resultSection({ ranking, members }) {
  const max = Math.max(1, ...ranking.map((r) => r.count));
  return `
    <section aria-labelledby="result-title">
      <h2 id="result-title">Como foi a votação</h2>
      <div class="panel tally">
        ${ranking.map((r, i) => `
          <div class="tally__row ${i === 0 ? 'is-top' : ''}">
            <span><strong>${esc(r.game.name)}</strong> <span class="small muted">de ${esc(memberName(members, r.game.suggestedBy))}</span></span>
            <span class="tally__num">${r.count}</span>
            <span class="tally__bar" aria-hidden="true"><i style="width:${(r.count / max) * 100}%"></i></span>
            ${r.voters.length ? `<span class="small muted" style="grid-column:1/-1">${r.voters.map((id) => esc(memberName(members, id))).join(', ')}</span>` : ''}
          </div>`).join('')}
      </div>
    </section>`;
}

// ------------------------------------------------------------ enquete de datas

function datesSection({ round, dateVotes, members, uid }, canEdit, playing) {
  const options = round.dateOptions ?? [];
  const mine = new Set(dateVotes.find((d) => d.id === uid)?.dates ?? []);
  const votersOf = (date) => dateVotes.filter((d) => d.dates.includes(date)).map((d) => d.id);

  const list = options.length
    ? `<ul class="list">${options.map((date) => {
        const voters = votersOf(date);
        const confirmed = round.meetingDate === date;
        return `
          <li class="${confirmed ? 'is-confirmed' : ''}">
            <label class="check date-check">
              <input type="checkbox" name="dates" value="${esc(date)}" ${mine.has(date) ? 'checked' : ''} ${playing ? '' : 'disabled'}>
              <span><strong>${esc(fmtDateTime(date))}</strong>${confirmed ? ' <span class="pill">Marcada</span>' : ''}<br>
              <span class="small muted">${voters.length} ${voters.length === 1 ? 'pode' : 'podem'}${voters.length ? `: ${voters.map((id) => esc(memberName(members, id))).join(', ')}` : ''}</span></span>
            </label>
            ${canEdit ? `
              <span class="actions">
                ${confirmed ? '' : `<button class="btn btn--sm" type="button" data-confirm-date="${esc(date)}">Marcar esta</button>`}
                <button class="btn btn--sm btn--ghost" type="button" data-remove-date="${esc(date)}">${icon('trash')}<span class="sr-only">Remover opção ${esc(fmtDateTime(date))}</span></button>
              </span>` : ''}
          </li>`;
      }).join('')}</ul>`
    : empty('Sem datas ainda', canEdit ? 'Propõe algumas datas aí embaixo.' : 'O admin ainda não propôs datas pra reunião.');

  return `
    <section aria-labelledby="dates-title">
      <h2 id="dates-title">Quando a gente se reúne?</h2>
      <p class="muted" style="margin-bottom:12px">Marca todas as datas em que você pode. O admin confirma a que juntar mais gente.</p>
      <form id="dates-form">
        ${list}
        ${playing && options.length ? '<div class="actions" style="margin-top:12px"><button class="btn btn--primary" type="submit">Salvar minhas datas</button></div>' : ''}
      </form>
      ${canEdit ? `
        <form class="form panel panel--admin" id="add-date" style="margin-top:16px">
          <label class="field"><span>Propor nova data</span>
            <input class="input" type="datetime-local" name="date" required>
          </label>
          <div class="actions"><button class="btn btn--primary" type="submit">Adicionar data</button></div>
        </form>` : ''}
    </section>`;
}

function bindDates(container, data, ctx) {
  const { round, uid } = data;
  const options = round.dateOptions ?? [];

  container.querySelector('#dates-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dates = [...event.currentTarget.querySelectorAll('input[name=dates]:checked')]
      .map((i) => i.value)
      .filter((d) => options.includes(d)); // as rules só aceitam datas propostas
    const ok = await withBusy(event.submitter, () => saveDateVote(round.id, uid, dates).then(() => true));
    if (ok) {
      toast('Datas salvas.');
      await ctx.refresh();
    }
  });

  container.querySelector('#add-date')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = event.currentTarget.elements.date.value; // "2026-12-05T20:00"
    if (!date) return;
    if (options.includes(date)) return toast('Essa data já tá na lista.', 'error');
    if (options.length >= 20) return toast('Já tem 20 datas. Remove alguma antes.', 'error');
    const next = [...options, date].sort();
    const ok = await withBusy(event.submitter, () => updateRoundDates(round.id, next, round.meetingDate).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.addEventListener('click', async (event) => {
    const confirmBtn = event.target.closest('[data-confirm-date]');
    const removeBtn = event.target.closest('[data-remove-date]');
    if (confirmBtn) {
      const date = confirmBtn.dataset.confirmDate;
      const ok = await withBusy(confirmBtn, () => updateRoundDates(round.id, options, date).then(() => true));
      if (ok) {
        toast(`Reunião marcada: ${fmtDateTime(date)}.`);
        await ctx.refresh();
      }
    }
    if (removeBtn) {
      const date = removeBtn.dataset.removeDate;
      if (!confirm(`Remover ${fmtDateTime(date)} da enquete?`)) return;
      const meeting = round.meetingDate === date ? null : round.meetingDate;
      const ok = await withBusy(removeBtn, () =>
        updateRoundDates(round.id, options.filter((d) => d !== date), meeting).then(() => true),
      );
      if (ok) await ctx.refresh();
    }
  });
}

// ------------------------------------------------------------ notas

function ratingsSection({ ratings, members, uid }) {
  const mine = ratings.find((r) => r.id === uid);
  const avg = average(ratings.map((r) => r.score));
  const sorted = [...ratings].sort((a, b) => b.score - a.score);
  const score = mine?.score ?? 5;

  return `
    <section aria-labelledby="ratings-title">
      <div class="page-head" style="margin-bottom:8px">
        <h2 id="ratings-title">Notas</h2>
        <p class="muted">${avg === null ? 'Ninguém deu nota ainda' : `Média <strong class="score-inline">${fmtScore(avg)}</strong> com ${ratings.length} ${ratings.length === 1 ? 'nota' : 'notas'}`}</p>
      </div>
      <form class="form panel" id="rating-form">
        <label class="field" for="score"><span>${mine ? 'Sua nota (dá pra mudar)' : 'Sua nota'}</span></label>
        <div class="score-picker">
          <input type="range" id="score" name="score" min="0" max="10" step="0.5" value="${score}" aria-describedby="score-out">
          <output id="score-out" class="score-out" for="score">${fmtScore(score)}</output>
        </div>
        <label class="field"><span>Comentário</span>
          <textarea class="input" name="comment" maxlength="${COMMENT_MAX}" placeholder="Opcional. O que achou?">${esc(mine?.comment ?? '')}</textarea>
        </label>
        <label class="check"><input type="checkbox" name="spoiler" ${mine?.spoiler ? 'checked' : ''}> Tem spoiler (o comentário fica escondido até clicar)</label>
        <div class="actions"><button class="btn btn--primary" type="submit">${mine ? 'Atualizar nota' : 'Dar nota'}</button></div>
      </form>
      ${sorted.length ? `<ul class="list ratings">${sorted.map((r) => `
        <li>
          <div class="rating__head">${memberChip(members.find((m) => m.id === r.id) ?? { name: 'Ex-sócio' })}<span class="rating__score">${fmtScore(r.score)}</span></div>
          ${commentHtml(r)}
        </li>`).join('')}</ul>` : ''}
    </section>`;
}

function commentHtml(rating) {
  if (!rating.comment) return '';
  if (!rating.spoiler) return `<p class="rating__comment">${esc(rating.comment)}</p>`;
  return `
    <details class="spoiler">
      <summary>${icon('eye')} Tem spoiler. Mostrar comentário</summary>
      <p class="rating__comment">${esc(rating.comment)}</p>
    </details>`;
}

function bindRating(container, data, ctx) {
  const form = container.querySelector('#rating-form');
  const range = form.elements.score;
  const out = form.querySelector('#score-out');
  range.addEventListener('input', () => (out.textContent = fmtScore(Number(range.value))));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const score = Number(range.value);
    const comment = form.elements.comment.value.trim();
    const spoiler = form.elements.spoiler.checked;
    const ok = await withBusy(event.submitter, () =>
      saveRating(data.round.id, data.uid, { score, comment, spoiler }).then(() => true),
    );
    if (ok) {
      toast(`Nota ${fmtScore(score)} registrada.`);
      await ctx.refresh();
    }
  });
}

// ------------------------------------------------------------ perguntas

function questionsSection({ questions, members, uid }, ctx) {
  const isAdmin = ctx.session.isAdmin;
  return `
    <section aria-labelledby="questions-title">
      <h2 id="questions-title">Perguntas pra reunião</h2>
      <p class="muted" style="margin-bottom:12px">Qualquer sócio pode deixar uma pergunta pra puxar a conversa.</p>
      ${questions.length ? `<ol class="list questions">${questions.map((q) => `
        <li data-question="${esc(q.id)}">
          <div class="question__body">
            <p class="question__text">${esc(q.text)}</p>
            <p class="small muted">${esc(memberName(members, q.createdBy))}${q.updatedAt ? ' · editada' : ''}</p>
          </div>
          <span class="actions">
            ${q.createdBy === uid ? `<button class="btn btn--sm btn--ghost" data-edit-q>${icon('pencil')}<span class="sr-only">Editar pergunta</span></button>` : ''}
            ${q.createdBy === uid || isAdmin ? `<button class="btn btn--sm btn--ghost" data-delete-q>${icon('trash')}<span class="sr-only">Apagar pergunta</span></button>` : ''}
          </span>
        </li>`).join('')}</ol>` : empty('Nenhuma pergunta ainda', 'Qual foi a parte que mais te pegou? Começa por aí.')}
      <form class="form" id="question-form" style="margin-top:16px">
        <label class="field"><span>Nova pergunta</span>
          <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required placeholder="Ex.: o final fez sentido pra você?"></textarea>
        </label>
        <div class="actions"><button class="btn btn--primary" type="submit">Adicionar pergunta</button></div>
      </form>
    </section>`;
}

function bindQuestions(container, data, ctx) {
  const roundId = data.round.id;

  container.querySelector('#question-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = event.currentTarget.elements.text.value.trim();
    if (!text) return;
    const ok = await withBusy(event.submitter, () => addQuestion(roundId, data.uid, text).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.addEventListener('click', async (event) => {
    const item = event.target.closest('[data-question]');
    if (!item) return;
    const id = item.dataset.question;
    const question = data.questions.find((q) => q.id === id);

    if (event.target.closest('[data-delete-q]')) {
      if (!confirm('Apagar essa pergunta?')) return;
      const ok = await withBusy(null, () => deleteQuestion(roundId, id).then(() => true));
      if (ok) await ctx.refresh();
    }

    if (event.target.closest('[data-edit-q]')) {
      // Edição no lugar: troca o texto por um campo.
      item.querySelector('.question__body').innerHTML = `
        <form class="form" data-edit-form>
          <label class="field"><span class="sr-only">Editar pergunta</span>
            <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required>${esc(question.text)}</textarea>
          </label>
          <div class="actions">
            <button class="btn btn--primary btn--sm" type="submit">Salvar</button>
            <button class="btn btn--sm" type="button" data-cancel>Cancelar</button>
          </div>
        </form>`;
      item.querySelector('textarea').focus();
      item.querySelector('[data-cancel]').addEventListener('click', () => ctx.refresh());
      item.querySelector('[data-edit-form]').addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
        const text = submitEvent.currentTarget.elements.text.value.trim();
        if (!text) return;
        const ok = await withBusy(submitEvent.submitter, () => updateQuestion(roundId, id, text).then(() => true));
        if (ok) await ctx.refresh();
      });
    }
  });
}
