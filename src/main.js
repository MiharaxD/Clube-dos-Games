// Ponto de entrada. Por enquanto só confere se o Firebase está configurado.
import { missingEnv } from './firebase.js';

const root = document.getElementById('app');

if (missingEnv.length) {
  root.innerHTML = `
    <h1>Configuração incompleta</h1>
    <p>Preencha estas variáveis no <code>.env.local</code> (veja o README):</p>
    <ul>${missingEnv.map((name) => `<li><code>${name}</code></li>`).join('')}</ul>`;
} else {
  root.innerHTML = '<h1>Clube dos Jogos</h1><p>Firebase configurado.</p>';
}
