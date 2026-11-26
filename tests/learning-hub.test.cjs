const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);await fixture();});
afterEach(async()=>context.close());
const save=label=>page.locator('#modal-actions').getByRole('button',{name:label,exact:true}).click();
async function fixture(){await page.evaluate(async()=>{
 await DB.put('disciplines',{...newDiscipline('Segurança'),id:'seguranca'});
 await DB.put('topics',{...newTopic('seguranca','Permissões'),id:'permissoes'});await refresh();
 await Learning.save('courses',{id:'hub',name:'Administração GNU/Linux',emoji:'👩🏽‍💻',url:'https://example.test/hub',favorite:true,disciplineIds:['portugues','matematica','seguranca'],topicIds:['pontuacao','fracoes','permissoes']});
 await Learning.save('contentBlocks',{id:'hub-block',name:'Terminal e arquivos',disciplineId:'portugues',topicIds:['pontuacao','crase'],courseIds:['hub']});
});}
async function register(){await page.evaluate(()=>openRegisterModal({disciplineId:'portugues',...courseStudyPreset(Learning.course('hub'))}));}
async function record(){await register();await page.locator('#rm-min').fill('45');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);}
async function editor(){await page.evaluate(()=>openCourseEditor(Learning.course('hub')));}
async function popup(anchor){
 await context.route('https://example.test/**',r=>r.fulfill({contentType:'text/html',body:'<title>Fonte externa</title>'}));
 const opening=context.waitForEvent('page');await anchor.click();const p=await opening;await p.waitForLoadState();assert.equal(await p.evaluate(()=>window.opener),null);await p.close();
}

test('migração lógica idempotente preserva curso legado, blocos e snapshots sem mudar o IndexedDB',async()=>{
 await record();const snapshot=await page.evaluate(()=>structuredClone(state.sessions));
 await page.evaluate(async()=>{
  const c=Learning.course('hub');const {disciplineIds,topicIds,emoji,...legacy}=c;
  await DB.put('courses',{...legacy,disciplineId:'portugues'});await Learning.migrate();await Learning.migrate();await loadAll();
 });
 assert.deepEqual(await page.evaluate(async()=>{const c=await DB.get('courses','hub');return {ids:c.disciplineIds,old:Object.hasOwn(c,'disciplineId'),emoji:c.emoji,topics:c.topicIds,physical:IDB_VERSION,blocks:Learning.block('hub-block').courseIds};}),{ids:['portugues'],old:false,emoji:'',topics:[],physical:2,blocks:['hub']});
 assert.deepEqual(await page.evaluate(()=>state.sessions),snapshot);
});

test('emoji composto pode ser alterado e removido; nome longo e disciplinas persistem após F5',async()=>{
 await editor();const name='Administração de Sistemas GNU/Linux — redes, segurança e servidores';
 await page.locator('#material-name').fill(name);await page.locator('#material-emoji').fill('🏳️‍🌈');await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
 await page.reload();await page.waitForFunction(()=>state.ready);
 assert.deepEqual(await page.evaluate(()=>({name:Learning.course('hub').name,emoji:Learning.course('hub').emoji,ids:Learning.course('hub').disciplineIds})),{name,emoji:'🏳️‍🌈',ids:['portugues','matematica','seguranca']});
 assert.match(await page.locator('.quick-materials').innerText(),/🏳️‍🌈/);
 await editor();await page.locator('#material-emoji').fill('');await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
 await page.waitForFunction(async()=>(await DB.get('courses','hub'))?.emoji==='');
 assert.equal(await page.evaluate(()=>Learning.course('hub').emoji),'');
});

test('emoji aceita família, modificador, bandeira e keycap; recusa texto, vários emojis e marcação',async()=>{
 const f=await page.evaluate(()=>{
  const good=['👨‍👩‍👧‍👦','👩🏽‍💻','🇧🇷','1️⃣','☁️'].map(x=>Learning.emoji(x));
  const bad=['ab','🐧🐍','<svg>','abc🐧'].map(x=>{try{Learning.emoji(x);return false;}catch(_){return true;}});return {good,bad};
 });assert.deepEqual(f,{good:['👨‍👩‍👧‍👦','👩🏽‍💻','🇧🇷','1️⃣','☁️'],bad:[true,true,true,true]});
 await editor();await page.locator('#material-emoji').fill('dois');await save('Salvar material');assert.equal(await page.locator('#material-name').isVisible(),true);
});

test('conteúdos são agrupados por disciplina e deduplicados entre vínculo direto e bloco',async()=>{
 assert.deepEqual(await page.evaluate(()=>Learning.relatedTopics(Learning.course('hub')).map(t=>t.id).sort()),['crase','fracoes','permissoes','pontuacao']);
 await editor();await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();
 assert.equal(await page.locator('.course-discipline-content').count(),3);
 assert.equal(await page.getByLabel('Associar tópico Pontuação',{exact:true}).count(),1);
 await page.locator('#material-topic-search').fill('permissões');assert.equal(await page.getByLabel('Associar tópico Permissões',{exact:true}).isVisible(),true);
 assert.equal(await page.getByLabel('Associar tópico Frações',{exact:true}).count(),0);
});

test('criação progressiva reutiliza duplicatas e só grava novo tópico com a confirmação do material',async()=>{
 await editor();await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();
 const section=page.locator('.course-discipline-content').filter({has:page.getByRole('heading',{name:'Português',exact:true})});
 await section.getByText('Criar tópico nesta disciplina',{exact:true}).click();await page.locator('#material-new-topic-portugues').fill('grep');await section.getByRole('button',{name:'Associar novo tópico',exact:true}).click();
 assert.equal(await page.evaluate(()=>state.topics.some(t=>t.name==='grep')),false);
 await section.getByText('Criar tópico nesta disciplina',{exact:true}).click();await page.locator('#material-new-topic-portugues').fill('GREP');await section.getByRole('button',{name:'Associar novo tópico',exact:true}).click();
 await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.equal(await page.evaluate(()=>state.topics.filter(t=>normalizeText(t.name)==='grep').length),1);
 assert.equal(await page.evaluate(()=>Learning.course('hub').topicIds.length),4);
 assert.equal(await page.evaluate(()=>state.sessions.length),0);
});

test('cancelar a criação contextual não cria tópico nem altera curso ou agenda',async()=>{
 const before=await page.evaluate(()=>({course:Learning.course('hub'),topics:state.topics}));
 await editor();await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();
 await page.locator('.course-discipline-content').first().getByText('Criar tópico nesta disciplina',{exact:true}).click();await page.locator('#material-new-topic-portugues').fill('Nunca gravado');await page.locator('.course-discipline-content').first().getByRole('button',{name:'Associar novo tópico',exact:true}).click();await save('Cancelar');
 assert.deepEqual(await page.evaluate(()=>({course:Learning.course('hub'),topics:state.topics})),before);
});

test('retirar disciplina explica impacto, exige remover vínculos e preserva estudos, tópicos e revisões',async()=>{
 await record();const before=await page.evaluate(()=>({session:state.sessions[0],topics:state.topics}));
 await editor();await page.getByRole('button',{name:'Remover disciplina Português',exact:true}).click();
 assert.match(await page.locator('.course-impact').innerText(),/1 tópico e 1 bloco/);
 await save('Salvar material');assert.equal(await page.locator('#material-name').isVisible(),true);
 await page.getByRole('button',{name:'Remover vínculos de Português',exact:true}).click();await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>({session:state.sessions[0],topics:state.topics})),before);
 assert.deepEqual(await page.evaluate(()=>Learning.course('hub').disciplineIds),['matematica','seguranca']);
 assert.deepEqual(await page.evaluate(()=>Learning.block('hub-block').courseIds),[]);
 const historical=await page.evaluate(()=>Backup.parseBackup(JSON.stringify(Backup.buildExport())).data.sessions[0]);assert.deepEqual(historical,before.session);
 await page.evaluate(()=>openEditSessionModal(state.sessions[0].id));
 await save('Salvar');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>state.sessions[0].contentEntries),before.session.contentEntries);
});

test('tópicos adicionados depois não aparecem retroativamente e nomes históricos não mudam',async()=>{
 await record();const before=await page.evaluate(()=>state.sessions[0]);
 await page.evaluate(async()=>{const c=Learning.course('hub');await Learning.save('courses',{...c,name:'Nome atual',topicIds:[...c.topicIds,'crase']},c);});
 assert.deepEqual(await page.evaluate(()=>state.sessions[0]),before);
 assert.equal(before.contentEntries[0].courseName,'Administração GNU/Linux');assert.deepEqual(before.topicEntries,[]);
});

test('seleção do curso sugere tópicos apenas da disciplina e adicionar outra é uma ação explícita',async()=>{
 await register();assert.equal(await page.locator('#rm-material').inputValue(),'hub');
 assert.equal(await page.locator('.st-block').count(),1);
 await page.locator('.study-material-topics summary').click();
 assert.equal(await page.getByLabel('Estudar tópico Frações',{exact:true}).count(),0);
 await page.getByLabel('Estudar tópico Pontuação',{exact:true}).check();
 await page.getByRole('button',{name:'Adicionar Matemática',exact:true}).click();
 assert.equal(await page.locator('.st-block').count(),2);assert.equal(await page.locator('#rm-1-material').inputValue(),'hub');
 await page.locator('.study-material-topics summary').last().click();await page.getByLabel('Estudar tópico Frações',{exact:true}).check();
 await page.locator('#rm-min').fill('45');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
 const f=await page.evaluate(()=>{const s=state.sessions[0];return {minutes:s.minutes,disc:SessionModel.disciplineIds(s),topics:s.topicEntries.map(t=>t.topicId).sort(),course:AnalyticsEngine.query({periodPreset:'hoje',courseIds:['hub']}).totals.minutes,shares:sum(Learning.shares(s),e=>e.minutes)};});
 assert.deepEqual(f,{minutes:45,disc:['portugues','matematica'],topics:['fracoes','pontuacao'],course:45,shares:45});
});

test('escolher curso nunca seleciona todos os tópicos ou todas as disciplinas',async()=>{
 await page.evaluate(()=>openRegisterModal({disciplineId:'matematica'}));await page.locator('#rm-material').selectOption('hub');await page.locator('#rm-min').fill('30');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
 assert.deepEqual(await page.evaluate(()=>({discs:SessionModel.disciplineIds(state.sessions[0]),topics:state.sessions[0].topicEntries,minutes:state.sessions[0].minutes})),{discs:['matematica'],topics:[],minutes:30});
});

test('link imediato abre em nova guia e mantém comentário, tópicos, material e formulário sem iniciar relógio',async()=>{
 await register();await page.locator('.study-material-topics summary').click();await page.getByLabel('Estudar tópico Pontuação',{exact:true}).check();
 await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();await page.locator('#rm-comment').fill('Aula sobre terminal');await page.locator('#rm-min').fill('45');
 await popup(page.locator('.study-material-link a'));
 assert.equal(await page.locator('#rm-comment').inputValue(),'Aula sobre terminal');assert.equal(await page.locator('#rm-material').inputValue(),'hub');assert.equal(await page.evaluate(()=>TimerService.isActive),false);
 await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);assert.equal(await page.evaluate(()=>state.sessions[0].topicEntries[0].topicId),'pontuacao');
});

test('sessão ativa, Foco e Apresentação abrem material sem reiniciar; F5 retoma e finaliza uma única sessão',async()=>{
 await page.clock.install({time:new Date('2026-11-26T15:00:00Z')});
 await page.evaluate(()=>openRegisterModal({mode:'timer',...courseStudyPreset(Learning.course('hub'))}));await save('Começar');await page.waitForFunction(()=>TimerService.isActive);
 const id=await page.evaluate(()=>TimerService.currentRunId());await page.clock.fastForward(10*60000);
 await popup(page.locator('.today-active-material a'));await page.evaluate(()=>FocusMode.enter());
 assert.match(await page.locator('#focus-material').innerText(),/Administração GNU\/Linux/);await popup(page.locator('#focus-material a'));
 await page.evaluate(()=>FocusMode.setPresentation(true));assert.equal(await page.locator('#focus-material a').isVisible(),true);
 await page.evaluate(()=>FocusMode.exit());await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>TimerService.currentRunId()),id);
 await page.clock.fastForward(20*60000);await page.locator('#fab').click();await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1&&!TimerService.isActive);
 assert.equal(await page.evaluate(()=>state.sessions[0].id),id);assert.equal(await page.evaluate(()=>state.sessions[0].minutes),30);
});

test('alterar conteúdos do catálogo durante o cronômetro preserva a seleção já confirmada',async()=>{
 await page.clock.install({time:new Date('2026-11-26T15:00:00Z')});
 await page.evaluate(()=>openRegisterModal({mode:'timer',...courseStudyPreset(Learning.course('hub'))}));await page.locator('#rm-block').selectOption('hub-block');await save('Começar');await page.waitForFunction(()=>TimerService.isActive);
 await page.evaluate(async()=>{const c=Learning.course('hub');await Learning.save('courses',{...c,topicIds:[]},c);const b=Learning.block('hub-block');await Learning.save('contentBlocks',{...b,topicIds:[]},b);});
 await page.clock.fastForward(5*60000);await page.locator('#fab').click();await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
 assert.deepEqual(await page.evaluate(()=>state.sessions[0].contentEntries[0].topicIds),['pontuacao','crase']);
});

test('duas abas: edição obsoleta preserva rascunho e acesso recente não provoca conflito falso',async()=>{
 await editor();await page.locator('#material-name').fill('Meu rascunho');
 const second=await context.newPage();try{
  await second.goto(runtime.url);await second.waitForFunction(()=>state.ready);await second.evaluate(()=>Learning.patch('courses','hub',{name:'Outra aba'}));
  await save('Salvar material');assert.equal(await page.locator('#material-name').inputValue(),'Meu rascunho');assert.equal(await page.evaluate(async()=>(await DB.get('courses','hub')).name),'Outra aba');
  await save('Cancelar');await page.evaluate(()=>loadAll());await editor();await page.locator('#material-name').fill('Nome confirmado');
  await second.evaluate(async()=>{const c=await DB.get('courses','hub');await DB.put('courses',{...c,lastOpenedAt:nowISO()});});await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
  assert.equal(await page.evaluate(()=>Learning.course('hub').name),'Nome confirmado');assert.ok(await page.evaluate(()=>Learning.course('hub').lastOpenedAt));
 }finally{await second.close();}
});

test('falha atômica reverte criação contextual e blocos; mantém o formulário para retentar',async()=>{
 await editor();await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();await page.locator('.course-discipline-content').first().getByText('Criar tópico nesta disciplina',{exact:true}).click();await page.locator('#material-new-topic-portugues').fill('Transação');await page.locator('.course-discipline-content').first().getByRole('button',{name:'Associar novo tópico',exact:true}).click();
 await page.evaluate(()=>{window.hubAtomic=DB.atomic;DB.atomic=(stores,work)=>hubAtomic.call(DB,stores,api=>work({...api,put:async(store,value)=>{if(store==='courses')throw Error('falha injetada');return api.put(store,value);}}));});
 await save('Salvar material');assert.equal(await page.evaluate(async()=>(await DB.getAll('topics')).some(t=>t.name==='Transação')),false);assert.equal(await page.locator('#material-name').isVisible(),true);
 await page.evaluate(()=>DB.atomic=window.hubAtomic);await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);assert.equal(await page.evaluate(()=>state.topics.filter(t=>t.name==='Transação').length),1);
});

test('backup 14 preserva emoji, relações, snapshots e checksum; backup 13 continua importável',async()=>{
 await record();
 const result=await page.evaluate(async()=>{
  const backup=Backup.buildExport(),parsed=Backup.parseBackup(JSON.stringify(backup));await Backup.restoreInto(parsed.data);await loadAll();
  const bad=structuredClone(backup);bad.courses[0].disciplineIds.push('inexistente');delete bad.integrity;let refused=false;try{Backup.parseBackup(JSON.stringify(bad));}catch(_){refused=true;}
  const wrong=structuredClone(backup);wrong.courses[0].disciplineIds=['matematica'];delete wrong.integrity;let wrongTopics=false;try{Backup.parseBackup(JSON.stringify(wrong));}catch(_){wrongTopics=true;}
  const old=structuredClone(backup);old.schemaVersion=13;old.courses=old.courses.map(c=>{const{disciplineIds,topicIds,emoji,...rest}=c;return {...rest,disciplineId:disciplineIds[0]};});old.integrity=BackupIntegrity.describe(old);
  const legacy=Backup.parseBackup(JSON.stringify(old));
  return {schema:backup.schemaVersion,checksum:parsed.report.integrity,emoji:Learning.course('hub').emoji,ids:Learning.course('hub').disciplineIds,topics:Learning.course('hub').topicIds,refused,wrongTopics,oldChecksum:legacy.report.integrity,oldIds:legacy.data.courses[0].disciplineIds};
 });assert.deepEqual(result,{schema:14,checksum:'ok',emoji:'👩🏽‍💻',ids:['portugues','matematica','seguranca'],topics:['pontuacao','fracoes','permissoes'],refused:true,wrongTopics:true,oldChecksum:'ok',oldIds:['portugues']});
});

test('material multidisciplinar aparece nos filtros e revisão oferece a fonte do tópico sem criar atividades',async()=>{
 await page.evaluate(()=>{applyAnalyticsQuery({scopeType:'discipline',scopeIds:['matematica']});});
 assert.equal(await page.locator('#results-material option[value="hub"]').count(),1);
 await page.evaluate(()=>{ui.learningReviews={query:'',discipline:'seguranca',filter:'all',date:'',selected:new Set(),page:0};setView('reviews');});
 const unit=page.locator('[data-unit="topic:permissoes"]');await unit.getByText('Materiais de apoio',{exact:true}).click();assert.equal(await unit.locator('a').getAttribute('target'),'_blank');assert.equal(await page.evaluate(()=>state.sessions.length),0);
});

test('Hoje: frase no cabeçalho pode ser ocultada e continuação não usa chips de larguras variáveis',async()=>{
 await record();await page.evaluate(()=>setView('today'));
 assert.equal(await page.locator('#today-quote .daily-quote').count(),1);assert.equal(await page.locator('.today-side .daily-quote').count(),0);assert.equal(await page.locator('.today-quick').count(),0);assert.ok(await page.locator('.continuation-row').count());
 await page.evaluate(async()=>{state.settings.showDailyQuote=false;await saveSettings();renderToday();});assert.equal(await page.locator('#today-quote .daily-quote').count(),0);
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.locator('#today-quote .daily-quote').count(),0);
});

test('adição posterior de disciplina e tópico existente mantém ID, link e bloco compartilhado',async()=>{
 await page.evaluate(async()=>{const c=Learning.course('hub');await Learning.save('courses',{...c,disciplineIds:['portugues'],topicIds:['pontuacao']},c);});
 await editor();await page.getByText('Disciplinas associadas',{exact:true}).click();await page.getByLabel('Associar disciplina Matemática',{exact:true}).check();
 await page.locator('summary').filter({hasText:'Tópicos e blocos'}).click();await page.getByLabel('Associar tópico Frações',{exact:true}).check();await save('Salvar material');await page.waitForFunction(()=>!Overlay.isOpen);
 assert.deepEqual(await page.evaluate(()=>{const c=Learning.course('hub');return {id:c.id,url:c.url,ids:c.disciplineIds,topics:c.topicIds,blocks:Learning.relatedBlocks(c).map(b=>b.id)};}),{id:'hub',url:'https://example.test/hub',ids:['portugues','matematica'],topics:['pontuacao','fracoes'],blocks:['hub-block']});
});

test('mudança concorrente no bloco associado não é sobrescrita ao salvar o material',async()=>{
 await editor();await page.getByText('Mais detalhes',{exact:true}).click();await page.locator('#material-description').fill('Meu detalhe');
 const second=await context.newPage();try{
  await second.goto(runtime.url);await second.waitForFunction(()=>state.ready);await second.evaluate(async()=>{const b=Learning.block('hub-block');await Learning.save('contentBlocks',{...b,topicIds:['crase']},b);});
  await save('Salvar material');assert.equal(await page.locator('#material-description').inputValue(),'Meu detalhe');
  assert.deepEqual(await page.evaluate(async()=>(await DB.get('contentBlocks','hub-block')).topicIds),['crase']);
 }finally{await second.close();}
});

test('disciplina removida por outra aba durante preenchimento recusa registro parcial e preserva seleção',async()=>{
 await register();await page.locator('#rm-min').fill('45');
 await page.evaluate(()=>DB.delete('disciplines','portugues'));await save('Registrar estudo');
 assert.equal(await page.locator('#rm-min').inputValue(),'45');assert.equal(await page.locator('#rm-material').inputValue(),'hub');assert.equal(await page.evaluate(async()=>await DB.count('sessions')),0);
});

test('referência de tópico de outra disciplina e link perigoso são recusados atomicamente',async()=>{
 const before=await page.evaluate(()=>Learning.course('hub'));
 const refused=await page.evaluate(async()=>{
  const c=Learning.course('hub'),result=[];
  for(const changes of [{disciplineIds:['matematica'],topicIds:['pontuacao']},{url:'javascript:alert(1)'},{disciplineIds:['ausente'],topicIds:[]}]){
   try{await Learning.save('courses',{...c,...changes},c);result.push(false);}catch(_){result.push(true);}
  }return result;
 });assert.deepEqual(refused,[true,true,true]);assert.deepEqual(await page.evaluate(async()=>Learning.normalizeCourse(await DB.get('courses','hub'))),before);
});

test('material em uso no cronômetro não pode ser excluído mesmo antes do primeiro registro',async()=>{
 await page.evaluate(async()=>{
  await Learning.save('courses',{id:'running',name:'Fonte em uso',disciplineIds:['portugues'],url:'https://example.test/running'});
  await startTimer('portugues',[],[],null,null,{contentEntries:[{disciplineId:'portugues',courseId:'running'}]});
 });
 const facts=await page.evaluate(async()=>{let refused=false;try{await Learning.remove('courses','running');}catch(_){refused=true;}return {refused,exists:!!(await DB.get('courses','running')),active:TimerService.isActive,count:await DB.count('sessions')};});
 assert.deepEqual(facts,{refused:true,exists:true,active:true,count:0});
});

test('trocar o material antes de adicionar uma disciplina usa o novo curso em ambos os segmentos',async()=>{
 await page.evaluate(async()=>Learning.save('courses',{id:'other',name:'Outro curso',url:'https://example.test/other',disciplineIds:['portugues','matematica'],topicIds:[]}));
 await register();await page.locator('#rm-material').selectOption('other');await page.getByRole('button',{name:'Adicionar Matemática',exact:true}).click();assert.equal(await page.locator('#rm-1-material').inputValue(),'other');
 await page.locator('#rm-min').fill('45');await save('Registrar estudo');await page.waitForFunction(()=>state.sessions.length===1);
 assert.deepEqual(await page.evaluate(()=>state.sessions[0].contentEntries.map(e=>e.courseId)),['other','other']);assert.equal(await page.evaluate(()=>state.sessions[0].minutes),45);
});
