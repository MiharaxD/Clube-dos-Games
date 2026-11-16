// Quadro livre: cortiça de tamanho fixo (LARG x ALT) que escala pra caber na tela.
// Dois usos:
// - Resenha (encerrada): doc rounds/{id}/board/{uid} com a posição da própria nota (a página
//   da nota de estrelas), os rabiscos e até 3 fotos.
// - Jogando (diário): doc rounds/{id}/diario/{uid}_{página} com notinhas (comentários curtos),
//   rabiscos e até 3 fotos; o play.js troca de página com trocaPagina().
// Todo mundo vê tudo; cada um só mexe no que é seu (as rules garantem). Quem grava é a função
// salvar() que vem de fora: este módulo não fala com o Firestore.
import { icon } from '../lib/icons.js';
import { CAPA_DATA_MAX, esc, fotoParaQuadro, safeImgData, toast } from '../lib/util.js';

export const LARG = 1730;
export const ALT = 1210;
const NOTA_L = 240;
const NOTINHA_L = 280;
export const NOTINHA_MAX = 140; // caracteres (mesmo limite das rules)
export const NOTINHAS_MAX = 6; // por pessoa e por página (mesmo limite das rules)
const ZOOM_MAX = 5;
const ESC_NOTA = 1.25; // mesmo valor do scale de .ql-nota no CSS
const FOLGA = 28; // espaço mínimo entre notas (cobre a inclinação das páginas)
const MAX_TRACOS = 150;
const MAX_PONTOS = 300;
const MAX_FOTOS = 3;
export const CORES = ['#2a1d17', '#b3213f', '#1f6fb2', '#2f8f5b', '#e0a030', '#fbf6e6'];
const CORES_NOME = ['Preto', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Branco'];
const LARGURAS = [3, 6, 12];
// traço gravado como "cor|largura|x,y x,y ..." (só dígitos: seguro pra ir direto no SVG)
const TRACO = /^([0-5])\|(3|6|12)\|(-?\d{1,4},-?\d{1,4}(?: -?\d{1,4},-?\d{1,4})*)$/;
// papel das notinhas (post-its) e inclinação, variando por posição
const PAPEIS = ['#ffd77a', '#9fe0d4', '#ffb3c6', '#d6ef9f', '#fbf6e6'];
const GIROS = ['-3deg', '2deg', '-1.2deg', '3.4deg', '-2.2deg', '1deg'];

const prende = (v, min, max) => Math.min(max, Math.max(min, Math.round(v)));
const posPadrao = (i) => ({ x: 40 + (i % 5) * 335, y: 130 + Math.floor(i / 5) * 340 });
const notinhaOk = (n) => n && typeof n.text === 'string' && n.text.trim() && Number.isInteger(n.x) && Number.isInteger(n.y);

function linhaSvg(traco, dono, i) {
  const m = TRACO.exec(traco);
  if (!m) return '';
  return `<polyline points="${m[3]}" stroke="${CORES[m[1]]}" stroke-width="${m[2]}" data-dono="${esc(dono)}" data-i="${i}"/>`;
}

function fotoHtml(f, dono, i, minha) {
  const src = safeImgData(f.data);
  if (!src) return '';
  return `<div class="ql-foto${minha ? ' ql-foto--minha' : ''}" data-foto="${i}" style="left:${prende(f.x, -100, LARG)}px;top:${prende(f.y, -100, ALT)}px;width:${prende(f.w, 60, 500)}px">
    <span class="tacha" aria-hidden="true"></span>
    <img src="${src}" alt="Foto pregada" draggable="false">
    ${minha ? `<button class="ql-foto__x" type="button" data-tira="${i}" aria-label="Despregar foto">×</button><span class="ql-foto__alca" data-alca="${i}" aria-hidden="true"></span>` : ''}
  </div>`;
}

// opts:
//   uid, board (docs dos outros e o meu, cada um com .id = uid), salvar(estado) => Promise
//   titulo / tituloId: a tira de papel no topo do quadro
//   resenha: pages (já com .id = uid) + pagina(p, i) = html da página (vem do play.js)
//   diário:  notinhas: true + nomeDe(uid) = nome de quem pregou
//   soLeitura: só olhar (zoom continua)
export function montaQuadro(raiz, opts) {
  const { uid, notinhas = false, nomeDe = () => '', soLeitura = false, titulo = 'Resenha', tituloId = 'quadro-titulo' } = opts;
  let { board, salvar, pages = [] } = opts;
  const pagina = opts.pagina;
  let estado;
  // carrega o que é meu do board (descarta o que não passa no formato)
  const carrega = () => {
    const meu = board.find((b) => b.id === uid) ?? {};
    estado = {
      strokes: (meu.strokes ?? []).filter((t) => TRACO.test(t)),
      images: (meu.images ?? []).filter((f) => safeImgData(f.data)),
    };
    if (notinhas) estado.notes = (meu.notes ?? []).filter(notinhaOk).slice(0, NOTINHAS_MAX);
    else estado.note = pages.some((p) => p.id === uid) ? (meu.note ?? null) : null;
  };
  carrega();
  let ferramenta = 'mover';
  let cor = 0;
  let largura = 6;

  // ---------- notas da resenha (uma página por pessoa)
  const notaPos = (p, i) => {
    const n = p.id === uid ? estado.note : board.find((b) => b.id === p.id)?.note;
    const d = posPadrao(i);
    return { x: prende(n?.x ?? d.x, -50, LARG - 60), y: prende(n?.y ?? d.y, -20, ALT - 60) };
  };
  const notasHtml = (lista) => lista.map((p, i) => {
    const { x, y } = notaPos(p, i);
    return pagina(p, i).replace('<li class="pagina" style="', `<li class="pagina ql-nota${p.id === uid ? ' ql-nota--minha' : ''}" data-dono="${esc(p.id)}" style="left:${x}px;top:${y}px;width:${NOTA_L}px;`);
  }).join('');

  // ---------- notinhas do diário (várias por pessoa; as minhas por último, por cima)
  const notinhaHtml = (n, dono, i, k) => {
    const minha = dono === uid;
    return `<li class="ql-notinha${minha && !soLeitura ? ' ql-notinha--minha' : ''}" data-dono="${esc(dono)}" data-n="${i}" style="left:${prende(n.x, -50, LARG - 60)}px;top:${prende(n.y, -20, ALT - 60)}px;width:${NOTINHA_L}px;--r:${GIROS[k % GIROS.length]};--papel:${PAPEIS[k % PAPEIS.length]}">
      <span class="tacha" aria-hidden="true"></span>
      <p class="ql-notinha__txt">${esc(n.text)}</p>
      <span class="ql-notinha__quem">${minha ? 'você' : esc(nomeDe(dono))}</span>
      ${minha && !soLeitura ? `<button class="ql-notinha__x" type="button" data-tira-nota="${i}" aria-label="Despregar notinha">×</button>` : ''}
    </li>`;
  };
  const notinhasHtml = () => {
    let k = 0;
    const outras = board.filter((b) => b.id !== uid).flatMap((b) => (b.notes ?? []).filter(notinhaOk).map((n, i) => notinhaHtml(n, b.id, i, k++)));
    return outras.join('') + estado.notes.map((n, i) => notinhaHtml(n, uid, i, k++)).join('');
  };
  const listaHtml = () => (notinhas ? notinhasHtml() : notasHtml(pages));

  const ferramentas = soLeitura ? '' : `
      <div class="ql-grupo">
        <button class="ql-btn ql-btn--ico" type="button" data-ferr="mover" aria-pressed="true" aria-label="Mover" title="Mover (V)">${icon('move')}</button>
        <button class="ql-btn ql-btn--ico" type="button" data-ferr="caneta" aria-pressed="false" aria-label="Caneta" title="Caneta (B)">${icon('pencil')}</button>
        <button class="ql-btn ql-btn--ico" type="button" data-ferr="borracha" aria-pressed="false" aria-label="Borracha" title="Borracha (E)">${icon('eraser')}</button>
      </div>
      <div class="ql-grupo" aria-label="Cor da caneta">
        ${CORES.map((c, i) => `<button class="ql-cor" type="button" data-cor="${i}" style="--c:${c}" aria-label="${CORES_NOME[i]}" title="${CORES_NOME[i]}" aria-pressed="${i === cor}"></button>`).join('')}
      </div>
      <div class="ql-grupo" aria-label="Espessura">
        ${LARGURAS.map((w) => `<button class="ql-larg" type="button" data-larg="${w}" aria-label="Traço ${w}px" title="Traço ${w}px" aria-pressed="${w === largura}"><i style="--w:${w}px"></i></button>`).join('')}
      </div>
      <div class="ql-grupo">
        <label class="ql-btn ql-btn--ico" title="Pregar foto">${icon('image')}<span class="sr-only">Pregar foto</span><input class="sr-only" type="file" accept="image/*" data-foto-in></label>
        <button class="ql-btn ql-btn--ico" type="button" data-desfaz aria-label="Desfazer" title="Desfazer (Ctrl+Z)">${icon('undo')}</button>
        <button class="ql-btn ql-btn--ico" type="button" data-limpa aria-label="Apagar meus rabiscos" title="Apagar meus rabiscos">${icon('trash')}</button>
      </div>`;

  raiz.innerHTML = `
    <div class="ql-barra papel" role="toolbar" aria-label="Ferramentas do quadro">${ferramentas}
      <div class="ql-grupo" aria-label="Zoom">
        <button class="ql-btn ql-btn--q" type="button" data-zoom="-1" aria-label="Diminuir zoom" title="Diminuir zoom">${icon('zoomOut')}</button>
        <button class="ql-btn" type="button" data-zoom="0" aria-label="Zoom normal" title="Voltar pra 100%"><span data-zoom-txt>100%</span></button>
        <button class="ql-btn ql-btn--q" type="button" data-zoom="1" aria-label="Aumentar zoom" title="Aumentar zoom (Ctrl + roda)">${icon('zoomIn')}</button>
      </div>
    </div>
    <div class="ql-moldura quadro"><div class="ql-janela"><div class="ql-tamanho"></div>
      <div class="ql-palco quadro__cortica" data-ferr="mover" style="width:${LARG}px;height:${ALT}px">
        <h2 class="quadro__titulo ql-titulo" id="${tituloId}" tabindex="-1"><span class="tacha" aria-hidden="true"></span><span class="tacha" aria-hidden="true"></span>${esc(titulo)}</h2>
        <div class="ql-fotos"></div>
        <ul class="ql-notas">${listaHtml()}</ul>
        <svg class="ql-tinta" viewBox="0 0 ${LARG} ${ALT}" width="${LARG}" height="${ALT}" aria-hidden="true"></svg>
      </div>
    </div></div>`;

  const palco = raiz.querySelector('.ql-palco');
  const janela = raiz.querySelector('.ql-janela');
  const svg = raiz.querySelector('.ql-tinta');
  const fotos = raiz.querySelector('.ql-fotos');
  const lista = raiz.querySelector('.ql-notas');
  const tamanho = raiz.querySelector('.ql-tamanho');
  const zoomTxt = raiz.querySelector('[data-zoom-txt]');
  let base = 1; // escala que faz o quadro inteiro caber na largura
  let zoom = 1; // zoom da pessoa por cima disso (1 = quadro inteiro)
  let escala = 1;

  // tamanho fixo + zoom: o palco escala pra largura disponível; com zoom a janela rola
  const aplica = () => {
    escala = base * zoom;
    palco.style.transform = `scale(${escala})`;
    tamanho.style.width = `${LARG * escala}px`;
    tamanho.style.height = `${ALT * escala}px`;
    zoomTxt.textContent = `${Math.round(zoom * 100)}%`;
  };
  const ajusta = () => {
    base = Math.min(1, (janela.clientWidth || LARG) / LARG);
    janela.style.height = `${ALT * base}px`;
    aplica();
  };
  // zoom mantendo parado o ponto (cx, cy) da janela
  const zoomEm = (novo, cx = janela.clientWidth / 2, cy = janela.clientHeight / 2) => {
    novo = Math.min(ZOOM_MAX, Math.max(1, novo));
    const ux = (janela.scrollLeft + cx) / escala;
    const uy = (janela.scrollTop + cy) / escala;
    zoom = novo;
    aplica();
    janela.scrollLeft = ux * escala - cx;
    janela.scrollTop = uy * escala - cy;
  };
  const relJanela = (e) => {
    const r = janela.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  // PC: ctrl + roda (e a pinça do trackpad, que chega como ctrl + roda)
  janela.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    zoomEm(zoom * Math.exp(-e.deltaY * 0.01), ...relJanela(e));
  }, { passive: false });
  // celular: pinça com dois dedos; um dedo no vazio arrasta a vista (ou rola a página)
  let traco = null;
  let arrastando = false;
  const dedos = new Map();
  let pinca = null;
  janela.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    dedos.set(e.pointerId, [e.clientX, e.clientY]);
    if (dedos.size === 2) {
      traco?.el.remove();
      traco = null;
      const [a, b] = [...dedos.values()];
      pinca = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: zoom };
    }
  }, true);
  janela.addEventListener('pointermove', (e) => {
    if (!dedos.has(e.pointerId)) return;
    const antes = dedos.get(e.pointerId);
    dedos.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinca && dedos.size >= 2) {
      const [a, b] = [...dedos.values()];
      const r = janela.getBoundingClientRect();
      zoomEm(pinca.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinca.d, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top);
      e.stopPropagation();
      return;
    }
    if (ferramenta !== 'mover' || arrastando) return;
    const dx = e.clientX - antes[0];
    const dy = e.clientY - antes[1];
    janela.scrollLeft -= dx;
    const top = janela.scrollTop;
    janela.scrollTop -= dy;
    if (janela.scrollTop === top) raiz.closest('.modal')?.scrollBy(0, -dy);
  }, true);
  const tiraDedo = (e) => {
    dedos.delete(e.pointerId);
    if (dedos.size < 2) pinca = null;
  };
  janela.addEventListener('pointerup', tiraDedo, true);
  janela.addEventListener('pointercancel', tiraDedo, true);
  const obs = new ResizeObserver(ajusta);
  obs.observe(janela);
  ajusta();

  const desenhaTinta = () => {
    const outros = board.filter((b) => b.id !== uid).flatMap((b) => (b.strokes ?? []).map((t, i) => linhaSvg(t, b.id, i)));
    svg.innerHTML = outros.join('') + estado.strokes.map((t, i) => linhaSvg(t, uid, i)).join('');
  };
  const desenhaFotos = () => {
    const outras = board.filter((b) => b.id !== uid).flatMap((b) => (b.images ?? []).map((f, i) => fotoHtml(f, b.id, i, false)));
    fotos.innerHTML = outras.join('') + estado.images.map((f, i) => fotoHtml(f, uid, i, !soLeitura)).join('');
  };
  desenhaTinta();
  desenhaFotos();

  // ---------- "física" das notas: ocupam espaço, uma não fica em cima da outra
  const COLADOS = '.ql-nota, .ql-notinha';
  const caixa = (el) => {
    const k = el.classList.contains('ql-nota') ? ESC_NOTA : 1;
    return { x: parseFloat(el.style.left), y: parseFloat(el.style.top), w: el.offsetWidth * k + FOLGA, h: el.offsetHeight * k + FOLGA };
  };
  // empurra (x, y) de el pra fora das outras pelo lado que entrou menos
  const separa = (el, x, y, outras) => {
    const { w, h } = caixa(el);
    for (let volta = 0; volta < 8; volta++) {
      let mexeu = false;
      for (const o of outras) {
        const b = caixa(o);
        const ox = Math.min(x + w, b.x + b.w) - Math.max(x, b.x);
        const oy = Math.min(y + h, b.y + b.h) - Math.max(y, b.y);
        if (ox <= 0 || oy <= 0) continue;
        if (ox < oy) x += x + w / 2 < b.x + b.w / 2 ? -ox : ox;
        else y += y + h / 2 < b.y + b.h / 2 ? -oy : oy;
        x = prende(x, 0, LARG - w);
        y = prende(y, 0, ALT - h);
        mexeu = true;
      }
      if (!mexeu) break;
    }
    return { x, y };
  };
  // ao abrir: cada nota desvia das que vieram antes (só na tela; ninguém grava a nota dos outros)
  const arruma = () => {
    const notas = [...raiz.querySelectorAll(COLADOS)];
    notas.forEach((el, i) => {
      const { x, y } = separa(el, parseFloat(el.style.left), parseFloat(el.style.top), notas.slice(0, i));
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    });
  };
  requestAnimationFrame(arruma);
  const redesenha = () => {
    lista.innerHTML = listaHtml();
    desenhaTinta();
    desenhaFotos();
    arruma();
  };

  // ---------- salvar (debounce; flush ao fechar e ao trocar de página)
  let timer = null;
  let pendente = false;
  const salvaJa = async () => {
    clearTimeout(timer);
    if (!pendente || soLeitura) return;
    pendente = false;
    const fn = salvar; // guarda a página de agora: trocar de página no meio não mistura
    const dados = { ...estado };
    try {
      await fn(dados);
    } catch (err) {
      console.error(err);
      toast('Não deu pra salvar o quadro. Tenta de novo.', 'erro');
    }
  };
  const salva = () => {
    pendente = true;
    clearTimeout(timer);
    timer = setTimeout(salvaJa, 900);
  };

  // ---------- coordenadas do palco
  const ponto = (e) => {
    const r = palco.getBoundingClientRect();
    return { x: (e.clientX - r.left) / escala, y: (e.clientY - r.top) / escala };
  };

  // ---------- barra
  const barra = raiz.querySelector('.ql-barra');
  const marca = (sel, btn) => barra.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  barra.addEventListener('click', (e) => {
    const z = e.target.closest('[data-zoom]');
    if (z) zoomEm(z.dataset.zoom === '0' ? 1 : zoom * (z.dataset.zoom === '1' ? 1.4 : 1 / 1.4));
    if (soLeitura) return;
    const f = e.target.closest('[data-ferr]');
    if (f) {
      ferramenta = f.dataset.ferr;
      palco.dataset.ferr = ferramenta;
      marca('[data-ferr]', f);
    }
    const c = e.target.closest('[data-cor]');
    if (c) {
      cor = Number(c.dataset.cor);
      marca('[data-cor]', c);
      if (ferramenta !== 'caneta') barra.querySelector('[data-ferr="caneta"]').click();
    }
    const l = e.target.closest('[data-larg]');
    if (l) {
      largura = Number(l.dataset.larg);
      marca('[data-larg]', l);
      if (ferramenta !== 'caneta') barra.querySelector('[data-ferr="caneta"]').click();
    }
    if (e.target.closest('[data-desfaz]') && estado.strokes.length) {
      estado.strokes.pop();
      desenhaTinta();
      salva();
    }
    if (e.target.closest('[data-limpa]') && estado.strokes.length) {
      estado.strokes = [];
      desenhaTinta();
      salva();
      toast('Rabiscos apagados.');
    }
  });

  barra.querySelector('[data-foto-in]')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (estado.images.length >= MAX_FOTOS) return toast(`Cada um prega no máximo ${MAX_FOTOS} fotos${notinhas ? ' por página' : ''}. Desprega uma antes.`, 'erro');
    try {
      const data = await fotoParaQuadro(file);
      if (data.length > CAPA_DATA_MAX) throw new Error('grande-demais');
      estado.images.push({ data, x: prende(LARG / 2 - 110 + Math.random() * 120, 0, LARG - 220), y: prende(ALT / 2 - 100 + Math.random() * 80, 0, ALT - 200), w: 220 });
      desenhaFotos();
      salva();
    } catch {
      toast('Essa imagem não rolou. Tenta outra.', 'erro');
    }
  });

  // ---------- caneta e borracha (na camada de tinta, por cima de tudo)
  const apaga = (e) => {
    const alvo = document.elementFromPoint(e.clientX, e.clientY);
    if (alvo?.tagName === 'polyline' && alvo.dataset.dono === uid) {
      estado.strokes.splice(Number(alvo.dataset.i), 1);
      desenhaTinta();
      salva();
    }
  };
  svg.addEventListener('pointerdown', (e) => {
    if (ferramenta === 'borracha') {
      svg.setPointerCapture?.(e.pointerId);
      return apaga(e);
    }
    if (ferramenta !== 'caneta' || pinca) return;
    if (estado.strokes.length >= MAX_TRACOS) return toast('Tua caneta acabou: apaga uns rabiscos pra desenhar mais.', 'erro');
    svg.setPointerCapture(e.pointerId);
    const p = ponto(e);
    traco = { pts: [[Math.round(p.x), Math.round(p.y)]], el: document.createElementNS('http://www.w3.org/2000/svg', 'polyline') };
    traco.el.setAttribute('stroke', CORES[cor]);
    traco.el.setAttribute('stroke-width', largura);
    traco.el.setAttribute('points', traco.pts.join(' '));
    svg.append(traco.el);
  });
  svg.addEventListener('pointermove', (e) => {
    if (ferramenta === 'borracha' && e.buttons) {
      // com captura, elementFromPoint ainda acha a linha embaixo do dedo
      svg.style.pointerEvents = 'none';
      const alvo = document.elementFromPoint(e.clientX, e.clientY);
      svg.style.pointerEvents = '';
      if (alvo?.tagName === 'polyline' && alvo.dataset.dono === uid) {
        estado.strokes.splice(Number(alvo.dataset.i), 1);
        desenhaTinta();
        salva();
      }
      return;
    }
    if (!traco || pinca) return;
    const p = ponto(e);
    const [lx, ly] = traco.pts.at(-1);
    if (Math.hypot(p.x - lx, p.y - ly) < 3 || traco.pts.length >= MAX_PONTOS) return;
    traco.pts.push([Math.round(p.x), Math.round(p.y)]);
    traco.el.setAttribute('points', traco.pts.join(' '));
  });
  const fimTraco = () => {
    if (!traco) return;
    const pts = traco.pts.length === 1 ? [traco.pts[0], [traco.pts[0][0] + 1, traco.pts[0][1]]] : traco.pts;
    estado.strokes.push(`${cor}|${largura}|${pts.map((p) => p.join(',')).join(' ')}`);
    traco = null;
    desenhaTinta();
    salva();
  };
  svg.addEventListener('pointerup', fimTraco);
  svg.addEventListener('pointercancel', fimTraco);

  // ---------- mover a própria nota/notinha/foto e redimensionar foto
  palco.addEventListener('pointerdown', (e) => {
    if (soLeitura || ferramenta !== 'mover' || e.button > 0) return;
    if (e.target.closest('[data-tira], [data-tira-nota]')) return;
    const alca = e.target.closest('[data-alca]');
    const foto = e.target.closest('.ql-foto--minha');
    const nota = e.target.closest('.ql-nota--minha, .ql-notinha--minha');
    const el = foto ?? nota;
    if (!el || e.target.closest('summary, a, button, input, textarea')) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const ini = ponto(e);
    const x0 = parseFloat(el.style.left);
    const y0 = parseFloat(el.style.top);
    const w0 = parseFloat(el.style.width);
    el.classList.add('ql--arrastando');
    arrastando = true;
    const move = (ev) => {
      const p = ponto(ev);
      if (alca) el.style.width = `${prende(w0 + p.x - ini.x, 60, 500)}px`;
      else {
        let x = prende(x0 + p.x - ini.x, -50, LARG - 60);
        let y = prende(y0 + p.y - ini.y, -20, ALT - 60);
        if (nota) ({ x, y } = separa(el, x, y, [...raiz.querySelectorAll(COLADOS)].filter((o) => o !== el)));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }
    };
    const solta = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', solta);
      el.removeEventListener('pointercancel', solta);
      el.classList.remove('ql--arrastando');
      arrastando = false;
      const pos = { x: Math.round(parseFloat(el.style.left)), y: Math.round(parseFloat(el.style.top)) };
      if (foto) Object.assign(estado.images[Number(foto.dataset.foto)], pos, { w: Math.round(parseFloat(el.style.width)) });
      else if (notinhas) Object.assign(estado.notes[Number(el.dataset.n)], pos);
      else estado.note = pos;
      salva();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', solta);
    el.addEventListener('pointercancel', solta);
  });
  palco.addEventListener('click', (e) => {
    if (soLeitura) return;
    const tira = e.target.closest('[data-tira]');
    if (tira) {
      estado.images.splice(Number(tira.dataset.tira), 1);
      desenhaFotos();
      salva();
    }
    const tiraNota = e.target.closest('[data-tira-nota]');
    if (tiraNota) {
      estado.notes.splice(Number(tiraNota.dataset.tiraNota), 1);
      redesenha();
      salva();
    }
  });

  // atalhos de editor de imagem: V mover, B caneta, E borracha, Ctrl+Z desfazer
  const atalhos = (e) => {
    if (soLeitura || !raiz.isConnected || e.target.closest?.('input, textarea, select')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') {
      e.preventDefault();
      barra.querySelector('[data-desfaz]').click();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const ferr = { v: 'mover', b: 'caneta', e: 'borracha' }[k];
    if (ferr) barra.querySelector(`[data-ferr="${ferr}"]`).click();
  };
  document.addEventListener('keydown', atalhos);

  return {
    salvaJa,
    // resenha: nota salva com o quadro aberto; só as páginas são redesenhadas (posições continuam)
    trocaNotas: (novas) => {
      pages = novas;
      lista.innerHTML = notasHtml(novas);
      arruma();
    },
    // diário: prega uma notinha no meio do que está à vista; false se não coube
    pregaNotinha: (texto) => {
      const text = String(texto ?? '').trim().slice(0, NOTINHA_MAX);
      if (!text || soLeitura) return false;
      if (estado.notes.length >= NOTINHAS_MAX) {
        toast(`Cabem ${NOTINHAS_MAX} notinhas tuas por página. Despregue uma ou vira a página.`, 'erro');
        return false;
      }
      const cx = (janela.scrollLeft + janela.clientWidth / 2) / escala - NOTINHA_L / 2;
      const cy = (janela.scrollTop + janela.clientHeight / 2) / escala - 60;
      estado.notes.push({ x: prende(cx + (Math.random() - 0.5) * 80, 0, LARG - NOTINHA_L), y: prende(cy + (Math.random() - 0.5) * 60, 90, ALT - 140), text });
      lista.innerHTML = listaHtml();
      // a nova (última) desvia das outras e grava onde parou
      const els = [...raiz.querySelectorAll(COLADOS)];
      const nova = els.at(-1);
      const { x, y } = separa(nova, parseFloat(nova.style.left), parseFloat(nova.style.top), els.slice(0, -1));
      nova.style.left = `${x}px`;
      nova.style.top = `${y}px`;
      Object.assign(estado.notes.at(-1), { x, y });
      salva();
      return true;
    },
    // diário: troca a página (grava a anterior antes, sem esperar a rede)
    trocaPagina: (novoBoard, novoSalvar) => {
      salvaJa();
      board = novoBoard;
      salvar = novoSalvar;
      carrega();
      redesenha();
    },
    estadoAtual: () => estado,
    moldura: raiz.querySelector('.ql-moldura'),
    fecha: () => {
      obs.disconnect();
      document.removeEventListener('keydown', atalhos);
      return salvaJa();
    },
  };
}
