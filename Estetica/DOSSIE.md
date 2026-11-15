# Dossiê visual: quarto gamer retrô com resquícios de locadora

**Leia só para consulta visual** (criar/redesenhar tela ou componente, cena, luz, efeito, paleta, fonte, ilustração
SVG, prop, texto de interface com clima). Para lógica, dados, rules, bugs e ajustes já cobertos pelo `DESIGN.md`,
não leia. **O `DESIGN.md` manda** (tokens e regras); este arquivo traz o porquê e as receitas.

- Versão enxuta do dossiê de pesquisa (14/11/2026). O original (1.695 linhas, 260 fontes, história da nostalgia
  brasileira, glossário, biblioteca de referências) está em `Estetica/arquivo/`: **não ler por padrão**; abrir
  só para checar a fonte de uma afirmação (ids A/B/C/D → `arquivo/referencias.csv`).
- As 6 imagens de referência do dono (`Área de Transferência*.png`) também estão em `arquivo/`: servem só de
  clima (têm marcas e personagens); nunca embutir nem traçar.
- Etiquetas: **[v]** verificado em fonte aberta · **[j]** julgamento de direção de arte · **[c]** calculado.
  **Todo código abaixo é não testado**: validar no navegador (celular real) antes de virar padrão.
- Decisão do dono: esta é a estética definitiva, **mantendo a locadora** como camada de objetos e linguagem.
- **Decisão do dono (propriedade intelectual): pode usar logotipos de marcas, consoles, jogos, personagens, pôsteres
  e referências reais.** É projeto pessoal entre amigos, sem fins comerciais. Onde este arquivo diz "genérico",
  "original" ou "fictício", é uma **opção de estilo**, não uma exigência (ver §12 para o que ainda vale).

---

## 1. Alvo

Um **quarto escuro onde a luz vem de coisas que existem na cena** (TV de tubo, abajur, lava, neon, janela), com
~90% de sombra tingida, ~8% de luz de apoio e 2–5% de neon saturado, coberto de objetos pessoais e leve desgaste
analógico. A **locadora** entra como o que está dentro do quarto: caixas alugadas, etiqueta de preço, ficha de
sócio datilografada, carimbo, "LOCAÇÃO 2 DIAS". História em uma frase: *sexta à noite, o jogo alugado vai para
a TV do quarto.*

Nome de trabalho: **retro gaming room + iluminação low-key motivada + acento retrowave** (não há rótulo único
consagrado na comunidade) [v].

### Fronteiras: o que evitar e como não cair
| Vizinho | Por que não | Como não cair |
|---|---|---|
| Vaporwave | pastel rosa-ciano, mármore, texto japonês, ironia | sem gradiente pastel, sem estátua, sem janela de Windows 95; neon só sobre fundo escuro |
| Y2K / Frutiger Aero | translúcido, cromo, bolhas, vidro brilhante, céu e natureza | plástico **opaco** bege/cinza, madeira e papelão; nada de botão "gel"; é noite, não dia |
| Cyberpunk / neon noir | megacidade, chuva, distopia, isolamento | neon é placa pequena dentro do quarto; tom de aconchego entre amigos |
| Dark academia | vela, livro, tweed, couro | caixa de jogo e CRT no lugar de livro e vela |
| Analog horror / liminal | fita sem rótulo, tela quebrada, espaço vazio | imperfeição **calorosa**; quarto vivido, com dono e gente |
| Retrowave (aceito só como acento) | paisagem, carro, sol listrado | um letreiro, uma fita de LED, um pôster; nunca o tema do site |
| Kidcore | cores primárias saturadas | paleta escura e dessaturada |

---

## 2. Luz

**Princípio: luz motivada.** Cada gradiente de luz pertence a um objeto desenhado (TV, abajur, lava, letreiro,
janela); luz sem dono parece filtro [v]. A luz de reforço tem a **mesma cor** e a **direção** da fonte [v].
**Low-key:** sombras fortes e pouco preenchimento (~8:1), mas nunca preto `#000`: preto tingido (vinho/azul-noite)
com ~10–15% de preenchimento frio para os contornos não sumirem [v/j].

| Fonte | Cor/papel | Como fazer |
|---|---|---|
| TV de tubo (chave, dominante) | azul-petróleo/teal frio, difusa; ilumina móvel e rosto por baixo; núcleo `#E8F6FF`, halo `#46C3B5` | `radial-gradient` local com `screen`; respira só em `opacity` lenta |
| Abajur (preenchimento) | âmbar ~2500–3200 K, lateral, 20–30% da chave; só um lado | halo `radial-gradient` + cone; cúpula semitransparente |
| Lava (acento) | rosa-magenta, raio curto, de baixo para cima | halo rosa pequeno no canto; bolhas SVG (ver §9) |
| Letreiro de neon (acento) | cor única saturada, luz em faixa (o tubo), não em ponto | `drop-shadow` em 2–3 camadas (§7) |
| Janela noturna (contraluz) | roxo/azul frio, rim light | quadrilátero com `clip-path` + gradiente; estrelas com `circle` |
| Luzinhas de Natal | pontos pequenos, bokeh no fundo, **sem piscar** | `radial-gradient` pequenos |

**Regras de luz** [j]:
- Três pontos: **chave** = TV (frente/baixo, fria), **preenchimento** = abajur (quente, lateral), **contraluz** =
  janela ou neon. Deixe sempre um lado do objeto em sombra funda: o olho completa.
- Nunca `#ffffff` em luz: núcleo quase branco + halo colorido.
- **Queda ~1/d²**: gradiente linear de alfa fica chapado. Use paradas: 1,0 → 0,8 (12%) → 0,5 (25%) → 0,2 (50%) →
  0,07 (75%) → 0 (100%) [c]. Ex.: `radial-gradient(circle, rgb(255 193 94/ calc(var(--a)*1)) 0, … calc(var(--a)*.5) 25%,
  … calc(var(--a)*.2) 50%, transparent 100%)` + `mix-blend-mode: screen`.
- **Bloom** (brilho neutro) é bem-vindo; **halation** âmbar (cara de película) só um fio, é luz de CRT, não de cinema.
- **Fresnel**: vidro e plástico liso refletem mais nas bordas. Sobre a tela: `radial-gradient(ellipse, transparent 55%,
  rgb(255 255 255/.10) 100%)` + faixa diagonal fina (reflexo da janela). O reflexo deve espelhar objetos que existem.
- **Feixe com poeira** (opcional, 1 por cena): leque `conic-gradient`/`clip-path`, `screen`, 6–12 partículas lentas.

---

## 3. Cor

Medido nas 6 imagens do dono [c]: preto puro quase não existe (sombras marrom-avermelhado, ameixa, azul-ardósia);
luz fria é pequena e dessaturada; os pixels brilhantes **e** saturados somam só 1–5%. Dois climas: quente/marrom
(imagens 1, 2, 6) e frio/azul (4, 5). Proporção: sombras e meios-tons escuros 60–70% · frio (TV) 15–20% · quente
(abajur/madeira em luz) 8–12% · neon 2–5%. Par cromático: frio da TV × quente/rosa, **um lado dominante**; nunca
arco-íris de neons.

**Paleta adotada (P2 "lava rosa e madeira", quente dominante)** — contrastes [c], ver §11:
`parede #140B10 · painel #1E1218 · madeira #3B2417 · texto #F3E6D8 · secundário #C9B5A8 · rosa #FF5C8A ·
teal (TV) #46C3B5 · âmbar #FFC15E`. Alternativas já calculadas, para estados de luz:
- **P1 "Noite de CRT" (fria)**: `#0B0F14 · #121A22 · #2A1B12 · #E8E2D0 · #A9B4BC · rosa #FF4F9A · ciano #3FE0E8 · âmbar #FFB347`
- **P3 "Azul neon" (madrugada, quase monocromática)**: `#060B1A · #0D1630 · #141C33 · #DCE8FF · #9DB0D6 · magenta #E04FD0 · ciano #9AF0FF · azul #4DA3FF`; aqui varia-se **valor**, não matiz.

**Estados de luz** (color script) [j]: *votação* = TV forte + letreiro aceso; *jogando* = abajur aceso, lava ligada;
*madrugada/call* = abajur apagado, janela roxa, TV azul. Troca = 6–8 variáveis CSS, fade ≥ 600 ms, sem flash. Opcional;
**nunca substitui a faixa de fases** como indicador de tempo.

---

## 4. Textura e filme

| Camada | Receita | Intensidade |
|---|---|---|
| Grão | SVG `feTurbulence fractalNoise` (baseFrequency ~.8, 2 oitavas, `stitchTiles`) como **data URI estático**, `overlay`; não animar o filtro | opacidade ≤ .08 |
| Vinheta | `radial-gradient(ellipse at 50% 45%, transparent 45%, rgb(0 0 0/.55) 100%)` | 35–60% nos cantos |
| Scanlines | `repeating-linear-gradient(to bottom, transparent 0 1px, rgb(0 0 0/.10) 1px 2px)` **só no vidro da TV** | 6–15% (≥ .2 vira ilegível) |
| Curvatura de tubo | `border-radius: 9% / 12%` + `inset` sombra + reflexo; sem distorcer texto | leve |
| Aberração cromática | `text-shadow: -1px 0 rgb(255 40 80/.55), 1px 0 rgb(40 220 255/.55)` só em título grande ≥ 24px | 0,5–1,5 px |
| VHS (glitch/tracking) | só em transição ≤ 400 ms por interação, nunca `infinite` | opcional |

**Desgaste de materiais** [j, base fraca]: plástico bege `#D9CFB4` → amarelado `#CDB77F` mais perto de frestas e
quinas, peças vizinhas com tons levemente diferentes (UV e retardante bromado migram à superfície [v]); madeira com
veios escuros, riscos claros nas quinas, brilho só onde a luz bate; papel com vinco em cruz e canto amassado;
cabos com folga e alça no chão. **Erros:** madeira clara "Pinterest", xadrez perfeito, cabos retos, brilho cromo.

---

## 5. Composição e profundidade

- **Planos** [j]: primeiro plano (8–15% do quadro, `blur 3–6px`, escuro, **não clicável**) · plano de foco (nítido; UI
  e objetos clicáveis) · médio-fundo (`blur ≤1,5px`) · fundo (parede, luzinhas como bokeh, `blur 3–8px`).
  Blur só em camada plana e decorativa; nunca em texto, botão ou capa clicável.
- **Lente:** `perspective` 1000–1400 px (~35–50 mm) para a prateleira; 700 px só para câmera "no chão".
- **Enquadramento:** câmera um pouco abaixo dos olhos ("de dentro do quarto"); regra dos terços (TV à esquerda,
  abajur à direita); cabos e régua apontam para a TV; TV, janela e pôster como molduras.
- **Parallax** (opcional): `translate3d` por profundidade, amplitude ≤ 20 px, `rAF`, ponteiro; giroscópio só por
  botão (iOS exige gesto). É gatilho vestibular: desligar em reduced-motion e Modo conforto [v].

---

## 6. Materiais, props e bagunça

**Liberado:** consoles, controles, cartuchos, jogos, logotipos e personagens reais podem aparecer como props, pôster,
adesivo ou tela de TV (ex.: um Master System ou Mega Drive de verdade, a caixa de um jogo conhecido, o logo da
fabricante num letreiro). Prefira desenhar em CSS/SVG a embutir foto de terceiros (leve e no estilo da cena). A coluna
abaixo dá a versão **genérica**, útil quando não houver arte do objeto real à mão.

| Prop | Versão genérica |
|---|---|
| TV de tubo | caixa quase cúbica, tela abaulada, moldura bege amarelada, 2 botões redondos, antena "orelha de coelho" opcional |
| Console | laje larga e baixa, tampa inclinada, 2 portas, botão giratório, LED (ou um aparelho real de verdade) |
| Cartucho / cassete / VHS | cartucho com cantos chanfrados e rótulo em 3 faixas; VHS ≈ 187×102 mm com etiqueta de locadora; cassete com 2 carretéis |
| Controle | pílula com cruz e 2 botões de cor própria, cabo preto ondulado |
| Móveis e ambiente | rack de madeira baixo, papel de parede xadrez escuro de baixo contraste, janela com céu estrelado, pôsteres abstratos (sunburst, planeta, grade), boombox, relógio de LED, lava, abajur, planta |
| Brasil | cortina de miçanga, benjamim ("T"), adesivo de locadora, colcha de retalhos |
| Miudezas | cubo mágico, copo, lenço amassado, caixa de lápis, revista dobrada: poucos, com sombra de contato |

**Densidade** [j]: 8–14 props; ~60% do espaço ocupado; grupos de 3 (tamanhos 1:2:3); **um objeto que conta história**
por módulo; 20% fora de lugar entre −8° e 8°. Props: 3 níveis (blur à frente, nítido no meio, fundo).
Props reais (ex.: console conhecido, caixa de jogo) são bem-vindos; os **genéricos** servem de reserva e para manter
a cena leve.

---

## 7. Tipografia e letreiro

**Famílias adotadas (máx. 4; hospedar `.woff2` no próprio domínio + licença; `font-display: swap`)**
| Papel | Família | Licença |
|---|---|---|
| Títulos, números, placas | **Bebas Neue** (caixa-alta, `letter-spacing` .04–.08em) | OFL 1.1 |
| Texto e UI | **Atkinson Hyperlegible Next** (variável 200–800) | OFL 1.1 |
| Ficha/etiqueta datilografada | **Special Elite** | Apache-2.0 |
| Preço e adesivo à mão (locadora) | **Permanent Marker** | Apache-2.0 |

Testar acentos: "AÇÃO ÃÕ ÁÉÍÓÚ ÂÊÔ ç ã õ". Pixel (Press Start 2P, Pixelify, VT323) e mono técnica (Share Tech Mono)
são candidatas descartadas por ora; Tilt Neon/Neonderthaw só se o letreiro for em fonte. Texto corrido nunca em fonte
de display, pixel ou manuscrita. Fontes proprietárias de época (ITC, Futura) → equivalentes livres.

**Letreiro de neon (SVG)** [j, com base em B21]: um `path` por letra, traço único monolinha (`stroke-linecap/linejoin:
round`, 6–8 px); núcleo = cópia fina quase branca (`#FFF3FA`, 40–50%); glow = `drop-shadow(0 0 2px) (0 0 8px)
(0 0 22px)` na cor; tubo apagado cinza-translúcido; eletrodos nas pontas, grampos pretos a cada ~80–140 px, fio que
sai por trás até um transformador, reflexo borrado na parede (`blur(18px)`, 40%). **Flicker:** uma letra, 1–2
quadros, no máximo a cada 20–40 s; animar `opacity` (nunca `text-shadow`). `role="img"` + `aria-label`.

**Rótulos de locadora e VHS** [j]: etiqueta retangular de papel com borda colorida, título em Bebas, 1–2 linhas
datilografadas, "LOCAÇÃO 2 DIAS", "REBOBINE", código de barras por `repeating-linear-gradient` de larguras variadas.
Manuscrito para o que "alguém escreveu".

---

## 8. Grafismos (cada um precisa de um objeto dono)

Grade em perspectiva (só chão de pôster/TV, `rotateX(60deg)`, linhas rosa 35%) · sunburst (5–7 listras, pôster e
caixa) · listras diagonais (`repeating-linear-gradient(135deg)`) · Memphis/terrazzo (adesivo, laminado; padrão próprio,
**não** copiar o Bacterio) · halftone (revista, pôster) · selos e etiquetas de preço (polígono de 16 pontas,
rotação ±6°) · letras cromadas (só no wordmark SVG) · OSD de TV (`▶ PLAY`, `CH 03`, glow verde/azul). Limite:
glitch e flicker em 1–2 elementos ao mesmo tempo.

---

## 9. Receitas web (não testadas)

**Regras da cena inteira**
1. Só `transform` e `opacity` animam barato; nunca animar `box-shadow`, `text-shadow`, `filter`, `blur` [v, D07 de 2015: reconfirmar no DevTools].
2. **Efeito de luz nunca é ancestral da prateleira 3D**: `opacity<1`, `filter`, `mix-blend-mode`, `isolation`, `mask`,
   `clip-path`, `overflow≠visible` e `contain: paint` achatam `preserve-3d` [v, spec CSS Transforms 2]. Luz, glow, grão e
   vinheta são **irmãos** (`position:absolute; inset:0; pointer-events:none; aria-hidden`).
3. Todo efeito é decorativo e desligável.

**Ordem de camadas (z-index)**: 0 parede · 10 móveis/prateleira · 20 props · 30 luz · 40 brilho da TV + scanlines
locais · 50 grão · 60 vinheta · 100 UI de texto e controles (painéis ≥ 85% opacos, **fora** do grupo de blend). A UI
nunca fica dentro de `isolation`/blend; foco = outline sólido de 2px fora da influência de halo.

```css
/* brilho local da TV (camada irmã) */
.crt-glow{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(closest-side at 50% 42%,rgb(70 195 181/.28),transparent 70%);mix-blend-mode:screen}
.tv-luz{animation:respira 9s ease-in-out infinite alternate}      /* amplitude ≤20%, período ≥6s */
@keyframes respira{from{opacity:.82}to{opacity:1}}
/* vidro da TV: forma, vinheta interna, reflexo e scanlines só aqui */
.tv-vidro{border-radius:9%/12%;box-shadow:inset 0 0 60px 10px rgb(0 0 0/.7);
  background:radial-gradient(ellipse 60% 30% at 30% 12%,rgb(255 255 255/.14),transparent 70%)}
.tv-vidro::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:repeating-linear-gradient(to bottom,transparent 0 1px,rgb(0 0 0/.10) 1px 2px)}
/* neon de texto (estático; anima só opacity) */
.neon{color:#ffe6f5;text-shadow:0 0 2px #fff,0 0 6px #ff5c8a,0 0 14px #ff5c8a,0 0 32px #c01060}
```
Grão (data URI estático): `<svg width=160 height=160><filter id=n><feTurbulence type=fractalNoise baseFrequency=.8
numOctaves=2 stitchTiles=stitch/><feColorMatrix type=saturate values=0/></filter><rect width=100% height=100%
filter=url(#n)/></svg>` em `background-image`, `opacity:.06`, `mix-blend-mode:overlay`.
Lava: 4–6 `<circle>` num grupo com `filter: blur(6px) contrast(18)`, animar só `transform`, área pequena (~120×300), pausar fora
da tela. Poeira: ≤ 16 partículas, sem blur individual, `IntersectionObserver` + `getAnimations().pause()`.

**Orçamento de desempenho** [j, heurística]: ≤ 3 camadas de blend em tela cheia no desktop e ≤ 2 no celular (prefira
1 camada com vários `radial-gradient`); `blur ≤ 3–4px`, estático; filtro SVG só como imagem estática; `backdrop-filter`
só em painel pequeno, com fallback opaco; `will-change` em ≤ 5 elementos, ligado/desligado por JS; testar num Android
intermediário real por ≥ 1 min.

**Acessibilidade de efeitos**
- `prefers-reduced-motion: reduce`: zerar animação e parallax (preferência do sistema nunca é sobrescrita para pior).
- `prefers-contrast: more`: remover grão, scanlines e aberração; vinheta ≤ .3; painéis mais opacos.
- Flicker: nenhuma mudança de luminância > 3×/s, amplitude pequena, ciclo ≥ 5 s (WCAG 2.3.1). Movimento > 5 s precisa
  de mecanismo para pausar (2.2.2) → **Modo conforto** (se for implementado): `data-conforto="on|off"` no `<html>`,
  inicial `on` se reduced-motion/contrast, senão `localStorage`; com `on` desliga parallax, flicker, poeira, lava, glitch,
  grão, scanlines, aberração, blur e blend; mantém vinheta leve e formas estáticas; botão no topo com `aria-pressed`;
  aplicar no `<head>` antes do primeiro paint.
- Cor de luz é ambiente, **nunca** informação de estado (use forma, texto ou ícone).
- Espaçamento de texto ampliável sem `overflow:hidden` em altura fixa (1.4.12); zoom 200–400% sem moiré nas scanlines.

---

## 10. Aplicação ao Clube dos Jogos

**14 regras (faça / não faça)**
1. Uma luz principal por cena (TV manda; abajur e neon apoiam). *Não:* tudo aceso igual.
2. Sombra com matiz, fundo entre `#0B0F14` e `#160B17`. *Não:* `#000` ou cinza chapado.
3. Frio × quente com um lado dominante. *Não:* arco-íris de neons.
4. **Texto sempre sobre superfície sólida** (cartão, etiqueta, painel). *Não:* letra sobre halo, grão ou scanline.
5. Efeitos só no vidro e na cena. *Não:* scanlines/aberração em tela cheia.
6. Camadas de luz irmãs da prateleira 3D. *Não:* filtro/blend na cadeia `preserve-3d`.
7. Bagunça organizada em 3 níveis. *Não:* props iguais espalhados por igual.
8. Props reais ou genéricos, o que servir melhor à cena (logos e jogos reais liberados). *Não:* prop que não combine com a luz e o desgaste do quarto.
9. Desgaste com critério. *Não:* sujeira em tudo (analog horror) nem novo demais (Y2K).
10. Neon sóbrio: 1 letreiro, 1 cor, glow em 2–3 camadas, flicker raro. *Não:* vários piscando.
11. Movimento lento e opcional. *Não:* tremor, glitch contínuo, parallax forte sem desligar.
12. Estados de luz ligados à fase (opcional). *Não:* cena idêntica o ano todo, nem luz no lugar da faixa de fases.
13. **Português nativo na cena** ("LOCAÇÃO 2 DIAS", "REBOBINE", "SUGERIDO POR"). *Não:* texto de embalagem em inglês.
14. Orçamento de desempenho antes de embelezar.

**Locadora como camada de objetos** (motivos com fonte [v], Brasil): ritual de fim de semana "sábado a segunda";
carteirinha de sócio; aluguel de R$ 2–5 por fim de semana; fliperama/game salon com campeonato; quebrar controle =
perder tempo pago; soprar cartucho; feira do rolo (troca 1x1); revistas de "detonado" (Ação Games, Super GamePower,
sem copiar capas); lan house com "Corujão". Sem fonte (tratar como hipótese a validar com o grupo): TV de tubo no
quarto, luzinhas de Natal, empréstimo de cartucho entre amigos.

**Tratamentos**
- **Prateleira/móvel:** rack de madeira escura baixo com 2–3 prateleiras, beiço de madeira, caixas de frente (algumas
  inclinadas, uma "em uso"); caixa = 6 faces CSS 3D num único `perspective`/`preserve-3d` **sem** luz/filtro dentro;
  veios com `repeating-linear-gradient` + ruído estático; sombra de contato sob cada caixa (gradiente, não animada).
  Cada caixa é `<button>`/`<a>` real; no Modo conforto oferecer lista simples.
- **Capas:** continuam as da RAWG (decisão do produto), sempre 3:4; capas e logos de jogos reais também podem
  aparecer como decoração da cena (pôster, caixa na prateleira, tela da TV).
  Sem imagem: **caixa genérica por código** (cor por hash do nome em 8–10 tons das paletas, 3 faixas, motivo geométrico
  original, nome em Bebas).
- **Etiqueta de lombada/locadora:** papel claro, título Bebas, 1–2 linhas datilografadas (plataforma · quem sugeriu),
  borda colorida, código de barras CSS; estado em chip de papel com **texto + ícone** (`EM VOTAÇÃO`, `JOGANDO`,
  `ZERADO`, `CALL MARCADA`), texto escuro sobre papel claro (≥ 7:1).
- **Adesivos:** selos pequenos (estrela "ZERADO", chama "MAIS VOTADO", fita "SUGERIDO POR", etiqueta amarela
  "R$ 0,00 · EMPRESTADO"), SVG inline, borda branca fina, rotação ±2–6°, sem animação (só `transform` no `:hover`),
  formas genéricas ou personagens e logos reais, à escolha.
- **Parede:** xadrez escuro de baixíssimo contraste, rodapé de madeira, faixa de queda de luz do abajur no topo;
  pôsteres (abstratos ou de jogos, filmes e bandas reais; um pode ser o "pôster do clube"); janela com céu estrelado e contraluz roxo;
  luzinhas sem piscar; `blur 1–2px` na parede em camada própria.
- **Letreiro:** "CLUBE DOS JOGOS" (wordmark do próprio clube; logos de marcas reais podem ser letreiros secundários, mas o neon do sistema continua sendo um só); variantes por estado ("VOTAÇÃO ABERTA", "JOGANDO", "CALL HOJE").
- **Mesa de jogar (fase jogando):** de trás para frente: parede e rack → TV de tubo (tela com a arte do jogo da rodada
  ou um cartaz "FASE 3 · nome" + scanlines só ali) → console (real ou genérico) → cabos → props de mesa → luz (poça
  fria da TV, abajur à esquerda, lava à direita) → controle em primeiro plano com `blur 3–6px` (decorativo) → grão + vinheta.
  Texto da UI fora da cena, em painéis sólidos.

---

## 11. Contraste (WCAG 2.x) [c]

Mínimos: 4,5:1 texto, 3:1 texto grande e componentes. Paleta adotada (P2), cores sólidas:
| Par | Razão |
|---|---|
| texto `#F3E6D8` sobre parede / painel / madeira | 15,8 / 14,8 / 11,8 |
| secundário `#C9B5A8` sobre parede / painel / madeira | 9,8 / 9,2 / 7,4 |
| rosa `#FF5C8A` sobre parede / painel / madeira | 6,6 / 6,2 / 4,9 |
| teal `#46C3B5` sobre parede / painel | 9,0 / 8,4 |
| âmbar `#FFC15E` sobre parede / painel | 12,0 / 11,3 |
| texto de botão `#140B10` sobre rosa / teal / âmbar | 6,6 / 9,0 / 12,0 |

**Pior caso com halo:** halo de neon atrás de texto até **15%** mantém texto e secundário ≥ 5,5:1; com 30% o
secundário cai abaixo de 4,5 (âmbar 4,4; teal-ciano 3,5 em P3). Regra: halo atrás de texto ≤ 15%, ou melhor, texto só
sobre cartão sólido. Grão, scanlines e vinheta reduzem mais: **medir na página renderizada**. Neon decorativo
(letreiro) não precisa de 4,5:1 se houver texto equivalente.

---

## 12. Propriedade intelectual (não é aconselhamento jurídico)

- **Decisão do dono: liberado** usar logotipos de marcas, consoles, jogos, personagens, pôsteres e referências reais.
  Projeto pessoal entre amigos, sem fins comerciais. Isso é escolha do dono, e este dossiê não faz análise jurídica.
  Fica só o bom senso: se um titular pedir para tirar algo, tira; se o site virar público de verdade ou comercial,
  rever esta seção.
- **Aviso no rodapé (recomendado, barato):** "Clube de amigos, sem fins comerciais; não é afiliado a nenhuma
  fabricante, estúdio ou plataforma; marcas pertencem a seus titulares."
- **Imagens:** as 6 referências do dono podem inspirar à vontade; a 5 tem marca d'água de banco de imagens (não
  embutir essa). Preferir desenhar em CSS/SVG a embutir foto: é mais leve e combina com a cena. Fotos CC BY-SA exigem
  atribuição e mesma licença.
- **Fontes:** OFL 1.1 permite `@font-face` e exige incluir a licença ao redistribuir; Apache-2.0 pede cópia da licença.
  Google Fonts via CDN já gerou condenação por LGPD/GDPR na Alemanha (não vinculante no Brasil): hospedar no domínio.
- **Capas da RAWG:** arte de terceiros usada como conteúdo, na mesma lógica de projeto pessoal.

---

## 13. Em aberto

- Qual celular é o mínimo para testar desempenho (metade do grupo usa celular).
- Modo conforto como botão visível (e se liga por padrão em celular fraco) e se o letreiro pode piscar (recomendado: raro,
  uma letra, desligável).
- Parallax por giroscópio ou só ponteiro.
- Quem desenha o letreiro e os ícones; quem testa acessibilidade (contraste renderizado, zoom, leitor de tela).

## 14. Onde olhar para mais (todas em `arquivo/referencias.csv`)
C50 quarto 3D navegável em CSS puro · C51 TV de tubo em CSS puro · C54 receita mínima de scanlines/glow ·
C63 CRT com HTML real por `matrix3d` · C16 quarto de 1987 recriado em museu · C25 menus gravados em VHS ·
C28 quarto e menu como objetos (Unpacking) · C32 luz baixa motivada por lâmpadas práticas (Drive) ·
C39 anacronismos e materiais de época · C02 penumbra com poeira e props datados.
