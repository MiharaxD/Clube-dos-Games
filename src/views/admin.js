// Admin (Balcão): aprova quem está esperando. (Novos admins só pelo console, em config/admins.)
import { approveMember, removeMember } from '../api.js';
import { confirmInline, esc, toast, withBusy } from '../lib/util.js';
import { avatar, empty, memberChip } from './parts.js';

export async function renderAdmin(main, { session, refresh }) {
  const pending = session.members.filter((m) => !m.approved);
  const approved = session.members.filter((m) => m.approved);

  main.innerHTML = `
    <div class="tela-balcao">
      <header class="cabeca">
        <h1>Balcão</h1>
        <p>${approved.length} ${approved.length === 1 ? 'sócio aprovado' : 'sócios aprovados'}</p>
      </header>
      <section aria-labelledby="fila-title">
        <h2 id="fila-title">Fichas esperando</h2>
        ${pending.length
          ? `<ul class="fichas">${pending.map((m) => `
              <li class="ficha ficha--mini">
                <span class="ficha__stamp">Em análise</span>
                <div class="ficha__quem">${avatar(m)}<h3 class="ficha__title">${esc(m.name)}</h3></div>
                <p class="ficha__todo">Só falta o seu carimbo.</p>
                <div class="actions">
                  <button class="btn btn--primary btn--sm" type="button" data-approve="${esc(m.id)}">Aprovar<span class="sr-only"> ${esc(m.name)}</span></button>
                </div>
              </li>`).join('')}</ul>`
          : empty('Ninguém na fila', 'Quando alguém novo entrar com o Google, a ficha aparece aqui.')}
      </section>
      <section aria-labelledby="socios-title">
        <h2 id="socios-title">Sócios</h2>
        <ul class="list">${approved.map((m) => `<li>${memberChip(m, { platforms: true })}${m.id === session.user.uid ? '' : `
          <div class="actions"><button class="btn btn--sm" type="button" data-remove="${esc(m.id)}" data-name="${esc(m.name)}">Remover<span class="sr-only"> ${esc(m.name)}</span></button></div>`}</li>`).join('')}</ul>
      </section>
    </div>`;

  main.addEventListener('click', async (event) => {
    const remove = event.target.closest('[data-remove]');
    if (remove) {
      if (!(await confirmInline(remove, `Remover ${remove.dataset.name} do clube? Se entrar de novo, volta pra fila.`, 'Remover sócio'))) return;
      const feito = await withBusy(remove, () => removeMember(remove.dataset.remove).then(() => true));
      if (feito) {
        toast('Sócio removido.');
        await refresh();
      }
      return;
    }
    const button = event.target.closest('[data-approve]');
    if (!button) return;
    const ok = await withBusy(button, () => approveMember(button.dataset.approve).then(() => true));
    if (ok) {
      toast('Aprovado. Bem-vindo à locadora!');
      await refresh();
    }
  });
}
