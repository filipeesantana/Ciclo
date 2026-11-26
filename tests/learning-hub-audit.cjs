// Real browser captures; run on the baseline before changing application files.
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
const {connectedFixture}=require('./connected-fixture.cjs');
const {hubFixture}=require('./learning-hub-fixture.cjs');
const phase=process.env.HUB_PHASE||'after';
const out=process.env.AUDIT_OUTPUT||path.resolve('audit/learning-hub-v83',phase);
(async()=>{
 const runtime=await start(process.env.BROWSER||'chromium');
 await fs.mkdir(out,{recursive:true});
 try{
  const {page,context}=await open(runtime);const errors=[],layouts=[],accessibility=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.clock.setFixedTime(new Date('2026-11-26T15:00:00Z'));
  await (phase==='before'?connectedFixture:hubFixture)(page);
  const capture=async name=>page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});
  for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[430,932],[390,844],[375,812],[320,640]]){
   await page.setViewportSize({width,height});
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>{applyTheme(theme);state.settings.theme=theme;setView('today');},theme);
    await capture('hoje-'+width+'-'+theme);
    const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,visibleBottom:Math.min(innerHeight,document.querySelector('#today-body').getBoundingClientRect().bottom),scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.scrollingElement.scrollHeight,
     controls:[...document.querySelectorAll('.today-act .tf-actions button,.quick-materials .material-row button,.today-continuation button,.wk-card')].map(n=>({name:n.textContent.trim(),bottom:n.getBoundingClientRect().bottom}))}));
    layouts.push({...layout,theme});assert.ok(layout.scrollWidth<=width+1,'Sem overflow horizontal em '+width);
    if(phase==='after' && width>=1024)assert.ok(layout.controls.every(n=>n.bottom<=layout.visibleBottom),'Ações e semana enquadradas em '+width+' × '+height);
   }
  }
  await page.setViewportSize({width:1366,height:768});
  await page.evaluate(()=>{applyTheme('light');setView('today');});
  await page.evaluate(require('axe-core').source);
  const axe=async name=>{const a=await page.evaluate(()=>axe.run(document.querySelector('.overlay.open')||document.querySelector('.view.active'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));accessibility.push({name,violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});};
  await axe('Hoje');
  await page.evaluate(()=>openCourseEditor(Learning.course('connected-c0')));await capture('cadastro-material');await axe('Editor');
  if(phase==='after'){
   await page.locator('#material-emoji').fill('👩🏽‍💻');
   await page.getByText('Escolher emoji',{exact:true}).click();await capture('emoji-seletor');await page.getByText('Escolher emoji',{exact:true}).click();
   await page.getByText('Disciplinas associadas',{exact:true}).click();
   await capture('emoji-disciplinas');
   await page.getByText('Disciplinas associadas',{exact:true}).click();
   await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();await page.locator('.course-discipline-content').first().scrollIntoViewIfNeeded();await capture('topicos-blocos');
  }
  await page.evaluate(()=>modalCloser());
  await page.evaluate(()=>openRegisterModal({mode:'timer',disciplineId:'connected-d0',contentEntries:[{disciplineId:'connected-d0',courseId:'connected-c0'}]}));
  await capture('estudo-configuracao');await axe('Estudo');
  await page.locator('#modal-actions').getByRole('button',{name:'Começar',exact:true}).click();await page.waitForFunction(()=>TimerService.isActive);
  await page.waitForFunction(()=>!document.querySelector('#toasts .toast'));
  if(phase==='after')for(const [width,height]of [[1366,768],[1280,720],[1024,768]]){
   await page.setViewportSize({width,height});
   const fit=await page.evaluate(()=>{const bottom=Math.min(innerHeight,document.querySelector('#today-body').getBoundingClientRect().bottom);return [...document.querySelectorAll('.today-act .tf-actions button,.quick-materials .material-row button,.wk-card')].every(n=>n.getBoundingClientRect().bottom<=bottom);});
   assert.ok(fit,'Ações acessíveis durante o estudo em '+width);await capture('sessao-ativa-'+width);
  }
  await page.setViewportSize({width:1366,height:768});
  await capture('sessao-ativa');await page.evaluate(()=>{TimerService.pause();renderTimerBar();});await capture('sessao-pausada');await page.evaluate(()=>{TimerService.resume();renderTimerBar();});await page.evaluate(()=>FocusMode.enter());await capture('foco');
  await page.evaluate(()=>FocusMode.setPresentation(true));await capture('apresentacao');
  await page.evaluate(()=>FocusMode.exit());
  await page.setViewportSize({width:390,height:844});await capture('sessao-mobile');
  await page.evaluate(()=>{ui.discTab='materials';setView('disciplines');});await capture('materiais-mobile');
  await page.evaluate(()=>openCourseEditor(Learning.course('connected-c0')));await capture('cadastro-mobile');await page.evaluate(()=>modalCloser());
  if(phase==='after'){
   const fresh=await open(runtime,{viewport:{width:1280,height:720}}),p=fresh.page;
   await p.evaluate(()=>{if(modalCloser)modalCloser();});await p.screenshot({path:path.join(out,'hoje-novo-usuario.png')});
   await seed(p);await p.screenshot({path:path.join(out,'hoje-sem-materiais.png')});
   await p.evaluate(async()=>{await Learning.save('courses',{name:'Administração GNU/Linux — terminal, redes, servidores e segurança para a prática diária',emoji:'👩🏽‍💻',disciplineIds:['portugues'],topicIds:[],url:'https://example.test/only'});});await p.screenshot({path:path.join(out,'hoje-um-material-nome-longo.png')});
   await p.evaluate(async()=>{state.settings.showDailyQuote=false;await saveSettings();renderToday();});await p.screenshot({path:path.join(out,'hoje-frase-oculta.png')});
   await p.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',date:todayISO(),minutes:45});await refresh();});await p.screenshot({path:path.join(out,'hoje-primeiro-estudo.png')});
   await p.evaluate(()=>{document.documentElement.style.zoom='1.25';});await p.screenshot({path:path.join(out,'hoje-zoom-css-125.png')});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await fresh.context.close();
  }
  const hashes=Object.fromEntries(await Promise.all(['app.js','learning.js','styles.css','index.html'].map(async f=>[f,require('node:crypto').createHash('sha256').update(await fs.readFile(f)).digest('hex')])));
  await fs.writeFile(path.join(out,'visual.json'),JSON.stringify({phase,browser:runtime.browser.version(),hashes,errors,layouts,accessibility},null,2));
  assert.deepEqual(errors,[]);if(phase==='after')assert.deepEqual(accessibility.flatMap(a=>a.violations),[]);
  await context.close();
 }finally{await runtime.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
