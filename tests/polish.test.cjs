const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { start, open, seed } = require('./support.cjs');

test('v8.1 · enquadramento e ações principais por área', {timeout:120000}, async () => {
  const engine = process.env.BROWSER || 'chromium';
  const runtime = await start(engine);
  const out = path.resolve('test-results/polish');
  const measurements = [];
  await fs.mkdir(out, {recursive:true});
  try {
    const {page, context} = await open(runtime);
    await page.clock.setFixedTime(new Date('2026-11-20T17:00:00Z'));
    await seed(page);
    await page.evaluate(async () => {
      for(const [disciplineId,topicId,minutes,ago] of [
        ['portugues','crase',40,0],['matematica','fracoes',55,1],
        ['portugues','pontuacao',25,3],['matematica','fracoes',35,5]
      ]){
        await SessionCommands.create({disciplineId,topicId,minutes,date:addDaysISO(todayISO(),-ago)});
      }
      await refresh();
    });
    for(const [width,height] of [[1440,900],[1366,768],[1280,720],[390,844]]){
      await page.setViewportSize({width,height});
      const measure = async (view, selector) => {
        const data = await page.locator(selector).first().evaluate(el => {
          const r = el.getBoundingClientRect();
          const doc = document.scrollingElement;
          const body = document.querySelector('.view.active .view-body');
          return {pageHeight:doc.scrollHeight, pageWidth:doc.scrollWidth, top:r.top, bottom:r.bottom,
            actionHeight:r.height, inside:body.scrollHeight > body.clientHeight + 1};
        });
        measurements.push({engine,width,height,view,...data});
        if(engine === 'chromium' && width === 1366 && view === 'relatorio'){
          const download = page.waitForEvent('download');
          await page.getByRole('button',{name:'Baixar PNG'}).click();
          await (await download).saveAs(path.join(out,'relatorio-exportado.png'));
        }
        if(width === 1366 || width === 390) await page.screenshot({path:path.join(out,view+'-'+width+'.png'),animations:'disabled'});
      };
      for(const [view, selector] of [
        ['today','.today-act .tf-actions button'],['disciplines','#dpanel .panel-bar button[aria-haspopup]'],
        ['plan','#plan-body button'],['reviews','.review-agenda-row-actions button'],['analytics','#results-period'],
        ['history','#hf-search'],['help','#help-body input'],['data','#data-body .tf-actions button'],
        ['settings','#spanel button']
      ]){
        await page.evaluate(v => setView(v),view);
        await measure(view,selector);
      }
      await page.evaluate(() => openRegisterModal({mode:'timer'}));
      await measure('estudar','#modal-actions .primary');
      await page.evaluate(() => modalCloser());
      await page.evaluate(() => openRegisterModal());
      await measure('registro','#modal-actions .primary');
      await page.evaluate(() => modalCloser());
      await page.evaluate(() => openVisualReport({periodPreset:'7d'}));
      await page.locator('#report-preview').waitFor({state:'visible'});
      await measure('relatorio','#modal-actions .primary');
      await page.evaluate(() => modalCloser());
      await page.evaluate(async () => {await startTimer('portugues',['crase'],[]); FocusMode.enter();});
      await page.locator('#toasts .toast').first().waitFor({state:'hidden'});
      await measure('foco','#focus-actions button');
      await page.locator('#focus-presentation').click();
      await measure('apresentacao','#focus-exit');
      await page.evaluate(() => {FocusMode.exit(); TimerService.clear(); renderTimerBar();});
    }
    if(engine === 'chromium'){
      const names = ['estudar-1366','reviews-1366','analytics-1366','history-1366','foco-1366','relatorio-1366'];
      const frames = await Promise.all(names.map(async name =>
        'data:image/png;base64,' + (await fs.readFile(path.join(out,name+'.png'))).toString('base64')));
      const jpeg = await page.evaluate(async frames => {
        const canvas = document.createElement('canvas');
        canvas.width = 1440;
        canvas.height = 1222;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#586566';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(const [index,src] of frames.entries()){
          const img = new Image();
          img.src = src;
          await img.decode();
          ctx.drawImage(img,(index % 2)*722,Math.floor(index/2)*408,718,404);
        }
        return canvas.toDataURL('image/jpeg',.86).split(',')[1];
      },frames);
      await fs.writeFile(path.join(out,'panorama.jpg'),Buffer.from(jpeg,'base64'));
    }
    await context.close();
  } finally {
    await fs.writeFile(path.join(out,'layout.json'),JSON.stringify(measurements,null,2));
    await runtime.close();
  }
  const failures = measurements.filter(m => m.pageWidth > m.width + 1 || m.actionHeight <= 0 ||
    (m.width >= 861 && (m.pageHeight > m.height + 1 || m.top < -1 || m.bottom > m.height + 1)));
  assert.deepEqual(failures,[]);
});

test('v8.1 · exemplo contextual e assinatura privada por escolha', async () => {
  const runtime = await start(process.env.BROWSER || 'chromium');
  try {
    const {page,context} = await open(runtime);
    await seed(page);
    await page.evaluate(() => setView('reviews'));
    await page.locator('#screen-help').click();
    assert.match(await page.locator('#drawer-content .guide-example').innerText(),/Pontuação|crase|Frações/);
    await page.locator('#drawer-close').click();
    await page.evaluate(() => openVisualReport());
    await page.getByText('Blocos e privacidade',{exact:true}).click();
    const signed = page.getByRole('checkbox',{name:'Incluir minha assinatura'});
    await signed.check();
    await page.getByLabel('Texto da assinatura').fill('Caderno de Ana');
    await page.waitForFunction(() => document.querySelector('#report-preview').getAttribute('aria-label').includes('Caderno de Ana'));
    await signed.uncheck();
    await page.waitForFunction(() => !document.querySelector('#report-preview').getAttribute('aria-label').includes('Caderno de Ana'));
    await context.close();
  } finally {
    await runtime.close();
  }
});

test('v8.1 · agenda extensa, ajuda completa e exploração após redesenho', async () => {
  const runtime = await start(process.env.BROWSER || 'chromium');
  try {
    const {page,context} = await open(runtime, {viewport:{width:1280,height:720}});
    await seed(page);
    await page.evaluate(async () => {
      const topics = Array.from({length:45}, (_,i) => newTopic('portugues','Leitura '+(i+1)));
      await DB.transactional(['topics'],api => topics.forEach(t => api.put('topics',t)));
      state.settings.helpMode = 'full';
      await saveSettings();
      await SessionCommands.create({disciplineId:'portugues',minutes:30,date:todayISO()});
      await refresh();
      setView('reviews');
    });
    const agenda = page.locator('.review-agenda');
    await agenda.getByRole('checkbox',{name:/Selecionar os assuntos encontrados/}).check();
    const batch = agenda.getByRole('button',{name:'Agendar seleção'});
    assert.equal(await batch.isEnabled(),true);
    await agenda.getByRole('button',{name:'Próxima'}).click();
    assert.ok(await agenda.locator('.review-agenda-topic input:checked').count() > 0);
    const dims = await page.evaluate(() => {
      const list = document.querySelector('.review-agenda-list');
      return [document.scrollingElement.scrollHeight <= innerHeight+1,list.scrollHeight > list.clientHeight];
    });
    assert.deepEqual(dims,[true,true]);
    await page.evaluate(() => applyAnalyticsQuery({periodPreset:'30d',focus:'overview'}));
    assert.equal(await page.locator('.insights-timeline').isVisible(),true);
    await page.getByText('Filtrar conteúdos',{exact:true}).click();
    await page.waitForFunction(() => ui.resultsFiltersOpen);
    await page.evaluate(() => render());
    assert.equal(await page.locator('.results-filter-more').getAttribute('open') !== null,true);
    await context.close();
  } finally {
    await runtime.close();
  }
});
