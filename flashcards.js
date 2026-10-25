/* Ciclo v7.3 — conteúdo, direções, respostas e sessões têm identidades próprias.
   Sem rede em execução. FSRS-6: ts-fsrs 5.2.3, MIT, distribuído em vendor/.
   As únicas escritas deste recurso passam por FlashcardCommands. */
'use strict';
const FLASHCARD_STORES = ['flashcardTemplates','flashcardSets','flashcardNotes','flashcards','flashcardResponses','flashcardRuns','guidedReviews'];
const FLASHCARD_TYPES = [
  {id:'basic', name:'Pergunta e resposta', use:'Recordar uma ideia com uma pergunta específica.', example:'Qual sinal encerra uma frase declarativa? → Ponto-final.', front:'Pergunta', back:'Resposta', tip:'Prefira uma ideia por cartão. Tente responder antes de conferir.'},
  {id:'term', name:'Termos técnicos', use:'Relacionar um conceito ao seu significado.', example:'Roteador → Encaminha pacotes entre redes.', front:'Termo', back:'Definição', tip:'Use uma definição precisa. Só ative a direção inversa se ela identificar o termo sem ambiguidade.'},
  {id:'language', name:'Vocabulário e idiomas', use:'Praticar compreensão ou produção com contexto.', example:'Borrow → Pegar emprestado.', front:'Palavra ou expressão', back:'Tradução ou significado', tip:'Inclua contexto: traduções e sinônimos podem variar. Você confere a própria resposta.'},
  {id:'cloze', name:'Completar lacunas', use:'Recuperar trechos de uma frase.', example:'A capital do Brasil é {{Brasília}}.', front:'Texto completo', back:null, tip:'Selecione um trecho e use “Ocultar trecho”. Todas as lacunas aparecem juntas, em uma única direção.'},
  {id:'problem', name:'Problemas e resolução', use:'Resolver antes de conferir a resposta e o procedimento.', example:'Resolva 2x + 3 = 11. → x = 4.', front:'Enunciado', back:'Resposta', tip:'Tente resolver no papel ou em seu ambiente de trabalho. O cartão complementa a prática.'},
  {id:'sequence', name:'Sequência de etapas', use:'Recuperar os passos de um procedimento.', example:'Investigação → Observação, hipótese, teste, análise, comunicação.', front:'Pergunta', back:'Etapas, uma por linha', tip:'Escreva uma etapa por linha. Depois de tentar lembrar, revele a sequência e confira a ordem.'}
];
const FLASHCARD_RATINGS = [{v:1,label:'Não lembrei'},{v:2,label:'Lembrei com dificuldade'},{v:3,label:'Lembrei bem'},{v:4,label:'Muito fácil'}];
const FLASHCARD_FIELDS = ['front','back','hint','explanation','example','contextTranslation','application','sourceLanguage','targetLanguage','grammar','pronunciation','notes'];
const FlashcardScheduler = {
  version:'FSRS-6 / ts-fsrs 5.2.3',
  parameters: Object.freeze({request_retention:0.9,maximum_interval:36500,enable_fuzz:false,enable_short_term:false}),
  instance:null,
  engine(){ return this.instance || (this.instance = FSRS.fsrs(this.parameters)); },
  configuration(){ return JSON.parse(JSON.stringify(this.engine().parameters)); },
  empty(at){ return JSON.parse(JSON.stringify(FSRS.createEmptyCard(new Date(at)))); },
  next(schedule, rating, at){
    if(!FLASHCARD_RATINGS.some(r => r.v === rating)) throw new Error('Escolha uma avaliação válida.');
    if(!Number.isFinite(Date.parse(at))) throw new Error('Horário inválido.');
    if(schedule.last_review && Date.parse(at) < Date.parse(schedule.last_review)) throw new Error('O relógio está anterior à última resposta. Confira a data do aparelho.');
    const card = {...schedule, due:new Date(schedule.due)};
    if(schedule.last_review) card.last_review = new Date(schedule.last_review);
    const next = this.engine().next(card, new Date(at), rating);
    return JSON.parse(JSON.stringify(next));
  },
  valid(s){
    return !!s && typeof s === 'object' && Number.isFinite(Date.parse(s.due)) &&
      ['stability','difficulty','elapsed_days','scheduled_days','reps','lapses','state'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]) && s[k] >= 0) &&
      s.difficulty <= 10 && s.stability <= 36500 && s.scheduled_days <= 36500 && Number.isInteger(s.scheduled_days) &&
      Number.isSafeInteger(s.reps) && Number.isSafeInteger(s.lapses) && s.lapses<=s.reps &&
      (s.reps===0 ? s.state===0 && s.stability===0 && s.difficulty===0 && !s.last_review : s.state===2 && s.stability>0 && s.difficulty>=1 && Number.isFinite(Date.parse(s.last_review)));
  }
};
function flashcardType(id){ return FLASHCARD_TYPES.find(t => t.id === id); }
function flashcardError(message){ const e = new Error(message); e.fatal = true; return e; }
function practiceOwner(){ return DataSync.tabId; }
const practiceLocks=new Set();
async function acquirePracticeLock(kind,id){
  // Web Locks distingue até abas duplicadas e libera a reserva num F5.
  // Sem suporte, os comandos mantêm uma reserva transacional de 30 segundos.
  if(!navigator.locks?.request) return ()=>{};
  const key=kind+':'+id;
  return new Promise((resolve,reject)=>{
    navigator.locks.request('ciclo:practice:'+key,{ifAvailable:true},async lock=>{
      if(!lock){resolve(null);return;}
      practiceLocks.add(key);
      await new Promise(release=>resolve(()=>{practiceLocks.delete(key);release();}));
    }).catch(reject);
  });
}
function flashcardText(value, limit = 20000){
  if(value == null) return '';
  if(typeof value !== 'string' || value.length > limit) throw flashcardError(`Use texto com até ${limit} caracteres por campo.`);
  return value;
}
function sanitizeFlashcardPrefs(input){
  const p=input && typeof input==='object'?input:{};
  const integer=(value,fallback,min,max)=>Number.isInteger(value)?clamp(value,min,max):fallback;
  return {limit:integer(p.limit,20,1,200),newLimit:integer(p.newLimit,10,0,200),mode:p.mode==='free'?'free':'scheduled',shuffle:p.shuffle===true};
}
const FlashcardModel = {
  directions(type, direction){ return ['term','language'].includes(type) ? (direction === 'both' ? ['forward','reverse'] : [direction === 'reverse' ? 'reverse' : 'forward']) : ['forward']; },
  content(type, input){
    if(!flashcardType(type)) throw flashcardError('Modelo de cartão desconhecido.');
    const data = {};
    FLASHCARD_FIELDS.forEach(k => { data[k] = flashcardText(input && input[k]); });
    if(!data.front.trim()) throw flashcardError('Preencha a frente do cartão.');
    if(type !== 'cloze' && !data.back.trim()) throw flashcardError('Preencha a resposta do cartão.');
    if(type === 'cloze'){
      const gaps = [...data.front.matchAll(/\{\{([^{}]+)\}\}/g)];
      if(!gaps.length || gaps.some(x => !x[1].trim()) || /[{}]/.test(data.front.replace(/\{\{([^{}]+)\}\}/g,''))) throw flashcardError('Oculte pelo menos um trecho. Não use lacunas vazias ou sobrepostas.');
    }
    if(type === 'sequence' && data.back.split('\n').filter(x => x.trim()).length < 2) throw flashcardError('Escreva pelo menos duas etapas, uma por linha.');
    return data;
  },
  presentation(note, card){
    const d = note.data;
    if(note.type === 'cloze') return {front:d.front.replace(/\{\{([^{}]+)\}\}/g,'______'),back:d.front.replace(/\{\{([^{}]+)\}\}/g,'$1')};
    return card.direction === 'reverse' ? {front:d.back,back:d.front} : {front:d.front,back:d.back};
  },
  active(card, notes = state.flashcardNotes, sets = state.flashcardSets){
    const n = notes instanceof Map ? notes.get(card.noteId) : notes.find(n => n.id === card.noteId);
    if(!n || n.deletedAt || n.archived || card.suspended || card.retired) return false;
    const d = getDiscipline(n.disciplineId);
    const set = n.setId && (sets instanceof Map ? sets.get(n.setId) : sets.find(s => s.id === n.setId));
    return !!d && !d.archived && (!set || (!set.archived && !set.suspended));
  },
  queue({disciplineId='',topicId='',setId='',mode='scheduled',limit=20,newLimit=10,shuffle=false} = {}){
    const notes = new Map(state.flashcardNotes.map(n => [n.id,n]));
    const sets = new Map(state.flashcardSets.map(s => [s.id,s]));
    let fresh = 0;
    const cards = state.flashcards.filter(c => {
      const n = notes.get(c.noteId);
      return n && this.active(c,notes,sets) && (!disciplineId || n.disciplineId === disciplineId) && (!topicId || n.topicId === topicId) && (!setId || n.setId === setId) &&
        (mode === 'free' || Date.parse(c.schedule.due) <= Date.now());
    }).sort((a,b) => (a.schedule.reps === 0) - (b.schedule.reps === 0) || Date.parse(a.schedule.due)-Date.parse(b.schedule.due) || a.id.localeCompare(b.id))
      .filter(c => c.schedule.reps > 0 || fresh++ < newLimit);
    if(shuffle) for(let i=cards.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]]; }
    return cards.slice(0,clamp(Math.round(limit)||20,1,200));
  },
  summary(sessionId){
    if(!this._summaryCache || this._summaryCache.runs!==state.flashcardRuns || this._summaryCache.responses!==state.flashcardResponses){
      const sessions=new Map(state.flashcardRuns.filter(r=>r.sessionId).map(r=>[r.id,r.sessionId])),counts=new Map();
      for(const event of state.flashcardResponses){const id=sessions.get(event.runId);if(id)counts.set(id,(counts.get(id)||0)+1);}
      this._summaryCache={runs:state.flashcardRuns,responses:state.flashcardResponses,counts};
    }
    const count=this._summaryCache.counts.get(sessionId)||0;
    return count ? plural(count,'cartão respondido','cartões respondidos') : '';
  },
  stats({from='',to='',disciplineIds=null,topicIds=null,types=null} = {}){
    const events = state.flashcardResponses.filter(e => (!from || e.date >= from) && (!to || e.date <= to) && (!disciplineIds || disciplineIds.has(e.disciplineId)) && (!topicIds || topicIds.has(e.topicId)) && (!types || types.has('revisao')));
    return {total:events.length,ratings:FLASHCARD_RATINGS.map(r => ({...r,count:events.filter(e => e.rating===r.v).length})),scheduled:events.filter(e=>e.mode==='scheduled').length};
  }
};

const FlashcardCommands = {
  async saveNote(input, baseRev = null){
    const data = FlashcardModel.content(input.type,input.data);
    return DB.atomic(FLASHCARD_STORES.concat(['disciplines','topics']),async api => {
      const old = input.id ? await api.get('flashcardNotes',input.id) : null;
      if(input.id && (!old || old.rev !== baseRev || old.deletedAt)) throw flashcardError('Este cartão mudou em outra aba. Abra a versão atual antes de editar.');
      if(old && old.type !== input.type) throw flashcardError('Para trocar o tipo, duplique o conteúdo em outro modelo. O original mantém seu histórico.');
      const disc = await api.get('disciplines',input.disciplineId);
      if(!disc || disc.archived) throw flashcardError('Escolha uma disciplina ativa.');
      if(input.topicId){ const topic = await api.get('topics',input.topicId); if(!topic || topic.disciplineId !== disc.id) throw flashcardError('O tópico precisa pertencer à disciplina.'); }
      if(input.setId){ const set = await api.get('flashcardSets',input.setId); if(!set || set.disciplineId !== disc.id || set.deletedAt) throw flashcardError('O conjunto precisa pertencer à disciplina.'); }
      if(input.templateId){ const t = await api.get('flashcardTemplates',input.templateId); if(!t || t.type !== input.type) throw flashcardError('O modelo salvo é incompatível com este cartão.'); }
      const stamp = nowISO();
      const note = {...old,id:old ? old.id : uid(),type:input.type,data,disciplineId:disc.id,topicId:input.topicId||null,setId:input.setId||null,
        templateId:input.templateId||null,direction: ['forward','reverse','both'].includes(input.direction) ? input.direction : 'forward',
        archived:!!input.archived,deletedAt:null,rev:old ? old.rev+1 : 1,createdAt:old ? old.createdAt : stamp,updatedAt:stamp};
      const directions = FlashcardModel.directions(note.type,note.direction);
      const cards = (await api.getAllByIndex('flashcards','noteId',note.id));
      for(const direction of directions){
        const existing = cards.find(c=>c.direction===direction);
        if(existing) await api.put('flashcards',{...existing,retired:false,rev:existing.rev+1});
        else await api.add('flashcards',{id:uid(),noteId:note.id,direction,schedule:FlashcardScheduler.empty(stamp),suspended:false,retired:false,rev:1});
      }
      for(const card of cards.filter(c=>!directions.includes(c.direction))) await api.put('flashcards',{...card,retired:true,rev:card.rev+1});
      await api.put('flashcardNotes',note);
      return note;
    });
  },
  async saveSet(input, baseRev = null){
    const name=flashcardText(input.name,160).trim();
    if(!name) throw flashcardError('Dê um nome ao conjunto.');
    return DB.atomic(['flashcardSets','disciplines'],async api=>{
      const old=input.id ? await api.get('flashcardSets',input.id) : null;
      if(input.id && (!old || old.rev !== baseRev)) throw flashcardError('O conjunto mudou em outra aba. Reabra para editar.');
      if(!await api.get('disciplines',input.disciplineId)) throw flashcardError('Escolha uma disciplina existente.');
      if(old && old.disciplineId !== input.disciplineId) throw flashcardError('Mova os cartões individualmente para mudar a disciplina.');
      const set={...old,id:old?old.id:uid(),name,disciplineId:input.disciplineId,archived:!!input.archived,suspended:!!input.suspended,rev:old?old.rev+1:1,updatedAt:nowISO()};
      await api.put('flashcardSets',set);return set;
    });
  },
  async saveTemplate(input){
    const name=flashcardText(input.name,160).trim();
    if(!name || !flashcardType(input.type)) throw flashcardError('Escolha o tipo e dê um nome ao modelo.');
    const template={id:uid(),name,type:input.type,direction:['forward','reverse','both'].includes(input.direction)?input.direction:'forward',
      fields: Array.from(new Set((input.fields||[]).filter(k=>FLASHCARD_FIELDS.includes(k) && !['front','back'].includes(k)))),
      showHint:input.showHint!==false,showExample:input.showExample!==false,createdAt:nowISO()};
    await DB.put('flashcardTemplates',template);return template;
  },
  async suspend(cardId, baseRev, suspended){
    return DB.atomic(['flashcards'],async api=>{
      const c=await api.get('flashcards',cardId);
      if(!c || c.rev!==baseRev) throw flashcardError('O cartão mudou em outra aba. Atualize a lista.');
      await api.put('flashcards',{...c,suspended:!!suspended,rev:c.rev+1});
    });
  },
  async deleteNote(noteId, baseRev){
    return DB.atomic(['flashcardNotes','flashcards'],async api=>{
      const n=await api.get('flashcardNotes',noteId);
      if(!n || n.rev!==baseRev) throw flashcardError('O cartão mudou em outra aba. Atualize a lista.');
      // Exclusão lógica: conteúdo sai da biblioteca; identidades e eventos continuam no backup.
      await api.put('flashcardNotes',{...n,deletedAt:nowISO(),rev:n.rev+1});
      for(const c of await api.getAllByIndex('flashcards','noteId',noteId)) await api.put('flashcards',{...c,retired:true,rev:c.rev+1});
    });
  },
  async begin(options={}){
    const selected=FlashcardModel.queue(options);
    if(!selected.length) throw flashcardError('Nenhum cartão disponível nesta seleção. Você pode escolher prática livre para antecipar.');
    const run={id:uid(),mode:options.mode==='free'?'free':'scheduled',queue:selected.map(c=>c.id),cursor:0,status:'paused',elapsedMs:0,sessionId:null,createdAt:nowISO(),date:todayISO(),finishedAt:null};
    await DB.put('flashcardRuns',run);return run;
  },
  async checkpoint(runId, deltaMs){
    return DB.atomic(['flashcardRuns'],async api=>{
      const r=await api.get('flashcardRuns',runId);
      if(!r || r.finishedAt) return r;
      if(r.owner && r.owner!==practiceOwner() && r.leaseUntil>Date.now() && !practiceLocks.has('flashcards:'+runId)) throw flashcardError('Esta sessão está aberta em outra aba. Continue por lá ou aguarde até 30 segundos após fechá-la.');
      r.owner=practiceOwner();r.leaseUntil=Date.now()+30000;
      r.elapsedMs+=clamp(Number(deltaMs)||0,0,60000);await api.put('flashcardRuns',r);return r;
    });
  },
  async release(runId){
    return DB.atomic(['flashcardRuns'],async api=>{
      const r=await api.get('flashcardRuns',runId);
      if(r && r.owner===practiceOwner()) await api.put('flashcardRuns',{...r,owner:null,leaseUntil:0});
    });
  },
  async answer({runId,cursor,cardId,cardRev,rating,at=nowISO()}){
    if(!Number.isFinite(Date.parse(at))) throw flashcardError('Horário de resposta inválido.');
    at=new Date(at).toISOString();
    return DB.atomic(FLASHCARD_STORES.concat('disciplines'),async api=>{
      const run=await api.get('flashcardRuns',runId);
      const eventId=runId+':'+cursor;
      const duplicate=await api.get('flashcardResponses',eventId);
      if(duplicate) return {duplicate:true,event:duplicate,run};
      if(!run || run.finishedAt || run.cursor!==cursor || run.queue[cursor]!==cardId) throw flashcardError('A sessão avançou em outra aba. Retome a versão atual.');
      if(run.owner && run.owner!==practiceOwner() && run.leaseUntil>Date.now()) throw flashcardError('Esta sessão está sendo usada em outra aba.');
      const card=await api.get('flashcards',cardId);
      const note=card && await api.get('flashcardNotes',card.noteId);
      const set=note && note.setId && await api.get('flashcardSets',note.setId);
      const disc=note && await api.get('disciplines',note.disciplineId);
      if(!card || card.rev!==cardRev || card.retired || card.suspended || !note || note.deletedAt || note.archived || !disc || disc.archived || (set && (set.archived || set.suspended))) throw flashcardError('Este cartão foi alterado, suspenso ou excluído. Pule-o ou retome a sessão atualizada.');
      if(!FLASHCARD_RATINGS.some(r=>r.v===rating)) throw flashcardError('Avaliação inválida.');
      const scheduled=run.mode==='scheduled';
      if(scheduled && Date.parse(card.schedule.due)>Date.parse(at)) throw flashcardError('A próxima sugestão ainda não chegou. Use prática livre para antecipar.');
      const next=scheduled ? FlashcardScheduler.next(card.schedule,rating,at) : null;
      const event={id:eventId,runId,cardId,noteId:note.id,topicId:note.topicId,direction:card.direction,disciplineId:note.disciplineId,disciplineName:disc.name,
        rating,at,date:localDateOfStamp(at),mode:run.mode,algorithm:FlashcardScheduler.version,parameters:FlashcardScheduler.configuration(),
        before:card.schedule,after:next?next.card:card.schedule,log:next?next.log:null};
      await api.add('flashcardResponses',event);
      await api.put('flashcards',{...card,schedule:event.after,rev:card.rev+1});
      run.cursor++;await api.put('flashcardRuns',run);
      if(set) await api.put('flashcardSets',{...set,lastUsedAt:at});
      return {duplicate:false,event,run};
    });
  },
  async skip(runId,cursor){
    return DB.atomic(['flashcardRuns'],async api=>{
      const r=await api.get('flashcardRuns',runId);
      if(!r || r.finishedAt || r.cursor!==cursor) throw flashcardError('A sessão mudou em outra aba. Retome para continuar.');
      r.cursor++;await api.put('flashcardRuns',r);return r;
    });
  },
  async finish(runId,{record=false,minutes=null}={}){
    // Uma transação liga eventos a UM estudo. Repetir o comando devolve o mesmo registro.
    return DB.atomic(FLASHCARD_STORES.concat(['sessions','disciplines','topics','meta']),async api=>{
      const r=await api.get('flashcardRuns',runId);
      if(!r) throw flashcardError('Sessão não encontrada.');
      if(r.finishedAt) return r;
      const events=await api.getAllByIndex('flashcardResponses','runId',r.id);
      if(record && r.parentGuidedId) throw flashcardError('Este tempo pertence ao roteiro guiado. Registre uma única sessão ao encerrar o roteiro.');
      if(record && events.length){
        if(TimerService.isActive || (await api.get('meta','activeTimer'))?.value) throw flashcardError('Finalize o cronômetro antes de registrar este tempo, para evitar sobreposição. As respostas estão salvas.');
        const ids=Array.from(new Set(events.map(e=>e.disciplineId).filter(Boolean)));
        const valid=[];for(const id of ids) if(await api.get('disciplines',id)) valid.push(id);
        const net=minutes===null ? Math.round(r.elapsedMs/60000) : Number(minutes);
        if(!Number.isInteger(net) || net<1 || net>2880 || !valid.length) throw flashcardError('Informe de 1 a 2880 minutos e mantenha ao menos uma disciplina.');
        const id='flashcards:'+r.id;
        if(!await api.get('sessions',id)){
          const session=newSession({id,disciplineId:valid[0],disciplineEntries:valid.map(disciplineId=>({disciplineId,minutes:null})),
            date:r.date,minutes:net,types:['revisao'],topicEntries:[],breaks:[],reviewMethod:'flashcards',comment:''});
          session.id=id;await api.add('sessions',session);
        }
        r.sessionId=id;
      }
      r.finishedAt=nowISO();r.status='finished';await api.put('flashcardRuns',r);return r;
    });
  },
  async detachDiscipline(api,id){
    for(const n of await api.getAll('flashcardNotes')) if(n.disciplineId===id) await api.put('flashcardNotes',{...n,disciplineId:null,topicId:null,setId:null,deletedAt:nowISO(),rev:n.rev+1});
    for(const s of await api.getAll('flashcardSets')) if(s.disciplineId===id) await api.put('flashcardSets',{...s,disciplineId:null,archived:true,deletedAt:nowISO(),rev:s.rev+1});
    for(const e of await api.getAll('flashcardResponses')) if(e.disciplineId===id) await api.put('flashcardResponses',{...e,disciplineId:null});
  }
};

/* Validação estrita do novo contrato. Um registro inválido recusa o arquivo
   inteiro; não se perdem cartões nem respostas numa restauração parcial. */
function validateFlashcardCollections(src, data, report){
  const fail=message=>{throw flashcardError('Flashcards: '+message+' Seus dados atuais não foram alterados.');};
  const disc=new Set(data.disciplines.map(d=>d.id)),topics=new Map(data.topics.map(t=>[t.id,t.disciplineId]));
  const maps={};
  for(const store of FLASHCARD_STORES){
    const list=src[store]===undefined ? [] : src[store];
    if(!Array.isArray(list) || list.length>200000) fail('coleção inválida ou acima de 200.000 registros.');
    const map=new Map();
    for(const r of list){
      if(!r || typeof r!=='object' || Array.isArray(r) || typeof r.id!=='string' || !r.id.trim() || r.id!==r.id.trim() || r.id.length>200 || map.has(r.id)) fail('identificador inválido ou repetido em '+store+'.');
      map.set(r.id,JSON.parse(JSON.stringify(r)));
    }
    maps[store]=map;data[store]=Array.from(map.values());
    report.counts[store]={found:list.length,accepted:list.length,repaired:0,ignored:0};
  }
  const revision=r=>{if(!Number.isInteger(r.rev) || r.rev<1) fail('revisão de registro inválida.');};
  for(const t of data.flashcardTemplates){
    if(!flashcardType(t.type) || !flashcardText(t.name,160).trim() || !Array.isArray(t.fields) || new Set(t.fields).size!==t.fields.length || t.fields.some(k=>!FLASHCARD_FIELDS.includes(k)||['front','back'].includes(k)) || !['forward','reverse','both'].includes(t.direction)) fail('modelo salvo inválido.');
  }
  for(const s of data.flashcardSets){
    revision(s);if(!flashcardText(s.name,160).trim() || (!disc.has(s.disciplineId) && !(s.disciplineId===null && s.deletedAt))) fail('conjunto sem disciplina válida.');
  }
  for(const n of data.flashcardNotes){
    revision(n);FlashcardModel.content(n.type,n.data);
    if(!disc.has(n.disciplineId) && !(n.disciplineId===null && n.deletedAt)) fail('conteúdo sem disciplina válida.');
    if(n.topicId && topics.get(n.topicId)!==n.disciplineId) fail('tópico incompatível com a disciplina.');
    if(n.setId && maps.flashcardSets.get(n.setId)?.disciplineId!==n.disciplineId) fail('conjunto incompatível.');
    if(n.templateId && maps.flashcardTemplates.get(n.templateId)?.type!==n.type) fail('modelo incompatível.');
    if(!['forward','reverse','both'].includes(n.direction)) fail('direção inválida.');
  }
  for(const g of data.guidedReviews){
    if(!Array.isArray(g.items) || !g.items.length || g.items.length>100 || !Number.isInteger(g.cursor) || g.cursor<0 || g.cursor>=g.items.length || !Number.isFinite(g.elapsedMs) || g.elapsedMs<0 || !isStrictISODate(g.date) || !Number.isInteger(g.rev) || g.rev<1) fail('roteiro guiado inválido.');
    for(const i of g.items) if(!['pending','skipped','done'].includes(i.status) || !CONCRETE_METHODS.includes(i.method) || !Number.isFinite(i.minutes) || i.minutes<1 || (i.outcome && !REVIEW_OUTCOMES.some(o=>o.v===i.outcome))) fail('atividade guiada inválida.');
  }
  const directions=new Set();
  for(const c of data.flashcards){
    revision(c);const n=maps.flashcardNotes.get(c.noteId),key=c.noteId+':'+c.direction;
    if(!n || !['forward','reverse'].includes(c.direction) || (c.direction==='reverse' && !['term','language'].includes(n.type)) || directions.has(key) || !FlashcardScheduler.valid(c.schedule)) fail('direção ou agendamento inválido.');
    directions.add(key);
  }
  for(const n of data.flashcardNotes) if(!n.deletedAt) for(const d of FlashcardModel.directions(n.type,n.direction)) if(!directions.has(n.id+':'+d)) fail('conteúdo sem direção de revisão.');
  for(const r of data.flashcardRuns){
    if(!['scheduled','free'].includes(r.mode) || !Array.isArray(r.queue) || r.queue.length>200 || r.queue.some(id=>!maps.flashcards.has(id)) || !Number.isInteger(r.cursor) || r.cursor<0 || r.cursor>r.queue.length || !Number.isFinite(r.elapsedMs) || r.elapsedMs<0 || !isStrictISODate(r.date)) fail('sessão de cartões inválida.');
    if(new Set(r.queue).size!==r.queue.length) fail('cartão repetido na mesma sessão.');
    if(r.parentGuidedId && !maps.guidedReviews.has(r.parentGuidedId)) fail('sessão de cartões sem roteiro de origem.');
  }
  for(const e of data.flashcardResponses){
    const c=maps.flashcards.get(e.cardId),r=maps.flashcardRuns.get(e.runId);
    if(!c || !r || c.noteId!==e.noteId || c.direction!==e.direction || !FLASHCARD_RATINGS.some(x=>x.v===e.rating) || !Number.isFinite(Date.parse(e.at)) || !isStrictISODate(e.date) || !['free','scheduled'].includes(e.mode) || !FlashcardScheduler.valid(e.before) || !FlashcardScheduler.valid(e.after) || (e.disciplineId && !disc.has(e.disciplineId))) fail('evento de resposta inválido.');
    if(e.mode==='free' && JSON.stringify(e.before)!==JSON.stringify(e.after)) fail('prática livre alterou agendamento.');
    const position=Number(e.id.slice((e.runId+':').length));
    if(e.id!==e.runId+':'+position || !Number.isInteger(position) || position<0 || position>=r.cursor || r.queue[position]!==e.cardId || e.mode!==r.mode) fail('resposta não corresponde ao passo da sessão.');
    if(e.mode==='scheduled' && (e.after.reps!==e.before.reps+1 || e.after.last_review!==e.at || Date.parse(e.before.due)>Date.parse(e.at))) fail('resposta e agendamento incompatíveis.');
  }
  return data;
}

function buildFlashcardResponsesCSV(){
  const text=value=>Backup.csvText(value),notes=new Map(state.flashcardNotes.map(n=>[n.id,n])),runs=new Map(state.flashcardRuns.map(r=>[r.id,r]));
  const header=['data','disciplina','tipo','direcao','frente','resposta','avaliacao','modalidade','proxima_sugestao','sessao_estudo'];
  const rows=state.flashcardResponses.slice().sort((a,b)=>a.at.localeCompare(b.at)).map(e=>{
    const n=notes.get(e.noteId),p=n?FlashcardModel.presentation(n,{direction:e.direction}):{front:'',back:''};
    return [e.date,e.disciplineName,n?flashcardType(n.type).name:'',e.direction,p.front,p.back,FLASHCARD_RATINGS.find(r=>r.v===e.rating)?.label,e.mode,e.after.due,runs.get(e.runId)?.sessionId||''].map(text).join(',');
  });
  return '\ufeff'+[header.join(','),...rows].join('\r\n')+'\r\n';
}

/* Interface: conteúdo sempre por textContent (h({text})); sem HTML do usuário. */
const FlashcardUI = {search:'',disciplineId:'',topicId:'',setId:'',status:'active',limit:20,newLimit:10,mode:'scheduled',shuffle:false};
async function flashcardAction(work){
  try { return await work(); }
  catch(error){ console.error('Flashcards:',error);toast(error.message || 'Não foi possível gravar. O formulário continua aberto.','err');return null; }
}
function fcButton(text,onclick,kind='ghost'){ return h('button',{type:'button',class:'btn '+kind,text,onclick}); }
function fcField(id,label,node){ node.id=id;return h('div',{class:'field'},h('label',{for:id,text:label}),node); }
function fcSelect(id,label,options,value,onchange){
  const node=h('select',{id,onchange: e=>onchange?.(e.target.value)},options.map(([v,t])=>h('option',{value:v,text:t})));
  node.value=value||'';return {node,field:fcField(id,label,node)};
}
function flashcardToolbar(){
  return h('nav',{class:'fc-tabs','aria-label':'Explorar revisões'},[
    ['overview','Panorama'],['flashcards','Flashcards']
  ].map(([v,label])=>h('button',{type:'button',class:'chip','aria-pressed':(ui.reviewsTab||'overview')===v?'true':'false',text:label,
    onclick:()=>{ui.reviewsTab=v;renderReviews();}})));
}
function openFlashcards(){ ui.reviewsTab='flashcards';setView('reviews');renderReviews(); }
function renderFlashcardLibrary(root){
  const u=FlashcardUI;
  const head=h('div',{class:'fc-library-head'},h('div',null,h('h3',{text:'Seus cartões, no seu ritmo'}),
    h('p',{class:'hint',text:'Tente lembrar, confira e avalie. Uma ferramenta para complementar seus estudos.'})),
    h('div',{class:'tf-actions'},fcButton('Estudar agora',()=>openFlashcardStudyOptions(),'primary'),fcButton('Criar flashcard',()=>openFlashcardTypePicker())));
  const search=h('input',{type:'search',value:u.search,placeholder:'Buscar conteúdo, idioma ou conjunto…',oninput:e=>{u.search=e.target.value;draw();}});
  const discs=fcSelect('fc-filter-disc','Disciplina',[['','Todas as disciplinas'],...activeDisciplines().map(d=>[d.id,d.name])],u.disciplineId,v=>{u.disciplineId=v;u.setId='';renderReviews();});
  const sets=fcSelect('fc-filter-set','Conjunto',[['','Todos os conjuntos'],...state.flashcardSets.filter(s=>!s.deletedAt && (!u.disciplineId || s.disciplineId===u.disciplineId)).map(s=>[s.id,s.name])],u.setId,v=>{u.setId=v;draw();});
  const status=fcSelect('fc-filter-status','Mostrar',[['active','Ativos'],['all','Todos'],['archived','Arquivados'],['suspended','Com direções suspensas']],u.status,v=>{u.status=v;draw();});
  const list=h('div',{class:'fc-notes'}),info=h('p',{class:'hint',role:'status','aria-live':'polite'});
  let shownLimit=40;
  const draw=()=>{
    const cardsByNote=new Map();state.flashcards.forEach(c=>{if(!cardsByNote.has(c.noteId))cardsByNote.set(c.noteId,[]);cardsByNote.get(c.noteId).push(c);});
    const setNames=new Map(state.flashcardSets.map(s=>[s.id,s.name]));
    const activeNotes=new Map(state.flashcardNotes.map(n=>[n.id,n])),activeSets=new Map(state.flashcardSets.map(s=>[s.id,s]));
    const query=normalizeText(u.search);
    const notes=state.flashcardNotes.filter(n=>!n.deletedAt && (!u.disciplineId || n.disciplineId===u.disciplineId) && (!u.setId || n.setId===u.setId) &&
      (u.status==='all' || (u.status==='archived' ? n.archived : u.status==='suspended' ? (cardsByNote.get(n.id)||[]).some(c=>c.suspended) : !n.archived)) &&
      (!query || normalizeText(Object.values(n.data).join(' ')+' '+disciplineName(n.disciplineId)+' '+(setNames.get(n.setId)||'')).includes(query)));
    info.textContent=plural(notes.length,'conteúdo','conteúdos')+' · '+plural(state.flashcards.filter(c=>FlashcardModel.active(c,activeNotes,activeSets) && Date.parse(c.schedule.due)<=Date.now()).length,'direção disponível agora','direções disponíveis agora');
    clear(list);
    if(!notes.length) list.append(h('p',{class:'quiet-empty',text:state.flashcardNotes.some(n=>!n.deletedAt)?'Nenhum cartão nesta seleção. Ajuste os filtros.':'Crie uma pergunta sobre algo que você já compreendeu. Disciplina é suficiente; tópicos e conjuntos são opcionais.'}));
    for(const n of notes.slice(0,shownLimit)){
      const cards=cardsByNote.get(n.id)||[];
      list.append(h('article',{class:'fc-note'},h('div',{class:'fc-note-main'},h('p',{class:'fc-note-type',text:flashcardType(n.type).name+' · '+disciplineName(n.disciplineId)+(n.archived?' · Arquivado':'')}),
        h('h4',{text:n.data.front.replace(/\{\{([^{}]+)\}\}/g,'$1')}),
        h('p',{class:'hint',text:cards.filter(c=>!c.retired).map(c=>(c.direction==='reverse'?'Inversa':'Direta')+': '+(c.suspended?'Suspensa':Date.parse(c.schedule.due)<=Date.now()?'Disponível agora':'Programada · '+fmtDateBR(localDateOfStamp(c.schedule.due)))).join(' · ')})),
        h('div',{class:'fc-note-actions'},fcButton('Editar',()=>openFlashcardEditor({note:n})),fcButton('Detalhes e histórico',()=>openFlashcardNoteDetail(n.id)))));
    }
    if(notes.length>shownLimit) list.append(fcButton('Mostrar mais',()=>{shownLimit+=40;draw();}));
  };
  draw();
  const resumable=state.flashcardRuns.filter(r=>!r.finishedAt).reverse();
  mount(root,h('div',{class:'narrow-screen wide reviews-v7'},flashcardToolbar(),head,
    !state.flashcardNotes.some(n=>!n.deletedAt)?h('div',{class:'fc-intro'},h('p',{text:'Flashcards ajudam a tentar lembrar antes de consultar a resposta.'}),fcButton('Entender como funciona',()=>openFlashcardPrimer())):null,
    resumable.slice(0,3).map(r=>h('div',{class:'fc-resume'},h('span',{text:`Quer continuar de onde parou? ${r.cursor} de ${r.queue.length} atividades percorridas.`}),fcButton('Retomar sessão',()=>openFlashcardPlayer(r.id)))),
    resumable.length>3?h('details',{class:'disclosure'},h('summary',{text:'Outras sessões interrompidas'}),h('div',{class:'disclosure-body'},resumable.slice(3).map(r=>h('div',{class:'fc-set-row'},h('span',{text:fmtDateBR(r.date)+' · '+r.cursor+' de '+r.queue.length}),fcButton('Retomar sessão',()=>openFlashcardPlayer(r.id)))))):null,
    h('div',{class:'fc-filters'},fcField('fc-search','Buscar cartões',search),discs.field,sets.field,status.field),info,list,
    h('details',{class:'disclosure'},h('summary',{text:'Conjuntos e modelos salvos'}),h('div',{class:'disclosure-body'},
      h('div',{class:'tf-actions'},fcButton('Criar conjunto',()=>openFlashcardSetEditor()),fcButton('Como criar bons cartões',()=>openFlashcardPrimer())),
      state.flashcardSets.filter(s=>!s.deletedAt).map(s=>h('div',{class:'fc-set-row'},h('div',null,h('strong',{text:s.name}),h('p',{class:'hint',text:disciplineName(s.disciplineId)+' · '+plural(state.flashcardNotes.filter(n=>n.setId===s.id&&!n.deletedAt).length,'conteúdo','conteúdos')+(s.archived?' · Arquivado':s.suspended?' · Suspenso':'')+(s.lastUsedAt?' · Último uso '+fmtDateBR(localDateOfStamp(s.lastUsedAt)): ' · Ainda não utilizado')})),fcButton('Gerenciar',()=>openFlashcardSetEditor(s)))),
      h('h4',{text:'Modelos reutilizáveis'}),state.flashcardTemplates.length?state.flashcardTemplates.map(t=>h('div',{class:'fc-set-row'},h('span',{text:t.name+' · '+flashcardType(t.type).name}),fcButton('Usar modelo',()=>openFlashcardEditor({type:t.type,template:t})),fcButton('Gerenciar modelo',()=>openFlashcardTemplateManager(t)))):h('p',{class:'hint',text:'No editor, salve suas preferências como modelo. Seus textos ficam apenas no cartão.'}))),
    flashcardStatsPanel(),h('div',{class:'tf-actions'},fcButton('Ajuda sobre flashcards',()=>openFlashcardPrimer()),fcButton('Exportar respostas (.csv)',once(()=>flashcardAction(async()=>{await loadAll();Backup.download('ciclo_respostas_'+todayISO()+'.csv',buildFlashcardResponsesCSV(),'text/csv;charset=utf-8');}))))));
}
function openFlashcardTypePicker(context={}){
  if(!activeDisciplines().length){ toast('Crie uma disciplina para organizar seus cartões. Tópicos são opcionais.','info');openDisciplineModal();return; }
  openModal(close=>({title:'Qual tipo de cartão você quer criar?',content:h('div',{class:'fc-type-grid'},FLASHCARD_TYPES.map(t=>h('button',{class:'fc-type',type:'button',onclick:()=>{close();openFlashcardEditor({...context,type:t.id});}},
    h('strong',{text:t.name}),h('span',{text:t.use}),h('span',{class:'fc-type-example',text:t.example})))),actions:[fcButton('Cancelar',()=>close())]}),{size:'wide'});
}
function openFlashcardEditor({note=null,type='basic',template=null,disciplineId='',topicId='',setId='',direction='forward',copiedData=null}={}){
  type=note?note.type:type;
  const model=flashcardType(type);
  if(!model) return;
  template=template || (note && state.flashcardTemplates.find(t=>t.id===note.templateId));
  const context={disciplineId:note?note.disciplineId:disciplineId||FlashcardUI.disciplineId||activeDisciplines()[0]?.id||'',topicId:note?note.topicId:topicId,setId:note?note.setId:setId||FlashcardUI.setId||''};
  const original=note?note.data:copiedData||{};
  openModal(close=>{
    const inputs={};
    const input=(key,label,multiline=true)=>{
      const node=h(multiline?'textarea':'input',{value:original[key]||'',maxlength:'20000',rows:key==='front'||key==='back'?'4':'2',oninput:()=>preview()});
      node.value=original[key]||''; // textarea usa a propriedade, não um atributo value.
      inputs[key]=node;return fcField('fc-edit-'+key,label,node);
    };
    const front=input('front',model.front);
    const back=model.back?input('back',model.back):null;
    const topic=fcSelect('fc-edit-topic','Tópico (opcional)',[['','Sem tópico']],context.topicId,v=>{context.topicId=v;});
    const set=fcSelect('fc-edit-set','Conjunto (opcional)',[['','Sem conjunto']],context.setId,v=>{context.setId=v;});
    const updateLinks=()=>{
      const fill=(select,opts,value)=>{clear(select);opts.forEach(([v,t])=>select.append(h('option',{value:v,text:t})));select.value=opts.some(([v])=>v===value)?value:'';};
      fill(topic.node,[['','Sem tópico'],...topicsOf(context.disciplineId).map(t=>[t.id,t.name])],context.topicId);
      fill(set.node,[['','Sem conjunto'],...state.flashcardSets.filter(s=>s.disciplineId===context.disciplineId&&!s.deletedAt).map(s=>[s.id,s.name])],context.setId);
      context.topicId=topic.node.value;context.setId=set.node.value;
    };
    const disc=fcSelect('fc-edit-disc','Disciplina',activeDisciplines().map(d=>[d.id,d.name]),context.disciplineId,v=>{context.disciplineId=v;context.topicId='';context.setId='';updateLinks();});updateLinks();
    const dir=fcSelect('fc-edit-direction',type==='language'?'Direção: compreensão ou produção':'Direção de recordação',
      [['forward',type==='language'?'Origem → destino':'Termo → definição'],['reverse',type==='language'?'Destino → origem':'Definição → termo'],['both','Ambas: duas direções com agendas independentes']],note?note.direction:template?.direction||direction);
    const optionalLabels={hint:'Dica',explanation:type==='problem'?'Resolução passo a passo':'Explicação complementar',example:'Exemplo de uso',contextTranslation:'Tradução do exemplo',application:'Área de aplicação',sourceLanguage:'Idioma de origem',targetLanguage:'Idioma de destino',grammar:'Classe gramatical',pronunciation:'Pronúncia textual',notes:'Observações'};
    const preferred=template?.fields||[];
    const perType={basic:['hint','explanation','notes'],term:['example','application','hint','explanation','notes'],language:['sourceLanguage','targetLanguage','example','contextTranslation','grammar','pronunciation','hint','notes','explanation'],cloze:['hint','explanation','notes'],problem:['explanation','hint','notes'],sequence:['explanation','hint','notes']};
    const allOptional=Array.from(new Set([...preferred,...perType[type],...Object.keys(optionalLabels).filter(k=>original[k])]));
    const optional=allOptional.map(k=>({key:k,node:input(k,optionalLabels[k],!['sourceLanguage','targetLanguage','grammar','pronunciation'].includes(k))}));
    const promoted=k=>preferred.includes(k)||(type==='language'&&['sourceLanguage','targetLanguage'].includes(k));
    const previewBody=h('div',{class:'fc-preview'});
    function collect(){ const out={...original};Object.entries(inputs).forEach(([k,node])=>{out[k]=node.value;});return out; }
    function preview(){
      if(!inputs.front) return;
      const data={...Object.fromEntries(FLASHCARD_FIELDS.map(k=>[k,''])),...collect()};
      const p=FlashcardModel.presentation({type,data},{direction:dir?.node.value==='reverse'?'reverse':'forward'});
      mount(previewBody,h('p',{class:'hint',text:'Frente'}),h('p',{class:'fc-card-text',text:p.front}),h('details',null,h('summary',{text:'Mostrar resposta da prévia'}),h('p',{class:'fc-card-text',text:p.back}))); }
    dir.node.addEventListener('change',preview);
    const cloze=type==='cloze'?h('div',null,fcButton('Ocultar trecho',()=>{
      const node=inputs.front,a=node.selectionStart,b=node.selectionEnd;
      if(a===b){toast('Selecione um trecho do texto primeiro.','info');node.focus();return;}
      node.setRangeText('{{'+node.value.slice(a,b)+'}}',a,b,'select');preview();node.focus();
    }),h('p',{class:'hint',text:'Selecione com o teclado ou pelo toque. Todas as lacunas pertencem ao mesmo cartão.'})):null;
    const templateName=h('input',{type:'text',maxlength:'160',placeholder:'Ex.: Meu vocabulário de inglês'});
    const hintPref=h('input',{type:'checkbox',checked:template?.showHint!==false}),examplePref=h('input',{type:'checkbox',checked:template?.showExample!==false});
    const templateFields=allOptional.map(k=>({key:k,check:h('input',{type:'checkbox',checked:preferred.includes(k)} )}));
    const templateSettings=h('details',{class:'disclosure'},h('summary',{text:'Salvar preferências como modelo'}),h('div',{class:'disclosure-body'},
      fcField('fc-template-name','Nome do modelo',templateName),h('p',{class:'hint',text:'Salva tipo, direção e campos preferidos. O conteúdo e o histórico dos cartões são preservados.'}),
      templateFields.map(({key,check})=>h('label',{class:'fc-check'},check,optionalLabels[key])),
      h('label',{class:'fc-check'},hintPref,'Oferecer dica durante a prática'),h('label',{class:'fc-check'},examplePref,'Revelar exemplo junto à resposta'),
      fcButton('Salvar modelo',once(()=>flashcardAction(async()=>{
        template=await FlashcardCommands.saveTemplate({name:templateName.value,type,direction:dir.node.value,fields:templateFields.filter(x=>x.check.checked).map(x=>x.key),showHint:hintPref.checked,showExample:examplePref.checked});
        await loadAll();toast('Modelo salvo. Ele estará disponível na biblioteca.','ok');
      })))));
    const save=once(()=>flashcardAction(async()=>{
      const saved=await FlashcardCommands.saveNote({id:note?.id,type,data:collect(),...context,direction:dir.node.value,templateId:template?.id||null,archived:note?.archived||false},note?.rev??null);
      await loadAll();
      close.push({title:note?'Cartão atualizado':'Cartão salvo',content:h('div',null,h('p',{text:'Seu conteúdo já está guardado neste navegador.'}),h('p',{class:'hint',text:'Criar outro mantém disciplina, conjunto, modelo e direção.'})),actions:[
        fcButton('Criar outro',()=>{close();openFlashcardEditor({type,template,...context,direction:dir.node.value});}),
        fcButton('Estudar agora',()=>{close();openFlashcardStudyOptions({disciplineId:saved.disciplineId,setId:saved.setId||''});},'primary'),
        fcButton('Ver meus cartões',()=>{close();openFlashcards();})]});
    }));
    preview();
    return {title:(note?'Editar: ':'Criar: ')+model.name,content:h('div',{class:'fc-editor'},h('p',{class:'hint',text:model.tip}),
      disc.field,h('div',{class:'two-col'},topic.field,set.field),front,cloze,back,
      ['term','language'].includes(type)?h('div',null,dir.field,h('p',{class:'hint',text:'Ative a inversa apenas quando a resposta identificar claramente o que deve ser lembrado. Uma resposta conta uma vez. Os dois sentidos têm históricos independentes.'})):null,
      optional.filter(o=>promoted(o.key)).map(o=>o.node),
      h('details',{class:'disclosure'},h('summary',{text:'Dica, exemplos e outros campos (opcionais)'}),h('div',{class:'disclosure-body'},optional.filter(o=>!promoted(o.key)).map(o=>o.node))),
      h('details',{class:'disclosure'},h('summary',{text:'Prévia do cartão'}),previewBody),templateSettings,
      h('p',{class:'hint',text:'Para mudar o tipo de um conteúdo existente, crie uma cópia em outro modelo. O original mantém todos os campos e o histórico.'})),actions:[fcButton('Cancelar',()=>close()),fcButton('Salvar cartão',save,'primary')]};
  },{size:'wide'});
}
function openFlashcardSetEditor(set=null){
  openModal(close=>{
    const name=h('input',{type:'text',value:set?.name||'',maxlength:'160'});
    const disc=fcSelect('fc-set-disc','Disciplina',activeDisciplines().map(d=>[d.id,d.name]),set?.disciplineId||activeDisciplines()[0]?.id);disc.node.disabled=!!set;
    const archived=h('input',{type:'checkbox',checked:!!set?.archived}),suspended=h('input',{type:'checkbox',checked:!!set?.suspended});
    return {title:set?'Gerenciar conjunto':'Criar conjunto',content:h('div',null,fcField('fc-set-name','Nome',name),disc.field,
      h('label',{class:'fc-check'},archived,'Arquivar: guardar fora da biblioteca ativa'),h('label',{class:'fc-check'},suspended,'Suspender: pausar a apresentação de todos os cartões'),
      h('p',{class:'hint',text:'Arquivar e suspender preservam conteúdo, respostas e agenda. Excluir o conjunto apenas desagrupa os cartões.'})),actions:[fcButton('Cancelar',()=>close()),
      set?fcButton('Excluir conjunto',once(()=>flashcardAction(async()=>{
        if(!await confirmModal('Excluir este conjunto e manter todos os cartões sem conjunto?',{confirmLabel:'Excluir conjunto'})) return;
        await DB.atomic(['flashcardSets','flashcardNotes'],async api=>{
          const current=await api.get('flashcardSets',set.id);if(!current||current.rev!==set.rev) throw flashcardError('O conjunto mudou em outra aba.');
          for(const n of await api.getAll('flashcardNotes')) if(n.setId===set.id) await api.put('flashcardNotes',{...n,setId:null,rev:n.rev+1});
          await api.delete('flashcardSets',set.id);
        });await refresh();close();
      }))):null,
      fcButton('Salvar conjunto',once(()=>flashcardAction(async()=>{await FlashcardCommands.saveSet({id:set?.id,name:name.value,disciplineId:disc.node.value,archived:archived.checked,suspended:suspended.checked},set?.rev??null);await refresh();close();})),'primary')]};
  });
}
function openFlashcardTemplateManager(template){
  openModal(close=>{
    const name=h('input',{type:'text',value:template.name,maxlength:'160'});
    return {title:'Modelo salvo',content:h('div',null,fcField('fc-model-name','Nome',name),h('p',{class:'hint',text:'Preferências de '+flashcardType(template.type).name+'. Para outras opções, use este modelo no editor e salve um novo modelo. Restaurar o padrão desliga este modelo dos cartões, preservando todos os seus campos.'})),actions:[
      fcButton('Fechar',()=>close()),fcButton('Renomear',once(()=>flashcardAction(async()=>{
        const value=flashcardText(name.value,160).trim();if(!value) throw flashcardError('Dê um nome ao modelo.');
        await DB.atomic(['flashcardTemplates'],async api=>{const cur=await api.get('flashcardTemplates',template.id);if(!cur||JSON.stringify(cur)!==JSON.stringify(template)) throw flashcardError('O modelo mudou em outra aba.');await api.put('flashcardTemplates',{...cur,name:value});});await refresh();close();
      }))),fcButton('Restaurar padrão e excluir modelo',once(()=>flashcardAction(async()=>{
        if(!await confirmModal('Excluir as preferências deste modelo? Os cartões e todos os seus campos continuam preservados.',{confirmLabel:'Restaurar padrão'})) return;
        await DB.atomic(['flashcardTemplates','flashcardNotes'],async api=>{for(const n of await api.getAll('flashcardNotes')) if(n.templateId===template.id) await api.put('flashcardNotes',{...n,templateId:null,rev:n.rev+1});await api.delete('flashcardTemplates',template.id);});await refresh();close();
      }))) ]};
  });
}
function openFlashcardNoteDetail(noteId){
  const note=state.flashcardNotes.find(n=>n.id===noteId);if(!note) return;
  const cards=state.flashcards.filter(c=>c.noteId===noteId),events=state.flashcardResponses.filter(e=>e.noteId===noteId).sort((a,b)=>b.at.localeCompare(a.at));
  openModal(close=>({title:'Conteúdo e histórico',content:h('div',null,h('h3',{class:'fc-card-text',text:note.data.front}),
    h('p',{class:'fc-card-text',text:note.data.back||note.data.front.replace(/\{\{([^{}]+)\}\}/g,'$1')}),
    h('p',{class:'hint',text:'Editar o conteúdo preserva todas as respostas e as datas já sugeridas.'}),
    cards.map(c=>h('div',{class:'fc-set-row'},h('span',{text:(c.direction==='reverse'?'Inversa':'Direta')+' · '+(c.retired?'Fora da apresentação':c.suspended?'Suspensa':'Ativa')+' · próxima sugestão '+fmtDateBR(localDateOfStamp(c.schedule.due))}),
      !c.retired?fcButton(c.suspended?'Retomar direção':'Suspender direção',once(()=>flashcardAction(async()=>{await FlashcardCommands.suspend(c.id,c.rev,!c.suspended);await loadAll();close();openFlashcardNoteDetail(noteId);}))):null)),
    h('h4',{text:plural(events.length,'resposta registrada','respostas registradas')}),h('p',{class:'hint',text:'Cada linha é uma tentativa confirmada. Prática livre preserva a agenda.'}),
    h('ol',{class:'fc-event-list'},events.slice(0,100).map(e=>h('li',{text:fmtDateBR(e.date)+' · '+(e.direction==='reverse'?'Inversa':'Direta')+' · '+FLASHCARD_RATINGS.find(r=>r.v===e.rating)?.label+' · '+(e.mode==='free'?'Prática livre':'Repetição espaçada')}))),
    events.length>100?h('p',{class:'hint',text:'Mostrando as 100 respostas mais recentes. O backup contém todo o histórico.'}):null),actions:[
    fcButton('Fechar',()=>close()),fcButton('Editar',()=>{close();openFlashcardEditor({note});}),
    fcButton('Duplicar',()=>{close();openFlashcardEditor({type:note.type,disciplineId:note.disciplineId,topicId:note.topicId,setId:note.setId,direction:note.direction,copiedData:note.data});}),
    fcButton('Duplicar em outro modelo',()=>{close();openFlashcardTypePicker({disciplineId:note.disciplineId,topicId:note.topicId,setId:note.setId,copiedData:note.data});}),
    fcButton(note.archived?'Desarquivar':'Arquivar',once(()=>flashcardAction(async()=>{await FlashcardCommands.saveNote({...note,archived:!note.archived},note.rev);await refresh();close();}))),
    fcButton('Excluir cartão',once(()=>flashcardAction(async()=>{if(!await confirmModal('Excluir este conteúdo da biblioteca? O histórico de respostas permanece no backup. Arquivar permite voltar a estudar depois.',{confirmLabel:'Excluir cartão'})) return;await FlashcardCommands.deleteNote(note.id,note.rev);await refresh();close();})))
  ]}),{size:'wide'});
}
function openFlashcardStudyOptions(preset={}){
  Object.assign(FlashcardUI,sanitizeFlashcardPrefs(state.settings.flashcards),preset);
  openModal(close=>{
    const u=FlashcardUI;
    const disc=fcSelect('fc-study-disc','Disciplina',[['','Todas'],...activeDisciplines().map(d=>[d.id,d.name])],u.disciplineId);
    const topic=fcSelect('fc-study-topic','Assunto (opcional)',[['','Todos os assuntos'],...state.topics.filter(t=>!t.archived).map(t=>[t.id,disciplineName(t.disciplineId)+' — '+t.name])],u.topicId);
    const sets=fcSelect('fc-study-set','Conjunto',[['','Todos'],...state.flashcardSets.filter(s=>!s.deletedAt&&!s.archived).map(s=>[s.id,s.name])],u.setId);
    const mode=fcSelect('fc-study-mode','Modalidade',[['scheduled','Repetição espaçada: atualiza as próximas sugestões'],['free','Prática livre: inclui antecipados e mantém a agenda']],u.mode);
    const limit=h('input',{type:'number',min:'1',max:'200',value:u.limit,inputmode:'numeric'}),fresh=h('input',{type:'number',min:'0',max:'200',value:u.newLimit,inputmode:'numeric'}),shuffle=h('input',{type:'checkbox',checked:u.shuffle});
    return {title:'Como você quer praticar?',content:h('div',null,disc.field,topic.field,sets.field,mode.field,h('div',{class:'two-col'},fcField('fc-study-limit','Máximo de direções nesta sessão',limit),fcField('fc-study-new','Máximo de direções novas',fresh)),
      h('label',{class:'fc-check'},shuffle,'Embaralhar a seleção'),h('p',{class:'hint',text:'Você pode pausar ou parar a qualquer momento. As respostas confirmadas ficam salvas. Cartões suspensos e arquivados ficam fora de ambas as modalidades.'})),actions:[fcButton('Cancelar',()=>close()),fcButton('Começar cartões',once(()=>flashcardAction(async()=>{
        if(!limit.checkValidity()||!fresh.checkValidity()){toast('Use de 1 a 200 direções e de 0 a 200 novas.','err');return;}
        Object.assign(u,{disciplineId:disc.node.value,topicId:topic.node.value,setId:sets.node.value,mode:mode.node.value,limit:Number(limit.value),newLimit:Number(fresh.value),shuffle:shuffle.checked});
        state.settings.flashcards=sanitizeFlashcardPrefs(u);await saveSettings();
        const run=await FlashcardCommands.begin(u);close();await openFlashcardPlayer(run.id);
      })),'primary')]};
  });
}

async function openFlashcardPlayer(runId){
  let run=await DB.get('flashcardRuns',runId);
  if(!run || run.finishedAt){toast('Esta sessão já foi encerrada.','info');return;}
  const releaseLock=await acquirePracticeLock('flashcards',runId);
  if(!releaseLock){toast('Esta sessão está aberta em outra aba. Continue por lá.','info');return;}
  if(!await flashcardAction(()=>FlashcardCommands.checkpoint(runId,0))){releaseLock();return;}
  let card=null,note=null,revealed=false,paused=true,busy=false,closed=false,lastTick=performance.now(),pending=Promise.resolve();
  const flush=()=>{
    const now=performance.now(),delta=paused?0:now-lastTick;lastTick=now;
    pending=pending.then(()=>FlashcardCommands.checkpoint(runId,delta));
    return pending;
  };
  const loadCurrent=async()=>{
    run=await DB.get('flashcardRuns',runId);
    const cardId=run?.queue[run.cursor];
    card=cardId ? await DB.get('flashcards',cardId) : null;
    note=card && await DB.get('flashcardNotes',card.noteId);revealed=false;
  };
  await loadCurrent();
  let timer=null,body=null,draw=null,finishView=null;
  const visibility=()=>{if(document.hidden && !paused){flush().catch(e=>toast(e.message,'err'));paused=true;draw?.();}};
  document.addEventListener('visibilitychange',visibility);
  const cleanup=()=>{if(closed) return;closed=true;clearInterval(timer);document.removeEventListener('visibilitychange',visibility);flush().then(()=>FlashcardCommands.release(runId)).catch(e=>toast('Não foi possível guardar os últimos segundos: '+e.message,'err')).finally(releaseLock);};
  openModal(close=>{
    body=h('div',{class:'fc-player'});
    finishView=async()=>{
      await flush();paused=true;await loadAll();close();openFlashcardResult(runId);
    };
    const rate=rating=>flashcardAction(async()=>{
      if(busy||paused||!revealed||!card) return;
      busy=true;$$('button',body).forEach(b=>{b.disabled=true;});try{
        await flush();
        await FlashcardCommands.answer({runId,cursor:run.cursor,cardId:card.id,cardRev:card.rev,rating});
        await loadCurrent();if(closed) return;
        if(run.cursor>=run.queue.length){await finishView();return;}
        draw();
      } finally{busy=false;if(!closed)$$('button',body).forEach(b=>{b.disabled=false;});}
    });
    draw=()=>{
      if(closed) return;
      const unavailable=!card || !note || note.deletedAt;
      const p=unavailable?null:FlashcardModel.presentation(note,card);
      const template=note?.templateId && state.flashcardTemplates.find(t=>t.id===note.templateId);
      const showHint=template?template.showHint!==false:true,showExample=template?template.showExample!==false:true;
      const progress=h('p',{class:'fc-progress',role:'status',text:`${Math.min(run.cursor+1,run.queue.length)} de ${run.queue.length} · ${run.mode==='free'?'Prática livre · agenda preservada':'Repetição espaçada'}`});
      const prompt=h('h3',{class:'fc-card-text',tabindex:'-1',text:p?.front||'Este cartão não está mais disponível.'});
      const reveal=fcButton('Mostrar resposta',()=>{revealed=true;draw();$('#fc-answer')?.focus({preventScroll:true});},'primary');
      const answer=revealed?h('div',{class:'fc-answer',id:'fc-answer',tabindex:'-1'},h('p',{class:'hint',text:'Confira sua tentativa'}),
        note.type==='sequence'?h('ol',{class:'fc-card-text'},p.back.split('\n').filter(x=>x.trim()).map(x=>h('li',{text:x}))):h('p',{class:'fc-card-text',text:p.back}),
        showExample && note.data.example?h('div',null,h('p',{class:'pre-text',text:note.data.example}),note.data.contextTranslation?h('p',{class:'pre-text',text:note.data.contextTranslation}):null):null,
        note.data.explanation?h('details',null,h('summary',{text:note.type==='problem'?'Ver resolução passo a passo':'Ver explicação'}),h('p',{class:'pre-text',text:note.data.explanation})):null,
        ['application','grammar','pronunciation','notes'].filter(k=>note.data[k]).map(k=>h('p',{class:'hint pre-text',text:note.data[k]})),
        h('p',{class:'hint',text:'Você avalia sua lembrança. Sinônimos e outras soluções válidas não são corrigidos por comparação de texto.'}),
        h('div',{class:'fc-ratings'},FLASHCARD_RATINGS.map(r=>{
          const btn=fcButton(r.label,()=>rate(r.v));btn.dataset.rating=String(r.v);
          if(run.mode==='scheduled'){
            try{const next=FlashcardScheduler.next(card.schedule,r.v,nowISO());btn.append(h('span',{class:'fc-next',text:'Próxima sugestão '+fmtDateBR(localDateOfStamp(next.card.due))}));}catch(_){}
          }
          return btn;
        }))):null;
      mount(body,progress,h('p',{class:'hint',text:note?disciplineName(note.disciplineId)+(note.type==='language'?' · '+[note.data.sourceLanguage,note.data.targetLanguage].filter(Boolean).join(' → '):''):''}),
        paused?h('div',{class:'fc-paused'},h('p',{text:'Sessão pausada. Suas respostas estão guardadas.'}),fcButton('Continuar cartões',()=>{paused=false;lastTick=performance.now();draw();},'primary')):
        h('div',{class:'fc-card'},prompt,!unavailable&&showHint&&note.data.hint?h('details',null,h('summary',{text:'Mostrar dica'}),h('p',{class:'pre-text',text:note.data.hint})):null,
          !unavailable&&!revealed?reveal:null,answer),
        h('div',{class:'tf-actions'},!paused?fcButton('Pausar cartões',async()=>{await flashcardAction(flush);paused=true;draw();}):null,
          fcButton('Pular este cartão',once(()=>flashcardAction(async()=>{if(busy)return;await flush();run=await FlashcardCommands.skip(runId,run.cursor);await loadCurrent();if(run.cursor>=run.queue.length)await finishView();else draw();}))),
          fcButton('Recarregar sessão',once(()=>flashcardAction(async()=>{await flush();await loadCurrent();if(run.finishedAt){close();return;}draw();})))),
        h('p',{class:'hint fc-key-hint',text:'Espaço revela; 1–4 avaliam depois de revelar. Use Tab para navegar. Você pode pular ou encerrar sem responder tudo.'}));
      body.onkeydown=e=>{
        if(paused || e.altKey || e.ctrlKey || e.metaKey || ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
        if(e.code==='Space'&&!revealed&&e.target===body){e.preventDefault();revealed=true;draw();$('#fc-answer')?.focus({preventScroll:true});}
        if(revealed&&/^[1-4]$/.test(e.key)){e.preventDefault();rate(Number(e.key));}
      };
      body.tabIndex=-1;
      if(!paused && !revealed) setTimeout(()=>{if(!closed && body.isConnected)body.focus({preventScroll:true});},0);
    };
    draw();
    timer=setInterval(()=>flashcardAction(flush),10000);
    return {title:'Praticar flashcards',content:body,actions:[fcButton('Continuar depois',async()=>{await flashcardAction(flush);paused=true;close();await refresh();}),fcButton('Encerrar cartões',once(()=>flashcardAction(finishView)))]};
  },{size:'wide',dismissible:false,onClose:cleanup});
  if(run.cursor>=run.queue.length) await finishView();
}
function openFlashcardResult(runId){
  const run=state.flashcardRuns.find(r=>r.id===runId);if(!run)return;
  const events=state.flashcardResponses.filter(e=>e.runId===runId);
  openModal(close=>{
    const min=h('input',{type:'number',min:'1',max:'2880',value:Math.max(1,Math.round(run.elapsedMs/60000)),inputmode:'numeric'});
    const finalize=record=>once(()=>flashcardAction(async()=>{
      await FlashcardCommands.finish(runId,{record,minutes:record?Number(min.value):null});await refresh();close();toast(record?'Uma sessão de estudo registrada. As respostas continuam associadas a ela.':'Respostas preservadas. Nenhum tempo acrescentado ao Histórico.','ok');
    }));
    return {title:'O que você praticou',content:h('div',null,h('p',{text:plural(events.length,'direção respondida','direções respondidas')+' · '+Math.floor(run.elapsedMs/1000)+' segundos de prática ativa medidos.'}),
      h('p',{class:'hint',text:'Pausas ficam fora do tempo medido. Encerrar a janela preserva esta sessão para decidir depois.'}),
      h('dl',{class:'fc-result-grid'},FLASHCARD_RATINGS.map(r=>h('div',null,h('dt',{text:r.label}),h('dd',{text:events.filter(e=>e.rating===r.v).length})))),
      events.length?fcField('fc-result-min','Tempo líquido a registrar (minutos, ajustável)',min):null,
      h('p',{class:'hint',text:'Registrar tempo cria um único estudo, mesmo com várias disciplinas. Se já incluiu esta prática em outro registro, guarde apenas as respostas.'})),actions:[
        run.parentGuidedId?fcButton('Voltar ao roteiro',once(()=>flashcardAction(async()=>{await FlashcardCommands.finish(runId);await loadAll();close();await openGuidedReviewPlayer(run.parentGuidedId);})), 'primary'):fcButton('Guardar apenas respostas',finalize(false)),events.length&&!run.parentGuidedId?fcButton('Registrar uma sessão de estudo',finalize(true),'primary'):null]};
  },{dismissible:false});
}
function flashcardSessionDetail(sessionId){
  const runs=state.flashcardRuns.filter(r=>r.sessionId===sessionId);if(!runs.length)return null;
  const ids=new Set(runs.map(r=>r.id)),events=state.flashcardResponses.filter(e=>ids.has(e.runId));
  return h('details',{class:'disclosure'},h('summary',{text:plural(events.length,'cartão respondido','cartões respondidos')+' neste estudo'}),
    h('div',{class:'disclosure-body'},h('p',{class:'hint',text:'O tempo pertence ao estudo. Cada resposta é um evento com direção e agenda próprias.'}),
      FLASHCARD_RATINGS.map(r=>h('p',{text:r.label+': '+events.filter(e=>e.rating===r.v).length})),
      h('ul',null,events.slice(0,50).map(e=>h('li',null,h('button',{class:'linkbtn',type:'button',text:e.disciplineName+' · '+(e.direction==='reverse'?'Inversa':'Direta')+' · '+FLASHCARD_RATINGS.find(r=>r.v===e.rating)?.label,onclick:()=>openFlashcardNoteDetail(e.noteId)})))),
      events.length>50?h('p',{class:'hint',text:'As 50 primeiras respostas aparecem aqui; cada conteúdo tem seu histórico e o backup preserva todas.'}):null));
}
function flashcardStatsPanel(options={}){
  const stats=FlashcardModel.stats(options);
  return h('details',{class:'disclosure'},h('summary',{text:'Respostas de flashcards'+(options.from?' no período':' · todo o histórico')}),
    h('div',{class:'disclosure-body'},h('p',{text:plural(stats.total,'resposta registrada','respostas registradas')+' · '+stats.scheduled+' com agendamento e '+(stats.total-stats.scheduled)+' em prática livre.'}),
      h('dl',{class:'fc-result-grid'},stats.ratings.map(r=>h('div',null,h('dt',{text:r.label}),h('dd',{text:r.count})))),
      h('p',{class:'hint',text:'São autoavaliações registradas, não uma medida de domínio nem de memória restante. Cada direção conta separadamente.'})));
}
function openFlashcardPrimer(){
  let shown=false;
  openModal(close=>{
    const demo=h('div',{class:'fc-card'}),draw=()=>mount(demo,h('p',{class:'hint',text:'Demonstração · não grava estudos nem respostas'}),h('h3',{text:'Qual sinal encerra uma frase declarativa?'}),shown?
      h('div',null,h('p',{text:'Ponto-final.'}),h('p',{class:'hint',text:'Você conferiu sua tentativa. Agora escolheria “Não lembrei”, “Lembrei com dificuldade”, “Lembrei bem” ou “Muito fácil”. O Ciclo usa essa resposta para sugerir quando voltar.'})):fcButton('Mostrar resposta do exemplo',()=>{shown=true;draw();},'primary'));draw();
    return {title:'Como criar e usar bons flashcards',content:h('div',{class:'prose'},h('p',{text:'Depois de compreender uma ideia, tente recuperá-la sem consultar. Só então revele a resposta. Esse esforço permite perceber o que merece outra tentativa.'}),demo,
      h('h3',{text:'Uma pergunta que dá para conferir'}),h('p',{text:'“Explique tudo sobre Português” reúne ideias demais. Prefira algo específico, como “Qual sinal encerra uma frase declarativa?”. Use exemplos e respostas curtas quando fizer sentido.'}),
      h('ul',null,h('li',{text:'Termos: use definições precisas; a inversa só ajuda quando não é ambígua.'}),h('li',{text:'Idiomas: acrescente contexto e aceite traduções ou sinônimos válidos ao se avaliar.'}),h('li',{text:'Lacunas: esconda poucos trechos relevantes. Todas aparecem no mesmo cartão.'}),h('li',{text:'Problemas: tente resolver antes de conferir a solução; continue praticando exercícios reais.'}),h('li',{text:'Sequências: tente recuperar os passos e sua ordem antes de revelar.'})),
      h('h3',{text:'Espaçar é uma sugestão'}),h('p',{text:'O FSRS propõe datas a partir das respostas de cada direção. Cartões novos usam parâmetros gerais, sem ajuste pessoal por falta de histórico. As datas são estimativas, e você pode voltar depois de alguns dias sem compensar uma dívida.'}),
      h('p',{text:'Prática livre permite antecipar sem alterar a agenda. Dificuldade e esquecimento são avaliações diferentes. Editar preserva o histórico; suspender pausa a apresentação; arquivar guarda o conteúdo.'}),
      h('h3',{text:'Combine com outras formas de estudar'}),h('p',{text:'Recordar ajuda, mas não substitui escrever código, resolver problemas, produzir um idioma ou praticar um instrumento. A autoavaliação também tem limites: confira com seu material e com tarefas reais.'}),
      h('details',null,h('summary',{text:'Referências e limites'}),h('p',{text:'Roediger & Karpicke (2006): recuperação em testes de aprendizagem; Cepeda et al. (2006): revisão de prática distribuída. São resultados de pesquisa, não uma garantia individual.'}),
        h('a',{href:'https://doi.org/10.1111/j.1467-9280.2006.01693.x',target:'_blank',rel:'noopener',text:'Pesquisa sobre recuperação ativa'}),h('br'),h('a',{href:'https://doi.org/10.1037/0033-2909.132.3.354',target:'_blank',rel:'noopener',text:'Pesquisa sobre prática espaçada'}))),
      actions:[fcButton('Fechar',()=>close()),fcButton('Criar meu primeiro cartão',()=>{close();openFlashcardTypePicker();},'primary')]};
  },{size:'wide'});
}
