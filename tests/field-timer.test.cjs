const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER || 'chromium');});
after(async()=>runtime?.close());
beforeEach(async()=>{
 ({context,page}=await open(runtime));await seed(page);
 page.setDefaultTimeout(8000);
 await page.clock.install({time:new Date('2026-10-22T15:00:00Z')});
 await page.evaluate(()=>setView('today'));
});
afterEach(async()=>context.close());
async function begin(focus=false,pomodoro=false){
 await page.evaluate(p=>openQuickStart({disciplineId:'portugues',...(p?{pomodoro:{preset:'classic'}}:{})}),pomodoro);
 if(pomodoro)await page.getByRole('button',{name:'Pomodoro',exact:true}).click();
 await page.locator('#modal-actions .primary').click();
 await page.waitForFunction(()=>TimerService.isActive&&!Overlay.isOpen);
 await page.clock.fastForward(120000);
 if(focus)await page.locator('#timerbar-slot').getByRole('button',{name:'Foco',exact:true}).click();
 return page.evaluate(()=>TimerService.data.runId);
}
async function finish(focus=false,double=false){
 await (focus?page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}):page.locator('#fab')).click();
 const button=page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true});
 if(double)await button.evaluate(el=>{el.click();el.click();});else await button.click();
 await page.waitForFunction(()=>!TimerService.isActive&&!Overlay.isOpen);
}
async function evidence(name){
 if(!process.env.AUDIT_OUTPUT)return;
 fs.mkdirSync(process.env.AUDIT_OUTPUT,{recursive:true});
 await page.screenshot({path:path.join(process.env.AUDIT_OUTPUT,name+'.png'),fullPage:true});
}
async function ended(p=page){
 assert.equal(await p.locator('#tf-title').textContent(),'O que você gostaria de estudar?');
 assert.equal(await p.locator('#timerbar-slot .timerbar').count(),0);
 assert.equal(await p.evaluate(()=>TimerService.storedRunId()),null);
}
test('A: estudo livre salvo encerra Hoje imediatamente, sem F5',async()=>{
 const id=await begin();await finish();await evidence('hoje-apos-finalizar');await ended();
 assert.equal(await page.evaluate(()=>state.sessions[0].id),id);
});
test('B: Foco → Encerrar → Registrar atualiza Hoje antes de navegar',async()=>{
 await begin(true);await evidence('foco');await finish(true);await evidence('hoje-apos-foco');await ended();
 assert.equal(await page.evaluate(()=>state.sessions.length),1);
});
test('C: Pomodoro pausa, retoma, descansa e registra apenas estudo líquido',async()=>{
 await page.evaluate(async()=>{await startTimer(['portugues'],[],[],null,null,{pomodoro:{preset:'classic'}});FocusMode.enter();});
 await page.clock.fastForward(10*60000);
 await page.locator('#focus-actions').getByRole('button',{name:'Pausar',exact:true}).click();
 await page.clock.fastForward(3*60000);
 await page.locator('#focus-actions').getByRole('button',{name:'Retomar',exact:true}).click();
 await page.clock.fastForward(15*60000);
 await page.locator('#focus-actions').getByRole('button',{name:'Descansar 5 min',exact:true}).click();
 await page.clock.fastForward(5*60000);
 await page.locator('#focus-actions').getByRole('button',{name:/Começar.*bloco/}).click();
 await page.clock.fastForward(4*60000);await finish(true);await ended();
 const s=await page.evaluate(()=>state.sessions[0]);
 assert.equal(s.minutes,29);assert.equal(s.breaks.reduce((n,b)=>n+b.minutes,0),5);assert.equal(s.pausedMinutes,3);assert.equal(s.pomodoro.blocks,1);
});
test('D: F5 depois de finalizar não restaura um estudo concluído',async()=>{
 await begin(true);await finish(true);await page.reload();await page.waitForFunction(()=>state.ready);await ended();
 assert.equal(await page.evaluate(()=>state.sessions.length),1);
});
test('E: Histórico e Voltar mantêm Hoje encerrado',async()=>{
 await begin();await finish();await page.evaluate(()=>setView('history'));await page.goBack();
 await page.waitForFunction(()=>ui.view==='today');await ended();
});
test('F: aba observadora deixa de mostrar estudo ativo ao finalizar na outra aba',async()=>{
 await begin();const other=await context.newPage();await other.goto(runtime.url);await other.waitForFunction(()=>state.ready);
 await other.evaluate(()=>setView('today'));assert.match(await other.locator('#tf-title').textContent(),/estudando/);
 await finish();await other.waitForFunction(()=>!TimerService.isActive);
 // Esperar o sinal de dados não pode voltar a renderizar o timer antigo.
 await other.waitForFunction(()=>state.sessions.length===1);await ended(other);
});
test('G: dois cliques rápidos em Registrar criam uma sessão',async()=>{
 const id=await begin(true);await finish(true,true);await ended();
 assert.equal(await page.evaluate(()=>DB.count('sessions')),1);assert.equal(await page.evaluate(()=>state.sessions[0].id),id);
});
test('H: falha de IndexedDB conserva o estudo e permite tentar novamente',async()=>{
 const id=await begin(true);await page.locator('#focus-actions').getByRole('button',{name:'Encerrar',exact:true}).click();
 await page.getByRole('button',{name:'+ Adicionar comentário',exact:true}).click();
 await page.locator('#fin-comment').fill('Comentário preservado na falha');
 await page.evaluate(()=>{window.realAtomic=DB.atomic;DB.atomic=function(stores,fn){if(stores.includes('sessions'))return Promise.reject(new DOMException('Falha simulada','QuotaExceededError'));return window.realAtomic.call(this,stores,fn);};});
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#modal-actions .primary')?.textContent==='Registrar estudo');
 assert.equal(await page.evaluate(()=>DB.count('sessions')),0);assert.equal(await page.evaluate(()=>TimerService.data.runId),id);
 assert.equal(await page.locator('#fin-comment').inputValue(),'Comentário preservado na falha');
 assert.ok((await page.locator('#toasts').textContent()).includes('Não foi possível salvar'));
 await page.evaluate(()=>{DB.atomic=window.realAtomic;});
 await page.locator('#modal-actions').getByRole('button',{name:'Registrar estudo',exact:true}).click();
 await page.waitForFunction(()=>!TimerService.isActive&&!Overlay.isOpen);await ended();
});
test('I: novo estudo depois de finalizar tem identidade própria',async()=>{
 const old=await begin();await finish();const next=await begin();assert.notEqual(next,old);
 await finish();await ended();assert.equal(await page.evaluate(()=>DB.count('sessions')),2);
});
test('J: sair de tela cheia mantém as ações do Foco e permite finalizar',async t=>{
 await begin(true);
 const supported=await page.evaluate(()=>FocusMode.fsAvailable());
 if(!supported){t.diagnostic('Fullscreen indisponível neste motor; saída do Foco via Esc exercitada.');await page.keyboard.press('Escape');await page.locator('#timerbar-slot').getByRole('button',{name:'Foco',exact:true}).click();}
 else{
  await page.locator('#focus-fs').click();await page.waitForFunction(()=>!!FocusMode.fsElement());
  await page.locator('#focus-fs').click();await page.waitForFunction(()=>!FocusMode.fsElement());
 }
 await finish(true);await ended();
});
test('Hoje acompanha início, pausa, descanso e descarte sem navegação',async()=>{
 await begin();assert.match(await page.locator('#tf-title').textContent(),/estudando/);
 await page.locator('#timerbar-slot').getByRole('button',{name:'Pausar',exact:true}).click();
 assert.match(await page.locator('.today-act').textContent(),/pausado/i);
 await page.locator('#timerbar-slot').getByRole('button',{name:'Retomar',exact:true}).click();
 await page.locator('#timerbar-slot').getByRole('button',{name:'Descansar',exact:true}).click();
 assert.match(await page.locator('.today-act').textContent(),/descansando/i);
 await page.locator('#timerbar-slot').getByRole('button',{name:'descartar',exact:true}).click();
 await page.locator('#modal-actions').getByRole('button',{name:'Descartar',exact:true}).click();await ended();
 assert.equal(await page.evaluate(()=>DB.count('sessions')),0);
});
test('snapshot regravado por aba atrasada não ressuscita um runId salvo',async()=>{
 await begin();const raw=await page.evaluate(()=>localStorage.getItem(TIMER_LS_KEY));await finish();
 await page.evaluate(raw=>{localStorage.setItem(TIMER_LS_KEY,raw);TimerService.restore();renderTimerBar();},raw);
 await ended();assert.equal(await page.evaluate(()=>DB.count('sessions')),1);
 // Também protege a atualização por DataSync quando a memória ainda é antiga.
 await page.evaluate(async raw=>{TimerService.data=JSON.parse(raw);localStorage.setItem(TIMER_LS_KEY,raw);await refresh();},raw);
 await ended();
});
