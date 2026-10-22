const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});after(async()=>runtime?.close());
test('mais de 520 semanas: séries de constância, questões e planejamento incluem o período inteiro',async()=>{
 const {page,context}=await open(runtime);
 try{
  await seed(page);await page.clock.install({time:new Date('2026-10-22T21:00:00Z')});
  const r=await page.evaluate(async()=>{
   for(const [date,minutes,total,correct]of [['2015-01-01',60,20,10],['2026-10-22',40,30,24]])await SessionCommands.create({date,minutes,disciplineId:'portugues',results:[{id:'q'+date,kind:'questions',total,correct}]});
   await refresh();const a=AnalyticsEngine.query({periodPreset:'tudo'});
   return {rhythmLast:a.weeklyRhythm.at(-1).weekStart,questions:a.results.weeks.reduce((n,w)=>n+w.total,0),minutes:a.results.weeks.reduce((n,w)=>n+w.minutes,0),plannedReal:a.planAdherence.realizedAll,weekCount:a.weeklyRhythm.length};
  });
  const mondayStart=Date.parse('2014-12-29T00:00:00Z'),mondayEnd=Date.parse('2026-10-19T00:00:00Z');
  assert.equal(r.weekCount,1+(mondayEnd-mondayStart)/(7*86400000));
  assert.equal(r.rhythmLast,'2026-10-19');assert.equal(r.questions,50);assert.equal(r.minutes,100);assert.equal(r.plannedReal,100);
 }finally{await context.close();}
});
