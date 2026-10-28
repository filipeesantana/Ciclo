// Medidas de interface, sem inferir tempo de descoberta ou facilidade humana.
const fs=require('node:fs');const {start,open,seed}=require('./support.cjs');
(async()=>{const r=await start(process.env.BROWSER||'chromium');try{const {page,context}=await open(r);await seed(page);const result=[];
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:width===1440?1000:844});await page.evaluate(()=>openRegisterModal({disciplineId:'portugues'}));
  result.push(await page.evaluate(()=>{
   const box=document.querySelector('#modal-box'),footer=document.querySelector('#modal-actions');
   const visible=e=>e.checkVisibility?e.checkVisibility():!e.closest('details:not([open])');
   const measure=e=>{const b=e.getBoundingClientRect();return {width:Math.round(b.width),height:Math.round(b.height),top:Math.round(b.top),aboveFooter:b.bottom<=footer.getBoundingClientRect().top};};
   return {width:innerWidth,modalHeight:box.clientHeight,scrollHeight:box.scrollHeight,comment:measure(document.querySelector('.comment>button')),secondDiscipline:measure(document.querySelector('.st-add')),visibleTypeChoices:[...document.querySelectorAll('.type-opt')].filter(visible).length,visibleDifficultyChoices:[...document.querySelectorAll('.rm-how .chip')].filter(visible).length};
  }));await page.evaluate(()=>modalCloser?.());
 }console.log(JSON.stringify({browser:r.browser.version(),method:'Formulário com Português pré-selecionado, sem tempo nem detalhes preenchidos. Geometria do DOM; não mede descoberta por pessoas.',result},null,2));await context.close();
 }finally{await r.close();}})().catch(e=>{console.error(e);process.exitCode=1});
