# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + JavaScript puro (sem framework, sem TypeScript), HTML e CSS próprios, mobile-first.
Firebase Authentication (Google), Firestore e Hosting, só plano gratuito (sem Cloud Functions).
Sem bibliotecas de UI. Fontes `.woff2` hospedadas no próprio domínio (`public/fonts`).

## Users

Um grupo de amigos (5 a 12 pessoas) que funciona como um "clube do livro" de videogame.
Abrem o site pelo link colado no WhatsApp/Discord, mais ou menos meio a meio entre celular e PC
(muitos jogam no PC e abrem o site ali mesmo). Um ou dois admins conduzem as rodadas.

## Product Purpose

Organizar o ciclo de cada rodada: cada membro sugere um jogo, o grupo vota por aprovação,
o mais votado vira o jogo da rodada, todo mundo joga e depois se reúne numa call para conversar.
Sucesso = a rodada anda sem ninguém precisar coordenar tudo no chat, e a história do clube fica
registrada (estante e stats).

## Positioning

Não é catálogo nem rede social de jogos: é o ritual de um grupo fechado. Cada rodada é uma "fase"
com etapas fixas (sugerindo → votando → jogando → encerrada), e ninguém vota no próprio jogo.

## Operating Context

- Tudo é assíncrono: ninguém precisa estar online ao mesmo tempo. As sugestões e os votos ficam
  salvos e cada membro sugere, vota ou muda o voto quando puder, ao longo de dias. Não há
  cronômetro nem tela "ao vivo"; a interface sempre mostra o que ainda falta a pessoa fazer.
- Rodadas sequenciais, uma ativa por vez. O admin avança (ou volta um passo) o status quando
  achar que o grupo já teve tempo.
- Votação por aprovação, secreta até o admin encerrar; empate decidido por sorteio com roleta.
- Fase "jogando": prazo, link da call, enquete de datas; depois notas (0–10, meio ponto),
  comentários com spoiler escondido e perguntas para a discussão.
- Mensagens de anúncio são copiadas e coladas manualmente no WhatsApp/Discord.
- Busca de jogos opcional via API do RAWG (capa, ano, gênero, plataformas).

## Capabilities and Constraints

- Acesso só para membros aprovados pelo admin; novos ficam em "aguardando aprovação".
- Regras de negócio garantidas nas Firestore Security Rules, não só na interface.
- Plataformas agrupadas em famílias: PC, PlayStation, Xbox, Nintendo, Mobile, Mac, Linux.
- Idioma: pt-BR.

## Brand Commitments

- Nome: "Clube dos Jogos". Não existe logo, cor ou mascote prévios.
- Voz: zoeira de amigos. Informal, gíria leve, piada em estados vazios e avisos, sem sacrificar
  a clareza. Frase obrigatória: o jogo do próprio usuário mostra "esse é seu, calma".
- Visual pedido pelo dono: retro/pixel art com personalidade, fonte pixelada nos títulos e fonte
  legível no texto corrido, paleta escura com acentos fortes, capas grandes, rodada com cara de
  "fase" (barra de progresso do status).

## Evidence on Hand

Nenhum conteúdo real ainda: sem capas, membros ou rodadas. Capas vêm do RAWG ou de URL colada
pelo membro. Não inventar membros, jogos ou números.

## Product Principles

1. O ritual primeiro: a pessoa sempre sabe em que fase a rodada está e o que falta ela fazer.
2. Justo por construção: regras importantes valem no servidor; a interface só explica.
3. O jogo é a estrela: capas grandes, o resto da interface abre espaço.
4. Rápido no celular, confortável no PC.

## Accessibility & Inclusion

Contraste WCAG AA, foco visível em todo elemento interativo, alvos de toque confortáveis,
respeitar `prefers-reduced-motion` (inclusive na roleta do sorteio).
