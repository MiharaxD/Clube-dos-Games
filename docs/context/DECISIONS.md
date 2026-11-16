# Decisões ativas

- **Modelo de dados:** `config/admins{uids}`, `members/{uid}`, `rounds/{id}` com subcoleções
  `games/{uidDoAutor}/votes/{uidEleitor}` e `games/{uid}/comments/{auto}` (recados, criados só em
  sugerindo/votando; apagar o jogo apaga os recados), `rounds.theme` (tema da rodada, ≤ 60, só admin), `dateVotes/{uid}`, `ratings/{uid}`, `questions/{auto}`, `board/{uid}` (quadro livre da encerrada: `note{x,y}`|null,
  `strokes` ≤ 150 strings `cor|largura|x,y x,y…`, `images` ≤ 3 `{data JPEG ≤ 100 mil, x, y, w 60–500}`; cada um só grava o seu).
  Por quê: ID = uid deixa as rules garantirem "1 por pessoa". Exige: não mudar sem perguntar.
- **Status anda 1 passo para frente ou para trás** (só admin). Voltar de votando apaga votos; voltar
  de jogando apaga vencedor. Exige: rules com `validStatusStep`; vencedor obrigatório a partir de jogando.
- **Voto secreto até fechar:** durante "votando" só o admin lê todos. Exige: não listar votos no
  cliente de membro durante a votação.
- **Contagem no cliente** (sem Functions); vencedor copiado na rodada (`winner{name,cover,suggestedBy}`)
  para estante/anúncio não lerem jogos. Empate: sorteio com `crypto` no cliente do admin, gravado em
  `tiebreak.candidates`.
- **Notas:** 0–10 em meio ponto nas rules; a UI mostra 5 estrelas com meia (grava inteiro 0–10, 1 = meia estrela); notas e perguntas valem em "jogando" e "encerrada". Pergunta: autor
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
