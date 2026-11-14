---
name: Clube dos Jogos
description: A rodada do clube como a prateleira de lançamentos de uma locadora de sexta à noite.
colors:
  ground: "#1a1411"
  shelf: "#2b211c"
  edge: "#4a3a30"
  lip: "#5c4838"
  deep: "#120d0b"
  ink: "#f6efe4"
  muted: "#cdbfae"
  orange: "#ff7a1a"
  lime: "#b6f03c"
  pink: "#ff3d6e"
  amber: "#ffc36b"
  paper: "#f4ecd2"
  paper-ink: "#2a1d17"
  paper-muted: "#4f3d33"
  stamp: "#b3213f"
typography:
  display:
    fontFamily: "'Jersey 10', 'Barlow', sans-serif"
    fontSize: "clamp(3.5rem, 13vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.9
  headline:
    fontFamily: "'Jersey 10', 'Barlow', sans-serif"
    fontSize: "clamp(2.1rem, 7vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 0.9
  logo:
    fontFamily: "'Jersey 10', 'Barlow', sans-serif"
    fontSize: "2.4rem"
    fontWeight: 400
    lineHeight: 1
  title-pixel:
    fontFamily: "'Jersey 10', 'Barlow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1
  number:
    fontFamily: "'Jersey 10', 'Barlow', sans-serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1.1
    fontFeature: "tnum"
  title:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.04em"
  stamp:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.12em"
  hand:
    fontFamily: "'Permanent Marker', 'Barlow', cursive"
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
    backgroundColor: "{colors.lime}"
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
    backgroundColor: "{colors.lime}"
    textColor: "{colors.deep}"
  steps-item:
    backgroundColor: "{colors.shelf}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "9px 2px"
  steps-item-now:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.deep}"
  steps-item-done:
    textColor: "{colors.ink}"
  ficha:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
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
    backgroundColor: "rgb(26 20 17 / 0.85)"
    textColor: "{colors.lime}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  price-tag:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.deep}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  sticker:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.deep}"
    typography: "{typography.hand}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  sticker-num:
    backgroundColor: "{colors.orange}"
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
---

# Design System: Clube dos Jogos

## Overview

**Creative North Star: "Locadora de sexta"**

A interface é a prateleira de lançamentos de uma locadora numa sexta à noite. O fundo é madeira escura e fórmica; os jogos ficam de frente, em capas 3:4 apoiadas sobre o beiço da prateleira, com etiqueta de preço escrita à mão e tarja colorida. Tudo o que é "papelada" (a ficha do sócio, os bilhetinhos, as confirmações, os fatos do jogo) vira papel creme levemente girado, com tinta marrom e carimbo vermelho. O que acontece com um jogo não some: vira carimbo batido na capa.

A densidade é de balcão, não de dashboard: poucos elementos por tela, a capa é a estrela e o resto da interface abre espaço. O tempo da rodada mora num lugar só, a faixa de quatro etapas embaixo do título "FASE N". A fonte pixel aparece só onde há placa ou número (títulos, logo, notas); o texto corrido é Barlow, legível, e a letra de pincel atômico só onde alguém "escreveu à mão". O mundo recusa o "site retrô gamer" de preto com neon e pixel em tudo, e recusa cards genéricos de dashboard.

O sistema é mobile-first (390 px como referência) e se abre no PC (1280 px) sem trocar de mundo: a prateleira passa de 2 para 4 colunas e a ficha deixa de ocupar a largura toda.

**Key Characteristics:**
- Fundo marrom de prateleira com acentos fortes e raros: laranja de etiqueta, limão de destaque, rosa de tarja.
- Capas sempre 3:4, de frente, com sombra dura curta, sobre a prateleira com beiço.
- Papel creme girado (de -0.4deg a -0.8deg) para tudo que é ficha, bilhete ou confirmação.
- Estados registrados como carimbos girados (SEPARADO, SEU, VENCEDOR, SORTEADO).
- Três vozes tipográficas com papéis fixos: pixel para placa e número, Barlow para ler, marcador para o que foi escrito à mão.
- Alvos de toque de no mínimo 44 px em todo controle.

## Colors

Uma paleta de madeira escura e quente, com três acentos de etiqueta de loja e um papel creme reservado à papelada.

### Primary
- **Limão de Destaque** (lime): a ação principal (botão primário), a fase atual na faixa de etapas, o link ativo da navegação, o carimbo SEPARADO/VENCEDOR/SORTEADO, a barra mais votada, o foco sobre a prateleira, a seleção de texto e o caret. É o "aqui, agora" do sistema.

### Secondary
- **Laranja de Etiqueta** (orange): o logo, a etiqueta de preço e os adesivos de nota, os títulos de painel e de stats, as notas em número grande, as barras de contagem, o risco das etapas concluídas, o carimbo SEU e a borda tracejada do balcão do admin.

### Tertiary
- **Rosa de Tarja** (pink): a tarja de seção na capa (duração e modo, ou "Fase N" na estante), o contador da navegação, o botão de perigo, o resumo de spoiler, o avatar sem foto e o estado de erro (toast e mensagens).
- **Âmbar de Aviso** (amber): só aviso de plataforma incompatível. Não é acento de decoração.

### Neutral
- **Chão da Loja** (ground): fundo de página e da barra superior.
- **Prateleira** (shelf): o fundo da fileira de capas, painéis, linhas de lista, itens da faixa de etapas e hover de botões fantasma.
- **Fórmica** (edge): bordas de campo, divisória da barra superior, contorno de estado vazio e a base do beiço.
- **Beiço de Madeira** (lip): a tábua sob as capas e o hover de borda de campo.
- **Fundo do Estojo** (deep): fundo de campo e de capa sem imagem, cor da sombra dura, e texto sobre acentos (limão, laranja, rosa).
- **Tinta Clara** (ink): texto principal sobre a prateleira, borda do botão secundário, fundo do toast.
- **Tinta Gasta** (muted): texto secundário, metadados, etapas futuras.
- **Papel de Ficha** (paper): ficha do sócio, bilhetinho "esse é seu, calma", confirmação e fatos do jogo.
- **Tinta de Ficha** (paper-ink) e **Lápis de Ficha** (paper-muted): texto, botões e foco sobre papel.
- **Carimbo Vermelho** (stamp): carimbo da ficha, links e hover do botão primário sobre papel.

### Named Rules
**The Papel Pequeno Rule.** O papel creme só aparece em peças pequenas (ficha, bilhete, confirmação, fato). Nunca vira fundo de seção ou de página; na largura de PC a ficha para em 760 px.

**The Tinta Certa Rule.** Sobre qualquer acento (limão, laranja, rosa) o texto é deep; sobre papel, paper-ink. Texto claro nunca vai em cima de acento.

**The Foco no Papel Rule.** O anel de foco é limão (3px, offset 3px) sobre a prateleira e troca para paper-ink dentro de ficha, confirmação e fatos, porque o limão some no creme.

## Typography

**Display Font:** Jersey 10 (com Barlow, sans-serif)
**Body Font:** Barlow 400/600/700 (com system-ui)
**Hand Font:** Permanent Marker (com Barlow, cursive)

**Character:** Placa de loja em pixel para o que se lê de longe, uma sans-serif condensada e honesta para tudo o que se lê de perto, e a letra de pincel atômico do funcionário para as etiquetas. As três nunca trocam de papel.

### Hierarchy
- **Display** (Jersey 10 400, clamp(3.5rem, 13vw, 5.5rem), 0.9): o h1 de cada tela ("Fase N", "Estante", "Stats", "Balcão"), com text-wrap balance.
- **Headline** (Jersey 10 400, clamp(2.1rem, 7vw, 2.75rem), 0.9): títulos de seção (h2). O nome do jogo vencedor sobe para clamp(2.6rem, 9vw, 4rem).
- **Logo** (Jersey 10, 2.4rem, 1; 3.4rem nas telas soltas): sempre em laranja.
- **Title pixel** (Jersey 10, 1.6rem a 1.9rem, 1): título da ficha, título de painel, título de estado vazio, valor dos fatos.
- **Number** (Jersey 10, 1.5rem a 2.6rem, 1 a 1.1, tabular): notas, médias e contagens; a nota em destaque e o seletor usam laranja.
- **Title** (Barlow 700, 1.15rem, 1.25): nome do jogo no card (h3) e títulos menores.
- **Body** (Barlow 400, 1rem, 1.5): texto corrido, limitado a 68ch.
- **Label** (Barlow 700, 0.75rem, 0.04em a 0.08em, caixa alta): itens da faixa de etapas, tarja de seção, carimbo da ficha, pílula, rótulo dos fatos.
- **Stamp** (Barlow 700, 1rem, 0.12em, caixa alta): carimbo sobre a capa.
- **Hand** (Permanent Marker, 1rem a 1.25rem, 1.3): etiqueta de preço, adesivo de frase, bilhete, próxima ação na ficha.

### Named Rules
**The Número em Pixel Rule.** Número sozinho em adesivo usa Jersey 10 (o adesivo numérico); frase em adesivo usa Permanent Marker. O "1" escrito à mão parecia um parêntese.

**The Pixel Só em Placa Rule.** Jersey 10 é para título, logo e número. Texto corrido, botão e rótulo são sempre Barlow.

**The Marcador É Etiqueta Rule.** Permanent Marker só aparece em etiqueta, adesivo, bilhete e na linha "o que falta" da ficha; nunca em título, botão ou parágrafo.

## Layout

Mobile-first: os estilos base são do celular e um único ponto de quebra principal em 760 px amplia (560 px só para pares de campos lado a lado). O conteúdo fica num contêiner de 1120 px com margem lateral de 16 px; a página fecha com 64 px de respiro embaixo e seções se separam por 40 px.

A barra superior tem o logo, a navegação e o avatar; no celular a navegação desce para uma segunda linha com rolagem horizontal, no PC sobe para a mesma linha. Abaixo, o cabeçalho da página (h1 e uma linha de subtítulo em muted alinhada à base), a faixa de quatro etapas em grade de 4 colunas iguais, a ficha do sócio e então a prateleira.

A prateleira é uma grade de capas: 2 colunas no celular (espaço 22/14 px), 4 no PC (28/24 px); a versão mini tem 3 e 6. Cada fileira termina no beiço de madeira (14 px de tábua mais 6 px de borda fórmica). O jogo vencedor fica numa coluna de até 320 px ao lado das informações no PC e empilha no celular. Os fatos do jogo são uma grade de 2 colunas.

O ritmo de espaçamento usa principalmente 4, 8, 12 e 16 px dentro de componentes, com 6 e 10 px como passos de ajuste fino, e 20, 28 e 40 px entre blocos.

### Named Rules
**The Faixa Única Rule.** A faixa de fases é o único eixo do tempo: etapas concluídas riscadas em laranja, a atual em limão, as futuras em muted. Nenhuma outra barra de progresso, cronômetro ou linha do tempo.

**The Toque de 44 Rule.** Todo controle (botão, inclusive o pequeno e o fantasma, link de navegação, campo, opção marcável, resumo de spoiler, item de busca, seletor de nota) tem no mínimo 44 px de altura; botões só de ícone também têm 44 px de largura.

## Elevation & Depth

Profundidade física de loja, sem camadas de vidro. Objetos de papelão e papel apoiados na prateleira projetam uma sombra dura curta, sem desfoque, na cor deep, como se estivessem colados no fundo. Só o que "flutua" de verdade ganha sombra macia: o bilhete colado sobre a capa e o aviso (toast). Painéis e listas são planos, separados apenas pelo tom da prateleira.

### Shadow Vocabulary
- **Sombra de estojo** (`box-shadow: 0 6px 0 var(--deep)`): capas.
- **Sombra de ficha** (`box-shadow: 0 5px 0 var(--deep)`): ficha do sócio.
- **Sombra de papel solto** (`box-shadow: 0 4px 0 var(--deep)`): confirmação e fatos do jogo.
- **Sombra de adesivo** (`box-shadow: 0 3px 0 var(--deep)`): adesivos de nota.
- **Sombra de bilhete** (`box-shadow: 0 3px 6px rgb(0 0 0 / 0.45)`): o bilhete "esse é seu, calma".
- **Sombra de aviso** (`box-shadow: 0 6px 12px rgb(0 0 0 / 0.55), 0 2px 3px rgb(0 0 0 / 0.5)`): o toast.

### Named Rules
**The Sombra Dura Rule.** Capas e fichas usam sombra dura curta, só no eixo vertical e sem desfoque. É a matéria do mundo (estojo na prateleira), não decoração aplicável a painéis, botões ou listas.

**The Sombra Macia Só Flutua Rule.** Sombra com desfoque existe apenas no bilhete e no toast.

## Shapes

Formas de papelaria e de loja: retângulos de canto vivo para tudo que é objeto físico (capa, ficha, bilhete, etiqueta, adesivo, carimbo, fato, confirmação) e um arredondamento discreto de 4 px para tudo que é interface (botão, campo, painel, linha de lista, item de etapa, navegação, toast). Barras de contagem usam 2 px; contador e pílula são cápsulas; avatares são círculos com borda grossa de 3 px em ink.

Os objetos físicos ganham uma leve rotação que denuncia que foram colados à mão: ficha -0.6deg, confirmação -0.4deg, fatos alternando -0.8deg e 0.6deg, bilhete -3deg, adesivo -3deg (4deg no cabeçalho de nota), etiqueta de preço 5deg, carimbo da ficha -6deg, carimbo da capa -12deg. Componentes de interface nunca giram.

Bordas falam de estado: 2 px sólida no botão e no campo, tracejada para o que está fora do fluxo normal (balcão do admin em laranja, estado vazio em fórmica, spoiler em rosa, voto no próprio jogo em muted), 3 px em currentColor no carimbo.

### Named Rules
**The Capa 3:4 Rule.** Toda capa tem proporção 3:4 em qualquer tela, com a imagem em object-fit cover. Sem imagem, a capa mostra o nome em pixel sobre listras diagonais em deep.

## Components

### Buttons
Firmes e de contorno, como botões de balcão.
- **Shape:** canto levemente arredondado (4px), borda de 2px, altura mínima de 44px, Barlow 700.
- **Primary:** fundo e borda limão, texto deep (8px 16px). Hover vira ink.
- **Secondary:** transparente com borda e texto ink; hover preenche ink com texto deep.
- **Danger:** borda e texto rosa; hover preenche rosa.
- **Ghost:** sem borda visível, texto muted, padding lateral de 10px; hover ganha o fundo da prateleira.
- **Sobre papel:** dentro de ficha e confirmação a borda e o texto viram paper-ink; o primário é paper-ink com texto paper e o hover vai para o carimbo vermelho.
- **Hover / Active / Disabled:** transição de 120ms ease-out em fundo e cor; active desce 1px; desabilitado em opacidade 0.55 sem hover.

### Chips
- **Pílula:** limão com texto deep, Label em caixa alta, cápsula ("Marcada" na enquete de datas).
- **Contador da navegação:** cápsula rosa com texto deep; no link ativo inverte para deep com texto limão.
- **Opção marcável:** borda fórmica de 2px, 4px de raio, 44px de altura; marcada ganha borda limão e fundo limão a 12%.

### Cards / Containers
- **Painel:** fundo da prateleira, 4px de raio, 16px de padding, plano. O painel do admin é transparente com borda tracejada laranja e título em pixel laranja.
- **Linha de lista:** fundo da prateleira, 4px de raio, 10px 12px; a data confirmada ganha contorno limão de 2px.
- **Estado vazio:** borda tracejada fórmica, título grande em pixel ink e uma piada em muted.

### Inputs / Fields
- **Style:** fundo deep, borda fórmica de 2px, 4px de raio, 10px 12px, 44px de altura (textarea a partir de 96px). Rótulo em Barlow 700 acima, ajuda em muted.
- **Hover:** borda vai para o beiço (lip).
- **Focus:** contorno limão de 3px com offset de 1px e borda limão.
- **Erro:** contador estourado e mensagens em rosa 700.

### Navigation
Links em Barlow 600 a 0.95rem, muted, 8px 12px, 44px de altura, 4px de raio. Hover ganha o fundo da prateleira e texto ink; a página atual é um bloco limão com texto deep. No celular a navegação ocupa a segunda linha da barra com rolagem horizontal.

### Faixa de etapas
Quatro blocos iguais em Label caixa alta sobre a prateleira (0.85rem no PC). Concluída: texto ink riscado em laranja (2px). Atual: limão com texto deep. Futura: muted.

### Ficha do sócio
Papel creme girado -0.6deg com sombra de ficha, título em pixel, a próxima ação em letra de marcador e um carimbo vermelho de status no canto superior direito (borda de 3px, -6deg). É onde a pessoa lê o que falta ela fazer.

### Capa na prateleira
Capa 3:4 com sombra de estojo, etiqueta de preço laranja à mão no canto superior direito (5deg), tarja rosa à esquerda, nome em Title abaixo, metadados em muted e as ações empilhadas no rodapé do card. No hover do link, o nome fica limão.

### Carimbo
Texto em Stamp dentro de uma borda de 3px em currentColor, fundo ground a 85%, girado -12deg sobre a capa. Limão para SEPARADO, VENCEDOR e SORTEADO; laranja para SEU. Ao separar, o carimbo "bate" (420ms, cubic-bezier(0.16, 1, 0.3, 1), de escala 1.9 para 1); com prefers-reduced-motion a animação some.

### Bilhete e adesivo
O bilhete é papel creme à mão colado na base da capa (-3deg, sombra macia). O adesivo é a etiqueta laranja fora da capa: frase em marcador, número sozinho em pixel; o adesivo limão destaca a prova numérica de uma stat.

### Confirmação
Ficha de papel inserida logo abaixo do botão que a disparou (-0.4deg, sombra de papel solto, até 520px), com a pergunta em Barlow 700 e as ações confirmar/cancelar. O foco vai para confirmar e volta ao botão de origem ao fechar.

### Roleta do desempate
Grade de capas sobre deep; o item aceso ganha contorno limão de 3px e sobe 4px (60ms linear); o vencedor fica com fundo limão a 14% e recebe o carimbo SORTEADO.

### Toast
Bloco ink com texto deep em Barlow 700, centralizado a 16px da base, com sombra de aviso; em erro vira rosa.

## Do's and Don'ts

### Do:
- **Do** manter toda capa em 3:4, de frente, com a sombra dura curta (0 6px 0 deep).
- **Do** usar sombra dura sem desfoque em capas e peças de papel, e sombra macia só no bilhete e no toast.
- **Do** registrar estados como carimbos girados sobre a capa (SEPARADO, SEU, VENCEDOR, SORTEADO) em vez de badges ou textos que somem.
- **Do** usar Jersey 10 para número sozinho em adesivo e Permanent Marker para frase em adesivo.
- **Do** trocar o anel de foco para paper-ink sobre papel; limão no resto.
- **Do** garantir 44px mínimos em todo alvo de toque.
- **Do** confirmar ações destrutivas dentro da página, numa ficha de papel abaixo do botão.
- **Do** deixar a faixa de fases como o único indicador de tempo da rodada.
- **Do** desligar carimbo batendo e roleta com prefers-reduced-motion.

### Don't:
- **Don't** usar window.confirm, alert ou modais do navegador.
- **Don't** colocar kicker ou eyebrow (rótulo pequeno em caixa alta) acima de título.
- **Don't** criar outra barra de progresso, cronômetro ou linha do tempo além da faixa de fases.
- **Don't** usar papel creme como fundo de seção ou de página.
- **Don't** escrever texto corrido, botão ou rótulo em Jersey 10 ou Permanent Marker.
- **Don't** pôr texto claro sobre limão, laranja ou rosa.
- **Don't** aplicar sombra (dura ou macia) em painel, lista ou botão.
- **Don't** cair no "retrô gamer" de preto com neon e pixel em tudo, nem em cards genéricos de dashboard.
- **Don't** usar ícones de fonte ou glifos; ícones são SVG próprios em grade 24x24, sem curvas, em currentColor.
