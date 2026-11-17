# Decisões ativas

- **Modelo de dados:** `config/admins{uids}`, `members/{uid}`, `rounds/{id}` com subcoleções
  `games/{uidDoAutor}/votes/{uidEleitor}` e `games/{uid}/comments/{auto}` (recados, criados só em
  sugerindo/votando; apagar o jogo apaga os recados; "já vi" fica só no aparelho, `localStorage` em `src/lib/visto.js`),
  `games.trailer` (opcional, link https do YouTube ≤ 200; vira embed `youtube-nocookie` pelo ID), `rounds.theme` (tema da rodada, ≤ 60, só admin), `rounds.fotoVencedor` (foto do ganhador da votação no porta-retrato da mesa; JPEG data URL ≤ 100 mil, só admin), `dateVotes/{uid}`, `ratings/{uid}`, `questions/{auto}`, `board/{uid}` (quadro livre da encerrada: `note{x,y}`|null,
  `strokes` ≤ 150 strings `cor|largura|x,y x,y…`, `images` ≤ 3 `{data JPEG ≤ 100 mil, x, y, w 60–500}`; cada um só grava o seu),
  `diario/{uid}_{0|1|2}` (quadro de jogando, 3 páginas por pessoa: `notes` ≤ 6 `{x,y,text 1–140}`, `strokes`/`images`
  iguais ao board; sem nota; só grava em "jogando", depois fica pra ver; 6 notinhas é o teto que cabe no limite de
  1000 expressões das rules junto com 3 fotos), `zerei/{uid}` (`{at: hora do servidor, foto, recado}`; foto de prova obrigatória, JPEG data URL ≤ 100 mil; recado opcional ≤ 140 (balão na estatueta da mesa);
  ordem de `at` = posição da estatueta; cria/apaga só em "jogando", sem update; o dono desfaz, o admin anula qualquer um).
  Por quê: ID = uid deixa as rules garantirem "1 por pessoa". Exige: não mudar sem perguntar.
- **Status anda 1 passo para frente ou para trás** (só admin). Voltar de votando apaga votos; voltar
  de jogando apaga vencedor. Exige: rules com `validStatusStep`; vencedor obrigatório a partir de jogando.
- **Voto secreto até fechar:** durante "votando" só o admin lê todos. Exige: não listar votos no
  cliente de membro durante a votação.
- **Contagem no cliente** (sem Functions); vencedor copiado na rodada (`winner{name,cover,suggestedBy}`)
  para estante/anúncio não lerem jogos. Empate: sorteio com `crypto` no cliente do admin, gravado em
  `tiebreak.candidates`.
- **Notas:** 0–10 em meio ponto nas rules; a UI mostra 5 estrelas com meia (grava inteiro 0–10, 1 = meia estrela); as rules aceitam notas e perguntas em "jogando" e "encerrada", mas a UI só mostra quadro de resenha e perguntas na encerrada. Pergunta: autor
  edita/apaga, admin apaga.
- **Enquete de datas:** multi-seleção; admin confirma `meetingDate`; voto só em datas de `dateOptions`.
- **Plataformas em famílias** (PC, PlayStation, Xbox, Nintendo, Mobile, Mac, Linux) — lista repetida
  em `platforms.js` e nas rules; mudar nos dois.
- **Preço** inteiro em R$ (0 = grátis). **Stats:** "mais polêmico" exige ≥ 3 notas; "nunca ganharam"
  agrupa por id RAWG ou nome normalizado.
- **App assíncrono:** sem tempo real/"ao vivo"; ficha sempre mostra a próxima ação da pessoa.
- **Admin só aprova** membros (sem recusar/revogar); novos admins pelo console.
- **Testes:** `node:test` (sem runner extra); emulador sempre em `demo-clube`.
- **Visual definitivo "Sexta no quarto"** (decisão do usuário, a partir do dossiê `Estetica/DOSSIE.md`):
  quarto gamer retrô às escuras com a locadora mantida nos objetos (etiqueta, ficha, carimbo, capa na prateleira).
  Rejeitados: vaporwave, Y2K/Frutiger Aero, cyberpunk, terror analógico, pixel em tudo. Paleta P2 (âmbar, rosa,
  teal); fontes Bebas Neue, Atkinson, Special Elite, Permanent Marker hospedadas no domínio (sem `@fontsource`).
  Capas continuam as da RAWG (3:4); sem imagem, caixa genérica por código. **Capa enviada do aparelho:**
  comprimida no cliente (corte 3:4, 300x400, JPEG 0.8, ~20–60 KB) e guardada como data URL no documento do
  jogo no Firestore (sem Storage, que é pago), no campo `coverData` (rules: JPEG data URL ≤ 100 mil caracteres);
  `cover` segue sendo só link http(s). Vencedor copia os dois. **Logos, consoles, jogos e personagens
  reais são liberados** (projeto pessoal entre amigos, sem fins comerciais). **Sem aviso de não afiliação no rodapé** (dono pediu para tirar).
- **Confirmações dentro da página** (`confirmInline`), nunca `window.confirm`.
- **Migração visual sem campo novo:** elemento de mock sem campo no modelo fica de fora (ver STATE). Mapeamentos
  adotados: resenha do quadro = comentário da nota (`ratings`); "Fase N" = número da rodada (h1, canal da TV);
  jogando/encerrada trocam o h1 pela faixa de pano; calendário = `dateOptions` + `dateVotes` (dia com 2+ horários
  vira botões por horário); "Finalizar" da encerrada = abrir a próxima fase (`createRound`).
- **Git:** um commit por marco/entrega, conferindo que nenhum segredo entrou.
