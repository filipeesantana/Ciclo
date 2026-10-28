const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const axe=require('axe-core');const {start,open,seed,root}=require('./support.cjs');
const out=process.env.AUDIT_OUTPUT||path.join(root,'test-results/experience');fs.mkdirSync(out,{recursive:true});
(async()=>{const runtime=await start(process.env.BROWSER||'chromium');const report={browser:runtime.browser.version(),errors:[],layouts:[]};try{
 const {page,context}=await open(runtime);await seed(page);page.on('pageerror',e=>report.errors.push(e.message));
 const shot=async name=>page.screenshot({path:path.join(out,name+'.png'),fullPage:await page.evaluate(()=>!Overlay.isOpen)});
 await page.evaluate(()=>setView('today'));await shot('hoje-sem-estudo-sidebar');
 await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));await shot('registro');
 await page.getByRole('button',{name:/Adicionar comentário/}).click();await page.locator('#rm-comment').fill('Uma observação que permanece no registro.');await shot('comentario');
 await page.getByRole('button',{name:/Adicionar outra disciplina/}).click();await page.getByRole('option',{name:/Matemática/}).click();await shot('segunda-disciplina');
 await page.evaluate(()=>modalCloser?.());await page.evaluate(()=>setView('reviews'));await shot('revisoes');
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:40,date:todayISO()});await refresh();setView('today');});await shot('hoje-apos-estudo');
 await page.evaluate(async()=>{await startTimer(['portugues'],[],[]);});await shot('hoje-durante-estudo');await page.evaluate(()=>TimerService.clear());
 await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'hoje',focus:'overview'}));await shot('analises');
 await page.evaluate(axe.source);
 for(const theme of ['dark','light'])for(const width of [1920,1440,1366,1280,1024,768,430,390,375,320]){
  await page.setViewportSize({width,height:width<500?844:900});await page.evaluate(t=>applyTheme(t),theme);
  for(const view of ['today','reviews','analytics']){await page.evaluate(v=>setView(v),view);const r=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}));report.layouts.push({theme,width,view,...r});if(width===390||width===1440)await shot(view+'-'+theme+'-'+width);}
 }
 if(await page.evaluate(()=>typeof GuidedReviewCommands!=='undefined')){
  await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{applyTheme('dark');openGuidedReviewBuilder();});
  for(const id of ['pontuacao','crase','fracoes'])await page.locator('#guided-add').selectOption(id);
  await shot('roteiro-editor');
  await page.locator('#modal-actions').getByRole('button',{name:'Começar roteiro',exact:true}).click();await page.waitForSelector('.guided-player');await shot('roteiro-guiado');
  for(const theme of ['dark','light'])for(const width of [1440,1280,1024,768,430,390,375,320]){
   await page.setViewportSize({width,height:width<500?844:900});await page.evaluate(t=>applyTheme(t),theme);
   const r=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}));report.layouts.push({theme,width,view:'guided-player',...r});
   if(width===390)await shot('roteiro-'+theme+'-mobile');
  }
  await page.locator('#guided-outcome').selectOption('remembered');await page.waitForFunction(()=>state.meta.guidedReview.items[0].outcome==='remembered');
  await page.locator('#modal-actions').getByRole('button',{name:'Encerrar roteiro',exact:true}).click();await page.waitForSelector('#guided-result-minutes');await shot('roteiro-resultados');await page.evaluate(()=>modalCloser?.());
 }
 for(const theme of ['dark','light'])for(const width of [1440,1280,1024,768,430,390,375,320]){
  await page.setViewportSize({width,height:width<500?844:900});await page.evaluate(t=>{applyTheme(t);openRegisterModal({disciplineId:'portugues'});},theme);
  for(const state of ['registro','comentario']){
   if(state==='comentario'){await page.getByRole('button',{name:/Adicionar comentário/}).click();await page.locator('#rm-comment').fill('Comentário no celular e no computador.');}
   const r=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}));report.layouts.push({theme,width,view:state,...r});if(width===390)await shot(state+'-'+theme+'-mobile');
  }await page.evaluate(()=>modalCloser?.());
 }
 await page.setViewportSize({width:1280,height:720});await page.evaluate(()=>{document.documentElement.style.zoom='2';setView('today');});
 report.layouts.push({view:'zoom-css-200',width:1280,theme:'light',overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:[]});await shot('zoom-200');
 await context.close();
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));await runtime.close();}console.log(JSON.stringify({checks:report.layouts.length,errors:report.errors,failures:report.layouts.filter(r=>r.overflow||r.violations.length)}));assert.equal(report.errors.length,0);assert.ok(report.layouts.every(r=>!r.overflow&&!r.violations.length));})().catch(e=>{console.error(e);process.exitCode=1});
