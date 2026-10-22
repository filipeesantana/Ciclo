const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{
 ({context,page}=await open(runtime,{hasTouch:true}));page.setDefaultTimeout(8000);await seed(page);
 await page.evaluate(async()=>{await DB.put('plans',{...newPlan('Minha semana',300),id:'plan',allocations:[{disciplineId:'portugues',targetMinutes:180},{disciplineId:'matematica',targetMinutes:120}]});await refresh();setView('plan');});
});
afterEach(async()=>context.close());
test('redimensionar a semana não gera ciclos do ResizeObserver nem transbordamento',async()=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,1440,430,768,1920,375,1366,390]){
  await page.setViewportSize({width,height:900});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 }
 assert.deepEqual(errors,[]);
});
async function picker(){await page.getByRole('button',{name:'Adicionar aos dias',exact:true}).click();}
async function choose(touch=false){
 const radio=page.locator('.wb-subject').filter({hasText:'Matemática'}).getByRole('radio');
 if(touch){await radio.tap();await page.locator('.wb-days input').nth(0).tap();await page.locator('.wb-days input').nth(2).tap();}
 else{await radio.check();await page.locator('.wb-days input').nth(0).check();await page.locator('.wb-days input').nth(2).check();}
}
test('planejar pelo toque: uma disciplina em dois dias sem horário nem duração',async()=>{
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Adicionar aos dias',exact:true}).tap();await choose(true);
 const button=page.locator('#modal-actions').getByRole('button',{name:'Adicionar aos dias',exact:true});
 await button.evaluate(b=>{b.click();b.click();});await page.waitForFunction(()=>!Overlay.isOpen&&WeekPlan.view(planWeekStart()).blocks.length===2);
 const result=await page.evaluate(()=>({blocks:WeekPlan.view(planWeekStart()).blocks,sessions:state.sessions.length,goal:planWeekGoal(WeekPlan.view(planWeekStart()))}));
 assert.equal(result.blocks.length,2);assert.equal(new Set(result.blocks.map(b=>b.id)).size,2);assert.ok(result.blocks.every(b=>b.minutes===null&&b.start===null));
 assert.equal(result.sessions,0);assert.equal(result.goal,300);
});
test('planejar com duração e horário, mover pelo editor e depois tirar o horário',async()=>{
 await picker();await choose();await page.getByText('Duração e horário (opcionais)',{exact:true}).click();
 await page.locator('#wb-minutes').fill('45');await page.locator('#wb-start').fill('1900');
 await page.locator('#modal-actions').getByRole('button',{name:'Adicionar aos dias',exact:true}).click();await page.waitForFunction(()=>!Overlay.isOpen&&WeekPlan.view(planWeekStart()).blocks.length===2);
 let blocks=await page.evaluate(()=>WeekPlan.view(planWeekStart()).blocks);assert.ok(blocks.every(b=>b.minutes===45&&b.start==='19:00'));
 await page.locator('.blk-main').first().click();await page.locator('#be-day').selectOption(await page.evaluate(()=>WeekPlan.datesOf(planWeekStart())[4]));
 const movedId=blocks[0].id,date=await page.evaluate(()=>WeekPlan.datesOf(planWeekStart())[4]);
 await page.getByRole('button',{name:'Tirar o horário',exact:true}).click();await page.locator('#modal-actions').getByRole('button',{name:'Salvar',exact:true}).click();
 // Fechar a janela confirma o commit; a releitura que atualiza os blocos é
 // assíncrona. Espera a mudança visível, em vez de ler um snapshot anterior.
 await page.waitForFunction(({id,date})=>{
  const b=WeekPlan.view(planWeekStart()).blocks.find(b=>b.id===id);
  return !Overlay.isOpen&&b?.date===date&&b.start===null;
 },{id:movedId,date});
 const persisted=await page.evaluate(async id=>(await DB.get('weeklyPlans',planWeekStart())).blocks.find(b=>b.id===id),movedId);
 assert.equal(persisted.start,null);assert.equal(persisted.date,date);
 const after=await page.evaluate(()=>WeekPlan.view(planWeekStart()).blocks);
 assert.equal(after.length,2);assert.equal(after.find(b=>b.id===blocks[0].id).start,null);
 assert.equal(after.find(b=>b.id===blocks[0].id).date,await page.evaluate(()=>WeekPlan.datesOf(planWeekStart())[4]));
});
test('Foco em paisagem e zoom CSS de 200% permite alcançar Encerrar',async()=>{
 for(const zoom of [1,2]){
  await page.setViewportSize({width:667,height:375});
  await page.evaluate(async zoom=>{document.documentElement.style.zoom=String(zoom);if(!TimerService.isActive)await startTimer(['portugues','matematica'],['pontuacao','crase','fracoes'],['laboratorio','projeto']);FocusMode.enter();},zoom);
  await page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}).click();
  assert.equal(await page.locator('#modal-title').textContent(),'Finalizar estudo');
  await page.locator('#modal-actions').getByRole('button',{name:'Continuar estudando',exact:true}).click();
 }
});
test('cancelar seleção ou enviar sem dias preserva a semana',async()=>{
 await picker();await page.locator('.wb-subject input').first().check();
 await page.locator('#modal-actions').getByRole('button',{name:'Adicionar aos dias',exact:true}).click();
 assert.equal(await page.evaluate(()=>Overlay.isOpen),true);assert.match(await page.locator('.wb-selection').textContent(),/pelo menos um dia/);
 await page.locator('#modal-actions').getByRole('button',{name:'Cancelar',exact:true}).click();
 assert.equal(await page.evaluate(()=>WeekPlan.view(planWeekStart()).blocks.length),0);
});
test('inclusão em vários dias recusa conflito, disciplina removida e limite sem inclusão parcial',async()=>{
 const r=await page.evaluate(async()=>{
  const ws=planWeekStart(),view=WeekPlan.view(ws),date=WeekPlan.datesOf(ws)[0];
  const blocks=[{id:'a',disciplineId:'portugues',date},{id:'b',disciplineId:'matematica',date}];
  const first=await WeekCommands.addBlocks(ws,view.rev,blocks);
  const stale=await WeekCommands.addBlocks(ws,view.rev,[{id:'stale',disciplineId:'portugues',date}]);
  await DB.delete('disciplines','matematica');
  const missing=await WeekCommands.addBlocks(ws,first.week.rev,[{id:'c',disciplineId:'portugues',date},{id:'d',disciplineId:'matematica',date}]);
  const full=await WeekCommands.addBlocks(ws,first.week.rev,Array.from({length:200},(_,i)=>({id:'x'+i,disciplineId:'portugues',date})));
  return {first:first.ok,stale:stale.reason,missing:missing.reason,full:full.reason,count:(await DB.get('weeklyPlans',ws)).blocks.length};
 });assert.deepEqual(r,{first:true,stale:'conflict',missing:'missing',full:'full',count:2});
});
test('opções avançadas ficam acessíveis e a busca conserva a seleção',async()=>{
 assert.equal(await page.locator('.wk-library').getAttribute('open'),null);
 await page.locator('.wk-library > summary').click();assert.equal(await page.locator('.tray-card').count(),2);
 await picker();await page.locator('.wb-subject').filter({hasText:'Matemática'}).getByRole('radio').check();
 await page.locator('#wb-search').fill('PORTUGUES');assert.equal(await page.locator('.wb-subject').count(),1);
 await page.locator('#wb-search').fill('');assert.equal(await page.locator('.wb-subject input:checked').inputValue(),'matematica');
});
test('Foco mostra rótulo do relógio, contexto compacto e descanso fora do estudo',async()=>{
 await page.clock.install({time:new Date('2026-10-22T15:00:00Z')});
 await page.evaluate(async()=>{await startTimer(['portugues','matematica'],['pontuacao','crase','fracoes'],['laboratorio','projeto']);FocusMode.enter();});
 assert.equal(await page.locator('#focus-clock-label').textContent(),'Tempo estudado');assert.match(await page.locator('#focus-topic').textContent(),/\+1/);
 assert.equal(await page.locator('#focus-types').textContent(),'Laboratório · Projeto');
 await page.clock.fastForward(10*60000);await page.locator('#focus-actions').getByRole('button',{name:'Descansar',exact:true}).click();await page.clock.fastForward(5*60000);
 assert.equal(await page.locator('#focus-clock-label').textContent(),'Tempo de descanso');
 assert.equal(await page.locator('#focus-study-total').textContent(),'10:00');assert.equal(await page.locator('#focus-rest-total').textContent(),'05:00');
 assert.equal(await page.locator('#focus-clock').getAttribute('aria-live'),'off');
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>FocusMode.isOpen),false);assert.equal(await page.evaluate(()=>TimerService.isActive),true);
});
test('Foco em 320 px e com tempo longo mantém relógio e controles alcançáveis',async()=>{
 await page.setViewportSize({width:320,height:568});
 await page.evaluate(async()=>{await startTimer(['portugues'],[],[]);TimerService.data.startedAt-=101*3600000;FocusMode.enter();});
 const x=await page.evaluate(()=>{
  const r=document.querySelector('#focus-root'),c=document.querySelector('#focus-clock').getBoundingClientRect();
  return {overflow:r.scrollWidth>r.clientWidth,clockLeft:c.left,clockRight:c.right,topic:document.querySelector('#focus-topic').hidden};
 });assert.equal(x.overflow,false);assert.ok(x.clockLeft>=0&&x.clockRight<=320);assert.equal(x.topic,true);
 await page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}).click();assert.equal(await page.locator('#modal-title').textContent(),'Finalizar estudo');
});
