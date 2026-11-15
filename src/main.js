// Ponto de entrada: confere a config, acompanha o login e desenha a tela certa.
import './styles.css';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider, missingEnv } from './firebase.js';
import { createMember, getAdminUids, getMember, listMembers } from './api.js';
import { esc, toast } from './lib/util.js';
import { icon } from './lib/icons.js';
import { avatar, neonSign } from './views/parts.js';
import { placeLights, startScene } from './lib/scene.js';
import { renderRound } from './views/round.js';
import { renderShelf } from './views/shelf.js';
import { renderStats } from './views/stats.js';
import { renderProfile } from './views/profile.js';
import { renderAdmin } from './views/admin.js';

const root = document.getElementById('app');

// Sessão do usuário logado. members = todos os membros (só aprovados conseguem ler).
const session = { user: null, member: null, isAdmin: false, members: [] };

// ------------------------------------------------------------ telas soltas

// Aviso fixo do rodapé (DESIGN.md): clube sem fins comerciais e sem afiliação.
const FOOTER = `<footer class="rodape"><p>Clube de amigos, sem fins comerciais; não é afiliado a nenhuma fabricante, estúdio ou plataforma; marcas pertencem a seus titulares.</p></footer>`;


// Tela solta: o letreiro aceso na parede e uma ficha de papel embaixo (sem barra de navegação).
function solo(body, { heading = false } = {}) {
  const sign = heading ? `<h1 class="marca">${neonSign()}</h1>` : `<div class="marca">${neonSign()}</div>`;
  root.innerHTML = `
    <div class="solo">
      <div class="solo__card">${sign}${body}</div>
    </div>
    ${FOOTER}`;
  placeLights();
}

function renderConfigError() {
  solo(`
    <section class="ficha" aria-labelledby="solo-title">
      <span class="ficha__stamp">Sem fita</span>
      <h2 class="ficha__title" id="solo-title">Falta configurar</h2>
      <p>Preencha estas variáveis no <code>.env.local</code> e reinicie o <code>npm run dev</code>. O passo a passo está no README.</p>
      <ul class="ficha__lista">${missingEnv.map((name) => `<li><code>${esc(name)}</code></li>`).join('')}</ul>
    </section>`);
}

function renderLogin() {
  solo(`
    <section class="ficha" aria-labelledby="solo-title">
      <span class="ficha__stamp">Só sócios</span>
      <h2 class="ficha__title" id="solo-title">Bem-vindo à locadora</h2>
      <p class="ficha__socio">Carteirinha de sócio</p>
      <p class="ficha__todo">Cada um sugere um jogo, a gente vota, todo mundo joga e depois conversa.</p>
      <div class="actions"><button class="btn btn--primary" id="login">Entrar com Google</button></div>
    </section>`, { heading: true });
  const button = root.querySelector('#login');
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // Navegadores embutidos (ex.: o do WhatsApp) bloqueiam popup: tenta por redirecionamento.
      if (error?.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      // Fechar o popup não é erro de verdade.
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error(error);
        toast('Não deu pra entrar. Tenta de novo?', 'error');
      }
      button.disabled = false;
    }
  });
}

function renderPending() {
  solo(`
    <section class="ficha" aria-labelledby="solo-title">
      <span class="ficha__stamp">Em análise</span>
      <h2 class="ficha__title" id="solo-title">Aguardando aprovação</h2>
      <p class="ficha__socio">Sócio: ${esc(session.member?.name ?? '')}</p>
      <p class="ficha__todo">Sua ficha de sócio tá na mesa do admin.</p>
      <p>Assim que alguém liberar, é só recarregar a página. Enquanto isso, vai escolhendo o que sugerir.</p>
      <p>Entrou como ${esc(session.user.email)}.</p>
      <div class="actions">
        <button class="btn btn--primary" id="reload">Já me aprovaram</button>
        <button class="btn" id="logout">Sair</button>
      </div>
    </section>`);
  root.querySelector('#reload').addEventListener('click', () => location.reload());
  root.querySelector('#logout').addEventListener('click', () => signOut(auth));
}

function renderLoading(message = 'Rebobinando a fita…') {
  solo(`<p class="loading" role="status">${esc(message)}</p>`);
}

function renderBootError() {
  solo(`
    <div class="empty" role="alert">
      <strong>Fita travou</strong>
      <p>Não deu pra carregar seu cadastro. Confere a internet e tenta de novo.</p>
      <div class="actions actions--center"><button class="btn btn--primary" id="retry">Recarregar</button></div>
    </div>`);
  root.querySelector('#retry').addEventListener('click', () => location.reload());
}

// ------------------------------------------------------------ casca + rotas

const ROUTES = [
  { pattern: /^#\/?$/, view: renderRound, nav: 'rodada' },
  { pattern: /^#\/rodada\/([\w-]+)$/, view: renderRound, nav: 'rodada' },
  { pattern: /^#\/estante$/, view: renderShelf, nav: 'estante' },
  { pattern: /^#\/stats$/, view: renderStats, nav: 'stats' },
  { pattern: /^#\/perfil$/, view: renderProfile, nav: 'perfil' },
  { pattern: /^#\/admin$/, view: renderAdmin, nav: 'admin', adminOnly: true },
];

function renderShell(active) {
  const pending = session.members.filter((m) => !m.approved).length;
  const link = (href, key, label) =>
    `<li><a href="${href}" ${active === key ? 'aria-current="page"' : ''}>${label}</a></li>`;
  root.innerHTML = `
    <header class="topo">
      <a class="marca" href="#/" aria-label="Clube dos Jogos, ir para a rodada">${neonSign()}</a>
      <nav class="nav" aria-label="Principal"><ul>
        ${link('#/', 'rodada', 'Rodada')}
        ${link('#/estante', 'estante', 'Estante')}
        ${link('#/stats', 'stats', 'Stats')}
        ${session.isAdmin ? link('#/admin', 'admin', `Admin${pending ? ` <span class="count">${pending}<span class="sr-only"> pendentes</span></span>` : ''}`) : ''}
      </ul></nav>
      <div class="topo__eu">
        <a class="avatar-link" href="#/perfil" title="Seu perfil">${avatar(session.member)}<span class="sr-only">Seu perfil</span></a>
        <button class="btn btn--ghost btn--icon" id="logout" title="Sair">${icon('logout')}<span class="sr-only">Sair</span></button>
      </div>
    </header>
    <main id="main" tabindex="-1"></main>
    ${FOOTER}`;
  root.querySelector('#logout').addEventListener('click', () => signOut(auth));
  return root.querySelector('#main');
}

async function route() {
  const hash = location.hash || '#/';
  const match = ROUTES.find((r) => r.pattern.test(hash) && (!r.adminOnly || session.isAdmin));
  if (!match) {
    location.hash = '#/';
    return;
  }
  // Recarrega membros a cada navegação (lista pequena) pra badges e nomes ficarem em dia.
  session.members = await listMembers();
  session.member = session.members.find((m) => m.id === session.user.uid) ?? session.member;

  // modal aberto (caixinha, calendário, quadro) não sobrevive à troca de tela
  document.querySelectorAll('body > .modal').forEach((el) => el.remove());
  document.documentElement.classList.remove('trava');
  root.inert = false;

  const main = renderShell(match.nav);
  main.innerHTML = '<p class="loading" role="status">Rebobinando a fita…</p>';
  const params = hash.match(match.pattern).slice(1);
  try {
    await match.view(main, { session, params, refresh: route });
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="empty" role="alert"><strong>Fita travou</strong><p>Não deu pra carregar essa tela. Confere a internet e tenta de novo.</p><div class="actions actions--center"><button class="btn btn--primary" type="button" data-reload>Recarregar</button></div></div>`;
    main.querySelector("[data-reload]").addEventListener("click", () => location.reload());
  }
  // a luz da cena nasce dos objetos que a tela desenhou (TV, abajur, letreiro)
  placeLights();
}

// ------------------------------------------------------------ início

startScene();

if (missingEnv.length) {
  renderConfigError();
} else {
  renderLoading();
  onAuthStateChanged(auth, async (user) => {
    window.removeEventListener('hashchange', route);
    if (!user) {
      renderLogin();
      return;
    }
    renderLoading();
    try {
      session.user = user;
      const [adminUids, existing] = await Promise.all([getAdminUids(), getMember(user.uid)]);
      session.isAdmin = adminUids.includes(user.uid);
      // Usuário novo cria o próprio doc com approved=false.
      session.member = existing ?? (await createMember(user));

      if (!session.member.approved && !session.isAdmin) {
        renderPending();
        return;
      }
      window.addEventListener('hashchange', route);
      await route();
    } catch (error) {
      console.error(error);
      renderBootError();
    }
  });
}
