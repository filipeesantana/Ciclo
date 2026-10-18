const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER || 'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));await seed(page);});afterEach(async()=>context.close());
async function plan(){return page.evaluate(async()=>{
 const p={...newPlan('Rotina',300),id:'plan',allocations:[{disciplineId:'portugues',targetMinutes:180},{disciplineId:'matematica',targetMinutes:120}]};
 await DB.put('plans',p);await loadAll();await PlannerEngine.ensureWeeklyPlan();await refresh();return WeekPlan.currentStart();
});}
test('semanas parciais comparam os mesmos dias e zero não cria acerto',async()=>{
 await page.clock.install({time:new Date('2026-10-14T15:00:00Z')});
 const x=await page.evaluate(async()=>{
  for(const [date,minutes]of [['2026-10-12',60],['2026-10-05',90],['2026-10-09',200]])await SessionCommands.create({disciplineId:'portugues',date,minutes});
  await loadAll();const w=AnalyticsEngine.weekCompare({type:'all'},'partial'),a=AnalyticsEngine.query({periodPreset:'semana'});
  return {cur:w.cur.minutes,prev:w.prev.minutes,from:dateToISO(w.prev.range.start),to:dateToISO(w.prev.range.end),days:a.days,prevDays:rangeDays(a.previousComparison.prevRange),pct:w.cur.questions.pct};
 });assert.deepEqual(x,{cur:60,prev:90,from:'2026-10-05',to:'2026-10-07',days:3,prevDays:3,pct:null});
});
test('mover bloco preserva sua identidade e recusa revisão obsoleta de outra aba',async()=>{
 const ws=await plan();const x=await page.evaluate(async ws=>{
  const a=await WeekCommands.addBlock(ws,0,{id:'bloco',disciplineId:'portugues',date:ws,minutes:60});
  const b=await WeekCommands.moveBlock(ws,a.week.rev,'bloco',addDaysISO(ws,2),0);
  const stale=await WeekCommands.updateBlock(ws,a.week.rev,'bloco',{minutes:90});
  return {first:a.ok,moved:b.week.blocks,reason:stale.reason,sessions:await DB.count('sessions')};
 },ws);assert.equal(x.first,true);assert.equal(x.moved.length,1);assert.equal(x.moved[0].id,'bloco');assert.equal(x.moved[0].date,await page.evaluate(ws=>addDaysISO(ws,2),ws));assert.equal(x.reason,'conflict');assert.equal(x.sessions,0);
});
test('dias ocultos conservam os prazos reais na tela móvel',async()=>{
 await plan();await page.setViewportSize({width:360,height:800});
 await page.evaluate(async()=>{
  state.settings.studyDays=[1,2,3,4,5];await saveSettings();
  const sunday=WeekPlan.datesOf(WeekPlan.currentStart()).find(d=>WeekPlan.dowOf(d)===0);
  await DB.put('deadlines',newDeadline({id:'domingo',title:'Prova no domingo',date:sunday,disciplineId:'portugues'}));await refresh();setView('plan');
 });assert.ok((await page.locator('#plan-body').textContent()).includes('Prova no domingo'));assert.ok((await page.locator('#plan-body').textContent()).includes('Fora dos seus dias de estudo'));
});
test('arrastar para um dia grava um bloco e Esc cancela outro arraste',async()=>{
 await plan();await page.evaluate(()=>setView('plan'));await page.setViewportSize({width:1440,height:1400});
 const tray=page.locator('.tray-card[data-disc="portugues"]');await tray.scrollIntoViewIfNeeded();
 const target=page.locator('.day-col').first();const a=await tray.boundingBox(),b=await target.boundingBox();
 await page.mouse.move(a.x+20,a.y+20);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+60,{steps:12});await page.mouse.up();
 await page.waitForFunction(()=>state.weeklyPlans.some(w=>w.blocks?.length===1));
 const moved=page.locator('.blk-item [data-drag="block"]').first();const c=await moved.boundingBox();
 await page.mouse.move(c.x+15,c.y+15);await page.mouse.down();await page.mouse.move(c.x+40,c.y+40,{steps:4});await page.keyboard.press('Escape');await page.mouse.up();
 assert.equal(await page.evaluate(()=>state.weeklyPlans.find(w=>w.weekStart===WeekPlan.currentStart()).blocks.length),1);assert.equal(await page.evaluate(()=>state.sessions.length),0);
});
test('preferências persistem e valores inválidos voltam aos padrões',async()=>{
 const expected={theme:'light',density:'compact',weekStart:'sunday',defaultPeriod:'90d',reviewLayout:'list',reviewSuggestions:false,analyticsStart:'last',timerMode:'pomodoro',aiIncludeComments:false};
 await page.evaluate(async opts=>{Object.assign(state.settings,opts);await saveSettings();},expected);
 await page.reload();await page.waitForFunction(()=>state.ready);
 const actual=await page.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,state.settings[k]])),Object.keys(expected));assert.deepEqual(actual,expected);
 const bad=await page.evaluate(()=>sanitizeSettings({theme:'invalid',defaultSessionMinutes:-1,studyDays:[99],pomodoro:{preset:'custom',focusMin:NaN}}));assert.equal(bad.theme,'dark');assert.equal(bad.defaultSessionMinutes,5);assert.equal(bad.pomodoro.focusMin,25);
});
test('datas locais atravessam horário de verão, ano bissexto e o início da semana',async()=>{
 for(const tz of ['America/New_York','Pacific/Auckland','Asia/Kolkata']){
  const c=await open(runtime,{timezoneId:tz});try{await seed(c.page);
   const x=await c.page.evaluate(()=>({spring:addDaysISO('2026-03-08',1),fall:addDaysISO('2026-11-01',1),leap:addDaysISO('2024-02-28',1),end:addDaysISO('2026-12-31',1),days:diffDays(parseISO('2026-03-09'),parseISO('2026-03-07'))}));
   assert.deepEqual(x,{spring:'2026-03-09',fall:'2026-11-02',leap:'2024-02-29',end:'2027-01-01',days:2});
  }finally{await c.context.close();}
 }
});
