# Decisões ativas

- **Modelo de dados:** `config/admins{uids}`, `members/{uid}`, `rounds/{id}` com subcoleções
  `games/{uidDoAutor}/votes/{uidEleitor}`, `dateVotes/{uid}`, `ratings/{uid}`, `questions/{auto}`.
  Por quê: ID = uid deixa as rules garantirem "1 por pessoa". Exige: não mudar sem perguntar.
- **Status anda 1 passo para frente ou para trás** (só admin). Voltar de votando apaga votos; voltar
  de jogando apaga vencedor. Exige: rules com `validStatusStep`; vencedor obrigatório a partir de jogando.
- **Voto secreto até fechar:** durante "votando" só o admin lê todos. Exige: não listar votos no
  cliente de membro durante a votação.
- **Contagem no cliente** (sem Functions); vencedor copiado na rodada (`winner{name,cover,suggestedBy}`)
  para estante/anúncio não lerem jogos. Empate: sorteio com `crypto` no cliente do admin, gravado em
  `tiebreak.candidates`.
- **Notas:** 0–10 em meio ponto; notas e perguntas valem em "jogando" e "encerrada". Pergunta: autor
  edita/apaga, admin apaga.
- **Enquete de datas:** multi-seleção; admin confirma `meetingDate`; voto só em datas de `dateOptions`.
- **Plataformas em famílias** (PC, PlayStation, Xbox, Nintendo, Mobile, Mac, Linux) — lista repetida
  em `platforms.js` e nas rules; mudar nos dois.
- **Preço** inteiro em R$ (0 = grátis). **Stats:** "mais polêmico" exige ≥ 3 notas; "nunca ganharam"
  agrupa por id RAWG ou nome normalizado.
- **App assíncrono:** sem tempo real/"ao vivo"; ficha sempre mostra a próxima ação da pessoa.
- **Admin só aprova** membros (sem recusar/revogar); novos admins pelo console.
- **Testes:** `node:test` (sem runner extra); emulador sempre em `demo-clube`.
- **Visual "Locadora de sexta"** escolhido pelo usuário entre dois mocks; fontes via Google Fonts.
- **Confirmações dentro da página** (`confirmInline`), nunca `window.confirm`.
- **Git:** um commit por marco/entrega, conferindo que nenhum segredo entrou.
