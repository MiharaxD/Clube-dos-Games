// Ambiente de teste do trailer do YouTube na caixinha.
// Abre com `npm run dev` em http://localhost:5173/teste/trailer.html. Sem Firebase e sem login:
// a prateleira usa as mesmas peças do app (rack.js, caixinha.js) com jogos falsos. Cola um link,
// clica em "Testar" e a caixinha do "Seu jogo" abre com o trailer do lado (embaixo no celular).
// Não entra no build (só o index.html entra).
import '../src/styles.css';
import { placeLights, startScene } from '../src/lib/scene.js';
import { esc, toast, youtubeId } from '../src/lib/util.js';
import { bindTilt, caseHtml, nicho, postit, rackHtml, vitrine } from '../src/views/rack.js';
import { openReading } from '../src/views/caixinha.js';

const MEMBROS = [{ id: 'yuri', name: 'Yuri' }, { id: 'mari', name: 'Mari' }, { id: 'caio', name: 'Caio' }];
const base = { pitch: 'Confia, é bom demais.', duration: 'medio', mode: 'solo', price: 0, platforms: ['PC'] };
const JOGOS = [
  { ...base, id: 'teste', name: 'Seu jogo', suggestedBy: 'yuri', trailer: '' },
  { ...base, id: 'mari', name: 'Hollow Knight', suggestedBy: 'mari', year: 2017, genre: 'Metroidvania', trailer: 'https://www.youtube.com/watch?v=UAO2urG23S4' },
  { ...base, id: 'caio', name: 'Sem trailer', suggestedBy: 'caio', trailer: '' },
];

const main = document.getElementById('main');

function render() {
  const slots = JOGOS.map((g) => `<li class="rack__slot" data-game="${esc(g.id)}">
    ${vitrine(nicho(caseHtml(g)), `Abrir a caixinha de ${esc(g.name)}`)}
    <div class="rack__info">${postit(esc(g.name), [g.trailer ? 'com trailer' : 'sem trailer'])}</div>
  </li>`);
  main.innerHTML = `
    <div class="falta papel teste-barra">
      <p><b>Ambiente de teste</b> · trailer na caixinha. Nada vai pro Firebase.</p>
      <form data-form novalidate>
        <label>Link do YouTube
          <input name="link" type="url" inputmode="url" placeholder="https://youtube.com/watch?v=… ou youtu.be/…"></label>
        <button class="btn btn--primary" type="submit">Testar na caixinha</button>
      </form>
      <p class="teste-msg" data-msg aria-live="polite"></p>
    </div>
    <section class="estante">${rackHtml(slots, 'Jogos de teste')}</section>`;

  const rack = main.querySelector('.rack');
  bindTilt(rack);
  const abre = (slot, gatilho) => {
    const game = JOGOS.find((g) => g.id === slot.dataset.game);
    openReading({ game, members: MEMBROS, uid: 'yuri', fonte: slot.querySelector('.case'), gatilho, front: slot.querySelector('.case__front').innerHTML });
  };
  rack.addEventListener('click', (e) => {
    const abrir = e.target.closest('[data-abrir]');
    if (abrir) abre(abrir.closest('.rack__slot'), abrir);
  });

  // mesma validação do formulário de sugestão: só link do YouTube vira trailer
  main.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const link = e.currentTarget.link.value.trim();
    const msg = main.querySelector('[data-msg]');
    if (!youtubeId(link)) {
      msg.textContent = 'Esse link não é do YouTube (o formulário de verdade recusaria).';
      return;
    }
    msg.textContent = '';
    JOGOS[0].trailer = link;
    toast('Trailer colado no "Seu jogo". Abrindo a caixinha…');
    const slot = rack.querySelector('[data-game="teste"]');
    slot.querySelector('.rack__info .rack__meta').textContent = 'com trailer';
    abre(slot, slot.querySelector('[data-abrir]'));
  });
  placeLights();
}

render();
startScene();
