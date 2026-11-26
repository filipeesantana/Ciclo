const {test,before,after,beforeEach,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {start,open,seed}=require('./support.cjs');
let runtime,context,page;
before(async()=>{runtime=await start(process.env.BROWSER||'chromium');});after(async()=>runtime?.close());
beforeEach(async()=>{({context,page}=await open(runtime));page.setDefaultTimeout(7000);await seed(page);await page.clock.setFixedTime(new Date('2026-12-15T15:00:00Z'));});afterEach(async()=>context.close());
const action=name=>page.locator('#modal-actions').getByRole('button',{name,exact:true}).click();
async function november(){
 await page.evaluate(async()=>{for(const [date,minutes]of [['2026-10-31',20],['2026-11-01',40],['2026-11-15',60],['2026-11-30',80],['2026-12-01',100]])await SessionCommands.create({disciplineId:'portugues',date,minutes});await refresh();setView('analytics');});
 await page.locator('#results-period').selectOption('custom');
 await page.locator('#range-month').selectOption('10');
 await page.locator('[data-date="2026-11-01"]').click();await page.locator('[data-date="2026-11-30"]').click();await action('Aplicar período');
}

test('REGRESSÃO: datas civis impossíveis e sufixos não são aceitos como outro dia',async()=>{
 assert.deepEqual(await page.evaluate(()=>['2026-02-31','2025-02-29','2026-13-01','2026-11-01-lixo','2026-11-01T00:00:00Z'].map(parseISO)),Array(5).fill(null));
 assert.equal(await page.evaluate(()=>dateToISO(parseISO('2024-02-29'))),'2024-02-29');
 const q=await page.evaluate(()=>normalizeAnalyticsQuery({periodPreset:'custom',startDate:'2026-02-31',endDate:'2026-03-02'}));assert.equal(q.startDate,null);
});

test('novembro por cliques inclui os dois extremos: Resultados, Histórico e PNG mostram 180 minutos',async()=>{
 await november();assert.equal(await page.locator('.insights-total strong').innerText(),'3h');
 assert.equal(await page.evaluate(()=>AnalyticsEngine.query(ui.analyticsQuery).totals.count),3);
 await page.getByRole('button',{name:'Ver registros',exact:true}).click();assert.deepEqual(await page.evaluate(()=>filteredSessions().map(s=>s.minutes).sort((a,b)=>a-b)),[40,60,80]);
 await page.goBack();assert.equal(await page.locator('#results-period').inputValue(),'custom');
 await page.getByRole('button',{name:'Criar relatório',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#report-preview')?.getAttribute('aria-label').includes('3h'));
 assert.equal(await page.locator('#report-start').inputValue(),'2026-11-01');assert.equal(await page.locator('#report-end').inputValue(),'2026-11-30');
});

test('intervalo temporário: mudar mês/ano preserva seleção; Cancelar preserva filtro; reabrir recupera aplicação',async()=>{
 await november();const before=await page.evaluate(()=>ui.analyticsQuery);
 await page.locator('#results-period').selectOption('custom');await page.locator('#range-next').click();await page.locator('#range-year').fill('2027');await page.locator('#range-year').press('Tab');
 await page.locator('[data-date="2027-12-05"]').click();await action('Cancelar');assert.deepEqual(await page.evaluate(()=>ui.analyticsQuery),before);
 await page.locator('#results-period').selectOption('custom');assert.equal(await page.locator('#an-rs').inputValue(),'2026-11-01');assert.equal(await page.locator('#an-re').inputValue(),'2026-11-30');
 await page.locator('#range-next').click();assert.equal(await page.locator('#an-rs').inputValue(),'2026-11-01');
 await action('Cancelar');await page.reload();await page.waitForFunction(()=>state.ready);assert.deepEqual(await page.evaluate(()=>ui.analyticsQuery),before);
});

test('mesmo dia e intervalo inverso são previsíveis; setas cruzam mês e PageUp mantém o dia válido',async()=>{
 await page.evaluate(()=>{setView('analytics');});await page.locator('#results-period').selectOption('custom');await page.locator('#range-month').selectOption('10');
 await page.locator('[data-date="2026-11-30"]').click();await page.keyboard.press('ArrowRight');assert.equal(await page.locator(':focus').getAttribute('data-date'),'2026-12-01');
 await page.keyboard.press('PageUp');assert.equal(await page.locator(':focus').getAttribute('data-date'),'2026-11-01');
 await page.locator('#an-rs').fill('2026-11-30');await page.locator('#an-rs').press('Tab');await page.locator('#an-re').fill('2026-11-01');await page.locator('#an-re').press('Tab');
 assert.equal(await page.locator('#an-rs').inputValue(),'2026-11-01');assert.equal(await page.locator('#an-re').inputValue(),'2026-11-30');
 await page.locator('#an-rs').fill('2026-11-15');await page.locator('#an-rs').press('Tab');await page.locator('#an-re').fill('2026-11-15');await page.locator('#an-re').press('Tab');await action('Aplicar período');
 assert.equal(await page.evaluate(()=>AnalyticsEngine.query(ui.analyticsQuery).days),1);
});

test('Planejamento: escolher dezembro pelo calendário, adicionar dia e recarregar conserva a data',async()=>{
 await page.evaluate(async()=>{await DB.put('plans',{...newPlan('Rotina',300),id:'plan',allocations:[{disciplineId:'portugues',targetMinutes:300}]});await loadAll();await PlannerEngine.ensureWeeklyPlan();await refresh();setView('plan');});
 await page.getByRole('button',{name:'Escolher dia',exact:true}).click();await page.locator('#civil-month').selectOption('11');await page.locator('[data-date="2026-12-29"]').click();await action('Confirmar');
 assert.equal(await page.evaluate(()=>planWeekStart()),'2026-12-28');
 await page.getByRole('button',{name:'Adicionar aos dias',exact:true}).click();
 await page.locator('.wb-subject').filter({hasText:'Português'}).getByRole('radio').check();
 await page.locator('.wb-days input').nth(1).check();
 await action('Adicionar aos dias');await page.waitForFunction(()=>state.weeklyPlans.some(w=>w.blocks.some(b=>b.date==='2026-12-29')));
 await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>state.weeklyPlans.flatMap(w=>w.blocks).filter(b=>b.date==='2026-12-29').length),1);
});

test('Prazos: calendário compartilhado cancela sem mudar input, confirma dia e persiste após F5',async()=>{
 await page.evaluate(()=>openDeadlineModal(null));await page.locator('#dl-title').fill('Certificação');
 await page.getByRole('button',{name:/Abrir calendário: Data do prazo|Abrir calendário: Data/}).first().click();
 const inline=page.locator('.civil-inline');await inline.getByLabel('Mês',{exact:true}).selectOption('0');await inline.getByLabel('Ano',{exact:true}).fill('2027');await inline.getByLabel('Ano',{exact:true}).press('Tab');
 await inline.locator('[data-date="2027-01-15"]').click();await inline.getByRole('button',{name:'Cancelar data',exact:true}).click();assert.equal(await page.locator('#dl-date').inputValue(),'');
 await page.getByRole('button',{name:/Abrir calendário: Data do prazo|Abrir calendário: Data/}).first().click();
 await inline.getByLabel('Mês',{exact:true}).selectOption('0');await inline.getByLabel('Ano',{exact:true}).fill('2027');await inline.getByLabel('Ano',{exact:true}).press('Tab');await inline.locator('[data-date="2027-01-15"]').click();await inline.getByRole('button',{name:'Usar data',exact:true}).click();
 await action('Adicionar prazo');await page.waitForFunction(()=>state.deadlines.length===1);await page.reload();await page.waitForFunction(()=>state.ready);assert.equal(await page.evaluate(()=>state.deadlines[0].date),'2027-01-15');
});

test('aritmética civil e presets em São Paulo, Nova York e Auckland inclui DST, bissexto e virada de ano',async()=>{
 for(const timezoneId of ['America/Sao_Paulo','America/New_York','Pacific/Auckland']){
  const c=await open(runtime,{timezoneId});try{await seed(c.page);await c.page.clock.setFixedTime(new Date('2026-11-25T15:00:00Z'));
   const f=await c.page.evaluate(()=>({month:civilMonth('2026-01-31',1),leap:civilMonth('2024-01-31',1),year:addDaysISO('2026-12-31',1),spring:diffDays(parseISO('2026-03-09'),parseISO('2026-03-07')),seven:rangeDays(presetRange('7d')),thirty:rangeDays(presetRange('30d'))}));
   assert.deepEqual(f,{month:'2026-02-28',leap:'2024-02-29',year:'2027-01-01',spring:2,seven:7,thirty:30});
  }finally{await c.context.close();}
 }
});

test('Cancelar período personalizado iniciado em 30 dias preserva também o controle visível',async()=>{
 await page.evaluate(()=>setView('analytics'));assert.equal(await page.locator('#results-period').inputValue(),'30d');
 await page.locator('#results-period').selectOption('custom');await page.locator('#range-prev').click();await action('Cancelar');
 assert.equal(await page.locator('#results-period').inputValue(),'30d');assert.equal(await page.evaluate(()=>ui.analyticsQuery.periodPreset),'30d');
});

test('prazo conclui, reabre, arquiva e restaura pela interface sem mudar sua data',async()=>{
 await page.evaluate(async()=>{await DB.put('deadlines',newDeadline({id:'deadline-flow',title:'Certificação Linux',date:'2026-12-31'}));await refresh();ui.discTab='deadlines';setView('disciplines');});
 await page.locator('.dl-line').filter({hasText:'Certificação Linux'}).click();await page.locator('#drawer-content').getByRole('button',{name:'Concluir',exact:true}).click();await page.waitForFunction(()=>state.deadlines[0].status==='completed');
 await page.locator('#drawer-content').getByRole('button',{name:'Reabrir',exact:true}).click();await page.waitForFunction(()=>state.deadlines[0].status==='pending');
 await page.locator('#drawer-content').getByRole('button',{name:'Arquivar prazo',exact:true}).click();await page.waitForFunction(()=>state.deadlines[0].archived);
 await page.getByText('Arquivados (1)',{exact:true}).click();await page.getByRole('button',{name:'Restaurar prazo',exact:true}).click();await page.waitForFunction(()=>!state.deadlines[0].archived);
 assert.equal(await page.evaluate(()=>state.deadlines[0].date),'2026-12-31');assert.equal(await page.evaluate(()=>Backup.parseBackup(JSON.stringify(Backup.buildExport())).data.deadlines[0].date),'2026-12-31');
});

test('REGRESSÃO: Escape fecha apenas o calendário inline e mantém o formulário e o foco',async()=>{
 await page.evaluate(()=>openDeadlineModal(null));await page.locator('#dl-title').fill('Título preservado');
 const opener=page.getByRole('button',{name:/Abrir calendário: Data/}).first();await opener.click();await page.locator('.civil-inline [data-date]').first().focus();await page.keyboard.press('Escape');
 assert.equal(await page.locator('.civil-inline').count(),0);assert.equal(await page.locator('#dl-title').isVisible(),true);assert.equal(await page.locator('#dl-title').inputValue(),'Título preservado');assert.equal(await opener.evaluate(el=>document.activeElement===el),true);
});
