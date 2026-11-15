# Dossiê de direção de arte: estética "quarto gamer retrô" para o Clube dos Jogos

*Pesquisa feita em 14/11/2026. Português do Brasil; termos de busca em inglês entre parênteses. Documento de trabalho para quem vai desenhar e programar a interface (CSS, SVG inline e JavaScript puro).*

**Como ler este dossiê**
- **Níveis de confiança:** **[verificado]** = visto na fonte aberta; **[provável]** = consistente entre fontes ou inferência técnica razoável; **[incerto]** = fonte fraca, divergente, não aberta ou que precisa de teste; **[julgamento]** = opinião de direção de arte do autor, não afirmação de fonte; **[calculado]** = resultado de conta feita no dossiê (contraste WCAG).
- **Referências:** os ids (A01, B22, C50, D07…) remetem a `referencias.csv`, com 260 linhas e 250 URLs únicas. Na coluna `confianca` do CSV, as trilhas A, B e D usaram a escala alta/média/baixa (confiança na fonte); aqui foi convertida para verificado/provável/incerto (alta→verificado, média→provável, baixa→incerto). A trilha C já usava verificado/provável.
- **Direitos:** o dossiê não incorpora imagens protegidas, só links e descrições; as citações têm menos de 15 palavras. As 6 imagens do dono contêm marcas e personagens e servem só como evidência de clima (seção 6).
- **Código:** todo trecho de CSS/SVG/JS é **não testado**.
- **Aviso:** a seção 6 **não é aconselhamento jurídico**.

## Sumário
1. Definição e nomenclatura (inclui mapa de fronteiras e nostalgia brasileira)
2. Anatomia visual: 2.a Luz · 2.b Cor (com amostragem real das imagens) · 2.c Textura e filme · 2.d Composição e câmera · 2.e Materiais e cenário · 2.f Catálogo de props · 2.g Tipografia e lettering · 2.h Grafismos
3. Biblioteca de referências (3.1 a 3.9)
4. Imersão em interface web (técnicas, orçamento de desempenho, camadas, Modo conforto)
5. Aplicação ao Clube dos Jogos (regras, 3 paletas com contraste, 3 combinações tipográficas, tratamentos)
6. Riscos e propriedade intelectual
7. Glossário pt-BR/en e termos de busca
8. Lacunas e dúvidas abertas

---

## 1. Definição e nomenclatura da estética "quarto gamer retrô"

> Convenção de confiança: **[verificado]** = visto na fonte aberta por mim; **[provável]** = consistente entre fontes, mas sem confirmação direta ou com divergência pequena; **[incerto]** = fonte única fraca, divergente, ou não aberta. Os códigos (A01, A02...) remetem a `A-refs.csv`. Onde digo "recomendação autoral", é minha síntese de design, não afirmação de fonte.

### 1.1 Como a comunidade chama essa estética (e por que nenhum nome sozinho cobre o Clube)

Achado central: **não existe um rótulo único e consagrado** para "quarto gamer retrô com luz baixa, brilho de CRT e acentos neon". O que o Clube quer é uma **combinação** de nomes que, em separado, têm fontes diferentes. Os dois rótulos "de comunidade" mais próximos (nostalgiacore e retrowave/synthwave) cobrem cada um só metade do alvo.

| Termo (en) | O que inclui (segundo as fontes) | O que NÃO cobre / excede | Status | Fontes |
|---|---|---|---|---|
| **Nostalgiacore** | Estética ligada à nostalgia e à "memória arquivada da internet"; os sentidos mais comuns giram em torno de programas infantis, lanches, moda e **videogames** [verificado, via citação da Aesthetics Wiki na lista ADS-L]. Uma página-espelho sem autoria o situa em ~1990-2005, com kidcore, Y2K e Frutiger Aero dentro [incerto]. A Infegy o descreve como contraditório: misto de "assombrado" e "aconchegante", ligado a liminal spaces e dreamcore [verificado, mas é blog de empresa de dados]. | Excede o alvo: o recorte 1990-2005 puxa Y2K, kidcore e Frutiger Aero, que o Clube deve **evitar**. Não é sinônimo de "quarto gamer". A página da Aesthetics Wiki sobre nostalgiacore **não pôde ser aberta** (bloqueio da ferramenta). | Termo real, definição instável | A36, A37, A38, A55 |
| **Retro gaming room / game room retrô** | Rótulo **descritivo** usado por blogs de decoração e comércio: paredes escuras, LED, neon, pôsteres (Tron, WarGames), prateleiras de cartuchos/VHS [verificado na fonte, mas é blog de loja]. Reportagens de hardware mostram salas reais com CRT Trinitron, switchers de vídeo e iluminação LED dimerizável [verificado]. | Não é uma "estética de internet" catalogada em enciclopédia que eu tenha conseguido abrir. Fontes são comerciais ou de curiosidade. | Rótulo de uso, sem definição acadêmica | A68, A26, A27, A28 |
| **Retrowave / synthwave / outrun** | Releitura **imaginada** dos anos 80: rosa neon e ciano sobre azul-escuro/preto, grades à la *Tron*, sol listrado, carros esportivos (Testarossa/DeLorean), tipografia cromada [verificado]. O nome "outrun" vem do arcade *Out Run* (Sega, 20/09/1986) [verificado]. A música (Kavinsky, *Nightcall* no filme *Drive*) impulsionou o estilo nos anos 2010 [verificado]. | É paisagem e carro, **não quarto**. Sozinho vira "pôster de neon", sem a bagunça pessoal. Retrowave, synthwave e outrun são usados como sinônimos ou parentes próximos [verificado], mas a origem exata de cada termo **não consta** nas fontes que abri. | Rótulo consolidado | A41, A42, A43, A44 |
| **CRT / analog nostalgia** | Valorização de TV de tubo, scanlines, vídeo composto/S-Video, VHS, cassete, 4:3. Argumento técnico: jogos antigos foram desenhados para CRT (240p, dithering, pretos profundos) [verificado, Engadget]; entusiastas citam resposta imediata e clareza em movimento [verificado, What Hi-Fi]. | Não é "estética visual" em si, é **cultura de equipamento**. **Atenção:** o artigo do Engadget diz explicitamente que não trata de "glow/bloom"; então o "brilho de CRT" como efeito luminoso **não está sustentado pelas fontes técnicas**, só como imagem de referência visual [verificado a ausência]. | Prática real, nome informal | A51, A52, A65, A66 |
| **Lo-fi bedroom** | "Lo-fi" na música: gravação com imperfeições propositais (ruído, distorção) [verificado, Britannica, trecho curto]. O ícone visual é a garota estudando no quarto (Lofi Girl/Chilled Cow), animada por Juan Pablo Machado, publicada em março de 2018, possivelmente inspirada em *Whisper of the Heart* (1995) [verificado, KYM, "parece ser"]. | É **estudo/relaxamento**, luz de abajur, anime. Não é gamer nem retrô-80s. Serve como referência de **clima de quarto íntimo**, não de identidade. A expressão exata "lo-fi bedroom" **não apareceu** como categoria nomeada nas fontes. | Termo composto (autoral) | A58, A59 |
| **Dark cozy** | Nenhuma fonte aberta define "dark cozy" como estética. O que existe: dark academia (ver 1.3) e a definição de iluminação low-key (ver abaixo). | Não verificado como rótulo. | **[incerto]** como termo de comunidade; usar como rótulo de trabalho | A48, A49, A57 |
| **Cinematic low-key** | Termo de **cinematografia**, não de internet: low-key = sombras fortes, alto contraste, pouco ou nenhum fill (relação ~8:1 a favor da key); **iluminação motivada** = luz que parece vir de fontes plausíveis na cena (janela, abajur, vela); luz sem motivo "distrai" [verificado, StudioBinder]. Isso descreve bem o "luz baixa motivada" do Clube. | Define a luz, não o conteúdo do quarto. | Termo técnico real | A57, A50 |
| **"Stranger Things aesthetic"** | Rótulo **informal**. Verificado: (a) cenógrafo da série busca ambientes "reais", com peças vintage de vendas de espólio, não "vitrine de anos 80" [verificado, entrevista Chris Trujillo]; (b) artigo lista influências (E.T., Goonies, Carpenter, néon e shoppings na 3ª temporada) [verificado]; (c) Infegy afirma que a série apresentou a jovens os "terceiros espaços" (shopping, fliperama) [verificado, fonte de empresa]; (d) a estética outrun cita *Stranger Things* como impulso recente [verificado]. | Não achei verbete formal "Stranger Things aesthetic" em Aesthetics Wiki, KYM ou Wikipédia. Detalhes da "parede de luzinhas de Natal" **não foram confirmados** em fonte aberta. | Rótulo informal real | A60, A61, A37, A43 |

**Nome de trabalho recomendado (recomendação autoral):** "**quarto gamer retrô**" = *retro gaming room* (conteúdo: CRT, cartuchos, bagunça) + *low-key/motivated lighting* (luz) + **acento** retrowave (neon como fonte de luz pequena, não como paisagem). Evitar usar "nostalgiacore" como rótulo guarda-chuva sem a ressalva do item 1.3.

### 1.2 Por que "nostalgiacore" é um nome escorregadio

- **Sufixo "-core"**: a Dictionary.com (2022) o descreve como nome de "movimentos" que são fandoms de estética, ampliados pelo TikTok; lista nostalgiacore entre os exemplos [verificado]. A lista ADS-L (27/08/2021) registra o termo como parte da família de rótulos de vídeos de TikTok (dreamcore, weirdcore etc.) e cita como mais antiga a entrada do Urban Dictionary de **03/12/2020** [verificado]. A Infegy diz que menções cresceram a partir do início de 2020, com a pandemia [verificado, fonte empresarial]. Já a página-espelho sem autoria fala em "meados dos anos 2010" no Tumblr/Pinterest/TikTok [incerto]. **Conclusão:** a data de nascimento do termo é **[incerto]**; o uso intenso é de 2020 em diante [provável].
- **A Aesthetics Wiki** descreve a si mesma como comunidade que documenta "visual schemata" da internet [verificado, A32]. Segundo a revista Prospect, tinha **969 estéticas** em outubro de 2023, é aberta a edição, mas moderada rigidamente, e recebe críticas de "cultura de vibes" [verificado, A56]. Ou seja, é **fonte de vocabulário**, não autoridade científica.
- **Know Your Meme**: não localizei verbete "nostalgiacore" (as buscas retornaram "90s Nostalgia" e coleções de imagens que não abri). O verbete "Aesthetic" trata do vaporwave, não de nostalgiacore [verificado, A40].

### 1.3 MAPA DE FRONTEIRAS: o que é vizinho e o que é perigoso

Alvo do Clube: **80/90, quarto pessoal, luz baixa motivada, CRT, neon como acento, bagunça**. "Como não cair" = recomendação autoral, derivada das características que as fontes atribuem a cada estética.

| Estética vizinha | O que compartilha com o Clube | Onde diverge (segundo as fontes) | Como não cair nela (recomendação autoral) | Fontes |
|---|---|---|---|---|
| **Vaporwave** | Nostalgia de 80/90, consoles, Windows 95, logotipos antigos, shoppings [verificado]. | Surgiu ~2011 em comunidades online, ligada a hypnagogic pop; paleta **pastel (rosa/ciano)**, estátuas greco-romanas, palmeiras, azulejo, texto japonês, glitch; é mais **satírico/irônico** e melancólico; o synthwave é visto como celebração mais sincera dos anos 80, com neon sobre azul-escuro/preto [verificado, AW]. Um blog resume: vaporwave = 90s calmo/idílico; outrun = 80s energético/futurista [verificado, fonte pessoal sem autor]. | Sem gradiente pastel rosa-ciano, sem estátua de mármore, sem texto japonês, sem "janelinha de Windows 95" como tema central, sem ironia de consumo. Neon só sobre fundo escuro e como luz pequena. | A33, A44, A40, A41 |
| **Y2K (Futurism)** | Tecnologia como objeto de desejo, nostalgia de hardware [verificado]. | ~1997-2004; CGI abstrato, **metal líquido, translucidez (iMac G3)**, azul gelo/prata/branco com lima ou laranja [verificado]. Era "ficção científica + hardware". | Nada de plástico translúcido colorido, prata cromada limpa, formas "blob". Manter plásticos **opacos bege/cinza** e madeira/papelão. | A35, A39 |
| **Frutiger Aero** | Nostalgia tecnológica [verificado]. | ~2004/2005-2013; brilho vítreo, skeuomorfismo, bolhas, céu/grama/água, aurora, bokeh; visão **otimista, limpa e corporativa** da tecnologia [verificado]. | Sem botões "gel" brilhantes, sem natureza/água, sem luz clara de dia. O Clube é **noite e luz baixa**. | A34, A39 |
| **Cyberpunk (e neon noir)** | Neon, noite, contraste, trilha sintetizada [verificado]. | Cyberpunk: subgênero de ficção científica (termo cunhado em 1983 por Bruce Bethke) virado estética de futuros distópicos [verificado]. Neon noir: noir + néon, cidade sombria "como personagem", herói isolado, violência; *Thief* (1981), *Blade Runner*, *Drive* [verificado]. | Neon vem de **placa pequena/LED dentro do quarto**, não de megacidade com chuva. Sem cromo, sem técnico/techwear, sem distopia. O tom é **aconchego entre amigos**, não isolamento noir. | A39, A50 |
| **Dark academia** | Luz baixa quente, ambientes **densos e cheios de objetos**, melancolia [verificado]. | Tumblr ~2014-2015 (Wikipédia en) ou "início dos anos 2010" (aesdes), em torno de *The Secret History* [verificado, datas divergem]; livros, bibliotecas, Collegiate Gothic, vela, tweed, paleta marrom/preto/verde-oliva/vinho [verificado]. | Sem velas, estantes de livros antigos, tweed, caligrafia. Substituir "livro e vela" por "caixa de jogo e CRT". Plástico e papelão, não couro e madeira escura. | A48, A49 |
| **Analog horror** | VHS, grão, tela de tubo, nostalgia [verificado]. | Subgênero de found footage; imita transmissões de emergência, reportagens e fitas caseiras; **ambiguidade e pavor**, narrativa fragmentada; "explora a nostalgia" [verificado]. | Sem fita sem rótulo, sem tela "quebrada", sem distorção pesada, sem barras de erro. A imperfeição de CRT deve ser **calorosa**, não ameaçadora. | A46 |
| **Liminal spaces** | Nostalgia, ambientes de época, luz artificial [verificado]. | Imagens de lugares de passagem/transição **vazios** (corredores, shoppings, salas de espera), sem pessoas, que causam estranheza; ligadas aos *Backrooms* (4chan, maio/2019), pico em março/2020 [verificado]. | O Clube é o **oposto**: quarto vivido, com gente, bagunça pessoal, objetos com dono. Evitar enquadramentos vazios, simétricos, com luz fluorescente fria. | A45, A47 |
| **Synthwave/Retrowave** (vizinho **aceito como acento**) | Neon rosa/ciano, anos 80, jogos de arcade [verificado]. | É paisagem, carro e sol listrado. Nostalgia de uma versão "imaginada" dos anos 80 e 90 [verificado]. | Usar **só como acento** (um letreiro, uma fita de LED, um pôster), não como tema do site. | A42, A43 |
| **Kidcore** (vizinho de risco) | Pixel art, brinquedos, infância 90 [verificado, via lista Wikipédia]. | Cores primárias saturadas, tom infantil. | Manter paleta escura e dessaturada. | A39, A38 |

### 1.4 Origem e contexto cultural

1. **Aesthetics Wiki e a cultura "-core"**: o vocabulário nasce de comunidades online (Tumblr, Pinterest, TikTok) que catalogam "estéticas" e as ampliam em semanas. A fonte mais citada (Aesthetics Wiki) é colaborativa; Prospect e Ypulse (esta não aberta) descrevem o fenômeno como geracional (Gen Z) [verificado em A56]. **[provável]** que a definição de cada rótulo mude com frequência.
2. **Retrowave/outrun**: o jogo *Out Run* (arcade Sega, 20/09/1986) deu o nome; o subreddit r/outrun foi criado em 29/04/2013; Kavinsky lança *Outrun* em 22/02/2013; *Drive* (2011) e *Nightcall* aparecem como marcos [verificado, KYM, fonte comunitária]. As cores rosa/ciano são atribuídas por mais de uma fonte à paleta de 4 cores do adaptador gráfico IBM CGA (1981) [verificado em duas páginas do aesdes.org (A42, A43), que são blog de estudantes/comunidade; é hipótese de comunidade, **[provável]**, não fato comprovado]. As grades vêm de *Tron* (1982) [verificado como "provável origem" na fonte].
3. **Pandemia como acelerador**: três fontes independentes ligam o crescimento de nostalgiacore/liminal spaces ao início de 2020 e à solidão (Infegy, Wikipédia sobre liminal spaces, Prospect sobre a explosão de estéticas) [**provável**, pois todas são secundárias].
4. **CRT e retrogaming hoje**: fala-se em volta do tubo por entusiastas de jogos retrô (What Hi-Fi, out/2024) com ressalvas práticas (peso até 45 kg, peças raras) [verificado]; o Engadget diz que "não é só nostalgia" (jogos foram projetados para CRT), mas desaconselha comprar um [verificado].
5. **Lo-fi e quarto**: a garota estudando (Lofi Girl) é de 2018 e cristalizou o "quarto-refúgio" em vídeo [verificado].

### 1.5 O que a academia diz sobre nostalgia e tecnologia analógica (e os limites)

| Fonte | O que realmente diz | Uso no Clube | Confiança |
|---|---|---|---|
| **Boym (Harvard Magazine, 2001)** | Duas nostalgias: **reflexiva** (anseio e contemplação, sem tentar restaurar o passado; força positiva) e **restauradora** (tradição "inventada", perigosa). Comenta que a superprodução de lembranças comerciais condiciona pessoas à nostalgia antes da idade de senti-la. **Não trata de tecnologia diretamente** [verificado, trecho]. | Argumento de design: o Clube deve ser **reflexivo** (conversa, curadoria, humor), não "museu restaurador". | [verificado] (li o artigo da Harvard Magazine sobre Boym, não o livro *The Future of Nostalgia*) |
| **Heineman, "Public Memory and Gamer Identity: Retrogaming as Nostalgia" (J. Games Criticism, 2014)** | A memória do retrogaming é construída retoricamente; tensão entre história "oficial" (indústria) e "vernacular" (fãs); retrogamers se veem como "outlaws" guardiões da história [verificado]. | O Clube é uma comunidade vernacular: valorizar **memória pessoal** dos membros. | [verificado] (página é republicação de 2023) |
| **Mello & Mastrocola, "Identidade, nostalgia e memória afetiva no consumo de videogames retrô" (Interin, 2019, ESPM)** | Mercado brasileiro de retrogames; jogos retrô e "linguagens nostálgicas" (*Shovel Knight*, *Papers, Please*) ativam memória afetiva; **jovens que não viveram 8/16 bits também sentem nostalgia**, porque memórias circulam pela mídia [verificado]. | Justifica nostalgia "emprestada" também em membros mais novos. | [verificado] |
| **Mendes, "O fenômeno retrô nos jogos eletrônicos" (SBGames 2012, PUC-Rio)** | Retrô cresce desde 2008 (emulação, distribuição digital, indies, crise econômica); nostalgia ligada a segurança do familiar; cita no Brasil a pirataria como via quase única de acesso a jogos novos e a emulação para consoles que nunca chegaram [verificado]. | Contexto brasileiro e nostalgia de crise. | [verificado] |
| **Chess, "Backrooms and the Rise of the Institutional Gothic" (MIT Press Reader)** | Backrooms se passam nos anos 80/90 (época dos cubículos); o gênero explora uma nostalgia que serve de crítica ao consumismo; liga ao analog horror [verificado]. | Delimita liminal/analog horror como **outro** território. | [verificado] |
| **Infegy (blog)** | Liga nostalgiacore a "digital minimalism" e "digital detox"; Stranger Things apresentou "terceiros espaços"; **é blog de empresa de dados**, sem medir ceticismo tecnológico geral [verificado, com ressalva do próprio texto]. | Narrativa de "refúgio analógico", usar com cautela. | [provável] |
| **Fast Company Brasil (mar/2025, a partir de pesquisa Pringles/Harris)** | 89% dos jogadores (amostra britânica) veem o retrô como forma de desconectar; dados **não são brasileiros** nem trazem tamanho de amostra [verificado]. | Só ilustrativo. | [incerto] |

**Lacuna:** não localizei estudo acadêmico específico sobre **"estética de quarto gamer retrô"** nem sobre CRT como estética no Brasil. O que há é nostalgia + retrogaming + CRT técnico em fontes separadas.

### 1.6 Subseção: NOSTALGIA BRASILEIRA

**Resumo do que o Brasil tem de diferente (verificado):** acesso a jogos era caro e tardio; houve **clones** e **pirataria** como via principal; a Tectoy (Sega) dominou o início; a Nintendo chegou oficialmente só em 1993; **locadoras** e **fliperamas** eram os grandes espaços sociais; revistas ensinavam "detonados"; nos anos 2000 a **lan house** assumiu esse papel.

#### 1.6.1 Linha do tempo cruzada (só o que verifiquei)

| Ano | Fato | Fontes | Status |
|---|---|---|---|
| 1977 | Philco-Ford lança o Telejogo, "primeiro videogame produzido e vendido no país" (clone do Pong). | A09 | [incerto] (1 fonte, monografia) |
| 1983 | Atari chega oficialmente ao Brasil; clones nacionais antes disso; Gradiente/Polyvox. | A09, A10 | [provável] |
| 1984 | Estado de São Paulo teria **>250 locadoras**. | A09 | [incerto] (1 fonte) |
| 1987 | Tec Toy fundada (set.) em São Paulo, fábrica na Zona Franca de Manaus. | A30, A08 | [provável] |
| **04/09/1989** | Master System chega ao Brasil (Tectoy). A monografia da UFU diz "agosto de 1989"; a Wikipédia en diz "set. 1989". | A06, A07, A30, A09 | [verificado] para setembro (3 fontes); **divergência** na UFU |
| Nov/1989 | Gradiente lança o **Phantom System**, compatível com o padrão Nintendo 8 bits (clone do NES). Quando a Nintendo soube, a Gradiente passou a representá-la no Brasil. | A09, A10, A31, A08 | [verificado] (4 fontes; detalhes de venda só na UFU) |
| Até 1991 | Reserva de Mercado de Informática restringia importações. | A08, A11 | [provável] |
| Dez/1990 | Mega Drive chega pela Tectoy; sucesso com jogos localizados. | A04, A05, A30, A09 | [verificado] |
| Dez/1990 | "A Semana em Ação Especial Games" abre caminho para a **Ação Games** (mensal pela Editora Azul desde out/1991; fim em jan/2002). | A09, A12 | [verificado] (2 fontes) |
| 1993 | Super Nintendo chega oficialmente pela **Playtronic** (Gradiente + Estrela). A UFU diz "set/1993", o Canaltech "ago/1993", o Olhar Digital "mar/1993" para a Nintendo no país. | A04, A05, A06, A09 | Ano [verificado]; **mês [incerto]** |
| 1994 | Revistas Super Game e Game Power se fundem sob a Nova Cultural. | A12 | [incerto] (1 fonte) |
| 1998-1999 | Primeira lan house (Monkey Paulista, SP, 1998; CS instalado em 1999). | A15 | [incerto] (1 fonte, acadêmica) |
| 2006-2007 | Lan houses viram o local mais usado para acessar a internet (CGI); ~108 mil em 2010 (ABCID). | A15 | [verificado em A15], não cruzado |

Números de vendas **divergem** entre fontes (Master System no 1º ano: ~85 mil na Bojogá; 190 mil em 1990 na UFU; base instalada ~280 mil no fim de 1990 na Wikipédia en; Mega Drive ~3 milhões segundo a Tectoy, SNES ~2 milhões segundo a Playtronic, em Canaltech). Tratar como **[incerto]** em qualquer texto do site.

#### 1.6.2 Locadoras de videogame

- Motivo de existir: comprar era caro, consoles vinham com um jogo só; locadoras davam acesso a outros títulos [verificado, A01]. Aluguel **por fim de semana**, "ritual de sábado a segunda" (A03); preço citado de **R$ 2 a R$ 5** por jogo por fim de semana na era pós-Plano Real [provável, 1 fonte, A04].
- Carteirinha em **várias locadoras**; redes lembradas: Progames, Dimensão Games, Blockcuster [verificado, A01]. Progames também aparece na monografia da UFU alugando por hora em 1991 [verificado, cruzado].
- Locadoras tinham também **"game sallons"** (grafia da fonte): consoles para jogar no local por tempo pago, com campeonatos, moradores do bairro assistindo e fazendo amizade [verificado, A01]; fila para ver *fatalities* e jogos "em TVs de tubo com o som alto" [verificado, A02]; havia improvisos em **garagens, casas e salões de cabeleireiro** [verificado, A02].
- Quebrar controle: perder privilégio ou 30 minutos pagos [verificado, A03].
- Declínio: PlayStation, consoles destravados e aluguel próximo do preço de compra [verificado, A01]. A última locadora de games de Belém (Fox Vídeo) fechou no **início de 2023** [verificado, A24].
- Atenção: o texto da A União (João Pessoa) é **só sobre VHS de filme**, mas é útil para a atmosfera de "locadora" como lugar [verificado a limitação, A25].

#### 1.6.3 Consoles, Tectoy e clones

- A Tectoy investiu em TV, revistas, outdoors, clube de usuários e linha telefônica de dicas [verificado, A06]; localizou jogos (*Phantasy Star* traduzido; *Mônica no Castelo do Dragão*, *Turma da Mônica em O Resgate*, *Sapo Xulé*, *Chapolin vs. Drácula*, *Didi na Mina Encantada*) e criou versão exclusiva brasileira de *Street Fighter II* [verificado, A08, A06].
- O Brasil teve "Master System Girl" (rosa) e 16 versões do console; ~8 milhões de unidades vendidas até 2016 [verificado em A08 e A30].
- Clones e "paralelo": o NES entrou por contrabando do Paraguai e clones dominavam o varejo [verificado, A31, A08]. "Phantom System" foi **clone do NES**, não do Master System [verificado].
- **Feira do rolo**: bancas de cartuchos com troca 1x1 ou 2x1; **camelôs** com "3 jogos por R$ 10" [verificado, A03]. Atenção: **"emprestar fita/cartucho entre amigos"** como prática não foi confirmada em fonte aberta; o que há é **troca** na feira e **aluguel** (ver 1.8).
- Memory card perdido, fio de controle embolado e **soprar o cartucho** como ritual [verificado, A03].

#### 1.6.4 Fliperamas

- Auge: fim dos anos 70 até 80/90; pais desaprovavam, lugar visto como de "desocupados" [verificado, A14, página de livro]; nos 90, jogos de luta (*Street Fighter II*, *Mortal Kombat*) atraíam plateia [verificado, A13]; locadoras cobravam por hora, mais barato [A13]. Declínio com o novo milênio e internet [verificado, A13, texto estudantil da UFPel, 2016].

#### 1.6.5 Lan houses (anos 2000)

- Espaços de encontro, aprendizagem, competição e campeonatos; ligadas a CS 1.6, GTA San Andreas, Ragnarök, Tibia, NFS Underground 2, WoW, DotA, Habbo [verificado, A15, A16]; "Corujão" (pacote de madrugada) [verificado, A17]. Eram majoritariamente masculinas e sofriam preconceito [verificado, A15].
- Visual: computadores enfileirados, telas acesas, barulho de clique e comemorações [verificado, A16, descrição jornalística, não foto].

#### 1.6.6 Revistas

- **Ação Games** (dez/1990 a jan/2002; Abril -> Editora Azul): notícias e **dicas para passar de fase**; o personagem Frango respondia cartas de forma grosseira [verificado, A12 e A09]. **Super Game Power** e **Ação Games** aparecem como fontes de "detonado" [verificado, A03]. "SuperGame" isolada só aparece, na Wikipédia en, como revista que se fundiu com a Game Power em 1994 [incerto]. Documentário sobre revistas de games financiado por Catarse (2023) lista também Gamers e Nintendo World [verificado, A11].

#### 1.6.7 TV de tubo no quarto, Natal e "luzinhas"

- **TV de tubo**: aparece nas locadoras (A02) e em reportagens de salas retrô (Trinitron 32" e 25"), mas **não há fonte aberta que descreva "TV de tubo no quarto" como memória brasileira específica**. **[incerto]**; tratar como hipótese a validar com membros do Clube.
- **Natal**: "ganhar um console novo no Natal parava a família inteira", e o videogame era "um evento dentro de casa" [verificado, A23, jornal regional]; Master System virou item de nostalgia para pais presentearem filhos [verificado, A08]. **Luzinhas de Natal no quarto**: não encontrei fonte brasileira; a referência são as luzes de *Stranger Things* (não confirmadas em detalhe) [incerto].

#### 1.6.7b Museus, acervos e eventos

- **Instituto Bojogá** (museu e centro de estudos de videogame; acervo e textos históricos) [verificado, A07]. **Museu do Videogame** (itinerante, fundador Cleidson Lima), certificado pelo Ibram como o primeiro do segmento, notícia de 15/08/2014 [verificado, A18]. **Festival Retro Gaming Brasil** (SP, 2019; ligado ao podcast RGB Inside e a Fábio Santana) [verificado, A19].
- Não consegui abrir: Museu da Imagem e do Som, Memória Globo, páginas da Tectoy, Wikipédia pt (ver 1.8).

#### 1.6.8 Para o site: o que isso sugere (recomendação autoral)

Motivos visuais **com fonte**: carteirinha de locadora, ritual "sexta-sábado-segunda", cartucho/fita, capas de revista (**cuidado com direitos autorais**), placar de fliperama, ficha, PC de lan house com CS, "Corujão", grafia "game sallons". Motivos **sem fonte** (usar como hipótese): TV de tubo no quarto, luzinhas de Natal, empréstimo de cartucho.

### 1.7 Resumo executivo para o dossiê

1. O Clube não tem nome próprio na comunidade; combinar **retro gaming room** + **iluminação low-key motivada** + **acento retrowave**, e **rejeitar explicitamente** vaporwave, Y2K, Frutiger Aero, cyberpunk, dark academia, analog horror e liminal.
2. "Nostalgiacore" cobre mais do que o Clube quer (1990-2005 + kidcore + Y2K); usar com ressalva.
3. A Aesthetics Wiki é boa para **vocabulário**, fraca como prova histórica.
4. O Brasil tem uma nostalgia própria (locadora, Tectoy, clones, revistas, fliperama, lan house) com bastante fonte jornalística e pouca academia; as datas e números **divergem** entre fontes.
5. "Brilho de CRT" é um efeito **visual** que a literatura técnica que li não sustenta como fenômeno físico (nem a nega); testar em imagem, não em texto.

### 1.8 Lacunas desta seção

Ver lista no fim da seção 7.

---

---

## 2. Direção de arte: luz, cor, textura, câmera, cenário, props, tipografia e grafismos

**Como ler esta seção.** Cada afirmação relevante leva uma etiqueta: **[verificado]** = li a fonte citada e ela diz isso; **[provável]** = coerente com fontes lidas, mas a fonte não diz exatamente isso, ou veio de fonte fraca; **[incerto]** = não consegui confirmar; **[julgamento]** = observação minha de direção de arte (válida como proposta, não é fato). Os códigos `B01`…`B60` remetem a `B-refs.csv` (todas as URLs foram abertas com WebFetch).

**Limite sobre as 6 imagens de referência (atualizado).** A trilha que escreveu esta seção trabalhou só pelas descrições do dono, então os hex de P1–P6 são **aproximados e inferidos** (não amostrados) [julgamento]. Depois disso as 6 imagens foram analisadas diretamente e suas cores **medidas**: ver 2.b.0 logo abaixo, que prevalece sobre P1–P6 quando divergir.

**Alvo estético em uma frase** [julgamento]: um quarto escuro onde a luz vem de coisas que existem na cena (tela de tubo, abajur, lâmpada de lava, neon, janela), com 85-90% da imagem em sombra quente/fria, 8-12% em luz motivada e no máximo 2-5% de neon saturado, tudo coberto de objetos pessoais e um leve desgaste analógico. Isso separa o resultado de Y2K (translúcido, bolhas, cromado claro), de Frutiger Aero (céu, bolhas, vidro brilhante) e de vaporwave puro (mármore, grade rosa-ciano onipresente, janelas de SO). Para a distinção estética com vaporwave não achei fonte que a faça explicitamente (B26 não trata de vaporwave), então isso é [julgamento].

---

### 2.a Luz

**Princípio-guia: luz motivada.** Luz motivada é a que o espectador consegue "justificar" por uma fonte visível na cena; as fontes em quadro (abajur, janela, tela) são chamadas *practicals* e justificam luz adicional fora de quadro [verificado, B01]. Dois conselhos úteis do mesmo artigo: a luz que reforça um practical deve ter a **mesma temperatura de cor** da fonte, e deve **vir da direção lógica** da fonte [verificado, B01]. Para o site: cada gradiente de luz precisa "pertencer" a um objeto desenhado (TV, abajur, lâmpada de lava, letreiro, janela); luz sem dono parece filtro, não cena [julgamento].

**Low-key.** Estilo que "acentua sombras, alto contraste e tons escuros", com luz-chave forte e pouco ou nenhum preenchimento; o artigo cita razão chave:preenchimento típica por volta de 8:1 e diz que em geral se adiciona algum preenchimento para a imagem não ficar chapada [verificado, B20]. Tradução para o site: o "preto" do quarto nunca é `#000`; use um preto colorido (azul-noite ou vinho) e deixe 10-15% de preenchimento frio para os contornos dos objetos não sumirem [julgamento].

**Tabela de fontes de luz do quarto**

| Fonte | Temperatura/cor aproximada | Direção e papel | Queda e forma | Como fazer em CSS/SVG |
|---|---|---|---|---|
| Tela de TV de tubo (CRT) | Ponto branco de CRT ocidental ≈ 6500 K (D65); preferência japonesa "mais perto de 9300 K", mais azulada [verificado, B08]. Na prática o tom varia com a imagem exibida [julgamento]. | Chave principal e dinâmica. Luz difusa, vinda de uma superfície plana grande: ilumina chão, controles e rosto do jogador por baixo/frente. | Fonte extensa e próxima: queda forte nos primeiros 1-2 m, depois suave [julgamento]. | `radial-gradient(ellipse at 50% 40%, rgba(160,216,255,.35), transparent 70%)` na frente do móvel + `mix-blend-mode: screen` (B23); variar `opacity` 0,9-1,0 em 3-6 Hz de leve para cintilância [julgamento]. |
| Abajur (incandescente, com cúpula de pano) | Lâmpada incandescente/tungstênio ≈ 3200 K [verificado, B06, B07]; com cúpula de pano e dimmer, mais alaranjado, algo como 2500-2900 K [incerto, estimativa própria]. | Luz quente de preenchimento localizado; cone para baixo e halo de luz espalhada pelo pano. | Fonte pequena: queda quadrática visível (círculo de luz sobre a mesa/parede). | Cone: `conic-gradient` recortado + halo `radial-gradient`; cúpula = elemento semitransparente com `filter: blur(1px)` e brilho interno. |
| Lâmpada de lava | Base é uma lâmpada que aquece a cera (que sobe, esfria e desce) [verificado, B33]; a cor rosa/magenta vem do líquido tingido [provável]. Cor sugerida pela ref. 1: rosa-magenta. | Acento colorido de baixa intensidade; ilumina de baixo para cima planta/parede próximas. | Raio curto (20-40 cm no mundo real) [julgamento]. | Corpo: SVG com `feGaussianBlur` nas "bolhas" de cera + animação lenta (`animateTransform` 20-40 s); halo rosa com `screen`. |
| Letreiro de neon | Cor depende do gás/revestimento: neon puro dá vermelho-laranja; argônio + traço de mercúrio dá azul; fósforos e vidros tingidos ampliam a gama [verificado, B21]. | Acento saturado; luz hard-ish em cor pura, tinge paredes/pôsteres. | Fonte linear (o tubo): halo em "faixa", não em ponto [julgamento]. | `text-shadow`/`drop-shadow` em camadas (B22) ou `stroke` SVG com 3 camadas de blur (ver 2.g). |
| Janela noturna | Céu azul-noite; "sombra"/céu coberto na tabela de cinematografia fica na faixa de 6500-9000 K, azulada [verificado, B06]; o roxo da ref. 6 é estilização, não temperatura física [julgamento]. | Luz de contorno (rim) frio ou roxo vinda de trás/lado; mostra poeira em feixe. | Fonte grande e difusa: queda suave. | Quadrilátero inclinado com `linear-gradient` + `clip-path`; céu com estrelas = `radial-gradient` repetidos ou SVG `circle` pequenos. |
| Luzinhas de Natal/pisca-pisca | Pontos coloridos de baixa potência (ref. 2) [julgamento]. | Pontos de luz ao fundo → "bokeh" quando fora de foco. | Cada ponto é fonte minúscula: halo raio ~8-20 px. | `radial-gradient` pequenos com `animation` de opacidade em fases diferentes. |

**Temperaturas de referência de cinematografia (K aproximados).** Vela ≈ 1800-2000 K; tungstênio ≈ 3200 K; nascer/pôr do sol ≈ 2500-3500 K; luz do dia (meio-dia) ≈ 5500-5600 K; céu encoberto ≈ 6500-7500 K; sombra ≈ 7500-9000 K [verificado, B06; B07 confirma vela 1800, tungstênio 3200, dia 5600, encoberto ≈ 6500]. Ponto branco D65 ≈ 6500 K; D93 japonês ≈ 9300 K [verificado, B08]. Observação: um tópico de fórum sobre 6500 K vs 9300 K em jogos japoneses não traz fontes e as afirmações lá são opinião (B09); só uso o resultado da enquete como curiosidade [incerto]. **Regra de implementação** [julgamento]: não use `#ffffff` em nenhuma luz; use pares "núcleo quase branco + halo colorido", p.ex. núcleo `#E8F6FF` e halo `#5BB8FF` para a TV.

**Direção da luz** [julgamento, apoiado em B01]. Regra de três pontos aplicada ao quarto: (1) **chave** = TV (de frente/baixo, fria), (2) **preenchimento quente** = abajur (lateral, 20-30% da energia da chave), (3) **contraluz/rim** = janela roxa ou neon (de trás, cria contorno nos objetos). Mantenha sempre um lado do objeto em sombra funda: o olho completa o objeto, e isso economiza detalhe desenhado.

**Queda (falloff) e a lei do inverso do quadrado.** A intensidade cai com 1/d²: dobrar a distância reduz a luz a 1/4 (duas "stops"); fontes próximas caem rápido (um lado do rosto bem mais escuro que o outro) e fontes distantes iluminam de modo uniforme; queda rápida tende a tensão e queda gradual a clima romântico [verificado, B10]. Em CSS, um gradiente linear de alfa (`transparent`) fica "chapado"; aproxime a curva `I = 1 / (1 + (d/r)²)`, que vale 1,0 em d=0, 0,8 em d=0,5r, 0,5 em d=r, 0,31 em d=1,5r, 0,2 em d=2r e 0,1 em d=3r (cálculo meu) [julgamento]:

```css
/* luz de abajur com queda ~inversa do quadrado; --a = alfa máximo */
.lamp-pool{
  background: radial-gradient(circle at 50% 50%,
    rgba(255,200,120, calc(var(--a)*1.00)) 0%,
    rgba(255,200,120, calc(var(--a)*0.80)) 12%,
    rgba(255,200,120, calc(var(--a)*0.50)) 25%,
    rgba(255,200,120, calc(var(--a)*0.20)) 50%,
    rgba(255,200,120, calc(var(--a)*0.07)) 75%,
    transparent 100%);
  mix-blend-mode: screen; /* B23 */
}
```

**Bloom e halation.** *Bloom* é um brilho branco/neutro por difusão da luz: realces "vazam" e as bordas ficam luminosas; *halation* é um halo vermelho/âmbar em volta de realces, causado por espalhamento de luz dentro da emulsão do filme [verificado, B11]. Em CRTs simulados, modelam-se bloom (fósforos acesos), halation (luz refletida nos fósforos) e difusão (brilho do vidro) como camadas distintas [verificado, B14]. Receita [julgamento]: para a TV, 3 camadas: (i) núcleo da tela, (ii) `filter: blur(6px) brightness(1.3)` duplicada com `screen` (bloom neutro-azulado), (iii) um halo largo e baixo em vermelho-âmbar `rgba(255,120,60,.12)` só nas bordas de realces (halation). O halation âmbar é o que dá "cara de película", mas **numa TV de tubo, use pouco**: o dono quer luz de CRT, não de cinema [julgamento].

**Feixes com poeira (volumetric / god rays).** Um feixe só aparece se houver partículas no ar (neblina, fumaça, poeira) e fica mais definido com uma fonte intensa, dura e de feixe estreito; é mais dramático quando a fonte aponta para a câmera ou para longe dela, em vez de cruzar o quadro de lado a lado; na produção usam-se *barn doors*, *flags* e *cookies* (cucoloris) para modelar [verificado, B12]. Em CSS/SVG [julgamento]: um polígono de `clip-path` em leque saindo da janela, com `linear-gradient` do alfa 0,25 ao 0, `filter: blur(8px)` e `mix-blend-mode: screen`; dentro, 20-40 partículas (`div` de 1-2 px) com `animation` lenta (20-60 s) e `opacity` entre 0,1 e 0,6; só as partículas dentro do feixe devem brilhar (use `mask-image` com o mesmo polígono). Limite o feixe a uma janela/abajur por cena: feixes demais viram "efeito".

**Reflexo em tela e plástico (specular/Fresnel).** O efeito Fresnel é o aumento da refletividade em ângulos rasantes (quase de borda); fica mais evidente quanto mais liso o material, e quase some em superfície rugosa [verificado, B13]. Consequência: o vidro curvo da TV reflete mais **nas bordas** do que no centro, e o plástico liso (cápsula do console, controle) tem um brilho fino nas arestas, enquanto o plástico fosco/amarelado quase não tem [julgamento, derivado de B13]. Receita: sobre a tela, `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(255,255,255,.10) 100%)` (Fresnel nas bordas) + uma faixa diagonal estreita `linear-gradient(115deg, transparent 30%, rgba(255,255,255,.10) 36%, transparent 42%)` (reflexo da janela) + um segundo reflexo, pequeno e colorido, da lâmpada de lava (rosa) no canto; o reflexo deve **espelhar objetos que realmente existem na cena** (consistência de luz motivada) [julgamento].

---

### 2.b Cor

**Base teórica.**
- *Teal & orange*: azul-esverdeado (teal) e laranja ficam em lados opostos do círculo cromático e geram tensão; como a maioria dos tons de pele cai na faixa laranja-amarelada, esfriar sombras e meios-tons separa o sujeito do fundo; o próprio artigo alerta para o uso excessivo ("atalho criativo", virou padrão de blockbuster) e para tratá-lo como ferramenta, não regra [verificado, B02]. Para o site: o par "luz de TV azul-petróleo vs luz de abajur laranja/rosa" é a espinha cromática; **evite aplicá-lo mecanicamente a tudo** [julgamento].
- *Color script*: plano visual da história em miniaturas coloridas por cena, que dá à equipe uma referência comum e planeja o arco emocional (frios = calma/tristeza, quentes = intensidade/afeto); a técnica vem da animação e é associada à Pixar (p.ex. *A Bug's Life*, 1998) [verificado, B03]. Uso no site [julgamento]: definir 4 "estados de cena" (ver abaixo) trocados por JS e variáveis CSS, como um color script do clube.

#### 2.b.0 Amostragem real das 6 imagens do dono (medida, não inferida)

Método: redução das imagens anexadas para ~300 px e quantização em 10 cores (median cut, Pillow) [verificado: rodado por mim sobre os arquivos anexados]. Os hex abaixo são **medidos nas imagens** (aproximados por causa da compressão e da redução); servem para calibrar as paletas P1–P6 acima, que vieram só das descrições.

| Img | Cor média | % de pixels muito escuros | Cores dominantes medidas (hex, % da imagem) | Leitura de direção de arte [julgamento] |
|---|---|---|---|---|
| 1 (assoalho + console) | `#422E31` | ~0% (sombra levantada, nunca preto) | `#2D211D` 15%, `#2A1719` 12%, `#422726` 12%, `#543E3A` 11%, cinza-azulado da luz da TV `#93959B` 10%, magenta profundo `#620F35` 7% | Sombra **marrom-avermelhada**, não preta; a luz fria da TV é pouco extensa e dessaturada (cinza-azulado), o rosa só aparece como acento localizado |
| 2 (mini arcade + TV) | `#3E2A27` | ~25% | azul-noite `#1D2230` 20%, preto quente `#0F0C0D` 14%, tijolo/pele `#8E5046` 10%, **âmbar de abajur `#D1A95D`** 5% | Fundo frio azul-noite + luz quente âmbar/vermelho-tijolo: o par complementar mais clássico do conjunto |
| 3 (ilustração, mãos no controle) | `#322B32` | ~15% | roxo-escuro `#160B17` 14%, azul-ardósia `#242938` 12%, ameixa `#221823` 12%, cinza-quente `#362E2C` 15% | Paleta **fechada em roxo/ameixa e ardósia**, com pouquíssimo saturado: a cor vem dos objetos, não da luz |
| 4 (pilha de TVs + neon azul) | `#0F2A42` | ~35% | preto azulado `#000103` 19%, azul-petróleo `#0F456D` 16%, `#062E4C` 13%, `#002E59` 9%, azul-aço `#37769F` 8% | **Quase monocromática**: todos os matizes entre 203° e 215°; o brilho vem de variar valor (claro/escuro), não matiz |
| 5 (TV + abajur, banco de imagens) | `#2B2A36` | ~39% | rosa-acinzentado `#544249` 14%, azul-índigo `#1C2242` 14%, preto-roxo `#050308` 12%, **verde-água da tela `#729DA4`** 10% | Parede em roxo/índigo escuro; a única luz fria é a tela, em teal dessaturado |
| 6 (escrivaninha 80s) | `#492C29` | ~3% | vermelhos/marrons escuros `#5A2D2D` 13%, `#281813` 13%, `#6E3D37` 11%, `#90574D` 7%, cinza-lilás da janela `#828096` 7% | Dominante **marrom-avermelhado** (madeira + sombra levantada) com uma única luz fria lilás vinda da janela |

**Três conclusões úteis para o Clube** [julgamento, apoiadas na medição acima]:
1. **O preto puro quase não existe.** Nas imagens 1, 3 e 6 no máximo 15% dos pixels são "muito escuros"; as sombras têm matiz (marrom-avermelhado, ameixa, azul-ardósia). Para o site: fundo de cena em `#0B0F14`–`#160B17`, **não** `#000`.
2. **Luz fria é pequena e dessaturada; luz quente e acento neon ocupam pouco, mas são as mais saturadas.** Nas imagens medidas, os pixels brilhantes *e* saturados somam de ~1% a ~5% da área (medido por faixa de matiz, aproximado). Regra prática: **90% sombra tingida, ~8% luz de apoio, ~2% neon**.
3. **Há dois "climas" nos seus exemplos**: quente/marrom (1, 2, 6) e frio/azul (4, 5, 3 em parte). As paletas finais P1–P3 da seção 5 foram desenhadas para cobrir os dois e um híbrido.

*Limites:* as imagens 4 e 5 são fotos reduzidas; a imagem 5 tem marca d'água de banco de imagens (só serve como referência, não pode ser usada no site). Nenhuma imagem foi incorporada ao dossiê, só as cores medidas.

**Paletas derivadas das 6 referências.** Todos os hex de P1–P6 são **aproximados e inferidos das descrições**, não medidos [julgamento]; a calibração com cores medidas nas imagens está em 2.b.0 acima e prevalece quando divergir. Os ângulos de matiz (graus no círculo HSV) foram calculados por mim a partir dos hex escolhidos.

**P1 · "Assoalho + TV azul + lava rosa" (ref. 1).** Complemento: frio azul-claro (matiz ≈ 204°) vs rosa-magenta (≈ 331°) separados por ≈ 127°, quase um par "split-complementar"; é a paleta mais "neon suave".
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra profunda | preto azulado | `#0B0A10` |
| Madeira envelhecida (meio-tom) | marrom escuro | `#3A2A20` |
| Madeira em luz (realce) | marrom acinzentado | `#6B5039` |
| Preenchimento frio (luz da TV) | azul-claro | `#9FD8FF` (núcleo `#DFF4FF`) |
| Acento neon/lava | rosa-magenta | `#FF4FA3` (halo `#FF7BC0`) |
| Planta sob luz rosa | magenta apagado | `#C2457F` |
| Plástico/cabos amarelados | bege | `#CBBE9E` |

**P2 · "Mini arcade e luzinhas, quarto vermelho-laranja" (ref. 2).** Complemento forte: vermelho-laranja (≈ 11°) vs ciano das telas (≈ 189°), ≈ 178°, complementar quase exato.
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra | vinho muito escuro | `#1A0C0C` |
| Carpete/meio-tom | marrom-vermelho | `#4A2A22` |
| Luz quente ambiente | vermelho-laranja | `#C4452A` |
| Luz quente do abajur | amarelo-âmbar | `#FFC857` |
| Preenchimento frio (telas) | ciano | `#38E1FF` |
| Acento neon (pisca-pisca/telas) | magenta · verde-limão | `#E83FA6` · `#7CFF6B` |

**P3 · "Quarto adolescente à noite" (ref. 3, ilustração).** Complemento: azul-cobalto (≈ 231°) vs amarelo (≈ 47°), ≈ 176°.
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra / céu da janela | azul-noite | `#0E1330` |
| Preenchimento frio (luar/janela) | azul-cobalto | `#2B3A8C` |
| Luz da TV (jogo de luta) | azul-claro + amarelo de HUD | `#6EC8FF` · `#FFD84A` |
| Cor de objeto quente (camisa, pôster) | vermelho | `#D93A3A` |
| Madeira/skate | bege-ocre | `#C79A5B` |
| Acento neon | (quase nenhum; luz vem da TV) | use `#6EC8FF` |

**P4 · "Pilha de TVs azulada" (ref. 4).** Quase monocromática: duas famílias de azul (matiz ≈ 207-210°), contraste por luminância, não por matiz; é a paleta "noite fria".
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra | azul quase preto | `#05080F` |
| Meio-tom | azul-aço escuro | `#0B1B2E` |
| Preenchimento frio | azul médio | `#1C4E80` |
| Neon (placa azul) | azul-elétrico | `#3FA7FF` |
| Reflexo nas telas | azul-gelo | `#BFE6FF` |
| Acento de respiro (≤ 3% da área) | vermelho-coral | `#FF5A5F` (acréscimo meu; a ref. não o descreve) |

**P5 · "TV sobre móvel de madeira, papel de parede xadrez" (ref. 5).** Teal & orange clássico: azul-verde da tela (≈ 182°) vs âmbar do abajur (≈ 34°), ≈ 148°.
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra / parede xadrez escura | verde-petróleo quase preto | `#1C2420` (linhas do xadrez `#2B3A33`) |
| Madeira do móvel | marrom médio | `#6B4A2F` |
| Luz da tela | azul-verde | `#4FD1B5` (núcleo `#2FA3A8`) |
| Luz quente (abajur de pano) | âmbar | `#F2B35E` |
| Objetos de cenário (globo, pôsteres) | azul-acinzentado | `#5E8FA8` |

**P6 · "Escrivaninha 80s, janela roxa" (ref. 6).** Complemento: roxo (≈ 262°) vs âmbar (≈ 37°), ≈ 135°, quase complementar amarelo-roxo.
| Papel | Cor | Hex aprox. |
|---|---|---|
| Sombra | roxo-noite | `#120A1E` |
| Luz da janela (rim) | roxo-elétrico | `#7B3FE4` (halo `#A06BFF`) |
| Luz quente (abajur articulado) | âmbar claro | `#FFD38A` |
| Jeans (jaqueta na cadeira) | azul-jeans | `#35507A` |
| Mesa de madeira | marrom | `#7A5230` |
| Luz da tela | verde-água | `#7FE0D0` |

**Paleta-mestre sugerida para o site** (síntese minha) [julgamento]: `--sombra:#0B0A12; --sombra-quente:#1A0C0C; --meio:#3A2A20; --fria:#9FD8FF; --fria-forte:#3FA7FF; --teal:#2FA3A8; --quente:#FFC857; --ambar:#F2B35E; --lava:#FF4FA3; --roxo:#7B3FE4; --plastico:#CBBE9E; --jeans:#35507A`. **Proporções** [julgamento]: sombras e meios-tons escuros 60-70%; frio (TV/janela) 15-20%; quente (abajur/madeira em luz) 8-12%; neon saturado 2-5%.

**Estados de cena (color script do site)** [julgamento, a partir de B03]: (1) *Standby* = só brilho de TV em estática + um neon baixo; (2) *Sessão de jogo* = TV forte, abajur 40%, lava ligada; (3) *Madrugada* = abajur apagado, janela roxa, TV azul; (4) *Dia de votação do clube* = luzinhas e neon em destaque. Cada estado muda 6-8 variáveis CSS e dura 600-900 ms de transição.

---

### 2.c Textura e camada de filme

| Camada | O que é (fonte) | Como fazer (CSS/SVG/JS) | Intensidade sugerida [julgamento] |
|---|---|---|---|
| **Grão** | Textura de partículas; no filme, "grãos" de prata metálica após revelar cristais de haleto de prata; não é pixelização; evoca nostalgia, suaviza o aspecto liso digital e ajuda a separar planos [verificado, B17]. | SVG `<feTurbulence type="fractalNoise">` + `feColorMatrix` para dessaturar, como overlay `mix-blend-mode: overlay/soft-light` (B23). `feTurbulence` gera ruído de Perlin; `baseFrequency` controla escala (0,02-0,2 para texturas; grão fino pede frequências mais altas, ex. 0,6-0,9 [julgamento]); `numOctaves` ≈ 5 costuma bastar (B24). | opacidade 4-8%; animar trocando `seed` a 8-12 fps (não 60) |
| **Vinheta** | Queda de luz nos cantos, às vezes junto com desfoque de borda, típica de lentes antigas [verificado, B18]; em CRT, bordas escuras com tamanho/compressão ajustáveis [verificado, B14]. | `radial-gradient(ellipse at center, transparent 55%, rgba(5,3,10,.65) 100%)` por cima de tudo. | 35-60% nos cantos |
| **Scanlines** | Padrão repetido de linhas, quase sempre combinado com máscara de fósforo (grade RGB), desfoque leve, curvatura, bloom/halation e entrelaçamento [verificado, B15, B14]. | `repeating-linear-gradient(to bottom, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)` **só dentro do vidro da TV**; máscara RGB opcional com `linear-gradient` horizontal de 3 cores a 6-8% de opacidade. | 10-20% na TV; quase 0 no resto |
| **Curvatura de tubo** | "Distorção de barril" falsa, às vezes com vinheta [verificado, B15]. | Contorno do vidro com `border-radius: 8% / 10%` e brilho de borda; evitar distorcer o conteúdo (texto legível). | leve |
| **Aberração cromática / convergência** | Franjas de cor sobretudo nos cantos; simulável escalando canais R/G/B ou deslocando o azul [verificado, B18]; em CRT barato, desalinhamento por cor dos feixes [verificado, B14]. | `text-shadow: -1px 0 rgba(255,0,60,.55), 1px 0 rgba(0,200,255,.55)` em textos de tela; SVG `feOffset` por canal com `feColorMatrix` + `feBlend mode="screen"`. | 0,5-1,5 px, mais forte nas bordas |
| **Ruído de fita VHS** | *Head switching noise*: faixa de distorção na parte de baixo do quadro, no intervalo em que as cabeças de vídeo trocam, perto do sincronismo vertical; some em monitores com overscan, aparece em captura de quadro inteiro; em casos graves, oscila [verificado, B16]. Tracking/dropout/borrão de croma são típicos de fita [provável, conhecimento geral; a fonte B16 só cobre head switching]. | Faixa de 6-14 px no rodapé da tela com `feDisplacementMap` horizontal (ruído de B24) animado; linhas brancas curtas aleatórias (dropout) via JS a cada 3-8 s. | só em estados "fita"/transição |
| **Poeira e riscos** | Partículas e fiapos sobre lente/tela [provável] | 30-60 `div`/`circle` com `opacity` 0,05-0,25, `blur(0.5px)`, em duas camadas com paralaxe oposta; poucos fiapos como `path` SVG. | quase imperceptível |
| **Luz de gás/instabilidade do neon** | Flicker: quedas bruscas de brilho em frações de segundo, simulando descarga instável [verificado, B22]. | Keyframes que, no fim do ciclo (ex. 2 s), trocam a cor para cinza escuro e removem o `text-shadow` por 1-2 quadros. | 1 letra por letreiro |

**Desgaste de materiais.**
- *Plástico amarelado.* Causa: radiação UV quebra cadeias do polímero e forma radicais livres, deixando o plástico amarelo e quebradiço; retardantes de chama à base de bromo resistem mal à UV, se decompõem e **migram para a superfície**, agravando o amarelado; calor e pressão também aceleram [verificado, B04]. ABS amarelece com UV ou calor excessivo por fotoxidação [verificado, B05]. Aviso: o "retrobright" tem eficácia de longo prazo incerta, o amarelado pode voltar e o processo pode enfraquecer plástico já danificado; em um teste de 10 anos (Shelby Jueden, caixa de Dreamcast tratada em 2015) a área tratada ficou com mais amarelado, riscos e manchas que a não tratada [verificado, B05]. Nota de rigor: o artigo de B04 não menciona ABS e o de B05 não menciona bromo; juntos explicam o fenômeno, mas nenhum diz a frase completa sozinho [provável]. Como desenhar [julgamento]: base bege `#D9CFB4` → amarelado `#CDB77F` mais intenso **perto de frestas, quinas e partes próximas a fontes de calor/luz** (o bromo migra à superfície, então manchas irregulares fazem sentido), mais uma leve diferença de cor entre peças vizinhas (carcaça amarelou, botão não).
- *Madeira, carpete, papel de parede, papel.* [julgamento] Madeira: veios escuros, arranhões claros em quinas e trilhas de pé; polimento brilhante só onde a luz bate; carpete: textura por `feTurbulence` + `feDisplacementMap`, desbotado em manchas pelo sol da janela; papel de parede: padrão de xadrez com linha irregular e leve descolamento nas emendas; papel (revistas/pôsteres): dobras em cruz com `linear-gradient` claro/escuro estreito e cantos arredondados/amassados por `clip-path` irregular.

---

### 2.d Composição e câmera

**Profundidade de campo rasa e primeiro plano desfocado (ref. 3 tem controle nas mãos em primeiro plano).** Foco raso mantém um plano nítido e desfoca primeiro plano e fundo; consegue-se com abertura maior, distância focal maior e câmera mais perto do sujeito; isola o sujeito e guia o olhar; o autor alerta para não abusar [verificado, B19]. Tradução: camadas CSS [julgamento]:

| Camada (profundidade) | Conteúdo | Tratamento |
|---|---|---|
| Primeiro plano (z ≈ +300…+500 px) | mão com controle, borda de lençol, cabo, tampa de caixa; cantos inferiores | `filter: blur(3-6px)` + escuro (`brightness(.45)`) + vinheta; ocupa só 8-15% do quadro |
| Plano de foco (z ≈ 0) | TV, prateleira, objetos "heróis" clicáveis | nítido; é onde vive a UI/interação |
| Plano médio-fundo (z ≈ −200…−500) | pôsteres, abajur, janela | `blur(0.6-1.5px)`; contraste menor |
| Fundo (z ≈ −800) | parede, pisca-pisca como bokeh | `blur(3-8px)`; pontos de luz viram discos |

Dica: desfoque de primeiro plano **só em elementos não clicáveis** (ou que desfocam/ganham foco ao passar o mouse, como "rack focus") [julgamento].

**Lente = valor de `perspective`.** Em CSS 3D, `perspective` define a distância do observador ao plano z=0 e valores menores dão perspectiva mais profunda; `transform-style: preserve-3d` mantém os filhos no mesmo espaço 3D; `perspective-origin` move o ponto de vista [verificado, B25]. Relação geométrica (cálculo meu, assumindo viewport de 800 px de altura): campo de visão vertical = 2·atan(800 / 2p). Para p = 700 px → ≈ 59°; 1000 px → ≈ 44°; 1400 px → ≈ 32°; 1800 px → ≈ 25°. Para comparar com lentes de câmera (sensor full-frame, altura 24 mm; cálculo meu): 24 mm ≈ 53°; 35 mm ≈ 38°; 50 mm ≈ 27°; 85 mm ≈ 16° [julgamento]. **Sugestão:** `perspective` entre 1000 e 1400 px (equivalente a ~35-50 mm) para a prateleira, que dá profundidade sem a deformação de grande-angular; 700 px só para um plano de "câmera na altura do chão" mais dramático. Lentes mais longas também comprimem planos e favorecem foco raso (B19).

**Enquadramento e planos** [julgamento]:
- *Plano geral* da prateleira/quarto: carrega a bagunça e a luz; câmera um pouco abaixo da altura dos olhos (parece "de dentro do quarto").
- *Plano médio*: um módulo (TV + console) ocupa o centro; regra dos terços com a TV no terço esquerdo e o abajur no direito.
- *Close/macro*: ao clicar em um objeto (cartucho, VHS), o quadro chega perto com profundidade de campo raso; fundo vira bokeh de luz.
- *Quadro dentro do quadro*: janela, moldura de pôster e a própria TV como molduras que direcionam o olhar.
- *Linhas guia*: cabos e régua de energia apontam para a TV; tábuas do assoalho convergem para o ponto de fuga.
- *Inclinação sutil*: ±1-2° de rotação do cenário inteiro dá aspecto de foto tirada sem tripé (cuidado com acessibilidade/enjoo; respeite `prefers-reduced-motion`).

**Paralaxe de câmera por mouse/giroscópio:** deslocar cada camada por `translate3d` proporcional à profundidade (primeiro plano move mais, fundo menos), amplitude total ≤ 20 px; atualização por `requestAnimationFrame` [julgamento].

---

### 2.e Materiais e cenário

Lista de **fontes de época** que consegui verificar é curta; para texturas e cores específicas uso [julgamento] e aviso. O que as fontes sustentam: nostalgiacore em interiores é camadas de padrões que se chocam (geométrico, floral, listrado), mistura de vintage e moderno e toques pessoais como fotos antigas; materiais citados: madeira escura, teca, veludo, metais, laca e carpetes; cores: mostarda, laranja queimado, verde suave [verificado, B30]. Quartos adolescentes de 1980: pôsteres de bandas/filmes/séries, cortinas de contas, tapeçarias, bandeiras, luzes de neon e lâmpadas de lava, TVs volumosas, videocassetes, aparelhos de som com toca-fitas e o NES, gibis, jogos de tabuleiro e cubo mágico [verificado, B31; as legendas das fotos não dizem nada sobre papel de parede ou carpete]. Décor dos anos 80: janelas muito vestidas, papel de parede em casas tradicionais e modernas, couro revestido, vinil, espelhos e vidro, pastéis como pêssego e azul-petróleo (teal), padrões geométricos preto e branco [verificado, B32]; carpete de parede a parede era comum nos anos 80 nos EUA [verificado, B61, página de baixo detalhe]. Atenção: essas fontes são anglo-americanas; para um quarto **brasileiro** (o clube é brasileiro) vale incluir itens locais [julgamento], como cortina de miçangas, pôster de álbum/figurinha, colcha de retalhos, adesivos de locadora, tomada com benjamim ("T") e antena de TV "orelha de coelho".

| Material | Como se vê quando é retrô (80/90) [julgamento] | Receita SVG/CSS | Erros a evitar |
|---|---|---|---|
| **Madeira de assoalho envelhecida** (ref. 1) | tábuas escuras de largura média, emendas escuras, veios longos, riscos claros, brilho fosco-acetinado só sob luz | tábuas: `repeating-linear-gradient` vertical (largura 90-140 px) com variação de tom por tábua via JS; veio: SVG `feTurbulence baseFrequency="0.01 0.35"` (anisotrópico) + `feColorMatrix` para marrom; riscos: 6-10 `path` finos claros a 6-10% | padrão repetindo visivelmente; madeira clara "Pinterest" |
| **Móvel de madeira com TV** (ref. 5) | tampo escuro, laterais com reflexo, puxador de metal, marca de copo | `linear-gradient` vertical + faixa de brilho do abajur; sombra de contato sob a TV (`box-shadow: 0 14px 18px -8px #000`) | sombra uniforme |
| **Carpete** (ref. 2) | textura de fio curto, cor lavada, trilha de uso | `feTurbulence` alta frequência (0,9) com `feDisplacementMap` pequeno; mancha de luz | cor chapada |
| **Papel de parede xadrez escuro** (ref. 5) | xadrez (plaid/tartan) em verde/azul-escuro, linhas em 2 espessuras, cantos descolando | SVG `<pattern>` com 3-4 retângulos de opacidade diferente; `mix-blend-mode: multiply` sobre a cor base | xadrez perfeito e brilhante |
| **Laminado/Fórmica** | superfície lisa com estampa gráfica (Memphis: padrões de laminado como o *Bacterio* de Sottsass, 1978, são ícones do período [verificado, B28]) | estampa por `<pattern>` (ver 2.h), brilho fino na aresta | usar o padrão exato do Bacterio: use inspiração, não cópia [julgamento] |
| **Plástico retrô** | bege/cinza amarelado, textura de "casca de laranja" fina, parafusos, frestas de ventilação, etiquetas coladas | gradiente de cor suave + `feTurbulence` baixo contraste; ver amarelado em 2.c | brilho "cromo Y2K" ou translúcido colorido (é outra estética) |
| **Plástico de controle/cartucho** | cinza ou preto fosco, botões com leve brilho, cabo preto com ondulação | `path` com `stroke-linecap: round`, sombra projetada | cabo reto e perfeito |
| **Vinil e couro sintético** (cadeira, almofada) | brilho cetinado com rachaduras | `linear-gradient` + linhas de dobra | |
| **Tecidos** (colcha, lenço amassado, jaqueta jeans) | trama visível, dobras com sombra dura | `feTurbulence` anisotrópico + dobras como `path` escuro com blur | dobras simétricas |
| **Papel** (revistas, caixas) | lombada, dobras, brilho de couchê | gradiente de vinco + linhas de brilho | folhas perfeitas |
| **Cabos e régua de energia** (ref. 1) | emaranhados com folga, benjamim, fita crepe, etiquetas de papel nas pontas | `path` com `stroke` de 4-6 px, curva suave `C` e uma "alça" no chão; sombra projetada deslocada | cabos retos e paralelos |
| **Vidro de CRT** | vidro convexo, reflexo de janela, poeira estática | ver 2.a (Fresnel) e 2.c | |

---

### 2.f Catálogo de props (objetos)

**Regra de ouro para evitar reprodução de marcas/personagens** (as 6 referências têm consoles, jogos e personagens reais) [julgamento, não é aconselhamento jurídico]:
1. Desenhe **tipos** (um "console 8 bits de caixa bege com duas portas de controle e fenda de cartucho"), não **modelos** reconhecíveis (proporções exatas, combinações de cor, logotipos, forma exata de botões ou controles).
2. **Troque o trade dress**: invente uma marca fictícia e coerente (ex. "TUBOTRON", "PIXELÃO", "CLUBE-VISION") e use só nela; confira que não existe como marca real antes de usar [julgamento].
3. **Sem personagens, mascotes, logotipos, tipografias de logotipo ou nomes de jogos reais**; no lugar, use silhuetas geométricas e símbolos genéricos (estrela, coração, nave de três triângulos, fantasma geométrico) e títulos fictícios (ex. "NAVE FINAL", "CORRIDA NOTURNA 2").
4. **Pôsteres e capas**: composições originais (sunburst, grade, planeta, silhueta de skatista) com texto fictício; nada de "pastiche" de capas famosas.
5. Mudar a ordem/cor dos botões e formas reconhecíveis dos controles (por exemplo, mantenha direcional + 2 botões, mas com cores/forma próprias).
6. O dono pode usar as 6 imagens apenas como referência de **clima**; não embutir as imagens nem traçá-las.

**Dados de época que consegui verificar** (úteis para "década"): a terceira geração (8 bits) começou em 15 jul 1983 com Famicom e SG-1000 [verificado, B34]; a quarta geração (16 bits) começa em 1987 e ainda usava cartuchos ROM principalmente, com controles de 3 a 8 botões [verificado, B35]; o VHS surgiu em 1976 no Japão e 1977 nos EUA, com apogeu nos anos 80 e 90; cassete em carcaça de plástico de ≈ 18,7 × 10,2 × 2,5 cm, com cinco parafusos e tampa articulada [verificado, B37]; boombox: Philips lançou o "Radiorecorder" em 1966, houve vendas no Japão em 1967, chegou aos EUA no fim dos anos 70 e teve pico em meados dos anos 80 (≈ 20,4 milhões de unidades enviadas aos EUA em 1986), com alça, dois ou mais alto-falantes, deck de cassete, rádio AM/FM e medidores de nível [verificado, B36]; lâmpada de lava: invenção de Edward Craven Walker, direitos de fabricação nos EUA vendidos em 1965, funciona com cera aquecida por lâmpada [verificado, B33]. Para o resto das décadas da tabela, [julgamento] ou [provável].

| Categoria | Década | Como representar de forma GENÉRICA e ORIGINAL (sem marcas) | Dica de implementação SVG/CSS |
|---|---|---|---|
| Console 8 bits | anos 80 | Caixa retangular bege/cinza com 2 entradas de controle, fenda de cartucho com tampa, botão de liga e LED vermelho; marca fictícia em etiqueta | `rect` com `rx` 3; faixa de ventilação com 6 linhas; LED = `circle` com `drop-shadow` vermelho; amarelado (2.c) |
| Console 16 bits | final 80 / anos 90 | Corpo mais largo e baixo, cantos arredondados, tampa de cartucho e 2 portas; cor única fosca | Gradiente suave, relevo com 2 `rect` sobrepostos |
| Console portátil (handheld) | anos 90 | Retângulo vertical com tela de LCD verde-oliva, direcional + 2 botões, alto-falante pontilhado | Tela = gradiente verde `#8CA37A`→`#6F8A62` com "pixels" via `pattern`; sem sombras de CRT |
| Cartuchos (soltos/espalhados, ref. 1) | anos 80-90 | Retângulo com cantos chanfrados, rótulo com faixa colorida, título fictício em fonte pixel, borda de contatos; ângulos aleatórios no chão | `<symbol>` reutilizado com `rotate` aleatório; sombra curta; 6-10 variações de cor de rótulo |
| Controles com fio | anos 80-90 | Retângulo/osso com direcional em cruz e 2-4 botões redondos; cor não padronizada; cabo ondulado preto | `path` do cabo com `stroke-linecap: round`; botões como `circle` com brilho; cabo termina na tomada |
| Joystick/arcade stick | anos 80-90 | Base preta, bastão com bola vermelha-genérica, 1-2 botões grandes | `circle` + gradiente radial para a bola; plano em perspectiva |
| TV de tubo (CRT) | anos 80-90 | Caixa profunda, tela abaulada com cantos arredondados, painel lateral com botões e grade de alto-falante, antena "orelha de coelho" opcional | camadas: carcaça, moldura interna, vidro (Fresnel, scanlines, bloom, 2.a/2.c) |
| Pilha de TVs (ref. 4) | anos 80-90 | 4-8 TVs empilhadas, telas em fases diferentes (estática, barras, apagada) | `use` do mesmo símbolo com variações de tela; reflexos mútuos pequenos |
| Mini arcade (ref. 2) | anos 80-90 | Gabinete estreito com marquise, tela, painel inclinado com direcional e 2 botões; arte lateral em grafismo (listras) | polígono em perspectiva + `clip-path`; marquise com letreiro luminoso (2.g) |
| Fitas VHS | anos 80-90 | Caixa de capa retangular com lombada colorida, etiqueta de aluguel, título fictício, selo "REVISTA 1 DIA" (modo locadora); fita avulsa com rótulo manuscrito | Retângulo ≈ 187 × 102 mm proporcional (B37); etiqueta por `rect` + texto; fendas de rolo em `circle` |
| Fitas cassete e estojo | anos 80-90 | Retângulo com 2 carretéis visíveis, janela de fita, rótulo escrito à mão ("MIX 94") | 2 `circle` com dentes por `stroke-dasharray`; fonte manuscrita ou máquina de escrever (2.g) |
| Boombox / rádio-gravador | anos 80 | Corpo largo, alça, 2 alto-falantes grandes de cones concêntricos, deck de cassete, medidores de LED [verificado, B36] | círculos concêntricos com `radial-gradient`; LEDs com `drop-shadow` |
| Walkman genérico / fones | anos 80-90 | Caixinha retangular + fone de arco simples | `path` fino para o arco; espuma como `ellipse` |
| Revistas de jogos/gibis | anos 80-90 | Capa com título fictício em tipografia grossa, bandas de cor e "selos" de promoção; pilhas desencontradas | `rect` com gradiente + padrão halftone (2.h); dobra no canto |
| Pôsteres | anos 80-90 | Sunburst + silhueta de nave/personagem **original**, grade em perspectiva, banda de música fictícia; cantos com fita adesiva | Poster = `rect` + `pattern`; fita = `rect` translúcido rotacionado |
| Livros/manuais, caixas de jogo | anos 80-90 | Caixas de papelão com arte de listras e planetas, "selo de qualidade" fictício | Caixa = 3 polígonos (frente, lateral, topo) em isometria falsa |
| Brinquedos/bonecos | anos 80-90 | Bonecos de plástico genéricos (robô de blocos, astronauta, bichinho redondo) em poses; nada de personagens licenciados | Primitivas SVG (círculos + retângulos) com sombra; pintura de "tinta descascada" |
| Cubo mágico/quebra-cabeça | anos 80 | Cubo 3×3 com cores genéricas [verificado que o cubo aparece em quartos adolescentes, B31] | 3 `polygon` em isometria; faces com 9 quadrados |
| Abajur (cúpula de pano) | anos 70-90 | Cúpula cilíndrica/cônica bege-âmbar, base de cerâmica ou madeira | cúpula `path` + gradiente; luz (2.a) |
| Abajur articulado | anos 80-90 | Dois braços de metal, cabeça cônica, base redonda; cor lisa | `path` com `stroke-linejoin: round`; luz em cone |
| Lâmpada de lava | anos 60-90 | Corpo cônico/rocket com bolhas de cera, tampa e base metalizadas [verificado, B33 para o princípio] | `path` + máscara; bolhas animadas |
| Luzinhas de Natal | anos 80-90 | Fio com 12-20 bulbos coloridos em curva nas paredes (ref. 2) | `path` + `circle` com `drop-shadow` de cor; animação alternada |
| Letreiro de neon | anos 80-90 | Frase curta fictícia ("GAME ON", "FASE 2", "CLUBE") ou símbolo (estrela, controle genérico) | ver 2.g (anatomia) |
| Relógio de parede / despertador | anos 80 | Relógio redondo de plástico ou despertador digital com dígitos de LED vermelho | dígitos de 7 segmentos com `polygon`; brilho vermelho |
| Régua de energia/benjamim, cabos (ref. 1) | anos 80-90 | Régua branca/bege com LED vermelho de energia, benjamim com 3 saídas, fios cruzados | Retângulo + 5 "buracos" (`rect` escuro) + LED; cabos (2.e) |
| Globo, telescópio, skate, tênis, camisa de basquete, jaqueta jeans (refs. 3, 5, 6) | anos 80-90 | Versões sem logotipos: tênis de cano médio com 3 faixas de cores genéricas, camisa com número e listras sem time real, jaqueta jeans com costuras visíveis | formas básicas + dobras com `path`; **sem** logos, cores de time reconhecíveis ou sinais de marca |
| Planta (ref. 1) | todas | Vaso de cerâmica com folhas simples; recebendo luz rosa | `path` de folhas com `fill` de 2 verdes + borda iluminada pela cor da fonte |
| Lenços de papel amassados, copos, latas, embalagens (ref. 1) | todas | Bolinhas de papel brancas, lata genérica de cor sólida sem rótulo | polígonos irregulares; latas como `rect` + elipse; **sem rótulos reais** |
| Pen drive/CD/disquete | anos 90 | Disquete: quadrado com obturador metálico e rótulo; CD: disco com furos | `circle` + gradiente cônico no CD; obturador = `rect` cinza |
| Adesivos e etiquetas de preço | anos 80-90 | Círculos e retângulos com "R$ 19,90", "USADO", "NOVO", "LOCAÇÃO" | ver 2.h |

**Densidade e "bagunça pessoal"** [julgamento]: distribua os objetos com poucas regras: (a) 60% do espaço do chão/prateleira ocupado; (b) **triângulos de objetos** (grupos de 3, tamanhos 1:2:3), (c) um objeto "contando história" por módulo (copo com canudo ao lado do controle, tênis na cadeira), (d) 1-2 objetos sobrepostos ao quadro do plano da frente para quebrar simetria, (e) 20% de objetos fora de lugar em ângulos aleatórios entre −8° e 8°.

---

### 2.g Tipografia e lettering

#### Anatomia de um letreiro de neon (para desenhar em SVG)

Segundo a descrição técnica de B21: tubos de **vidro** de chumbo macio, dobrados à mão sobre um gabarito em escala real após aquecimento; cada tubo é preenchido com gás (argônio com um pouco de mercúrio para luz azul; neônio para vermelho/laranja); **revestimentos de fósforo e tintas** no vidro produzem as demais cores; **eletrodos** metálicos em cada extremidade de cada trecho de tubo; um **transformador** eleva a tensão da rede; **fio de alta tensão** isolado leva a energia aos eletrodos; **suportes** seguram os tubos: em letreiros internos, em geral uma moldura de aço pintada de preto [verificado, B21]. Pontos que não estão em B21 e são [julgamento]: trechos de tubo "mortos" entre letras são pintados de preto, para que o gás acenda só onde deve; os cabos saem pela parte de trás e ficam visíveis em bom letreiro retrô.

| Peça | Como desenhar em SVG/CSS [julgamento] |
|---|---|
| Tubo (corpo) | `path` único por letra com `stroke-linecap="round"`, `stroke-linejoin="round"`, `stroke-width` 6-8 px; **traço monolinha**, sem cantos agudos (vidro dobrado tem raio mínimo) |
| Núcleo luminoso | segunda cópia do mesmo `path` com `stroke` quase branco (`#FFF3FA`), largura 40-50% do tubo |
| Glow | 3 camadas: `filter: drop-shadow(0 0 2px cor)`, `0 0 8px cor`, `0 0 22px cor-com-alfa` (equivalente ao `text-shadow` em camadas de B22) |
| Vidro apagado (não aceso) | tubo cinza-translúcido `rgba(255,255,255,.08)` com reflexo fino |
| Eletrodos | pequenos cilindros cinza metálico (`rect` + gradiente) nos extremos de cada trecho, com leve brilho de contato |
| Suportes | "grampos" em `rect` pretos a cada 12-20 cm (a cada 80-140 px na tela), moldura/placa de fundo preta ou madeira escura |
| Cabos e transformador | fio fino preto sai de um eletrodo, curva atrás do painel até uma caixa metálica (transformador) com ventilação; sombra suave |
| Reflexo na parede | cópia borrada do letreiro (`blur(18px)`, 40% de opacidade) com `mix-blend-mode: screen` sobre a parede |
| Flicker | keyframes com quedas de 1-2 quadros em 1 letra (B22) |

Fontes de apoio visuais: Letreiros em Shinjuku (foto CC BY-SA 4.0 de Basile Morin) mostram uma rua inteira de letreiros coloridos (B38) [verificado: descrição e licença; o conteúdo da imagem em si eu não vi]; **não incorporar a imagem**, só estudar. Exemplo de CSS de neon por `text-shadow` em camadas (B22): núcleo rosa-claro e sombras de glow roxas com blur progressivo, mais uma sombra deslocada em cinza para dar "corpo" [verificado, B22].

#### Famílias candidatas (todas verificadas em páginas do Fontsource ou do repositório; licença e suporte conferidos)

Cobertura de pt-BR: todas as fontes abaixo são de escrita latina e as páginas listam centenas de idiomas (o Fontsource dá a contagem; não lista "português" explicitamente). Os acentos do português (À Á Â Ã Ç É Ê Í Ó Ô Õ Ú e minúsculas) estão no bloco Latin-1; portanto, suporte [provável] em todas; **teste obrigatório** com a frase "AÇÃO ÃÕ ÁÉÍÓÚ ÂÊÔ ç ã õ" antes de adotar [julgamento].

| # | Família | Designer | Licença | Uso sugerido | Cobertura (Fontsource) | Onde obter | Ref. |
|---|---|---|---|---|---|---|---|
| 1 | **Press Start 2P** | CodeMan38 | SIL OFL 1.1 [verificado] | Pixel de arcade: rótulos curtos de cartucho, HUD, títulos de 1-3 palavras (muito largo para texto corrido). Descrição no Google Fonts: bitmap baseado no design de fontes de arcades Namco dos anos 80; **a fonte é livre, mas não recrie logotipos de arcade** [verificado] | 476 idiomas; latino, cirílico, grego [verificado] | Google Fonts; Fontsource | B40, B41 |
| 2 | **Silkscreen** | Jason Kottke | SIL OFL 1.1 [verificado] | Pixel pequeno e limpo (2 pesos: 400 e 700): etiquetas de preço, legendas | 337 idiomas, latino [verificado] | Google Fonts; Fontsource | B42 |
| 3 | **Pixelify Sans** | Stefie Justprince | SIL OFL 1.1 [verificado] | Pixel mais legível (variável 400-700): menus e botões; boa para pt-BR em tamanhos médios | 427 idiomas [verificado] | Google Fonts; Fontsource | B43 |
| 4 | **VT323** | Peter Hull | SIL OFL 1.1 [verificado] | Monoespaçada tipo terminal: OSD de TV/VHS ("PLAY", "CH 03", contador). Descrita como criada a partir dos glifos do terminal DEC VT320 [verificado, B59] | 472 idiomas, latino [verificado] | Google Fonts; Fontsource | B44, B59 |
| 5 | **Share Tech Mono** | Carrois Apostrophe | SIL OFL 1.1 [verificado] | Monoespaçada técnica limpa: contador de fita, timestamp, painel de gravador | 337 idiomas [verificado] | Google Fonts; Fontsource | B45 |
| 6 | **Orbitron** | Matt McInerney | SIL OFL 1.1 [verificado] | Display geométrico futurista: displays de dígitos, "TURBO" | 325 idiomas; eixo `wght` 400-900 [verificado] | Google Fonts; Fontsource; The League of Moveable Type | B46 |
| 7 | **Audiowide** | Brian J. Bonislawsky (Astigmatic) | SIL OFL 1.1 [verificado] | Display arredondado "anos 80 futurista": logotipos fictícios de marca de console/TV | 412 idiomas [verificado] | Google Fonts; Fontsource | B47 |
| 8 | **Bungee** | David Jonathan Ross | SIL OFL 1.1 [verificado] | Display de placa urbana/letreiro de loja (existem variantes *Inline*, *Shade*, *Outline* e *Spice*, vistas só nos resultados de busca; não verifiquei suas licenças [incerto]) | 487 idiomas, latino [verificado] | Google Fonts; Fontsource | B48 |
| 9 | **Monoton** | Vernon Adams | SIL OFL 1.1 [verificado]; Fontsource dá copyright 2011, Fonts In Use dá lançamento em 2012 (divergência de data; irrelevante para licença) | Display de letras com linhas internas paralelas: imita tubos de neon duplos, rótulos de arcade; usar **só 1-2 palavras** | 406 idiomas [verificado] | Google Fonts; Fontsource | B49, B58 |
| 10 | **Tilt Neon** | The Tilt Project Authors | SIL OFL 1.1 [verificado] | Letras de neon "dimensionais" de vitrine; variável com eixos XROT/YROT (−45…45) para inclinar; descrito como inspirado em letreiros dimensionais de lojas [verificado, B51] | subsets latin, latin-ext, vietnamese [verificado] | Google Fonts; Fontsource | B50, B51 |
| 11 | **Neonderthaw** | Robert Leuschke | SIL OFL 1.1 [verificado] | Script monolinha para neon manuscrito ("Open", "Fase 2"): casa com tubo de neon porque tem traço único | 476 idiomas; latino, europeu central, vietnamita [verificado] | Google Fonts; Fontsource | B52 |
| 12 | **Bebas Neue** | Ryoichi Tsunekawa | SIL OFL 1.1 [verificado] | Condensada de pôster/capa de VHS (títulos em caixa-alta); de peso único | 432 idiomas, só latino [verificado] | Google Fonts; Fontsource | B53 |
| 13 | **Anton** | Vernon Adams | SIL OFL 1.1 [verificado] | Condensada pesada de pôster e chamadas ("NOVO!", "LANÇAMENTO") | 963 idiomas, inclui vietnamita [verificado] | Google Fonts; Fontsource | B54 |
| 14 | **Special Elite** | Astigmatic | **Apache-2.0** [verificado, divergente das demais; Apache também é permissiva] | Máquina de escrever: etiquetas de fita VHS/cassete "escritas à mão", cartões da ficha, anotações | 412 idiomas [verificado] | Google Fonts; Fontsource | B55 |
| 15 | **Rubik Glitch** | NaN; Luke Prowse | SIL OFL 1.1 [verificado] | Display com "glitch" embutido: só para títulos de estado "fita danificada" (1-3 palavras) | 485 idiomas [verificado] | Google Fonts; Fontsource | B56 |
| 16 | **Atkinson Hyperlegible Next** | Braille Institute; Applied Design Works; Elliott Scott; Megan Eiswerth; Letters From Sweden | SIL OFL 1.1 [verificado] | **Texto de leitura** (descrições de jogos, regras do clube, votações): alta legibilidade, 7 pesos variáveis (200-800) | 384 idiomas [verificado] | Google Fonts; Fontsource | B57 |

**Observações:** (a) O Fontsource mostra a licença na página "About" de cada fonte; **abri essas páginas**. As páginas do Google Fonts (`/specimen/.../about`) que abri (Press Start 2P, VT323, Tilt Neon) renderizam só a descrição, sem licença nem designer, então a verificação de licença é via Fontsource, que lista a origem como o repositório `google/fonts` (visto explicitamente apenas no metadata do Tilt Neon, B50) [verificado para Tilt Neon; provável para as demais]. (b) *VCR OSD Mono*, fonte muito usada para OSD de VHS, **não consegui confirmar licença**: a página que abri não informa licença nem autor (B60); **não a recomendo** [incerto]; use VT323 ou Share Tech Mono. (c) **Self-hosting**: OFL permite embutir/redistribuir; para o site, baixe os `.woff2` e sirva do próprio domínio, em vez de depender de CDN externo (o dono quer sem recursos externos embutidos) e inclua o arquivo `OFL.txt` do repositório [julgamento]. (d) **Performance**: limite a 4 famílias no site (1 pixel, 1 monoespaçada, 1 display de neon ou pôster, 1 de leitura) com `font-display: swap` [julgamento].

**Combinações recomendadas** [julgamento]
- *Interface geral:* Atkinson Hyperlegible Next (texto) + Pixelify Sans (menus) + VT323 (OSD).
- *Rótulos de cartucho/fita:* Press Start 2P (título, 8-10 px em escala 2×) ou Silkscreen; Special Elite para anotação manuscrita.
- *Pôster/capa de VHS:* Bebas Neue ou Anton com `letter-spacing` 0,04-0,08 em; subtítulo em Share Tech Mono.
- *Neon:* Tilt Neon (neon dimensional) ou Neonderthaw (manuscrito), com Monoton como "segundo estilo" para um letreiro tipo arcade.
- *Marca fictícia do clube:* Audiowide ou Bungee, **com wordmark próprio** (não imitar logotipos reais).

**Tipografia de pôster 80s.** Pôsteres de cinema de época: composições ilustradas aerografadas (ex. Drew Struzan), cores saturadas "quase de mau gosto" com neon, títulos grossos em sans-serif ocupando o quadro [verificado, B29]. O design gráfico dos 80 usava tintas fluorescentes (rosa, ciano, verde-ácido, laranja) sobre preto, tipografia ITC (Avant Garde Gothic, Benguiat), Futura Bold com letras justas/sobrepostas, lettering manual e fontes bitmap de computador (Chicago, Geneva, Monaco), e perspectivas de grade com ponto de fuga [verificado, B27]. Detalhe: essas fontes (ITC, Futura, Macintosh) são **proprietárias**; use as livres acima como equivalentes de espírito [julgamento].

**Rótulos de VHS e de cartucho** [julgamento]
- *VHS:* etiqueta frontal retangular (quase quadrada) com borda colorida, título em caixa-alta (Bebas Neue), 1-2 linhas de metadado em Share Tech Mono; manuscrito em Special Elite como "gravado da TV". Rótulo de locadora genérico: "LOCAÇÃO 2 DIAS", "REBOBINE" (pt-BR). Código de barras desenhado com `repeating-linear-gradient` de larguras variadas.
- *Cartucho:* rótulo vertical com arte genérica em 3 faixas (céu, planeta, chão), título em Press Start 2P, numeração e "selo de qualidade" fictício (círculo dourado com estrela).
- *OSD:* `▶ PLAY`, `● REC`, contador `00:12:34`, `CH 03` em VT323 com glow esverdeado `#9BFF9B` ou azul `#7FD6FF` e `text-shadow` em 2 camadas [julgamento].

---

### 2.h Grafismos e ornamentos

| Grafismo | Origem/fonte | Como usar sem cair em vaporwave puro [julgamento] | Receita |
|---|---|---|---|
| **Grade em perspectiva** | Sinal marcante do synthwave, possivelmente inspirado nas grades do filme *TRON* (1982) [verificado, B26]; grades em perspectiva com ponto de fuga também são recurso de composição dos anos 80 [verificado, B27] | Usar **só como chão de um pôster**, numa TV ou num letreiro, nunca como fundo do site inteiro | `repeating-linear-gradient` horizontal + vertical em `transform: perspective(300px) rotateX(60deg)`; linhas `#FF4FA3` a 35% sobre `#12081F`; desvanecer ao horizonte com `mask-image: linear-gradient(...)` |
| **Sunburst / sol listrado** | Sol grande listrado em amarelo-vermelho ao pôr do sol, eco de camisetas vintage [verificado, B26] | Em pôsteres e na capa de cartucho; com poucas listras (5-7) | `radial-gradient` + máscara de listras horizontais crescentes; raios: `repeating-conic-gradient(#FFC857 0 6deg, transparent 6deg 12deg)` |
| **Listras e diagonais** | Linha diagonal como divisória/acento em design dos 80 [verificado, B27] | Faixas paralelas em 3 cores nas laterais de caixas, caixa do abajur, arte de gabinete de arcade | `repeating-linear-gradient(135deg, ...)` |
| **Memphis (squiggles, zigue-zague, terrazzo, confete)** | Memphis Group, Milão, 1981, Ettore Sottsass; formas e padrões gráficos como o laminado *Bacterio* (1978) [verificado, B28]; padrões que passaram a pôsteres, embalagens e editorial; cores como amarelo ácido e verde-menta [verificado, B27] | Em adesivos, papel de embrulho, estampa de caixa e **laminados** de móvel; não em toda superfície | `<pattern>` SVG com 6-8 formas pequenas em 4 cores; rotacionar aleatoriamente; **não copiar o padrão Bacterio**, fazer seu próprio |
| **Halftone** | Pontos de meio-tom ampliados, influência pop/punk [verificado, B27] | Na capa de revista e nos pôsteres | `radial-gradient(circle, #000 30%, transparent 31%) 0 0 / 6px 6px` com `mask-image` de gradiente para variar tamanho |
| **Adesivos e etiquetas de preço** | [julgamento] (sem fonte verificada) | Círculos com borda serrilhada "NOVO!", etiqueta retangular amarela com preço em reais ("R$ 49,90"), etiquetas "USADO", rótulo "TESTADO" e "LOCAÇÃO" | `polygon` de 16 pontas para o selo; `rect` com cantos picotados via `mask`; texto em Anton/Silkscreen; rotações ±6° |
| **Glitch de VHS** | Barra de ruído no rodapé (head switching), tracking e deslocamento de croma [verificado para head switching, B16; demais efeitos provável] | Só em **transições** (800 ms) e no estado "fita"; nunca em textos de leitura | `feDisplacementMap` com `feTurbulence` animado (B24); `clip-path` em 3-5 fatias horizontais deslocadas ±6 px; separação RGB por `text-shadow` ±2 px; 2-3 linhas brancas |
| **Letras cromadas** | Texto sans-serif cromado + manuscrito em cor neon [verificado, B26] | Para o título do site: wordmark próprio em SVG com gradiente metálico | `linearGradient` de 5 paradas com horizonte escuro e brilho; traço fino de contorno |
| **Cores fluorescentes sobre preto** | Tintas Day-Glo (rosa, ciano, verde-ácido, laranja) sobre fundos escuros [verificado, B27] | Fechar a paleta de acentos em 3 cores (rosa `#FF4FA3`, ciano `#3FA7FF`, âmbar `#FFC857`) | variáveis CSS |
| **Moldura de TV/OSD** | Janela de OSD com texto verde e quadros de canal [provável] | Em transições "troca de canal": 200-300 ms de estática (SVG ruído) e número do canal | `feTurbulence` animado + contador em VT323 |

**Cuidados de coerência** [julgamento]: (i) cada grafismo deve ter um objeto dono (adesivo em caixa, pôster na parede), não flutuar na UI; (ii) limitar glitch e flicker a 1-2 elementos simultâneos; (iii) respeitar `prefers-reduced-motion` desligando flicker, glitch, paralaxe e scanlines animadas; (iv) manter contraste de texto ≥ 4,5:1 sobre fundos escuros e glows (o glow não conta como contraste).

---

### Referências desta seção (resumo; lista completa e URLs em `B-refs.csv`)

B01–B03 cinematografia e cor (motivated lighting, teal & orange, color script) · B04–B05 amarelamento de plástico · B06–B09 temperatura de cor e ponto branco de CRT · B10–B13 queda, halation/bloom, volumétrico, Fresnel · B14–B18 CRT, VHS, grão, lente · B19–B20 foco raso e low-key · B21–B22 neon · B23–B25 documentação CSS/SVG · B26–B29 grafismos e pôsteres 80s · B30–B32 e B61 interiores e quartos · B33–B37 props (lava, consoles, boombox, VHS) · B38–B39 fotos de apoio · B40–B60 fontes tipográficas.

**O que não consegui verificar** [incerto]: (1) Não consegui abrir artigos de ASC, Gnomon ou ArtStation (não busquei esses domínios especificamente; as fontes de cinematografia foram StudioBinder, Wolfcrow, VSCO e No Film School); (2) licença e autoria da fonte *VCR OSD Mono* (B60 não informa); (3) suporte explícito a "português" nas fontes (Fontsource só dá contagem de idiomas) — teste com acentos; (4) temperatura exata de abajur com cúpula de pano e de lâmpada de lava (estimativas minhas); (5) materiais específicos de época (papel de parede xadrez, carpete e madeira dos anos 80/90) têm só base fraca nas fontes e foram tratados como [julgamento]; (6) o artigo da Zoner sobre teal & orange estava atrás de verificação anti-bot e o do DIY Photography veio truncado: substituí por B02; (7) a página de defeitos de fita (Pixel Farm/pfclean) redirecionou para domínio não liberado e foi pulada.

---

## 3. Biblioteca de referências

Esta seção reúne 77 referências de obras e portfólios para a cena “quarto gamer retrô” do Clube dos Jogos: nostalgiacore dos anos 80/90, luz baixa motivada, brilho de TV de tubo, neon como acento e bagunça pessoal de objetos (não é Y2K, Frutiger Aero nem vaporwave puro). A URL principal de cada item (a que está no CSV) foi aberta por mim e conferida contra o que a tabela diz; URLs secundárias citadas no texto e marcadas “não aberto” não contam como verificadas; o que falhou está na seção “Não verificadas / descartadas”.

Como ler: (1) as descrições vêm do texto das páginas, não de inspeção visual das imagens, então a linha “o que aprender” aponta o que a fonte confirma e, quando a luz ou a paleta não estão descritas, diz isso; (2) confiança “verificado” significa que abri a página e confirmei autor, data e conteúdo; “provável” significa que a página existe mas algum ponto (autoria, técnica, licença) não ficou confirmado; (3) a coluna de licença está só no CSV (C-refs.csv) e vale para a imagem, quando visível; a maioria das artes é © dos autores e serve apenas para estudo de clima, técnica e composição, sem reproduzir logos, personagens ou trade dress; (4) itens brasileiros trazem “BR” ou “brasileiro” no tipo ou na fonte (C09, C23, C24, C30).

Resumo por categoria: 3.1: 14 itens; 3.2: 10 itens; 3.3: 7 itens; 3.4: 10 itens; 3.5: 8 itens; 3.6: 17 itens; 3.7: 11 itens.

### Leitura rápida: os 10 mais úteis para esta cena

- C50: quarto 3D navegável em CSS puro, base direta para a prateleira/quarto.
- C51: TV de tubo em CSS puro, com scanlines que reagem ao volume.
- C54: receita mínima de scanlines e brilho em CSS, sem JS.
- C63: CRT cujo conteúdo é HTML real projetado por matrix3d (ideia reaproveitável em CSS).
- C16: quarto de 1987 recriado em museu, com props e sala arcade em neon e blacklight.
- C25: menus gravados em VHS e passados por TVs de tubo.
- C28: quarto e menu como objetos (Unpacking).
- C32: luz baixa motivada por lâmpadas práticas em dimmer (Drive, ASC).
- C39: lista concreta de anacronismos e materiais de época (Halt and Catch Fire).
- C02: penumbra com poeira no ar e props datados num covil de PC.

### 3.1 Quartos gamer retrô, renders, ilustrações e pixel art

Obras de artistas que desenham o quarto-santuário. Itens C01 a C07 são cenas de quarto (3D, digitais) e entrevistas de processo, com muita bagunça pessoal; C08 a C14 trazem paletas alternativas (dourada, neon controlado, pixel art, fotografia noturna). C09 é brasileiro.

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C01 | A Nostalgic Late 1990s Room 3D Environment (projeto “Where does the childhood go?”) | Maria Alekseeva (arte); artigo de Theodore McKenzie, 80.lv, 10/04/2023<br>https://80.lv/articles/a-nostalgic-late-1990s-room-3d-environment | render 3D | Quarto de fim dos anos 90 contado por props (PS1, TV volumosa, CDs de jogos e desenhos): “dezenas de ativos únicos” criam a bagunça pessoal; o texto não descreve a luz, então estude-a direto nas imagens. | verificado |
| C02 | This PC gaming bedroom art is a powerful hit of nostalgia | Rachid Lotf (arte); James Davenport, PC Gamer, 05/08/2019<br>https://pcgamer.com/this-pc-gaming-bedroom-art-is-a-powerful-hit-of-nostalgia | ilustração digital hiper-real | Covil de PC de c. 2004 em penumbra com poeira iluminada no ar, CRT, caixas de jogo em papelão, spindle de CDs, pôsteres, revista e um donut mordido: props datados mais um traço de vida recente tornam a bagunça crível. | verificado |
| C03 | 2000s gaming room – Album Cover | Rachid Lotf (ArtStation); encomenda da Universal Music para capa de álbum, segundo a página<br>https://rachidlotf.artstation.com/projects/68Gdr0 | ilustração / capa de álbum | A página diz que foram feitas duas versões da mesma cena (uma pessoal para o músico, com elementos da infância dele, e outra para a capa): modelo para ter uma cena pública limpa e camadas de easter eggs pessoais do clube. | verificado |
| C04 | PC gamer 1999 – 20th anniversary of GeForce 256 | Rachid Lotf (ArtStation, inferido pelo subdomínio e link para rachidlotf.com); encomenda da Nvidia, segundo a página<br>https://rachidlotf.artstation.com/projects/1nVdJX | ilustração digital | Cena travada em um mês/ano (outubro de 1999), com PC e jogos daquela data: regra útil para o clube, todo prop do quarto deve caber na mesma janela de anos. | verificado |
| C05 | A Nostalgic Q&A with Rachid Lotf | Glitchers Blog (entrevista; data não visível)<br>https://blog.glitchers.com/a-nostalgic-qa-with-rachid-lotf | entrevista / processo | Método declarado: objetos 3D para proporção correta dos props, fotos para capas e pôsteres e pintura para ajustes; em CSS equivale a volumes simples + texturas de capa + camadas de gradiente por cima (LightWave 3D e Photoshop são as ferramentas citadas). | verificado |
| C06 | Glance of 80s (Blender Artists) | Maged Hussen (Maged Afra), Blender Artists Community, 31/03/2021<br>https://blenderartists.org/t/glance-of-80s/1295200 | render 3D (Blender + Substance Painter) | O clima vem da distribuição das luzes: mistura de temperaturas fria e quente, luzes pequenas para levantar sombras muito escuras e tint/efeito vintage aplicado no fim em valores baixos; cena com fita cassete no carpete e tela de jogo estilo Pac-Man (brilho de CRT citado nos comentários). | verificado |
| C07 | Fall into Memory Pool with this Cozy Stylized Scene (“Memories”) | Rino Rubino (Signorlimone); artigo 80.lv, 16/10/2025<br>https://80.lv/articles/fall-into-memory-pool-with-this-cozy-stylized-scene | render 3D (Maya, ZBrush, Substance 3D Painter, V-Ray) | Criança dos anos 90 num quarto atulhado de brinquedos, quadrinhos e jogos de tabuleiro com Commodore 64 e joystick; a intenção declarada é “messy but cozy”; luz e paleta não são descritas no texto. | verificado |
| C08 | Meet Fatih Öztürk, the artist who turns Vice City sunsets and dead Nokias into nostalgic paintings | Fatih Öztürk (arte); Katy Cowan, Creative Boom, 28/07/2026<br>https://www.creativeboom.com/work/fatih-oeztuerk-vice-city-nokia-illustrator/ | pintura digital / ilustração | Paleta quente e dourada com brilho “sunbaked” e camadas de cor com subcamadas ocultas: alternativa de nostalgia sem azul-neon, em que a atmosfera é decidida por camadas e não por um filtro único. | verificado |
| C09 | Neon Nostalgia with a Modern Edge: Bold Illustrations by Bruno Ferreira | Bruno Ferreira (diberkato), artista autodidata do Brasil; The Inspiration Grid, 03/02/2025 (portfólio no Behance citado, não aberto)<br>https://theinspirationgrid.com/neon-nostalgia-with-a-modern-edge-bold-illustrations-by-bruno-ferreira | ilustração (item brasileiro) | Traço de HQ marcado com neon saturado sobre consoles, fitas VHS e tecnologia retrô: exemplo brasileiro de como o neon entra como acento sobre contorno forte (use só o clima, sem reproduzir marcas ou logos citados). | verificado |
| C10 | Generation Gap: retro-inspired digital photography series | Mike Campau; Creative Boom, 06/10/2016<br>https://www.creativeboom.com/work/generation-gap-retro-inspired-digital-photography-series-is-nostalgia-personified-/ | foto + CGI | Props de infância (cassetes, cabos embaraçados, TVs com antena, controle de NES) agrupados em blocos ou cruz sobre gradientes saturados com contornos neon: lição de composição para arrumar objetos, com cuidado para não escorregar para vaporwave puro. | verificado |
| C11 | Futuristic Landscape GIFs (Waneella) | Waneella (artista russa de pixel art); Vice/Creators Project, 12/12/2016 (atualizado 28/07/2024)<br>https://www.vice.com/en/article/futuristic-landscape-gifs-waneella/?nb=1 | pixel art animada | Pixel art montada por grade (“como ponto-cruz”) em loops sutis de cidade e nuvens: pequenos movimentos dão vida a uma cena parada; o texto não descreve paleta nem luz. | verificado |
| C12 | Book Review: Pixelscapes by Waneella | Parka Blogs, 06/06/2025 (livro: Waneella/Valeriya Sanchilo, Thames & Hudson)<br>https://www.parkablogs.com/content/pixelscapes-waneella-artbook-review | livro de arte / pixel art | A resenha nota que o livro reusa o mesmo cenário em esquemas de cor diferentes e prefere paletas escuras e “moody”: base para variar a mesma sala por variáveis CSS (noite, TV ligada, TV desligada). | verificado |
| C13 | Coleção Dribbble “neon + 80s style” | Curadoria de Adam Kapuściński, Dribbble (6 shots de 6 designers, incl. Storm Designs e Max Osichka)<br>https://dribbble.com/AdamKapuscinski/collections/5123752-neon-80s-style | coleção de shots (UI e pôster) | Atalho para ver neon como acento sobre fundo escuro em pôsteres e UI (títulos como “Arcade Stick 80s Retro Gaming Poster” e “Hong Kong’s Neon Glow”); a página só lista títulos, então confira a qualidade shot a shot. | verificado |
| C14 | Liam Wong (fotógrafo e ex-diretor de arte de jogos) | Wikipedia (EN); livros TO:KY:OO (2019) e AFTER DARK (2022), Thames & Hudson<br>https://en.wikipedia.org/wiki/Liam_Wong | foto noturna (bio) | Fotografia noturna com neon feita por ex-diretor de arte da Ubisoft, com Blade Runner, Akira e Ghost in the Shell como influências citadas: use como régua de contraste de neon sobre escuro, não como estilo final (é cidade cyberpunk, não quarto). | verificado |

### 3.2 Fotografia de coleções e museus de games

Fontes de acervo e museus. Há só duas fotos com licença registrada (C18 CC BY-SA 2.0; C19 com domínio público declarado pelo autor, a confirmar); o restante é reportagem sobre exposições. O National Videogame Museum recria quartos dos anos 80, o que é a referência mais direta. C23 e C24 são brasileiros.

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C15 | National Videogame Museum (Frisco, Texas) – site oficial | National Videogame Museum (nvmusa.org)<br>https://www.nvmusa.org/ | site de museu | A página destaca um “1980s Bedroom” recriado com decoração retrô e memorabilia, além de Giant Pong e Head to Head Wall: confirma o quarto-santuário como formato de exposição; há um Virtual Tour linkado (não aberto). | verificado |
| C16 | How a Private Video Game Collection Turned Into a Museum | Matthew Gault, Vice, 17/04/2016<br>https://www.vice.com/en/article/how-a-private-video-game-collection-turned-into-a-museum | reportagem sobre museu | Quarto de 1987 recriado com lençóis de Pac-Man, setup de Duck Hunt e NES e gavetas que abrem, mais uma sala de arcade “neon e blacklight”: props temáticos de cama e luz neon/blacklight como zona separada do quarto. | verificado |
| C17 | Ready Player Fun: A Visit to the National Videogame Museum | Lisa Tate, GeekMom, 25/03/2019<br>https://geekmom.com/2019/03/ready-player-fun-a-visit-to-the-national-videogame-museum | reportagem sobre museu | Três cenários recriados (quarto de meados dos 80, sala do fim dos 70/início dos 80 e balcão de loja de jogos), com props citados como pilha de discos de vinil e o jogo Simon: misture mídias e brinquedos ao lado dos games. | verificado |
| C18 | Pong consoles at National Videogame Museum (arquivo Commons) | Steve Rainwater (steevithak no Flickr), abril/2016; página aberta em espelho do Commons<br>https://download.osmand.net/wiki/File:Pong_consoles_at_National_Videogame_Museum.jpg | foto de acervo | Foto de consoles Pong lado a lado em vitrine de museu: serve de referência de proporção e ritmo de objetos pequenos repetidos (conferi só os metadados, não a imagem). | verificado |
| C19 | Atari 2600 “Woody” (foto de produto) | Evan-Amos (Vanamo Media), arquivo de 23/11/2014; página aberta em espelho do Commons<br>https://download.osmand.net/wiki/File:Atari-2600-Woody-BR.jpg | foto de console em fundo neutro | Foto frontal isolada do console com madeira e quatro chaves: referência limpa de forma, proporção e material para modelar o aparelho em CSS. | verificado |
| C20 | The Collection of the Computerspielemuseum (Play It Again) | Winfried Bergmeyer, ourdigitalheritage.org (Play It Again), 26/05/2014<br>https://ourdigitalheritage.org/hostedArchives/playitagain/the-collection-of-the-computerspielemuseum/index.html | texto sobre acervo (Berlim) | O acervo reúne cerca de 25 mil itens de software e 3,5 mil de hardware: proporção que justifica uma prateleira em que as caixas de jogo dominam e os aparelhos são minoria. | verificado |
| C21 | Pong, Amiga und der Riesen-Joystick: Besuch im Museum für Computerspiele | Patrick Neef, PC Games, 06/02/2011 (em alemão)<br>https://www.pcgames.de/Retrospektive-Thema-214694/Specials/Pong-Amiga-und-der-Riesen-Joystick-Besuch-im-Museum-fuer-Computerspiele-810016/ | reportagem sobre museu | Descreve uma parede cronológica de hardware (Atari, C64, Amiga 500, Mac, Game Boy, PSP) e máquinas interativas como Pong e um joystick gigante: ordem por geração como lógica de arrumação; pouco detalhe de luz. | verificado |
| C22 | Video Game: Atari Centipede (Atari, Inc.) – The Strong National Museum of Play | The Strong National Museum of Play via Google Arts & Culture (objeto 109.7186, 1983)<br>https://artsandculture.google.com/incognito/asset/video-game-atari-centipede-atari-inc/owF5jDEVZGWLRg | registro de acervo / foto de objeto | Ficha de catálogo com fabricante, cidade, ano, material e ID: modelo para a etiqueta de catálogo de cada jogo do clube (número, ano, quem jogou). | verificado |
| C23 | Museu do Videogame: 15 anos de exposição (Tietê Plaza Shopping) | Omelete, 02/02/2026 (item brasileiro)<br>https://www.omelete.com.br/games/museu-do-videogame-15-anos-exposicao-tiete-plaza-shopping | reportagem sobre museu (BR) | Cerca de 500 consoles, incluindo Magnavox Odyssey e o Telejogo Philco-Ford (1977, descrito como o primeiro feito no Brasil): fonte para props nacionais e linha do tempo; a matéria não cita cenários de quarto. | verificado |
| C24 | Brasil tem 1º museu oficial do videogame | Baguete, 15/08/2014 (item brasileiro)<br>https://www.baguete.com.br/noticias/brasil-tem-1o-museu-oficial-do-videogame | reportagem sobre museu (BR) | Museu itinerante de Campo Grande, certificado pelo Ibram, curador Cleidson Lima, cerca de 200 consoles de 42 anos: ponto de partida para checar aparelhos e épocas brasileiras antes de montar a prateleira. | verificado |

### 3.3 Jogos e interfaces que evocam o clima

Só como referência de clima. Cada item registra jogo e estúdio. Os melhores para menus que simulam TV de tubo são C25 (Alien: Isolation) e C26 (Signalis); C28 (Unpacking) é a melhor para quarto e menu como objeto.

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C25 | Alien: Isolation (Creative Assembly) – “Tube TVs, VCRs and magnets give ‘Alien: Isolation’ its signature look” | Estúdio Creative Assembly; Timothy J. Seppala, Engadget, 07/10/2014<br>https://www.engadget.com/2014/10/07/alien-isolation-launch-interview/ | jogo / interface (UI de TV de tubo) | A equipe gravou elementos de UI (menu de inventário, telas de loading com scanlines) em VHS, passou em TVs de tubo e atrapalhou com cabos e ímãs para ter glitches físicos: menus “quentes” e imperfeitos, não filtro digital frio. Só como referência de clima. | verificado |
| C26 | Signalis (rose-engine) – “Arctic horror Signalis is like The Thing reimagined as a 90s cyberpunk anime” | Estúdio rose-engine (Alexander Zwerger e Barbara Wittmann); Natalie Clayton, PC Gamer, 11/06/2021<br>https://www.pcgamer.com/arctic-horror-signalis-is-oozing-with-retro-anime-chills | jogo / interface | Gráficos low-poly estilo PS1 e interface instável com telas vermelhas minimalistas, citando tecnologia analógica à la Alien: Isolation: contraste de um acento único (vermelho) sobre escuro; o texto não menciona efeitos de CRT. | verificado |
| C27 | Hypnospace Outlaw (Tendershoot; publisher No More Robots) – entrevista com Jay Tholen | Steve Haske, Inverse, 21/10/2016; estúdio e datas conferidos em espelho da Wikipedia (kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Dreamsettler)<br>https://inverse.com/article/22494-hynospace-outlaw-jay-tholen-interview | jogo / interface (desktop dos anos 90) | O jogo usa um sistema operacional fictício de estética dos anos 90 como menu (Tholen diz que ele funcionava como “level select”), com animação de baixa resolução e clip-art: menu como objeto de época. O texto da Inverse não fala de CRT nem de cores. | verificado |
| C28 | Unpacking (Witch Beam) – “The making of Unpacking” | Estúdio Witch Beam (Wren Brier e Tim Dawson); Chris Schilling, GamesRadar+/Edge, 04/01/2023<br>https://www.gamesradar.com/the-making-of-unpacking-developer-witch-beam-on-bringing-the-moving-indie-hit-to-life | jogo / interface (cenas de quarto) | Quartos planejados por finalidade narrativa (listas, biografias e planilhas de itens, muitos objetos tirados de pertences dos devs) e UI skeuomórfica: menu de pausa vira lista de tarefas e seleção de arquivo vira álbum de fotos. O artigo não detalha pixel art nem consoles. | verificado |
| C29 | Hotline Miami (Dennaton Games; publisher Devolver Digital) – entrevista GameMaker | Kinga Kwapisz entrevista Jonatan Söderström e Dennis Wedin, GameMaker, 17/11/2022; estúdio e ano (2012, Miami 1989) conferidos em espelho da Wikipedia (ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/Hotline_Miami)<br>https://gamemaker.io/es/blog/hotline-miami-interview | jogo (pixel art neon) | Söderström queria luzes piscando e cores fortes, e isso foi “atenuado” na versão final: dosar o neon, com paleta saturada controlada e sensação psicodélica, em vez de neon por toda parte. O texto não fala de UI nem de efeitos de tela. | verificado |
| C30 | Horizon Chase (Aquiris Game Studio) – “The Creation of Horizon Chase” | Aquiris Game Studio (Porto Alegre, Brasil); Jesús Fabre, 80.lv, 15/01/2016 (item brasileiro)<br>https://80.lv/articles/the-creation-of-horizon-chase | jogo (corrida retrô, estúdio BR) | Homenagem a Top Gear, Out Run e Lotus: a equipe rejeitou pixel art e escolheu polígonos com “cores puras e vibrantes”, uma cena essencialmente 2D que simula 3D; lição de cor chapada e céu em faixas sem imitar pixel. Gradientes e iluminação não são descritos. | verificado |
| C31 | Eastward (Pixpil; publisher Chucklefish) – “Eastward’s creators share insights on making pixel art adventures” | Estúdio Pixpil (Tommo Zhou responde); Bryant Francis, Game Developer, 11/10/2021<br>https://www.gamedeveloper.com/art/eastward-s-creators-share-insights-on-making-pixel-art-adventures | jogo (pixel art com luz) | Cenas 2D reconstruídas em ambiente 3D com mapas de relevo pintados à mão para a luz funcionar, mais camadas de névoa e feixes de sol: a luz entra como camadas sobre assets planos, o que se traduz em CSS com gradientes e blend modes sobrepostos. O artigo não trata de noite ou neon. | verificado |

### 3.4 Filmes e séries: luz e direção de arte de quartos e porões 80s

Material verificável de direção de arte e fotografia: ASC/American Cinematographer, Kodak, British Cinematographer, entrevistas com set decorator e production designer. Não encontrei (ou não consegui abrir) matérias de IndieWire, Vulture ou A.frame; ver lacunas ao final.

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C32 | Drive: Road Warriors (fotografia de Newton Thomas Sigel, ASC) | Jon Witmer, American Cinematographer/ASC (publicado em 10/2011; página de 05/12/2020)<br>https://theasc.com/articles/drive-road-warriors | filme (fotografia, ASC) | Camarim lit só por globos práticos de 40 a 60 W com tint malva, apagando os desnecessários para ganhar contraste; corredores com Kino Flo 3200K e Photofloods em dimmers; paleta “Kodachrome” e muito vermelho: luz baixa motivada por lâmpadas visíveis. O artigo não usa a palavra neon. | verificado |
| C33 | Drive – Cinematography Analysis (Color Culture) | Salik Waquas (colorista), Color Culture, 20/12/2025 (atualizado 04/01/2026); o autor vende pacote de LUTs<br>https://colorculture.org/drive-cinematography-analysis/ | filme (análise de cor) | Rosa e roxo neon contra brilho dourado quente, pretos profundos com sombra sem detalhe e tons de pele preservados: contraste frio/quente com o neon como acento, não como banho geral. Leia com cautela, pois a fonte é comercial. | verificado |
| C34 | Mid90s – entrevista com o diretor de fotografia Christopher Blauvelt (Kodak) | Kodak Motion, 11/02/2019<br>https://www.kodak.com/en/motion/blog-post/mid90s/ | filme (fotografia, estoque e formato) | Super 16 mm em 4:3 para evocar a visão em VHS, subexposição com revelação “pull”, luz disponível e dimmers em interiores: use quadros 4:3 e grão discreto nas telas de TV da cena. | verificado |
| C35 | Tim Ives ASC goes back to the future for Stranger Things 3 | British Cinematographer, 07/08/2019 (autor não nomeado)<br>https://britishcinematographer.co.uk/tim-ives-asc-goes-back-to-the-future-for-stranger-things-3/ | série (fotografia) | Referências E.T. (Allen Daviau) e Terminator 2: noites mais frias com detalhe de sombra visível, LUT menos “murky” e saturação maior permitida pela moda dos anos 80, com visual filmico pré-digital. O artigo não fala de neon nem de práticos. | verificado |
| C36 | Meet the Production Designers Who Built the World of Stranger Things (Up Close, 4ª temporada) | Netflix Tudum, 23/06/2022 (Chris Trujillo, production designer)<br>https://www.netflix.com/tudum/videos/meet-the-production-designers-who-built-the-world-of-stranger-things | série (direção de arte, vídeo/transcrição) | Paleta descrita como “orgânica mas machucada”, com roxos e vermelhos profundos que criam clima pesado, e cenários vividos (locadora, casas): cor escolhida por tema, não por moda. Fonte promocional do estúdio. | verificado |
| C37 | ‘Stranger Things’: Production Design Shines Light on Rainbow Room and the Byers Home in Season Four | Republicado pelo AOL (a página sugere Variety, mas não confirma); sem autor nem ano visíveis<br>https://www.aol.com/stranger-things-production-design-shines-140000692.html | série (direção de arte) | A casa dos Byers é uma “time capsule” com “amarelos e dourados quentes”, e o mural arco-íris da Rainbow Room é ecoado no piso: motivo de cor repetido entre parede e chão. Autoria e data não confirmadas. | provável |
| C38 | Returning Home: How the Byers’ Home in Stranger Things Reflects Narrative and Character Interior Landscape | Jane Barnwell, capítulo em “Production Design & the Cinematic Home” (Springer Nature, 2022, p. 67–87); registro no Westminster Research<br>https://westminsterresearch.westminster.ac.uk/item/x11z5/returning-home-how-the-byers-home-in-stranger-things-2016-duffer-brothers-pd-chris-trujillo-reflects-narrative-and-character-interior-landscape | estudo acadêmico de direção de arte | Analisa a casa como “espaço de transição” e como o interior pequeno muda ao longo da temporada: o quarto como retrato de personagem, útil para decidir o que o dono do site deixa à vista. | verificado |
| C39 | Halt and Catch Fire – entrevista com o set decorator Lance Totten (Parte 1) | Mirror80 (Kate), 09/07/2015<br>https://mirror80.com/2015/07/halt-and-catch-fire-interview-lance-totten/ | série (decoração de set) | Pesquisa com catálogos Sears e JC Penney, troca de itens anacrônicos (termostato plástico, cabo ethernet azul), acabamentos em latão e malva, cúpulas afuniladas, sofá com tubos fluorescentes: lista concreta de erros a evitar e materiais de época. | verificado |
| C40 | Production design of Black Mirror: interview with Joel Collins (episódio San Junipero) | Kirill Grouchnikov, Pushing Pixels, 22/02/2017<br>https://www.pushing-pixels.org/2017/02/22/production-design-of-black-mirror-interview-with-joel-collins.html | série (direção de arte, entrevista) | Os fliperamas e jogos precisaram bater com a década ou até o ano exato, e a referência foram filmes da própria época (Cocktail, Breakfast Club): case cada máquina ao ano da cena. A entrevista não trata de neon nem de paleta. | verificado |
| C41 | Apotheosis Podcast Episode 8: Chris Trujillo | Production Designers Collective (PDC), 16/01/2026 (host Alexander Whittenberg)<br>https://www.productiondesignerscollective.org/apotheosis-podcast-episode-8-chris-trujillo/ | série (podcast com production designer) | A página resume o “lived-in realism” dos espaços domésticos de Stranger Things e a dificuldade de ancorar o espetáculo em ambientes críveis; é só a ficha do episódio, o conteúdo está no áudio. | verificado |

### 3.5 Embalagens, caixas de jogo e capas de VHS

Para ler composição, tipografia de capa, selos e etiquetas, nunca para copiar. As artes são de terceiros e os acervos não concedem reuso. Sem acesso direto ao Internet Archive e ao Commons nesta rodada (ver não verificadas).

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C42 | New Book on the Totally Awesome VHS Video Cover Art of the 80s and 90s (livro VHS: Video Cover Art, 1980s to Early 1990s) | CreativePro, 13/05/2015; livro de Thomas “The Dude Designs” Hodge, Schiffer (264 p., 240+ capas UK de frente e verso); página da editora Draw Down também lista o livro (https://draw-down.com/products/vhs-video-cover-art)<br>https://creativepro.com/new-book-on-the-totally-awesome-vhs-video-cover-art-of-the-80s-and-90s | embalagem (VHS), livro | Livro tratado como “Arca de Noé” de gráficos e tipografia dos anos 80, com frente, verso e lombada: observe peso de título, texto de venda exagerado no verso e hierarquia de selos; é para ler composição, não copiar. | verificado |
| C43 | VHS: Video Cover Art (Neatorama) | Miss Cellania, Neatorama, 30/04/2015<br>https://neatorama.com/spotlight/2015/04/30/VHS-Video-Cover-Art | embalagem (VHS), artigo | Cita ilustradores de capa (Enzo Sciotti, Renato Casaro, Brian Bysouth, Graham Humphreys, Laurent Melki) e o repertório recorrente de explosões, músculos e monstros: nomes para pesquisar e uma gramática de capa pensada para chamar atenção em locadora. | verificado |
| C44 | Atari 400/800 Box and Manual Artwork, 1979–1981 | K.E. Roberts, We Are The Mutants, 20/09/2017 (imagens vindas de Atari Age, Atari Mania e Internet Archive)<br>https://wearethemutants.com/2017/09/20/atari-400800-box-and-manual-artwork-1979-1981/ | embalagem (caixa e manual) | O texto descreve o estilo da casa de Cliff Spohn como “realismo expressionista” com bordas borradas e “action montage” de várias cenas num só quadro (autores citados: Rick Guidice, Steve Hendricks, Michel Allaire); a página não trata de licença de reuso. | verificado |
| C45 | ColecoBoxArt | Mantido por um indivíduo identificado como “VG” (colecoboxart.com)<br>https://colecoboxart.com/ | arquivo de caixas escaneadas | Site de escaneamentos de caixas de ColecoVision e ADAM, incluindo versões europeias: compare versões regionais da mesma caixa para ver o que muda em layout e selos; o site não traz aviso de licença. | verificado |
| C46 | [Retro Scan] The 1989 Game Boy Box | Vintage Computing and Gaming (VC&G), 10/02/2021 (site de Benj Edwards; sem assinatura na página)<br>https://www.vintagecomputing.com/index.php/archives/tag/box-art | embalagem (caixa, escaneamento) | Escaneamento em alta resolução de frente e verso da caixa: o verso traz frases de venda (“Multiple Player Action”) e legenda com irmãos jogando juntos, um bom modelo de texto de verso e foto de uso para as caixas do clube. | verificado |
| C47 | Relive the heyday of big box PC games with this virtual collection (Big Box Collection) | TechSpot; coleção de Benjamin Wimmer (600+ caixas escaneadas em banco de dados 3D)<br>https://www.techspot.com/news/85270-relive-heyday-big-box-pc-games-virtual-collection.html | embalagem (big box PC), acervo digital | Coleção de mais de 600 caixas grandes de PC em visualização 3D: referência direta de volumetria e proporção para caixas numa prateleira 3D. A matéria não informa licença. | verificado |
| C48 | The VGHF Library opens in early access | Video Game History Foundation (gamehistory.org), 30/01/2025<br>https://gamehistory.org/vghf-library-launch/ | arquivo digital (revistas, catálogos, anúncios) | Mais de 1.500 revistas, catálogos, anúncios e press kits, de acesso gratuito e sem direito de reprodução garantido (apoia-se em fair use): leia diagramação de anúncios e selos de época, sem copiar arte. | verificado |
| C49 | 40+ Retro Video Game Posters & Artwork for Nostalgia | Jake Rocheleau, Speckyboy, 27/12/2017 (atualizado 16/05/2024)<br>https://speckyboy.com/retro-video-game-posters-and-official-artwork.md | embalagem, pôsteres e anúncios (galeria) | Galeria de pôsteres, anúncios impressos, páginas de revista, caixas e manuais; as imagens são de contas do Flickr sem créditos de artista nem licença, então use só para ler composição e depois busque a fonte primária. | verificado |

### 3.6 Sites e portfólios interativos de quarto/cena (CSS puro primeiro)

O dono só pode usar CSS, SVG e JS puro. Itens C50 a C58, C61 e C62 são CSS (puro ou quase); C59 e C60 usam CSS 3D com JS leve; C63 a C65 usam Three.js e entram só como referência de composição, objetos e interação (cada linha diz a tecnologia).

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C50 | Creating a 3D world in pure CSS | Gareth Heyes, PortSwigger Research, 13/10/2021 (demo e fonte linkados na página: portswigger-labs.net/tutorials/3d-css-tutorial e github.com/PortSwigger/3d-css-tutorial, não abertos)<br>https://portswigger.net/research/creating-a-3d-world-in-pure-css | site/tutorial (CSS puro, sem JS) | Quarto 3D navegável com paredes, piso e teto posicionados por transform em cena preserve-3d, gradientes como textura, clip-path para abrir uma porta e navegação por :target e :focus: base exata para a prateleira/quarto do clube sem nenhuma biblioteca. | verificado |
| C51 | CodePen TV secrets (TV de tubo em CSS puro) | Ben Evans (ivorjetski), dev.to (pen embutido: codepen.io/ivorjetski/embed/qEaRjBw, não aberto); sem ano visível<br>https://dev.to/ivorjetski/codepen-tv-secrets-fib | CodePen/artigo (CSS puro, sem JS nem Sass) | TV de tubo só com CSS: corner-shape squircle para o formato do tubo, volume que desloca as scanlines como interferência, reflexo de janela com bordas tracejadas repetidas e luz da imagem oposta à luz do aparelho; sem ruído branco, que exigiria JS. | verificado |
| C52 | CodePen Designs 40: 3D first-person art gallery – No JavaScript | Pen de ivorjetski (provável, pelos links da página); post de Jon Snow (jon_snow789), dev.to, 23/02/2023<br>https://dev.to/jon_snow789/codepen-designs-40-3d-first-person-art-gallery-no-javascript-418l | CodePen/artigo (CSS quase puro) | Galeria em primeira pessoa quase toda em CSS (só as obras são imagens, para não sobrecarregar o navegador): prova de que um corredor 3D com quadros nas paredes roda sem JS; a página não detalha a técnica. | verificado |
| C53 | The Backrooms: CSS Edition (CodePen) | Ben Evans, citado na lista “10 cool CodePen demos” de Alvaro Montoro (06/2025); pen em si não aberto<br>https://alvaromontoro.com/10-cool-codepen-demos/2025/06/ | CodePen (CSS + Sass, sem JS segundo a lista) | Sala 3D tipo labirinto com luzes fracas e sombras que se movem, feita em HTML, CSS e Sass: referência de luz baixa e sombra animada em CSS 3D (não é retrô). | provável |
| C54 | Dark theme, CSS scanlines, Orbitron: retro aesthetics without a single line of JS | Odilon Hugonnot, web-developpeur.com, 11/03/2026<br>https://www.web-developpeur.com/en/blog/retro-consoles-css-scanlines-dark-theme | artigo/site (CSS puro) | Scanlines por repeating-linear-gradient a 0,08 de opacidade num ::before fixo com pointer-events none, brilho ciano por box-shadow via variável e tema escuro (#0a0a0f): receita mínima de CRT para a página inteira, sem JS. | verificado |
| C55 | Retro CRT terminal screen in CSS + JS | Edwin (ekeijl), dev.to, 21/02/2020<br>https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh | artigo (CSS + JS vanilla) | Scanlines por linear-gradient de 8 px, text-shadow animado para separação de cor, moldura do tubo por border-image e uma linha lenta que cruza a tela a cada 10 s; o autor evitou o efeito de flicker por cansar a vista: bom argumento para acessibilidade. | verificado |
| C56 | CRT Screen Text Flicker Animation in Pure CSS | Patrick H. Lauke (@patrickhlauke), CodeMyUI, 14/01/2020<br>https://codemyui.com/crt-screen-text-flicker-animation-in-pure-css/ | CodePen (CSS puro) | Animação de flicker em CSS puro com leve tom verde: referência de efeito de tela; trate com prefers-reduced-motion, pois flicker pode incomodar. A página não declara licença. | verificado |
| C57 | CSS & JavaScript Snippets for Retro Computing (lista com Tandy CRT, C64 na TV, Amiga) | Speckyboy; pens de Kevin Falencik (Tandy CRT com brilho por gradiente CSS), The Brutal Tooth (C64 na TV), Piotr Bosak (Amiga Kickstart) e outros; os pens não foram abertos<br>https://speckyboy.com/css-javascript-snippets-retro-computing.md | lista de CodePens | Mapa de pens de computação retrô com autores nomeados, incluindo um monitor CRT monocromático com “glare” feito por gradiente CSS: ponto de partida para achar o código-fonte de efeitos de tela. | verificado |
| C58 | Snippets: old school tech (isometric vintage computer, Pac-Man cabinet CSS, Walkman) | Speckyboy; pens de Andreas Pihl (sobrenome truncado na página), Louis Coyle, Adam Kuhn, Clément Roche, Avaz Bokiev e CreateJS; os pens não foram abertos<br>https://speckyboy.com/snippets-old-school-tech.md | lista de CodePens | Lista de objetos retrô em HTML+CSS (computador isométrico 3D, gabinete de fliperama 3D, Walkman interativo, overlay de VHS, telefone de carro em 3D); a página só confirma CSS em três itens, então verifique cada pen antes de adotar. | verificado |
| C59 | Interactive Room Display (Codrops, 2015) | Codrops (Tympanus); autor não explicitado, inspirado no shot “Spaces” de Bilal Mechairia (Dribbble)<br>https://tympanus.net/codrops/2015/11/10/interactive-room-display/comment-page-2/ | experimento (CSS 3D, sem lib nomeada) | Em vez de um quarto 3D real, o efeito corta imagens de parede em arestas limpas e gira os pedaços em preserve-3d, com leve rotação pelo mouse: perspectiva falsa barata para uma cena com objetos que flutuam e abrem detalhes ao clique. | verificado |
| C60 | CodePenChallenge: 100 DIVs – Living Room | Takane Ichinose, dev.to, 09/09/2020 (pen embutido, não aberto)<br>https://dev.to/takaneichinose/codepenchallenge-100-divs-living-room-3l5d | CodePen/artigo (CSS 3D + JS vanilla) | Sala 3D feita com exatamente 100 divs, com mixin 3D em Pug/SCSS e controle por JS vanilla (inclusive toque): mostra o orçamento de elementos de uma cena de sala em CSS; não é CSS puro e o texto não lista cores ou props. | verificado |
| C61 | crt-css (fork de D3nn7/crt-css) | Torodem (fork) / D3nn7 (original), GitHub; credita pen de Patrick H. Lauke<br>https://github.com/Torodem/crt-css | repositório (efeito CRT em CSS) | Efeito CRT para sites em CSS, com demo em d3nn7.github.io/crt-css; o README diz não precisar de licença e que pode ser usado sem restrições, mas a página não confirma quais efeitos (curvatura, scanlines, flicker, brilho) inclui. | provável |
| C62 | Pure CSS Magic: How to Build a Realistic 3D Office Experience | Nizzad (mohamednizzad), dev.to, 26/07/2025 (repo github.com/mohamednizzad/Pure-CSS-Magic- citado, não aberto)<br>https://dev.to/mohamednizzad/pure-css-magic-how-to-build-a-realistic-3d-office-experience-h76 | artigo (CSS puro, cena 3D de escritório) | Cena 3D animada só com CSS: perspective de 1500 px, preserve-3d, backdrop-filter com rgba para vidro, box-shadow suave para profundidade e gradientes para telas; não é retrô, serve como estudo de profundidade e luz em CSS. | verificado |
| C63 | A low-poly room where you fly into the CRT | HeyArio, fórum three.js, 07/07/2026; site arioalavi.com (Three.js r149, sem framework)<br>https://discourse.threejs.org/t/a-low-poly-room-where-you-fly-into-the-crt/92694 | portfólio interativo (usa Three.js) | Quarto low-poly com CRT que liga e leva a câmera para dentro da tela; o terminal é um elemento HTML real mapeado na tela por homografia matrix3d (técnica reproduzível em CSS puro) e há temas de fósforo verde, âmbar e ciano. Usa 3D lib, só como referência. | verificado |
| C64 | Portfólio com Mac System 7, CRT e Famicom (post no fórum three.js) | c_na, fórum three.js, 15/10/2026; site c-na.dev (React Three Fiber, three.js r182)<br>https://discourse.threejs.org/t/my-portfolio-is-a-retro-workshop-desk-you-can-actually-use/95359 | portfólio interativo (usa Three.js) | Mesa com disquetes como projetos, Mac, CRT e Famicom, e um abajur com ponto de luz real que liga e desliga: um único prático controlável dá o clima de luz baixa. Usa 3D lib, só como referência de objetos e interação. | verificado |
| C65 | 3D portfolio: recreation of my childhood bedroom | Yuming, fórum three.js, 24/06/2025; site yuminghuang.com; inspirado no portfólio de Henry Heffernan<br>https://discourse.threejs.org/t/3d-portfolio-inspired-by-henry-heffernans-portfolio/84457 | portfólio interativo (usa Three.js) | Recriação 3D do quarto de infância do autor, com shaders e pós-processamento; o post cita controles de câmera e técnica de iframe do portfólio de Henry Heffernan (repositório github.com/henryjeff/portfolio-website, não aberto). | verificado |
| C66 | CodePen Designs 4: 3D Room – Pure CSS | Pen de ricardoolivaalonso (embed codepen.io/ricardoolivaalonso/embed/mdPzrpe, não aberto); post de Jon Snow, dev.to, 18/12/2022<br>https://dev.to/jon_snow789/codepen-designs-4-3d-room-pure-css-334e | CodePen/artigo (CSS puro segundo o título) | Sala 3D que o título chama de CSS puro; a página só embute o pen e não descreve técnica, luz ou props, então confirme no código antes de usar. | provável |

### 3.7 Arte de música synthwave/retrowave

Capas, artistas de capa, selos e visual de clipes. Verificados por entrevistas, resenhas e verbetes; não consegui abrir Bandcamp nem Discogs, então as capas em si devem ser vistas por quem for usá-las como referência.

| id | título | autor/fonte (com URL) | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| C67 | OutRun (álbum de Kavinsky, 2013) – ficha na Wikipedia | Wikipedia (EN); gravadoras Record Makers, Vertigo e Mercury<br>https://en.wikipedia.org/wiki/OutRun_(album) | capa de álbum (créditos) | Créditos da arte: conceito e fotografia por The Directors Bureau Special Projects, direção de arte de Charlotte Delarue, manipulação de imagem de Adrien Blanchat e layout de Graphame; conceito de Ferrari Testarossa de 1986 e jogo OutRun. A página não traz imagem nem descreve a capa. | verificado |
| C68 | Vinyl Review: Kavinsky – OutRun | James Eldred, Mostly Retro, 28/05/2013<br>https://mostly-retro.com/2013/05/28/vinyl-review-kavinsky-outrun/ | embalagem de LP / capa de álbum (resenha) | O gatefold interno supera a capa e o encarte traz imagens como stills de filme; a tipografia lembra a de um disco de trilha sonora, dando cara de trilha de filme que nunca existiu: trate cada embalagem como cena de cinema. | verificado |
| C69 | Interview with Perturbator’s artistic director and artist Ariel Zucker-Brull | V13.net, julho/2016 (data pelo endereço; a página não mostra)<br>https://v13.net/2016/07/interview-with-perturbator-the-band-s-artistic-director-and-artist-ariel-zucker-brull/ | entrevista com ilustrador de capas | Processo: ouvir a música, conversar com a banda e, nesta capa, pular os thumbnails para não travar a imagem; influências de quadrinhos dos anos 90 (artistas da Image, como Jim Lee). Lição de direção de arte guiada pelo som. | verificado |
| C70 | Perturbator interview 2016 (Vice) – álbum The Uncanny Valley | Jeff Treppel, Vice, 02/05/2016<br>https://www.vice.com/en/article/ryz7zy/perturbator-interview-2016 | entrevista / capa de álbum | Capa que “causou controvérsia”, quadrinho de Ariel ZB na edição deluxe e álbum com fio visual narrativo: arte de música como mundo contínuo; a entrevista não descreve cores ou composição. | verificado |
| C71 | Future Perfect (entrevista com o designer Overglow) | Grafik, 30/05/2014 (autor não identificado)<br>https://grafik.net/future-perfect | entrevista / capas e pôsteres retrô | Designer sob o pseudônimo Overglow usa imagens de italo-disco, cartuchos de Game Boy e Mega Drive e anúncios dos anos 80, e empilha estilos e texturas; na capa Never Say Never usa close-up sorridente, fundo neutro e tipografia deliberadamente pouco refinada. | verificado |
| C72 | Outrun: the aesthetic deconstructed | cywjoel, Medium (autor e data não informados na página)<br>https://medium.com/@cywjoel/outrun-the-aesthetic-deconstructed-dbd3cd8679b7 | ensaio de estética | Desmonta o look: ciano e magenta sobre mais preto que branco (ligados à placa CGA de 1981), grade de perspectiva (Tron), sol enorme com linhas horizontais em degradê amarelo-vermelho e tipos script ou cromados: use como lista do que dosar, já que o brief não é outrun puro. | verificado |
| C73 | Incredible Retro 80’s Inspired Synthwave & Outrun Artwork | Raindrops Insider (beehiiv), 23/11/2019<br>https://raindrops-insider.beehiiv.com/p/incredible-retro-80s-inspired-synthwave-outrun-artwork | roundup de artistas | Nomeia nove artistas para pesquisar o portfólio (Eduardo Del Pozo, Flore Maquin, Signal Noise, Kenzo Deckard, Liam Wong, Ralf Krause, Sakke Soini, Sam Todhunter, The Zonders) e resume motivos como grades laser, sóis de neon, palmeiras e texto cromado; a página só linka Sakke Soini. | verificado |
| C74 | Atomcyber: The Atombomb | Samurai Punk (Substack), 16/04/2023<br>https://samuraipunk.substack.com/p/atomcyber-the-atombomb | entrevista com ilustrador de capas | Ilustrador e quadrinista francês autodidata que fez capa para o músico synthwave Ace Buchannon (“Magenta Nights”): neon, flash e influência de quadrinhos dos anos 80 (Heavy Metal, 2000AD); mostra o lado ilustrado, mais quente que o outrun fotográfico. | verificado |
| C75 | An Interview with Michael Glover AKA Miami Nights 1984 | Joe O’Brien, VW Music Rocks, 31/03/2021<br>https://vwmusicrocks.com/a-conversation-with-michael-glover-aka-miami-nights-1984/ | entrevista (selos, vinil e estética) | O artista diz que música e estética gráfica têm peso “meio a meio”, fala do apelo do formato físico e do cuidado com cores e design do vinil, e cita a Valerie Collective: o visual é metade do produto. O texto não descreve capas específicas. | verificado |
| C76 | How synthwave music inspired games to explore a past that never existed | Phil Iwaniuk, PC Gamer, 04/10/2017<br>https://www.pcgamer.com/uk/how-synthwave-music-inspired-games-to-explore-a-past-that-never-existed | artigo (música, jogos e visual) | Liga Kavinsky, Perturbator e Hotline Miami a jogos como Far Cry 3: Blood Dragon, com tipografia e paleta de fim dos 80 em rosa sobre azul-escuro; menciona a capa de OutRun (Testarossa e palmeiras) e o pôster de Drive, mas não nomeia os designers. | verificado |
| C77 | Valerie Collective (selo/coletivo de Nantes) | Wikipedia (EN)<br>https://en.wikipedia.org/wiki/Valerie_Collective | selo / coletivo (verbete) | Coletivo fundado em 2007 por David Grellier, com College, Anoraak, The Outrunners e outros, e releases por selos como FVTVR e Endless Summer Recordings; o verbete não trata de identidade visual, então use só para achar capas no Bandcamp e no Discogs. | verificado |

### 3.8 Contexto brasileiro (ids A01–A31, da trilha de história e terminologia)

Trinta e uma referências sobre locadoras, Master System/Mega Drive/Super Nintendo no Brasil, clones e pirataria, fliperamas, lan houses, museus, revistas e cantinhos retrô. São fontes de **contexto cultural**, não de imagem. Nota: A27 e A28 são matérias de veículo brasileiro sobre cantinhos retrô de gamers (A27 é de um gamer ucraniano); A12 e A30 são páginas da Wikipédia em inglês (a em português não apareceu nas buscas).

| id | título | autor/fonte | tipo | o que aprender | confiança |
|---|---|---|---|---|---|
| A01 | [Saudades gamer: como as locadoras de videogames funcionavam](https://www.tecmundo.com.br/voxel/263983-saudades-gamer-locadoras-videogames-funcionavam.htm) | TecMundo | artigo | Por que locadoras existiam, carteirinha em várias lojas (Progames, Dimensão Games, Blockcuster), game sallons, campeonatos, declínio com PS1 e consoles destravados | [provável] |
| A02 | [Jogos de locadora para Mega Drive que definiram a infância](https://canaltech.com.br/games/jogos-de-locadora-para-mega-drive-que-definiram-a-infancia) | Canaltech | artigo | Ritual de fim de semana, locais improvisados (garagens, salões), fila para ver fatalities, TVs de tubo com som alto, ranking de títulos | [provável] |
| A03 | [Coisas nostálgicas que todo gamer brasileiro já viveu](https://canaltech.com.br/games/coisas-nostalgicas-que-todo-gamer-brasileiro-ja-viveu/) | Canaltech | artigo | Locadora sábado a segunda, feira do rolo (troca 1x1 ou 2x1), camelô 3 jogos por R$ 10, soprar cartucho, memory card, detonados em revistas | [provável] |
| A04 | [Mega Drive ou Super Nintendo: qual foi mais popular no Brasil nos anos 1990](https://canaltech.com.br/games/mega-drive-ou-super-nintendo-qual-foi-mais-popular-no-brasil-nos-anos-1990/) | Canaltech | artigo | Datas de lançamento (dez/1990 e ago/1993), preços em salários mínimos, aluguel de R$ 2 a R$ 5 por fim de semana, vendas divergentes e mercado paralelo | [provável] |
| A05 | [O que foi a guerra de consoles nos anos 1990](https://canaltech.com.br/games/o-que-foi-a-guerra-de-consoles-nos-anos-1990/) | Canaltech | artigo | Brasil como caso à parte: Tectoy e Mega Drive em 1990, Playtronic e SNES em 1993, localização de jogos | [provável] |
| A06 | [Master System comemora 30 anos no Brasil](https://olhardigital.com.br/2019/09/04/noticias/master-system-comemora-30-anos-no-brasil/) | Olhar Digital | artigo | Lançamento em 04/09/1989 pela Tectoy, marketing (TV, revistas, clube, hotline de dicas), jogos localizados, Playtronic em mar/1993 | [provável] |
| A07 | [Master System (acervo/gamepedia)](https://bojoga.com.br/acervo/consoles-de-mesa/geracao-3/master-system) | Instituto Bojogá (Vivian Kim; atualizado por Daniel Gularte) | museu/acervo | Museu/centro de estudos brasileiro de videogame; história do Master System no Brasil, acessórios, jogos nacionais; cifras de vendas não verificadas | [provável] |
| A08 | [Master System no Brasil: por que vendeu por tantos anos](https://canaltech.com.br/games/master-system-no-brasil-por-que-vendeu-por-tantos-anos/) | Canaltech | artigo | Reserva de mercado até 1991, clones (Phantom System), jogos localizados (Sapo Xulé, Chapolin, Didi), 16 versões, 8 milhões de unidades até 2016, console como presente nostálgico | [provável] |
| A09 | [Videogames no Brasil: mercado nacional, padrões técnicos, circularidade e recepção entre o público consumidor (1983-2002)](https://repositorio.ufu.br/bitstream/123456789/25897/1/VideogamesNoBrasil.pdf) | Fernando Alex Turatti das Virgens (monografia de História, UFU, 2019) | artigo | Cronologia em ondas: Telejogo 1977, 250+ locadoras em SP em 1984, Phantom System nov/1989, Mega Drive, Ação Games, Progames 1991, Playtronic; usa revistas Micro & Video e Ação Games (li só os primeiros 100 mil caracteres) | [provável] |
| A10 | [Como a pirataria popularizou os jogos no Brasil](https://canaltech.com.br/games/como-a-pirataria-popularizou-os-jogos-no-brasil-198789/) | Canaltech | artigo | Clones e contrabando, Phantom System como clone do NES, Gradiente passa a representar a Nintendo, Bomba Patch, camelôs | [provável] |
| A11 | [Documentário contará a história das revistas de videogames no Brasil](https://www.hardware.com.br/noticias/2023-03/documentario-contara-a-historia-das-revistas-de-videogames-no-brasil.html) | William R. Plaza, Hardware.com.br (24/03/2023) | artigo | Projeto ZeroQuatroMídia + WarpZone no Catarse; revistas citadas: Ação Games, Super GamePower, Gamers, Nintendo World; clones por reserva de mercado | [provável] |
| A12 | [Ação Games](https://en.wikipedia.org/wiki/A%C3%A7%C3%A3o_Games) | Wikipédia (en) | artigo | Revista 1991-2002 (dez/1990 como especial de A Semana em Ação; mensal pela Editora Azul em out/1991); dicas de fase; fusão Super Game e Game Power em 1994 | [provável] |
| A13 | [A decadência dos fliperamas](https://wp.ufpel.edu.br/empauta/a-decadencia-dos-fliperamas/) | Daniel Corrêa, Helena Mendonça e Juliana Escouto, Em Pauta (UFPel, 13/07/2016) | artigo | Fliperamas e locadoras como espaços sociais, jogos de luta nos anos 90, decadência com internet; texto jornalístico estudantil | [incerto] |
| A14 | [Insert Coin: The Arcade in Brazil, Then and Now (Insira Ficha: O Fliperama no Brasil Ontem e Hoje)](https://www.thevideogamelibrary.org/book/insert-coin-the-arcade-in-brazil-then-and-now) | Augusto Almeida, Bitnamic Press (2025); página em The Video Game Library | artigo | Livro sobre fliperamas no Brasil: auge do fim dos anos 70 aos 90, pais desaprovando, máquina Fantastic (Taito do Brasil); li só a página da loja/biblioteca, não o livro | [incerto] |
| A15 | [Counter-Strike e a popularização das tecnologias digitais no Brasil](https://periodicos.ifg.edu.br/cehd/article/download/1476/1665/5668) | Yago Nascimento e Suely Fragoso (UFRGS), CONEHD v.1 n.5, 2024 | artigo | Lan houses: Monkey Paulista 1998, ~108 mil em 2010, inclusão digital, sociabilidade, preconceito, declínio por volta de 2010 | [verificado] |
| A16 | [10 jogos que marcaram lan houses brasileiras nos anos 2000](https://www.hardware.com.br/games/10-jogos-que-marcaram-lan-houses-brasileiras-nos-anos-2000/amp/) | Hardware.com.br | artigo | Ambiente (PCs enfileirados, cliques e comemorações) e lista de jogos (CS 1.6, GTA SA, Ragnarök, Tibia, NFS Underground 2, WoW, DotA, Habbo) | [provável] |
| A17 | [Counter-Strike quase foi meu trabalho e criava discórdia até com meu chefe](https://tecnoblog.net/especiais/counter-strike-quase-foi-meu-trabalho-e-criava-discordia-ate-com-meu-chefe/) | Felipe Vinha, Tecnoblog | artigo | Relato pessoal: lan houses como ponto de encontro nos anos 2000, pacote Corujão, cyber café de shopping; data original não informada | [incerto] |
| A18 | [Brasil tem 1º museu oficial do videogame (Ibram)](https://www.baguete.com.br/noticias/brasil-tem-1o-museu-oficial-do-videogame) | Baguete (15/08/2014) | museu/acervo | Museu do Videogame (itinerante, Cleidson Lima), certificado pelo Ibram, ~200 consoles de 1972 em diante | [provável] |
| A19 | [Festival Retro Gaming Brasil mantém viva a história dos jogos no país](https://canaltech.com.br/games/festival-retro-gaming-brasil-mantem-viva-a-historia-dos-jogos-no-pais-140443) | Canaltech (30/05/2019) | artigo | Evento presencial em SP, ligado ao podcast RGB Inside e a Fábio Santana; arcades, consoles ligados a TVs atuais; depoimentos de ex-Tectoy e jornalistas de revistas | [provável] |
| A20 | [O fenômeno retrô nos jogos eletrônicos: fatores que mudaram a percepção dos jogadores](https://www.sbgames.org/sbgames2012/proceedings/papers/artedesign/AD_Full22.pdf) | Bernardo Lima Mendes (PUC-Rio), SBGames 2012, trilha Arte e Design | artigo | Por que o retrô cresceu desde 2008; nostalgia como segurança do familiar; menciona pirataria e emulação no Brasil | [verificado] |
| A21 | [Identidade, nostalgia e memória afetiva no consumo de videogames retrô](https://www.redalyc.org/journal/5044/504459802011/504459802011.pdf) | Felipe Correa de Mello e Vicente Martin Mastrocola (ESPM), Interin v.24 n.2, 2019 | artigo | Mercado brasileiro de retrogames, memória afetiva, nostalgia também em quem não viveu 8/16 bits, cultura da memória (Huyssen) | [verificado] |
| A22 | [Válvula de escape: games retrô estão de volta, graças à geração Z](https://fastcompanybrasil.com/games/valvula-de-escape-games-retro-estao-de-volta-gracas-a-geracao-z/) | Eve Upton-Clark, Fast Company Brasil (04/03/2025) | artigo | Dados de pesquisa britânica (Pringles) sobre retrô como desconexão; não traz dados do Brasil nem amostra | [incerto] |
| A23 | [Relembre brinquedos dos anos 80 e 90 que marcaram gerações](https://dol.com.br/entretenimento/942768/relembre-brinquedos-dos-anos-80-e-90-que-marcaram-geracoes) | DOL (Diário Online) | artigo | Console novo no Natal como evento familiar; Master System, Mega Drive e SNES entre os brinquedos de época | [incerto] |
| A24 | [A Belém raiz: do Dinossauro das Superlojas à magia da Radiolux](https://diariodopara.com.br/belem/a-belem-raiz-do-dinossauro-das-superlojas-e-da-magia-da-radiolux/) | Diário do Pará | artigo | Locadoras de games de Belém (Soft Game, Fox Vídeo; a última fechou no início de 2023); nada sobre fliperama | [incerto] |
| A25 | [Videolocadoras de João Pessoa, parte 1](https://auniao.pb.gov.br/noticias/colunistas/andre-cananea/videolocadoras-de-joao-pessoa-parte-1) | André Cananéa, A União (PB) | artigo | Só locadoras de filme em VHS nos anos 80/90; útil como atmosfera de locadora, NÃO fala de videogame | [incerto] |
| A26 | [Porão vira sala gamer com 900 jogos](https://www.hardware.com.br/games/porao-sala-gamer-900-jogos/) | Hardware.com.br | artigo | Sala retrô real: CRT Trinitron 32, switchers, S-Video/composto, LED dimerizável; decoração inspirada no NES (paredes cinza com preto e vermelho) | [incerto] |
| A27 | [Gamer ucraniano cria um cantinho retrô caprichado](https://www.hardware.com.br/noticias/setup-gamer-ucraniano/amp/) | Hardware.com.br | artigo | Cantinho retrô: Trinitron 25 como centro visual, painéis perfurados, LED em U na estante, seletores de vídeo, plantas | [incerto] |
| A28 | [Esse cantinho gamer retrô é simplesmente incrível](https://www.hardware.com.br/?p=273686) | Hardware.com.br | artigo | Cantinho de usuário do Reddit: arcade de Super Mario, poltrona, CRT, estantes de jogos de PC em caixa, acessórios Nintendo; iluminação retrô não descrita | [incerto] |
| A29 | [RetroGamesBR - RetroArch Multi (listagem Discord)](https://discord.me/retrogamesbr) | discord.me | site | Comunidade brasileira de retrogames multijogador com RetroArch; só li a listagem, não entrei no servidor | [incerto] |
| A30 | [Tectoy](https://en.wikipedia.org/wiki/Tectoy) | Wikipédia (en) | artigo | Fundação em set/1987, fábrica em Manaus, Master System set/1989, Mega Drive dez/1990, concordata 1997-2000, Zeebo; números de vendas para cruzar | [provável] |
| A31 | [How clones and copycats shaped the Brazilian games industry](https://gamedeveloper.com/business/how-clones-and-copycats-shaped-the-brazilian-games-industry) | Chris Kerr, Game Developer (22/11/2016) | artigo | Phantom System da Gradiente compatível com NES, Nintendo passa a vender no Brasil com ajuda da Gradiente; clones e arcades copiados | [provável] |

### 3.9 Onde estão as demais referências

O arquivo `referencias.csv` reúne **todas** as 260 linhas: A01–A68 (terminologia, Aesthetics Wiki, nostalgia, Brasil), B01–B61 (luz, cor, textura, props, fontes), C01–C77 (esta biblioteca visual) e D01–D54 (MDN, web.dev, WCAG, leis, licenças). Cada seção do dossiê cita os ids que usa.

### Observações de uso e licença

- Fotos com licença livre registrada: C18 (CC BY-SA 2.0, exige atribuição a Steve Rainwater e compartilhamento pela mesma licença) e C19 (a página-espelho não nomeia licença; o texto diz que a Vanamo Media cria obras de domínio público para fins educacionais; confirme no Commons antes de reutilizar). C18 e C19 foram abertas em espelhos do Commons (download.osmand.net); o endereço canônico do Commons não pôde ser aberto.
- Todo o restante são imagens protegidas ou sem licença declarada: use para estudo de clima, luz, paleta e composição.
- Itens com marcas (consoles, jogos, filmes) servem para o clima e a técnica; não reproduza logos, personagens ou trade dress.
- C33 vem de um colorista que vende pacote de LUTs; C42 e C43 tratam de capas de VHS do Reino Unido, útil para tipografia e selos, não para o repertório brasileiro de locadora (que é da trilha A).

### Não verificadas / descartadas

Não contam entre os 77 itens. Motivo entre parênteses.

- commons.wikimedia.org (Category:Magnavox_Odyssey: página não encontrada pelo fetch; File:Consoles-computerspielemuseum.jpg: fora da lista de endereços permitidos). Também falharam os espelhos Www.wikipedia.org/wiki/File: Ausstellung_Computerspielemuseum_2.JPG, Ausstellung_Computerspielemuseum_9.JPG, Consoles-computerspielemuseum.jpg e Atari-2600-Light-Sixer-FL.jpg (url_not_found). Fotos de museu com licença livre ficaram limitadas a C18 e C19.
- codepen.io/naznouz/pen/gOqyBWK (erro do site) e codepen.io/ivorjetski/pen/qEaRjBw (fora da lista permitida). Os pens citados nos itens C51, C52, C53, C57, C58, C60, C62 e C66 (embeds ivorjetski, ricardoolivaalonso, takaneichinose e M-Nizzad) não foram abertos diretamente; só os posts e listas que os descrevem.
- bruno-simon.com, henryheffernan.com e github.com/henryjeff/portfolio-website (fora da lista permitida); portfólios Three.js clássicos ficaram sem verificação direta, só os posts do fórum C63 a C65.
- awwwards.com/inspiration/kaisermann-retro-tv-space-mode-navigation e awwwards.com/inspiration/retro-game-on-interactive-desktop-interface (robots_disallowed). Só abri awwwards.com/sites/retronova (Site of the Day de 08/09/2024, paleta #070707/#F3EDD8, tecnologia não informada), que descartei por não ser cena de quarto e por não confirmar CSS ou 3D.
- tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/ (erro do site); a versão sem comment-page-2 da matéria de 2015 também não estava na lista permitida (usei a comment-page-2 em C59).
- tecnoblog.net (Museu do Videogame Itinerante), gazetasp.com.br (Museu do Videogame 2024) e museumsportal-berlin.de (Computerspielemuseum): erro do site. Substituí por Omelete e Baguete (C23, C24).
- theasc.com/?p=30755 (The Making of Stranger Things with Tim Ives, ASC): a página existe (01/08/2019), mas é só a ficha de um vídeo, sem conteúdo sobre luz; descartada em favor de C35. newsshooter.com (Stranger Things 3) só lista tópicos de um podcast (iluminação programável no Starcourt Mall, LEDs), sem detalhes.
- Yahoo/Deadline, Matt Grobar, 29/06/2020 (Starcourt Mall): aberta, mas sem comentários de neon, paleta ou materiais; só cita marcas recriadas. Drama Quarterly (Chris Trujillo, 25/10/2017): paywall. ArchDaily (Stranger Things interiors): fora da lista permitida. IBC (Stranger Things 4): página-índice sem conteúdo. The Film Stage (Adam Stockhausen): aberta, mas não fala de Ready Player One como esperado.
- Dribbble de Rachid Lotf (dribbble.com/Rachid_Lotf), ArtStation “Magnavox Odyssey 2” (rachidlotf.artstation.com/projects/NxOAmz), Behance de diberkato e site de Sakke Soini: aparecem em buscas ou nas páginas abertas, mas eu não os abri.
- ArtStation shauncisco.artstation.com/projects/zPeBxq (“Bedroom Sunset”): aberta, mas é um render 3D de homenagem à Waneella, com autor não nomeado na página; descartada. Galerias de IA e stock (pixie.haus, krea.ai, cgtrader, renderhub, uppbeat, stock.adobe.com, planner5d): não usadas por serem geradas por IA, modelos de venda ou estoque sem autoria.
- Internet Archive (coleções de caixas e VHS), Flickr direto (por exemplo flickr.com/photos/steevithak/25597010494, citado pela página do Commons) e Bandcamp/Discogs: nenhum endereço desses apareceu como aberto nesta sessão. Fica como lacuna.
- Nota de verificação para C27: a página da Inverse não menciona o estúdio Tendershoot; ele foi confirmado no espelho Kiwix da Wikipedia (kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Dreamsettler), e a Wikipedia em en.wikipedia.org/wiki/Dreamsettler estava fora da lista permitida.

### Lacunas da Trilha C

- Nenhuma matéria de IndieWire, Vulture ou A.frame foi aberta com sucesso; fotografia e direção de arte ficaram em ASC, Kodak, British Cinematographer, Mirror80, Pushing Pixels e Netflix Tudum.
- Sem sites de portfólio em CSS puro de estilo “bruno-simon” com quarto retrô completo; os melhores equivalentes em CSS puro são C50 (quarto 3D), C51 (TV) e C54/C55/C56 (efeitos de tela).
- Poucos itens brasileiros (C09, C23, C24, C30); nada de capas de synthwave brasileiras nem de capas de VHS de locadora brasileira, que ficam com a trilha A.
- Só duas fotos de acervo com licença livre registrada, ambas via espelho.

---

## 4. Imersão em interface web

> Escopo: cena de "quarto gamer retrô" (luz baixa motivada, CRT glow, neon retrowave, bagunça) para o Clube dos Jogos, só com CSS, SVG inline e JavaScript puro. Datas de suporte/Baseline abaixo são as lidas nas páginas citadas em 2026-11-14.
>
> Convenções: **[verificado]** = li na fonte citada (ids D01... em `D-refs.csv`); **[provável]** = inferência técnica razoável ou heurística minha, sem fonte que dê o número; **[incerto]** = precisa de teste. Todo trecho de CSS/SVG/JS é meu e está marcado **(não testado)**: nenhum foi rodado em navegador. Classificações de custo (baixo/médio/alto) são julgamento meu, apoiado nas fontes onde indicado.

### 4.0 Três regras que valem para a cena inteira

1. **Só `transform` e `opacity` animam barato.** [verificado] D07 (web.dev, artigo de **2015**: confirmar no DevTools do Chrome atual) diz que apenas `transform` e `opacity` podem mudar sem disparar layout ou paint. Animar `box-shadow`, `text-shadow`, `filter`, `background-position` etc. força repaint a cada quadro [provável: dedução do mesmo texto].
2. **Efeitos de luz não podem ser ancestrais da prateleira 3D.** [verificado] D54 (CSS Transforms Level 2, Editor's Draft, seção 7.1) lista valores que forçam `transform-style` a `flat`: `opacity` < 1, `filter` ≠ none, `mix-blend-mode` ≠ normal, `isolation: isolate`, `mask-image`, `clip-path`, `overflow` ≠ visible/clip e `contain: paint`. Se qualquer um estiver num elemento que está *dentro da cadeia* `preserve-3d` (ou for o próprio elemento 3D), a prateleira achata e o 3D "some". Portanto: luz, glow, grão e vinheta são **irmãos sobrepostos** (`position:absolute; inset:0; pointer-events:none`), nunca pais dos elementos 3D. `will-change` não aparece nessa lista (D54) [verificado], mas cria stacking context para valores como `opacity` (D03) [verificado].
3. **Todo efeito é decorativo**: `aria-hidden="true"`, `pointer-events:none`, e desligável (ver 4.17).

Estrutura-base usada nas receitas (não testado):

```html
<div class="cena">                       <!-- isolation:isolate; position:relative -->
  <div class="parede fx-base"></div>
  <div class="prateleira"></div>         <!-- perspective + preserve-3d, SEM filter/opacity/blend -->
  <div class="props"></div>
  <div class="luz fx" aria-hidden="true"></div>
  <div class="crt-glow fx" aria-hidden="true"></div>
  <div class="grao fx" aria-hidden="true"></div>
  <div class="vinheta fx" aria-hidden="true"></div>
</div>
<main class="ui"> ...texto e controles... </main>   <!-- fora do grupo de blend -->
```

---

### 4.1 Brilho de CRT (CRT glow)

**Efeito visual.** A tela de tubo emite luz esverdeada/azulada: um halo suave ao redor do vidro, um leve "bloom" interno e uma poça de luz espalhada na parede e nos objetos próximos.

**Receita resumida (não testado).**
```css
.tv-tela{
  border-radius: 8% / 10%;
  background: radial-gradient(ellipse at 50% 45%, #1d3b33 0%, #0b1a14 75%);
  box-shadow:
    0 0 24px 4px rgba(120,255,200,.25),   /* halo curto */
    0 0 90px 24px rgba(80,200,255,.12),   /* espalhamento */
    inset 0 0 40px rgba(0,0,0,.65);       /* escurece as bordas do vidro */
}
.crt-glow{ /* camada irmã, não ancestral */
  position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(closest-side at 50% 42%,
              rgba(120,255,200,.28), rgba(120,255,200,0) 70%);
  mix-blend-mode: screen;
}
```
Opcional: `filter: drop-shadow(...)` em um SVG inline do tubo (D25 confirma `drop-shadow()` como função de filter [verificado]).

**Custo de desempenho: baixo se estático; médio se a camada de glow for tela cheia com blend.** `box-shadow` com blur grande é pintado uma vez e reaproveitado enquanto não muda [provável]. O risco é animá-lo (repaint por quadro, ver regra 1). `mix-blend-mode` exige que o navegador componha a camada com o que está atrás (D01) [verificado: "blends with its backdrop"]. Prefira glow **local** (do tamanho da TV + margem), não tela cheia.

**Risco de acessibilidade.** Halation (halo que "come" as bordas das letras) reduz legibilidade: qualquer texto sobre/ao lado do glow precisa de 4,5:1 (3:1 se grande) medido contra o fundo **como renderizado, com o glow** (D24, "specified background over which the text is rendered") [verificado]. Regra prática: não coloque texto de interface sobre o halo; se a TV mostrar título de jogo, use texto claro opaco sobre área escura dentro da tela. Bordas/ícones interativos que fiquem no halo precisam de 3:1 contra a cor adjacente (D10) [verificado].

**Fallback.** `@supports not (mix-blend-mode: screen)` → trocar `screen` por gradiente com alpha normal e opacidade menor. Suporte é amplo (D01: Baseline "widely available" desde janeiro de 2020; D06: 97,39% de uso global na data da consulta) [verificado], então o fallback real é de **desempenho**: em Modo conforto/celular fraco, remover `.crt-glow` e manter só o `box-shadow` pequeno.

---

### 4.2 Scanlines

**Efeito visual.** Linhas horizontais finas e escuras alternadas sobre a tela da TV, sugerindo as linhas de varredura.

**Receita resumida (não testado).**
```css
.tv-tela::after{
  content:""; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
  background: repeating-linear-gradient(to bottom,
      rgba(0,0,0,0) 0 1px, rgba(0,0,0,.10) 1px 2px);
  background-size: 100% 2px;
}
```
Um artigo de demo usa exatamente essa ideia: transparente 1px / escuro 1px a cada 2px com `rgba(0,0,0,.08)` (D20) [verificado]; outro usa pseudo-elemento sobreposto com `linear-gradient` repetido por `background-size` (D05) [verificado].

**Custo de desempenho: baixo.** Gradiente estático rasterizado uma vez, sem animação. Evite a "barra de rolagem" animada em tela cheia (D05 a faz com um `div` grande animado) — se quiser, restrinja à TV e anime só `transform` [provável].

**Risco de acessibilidade.** Scanlines degradam texto: D20 relata que opacidade ≥ 0,2 deixa o conteúdo difícil de ler e que ~0,03 é quase invisível em fundo claro [verificado]. Em fundo escuro, 0,06 a 0,10 costuma bastar [provável, heurística]. **Nunca** aplique scanlines sobre a UI de texto, só sobre o vidro da TV (ordem de camadas 4.16). Linhas de 1px/2px podem gerar moiré em telas de alta densidade e em zoom [provável]: teste em zoom 200% e 400% (relacionado a 1.4.4/1.4.10 do WCAG, que não abri: [incerto]). `prefers-contrast: more` → `display:none` na camada (D15: Baseline desde maio de 2022) [verificado].

**Fallback.** Sem `repeating-linear-gradient` (suporte amplo; não consultei tabela específica: [incerto]) a camada simplesmente some; a cena continua funcional. Em Modo conforto: `display:none`.

---

### 4.3 Curvatura / abaulamento leve da tela

**Efeito visual.** Vidro convexo: cantos arredondados, bordas escurecidas, reflexo curvo de janela no canto superior.

**Receita resumida (não testado).** Distorção de barril real não existe em CSS puro; simule com forma + sombras:
```css
.tv-vidro{
  border-radius: 9% / 12%;
  box-shadow: inset 0 0 60px 10px rgba(0,0,0,.7);       /* escurece nas bordas */
  background:
    radial-gradient(ellipse 60% 30% at 30% 12%, rgba(255,255,255,.14), transparent 70%), /* reflexo */
    radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%);
}
```
Um demo de TV em CodePen usa `border-radius: 50%` com bordas tracejadas para sugerir reflexos no vidro abaulado e `corner-shape: squircle` para o formato, mas o autor avisa que squircle não funciona no Firefox e que o tracejado varia entre engines (D22) [verificado]; evite `corner-shape` por ora. Um repositório de CSS CRT lista "curvature" entre os recursos, mas o autor diz não usar licença (D21): use só como inspiração, **não copie código** [verificado].
Curvatura real (barrel distortion) com SVG `feDisplacementMap` alimentado por um gradiente é tecnicamente possível, mas custa caro em área grande e eu não testei [incerto]; não recomendo para a v1.

**Custo de desempenho: baixo** (formas e gradientes estáticos). A versão com `feDisplacementMap` seria **alta** [provável].

**Risco de acessibilidade.** Se algum texto ficar dentro da tela, não o deforme (sem displacement no texto) e mantenha-o no centro, onde a vinheta interna é mais fraca. Texto curvo/deformado piora leitura de quem tem dislexia ou baixa visão [provável].

**Fallback.** Sem `border-radius` elíptico → cantos retos; nada quebra. Modo conforto: manter a forma (é estática) e remover só o reflexo, se incomodar.

---

### 4.4 Aberração cromática (só se viável)

**Efeito visual.** Franjas vermelha/ciano nas bordas de elementos claros, como em tela de tubo mal convergida.

**Receita resumida (não testado).** Versão barata, só em texto decorativo (títulos), nunca no corpo:
```css
.titulo-crt{
  text-shadow: -1px 0 rgba(255,40,80,.55), 1px 0 rgba(40,220,255,.55), 0 0 6px rgba(255,255,255,.25);
}
```
`text-shadow` aceita várias sombras separadas por vírgula, com a primeira por cima (D33) [verificado]. Versão SVG para a cena toda (cara): `feColorMatrix` isola um canal, `feOffset` desloca, `feBlend`/`mix-blend-mode: screen` recombina. Um tutorial de glitch usa exatamente `feColorMatrix` + `mix-blend-mode: screen` com três cópias do elemento, deslocando cada canal (D31) [verificado], e avisa que isso adiciona 3 elementos ao DOM [verificado]. Para a cena inteira, só vale em evento curto (ver 4.12) [provável].

**Custo de desempenho: baixo** (`text-shadow` estático em 1 título); **alto** (filtro SVG em área grande: três cópias + blend) [provável].

**Risco de acessibilidade.** É o efeito que mais fere legibilidade: franja de 1px vermelho/ciano num texto pequeno derruba o contraste efetivo e cansa a vista [provável]. Limite a títulos grandes (≥ 24px, onde o critério é 3:1, D24 [verificado]). Daltonismo: vermelho×ciano é eixo comum de confusão; a franja é decorativa e **não pode** carregar informação (não verifiquei WCAG 1.4.1 nesta rodada: [incerto]). Desligar com `prefers-contrast: more` (D15) e Modo conforto.

**Fallback.** Sem filtro/blend → apenas o `text-shadow` simples, ou nenhum.

---

### 4.5 Grão (film/CRT grain) com SVG feTurbulence **estático**

**Efeito visual.** Ruído fino sobre toda a cena que une as camadas, evita bandas de gradiente escuro e dá textura de vídeo antigo.

**Receita resumida (não testado).** SVG inline como *data URI* em `background-image`, repetido; **sem animar o filtro**:
```css
.grao{
  position:absolute; inset:0; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:160px 160px;
  opacity:.06; mix-blend-mode:overlay;
}
```
Fatos [verificado] (D08, MDN): `type` = `turbulence` ou `fractalNoise`; `baseFrequency` controla a escala; `numOctaves` (padrão 1) acrescenta detalhe; `stitchTiles="stitch"` faz as bordas de cada tile coincidirem (por isso o tile repete sem emenda); `seed` fixa o padrão; o primitivo funciona em `linearRGB` por padrão (use `color-interpolation-filters="sRGB"` se a cor sair estranha); preenche toda a sub-região do primitivo; Baseline desde julho de 2015. O Codrops sugere 0,02 a 0,2 como faixa inicial de `baseFrequency` para texturas e diz que acima de ~5 oitavas o ganho é quase imperceptível (D19) [verificado]; para grão fino, valores maiores (~0,6 a 1) [provável]. Se a saída do filtro ficar colorida, o `feColorMatrix` com `saturate 0` a torna cinza [provável].

**Por que NÃO animar o filtro.** [verificado] D19: filtros SVG "podem ser pesados", recomenda não exagerar na animação e manter áreas animadas pequenas porque áreas maiores custam mais; a demo de texto tremido (que alterna vários filtros de turbulência) é pesada e o autor aconselha evitá-la no celular. D14 (CSS-Tricks "Squigglevision") mostra a técnica de trocar entre cinco filtros `url()` em `@keyframes`, o que confirma que **cada quadro exige um filtro diferente a ser reavaliado** [provável: dedução]. Em tela cheia, isso é ruído gerado por CPU/raster a cada quadro; num celular médio estoura o orçamento [provável]. Como `<img>`/`background-image`, o SVG é rasterizado uma vez e depois reaproveitado como bitmap [provável; confirme com DevTools]. Se quiser "vida" no grão: deslocar o **bitmap estático** com `transform: translate()` em poucos passos (`steps()`), em camada própria, a ≤ 8 fps, só com `no-preference`; ainda assim é opcional [incerto: pode parecer cintilação].

**Custo de desempenho: baixo (estático) a médio** (uma camada tela cheia com `mix-blend-mode: overlay` + `opacity`). Se o blend pesar, troque por `opacity` simples com ruído cinza (sem blend) [provável]. Animado com filtro: **alto**.

**Risco de acessibilidade.** Grão sobre texto reduz contraste local e piora para baixa visão: mantenha opacidade ≤ ~0,08 e **nunca** sobre a UI de texto (4.16) [provável: heurística]. Grão animado em tela cheia pode ser percebido como cintilação (2.3.1 trata de *flashes* grandes; ruído fino de baixo contraste dificilmente passa do limiar, mas não medi: [incerto]).

**Fallback.** Se `mix-blend-mode` faltar/for desligado: mesma camada, `mix-blend-mode: normal`, `opacity` ~0,04. Modo conforto/`prefers-contrast: more`: `display:none`. Em celular fraco: tile menor (96px) ou remover.

---

### 4.6 Vinheta

**Efeito visual.** Cantos da cena mais escuros, concentrando o olhar no centro e reforçando "luz baixa".

**Receita resumida (não testado).**
```css
.vinheta{
  position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.55) 100%);
}
```

**Custo de desempenho: baixo.** Gradiente estático, sem blend, sem animação [provável].

**Risco de acessibilidade.** A vinheta escurece o fundo: ajuda contraste de texto claro, mas **derruba** o contraste de texto escuro ou de ícones coloridos nos cantos; defina cores de UI sabendo que o fundo real nos cantos é mais escuro (D24: contraste é medido contra o fundo como renderizado) [verificado]. Como fica abaixo da UI de texto (4.16), não deve afetar o texto, só objetos da cena.

**Fallback.** Sem fallback necessário; em `prefers-contrast: more` reduzir a opacidade para ~0,25 [provável].

---

### 4.7 Luz ambiente por camadas (blend modes + `isolation`)

**Efeito visual.** Sala escura com tinta azul-arroxeada, manchas de luz magenta/ciano do neon, luz esverdeada da TV e realce quente de abajur — cada luz "ilumina" os objetos em vez de ser uma película opaca.

**Receita resumida (não testado).**
```css
.cena{ position:relative; isolation:isolate; }   /* blend só dentro da cena */
.luz-base  { mix-blend-mode:multiply;   background:#1a1030; opacity:.55; }   /* escurece/tinge */
.luz-neon  { mix-blend-mode:screen;     background:radial-gradient(circle at 18% 22%, rgba(255,40,160,.35), transparent 55%); }
.luz-tv    { mix-blend-mode:screen;     background:radial-gradient(circle at 70% 60%, rgba(90,255,200,.25), transparent 60%); }
.luz-grade { mix-blend-mode:soft-light; background:linear-gradient(160deg, #3b1a6b, #0b2a4a); opacity:.5; }
/* color-dodge só em pontos pequenos (lâmpada), nunca em área grande */
```
Fatos [verificado] D01: `mix-blend-mode` mistura o elemento com o *backdrop* (o que está atrás no mesmo stacking context), aceita `multiply`, `screen`, `overlay`, `soft-light`, `color-dodge` etc., **cria stacking context**, e sem isolamento mistura também com o fundo da página; D01 recomenda `isolation: isolate` no pai para limitar a mistura ao grupo. D01 diz Baseline "widely available" desde janeiro de 2020. D06: 97,39% global (data da consulta). Regra por tipo [provável, prática de composição]: `multiply` escurece, `screen` soma luz, `soft-light`/`overlay` fazem *color grading* sutil, `color-dodge` estoura rápido (use em pontos pequenos).

**Cuidado crítico com a prateleira 3D.** `isolation: isolate` e `mix-blend-mode` **achatam** `preserve-3d` se estiverem no elemento 3D ou num ancestral dele (D54, seção 7.1) [verificado]. Por isso `.cena` com `isolation:isolate` deve **ser o pai da perspectiva**, e a prateleira (`perspective` + `preserve-3d`) fica dentro dela sem receber `isolation` própria; as camadas de luz são irmãs depois dela. Confirme no navegador que a prateleira continua em 3D (teste obrigatório) [incerto até testar]. Também: um elemento com `mix-blend-mode` torna-se *backdrop root* para `backdrop-filter` de descendentes (D11) [verificado]; evite `backdrop-filter` dentro de camadas de blend.

**Custo de desempenho: médio a alto**, proporcional ao nº de camadas de blend em tela cheia: cada uma obriga o navegador a compor com o resultado abaixo [provável]. Heurística minha: **≤ 3 camadas de blend em tela cheia no desktop e ≤ 2 no celular**; luz local (poças pequenas) custa menos que película tela cheia [provável]. Prefira pré-compor: em vez de 3 camadas `screen`, um único `background` com 3 `radial-gradient` empilhados em **uma** camada [provável].

**Risco de acessibilidade.** Blend muda a cor final do que está embaixo, então contraste "no papel" não vale: meça o pixel final (D24, D10) [verificado]. Se a UI estiver *dentro* do grupo isolado, ela também será misturada: mantenha a UI **fora** do grupo de blend ou com `isolation:isolate` próprio e fundo sólido (4.16). `color-dodge` pode "queimar" texto claro para branco sobre branco. Daltonismo: a cor das luzes é ambiente, não informação; nunca use cor de luz para indicar estado ou seleção (use forma, texto ou ícone) [provável].

**Fallback.** `@supports not (mix-blend-mode: screen)` ou Modo leve: `mix-blend-mode: normal` com os mesmos gradientes em alpha baixo (visual mais "lavado", mas legível); ou uma única camada de gradientes pré-compostos.

---

### 4.8 Parallax de cena (ponteiro/giroscópio, JS puro)

**Efeito visual.** Ao mover o mouse (PC) ou inclinar o celular, camadas da cena (parede, prateleira, props, neon) se deslocam em velocidades diferentes; a prateleira 3D gira poucos graus.

**Receita resumida (não testado).**
```css
.cena{ perspective: 900px; perspective-origin: 50% 40%; }
.prateleira{ transform-style: preserve-3d; transform: rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .25s ease-out; }
```
```js
const reduz = matchMedia('(prefers-reduced-motion: reduce)');
let alvoX = 0, alvoY = 0, x = 0, y = 0, raf = 0;
const el = document.querySelector('.prateleira');
function loop(){
  x += (alvoX - x) * 0.08; y += (alvoY - y) * 0.08;               // suavização
  el.style.transform = `rotateX(${-y*4}deg) rotateY(${x*6}deg)`;  // ±4° / ±6° no máximo
  raf = (Math.abs(alvoX-x)+Math.abs(alvoY-y) > .001) ? requestAnimationFrame(loop) : 0;
}
addEventListener('pointermove', e => {
  if (conforto.ativo || reduz.matches) return;
  alvoX = e.clientX/innerWidth*2-1; alvoY = e.clientY/innerHeight*2-1;
  if(!raf) raf = requestAnimationFrame(loop);
}, {passive:true});
// celular: pedir permissão num clique (iOS exige gesto do usuário)
btnInclinar.addEventListener('click', async () => {
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    if (await DeviceOrientationEvent.requestPermission() !== 'granted') return;
  }
  addEventListener('deviceorientation', e => {
    alvoX = Math.max(-1, Math.min(1, (e.gamma||0)/30));
    alvoY = Math.max(-1, Math.min(1, ((e.beta||0)-45)/30));
    if(!raf) raf = requestAnimationFrame(loop);
  });
});
```
Fatos [verificado]: `DeviceOrientationEvent.requestPermission()` só existe em contexto seguro (HTTPS), exige *transient activation* (chamada dentro de um clique), retorna "granted"/"denied" e está marcada como disponibilidade limitada (D17); a página não diz quais navegadores exigem — iOS Safari 13+ costuma exigir [provável], por isso o teste `typeof ... === 'function'`. Um demo de parallax por mouse faz a mesma coisa: escuta `mousemove`, escreve ângulos em variáveis CSS, suaviza com `transition` e usa `will-change: transform`, e um comentarista pediu suporte a orientação em celular (D32) [verificado]. Rotação 3D com `perspective` e `preserve-3d` é o mecanismo descrito em D27 (MDN) [verificado]. Atualizar `style.transform` direto em poucos elementos evita invalidar estilos de toda a subárvore via variável CSS no `.cena` [provável].

**Custo de desempenho: baixo a médio.** `transform` é animável no compositor (D07) [verificado]; use `will-change: transform` **só** na prateleira e em ≤ 3 camadas de fundo, e ideal ligar/desligar por JS (D03: "último recurso", evitar subárvores grandes, aplicar antes e remover depois) [verificado]. Evite listeners sem `{passive:true}` e evite calcular layout (getBoundingClientRect) por evento [provável].

**Risco de acessibilidade.** Parallax é gatilho vestibular conhecido: D23 (web.dev) cita parallax como risco-chave por causa de camadas movendo em velocidades diferentes, com tontura/náusea/enxaqueca [verificado]. Portanto: **desligado** sob `prefers-reduced-motion: reduce` (D02, Baseline desde janeiro de 2020) [verificado] e no Modo conforto; amplitude pequena; nunca parallax por rolagem. 2.2.2 (D09): movimento que dura > 5 s e começa sozinho precisa de pausar/parar/ocultar; parallax reativo ao ponteiro só se move quando o usuário se move, mas mantenha o controle visível de qualquer forma [provável]. Giroscópio: pedir permissão por botão, nunca automático.

**Fallback.** Sem `perspective`/3D ou sem permissão de sensor → cena estática (a prateleira continua navegável por foco/clique). Sem ponteiro fino (touch sem giroscópio) → nada acontece.

---

### 4.9 Profundidade de campo falsa (blur por distância + faixa de foco)

**Efeito visual.** Fundo (pôsteres, parede distante) levemente desfocado; faixa central nítida onde ficam as caixas; objetos de primeiro plano nas bordas também desfocados.

**Receita resumida (não testado).**
```css
.camada-fundo { filter: blur(2px); }                  /* longe */
.camada-frente{ filter: blur(3px); }                  /* perto, nas bordas */
.faixa-foco{ /* nítida só no meio */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 25%, #000 75%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, #000 25%, #000 75%, transparent 100%);
}
```
Ideia: duas cópias da mesma camada (uma borrada, outra nítida mascarada) e a nítida cobre a faixa de foco [provável]. Fatos [verificado]: `filter: blur()` é Baseline desde setembro de 2016 (D25); `mask-image` aceita gradiente e é Baseline "widely available" desde dezembro de 2023 (D28). Dependência: `mask-image` e `filter` também **achatam** `preserve-3d` se estiverem no elemento 3D ou em ancestral (D54) [verificado]; aplique blur só em camadas planas de fundo/frente, não na prateleira 3D.

**Custo de desempenho: médio (estático) a alto (se animar o blur ou se a área for grande).** Blur gaussiano é o filtro típico caro, e `filter` em área grande consome memória de GPU (cada camada ganha textura; D07 alerta para memória por camada) [verificado em D07 quanto à memória]. Blur raio ≤ 3–4px, em poucas camadas, **estático**; nunca animar `filter: blur()` [provável]. Mover a camada via `transform` (parallax) é ok.

**Risco de acessibilidade.** Texto/ícones dentro de camada borrada ficam ilegíveis: **nenhum conteúdo informativo** (títulos de jogos, botões) em camada com blur. Para quem tem baixa visão, blur de fundo ajuda foco, mas blur nas caixas clicáveis atrapalha. Nunca borre a camada de UI.

**Fallback.** Sem `mask-image` → remover a faixa (mostrar só a versão nítida) ou usar `opacity` reduzida no fundo para simular distância (`opacity` é compositor-only, D07). Sem `filter`/celular fraco: fundo mais escuro e menos contrastado em vez de borrado [provável].

---

### 4.10 Neon (CSS e SVG)

**Efeito visual.** Letreiro/logotipo de tubo: núcleo quase branco, halo colorido (magenta/ciano), reflexo na parede, tubo apagado em volta.

**Anatomia do tubo** [provável, conhecimento de campo + D13]: (1) **núcleo** claro (branco rosado) fino; (2) **halo interno** saturado; (3) **halo externo** largo e fraco; (4) **suporte/grampos** escuros e o tubo "apagado" (cinza escuro) onde não acende; (5) **reflexo** na parede (radial-gradient com `screen`).

**Receita resumida (não testado).**
```css
.neon{
  color:#ffe6f5;                                   /* núcleo */
  text-shadow:
    0 0 2px #fff,
    0 0 6px #ff3ea5,
    0 0 14px #ff3ea5,
    0 0 32px #d010a0,
    0 0 60px #7a0aa0;                              /* várias camadas: profundidade */
}
@keyframes respira-neon{ 0%,100%{opacity:1} 50%{opacity:.88} }
.neon{ animation: respira-neon 7s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce){ .neon{ animation:none } }
```
SVG: `<path stroke="#ff3ea5" stroke-width="6" fill="none" stroke-linecap="round" style="filter: drop-shadow(0 0 6px #ff3ea5) drop-shadow(0 0 18px #d010a0)"/>` com um `path` interno mais fino e claro (`stroke:#fff`, `stroke-width:2`) para o núcleo (não testado). Fatos [verificado] D13 (CSS-Tricks): várias `text-shadow` empilhadas dão profundidade que uma só não dá; o flicker é feito reutilizando as sombras em quase todos os passos de `@keyframes` com `text-shadow: none` em alguns; recomenda flicker só numa parte do letreiro; cita `prefers-reduced-motion` para `animation: none`; e **ressalva** que leitores relataram lag pesado ao animar essas sombras, sobretudo no celular. D13 também mostra um flicker "sutil" de 0,11 s: **não use**, ver risco abaixo. D33: a primeira sombra fica por cima [verificado].

**Custo de desempenho: baixo (estático); médio–alto (animar `text-shadow`).** Animar `opacity` do elemento inteiro é compositor-only (D07) [verificado]; animar `text-shadow` repinta o texto com blur a cada quadro (D13 relata lag) [verificado quanto ao relato]. **Receita segura:** deixar o `text-shadow` estático e animar só `opacity` (como acima) ou empilhar uma cópia "apagada" e uma "acesa" e alternar `opacity` entre elas [provável].

**Risco de acessibilidade.** (a) **Flicker:** a regra de 2.3.1 é no máximo 3 flashes por segundo e, em geral, limite de área (D04: ≤ 3 por segundo; área concorrente menor que ~0,006 sr em campo de 10°, ≈ 341×256 px CSS na referência) [verificado]. Um flicker de 0,11 s (~9 ciclos/s) ultrapassa a frequência; mesmo que a área seja pequena, é fadiga. Regra do projeto: **nenhuma mudança de luminância > 3×/s; amplitude pequena (≥ 85% de opacidade); ciclo lento (≥ 5 s).** (b) **2.2.2 (D09):** animação que inicia sozinha e dura > 5 s ao lado de outro conteúdo precisa de mecanismo de pausar/parar/ocultar [verificado]; o Modo conforto cumpre (4.17). (c) **Contraste:** halo largo cria "névoa" atrás de texto vizinho; o próprio texto neon, se for informativo, precisa de 3:1 (grande) ou 4,5:1 contra o fundo com o halo (D24) [verificado]; o núcleo claro sobre fundo escuro costuma passar, a cor do halo sozinha não. (d) **Daltonismo:** magenta/ciano sobre preto têm bom contraste de luminância; não use neon vermelho vs verde para estados. (e) Tubo apagado de baixo contraste é decorativo: não o torne essencial.

**Fallback.** Sem `text-shadow` complexo → cor sólida clara com contorno `-webkit-text-stroke` fino [provável]. Modo conforto: sombra estática (sem animação), ou sem halo largo.

---

### 4.11 Poeira em feixes de luz

**Efeito visual.** Um feixe de luz (da janela ou do abajur) cortando o escuro, com poucas partículas de poeira flutuando devagar.

**Receita resumida (não testado).**
```css
.feixe{
  position:absolute; inset:0; pointer-events:none;
  background: conic-gradient(from 160deg at 85% -5%, transparent 0 0deg,
              rgba(255,220,160,.20) 8deg, transparent 18deg);
  mix-blend-mode: screen;
  mask-image: linear-gradient(to bottom, #000, transparent 85%);
}
.poeira i{ position:absolute; width:2px; height:2px; border-radius:50%;
  background:rgba(255,235,200,.7); animation: flutua 18s linear infinite; }
@keyframes flutua{ from{transform:translate3d(0,0,0)} to{transform:translate3d(14px,-40px,0)} }
```
Gerar 10–16 `<i>` por JS com `animation-delay` e posições aleatórias dentro do feixe (pai com `overflow:hidden`) (não testado). Fatos [verificado]: `conic-gradient(from <ângulo> at <posição>)` é Baseline desde novembro de 2020 (D30); `mask-image` desde dezembro de 2023 (D28). `clip-path: polygon()` é alternativa para o formato do feixe [provável; não abri a página].

**Custo de desempenho: baixo a médio.** Feixe estático = gradiente; partículas animam só `transform` (compositor, D07) [verificado]. Limite: **≤ ~16 partículas**, sem blur por partícula, e pausar fora da tela com `IntersectionObserver`: o exemplo da MDN usa `getAnimations().forEach(a => a.pause())` conforme `isIntersecting` (D18, API Baseline desde março de 2019) [verificado].

**Risco de acessibilidade.** Partículas pequenas e lentas são baixo risco, mas contam como movimento contínuo (> 5 s): precisam obedecer ao Modo conforto (2.2.2, D09) e a `prefers-reduced-motion` (D02) [verificado]. Feixe claro sobre texto reduz contraste: feixe fica abaixo da UI (4.16). Evite pontos brilhantes piscando.

**Fallback.** Sem `conic-gradient` → `linear-gradient` inclinado em uma `div` rotacionada; sem `mix-blend` → alpha normal. Reduced-motion: partículas paradas ou ocultas; feixe estático permanece.

---

### 4.12 Tremor/rolagem de VHS tracking e glitch (OPCIONAL)

**Efeito visual.** Faixa de ruído que sobe pela imagem, tremida horizontal e separação RGB durante um instante (por exemplo, ao "trocar de jogo").

**Receita resumida (não testado).** Tutorial de referência: texto com `::before`/`::after` duplicando via `content: attr(data-text)`, cada um colorido (ciano/magenta), recortado com `clip-path: inset()` e deslocado com `transform: translate()` (D31) [verificado]. Dispare **uma vez**, ≤ 400 ms, por evento do usuário:
```css
.glitch-on::before{ animation: gl 350ms steps(6) 1; }
@keyframes gl{ 0%{transform:translate(0)} 30%{transform:translate(-3px,1px)} 60%{transform:translate(3px,-1px)} 100%{transform:translate(0)} }
@media (prefers-reduced-motion: reduce){ .glitch-on::before{ animation:none } }
```

**Custo de desempenho: baixo** se for `transform`/`clip-path` num elemento (D31 diz que são compostos pela GPU e que um glitch tem custo desprezível, mas desaconselha muitos ao mesmo tempo) [verificado]; **alto** em versão filtro SVG de tela cheia ou WebGL.

**Risco de acessibilidade.** É o efeito mais arriscado para fotossensibilidade. D31 não trata fotossensibilidade diretamente e avisa que o exemplo roda `infinite` (cintilação contínua) [verificado]. Regras: nunca `infinite`; sem alternância de luminância > 3×/s (2.3.1, D04); nenhum flash de área grande (limiar ~341×256 px CSS); só por interação (D31 sugere `:hover`/`:focus`; no mobile, por toque) e **desligado** com reduced-motion (D02, D23) e Modo conforto. Dica do D05: o autor descartou "screen door"/flicker contínuo por cansar os olhos [verificado].

**Fallback.** Sem recurso → nenhum efeito (é opcional). Trocar por um *fade* de opacidade rápido e suave (D02 recomenda substituir movimento por opacidade) [verificado].

---

### 4.13 Luz de TV que "respira"

**Efeito visual.** A poça de luz da TV varia suavemente de intensidade, como se a imagem na tela mudasse de brilho de leve.

**Receita resumida (não testado).**
```css
.tv-luz{ /* radial-gradient pré-renderizado, camada própria */
  background: radial-gradient(closest-side, rgba(120,255,200,.30), transparent 70%);
  animation: respira 9s ease-in-out infinite alternate;
}
@keyframes respira{ from{ opacity:.82 } to{ opacity:1 } }
@media (prefers-reduced-motion: reduce){ .tv-luz{ animation:none; opacity:.92 } }
```

**Custo de desempenho: baixo.** Só `opacity`, que é compositor-only (D07) [verificado]; o gradiente é pintado uma vez. Não anime `box-shadow`/`filter` para isso [provável].

**Risco de acessibilidade.** Aqui está a fronteira de 2.3.1: **nunca** simular troca de canal/cena clara-escura. Mantenha amplitude ≤ 20% e período ≥ 6 s (bem abaixo de 3 flashes/s, D04) [verificado quanto ao limite; os números de amplitude/período são regra minha]. Movimento > 5 s → controlável (D09) [verificado].

**Fallback.** Reduced-motion/Modo conforto: opacidade fixa (~0,92). Sem blend: mesma camada com alpha normal.

---

### 4.14 Lâmpada de lava (SVG + CSS)

**Efeito visual.** Bolhas coloridas (magenta/laranja) subindo e descendo lentamente num vidro, fundindo-se.

**Receita resumida (não testado).** SVG inline com 4–6 `<circle>` dentro de um grupo, deslocados com `transform` por CSS:
```html
<svg viewBox="0 0 120 300" class="lava" role="img" aria-label="Lâmpada de lava decorativa">
  <g class="gota-grupo">
    <circle class="g g1" cx="60" cy="260" r="22"/>
    <circle class="g g2" cx="52" cy="200" r="16"/>
    <circle class="g g3" cx="68" cy="140" r="18"/>
  </g>
</svg>
```
```css
.gota-grupo{ filter: blur(6px) contrast(18); }           /* gooey: borra e re-endurece (técnica D26) */
.g{ fill:#ff4d9a; animation: sobe 14s ease-in-out infinite alternate; }
.g2{ animation-duration:19s; animation-delay:-5s } .g3{ animation-duration:23s; animation-delay:-9s }
@keyframes sobe{ from{ transform:translateY(0) } to{ transform:translateY(-190px) } }
```
Fatos [verificado] D26 (CSS-Tricks, "Shape Blobbing"): blur em cada forma + `contrast()` no contêiner faz as bordas borradas se "fundirem" visualmente; o contêiner precisa de fundo definido e contraste forte entre forma e fundo; o autor avisa que demos com muitos elementos mantêm a CPU ocupada. A alternativa é um filtro SVG (`feGaussianBlur` + `feColorMatrix`), técnica conhecida mas que **não confirmei em fonte nesta rodada** [incerto]. Anime `transform` (não `cx/cy`) para ficar no compositor (D07) [verificado quanto a transform]; mas o `filter` sobre o grupo, quando o conteúdo muda a cada quadro, exige refazer o blur a cada quadro [provável]: mantenha a lâmpada **pequena** (ex.: 120×300 px) e pause fora da tela (D18).

**Custo de desempenho: médio.** Pequena área + 4–6 blobs é aceitável; área grande ou muitas bolhas → alto (D26) [verificado].

**Risco de acessibilidade.** Movimento contínuo e lento > 5 s: precisa de pausa (D09) e reduced-motion (D02). Mantenha o `contrast(18)` restrito ao grupo (não vaza para texto) e dê `aria-label`/`aria-hidden` conforme for decorativa. Cores: magenta/laranja sobre escuro são distinguíveis em luminância; não carregam informação.

**Fallback.** Sem `filter` → círculos nítidos e lentos (ainda funcionam como "bolhas"); Modo conforto: bolhas paradas numa pose agradável.

---

### 4.15 Orçamento de desempenho

Todos os números abaixo são **heurísticas minhas [provável]**, a validar no DevTools, salvo onde há [verificado].

| Item | Regra prática |
|---|---|
| Camadas com `mix-blend-mode` em tela cheia | Desktop ≤ 3; celular ≤ 2; preferir luz local ou 1 camada com vários gradientes. Cada blend obriga composição com o backdrop (D01). |
| Camadas com `filter: blur()` | Raio ≤ 3–4px, ≤ 2–3 camadas, só estático; nunca animar o blur (D25, D26). |
| Filtros SVG (feTurbulence etc.) | Só como imagem estática (data URI); animar apenas áreas pequenas, e evitar no celular (D19). |
| `backdrop-filter` | Só em painel pequeno de UI se for estritamente necessário; D12 diz "pode prejudicar o desempenho; teste". Tem `@supports` e fallback com fundo opaco. Baseline desde setembro de 2024 (D11). |
| Animações | Só `transform` e `opacity` (D07). Nada de animar `box-shadow`, `text-shadow`, `filter`, `background-position`. |
| `will-change` | "Último recurso" (D03); ≤ 5 elementos no total; ligar por JS antes do movimento e remover depois; nunca em `body` ou contêineres grandes. |
| Camadas de composição | Evitar "layer explosion": não promover tudo (D07). Cada camada custa memória de GPU; em aparelho com pouca memória o custo pode superar o ganho (D07) [verificado]. |
| Pausar fora da tela | `IntersectionObserver` + `getAnimations().pause()/play()` (D18). Pausar também com `document.hidden` (visibilitychange) [provável]. |
| Partículas | ≤ ~16 elementos, sem blur individual. |
| Aparelho de teste | Um celular Android intermediário real (não só emulação), com a cena aberta por ≥ 1 min; observar quedas de quadro e aquecimento [provável]. Orçamento de quadro: 16,7 ms a 60 Hz; D07 sugere manter composição em ~4–5 ms durante rolagem/transições [verificado]. |
| Depuração | DevTools do Chrome: Paint profiler → aba Layers mostra camadas e o motivo da criação (D07) [verificado]. |
| Rolagem | A cena fixa não deve repintar durante scroll da lista de jogos: camadas de efeito `position:fixed/absolute` isoladas [provável]. |

**Consultas de mídia a implementar.**
- `@media (prefers-reduced-motion: reduce)`: zerar animações e parallax; manter estados estáticos (D02: Baseline desde janeiro de 2020) [verificado]. D23: `animation: none` pode quebrar código que depende de `animationend`; trate no JS [verificado].
- `@media (prefers-contrast: more)`: remover scanlines/grão/halations, reduzir vinheta, texto mais claro e painéis mais opacos (D15: valores `more`/`less`/`custom`, Baseline desde maio de 2022) [verificado]. Considere também `@media (forced-colors: active)` — D15 cita a relação com `custom`/`forced-colors` [verificado]; o que cada efeito faz nesse modo, testar [incerto].
- `@media (prefers-reduced-data: reduce)`: **não confie**. D16 (MDN) marca como experimental, com disponibilidade limitada e diz que nenhum user agent a suporta [verificado]. Como a cena é 100% CSS/SVG inline, o ganho de dados seria pequeno (fonte e JS); desligue efeitos pelo Modo conforto, não por essa consulta.
- `prefers-color-scheme`: **não relevante**; a cena é sempre escura. Declare `color-scheme: dark` para controles nativos [provável].
- Também: `@media (hover: none), (pointer: coarse)` para trocar parallax por mouse por giroscópio opcional ou nada [provável].

---

### 4.16 Ordem de camadas recomendada (z-index da cena)

| z-index | Camada | Blend/uso | Nota |
|---|---|---|---|
| 0 | **Parede** (gradiente, papel de parede em padrão, pôsteres planos) | normal | Camada de fundo; pode ter blur estático (4.9). |
| 10 | **Móveis** (prateleira 3D, mesa, estante) | normal | Contém `perspective`/`preserve-3d`. **Sem** `filter`, `opacity<1`, `mask`, `blend`, `isolation` em ancestrais (D54). |
| 20 | **Props / bagunça** (cartuchos, controles, cabos, latas) | normal | Em SVG inline/CSS; poucos elementos; camadas planas. |
| 30 | **Luz** (ambiente, neon, abajur, feixe + poeira) | `multiply` / `screen` / `soft-light` | Irmãs sobrepostas, `pointer-events:none`. |
| 40 | **CRT glow** (halo/bloom + scanlines locais da TV) | `screen` + gradiente | Scanlines **só** sobre o vidro da TV. |
| 50 | **Grão** | `overlay` (ou normal) + `opacity` ≤ ~0,08 | Imagem estática (4.5). |
| 60 | **Vinheta** | normal | Escurece cantos, por último nos efeitos. |
| 100 | **UI de texto e controles** (títulos, botões, painel de jogos, botão Modo conforto) | normal; **fora** do grupo de blend | Sempre acima, legível, fundo opaco ou quase; foco visível. |

Regras: (1) `.cena` tem `isolation:isolate` e **a UI não está dentro dela** ou tem fundo próprio; (2) cada camada de efeito: `position:absolute; inset:0; pointer-events:none; aria-hidden="true"`; (3) UI com painéis de fundo sólido (≥ 85% opaco) para garantir 4,5:1 (D24) e 3:1 em bordas/ícones (D10) independentemente das luzes por baixo [verificado quanto aos limites]; (4) indicador de foco com outline sólido de 2px claro e **fora** da influência de blend: não deixe o halo comer o foco (D10: foco precisa de contraste) [verificado]; (5) o espaçamento de texto deve poder aumentar (linha 1,5; parágrafo 2×; letra 0,12em; palavra 0,16em) sem cortar conteúdo: não use `overflow:hidden` com altura fixa em painéis de texto (D29, 1.4.12) [verificado]; (6) as caixas de jogo na prateleira continuam clicáveis porque as camadas acima têm `pointer-events:none`.

---

### 4.17 Modo acessível/leve ("Modo conforto")

**Objetivo.** Um interruptor visível, definido pelo usuário, que desliga tudo que é decorativo e móvel/pesado, e que **respeita** `prefers-reduced-motion` (mesmo se o usuário nunca clicar).

**Comportamento recomendado.**
1. Atributo `data-conforto="on|off"` no `<html>`. Valor inicial: `on` se `prefers-reduced-motion: reduce` **ou** `prefers-contrast: more`; senão o valor salvo em `localStorage`; senão `off`.
2. Com `on`: desligar parallax/giroscópio, flicker/respiração, poeira, lava, glitch, grão, scanlines, aberração, blur, blend (camadas viram alpha normal); manter vinheta leve, cores do tema e formas estáticas. **Mesmo com `off`**, `prefers-reduced-motion: reduce` continua desligando movimento (preferência do sistema nunca é sobrescrita para pior).
3. O botão fica no topo, cedo na ordem de tabulação, `aria-pressed`, rótulo claro ("Modo conforto: reduz efeitos e movimento"), contraste ≥ 3:1 nas bordas (D10). Isso atende o espírito de 2.2.2 (mecanismo para pausar/parar/ocultar movimento > 5 s, D09) [verificado quanto à exigência; se a preferência do SO equivale ao mecanismo exigido é questão de conformidade que não verifiquei: [incerto]].
4. Aplicar o atributo no `<head>` com script inline curto (antes do primeiro paint) para evitar "flash" de efeitos.
5. Reagir a mudanças em tempo real: `matchMedia(...).addEventListener('change', ...)`.
6. A preferência fica só no aparelho (`localStorage`), sem envio a servidor.

**Código (não testado).**
```html
<script>
(function(){
  var r = matchMedia('(prefers-reduced-motion: reduce)');
  var c = matchMedia('(prefers-contrast: more)');
  var salvo; try{ salvo = localStorage.getItem('conforto'); }catch(e){}
  var on = salvo ? salvo === 'on' : (r.matches || c.matches);
  document.documentElement.dataset.conforto = on ? 'on' : 'off';
})();
</script>
```
```css
/* efeitos marcados com .fx; estáticos com .fx-estatico */
[data-conforto="on"] .fx{ display:none !important; }
[data-conforto="on"] .luz,[data-conforto="on"] .crt-glow{ mix-blend-mode:normal; opacity:.35; }
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation:none !important; transition:none !important; }
}
@media (prefers-contrast: more){ .grao,.scanlines,.aberracao{ display:none } .vinheta{ opacity:.3 } }
```
```js
const btn = document.getElementById('conforto');
btn.setAttribute('aria-pressed', document.documentElement.dataset.conforto === 'on');
btn.addEventListener('click', () => {
  const on = document.documentElement.dataset.conforto !== 'on';
  document.documentElement.dataset.conforto = on ? 'on' : 'off';
  btn.setAttribute('aria-pressed', on);
  try{ localStorage.setItem('conforto', on ? 'on' : 'off'); }catch(e){}
  // JS: cancelar rAF do parallax, pausar animações com getAnimations()
});
```
Nota: `animation:none` global pode quebrar lógica que dependa de `animationend` (D23) [verificado]; prefira `animation-play-state:paused` quando houver tal dependência [provável].

---

### 4.18 Referências usadas nesta seção

Detalhes completos em `D-refs.csv`. Mapa rápido: D01 mix-blend-mode (MDN); D02 prefers-reduced-motion (MDN); D03 will-change (MDN); D04 WCAG 2.3.1; D05 CRT terminal CSS+JS; D06 caniuse mix-blend-mode; D07 web.dev camadas e compositor; D08 feTurbulence (MDN); D09 WCAG 2.2.2; D10 WCAG 1.4.11; D11 backdrop-filter (MDN); D12 backdrop-filter (web.dev); D13 neon com text-shadow (CSS-Tricks); D14 Squigglevision (CSS-Tricks); D15 prefers-contrast (MDN); D16 prefers-reduced-data (MDN); D17 requestPermission (MDN); D18 IntersectionObserver (MDN); D19 feTurbulence (Codrops); D20 scanlines/tema escuro; D21 crt-css (GitHub); D22 CodePen TV secrets; D23 prefers-reduced-motion (web.dev); D24 WCAG 1.4.3; D25 filter (MDN); D26 Shape Blobbing; D27 CSS transforms (MDN); D28 mask-image (MDN); D29 WCAG 1.4.12; D30 conic-gradient (MDN); D31 glitch (Alvaro Trigo); D32 parallax por mouse (dev.to); D33 text-shadow (MDN); D54 CSS Transforms Level 2 (Editor's Draft).

**Pendências desta seção (o que eu não verifiquei):** nenhum trecho de código foi executado; `repeating-linear-gradient` e `clip-path` não tiveram tabela de suporte aberta; comportamento de SVG com filtros usado como `background-image` (rasterização única) e custo real de cada efeito em celular médio exigem teste; WCAG 1.4.1 (cor) e 1.4.4/1.4.10 (zoom/reflow) citados apenas como pontos de atenção.

---

---

## 5. Aplicação ao Clube dos Jogos

> Esta seção é **síntese de direção de arte** feita a partir das seções 1–4. Tudo o que não tem fonte é [julgamento] meu; os números de contraste foram **calculados por mim** (fórmula de luminância relativa do WCAG 2.x, script Python) e estão marcados como [calculado]. Nenhum logo, personagem, console ou nome de marca é proposto como elemento visual.

### 5.1 Princípios de direção de arte (14 regras de faça / não faça)

| # | Faça | Não faça | Por quê [julgamento, apoiado em 2.x e 4.x] |
|---|---|---|---|
| 1 | **Uma luz principal por cena**: a TV de tubo manda; abajur âmbar e neon são apoio | Acender tudo com a mesma força (parece loja de eletrônicos, não quarto) | Luz motivada tem hierarquia (2.a); a amostragem das suas imagens mostra luz saturada em ~1–5% da área (2.b.0) |
| 2 | **Sombra com matiz** (marrom-avermelhado, ameixa, azul-ardósia), fundo entre `#0B0F14` e `#160B17` | Preto puro `#000` ou fundo "cinza chapado" | Nas imagens medidas quase não há preto puro (2.b.0) |
| 3 | **Complementar frio × quente** (azul-petróleo contra laranja/rosa) com um lado dominante | Arco-íris de neons ao mesmo tempo (vira vaporwave/arcade de shopping) | Mapa de fronteiras da seção 1.3; teal & orange em 2.b |
| 4 | **Texto sempre sobre superfície sólida** (cartão, etiqueta, painel) fora de qualquer efeito | Letra sobre halo, grão ou scanline | Seção 4.1, 4.2, 4.16: efeitos degradam leitura; ver 5.2 (pior caso com halo) |
| 5 | **Efeitos só no vidro e na cena**: scanlines/curvatura/aberração apenas dentro da tela da TV | Scanlines e aberração em tela cheia | 4.2 e 4.4 |
| 6 | **Camadas de luz irmãs da prateleira 3D** (`position:absolute; inset:0`) | Colocar `filter`, `opacity<1`, `mix-blend-mode` ou `mask` em pai/elemento da cadeia `preserve-3d` | [verificado em D54] esses valores achatam o 3D (4.0) |
| 7 | **Bagunça organizada**: 8–14 props com 3 níveis (primeiro plano desfocado, plano médio nítido, fundo) | Encher o quadro de props idênticos e espalhados por igual | Composição e profundidade, 2.d |
| 8 | **Props genéricos e originais** (console "caixa", TV "cubo de tubo", controle "pílula") | Reproduzir silhueta/cores/logotipos de console, jogo, banda ou filme reais | Seção 6; teste de silhueta em 5.4.7 |
| 9 | **Desgaste com critério**: madeira riscada, plástico levemente amarelado, etiquetas desbotadas, poucas manchas | Sujeira em tudo (vira analog horror) ou novo demais (vira Y2K/Frutiger Aero) | Mapa de fronteiras 1.3; materiais 2.e |
| 10 | **Neon sóbrio**: 1 letreiro, 1 cor principal, glow em 2–3 camadas, flicker raro e lento | Vários letreiros piscando, ciclos rápidos, rainbow | WCAG 2.3.1 (nada de 3 flashes/s) e 4.10 |
| 11 | **Movimento lento e opcional** (respiração da TV, poeira, parallax suave) | Tremor, glitch contínuo, parallax forte sem opção de desligar | `prefers-reduced-motion` + "Modo conforto" (4.17) |
| 12 | **Estados de cena ligados ao ciclo do clube** (votação, jogando, call) | Cena idêntica o ano inteiro | Color script de 2.b (B03) |
| 13 | **Português nativo na cena** (rótulos "LOCAÇÃO 2 DIAS", "REBOBINE", "SUGERIDO POR") | Copiar texto em inglês de embalagem original | Nostalgia brasileira de locadora (1.6) |
| 14 | **Orçamento de desempenho antes de embelezar**: no máximo ~3 camadas de blend em tela cheia no desktop e ~2 no celular, glow animado só com `opacity` | Animar `box-shadow`, `filter` ou `text-shadow` | [verificado em D07 que só `transform` e `opacity` animam barato; os números de "3 e 2" são heurística minha, 4.15] |

### 5.2 Três paletas finais com verificação de contraste (WCAG)

**Como ler.** Os hex são **escolhas minhas** (aproximadas, derivadas da amostragem das suas imagens em 2.b.0 e das paletas P1–P6 de 2.b), não cores de nenhuma marca. Razão de contraste = fórmula do WCAG 2.x [calculado]. Referência: 4,5:1 para texto normal (1.4.3), 3:1 para texto grande e para componentes de interface (1.4.3 e 1.4.11). **Nenhum par de texto das tabelas abaixo fica abaixo de 4,5:1 sobre os fundos sólidos** (menor valor medido: 4,93:1, neon rosa da P2 sobre a madeira).

**Resumo das três paletas**
- **P1 "Noite de CRT"** (frio dominante, fecha com laranja e rosa): a mais neutra e a mais segura para texto; melhor para o padrão do site. Combina com as imagens 4, 5 e 2.
- **P2 "Lava rosa e madeira"** (quente dominante): mais aconchegante e mais "quarto"; boa para a fase "jogando". Combina com as imagens 1, 6 e 2.
- **P3 "Azul neon"** (fria, quase monocromática): para a fase "madrugada"/votação noturna; exige disciplina: variar **valor** (claro/escuro), não matiz. Combina com a imagem 4.

#### P1 — Noite de CRT (azul-petróleo contra laranja/rosa)

| Papel | Hex (aproximado/escolhido) |
|---|---|
| Parede/fundo | `#0B0F14` |
| Painel/cartão | `#121A22` |
| Madeira da prateleira | `#2A1B12` |
| Texto principal (creme de papel) | `#E8E2D0` |
| Texto secundário | `#A9B4BC` |
| Neon rosa | `#FF4F9A` |
| Neon ciano | `#3FE0E8` |
| Luz âmbar (abajur) | `#FFB347` |

| Texto / elemento | Fundo | Razão | Nível WCAG 2.x |
|---|---|---|---|
| Texto principal (creme de papel) `#E8E2D0` | Parede/fundo `#0B0F14` | 14.84:1 | AAA |
| Texto principal (creme de papel) `#E8E2D0` | Painel/cartão `#121A22` | 13.56:1 | AAA |
| Texto principal (creme de papel) `#E8E2D0` | Madeira da prateleira `#2A1B12` | 12.83:1 | AAA |
| Texto secundário `#A9B4BC` | Parede/fundo `#0B0F14` | 9.10:1 | AAA |
| Texto secundário `#A9B4BC` | Painel/cartão `#121A22` | 8.31:1 | AAA |
| Texto secundário `#A9B4BC` | Madeira da prateleira `#2A1B12` | 7.87:1 | AAA |
| Neon rosa `#FF4F9A` | Parede/fundo `#0B0F14` | 6.26:1 | AA |
| Neon rosa `#FF4F9A` | Painel/cartão `#121A22` | 5.71:1 | AA |
| Neon rosa `#FF4F9A` | Madeira da prateleira `#2A1B12` | 5.41:1 | AA |
| Neon ciano `#3FE0E8` | Parede/fundo `#0B0F14` | 11.93:1 | AAA |
| Neon ciano `#3FE0E8` | Painel/cartão `#121A22` | 10.90:1 | AAA |
| Neon ciano `#3FE0E8` | Madeira da prateleira `#2A1B12` | 10.32:1 | AAA |
| Luz âmbar (abajur) `#FFB347` | Parede/fundo `#0B0F14` | 10.79:1 | AAA |
| Luz âmbar (abajur) `#FFB347` | Painel/cartão `#121A22` | 9.85:1 | AAA |
| Luz âmbar (abajur) `#FFB347` | Madeira da prateleira `#2A1B12` | 9.33:1 | AAA |
| Texto de botão #0B0F14 | botão Neon rosa `#FF4F9A` | 6.26:1 | AA |
| Texto de botão #0B0F14 | botão Neon ciano `#3FE0E8` | 11.93:1 | AAA |
| Texto de botão #0B0F14 | botão Luz âmbar (abajur) `#FFB347` | 10.79:1 | AAA |

#### P2 — Lava rosa e madeira (quente, noite de abajur)

| Papel | Hex (aproximado/escolhido) |
|---|---|
| Parede/fundo | `#140B10` |
| Painel/cartão | `#1E1218` |
| Madeira da prateleira | `#3B2417` |
| Texto principal | `#F3E6D8` |
| Texto secundário | `#C9B5A8` |
| Neon rosa | `#FF5C8A` |
| Verde-água (acento frio) | `#46C3B5` |
| Luz âmbar | `#FFC15E` |

| Texto / elemento | Fundo | Razão | Nível WCAG 2.x |
|---|---|---|---|
| Texto principal `#F3E6D8` | Parede/fundo `#140B10` | 15.78:1 | AAA |
| Texto principal `#F3E6D8` | Painel/cartão `#1E1218` | 14.82:1 | AAA |
| Texto principal `#F3E6D8` | Madeira da prateleira `#3B2417` | 11.80:1 | AAA |
| Texto secundário `#C9B5A8` | Parede/fundo `#140B10` | 9.82:1 | AAA |
| Texto secundário `#C9B5A8` | Painel/cartão `#1E1218` | 9.23:1 | AAA |
| Texto secundário `#C9B5A8` | Madeira da prateleira `#3B2417` | 7.35:1 | AAA |
| Neon rosa `#FF5C8A` | Parede/fundo `#140B10` | 6.59:1 | AA |
| Neon rosa `#FF5C8A` | Painel/cartão `#1E1218` | 6.19:1 | AA |
| Neon rosa `#FF5C8A` | Madeira da prateleira `#3B2417` | 4.93:1 | AA |
| Verde-água (acento frio) `#46C3B5` | Parede/fundo `#140B10` | 8.97:1 | AAA |
| Verde-água (acento frio) `#46C3B5` | Painel/cartão `#1E1218` | 8.43:1 | AAA |
| Verde-água (acento frio) `#46C3B5` | Madeira da prateleira `#3B2417` | 6.71:1 | AA |
| Luz âmbar `#FFC15E` | Parede/fundo `#140B10` | 12.02:1 | AAA |
| Luz âmbar `#FFC15E` | Painel/cartão `#1E1218` | 11.29:1 | AAA |
| Luz âmbar `#FFC15E` | Madeira da prateleira `#3B2417` | 8.99:1 | AAA |
| Texto de botão #140B10 | botão Neon rosa `#FF5C8A` | 6.59:1 | AA |
| Texto de botão #140B10 | botão Verde-água (acento frio) `#46C3B5` | 8.97:1 | AAA |
| Texto de botão #140B10 | botão Luz âmbar `#FFC15E` | 12.02:1 | AAA |

#### P3 — Azul neon (fria, quase monocromática)

| Papel | Hex (aproximado/escolhido) |
|---|---|
| Parede/fundo | `#060B1A` |
| Painel/cartão | `#0D1630` |
| Madeira/estante escura | `#141C33` |
| Texto principal | `#DCE8FF` |
| Texto secundário | `#9DB0D6` |
| Neon magenta | `#E04FD0` |
| Neon ciano claro | `#9AF0FF` |
| Azul neon | `#4DA3FF` |

| Texto / elemento | Fundo | Razão | Nível WCAG 2.x |
|---|---|---|---|
| Texto principal `#DCE8FF` | Parede/fundo `#060B1A` | 15.91:1 | AAA |
| Texto principal `#DCE8FF` | Painel/cartão `#0D1630` | 14.50:1 | AAA |
| Texto principal `#DCE8FF` | Madeira/estante escura `#141C33` | 13.69:1 | AAA |
| Texto secundário `#9DB0D6` | Parede/fundo `#060B1A` | 8.98:1 | AAA |
| Texto secundário `#9DB0D6` | Painel/cartão `#0D1630` | 8.19:1 | AAA |
| Texto secundário `#9DB0D6` | Madeira/estante escura `#141C33` | 7.73:1 | AAA |
| Neon magenta `#E04FD0` | Parede/fundo `#060B1A` | 5.79:1 | AA |
| Neon magenta `#E04FD0` | Painel/cartão `#0D1630` | 5.28:1 | AA |
| Neon magenta `#E04FD0` | Madeira/estante escura `#141C33` | 4.98:1 | AA |
| Neon ciano claro `#9AF0FF` | Parede/fundo `#060B1A` | 15.21:1 | AAA |
| Neon ciano claro `#9AF0FF` | Painel/cartão `#0D1630` | 13.86:1 | AAA |
| Neon ciano claro `#9AF0FF` | Madeira/estante escura `#141C33` | 13.09:1 | AAA |
| Azul neon `#4DA3FF` | Parede/fundo `#060B1A` | 7.47:1 | AAA |
| Azul neon `#4DA3FF` | Painel/cartão `#0D1630` | 6.81:1 | AA |
| Azul neon `#4DA3FF` | Madeira/estante escura `#141C33` | 6.43:1 | AA |
| Texto de botão #060B1A | botão Neon magenta `#E04FD0` | 5.79:1 | AA |
| Texto de botão #060B1A | botão Neon ciano claro `#9AF0FF` | 15.21:1 | AAA |
| Texto de botão #060B1A | botão Azul neon `#4DA3FF` | 7.47:1 | AAA |

**Atenção ao contraste real.** Os números acima valem para **cores sólidas e planas**. A página real tem glow, grão e vinheta por cima, e o WCAG mede o fundo "como renderizado" (D24, 4.1). Por isso calculei o pior caso: um halo de neon sobreposto ao painel (mistura simples de cor com opacidade) [calculado]:

| Paleta | Halo sobreposto ao painel | Opacidade do halo | Texto principal | Texto secundário |
|---|---|---|---|---|
| P1 | neon ciano #3FE0E8 | 15% | 9.65:1 | 5.91:1 |
| P1 | neon ciano #3FE0E8 | 30% | 6.44:1 | 3.95:1 |
| P1 | neon rosa #FF4F9A | 15% | 11.30:1 | 6.93:1 |
| P1 | neon rosa #FF4F9A | 30% | 8.79:1 | 5.39:1 |
| P1 | âmbar #FFB347 | 15% | 9.97:1 | 6.11:1 |
| P1 | âmbar #FFB347 | 30% | 6.79:1 | 4.16:1 |
| P2 | neon rosa #FF5C8A | 15% | 12.01:1 | 7.48:1 |
| P2 | neon rosa #FF5C8A | 30% | 9.09:1 | 5.66:1 |
| P2 | verde-água #46C3B5 | 15% | 11.47:1 | 7.14:1 |
| P2 | verde-água #46C3B5 | 30% | 8.19:1 | 5.10:1 |
| P2 | âmbar #FFC15E | 15% | 10.69:1 | 6.66:1 |
| P2 | âmbar #FFC15E | 30% | 7.04:1 | 4.38:1 |
| P3 | neon magenta #E04FD0 | 15% | 12.15:1 | 6.86:1 |
| P3 | neon magenta #E04FD0 | 30% | 9.64:1 | 5.44:1 |
| P3 | ciano claro #9AF0FF | 15% | 9.86:1 | 5.57:1 |
| P3 | ciano claro #9AF0FF | 30% | 6.19:1 | 3.50:1 |
| P3 | azul neon #4DA3FF | 15% | 11.39:1 | 6.43:1 |
| P3 | azul neon #4DA3FF | 30% | 8.43:1 | 4.76:1 |
**Leitura do pior caso** [calculado]: com halo de até 15% o texto principal e o secundário continuam acima de 5,5:1; com **30%** o texto secundário já **cai abaixo de 4,5:1** em quatro casos (P1 ciano 3,95; P1 âmbar 4,16; P2 âmbar 4,38; P3 ciano claro 3,50). Regra para o designer: **halo atrás de texto ≤ 15%**, ou texto principal (não o secundário) onde o halo for mais forte, ou, melhor, texto só sobre cartão sólido. Esses números não incluem grão, scanlines nem vinheta, que reduzem um pouco mais; **testar na página renderizada** com um medidor de contraste. A cor do neon como *letra decorativa* de letreiro não precisa de 4,5:1 se houver texto equivalente legível (por exemplo, `aria-label` e o nome do clube também no cabeçalho em texto normal).

### 5.3 Três combinações tipográficas

Todas as famílias abaixo foram verificadas na trilha 2.g (licença SIL OFL 1.1, exceto Special Elite, Apache-2.0; fonte da licença: Fontsource). **Teste obrigatório de acentos** com "AÇÃO ÃÕ ÁÉÍÓÚ ÂÊÔ ç ã õ" antes de adotar (a cobertura de pt-BR é [provável] pela contagem de idiomas, não listada explicitamente). Hospedar os `.woff2` no próprio domínio e incluir o texto da licença (6.2). Limite: **até 4 famílias** no site inteiro (2.g).

| Combinação | Papel | Famílias | Uso e tamanho mínimo sugerido [julgamento] |
|---|---|---|---|
| **T1 "Locadora"** (mais legível; padrão) | Títulos/cartaz | Bebas Neue (peso único, caixa-alta, `letter-spacing` 0,04–0,08 em) | Títulos de jogo na etiqueta de fita e cabeçalhos ≥ 24 px |
| | Texto | Atkinson Hyperlegible Next | Corpo ≥ 16 px; é a fonte de leitura de tudo |
| | Metadados | Share Tech Mono | Plataforma, data, votos, contador de fita ≥ 13 px |
| **T2 "Arcade"** (mais pixel; para a fase de jogo) | Menus/botões | Pixelify Sans | Botões ≥ 16 px |
| | Rótulos curtos | Press Start 2P | 1–3 palavras, **≥ 12 px** em texto real; só 8–10 px se for arte em SVG (decorativo) |
| | OSD da TV | VT323 | "PLAY", "CH 03", contador ≥ 18 px |
| | Texto | Atkinson Hyperlegible Next | idem |
| **T3 "Neon noturno"** (para a fase madrugada/votação) | Letreiro | Tilt Neon (ou Neonderthaw, manuscrito) | **Só decorativo**, 1 palavra/nome do clube, sempre com texto equivalente |
| | Etiquetas manuscritas | Special Elite | "sugerido por…", anotações; ≥ 14 px |
| | Texto | Atkinson Hyperlegible Next | idem |

Observações: (a) Monoton, Rubik Glitch e Audiowide ficam como opcionais de 1–2 palavras; Rubik Glitch só em estado "fita danificada" (2.g). (b) VCR OSD Mono não é recomendada: licença não confirmada (2.g). (c) Fonte pixel em texto corrido é pouco legível [provável]; usar Atkinson para qualquer frase.

### 5.4 Propostas concretas de tratamento

Convenções: "ver 4.x" remete às receitas da seção 4; tudo é [julgamento] e **precisa de teste em celular médio e no PC** antes de virar padrão. Os jogos entram **só pelo nome em texto**; capas oficiais não entram (seção 6).

#### 5.4.1 A prateleira / móvel
- **Conceito:** um móvel de madeira escura baixo (tipo rack de TV de quarto) com 2–3 prateleiras; cada caixa de jogo apoiada, algumas inclinadas, uma "em uso" fora da fileira. Madeira com veios longos, riscos e um pouco de brilho de verniz só nas quinas frontais.
- **Como:** blocos CSS 3D (caixa = 6 faces) dentro de um único container `perspective` + `preserve-3d`; **nenhuma** luz/filtro nesse container (regra 6). Veios com `repeating-linear-gradient` de baixo contraste mais uma textura de ruído estático em SVG (4.5); sombra de contato sob cada caixa (gradiente radial escuro, não `box-shadow` animado).
- **Detalhes que vendem:** uma lombada de revista, um cassete, um cabo que sai por trás, um cartão de preço genérico colado na borda da prateleira ("2 DIAS") (ver 5.4.5).
- **Acessibilidade:** cada caixa é um `<button>` ou `<a>` real com nome acessível ("Votar em NOME DO JOGO"); a cena 3D não pode ser a única forma de ver a lista (oferecer lista simples no Modo conforto).

#### 5.4.2 A iluminação da cena
- **Hierarquia (de dominante a apoio):** (1) brilho frio da TV (poça de luz azul-petróleo no móvel e na parede, 4.1); (2) luz âmbar baixa de abajur, só um lado; (3) acento rosa/magenta da lâmpada de lava ou do letreiro, no canto; (4) luzinhas de Natal como pontos pequenos no fundo (decorativas, **sem piscar**).
- **Como:** uma camada de gradiente radial por fonte, irmãs da prateleira, `mix-blend-mode: screen` ou `soft-light` (4.7); vinheta (4.6) e grão estático (4.5) por cima de tudo, **abaixo da UI de texto** (ordem de camadas em 4.16). "Respiração" da TV só em `opacity` lenta (4.13).
- **Feixes de poeira (opcional):** um cone de luz saindo da janela ou do abajur, 6–12 partículas bem lentas (4.11); desligadas no Modo conforto e em `prefers-reduced-motion`.
- **Estados de cena** (a partir do color script de 2.b): **Votação** = TV em estática suave + letreiro aceso (P1); **Jogando** = TV forte, abajur aceso, lava ligada (P2); **Call/madrugada** = abajur apagado, janela roxa, TV azul (P3). Troca de estado em fade de ≥ 600 ms, sem flash.

#### 5.4.3 O letreiro de neon
- **Texto:** "CLUBE DOS JOGOS" (o nome do próprio site, **wordmark original**, nunca o de uma marca). Variantes por estado: "VOTAÇÃO ABERTA", "JOGANDO", "CALL HOJE".
- **Anatomia a desenhar** (2.g): um único traço contínuo por letra (monolinha), tubo cinza-translúcido quando apagado, núcleo quase branco com glow em 3 camadas, eletrodos nas pontas, grampos pretos a cada ~80–140 px, fio preto que sai por trás até uma caixinha transformador, reflexo borrado na parede.
- **Como:** SVG inline com `<path>` por letra (não depender de fonte para o desenho) ou Tilt Neon/Neonderthaw para a versão CSS; `drop-shadow` em 2–3 camadas (4.10). Flicker: uma letra, queda de 1–2 quadros, **no máximo uma vez a cada 20–40 s**, nunca 3 flashes por segundo.
- **Acessibilidade:** `role="img"` + `aria-label="Clube dos Jogos"` (ou `aria-hidden` se houver o mesmo texto em cabeçalho normal); não é elemento de navegação.

#### 5.4.4 As etiquetas dos jogos (lombada e frente da caixa)
- **Caixa genérica gerada por código:** cor-base derivada do nome do jogo (hash para um de 8–10 tons das paletas), 3 faixas horizontais ou diagonais simples, um motivo geométrico original (planeta, onda, estrela, grade) escolhido pelo hash; **sem arte oficial e sem logotipos**.
- **Etiqueta de locadora na lombada** (nostalgia brasileira, 1.6): retângulo claro de papel, título em Bebas Neue (T1), 1–2 linhas em Share Tech Mono (plataforma · quem sugeriu), borda colorida e um código de barras desenhado com `repeating-linear-gradient` (2.g). Textos tipo "LOCAÇÃO 2 DIAS" e "REBOBINE" só como brincadeira de interface.
- **Etiqueta de estado** (chip de papel): `EM VOTAÇÃO`, `JOGANDO`, `ZERADO`, `CALL MARCADA`, com **texto + ícone**, nunca só cor (daltonismo).
- **Contraste:** texto da etiqueta escuro sobre papel claro (≥ 7:1 na prática) e etiqueta sempre sólida.

#### 5.4.5 Os adesivos
- **O que são:** pequenos selos que contam o estado do jogo ou do grupo: estrela "ZERADO", chama "MAIS VOTADO", fita "SUGESTÃO DE @nome", etiqueta de preço amarela "R$ 0,00 · EMPRESTADO". Cantos levemente arredondados, borda branca fina, sombra de contato curta, rotação de ±2–6°.
- **Como:** SVG inline pequeno, sem fonte externa; leve descolado no canto (gradiente de 2 tons) e um brilho diagonal estático; **sem animação** ou só `transform` no `:hover`.
- **Atenção:** nada de mascote ou personagem conhecido; a estrela, a chama e a fita são formas genéricas.

#### 5.4.6 O fundo / a parede
- **Papel de parede xadrez escuro** (ref. 5) feito com dois `repeating-linear-gradient` cruzados de baixíssimo contraste (diferença de poucos pontos de luminosidade), mais um rodapé de madeira e uma faixa de sombra/queda de luz do abajur no topo.
- **Pôsteres e quadros genéricos:** retângulos com composições abstratas originais (sunburst, grade em perspectiva, planeta e anéis, silhueta de montanhas), todos **sem texto de marca**; um deles pode ser "pôster do clube" (wordmark próprio).
- **Janela com céu estrelado** (ref. 3 e 6): retângulo com gradiente noturno e pontos; **luz roxa/azul da janela** como contraluz sutil; um telescópio e uma luminária genéricos como props.
- **Luzinhas de Natal** (ref. 2): pontos SVG pequenos com glow baixo, **sem piscar**, em linha irregular na parede; desligam no Modo conforto.
- **Profundidade:** parede levemente desfocada (`blur` de 1–2 px em camada própria, 4.9) para destacar a prateleira; atenção ao custo de `filter` em área grande (4.15).

#### 5.4.7 A cena "mesa de jogar" (console, TV de tubo e controle)
A fase em que o grupo está jogando: uma vista "de dentro do quarto", com as mãos/controle em primeiro plano desfocado (ref. 3), TV acesa ao centro e o console embaixo.

| Camada (de trás para frente) | Conteúdo | Notas |
|---|---|---|
| 1. Parede e móvel | Papel de parede escuro, rack de madeira, pôsteres genéricos | Ver 5.4.6 |
| 2. TV de tubo | Caixa quase cúbica, tela abaulada (4.3), moldura plástica bege amarelada, dois botões redondos, antena de coelho | Tela mostra um **cartaz original**: "FASE 3 · [nome do jogo em texto]" em VT323 + gradiente de céu pixelado; scanlines só na tela (4.2) |
| 3. Console | **Silhueta original** (ver teste abaixo): laje larga e baixa, uma tampa inclinada, duas portas redondas e um botão giratório, sem nenhum logotipo; cartucho/cassete genérico com rótulo de 3 faixas | O console é **inventado**, não uma releitura de nenhum aparelho real |
| 4. Cabos | 2 cabos curvos do console à TV e ao controle (`<path>` com `stroke-linecap: round`), régua de energia, plugue, um nó de cabo | Os cabos dão "bagunça" e guiam o olho |
| 5. Props de mesa | Pilha de cartuchos/cassetes, revista dobrada, copo, lenço de papel amassado, caixa de lápis | Poucos, com sombra de contato |
| 6. Luz | Poça fria da TV no móvel; abajur âmbar à esquerda; lava rosa à direita (opcional) | Camadas irmãs, blend `screen` (4.7) |
| 7. Primeiro plano | Controle original em desfoque (pílula com cruz direcional e 2 botões redondos, cabo preto) ocupando o terço inferior, **blur de 3–6 px** (4.9), levemente fora de foco | Só ilustração, sem logotipos no controle; ocultar do leitor de tela (decorativo) |
| 8. Filme | Grão estático + vinheta | Acima da cena, **abaixo** do texto (4.16) |

- **Teste de silhueta (anti-cópia)** [julgamento, ver seção 6]: renderize o console e o controle em preto sólido, desfoque a 50% e compare com silhuetas de aparelhos reais; **se alguém reconhecer o aparelho real no relance, mude** proporções, número de portas, formato da tampa e disposição dos botões, e troque a paleta de cores.
- **Interação:** parallax leve do controle em primeiro plano (maior) e da TV (menor) com o ponteiro/giroscópio (4.8); sem parallax no Modo conforto.
- **Texto da UI nessa tela** (lista de quem está online, botão "Marcar call"): fora da cena, em painéis sólidos de P1/P2 (5.2).

---

## 6. Riscos e propriedade intelectual

> **Aviso: isto não é aconselhamento jurídico.** É um resumo de fontes lidas (ids D34–D53 em `referencias.csv`) mais a minha leitura de direção de arte. Para decidir sobre marcas, personagens, fontes ou imagens de terceiros, consulte um profissional de propriedade intelectual e os textos oficiais vigentes. Marcadores: [verificado] = li na fonte; [provável]; [incerto]; [julgamento] = opinião minha de design.

### 6.1 O que NÃO pode ser copiado (nem "quase igual")

Suas 6 imagens de referência contêm elementos protegidos. Eles servem **só como evidência de clima**. A coluna da direita diz como evocar o mesmo efeito de forma original.

| Elemento que aparece nas referências (por categoria) | Por que evitar | Como evocar o clima sem copiar |
|---|---|---|
| **Logotipos e wordmarks de fabricantes** (ex.: letreiro de neon com o nome de uma fabricante de console, img. 4; placas e marcas em aparelhos) | Marca registrada: uso exclusivo do titular e proibição de imitação com risco de confusão (Lei 9.279/96, arts. 124 XIX, 129, 195) [verificado em D35]; políticas de marca de empresas como Valve e Microsoft proíbem sugerir afiliação, animar ou alterar logos, inclusive em grupos de fãs [verificado em D50, D51] | Letreiro com o **nome do próprio clube** e wordmark original (5.4.3) |
| **Títulos, telas e personagens de jogos** (ex.: tela-título de um jogo de plataforma famoso na img. 1; personagem de jogo de luta na TV da img. 3; cenas de jogo nas TVs da img. 4) | Obra protegida: ilustração/design de personagem e tela são obras (Lei 9.610/98, art. 7º; adaptação exige autorização, art. 29) [verificado em D34]; a ideia de "um encanador" ou "dois lutadores" não é protegida (art. 8º I) [verificado em D34] | Tela de TV com **cartaz original** (céu pixelado, silhueta, "FASE 3 · nome" em texto), personagens inventados genéricos |
| **Trade dress de consoles e controles** (formato, combinação de cores, painel, botões) | O conjunto-imagem não tem previsão legal expressa no Brasil, mas é protegido via concorrência desleal quando há risco de confusão; tribunais analisam o conjunto, não peças isoladas [verificado em D37]; fonte de jurisprudência original do STJ não conferida [incerto, D38] | **Silhueta original** e teste de silhueta (5.4.7); trocar proporções, portas e botões, e a paleta de cores |
| **Capas e arte de caixas de jogo, VHS e pôsteres** (img. 3 e 6 têm pôsteres de filmes e jogos) | Ilustração e fotografia são obras protegidas; "redesenhar parecido" pode ser adaptação (D34) [provável] | Pôsteres e caixas **gerados por código** com formas genéricas (5.4.4, 5.4.6) |
| **Nomes de produtos e franquias como elemento gráfico** (nomes de bandas, filmes, times, personagens) | Marca/nome e possível concorrência desleal (D35, D37); nome em **texto puro para descrever** (ex.: "jogado no Steam") costuma ser tolerado, mas estilizar ou usar como elemento da cena exige consultar o titular [provável, D50, D51] | Referir o jogo só pelo **nome em texto** na etiqueta (sem logo, sem fonte da franquia) |
| **Objetos "assinatura" de franquias e marcas** (veículo colecionável de um filme, mascote de um filme, camisa de time com número, emblema de banda, símbolo de rede de lojas) | São personagens ou marcas por si mesmos: trocar pose, cor ou cenário não os torna originais [julgamento] | Props genéricos equivalentes em função: um carro de brinquedo qualquer, um boneco inventado, uma camisa de time fictício sem escudo |

### 6.2 Como evocar o clima de forma original (receita)
1. **Trocar o objeto, manter a função.** O que dá o clima é: tela acesa, luz fria, bagunça, objeto pessoal. A marca não é necessária (seções 2.a, 2.f).
2. **Gerar tudo por código** (CSS/SVG/JS), de formas simples, sem traçar por cima de imagens reais. Traçar uma foto de produto continua sendo cópia da forma.
3. **Teste de silhueta e teste "de relance"** (5.4.7) antes de aprovar cada prop de console, controle, TV ou caixa.
4. **Wordmark próprio** em fonte livre (Audiowide, Bungee, Bebas Neue etc., 2.g) e **ícones próprios** (um "gamepad" desenhado por vocês, não o ícone de uma plataforma).
5. **Aviso de não afiliação** no rodapé ("Clube de amigos; não é afiliado a nenhuma fabricante, estúdio ou plataforma; marcas pertencem a seus titulares") [julgamento; reduz risco de sugerir endosso, não elimina responsabilidade].
6. **Registro da decisão:** manter uma lista do que foi criado do zero e do que veio de fonte com licença (ver 6.3 e 6.4).

### 6.3 Paródia e homenagem não são salvo-conduto
- No Brasil a Lei 9.610/98 (art. 47) diz que paráfrases e paródias são livres quando **não forem verdadeiras reproduções** da obra e **não lhe implicarem descrédito** [verificado em D34, texto do Senado, conferido por mim numa amostra]. Isso é uma limitação **condicionada**: uma cópia fiel "em homenagem" não está coberta [verificado, D34].
- Em marcas, o ponto central tende a ser **risco de confusão/associação e concorrência desleal**, não a intenção de homenagem (D35, D37) [verificado]; não encontrei fonte oficial brasileira específica sobre paródia de marca [incerto].
- Como referência comparada (não é lei brasileira): em *Jack Daniel's v. VIP Products* (EUA, 2023) a paródia não afastou automaticamente a infração de marca quando a marca era usada como identificador de origem [verificado em D52].

### 6.4 Riscos de licença das imagens
| Fonte de imagem | O que li | Risco / uso no Clube |
|---|---|---|
| **Suas 6 imagens de referência** | Contêm marcas e personagens; a img. 5 é de banco de imagens com marca d'água | **Não usar no site**; só estudo. Conteúdo de banco de imagens "comp"/com marca d'água é só prévia e não pode virar material final; tirar a marca d'água não dá licença [verificado D49 quanto ao "comp"; marca d'água literal não aparece no texto lido, tratar como provável] |
| **Unsplash** | Licença ampla, gratuita, inclusive comercial; atribuição não obrigatória; não permite compilar para replicar serviço concorrente [verificado, D44] | Não cobre marcas, pessoas ou propriedade retratadas (a página lida não trata disso): foto com logo visível continua sendo problema de marca [provável] |
| **Pexels** | Proibido vender sem alteração e subir em outras plataformas de stock; permitido com edição/valor agregado [verificado em D45 (central de ajuda); texto integral da licença não lido] | Idem: não cobre marcas/pessoas na página lida |
| **Pixabay** | Página oficial não abriu [incerto] | Ler a licença oficial antes de usar |
| **Creative Commons** | CC BY: crédito + link + indicação de alterações; CC BY-SA: adaptações sob a mesma licença; CC0: renúncia na medida da lei, sem afetar marcas nem direitos de terceiros [verificado, D46–D48] | Fotos de acervo (ex.: C18, CC BY-SA 2.0 segundo espelho do Commons) exigem atribuição e mesma licença; confirmar no Commons antes de reutilizar |
| **Imagens de IA** | Não avaliadas neste dossiê | [incerto]: tratar como risco até haver política clara do dono |

Como o projeto exige **sem imagens externas embutidas**, o caminho natural é ilustração própria em SVG/CSS. Se o dono quiser **capas reais** dos jogos, a permissão do titular é o caminho (ou link para a loja), conforme a seção 8.

### 6.5 Riscos de licença das fontes
- **SIL OFL 1.1** (a maioria das famílias da 2.g): permite embutir/servir via `@font-face` ("recomendado e explicitamente permitido"), não permite vender a fonte isolada, e quem redistribui o arquivo deve incluir o texto da licença; documentos e artes feitos com a fonte não herdam a OFL [verificado, D40].
- **Apache-2.0** (Special Elite): permite usar e distribuir, pede cópia da licença e manter avisos [verificado, D41]. **Ubuntu Font Licence** foi lida como referência (D39), sem fonte adotada no dossiê.
- **CDN do Google Fonts × LGPD/GDPR:** um tribunal regional de Munique (20/01/2022) condenou um site que carregava Google Fonts via CDN a indenizar o visitante, por transmitir o IP sem informação prévia [verificado em fontes secundárias, D42, D43]; **não é vinculante no Brasil** e não li a sentença nem a LGPD [incerto]. A saída técnica compatível com a restrição "sem recursos externos": **hospedar os `.woff2` no próprio domínio** e incluir os arquivos de licença (`/licenses`) [provável].
- Fontes de **uso comercial de designers** (ITC, Futura, Chicago etc.) são proprietárias: usar equivalentes livres (2.g).

### 6.6 O que esta seção não verificou
FAQ oficial do Google Fonts; licença oficial da Pixabay; texto integral da Licença Pexels; texto da LGPD; íntegra da sentença de Munique; jurisprudência original do STJ sobre conjunto-imagem; fonte específica sobre personagens como obra protegida no Brasil; políticas de logo de Sony, Nintendo e outras (só Valve e Microsoft foram lidas); texto consolidado vigente da Lei 9.279/96 (lida a publicação original). Ver também seção 8.

---

## 7. Glossário pt-BR/en e continuação da pesquisa

### 7.1 Glossário

| pt-BR | en | Definição curta (com base nas fontes) | Fonte |
|---|---|---|---|
| estética de internet | internet aesthetic | Estilo visual, subcultura ou tema surgido e difundido sobretudo online | A39 |
| nostalgiacore | nostalgiacore | Estética ligada à nostalgia e memória arquivada da internet; definição instável | A36, A37 |
| sufixo -core | -core suffix | Nomeia fandoms de estética; "namecore" é o hábito de inventar esses nomes | A55 |
| retrowave / synthwave / outrun | retrowave / synthwave / outrun | Estética/música que reimagina os anos 80; "outrun" vem do arcade *Out Run* (1986) | A41, A42 |
| vaporwave | vaporwave | Microgênero e estética surgida ~2011, pastel, irônica, melancólica | A33 |
| Y2K | Y2K (futurism) | ~1997-2004, translúcido, metálico, otimista | A35 |
| Frutiger Aero | Frutiger Aero | ~2004-2013, brilho vítreo, bolhas, natureza | A34 |
| cyberpunk | cyberpunk | Subgênero de ficção científica (termo de 1983) e estética distópica | A39 |
| neon noir | neon noir | Neo-noir com néon, cidade noturna, herói isolado | A50 |
| dark academia | dark academia | Estética de ensino superior/literatura, gótica, marrom/preto | A48, A49 |
| analog horror | analog horror | Subgênero de found footage que imita mídias analógicas | A46 |
| espaço liminar | liminal space | Lugares de passagem vazios, estranhos e nostálgicos | A45 |
| iluminação low-key | low-key lighting | Sombras fortes, alto contraste, pouco fill (~8:1) | A57 |
| iluminação motivada | motivated lighting | Luz que imita fontes plausíveis na cena (janela, abajur) | A57 |
| TV de tubo / CRT | CRT television | Tela de raios catódicos; linhas de varredura; resposta imediata | A51, A52 |
| linhas de varredura | scanlines | Linhas horizontais desenhadas pelo feixe do CRT | A51 |
| pontilhado (dithering) | dithering | Técnica de arte pensada para CRT; perde efeito em LCD/OLED | A51 |
| vídeo composto / S-Video / componente | composite / S-Video / component | Conexões analógicas; S-Video e componente têm imagem melhor que RF/composto | A52, A26 |
| locadora de games | game rental store | Lugar de aluguel de cartuchos por fim de semana ou jogo no local | A01, A02 |
| game sallon (grafia da fonte) | arcade-style rental room | Sala com consoles para jogar pagando por tempo | A01 |
| feira do rolo | trade fair / swap meet | Bancas de troca de cartuchos (1x1, 2x1) | A03 |
| camelô | street vendor | Vendedor de mídias piratas ("3 jogos por R$ 10") | A03 |
| fliperama | arcade | Casa de máquinas de arcade com fichas | A13, A14 |
| lan house | LAN house / cyber café | Sala paga por hora com computadores em rede | A15 |
| Corujão | all-night package | Pacote de madrugada em lan house | A17 |
| reserva de mercado | market reserve | Política que restringiu importação de informática até 1991 | A08 |
| clone | clone console | Console nacional compatível com outro (ex.: Phantom System = NES) | A09, A10 |
| detonado | walkthrough | Guia de revistas para passar de fase | A03 |
| nostalgia reflexiva / restauradora | reflective / restorative nostalgia | Distinção de Svetlana Boym | A54 |
| memória vernacular / oficial | vernacular / official memory | Distinção usada por Heineman para retrogaming | A53 |
| Lofi Girl | Lofi Girl / Study Girl | Garota animada estudando, criada por Juan Pablo Machado, 2018 | A58 |
| comfort media, anemoia, tech-stalgia | comfort media, anemoia, tech-stalgia | Termos citados por **uma página-espelho sem autoria** | A38 ([incerto]) |

### 7.2 Termos de busca em inglês (para continuar)

- "retro gaming room" / "retro game room" + "CRT" + "low light" / "ambient lighting"
- "game room aesthetic" + "80s" / "90s bedroom" / "neon sign" / "LED strip"
- "nostalgiacore" + "gaming" / "video games" / "bedroom"
- "outrun aesthetic" / "retrowave aesthetic" + "bedroom" / "room"
- "CRT glow" / "CRT bloom" / "phosphor glow" / "scanlines shader" (**atenção:** não verificado como fonte técnica)
- "motivated lighting" + "bedroom" / "practical lights" + "neon"
- "low key lighting" + "game room" / "cinematic bedroom"
- "90s bedroom nostalgia" / "childhood bedroom 3D environment" / "nostalgic room Blender"
- "retro desk setup" / "retro battlestation" / "retro gaming setup CRT"
- "cassette futurism" / "retrofuturism" (citados em A42)
- "Stranger Things set design" / "Stranger Things production design"
- "internet aesthetics" + "Aesthetics Wiki" + "Prospect"

### 7.3 Termos de busca em português

- "quarto gamer retrô" / "cantinho retrô" / "sala gamer retrô" + "CRT" / "Trinitron"
- "nostalgia gamer" + "locadora" / "Mega Drive" / "Super Nintendo"
- "locadora de videogame" + "anos 90" / "game sallon" / "carteirinha"
- "feira do rolo" cartuchos / "camelô" "3 jogos por R$ 10"
- "Tectoy" + "Master System" / "Mega Drive" / "Playtronic" / "Phantom System"
- "reserva de mercado" + videogames / clones
- "fliperama" + "Brasil" + "anos 80" / "ficha" / "Taito do Brasil"
- "lan house" + "Counter-Strike" + "história" / "corujão"
- "revista Ação Games" / "Super Game Power" / "detonado"
- "retrogames Brasil" + "Festival Retro Gaming" / "Instituto Bojogá"
- "estética retrô" + "games" + "SBGames" / "memória afetiva" + "videogames retrô"
- "TV de tubo" + "videogame" + "quarto"

### 7.4 Artistas e criadores verificados (existem e têm obra relevante)

| Nome | Por que seguir | Onde (segundo a fonte) | Fonte |
|---|---|---|---|
| **Rachid Lotf** | Ilustração digital "PC gaming bedroom" (~2004): CRT, torre bege, caixas de jogo, pôsteres, luz no ar empoeirado; artigo da PC Gamer (James Davenport, 05/08/2019) | Instagram, YouTube, ArtStation (segundo o artigo) | A62 |
| **Maria Alekseeva** | Ambiente 3D "Where does the childhood go?" (fim dos anos 1990: PS1, TV volumosa, CDs); Blender, ZBrush, Substance, 3ds Max/Corona | Matéria 80.lv (não confirmei perfil) | A63 |
| **Jason Tammemägi** | Pixel art cyberpunk/retrowave, referência central dos anos 80 | ArtStation (artstation.com/genuinehuman) e Instagram (@genuinehumanart), segundo o Creative Boom | A64 |
| **Kavinsky** | Referência musical outrun (*Outrun*, 2013; *Nightcall*) | KYM | A41 |
| **Kidmograph** (GIFs outrun), **Limon Estudios**, **Steve Cutts** | Exemplos de animação/vídeo outrun citados no KYM | KYM | A41 |
| **Juan Pablo Machado** | Criador da animação Lofi Girl (2018) | KYM | A58 |
| **Kane Parsons** | *The Backrooms* (série web 2022): referência para **evitar** (liminal/analog horror) | Infegy, MIT Reader | A37, A47 |
| **Chris Trujillo** | Entrevista sobre o look 80s de *Stranger Things* (cargo exato não confirmado no trecho lido) | AwardsDaily (2017) | A60 |

### 7.5 Comunidades (existência verificada)

| Comunidade | Verificação | Observação | Fonte |
|---|---|---|---|
| **r/retrogaming** | Regras lidas via **espelho** de Reddit (as páginas canônicas do reddit.com não foram abertas) | Consoles até 5ª geração, Dreamcast como exceção; setups só nos fins de semana; sem arte de IA | A66 |
| **r/crtgaming** | Listagem lida via espelho | Foco em monitores/TVs CRT para jogos; limpeza, reparo, cabos, 240p | A65 |
| **r/outrun** | Listagem lida via espelho; criação em 29/04/2013 (KYM) | Música, arte, objetos retrô, "Music Monday" | A67, A41 |
| **r/vaporwaveaesthetics** | Criado em 30/12/2014 (KYM) | Para **calibrar o que evitar** | A40 |
| **r/LiminalSpace** | Mencionado na Wikipédia (>500 mil membros em nov/2022) | Para **calibrar o que evitar**; não abri o subreddit | A45 |
| **Discord "RetroGamesBR - RetroArch Multi"** | Página de listagem (discord.me) lida | Comunidade brasileira de retrogames multijogador; nº de membros não informado | A29 |
| **Festival Retro Gaming Brasil / podcast RGB Inside** | Matéria Canaltech (2019) | Evento presencial em SP; Fábio Santana | A19 |
| **Instituto Bojogá** | Site aberto | Museu/centro de estudos, acervo e "gamepedia" | A07 |
| **Museu do Videogame (Cleidson Lima)** | Notícia Baguete (2014) | Itinerante; ~200 consoles | A18 |
| **Aesthetics Wiki** | Página "About" aberta | Fonte de vocabulário | A32 |

### 7.6 NÃO verificado (anotado para a próxima rodada)

- **Aesthetics Wiki, página "Nostalgiacore"**: bloqueada pela ferramenta; citei só o que a lista ADS-L reproduz.
- **Tags de Pinterest/ArtStation/Behance** (ex.: "retro game room", "CRT setup"): **não consegui verificar** (login/JS); sugeridas apenas como buscas, sem garantia.
- **Know Your Meme "nostalgiacore"**: não localizado.
- **Wikipédia pt** (Tectoy, Master System, locadora): não apareceu nas buscas; usei Wikipédia en e jornalismo. **TecMundo** (várias matérias) e **Sega Retro** bloquearam o acesso; só uma matéria do TecMundo foi lida (locadoras).
- **Memória Globo, MIS acervo, Museu da Imagem e do Som**: sem página aberta.
- **Archive.org com PDFs de Ação Games**: aparece em buscas, **não abri**, e há questão de direitos autorais.
- **Subreddits/Discords** que apareceram só em resultados e que não abri: r/synthwaveproducers, r/newretrowave, Collector's Anonymous (Discord).
- **TV de tubo no quarto**, **luzinhas de Natal** e **empréstimo de fita/cartucho** como memórias brasileiras: sem fonte aberta específica.
- **"Brilho/glow de CRT"** como fenômeno físico documentado: não sustentado nas fontes técnicas lidas.
- **Stranger Things**: detalhes da "parede de luzes" não confirmados.

---

## 8. Lacunas e dúvidas abertas

### 8.1 O que não foi possível verificar (consolidado das quatro trilhas e da conferência final)

**Método e conferência**
- As quatro trilhas abriram as URLs com WebFetch; eu **reabri uma amostra independente de 8 URLs** (A05, A20, B22, B53, C30, C50, D07, D34): as 8 existem e batem com o que as trilhas descrevem. Dois ajustes vieram da conferência: o texto da A05 (Canaltech) **não menciona o Master System** (usado só para Mega Drive/Tectoy e Super Nintendo/Playtronic), e o artigo D07 (web.dev) foi **atualizado pela última vez em 2015**, então a regra "só `transform` e `opacity` animam no compositor" deve ser confirmada no Chrome DevTools [incerto quanto à atualidade].
- Não abri todas as 260 URLs de novo: a verificação de cada uma é da trilha que a citou.
- **Exceções à regra "toda URL foi aberta":** B50 (metadata do Fontsource via jsDelivr) apareceu em resultado de busca e não foi aberta diretamente; C18 e C19 foram abertas em **espelhos** do Commons (o endereço canônico não abriu); vários CodePens citados na trilha C **não foram abertos**: entram só pelos posts que os descrevem (a coluna `url` do CSV traz o post aberto, não o pen).
- **Nenhum trecho de CSS/SVG/JS foi executado em navegador.** Todo código da seção 4 está marcado "(não testado)"; os números do orçamento de desempenho (4.15) são heurísticas minhas.
- **Imagens do dono:** as trilhas B e C trabalharam **só com as descrições**, sem ver as imagens. Eu analisei as 6 imagens anexadas e **medi** as cores (2.b.0); as paletas P1–P6 de 2.b continuam inferidas. As "linhas o que aprender" da trilha C vêm do texto das páginas, não de inspeção visual das imagens.

**Seção 1 (terminologia e Brasil)**
- A página "Nostalgiacore" da Aesthetics Wiki foi bloqueada; a definição vem de citação em lista ADS-L e de espelhos [incerto]. Wikipédia em português não apareceu nas buscas; TecMundo e Sega Retro bloquearam o acesso (só uma matéria do TecMundo foi lida); Memória Globo e MIS não foram abertos. Tags de Pinterest, ArtStation e Behance não são verificáveis; subreddits foram lidos por espelhos.
- **Datas e números divergem entre fontes** (mês de chegada do Master System e do Super Nintendo ao Brasil, vendas): tratar como [incerto]. Sem fonte aberta específica: TV de tubo no quarto, luzinhas de Natal, empréstimo de fita/cartucho entre amigos (todos são parte da memória cultural, não de fonte). O "brilho de CRT" como fenômeno físico **não** é sustentado pelas fontes técnicas lidas (um artigo do Engadget diz expressamente que não trata de glow ou bloom): é um efeito visual a testar em imagem.

**Seção 2 (direção de arte)**
- Sem fontes de ASC, Gnomon ou ArtStation (cinematografia veio de StudioBinder, Wolfcrow, VSCO, No Film School). Temperaturas de cor do abajur e da lâmpada de lava são **estimativas minhas**; materiais de época (papel de parede xadrez, carpete, madeira) têm base fraca [julgamento].
- Fontes tipográficas: a licença foi conferida no **Fontsource**, não nas páginas do Google Fonts (que só mostraram a descrição); suporte a pt-BR é [provável] (conferir acentos). *VCR OSD Mono* sem licença confirmada: não recomendada.

**Seção 3 (referências)**
- Commons, Flickr e Internet Archive diretos não abriram; **só duas fotos de acervo têm licença registrada**, ambas via espelho. bruno-simon.com, portfólios Three.js clássicos e páginas de inspiração do Awwwards não abriram. IndieWire, Vulture e A.frame não abriram; Bandcamp e Discogs não foram abertos (as capas de álbum precisam ser vistas por quem for usar). Poucas referências brasileiras visuais (capas de synthwave brasileiras e capas de VHS de locadora brasileira não foram encontradas).
- **10 URLs aparecem duas vezes** no CSV sob ids diferentes (citadas por trilhas distintas); são 260 linhas e 250 URLs únicas.

**Seção 4 (técnicas)**
- Suporte de `repeating-linear-gradient` e `clip-path`, rasterização de SVG com filtro como `background-image`, WCAG 1.4.1, 1.4.4 e 1.4.10 não foram abertos: [incerto]. Custo real em celular médio não foi medido.

**Seção 6 (PI)**
- Ver 6.6: FAQ do Google Fonts, licença oficial do Pixabay, texto integral da Pexels, LGPD, sentença de Munique, jurisprudência do STJ, políticas de logo de Sony/Nintendo.

**Entrega**
- A pasta **`referencias/` não foi criada**: o shell do ambiente de trabalho **não alcança** hospedagens de imagem (teste: Unsplash retornou 403), então não foi possível baixar imagens de licença livre. Nenhuma imagem protegida foi incorporada ao dossiê.
- O contraste da seção 5.2 foi calculado em Python sobre **cores planas**; o pior caso com halo foi simulado por mistura simples de cor (sem grão, scanlines ou vinheta).

### 8.2 O que o dono precisa decidir

1. **Nome da estética** a adotar internamente. Sugestão da seção 1: "retro gaming room + iluminação low-key motivada + acento retrowave" (sem rótulo único consagrado).
2. **Qual paleta é o padrão** (sugestão: P1) e se as fases do clube (votação / jogando / call) trocam de paleta (P1 / P2 / P3).
3. **Capas dos jogos:** só caixas genéricas geradas por código (recomendado, seção 6) ou links/capas oficiais? Isso decide risco de direitos autorais e de marca e o tamanho da página.
4. **Aceitar o "Modo conforto"** como botão visível (e ligado por padrão em celular fraco?) e o que ele desliga (4.17).
5. **Orçamento de desempenho:** qual celular é o "mínimo aceito" (modelo/ano) para testar, já que metade do grupo está no celular.
6. **Quantos efeitos de luz** e se o letreiro de neon pode piscar de vez em quando (recomendado: raramente, só uma letra, e desligável).
7. **Parallax por giroscópio** no celular ou só por toque/ponteiro (afeta permissões e conforto).
8. **Fontes:** hospedar os `.woff2` no próprio domínio (recomendado) ou aceitar CDN; e quais das combinações T1/T2/T3.
9. **Wordmark e ícones próprios:** quem desenha e se haverá um aviso de não afiliação no rodapé.
10. **Quem testa acessibilidade** (contraste real da página renderizada, zoom 200–400%, leitor de tela, `prefers-reduced-motion`).
11. **Se um advogado de PI revisa** a lista de props antes de publicar, já que o site é público na web mesmo sendo de amigos (a seção 6 não é aconselhamento jurídico).
12. **Conteúdo brasileiro:** quanto da nostalgia local (locadora, Master System/Mega Drive, fliperama, lan house) entra na linguagem visual e no texto de interface.
