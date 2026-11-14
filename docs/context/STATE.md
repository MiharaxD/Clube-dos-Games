# Estado atual

## Entregue
- Os 7 marcos do pedido original: as 12 regras de negócio implementadas, README de setup,
  testes das rules passando no emulador, revisão visual final do impeccable ("ship"), `DESIGN.md`.
- Fluxo completo testado no emulador com usuários falsos (login, aprovação, sugestão, voto,
  empate/roleta, jogando, datas, notas/spoiler, perguntas, encerrar, estante, stats, voltar status).

## Pendências (prioridade)
1. Usuário criar o projeto Firebase real e fazer o primeiro deploy (README §2–9, §13).
2. Decidir: consolidar os tamanhos de fonte do `styles.css` numa escala menor OU ampliar a escala
   no `DESIGN.md` (detector acusa ~19 tamanhos e a cor de placeholder `#a8998a` fora do DESIGN.md).

## Não verificado
- Login Google real (popup e redirect) e as rules no projeto real.
- Busca RAWG com chave válida (só o caso de falha foi testado).
- Capas com imagem real; roleta com 3+ empatados; `prefers-reduced-motion`.

## Limitações conhecidas
- Chaves `VITE_*` (incl. RAWG) ficam visíveis no bundle; sem Cloud Functions não há como esconder.
- "Uma rodada ativa por vez" é garantido só na UI, não nas rules.
- Bundle ~500 kB por causa do SDK do Firebase.
- `.claude/launch.json` (local, fora do git) tem config de preview com valores `demo-*`.
