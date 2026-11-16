// Todas as leituras e escritas no Firestore ficam aqui.
// As telas nunca chamam o SDK direto: assim dá pra ver num lugar só o que o app grava.
// Lembrete: quem garante as regras de verdade são as firestore.rules; aqui é só o cliente.
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase.js';

const withId = (snap) => ({ id: snap.id, ...snap.data() });

// ---------------------------------------------------------------- membros

export async function getAdminUids() {
  const snap = await getDoc(doc(db, 'config/admins'));
  return snap.exists() ? (snap.data().uids ?? []) : [];
}

export async function getMember(uid) {
  const snap = await getDoc(doc(db, 'members', uid));
  return snap.exists() ? withId(snap) : null;
}

// Primeiro login: cria o membro SEMPRE com approved=false (as rules exigem).
export async function createMember(user) {
  const data = {
    name: (user.displayName || user.email || 'Sem nome').slice(0, 80),
    photoURL: user.photoURL || '',
    approved: false,
    platforms: [],
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'members', user.uid), data);
  return { id: user.uid, ...data };
}

export async function listMembers() {
  const snap = await getDocs(collection(db, 'members'));
  return snap.docs.map(withId).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

export function approveMember(uid) {
  return updateDoc(doc(db, 'members', uid), { approved: true });
}

export function updateProfile(uid, { name, platforms }) {
  return updateDoc(doc(db, 'members', uid), { name, platforms });
}

// ---------------------------------------------------------------- rodadas

export async function listRounds() {
  const snap = await getDocs(query(collection(db, 'rounds'), orderBy('number', 'desc')));
  return snap.docs.map(withId);
}

export async function getRound(roundId) {
  const snap = await getDoc(doc(db, 'rounds', roundId));
  return snap.exists() ? withId(snap) : null;
}

export async function createRound(number) {
  const ref = doc(collection(db, 'rounds'));
  await setDoc(ref, { number, status: 'sugerindo', createdAt: serverTimestamp() });
  return ref.id;
}

export function updateRound(roundId, data) {
  return updateDoc(doc(db, 'rounds', roundId), data);
}

// Tema da rodada (faixa em cima da prateleira). Vazio = sem tema.
export function updateRoundTheme(roundId, theme) {
  return updateDoc(doc(db, 'rounds', roundId), { theme: theme || deleteField() });
}

// Enquete de datas: opções propostas pelo admin e a data confirmada (null = nenhuma).
export function updateRoundDates(roundId, dateOptions, meetingDate) {
  return updateDoc(doc(db, 'rounds', roundId), {
    dateOptions,
    meetingDate: meetingDate ?? deleteField(),
  });
}

// Avança/volta o status. Os casos de "voltar" limpam o que deixou de valer:
// - votando -> sugerindo: apaga todos os votos (o autor pode editar o jogo depois)
// - jogando -> votando:  apaga o vencedor gravado
// Tudo num batch: ou grava tudo, ou nada.
export async function changeStatus(round, newStatus, { games = [], extra = {} } = {}) {
  const batch = writeBatch(db);
  const roundRef = doc(db, 'rounds', round.id);

  if (round.status === 'votando' && newStatus === 'sugerindo') {
    for (const game of games) {
      const votes = await getDocs(collection(db, 'rounds', round.id, 'games', game.id, 'votes'));
      votes.forEach((vote) => batch.delete(vote.ref));
    }
  }

  const update = { status: newStatus, ...extra };
  if (round.status === 'jogando' && newStatus === 'votando') {
    update.winnerGameId = deleteField();
    update.winner = deleteField();
    update.tiebreak = deleteField();
  }
  batch.update(roundRef, update);
  await batch.commit();
}

// ---------------------------------------------------------------- jogos

export async function listGames(roundId) {
  const snap = await getDocs(collection(db, 'rounds', roundId, 'games'));
  return snap.docs.map(withId).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

// O ID do documento é o uid do autor: é isso que garante 1 jogo por pessoa por rodada.
export function createGame(roundId, uid, data) {
  return setDoc(doc(db, 'rounds', roundId, 'games', uid), {
    ...data,
    suggestedBy: uid,
    createdAt: serverTimestamp(),
  });
}

export function updateGame(roundId, uid, data) {
  return updateDoc(doc(db, 'rounds', roundId, 'games', uid), data);
}

// Apaga o jogo junto com os recados dele (senão voltariam se a pessoa sugerisse de novo).
export async function deleteGame(roundId, uid) {
  const batch = writeBatch(db);
  const comments = await getDocs(collection(db, 'rounds', roundId, 'games', uid, 'comments'));
  comments.forEach((c) => batch.delete(c.ref));
  batch.delete(doc(db, 'rounds', roundId, 'games', uid));
  await batch.commit();
}

// ---------------------------------------------------------------- recados no jogo (sugerindo/votando)

export async function listComments(roundId, gameId) {
  const snap = await getDocs(query(collection(db, 'rounds', roundId, 'games', gameId, 'comments'), orderBy('createdAt')));
  return snap.docs.map(withId);
}

export function addComment(roundId, gameId, uid, text) {
  return addDoc(collection(db, 'rounds', roundId, 'games', gameId, 'comments'), {
    text,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
}

export function deleteComment(roundId, gameId, commentId) {
  return deleteDoc(doc(db, 'rounds', roundId, 'games', gameId, 'comments', commentId));
}

// ---------------------------------------------------------------- votos

const voteRef = (roundId, gameId, uid) => doc(db, 'rounds', roundId, 'games', gameId, 'votes', uid);

// Durante a votação o membro só pode ler o PRÓPRIO voto (voto secreto),
// então lemos voto a voto em vez de listar a subcoleção.
export async function getMyVotes(roundId, games, uid) {
  const checks = await Promise.all(games.map((g) => getDoc(voteRef(roundId, g.id, uid))));
  return new Set(games.filter((_, i) => checks[i].exists()).map((g) => g.id));
}

// Lista todos os votos (só o admin durante "votando"; todo mundo depois).
// Retorna { [gameId]: [uid, ...] }
export async function listAllVotes(roundId, games) {
  const result = {};
  await Promise.all(
    games.map(async (g) => {
      const snap = await getDocs(collection(db, 'rounds', roundId, 'games', g.id, 'votes'));
      result[g.id] = snap.docs.map((d) => d.id);
    }),
  );
  return result;
}

export function castVote(roundId, gameId, uid) {
  return setDoc(voteRef(roundId, gameId, uid), { createdAt: serverTimestamp() });
}

export function removeVote(roundId, gameId, uid) {
  return deleteDoc(voteRef(roundId, gameId, uid));
}

// ---------------------------------------------------------------- enquete de datas

export async function listDateVotes(roundId) {
  const snap = await getDocs(collection(db, 'rounds', roundId, 'dateVotes'));
  return snap.docs.map(withId);
}

export function saveDateVote(roundId, uid, dates) {
  return setDoc(doc(db, 'rounds', roundId, 'dateVotes', uid), { dates, updatedAt: serverTimestamp() });
}

// ---------------------------------------------------------------- notas

export async function listRatings(roundId) {
  const snap = await getDocs(collection(db, 'rounds', roundId, 'ratings'));
  return snap.docs.map(withId);
}

export function saveRating(roundId, uid, { score, comment, spoiler }) {
  return setDoc(doc(db, 'rounds', roundId, 'ratings', uid), {
    score,
    comment,
    spoiler,
    updatedAt: serverTimestamp(),
  });
}

// ---------------------------------------------------------------- quadro livre (encerrada)

// Um doc por pessoa: { note: {x,y}|null, strokes: ['cor|largura|x,y x,y ...'], images: [{data,x,y,w}] }
export async function listBoard(roundId) {
  const snap = await getDocs(collection(db, 'rounds', roundId, 'board'));
  return snap.docs.map(withId);
}

export function saveBoard(roundId, uid, { note, strokes, images }) {
  return setDoc(doc(db, 'rounds', roundId, 'board', uid), {
    note: note ?? null,
    strokes,
    images,
    updatedAt: serverTimestamp(),
  });
}

// ---------------------------------------------------------------- perguntas

export async function listQuestions(roundId) {
  const snap = await getDocs(query(collection(db, 'rounds', roundId, 'questions'), orderBy('createdAt')));
  return snap.docs.map(withId);
}

export function addQuestion(roundId, uid, text) {
  return addDoc(collection(db, 'rounds', roundId, 'questions'), {
    text,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
}

export function updateQuestion(roundId, questionId, text) {
  return updateDoc(doc(db, 'rounds', roundId, 'questions', questionId), {
    text,
    updatedAt: serverTimestamp(),
  });
}

export function deleteQuestion(roundId, questionId) {
  return deleteDoc(doc(db, 'rounds', roundId, 'questions', questionId));
}
