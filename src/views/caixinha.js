// Caixinha (estojo de plástico) em modal: sai da prateleira num arco, a tampa abre na dobradiça,
// o manual fica no verso da tampa e o CD gira na bandeja. Portado de rodada-votando.html e
// rodada-sugerindo.html. Dois usos: leitura (manual do jogo) e formulário (sugestão).
import { addComment, deleteComment, listComments } from '../api.js';
import { icon } from '../lib/icons.js';
import { DURATION_LABEL, MODE_LABEL, esc, fmtPrice, imgSrc, coverSrc, toast, withBusy, youtubeId } from '../lib/util.js';
import { ENTRA_RAPIDO, NA_TELA, SAI, anim, calma, entrar, espera, rolaNaMao, sumir } from '../lib/motion.js';
import { avatar, coverPalette, memberName } from './parts.js';

const $ = (root, sel) => root.querySelector(sel);
// Abrindo, a tampa passa de 90° em 0,12 + (94/184)·0,88 do giro (4° de antecipação, depois até −180°).
const PASSA_90 = 0.12 + (94 / 184) * 0.88;

// Monta o modal fora do #app (o app fica inert enquanto a caixinha está aberta).
export class Estojo {
  constructor({ form = false, title = '', hint = '', front = '', manual = '', actions = '', coroa = '' } = {}) {
    this.form = form;
    const estojo = `
      <div class="estojo">
        <span class="estojo__sombra"></span>
        <div class="estojo__corpo">
          <div class="estojo__base"><div class="cd" aria-hidden="true"><span class="cd__rotulo"></span><span class="cd__furo"></span></div></div>
          <div class="estojo__tampa">
            <div class="tampa__frente vestida" ${form ? '' : 'aria-hidden="true"'}>${front}</div>
            <div class="tampa__verso" inert>
              <span class="presilha presilha--cima" aria-hidden="true"></span><span class="presilha presilha--baixo" aria-hidden="true"></span>
              <div class="manual" tabindex="0" aria-label="Manual do jogo">${manual}</div>
            </div>
          </div>
          ${coroa ? `<span class="estojo__coroa" aria-hidden="true">${coroa}</span>` : ''}
        </div>
      </div>`;
    const body = form
      ? `<h2 class="modal__titulo" tabindex="-1">${title}</h2><p class="modal__dica">${hint}</p>
         <form class="modal__form" novalidate>${estojo}<p class="modal__erro" role="alert"></p><div class="modal__acoes">${actions}</div></form>`
      : `<h2 class="modal__titulo" tabindex="-1">${title}</h2>
         <div class="leitura"><div class="leitura__caixa">${estojo}</div></div>
         <div class="modal__acoes">${actions}</div>`;

    this.el = document.createElement('div');
    this.el.className = `modal ${form ? 'modal--form' : 'modal--leitura'}`;
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.hidden = true;
    this.el.innerHTML = `<div class="modal__fundo"></div><div class="modal__palco">${body}</div>`;
    document.body.append(this.el);

    const q = (sel) => $(this.el, sel);
    Object.assign(this, {
      fundo: q('.modal__fundo'), estojo: q('.estojo'), corpo: q('.estojo__corpo'), sombra: q('.estojo__sombra'),
      tampa: q('.estojo__tampa'), frente: q('.tampa__frente'), verso: q('.tampa__verso'), manual: q('.manual'),
      cd: q('.cd'), rotulo: q('.cd__rotulo'), titulo: q('.modal__titulo'), dica: q('.modal__dica'),
      acoes: q('.modal__acoes'), erro: q('.modal__erro'), formEl: q('form'),
    });
    const id = `cx-${Math.random().toString(36).slice(2, 8)}`;
    this.titulo.id = id;
    this.el.setAttribute('aria-labelledby', id);
    rolaNaMao(this.manual);
    // Enter/clique durante o voo de entrada (antes do listener da tela) não pode enviar o form nativo
    this.formEl?.addEventListener('submit', (e) => e.preventDefault());
    this.giro = null;
    this.ocupado = false;
  }

  // CD com o nome (e a arte, se tiver) impressos.
  setDisc(name, cover) {
    const img = imgSrc(cover);
    this.rotulo.innerHTML = `<span>${esc(name || 'Seu jogo')}</span>`;
    this.rotulo.classList.toggle('com-img', Boolean(img));
    if (img) this.rotulo.style.setProperty('--rotulo-img', `url("${img.replace(/"/g, '%22')}")`);
    else this.rotulo.style.removeProperty('--rotulo-img');
    this.cd.style.setProperty('--rotulo', coverPalette(name).capa);
  }

  // De onde a caixa sai (ou pra onde volta): o retângulo da capinha na tela.
  deCaixa(el) {
    const s = el.getBoundingClientRect();
    const t = this.estojo.getBoundingClientRect();
    const dx = s.left + s.width / 2 - (t.left + t.width / 2);
    const dy = s.top + s.height / 2 - (t.top + t.height / 2);
    const k = s.height / t.height || 0.3;
    return {
      longe: `translate(${dx}px, ${dy}px) scale(${k}) rotateY(22deg)`,
      // ponto do meio levantado: o voo faz um arco, não uma reta
      meio: `translate(${dx * 0.4}px, ${dy * 0.4 - 56}px) scale(${0.5 + k * 0.5}) rotateY(8deg)`,
    };
  }

  // Quanto o corpo anda quando a tampa abre: no celular centraliza o manual e o CD espia na borda;
  // no PC o formulário centraliza o par e a leitura já pousa na metade direita.
  abertura() {
    const w = this.estojo.offsetWidth;
    if (innerWidth < 760) return w * 0.92;
    return this.form ? w * 0.5 : 0;
  }

  // Abre o modal: a capinha sai do nicho em arco, o fundo escurece.
  async voaDe(fonte, gatilho, extras = []) {
    this.fonte = fonte;
    this.gatilho = gatilho;
    this.el.hidden = false;
    this.el.scrollTop = 0;
    document.getElementById('app').inert = true;
    document.documentElement.classList.add('trava');
    const de = this.deCaixa(fonte);
    fonte.style.visibility = 'hidden';
    await Promise.all([
      anim(this.estojo, [{ transform: de.longe }, { transform: de.meio, offset: 0.55 }, { transform: 'none' }], { duration: 680, easing: SAI }),
      anim(this.sombra, [{ transform: 'scale(0.3)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 680, easing: SAI }),
      anim(this.fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' }),
      entrar([this.titulo, this.dica, this.acoes].filter(Boolean), 240, 60),
      ...extras,
    ]);
  }

  abreTampa() {
    const x = this.abertura();
    const w = this.estojo.offsetWidth;
    this.giraCd();
    this.verso.inert = false;
    return Promise.all([
      // antecipação: a tampa destrava (4deg pra dentro) antes de girar na dobradiça
      anim(this.tampa, [{ transform: 'translateZ(2px) rotateY(0deg)' }, { transform: 'translateZ(2px) rotateY(4deg)', offset: 0.12 }, { transform: 'translateZ(2px) rotateY(-180deg)' }], { duration: 760, easing: NA_TELA }),
      ...this.trocaFaces(true, PASSA_90, 760, NA_TELA),
      anim(this.corpo, [{ transform: 'translateX(0px)' }, { transform: `translateX(${x}px)` }], { duration: 760, easing: NA_TELA }),
      anim(this.sombra, [{ transform: 'none' }, { transform: `translateX(${x - w / 2}px) scaleX(2)` }], { duration: 760, easing: NA_TELA }),
    ]);
  }

  fechaTampa(dur = 520, easing = NA_TELA) {
    const x = this.abertura();
    const w = this.estojo.offsetWidth;
    this.paraCd();
    this.verso.inert = true;
    return Promise.all([
      anim(this.tampa, [{ transform: 'translateZ(2px) rotateY(-180deg)' }, { transform: 'translateZ(2px) rotateY(0deg)' }], { duration: dur, easing }),
      ...this.trocaFaces(false, 0.5, dur, easing),
      anim(this.corpo, [{ transform: `translateX(${x}px)` }, { transform: 'translateX(0px)' }], { duration: dur, easing }),
      anim(this.sombra, [{ transform: `translateX(${x - w / 2}px) scaleX(2)` }, { transform: 'none' }], { duration: dur, easing }),
    ]);
  }


  // Só a face voltada pra gente aparece. O backface-visibility sozinho falha no WebKit (iPhone): filhos
  // com transform (carimbo, etiqueta, manual inclinado) vazam espelhados, e a capa aparecia "por trás" do manual.
  // Então a visibilidade troca por animação, na mesma duração/easing da tampa, no instante em que ela passa de 90°.
  // `abrindo`: a frente some e o verso aparece; `quando` = ponto (0–1) do giro em que a tampa fica de lado.
  trocaFaces(abrindo, quando, duration, easing) {
    const antes = quando - 0.0001;
    const troca = (el, sumindo) => {
      const [de, pra] = sumindo ? ['visible', 'hidden'] : ['hidden', 'visible'];
      return anim(el, [{ visibility: de, offset: 0 }, { visibility: de, offset: antes }, { visibility: pra, offset: quando }, { visibility: pra, offset: 1 }], { duration, easing });
    };
    return [troca(this.frente, abrindo), troca(this.verso, !abrindo)];
  }

  // O CD arranca girando e segue rodando devagar enquanto a caixinha está aberta.
  giraCd() {
    if (calma.matches) return;
    this.cd.getAnimations().forEach((a) => a.cancel());
    this.giro = this.cd.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1400, delay: 200, easing: 'cubic-bezier(0.1, 0.6, 0.2, 1)' });
    this.giro.finished
      .then(() => {
        this.giro = this.cd.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 9000, iterations: Infinity });
      })
      .catch(() => {});
  }

  // Ao fechar, o disco desacelera até parar.
  paraCd() {
    if (!this.giro) return;
    const atual = getComputedStyle(this.cd).transform;
    this.giro.cancel();
    this.giro = null;
    if (calma.matches || atual === 'none') return;
    const m = atual.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number) ?? [1, 0];
    const ang = (Math.atan2(m[1], m[0]) * 180) / Math.PI;
    this.cd.animate([{ transform: `rotate(${ang}deg)` }, { transform: `rotate(${ang + 40}deg)` }], { duration: 500, easing: SAI, fill: 'forwards' });
  }

  // Volta pro nicho e desmonta o modal.
  async voaDeVolta(dur = 540, extras = []) {
    const para = this.deCaixa(this.fonte);
    await Promise.all([
      anim(this.estojo, [{ transform: 'none' }, { transform: para.meio, offset: 0.45 }, { transform: para.longe }], { duration: dur, easing: 'cubic-bezier(0.45, 0, 0.2, 1)' }),
      anim(this.sombra, [{ transform: 'none', opacity: 1 }, { transform: 'scale(0.3)', opacity: 0 }], { duration: dur, easing: 'ease-in' }),
      anim(this.fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 340, delay: Math.max(0, dur - 340), easing: 'ease-in' }),
      sumir([this.titulo, this.dica, this.acoes, this.erro].filter(Boolean), 160),
      ...extras,
    ]);
    this.destroy();
  }

  destroy() {
    if (this.fonte) this.fonte.style.visibility = '';
    this.el.remove();
    const app = document.getElementById('app');
    if (app) app.inert = false;
    document.documentElement.classList.remove('trava');
    if (this.gatilho?.isConnected) this.gatilho.focus({ preventScroll: true });
  }

  // Tremidinha de "não deu" (validação).
  tremer() {
    return anim(this.estojo, [0, -12, 10, -6, 3, 0].map((x) => ({ transform: `translateX(${x}px)` })), { duration: 360, easing: 'ease-in-out' });
  }
}

// ------------------------------------------------------------ manual de leitura

// Ficha técnica do jogo no papel do manual (só campos que existem no modelo).
export function readingManual(game, members, uid) {
  const by = game.suggestedBy === uid ? 'sugestão sua' : `sugestão de ${esc(memberName(members, game.suggestedBy))}`;
  const facts = [
    ['Ano', game.year], ['Gênero', game.genre], ['Tempo pra zerar', DURATION_LABEL[game.duration]],
    ['Modo', MODE_LABEL[game.mode]], ['Preço', Number.isInteger(game.price) ? fmtPrice(game.price) : ''],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  return `
    <p class="manual__cabeca" aria-hidden="true"><span>Manual de instruções</span><span class="manual__pag">pág. 1</span></p>
    <p class="manual__jogo">${esc(game.name)}</p>
    <p class="manual__por">${by}</p>
    ${game.pitch ? `<h3 class="manual__sec">Por que jogar</h3><p class="manual__pitch">“${esc(game.pitch)}”</p>` : ''}
    ${facts.length ? `<dl class="manual__fatos">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    ${game.platforms?.length ? `<h3 class="manual__sec">Plataformas</h3><ul class="manual__plats">${game.platforms.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}`;
}

// Abre a caixinha em modo leitura a partir da capinha (fonte) e devolve quando fechar.
// front = HTML da frente (cópia da capa); extraActions = botões além de "Fechar a caixinha".
// votar = { voted(), toggle() } (só na votação): botão de votar dentro da caixinha, pra quem leu o manual
// não precisar fechar e procurar o ticket na prateleira. toggle() devolve se ficou votado.
const botaoVotar = (votado) => (votado
  ? `<button class="btn" type="button" data-votar>${icon('check')} Votado · desfazer</button>`
  : '<button class="btn btn--primary" type="button" data-votar>Votar nesse</button>');

// recados = { roundId, isAdmin } (sugerindo/votando): mural de recados do jogo embaixo da caixinha.
export async function openReading({ game, members, uid, fonte, gatilho, front, coroa = '', extraActions = '', votar = null, recados = null }) {
  const cx = new Estojo({
    title: esc(game.name),
    front,
    coroa,
    manual: readingManual(game, members, uid),
    actions: `${votar ? botaoVotar(votar.voted()) : ''}${extraActions}<button class="btn" type="button" data-fechar>Fechar a caixinha</button>`,
  });
  cx.setDisc(game.name, coverSrc(game));
  cx.verso.inert = true;
  const trailer = montaTrailer(cx, game);
  if (recados) montaRecados(cx, game, members, uid, recados);
  const pecas = [...cx.manual.children];
  pecas.forEach((el) => (el.style.opacity = '0'));
  if (trailer) trailer.style.opacity = '0';
  cx.ocupado = true;
  await cx.voaDe(fonte, gatilho);
  await espera(140);
  await Promise.all([cx.abreTampa(), entrar(pecas, 460, 35), trailer ? entrar([trailer], 560) : null]);
  cx.ocupado = false;
  cx.titulo.focus({ preventScroll: true });

  const fecha = async () => {
    if (cx.ocupado) return;
    cx.ocupado = true;
    await Promise.all([cx.fechaTampa(), trailer ? sumir([trailer], 200) : null]);
    await cx.voaDeVolta();
  };
  cx.el.addEventListener('click', (e) => {
    // link pra outra tela: desmonta na hora (a rota redesenha o app)
    if (e.target.closest('a[href]')) {
      cx.gatilho = null;
      cx.destroy();
      return;
    }
    const botao = e.target.closest('[data-votar]');
    if (botao) {
      if (cx.ocupado || botao.disabled) return;
      botao.disabled = true;
      votar.toggle(cx.acoes).then((votado) => {
        // refaz o botão com o estado novo e devolve o foco a ele
        botao.outerHTML = botaoVotar(votado ?? votar.voted());
        cx.acoes.querySelector('[data-votar]')?.focus();
      });
      return;
    }
    if (e.target.closest('[data-fechar]')) fecha();
    else if (e.target.matches('.modal, .modal__fundo, .modal__palco, .leitura, .leitura__caixa')) fecha();
  });
  cx.el.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
  return cx;
}

// ------------------------------------------------------------ trailer

// Trailer do YouTube do lado da caixinha (embaixo no celular). Só o ID validado vai pra URL do embed;
// youtube-nocookie não grava cookie até a pessoa dar play.
function montaTrailer(cx, game) {
  const id = youtubeId(game.trailer);
  if (!id) return null;
  cx.el.querySelector('.leitura').insertAdjacentHTML('beforeend', `
    <figure class="trailer">
      <div class="trailer__tela"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="Trailer de ${esc(game.name)}"
        loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <figcaption class="trailer__legenda">Trailer</figcaption>
    </figure>`);
  return cx.el.querySelector('.trailer');
}

// ------------------------------------------------------------ mural de recados

const RECADO_MAX = 300;

// Cada recado é um post-it: a cor e a inclinação vêm da posição, pra não ficarem todos iguais.
const POSTIT_COR = ['#ffe98a', '#ffc2d4', '#b8ecdf', '#ffd59e', '#d9ccff'];
const POSTIT_GIRO = ['-2deg', '1.6deg', '-0.8deg', '2.2deg', '-1.4deg'];

// aoVer(itens) (opcional): chamado com os recados que a pessoa acabou de ver (marca o balão como lido).
function montaRecados(cx, game, members, uid, { roundId, isAdmin, aoVer }) {
  cx.el.querySelector('.modal__palco').insertAdjacentHTML('beforeend', `
    <section class="papel recados" aria-label="Recados sobre ${esc(game.name)}">
      <h3 class="recados__titulo">Recados</h3>
      <ul class="recados__lista" aria-live="polite"><li class="recados__vazio">Carregando…</li></ul>
      <form class="recados__form">
        <label class="sr-only" for="recado-${esc(game.id)}">Seu recado</label>
        <textarea class="input" id="recado-${esc(game.id)}" name="text" maxlength="${RECADO_MAX}" rows="2" placeholder="Fala aí o que achou dessa sugestão…" required></textarea>
        <div class="actions"><button class="btn btn--primary" type="submit">Deixar recado</button></div>
      </form>
    </section>`);
  const sec = cx.el.querySelector('.recados');
  const lista = sec.querySelector('.recados__lista');
  const form = sec.querySelector('form');

  const desenha = (itens) => {
    lista.innerHTML = itens.length
      ? itens.map((c, i) => `<li class="recados__item" style="--postit: ${POSTIT_COR[i % POSTIT_COR.length]}; --giro: ${POSTIT_GIRO[i % POSTIT_GIRO.length]}">
          <p class="recados__txt">${esc(c.text)}</p>
          <p class="recados__quem">${avatar(members.find((m) => m.id === c.createdBy), 'sm')}<span>${c.createdBy === uid ? 'Você' : esc(memberName(members, c.createdBy))}</span></p>
          ${c.createdBy === uid || isAdmin || game.id === uid
            ? `<button class="recados__x" type="button" data-apagar="${esc(c.id)}" aria-label="Apagar recado">×</button>` : ''}
        </li>`).join('')
      : '<li class="recados__vazio">Ninguém falou nada ainda. Começa aí.</li>';
    aoVer?.(itens);
  };
  const carrega = () => listComments(roundId, game.id).then(desenha).catch(() => {
    lista.innerHTML = '<li class="recados__vazio">Não deu pra carregar os recados.</li>';
  });
  carrega();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = form.text.value.trim().slice(0, RECADO_MAX);
    if (!text) return;
    const ok = await withBusy(form.querySelector('[type=submit]'), () => addComment(roundId, game.id, uid, text).then(() => true));
    if (ok) {
      form.reset();
      await carrega();
    }
  });
  lista.addEventListener('click', async (e) => {
    const botao = e.target.closest('[data-apagar]');
    if (!botao) return;
    const ok = await withBusy(botao, () => deleteComment(roundId, game.id, botao.dataset.apagar).then(() => true));
    if (ok) {
      toast('Recado apagado.');
      await carrega();
    }
  });
}

export { ENTRA_RAPIDO };
