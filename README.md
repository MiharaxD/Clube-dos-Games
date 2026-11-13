# Clube dos Jogos

Clube do livro, só que de jogo. A cada rodada cada membro sugere um jogo, o grupo vota,
o mais votado vira o jogo da rodada, todo mundo joga e depois a gente se reúne pra conversar.

Stack: Vite + JavaScript puro, Firebase Authentication (Google), Firestore e Hosting.
Tudo funciona no plano gratuito (Spark), sem Cloud Functions.

---

## 1. Pré-requisitos

- **Node.js 24.12+** (`node -v`)
- **Java JDK 11+** (recomendado 21, ex.: [Eclipse Temurin](https://adoptium.net/)). Só é usado
  pelo emulador do Firestore nos testes das rules.
- Uma conta Google.

```bash
npm install
```

O `firebase-tools` (CLI do Firebase) já vem como devDependency. Use sempre `npx firebase ...`.

## 2. Criar o projeto no Firebase

1. Acesse <https://console.firebase.google.com> e clique em **Criar projeto**.
   O Google Analytics é opcional e não é usado.
2. Fique no plano **Spark** (gratuito).

## 3. Ativar o login com Google

1. No menu lateral: **Criação > Authentication > Vamos começar**.
2. Aba **Método de login > Google > Ativar**. Escolha um e-mail de suporte e salve.
3. Em **Configurações > Domínios autorizados**, `localhost` já vem na lista. O domínio do
   Hosting (`SEU-PROJETO.web.app`) entra sozinho depois do primeiro deploy.

## 4. Criar o Firestore

1. **Criação > Firestore Database > Criar banco de dados**.
2. Escolha a edição **Standard** e um local próximo (ex.: `southamerica-east1`, São Paulo).
   O local não pode ser trocado depois.
3. Comece em **modo de produção**: as regras de verdade são publicadas no passo 7.

## 5. Registrar o app web e preencher o `.env.local`

1. **Configurações do projeto** (engrenagem) **> Geral > Seus apps > ícone `</>`**.
2. Dê um apelido e registre o app. Não precisa marcar o Hosting aqui.
3. Copie o arquivo de exemplo e preencha com os valores do objeto `firebaseConfig` mostrado:

```bash
cp .env.example .env.local
```

| Variável | Campo no `firebaseConfig` |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |
| `VITE_RAWG_API_KEY` (opcional) | chave gratuita em <https://rawg.io/apidocs> |

> **Sobre segurança:** toda variável `VITE_*` é embutida no JavaScript publicado e qualquer
> pessoa pode lê-la no navegador. Isso é esperado para a config web do Firebase, porque quem
> protege os dados são as `firestore.rules`. A chave do RAWG também fica visível. Sem Cloud
> Functions não há como escondê-la; o risco é alguém gastar a sua cota gratuita do RAWG.

## 6. Ligar o CLI ao seu projeto

```bash
npx firebase login
```

```bash
npx firebase use --add
```

Escolha o projeto criado no passo 2 e dê o apelido `default`.

## 7. Publicar as regras do Firestore

```bash
npx firebase deploy --only firestore:rules
```

## 8. Rodar localmente

```bash
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente <http://localhost:5173>).

## 9. Criar o primeiro admin

O admin é definido no documento `config/admins`, que só pode ser criado pelo console.

1. Rode o app (passo 8) e **entre com a sua conta Google**. Você vai cair na tela
   "aguardando aprovação". Isso é normal.
2. No console: **Authentication > Usuários**. Copie o **UID do usuário** da sua conta.
3. **Firestore Database > Dados > Iniciar coleção**:
   - ID da coleção: `config`
   - ID do documento: `admins`
   - Campo: `uids`, tipo **array**, com um item do tipo **string** = o UID copiado.
4. Recarregue o app. Como admin você já tem acesso total e pode aprovar os outros membros na
   tela de admin.

Para ter mais de um admin, adicione mais UIDs nesse mesmo array pelo console.

## 10. Testes das regras (emulador)

Precisa do Java instalado (passo 1). Os testes rodam no projeto fictício `demo-clube`, que
existe só no emulador e nunca toca o seu projeto real.

```bash
npm run test:rules
```

## 11. Build e deploy do site

```bash
npm run build
```

```bash
npx firebase deploy --only hosting
```

O site fica em `https://SEU-PROJETO.web.app`.
