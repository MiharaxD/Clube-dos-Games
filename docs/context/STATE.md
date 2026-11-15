# Estado atual

## Entregue
- Os 7 marcos do pedido original: as 12 regras de negócio implementadas, README de setup,
  testes das rules passando no emulador, `DESIGN.md`.
- **Visual "Sexta no quarto" em todas as telas** (login, espera, rodada nas 4 fases, estante, stats, perfil,
  Balcão, roleta), portado dos mocks sem mudar modelo, rules nem `api.js`. Fluxo completo testado no emulador
  (sugestão pela caixinha, voto pelo ticket, empate/roleta, calendário, resenha no quadro, encerrar, finalizar).

## Pendências (prioridade)
1. Usuário criar o projeto Firebase real e fazer o primeiro deploy (README §2–9, §13).
2. **Campos novos que os mocks pedem (perguntar antes; mudam modelo + rules + testes):** comentários por jogo na
   votação (post-its da caixinha e balões na capa), "zerou" (botão ZEREI, tempo, recado, ordem → estatuetas, placar,
   vitrine, "quem zera primeiro"/lanterninha nas stats), descrição do jogo ("Do que se trata" no manual). Hoje
   omitidos; as resenhas do quadro usam o comentário das notas.
3. Estante: o mock faz a capinha voar até a mesa da rodada na própria página; no app a caixinha abre e o botão
   "Ver a mesa da rodada" leva a `#/rodada/:id` (mesa só leitura). Decidir se vale portar o voo.
4. O detector só dá avisos (advisory): cores de material dos objetos 3D e alguns tamanhos/raios fora do YAML do
   `DESIGN.md`; registrar no YAML se quiser zerar.

## Não verificado
- Login Google real (popup e redirect) e as rules no projeto real. No painel de preview do Claude o popup é
  bloqueado e o redirect do emulador não voltou logado (teste feito com credencial do emulador).
- Busca RAWG com chave válida (só o modo manual foi testado) e capas com imagem real.
- `prefers-reduced-motion`/`prefers-contrast` só por código (CSS + `calma`), sem emulação no navegador.

## Limitações conhecidas
- Chaves `VITE_*` (incl. RAWG) ficam visíveis no bundle; sem Cloud Functions não há como esconder.
- "Uma rodada ativa por vez" é garantido só na UI, não nas rules.
- Bundle ~500 kB por causa do SDK do Firebase.
- `.claude/launch.json` (local, fora do git) tem config de preview com valores `demo-*`.
