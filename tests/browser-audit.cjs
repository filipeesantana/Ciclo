const fs=require('node:fs');
const path=require('node:path');
const axe=require('axe-core');
const {start,open,seed,root}=require('./support.cjs');
(async()=>{
 const runtime=await start(process.env.BROWSER || 'chromium');
 const out=process.env.AUDIT_OUTPUT || path.join(root,'test-results/browser-audit');fs.mkdirSync(out,{recursive:true});
 try {
  const {context,page}=await open(runtime);const errors=[],outgoing=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/^https?:/.test(r.url()) && new URL(r.url()).origin!==runtime.url)outgoing.push(r.url());});
  await seed(page);
  await page.evaluate(async()=>{
   await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:40,date:todayISO(),results:[{id:'q',kind:'questions',total:20,correct:17},{id:'m',kind:'milestone',text:'Explicar a pontuação de um parágrafo.'}]});
   await SessionCommands.create({disciplineId:'matematica',topicId:'fracoes',minutes:70,date:addDaysISO(todayISO(),-3),breaks:[{id:'b',minutes:10}],results:[{id:'q2',kind:'questions',total:10,correct:6},{id:'c',kind:'concept',label:'Frações',status:'partial'}]});
   await DB.put('plans',{...newPlan('Rotina',300),id:'plan',allocations:[{disciplineId:'portugues',targetMinutes:150},{disciplineId:'matematica',targetMinutes:150}]});
   await refresh();
  });
  await page.evaluate(axe.source);
  const results=[];
  for(const theme of ['dark','light']) for(const width of [1440,360]) {
   await page.setViewportSize({width,height:width===360?800:1000});
   await page.evaluate(t=>applyTheme(t),theme);
   for(const view of ['today','plan','reviews','disciplines','analytics','history','help','data','settings']) {
    await page.evaluate(v=>setView(v),view);
    const r=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,
     ...(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))}));
    results.push({theme,width,view,overflow:r.overflow,violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}))});
   }
   for(const focus of ['time','consistency','distribution','topics','types','rest','planning','reviews','content','deadlines','results','learning','compare']){
    await page.evaluate(f=>applyAnalyticsQuery({periodPreset:'30d',focus:f}),focus);
    const r=await page.evaluate(async()=>({overflow:document.documentElement.scrollWidth>innerWidth,...(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))}));
    results.push({theme,width,view:'analytics:'+focus,overflow:r.overflow,violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}))});
   }
  }
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>applyTheme('dark'));
  for(const [name,action] of [['register',()=>openRegisterModal()],['start',()=>openRegisterModal({mode:'timer'})],['discipline',()=>openDisciplineModal(null)],['topic',()=>openTopicModal('portugues')],['deadline',()=>openDeadlineModal(null)],['first-use',()=>openWelcome()],['ai-report',()=>openAIReportModal()]]) {
   await page.evaluate(action);await page.waitForTimeout(60);
   const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
   results.push({view:name,theme:'dark',width:1440,violations:r.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}))});
   await page.evaluate(()=>modalCloser?.());
  }
  const articles=await page.evaluate(()=>{
    setView('help');const out=[];
    for(const a of HELP_ARTICLES){try {helpGo({kind:'article',id:a.id});out.push({id:a.id,title:a.title,ok:!!document.querySelector('#help-body').textContent.includes(a.title)});}catch(e){out.push({id:a.id,ok:false,error:e.message});}}
    return out;
  });
  fs.writeFileSync(out+'/results.json',JSON.stringify({engine:process.env.BROWSER || 'chromium',version:runtime.browser.version(),errors,outgoing,results,articles},null,2));
  console.log(JSON.stringify({checks:results.length,violations:results.filter(r=>r.violations.length).map(r=>({theme:r.theme,width:r.width,view:r.view,rules:r.violations.map(v=>v.id)})),overflows:results.filter(r=>r.overflow).map(r=>({theme:r.theme,width:r.width,view:r.view})),articles:articles.length,articleFailures:articles.filter(a=>!a.ok),errors,outgoing,out},null,2));
  if(errors.length || outgoing.length || results.some(r=>r.violations.length || r.overflow) || articles.some(a=>!a.ok)) process.exitCode=1;
  await context.close();
 } finally {await runtime.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
