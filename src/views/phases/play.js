// Fases "jogando" e "encerrada" (rodada-jogando.html / rodada-encerrada.html): faixa de pano no
// lugar do h1, a mesa 3D, a ficha do jogo, o placar da votação e o balcão. Jogando: calendário,
// videogame com a capinha em cima, estatuetas de quem zerou, botão ZEREI e o quadro de jogando
// (diario.js). Encerrada: quadro de resenha (notas) + o de jogando guardado + perguntas.
// O tempo/recado do "zerei" dos mocks ficou fora: o zerei grava só a hora (ordem de chegada).
import {
  addDiarioPagina,
  addQuestion,
  desfazZerei,
  listBoard,
  listDiario,
  deleteQuestion,
  marcaZerei,
  saveBoard,
  saveDateVote,
  saveDiario,
  saveRating,
  updateQuestion,
  updateRoundDates,
  updateRoundFoto,
} from '../../api.js';
import { icon } from '../../lib/icons.js';
import { ENTRA_RAPIDO, NA_TELA, SAI, anim, calma, entrar } from '../../lib/motion.js';
import { confirmInline, esc, fmtDateTime, fmtPrice, fotoParaCapa, fotoParaQuadro, listJoin, safeImgData, toast, youtubeId, withBusy, DURATION_LABEL, MODE_LABEL } from '../../lib/util.js';
import { avatar, empty, memberName, stamp } from '../parts.js';
import { openReading } from '../caixinha.js';
import { balaoRecados, caseFront } from '../rack.js';
import { marcaVisto, naoVistos } from '../../lib/visto.js';
import { METAIS, coroaSvg, estatuetaSoloHtml, mesaSection, mountMesa } from '../mesa.js';
import { montaQuadro } from '../quadro.js';
import { abreDiario } from '../diario.js';

const QUESTION_MAX = 300;

// Nota em estrelas: 5 estrelas com meia; no banco continua 0–10 (1 ponto = meia estrela).
const fmtEstrelas = (score) => String(Math.round(score) / 2).replace('.', ',');
const rotEstrelas = (score) => `${fmtEstrelas(score)} de 5 estrelas`;
function estrelas(score, extra = '') {
  const linha = icon('star').repeat(5);
  return `<span class="estrelas ${extra}" style="--p:${Math.round(score) * 10}%" role="img" aria-label="${rotEstrelas(score)}"><span class="estrelas__vazia" aria-hidden="true">${linha}</span><span class="estrelas__cheia" aria-hidden="true">${linha}</span></span>`;
}
const COMMENT_MAX = 1000;
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// main = <main>; extra = { todo, announce, steps, balcao } montados pelo round.js
export function renderPlay(main, data, ctx, extra) {
  const { round, games, members, uid } = data;
  const playing = round.status === 'jogando';
  const game = { ...(round.winner ?? {}), ...(games.find((g) => g.id === round.winnerGameId) ?? {}) };
  const canEdit = ctx.session.isAdmin && data.isLatest && playing;
  const tied = (round.tiebreak?.candidates ?? []).map((id) => games.find((g) => g.id === id)?.name).filter(Boolean);
  const front = caseFront(game, stamp(tied.length ? 'Sorteado' : 'Vencedor'));
  const mini = miniCalendar(data);
  const pages = ratingPages(data);

  // quem zerou, em ordem de chegada (as estatuetas); some quem saiu do clube
  // (o recado vai junto pra virar balão em cima da estatueta)
  const zerados = (data.zerei ?? []).map((z) => {
    const m = members.find((x) => x.id === z.id);
    return m && { ...m, recado: String(z.recado ?? '').trim() };
  }).filter(Boolean);
  const minhaPos = zerados.findIndex((m) => m.id === uid);

  const alvos = [{ obj: 'caso-obj', label: `Abrir a caixinha de ${esc(game.name)}: manual do jogo` }];
  if (playing) {
    alvos.push({ obj: 'cal-obj', label: 'Abrir o calendário e marcar os dias que você pode na reunião' });
    alvos.push({ obj: 'botao-obj', label: minhaPos < 0 ? 'Zerei! Mandar a foto de prova e marcar que você zerou' : `Você já zerou (${minhaPos + 1}º lugar)`, popup: false });
    zerados.forEach((m, i) => alvos.push(alvoEst(m, i)));
  } else alvos.push({ obj: 'quadro-obj', label: 'Abrir o quadro de resenhas', balao: balaoRecados(naoVistos(round.id, 'resenha', uid, resenhaDocs(data)), members, NOVIDADE) });
  if (canEdit) alvos.push({ obj: 'retrato-obj', label: 'Pôr a foto do ganhador da votação no porta-retrato', popup: false });
  alvos.push({ obj: 'diario-obj', label: playing ? 'Abrir o quadro de jogando: notinhas, rabiscos e fotos' : 'Rever o quadro de jogando', balao: balaoRecados(naoVistos(round.id, 'diario', uid, data.diario ?? []), members, NOVIDADE) });

  main.innerHTML = `
    <div class="rodada--mesa">
      <div class="cabeca">
        <div class="varal">
          <span class="varal__corda varal__corda--e" aria-hidden="true"></span>
          <span class="varal__corda varal__corda--d" aria-hidden="true"></span>
          <span class="banner-sombra" aria-hidden="true"></span>
          <h1 class="banner"><span>${playing ? 'Jogo escolhido' : 'Encerrado'}</span></h1>
        </div>
        <p>Fase ${esc(round.number)} · ${playing ? 'agora é jogar' : 'hora da resenha'}${data.isLatest ? '' : ` · <a href="#/">ir pra rodada atual</a>`}</p>
      </div>
      ${extra.steps}
      ${extra.todo ? `<div class="falta papel"><p>${extra.todo}</p>${extra.cta ?? ''}</div>` : ''}
      ${mesaSection({ alvos, depois: zeradosHtml(zerados, uid, playing, members) })}
      ${infoSection(data, game, tied, ctx.session.isAdmin)}
      ${resultSection(data)}
    </div>
    ${playing ? '' : questionsSection(data, ctx)}
    ${canEdit ? adminForms(round) : ''}
    ${extra.balcao}`;

  const sec = main.querySelector('.mesa-sec');
  // abrir o quadro = viu tudo: grava e tira o balão; devolve o botão (vira o gatilho do modal)
  const visto = (botao, onde, docs) => {
    marcaVisto(round.id, onde, uid, docs);
    botao.querySelector('[data-balao]')?.remove();
    return botao;
  };
  // jogando: no lugar do bilhete fica o porta-retrato do ganhador da votação
  const notaMesa = playing ? '' : `${data.ratings.length} de ${members.filter((m) => m.approved).length} deram nota`;
  const textosBotao = (pos) => (pos < 0
    ? { placa: 'Zerei!', notaZ: 'aperta quando zerar' }
    : { placa: `Zerado · ${pos + 1}º`, notaZ: 'já foi, chora' });
  const mesa = mountMesa(sec, {
    fase: playing ? 'jogando' : 'encerrada', game, front, mini, pages, nota: notaMesa,
    fotoVencedor: safeImgData(round.fotoVencedor), nomeVencedor: memberName(members, game.suggestedBy), podeTrocarFoto: canEdit,
    zerados, vagas: members.filter((m) => m.approved).length, ...textosBotao(minhaPos), uid, diario: data.diario ?? [], board: data.board ?? [],
  });

  // capinha da mesa → caixinha (manual do jogo, só leitura)
  sec.querySelector('[data-obj="caso-obj"]').addEventListener('click', (e) => {
    const fonte = mesa.mesa.querySelector('#caso-obj .m-estojo > .f');
    openReading({ game, members, uid, fonte, gatilho: e.currentTarget, front, coroa: coroaSvg('coroa-caixinha') });
  });
  sec.querySelector('[data-obj="cal-obj"]')?.addEventListener('click', (e) => openCalendar(e.currentTarget, mesa, data, ctx));
  sec.querySelector('[data-obj="quadro-obj"]')?.addEventListener('click', (e) => openBoard(visto(e.currentTarget, 'resenha', resenhaDocs(data)), mesa, data, ctx, pages));
  sec.querySelector('[data-obj="diario-obj"]')?.addEventListener('click', (e) => abreDiario({
    gatilho: visto(e.currentTarget, 'diario', data.diario ?? []),
    objeto: mesa.mesa.querySelector('#diario-obj'),
    face: () => mesa.mesa.querySelector('#diario-obj .m-quadro > .f'),
    docs: data.diario ?? [],
    uid,
    nomeDe: (id) => memberName(members, id),
    soLeitura: !playing,
    salvar: (pagina, estado) => saveDiario(round.id, uid, pagina, estado),
    totalPaginas: round.diarioPaginas ?? 3,
    isAdmin: ctx.session.isAdmin,
    adicionaPagina: async (totalAtual) => {
      await addDiarioPagina(round.id, totalAtual);
      round.diarioPaginas = totalAtual + 1;
    },
    // mexeu: busca só o quadro de jogando e redesenha a mesa (sem recarregar a tela inteira)
    aoFechar: async (mexeu) => {
      if (!mexeu) return;
      try {
        data.diario = await listDiario(round.id);
        mesa.remonta({ diario: data.diario });
      } catch (err) {
        console.error(err);
        await ctx.refresh();
      }
    },
  }));

  // porta-retrato (só o admin): escolhe a foto do ganhador da votação, corta 3:4 e grava na rodada
  sec.querySelector('[data-obj="retrato-obj"]')?.addEventListener('click', () => {
    const arq = document.createElement('input');
    arq.type = 'file';
    arq.accept = 'image/*';
    arq.addEventListener('change', async () => {
      const file = arq.files?.[0];
      if (!file) return;
      try {
        const foto = await fotoParaCapa(file);
        await updateRoundFoto(round.id, foto);
        round.fotoVencedor = foto;
        mesa.remonta({ fotoVencedor: foto });
        toast('Foto no porta-retrato. Agora todo mundo vê.');
      } catch (err) {
        console.error(err);
        toast(err.message === 'nao-imagem' ? 'Isso não é imagem não, hein.' : 'Não deu pra pôr essa foto. Tenta outra.', 'erro');
      }
    });
    arq.click();
  });

  // estatueta → vem pra frente com a foto de prova; o admin anula dali
  sec.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-obj^="est-"]');
    if (alvo) openEstatueta(alvo, zerados, data, ctx);
  });

  // ZEREI: pede a foto de prova, grava, a estatueta cai na mesa; desfazer fica no texto embaixo da mesa
  let zerando = false;
  sec.querySelector('[data-obj="botao-obj"]')?.addEventListener('click', async (e) => {
    const botao = e.currentTarget;
    mesa.aperta();
    if (zerando) return;
    if (zerados.some((m) => m.id === uid)) {
      toast('Já foi, chora. Tua estatueta tá na mesa.');
      return;
    }
    zerando = true;
    const prova = await pedeProva(game.name);
    if (!prova) {
      zerando = false;
      return;
    }
    try {
      await marcaZerei(round.id, uid, prova);
    } catch (err) {
      console.error(err);
      toast('Não deu pra marcar. Tenta de novo.', 'erro');
      zerando = false;
      return;
    }
    const eu = { ...(members.find((m) => m.id === uid) ?? { id: uid, name: ctx.session.member?.name }), recado: prova.recado };
    zerados.push(eu);
    data.zerei = [...(data.zerei ?? []), { id: uid, ...prova }];
    const i = zerados.length - 1;
    mesa.remonta({ zerados, ...textosBotao(i) });
    sec.querySelector('.palco-wrap').insertAdjacentHTML('beforeend', mesaAlvo(alvoEst(eu, i)));
    mesa.alinha();
    sec.querySelector('.zerados').outerHTML = zeradosHtml(zerados, uid, playing, members);
    botao.querySelector('.sr-only').textContent = `Você já zerou (${i + 1}º lugar)`;
    await mesa.solta(i);
    toast(`Zerado! Você chegou em ${i + 1}º. Tua estatueta de ${METAIS[i % METAIS.length].nome} tá na mesa.`);
    zerando = false;
  });
  sec.addEventListener('click', async (e) => {
    const desfaz = e.target.closest('[data-desfaz-zerei]');
    if (!desfaz) return;
    if (!(await confirmInline(desfaz, 'Desfazer teu zerei? A estatueta sai da mesa e você perde o lugar na fila.', 'Desfazer'))) return;
    const ok = await withBusy(desfaz, () => desfazZerei(round.id, uid).then(() => true));
    if (ok) {
      toast('Zerei desfeito. Bora jogar.');
      await ctx.refresh();
    }
  });

  bindDates(main, data, ctx);
  if (!playing) bindQuestions(main, data, ctx);
  entrar(main.querySelectorAll('.falta, .info, .placar'), 120, 60);
}

// Texto das estatuetas (a mesa é decorativa pro leitor de tela): quem zerou, em ordem.
function zeradosHtml(zerados, uid, playing, members) {
  const total = members.filter((m) => m.approved).length;
  const eu = zerados.some((m) => m.id === uid);
  const lista = zerados.length
    ? `<ol>${zerados.map((m, i) => `<li><b>${i + 1}º</b> ${m.id === uid ? 'você' : esc(m.name ?? 'Ex-sócio')}</li>`).join('')}</ol>`
    : (playing ? 'ninguém ainda. A estatueta de ouro tá esperando.' : 'ninguém.');
  return `<div class="zerados actions"><p>${zerados.length ? `${zerados.length} de ${total} zeraram: ` : 'Quem zerou: '}${lista}</p>
    ${playing && eu ? '<button class="btn btn--ghost btn--sm" type="button" data-desfaz-zerei>Desfazer meu zerei</button>' : ''}</div>`;
}

// ------------------------------------------------------------ ficha do jogo + placar da votação

function infoSection({ round, members, ranking, me }, game, tied, isAdmin) {
  const votes = ranking.find((r) => r.game.id === round.winnerGameId)?.count ?? 0;
  const mine = new Set(me?.platforms ?? []);
  const fatos = [
    ['Ano', game.year], ['Gênero', game.genre], ['Duração', DURATION_LABEL[game.duration]], ['Modo', MODE_LABEL[game.mode]],
    ['Preço', Number.isInteger(game.price) ? fmtPrice(game.price) : ''],
    ['Reunião', round.meetingDate ? fmtDateTime(round.meetingDate) : 'data a decidir'],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  const by = memberName(members, game.suggestedBy);
  return `
    <section class="info" aria-labelledby="jogo-nome">
      <div class="info__topo">
        <h2 class="info__nome" id="jogo-nome">${esc(game.name)}</h2>
        <p class="info__por">Sugerido por <b>${esc(by)}</b> · ganhou com ${votes} ${votes === 1 ? 'voto' : 'votos'}</p>
        ${tied.length ? `<p class="info__por">Deu empate e saiu no sorteio entre ${esc(listJoin(tied))}.</p>` : ''}
      </div>
      <ul class="fatos">${fatos.map(([k, v]) => `<li class="fato"><span class="fato__rot">${k}</span><span class="fato__val">${esc(v)}</span></li>`).join('')}</ul>
      ${game.platforms?.length ? `
        <div class="info__bloco">
          <h3 class="painel__titulo">Onde jogar</h3>
          <ul class="plats">${game.platforms.map((p) => mine.has(p)
            ? `<li class="sua">${icon('check')}${esc(p)}<span class="sr-only"> (você tem)</span></li>`
            : `<li>${esc(p)}</li>`).join('')}</ul>
        </div>` : ''}
      ${game.pitch ? `
        <div class="info__bloco">
          <h3 class="painel__titulo">Por que jogar</h3>
          <figure class="pitch"><blockquote>${esc(game.pitch)}</blockquote><figcaption>${esc(by)}, quando sugeriu</figcaption></figure>
        </div>` : ''}
      ${youtubeId(game.trailer) ? `<div class="info__bloco"><figure class="trailer">
        <div class="trailer__tela"><iframe src="https://www.youtube-nocookie.com/embed/${youtubeId(game.trailer)}?rel=0" title="Trailer de ${esc(game.name)}"
          loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <figcaption class="trailer__legenda">Trailer</figcaption></figure></div>` : ''}
    </section>`;
}

function resultSection({ round, ranking, members }) {
  const max = Math.max(1, ...ranking.map((r) => r.count));
  return `
    <section class="placar" aria-labelledby="result-title">
      <h2 class="painel__titulo" id="result-title">Como foi a votação</h2>
      <div class="tally">
        ${ranking.map((r) => `
          <div class="tally__row ${r.game.id === round.winnerGameId ? 'is-top' : ''}">
            <span><strong>${esc(r.game.name)}</strong> <span class="small muted">de ${esc(memberName(members, r.game.suggestedBy))}</span></span>
            <span class="tally__num">${r.count}</span>
            <span class="tally__bar" aria-hidden="true"><i style="width:${(r.count / max) * 100}%"></i></span>
            ${r.voters.length ? `<span class="small muted tally__quem">${r.voters.map((id) => esc(memberName(members, id))).join(', ')}</span>` : ''}
          </div>`).join('')}
      </div>
    </section>`;
}

// ------------------------------------------------------------ calendário (enquete de datas)

const dayOf = (iso) => iso.slice(0, 10);

// Miniatura da folha na mesa: mês da primeira data oferecida (ou o mês atual).
function miniCalendar({ round, dateVotes, uid }) {
  const options = round.dateOptions ?? [];
  const mine = new Set(dateVotes.find((d) => d.id === uid)?.dates ?? []);
  const ref = options.length ? new Date(`${dayOf(options[0])}T12:00`) : new Date();
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const inMonth = (iso) => {
    const d = new Date(`${dayOf(iso)}T12:00`);
    return d.getFullYear() === y && d.getMonth() === m;
  };
  const of = new Set(options.filter(inMonth).map((iso) => Number(iso.slice(8, 10))));
  const sel = new Set([...mine].filter(inMonth).map((iso) => Number(iso.slice(8, 10))));
  const n = new Set([...mine].map(dayOf)).size;
  return {
    mes: MESES[m], ano: y, ini: new Date(y, m, 1).getDay(), fim: new Date(y, m + 1, 0).getDate(), of, sel,
    nota: !options.length ? 'sem datas ainda' : n ? `${n} dia${n > 1 ? 's' : ''} seu${n > 1 ? 's' : ''}` : 'marca teus dias',
  };
}

const CIRCULO = '<svg class="dia__circulo" viewBox="0 0 60 50" preserveAspectRatio="none" aria-hidden="true"><path d="M8 26C6 12 20 5 33 5c14 0 23 8 22 19-1 13-13 21-27 20C14 43 5 35 8 22c1-4 4-7 7-9" fill="none" stroke="#b3213f" stroke-width="3" stroke-linecap="round"/></svg>';

// A folha do calendário: uma grade por mês com as datas oferecidas. Se algum dia tiver mais de
// um horário, cada horário vira um botão próprio embaixo da grade (o voto é por data+hora).
function folhaHtml({ round, dateVotes, uid }, picked) {
  const options = [...(round.dateOptions ?? [])].sort();
  const votersOf = (iso) => dateVotes.filter((d) => d.dates.includes(iso)).length;
  const byDay = new Map();
  options.forEach((iso) => byDay.set(dayOf(iso), [...(byDay.get(dayOf(iso)) ?? []), iso]));
  const months = [...new Set(options.map((iso) => iso.slice(0, 7)))];
  const multi = [...byDay.values()].some((l) => l.length > 1);

  const grids = months.map((ym) => {
    const [y, m] = ym.split('-').map(Number);
    const ini = new Date(y, m - 1, 1).getDay();
    const fim = new Date(y, m, 0).getDate();
    let cells = '<span class="dia"></span>'.repeat(ini);
    for (let d = 1; d <= fim; d++) {
      const key = `${ym}-${String(d).padStart(2, '0')}`;
      const list = byDay.get(key);
      if (!list) {
        cells += `<span class="dia" aria-hidden="true">${d}</span>`;
        continue;
      }
      const confirmed = list.includes(round.meetingDate);
      if (multi && list.length > 1) {
        cells += `<span class="dia dia--varios" aria-hidden="true">${d}</span>`;
        continue;
      }
      const iso = list[0];
      const on = picked.has(iso);
      cells += `<button class="dia dia--op" type="button" data-dia="${esc(iso)}" aria-pressed="${on}" ${round.status === 'jogando' ? '' : 'disabled'}>
        <span>${d}</span><span class="dia__qtd">${votersOf(iso)}</span>${CIRCULO}
        <span class="sr-only">${esc(fmtDateTime(iso))}, ${votersOf(iso)} ${votersOf(iso) === 1 ? 'pode' : 'podem'}${confirmed ? ', reunião marcada' : ''}</span></button>`;
    }
    return `<p class="folha__mesano">${MESES[m - 1]} ${y}</p>
      <div class="semana" aria-hidden="true"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div>
      <div class="grade" role="group" aria-label="Dias oferecidos em ${MESES[m - 1]}">${cells}</div>`;
  }).join('');

  const horarios = multi
    ? `<div class="folha__horarios" role="group" aria-label="Dias com mais de um horário">${[...byDay.values()].filter((l) => l.length > 1).flat().map((iso) => `
        <button class="horario" type="button" data-dia="${esc(iso)}" aria-pressed="${picked.has(iso)}" ${round.status === 'jogando' ? '' : 'disabled'}>
          ${esc(fmtDateTime(iso))} <span class="dia__qtd">${votersOf(iso)}</span></button>`).join('')}</div>`
    : '';
  const titulo = months.length ? MESES[Number(months[0].slice(5, 7)) - 1] : 'Calendário';
  return `
    <div class="folha__aros" aria-hidden="true"></div>
    <div class="folha__topo"><h2 class="folha__mes" tabindex="-1" data-titulo>${titulo}</h2><span class="folha__ano">${months[0]?.slice(0, 4) ?? ''}</span></div>
    <div class="folha__corpo">
      ${options.length
        ? `<p class="folha__dica">Os dias tracejados são os que o admin ofereceu. Circula os que você pode.</p>${grids}${horarios}
           <p class="folha__legenda">O número embaixo é quanta gente já topou.${round.meetingDate ? ` Reunião marcada: <strong>${esc(fmtDateTime(round.meetingDate))}</strong>.` : ' O admin marca a que juntar mais gente.'}</p>`
        : '<p class="folha__dica">O admin ainda não ofereceu datas pra reunião. Volta aqui depois.</p>'}
    </div>
    <div class="acoes">
      ${options.length && round.status === 'jogando' ? '<button class="btn btn--primary" type="button" data-salvar>Salvar meus dias</button>' : ''}
      <button class="btn" type="button" data-fechar>Fechar</button>
    </div>`;
}

async function openCalendar(gatilho, mesa, data, ctx) {
  const { round, dateVotes, uid } = data;
  const picked = new Set(dateVotes.find((d) => d.id === uid)?.dates ?? []);
  const modal = document.createElement('div');
  modal.className = 'modal modal--folha';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `<div class="modal__fundo" data-fechar></div><div class="folha papel">${folhaHtml(data, picked)}</div>`;
  modal.querySelector('[data-titulo]').id = 'cal-titulo';
  modal.setAttribute('aria-labelledby', 'cal-titulo');
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const folha = modal.querySelector('.folha');
  const calObj = mesa.mesa.querySelector('#cal-obj');
  const mini = () => mesa.mesa.querySelector('[data-cal-frente]');
  const deMini = () => {
    const a = mini().getBoundingClientRect();
    const b = folha.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };
  document.getElementById('app').inert = true;
  document.documentElement.classList.add('trava');
  const longe = deMini();
  calObj.style.visibility = 'hidden';
  anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
  await anim(folha, [
    { transform: `${longe} rotateX(0deg)`, opacity: 0.6 },
    { opacity: 1, offset: 0.2 },
    { transform: 'translateY(-26px) scale(1.04) rotateX(-12deg)', offset: 0.66 },
    { transform: 'none', opacity: 1 },
  ], { duration: 580, easing: NA_TELA });
  const dias = [...folha.querySelectorAll('.dia--op')];
  dias.forEach((d, k) => anim(d, [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'none' }], { duration: 200, delay: k * 40, easing: SAI }));
  modal.querySelector('#cal-titulo').focus();

  let fechando = false;
  const fecha = async (salvou = false) => {
    if (fechando) return;
    fechando = true;
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
    await anim(folha, [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(-14px) scale(1.02) rotateX(-6deg)', offset: 0.25 },
      { transform: `${deMini()} rotateX(0deg)`, opacity: 1, offset: 0.9 },
      { transform: `${deMini()} rotateX(0deg)`, opacity: 0 },
    ], { duration: 440, easing: NA_TELA });
    calObj.style.visibility = '';
    modal.remove();
    document.getElementById('app').inert = false;
    document.documentElement.classList.remove('trava');
    gatilho.focus({ preventScroll: true });
    if (salvou) await ctx.refresh();
  };

  modal.addEventListener('click', async (e) => {
    const dia = e.target.closest('[data-dia]');
    if (dia && !dia.disabled) {
      const iso = dia.dataset.dia;
      if (picked.has(iso)) picked.delete(iso);
      else picked.add(iso);
      dia.setAttribute('aria-pressed', String(picked.has(iso)));
      return;
    }
    if (e.target.closest('[data-salvar]')) {
      const dates = [...picked].filter((d) => (round.dateOptions ?? []).includes(d)); // as rules só aceitam datas propostas
      const ok = await withBusy(e.target.closest('[data-salvar]'), () => saveDateVote(round.id, uid, dates).then(() => true));
      if (ok) {
        toast(dates.length ? 'Anotado. O admin marca a data que juntar mais gente.' : 'Sem dias marcados. Avisa quando souber.');
        fecha(true);
      }
      return;
    }
    if (e.target.closest('[data-fechar]')) fecha();
  });
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
}

// ------------------------------------------------------------ quadro de resenhas (notas)

const ROTQ = ['-2.4deg', '1.8deg', '-1deg', '2.6deg', '-1.8deg', '0.8deg', '-2.8deg', '1.2deg'];
const TACHAS = ['var(--amber)', 'var(--teal)', 'var(--pink)', 'var(--paper)'];

// Cada nota vira uma página de caderno pregada no quadro (resenha = comentário da nota).
// Balão de novidade nos quadros da mesa (mesmo aviso dos recados da prateleira): conta doc dos
// outros salvo depois da última vez que a pessoa abriu aquele quadro neste aparelho.
const NOVIDADE = ['novidade no quadro', 'novidades no quadro'];
const resenhaDocs = (data) => [...(data.board ?? []), ...data.ratings];

function ratingPages({ ratings, members, uid }) {
  return [...ratings].sort((a, b) => b.score - a.score).map((r) => {
    const m = members.find((x) => x.id === r.id) ?? { name: 'Ex-sócio' };
    return { ...r, member: m, photo: m.photoURL, initial: (m.name ?? '?').trim().charAt(0).toUpperCase(), voce: r.id === uid };
  });
}

function pageHtml(p, i) {
  const comment = !p.comment
    ? '<p class="pagina__txt pagina__txt--vazia">Deu nota e não falou nada. Clássico.</p>'
    : p.spoiler
      ? `<details class="spoiler"><summary>${icon('eye')} <span class="spoiler__closed">Tem spoiler. Mostrar</span><span class="spoiler__open">Esconder spoiler</span></summary><p class="pagina__txt">${esc(p.comment)}</p></details>`
      : `<p class="pagina__txt">${esc(p.comment)}</p>`;
  return `<li class="pagina" style="--r:${ROTQ[i % ROTQ.length]};--tacha:${TACHAS[i % TACHAS.length]}">
    <span class="tacha" aria-hidden="true"></span>
    <div class="pagina__topo">${avatar(p.member, 'sm')}<p class="pagina__quem">${p.voce ? 'Você' : esc(p.member.name)}</p>
      ${estrelas(p.score, 'estrelas--pagina')}</div>
    ${comment}
  </li>`;
}

function formHtml(mine, score) {
  return `
        <li class="pagina pagina--nova papel">
          <form data-rating-form novalidate>
            <label class="pagina__rotulo" for="score">Sua nota</label>
            <div class="score-picker score-picker--estrelas">
              <div class="estrelas-in">
                ${estrelas(score, 'estrelas--grande')}
                <input type="range" id="score" name="score" min="0" max="10" step="1" value="${Math.round(score)}" aria-valuetext="${rotEstrelas(score)}" aria-describedby="score-out">
              </div>
              <output id="score-out" class="score-out" for="score">${fmtEstrelas(score)}</output>
            </div>
            <label class="sr-only" for="rating-comment">Sua resenha</label>
            <textarea class="campo-papel" id="rating-comment" name="comment" maxlength="${COMMENT_MAX}" placeholder="Opcional. O que achou?">${esc(mine?.comment ?? '')}</textarea>
            <label class="check check--papel"><input type="checkbox" name="spoiler" ${mine?.spoiler ? 'checked' : ''}> Tem spoiler (fica escondido até clicar)</label>
            <button class="btn btn--primary" type="submit">${mine ? 'Atualizar minha página' : 'Pregar no quadro'}</button>
          </form>
        </li>`;
}

function bindRating(root, data, ctx, after) {
  const form = root.querySelector('[data-rating-form]');
  const range = form.elements.score;
  const out = form.querySelector('#score-out');
  const vis = form.querySelector('.estrelas--grande');
  const mostra = () => {
    const v = Number(range.value);
    out.textContent = fmtEstrelas(v);
    vis.style.setProperty('--p', `${v * 10}%`);
    range.setAttribute('aria-valuetext', rotEstrelas(v));
  };
  range.addEventListener('input', mostra);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const score = Number(range.value);
    const comment = form.elements.comment.value.trim();
    const spoiler = form.elements.spoiler.checked;
    const ok = await withBusy(event.submitter, () => saveRating(data.round.id, data.uid, { score, comment, spoiler }).then(() => true));
    if (ok) {
      toast(`Nota de ${rotEstrelas(score)} pregada no quadro.`);
      // after devolve true quando já resolveu a tela (quadro livre fica aberto)
      if (after && (await after({ score, comment, spoiler }))) return;
      await ctx.refresh();
    }
  });
}

// Encerrada: o quadro da mesa vem pra frente (voo entre a projeção 3D e o quadro aberto).
async function openBoard(gatilho, mesa, data, ctx, pages) {
  const modal = document.createElement('div');
  modal.className = 'modal modal--quadro';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'quadro-titulo');
  const mine = data.ratings.find((r) => r.id === data.uid);
  modal.innerHTML = `<div class="modal__fundo"></div><div class="quadro-palco quadro-palco--livre"><div class="ql"></div>
    <ul class="ql-form">${formHtml(mine, mine?.score ?? 5)}</ul>
    <div class="modal__acoes"><button class="btn" type="button" data-fechar>Fechar o quadro</button></div></div>`;
  let board = [];
  let sujo = false; // mexeu no quadro: a mesa redesenha a miniatura ao fechar
  let notaNova = false; // salvou nota: a mesa ganha a página nova e o bilhete muda
  try { board = await listBoard(data.round.id); } catch (err) { console.error(err); }
  const livre = montaQuadro(modal.querySelector('.ql'), {
    uid: data.uid, pages, board, pagina: pageHtml,
    // mexeu no quadro → a mesa redesenha a miniatura ao fechar
    salvar: (estado) => {
      sujo = true;
      return saveBoard(data.round.id, data.uid, estado);
    },
  });
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const quadro = modal.querySelector('.quadro');
  const quadroObj = mesa.mesa.querySelector('#quadro-obj');
  const face = () => mesa.mesa.querySelector('#quadro-obj .m-quadro > .f');
  const deQuadro = () => {
    const a = face().getBoundingClientRect();
    const b = quadro.getBoundingClientRect();
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  };
  document.getElementById('app').inert = true;
  document.documentElement.classList.add('trava');
  const longe = deQuadro();
  quadroObj.style.visibility = 'hidden';
  anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
  const pags = [...modal.querySelectorAll('.ql-nota, .ql-form .pagina')];
  pags.forEach((p) => (p.style.opacity = calma.matches ? '' : '0'));
  await anim(quadro, [{ transform: longe }, { transform: 'none' }], { duration: 600, easing: NA_TELA });
  entrar(pags, 0, 50);
  entrar([modal.querySelector('.modal__acoes')], 120);
  modal.querySelector('#quadro-titulo').focus({ preventScroll: true });

  let fechando = false;
  const fecha = async () => {
    if (fechando) return;
    fechando = true;
    livre.fecha();
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: ENTRA_RAPIDO });
    await anim(quadro, [{ transform: 'none' }, { transform: deQuadro() }], { duration: 460, easing: NA_TELA });
    quadroObj.style.visibility = '';
    modal.remove();
    document.getElementById('app').inert = false;
    document.documentElement.classList.remove('trava');
    if (sujo || notaNova) {
      try {
        if (sujo) data.board = await listBoard(data.round.id);
        const aprovados = data.members.filter((m) => m.approved).length;
        mesa.remonta({ board: data.board, pages: ratingPages(data), nota: `${data.ratings.length} de ${aprovados} deram nota` });
        // o bilhete "falta sua resenha" vira o de agradecimento (mesmo texto do todo() do round.js)
        if (notaNova) {
          const falta = document.querySelector('.rodada--mesa .falta');
          if (falta) falta.innerHTML = '<p>Rodada encerrada. Valeu! Sua resenha tá no quadro.</p>';
        }
      } catch (err) {
        console.error(err);
        return ctx.refresh();
      }
    }
    // remonta recria a mesa, mas o gatilho é o botão .alvo, que fica
    if (gatilho.isConnected) gatilho.focus({ preventScroll: true });
  };
  // salvar a nota não fecha o quadro: troca a página ali mesmo; a tela de trás atualiza ao fechar
  bindRating(modal, data, ctx, async (nota) => {
    notaNova = true;
    const resto = data.ratings.filter((r) => r.id !== data.uid);
    data.ratings = [...resto, { id: data.uid, ...nota }];
    livre.trocaNotas(ratingPages(data));
    modal.querySelector('[data-rating-form] [type="submit"]').textContent = 'Atualizar minha página';
    return true;
  });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-fechar]') || e.target === fundo || e.target === modal) fecha();
  });
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
}

// ------------------------------------------------------------ perguntas

function questionsSection({ questions, members, uid }, ctx) {
  const isAdmin = ctx.session.isAdmin;
  return `
    <section class="perguntas" aria-labelledby="questions-title">
      <h2 id="questions-title">Perguntas pra reunião</h2>
      <p class="muted">Qualquer sócio pode deixar uma pergunta pra puxar a conversa.</p>
      ${questions.length ? `<ol class="list questions">${questions.map((q) => `
        <li data-question="${esc(q.id)}">
          <div class="question__body">
            <p class="question__text">${esc(q.text)}</p>
            <p class="small muted">${esc(memberName(members, q.createdBy))}${q.updatedAt ? ' · editada' : ''}</p>
          </div>
          <span class="actions">
            ${q.createdBy === uid ? `<button class="btn btn--ghost btn--icon" data-edit-q>${icon('pencil')}<span class="sr-only">Editar pergunta</span></button>` : ''}
            ${q.createdBy === uid || isAdmin ? `<button class="btn btn--ghost btn--icon" data-delete-q>${icon('trash')}<span class="sr-only">Apagar pergunta</span></button>` : ''}
          </span>
        </li>`).join('')}</ol>` : empty('Nenhuma pergunta ainda', 'Qual foi a parte que mais te pegou? Começa por aí.')}
      <form class="form perguntas__form" id="question-form">
        <label class="field"><span>Nova pergunta</span>
          <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required placeholder="Ex.: o final fez sentido pra você?"></textarea>
        </label>
        <div class="actions"><button class="btn btn--primary" type="submit">Adicionar pergunta</button></div>
      </form>
    </section>`;
}

function bindQuestions(container, data, ctx) {
  const roundId = data.round.id;
  container.querySelector('#question-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = event.currentTarget.elements.text.value.trim();
    if (!text) return;
    const ok = await withBusy(event.submitter, () => addQuestion(roundId, data.uid, text).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.querySelector('.perguntas').addEventListener('click', async (event) => {
    const item = event.target.closest('[data-question]');
    if (!item) return;
    const id = item.dataset.question;
    const question = data.questions.find((q) => q.id === id);

    const deleteBtn = event.target.closest('[data-delete-q]');
    if (deleteBtn) {
      if (!(await confirmInline(deleteBtn, 'Apagar essa pergunta?', 'Apagar'))) return;
      const ok = await withBusy(null, () => deleteQuestion(roundId, id).then(() => true));
      if (ok) await ctx.refresh();
    }

    if (event.target.closest('[data-edit-q]')) {
      // Edição no lugar: troca o texto por um campo.
      item.querySelector('.question__body').innerHTML = `
        <form class="form" data-edit-form>
          <label class="field"><span class="sr-only">Editar pergunta</span>
            <textarea class="input" name="text" maxlength="${QUESTION_MAX}" required>${esc(question.text)}</textarea>
          </label>
          <div class="actions">
            <button class="btn btn--primary btn--sm" type="submit">Salvar</button>
            <button class="btn btn--sm" type="button" data-cancel>Cancelar</button>
          </div>
        </form>`;
      item.querySelector('textarea').focus();
      item.querySelector('[data-cancel]').addEventListener('click', () => ctx.refresh());
      item.querySelector('[data-edit-form]').addEventListener('submit', async (submitEvent) => {
        submitEvent.preventDefault();
        const text = submitEvent.currentTarget.elements.text.value.trim();
        if (!text) return;
        const ok = await withBusy(submitEvent.submitter, () => updateQuestion(roundId, id, text).then(() => true));
        if (ok) await ctx.refresh();
      });
    }
  });
}

// ------------------------------------------------------------ admin: prazo, call e datas

function adminForms(round) {
  const options = round.dateOptions ?? [];
  return `
    <section class="balcao balcao--largo" aria-labelledby="admin-info-title">
      <h2 class="panel__title" id="admin-info-title">Datas da reunião</h2>
      ${options.length ? `<ul class="list balcao__datas">${options.map((date) => `
        <li class="${round.meetingDate === date ? 'is-confirmed' : ''}">
          <span>${esc(fmtDateTime(date))}${round.meetingDate === date ? ' <span class="pill">Marcada</span>' : ''}</span>
          <span class="actions">
            ${round.meetingDate === date ? '' : `<button class="btn btn--sm" type="button" data-confirm-date="${esc(date)}">Marcar esta</button>`}
            <button class="btn btn--ghost btn--icon" type="button" data-remove-date="${esc(date)}">${icon('trash')}<span class="sr-only">Remover opção ${esc(fmtDateTime(date))}</span></button>
          </span>
        </li>`).join('')}</ul>` : '<p class="muted">Nenhuma data oferecida ainda.</p>'}
      <form class="form" id="add-date">
        <label class="field"><span>Oferecer nova data</span>
          <input class="input" type="datetime-local" name="date" required>
        </label>
        <div class="actions"><button class="btn btn--primary" type="submit">Adicionar data</button></div>
      </form>
    </section>`;
}

function bindDates(container, data, ctx) {
  const { round } = data;
  const options = round.dateOptions ?? [];
  container.querySelector('#add-date')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const date = event.currentTarget.elements.date.value; // "2026-12-05T20:00"
    if (!date) return;
    if (options.includes(date)) return toast('Essa data já tá na lista.', 'error');
    if (options.length >= 20) return toast('Já tem 20 datas. Remove alguma antes.', 'error');
    const next = [...options, date].sort();
    const ok = await withBusy(event.submitter, () => updateRoundDates(round.id, next, round.meetingDate).then(() => true));
    if (ok) await ctx.refresh();
  });

  container.querySelector('.balcao__datas')?.addEventListener('click', async (event) => {
    const confirmBtn = event.target.closest('[data-confirm-date]');
    const removeBtn = event.target.closest('[data-remove-date]');
    if (confirmBtn) {
      const date = confirmBtn.dataset.confirmDate;
      const ok = await withBusy(confirmBtn, () => updateRoundDates(round.id, options, date).then(() => true));
      if (ok) {
        toast(`Reunião marcada: ${fmtDateTime(date)}.`);
        await ctx.refresh();
      }
    }
    if (removeBtn) {
      const date = removeBtn.dataset.removeDate;
      if (!(await confirmInline(removeBtn, `Remover ${fmtDateTime(date)} da enquete?`, 'Remover data'))) return;
      const meeting = round.meetingDate === date ? null : round.meetingDate;
      const ok = await withBusy(removeBtn, () => updateRoundDates(round.id, options.filter((d) => d !== date), meeting).then(() => true));
      if (ok) await ctx.refresh();
    }
  });
}


// ------------------------------------------------------------ zerei: prova e estatueta em evidência

const RECADO_MAX = 140;
const alvoEst = (m, i) => ({ obj: `est-${i}`, label: `Ver a estatueta de ${esc(m.name ?? 'Ex-sócio')} (${i + 1}º) e a foto do zerado` });
const mesaAlvo = (a) => `<button class="alvo" type="button" data-obj="${a.obj}" aria-haspopup="dialog"><span class="sr-only">${a.label}</span></button>`;

// Modal do zerei: fundo + conteúdo; origem (opcional) = de onde o conteúdo voa.
// Devolve { modal, fecha }; fecha() some com o modal, devolve o foco e avisa aoFechar.
function modalZerei({ html, rotulo, gatilho, origem, aoFechar }) {
  const modal = document.createElement('div');
  modal.className = 'modal modal--est';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', rotulo);
  modal.innerHTML = `<div class="modal__fundo" data-fechar></div>${html}`;
  document.body.append(modal);
  const fundo = modal.querySelector('.modal__fundo');
  const corpo = fundo.nextElementSibling;
  const longe = () => {
    if (!origem?.isConnected) return 'translateY(24px) scale(0.92)';
    const a = origem.getBoundingClientRect();
    const b = corpo.getBoundingClientRect();
    const k = Math.min(1, a.height / b.height);
    return `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${k})`;
  };
  document.getElementById('app').inert = true;
  document.documentElement.classList.add('trava');
  anim(fundo, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: SAI });
  anim(corpo, [{ transform: longe(), opacity: 0 }, { opacity: 1, offset: 0.25 }, { transform: 'none', opacity: 1 }], { duration: 520, easing: NA_TELA });
  modal.querySelector(`#${rotulo}`).focus({ preventScroll: true });

  let fechando = false;
  const fecha = async () => {
    if (fechando) return;
    fechando = true;
    anim(fundo, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: ENTRA_RAPIDO });
    await anim(corpo, [{ transform: 'none', opacity: 1 }, { transform: longe(), opacity: 0 }], { duration: 360, easing: ENTRA_RAPIDO });
    modal.remove();
    document.getElementById('app').inert = false;
    document.documentElement.classList.remove('trava');
    if (gatilho?.isConnected) gatilho.focus({ preventScroll: true });
    aoFechar?.();
  };
  modal.addEventListener('click', (e) => e.target.closest('[data-fechar]') && fecha());
  modal.addEventListener('keydown', (e) => e.key === 'Escape' && fecha());
  return { modal, fecha };
}

// Antes de zerar: a foto do jogo zerado (créditos, troféu, tela final) + recado opcional.
// Resolve com { foto, recado } ou null.
function pedeProva(nomeJogo) {
  return new Promise((resolve) => {
    let foto = '';
    let confirmou = false;
    const { modal, fecha } = modalZerei({
      rotulo: 'prova-titulo',
      gatilho: document.querySelector('[data-obj="botao-obj"]'),
      aoFechar: () => resolve(confirmou ? { foto, recado: modal.querySelector('[data-recado]').value.trim() } : null),
      html: `<div class="prova-form">
        <h2 class="modal__titulo" id="prova-titulo" tabindex="-1">Prova ou não aconteceu</h2>
        <p class="modal__dica">Manda uma foto ou print de ${esc(nomeJogo)} zerado: créditos, troféu, tela final. Sem foto, sem estatueta.</p>
        <label class="btn"><input class="sr-only" type="file" accept="image/*" data-arq>Escolher foto</label>
        <figure class="prova" hidden><img alt="Prévia da foto de prova"></figure>
        <label class="field prova-form__recado"><span>Recado (opcional)</span>
          <textarea class="input" data-recado maxlength="${RECADO_MAX}" placeholder="Ex.: aquele final me quebrou"></textarea>
        </label>
        <p class="modal__erro" aria-live="polite" data-erro></p>
        <div class="modal__acoes">
          <button class="btn btn--primary" type="button" data-ok disabled>Zerei!</button>
          <button class="btn" type="button" data-fechar>Cancelar</button>
        </div>
      </div>`,
    });
    const ok = modal.querySelector('[data-ok]');
    const erro = modal.querySelector('[data-erro]');
    const prova = modal.querySelector('.prova');
    modal.querySelector('[data-arq]').addEventListener('change', async (e) => {
      const arq = e.target.files?.[0];
      if (!arq) return;
      erro.textContent = '';
      try {
        foto = await fotoParaQuadro(arq, 720);
      } catch (err) {
        console.error(err);
        foto = '';
        erro.textContent = err.message === 'nao-imagem' ? 'Isso não é imagem não, hein.' : 'Não deu pra usar essa foto. Tenta outra.';
      }
      prova.hidden = !foto;
      if (foto) prova.querySelector('img').src = foto;
      ok.disabled = !foto;
    });
    ok.addEventListener('click', () => {
      if (!foto) return;
      confirmou = true;
      fecha();
    });
  });
}

// Clique na estatueta: ela vem pra frente com a foto de prova. Admin anula o zerei dali.
function openEstatueta(gatilho, zerados, data, ctx) {
  const i = Number(gatilho.dataset.obj.slice(4));
  const m = zerados[i];
  if (!m) return;
  const doc = data.zerei?.find((z) => z.id === m.id);
  const foto = safeImgData(doc?.foto);
  const recado = String(doc?.recado ?? '').trim();
  const voce = m.id === data.uid;
  const podeAnular = ctx.session.isAdmin && data.isLatest && data.round.status === 'jogando';
  const metal = METAIS[i % METAIS.length];
  const nome = m.name ?? 'Ex-sócio';
  const { modal, fecha } = modalZerei({
    rotulo: 'est-titulo',
    gatilho,
    origem: gatilho,
    html: `<div class="est-cartao" style="--m:${metal.m}">
      ${estatuetaSoloHtml(m, i)}
      <div class="est-info">
        <h2 class="est-info__pos" id="est-titulo" tabindex="-1">${i + 1}º · ${metal.nome}</h2>
        <p class="est-info__quem">${voce ? 'Você' : esc(nome)} zerou ${esc(data.round.winner?.name ?? 'o jogo')}.</p>
        ${foto
          ? `<figure class="prova"><img src="${esc(foto)}" alt="Foto de prova do zerado de ${esc(nome)}"></figure>`
          : '<p class="prova prova--vazia">Zerou antes da regra da foto. Confia.</p>'}
        ${recado ? `<blockquote class="est-recado"><p>${esc(recado)}</p></blockquote>` : ''}
        <div class="modal__acoes">
          ${podeAnular ? '<button class="btn btn--danger" type="button" data-anular>Anular zerei</button>' : ''}
          <button class="btn" type="button" data-fechar>Fechar</button>
        </div>
      </div>
    </div>`,
  });
  modal.querySelector('[data-anular]')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const quem = voce ? 'teu zerei' : `o zerei de ${nome}`;
    if (!(await confirmInline(btn, `Anular ${quem}? A estatueta sai da mesa e a fila anda.`, 'Anular'))) return;
    const ok = await withBusy(btn, () => desfazZerei(data.round.id, m.id).then(() => true));
    if (!ok) return;
    toast(voce ? 'Zerei anulado.' : `Zerei de ${nome} anulado. Mentiroso pego.`);
    await fecha();
    await ctx.refresh();
  });
}
