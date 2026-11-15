# Rotas diretas por tipo de tarefa

## Visual / estilos / tema
- **Ir direto para:** `src/styles.css` (só `@import`s, em ordem) → `src/styles/`: `base.css` (fontes, tokens
  em `:root`), `scene.css` (cena, letreiro, TV 3D + rack), `components.css` (botões, campos, painel, ficha, faixa, capa,
  carimbo, adesivo, casca, telas soltas), `rack.css` (prateleira 3D, estojo, post-it, ticket, etiqueta VOTADO,
  tela Estante), `caixinha.css` (modal do estojo, manual, CD, formulário da sugestão), `round.css` (grade da
  rodada, faixa de pano, mesa 3D, calendário, quadro de cortiça, balcão), `stats.css`, `pages.css` (perfil,
  Balcão/admin, roleta), `login.css` (cena do login: TV/prancheta/videogame na mesa), `motion.css` (reduced-motion/contraste, sempre por último). Seções por comentário
  `/* ---------- Nome ---------- */`. JS visual: `src/views/parts.js` (`neonSign`, `tv`, `cover`/`genericCover`/
  `coverPalette`, `priceTag`, `stamp`, `sticker`, `stateChip`, `phaseSteps`, avatar), `src/views/rack.js`
  (prateleira 3D: `rackHtml`, `nicho`, `caseHtml`, `postit`, `vitrine`, `bindTilt`), `src/views/caixinha.js`
  (`Estojo`, `openReading`), `src/views/mesa.js` (`caixa()`, layouts PC/celular por fase, inclusive `login`; `mountMesa`),
  `src/lib/motion.js` (motor WAAPI + `rolaNaMao`), `src/lib/rickroll.js` (easter egg de toda TV: clique →
  pulo, chiado em canvas + ruído WebAudio, vídeo `public/rickroll.webm` (AV1/Opus); TV comum liga por `[data-tv-liga]`), `src/lib/scene.js` (luz nasce de `data-luz="tv|abajur|neon"`;
  `placeLights` após cada render), `src/lib/icons.js`. Fontes em `public/fonts/` (licenças em `LICENSE.md`).
- **Testes:** `npm run build`; detector: `impeccable detect --json index.html src`
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
  (que fica `inert`) e o roteador os remove ao trocar de tela; botão sobre papel precisa de ancestral
  `.ficha`/`.confirm`/`.papel`; classes de mesa 3D com nome genérico (`.abajur`, `.capa`) vão escopadas.
  Mudou regra visual → atualizar `DESIGN.md` (e `Estetica/DOSSIE.md` se for direção) e regenerar `.impeccable/design.json`.
- **Mocks (referência, já portados):** `.impeccable/mocks/rodada-{sugerindo,votando,jogando,encerrada}.html`,
  `estante.html`, `stats.html`. Arquivos grandes: grep nas seções, nunca ler inteiros. Elementos sem campo no
  modelo (comentários da votação, ZEREI/estatuetas/placar, descrição do jogo, capa enviada do aparelho) ficaram fora.
- **Não precisa ler:** `Estetica/arquivo/`, o resto de `.impeccable/mocks/` (obsoletos, inclusive
  `prateleira-3d-v3.html`, Y2K rejeitado), `.impeccable/review/`.

## Textos da interface
- **Ir direto para:** strings ficam inline nas telas (`src/views/**`); ficha "o que falta fazer" em
  `round.js` (função `todo`, que também devolve o `cta` do botão principal; `bindCta` abre a caixinha, foca o
  ticket/slider ou abre calendário/quadro); mensagem de anúncio em `src/lib/announce.js` (botão de copiar só pro admin); erros genéricos em
  `src/lib/util.js` (`withBusy`). Frase obrigatória: "esse é seu, calma" (`phases/vote.js`).

## Telas / rotas
- **Ir direto para:** `src/main.js` (array `ROUTES`, hash routing, casca/nav, telas soltas `solo()`: espera,
  carregando, erro; login é `src/views/login.js`) → a tela em `src/views/`: `round.js` (carrega a rodada, cabeçalho/ficha/TV de
  sugerindo/votando, balcão do admin) que delega para `phases/suggest.js` | `phases/vote.js` |
  `phases/play.js` (jogando/encerrada: monta a página inteira com a mesa); `shelf.js`, `stats.js`,
  `profile.js`, `admin.js`; `roulette.js` (sorteio de empate).
- **Cuidados:** telas recriam `<main>` a cada navegação; listeners ficam no container da tela.
  Ações chamam `ctx.refresh()` depois de gravar. O `route()` põe `document.title` (campo `title` em `ROUTES`),
  foca o `<main>` e a casca traz o link `.pular`; `href="#main"` cairia no roteador, então o clique é interceptado.
  `.fatos`/`.fato` existem em `round.css` (escopo `.info`) e em `stats.css`: não remover o escopo.

## Dados (Firestore) / regras de negócio
- **Ir direto para:** `src/api.js` (todas as leituras/escritas), `firestore.rules`,
  `tests/firestore.rules.test.js`.
- **Testes:** `npm run test:rules`.
- **Capa:** `game.cover` (link da RAWG/colado) ou `game.coverData` (enviada do aparelho, `fotoParaCapa` em
  `src/lib/util.js`); renderizar sempre por `coverSrc(game)`/`imgSrc()`, nunca `safeUrl(game.cover)` direto.
  Seletor de capa (Busca/Genérica/Link/Aparelho) em `phases/suggest.js` (`opcoesCapa`).
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
  `tv()` e `mountMesa` 'encerrada' + Edge headless, refazer se a cena mudar muito). Deploy só com pedido explícito (README §13).

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
