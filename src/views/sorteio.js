// Fechar a votação em tela cheia: o vencedor em evidência (ou o empate, a TV, a roleta e a explosão)
// e a capa voando até a capinha da mesa. Roda só no navegador do admin; os outros veem o resultado
// ao abrir a rodada. O sorteio e a gravação acontecem ANTES: a animação só encena o que já está salvo.
// Overlay fora do #app (que fica inert), como as caixinhas. NÃO usa a classe .modal porque o
// ctx.refresh() (o próprio roteador) apaga os modais, e o overlay precisa sobreviver ao refresh.
import { ENTRA_RAPIDO, NA_TELA, SAI, anim, calma, elastico, entrar, espera, sumir } from '../lib/motion.js';
import { chiar, somDeChiado } from '../lib/rickroll.js';
import { festa } from '../lib/festa.js';
import { icon } from '../lib/icons.js';
import { drawIndex } from '../lib/tally.js';
import { esc, toast } from '../lib/util.js';
import { cover, stamp, tv } from './parts.js';
import { giraRoda, rodaHtml } from './roulette.js';

const plural = (n) => `${n} ${n === 1 ? 'voto' : 'votos'}`;
const rnd = (a, b) => a + Math.random() * (b - a);
const centro = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
const doisQuadros = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

// Mudou de rota no meio: a sequência para onde estiver (sem erro na tela).
class Abortou extends Error {}

class Palco {
  constructor() {
    const id = `sorteio-${Math.random().toString(36).slice(2, 8)}`;
    this.el = document.createElement('div');
    this.el.className = 'sorteio';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-labelledby', id);
    this.el.innerHTML = `
      <div class="sorteio__fundo"></div>
      <div class="sorteio__raios" aria-hidden="true"></div>
      <div class="sorteio__palco">
        <h2 class="sorteio__titulo" id="${id}" tabindex="-1"></h2>
        <p class="sorteio__dica"></p>
        <div class="sorteio__capas"></div>
        <p class="sorteio__erro" hidden></p>
        <div class="sorteio__acoes"></div>
      </div>
      <canvas class="sorteio__festa" aria-hidden="true"></canvas>
      <p class="sr-only" aria-live="polite"></p>`;
    document.body.append(this.el);
    const q = (s) => this.el.querySelector(s);
    Object.assign(this, {
      fundo: q('.sorteio__fundo'), raios: q('.sorteio__raios'), palco: q('.sorteio__palco'), titulo: q('.sorteio__titulo'),
      dica: q('.sorteio__dica'), capas: q('.sorteio__capas'), erro: q('.sorteio__erro'), acoes: q('.sorteio__acoes'),
      voz: q('[aria-live]'),
    });
    this.vivo = true;
    this.limpa = [];
    this.abortou = new Promise((_, rej) => (this.rejeita = rej));
    this.abortou.catch(() => {});
    this.confete = calma.matches ? null : festa(q('.sorteio__festa'));
    if (this.confete) this.limpa.push(() => this.confete.para());
    const sair = () => this.fecha();
    window.addEventListener('hashchange', sair);
    this.limpa.push(() => window.removeEventListener('hashchange', sair));
    this.trava();
  }

  // #app inert + rolagem travada (o roteador desfaz as duas no refresh: refaz depois dele)
  trava() {
    const app = document.getElementById('app');
    if (app) app.inert = true;
    document.documentElement.classList.add('trava', 'sorteando');
  }

  // espera algo, mas desiste se o overlay foi fechado no meio
  async f(promessa) {
    const r = await Promise.race([promessa, this.abortou]);
    if (!this.vivo) throw new Abortou();
    return r;
  }
  espera(ms) { return this.f(espera(ms)); }

  fala(texto) {
    this.voz.textContent = '';
    setTimeout(() => (this.voz.textContent = texto), 50);
  }

  mostraErro(texto) {
    this.erro.textContent = texto;
    this.erro.hidden = !texto;
  }

  // botões [data-acao]; resolve com a ação clicada (Esc vale "cancelar" só se `esc` = true)
  escolha({ esc: podeEsc = false } = {}) {
    return this.f(new Promise((res) => {
      const clique = (e) => {
        const b = e.target.closest('[data-acao]');
        if (b && !b.disabled) fim(b.dataset.acao);
      };
      const tecla = (e) => {
        if (podeEsc && e.key === 'Escape') {
          e.preventDefault();
          fim('cancelar');
        }
      };
      const fim = (acao) => {
        this.el.removeEventListener('click', clique);
        this.el.removeEventListener('keydown', tecla);
        res(acao);
      };
      this.el.addEventListener('click', clique);
      this.el.addEventListener('keydown', tecla);
    }));
  }

  // refresh atrás do overlay: a página vira "jogando" e o overlay continua por cima
  async atualiza(ctx) {
    await this.f(ctx.refresh());
    this.trava();
  }

  fecha() {
    if (!this.vivo) return;
    this.vivo = false;
    this.rejeita(new Abortou());
    this.limpa.forEach((fn) => fn());
    this.el.remove();
    const app = document.getElementById('app');
    if (app) app.inert = false;
    document.documentElement.classList.remove('trava', 'sorteando');
  }

  // tela final: capa grande com carimbo, nome, votos e (se tiver) o botão
  telaFinal(game, carimbo, linha) {
    this.el.classList.add('sorteio--final');
    this.titulo.textContent = game.name;
    this.dica.textContent = linha;
    this.capas.innerHTML = `<div class="sorteio__heroi">${cover(game)}</div>`;
    this.capas.style.removeProperty('transform');
    this.capas.style.removeProperty('visibility');
    // o carimbo vai no embrulho (a .cover corta o que passa da borda)
    this.heroi = this.capas.querySelector('.sorteio__heroi');
    this.carimbo = carimbo;
  }

  bateCarimbo() {
    this.heroi.insertAdjacentHTML('beforeend', stamp(this.carimbo, { hit: !calma.matches }));
  }

  estoura(el, n) {
    if (!this.confete || !el) return;
    const c = centro(el.getBoundingClientRect());
    this.confete.estoura(c.x, c.y, n);
  }

  // A capa voa até a capinha de verdade da mesa (#caso-obj) e o overlay some.
  async pousa() {
    const alvo = document.querySelector('#app [data-obj="caso-obj"]');
    alvo?.scrollIntoView({ block: 'center' });
    await this.f(doisQuadros());
    const obj = document.getElementById('caso-obj');
    const face = obj?.querySelector('.m-estojo > .f');
    const resto = [this.titulo, this.dica, this.acoes, this.erro, this.raios, this.el.querySelector('.sorteio__tv')].filter(Boolean);
    if (!face || calma.matches) {
      await this.f(Promise.all([sumir(resto), anim(this.heroi, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 })]));
    } else {
      obj.style.visibility = 'hidden';
      this.limpa.push(() => (obj.style.visibility = ''));
      const de = this.heroi.getBoundingClientRect();
      const para = face.getBoundingClientRect();
      const a = centro(de);
      const b = centro(para);
      // a face projetada é um trapézio: a escala usa a área, pra capa "caber" nela
      const k = Math.sqrt((para.width * para.height) / (de.width * de.height));
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      await this.f(Promise.all([
        sumir(resto, 220),
        anim(this.fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 200, easing: 'ease-in' }),
        anim(this.heroi, [
          { transform: 'none' },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(${(1 + k) / 2}) rotate(-4deg)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(${k})` },
        ], { duration: 900, easing: SAI }),
      ]));
      obj.style.visibility = '';
      await this.f(anim(this.heroi, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'ease-out' }));
    }
    this.fecha();
    alvo?.focus({ preventScroll: true });
  }
}

// Entrada da capa grande: cresce com elástico, o carimbo bate e o confete estoura.
async function revelaHeroi(p, { de = null } = {}) {
  const outros = [p.titulo, p.dica, p.acoes].filter(Boolean);
  outros.forEach((el) => (el.style.opacity = '0'));
  if (calma.matches) {
    outros.forEach((el) => (el.style.opacity = ''));
    p.bateCarimbo();
    return;
  }
  // sem origem: sobe de leve; com origem (vidro da TV): começa pequenininho no centro dele
  let [x0, y0, k0] = [0, 40, 0.6];
  if (de) {
    const a = centro(p.heroi.getBoundingClientRect());
    const b = centro(de);
    [x0, y0, k0] = [b.x - a.x, b.y - a.y, (de.height * 0.45) / p.heroi.offsetHeight];
  }
  const e = elastico((t) => ({
    transform: `translate(${(x0 * (1 - t)).toFixed(2)}px, ${(y0 * (1 - t)).toFixed(2)}px) scale(${(k0 + (1 - k0) * t).toFixed(4)}) rotate(${(-6 * (1 - t)).toFixed(2)}deg)`,
  }), { rigidez: 170, amortece: 14 });
  await p.f(anim(p.heroi, e.quadros, { duration: Math.max(e.ms, 900) }));
  p.heroi.style.transform = '';
  p.bateCarimbo();
  p.estoura(p.heroi, 110);
  outros.forEach((el) => (el.style.opacity = ''));
  await p.f(entrar(outros, 120, 80));
}

// ------------------------------------------------------------ caminho A: vencedor único

// grava() devolve true/false (já usa withBusy, que avisa o erro no toast).
export async function revelaVencedor({ game, votos, grava, ctx, gatilho }) {
  const p = new Palco();
  try {
    p.telaFinal(game, 'Vencedor', `${plural(votos)}. Bora jogar.`);
    p.titulo.textContent = `Deu ${game.name}!`;
    p.titulo.focus({ preventScroll: true });
    p.fala(`Deu ${game.name}, com ${plural(votos)}.`);
    const gravou = grava();
    await p.f(Promise.all([anim(p.fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' }), revelaHeroi(p)]));
    if (!(await p.f(gravou))) {
      p.mostraErro('Não deu pra gravar o resultado. Fecha e tenta de novo.');
      p.acoes.innerHTML = '<button class="btn" type="button" data-acao="fechar">Fechar</button>';
      p.acoes.querySelector('button').focus();
      await p.escolha({ esc: true });
      p.fecha();
      gatilho?.focus();
      return;
    }
    if (calma.matches) {
      p.acoes.innerHTML = '<button class="btn btn--primary" type="button" data-acao="fim">Finalizar</button>';
      p.acoes.querySelector('button').focus();
      await p.escolha();
    } else {
      await p.espera(1500);
    }
    await p.atualiza(ctx);
    await p.pousa();
    toast(`Deu ${game.name}! Bora jogar.`);
  } catch (erro) {
    if (!(erro instanceof Abortou)) throw erro;
  }
}

// ------------------------------------------------------------ caminho B: empate

// grava(game, idsEmpatados) devolve true/false. Esc/Cancelar só antes do sorteio e não grava nada.
export async function sorteiaEmpate({ jogos, votos, grava, ctx, gatilho }) {
  const p = new Palco();
  const n = jogos.length;
  let tvReal = null;
  try {
    // ---------- 1. evidência
    p.titulo.textContent = `Empate com ${plural(votos)}`;
    p.dica.textContent = n === 2 ? 'Ninguém se entendeu. A TV decide entre os dois.' : `Ninguém se entendeu. A TV decide entre os ${n}.`;
    const largo = window.matchMedia('(min-width: 760px)').matches;
    const cols = largo ? (n <= 6 ? n : Math.ceil(n / 2)) : n <= 2 ? 2 : n === 4 ? 2 : n <= 9 ? 3 : 4;
    p.capas.style.setProperty('--cols', cols);
    p.capas.style.setProperty('--rows', Math.ceil(n / cols));
    p.capas.innerHTML = jogos.map((g) => `<figure class="sorteio__jogo"><div class="sorteio__capa">${cover(g)}</div><figcaption>${esc(g.name)}</figcaption></figure>`).join('');
    p.acoes.innerHTML = `<button class="btn btn--primary" type="button" data-acao="sortear">${icon('dice')} Sortear</button>
      <button class="btn" type="button" data-acao="cancelar">Cancelar</button>`;
    const sortear = p.acoes.querySelector('[data-acao="sortear"]');
    sortear.focus({ preventScroll: true });
    p.fala(`Empate entre ${n} jogos com ${plural(votos)}.`);

    const figuras = [...p.capas.querySelectorAll('.sorteio__jogo')];
    if (!calma.matches) {
      const passo = Math.min(70, 420 / n);
      anim(p.fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
      entrar([p.titulo, p.dica], 0, 60);
      figuras.forEach((fig, i) => {
        const e = elastico((t) => ({ opacity: Math.min(1, t * 2), transform: `translateY(${(36 * (1 - t)).toFixed(2)}px) scale(${(0.7 + 0.3 * t).toFixed(4)})` }), { rigidez: 200, amortece: 15 });
        anim(fig, e.quadros, { duration: Math.max(e.ms, 700), delay: 120 + i * passo });
      });
      entrar([p.acoes], 300 + n * passo);
      setTimeout(() => p.vivo && p.estoura(p.titulo, 60), 200);
    }

    // ---------- 2. sorteia e grava ANTES de animar
    let indice;
    for (;;) {
      const acao = await p.escolha({ esc: true });
      if (acao === 'cancelar') {
        await p.f(Promise.all([sumir([p.palco], 160), anim(p.fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in' })]));
        p.fecha();
        gatilho?.focus();
        return;
      }
      if (!calma.matches) somDeChiado(1); // destrava o áudio no próprio clique (o chiado vem depois)
      p.mostraErro('');
      p.acoes.querySelectorAll('button').forEach((b) => (b.disabled = true));
      indice = drawIndex(n);
      if (await p.f(grava(jogos[indice], jogos.map((g) => g.id)))) break;
      p.mostraErro('Não deu pra gravar o sorteio. Tenta de novo?');
      p.acoes.querySelectorAll('button').forEach((b) => (b.disabled = false));
      sortear.focus();
    }
    const sorteado = jogos[indice];
    const linha = `${plural(votos)} · sorteado entre ${n}`;

    if (calma.matches) {
      // reduced-motion: direto pra tela do sorteado
      p.telaFinal(sorteado, 'Sorteado', linha);
      p.bateCarimbo();
    } else {
      p.fala('Sorteando…');
      tvReal = document.querySelector('#app .mesa-tv .tv');
      if (tvReal) {
        tvReal.style.visibility = 'hidden';
        p.limpa.push(() => tvReal.isConnected && (tvReal.style.visibility = ''));
      }
      await encena(p, jogos, indice, figuras, tvReal);
      p.telaFinal(sorteado, 'Sorteado', linha);
      await p.f(doisQuadros());
      await p.f(Promise.all([revelaHeroi(p, { de: p.vidroRect }), tvSai(p)]));
    }
    p.fala(`Sorteado: ${sorteado.name}.`);
    p.acoes.innerHTML = '<button class="btn btn--primary" type="button" data-acao="fim">Finalizar</button>';
    p.acoes.querySelector('button').focus({ preventScroll: true });
    await p.escolha();
    p.acoes.querySelector('button').disabled = true;

    // ---------- 7. refresh atrás do overlay e voo até a capinha da mesa
    await p.atualiza(ctx);
    await p.pousa();
    toast(`Deu ${sorteado.name}! Bora jogar.`);
  } catch (erro) {
    if (!(erro instanceof Abortou)) throw erro;
  }
}

// ------------------------------------------------------------ encenação do empate (só com movimento)

async function encena(p, jogos, indice, figuras, tvReal) {
  const n = jogos.length;
  await p.f(sumir([p.titulo, p.dica, p.acoes, ...p.capas.querySelectorAll('figcaption')], 180));

  // ---------- TV: clone da TV da página, fora da cadeia 3D da página
  const caixa = document.createElement('div');
  caixa.className = 'sorteio__tv';
  caixa.innerHTML = `<div class="sorteio__tremor">${tv({ osd: 'CH SORTE', title: 'Sorteio', line: `${n} jogos` })}</div>`;
  caixa.querySelector('.tv__liga')?.remove();
  caixa.querySelector('.poeira')?.remove();
  const vidro = caixa.querySelector('.tv__vidro');
  vidro.removeAttribute('data-luz'); // a luz da cena não nasce do clone
  p.palco.before(caixa);
  const tremor = caixa.querySelector('.sorteio__tremor');
  const palcoTv = caixa.querySelector('.tv-palco');
  const tvClone = caixa.querySelector('.tv');

  // FLIP: o clone já está no lugar final; parte do retângulo da TV real (ou da borda da tela)
  const fim = tvClone.getBoundingClientRect();
  let ini = tvReal?.getBoundingClientRect();
  if (!ini || !ini.width) ini = new DOMRect(fim.left, -fim.height - 40, fim.width * 0.6, fim.height * 0.6);
  else if (ini.bottom < 0) ini = new DOMRect(ini.left, -ini.height - 20, ini.width, ini.height);
  else if (ini.top > innerHeight) ini = new DOMRect(ini.left, innerHeight + 20, ini.width, ini.height);
  const caixaR = caixa.getBoundingClientRect();
  const O = centro(caixaR);
  const cf = centro(fim);
  const cs = centro(ini);
  const k = ini.width / fim.width;
  const dx = cs.x - O.x - k * (cf.x - O.x);
  const dy = cs.y - O.y - k * (cf.y - O.y);

  // as capas sobem pra abrir espaço pra TV
  const grade = p.capas.getBoundingClientRect();
  const espaco = Math.max(60, fim.top - 24 - 8);
  const kg = Math.min(1, espaco / grade.height);
  const sobe = 8 - grade.top;
  p.capas.style.transformOrigin = '50% 0';

  await p.f(Promise.all([
    anim(caixa, [
      { transform: `translate(${dx}px, ${dy}px) scale(${k})` },
      { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 30}px) scale(${(1 + k) / 2})`, offset: 0.6 },
      { transform: 'none' },
    ], { duration: 900, easing: SAI }),
    anim(palcoTv, [{ transform: getComputedStyle(palcoTv).transform }, { transform: 'rotateX(0deg) rotateY(0deg)' }], { duration: 900, easing: NA_TELA }),
    anim(p.capas, [{ transform: 'none' }, { transform: `translateY(${sobe}px) scale(${kg})` }], { duration: 700, easing: NA_TELA }),
  ]));

  // ---------- 3. as capas voam em arco até o vidro e entram com elástico; a TV dá um tranco em cada uma
  const v = vidro.getBoundingClientRect();
  const cv = centro(v);
  const passo = Math.min(110, 600 / n);
  const voos = figuras.map((fig, i) => {
    const capa = fig.querySelector('.sorteio__capa');
    const r = capa.getBoundingClientRect();
    const voo = document.createElement('div');
    voo.className = 'sorteio__voo';
    Object.assign(voo.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    voo.innerHTML = cover(jogos[i]);
    p.el.append(voo);
    capa.style.visibility = 'hidden';
    const c = centro(r);
    const tx = cv.x - c.x;
    const ty = cv.y - c.y;
    const kv = (v.height * 0.5) / r.height;
    const giro = (i % 2 ? 1 : -1) * rnd(6, 14);
    return (async () => {
      await p.espera(i * passo);
      // antecipação (recua e cresce um tico), arco por cima e chega na frente do vidro
      await p.f(anim(voo, [
        { transform: 'none' },
        { transform: 'translate(0px, 10px) scale(1.06)', offset: 0.14, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
        { transform: `translate(${tx * 0.5}px, ${ty * 0.5 - Math.min(160, innerHeight * 0.18)}px) scale(${(1 + kv) / 2}) rotate(${giro}deg)`, offset: 0.55 },
        { transform: `translate(${tx}px, ${ty}px) scale(${kv}) rotate(0deg)` },
      ], { duration: 640, easing: 'cubic-bezier(0.4, 0, 0.6, 1)' }));
      // entra no vidro com elástico (afunda, volta um pouco, some)
      const e = elastico((t) => ({ transform: `translate(${tx}px, ${ty}px) scale(${Math.max(0.02, kv * (1 - 0.92 * t)).toFixed(4)})` }), { rigidez: 260, amortece: 16 });
      anim(tremor, [
        { transform: 'none' },
        { transform: 'translateY(4px) scale(1.012, 0.985)', offset: 0.3 },
        { transform: 'none' },
      ], { duration: 240, easing: SAI });
      await p.f(Promise.all([
        anim(voo, e.quadros, { duration: Math.max(e.ms, 420) }),
        anim(voo, [{ opacity: 1 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { duration: 360, easing: 'ease-in', composite: 'replace' }),
      ]));
      voo.remove();
    })();
  });
  await p.f(Promise.all(voos));
  p.capas.style.visibility = 'hidden';

  // ---------- 4. glitch: a TV treme, chia e as barras RGB descolam (~1,4 s)
  vidro.classList.add('tv-ligada');
  vidro.insertAdjacentHTML('beforeend', '<span class="sorteio__rgb" aria-hidden="true"><i></i><i></i><i></i></span>');
  const paraChiado = chiar(vidro, 1400);
  p.limpa.push(paraChiado);
  const treme = [];
  for (let i = 0; i <= 14; i++) {
    const a = i === 0 || i === 14 ? 0 : 1;
    treme.push({ transform: `translate(${(rnd(-3, 3) * a).toFixed(1)}px, ${(rnd(-2, 2) * a).toFixed(1)}px) rotate(${(rnd(-0.6, 0.6) * a).toFixed(2)}deg)` });
  }
  await p.f(Promise.all([anim(tremor, treme, { duration: 1400, easing: 'linear' }), p.espera(1400)]));
  paraChiado();
  vidro.querySelector('.sorteio__rgb')?.remove();

  // ---------- 5. roleta de cassino dentro do vidro
  vidro.insertAdjacentHTML('beforeend', `${rodaHtml(jogos)}<span class="roda-osd" aria-hidden="true"></span>`);
  const roda = vidro.querySelector('.roda');
  const osd = vidro.querySelector('.roda-osd');
  osd.textContent = jogos[0].name;
  const er = elastico((t) => ({ opacity: Math.min(1, t * 1.6), transform: `scale(${(0.55 + 0.45 * t).toFixed(4)})` }), { rigidez: 190, amortece: 15 });
  await p.f(Promise.all([anim(roda, er.quadros, { duration: 600 }), entrar([osd], 200)]));
  await p.f(giraRoda(roda, n, indice, { ms: 6000, aoTrocar: (i) => (osd.textContent = jogos[i].name) }));
  osd.classList.add('roda-osd--fim');

  // pausa de tensão; no fim dela o vidro racha
  await p.espera(420);
  const geo = geometria();
  vidro.insertAdjacentHTML('beforeend', rachaSvg(geo));
  const linhas = [...vidro.querySelectorAll('.sorteio__racha path')];
  await p.f(Promise.all([
    ...linhas.map((l, i) => anim(l, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 160, delay: i * 6, easing: SAI })),
    anim(tremor, [{ transform: 'none' }, { transform: 'translate(-2px, 1px) rotate(-0.4deg)', offset: 0.5 }, { transform: 'none' }], { duration: 180 }),
  ]));
  await p.espera(180);

  // ---------- 6. explosão
  p.vidroRect = vidro.getBoundingClientRect();
  await explode(p, vidro, tremor, geo);
}

// Geometria do vidro quebrado (em % do vidro): ponto de impacto, raios e dois anéis.
function geometria(raios = 12) {
  const c = { x: 50 + rnd(-6, 6), y: 46 + rnd(-6, 6) };
  const angs = Array.from({ length: raios }, (_, i) => (i + 0.5 + rnd(-0.3, 0.3)) * ((2 * Math.PI) / raios));
  const ponto = (a, r) => ({
    x: Math.min(100, Math.max(0, c.x + Math.cos(a) * r)),
    y: Math.min(100, Math.max(0, c.y + Math.sin(a) * r * (4 / 3))),
  });
  // onde o raio encontra a borda do vidro
  const borda = (a) => {
    const dx = Math.cos(a);
    const dy = Math.sin(a) * (4 / 3);
    let t = Infinity;
    if (dx > 0) t = Math.min(t, (100 - c.x) / dx);
    if (dx < 0) t = Math.min(t, -c.x / dx);
    if (dy > 0) t = Math.min(t, (100 - c.y) / dy);
    if (dy < 0) t = Math.min(t, -c.y / dy);
    return { x: c.x + dx * t, y: c.y + dy * t };
  };
  const angDe = (q) => (Math.atan2((q.y - c.y) * 0.75, q.x - c.x) + 2 * Math.PI) % (2 * Math.PI);
  const cantos = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }].map((q) => ({ ...q, a: angDe(q) }));
  const p1 = angs.map((a) => ponto(a, rnd(10, 16)));
  const p2 = angs.map((a) => ponto(a, rnd(26, 36)));
  const b = angs.map(borda);
  const cacos = [p1];
  angs.forEach((a, i) => {
    const j = (i + 1) % raios;
    const aj = j === 0 ? angs[0] + 2 * Math.PI : angs[j];
    cacos.push([p1[i], p1[j], p2[j], p2[i]]);
    const meio = cantos
      .map((q) => ({ ...q, a: q.a < a ? q.a + 2 * Math.PI : q.a }))
      .filter((q) => q.a > a && q.a < aj)
      .sort((u, w) => u.a - w.a);
    cacos.push([p2[i], b[i], ...meio, b[j], p2[j]]);
  });
  return { c, p1, p2, b, cacos };
}

function rachaSvg({ c, p1, p2, b }) {
  const f = (q) => `${q.x.toFixed(2)} ${q.y.toFixed(2)}`;
  const raios = b.map((_, i) => `<path pathLength="1" d="M${f(c)} L${f(p1[i])} L${f(p2[i])} L${f(b[i])}"/>`);
  const anel = (pts) => `<path pathLength="1" d="M${pts.map(f).join(' L')} Z"/>`;
  return `<svg class="sorteio__racha" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${raios.join('')}${anel(p1)}${anel(p2)}</svg>`;
}

async function explode(p, vidro, tremor, geo) {
  const v = vidro.getBoundingClientRect();
  const cx = v.left + (geo.c.x / 100) * v.width;
  const cy = v.top + (geo.c.y / 100) * v.height;
  const escala = v.width / 400;
  somDeChiado(320); // o "crash" é o mesmo ruído, curtinho

  // camada 2D por cima do vidro: cacos, clarão, onda, faíscas e fumaça
  const fx = document.createElement('div');
  fx.className = 'sorteio__fx';
  fx.setAttribute('aria-hidden', 'true');
  fx.style.setProperty('--fx-x', `${cx}px`);
  fx.style.setProperty('--fx-y', `${cy}px`);
  const pc = (q) => `${q.x.toFixed(2)}% ${q.y.toFixed(2)}%`;
  const cacosHtml = geo.cacos.map((pts) => {
    const m = pts.reduce((s, q) => ({ x: s.x + q.x / pts.length, y: s.y + q.y / pts.length }), { x: 0, y: 0 });
    return `<i class="caco" style="clip-path: polygon(${pts.map(pc).join(', ')}); transform-origin: ${pc(m)}" data-x="${m.x}" data-y="${m.y}"></i>`;
  }).join('');
  fx.innerHTML = `<div class="sorteio__cacos" style="left:${v.left}px;top:${v.top}px;width:${v.width}px;height:${v.height}px">${cacosHtml}</div>
    <span class="sorteio__clarao" style="left:${cx}px;top:${cy}px"></span>
    <span class="sorteio__onda" style="left:${cx}px;top:${cy}px"></span>
    ${'<span class="faisca"></span>'.repeat(10)}${'<span class="fumaca"></span>'.repeat(3)}`;
  p.el.append(fx);
  p.limpa.push(() => fx.remove());

  // o vidro vira buraco escuro por trás dos cacos
  vidro.querySelectorAll('.roda, .roda-osd, .sorteio__racha').forEach((el) => el.remove());
  vidro.classList.add('sorteio__vidro--furado');

  const G = 2000;
  const cacos = [...fx.querySelectorAll('.caco')].map((el, i) => {
    const mx = Number(el.dataset.x);
    const my = Number(el.dataset.y);
    let ux = mx - geo.c.x;
    let uy = (my - geo.c.y) * 0.75;
    const len = Math.hypot(ux, uy) || 1;
    ux /= len;
    uy /= len;
    const perto = i === 0 ? 1 : i % 2 ? 0.7 : 0.25; // os do meio vêm mais "pra cima" da câmera
    const vel = rnd(320, 720) * escala * (0.8 + perto * 0.4);
    const vx = ux * vel;
    const vy = uy * vel - rnd(180, 380) * escala;
    const w = rnd(-520, 520);
    const dur = rnd(1.0, 1.4);
    const quadros = [];
    for (let s = 0; s <= 10; s++) {
      const t = (s / 10) * dur;
      quadros.push({
        transform: `translate(${(vx * t).toFixed(1)}px, ${(vy * t + 0.5 * G * escala * t * t).toFixed(1)}px) rotate(${(w * t).toFixed(1)}deg) scale(${(1 + 0.5 * perto * (s / 10)).toFixed(3)})`,
        opacity: s / 10 > 0.7 ? (1 - (s / 10 - 0.7) / 0.3).toFixed(3) : 1,
      });
    }
    return anim(el, quadros, { duration: dur * 1000, easing: 'linear' });
  });

  const faiscas = [...fx.querySelectorAll('.faisca')].map((el, i) => {
    const a = (i / 10) * Math.PI * 2 + rnd(-0.3, 0.3);
    const d = rnd(140, 300) * escala;
    return anim(el, [
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d * 0.7}px), calc(-50% + ${Math.sin(a) * d * 0.7 - 30}px)) scale(0.8)`, opacity: 1, offset: 0.6 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 40}px)) scale(0.3)`, opacity: 0 },
    ], { duration: rnd(450, 650), easing: SAI });
  });
  const fumacas = [...fx.querySelectorAll('.fumaca')].map((el, i) => anim(el, [
    { transform: `translate(calc(-50% + ${(i - 1) * 24 * escala}px), -50%) scale(0.4)`, opacity: 0 },
    { opacity: 0.45, offset: 0.25 },
    { transform: `translate(calc(-50% + ${(i - 1) * 50 * escala}px), calc(-50% - ${90 * escala}px)) scale(2.2)`, opacity: 0 },
  ], { duration: 1400, delay: 80 * i, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)' }));

  // um clarão âmbar só (nada de branco), a onda de choque e o tremor forte
  const clarao = anim(fx.querySelector('.sorteio__clarao'), [
    { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0.5, offset: 0.25 },
    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
  ], { duration: 420, easing: 'ease-out' });
  const onda = anim(fx.querySelector('.sorteio__onda'), [
    { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.8 },
    { transform: 'translate(-50%, -50%) scale(3.4)', opacity: 0 },
  ], { duration: 650, easing: SAI });
  const forte = [];
  for (let i = 0; i <= 10; i++) {
    const a = (1 - i / 10) * (i === 10 ? 0 : 1);
    forte.push({ transform: `translate(${(rnd(-9, 9) * a).toFixed(1)}px, ${(rnd(-6, 6) * a).toFixed(1)}px) rotate(${(rnd(-1.6, 1.6) * a).toFixed(2)}deg)` });
  }
  const treme = anim(tremor, forte, { duration: 520, easing: 'linear' });

  // o sorteado sai pelo vidro quando os cacos ainda estão no ar
  await p.espera(380);
  p.fim = Promise.all([...cacos, ...faiscas, ...fumacas, clarao, onda, treme]).then(() => fx.remove());
}

// a TV desce e sai de cena enquanto o sorteado cresce
function tvSai(p) {
  const caixa = p.el.querySelector('.sorteio__tv');
  if (!caixa) return Promise.resolve();
  return anim(caixa, [{ transform: 'none' }, { transform: `translateY(${Math.round(innerHeight * 0.6)}px) scale(0.85)` }], { duration: 800, easing: ENTRA_RAPIDO })
    .then(() => caixa.remove());
}
