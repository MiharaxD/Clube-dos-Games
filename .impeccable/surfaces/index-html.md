---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src"]
---

## Scope

App inteiro (SPA com hash routes): rodada atual, estante, stats, perfil, admin, login e espera de aprovação. Mode: Operate.

## Audience and job

5 a 12 amigos, celular e PC meio a meio, entram de forma assíncrona pelo link do grupo. Tarefa principal: ver em que fase a rodada está e fazer o que falta (sugerir, votar, marcar datas, dar nota).

## Direction contract

THESIS: A rodada é a prateleira de lançamentos de uma locadora de sexta à noite: os jogos ficam de frente, com etiqueta, e cada etapa é um passo no balcão. Recusa o padrão "site retrô gamer" de preto + neon + fonte pixel em tudo, e recusa cards genéricos de dashboard.

OWN-WORLD: Fundo marrom-escuro de prateleira (#1a1411, #2b211c), borda de fórmica (#4a3a30) e beiço da prateleira (#5c4838). Acentos: laranja de etiqueta (#ff7a1a), verde-limão de destaque e da fase atual (#b6f03c), rosa de tarja de seção (#ff3d6e), e papel de ficha (#f4ecd2) só em fichas pequenas. Fontes: Jersey 10 (pixel, títulos), Barlow (texto e UI), Permanent Marker (só etiquetas escritas à mão: preço, bilhetinhos). Capas sempre 3:4 com sombra dura curta, de frente na prateleira. Estados viram carimbos (SEPARADO, SEU, VENCEDOR, SORTEADO) e adesivos.

STORY: A pessoa abre o link, vê a Fase N e a faixa de etapas, lê na Ficha do sócio o que falta ela fazer, age nos cards da prateleira (votar, sugerir, avaliar) e sai. Sem pressa e sem tela "ao vivo".

FIRST VIEWPORT: Barra fina com o logo em Jersey 10 laranja, a navegação Rodada/Estante/Stats (que vai pra uma segunda linha no celular) e o avatar. Depois o título "FASE N" grande e a faixa de 4 etapas (as concluídas riscadas, a atual em limão). Em seguida a Ficha do sócio (papel levemente girado, com carimbo do status) com a próxima ação. Abaixo, a prateleira: grade de capas (2 colunas no celular, 4 no PC) com o beiço de madeira embaixo. O botão primário fica no próprio card.

FORM: Locadora de sexta (pick do impeccable, posição 1 da lista ordenada; sorteada foi a 4, Cartucho & Manual, recusada pelo usuário depois de ver os dois mocks). seed:3a403dd3a31fa876. Assinatura: o voto "separa" o jogo, com o carimbo SEPARADO batendo na capa (animação curta de carimbo, desligada em prefers-reduced-motion); empate é a roleta de sorteio girando as capas. Elementos trazidos de outros mundos: carimbos que ficam registrados, capa sempre 3:4, faixa de etapas como único eixo do tempo, stats com a prova ao lado, e membros com a mesma mobília fixa em qualquer lista.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

Sem bibliotecas de UI. Contraste AA. Foco visível. Alvos de toque de 44px. Kicker acima de título está banido. O mock escolhido está em .impeccable/mocks/locadora.html (referência para a crítica).

## Unresolved

Nenhum.
