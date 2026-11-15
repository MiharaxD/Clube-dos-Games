// Flâmula do tema da rodada, pendurada na parede em cima da prateleira (sugerindo/votando).
// Todo mundo vê; o admin clica nela e edita o texto num papelzinho logo abaixo.
import { updateRoundTheme } from '../api.js';
import { icon } from '../lib/icons.js';
import { esc, toast, withBusy } from '../lib/util.js';

const MAX = 60;

export function temaHtml(round, isAdmin) {
  const theme = round.theme ?? '';
  if (!theme && !isAdmin) return '';
  const pano = `<span class="flamula__rotulo">Tema da rodada</span>
    <span class="flamula__texto">${theme ? esc(theme) : 'Sem tema ainda'}</span>`;
  return `<div class="flamula" data-tema>
      <span class="varal__corda varal__corda--e" aria-hidden="true"></span>
      <span class="varal__corda varal__corda--d" aria-hidden="true"></span>
      <span class="flamula__sombra" aria-hidden="true"></span>
      ${isAdmin
        ? `<button class="flamula__pano${theme ? '' : ' flamula__pano--vazia'}" type="button" data-tema-editar aria-expanded="false">
            ${pano}<span class="flamula__lapis">${icon('pencil')}<span class="sr-only">Editar o tema</span></span></button>`
        : `<p class="flamula__pano">${pano}</p>`}
    </div>`;
}

export function bindTema(container, round, ctx) {
  const button = container.querySelector('[data-tema-editar]');
  if (!button) return;
  const wrap = button.closest('[data-tema]');
  // o papel fica fora da flâmula (que balança), logo depois dela
  const aberto = () => wrap.nextElementSibling?.classList.contains('flamula__form') ? wrap.nextElementSibling : null;

  const fecha = () => {
    aberto()?.remove();
    button.setAttribute('aria-expanded', 'false');
  };

  button.addEventListener('click', () => {
    if (aberto()) {
      fecha();
      return;
    }
    button.setAttribute('aria-expanded', 'true');
    wrap.insertAdjacentHTML(
      'afterend',
      `<form class="papel flamula__form">
        <label class="field"><span>Tema da rodada</span>
          <input class="input" name="theme" maxlength="${MAX}" value="${esc(round.theme ?? '')}" placeholder="Ex.: jogos indies" autocomplete="off">
          <small>Vazio esconde a faixa pra galera.</small>
        </label>
        <div class="actions">
          <button class="btn btn--primary" type="submit">Pendurar</button>
          <button class="btn" type="button" data-cancelar>Cancelar</button>
        </div>
      </form>`,
    );
    const form = aberto();
    const input = form.querySelector('input');
    input.focus();
    input.select();

    form.querySelector('[data-cancelar]').addEventListener('click', () => {
      fecha();
      button.focus();
    });
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        fecha();
        button.focus();
      }
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const theme = input.value.trim().slice(0, MAX);
      const ok = await withBusy(form.querySelector('[type=submit]'), () => updateRoundTheme(round.id, theme).then(() => true));
      if (ok) {
        toast(theme ? 'Tema pendurado na parede.' : 'Faixa tirada da parede.');
        await ctx.refresh();
      }
    });
  });
}
