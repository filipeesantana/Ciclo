// Amplia somente o fixture fictício; nenhuma cópia de dados pessoais é aberta.
const {backup}=require('./field-backup.cjs');
const shift=(value,days)=>{
 if(!value)return value;
 const d=new Date(value.length===10?value+'T12:00:00Z':value);d.setUTCDate(d.getUTCDate()+days);
 return value.length===10?d.toISOString().slice(0,10):d.toISOString();
};
function stress(count){
 const b=structuredClone(backup);delete b.integrity;
 const sessions=[];
 for(let i=0;i<count;i++){
  const copy=Math.floor(i/backup.sessions.length),s=structuredClone(backup.sessions[i%backup.sessions.length]);
  s.id='stress-'+i;const days=-364*copy;
  for(const key of ['date','startedAt','endedAt','createdAt','updatedAt'])s[key]=shift(s[key],days);
  s.breaks=s.breaks.map((x,j)=>({...x,id:'break-'+i+'-'+j,startedAt:shift(x.startedAt,days),endedAt:shift(x.endedAt,days)}));
  s.results=s.results.map((x,j)=>({...x,id:'result-'+i+'-'+j}));sessions.push(s);
 }
 b.sessions=sessions;
 const weeks=new Map();
 for(let copy=Math.ceil(count/backup.sessions.length)-1;copy>=0;copy--)for(const source of backup.weeklyPlans){
  const w=structuredClone(source),days=-364*copy;
  for(const key of ['id','weekStart','weekEnd','createdAt','updatedAt'])w[key]=shift(w[key],days);
  w.blocks=w.blocks.map((x,j)=>({...x,id:'block-'+copy+'-'+source.id+'-'+j,date:shift(x.date,days)}));
  weeks.set(w.id,w);
 }
 b.weeklyPlans=[...weeks.values()];return b;
}
module.exports={stress,shift};
