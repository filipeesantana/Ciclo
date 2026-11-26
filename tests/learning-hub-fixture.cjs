const {connectedFixture}=require('./connected-fixture.cjs');
async function hubFixture(page,count=1000){
 const dataset=await connectedFixture(page,count);
 await page.evaluate(async()=>{
  // Synthetic course associations only. Historical sessions stay byte-for-byte.
  await DB.atomic(['courses','topics'],async api=>{
   const topics=await api.getAll('topics');
   for(const c of await api.getAll('courses')){
    const first=Learning.disciplineIds(c)[0],number=Number(first.replace('connected-d',''));
    const ids=[first,'connected-d'+((number+1)%15),'connected-d'+((number+7)%15)];
    const {disciplineId,...rest}=c;
    await api.put('courses',{...rest,disciplineIds:ids,topicIds:ids.flatMap(id=>topics.filter(t=>t.disciplineId===id).slice(0,4).map(t=>t.id)),emoji:c.id==='connected-c0'?'🐧':''});
   }
  });await refresh();
 });
 return {...dataset,disciplinesPerCourse:3,directTopicsPerCourse:12};
}
module.exports={hubFixture};
