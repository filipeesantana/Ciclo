const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER || 'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});afterEach(async()=>context.close());

test('Português: registrar 30 minutos sem tópicos, permanecer no Histórico e recuperar após F5',async()=>{
 await page.setViewportSize({width:360,height:800});
 await page.evaluate(()=>{setView('history');openRegisterModal({disciplineId:'portugues'});});
 await page.getByRole('button',{name:'Não lembro os horários',exact:true}).click();
 await page.locator('#rm-min').fill('30');
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);
 await page.reload();await page.waitForFunction(()=>state.ready);
 assert.equal(await page.evaluate(()=>ui.view),'history');
 assert.deepEqual(await page.evaluate(()=>({n:state.sessions.length,minutes:state.sessions[0].minutes,topics:SessionModel.topicIds(state.sessions[0])})),{n:1,minutes:30,topics:[]});
});
test('primeiro uso rápido: só o nome, sem plano, tópico ou prazo inventado',async()=>{
 const fresh=await open(runtime);try{
  await fresh.page.getByRole('button',{name:/Quero começar agora/}).click();await fresh.page.locator('#ob-name').fill('Guitarra');
  await fresh.page.getByRole('button',{name:'Criar e continuar',exact:true}).click();await fresh.page.getByRole('button',{name:'Agora não',exact:true}).click();
  assert.deepEqual(await fresh.page.evaluate(()=>({discs:state.disciplines.map(d=>d.name),topics:state.topics.length,plans:state.plans.length,deadlines:state.deadlines.length})),{discs:['Guitarra'],topics:0,plans:0,deadlines:0});
 }finally{await fresh.context.close();}
});
test('guitarra: marco opcional aparece na evolução sem exigir organização',async()=>{
 const x=await page.evaluate(async()=>{
  const d={...newDiscipline('Guitarra'),id:'guitarra'};await DB.put('disciplines',d);await loadAll();
  await SessionCommands.create({disciplineId:d.id,minutes:30,date:todayISO(),results:[{id:'m',kind:'milestone',text:'Tocar a sequência a 80 bpm',before:'Parava nas trocas de acordes'}]});await loadAll();
  applyAnalyticsQuery({periodPreset:'30d',focus:'learning'});const a=AnalyticsEngine.query({periodPreset:'30d'});return {minutes:a.totals.minutes,marcos:a.results.milestoneCount,topics:SessionModel.topicIds(state.sessions[0])};
 });assert.deepEqual(x,{minutes:30,marcos:1,topics:[]});assert.ok((await page.locator('#analytics-body').textContent()).includes('80 bpm'));
});
test('meta global cumprida com distribuição diferente da sugestão',async()=>{
 const x=await page.evaluate(async()=>{
  const p={...newPlan('Meu plano',300),id:'plan',allocations:[{disciplineId:'portugues',targetMinutes:180},{disciplineId:'matematica',targetMinutes:120}]};
  await DB.put('plans',p);await loadAll();await PlannerEngine.ensureWeeklyPlan();
  await SessionCommands.create({disciplineId:'matematica',minutes:300,date:todayISO()});await loadAll();setView('plan');
  const w=PlannerEngine.getCurrentWeekProgress();return {reached:w.reached,realized:w.realizedTotal,remaining:w.remainingTotal,text:document.querySelector('#plan-body').textContent};
 });assert.equal(x.reached,true);assert.equal(x.realized,300);assert.equal(x.remaining,0);assert.ok(x.text.includes('Meta semanal concluída'));assert.ok(!x.text.includes('falhou'));
});
test('adiar revisão não muda data, intervalo nem histórico',async()=>{
 const x=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:20,date:addDaysISO(todayISO(),-7)});await loadAll();
  const before=await DB.get('topics','pontuacao');await ReviewSuggestions.snooze(['pontuacao'],3);
  return {before,after:await DB.get('topics','pontuacao'),n:await DB.count('sessions'),suggested:ReviewEngine.suggested().map(t=>t.id)};
 });assert.equal(x.before.reviewDueDate,x.after.reviewDueDate);assert.equal(x.before.reviewIntervalDays,x.after.reviewIntervalDays);assert.equal(x.n,1);assert.ok(!x.suggested.includes('pontuacao'));
});
test('Voltar, Avançar e F5 preservam o caminho sem criar loop',async()=>{
 await page.evaluate(()=>{setView('today');setView('disciplines');openDisciplineDetail('portugues');openTopicPage('pontuacao');});
 await page.goBack();assert.equal(await page.evaluate(()=>Nav.location().d),'portugues');assert.equal(await page.evaluate(()=>Nav.location().t),null);
 await page.goBack();assert.equal(await page.evaluate(()=>Nav.location().l),'root');
 await page.goForward();assert.equal(await page.evaluate(()=>Nav.location().d),'portugues');
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>Nav.location().d),'portugues');
});
test('rascunho completo persiste antes dos 400 ms e recupera descansos, divisão e revisão',async()=>{
 await page.evaluate(()=>openRegisterModal({disciplineId:'portugues',topicIds:['pontuacao','crase'],types:['revisao']}));
 await page.locator('#rm-date').fill('2026-10-01');
 await page.locator('#rm-start').fill('14:00');await page.locator('#rm-end').fill('15:00');
 await page.getByRole('button',{name:'+ Adicionar descanso',exact:true}).click();
 await page.locator('#rm-bs-1').fill('14:20');await page.locator('#rm-be-1').fill('14:35');
 await page.locator('.split > button').click();await page.locator('#rm-split-pontuacao').fill('20');await page.locator('#rm-split-crase').fill('25');
 await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();
 await page.locator('#rm-comment').fill('Este texto precisa sobreviver ao F5 imediato.');
 await page.reload();await page.waitForFunction(()=>state.ready);await page.evaluate(()=>openRegisterModal());
 assert.equal(await page.locator('#rm-comment').inputValue(),'Este texto precisa sobreviver ao F5 imediato.');
 assert.equal(await page.locator('#rm-bs-1').inputValue(),'14:20');assert.equal(await page.locator('#rm-be-1').inputValue(),'14:35');
 assert.equal(await page.locator('#rm-split-pontuacao').inputValue(),'20');assert.ok((await page.locator('.when-result').textContent()).includes('45'));
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();await page.waitForFunction(()=>state.sessions.length===1);
 assert.deepEqual(await page.evaluate(()=>({minutes:state.sessions[0].minutes,breaks:breakMinutesOf(state.sessions[0]),split:SessionModel.topicShares(state.sessions[0]).map(t=>t.minutes)})),{minutes:45,breaks:15,split:[20,25]});
});
test('falha de escrita mantém o formulário e o rascunho; retentativa grava uma vez',async()=>{
 await page.evaluate(()=>{openRegisterModal({disciplineId:'portugues'});window.originalCreate=SessionCommands.create;SessionCommands.create=async()=>({ok:false,reason:'error'});});
 await page.getByRole('button',{name:'Não lembro os horários',exact:true}).click();await page.locator('#rm-min').fill('40');
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 assert.equal(await page.locator('#rm-min').inputValue(),'40');assert.equal(await page.evaluate(()=>state.sessions.length),0);
 await page.evaluate(()=>{FormDraft.flushAll();SessionCommands.create=window.originalCreate;});assert.ok(await page.evaluate(()=>FormDraft.load('register')));
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();await page.waitForFunction(()=>state.sessions.length===1);
 assert.equal(await page.evaluate(()=>FormDraft.load('register')),null);
});
test('Pomodoro: dois blocos são 50 minutos de estudo e 5 de descanso em um retrato',async()=>{
 const x=await page.evaluate(()=>{
  const original=Date.now;let at=Date.now();Date.now=()=>at;
  try{TimerService.start(['portugues'],[],[],null,null,{pomodoro:{preset:'classic'}});at+=25*60000;TimerService.settlePomodoro();TimerService.startBreak();at+=5*60000;TimerService.settlePomodoro();TimerService.endBreak();at+=25*60000;TimerService.settlePomodoro();const s=TimerService.snapshot();return {study:s.studyMs/60000,rest:s.breakMs/60000,blocks:s.pomodoro.blocks};}
  finally{TimerService.clear();Date.now=original;}
 });assert.deepEqual(x,{study:50,rest:5,blocks:2});
});
test('pausa e descanso sobrevivem a F5 com o estudo congelado',async()=>{
 for(const mode of ['pause','startBreak']) {
  await page.evaluate(m=>{TimerService.start(['portugues'],[],[]);TimerService.data.startedAt-=40*60000;TimerService[m]();},mode);
  await page.reload();await page.waitForFunction(()=>state.ready);
  const x=await page.evaluate(()=>({state:TimerService.status,study:TimerService.getElapsed()}));assert.equal(x.state,mode==='pause'?'paused':'rest');assert.ok(Math.abs(x.study-2400000)<1000);
  await page.evaluate(()=>TimerService.clear());
 }
});
test('finalização com comentário não congela os minutos medidos ao reabrir',async()=>{
 await page.evaluate(()=>{TimerService.start(['portugues'],[],[]);TimerService.data.startedAt-=10*60000;TimerService._persist();openFinishModal();});
 await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();await page.locator('#fin-comment').fill('Não deve substituir a medição.');
 await page.evaluate(()=>{modalCloser();TimerService.data.startedAt-=5*60000;TimerService._persist();openFinishModal();});
 assert.equal(await page.locator('#fin-min').inputValue(),'15');assert.equal(await page.locator('#fin-comment').inputValue(),'Não deve substituir a medição.');
});
test('modal prende o foco e Esc devolve ao botão que o abriu',async()=>{
 await page.locator('#fab').focus();await page.locator('#fab').click();await page.waitForTimeout(50);
 for(let i=0;i<25;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('#modal-box').contains(document.activeElement)));}
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'fab');
});
test('prazo usa rádios com teclado e conserva só aria-checked',async()=>{
 await page.evaluate(()=>openDeadlineModal(null));const radios=page.getByRole('radiogroup',{name:'Tipo de prazo'}).getByRole('radio');
 await page.waitForTimeout(60);
 await radios.first().focus();await page.keyboard.press('ArrowRight');assert.equal(await radios.nth(1).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Space');assert.equal(await radios.nth(1).getAttribute('aria-checked'),'true');assert.equal(await radios.nth(1).getAttribute('aria-pressed'),null);
});

test('resultados mostram a distribuição, revelam disciplinas além da 12ª e mantêm o período ao aprofundar',async()=>{
 await page.evaluate(async()=>{
  const ds=Array.from({length:15},(_,i)=>({...newDiscipline('Disciplina '+(i+1)),id:'extra'+i}));
  await DB.putMany('disciplines',ds);await loadAll();
  for(const d of ds) await SessionCommands.create({disciplineId:d.id,minutes:30,date:todayISO(),results:[{id:'q',kind:'questions',total:20,correct:10}]});
  await loadAll();applyAnalyticsQuery({periodPreset:'90d',focus:'results'});
 });
 const section=page.locator('section[aria-labelledby="an-results-by"]');
 assert.equal(await section.locator('button.hbar-row').count(),12);assert.ok((await section.textContent()).includes('12 de 15 disciplinas'));
 await section.getByRole('button',{name:'Mostrar mais',exact:true}).click();assert.equal(await section.locator('button.hbar-row').count(),15);
 await section.locator('button.hbar-row').last().click();
 assert.deepEqual(await page.evaluate(()=>({focus:ui.analyticsQuery.focus,period:ui.analyticsQuery.periodPreset,n:ui.analyticsQuery.scopeIds.length})),{focus:'results',period:'90d',n:1});
 await page.goBack();assert.equal(await page.evaluate(()=>ui.analyticsQuery.scopeType),'all');
});
test('evolução oferece acesso aos marcos e conceitos além dos limites iniciais',async()=>{
 await page.evaluate(()=>{
  const s=newSession({id:'timeline',disciplineId:'portugues',disciplineEntries:[{disciplineId:'portugues',minutes:null}],minutes:30,date:todayISO()});
  const concepts=Array.from({length:35},(_,i)=>({r:{id:'c'+i,label:'Conceito '+i,status:'yes'},session:s,date:s.date,disciplineId:'portugues'}));
  const milestones=Array.from({length:45},(_,i)=>({r:{id:'m'+i,text:'Marco '+i},session:s,date:s.date,disciplineId:'portugues'}));
  const a={results:{concepts,conceptStatus:{yes:35,partial:0,no:0},milestones}};
  setView('analytics');mount(document.querySelector('#analytics-body'),conceptsViz(a),milestonesViz(a));
 });
 assert.equal(await page.locator('.res-concepts li').count(),30);assert.equal(await page.locator('.ms-list li').count(),40);
 const more=page.locator('#analytics-body').getByRole('button',{name:'Mostrar mais',exact:true});
 await more.first().click();await more.first().click();assert.equal(await page.locator('.res-concepts li').count(),35);assert.equal(await page.locator('.ms-list li').count(),45);
});

test('rascunho recupera o nome de uma disciplina ainda não criada',async()=>{
 await page.evaluate(()=>openRegisterModal());await page.locator('#rm-disc').click();await page.getByRole('option',{name:'Nova disciplina…',exact:true}).click();
 await page.locator('#rm-newdisc').fill('Artes Cênicas');await page.reload();await page.waitForFunction(()=>state.ready);await page.evaluate(()=>openRegisterModal());
 assert.equal(await page.locator('#rm-newdisc').inputValue(),'Artes Cênicas');assert.equal(await page.evaluate(()=>state.disciplines.some(d=>d.name==='Artes Cênicas')),false);
});

test('REGRESSÃO: cronômetro iniciado em outra aba durante a prévia bloqueia a restauração',async()=>{
 await page.evaluate(()=>{const b=Backup.buildExport();b.disciplines.find(d=>d.id==='portugues').name='Nome do backup';openRestorePreview(Backup.parseBackup(JSON.stringify(b)),'teste.json',false);});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);await other.evaluate(()=>startTimer('portugues',[],[]));
 await page.waitForFunction(()=>TimerService.isActive);
 await page.getByRole('button',{name:'Substituir e restaurar',exact:true}).click();await page.waitForTimeout(250);
 assert.equal(await page.evaluate(async()=>(await DB.get('disciplines','portugues')).name),'Português');
 assert.ok(await page.evaluate(()=>TimerService.storedRunId()));
 assert.equal(await page.locator('#modal-title').textContent(),'Há um estudo em andamento');
});

test('duas abas iniciando ao mesmo tempo compartilham um único cronômetro',async()=>{
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 const results=await Promise.all([page.evaluate(()=>startTimer('portugues',[],[])),other.evaluate(()=>startTimer('matematica',[],[]))]);
 assert.equal(results.filter(Boolean).length,1);const ids=await Promise.all([page.evaluate(()=>TimerService.storedRunId()),other.evaluate(()=>TimerService.storedRunId())]);assert.equal(ids[0],ids[1]);assert.ok(ids[0]);
});
test('cronômetro descartado pela restauração não pode ser finalizado depois',async()=>{
 const x=await page.evaluate(async()=>{
  TimerService.start(['portugues'],[],[]);const id=TimerService.data.runId;
  const d=Backup.parseBackup(JSON.stringify(Backup.buildExport())).data;
  await Backup.restoreInto(d,{discardTimerRunId:id});
  const r=await SessionCommands.finalizeTimer({disciplineId:'portugues',minutes:40,date:todayISO()},id);
  return {reason:r.reason,count:await DB.count('sessions')};
 });assert.deepEqual(x,{reason:'timer-ended',count:0});
});
test('falha de restauração mantém o cronômetro e não confirma seu descarte',async()=>{
 const x=await page.evaluate(async()=>{
  TimerService.start(['portugues'],[],[]);const id=TimerService.data.runId;
  const d=Backup.parseBackup(JSON.stringify(Backup.buildExport())).data;d.disciplines.push({...d.disciplines[0]});
  try{await Backup.restoreInto(d,{discardTimerRunId:id});}catch(e){}
  return {same:TimerService.storedRunId()===id,marker:(await DB.get('meta','lastDiscardedTimer'))?.value||null,n:await DB.count('disciplines')};
 });assert.deepEqual(x,{same:true,marker:null,n:2});
});

test('iniciar pela janela aguarda o cronômetro e finaliza o mesmo runId',async()=>{
 await page.evaluate(()=>openQuickStart({disciplineId:'portugues'}));
 await page.locator('#modal-actions .primary').click();await page.waitForFunction(()=>TimerService.isActive&&!Overlay.isOpen);
 const runId=await page.evaluate(()=>{TimerService.data.startedAt-=30*60000;TimerService._persist();return TimerService.data.runId;});
 await page.locator('#fab').click();await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!TimerService.isActive);
 assert.equal(await page.evaluate(()=>state.sessions[0].id),runId);assert.equal(await page.evaluate(async()=>await DB.get('meta','activeTimer')),undefined);
});
test('começar sem disciplina mantém a janela se o início falhar',async()=>{
 await page.evaluate(()=>{openQuickStart();window.originalStartTimer=startTimer;startTimer=async()=>false;});
 await page.getByRole('button',{name:/Começar sem escolher a disciplina/}).click();assert.equal(await page.evaluate(()=>Overlay.isOpen),true);
 await page.evaluate(()=>{startTimer=window.originalStartTimer;});
 await page.getByRole('button',{name:/Começar sem escolher a disciplina/}).click();await page.waitForFunction(()=>TimerService.isActive&&!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>TimerService.discIds()),[]);
});

test('reserva sem relógio após liberação interrompida pode ser cancelada ou descartada para continuar',async()=>{
 const old=await page.evaluate(async()=>{
  await startTimer(['portugues'],[],[]);const id=TimerService.data.runId;
  TimerService._releaseReservation=()=>Promise.resolve();TimerService.clear();return id;
 });
 const cancelled=page.evaluate(()=>startTimer(['matematica'],[],[]));
 await page.getByRole('heading',{name:'Cronômetro indisponível',exact:true}).waitFor();
 await page.locator('#modal-actions').getByRole('button',{name:'Cancelar',exact:true}).click();
 assert.equal(await cancelled,false);assert.equal(await page.evaluate(()=>DB.count('sessions')),0);
 assert.equal(await page.evaluate(async()=> (await DB.get('meta','activeTimer')).value),old);
 const retry=page.evaluate(()=>startTimer(['matematica'],[],[]));
 await page.getByRole('heading',{name:'Cronômetro indisponível',exact:true}).waitFor();
 await page.getByRole('button',{name:'Descartar e continuar',exact:true}).click();
 assert.equal(await retry,true);
 const result=await page.evaluate(async()=>({id:TimerService.data.runId,disc:TimerService.discIds(),reservation:(await DB.get('meta','activeTimer')).value,discarded:(await DB.get('meta','lastDiscardedTimer')).value}));
 assert.notEqual(result.id,old);assert.equal(result.reservation,result.id);assert.equal(result.discarded,old);assert.deepEqual(result.disc,['matematica']);
});
test('recuperação de reserva não descarta relógio reaparecido nem reserva substituída na confirmação',async()=>{
 const old=await page.evaluate(async()=>{
  await startTimer(['portugues'],[],[]);const id=TimerService.data.runId;
  window.savedTimer=localStorage.getItem(TIMER_LS_KEY);TimerService.forget();localStorage.removeItem(TIMER_LS_KEY);return id;
 });
 for(const change of ['clock','reservation']){
  const recovery=page.evaluate(id=>recoverTimerReservation(id),old);
  await page.getByRole('heading',{name:'Cronômetro indisponível',exact:true}).waitFor();
  await page.evaluate(async change=>{
   if(change==='clock'){localStorage.setItem(TIMER_LS_KEY,window.savedTimer);TimerService.restore();}
   else await DB.put('meta',{key:'activeTimer',value:'outro-cronometro'});
  },change);
  await page.getByRole('button',{name:'Descartar e continuar',exact:true}).click();
  assert.equal(await recovery,false);assert.equal(await page.evaluate(()=>DB.get('meta','lastDiscardedTimer')),undefined);
  if(change==='clock')await page.evaluate(()=>{TimerService.forget();localStorage.removeItem(TIMER_LS_KEY);});
 }
 assert.equal(await page.evaluate(async()=> (await DB.get('meta','activeTimer')).value),'outro-cronometro');
});
