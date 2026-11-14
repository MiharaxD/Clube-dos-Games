// Ponto de entrada: confere a config, acompanha o login e desenha a tela certa.
import './styles.css';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, missingEnv } from './firebase.js';
import { createMember, getAdminUids, getMember, listMembers } from './api.js';
import { esc, toast } from './lib/util.js';
import { icon } from './lib/icons.js';
import { avatar } from './views/parts.js';
import { renderRound } from './views/round.js';
import { renderShelf } from './views/shelf.js';
import { renderStats } from './views/stats.js';
import { renderProfile } from './views/profile.js';
import { renderAdmin } from './views/admin.js';

const root = document.getElementById('app');

// Sessão do usuário logado. members = todos os membros (só aprovados conseguem ler).
const session = { user: null, member: null, isAdmin: false, members: [] };

// ------------------------------------------------------------ telas soltas

function renderConfigError() {
  root.innerHTML = `
    <div class="solo"><div class="solo__card">
      <span class="logo">CLUBE DOS JOGOS</span>
      <div class="ficha">
        <p class="ficha__title">Falta configurar</p>
        <p>Preencha estas variáveis no <code>.env.local</code> e reinicie o <code>npm run dev</code>. O passo a passo está no README.</p>
        <ul>${missingEnv.map((name) => `<li><code>${esc(name)}</code></li>`).join('')}</ul>
      </div>
    </div></div>`;
}

function renderLogin() {
  root.innerHTML = `
    <div class="solo"><div class="solo__card">
      <h1 class="logo">CLUBE DOS JOGOS</h1>
      <div class="ficha">
        <span class="ficha__stamp">Só sócios</span>
        <p class="ficha__title">Bem-vindo à locadora</p>
        <p class="ficha__todo">Cada um sugere um jogo, a gente vota, todo mundo joga e depois conversa.</p>
        <div class="actions"><button class="btn btn--primary" id="login">Entrar com Google</button></div>
      </div>
    </div></div>`;
  root.querySelector('#login').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // Fechar o popup não é erro de verdade.
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error(error);
        toast('Não deu pra entrar. Tenta de novo?', 'error');
      }
      event.currentTarget.disabled = false;
    }
  });
}

function renderPending() {
  root.innerHTML = `
    <div class="solo"><div class="solo__card">
      <span class="logo">CLUBE DOS JOGOS</span>
      <div class="ficha">
        <span class="ficha__stamp">Em análise</span>
        <p class="ficha__title">Aguardando aprovação</p>
        <p class="ficha__todo">Sua ficha de sócio tá na mesa do admin.</p>
        <p>Assim que alguém liberar, é só recarregar a página. Enquanto isso, vai escolhendo o que sugerir.</p>
        <p class="small">Entrou como ${esc(session.user.email)}.</p>
        <div class="actions">
          <button class="btn btn--primary" id="reload">Já me aprovaram</button>
          <button class="btn" id="logout">Sair</button>
        </div>
      </div>
    </div></div>`;
  root.querySelector('#reload').addEventListener('click', () => location.reload());
  root.querySelector('#logout').addEventListener('click', () => signOut(auth));
}

function renderLoading(message = 'Abrindo a locadora…') {
  root.innerHTML = `<p class="loading">${esc(message)}</p>`;
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
    `<a href="${href}" ${active === key ? 'aria-current="page"' : ''}>${label}</a>`;
  root.innerHTML = `
    <header class="topbar"><div class="topbar__in">
      <a class="logo" href="#/">CLUBE DOS JOGOS</a>
      <nav class="nav" aria-label="Principal">
        ${link('#/', 'rodada', 'Rodada')}
        ${link('#/estante', 'estante', 'Estante')}
        ${link('#/stats', 'stats', 'Stats')}
        ${session.isAdmin ? link('#/admin', 'admin', `Admin${pending ? ` <span class="count">${pending}<span class="sr-only"> pendentes</span></span>` : ''}`) : ''}
      </nav>
      <div class="topbar__me">
        <a class="avatar-link" href="#/perfil" title="Seu perfil">${avatar(session.member)}<span class="sr-only">Seu perfil</span></a>
        <button class="btn btn--ghost btn--sm" id="logout" title="Sair">${icon('logout')}<span class="sr-only">Sair</span></button>
      </div>
    </div></header>
    <main id="main" tabindex="-1"></main>`;
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

  const main = renderShell(match.nav);
  main.innerHTML = '<p class="loading">Carregando…</p>';
  const params = hash.match(match.pattern).slice(1);
  try {
    await match.view(main, { session, params, refresh: route });
  } catch (error) {
    console.error(error);
    main.innerHTML = `<div class="empty"><strong>Fita travou</strong><p>Não deu pra carregar essa tela. Recarrega a página?</p></div>`;
  }
}

// ------------------------------------------------------------ início

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
      renderLoading('Não deu pra carregar seu cadastro. Recarrega a página?');
    }
  });
}
