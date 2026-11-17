# Rotas diretas por tipo de tarefa

## Visual / estilos / tema
- **Ir direto para:** `src/styles.css` (só `@import`s, em ordem) → `src/styles/`: `base.css` (fontes, tokens
  em `:root`), `scene.css` (cena, letreiro, TV 3D + rack), `components.css` (botões, campos, painel, ficha, faixa, capa,
  carimbo, adesivo, casca, telas soltas), `rack.css` (prateleira 3D, estojo, post-it, ticket, etiqueta VOTADO,
  tela Estante), `caixinha.css` (modal do estojo, manual, CD, formulário da sugestão), `round.css` (grade da
  rodada, faixa de pano, mesa 3D, calendário, quadro de cortiça, balcão), `stats.css`, `pages.css` (perfil,
  Balcão/admin), `login.css` (cena do login: TV/prancheta/videogame na mesa), `sorteio.css` (overlay do sorteio, roleta, cacos), `motion.css` (reduced-motion desliga movimento; contraste alto só tira grão/brilho; sempre por último; `calma` em `src/lib/motion.js` = só reduced-motion). Seções por comentário
  `/* ---------- Nome ---------- */`. JS visual: `src/views/parts.js` (`neonSign`, `tv`, `cover`/`genericCover`/
  `coverPalette`, `priceTag`, `stamp`, `sticker`, `stateChip`, `phaseSteps`, avatar), `src/views/rack.js`
  (prateleira 3D: `rackHtml`, `nicho`, `caseHtml`, `postit`, `vitrine`, `bindTilt`, `avisoRecados` = balão de recado não visto, lido por `src/lib/visto.js`), `src/views/caixinha.js`
  (`Estojo`, `openReading` com recados em post-it em sugerindo/votando, recado que é desenho em braille/ASCII vira "modo arte" com fonte fixa encolhida pra caber, e o trailer do YouTube ao lado), `src/views/tema.js` (flâmula do tema da
  rodada acima da prateleira; admin clica e edita), `src/views/mesa.js` (`caixa()`, layouts PC/celular por fase, inclusive `login`; `mountMesa`),
  `src/lib/motion.js` (motor WAAPI + `rolaNaMao` + `elastico`, este só no sorteio), `src/lib/festa.js` (confete em canvas), `src/lib/rickroll.js` (easter egg de toda TV: clique →
  pulo, chiado em canvas + ruído WebAudio (`chiar`/`somDeChiado` exportados, reusados no sorteio), vídeo `public/rickroll.mp4` (H.264/AAC, toca em celular); TV comum liga por `[data-tv-liga]`), `src/lib/scene.js` (luz nasce de `data-luz="tv|abajur|neon"`;
  `placeLights` após cada render), `src/lib/icons.js`. Fontes em `public/fonts/` (licenças em `LICENSE.md`).
- **Testes:** `npm run build`; sem Firebase: `npm run dev` → `/teste/quadro.html` (mesa de jogando/quadro, dados falsos no localStorage) e `/teste/trailer.html` (cola link do YouTube e abre a caixinha com o trailer); `teste/` não entra no build; detector: `impeccable detect --json index.html src`
  (script em `~/.claude/plugins/cache/impeccable/.../scripts/impeccable`).
- **Mundo:** "Sexta no quarto", definido em `DESIGN.md` (manda em conflito) e já aplicado em todas as telas.
- **Consulta visual (`Estetica/DOSSIE.md`): leia SÓ quando a tarefa exigir decisão ou inspiração visual
  nova:** criar/redesenhar tela ou componente, cena (luz, TV de tubo, neon, prateleira 3D, props, parede),
  efeito (grão, scanlines, vinheta, glow, parallax), paleta ou fonte nova, ilustração SVG, texto de interface
  com clima, dúvida de direitos de imagem/fonte. **Não leia** para lógica, dados, rules, bugs, build, nem para
  ajuste já coberto pelo `DESIGN.md`. Ordem: `DESIGN.md` → `DOSSIE.md` (só a seção do assunto; grep nos `##`).
- **Cuidados:** capa sempre 3:4; alvos ≥ 44px; texto só sobre superfície sólida; nada de filtro/blend/opacidade
  na cadeia 3D (prateleira, estojo, mesa, TV); parallax da parede/TV é laço rAF suavizado em `scene.js`,
  sem transição CSS (reiniciar transição por pointermove fazia o fundo piscar); rolagem dentro de `preserve-3d` usa `rolaNaMao`; cliques na mesa 3D
  são botões `.alvo` reposicionados por `mountMesa`; modais (caixinha, calendário, quadro) ficam fora do `#app`
  (que fica `inert`) e o roteador os remove ao trocar de tela; a tampa da caixinha NÃO confia em `backface-visibility` (falha no WebKit/iPhone: filhos com transform vazam espelhados): `Estojo.trocaFaces` alterna `visibility` frente/verso durante o giro; `.app` tem `overflow-x: clip` (carpete e mesa em perspectiva alargavam a página no celular); o modal do formulário rola em tela baixa; `perspective` num modal que rola prende o `.modal__fundo` fixo ao conteúdo (por isso `.modal--quadro` não tem); botão sobre papel precisa de ancestral
  `.ficha`/`.confirm`/`.papel`; classes de mesa 3D com nome genérico (`.abajur`, `.capa`) vão escopadas.
  Mudou regra visual → atualizar `DESIGN.md` (e `Estetica/DOSSIE.md` se for direção) e regenerar `.impeccable/design.json`.
- **Mocks (referência, já portados):** `.impeccable/mocks/rodada-{sugerindo,votando,jogando,encerrada}.html`,
  `estante.html`, `stats.html`. Arquivos grandes: grep nas seções, nunca ler inteiros. Ficaram fora: tempo/recado/placar/vitrine do
  ZEREI e descrição do jogo (sem campo no modelo).
- **Não precisa ler:** `Estetica/arquivo/`, o resto de `.impeccable/mocks/` (obsoletos, inclusive
  `prateleira-3d-v3.html`, Y2K rejeitado), `.impeccable/review/`.

## Textos da interface
- **Ir direto para:** strings ficam inline nas telas (`src/views/**`); ficha "o que falta fazer" em
  `round.js` (função `todo`, que também devolve o `cta` do botão principal; `bindCta` abre a caixinha, foca o
  ticket ou abre calendário/quadro); mensagem de anúncio em `src/lib/announce.js` (botão de copiar só pro admin, fora da tela de jogando, onde o lugar é do trailer); erros genéricos em
  `src/lib/util.js` (`withBusy`). Frase obrigatória: "esse é seu, calma" (`phases/vote.js`).

## Telas / rotas
- **Ir direto para:** `src/main.js` (array `ROUTES`, hash routing, casca/nav, telas soltas `solo()`: espera,
  carregando, erro; login é `src/views/login.js`) → a tela em `src/views/`: `round.js` (carrega a rodada e, em sugerindo/votando, os recados de
  todos os jogos; cabeçalho/ficha/TV, balcão do admin com "quem falta votar" em votando) que delega para `phases/suggest.js` | `phases/vote.js` |
  `phases/play.js` (jogando/encerrada: monta a página inteira com a mesa; ZEREI pede a foto de prova (`pedeProva`) e grava `zerei/{uid}`, `mountMesa().solta(i)` derruba a estatueta; o porta-retrato da mesa (`retratoHtml` no mesa.js) o admin clica pra pôr a foto do ganhador (`updateRoundFoto`); clicar numa estatueta abre `openEstatueta` (boneco grande via `estatuetaSoloHtml` + foto + "Anular zerei" do admin); o quadro de jogando abre por `src/views/diario.js` (3 páginas, setinhas giram o quadro; sem Firestore: recebe `salvar`); o quadro aberto da encerrada e o de jogando usam o quadro livre de `src/views/quadro.js` (modo resenha ou `notinhas: true`; grava pela `salvar` recebida): palco fixo 1730x1210 escalado + zoom até 5x (botões, ctrl+roda, pinça; janela rola), notas ocupam espaço (`separa` empurra a sua ao arrastar, `arruma` desvia as sobrepostas ao abrir, só na tela), mover/caneta/borracha/foto com ícones pixel de `icons.js` e atalhos V/B/E/Ctrl+Z; no PC (≥ 900px) o formulário da nota fica em linha no canto de baixo, à direita do quadro; salva com debounce e no fechar; CSS `.ql-*` em `round.css`); `shelf.js`, `stats.js`,
  `profile.js`, `admin.js` (aprova fila e remove sócio com `removeMember`, que apaga o doc de `members`; só admin, nunca a si mesmo; jogos/votos ficam e o nome vira "Ex-sócio"; quem volta a logar cai na fila de novo); `sorteio.js` (overlay de fechar a votação, chamado por `closeVoting` em `phases/vote.js`:
  vencedor único ou empate com clone da TV, glitch, roda de `roulette.js` e explosão; voa até `#caso-obj`).
- **Cuidados:** telas recriam `<main>` a cada navegação (a casca aparece antes de `listMembers()` voltar; `rotaAtual` descarta navegação velha); listeners ficam no container da tela. A espera de aprovação reconfere `getMember` ao voltar pra aba. O `toast()` fala por `#toast-status`/`#toast-alert` (balão `aria-hidden`).
  Ações chamam `ctx.refresh()` depois de gravar. O `route()` põe `document.title` (campo `title` em `ROUTES`),
  foca o `<main>` e a casca traz o link `.pular`; `href="#main"` cairia no roteador, então o clique é interceptado.
  `.fatos`/`.fato` existem em `round.css` (escopo `.info`) e em `stats.css`: não remover o escopo.
  Voto: desfazer é limitado a 2 por rodada (pegadinha só da UI, contador em `localStorage` `clube:desfez:<rodada>:<uid>`
  em `phases/vote.js`; 3ª tentativa = toast `'pop'` (2,5 s, sem clique, acima do modal), insistir = `window.open` do Rick Roll; as rules não limitam).
  Sorteio: sorteia e grava ANTES de animar; o overlay `.sorteio` não usa `.modal` (o `ctx.refresh()` é o próprio
  roteador e apaga modais), reaplica `inert`/`trava` depois do refresh e aborta no `hashchange`.

## Dados (Firestore) / regras de negócio
- **Ir direto para:** `src/api.js` (todas as leituras/escritas), `firestore.rules`,
  `tests/firestore.rules.test.js`.
- **Testes:** `npm run test:rules`. Se o emulador do app já ocupa a 8080, rodar com outra config (porta 8085) em vez de
  apontar pros dados dele (os testes apagam o banco).
- **Capa:** `game.cover` (link da RAWG/colado) ou `game.coverData` (enviada do aparelho, `fotoParaCapa` em
  `src/lib/util.js`); renderizar sempre por `coverSrc(game)`/`imgSrc()`, nunca `safeUrl(game.cover)` direto.
  Seletor de capa (Busca/Genérica/Link/Aparelho) em `phases/suggest.js` (`opcoesCapa`).
  **Trailer:** `game.trailer` entra no iframe só pelo ID de `youtubeId()` (`src/lib/util.js`), nunca o link cru.
- **Cuidados:** mudar campo de documento = mudar `api.js` + `validGame`/`validRound`/etc. nas rules
  + testes, juntos. Voto secreto: durante "votando" membro só lê o próprio voto (por isso
  `getMyVotes` usa getDoc um a um). Voltar status apaga votos/vencedor em `changeStatus` (batch).
- **Arquivo grande:** `firestore.rules` (~300 linhas) → grep `match /` para achar a coleção.

## Autenticação / permissões / admin
- **Ir direto para:** `src/main.js` (`onAuthStateChanged`, `entrarComGoogle`, `renderPending`, fade pós-login
  `preparaRevelar`), `src/views/login.js` (cena: queda, cliques, contrato em evidência, `sai()`, botão `.login__entrar` que só
  aparece depois da queda e repassa o clique à prancheta),
  `src/firebase.js` (init por env + conexão com emuladores), rules `isAdmin`/`isApproved`.
- **Cuidados:** admin = uid em `config/admins.uids` (só pelo console). Popup bloqueado cai em redirect (aí não há contrato
  em evidência). Contrato fica em evidência até o `onAuthStateChanged`, com o botão dele
  reabrindo o popup (só a última tentativa decide se o contrato volta pra mesa); o main chama `sai()` antes da tela seguinte.

## Integrações externas
- **RAWG:** `src/lib/rawg.js` + `bindRawg` em `phases/suggest.js`; mapeamento de plataformas em
  `src/lib/platforms.js` (mesma lista existe em `firestore.rules`). Sem chave/erro → modo manual.

## Contas e estatísticas
- **Ir direto para:** `src/lib/tally.js` (ranking, empate, média, desvio, sorteio crypto, chave de
  jogo), `src/views/stats.js`.

## Build / config / deploy
- **Ir direto para:** `package.json`, `firebase.json` (hosting `dist`, portas dos emuladores),
  `.env.example`, `index.html` (camadas da cena, preload das fontes, meta og/twitter da prévia de link com URL
  absoluta do Hosting), `public/og.jpg` (1200x630, TV + console + quadro; gerada de uma página temporária com
  `tv()` e `mountMesa` 'encerrada' + Edge headless, refazer se a cena mudar muito). Deploy só com pedido explícito (README §13). **Cuidado:** o `.env.local` daqui é o do emulador (`demo-clube`);
  pro deploy, buildar com as `VITE_FIREBASE_*` reais vindas de `npx firebase apps:sdkconfig web --project clube` no
  ambiente do comando e `VITE_USE_EMULATORS=false` (variável do shell vence o `.env.local`), e conferir que o bundle não tem `demo-clube`.

## Mini-mapa
| Arquivo | Papel |
|---|---|
| `src/main.js` | boot, auth, casca, roteador |
| `src/api.js` | camada Firestore |
| `src/firebase.js` | init + emuladores |
| `src/views/round.js` | rodada, ficha, balcão admin |
| `src/views/phases/*.js` | corpo de cada fase |
| `src/views/parts.js` | peças de UI reutilizadas |
| `src/views/rack.js` / `caixinha.js` / `mesa.js` | prateleira 3D / estojo modal / mesa 3D |
| `src/lib/util.js` | esc, safeUrl, datas, toast, withBusy, confirmInline |
| `src/lib/tally.js` | contas no cliente |
| `src/styles.css` + `src/styles/*.css` | CSS (entrada + partes) |
| `src/lib/motion.js` / `scene.js` | motor de movimento / cena |
| `firestore.rules` | regras de negócio no servidor |
| `tests/firestore.rules.test.js` | testes das rules |
| `PRODUCT.md` / `DESIGN.md` | produto / sistema visual (manda) |
| `Estetica/DOSSIE.md` | porquê e receitas visuais; só para consulta visual |
