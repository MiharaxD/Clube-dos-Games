# Rotas diretas por tipo de tarefa

## Visual / estilos / tema
- **Ir direto para:** `src/styles.css` (tokens em `:root` no topo; seções por comentário
  `/* ---------- Nome ---------- */`), `DESIGN.md` (regras do sistema), `src/views/parts.js`
  (card de jogo `gameBox`, capa, faixa de fases, avatar).
- **Testes:** `npm run build`; detector: `impeccable detect --json index.html src`
  (script em `~/.claude/plugins/cache/impeccable/.../scripts/impeccable`).
- **Cuidados:** sombra dura curta (`0 6px 0 var(--deep)`) em objetos; capa sempre 3:4; alvos ≥ 44px;
  foco sobre papel usa `--paper-ink`; número isolado em adesivo usa `.sticker--num`; kicker acima
  de título é proibido. Mudou regra visual → atualizar `DESIGN.md` e `.impeccable/design.json`.
- **Não precisa ler:** `.impeccable/mocks/` (esboços arquivados; exceção: `prateleira-3d.html`, mock
  ativa da estante 3D), `.impeccable/review/` (capturas).
- **Arquivo grande:** `styles.css` (~520 linhas) → grep pelo nome da classe ou da seção.

## Textos da interface
- **Ir direto para:** strings ficam inline nas telas (`src/views/**`); ficha "o que falta fazer" em
  `round.js` (função `todo`); mensagem de anúncio em `src/lib/announce.js`; erros genéricos em
  `src/lib/util.js` (`withBusy`). Frase obrigatória: "esse é seu, calma" (`phases/vote.js`).

## Telas / rotas
- **Ir direto para:** `src/main.js` (array `ROUTES`, hash routing, casca/nav, login, espera de
  aprovação) → a tela em `src/views/`: `round.js` (rodada + balcão do admin) que delega para
  `phases/suggest.js` | `phases/vote.js` | `phases/play.js` (jogando/encerrada); `shelf.js`,
  `stats.js`, `profile.js`, `admin.js`; `roulette.js` (sorteio de empate).
- **Cuidados:** telas recriam `<main>` a cada navegação; listeners ficam no container da tela.
  Ações chamam `ctx.refresh()` depois de gravar.

## Dados (Firestore) / regras de negócio
- **Ir direto para:** `src/api.js` (todas as leituras/escritas), `firestore.rules`,
  `tests/firestore.rules.test.js`.
- **Testes:** `npm run test:rules`.
- **Cuidados:** mudar campo de documento = mudar `api.js` + `validGame`/`validRound`/etc. nas rules
  + testes, juntos. Voto secreto: durante "votando" membro só lê o próprio voto (por isso
  `getMyVotes` usa getDoc um a um). Voltar status apaga votos/vencedor em `changeStatus` (batch).
- **Arquivo grande:** `firestore.rules` (~300 linhas) → grep `match /` para achar a coleção.

## Autenticação / permissões / admin
- **Ir direto para:** `src/main.js` (`onAuthStateChanged`, `renderLogin`, `renderPending`),
  `src/firebase.js` (init por env + conexão com emuladores), rules `isAdmin`/`isApproved`.
- **Cuidados:** admin = uid em `config/admins.uids` (só pelo console). Popup bloqueado cai em redirect.

## Integrações externas
- **RAWG:** `src/lib/rawg.js` + `bindRawg` em `phases/suggest.js`; mapeamento de plataformas em
  `src/lib/platforms.js` (mesma lista existe em `firestore.rules`). Sem chave/erro → modo manual.

## Contas e estatísticas
- **Ir direto para:** `src/lib/tally.js` (ranking, empate, média, desvio, sorteio crypto, chave de
  jogo), `src/views/stats.js`.

## Build / config / deploy
- **Ir direto para:** `package.json`, `firebase.json` (hosting `dist`, portas dos emuladores),
  `.env.example`, `index.html` (fontes Google). Deploy só com pedido explícito (README §13).

## Mini-mapa
| Arquivo | Papel |
|---|---|
| `src/main.js` | boot, auth, casca, roteador |
| `src/api.js` | camada Firestore |
| `src/firebase.js` | init + emuladores |
| `src/views/round.js` | rodada, ficha, balcão admin |
| `src/views/phases/*.js` | corpo de cada fase |
| `src/views/parts.js` | peças de UI reutilizadas |
| `src/lib/util.js` | esc, safeUrl, datas, toast, withBusy, confirmInline |
| `src/lib/tally.js` | contas no cliente |
| `src/styles.css` | todo o CSS |
| `firestore.rules` | regras de negócio no servidor |
| `tests/firestore.rules.test.js` | 46 testes das rules |
| `PRODUCT.md` / `DESIGN.md` | produto / sistema visual |
