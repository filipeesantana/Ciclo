const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const axe=require('axe-core');
const {start,open,seed}=require('./support.cjs');

(async()=>{
 const engine=process.env.BROWSER || 'chromium';
 const output=process.env.AUDIT_OUTPUT || path.resolve('test-results/next-generation');
 fs.mkdirSync(output,{recursive:true});
 const runtime=await start(engine);
 const report={engine,version:runtime.browser.version(),versions:[],errors:[],requests:[],layout:[],forms:[]};
 try{
  const {page,context}=await open(runtime);
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('request',req=>{if(/^https?:/.test(req.url())&&new URL(req.url()).origin!==runtime.url)report.requests.push(req.url());});
  await page.clock.setFixedTime(new Date('2026-11-20T17:20:00Z'));
  await seed(page);
  const after=await page.evaluate(()=>typeof openVisualReport==='function');
  report.versions.push(await page.evaluate(()=>APP_VERSION));
  await page.evaluate(async()=>{
   for(const [d,t,m,ago] of [['portugues','pontuacao',45,0],['matematica','fracoes',40,0],['portugues','crase',30,1],['matematica','fracoes',65,2],['portugues','crase',50,4]]){
    await SessionCommands.create({disciplineId:d,topicId:t,minutes:m,date:addDaysISO(todayISO(),-ago),comment:'Observação pessoal de treino.',
     results:[{id:'q',kind:'questions',total:15,correct:12}]});
   }
   await refresh();
  });
  await page.evaluate(axe.source);
  const shot=(name,fullPage=false)=>page.screenshot({path:path.join(output,name+'.png'),fullPage,animations:'disabled'});
  const check=async name=>{
   const data=await page.evaluate(async()=>({
    width:innerWidth,theme:document.documentElement.dataset.theme,
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(r=>({id:r.id,nodes:r.nodes.map(n=>n.target)}))
   }));
   report.layout.push({name,...data});
  };
  for(const theme of ['dark','light'])for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:width>=1000?1000:844});
   await page.evaluate(t=>{applyTheme(t);setView('today');},theme);
   await check('hoje');
   if(width!==320)await shot('hoje-'+theme+'-'+width);
   await page.locator('#fab').click();
   if(after)await page.locator('#rm-min').waitFor();
   report.forms.push(await page.evaluate(()=>{
    const form=document.querySelector('#modal-content');
    return {width:innerWidth,theme:document.documentElement.dataset.theme,height:form.scrollHeight,
      viewport:form.clientHeight,minutesVisible:!!document.querySelector('#rm-min').getClientRects().length};
   }));
   await check('registro');
   if(width!==320)await shot('registro-'+theme+'-'+width);
   await page.evaluate(()=>modalCloser());
   await page.evaluate(()=>setView('reviews'));
   await check('revisoes');
   if(width!==320)await shot('revisoes-'+theme+'-'+width);
   if(after){
    await page.getByRole('button',{name:'Agendar Uso da crase',exact:true}).click();
    await page.locator('#agenda-policy').selectOption('week');
    await check('agenda');
    if(width!==320)await shot('agenda-'+theme+'-'+width);
    await page.evaluate(()=>modalCloser());
   }
   await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'semana',focus:'overview'}));
   await check('resultados');
   if(width!==320)await shot('resultados-'+theme+'-'+width);
   if(after){
    await page.getByRole('button',{name:'Criar relatório',exact:true}).click();
    await page.locator('#report-preview').waitFor();
    await check('relatorio');
    if(width!==320)await shot('relatorio-'+theme+'-'+width);
    if(width===1440){
     await page.getByText('Blocos e privacidade',{exact:true}).click();
     await page.getByRole('checkbox',{name:'Distribuição por disciplina',exact:true}).check();
     await page.getByRole('checkbox',{name:'Mostrar nomes das disciplinas',exact:true}).check();
     await page.locator('#report-layout').selectOption(theme==='dark'?'painel':'editorial');
     await page.locator('#report-format').selectOption(theme==='dark'?'landscape':'portrait');
     const download=page.waitForEvent('download');
     await page.getByRole('button',{name:'Baixar PNG',exact:true}).click();
     await (await download).saveAs(path.join(output,'png-exportado-'+theme+'.png'));
    }
    await page.evaluate(()=>modalCloser());
   }
   await page.evaluate(async()=>{await startTimer('portugues',['crase'],[]);FocusMode.enter();});
   await check('foco');
   if(width!==320)await shot('foco-'+theme+'-'+width);
   if(after){
    await page.locator('#focus-presentation').click();
    await check('apresentacao');
    if(width!==320)await shot('apresentacao-'+theme+'-'+width);
   }
   await page.evaluate(()=>{FocusMode.exit();TimerService.clear();renderTimerBar();});
   await page.locator('#toasts .toast').first().waitFor({state:'hidden'});
  }
  await page.setViewportSize({width:1280,height:720});
  await page.evaluate(()=>{document.documentElement.style.zoom='2';setView('today');});
  await check('zoom-css-200');
  await shot('zoom-css-200');
  await context.close();
 }finally{
  fs.writeFileSync(path.join(output,'validacao.json'),JSON.stringify(report,null,2)+'\n');
  await runtime.close();
 }
 const failures=report.layout.filter(r=>r.overflow||r.violations.length);
 console.log(JSON.stringify({engine,checks:report.layout.length,failures,errors:report.errors,requests:report.requests}));
 assert.deepEqual(failures,[]);assert.deepEqual(report.errors,[]);assert.deepEqual(report.requests,[]);
})().catch(error=>{console.error(error);process.exitCode=1;});
