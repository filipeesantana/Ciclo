const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {start,open,root}=require('./support.cjs');
const {backup,buffer,reference,importUI}=require('./field-backup.cjs');
const {stress}=require('./field-stress.cjs');
const out=process.env.AUDIT_OUTPUT||path.resolve(__dirname,'../test-results/field-performance');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const runtime=await start(process.env.BROWSER||'chromium');
 const report={browser:runtime.browser.version(),sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'app.js'))).digest('hex'),method:'5 renderizações síncronas por tela, cache invalidado. UI de importação, reload até state.ready. Não mede pintura nem desempenho de aparelho real.',results:[],errors:[]};
 try{
  for(const count of (process.env.CICLO_PERF_COUNTS?process.env.CICLO_PERF_COUNTS.split(',').map(Number):[911,1822,2733,5000,10000])){
   const data=count===911?backup:stress(count),expected=reference(data.sessions),bytes=count===911?buffer:Buffer.from(JSON.stringify(data));
   const {page,context}=await open(runtime);page.setDefaultTimeout(30000);page.on('pageerror',e=>report.errors.push(e.message));
   await page.clock.install({time:new Date('2026-10-22T21:00:00Z')});
   const t=performance.now();const preview=await importUI(page,{count,buffer:bytes,name:'sintetico-'+count+'.json'});const importMs=performance.now()-t;
   assert.match(preview,/nenhum ajuste necessário/);
   const q=await page.evaluate(()=>{const a=AnalyticsEngine.query({periodPreset:'tudo'});return {count:a.totals.count,minutes:a.totals.minutes,questions:a.results.questions,rest:a.rest.minutes,rhythmWeeks:a.weeklyRhythm.length,first:dateToISO(a.range.start),last:dateToISO(a.range.end),resultWeeks:a.results.weeks.length};});
   assert.equal(q.count,count);assert.equal(q.minutes,expected.minutes);assert.equal(q.rest,expected.rest);assert.equal(q.questions.total,expected.questions);
   const monday=value=>{const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d;};
   const expectedWeeks=1+(monday(q.last)-monday(q.first))/(7*86400000);
   // Em comparação com o código anterior, registra o corte sem abortar a medição.
   const seriesComplete=q.rhythmWeeks===expectedWeeks&&q.resultWeeks===expectedWeeks;
   const p=performance.now();await page.reload();await page.waitForFunction(()=>state.ready);const reloadMs=performance.now()-p;
   const timings=await page.evaluate(async()=>{
    const render={};for(const view of ['today','plan','history','analytics','reviews','data','help','settings','disciplines']){
     render[view]=[];for(let i=0;i<5;i++){DerivedCache.bump();AnalyticsEngine.invalidate();const t=performance.now();setView(view);render[view].push(performance.now()-t);}
    }
    const time=fn=>{const t=performance.now();fn();return performance.now()-t;};
    const exportMs=time(()=>JSON.stringify(Backup.buildExport()));
    const csvMs=time(()=>Backup.buildStudyCSV(state.sessions));
    const text=JSON.stringify(Backup.buildExport());const parseMs=time(()=>Backup.parseBackup(text));
    const restoreStart=performance.now();await Backup.restoreInto(Backup.parseBackup(text).data);const restoreMs=performance.now()-restoreStart;
    setView('history');const searchMs=time(()=>{ui.history.search='laboratório';renderHistoryTable();});
    const filterMs=time(()=>{ui.history.search='';ui.history.disciplineId=state.disciplines[0].id;renderHistoryTable();});
    const queryColdMs=time(()=>{AnalyticsEngine.invalidate();AnalyticsEngine.query({periodPreset:'tudo',scopeType:'discipline',scopeIds:[state.disciplines[0].id]});});
    const timer=performance.now();TimerService.start([state.disciplines[0].id],[],[]);TimerService.forget();TimerService.restore();const recoverMs=performance.now()-timer;TimerService.clear();
    return {render,exportMs,csvMs,parseMs,restoreMs,searchMs,filterMs,queryColdMs,recoverMs,memoryBytes:performance.memory?.usedJSHeapSize||null};
   });
   report.results.push({count,weeklyPlans:data.weeklyPlans.length,bytes:bytes.length,importMs,reloadMs,checks:q,seriesComplete,expected:{weeks:expectedWeeks,minutes:expected.minutes,questions:expected.questions,rest:expected.rest},...timings});
   fs.writeFileSync(path.join(out,'performance.json'),JSON.stringify(report,null,2));
   console.log(JSON.stringify({count,importMs,reloadMs,rhythmWeeks:q.rhythmWeeks,resultWeeks:q.resultWeeks,first:q.first,last:q.last}));await context.close();
  }
 }finally{await runtime.close();}
 if(report.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
