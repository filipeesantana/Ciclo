'use strict';

/* Connected learning. Relationships are optional; session snapshots are immutable
   with respect to later catalogue edits. No network reads or embedded content. */
const Learning = {
  ids(list){ return [...new Set((Array.isArray(list) ? list : []).filter(x => typeof x === 'string' && x))]; },
  url(value){
    const text = String(value || '').trim();
    if(!/^https?:\/\//i.test(text) || /[\u0000-\u0020\u007f]/.test(text)) return null;
    try { const u = new URL(text); return ['https:','http:'].includes(u.protocol) && u.hostname && !u.username && !u.password ? u.href : null; }
    catch(_){ return null; }
  },
  courses(){ return state.courses || []; },
  blocks(){ return state.contentBlocks || []; },
  course(id){ return this.courses().find(x => x.id === id); },
  block(id){ return this.blocks().find(x => x.id === id); },
  active(x){ const d = getDiscipline(x.disciplineId); return !x.archived && !!d && !d.archived; },
  entries(s){ return Array.isArray(s.contentEntries) ? s.contentEntries : []; },
  cleanEntries(list){
    const seen = new Set();
    return (Array.isArray(list) ? list : []).filter(e => e && typeof e === 'object').map(e => ({
      disciplineId:String(e.disciplineId || ''), courseId:typeof e.courseId === 'string' ? e.courseId : null,
      blockId:typeof e.blockId === 'string' ? e.blockId : null,
      courseName:String(e.courseName || '').slice(0,160), blockName:String(e.blockName || '').slice(0,160),
      topicIds:this.ids(e.topicIds), outcome:REVIEW_OUTCOME_VALUES.includes(e.outcome) ? e.outcome : null
    })).filter(e => {
      const key = [e.disciplineId,e.courseId,e.blockId].join('|');
      if(!e.disciplineId || !(e.courseId || e.blockId) || seen.has(key)) return false;
      seen.add(key); return true;
    });
  },
  async checkEntries(api, session){
    const list = this.cleanEntries(session.contentEntries);
    for(const e of list){
      if(!session.disciplineEntries.some(d => d.disciplineId === e.disciplineId)) throw new Error('O material precisa pertencer a uma disciplina deste estudo.');
      for(const [store,id,name] of [['courses',e.courseId,'courseName'],['contentBlocks',e.blockId,'blockName']]){
        if(!id) continue;
        const entity = await api.get(store,id);
        if(!entity || entity.disciplineId !== e.disciplineId) throw new Error('Um material ou bloco foi removido ou mudou de disciplina. Confira a seleção.');
        // Keep an existing historical label. Fresh selections receive the current name.
        if(!e[name]) e[name] = entity.name;
      }
      e.topicIds = session.topicEntries.filter(t => t.disciplineId === e.disciplineId && e.topicIds.includes(t.topicId)).map(t => t.topicId);
    }
    if(list.length) session.contentEntries = list; else delete session.contentEntries;
  },
  /* Explicit shares at the discipline level; optional sources split only their
     own discipline's share. Overlapping blocks never multiply session minutes. */
  shares(s){
    const ds = SessionModel.discShares(s);
    return this.entries(s).map(e => {
      const d = ds.find(d => d.disciplineId === e.disciplineId);
      const n = this.entries(s).filter(x => x.disciplineId === e.disciplineId).length;
      const index=this.entries(s).filter(x=>x.disciplineId===e.disciplineId).indexOf(e);
      return {...e, minutes:SessionModel.evenSplit(d?.minutes || 0,Math.max(1,n))[Math.max(0,index)], estimated:!!d?.estimated || n > 1};
    });
  },
  async save(store, raw, base){
    const data = {...raw, id:raw.id || uid(), name:String(raw.name || '').trim().slice(0,160), updatedAt:nowISO()};
    if(!data.name || !data.disciplineId) throw new Error('Informe nome e disciplina.');
    if(store === 'courses'){
      data.url = this.url(data.url);
      if(!data.url) throw new Error('Use um endereço HTTP ou HTTPS válido, sem usuário e senha.');
    } else {
      data.topicIds = this.ids(data.topicIds); data.courseIds = this.ids(data.courseIds);
    }
    await DB.atomic([store,'disciplines','topics','courses'], async api => {
      const current = await api.get(store,data.id);
      if(base && (!current || !sameStored({...current,lastOpenedAt:null,updatedAt:null},{...base,lastOpenedAt:null,updatedAt:null}))) throw new Error('Este item mudou em outra aba. Feche e reabra para conferir a versão atual.');
      const d = await api.get('disciplines',data.disciplineId);
      if(!d || d.archived) throw new Error('Escolha uma disciplina ativa.');
      if(current && current.disciplineId !== data.disciplineId) throw new Error('A disciplina de um item existente é preservada. Crie outro item para outra disciplina.');
      if(store === 'contentBlocks'){
        for(const id of data.topicIds){ const t=await api.get('topics',id); if(!t || t.disciplineId !== data.disciplineId) throw new Error('Confira os tópicos selecionados.'); }
        for(const id of data.courseIds){ const c=await api.get('courses',id); if(!c || c.disciplineId !== data.disciplineId) throw new Error('Confira os materiais selecionados.'); }
      }
      await api.put(store,{...data,createdAt:current?.createdAt || nowISO()});
    });
    await refresh(); return data;
  },
  async patch(store,id,changes){
    await DB.atomic([store],async api => {
      const current=await api.get(store,id); if(!current) throw new Error('Este item não existe mais.');
      await api.put(store,{...current,...changes,updatedAt:nowISO()});
    });
    await refresh();
  },
  async remove(store,id){
    await DB.atomic([store,'sessions','contentBlocks'],async api => {
      const used = (await api.getAll('sessions')).some(s => this.entries(s).some(e => (store === 'courses' ? e.courseId : e.blockId) === id));
      const related = store === 'courses' && (await api.getAll('contentBlocks')).some(b => (b.courseIds || []).includes(id));
      if(used || related) throw new Error('Este item tem vínculos. Arquive para preservar seus estudos e conteúdos.');
      await api.delete(store,id);
    });
    await refresh();
  },
  link(c,label){
    const url=this.url(c?.url); if(!url) return null;
    return h('a',{class:'material-link',href:url,target:'_blank',rel:'noopener noreferrer',text:label || c.name,
      'aria-label':'Abrir material: '+c.name+' (nova guia)', onclick:() => {
        // Opening a source only records recency. It never creates a study.
        DB.atomic(['courses'],async api => {const cur=await api.get('courses',c.id);if(cur) await api.put('courses',{...cur,lastOpenedAt:nowISO()});})
          .then(()=>loadAll()).catch(()=>toast('O link abriu, mas não foi possível guardar o acesso recente.','info'));
      }});
  },
  validateBackup(src, disciplines, topics){
    const ds=new Set(disciplines.map(x=>x.id)), ts=new Map(topics.map(x=>[x.id,x]));
    const read = (key,build) => {
      if(src[key] != null && !Array.isArray(src[key])) throw IntegrityValidator.fatal('Coleção de aprendizagem inválida: '+key);
      const seen=new Set();
      return (src[key] || []).map(x=>{
        if(!x || typeof x.id !== 'string' || !x.id || seen.has(x.id) || typeof x.name !== 'string' || !x.name.trim() || !ds.has(x.disciplineId)) throw IntegrityValidator.fatal('Material ou bloco inválido. Nenhum dado foi alterado.');
        seen.add(x.id); return build(x);
      });
    };
    const courses=read('courses',x=>{
      const url=this.url(x.url);if(!url) throw IntegrityValidator.fatal('Há um material com endereço inválido. Corrija o arquivo antes de restaurar.');
      return {...x,url};
    });
    const cs=new Map(courses.map(x=>[x.id,x]));
    const contentBlocks=read('contentBlocks',x=>{
      if(!Array.isArray(x.topicIds) || !Array.isArray(x.courseIds) || x.topicIds.some(id=>!ts.has(id) || ts.get(id).disciplineId!==x.disciplineId) || x.courseIds.some(id=>!cs.has(id) || cs.get(id).disciplineId!==x.disciplineId)) throw IntegrityValidator.fatal('Um bloco contém vínculos inválidos.');
      if(x.reviewSchedule && !ReviewSchedule.clean(x.reviewSchedule)) throw IntegrityValidator.fatal('Agendamento de bloco inválido.');
      return {...x,topicIds:this.ids(x.topicIds),courseIds:this.ids(x.courseIds)};
    });
    return {courses,contentBlocks};
  }
};

/* A block is the scheduling unit, derived from its actual session snapshots.
   The existing interval policy is reused. A general block answer never becomes
   an answer for each constituent topic or for another overlapping block. */
const LearningReviews = {
  blockUnits(){
    return DerivedCache.get('learning-block-units',()=>{
      const blocks=Learning.blocks().filter(b=>Learning.active(b));
      if(!blocks.length)return [];
      const events=new Map(),legacyTopics=new Set();
      for(const s of state.sessions){
        const content=Learning.entries(s);
        for(const topic of SessionModel.entries(s))if(!content.some(e=>e.blockId && e.topicIds.includes(topic.topicId)))legacyTopics.add(topic.topicId);
        for(const e of content)if(e.blockId){
          if(!events.has(e.blockId)) events.set(e.blockId,[]);
          events.get(e.blockId).push({s,e});
        }
      }
      return blocks.map(b=>{
        let unit={...b,kind:'block',reviewEnabled:true,reviewIntervalDays:null,reviewDueDate:null};
        const list=(events.get(b.id)||[]).sort((a,z)=>a.s.date.localeCompare(z.s.date)||a.s.createdAt.localeCompare(z.s.createdAt));
        for(const {s,e} of list){
          if(!unit.firstStudiedAt){unit.firstStudiedAt=s.date;unit.reviewIntervalDays=ReviewEngine.firstInterval(ReviewEngine.effectiveStrategy(unit));unit.reviewDueDate=addDaysISO(s.date,unit.reviewIntervalDays);}
          if(SessionModel.types(s).includes('revisao')){
            unit.lastReviewedAt=s.date;
            if(e.outcome){const ctx=reviewContextOf(unit),next=ReviewEngine.computeNext({strategy:ctx.strategy,prevInterval:unit.reviewIntervalDays,cycleStep:unit.cycleStep || 0,outcome:e.outcome,intervalModifier:ctx.intervalModifier});unit.reviewIntervalDays=next.interval;unit.cycleStep=next.cycleStep;}
            unit.reviewDueDate=addDaysISO(s.date,unit.reviewIntervalDays || 1);
          }
        }
        // Organizing old knowledge must not require rewriting old sessions or
        // recording a fictional study of the new block. Its first suggestion
        // may use the earliest existing automatic topic date, explicitly as a
        // suggestion derived from those topics. Manual topic policies stay out.
        if(!list.length){
          const dates=b.topicIds.map(getTopic).filter(t=>t && legacyTopics.has(t.id) && !t.archived && !t.reviewSchedule && t.reviewEnabled && t.reviewDueDate).map(t=>t.reviewDueDate).sort();
          if(dates.length){unit.hasStudiedTopics=true;unit.reviewDueDate=dates[0];}
        }
        return unit;
      });
    });
  },
  covered(topic){
    // Every explicit individual policy (including free/off) stays independent.
    if(topic.reviewSchedule) return false;
    return this.blockUnits().some(b=>(b.firstStudiedAt || b.hasStudiedTopics) && b.topicIds.includes(topic.id));
  },
  units(){
    const topics=state.topics.filter(t=>Learning.active(t) && !this.covered(t)).map(t=>({...t,kind:'topic'}));
    return [...this.blockUnits(),...topics];
  },
  async schedule(keys,value){
    const policy=value?.mode==='auto'?value:ReviewSchedule.clean(value);
    if(!policy || !keys.length) throw new Error('Escolha conteúdos e um agendamento.');
    await DB.atomic(['topics','contentBlocks','disciplines'],async api=>{
      for(const key of new Set(keys)){
        const [kind,...rest]=key.split(':');const id=rest.join(':');
        const store=kind==='block'?'contentBlocks':'topics';
        const x=await api.get(store,id),d=x&&await api.get('disciplines',x.disciplineId);
        if(!x || x.archived || !d || d.archived) throw new Error('A seleção mudou em outra aba. Confira os conteúdos.');
        await api.put(store,ReviewSchedule.apply({...x,reviewEnabled:true},policy));
      }
    });
    await refresh();
  },
  start(units,mode='timer'){
    const discs=Learning.ids(units.map(u=>u.disciplineId));
    const topicIds=Learning.ids(units.flatMap(u=>u.kind==='block'?u.topicIds:[u.id]));
    const contentEntries=units.filter(u=>u.kind==='block').map(u=>({disciplineId:u.disciplineId,blockId:u.id,topicIds:u.topicIds}));
    openRegisterModal({mode,disciplineIds:discs,topicIds,contentEntries,types:['revisao']});
  }
};

function learningAction(action){ return Promise.resolve().then(action).catch(e=>{toast(e.message,'err');return false;}); }
function learningInput(id,label,value='',type='text'){
  const input=h('input',{id,type,value,maxlength:type==='url'?'4096':'160'});
  return {input,node:reviewField(id,label,input)};
}
function openCourseEditor(course=null,disciplineId=''){
  openModal(close=>{
    const name=learningInput('material-name','Nome',course?.name);
    const discipline=reviewSelect('material-discipline','Disciplina', [['','Escolher disciplina'],...activeDisciplines().map(d=>[d.id,d.name])],course?.disciplineId || disciplineId,()=>{});
    if(course) discipline.node.disabled=true;
    const url=learningInput('material-url','Link',course?.url,'url');
    const favorite=h('input',{type:'checkbox',checked:!!course?.favorite});
    const description=learningInput('material-description','Descrição curta',course?.description);
    const platform=learningInput('material-platform','Plataforma',course?.platform);
    const save=reviewButton('Salvar material',()=>learningAction(async()=>{
      save.disabled=true;
      try { await Learning.save('courses',{...course,name:name.input.value,disciplineId:discipline.node.value,url:url.input.value,favorite:favorite.checked,description:description.input.value,platform:platform.input.value},course);close(); }
      finally{save.disabled=false;}
    }),'primary');
    return {title:course?'Editar material':'Adicionar curso ou material',content:h('div',{class:'learning-form'},name.node,discipline.field,url.node,
      h('p',{class:'hint',text:'Abre em nova guia. Links com parâmetros privados também farão parte do seu backup local.'}),
      h('label',{class:'guided-check'},favorite,'Favorito'),h('details',{class:'disclosure'},h('summary',{text:'Mais detalhes'}),h('div',{class:'disclosure-body'},platform.node,description.node))),
      actions:[reviewButton('Cancelar',close),save],focus:name.input};
  },{size:'narrow'});
}

function openContentBlockEditor(block=null,disciplineId=''){
  openModal(close=>{
    const name=learningInput('block-name','Nome do bloco',block?.name);
    let selected=new Set(block?.topicIds || []),courses=new Set(block?.courseIds || []);
    const list=h('div',{class:'learning-checklist'}),materials=h('div',{class:'learning-checklist'});
    const search=learningInput('block-search','Buscar tópicos','','search');
    const discipline=reviewSelect('block-discipline','Disciplina',[['','Escolher disciplina'],...activeDisciplines().map(d=>[d.id,d.name])],block?.disciplineId || disciplineId,()=>{selected.clear();courses.clear();draw();});
    if(block) discipline.node.disabled=true;
    const bulk=h('textarea',{id:'block-bulk',rows:4,placeholder:'Um tópico por linha'});
    const preview=h('p',{class:'hint',role:'status'});
    const bulkNames=()=>{const seen=new Map();for(const n of bulk.value.split(/\r?\n/).map(n=>n.trim()).filter(Boolean))if(!seen.has(normalizeText(n)))seen.set(normalizeText(n),n);return [...seen.values()];};
    function draw(){
      const did=discipline.node.value;
      mount(list,state.topics.filter(t=>t.disciplineId===did && (!t.archived || selected.has(t.id)) && normalizeText(t.name).includes(normalizeText(search.input.value))).map(t=>
        h('label',{class:'guided-check'},h('input',{type:'checkbox',checked:selected.has(t.id),onchange:e=>{if(e.target.checked)selected.add(t.id);else selected.delete(t.id);}}),t.name)));
      mount(materials,Learning.courses().filter(c=>c.disciplineId===did && (!c.archived || courses.has(c.id))).map(c=>
        h('label',{class:'guided-check'},h('input',{type:'checkbox',checked:courses.has(c.id),onchange:e=>{if(e.target.checked)courses.add(c.id);else courses.delete(c.id);}}),c.name)));
      const existing=bulkNames().filter(n=>state.topics.some(t=>t.disciplineId===did && normalizeText(t.name)===normalizeText(n))).length;
      preview.textContent=bulkNames().length?`${existing} existentes · ${bulkNames().length-existing} novos. Serão associados ao salvar.`:'';
    }
    search.input.addEventListener('input',draw);bulk.addEventListener('input',draw);draw();
    const save=reviewButton('Salvar bloco',()=>learningAction(async()=>{
      const did=discipline.node.value;
      if(!name.input.value.trim() || !getDiscipline(did)) throw new Error('Informe nome e disciplina.');
      save.disabled=true;
      try {
        // New topics and their block commit together, including duplicate checking
        // against the actual database rather than a stale form in another tab.
        await DB.atomic(['contentBlocks','topics','courses','disciplines'],async api=>{
          const cur=block&&await api.get('contentBlocks',block.id);
          if(block && !sameStored(cur,block)) throw new Error('Este bloco mudou em outra aba. Reabra para conferir.');
          if(!(await api.get('disciplines',did)) || (await api.get('disciplines',did)).archived) throw new Error('Escolha uma disciplina ativa.');
          const ids=new Set(selected),all=await api.getAll('topics');
          for(const n of bulkNames()){
            let t=all.find(t=>t.disciplineId===did && normalizeText(t.name)===normalizeText(n));
            if(!t){t=newTopic(did,n);all.push(t);await api.add('topics',t);} ids.add(t.id);
          }
          for(const id of ids){const t=all.find(t=>t.id===id);if(!t || t.disciplineId!==did) throw new Error('Os tópicos mudaram. Confira a seleção.');}
          for(const id of courses){const c=await api.get('courses',id);if(!c || c.disciplineId!==did)throw new Error('Os materiais mudaram. Confira a seleção.');}
          await api.put('contentBlocks',{...block,id:block?.id || uid(),name:name.input.value.trim(),disciplineId:did,topicIds:[...ids],courseIds:[...courses],archived:!!block?.archived,createdAt:block?.createdAt || nowISO(),updatedAt:nowISO()});
        });
        await refresh();close();
      }finally{save.disabled=false;}
    }),'primary');
    return {title:block?'Editar bloco':'Criar bloco de conteúdo',content:h('div',{class:'learning-form'},name.node,discipline.field,search.node,list,
      h('details',{class:'disclosure'},h('summary',{text:'Adicionar tópicos em lote'}),reviewField('block-bulk','Lista de tópicos',bulk),preview),
      materials.childElementCount?h('details',{class:'disclosure',open:true},h('summary',{text:'Materiais relacionados'}),materials):materials,
      h('p',{class:'hint',text:'Os estudos anteriores preservam os tópicos registrados na época.'})),actions:[reviewButton('Cancelar',close),save],focus:name.input};
  },{size:'narrow'});
}

function materialsPanel(disciplineId=''){
  const prefs=ui.materials ||= {query:'',discipline:disciplineId,filter:'active',page:0};
  const results=h('div',{class:'learning-list'});
  const search=learningInput('materials-search','Buscar materiais',prefs.query,'search');
  const ds=reviewSelect('materials-discipline','Disciplina',[['','Todas as disciplinas'],...state.disciplines.map(d=>[d.id,d.name])],prefs.discipline,v=>{prefs.discipline=v;prefs.page=0;draw();});
  const filter=reviewSelect('materials-filter','Mostrar',[['active','Ativos'],['favorite','Favoritos'],['recent','Recentes'],['archived','Arquivados']],prefs.filter,v=>{prefs.filter=v;prefs.page=0;draw();});
  search.input.addEventListener('input',()=>{prefs.query=search.input.value;prefs.page=0;draw();});
  function draw(){
    const list=Learning.courses().filter(c=>(prefs.filter==='archived'?c.archived:Learning.active(c)) && (!prefs.discipline || c.disciplineId===prefs.discipline) && (prefs.filter!=='favorite' || c.favorite) && (prefs.filter!=='recent' || c.lastOpenedAt) && normalizeText(c.name+' '+(c.platform||'')).includes(normalizeText(prefs.query)))
      .sort((a,b)=>prefs.filter==='recent'?(b.lastOpenedAt||'').localeCompare(a.lastOpenedAt||''):sortByName(a,b));
    const max=Math.max(0,Math.ceil(list.length/20)-1);prefs.page=Math.min(max,prefs.page);
    mount(results,list.slice(prefs.page*20,prefs.page*20+20).map(c=>h('div',{class:'material-row'},
      h('div',null,Learning.link(c),h('small',{class:'hint',text:disciplineName(c.disciplineId)+(c.platform?' · '+c.platform:'')})),
      h('div',{class:'material-actions'},h('button',{type:'button',class:'icon-btn','aria-label':(c.favorite?'Desfavoritar ':'Favoritar ')+c.name,'aria-pressed':String(!!c.favorite),text:c.favorite?'★':'☆',onclick:()=>learningAction(()=>Learning.patch('courses',c.id,{favorite:!c.favorite}))}),
        reviewButton('Estudar',()=>openRegisterModal({mode:'timer',disciplineId:c.disciplineId,contentEntries:[{disciplineId:c.disciplineId,courseId:c.id}]})),
        menuButton('Opções',[
          {label:'Editar material',run:()=>openCourseEditor(c)},
          {label:'Estudos associados',run:()=>openLearningHistory('courseId',c.id,c.name)},
          {label:'Conteúdos relacionados',run:()=>openCourseContents(c)},
          {label:c.archived?'Reabrir material':'Arquivar material',run:()=>learningAction(()=>Learning.patch('courses',c.id,{archived:!c.archived}))},
          {label:'Excluir material sem vínculos',run:()=>learningAction(()=>Learning.remove('courses',c.id))}
        ],{ariaLabel:'Opções de '+c.name})))),
      !list.length?h('p',{class:'quiet-empty',text:'Nenhum material neste recorte. Adicione um link para começar.'}):null,
      max>0?h('div',{class:'tf-actions'},reviewButton('Anterior',()=>{prefs.page=Math.max(0,prefs.page-1);draw();}),h('span',{text:`${prefs.page+1} de ${max+1}`}),reviewButton('Próxima',()=>{prefs.page=Math.min(max,prefs.page+1);draw();})):null);
  }
  draw();return h('section',{class:'materials-panel'},h('div',{class:'learning-head'},h('h3',{text:'Cursos e materiais'}),reviewButton('Adicionar material',()=>openCourseEditor(null,prefs.discipline),'primary')),
    h('div',{class:'learning-controls'},search.node,ds.field,filter.field),results);
}
function contentBlocksPanel(disciplineId=''){
  const root=h('section',{class:'content-blocks-panel'}),results=h('div',{class:'learning-list'});
  let page=0;
  const search=learningInput('blocks-search','Buscar blocos','','search');
  const ds=reviewSelect('blocks-discipline','Disciplina',[['','Todas as disciplinas'],...state.disciplines.map(d=>[d.id,d.name])],disciplineId,()=>{page=0;draw();});
  let archived=false;
  function draw(){
    const all=Learning.blocks().filter(b=>(archived?b.archived:Learning.active(b)) && (!ds.node.value || b.disciplineId===ds.node.value) && normalizeText(b.name).includes(normalizeText(search.input.value)));
    const lastPage=Math.max(0,Math.ceil(all.length/20)-1);page=Math.min(page,lastPage);
    mount(results,all.slice(page*20,page*20+20).map(b=>h('details',{class:'content-block-row'},h('summary',null,h('strong',{text:b.name}),h('span',{class:'hint',text:disciplineName(b.disciplineId)+' · '+plural(b.topicIds.length,'tópico','tópicos')})),
      h('div',{class:'content-block-body'},h('p',{class:'hint',text:b.topicIds.map(id=>getTopic(id)?.name).filter(Boolean).join(' · ')}),
        h('div',{class:'tf-actions'},reviewButton('Estudar bloco',()=>openRegisterModal({mode:'timer',disciplineId:b.disciplineId,topicIds:b.topicIds,contentEntries:[{disciplineId:b.disciplineId,blockId:b.id,topicIds:b.topicIds}]})),reviewButton('Editar bloco',()=>openContentBlockEditor(b)),
          reviewButton(b.archived?'Reabrir':'Arquivar',()=>learningAction(()=>Learning.patch('contentBlocks',b.id,{archived:!b.archived}))),
          reviewButton('Ver estudos',()=>openLearningHistory('blockId',b.id,b.name)),reviewButton('Excluir sem vínculos',()=>learningAction(()=>Learning.remove('contentBlocks',b.id)))),
        h('div',{class:'material-sources'},b.courseIds.map(id=>Learning.course(id)).filter(Boolean).map(c=>Learning.link(c)))))),
      !all.length?h('p',{class:'quiet-empty',text:'Agrupe tópicos que fazem sentido estudar e revisar juntos.'}):null,
      lastPage>0?h('div',{class:'tf-actions'},reviewButton('Anterior',()=>{page=Math.max(0,page-1);draw();}),h('span',{class:'hint',text:`${page+1} de ${lastPage+1}`}),reviewButton('Próxima',()=>{page=Math.min(lastPage,page+1);draw();})):null);
  }
  search.input.addEventListener('input',()=>{page=0;draw();});draw();
  root.append(h('div',{class:'learning-head'},h('h3',{text:'Blocos de conteúdo'}),reviewButton('Criar bloco',()=>openContentBlockEditor(null,ds.node.value),'primary')),
    h('div',{class:'learning-controls'},search.node,ds.field,h('label',{class:'guided-check'},h('input',{type:'checkbox',onchange:e=>{archived=e.target.checked;page=0;draw();}}),'Arquivados')),results);return root;
}
function openLearningHistory(key,id,label){
  clearHistoryFilters();ui.history.search='';ui.historyIds={ids:state.sessions.filter(s=>Learning.entries(s).some(e=>e[key]===id)).map(s=>s.id),kind:'learning',label};setView('history');
}
function openCourseContents(course){
  const blocks=Learning.blocks().filter(b=>b.courseIds.includes(course.id));
  Drawer.open(course.name,h('div',null,Learning.link(course),blocks.length?h('ul',{class:'line-list'},blocks.map(b=>h('li',{class:'line'},h('button',{type:'button',class:'line-main',text:b.name+(b.archived?' · arquivado':''),onclick:()=>{Drawer.close();openContentBlockEditor(b);}})))):h('p',{class:'hint',text:'Este material ainda não possui blocos relacionados.'})));
}
function quickMaterials(){
  const list=Learning.courses().filter(c=>Learning.active(c) && (c.favorite || c.lastOpenedAt)).sort((a,b)=>Number(!!b.favorite)-Number(!!a.favorite)||(b.lastOpenedAt||'').localeCompare(a.lastOpenedAt||''));
  if(!list.length)return null;
  return h('section',{class:'quick-materials today-card','aria-labelledby':'quick-materials-title'},h('h3',{class:'block-label',id:'quick-materials-title',text:'Meus materiais'}),
    list.slice(0,4).map(c=>h('div',{class:'material-row'},h('div',null,Learning.link(c),h('small',{class:'hint',text:disciplineName(c.disciplineId)})),
      h('button',{type:'button',class:'btn ghost sm',text:'Estudar','aria-label':'Estudar com '+c.name,onclick:()=>openRegisterModal({mode:'timer',disciplineId:c.disciplineId,contentEntries:[{disciplineId:c.disciplineId,courseId:c.id}]})}))),
    reviewButton('Todos os materiais',()=>{ui.discTab='materials';setView('disciplines');}));
}

function learningSessionLabel(s){
  return Learning.entries(s).map(e=>[e.courseName || Learning.course(e.courseId)?.name,e.blockName || Learning.block(e.blockId)?.name].filter(Boolean).join(' · ')).filter(Boolean).join(' / ');
}
function disciplineLearningPanel(id){
  const courses=Learning.courses().filter(c=>c.disciplineId===id && Learning.active(c));
  const blocks=Learning.blocks().filter(b=>b.disciplineId===id && Learning.active(b));
  return h('section',{class:'discipline-learning'},h('div',{class:'learning-head'},h('h3',{class:'section-title',text:'Materiais e conteúdos'}),
    h('div',{class:'tf-actions'},reviewButton('Adicionar material',()=>openCourseEditor(null,id)),reviewButton('Criar bloco',()=>openContentBlockEditor(null,id)))),
    courses.length?h('div',{class:'material-sources'},courses.slice(0,5).map(c=>Learning.link(c))):null,
    blocks.length?h('div',{class:'material-sources'},blocks.slice(0,5).map(b=>reviewButton(b.name,()=>openContentBlockEditor(b)))):null,
    courses.length>5||blocks.length>5?reviewButton('Ver todos os conteúdos',()=>{ui.discTab='blocks';ui.discNav={level:'root'};setView('disciplines');}):null);
}

/* One optional source and any selected learning blocks per discipline segment.
   Merely choosing a course never selects topics. Existing session snapshots are
   read as-is, even after the catalogue's block membership has changed. */
function studyLearningFields(prefix,segment,initial,onChange){
  let entries=Learning.cleanEntries(initial).filter(e=>e.disciplineId===segment.discId);
  let source=entries.find(e=>e.courseId)?.courseId || '',sourceName=entries.find(e=>e.courseId)?.courseName || '',review=false;
  let selected=entries.filter(e=>e.blockId).map(e=>({...e,topicIds:e.topicIds.slice()}));
  const root=h('div',{class:'study-learning'}),blockRows=h('div',{class:'study-content-rows'});
  const course=reviewSelect(prefix+'-material','Curso ou material (opcional)',[['','Sem material']],source,v=>{
    source=v;sourceName=Learning.course(v)?.name || '';refresh();notify();
  });
  function notify(){onChange();root.dispatchEvent(new Event('input',{bubbles:true}));}
  function changeBlock(index,id){
    const previous=new Set(selected.flatMap(e=>e.topicIds));
    const block=Learning.block(id);
    if(block)selected[index]={disciplineId:segment.discId,blockId:id,blockName:block.name,topicIds:block.topicIds.slice(),outcome:null};
    else selected.splice(index,1);
    const explicit=segment.topicPicker.value.filter(id=>!previous.has(id));
    const topics=Learning.ids([...explicit,...selected.flatMap(e=>e.topicIds)]);
    if(topics.length>MAX_TOPICS_PER_STUDY){toast('Este conjunto excede o limite de tópicos por estudo. Escolha menos blocos.','info');return;}
    segment.topicPicker.set(topics,true);refresh();notify();
  }
  function refresh(){
    const did=segment.discId;
    const courses=Learning.courses().filter(c=>c.disciplineId===did && (Learning.active(c)||c.id===source));
    mount(course.node,h('option',{value:'',text:'Sem material'}),courses.map(c=>h('option',{value:c.id,text:c.name,selected:c.id===source})));
    course.node.value=source;course.field.hidden=!courses.length;
    const available=Learning.blocks().filter(b=>b.disciplineId===did && (Learning.active(b)||selected.some(e=>e.blockId===b.id)));
    const options=source?available.filter(b=>b.courseIds.includes(source)||selected.some(e=>e.blockId===b.id)):available;
    const show=options.length?options:available;
    const rows=selected.length?selected:[null];
    mount(blockRows,show.length?rows.map((entry,i)=>{
      const select=reviewSelect(prefix+'-block'+(i?'-'+i:''),'Bloco de conteúdo (opcional)',[['','Sem bloco'],...show.filter(b=>b.id===entry?.blockId||!selected.some(e=>e.blockId===b.id)).map(b=>[b.id,b.name])],entry?.blockId||'',v=>changeBlock(i,v));
      const evaluation=entry?reviewSelect(prefix+'-block-outcome-'+i,'Como foi o bloco? (opcional)',[['','Sem autoavaliação'],...REVIEW_OUTCOMES.map(o=>[o.v,o.label])],entry.outcome||'',v=>{entry.outcome=v||null;notify();}):null;
      return h('div',{class:'study-block-choice'},select.field,entry?h('p',{class:'hint',text:plural(entry.topicIds.length,'tópico associado','tópicos associados')+' · Confira a seleção abaixo. Você pode retirar ou acrescentar tópicos.'}):null,
        evaluation?h('details',{class:'disclosure block-evaluation'},h('summary',{text:'Avaliação do bloco'}),evaluation.field):null);
    }):null,
    selected.length && show.some(b=>!selected.some(e=>e.blockId===b.id))?reviewButton('Adicionar outro bloco',()=>{
      const b=show.find(b=>!selected.some(e=>e.blockId===b.id));changeBlock(selected.length,b.id);
    }):null);
    root.hidden=!did || (!courses.length&&!available.length);
  }
  root.append(course.field,blockRows);refresh();
  return {node:root,refresh,setReview(value){review=!!value;root.dataset.review=String(review);},reset(){source='';sourceName='';selected=[];refresh();},entries(){
    const topics=segment.topicPicker.value;
    const active=selected.length?selected:[{disciplineId:segment.discId}];
    return active.map(e=>({...e,disciplineId:segment.discId,courseId:source||null,courseName:source?sourceName||Learning.course(source)?.name||'':'',outcome:review?e.outcome:null,topicIds:(e.topicIds||[]).filter(id=>topics.includes(id))})).filter(e=>e.courseId||e.blockId);
  }};
}

function openLearningSchedule(units){
  if(!units.length)return;
  openModal(close=>{
    const f=reviewScheduleField('agenda',null,'Escolha uma opção');
    return {title:'Agendar revisão',content:h('div',null,h('p',{class:'modal-sub',text:units.length===1?units[0].name:plural(units.length,'conteúdo selecionado','conteúdos selecionados')}),f.node),
      actions:[reviewButton('Cancelar',close),reviewButton('Salvar agendamento',()=>learningAction(async()=>{
        const r=f.read();if(!r.ok||!r.value)return;
        await LearningReviews.schedule(units.map(u=>u.kind+':'+u.id),r.value);close();
      }),'primary')],focus:f.select};
  },{size:'narrow'});
}
function renderLearningReviews(){
  const root=$('#reviews-body');
  const prefs=ui.learningReviews ||= {query:'',discipline:'',filter:'available',date:'',...state.meta.learningReviewFilters,selected:new Set(),page:0};
  const all=LearningReviews.units();
  const key=u=>u.kind+':'+u.id;
  const day=todayISO();
  const body=h('div',{class:'learning-review-list'}),actions=h('div',{class:'tf-actions'}),status=h('p',{class:'hint',role:'status'});
  const search=learningInput('learning-review-search','Buscar conteúdo',prefs.query,'search');
  const ds=reviewSelect('learning-review-discipline','Disciplina',[['','Todas as disciplinas'],...activeDisciplines().map(d=>[d.id,d.name])],prefs.discipline,v=>{prefs.discipline=v;changed();});
  const fs=reviewSelect('learning-review-filter','Mostrar',[['available','Disponíveis hoje'],['future','Próximas revisões'],['all','Todos os conteúdos'],['free','Sem data'],['off','Sugestões desativadas'],['date','Em uma data']],prefs.filter,v=>{if(v==='date'){fs.node.value=prefs.filter;chooseDate();}else{prefs.filter=v;changed();}});
  const picked=()=>all.filter(u=>prefs.selected.has(key(u)));
  function chooseDate(){openCivilDate({title:'Consultar agenda',value:prefs.date||day,marks:new Set(all.map(u=>ReviewSchedule.due(u)).filter(Boolean)),onApply:iso=>{prefs.date=iso;prefs.filter='date';fs.node.value='date';changed();}});}
  function changed(){prefs.page=0;prefs.selected.clear();setMeta('learningReviewFilters',{query:prefs.query,discipline:prefs.discipline,filter:prefs.filter,date:prefs.date}).catch(()=>{});draw();}
  search.input.addEventListener('input',()=>{prefs.query=search.input.value;changed();});
  function batch(){
    const units=picked();status.textContent=units.length?plural(units.length,'conteúdo selecionado','conteúdos selecionados'):'';
    actions.hidden=!units.length;
    mount(actions,reviewButton('Revisar seleção',()=>LearningReviews.start(units),'primary'),reviewButton('Agendar seleção',()=>openLearningSchedule(units)),reviewButton('Limpar seleção',()=>{prefs.selected.clear();draw();}));
  }
  function draw(){
    const matches=all.filter(u=>{
      const date=ReviewSchedule.due(u),kind=ReviewSchedule.kind(u);
      if(prefs.discipline && u.disciplineId!==prefs.discipline)return false;
      if(!normalizeText(u.name+' '+disciplineName(u.disciplineId)).includes(normalizeText(prefs.query)))return false;
      if(prefs.filter==='available')return state.settings.reviewSuggestions!==false && !!date && date<=day;
      if(prefs.filter==='future')return !!date && date>day;
      if(prefs.filter==='date')return date===prefs.date;
      if(prefs.filter==='free')return !date && kind!=='off';
      if(prefs.filter==='off')return kind==='off';
      return true;
    }).sort((a,b)=>(ReviewSchedule.due(a)||'9999').localeCompare(ReviewSchedule.due(b)||'9999')||sortByName(a,b));
    // A filtered-out selection must never modify invisible content.
    const visibleKeys=new Set(matches.map(key));for(const id of prefs.selected)if(!visibleKeys.has(id))prefs.selected.delete(id);
    const pages=Math.max(1,Math.ceil(matches.length/15));prefs.page=Math.min(prefs.page,pages-1);
    const calendar=prefs.filter==='date'?h('div',{class:'review-date-filter'},reviewButton(fmtDateBR(prefs.date||day),chooseDate)):null;
    const rows=matches.slice(prefs.page*15,prefs.page*15+15).map(u=>{
      const date=ReviewSchedule.due(u),kind=ReviewSchedule.kind(u);
      const label=kind==='off'?'Sugestões desativadas':!date?'Sem data definida':date===day?'Hoje':date<day?'Data anterior · '+fmtDateBR(date):fmtDateBR(date);
      const box=h('input',{type:'checkbox',checked:prefs.selected.has(key(u)),'aria-label':'Selecionar '+u.name,onchange:e=>{if(e.target.checked)prefs.selected.add(key(u));else prefs.selected.delete(key(u));batch();}});
      return h('article',{class:'learning-review-unit',dataset:{unit:key(u)}},h('div',{class:'learning-review-main'},box,
        h('div',null,h('small',{class:'hint',text:disciplineName(u.disciplineId)+(u.kind==='topic'&&u.reviewSchedule?' · Escolha individual':'')}),h('h4',{text:u.name}),
          h('span',{class:'agenda-status',text:label}),u.hasStudiedTopics?h('small',{class:'hint',text:'Sugestão a partir dos tópicos já estudados'}):null,
          u.kind==='block'?h('details',{class:'review-unit-details'},h('summary',{text:plural(u.topicIds.length,'tópico associado','tópicos associados')}),
            h('div',{class:'review-unit-topics'},u.topicIds.map(id=>getTopic(id)).filter(Boolean).map(t=>h('div',{class:'material-row'},h('span',{text:t.name}),reviewButton('Revisar este tópico',()=>LearningReviews.start([{...t,kind:'topic'}])),reviewButton('Agendar tópico',()=>openLearningSchedule([{...t,kind:'topic'}]))))),
            h('div',{class:'material-sources'},(u.courseIds||[]).map(id=>Learning.course(id)).filter(Boolean).map(c=>Learning.link(c)))):null)),
        h('div',{class:'learning-review-actions'},reviewButton('Revisar',()=>LearningReviews.start([u]),'primary'),
          reviewButton('Alterar data',()=>openLearningSchedule([u])),menuButton('Atalhos',[
            {label:'Revisar amanhã',run:()=>learningAction(()=>LearningReviews.schedule([key(u)],ReviewSchedule.resolve('tomorrow')))},
            {label:'Próxima semana',run:()=>learningAction(()=>LearningReviews.schedule([key(u)],ReviewSchedule.resolve('week')))},
            {label:'Escolher data',run:()=>openCivilDate({value:date||day,onApply:iso=>learningAction(()=>LearningReviews.schedule([key(u)],{mode:'date',date:iso}))})},
            {label:'Sem data definida',run:()=>learningAction(()=>LearningReviews.schedule([key(u)],{mode:'free'}))},
            {label:'Não sugerir',run:()=>learningAction(()=>LearningReviews.schedule([key(u)],{mode:'off'}))},
            {label:'Voltar às sugestões automáticas',run:()=>learningAction(()=>LearningReviews.schedule([key(u)],{mode:'auto'}))}
          ],{ariaLabel:'Atalhos de '+u.name})));
    });
    mount(body,calendar,rows.length?rows:h('p',{class:'quiet-empty',text:'Nenhum conteúdo neste recorte. Você pode consultar todos ou fazer uma revisão livre.'}),
      pages>1?h('div',{class:'tf-actions'},reviewButton('Anterior',()=>{prefs.page=Math.max(0,prefs.page-1);draw();}),h('span',{text:`${prefs.page+1} de ${pages}`}),reviewButton('Próxima',()=>{prefs.page=Math.min(pages-1,prefs.page+1);draw();})):null);batch();
  }
  draw();
  mount(root,h('div',{class:'connected-reviews'},h('div',{class:'learning-head'},h('div',null,h('h3',{text:'Conhecimentos para revisitar'}),h('p',{class:'hint',text:'Uma revisão por conjunto. As escolhas individuais continuam disponíveis.'})),
    h('div',{class:'tf-actions'},reviewButton('Revisão livre',openFreeReview),reviewButton('Montar revisão guiada',()=>openGuidedReviewBuilder()),reviewResumeButton())),
    h('div',{class:'learning-controls'},search.node,ds.field,fs.field),status,actions,body));
}

function disciplineMasterList(selected){
  const list=h('div');
  const query=h('input',{type:'search','aria-label':'Buscar disciplina nesta lista',placeholder:'Disciplinas'});
  function draw(){mount(list,activeDisciplines().filter(d=>normalizeText(d.name).includes(normalizeText(query.value))).sort(sortByName).map(d=>h('button',{type:'button','aria-current':d.id===selected?'true':null,text:d.name,onclick:()=>openDisciplineDetail(d.id)})));}
  query.addEventListener('input',draw);draw();return h('aside',{class:'discipline-master','aria-label':'Disciplinas'},query,list);
}
