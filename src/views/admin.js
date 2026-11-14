// Admin: aprova quem está esperando. (Novos admins só pelo console, em config/admins.)
import { approveMember } from '../api.js';
import { esc, toast, withBusy } from '../lib/util.js';
import { empty, memberChip } from './parts.js';

export async function renderAdmin(main, { session, refresh }) {
  const pending = session.members.filter((m) => !m.approved);
  const approved = session.members.filter((m) => m.approved);

  main.innerHTML = `
    <div class="page-head"><h1>Balcão</h1><p class="muted">${approved.length} ${approved.length === 1 ? 'sócio aprovado' : 'sócios aprovados'}</p></div>
    <section>
      <h2>Fichas esperando</h2>
      ${pending.length
        ? `<ul class="list">${pending.map((m) => `
            <li>
              ${memberChip(m)}
              <button class="btn btn--primary btn--sm" data-approve="${esc(m.id)}">Aprovar ${esc(m.name)}</button>
            </li>`).join('')}</ul>`
        : empty('Ninguém na fila', 'Quando alguém novo entrar com o Google, a ficha aparece aqui.')}
    </section>
    <section>
      <h2>Sócios</h2>
      <ul class="list">${approved.map((m) => `<li>${memberChip(m, { platforms: true })}</li>`).join('')}</ul>
    </section>`;

  main.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-approve]');
    if (!button) return;
    const ok = await withBusy(button, () => approveMember(button.dataset.approve).then(() => true));
    if (ok) {
      toast('Aprovado. Bem-vindo à locadora!');
      await refresh();
    }
  });
}
