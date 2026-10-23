// O fixture fornecido é exclusivamente fictício. Comprimido sem alterar bytes.
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const crypto=require('node:crypto');
const buffer=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/backup-365.json.gz')));
const backup=JSON.parse(buffer);
const sha256=crypto.createHash('sha256').update(buffer).digest('hex');
// Oráculo independente: não importa funções do Ciclo. Minutos informados são
// preservados; a sobra inteira é distribuída igualmente na ordem das entradas.
function shares(minutes,entries,key){
 const fixed=entries.filter(e=>Number.isFinite(e.minutes));
 const missing=entries.filter(e=>!Number.isFinite(e.minutes));
 const rest=minutes-fixed.reduce((n,e)=>n+e.minutes,0);
 let index=0;
 return entries.map(e=>({id:e[key],minutes:Number.isFinite(e.minutes)?e.minutes:Math.floor(rest/missing.length)+(index++<rest%missing.length?1:0),estimated:!Number.isFinite(e.minutes)&&entries.length>1}));
}
function reference(sessions){
 const r={count:sessions.length,minutes:0,rest:0,activeDays:new Set(),questions:0,correct:0,results:0,reviews:0,pomodoro:0,multidisciplinary:0,noTopics:0,breaks:0,byDiscipline:{},byType:{},byDate:{},estimatedMinutes:0};
 for(const s of sessions){
  r.minutes+=s.minutes;r.byDate[s.date]=(r.byDate[s.date]||0)+s.minutes;r.activeDays.add(s.date);
  r.rest+=(s.breaks||[]).reduce((n,b)=>n+b.minutes,0);r.breaks+=(s.breaks||[]).length;
  r.reviews+=(s.types||[]).includes('revisao')?1:0;r.pomodoro+=s.pomodoro?1:0;
  r.multidisciplinary+=s.disciplineEntries.length>1?1:0;r.noTopics+=s.topicEntries.length?0:1;
  for(const x of shares(s.minutes,s.disciplineEntries,'disciplineId')){
   r.byDiscipline[x.id]=(r.byDiscipline[x.id]||0)+x.minutes;if(x.estimated)r.estimatedMinutes+=x.minutes;
  }
  for(const type of s.types||[]){r.byType[type]=(r.byType[type]||0)+1;}
  for(const q of s.results||[]){r.results++;if(q.kind==='questions'){r.questions+=q.total;r.correct+=q.correct;}}
 }
 r.activeDays=r.activeDays.size;r.pct=r.questions?r.correct/r.questions*100:null;return r;
}
async function importUI(page,options={}){
 await page.evaluate(()=>{if(modalCloser)modalCloser();setView('data');});
 await page.locator('#import-file').setInputFiles({name:options.name||'Ciclo-Backup-Sintetico-365-Dias.json',mimeType:'application/json',buffer:options.buffer||buffer});
 await page.getByRole('heading',{name:'Restaurar backup',exact:true}).waitFor();
 if(options.preview)await options.preview();
 const preview=await page.locator('#modal-box').textContent();
 await page.locator('#modal-actions').getByRole('button',{name:/^(Substituir e restaurar|Restaurar)$/}).click();
 await page.waitForFunction(n=>state.sessions.length===n&&!Overlay.isOpen,options.count||911);
 return preview;
}
module.exports={backup,buffer,sha256,reference,shares,importUI};
