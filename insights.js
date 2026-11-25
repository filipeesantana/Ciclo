'use strict';

/* Source and block filters intersect the existing discipline/topic scope.
   Within each discipline multiple recorded blocks split its time; a union of
   blocks counts the same session only once. Catalogue membership is never used
   to infer which material or topics a past session covered. */
function learningProject(session,scope){
  if(!scope.courseIds?.size && !scope.blockIds?.size)return session;
  const all=Learning.entries(session);
  const matches=all.filter(e=>(!scope.courseIds?.size || scope.courseIds.has(e.courseId)) && (!scope.blockIds?.size || scope.blockIds.has(e.blockId)));
  if(!matches.length)return null;
  const discIds=new Set(matches.map(e=>e.disciplineId));
  const p=SessionModel.project(session,{discIds});if(!p)return null;
  const shares=Learning.shares(session);
  const selectedShares=shares.filter(e=>(!scope.courseIds?.size||scope.courseIds.has(e.courseId))&&(!scope.blockIds?.size||scope.blockIds.has(e.blockId)));
  const disc=SessionModel.discShares(p).map(d=>({...d,minutes:sum(selectedShares.filter(e=>e.disciplineId===d.disciplineId),e=>e.minutes),estimated:d.estimated||selectedShares.some(e=>e.disciplineId===d.disciplineId&&e.estimated)}));
  const topicMap=new Map();
  for(const d of disc){
    const full=SessionModel.discShares(session).find(x=>x.disciplineId===d.disciplineId);
    if(!scope.blockIds?.size && d.minutes===full?.minutes){
      for(const t of SessionModel.topicShares(session).filter(t=>t.disciplineId===d.disciplineId))topicMap.set(t.topicId,t);
      continue;
    }
    for(const entry of selectedShares.filter(e=>e.disciplineId===d.disciplineId)){
      const ids=entry.blockId?entry.topicIds:SessionModel.entries(session).filter(t=>t.disciplineId===d.disciplineId).map(t=>t.topicId);
      const parts=SessionModel.evenSplit(entry.minutes,ids.length);
      ids.forEach((id,i)=>{const current=topicMap.get(id)||{topicId:id,disciplineId:d.disciplineId,minutes:0,estimated:!!entry.estimated||ids.length>1};current.minutes+=parts[i];topicMap.set(id,current);});
    }
  }
  const topic=[...topicMap.values()],minutes=sum(disc,e=>e.minutes);
  const ratio=p.minutes?minutes/p.minutes:0;
  return {...p,minutes,_projected:true,_shareEstimated:disc.some(d=>d.estimated),_discShares:disc,_topicShares:topic,contentEntries:matches,topicEntries:SessionModel.entries(p).filter(e=>topicMap.has(e.topicId)),
    breaks:breaksOf(p).map(b=>({...b,minutes:b.minutes*ratio})),
    results:scope.blockIds?.size?EvidenceModel.of(p).filter(r=>r.topicId && matches.some(e=>e.topicIds.includes(r.topicId))):EvidenceModel.of(p)};
}

function openResultsPeriod(){
  const q=ui.analyticsQuery || defaultAnalyticsQuery();
  const applied=analyticsQueryRange(q),draft={startDate:dateToISO(applied.start),endDate:dateToISO(applied.end)},pick={month:applied.end};
  openModal(close=>{
    const content=h('div',{class:'results-period-editor'});
    const draw=()=>mount(content,connectedRangePicker(draft,pick,draw));draw();
    return {title:'Período personalizado',content,actions:[reviewButton('Cancelar',close),reviewButton('Aplicar período',()=>{
      if(!isStrictISODate(draft.startDate)||!isStrictISODate(draft.endDate)){toast('Escolha o primeiro e o último dia.','info');return;}
      const days=rangeDays({start:parseISO(draft.startDate),end:parseISO(draft.endDate)});
      if(days>3660){toast('Escolha um intervalo de até 10 anos.','info');return;}
      close();applyAnalyticsQuery({...q,periodPreset:'custom',...draft});
    },'primary')]};
  },{size:'narrow'});
}
function resultsToolbar(a){
  const q=a.query;
  const apply=changes=>applyAnalyticsQuery({...q,...changes});
  const period=reviewSelect('results-period','Período',[['7d','Últimos 7 dias'],['30d','Últimos 30 dias'],['mes','Mês atual'],['semana','Semana atual'],['hoje','Hoje'],['90d','Últimos 90 dias'],['tudo','Todo o histórico'],['custom','Personalizado…']],q.periodPreset,v=>{if(v==='custom'){period.node.value=q.periodPreset;openResultsPeriod();}else apply({periodPreset:v});});
  const ids=q.scopeType==='discipline'?q.scopeIds:[];
  const ds=reviewSelect('results-discipline','Disciplina',[['','Todas as disciplinas'],...state.disciplines.map(d=>[d.id,d.name]),...(ids.length>1?[['__multi',ids.length+' disciplinas']]:[])],ids.length>1?'__multi':ids[0]||'',v=>{if(v!=='__multi')apply({scopeType:v?'discipline':'all',scopeIds:v?[v]:[],scopeId:v||null,courseIds:[],blockIds:[]});});
  const available=Learning.courses().filter(c=>!ids.length||ids.includes(c.disciplineId));
  const blocks=Learning.blocks().filter(b=>(!ids.length||ids.includes(b.disciplineId)) && (!q.courseIds.length || b.courseIds.some(id=>q.courseIds.includes(id))));
  const course=available.length?reviewSelect('results-material','Material',[['','Todos os materiais'],...available.map(c=>[c.id,c.name])],q.courseIds[0]||'',v=>apply({courseIds:v?[v]:[],blockIds:[]})):null;
  const block=blocks.length?reviewSelect('results-block','Bloco',[['','Todos os blocos'],...blocks.map(b=>[b.id,b.name])],q.blockIds[0]||'',v=>apply({blockIds:v?[v]:[]})):null;
  const advanced=h('details',{class:'results-filter-more',open:!!ui.resultsFiltersOpen},h('summary',{text:'Filtrar conteúdos'}));
  advanced.addEventListener('toggle',()=>{if(advanced.isConnected)ui.resultsFiltersOpen=advanced.open;});
  const topics=state.topics.filter(t=>!ids.length||ids.includes(t.disciplineId));
  const topic=topics.length?reviewSelect('results-topic','Tópico',[['','Todos os tópicos'],...topics.map(t=>[t.id,disciplineName(t.disciplineId)+' · '+t.name])],q.scopeType==='topic'?q.scopeIds[0]:'',v=>apply({scopeType:v?'topic':'all',scopeId:v||null,scopeIds:v?[v]:[]})):null;
  const multiple=h('details',null,h('summary',{text:'Selecionar várias disciplinas'}),h('div',{class:'learning-checklist'},state.disciplines.map(d=>h('label',{class:'guided-check'},
    h('input',{type:'checkbox',checked:ids.includes(d.id),onchange:e=>{const set=new Set(ids);if(e.target.checked)set.add(d.id);else set.delete(d.id);apply({scopeType:set.size?'discipline':'all',scopeIds:[...set],scopeId:[...set][0]||null});}}),d.name))));
  advanced.append(h('div',{class:'learning-controls'},course?.field,block?.field,topic?.field),multiple);
  const active=q.scopeType!=='all'||q.courseIds.length||q.blockIds.length||q.types.length;
  const captions=[q.scopeType!=='all'?a.scope.label:null,...q.courseIds.map(id=>Learning.course(id)?.name),...q.blockIds.map(id=>Learning.block(id)?.name),...q.types.map(sessionTypeLabel)].filter(Boolean);
  return h('header',{class:'insights-toolbar'},h('div',{class:'results-primary-filters'},period.field,ds.field,
    q.periodPreset==='custom'?reviewButton(fmtRangeLabel(a.range),openResultsPeriod):null,
    h('div',{class:'results-actions'},h('button',{type:'button',class:'btn ghost','aria-label':'Ver registros',text:'Histórico',onclick:()=>openAnalyticsRecords(a)}),h('button',{type:'button',class:'btn ghost','aria-label':'Criar relatório',text:'Relatório',onclick:()=>openVisualReport(q)}))),
    advanced,active?h('div',{class:'results-active-filters',role:'status'},h('span',{text:captions.join(' · ')}),reviewButton('Limpar filtros',()=>apply({scopeType:'all',scopeId:null,scopeIds:[],courseIds:[],blockIds:[],types:[]}))):null);
}

function resultsRecords(a,range=null,filter=null,label='Estudos do período'){
  const sessions=a.sessions.filter(s=>(!range || (s.date>=dateToISO(range.start)&&s.date<=dateToISO(range.end))) && (!filter || filter(s)));
  openAnalyticsRecords({...a,sessions});
  ui.historyIds.label=label;Nav.sync('replace');renderHistory();
}
function resultsTimeline(a){
  const total=rangeDays({start:a.range.start,end:a.effEnd});
  const available=Math.max(180,($('#analytics-body')?.clientWidth || innerWidth-32)*(innerWidth>=1000?.6:1)-30);
  const capacity=Math.max(1,Math.min(45,Math.floor(available/32)));
  const stride=Math.max(1,Math.ceil(total/capacity)),count=Math.ceil(total/stride);
  const series=Array.from({length:count},(_,i)=>({start:addDays(a.range.start,i*stride),end:addDays(a.range.start,Math.min(total-1,(i+1)*stride-1)),minutes:0,count:0}));
  for(const s of a.sessions){const index=Math.floor(diffDays(parseISO(s.date),a.range.start)/stride);if(series[index]){series[index].minutes+=s.minutes;series[index].count++;}}
  const max=Math.max(1,...series.map(b=>b.minutes));
  return h('section',{class:'insights-timeline','aria-labelledby':'results-timeline-title'},
    h('div',{class:'learning-head'},h('h3',{id:'results-timeline-title',text:'Seu tempo ao longo dos dias'}),h('span',{class:'hint',text:stride===1?'Minutos por dia':`Minutos por intervalo de até ${stride} dias`})),
    h('div',{class:'insights-bars',style:'--bar-count:'+count},series.map((b,i)=>{
      const range={start:b.start,end:b.end},label=fmtRangeLabel(range),detail=label+' · '+fmtDuration(b.minutes)+' · '+plural(b.count,'sessão','sessões');
      return h('button',{type:'button',class:'insight-bar','aria-label':detail+'. Ver registros',onclick:()=>resultsRecords(a,range,null,label)},
        h('span',{class:'bar-fill',style:'--bar-height:'+Math.max(b.minutes?2:0,b.minutes/max*100)+'%','aria-hidden':'true'}),
        h('span',{class:'chart-tip',role:'tooltip',text:detail}),
        h('span',{class:'bar-date','aria-hidden':'true',text:count<=8||i===0||i===count-1||i%7===0?String(b.start.getDate()):''}));
    })),h('div',{class:'insights-axis'},h('span',{text:fmtDateBR(dateToISO(a.range.start))}),h('span',{text:fmtDuration(max)+' no maior intervalo'}),h('span',{text:fmtDateBR(dateToISO(a.effEnd))})),
    h('details',{class:'chart-table'},h('summary',{text:'Ver valores em tabela'}),h('table',null,
      h('thead',null,h('tr',null,h('th',{scope:'col',text:'Período'}),h('th',{scope:'col',text:'Minutos'}))),
      h('tbody',null,series.map(b=>h('tr',null,h('th',{scope:'row',text:fmtRangeLabel({start:b.start,end:b.end})}),h('td',{text:String(Math.round(b.minutes))})))))));
}

function bindConnectedResize(){
  let frame=0;
  window.addEventListener('resize',()=>{
    if(frame)cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{frame=0;if(ui.view==='analytics' && ui.analyticsMode==='result' && ui.analyticsQuery?.focus==='overview')renderAnalytics();});
  });
}
function resultsDistribution(a,kind='discipline'){
  let rows;
  if(kind==='discipline')rows=a.byDiscipline.filter(r=>r.minutes>0).map(r=>({...r,id:r.key}));
  else {
    const map=new Map();
    for(const s of a.sessions)for(const e of Learning.shares(s))if(e.courseId){
      const cur=map.get(e.courseId)||{id:e.courseId,label:e.courseName || Learning.course(e.courseId)?.name || 'Material arquivado',minutes:0,estimated:0};
      cur.minutes+=e.minutes;cur.estimated+=e.estimated?e.minutes:0;map.set(e.courseId,cur);
    }
    rows=[...map.values()].sort((x,y)=>y.minutes-x.minutes);
  }
  if(!rows.length)return null;
  const max=Math.max(...rows.map(r=>r.minutes));
  const list=h('div',{class:'insights-distribution'});
  let expanded=false;
  function draw(){mount(list,(expanded?rows:rows.slice(0,7)).map(row=>h('button',{type:'button',class:'insights-dist-row',onclick:()=>{
    if(kind==='discipline')applyAnalyticsQuery({...a.query,scopeType:'discipline',scopeIds:[row.id],scopeId:row.id});
    else applyAnalyticsQuery({...a.query,courseIds:[row.id]});
  }},h('span',{class:'dist-row-label',text:row.label}),h('strong',{class:'num',text:(row.estimated?'≈ ':'')+fmtDuration(row.minutes)}),h('span',{class:'dist-row-track','aria-hidden':'true'},h('span',{style:'width:'+row.minutes/max*100+'%'})))),
  rows.length>7?reviewButton(expanded?'Mostrar menos':'Ver todos ('+rows.length+')',()=>{expanded=!expanded;draw();}):null);}draw();
  return h('section',{class:'insights-distribution-panel'},h('h3',{text:kind==='discipline'?'Onde seu tempo foi':'Materiais utilizados'}),list);
}
function renderConnectedInsights(root,a){
  const t=a.totals,q=a.query,cmp=a.previousComparison;
  const current=fmtRangeLabel(cmp.curRange),previous=fmtRangeLabel(cmp.prevRange);
  const stats=h('section',{class:'insights-summary','aria-label':'Resumo do período'},h('div',{class:'insights-total'},h('span',{text:'Tempo estudado'}),h('strong',{class:'num',text:fmtDuration(t.minutes)}),analyticsEstimatedTime(a.sessions)?h('small',{class:'hint',text:'≈ Inclui divisão estimada'}):null),
    h('dl',{class:'insights-facts'},[['Sessões',t.count],['Dias com estudo',t.activeDays],['Disciplinas',a.byDiscipline.filter(d=>d.minutes>0).length]].map(([label,value])=>h('div',null,h('dt',{text:label}),h('dd',{class:'num',text:String(value)})))));
  const comparison=t.count?h('p',{class:'insights-comparison',title:previous+' / '+current,text:'Período anterior: '+fmtDuration(cmp.prevTotals.minutes)+' · '+fmtDateBR(dateToISO(cmp.prevRange.start))+' a '+fmtDateBR(dateToISO(cmp.prevRange.end))+(a.partial?' · Mesmos dias decorridos.':'')}):null;
  const questions=a.results.questions;
  const evidence=questions.sets?h('section',{class:'insights-questions'},h('h3',{text:'Acertos nas questões'}),h('strong',{class:'num',text:fmtAccuracy(questions.pct)}),h('span',{text:questions.correct+' acertos em '+questions.total+' questões'}),
    h('meter',{min:0,max:questions.total,value:questions.correct,'aria-label':'Acertos nas questões'}),a.results.smallSample?h('p',{class:'hint',text:'Poucas questões: este valor descreve apenas os resultados registrados.'}):null):null;
  const explore=h('details',{class:'insights-explore'},h('summary',{text:'Explorar outros resultados'}),h('div',{class:'insights-explore-links'},
    [['time','Tempo'],['consistency','Constância'],['topics','Tópicos'],['results','Questões'],['learning','Marcos de aprendizagem'],['reviews','Revisões']].map(([focus,label])=>reviewButton(label,()=>setAnalyticsFocus(focus)))),
    h('div',{class:'tf-actions'},reviewButton('Análises salvas e personalizadas',()=>openAnalyticsSelector({custom:true})),reviewButton('Exportar texto',()=>downloadReport(a)),reviewButton('Copiar resumo',()=>copySummary(a))));
  const empty=analyticsEmptyFor(a,'overview');
  mount(root,h('div',{class:'connected-insights'},resultsToolbar(a),h('p',{class:'insights-period-label',text:fmtRangeLabel(a.range)}),
    empty || h('div',{class:'insights-dashboard'},stats,comparison,resultsTimeline(a),h('div',{class:'insights-distributions'},resultsDistribution(a),resultsDistribution(a,'course')),evidence),explore));
}
