---
name: Clube dos Jogos
description: Sexta à noite no quarto gamer retrô: o jogo alugado da locadora, na prateleira e na TV de tubo, sob luz baixa.
colors:
  ground: "#140b10"
  shelf: "#1e1218"
  wood: "#3b2417"
  lip: "#6b4a2f"
  edge: "#7a6153"
  deep: "#0c0609"
  ink: "#f3e6d8"
  muted: "#c9b5a8"
  amber: "#ffc15e"
  pink: "#ff5c8a"
  teal: "#46c3b5"
  paper: "#f4ecd2"
  paper-ink: "#2a1d17"
  paper-muted: "#4f3d33"
  stamp: "#b3213f"
typography:
  display:
    fontFamily: "'Bebas Neue', 'Atkinson Hyperlegible Next', sans-serif"
    fontSize: "clamp(3.25rem, 12vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.04em"
  headline:
    fontFamily: "'Bebas Neue', 'Atkinson Hyperlegible Next', sans-serif"
    fontSize: "clamp(2rem, 6.5vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.04em"
  title-plate:
    fontFamily: "'Bebas Neue', 'Atkinson Hyperlegible Next', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.05em"
  number:
    fontFamily: "'Bebas Neue', 'Atkinson Hyperlegible Next', sans-serif"
    fontSize: "1.8rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
  title:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
  stamp:
    fontFamily: "'Atkinson Hyperlegible Next', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.12em"
  typed:
    fontFamily: "'Special Elite', 'Atkinson Hyperlegible Next', monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.35
  hand:
    fontFamily: "'Permanent Marker', 'Atkinson Hyperlegible Next', cursive"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  none: "0px"
  bar: "2px"
  sm: "4px"
  pill: "999px"
  round: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  gutter: "16px"
  lg: "20px"
  xl: "28px"
  section: "40px"
  page-end: "64px"
  max: "1120px"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.deep}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.pink}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "44px"
  button-danger-hover:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.shelf}"
    textColor: "{colors.ink}"
  button-paper-primary:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "44px"
  button-paper-primary-hover:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "44px"
  nav-link-active:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
  steps-item:
    backgroundColor: "{colors.shelf}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "9px 2px"
  steps-item-now:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
  steps-item-done:
    textColor: "{colors.ink}"
  ficha:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.typed}"
    rounded: "{rounded.none}"
    padding: "16px 16px 18px"
  confirm:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  cover:
    backgroundColor: "{colors.deep}"
    rounded: "{rounded.none}"
    width: "100%"
  stamp-mark:
    backgroundColor: "rgb(20 11 16 / 0.85)"
    textColor: "{colors.amber}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  price-tag:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  sticker:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  sticker-num:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.deep}"
    typography: "{typography.number}"
    rounded: "{rounded.none}"
    padding: "2px 10px 0"
  note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  section-tag:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.deep}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  panel:
    backgroundColor: "{colors.shelf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.deep}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  toast-error:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.deep}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
---

# Design System: Clube dos Jogos

> Direção definitiva. Consulta visual mais funda (luz, TV, neon, props, receitas de CSS/SVG, contraste, direitos):
> `Estetica/DOSSIE.md`. Este arquivo manda; o dossiê explica e dá receitas.

## Overview

**Creative North Star: "Sexta no quarto"**

É sexta à noite: o jogo alugado da locadora chegou ao quarto. O ambiente é um quarto gamer retrô às escuras, onde a
luz vem só de coisas que existem na cena (a TV de tubo, o abajur, a lâmpada de lava, um letreiro de neon) e quase
tudo fica em sombra tingida de vinho. Dentro do quarto vivem os objetos da locadora: a prateleira de madeira com as
capas de frente, a etiqueta de preço escrita à mão, a ficha de sócio datilografada, os bilhetinhos de papel e os
carimbos. Tudo o que é "papelada" é papel creme levemente girado com tinta marrom e carimbo vermelho. O que acontece
com um jogo não some: vira carimbo na capa.

A densidade é de balcão, não de dashboard: poucos elementos por tela, a capa é a estrela e o resto abre espaço. A
luz é atmosfera, nunca interface: **texto só vive em superfície sólida**, e efeito (brilho, grão, vinheta) fica na
cena, atrás de tudo. O tempo da rodada mora num lugar só, a faixa de quatro etapas embaixo do título "FASE N". O mundo
recusa o "site gamer" de preto chapado com neon em tudo e fonte pixel em tudo, recusa vaporwave, Y2K, Frutiger Aero,
cyberpunk e terror analógico, e recusa cards genéricos de dashboard. Neon é **um** letreiro, não o tema.

Mobile-first (390 px de referência), abre-se no PC (1280 px) sem trocar de mundo: a prateleira passa de 2 para 4
colunas e a ficha deixa de ocupar a largura toda.

**Key Characteristics:**
- Parede e sombra com matiz (vinho, nunca preto puro); acentos raros e saturados só onde há luz: âmbar de abajur, rosa de neon, teal de TV.
- Luz motivada: cada brilho pertence a um objeto desenhado; uma luz dominante (a TV), as outras apoiam.
- Capas sempre 3:4, de frente, sobre prateleira de madeira com beiço; sombra dura curta nos objetos.
- Papel creme girado para tudo que é ficha, bilhete, etiqueta ou confirmação; estados registrados como carimbos girados.
- Quatro vozes tipográficas com papéis fixos: Bebas Neue para placa e número, Atkinson para ler, Special Elite para o datilografado, marcador para o escrito à mão.
- Alvos de toque de no mínimo 44 px em todo controle.

## Colors

Madeira e sombra de vinho com três cores de luz, mais um papel creme reservado à papelada. Fundo entre `#0B0F14` e
`#160B17`, nunca `#000`. Proporção da tela: ~90% sombra e madeira, ~8% luz de apoio, 2–5% acento saturado.

### Primary
- **Âmbar de Abajur** (amber): "aqui, agora". Botão primário, fase atual na faixa de etapas, link ativo da navegação, carimbos SEPARADO/VENCEDOR/SORTEADO, barra mais votada, foco, seleção de texto e caret, e também a etiqueta de preço e os adesivos (é a mesma luz quente de locadora).

### Secondary
- **Rosa de Neon** (pink): o letreiro do clube (único neon), a tarja de seção na capa, o contador da navegação, o botão de perigo, o carimbo SEU, o resumo de spoiler, o avatar sem foto, o aviso de plataforma incompatível (com ícone) e o estado de erro.
- **Teal de TV** (teal): a luz fria da TV. Barras de contagem, etapas concluídas (riscadas), títulos de painel e de stats, links, a poça de luz da cena e o brilho do vidro da TV. Nunca em botão.

### Neutral
- **Parede** (ground): fundo de página e da barra superior.
- **Prateleira** (shelf): painéis, linhas de lista, itens da faixa de etapas, hover de botão fantasma.
- **Madeira** (wood): corpo do rack e das tábuas.
- **Beiço de Madeira** (lip): a borda iluminada da tábua sob as capas.
- **Fórmica** (edge): bordas de campo, divisória da barra, contorno de estado vazio (≥ 3:1 contra parede e painel).
- **Fundo do Estojo** (deep): fundo de campo e de capa sem imagem, cor da sombra dura e **texto sobre acento** (âmbar, rosa, teal).
- **Tinta Clara** (ink): texto principal, borda do botão secundário, fundo do toast.
- **Tinta Gasta** (muted): texto secundário, metadados, etapas futuras.
- **Papel de Ficha** (paper): ficha do sócio, bilhetinho, confirmação, fatos do jogo, etiqueta de lombada.
- **Tinta de Ficha** (paper-ink) e **Lápis de Ficha** (paper-muted): texto, botões e foco sobre papel.
- **Carimbo Vermelho** (stamp): carimbo da ficha, links e hover do botão primário sobre papel.

### Materiais da cena (não são tokens de interface)
Objetos desenhados em CSS/SVG têm cores de material próprias, sempre presas ao objeto: a rampa de madeira do móvel
(`--wood-1` #22140c → `--wood-5` #8c6646, `wood` e `lip` dentro dela), o plástico bege e o vidro teal da TV, o grafite do
console e do controle, o arco-íris do CD, a cortiça do quadro e o metal da coroa do vencedor. **Metais** (intencionais):
ouro #e3b341 (brilho #fff0b0, sombra #8a6312), prata #c4c9d1 (#f4f6fa / #6e737c) e bronze #c27a43 (#f2c08e / #6d3f1c),
só em troféus e na coroa. A capa genérica usa 8 paletas por hash do nome. Nada disso vira cor de texto, botão ou estado.

### Named Rules
**The Papel Pequeno Rule.** O papel creme só aparece em peças pequenas (ficha, bilhete, confirmação, fato, etiqueta). Nunca vira fundo de seção ou de página; na largura de PC a ficha para em 760 px.

**The Tinta Certa Rule.** Sobre qualquer acento (âmbar, rosa, teal) o texto é deep; sobre papel, paper-ink. Texto claro nunca vai em cima de acento.

**The Foco no Papel Rule.** O anel de foco é âmbar (3px, offset 3px) sobre a parede e troca para paper-ink dentro de ficha, confirmação e fatos.

**The Uma Luz Rule.** A TV (teal) manda; abajur (âmbar) e neon (rosa) apoiam e ocupam pouco. Nunca acender tudo com a mesma força nem usar arco-íris de neons. Cor de luz é ambiente: nunca informa estado (estado é texto, forma ou ícone).

## Typography

**Display Font:** Bebas Neue (com Atkinson Hyperlegible Next, sans-serif)
**Body Font:** Atkinson Hyperlegible Next 400/700/800 (com system-ui)
**Typed Font:** Special Elite (máquina de escrever)
**Hand Font:** Permanent Marker (com Atkinson, cursive)

**Character:** Placa de locadora em caixa-alta condensada para o que se lê de longe, uma sans de alta legibilidade
para tudo o que se lê de perto, a máquina de escrever da ficha do sócio e o pincel atômico do funcionário nas
etiquetas. As quatro nunca trocam de papel. As fontes são hospedadas no próprio domínio (arquivos `.woff2` + licença).

### Hierarchy
- **Display** (Bebas Neue, clamp(3.25rem, 12vw, 5rem), 0.95, 0.04em): h1 de cada tela ("FASE N", "ESTANTE", "STATS", "BALCÃO"), com text-wrap balance.
- **Headline** (Bebas Neue, clamp(2rem, 6.5vw, 2.6rem), 0.95): títulos de seção (h2). O nome do jogo vencedor sobe para clamp(2.6rem, 9vw, 4rem).
- **Title plate** (Bebas Neue, 1.5rem a 1.9rem, 1, 0.05em): título da ficha, de painel e de estado vazio, nome na etiqueta de lombada, valor dos fatos.
- **Number** (Bebas Neue, 1.5rem a 2.6rem, 1, tabular): notas, médias e contagens; a nota em destaque e o seletor usam âmbar.
- **Title** (Atkinson 700, 1.15rem, 1.25): nome do jogo no card (h3) e títulos menores.
- **Body** (Atkinson 400, 1rem, 1.5): texto corrido, limitado a 68ch.
- **Meta** (Atkinson 400, 0.875rem, 1.3): metadados curtos (ano · gênero, quem sugeriu, contagens, rodapé). Nada menor que 0.75rem.
- **Label** (Atkinson 700, 0.75rem, 0.06em, caixa alta): itens da faixa de etapas, tarja de seção, pílula, rótulo dos fatos.
- **Stamp** (Atkinson 800, 1rem, 0.12em, caixa alta): carimbo sobre a capa.
- **Typed** (Special Elite, 0.95rem, 1.35): corpo da ficha do sócio, linhas da etiqueta (plataforma · quem sugeriu), "SUGERIDO POR".
- **Hand** (Permanent Marker, 1rem a 1.25rem, 1.3): etiqueta de preço, adesivo de frase, bilhete, próxima ação na ficha.

### Named Rules
**The Placa Só em Placa Rule.** Bebas Neue é para título, logo, nome na etiqueta e número. Texto corrido, botão e rótulo são sempre Atkinson. Fonte pixel não faz parte do sistema.

**The Número em Bebas Rule.** Número sozinho em adesivo usa Bebas Neue; frase em adesivo usa Permanent Marker. O "1" escrito à mão parece parêntese.

**The Datilografado É Papel Rule.** Special Elite só aparece sobre papel (ficha, etiqueta, bilhete) e em texto curto; Permanent Marker só em etiqueta, adesivo, bilhete e na linha "o que falta" da ficha. Nunca em título, botão ou parágrafo.

## Layout

Mobile-first: os estilos base são do celular e um único ponto de quebra principal em 760 px amplia (560 px só para
pares de campos lado a lado). O conteúdo fica num contêiner de 1120 px com margem lateral de 16 px; a página fecha
com 64 px de respiro embaixo e seções se separam por 40 px.

A barra superior tem o letreiro, a navegação e o avatar; no celular a navegação desce para uma segunda linha com
rolagem horizontal, no PC sobe para a mesma linha. Abaixo, o cabeçalho da página (h1 e uma linha de subtítulo em
muted), a faixa de quatro etapas em grade de 4 colunas iguais, a ficha do sócio e então a prateleira.

A prateleira é uma grade de capas: 2 colunas no celular (espaço 22/14 px), 4 no PC (28/24 px); a versão mini tem 3 e
6. Cada fileira termina no beiço de madeira (14 px de tábua mais 6 px de borda). O jogo vencedor fica numa coluna de
até 320 px ao lado das informações no PC e empilha no celular. Ritmo de espaçamento: 4, 8, 12 e 16 px dentro de
componentes, 20, 28 e 40 px entre blocos.

### Named Rules
**The Faixa Única Rule.** A faixa de fases é o único eixo do tempo: etapas concluídas riscadas em teal, a atual em âmbar, as futuras em muted. Nenhuma outra barra de progresso, cronômetro ou linha do tempo. A luz da cena pode mudar com a fase (votação: TV forte; jogando: abajur aceso), mas isso é clima, nunca indicador.

**The Toque de 44 Rule.** Todo controle (botão, inclusive o pequeno e o fantasma, link de navegação, campo, opção marcável, resumo de spoiler, item de busca, seletor de nota) tem no mínimo 44 px de altura; botões só de ícone também têm 44 px de largura.

## Elevation & Depth

Dois regimes. **Objetos** (papelão e papel apoiados na prateleira) projetam sombra dura curta, sem desfoque, na cor deep. **Luz** é a cena: poças de gradiente, vinheta e grão, sempre atrás da interface. Painéis e listas são planos, separados pelo tom. Só o que flutua de verdade (bilhete sobre a capa, toast) ganha sombra macia.

### Shadow Vocabulary
- **Sombra de estojo** (`box-shadow: 0 6px 0 var(--deep)`): capas.
- **Sombra de ficha** (`0 5px 0 var(--deep)`), **de papel solto** (`0 4px 0`), **de adesivo** (`0 3px 0`).
- **Sombra de bilhete** (`0 3px 6px rgb(0 0 0 / 0.45)`) e **de aviso** (`0 6px 12px rgb(0 0 0 / 0.55), 0 2px 3px rgb(0 0 0 / 0.5)`, toast).

### A cena (luz e filme)
Camadas irmãs da interface, `position: fixed/absolute; inset: 0; pointer-events: none; aria-hidden`, da mais funda para a mais alta: **parede** (fundo e, opcional, xadrez escuro de baixíssimo contraste) → **poça de luz** (gradientes radiais locais: TV teal alta e à direita, abajur âmbar baixo e à esquerda; queda ~1/d², `screen`) → **brilho do letreiro** (halo rosa só em volta do letreiro) → **grão** (SVG `feTurbulence` como imagem estática, ≤ 8%) → **vinheta** (cantos 35–60%). A interface fica acima, fora de qualquer blend, em superfícies sólidas.
- TV de tubo é objeto CSS 3D (carcaça, tubo do CRT atrás e rack com tampo, girados ~26° para o centro da página; no PC acompanha o olhar com o parallax da parede). Brilho e poeira ficam fora da cadeia 3D.
- Tela de TV (vencedor e fase jogando): vidro abaulado (raio ~9%/12%), vinheta interna, reflexo, **scanlines só ali** (6–15%), brilho teal local, conteúdo com a arte do jogo da rodada ou um cartaz "FASE N · nome".
- Orçamento: no máximo 3 camadas de blend em tela cheia no PC e 2 no celular (preferir 1 camada com vários gradientes); só `transform` e `opacity` animam; nada de animar `box-shadow`, `text-shadow`, `filter` ou blur.
- Halo ou grão atrás de texto: ≤ 15%. Meça o contraste na página renderizada.

### Named Rules
**The Sombra Dura Rule.** Capas e papéis usam sombra dura curta, só no eixo vertical e sem desfoque. É a matéria do mundo, não decoração para painéis, botões ou listas.

**The Sombra Macia Só Flutua Rule.** Sombra com desfoque existe apenas no bilhete e no toast.

**The Texto Sólido Rule.** Texto de interface nunca fica sobre halo forte, grão, scanline ou vinheta: vive em painel, papel, etiqueta ou parede quase lisa. Efeitos só na cena e dentro do vidro da TV.

**The Sem Filtro no 3D Rule.** Luz, glow, grão e vinheta nunca são pai nem o próprio elemento da prateleira 3D (nem da TV 3D): `opacity < 1`, `filter`, `mix-blend-mode`, `isolation`, `mask` e `clip-path` numa cadeia `preserve-3d` achatam o 3D.

**The Movimento Opcional Rule.** Respiração da TV, poeira, lava e parallax são lentos e sutis (flicker nunca acima de 3 vezes por segundo, ciclo ≥ 5 s) e desligam com `prefers-reduced-motion`; `prefers-contrast: more` só remove grão, scanlines, aberração e brilho (não mexe no movimento). Carimbo e etiqueta VOTADO deixam de "bater" em reduced-motion e surgem num fade de 160 ms; o sorteio pula direto para o resultado.

**The Sorteio Rule.** Exceção consciente, só na sequência de fechar a votação (`src/views/sorteio.js`): ali vale elástico (mola amortecida, `elastico()` em `src/lib/motion.js`) e o vidro da TV racha e estoura. Fora dela o movimento continua sem overshoot e tela quebrada continua proibida. Mesmo ali: um clarão âmbar só (nunca branco de tela cheia), estática a 40% de opacidade, barras RGB que deslizam em vez de piscar, texto só em faixa ou placa deep; `prefers-contrast: more` tira halo, clarão, barras e fumaça.

## Shapes

Formas de papelaria e de loja: retângulos de canto vivo para tudo que é objeto físico (capa, ficha, bilhete, etiqueta, adesivo, carimbo, fato, confirmação) e 4 px para tudo que é interface (botão, campo, painel, linha, item de etapa, navegação, toast). Barras de contagem 2 px; contador e pílula são cápsulas; avatares são círculos com borda de 3 px em ink. A TV é a única forma abaulada.

Os objetos físicos ganham leve rotação, como se fossem colados à mão: ficha -0.6deg, confirmação -0.4deg, fatos alternando -0.8deg e 0.6deg, bilhete -3deg, adesivo -3deg (4deg no cabeçalho de nota), etiqueta de preço 5deg, carimbo da ficha -6deg, carimbo da capa -12deg. Componentes de interface nunca giram.

Bordas falam de estado: 2 px sólida no botão e no campo, tracejada para o que está fora do fluxo (balcão do admin em teal, estado vazio em fórmica, spoiler em rosa, voto no próprio jogo em muted), 3 px em currentColor no carimbo.

### Named Rules
**The Capa 3:4 Rule.** Toda capa tem proporção 3:4, imagem em object-fit cover. Sem imagem, a capa é uma **caixa genérica por código**: cor por hash do nome (8 a 10 tons das paletas), três faixas diagonais, um motivo geométrico e o nome em Bebas Neue. Capas reais (RAWG) são o conteúdo; capas e logos de jogos reais também podem decorar a cena.

## Components

### Buttons
Firmes e de contorno, como botões de balcão.
- **Shape:** canto de 4px, borda de 2px, altura mínima de 44px, Atkinson 700.
- **Primary:** fundo e borda âmbar, texto deep (8px 16px). Hover vira ink.
- **Secondary:** transparente com borda e texto ink; hover preenche ink com texto deep.
- **Danger:** borda e texto rosa; hover preenche rosa.
- **Ghost:** sem borda visível, texto muted, hover ganha o fundo da prateleira.
- **Sobre papel:** borda e texto paper-ink; o primário é paper-ink com texto paper e hover no carimbo vermelho.
- **Estados:** transição de 120ms ease-out em fundo e cor; active desce 1px; desabilitado em opacidade 0.55 sem hover.

### Chips
- **Pílula:** âmbar com texto deep, Label em caixa alta ("Marcada").
- **Contador da navegação:** cápsula rosa com texto deep; no link ativo inverte para deep com texto âmbar.
- **Opção marcável:** borda fórmica de 2px, 4px de raio, 44px de altura; marcada ganha borda âmbar e fundo âmbar a 12%.
- **Estado de jogo:** chip de papel com **texto + ícone** (EM VOTAÇÃO, JOGANDO, ZERADO, CALL MARCADA), nunca só cor.

### Cards / Containers
- **Painel:** fundo da prateleira, 4px de raio, 16px de padding, plano; título em Bebas teal. O do admin é transparente com borda tracejada teal.
- **Linha de lista:** fundo da prateleira, 4px de raio; a data confirmada ganha contorno âmbar de 2px.
- **Estado vazio:** borda tracejada fórmica, título grande em Bebas ink e uma piada em muted.

### Inputs / Fields
Fundo deep, borda fórmica de 2px, 4px de raio, 44px de altura (textarea a partir de 96px). Rótulo em Atkinson 700 acima, ajuda em muted. Hover: borda no beiço. Focus: contorno âmbar de 3px com offset de 1px. Erro: contador estourado e mensagens em rosa 700.

### Navigation
Links em Atkinson 600 a 0.95rem, muted, 44px de altura, 4px de raio. Hover ganha o fundo da prateleira e texto ink; a página atual é um bloco âmbar com texto deep. Antes da barra, o link "Pular pro conteúdo" (âmbar) só aparece com foco de teclado.

### Letreiro do clube
O logo é um letreiro de neon rosa "CLUBE DOS JOGOS" em SVG próprio (um traço contínuo por letra, núcleo quase branco, glow em 2 a 3 camadas, tubo apagado, grampos e fio atrás), `role="img"` com `aria-label`. É o único neon do sistema. Pisca no máximo uma letra a cada 20–40 s, só por `opacity`, e não pisca em reduced-motion. Variantes por estado ("VOTAÇÃO ABERTA", "JOGANDO") só por texto.

### Faixa de etapas
Quatro blocos iguais em Label caixa alta sobre a prateleira (0.85rem no PC), com no mínimo 8px de respiro lateral no texto. Concluída: ink riscado em teal (2px). Atual: âmbar com texto deep. Futura: muted. Onde os quatro não cabem numa linha com esse respiro (celular abaixo de 440px; PC estreito em que a faixa divide a linha com a TV), viram uma grade 2×2 lida em Z, sem encolher a letra.

### Ficha do sócio
Papel creme girado -0.6deg com sombra de ficha, título em Bebas, texto em Special Elite, a próxima ação em letra de marcador e um carimbo vermelho de status no canto superior direito (borda de 3px, -6deg). É onde a pessoa lê o que falta ela fazer, e o botão primário (paper-ink) logo abaixo leva até onde isso acontece
(abrir a caixinha da sugestão, ir aos tickets, ao slider de nota, ao calendário ou ao quadro); na mesa 3D o mesmo botão
fica no bilhete "o que falta". "Copiar mensagem" é só do admin.

### Prateleira 3D (sugerindo, votando, estante)
O móvel de madeira com nichos em perspectiva (um ponto de fuga por coluna; 2 colunas no celular, 4 no PC) e, em cima,
props decorativos (abajur, consoles, capinhas deitadas). Cada jogo é um **estojo de 6 faces** em pé (capa 3:4, lombada com o
nome); no PC a caixa endireita no hover/foco e o reflexo segue o ponteiro. Embaixo do beiço, um **post-it de papel creme**
(nome à mão + metadados) e as ações. Na votação o voto é um **ticket** (canhoto | picote | corpo): votar rasga o corpo, que
cai, e a etiqueta VOTADO cola na capa; o canhoto que sobra desfaz. O próprio jogo tem o ticket anulado e o bilhete
"esse é seu, calma". Em sugerindo/votando, recado que a pessoa ainda não viu vira um **balão de fala** de papel no canto
de cima da capinha, com as fotinhas de quem comentou (até 3, +N), dando um pulinho de vez em quando; some ao abrir a caixinha. Área com rolagem dentro de `preserve-3d` rola por `rolaNaMao` (`src/lib/motion.js`).

### Caixinha
Clicar na capinha tira o estojo do nicho num arco até o centro; a tampa destrava e gira na dobradiça; o **manual** (papel)
fica no verso e o **CD** gira na bandeja. Leitura: o manual traz pitch, ano, gênero, duração, modo, preço e plataformas
(cabem sem rolar por dentro); na votação a caixinha tem "Votar nesse" / "Votado · desfazer" (menos no jogo da própria pessoa).
Com trailer, o vídeo do YouTube (moldura escura 16:9, legenda TRAILER) entra do lado da caixinha aberta no PC e embaixo no
celular. Embaixo, os **recados** são post-its coloridos (amarelo, rosa, teal, laranja, lilás) tortinhos com fita, texto à mão,
fotinha e nome de quem escreveu; o formulário de recado fica num papel creme.
Sugestão: a caixinha vira o formulário em dois passos (capa: nome + imagem; manual: o resto); ao finalizar a tampa fecha,
tarja e preço aparecem, o carimbo SEU bate e a caixa volta pro nicho.

### Mesa 3D (jogando, encerrada)
No lugar do h1 "FASE N", uma **faixa de pano** vermelha pendurada ("Jogo escolhido" / "Encerrado") e um bilhete com o que
falta. A mesa é CSS 3D puro (caixas de faces, câmera que acompanha o mouse no PC): abajur aceso (a luz dominante), capinha do
vencedor com a coroa, console e controle. No jogando: **calendário** de mesa (a folha voa pra frente e os dias oferecidos são
circulados), a capinha em pé **em cima do videogame**, **estatuetas** de quem zerou (pedestal de pedra, boneco de metal na cor
da posição: ouro, prata, bronze e metais próprios; a cabeça é a foto, sempre virada pra câmera; recado em balãozinho) numa
**prateleira de parede** atrás da mesa (uma vaga por sócio; o 1º no meio, 2º à esquerda, 3º à direita), em pódio:
o 1º bem maior, de coroa, raios dourados girando, holofote e brilhos; 2º e 3º com aura e metal que brilha. Caem do céu
com squash, a tábua sacode e a glória do pódio explode no impacto; clicar numa estatueta traz ela pra frente com a foto de prova, o **botão ZEREI** de fliperama na ponta e o **quadro de jogando** grande à direita (post-its coloridos com
comentários curtos, rabiscos e fotos; 3 páginas, a setinha gira o quadro meia volta e ele volta na outra página). Na
encerrada o **quadro de cortiça** da resenha, onde cada nota vira uma página de caderno pregada, e o quadro de jogando guardado
ao lado. Cliques em botões reais (.alvo, ≥ 44px) por cima da projeção. Finalizar a encerrada faz tudo da mesa voar pra cima.

### Capa na prateleira (versão plana)
Capa 3:4 com sombra de estojo apoiada no beiço de madeira (rack escuro, tábuas com veio sutil), etiqueta de preço âmbar à mão no canto superior direito (5deg), tarja rosa à esquerda, nome em Title abaixo, metadados em muted e as ações empilhadas no rodapé. A etiqueta de lombada de locadora (papel, título Bebas, plataforma e quem sugeriu em Special Elite, "LOCAÇÃO 2 DIAS" como piada de interface) é usada onde a capa não aparece. Hover do link: nome em âmbar.

### Carimbo
Texto em Stamp dentro de borda de 3px em currentColor, fundo ground a 85%, girado -12deg sobre a capa. Âmbar para VENCEDOR e SORTEADO; rosa para SEU. O voto não é carimbo: vira a **etiqueta VOTADO** (papel com filete vermelho, Bebas
em stamp, ponta descolando) que cola na capa quando o ticket rasga. Ao aparecer, o carimbo "bate" (420ms, cubic-bezier(0.16, 1, 0.3, 1), escala 1.9 para 1); em reduced-motion vira um fade de 160 ms.

### Bilhete e adesivo
O bilhete é papel creme à mão colado na base da capa (-3deg, sombra macia). O adesivo é a etiqueta âmbar fora da capa: frase em marcador, número sozinho em Bebas; o adesivo teal destaca a prova numérica de uma stat. Selos genéricos (estrela ZERADO, chama MAIS VOTADO): SVG inline, formas sem mascote.

### Confirmação
Ficha de papel inserida logo abaixo do botão que a disparou (-0.4deg, sombra de papel solto, até 520px), com pergunta em Atkinson 700 e ações confirmar/cancelar. O foco vai para confirmar e volta ao botão de origem ao fechar.

### Sorteio do fechamento
Overlay de tela cheia (fora do `#app`) com halo âmbar/rosa girando devagar e confete âmbar, rosa e papel em canvas. Vencedor único: a capa cresce com elástico, carimbo VENCEDOR. Empate: as capas (2 a 12) entram em evidência, voam em arco para um clone 2D da TV, a TV chia (glitch ~1,4 s) e mostra a roleta de cassino no vidro (fatias iguais com as capas, aro dourado com pinos, cubo e ponteiro rosa que bate nos pinos; o nome sob o ponteiro aparece no OSD, faixa deep); ela gira ~6 s e para exatamente no sorteado, que já foi gravado. O vidro racha e estoura em cacos, e o sorteado sai por ele com carimbo SORTEADO. Nos dois casos a capa termina voando até a capinha da mesa. Em reduced-motion: evidência → resultado → Finalizar.

### Toast
Bloco ink com texto deep em Atkinson 700, centralizado a 16px da base, com sombra de aviso; em erro vira rosa, dura 8 s (4 s os outros) e some ao toque. O balão é `aria-hidden`: o leitor de tela ouve as regiões `#toast-status` e `#toast-alert` (erro), sempre no DOM.

## Do's and Don'ts

### Do:
- **Do** manter a luz motivada: cada brilho tem um objeto dono (TV, abajur, lava, letreiro, janela).
- **Do** manter toda capa em 3:4, de frente, com sombra dura curta, sobre o beiço de madeira.
- **Do** registrar estados como carimbos girados sobre a capa (SEPARADO, SEU, VENCEDOR, SORTEADO) em vez de badges que somem.
- **Do** manter a locadora viva nos objetos e no texto: etiqueta de preço, ficha datilografada, "LOCAÇÃO 2 DIAS", "REBOBINE", carteirinha.
- **Do** usar logos, consoles, jogos e personagens reais à vontade (projeto pessoal, sem fins comerciais); props genéricos desenhados em CSS/SVG servem de reserva.
- **Do** trocar o anel de foco para paper-ink sobre papel; âmbar no resto.
- **Do** garantir 44px mínimos em todo alvo de toque e 4,5:1 em todo texto (medido com a cena renderizada).
- **Do** confirmar ações destrutivas dentro da página, numa ficha de papel abaixo do botão.
- **Do** deixar a faixa de fases como o único indicador de tempo da rodada.
- **Do** desligar movimento e efeitos com prefers-reduced-motion e prefers-contrast.

### Don't:
- **Don't** usar window.confirm, alert ou modais do navegador.
- **Don't** colocar kicker ou eyebrow (rótulo pequeno em caixa alta) acima de título.
- **Don't** criar outra barra de progresso, cronômetro ou linha do tempo além da faixa de fases.
- **Don't** usar papel creme como fundo de seção ou de página.
- **Don't** escrever texto corrido, botão ou rótulo em Bebas Neue, Special Elite ou Permanent Marker.
- **Don't** pôr texto claro sobre âmbar, rosa ou teal, nem texto de interface sobre halo, grão ou scanline.
- **Don't** aplicar sombra (dura ou macia) em painel, lista ou botão.
- **Don't** usar preto puro, pixel em tudo, mais de um neon, nem arco-íris de luzes; nada de vaporwave, Y2K, Frutiger Aero, cyberpunk ou terror analógico (vidro translúcido, cromo, bolhas, pastel rosa-ciano, tela quebrada fora do sorteio).
- **Don't** pôr filtro, blend, máscara ou opacidade na cadeia da prateleira 3D.
- **Don't** piscar luz mais de 3 vezes por segundo nem deixar movimento correr sem como desligar.
- **Don't** usar ícones de fonte ou glifos; ícones são SVG próprios em grade 24x24, sem curvas, em currentColor.
