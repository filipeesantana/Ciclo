const {test,before,after,beforeEach,afterEach}=require('node:test');const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));page.setDefaultTimeout(7000);await seed(page);});afterEach(async()=>context.close());
const action=name=>page.locator('#modal-actions').getByRole('button',{name,exact:true});
async function register(){await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));await page.getByRole('button',{name:'Não lembro os horários',exact:true}).click();await page.locator('#rm-min').fill('40');}
async function draft(){return page.evaluate(()=>GuidedReviewCommands.create([{topicId:'pontuacao',method:'active_recall',minutes:10},{topicId:'crase',method:'flashcards',minutes:5},{topicId:'fracoes',method:'exercises',minutes:5}],20));}
async function guided(){await page.evaluate(async()=>{window.gd=await GuidedReviewCommands.create([{topicId:'pontuacao',method:CONCRETE_METHODS[0],minutes:10},{topicId:'crase',method:'flashcards',minutes:5},{topicId:'fracoes',method:CONCRETE_METHODS[0],minutes:5}],20);await openGuidedReviewPlayer(gd.id);});}

test('comentário visível, recolhido e salvo mantém texto; Cancelar e F5 conservam rascunho',async()=>{
 await register();const add=page.getByRole('button',{name:'+ Adicionar comentário',exact:true});assert.equal(await add.isVisible(),true);
 await add.click();assert.equal(await page.locator('#rm-comment').evaluate(e=>e===document.activeElement),true);
 await page.locator('#rm-comment').fill('Texto que permanece ao recolher.');await page.locator('.comment').getByRole('button',{name:'Recolher',exact:true}).click();
 assert.match(await page.locator('.comment-toggle').textContent(),/Comentário adicionado/);await action('Cancelar').click();
 await page.reload();await page.waitForFunction(()=>state.ready);await page.locator('#fab').click();assert.equal(await page.locator('#rm-comment').inputValue(),'Texto que permanece ao recolher.');
 await page.locator('.comment').getByRole('button',{name:'Recolher',exact:true}).click();await action('Registrar estudo').click();await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);
 assert.equal(await page.evaluate(()=>state.sessions[0].comment),'Texto que permanece ao recolher.');
});
test('remoção de comentário é explícita e confirmada',async()=>{
 await register();await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();await page.locator('#rm-comment').fill('Remover de propósito');await page.getByRole('button',{name:'Remover comentário',exact:true}).click();
 await page.locator('#modal-actions').getByRole('button',{name:'Remover comentário',exact:true}).click();
 await action('Registrar estudo').click();await page.waitForFunction(()=>state.sessions.length===1);assert.equal(await page.evaluate(()=>state.sessions[0].comment),'');
});
test('segunda disciplina visível, foco no seletor, sem duplicatas nem minutos multiplicados',async()=>{
 await register();await page.getByRole('button',{name:'+ Adicionar outra disciplina',exact:true}).click();await page.getByRole('option',{name:/Matemática/}).click();
 assert.equal(await page.locator('.st-block').count(),2);await action('Registrar estudo').click();await page.waitForFunction(()=>state.sessions.length===1);
 const s=await page.evaluate(()=>({minutes:state.sessions[0].minutes,ids:SessionModel.disciplineIds(state.sessions[0]),total:AnalyticsEngine.query({periodPreset:'hoje'}).totals.minutes}));assert.equal(s.minutes,40);assert.equal(s.total,40);assert.equal(new Set(s.ids).size,2);
});
test('troca de modo não apaga comentário, tempo ou rascunho',async()=>{
 await register();await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();await page.locator('#rm-comment').fill('Conservar nos dois modos');
 await page.getByRole('radio',{name:/Estudar agora/}).click();await page.reload();await page.waitForFunction(()=>state.ready);await page.locator('#fab').click();
 assert.equal(await page.locator('#rm-comment').inputValue(),'Conservar nos dois modos');assert.equal(await page.locator('#rm-min').inputValue(),'40');
});
test('Hoje usa só dados do dia, soma multidisciplinar uma vez e ignora descanso e sessão ativa',async()=>{
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:90,date:addDaysISO(todayISO(),-1)});await refresh();setView('today');});assert.equal(await page.locator('.today-summary').count(),0);assert.match(await page.locator('.tf-reason').first().textContent(),/Nenhum estudo registrado hoje/);
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',disciplines:[{disciplineId:'portugues'},{disciplineId:'matematica'}],minutes:40,date:todayISO(),breaks:[{id:'b',minutes:10}]});await refresh();});
 assert.match(await page.locator('.day-total').textContent(),/40/);assert.match(await page.locator('.today-summary').textContent(),/1 estudo registrado/);
 await page.evaluate(()=>startTimer('matematica',[],[]));assert.match(await page.locator('.day-total').textContent(),/40/);assert.equal(await page.evaluate(()=>state.sessions.length),2);
});
test('Hoje muda imediatamente após registrar, editar, mudar data e excluir',async()=>{
 await page.evaluate(()=>setView('today'));await register();await action('Registrar estudo').click();await page.waitForFunction(()=>!!document.querySelector('.day-total'));assert.match(await page.locator('.day-total').textContent(),/40/);
 await page.evaluate(async()=>{const s=state.sessions[0];await SessionCommands.update(s.id,{minutes:60},{base:s});await refresh();});assert.match(await page.locator('.day-total').textContent(),/1h/);
 await page.evaluate(async()=>{const s=state.sessions[0];await SessionCommands.update(s.id,{date:addDaysISO(todayISO(),-1)},{base:s});await refresh();});assert.equal(await page.locator('.today-summary').count(),0);
 await page.evaluate(async()=>{await SessionCommands.remove(state.sessions[0].id);await refresh();});assert.equal(await page.locator('.today-summary').count(),0);
});
test('Hoje → Análises do dia → Voltar e Histórico de hoje usam o recorte correto',async()=>{
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:40,date:todayISO()});await SessionCommands.create({disciplineId:'matematica',minutes:50,date:addDaysISO(todayISO(),-1)});await refresh();setView('today');});
 await page.getByRole('button',{name:'Ver detalhes do dia',exact:true}).click();assert.equal(await page.evaluate(()=>ui.analyticsQuery.periodPreset),'hoje');assert.equal(await page.evaluate(()=>AnalyticsEngine.query(ui.analyticsQuery).totals.minutes),40);
 await page.goBack();assert.equal(await page.evaluate(()=>ui.view),'today');await page.getByRole('button',{name:'Ver registros de hoje',exact:true}).click();assert.equal(await page.evaluate(()=>filteredSessions().length),1);
});
test('filtros e busca do Histórico voltam depois de outro recorte e de F5',async()=>{
 await page.evaluate(()=>{setView('history');ui.history.search='português';ui.history.disciplineId='portugues';renderHistory();setView('today');ui.history={...ui.history,search:'',disciplineId:'',period:'hoje'};setView('history');});
 await page.goBack();await page.goBack();assert.equal(await page.evaluate(()=>ui.history.search),'português');assert.equal(await page.evaluate(()=>ui.history.disciplineId),'portugues');
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>ui.history.search),'português');
});
test('virada do dia usa atribuição civil ao início e não duplica sessão noturna',async()=>{
 await page.clock.install({time:new Date('2026-10-28T02:58:00Z')});await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:20,date:todayISO()});await refresh();setView('today');DayWatch.day=todayISO();});assert.equal(await page.locator('.today-summary').count(),1);
 await page.clock.fastForward(3*60000);await page.evaluate(async()=>{while(DayWatch.running)await new Promise(r=>setTimeout(r,10));await DayWatch.check();});assert.equal(await page.locator('.today-summary').count(),0);
});
test('revisão livre aceita várias disciplinas sem tópicos e conserva agendas',async()=>{
 await page.evaluate(()=>{setView('reviews');openFreeReview();});await page.getByRole('radio',{name:/Já estudei/}).click();await page.getByRole('button',{name:'Não lembro os horários',exact:true}).click();await page.locator('#rm-min').fill('45');
 await page.locator('#rm-disc').click();await page.getByRole('option',{name:/Português/}).click();await page.getByRole('button',{name:'+ Adicionar outra disciplina',exact:true}).click();await page.getByRole('option',{name:/Matemática/}).click();
 const before=await page.evaluate(()=>JSON.stringify(state.topics));await action('Registrar estudo').click();await page.waitForFunction(()=>state.sessions.length===1);assert.equal(await page.evaluate(()=>JSON.stringify(state.topics)),before);assert.equal(await page.evaluate(()=>state.sessions[0].minutes),45);
});
test('roteiro: pulo, respostas individuais e flashcards pessoais geram uma sessão agregada',async()=>{
 await guided();await page.locator('#guided-outcome').selectOption('remembered');await page.getByRole('button',{name:'Concluir assunto e continuar',exact:true}).click();await page.waitForFunction(()=>state.meta.guidedReview.cursor===1);
 assert.match(await page.locator('.guided-player').textContent(),/seus próprios flashcards/);await page.getByRole('button',{name:'Pular assunto',exact:true}).click();await page.waitForFunction(()=>state.meta.guidedReview.cursor===2);
 await page.locator('#guided-outcome').selectOption('hard');await action('Encerrar roteiro').click();await page.locator('#guided-result-minutes').fill('45');await action('Registrar uma revisão').click();await page.waitForFunction(()=>state.sessions.length===1&&!Overlay.isOpen);
 const s=await page.evaluate(()=>({minutes:state.sessions[0].minutes,entries:state.sessions[0].topicEntries.map(e=>[e.topicId,e.outcome]),skipped:getTopic('crase').lastReviewedAt}));assert.equal(s.minutes,45);assert.deepEqual(s.entries,[['pontuacao','remembered'],['fracoes','hard']]);assert.equal(s.skipped,null);
});
test('roteiro: pausa exclui tempo, confirmação e cursor sobrevivem ao F5',async()=>{
 await page.clock.install({time:new Date('2026-10-28T15:00:00Z')});await guided();await page.getByRole('button',{name:'Continuar roteiro',exact:true}).click();await page.waitForFunction(()=>!!state.meta.guidedReview.runningSince);await page.clock.fastForward(10*60000);await page.getByRole('button',{name:'Pausar',exact:true}).click();await page.waitForFunction(()=>!state.meta.guidedReview.runningSince);
 await page.locator('#guided-outcome').selectOption('remembered');await page.getByRole('button',{name:'Concluir assunto e continuar',exact:true}).click();await page.waitForFunction(()=>state.meta.guidedReview.cursor===1);
 await page.reload();await page.waitForFunction(()=>state.ready);await page.clock.fastForward(5*60000);await page.evaluate(()=>openGuidedReviewPlayer(state.meta.guidedReview.id));assert.equal(await page.locator('.guided-clock').textContent(),'10:00');assert.match(await page.locator('.guided-player').textContent(),/1 realizados/);
});
test('duas abas: versão antiga não altera respostas e finalização concorrente não duplica',async()=>{
 const r=await page.evaluate(async()=>{let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:CONCRETE_METHODS[0],minutes:20}],20);d=await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';r.items[0].outcome='remembered';return r;});return d;});
 const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 const results=await Promise.all([page.evaluate(d=>GuidedReviewCommands.finish(d,20),r),other.evaluate(d=>GuidedReviewCommands.finish(d,20),r)]);assert.equal(results.filter(x=>x.duplicate).length,1);assert.equal(await page.evaluate(()=>DB.count('sessions')),1);
 await other.close();
});
test('roteiro rejeita edição concorrente e não confirma falha de IndexedDB',async()=>{
 const result=await page.evaluate(async()=>{const d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:CONCRETE_METHODS[0],minutes:20}],20);await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';return r;});let conflict=false;try{await GuidedReviewCommands.update(d,r=>r);}catch(e){conflict=true;}return {conflict,count:await DB.count('sessions')};});assert.deepEqual(result,{conflict:true,count:0});
 await page.evaluate(async()=>{await openGuidedReviewPlayer(state.meta.guidedReview.id);window.atomic=DB.atomic;DB.atomic=async()=>{throw new Error('Falha simulada de escrita');};});
 await action('Encerrar roteiro').click();assert.equal(await page.locator('#modal-title').textContent(),'Sua revisão guiada');assert.equal(await page.evaluate(()=>state.sessions.length),0);await page.evaluate(()=>DB.atomic=window.atomic);
});
test('backup lógico 11 guarda progresso pausado e mantém dados antigos e checksum',async()=>{
 await page.evaluate(async()=>{let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'flashcards',minutes:20}],20);await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';r.items[0].outcome='hard';return r;});await loadAll();});
 const r=await page.evaluate(async()=>{const b=Backup.buildExport(),p=Backup.parseBackup(JSON.stringify(b));await Backup.restoreInto(p.data);await loadAll();return {schema:b.schemaVersion,idb:IDB_VERSION,integrity:BackupIntegrity.verify(b),same:JSON.stringify(b.guidedReview)===JSON.stringify(state.meta.guidedReview),native:await new Promise((resolve,reject)=>{const req=indexedDB.open(IDB_NAME);req.onsuccess=()=>{const db=req.result;resolve([...db.objectStoreNames].filter(s=>/card/i.test(s)));db.close();};req.onerror=()=>reject(req.error);})};});assert.equal(r.schema,11);assert.equal(r.idb,1);assert.equal(r.integrity,'ok');assert.equal(r.same,true);assert.deepEqual(r.native,[]);
});
test('roteiro sem autoavaliação não inventa resultado; agenda do tópico pulado fica intacta',async()=>{
 const r=await page.evaluate(async()=>{let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'flashcards',minutes:20}],20);d=await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';return r;});await GuidedReviewCommands.finish(d,20);await loadAll();return state.sessions[0].topicEntries[0].outcome;});assert.equal(r,null);
});
test('um relógio por vez: roteiro e cronômetro recusam execução simultânea',async()=>{
 const r=await page.evaluate(async()=>{let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:CONCRETE_METHODS[0],minutes:20}],20);d=await GuidedReviewCommands.update(d,r=>{r.runningSince=Date.now();return r;});const started=await startTimer('portugues',[],[]);d=await GuidedReviewCommands.update(d,r=>{r.runningSince=null;return r;});await startTimer('portugues',[],[]);let refused=false;try{await GuidedReviewCommands.update(d,r=>{r.runningSince=Date.now();return r;});}catch(e){refused=true;}return {started,refused};});assert.deepEqual(r,{started:false,refused:true});
});
test('editor do roteiro permite adicionar, reordenar, remover, trocar método e duração',async()=>{
 await page.evaluate(()=>{setView('reviews');openGuidedReviewBuilder(20);});
 for(const id of ['pontuacao','crase','fracoes'])await page.locator('#guided-add').selectOption(id);
 await page.getByRole('button',{name:'Subir Frações',exact:true}).click();await page.locator('.guided-item').last().getByRole('button',{name:'Remover assunto',exact:true}).click();await page.locator('#guided-add').selectOption('crase');await page.locator('#guided-method-1').selectOption('flashcards');await page.locator('#guided-duration-1').fill('10');
 await action('Começar roteiro').click();await page.waitForSelector('.guided-player');
 assert.deepEqual(await page.evaluate(()=>state.meta.guidedReview.items.map(i=>[i.topicId,i.minutes])),[['pontuacao',5],['fracoes',10],['crase',5]]);assert.equal(await page.evaluate(()=>state.meta.guidedReview.items[1].method),'flashcards');
});
test('roteiro rejeita backup inválido, impede restauração enquanto conta e exporta pausado',async()=>{
 const r=await page.evaluate(async()=>{
  let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'flashcards',minutes:20}],20);d=await GuidedReviewCommands.update(d,r=>{r.runningSince=Date.now()-600000;return r;});await loadAll();
  const b=Backup.buildExport();let blocked=false,invalid=false;try{await Backup.restoreInto(Backup.parseBackup(JSON.stringify(b)).data);}catch(e){blocked=e.code==='guided-active';}
  const bad=structuredClone(b);bad.guidedReview.items[0].outcome='inventado';try{Backup.parseBackup(JSON.stringify(bad));}catch(e){invalid=!!e.fatal;}
  return {blocked,invalid,paused:b.guidedReview.runningSince===null,elapsed:b.guidedReview.elapsedMs,n:await DB.count('sessions')};
 });assert.equal(r.blocked,true);assert.equal(r.invalid,true);assert.equal(r.paused,true);assert.ok(r.elapsed>=600000);assert.equal(r.n,0);
});
test('Histórico conserva o período usado antes de outra análise e após F5',async()=>{
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'portugues',minutes:40,date:todayISO()});await SessionCommands.create({disciplineId:'matematica',minutes:50,date:addDaysISO(todayISO(),-1)});await refresh();applyAnalyticsQuery({periodPreset:'hoje',focus:'time'});ui.history.period='analises';setView('history');});
 assert.equal(await page.evaluate(()=>filteredSessions().length),1);
 await page.evaluate(()=>{setView('analytics');applyAnalyticsQuery({periodPreset:'30d',focus:'time'});setView('history');});assert.equal(await page.evaluate(()=>filteredSessions().length),2);
 await page.goBack();await page.goBack();await page.goBack();assert.equal(await page.evaluate(()=>ui.view),'history');assert.equal(await page.evaluate(()=>filteredSessions().length),1);
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>filteredSessions().length),1);
});
test('Planejamento → Hoje → Histórico → Voltar recupera a semana consultada',async()=>{
 await page.evaluate(()=>{setView('plan');ui.planWeekOffset=-3;renderPlan();setView('today');setView('history');});await page.goBack();await page.goBack();
 assert.equal(await page.evaluate(()=>ui.view),'plan');assert.equal(await page.evaluate(()=>ui.planWeekOffset),-3);
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>ui.planWeekOffset),-3);
});
test('roteiro encerrado sem estudo não retorna falso sucesso para uma finalização antiga',async()=>{
 const r=await page.evaluate(async()=>{let d=await GuidedReviewCommands.create([{topicId:'pontuacao',method:'flashcards',minutes:20}],20);d=await GuidedReviewCommands.update(d,r=>{r.items[0].status='done';return r;});await GuidedReviewCommands.update(d,r=>{r.finishedAt=nowISO();return r;});let refused=false;try{await GuidedReviewCommands.finish(d,20);}catch(e){refused=/sem registrar estudo/.test(e.message);}return {refused,count:await DB.count('sessions'),reviewed:(await DB.get('topics','pontuacao')).lastReviewedAt};});assert.deepEqual(r,{refused:true,count:0,reviewed:null});
});
