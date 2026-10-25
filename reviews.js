/* Revisões v7.3. Os algoritmos de tópicos continuam no ReviewEngine.
   O roteiro é um rascunho durável em guidedReviews; ao encerrar, um único comando
   registra o tempo total e somente os resultados explicitamente concluídos. */
'use strict';
function reviewDrafts(){ return (state.guidedReviews||[]).filter(v=>!v.finishedAt); }
const GuidedReviewCommands = {
  async create(items,budget){
    if(!Array.isArray(items)||!items.length||items.length>MAX_TOPICS_PER_STUDY||new Set(items.map(i=>i.topicId)).size!==items.length||items.some(i=>!getTopic(i.topicId)||!CONCRETE_METHODS.includes(i.method)||!Number.isInteger(i.minutes)||i.minutes<1||i.minutes>600)) throw flashcardError('Escolha assuntos distintos, métodos e durações válidas.');
    const draft={id:uid(),rev:1,date:todayISO(),createdAt:nowISO(),budget,cursor:0,elapsedMs:0,finishedAt:null,
      items:items.map(i=>({topicId:i.topicId,method:i.method,minutes:i.minutes,status:'pending',outcome:null,runId:null}))};
    await DB.put('guidedReviews',draft);return draft;
  },
  async claim(id){
    return DB.atomic(['guidedReviews'],async api=>{
      const cur=await api.get('guidedReviews',id);
      if(!cur||cur.finishedAt) throw flashcardError('Este roteiro já foi encerrado.');
      if(cur.owner && cur.owner!==practiceOwner() && cur.leaseUntil>Date.now() && !practiceLocks.has('guided:'+id)) throw flashcardError('Este roteiro está aberto em outra aba. Continue por lá ou aguarde até 30 segundos após fechá-la.');
      cur.owner=practiceOwner();cur.leaseUntil=Date.now()+30000;await api.put('guidedReviews',cur);return cur;
    });
  },
  async release(id){
    return DB.atomic(['guidedReviews'],async api=>{const cur=await api.get('guidedReviews',id);if(cur&&cur.owner===practiceOwner())await api.put('guidedReviews',{...cur,owner:null,leaseUntil:0});});
  },
  async closeWithoutStudy(draft){
    return DB.atomic(['guidedReviews','flashcardRuns'],async api=>{
      const cur=await api.get('guidedReviews',draft.id);
      if(!cur||cur.finishedAt)return cur;
      if(cur.rev!==draft.rev)throw flashcardError('O roteiro mudou em outra aba. Retome a versão atual.');
      if(cur.owner&&cur.owner!==practiceOwner()&&cur.leaseUntil>Date.now())throw flashcardError('Este roteiro está aberto em outra aba.');
      cur.finishedAt=nowISO();cur.withoutStudy=true;cur.rev++;
      await api.put('guidedReviews',cur);
      for(const run of await api.getAll('flashcardRuns')) if(run.parentGuidedId===cur.id&&!run.finishedAt)await api.put('flashcardRuns',{...run,finishedAt:cur.finishedAt,status:'finished'});
      return cur;
    });
  },
  async update(draft,change){
    return DB.atomic(['guidedReviews'],async api=>{
      const cur=await api.get('guidedReviews',draft.id);
      if(!cur || cur.finishedAt || cur.rev!==draft.rev) throw flashcardError('Este roteiro mudou em outra aba. Retome a versão atual.');
      if(cur.owner && cur.owner!==practiceOwner() && cur.leaseUntil>Date.now()) throw flashcardError('Este roteiro está sendo usado em outra aba.');
      const next=change(JSON.parse(JSON.stringify(cur)));next.rev=cur.rev+1;
      next.owner=practiceOwner();next.leaseUntil=Date.now()+30000;
      await api.put('guidedReviews',next);return next;
    });
  },
  async finish(draft,minutes){
    if(!Number.isInteger(minutes)||minutes<1||minutes>2880) throw flashcardError('Informe de 1 a 2880 minutos líquidos.');
    return DB.atomic(SessionCommands.STORES.concat(['meta','flashcardRuns','flashcardResponses','guidedReviews']),async api=>{
      const cur=await api.get('guidedReviews',draft.id);
      if(!cur) throw flashcardError('Roteiro não encontrado.');
      if(cur.finishedAt) return {duplicate:true,sessionId:cur.sessionId};
      if(cur.rev!==draft.rev) throw flashcardError('O roteiro mudou em outra aba. Retome a versão atual.');
      if(cur.owner && cur.owner!==practiceOwner() && cur.leaseUntil>Date.now()) throw flashcardError('Este roteiro está sendo usado em outra aba.');
      if(TimerService.isActive || (await api.get('meta','activeTimer'))?.value) throw flashcardError('Finalize o cronômetro antes de registrar o tempo deste roteiro.');
      const done=cur.items.filter(i=>i.status==='done');
      if(!done.length) throw flashcardError('Conclua ao menos uma atividade, ou guarde o roteiro para depois.');
      const topics=[];const discIds=new Set();const runs=[];
      for(const item of done){
        const topic=await api.get('topics',item.topicId);
        if(!topic) throw flashcardError('Um assunto foi excluído. Retome o roteiro e pule essa atividade antes de registrar.');
        if(item.method==='flashcards'){
          const run=item.runId && await api.get('flashcardRuns',item.runId);
          if(!run) throw flashcardError('A atividade de cartões não tem respostas associadas.');
          const events=await api.getAllByIndex('flashcardResponses','runId',run.id);
          if(!events.length) throw flashcardError('Esta atividade de cartões ainda não tem respostas.');
          if(run.sessionId) throw flashcardError('Os cartões desta atividade já pertencem a outro estudo.');
          runs.push(run); // Nenhum resultado de tópico é inferido das respostas de cartões.
        }else{
          if(!REVIEW_OUTCOMES.some(o=>o.v===item.outcome)) throw flashcardError('Escolha o resultado de cada assunto concluído.');
          topics.push({topicId:topic.id,disciplineId:topic.disciplineId,minutes:null,outcome:item.outcome,strategy:null});
        }
        discIds.add(topic.disciplineId);
      }
      const ids=Array.from(discIds);
      const session=newSession({id:'guided:'+draft.id,disciplineId:ids[0],disciplineEntries:ids.map(disciplineId=>({disciplineId,minutes:null})),
        topicEntries:topics,date:cur.date,minutes,types:['revisao'],reviewMethod:done.every(i=>i.method===done[0].method)?done[0].method:null,comment:'',breaks:[]});
      const checked=await SessionCommands._check(api,session);
      if(!checked.ok || checked.droppedTopics || checked.droppedDiscs) throw flashcardError('Os assuntos ou disciplinas mudaram. Retome o roteiro para atualizar.');
      for(const e of session.topicEntries){
        const topic=checked.topics.get(e.topicId),ctx=reviewContextOf(topic);e.strategy=ctx.strategy;
        await api.put('topics',TopicReconciler.afterCreate(topic,SessionModel.topicView(session,topic.id),ctx).topic);
      }
      await api.add('sessions',session);
      for(const run of runs) await api.put('flashcardRuns',{...run,sessionId:session.id,finishedAt:run.finishedAt||nowISO(),status:'finished'});
      cur.finishedAt=nowISO();cur.sessionId=session.id;cur.rev++;
      await api.put('guidedReviews',cur);return {sessionId:session.id};
    });
  }
};
function openFreeReview(){
  if(!activeDisciplines().length){toast('Crie uma disciplina para começar. Tópicos são opcionais.','info');openDisciplineModal();return;}
  openModal(close=>{
    // O mesmo seletor canônico do registro e do cronômetro aceita várias disciplinas e tópicos.
    const target=studyTargetFields({close,idPrefix:'free-review',discIds:[],topicIds:[],allowNewTopic:false});
    return {title:'O que você quer revisar?',content:h('div',null,h('p',{class:'hint',text:'Escolha uma ou várias disciplinas. Tópicos são opcionais. Ao registrar, cada assunto pode receber seu próprio resultado.'}),target.node,
      h('p',{class:'hint',text:'Uma revisão geral registra o tempo uma vez e mantém as agendas de tópicos e cartões. Só assuntos com resultado explícito têm a agenda ajustada.'})),actions:[
      fcButton('Cancelar',()=>close()),fcButton('Já revisei',()=>{
        const ids=target.discIds;if(!ids.length){toast('Escolha pelo menos uma disciplina.','err');return;}
        close();openRegisterModal({mode:'manual',disciplineIds:ids,topicIds:target.topicIds,types:['revisao']});
      }),fcButton('Começar revisão',once(async()=>{const ids=target.discIds;if(!ids.length){toast('Escolha pelo menos uma disciplina.','err');return;}if(await startTimer(ids,target.topicIds,['revisao']))close();}),'primary')]};
  },{size:'wide'});
}
function openGuidedReviewBuilder(availableMinutes=20){
  let budget=clamp(Math.round(Number(availableMinutes))||20,1,600);
  let chosen=ReviewEngine.buildSession(budget).items.map(i=>({topicId:i.topic.id,method:i.method,minutes:Math.min(i.minutes,budget),reasons:i.reasons||[]}));
  const selectedDiscs=new Set(activeDisciplines().map(d=>d.id));
  openModal(close=>{
    const preview=h('div',{class:'guided-plan'}),total=h('p',{class:'hint',role:'status'});
    const minutes=h('input',{type:'number',min:'1',max:'600',value:budget,inputmode:'numeric',onchange:()=>{const v=Number(minutes.value);if(Number.isInteger(v)&&v>=1&&v<=600){budget=v;draw();}}});
    const build=()=>{
      const ranked=ReviewEngine.rankedQueue().filter(i=>selectedDiscs.has(i.topic.disciplineId));
      chosen=[];let left=budget;
      for(const entry of ranked){if(left<=0)break;const method=ReviewEngine.effectiveMethod(entry.topic).method,minutes=Math.min(left,ReviewEngine.estimateMinutes(entry.topic,method));chosen.push({topicId:entry.topic.id,method,minutes,reasons:entry.reasons||[]});left-=minutes;}
      draw();
    };
    const add=fcSelect('guided-add','Adicionar assunto',[['','Escolha um assunto'],...state.topics.filter(t=>!t.archived && !getDiscipline(t.disciplineId)?.archived).map(t=>[t.id,disciplineName(t.disciplineId)+' — '+t.name])],'',v=>{
      if(!v)return;if(chosen.some(i=>i.topicId===v)){toast('Este assunto já está no roteiro.','info');return;}
      const t=getTopic(v);chosen.push({topicId:v,method:ReviewEngine.effectiveMethod(t).method,minutes:5,reasons:[]});add.node.value='';draw();
    });
    const draw=()=>{
      clear(preview);
      if(!chosen.length)preview.append(h('p',{class:'quiet-empty',text:'Sem assuntos sugeridos nesta seleção. Você pode adicionar qualquer tópico, fazer uma revisão livre ou criar cartões.'}));
      chosen.forEach((item,index)=>{
        const t=getTopic(item.topicId);if(!t)return;
        const method=fcSelect('guided-method-'+index,'Método de '+t.name,CONCRETE_METHODS.map(m=>[m,methodLabel(m)]),item.method,v=>{item.method=v;});
        const duration=h('input',{type:'number',min:'1',max:'600',value:item.minutes,inputmode:'numeric',onchange:e=>{item.minutes=Number(e.target.value);updateTotal();}});
        preview.append(h('div',{class:'guided-item'},h('h4',{text:t.name}),h('p',{class:'hint',text:disciplineName(t.disciplineId)+(item.reasons.length?' · '+item.reasons.slice(0,2).join(' · '):'')}),
          h('div',{class:'fc-filters'},method.field,fcField('guided-duration-'+index,'Duração sugerida (min)',duration)),
          h('div',{class:'tf-actions'},fcButton('Subir',()=>{if(index){[chosen[index-1],chosen[index]]=[chosen[index],chosen[index-1]];draw();}}),
            fcButton('Descer',()=>{if(index<chosen.length-1){[chosen[index+1],chosen[index]]=[chosen[index],chosen[index+1]];draw();}}),
            fcButton('Remover assunto',()=>{chosen.splice(index,1);draw();}))));
      });updateTotal();
    };
    const updateTotal=()=>{const sumMin=chosen.reduce((n,i)=>n+(Number(i.minutes)||0),0);total.textContent=`${chosen.length} assuntos · ${sumMin} min propostos · você tem ${budget} min.`+(sumMin>budget?' A proposta excede o tempo: remova um assunto ou ajuste as durações.':'');};
    draw();
    return {title:'Monte sua revisão guiada',content:h('div',null,h('p',{class:'hint',text:'O Ciclo propõe assuntos a partir das sugestões, prioridades e prazos existentes. Você pode remover, adicionar, reordenar e trocar o método.'}),
      h('div',{class:'chips'},[10,20,30].map(v=>h('button',{type:'button',class:'chip',text:v+' min',onclick:()=>{budget=v;minutes.value=v;build();}}))),fcField('guided-budget','Tempo disponível (minutos)',minutes),
      h('details',{class:'disclosure'},h('summary',{text:'Escolher disciplinas'}),h('div',{class:'disclosure-body'},activeDisciplines().map(d=>{
        const check=h('input',{type:'checkbox',checked:true,onchange:e=>{if(e.target.checked)selectedDiscs.add(d.id);else selectedDiscs.delete(d.id);}});
        return h('label',{class:'fc-check'},check,d.name);
      })),fcButton('Atualizar proposta',build)),add.field,total,preview),actions:[fcButton('Cancelar',()=>close()),fcButton('Começar roteiro',once(()=>flashcardAction(async()=>{
        const used=chosen.reduce((n,i)=>n+i.minutes,0);
        if(!chosen.length || chosen.length>MAX_TOPICS_PER_STUDY || chosen.some(i=>!Number.isInteger(i.minutes)||i.minutes<1||i.minutes>600) || used>budget)throw flashcardError('Escolha assuntos e durações que caibam no tempo disponível.');
        if(TimerService.isActive)throw flashcardError('Finalize o cronômetro antes de começar outro estudo guiado.');
        const draft=await GuidedReviewCommands.create(chosen,budget);close();await openGuidedReviewPlayer(draft.id);
      })),'primary')]};
  },{size:'wide'});
}
async function openGuidedReviewPlayer(id){
  let draft=await DB.get('guidedReviews',id);if(!draft||draft.finishedAt)return;
  const releaseLock=await acquirePracticeLock('guided',id);
  if(!releaseLock){toast('Este roteiro está aberto em outra aba. Continue por lá.','info');return;}
  draft=await flashcardAction(()=>GuidedReviewCommands.claim(id));if(!draft){releaseLock();return;}
  let paused=true,last=performance.now(),busy=false,closed=false,pending=Promise.resolve(),draw;
  const flush=()=>{const now=performance.now(),delta=paused?0:now-last;last=now;if(delta<=0)return pending;
    pending=pending.then(async()=>{draft=await GuidedReviewCommands.update(draft,r=>{r.elapsedMs+=Math.min(delta,60000);return r;});});return pending;};
  let timer;const hidden=()=>{if(document.hidden&&!paused){flush().catch(e=>toast(e.message,'err'));paused=true;draw?.();}};
  document.addEventListener('visibilitychange',hidden);
  openModal(close=>{
    const body=h('div',{class:'guided-player'});
    const change=mutate=>flashcardAction(async()=>{if(busy)return;busy=true;try{await flush();draft=await GuidedReviewCommands.update(draft,mutate);draw();}finally{busy=false;}});
    draw=()=>{
      if(closed)return;
      const item=draft.items[draft.cursor],topic=item&&getTopic(item.topicId),guide=ReviewEngine.methodGuide(item?.method);
      const outcome=fcSelect('guided-outcome','Como foi este assunto?',[['','Escolha um resultado'],...REVIEW_OUTCOMES.map(o=>[o.v,o.label])],item?.outcome);
      const done=draft.items.filter(i=>i.status==='done').length;
      const cards=topic && state.flashcardNotes.some(n=>n.topicId===topic.id&&!n.deletedAt&&!n.archived);
      mount(body,h('p',{class:'fc-progress',role:'status',text:`Atividade ${draft.cursor+1} de ${draft.items.length} · ${done} realizadas · ${draft.items.filter(i=>i.status==='skipped').length} puladas`}),
        topic?h('div',null,h('h3',{text:topic.name}),h('p',{class:'hint',text:disciplineName(topic.disciplineId)+' · '+methodLabel(item.method)+' · '+item.minutes+' min sugeridos'})):h('p',{text:'Este assunto foi excluído. Pule a atividade para continuar.'}),
        paused?h('div',{class:'fc-paused'},h('p',{text:'Roteiro pausado. As atividades confirmadas continuam guardadas.'}),fcButton('Continuar roteiro',once(()=>flashcardAction(async()=>{draft=await GuidedReviewCommands.claim(id);paused=false;last=performance.now();draw();})),'primary')):
          h('div',null,h('ol',{class:'method-steps'},(guide?.steps||[]).slice(0,4).map(step=>h('li',{text:step}))),
            item?.method==='flashcards'?h('div',null,h('p',{class:'hint',text:'As respostas de cartões não atribuem um resultado ao tópico. O tempo entra no mesmo estudo do roteiro.'}),
              cards?fcButton(item.runId?'Retomar cartões desta atividade':'Praticar cartões deste assunto',once(()=>flashcardAction(async()=>{
                await flush();paused=true;
                let run=item.runId&&await DB.get('flashcardRuns',item.runId);
                if(!run){
                  const selected=FlashcardModel.queue({disciplineId:topic.disciplineId,topicId:topic.id,limit:20});
                  if(!selected.length)throw flashcardError('Sem cartões disponíveis deste assunto. Troque o método ou crie um cartão.');
                  run=await FlashcardCommands.begin({disciplineId:topic.disciplineId,topicId:topic.id,limit:20});
                  await DB.put('flashcardRuns',{...run,parentGuidedId:id});
                  draft=await GuidedReviewCommands.update(draft,r=>{r.items[r.cursor].runId=run.id;return r;});
                }
                close();await openFlashcardPlayer(run.id);
              })),'primary'):h('p',{class:'hint',text:'Este assunto ainda não tem cartões. Você pode pular ou trocar o método no controle abaixo.'})):outcome.field,
            item&&topic?fcButton(item.status==='done'?'Atualizar resultado desta atividade':'Concluir esta atividade',()=>change(r=>{
              const it=r.items[r.cursor];
              if(it.method==='flashcards'){
                const run=state.flashcardRuns.find(x=>x.id===it.runId);if(!run||!state.flashcardResponses.some(e=>e.runId===run.id))throw flashcardError('Pratique ao menos um cartão para concluir esta atividade.');
              }else{if(!outcome.node.value)throw flashcardError('Escolha o resultado deste assunto.');it.outcome=outcome.node.value;}
              it.status='done';if(r.cursor<r.items.length-1)r.cursor++;return r;
            }),'primary'):null),
        item?fcSelect('guided-current-method','Trocar método desta atividade',CONCRETE_METHODS.map(m=>[m,methodLabel(m)]),item.method,v=>change(r=>{const it=r.items[r.cursor];if(it.status==='done')throw flashcardError('Esta atividade já foi concluída. O método registrado é preservado.');if(it.runId)throw flashcardError('Esta atividade já tem respostas de cartões. Conclua ou pule para preservar o vínculo.');it.method=v;return r;})).field:null,
        h('div',{class:'tf-actions'},!paused?fcButton('Pausar roteiro',async()=>{await flashcardAction(flush);paused=true;draw();}):null,
          fcButton('Voltar atividade',()=>change(r=>{r.cursor=Math.max(0,r.cursor-1);return r;})),
          fcButton('Avançar atividade',()=>change(r=>{r.cursor=Math.min(r.items.length-1,r.cursor+1);return r;})),
          fcButton('Pular atividade',()=>change(r=>{const it=r.items[r.cursor];if(it.status==='done'&&getTopic(it.topicId))throw flashcardError('Esta atividade já está realizada. Avance para continuar.');it.status='skipped';it.outcome=null;r.cursor=Math.min(r.items.length-1,r.cursor+1);return r;}))));
    };draw();timer=setInterval(()=>{if(!paused)flashcardAction(flush);},10000);
    return {title:'Sua revisão guiada',content:body,actions:[fcButton('Continuar depois',async()=>{await flashcardAction(flush);paused=true;close();await refresh();}),
      fcButton('Encerrar roteiro',once(()=>flashcardAction(async()=>{await flush();paused=true;await loadAll();close();openGuidedReviewResult(draft);}))) ]};
  },{size:'wide',dismissible:false,onClose:()=>{closed=true;clearInterval(timer);document.removeEventListener('visibilitychange',hidden);flush().then(()=>GuidedReviewCommands.release(id)).catch(e=>toast(e.message,'err')).finally(releaseLock);}});
}
function openGuidedReviewResult(draft){
  const done=draft.items.filter(i=>i.status==='done');
  const cardMs=draft.items.reduce((n,i)=>n+(state.flashcardRuns.find(r=>r.id===i.runId)?.elapsedMs||0),0);
  openModal(close=>{
    const minutes=h('input',{type:'number',min:'1',max:'2880',value:Math.max(1,Math.round((draft.elapsedMs+cardMs)/60000)),inputmode:'numeric'});
    return {title:'Registrar a revisão guiada',content:h('div',null,h('p',{text:plural(done.length,'atividade realizada','atividades realizadas')+'. Atividades puladas ou sem conclusão ficam fora do registro.'}),
      done.map(i=>h('p',{text:(getTopic(i.topicId)?.name||'Assunto removido')+' · '+(i.method==='flashcards'?'Respostas individuais preservadas, sem alterar o tópico':reviewOutcomeLabel(i.outcome))})),
      fcField('guided-result-minutes','Tempo total líquido (minutos, ajustável)',minutes),h('p',{class:'hint',text:'O total inclui a prática de cartões vinculada, uma única vez. Pausas ficam fora. Cada tópico recebe apenas o resultado que você informou.'})),actions:[
      fcButton('Voltar ao roteiro',()=>{close();openGuidedReviewPlayer(draft.id);}),fcButton('Guardar para depois',()=>close()),
      fcButton('Encerrar sem registrar estudo',once(()=>flashcardAction(async()=>{
        if(done.length&&!await confirmModal('Encerrar este roteiro sem acrescentar estudo ou alterar a agenda dos tópicos? O progresso e as respostas de cartões continuam guardados no backup.',{confirmLabel:'Encerrar sem estudo'}))return;
        await GuidedReviewCommands.closeWithoutStudy(draft);await refresh();close();
      }))),
      done.length?fcButton('Registrar uma revisão',once(()=>flashcardAction(async()=>{await GuidedReviewCommands.finish(draft,Number(minutes.value));await refresh();close();toast('Uma sessão registrada, com os resultados de cada atividade.','ok');})),'primary'):null]};
  },{dismissible:false});
}
function reviewsRecentHistory(){
  const sessions=state.sessions.filter(s=>SessionModel.types(s).includes('revisao')).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt)).slice(0,5);
  return h('details',{class:'disclosure'},h('summary',{text:'Histórico recente de revisões'}),h('div',{class:'disclosure-body'},sessions.length?
    h('ul',{class:'line-list'},sessions.map(s=>h('li',{class:'line'},h('button',{class:'line-main',type:'button',onclick:()=>openEditSessionModal(s.id)},h('span',{class:'line-t',text:SessionModel.title(s)}),h('span',{class:'line-s',text:fmtDateBR(s.date)+' · '+fmtDuration(s.minutes)+(FlashcardModel.summary(s.id)?' · '+FlashcardModel.summary(s.id):'')}))))):
    h('p',{class:'hint',text:'As revisões que você registrar aparecem aqui. Respostas de cartões também ficam no histórico de cada conteúdo.'})));
}
