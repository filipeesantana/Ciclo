// Synthetic only. Call inside an isolated Playwright context.
async function connectedFixture(page,count=1000){
 return page.evaluate(async count=>{
  if(modalCloser)modalCloser();
  const names=['Linux','Redes','Inglês','Banco de Dados','Matemática','Python','Sistemas','Segurança','Estatística','Música','Gestão','Direito','Escrita','Física','História'];
  const disciplines=names.map((n,i)=>({...newDiscipline(n),id:'connected-d'+i}));
  const topics=Array.from({length:350},(_,i)=>({...newTopic(disciplines[i%15].id,'Conteúdo '+(i+1)),id:'connected-t'+i}));
  const courses=Array.from({length:40},(_,i)=>({id:'connected-c'+i,disciplineId:disciplines[i%15].id,name:i===0?'Administração de Sistemas GNU/Linux':['Fundamentos','Documentação','Laboratório','Curso prático'][i%4]+' de '+names[i%15],url:'https://example.test/material-'+i,favorite:i<4,archived:i>=38,platform:['Udemy','Cisco','YouTube','Documentação'][i%4],createdAt:nowISO(),updatedAt:nowISO(),lastOpenedAt:i<8?nowISO():null}));
  const contentBlocks=Array.from({length:100},(_,i)=>{
   const did=disciplines[i%15].id;const own=topics.filter(t=>t.disciplineId===did);const first=(Math.floor(i/15)*3)%Math.max(1,own.length-10);
   return {id:'connected-b'+i,disciplineId:did,name:i===0?'Navegação e manipulação de arquivos':i===15?'Permissões e usuários':'Bloco '+(Math.floor(i/15)+1)+' · '+names[i%15],topicIds:own.slice(first,first+10).map(t=>t.id),courseIds:courses.filter(c=>c.disciplineId===did&&!c.archived).slice(0,2).map(c=>c.id),archived:i===99,reviewSchedule:i<8?{mode:'date',date:addDaysISO(todayISO(),i-2)}:i===8?{mode:'free'}:i===9?{mode:'off'}:undefined,createdAt:nowISO(),updatedAt:nowISO()};
  });
  const sessions=Array.from({length:count},(_,i)=>{
    const did=disciplines[i%15].id,own=contentBlocks.filter(b=>b.disciplineId===did),b=own[Math.floor(i/15)%own.length],linked=Math.floor(i/15)%3!==0;
    const s=newSession({id:'connected-s'+i,disciplineId:did,disciplineEntries:[{disciplineId:did,minutes:null}],date:addDaysISO(todayISO(),-(i%365)),minutes:20+(i%9)*5,types:i%5===0?['revisao']:['teoria'],topicEntries:linked?b.topicIds.map(topicId=>({topicId,disciplineId:did,minutes:null,outcome:null,strategy:'adaptive'})):[],results:i%9===0?[{id:'e'+i,kind:'questions',total:10,correct:6+i%5,disciplineId:did,topicId:null}]:[]});
    if(linked)s.contentEntries=[{disciplineId:did,courseId:b.courseIds[0]||null,courseName:courses.find(c=>c.id===b.courseIds[0])?.name||'',blockId:b.id,blockName:b.name,topicIds:b.topicIds.slice(),outcome:i%5===0?'remembered':null}];return s;
  });
  const plan={...newPlan('Minha semana',600),id:'connected-plan',allocations:disciplines.slice(0,5).map(d=>({disciplineId:d.id,targetMinutes:120}))};
  const deadlines=Array.from({length:8},(_,i)=>newDeadline({title:['Certificação Linux','Entrega de Redes','Prática de Inglês'][i%3],date:addDaysISO(todayISO(),i*5-2),disciplineId:disciplines[i%15].id,status:i===7?'completed':'pending'}));
  await DB.transactional(['areas','disciplines','topics','courses','contentBlocks','sessions','plans','weeklyPlans','deadlines','settings','meta'],api=>{
   for(const k of ['areas','disciplines','topics','courses','contentBlocks','sessions','plans','weeklyPlans','deadlines'])api.clear(k);
   for(const[k,list]of Object.entries({disciplines,topics,courses,contentBlocks,sessions,deadlines,plans:[plan]}))for(const x of list)api.put(k,x);
   api.put('settings',{key:'settings',value:{...DEFAULT_SETTINGS,seenWhatsNew:APP_VERSION,helpMode:'off',reduceMotion:true}});api.put('meta',{key:'onboardingCompleted',value:true});
  });await loadAll();await PlannerEngine.ensureWeeklyPlan();await refresh();
  return {disciplines:15,courses:40,blocks:100,topics:350,sessions:count};
 },count);
}
module.exports={connectedFixture};
