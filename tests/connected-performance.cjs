const fs=require('node:fs/promises');const path=require('node:path');const crypto=require('node:crypto');
const {start,open}=require('./support.cjs');const {connectedFixture}=require('./connected-fixture.cjs');
(async()=>{const runtime=await start(),results=[],out=process.env.AUDIT_OUTPUT||path.resolve('test-results/connected-performance');await fs.mkdir(out,{recursive:true});
try{for(const count of [100,1000,5000,10000]){const{page,context}=await open(runtime);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-11-25T15:00:00Z'));const dataset=await connectedFixture(page,count);
 const reload=performance.now();await page.reload();await page.waitForFunction(()=>state.ready);const reloadMs=performance.now()-reload;
 const metrics=await page.evaluate(async()=>{
  const renderSync={};for(const view of ['today','disciplines','reviews','analytics','history','plan']){renderSync[view]=[];for(let i=0;i<5;i++){DerivedCache.bump();AnalyticsEngine.invalidate();const t=performance.now();setView(view);renderSync[view].push(performance.now()-t);}}
  const measure=fn=>{const t=performance.now();const value=fn();return {ms:performance.now()-t,value};};
  AnalyticsEngine.invalidate();const query=measure(()=>AnalyticsEngine.query({periodPreset:'tudo',courseIds:['connected-c0'],blockIds:['connected-b0']}));
  const exportJSON=measure(()=>JSON.stringify(Backup.buildExport())),parse=measure(()=>Backup.parseBackup(exportJSON.value));
  const r=performance.now();await Backup.restoreInto(parse.value.data);const restoreMs=performance.now()-r;
  const canvas=document.createElement('canvas'),settings={format:'portrait',layout:'essencial',theme:'light',palette:'petroleo',accent:'#237461',background:'#eff6f0',title:'Meus estudos',subtitle:'',names:false,brand:true,signed:false,visible:new Set(REPORT_DEFAULT_BLOCKS),order:REPORT_BLOCKS.map(([id])=>id)};
  const pngStart=performance.now();drawVisualReport(canvas,visualReportModel(query.value,settings),settings);await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));const pngMs=performance.now()-pngStart;
  const visualStart=performance.now();applyAnalyticsQuery({periodPreset:'30d',scopeType:'discipline',scopeIds:['connected-d0']});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));const twoFramesMs=performance.now()-visualStart;
  return {renderSync,queryMs:query.ms,queryMinutes:query.value.totals.minutes,exportMs:exportJSON.ms,backupBytes:new Blob([exportJSON.value]).size,parseMs:parse.ms,restoreMs,pngMs,twoFramesMs,heapBytes:performance.memory?.usedJSHeapSize||null};
 });results.push({dataset,reloadMs,errors,...metrics});await context.close();}
 await fs.writeFile(path.join(out,'performance.json'),JSON.stringify({browser:runtime.browser.version(),sourceSha256:crypto.createHash('sha256').update(await fs.readFile('app.js')).digest('hex'),method:'Contextos sintéticos isolados. Cinco amostras síncronas por tela com caches invalidados. Reload até state.ready; dois rAF são oportunidade de pintura, não medição de apresentação nem FPS. PNG inclui desenho e codificação. Heap quando a API está disponível.',results},null,2));
 console.log(JSON.stringify(results.map(r=>({count:r.dataset.sessions,reload:r.reloadMs,query:r.queryMs,png:r.pngMs,errors:r.errors}))));if(results.some(r=>r.errors.length))process.exitCode=1;
}finally{await runtime.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
