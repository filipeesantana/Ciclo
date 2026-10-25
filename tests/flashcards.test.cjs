const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});
afterEach(async()=>context.close());
async function basic(options={}){
 return page.evaluate(async options=>{
  const n=await FlashcardCommands.saveNote({type:'basic',disciplineId:'portugues',data:{front:'Qual sinal?',back:'Ponto-final.'},...options});
  await loadAll();return n;
 },options);
}

test('seis formatos preservam Unicode, campos opcionais e conteúdo sem tópico',async()=>{
 const result=await page.evaluate(async()=>{
  const notes=[];
  for(const type of FLASHCARD_TYPES.map(t=>t.id)) notes.push(await FlashcardCommands.saveNote({type,disciplineId:'portugues',direction:'both',data:{front:type==='cloze'?'A capital é {{Brasília}}; {{ação}}.':'Pergunta — 日本語 <img src=x onerror=alert(1)>',back:type==='sequence'?'Observar\nTestar\nConcluir':'Resposta\ncom acento: ç',hint:'Uma pista',example:'=SUM(A1)',notes:'Observações'}}));
  await loadAll();return {notes:state.flashcardNotes,cards:state.flashcards,backup:Backup.parseBackup(JSON.stringify(Backup.buildExport())).data};
 });
 assert.equal(result.notes.length,6);assert.equal(result.cards.length,8);assert.ok(result.notes.every(n=>n.topicId===null));
 assert.deepEqual(result.backup.flashcardNotes,result.notes);assert.deepEqual(result.backup.flashcards,result.cards);
});
test('conteúdo inválido é recusado antes de gravar e não trunca textos extensos',async()=>{
 const x=await page.evaluate(async()=>{
  const cases=[{type:'basic',data:{front:'',back:'A'}},{type:'basic',data:{front:'P',back:''}},{type:'cloze',data:{front:'Sem lacunas'}},{type:'cloze',data:{front:'{{ }}'}},{type:'cloze',data:{front:'{{a {{b}} }}'}},{type:'sequence',data:{front:'P',back:'Só uma etapa'}},{type:'basic',data:{front:'A'.repeat(20001),back:'B'}}];
  const errors=[];for(const c of cases){try{await FlashcardCommands.saveNote({...c,disciplineId:'portugues'});errors.push(false);}catch(e){errors.push(true);}}
  return {errors,count:await DB.count('flashcardNotes')};
 });assert.ok(x.errors.every(Boolean));assert.equal(x.count,0);
});
test('FSRS distribuído reproduz vetor fixo de novos cartões, dificuldade, lapso e facilidade',async()=>{
 const x=await page.evaluate(()=>{
  let card=FlashcardScheduler.empty('2026-01-01T12:00:00Z');const out=[];
  for(const [day,rating]of [['2026-01-01',3],['2026-01-05',2],['2026-01-09',1],['2026-01-10',4]]){card=FlashcardScheduler.next(card,rating,day+'T12:00:00Z').card;out.push([card.scheduled_days,card.stability,card.difficulty,card.reps,card.lapses,card.due]);}
  return out;
 });assert.deepEqual(x,[
  [3,2.3065,2.11810397,1,0,'2026-01-04T12:00:00.000Z'],
  [11,10.64837694,4.75285849,2,0,'2026-01-16T12:00:00.000Z'],
  [1,1.32146059,8.26052864,3,1,'2026-01-10T12:00:00.000Z'],
  [4,4.1607808,7.66450674,4,1,'2026-01-14T12:00:00.000Z']]);
});
test('duas direções têm identidades, respostas e agendas independentes',async()=>{
 await basic({type:'term',direction:'both'});
 const x=await page.evaluate(async()=>{
  const before=structuredClone(state.flashcards),run=await FlashcardCommands.begin({limit:2});const card=state.flashcards.find(c=>c.id===run.queue[0]);
  await FlashcardCommands.answer({runId:run.id,cursor:0,cardId:card.id,cardRev:card.rev,rating:3});
  await loadAll();return {before,after:state.flashcards,events:state.flashcardResponses};
 });assert.equal(x.events.length,1);assert.equal(x.after.filter(c=>c.schedule.reps===1).length,1);
 const other=x.after.find(c=>c.schedule.reps===0);assert.deepEqual(other,x.before.find(c=>c.id===other.id));
});
test('prática livre permite antecipar e mantém o agendamento byte a byte',async()=>{
 await basic();const x=await page.evaluate(async()=>{
  const card=state.flashcards[0];card.schedule.due=new Date(Date.now()+86400000*20).toISOString();await DB.put('flashcards',card);await loadAll();
  const due=FlashcardModel.queue().length,run=await FlashcardCommands.begin({mode:'free'});
  await FlashcardCommands.answer({runId:run.id,cursor:0,cardId:card.id,cardRev:card.rev,rating:1});
  return {due,before:card.schedule,after:(await DB.get('flashcards',card.id)).schedule,event:(await DB.getAll('flashcardResponses'))[0]};
 });assert.equal(x.due,0);assert.deepEqual(x.after,x.before);assert.deepEqual(x.event.after,x.event.before);
});
test('duas abas respondendo o mesmo passo gravam um único evento',async()=>{
 await basic();const payload=await page.evaluate(async()=>{const r=await FlashcardCommands.begin(),c=state.flashcards.find(c=>c.id===r.queue[0]);return {runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3};});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 const results=await Promise.all([page,other].map(p=>p.evaluate(x=>FlashcardCommands.answer(x),payload)));
 assert.equal(results.filter(r=>r.duplicate).length,1);assert.equal(await page.evaluate(()=>DB.count('flashcardResponses')),1);
 assert.equal(await page.evaluate(()=>DB.count('sessions')),0);
});
test('duas sessões obsoletas não sobrescrevem o mesmo agendamento',async()=>{
 await basic();const x=await page.evaluate(async()=>{
  const a=await FlashcardCommands.begin(),b=await FlashcardCommands.begin(),c=state.flashcards[0];
  await FlashcardCommands.answer({runId:a.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});
  let rejected=false;try{await FlashcardCommands.answer({runId:b.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:1});}catch(e){rejected=true;}
  return {rejected,n:await DB.count('flashcardResponses'),b:await DB.get('flashcardRuns',b.id)};
 });assert.equal(x.rejected,true);assert.equal(x.n,1);assert.equal(x.b.cursor,0);
});
test('revisão geral, tópicos e cartões mantêm agendas separadas e tempo único',async()=>{
 await basic();const x=await page.evaluate(async()=>{
  const before=await DB.get('topics','pontuacao'),run=await FlashcardCommands.begin(),c=state.flashcards[0];
  await FlashcardCommands.answer({runId:run.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});
  await FlashcardCommands.finish(run.id,{record:true,minutes:20});await FlashcardCommands.finish(run.id,{record:true,minutes:20});
  const after=await DB.get('topics','pontuacao'),schedule=(await DB.get('flashcards',c.id)).schedule;
  await SessionCommands.create({disciplineId:'portugues',minutes:30,date:todayISO(),types:['revisao']});
  await loadAll();return {before,after,schedule,current:(await DB.get('flashcards',c.id)).schedule,n:state.sessions.length,total:AnalyticsEngine.query({periodPreset:'hoje'}).totals.minutes,summary:FlashcardModel.summary('flashcards:'+run.id)};
 });assert.deepEqual(x.after,x.before);assert.deepEqual(x.current,x.schedule);assert.equal(x.n,2);assert.equal(x.total,50);assert.equal(x.summary,'1 cartão respondido');
});
test('sessão de cartões com duas disciplinas registra 40 minutos uma vez',async()=>{
 await basic();await basic({disciplineId:'matematica'});
 const x=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin({limit:10});for(let i=0;i<r.queue.length;i++){const c=await DB.get('flashcards',r.queue[i]);await FlashcardCommands.answer({runId:r.id,cursor:i,cardId:c.id,cardRev:c.rev,rating:3});}
  const finished=await FlashcardCommands.finish(r.id,{record:true,minutes:40});await loadAll();return {events:state.flashcardResponses.length,sessions:state.sessions,shares:SessionModel.discShares(state.sessions[0]),run:finished};
 });assert.equal(x.events,2);assert.equal(x.sessions.length,1);assert.equal(x.sessions[0].minutes,40);assert.deepEqual(x.shares.map(d=>d.minutes),[20,20]);assert.ok(x.run.sessionId);
});
test('edição preserva agenda, recusa sobrescrita e desativar inversa preserva histórico',async()=>{
 const n=await basic({type:'language',direction:'both'});
 const x=await page.evaluate(async n=>{
  const before=structuredClone(state.flashcards),changed=await FlashcardCommands.saveNote({...n,direction:'forward',data:{...n.data,back:'Nova resposta',pronunciation:'bɒrəʊ'}},n.rev);
  let rejected=false;try{await FlashcardCommands.saveNote(n,n.rev);}catch(e){rejected=true;}
  const retired=await DB.getAll('flashcards');await FlashcardCommands.saveNote({...changed,direction:'both'},changed.rev);
  return {before,retired,after:await DB.getAll('flashcards'),rejected};
 },n);assert.equal(x.rejected,true);assert.equal(x.retired.filter(c=>c.retired).length,1);assert.deepEqual(x.after.map(c=>c.id).sort(),x.before.map(c=>c.id).sort());assert.deepEqual(x.after.map(c=>c.schedule),x.before.map(c=>c.schedule));
});
test('suspender, arquivar e excluir impedem resposta obsoleta sem perder eventos',async()=>{
 const n=await basic();const x=await page.evaluate(async n=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0];await FlashcardCommands.suspend(c.id,c.rev,true);
  let blocked=false;try{await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});}catch(e){blocked=true;}
  await loadAll();const suspended=FlashcardModel.queue({mode:'free'}).length;await FlashcardCommands.suspend(c.id,c.rev+1,false);await FlashcardCommands.deleteNote(n.id,n.rev);await loadAll();
  return {blocked,suspended,deleted:FlashcardModel.queue({mode:'free'}).length,notes:state.flashcardNotes.length,cards:state.flashcards.length};
 },n);assert.deepEqual(x,{blocked:true,suspended:0,deleted:0,notes:1,cards:1});
});
test('backup completo preserva modelos, conjuntos, direções, respostas e roteiro pendente',async()=>{
 const x=await page.evaluate(async()=>{
  const template=await FlashcardCommands.saveTemplate({name:'Vocabulário',type:'language',direction:'both',fields:['example','pronunciation']});
  const set=await FlashcardCommands.saveSet({name:'Inglês',disciplineId:'portugues'});
  await FlashcardCommands.saveNote({type:'language',disciplineId:'portugues',templateId:template.id,setId:set.id,direction:'both',data:{front:'Borrow',back:'Pegar emprestado',sourceLanguage:'Inglês',targetLanguage:'Português',example:'Can I borrow your book?'}});await loadAll();
  const r=await FlashcardCommands.begin(),c=state.flashcards.find(c=>c.id===r.queue[0]);await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:2});
  await GuidedReviewCommands.create([{topicId:'pontuacao',method:'exercises',minutes:10}],10);await loadAll();
  const b=Backup.buildExport(),parsed=Backup.parseBackup(JSON.stringify(b));await Backup.restoreInto(parsed.data);await loadAll();const after=Backup.buildExport();
  return {before:Object.fromEntries(FLASHCARD_STORES.map(k=>[k,b[k]])),after:Object.fromEntries(FLASHCARD_STORES.map(k=>[k,after[k]])),integrity:parsed.report.integrity};
 });assert.equal(x.integrity,'ok');assert.deepEqual(x.after,x.before);
});
test('backup sintético legado de 365 dias conserva checksum e todos os estudos',async()=>{
 const fs=require('node:fs'),zlib=require('node:zlib');const raw=JSON.parse(zlib.gunzipSync(fs.readFileSync(require('node:path').join(__dirname,'fixtures/backup-365.json.gz'))));
 const x=await page.evaluate(async raw=>{const p=Backup.parseBackup(JSON.stringify(raw));await Backup.restoreInto(p.data);await loadAll();return {integrity:p.report.integrity,sessions:state.sessions.length,minutes:state.sessions.reduce((n,s)=>n+s.minutes,0),cards:state.flashcards.length};},raw);
 assert.equal(x.sessions,raw.sessions.length);assert.equal(x.minutes,raw.sessions.reduce((n,s)=>n+s.minutes,0));assert.equal(x.cards,0);assert.equal(x.integrity,'ok');
});
test('backup inválido recusa IDs duplicados, referências órfãs e agendamentos malformados',async()=>{
 await basic();const x=await page.evaluate(()=>{
  const b=Backup.buildExport(),mutations=[v=>v.flashcards.push(v.flashcards[0]),v=>v.flashcards[0].noteId='ausente',v=>v.flashcards[0].schedule.due='impossível',v=>v.flashcards[0].schedule.stability=-1,v=>v.flashcards[0].schedule.state=2,v=>v.flashcardTemplates.push({id:'bad-template',name:'Inválido',type:'basic',direction:'forward',fields:['front']}),v=>v.flashcardNotes[0].topicId='ausente',v=>v.flashcardResponses={},v=>v.flashcardNotes[0].data.front='A'.repeat(20001)];
  return mutations.map(fn=>{const c=structuredClone(b);fn(c);try{Backup.parseBackup(JSON.stringify(c));return false;}catch(e){return e.fatal===true;}});
 });assert.ok(x.every(Boolean));assert.equal(await page.evaluate(()=>DB.count('flashcardNotes')),1);
});
test('falha após gravar resposta aborta evento, cursor e agendamento juntos',async()=>{
 await basic();const x=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0],atomic=DB.atomic;
  DB.atomic=(stores,work)=>atomic(stores,api=>work({...api,put:(store,value)=>{if(store==='flashcardRuns')throw new Error('Falha sintética');return api.put(store,value);}}));
  let failed=false;try{await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});}catch(e){failed=true;}finally{DB.atomic=atomic;}
  return {failed,count:await DB.count('flashcardResponses'),card:await DB.get('flashcards',c.id),before:c,run:await DB.get('flashcardRuns',r.id)};
 });assert.equal(x.failed,true);assert.equal(x.count,0);assert.equal(x.run.cursor,0);assert.deepEqual(x.card,x.before);
});
test('F5 conserva resposta confirmada, próximo cartão e nenhum estudo automático',async()=>{
 await basic({type:'term',direction:'both'});const before=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards.find(c=>c.id===r.queue[0]);await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});return r.id;
 });await page.reload();await page.waitForFunction(()=>state.ready);
 assert.deepEqual(await page.evaluate(id=>({cursor:state.flashcardRuns.find(r=>r.id===id).cursor,events:state.flashcardResponses.length,studies:state.sessions.length}),before),{cursor:1,events:1,studies:0});
});
test('roteiro multidisciplinar conclui dois resultados, pula um e registra o tempo uma vez',async()=>{
 const x=await page.evaluate(async()=>{
  let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'active_recall',minutes:10},{topicId:'crase',method:'active_recall',minutes:10},{topicId:'fracoes',method:'exercises',minutes:20}],40);
  const skipped=await DB.get('topics','crase');
  d=await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';r.items[0].outcome='remembered';r.items[1].status='skipped';r.items[2].status='done';r.items[2].outcome='forgot';return r;});
  await GuidedReviewCommands.finish(d,40);await GuidedReviewCommands.finish(d,40);await loadAll();
  return {sessions:state.sessions,total:AnalyticsEngine.query({periodPreset:'hoje'}).totals.minutes,p:await DB.get('topics','pontuacao'),v:await DB.get('topics','fracoes'),skipped,after:await DB.get('topics','crase')};
 });assert.equal(x.sessions.length,1);assert.equal(x.total,40);assert.equal(x.p.lastReviewOutcome,'remembered');assert.equal(x.v.lastReviewOutcome,'forgot');assert.deepEqual(x.after,x.skipped);
});
test('atividade guiada de cartões associa eventos ao mesmo estudo sem alterar tópico',async()=>{
 await basic({topicId:'pontuacao'});const x=await page.evaluate(async()=>{
  const before=await DB.get('topics','pontuacao');let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'flashcards',minutes:10}],10);
  const run=await FlashcardCommands.begin({topicId:'pontuacao'}),c=state.flashcards[0];await DB.put('flashcardRuns',{...run,parentGuidedId:d.id});
  await FlashcardCommands.answer({runId:run.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});await FlashcardCommands.finish(run.id);
  d=await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';r.items[0].runId=run.id;return r;});
  await GuidedReviewCommands.finish(d,10);await loadAll();return {before,after:await DB.get('topics','pontuacao'),sessions:state.sessions,run:state.flashcardRuns[0]};
 });assert.deepEqual(x.after,x.before);assert.equal(x.sessions.length,1);assert.equal(x.sessions[0].minutes,10);assert.deepEqual(x.sessions[0].topicEntries,[]);assert.equal(x.run.sessionId,x.sessions[0].id);
});
test('editor de lacunas oculta seleção visualmente e criação em sequência mantém contexto',async()=>{
 await page.evaluate(()=>openFlashcardEditor({type:'cloze',disciplineId:'matematica'}));await page.locator('#fc-edit-front').fill('A capital é Brasília.');
 await page.locator('#fc-edit-front').evaluate(el=>{el.focus();el.setSelectionRange(12,20);});await page.getByRole('button',{name:'Ocultar trecho',exact:true}).click();
 assert.equal(await page.locator('#fc-edit-front').inputValue(),'A capital é {{Brasília}}.');
 await page.getByRole('button',{name:'Salvar cartão',exact:true}).click();await page.getByRole('button',{name:'Criar outro',exact:true}).click();
 assert.equal(await page.locator('#fc-edit-disc').inputValue(),'matematica');assert.equal(await page.locator('#fc-edit-front').inputValue(),'');
 assert.equal(await page.evaluate(()=>state.flashcardNotes[0].type),'cloze');
});
test('conteúdo semelhante a HTML permanece inerte na biblioteca, editor e estudo',async()=>{
 await basic({data:{front:'<img src=x onerror="window.injected=true">',back:'<script>window.injected=true</script>'}});
 await page.evaluate(()=>openFlashcards());assert.equal(await page.locator('#reviews-body img').count(),0);
 await page.evaluate(async()=>{const r=await FlashcardCommands.begin();await openFlashcardPlayer(r.id);});await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();await page.getByRole('button',{name:'Mostrar resposta',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.injected),undefined);assert.equal(await page.locator('#modal-content img,#modal-content script').count(),0);assert.ok((await page.locator('#fc-answer').innerText()).includes('<script>'));
});
test('teclado revela, avalia uma vez, pula sem resposta e persiste encerramento',async()=>{
 await basic({type:'term',direction:'both'});await page.evaluate(async()=>{const r=await FlashcardCommands.begin();await openFlashcardPlayer(r.id);});
 await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();await page.locator('.fc-player').focus();await page.keyboard.press('Space');await page.keyboard.press('3');
 await page.waitForFunction(async()=>await DB.count('flashcardResponses')===1);
 await page.getByRole('button',{name:'Pular este cartão',exact:true}).click();await page.getByRole('button',{name:'Guardar apenas respostas',exact:true}).click();
 await page.waitForFunction(()=>!Overlay.isOpen);assert.equal(await page.evaluate(()=>state.flashcardResponses.length),1);assert.equal(await page.evaluate(()=>state.sessions.length),0);
});
test('reserva da sessão impede duas abas de somar tempo simultaneamente',async()=>{
 await basic();const id=await page.evaluate(async()=>{const r=await FlashcardCommands.begin();await FlashcardCommands.checkpoint(r.id,1000);return r.id;});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 assert.equal(await other.evaluate(async id=>{try{await FlashcardCommands.checkpoint(id,1000);return false;}catch(e){return true;}},id),true);
 assert.equal(await page.evaluate(async id=>(await DB.get('flashcardRuns',id)).elapsedMs,id),1000);
});
test('sessão pequena respeita limite de novos e filtros por tópico e disciplina',async()=>{
 await basic({topicId:'pontuacao'});await basic({topicId:'crase'});await basic({disciplineId:'matematica',topicId:'fracoes'});
 assert.deepEqual(await page.evaluate(()=>[FlashcardModel.queue({newLimit:0}).length,FlashcardModel.queue({newLimit:1}).length,FlashcardModel.queue({topicId:'crase'}).length,FlashcardModel.queue({disciplineId:'matematica'}).length]),[0,1,1,1]);
});
test('pré-seleção de revisão livre mantém várias disciplinas e tópicos no registro existente',async()=>{
 await page.evaluate(()=>openRegisterModal({mode:'manual',disciplineIds:['portugues','matematica'],topicIds:['pontuacao','fracoes'],types:['revisao']}));
 await page.getByRole('button',{name:'Não lembro os horários',exact:true}).click();await page.locator('#rm-min').fill('40');await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>({disc:SessionModel.disciplineIds(state.sessions[0]),topics:SessionModel.topicIds(state.sessions[0]),minutes:state.sessions[0].minutes})),{disc:['portugues','matematica'],topics:['pontuacao','fracoes'],minutes:40});
});
test('modelos reutilizáveis e preferências gerais sobrevivem à recarga sem copiar conteúdo',async()=>{
 const x=await page.evaluate(async()=>{
  const template=await FlashcardCommands.saveTemplate({name:'Meu inglês',type:'language',direction:'reverse',fields:['example','pronunciation'],showHint:false,showExample:true});
  state.settings.flashcards={limit:5,newLimit:0,mode:'free',shuffle:true};await saveSettings();return template;
 });await page.reload();await page.waitForFunction(()=>state.ready);
 assert.deepEqual(await page.evaluate(()=>state.settings.flashcards),{limit:5,newLimit:0,mode:'free',shuffle:true});
 await page.evaluate(t=>openFlashcardEditor({type:t.type,template:t}),x);
 assert.equal(await page.locator('#fc-edit-direction').inputValue(),'reverse');assert.equal(await page.locator('#fc-edit-example').isVisible(),true);assert.equal(await page.locator('#fc-edit-front').inputValue(),'');
});
test('mover conteúdo preserva os eventos na disciplina da tentativa original',async()=>{
 const n=await basic({topicId:'pontuacao'});const x=await page.evaluate(async n=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0];await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});
  await FlashcardCommands.saveNote({...n,disciplineId:'matematica',topicId:'fracoes'},n.rev);await loadAll();return {note:state.flashcardNotes[0],event:state.flashcardResponses[0]};
 },n);assert.equal(x.note.disciplineId,'matematica');assert.equal(x.note.topicId,'fracoes');assert.equal(x.event.disciplineId,'portugues');assert.equal(x.event.topicId,'pontuacao');
});
test('CSV de respostas escapa fórmulas e não repete tempo de estudo',async()=>{
 await basic({data:{front:'=HYPERLINK("x")\nPergunta, seguinte',back:'+SUM(A1)'}});const x=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0];await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});await loadAll();return buildFlashcardResponsesCSV();
 });assert.ok(x.includes('"\'=HYPERLINK(""x"")'));assert.ok(x.includes('"\'+SUM(A1)"'));assert.ok(!x.split('\r\n')[0].includes('minutos'));assert.ok(x.startsWith('\ufeff'));
});
test('excluir o registro temporal preserva respostas e remove o vínculo da sessão',async()=>{
 await basic();const x=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0];await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});const f=await FlashcardCommands.finish(r.id,{record:true,minutes:20});await SessionCommands.remove(f.sessionId);return {events:await DB.count('flashcardResponses'),run:await DB.get('flashcardRuns',r.id),sessions:await DB.count('sessions')};
 });assert.equal(x.events,1);assert.equal(x.sessions,0);assert.equal(x.run.sessionId,null);
});
test('duas abas não sobrescrevem resultados nem tempo de um roteiro',async()=>{
 const d=await page.evaluate(async()=>{const d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'exercises',minutes:10}],10);return GuidedReviewCommands.claim(d.id);});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 assert.equal(await other.evaluate(async d=>{try{await GuidedReviewCommands.update(d,r=>{r.elapsedMs=20000;return r;});return false;}catch(e){return true;}},d),true);
 assert.equal(await page.evaluate(async id=>(await DB.get('guidedReviews',id)).elapsedMs,d.id),0);
});
test('interface completa de roteiro registra resultados diferentes em uma sessão',async()=>{
 await page.evaluate(async()=>{const d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'exercises',minutes:5},{topicId:'fracoes',method:'exercises',minutes:5}],10);await openGuidedReviewPlayer(d.id);});
 await page.getByRole('button',{name:'Continuar roteiro',exact:true}).click();await page.locator('#guided-outcome').selectOption('remembered');await page.getByRole('button',{name:'Concluir esta atividade',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.guided-player h3')?.textContent==='Frações');
 await page.locator('#guided-outcome').selectOption('forgot');await page.getByRole('button',{name:'Concluir esta atividade',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.fc-progress')?.textContent.includes('2 realizadas'));
 await page.getByRole('button',{name:'Encerrar roteiro',exact:true}).click();await page.locator('#guided-result-minutes').fill('10');await page.getByRole('button',{name:'Registrar uma revisão',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);assert.equal(await page.evaluate(()=>state.sessions[0].minutes),10);
});
test('falha no editor conserva o texto e permite tentar novamente',async()=>{
 await page.evaluate(()=>openFlashcardEditor({type:'basic'}));await page.locator('#fc-edit-front').fill('Pergunta preservada');await page.locator('#fc-edit-back').fill('Resposta preservada');
 await page.evaluate(()=>{window.originalFCAtomic=DB.atomic;DB.atomic=async()=>{throw new Error('Falha sintética de IndexedDB');};});
 await page.getByRole('button',{name:'Salvar cartão',exact:true}).click();await page.getByText('Falha sintética de IndexedDB',{exact:true}).waitFor();assert.equal(await page.locator('#fc-edit-front').inputValue(),'Pergunta preservada');
 await page.evaluate(()=>{DB.atomic=window.originalFCAtomic;});await page.waitForTimeout(950);await page.getByRole('button',{name:'Salvar cartão',exact:true}).click();await page.getByRole('button',{name:'Ver meus cartões',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>state.flashcardNotes.length),1);
});
test('reabrir e duplicar conteúdo preenche textareas e preserva campos opcionais',async()=>{
 const note=await basic({type:'term',data:{front:'Roteador',back:'Encaminha pacotes.',hint:'Pense em redes',example:'Liga redes distintas.',explanation:'Uma explicação\ncom duas linhas.'}});
 await page.evaluate(note=>openFlashcardEditor({note}),note);
 assert.equal(await page.locator('#fc-edit-front').inputValue(),'Roteador');assert.equal(await page.locator('#fc-edit-back').inputValue(),'Encaminha pacotes.');assert.equal(await page.locator('#fc-edit-explanation').inputValue(),'Uma explicação\ncom duas linhas.');
 await page.getByRole('button',{name:'Salvar cartão',exact:true}).click();await page.getByRole('button',{name:'Ver meus cartões',exact:true}).click();
 assert.deepEqual(await page.evaluate(id=>state.flashcardNotes.find(n=>n.id===id).data,note.id),note.data);
 await page.evaluate(note=>openFlashcardEditor({type:'basic',copiedData:note.data,disciplineId:note.disciplineId}),note);assert.equal(await page.locator('#fc-edit-front').inputValue(),'Roteador');
});
test('F5 durante a prática libera a reserva e permite retomar imediatamente',async()=>{
 await basic({type:'term',direction:'both'});const id=await page.evaluate(async()=>{const r=await FlashcardCommands.begin();await openFlashcardPlayer(r.id);return r.id;});
 await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();await page.getByRole('button',{name:'Mostrar resposta',exact:true}).click();await page.locator('[data-rating="3"]').click();
 await page.waitForFunction(async id=>(await DB.get('flashcardRuns',id)).cursor===1,id);await page.reload();await page.waitForFunction(()=>state.ready);
 await page.evaluate(id=>openFlashcardPlayer(id),id);await page.getByRole('button',{name:'Continuar cartões',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>state.flashcardResponses.length),1);assert.equal(await page.evaluate(()=>state.sessions.length),0);
});
test('upgrade físico 1 → 2 cria stores e preserva registros existentes',async()=>{
 const old=await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:30,date:todayISO(),results:[{id:'q',kind:'questions',total:10,correct:8}]});await loadAll();return Backup.buildExport();});
 const fresh=await runtime.browser.newContext();try{
  const p=await fresh.newPage();await p.route('**/upgrade-fixture',route=>route.fulfill({contentType:'text/html',body:'<html lang="pt-BR"><title>Fixture</title></html>'}));await p.goto(runtime.url+'/upgrade-fixture');
  await p.evaluate(async old=>{
   await new Promise((resolve,reject)=>{
    const req=indexedDB.open('diarioEstudosDB',1);
    req.onupgradeneeded=()=>{
     const d=req.result;
     for(const store of ['meta','settings','areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines']){
      const s=d.createObjectStore(store,{keyPath:store==='meta'||store==='settings'?'key':'id'});
      const indexes={areas:['archived'],disciplines:['areaId','archived'],topics:['disciplineId','reviewDueDate','archived'],sessions:['date','disciplineId','topicId'],weeklyPlans:['weekStart'],deadlines:['date','disciplineId']}[store]||[];
      indexes.forEach(key=>s.createIndex(key,key,{unique:false}));
     }
    };
    req.onsuccess=()=>{
     const db=req.result,stores=['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines'],tx=db.transaction(stores.concat(['settings','meta']),'readwrite');
     stores.forEach(store=>old[store].forEach(row=>tx.objectStore(store).put(row)));
     const settings={...old.settings,seenWhatsNew:'7.2.0'};delete settings.flashcards;
     tx.objectStore('settings').put({key:'settings',value:settings});tx.objectStore('meta').put({key:'onboardingCompleted',value:true});
     tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);
    };req.onerror=()=>reject(req.error);
   });
  },old);
  await p.goto(runtime.url);await p.waitForFunction(()=>state.ready);
  const x=await p.evaluate(async()=>({version:IDB_VERSION,sessions:state.sessions,counts:await Promise.all(FLASHCARD_STORES.map(s=>DB.count(s)))}));
  assert.equal(x.version,2);assert.deepEqual(x.sessions,old.sessions);assert.ok(x.counts.every(n=>n===0));
 }finally{await fresh.close();}
});
test('backup exportado pela v7.2 original é importado com checksum e resultados íntegros',async()=>{
 const raw=require('./fixtures/backup-v7.2.json');assert.equal(raw.appVersion,'7.2.0');assert.equal(raw.schemaVersion,10);
 const x=await page.evaluate(async raw=>{const p=Backup.parseBackup(JSON.stringify(raw));await Backup.restoreInto(p.data);await loadAll();return {integrity:p.report.integrity,sessions:state.sessions,cards:state.flashcards.length};},raw);
 assert.equal(x.integrity,'ok');assert.deepEqual(x.sessions,raw.sessions);assert.equal(x.cards,0);
});
test('roteiro vazio pode ser encerrado sem criar obrigações ou estudos',async()=>{
 const x=await page.evaluate(async()=>{const d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'exercises',minutes:10}],10);await GuidedReviewCommands.closeWithoutStudy(d);await loadAll();return {drafts:reviewDrafts().length,sessions:state.sessions.length,finished:state.guidedReviews[0].finishedAt};});
 assert.equal(x.drafts,0);assert.equal(x.sessions,0);assert.ok(x.finished);
});
test('Análises mostra respostas sem exigir tempo registrado e respeita o recorte',async()=>{
 await basic({topicId:'pontuacao'});const x=await page.evaluate(async()=>{
  const r=await FlashcardCommands.begin(),c=state.flashcards[0];await FlashcardCommands.answer({runId:r.id,cursor:0,cardId:c.id,cardRev:c.rev,rating:3});await loadAll();
  applyAnalyticsQuery({periodPreset:'hoje',focus:'reviews'});
  return {text:$('#analytics-body').textContent,all:FlashcardModel.stats({from:todayISO(),to:todayISO()}).total,other:FlashcardModel.stats({disciplineIds:new Set(['matematica'])}).total,topic:FlashcardModel.stats({topicIds:new Set(['pontuacao'])}).total,minutes:AnalyticsEngine.query({periodPreset:'hoje'}).totals.minutes};
 });assert.equal(x.all,1);assert.equal(x.other,0);assert.equal(x.topic,1);assert.equal(x.minutes,0);assert.ok(x.text.includes('Suas respostas de cartões estão disponíveis acima.'));assert.ok(!x.text.includes('Ainda sem estudos'));
});
for(const [type,front,back]of [
 ['basic','Qual sinal encerra uma frase declarativa?','Ponto-final.'],
 ['term','Firewall','Sistema que controla tráfego conforme regras.'],
 ['language','Borrow','Pegar emprestado.'],
 ['cloze','A capital do Brasil é {{Brasília}}.',''],
 ['problem','Resolva 2x + 3 = 11.','x = 4.'],
 ['sequence','Quais são as etapas do teste?','Preparar\nExecutar\nConferir']
])test('criar, praticar e registrar pela interface: '+type,async()=>{
 await page.evaluate(type=>openFlashcardEditor({type}),type);await page.locator('#fc-edit-front').fill(front);if(back)await page.locator('#fc-edit-back').fill(back);
 await page.getByRole('button',{name:'Salvar cartão',exact:true}).click();await page.getByRole('button',{name:'Estudar agora',exact:true}).click();await page.getByRole('button',{name:'Começar cartões',exact:true}).click();
 await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();assert.equal(await page.locator('#fc-answer').count(),0);
 await page.getByRole('button',{name:'Mostrar resposta',exact:true}).click();assert.ok((await page.locator('#fc-answer').innerText()).includes(type==='cloze'?'Brasília':back.split('\n')[0]));
 await page.locator('[data-rating="3"]').click();await page.locator('#fc-result-min').fill('20');await page.getByRole('button',{name:'Registrar uma sessão de estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);assert.deepEqual(await page.evaluate(()=>({minutes:state.sessions[0].minutes,events:state.flashcardResponses.length,type:state.flashcardNotes[0].type,topics:state.sessions[0].topicEntries})),{minutes:20,events:1,type,topics:[]});
});
