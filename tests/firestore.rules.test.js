// Testes das firestore.rules contra o emulador.
// Rode com: npm run test:rules  (precisa de Java instalado)
//
// O projeto "demo-clube" só existe no emulador; nada aqui toca um projeto real.
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

let testEnv;

// Atalho: Firestore "visto" por um usuário logado (ou anônimo, sem uid).
const as = (uid) =>
  uid ? testEnv.authenticatedContext(uid).firestore() : testEnv.unauthenticatedContext().firestore();

// Um jogo válido, no formato que o app grava.
const game = (uid, extra = {}) => ({
  name: 'Celeste',
  cover: '',
  platforms: ['PC', 'Nintendo'],
  year: 2018,
  genre: 'Plataforma',
  pitch: 'Curto, difícil e bonito.',
  duration: 'curto',
  mode: 'solo',
  price: 37,
  suggestedBy: uid,
  createdAt: serverTimestamp(),
  ...extra,
});

const voteData = () => ({ createdAt: serverTimestamp() });

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-clube',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

after(async () => {
  await testEnv?.cleanup();
});

// Cenário base, gravado sem passar pelas rules:
//   admin    -> listado em config/admins
//   alice    -> aprovada, sugeriu jogo em r-sug e r-vot
//   bob      -> aprovado, sugeriu jogo em r-vot e r-jog
//   pendente -> logou mas não foi aprovado
beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    const old = Timestamp.fromDate(new Date('2026-01-01'));
    const seedGame = (uid) => ({ ...game(uid), createdAt: old });

    await setDoc(doc(db, 'config/admins'), { uids: ['admin'] });
    await setDoc(doc(db, 'members/alice'), { name: 'Alice', approved: true, platforms: ['PC'], createdAt: old });
    await setDoc(doc(db, 'members/bob'), { name: 'Bob', approved: true, platforms: ['PC'], createdAt: old });
    await setDoc(doc(db, 'members/pendente'), { name: 'Pendente', approved: false, platforms: [], createdAt: old });

    await setDoc(doc(db, 'rounds/r-sug'), { number: 3, status: 'sugerindo', createdAt: old });
    await setDoc(doc(db, 'rounds/r-sug/games/alice'), seedGame('alice'));

    await setDoc(doc(db, 'rounds/r-vot'), { number: 2, status: 'votando', createdAt: old });
    await setDoc(doc(db, 'rounds/r-vot/games/alice'), seedGame('alice'));
    await setDoc(doc(db, 'rounds/r-vot/games/bob'), seedGame('bob'));
    await setDoc(doc(db, 'rounds/r-vot/games/bob/votes/admin'), { createdAt: old });

    await setDoc(doc(db, 'rounds/r-jog'), {
      number: 1,
      status: 'jogando',
      createdAt: old,
      winnerGameId: 'bob',
      dateOptions: ['2026-12-05T20:00', '2026-12-06T15:00'],
    });
    await setDoc(doc(db, 'rounds/r-jog/games/bob'), seedGame('bob'));

    await setDoc(doc(db, 'rounds/r-enc'), { number: 0, status: 'encerrada', createdAt: old, winnerGameId: 'bob' });
  });
});

// ---------------------------------------------------------------------------
describe('(a) membro não aprovado não vota', () => {
  it('pendente não consegue votar', async () => {
    await assertFails(setDoc(doc(as('pendente'), 'rounds/r-vot/games/bob/votes/pendente'), voteData()));
  });

  it('controle: aprovado vota no jogo de outra pessoa', async () => {
    await assertSucceeds(setDoc(doc(as('alice'), 'rounds/r-vot/games/bob/votes/alice'), voteData()));
  });

  it('visitante sem login não vota', async () => {
    await assertFails(setDoc(doc(as(null), 'rounds/r-vot/games/bob/votes/x'), voteData()));
  });
});

// ---------------------------------------------------------------------------
describe('(b) autor NÃO consegue votar no próprio jogo', () => {
  it('alice não vota no jogo da alice', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-vot/games/alice/votes/alice'), voteData()));
  });

  it('bob não vota no jogo do bob', async () => {
    await assertFails(setDoc(doc(as('bob'), 'rounds/r-vot/games/bob/votes/bob'), voteData()));
  });

  it('ninguém vota em nome de outra pessoa', async () => {
    // alice tentando gravar um voto com o ID do bob no jogo dela
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-vot/games/alice/votes/bob'), voteData()));
  });

  it('não dá pra votar em jogo inexistente', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-vot/games/fantasma/votes/alice'), voteData()));
  });
});

// ---------------------------------------------------------------------------
describe('(c) voto fora do status "votando" é negado', () => {
  it('em "sugerindo"', async () => {
    await assertFails(setDoc(doc(as('bob'), 'rounds/r-sug/games/alice/votes/bob'), voteData()));
  });

  it('em "jogando"', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-jog/games/bob/votes/alice'), voteData()));
  });

  it('em "encerrada"', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await updateDoc(doc(ctx.firestore(), 'rounds/r-jog'), { status: 'encerrada' });
    });
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-jog/games/bob/votes/alice'), voteData()));
  });
});

// ---------------------------------------------------------------------------
describe('(d) não aprovado não escreve nada', () => {
  const db = () => as('pendente');

  it('não sugere jogo', async () => {
    await assertFails(setDoc(doc(db(), 'rounds/r-sug/games/pendente'), game('pendente')));
  });

  it('não cria rodada', async () => {
    await assertFails(
      setDoc(doc(db(), 'rounds/nova'), { number: 9, status: 'sugerindo', createdAt: serverTimestamp() }),
    );
  });

  it('não muda status de rodada', async () => {
    await assertFails(updateDoc(doc(db(), 'rounds/r-sug'), { status: 'votando' }));
  });

  it('não se autoaprova', async () => {
    await assertFails(updateDoc(doc(db(), 'members/pendente'), { approved: true }));
  });

  it('não edita o próprio perfil', async () => {
    await assertFails(updateDoc(doc(db(), 'members/pendente'), { name: 'Outro nome' }));
  });

  it('não mexe no perfil de outra pessoa', async () => {
    await assertFails(updateDoc(doc(db(), 'members/alice'), { name: 'Hackeada' }));
  });

  it('não dá nota, não vota em data, não cria pergunta', async () => {
    await assertFails(
      setDoc(doc(db(), 'rounds/r-jog/ratings/pendente'), {
        score: 8, comment: '', spoiler: false, updatedAt: serverTimestamp(),
      }),
    );
    await assertFails(
      setDoc(doc(db(), 'rounds/r-jog/dateVotes/pendente'), {
        dates: ['2026-12-05T20:00'], updatedAt: serverTimestamp(),
      }),
    );
    await assertFails(
      addDoc(collection(db(), 'rounds/r-jog/questions'), {
        text: 'E aí?', createdBy: 'pendente', createdAt: serverTimestamp(),
      }),
    );
  });

  it('não altera config/admins', async () => {
    await assertFails(setDoc(doc(db(), 'config/admins'), { uids: ['pendente'] }));
  });

  it('controle: admin aprova o pendente', async () => {
    await assertSucceeds(updateDoc(doc(as('admin'), 'members/pendente'), { approved: true }));
  });

  it('controle: membro aprovado edita o próprio perfil, mas não o approved', async () => {
    await assertSucceeds(updateDoc(doc(as('alice'), 'members/alice'), { name: 'Alice B.', platforms: ['PC', 'Xbox'] }));
    await assertFails(updateDoc(doc(as('alice'), 'members/alice'), { approved: false }));
  });

  it('controle: usuário novo cria o próprio doc com approved=false', async () => {
    await assertSucceeds(
      setDoc(doc(as('novato'), 'members/novato'), {
        name: 'Novato', photoURL: '', approved: false, platforms: [], createdAt: serverTimestamp(),
      }),
    );
  });

  it('usuário novo NÃO cria o próprio doc já aprovado', async () => {
    await assertFails(
      setDoc(doc(as('novato'), 'members/novato'), {
        name: 'Novato', photoURL: '', approved: true, platforms: [], createdAt: serverTimestamp(),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
describe('(e) só admin altera status da rodada', () => {
  it('membro aprovado não muda status', async () => {
    await assertFails(updateDoc(doc(as('alice'), 'rounds/r-sug'), { status: 'votando' }));
  });

  it('membro aprovado não cria rodada', async () => {
    await assertFails(
      setDoc(doc(as('alice'), 'rounds/nova'), { number: 9, status: 'sugerindo', createdAt: serverTimestamp() }),
    );
  });

  it('admin avança 1 passo', async () => {
    await assertSucceeds(updateDoc(doc(as('admin'), 'rounds/r-sug'), { status: 'votando' }));
  });

  it('admin volta 1 passo', async () => {
    await assertSucceeds(updateDoc(doc(as('admin'), 'rounds/r-vot'), { status: 'sugerindo' }));
  });

  it('admin não pula etapa', async () => {
    await assertFails(updateDoc(doc(as('admin'), 'rounds/r-sug'), { status: 'jogando', winnerGameId: 'alice' }));
  });

  it('admin não vai pra "jogando" sem vencedor', async () => {
    await assertFails(updateDoc(doc(as('admin'), 'rounds/r-vot'), { status: 'jogando' }));
  });

  it('admin encerra votação gravando vencedor existente', async () => {
    await assertSucceeds(
      updateDoc(doc(as('admin'), 'rounds/r-vot'), {
        status: 'jogando',
        winnerGameId: 'bob',
        winner: { name: 'Celeste', cover: '', suggestedBy: 'bob' },
      }),
    );
  });

  it('admin cria rodada nova em "sugerindo"', async () => {
    await assertSucceeds(
      setDoc(doc(as('admin'), 'rounds/nova'), { number: 4, status: 'sugerindo', createdAt: serverTimestamp() }),
    );
  });
});

// ---------------------------------------------------------------------------
describe('tema da rodada', () => {
  it('controle: admin define o tema', async () => {
    await assertSucceeds(updateDoc(doc(as('admin'), 'rounds/r-sug'), { theme: 'Jogos indies' }));
  });

  it('membro aprovado não muda o tema', async () => {
    await assertFails(updateDoc(doc(as('alice'), 'rounds/r-sug'), { theme: 'Só Mario' }));
  });

  it('tema acima de 60 caracteres é negado', async () => {
    await assertFails(updateDoc(doc(as('admin'), 'rounds/r-sug'), { theme: 'x'.repeat(61) }));
  });
});

describe('recados no jogo', () => {
  const recado = (uid, extra = {}) => ({ text: 'Esse eu topo!', createdBy: uid, createdAt: serverTimestamp(), ...extra });

  it('controle: bob comenta no jogo da alice em "sugerindo"', async () => {
    await assertSucceeds(addDoc(collection(as('bob'), 'rounds/r-sug/games/alice/comments'), recado('bob')));
  });

  it('controle: alice comenta em "votando"', async () => {
    await assertSucceeds(addDoc(collection(as('alice'), 'rounds/r-vot/games/bob/comments'), recado('alice')));
  });

  it('recado em "jogando" é negado', async () => {
    await assertFails(addDoc(collection(as('alice'), 'rounds/r-jog/games/bob/comments'), recado('alice')));
  });

  it('pendente não comenta', async () => {
    await assertFails(addDoc(collection(as('pendente'), 'rounds/r-sug/games/alice/comments'), recado('pendente')));
  });

  it('ninguém comenta em nome de outra pessoa', async () => {
    await assertFails(addDoc(collection(as('bob'), 'rounds/r-sug/games/alice/comments'), recado('alice')));
  });

  it('recado em jogo inexistente é negado', async () => {
    await assertFails(addDoc(collection(as('bob'), 'rounds/r-sug/games/fantasma/comments'), recado('bob')));
  });

  it('recado acima de 300 caracteres é negado', async () => {
    await assertFails(addDoc(collection(as('bob'), 'rounds/r-sug/games/alice/comments'), recado('bob', { text: 'x'.repeat(301) })));
  });

  it('só o autor, o admin ou o dono do jogo apagam o recado', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'rounds/r-vot/games/bob/comments/c1'), { text: 'oi', createdBy: 'admin', createdAt: Timestamp.now() }),
    );
    await assertFails(deleteDoc(doc(as('alice'), 'rounds/r-vot/games/bob/comments/c1')));
    await assertSucceeds(deleteDoc(doc(as('bob'), 'rounds/r-vot/games/bob/comments/c1')));
  });
});

describe('(f) segunda sugestão do mesmo usuário na mesma rodada é negada', () => {
  it('controle: primeira sugestão do bob é aceita', async () => {
    await assertSucceeds(setDoc(doc(as('bob'), 'rounds/r-sug/games/bob'), game('bob')));
  });

  it('alice não cria um segundo jogo com outro ID', async () => {
    await assertFails(addDoc(collection(as('alice'), 'rounds/r-sug/games'), game('alice')));
  });

  it('alice não "recria" o jogo por cima do existente', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-sug/games/alice'), game('alice', { name: 'Hades' })));
  });

  it('alice não sugere em nome do bob', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-sug/games/bob'), game('bob')));
  });

  it('controle: alice edita o próprio jogo em "sugerindo"', async () => {
    await assertSucceeds(updateDoc(doc(as('alice'), 'rounds/r-sug/games/alice'), { name: 'Hades' }));
  });

  it('alice não edita o jogo depois que a votação abriu', async () => {
    await assertFails(updateDoc(doc(as('alice'), 'rounds/r-vot/games/alice'), { name: 'Hades' }));
  });

  it('pitch acima de 200 caracteres é negado', async () => {
    await assertFails(setDoc(doc(as('bob'), 'rounds/r-sug/games/bob'), game('bob', { pitch: 'x'.repeat(201) })));
  });
});

describe('capa enviada do aparelho (coverData)', () => {
  const jpeg = (n) => `data:image/jpeg;base64,${'A'.repeat(n)}`;

  it('controle: capa JPEG em data URL dentro do limite é aceita', async () => {
    await assertSucceeds(setDoc(doc(as('bob'), 'rounds/r-sug/games/bob'), game('bob', { coverData: jpeg(40000) })));
  });

  it('capa acima de 100 mil caracteres é negada', async () => {
    await assertFails(setDoc(doc(as('bob'), 'rounds/r-sug/games/bob'), game('bob', { coverData: jpeg(100000) })));
  });

  it('data URL que não é JPEG é negada', async () => {
    await assertFails(setDoc(doc(as('bob'), 'rounds/r-sug/games/bob'), game('bob', { coverData: 'data:text/html;base64,PHNjcmlwdD4=' })));
  });

  it('controle: dono troca a capa enviada por vazio', async () => {
    await assertSucceeds(updateDoc(doc(as('alice'), 'rounds/r-sug/games/alice'), { coverData: jpeg(100), cover: '' }));
    await assertSucceeds(updateDoc(doc(as('alice'), 'rounds/r-sug/games/alice'), { coverData: '' }));
  });
});

// ---------------------------------------------------------------------------
describe('voto secreto durante "votando"', () => {
  it('bob não lê o voto do admin', async () => {
    await assertFails(getDoc(doc(as('bob'), 'rounds/r-vot/games/bob/votes/admin')));
  });

  it('admin lê o próprio voto e o dos outros', async () => {
    await assertSucceeds(getDoc(doc(as('admin'), 'rounds/r-vot/games/bob/votes/admin')));
  });

  it('eleitor desmarca o próprio voto', async () => {
    const db = as('alice');
    await setDoc(doc(db, 'rounds/r-vot/games/bob/votes/alice'), voteData());
    await assertSucceeds(deleteDoc(doc(db, 'rounds/r-vot/games/bob/votes/alice')));
  });
});

// ---------------------------------------------------------------------------
describe('pós-jogo', () => {
  const rating = (score) => ({ score, comment: 'Bom', spoiler: false, updatedAt: serverTimestamp() });

  it('nota com meio ponto é aceita', async () => {
    await assertSucceeds(setDoc(doc(as('alice'), 'rounds/r-jog/ratings/alice'), rating(7.5)));
  });

  it('nota 7.3 é negada', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-jog/ratings/alice'), rating(7.3)));
  });

  it('nota acima de 10 é negada', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-jog/ratings/alice'), rating(11)));
  });

  it('nota em "votando" é negada', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-vot/ratings/alice'), rating(8)));
  });

  it('voto em data proposta é aceito; data inventada é negada', async () => {
    const db = as('alice');
    await assertSucceeds(
      setDoc(doc(db, 'rounds/r-jog/dateVotes/alice'), { dates: ['2026-12-05T20:00'], updatedAt: serverTimestamp() }),
    );
    await assertFails(
      setDoc(doc(db, 'rounds/r-jog/dateVotes/alice'), { dates: ['2030-01-01T00:00'], updatedAt: serverTimestamp() }),
    );
  });

  it('autor edita a própria pergunta; outro membro não', async () => {
    const ref = await addDoc(collection(as('alice'), 'rounds/r-jog/questions'), {
      text: 'Qual chefe foi o pior?', createdBy: 'alice', createdAt: serverTimestamp(),
    });
    const path = `rounds/r-jog/questions/${ref.id}`;
    await assertSucceeds(updateDoc(doc(as('alice'), path), { text: 'Qual chefe foi o mais difícil?', updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(doc(as('bob'), path), { text: 'Mudei', updatedAt: serverTimestamp() }));
    await assertSucceeds(deleteDoc(doc(as('admin'), path)));
  });
});

// ---------------------------------------------------------------------------
describe('quadro livre (encerrada)', () => {
  const img = (extra = {}) => ({ data: 'data:image/jpeg;base64,' + 'A'.repeat(40), x: 10, y: 20, w: 200, ...extra });
  const board = (extra = {}) => ({ note: { x: 30, y: 90 }, strokes: ['0|6|1,2 3,4'], images: [img()], updatedAt: serverTimestamp(), ...extra });

  it('cada um grava o próprio quadro na encerrada', async () => {
    await assertSucceeds(setDoc(doc(as('alice'), 'rounds/r-enc/board/alice'), board()));
  });

  it('ninguém grava o quadro dos outros', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-enc/board/bob'), board()));
  });

  it('fora da encerrada é negado', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-jog/board/alice'), board()));
  });

  it('mais de 3 imagens é negado', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-enc/board/alice'), board({ images: [img(), img(), img(), img()] })));
  });

  it('imagem que não é JPEG em data URL é negada', async () => {
    await assertFails(setDoc(doc(as('alice'), 'rounds/r-enc/board/alice'), board({ images: [img({ data: 'https://x.com/a.jpg' + 'a'.repeat(30) })] })));
  });

  it('pendente não grava', async () => {
    await assertFails(setDoc(doc(as('pendente'), 'rounds/r-enc/board/pendente'), board()));
  });
});
