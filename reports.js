'use strict';

/* O modelo extrai apenas os dados destinados à imagem. A prévia é o PNG antes da codificação. */
const REPORT_FORMATS = {
  square:{label:'1:1 · Quadrado', width:1080, height:1080},
  portrait:{label:'4:5 · Retrato', width:1080, height:1350},
  story:{label:'9:16 · Stories', width:1080, height:1920},
  landscape:{label:'16:9 · Paisagem', width:1920, height:1080}
};
const REPORT_LAYOUTS = [['essencial','Essencial'], ['painel','Painel'], ['editorial','Editorial']];
const REPORT_PALETTES = [
  ['petroleo','Petróleo','#237461','#7ed6b8'],
  ['indigo','Índigo','#4b52ac','#b9baff'],
  ['terracota','Terracota','#a05640','#ffb096']
];
const REPORT_BLOCKS = [
  ['time','Tempo líquido'], ['sessions','Sessões'], ['days','Dias ativos'], ['trend','Tempo no período'],
  ['distribution','Distribuição por disciplina'], ['disciplines','Disciplinas estudadas'], ['questions','Questões e acertos'],
  ['reviews','Revisões realizadas'], ['comparison','Comparação temporal'], ['summary','Resumo']
];
const REPORT_DEFAULT_BLOCKS = ['time','sessions','days','trend'];
const REPORT_MAX_SCOPE = 40;
const PT_NUM = new Intl.NumberFormat('pt-BR');

function reportDuration(minutes){
  return fmtDuration(Math.round(minutes));
}

function reportPeriods(){
  return ['hoje','semana','mes','30d','7d','90d','tudo'].map(id => [id, ANALYTICS_PRESETS.find(p => p.v === id).label])
    .concat([['custom','Período personalizado']]);
}

function reportSeries(analysis){
  const totalDays = Math.max(1, diffDays(analysis.effEnd, analysis.range.start) + 1);
  const daysPerBar = Math.ceil(totalDays / 14);
  const count = Math.ceil(totalDays / daysPerBar);
  const buckets = Array.from({length:count}, (_, index) => {
    const from = addDays(analysis.range.start, index * daysPerBar);
    const to = addDays(from, Math.min(daysPerBar, totalDays - index * daysPerBar) - 1);
    return {range:{start:from,end:to}, minutes:0};
  });
  for(const session of analysis.sessions){
    const index = Math.floor(diffDays(parseISO(session.date), analysis.range.start) / daysPerBar);
    if(buckets[index]) buckets[index].minutes += session.minutes;
  }
  return {buckets, daysPerBar};
}

function visualReportModel(analysis, settings){
  const fmt = id => PT_NUM.format(id);
  const {totals, previousComparison: comparison} = analysis;
  const formatRange = range => {
    const from = fmtDateBR(dateToISO(range.start));
    const to = fmtDateBR(dateToISO(range.end));
    return from === to ? from : from + ' – ' + to;
  };
  const range = formatRange({start:analysis.range.start,end:analysis.effEnd});
  const scope = analysis.scope.type === 'all' ? 'Todos os estudos'
    : plural(analysis.scope.ids.length, {area:'área',discipline:'disciplina',topic:'tópico'}[analysis.scope.type], {area:'áreas',discipline:'disciplinas',topic:'tópicos'}[analysis.scope.type]);
  const scopeText = scope + (analysis.scope.types ? ' · ' + analysis.scope.typesLabel : '');
  const distribution = analysis.byDiscipline.filter(d => d.minutes > 0);
  const named = (d,index) => settings.names ? d.label : 'Disciplina ' + (index + 1);
  const names = distribution.slice(0,4).map(named);
  if(distribution.length > names.length) names.push('e mais ' + (distribution.length - names.length));
  const q = analysis.results.questions;
  const series = reportSeries(analysis);
  const label = Object.fromEntries(REPORT_BLOCKS);
  const blocks = {
    time:{value:reportDuration(totals.minutes)},
    sessions:{value:fmt(totals.count)},
    days:{value:fmt(totals.activeDays)},
    trend:{...series, detail:series.daysPerBar === 1 ? 'Minutos por dia' : 'Minutos por intervalo de até ' + series.daysPerBar + ' dias'},
    distribution:{rows:distribution.slice(0,3).map((d,i) => ({label:named(d,i),minutes:d.minutes})), extra:Math.max(0,distribution.length - 3)},
    disciplines:{value:fmt(distribution.length), detail:settings.names ? names.join(' · ') : ''},
    questions:q.sets ? {value:fmt(q.correct) + ' / ' + fmt(q.total), detail:'Acertos de ' + fmt(q.total) + ' questões · ' + fmtAccuracy(q.pct)} : {detail:'Sem questões registradas'},
    reviews:{value:fmt(analysis.reviews.studiesWithReview), detail:plural(analysis.reviews.completed,'assunto revisitado','assuntos revisitados')},
    comparison:{value:reportDuration(comparison.prevTotals.minutes) + ' → ' + reportDuration(totals.minutes),
      periods:[formatRange(comparison.prevRange), formatRange(comparison.curRange)],
      detail:formatRange(comparison.prevRange) + ' → ' + formatRange(comparison.curRange)},
    summary:{detail:totals.count ? reportDuration(totals.minutes) + ' de estudo em ' + plural(totals.activeDays,'dia','dias') + '.'
      : 'Nenhum estudo registrado neste recorte.'}
  };
  return {
    title:settings.title.trim() || 'Meus estudos', subtitle:settings.subtitle.trim(), range, scope:scopeText,
    empty:!totals.count,
    blocks:settings.order.filter(id => settings.visible.has(id)).map(id => ({id,label:label[id],...blocks[id]})),
    brand:settings.brand
  };
}

function reportLuminance(hex){
  const values = hex.slice(1).match(/.{2}/g).map(c => parseInt(c,16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
function reportContrast(a,b){
  const values = [reportLuminance(a),reportLuminance(b)].sort((x,y) => x-y);
  return (values[1] + .05) / (values[0] + .05);
}
function reportMix(a,b,fraction){
  const value = (hex,at) => parseInt(hex.slice(at,at+2),16);
  return '#' + [1,3,5].map(at => Math.round(value(a,at)*(1-fraction)+value(b,at)*fraction).toString(16).padStart(2,'0')).join('');
}
function reportReadable(color, background, ink, min){
  for(let step=0; step<=10; step++){
    const mixed = reportMix(color,ink,step/10);
    if(reportContrast(mixed,background) >= min) return mixed;
  }
  return ink;
}
function reportColors(settings){
  const bg = settings.background;
  const ink = reportContrast('#ffffff',bg) > reportContrast('#101819',bg) ? '#ffffff' : '#101819';
  const card = reportMix(bg,ink,settings.highContrast ? .04 : .065);
  const on = (color,target,min) => {
    const text = reportContrast('#ffffff',target) > reportContrast('#000000',target) ? '#ffffff' : '#000000';
    return reportReadable(color,target,text,min);
  };
  return {
    bg, ink:on(ink,bg,settings.highContrast ? 7 : 4.5), card, cardInk:on(ink,card,4.5),
    soft:on(reportMix(bg,ink,.57),bg,4.5), cardSoft:on(reportMix(card,ink,.60),card,4.5),
    accent:on(settings.accent,bg,4.5), chart:on(settings.accent,card,3),
    line:reportMix(card,ink,.21)
  };
}

function reportText(ctx, value, x, y, width, size, {weight=500,color='#000000',lines=1,serif=false}={}){
  const valueText = String(value ?? '').trim().replace(/\s+/g,' ');
  if(!valueText) return 0;
  ctx.font = `${weight} ${size}px ${serif ? 'Georgia, serif' : 'system-ui, sans-serif'}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  const glyphs = typeof Intl.Segmenter === 'function'
    ? [...reportText.segmenter.segment(valueText)].map(s => s.segment) : Array.from(valueText);
  const rows = [];
  while(glyphs.length && rows.length < lines){
    let end = 0, space = 0;
    while(end < glyphs.length && ctx.measureText(glyphs.slice(0,end+1).join('')).width <= width){
      if(glyphs[end] === ' ') space = end;
      end++;
    }
    if(end < glyphs.length && space > 0 && rows.length < lines - 1) end = space;
    let row = glyphs.splice(0,Math.max(1,end)).join('').trim();
    if(rows.length === lines - 1 && glyphs.length){
      const chars = Array.from(row);
      while(chars.length && ctx.measureText(chars.join('') + '…').width > width) chars.pop();
      row = chars.join('').trimEnd() + '…';
    }
    while(glyphs[0] === ' ') glyphs.shift();
    rows.push(row);
  }
  const leading = size * 1.22;
  rows.forEach((row,index) => ctx.fillText(row,x,y+index*leading));
  return rows.length * leading;
}
reportText.segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('pt-BR',{granularity:'grapheme'}) : null;

function reportRect(ctx, x,y,w,h,r,color){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  ctx.fillStyle = color;ctx.fill();
}

function reportRows(blocks, columns, layout){
  const rows = [];
  let row = [], span = 0;
  for(const block of blocks){
    const metric = ['time','sessions','days','disciplines','reviews'].includes(block.id);
    const slots = layout === 'painel' ? 1 : metric ? 1 : Math.min(2,columns);
    if(span+slots > columns){ rows.push(row); row = []; span = 0; }
    row.push({block,slots});
    span += slots;
  }
  if(row.length) rows.push(row);
  return rows;
}

function drawVisualReport(canvas, model, settings){
  const {width,height} = REPORT_FORMATS[settings.format];
  if(canvas.width !== width) canvas.width = width;
  if(canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d', {alpha:false});
  if(!ctx) throw new Error('Prévia indisponível.');
  const p = reportColors(settings);
  const editorial = settings.layout === 'editorial';
  const landscape = width > height;
  const pad = landscape ? 70 : 64;
  const contentWidth = width - pad*2;
  ctx.fillStyle = p.bg;ctx.fillRect(0,0,width,height);

  if(editorial){
    ctx.strokeStyle = p.line;ctx.lineWidth = 2;
    ctx.strokeRect(25,25,width-50,height-50);
  } else {
    reportRect(ctx,pad,49,settings.layout === 'painel' ? 146 : 58,6,3,p.accent);
  }
  let y = 73;
  const titleSize = model.title.length > 48 ? 49 : editorial ? 69 : 68;
  y += reportText(ctx,model.title,pad,y,contentWidth,titleSize,{weight:700,color:p.ink,lines:3,serif:editorial});
  y += reportText(ctx,model.subtitle,pad,y+5,contentWidth,25,{color:p.soft,lines:2}) + 7;
  y += reportText(ctx,model.range+'  ·  '+model.scope,pad,y,contentWidth,23,{weight:650,color:p.accent,lines:2}) + 19;
  if(model.empty) y += reportText(ctx,'Nenhum estudo registrado neste recorte.',pad,y,contentWidth,24,{color:p.soft}) + 8;
  const columns = landscape ? 4 : 3;
  let rows = reportRows(model.blocks,columns,settings.layout);
  if(rows.length > (landscape ? 3 : 5)) rows = reportRows(model.blocks,columns,'painel');
  const gap = 14;
  const bottom = height - (model.brand ? 100 : 64);
  const weights = rows.map(row => row.some(({block}) => block.buckets || block.rows) ? 1.6 : 1);
  const countWeight = weights.reduce((total,weight) => total+weight,0);
  const free = bottom-y-Math.max(0,rows.length-1)*gap;
  rows.forEach((row,index) => {
    const rowHeight = free*weights[index]/countWeight;
    let x = pad;
    const slots = row.reduce((t,item) => t+item.slots,0);
    const slotWidth = (contentWidth-(row.length-1)*gap)/slots;
    for(const {block,slots:span} of row){
      const w = slotWidth*span;
      drawReportBlock(ctx,block,x,y,w,rowHeight,p,settings.layout);
      x += w+gap;
    }
    y += rowHeight+gap;
  });
  if(model.brand){
    const base = height - 66;
    ctx.beginPath();ctx.arc(pad+16,base+12,13,-Math.PI/2,Math.PI, false);
    ctx.strokeStyle=p.accent;ctx.lineWidth=4;ctx.lineCap='round';ctx.stroke();
    ctx.beginPath();ctx.arc(pad+4,base+6,3,0,2*Math.PI);ctx.fillStyle=p.accent;ctx.fill();
    reportText(ctx,'Ciclo',pad+39,base,contentWidth-39,24,{weight:700,color:p.ink});
  }
  canvas.setAttribute('aria-label', [model.title, model.subtitle, model.range, model.scope,
    model.empty ? 'Nenhum estudo registrado.' : '',
    ...model.blocks.map(b => [b.label,b.value,b.detail,b.rows?.map(r => r.label + ' ' + reportDuration(r.minutes)).join(', ')].filter(Boolean).join('. '))]
    .filter(Boolean).join('. '));
}

function drawReportBlock(ctx, block, x,y,width,height,p,layout){
  const gap = height < 138 ? 14 : 20;
  const area = width-gap*2;
  const w = x+gap;
  const innerY = y+gap;
  reportRect(ctx,x,y,width,height,layout === 'editorial' ? 3 : 20,p.card);
  reportText(ctx,block.label,w,innerY,area,height < 135 ? 19 : 22,{weight:650,color:p.cardSoft});
  let at = innerY+(height < 135 ? 27 : 34);
  const room = y+height-gap-at;
  if(block.buckets){
    const chart = Math.max(24, room - 31);
    const base = at + chart;
    const max = Math.max(1,...block.buckets.map(b => b.minutes));
    const barSlot = area / block.buckets.length;
    const barWidth = Math.max(2, Math.min(barSlot * .54, 44));
    block.buckets.forEach((bucket,i) => {
      const h = bucket.minutes ? Math.max(3, chart * bucket.minutes / max) : 2;
      const label = block.buckets.length <= 7 || i === 0 || i === block.buckets.length - 1;
      const left = w+i*barSlot+(barSlot-barWidth)/2;
      reportRect(ctx,left,base-h,barWidth,h,Math.min(3,h/2),bucket.minutes ? p.chart : p.line);
      if(label && barSlot >= 40) reportText(ctx,fmtDateBR(dateToISO(bucket.range.start)).slice(0,5),w+i*barSlot,base+3,barSlot-1,14,{color:p.cardSoft});
    });
    const peak = Math.max(...block.buckets.map(b => b.minutes));
    reportText(ctx,block.detail + (peak ? ' · máximo ' + reportDuration(peak) : ''),w,base+17,area,15,{color:p.cardSoft});
    return;
  }
  if(block.rows){
    if(!block.rows.length){ reportText(ctx,'Sem tempo registrado',w,at,area,20,{color:p.cardInk}); return; }
    const rowHeight = Math.min(45, (room-(block.extra ? 17 : 0))/block.rows.length);
    const valueWidth = Math.min(110, area*.37);
    const peak = block.rows[0].minutes;
    for(const row of block.rows){
      reportText(ctx,row.label,w,at,area-valueWidth,17,{color:p.cardInk});
      reportText(ctx,reportDuration(row.minutes),w+area-valueWidth,at,valueWidth,17,{weight:650,color:p.cardInk});
      if(rowHeight >= 27) reportRect(ctx,w,at+20,area*row.minutes/peak,4,1.5,p.chart);
      at += rowHeight;
    }
    if(block.extra) reportText(ctx,'+ ' + plural(block.extra,'disciplina','disciplinas'),w,at,area,15,{color:p.cardSoft});
    return;
  }
  if(block.value){
    const preferred = block.id === 'comparison' ? 29 : Math.min(96, Math.max(26,room*(block.detail ? .48 : .72)));
    ctx.font = `700 ${preferred}px system-ui, sans-serif`;
    const measured = ctx.measureText(block.value).width;
    const size = Math.min(preferred, Math.floor(preferred * area / Math.max(1,measured)));
    at += reportText(ctx,block.value,w,at,area,size,{weight:700,color:p.cardInk}) + 4;
  }
  if(block.periods){
    const size = Math.min(19, Math.max(14, (y+height-gap-at)/2.44));
    for(const period of block.periods) at += reportText(ctx,period,w,at,area,size,{color:p.cardSoft});
  } else if(block.detail && y+height-gap-at >= 17){
    const detailSize = Math.min(22, Math.max(15,Math.floor((y+height-gap-at)/1.22)));
    reportText(ctx,block.detail,w,at,area,detailSize,{color:p.cardSoft,lines:Math.min(2,Math.floor((y+height-gap-at)/(detailSize*1.22))) || 1});
  }
}

function openVisualReport(rawQuery){
  const initial = normalizeAnalyticsQuery(rawQuery || {periodPreset:'30d'});
  const firstPalette = REPORT_PALETTES[0];
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  const settings = {
    format:'portrait', layout:'essencial', theme, palette:firstPalette[0], accent:firstPalette[theme === 'light' ? 2 : 3],
    background:theme === 'light' ? '#eff6f0' : '#102522', highContrast:false,
    title:'Meus estudos', subtitle:'', names:false, brand:true, order:REPORT_BLOCKS.map(([id]) => id), visible:new Set(REPORT_DEFAULT_BLOCKS)
  };
  const query = {...initial, scopeId:null};
  const scopes = {};
  if(initial.scopeType !== 'all') scopes[initial.scopeType] = new Set(initial.scopeIds);

  let cleanup = null;
  openModal(close => {
    const canvas = h('canvas', {id:'report-preview', role:'img', 'aria-label':'Prévia do relatório'});
    const message = h('p', {class:'hint report-status',role:'status'});
    const download = reviewButton('Baixar PNG', downloadPNG, 'primary');
    const share = reviewButton('Compartilhar PNG', sharePNG);
    share.hidden = true;
    const period = reviewSelect('report-period','Período',reportPeriods(),query.periodPreset, value => {
      query.periodPreset = value;
      dates.hidden = value !== 'custom';
      queue();
    });
    const daily = {start:todayISO(),end:todayISO()};
    const start = h('input', {type:'date',value:query.startDate || daily.start,oninput:queue});
    const end = h('input', {type:'date',value:query.endDate || daily.end,oninput:queue});
    const dates = h('div', {class:'report-fields',hidden:query.periodPreset !== 'custom'},
      reviewField('report-start','De',start), reviewField('report-end','Até',end));
    const kind = reviewSelect('report-scope','Recorte', [['all','Todos os estudos'],['discipline','Disciplinas'],['area','Áreas de estudo'],['topic','Tópicos']],
      query.scopeType, value => {query.scopeType = value; scopeSearch.value = ''; scopeOptions(); queue();});
    const scopeSearch = h('input',{type:'search',oninput:scopeOptions});
    const scopeList = h('div',{class:'report-scope-list'});
    const scopeCount = h('p',{class:'hint',role:'status'});
    const filters = h('div', {class:'report-scope-options'}, reviewField('report-search','Buscar no recorte',scopeSearch), scopeCount, scopeList);
    const typesText = h('span', {class:'hint',text:query.types.map(sessionTypeLabel).join(' · ')});
    const typeRow = h('div', {class:'tf-actions',hidden:!query.types.length}, typesText, reviewButton('Limpar tipos de estudo', () => {
      query.types = []; typeRow.hidden = true; queue();
    }));
    const formats = reviewSelect('report-format','Formato',Object.entries(REPORT_FORMATS).map(([id,f]) => [id,f.label]), settings.format, v => {settings.format=v;queue();});
    const layouts = reviewSelect('report-layout','Modelo',REPORT_LAYOUTS,settings.layout, v => {settings.layout=v;queue();});

    const title = h('input',{type:'text',maxlength:'72',value:settings.title,oninput:e => {settings.title=e.target.value;queue();}});
    const subtitle = h('input',{type:'text',maxlength:'100',oninput:e => {settings.subtitle=e.target.value;queue();}});
    const color = (id,label,key) => reviewField(id,label,h('input',{type:'color',value:settings[key],oninput:e => {settings[key]=e.target.value;queue();}}));
    const accent = color('report-accent','Cor principal','accent');
    const background = color('report-background','Cor de fundo','background');
    function applyPalette(){
      const palette = REPORT_PALETTES.find(p => p[0] === settings.palette);
      settings.accent = palette[settings.theme === 'light' ? 2 : 3];
      settings.background = settings.theme === 'light' ? '#eff6f0' : '#102522';
      accent.querySelector('input').value = settings.accent;
      background.querySelector('input').value = settings.background;
      queue();
    }
    const themes = reviewSelect('report-theme','Tema',[['light','Claro'],['dark','Escuro']],settings.theme, v => {settings.theme=v;applyPalette();});
    const palettes = reviewSelect('report-palette','Paleta',REPORT_PALETTES.map(([id,label]) => [id,label]), settings.palette, v => {settings.palette=v;applyPalette();});
    const check = (label,key) => h('label',{class:'guided-check'},
      h('input',{type:'checkbox',checked:settings[key],onchange:e => {settings[key]=e.target.checked;queue();}}),label);
    const order = h('ol',{class:'report-order'});
    const structure = h('div', {class:'report-editor'},
      h('div', {class:'report-controls'},
        h('div',{class:'report-fields'},period.field,kind.field), dates, filters, typeRow,
        h('div',{class:'report-fields'},formats.field,layouts.field),
        h('details', {class:'disclosure'},
          h('summary',{text:'Título e cores'}),
          h('div',{class:'disclosure-body'},
            reviewField('report-title','Título',title), reviewField('report-subtitle','Subtítulo',subtitle),
            h('div',{class:'report-fields'},themes.field,palettes.field,accent,background),
            check('Contraste reforçado','highContrast'))),
        h('details', {class:'disclosure'},
          h('summary',{text:'Blocos e privacidade'}),
          h('div',{class:'disclosure-body'},
            check('Mostrar nomes das disciplinas','names'), check('Mostrar marca do Ciclo','brand'),
            h('p',{class:'hint',text:'Controle a ordem e os dados da imagem. Comentários e nomes de sessões ficam fora.'}), order))),
      h('div', {class:'report-stage'},
        h('p',{class:'report-preview-heading',text:'Prévia da imagem'}),
        canvas, message));
    let frame = 0, pngGeneration = 0, shareFile = null, closed = false;

    function scopeOptions(){
      const type = query.scopeType;
      filters.hidden = type === 'all';
      if(type === 'all') return;
      const active = scopes[type] ||= new Set();
      const entities = {discipline:state.disciplines, area:state.areas, topic:state.topics}[type];
      const terms = normalizeText(scopeSearch.value).split(' ').filter(Boolean);
      const labels = entities.map(item => ({id:item.id, label:type === 'topic' ? disciplineName(item.disciplineId) + ' · ' + item.name : item.name}));
      const matched = labels.filter(item => !terms.length || matchesTerms(normalizeText(item.label),terms)).sort(sortByNameForReport);
      const visible = matched.slice(0,40);
      const count = () => {scopeCount.textContent = active.size + ' de até ' + REPORT_MAX_SCOPE + ' selecionados.';};
      count();
      mount(scopeList, visible.map(item => h('label',{class:'guided-check'},
        h('input',{type:'checkbox',checked:active.has(item.id),onchange:e => {
          if(e.target.checked && active.size >= REPORT_MAX_SCOPE){
            e.target.checked = false; toast('Selecione até ' + REPORT_MAX_SCOPE + ' itens para o recorte.', 'info'); return;
          }
          if(e.target.checked) active.add(item.id); else active.delete(item.id);
          count();queue();
        }}),item.label)),
        !visible.length ? h('p',{class:'hint',text:'Nenhum item encontrado.'}) : null,
        matched.length > visible.length ? h('p',{class:'hint',text:'Use a busca para encontrar outros itens.'}) : null);
    }

    function drawOrder(focus){
      const labels = Object.fromEntries(REPORT_BLOCKS);
      mount(order, settings.order.map((id,index) => {
        const label = labels[id];
        const move = (delta, direction) => {
          const destination = index+delta;
          [settings.order[index],settings.order[destination]] = [settings.order[destination],settings.order[index]];
          drawOrder('report-' + id + '-' + (destination === 0 || destination === settings.order.length-1 ? (direction === 'up' ? 'down' : 'up') : direction));
          queue();
        };
        const control = (labelBtn,direction,delta) => h('button',{
          id:'report-' + id + '-' + direction, type:'button', class:'icon-btn', disabled:index+delta < 0 || index+delta >= settings.order.length,
          'aria-label':labelBtn + ' bloco ' + label, text:delta < 0 ? '↑' : '↓',onclick:() => move(delta,direction)
        });
        return h('li',null,
          h('label',{class:'guided-check'}, h('input',{type:'checkbox',checked:settings.visible.has(id),onchange:e => {
            if(e.target.checked) settings.visible.add(id); else settings.visible.delete(id);
            queue();
          }}),label),
          h('div',{class:'report-order-buttons'},control('Subir','up',-1),control('Descer','down',1)));
      }));
      if(focus) document.getElementById(focus)?.focus();
    }

    function queue(){
      if(closed) return;
      if(frame) cancelAnimationFrame(frame);
      share.disabled = true;
      frame = requestAnimationFrame(() => {frame=0;paint();});
    }
    function paint(){
      const generation = ++pngGeneration;
      shareFile = null;
      share.hidden = true;
      download.disabled = true;
      const type = query.scopeType;
      const ids = type === 'all' ? [] : [...(scopes[type] || [])];
      const custom = query.periodPreset === 'custom';
      const validDates = !custom || (isStrictISODate(start.value) && isStrictISODate(end.value) && start.value <= end.value);
      if(!validDates || (type !== 'all' && !ids.length)){
        canvas.hidden = true;
        message.textContent = !validDates ? 'Escolha um intervalo válido, com a data inicial antes da final ou no mesmo dia.' : 'Escolha pelo menos um item para visualizar este recorte.';
        return false;
      }
      try {
        const analysis = AnalyticsEngine.query({...query, scopeIds:ids,startDate:start.value,endDate:end.value});
        if(analysis.scope.fellBack){
          canvas.hidden = true;
          message.textContent = 'Este recorte não está mais disponível. Escolha outro.';
          return false;
        }
        const model = visualReportModel(analysis,settings);
        drawVisualReport(canvas,model,settings);
        canvas.hidden = false;
        const format = REPORT_FORMATS[settings.format];
        message.textContent = format.width + ' × ' + format.height + ' px';
        download.disabled = false;
        if(typeof navigator.share === 'function' && typeof navigator.canShare === 'function'){
          canvas.toBlob(blob => {
            if(closed || generation !== pngGeneration || !blob || frame) return;
            const file = new File([blob],filename(),{type:'image/png'});
            if(navigator.canShare({files:[file]})){
              shareFile = file; share.hidden = false; share.disabled = false;
            }
          }, 'image/png');
        }
        return true;
      } catch(err){
        console.error('Falha na prévia do relatório:',err);
        canvas.hidden = true;
        message.textContent = 'Não foi possível gerar a prévia. Tente mudar o formato ou o recorte.';
        return false;
      }
    }
    function filename(){ return `ciclo-estudos-${todayISO()}-${settings.format}.png`; }
    function downloadPNG(){
      if(frame){ cancelAnimationFrame(frame); frame=0; if(!paint()) return; }
      const name = filename();
      download.disabled = true;
      try {
        canvas.toBlob(blob => {
          if(closed) return;
          download.disabled = canvas.hidden;
          if(!blob){ message.textContent='Não foi possível gerar o PNG. Tente novamente.'; return; }
          const url = URL.createObjectURL(blob);
          const link = h('a',{href:url,download:name,rel:'noopener'});
          document.body.append(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url),1500);
          toast('Confira o arquivo na lista de downloads do navegador.','ok',{title:'PNG gerado'});
        },'image/png');
      } catch(err){
        console.error('Falha ao exportar PNG:',err);
        download.disabled = false;
        message.textContent = 'Não foi possível exportar o PNG. Tente novamente.';
      }
    }
    async function sharePNG(){
      if(!shareFile || frame) return;
      try {
        await navigator.share({files:[shareFile]});
        if(!closed) message.textContent = 'Imagem encaminhada ao compartilhamento do dispositivo.';
      } catch(err){
        if(!closed && err.name !== 'AbortError') message.textContent = 'O compartilhamento falhou. Você pode baixar o PNG.';
      }
    }
    function sortByNameForReport(a,b){ return a.label.localeCompare(b.label,'pt-BR'); }
    scopeOptions();
    drawOrder();
    queue();
    cleanup = () => {closed=true; if(frame) cancelAnimationFrame(frame);};
    return {title:'Criar relatório',content:structure,actions:[reviewButton('Fechar', () => close()),share,download]};
  },{size:'wide report',onClose:() => cleanup?.()});
}
