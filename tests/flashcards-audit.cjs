/* Jornadas de interface e medições reais, em contextos descartáveis. */
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const axe=require('axe-core');
const {start,open,seed,root}=require('./support.cjs');
const dest=path.join(root,'audit/reviews-flashcards');
async function audit(){
 const runtime=await start(process.env.BROWSER||'chromium');const results={engine:process.env.BROWSER||'chromium',date:new Date().toISOString(),layouts:[],accessibility:[],errors:[],requests:[],performance:{}};
 fs.mkdirSync(path.join(dest,'screenshots'),{recursive:true});
 try{
  const {page,context}=await open(runtime);await seed(page);
  page.on('pageerror',e=>results.errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==runtime.url)results.requests.push(r.url());});
  await page.evaluate(async()=>{
   const samples=[['basic','Qual sinal encerra uma frase declarativa?','Ponto-final.'],['term','Roteador','Equipamento ou sistema responsável por encaminhar pacotes entre redes.'],['language','Borrow','Pegar emprestado.'],['cloze','A capital do Brasil é {{Brasília}}.',''],['problem','Resolva 2x + 3 = 11.','x = 4.'],['sequence','Quais são as etapas básicas de uma investigação?','Observação\nHipótese\nTeste\nAnálise\nComunicação']];
   for(const [type,front,back]of samples) await FlashcardCommands.saveNote({type,disciplineId:type==='problem'?'matematica':'portugues',topicId:type==='problem'?'fracoes':'pontuacao',direction:type==='language'?'both':'forward',data:{front,back,hint:'Tente lembrar antes de consultar.',explanation:type==='problem'?'2x = 8\nx = 4.':'Uma ideia por cartão, quando fizer sentido.',sourceLanguage:type==='language'?'Inglês':'',targetLanguage:type==='language'?'Português':'',example:type==='language'?'Can I borrow your book?':''}});
   await SessionCommands.create({disciplineId:'portugues',topicId:'pontuacao',minutes:30,date:addDaysISO(todayISO(),-8)});
   await loadAll();setView('reviews');
  });
  await page.evaluate(axe.source);
  const screenshot=async name=>page.screenshot({path:path.join(dest,'screenshots',name+'.png'),fullPage:true});
  const layout=async(label,width,theme)=>{
   const item=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,modalOverflow:!$('#modal-root').hidden&&$('#modal-box').scrollWidth>$('#modal-box').clientWidth+1}));
   results.layouts.push({label,width,theme,...item});assert.equal(item.overflow,false,`${label} ${width} body`);assert.equal(item.modalOverflow,false,`${label} ${width} modal`);
  };
  const accessibility=async label=>{
   const r=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
   results.accessibility.push({label,violations:r});assert.deepEqual(r,[],label);
  };
  await screenshot('reviews-after');
  for(const theme of ['dark','light'])for(const width of [1920,1440,1366,768,430,390,375,320]){
   await page.setViewportSize({width,height:900});await page.evaluate(theme=>{if(modalCloser)modalCloser();applyTheme(theme);ui.reviewsTab='overview';renderReviews();},theme);await layout('panorama',width,theme);
   await page.evaluate(()=>openFlashcards());await layout('biblioteca',width,theme);
   if((theme==='dark'&&width===1440)||(theme==='light'&&width===390))await accessibility('biblioteca '+theme+' '+width);
   await page.evaluate(()=>openFlashcardEditor({type:'language'}));await layout('editor-idiomas',width,theme);
   if(width===390)await screenshot('editor-mobile-'+theme);
   await page.evaluate(()=>modalCloser());
   const run=await page.evaluate(async()=>{const r=await FlashcardCommands.begin({mode:'free'});await openFlashcardPlayer(r.id);return r.id;});
   await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();await page.getByRole('button',{name:'Mostrar resposta',exact:true}).click();await layout('estudo-resposta',width,theme);
   if(width===320 || width===1440)await screenshot('study-'+width+'-'+theme);
   if((theme==='dark'&&width===1440)||(theme==='light'&&width===390))await accessibility('estudo '+theme+' '+width);
   assert.equal(await page.locator('.fc-answer').evaluate(el=>getComputedStyle(el).animationName),'none');
   await page.getByRole('button',{name:'Continuar depois',exact:true}).click();await page.evaluate(async id=>FlashcardCommands.finish(id),run);
  }
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>applyTheme('dark'));
  for(const type of ['basic','term','language','cloze','problem','sequence']){
   await page.evaluate(type=>openFlashcardEditor({type}),type);await accessibility('editor '+type);await screenshot('editor-'+type);await page.evaluate(()=>modalCloser());
  }
  await page.evaluate(()=>openFlashcardTypePicker());await accessibility('seletor de modelos');await screenshot('types');await page.evaluate(()=>modalCloser());
  await page.evaluate(()=>openGuidedReviewBuilder());await accessibility('roteiro configuração');await screenshot('guided-builder');await page.evaluate(()=>modalCloser());
  await page.evaluate(async()=>{const d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'active_recall',minutes:10}],10);await openGuidedReviewPlayer(d.id);});
  await page.getByRole('button',{name:'Continuar roteiro',exact:true}).click();await accessibility('roteiro prática');await screenshot('guided-player');await page.evaluate(()=>modalCloser());
  const run=await page.evaluate(async()=>{const r=await FlashcardCommands.begin({mode:'free'});await openFlashcardPlayer(r.id);return r.id;});
  await page.getByRole('button',{name:'Continuar cartões',exact:true}).click();await page.getByRole('button',{name:'Mostrar resposta',exact:true}).click();await page.locator('[data-rating="3"]').click();
  await page.waitForFunction(async id=>(await DB.get('flashcardRuns',id)).cursor===1,run);await page.getByRole('button',{name:'Encerrar cartões',exact:true}).click();
  await page.locator('#fc-result-min').waitFor();await accessibility('resultado cartões');await screenshot('result');await page.getByRole('button',{name:'Guardar apenas respostas',exact:true}).click();
  // Grande base determinística: 1.500 conteúdos, 2.000 direções e 10.800 eventos em 365 dias.
  results.performance=await page.evaluate(async()=>{
   const start=performance.now(),notes=[],cards=[],events=[],runs=[];
   const types=FLASHCARD_TYPES.map(t=>t.id);
   for(let i=0;i<1500;i++){
    const type=types[i%6],n={id:'load-note-'+i,type,disciplineId:i%2?'portugues':'matematica',topicId:null,setId:null,templateId:null,direction:['language','term'].includes(type)?'both':'forward',archived:i%37===0,deletedAt:null,rev:1,createdAt:nowISO(),updatedAt:nowISO(),data:FlashcardModel.content(type,{front:type==='cloze'?'A capital é {{Brasília}}.':'Conceito '+i,back:type==='sequence'?'Observar\nTestar\nConcluir':'Resposta '+i})};notes.push(n);
    for(const direction of FlashcardModel.directions(type,n.direction)){
     const id='load-card-'+i+'-'+direction,queue=[id],run={id:'load-run-'+id,mode:'scheduled',queue,cursor:1,status:'finished',elapsedMs:60000,sessionId:null,createdAt:'2025-10-25T12:00:00.000Z',date:'2025-10-25',finishedAt:'2026-10-24T12:00:00.000Z'};
     // Cada repetição tem sua própria sessão e seu único evento confirmado.
     let schedule=FlashcardScheduler.empty('2025-10-25T12:00:00Z');
     for(let j=0;j<(i%10===0?0:6);j++){
      const day=addDaysISO('2025-10-25',j*60),at=day+'T12:00:00.000Z',rating=(i+j)%4+1,mode=Date.parse(schedule.due)<=Date.parse(at)?'scheduled':'free',next=mode==='scheduled'?FlashcardScheduler.next(schedule,rating,at):{card:schedule,log:null},r={...run,id:run.id+'-'+j,mode,date:day,createdAt:at,finishedAt:at};
      runs.push(r);events.push({id:r.id+':0',runId:r.id,cardId:id,noteId:n.id,topicId:null,direction,disciplineId:n.disciplineId,disciplineName:disciplineName(n.disciplineId),rating,at,date:day,mode,algorithm:FlashcardScheduler.version,parameters:FlashcardScheduler.configuration(),before:schedule,after:next.card,log:next.log});schedule=next.card;
     }
     cards.push({id,noteId:n.id,direction,schedule,suspended:i%41===0,retired:false,rev:7});
    }
   }
   await DB.transactional(FLASHCARD_STORES,api=>{notes.forEach(n=>api.add('flashcardNotes',n));cards.forEach(c=>api.add('flashcards',c));events.forEach(e=>api.add('flashcardResponses',e));runs.forEach(r=>api.add('flashcardRuns',r));});
   const writeMs=performance.now()-start;let mark=performance.now();await loadAll();const loadMs=performance.now()-mark;
   mark=performance.now();FlashcardModel.queue({limit:20});const queueMs=performance.now()-mark;
   mark=performance.now();openFlashcards();const renderMs=performance.now()-mark;
   mark=performance.now();FlashcardUI.search='Conceito 14';renderReviews();const searchMs=performance.now()-mark;FlashcardUI.search='';
   const practice=await FlashcardCommands.begin({limit:1}),current=await DB.get('flashcards',practice.queue[0]);
   mark=performance.now();await FlashcardCommands.answer({runId:practice.id,cursor:0,cardId:current.id,cardRev:current.rev,rating:3});const answerMs=performance.now()-mark;await loadAll();
   mark=performance.now();const text=JSON.stringify(Backup.buildExport());const exportMs=performance.now()-mark;
   mark=performance.now();const parsed=Backup.parseBackup(text);const parseMs=performance.now()-mark;
   mark=performance.now();await Backup.restoreInto(parsed.data);const restoreMs=performance.now()-mark;
   return {notes:notes.length,directions:cards.length,responses:events.length,bytes:text.length,writeMs,loadMs,queueMs,renderMs,searchMs,answerMs,exportMs,parseMs,restoreMs};
  });
  await context.setOffline(true);await page.evaluate(async()=>{await loadAll();openFlashcards();});
  assert.equal(results.requests.length,0);assert.deepEqual(results.errors,[]);
  fs.writeFileSync(path.join(dest,'browser-'+results.engine+'.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await context.close();
 }catch(error){fs.writeFileSync(path.join(dest,'browser-'+results.engine+'.json'),JSON.stringify({...results,failure:error.message},null,2));throw error;}finally{await runtime.close();}
}
audit().catch(e=>{console.error(e);process.exitCode=1;});
