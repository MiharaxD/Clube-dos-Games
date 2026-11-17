# Clube dos Jogos

Site de um "clube do livro de videogame" entre amigos (5–12 pessoas, pt-BR, assíncrono): cada rodada
alguém sugere 1 jogo, o grupo vota por aprovação, joga e depois se reúne. Setup e uso: `README.md`.

Stack: Vite 8 + JavaScript puro (sem framework/TS), CSS próprio, Firebase 13 (Auth Google,
Firestore, Hosting). Node 24.12+. Java 21 só para os emuladores.

## Comandos
- Instalar: `npm install`
- Rodar: `npm run dev` (http://localhost:5173)
- Build: `npm run build` (o aviso de chunk > 500 kB é o SDK do Firebase; não é erro)
- Testes das rules: `npm run test:rules` (sobe o emulador sozinho, projeto `demo-clube`)
- Testar a mesa de jogando/quadro sem Firebase: `npm run dev` → http://localhost:5173/teste/quadro.html
  (trailer na caixinha: `/teste/trailer.html`)
- Emuladores p/ testar o app: `npm run emulators` + `.env.local` com `VITE_USE_EMULATORS=true`
  (detalhes em README §11). Se "java não encontrado": abrir terminal novo.
- **Só com pedido explícito:** `npx firebase deploy`, `npx firebase login`, `npx firebase use`,
  qualquer coisa contra o projeto Firebase real. Nunca commitar `.env.local`.

## Invariantes
- Regra crítica: ninguém vota no próprio jogo — garantida em `firestore.rules`, não só na UI.
- Toda regra de negócio vale no servidor (rules); mudou regra → mudar `firestore.rules` E
  `tests/firestore.rules.test.js`, e rodar `npm run test:rules`.
- Modelo de dados fixo (ver `docs/context/DECISIONS.md`); mudar modelo = perguntar antes.
- Sem Cloud Functions / nada pago. Dependências só: firebase, vite, @firebase/rules-unit-testing,
  firebase-tools (dev). Qualquer outra: perguntar.
- Credenciais só por `VITE_*` no `.env.local` (lembrar: ficam visíveis no bundle).
- Todo texto de usuário que vai para `innerHTML` passa por `esc()`; URLs por `safeUrl()`.
- Escopo estrito: não adicionar features/páginas além do pedido.

## Estilo
- JS ES modules, sem framework: cada tela é `render(main, ctx)` que monta HTML em template string.
- Telas nunca chamam o SDK do Firestore direto: só via `src/api.js`.
- Comentários em pt-BR só nas partes críticas; textos de UI em pt-BR, voz "zoeira de amigos".
- Visual segue `DESIGN.md` (mundo "Sexta no quarto"); consulta visual funda só via ROUTES (`Estetica/DOSSIE.md`); detector: impeccable.

## Protocolo de consulta (antes de qualquer tarefa)
1. Leia `docs/context/ROUTES.md` e vá direto aos caminhos do tipo de tarefa.
2. Leia `STATE.md` e `DECISIONS.md` só se a tarefa depender de estado, prioridades ou escolhas
   de produto. (Não há `ARCHITECTURE.md`: o fluxo tela → `src/api.js` → rules está no ROUTES.)
3. Explore além disso só se a rota não cobrir o caso. Em arquivo grande, use busca e leia trechos.

## Protocolo de manutenção (ao terminar trabalho relevante, sem precisar pedir)
- Atualize só os documentos afetados, antes de declarar a tarefa concluída.
- Substitua em vez de acrescentar: remova o obsoleto, pendências concluídas e redundâncias.
- Descobriu caminho novo ou rota errada: corrija o `ROUTES.md`.
- Nunca registre diário, log de sessão, raciocínio, SHAs, resultados de teste datados ou tamanhos
  de build.
- Respeite os limites de tamanho (~1.500–2.000 tokens por arquivo); perto do limite, compacte.
- Instruções novas do usuário prevalecem; atualize os documentos quando mudarem uma regra.
