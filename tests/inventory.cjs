// Inventário estático reproduzível. Expressões dinâmicas ficam identificadas;
// a matriz funcional documenta seus contratos e a cobertura real de testes.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const acorn=require('acorn');
const {root}=require('./support.cjs');
const esc=s=>String(s??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ').replace(/`/g,'′');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const content=fs.readFileSync(path.join(root,'content.js'),'utf8');
const ast=acorn.parse(app,{ecmaVersion:'latest',locations:true});
const contentAst=acorn.parse(content,{ecmaVersion:'latest',locations:true});
const controls=[],layers=[],functions=[];
function value(node){if(!node)return '';return node.type==='Literal'?node.value:'dinâmico: '+app.slice(node.start,node.end).replace(/\s+/g,' ').slice(0,100);}
function walk(node,owner='global'){
 if(!node||typeof node!=='object')return;
 if(node.type==='FunctionDeclaration'){owner=node.id.name;functions.push({name:owner,line:node.loc.start.line,lines:node.loc.end.line-node.loc.start.line+1});}
 if(node.type==='VariableDeclarator'&&node.init?.type==='ObjectExpression') owner=node.id.name;
 if(node.type==='CallExpression'&&node.callee.name==='h'){
  const tag=node.arguments[0]?.value;
  if(['button','input','select','textarea','details','form'].includes(tag)){
   const attrs=Object.fromEntries((node.arguments[1]?.properties||[]).map(p=>[p.key.name||p.key.value,value(p.value)]));
   controls.push({owner,tag,line:node.loc.start.line,id:attrs.id||'',label:attrs['aria-label']||attrs.text||attrs.placeholder||value(node.arguments[2]),type:attrs.type||attrs.role||'',range:attrs.min||attrs.max||''});
  }
 }
 if(node.type==='CallExpression'&&['openModal','Drawer.open','close.push'].includes(app.slice(node.callee.start,node.callee.end)))layers.push({owner,kind:app.slice(node.callee.start,node.callee.end),line:node.loc.start.line});
 for(const [k,v]of Object.entries(node)){if(['loc','start','end'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,owner));else if(v&&typeof v==='object')walk(v,owner);}
}
walk(ast);
const catalog=vm.runInNewContext(content+'\n({articles:HELP_ARTICLES,sections:HELP_SECTIONS,faq:HELP_FAQ,glossary:HELP_GLOSSARY,prompts:AI_PROMPTS,columns:AI_CSV_COLUMNS})');
const articleLines=new Map();
function locate(node){if(!node||typeof node!=='object')return;if(node.type==='ObjectExpression'){const p=node.properties.find(p=>p.key?.name==='id');if(p?.value?.type==='Literal')articleLines.set(p.value.value,node.loc.start.line);}for(const [k,v]of Object.entries(node)){if(k==='loc')continue;if(Array.isArray(v))v.forEach(locate);else if(v&&typeof v==='object')locate(v);}}
locate(contentAst);
const actionNode=ast.body.find(n=>n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id.name==='HELP_ACTIONS'));
const actions=new Set(actionNode.declarations[0].init.properties.map(p=>p.key.name||p.key.value));
const ids=new Set(catalog.articles.map(a=>a.id)),broken=[];
for(const a of catalog.articles){
 for(const id of a.related||[])if(!ids.has(id))broken.push(`${a.id}: artigo ${id}`);
 for(const action of [...(a.actions||[]),...(a.cta?[a.cta]:[])])if(!actions.has(action.action))broken.push(`${a.id}: ação ${action.action}`);
 for(const [,term]of JSON.stringify(a).matchAll(/\[\[([a-zA-Z]+)(?:\|[^\]]+)?\]\]/g))if(!catalog.glossary[term])broken.push(`${a.id}: glossário ${term}`);
}
for(const [term,g]of Object.entries(catalog.glossary))if(g.article&&!ids.has(g.article))broken.push(`glossário ${term}: artigo ${g.article}`);
const dest=path.join(root,'audit');fs.mkdirSync(dest,{recursive:true});
let md=`# Inventário dos controles e camadas\n\nGerado por \`npm run audit:inventory\`. Fonte: app.js. ${controls.length} construções de controles, ${layers.length} construções de camadas e ${functions.length} funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).\n\n| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |\n|---|---|---|---|---|\n`;
for(const c of controls)md+=`| ${esc(c.owner)} | ${c.tag} ${esc(c.type)} | ${esc(c.id)} | ${esc(c.label)} | [${c.line}](../app.js#L${c.line}) |\n`;
md+='\n## Camadas\n\n| Contexto | Abertura | Linha |\n|---|---|---|\n';
for(const l of layers)md+=`| ${esc(l.owner)} | ${l.kind} | [${l.line}](../app.js#L${l.line}) |\n`;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');let fixed=0;
md+='\n## Controles fixos em index.html\n\n| Controle | ID | Nome / texto | Linha |\n|---|---|---|---|\n';
for(const match of html.matchAll(/<(button|input|select|textarea|details)\b([^>]*)>/g)){
 const attrs=Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
 const end=html.indexOf('</'+match[1]+'>',match.index),label=end>=0?html.slice(match.index+match[0].length,end).replace(/<[^>]*>/g,'').trim():'';
 const line=html.slice(0,match.index).split('\n').length;fixed++;
 md+=`| ${match[1]} | ${esc(attrs.id)} | ${esc(attrs['aria-label']||label||attrs.placeholder)} | [${line}](../index.html#L${line}) |\n`;
}
fs.writeFileSync(path.join(dest,'INVENTARIO-CONTROLES.md'),md);
md=`# Conteúdo e destinos\n\nInventário dos ${catalog.articles.length} artigos, ${catalog.faq.length} perguntas frequentes, ${Object.keys(catalog.glossary).length} termos e ${catalog.prompts.length} prompts. Links, ações e glossário conferidos automaticamente; abertura dos artigos verificada em navegador. Isso não substitui validação científica ou pesquisa com estudantes.\n\n| Artigo | Local | Resposta curta / propósito | Fonte |\n|---|---|---|---|\n`;
for(const a of catalog.articles)md+=`| ${esc(a.title)} | ${a.section} / ${a.group} | ${esc(a.quick||a.oneLine||a.summary)} | [${a.id}](../content.js#L${articleLines.get(a.id)}) |\n`;
md+='\n## Perguntas frequentes\n\n';for(const f of catalog.faq)md+=`- ${esc(f.q)} → ${esc(f.article||f.id)}\n`;
md+='\n## Prompts e colunas\n\n';for(const p of catalog.prompts)md+=`- ${esc(p.title||p.label||p.id)}: ${esc(p.desc||p.description||p.ask||'prompt local copiável')}.\n`;
md+='\nCSV completo: '+catalog.columns.map(c=>'`'+c.col+'`').join(', ')+'.\n';
md+='\n## Integridade dos destinos\n\n'+(broken.length?broken.map(x=>'- '+x).join('\n'):'Nenhum destino ausente em related, ações declaradas, referências do glossário ou termos usados nos artigos.')+'\n';
fs.writeFileSync(path.join(dest,'CONTEUDO.md'),md);
console.log(JSON.stringify({controls:controls.length,fixedControls:fixed,layers:layers.length,functions:functions.length,articles:catalog.articles.length,broken},null,2));
if(broken.length)process.exitCode=1;
