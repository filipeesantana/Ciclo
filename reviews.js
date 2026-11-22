/* Ciclo v7.3 — revisão livre e um roteiro durável. O motor de tópicos permanece
   no app.js. Não há cartões nativos nem outro algoritmo de agendamento. */
'use strict';

/** Contrato lógico 11, guardado na store meta existente. Rejeita conteúdo
 * inválido antes da restauração; não converte tópico ausente em outro assunto. */
function cleanGuidedReview(value){
  if(value == null) return null;
  const fail = () => { throw new Error('O roteiro de revisão está inválido. Nada foi restaurado.'); };
  if(typeof value !== 'object' || !value.id || typeof value.id !== 'string' || value.id.length>100 ||
     !Number.isInteger(value.rev) || value.rev<1 || !isStrictISODate(value.date) ||
     !Number.isFinite(value.elapsedMs) || value.elapsedMs<0 || value.elapsedMs>172800000 ||
     !Array.isArray(value.items) || !value.items.length || value.items.length>MAX_TOPICS_PER_STUDY ||
     !Number.isInteger(value.cursor) || value.cursor<0 || value.cursor>=value.items.length ||
     !Number.isInteger(value.budget) || value.budget<1 || value.budget>600 ||
     !(value.runningSince===null || (Number.isFinite(value.runningSince) && value.runningSince>0))) fail();
  const seen=new Set();
  const items=value.items.map(i=>{
    if(!i || typeof i.topicId!=='string' || !i.topicId || i.topicId.length>100 || seen.has(i.topicId) ||
       !CONCRETE_METHODS.includes(i.method) || !Number.isInteger(i.minutes) || i.minutes<1 || i.minutes>600 ||
       !['pending','done','skipped'].includes(i.status) ||
       !(i.outcome===null || REVIEW_OUTCOMES.some(o=>o.v===i.outcome)) || (i.status!=='done' && i.outcome!==null)) fail();
    seen.add(i.topicId);
    return {topicId:i.topicId,method:i.method,minutes:i.minutes,status:i.status,outcome:i.outcome};
  });
  if(items.reduce((n,i)=>n+i.minutes,0)>value.budget) fail();
  return {id:value.id,rev:value.rev,date:value.date,budget:value.budget,cursor:value.cursor,elapsedMs:value.elapsedMs,
    runningSince:value.runningSince,finishedAt:typeof value.finishedAt==='string'?value.finishedAt:null,
    sessionId:typeof value.sessionId==='string'?value.sessionId:null,items};
}
function guidedElapsed(d,at=Date.now()){
  return Math.min(172800000,d.elapsedMs+(d.runningSince ? Math.max(0,at-d.runningSince) : 0));
}
const GuidedReviewCommands={
  async create(items,budget){
    const draft=cleanGuidedReview({id:uid(),rev:1,date:todayISO(),budget,cursor:0,elapsedMs:0,runningSince:null,finishedAt:null,
      items:items.map(i=>({...i,status:'pending',outcome:null}))});
    await DB.atomic(['meta','topics','disciplines'],async api=>{
      const previous=(await api.get('meta','guidedReview'))?.value;
      if(previous&&!previous.finishedAt) throw new Error('Retome ou encerre o roteiro que já está guardado.');
      const discIds=new Set();
      for(const i of draft.items){const t=await api.get('topics',i.topicId);const d=t&&await api.get('disciplines',t.disciplineId);if(!t||t.archived||!d||d.archived)throw new Error('Um dos assuntos não está mais disponível. Atualize a proposta.');discIds.add(t.disciplineId);}
      if(discIds.size>MAX_DISCIPLINES_PER_STUDY)throw new Error('Escolha até '+MAX_DISCIPLINES_PER_STUDY+' disciplinas por roteiro.');
      await api.put('meta',{key:'guidedReview',value:draft});
    });
    this.changed(draft);return draft;
  },
  changed(draft){state.meta.guidedReview=draft;DataSync.send('data',['guidedReview']);},
  async read(){return cleanGuidedReview((await DB.get('meta','guidedReview'))?.value);},
  async update(draft,change){
    const next=await DB.atomic(['meta'],async api=>{
      const cur=(await api.get('meta','guidedReview'))?.value;
      if(!cur||cur.id!==draft.id||cur.rev!==draft.rev||cur.finishedAt)throw new Error('O roteiro mudou em outra aba. Feche esta janela e retome a versão atual.');
      const now=Date.now();cur.elapsedMs=guidedElapsed(cur,now);cur.runningSince=cur.runningSince?now:null;
      const value=change(cur);
      if(value.runningSince && ((await api.get('meta','activeTimer'))?.value || TimerService.currentRunId()))throw new Error('Pause ou finalize o cronômetro antes de continuar o roteiro.');
      value.rev++;const checked=cleanGuidedReview(value);await api.put('meta',{key:'guidedReview',value:checked});return checked;
    });this.changed(next);return next;
  },
  async finish(draft,minutes){
    if(!Number.isInteger(minutes)||minutes<1||minutes>2880)throw new Error('Informe de 1 a 2880 minutos líquidos.');
    const result=await DB.atomic(SessionCommands.STORES.concat('meta'),async api=>{
      const cur=(await api.get('meta','guidedReview'))?.value;
      if(!cur||cur.id!==draft.id)throw new Error('Roteiro não encontrado.');
      if(cur.finishedAt){
        if(!cur.sessionId)throw new Error('Este roteiro foi encerrado sem registrar estudo. Nada foi gravado.');
        return {duplicate:true,sessionId:cur.sessionId,draft:cur};
      }
      if(cur.rev!==draft.rev)throw new Error('O roteiro mudou em outra aba. Retome a versão atual antes de registrar.');
      if(cur.runningSince)throw new Error('Pause o roteiro antes de registrar.');
      const done=cur.items.filter(i=>i.status==='done');
      if(!done.length)throw new Error('Conclua pelo menos uma atividade ou guarde o roteiro para depois.');
      const topics=[],ids=[];
      for(const i of done){
        const t=await api.get('topics',i.topicId);
        if(!t||!(await api.get('disciplines',t.disciplineId)))throw new Error('Um assunto foi excluído. Volte ao roteiro e pule essa atividade.');
        if(!ids.includes(t.disciplineId))ids.push(t.disciplineId);
        topics.push({topicId:t.id,disciplineId:t.disciplineId,minutes:null,outcome:i.outcome,strategy:null});
      }
      if(ids.length>MAX_DISCIPLINES_PER_STUDY)throw new Error('O roteiro excede o limite de disciplinas por estudo.');
      const session=newSession({id:'guided:'+cur.id,disciplineId:ids[0],disciplineEntries:ids.map(disciplineId=>({disciplineId,minutes:null})),
        topicEntries:topics,date:cur.date,minutes,types:['revisao'],reviewMethod:done.every(i=>i.method===done[0].method)?done[0].method:null,comment:'',breaks:[]});
      const chk=await SessionCommands._check(api,session);
      if(!chk.ok||chk.droppedTopics||chk.droppedDiscs)throw new Error('Os assuntos mudaram. Retome o roteiro.');
      // Cada tópico recebe apenas o próprio resultado. Sem resposta, seu estudo
      // é registrado, mas nenhuma autoavaliação é inventada pelo Ciclo.
      for(const e of session.topicEntries){const topic=chk.topics.get(e.topicId),ctx=reviewContextOf(topic);e.strategy=ctx.strategy;
        await api.put('topics',TopicReconciler.afterCreate(topic,SessionModel.topicView(session,topic.id),ctx).topic);}
      await api.add('sessions',session);
      cur.finishedAt=nowISO();cur.sessionId=session.id;cur.rev++;
      await api.put('meta',{key:'guidedReview',value:cur});return {sessionId:session.id,draft:cur};
    });this.changed(result.draft);return result;
  }
};
function reviewButton(text,run,kind='ghost'){return h('button',{type:'button',class:'btn '+kind,text,onclick:run});}
function reviewField(id,label,input){input.id=id;return h('div',{class:'field'},h('label',{for:id,text:label}),input);}
function reviewSelect(id,label,options,value,onChange){
  const node=h('select',{id,onchange:()=>onChange?.(node.value)},options.map(([v,text])=>h('option',{value:v,text,selected:v===value})));
  return {node,field:reviewField(id,label,node)};
}
async function reviewAction(run){try{return await run();}catch(e){console.error(e);toast(e.message||'Não foi possível salvar. Seu progresso continua guardado.','err');return null;}}
function reviewResumeButton(){const d=state.meta.guidedReview;return d&&!d.finishedAt?reviewButton('Retomar roteiro guardado',()=>openGuidedReviewPlayer(d.id)):null;}
function openFreeReview(){
  if(!activeDisciplines().length){openDisciplineModal(null);return;}
  // A seleção multidisciplinar já pertence ao formulário canônico: nenhuma
  // janela intermediária é necessária para escolher as mesmas informações.
  openRegisterModal({mode:'timer',types:['revisao']});
}
function openGuidedReviewBuilder(availableMinutes=20){
  const existing=state.meta.guidedReview;if(existing&&!existing.finishedAt){openGuidedReviewPlayer(existing.id);return;}
  let budget=clamp(Math.round(Number(availableMinutes))||20,1,600),chosen=[];
  const discs=new Set(activeDisciplines().map(d=>d.id));let saving=false;
  openModal(close=>{
    const preview=h('div',{class:'guided-plan'}),total=h('p',{class:'hint',role:'status'});
    const minutes=h('input',{type:'number',min:'1',max:'600',inputmode:'numeric',value:budget});
    const build=()=>{
      const n=Number(minutes.value);if(!Number.isInteger(n)||n<1||n>600){minutes.focus();toast('Informe de 1 a 600 minutos.','err');return;}
      budget=n;chosen=[];let left=budget;const selected=new Set();
      for(const e of ReviewEngine.rankedQueue().filter(e=>discs.has(e.topic.disciplineId))){
        if(left<=0||chosen.length>=MAX_TOPICS_PER_STUDY)break;
        if(!selected.has(e.topic.disciplineId)&&selected.size>=MAX_DISCIPLINES_PER_STUDY)continue;
        selected.add(e.topic.disciplineId);
        const method=ReviewEngine.effectiveMethod(e.topic).method,duration=Math.min(left,ReviewEngine.estimateMinutes(e.topic,method));
        chosen.push({topicId:e.topic.id,method,minutes:duration});left-=duration;
      }draw();
    };
    const add=reviewSelect('guided-add','Adicionar assunto',[['','Escolha um assunto'],...state.topics.filter(t=>!t.archived&&!getDiscipline(t.disciplineId)?.archived).map(t=>[t.id,disciplineName(t.disciplineId)+' — '+t.name])],'',v=>{
      if(!v)return;if(chosen.some(i=>i.topicId===v)){toast('Este assunto já está no roteiro.','info');return;}
      const t=getTopic(v);
      if(new Set(chosen.map(i=>getTopic(i.topicId)?.disciplineId).concat(t.disciplineId)).size>MAX_DISCIPLINES_PER_STUDY){toast('Escolha até '+MAX_DISCIPLINES_PER_STUDY+' disciplinas por roteiro.','info');return;}
      chosen.push({topicId:v,method:ReviewEngine.effectiveMethod(t).method,minutes:Math.min(5,budget)});add.node.value='';draw();
    });
    const updateTotal=()=>{const n=chosen.reduce((n,i)=>n+(Number(i.minutes)||0),0);total.textContent=`${plural(chosen.length,'assunto','assuntos')} · ${n} min propostos de ${budget} min disponíveis.`+(n>budget?' Ajuste as durações para caber no tempo.':'');};
    function draw(focusId){
      clear(preview);
      if(!chosen.length)preview.append(h('p',{class:'quiet-empty',text:'Sem assuntos sugeridos nesta seleção. Adicione um tópico ou faça uma revisão livre, sem tópicos.'}));
      chosen.forEach((item,index)=>{
        const t=getTopic(item.topicId);if(!t)return;
        const method=reviewSelect('guided-method-'+index,'Método de '+t.name,CONCRETE_METHODS.map(m=>[m,methodLabel(m)]),item.method,v=>{item.method=v;});
        const duration=h('input',{type:'number',min:'1',max:'600',value:item.minutes,inputmode:'numeric',oninput:e=>{item.minutes=Number(e.target.value);updateTotal();}});
        const move=(delta)=>{const next=index+delta;if(next<0||next>=chosen.length)return;[chosen[index],chosen[next]]=[chosen[next],chosen[index]];draw('guided-method-'+next);};
        const up=reviewButton('Subir',()=>move(-1));up.id='guided-up-'+index;up.disabled=index===0;up.setAttribute('aria-label','Subir '+t.name);
        const down=reviewButton('Descer',()=>move(1));down.disabled=index===chosen.length-1;down.setAttribute('aria-label','Descer '+t.name);
        preview.append(h('section',{class:'guided-item','aria-label':t.name},h('h4',{text:`${index+1}. ${t.name}`}),h('p',{class:'hint',text:disciplineName(t.disciplineId)}),
          h('div',{class:'guided-fields'},method.field,reviewField('guided-duration-'+index,'Duração sugerida (min)',duration)),
          h('div',{class:'tf-actions'},up,down,reviewButton('Remover assunto',()=>{chosen.splice(index,1);draw();add.node.focus();}))));
      });updateTotal();if(focusId)document.getElementById(focusId)?.focus();
    }
    minutes.addEventListener('input',()=>{const n=Number(minutes.value);if(Number.isInteger(n)&&n>=1&&n<=600){budget=n;updateTotal();}});
    const start=reviewButton('Começar roteiro',async()=>{
      if(saving)return;saving=true;start.disabled=true;
      try{await reviewAction(async()=>{const d=await GuidedReviewCommands.create(chosen,Number(minutes.value));close();await openGuidedReviewPlayer(d.id);});}
      finally{saving=false;start.disabled=false;}
    },'primary');
    build();
    return {title:'Monte sua revisão guiada',content:h('div',{class:'guided-builder'},
      h('p',{class:'modal-sub',text:'Uma proposta a partir dos assuntos disponíveis, prioridades, resultados anteriores e prazos. Ajuste o que quiser antes de começar.'}),
      h('div',{class:'chips'},[10,20,30].map(v=>h('button',{type:'button',class:'chip',text:v+' min',onclick:()=>{minutes.value=v;build();}}))),
      reviewField('guided-budget','Tempo disponível (minutos)',minutes),
      h('details',{class:'disclosure'},h('summary',{text:'Escolher disciplinas da proposta'}),h('div',{class:'disclosure-body'},activeDisciplines().map(d=>h('label',{class:'guided-check'},h('input',{type:'checkbox',checked:true,onchange:e=>{if(e.target.checked)discs.add(d.id);else discs.delete(d.id);}}),d.name)))),
      reviewButton('Atualizar proposta',build),add.field,total,preview),actions:[reviewButton('Cancelar',()=>close()),start]};
  },{size:'wide review'});
}
async function openGuidedReviewPlayer(id){
  let draft=await reviewAction(()=>GuidedReviewCommands.read());if(!draft||draft.id!==id||draft.finishedAt)return;
  let busy=false,tick,closed=false;
  openModal(close=>{
    const body=h('div',{class:'guided-player'});
    const change=async mutate=>{
      if(busy)return;busy=true;body.setAttribute('aria-busy','true');
      const focused=document.activeElement?.id, cursor=draft.cursor;
      body.querySelectorAll('button,select').forEach(el=>el.disabled=true);
      try{const next=await reviewAction(()=>GuidedReviewCommands.update(draft,mutate));if(next){draft=next;draw();if(cursor!==draft.cursor)body.querySelector('h3')?.focus();else if(focused)document.getElementById(focused)?.focus();return true;}return false;}finally{busy=false;body.removeAttribute('aria-busy');body.querySelectorAll('button,select').forEach(el=>el.disabled=false);}
    };
    const clock=()=>{const c=body.querySelector('.guided-clock');if(c)c.textContent=fmtTimer(guidedElapsed(draft));};
    function draw(){
      if(closed)return;
      const item=draft.items[draft.cursor],t=getTopic(item.topicId),guide=ReviewEngine.methodGuide(item.method);
      const outcome=reviewSelect('guided-outcome','Como foi este assunto? (opcional)',[['','Sem autoavaliação'],...REVIEW_OUTCOMES.map(o=>[o.v,o.label])],item.outcome||'',v=>change(r=>{const i=r.items[r.cursor];i.outcome=v||null;i.status='done';return r;}));
      const method=reviewSelect('guided-current-method','Método',CONCRETE_METHODS.map(m=>[m,methodLabel(m)]),item.method,v=>change(r=>{r.items[r.cursor].method=v;return r;}));
      const advance=(r)=>{r.cursor=Math.min(r.items.length-1,r.cursor+1);return r;};
      const completed=draft.items.filter(i=>i.status==='done').length;
      mount(body,h('p',{class:'hint',role:'status',text:`Assunto ${draft.cursor+1} de ${draft.items.length} · ${completed} realizados · ${draft.items.filter(i=>i.status==='skipped').length} pulados`}),
        h('h3',{tabindex:'-1',text:t?.name||'Assunto excluído'}),h('p',{class:'hint',text:t?disciplineName(t.disciplineId)+' · '+item.minutes+' min sugeridos':'Pule este assunto para continuar.'}),
        h('p',{class:'guided-time'},h('span',{text:draft.runningSince?'Tempo estudado':'Pausado · tempo estudado'}),h('span',{class:'guided-clock num','aria-live':'off'})),
        reviewButton(draft.runningSince?'Pausar':'Continuar roteiro',()=>change(r=>{r.runningSince=r.runningSince?null:Date.now();return r;}),'primary'),
        method.field,
        item.method==='flashcards'?h('p',{class:'hint',text:'Use seus próprios flashcards, físicos ou de outra ferramenta. Ao terminar, avalie este assunto se quiser.'}):null,
        h('ol',{class:'method-steps'},(guide?.steps||[]).slice(0,4).map(step=>h('li',{text:step}))),
        t?outcome.field:null,
        h('p',{class:'hint',text:item.status==='done'?'Atividade realizada. Você pode ajustar a resposta antes de registrar.':item.status==='skipped'?'Atividade pulada: não altera a agenda deste assunto.':'Marque como realizada somente depois de revisar. A autoavaliação é opcional.'}),
        h('div',{class:'tf-actions'},
          draft.cursor?reviewButton('Voltar ao assunto anterior',()=>change(r=>{r.cursor--;return r;})):null,
          reviewButton('Pular assunto',()=>change(r=>{r.items[r.cursor].status='skipped';r.items[r.cursor].outcome=null;return advance(r);})),
          t?reviewButton('Concluir assunto e continuar',()=>change(r=>{r.items[r.cursor].status='done';return advance(r);})):null));clock();
    }
    draw();tick=setInterval(clock,1000);
    const saveAndClose=async()=>{if(busy)return;const ok=await change(r=>{r.runningSince=null;return r;});if(ok){close();await safeRefresh();}};
    return {title:'Sua revisão guiada',content:body,actions:[reviewButton('Guardar e sair',saveAndClose),reviewButton('Encerrar roteiro',async()=>{
      if(busy)return;const ok=await change(r=>{r.runningSince=null;return r;});if(!ok)return;close();await safeRefresh();openGuidedReviewResult(draft);
    })]};
  },{size:'wide review',dismissible:false,onClose:()=>{closed=true;clearInterval(tick);}});
}
function openGuidedReviewResult(draft){
  let saving=false;
  openModal(close=>{
    const done=draft.items.filter(i=>i.status==='done');
    const minutes=h('input',{type:'number',min:'1',max:'2880',inputmode:'numeric',value:Math.max(1,Math.round(guidedElapsed(draft)/60000))});
    const finish=reviewButton('Registrar uma revisão',async()=>{
      if(saving)return;saving=true;finish.disabled=true;
      try{await reviewAction(async()=>{const r=await GuidedReviewCommands.finish(draft,Number(minutes.value));close();await safeRefresh();toast(r.duplicate?'Esta revisão já foi registrada.':'Uma revisão registrada, com os resultados individuais.','ok');});}
      finally{saving=false;finish.disabled=false;}
    },'primary');finish.disabled=!done.length;
    return {title:'Registrar a revisão guiada',content:h('div',null,
      h('p',{text:plural(done.length,'assunto realizado','assuntos realizados')+'. Assuntos pulados e pendentes ficam fora do registro.'}),
      h('ul',null,done.map(i=>h('li',{text:(getTopic(i.topicId)?.name||'Assunto excluído')+' · '+(i.outcome?reviewOutcomeLabel(i.outcome):'sem autoavaliação')}))),
      reviewField('guided-result-minutes','Tempo total líquido (minutos, ajustável)',minutes),
      h('p',{class:'hint',text:'Um estudo só, mesmo com várias disciplinas. Pausas não entram no tempo. A data é a do início do roteiro: '+fmtDateBR(draft.date)+'.'})),
      actions:[reviewButton('Voltar ao roteiro',()=>{close();openGuidedReviewPlayer(draft.id);}),reviewButton('Guardar para depois',()=>close()),
        reviewButton('Encerrar sem registrar',async()=>{
          if(saving)return;
          if(!(await confirmStudySubview(close,'Encerrar este roteiro sem registrar estudo nem alterar as agendas?','Encerrar sem registrar')))return;
          saving=true;try{await reviewAction(async()=>{await GuidedReviewCommands.update(draft,r=>{r.finishedAt=nowISO();return r;});close();await safeRefresh();});}finally{saving=false;}
        }),finish]};
  },{size:'wide review',dismissible:false});
}

/* Agenda escolhida pela pessoa, independente do histórico e do algoritmo. */
const ReviewSchedule = {
  clean(value){
    if(value?.mode === 'free' || value?.mode === 'off') return {mode:value.mode};
    if(value?.mode === 'date' && isStrictISODate(value.date)) return {mode:'date', date:value.date};
    return null;
  },
  due(topic){
    if(!topic) return null;
    const schedule = topic.reviewSchedule;
    if(schedule?.mode === 'date') return schedule.date;
    if(schedule?.mode === 'free' || schedule?.mode === 'off' || !topic.reviewEnabled) return null;
    return topic.reviewDueDate || null;
  },
  kind(topic){
    return topic.reviewSchedule?.mode || (topic.reviewEnabled ? 'auto' : 'off');
  },
  label(topic){
    const date = this.due(topic);
    if(date) return (this.kind(topic) === 'date' ? 'Programada' : 'Sugestão automática') + ' · ' + fmtDateBR(date);
    const kind = this.kind(topic);
    if(kind === 'free') return 'Sem data · revisão livre';
    if(kind === 'off') return 'Sugestões desativadas';
    return 'Agenda automática';
  },
  resolve(choice, date, ref = today()){
    if(choice === 'tomorrow') return {mode:'date', date:dateToISO(addDays(ref, 1))};
    if(choice === 'week') return {mode:'date', date:dateToISO(addDays(startOfWeek(ref), 7))};
    if(choice === 'auto') return {mode:'auto'};
    return this.clean({mode:choice, date});
  },
  apply(topic, schedule){
    const next = {...topic, updatedAt:nowISO()};
    delete next.reviewSnooze;
    if(schedule.mode === 'auto'){
      delete next.reviewSchedule;
      next.reviewEnabled = true;
      const anchor = next.lastReviewedAt || next.firstStudiedAt;
      if(anchor && !next.reviewDueDate){
        const interval = next.reviewIntervalDays || ReviewEngine.firstInterval(ReviewEngine.effectiveStrategy(next));
        next.reviewIntervalDays = interval;
        next.reviewDueDate = addDaysISO(anchor, interval);
      }
    } else next.reviewSchedule = schedule;
    return next;
  },
  async setMany(ids, schedule){
    const value = schedule?.mode === 'auto' ? {mode:'auto'} : this.clean(schedule);
    const unique = [...new Set(ids)];
    if(!value || !unique.length) throw new Error('Escolha os assuntos e uma opção de agendamento.');
    await DB.atomic(['topics','disciplines'], async api => {
      const topics = [];
      const disciplines = new Map();
      for(const id of unique){
        const topic = await api.get('topics', id);
        if(!topic || topic.archived) throw new Error('Um assunto foi arquivado ou excluído. Atualize a seleção.');
        if(!disciplines.has(topic.disciplineId)){
          disciplines.set(topic.disciplineId, await api.get('disciplines', topic.disciplineId));
        }
        const disc = disciplines.get(topic.disciplineId);
        if(!disc || disc.archived) throw new Error('Uma disciplina foi arquivada ou excluída. Atualize a seleção.');
        topics.push(topic);
      }
      for(const topic of topics) await api.put('topics', this.apply(topic, value));
    });
    return unique.length;
  }
};

function reviewScheduleField(prefix, initial, placeholder){
  const choices = [['tomorrow','Amanhã'], ['week','Próxima semana'], ['date','Escolher uma data'],
    ['free','Sem data definida'], ['off','Não sugerir'], ['auto','Reativar agenda automática']];
  const select = reviewSelect(prefix + '-policy', 'Agendamento', [['',placeholder], ...choices], initial?.choice || '', update);
  const date = h('input', {type:'date', value:initial?.date || '',oninput:e => e.target.removeAttribute('aria-invalid')});
  const dateField = reviewField(prefix + '-date', 'Data da revisão', date);
  const help = h('p', {class:'hint', 'aria-live':'polite'});
  const node = h('div', {class:'review-schedule-fields'}, select.field, dateField, help);
  function update(){
    const choice = select.node.value;
    const resolved = ReviewSchedule.resolve(choice, date.value);
    dateField.hidden = choice !== 'date';
    help.textContent = choice === 'auto' ? 'O Ciclo volta a calcular sugestões a partir dos estudos e resultados deste assunto.'
      : choice === 'free' ? 'O assunto fica disponível para seleção manual, sem vencimento.'
      : choice === 'off' ? 'O assunto sai das sugestões. Você ainda pode revisá-lo quando quiser.'
      : (choice === 'tomorrow' || choice === 'week') && resolved ? fmtDateBR(resolved.date) : '';
    node.dispatchEvent(new Event('input', {bubbles:true}));
  }
  update();
  return {
    node, select:select.node,
    get snapshot(){ return {choice:select.node.value, date:date.value}; },
    read(){
      if(!select.node.value) return {ok:true, value:null};
      const value = ReviewSchedule.resolve(select.node.value, date.value);
      if(!value){
        date.setAttribute('aria-invalid','true'); date.focus();
        toast('Escolha uma data válida.', 'err');
      }
      return {ok:!!value, value};
    }
  };
}

function openReviewSchedule(ids){
  const topics = ids.map(getTopic).filter(Boolean);
  if(!topics.length) return;
  openModal(close => {
    const field = reviewScheduleField('agenda', null, 'Escolha uma opção');
    const save = reviewButton('Salvar agendamento', async () => {
      const result = field.read();
      if(!result.ok || !result.value) { if(result.ok) field.select.focus(); return; }
      save.disabled = true;
      try {
        const count = await reviewAction(() => ReviewSchedule.setMany(topics.map(t => t.id), result.value));
        if(count){
          close();
          await safeRefresh();
          toast(plural(count, 'assunto atualizado', 'assuntos atualizados'), 'ok', {title:'Agenda atualizada'});
        }
      } finally { save.disabled = false; }
    }, 'primary');
    return {
      title:topics.length === 1 ? 'Agendar revisão' : 'Agendar em lote',
      content:h('div', null, h('p', {class:'modal-sub', text:topics.length === 1 ? topics[0].name : plural(topics.length, 'assunto selecionado', 'assuntos selecionados')}), field.node),
      actions:[reviewButton('Cancelar', () => close()), save], focus:field.select
    };
  }, {size:'narrow'});
}

function studyReviewSchedule(prefix, initial){
  const field = reviewScheduleField(prefix + '-agenda', initial, 'Manter agenda dos assuntos');
  const node = h('details', {class:'disclosure study-review-schedule', hidden:true, open:!!initial?.choice},
    h('summary', {text:'Agendar revisão dos tópicos'}), h('div', {class:'disclosure-body'}, field.node));
  return {
    node,
    get snapshot(){return field.snapshot;},
    read(){
      if(node.hidden) return {ok:true, value:null};
      if(field.snapshot.choice === 'date') node.open = true;
      return field.read();
    }
  };
}

function reviewAgendaCard(){
  const available = state.topics.filter(t => !t.archived && getDiscipline(t.disciplineId) && !getDiscipline(t.disciplineId).archived);
  if(!available.length) return null;
  const agenda = ui.reviewAgenda ||= {query:'', filter:'all', discipline:'', page:0, selected:new Set()};
  const day = todayISO();
  const order = date => date === day ? 0 : !date ? 3 : date > day ? 1 : 2;
  const sorted = available.map(t => {
    const date = ReviewSchedule.due(t);
    return {topic:t, date, kind:ReviewSchedule.kind(t), priority:order(date),
      key:normalizeText(t.name + ' ' + disciplineName(t.disciplineId))};
  }).sort((a,b) => a.priority - b.priority ||
    (a.date || '').localeCompare(b.date || '') * (a.priority === 2 ? -1 : 1) || sortByName(a.topic,b.topic));
  const availableIds = new Set(available.map(t => t.id));
  for(const id of agenda.selected) if(!availableIds.has(id)) agenda.selected.delete(id);
  const results = h('div', {class:'review-agenda-results'});
  const selection = h('p', {class:'hint', role:'status'});
  const search = h('input', {id:'agenda-search', type:'search', value:agenda.query, placeholder:'Tópico ou disciplina'});
  const sort = reviewSelect('agenda-filter','Mostrar', [['all','Todos os assuntos'],['today','Marcados para hoje'],
    ['dated','Com data'],['free','Sem data definida'],['off','Sem sugestões']], agenda.filter, value => {
    agenda.filter = value; agenda.page = 0; draw();
  });
  const subjects = activeDisciplines().filter(d => topicsOf(d.id).length).slice().sort(sortByName);
  const discipline = reviewSelect('agenda-discipline','Disciplina', [['','Todas as disciplinas'], ...subjects.map(d => [d.id,d.name])], agenda.discipline, value => {
    agenda.discipline = value; agenda.page = 0; draw();
  });
  search.addEventListener('input', () => {agenda.query = search.value; agenda.page = 0; draw();});
  const checked = () => [...agenda.selected].filter(id => availableIds.has(id));
  const schedule = reviewButton('Agendar seleção', () => openReviewSchedule(checked()));
  const revise = reviewButton('Revisar seleção', () => {
    const topics = checked().map(getTopic).filter(Boolean);
    const ids = [...new Set(topics.map(t => t.disciplineId))];
    if(topics.length > MAX_TOPICS_PER_STUDY || ids.length > MAX_DISCIPLINES_PER_STUDY){
      toast(`Escolha até ${MAX_TOPICS_PER_STUDY} assuntos e ${MAX_DISCIPLINES_PER_STUDY} disciplinas para uma sessão.`, 'info');
      return;
    }
    openRegisterModal({mode:'timer', disciplineIds:ids, topicIds:topics.map(t => t.id), types:['revisao']});
  }, 'primary');
  const clearSelection = reviewButton('Limpar seleção', () => {agenda.selected.clear(); draw(); search.focus();});
  const updateSelection = () => {
    const n = checked().length;
    selection.textContent = n ? plural(n, 'assunto selecionado', 'assuntos selecionados') : 'Escolha assuntos para revisar ou agendar juntos.';
    schedule.disabled = revise.disabled = clearSelection.disabled = !n;
  };
  const limit = 12;
  function draw(){
    const terms = normalizeText(agenda.query).split(' ').filter(Boolean);
    const matches = sorted.filter(e => {
      if(agenda.discipline && e.topic.disciplineId !== agenda.discipline) return false;
      if(terms.length && !matchesTerms(e.key, terms)) return false;
      return agenda.filter === 'all' || (agenda.filter === 'today' && e.date === day)
        || (agenda.filter === 'dated' && !!e.date) || agenda.filter === e.kind;
    });
    const pageCount = Math.max(1, Math.ceil(matches.length / limit));
    agenda.page = Math.min(agenda.page, pageCount - 1);
    const visible = matches.slice(agenda.page * limit, (agenda.page + 1) * limit);
    const mark = h('input', {type:'checkbox'});
    const syncMark = () => {
      const count = matches.filter(e => agenda.selected.has(e.topic.id)).length;
      mark.checked = !!matches.length && count === matches.length;
      mark.indeterminate = count > 0 && !mark.checked;
    };
    mark.disabled = !matches.length;
    syncMark();
    const boxes = new Map();
    mark.addEventListener('change', () => {
      for(const {topic} of matches){
        if(mark.checked) agenda.selected.add(topic.id); else agenda.selected.delete(topic.id);
        if(boxes.has(topic.id)) boxes.get(topic.id).checked = mark.checked;
      }
      updateSelection();
    });
    const list = h('ul', {class:'review-agenda-list'}, visible.map(({topic, date}) => {
      const checkbox = h('input', {type:'checkbox', checked:agenda.selected.has(topic.id), onchange:() => {
        if(checkbox.checked) agenda.selected.add(topic.id); else agenda.selected.delete(topic.id);
        syncMark();updateSelection();
      }});
      boxes.set(topic.id, checkbox);
      return h('li', {class:'review-agenda-row'},
        h('label', {class:'review-agenda-topic'}, checkbox,
          h('span', null, h('strong', {text:topic.name}),
            h('small', {text:disciplineName(topic.disciplineId) + ' · ' + (date ? reviewWhenText(topic) : ReviewSchedule.label(topic))}))),
        h('div', {class:'review-agenda-row-actions'},
          h('button', {class:'btn ghost sm', type:'button', text:'Revisar', 'aria-label':'Revisar ' + topic.name, onclick:() => startReview(topic.id)}),
          h('button', {class:'btn ghost sm', type:'button', text:'Agendar', 'aria-label':'Agendar ' + topic.name, onclick:() => openReviewSchedule([topic.id])})));
    }));
    const paginate = delta => {
      agenda.page += delta;
      draw();
      results.querySelector(delta > 0 ? '.agenda-next:not(:disabled)' : '.agenda-prev:not(:disabled)')?.focus();
      if(!results.contains(document.activeElement)) results.querySelector('input')?.focus();
    };
    const prev = reviewButton('Anterior', () => paginate(-1)); prev.disabled = agenda.page === 0; prev.classList.add('agenda-prev');
    const next = reviewButton('Próxima', () => paginate(1)); next.disabled = agenda.page + 1 >= pageCount; next.classList.add('agenda-next');
    mount(results, matches.length ? [
      h('label', {class:'review-agenda-select'}, mark, plural(matches.length, 'Selecionar o assunto encontrado', 'Selecionar os assuntos encontrados')),
      list,
      pageCount > 1 ? h('div', {class:'review-agenda-page'}, prev, h('span', {class:'hint', text:`${agenda.page + 1} de ${pageCount}`}), next) : null
    ] : h('p', {class:'quiet-empty', text:'Nenhum assunto neste recorte.'}));
    updateSelection();
  }
  draw();
  return h('section', {class:'review-agenda today-card','aria-labelledby':'review-agenda-title'},
    h('h3', {class:'block-label', id:'review-agenda-title', text:'Agenda e assuntos'}),
    h('div', {class:'review-agenda-controls'}, reviewField('agenda-search','Buscar assunto',search), sort.field, discipline.field),
    h('div', {class:'review-agenda-selection'}, selection, h('div', {class:'tf-actions'}, revise, schedule, clearSelection)),
    results);
}
