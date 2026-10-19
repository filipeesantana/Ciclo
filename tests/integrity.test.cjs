const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER || 'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});
afterEach(async()=>context.close());

test('120 minutos em duas disciplinas continuam sendo um estudo de 120 minutos',async()=>{
 const x=await page.evaluate(async()=>{
  const r=await SessionCommands.create({disciplines:[{disciplineId:'portugues',minutes:70},{disciplineId:'matematica',minutes:50}],minutes:120,date:todayISO(),types:['laboratorio','projeto']});
  await loadAll();const a=AnalyticsEngine.query({periodPreset:'hoje'});
  return {ok:r.ok,total:a.totals.minutes,count:a.totals.count,disc:SessionModel.discShares(r.session),types:SessionModel.typeShares(r.session)};
 });
 assert.equal(x.ok,true);assert.equal(x.total,120);assert.equal(x.count,1);
 assert.deepEqual(x.disc.map(s=>s.minutes),[70,50]);assert.equal(x.types.reduce((s,x)=>s+x.minutes,0),120);
});
test('divisão estimada de 90 minutos e tipos preserva totais e indica estimativa',async()=>{
 const x=await page.evaluate(()=>{
  const s=SessionModel.normalize(newSession({disciplineId:'portugues',minutes:90,topicEntries:[{topicId:'pontuacao'},{topicId:'crase'},{topicId:'terceiro'}],types:['laboratorio','projeto']}));
  return {topics:SessionModel.topicShares(s),types:SessionModel.typeShares(s)};
 });
 assert.deepEqual(x.topics.map(s=>s.minutes),[30,30,30]);assert.ok(x.topics.every(s=>s.estimated));assert.deepEqual(x.types.map(s=>s.minutes),[45,45]);
});
test('percentual ponderado é 51/101; zero não gera percentual',async()=>{
 const x=await page.evaluate(()=>[EvidenceModel.tally([{kind:'questions',total:1,correct:1},{kind:'questions',total:100,correct:50}]),EvidenceModel.tally([]),fmtPointDiff(80,60)]);
 assert.equal(x[0].correct,51);assert.equal(x[0].total,101);assert.ok(Math.abs(x[0].pct-50.495049504950494)<1e-10);assert.equal(x[1].pct,null);assert.equal(x[2],'+20 p.p.');
});
test('resultados sem disciplina específica não vazam para o recorte de uma disciplina',async()=>{
 const x=await page.evaluate(()=>{
  const s=SessionModel.normalize(newSession({disciplineId:'portugues',disciplineEntries:[{disciplineId:'portugues',minutes:70},{disciplineId:'matematica',minutes:50}],minutes:120,results:[{id:'a',kind:'questions',total:20,correct:15,disciplineId:null},{id:'b',kind:'questions',total:10,correct:5,disciplineId:'portugues'}]}));
  const p=SessionModel.project(s,{discIds:new Set(['portugues'])});return {minutes:p.minutes,results:p.results};
 });assert.equal(x.minutes,70);assert.deepEqual(x.results.map(r=>r.id),['b']);
});
test('revisão geral não altera os tópicos; revisão retroativa preserva a agenda atual',async()=>{
 const x=await page.evaluate(async()=>{
  const before=await DB.get('topics','pontuacao');
  await SessionCommands.create({disciplineId:'portugues',minutes:20,date:todayISO(),types:['revisao']});
  const general=await DB.get('topics','pontuacao');
  await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',reviewOutcome:'remembered',minutes:20,date:todayISO(),types:['revisao']});
  const current=await DB.get('topics','pontuacao');
  await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',reviewOutcome:'forgot',minutes:20,date:addDaysISO(todayISO(),-20),types:['revisao']});
  const retro=await DB.get('topics','pontuacao');
  return {before,general,current,retro};
 });assert.deepEqual(x.general,x.before);assert.equal(x.current.reviewDueDate,x.retro.reviewDueDate);assert.equal(x.current.masteryLevel,x.retro.masteryLevel);
});
test('excluir o único estudo reconcilia o tópico e os totais',async()=>{
 const x=await page.evaluate(async()=>{const r=await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:30,date:todayISO()});await SessionCommands.remove(r.session.id);await loadAll();return {topic:await DB.get('topics','pontuacao'),minutes:AnalyticsEngine.query({periodPreset:'hoje'}).totals.minutes};});
 assert.equal(x.topic.firstStudiedAt,null);assert.equal(x.topic.reviewDueDate,null);assert.equal(x.minutes,0);
});
test('finalização simultânea em duas abas grava uma única sessão',async()=>{
 await page.evaluate(()=>{TimerService.start(['portugues'],[],[]);TimerService.data.runId='same-run';TimerService._persist();});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 const finish=p=>p.evaluate(()=>SessionCommands.finalizeTimer({disciplineId:'portugues',minutes:40,date:todayISO()},'same-run'));
 const results=await Promise.all([finish(page),finish(other)]);
 assert.equal(results.filter(x=>x.ok).length,1);assert.equal(results.filter(x=>x.reason==='duplicate').length,1);
 assert.equal(await page.evaluate(()=>DB.count('sessions')),1);
});
test('edições conflitantes recusam a sobrescrita',async()=>{
 const x=await page.evaluate(async()=>{const {session}=await SessionCommands.create({disciplineId:'portugues',minutes:30,date:todayISO()});await SessionCommands.update(session.id,{comment:'Mudou na outra aba'},{base:session});const r=await SessionCommands.update(session.id,{comment:'Minha edição'},{base:session});return {reason:r.reason,stored:await DB.get('sessions',session.id)};});
 assert.equal(x.reason,'conflict');assert.equal(x.stored.comment,'Mudou na outra aba');
});
test('backup atual preserva resultados, pausas e Pomodoro; migração é idempotente',async()=>{
 const x=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',minutes:25,date:'2026-10-01',startedAt:'2026-10-01T12:00:00.000Z',endedAt:'2026-10-01T12:30:00.000Z',pausedMinutes:5,pomodoro:{blocks:1,focusMin:25,shortMin:5,longMin:15,every:4},results:[{id:'r',kind:'milestone',text:'Explicar crase com exemplos.'}]});
  await loadAll();const b=Backup.buildExport(),p=Backup.parseBackup(JSON.stringify(b));
  await Backup.restoreInto(p.data);await runSessionMigration();const a=await DB.getAll('sessions');await runSessionMigration();return {checksum:p.report.integrity,before:b.sessions,after:a,again:await DB.getAll('sessions')};
 });assert.equal(x.checksum,'ok');assert.deepEqual(x.after,x.before);assert.deepEqual(x.again,x.after);
});
test('versão futura, JSON truncado e IDs que colidem são recusados sem alterar o banco',async()=>{
 const x=await page.evaluate(()=>{
  const b=Backup.buildExport(),bad=[JSON.stringify({...b,schemaVersion:APP_SCHEMA_VERSION+1}),'{{',JSON.stringify({...b,disciplines:[{id:1,name:'A'},{id:' 1 ',name:'B'}]})];
  return bad.map(s=>{try{Backup.parseBackup(s);return false;}catch(e){return !!e.fatal;}});
 });assert.deepEqual(x,[true,true,true]);assert.equal(await page.evaluate(()=>DB.count('disciplines')),2);
});
test('restauração é atômica quando uma gravação falha depois da limpeza',async()=>{
 const x=await page.evaluate(async()=>{
  const b=Backup.parseBackup(JSON.stringify(Backup.buildExport())).data;b.disciplines.push({...b.disciplines[0]});
  try{await Backup.restoreInto(b);return false;}catch(e){return {count:await DB.count('disciplines'),name:(await DB.get('disciplines','portugues')).name};}
 });assert.deepEqual(x,{count:2,name:'Português'});
});
test('CSV escapa fórmulas e comentários com aspas, vírgulas e quebras; sem texto privado',async()=>{
 const x=await page.evaluate(()=>{
  const s=SessionModel.normalize(newSession({id:'csv',disciplineId:'portugues',minutes:30,comment:'=HYPERLINK("x")\nlinha, seguinte',results:[{id:'r',kind:'milestone',text:'Texto privado'}]}));
  return {cells:['=1',' +1','-1','@SUM(A1)','\tcmd'].map(x=>Backup.csvText(x)),with:Backup.buildStudyCSV([s]),without:Backup.buildStudyCSV([s],{includeComments:false})};
 });assert.ok(x.cells.every(c=>c.startsWith('"\'')));assert.ok(x.with.includes('""x""'));assert.ok(x.with.includes('\nlinha, seguinte'));assert.ok(!x.without.includes('Texto privado'));assert.ok(!x.without.includes('HYPERLINK'));assert.ok(x.with.startsWith('\ufeff'));
});
test('comentários são texto inerte e não criam HTML',async()=>{
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:30,date:todayISO(),comment:'<img src=x onerror="window.injected=true">'});await refresh();setView('history');openEditSessionModal(state.sessions[0].id);});
 assert.equal(await page.locator('#modal-box img').count(),0);assert.ok((await page.locator('#es-comment').inputValue()).includes('<img'));assert.equal(await page.evaluate(()=>window.injected),undefined);
});
test('datas civis respeitam bissexto, virada do ano e meia-noite em São Paulo',async()=>{
 const x=await page.evaluate(()=>({leap:isStrictISODate('2024-02-29'),invalid:isStrictISODate('2025-02-29'),next:addDaysISO('2026-12-31',1),local:localDateOfStamp('2026-10-18T01:30:00Z'),span:TimeRules.span(1430,12).minutes,rounding:TimeRules.distributeMinutes([25000,25000,25000])}));
 assert.deepEqual(x,{leap:true,invalid:false,next:'2027-01-01',local:'2026-10-17',span:22,rounding:[1,0,0]});
});

test('REGRESSÃO: pausar após suspensão aplica o limite do Pomodoro antes da pausa',async()=>{
 const x=await page.evaluate(()=>{
  const original=Date.now;let now=Date.now();Date.now=()=>now;
  try{TimerService.start(['portugues'],[],[],null,null,{pomodoro:{preset:'classic'}});now+=30*60000;TimerService.pause();return {study:TimerService.getElapsed()/60000,paused:TimerService.getPausedTotal()/60000,blocks:TimerService.data.pomo.done};}
  finally{TimerService.clear();Date.now=original;}
 });assert.deepEqual(x,{study:25,paused:5,blocks:1});
});
test('REGRESSÃO: um rascunho recupera descansos sem inflar o tempo líquido',async()=>{
 const x=await page.evaluate(()=>{
  const w=studyWhenFields({idPrefix:'test',draft:{mode:'time',date:'2026-10-01',start:'14:00',end:'15:00',minutes:'45',breaks:[{id:'b',start:'14:20',end:'14:35',minutes:'15'}]}});
  return {minutes:w.evaluate().minutes,snapshot:w.snapshot()};
 });assert.equal(x.minutes,45);assert.equal(x.snapshot.breaks.length,1);assert.equal(x.snapshot.breaks[0].start,'14:20');
});
test('REGRESSÃO: schema ilegível e truncamento de resultados são sinalizados',async()=>{
 const x=await page.evaluate(()=>{
  const b=Backup.buildExport();let refused=false;try{Backup.parseBackup(JSON.stringify({...b,schemaVersion:'10-corrompido'}));}catch(e){refused=!!e.fatal;}
  const codes=[];const r=EvidenceModel.cleanList(Array.from({length:31},(_,i)=>({id:'q'+i,kind:'questions',total:1,correct:1})),c=>codes.push(c));return {refused,length:r.length,codes};
 });assert.equal(x.refused,true);assert.equal(x.length,30);assert.ok(x.codes.includes('result-limit'));
});

test('REGRESSÃO: revisão de tópico sem autoavaliação não gera descoberta de revisão ausente',async()=>{
 const x=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:30,date:addDaysISO(todayISO(),-10)});
  await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:20,date:addDaysISO(todayISO(),-3),types:['revisao']});
  await loadAll();return InsightEngine.compute().filter(x=>x.id==='norev:pontuacao');
 });assert.deepEqual(x,[]);
});

test('REGRESSÃO: período em andamento não conta registros com data futura',async()=>{
 await page.clock.install({time:new Date('2026-10-14T15:00:00Z')});
 const x=await page.evaluate(async()=>{
  for(const date of ['2026-10-14','2026-10-16','2026-10-17','2026-10-18'])await SessionCommands.create({disciplineId:'portugues',minutes:40,date});
  await loadAll();const a=AnalyticsEngine.query({periodPreset:'semana'});return {minutes:a.totals.minutes,days:a.days,active:a.totals.activeDays,consistency:a.totals.consistency};
 });assert.equal(x.minutes,40);assert.equal(x.days,3);assert.equal(x.active,1);assert.ok(Math.abs(x.consistency-33.33333333333333)<1e-10);
});

test('REGRESSÃO: backup V2 normaliza referências numéricas e recusa duplicatas ambíguas',async()=>{
 const x=await page.evaluate(()=>{
  const raw={subjects:[{id:1,nome:'Português'}],logs:[{id:'old',subjectId:'1',date:'2025-03-01',minutos:40,tipo:'teoria'}]};
  const p=Backup.parseBackup(JSON.stringify(raw));let refused=false;
  try{Backup.parseBackup(JSON.stringify({...raw,subjects:[{id:1,nome:'Português'},{id:1,nome:'Matemática'}]}));}catch(e){refused=!!e.fatal;}
  return {minutes:p.data.sessions.reduce((m,s)=>m+s.minutes,0),count:p.data.sessions.length,refused};
 });assert.deepEqual(x,{minutes:40,count:1,refused:true});
});
test('backups dos schemas 6, 7 e 9 mantêm minutos e resultados de revisão',async()=>{
 const x=await page.evaluate(()=>[6,7,9].map(schemaVersion=>{
  const b=Backup.buildExport();delete b.integrity;b.schemaVersion=schemaVersion;
  const base={id:'legacy',disciplineId:'portugues',date:'2025-03-01',minutes:90,createdAt:'2025-03-01T12:00:00Z'};
  b.sessions=[schemaVersion===6?{...base,topicId:'pontuacao',type:'revisao',reviewOutcome:'remembered',reviewStrategyAtTime:'adaptive'}:
    {...base,topicEntries:[{topicId:'pontuacao',outcome:'remembered',strategy:'adaptive'}],types:['revisao']}];
  const p=Backup.parseBackup(JSON.stringify(b)).data.sessions[0];return {minutes:p.minutes,outcome:p.topicEntries[0].outcome,disc:p.disciplineEntries[0].disciplineId};
 }));assert.deepEqual(x,Array(3).fill({minutes:90,outcome:'remembered',disc:'portugues'}));
});
