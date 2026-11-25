const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const {start,open}=require('./support.cjs');
const {connectedFixture}=require('./connected-fixture.cjs');
const out=process.env.AUDIT_OUTPUT||path.resolve('test-results/connected');
(async()=>{
 const sourceSha256=Object.fromEntries(await Promise.all(['app.js','learning.js','dates.js','insights.js','reviews.js','reports.js','styles.css'].map(async file=>[file,require('node:crypto').createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
 await fs.mkdir(out,{recursive:true});const engine=process.env.BROWSER||'chromium',runtime=await start(engine),errors=[],measurements=[],accessibility=[];
 try{
  const {page,context}=await open(runtime);page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
  await page.clock.setFixedTime(new Date('2026-11-25T15:00:00Z'));const dataset=await connectedFixture(page);
  const shots=async(name)=>{
   await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});
   const m=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.scrollingElement.scrollHeight}));
   assert.ok(m.scroll<=m.width+1,name+' sem overflow horizontal');measurements.push({name,...m});
  };
  await page.evaluate(require('axe-core').source);
  for(const [width,height,label]of [[1366,768,'desktop'],[390,844,'mobile']]){
   await page.setViewportSize({width,height});
   for(const theme of ['light','dark']){
    await page.evaluate(theme=>{state.settings.theme=theme;applyTheme(theme);},theme);
    const suffix=label+'-'+theme;
    for(const [view,name,tab]of [['today','hoje'],['disciplines','disciplinas','disciplines'],['disciplines','disciplina-detalhe','detail'],['disciplines','materiais','materials'],['disciplines','blocos','blocks'],['plan','planejamento'],['disciplines','prazos','deadlines'],['reviews','revisoes'],['analytics','resultados'],['history','historico']]){
     await page.evaluate(({view,tab})=>{if(tab){ui.discTab=tab==='detail'?'disciplines':tab;ui.discNav={level:'root'};}setView(view);if(tab==='detail')openDisciplineDetail('connected-d0');if(view==='analytics')applyAnalyticsQuery({periodPreset:'30d'});if(view==='reviews'){ui.learningReviews.filter='all';renderReviews();}},{view,tab});
     await shots(name+'-'+suffix);
     if(label==='desktop'&&theme==='light'&&['materiais','blocos','revisoes','resultados'].includes(name)){
      const result=await page.evaluate(()=>axe.run(document.querySelector('.view.active'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
      accessibility.push({name,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
     }
    }
    await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'30d',scopeType:'discipline',scopeIds:['connected-d0'],courseIds:['connected-c0']}));await shots('resultados-filtrados-'+suffix);
    await page.locator('.insight-bar').last().focus();await shots('grafico-foco-'+suffix);
    await page.evaluate(()=>openResultsPeriod());await shots('periodo-'+suffix);await page.locator('#modal-actions').getByRole('button',{name:'Cancelar',exact:true}).click();
    await page.evaluate(()=>openRegisterModal({disciplineId:'connected-d0',topicIds:Learning.block('connected-b0').topicIds,contentEntries:[{disciplineId:'connected-d0',courseId:'connected-c0',blockId:'connected-b0',topicIds:Learning.block('connected-b0').topicIds}]}));
    await shots('registro-'+suffix);await page.evaluate(()=>modalCloser());
    await page.evaluate(()=>setView('plan'));await page.getByRole('button',{name:'Escolher dia',exact:true}).click();await shots('planejamento-calendario-'+suffix);await page.locator('#modal-actions').getByRole('button',{name:'Cancelar',exact:true}).click();
    await page.evaluate(()=>openDeadlineModal(null));await page.getByRole('button',{name:/Abrir calendário: Data/}).first().click();await shots('prazo-calendario-'+suffix);await page.evaluate(()=>modalCloser());
    await page.evaluate(()=>openCourseEditor());await shots('cadastro-material-'+suffix);await page.evaluate(()=>modalCloser());
    await page.evaluate(()=>openContentBlockEditor(Learning.block('connected-b0')));await shots('editor-bloco-'+suffix);await page.evaluate(()=>modalCloser());
    await page.evaluate(()=>openCivilDate({title:'Consultar agenda de revisão',value:todayISO(),onApply:()=>{}}));await shots('agenda-calendario-'+suffix);await page.evaluate(()=>modalCloser());
    await page.evaluate(()=>openVisualReport(ui.analyticsQuery));await page.locator('#report-preview').waitFor({state:'visible'});await shots('relatorio-'+suffix);
    if(label==='desktop'&&theme==='light'){const download=page.waitForEvent('download');await page.getByRole('button',{name:'Baixar PNG'}).click();await(await download).saveAs(path.join(out,'relatorio-exportado.png'));}
    await page.evaluate(()=>modalCloser());
   }
  }
  const backup=await page.evaluate(()=>{const b=Backup.buildExport(),p=Backup.parseBackup(JSON.stringify(b));return {schema:b.schemaVersion,checksum:p.report.integrity,courses:p.data.courses.length,blocks:p.data.contentBlocks.length,sessions:p.data.sessions.length};});
  assert.deepEqual(backup,{schema:13,checksum:'ok',courses:40,blocks:100,sessions:1000});
  await fs.writeFile(path.join(out,'audit.json'),JSON.stringify({sourceSha256,engine,browser:runtime.browser.version(),dataset,errors,measurements,accessibility,backup},null,2));
  assert.deepEqual(errors,[]);assert.deepEqual(accessibility.flatMap(x=>x.violations),[]);await context.close();
 }finally{await runtime.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
