// Dados inteiramente sintéticos; nenhum dado de usuário é aberto nos testes.
async function workload(page, days, count) {
 return page.evaluate(async({days,count})=>{
  if(modalCloser)modalCloser();
  const n=count>1000?40:count>100?12:count?3:0;
  const areas=n?[{...newArea('Aprendizagem'),id:'area'}]:[];
  const disciplines=Array.from({length:n},(_,i)=>({...newDiscipline(['Português','Matemática','Inglês','Guitarra'][i%4]+' '+(i+1),'area',1+i%5),id:'d'+i}));
  const topics=Array.from({length:n*10},(_,i)=>({...newTopic('d'+Math.floor(i/10),['Pontuação','Frações','Vocabulário','Acordes'][i%4]+' '+(i+1),i%10),id:'t'+i}));
  const sessions=Array.from({length:count},(_,i)=>{
   const ti=i%topics.length,di=Math.floor(ti/10),date=dateToISO(addDays(today(),-Math.floor(i*days/count))),minutes=20+i%70;
   const outcome=i%4===0?['forgot','hard','remembered','mastered'][Math.floor(i/4)%4]:null;
   return newSession({id:'s'+i,disciplineId:'d'+di,disciplineEntries:[{disciplineId:'d'+di,minutes:null}],topicEntries:[{topicId:'t'+ti,disciplineId:'d'+di,minutes:null,outcome,strategy:'adaptive'}],date,minutes,
    types:outcome?['revisao']:i%3===0?['teoria','exercicios']:['laboratorio'],difficulty:1+i%5,
    breaks:i%3===0?[{id:'b'+i,startedAt:null,endedAt:null,minutes:5}]:[],comment:i%7===0?'Dificuldade para explicar sem consultar.':'',
    results:i%3===0?[{id:'r'+i,kind:'questions',disciplineId:null,topicId:null,total:20,correct:10+i%11}]:
     i%11===0?[{id:'r'+i,kind:'milestone',disciplineId:null,topicId:null,text:'Explicar o exemplo '+i,before:'Precisava consultar'}]:
     i%13===0?[{id:'r'+i,kind:'concept',disciplineId:null,topicId:null,label:'Conceito '+i,status:'partial'}]:[]});
  });
  const byTopic=new Map();sessions.forEach(s=>{const id=s.topicEntries[0].topicId;if(!byTopic.has(id))byTopic.set(id,[]);byTopic.get(id).push(s);});
  for(let i=0;i<topics.length;i++){
   const list=(byTopic.get(topics[i].id)||[]).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
   let t=topics[i];for(const s of list){const e=s.topicEntries[0];t=TopicReconciler.afterCreate(t,{id:s.id,date:s.date,minutes:s.minutes,reviewOutcome:e.outcome,reviewStrategyAtTime:e.strategy},{strategy:'adaptive',firstInterval:1,intervalModifier:1,deadlineDays:null}).topic;}
   topics[i]=t;
  }
  const plan=n?{...newPlan('Rotina possível',600),id:'plan',allocations:disciplines.map(d=>({disciplineId:d.id,targetMinutes:Math.floor(600/n),minMinutes:0})),template:disciplines.slice(0,7).map((d,i)=>({id:'template'+i,disciplineId:d.id,dow:i,minutes:30,start:'19:00',order:0}))}:null;
  const weeklyPlans=plan?Array.from({length:Math.ceil(days/7)+1},(_,i)=>WeekPlan.newSnapshot(plan,dateToISO(addDays(startOfWeek(today()),-7*i)))):[];
  const deadlines=Array.from({length:n?count>1000?100:5:0},(_,i)=>newDeadline({id:'dl'+i,title:'Avaliação '+(i+1),date:dateToISO(addDays(today(),i-10)),disciplineId:'d'+(i%n),status:i%8===0?'completed':'pending'}));
  const collections={areas,disciplines,topics,sessions,plans:plan?[plan]:[],weeklyPlans,deadlines};
  await DB.transactional(Object.keys(collections).concat('settings'),api=>{
   for(const [store,items]of Object.entries(collections)){api.clear(store);items.forEach(item=>api.add(store,item));}
   api.put('settings',{key:'settings',value:{...DEFAULT_SETTINGS,helpMode:'off',seenWhatsNew:APP_VERSION,reduceMotion:true}});
  });
  await setMeta('onboardingCompleted',true);await refresh();
  return {...Object.fromEntries(Object.entries(collections).map(([k,v])=>[k,v.length])),days,dueReviews:ReviewEngine.getDueReviews().length};
 },{days,count});
}
module.exports={workload};
