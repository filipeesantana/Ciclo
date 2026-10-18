const fs=require('node:fs');
const path=require('node:path');
const {start,open,root}=require('./support.cjs');
const {workload}=require('./workload.cjs');
const out=process.env.AUDIT_OUTPUT || path.resolve(__dirname,'../test-results/benchmark');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const runtime=await start();const results=[],errors=[];
 try{
  for(const [name,days,count]of [['vazio',0,0],['iniciante',1,1],['30-dias',30,120],['12-semanas',84,420],['52-semanas',364,1820],['1000-dias',1000,5000]]){
   const {context,page}=await open(runtime);page.on('pageerror',e=>errors.push(name+': '+e.message));
   const counts=await workload(page,days,count);
   const before=performance.now();await page.reload();await page.waitForFunction(()=>state.ready);const reload=performance.now()-before;
   const perf={};
   for(const view of ['today','plan','reviews','disciplines','analytics','history','help','data','settings']){
    perf[view]=await page.evaluate(v=>{const samples=[];for(let i=0;i<5;i++){DerivedCache.bump();AnalyticsEngine.invalidate();const t=performance.now();setView(v);samples.push(performance.now()-t);}return samples;},view);
   }
   const data=await page.evaluate(async()=>{
    const time=fn=>{const t=performance.now();const value=fn();return {ms:performance.now()-t,value};};
    const backup=Backup.buildExport(),text=JSON.stringify(backup);
    const csv=time(()=>Backup.buildStudyCSV(state.sessions)).ms;
    if(!state.disciplines.length && !state.sessions.length){
      const t=performance.now();let refused=false;try{Backup.parseBackup(text);}catch(e){refused=!!e.fatal;}
      if(!refused)throw new Error('Backup vazio deveria ser recusado');
      return {csv,parse:performance.now()-t,restore:null,bytes:new Blob([text]).size,checksum:BackupIntegrity.verify(backup),emptyRefused:true,memory:performance.memory?.usedJSHeapSize||null};
    }
    const parsed=time(()=>Backup.parseBackup(text));
    const t=performance.now();await Backup.restoreInto(parsed.value.data);const restore=performance.now()-t;
    return {csv,parse:parsed.ms,restore,bytes:new Blob([text]).size,checksum:parsed.value.report.integrity,
      memory:performance.memory?.usedJSHeapSize||null};
   });
   if(count===5000){
    for(const [label,focus]of [['analytics','overview'],['resultados','results'],['evolucao','learning']]){
     await page.evaluate(f=>applyAnalyticsQuery({periodPreset:f==='overview'?'30d':'tudo',focus:f}),focus);
     await page.screenshot({path:path.join(out,label+'.png'),fullPage:true});
    }
    await page.setViewportSize({width:360,height:800});await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'30d',focus:'results'}));
    await page.screenshot({path:path.join(out,'resultados-mobile.png'),fullPage:true});
    await page.evaluate(()=>setView('plan'));await page.screenshot({path:path.join(out,'planejamento-mobile.png'),fullPage:true});
   }
   results.push({name,counts,reload,renderSync:perf,data});await context.close();
  }
  const sourceAppSha256=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'app.js'))).digest('hex');
  const report={sourceAppSha256,browser:runtime.browser.version(),method:'5 amostras por tela; JavaScript síncrono, sem incluir pintura. Reload inclui servidor local, inicialização e IndexedDB. Fixtures sintéticas, contextos descartáveis.',errors,results};
  fs.writeFileSync(path.join(out,'benchmark.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({out,errors,results:results.map(r=>({name:r.name,counts:r.counts,reload:r.reload,data:r.data}))},null,2));
  if(errors.length)process.exitCode=1;
 }finally{await runtime.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
