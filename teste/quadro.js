// Ambiente de teste do quadro de jogando (e da mesa nova: videogame + capinha, estatuetas, ZEREI).
// Abre com `npm run dev` em http://localhost:5173/teste/quadro.html. Sem Firebase e sem login:
// usa as mesmas telas do app (mesa.js, diario.js, quadro.js) com dados falsos, e o que você
// prega/rabisca fica no localStorage deste navegador. Não entra no build (só o index.html entra).
import '../src/styles.css';
import { placeLights, startScene } from '../src/lib/scene.js';
import { esc, toast } from '../src/lib/util.js';
import { caseFront } from '../src/views/rack.js';
import { stamp } from '../src/views/parts.js';
import { METAIS, mesaSection, mountMesa } from '../src/views/mesa.js';
import { abreDiario } from '../src/views/diario.js';

const CHAVE = 'clube:teste:quadro';
const MEMBROS = [
  { id: 'yuri', name: 'Yuri' },
  { id: 'mari', name: 'Mari' },
  { id: 'caio', name: 'Caio' },
  { id: 'bia', name: 'Bia' },
  { id: 'duda', name: 'Duda' },
  { id: 'leo', name: 'Léo' },
];
const nomeDe = (id) => MEMBROS.find((m) => m.id === id)?.name ?? 'Ex-sócio';
const GAME = { name: 'Outer Wilds', duration: 'medio', mode: 'solo', price: 60, genre: 'Aventura', platforms: ['PC'] };

// o que os "outros" já pregaram (pra ver como fica com o quadro cheio)
function semente() {
  return {
    eu: 'yuri',
    fase: 'jogando',
    zerei: ['mari', 'caio'],
    diario: [
      { uid: 'mari', pagina: 0, notes: [{ x: 120, y: 210, text: 'Zerei em 11h. O final me destruiu, avisando.' }, { x: 620, y: 520, text: 'Dica: lê TUDO que os Nomai escreveram.' }], strokes: ['1|6|300,700 340,660 400,690 460,640 520,700'], images: [] },
      { uid: 'caio', pagina: 0, notes: [{ x: 1180, y: 260, text: 'Tenho medo do espaço. Me deixem.' }], strokes: [], images: [] },
      { uid: 'bia', pagina: 1, notes: [{ x: 300, y: 300, text: 'Página 2: teoria do Olho do universo aqui 👁️' }], strokes: ['2|3|800,300 900,380 1000,300 1100,380'], images: [] },
      { uid: 'leo', pagina: 2, notes: [{ x: 700, y: 600, text: 'Quem chegar no Olho primeiro paga a pizza.' }], strokes: [], images: [] },
    ],
  };
}

let estado;
try {
  estado = JSON.parse(localStorage.getItem(CHAVE)) ?? semente();
} catch {
  estado = semente();
}
const grava = () => {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch (err) {
    console.error(err);
    toast('O navegador não deixou gravar (foto grande demais?).', 'erro');
  }
};

const main = document.getElementById('main');
const zeradosTxt = (zerados) => (zerados.length
  ? `${zerados.length} de ${MEMBROS.length} zeraram: ${zerados.map((m, i) => `<b>${i + 1}º</b> ${esc(m.name)}`).join(' · ')}`
  : 'Ninguém zerou ainda. A estatueta de ouro tá esperando.');

function render() {
  const playing = estado.fase === 'jogando';
  // recados falsos pra ver o balão em cima das estatuetas
  const RECADOS = {
    mari: 'aquele final me quebrou, chorei no sofá',
    caio: 'fácil demais kkk',
    yuri: 'demorei 40 horas mas valeu cada minuto, o último planeta é a coisa mais linda que eu já vi num jogo',
    bia: 'zerei no modo difícil sem morrer nenhuma vez, podem me chamar de lenda viva do clube a partir de hoje, obrigada',
    duda: 'bom',
    leo: 'escrevi o maior recado possível só pra testar se cabe tudo no balãozinho em cima da minha estatueta, sem cortar nada no final, ok? valeu, falou',
  };
  const zerados = estado.zerei.map((id) => MEMBROS.find((m) => m.id === id)).filter(Boolean).map((m) => ({ ...m, recado: RECADOS[m.id] ?? '' }));
  const minhaPos = zerados.findIndex((m) => m.id === estado.eu);
  const alvos = [];
  if (playing) alvos.push({ obj: 'botao-obj', label: minhaPos < 0 ? 'Zerei!' : `Você já zerou (${minhaPos + 1}º)`, popup: false });
  alvos.push({ obj: 'diario-obj', label: playing ? 'Abrir o quadro de jogando' : 'Rever o quadro de jogando' });
  const notinhas = estado.diario.reduce((n, d) => n + (d.notes?.length ?? 0), 0);

  main.innerHTML = `
    <div class="rodada--mesa">
      <div class="falta papel teste-barra">
        <p><b>Ambiente de teste</b> · dados falsos, nada vai pro Firebase. O quadro grava neste navegador.</p>
        <div class="actions">
          <label>Fase
            <select data-fase>
              <option value="jogando" ${playing ? 'selected' : ''}>Jogando (escreve)</option>
              <option value="encerrada" ${playing ? '' : 'selected'}>Encerrada (só ver)</option>
            </select></label>
          <label>Você é
            <select data-eu>${MEMBROS.map((m) => `<option value="${m.id}" ${m.id === estado.eu ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</select></label>
          <button class="btn btn--primary" type="button" data-abre>Abrir o quadro</button>
          <button class="btn" type="button" data-reset>Zerar dados de teste</button>
        </div>
      </div>
      ${mesaSection({ alvos, depois: `<div class="zerados"><p>${zeradosTxt(zerados)}</p></div>` })}
    </div>`;

  const sec = main.querySelector('.mesa-sec');
  const textos = (pos) => (pos < 0 ? { placa: 'Zerei!', notaZ: 'aperta quando zerar' } : { placa: `Zerado · ${pos + 1}º`, notaZ: 'já foi, chora' });
  const mini = { mes: 'Dezembro', ano: 2026, ini: 2, fim: 31, of: new Set([4, 5, 11, 12, 18, 19]), sel: new Set([11]), nota: 'marca teus dias' };
  const mesa = mountMesa(sec, {
    fase: estado.fase, game: GAME, front: caseFront(GAME, stamp('Vencedor')), mini, pages: [], nota: playing ? '' : '5 de 6 deram nota', nomeVencedor: 'Mari', podeTrocarFoto: true,
    zerados, vagas: MEMBROS.length, ...textos(minhaPos), notinhas,
  });

  const abre = (gatilho) => abreDiario({
    gatilho,
    objeto: mesa.mesa.querySelector('#diario-obj'),
    face: () => mesa.mesa.querySelector('#diario-obj .m-quadro > .f'),
    docs: estado.diario,
    uid: estado.eu,
    nomeDe,
    soLeitura: !playing,
    salvar: async (pagina, dados) => {
      estado.diario = estado.diario.filter((d) => !(d.uid === estado.eu && d.pagina === pagina));
      estado.diario.push({ uid: estado.eu, pagina, notes: dados.notes, strokes: dados.strokes, images: dados.images });
      grava();
    },
    aoFechar: (mexeu) => mexeu && render(),
  });
  sec.querySelector('[data-obj="diario-obj"]').addEventListener('click', (e) => abre(e.currentTarget));
  main.querySelector('[data-abre]').addEventListener('click', (e) => abre(e.currentTarget));

  sec.querySelector('[data-obj="botao-obj"]')?.addEventListener('click', async () => {
    mesa.aperta();
    if (estado.zerei.includes(estado.eu)) {
      // no teste, apertar de novo desfaz (no app é o botão "Desfazer meu zerei")
      estado.zerei = estado.zerei.filter((id) => id !== estado.eu);
      grava();
      toast('Zerei desfeito (só no teste).');
      render();
      return;
    }
    estado.zerei.push(estado.eu);
    grava();
    const i = estado.zerei.length - 1;
    zerados.push(MEMBROS.find((m) => m.id === estado.eu));
    mesa.remonta({ zerados, ...textos(i) });
    sec.querySelector('.zerados p').innerHTML = zeradosTxt(zerados);
    await mesa.solta(i);
    toast(`Zerado! ${i + 1}º lugar, estatueta de ${METAIS[i % METAIS.length].nome}.`);
  });

  main.querySelector('[data-fase]').addEventListener('change', (e) => {
    estado.fase = e.target.value;
    grava();
    render();
  });
  main.querySelector('[data-eu]').addEventListener('change', (e) => {
    estado.eu = e.target.value;
    grava();
    render();
  });
  main.querySelector('[data-reset]').addEventListener('click', () => {
    estado = semente();
    grava();
    render();
    toast('Dados de teste de volta ao começo.');
  });
  placeLights();
}

startScene();
render();
