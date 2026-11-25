'use strict';

/* Civil days stay YYYY-MM-DD. Month navigation never uses the selected day as
   the constructor's day (31 January + one month must not become March). */
function civilMonth(iso,delta){
  const d=parseISO(iso); if(!d)return null;
  const month=new Date(0);month.setFullYear(d.getFullYear(),d.getMonth()+delta,1);month.setHours(0,0,0,0);
  const last=new Date(0);last.setFullYear(month.getFullYear(),month.getMonth()+1,0);
  month.setDate(Math.min(d.getDate(),last.getDate()));return dateToISO(month);
}
function civilCalendar({month,selected=[],from=null,to=null,focus=null,onMonth,onSelect,id='civil',marks=new Set()}){
  const d=parseISO(month)||today(),y=d.getFullYear(),m=d.getMonth();
  const root=h('div',{class:'civil-calendar'});
  const move=delta=>onMonth(civilMonth(dateToISO(new Date(y,m,1)),delta),id+(delta<0?'-prev':'-next'));
  const months=h('select',{'aria-label':'Mês',value:String(m),onchange:e=>onMonth(`${y}-${String(Number(e.target.value)+1).padStart(2,'0')}-01`,id+'-month'),id:id+'-month'});
  MONTHS.forEach((label,i)=>months.append(h('option',{value:String(i),selected:i===m,text:capFirst(label)})));
  const year=h('input',{type:'number',id:id+'-year','aria-label':'Ano',min:'1',max:'9999',value:String(y),class:'civil-year',onchange:e=>{
    const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=9999)onMonth(String(n).padStart(4,'0')+'-'+String(m+1).padStart(2,'0')+'-01',id+'-year');else e.target.value=String(y);
  }});
  root.append(h('div',{class:'rp-head'},h('button',{type:'button',class:'icon-btn',id:id+'-prev','aria-label':'Mês anterior',text:'‹',onclick:()=>move(-1)}),months,year,
    h('button',{type:'button',class:'icon-btn',id:id+'-next','aria-label':'Próximo mês',text:'›',onclick:()=>move(1)})));
  const grid=h('div',{class:'rp-grid',role:'group','aria-label':'Dias de '+MONTHS[m]+' de '+y});
  const first=new Date(0);first.setFullYear(y,m,1);first.setHours(0,0,0,0);
  const last=new Date(0);last.setFullYear(y,m+1,0);
  const offset=(first.getDay()-weekStartDow()+7)%7;
  const labels=weekStartDow()===1?['S','T','Q','Q','S','S','D']:['D','S','T','Q','Q','S','S'];
  labels.forEach(t=>grid.append(h('span',{class:'rp-dow',text:t,'aria-hidden':'true'})));
  for(let i=0;i<offset;i++)grid.append(h('span',{'aria-hidden':'true'}));
  const monthKey=dateToISO(first).slice(0,7);
  const target=[focus,...selected,todayISO(),dateToISO(first)].find(iso=>iso?.slice(0,7)===monthKey);
  for(let n=1;n<=last.getDate();n++){
    const day=new Date(first);day.setDate(n);const iso=dateToISO(day),edge=selected.includes(iso);
    grid.append(h('button',{type:'button',class:'rp-day'+(edge?' edge':'')+(from && to && iso>=from && iso<=to?' inrange':'')+(iso===todayISO()?' today':''),
      id:id+'-'+iso,dataset:{date:iso,k:'rp-'+iso},tabindex:target===iso?'0':'-1','aria-pressed':String(edge),
      'aria-current':iso===todayISO()?'date':null,'aria-label':fmtDateLong(iso)+(edge?', selecionado':'')+(marks.has(iso)?', com conteúdos':''),
      onclick:()=>onSelect(iso)},h('span',{text:String(n)}),marks.has(iso)?h('span',{class:'civil-mark','aria-hidden':'true',text:'·'}):null));
  }
  grid.addEventListener('keydown',e=>{
    const button=e.target.closest('[data-date]');if(!button)return;
    const steps={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};let iso;
    if(e.key in steps)iso=addDaysISO(button.dataset.date,steps[e.key]);
    else if(e.key==='PageUp'||e.key==='PageDown')iso=civilMonth(button.dataset.date,(e.key==='PageUp'?-1:1)*(e.shiftKey?12:1));
    else if(e.key==='Home')iso=dateToISO(startOfWeek(parseISO(button.dataset.date)));
    else if(e.key==='End')iso=addDaysISO(dateToISO(startOfWeek(parseISO(button.dataset.date))),6);
    else return;
    e.preventDefault();const next=grid.querySelector(`[data-date="${iso}"]`);
    if(next){grid.querySelectorAll('[tabindex="0"]').forEach(x=>x.tabIndex=-1);next.tabIndex=0;next.focus();}
    else onMonth(iso,id+'-'+iso);
  });root.append(grid);return root;
}

function openCivilDate({title='Escolher data',value=todayISO(),onApply,marks=new Set()}){
  openModal(close=>{
    let selected=isStrictISODate(value)?value:todayISO(),month=selected;
    const body=h('div');
    const input=h('input',{id:'civil-date',type:'date',value:selected,onchange:()=>{if(isStrictISODate(input.value)){selected=input.value;month=selected;draw();}}});
    function draw(focus){
      mount(body,civilCalendar({month,selected:[selected],focus,marks,id:'civil',onMonth:(iso,f)=>{month=iso;draw(f);},onSelect:iso=>{selected=iso;input.value=iso;draw('civil-'+iso);}}));
      if(focus)body.querySelector('[id="'+focus+'"]')?.focus();
    }draw();
    return {title,content:h('div',null,body,reviewField('civil-date','Data selecionada',input)),actions:[reviewButton('Cancelar',close),reviewButton('Confirmar',()=>{
      if(!isStrictISODate(input.value)){input.setAttribute('aria-invalid','true');input.focus();return;}
      close();onApply(input.value);
    },'primary')]};
  },{size:'narrow'});
}

function connectedRangePicker(d,pick,rerender){
  const valid=iso=>isStrictISODate(iso)?iso:null;
  const start=valid(d.startDate),end=valid(d.endDate);
  const month=pick.month?dateToISO(pick.month):end||start||todayISO();
  const startIn=h('input',{type:'date',id:'an-rs',value:start||''});
  const endIn=h('input',{type:'date',id:'an-re',value:end||''});
  const sync=(key,input)=>{
    d[key]=valid(input.value);
    if(d.startDate && d.endDate && d.startDate>d.endDate)[d.startDate,d.endDate]=[d.endDate,d.startDate];
    const ref=d[key];if(ref)pick.month=parseISO(ref);
    pick.focus=ref;rerender(input.id);document.getElementById(input.id)?.focus();
  };
  startIn.addEventListener('change',()=>sync('startDate',startIn));endIn.addEventListener('change',()=>sync('endDate',endIn));
  return h('div',{class:'an-range'},h('p',{class:'an-range-status',role:'status',text:start && end?fmtRangeLabel({start:parseISO(start),end:parseISO(end)})+' · '+plural(rangeDays({start:parseISO(start),end:parseISO(end)}),'dia','dias'):start?'Escolha o último dia.':'Escolha o primeiro dia.'}),
    civilCalendar({month,selected:[start,end].filter(Boolean),from:start,to:end,focus:pick.focus,id:'range',
      onMonth:(iso,focus)=>{pick.month=parseISO(iso);pick.focus=iso;rerender();document.getElementById(focus)?.focus();},
      onSelect:iso=>{
        if(!d.startDate || d.endDate){d.startDate=iso;d.endDate=null;}else if(iso<d.startDate){d.endDate=d.startDate;d.startDate=iso;}else d.endDate=iso;
        pick.focus=iso;rerender();document.getElementById('range-'+iso)?.focus();
      }}),
    h('div',{class:'an-range-inputs'},reviewField('an-rs','Data inicial',startIn),reviewField('an-re','Data final',endIn)),
    reviewButton('Limpar datas',()=>{d.startDate=d.endDate=null;rerender();}));
}

/* Progressive enhancement of the existing native inputs. The picker lives in
   its own field, so a deadline, report or registration form is never replaced
   by a second modal. Draft calendar choices are applied explicitly. */
function bindCivilDateControls(){
  const active=new Set();
  function bind(input){
    if(input.dataset.civilBound || ['an-rs','an-re','civil-date'].includes(input.id))return;
    input.dataset.civilBound='true';
    const label=document.querySelector('label[for="'+CSS.escape(input.id)+'"]')?.textContent || 'Data';
    const button=h('button',{type:'button',class:'linkbtn civil-open','aria-label':'Abrir calendário: '+label,text:'Calendário','aria-expanded':'false'});
    input.insertAdjacentElement('afterend',button);
    let panel=null,selected,month,removeEsc=null,registration=null;
    function close(){removeEsc?.();removeEsc=null;if(registration)active.delete(registration);registration=null;panel?.remove();panel=null;button.setAttribute('aria-expanded','false');button.focus();}
    function draw(focus){
      mount(panel,civilCalendar({month,selected:[selected],focus,id:input.id+'-calendar',
        onMonth:(iso,f)=>{month=iso;draw(f);},onSelect:iso=>{selected=iso;draw(input.id+'-calendar-'+iso);}}),
        h('div',{class:'tf-actions'},reviewButton('Cancelar data',close),reviewButton('Usar data',()=>{
          if((input.min&&selected<input.min)||(input.max&&selected>input.max)){toast('Escolha uma data dentro do intervalo permitido.','info');return;}
          input.value=selected;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();
        },'primary')));
      if(focus)panel.querySelector('[id="'+focus+'"]')?.focus();
    }
    button.addEventListener('click',()=>{
      if(panel){close();return;}
      selected=isStrictISODate(input.value)?input.value:todayISO();month=selected;
      panel=h('div',{class:'civil-inline',role:'group','aria-label':'Calendário: '+label});button.insertAdjacentElement('afterend',panel);button.setAttribute('aria-expanded','true');
      // The application's overlay manager listens in capture. Register here so
      // Escape is consumed before it can close the enclosing study/deadline form.
      removeEsc=Overlay.pushEsc(close,panel);
      registration={panel,cleanup:()=>{removeEsc?.();removeEsc=null;panel=null;registration=null;button.setAttribute('aria-expanded','false');}};
      active.add(registration);
      draw(input.id+'-calendar-'+selected);
    });
  }
  function visit(node){if(node.nodeType!==1)return;if(node.matches('input[type="date"]'))bind(node);node.querySelectorAll('input[type="date"]').forEach(bind);}
  visit(document.body);
  const observer=new MutationObserver(records=>{
    records.forEach(r=>r.addedNodes.forEach(visit));
    for(const entry of active)if(!entry.panel.isConnected){entry.cleanup();active.delete(entry);}
  });
  observer.observe(document.body,{childList:true,subtree:true});
}
