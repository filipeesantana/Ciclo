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
    await seed(page);
    await page.evaluate(async () => {
      await SessionCommands.create({disciplineId:'portugues',topicId:'crase',minutes:40,date:todayISO()});
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
        if(width === 1366 || width === 390) await page.screenshot({path:path.join(out,view+'-'+width+'.png'),animations:'disabled'});
      };
      for(const [view, selector] of [
        ['today','.today-act .tf-actions button'],['disciplines','#dtab-disciplines'],
        ['plan','#plan-body button'],['reviews','#agenda-search'],['analytics','.an-head-periods button'],
        ['history','#hf-search'],['help','#help-body input'],['data','#data-body .tf-actions button'],
        ['settings','#stab-appearance']
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
      await page.evaluate(() => openVisualReport({periodPreset:'hoje'}));
      await measure('relatorio','#modal-actions .primary');
      await page.evaluate(() => modalCloser());
      await page.evaluate(async () => {await startTimer('portugues',['crase'],[]); FocusMode.enter();});
      await measure('foco','#focus-actions button');
      await page.locator('#focus-presentation').click();
      await measure('apresentacao','#focus-exit');
      await page.evaluate(() => {FocusMode.exit(); TimerService.clear(); renderTimerBar();});
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
