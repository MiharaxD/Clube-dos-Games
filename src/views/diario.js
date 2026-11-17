// Quadro de jogando aberto: o quadro da mesa vem pra frente (voo 2D, igual ao da resenha).
// Começa com 3 páginas; o admin pode acrescentar mais (até MAX_PAGINAS, ver firestore.rules).
// As setinhas giram o quadro (meia volta) e ele volta mostrando a outra página.
// Aqui não tem nota de estrelas: só notinhas curtas, rabiscos e fotos (o quadro livre de quadro.js).
// Não fala com o Firestore: quem grava é salvar(página, estado) e adicionaPagina(), que vêm de
// fora (play.js ou a página de teste).
import { icon } from '../lib/icons.js';
import { ENTRA_RAPIDO, NA_TELA, SAI, anim, calma, entrar } from '../lib/motion.js';
import { NOTINHA_MAX, montaQuadro } from './quadro.js';

export const PAGINAS_INICIAIS = 3;
const MAX_PAGINAS = 9;
// setinha de pixel (mesma família dos ícones de icons.js); a da esquerda é espelhada no CSS
const SETA = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h7V2h2v2h2v2h2v4h-2v2h-2v2H9v-4H2z"/></svg>';

// opts: { gatilho, objeto (o .obj da mesa), face() (a face do quadro na mesa), docs (listDiario),
//         uid, nomeDe(uid), soLeitura, salvar(pagina, estado) => Promise, aoFechar(mexeu),
//         totalPaginas (round.diarioPaginas), isAdmin, adicionaPagina(totalAtual) => Promise }
export function abreDiario({
  gatilho, objeto, face, docs, uid, nomeDe, soLeitura = false, salvar, aoFechar,
  totalPaginas = PAGINAS_INICIAIS, isAdmin = false, adicionaPagina,
}) {
  // total de páginas muda ao vivo se o admin clicar em "+"; as setinhas usam essa variável
  let total = totalPaginas;
  // cópia local de cada página (id = uid de quem pregou); o que eu mexo fica aqui ao virar
  const paginas = Array.from({ length: total }, (_, p) => docs.filter((d) => d.pagina === p).map((d) => ({ ...d, id: d.uid })));
  let pag = 0;
  let mexeu = false;
  const salvarDa = (p) => (estado) => {
    mexeu = true;
    return salvar(p, estado);
  };

  const modal = document.createElement('div');
  modal.className = 'modal modal--quadro';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'diario-titulo');
  const form = soLeitura ? '' : `
    <ul class="ql-form ql-form--notinha"><li class="pagina pagina--nova papel">
      <form data-notinha-form novalidate>
        <label class="pagina__rotulo" for="notinha-txt">Notinha</label>
        <textarea class="campo-papel" id="notinha-txt" name="text" rows="3" maxlength="${NOTINHA_MAX}" placeholder="Ex.: o peixe me pegou de novo" aria-describedby="notinha-conta"></textarea>
        <span class="pagina__conta" id="notinha-conta">0/${NOTINHA_MAX}</span>
        <button class="btn btn--primary" type="submit">Pregar notinha</button>
      </form>
    </li></ul>`;
  modal.innerHTML = `<div class="modal__fundo"></div>
    <div class="quadro-palco quadro-palco--livre diario${soLeitura ? ' diario--leitura' : ''}">
      <div class="ql"></div>
      ${form}
      <div class="diario__folhas">
        <button class="diario__seta diario__seta--volta" type="button" data-vira="-1" aria-label="Página anterior">${SETA}<span>Volta</span></button>
        <p class="diario__pag" aria-live="polite">Página 1 de ${total}</p>
        <button class="diario__seta" type="button" data-vira="1" aria-label="Próxima página"><span>Vira</span>${SETA}</button>
        ${isAdmin ? `<button class="diario__btn diario__btn--add" type="button" data-add-pagina ${total >= MAX_PAGINAS ? 'disabled' : ''} aria-label="Acrescentar página ao quadro" title="Acrescentar página">${icon('plus')}</button>` : ''}
      </div>
      ${soLeitura ? '<p class="diario__aviso">A rodada fechou: o quadro de jogando ficou guardado só pra ver.</p>' : ''}
      <div class="modal__acoes"><button class="btn" type="button" data-fechar>Fechar o quadro</button></div>
    </div>`;
  const livre = montaQuadro(modal.querySelector('.ql'), {
    uid, board: paginas[0], salvar: salvarDa(0), notinhas: true, nomeDe, soLeitura, titulo: 'Jogando', tituloId: 'diario-titulo',
  });
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const quadro = livre.moldura;
  const pagTxt = modal.querySelector('.diario__pag');
  const deQuadro = () => {
    const a = face().getBoundingClientRect();
    const b = quadro.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };

  // ---------- entrada: o quadro sai da mesa e vem pra frente
  const app = document.getElementById('app');
  if (app) app.inert = true;
  document.documentElement.classList.add('trava');
  const entra = async () => {
    const longe = deQuadro();
    objeto.style.visibility = 'hidden';
    anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
    const resto = [...modal.querySelectorAll('.ql-barra, .ql-form, .diario__folhas, .diario__aviso, .modal__acoes')];
    resto.forEach((el) => (el.style.opacity = calma.matches ? '' : '0'));
    await anim(quadro, [{ transform: longe }, { transform: 'none' }], { duration: 600, easing: NA_TELA });
    entrar(resto, 0, 50);
    modal.querySelector('#diario-titulo').focus({ preventScroll: true });
  };
  entra();

  // ---------- virar a página: o quadro gira até ficar de lado, troca, e termina o giro
  let virando = false;
  const vira = async (dir) => {
    if (virando) return;
    virando = true;
    // guarda o que é meu nesta página antes de sair dela
    paginas[pag] = [...paginas[pag].filter((d) => d.id !== uid), { id: uid, ...livre.estadoAtual() }];
    const giro = (g) => `perspective(1800px) rotateY(${g}deg)`;
    await anim(quadro, [{ transform: giro(0) }, { transform: giro(-90 * dir) }], { duration: 260, easing: ENTRA_RAPIDO });
    pag = (pag + dir + total) % total;
    livre.trocaPagina(paginas[pag], salvarDa(pag));
    pagTxt.textContent = `Página ${pag + 1} de ${total}`;
    await anim(quadro, [{ transform: giro(90 * dir) }, { transform: giro(0) }], { duration: 340, easing: SAI });
    quadro.style.transform = '';
    virando = false;
  };

  // ---------- admin: acrescenta mais 1 página em branco ao fim do quadro
  const addBtn = modal.querySelector('[data-add-pagina]');
  let addando = false;
  const addPagina = async () => {
    if (addando || total >= MAX_PAGINAS) return;
    addando = true;
    addBtn.disabled = true;
    try {
      await adicionaPagina(total);
      total += 1;
      paginas.push([]);
      pagTxt.textContent = `Página ${pag + 1} de ${total}`;
    } finally {
      addando = false;
      addBtn.disabled = total >= MAX_PAGINAS;
    }
  };

  // ---------- notinha nova
  const notinhaForm = modal.querySelector('[data-notinha-form]');
  if (notinhaForm) {
    const txt = notinhaForm.elements.text;
    const conta = modal.querySelector('#notinha-conta');
    txt.addEventListener('input', () => (conta.textContent = `${txt.value.length}/${NOTINHA_MAX}`));
    notinhaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!txt.value.trim()) {
        txt.focus();
        return;
      }
      if (livre.pregaNotinha(txt.value)) {
        txt.value = '';
        conta.textContent = `0/${NOTINHA_MAX}`;
      }
    });
  }

  // ---------- fechar: grava o pendente e o quadro volta pro lugar na mesa
  let fechando = false;
  const fecha = async () => {
    if (fechando) return;
    fechando = true;
    const gravando = livre.fecha();
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
    await anim(quadro, [{ transform: 'none' }, { transform: deQuadro() }], { duration: 460, easing: NA_TELA });
    objeto.style.visibility = '';
    modal.remove();
    if (app) app.inert = false;
    document.documentElement.classList.remove('trava');
    await gravando;
    if (gatilho.isConnected) gatilho.focus({ preventScroll: true });
    aoFechar?.(mexeu);
  };
  modal.addEventListener('click', (e) => {
    const seta = e.target.closest('[data-vira]');
    if (seta) vira(Number(seta.dataset.vira));
    if (e.target.closest('[data-add-pagina]')) addPagina();
    if (e.target.closest('[data-fechar]') || e.target === fundo || e.target === modal) fecha();
  });
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
  return { fecha, vira };
}
