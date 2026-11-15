// Ponto de entrada: confere a config, acompanha o login e desenha a tela certa.
import './styles.css';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider, missingEnv } from './firebase.js';
import { createMember, getAdminUids, getMember, listMembers } from './api.js';
import { esc, toast } from './lib/util.js';
import { icon } from './lib/icons.js';
import { avatar, neonSign } from './views/parts.js';
import { placeLights, startScene } from './lib/scene.js';
import { anim, SAI } from './lib/motion.js';
import { renderLogin } from './views/login.js';
import { ligaTvsDoSite } from './lib/rickroll.js';
import { renderRound } from './views/round.js';
import { renderShelf } from './views/shelf.js';
import { renderStats } from './views/stats.js';
import { renderProfile } from './views/profile.js';
import { renderAdmin } from './views/admin.js';

const root = document.getElementById('app');

// Sessão do usuário logado. members = todos os membros (só aprovados conseguem ler).
const session = { user: null, member: null, isAdmin: false, members: [] };

// ------------------------------------------------------------ telas soltas

// Tela solta: o letreiro aceso na parede e uma ficha de papel embaixo (sem barra de navegação).
function solo(body, { heading = false } = {}) {
  const sign = heading ? `<h1 class="marca">${neonSign()}</h1>` : `<div class="marca">${neonSign()}</div>`;
  root.innerHTML = `
    <div class="solo">
      <div class="solo__card">${sign}${body}</div>
    </div>`;
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

// Login: a cena da mesa (src/views/login.js). Resolve true se entrou, false se desistiu/falhou.
async function entrarComGoogle() {
  try {
    await signInWithPopup(auth, googleProvider);
    return true;
  } catch (error) {
    // Navegadores embutidos (ex.: o do WhatsApp) bloqueiam popup: tenta por redirecionamento.
    if (error?.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
      return false;
    }
    // Fechar o popup não é erro de verdade.
    if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
      console.error(error);
      toast('Não deu pra entrar. Tenta de novo?', 'error');
    }
    return false;
  }
}

// Depois da cena do login sair, a tela seguinte aparece com um fade (no máximo 1,5 s de espera vazia).
let revelar = null;
function preparaRevelar() {
  root.style.opacity = '0';
  let feito = false;
  const revela = () => {
    if (feito) return;
    feito = true;
    revelar = null;
    anim(root, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: SAI })
      .then(() => { root.style.transform = ''; root.style.opacity = ''; placeLights(); });
  };
  setTimeout(revela, 1500);
  revelar = revela;
}

function renderPending() {
  revelar?.();
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
  revelar?.();
  solo(`
    <div class="empty" role="alert">
      <strong>Fita travou</strong>
      <p>Não deu pra carregar seu cadastro. Confere a internet e tenta de novo.</p>
      <div class="actions actions--center"><button class="btn btn--primary" id="retry">Recarregar</button></div>
    </div>`);
  root.querySelector('#retry').addEventListener('click', () => location.reload());
}

// ------------------------------------------------------------ casca + rotas

const TITULO_BASE = 'Clube dos Jogos';
const ROUTES = [
  { pattern: /^#\/?$/, view: renderRound, nav: 'rodada', title: 'Rodada' },
  { pattern: /^#\/rodada\/([\w-]+)$/, view: renderRound, nav: 'rodada', title: 'Rodada' },
  { pattern: /^#\/estante$/, view: renderShelf, nav: 'estante', title: 'Estante' },
  { pattern: /^#\/stats$/, view: renderStats, nav: 'stats', title: 'Stats' },
  { pattern: /^#\/perfil$/, view: renderProfile, nav: 'perfil', title: 'Seu perfil' },
  { pattern: /^#\/admin$/, view: renderAdmin, nav: 'admin', title: 'Balcão do admin', adminOnly: true },
];

function renderShell(active, title) {
  const pending = session.members.filter((m) => !m.approved).length;
  const link = (href, key, label) =>
    `<li><a href="${href}" ${active === key ? 'aria-current="page"' : ''}>${label}</a></li>`;
  root.innerHTML = `
    <a class="pular" href="#main" data-pular>Pular pro conteúdo</a>
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
    <main id="main" tabindex="-1" aria-label="${esc(title)}"></main>`;
  root.querySelector('#logout').addEventListener('click', () => signOut(auth));
  // href="#main" cairia no roteador por hash: o link só move o foco
  root.querySelector('[data-pular]').addEventListener('click', (event) => {
    event.preventDefault();
    root.querySelector('#main').focus();
  });
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

  // a casca é refeita a cada rota: título da aba por tela e o foco vai pro conteúdo (senão cairia no body)
  document.title = `${match.title} · ${TITULO_BASE}`;
  const main = renderShell(match.nav, match.title);
  main.focus({ preventScroll: true });
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
  revelar?.();
}

// ------------------------------------------------------------ início

startScene();
ligaTvsDoSite();

if (missingEnv.length) {
  renderConfigError();
} else {
  renderLoading();
  let cenaLogin = null;
  onAuthStateChanged(auth, async (user) => {
    window.removeEventListener('hashchange', route);
    if (!user) {
      document.title = TITULO_BASE;
      cenaLogin = renderLogin(root, { entrar: entrarComGoogle });
      return;
    }
    if (cenaLogin) {
      // acabou de entrar: contrato volta pra mesa, tudo voa, e a próxima tela aparece suave
      const cena = cenaLogin;
      cenaLogin = null;
      await cena.sai();
      root.innerHTML = '';
      preparaRevelar();
    } else {
      renderLoading();
    }
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
