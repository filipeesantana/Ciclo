const fs=require('node:fs/promises');const path=require('node:path');const crypto=require('node:crypto');
const {start,open,root}=require('./support.cjs');const {connectedFixture}=require('./connected-fixture.cjs');const {hubFixture}=require('./learning-hub-fixture.cjs');
const out=process.env.AUDIT_OUTPUT||path.resolve('test-results/learning-hub-performance');
(async()=>{
 await fs.mkdir(out,{recursive:true});const runtime=await start();const results=[];
 try{
  for(const multi of (process.env.HUB_PHASE==='before'?[false]:[false,true]))for(const count of [1000,10000]){
   const {page,context}=await open(runtime);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const dataset=await (multi?hubFixture:connectedFixture)(page,count);
   const reload=performance.now();await page.reload();await page.waitForFunction(()=>state.ready);const reloadMs=performance.now()-reload;
   const metrics=await page.evaluate(async()=>{
    const times={};const sample=(key,fn)=>{const start=performance.now();fn();(times[key]||=[]).push(performance.now()-start);};
    for(let i=0;i<5;i++){
     for(const v of ['today','history','analytics']){DerivedCache.bump();AnalyticsEngine.invalidate();sample(v,()=>setView(v));}
     ui.discTab='materials';sample('catalog',()=>setView('disciplines'));
     sample('courseEditor',()=>openCourseEditor(Learning.course('connected-c0')));modalCloser();
     sample('studyForm',()=>openRegisterModal({disciplineId:'connected-d0'}));
     sample('courseSelection',()=>{const el=document.querySelector('#rm-material');el.value='connected-c0';el.dispatchEvent(new Event('change',{bubbles:true}));});modalCloser();
     // Same canonical study component, explicitly selecting two disciplines.
     sample('twoDisciplines',()=>openRegisterModal({disciplineIds:['connected-d0','connected-d1']}));modalCloser();
     openCourseEditor(Learning.course('connected-c0'));
     const query=document.querySelector('#material-topic-search');if(query)sample('topicSearch',()=>{query.value='Conteúdo 1';query.dispatchEvent(new Event('input',{bubbles:true}));});modalCloser();
    }
    const t=performance.now();const r=await SessionCommands.create({disciplineId:'connected-d0',minutes:45,date:todayISO(),contentEntries:[{disciplineId:'connected-d0',courseId:'connected-c0'}]});
    if(!r.ok)throw Error('Registro de desempenho falhou');times.record=[performance.now()-t];
    return times;
   });
   results.push({multi,dataset,reloadMs,errors,metrics});await context.close();
  }
  const hashes=Object.fromEntries(await Promise.all(['app.js','learning.js','styles.css','insights.js'].map(async f=>[f,crypto.createHash('sha256').update(await fs.readFile(path.join(root,f))).digest('hex')])));
  await fs.writeFile(path.join(out,'interactions.json'),JSON.stringify({browser:runtime.browser.version(),hashes,method:'Cinco amostras síncronas de interface, sem pintura. Seleção usa change nativo. Uma gravação real por cenário, em contextos sintéticos isolados. Carga multidisciplinar amplia apenas o catálogo; sessões antigas não mudam. Reload inclui HTTP local e IndexedDB. Não equivale a FPS, dispositivo físico ou pesquisa com estudantes.',results},null,2));
  if(results.some(r=>r.errors.length))throw Error('Erros de página na medição');
 }finally{await runtime.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
