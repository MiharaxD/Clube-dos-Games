// Tela de login: a mesa 3D começa vazia; depois de 1 s caem do céu o videogame (esquerda),
// a TV (direita) e a prancheta do contrato (meio). O contrato é o botão "Entrar com Google".
// Devolve { sai } para o main.js chamar quando o login terminar (tudo voa e a mesa some).
import { anim, calma, espera, ENTRA_RAPIDO, GRAVIDADE, NA_TELA, SAI } from '../lib/motion.js';
import { placeLights } from '../lib/scene.js';
import { contratoHtml, mesaSection, mountMesa } from './mesa.js';
import { neonSign } from './parts.js';
import { ligaTv } from '../lib/rickroll.js';

const TITULO = 'Bem-vindo à locadora';
const TEXTO = 'Cada um sugere um jogo, a gente vota, todo mundo joga e depois conversa.';
const CEU = 'translate3d(0, -1500px, 0)';

// entrar(): chamado no clique do contrato; precisa abrir o popup na hora (bloqueador de popup).
export function renderLogin(root, { entrar }) {
  const alvos = [
    { obj: 'prancheta-obj', label: 'Entrar com Google: assinar o contrato de sócio', popup: false },
    { obj: 'tv-obj', label: 'Ligar a TV', popup: false },
    { obj: 'console-obj', label: 'Mexer no controle', popup: false },
  ];
  root.innerHTML = `
    <div class="login">
      <div class="marca" aria-hidden="true">${neonSign()}</div>
      <h1 class="sr-only">${TITULO}</h1>
      <p class="sr-only">${TEXTO}</p>
      ${mesaSection({ alvos })}
    </div>`;
  const tela = root.querySelector('.login');
  const sec = tela.querySelector('.mesa-sec');
  sec.dataset.ocupado = '1';
  const mesa = mountMesa(sec, { fase: 'login', tvTitulo: TITULO, tvTexto: TEXTO, alvos });
  const objeto = (id) => mesa.mesa.querySelector(`#${id}`);
  const mola = (id) => objeto(id).querySelector('.mola');
  const botao = (id) => sec.querySelector(`[data-obj="${id}"]`);
  const ORDEM = ['console-obj', 'tv-obj', 'prancheta-obj'];

  // ---------------------------------------------------------- chegada: tudo cai do céu
  // Os alvos só existem depois que os objetos pousam (antes disso estariam no lugar errado).
  sec.classList.add('caindo');
  if (!calma.matches) ORDEM.forEach((id) => (mola(id).style.transform = CEU));

  const impacto = (id) => {
    anim(mesa.mesa, [{ transform: 'none' }, { transform: 'translateY(7px)' }, { transform: 'none' }], { duration: 240, easing: SAI });
    anim(mola(id), [{ transform: 'none' }, { transform: 'translateY(-12px)' }, { transform: 'none' }], { duration: 260, easing: SAI });
    const sombra = mesa.mesa.querySelector(`[data-de="${id}"]`);
    if (sombra) anim(sombra, [{ scale: '0.5' }, { scale: '1' }], { duration: 200, easing: SAI });
  };
  const chegada = (async () => {
    await espera(1000);
    if (!tela.isConnected) return;
    await Promise.all(ORDEM.map(async (id, i) => {
      await anim(mola(id), [{ transform: CEU }, { transform: 'none' }], { duration: 560, delay: i * 260, easing: GRAVIDADE });
      impacto(id);
    }));
    await espera(280);
    sec.classList.remove('caindo');
    delete sec.dataset.ocupado;
    mesa.alinha();
    placeLights();
  })();

  // ---------------------------------------------------------- TV: pulo, chiado e... (src/lib/rickroll.js)
  botao('tv-obj').addEventListener('click', () => {
    if (sec.dataset.ocupado) return;
    ligaTv(objeto('tv-obj').querySelector('.tvm__vidro'), mola('tv-obj'));
  });

  // ---------------------------------------------------------- videogame: o controle dá uma voadinha
  let voando = false;
  botao('console-obj').addEventListener('click', async () => {
    if (voando || sec.dataset.ocupado) return;
    voando = true;
    const voo = objeto('console-obj').querySelector('.voo');
    await anim(voo, [
      { transform: 'none', easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
      { transform: 'translate3d(0, -200px, 0) rotateX(200deg) rotateZ(25deg)', offset: 0.45, easing: GRAVIDADE },
      { transform: 'translate3d(0, 0, 0) rotateX(360deg) rotateZ(0deg)', offset: 0.85 },
      { transform: 'translate3d(0, -10px, 0) rotateX(360deg)', offset: 0.92 },
      { transform: 'rotateX(360deg)' },
    ], { duration: 1000 });
    voo.style.transform = '';
    voando = false;
  });

  // ---------------------------------------------------------- contrato: fica em evidência até o login acabar
  let foco = null; // { modal, volta }
  const prancheta = () => objeto('prancheta-obj').querySelector('.prancheta3d__frente');

  function abreContrato() {
    const modal = document.createElement('div');
    modal.className = 'modal modal--contrato';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'contrato-titulo');
    modal.innerHTML = `<div class="modal__fundo"></div>
      <div class="prancheta prancheta--foco">${contratoHtml('contrato-titulo')}</div>
      <p class="contrato__status" role="status">Assina lá na janelinha do Google. Fechou sem querer? Clica no botão de novo.</p>`;
    document.body.append(modal);
    // o botão do contrato em evidência também funciona (se a janelinha fechou e nada aconteceu)
    modal.querySelector('[data-reentrar]').addEventListener('click', () => tenta());
    const papel = modal.querySelector('.prancheta--foco');
    const fundo = modal.querySelector('.modal__fundo');
    const status = modal.querySelector('.contrato__status');
    // voo entre a projeção 3D da prancheta e a prancheta em evidência (mesmo truque do quadro)
    const daMesa = () => {
      const a = prancheta().getBoundingClientRect();
      const b = papel.getBoundingClientRect();
      return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    };
    root.inert = true;
    const longe = daMesa();
    objeto('prancheta-obj').style.visibility = 'hidden';
    anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
    anim(status, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 420, easing: SAI });
    anim(papel, [{ transform: longe }, { transform: 'none' }], { duration: 600, easing: NA_TELA })
      .then(() => modal.querySelector('#contrato-titulo')?.focus({ preventScroll: true }));

    let voltando = null;
    const volta = () => (voltando ??= (async () => {
      anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
      anim(status, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: ENTRA_RAPIDO });
      await anim(papel, [{ transform: 'none' }, { transform: daMesa() }], { duration: 480, easing: NA_TELA });
      objeto('prancheta-obj').style.visibility = '';
      modal.remove();
      root.inert = false;
      foco = null;
    })());
    foco = { volta };
  }

  // Cada clique abre o popup na hora (bloqueador de popup). Só a última tentativa decide:
  // abrir de novo cancela a anterior, que volta false e não pode mandar o contrato pra mesa.
  let tentativa = 0;
  const gatilho = botao('prancheta-obj');
  async function tenta() {
    const n = ++tentativa;
    const ok = await entrar();
    // deu errado ou desistiu: o contrato volta pra mesa (deu certo: o main.js chama sai())
    if (!ok && n === tentativa && foco) {
      await foco.volta();
      if (gatilho.isConnected) gatilho.focus({ preventScroll: true });
    }
  }
  gatilho.addEventListener('click', () => {
    if (foco || sec.dataset.ocupado) return;
    tenta();
    abreContrato();
  });


  // ---------------------------------------------------------- saída: contrato volta, tudo voa, a mesa some
  async function sai() {
    await chegada;
    if (foco) await foco.volta();
    sec.dataset.ocupado = '1';
    sec.classList.add('caindo'); // esconde os alvos
    const lado = { 'console-obj': -1, 'tv-obj': 1, 'prancheta-obj': 0.2 };
    await Promise.all(['prancheta-obj', 'console-obj', 'tv-obj'].map((id, i) =>
      anim(mola(id), [
        { transform: 'none' },
        { transform: 'translate3d(0, 14px, 0)', offset: 0.18 },
        { transform: `translate3d(${lado[id] * 260}px, -1600px, 0) rotateZ(${lado[id] * 40}deg) rotateX(-30deg)` },
      ], { duration: 720, delay: i * 110, easing: ENTRA_RAPIDO })));
    // foram embora: some a sombra deles na mesa e a luz da TV apaga
    ORDEM.forEach((id) => {
      objeto(id).style.display = 'none';
      mesa.mesa.querySelector(`[data-de="${id}"]`)?.remove();
    });
    mesa.mesa.querySelector('.decal--luz-tv')?.remove();
    placeLights();
    await anim(tela, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(24px)' }], { duration: 380, easing: ENTRA_RAPIDO });
  }

  return { sai };
}
