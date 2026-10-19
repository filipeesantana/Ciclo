const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, firefox, webkit } = require('playwright');
const root = process.env.CICLO_SOURCE_ROOT || path.resolve(__dirname, '..');
async function start(engine = 'chromium') {
  const server = http.createServer((req, res) => {
    const file = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, body) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader('Content-Type', ({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[path.extname(file)] || 'application/octet-stream');
      res.end(body);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browserType = {chromium, firefox, webkit}[engine];
  const executablePath = engine === 'chromium' ? process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined) : undefined;
  let browser;
  try { browser = await browserType.launch({ executablePath, headless:true, args:engine === 'chromium' ? ['--no-sandbox'] : [] }); }
  catch (e) { await new Promise(resolve=>server.close(resolve)); throw e; }
  const url = `http://127.0.0.1:${server.address().port}`;
  return { browser, url, async close(){ await browser.close(); await new Promise(resolve=>server.close(resolve)); } };
}
async function open(runtime, options = {}) {
  const context = await runtime.browser.newContext({ viewport:{width:1440,height:1000}, timezoneId:'America/Sao_Paulo', reducedMotion:'reduce', ...options });
  const page = await context.newPage();
  await page.goto(runtime.url);
  await page.waitForFunction(()=>state.ready);
  return {context,page};
}
async function seed(page) {
  return page.evaluate(async()=>{
    if(modalCloser) modalCloser();
    const a={...newArea('Escola'),id:'escola'};
    const d={...newDiscipline('Português','escola'),id:'portugues'};
    const e={...newDiscipline('Matemática'),id:'matematica'};
    const t={...newTopic(d.id,'Pontuação'),id:'pontuacao'};
    const u={...newTopic(d.id,'Uso da crase'),id:'crase'};
    const v={...newTopic(e.id,'Frações'),id:'fracoes'};
    await DB.transactional(['areas','disciplines','topics','settings'],api=>{
      api.put('areas',a);[d,e].forEach(x=>api.put('disciplines',x));[t,u,v].forEach(x=>api.put('topics',x));
      api.put('settings',{key:'settings',value:{...DEFAULT_SETTINGS,seenWhatsNew:APP_VERSION,helpMode:'off',reduceMotion:true}});
    });
    await setMeta('onboardingCompleted',true);await refresh();
    return {d:d.id,e:e.id,t:t.id,u:u.id,v:v.id};
  });
}
module.exports={start,open,seed,root};
