const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});afterEach(async()=>context.close());
const save=label=>page.locator('#modal-actions').getByRole('button',{name:label,exact:true}).click();
async function fixture(target=page){await target.evaluate(async()=>{
  await Learning.save('courses',{id:'course-a',name:'Linux — Curso A',disciplineId:'portugues',url:'https://example.test/linux',favorite:true});
  await Learning.save('courses',{id:'course-b',name:'Linux — Curso B',disciplineId:'portugues',url:'https://example.test/other'});
  const topics=Array.from({length:10},(_,i)=>({...newTopic('portugues','Comando '+i),id:'command-'+i}));
  await DB.putMany('topics',topics);await refresh();
  await Learning.save('contentBlocks',{id:'files',name:'Navegação e arquivos',disciplineId:'portugues',topicIds:topics.map(t=>t.id),courseIds:['course-a','course-b']});
  await Learning.save('contentBlocks',{id:'permissions',name:'Permissões',disciplineId:'portugues',topicIds:['command-0','command-1'],courseIds:['course-a']});
});}
async function openMaterials(){await page.evaluate(()=>{ui.discNav={level:'root'};setView('disciplines');});await page.getByRole('tab',{name:'Cursos e materiais',exact:true}).click();}
async function recordBlock(minutes=45){
 await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));
 await page.locator('#rm-material').selectOption('course-a');
 assert.equal(await page.evaluate(()=>document.querySelector('#rm-topics').textContent.includes('10 selecionados')),false);
 await page.locator('#rm-block').selectOption('files');
 await page.locator('#rm-min').fill(String(minutes));
 await save('Registrar estudo');await page.waitForFunction(()=>!Overlay.isOpen);
}

test('material: cadastro mínimo, favorito em Hoje e abertura segura em um clique sem criar estudo',async()=>{
 await openMaterials();await page.getByRole('button',{name:'Adicionar material',exact:true}).click();
 await page.locator('#material-name').fill('Documentação GNU/Linux');
 await page.locator('#material-discipline').selectOption('portugues');
 await page.locator('#material-url').fill('https://example.test/docs?token=privado');
 await page.getByLabel('Favorito',{exact:true}).check();await save('Salvar material');
 await page.waitForFunction(()=>state.courses.length===1);await page.evaluate(()=>setView('today'));
 await context.route('https://example.test/**',route=>route.fulfill({body:'<title>Material externo</title>',contentType:'text/html'}));
 const anchor=page.locator('.quick-materials a');assert.equal(await anchor.getAttribute('target'),'_blank');assert.match(await anchor.getAttribute('rel'),/noopener/);
 const popupPromise=context.waitForEvent('page');await anchor.click();const popup=await popupPromise;await popup.waitForLoadState();
 assert.equal(await popup.evaluate(()=>window.opener),null);await popup.close();await page.waitForFunction(()=>!!state.courses[0]?.lastOpenedAt);
 assert.deepEqual(await page.evaluate(()=>({count:state.sessions.length,timer:TimerService.isActive,draft:FormDraft.load('register'),recent:!!state.courses[0].lastOpenedAt})),{count:0,timer:false,draft:null,recent:true});
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.locator('.quick-materials a').count(),1);
});

test('URLs perigosas, malformadas, credenciais e conteúdo ativo são recusados',async()=>{
 const facts=await page.evaluate(()=>['javascript:alert(1)','data:text/html,x','file:///etc/passwd','https://','https://a.test/\nfoo','https://u:p@host.test','ftp://a.test'].map(s=>Learning.url(s)));
 assert.deepEqual(facts,Array(7).fill(null));
 await openMaterials();await page.getByRole('button',{name:'Adicionar material',exact:true}).click();
 await page.locator('#material-name').fill('<img src=x onerror=alert(1)>');await page.locator('#material-discipline').selectOption('portugues');
 await page.locator('#material-url').fill('javascript:alert(1)');await save('Salvar material');
 assert.equal(await page.locator('#material-name').isVisible(),true);assert.equal(await page.evaluate(()=>state.courses.length),0);
 await page.locator('#material-url').fill('http://example.test/a');await save('Salvar material');await page.waitForFunction(()=>state.courses.length===1);
 assert.equal(await page.locator('.materials-panel img').count(),0);
});

test('bloco: reutiliza tópicos existentes, cria em lote com prévia e associa dois materiais atomicamente',async()=>{
 await fixture();await page.evaluate(()=>{setView('disciplines');});await page.getByRole('tab',{name:'Blocos',exact:true}).click();
 await page.getByRole('button',{name:'Criar bloco',exact:true}).click();
 await page.locator('#block-name').fill('Pesquisa de texto');await page.locator('#block-discipline').selectOption('portugues');
 await page.getByLabel('Comando 0',{exact:true}).check();
 await page.getByText('Adicionar tópicos em lote',{exact:true}).click();await page.locator('#block-bulk').fill('Comando 0\ngrep\nGREP\nfind');
 assert.match(await page.locator('#modal-content').innerText(),/1 existentes · 2 novos/);
 await page.getByLabel('Linux — Curso A',{exact:true}).check();await page.getByLabel('Linux — Curso B',{exact:true}).check();
 await save('Salvar bloco');await page.waitForFunction(()=>state.contentBlocks.length===3);
 const facts=await page.evaluate(()=>{const b=state.contentBlocks.find(b=>b.name==='Pesquisa de texto');return {topics:b.topicIds.length,courses:b.courseIds.length,new:state.topics.filter(t=>['grep','find'].includes(t.name)).length};});
 assert.deepEqual(facts,{topics:3,courses:2,new:2});
});

test('registro integrado: curso sozinho não seleciona tópicos; bloco seleciona dez; sessão única e snapshot temporal',async()=>{
 await fixture();await recordBlock();
 const before=await page.evaluate(()=>structuredClone(state.sessions[0]));assert.equal(before.minutes,45);assert.equal(before.topicEntries.length,10);assert.equal(before.contentEntries[0].blockId,'files');
 await page.evaluate(async()=>{const b=Learning.block('files');await Learning.save('contentBlocks',{...b,topicIds:['command-0']},b);await Learning.patch('courses','course-a',{name:'Curso renomeado'});});
 const after=await page.evaluate(()=>state.sessions[0]);assert.deepEqual(after,before);
 await page.evaluate(()=>setView('history'));assert.match(await page.locator('#history-body').innerText(),/Navegação e arquivos/);
 await page.locator('#history-body .line-main').first().click();assert.equal(await page.locator('#es-material').inputValue(),'course-a');
 await save('Salvar');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>state.sessions[0].contentEntries[0].topicIds),before.contentEntries[0].topicIds);assert.equal(await page.evaluate(()=>state.sessions[0].contentEntries[0].courseName),before.contentEntries[0].courseName);
});

test('registro simples continua possível sem curso, bloco ou tópico',async()=>{
 await fixture();await page.locator('#fab').click();await page.locator('#rm-disc').click();await page.getByRole('option',{name:/Matemática/}).click();await page.locator('#rm-min').fill('30');await save('Registrar estudo');
 await page.waitForFunction(()=>state.sessions.length===1);assert.deepEqual(await page.evaluate(()=>({min:state.sessions[0].minutes,topics:state.sessions[0].topicEntries.length,links:Learning.entries(state.sessions[0]).length})),{min:30,topics:0,links:0});
});

test('bloco substitui sugestões individuais automáticas; agendamento individual explícito prevalece',async()=>{
 await fixture();await recordBlock();
 const facts=await page.evaluate(()=>({individual:ReviewEngine.allScheduled().filter(t=>t.id.startsWith('command-')).length,blocks:LearningReviews.units().filter(u=>u.kind==='block'&&ReviewSchedule.due(u)).length}));
 assert.deepEqual(facts,{individual:0,blocks:1});
 await page.evaluate(async()=>{await ReviewSchedule.setMany(['command-0'],{mode:'date',date:todayISO()});await refresh();setView('reviews');});
 await page.locator('#learning-review-filter').selectOption('all');
 assert.equal(await page.locator('[data-unit="block:files"]').count(),1);assert.equal(await page.locator('[data-unit="topic:command-0"]').count(),1);
 const block=page.locator('[data-unit="block:files"]');await block.getByRole('button',{name:'Alterar data',exact:true}).click();await page.locator('#agenda-policy').selectOption('tomorrow');await save('Salvar agendamento');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.equal(await page.evaluate(()=>Learning.block('files').reviewSchedule.date),await page.evaluate(()=>addDaysISO(todayISO(),1)));
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.locator('[data-unit="block:files"]').count(),1);
});

test('resultado geral do bloco não inventa avaliações dos tópicos nem conclui bloco compartilhado',async()=>{
 await fixture();await recordBlock();
 await page.evaluate(()=>LearningReviews.start([LearningReviews.blockUnits().find(b=>b.id==='files')],'manual'));
 await page.locator('#rm-min').fill('20');await page.getByText('Avaliação do bloco',{exact:true}).click();await page.locator('#rm-block-outcome-0').selectOption('hard');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===2);
 const f=await page.evaluate(()=>{const review=state.sessions.find(s=>SessionModel.types(s).includes('revisao'));return {outcome:review.contentEntries[0].outcome,individual:review.topicEntries.some(e=>e.outcome),other:LearningReviews.blockUnits().find(b=>b.id==='permissions').lastReviewedAt||null,completed:AnalyticsEngine.query({periodPreset:'tudo'}).reviews.completed,hard:AnalyticsEngine.query({periodPreset:'tudo'}).reviews.outcomes.find(o=>o.v==='hard').count,total:AnalyticsEngine.query({periodPreset:'tudo'}).totals.minutes};});
 assert.deepEqual(f,{outcome:'hard',individual:false,other:null,completed:1,hard:1,total:65});
});

test('backup 13, checksum das novas coleções, restauração atômica e compatibilidade com backup 12',async()=>{
 await fixture();await recordBlock();
 const f=await page.evaluate(async()=>{
  const backup=Backup.buildExport(),parsed=Backup.parseBackup(JSON.stringify(backup));
  const corrupt=structuredClone(backup);corrupt.courses[0].name='Alterado';
  const current=DB.atomic;let refused=false;
  DB.atomic=(stores,work)=>current.call(DB,stores,api=>work({...api,add:(store,x)=>{if(store==='contentBlocks')throw Error('falha injetada');return api.add(store,x);}}));
  try{await Backup.restoreInto(parsed.data);}catch(_){refused=true;}finally{DB.atomic=current;}
  await loadAll();const kept=state.sessions.length===1&&state.courses.length===2;
  await Backup.restoreInto(parsed.data);await loadAll();
  const legacy=structuredClone(backup);legacy.schemaVersion=12;delete legacy.integrity;delete legacy.courses;delete legacy.contentBlocks;legacy.sessions.forEach(s=>delete s.contentEntries);
  return {schema:backup.schemaVersion,physical:IDB_VERSION,checksum:BackupIntegrity.verify(backup),corrupt:BackupIntegrity.verify(corrupt),refused,kept,restored:state.sessions[0].contentEntries[0].blockId,old:Backup.parseBackup(JSON.stringify(legacy)).data.courses.length};
 });assert.deepEqual(f,{schema:13,physical:2,checksum:'ok',corrupt:'mismatch',refused:true,kept:true,restored:'files',old:0});
});

test('falha de gravação preserva formulário integrado e rascunho para retentativa',async()=>{
 await fixture();await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));await page.locator('#rm-material').selectOption('course-a');await page.locator('#rm-block').selectOption('files');await page.locator('#rm-min').fill('45');
 await page.evaluate(()=>{window.originalAtomic=DB.atomic;DB.atomic=async()=>{throw Error('falha');};});await save('Registrar estudo');
 assert.equal(await page.locator('#rm-min').inputValue(),'45');assert.equal(await page.locator('#rm-block').inputValue(),'files');
 await page.evaluate(()=>{DB.atomic=window.originalAtomic;});await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
});

test('concorrência rejeita edição obsoleta de curso e remoção de bloco durante registro sem gravação parcial',async()=>{
 await fixture();
 const f=await page.evaluate(async()=>{
  const stale=Learning.course('course-a');await Learning.patch('courses',stale.id,{name:'Atualizado'});let conflict=false;
  try{await Learning.save('courses',{...stale,name:'Obsoleto'},stale);}catch(_){conflict=true;}
  await Learning.remove('contentBlocks','files');
  const r=await SessionCommands.create({disciplineId:'portugues',minutes:30,date:todayISO(),contentEntries:[{disciplineId:'portugues',blockId:'files'}]});
  return {conflict,ok:r.ok,count:await DB.count('sessions')};
 });assert.deepEqual(f,{conflict:true,ok:false,count:0});
});

test('arquivamento preserva estudos e exclusão com vínculos é recusada',async()=>{
 await fixture();await recordBlock();
 const f=await page.evaluate(async()=>{let refused=false;try{await Learning.remove('courses','course-a');}catch(_){refused=true;}await Learning.patch('courses','course-a',{archived:true});return {refused,sessions:state.sessions.length,snapshot:state.sessions[0].contentEntries[0].courseName,quick:quickMaterials()!==null};});
 assert.deepEqual(f,{refused:true,sessions:1,snapshot:'Linux — Curso A',quick:false});
});

test('cronômetro mantém material e bloco após F5; Foco abre fonte sem encerrar; finaliza uma vez',async()=>{
 await fixture();await page.clock.install({time:new Date('2026-11-25T15:00:00Z')});
 await page.locator('.quick-materials').getByRole('button',{name:'Estudar com Linux — Curso A',exact:true}).click();
 await page.locator('#rm-block').selectOption('files');await save('Começar');await page.waitForFunction(()=>TimerService.isActive);
 const run=await page.evaluate(()=>TimerService.data.runId);await page.clock.fastForward(45*60000);
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>TimerService.data.contentEntries[0].blockId),'files');
 await page.getByRole('button',{name:'Foco',exact:true}).click();assert.equal(await page.locator('#focus-material a').getAttribute('target'),'_blank');
 await page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}).click();await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1&&!TimerService.isActive);
 const s=await page.evaluate(()=>state.sessions[0]);assert.equal(s.id,run);assert.equal(s.minutes,45);assert.equal(s.contentEntries[0].courseId,'course-a');
});

test('roteiro sugere bloco, preserva pulo/resultado após F5 e registra resultado geral sem inventar avaliação individual',async()=>{
 await fixture();await recordBlock();await page.evaluate(async()=>{await LearningReviews.schedule(['block:files'],{mode:'date',date:todayISO()});setView('reviews');});
 await page.getByRole('button',{name:'Montar revisão guiada',exact:true}).click();
 assert.match(await page.locator('.guided-plan').innerText(),/Navegação e arquivos/);assert.doesNotMatch(await page.locator('.guided-plan').innerText(),/Comando 1/);
 await save('Começar roteiro');await page.locator('#guided-outcome').selectOption('remembered');await page.getByRole('button',{name:'Guardar e sair',exact:true}).click();
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>state.meta.guidedReview.items[0].outcome),'remembered');
 await page.getByRole('button',{name:'Retomar roteiro guardado',exact:true}).click();await page.getByRole('button',{name:'Encerrar roteiro',exact:true}).click();await page.locator('#guided-result-minutes').fill('20');await save('Registrar uma revisão');await page.waitForFunction(()=>state.sessions.length===2);
 const f=await page.evaluate(()=>{const s=state.sessions.find(s=>s.id.startsWith('guided:'));return {min:s.minutes,block:s.contentEntries[0].blockId,outcome:s.contentEntries[0].outcome,individual:s.topicEntries.some(e=>e.outcome),backup:Backup.parseBackup(JSON.stringify(Backup.buildExport())).data.sessions.length};});
 assert.deepEqual(f,{min:20,block:'files',outcome:'remembered',individual:false,backup:2});
});

test('filtros de material e bloco usam somente vínculos gravados; repartição multidisciplinar nunca multiplica minutos',async()=>{
 await fixture();
 const f=await page.evaluate(async()=>{
  const r=await SessionCommands.create({disciplineId:'portugues',disciplines:[{disciplineId:'portugues',minutes:30},{disciplineId:'matematica',minutes:15}],minutes:45,date:todayISO(),contentEntries:[{disciplineId:'portugues',courseId:'course-a',blockId:'files',topicIds:[]}]});
  await refresh();const query=changes=>AnalyticsEngine.query({periodPreset:'hoje',...changes}).totals.minutes;
  return {ok:r.ok,all:query({}),course:query({courseIds:['course-a']}),block:query({blockIds:['files']}),other:query({courseIds:['course-b']}),intersection:query({courseIds:['course-a'],scopeType:'discipline',scopeIds:['matematica']})};
 });assert.deepEqual(f,{ok:true,all:45,course:30,block:30,other:0,intersection:0});
 await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'hoje',courseIds:['course-a']}));
 await page.getByRole('button',{name:'Ver registros',exact:true}).click();assert.equal(await page.evaluate(()=>filteredSessions().reduce((n,s)=>n+s.minutes,0)),30);
 await page.goBack();assert.deepEqual(await page.evaluate(()=>ui.analyticsQuery.courseIds),['course-a']);await page.reload();await page.waitForFunction(()=>state.ready);assert.deepEqual(await page.evaluate(()=>ui.analyticsQuery.courseIds),['course-a']);
 await page.getByRole('button',{name:'Criar relatório',exact:true}).click();assert.equal(await page.locator('#report-material').inputValue(),'course-a');assert.match(await page.locator('#report-preview').getAttribute('aria-label'),/30min/);
});

test('dois blocos compartilham 45 minutos estimados; união e interseção respeitam a mesma sessão',async()=>{
 await fixture();
 const f=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',date:todayISO(),minutes:45,contentEntries:[{disciplineId:'portugues',courseId:'course-a',blockId:'files',topicIds:[]},{disciplineId:'portugues',courseId:'course-a',blockId:'permissions',topicIds:[]}]});await refresh();
  const q=blockIds=>AnalyticsEngine.query({periodPreset:'hoje',blockIds}).totals;
  return {first:q(['files']).minutes,second:q(['permissions']).minutes,union:q(['files','permissions']).minutes,count:q(['files','permissions']).count,course:AnalyticsEngine.query({periodPreset:'hoje',courseIds:['course-a']}).totals.minutes};
 });assert.deepEqual(f,{first:23,second:22,union:45,count:1,course:45});
});

test('backup recusa coleções inválidas e mantém checksum de arquivos antigos sem novas propriedades',async()=>{
 await fixture();
 const f=await page.evaluate(()=>{
  const b=Backup.buildExport(),bad=structuredClone(b);bad.contentBlocks[0].topicIds=['ausente'];let refused=false;try{Backup.parseBackup(JSON.stringify(bad));}catch(_){refused=true;}
  const old=structuredClone(b);old.schemaVersion=12;delete old.courses;delete old.contentBlocks;old.integrity=BackupIntegrity.describe(old);
  return {refused,old:BackupIntegrity.verify(old),current:BackupIntegrity.verify(b)};
 });assert.deepEqual(f,{refused:true,old:'ok',current:'ok'});
});

test('tópico fora do snapshot do bloco não vaza numa interseção de filtros',async()=>{
 await fixture();
 const f=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',date:todayISO(),minutes:45,topics:[{topicId:'command-0'},{topicId:'command-9'}],contentEntries:[{disciplineId:'portugues',blockId:'files',topicIds:['command-9']},{disciplineId:'portugues',blockId:'permissions',topicIds:['command-0']}]});await refresh();
  const q=id=>AnalyticsEngine.query({periodPreset:'hoje',blockIds:['permissions'],scopeType:'topic',scopeIds:[id]}).totals.minutes;
  return {inside:q('command-0'),outside:q('command-9')};
 });assert.deepEqual(f,{inside:22,outside:0});
});

test('retirar um tópico antes de registrar preserva somente os nove tópicos confirmados',async()=>{
 await fixture();await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));await page.locator('#rm-block').selectOption('files');
 await page.getByRole('button',{name:'Remover Comando 3',exact:true}).click();await page.locator('#rm-min').fill('45');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
 const f=await page.evaluate(()=>({count:state.sessions[0].topicEntries.length,snapshot:state.sessions[0].contentEntries[0].topicIds.length,removed:state.sessions[0].contentEntries[0].topicIds.includes('command-3'),minutes:state.sessions[0].minutes}));
 assert.deepEqual(f,{count:9,snapshot:9,removed:false,minutes:45});
});

test('upgrade físico 1 → 2 acrescenta coleções vazias e preserva estudos e agenda antigos',async()=>{
 const snapshot=await page.evaluate(async()=>{
  await ReviewSchedule.setMany(['crase'],{mode:'date',date:'2027-01-05'});
  await SessionCommands.create({disciplineId:'portugues',topicId:'crase',date:'2026-11-01',minutes:45});await loadAll();
  return {backup:Backup.buildExport(),meta:state.meta};
 });
 const migrated=await runtime.browser.newContext();
 try{
  const p=await migrated.newPage();await p.route('**/migration-fixture',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><title>Fixture local isolado</title>'}));await p.goto(runtime.url+'/migration-fixture');
  await p.evaluate(async snapshot=>{
   await new Promise((resolve,reject)=>{
    const request=indexedDB.open('diarioEstudosDB',1);
    request.onupgradeneeded=()=>{
     const db=request.result;
     for(const name of ['meta','settings','areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines']){
      const store=db.createObjectStore(name,{keyPath:['meta','settings'].includes(name)?'key':'id'});
      for(const index of ({areas:['archived'],disciplines:['areaId','archived'],topics:['disciplineId','reviewDueDate','archived'],sessions:['date','disciplineId','topicId'],weeklyPlans:['weekStart'],deadlines:['date','disciplineId']}[name]||[]))store.createIndex(index,index,{unique:false});
     }
    };
    request.onsuccess=()=>{const db=request.result,tx=db.transaction([...db.objectStoreNames],'readwrite');
     for(const store of ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines'])for(const x of snapshot.backup[store])tx.objectStore(store).put(x);
     tx.objectStore('settings').put({key:'settings',value:snapshot.backup.settings});
     for(const[key,value]of Object.entries(snapshot.meta))tx.objectStore('meta').put({key,value});
     tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);
    };request.onerror=()=>reject(request.error);
   });
  },snapshot);
  await p.goto(runtime.url);await p.waitForFunction(()=>state.ready);
  assert.deepEqual(await p.evaluate(()=>state.sessions),snapshot.backup.sessions);
  assert.equal(await p.evaluate(()=>ReviewSchedule.due(getTopic('crase'))),'2027-01-05');
  assert.deepEqual(await p.evaluate(()=>[IDB_VERSION,state.courses.length,state.contentBlocks.length]),[2,0,0]);
 }finally{await migrated.close();}
});

test('agendamento em lote de blocos: sem data, não sugerir e reativar preservam histórico e seleção é contextual',async()=>{
 await fixture();await recordBlock();await page.evaluate(()=>setView('reviews'));await page.locator('#learning-review-filter').selectOption('all');
 const snapshot=await page.evaluate(()=>state.sessions);
 for(const choice of ['free','off','auto']){
  for(const id of ['files','permissions'])await page.locator('[data-unit="block:'+id+'"]').getByRole('checkbox').check();
  await page.getByRole('button',{name:'Agendar seleção',exact:true}).click();await page.locator('#agenda-policy').selectOption(choice);await save('Salvar agendamento');await page.waitForFunction(()=>!Overlay.isOpen);
  assert.equal(await page.evaluate(()=>ReviewSchedule.kind(Learning.block('files'))),choice==='auto'?'auto':choice);
  await page.getByRole('button',{name:'Limpar seleção',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Agendar seleção',exact:true}).isVisible(),false);
 }
 assert.deepEqual(await page.evaluate(()=>state.sessions),snapshot);
});

test('falha no cadastro em lote reverte novos tópicos e preserva o editor',async()=>{
 await fixture();await page.evaluate(()=>openContentBlockEditor(null,'portugues'));await page.locator('#block-name').fill('Transações');await page.getByText('Adicionar tópicos em lote',{exact:true}).click();await page.locator('#block-bulk').fill('Tópico transacional novo');
 await page.evaluate(()=>{window.savedAtomic=DB.atomic;DB.atomic=(stores,work)=>window.savedAtomic.call(DB,stores,api=>work({...api,put:async(store,value)=>{if(store==='contentBlocks')throw Error('falha');return api.put(store,value);}}));});
 await save('Salvar bloco');assert.equal(await page.locator('#block-name').inputValue(),'Transações');assert.equal(await page.evaluate(async()=> (await DB.getAll('topics')).some(t=>t.name==='Tópico transacional novo')),false);
 await page.evaluate(()=>{DB.atomic=window.savedAtomic;});await save('Salvar bloco');await page.waitForFunction(()=>state.contentBlocks.length===3);
 assert.equal(await page.evaluate(()=>state.topics.filter(t=>t.name==='Tópico transacional novo').length),1);
});

test('duas abas: editar material depois de outra gravação não sobrescreve silenciosamente a versão atual',async()=>{
 await fixture();await page.evaluate(()=>openCourseEditor(Learning.course('course-a')));await page.locator('#material-name').fill('Nome da aba antiga');
 const second=await context.newPage();try{await second.goto(runtime.url);await second.waitForFunction(()=>state.ready);await second.evaluate(()=>Learning.patch('courses','course-a',{name:'Nome atualizado na outra aba'}));
 await save('Salvar material');assert.equal(await page.locator('#material-name').isVisible(),true);assert.equal(await page.evaluate(async()=> (await DB.get('courses','course-a')).name),'Nome atualizado na outra aba');
 }finally{await second.close();}
});

test('organizar tópicos já estudados agrupa a sugestão sem inventar sessão ou estudo do bloco',async()=>{
 await fixture();
 const f=await page.evaluate(async()=>{
  await SessionCommands.create({disciplineId:'portugues',date:todayISO(),minutes:30,topics:Array.from({length:10},(_,i)=>({topicId:'command-'+i}))});await refresh();
  const unit=LearningReviews.blockUnits().find(b=>b.id==='files');return {sessions:state.sessions.length,linked:Learning.entries(state.sessions[0]).length,blockFirstStudy:unit.firstStudiedAt||null,derived:unit.hasStudiedTopics,individual:ReviewEngine.allScheduled().filter(t=>t.id.startsWith('command-')).length};
 });assert.deepEqual(f,{sessions:1,linked:0,blockFirstStudy:null,derived:true,individual:0});
});

test('mobile por toque: curso → bloco → cronômetro → registro e período do dia preservam 30 minutos',async()=>{
 const mobile=await open(runtime,{viewport:{width:390,height:844},hasTouch:true,isMobile:process.env.BROWSER!=='firefox'});
 try{
  const p=mobile.page;await seed(p);await fixture(p);await p.clock.install({time:new Date('2026-11-25T15:00:00Z')});
  await p.locator('.quick-materials').getByRole('button',{name:'Estudar com Linux — Curso A',exact:true}).tap();
  await p.locator('#rm-block').selectOption('files');await p.locator('#modal-actions').getByRole('button',{name:'Começar',exact:true}).tap();await p.waitForFunction(()=>TimerService.isActive);await p.clock.fastForward(30*60000);
  await p.locator('#fab').tap();await p.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).tap();await p.waitForFunction(()=>state.sessions.length===1&&!TimerService.isActive);
  await p.locator('#nav-mobile').getByRole('button',{name:'Resultados',exact:true}).tap();await p.locator('#results-period').selectOption('custom');
  await p.locator('[data-date="2026-11-25"]').tap();await p.locator('[data-date="2026-11-25"]').tap();await p.locator('#modal-actions').getByRole('button',{name:'Aplicar período',exact:true}).tap();
  assert.equal(await p.locator('.insights-total strong').innerText(),'30min');assert.equal(await p.evaluate(()=>state.sessions[0].contentEntries[0].blockId),'files');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }finally{await mobile.context.close();}
});
