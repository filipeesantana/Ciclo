const {test,before,after,afterEach,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const {start,open,seed}=require('./support.cjs');

let runtime, context, page;
before(async()=>{runtime=await start(process.env.BROWSER || 'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});
afterEach(async()=>context.close());

const actions=()=>page.locator('#modal-actions');
const nav=()=>page.locator('#nav-desktop');
const agenda=()=>page.locator('.review-agenda');

test('registro básico com duração, gravado e recuperado via Hoje e Histórico',async()=>{
 await page.locator('#fab').click();
 assert.equal(await page.locator('#rm-min').inputValue(),'');
 assert.equal(await page.locator('#rm-start').isVisible(),false);
 await page.locator('#rm-disc').click();
 await page.getByRole('option',{name:/Matemática/}).click();
 await page.locator('#rm-min').fill('30');
 await actions().getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>!!document.querySelector('.day-total'));
 assert.match(await page.locator('.day-total').textContent(),/30min/);
 await page.getByRole('button',{name:'Ver registros de hoje'}).click();
 await page.reload();await page.waitForFunction(()=>state.ready);
 assert.deepEqual(await page.evaluate(()=>filteredSessions().map(s=>[s.minutes,s.disciplineId])),[[30,'matematica']]);
});

test('agenda civil em lote, datas passadas, reativação e fronteiras de mês e ano',async()=>{
 await page.clock.install({time:new Date('2026-12-31T20:00:00Z')});
 await nav().getByRole('button',{name:'Revisões'}).click();
 const expected=async(id,mode,date)=>page.waitForFunction(([i,m,d])=>
   ReviewSchedule.kind(getTopic(i))===m && ReviewSchedule.due(getTopic(i))===d,[id,mode,date]);
 const save=async(name,choice,date)=>{
   await agenda().getByRole('button',{name,exact:true}).click();
   await page.locator('#agenda-policy').selectOption(choice);
   if(date) await page.locator('#agenda-date').fill(date);
   await actions().getByRole('button',{name:'Salvar agendamento'}).click();
   await page.waitForFunction(()=>!Overlay.isOpen);
 };
 await save('Agendar Uso da crase','tomorrow');await expected('crase','date','2027-01-01');
 await save('Agendar Uso da crase','week');await expected('crase','date','2027-01-04');
 await page.evaluate(async()=>{state.settings.weekStart='sunday';await saveSettings();});
 await save('Agendar Uso da crase','week');await expected('crase','date','2027-01-03');
 await save('Agendar Uso da crase','date','2026-12-15');await expected('crase','date','2026-12-15');
 assert.match(await agenda().textContent(),/Data sugerida já passou/);
 await page.locator('#agenda-discipline').selectOption('portugues');
 await agenda().getByRole('checkbox',{name:'Selecionar os assuntos encontrados'}).check();
 await agenda().getByRole('button',{name:'Agendar seleção'}).click();
 assert.match(await page.locator('#modal-content').textContent(),/2 assuntos selecionados/);
 await page.locator('#agenda-policy').selectOption('free');
 await actions().getByRole('button',{name:'Salvar agendamento'}).click();
 await expected('crase','free',null);await expected('pontuacao','free',null);
 await save('Agendar Uso da crase','off');await expected('crase','off',null);
 await agenda().getByRole('button',{name:'Revisar Uso da crase',exact:true}).click();
 await actions().getByRole('button',{name:'Cancelar'}).click();
 await save('Agendar Uso da crase','auto');await expected('crase','auto',null);
});

test('agenda manual prevalece sobre inclusão, resultado, edição, exclusão e backup',async()=>{
 const results=await page.evaluate(async()=>{
  await ReviewSchedule.setMany(['crase'],{mode:'date',date:'2027-01-05'});
  await ReviewSchedule.setMany(['fracoes'],{mode:'off'});
  const save=await SessionCommands.create({disciplineId:'portugues',topicId:'crase',type:'revisao',reviewOutcome:'remembered',minutes:20,date:todayISO()});
  const off=await SessionCommands.create({disciplineId:'matematica',topicId:'fracoes',minutes:30,date:todayISO()});
  const update=await SessionCommands.update(save.session.id,{date:addDaysISO(todayISO(),-1)},{base:save.session});
  const newDue=ReviewSchedule.due((await DB.get('topics','crase')));
  const removed=await SessionCommands.remove(save.session.id);
  await loadAll();
  const backup=Backup.buildExport();
  const parsed=Backup.parseBackup(JSON.stringify(backup));
  await Backup.restoreInto(parsed.data);
  await loadAll();
  const legacy=structuredClone(backup);legacy.schemaVersion=11;delete legacy.integrity;
  for(const t of legacy.topics) delete t.reviewSchedule;
  return {
   ok:save.ok&&off.ok&&update.ok&&removed.ok, version:backup.schemaVersion, physical:IDB_VERSION,
   integrity:BackupIntegrity.verify(backup), newDue,
   due:ReviewSchedule.due(getTopic('crase')), off:ReviewSchedule.kind(getTopic('fracoes')),
   dueOff:ReviewEngine.allScheduled().some(t=>t.id==='fracoes'), sessions:state.sessions.length,
   old:!!Backup.parseBackup(JSON.stringify(legacy)).data
  };
 });
 assert.deepEqual(results,{ok:true,version:12,physical:1,integrity:'ok',newDue:'2027-01-05',due:'2027-01-05',off:'off',dueOff:false,sessions:1,old:true});
});

test('lote com assunto arquivado, excluído ou falha de escrita reverte por inteiro',async()=>{
 const facts=await page.evaluate(async()=>{
  const rejected=[];
  const crase=await DB.get('topics','crase');
  await DB.put('topics',{...crase,archived:true});
  for(const id of ['crase','inexistente']){
   try{await ReviewSchedule.setMany(['pontuacao',id],{mode:'off'});}catch(e){rejected.push(true);}
  }
  const atomic=DB.atomic;
  DB.atomic=function(stores, callback){
   return atomic.call(this,stores,api=>callback({...api,put:async (...args)=>{
    if(args[1].id==='fracoes') throw Error('falha injetada');
    return api.put(...args);
   }}));
  };
  try{await ReviewSchedule.setMany(['pontuacao','fracoes'],{mode:'free'});}catch(e){rejected.push(true);}
  finally{DB.atomic=atomic;}
  return {rejected,policy:(await DB.get('topics','pontuacao')).reviewSchedule ?? null};
 });
 assert.deepEqual(facts,{rejected:[true,true,true],policy:null});
});

test('estudo com vários tópicos persiste a agenda escolhida junto com a sessão',async()=>{
 await page.evaluate(()=>openRegisterModal({disciplineId:'portugues',topicIds:['crase','pontuacao']}));
 await page.locator('#rm-min').fill('45');
 await page.locator('.study-review-schedule summary').click();
 await page.locator('#rm-agenda-policy').selectOption('off');
 await actions().getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>({
   topics:SessionModel.topicIds(state.sessions[0]).slice().sort(),minutes:state.sessions[0].minutes,
   mode:['crase','pontuacao'].map(id=>ReviewSchedule.kind(getTopic(id)))
 })),{topics:['crase','pontuacao'],minutes:45,mode:['off','off']});
});

test('apresentação em outra janela segue o relógio e reaproveita os controles do Foco',async(t)=>{
 await page.evaluate(async()=>{await startTimer('portugues',['crase'],[]);FocusMode.enter();});
 await page.locator('#focus-presentation').click();
 const initial=await page.evaluate(()=>TimerService.data.runId);
 const supported=await page.evaluate(()=>FocusMode.fsAvailable());
 if(supported){
   await page.locator('#focus-fs').click();
   await page.waitForFunction(()=>FocusMode.fsElement()===document.querySelector('#focus-root'));
 }
 await page.locator('#focus-actions').getByRole('button',{name:'Pausar',exact:true}).click();
 if(supported){
   await page.locator('#focus-fs').click();
   await page.waitForFunction(()=>!FocusMode.fsElement());
 }else t.diagnostic('Fallback expandido sem fullscreen.');
 await page.locator('#focus-display-options summary').click();
 await page.getByRole('checkbox',{name:'Descanso',exact:true}).uncheck();
 assert.equal(await page.locator('#focus-rest-stat').isHidden(),true);
 const popup=context.waitForEvent('page');
 await page.getByRole('button',{name:'Abrir em outra janela'}).click();
 const second=await popup;
 await second.waitForURL('**/?apresentacao=1');
 await second.waitForFunction(()=>typeof FocusMode !== 'undefined' && FocusMode.presenting);
 assert.equal(await second.evaluate(()=>TimerService.data.runId),initial);
 await second.locator('#focus-actions').getByRole('button',{name:'Retomar',exact:true}).click();
 await page.waitForFunction(()=>TimerService.status==='study');
 await page.locator('#focus-actions').getByRole('button',{name:'Descansar',exact:true}).click();
 await second.waitForFunction(()=>TimerService.status==='rest');
 await second.close();
 await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>FocusMode.isOpen && !FocusMode.presenting),true);
 await page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}).click();
 await actions().getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>state.sessions.length===1&&!TimerService.isActive);
 assert.equal(await page.evaluate(()=>state.sessions[0].id),initial);
});

test('PNG nos quatro formatos e temas tem os mesmos pixels da prévia e dados da análise',async()=>{
 await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',topicId:'crase',disciplines:['portugues','matematica'],
   minutes:45,date:todayISO(),comment:'Mensagem privada 7912',results:[{id:'q',kind:'questions',total:10,correct:7}]});
  await refresh();applyAnalyticsQuery({periodPreset:'hoje',scopeType:'discipline',scopeIds:['portugues']});
 });
 await page.getByRole('button',{name:'Criar relatório',exact:true}).click();
 const canvas=page.locator('#report-preview');
 await canvas.waitFor();
 await context.setOffline(true);
 const minutes=await page.evaluate(()=>reportDuration(AnalyticsEngine.query(ui.analyticsQuery).totals.minutes));
 assert.match(await canvas.getAttribute('aria-label'),new RegExp(minutes));
 assert.doesNotMatch(await canvas.getAttribute('aria-label'),/Português|Mensagem privada/);
 await page.getByText('Título e cores',{exact:true}).click();
 await page.locator('#report-title').fill('Caligrafia, Ciências e Expressão — uma semana de aprendizagem');
 await page.locator('#report-subtitle').fill('Questões, revisão e organização 📚');
 await page.getByText('Blocos e privacidade',{exact:true}).click();
 await page.getByRole('checkbox',{name:'Questões e acertos',exact:true}).check();
 await page.getByRole('checkbox',{name:'Distribuição por disciplina',exact:true}).check();
 await page.getByRole('checkbox',{name:'Mostrar nomes das disciplinas'}).check();
 await page.getByRole('button',{name:'Subir bloco Questões e acertos'}).click();
 for(const [theme,layout] of [['light','editorial'],['dark','painel']]){
  await page.locator('#report-theme').selectOption(theme);
  await page.locator('#report-layout').selectOption(layout);
  for(const [format,w,h] of [['square',1080,1080],['portrait',1080,1350],['story',1080,1920],['landscape',1920,1080]]){
   await page.locator('#report-format').selectOption(format);
   await page.waitForFunction(([width,height])=>document.querySelector('#report-preview').width===width&&document.querySelector('#report-preview').height===height,[w,h]);
   const wait=page.waitForEvent('download');
   await actions().getByRole('button',{name:'Baixar PNG'}).click();
   const png=await fs.readFile(await (await wait).path());
   assert.equal(png.toString('hex',0,8),'89504e470d0a1a0a');
   assert.equal(png.readUInt32BE(16),w);assert.equal(png.readUInt32BE(20),h);
   assert.equal(await canvas.evaluate(async(c,data)=>{
    const image=new Image();
    image.src='data:image/png;base64,'+data;
    await image.decode();
    const out=document.createElement('canvas');out.width=c.width;out.height=c.height;
    const ctx=out.getContext('2d');ctx.drawImage(image,0,0);
    const rendered=ctx.getImageData(0,0,c.width,c.height).data;
    const preview=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    return rendered.every((byte,i)=>byte===preview[i]);
   },png.toString('base64')),true,'Pixels do PNG correspondem à prévia');
  }
 }
 const text=await canvas.getAttribute('aria-label');
 assert.match(text,/Caligrafia, Ciências e Expressão.*organização.*Português/);
 assert.doesNotMatch(text,/Mensagem privada|Matemática/);
 await page.locator('#report-period').selectOption('custom');
 await page.locator('#report-start').fill('2000-01-01');await page.locator('#report-end').fill('2000-01-31');
 await page.waitForFunction(()=>document.querySelector('#report-preview').getAttribute('aria-label').includes('Nenhum estudo registrado'));
 assert.equal(await actions().getByRole('button',{name:'Baixar PNG'}).isEnabled(),true);
});

test('toque em 390 px chega às rotas agrupadas e volta ao recorte',async()=>{
 const mobile=await open(runtime,{viewport:{width:390,height:844},hasTouch:true,isMobile:process.env.BROWSER!=='firefox'});
 try{
  await seed(mobile.page);
  const p=mobile.page;
  const n=p.locator('#nav-mobile');
  await n.getByRole('button',{name:'Organizar',exact:true}).tap();
  await p.locator('#section-nav').getByRole('button',{name:'Planejamento',exact:true}).tap();
  assert.equal(await n.getByRole('button',{name:'Organizar',exact:true}).getAttribute('aria-current'),'page');
  await n.getByRole('button',{name:'Resultados',exact:true}).tap();
  await p.locator('#section-nav').getByRole('button',{name:'Histórico',exact:true}).tap();
  await p.goBack();
  await p.getByRole('button',{name:'Criar relatório',exact:true}).tap();
  await p.locator('#report-preview').waitFor();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false);
  await p.locator('#modal-actions').getByRole('button',{name:'Fechar',exact:true}).tap();
  await n.getByRole('button',{name:'Estudar',exact:true}).tap();
  assert.equal(await p.locator('#modal-actions .primary').isVisible(),true);
 }finally{await mobile.context.close();}
});

test('primeira visita chega à disciplina, ao cronômetro e ao registro sem tutorial obrigatório',async()=>{
 const fresh=await open(runtime);
 try{
  const p=fresh.page;
  assert.equal(await p.locator('#modal-root').isHidden(),true);
  await p.getByRole('button',{name:'Adicionar o que estou estudando'}).click();
  await p.locator('#dm-name').fill('Violão');
  await p.locator('#modal-actions').getByRole('button',{name:'Criar disciplina'}).click();
  await p.getByRole('button',{name:'Começar a estudar Violão agora',exact:true}).click();
  await p.waitForFunction(()=>TimerService.isActive);
  await p.locator('#fab').click();
  await p.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
  await p.getByRole('button',{name:'Ver registros de hoje'}).click();
  assert.equal(await p.evaluate(()=>filteredSessions().length),1);
 }finally{await fresh.context.close();}
});

test('relatório extenso, contraste reforçado e títulos longos conservam métricas e bordas',async()=>{
 const {workload}=require('./workload.cjs');
 await workload(page,1000,10000);
 const result=await page.evaluate(()=>{
  const analysis=AnalyticsEngine.query({periodPreset:'tudo'});
  const settings={format:'square',layout:'editorial',theme:'light',accent:'#9f9f9f',background:'#777777',highContrast:true,
   title:'Ciência, matemática e história — uma síntese de aprendizagem contínua',subtitle:'Questões e práticas de revisão escritas ao longo de várias semanas de estudos organizados.',
   order:REPORT_BLOCKS.map(x=>x[0]).reverse(),visible:new Set(REPORT_BLOCKS.map(x=>x[0])),names:true,brand:true};
  const model=visualReportModel(analysis,settings);
  const canvas=document.createElement('canvas');
  drawVisualReport(canvas,model,settings);
  const label=canvas.getAttribute('aria-label');
  const {bg,ink,card,cardInk}=reportColors(settings);
  return {minutes:model.blocks.find(b=>b.id==='time').value,canonical:reportDuration(analysis.totals.minutes),
   sessions:analysis.totals.count,chart:model.blocks.find(b=>b.id==='trend').buckets.reduce((total,b)=>total+b.minutes,0),
   expected:analysis.totals.minutes,range:label.includes(settings.title),contrast:reportContrast(bg,ink),cardContrast:reportContrast(card,cardInk)};
 });
 assert.equal(result.sessions,10000);
 assert.equal(result.minutes,result.canonical);assert.equal(result.chart,result.expected);
 assert.equal(result.range,true);assert.ok(result.contrast>=7);assert.ok(result.cardContrast>=4.5);
});

test('Resultados abre os registros do recorte e Voltar preserva período e disciplina',async()=>{
 await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',minutes:35,date:todayISO(),comment:'Ensaio de uma explicação'});
  await SessionCommands.create({disciplineId:'matematica',minutes:20,date:todayISO()});
  await refresh();
  ui.history.search='busca antiga';
  applyAnalyticsQuery({periodPreset:'hoje',scopeType:'discipline',scopeIds:['portugues'],focus:'overview'});
 });
 await page.getByRole('button',{name:'Ver registros',exact:true}).click();
 assert.match(await page.locator('#history-body').textContent(),/Registros da análise · Hoje \(1\)/);
 assert.deepEqual(await page.evaluate(()=>filteredSessions().map(s=>s.disciplineId)),['portugues']);
 await page.goBack();
 assert.deepEqual(await page.evaluate(()=>[ui.analyticsQuery.periodPreset,ui.analyticsQuery.scopeIds]),['hoje',['portugues']]);
});
