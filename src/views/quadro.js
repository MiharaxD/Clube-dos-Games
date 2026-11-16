// Quadro livre da encerrada: cortiça de tamanho fixo (LARG x ALT) que escala pra caber na tela.
// Cada pessoa tem um doc em rounds/{id}/board/{uid} com a posição da própria nota, os rabiscos
// e até 3 fotos. Todo mundo vê tudo; cada um só mexe no que é seu (as rules garantem).
import { saveBoard } from '../api.js';
import { icon } from '../lib/icons.js';
import { CAPA_DATA_MAX, esc, fotoParaQuadro, safeImgData, toast } from '../lib/util.js';

export const LARG = 1730;
export const ALT = 1210;
const NOTA_L = 170;
const ZOOM_MAX = 5;
const MAX_TRACOS = 150;
const MAX_PONTOS = 300;
const MAX_FOTOS = 3;
export const CORES = ['#2a1d17', '#b3213f', '#1f6fb2', '#2f8f5b', '#e0a030', '#fbf6e6'];
const CORES_NOME = ['Preto', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Branco'];
const LARGURAS = [3, 6, 12];
// traço gravado como "cor|largura|x,y x,y ..." (só dígitos: seguro pra ir direto no SVG)
const TRACO = /^([0-5])\|(3|6|12)\|(-?\d{1,4},-?\d{1,4}(?: -?\d{1,4},-?\d{1,4})*)$/;

const prende = (v, min, max) => Math.min(max, Math.max(min, Math.round(v)));
const posPadrao = (i) => ({ x: 30 + (i % 5) * 192, y: 100 + Math.floor(i / 5) * 200 });

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

// pages = páginas das notas (já com .id = uid); pagina(p, i) = html da página (vem do play.js)
export function montaQuadro(raiz, { roundId, uid, pages, board, pagina }) {
  const meu = board.find((b) => b.id === uid) ?? {};
  const estado = {
    note: meu.note ?? null,
    strokes: (meu.strokes ?? []).filter((t) => TRACO.test(t)),
    images: (meu.images ?? []).filter((f) => safeImgData(f.data)),
  };
  const temNota = pages.some((p) => p.id === uid);
  let ferramenta = 'mover';
  let cor = 0;
  let largura = 6;

  const notaPos = (p, i) => {
    const n = p.id === uid ? estado.note : board.find((b) => b.id === p.id)?.note;
    const d = posPadrao(i);
    return { x: prende(n?.x ?? d.x, -50, LARG - 60), y: prende(n?.y ?? d.y, -20, ALT - 60) };
  };

  const notasHtml = (lista) => lista.map((p, i) => {
    const { x, y } = notaPos(p, i);
    return pagina(p, i).replace('<li class="pagina" style="', `<li class="pagina ql-nota${p.id === uid ? ' ql-nota--minha' : ''}" data-dono="${esc(p.id)}" style="left:${x}px;top:${y}px;width:${NOTA_L}px;`);
  }).join('');

  raiz.innerHTML = `
    <div class="ql-barra papel" role="toolbar" aria-label="Ferramentas do quadro">
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
      </div>
      <div class="ql-grupo" aria-label="Zoom">
        <button class="ql-btn ql-btn--q" type="button" data-zoom="-1" aria-label="Diminuir zoom" title="Diminuir zoom">${icon('zoomOut')}</button>
        <button class="ql-btn" type="button" data-zoom="0" aria-label="Zoom normal" title="Voltar pra 100%"><span data-zoom-txt>100%</span></button>
        <button class="ql-btn ql-btn--q" type="button" data-zoom="1" aria-label="Aumentar zoom" title="Aumentar zoom (Ctrl + roda)">${icon('zoomIn')}</button>
      </div>
    </div>
    <div class="ql-moldura quadro"><div class="ql-janela"><div class="ql-tamanho"></div>
      <div class="ql-palco quadro__cortica" data-ferr="mover" style="width:${LARG}px;height:${ALT}px">
        <h2 class="quadro__titulo ql-titulo" id="quadro-titulo" tabindex="-1"><span class="tacha" aria-hidden="true"></span><span class="tacha" aria-hidden="true"></span>Resenha</h2>
        <div class="ql-fotos"></div>
        <ul class="ql-notas">${notasHtml(pages)}</ul>
        <svg class="ql-tinta" viewBox="0 0 ${LARG} ${ALT}" width="${LARG}" height="${ALT}" aria-hidden="true"></svg>
      </div>
    </div></div>`;

  const palco = raiz.querySelector('.ql-palco');
  const janela = raiz.querySelector('.ql-janela');
  const svg = raiz.querySelector('.ql-tinta');
  const fotos = raiz.querySelector('.ql-fotos');
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
    fotos.innerHTML = outras.join('') + estado.images.map((f, i) => fotoHtml(f, uid, i, true)).join('');
  };
  desenhaTinta();
  desenhaFotos();

  // ---------- salvar (debounce; flush ao fechar)
  let timer = null;
  let pendente = false;
  const salvaJa = async () => {
    clearTimeout(timer);
    if (!pendente) return;
    pendente = false;
    try {
      await saveBoard(roundId, uid, estado);
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
    const z = e.target.closest('[data-zoom]');
    if (z) zoomEm(z.dataset.zoom === '0' ? 1 : zoom * (z.dataset.zoom === '1' ? 1.4 : 1 / 1.4));
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

  barra.querySelector('[data-foto-in]').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (estado.images.length >= MAX_FOTOS) return toast(`Cada um prega no máximo ${MAX_FOTOS} fotos. Desprega uma antes.`, 'erro');
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

  // ---------- mover a própria nota/foto e redimensionar foto
  palco.addEventListener('pointerdown', (e) => {
    if (ferramenta !== 'mover' || e.button > 0) return;
    if (e.target.closest('[data-tira]')) return;
    const alca = e.target.closest('[data-alca]');
    const foto = e.target.closest('.ql-foto--minha');
    const nota = e.target.closest('.ql-nota--minha');
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
        el.style.left = `${prende(x0 + p.x - ini.x, -50, LARG - 60)}px`;
        el.style.top = `${prende(y0 + p.y - ini.y, -20, ALT - 60)}px`;
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
      else estado.note = pos;
      salva();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', solta);
    el.addEventListener('pointercancel', solta);
  });
  palco.addEventListener('click', (e) => {
    const tira = e.target.closest('[data-tira]');
    if (!tira) return;
    estado.images.splice(Number(tira.dataset.tira), 1);
    desenhaFotos();
    salva();
  });

  // atalhos de editor de imagem: V mover, B caneta, E borracha, Ctrl+Z desfazer
  const atalhos = (e) => {
    if (!raiz.isConnected || e.target.closest?.('input, textarea, select')) return;
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

  if (!temNota) estado.note = null;
  // nota salva com o quadro aberto: só as páginas são redesenhadas (posições continuam)
  const trocaNotas = (novas) => {
    raiz.querySelector('.ql-notas').innerHTML = notasHtml(novas);
  };
  return { salvaJa, trocaNotas, fecha: () => { obs.disconnect(); document.removeEventListener('keydown', atalhos); return salvaJa(); } };
}
