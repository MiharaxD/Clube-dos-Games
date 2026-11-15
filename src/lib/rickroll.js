// Easter egg das TVs: clicou, a TV dá um pulo, o vidro chia (estática branca + som de chiado)
// e do nada entra o vídeo (public/rickroll.webm). Clicar de novo desliga. Vale pra toda TV do site.
import { anim, calma, SAI } from './motion.js';

const VIDEO = '/rickroll.webm';
const CHIADO_MS = 1300;

// Som de chiado: ruído branco curtinho pelo WebAudio (sem arquivo).
let audio = null;
function somDeChiado(ms) {
  try {
    audio ??= new AudioContext();
    const n = Math.floor(audio.sampleRate * (ms / 1000));
    const buf = audio.createBuffer(1, n, audio.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = audio.createBufferSource();
    const vol = audio.createGain();
    vol.gain.value = 0.06;
    src.buffer = buf;
    src.connect(vol).connect(audio.destination);
    src.start();
    return () => { try { src.stop(); } catch { /* já parou */ } };
  } catch {
    return () => {};
  }
}

// Estática: canvas pequeno com pixels aleatórios, ampliado (pixelado) por CSS.
function chiar(vidro, ms) {
  const tela = document.createElement('canvas');
  tela.className = 'tv-chiado';
  tela.width = 96;
  tela.height = 72;
  vidro.append(tela);
  const g = tela.getContext('2d');
  const img = g.createImageData(tela.width, tela.height);
  const quadro = () => {
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  };
  quadro();
  const para = somDeChiado(ms);
  // com reduced-motion fica um quadro parado só (nada piscando)
  const timer = calma.matches ? 0 : setInterval(quadro, 50);
  return () => {
    clearInterval(timer);
    para();
    tela.remove();
  };
}

// vidro = elemento da tela da TV; pula = elemento que dá o pulo (fora do vidro).
export async function ligaTv(vidro, pula) {
  if (!vidro || vidro.dataset.tv === 'chiando') return;
  // ligada: o clique desliga
  if (vidro.dataset.tv === 'ligada') {
    vidro.querySelector('.tv-video')?.remove();
    vidro.classList.remove('tv-ligada');
    delete vidro.dataset.tv;
    return;
  }
  vidro.dataset.tv = 'chiando';
  vidro.classList.add('tv-ligada');
  if (pula) {
    anim(pula, [
      { translate: '0 0' },
      { translate: '0 -34px', offset: 0.4, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' },
      { translate: '0 0', offset: 0.8 },
      { translate: '0 -6px', offset: 0.9 },
      { translate: '0 0' },
    ], { duration: 520, easing: SAI }).then(() => (pula.style.translate = ''));
  }
  const video = document.createElement('video');
  video.className = 'tv-video';
  video.src = VIDEO;
  video.playsInline = true;
  video.preload = 'auto';
  // Celular só deixa o vídeo tocar se o play() nascer do toque. Como ele só entra depois do chiado
  // (timer, fora do toque), destravamos aqui: play mudo + pausa; depois o play() com som é liberado.
  video.muted = true;
  video.play().then(() => {
    if (video.isConnected) return; // já entrou na TV: não mexe
    video.pause();
    video.currentTime = 0;
    video.muted = false;
  }, () => { video.muted = false; });
  const paraChiado = chiar(vidro, CHIADO_MS);
  await new Promise((r) => setTimeout(r, CHIADO_MS));
  paraChiado();
  if (!vidro.isConnected) return;
  vidro.append(video);
  vidro.dataset.tv = 'ligada';
  const desliga = () => {
    video.remove();
    vidro.classList.remove('tv-ligada');
    delete vidro.dataset.tv;
  };
  video.addEventListener('ended', desliga);
  video.addEventListener('error', desliga);
  video.play().catch(() => {
    // sem permissão de som: toca mudo mesmo
    video.muted = true;
    video.play().catch(desliga);
  });
}

// TVs comuns do site (parts.tv): um clique em [data-tv-liga] liga a TV do mesmo .mesa-tv.
export function ligaTvsDoSite() {
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-tv-liga]');
    if (!b) return;
    const caixa = b.closest('.mesa-tv');
    ligaTv(caixa?.querySelector('.tv__vidro'), caixa?.querySelector('.tv'));
  });
}
