const fs=require('node:fs');
const path=require('node:path');
const axe=require('axe-core');
const {start,open}=require('./support.cjs');
const {importUI,backup,reference,sha256}=require('./field-backup.cjs');
const out=process.env.AUDIT_OUTPUT||path.resolve(__dirname,'../test-results/field-review');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const runtime=await start(process.env.BROWSER||'chromium');
 const result={engine:process.env.BROWSER||'chromium',browser:runtime.browser.version(),fixtureSha256:sha256,errors:[],errorContexts:[],outgoing:[],layouts:[],reference:reference(backup.sessions)};
 let phase='início';
 try{
  const {page,context}=await open(runtime);
  page.on('pageerror',e=>{result.errors.push(e.message);result.errorContexts.push({phase,viewport:page.viewportSize(),message:e.message});});
  page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==runtime.url)result.outgoing.push(r.url());});
  await page.clock.install({time:new Date('2026-10-22T21:00:00Z')});
  phase='importação';await importUI(page);await page.evaluate(axe.source);
  for(const [name,run]of [['planejamento',()=>setView('plan')],['analises',()=>applyAnalyticsQuery({periodPreset:'tudo',focus:'overview'})]]){
   phase=name;
   await page.setViewportSize({width:1440,height:900});await page.evaluate(run);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
   await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,name+'-mobile.png'),fullPage:true});
  }
  await page.evaluate(()=>setView('plan'));
  if(await page.getByRole('button',{name:'Adicionar aos dias',exact:true}).count()){
   phase='seletor de dias';
   await page.getByRole('button',{name:'Adicionar aos dias',exact:true}).click();
   await page.locator('.wb-subject input').first().check();await page.locator('.wb-days input').nth(1).check();await page.locator('.wb-days input').nth(3).check();
   for(const theme of ['dark','light'])for(const width of [1440,390]){
    await page.evaluate(t=>applyTheme(t),theme);await page.setViewportSize({width,height:900});
    const a=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    result.layouts.push({view:'adicionar-aos-dias',theme,width,height:900,violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
    if(theme==='dark')await page.screenshot({path:path.join(out,'adicionar-aos-dias-'+width+'.png')});
   }
   await page.locator('#modal-actions').getByRole('button',{name:'Cancelar',exact:true}).click();
  }
  await page.evaluate(async()=>{
   setView('today');const ds=state.disciplines.slice(0,2),ts=state.topics.filter(t=>ds.some(d=>d.id===t.disciplineId)).slice(0,4);
   await startTimer(ds.map(d=>d.id),ts.map(t=>t.id),['laboratorio','projeto']);FocusMode.enter();
  });
  await page.clock.fastForward(42*60000);
  for(const theme of ['dark','light']){
   await page.evaluate(t=>applyTheme(t),theme);
   for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[768,1024],[430,932],[390,844],[375,667],[320,568],[844,390],[667,375]]){
    phase='foco '+theme+' '+width+'x'+height;
    await page.setViewportSize({width,height});
    const data=await page.evaluate(async()=>{
     const root=document.querySelector('#focus-root');
     const a=await axe.run(root,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
     return {overflow:root.scrollWidth>root.clientWidth+1,violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),clock:document.querySelector('#focus-clock').getBoundingClientRect().toJSON(),controls:[...document.querySelectorAll('#focus-actions button')].map(b=>({label:b.textContent,width:b.clientWidth,height:b.clientHeight})),scrollHeight:root.scrollHeight,height:root.clientHeight};
    });
    result.layouts.push({view:'foco-livre',theme,width,height,...data});
    if(theme==='dark'&&[1440,390,320].includes(width))await page.screenshot({path:path.join(out,'foco-'+width+'.png')});
   }
  }
  await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{applyTheme('dark');timerAct('break');});
  await page.clock.fastForward(8*60000);await page.screenshot({path:path.join(out,'foco-descanso.png')});
  await page.evaluate(()=>{FocusMode.exit();openFinishModal();});
  await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
  await page.waitForFunction(()=>!TimerService.isActive&&!Overlay.isOpen);
  await page.screenshot({path:path.join(out,'hoje-finalizado.png'),fullPage:true});
  result.todayAfterFinish=await page.locator('#tf-title').textContent();
  await context.close();
 }finally{
  fs.writeFileSync(path.join(out,'review.json'),JSON.stringify(result,null,2));await runtime.close();
 }
 console.log(JSON.stringify({engine:result.engine,layouts:result.layouts.length,violations:result.layouts.filter(x=>x.violations.length),overflows:result.layouts.filter(x=>x.overflow),errors:result.errors,outgoing:result.outgoing,todayAfterFinish:result.todayAfterFinish},null,2));
 if(result.errors.length||result.outgoing.length||result.layouts.some(x=>x.overflow||x.violations.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
