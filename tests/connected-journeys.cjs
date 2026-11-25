const fs=require('node:fs/promises');const path=require('node:path');const {start,open,seed}=require('./support.cjs');
(async()=>{const runtime=await start();try{const{page,context}=await open(runtime);page.setDefaultTimeout(10000);await seed(page);await page.clock.setFixedTime(new Date('2026-12-15T15:00:00Z'));
 const version=await page.evaluate(()=>APP_VERSION),modern=version==='8.2.0';const results={version,method:'Interações semânticas executadas pelo Playwright, a partir de Resultados aberto. Seleção nativa conta como uma interação; não é contagem de cliques físicos nem estudo de usabilidade.'};
 await page.evaluate(async()=>{await SessionCommands.create({disciplineId:'matematica',date:todayISO(),minutes:30});await SessionCommands.create({disciplineId:'matematica',date:'2026-12-05',minutes:20});await refresh();setView('analytics');});
 results.headerControls=await page.locator(modern?'.insights-toolbar button:visible,.insights-toolbar select:visible':'.an-head button:visible,.an-head select:visible').count();
 let actions=0;const step=async fn=>{await fn();actions++;};
 if(modern)await step(()=>page.locator('#results-discipline').selectOption('matematica'));
 else{await step(()=>page.getByRole('button',{name:'Alterar análise',exact:true}).click());await step(()=>page.locator('[data-k="scope-discipline"]').click());await step(()=>page.getByRole('button',{name:'Gerar análise',exact:true}).click());}
 if(!(await page.evaluate(()=>ui.analyticsQuery.scopeIds.includes('matematica'))))throw Error('Filtro incorreto');results.disciplineFilter=actions;
 await page.evaluate(()=>applyAnalyticsQuery({periodPreset:'30d'}));actions=0;
 if(modern)await step(()=>page.locator('#results-period').selectOption('custom'));
 else{await step(()=>page.getByRole('radio',{name:'Personalizado…',exact:true}).click());await step(()=>page.locator('[data-k="period-custom"]').click());}
 await step(()=>page.locator('[data-date="2026-12-01"]').click());await step(()=>page.locator('[data-date="2026-12-10"]').click());
 await step(()=>modern?page.locator('#modal-actions').getByRole('button',{name:'Aplicar período',exact:true}).click():page.getByRole('button',{name:'Gerar análise',exact:true}).click());
 if((await page.evaluate(()=>ui.analyticsQuery.startDate))!=='2026-12-01')throw Error('Período incorreto');results.customPeriod=actions;
 actions=0;await step(()=>page.getByRole('button',{name:'Ver registros',exact:true}).click());results.history=actions;await page.goBack();
 actions=0;await step(()=>page.getByRole('button',{name:'Criar relatório',exact:true}).click());await page.locator('#report-preview').waitFor();results.report=actions;await page.evaluate(()=>modalCloser());
 await page.evaluate(async modern=>{const topics=Array.from({length:10},(_,i)=>({...newTopic('portugues','Item '+i),id:'journey-t'+i}));await DB.putMany('topics',topics);await loadAll();if(modern)await Learning.save('contentBlocks',{id:'journey-block',name:'Conjunto de dez itens',disciplineId:'portugues',topicIds:topics.map(t=>t.id),courseIds:[]});openRegisterModal({disciplineId:'portugues'});},modern);
 actions=0;
 if(modern)await step(()=>page.locator('#rm-block').selectOption('journey-block'));
 else{await step(()=>page.locator('#rm-topics').click());for(let i=0;i<10;i++)await step(()=>page.locator('#rm-topics-list').getByRole('option',{name:new RegExp('^Item '+i+' ')}).click());await step(()=>page.getByRole('button',{name:'Pronto',exact:true}).click());}
 results.selectTenTopics=actions;results.selectedTopics=await page.locator('.tchip').count();if(results.selectedTopics!==10)throw Error('Seleção incorreta');
 const out=process.env.AUDIT_OUTPUT||path.resolve('test-results/journeys');await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'journeys.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));await context.close();
}finally{await runtime.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
