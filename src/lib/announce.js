// Monta a mensagem pronta pra colar no WhatsApp/Discord. Não envia nada sozinho.
import { fmtDateTime, fmtDay, fmtScore } from './util.js';
import { average } from './tally.js';

export function roundLink(roundId) {
  return `${location.origin}${location.pathname}#/rodada/${roundId}`;
}

export function buildAnnouncement({ round, games, ranking, ratings, nameOf }) {
  const link = roundLink(round.id);
  const title = `*Clube dos Jogos · Fase ${round.number}*`;

  if (round.status === 'sugerindo') {
    return [
      title,
      'Prateleira aberta pra sugestões! Cada um bota 1 jogo, com calma, quando puder.',
      games.length ? `Já tem ${games.length} na prateleira.` : 'Ainda tá vazia, seja o primeiro.',
      link,
    ].join('\n\n');
  }

  if (round.status === 'votando') {
    const list = games.map((g) => `• ${g.name} (de ${nameOf(g.suggestedBy)})`).join('\n');
    return [
      title,
      'Votação aberta! Marca TODOS os jogos que você toparia jogar (no seu não vale, calma).',
      list,
      'Vota quando puder, dá pra mudar até o admin fechar:',
      link,
    ].join('\n\n');
  }

  // jogando / encerrada: resultado + reunião
  const winner = round.winner ?? {};
  const votes = ranking?.find((r) => r.game.id === round.winnerGameId)?.count ?? 0;
  const lines = [title];
  let result = `O jogo da rodada é *${winner.name}*, sugestão de ${nameOf(winner.suggestedBy)}, com ${votes} ${votes === 1 ? 'voto' : 'votos'}.`;
  if (round.tiebreak?.candidates?.length) {
    const names = round.tiebreak.candidates.map((id) => games.find((g) => g.id === id)?.name).filter(Boolean);
    result += ` Deu empate e saiu no sorteio entre ${names.join(', ')}.`;
  }
  lines.push(result);

  if (round.status === 'jogando') {
    if (round.deadline) lines.push(`Prazo pra jogar: ${fmtDay(round.deadline)}.`);
    if (round.meetingDate) lines.push(`Reunião: ${fmtDateTime(round.meetingDate)}.`);
    else if (round.dateOptions?.length) lines.push('Marca no site as datas que você pode pra reunião.');
    if (round.callLink) lines.push(`Link da call: ${round.callLink}`);
  } else {
    const avg = average((ratings ?? []).map((r) => r.score));
    lines.push(avg === null ? 'Rodada encerrada. Bora dar as notas!' : `Rodada encerrada com nota média ${fmtScore(avg)}.`);
  }
  lines.push(link);
  return lines.join('\n\n');
}
