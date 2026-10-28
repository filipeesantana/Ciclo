const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {start,open}=require('./support.cjs');
const {backup,buffer,sha256,reference,shares,importUI}=require('./field-backup.cjs');
const expected=reference(backup.sessions);
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{
 ({context,page}=await open(runtime));
 await page.clock.install({time:new Date('2026-10-22T21:00:00Z')});
});
afterEach(async()=>context.close());
test('365 dias: importar pela interface preserva todos os registros sem reparos',async()=>{
 const preview=await importUI(page,{preview:async()=>{
  if(process.env.AUDIT_OUTPUT){fs.mkdirSync(process.env.AUDIT_OUTPUT,{recursive:true});await page.screenshot({path:path.join(process.env.AUDIT_OUTPUT,'previa-365.png'),fullPage:true});}
 }});
 assert.match(preview,/nenhum ajuste necessário/);assert.match(preview,/Soma de verificação conferida/);assert.match(preview,/911/);
 const data=await page.evaluate(()=>Backup.buildExport());
 for(const key of ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines']){
  assert.equal(data[key].length,backup[key].length,key);
  assert.equal(new Set(data[key].map(x=>x.id)).size,backup[key].length,'IDs únicos: '+key);
  const byId=new Map(data[key].map(x=>[x.id,x]));
  for(const source of backup[key]){
   const stored=byId.get(source.id);
   for(const field of Object.keys(source)){
    if(key==='weeklyPlans'&&field==='blocks'){
     // O contrato já existente normaliza ordem GLOBAL para ordem por DIA.
     const withoutOrder=b=>Object.fromEntries(Object.entries(b).filter(([k])=>k!=='order'));
     const sorted=bs=>bs.map(withoutOrder).sort((a,b)=>a.id.localeCompare(b.id));
     assert.deepEqual(sorted(stored.blocks),sorted(source.blocks));
     for(const date of new Set(source.blocks.map(b=>b.date))){
      const ids=bs=>bs.filter(b=>b.date===date).sort((a,b)=>a.order-b.order).map(b=>b.id);
      assert.deepEqual(ids(stored.blocks),ids(source.blocks));
     }
    }else assert.deepEqual(stored[field],source[field],key+'/'+source.id+'/'+field);
   }
  }
 }
 const actual=reference(data.sessions);assert.deepEqual(actual,expected);
 const report=await page.evaluate(text=>Backup.parseBackup(text).report,buffer.toString());
 assert.deepEqual(report.repaired,[]);assert.deepEqual(report.ignored,[]);
 if(process.env.AUDIT_OUTPUT)fs.writeFileSync(path.join(process.env.AUDIT_OUTPUT,'importacao-365.json'),JSON.stringify({sha256,report,sourceFieldsPreserved:true,normalization:'Ordem dos blocos canônica por dia; identidades, conteúdo e ordem relativa preservados.',expected,actual},null,2));
});
test('365 dias: Análises confere tempo, descansos, dias, questões e todas as disciplinas',async()=>{
 await importUI(page);
 const a=await page.evaluate(()=>{const a=AnalyticsEngine.query({periodPreset:'tudo'});return {totals:a.totals,rest:a.rest,questions:a.results.questions,byDiscipline:a.byDiscipline,byType:a.byType,reviews:a.reviews};});
 assert.equal(a.totals.count,expected.count);assert.equal(a.totals.minutes,expected.minutes);assert.equal(a.totals.activeDays,expected.activeDays);
 assert.equal(a.rest.minutes,expected.rest);assert.equal(a.questions.total,expected.questions);assert.equal(a.questions.correct,expected.correct);assert.equal(a.questions.pct,expected.pct);
 assert.deepEqual(Object.fromEntries(a.byDiscipline.map(x=>[x.key,x.minutes])),expected.byDiscipline);
 assert.equal(a.byDiscipline.reduce((n,x)=>n+x.estimated,0),expected.estimatedMinutes);
 assert.equal(a.byType.reduce((n,x)=>n+x.minutes,0),expected.minutes);
 for(const [type,count]of Object.entries(expected.byType))assert.equal(a.byType.find(x=>x.key===type).count,count,type);
 for(const d of backup.disciplines){
  const got=await page.evaluate(id=>{const a=AnalyticsEngine.query({periodPreset:'tudo',scopeType:'discipline',scopeIds:[id]});return {minutes:a.totals.minutes,questions:a.results.questions};},d.id);
  assert.equal(got.minutes,expected.byDiscipline[d.id],d.name);
  const qs=backup.sessions.flatMap(s=>(s.results||[]).filter(q=>q.kind==='questions'&&q.disciplineId===d.id));
  assert.equal(got.questions.total,qs.reduce((n,q)=>n+q.total,0),d.name);
 }
});
test('365 dias: 53 semanas preservam metas históricas, datas e totais reais',async()=>{
 await importUI(page);
 const weeks=await page.evaluate(()=>state.weeklyPlans.map(w=>{
  const view=WeekPlan.view(w.weekStart),p=WeekPlan.progress(view);
  return {id:w.id,goal:planWeekGoal(view),real:Array.from(p.realWeek.values()).reduce((a,b)=>a+b,0),blocks:view.blocks.length};
 }));
 for(const w of weeks){const source=backup.weeklyPlans.find(x=>x.id===w.id);assert.equal(w.goal,source.availableMinutes,w.id);assert.equal(w.real,backup.sessions.filter(s=>s.date>=source.weekStart&&s.date<=source.weekEnd).reduce((n,s)=>n+s.minutes,0),w.id);assert.equal(w.blocks,source.blocks.length,w.id);}
 for(let offset=0;offset>=-52;offset--){
  await page.evaluate(n=>{ui.planWeekOffset=n;setView('plan');},offset);
  assert.equal(await page.locator('.wk-grid').count(),1);
 }
 assert.equal(await page.evaluate(()=>state.weeklyPlans.length),53);
});
test('365 dias: comparação parcial e completa usa os intervalos que declara',async()=>{
 await importUI(page);
 for(const mode of ['partial','complete']){
  const got=await page.evaluate(mode=>{const w=AnalyticsEngine.weekCompare({type:'all'},mode);return {cur:{minutes:w.cur.minutes,from:dateToISO(w.cur.range.start),to:dateToISO(w.cur.range.end)},prev:{minutes:w.prev.minutes,from:dateToISO(w.prev.range.start),to:dateToISO(w.prev.range.end)}};},mode);
  for(const side of ['cur','prev']){
   assert.equal(got[side].minutes,backup.sessions.filter(s=>s.date>=got[side].from&&s.date<=got[side].to).reduce((n,s)=>n+s.minutes,0));
   assert.equal(1+(Date.parse(got[side].to)-Date.parse(got[side].from))/86400000,mode==='complete'?7:4);
  }
 }
});
test('365 dias: exportar, restaurar em outro contexto e F5 conservam o histórico',async()=>{
 await importUI(page);
 const exported=await page.evaluate(()=>JSON.stringify(Backup.buildExport()));
 const second=await open(runtime);
 await second.page.clock.install({time:new Date('2026-10-22T21:00:00Z')});
 try{
  await second.page.evaluate(text=>{modalCloser?.();beginRestore(text,'ida-e-volta.json');},exported);
  await second.page.locator('#modal-actions').getByRole('button',{name:'Restaurar',exact:true}).click();
  await second.page.waitForFunction(()=>state.sessions.length===911);
  await second.page.reload();await second.page.waitForFunction(()=>state.ready);
  const again=await second.page.evaluate(()=>Backup.buildExport());
  assert.deepEqual(reference(again.sessions),expected);
  for(const key of ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines'])assert.deepEqual(again[key],JSON.parse(exported)[key]);
 }finally{await second.context.close();}
});
test('365 dias: editar e excluir um estudo conserva totais sem multiplicar vínculos',async()=>{
 await importUI(page);const s=backup.sessions.find(s=>s.disciplineEntries.length>1);
 const r=await page.evaluate(async s=>{
  const base=await DB.get('sessions',s.id);
  const edit=await SessionCommands.update(s.id,{minutes:s.minutes+30,disciplineEntries:base.disciplineEntries.map(d=>({...d,minutes:null})),topicEntries:base.topicEntries.map(t=>({...t,minutes:null})),comment:'Edição de auditoria'},{base});
  await refresh();const edited=AnalyticsEngine.query({periodPreset:'tudo'}).totals;
  const removal=await SessionCommands.remove(s.id);await refresh();return {edit:edit.ok,removal:removal.ok,edited,removed:AnalyticsEngine.query({periodPreset:'tudo'}).totals};
 },s);
 assert.equal(r.edit,true);assert.equal(r.removal,true);assert.equal(r.edited.minutes,expected.minutes+30);assert.equal(r.edited.count,911);
 assert.equal(r.removed.minutes,expected.minutes-s.minutes);assert.equal(r.removed.count,910);
});
test('entradas adversariais e restauração inválida preservam o banco existente',async()=>{
 await importUI(page);
 const r=await page.evaluate(text=>{
  const original=JSON.parse(text),out=[];
  const cases=[['json','{'],['schema',JSON.stringify({...original,schemaVersion:999})],['duplicado',JSON.stringify({...original,sessions:[original.sessions[0],{...original.sessions[0],minutes:999}]})]];
  for(const [name,value]of cases){try{Backup.parseBackup(value);out.push({name,refused:false});}catch(e){out.push({name,refused:!!e.fatal});}}
  const bad=JSON.parse(text);delete bad.integrity;bad.sessions[0].date='2026-02-30';bad.sessions[1].disciplineId='orfa';bad.sessions[1].disciplineEntries=[{disciplineId:'orfa',minutes:null}];bad.sessions[1].topicEntries=[];bad.sessions[1].results=[];
  const parsed=Backup.parseBackup(JSON.stringify(bad));return {out,ignored:parsed.report.ignored,counts:parsed.report.counts};
 },buffer.toString());
 assert.ok(r.out.every(x=>x.refused));assert.ok(r.ignored.length>0);assert.equal(await page.evaluate(()=>DB.count('sessions')),911);
 await page.evaluate(()=>setView('data'));
 await page.locator('#import-file').setInputFiles({name:'truncado.json',mimeType:'application/json',buffer:Buffer.from('{')});
 await page.getByRole('button',{name:'Entendi',exact:true}).waitFor();
 assert.match(await page.locator('#modal-box').textContent(),/Nada foi alterado/);
 assert.equal(await page.evaluate(()=>DB.count('sessions')),911);
 await page.getByRole('button',{name:'Entendi',exact:true}).click();
 const long=await page.evaluate(text=>{const b=JSON.parse(text);delete b.integrity;b.sessions[0].comment='x'.repeat(500000);const p=Backup.parseBackup(JSON.stringify(b));return p.data.sessions.find(s=>s.id===b.sessions[0].id).comment.length;},buffer.toString());
 assert.equal(long,500000);
 const result=await page.evaluate(()=>SessionCommands.create({disciplineId:state.disciplines[0].id,date:todayISO(),minutes:20,comment:'<img src=x onerror="window.injected=1">\n=1+1\n& “aspas”'}));
 assert.equal(result.ok,true);await page.evaluate(async()=>{await refresh();setView('history');});
 assert.equal(await page.locator('#history-body img').count(),0);assert.equal(await page.evaluate(()=>window.injected),undefined);
});
