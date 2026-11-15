// Perfil: a carteirinha de sócio. Nome e plataformas em que o membro joga
// (usadas na badge "X de N conseguem jogar").
import { updateProfile } from '../api.js';
import { PLATFORMS } from '../lib/platforms.js';
import { esc, toast, withBusy } from '../lib/util.js';
import { avatar } from './parts.js';

export async function renderProfile(main, { session, refresh }) {
  const me = session.member;
  const mine = new Set(me.platforms ?? []);

  main.innerHTML = `
    <div class="perfil">
      <header class="cabeca">
        <h1>Seu perfil</h1>
        <p>Carteirinha em dia, balconista feliz.</p>
      </header>
      <form class="ficha carteirinha" id="profile" aria-labelledby="carteirinha-title">
        <span class="ficha__stamp">Em dia</span>
        <h2 class="ficha__title" id="carteirinha-title">Carteirinha</h2>
        <div class="carteirinha__socio">
          ${avatar(me)}
          <p class="carteirinha__email">${esc(session.user.email)}</p>
        </div>
        <div class="form carteirinha__campos">
          <label class="field">
            <span>Nome no clube</span>
            <input class="input" name="name" required maxlength="80" value="${esc(me.name)}" autocomplete="nickname">
          </label>
          <fieldset class="field">
            <legend>Onde você joga</legend>
            <small>A gente usa isso pra avisar quantos sócios conseguem jogar cada sugestão.</small>
            <div class="checks">
              ${PLATFORMS.map((p) => `
                <label class="check"><input type="checkbox" name="platforms" value="${p}" ${mine.has(p) ? 'checked' : ''}>${p}</label>`).join('')}
            </div>
          </fieldset>
          <div class="actions"><button class="btn btn--primary" type="submit">Salvar perfil</button></div>
        </div>
      </form>
    </div>`;

  main.querySelector('#profile').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    if (!name) return toast('Coloca um nome, vai.', 'error');
    const platforms = form.getAll('platforms').map(String);
    const button = event.currentTarget.querySelector('[type=submit]');
    const saved = await withBusy(button, () => updateProfile(session.user.uid, { name, platforms }).then(() => true));
    if (saved) {
      toast('Perfil salvo.');
      await refresh();
    }
  });
}
