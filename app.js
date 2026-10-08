/* =========================================================================
   CICLO — v6.6.0 · Visual & Interaction Revival
   (antes chamado "Diário de Estudos")
   Aplicação local-first. Sem backend, sem rede, sem dependências externas.

   v6.5 — integridade, confiabilidade e consistência. As regras que decidem o
   que é gravado ficam em poucos lugares, todos com nome:
     TimeRules          contas de tempo puras (intervalo, descanso, minutos)
     IntegrityValidator validação estrutural única (restauração e diagnóstico)
     TopicReconciler    estado derivado do tópico a partir do histórico
     SessionCommands    criar / finalizar cronômetro / editar / mover / excluir
     DataSync           aviso entre abas de que os dados mudaram

   Seções:
     CONSTANTS · UTILITIES · DATE HELPERS · DATABASE · MIGRATION
     DOMAIN MODELS · PRIORITY ENGINE · DEADLINE ENGINE
     PLAN ENGINE · REVIEW ENGINE · RECOMMENDATION ENGINE
     ANALYTICS ENGINE · TIMER SERVICE · BACKUP · UI STATE · RENDERING
     NAVEGAÇÃO & BUSCA CONTEXTUAL (v6.2: histórico, voltar, buscar, ordenar)
     REGISTRO COM TÓPICO (v6.3: editor canônico em subtela, virada do dia)
     FLUXO DE ESTUDO (v6.4: estudar agora / já estudei, descansos, constância;
                      v6.4.1: campo de horário próprio, registro em duas colunas)
     CONFIABILIDADE (v6.5: comandos atômicos, reconciliação, sincronia entre abas)
     HELP ENGINE (busca, rotas, glossário) · EVENT HANDLERS · INITIALIZATION
   ========================================================================= */
'use strict';

/* =========================================================================
   CONSTANTS
   ========================================================================= */
const APP_VERSION = '6.6.0';
const APP_SCHEMA_VERSION = 6;          // formato LÓGICO dos dados. A v5.2 mudou o conteúdo
                                       // de objetos existentes: tópicos passam a ter
                                       // `priority` (1–5) no lugar de `importance`, e prazos
                                       // ganham tipo, status, data de início, orientações e
                                       // anotações. A v5.2.1, a v5.3, a v6.0 e a v6.1
                                       // (interface e linguagem) não criam campo persistente
                                       // novo, por isso o formato continua em 5. A v6.1 passa
                                       // a usar `archived` das áreas, campo que já existia. A v6.2
                                       // (navegação e busca) também não toca no formato:
                                       // busca, ordenação e rolagem vivem na memória, no
                                       // history.state e no sessionStorage. A v6 guarda só a
                                       // última consulta de Análises em `meta`, que é uma
                                       // conveniência de interface (fora do backup).
                                       // A v6.3 também não muda o formato: a duração
                                       // sugerida do cronômetro é um campo opcional no
                                       // localStorage do cronômetro, e `lastReviewMethod`
                                       // (já gravado antes) passa a voltar na importação.
                                       // A v6.4 muda o formato (5 → 6): cada estudo ganha
                                       // `breaks` (os descansos dele) e `minutes` passa a
                                       // significar, sem ambiguidade, TEMPO DE ESTUDO —
                                       // nunca o tempo com descanso. Estudos antigos recebem
                                       // `breaks: []` e os minutos deles não mudam. Créditos
                                       // deixaram de existir no produto: os campos antigos
                                       // (`credits`, `minutesPerCredit`, `legacyWeeklyMinutes`)
                                       // não são mais lidos nem gravados em registros novos.
                                       // A v6.4.1 é só interface (campo de horário, composição
                                       // do registro, tipografia): nenhum campo persistente
                                       // novo, por isso o formato continua em 6.
                                       // A v6.5 (confiabilidade) também continua em 6: a
                                       // identidade do cronômetro (`runId`) vive só no
                                       // localStorage do cronômetro e vira o `id` do estudo —
                                       // um campo que sempre existiu. Nenhum registro ganha
                                       // campo novo; nenhuma migração de dados é necessária.

/* Identificadores técnicos LEGADOS. O produto passou a se chamar "Ciclo" na v5.1,
   mas estes nomes ficam como estão: renomeá-los faria o navegador procurar um
   banco/chaves que não existem e o usuário "perderia" os dados já gravados. */
const IDB_NAME = 'diarioEstudosDB';
const IDB_VERSION = 1;                 // schema FÍSICO do IndexedDB: v4 e v5.2 só alteram
                                       // campos dentro dos objetos, nenhuma store ou
                                       // índice novo — por isso continua 1. O prazo mantém
                                       // `date` como data do prazo (há um índice nesse campo).
const V2_LS_KEY = 'diarioEstudos:v1';  // chave usada pela V2 (preservada, nunca apagada)
const TIMER_LS_KEY = 'diarioEstudos:v3:timer';
const THEME_LS_KEY = 'diarioEstudos:v3:theme';

const STORES = ['meta','areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines','settings'];

/* v6.4 — `hint` e `icon` são só apresentação; os valores (`v`) não mudaram.
   Descanso NÃO é um tipo de estudo: ele vive em `session.breaks`. */
const SESSION_TYPES = [
  { v:'teoria',      label:'Teoria',      icon:'i-t-theory',   hint:'Ler, assistir, entender.' },
  { v:'exercicios',  label:'Exercícios',  icon:'i-t-exercise', hint:'Questões e problemas.' },
  { v:'laboratorio', label:'Laboratório', icon:'i-t-lab',      hint:'Prática real ou simulada.' },
  { v:'revisao',     label:'Revisão',     icon:'i-review',     hint:'Rever o que já estudou.' },
  { v:'projeto',     label:'Projeto',     icon:'i-t-project',  hint:'Construir algo.' },
  { v:'outro',       label:'Outro',       icon:'i-t-other',    hint:'Qualquer outro estudo.' }
];

/* v6.4 — limites do registro por horário e dos descansos. */
const LONG_STUDY_CONFIRM_MIN = 480;    // acima de 8h o Ciclo pergunta antes de registrar (não bloqueia)
const MAX_BREAKS_PER_STUDY = 60;       // teto defensivo para dados importados

const DIFFICULTIES = [
  { v:1, label:'Muito fácil',  color:'#4F9686' },
  { v:2, label:'Fácil',        color:'#83AE87' },
  { v:3, label:'Mediano',      color:'#C6A23E' },
  { v:4, label:'Difícil',      color:'#C78050' },
  { v:5, label:'Muito difícil',color:'#B9493F' }
];

const REVIEW_OUTCOMES = [
  { v:'forgot',      label:'Esqueci' },
  { v:'hard',        label:'Lembrei com dificuldade' },
  { v:'remembered',  label:'Lembrei bem' },
  { v:'mastered',    label:'Dominei' }
];

/* =========================================================================
   v5.2 — ESCALA UNIVERSAL DE PRIORIDADE (1–5)
   A mesma pergunta em todo o Ciclo: "quanto isso importa para mim agora?".
   Vale para Disciplina, Tópico e Prazo. Área de Estudo não tem prioridade:
   ela só organiza.
   ========================================================================= */
const PRIORITY_DEFAULT = 3;               // v6.1: rótulo do 3 passa de "Mediana" para "Média" (só texto)
const PRIORITY_LEVELS = [
  { v:1, label:'Muito baixa', hint:'Este item merece pouca atenção no momento.' },
  { v:2, label:'Baixa',       hint:'Pode receber menos atenção que o padrão.' },
  { v:3, label:'Média',       hint:'Prioridade padrão.' },
  { v:4, label:'Alta',        hint:'Merece atenção frequente.' },
  { v:5, label:'Muito alta',  hint:'Está entre seus principais focos.' }
];
const PRIORITY_LABELS = { 1:'Muito baixa', 2:'Baixa', 3:'Média', 4:'Alta', 5:'Muito alta' };

/* Explicação de cada nível ajustada ao que está sendo priorizado. */
const PRIORITY_CONTEXT_HINTS = {
  discipline: {
    1:'Recebe pouco espaço na sua semana por enquanto.',
    2:'Recebe um pouco menos de tempo que o padrão.',
    3:'Prioridade padrão: tempo proporcional ao das outras disciplinas.',
    4:'Merece atenção frequente e recebe mais tempo no planejamento.',
    5:'É um dos seus focos principais e recebe atenção acima do normal.'
  },
  topic: {
    1:'Dentro da disciplina, este tópico pode esperar.',
    2:'Pode receber menos atenção que outros tópicos da disciplina.',
    3:'Prioridade padrão dentro da disciplina.',
    4:'Merece atenção frequente: revisões um pouco mais próximas.',
    5:'Está entre os principais focos da disciplina: revisões mais frequentes.'
  },
  deadline: {
    1:'Este prazo influencia pouco as suas recomendações.',
    2:'Influencia as recomendações um pouco menos que o padrão.',
    3:'Influência padrão, que cresce conforme a data se aproxima.',
    4:'Influencia bastante as recomendações conforme a data se aproxima.',
    5:'É um dos seus prazos principais e pesa bastante nas recomendações.'
  }
};

/* Área de Estudo — rótulos usados na interface. */
const AREA_TERM = 'Área de Estudo';
const NO_AREA_LABEL = 'Sem área';

/* =========================================================================
   v5.2 — PRAZOS
   `date` continua sendo a data do prazo (campo canônico e indexado).
   ========================================================================= */
const DEADLINE_TYPES = [
  { v:'exam',       label:'Prova',    dateLabel:'Data da prova',   dueWord:'Prova' },
  { v:'assignment', label:'Trabalho', dateLabel:'Data de entrega', dueWord:'Entrega' },
  { v:'project',    label:'Projeto',  dateLabel:'Data de entrega', dueWord:'Entrega' },
  { v:'task',       label:'Tarefa',   dateLabel:'Data do prazo',   dueWord:'Prazo' },
  { v:'demand',     label:'Demanda',  dateLabel:'Data do prazo',   dueWord:'Prazo' },
  { v:'delivery',   label:'Entrega',  dateLabel:'Data da entrega', dueWord:'Entrega' },
  { v:'other',      label:'Outro',    dateLabel:'Data do prazo',   dueWord:'Prazo' }
];
const DEADLINE_STATUSES = [
  { v:'pending',     label:'Pendente' },
  { v:'in_progress', label:'Em andamento' },
  { v:'completed',   label:'Concluído' }
];
function deadlineTypeInfo(v){ return DEADLINE_TYPES.find(t => t.v === v) || DEADLINE_TYPES[DEADLINE_TYPES.length - 1]; }
function deadlineStatusLabel(v){ const x = DEADLINE_STATUSES.find(t => t.v === v); return x ? x.label : 'Pendente'; }

/* Conversão das escalas antigas para a escala 1–5.
   Tópico: low/normal/high · Prazo: normal/alta (v3–v5.1).
   Os extremos 1 e 5 ficam livres para o usuário escolher depois. */
const LEGACY_IMPORTANCE_TO_PRIORITY = { low:2, baixa:2, normal:3, high:4, alta:4 };

/* v5 — métricas em duas camadas: nome natural + termo canônico.
   A interface mostra o natural; o técnico aparece como complemento. */
const METRIC_WORDS = {
  adherence: { title:'Plano cumprido',        canonical:'aderência ao plano' },
  coverage:  { title:'Conteúdo estudado',     canonical:'cobertura' },
  mastery:   { title:'Conteúdos consolidados',canonical:'domínio' }
};

/* ---------- v4: natureza do conteúdo da disciplina ---------- */
const CONTENT_NATURES = [
  { v:'mixed',           label:'Misto',                  hint:'Um pouco de tudo. É o padrão.' },
  { v:'conceptual',      label:'Conceitual',             hint:'Teorias, definições, processos.' },
  { v:'memorization',    label:'Memorização',            hint:'Listas, termos, datas, vocabulário.' },
  { v:'problem_solving', label:'Resolução de problemas', hint:'Cálculo, lógica, questões.' },
  { v:'practical',       label:'Prática',                hint:'Laboratório, execução, habilidade manual.' }
];
function contentNatureLabel(v){ const x = CONTENT_NATURES.find(n => n.v === v); return x ? x.label : 'Misto'; }

/* ---------- v4: QUANDO revisar (estratégia de espaçamento) ---------- */
const REVIEW_STRATEGIES = [
  { v:'adaptive',   label:'Adaptativa',      short:'O tempo até a próxima revisão acompanha o seu resultado. Recomendada.' },
  { v:'fixed',      label:'Ciclo programado', short:'Intervalos previsíveis: 1, 3, 7, 14, 30, 60 dias.' },
  { v:'intensive',  label:'Intensiva',        short:'Revisões mais frequentes. Para provas e prazos.' },
  { v:'maintenance',label:'Manutenção',       short:'Intervalos longos, para conteúdo já consolidado.' }
];
function strategyLabel(v){ const x = REVIEW_STRATEGIES.find(s2 => s2.v === v); return x ? x.label : 'Adaptativa'; }

/* Ciclos fixos, em dias. O resultado da revisão move o passo dentro do ciclo. */
const CYCLE_STEPS = {
  fixed:       [1, 3, 7, 14, 30, 60],
  intensive:   [1, 2, 3, 5, 7, 10, 14],
  maintenance: [14, 30, 60, 90, 120, 180]
};

/* ---------- v4: COMO revisar (método) ---------- */
const REVIEW_METHODS = [
  { v:'auto',           label:'Automático' },
  { v:'active_recall',  label:'Recordação ativa' },
  { v:'exercises',      label:'Exercícios' },
  { v:'explanation',    label:'Explicação' },
  { v:'memory_summary', label:'Resumo de memória' },
  { v:'flashcards',     label:'Flashcards' },
  { v:'interleaving',   label:'Prática intercalada' },
  { v:'free',           label:'Revisão livre' }
];
function methodLabel(v){ const x = REVIEW_METHODS.find(m => m.v === v); return x ? x.label : 'Automático'; }
const CONCRETE_METHODS = REVIEW_METHODS.filter(m => m.v !== 'auto').map(m => m.v);

/* Método sugerido por natureza do conteúdo. Simples e explicável de propósito. */
const AUTO_METHOD_BY_NATURE = {
  conceptual:      ['active_recall', 'explanation'],
  memorization:    ['active_recall', 'flashcards'],
  problem_solving: ['exercises', 'interleaving'],
  practical:       ['exercises', 'active_recall'],
  mixed:           ['active_recall']
};

/* Tempo estimado por método, em minutos — base para montar a sessão de revisão. */
const METHOD_MINUTES = {
  active_recall: 10, exercises: 20, explanation: 10,
  memory_summary: 15, flashcards: 10, interleaving: 20, free: 15
};

/* Pesos da fila inteligente de revisão. Centralizados para serem auditáveis. */
const REVIEW_QUEUE_WEIGHTS = {
  OVERDUE_BASE: 30,      // só por estar vencida
  OVERDUE_PER_DAY: 3,    // por dia de atraso (limitado)
  OVERDUE_DAY_CAP: 10,   // teto de dias contados
  DUE_TODAY: 18,         // prevista para hoje
  PRIORITY: 14,          // × atenção efetiva (prioridade do tópico + disciplina), −1..+1
  LOW_MASTERY: 16,       // domínio baixo
  BAD_LAST_RESULT: 12,   // último resultado foi ruim
  FORGET_RATE: 10,       // histórico de esquecimento
  DEADLINE: 18,          // × urgência do prazo ligado ao tópico/disciplina (0..1)
  STALE: 6               // muito tempo sem revisar
};

/* Pesos do planejador automático: prioridade → peso relativo na distribuição. */
/* v5.2 — pesos revistos. Antes 1:2:4:7:10 (P5 recebia 10× o tempo de P1).
   Agora cada nível acima multiplica ~1,5×: com 300 min e disciplinas P1/P3/P5
   a divisão fica ≈ 35/90/175 min — diferença clara, sem distorção. */
const PLANNER = {
  PRIORITY_WEIGHT: { 1:1, 2:1.6, 3:2.5, 4:3.6, 5:5 },
  DEADLINE_BOOST: 0.6,              // prazo urgente multiplica o peso por até 1 + 0,6
  ROUND_TO: 5,                      // blocos de 5 minutos
  MIN_BLOCK: 10                     // menor bloco sugerido de estudo
};

/* Pesos do motor de recomendação (determinístico e documentado). */
const RECO = {
  W_DEFICIT: 35,
  W_PRIORITY: 20,
  W_RECENCY: 15,
  W_DEADLINE: 15,
  W_REVIEW: 10,
  W_LOW_MASTERY: 5,
  W_OVER_TARGET: 20,               // subtraído
  RECENCY_CAP_DAYS: 7,
  REVIEW_CAP: 3                    // nº de revisões pendentes que satura o score
};

/* Revisão espaçada: multiplicadores e pisos por resultado. */
const REVIEW = {
  forgot:     { mult:0,   floor:1, mastery:-2, resetStreak:true  },
  hard:       { mult:1.5, floor:2, mastery:-1, resetStreak:true  },
  remembered: { mult:2.2, floor:4, mastery:+1, resetStreak:false },
  mastered:   { mult:3.2, floor:7, mastery:'max', resetStreak:false }
};
const REVIEW_MAX_INTERVAL = 180;
const REVIEW_INITIAL_MASTERY = 2;
const MASTERED_MIN_LEVEL = 4;
const MASTERED_MIN_STREAK = 2;

/* Cores de dados (gráficos). Tons médios, legíveis nos dois temas. */
const PALETTE = ['#4FA597','#C9A465','#7397C4','#D0837A','#958AC6','#3A8174','#C68A5A','#5F93AE','#AE87AB','#86A86A'];
const MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const MONTHS_ABBR = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

const DEFAULT_SETTINGS = {
  theme: 'dark',                 // 'dark' | 'light' | 'system'
  density: 'comfortable',        // 'comfortable' | 'compact'
  startView: 'today',            // tela inicial
  helpMode: 'full',              // 'full' | 'discreet' | 'off'
  hoverHints: true,              // explicações ao passar o mouse
  showUpcomingReviews: true,     // revisões futuras na tela Hoje
  seenTips: [],                  // ids das dicas de primeira visita já vistas
  weekStart: 'monday',
  defaultSessionMinutes: 40,
  defaultReviewMinutes: 20,
  autoReviewNewTopics: true,
  reduceMotion: false,
  defaultPeriod: 'semana',
  /* v4 */
  defaultReviewStrategy: 'adaptive',   // estratégia global (disciplina/tópico podem sobrescrever)
  defaultReviewMethod: 'auto',         // método global
  showDailyQuote: true,                // frase do dia na tela Hoje
  seenWhatsNew: null                   // versão cujas novidades já foram vistas
};

const VIEW_TITLES = {
  today:'Hoje', plan:'Planejamento', reviews:'Revisões', disciplines:'Disciplinas',
  analytics:'Análises', history:'Histórico', help:'Ajuda', data:'Dados', settings:'Configurações'
};

/* =========================================================================
   UTILITIES
   ========================================================================= */

/** Cria elementos com segurança: texto sempre via textContent (nunca innerHTML). */
function h(tag, attrs, ...children){
  const el = document.createElement(tag);
  // Permite omitir o objeto de atributos: h('div', filho, filho...)
  if(attrs instanceof Node || Array.isArray(attrs) || typeof attrs === 'string' || typeof attrs === 'number'){
    children.unshift(attrs);
    attrs = null;
  }
  if(attrs){
    for(const k in attrs){
      const v = attrs[k];
      if(v === null || v === undefined || v === false) continue;
      if(k === 'class') el.className = v;
      else if(k === 'text') el.textContent = v;
      else if(k === 'dataset') Object.assign(el.dataset, v);
      else if(k === 'style') el.setAttribute('style', v);
      else if(k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if(v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  appendChildren(el, children);
  return el;
}

function svgEl(tag, attrs, ...children){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if(attrs instanceof Node || Array.isArray(attrs) || typeof attrs === 'string' || typeof attrs === 'number'){
    children.unshift(attrs);
    attrs = null;
  }
  if(attrs){ for(const k in attrs){ const v = attrs[k]; if(v===null||v===undefined||v===false) continue; el.setAttribute(k, String(v)); } }
  appendChildren(el, children);
  return el;
}

function icon(id, cls){
  const s = svgEl('svg', { class: cls || 'btn-icon', 'aria-hidden':'true', focusable:'false' });
  const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  u.setAttribute('href', '#' + id);
  s.appendChild(u);
  return s;
}

function appendChildren(el, children){
  children.flat(Infinity).forEach(c => {
    if(c === null || c === undefined || c === false || c === '') return;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  });
}

function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); }

/**
 * Envolve um handler assíncrono para que cliques repetidos não disparem a ação
 * duas vezes (duplo clique, Enter repetido, toque duplo no celular).
 * O botão fica desabilitado enquanto a ação roda.
 */
function once(handler){
  let running = false;
  return async function(ev){
    if(running) return;
    running = true;
    const btn = ev && ev.currentTarget;
    if(btn && 'disabled' in btn){ btn.disabled = true; btn.classList.add('is-busy'); btn.setAttribute('aria-busy','true'); }
    try { await handler.call(this, ev); }
    catch(err){ console.error(err); toast('Tente novamente. Se continuar, relate o problema em Ajuda.', 'err', { title:'Não foi possível concluir a ação' }); }
    finally {
      running = false;
      if(btn && 'disabled' in btn && document.contains(btn)){
        btn.disabled = false; btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy');
      }
    }
  };
}
function mount(node, ...children){ clear(node); appendChildren(node, children); }
function $(sel, root){ return (root || document).querySelector(sel); }
function $$(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }

function uid(){
  if(typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  if(typeof crypto !== 'undefined' && crypto.getRandomValues){
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
    const hex = Array.from(b, x => x.toString(16).padStart(2,'0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10);
}

function clamp(n, min, max){ return Math.min(max, Math.max(min, n)); }
function sum(arr, fn){ return arr.reduce((a,x) => a + (fn ? fn(x) : x), 0); }
function roundTo(n, step){ return Math.round(n / step) * step; }
function nowISO(){ return new Date().toISOString(); }
function isNum(v){ return typeof v === 'number' && isFinite(v); }
function str(v){ return typeof v === 'string' ? v : (v === null || v === undefined ? '' : String(v)); }

function fmtNumber(n, maxFrac){
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString('pt-BR', { maximumFractionDigits: maxFrac === undefined ? 2 : maxFrac });
}

/** 95 → "1h35"; 60 → "1h"; 0 → "0min" */
function fmtDuration(minutes){
  const m = Math.max(0, Math.round(minutes || 0));
  const hh = Math.floor(m / 60), mm = m % 60;
  if(hh <= 0) return mm + 'min';
  if(mm === 0) return hh + 'h';
  return hh + 'h' + String(mm).padStart(2,'0');
}
/** Cronômetro: "42:18" e, a partir de uma hora, "1:02:18". */
function fmtTimer(ms){
  const total = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(total/3600), mm = Math.floor((total%3600)/60), ss = total%60;
  const tail = String(mm).padStart(2,'0') + ':' + String(ss).padStart(2,'0');
  return hh > 0 ? hh + ':' + tail : tail;
}
/** Duração em frase: "22 min", "1h", "1h22". */
function fmtDurationWords(minutes){
  const m = Math.max(0, Math.round(minutes || 0));
  return m < 60 ? m + ' min' : fmtDuration(m);
}
function fmtPct(n){ return fmtNumber(n, 0) + '%'; }

/* v6.1: ordem natural — "Aula 2" vem antes de "Aula 10"; maiúsculas/acentos não mudam a ordem. */
function sortByName(a, b){ return str(a.name).localeCompare(str(b.name), 'pt-BR', { numeric:true, sensitivity:'base' }); }

/* =========================================================================
   DATE HELPERS  — datas acadêmicas são sempre LOCAIS (YYYY-MM-DD), sem UTC.
   ========================================================================= */
function dateToISO(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function parseISO(s){
  if(!s || typeof s !== 'string') return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setHours(0,0,0,0);
  return d;
}
function today(){ const d = new Date(); d.setHours(0,0,0,0); return d; }
function todayISO(){ return dateToISO(today()); }
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(0,0,0,0); return x; }
function addDaysISO(iso, n){ return dateToISO(addDays(parseISO(iso) || today(), n)); }
function diffDays(a, b){ return Math.round((a - b) / 86400000); }        // a - b, em dias
function daysSinceISO(iso){ const d = parseISO(iso); return d ? diffDays(today(), d) : null; }
function daysUntilISO(iso){ const d = parseISO(iso); return d ? diffDays(d, today()) : null; }

function weekStartDow(){ return (state.settings.weekStart === 'sunday') ? 0 : 1; }
function startOfWeek(d){
  const x = new Date(d); x.setHours(0,0,0,0);
  const shift = (x.getDay() - weekStartDow() + 7) % 7;
  x.setDate(x.getDate() - shift);
  return x;
}
function endOfWeek(d){ return addDays(startOfWeek(d), 6); }
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }
function rangeDays(range){ return diffDays(range.end, range.start) + 1; }
function fmtDateBR(iso){ const d = parseISO(iso); return d ? `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}` : '—'; }
function fmtDayMonth(d){ return `${d.getDate()} de ${MONTHS[d.getMonth()]}`; }
function fmtRangeLabel(range){
  const a = range.start, b = range.end;
  if(dateToISO(a) === dateToISO(b)) return `${fmtDayMonth(a)} de ${a.getFullYear()}`;
  if(a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) return `${a.getDate()} a ${fmtDayMonth(b)} de ${b.getFullYear()}`;
  if(a.getFullYear() === b.getFullYear()) return `${fmtDayMonth(a)} a ${fmtDayMonth(b)} de ${b.getFullYear()}`;
  return `${fmtDayMonth(a)} de ${a.getFullYear()} a ${fmtDayMonth(b)} de ${b.getFullYear()}`;
}
/** "há 3 dias" / "hoje" / "ontem" */
function fmtRelativePast(iso){
  const n = daysSinceISO(iso);
  if(n === null) return 'nunca';
  if(n <= 0) return 'hoje';
  if(n === 1) return 'ontem';
  return `há ${n} dias`;
}
function fmtRelativeFuture(iso){
  const n = daysUntilISO(iso);
  if(n === null) return '—';
  if(n < 0) return `atrasada há ${Math.abs(n)} ${Math.abs(n) === 1 ? 'dia' : 'dias'}`;
  if(n === 0) return 'hoje';
  if(n === 1) return 'amanhã';
  return `em ${n} dias`;
}
/* v6.4 — horários informados à mão são sempre LOCAIS. `new Date(ano, mês, dia,
   hora, minuto)` monta o instante no fuso do usuário; só então ele vira ISO
   (UTC) para ser guardado. 23:50 → 00:12 nunca "anda" por causa de fuso. */
function parseClock(v){
  const m = /^(\d{1,2}):(\d{2})/.exec(str(v));
  if(!m) return null;
  const hh = Number(m[1]), mm = Number(m[2]);
  return (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) ? hh * 60 + mm : null;
}
/* v6.4.1 — HORÁRIO DIGITADO. O campo de horário do Ciclo é um campo de texto
   comum (ver `timeField`): a pessoa digita só os números e o Ciclo põe os dois
   pontos. As três funções abaixo são puras — sem DOM —, para a máscara ser
   simples de ler e de testar.

     clockMask('2350')  → '23:50'      clockMask('930') → '09:30'
     clockMask('23:5')  → '23:5'       clockMask('9')   → '09'
     clockState('23:50') → 'valid'     clockState('27:89') → 'invalid'
     clockState('09:5')  → 'partial'   clockState('')      → 'empty'
     clockMask('12345') → '12:345'  →  clockState → 'invalid' (nada é cortado)

   Regra de ouro: a máscara nunca "conserta" um horário impossível. 27:89 fica
   como foi digitado e é apontado como erro — nada vira outro horário em silêncio. */
const CLOCK_SEPARATOR = /[:.,;hH]/;

/** Texto digitado → texto exibido. Só reorganiza dígitos; não valida nem corrige. */
function clockMask(raw){
  const s = str(raw).replace(/[^\d:.,;hH]/g, '');
  const cut = s.search(CLOCK_SEPARATOR);
  const digits = s.replace(/\D/g, '');
  // Com separador digitado ("9:30", "23h5"): o que vem antes é a hora, o que vem depois são os minutos.
  if(cut >= 0 && cut <= 2 && /^\d*$/.test(s.slice(0, cut))){
    // v6.5: dígitos a mais NÃO são cortados — "9:305" fica à vista e é apontado como erro.
    return s.slice(0, cut) + ':' + s.slice(cut + 1).replace(/\D/g, '');
  }
  // Só dígitos: os dois primeiros são a hora. Uma hora que começa com 3–9 só pode
  // ter um dígito ("9" é 09), então o zero entra na frente e "930" vira 09:30.
  let d = digits;
  if(d && d[0] > '2') d = '0' + d;
  // v6.5: antes, "12345" era cortado para 12:34 em silêncio — um horário que a pessoa
  // não digitou. Agora o excesso continua no campo ("12:345") e vira erro visível.
  return d.length <= 2 ? d : d.slice(0, 2) + ':' + d.slice(2);
}

/** 'empty' | 'partial' (ainda digitando) | 'valid' | 'invalid' (não pode ser um horário). */
function clockState(text){
  const t = str(text);
  if(!t) return 'empty';
  const full = /^(\d{1,2}):(\d{2})$/.exec(t);
  if(full) return (Number(full[1]) <= 23 && Number(full[2]) <= 59) ? 'valid' : 'invalid';
  const part = /^(\d{0,2})(?::(\d{0,2}))?$/.exec(t);
  if(!part) return 'invalid';
  if(part[1] && Number(part[1]) > 23) return 'invalid';          // 25… não existe
  if(part[2] && Number(part[2][0]) > 5) return 'invalid';        // 09:7… não existe
  return 'partial';
}

/**
 * Ao sair do campo: completa o que é inequívoco e deixa o resto como está.
 *   '9:30' → '09:30'   '14' → '14:00'   '9:' → '09:00'
 *   '09:5' continua '09:5' (09:05 ou 09:50? o Ciclo não adivinha).
 */
function clockSettle(text){
  const t = str(text);
  let m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if(m) return m[1].padStart(2, '0') + ':' + m[2];
  m = /^(\d{1,2}):?$/.exec(t);
  if(m && Number(m[1]) <= 23) return m[1].padStart(2, '0') + ':00';
  return t;
}

/** Texto colado ("18:45", "18h45", "6:45 PM", "1845") → "HH:MM" quando dá para entender; senão, o texto mascarado. */
function clockFromPaste(raw){
  const src = str(raw).trim();
  const text = clockSettle(clockMask(src));
  const m = /^(\d{2}):(\d{2})$/.exec(text);
  const ampm = /(^|[^a-z])([ap])\.?\s?m\.?($|[^a-z])/i.exec(src);
  if(m && ampm){
    // relógio de 12 horas colado de outro lugar: converte para 24h em vez de aceitar errado
    let hh = Number(m[1]);
    const pm = ampm[2].toLowerCase() === 'p';
    if(hh >= 1 && hh <= 12){ hh = (hh % 12) + (pm ? 12 : 0); return String(hh).padStart(2, '0') + ':' + m[2]; }
  }
  return text;
}

/** Data civil local + minutos desde a meia-noite → instante (Date). Aceita minutos ≥ 1440 (dia seguinte). */
function localDateTime(iso, minutesOfDay){
  const d = parseISO(iso);
  if(!d || !isNum(minutesOfDay)) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, minutesOfDay, 0, 0);
}
/** "23:50" a partir de um instante gravado (ISO ou ms), no fuso local. */
function fmtClockOfDay(value){
  const d = (value instanceof Date) ? value : new Date(value);
  if(!value || isNaN(d.getTime())) return '';
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function validInstant(v){ if(!v || typeof v !== 'string') return null; const t = Date.parse(v); return isFinite(t) ? t : null; }

/* =========================================================================
   v6.5 — POLÍTICA TEMPORAL DO CICLO (vale para o produto inteiro)

   1. DATAS ACADÊMICAS são dias civis LOCAIS, gravados como "YYYY-MM-DD":
      a data de um estudo, de um prazo, de uma revisão, o início da semana.
      Elas nunca passam por UTC e nunca "andam" quando o fuso muda.
   2. INSTANTES são momentos exatos, gravados em ISO-8601 UTC ("…Z"):
      `startedAt`, `endedAt`, `createdAt`, `updatedAt`, `completedAt`,
      o início e o fim de cada descanso.
   3. "EM QUE DIA ISSO ACONTECEU?" é sempre respondido no fuso LOCAL do
      aparelho: um instante vira dia com `localDateOfStamp`, nunca cortando
      os dez primeiros caracteres do ISO (isso leria o dia em UTC).
   4. UM ESTUDO PERTENCE AO DIA EM QUE COMEÇOU. 23:50 → 00:12 conta inteiro
      no dia das 23:50 — nas Análises, no plano da semana e no histórico.
   ========================================================================= */

/** Data civil ESTRITA: exatamente "YYYY-MM-DD" e existente no calendário (2026-02-31 não existe). */
function isStrictISODate(v){
  if(typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = parseISO(v);
  return !!d && dateToISO(d) === v;
}
/**
 * Carimbo gravado → dia civil LOCAL ("YYYY-MM-DD"), ou null.
 * Aceita um instante ISO (convertido para o fuso local) e também uma data civil
 * já pronta (versões antigas gravaram só o dia em alguns campos): essa volta
 * como está — passar por `new Date('2026-10-01')` a leria em UTC e devolveria
 * o dia anterior em qualquer fuso a oeste de Greenwich.
 */
function localDateOfStamp(value){
  if(value === null || value === undefined || value === '') return null;
  if(typeof value === 'string' && isStrictISODate(value)) return value;
  const d = (value instanceof Date) ? value : new Date(value);
  return isNaN(d.getTime()) ? null : dateToISO(d);
}

/* =========================================================================
   v6.5 — TIME RULES: as contas de tempo do Ciclo, puras (sem DOM, sem banco).
   Registro, edição, cronômetro e importação usam as MESMAS funções.

   Um estudo é guardado em um de dois modos — e só um:
     MODO HORÁRIO  → tem início e fim (instantes). A conta fecha:
                     fim − início = minutos de estudo + descansos (±1 min).
     MODO DURAÇÃO  → só os minutos. Sem `startedAt`/`endedAt`.
   Nunca fica um horário gravado que contradiz a duração: quando a pessoa
   corrige os minutos e a conta deixa de fechar, o estudo passa a valer pela
   duração e o horário antigo deixa de ser guardado (ela é avisada antes).
   ========================================================================= */
const TimeRules = {
  TOLERANCE_MIN: 1,           // segundos arredondados podem somar até 1 minuto de diferença
  SUSPICIOUS_MIN: LONG_STUDY_CONFIRM_MIN,

  /**
   * Início e fim como minutos do dia (0–1439). Fim menor que o início é o dia
   * seguinte. Devolve { ok, minutes, endAbs, nextDay } ou { ok:false, reason }.
   */
  span(startMin, endMin){
    if(!isNum(startMin) || !isNum(endMin)) return { ok:false, reason:'missing' };
    if(startMin < 0 || startMin > 1439 || endMin < 0 || endMin > 1439) return { ok:false, reason:'range' };
    if(startMin === endMin) return { ok:false, reason:'same' };
    const endAbs = endMin > startMin ? endMin : endMin + 1440;
    return { ok:true, minutes: endAbs - startMin, endAbs, nextDay: endAbs >= 1440 };
  },

  /** Tempo de estudo = tempo decorrido − descansos. Nunca negativo; 0 quer dizer "não sobrou estudo". */
  netMinutes(elapsedMin, breakMin){
    const n = Math.round(Number(elapsedMin) || 0) - Math.round(Number(breakMin) || 0);
    return n > 0 ? n : 0;
  },

  /** Minutos inteiros entre dois instantes (ms). */
  minutesBetween(aMs, zMs){ return (isNum(aMs) && isNum(zMs) && zMs > aMs) ? Math.round((zMs - aMs) / 60000) : 0; },

  /**
   * Descansos (em minutos do dia, já "abertos" para o dia seguinte quando preciso)
   * contra o intervalo do estudo. Devolve null quando está tudo certo, ou
   * { index, reason:'order'|'outside'|'overlap' } apontando o primeiro problema.
   */
  checkBreakSpans(spans, startMin, endAbs){
    for(let i = 0; i < spans.length; i++){
      const s = spans[i];
      if(!(s.z > s.a)) return { index:i, reason:'order' };
      if(s.a < startMin || s.z > endAbs) return { index:i, reason:'outside' };
    }
    const sorted = spans.map((s, i) => ({ a:s.a, z:s.z, i })).sort((x, y) => x.a - y.a);
    for(let k = 1; k < sorted.length; k++){
      if(sorted[k].a < sorted[k - 1].z) return { index: sorted[k].i, reason:'overlap' };
    }
    return null;
  },

  /**
   * Durações em milissegundos → minutos inteiros SEM perder o total.
   * Arredondar cada pausa sozinha jogava fora três pausas de 25 s (75 s reais
   * viravam 0 min). Aqui o total é arredondado uma vez e distribuído pelo
   * método dos maiores restos: [25s, 25s, 25s] → [1, 0, 0]; [90s, 90s] → [2, 1].
   */
  distributeMinutes(msList){
    const list = (msList || []).map(ms => (isNum(ms) && ms > 0) ? ms : 0);
    const total = Math.round(sum(list) / 60000);
    const base = list.map(ms => Math.floor(ms / 60000));
    let left = total - sum(base);
    const order = list.map((ms, i) => ({ i, rest: ms % 60000 })).sort((x, y) => (y.rest - x.rest) || (x.i - y.i));
    for(let k = 0; k < order.length && left > 0; k++){ if(order[k].rest > 0){ base[order[k].i] += 1; left--; } }
    return base;
  },

  /** Estudo acima do limite de conferência (8h): o Ciclo pergunta, não bloqueia. */
  isSuspicious(minutes){ return Number(minutes) > this.SUSPICIOUS_MIN; },

  /**
   * O horário gravado de um estudo ainda fecha com a duração dele?
   * { mode:'clock'|'duration', consistent, elapsed, expected, allBreaksTimed }
   */
  clockInfo(session){
    const a = validInstant(session && session.startedAt), z = validInstant(session && session.endedAt);
    const breaks = (session && Array.isArray(session.breaks)) ? session.breaks : [];
    const breakMin = sum(breaks, b => (isNum(b.minutes) && b.minutes > 0) ? b.minutes : 0);
    const minutes = Math.round(Number(session && session.minutes) || 0);
    if(a === null || z === null || z <= a) return { mode:'duration', consistent:true, elapsed:null, expected: minutes + breakMin, allBreaksTimed:false };
    const elapsedMs = z - a;
    const expected = minutes + breakMin;
    // a comparação é feita em milissegundos: 50 min de estudo cabem em 49m31s…50m30s de relógio
    const consistent = Math.abs(elapsedMs - expected * 60000) <= (this.TOLERANCE_MIN * 60000 + 30000);
    const allBreaksTimed = breaks.every(b => {
      const ba = validInstant(b.startedAt), bz = validInstant(b.endedAt);
      return ba !== null && bz !== null && bz > ba && ba >= a - 60000 && bz <= z + 60000;
    });
    return { mode:'clock', consistent, elapsed: Math.round(elapsedMs / 60000), expected, allBreaksTimed };
  },

  /**
   * Garante que um estudo nunca seja gravado com horário que contradiz a duração.
   * Devolve uma CÓPIA dos campos temporais: se a conta não fecha, o estudo passa
   * a valer pela duração (sem início/fim; os descansos ficam só com os minutos).
   */
  settle(session){
    const info = this.clockInfo(session);
    const breaks = (Array.isArray(session.breaks) ? session.breaks : []).map(b => Object.assign({}, b));
    if(info.mode === 'clock' && info.consistent){
      return { startedAt: session.startedAt, endedAt: session.endedAt, breaks, clockDropped:false };
    }
    const hadClock = info.mode === 'clock';
    return {
      startedAt: null, endedAt: null,
      breaks: hadClock ? breaks.map(b => Object.assign(b, { startedAt:null, endedAt:null })) : breaks,
      clockDropped: hadClock
    };
  }
};

/** "125 min" lido como gente lê: "2h05". Só aparece quando ajuda (60 min ou mais). */
function humanMinutesHint(value){
  const m = Math.round(Number(value));
  if(!(m >= 60) || m > 100000) return '';
  return 'São ' + fmtDuration(m) + '.';
}

/** Número ISO-8601 aproximado da semana, usado nos relatórios semanais. */
function isoWeekNumber(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dow + 3);
  const firstThursday = new Date(x.getFullYear(), 0, 4);
  const fdow = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - fdow + 3);
  return 1 + Math.round((x - firstThursday) / (7 * 86400000));
}

/* =========================================================================
   DATABASE — camada fina sobre IndexedDB nativo.
   O resto da aplicação nunca fala com IndexedDB diretamente.
   ========================================================================= */
const DB = (() => {
  let db = null;

  function open(){
    return new Promise((resolve, reject) => {
      if(!('indexedDB' in window)) { reject(new Error('IndexedDB indisponível neste navegador.')); return; }
      let req;
      try { req = indexedDB.open(IDB_NAME, IDB_VERSION); }
      catch(e){ reject(e); return; }

      req.onupgradeneeded = (ev) => {
        const d = req.result;
        if(!d.objectStoreNames.contains('meta'))        d.createObjectStore('meta', { keyPath:'key' });
        if(!d.objectStoreNames.contains('settings'))    d.createObjectStore('settings', { keyPath:'key' });

        if(!d.objectStoreNames.contains('areas')){
          d.createObjectStore('areas', { keyPath:'id' }).createIndex('archived','archived',{unique:false});
        }
        if(!d.objectStoreNames.contains('disciplines')){
          const s = d.createObjectStore('disciplines', { keyPath:'id' });
          s.createIndex('areaId','areaId',{unique:false});
          s.createIndex('archived','archived',{unique:false});
        }
        if(!d.objectStoreNames.contains('topics')){
          const s = d.createObjectStore('topics', { keyPath:'id' });
          s.createIndex('disciplineId','disciplineId',{unique:false});
          s.createIndex('reviewDueDate','reviewDueDate',{unique:false});
          s.createIndex('archived','archived',{unique:false});
        }
        if(!d.objectStoreNames.contains('sessions')){
          const s = d.createObjectStore('sessions', { keyPath:'id' });
          s.createIndex('date','date',{unique:false});
          s.createIndex('disciplineId','disciplineId',{unique:false});
          s.createIndex('topicId','topicId',{unique:false});
        }
        if(!d.objectStoreNames.contains('plans'))       d.createObjectStore('plans', { keyPath:'id' });
        if(!d.objectStoreNames.contains('weeklyPlans')){
          d.createObjectStore('weeklyPlans', { keyPath:'id' }).createIndex('weekStart','weekStart',{unique:false});
        }
        if(!d.objectStoreNames.contains('deadlines')){
          const s = d.createObjectStore('deadlines', { keyPath:'id' });
          s.createIndex('date','date',{unique:false});
          s.createIndex('disciplineId','disciplineId',{unique:false});
        }
        void ev;
      };
      req.onsuccess = () => { db = req.result; resolve(db); };
      req.onerror = () => reject(req.error || new Error('Falha ao abrir o banco local.'));
      req.onblocked = () => reject(new Error('O banco está bloqueado por outra aba aberta.'));
    });
  }

  function tx(stores, mode){
    if(!db) throw new Error('Banco não inicializado.');
    return db.transaction(stores, mode);
  }
  function wrap(request){
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  /* v6.5 — o motivo real da falha chega a quem chamou. `transaction.error` pode
     estar vazio no evento "error" (o erro é do pedido, não da transação), então o
     último erro de pedido é guardado e usado no "abort". Só o "abort" rejeita:
     um pedido que falha e é tratado não derruba a transação. */
  function done(transaction){
    return new Promise((resolve, reject) => {
      let last = null;
      transaction.oncomplete = () => resolve();
      transaction.onerror = (ev) => { last = (ev && ev.target && ev.target.error) || transaction.error || last; };
      transaction.onabort = () => reject(transaction.error || last || new Error('Transação cancelada.'));
    });
  }
  /** Avisa as outras abas DEPOIS que a gravação terminou. Nunca atrapalha a gravação. */
  function committed(stores){
    try { if(typeof DataSync !== 'undefined') DataSync.committed(stores); } catch(_){ /* aviso é conveniência */ }
  }

  return {
    open,
    get isOpen(){ return !!db; },
    get(store, key){ return wrap(tx([store],'readonly').objectStore(store).get(key)); },
    getAll(store){ return wrap(tx([store],'readonly').objectStore(store).getAll()); },
    async put(store, value){ const t = tx([store],'readwrite'); t.objectStore(store).put(value); await done(t); committed([store]); return value; },
    async putMany(store, values){
      if(!values.length) return;
      const t = tx([store],'readwrite');
      const os = t.objectStore(store);
      values.forEach(v => os.put(v));
      await done(t);
      committed([store]);
    },
    async delete(store, key){ const t = tx([store],'readwrite'); t.objectStore(store).delete(key); await done(t); committed([store]); },
    async clearStores(stores){
      const t = tx(stores,'readwrite');
      stores.forEach(s => t.objectStore(s).clear());
      await done(t);
      committed(stores);
    },
    /** Escrita atômica em vários stores: ou tudo grava, ou nada.
        `clear` existe aqui para que "apagar e regravar" (restauração de backup)
        aconteça dentro de UMA transação. `add` (v6.5) recusa uma chave que já
        existe — é o que impede um registro de entrar duas vezes. */
    async transactional(stores, writer){
      const t = tx(stores,'readwrite');
      const finished = done(t);
      finished.catch(() => {});
      const api = {
        put:(s, v) => t.objectStore(s).put(v),
        add:(s, v) => t.objectStore(s).add(v),
        delete:(s, k) => t.objectStore(s).delete(k),
        clear:(s) => t.objectStore(s).clear()
      };
      try { writer(api); } catch(err){ try{ t.abort(); }catch(_){} throw err; }
      await finished;
      committed(stores);
    },
    /**
     * v6.5 — LER, DECIDIR E GRAVAR na mesma transação.
     *
     * `work(api)` é assíncrona e usa só o `api` (get, getAll, getAllByIndex, put,
     * add, delete, clear). O IndexedDB executa transações de escrita sobre os
     * mesmos stores UMA DE CADA VEZ — inclusive entre abas —, então o que é lido
     * aqui dentro é o estado que vale no momento da gravação, não o que a aba
     * tinha na memória. É isso que torna um comando idempotente de verdade:
     * "se já existe, não grava de novo" é decidido pelo banco.
     *
     * Regras de uso:
     *   · dentro de `work`, espere APENAS chamadas do `api`. Esperar outra coisa
     *     (rede, setTimeout, outra transação) encerra a transação antes da hora;
     *   · se `work` lançar, tudo é desfeito e o erro sobe;
     *   · `add` numa chave existente rejeita com ConstraintError e desfaz tudo.
     * Devolve o que `work` devolver.
     */
    async atomic(stores, work){
      const t = tx(stores,'readwrite');
      const finished = done(t);
      finished.catch(() => {});                       // tratado abaixo; evita "unhandled rejection"
      let wrote = false;
      const ask = (request) => { const p = wrap(request); p.catch(() => {}); return p; };
      const api = {
        get:(s, k) => ask(t.objectStore(s).get(k)),
        getAll:(s) => ask(t.objectStore(s).getAll()),
        getAllByIndex:(s, index, key) => ask(t.objectStore(s).index(index).getAll(key)),
        put:(s, v) => { wrote = true; return ask(t.objectStore(s).put(v)); },
        add:(s, v) => { wrote = true; return ask(t.objectStore(s).add(v)); },
        delete:(s, k) => { wrote = true; return ask(t.objectStore(s).delete(k)); },
        clear:(s) => { wrote = true; return ask(t.objectStore(s).clear()); }
      };
      let result;
      try { result = await work(api); }
      catch(err){
        try { t.abort(); } catch(_){ /* já abortada pelo próprio erro */ }
        await finished.catch(() => {});
        throw err;
      }
      await finished;
      if(wrote) committed(stores);
      return result;
    },
    /** Conta registros de um store (usado nas checagens de integridade). */
    count(store){ return wrap(tx([store],'readonly').objectStore(store).count()); }
  };
})();

/* =========================================================================
   MIGRATION — V2 (localStorage) → V3 (IndexedDB). Idempotente.
   O localStorage da V2 NUNCA é apagado automaticamente.
   ========================================================================= */
function readV2Raw(){
  try {
    const raw = localStorage.getItem(V2_LS_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch(_){ return null; }
}

/** Converte um estado no formato V2 para entidades V3. Não grava nada. */
function convertV2(raw, opts){
  const o = opts || {};
  const ts = nowISO();
  const areas = [], disciplines = [], sessions = [];
  const areaIds = new Set();

  (Array.isArray(raw.areas) ? raw.areas : []).forEach(a => {
    if(!a || !a.id) return;
    if(areaIds.has(a.id)) return;
    areaIds.add(a.id);
    areas.push({ id:String(a.id), name:str(a.nome) || 'Área', archived:false, createdAt:ts, updatedAt:ts });
  });

  const discIds = new Set();
  (Array.isArray(raw.subjects) ? raw.subjects : []).forEach(s => {
    if(!s || !s.id) return;
    if(discIds.has(s.id)) return;
    discIds.add(s.id);
    // v6.4: `minutosPorCredito` e `metaSemanalCreditos` da V2 são ignorados — o Ciclo trabalha com tempo.
    disciplines.push({
      id: String(s.id),
      areaId: (s.areaId && areaIds.has(s.areaId)) ? String(s.areaId) : null,
      name: str(s.nome) || 'Disciplina',
      priority: 3,                                   // prioridade padrão para dados migrados
      archived: !!s.archived,
      createdAt: ts, updatedAt: ts
    });
  });

  const sessIds = new Set();
  (Array.isArray(raw.logs) ? raw.logs : []).forEach(l => {
    if(!l || !l.id) return;
    if(sessIds.has(l.id)) return;
    if(!discIds.has(l.subjectId)) return;            // ignora log órfão (relatado depois)
    /* v6.5 — data ilegível não vira "hoje" em silêncio.
       Na restauração de um arquivo (`keepRawDate`) o valor original segue adiante
       e o IntegrityValidator decide (recupera pelo carimbo de criação ou deixa o
       registro de fora, avisando). Na migração automática do localStorage da V2
       nada pode ficar de fora: usa o dia em que o registro foi criado e, só se
       nem isso existir, o dia de hoje. */
    const civil = isStrictISODate(str(l.date).slice(0,10)) ? str(l.date).slice(0,10) : null;
    const date = civil || (o.keepRawDate ? str(l.date) : (localDateOfStamp(validInstant(str(l.criadoEm)) !== null ? str(l.criadoEm) : null) || todayISO()));
    sessIds.add(l.id);
    sessions.push({
      id: String(l.id),
      disciplineId: String(l.subjectId),
      topicId: null,
      legacyTopicText: str(l.tema),                  // "tema" antigo vira texto legado
      date,
      startedAt: null, endedAt: null,
      minutes: isNum(l.minutos) ? l.minutos : 0,
      breaks: [],
      type: SESSION_TYPES.some(t => t.v === l.tipo) ? l.tipo : null,
      difficulty: (isNum(l.dificuldade) && l.dificuldade >= 1 && l.dificuldade <= 5) ? l.dificuldade : null,
      comment: str(l.comentario),
      reviewOutcome: null,
      // na restauração, um carimbo de criação ausente fica ausente: senão a data ilegível seria "recuperada" como hoje
      createdAt: str(l.criadoEm) || (o.keepRawDate ? null : ts),
      updatedAt: ts
    });
  });

  const orphanLogs = (Array.isArray(raw.logs) ? raw.logs : []).filter(l => l && l.id && !discIds.has(l.subjectId)).length;

  const s = raw.settings || {};
  const settings = Object.assign({}, DEFAULT_SETTINGS, {
    theme: (s.theme === 'light' || s.theme === 'dark') ? s.theme : DEFAULT_SETTINGS.theme,
    weekStart: (s.weekStart === 'sunday') ? 'sunday' : 'monday',
    defaultSessionMinutes: (isNum(s.defaultSessionMinutes) && s.defaultSessionMinutes > 0) ? s.defaultSessionMinutes : DEFAULT_SETTINGS.defaultSessionMinutes,
    reduceMotion: !!s.reduceMotion,
    defaultPeriod: str(s.defaultPeriod) || DEFAULT_SETTINGS.defaultPeriod
  });

  return { areas, disciplines, sessions, settings, orphanLogs };
}

/**
 * Executa a migração V2→V3 uma única vez.
 * Grava tudo em uma transação; marca a conclusão no store `meta`.
 */
async function runV2Migration(){
  const already = await DB.get('meta','v2MigrationCompleted');
  if(already && already.value) return { migrated:false, reason:'already' };

  // Salvaguarda extra: se já existirem dados na V3, não importar por cima.
  const [dCount, sCount] = await Promise.all([DB.count('disciplines'), DB.count('sessions')]);
  if(dCount > 0 || sCount > 0){
    await DB.put('meta', { key:'v2MigrationCompleted', value:true, note:'ignorada: já havia dados na V3' });
    await DB.put('meta', { key:'v2MigrationDate', value: nowISO() });
    return { migrated:false, reason:'v3-has-data' };
  }

  const raw = readV2Raw();
  if(!raw || (!Array.isArray(raw.subjects) && !Array.isArray(raw.logs))){
    // Nada para migrar agora. NÃO marcamos como concluída: se os dados da V2
    // aparecerem depois neste navegador, a migração ainda poderá acontecer.
    return { migrated:false, reason:'no-v2-data' };
  }

  const converted = convertV2(raw);
  if(converted.disciplines.length === 0 && converted.sessions.length === 0){
    return { migrated:false, reason:'v2-empty' };
  }

  await DB.transactional(['areas','disciplines','sessions','settings','meta'], api => {
    converted.areas.forEach(a => api.put('areas', a));
    converted.disciplines.forEach(d => api.put('disciplines', d));
    converted.sessions.forEach(s => api.put('sessions', s));
    api.put('settings', { key:'settings', value: converted.settings });
    api.put('meta', { key:'v2MigrationCompleted', value:true });
    api.put('meta', { key:'v2MigrationDate', value: nowISO() });
    api.put('meta', { key:'v2MigrationSummary', value:{
      areas: converted.areas.length,
      disciplines: converted.disciplines.length,
      sessions: converted.sessions.length,
      orphanLogs: converted.orphanLogs
    }});
  });

  // Verificação de integridade pós-gravação.
  const [da, ds] = await Promise.all([DB.count('disciplines'), DB.count('sessions')]);
  const ok = da >= converted.disciplines.length && ds >= converted.sessions.length;

  return {
    migrated:true, ok,
    counts:{ areas:converted.areas.length, disciplines:converted.disciplines.length, sessions:converted.sessions.length },
    orphanLogs: converted.orphanLogs
  };
}

/* =========================================================================
   MIGRATION V3 → V4 — acrescenta campos, nunca reescreve revisões.
   Idempotente: roda uma vez e marca a conclusão em `meta`.
   ========================================================================= */

/**
 * Deduz em que ponto de um ciclo um tópico da v3 estaria, a partir do
 * intervalo que ele já tinha. Isso NÃO muda a próxima data de revisão —
 * serve apenas para que, se o usuário passar a usar ciclo programado,
 * ele continue de onde está em vez de voltar ao começo.
 */
function inferCycleStep(intervalDays, strategy){
  const steps = CYCLE_STEPS[strategy] || CYCLE_STEPS.fixed;
  if(!isNum(intervalDays) || intervalDays <= 0) return 0;
  let best = 0;
  for(let i = 0; i < steps.length; i++) if(steps[i] <= intervalDays) best = i;
  return best;
}

/** Acrescenta os campos v4 a uma disciplina, preservando tudo o que existe. */
function upgradeDisciplineToV4(d){
  if(!CONTENT_NATURES.some(n => n.v === d.contentNature)) d.contentNature = 'mixed';
  if(!['inherit'].concat(REVIEW_STRATEGIES.map(x => x.v)).includes(d.reviewStrategy)) d.reviewStrategy = 'inherit';
  if(!['inherit'].concat(REVIEW_METHODS.map(x => x.v)).includes(d.preferredReviewMethod)) d.preferredReviewMethod = 'inherit';
  return d;
}

/** Acrescenta os campos v4 a um tópico. A agenda de revisão fica intacta. */
function upgradeTopicToV4(t){
  // v5.2: a prioridade substituiu a importância. A migração v5.2 converte;
  // aqui só garantimos que um tópico v3 tenha algo a converter.
  if(!isValidPriority(t.priority) && !t.importance) t.importance = 'normal';
  if(!['inherit'].concat(REVIEW_STRATEGIES.map(x => x.v)).includes(t.reviewStrategy)) t.reviewStrategy = 'inherit';
  if(!['inherit'].concat(REVIEW_METHODS.map(x => x.v)).includes(t.preferredReviewMethod)) t.preferredReviewMethod = 'inherit';
  if(!isNum(t.reviewCycleStep)) t.reviewCycleStep = inferCycleStep(t.reviewIntervalDays, 'fixed');
  if(!isNum(t.reviewFailures)) t.reviewFailures = 0;
  if(!REVIEW_OUTCOMES.some(o => o.v === t.lastReviewOutcome)) t.lastReviewOutcome = t.lastReviewOutcome || null;
  // reviewDueDate, reviewIntervalDays, masteryLevel, lastReviewedAt e
  // reviewRepetitions NÃO são tocados: a revisão continua de onde estava.
  return t;
}

function upgradeSessionToV4(x){
  if(!REVIEW_METHODS.some(m => m.v === x.reviewMethod)) x.reviewMethod = x.reviewMethod || null;
  if(!REVIEW_STRATEGIES.some(st => st.v === x.reviewStrategyAtTime)) x.reviewStrategyAtTime = x.reviewStrategyAtTime || null;
  return x;
}

/**
 * Executa a migração v3→v4 uma única vez. Só grava o que mudou.
 * Nenhuma sessão, tópico, plano ou prazo é apagado ou reagendado.
 */
async function runV4Migration(){
  const done = await DB.get('meta', 'v4MigrationCompleted');
  if(done && done.value) return { migrated:false, reason:'already' };

  const [disciplines, topics, sessions] = await Promise.all([
    DB.getAll('disciplines'), DB.getAll('topics'), DB.getAll('sessions')
  ]);

  const changedD = [], changedT = [], changedS = [];
  (disciplines || []).forEach(d => { const b = JSON.stringify(d); upgradeDisciplineToV4(d); if(JSON.stringify(d) !== b) changedD.push(d); });
  (topics || []).forEach(t => { const b = JSON.stringify(t); upgradeTopicToV4(t); if(JSON.stringify(t) !== b) changedT.push(t); });
  (sessions || []).forEach(x => { const b = JSON.stringify(x); upgradeSessionToV4(x); if(JSON.stringify(x) !== b) changedS.push(x); });

  const stores = ['meta'];
  if(changedD.length) stores.push('disciplines');
  if(changedT.length) stores.push('topics');
  if(changedS.length) stores.push('sessions');

  await DB.transactional(stores, api => {
    changedD.forEach(d => api.put('disciplines', d));
    changedT.forEach(t => api.put('topics', t));
    changedS.forEach(x => api.put('sessions', x));
    api.put('meta', { key:'v4MigrationCompleted', value:true });
    api.put('meta', { key:'v4MigrationDate', value: nowISO() });
    api.put('meta', { key:'v4MigrationSummary', value:{
      disciplines: changedD.length, topics: changedT.length, sessions: changedS.length
    }});
  });

  return { migrated:true, counts:{ disciplines:changedD.length, topics:changedT.length, sessions:changedS.length } };
}

/* =========================================================================
   MIGRATION V5.1 → V5.2 (schema 4 → 5)
   Tópicos: importance → priority (1–5). Prazos: importance/completed →
   priority/status + campos novos com padrões seguros.
   NÃO toca em reviewDueDate, reviewIntervalDays, masteryLevel, histórico,
   repetições, lastReviewedAt nem em datas de prazos: nada é reagendado.
   Idempotente: rodar de novo não muda nada.
   ========================================================================= */
function isValidPriority(p){ return Number.isInteger(p) && p >= 1 && p <= 5; }

/** Converte qualquer entrada (número, texto 1–5 ou importância antiga) para 1–5. */
function normalizePriority(value, legacy){
  const n = Number(value);
  if(Number.isFinite(n) && n >= 1 && n <= 5) return Math.round(n);
  const key = str(legacy).toLowerCase();
  if(LEGACY_IMPORTANCE_TO_PRIORITY[key]) return LEGACY_IMPORTANCE_TO_PRIORITY[key];
  return PRIORITY_DEFAULT;
}

function upgradeTopicToV52(t){
  if(!isValidPriority(t.priority)) t.priority = normalizePriority(t.priority, t.importance);
  if('importance' in t) delete t.importance;           // uma única fonte de verdade
  return t;
}

function upgradeDeadlineToV52(d){
  if(!isValidPriority(d.priority)) d.priority = normalizePriority(d.priority, d.importance);
  if(!DEADLINE_TYPES.some(x => x.v === d.type)) d.type = 'other';
  if(!DEADLINE_STATUSES.some(x => x.v === d.status)) d.status = d.completed ? 'completed' : 'pending';
  if(!('startDate' in d) || (d.startDate !== null && !parseISO(str(d.startDate)))) d.startDate = null;
  if(typeof d.instructions !== 'string') d.instructions = '';
  if(typeof d.notes !== 'string') d.notes = '';
  if(!('completedAt' in d)) d.completedAt = null;
  if(d.topicId === undefined) d.topicId = null;
  if('importance' in d) delete d.importance;
  if('completed' in d) delete d.completed;              // substituído por status
  return d;
}

async function runV52Migration(){
  const done = await DB.get('meta', 'v52MigrationCompleted');
  if(done && done.value) return { migrated:false, reason:'already' };

  const [topics, deadlines] = await Promise.all([DB.getAll('topics'), DB.getAll('deadlines')]);
  const changedT = [], changedD = [];
  (topics || []).forEach(t => { const b = JSON.stringify(t); upgradeTopicToV52(t); if(JSON.stringify(t) !== b) changedT.push(t); });
  (deadlines || []).forEach(d => { const b = JSON.stringify(d); upgradeDeadlineToV52(d); if(JSON.stringify(d) !== b) changedD.push(d); });

  const stores = ['meta'];
  if(changedT.length) stores.push('topics');
  if(changedD.length) stores.push('deadlines');
  await DB.transactional(stores, api => {
    changedT.forEach(t => api.put('topics', t));
    changedD.forEach(d => api.put('deadlines', d));
    api.put('meta', { key:'v52MigrationCompleted', value:true });
    api.put('meta', { key:'v52MigrationDate', value: nowISO() });
    api.put('meta', { key:'v52MigrationSummary', value:{ topics: changedT.length, deadlines: changedD.length } });
  });
  return { migrated:true, counts:{ topics:changedT.length, deadlines:changedD.length } };
}

/* =========================================================================
   MIGRATION V6.3 → V6.4 (schema 5 → 6) — DESCANSOS
   Cada estudo ganha `breaks`: a lista dos descansos que aconteceram nele.
   Estudos antigos recebem `breaks: []`. `minutes` NÃO é tocado: ele já era o
   tempo de estudo e continua sendo.

   Créditos saíram do produto. Os campos antigos (`credits` nos estudos,
   `minutesPerCredit` e `legacyWeeklyMinutes` nas disciplinas) ficam onde
   estão no banco — nada é apagado —, mas o Ciclo não lê, não calcula e não
   grava mais nenhum deles.
   Idempotente: rodar de novo não muda nada.
   ========================================================================= */

/**
 * Saneia uma lista de descansos vinda do banco, de um backup ou de um formulário.
 * Cada descanso: { id, startedAt (ISO|null), endedAt (ISO|null), minutes > 0 }.
 * Entradas sem duração positiva são descartadas; nunca lança.
 */
function sanitizeBreaks(list){
  if(!Array.isArray(list)) return [];
  const out = [];
  const seen = new Set();
  for(const b of list){
    if(!b || typeof b !== 'object') continue;
    const a = validInstant(b.startedAt), z = validInstant(b.endedAt);
    let minutes = isNum(b.minutes) ? Math.round(b.minutes) : null;
    if(!(minutes > 0) && a !== null && z !== null && z > a) minutes = Math.round((z - a) / 60000);
    if(!(minutes > 0) || minutes > 1440) continue;
    let id = str(b.id) || uid();
    if(seen.has(id)) id = uid();
    seen.add(id);
    const timed = a !== null && z !== null && z > a;
    out.push({ id, startedAt: timed ? new Date(a).toISOString() : null, endedAt: timed ? new Date(z).toISOString() : null, minutes });
    if(out.length >= MAX_BREAKS_PER_STUDY) break;
  }
  // com horário primeiro, em ordem; os informados só por duração ficam no fim, na ordem em que vieram
  return out.map((b, i) => ({ b, i })).sort((x, y) => {
    if(x.b.startedAt && y.b.startedAt) return x.b.startedAt < y.b.startedAt ? -1 : x.b.startedAt > y.b.startedAt ? 1 : x.i - y.i;
    if(x.b.startedAt) return -1;
    if(y.b.startedAt) return 1;
    return x.i - y.i;
  }).map(x => x.b);
}

function upgradeSessionToV64(x){
  if(!Array.isArray(x.breaks)) x.breaks = [];
  return x;
}

async function runV64Migration(){
  const done = await DB.get('meta', 'v64MigrationCompleted');
  if(done && done.value) return { migrated:false, reason:'already' };

  const sessions = await DB.getAll('sessions');
  const changed = (sessions || []).filter(x => x && !Array.isArray(x.breaks)).map(upgradeSessionToV64);

  await DB.transactional(changed.length ? ['meta','sessions'] : ['meta'], api => {
    changed.forEach(x => api.put('sessions', x));
    api.put('meta', { key:'v64MigrationCompleted', value:true });
    api.put('meta', { key:'v64MigrationDate', value: nowISO() });
    api.put('meta', { key:'v64MigrationSummary', value:{ sessions: changed.length } });
  });
  return { migrated:true, counts:{ sessions: changed.length } };
}

/* =========================================================================
   DOMAIN MODELS — fábricas e derivações. Estado em memória (`state`).
   ========================================================================= */
const state = {
  ready: false,
  settings: Object.assign({}, DEFAULT_SETTINGS),
  meta: {},
  areas: [], disciplines: [], topics: [], sessions: [], plans: [], weeklyPlans: [], deadlines: [],
  // índices derivados (recalculados em rebuildIndexes)
  idx: { areaById:new Map(), discById:new Map(), topicById:new Map(), sessionsByDisc:new Map(), sessionsByTopic:new Map(), topicsByDisc:new Map() }
};

function newArea(name){
  const ts = nowISO();
  return { id:uid(), name:str(name).trim(), archived:false, createdAt:ts, updatedAt:ts };
}
function newDiscipline(name, areaId, priority){
  const ts = nowISO();
  return {
    id:uid(), areaId: areaId || null, name:str(name).trim(),
    priority: clamp(Number(priority) || 3, 1, 5),
    /* v4 — tudo opcional, com padrões que funcionam sem configuração */
    contentNature: 'mixed',
    reviewStrategy: 'inherit',      // herda da configuração global
    preferredReviewMethod: 'inherit',
    archived:false, createdAt:ts, updatedAt:ts
  };
}
function newTopic(disciplineId, name, sortOrder){
  const ts = nowISO();
  return {
    id:uid(), disciplineId, name:str(name).trim(), sortOrder: sortOrder || 0, archived:false,
    reviewEnabled: !!state.settings.autoReviewNewTopics,
    firstStudiedAt:null, lastStudiedAt:null,
    reviewDueDate:null, reviewIntervalDays:null, lastReviewedAt:null, reviewRepetitions:0,
    masteryLevel:null, consecutiveSuccessfulReviews:0,
    /* v5.2 — prioridade do tópico dentro da disciplina (1–5) */
    priority: PRIORITY_DEFAULT,
    /* v4 */
    reviewStrategy:'inherit',        // herda da disciplina
    preferredReviewMethod:'inherit', // herda da disciplina
    reviewCycleStep:0,               // posição dentro do ciclo, quando a estratégia usa ciclo
    reviewFailures:0,                // quantas vezes o resultado foi "esqueci"
    lastReviewOutcome:null,
    createdAt:ts, updatedAt:ts
  };
}
function newSession(data){
  const ts = nowISO();
  return Object.assign({
    id:uid(), disciplineId:null, topicId:null, legacyTopicText:'',
    date: todayISO(), startedAt:null, endedAt:null,
    /* `minutes` = tempo de ESTUDO. Descanso nunca entra aqui: fica em `breaks`,
       um registro por descanso — { id, startedAt, endedAt, minutes }. */
    minutes:0, breaks:[], type:null, difficulty:null, comment:'', reviewOutcome:null,
    /* v4 — guarda o contexto da revisão para as análises continuarem legíveis
       mesmo se o usuário trocar a estratégia depois */
    reviewMethod:null, reviewStrategyAtTime:null,
    createdAt:ts, updatedAt:ts
  }, data);
}
function newPlan(name, weeklyAvailableMinutes){
  const ts = nowISO();
  return { id:uid(), name:str(name).trim() || 'Meu plano', weeklyAvailableMinutes: Math.max(0, Math.round(weeklyAvailableMinutes) || 0), active:true, allocations:[], createdAt:ts, updatedAt:ts };
}
function newDeadline(data){
  const ts = nowISO();
  // `date` = data do prazo (obrigatória). `startDate` = a partir de quando ele influencia.
  return Object.assign({
    id:uid(), title:'', type:'other', date:todayISO(), startDate:null,
    disciplineId:null, topicId:null, priority:PRIORITY_DEFAULT, status:'pending',
    instructions:'', notes:'', completedAt:null, createdAt:ts, updatedAt:ts
  }, data);
}

/* v5.2.1 — cache de consultas derivadas.
   Medição com 40 disciplinas / 400 tópicos / 100 prazos / 5.000 sessões:
   renderToday chamava ReviewEngine.getDueReviews() 82 vezes e renderDisciplines
   chamava PlannerEngine.getCurrentWeekProgress() 40 vezes — cada chamada
   percorrendo todos os tópicos ou todas as sessões. A tela Hoje levava ~510ms e
   Disciplinas ~291ms, com travada visível. As duas consultas são puras dentro de
   uma mesma geração de dados, então bastam ser memorizadas. `bump()` roda
   sempre que os dados mudam (rebuildIndexes) ou a cada render. */
const DerivedCache = {
  _gen: 0,
  _store: new Map(),
  bump(){ this._gen++; this._store.clear(); },
  get(key, compute){
    const k = this._gen + '|' + key;
    if(this._store.has(k)) return this._store.get(k);
    const v = compute();
    this._store.set(k, v);
    return v;
  }
};

function rebuildIndexes(){
  const idx = state.idx;
  idx.gen = (idx.gen || 0) + 1;     // v6.2: geração dos dados (StudyStats e buscas cacheiam por ela)
  DerivedCache.bump();
  if(typeof AnalyticsEngine !== 'undefined') AnalyticsEngine.invalidate();
  idx.areaById = new Map(state.areas.map(a => [a.id, a]));
  idx.discById = new Map(state.disciplines.map(d => [d.id, d]));
  idx.topicById = new Map(state.topics.map(t => [t.id, t]));
  idx.sessionsByDisc = new Map();
  idx.sessionsByTopic = new Map();
  idx.topicsByDisc = new Map();
  state.sessions.forEach(s => {
    if(!idx.sessionsByDisc.has(s.disciplineId)) idx.sessionsByDisc.set(s.disciplineId, []);
    idx.sessionsByDisc.get(s.disciplineId).push(s);
    if(s.topicId){
      if(!idx.sessionsByTopic.has(s.topicId)) idx.sessionsByTopic.set(s.topicId, []);
      idx.sessionsByTopic.get(s.topicId).push(s);
    }
  });
  state.topics.forEach(t => {
    if(!idx.topicsByDisc.has(t.disciplineId)) idx.topicsByDisc.set(t.disciplineId, []);
    idx.topicsByDisc.get(t.disciplineId).push(t);
  });
  idx.topicsByDisc.forEach(list => list.sort((a,b) => (a.sortOrder - b.sortOrder) || sortByName(a,b)));
}

const getArea = id => state.idx.areaById.get(id) || null;
const getDiscipline = id => state.idx.discById.get(id) || null;
const getTopic = id => state.idx.topicById.get(id) || null;
const activeDisciplines = () => state.disciplines.filter(d => !d.archived);
const activeAreas = () => state.areas.filter(a => !a.archived);
const topicsOf = (discId, includeArchived) => (state.idx.topicsByDisc.get(discId) || []).filter(t => includeArchived || !t.archived);
const sessionsOf = discId => state.idx.sessionsByDisc.get(discId) || [];
const sessionsOfTopic = topicId => state.idx.sessionsByTopic.get(topicId) || [];

function disciplineName(id){ const d = getDiscipline(id); return d ? d.name : '(disciplina removida)'; }
function areaNameOf(disc){ const a = disc && disc.areaId ? getArea(disc.areaId) : null; return a ? a.name : 'Sem área'; }
function topicLabelOf(session){
  if(session.topicId){ const t = getTopic(session.topicId); if(t) return t.name; }
  return str(session.legacyTopicText);
}
function sessionTypeLabel(v){ const t = SESSION_TYPES.find(x => x.v === v); return t ? t.label : 'Não informado'; }
function difficultyInfo(v){ return DIFFICULTIES.find(d => d.v === v) || null; }
function reviewOutcomeLabel(v){ const o = REVIEW_OUTCOMES.find(x => x.v === v); return o ? o.label : null; }

/* ---------- v6.4: descansos e constância ---------- */
/** Descansos de um estudo (sempre uma lista; estudos antigos não têm nenhum). */
function breaksOf(session){ return session && Array.isArray(session.breaks) ? session.breaks : []; }
/** Minutos de descanso de um estudo. Nunca entram em `minutes`. */
function breakMinutesOf(session){ return sum(breaksOf(session), b => (isNum(b.minutes) && b.minutes > 0) ? b.minutes : 0); }
/** "23:50 → 00:12", quando o estudo tem horário de início e fim gravados. */
function sessionClockRange(session){
  const a = validInstant(session.startedAt), z = validInstant(session.endedAt);
  if(a === null || z === null || z <= a) return null;
  /* v6.5 — um horário que não fecha com a duração não é mostrado. Edições feitas
     até a v6.4.1 podiam mudar os minutos e deixar o horário antigo no registro;
     nesses estudos vale a duração, que é o que entra em todas as contas. */
  if(!TimeRules.clockInfo(session).consistent) return null;
  const nextDay = dateToISO(new Date(a)) !== dateToISO(new Date(z));
  return { text: `${fmtClockOfDay(a)} → ${fmtClockOfDay(z)}`, nextDay, start:a, end:z };
}
/** Dias (YYYY-MM-DD) com pelo menos um estudo de duração positiva. Descanso sozinho não cria dia ativo. */
function activeDaySet(sessions){
  const set = new Set();
  sessions.forEach(s => { if((Number(s.minutes) || 0) > 0) set.add(s.date); });
  return set;
}
/**
 * Ritmo recente — janela corrida de `days` dias terminando hoje.
 * Informa, não julga: só conta em quantos dias houve estudo.
 */
function recentRhythm(days){
  const n = days || 7;
  return DerivedCache.get('rhythm:' + n + ':' + todayISO(), () => {
    const end = today(), start = addDays(end, -(n - 1));
    const a = dateToISO(start), b = dateToISO(end);
    const active = activeDaySet(state.sessions.filter(s => s.date >= a && s.date <= b));
    let last = null;
    state.sessions.forEach(s => { if((Number(s.minutes) || 0) > 0 && s.date <= b && (!last || s.date > last)) last = s.date; });
    const strip = [];
    for(let i = 0; i < n; i++){ const iso = dateToISO(addDays(start, i)); strip.push({ iso, active: active.has(iso) }); }
    return { days:n, activeDays: active.size, strip, lastStudy:last, daysSinceLast: last ? daysSinceISO(last) : null };
  });
}
function lastStudyISO(disciplineId){
  const list = sessionsOf(disciplineId);
  if(!list.length) return null;
  return list.reduce((max, s) => (s.date > max ? s.date : max), list[0].date);
}
function sessionsInRange(range){
  const a = dateToISO(range.start), b = dateToISO(range.end);
  return state.sessions.filter(s => s.date >= a && s.date <= b);
}
function minutesInRange(range, disciplineId){
  return sum(sessionsInRange(range).filter(s => !disciplineId || s.disciplineId === disciplineId), s => s.minutes);
}

/* Status do tópico — derivado, nunca armazenado. */
function topicStatus(topic){
  const studied = sessionsOfTopic(topic.id).length > 0 || !!topic.firstStudiedAt;
  if(!studied) return 'nao_iniciado';
  const mastery = topic.masteryLevel || 0;
  if(topic.lastReviewedAt && mastery >= MASTERED_MIN_LEVEL && (topic.consecutiveSuccessfulReviews || 0) >= MASTERED_MIN_STREAK) return 'dominado';
  if(topic.lastReviewedAt) return 'em_revisao';
  return 'em_estudo';
}
const TOPIC_STATUS_LABEL = { nao_iniciado:'Não iniciado', em_estudo:'Em estudo', em_revisao:'Em revisão', dominado:'Dominado' };

/** Cobertura (tópicos vistos) e domínio (tópicos dominados) de uma disciplina. */
function disciplineProgress(discId){
  const tps = topicsOf(discId);
  const total = tps.length;
  if(!total) return { total:0, covered:0, mastered:0, coverage:null, mastery:null };
  let covered = 0, mastered = 0;
  tps.forEach(t => {
    const st = topicStatus(t);
    if(st !== 'nao_iniciado') covered++;
    if(st === 'dominado') mastered++;
  });
  return { total, covered, mastered, coverage: covered/total*100, mastery: mastered/total*100 };
}

/* =========================================================================
   PRIORITY ENGINE — única fonte de verdade para interpretar prioridade.

   Escala 1–5 normalizada:  n(p) = (p − 3) / 2  →  1:−1 · 2:−0,5 · 3:0 · 4:+0,5 · 5:+1

   • Disciplina: pesa no planejamento, na recomendação e na ordem entre
     disciplinas. Quase não mexe no intervalo de revisão dos tópicos.
   • Tópico: pesa na fila de revisão, no intervalo de revisão e na escolha
     do tópico dentro da disciplina.
   • Comparação GLOBAL entre tópicos usa a atenção efetiva:
         atenção = 0,7 · n(tópico) + 0,3 · n(disciplina)        (−1..+1)
     Exemplos: D5/T5 = +1 · D5/T2 = −0,05 · D1/T5 = +0,4 · D3/T3 = 0.
   • Prioridade é UM fator: atraso, esquecimento, domínio, prazo e plano
     continuam pesando (ver REVIEW_QUEUE_WEIGHTS e RECO).
   ========================================================================= */
const PRIORITY_MODEL = {
  TOPIC_SHARE: 0.7,
  DISCIPLINE_SHARE: 0.3,
  /* intervalo-base × multiplicador. 20 dias → 26 · 23 · 20 · 17 · 14 */
  TOPIC_INTERVAL: { 1:1.30, 2:1.15, 3:1.00, 4:0.85, 5:0.70 },
  /* a disciplina ajusta o intervalo em no máximo ±5% */
  DISCIPLINE_INTERVAL_SPAN: 0.05,
  /* estimativa de tempo de revisão */
  TOPIC_MINUTES: { 1:0.8, 2:0.8, 3:1.0, 4:1.2, 5:1.2 }
};

const PriorityEngine = {
  levels: PRIORITY_LEVELS,

  /** Qualquer valor → inteiro 1–5 (padrão 3). */
  clamp(p){ return normalizePriority(p); },
  label(p){ return PRIORITY_LABELS[this.clamp(p)]; },
  /** "5 · Muito alta" — número + texto, nunca só cor. */
  text(p){ const v = this.clamp(p); return `${v} · ${PRIORITY_LABELS[v]}`; },
  hint(p, context){
    const v = this.clamp(p);
    const byCtx = PRIORITY_CONTEXT_HINTS[context];
    return (byCtx && byCtx[v]) || PRIORITY_LEVELS[v - 1].hint;
  },
  normalized(p){ return (this.clamp(p) - 3) / 2; },

  /** Peso relativo da disciplina na distribuição do planejamento. */
  disciplinePriorityWeight(p){ return PLANNER.PRIORITY_WEIGHT[this.clamp(p)] || 1; },

  /** Peso do tópico dentro da disciplina (0,5 a 1,5). */
  topicPriorityWeight(p){ return 1 + 0.5 * this.normalized(p); },

  /** Atenção efetiva para comparar tópicos de disciplinas diferentes (−1..+1). */
  effectiveTopicAttention(topic){
    if(!topic) return 0;
    const d = getDiscipline(topic.disciplineId);
    return PRIORITY_MODEL.TOPIC_SHARE * this.normalized(topic.priority) +
           PRIORITY_MODEL.DISCIPLINE_SHARE * this.normalized(d ? d.priority : PRIORITY_DEFAULT);
  },

  /** Multiplicador aplicado DEPOIS do intervalo-base calculado pelo ReviewEngine. */
  reviewIntervalModifier(topic){
    if(!topic) return 1;
    const d = getDiscipline(topic.disciplineId);
    const byTopic = PRIORITY_MODEL.TOPIC_INTERVAL[this.clamp(topic.priority)] || 1;
    const byDisc = 1 - PRIORITY_MODEL.DISCIPLINE_INTERVAL_SPAN * this.normalized(d ? d.priority : PRIORITY_DEFAULT);
    return byTopic * byDisc;
  },

  /** Contribuição (positiva ou negativa) para a fila de revisão. */
  reviewQueueModifier(topic){ return REVIEW_QUEUE_WEIGHTS.PRIORITY * this.effectiveTopicAttention(topic); },

  /** Componente 0..1 da disciplina no motor de recomendação. */
  recommendationModifier(disc){ return disc ? (this.clamp(disc.priority) - 1) / 4 : 0.5; },

  /** Fator de tempo estimado para revisar um tópico. */
  minutesFactor(topic){ return topic ? (PRIORITY_MODEL.TOPIC_MINUTES[this.clamp(topic.priority)] || 1) : 1; },

  /** Encaminha para o DeadlineEngine (mantido aqui como ponto único de consulta). */
  deadlineInfluence({ topic, disciplineId } = {}){
    return topic ? DeadlineEngine.forTopic(topic) : DeadlineEngine.forDiscipline(disciplineId);
  }
};

/* =========================================================================
   DEADLINE ENGINE — quanto cada prazo deve influenciar o sistema AGORA.
     urgência = proximidade(dias) × fator(prioridade)           (0..1)
   Proximidade (categorias internas, nunca mostradas como alarme):
     >60 d: 0,05 · 31–60: 0,10 · 15–30: 0,25 · 8–14: 0,45 · 4–7: 0,70
     2–3: 0,85 · 0–1: 1
   Fator de prioridade: 0,6 · 0,7 · 0,8 · 0,9 · 1,0  (P1…P5)
   Um prazo só influencia quando: não está concluído, a data de início
   (se houver) já chegou e a data do prazo não passou.
   ========================================================================= */
const DEADLINE_MODEL = {
  PROXIMITY: [
    { maxDays:1,  value:1.00 },
    { maxDays:3,  value:0.85 },
    { maxDays:7,  value:0.70 },
    { maxDays:14, value:0.45 },
    { maxDays:30, value:0.25 },
    { maxDays:60, value:0.10 }
  ],
  FAR_VALUE: 0.05,
  DISCIPLINE_WIDE_ON_TOPIC: 0.5,   // prazo da disciplina sem tópico → metade para cada tópico
  NOTEWORTHY: 0.45                 // a partir daqui vira motivo explícito ("Prova em 10 dias")
};

const DeadlineEngine = {
  isDone(dl){ return !!dl && dl.status === 'completed'; },
  daysLeft(dl){ return dl ? daysUntilISO(dl.date) : null; },
  hasStarted(dl){
    if(!dl || !dl.startDate) return true;
    return str(dl.startDate) <= todayISO();
  },
  /** Pendente/em andamento, iniciado e com data ainda por vir (hoje incluso). */
  isActive(dl){
    if(!dl || this.isDone(dl) || !this.hasStarted(dl)) return false;
    const n = this.daysLeft(dl);
    return n !== null && n >= 0;
  },
  isOverdue(dl){ const n = this.daysLeft(dl); return !!dl && !this.isDone(dl) && n !== null && n < 0; },
  proximity(days){
    if(days === null || days < 0) return 0;
    for(const r of DEADLINE_MODEL.PROXIMITY) if(days <= r.maxDays) return r.value;
    return DEADLINE_MODEL.FAR_VALUE;
  },
  priorityFactor(p){ return 0.5 + 0.1 * PriorityEngine.clamp(p); },
  urgency(dl){
    if(!this.isActive(dl)) return 0;
    return this.proximity(this.daysLeft(dl)) * this.priorityFactor(dl.priority);
  },
  /** Prazos que ainda contam (não concluídos), do mais próximo ao mais distante. */
  open(){
    return state.deadlines.filter(d => !this.isDone(d))
      .sort((a,b) => str(a.date).localeCompare(str(b.date)));
  },
  /** Maior urgência entre os prazos da disciplina (com ou sem tópico). */
  forDiscipline(disciplineId){
    if(!disciplineId) return { score:0, deadline:null, days:null };
    return DerivedCache.get('dlDisc:' + disciplineId + ':' + todayISO(), () => this._forDiscipline(disciplineId));
  },
  _forDiscipline(disciplineId){
    let best = { score:0, deadline:null, days:null };
    state.deadlines.forEach(dl => {
      if(dl.disciplineId !== disciplineId) return;
      const u = this.urgency(dl);
      if(u > best.score) best = { score:u, deadline:dl, days:this.daysLeft(dl) };
    });
    return best;
  },
  /**
   * Urgência para um tópico: prazo do PRÓPRIO tópico conta inteiro; prazo da
   * disciplina sem tópico conta pela metade. Prazo de outro tópico não conta.
   */
  forTopic(topic){
    let best = { score:0, deadline:null, days:null, specific:false };
    if(!topic) return best;
    state.deadlines.forEach(dl => {
      let factor = 0;
      if(dl.topicId && dl.topicId === topic.id) factor = 1;
      else if(!dl.topicId && dl.disciplineId && dl.disciplineId === topic.disciplineId) factor = DEADLINE_MODEL.DISCIPLINE_WIDE_ON_TOPIC;
      if(!factor) return;
      const u = this.urgency(dl) * factor;
      if(u > best.score) best = { score:u, deadline:dl, days:this.daysLeft(dl), specific: factor === 1 };
    });
    return best;
  },
  /** "Prova de Redes em 5 dias" / "Entrega do Projeto amanhã". */
  phrase(dl){
    const n = this.daysLeft(dl);
    const when = n === null ? '' : n < 0 ? `venceu ${fmtRelativePast(dl.date)}` : n === 0 ? 'hoje' : n === 1 ? 'amanhã' : `em ${n} dias`;
    return `${dl.title} ${when}`.trim();
  },
  /** "Entrega em 6 dias" · "Prova hoje" · "Prazo venceu há 2 dias". */
  dueText(dl){
    const info = deadlineTypeInfo(dl.type);
    const n = this.daysLeft(dl);
    // v6.5: `completedAt` é um instante (UTC); o DIA em que foi concluído é o dia LOCAL daquele instante.
    // Cortar os 10 primeiros caracteres lia o dia em UTC: concluir às 22h30 em Brasília aparecia como "amanhã".
    if(this.isDone(dl)){ const day = localDateOfStamp(dl.completedAt); return 'Concluído' + (day ? ' em ' + fmtDateBR(day) : ''); }
    if(n === null) return info.dueWord;
    if(n < 0) return `${info.dueWord} venceu há ${-n} ${-n === 1 ? 'dia' : 'dias'}`;
    if(n === 0) return `${info.dueWord} hoje`;
    if(n === 1) return `${info.dueWord} amanhã`;
    return `${info.dueWord} em ${n} dias`;
  }
};

/* =========================================================================
   v6.5 — PLAN RULES: o que "Plano cumprido" quer dizer.

   O plano semanal divide o tempo entre disciplinas. "Cumprir o plano" é
   estudar, em CADA disciplina, o que foi planejado para ela. Por isso:

       plano cumprido = Σ min(realizado, planejado)  ÷  Σ planejado
                        (por disciplina, em cada semana)

   Tempo a mais numa disciplina não compensa o que faltou em outra: planejou
   1h de Redes e 1h de Matemática e estudou 2h de Redes → 50% do plano, com
   1h "além do plano" mostrada à parte. O volume total continua visível
   ("estudado no total"); ele só não é mais chamado de plano cumprido.
   Antes da v6.5 a conta era Σ realizado ÷ Σ planejado, e o exemplo acima
   aparecia como 100%.
   ========================================================================= */
const PlanRules = {
  /** Quanto do realizado conta para o plano de UMA disciplina numa semana. */
  counted(planned, realized){ return Math.max(0, Math.min(Number(realized) || 0, Number(planned) || 0)); },
  /**
   * pares = [{ planned, realized }] (um por disciplina e semana) + tempo sem plano.
   * → { planned, realized, counted, extra, remaining, pct, volumePct }
   */
  summarize(pairs, unplannedRealized){
    const planned = sum(pairs, x => Number(x.planned) || 0);
    const realized = sum(pairs, x => Number(x.realized) || 0) + (Number(unplannedRealized) || 0);
    const counted = sum(pairs, x => this.counted(x.planned, x.realized));
    return {
      planned, realized, counted,
      extra: Math.max(0, realized - counted),
      remaining: Math.max(0, planned - counted),
      pct: planned > 0 ? (counted / planned) * 100 : null,
      volumePct: planned > 0 ? (realized / planned) * 100 : null
    };
  }
};

/* =========================================================================
   PLAN ENGINE — distribui minutos semanais entre disciplinas.
   ========================================================================= */
const PlannerEngine = {
  /**
   * Distribui `availableMinutes` entre allocations [{disciplineId, priority, minWeeklyMinutes}].
   * 1) respeita mínimos  2) divide o resto por peso de prioridade (× urgência de prazo)
   * 3) arredonda em blocos de 5  4) corrige resíduo para bater o total exato.
   */
  generatePlan(availableMinutes, allocations){
    const total = Math.max(0, Math.round(availableMinutes) || 0);
    const items = allocations.map(a => ({
      disciplineId: a.disciplineId,
      priority: clamp(Number(a.priority) || 3, 1, 5),
      minWeeklyMinutes: Math.max(0, Math.round(Number(a.minWeeklyMinutes) || 0)),
      targetMinutes: 0
    }));
    if(!items.length) return { allocations: items, conflict:null };

    const minsTotal = sum(items, i => i.minWeeklyMinutes);
    let conflict = null;

    if(minsTotal > total){
      // Mínimos excedem a disponibilidade: reduz proporcionalmente, mas reporta o conflito.
      conflict = { minimumsTotal: minsTotal, available: total, excess: minsTotal - total };
      const factor = total > 0 ? total / minsTotal : 0;
      items.forEach(i => { i.targetMinutes = Math.max(0, roundTo(i.minWeeklyMinutes * factor, PLANNER.ROUND_TO)); });
      this._fixResidual(items, total);
      return { allocations: items, conflict };
    }

    items.forEach(i => { i.targetMinutes = i.minWeeklyMinutes; });

    let remaining = total - minsTotal;
    if(remaining > 0){
      const weights = items.map(i => {
        return PriorityEngine.disciplinePriorityWeight(i.priority) * this._deadlineMultiplier(i.disciplineId);
      });
      const weightSum = sum(weights);
      if(weightSum > 0){
        items.forEach((i, k) => {
          i.targetMinutes += roundTo((remaining * weights[k]) / weightSum, PLANNER.ROUND_TO);
        });
      } else {
        const each = roundTo(remaining / items.length, PLANNER.ROUND_TO);
        items.forEach(i => { i.targetMinutes += each; });
      }
    }

    this._fixResidual(items, total);
    return { allocations: items, conflict };
  },

  /** Prazo ativo e próximo aumenta o peso da disciplina (até 1,6×). */
  _deadlineMultiplier(disciplineId){
    return 1 + PLANNER.DEADLINE_BOOST * DeadlineEngine.forDiscipline(disciplineId).score;
  },

  /** Ajusta o maior item (ou o menor) para que a soma feche exatamente em `total`. */
  _fixResidual(items, total){
    items.forEach(i => { i.targetMinutes = Math.max(0, Math.round(i.targetMinutes)); });
    let diff = total - sum(items, i => i.targetMinutes);
    let guard = 0;
    while(diff !== 0 && guard++ < 400){
      const step = diff > 0 ? PLANNER.ROUND_TO : -PLANNER.ROUND_TO;
      const chunk = Math.abs(diff) >= PLANNER.ROUND_TO ? step : diff;
      const sorted = items.slice().sort((a,b) => b.targetMinutes - a.targetMinutes);
      const target = chunk > 0 ? sorted[0] : sorted.find(i => i.targetMinutes + chunk >= 0) || sorted[0];
      target.targetMinutes = Math.max(0, target.targetMinutes + chunk);
      diff = total - sum(items, i => i.targetMinutes);
    }
  },

  activePlan(){ return state.plans.find(p => p.active) || null; },

  /** Snapshot da semana: garante que a semana corrente tem seu próprio plano histórico. */
  async ensureWeeklyPlan(dateRef){
    const base = this.activePlan();
    if(!base) return null;
    const ws = dateToISO(startOfWeek(dateRef || today()));
    const existing = state.weeklyPlans.find(w => w.weekStart === ws);
    if(existing) return existing;
    const wp = {
      id: ws,
      weekStart: ws,
      weekEnd: dateToISO(addDays(parseISO(ws), 6)),
      basePlanId: base.id,
      availableMinutes: base.weeklyAvailableMinutes,
      allocations: base.allocations.map(a => ({ ...a })),
      createdAt: nowISO(), updatedAt: nowISO()
    };
    // v6.5: cria só se ainda não existe NO BANCO — duas abas na virada da semana não se sobrescrevem.
    const saved = await DB.atomic(['weeklyPlans'], async api => {
      const cur = await api.get('weeklyPlans', ws);
      if(cur) return cur;
      api.put('weeklyPlans', wp);
      return wp;
    });
    state.weeklyPlans.push(saved);
    return saved;
  },

  weeklyPlanFor(dateRef){
    const ws = dateToISO(startOfWeek(dateRef || today()));
    return state.weeklyPlans.find(w => w.weekStart === ws) || null;
  },

  /** Progresso da semana corrente: planejado × realizado, geral e por disciplina. */
  getCurrentWeekProgress(dateRef){
    const ws = dateToISO(startOfWeek(dateRef || today()));
    return DerivedCache.get('weekProgress:' + ws, () => this._computeWeekProgress(dateRef));
  },

  _computeWeekProgress(dateRef){
    const ref = dateRef || today();
    const wp = this.weeklyPlanFor(ref);
    const range = { start: startOfWeek(ref), end: endOfWeek(ref) };
    const weekSessions = sessionsInRange(range);
    const realizedByDisc = new Map();
    weekSessions.forEach(s => realizedByDisc.set(s.disciplineId, (realizedByDisc.get(s.disciplineId) || 0) + s.minutes));

    const perDiscipline = [];
    let countedTotal = 0;
    if(wp){
      wp.allocations.forEach(a => {
        const planned = a.targetMinutes || 0;
        const realized = realizedByDisc.get(a.disciplineId) || 0;
        countedTotal += PlanRules.counted(planned, realized);
        const d = getDiscipline(a.disciplineId);
        if(!d || d.archived) return;
        perDiscipline.push({
          disciplineId: a.disciplineId,
          planned,
          realized,
          remaining: Math.max(0, planned - realized)
        });
      });
    }
    const plannedTotal = wp ? sum(wp.allocations, a => a.targetMinutes || 0) : 0;
    const realizedTotal = sum(weekSessions, s => s.minutes);
    /* v6.5 — "Plano cumprido" mede a DISTRIBUIÇÃO, não o volume (ver PlanRules):
       `pct` conta, de cada disciplina, no máximo o que foi planejado para ela.
       `extraTotal` é o tempo estudado além disso — aparece à parte, nunca somado. */
    return {
      weeklyPlan: wp, range, plannedTotal, realizedTotal,
      countedTotal,
      extraTotal: Math.max(0, realizedTotal - countedTotal),
      remainingTotal: Math.max(0, plannedTotal - countedTotal),
      pct: plannedTotal > 0 ? (countedTotal / plannedTotal) * 100 : null,
      volumePct: plannedTotal > 0 ? (realizedTotal / plannedTotal) * 100 : null,
      perDiscipline
    };
  },

  calculateDeficits(dateRef){
    const p = this.getCurrentWeekProgress(dateRef);
    const map = new Map();
    p.perDiscipline.forEach(x => map.set(x.disciplineId, x));
    return map;
  }
};

/* =========================================================================
   REVIEW ENGINE — revisão espaçada simples, adaptativa e transparente.
   ========================================================================= */
/* =========================================================================
   REVIEW ENGINE v2 — separa claramente duas perguntas:
     QUANDO revisar → estratégia (adaptive | fixed | intensive | maintenance)
     COMO revisar   → método (recordação ativa, exercícios, explicação…)

   Herança de configuração: global → disciplina → tópico.
   Quem estiver como 'inherit' usa o nível acima.
   ========================================================================= */
const ReviewEngine = {

  /* ---------- herança ---------- */

  /** Estratégia efetiva de um tópico, resolvendo a cadeia de herança. */
  effectiveStrategy(topic){
    if(topic && topic.reviewStrategy && topic.reviewStrategy !== 'inherit') return topic.reviewStrategy;
    const d = topic ? getDiscipline(topic.disciplineId) : null;
    if(d && d.reviewStrategy && d.reviewStrategy !== 'inherit') return d.reviewStrategy;
    return state.settings.defaultReviewStrategy || 'adaptive';
  },

  /** De onde veio a estratégia efetiva — usado para explicar ao usuário. */
  strategySource(topic){
    if(topic && topic.reviewStrategy && topic.reviewStrategy !== 'inherit') return 'topic';
    const d = topic ? getDiscipline(topic.disciplineId) : null;
    if(d && d.reviewStrategy && d.reviewStrategy !== 'inherit') return 'discipline';
    return 'global';
  },

  /** Método configurado (pode ser 'auto'), resolvendo a herança. */
  configuredMethod(topic){
    if(topic && topic.preferredReviewMethod && topic.preferredReviewMethod !== 'inherit') return topic.preferredReviewMethod;
    const d = topic ? getDiscipline(topic.disciplineId) : null;
    if(d && d.preferredReviewMethod && d.preferredReviewMethod !== 'inherit') return d.preferredReviewMethod;
    return state.settings.defaultReviewMethod || 'auto';
  },

  /**
   * Método efetivo + motivo. Quando está em 'auto', escolhe pela natureza do
   * conteúdo da disciplina; se o último resultado foi ruim, prefere um método
   * mais exigente de recuperação.
   */
  effectiveMethod(topic){
    const configured = this.configuredMethod(topic);
    if(configured !== 'auto') {
      return { method: configured, auto:false, reason:'Você escolheu este jeito de revisar para este conteúdo.' };
    }
    const d = topic ? getDiscipline(topic.disciplineId) : null;
    const nature = (d && d.contentNature) || 'mixed';
    const options = AUTO_METHOD_BY_NATURE[nature] || AUTO_METHOD_BY_NATURE.mixed;

    let pick = options[0];
    let reason = `Sugerido porque o conteúdo desta disciplina é do tipo "${contentNatureLabel(nature)}".`;

    // Alternar entre as opções da natureza evita repetir sempre o mesmo método.
    if(options.length > 1 && topic && (topic.reviewRepetitions || 0) % 2 === 1){
      pick = options[1];
      reason = `Sugerido para variar a forma de revisar dentro de "${contentNatureLabel(nature)}".`;
    }
    // Depois de esquecer, recuperação ativa costuma ser o retorno mais seguro.
    if(topic && topic.lastReviewOutcome === 'forgot'){
      pick = 'active_recall';
      reason = 'Sugerido porque na última revisão você esqueceu boa parte do conteúdo.';
    }
    return { method: pick, auto:true, reason };
  },

  methodGuide(method){ return REVIEW_METHOD_GUIDES[method] || REVIEW_METHOD_GUIDES.active_recall; },

  /** Minutos estimados para revisar um tópico com determinado método. */
  estimateMinutes(topic, method){
    const base = METHOD_MINUTES[method] || state.settings.defaultReviewMinutes || 15;
    // prioridade alta do tópico merece um pouco mais de tempo, sem distorcer a conta
    const factor = PriorityEngine.minutesFactor(topic);
    return Math.max(5, Math.round((base * factor) / 5) * 5);
  },

  /* ---------- agendamento ---------- */

  /** Primeiro intervalo de uma estratégia (1 dia na adaptativa; o 1º passo nos ciclos). */
  firstInterval(strategy){
    const steps = CYCLE_STEPS[strategy];
    return steps ? steps[0] : 1;
  },

  /* v6.5 — "agendar a primeira revisão" e "aplicar o resultado de uma revisão"
     saíram daqui: quem altera o tópico agora é só o TopicReconciler (uma fonte de
     verdade para criar, editar, mover e excluir). Aqui ficam as REGRAS puras que
     ele usa: firstInterval, computeNext e nextMastery. */

  /**
   * v6.5 — a REGRA do próximo intervalo, pura: não lê `state`, não toca em tópico.
   *   p = { strategy, prevInterval, cycleStep, outcome, intervalModifier, deadlineDays }
   *   → { interval, cycleStep } ou null se o resultado não existe.
   * É a mesma conta de sempre, só isolada para poder ser usada também quando um
   * estudo é corrigido (TopicReconciler) e para ser testada sem navegador.
   */
  computeNext(p){
    const rule = REVIEW[p.outcome];
    if(!rule) return null;
    const strategy = p.strategy || 'adaptive';
    const prev = (isNum(p.prevInterval) && p.prevInterval > 0) ? p.prevInterval : 1;
    let cycleStep = isNum(p.cycleStep) ? p.cycleStep : 0;

    let interval;
    if(strategy === 'adaptive'){
      // evolução direta da v3: multiplicador com piso por resultado
      interval = rule.mult === 0 ? rule.floor : Math.max(rule.floor, Math.round(prev * rule.mult));
    } else {
      // ciclos programados: o resultado move o passo dentro do ciclo
      const steps = CYCLE_STEPS[strategy] || CYCLE_STEPS.fixed;
      let step = clamp(cycleStep, 0, steps.length - 1);
      if(p.outcome === 'forgot') step = 0;                       // recomeça o ciclo
      else if(p.outcome === 'hard') step = Math.max(0, step);     // repete o passo atual
      else if(p.outcome === 'remembered') step = Math.min(steps.length - 1, step + 1);
      else if(p.outcome === 'mastered') step = Math.min(steps.length - 1, step + 2);
      cycleStep = step;
      interval = steps[step];
    }
    interval = clamp(interval, 1, REVIEW_MAX_INTERVAL);

    // v5.2 — a prioridade do tópico MODULA o intervalo-base (não o substitui).
    // "Esqueci" continua voltando no dia seguinte, qualquer que seja a prioridade.
    if(p.outcome !== 'forgot'){
      const mod = (isNum(p.intervalModifier) && p.intervalModifier > 0) ? p.intervalModifier : 1;
      interval = Math.max(1, Math.round(interval * mod));
    }
    // Prazo ativo ligado ao tópico: a próxima revisão cai antes dele.
    if(isNum(p.deadlineDays) && p.deadlineDays >= 2 && interval > p.deadlineDays - 1){
      interval = Math.max(1, p.deadlineDays - 1);
    }
    return { interval: clamp(interval, 1, REVIEW_MAX_INTERVAL), cycleStep };
  },

  /** Domínio e sequência de acertos depois de um resultado (regra pura, igual em todas as estratégias). */
  nextMastery(mastery, streak, outcome){
    const rule = REVIEW[outcome];
    if(!rule) return { mastery, streak };
    const m = mastery || REVIEW_INITIAL_MASTERY;
    return {
      mastery: (rule.mastery === 'max') ? 5 : clamp(m + rule.mastery, 1, 5),
      streak: rule.resetStreak ? 0 : (streak || 0) + 1
    };
  },

  /**
   * Revisão intensiva volta sozinha ao normal quando o prazo que a justificava
   * já passou — o usuário é avisado, nada é alterado em silêncio.
   */
  intensiveExpired(topic){
    if(this.effectiveStrategy(topic) !== 'intensive') return false;
    const d = getDiscipline(topic.disciplineId);
    if(!d) return false;
    const future = state.deadlines.some(dl => !DeadlineEngine.isDone(dl) && dl.disciplineId === d.id && (daysUntilISO(dl.date) ?? -1) >= 0);
    return !future;
  },

  /* ---------- consultas ---------- */

  /** Tópicos elegíveis a revisão (ativos, com revisão ligada e já agendados). */
  allScheduled(){
    return state.topics.filter(t => {
      if(t.archived || !t.reviewEnabled || !t.reviewDueDate) return false;
      const d = getDiscipline(t.disciplineId);
      return d && !d.archived;
    });
  },

  getDueReviews(refISO){
    const ref = refISO || todayISO();
    // Lista consultada dezenas de vezes por render (uma vez por disciplina).
    // O resultado é o mesmo enquanto os dados não mudarem.
    return DerivedCache.get('dueReviews:' + ref, () => this.allScheduled()
      .filter(t => t.reviewDueDate <= ref)
      .sort((a,b) => a.reviewDueDate.localeCompare(b.reviewDueDate) || sortByName(a,b)));
  },

  /** Contagem de vencidas por disciplina, calculada de uma vez só. */
  dueCountMap(){
    return DerivedCache.get('dueCountMap:' + todayISO(), () => {
      const m = new Map();
      this.getDueReviews().forEach(t => m.set(t.disciplineId, (m.get(t.disciplineId) || 0) + 1));
      return m;
    });
  },

  getUpcomingReviews(days){
    const from = addDaysISO(todayISO(), 1);
    const to = addDaysISO(todayISO(), days || 7);
    return this.allScheduled()
      .filter(t => t.reviewDueDate >= from && t.reviewDueDate <= to)
      .sort((a,b) => a.reviewDueDate.localeCompare(b.reviewDueDate) || sortByName(a,b));
  },

  dueCountFor(disciplineId){ return this.dueCountMap().get(disciplineId) || 0; },
  maxOverdueDaysFor(disciplineId){
    const due = this.getDueReviews().filter(t => t.disciplineId === disciplineId);
    if(!due.length) return 0;
    return Math.max(...due.map(t => Math.max(0, -(daysUntilISO(t.reviewDueDate) || 0))));
  },
  calculateTopicStatus(topic){ return topicStatus(topic); },

  /* ---------- fila inteligente ---------- */

  /**
   * Pontua uma revisão pendente. O número nunca aparece na interface:
   * o usuário vê apenas os motivos em texto.
   */
  scoreDue(topic){
    const W = REVIEW_QUEUE_WEIGHTS;
    const daysLate = -(daysUntilISO(topic.reviewDueDate) || 0);   // >0 = atrasada
    const reasons = [];
    let score = 0;

    if(daysLate > 0){
      score += W.OVERDUE_BASE + Math.min(daysLate, W.OVERDUE_DAY_CAP) * W.OVERDUE_PER_DAY;
      reasons.push(`atrasada há ${daysLate} ${daysLate === 1 ? 'dia' : 'dias'}`);
    } else if(daysLate === 0){
      score += W.DUE_TODAY;
      reasons.push('prevista para hoje');
    }

    // prioridade: tópico pesa 70%, disciplina 30% (PriorityEngine). Pode subir ou descer.
    score += PriorityEngine.reviewQueueModifier(topic);
    const tp = PriorityEngine.clamp(topic.priority);
    const disc = getDiscipline(topic.disciplineId);
    if(tp >= 4) reasons.push(`prioridade ${PRIORITY_LABELS[tp].toLowerCase()}`);
    else if(tp === 3 && disc && PriorityEngine.clamp(disc.priority) === 5) reasons.push(`${disc.name} é prioridade muito alta`);

    const mastery = topic.masteryLevel || REVIEW_INITIAL_MASTERY;
    if(mastery <= 2){ score += W.LOW_MASTERY * ((3 - mastery) / 2); reasons.push(`ainda pouco consolidado (${mastery} de 5)`); }

    if(topic.lastReviewOutcome === 'forgot'){ score += W.BAD_LAST_RESULT; reasons.push('você esqueceu na última revisão'); }
    else if(topic.lastReviewOutcome === 'hard'){ score += W.BAD_LAST_RESULT * 0.6; reasons.push('você teve dificuldade na última revisão'); }

    const fails = topic.reviewFailures || 0;
    if(fails >= 2){ score += Math.min(W.FORGET_RATE, fails * 3); reasons.push(`já esqueceu ${fails} vezes`); }

    // prazo: prioridade × proximidade. Prazo de outro tópico não conta.
    const dl = DeadlineEngine.forTopic(topic);
    if(dl.score > 0){
      score += W.DEADLINE * dl.score;
      if(dl.days !== null && dl.days <= 14) reasons.push(DeadlineEngine.phrase(dl.deadline));
    }

    const since = topic.lastReviewedAt ? daysSinceISO(topic.lastReviewedAt) : daysSinceISO(topic.firstStudiedAt);
    if(since !== null && since > 30){ score += W.STALE; reasons.push('sem revisar há mais de um mês'); }

    if(!reasons.length) reasons.push('na fila de revisão');
    return { topic, score, daysLate, reasons };
  },

  /** Fila ordenada por relevância, não apenas por data. */
  rankedQueue(){
    return this.getDueReviews().map(t => this.scoreDue(t))
      .sort((a,b) => b.score - a.score || a.topic.reviewDueDate.localeCompare(b.topic.reviewDueDate));
  },

  /**
   * Monta uma sessão de revisão que cabe no tempo informado.
   * Pega os itens mais relevantes enquanto o tempo estimado couber;
   * garante pelo menos um item para a sessão nunca vir vazia.
   */
  buildSession(availableMinutes){
    const budget = Math.max(5, Math.round(Number(availableMinutes) || 20));
    const ranked = this.rankedQueue();
    const picked = [];
    let used = 0;
    for(const entry of ranked){
      const em = this.effectiveMethod(entry.topic);
      const minutes = this.estimateMinutes(entry.topic, em.method);
      if(used + minutes > budget && picked.length) continue;   // tenta o próximo, menor
      picked.push({ ...entry, method: em.method, methodAuto: em.auto, methodReason: em.reason, minutes });
      used += minutes;
      if(used >= budget) break;
    }
    return { items: picked, totalMinutes: used, budget, remaining: Math.max(0, ranked.length - picked.length) };
  }
};

/* =========================================================================
   RECOMMENDATION ENGINE — sistema local de recomendação (determinístico).
   Não é IA: são regras explicáveis, com pesos declarados em RECO.
   ========================================================================= */
const RecommendationEngine = {
  /**
   * Componentes normalizados (0..1) de uma disciplina. Cada fator é limitado a
   * 0..1 antes de receber peso, então prioridade + prazo + revisões nunca somam
   * um valor capaz de travar a recomendação numa só disciplina por semanas.
   */
  scoreDiscipline(disc, ctx){
    const prog = ctx.deficits.get(disc.id);
    const planned = prog ? prog.planned : 0;
    const realized = prog ? prog.realized : (ctx.realizedByDisc.get(disc.id) || 0);
    const remaining = prog ? prog.remaining : 0;

    // Sem plano ativo, todas partem de um déficit neutro para não travar a recomendação.
    const deficitScore = planned > 0 ? clamp(remaining / planned, 0, 1) : 0.5;
    const priorityScore = clamp(PriorityEngine.recommendationModifier(disc), 0, 1);

    const lastISO = lastStudyISO(disc.id);
    const daysSince = lastISO === null ? RECO.RECENCY_CAP_DAYS : (daysSinceISO(lastISO) || 0);
    const recencyScore = clamp(daysSince / RECO.RECENCY_CAP_DAYS, 0, 1);

    const dlInfo = DeadlineEngine.forDiscipline(disc.id);
    const deadline = dlInfo.deadline ? { dl: dlInfo.deadline, days: dlInfo.days, score: dlInfo.score } : null;
    const deadlineScore = clamp(dlInfo.score, 0, 1);

    const dueTopics = ReviewEngine.getDueReviews().filter(t => t.disciplineId === disc.id);
    const dueCount = dueTopics.length;
    const overdue = ReviewEngine.maxOverdueDaysFor(disc.id);
    // revisões de tópicos prioritários pressionam um pouco mais (±25%), sempre limitado a 1
    const meanAttention = dueCount ? sum(dueTopics, t => PriorityEngine.effectiveTopicAttention(t)) / dueCount : 0;
    const reviewPressureScore = clamp(((dueCount / RECO.REVIEW_CAP) + (overdue > 0 ? 0.2 : 0)) * (1 + 0.25 * meanAttention), 0, 1);

    const lowMasteryScore = this._lowMastery(disc.id);
    const overTargetPenalty = planned > 0 ? clamp((realized - planned) / planned, 0, 1) : 0;

    const score =
      RECO.W_DEFICIT      * deficitScore +
      RECO.W_PRIORITY     * priorityScore +
      RECO.W_RECENCY      * recencyScore +
      RECO.W_DEADLINE     * deadlineScore +
      RECO.W_REVIEW       * reviewPressureScore +
      RECO.W_LOW_MASTERY  * lowMasteryScore -
      RECO.W_OVER_TARGET  * overTargetPenalty;

    return {
      score,
      parts:{ deficitScore, priorityScore, recencyScore, deadlineScore, reviewPressureScore, lowMasteryScore, overTargetPenalty },
      facts:{ planned, realized, remaining, daysSince, lastISO, deadline, dueCount, overdue }
    };
  },

  _lowMastery(disciplineId){
    const tps = topicsOf(disciplineId).filter(t => t.masteryLevel);
    if(!tps.length) return 0.5;
    const avg = sum(tps, t => t.masteryLevel) / tps.length;
    return clamp(1 - ((avg - 1) / 4), 0, 1);
  },

  /**
   * Escolhe o tópico da vez dentro da disciplina. Dentro de uma disciplina só a
   * prioridade do TÓPICO importa (a da disciplina é igual para todos).
   * Ordem: revisão vencida (fila inteligente) → prazo do próprio tópico →
   * domínio baixo → sem contato há dias → não iniciado → em andamento.
   */
  pickTopic(disciplineId){
    const tps = topicsOf(disciplineId);
    if(!tps.length) return { topic:null, suggestedType:null, reason:null };
    const w = t => PriorityEngine.topicPriorityWeight(t.priority);
    const byPriority = (a, b) => w(b) - w(a);

    const due = tps.filter(t => t.reviewEnabled && t.reviewDueDate && t.reviewDueDate <= todayISO())
                   .map(t => ReviewEngine.scoreDue(t))
                   .sort((a, b) => b.score - a.score);
    if(due.length) return { topic:due[0].topic, suggestedType:'revisao', reason:'revisão pendente deste tópico' };

    const withDeadline = tps.map(t => ({ t, dl: DeadlineEngine.forTopic(t) }))
      .filter(x => x.dl.specific && x.dl.score >= DEADLINE_MODEL.NOTEWORTHY)
      .sort((a, b) => b.dl.score - a.dl.score);
    if(withDeadline.length) return { topic:withDeadline[0].t, suggestedType:null, reason: DeadlineEngine.phrase(withDeadline[0].dl.deadline) };

    const inStudy = tps.filter(t => topicStatus(t) === 'em_estudo' || topicStatus(t) === 'em_revisao');
    const lowRetention = inStudy.filter(t => (t.masteryLevel || 5) <= 2)
                                .sort((a, b) => ((a.masteryLevel || 5) - (b.masteryLevel || 5)) || byPriority(a, b));
    if(lowRetention.length) return { topic:lowRetention[0], suggestedType:null, reason:'tópico ainda pouco consolidado' };

    // tempo sem contato ponderado pela prioridade do tópico
    const stale = inStudy.filter(t => t.lastStudiedAt && (daysSinceISO(t.lastStudiedAt) || 0) >= 3)
                         .sort((a, b) => ((daysSinceISO(b.lastStudiedAt) || 0) * w(b)) - ((daysSinceISO(a.lastStudiedAt) || 0) * w(a)));
    if(stale.length) return { topic:stale[0], suggestedType:null, reason:'em estudo, mas sem contato há dias' };

    const notStarted = tps.filter(t => topicStatus(t) === 'nao_iniciado').sort(byPriority);   // sort estável: mantém a ordem manual
    if(notStarted.length) return { topic:notStarted[0], suggestedType:null, reason:'próximo tópico ainda não iniciado' };

    if(inStudy.length) return { topic:inStudy.slice().sort(byPriority)[0], suggestedType:null, reason:'continuar o conteúdo em andamento' };
    return { topic:null, suggestedType:null, reason:null };
  },

  /** Duração sugerida: padrão, reduzida quando falta pouco para fechar a semana. */
  suggestDuration(remainingMinutes, isReview){
    const base = isReview
      ? (state.settings.defaultReviewMinutes || 20)
      : (state.settings.defaultSessionMinutes || 40);
    if(remainingMinutes > 0 && remainingMinutes < base){
      return Math.max(PLANNER.MIN_BLOCK, roundTo(remainingMinutes, PLANNER.ROUND_TO));
    }
    return base;
  },

  /** Frases explicáveis a partir dos componentes que realmente pesaram. Nunca o score. */
  buildReasons(disc, scored, topicPick){
    const r = [];
    const f = scored.facts;
    if(f.planned > 0 && f.remaining > 0) r.push(`ainda faltam ${fmtDuration(f.remaining)} de ${disc.name} no plano desta semana`);
    else if(f.planned > 0 && f.remaining === 0) r.push('plano semanal desta disciplina já cumprido');
    const dp = PriorityEngine.clamp(disc.priority);
    if(dp >= 4) r.push(`${disc.name} é prioridade ${PRIORITY_LABELS[dp].toLowerCase()}`);
    const topic = topicPick && topicPick.topic;
    if(topic && PriorityEngine.clamp(topic.priority) >= 4) r.push(`${topic.name} é prioridade ${PriorityEngine.label(topic.priority).toLowerCase()}`);
    if(f.lastISO === null) r.push('ainda sem nenhum estudo registrado');
    else if(f.daysSince >= 2) r.push(`último estudo ${fmtRelativePast(f.lastISO)}`);
    if(f.dueCount > 0) r.push(`${f.dueCount} ${f.dueCount === 1 ? 'revisão pendente' : 'revisões pendentes'}${f.overdue > 0 ? ` (atraso de ${f.overdue} ${f.overdue===1?'dia':'dias'})` : ''}`);
    if(f.deadline && f.deadline.days !== null && f.deadline.days <= 30 && !(topicPick && topicPick.reason === DeadlineEngine.phrase(f.deadline.dl))){
      r.push(DeadlineEngine.phrase(f.deadline.dl));
    }
    if(scored.parts.overTargetPenalty > 0) r.push(`já passou ${fmtDuration(f.realized - f.planned)} do planejado nesta semana`);
    if(topicPick && topicPick.reason) r.push(topicPick.reason);
    if(!r.length) r.push('disciplina ativa disponível para estudo');
    return r;
  },

  /**
   * Retorna as melhores próximas ações (objetos estruturados; a UI formata).
   * { type, discipline, topic, duration, suggestedType, score, reasons, parts }
   */
  getNextActions(limit){
    const discs = activeDisciplines();
    if(!discs.length) return [];

    const deficits = PlannerEngine.calculateDeficits();
    const weekRange = { start: startOfWeek(today()), end: endOfWeek(today()) };
    const realizedByDisc = new Map();
    sessionsInRange(weekRange).forEach(s => realizedByDisc.set(s.disciplineId, (realizedByDisc.get(s.disciplineId) || 0) + s.minutes));
    const ctx = { deficits, realizedByDisc };

    const scored = discs.map(d => {
      const sc = this.scoreDiscipline(d, ctx);
      const pick = this.pickTopic(d.id);
      const isReview = pick.suggestedType === 'revisao';
      return {
        type:'study',
        discipline: d,
        topic: pick.topic,
        suggestedType: pick.suggestedType,
        duration: this.suggestDuration(sc.facts.remaining, isReview),
        score: sc.score,
        parts: sc.parts,
        facts: sc.facts,
        reasons: this.buildReasons(d, sc, pick)
      };
    });

    scored.sort((a,b) => (b.score - a.score) || sortByName(a.discipline, b.discipline));
    return scored.slice(0, limit || 3);
  }
};

/* =========================================================================
   ANALYTICS SCOPE — "o que analisar": tudo, uma Área de Estudo, uma
   disciplina ou um tópico. Toda filtragem das Análises passa por aqui.
   ========================================================================= */
const NO_AREA_ID = '__none__';
const SCOPE_KIND_LABEL = { all:'Tudo', area:AREA_TERM, discipline:'Disciplina', topic:'Tópico' };

function defaultAnalyticsScope(){ return { type:'all', areaId:null, disciplineId:null, topicId:null }; }

const AnalyticsScope = {
  /** Converte a escolha salva em um escopo utilizável. Entidade removida → volta para "Tudo". */
  resolve(raw){
    const s = Object.assign(defaultAnalyticsScope(), raw || {});
    const areaPath = (d) => {
      const a = d && d.areaId ? getArea(d.areaId) : null;
      return a ? [a.name] : [];
    };
    if(s.type === 'area'){
      if(s.areaId === NO_AREA_ID){
        const ids = state.disciplines.filter(d => !d.areaId || !getArea(d.areaId)).map(d => d.id);
        return { type:'area', areaId:NO_AREA_ID, disciplineId:null, topicId:null,
                 discIds:new Set(ids), label:NO_AREA_LABEL, path:[NO_AREA_LABEL] };
      }
      const a = getArea(s.areaId);
      if(a){
        const ids = state.disciplines.filter(d => d.areaId === a.id).map(d => d.id);
        return { type:'area', areaId:a.id, disciplineId:null, topicId:null,
                 discIds:new Set(ids), label:a.name, path:[a.name] };
      }
    } else if(s.type === 'discipline'){
      const d = getDiscipline(s.disciplineId);
      if(d){
        return { type:'discipline', areaId:d.areaId || null, disciplineId:d.id, topicId:null,
                 discIds:new Set([d.id]), label:d.name, path:[...areaPath(d), d.name] };
      }
    } else if(s.type === 'topic'){
      const t = getTopic(s.topicId);
      const d = t ? getDiscipline(t.disciplineId) : null;
      if(t && d){
        return { type:'topic', areaId:d.areaId || null, disciplineId:d.id, topicId:t.id,
                 discIds:new Set([d.id]), label:t.name, path:[...areaPath(d), d.name, t.name] };
      }
    }
    return { type:'all', areaId:null, disciplineId:null, topicId:null, discIds:null,
             label:'Todos os estudos', path:[], fellBack: s.type !== 'all' };
  },
  key(r){ return [r.type, r.areaId || '', r.disciplineId || '', r.topicId || ''].join(':'); },
  kindLabel(r){ return SCOPE_KIND_LABEL[r.type] || 'Tudo'; },
  /** "Tecnologia › Redes de Computadores › OSPF" */
  pathText(r){ return r.type === 'all' ? 'Todos os estudos' : r.path.join(' › '); },
  isAll(r){ return r.type === 'all'; },

  hasSession(r, s){
    if(r.type === 'all') return true;
    if(r.type === 'topic') return s.topicId === r.topicId;
    return r.discIds.has(s.disciplineId);
  },
  hasDiscipline(r, id){ return r.type === 'all' || r.discIds.has(id); },
  hasTopic(r, t){
    if(r.type === 'topic') return t.id === r.topicId;
    return r.type === 'all' || r.discIds.has(t.disciplineId);
  },
  /** 'own' = prazo do escopo · 'discipline' = prazo da disciplina inteira (escopo de tópico) · null = fora. */
  deadlineRelation(r, dl){
    if(r.type === 'all') return 'own';
    if(r.type === 'topic'){
      if(dl.topicId && dl.topicId === r.topicId) return 'own';
      if(!dl.topicId && dl.disciplineId === r.disciplineId) return 'discipline';
      return null;
    }
    return dl.disciplineId && r.discIds.has(dl.disciplineId) ? 'own' : null;
  },
  sessions(r, range){
    const list = range ? sessionsInRange(range) : state.sessions;
    return r.type === 'all' ? list : list.filter(s => this.hasSession(r, s));
  },
  disciplines(r){ return activeDisciplines().filter(d => this.hasDiscipline(r, d.id)); },
  topics(r){
    return state.topics.filter(t => {
      if(t.archived || !this.hasTopic(r, t)) return false;
      const d = getDiscipline(t.disciplineId);
      return d && !d.archived;
    });
  }
};

/** Número seguro para exibir: nunca "NaN", "Infinity" ou "undefined". */
function safePct(v){ return isNum(v) ? fmtPct(v) : '—'; }
function plural(n, one, many){ return `${n} ${n === 1 ? one : many}`; }

/* =========================================================================
   ANALYTICS ENGINE — calcula tudo uma vez por (período, escopo) e guarda
   o resultado em cache até os dados mudarem.
   Frases são sempre factuais: descrevem o que aconteceu, nunca a causa.
   ========================================================================= */
const AnalyticsEngine = {
  _cache: new Map(),
  invalidate(){ this._cache.clear(); },

  /**
   * Entrada única da interface (v6): recebe a consulta central
   * { scopeType, scopeId, periodPreset, startDate, endDate, focus } e devolve
   * a análise daquele escopo e período. O foco NÃO muda o cálculo — só o que
   * a tela prioriza —, por isso o cache continua por (período, escopo).
   */
  query(rawQuery){
    const q = normalizeAnalyticsQuery(rawQuery);
    const a = this.build(analyticsQueryRange(q), analyticsQueryScope(q));
    return Object.assign({}, a, { query:q, focus:q.focus, periodLabel: analyticsPeriodLabel(q) });
  },

  build(range, rawScope){
    const scope = AnalyticsScope.resolve(rawScope);
    const key = [dateToISO(range.start), dateToISO(range.end), AnalyticsScope.key(scope),
                 todayISO(), weekStartDow()].join('|');
    const hit = this._cache.get(key);
    if(hit) return hit;
    const a = this._compute(range, scope);
    if(this._cache.size >= 16) this._cache.clear();
    this._cache.set(key, a);
    return a;
  },

  _compute(range, scope){
    const sessions = AnalyticsScope.sessions(scope, range);
    const days = rangeDays(range);
    const prevRange = this.previousRange(range);
    const prevSessions = AnalyticsScope.sessions(scope, prevRange);

    const totals = this.totals(sessions, days);
    const rest = this.restStats(sessions, totals);
    const weeklyRhythm = this.weeklyRhythm(range, sessions);
    const previousComparison = this.compare(totals, this.totals(prevSessions, rangeDays(prevRange)), prevRange);

    const topicKey = s => s.topicId || '__none__';
    const topicLabel = id => {
      if(id === '__none__') return 'Sem tópico definido';
      const t = getTopic(id); return t ? t.name : '(tópico removido)';
    };
    const byDiscipline = this.groupMinutes(sessions, s => s.disciplineId, id => disciplineName(id));
    const byArea = this.groupMinutes(sessions,
      s => { const d = getDiscipline(s.disciplineId); return d && d.areaId && getArea(d.areaId) ? d.areaId : NO_AREA_ID; },
      id => id === NO_AREA_ID ? NO_AREA_LABEL : (getArea(id) ? getArea(id).name : '(área removida)'));
    const byTopic = this.groupMinutes(sessions, topicKey, topicLabel);
    const byType = this.typeDistribution(sessions);
    const byWeekday = this.weekdayDistribution(sessions);
    const difficulty = this.difficulty(sessions);
    const planAdherence = this.planAdherence(range, scope);
    const reviews = this.reviewStats(range, scope, sessions);
    const content = this.contentStats(scope);
    const deadlines = this.deadlineStats(range, scope, sessions);
    const priorities = this.priorityStats(scope, sessions);
    const attention = this.attentionTopics(scope, range);
    const projection = this.projection(scope);

    const a = { range, days, scope, sessions, totals, rest, weeklyRhythm, previousComparison, byDiscipline, byArea, byTopic,
                byType, byWeekday, difficulty, planAdherence, reviews, content, deadlines, priorities,
                attention, projection };
    a.summary = this.summary(a);
    // v6 — cada observação carrega um assunto (tag) para a tela priorizar
    // conforme o foco; as listas de texto seguem existindo para o relatório.
    a.insightItems = this.insightItems(a);
    a.positiveItems = this.positiveItems(a);
    a.warningItems = this.warningItems(a);
    a.insights = a.insightItems.length ? a.insightItems.map(x => x.text) : ['Nada fora do comum neste período.'];
    a.positives = a.positiveItems.map(x => x.text);
    a.warnings = a.warningItems.map(x => x.text);
    return a;
  },

  /** `minutes` é sempre tempo de ESTUDO (session.minutes). Descanso é somado à parte, em restStats. */
  totals(sessions, days){
    const minutes = sum(sessions, s => s.minutes || 0);
    const activeDays = activeDaySet(sessions).size;      // dia ativo = dia com estudo de duração positiva
    return {
      minutes, count: sessions.length, activeDays, days,
      avgSession: sessions.length ? minutes / sessions.length : 0,
      avgPerDay: days > 0 ? minutes / days : 0,
      avgPerActiveDay: activeDays > 0 ? minutes / activeDays : 0,
      consistency: days > 0 ? (activeDays / days) * 100 : 0
    };
  },

  /**
   * v6.4 — descansos do período, sempre separados do tempo de estudo.
   * Só descreve: quanto, quantos, média e a relação com o tempo estudado.
   */
  restStats(sessions, totals){
    let minutes = 0, count = 0, withBreaks = 0;
    sessions.forEach(s => {
      const list = breaksOf(s);
      if(!list.length) return;
      const m = breakMinutesOf(s);
      if(m <= 0) return;
      minutes += m; count += list.filter(b => b.minutes > 0).length; withBreaks++;
    });
    // Entre os estudos mais longos do período, em quantos houve descanso (só com amostra mínima).
    let longest = null;
    if(count > 0 && sessions.length >= 5){
      const top = sessions.slice().sort((x, y) => (y.minutes || 0) - (x.minutes || 0)).slice(0, Math.min(10, sessions.length));
      longest = { of: top.length, withBreaks: top.filter(s => breakMinutesOf(s) > 0).length };
    }
    return {
      minutes, count, sessionsWithBreaks: withBreaks,
      avg: count > 0 ? minutes / count : 0,
      // minutos de estudo para cada hora de descanso (null sem descanso)
      studyPerRestHour: minutes > 0 ? (totals.minutes / minutes) * 60 : null,
      longest
    };
  },

  /** Dias com estudo em cada semana tocada pelo período (semana parcial conta só os dias incluídos). */
  weeklyRhythm(range, sessions){
    const active = activeDaySet(sessions);
    const out = [];
    let cursor = startOfWeek(range.start);
    const last = startOfWeek(range.end);
    let guard = 0;
    while(cursor <= last && guard++ < 520){
      const clipStart = cursor < range.start ? range.start : cursor;
      const wEnd = addDays(cursor, 6);
      const clipEnd = wEnd > range.end ? range.end : wEnd;
      const covered = diffDays(clipEnd, clipStart) + 1;
      let n = 0;
      for(let i = 0; i < covered; i++) if(active.has(dateToISO(addDays(clipStart, i)))) n++;
      out.push({ weekStart: dateToISO(cursor), weekNumber: isoWeekNumber(cursor), start: clipStart, end: clipEnd, days: covered, activeDays: n });
      cursor = addDays(cursor, 7);
    }
    return out;
  },

  previousRange(range){
    const n = rangeDays(range);
    const end = addDays(range.start, -1);
    return { start: addDays(end, -(n - 1)), end };
  },

  compare(cur, prev, prevRange){
    if(!prev || prev.minutes <= 0) return { available:false, prevRange, prev };
    const delta = (a, b) => b > 0 ? ((a - b) / b) * 100 : null;
    return {
      available:true, prevRange, prev,
      minutesDelta: delta(cur.minutes, prev.minutes),
      sessionsDelta: delta(cur.count, prev.count),
      activeDaysDelta: delta(cur.activeDays, prev.activeDays)
    };
  },

  groupMinutes(sessions, keyFn, labelFn){
    const map = new Map();
    sessions.forEach(s => {
      const k = keyFn(s);
      if(k === null || k === undefined) return;
      const cur = map.get(k) || { key:k, minutes:0, count:0 };
      cur.minutes += s.minutes || 0; cur.count++;
      map.set(k, cur);
    });
    const total = sum(Array.from(map.values()), x => x.minutes);
    return Array.from(map.values())
      .map(x => ({ ...x, label: labelFn(x.key), pct: total > 0 ? (x.minutes / total) * 100 : 0 }))
      .sort((a,b) => (b.minutes - a.minutes) || str(a.label).localeCompare(str(b.label), 'pt-BR'));
  },

  typeDistribution(sessions){
    const map = new Map();
    sessions.forEach(s => { const k = s.type || '__none__'; map.set(k, (map.get(k) || 0) + 1); });
    const total = sessions.length;
    const minutesOf = k => sum(sessions.filter(s => (s.type || '__none__') === k), s => s.minutes || 0);
    const rows = SESSION_TYPES.map(t => ({ key:t.v, label:t.label, count: map.get(t.v) || 0, minutes: minutesOf(t.v) }));
    if(map.get('__none__')) rows.push({ key:'__none__', label:'Não informado', count: map.get('__none__'), minutes: minutesOf('__none__') });
    return rows.map(r => ({ ...r, pct: total > 0 ? (r.count / total) * 100 : 0 }));
  },

  weekdayDistribution(sessions){
    const names = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const order = weekStartDow() === 1 ? [1,2,3,4,5,6,0] : [0,1,2,3,4,5,6];
    const mins = [0,0,0,0,0,0,0];
    sessions.forEach(s => { const d = parseISO(s.date); if(d) mins[d.getDay()] += s.minutes || 0; });
    return order.map(i => ({ dow:i, label:names[i], minutes:mins[i] }));
  },

  difficulty(sessions){
    const withD = sessions.filter(s => s.difficulty);
    const counts = DIFFICULTIES.map(d => ({ ...d, count: withD.filter(s => s.difficulty === d.v).length }));
    const avg = withD.length ? sum(withD, s => s.difficulty) / withD.length : null;
    const groupAvg = (list, keyFn, labelFn) => {
      const m = new Map();
      list.forEach(s => { const k = keyFn(s); if(!m.has(k)) m.set(k, []); m.get(k).push(s.difficulty); });
      return Array.from(m.entries())
        .map(([id, vals]) => ({ id, label: labelFn(id), avg: sum(vals) / vals.length, count: vals.length }))
        .sort((a,b) => b.avg - a.avg);
    };
    return {
      avg, count: withD.length, counts,
      perDiscipline: groupAvg(withD, s => s.disciplineId, id => disciplineName(id)),
      perTopic: groupAvg(withD.filter(s => s.topicId), s => s.topicId, id => { const t = getTopic(id); return t ? t.name : '(tópico removido)'; })
    };
  },

  /**
   * Planejado × realizado usando o plano que existia em cada semana tocada
   * pelo período. O plano é por disciplina: no escopo de tópico ele não se aplica.
   */
  planAdherence(range, scope){
    const empty = { applicable: scope.type !== 'topic', hasPlan:false, planned:0, realized:0, counted:0, extra:0, weeks:[], perDiscipline:[], pct:null, volumePct:null };
    if(scope.type === 'topic') return empty;
    const weeks = [];
    let cursor = startOfWeek(range.start);
    const last = startOfWeek(range.end);
    let guard = 0;
    const scoped = AnalyticsScope.sessions(scope, range);
    while(cursor <= last && guard++ < 520){
      const ws = dateToISO(cursor);
      const wp = state.weeklyPlans.find(w => w.weekStart === ws);
      const wStart = cursor, wEnd = addDays(cursor, 6);
      const clipStart = wStart < range.start ? range.start : wStart;
      const clipEnd = wEnd > range.end ? range.end : wEnd;
      const coveredDays = diffDays(clipEnd, clipStart) + 1;
      const factor = clamp(coveredDays / 7, 0, 1);          // semana parcial conta proporcionalmente
      const a = dateToISO(clipStart), b = dateToISO(clipEnd);
      const inWeek = scoped.filter(s => s.date >= a && s.date <= b);
      const realized = sum(inWeek, s => s.minutes || 0);
      const realizedByDisc = new Map();
      inWeek.forEach(s => realizedByDisc.set(s.disciplineId, (realizedByDisc.get(s.disciplineId) || 0) + (s.minutes || 0)));
      const allocs = wp ? (wp.allocations || []).filter(x => AnalyticsScope.hasDiscipline(scope, x.disciplineId)) : [];
      const planned = sum(allocs, x => x.targetMinutes || 0) * factor;
      // v6.5 — plano cumprido da semana: de cada disciplina conta no máximo o planejado para ela (PlanRules)
      // (somado por disciplina antes de comparar: uma disciplina repetida no plano não conta duas vezes)
      let counted = 0;
      const plannedByDisc = new Map();
      allocs.forEach(al => plannedByDisc.set(al.disciplineId, (plannedByDisc.get(al.disciplineId) || 0) + (al.targetMinutes || 0) * factor));
      plannedByDisc.forEach((pl, id) => { counted += PlanRules.counted(pl, realizedByDisc.get(id) || 0); });
      weeks.push({ weekStart: ws, weeklyPlan: wp || null, allocs, planned, realized, counted, factor, coveredDays,
                   extra: Math.max(0, realized - counted), plannedByDisc, realizedByDisc,
                   weekNumber: isoWeekNumber(wStart),
                   pct: planned > 0 ? (counted / planned) * 100 : null,
                   volumePct: planned > 0 ? (realized / planned) * 100 : null });
      cursor = addDays(cursor, 7);
    }
    const planned = sum(weeks, w => w.planned);
    const realized = sum(weeks, w => w.realized);
    const counted = sum(weeks, w => w.counted);
    const hasPlan = planned > 0;
    if(!hasPlan) return { ...empty, weeks, realized };

    const map = new Map();
    weeks.forEach(w => w.plannedByDisc.forEach((pl, id) => {
      const cur = map.get(id) || { disciplineId:id, planned:0, realized:0, counted:0 };
      cur.planned += pl;
      cur.counted += PlanRules.counted(pl, w.realizedByDisc.get(id) || 0);
      map.set(id, cur);
    }));
    scoped.forEach(s => {
      const cur = map.get(s.disciplineId) || { disciplineId:s.disciplineId, planned:0, realized:0, counted:0 };
      cur.realized += s.minutes || 0;
      map.set(s.disciplineId, cur);
    });
    const perDiscipline = [];
    map.forEach(v => {
      const d = getDiscipline(v.disciplineId);
      perDiscipline.push({ ...v, label: d ? d.name : '(disciplina removida)', archived: d ? !!d.archived : true,
                           priority: d ? PriorityEngine.clamp(d.priority) : PRIORITY_DEFAULT,
                           pct: v.planned > 0 ? (v.realized / v.planned) * 100 : null });
    });
    perDiscipline.sort((a,b) => (a.pct === null ? 999 : a.pct) - (b.pct === null ? 999 : b.pct));
    /* `pct` = plano cumprido (distribuição, nunca passa de 100%).
       `volumePct` = tudo o que foi estudado ÷ planejado (pode passar de 100%).
       Por disciplina, `pct` continua sendo realizado ÷ planejado daquela disciplina:
       ali "130%" é a leitura certa de "estudou mais do que planejou". */
    return { applicable:true, hasPlan, planned, realized, counted, extra: Math.max(0, realized - counted), weeks, perDiscipline,
             pct: (counted / planned) * 100, volumePct: (realized / planned) * 100 };
  },

  /** Revisões do escopo: concluídas no período + a situação de agora (marcadas, atrasadas, próximas). */
  reviewStats(range, scope, sessions){
    const done = sessions.filter(s => s.type === 'revisao' || s.reviewOutcome);
    const a = dateToISO(range.start), b = dateToISO(range.end);
    const inScope = t => AnalyticsScope.hasTopic(scope, t);
    const scheduledTopics = ReviewEngine.allScheduled().filter(inScope);
    const scheduledInRange = scheduledTopics.filter(t => t.reviewDueDate >= a && t.reviewDueDate <= b).length;
    const due = ReviewEngine.getDueReviews().filter(inScope);
    const overdueList = due.filter(t => (daysUntilISO(t.reviewDueDate) || 0) < 0);
    const outcomes = REVIEW_OUTCOMES.map(o => ({ ...o, count: done.filter(s => s.reviewOutcome === o.v).length }));

    // uso e resultado por método — descritivo, nunca causal
    const methodMap = new Map();
    done.filter(x => x.reviewMethod).forEach(x => {
      if(!methodMap.has(x.reviewMethod)) methodMap.set(x.reviewMethod, { used:0, good:0 });
      const m = methodMap.get(x.reviewMethod);
      m.used++;
      if(x.reviewOutcome === 'remembered' || x.reviewOutcome === 'mastered') m.good++;
    });
    const byMethod = Array.from(methodMap.entries())
      .map(([k,v]) => ({ method:k, label:methodLabel(k), used:v.used, good:v.good, rate: v.used ? (v.good / v.used) * 100 : null }))
      .sort((x,y) => y.used - x.used);

    const forgetful = AnalyticsScope.topics(scope)
      .filter(t => (t.reviewFailures || 0) >= 2)
      .sort((x,y) => (y.reviewFailures || 0) - (x.reviewFailures || 0))
      .slice(0, 5);

    const withMastery = scheduledTopics.filter(t => t.masteryLevel);
    const avgMastery = withMastery.length ? sum(withMastery, t => t.masteryLevel) / withMastery.length : null;
    const upcoming = ReviewEngine.getUpcomingReviews(7).filter(inScope);
    /* v6.5 — saiu a "taxa de revisões feitas ÷ esperadas". O tópico guarda só a
       PRÓXIMA data de revisão; quantas revisões estavam previstas num período
       passado não pode ser reconstruído, e a taxa somava coisas de tempos
       diferentes. Ficam os fatos, cada um com o seu tempo:
         completed  → no período        scheduled → marcadas HOJE para dentro do período
         overdueNow, dueToday, upcoming → situação de agora */
    return {
      completed: done.length, scheduled: scheduledInRange,
      overdueNow: overdueList.length, overdueList, dueToday: due.length, dueList: due, upcoming,
      outcomes, minutes: sum(done, s => s.minutes || 0), sessionsList: done,
      byMethod, forgetful, avgMastery, scheduledCount: scheduledTopics.length
    };
  },

  /** Conteúdo estudado (cobertura) e consolidado (domínio) no escopo. */
  contentStats(scope){
    const discs = AnalyticsScope.disciplines(scope);
    const topics = AnalyticsScope.topics(scope);
    const status = new Map(topics.map(t => [t.id, topicStatus(t)]));
    const per = discs.map(d => {
      const tps = topics.filter(t => t.disciplineId === d.id);
      const total = tps.length;
      const covered = tps.filter(t => status.get(t.id) !== 'nao_iniciado').length;
      const mastered = tps.filter(t => status.get(t.id) === 'dominado').length;
      return { discipline:d, total, covered, mastered,
               coverage: total ? covered / total * 100 : null, mastery: total ? mastered / total * 100 : null };
    }).filter(x => x.total > 0);
    const total = topics.length;
    const covered = topics.filter(t => status.get(t.id) !== 'nao_iniciado').length;
    const mastered = topics.filter(t => status.get(t.id) === 'dominado').length;
    const byStatus = Object.keys(TOPIC_STATUS_LABEL).map(k => ({ key:k, label:TOPIC_STATUS_LABEL[k],
      count: topics.filter(t => status.get(t.id) === k).length }));
    const weakest = topics.filter(t => t.masteryLevel)
      .sort((a,b) => (a.masteryLevel - b.masteryLevel) || sortByName(a,b))
      .slice(0, 5);
    const notStarted = topics.filter(t => status.get(t.id) === 'nao_iniciado')
      .sort((a,b) => (PriorityEngine.clamp(b.priority) - PriorityEngine.clamp(a.priority)) || sortByName(a,b));
    return {
      totalTopics: total, covered, mastered, byStatus,
      coverage: total > 0 ? (covered / total) * 100 : null,
      masteryPct: total > 0 ? (mastered / total) * 100 : null,
      perDiscipline: per, weakest, notStarted, status
    };
  },

  /** Prazos do escopo: próximos, vencidos, concluídos no período. */
  deadlineStats(range, scope, sessions){
    const a = dateToISO(range.start), b = dateToISO(range.end);
    const rel = new Map();
    const all = state.deadlines.filter(dl => { const r = AnalyticsScope.deadlineRelation(scope, dl); if(r) rel.set(dl.id, r); return !!r; });
    const studiedFor = dl => {
      const list = dl.topicId ? sessions.filter(s => s.topicId === dl.topicId)
                 : dl.disciplineId ? sessions.filter(s => s.disciplineId === dl.disciplineId) : [];
      return sum(list, s => s.minutes || 0);
    };
    const open = all.filter(dl => !DeadlineEngine.isDone(dl))
      .sort((x,y) => str(x.date).localeCompare(str(y.date)))
      .map(dl => ({ dl, days: DeadlineEngine.daysLeft(dl), relation: rel.get(dl.id), studied: studiedFor(dl),
                    started: DeadlineEngine.hasStarted(dl) }));
    const upcoming = open.filter(x => x.days !== null && x.days >= 0);
    const overdue = open.filter(x => x.days !== null && x.days < 0);
    // "em que dia foi concluído?" é respondido no fuso local (ver POLÍTICA TEMPORAL)
    const completedInRange = all.filter(dl => {
      if(!DeadlineEngine.isDone(dl)) return false;
      const day = localDateOfStamp(dl.completedAt);
      return !!day && day >= a && day <= b;
    });
    const dueInRange = all.filter(dl => dl.date >= a && dl.date <= b);
    return { all, open, upcoming, overdue, completedInRange, dueInRange,
             next: upcoming[0] || null, soon: upcoming.filter(x => x.days <= 14) };
  },

  /** Como o tempo se distribuiu entre as prioridades (valores atuais de prioridade). */
  priorityStats(scope, sessions){
    const total = sum(sessions, s => s.minutes || 0);
    const discs = AnalyticsScope.disciplines(scope);
    const byDisc = [1,2,3,4,5].map(p => {
      const ids = new Set(state.disciplines.filter(d => PriorityEngine.clamp(d.priority) === p).map(d => d.id));
      const minutes = sum(sessions.filter(s => ids.has(s.disciplineId)), s => s.minutes || 0);
      return { p, minutes, pct: total > 0 ? minutes / total * 100 : 0, count: discs.filter(d => PriorityEngine.clamp(d.priority) === p).length };
    });
    const withTopic = sessions.filter(s => s.topicId && getTopic(s.topicId));
    const topicTotal = sum(withTopic, s => s.minutes || 0);
    const topics = AnalyticsScope.topics(scope);
    const byTopic = [1,2,3,4,5].map(p => {
      const minutes = sum(withTopic.filter(s => PriorityEngine.clamp(getTopic(s.topicId).priority) === p), s => s.minutes || 0);
      return { p, minutes, pct: topicTotal > 0 ? minutes / topicTotal * 100 : 0, count: topics.filter(t => PriorityEngine.clamp(t.priority) === p).length };
    });
    const studiedDisc = new Set(sessions.map(s => s.disciplineId));
    const studiedTopic = new Set(sessions.map(s => s.topicId).filter(Boolean));
    const highDiscNoTime = discs.length > 1
      ? discs.filter(d => PriorityEngine.clamp(d.priority) >= 4 && !studiedDisc.has(d.id)).sort(sortByName) : [];
    const highTopicNoTime = scope.type === 'topic' ? []
      : topics.filter(t => PriorityEngine.clamp(t.priority) >= 4 && !studiedTopic.has(t.id))
              .sort((a,b) => (PriorityEngine.clamp(b.priority) - PriorityEngine.clamp(a.priority)) || sortByName(a,b));
    const highMinutes = sum(byDisc.filter(x => x.p >= 4), x => x.minutes);
    return {
      total, byDisc, byTopic, topicTotal, highDiscNoTime, highTopicNoTime,
      highDiscShare: total > 0 ? highMinutes / total * 100 : null,
      hasHighDisc: discs.some(d => PriorityEngine.clamp(d.priority) >= 4),
      mixedDisc: new Set(discs.map(d => PriorityEngine.clamp(d.priority))).size > 1,
      mixedTopic: new Set(topics.map(t => PriorityEngine.clamp(t.priority))).size > 1
    };
  },

  /**
   * Tópicos que merecem atenção agora. Cada um traz os fatos que o colocaram
   * na lista; a prioridade só ajusta a ordem, nunca inventa motivo.
   */
  attentionTopics(scope, range){
    const out = [];
    const b = dateToISO(range.end);
    AnalyticsScope.topics(scope).forEach(t => {
      const reasons = [];
      let score = 0;
      if(t.reviewEnabled && t.reviewDueDate && t.reviewDueDate <= todayISO()){
        const late = -(daysUntilISO(t.reviewDueDate) || 0);
        if(late > 0){ reasons.push(`revisão atrasada há ${plural(late, 'dia', 'dias')}`); score += 3 + Math.min(late, 14) / 7; }
        else { reasons.push('revisão para hoje'); score += 2; }
      }
      const fails = t.reviewFailures || 0;
      if(fails >= 2){ reasons.push(`esquecido ${fails} vezes nas revisões`); score += 1.5 + Math.min(fails, 5) * 0.3; }
      const st = topicStatus(t);
      if(t.masteryLevel && t.masteryLevel <= 2 && st !== 'nao_iniciado'){ reasons.push(`pouco consolidado (${t.masteryLevel} de 5)`); score += 1; }
      const dl = DeadlineEngine.forTopic(t);
      if(dl.deadline && dl.score >= DEADLINE_MODEL.NOTEWORTHY * (dl.specific ? 1 : DEADLINE_MODEL.DISCIPLINE_WIDE_ON_TOPIC)){
        reasons.push(DeadlineEngine.phrase(dl.deadline)); score += 2 * dl.score;
      }
      const p = PriorityEngine.clamp(t.priority);
      if(p >= 4 && st === 'nao_iniciado'){ reasons.push(`prioridade ${PRIORITY_LABELS[p].toLowerCase()} e ainda não iniciado`); score += 1; }
      if(!reasons.length) return;
      // prioridade só reordena (±30%)
      score *= 1 + 0.3 * PriorityEngine.effectiveTopicAttention(t);
      out.push({ topic:t, discipline:getDiscipline(t.disciplineId), reasons, score, priority:p });
    });
    void b;
    return out.sort((x,y) => (y.score - x.score) || sortByName(x.topic, y.topic)).slice(0, 6);
  },

  /** Ritmo médio das últimas semanas (só com histórico suficiente). */
  projection(scope){
    const weeks = [];
    for(let i = 1; i <= 4; i++){
      const ws = startOfWeek(addDays(today(), -7 * i));
      const we = addDays(ws, 6);
      const list = AnalyticsScope.sessions(scope, { start:ws, end:we });
      weeks.push({ minutes: sum(list, s => s.minutes || 0), sessions: list.length });
    }
    const withData = weeks.filter(w => w.minutes > 0);
    if(withData.length < 3 || sum(weeks, w => w.sessions) < 6){
      return { available:false, reason:'Ainda não há histórico suficiente: são necessárias ao menos 3 semanas com registros.' };
    }
    const avg = sum(withData, w => w.minutes) / withData.length;
    let target = null;
    const plan = PlannerEngine.activePlan();
    if(plan && scope.type === 'all') target = plan.weeklyAvailableMinutes || null;
    else if(scope.type !== 'topic'){
      const wp = state.weeklyPlans.find(w => w.weekStart === dateToISO(startOfWeek(today())));
      const t = wp ? sum((wp.allocations || []).filter(x => AnalyticsScope.hasDiscipline(scope, x.disciplineId)), x => x.targetMinutes || 0) : 0;
      target = t > 0 ? t : null;
    }
    return { available:true, weeksConsidered: withData.length, avgWeeklyMinutes: avg, target,
             meetsTarget: target ? avg >= target * 0.95 : null, gap: target ? avg - target : null };
  },

  /* ---------- textos determinísticos ---------- */

  /** "Seu período em resumo": poucas frases, na ordem em que as pessoas perguntam. */
  summary(a){
    const out = [];
    const t = a.totals;
    const where = a.scope.type === 'all' ? '' : ` em ${a.scope.label}`;
    if(t.count === 0){
      out.push(`Nenhum estudo registrado${where} neste período.`);
    } else {
      out.push(`Você estudou ${fmtDuration(t.minutes)}${where} em ${plural(t.count, 'estudo registrado', 'estudos registrados')}, com estudo em ${t.activeDays} de ${plural(a.days, 'dia', 'dias')}.`);
    }
    const pa = a.planAdherence;
    if(pa.hasPlan) out.push(`Cumpriu ${safePct(pa.pct)} do plano: ${fmtDuration(pa.counted)} de ${fmtDuration(pa.planned)} planejadas` + (pa.extra >= 1 ? `, mais ${fmtDuration(pa.extra)} além do plano.` : '.'));
    if(t.count > 0 && a.scope.type !== 'topic' && a.scope.type !== 'discipline' && a.byDiscipline.length > 1){
      const top = a.byDiscipline[0];
      out.push(`${top.label} recebeu mais tempo (${safePct(top.pct)}).`);
    } else if(t.count > 0 && a.scope.type === 'discipline'){
      const top = a.byTopic.find(x => x.key !== '__none__');
      if(top) out.push(`${top.label} foi o tópico mais estudado (${fmtDuration(top.minutes)}).`);
    }
    const r = a.reviews;
    if(r.completed > 0 || r.overdueNow > 0){
      const parts = [];
      if(r.completed > 0) parts.push(`concluiu ${plural(r.completed, 'revisão', 'revisões')}`);
      if(r.overdueNow > 0) parts.push(`${plural(r.overdueNow, 'revisão está atrasada', 'revisões estão atrasadas')} agora`);
      out.push(capFirst(parts.join('; ')) + '.');
    }
    const next = a.deadlines.next;
    if(next) out.push(`Próximo prazo: ${DeadlineEngine.phrase(next.dl)}.`);
    if(a.rest.count > 0) out.push(`Descansos: ${fmtDuration(a.rest.minutes)} em ${plural(a.rest.count, 'descanso', 'descansos')} — fora do tempo estudado.`);
    if(a.previousComparison.available && isNum(a.previousComparison.minutesDelta) && t.count > 0){
      const d = a.previousComparison.minutesDelta;
      if(Math.abs(d) >= 5) out.push(`Você estudou ${fmtNumber(Math.abs(d), 0)}% ${d >= 0 ? 'mais' : 'menos'} que no período anterior equivalente.`);
      else out.push('O tempo de estudo ficou parecido com o do período anterior equivalente.');
    }
    return out;
  },

  /** Insights factuais — ajudam a enxergar; nunca afirmam causa. Cada item: { tag, text }. */
  insightItems(a){
    const out = [];
    const add = (tag, text) => out.push({ tag, text });
    const t = a.totals;
    const sc = a.scope;
    if(t.count === 0 && !a.deadlines.open.length && !a.reviews.overdueNow){
      add('time', 'Nenhum estudo registrado neste período. Escolha um período maior ou registre um estudo para ver mais detalhes.');
      return out;
    }

    // tempo e constância
    if(t.count > 0 && a.days >= 7){
      add('time', `Houve estudo em ${t.activeDays} de ${plural(a.days, 'dia', 'dias')}.`);
      const byDay = new Map();
      a.sessions.forEach(s => byDay.set(s.date, (byDay.get(s.date) || 0) + (s.minutes || 0)));
      const top = Array.from(byDay.entries()).sort((x,y) => y[1] - x[1])[0];
      if(top && t.activeDays > 1) add('time', `O dia com mais estudo foi ${fmtDateBR(top[0])}, com ${fmtDuration(top[1])}.`);
    }
    // descansos: só o fato, sem dizer se foi muito ou pouco
    const rs = a.rest;
    if(rs.longest && rs.longest.withBreaks > 0){
      add('rest', `Você fez descansos em ${rs.longest.withBreaks} dos ${rs.longest.of} estudos mais longos do período.`);
    }

    // plano
    const pa = a.planAdherence;
    if(pa.hasPlan){
      pa.perDiscipline.filter(x => x.pct !== null && x.pct < 70 && x.planned > 0 && !x.archived).slice(0, 2)
        .forEach(x => add('plan', `${x.label} recebeu ${safePct(x.pct)} do tempo planejado (${fmtDuration(x.realized)} de ${fmtDuration(x.planned)}).`));
      pa.perDiscipline.filter(x => x.pct !== null && x.pct > 130 && x.planned > 0 && !x.archived).slice(0, 1)
        .forEach(x => add('plan', `${x.label} recebeu ${fmtNumber(x.pct - 100, 0)}% mais tempo que o planejado.`));
    }

    // prioridades
    const pr = a.priorities;
    if(t.count > 0 && sc.type !== 'discipline' && sc.type !== 'topic' && pr.hasHighDisc && pr.mixedDisc && isNum(pr.highDiscShare)){
      add('priority', `Disciplinas com prioridade alta ou muito alta receberam ${safePct(pr.highDiscShare)} do tempo.`);
    }
    pr.highDiscNoTime.slice(0, 2).forEach(d =>
      add('priority', `${d.name} tem prioridade ${PRIORITY_LABELS[PriorityEngine.clamp(d.priority)].toLowerCase()} e não foi estudada neste período.`));
    if(sc.type === 'discipline' || sc.type === 'area'){
      const n = pr.highTopicNoTime.length;
      if(n > 0 && t.count > 0) add('content', `${plural(n, 'tópico de prioridade alta ou muito alta não foi estudado', 'tópicos de prioridade alta ou muito alta não foram estudados')} neste período.`);
    }

    // distribuição
    if(t.count > 0 && sc.type !== 'discipline' && sc.type !== 'topic' && a.byDiscipline.length){
      const top = a.byDiscipline[0];
      if(top.pct > 60 && a.byDiscipline.length > 1) add('distribution', `${top.label} concentrou ${safePct(top.pct)} do tempo; ${a.byDiscipline.length - 1 === 1 ? 'a outra disciplina dividiu' : `as outras ${a.byDiscipline.length - 1} disciplinas dividiram`} o restante.`);
    }

    // prazos
    a.deadlines.soon.slice(0, 2).forEach(x => {
      const ctx = x.dl.topicId ? (getTopic(x.dl.topicId) || {}).name : x.dl.disciplineId ? disciplineName(x.dl.disciplineId) : null;
      if(ctx) add('deadlines', `${DeadlineEngine.phrase(x.dl)}; ${ctx} recebeu ${fmtDuration(x.studied)} neste período.`);
      else add('deadlines', `${DeadlineEngine.phrase(x.dl)}.`);
    });
    if(a.deadlines.overdue.length) add('deadlines', `${plural(a.deadlines.overdue.length, 'prazo passou da data e continua em aberto', 'prazos passaram da data e continuam em aberto')}.`);
    if(a.deadlines.completedInRange.length) add('deadlines', `${plural(a.deadlines.completedInRange.length, 'prazo foi concluído', 'prazos foram concluídos')} neste período.`);

    // revisões
    const r = a.reviews;
    if(r.forgetful.length){ const f = r.forgetful[0]; add('reviews', `${f.name} já foi esquecido ${f.reviewFailures} vezes nas revisões.`); }
    const highLate = r.overdueList.filter(x => PriorityEngine.clamp(x.priority) >= 4).length;
    if(highLate) add('reviews', `${plural(highLate, 'tópico de prioridade alta ou muito alta está', 'tópicos de prioridade alta ou muito alta estão')} com revisão atrasada.`);
    if(r.avgMastery !== null && r.avgMastery < 2.5) add('reviews', `A consolidação média dos tópicos em revisão está em ${fmtNumber(r.avgMastery, 1)} de 5.`);
    const solid = r.byMethod.filter(x => x.used >= 5);
    if(solid.length){
      const best = solid.slice().sort((x,y) => (y.rate || 0) - (x.rate || 0))[0];
      add('reviews', `Nas ${best.used} revisões com ${best.label.toLowerCase()}, ${best.good} terminaram como "Lembrei bem" ou "Dominei".`);
    }

    // disciplinas paradas (no máximo 2, para não virar lista)
    if(sc.type !== 'topic'){
      AnalyticsScope.disciplines(sc).map(d => ({ d, last: lastStudyISO(d.id) }))
        .filter(x => x.last && daysSinceISO(x.last) >= 7)
        .sort((x,y) => x.last.localeCompare(y.last)).slice(0, 2)
        .forEach(x => add('time', `${x.d.name} não recebe registros há ${daysSinceISO(x.last)} dias.`));
    }

    // dificuldade
    if(a.difficulty.avg !== null){
      const hardest = a.difficulty.perTopic.filter(x => x.count >= 2)[0] || (sc.type === 'all' || sc.type === 'area' ? a.difficulty.perDiscipline.filter(x => x.count >= 2)[0] : null);
      if(hardest) add('difficulty', `${hardest.label} teve a maior dificuldade percebida: ${fmtNumber(hardest.avg, 1)}/5.`);
    }

    // conteúdo
    if(a.content.coverage !== null && sc.type !== 'topic'){
      add('content', `Você já estudou ${a.content.covered} de ${plural(a.content.totalTopics, 'tópico cadastrado', 'tópicos cadastrados')} (${safePct(a.content.coverage)}); ${a.content.mastered} ${a.content.mastered === 1 ? 'está consolidado' : 'estão consolidados'}.`);
    }

    // tipos
    const typed = a.byType.filter(x => x.key !== '__none__' && x.count > 0);
    const typedTotal = sum(typed, x => x.count);
    if(typedTotal >= 3){
      const top = typed.slice().sort((x,y) => y.count - x.count)[0];
      add('types', `${fmtNumber((top.count / typedTotal) * 100, 0)}% dos estudos classificados foram do tipo "${top.label}".`);
    }

    if(a.projection.available && a.projection.target){
      add('projection', a.projection.meetsTarget
        ? `A média das últimas ${a.projection.weeksConsidered} semanas (${fmtDuration(a.projection.avgWeeklyMinutes)}) acompanha o objetivo semanal.`
        : `A média das últimas ${a.projection.weeksConsidered} semanas (${fmtDuration(a.projection.avgWeeklyMinutes)}) está ${fmtDuration(Math.abs(a.projection.gap))} abaixo do objetivo semanal.`);
    }
    return out;
  },

  positiveItems(a){
    const out = [];
    const add = (tag, text) => out.push({ tag, text });
    if(a.planAdherence.hasPlan && a.planAdherence.pct >= 90) add('plan', `Plano cumprido em ${safePct(a.planAdherence.pct)}.`);
    if(a.reviews.completed > 0 && a.reviews.overdueNow === 0) add('reviews', `${plural(a.reviews.completed, 'revisão concluída', 'revisões concluídas')} e nenhuma atrasada.`);
    if(a.previousComparison.available && isNum(a.previousComparison.minutesDelta) && a.previousComparison.minutesDelta >= 10)
      add('time', `${fmtNumber(a.previousComparison.minutesDelta, 0)}% mais tempo que no período anterior.`);
    if(a.deadlines.completedInRange.length) add('deadlines', `${plural(a.deadlines.completedInRange.length, 'prazo concluído', 'prazos concluídos')}.`);
    const good = a.reviews.outcomes.filter(o => o.v === 'remembered' || o.v === 'mastered');
    const goodN = sum(good, o => o.count);
    if(a.reviews.completed >= 3 && goodN / a.reviews.completed >= 0.7) add('reviews', `${goodN} de ${a.reviews.completed} revisões terminaram como "Lembrei bem" ou "Dominei".`);
    return out;
  },

  warningItems(a){
    const out = [];
    const add = (tag, text) => out.push({ tag, text });
    if(a.reviews.overdueNow) add('reviews', `${plural(a.reviews.overdueNow, 'revisão atrasada', 'revisões atrasadas')}.`);
    a.deadlines.overdue.slice(0, 3).forEach(x => add('deadlines', `${x.dl.title}: ${DeadlineEngine.dueText(x.dl).toLowerCase()}.`));
    a.deadlines.soon.filter(x => x.days <= 7 && x.studied === 0 && (x.dl.disciplineId || x.dl.topicId)).slice(0, 2)
      .forEach(x => add('deadlines', `${DeadlineEngine.phrase(x.dl)}, sem estudo registrado para ele neste período.`));
    a.priorities.highDiscNoTime.slice(0, 2).forEach(d => add('priority', `${d.name} (prioridade ${PriorityEngine.text(d.priority)}) sem estudo no período.`));
    if(a.planAdherence.hasPlan){
      a.planAdherence.perDiscipline.filter(x => x.pct !== null && x.pct < 50 && x.planned > 0 && !x.archived).slice(0, 2)
        .forEach(x => add('plan', `${x.label} com ${safePct(x.pct)} do tempo planejado.`));
    }
    a.reviews.forgetful.slice(0, 2).forEach(tp => add('reviews', `${tp.name} esquecido ${tp.reviewFailures} vezes.`));
    return out;
  }
};

/* =========================================================================
   TIMER SERVICE — tempo sempre calculado por timestamps, nunca por setInterval.
   Estado persistido para sobreviver a reload / fechar aba.

   v6.4 — DESCANSOS. O cronômetro tem dois estados: estudando ou descansando.
     · estudando:   running = true;  o tempo de estudo é accumulatedMs + (agora − startedAt)
     · descansando: running = false; o tempo de estudo fica CONGELADO em accumulatedMs
                    e o descanso em curso é (agora − breakStartedAt)
   Cada descanso encerrado vira { id, startedAt, endedAt } em `breaks`. Nada é
   contado por setInterval nem gravado a cada segundo: só as transições
   (começar, descansar, voltar, finalizar) escrevem no localStorage. Recarregar
   a página, dormir o computador ou deixar a aba em segundo plano não muda as
   contas — e o tempo de estudo nunca corre escondido durante um descanso.
   ========================================================================= */
const TimerService = {
  data: null,          // { runId, disciplineId, topicId, presetType, presetMethod, openedAt, startedAt, accumulatedMs,
                       //   running, breaks:[{id,startedAt,endedAt}], breakStartedAt, targetMinutes? }
  _tick: null,
  /* v6.5 — `runId` é a identidade deste cronômetro. Ela nasce em start(), fica
     no localStorage junto com o resto e vira o `id` do estudo ao finalizar.
     Duas abas veem o MESMO runId; o banco aceita um estudo com esse id uma vez. */
  /** A última gravação no localStorage deu certo? Se não, fechar a página perde este cronômetro. */
  persisted: true,

  restore(){
    try {
      const raw = localStorage.getItem(TIMER_LS_KEY);
      if(!raw) { this.data = null; return null; }
      const d = JSON.parse(raw);
      if(!d || typeof d !== 'object' || !d.disciplineId) { this.clear(); return null; }
      /* A disciplina não está na memória desta aba. Antes isso apagava o cronômetro do
         armazenamento — mas, com duas abas, a disciplina pode ter acabado de ser criada
         na outra e ainda não ter chegado aqui. Agora esta aba só não mostra o cronômetro;
         quem decide o destino dele é a aba que o conhece (ou o próximo estudo iniciado). */
      if(!getDiscipline(d.disciplineId)) { this.data = null; this.persisted = true; return null; }
      const now = Date.now();
      const running = !!d.running;
      const breaks = (Array.isArray(d.breaks) ? d.breaks : [])
        .filter(b => b && isNum(b.startedAt) && isNum(b.endedAt) && b.endedAt > b.startedAt)
        .slice(0, MAX_BREAKS_PER_STUDY)
        .map(b => ({ id: str(b.id) || uid(), startedAt: b.startedAt, endedAt: b.endedAt }));
      this.data = {
        // cronômetro iniciado antes da v6.5 não tem identidade: recebe uma agora, uma única vez
        runId: (typeof d.runId === 'string' && d.runId) ? d.runId : uid(),
        disciplineId: str(d.disciplineId),
        topicId: d.topicId ? str(d.topicId) : null,
        presetType: SESSION_TYPES.some(t => t.v === d.presetType) ? d.presetType : null,
        presetMethod: CONCRETE_METHODS.includes(d.presetMethod) ? d.presetMethod : null,
        startedAt: isNum(d.startedAt) ? d.startedAt : now,
        accumulatedMs: (isNum(d.accumulatedMs) && d.accumulatedMs > 0) ? d.accumulatedMs : 0,
        running,
        openedAt: isNum(d.openedAt) ? d.openedAt : (isNum(d.startedAt) ? d.startedAt : now),
        breaks,
        /* Descanso em curso. Um cronômetro "pausado" gravado pela v6.3 não sabe
           quando a pausa começou: o descanso passa a contar de agora, sem inventar tempo. */
        breakStartedAt: running ? null : ((isNum(d.breakStartedAt) && d.breakStartedAt <= now) ? d.breakStartedAt : now),
        // v6.3 — duração sugerida escolhida no "Começar a estudar" (opcional; cronômetros antigos não têm)
        targetMinutes: (isNum(d.targetMinutes) && d.targetMinutes > 0 && d.targetMinutes <= 1440) ? Math.round(d.targetMinutes) : null
      };
      this.persisted = true;
      // cronômetro vindo da v6.3 em pausa (grava o início do descanso) ou sem identidade (grava o runId): uma única vez
      if((!running && !isNum(d.breakStartedAt)) || this.data.runId !== d.runId) this._persist();
      return this.data;
    } catch(_){ this.clear(); return null; }
  },
  /**
   * Grava o cronômetro no localStorage. v6.5 — devolve se deu certo e guarda o
   * resultado em `persisted`: armazenamento cheio ou bloqueado não é mais
   * engolido em silêncio (a barra do cronômetro avisa e tenta de novo sozinha).
   */
  _persist(){
    try {
      if(this.data){
        const json = JSON.stringify(this.data);
        localStorage.setItem(TIMER_LS_KEY, json);
        this.persisted = localStorage.getItem(TIMER_LS_KEY) === json;
      } else {
        localStorage.removeItem(TIMER_LS_KEY);
        this.persisted = true;
      }
    } catch(_){
      // o cronômetro segue contando na memória; o que não dá para garantir é a recuperação
      this.persisted = !this.data;
    }
    return this.persisted;
  },
  /** Nova tentativa de gravar um cronômetro que não coube/entrou no armazenamento. */
  retryPersist(){ return (this.data && !this.persisted) ? this._persist() : this.persisted; },
  /**
   * O que o armazenamento diz sobre o cronômetro AGORA (outra aba pode ter
   * finalizado, descartado ou começado outro): o runId gravado, null se não há
   * cronômetro gravado, ou undefined se não foi possível ler.
   */
  storedRunId(){
    try {
      const raw = localStorage.getItem(TIMER_LS_KEY);
      if(!raw) return null;
      const d = JSON.parse(raw);
      return (d && typeof d.runId === 'string' && d.runId) ? d.runId : null;
    } catch(_){ return undefined; }
  },
  start(disciplineId, topicId, presetType, presetMethod, targetMinutes){
    const now = Date.now();
    this.data = { runId: uid(), disciplineId, topicId: topicId || null, presetType: presetType || null,
                  presetMethod: presetMethod || null,
                  startedAt: now, accumulatedMs: 0, running: true, openedAt: now,
                  breaks: [], breakStartedAt: null,
                  targetMinutes: (isNum(targetMinutes) && targetMinutes > 0) ? Math.round(targetMinutes) : null };
    this._persist();
    return this.data;
  },
  /** Estudando → descansando. O tempo de estudo para de acumular neste instante. */
  startBreak(){
    if(!this.data || !this.data.running) return false;
    const now = Date.now();
    this.data.accumulatedMs = this.getElapsed(now);
    this.data.running = false;
    this.data.breakStartedAt = now;
    this._persist();
    return true;
  },
  /** Descansando → estudando. O descanso é fechado e guardado; o estudo retoma de onde parou. */
  endBreak(){
    if(!this.data || this.data.running) return false;
    const now = Date.now();
    const from = isNum(this.data.breakStartedAt) ? this.data.breakStartedAt : now;
    if(now > from && this.data.breaks.length < MAX_BREAKS_PER_STUDY) this.data.breaks.push({ id: uid(), startedAt: from, endedAt: now });
    this.data.breakStartedAt = null;
    this.data.startedAt = now;
    this.data.running = true;
    this._persist();
    return true;
  },
  /** Tempo de ESTUDO, em ms. Durante um descanso ele não anda. */
  getElapsed(at){
    if(!this.data) return 0;
    const base = this.data.accumulatedMs || 0;
    const now = isNum(at) ? at : Date.now();
    return this.data.running ? base + Math.max(0, now - this.data.startedAt) : base;
  },
  /** Descanso em curso, em ms (0 quando se está estudando). */
  getBreakElapsed(at){
    if(!this.data || this.data.running || !isNum(this.data.breakStartedAt)) return 0;
    return Math.max(0, (isNum(at) ? at : Date.now()) - this.data.breakStartedAt);
  },
  /** Soma de todos os descansos (fechados + o que estiver em curso), em ms. */
  getBreakTotal(at){
    if(!this.data) return 0;
    return sum(this.data.breaks, b => b.endedAt - b.startedAt) + this.getBreakElapsed(at);
  },
  get isActive(){ return !!this.data; },
  get isRunning(){ return !!(this.data && this.data.running); },
  get isOnBreak(){ return !!(this.data && !this.data.running); },
  /** Tempo total desde que a sessão foi aberta (para detectar sessão esquecida). */
  getOpenAgeMs(){ return this.data ? Date.now() - (this.data.openedAt || this.data.startedAt) : 0; },
  /**
   * Retrato do estudo "se ele terminasse agora". NÃO altera o cronômetro: se a
   * pessoa desistir de finalizar, tudo continua como estava (inclusive o
   * descanso em curso). O descanso aberto entra no retrato fechado em `at`.
   */
  snapshot(at){
    if(!this.data) return null;
    const now = isNum(at) ? at : Date.now();
    const d = this.data;
    const breaks = d.breaks.map(b => ({ id:b.id, startedAt:b.startedAt, endedAt:b.endedAt }));
    if(!d.running && isNum(d.breakStartedAt) && now > d.breakStartedAt) breaks.push({ id: uid(), startedAt: d.breakStartedAt, endedAt: now });
    return {
      studyMs: this.getElapsed(now),
      breakMs: sum(breaks, b => b.endedAt - b.startedAt),
      breaks, startedAt: d.openedAt || d.startedAt, endedAt: now, onBreak: !d.running
    };
  },
  clear(){ this.data = null; this._persist(); this.stopTicking(); },
  /** Esquece o cronômetro só na memória desta aba (outra aba já cuidou do armazenamento). */
  forget(){ this.data = null; this.persisted = true; this.stopTicking(); },
  /**
   * Encerra o cronômetro `runId` depois que o estudo dele foi gravado (ou já
   * existia). Só apaga o armazenamento se ele ainda guarda ESTE cronômetro:
   * se outra aba já limpou ou começou outro estudo, esta aba apenas acompanha.
   */
  release(runId){
    const stored = this.storedRunId();
    if(stored === runId || stored === undefined){ this.clear(); return; }
    if(stored === null){ this.forget(); return; }
    this.stopTicking();
    this.restore();
  },
  startTicking(fn){ this.stopTicking(); this._tick = setInterval(fn, 1000); },
  stopTicking(){ if(this._tick){ clearInterval(this._tick); this._tick = null; } }
};

/**
 * Descansos do cronômetro (ms) → descansos do estudo (ISO + minutos).
 * v6.5 — os minutos saem do TOTAL de descanso, distribuídos entre as pausas
 * (TimeRules.distributeMinutes). Antes cada pausa era arredondada sozinha e
 * várias pausas curtas somavam zero; agora o total registrado acompanha o
 * total real. Uma pausa que fica com 0 min não vira registro — o tempo dela
 * já está contado no total das outras.
 */
function timerBreaksToSession(breaks){
  const list = (breaks || []).filter(b => b && isNum(b.startedAt) && isNum(b.endedAt) && b.endedAt > b.startedAt);
  const minutes = TimeRules.distributeMinutes(list.map(b => b.endedAt - b.startedAt));
  return sanitizeBreaks(list.map((b, i) => ({
    id: b.id, startedAt: new Date(b.startedAt).toISOString(), endedAt: new Date(b.endedAt).toISOString(), minutes: minutes[i]
  })).filter(b => b.minutes > 0));
}

/* =========================================================================
   BACKUP / IMPORT / EXPORT
   ========================================================================= */
const Backup = {
  /**
   * v6.4 — créditos não fazem mais parte do Ciclo. Registros antigos ainda podem
   * carregar `credits`, `minutesPerCredit` e `legacyWeeklyMinutes` no banco
   * (nada foi apagado), mas o backup novo sai sem eles. Backups antigos COM
   * esses campos continuam sendo aceitos: a importação apenas os ignora.
   */
  _withoutLegacy(obj, keys){
    if(!keys.some(k => k in obj)) return obj;
    const copy = Object.assign({}, obj);
    keys.forEach(k => { delete copy[k]; });
    return copy;
  },
  buildExport(){
    return {
      schemaVersion: APP_SCHEMA_VERSION,
      app: 'ciclo',                 // só informativo: a importação não depende deste campo
      appVersion: APP_VERSION,
      exportedAt: nowISO(),
      areas: state.areas,
      disciplines: state.disciplines.map(d => this._withoutLegacy(d, ['minutesPerCredit','legacyWeeklyMinutes'])),
      topics: state.topics,
      sessions: state.sessions.map(s => this._withoutLegacy(s, ['credits'])),
      plans: state.plans,
      weeklyPlans: state.weeklyPlans,
      deadlines: state.deadlines,
      settings: state.settings
    };
  },

  download(filename, content, mime){
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  },

  async exportJSON(){
    // v6.5: o backup sai do que está NO BANCO agora (outra aba pode ter gravado depois do último desenho desta).
    await loadAll();
    this.download(`ciclo_backup_${todayISO()}.json`, JSON.stringify(this.buildExport(), null, 2), 'application/json');
    // "gerado", não "feito": o Ciclo não tem como confirmar que o navegador salvou o arquivo.
    await setMeta('lastBackupAt', nowISO());
  },

  /**
   * Texto de uma célula de CSV. v6.5 — planilhas (Excel, LibreOffice, Google)
   * tratam como FÓRMULA qualquer célula que comece com = + - @ (ou com TAB/CR).
   * Um comentário como "=HYPERLINK(...)" seria executado ao abrir o arquivo.
   * A célula de texto que começa assim ganha um apóstrofo na frente: a planilha
   * mostra o texto e não calcula nada. Números do próprio Ciclo não passam por
   * aqui (ver `exportCSV`), então continuam sendo números na planilha.
   */
  csvText(v){
    let t = str(v);
    if(/^[\t\r]/.test(t) || /^\s*[=+\-@]/.test(t)) t = "'" + t;
    return '"' + t.replace(/"/g, '""') + '"';
  },
  csvNumber(v){
    const n = Number(v);
    return isFinite(n) ? String(Math.round(n * 100) / 100) : '0';
  },

  buildCSV(){
    // `minutos` é o tempo de estudo; o descanso sai numa coluna própria e nunca é somado a ele.
    const head = ['data','area','disciplina','topico','tipo','dificuldade','minutos','descanso_minutos','resultado_revisao','metodo_revisao','comentario'];
    const T = v => this.csvText(v), N = v => this.csvNumber(v);
    const rows = state.sessions.slice().sort((a,b) => a.date.localeCompare(b.date)).map(s => {
      const d = getDiscipline(s.disciplineId);
      const diff = difficultyInfo(s.difficulty);
      return [
        T(s.date), T(d ? areaNameOf(d) : ''), T(d ? d.name : ''), T(topicLabelOf(s)),
        T(s.type ? sessionTypeLabel(s.type) : ''), T(diff ? diff.label : ''),
        N(s.minutes), N(breakMinutesOf(s)), T(reviewOutcomeLabel(s.reviewOutcome) || ''),
        T(s.reviewMethod ? methodLabel(s.reviewMethod) : ''), T(s.comment)
      ].join(',');
    });
    // BOM: sem ele o Excel lê acentos errados. CRLF é o fim de linha do formato CSV (RFC 4180).
    return '﻿' + [head.join(','), ...rows].join('\r\n') + '\r\n';
  },

  exportCSV(){
    this.download(`ciclo_sessoes_${todayISO()}.csv`, this.buildCSV(), 'text/csv;charset=utf-8');
  },

  /**
   * Lê o texto de um arquivo de backup e devolve { data, report, warnings, format }.
   * Nunca executa conteúdo. Lança um Error (com `fatal:true`) quando o arquivo
   * não pode ser restaurado — nesse caso nada é gravado e o banco atual fica intacto.
   * A validação em si é do IntegrityValidator.
   */
  parseBackup(text){
    let raw;
    try { raw = JSON.parse(text); }
    catch(_){ throw IntegrityValidator.fatal('O arquivo não é um JSON legível. Ele pode estar incompleto ou ter sido alterado.', 'Arquivo ilegível'); }
    const out = IntegrityValidator.analyzeBackup(raw);
    return { data: out.data, report: out.report, warnings: out.report.repaired.concat(out.report.ignored).map(x => x.text), format: out.report.format };
  },

  _arr(v){ return Array.isArray(v) ? v : []; },

  /**
   * Substitui todo o conteúdo do banco pelo backup.
   *
   * v5.2.1 — limpeza e regravação acontecem na MESMA transação: ou o estado novo
   * entra inteiro, ou o antigo permanece exatamente como estava.
   * v6.5 — os registros entram com `add`, que recusa chave repetida. A validação
   * já garante que não há ids repetidos; se algum escapasse, a transação inteira
   * seria desfeita em vez de um registro sobrescrever outro em silêncio.
   */
  async restoreInto(data){
    const stores = ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines','settings'];
    await DB.transactional(stores, api => {
      stores.forEach(st => api.clear(st));
      data.areas.forEach(x => api.add('areas', x));
      data.disciplines.forEach(x => api.add('disciplines', x));
      data.topics.forEach(x => api.add('topics', x));
      data.sessions.forEach(x => api.add('sessions', x));
      data.plans.forEach(x => api.add('plans', x));
      data.weeklyPlans.forEach(x => api.add('weeklyPlans', x));
      data.deadlines.forEach(x => api.add('deadlines', x));
      api.put('settings', { key:'settings', value:data.settings });
    });
  }
};

/* =========================================================================
   v6.5 — INTEGRITY VALIDATOR: a única fonte de validação estrutural.
   A restauração de backup e o diagnóstico "Verificar integridade" usam as
   mesmas regras. Puro: não lê o banco, não grava, não toca na tela.

   Cada problema encontrado cai em UMA de três classes:

     FATAL      o arquivo não pode ser restaurado com segurança. Nada é gravado.
                · não é JSON / não é um backup do Ciclo / coleção corrompida
                · foi criado por uma versão MAIS NOVA do Ciclo
                · dois registros DIFERENTES com o mesmo identificador
                · não tem nenhum dado
     REPARÁVEL  o registro entra, com um ajuste explícito e contado
                (vínculo quebrado desfeito, valor ilegível em branco…)
     IGNORÁVEL  o registro fica de fora, com o motivo contado
                (sem identificador, órfão, sem data recuperável…)

   Regras que não mudam:
     · identificadores são comparados DEPOIS de normalizados: 1 e "1" são o mesmo;
     · toda relação é conferida (área, disciplina, tópico — e o tópico tem de
       ser da mesma disciplina do estudo ou do prazo);
     · uma data ilegível NUNCA vira "hoje": ou é recuperada de outro campo do
       próprio registro, ou o registro fica de fora — e isso é dito à pessoa;
     · conversões de formato antigo (importância → prioridade, concluído →
       status, backup da V2) são migrações, não reparos: não contam como problema.
   ========================================================================= */
const IntegrityValidator = {
  STORE_LABELS: { areas:'áreas', disciplines:'disciplinas', topics:'tópicos', sessions:'estudos', plans:'planos', weeklyPlans:'semanas registradas', deadlines:'prazos' },

  fatal(message, title){
    const e = new Error(message);
    e.fatal = true;
    e.title = title || 'Este backup não pode ser restaurado';
    return e;
  },

  /** Identificador normalizado: texto sem espaços nas pontas; número vira texto. Qualquer outra coisa não é id. */
  normId(v){
    if(typeof v === 'string') return v.trim();
    if(typeof v === 'number' && isFinite(v)) return String(v);
    return '';
  },

  /** Data civil: { value, trimmed } — aceita "YYYY-MM-DD" e, como reparo, "YYYY-MM-DDT…" (só o dia). */
  civilDate(v){
    if(typeof v !== 'string') return { value:null, trimmed:false };
    if(isStrictISODate(v)) return { value:v, trimmed:false };
    if(/^\d{4}-\d{2}-\d{2}[T ]/.test(v) && isStrictISODate(v.slice(0, 10))) return { value: v.slice(0, 10), trimmed:true };
    return { value:null, trimmed:false };
  },

  /** Instante: ISO normalizado ou null. */
  instant(v){
    const t = validInstant(v);
    return t === null ? null : new Date(t).toISOString();
  },

  /** Frases do relatório, por código. */
  TEXT: {
    // reparos
    'name-empty':            n => `${plural(n, 'registro sem nome recebeu', 'registros sem nome receberam')} um nome padrão.`,
    'area-missing':          n => `${plural(n, 'disciplina apontava', 'disciplinas apontavam')} para uma área que não existe no arquivo: ${n === 1 ? 'fica' : 'ficam'} sem área.`,
    'priority':              n => `${plural(n, 'prioridade fora da escala de 1 a 5 voltou', 'prioridades fora da escala de 1 a 5 voltaram')} para "Média".`,
    'option':                n => `${plural(n, 'opção desconhecida voltou', 'opções desconhecidas voltaram')} ao padrão (tipo, estratégia, método ou situação).`,
    'topic-date':            n => `${plural(n, 'data ilegível de tópico ficou', 'datas ilegíveis de tópicos ficaram')} em branco.`,
    'topic-number':          n => `${plural(n, 'número inválido de revisão voltou', 'números inválidos de revisão voltaram')} ao valor inicial.`,
    'session-topic-missing': n => `${plural(n, 'estudo apontava', 'estudos apontavam')} para um tópico que não existe no arquivo: ${n === 1 ? 'fica' : 'ficam'} só na disciplina.`,
    'session-topic-foreign': n => `${plural(n, 'estudo apontava', 'estudos apontavam')} para um tópico de outra disciplina: ${n === 1 ? 'fica' : 'ficam'} só na disciplina.`,
    'session-date-derived':  n => `${plural(n, 'estudo sem data legível recebe', 'estudos sem data legível recebem')} o dia do horário de início gravado ${n === 1 ? 'nele' : 'neles'} — ou, na falta, o dia em que ${n === 1 ? 'foi registrado' : 'foram registrados'}.`,
    'date-trimmed':          n => `${plural(n, 'data trazia', 'datas traziam')} horário junto e ${n === 1 ? 'ficou' : 'ficaram'} só com o dia.`,
    'session-clock':         n => `${plural(n, 'horário ilegível de estudo ficou', 'horários ilegíveis de estudo ficaram')} em branco. A duração foi mantida.`,
    'minutes-text':          n => `${plural(n, 'duração gravada como texto virou', 'durações gravadas como texto viraram')} número.`,
    'minutes-invalid':       n => `${plural(n, 'estudo com duração ilegível ou negativa fica', 'estudos com duração ilegível ou negativa ficam')} com 0 min.`,
    'breaks':                n => `${plural(n, 'descanso sem duração válida ficou', 'descansos sem duração válida ficaram')} de fora.`,
    'plan-active':           n => `Havia mais de um plano marcado como ativo: ${plural(n, 'plano deixou', 'planos deixaram')} de ser o ativo.`,
    'deadline-link':         n => `${plural(n, 'prazo apontava', 'prazos apontavam')} para uma disciplina ou um tópico que não existe ou não combina: ${n === 1 ? 'fica' : 'ficam'} sem esse vínculo.`,
    'deadline-field':        n => `${plural(n, 'data ilegível de prazo ficou', 'datas ilegíveis de prazos ficaram')} em branco (início ou conclusão).`,
    'stamp':                 n => `${plural(n, 'registro sem data de criação legível recebe', 'registros sem data de criação legível recebem')} a data de agora.`,
    // ignorados
    'no-id':                 n => `${plural(n, 'registro sem identificador', 'registros sem identificador')}.`,
    'duplicate':             n => `${plural(n, 'registro repetido, idêntico a outro', 'registros repetidos, idênticos a outros')}.`,
    'topic-orphan':          n => `${plural(n, 'tópico', 'tópicos')} de uma disciplina que não existe no arquivo.`,
    'session-orphan':        n => `${plural(n, 'estudo', 'estudos')} de uma disciplina que não existe no arquivo.`,
    'session-no-date':       n => `${plural(n, 'estudo', 'estudos')} sem nenhuma data recuperável.`,
    'deadline-no-date':      n => `${plural(n, 'prazo', 'prazos')} sem data legível.`,
    'week-invalid':          n => `${plural(n, 'semana registrada', 'semanas registradas')} sem data de início válida.`,
    'alloc-orphan':          n => `${plural(n, 'divisão de tempo', 'divisões de tempo')} de plano para uma disciplina que não existe no arquivo.`,
    'alloc-dup':             n => `${plural(n, 'divisão de tempo repetida', 'divisões de tempo repetidas')} dentro do mesmo plano.`
  },

  /**
   * Valida e normaliza um conjunto de coleções.
   * `raw` = objeto do backup já lido. Devolve { data, report } ou lança `fatal`.
   */
  analyzeBackup(raw){
    if(!raw || typeof raw !== 'object' || Array.isArray(raw)) throw this.fatal('O arquivo tem uma estrutura inesperada.', 'Arquivo inválido');

    const isV3 = Number(raw.schemaVersion) >= 3 || Array.isArray(raw.disciplines);  // cobre v3 em diante
    const isV2 = !isV3 && (Array.isArray(raw.subjects) || Array.isArray(raw.logs));
    if(!isV3 && !isV2) throw this.fatal('O arquivo não parece um backup do Ciclo.', 'Arquivo inválido');

    // Um backup de uma versão futura pode ter campos e regras que esta versão não conhece:
    // restaurar "o que der" perderia dados sem ninguém perceber.
    const sv = Number(raw.schemaVersion);
    if(isV3 && isFinite(sv) && sv > APP_SCHEMA_VERSION){
      throw this.fatal('Este backup foi criado por uma versão mais nova do Ciclo. Atualize o Ciclo (recarregue a página) e tente restaurar de novo. Seus dados atuais não foram alterados.',
        'Backup de uma versão mais nova');
    }

    // Coleções presentes precisam ser listas de verdade: um campo corrompido não
    // pode virar silenciosamente uma restauração vazia (que apagaria tudo).
    if(isV3){
      ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines'].forEach(k => {
        if(k in raw && raw[k] !== null && raw[k] !== undefined && !Array.isArray(raw[k])){
          throw this.fatal(`A parte "${this.STORE_LABELS[k]}" do arquivo está corrompida.`, 'Arquivo corrompido');
        }
      });
    }

    let source, notes = [];
    if(isV2){
      const c = convertV2(raw, { keepRawDate:true });
      source = { areas:c.areas, disciplines:c.disciplines, topics:[], sessions:c.sessions, plans:[], weeklyPlans:[], deadlines:[], settings:c.settings };
      notes.push('Backup no formato da V2 (Diário de Estudos): convertido automaticamente.');
      const out = this.analyze(source);
      if(c.orphanLogs){ out.report.ignoredCodes['session-orphan'] = (out.report.ignoredCodes['session-orphan'] || 0) + c.orphanLogs; out.report.counts.sessions.found += c.orphanLogs; out.report.counts.sessions.ignored += c.orphanLogs; }
      return this._finish(out, { format:'v2', notes, raw });
    }
    const arr = v => Array.isArray(v) ? v : [];
    source = {
      areas: arr(raw.areas), disciplines: arr(raw.disciplines), topics: arr(raw.topics), sessions: arr(raw.sessions),
      plans: arr(raw.plans), weeklyPlans: arr(raw.weeklyPlans), deadlines: arr(raw.deadlines),
      settings: Object.assign({}, DEFAULT_SETTINGS, (raw.settings && typeof raw.settings === 'object' && !Array.isArray(raw.settings)) ? raw.settings : {})
    };
    return this._finish(this.analyze(source), { format:'v3', notes, raw });
  },

  _finish(out, meta){
    const r = out.report, d = out.data;
    r.format = meta.format;
    r.notes = meta.notes;
    r.schemaVersion = isFinite(Number(meta.raw.schemaVersion)) ? Number(meta.raw.schemaVersion) : null;
    r.appVersion = typeof meta.raw.appVersion === 'string' ? meta.raw.appVersion.slice(0, 20) : null;
    r.exportedAt = this.instant(meta.raw.exportedAt);
    const list = codes => Object.keys(codes).map(code => ({ code, count: codes[code], text: (this.TEXT[code] || (n => `${n} × ${code}`))(codes[code]) }));
    r.repaired = list(r.repairedCodes);
    r.ignored = list(r.ignoredCodes);
    if(d.disciplines.length === 0 && d.sessions.length === 0 && d.areas.length === 0){
      throw this.fatal('O arquivo não contém dados para restaurar.', 'Backup vazio');
    }
    return out;
  },

  /**
   * O núcleo: coleções brutas → coleções normalizadas + relatório.
   * Também é usado pelo diagnóstico, sobre os dados que já estão no banco.
   */
  analyze(src){
    const self = this;
    const report = { counts:{}, repairedCodes:{}, ignoredCodes:{} };
    const now = nowISO();
    let touched = false;                                   // o registro em análise sofreu algum reparo?
    const fix = code => { report.repairedCodes[code] = (report.repairedCodes[code] || 0) + 1; touched = true; };
    const drop = code => { report.ignoredCodes[code] = (report.ignoredCodes[code] || 0) + 1; return null; };
    const stamp = v => { const t = self.instant(v); if(t) return t; fix('stamp'); return now; };
    const name = (v, fallback) => { const t = str(v).trim(); if(t) return str(v); fix('name-empty'); return fallback; };
    const oneOf = (v, list, fallback) => {
      if(list.includes(v)) return v;
      if(v !== undefined && v !== null && v !== '') fix('option');
      return fallback;
    };
    const priority = (v, legacy) => {
      const n = Number(v);
      if(v !== undefined && v !== null && v !== '' && !(Number.isFinite(n) && n >= 1 && n <= 5)) fix('priority');
      return normalizePriority(v, legacy);
    };
    const sameRecord = (a, b, id) => {
      try { return JSON.stringify(Object.assign({}, a, { id })) === JSON.stringify(Object.assign({}, b, { id })); }
      catch(_){ return false; }
    };

    /** Percorre uma coleção aplicando `build`; cuida de id, duplicatas e contagens. */
    function collect(store, list, idOf, build){
      const out = [], seen = new Map();
      let repaired = 0;
      (list || []).forEach(rec => {
        if(!rec || typeof rec !== 'object' || Array.isArray(rec)){ drop('no-id'); return; }
        const id = idOf(rec);
        if(!id){ drop('no-id'); return; }
        if(seen.has(id)){
          if(sameRecord(seen.get(id), rec, id)){ drop('duplicate'); return; }
          throw self.fatal(`O arquivo tem dois registros diferentes com o mesmo identificador em ${self.STORE_LABELS[store]} ("${id.slice(0, 40)}"). ` +
            'Restaurar escolheria um deles às cegas, então nada foi alterado.', 'Identificadores repetidos no backup');
        }
        seen.set(id, rec);
        touched = false;
        const built = build(rec, id);
        if(!built) return;
        out.push(built);
        if(touched) repaired++;
      });
      report.counts[store] = { found: (list || []).length, accepted: out.length, repaired, ignored: (list || []).length - out.length };
      return out;
    }
    const byId = rec => self.normId(rec.id);
    const ref = v => self.normId(v);

    /* ---------- áreas ---------- */
    const areas = collect('areas', src.areas, byId, (a, id) => ({
      id, name: name(a.name, 'Área'), archived: !!a.archived, createdAt: stamp(a.createdAt), updatedAt: stamp(a.updatedAt)
    }));
    const areaIds = new Set(areas.map(a => a.id));

    /* ---------- disciplinas ---------- */
    const strategies = ['inherit'].concat(REVIEW_STRATEGIES.map(x => x.v));
    const methods = ['inherit'].concat(REVIEW_METHODS.map(x => x.v));
    const disciplines = collect('disciplines', src.disciplines, byId, (d, id) => {
      let areaId = ref(d.areaId) || null;
      if(areaId && !areaIds.has(areaId)){ areaId = null; fix('area-missing'); }
      return {
        id, areaId, name: name(d.name, 'Disciplina'),
        priority: priority(d.priority),
        // v6.4: `minutesPerCredit` e `legacyWeeklyMinutes` de backups antigos são aceitos e ignorados
        contentNature: oneOf(d.contentNature, CONTENT_NATURES.map(n => n.v), 'mixed'),
        reviewStrategy: oneOf(d.reviewStrategy, strategies, 'inherit'),
        preferredReviewMethod: oneOf(d.preferredReviewMethod, methods, 'inherit'),
        archived: !!d.archived, createdAt: stamp(d.createdAt), updatedAt: stamp(d.updatedAt)
      };
    });
    const discIds = new Set(disciplines.map(d => d.id));

    /* ---------- tópicos ---------- */
    const topicDate = v => {
      if(v === null || v === undefined || v === '') return null;
      const c = self.civilDate(v);
      if(!c.value){ fix('topic-date'); return null; }
      if(c.trimmed) fix('date-trimmed');
      return c.value;
    };
    const count = v => {
      if(v === null || v === undefined) return 0;
      if(isNum(v) && v >= 0) return Math.round(v);
      fix('topic-number'); return 0;
    };
    const topics = collect('topics', src.topics, byId, (t, id) => {
      const disciplineId = ref(t.disciplineId);
      if(!discIds.has(disciplineId)) return drop('topic-orphan');
      let interval = null;
      if(isNum(t.reviewIntervalDays) && t.reviewIntervalDays >= 1) interval = clamp(Math.round(t.reviewIntervalDays), 1, REVIEW_MAX_INTERVAL);
      else if(t.reviewIntervalDays !== null && t.reviewIntervalDays !== undefined) fix('topic-number');
      let mastery = null;
      if(isNum(t.masteryLevel) && t.masteryLevel >= 1 && t.masteryLevel <= 5) mastery = Math.round(t.masteryLevel);
      else if(t.masteryLevel !== null && t.masteryLevel !== undefined) fix('topic-number');
      return Object.assign({
        id, disciplineId, name: name(t.name, 'Tópico'),
        sortOrder: isNum(t.sortOrder) ? t.sortOrder : 0, archived: !!t.archived,
        reviewEnabled: t.reviewEnabled !== false,
        firstStudiedAt: topicDate(t.firstStudiedAt),
        lastStudiedAt: topicDate(t.lastStudiedAt),
        reviewDueDate: topicDate(t.reviewDueDate),
        reviewIntervalDays: interval,
        lastReviewedAt: topicDate(t.lastReviewedAt),
        reviewRepetitions: count(t.reviewRepetitions),
        masteryLevel: mastery,
        consecutiveSuccessfulReviews: count(t.consecutiveSuccessfulReviews),
        // v5.2: prioridade 1–5; backups antigos trazem `importance` (low/normal/high)
        priority: priority(t.priority, t.importance),
        reviewStrategy: oneOf(t.reviewStrategy, strategies, 'inherit'),
        preferredReviewMethod: oneOf(t.preferredReviewMethod, methods, 'inherit'),
        reviewCycleStep: isNum(t.reviewCycleStep) ? clamp(Math.round(t.reviewCycleStep), 0, 10) : 0,
        reviewFailures: count(t.reviewFailures),
        lastReviewOutcome: oneOf(t.lastReviewOutcome, REVIEW_OUTCOMES.map(o => o.v), null)
      },
      // v6.3: o último jeito de revisar (gravado pelo motor de revisão) também volta no backup
      CONCRETE_METHODS.includes(t.lastReviewMethod) ? { lastReviewMethod: t.lastReviewMethod } : {},
      { createdAt: stamp(t.createdAt), updatedAt: stamp(t.updatedAt) });
    });
    const topicDisc = new Map(topics.map(t => [t.id, t.disciplineId]));

    /* ---------- estudos ---------- */
    const sessions = collect('sessions', src.sessions, byId, (s, id) => {
      const disciplineId = ref(s.disciplineId);
      if(!discIds.has(disciplineId)) return drop('session-orphan');

      // Instantes primeiro: eles podem socorrer uma data ilegível.
      let startedAt = self.instant(s.startedAt), endedAt = self.instant(s.endedAt);
      const hadClock = (s.startedAt !== null && s.startedAt !== undefined && s.startedAt !== '') || (s.endedAt !== null && s.endedAt !== undefined && s.endedAt !== '');
      if(hadClock && (!startedAt || !endedAt || Date.parse(endedAt) <= Date.parse(startedAt))){
        startedAt = null; endedAt = null; fix('session-clock');
      }
      const createdAt = self.instant(s.createdAt);

      // A data do estudo NUNCA vira "hoje": ou é a gravada, ou sai de um instante do próprio registro, ou o estudo fica de fora.
      const c = self.civilDate(s.date);
      let date = c.value;
      if(date && c.trimmed) fix('date-trimmed');
      if(!date){
        date = localDateOfStamp(startedAt) || localDateOfStamp(createdAt);
        if(!date) return drop('session-no-date');
        fix('session-date-derived');
      }

      let topicId = ref(s.topicId) || null;
      if(topicId && !topicDisc.has(topicId)){ topicId = null; fix('session-topic-missing'); }
      else if(topicId && topicDisc.get(topicId) !== disciplineId){ topicId = null; fix('session-topic-foreign'); }

      // tempo de estudo: nunca recalculado na importação
      let minutes = 0;
      if(isNum(s.minutes) && s.minutes >= 0) minutes = Math.round(s.minutes);
      else if(typeof s.minutes === 'string' && s.minutes.trim() !== '' && isFinite(Number(s.minutes)) && Number(s.minutes) >= 0){ minutes = Math.round(Number(s.minutes)); fix('minutes-text'); }
      else fix('minutes-invalid');

      // v6.4: descansos do estudo. Backups anteriores não têm o campo → []. `credits` antigo é ignorado.
      const breaks = sanitizeBreaks(s.breaks);
      const rawBreaks = Array.isArray(s.breaks) ? Math.min(s.breaks.length, MAX_BREAKS_PER_STUDY) : 0;
      for(let i = breaks.length; i < rawBreaks; i++) fix('breaks');

      return {
        id, disciplineId, topicId, legacyTopicText: str(s.legacyTopicText),
        date, startedAt, endedAt, minutes, breaks,
        type: oneOf(s.type, SESSION_TYPES.map(t => t.v), null),
        difficulty: (isNum(s.difficulty) && s.difficulty >= 1 && s.difficulty <= 5) ? Math.round(s.difficulty) : null,
        comment: str(s.comment),
        reviewOutcome: oneOf(s.reviewOutcome, REVIEW_OUTCOMES.map(o => o.v), null),
        reviewMethod: oneOf(s.reviewMethod, REVIEW_METHODS.map(m => m.v), null),
        reviewStrategyAtTime: oneOf(s.reviewStrategyAtTime, REVIEW_STRATEGIES.map(x => x.v), null),
        createdAt: createdAt || stamp(s.createdAt), updatedAt: stamp(s.updatedAt)
      };
    });

    /* ---------- planos ---------- */
    const allocations = list => {
      const seen = new Set(), out = [];
      (Array.isArray(list) ? list : []).forEach(a => {
        if(!a || typeof a !== 'object'){ drop('alloc-orphan'); return; }
        const disciplineId = ref(a.disciplineId);
        if(!discIds.has(disciplineId)){ drop('alloc-orphan'); return; }
        if(seen.has(disciplineId)){ drop('alloc-dup'); return; }
        seen.add(disciplineId);
        out.push({
          disciplineId,
          priority: clamp(Number(a.priority) || 3, 1, 5),
          minWeeklyMinutes: isNum(a.minWeeklyMinutes) ? Math.max(0, Math.round(a.minWeeklyMinutes)) : 0,
          targetMinutes: isNum(a.targetMinutes) ? Math.max(0, Math.round(a.targetMinutes)) : 0
        });
      });
      return out;
    };
    let activeSeen = false;
    const plans = collect('plans', src.plans, byId, (p, id) => {
      let active = !!p.active;
      if(active && activeSeen){ active = false; fix('plan-active'); }
      else if(active) activeSeen = true;
      return {
        id, name: name(p.name, 'Plano'),
        weeklyAvailableMinutes: isNum(p.weeklyAvailableMinutes) ? Math.max(0, Math.round(p.weeklyAvailableMinutes)) : 0,
        active, allocations: allocations(p.allocations),
        createdAt: stamp(p.createdAt), updatedAt: stamp(p.updatedAt)
      };
    });

    /* ---------- semanas (o id é o primeiro dia da semana) ---------- */
    const weeklyPlans = collect('weeklyPlans', src.weeklyPlans,
      w => self.civilDate(w.weekStart).value || '',
      (w, id) => {
        const end = self.civilDate(w.weekEnd);
        return {
          id, weekStart: id,
          weekEnd: (end.value && !end.trimmed) ? end.value : addDaysISO(id, 6),
          basePlanId: ref(w.basePlanId) || null,
          availableMinutes: isNum(w.availableMinutes) ? Math.max(0, Math.round(w.availableMinutes)) : 0,
          allocations: allocations(w.allocations),
          createdAt: stamp(w.createdAt), updatedAt: stamp(w.updatedAt)
        };
      });
    // semanas sem data válida caíram em "sem identificador": o motivo certo é a data
    const badWeeks = (src.weeklyPlans || []).filter(w => w && typeof w === 'object' && !Array.isArray(w) && !self.civilDate(w.weekStart).value).length;
    if(badWeeks){
      report.ignoredCodes['week-invalid'] = (report.ignoredCodes['week-invalid'] || 0) + badWeeks;
      report.ignoredCodes['no-id'] -= badWeeks;
      if(!(report.ignoredCodes['no-id'] > 0)) delete report.ignoredCodes['no-id'];
    }

    /* ---------- prazos ---------- */
    const deadlines = collect('deadlines', src.deadlines, byId, (d, id) => {
      // v5.2: tipo, status, início, orientações e anotações. Backups antigos
      // (date/importance/completed) são convertidos aqui, sem perda.
      let c = self.civilDate(d.date);
      if(!c.value) c = self.civilDate(d.dueDate);
      if(!c.value) return drop('deadline-no-date');          // antes virava "hoje" em silêncio
      if(c.trimmed) fix('date-trimmed');

      let disciplineId = ref(d.disciplineId) || null;
      let topicId = ref(d.topicId) || null;
      if(disciplineId && !discIds.has(disciplineId)){ disciplineId = null; fix('deadline-link'); }
      if(topicId && !topicDisc.has(topicId)){ topicId = null; fix('deadline-link'); }
      if(topicId && !disciplineId) disciplineId = topicDisc.get(topicId) || null;
      if(topicId && topicDisc.get(topicId) !== disciplineId){ topicId = null; fix('deadline-link'); }   // tópico precisa ser da disciplina

      let status = d.completed ? 'completed' : 'pending';       // formato antigo: só `completed`
      if(DEADLINE_STATUSES.some(x => x.v === d.status)) status = d.status;
      else if(d.status !== undefined && d.status !== null && d.status !== '') fix('option');
      let startDate = null;
      if(d.startDate !== null && d.startDate !== undefined && d.startDate !== ''){
        const sd = self.civilDate(d.startDate);
        if(sd.value){ startDate = sd.value; if(sd.trimmed) fix('date-trimmed'); } else fix('deadline-field');
      }
      // `completedAt` é um instante; versões antigas podem ter gravado só o dia — os dois são aceitos
      let completedAt = null;
      if(status === 'completed' && d.completedAt !== null && d.completedAt !== undefined && d.completedAt !== ''){
        completedAt = (typeof d.completedAt === 'string' && isStrictISODate(d.completedAt)) ? d.completedAt : self.instant(d.completedAt);
        if(!completedAt) fix('deadline-field');
      }
      return {
        id, title: name(str(d.title).slice(0, 160), 'Prazo'),
        type: oneOf(d.type, DEADLINE_TYPES.map(x => x.v), 'other'),
        date: c.value, startDate, disciplineId, topicId,
        priority: priority(d.priority, d.importance),
        status,
        instructions: str(d.instructions).slice(0, 5000),
        notes: str(d.notes).slice(0, 5000),
        completedAt,
        createdAt: stamp(d.createdAt), updatedAt: stamp(d.updatedAt)
      };
    });

    const data = { areas, disciplines, topics, sessions, plans, weeklyPlans, deadlines, settings: sanitizeSettings(src.settings) };
    return { data, report };
  },

  /**
   * Diagnóstico dos dados que já estão no navegador: mesma validação da
   * restauração, sem alterar nada. Devolve { ok, total, repaired[], ignored[], counts }.
   */
  diagnose(collections){
    try {
      const out = this.analyze(collections);
      const r = out.report;
      const list = codes => Object.keys(codes).map(code => ({ code, count: codes[code], text: (this.TEXT[code] || (n => `${n} × ${code}`))(codes[code]) }));
      const repaired = list(r.repairedCodes), ignored = list(r.ignoredCodes);
      /* Duas conferências que só fazem sentido sobre dados em uso (não são erro de
         arquivo): horário que não fecha com a duração e tópico com marcas de
         estudo sem nenhum estudo no histórico. Vêm de edições e exclusões feitas
         antes da v6.5; o Ciclo convive com elas e as corrige quando o estudo ou o
         tópico é editado. */
      const observations = [];
      const mismatch = out.data.sessions.filter(x => { const c = TimeRules.clockInfo(x); return c.mode === 'clock' && !c.consistent; }).length;
      if(mismatch) observations.push({ code:'clock-mismatch', count:mismatch,
        text:`${plural(mismatch, 'estudo tem', 'estudos têm')} um horário gravado que não fecha com a duração. O Ciclo mostra e conta a duração.` });
      const withHistory = new Set(out.data.sessions.map(x => x.topicId).filter(Boolean));
      const ghosts = out.data.topics.filter(t => !withHistory.has(t.id) && (t.lastReviewedAt || t.reviewDueDate || t.firstStudiedAt)).length;
      if(ghosts) observations.push({ code:'topic-ghost', count:ghosts,
        text:`${plural(ghosts, 'tópico guarda', 'tópicos guardam')} datas de estudo ou de revisão sem nenhum estudo no histórico (provavelmente de estudos excluídos em versões anteriores).` });
      return { ok: !repaired.length && !ignored.length && !observations.length, repaired, ignored, observations, counts: r.counts, fatal:null };
    } catch(err){
      if(err && err.fatal) return { ok:false, repaired:[], ignored:[], observations:[], counts:{}, fatal: err.message };
      throw err;
    }
  }
};

function sanitizeSettings(s){
  const src = s && typeof s === 'object' ? s : {};
  // Instalações anteriores não têm os campos da v3.1: todos recebem defaults seguros.
  return {
    theme: ['light','dark','system'].includes(src.theme) ? src.theme : 'dark',
    density: (src.density === 'compact') ? 'compact' : 'comfortable',
    startView: ['today','plan','analytics'].includes(src.startView) ? src.startView : 'today',
    helpMode: ['full','discreet','off'].includes(src.helpMode) ? src.helpMode : 'full',
    hoverHints: src.hoverHints !== false,
    showUpcomingReviews: src.showUpcomingReviews !== false,
    seenTips: Array.isArray(src.seenTips) ? src.seenTips.filter(x => typeof x === 'string').slice(0, 50) : [],
    weekStart: (src.weekStart === 'sunday') ? 'sunday' : 'monday',
    defaultSessionMinutes: clamp(Math.round(Number(src.defaultSessionMinutes) || DEFAULT_SETTINGS.defaultSessionMinutes), 5, 600),
    defaultReviewMinutes: clamp(Math.round(Number(src.defaultReviewMinutes) || DEFAULT_SETTINGS.defaultReviewMinutes), 5, 600),
    autoReviewNewTopics: src.autoReviewNewTopics !== false,
    reduceMotion: !!src.reduceMotion,
    defaultPeriod: ['hoje','7d','30d','semana','mes','tudo'].includes(src.defaultPeriod) ? src.defaultPeriod : DEFAULT_SETTINGS.defaultPeriod,
    /* v4 — instalações anteriores recebem defaults seguros */
    defaultReviewStrategy: REVIEW_STRATEGIES.some(x => x.v === src.defaultReviewStrategy) ? src.defaultReviewStrategy : 'adaptive',
    defaultReviewMethod: REVIEW_METHODS.some(x => x.v === src.defaultReviewMethod) ? src.defaultReviewMethod : 'auto',
    showDailyQuote: src.showDailyQuote !== false,
    seenWhatsNew: typeof src.seenWhatsNew === 'string' ? src.seenWhatsNew : null
  };
}

/* =========================================================================
   UI STATE
   ========================================================================= */
const ui = {
  view: 'today',
  period: null,               // { start, end } — usado em Análises
  periodPreset: 'semana',
  calMonth: null,
  distributionMode: 'discipline',
  openDisciplineId: null,
  showArchivedDisciplines: false,
  history: { search:'', areaId:'', disciplineId:'', topicId:'', period:'todos', type:'', difficulty:'' },
  planDraft: null,            // rascunho editável da tela de Planejamento
  weekOffset: 0,              // navegação de semanas no relatório semanal
  planExpanded: false,        // v5: true quando o usuário pediu os controles detalhados
  reviewQueue: null,          // v4: itens restantes da sessão de revisão montada
  prevView: null,             // v5.1: tela anterior (contexto do relato de problema)
  openDeadlineId: null,       // v5.2: prazo aberto no painel lateral
  analyticsScope: { type:'all', areaId:null, disciplineId:null, topicId:null },   // espelho do escopo da consulta aplicada
  /* v6 — Análises: escolher → gerar → entender → explorar */
  analyticsQuery: null,       // consulta aplicada (fonte única de verdade do resultado)
  analyticsDraft: null,       // consulta sendo montada no seletor (não altera o resultado)
  analyticsMode: 'select',    // 'select' | 'result'
  analyticsKeepMode: false,   // true quando outra tela abre Análises já com um resultado
  analyticsExplore: new Set(),// seções de "Explorar mais" abertas
  analyticsShowAllInsights: false,
  anPick: null,               // estado transitório do seletor (busca, mês do calendário)
  discTab: 'disciplines',     // v6: Disciplinas | Prazos
  /* v6.1 — Disciplinas navegada como índice: Disciplinas → Área → Disciplina → Tópico */
  discNav: { level:'root', areaId:null, disciplineId:null, topicId:null },
  discNavDir: null,           // 'forward' | 'back' — direção do movimento no próximo desenho
  discFocus: null,            // data-fk que recebe o foco depois do próximo desenho
  discScroll: {},             // rolagem lembrada por nível (voltar não perde o lugar)
  areaJustCreated: null,      // área recém-criada e ainda vazia: convite contextual
  justCreated: null,          // v6.2: data-fk da linha recém-criada (entra com um fade breve)
  showArchivedAreas: false,
  historyLimit: 150,          // v6: quantas sessões o Histórico desenha antes de "Mostrar mais"
  settingsGroup: 'appearance',// v6: grupo aberto em Configurações
  planEditing: false,         // v6: Planejamento em modo de ajuste
  reviewsShowAll: false,      // v6: lista completa de revisões pendentes
  reviewsSearch: { q:'' },    // v6.2: busca só entre as revisões (tela Revisões)
  calMode: 'view',            // v5.2: 'view' (detalhes do dia) | 'select' (escolher intervalo)
  calSel: { start:null, end:null },
  calFocus: null,             // dia com foco de teclado no calendário
  calRefocus: null
};

/* =========================================================================
   PERSISTÊNCIA DE ALTO NÍVEL (o app fala com estas funções, não com o DB)
   ========================================================================= */
async function loadAll(){
  const [meta, settingsRec, areas, disciplines, topics, sessions, plans, weeklyPlans, deadlines] = await Promise.all([
    DB.getAll('meta'), DB.get('settings','settings'),
    DB.getAll('areas'), DB.getAll('disciplines'), DB.getAll('topics'),
    DB.getAll('sessions'), DB.getAll('plans'), DB.getAll('weeklyPlans'), DB.getAll('deadlines')
  ]);
  state.meta = {};
  (meta || []).forEach(m => { state.meta[m.key] = m.value; });
  // v6.5: a identidade de `state.settings` é preservada também aqui (ver saveSettings) —
  // com duas abas a recarga acontece mais vezes, e um objeto novo deixaria closures escrevendo num órfão.
  const cleanSettings = sanitizeSettings(settingsRec ? settingsRec.value : null);
  Object.keys(state.settings).forEach(k => { if(!(k in cleanSettings)) delete state.settings[k]; });
  Object.assign(state.settings, cleanSettings);
  state.areas = areas || [];
  state.disciplines = disciplines || [];
  state.topics = topics || [];
  state.sessions = sessions || [];
  // v6.4: se a migração não tiver rodado (falha de gravação), a memória ainda fica coerente
  state.sessions.forEach(s => { if(!Array.isArray(s.breaks)) s.breaks = []; });
  state.plans = plans || [];
  state.weeklyPlans = weeklyPlans || [];
  state.deadlines = deadlines || [];
  rebuildIndexes();
}

async function setMeta(key, value){
  await DB.put('meta', { key, value });
  state.meta[key] = value;
}
/**
 * Grava as preferências.
 *
 * Dois cuidados que a v3 não tinha e que causavam o bug de tema:
 *
 * 1. A identidade de `state.settings` é PRESERVADA. Antes, sanitizeSettings
 *    devolvia um objeto novo e `state.settings` era substituído — qualquer
 *    closure que tivesse capturado `state.settings` (como renderSettings)
 *    passava a escrever num objeto órfão, e a alteração se perdia.
 * 2. As gravações são serializadas numa fila. Cliques rápidos não disputam
 *    transações do IndexedDB; vence sempre o estado mais recente.
 */
let settingsWriteChain = Promise.resolve();

function applySettingsEffects(){
  applyTheme(state.settings.theme);
  applyDensity(state.settings.density);
  applyReduceMotion(state.settings.reduceMotion);
}

function saveSettings(){
  // sanitiza mutando em conteúdo, nunca trocando a referência
  const clean = sanitizeSettings(state.settings);
  Object.keys(state.settings).forEach(k => { if(!(k in clean)) delete state.settings[k]; });
  Object.assign(state.settings, clean);

  applySettingsEffects();   // efeito visual imediato, sem esperar o banco

  settingsWriteChain = settingsWriteChain.then(async () => {
    // sempre grava o estado ATUAL: a última alteração vence
    try { await DB.put('settings', { key:'settings', value: JSON.parse(JSON.stringify(state.settings)) }); }
    catch(err){ console.error('Falha ao salvar as configurações:', err); toast('Não foi possível salvar as configurações.', 'err'); }
  });
  return settingsWriteChain;
}


/* =========================================================================
   v6.5 — GRAVAR SEM PISAR EM NADA

   `patchEntity` é o caminho de toda edição de um registro que já existe
   (área, disciplina, tópico, prazo): dentro de UMA transação ele lê o registro
   como está no banco AGORA, aplica só os campos que a pessoa mudou e grava.

   Concorrência otimista, por campo:
     · `base` é o registro como estava quando o formulário abriu;
     · só entram os campos em que o formulário difere de `base`;
     · se algum DESSES campos foi alterado no banco depois de `base` (outra
       aba), nada é gravado e volta { reason:'conflict' } — a pessoa escolhe;
     · campos que o formulário não tocou nunca são sobrescritos: arquivar um
       tópico numa aba não desfaz a revisão registrada na outra.
   ========================================================================= */
async function patchEntity(store, id, changes, opts){
  const o = opts || {};
  try {
    return await DB.atomic([store], async api => {
      const cur = await api.get(store, id);
      if(!cur) return { ok:false, reason:'missing' };
      const base = o.base || cur;
      const keys = Object.keys(changes || {}).filter(k => !sameStored(changes[k], base[k]));
      if(!keys.length) return { ok:true, unchanged:true, entity:cur };
      if(o.base && !o.force){
        const clash = keys.filter(k => !sameStored(base[k], cur[k]) && !sameStored(changes[k], cur[k]));
        if(clash.length) return { ok:false, reason:'conflict', current:cur, fields:clash };
      }
      const next = Object.assign({}, cur);
      keys.forEach(k => { next[k] = changes[k]; });
      next.updatedAt = nowISO();
      api.put(store, next);
      return { ok:true, entity:next, previous:cur };
    });
  } catch(err){
    console.error(`Falha ao gravar em ${store}:`, err);
    return { ok:false, reason:'error', error:err };
  }
}

/**
 * Pergunta o que fazer quando o registro mudou em outra aba durante a edição.
 * Abre como subtela do próprio formulário: o que foi digitado continua lá.
 * Resolve com 'keep' (gravar a minha edição), 'discard' (ficar com a outra) ou 'back'.
 */
function askConflict(close, what){
  return new Promise(resolve => {
    let done = false;
    const finish = (v) => { if(done) return; done = true; if(v !== 'discard') close.pop(); resolve(v); };
    close.push({
      title:'Os dados mudaram em outra aba.',
      content: h('div',
        h('p', { class:'modal-sub', text:`Enquanto você editava, ${what} foi alterado em outra aba ou janela do Ciclo.` }),
        h('p', { class:'hint', text:'Manter a sua edição grava o que você preencheu por cima dessa alteração. Descartar fecha o formulário e mostra os dados como estão agora.' })),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Voltar à edição', onclick:() => finish('back') }),
        h('button', { class:'btn ghost', type:'button', text:'Descartar a minha edição', onclick:() => finish('discard') }),
        h('button', { class:'btn primary', type:'button', text:'Manter a minha edição', onclick:() => finish('keep') })
      ],
      onEsc:() => finish('back')
    });
  });
}

/**
 * Edita um registro a partir de um formulário aberto num modal.
 * Grava, trata conflito e registro removido, e SÓ ENTÃO devolve — quem chama
 * fecha a janela depois de { ok:true }. Em qualquer falha o formulário fica
 * aberto com tudo o que foi digitado.
 *   o = { store, id, changes, base, close, what:'este tópico' }
 */
async function saveEntityEdit(o){
  let res = await patchEntity(o.store, o.id, o.changes, { base:o.base });
  if(!res.ok && res.reason === 'conflict'){
    const choice = await askConflict(o.close, o.what || 'este item');
    if(choice === 'back') return { ok:false, reason:'back' };
    if(choice === 'discard'){ o.close(); await safeRefresh(); toast('Os dados mostrados são os mais recentes.', 'info', { title:'Edição descartada' }); return { ok:false, reason:'discarded' }; }
    res = await patchEntity(o.store, o.id, o.changes, { base:o.base, force:true });
  }
  if(!res.ok && res.reason === 'missing'){
    o.close(); await safeRefresh();
    toast('Ele foi removido em outra aba. Nada foi gravado.', 'info', { title:'Este item não existe mais' });
    return res;
  }
  if(!res.ok) toast('Tente novamente. O que você preencheu continua aqui.', 'err', { title:'Não foi possível salvar' });
  return res;
}

/** Ação direta (sem formulário) sobre um registro: arquivar, mudar prioridade… Devolve true se gravou. */
async function quickPatch(store, id, changes, failTitle){
  const res = await patchEntity(store, id, changes);
  if(res.ok) return true;
  if(res.reason === 'missing'){ await safeRefresh(); toast('Ele foi removido em outra aba.', 'info', { title:'Este item não existe mais' }); }
  else toast('Tente novamente. Nada foi alterado.', 'err', { title: failTitle || 'Não foi possível salvar' });
  return false;
}

/**
 * Várias gravações numa transação só, sempre sobre o registro COMO ESTÁ NO BANCO:
 *   { op:'patch', store, id, changes, required? }  muda só os campos indicados
 *   { op:'put', store, value }                      cria (ou regrava) um registro
 *   { op:'delete', store, id }
 * Um `patch` de registro que não existe mais é pulado (ou, com `required`,
 * cancela tudo). Lança se a gravação falhar — nada fica pela metade.
 */
async function writeBatch(ops){
  const stores = Array.from(new Set(ops.map(o => o.store)));
  if(!stores.length) return { ok:true };
  return DB.atomic(stores, async api => {
    const ts = nowISO();
    for(const o of ops){
      if(o.op === 'patch'){
        const cur = await api.get(o.store, o.id);
        if(!cur){
          if(o.required){ const e = new Error('registro ausente'); e.missing = true; throw e; }
          continue;
        }
        api.put(o.store, Object.assign({}, cur, o.changes, { updatedAt: ts }));
      } else if(o.op === 'put') api.put(o.store, o.value);
      else if(o.op === 'delete') api.delete(o.store, o.id);
    }
    return { ok:true };
  });
}

/* v6.5 — planos: "qual é o plano ativo" é decidido dentro da transação, lendo
   todos os planos do banco. Antes a memória era alterada primeiro e gravada
   depois: uma falha deixava a tela dizendo uma coisa e o banco outra. */
const PlanCommands = {
  /** Grava `plan` como o plano ATIVO. Qualquer outro plano ativo é desativado junto. */
  async saveActive(plan, weeklyPlan, opts){
    const o = opts || {};
    return DB.atomic(weeklyPlan ? ['plans','weeklyPlans'] : ['plans'], async api => {
      const all = await api.getAll('plans');
      const cur = all.find(p => p.id === plan.id) || null;
      // edição de um plano que mudou em outra aba: não grava por cima sem a pessoa saber
      if(cur && o.baseUpdatedAt !== undefined && !o.force && (cur.updatedAt || null) !== (o.baseUpdatedAt || null)) return { ok:false, reason:'conflict' };
      const ts = nowISO();
      all.forEach(p => { if(p.id !== plan.id && p.active) api.put('plans', Object.assign({}, p, { active:false, updatedAt:ts })); });
      api.put('plans', Object.assign({}, plan, { active:true, updatedAt:ts }));
      if(weeklyPlan) api.put('weeklyPlans', weeklyPlan);
      return { ok:true };
    });
  },
  async activate(id){
    return DB.atomic(['plans'], async api => {
      const all = await api.getAll('plans');
      if(!all.some(p => p.id === id)) return { ok:false, reason:'missing' };
      const ts = nowISO();
      all.forEach(p => { const want = p.id === id; if(!!p.active !== want) api.put('plans', Object.assign({}, p, { active:want, updatedAt:ts })); });
      return { ok:true };
    });
  },
  async remove(id){
    return DB.atomic(['plans'], async api => { api.delete('plans', id); return { ok:true }; });
  }
};

/* =========================================================================
   v6.5 — DATA SYNC: duas abas (ou janelas) do Ciclo abertas ao mesmo tempo.

   Toda gravação concluída avisa as outras abas: "os dados mudaram". O aviso
   leva só o TIPO do que mudou, quem avisou e a hora — nunca conteúdo do
   usuário. Quem recebe relê tudo do banco, que é a única fonte de verdade.

   Canal: BroadcastChannel; onde ele não existe, um carimbo no localStorage
   (o evento "storage" chega às outras abas). As duas vias ficam dentro do
   próprio navegador: nada sai do aparelho.

   Regra de ouro: um rascunho aberto NUNCA é atropelado. Se a pessoa está com
   um formulário aberto ou digitando, a tela não é redesenhada: aparece
   "Os dados mudaram em outra aba." com [Atualizar] e [Continuar editando].
   Ao salvar, a concorrência otimista (patchEntity/SessionCommands) decide.
   ========================================================================= */
const DataSync = {
  CHANNEL: 'ciclo:data',
  LS_KEY: 'ciclo:v6.5:sync',          // só um sinal entre abas; não guarda dado nenhum do usuário
  tabId: uid(),
  channel: null,
  pending: false,
  pendingKind: 'data',
  pendingStores: new Set(),
  running: false,
  timer: null,
  watch: null,
  notice: null,
  dismissed: false,

  start(){
    try {
      if(typeof BroadcastChannel === 'function'){
        this.channel = new BroadcastChannel(this.CHANNEL);
        this.channel.onmessage = (ev) => this.receive(ev.data);
      }
    } catch(_){ this.channel = null; }
    window.addEventListener('storage', (e) => {
      if(e.key !== this.LS_KEY || !e.newValue) return;
      try { this.receive(JSON.parse(e.newValue)); } catch(_){ /* sinal ilegível: ignora */ }
    });
  },

  /** Chamado pela camada de banco depois de cada gravação concluída. */
  committed(stores){
    const list = (stores || []).filter(s => s !== 'meta');     // `meta` é conveniência de interface de cada aba
    if(list.length) this.send('data', list);
  },
  /** Mudanças grandes, que pedem mais do que reler: backup restaurado, tudo apagado. */
  announce(kind){ this.send(kind, []); },

  send(kind, stores){
    const msg = { v:1, src:this.tabId, at:Date.now(), kind, stores };
    try {
      if(this.channel) this.channel.postMessage(msg);
      else localStorage.setItem(this.LS_KEY, JSON.stringify(msg));
    } catch(_){ /* sem canal: esta aba continua funcionando sozinha */ }
  },

  receive(msg){
    if(!msg || typeof msg !== 'object' || msg.v !== 1 || msg.src === this.tabId) return;
    if(typeof state === 'undefined' || !state.ready) return;
    if(msg.kind === 'backup-restored' || msg.kind === 'data-wiped') this.pendingKind = msg.kind;
    (Array.isArray(msg.stores) ? msg.stores : []).forEach(st => { if(typeof st === 'string') this.pendingStores.add(st); });
    this.pending = true;
    this.dismissed = false;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 200);       // várias gravações seguidas viram uma atualização só
  },

  /** Há um rascunho que não pode ser atropelado? */
  draftOpen(){
    const top = Overlay.top;
    // Busca de comandos e modo foco não têm rascunho: a tela atrás pode ser atualizada.
    if(top && top.root && (top.root.id === 'palette-root' || top.root.id === 'focus-root') && Overlay.stack.length === 1) return false;
    if(Overlay.isOpen) return true;
    const a = document.activeElement;
    return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable));
  },

  /** Mudança que não afeta nenhum formulário (tema, densidade, a semana nova criada sozinha): espera em silêncio. */
  quiet(){
    if(this.pendingKind !== 'data') return false;
    for(const st of this.pendingStores){ if(st !== 'settings' && st !== 'weeklyPlans') return false; }
    return true;
  },

  flush(){
    if(!this.pending || this.running) return;
    if(this.draftOpen()){
      if(!this.dismissed && !this.quiet()) this.showNotice();
      this.armWatch();
      return;
    }
    return this.apply();
  },

  /** Enquanto houver atualização esperando, confere de tempos em tempos se o rascunho já fechou. */
  armWatch(){
    if(this.watch) return;
    this.watch = setInterval(() => {
      if(!this.pending){ clearInterval(this.watch); this.watch = null; return; }
      if(!this.draftOpen()){ clearInterval(this.watch); this.watch = null; this.flush(); }
      else if(!this.dismissed && !this.quiet()) this.showNotice();   // o formulário pode ter trocado de camada
    }, 1500);
  },

  async apply(){
    if(this.running) return;
    this.running = true;
    this.pending = false;
    const kind = this.pendingKind;
    const settingsChanged = this.pendingStores.has('settings');
    this.pendingKind = 'data';
    this.pendingStores = new Set();
    this.hideNotice();
    const y = window.scrollY;
    try {
      if(kind !== 'data'){
        // os dados foram trocados por inteiro: lugares abertos, buscas e rascunhos apontavam para o que não existe mais
        ui.planDraft = null;
        ui.reviewQueue = null;
        Nav.resetForNewData();
      }
      await refresh();
      // tema, densidade e animações escolhidos na outra aba passam a valer aqui também
      if(kind !== 'data' || settingsChanged){ try { applySettingsEffects(); syncThemeControls(); } catch(err){ console.error(err); } }
      // o cronômetro vive no localStorage: confere se o que esta aba mostra ainda é o que está gravado
      const stored = TimerService.storedRunId();
      const mine = TimerService.isActive ? TimerService.data.runId : null;
      if(stored !== undefined && stored !== mine && TimerService.persisted){ TimerService.stopTicking(); TimerService.restore(); renderTimerBar(); }
      if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y);
      if(kind === 'backup-restored') toast('Um backup foi restaurado em outra aba. Esta aba já mostra os dados novos.', 'info', { title:'Dados atualizados' });
      else if(kind === 'data-wiped') toast('Os dados foram apagados em outra aba.', 'info', { title:'Dados atualizados' });
    } catch(err){
      console.error('Falha ao atualizar com os dados de outra aba:', err);
      this.pending = true;                                 // tenta de novo na próxima oportunidade
      this.armWatch();
    } finally {
      this.running = false;
      // um aviso que chegou DURANTE esta atualização não pode ficar esperando o próximo: atualiza de novo
      if(this.pending && !this.watch) setTimeout(() => this.flush(), 60);
    }
  },

  showNotice(){
    const top = Overlay.top;
    const inLayer = !!(top && top.panel);
    // Fora de uma janela, o aviso fica fixo no alto da tela, mas mora no começo do conteúdo:
    // assim o Tab chega nele logo, sem atravessar a página inteira.
    const host = inLayer ? top.panel : (document.getElementById('main') || document.body);
    if(this.notice && this.notice.parentNode === host) return;
    this.hideNotice();
    const n = h('div', { class:'sync-notice' + (inLayer ? ' in-layer' : ' is-page'), role:'status' },
      h('span', { class:'sync-text', text:'Os dados mudaram em outra aba.' }),
      h('span', { class:'sync-actions' },
        h('button', { class:'btn sm primary', type:'button', text:'Atualizar', title: inLayer ? 'Fecha esta janela sem salvar e mostra os dados atuais' : 'Mostra os dados atuais',
          onclick:() => this.updateNow() }),
        h('button', { class:'btn sm ghost', type:'button', text:'Continuar editando', onclick:() => { this.dismissed = true; this.hideNotice(); } })),
      inLayer ? h('span', { class:'sync-hint', text:'Atualizar fecha esta janela sem salvar.' }) : null);
    this.notice = n;
    host.insertBefore(n, host.firstChild);
  },
  hideNotice(){
    if(this.notice && this.notice.parentNode) this.notice.parentNode.removeChild(this.notice);
    this.notice = null;
  },

  /** "Atualizar": a pessoa escolheu ver os dados novos — as janelas abertas fecham sem salvar. */
  updateNow(){
    this.hideNotice();
    try {
      if(typeof modalCloser === 'function' && modalCloser){ const c = modalCloser; modalCloser = null; c(null); }
      if(Drawer.isOpen) Drawer.close();
      if(Palette.isOpen) Palette.close();
    } catch(err){ console.error(err); }
    if(document.activeElement && typeof document.activeElement.blur === 'function' && !Overlay.isOpen){
      const a = document.activeElement;
      if(a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT') a.blur();
    }
    return this.apply();
  }
};

/** Recarrega tudo do banco e redesenha a tela atual. */
async function refresh(){
  await loadAll();
  await PlannerEngine.ensureWeeklyPlan();
  render();
  // v6.2: dados mudaram (entidade excluída, disciplina movida de área…): a
  // entrada atual do histórico passa a descrever o lugar válido, sem criar outra.
  Nav.sync('replace');
}

/* =========================================================================
   FEEDBACK: toasts e modais próprios (substituem alert/confirm)
   ========================================================================= */
/* Toasts — hierarquia: ok (sucesso) · info · warn (atenção) · err (erro).
   Ícone + título opcional + texto + barra de acento. Nunca bloqueiam nada. */
const TOAST_MAX = 3;
const TOAST_KINDS = {
  ok:   { icon:'i-check', label:'Concluído' },
  info: { icon:'i-info',  label:'Aviso' },
  warn: { icon:'i-alert', label:'Atenção' },
  err:  { icon:'i-alert', label:'Erro' }
};

function dismissToast(el){
  if(!el || el.dataset.leaving === '1') return;
  el.dataset.leaving = '1';
  el.classList.add('is-leaving');
  // a duração acompanha o CSS; com animações reduzidas o CSS zera a transição
  setTimeout(() => el.remove(), prefersReducedMotion() ? 0 : 200);
}

function mountToast(el, duration){
  const box = $('#toasts');
  if(!box) return;
  box.appendChild(el);
  while(box.children.length > TOAST_MAX) box.removeChild(box.firstChild);
  let timer = setTimeout(() => dismissToast(el), duration);
  // passar o mouse segura o aviso na tela; sair reinicia uma contagem curta
  el.addEventListener('mouseenter', () => clearTimeout(timer));
  el.addEventListener('mouseleave', () => { clearTimeout(timer); timer = setTimeout(() => dismissToast(el), 1800); });
}

/**
 * toast(mensagem, tipo?, { title?, duration? })
 * tipo: 'ok' | 'info' | 'warn' | 'err' (sem tipo = 'info').
 */
function toast(message, kind, opts){
  const o = opts || {};
  const k = TOAST_KINDS[kind] ? kind : 'info';
  const el = h('div', { class:'toast ' + k },
    h('span', { class:'t-icon', 'aria-hidden':'true' }, icon(TOAST_KINDS[k].icon)),
    h('div', { class:'t-content' },
      o.title ? h('p', { class:'t-title', text:o.title }) : null,
      message ? h('p', { class:'t-text', text:message }) : null));
  if(k === 'err') el.setAttribute('role', 'alert');
  mountToast(el, o.duration || (k === 'err' || k === 'warn' ? 5200 : 3400));
}

/**
 * Impede que um botão de ação seja acionado duas vezes em sequência
 * (duplo clique, Enter repetido, toque duplo). O primeiro clique passa
 * normalmente; os seguintes são descartados na fase de captura, antes de
 * chegarem ao handler — sem `disabled`, que interromperia o clique em curso.
 */
const MODAL_ACTION_GUARD_MS = 900;
function guardModalActions(container){
  if(!container) return;
  $$('button', container).forEach(btn => {
    if(btn.dataset.guarded === '1') return;
    btn.dataset.guarded = '1';
    btn.addEventListener('click', (e) => {
      if(btn.dataset.busy === '1'){
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
      btn.dataset.busy = '1';
      btn.classList.add('is-busy');
      setTimeout(() => {
        btn.dataset.busy = '';
        if(document.contains(btn)) btn.classList.remove('is-busy');
      }, MODAL_ACTION_GUARD_MS);
    }, true);
  });
}

/* =========================================================================
   CAMADAS DE SOBREPOSIÇÃO (v5.2.1)

   Modal, painel lateral, busca de comandos e modo foco tinham quatro problemas
   confirmados em teste:

     · o painel lateral abria ATRÁS do modal (z-index 95 contra 100). O "?" de
       ajuda dentro de qualquer modal parecia um botão morto — mas o foco do
       teclado ia para o painel invisível;
     · um único Esc fechava o modal E o painel ao mesmo tempo;
     · o Tab escapava da camada e ia para a página atrás;
     · a página atrás rolava com a camada aberta, e o foco não voltava para o
       botão que abriu.

   Uma pilha única resolve os quatro: quem abre por último fica por cima (z-index
   calculado), só o topo recebe Esc, o Tab circula dentro da camada, a rolagem de
   fundo é travada enquanto houver camada e o foco volta ao ponto de partida.
   ========================================================================= */
const OVERLAY_BASE_Z = 100;
const OVERLAY_STEP_Z = 5;
/* v6.5 — candidatos a foco. O seletor é só a primeira peneira; quem decide é
   `Overlay.focusables`, que tira o que o teclado não alcança de verdade:
   desabilitado, tabindex negativo, escondido (`hidden`, display:none, dentro
   de um <details> fechado) ou dentro de algo inerte. Antes, um campo oculto
   podia ser tratado como "o último" e o Tab escapava da janela. */
const FOCUSABLE_SELECTOR =
  'a[href],button,input:not([type="hidden"]),select,textarea,summary,[tabindex],[contenteditable="true"]';
/* Regiões que continuam vivas com uma camada aberta: avisos, anúncios para
   leitor de tela, dica flutuante e o popover do glossário (aberto de dentro
   de uma janela, mas preso ao <body>). */
const OVERLAY_KEEP_ALIVE = ['toasts','sr-live','tooltip-root'];

const Overlay = {
  stack: [],
  /* v6.4 — algo aberto DENTRO de uma camada (um seletor no meio de um formulário)
     fecha primeiro: o Esc não pode derrubar a janela inteira com tudo preenchido. */
  escStack: [],
  pushEsc(fn, owner){
    const entry = { fn, owner: owner || null };
    this.escStack.push(entry);
    return () => { const i = this.escStack.indexOf(entry); if(i >= 0) this.escStack.splice(i, 1); };
  },

  _lockScroll(){
    if(this.stack.length !== 1) return;                 // só na primeira camada
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if(gap > 0) document.documentElement.style.setProperty('--overlay-gap', gap + 'px');
    document.documentElement.classList.add('overlay-open');
  },
  _unlockScroll(){
    if(this.stack.length) return;                       // ainda há camada aberta
    document.documentElement.classList.remove('overlay-open');
    document.documentElement.style.removeProperty('--overlay-gap');
  },
  _unlockTimer: null,

  focusables(panel){
    if(!panel) return [];
    return $$(FOCUSABLE_SELECTOR, panel).filter(el => {
      if(el.disabled || el.tabIndex < 0) return false;
      if(el.closest('[hidden],[inert]')) return false;
      // <summary>: só o primeiro de cada <details> é o controle de abrir/fechar
      if(el.tagName === 'SUMMARY' && el.parentNode && el.parentNode.querySelector(':scope > summary') !== el) return false;
      // dentro de um <details> fechado (só o <summary> dele continua alcançável). O navegador
      // esconde esse conteúdo sem tirar a caixa do elemento, então a medida de tamanho não basta.
      for(let d = el.parentElement && el.parentElement.closest('details:not([open])'); d; d = d.parentElement && d.parentElement.closest('details:not([open])')){
        if(!(el.tagName === 'SUMMARY' && el.parentNode === d)) return false;
      }
      // sem caixa na tela = não recebe foco (display:none)
      if(!el.getClientRects().length) return false;
      try { if(getComputedStyle(el).visibility === 'hidden') return false; } catch(_){}
      return true;
    });
  },

  /**
   * v6.5 — o que está ATRÁS da camada de cima fica inerte: não recebe foco, não
   * é lido por leitor de tela, não reage a clique. Antes, só o Tab era
   * interceptado; a navegação por leitor de tela (que não usa Tab) passeava
   * pela página por baixo da janela.
   * `inert` é o atributo nativo; onde ele não existe, `aria-hidden` cobre a
   * leitura e a armadilha de Tab continua cobrindo o foco.
   */
  _syncInert(){
    const top = this.top;
    const keep = top ? top.root : null;
    const native = 'inert' in HTMLElement.prototype;
    Array.from(document.body.children).forEach(el => {
      const tag = el.tagName;
      if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'svg' || tag === 'SVG') return;
      const alive = !keep || el === keep || OVERLAY_KEEP_ALIVE.includes(el.id) || el.classList.contains('gloss-pop');
      const marked = el.hasAttribute('data-ov-inert');
      if(!alive && !marked){
        el.setAttribute('data-ov-inert', el.getAttribute('aria-hidden') === 'true' ? 'was-hidden' : '');
        if(native) el.inert = true; else el.setAttribute('aria-hidden', 'true');
      } else if(alive && marked){
        const was = el.getAttribute('data-ov-inert');
        el.removeAttribute('data-ov-inert');
        if(native) el.inert = false; else if(was !== 'was-hidden') el.removeAttribute('aria-hidden');
      }
    });
  },

  /**
   * Registra uma camada.
   *   root  — elemento de fundo (recebe o z-index calculado)
   *   panel — caixa onde o foco fica preso
   *   onEsc — o que fazer quando o Esc chega NESTA camada
   */
  open(root, panel, onEsc, opts){
    const o = opts || {};
    const entry = {
      root, panel, onEsc,
      opener: (o.opener !== undefined) ? o.opener : document.activeElement,
      trap: o.trap !== false
    };
    this.stack.push(entry);
    if(root) root.style.zIndex = String(OVERLAY_BASE_Z + (this.stack.length - 1) * OVERLAY_STEP_Z);
    this._lockScroll();
    this._syncInert();
    return entry;
  },

  /**
   * v6.6 — `opts.unlockAfter`: enquanto a camada desenha a saída, a rolagem da
   * página continua travada; liberar antes fazia a barra de rolagem voltar e o
   * conteúdo de trás "pular" por baixo da janela que ainda some.
   * O z-index também fica até o fim da saída (a camada não afunda atrás da página).
   */
  close(entry, opts){
    const o = opts || {};
    const i = entry ? this.stack.indexOf(entry) : -1;
    if(i < 0) return;
    this.stack.splice(i, 1);
    const later = o.unlockAfter && !prefersReducedMotion() ? o.unlockAfter : 0;
    if(entry.root){
      const root = entry.root;
      if(later) setTimeout(() => { if(!this.stack.some(x => x.root === root)) root.style.zIndex = ''; }, later);
      else root.style.zIndex = '';
    }
    clearTimeout(this._unlockTimer);
    if(later) this._unlockTimer = setTimeout(() => this._unlockScroll(), later);
    else this._unlockScroll();
    this._syncInert();                                  // antes de devolver o foco: o destino não pode estar inerte
    const back = entry.opener;
    if(back && typeof back.focus === 'function' && document.contains(back)){
      try { back.focus({ preventScroll:true }); } catch(_){ try { back.focus(); } catch(__){} }
    }
    // v6.5: a última janela fechou — se os dados mudaram em outra aba enquanto ela estava aberta, a tela se atualiza agora
    if(!this.stack.length && typeof DataSync !== 'undefined' && DataSync.pending) setTimeout(() => DataSync.flush(), 80);
  },

  get top(){ return this.stack.length ? this.stack[this.stack.length - 1] : null; },
  get isOpen(){ return this.stack.length > 0; },

  /** Um único ouvinte, em captura: roda antes dos atalhos globais. */
  bind(){
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && this.escStack.length){
        // descarta donos que já saíram da tela (a janela foi fechada por outro caminho)
        this.escStack = this.escStack.filter(x => !x.owner || x.owner.isConnected);
        const inner = this.escStack[this.escStack.length - 1];
        if(inner){
          e.preventDefault();
          e.stopImmediatePropagation();
          inner.fn();
          return;
        }
      }
      const top = this.top;
      if(!top) return;

      if(e.key === 'Escape'){
        e.preventDefault();
        e.stopImmediatePropagation();         // nenhuma camada de baixo reage
        if(typeof top.onEsc === 'function') top.onEsc();
        return;
      }

      if(e.key !== 'Tab' || !top.trap) return;
      const list = this.focusables(top.panel);
      if(!list.length){ e.preventDefault(); return; }
      const first = list[0], last = list[list.length - 1];
      const active = document.activeElement;
      if(!top.panel || !top.panel.contains(active)){
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if(e.shiftKey && active === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && active === last){ e.preventDefault(); first.focus(); }
    }, true);
  }
};

let modalCloser = null;
/**
 * Abre um modal. `build(close)` devolve { title, content, actions, focus? }.
 * Fecha com ESC, clique fora ou chamando close().
 */
function openModal(build, opts){
  const root = $('#modal-root'), box = $('#modal-box');
  const options = opts || {};
  // v6.6: havia uma janela na tela (aberta ou saindo)? Então é uma TROCA de conteúdo, não uma entrada nova.
  const wasVisible = !root.hidden;

  // Só existe um #modal-root. Abrir um modal por cima de outro deixava os
  // ouvintes do primeiro pendurados no documento — e um Esc fechava os dois.
  if(typeof modalCloser === 'function'){
    const previous = modalCloser;
    modalCloser = null;
    try { previous(null); } catch(err){ console.error(err); }
  }

  const opener = document.activeElement;
  let layer = null, closed = false;
  /* v6.3 — subtelas: uma segunda tela DENTRO do mesmo modal (ex.: criar um
     tópico no meio do registro de um estudo). Os nós da tela de baixo são
     guardados intactos — valores digitados, seleção e rolagem voltam
     exatamente como estavam — e nunca existe modal sobre modal. */
  const views = [];
  const titleEl = $('#modal-title'), contentEl = $('#modal-content'), actionsEl = $('#modal-actions');

  /* v6.6 — o que foi mexido na janela (digitado, escolhido) fica marcado: com
     algo preenchido, clicar fora NUNCA fecha — em qualquer formulário, não só no
     de registro. Esc e "Cancelar" continuam fechando. */
  let touched = false;
  const touchCtl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const touchOpts = touchCtl ? { signal: touchCtl.signal } : undefined;
  const markTouched = (e) => { if(e.isTrusted) touched = true; };
  if(touchOpts){
    box.addEventListener('input', markTouched, touchOpts);
    box.addEventListener('change', markTouched, touchOpts);
    box.addEventListener('click', (e) => {
      if(!e.isTrusted || !e.target || !e.target.closest) return;
      const t = e.target.closest('[aria-pressed],[aria-checked],[role="radio"],[role="option"]');
      // trocar de modo ("Estudar agora" × "Já estudei") é navegação dentro da janela, não um dado
      if(t && contentEl.contains(t) && !t.closest('.mode-switch')) touched = true;
    }, touchOpts);
  }
  let nudgedOnce = false;

  const close = (result) => {
    if(closed) return;                      // fechar duas vezes não desfaz o foco
    closed = true;
    views.length = 0;
    if(touchCtl) touchCtl.abort();
    // v6.6: a lógica fecha agora; o desenho sai em seguida (e some de vez no fim da saída)
    LayerFx.leave(root, MOTION.layerOut, () => { clear(contentEl); clear(actionsEl); });
    root.removeEventListener('mousedown', onBackdrop);
    Overlay.close(layer, { unlockAfter: MOTION.layerOut });
    if(modalCloser === close) modalCloser = null;
    if(options.onClose) options.onClose(result);
  };
  // Com uma subtela aberta, clicar fora não fecha nada: perderia o que foi digitado nas duas telas.
  // v6.4.1 — `keepOnBackdrop()` deixa um formulário já preenchido ignorar o clique fora (um
  // esbarrão no fundo não joga fora o que foi digitado). Esc e "Cancelar" continuam fechando.
  const onBackdrop = (e) => {
    if(e.target !== root) return;
    const keep = views.length || options.dismissible === false || touched ||
      (typeof options.keepOnBackdrop === 'function' && options.keepOnBackdrop());
    if(keep){
      // a janela fica: um pulso curto mostra isso e, na primeira vez, o caminho para sair
      nudgeLayer(box);
      if(!nudgedOnce && options.dismissible !== false){
        nudgedOnce = true;
        toast('Use "Cancelar" ou Esc para fechar sem salvar.', 'info', { title:'O que você preencheu continua aqui', duration:3800 });
      }
      return;
    }
    close(null);
  };

  /** Abre uma subtela: { title, content, actions, onEsc, focus }. */
  close.push = (sub) => {
    if(closed || !sub) return;
    views.push({
      title: titleEl.textContent,
      content: Array.from(contentEl.childNodes),
      actions: Array.from(actionsEl.childNodes),
      scroll: box.scrollTop,
      focus: document.activeElement,
      onEsc: sub.onEsc || null
    });
    titleEl.textContent = sub.title || '';
    mount(contentEl, sub.content || null);
    mount(actionsEl, ...(sub.actions || []));
    guardModalActions(actionsEl);
    box.classList.add('is-sub');            // v6.4.1: uma subtela é um formulário simples — a janela larga se estreita
    box.scrollTop = 0;
    const target = sub.focus || box.querySelector('#modal-content input,#modal-content select,#modal-content textarea,#modal-content button');
    if(target) setTimeout(() => { if(!closed && document.contains(target)) target.focus(); }, 30);
  };
  /** Volta para a tela de baixo, exatamente como estava. `focusEl` escolhe onde o foco cai. */
  close.pop = (focusEl) => {
    if(closed || !views.length) return;
    const v = views.pop();
    titleEl.textContent = v.title;
    mount(contentEl, v.content);
    mount(actionsEl, v.actions);
    box.classList.toggle('is-sub', views.length > 0);
    box.scrollTop = v.scroll;
    const target = (focusEl && document.contains(focusEl)) ? focusEl : v.focus;
    if(target && document.contains(target) && typeof target.focus === 'function'){
      try { target.focus({ preventScroll:true }); } catch(_){ target.focus(); }
    }
  };
  close.depth = () => views.length;
  close.isClosed = () => closed;

  const cfg = build(close) || {};
  box.className = 'modal' + (options.size ? ' ' + options.size : '');
  $('#modal-title').textContent = cfg.title || '';
  // Sem título visível (boas-vindas), aria-labelledby apontaria para um elemento
  // vazio e o diálogo ficaria sem nome para leitores de tela.
  if(cfg.title) box.removeAttribute('aria-label');
  else box.setAttribute('aria-label', options.ariaLabel || 'Janela do Ciclo');

  LayerFx.cancel(root);                     // uma saída em andamento é interrompida: esta janela assume
  mount($('#modal-content'), cfg.content || null);
  mount($('#modal-actions'), ...(cfg.actions || []));
  guardModalActions($('#modal-actions'));
  root.hidden = false;
  box.scrollTop = 0;
  if(wasVisible) swapIn(box);               // troca de janela: o conteúdo muda no lugar, o fundo não pisca
  root.addEventListener('mousedown', onBackdrop);
  modalCloser = close;
  layer = Overlay.open(root, box, () => {
    // Esc numa subtela volta para a tela de baixo; só na tela principal ele fecha o modal.
    if(views.length){
      const top = views[views.length - 1];
      if(typeof top.onEsc === 'function') top.onEsc(); else close.pop();
      return;
    }
    if(options.dismissible !== false) close(null);
  }, { opener });

  const focusTarget = (cfg.focus && box.contains(cfg.focus)) ? cfg.focus : box.querySelector('input,select,textarea,button');
  if(focusTarget) setTimeout(() => { if(!closed) focusTarget.focus(); }, 30);
  return close;
}

function confirmModal(message, opts){
  const o = opts || {};
  return new Promise(resolve => {
    openModal(close => ({
      title: o.title || 'Confirmar',
      content: h('p', { class:'modal-sub', text:message, style:'margin-bottom:0' }),
      actions: [
        h('button', { class:'btn ghost', type:'button', text:o.cancelLabel || 'Cancelar', onclick:() => { close(); resolve(false); } }),
        h('button', { class:'btn ' + (o.danger === false ? 'primary' : 'danger'), type:'button', text:o.confirmLabel || 'Confirmar',
                      onclick:() => { close(); resolve(true); } })
      ]
    }), { size:'narrow', onClose:(r) => { if(r === null) resolve(false); } });
  });
}

/* =========================================================================
   RENDERING — componentes compartilhados
   ========================================================================= */
const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

/** Resolve a preferência ('system' consulta o sistema operacional). */
function resolveTheme(pref){
  if(pref === 'system') return (systemThemeQuery && systemThemeQuery.matches) ? 'light' : 'dark';
  return pref === 'light' ? 'light' : 'dark';
}

/** Aplica o tema RESOLVIDO no documento. Não decide nada: só pinta. */
function applyTheme(preference){
  const t = resolveTheme(preference);
  const docEl = document.documentElement;
  /* v6.6 — sem isto, cada botão, linha e borda trocava de cor no próprio ritmo
     (as transições de hover), e a tela "ondulava" por um instante. */
  if(docEl.getAttribute('data-theme') !== t){
    docEl.classList.add('theme-switching');
    docEl.setAttribute('data-theme', t);
    void docEl.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => docEl.classList.remove('theme-switching')));
  }
  try { localStorage.setItem(THEME_LS_KEY, t); } catch(_){}   // evita piscar no próximo load
  const id = t === 'dark' ? '#i-sun' : '#i-moon';
  ['#theme-icon','#theme-icon-m'].forEach(sel => { const el = $(sel); if(el) el.setAttribute('href', id); });
}

/**
 * FONTE ÚNICA DE VERDADE do tema. Todo ponto da aplicação passa por aqui.
 * Preferência ('dark' | 'light' | 'system') e tema resolvido ('dark' | 'light')
 * são coisas distintas: a preferência é o que o usuário escolheu; o resolvido
 * é o que aparece na tela.
 */
function setThemePreference(preference){
  const pref = ['dark','light','system'].includes(preference) ? preference : 'dark';
  state.settings.theme = pref;      // 1. estado muda na hora
  applyTheme(pref);                 // 2. visual muda na hora
  syncThemeControls();              // 3. controles refletem na hora
  return saveSettings();            // 4. persistência serializada, last-write-wins
}

/** Mantém o segmented de Configurações coerente com a preferência atual. */
function syncThemeControls(){
  const group = $('#theme-segmented');
  if(!group) return;
  $$('button', group).forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.value === state.settings.theme ? 'true' : 'false');
  });
}

function applyDensity(density){
  document.documentElement.setAttribute('data-density', density === 'compact' ? 'compact' : 'comfortable');
}

/** Alterna manualmente entre claro e escuro (sai de 'system'). */
/** Botão de alternar da barra lateral/mobile: sai de 'system' para uma escolha explícita. */
function toggleTheme(){
  return setThemePreference(resolveTheme(state.settings.theme) === 'dark' ? 'light' : 'dark');
}
function applyReduceMotion(on){ document.documentElement.classList.toggle('reduce-motion', !!on); }

/** Movimento reduzido: configuração interna OU preferência do sistema. */
function prefersReducedMotion(){
  if(state.settings && state.settings.reduceMotion) return true;
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/* =========================================================================
   v6.6 — MOVIMENTO, CAMADAS E SELEÇÃO (Visual & Interaction Revival)

   Uma linguagem de movimento só. Os números espelham os tokens de
   styles.css (01 · TOKENS, "movimento"); se um mudar, o outro muda junto.

   Regras que valem para tudo aqui:
     · é apresentação: nenhuma regra de dados depende de uma animação, e a
       lógica de abrir/fechar continua síncrona (pilha de camadas, foco,
       inércia, `isOpen`). Só o DESENHO sai devagar;
     · interromper é sempre seguro: reabrir durante uma saída cancela a
       saída; nada fica preso entre "aberto" e "fechado";
     · com "Reduzir animações" (ou a preferência do sistema) o estado final
       aparece na hora;
     · transform e opacity sempre que possível; altura só em UM bloco por vez
       (nunca em listas inteiras).
   ========================================================================= */
const MOTION = {
  press: 110, select: 180, popIn: 170, popOut: 120, layerIn: 230, layerOut: 160, nav: 220,
  ease: 'cubic-bezier(.2,.8,.2,1)', easeEmph: 'cubic-bezier(.16,1,.3,1)', easeExit: 'cubic-bezier(.4,0,.8,.2)'
};

/** Abrir/recolher um bloco (acordeão, resposta, detalhe opcional) pela altura. */
const Motion = {
  _run(el, frames, opts, onDone){
    this._stop(el);
    const rec = { overflow: el.style.overflow, anim: null };
    el.style.overflow = 'hidden';
    const a = el.animate(frames, opts);
    rec.anim = a;
    el._mo = rec;
    a.onfinish = () => {
      if(el._mo !== rec) return;
      el._mo = null;
      el.style.overflow = rec.overflow;
      if(onDone) onDone();
      try { a.cancel(); } catch(_){}
    };
  },
  _stop(el){
    const rec = el && el._mo;
    if(!rec) return;
    el._mo = null;
    el.style.overflow = rec.overflow;
    try { rec.anim.cancel(); } catch(_){}
  },
  /** Mostra um bloco escondido crescendo a partir de 0. */
  expand(el){
    if(!el) return;
    this._stop(el);
    el.hidden = false;
    if(prefersReducedMotion() || typeof el.animate !== 'function') return;
    const hgt = el.scrollHeight;
    if(!hgt) return;
    this._run(el, [{ height:'0px', opacity:0 }, { height:hgt + 'px', opacity:1 }],
      { duration: Math.round(Math.min(260, 150 + hgt / 8)), easing: MOTION.ease });
  },
  /** Recolhe e, no fim, esconde. `after` roda uma vez (também sem animação). */
  collapse(el, after){
    if(!el) return;
    this._stop(el);
    const finish = () => { el.hidden = true; if(after) after(); };
    if(el.hidden || prefersReducedMotion() || typeof el.animate !== 'function'){ finish(); return; }
    const hgt = el.offsetHeight;
    if(!hgt){ finish(); return; }
    this._run(el, [{ height:hgt + 'px', opacity:1 }, { height:'0px', opacity:0 }],
      { duration: Math.round(Math.min(200, 120 + hgt / 10)), easing: MOTION.easeExit, fill:'forwards' }, finish);
  }
};

/**
 * Saída das camadas (janela, painel, busca, modo foco, popover do glossário).
 * Quem fecha continua decidindo tudo na hora; aqui só o elemento fica visível
 * por alguns milissegundos com [data-leaving] (o CSS desenha a saída e tira
 * os cliques) e depois recebe `hidden`. Reabrir antes disso chama `cancel`.
 */
const LayerFx = {
  leave(root, ms, after){
    if(!root) return;
    this.cancel(root);
    if(!ms || prefersReducedMotion()){ root.hidden = true; if(after) after(); return; }
    const token = { timer:null };
    root._leave = token;
    root.setAttribute('data-leaving', '');
    token.timer = setTimeout(() => {
      if(root._leave !== token) return;
      root._leave = null;
      root.removeAttribute('data-leaving');
      root.hidden = true;
      if(after) after();
    }, ms);
  },
  cancel(root){
    if(!root) return;
    if(root._leave){ clearTimeout(root._leave.timer); root._leave = null; }
    root.removeAttribute('data-leaving');
  },
  isLeaving(root){ return !!(root && root._leave); }
};

/* ---------- menus pequenos: um comportamento só ----------
   "Ordenar por", "Mais", "Adicionar", "Exportar". Abre ancorado ao botão e
   dentro da tela (vira para cima perto do rodapé, encosta para dentro perto
   das bordas); em tela estreita vira uma folha na parte de baixo, com fundo
   escurecido. Clique dentro não fecha; clique fora fecha; Esc fecha e devolve
   o foco ao botão; abrir outro menu fecha este. */
const MENU_SHEET_QUERY = '(max-width: 600px)';
let openMenuApi = null;
function isSheetViewport(){ return !!(window.matchMedia && window.matchMedia(MENU_SHEET_QUERY).matches); }

function placeMenu(menu, anchor){
  menu.classList.remove('is-up');
  menu.style.removeProperty('--menu-dx');
  menu.style.maxHeight = '';
  if(isSheetViewport()) return;                       // a folha é posicionada pelo CSS
  // mede sem a animação de entrada (ela encolhe a caixa nos primeiros quadros)
  menu.style.animation = 'none';
  const r = menu.getBoundingClientRect(), a = anchor.getBoundingClientRect();
  menu.style.animation = '';
  const pad = 8;
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const below = vh - a.bottom - pad - 6, above = a.top - pad - 6;
  const up = r.height > below && above > below;
  if(up) menu.classList.add('is-up');
  let dx = 0;
  if(r.left < pad) dx = pad - r.left;
  else if(r.right > vw - pad) dx = (vw - pad) - r.right;
  if(dx) menu.style.setProperty('--menu-dx', Math.round(dx) + 'px');
  const room = Math.floor(up ? above : below);
  if(r.height > room) menu.style.maxHeight = Math.max(160, room) + 'px';
}

/** Liga abrir/fechar de um menu. `menu` começa com [hidden]. */
function menuPopover(wrap, btn, menu, hooks){
  const hk = hooks || {};
  let open = false, timer = null, removeEsc = null;
  const onDoc = (e) => {
    if(!wrap.isConnected){ api.close(false); return; }
    // o fundo escurecido da folha (celular) é um pseudo-elemento do próprio wrap
    if(e.target === wrap || !wrap.contains(e.target)) api.close(false);
  };
  const onResize = () => { if(open) placeMenu(menu, btn); };
  const api = {
    get isOpen(){ return open; },
    open(){
      if(open) return;
      if(openMenuApi && openMenuApi !== api) openMenuApi.close(false);
      openMenuApi = api;
      Tooltip.hide();
      open = true;
      clearTimeout(timer); timer = null;
      menu.classList.remove('is-leaving');
      wrap.classList.remove('is-closing');
      menu.hidden = false;
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      placeMenu(menu, btn);
      document.addEventListener('mousedown', onDoc, true);
      window.addEventListener('resize', onResize, { passive:true });
      removeEsc = Overlay.pushEsc(() => api.close(true), wrap);
      if(hk.onOpen) hk.onOpen();
    },
    close(refocus){
      if(!open) return;
      open = false;
      if(openMenuApi === api) openMenuApi = null;
      btn.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
      document.removeEventListener('mousedown', onDoc, true);
      window.removeEventListener('resize', onResize);
      if(removeEsc){ removeEsc(); removeEsc = null; }
      if(refocus && btn.isConnected){ try { btn.focus({ preventScroll:true }); } catch(_){ btn.focus(); } }
      if(!wrap.isConnected || prefersReducedMotion()){ menu.hidden = true; return; }
      menu.classList.add('is-leaving');
      wrap.classList.add('is-closing');
      timer = setTimeout(() => {
        timer = null;
        if(open) return;
        menu.hidden = true;
        menu.classList.remove('is-leaving');
        wrap.classList.remove('is-closing');
      }, MOTION.popOut);
    }
  };
  return api;
}

/* ---------- indicador de seleção que desliza ----------
   Em grupos de UMA linha (controle segmentado, abas, navegação, período,
   modo de registro, prioridade), a marca do item escolhido é um elemento só
   que se desloca até a nova posição — a escolha parece intencional, não uma
   troca de cor. O próprio item continua dizendo o estado (aria + estilo),
   então leitores de tela, alto contraste e "Reduzir animações" não dependem
   do indicador. Listas redesenhadas pela tela (Análises, Configurações, abas)
   deslizam a partir de onde a marca estava: a posição anterior fica guardada
   por alguns instantes. Grades de cartões NÃO usam indicador (um quadro
   atravessando a grade distrai): lá a marca do item assenta com um pulso curto. */
const SLIDE_GROUPS = [
  { sel:'#nav-desktop',                   item:'.nav-item',        on:'[aria-current="page"]', kind:'nav' },
  { sel:'#nav-mobile',                    item:'.mb-item',         on:'[aria-current="page"]', kind:'pill', target:'.nav-icon' },
  { sel:'.segmented',                     item:'button',           on:'[aria-pressed="true"]', kind:'thumb' },
  { sel:'.help-switch',                   item:'.help-switch-btn', on:'[aria-selected="true"]', kind:'thumb' },
  { sel:'.tabs[role="tablist"]',          item:'.tab',             on:'[aria-selected="true"]', kind:'line' },
  { sel:'.set-nav',                       item:'.set-tab',         on:'[aria-selected="true"]', kind:'nav' },
  { sel:'.an-chips[role="radiogroup"]',   item:'.an-chip',         on:'[aria-checked="true"]', kind:'choice' },
  { sel:'.mode-switch',                   item:'.mode-opt',        on:'[aria-checked="true"]', kind:'choice' },
  { sel:'.prio-options',                  item:'.prio-opt',        on:'[aria-checked="true"]', kind:'choice' }
];
const SLIDE_SEL = SLIDE_GROUPS.map(g => g.sel).join(',');
const SLIDE_MEMORY_MS = 1500;

const Slider = {
  ok: false,
  mem: new Map(),
  init(){
    if(this.ok) return;
    if(typeof MutationObserver === 'undefined') return;
    // alto contraste: o sistema redesenha as cores — o item marca a si mesmo, sem indicador
    if(window.matchMedia && window.matchMedia('(forced-colors: active)').matches) return;
    this.ok = true;
    this.scan(document.body);
    new MutationObserver(recs => {
      for(const r of recs) for(const n of r.addedNodes) if(n.nodeType === 1 && !n.classList.contains('sel-ind')) this.scan(n);
    }).observe(document.body, { childList:true, subtree:true });
  },
  scan(root){
    if(root.matches && root.matches(SLIDE_SEL)) this.attach(root);
    if(root.querySelectorAll && root.firstElementChild) root.querySelectorAll(SLIDE_SEL).forEach(g => this.attach(g));
  },
  attach(group){
    if(group._slide) return;
    const cfg = SLIDE_GROUPS.find(c => group.matches(c.sel));
    if(!cfg) return;
    const ind = h('span', { class:'sel-ind sel-ind-' + cfg.kind, 'aria-hidden':'true' });
    const st = { cfg, ind, rect:null, sized:false,
      key: cfg.sel + '|' + (group.id || group.getAttribute('aria-labelledby') || group.getAttribute('aria-label') || '') };
    group._slide = st;
    group.classList.add('has-slider');
    group.append(ind);
    const attr = (cfg.on.match(/\[([a-z-]+)/) || [])[1];
    if(attr) new MutationObserver(() => this.place(group, true)).observe(group, { attributes:true, subtree:true, attributeFilter:[attr] });
    if(typeof ResizeObserver !== 'undefined'){
      new ResizeObserver(() => {
        if(!st.sized){ st.sized = true; return; }       // a primeira notificação é só o tamanho inicial
        this.place(group, false);
      }).observe(group);
    }
    const prev = this.mem.get(st.key);
    if(prev && Date.now() - prev.t < SLIDE_MEMORY_MS && !prefersReducedMotion()){
      this.apply(st, prev, false);
      requestAnimationFrame(() => this.place(group, true));
    } else {
      this.place(group, false);
    }
  },
  /** Posição do item escolhido em relação ao grupo (layout, sem efeito de transform). */
  measure(group, st){
    const item = group.querySelector(':scope > ' + st.cfg.item + st.cfg.on) || group.querySelector(st.cfg.item + st.cfg.on);
    if(!item) return null;
    const el = st.cfg.target ? item.querySelector(st.cfg.target) : item;
    if(!el) return null;
    if(!st.cfg.target){
      let x = 0, y = 0, n = el;
      while(n && n !== group){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      if(n === group){
        if(!el.offsetWidth) return null;
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      }
    }
    const g = group.getBoundingClientRect(), r = el.getBoundingClientRect();
    if(!r.width) return null;
    return { x: r.left - g.left - group.clientLeft + group.scrollLeft, y: r.top - g.top - group.clientTop + group.scrollTop, w: r.width, h: r.height };
  },
  place(group, animate){
    const st = group._slide;
    if(!st || !group.isConnected) return;
    const r = this.measure(group, st);
    if(!r){ st.ind.classList.add('is-off'); st.rect = null; return; }
    this.apply(st, r, animate && !!st.rect);
  },
  apply(st, r, animate){
    const ind = st.ind;
    const same = st.rect && st.rect.x === r.x && st.rect.y === r.y && st.rect.w === r.w && st.rect.h === r.h;
    st.rect = { x:r.x, y:r.y, w:r.w, h:r.h };
    this.mem.set(st.key, { x:r.x, y:r.y, w:r.w, h:r.h, t:Date.now() });
    if(same && !ind.classList.contains('is-off')) return;
    if(!animate) ind.classList.add('no-anim');
    ind.classList.remove('is-off');
    ind.style.width = Math.round(r.w) + 'px';
    ind.style.height = Math.round(r.h) + 'px';
    ind.style.transform = `translate(${Math.round(r.x)}px, ${Math.round(r.y)}px)`;
    if(!animate){ void ind.offsetWidth; ind.classList.remove('no-anim'); }
  }
};

/* ---------- a marca da escolha "assenta" ----------
   Em grades de opções (o que analisar, o que ver, tipo de estudo, ordenar
   por…), a marca do item recém-escolhido faz um pulso curto. Só depois de um
   clique de verdade — desenhar a tela nunca anima marcas sozinho. */
const PickFx = {
  SEL: '[role="radio"],[role="menuitemradio"],[aria-pressed],[role="option"],[role="tab"]',
  init(){
    document.addEventListener('click', (e) => {
      if(!e.isTrusted || prefersReducedMotion()) return;
      const el = e.target && e.target.closest ? e.target.closest(this.SEL) : null;
      if(!el) return;
      const key = el.dataset.k ? `[data-k="${cssEsc(el.dataset.k)}"]` : (el.id ? '#' + cssEsc(el.id) : null);
      setTimeout(() => {
        const t = el.isConnected ? el : (key ? document.querySelector(key) : null);
        if(!t || !this.isOn(t)) return;
        t.classList.remove('is-picked');
        void t.offsetWidth;
        t.classList.add('is-picked');
        clearTimeout(t._pickT);
        t._pickT = setTimeout(() => t.classList.remove('is-picked'), 420);
      }, 0);
    }, true);
  },
  isOn(t){ return ['aria-checked','aria-pressed','aria-selected'].some(a => t.getAttribute(a) === 'true'); }
};
function cssEsc(v){ return (window.CSS && CSS.escape) ? CSS.escape(String(v)) : String(v).replace(/["\\#.:\[\]]/g, '\\$&'); }

/** Janela que não fecha com clique fora: um pulso curto diz "estou aqui". */
function nudgeLayer(box){
  if(!box || prefersReducedMotion() || typeof box.animate !== 'function') return;
  try {
    box.animate([{ transform:'scale(1)' }, { transform:'scale(1.012)' }, { transform:'scale(1)' }],
      { duration:240, easing:MOTION.ease });
  } catch(_){}
}

function card(title, ...children){
  const parts = [];
  if(title) parts.push(h('p', { class:'card-title', text:title }));
  return h('div', { class:'card' }, parts, children);
}
function cardWithAction(title, actionEl, ...children){
  return h('div', { class:'card' },
    h('div', { class:'card-head' }, h('p', { class:'card-title', text:title, style:'margin:0' }), actionEl),
    children);
}
/* v5.1 — memória visual: barras e métricas animam apenas quando o valor
   realmente muda entre duas renderizações (nunca "do zero" a cada tela). */
const UiMemory = { bars:new Map(), stats:new Map() };

function statBox(value, label, delta, key){
  const val = String(value);
  const prev = key ? UiMemory.stats.get(key) : undefined;
  if(key) UiMemory.stats.set(key, val);
  const changed = prev !== undefined && prev !== val && !prefersReducedMotion();
  return h('div', { class:'stat' },
    h('span', { class:'v' + (/\d/.test(val) ? '' : ' is-text') + (changed ? ' is-updated' : ''), text:val }),
    h('span', { class:'l', text:label }),
    delta ? h('span', { class:'d ' + (delta.dir || ''), text:delta.text }) : null);
}

/** Cria o preenchimento de uma barra; com `key`, anima do valor anterior ao novo. */
function barFill(pct, cls, key){
  const target = Math.round(clamp(pct || 0, 0, 100) * 10) / 10;
  const prev = key ? UiMemory.bars.get(key) : undefined;
  if(key) UiMemory.bars.set(key, target);
  const animate = prev !== undefined && prev !== target && !prefersReducedMotion();
  const fill = h('div', { class:'bar-fill' + (cls ? ' ' + cls : ''), style:`width:${animate ? prev : target}%` });
  if(animate) requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = target + '%'; }));
  return fill;
}
function progressBar(pct, cls, key){
  return h('div', { class:'bar' }, barFill(pct, cls, key));
}
/** Primeira letra maiúscula (motivos são gerados em minúsculas pelo motor). */
function capFirst(t){ const x = str(t); return x ? x.charAt(0).toUpperCase() + x.slice(1) : x; }
function emptyState(title, text, actionEl){
  return h('div', { class:'empty' }, h('strong', { text:title }), h('span', { text:text }), actionEl ? h('div', { style:'margin-top:10px' }, actionEl) : null);
}
function selectField(id, label, options, value, onchange){
  const sel = h('select', { id, onchange });
  options.forEach(o => sel.appendChild(h('option', { value:o.value, selected:String(o.value) === String(value) }, o.label)));
  return h('div', { class:'field' }, label ? h('label', { for:id, text:label }) : null, sel);
}
function disciplineOptions(includeEmpty, includeArchived){
  const opts = includeEmpty ? [{ value:'', label:'— Selecione —' }] : [];
  const list = (includeArchived ? state.disciplines : activeDisciplines()).slice().sort(sortByName);
  list.forEach(d => opts.push({ value:d.id, label: d.name + (d.archived ? ' (arquivada)' : '') + ' · ' + areaNameOf(d) }));
  return opts;
}
function pillGroup(items, value, onPick, nameAttr){
  const wrap = h('div', { class:'chips', role:'group', 'aria-label':nameAttr || '' });
  items.forEach(it => {
    const b = h('button', { type:'button', class:'chip', 'aria-pressed': String(it.value) === String(value) ? 'true' : 'false',
      style: it.color ? `--chip-color:${it.color}` : null, text:it.label });
    b.addEventListener('click', () => {
      const next = (b.getAttribute('aria-pressed') === 'true' && it.allowToggle !== false) ? null : it.value;
      $$('.chip', wrap).forEach(x => x.setAttribute('aria-pressed','false'));
      if(next !== null) b.setAttribute('aria-pressed','true');
      onPick(next);
    });
    wrap.appendChild(b);
  });
  return wrap;
}
function statusMark(status){
  const map = { nao_iniciado:'', em_estudo:'studying', em_revisao:'reviewing', dominado:'mastered' };
  const el = h('span', { class:'status-mark ' + (map[status] || ''), 'aria-hidden':'true' });
  if(status === 'dominado') el.textContent = '✓';
  return el;
}

/* ---------- NAVEGAÇÃO ---------- */
/**
 * Troca a tela principal. v6.2: cada troca vira uma entrada no histórico do
 * navegador (Nav.sync), para o Voltar do navegador percorrer o caminho feito
 * dentro do Ciclo antes de sair dele.
 *   opts.noSync   — quem chama cuida do histórico (navDisc, popstate, início)
 *   opts.noScroll — quem chama cuida da rolagem (restauração de posição)
 */
function setView(view, opts){
  const o = (opts && typeof opts === 'object' && !(opts instanceof Event)) ? opts : {};
  if(!VIEW_TITLES[view]) view = 'today';
  if(view === 'analytics' && ui.view !== 'analytics') onEnterAnalytics();
  if(view === 'plan' && ui.view !== 'plan'){ ui.planEditing = false; }
  if(ui.view !== view) ui.prevView = ui.view;
  ui.view = view;
  $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
  $$('#nav-desktop .nav-item').forEach(b => {
    if(b.dataset.view === view) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  // v5.2.1 — telas acessadas pelo botão "Mais" (Disciplinas, Histórico, Ajuda,
  // Dados, Configurações) não marcavam nenhum item: o usuário perdia a referência
  // de onde estava. Agora o próprio "Mais" fica marcado nesses casos.
  const inMore = ['disciplines','history','help','data','settings'].includes(view);
  $$('#nav-mobile .mb-item').forEach(b => {
    const on = b.dataset.view ? (b.dataset.view === view) : inMore;
    if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  const mt = $('#mobile-title'); if(mt) mt.textContent = VIEW_TITLES[view];
  Tooltip.hide();
  GlossaryPopover.close();       // nenhuma explicação flutuando sobre outra tela
  // v6.2: a tela nova começa no topo na hora — rolar "suave" por um conteúdo
  // que acabou de ser trocado só atrasava a leitura.
  if(!o.noScroll) window.scrollTo({ top:0, behavior:'auto' });
  render();
  if(!o.noSync) Nav.sync('push');
}

function updateBadges(){
  const n = ReviewEngine.getDueReviews().length;
  $$('[data-badge="reviews"]').forEach(b => {
    b.textContent = String(n);
    b.classList.toggle('hidden', n === 0);
  });
}

/* ---------- BARRA DO CRONÔMETRO ----------
   v6.4 — dois estados, um de cada vez:
     Estudando    → o relógio grande é o tempo de ESTUDO;  ação: Descansar
     Descansando  → o relógio grande é o tempo de DESCANSO; ação: Voltar a estudar
   A cada segundo só o texto do relógio muda. A barra só é redesenhada nas
   transições (começar, descansar, voltar, finalizar). */

/** Avisos para leitores de tela: só mudanças importantes, nunca o relógio. */
function announce(text){
  const el = $('#sr-live');
  if(!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = text; }, 40);
}

/** Estudando ↔ descansando. Descanso é parte normal do estudo — não é interrupção nem falha. */
function toggleBreak(){
  if(!TimerService.isActive) return;
  const wasResting = TimerService.isOnBreak;
  if(wasResting) TimerService.endBreak(); else TimerService.startBreak();
  renderTimerBar({ switched:true });
  if(FocusMode.isOpen) FocusMode.render({ switched:true });
  announce(wasResting ? 'Estudo retomado.' : 'Descanso iniciado.');
}

function renderTimerBar(opts){
  const o = (opts && !(opts instanceof Event)) ? opts : {};
  const slot = $('#timerbar-slot');
  // v6.3 — o botão global diz o que vai acontecer: com cronômetro ligado, ele finaliza.
  const fab = $('#fab'), fabVerb = $('#fab .fab-verb');
  if(fab && fabVerb){
    const verb = TimerService.isActive ? 'Finalizar' : 'Registrar';
    if(fabVerb.textContent !== verb){ fabVerb.textContent = verb; fab.setAttribute('aria-label', verb + ' estudo'); }
  }
  if(!TimerService.isActive){ clear(slot); TimerService.stopTicking(); return; }
  const d = TimerService.data;
  const disc = getDiscipline(d.disciplineId);
  const topic = d.topicId ? getTopic(d.topicId) : null;
  const resting = TimerService.isOnBreak;

  const target = d.targetMinutes || null;
  const reached = () => !!target && TimerService.getElapsed() >= target * 60000;
  const labelText = () => resting ? 'Descansando' : (reached() ? 'Tempo sugerido atingido' : 'Estudando');
  const clockText = () => fmtTimer(resting ? TimerService.getBreakElapsed() : TimerService.getElapsed());
  // Linha de apoio sob o relógio: durante o descanso, onde o estudo parou; estudando, quanto já se descansou.
  const restDone = Math.round(sum(d.breaks, b => b.endedAt - b.startedAt) / 60000);
  const subText = resting ? `Estudo pausado em ${fmtTimer(TimerService.getElapsed())}`
    : (restDone > 0 ? `${fmtDurationWords(restDone)} de descanso` : '');

  const safe = TimerService.persisted;
  // anima só quando a barra aparece ou muda de estado; re-renderizações não repetem a entrada
  const isNew = !slot.querySelector('.timerbar');
  const hadFocus = !isNew && slot.contains(document.activeElement);
  const clock = h('span', { class:'tb-clock num', text: clockText(), 'aria-live':'off' });
  const labelEl = h('div', { class:'tb-label', text: labelText() });
  const meta = [topic ? topic.name : null, d.presetType ? sessionTypeLabel(d.presetType) : null,
    target ? `sugestão de ${fmtDuration(target)}` : null].filter(Boolean).join(' · ');
  const bar = h('div', { class:'timerbar' + (isNew ? ' is-entering' : '') + (o.switched && !isNew ? ' is-switching' : ''), role:'region',
      'aria-label': resting ? 'Descanso em andamento' : 'Estudo em andamento', 'data-state': resting ? 'rest' : 'study' },
    h('span', { class:'tb-status', 'aria-hidden':'true' }),
    h('div', { class:'tb-what' },
      labelEl,
      h('div', { class:'tb-disc', text: disc ? disc.name : '(disciplina removida)' }),
      meta ? h('div', { class:'tb-topic', text: meta }) : null),
    h('div', { class:'tb-time' },
      clock,
      subText ? h('span', { class:'tb-sub num', text: subText }) : null),
    h('div', { class:'tb-actions' },
      h('button', { class:'btn sm ' + (resting ? 'primary' : 'ghost'), type:'button', 'data-fk':'tb-toggle',
        text: resting ? 'Voltar a estudar' : 'Descansar', onclick:toggleBreak }),
      h('button', { class:'btn ghost sm', type:'button', text:'Foco', onclick:() => FocusMode.enter() }),
      h('button', { class:'btn sm ' + (resting ? 'ghost' : 'primary'), type:'button', text:'Finalizar estudo', onclick:openFinishModal }),
      h('button', { class:'linkbtn muted', type:'button', text:'descartar', onclick:discardTimer })
    ),
    /* v6.5 — o cronômetro conta na memória, mas só sobrevive a fechar a página se
       couber no armazenamento do navegador. Quando não cabe, a pessoa fica sabendo. */
    safe ? null : h('p', { class:'tb-warn', role:'status' },
      icon('i-alert'), h('span', { text:'Não foi possível garantir a recuperação deste cronômetro se a página for fechada.' }),
      h('span', { class:'tb-warn-x', text:' Finalize o estudo antes de fechar ou recarregar.' }))
  );
  mount(slot, bar);
  if(hadFocus){ const b = bar.querySelector('[data-fk="tb-toggle"]'); if(b) b.focus({ preventScroll:true }); }

  let ticks = 0;
  TimerService.startTicking(() => {
    if(!TimerService.isActive){ TimerService.stopTicking(); return; }
    // outra aba pode ter trocado o estado: o desenho acompanha, sem esperar um clique aqui
    if(TimerService.isOnBreak !== resting){ renderTimerBar({ switched:true }); return; }
    // gravação que falhou: tenta de novo a cada 10 s; o aviso some sozinho quando der certo
    if(!safe && (++ticks % 10) === 0) TimerService.retryPersist();
    if(TimerService.persisted !== safe){ renderTimerBar(); if(FocusMode.isOpen) FocusMode.render(); return; }
    const ct = clockText();
    if(clock.textContent !== ct) clock.textContent = ct;
    if(!resting){ const lt = labelText(); if(labelEl.textContent !== lt) labelEl.textContent = lt; }   // só escreve quando muda
  });
}

async function discardTimer(){
  if(!TimerService.isActive) return;
  const runId = TimerService.data.runId;
  const ok = await confirmModal('Descartar este estudo sem registrar o tempo?', { title:'Descartar o tempo', confirmLabel:'Descartar' });
  if(!ok) return;
  // Enquanto a pergunta estava aberta, outra aba pode ter finalizado este estudo: aí não há o que descartar.
  if(!TimerService.isActive || TimerService.data.runId !== runId){
    renderTimerBar();
    toast('Ele foi encerrado em outra aba.', 'info', { title:'Este estudo não está mais em andamento' });
    return;
  }
  TimerService.release(runId);
  renderTimerBar();
  toast('Nada foi registrado.', 'info', { title:'Tempo descartado' });
}

/* ---------- INICIAR SESSÃO ---------- */
function startTimer(disciplineId, topicId, presetType, presetMethod, targetMinutes){
  // v6.5: um estudo iniciado em outra aba também conta — o armazenamento é consultado antes de começar outro.
  if(!TimerService.isActive && TimerService.storedRunId()){ TimerService.restore(); renderTimerBar(); }
  if(TimerService.isActive){
    toast('Termine o estudo atual antes de começar outro.', 'err', { title:'Você já está estudando' });
    return false;
  }
  TimerService.start(disciplineId, topicId, presetType, presetMethod, targetMinutes);
  renderTimerBar();
  if(!TimerService.persisted){
    toast('Se a página for fechada, este estudo não poderá ser recuperado. Finalize antes de sair.', 'warn',
      { title:'Não foi possível garantir a recuperação deste cronômetro', duration:7000 });
  }
  const d = getDiscipline(disciplineId), t = topicId ? getTopic(topicId) : null;
  toast((d ? d.name : '') + (t ? ' · ' + t.name : '') + ' — o tempo já está contando.', 'ok',
    { title: presetType === 'revisao' ? 'Revisão iniciada' : 'Estudo iniciado' });
  return true;
}

/* =========================================================================
   v6.4 — FLUXO DE ESTUDO: ESTUDAR AGORA · JÁ ESTUDEI

   Duas formas de alimentar o MESMO histórico:
     · Estudar agora — "vou começar neste momento": o cronômetro acompanha.
     · Já estudei    — "esse estudo já aconteceu": data + horário de início e
                       fim (a duração sai sozinha) ou, se a pessoa não lembra
                       os horários, só a duração.

   Peças compartilhadas pelo registro, pelo fim do cronômetro e pela edição:
     entityPicker       seletor com busca dentro do próprio formulário
     studyTargetFields  Disciplina + Tópico (com criação pelo editor canônico)
     studyTypePicker    tipos de estudo com ícone e uma linha de explicação
     breaksEditor       descansos do estudo (por horário ou por minutos)
     studyWhenFields    data + horários → duração, com virada do dia

   Regras que valem em todos eles:
     · `minutes` é sempre tempo de ESTUDO; descanso fica em `breaks`;
     · o tópico é sempre da disciplina escolhida;
     · nada do que foi preenchido se perde ao trocar de modo ou abrir a
       criação de um tópico.
   ========================================================================= */
const PICK_RENDER_LIMIT = 80;   // linhas desenhadas por vez (a busca refina o resto)
const PICK_SEARCH_MIN = 6;      // listas menores não precisam de campo de busca

/** Entrada curta de um bloco que apareceu (troca de modo, de estado). */
function swapIn(el){
  if(!el || prefersReducedMotion() || typeof el.animate !== 'function') return;
  try { el.animate([{ opacity:.25, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:170, easing:'cubic-bezier(.2,.8,.2,1)' }); } catch(_){}
}

/**
 * Seletor de UMA opção, com busca, que abre dentro do próprio formulário
 * (nunca uma janela sobre outra). O valor escolhido aparece como uma pequena
 * composição — nome, contexto e "Alterar" —, não como texto num campo.
 *
 *   o = { id, label, optional, placeholder, searchPlaceholder, noResults,
 *         value, count(), describe(value) → { title, sub, side, muted } | null,
 *         options(query) → { rows:[{ kind:'group', label } |
 *                                   { kind:'opt', value, title, sub, tag, side, muted } |
 *                                   { kind:'create', title, run(query) }], total },
 *         onChange(value) }
 *
 * Teclado: Enter/Espaço/↓ abrem; ↑ ↓ percorrem; Enter escolhe; Esc fecha só o
 * seletor (a janela continua aberta); Tab fecha e segue adiante.
 */
function entityPicker(o){
  let value = o.value || '';
  let open = false, act = -1, rows = [], removeEsc = null, searchVisible = false;
  const lid = o.id + '-l', vid = o.id + '-v', listId = o.id + '-list';

  const labelEl = h('span', { class:'pick-label', id:lid }, o.label, o.optional ? h('span', { class:'optional', text:'opcional' }) : null);
  const main = h('span', { class:'pick-main', id:vid });
  const side = h('span', { class:'pick-side' });
  const change = h('span', { class:'pick-change', 'aria-hidden':'true' });
  const btn = h('button', { class:'pick-value', type:'button', id:o.id, 'aria-haspopup':'listbox', 'aria-expanded':'false',
    'aria-controls':listId, 'aria-labelledby': lid + ' ' + vid }, main, side, change);
  const input = h('input', { type:'search', class:'pick-q', id:o.id + '-q', autocomplete:'off', spellcheck:'false', enterkeyhint:'search',
    placeholder:o.searchPlaceholder || 'Buscar…', role:'combobox', 'aria-expanded':'true', 'aria-controls':listId, 'aria-autocomplete':'list',
    'aria-label':o.searchPlaceholder || 'Buscar' });
  const searchBox = h('div', { class:'an-search pick-search' }, icon('i-search'), input);
  const list = h('ul', { class:'pick-list', id:listId, role:'listbox', 'aria-labelledby':lid, tabindex:'-1' });
  const more = h('p', { class:'pick-more', hidden:true });
  const panel = h('div', { class:'pick-panel', hidden:true }, searchBox, list, more);
  const node = h('div', { class:'field pick' }, labelEl, btn, panel);

  function drawValue(animate){
    const sel = o.describe(value);
    clear(main); clear(side);
    if(sel){
      main.append(h('span', { class:'pick-t' + (sel.muted ? ' is-muted' : ''), text:sel.title }));
      if(sel.sub) main.append(h('span', { class:'pick-s', text:sel.sub }));
      if(sel.side) side.append(sel.side);
    } else {
      main.append(h('span', { class:'pick-t is-placeholder', text:o.placeholder }));
    }
    const chosen = !!sel && !sel.muted;
    change.textContent = chosen ? 'Alterar' : 'Escolher';
    btn.classList.toggle('has-value', chosen);
    if(animate) swapIn(main);
  }

  function setActive(i, scroll){
    if(act === i && !scroll) return;
    const prev = rows[act];
    if(prev){ prev.li.classList.remove('is-active'); prev.li.setAttribute('aria-selected', 'false'); }
    act = i;
    const cur = rows[act];
    const holder = searchVisible ? input : list;
    if(cur){
      cur.li.classList.add('is-active'); cur.li.setAttribute('aria-selected', 'true');
      holder.setAttribute('aria-activedescendant', cur.li.id);
      if(scroll) cur.li.scrollIntoView({ block:'nearest' });
    } else holder.removeAttribute('aria-activedescendant');
  }

  function drawList(){
    const q = input.value;
    const res = o.options(q) || { rows:[], total:0 };
    rows = []; act = -1;
    clear(list);
    let shown = 0;
    res.rows.forEach(r => {
      if(r.kind === 'group'){ list.append(h('li', { class:'pick-group', role:'presentation', text:r.label })); return; }
      if(r.kind === 'opt'){ if(shown >= PICK_RENDER_LIMIT) return; shown++; }
      const i = rows.length;
      const current = r.kind === 'opt' && r.value === value;
      const li = h('li', { class:'pick-opt' + (r.kind === 'create' ? ' is-create' : '') + (current ? ' is-current' : ''),
          role:'option', id: listId + '-' + i, 'aria-selected':'false' },
        r.kind === 'create' ? icon('i-plus', 'btn-icon pick-plus') : null,
        h('span', { class:'pick-main' },
          h('span', { class:'pick-t' + (r.muted ? ' is-muted' : '') }, r.kind === 'opt' && q.trim() ? highlightMatch(r.title, q) : r.title),
          r.sub ? h('span', { class:'pick-s', text:r.sub }) : null),
        r.tag ? h('span', { class:'pick-tag', text:r.tag }) : null,
        r.side ? h('span', { class:'pick-side' }, r.side) : null,
        current ? icon('i-check', 'btn-icon pick-check') : null);
      li.addEventListener('mousedown', (e) => e.preventDefault());      // o foco continua no campo de busca
      li.addEventListener('click', () => choose(i));
      li.addEventListener('mousemove', () => setActive(i, false));
      list.append(li);
      rows.push({ r, li });
    });
    if(!rows.length) list.append(h('li', { class:'pick-none', role:'presentation', text:o.noResults || 'Nada encontrado.' }));
    const total = res.total || 0;
    more.hidden = !(total > shown);
    more.textContent = total > shown ? `Mostrando ${shown} de ${total}. Digite para refinar.` : '';
    let start = q.trim() ? -1 : rows.findIndex(x => x.r.kind === 'opt' && x.r.value === value);
    if(start < 0) start = rows.length ? 0 : -1;
    setActive(start, true);
  }

  function choose(i){
    const x = rows[i];
    if(!x) return;
    if(x.r.kind === 'create'){
      const q = input.value.trim();
      closePanel(false);
      x.r.run(q);
      return;
    }
    const changed = x.r.value !== value;
    value = x.r.value;
    closePanel(true);
    drawValue(changed);
    if(changed && o.onChange) o.onChange(value);
  }

  function onDoc(e){
    if(!node.isConnected){ document.removeEventListener('mousedown', onDoc, true); return; }
    if(!node.contains(e.target)) closePanel(false);
  }
  function openPanel(){
    if(open || btn.disabled) return;
    open = true;
    input.value = '';
    searchVisible = (o.count ? o.count() : 0) >= PICK_SEARCH_MIN;
    searchBox.hidden = !searchVisible;
    list.tabIndex = searchVisible ? -1 : 0;
    btn.setAttribute('aria-expanded', 'true');
    node.classList.add('is-open');
    drawList();
    Motion.expand(panel);                    // v6.6: o painel cresce a partir do campo
    document.addEventListener('mousedown', onDoc, true);
    removeEsc = Overlay.pushEsc(() => closePanel(true), node);
    const target = searchVisible ? input : list;
    try { target.focus({ preventScroll:true }); } catch(_){ target.focus(); }
    panel.scrollIntoView({ block:'nearest' });
  }
  function closePanel(refocus){
    if(!open) return;
    open = false;
    // a lista some depressa; a escolha já está no campo
    if(panel.contains(document.activeElement) && !refocus){ try { btn.focus({ preventScroll:true }); } catch(_){} }
    Motion.collapse(panel);
    btn.setAttribute('aria-expanded', 'false');
    node.classList.remove('is-open');
    document.removeEventListener('mousedown', onDoc, true);
    if(removeEsc){ removeEsc(); removeEsc = null; }
    if(refocus && node.isConnected){ try { btn.focus({ preventScroll:true }); } catch(_){ btn.focus(); } }
  }

  btn.addEventListener('click', () => { if(open) closePanel(true); else openPanel(); });
  btn.addEventListener('keydown', (e) => { if((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open){ e.preventDefault(); openPanel(); } });
  input.addEventListener('input', drawList);
  panel.addEventListener('keydown', (e) => {
    const n = rows.length;
    if(e.key === 'ArrowDown'){ e.preventDefault(); if(n) setActive((act + 1) % n, true); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); if(n) setActive((act - 1 + n) % n, true); }
    else if(e.key === 'Home' && !searchVisible){ e.preventDefault(); if(n) setActive(0, true); }
    else if(e.key === 'End' && !searchVisible){ e.preventDefault(); if(n) setActive(n - 1, true); }
    else if(e.key === 'Enter' || (e.key === ' ' && !searchVisible)){ e.preventDefault(); if(act >= 0) choose(act); }
    else if(e.key === 'Tab'){ closePanel(true); }
  });

  drawValue(false);
  return {
    node, button: btn,
    get value(){ return value; },
    /** Troca o valor por código (criação de tópico, troca de disciplina). Não dispara onChange. */
    set(v, animate){ value = v || ''; drawValue(!!animate); },
    refresh(){ drawValue(false); },
    open: openPanel, close: closePanel
  };
}

/** Disciplinas estudadas mais recentemente (para o topo do seletor, quando a lista é longa). */
function recentDisciplines(n){
  return DerivedCache.get('recentDisc:' + n, () => {
    const last = new Map();
    state.sessions.forEach(s => {
      const k = s.date + '|' + str(s.createdAt);
      if(!last.has(s.disciplineId) || k > last.get(s.disciplineId)) last.set(s.disciplineId, k);
    });
    return Array.from(last.entries()).sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))
      .map(([id]) => getDiscipline(id)).filter(d => d && !d.archived).slice(0, n);
  });
}

/** O que dizer de um tópico numa linha: a próxima revisão, quando existe; senão, a situação. */
function topicPickMeta(t){
  if(t.archived) return 'arquivado';
  if(t.reviewEnabled && t.reviewDueDate) return 'revisão ' + fmtRelativeFuture(t.reviewDueDate);
  return TOPIC_STATUS_LABEL[topicStatus(t)];
}

/**
 * Disciplina + Tópico de um estudo. Serve ao registro, ao fim do cronômetro e
 * à edição.
 *   o.close               função de fechar do modal (com push/pop de subtela)
 *   o.idPrefix            prefixo dos ids ('rm', 'fin', 'es')
 *   o.discId / o.topicId  valores iniciais
 *   o.allowNewDiscipline  oferece "Nova disciplina…" (só o nome; padrões no resto)
 *   o.allowNewTopic       oferece "Criar novo tópico…" (editor canônico, em subtela)
 *   o.includeArchived     lista também disciplinas arquivadas (edição de estudo antigo)
 *   o.onChange({ discId, topicId, reason })   reason: 'discipline' | 'topic' | 'created'
 *
 * `ensure()` devolve a disciplina escolhida — criando-a antes, se a pessoa
 * digitou um nome novo — ou null (com aviso) quando falta escolher.
 */
function studyTargetFields(o){
  const prefix = o.idPrefix;
  let discId = (o.discId && getDiscipline(o.discId)) ? o.discId : '';
  let topicId = discId ? (o.topicId || '') : '';
  let creating = false;
  let ready = false;         // durante a montagem ninguém é avisado (quem chama ainda não tem a referência)
  const emit = (reason) => { if(ready && o.onChange) o.onChange({ discId: api.discId, topicId: api.topicId, reason }); };

  /* ---------- disciplina ---------- */
  function discList(){
    const list = (o.includeArchived ? state.disciplines : activeDisciplines()).slice().sort(sortByName);
    // Um cronômetro ou estudo antigo pode apontar para uma disciplina arquivada depois:
    // ela continua visível para o registro não trocar de disciplina sozinho.
    if(discId && !list.some(d => d.id === discId)){ const d = getDiscipline(discId); if(d) list.unshift(d); }
    return list;
  }
  const discRow = d => ({ kind:'opt', value:d.id, title:d.name, sub:areaNameOf(d), tag: d.archived ? 'arquivada' : null,
    side: priorityMark(d.priority, { compact:true }) });
  const discPicker = entityPicker({
    id: prefix + '-disc', label:'Disciplina', placeholder:'Escolher disciplina',
    searchPlaceholder:'Buscar disciplina…', noResults:'Nenhuma disciplina encontrada.',
    value: discId, count: () => discList().length,
    describe: v => { const d = v ? getDiscipline(v) : null;
      return d ? { title: d.name + (d.archived ? ' (arquivada)' : ''), sub: areaNameOf(d), side: priorityMark(d.priority, { compact:true }) } : null; },
    options: q => {
      const all = discList();
      const terms = normalizeText(q).split(' ').filter(Boolean);
      const rows = [];
      let total = 0;
      if(terms.length){
        const hit = all.filter(d => matchesTerms(normalizeText(d.name + ' ' + areaNameOf(d)), terms));
        hit.forEach(d => rows.push(discRow(d)));
        total = hit.length;
      } else {
        const recent = all.length > PICK_SEARCH_MIN ? recentDisciplines(3).filter(d => all.includes(d)) : [];
        if(recent.length){
          rows.push({ kind:'group', label:'Recentes' });
          recent.forEach(d => rows.push(discRow(d)));
          rows.push({ kind:'group', label:'Todas' });
        }
        all.forEach(d => rows.push(discRow(d)));
        total = all.length + recent.length;
      }
      if(o.allowNewDiscipline){
        const name = q.trim();
        rows.push({ kind:'create', title: name ? `Criar a disciplina “${name}”` : 'Nova disciplina…', run: text => startCreating(text) });
      }
      return { rows, total };
    },
    onChange: v => { discId = v; topicId = ''; topicPicker.set(''); syncTopic(true); emit('discipline'); }
  });

  /* Disciplina nova sem sair do registro: só o nome, com os padrões de sempre. */
  const newIn = h('input', { type:'text', id: prefix + '-newdisc', maxlength:'80', autocomplete:'off', placeholder:'Ex.: História' });
  const cancelNew = h('button', { class:'linkbtn muted', type:'button', text:'Escolher uma disciplina que já existe', onclick:() => stopCreating() });
  const newBox = h('div', { class:'field pick-new', hidden:true },
    h('label', { for:newIn.id, text:'O que você está estudando?' }), newIn,
    h('p', { class:'hint', text:'Uma matéria, um idioma, uma certificação, um instrumento… Um nome basta: ela é criada quando você continuar.' }),
    cancelNew);
  newIn.addEventListener('input', () => newIn.removeAttribute('aria-invalid'));
  newIn.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); ensure().then(id => { if(id) topicPicker.button.focus(); }); } });
  function startCreating(text){
    creating = true;
    newIn.value = text || '';
    discPicker.node.hidden = true;
    newBox.hidden = false;
    cancelNew.hidden = !discList().length;
    syncTopic(false);
    swapIn(newBox);
    setTimeout(() => { if(newIn.isConnected) newIn.focus(); }, 20);
    emit('discipline');
  }
  function stopCreating(){
    creating = false;
    newBox.hidden = true;
    discPicker.node.hidden = false;
    syncTopic(false);
    discPicker.button.focus();
    emit('discipline');
  }
  let ensuring = null;
  function ensure(){
    if(ensuring) return ensuring;
    ensuring = (async () => {
      if(!creating){
        if(discId && getDiscipline(discId)) return discId;
        toast('Escolha uma disciplina.', 'err');
        discPicker.button.focus();
        return null;
      }
      const clean = newIn.value.trim();
      if(!clean){
        newIn.setAttribute('aria-invalid', 'true'); newIn.focus();
        toast('Escreva o que você está estudando.', 'err');
        return null;
      }
      const key = normalizeText(clean);
      let disc = activeDisciplines().find(d => normalizeText(d.name) === key) || null;
      if(!disc){
        disc = newDiscipline(clean, null, PRIORITY_DEFAULT);
        try { await DB.put('disciplines', disc); }
        catch(err){
          console.error('Falha ao criar a disciplina:', err);
          toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível criar a disciplina' });
          return null;
        }
        ui.planDraft = null;
        try { await refresh(); } catch(err){ console.error(err); }
        toast('Adicione tópicos quando quiser.', 'ok', { title: clean + ' criada' });
      }
      creating = false;
      discId = disc.id; topicId = '';
      newBox.hidden = true;
      discPicker.node.hidden = false;
      discPicker.set(discId, true);
      topicPicker.set('');
      syncTopic(true);
      emit('discipline');
      return discId;
    })();
    const done = () => { ensuring = null; };
    ensuring.then(done, done);
    return ensuring;
  }

  /* ---------- tópico (depende da disciplina) ---------- */
  function topicList(){
    const list = topicsOf(discId).slice();
    if(topicId && !list.some(t => t.id === topicId)){
      const t = getTopic(topicId);
      if(t && t.disciplineId === discId) list.push(t);     // tópico arquivado depois: continua visível
      else topicId = '';                                    // coerência acima de tudo
    }
    return list;
  }
  const topicPicker = entityPicker({
    id: prefix + '-topic', label:'Tópico', optional:true, placeholder:'Sem tópico específico',
    searchPlaceholder:'Buscar tópico…', noResults:'Nenhum tópico encontrado.',
    value: topicId, count: () => topicList().length,
    describe: v => { const t = v ? getTopic(v) : null;
      return (t && t.disciplineId === discId) ? { title:t.name, sub:topicPickMeta(t) } : { title:'Sem tópico específico', muted:true }; },
    options: q => {
      const all = topicList();
      const terms = normalizeText(q).split(' ').filter(Boolean);
      const hit = terms.length ? all.filter(t => matchesTerms(normalizeText(t.name), terms)) : all;
      const rows = [];
      if(!terms.length) rows.push({ kind:'opt', value:'', title:'Sem tópico específico', muted:true });
      hit.forEach(t => rows.push({ kind:'opt', value:t.id, title:t.name, sub:topicPickMeta(t) }));
      if(o.allowNewTopic !== false && o.close){
        const name = q.trim();
        rows.push({ kind:'create', title: name ? `Criar o tópico “${name}”` : 'Criar novo tópico…', run: text => openCreate(text) });
      }
      return { rows, total: hit.length + (terms.length ? 0 : 1) };
    },
    onChange: v => { topicId = v; emit('topic'); }
  });
  function syncTopic(animate){
    const show = !creating && !!discId;
    const was = topicPicker.node.hidden;
    topicPicker.node.hidden = !show;
    topicPicker.refresh();
    if(show && was && animate) swapIn(topicPicker.node);
  }

  /* Criar tópico: o EDITOR CANÔNICO numa subtela do mesmo modal. Ao salvar,
     disciplina e tópico mudam JUNTOS — nunca um tópico de outra disciplina. */
  function openCreate(name){
    const back = () => o.close.pop(topicPicker.button);
    const ed = topicEditor({
      disciplineId: discId, name: name || '',
      chooseDiscipline: true, inRegistration: true,
      close: o.close, onCancel: back, onSaved: adopt, onUseExisting: adopt
    });
    o.close.push({ title: ed.title, content: ed.content, actions: ed.actions, focus: ed.focus, onEsc: back });
  }
  function adopt(t){
    const fresh = getTopic(t.id) || t;
    discId = fresh.disciplineId;
    topicId = fresh.id;
    discPicker.set(discId);
    topicPicker.set(topicId, true);
    syncTopic(false);
    o.close.pop(topicPicker.button);
    emit('created');
  }

  const node = h('div', { class:'study-target' }, discPicker.node, newBox, topicPicker.node);
  const api = {
    node, ensure,
    discButton: discPicker.button, topicButton: topicPicker.button,
    get discId(){ return creating ? '' : discId; },
    /** Só devolve o tópico se ele pertence à disciplina escolhida. */
    get topicId(){
      if(creating) return null;
      const t = topicId ? getTopic(topicId) : null;
      return (t && t.disciplineId === discId) ? t.id : null;
    }
  };
  syncTopic(false);
  if(o.allowNewDiscipline && !discId && !discList().length) startCreating('');
  ready = true;
  return api;
}

/**
 * Tipos de estudo: seis opções compactas, cada uma com um ícone discreto e uma
 * linha dizendo o que é. Opcional — clicar de novo na escolhida desmarca.
 * Grupo de rádio com setas (padrão ARIA) e um único ponto de parada do Tab.
 */
function studyTypePicker(o){
  let value = SESSION_TYPES.some(t => t.v === o.value) ? o.value : null;
  const lid = o.id + '-l';
  const group = h('div', { class:'type-grid', role:'radiogroup', 'aria-labelledby':lid });
  const buttons = SESSION_TYPES.map(t => {
    const b = h('button', { class:'type-opt', type:'button', role:'radio', 'aria-checked': t.v === value ? 'true' : 'false', 'data-v':t.v },
      h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')),
      h('span', { class:'type-text' }, h('span', { class:'type-t', text:t.label }), h('span', { class:'type-d', text:t.hint })));
    b.addEventListener('click', () => {
      value = (value === t.v) ? null : t.v;
      buttons.forEach(x => { x.setAttribute('aria-checked', x.dataset.v === value ? 'true' : 'false'); x.setAttribute('tabindex', x === b ? '0' : '-1'); });
      if(o.onChange) o.onChange(value);
    });
    group.append(b);
    return b;
  });
  rovingInit(group);
  return {
    node: h('div', { class:'field' },
      h('span', { class:'pick-label', id:lid }, 'Tipo de estudo', h('span', { class:'optional', text:'opcional' })), group),
    get value(){ return value; }
  };
}

/**
 * Comentário de um estudo (v6.4.1). É opcional — e por isso fica fora do
 * caminho: aparece como "+ Adicionar comentário" e só vira um campo quando a
 * pessoa quer escrever. Um estudo que já tem comentário abre com o campo à
 * mostra. "Remover" recolhe o campo sem jogar fora o que foi escrito: abrir de
 * novo traz o texto de volta. Recolhido, `value` é '' (nada é gravado).
 */
function commentField(o){
  const ta = h('textarea', { id:o.id, maxlength:'2000', rows:'3' });
  ta.value = str(o.value);
  const boxId = o.id + '-box';
  const addBtn = h('button', { class:'linkbtn add-link', type:'button', 'aria-controls':boxId, text:'+ Adicionar comentário' });
  const hideBtn = h('button', { class:'linkbtn muted', type:'button', text:'Remover', 'aria-label':'Remover o comentário' });
  const box = h('div', { class:'field comment-box', id:boxId, hidden:true },
    h('div', { class:'label-row' }, h('label', { for:o.id }, 'Comentário', h('span', { class:'optional', text:'opcional' })), hideBtn),
    ta);
  const setOpen = (open, byUser) => {
    box.hidden = !open;
    addBtn.hidden = open;
    if(!byUser) return;
    if(open){
      swapIn(box); ta.focus();
      // o campo inteiro à vista, acima das ações fixas da janela (scroll-padding no CSS)
      try { box.scrollIntoView({ block:'nearest' }); } catch(_){}
    } else addBtn.focus();
  };
  addBtn.addEventListener('click', () => setOpen(true, true));
  hideBtn.addEventListener('click', () => setOpen(false, true));
  setOpen(!!ta.value.trim(), false);
  return {
    node: h('div', { class:'comment' }, addBtn, box),
    textarea: ta,
    get value(){ return box.hidden ? '' : ta.value.trim(); }
  };
}

/** Dificuldade percebida — opcional; clicar de novo na escolhida desmarca. */
function difficultyField(idPrefix, value, onPick){
  return h('div', { class:'field' },
    h('span', { class:'pick-label', id:idPrefix + '-diff-l' }, 'Dificuldade', h('span', { class:'optional', text:'opcional' })),
    pillGroup(DIFFICULTIES.map(d => ({ value:d.v, label:d.label, color:d.color })), value, v => onPick(v ? Number(v) : null), 'Dificuldade percebida'));
}

/**
 * "Como foi" — o grupo que reúne tudo o que descreve o estudo depois de feito:
 * tipo de estudo, dificuldade, resultado da revisão e comentário. O título é o
 * pai; os campos são os filhos (ver .rm-group no CSS). A ordem no documento é
 * a ordem de leitura e do Tab: tipo → dificuldade → resultado → comentário.
 */
function howGroup(o){
  const title = h('h4', { class:'rm-group-t', id:o.id, text:'Como foi' });
  const row = h('div', { class:'how-row' },
    h('div', { class:'how-col' }, o.difficulty, o.outcome || null),
    h('div', { class:'how-col' }, o.comment));
  return { node: h('section', { class:'rm-group rm-how', 'aria-labelledby':o.id }, title, o.type, row), title, row };
}

/**
 * Campo de horário do Ciclo — 24 horas, HH:MM (v6.4.1).
 *
 * É um campo de texto comum, sem o seletor nativo do navegador: nada de
 * "rodinhas", e a roda do mouse sobre o campo só rola a janela — o horário
 * nunca muda sozinho. Digitar é a forma principal de uso:
 *
 *   2350 → 23:50     930 → 09:30     colar "18:45" → 18:45
 *
 * O que o campo faz e o que ele NÃO faz:
 *   · organiza os dígitos enquanto a pessoa digita (clockMask), sem brigar com
 *     o cursor nem com Backspace/Delete;
 *   · ao sair, completa só o que é inequívoco ("14" → 14:00; "9:30" → 09:30);
 *   · nunca transforma um horário impossível em outro: 27:89 fica como está e
 *     é apontado como erro (aria-invalid). Um horário pela metade (09:5) só é
 *     apontado depois que a pessoa sai do campo;
 *   · ↑ e ↓ ajustam a hora ou os minutos (onde o cursor estiver), só quando o
 *     horário já está completo. Tab, Shift+Tab, Home e End são os do navegador.
 *
 *   o = { id, value, ariaLabel, describedBy, enterHint, onInput(), onEnter() }
 */
function timeField(o){
  const input = h('input', { type:'text', class:'time-input num', id:o.id, inputmode:'numeric', autocomplete:'off', autocapitalize:'off',
    spellcheck:'false', placeholder:'hh:mm', enterkeyhint:o.enterHint || 'done',
    'aria-label':o.ariaLabel || null, 'aria-describedby':o.describedBy || null });
  if(o.value) input.value = clockSettle(clockMask(o.value));
  let focused = false;

  const notify = () => { if(o.onInput) o.onInput(); };
  const stateNow = () => clockState(input.value);
  const mark = () => {
    const st = stateNow();
    if(st === 'invalid' || (st === 'partial' && !focused)) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };
  const settle = () => { const t = clockSettle(input.value); if(t !== input.value) input.value = t; mark(); };

  input.addEventListener('input', () => {
    const raw = input.value;
    const text = clockMask(raw);
    if(text !== raw){
      const pos = (typeof input.selectionStart === 'number') ? input.selectionStart : raw.length;
      if(pos >= raw.length) input.value = text;               // digitando no fim: o cursor continua no fim
      else {
        // edição no meio: o cursor fica depois do mesmo dígito em que estava
        const countDigits = t => t.replace(/\D/g, '').length;
        let left = countDigits(raw.slice(0, pos)) + (countDigits(text) > countDigits(raw) ? 1 : 0);
        let i = 0;
        while(i < text.length && left > 0){ if(/\d/.test(text[i])) left--; i++; }
        input.value = text;
        try { input.setSelectionRange(i, i); } catch(_){}
      }
    }
    mark(); notify();
  });

  /* Colar um horário inteiro ("18:45", "18h45", "6:45 PM") substitui o campo.
     Qualquer outra coisa segue o caminho normal: entra no cursor e passa pela máscara. */
  input.addEventListener('paste', (e) => {
    let data = null;
    try { data = e.clipboardData ? e.clipboardData.getData('text') : null; } catch(_){}
    if(typeof data !== 'string') return;
    const text = clockFromPaste(data);
    if(clockState(text) !== 'valid') return;
    e.preventDefault();
    input.value = text;
    mark(); notify();
  });

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      settle(); notify();
      if(o.onEnter && stateNow() === 'valid'){ e.preventDefault(); o.onEnter(); }
      return;
    }
    if((e.key !== 'ArrowUp' && e.key !== 'ArrowDown') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if(stateNow() !== 'valid') return;                          // nada para ajustar: a tecla segue o padrão do navegador
    e.preventDefault();
    const text = clockSettle(input.value);
    const onHour = (typeof input.selectionStart === 'number' ? input.selectionStart : 5) <= 2;
    const step = e.key === 'ArrowUp' ? 1 : -1;
    let hh = Number(text.slice(0, 2)), mm = Number(text.slice(3, 5));
    if(onHour) hh = (hh + step + 24) % 24; else mm = (mm + step + 60) % 60;
    input.value = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
    try { input.setSelectionRange(onHour ? 0 : 3, onHour ? 2 : 5); } catch(_){}
    mark(); notify();
  });

  input.addEventListener('focus', () => { focused = true; });
  input.addEventListener('blur', () => { focused = false; settle(); notify(); });

  return {
    input,
    get state(){ return stateNow(); },
    get focused(){ return focused; },
    /** O texto como está no campo (inclusive pela metade) — para redesenhar sem perder nada. */
    get text(){ return input.value; },
    /** "HH:MM" quando o horário está completo e válido; senão, ''. */
    get value(){ return stateNow() === 'valid' ? clockSettle(input.value) : ''; },
    set(v){ input.value = v ? clockSettle(clockMask(v)) : ''; mark(); },
    focus(){ input.focus(); }
  };
}

/** Rótulo de um campo de horário: o nome à esquerda e, discreto, o formato à direita. */
function timeLabel(forId, text){
  return h('label', { for:forId, class:'time-label' }, text, h('span', { class:'time-fmt', 'aria-hidden':'true', text:'24h' }));
}

const CLOCK_SR_HELP = 'Horário no formato 24 horas, de 00:00 a 23:59. Digite as horas e os minutos; os dois pontos entram sozinhos.';
const CLOCK_RANGE_ERROR = 'Use um horário entre 00:00 e 23:59.';
const CLOCK_PARTIAL_ERROR = 'Horário incompleto. Digite as horas e os minutos — 0950 vira 09:50.';
const CLOCK_EXTRA_ERROR = 'Há números demais. Um horário tem só horas e minutos — 2350 vira 23:50.';
/** Mensagem certa para um horário impossível: dígitos sobrando ou fora de 00:00–23:59. */
function clockErrorText(text){
  return str(text).replace(/\D/g, '').length > 4 ? CLOCK_EXTRA_ERROR : CLOCK_RANGE_ERROR;
}

/**
 * Descansos de um estudo.
 *   modo 'time'    — cada descanso tem início e fim (registro por horário);
 *   modo 'minutes' — cada descanso tem só a duração (edição, fim do cronômetro
 *                    ou registro em que a pessoa só sabe quanto durou).
 *
 * read(ctx, lenient) valida e devolve { ok, breaks, total } ou { ok:false, msg, el }.
 *   ctx (modo 'time') = { date, startMin, endAbs } — o intervalo do estudo, em
 *   minutos desde a meia-noite da data de início (endAbs ≥ 1440 = dia seguinte).
 *   lenient = true ignora linhas ainda em branco (para o resumo ao vivo);
 *   uma linha preenchida e incoerente é sempre apontada.
 * Nenhum descanso pode: ficar fora do estudo, terminar antes de começar ou
 * dividir horário com outro.
 *
 * v6.4.1 — no modo 'time' cada linha é uma frase curta e sempre editável:
 *   [23:58] → [00:05]   7 min   ✕
 * `o.compact` tira a pergunta "Teve algum descanso?" (o registro já diz isso
 * pelo contexto) e `o.footExtra` põe outra ação na mesma linha do "+ Adicionar".
 */
function breaksEditor(o){
  const p = o.idPrefix;
  let mode = o.mode === 'time' ? 'time' : 'minutes';
  let seq = 0;
  const rows = (o.breaks || []).map(b => ({
    key: ++seq, id: b.id, startedAt: b.startedAt || null, endedAt: b.endedAt || null, origMinutes: b.minutes,
    start: b.startedAt ? fmtClockOfDay(b.startedAt) : '', end: b.endedAt ? fmtClockOfDay(b.endedAt) : '',
    minutes: String(b.minutes), inputs: []
  }));
  const changed = () => { if(o.onChange) o.onChange(); };

  const head = h('p', { class:'breaks-title', text:'Descansos' });
  const list = h('div', { class:'breaks-list' });
  const question = o.compact ? null : h('span', { class:'breaks-q', text:'Teve algum descanso?' });
  const addLabel = h('span');
  const addBtn = h('button', { class:'linkbtn', type:'button', onclick:() => {
    if(rows.length >= MAX_BREAKS_PER_STUDY) return;
    const r = { key: ++seq, id: uid(), startedAt:null, endedAt:null, origMinutes:null, start:'', end:'', minutes:'', inputs:[] };
    rows.push(r);
    draw(r.key);
    changed();
  } }, addLabel);
  const foot = h('p', { class:'breaks-foot' }, question, addBtn, o.footExtra ? h('span', { class:'breaks-extra' }, o.footExtra) : null);
  const node = h('div', { class:'breaks' + (o.compact ? ' is-compact' : '') }, head, list, foot);

  /** Duração de uma linha por horário: "7 min" (ou vazio enquanto não dá para calcular). */
  function spanText(r){
    if(clockState(r.start) !== 'valid' || clockState(r.end) !== 'valid') return '';
    const bs = parseClock(r.start), be = parseClock(r.end);
    if(bs === null || be === null || bs === be) return '';
    return fmtDurationWords(be > bs ? be - bs : be + 1440 - bs);
  }

  function draw(focusKey){
    clear(list);
    rows.forEach((r, i) => {
      const n = i + 1;
      const rm = h('button', { class:'icon-btn mini', type:'button', 'aria-label':`Remover o descanso ${n}`, title:'Remover este descanso',
        onclick:() => { rows.splice(rows.indexOf(r), 1); draw(); changed(); addBtn.focus(); } }, icon('i-close'));
      let body;
      if(mode === 'time'){
        const len = h('span', { class:'break-len num', text: spanText(r) });
        const sync = () => { const t = spanText(r); if(len.textContent !== t) len.textContent = t; changed(); };
        const a = timeField({ id:`${p}-bs-${r.key}`, value:r.start, ariaLabel:`Descanso ${n}: começou às`, describedBy:o.clockHelpId || null,
          enterHint:'next', onInput:() => { r.start = a.text; sync(); }, onEnter:() => z.focus() });
        const z = timeField({ id:`${p}-be-${r.key}`, value:r.end, ariaLabel:`Descanso ${n}: terminou às`, describedBy:o.clockHelpId || null,
          onInput:() => { r.end = z.text; sync(); } });
        r.inputs = [a.input, z.input];
        body = [a.input, h('span', { class:'break-sep', 'aria-hidden':'true', text:'→' }), z.input, len];
      } else {
        const m = h('input', { type:'number', class:'no-spin', min:'1', step:'1', inputmode:'numeric', id:`${p}-bm-${r.key}`, value:r.minutes,
          'aria-label':`Descanso ${n}, em minutos` });
        m.addEventListener('input', () => { r.minutes = m.value; m.removeAttribute('aria-invalid'); changed(); });
        r.inputs = [m];
        const clock = (r.startedAt && r.endedAt) ? `${fmtClockOfDay(r.startedAt)} → ${fmtClockOfDay(r.endedAt)}` : null;
        body = [h('span', { class:'break-n', text:`Descanso ${n}` }),
          clock ? h('span', { class:'break-clock num', text:clock }) : null, m, h('span', { class:'break-unit', 'aria-hidden':'true', text:'min' })];
      }
      list.append(h('div', { class:'break-row is-' + mode, role:'group', 'aria-label':`Descanso ${n}` }, body, rm));
    });
    head.hidden = !rows.length;
    if(question) question.hidden = !!rows.length;
    addLabel.textContent = rows.length ? '+ Outro descanso' : '+ Adicionar descanso';
    addBtn.hidden = rows.length >= MAX_BREAKS_PER_STUDY;
    if(focusKey){
      const r = rows.find(x => x.key === focusKey);
      if(r && r.inputs[0]){
        swapIn(r.inputs[0].parentNode); r.inputs[0].focus();
        try { foot.scrollIntoView({ block:'nearest' }); } catch(_){}      // a linha nova e o "+ Outro descanso" ficam à vista
      }
    }
  }

  function read(ctx, lenient){
    const out = [];
    const fail = (r, msg, k) => ({ ok:false, msg, el: r.inputs[k || 0] || addBtn });
    if(mode === 'minutes'){
      for(const r of rows){
        const raw = str(r.minutes).trim();
        const m = Math.round(Number(raw));
        if(!raw){
          if(lenient) continue;
          return fail(r, 'Informe quantos minutos durou o descanso — ou remova-o.');
        }
        if(!(m > 0) || m > 1440) return fail(r, 'O descanso precisa ter entre 1 minuto e 24 horas.');
        const a = validInstant(r.startedAt), z = validInstant(r.endedAt);
        if(a !== null && z !== null){
          // minutos corrigidos à mão: o início fica, o fim acompanha a nova duração
          out.push({ id:r.id, startedAt: new Date(a).toISOString(),
            endedAt: (m === r.origMinutes) ? new Date(z).toISOString() : new Date(a + m * 60000).toISOString(), minutes:m });
        } else out.push({ id:r.id, startedAt:null, endedAt:null, minutes:m });
      }
      return { ok:true, breaks:out, total: sum(out, b => b.minutes) };
    }
    // Um horário impossível (27:89) é apontado mesmo antes de existir o horário do estudo.
    for(const r of rows){
      const sa = clockState(r.start), sz = clockState(r.end);
      if(sa === 'invalid' || sz === 'invalid') return fail(r, clockErrorText(sa === 'invalid' ? r.start : r.end), sa === 'invalid' ? 0 : 1);
    }
    if(!ctx){
      if(lenient || !rows.length) return { ok:true, breaks:[], total:0 };
      return fail(rows[0], 'Informe primeiro o horário do estudo.');
    }
    const spans = [];
    for(const r of rows){
      const bs = clockState(r.start) === 'valid' ? parseClock(r.start) : null;
      const be = clockState(r.end) === 'valid' ? parseClock(r.end) : null;
      if(bs === null || be === null){
        if(lenient) continue;
        return fail(r, 'Informe o início e o fim do descanso — ou remova-o.', bs === null ? 0 : 1);
      }
      // antes do horário de início = já no dia seguinte (estudo que atravessa a meia-noite)
      const a = bs >= ctx.startMin ? bs : bs + 1440;
      const z = be >= ctx.startMin ? be : be + 1440;
      if(z <= a) return fail(r, 'O descanso precisa terminar depois de começar.', 1);
      if(a < ctx.startMin || z > ctx.endAbs) return fail(r, 'Esse descanso está fora do horário do estudo.', a >= ctx.endAbs ? 0 : 1);
      spans.push({ r, a, z });
    }
    spans.sort((x, y) => x.a - y.a);
    for(let i = 1; i < spans.length; i++){
      if(spans[i].a < spans[i - 1].z) return fail(spans[i].r, 'Dois descansos estão no mesmo horário.');
    }
    spans.forEach(s => {
      const da = localDateTime(ctx.date, s.a), dz = localDateTime(ctx.date, s.z);
      out.push({ id:s.r.id, startedAt: da.toISOString(), endedAt: dz.toISOString(), minutes: Math.round((dz - da) / 60000) });
    });
    return { ok:true, breaks:out, total: sum(out, b => b.minutes) };
  }

  draw();
  return {
    node, read, addButton: addBtn,
    get count(){ return rows.length; },
    /** Retrato do que está digitado (para saber se algo mudou desde a abertura). */
    get signature(){ return mode + '|' + rows.map(r => mode === 'time' ? r.start + '>' + r.end : r.minutes).join(','); },
    /** Trocar de modo aproveita o que dá: horários viram minutos; minutos não viram horários. */
    setMode(m){
      const next = m === 'time' ? 'time' : 'minutes';
      if(next === mode) return;
      if(next === 'minutes'){
        rows.forEach(r => {
          const bs = parseClock(r.start), be = parseClock(r.end);
          if(bs !== null && be !== null && be !== bs) r.minutes = String(be > bs ? be - bs : be + 1440 - bs);
        });
      }
      mode = next;
      draw();
    }
  };
}

/**
 * "Quando" de um estudo que já aconteceu.
 * Data (o dia em que o estudo COMEÇOU) + Comecei + Terminei → a duração sai
 * sozinha, na hora. Terminar antes do horário de início significa "no dia
 * seguinte": 23:50 → 00:12 são 22 minutos. Quem não lembra os horários informa
 * só a duração — e pode voltar aos horários sem perder o que já digitou.
 *
 * evaluate(lenient) devolve
 *   { complete:true, date, minutes, breakMinutes, breaks, startedAt, endedAt, nextDay, needsConfirm }
 * ou { complete:false, error | missing, errorEl }.
 *   error   = algo incoerente (aparece na hora, junto dos campos);
 *   missing = ainda falta preencher (só é cobrado ao registrar).
 *
 * v6.4.1 — os horários usam `timeField` (campo próprio, 24h). O resultado tem
 * três leituras que não se confundem: o TEMPO DE ESTUDO (principal), e, quando
 * há descanso, o tempo decorrido e o descanso numa linha de apoio. Só o texto
 * dessa região muda a cada tecla — nada mais é redesenhado.
 */
function studyWhenFields(o){
  const p = o.idPrefix;
  /* v6.5 — o mesmo componente serve à EDIÇÃO de um estudo: `o.initial` traz o
     que está gravado ({ date, mode, start, end, minutes, breaks, startedAt,
     endedAt, clockLabel }). Enquanto a pessoa não mexe em horário, duração ou
     descansos, o resultado mostrado é exatamente o gravado — nada é recalculado
     a partir de horários arredondados para o minuto. */
  const init = o.initial || null;
  let mode = (init && init.mode === 'duration') ? 'duration' : 'time';
  const tISO = todayISO();
  const clockHelpId = p + '-clock-help', resultId = p + '-when-result';
  const maxDate = (init && init.date > tISO) ? init.date : tISO;      // um estudo já gravado no futuro pode manter a data
  const dateIn = h('input', { type:'date', id:p + '-date', max:maxDate,
    value: init ? init.date : ((o.date && isStrictISODate(o.date) && o.date <= tISO) ? o.date : tISO) });
  const onEdit = () => { dateIn.removeAttribute('aria-invalid'); minIn.removeAttribute('aria-invalid'); refresh(); };
  const startF = timeField({ id:p + '-start', value: init ? init.start : '', describedBy: clockHelpId + ' ' + resultId, enterHint:'next', onInput:onEdit, onEnter:() => endF.focus() });
  const endF = timeField({ id:p + '-end', value: init ? init.end : '', describedBy: clockHelpId + ' ' + resultId, onInput:onEdit });
  const minIn = h('input', { type:'number', class:'no-spin', id:p + '-min', min:'1', step:'1', inputmode:'numeric',
    value:String(init ? init.minutes : (state.settings.defaultSessionMinutes || 40)) });
  const minHuman = h('p', { class:'hint min-human num', 'aria-live':'polite' });
  const result = h('p', { class:'when-result', id:resultId, 'aria-live':'polite', 'aria-atomic':'true' });
  const detail = h('p', { class:'when-detail num', hidden:true });
  const helper = h('p', { class:'when-help' });
  const fixBtn = h('button', { class:'linkbtn', type:'button', hidden:true });
  const note = h('p', { class:'when-note', 'aria-live':'polite' });
  const modeBtn = h('button', { class:'linkbtn muted', type:'button', onclick:() => setMode(mode === 'time' ? 'duration' : 'time') });
  const breaks = breaksEditor({ idPrefix:p, mode: mode === 'time' ? 'time' : 'minutes', breaks: init ? init.breaks : [], compact:true, footExtra:modeBtn, clockHelpId, onChange:() => refresh() });

  const quick = h('div', { class:'chips', role:'group', 'aria-label':'Durações comuns' },
    [20, 30, 40, 60].map(v => h('button', { class:'chip', type:'button', text:v + ' min',
      onclick:() => { minIn.value = String(v); minIn.removeAttribute('aria-invalid'); refresh(); } })));
  const startField = h('div', { class:'field' }, timeLabel(startF.input.id, 'Comecei'), startF.input);
  const endField = h('div', { class:'field' }, timeLabel(endF.input.id, 'Terminei'), endF.input);
  const durField = h('div', { class:'field when-dur', hidden:true }, h('label', { for:minIn.id, text:'Tempo estudado, em minutos' }), minIn, minHuman, init ? null : quick);

  // retrato inicial: serve para saber o que a pessoa realmente mexeu
  const start0 = startF.text, end0 = endF.text, minText0 = minIn.value, mode0 = mode, breaks0 = breaks.signature;
  const timeTouched = () => mode !== mode0 || startF.text !== start0 || endF.text !== end0 || minIn.value !== minText0 || breaks.signature !== breaks0;

  function evaluate(lenient){
    const date = dateIn.value;
    const out = { mode, date, complete:false, error:null, missing:null, errorEl:null, fixDate:null, pristine:false };
    if(!date || !isStrictISODate(date)){ out.missing = 'Escolha a data do estudo.'; out.errorEl = dateIn; return out; }
    if(date > todayISO() && !(init && date === init.date)){ out.error = 'Escolha hoje ou um dia que já passou.'; out.errorTitle = 'Data no futuro'; out.errorEl = dateIn; return out; }

    // Edição sem mexer no tempo: vale o que está gravado, sem recalcular nada.
    if(init && !timeTouched()){
      const restMin = sum(init.breaks, b => (isNum(b.minutes) && b.minutes > 0) ? b.minutes : 0);
      return Object.assign(out, { complete:true, pristine:true, minutes:init.minutes, breakMinutes:restMin, breaks:init.breaks,
        elapsed: init.minutes + restMin, startedAt:init.startedAt || null, endedAt:init.endedAt || null,
        nextDay: !!(init.startedAt && init.endedAt && localDateOfStamp(init.startedAt) !== localDateOfStamp(init.endedAt)),
        needsConfirm:false });
    }

    if(mode === 'duration'){
      const m = Math.round(Number(minIn.value));
      if(!(m > 0)){ out.missing = 'Informe quanto tempo você estudou.'; out.errorEl = minIn; return out; }
      if(m > 1440 * 2){ out.error = 'Esse tempo passa de dois dias. Confira os minutos.'; out.errorEl = minIn; return out; }
      const br = breaks.read(null, lenient);
      if(!br.ok){ out.error = br.msg; out.errorEl = br.el; return out; }
      // MODO DURAÇÃO: nenhum horário é guardado — nem o do estudo, nem o dos descansos
      const plain = br.breaks.map(b => Object.assign({}, b, { startedAt:null, endedAt:null }));
      return Object.assign(out, { complete:true, minutes:m, breakMinutes:br.total, breaks:plain, startedAt:null, endedAt:null,
        nextDay:false, needsConfirm: TimeRules.isSuspicious(m) });
    }

    // Horário impossível: apontado na hora. Horário pela metade: só depois de sair do campo (ou ao registrar).
    const wrong = [startF, endF].find(f => f.state === 'invalid');
    if(wrong){ out.error = clockErrorText(wrong.text); out.errorEl = wrong.input; return out; }
    const half = [startF, endF].find(f => f.state === 'partial');
    if(half){
      if(lenient && half.focused) out.missing = CLOCK_PARTIAL_ERROR; else out.error = CLOCK_PARTIAL_ERROR;
      out.errorEl = half.input;
      return out;
    }
    const s = parseClock(startF.value), e = parseClock(endF.value);
    if(s === null || e === null){
      out.missing = s === null ? 'Informe a que horas você começou.' : 'Informe a que horas você terminou.';
      out.errorEl = s === null ? startF.input : endF.input;
      return out;
    }
    const span = TimeRules.span(s, e);
    if(!span.ok){ out.error = 'O início e o fim estão no mesmo horário.'; out.errorEl = endF.input; return out; }
    const endAbs = span.endAbs;                             // terminou "antes" de começar = dia seguinte
    const a = localDateTime(date, s), z = localDateTime(date, endAbs);
    const elapsed = Math.round((z - a) / 60000);
    const now = Date.now();
    if(z.getTime() > now + 60000){
      const startAhead = a.getTime() > now;
      out.error = startAhead ? 'Esse horário ainda não chegou. Se o estudo foi em outro dia, mude a data.' : 'O horário de término ainda não chegou.';
      out.errorEl = startAhead ? startF.input : endF.input;
      // Caso mais comum: acabou de passar da meia-noite e o estudo começou "ontem".
      const prev = addDaysISO(date, -1);
      const zPrev = localDateTime(prev, endAbs);
      if(zPrev && zPrev.getTime() <= now + 60000) out.fixDate = prev;
      return out;
    }
    const br = breaks.read({ date, startMin:s, endAbs }, lenient);
    if(!br.ok){ out.error = br.msg; out.errorEl = br.el; return out; }
    const net = TimeRules.netMinutes(elapsed, br.total);
    if(!(net > 0)){ out.error = 'Os descansos ocupam todo o tempo do estudo.'; out.errorEl = breaks.addButton; return out; }
    return Object.assign(out, { complete:true, minutes:net, breakMinutes:br.total, breaks:br.breaks, elapsed,
      startedAt:a.toISOString(), endedAt:z.toISOString(), nextDay: span.nextDay, needsConfirm: TimeRules.isSuspicious(net) });
  }

  let shown = null;                                          // o que está escrito agora (só redesenha quando muda)
  function refresh(){
    const r = evaluate(true);
    let main = '', tail = '', sub = '', extra = '', err = '';
    if(r.complete){
      if(mode === 'time' || r.breakMinutes){
        main = fmtDurationWords(r.minutes);
        if(r.nextDay) tail = 'terminou no dia seguinte';
      }
      if(r.breakMinutes){
        sub = mode === 'time'
          ? `${fmtDurationWords(r.elapsed)} decorridos · ${fmtDurationWords(r.breakMinutes)} de descanso`
          : `${fmtDurationWords(r.breakMinutes)} de descanso, guardado à parte`;
      }
      if(r.needsConfirm) extra = `São ${fmtDuration(r.minutes)} de estudo. Confira ${mode === 'time' ? 'os horários' : 'a duração'} antes de ${init ? 'salvar' : 'registrar'}.`;
      // Edição: a pessoa trocou o horário pela duração — o horário gravado deixa de existir ao salvar.
      else if(init && init.clockLabel && mode === 'duration' && !r.pristine) extra = `Ao salvar, o horário gravado (${init.clockLabel}) deixa de ser guardado: o estudo passa a valer pela duração.`;
    } else if(r.error){
      err = r.error;
    }
    const human = mode === 'duration' ? humanMinutesHint(minIn.value) : '';
    if(minHuman.textContent !== human) minHuman.textContent = human;
    minHuman.hidden = !human;
    const key = [main, tail, err].join('|');
    if(key !== shown){
      const hadValue = !!shown && shown[0] !== '|';
      shown = key;
      clear(result);
      // appendChildren ignora o que não existe (Node.append escreveria "null" na tela)
      if(main) appendChildren(result, [h('span', { class:'wr-v num', text:main }), ' de estudo', tail ? h('span', { class:'wr-x', text:' · ' + tail }) : null]);
      else if(err) result.textContent = err;
      result.className = 'when-result' + (main ? ' is-ok' : (err ? ' is-error' : ''));
      // a duração troca com um fade curto; a primeira aparição e os erros entram sem movimento extra
      if(main && hadValue && !prefersReducedMotion() && typeof result.animate === 'function'){
        try { result.animate([{ opacity:.45 }, { opacity:1 }], { duration:130, easing:'ease-out' }); } catch(_){}
      }
    }
    if(detail.textContent !== sub) detail.textContent = sub;
    detail.hidden = !sub;
    helper.hidden = !!(main || err) || mode !== 'time';
    if(note.textContent !== extra) note.textContent = extra;
    fixBtn.hidden = !r.fixDate;
    if(r.fixDate){ fixBtn.dataset.date = r.fixDate; fixBtn.textContent = `Foi ontem? Usar ${fmtDateBR(r.fixDate)}`; }
    if(o.onChange) o.onChange(r);
  }
  fixBtn.addEventListener('click', () => {
    const d = fixBtn.dataset.date;
    if(!d || !parseISO(d)) return;
    dateIn.value = d;
    refresh();
    endF.focus();
  });

  function setMode(m){
    mode = m;
    startField.hidden = endField.hidden = mode !== 'time';
    durField.hidden = mode !== 'duration';
    modeBtn.textContent = mode === 'time' ? 'Não lembro os horários' : 'Informar os horários';
    breaks.setMode(mode === 'time' ? 'time' : 'minutes');
    refresh();
  }

  [dateIn, minIn].forEach(el => el.addEventListener('input', onEdit));
  helper.textContent = 'Digite só os números: 2350 vira 23:50.';

  const node = h('div', { class:'when' },
    h('span', { class:'sr-only', id:clockHelpId, text:CLOCK_SR_HELP }),
    h('div', { class:'when-grid' },
      h('div', { class:'field' }, h('label', { for:dateIn.id, text:'Data' }), dateIn),
      startField, endField, durField),
    h('div', { class:'when-out' }, result, detail, helper, fixBtn, note),
    breaks.node);
  setMode(mode);
  modeBtn.addEventListener('click', () => {
    const f = mode === 'time' ? startF.input : minIn;
    swapIn(f.parentNode); f.focus();
  });

  const date0 = dateIn.value;
  return {
    node, evaluate: () => evaluate(false), refresh, firstField: dateIn,
    /** Algo já foi preenchido aqui? (para a janela não fechar com um clique fora) */
    isDirty: () => dateIn.value !== date0 || (init ? timeTouched() : !!(startF.text || endF.text || breaks.count || mode !== 'time' || minIn.value !== minText0)),
    /** Edição: a pessoa mexeu em horário, duração ou descansos? E na data? */
    timeTouched, dateChanged: () => dateIn.value !== date0
  };
}

/**
 * Contexto da tela para pré-selecionar o registro. Só quando a tela mostra,
 * sem ambiguidade, UMA disciplina (ou um tópico dela): dentro de Disciplinas.
 * Em Hoje, Revisões, Prazos, Análises ou Histórico nada é adivinhado.
 */
function registerContext(){
  if(ui.view !== 'disciplines' || ui.discTab !== 'disciplines') return null;
  const r = resolveDiscNav();
  if(!r.disc || r.disc.archived) return null;
  return { disciplineId: r.disc.id, topicId: (r.topic && !r.topic.archived) ? r.topic.id : null };
}

/**
 * Janela única para começar um estudo ou registrar um que já aconteceu.
 *   openRegisterModal()                    → "Já estudei" (o botão global Registrar estudo)
 *   openRegisterModal({ mode:'timer' })    → "Estudar agora" (os botões Começar a estudar)
 *   preset: { mode, disciplineId, topicId, type, date }
 * Abre SOBRE a tela atual: salvar ou cancelar devolve a pessoa exatamente ao
 * lugar onde ela estava (tela, nível, busca, ordenação e rolagem).
 */
function openRegisterModal(preset){
  const p = (preset && !(preset instanceof Event)) ? preset : {};
  if(!TimerService.isActive && TimerService.storedRunId()){ TimerService.restore(); renderTimerBar(); }   // estudo iniciado em outra aba
  const timerBusy = TimerService.isActive;                 // já há um estudo no cronômetro: só dá para registrar um passado
  /* v6.5 — "Começar a estudar" com um estudo já em andamento não abre mais o
     formulário de registrar (a pessoa pediu para começar e recebia outra coisa):
     ela é levada ao cronômetro que já está contando. */
  if(p.mode === 'timer' && timerBusy){
    toast('Finalize ou descarte o estudo atual para começar outro.', 'info', { title:'Você já está estudando' });
    const bar = $('#timerbar-slot .timerbar');
    if(bar){ revealElement(bar); const b = bar.querySelector('[data-fk="tb-toggle"]'); if(b) b.focus({ preventScroll:true }); }
    return;
  }
  let mode = p.mode === 'timer' ? 'timer' : 'manual';

  const ctx = p.disciplineId ? null : registerContext();
  const wantDisc = p.disciplineId || (ctx && ctx.disciplineId) || null;
  const wantTopic = p.disciplineId ? (p.topicId || null) : (ctx ? ctx.topicId : null);
  const act = activeDisciplines();
  const presetDisc = wantDisc ? getDiscipline(wantDisc) : null;
  // Sem contexto claro, nada é escolhido pela pessoa — a não ser que só exista uma disciplina.
  const discId0 = (presetDisc && !presetDisc.archived) ? presetDisc.id : (act.length === 1 ? act[0].id : '');
  const presetTopic = wantTopic ? getTopic(wantTopic) : null;
  const topicId0 = (presetTopic && !presetTopic.archived && presetTopic.disciplineId === discId0) ? presetTopic.id : '';

  let type = SESSION_TYPES.some(t => t.v === p.type) ? p.type : null;
  const type0 = type;
  let difficulty = null, outcome = null, targetMin = null;
  let saving = false;
  let isDirty = () => false;

  openModal(close => {
    const titleOf = () => mode === 'timer' ? 'Começar a estudar' : 'Registrar estudo';
    const primaryLabel = () => mode === 'timer' ? 'Começar' : 'Registrar estudo';

    /* ---------- estudar agora × já estudei ---------- */
    const modeOpt = (v, ic, title, hint) => h('button', { class:'mode-opt', type:'button', role:'radio', 'data-v':v,
        'aria-checked': mode === v ? 'true' : 'false', onclick:() => setMode(v, true) },
      h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')),
      h('span', { class:'mode-text' }, h('span', { class:'mode-t', text:title }), h('span', { class:'mode-d', text:hint })));
    const modes = h('div', { class:'mode-switch', role:'radiogroup', 'aria-label':'Como você quer registrar' },
      modeOpt('timer', 'i-play', 'Estudar agora', 'O Ciclo conta o tempo enquanto você estuda.'),
      modeOpt('manual', 'i-check', 'Já estudei', 'Guarde um estudo que já aconteceu.'));
    rovingInit(modes);
    const busyNote = h('p', { class:'modal-sub', text:'Há um estudo em andamento no cronômetro. Aqui você registra um estudo que já aconteceu.' });

    /* Todos os campos são criados UMA vez. Trocar de modo só mostra ou esconde
       blocos — nada do que foi escolhido ou digitado se perde. */
    const when = studyWhenFields({ idPrefix:'rm', date:p.date });
    const target = studyTargetFields({ close, idPrefix:'rm', discId:discId0, topicId:topicId0, allowNewDiscipline:true,
      onChange: () => renderOutcome() });
    const typePick = studyTypePicker({ id:'rm-type', value:type, onChange: v => { type = v; renderOutcome(); } });

    /* estudar agora: uma duração de referência, opcional (o cronômetro nunca para sozinho) */
    const goalValues = Array.from(new Set([20, 30, 40, state.settings.defaultSessionMinutes || 40])).sort((a, b) => a - b).slice(0, 4);
    const goalBtns = [null].concat(goalValues).map(v => {
      const b = h('button', { class:'chip', type:'button', 'aria-pressed': targetMin === v ? 'true' : 'false', text: v === null ? 'Livre' : v + ' min' });
      b.addEventListener('click', () => { targetMin = v; goalBtns.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); });
      return b;
    });
    const timerBlock = h('div', { class:'rm-group rm-timer' },
      h('div', { class:'field' },
        h('span', { class:'pick-label', id:'rm-goal-l' }, 'Duração sugerida', h('span', { class:'optional', text:'opcional' })),
        h('div', { class:'chips', role:'group', 'aria-labelledby':'rm-goal-l' }, goalBtns),
        h('p', { class:'hint', text:'É só uma referência. O tempo continua contando até você finalizar — mesmo se recarregar ou fechar a aba — e você descansa quando quiser.' })));

    /* já estudei: como foi */
    const outcomeField = h('div', { class:'field', hidden:true });
    function renderOutcome(){
      const show = mode === 'manual' && type === 'revisao' && !!target.topicId;
      outcomeField.hidden = !show;
      if(!show || outcomeField.firstChild) return;        // já desenhado: a resposta dada continua lá
      outcomeField.append(
        h('label', { text:'Como você se saiu?' }),
        pillGroup(REVIEW_OUTCOMES.map(x => ({ value:x.v, label:x.label })), outcome, v => { outcome = v; }, 'Como você se saiu'),
        h('p', { class:'hint', text:'Isso ajusta quando este tópico volta para revisão.' }));
    }
    const comment = commentField({ id:'rm-comment' });
    /* v6.4.1 — três perguntas, três grupos. "Quando" e "O que você estudou" são
       independentes e ficam lado a lado quando há largura; "Como foi" vem
       depois e reúne tipo, dificuldade e comentário. A ordem no documento é a
       ordem de leitura (e do Tab), em uma ou em duas colunas. */
    const how = howGroup({ id:'rm-g-how', type:typePick.node,
      difficulty: difficultyField('rm', difficulty, v => { difficulty = v; }), outcome:outcomeField, comment:comment.node });
    const howBlock = how.node;
    const whenBlock = h('section', { class:'rm-group rm-when', 'aria-labelledby':'rm-g-when' },
      h('h4', { class:'rm-group-t', id:'rm-g-when', text:'Quando' }), when.node);
    const whatTitle = h('h4', { class:'rm-group-t', id:'rm-g-what', text:'O que você estudou' });
    const whatBlock = h('section', { class:'rm-group rm-what', 'aria-labelledby':'rm-g-what' }, whatTitle, target.node);
    const grid = h('div', { class:'rm-grid' }, whenBlock, whatBlock, howBlock, timerBlock);
    // Já há algo preenchido além do que veio pronto? Então um clique fora da janela não a fecha.
    isDirty = () => when.isDirty() || !!comment.textarea.value.trim() || type !== type0 || difficulty !== null || outcome !== null
      || target.discId !== discId0 || (target.topicId || '') !== topicId0 || targetMin !== null;

    /* 8 horas ou mais: o Ciclo pergunta, não proíbe. Numa subtela — o formulário fica intacto. */
    function confirmLong(w){
      return new Promise(resolve => {
        let settled = false;
        const fix = h('button', { class:'btn ghost', type:'button', text:'Corrigir', onclick:() => finish(false) });
        const finish = (yes) => {
          if(settled) return;
          settled = true;
          close.pop(yes ? primaryBtn : when.firstField);
          resolve(yes);
        };
        const range = w.startedAt ? `${fmtDateBR(w.date)}, das ${fmtClockOfDay(w.startedAt)} às ${fmtClockOfDay(w.endedAt)}${w.nextDay ? ' do dia seguinte' : ''}.` : null;
        close.push({
          title:'Conferir a duração',
          content: h('div',
            h('p', { class:'modal-sub', text: w.startedAt
              ? `Esse intervalo resulta em ${fmtDuration(w.minutes)} de estudo. Está certo?`
              : `São ${fmtDuration(w.minutes)} de estudo. Está certo?` }),
            range ? h('p', { class:'hint', text:range }) : null),
          actions:[ fix, h('button', { class:'btn primary', type:'button', text:'Sim, registrar', onclick:() => finish(true) }) ],
          focus: fix,
          onEsc:() => finish(false)
        });
      });
    }

    const primaryBtn = h('button', { class:'btn primary', type:'button', text: primaryLabel() });
    const setBusy = (on) => {
      primaryBtn.disabled = on;
      if(on) primaryBtn.setAttribute('aria-busy', 'true'); else primaryBtn.removeAttribute('aria-busy');
      primaryBtn.textContent = on && mode === 'manual' ? 'Registrando…' : primaryLabel();
    };
    primaryBtn.addEventListener('click', async () => {
      if(saving) return;
      saving = true;
      try {
        // "Quando" é conferido antes de qualquer gravação: um horário incoerente
        // não deixa uma disciplina recém-digitada criada pela metade do caminho.
        let w = null;
        if(mode === 'manual'){
          w = when.evaluate();
          if(!w.complete){
            if(w.errorEl){ if('value' in w.errorEl) w.errorEl.setAttribute('aria-invalid', 'true'); w.errorEl.focus(); }
            toast(w.error || w.missing, 'err', w.errorTitle ? { title:w.errorTitle } : undefined);
            return;
          }
        } else if(TimerService.isActive){
          toast('Termine o estudo atual antes de começar outro.', 'err', { title:'Você já está estudando' });
          return;
        }

        const discId = await target.ensure();          // cria a disciplina digitada, se for o caso
        if(!discId) return;
        const topicId = target.topicId;

        if(mode === 'timer'){
          // v6.5: só fecha se o cronômetro começou (outra aba pode ter iniciado um estudo neste meio-tempo)
          if(startTimer(discId, topicId, type, null, targetMin)) close();
          return;
        }
        if(w.needsConfirm && !(await confirmLong(w))) return;

        setBusy(true);
        const ok = await saveSession({
          disciplineId:discId, topicId, date:w.date, minutes:w.minutes, breaks:w.breaks,
          startedAt:w.startedAt, endedAt:w.endedAt, type, difficulty,
          comment: comment.value,
          reviewOutcome: (type === 'revisao' && topicId) ? outcome : null
        });
        if(ok){ close(); return; }
        // Falhou: a janela continua aberta com tudo o que foi preenchido.
      } finally {
        saving = false;
        if(!close.isClosed()) setBusy(false);
      }
    });

    function setMode(m, animate){
      if(timerBusy) m = 'manual';
      mode = m;
      $$('.mode-opt', modes).forEach(b => {
        const on = b.dataset.v === mode;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.setAttribute('tabindex', on ? '0' : '-1');
      });
      const manual = mode === 'manual';
      grid.dataset.mode = mode;
      whenBlock.hidden = !manual;
      // "Estudar agora" ainda não tem um "como foi": do grupo, fica só o tipo de estudo
      how.title.hidden = !manual;
      how.row.hidden = !manual;
      if(manual) howBlock.setAttribute('aria-labelledby', how.title.id); else howBlock.removeAttribute('aria-labelledby');
      whatTitle.hidden = !manual;
      if(manual) whatBlock.setAttribute('aria-labelledby', whatTitle.id); else whatBlock.removeAttribute('aria-labelledby');
      timerBlock.hidden = manual;
      primaryBtn.textContent = primaryLabel();
      const t = $('#modal-title'); if(t && close.depth() === 0) t.textContent = titleOf();
      renderOutcome();
      if(animate) swapIn(grid);
    }
    setMode(mode, false);

    return {
      title: titleOf(),
      content: h('div', { class:'rm' }, timerBusy ? busyNote : modes, grid),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        primaryBtn
      ],
      focus: timerBusy ? when.firstField : $('.mode-opt[aria-checked="true"]', modes)
    };
  }, { size:'study', keepOnBackdrop: () => isDirty() });
}

/** "Começar a estudar": a mesma janela, já em "Estudar agora". */
function openQuickStart(preset){
  const p = (preset && !(preset instanceof Event)) ? preset : {};
  openRegisterModal(Object.assign({}, p, { mode:'timer' }));
}

/**
 * Fim do cronômetro. O retrato do estudo é tirado ao abrir (tempo estudado e
 * descansos, com o descanso em curso já fechado) e o cronômetro só é
 * encerrado DEPOIS de gravar: se a pessoa voltar, nada mudou.
 */
function openFinishModal(){
  if(!TimerService.isActive) return;
  const d = TimerService.data;
  const runId = d.runId;                         // v6.5: a identidade deste cronômetro; vira o id do estudo
  const snap = TimerService.snapshot();
  const studyMin = Math.max(1, Math.round(snap.studyMs / 60000));
  const snapBreaks = timerBreaksToSession(snap.breaks);
  let type = d.presetType || null;
  let difficulty = null, outcome = null;
  let method = d.presetMethod || null;
  let methodTouched = !!d.presetMethod;
  let saving = false;

  openModal(close => {
    /* ---------- resumo: estudo e descanso, lado a lado e nunca somados ---------- */
    const minInput = h('input', { type:'number', class:'no-spin', id:'fin-min', min:'1', step:'1', value:String(studyMin), inputmode:'numeric' });
    const breaks = breaksEditor({ idPrefix:'fin', mode:'minutes', breaks:snapBreaks, onChange:() => drawSummary() });
    const studyV = h('span', { class:'fs-v num' });
    const restV = h('span', { class:'fs-v num' });
    const restL = h('span', { class:'fs-l' });
    const restBox = h('div', { class:'fs-item is-rest' }, restV, restL);
    const startedLabel = `${fmtClockOfDay(snap.startedAt)} → ${fmtClockOfDay(snap.endedAt)}`;
    const summary = h('div', { class:'finish-summary', role:'group', 'aria-label':'Resumo do estudo' },
      h('div', { class:'fs-item' }, studyV, h('span', { class:'fs-l', text:'de estudo' })),
      restBox,
      h('p', { class:'fs-clock num', text: startedLabel }));
    const minHuman = h('span', { class:'min-human num', 'aria-live':'polite' });
    /* v6.5 — MODO HORÁRIO × MODO DURAÇÃO. O cronômetro mediu início e fim. Se a
       pessoa corrige o tempo e a conta deixa de fechar com esse intervalo, o
       estudo é guardado só pela duração — e ela fica sabendo antes de registrar. */
    const clockNote = h('p', { class:'hint clock-note', 'aria-live':'polite', hidden:true });
    const startISO = new Date(snap.startedAt).toISOString(), endISO = new Date(snap.endedAt).toISOString();
    function drawSummary(){
      const m = Math.round(Number(minInput.value));
      studyV.textContent = m > 0 ? fmtDurationWords(m) : '—';
      minHuman.textContent = humanMinutesHint(minInput.value);
      const br = breaks.read(null, true);
      const total = br.ok ? br.total : 0, count = br.ok ? br.breaks.length : 0;
      restBox.hidden = !(total > 0);
      restV.textContent = fmtDurationWords(total);
      restL.textContent = 'de descanso' + (count > 1 ? ` · ${count} descansos` : '');
      const fits = !(m > 0) || !br.ok || TimeRules.clockInfo({ minutes:m, breaks:br.breaks, startedAt:startISO, endedAt:endISO }).consistent;
      clockNote.hidden = fits;
      const text = fits ? '' : `Esse tempo não fecha com ${startedLabel}. O estudo será guardado só com a duração, sem o horário.`;
      if(clockNote.textContent !== text) clockNote.textContent = text;
      summary.classList.toggle('is-duration-only', !fits);
    }
    minInput.addEventListener('input', () => { minInput.removeAttribute('aria-invalid'); drawSummary(); });
    const fixToggle = h('summary', null, 'Corrigir o tempo');
    const fix = h('details', { class:'advanced finish-fix' },
      fixToggle,
      h('div', { class:'advanced-body' },
        h('div', { class:'field' }, h('label', { for:'fin-min', text:'Tempo estudado, em minutos' }), minInput,
          h('p', { class:'hint' }, 'Descanso não entra aqui: ele é guardado à parte. ', minHuman)),
        breaks.node,
        clockNote));

    const target = studyTargetFields({ close, idPrefix:'fin', discId:d.disciplineId, topicId:d.topicId || '',
      onChange: () => renderOutcome() });
    const typePick = studyTypePicker({ id:'fin-type', value:type, onChange: v => { type = v; renderOutcome(); } });

    const outcomeField = h('div', { class:'field' });
    function renderOutcome(){
      clear(outcomeField);
      const topic = target.topicId ? getTopic(target.topicId) : null;
      outcomeField.hidden = !(type === 'revisao' && topic);
      if(outcomeField.hidden) return;
      if(!methodTouched) method = ReviewEngine.effectiveMethod(topic).method;
      const sel = h('select', { id:'fin-method' });
      CONCRETE_METHODS.forEach(mv => sel.appendChild(h('option', { value:mv, selected: mv === method }, methodLabel(mv))));
      sel.addEventListener('change', () => { method = sel.value; methodTouched = true; });
      outcomeField.append(
        h('label', { text:'Como você se saiu?' }),
        pillGroup(REVIEW_OUTCOMES.map(x => ({ value:x.v, label:x.label })), outcome, v => { outcome = v; }, 'Como você se saiu'),
        h('p', { class:'hint', text:'Isso ajusta quando este tópico volta para revisão.' }),
        h('label', { for:'fin-method', style:'margin-top:12px', text:'Como você revisou' }),
        sel);
    }
    const comment = commentField({ id:'fin-comment' });
    const how = howGroup({ id:'fin-g-how', type:typePick.node,
      difficulty: difficultyField('fin', difficulty, v => { difficulty = v; }), outcome:outcomeField, comment:comment.node });

    // v6.4.1 — a mesma composição do registro: tempo e conteúdo lado a lado; "Como foi" depois.
    const content = h('div', { class:'rm' },
      h('div', { class:'rm-grid' },
        h('section', { class:'rm-group rm-when', 'aria-labelledby':'fin-g-time' },
          h('h4', { class:'rm-group-t', id:'fin-g-time', text:'Tempo' }), summary, fix),
        h('section', { class:'rm-group rm-what', 'aria-labelledby':'fin-g-what' },
          h('h4', { class:'rm-group-t', id:'fin-g-what', text:'O que você estudou' }), target.node),
        how.node));
    renderOutcome();
    drawSummary();

    const saveBtn = h('button', { class:'btn primary', type:'button', text:'Registrar estudo', onclick: async () => {
      if(saving) return;
      const minutes = Math.round(Number(minInput.value));
      if(!(minutes > 0)){ fix.open = true; minInput.setAttribute('aria-invalid','true'); minInput.focus(); toast('Informe um tempo de estudo válido.', 'err'); return; }
      const br = breaks.read(null, false);
      if(!br.ok){ fix.open = true; if(br.el){ if('value' in br.el) br.el.setAttribute('aria-invalid','true'); br.el.focus(); } toast(br.msg, 'err'); return; }
      saving = true;                                 // v6.5: trava já aqui — `ensure()` é assíncrono e um 2º Enter passaria
      saveBtn.disabled = true; saveBtn.setAttribute('aria-busy','true'); saveBtn.textContent = 'Registrando…';
      const unlock = () => { saving = false; saveBtn.disabled = false; saveBtn.removeAttribute('aria-busy'); saveBtn.textContent = 'Registrar estudo'; };
      const discId = await target.ensure();
      if(!discId){ unlock(); return; }
      const topicId = target.topicId;

      /* v6.5 — este cronômetro ainda é o que está valendo? Outra aba pode ter
         finalizado, descartado ou começado outro estudo. A memória desta aba é
         só uma pista; quem decide é o armazenamento e, no fim, o banco. */
      const stored = TimerService.storedRunId();
      const live = TimerService.isActive && TimerService.data.runId === runId;
      if(!live || (TimerService.persisted && stored !== undefined && stored !== runId)){
        let already = null;
        try { already = await DB.get('sessions', runId); } catch(_){ /* sem leitura: trata como descartado */ }
        if(live) TimerService.release(runId);
        close(); renderTimerBar();
        await safeRefresh();
        if(already) toast('Ele foi finalizado em outra aba. Nada foi gravado de novo.', 'info', { title:'Esse estudo já foi registrado.' });
        else toast('O cronômetro foi encerrado em outra aba sem registrar. Nada foi gravado.', 'info', { title:'Este estudo não está mais em andamento' });
        return;
      }

      /* v6.3 — grava ANTES de encerrar o cronômetro. Se a gravação falhar, o
         cronômetro continua e o modal fica aberto: nenhum minuto se perde.
         v6.4 — a data do estudo é o dia em que ele COMEÇOU; início e fim vêm do
         retrato (o fim é o momento em que a pessoa pediu para finalizar).
         v6.5 — o id do estudo é o runId do cronômetro: o banco aceita UM. */
      const res = await registerStudy({
        disciplineId: discId, topicId, date: dateToISO(new Date(snap.startedAt)),
        minutes, breaks: br.breaks, type, difficulty, comment: comment.value,
        reviewOutcome: (type === 'revisao' && topicId) ? outcome : null,
        reviewMethod: (type === 'revisao' && topicId) ? method : null,
        startedAt: startISO, endedAt: endISO
      }, { timerRunId: runId });
      if(!res.ok && res.reason === 'duplicate'){
        // Já estava no banco (outra aba, ou a página fechou logo depois de gravar): nada é aplicado de novo.
        TimerService.release(runId);
        close(); renderTimerBar();
        await safeRefresh();
        toast('Nada foi gravado de novo.', 'info', { title:'Esse estudo já foi registrado.' });
        return;
      }
      if(!res.ok){ unlock(); return; }
      saving = false;
      TimerService.release(runId);
      close();
      renderTimerBar();
      announce('Estudo finalizado.');
      // se veio de uma sessão de revisão montada, segue para o próximo item
      if(ui.reviewQueue && ui.reviewQueue.length) setTimeout(runNextQueuedReview, 400);
    } });

    return {
      title:'Finalizar estudo',
      content,
      actions:[
        h('button', { class:'btn ghost', type:'button', text: snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando', onclick:() => close() }),
        saveBtn
      ],
      focus: fixToggle          // o primeiro controle: a janela abre no resumo, não no fim do formulário
    };
  }, { size:'study', dismissible:false });
}

/** Sessão esquecida aberta por muito tempo. */
function offerStaleSession(){
  const hours = TimerService.getOpenAgeMs() / 3600000;
  if(hours < 6) return;
  const name = (getDiscipline(TimerService.data.disciplineId) || {}).name || '';
  const resting = TimerService.isOnBreak;
  const text = resting
    ? `O estudo de ${name} está em descanso há ${fmtDuration(Math.round(TimerService.getBreakElapsed() / 60000))}. Talvez o cronômetro tenha ficado ligado sem querer.`
    : `O estudo de ${name} já soma ${fmtDuration(Math.round(TimerService.getElapsed() / 60000))}. Talvez o cronômetro tenha ficado ligado sem querer.`;
  openModal(close => ({
    title:'O cronômetro ficou ligado',
    content: h('div',
      h('p', { class:'modal-sub', text }),
      h('p', { class:'hint', text:'Ao finalizar, em "Corrigir o tempo", você ajusta o tempo de estudo e os descansos antes de registrar.' })
    ),
    actions:[
      h('button', { class:'btn ghost', type:'button', text:'Continuar', onclick:() => close() }),
      h('button', { class:'btn danger', type:'button', text:'Descartar', onclick: async () => { close(); if(TimerService.isActive) TimerService.release(TimerService.data.runId); renderTimerBar(); toast('Nada foi registrado.', 'info', { title:'Tempo descartado' }); } }),
      h('button', { class:'btn primary', type:'button', text:'Finalizar', onclick:() => { close(); openFinishModal(); } })
    ]
  }), { dismissible:false });
}

/* =========================================================================
   v6.5 — TOPIC RECONCILER: o estado derivado de um tópico, num lugar só.

   Um tópico guarda um resumo do próprio histórico: quando foi estudado pela
   primeira e pela última vez, quantas vezes foi revisado, em que pé está a
   revisão. Esse resumo só pode mudar aqui. As funções são PURAS — recebem o
   tópico, os estudos dele e as regras em vigor (`ctx`) e devolvem uma cópia;
   nada lê `state`, nada grava. Quem grava é SessionCommands, na mesma
   transação do estudo.

   POLÍTICA (uma só, para criar, editar, mover e excluir):

     "O estado atual de revisão de um tópico pertence à revisão MAIS RECENTE
      dele. O que aconteceu antes dela é histórico."

   1. Estudo novo, sem revisão anterior mais recente → vale como sempre valeu:
      agenda a primeira revisão ou aplica o resultado ao estado atual.
   2. Revisão registrada com data ANTERIOR à revisão mais recente do tópico →
      entra no histórico e nas contagens ("vezes revisado", "vezes que
      esqueceu"), mas NÃO mexe na próxima revisão, no intervalo, no domínio
      nem na sequência de acertos. O presente não é empurrado para o passado.
   3. Correção (editar, mover, excluir) que NÃO troca a revisão mais recente →
      só datas de primeiro/último estudo e contagens acompanham o histórico.
   4. Correção que troca ou remove a revisão mais recente → o estado é refeito
      a partir do histórico que sobrou:
        · sem nenhum estudo  → tópico "não iniciado", sem revisão marcada;
        · sem nenhuma revisão → volta ao primeiro agendamento, contado do
          estudo mais antigo que sobrou;
        · com revisões → o estado é refeito percorrendo, em ordem, as
          revisões que ficaram no histórico, cada uma com a estratégia que
          estava em vigor quando foi feita (gravada no próprio estudo, em
          `reviewStrategyAtTime`). O resultado é o mesmo tópico que existiria
          se o histórico sempre tivesse sido esse.
          Limites, ditos com clareza: a prioridade usada é a de HOJE (a da
          época não fica gravada), o ajuste por prazo próximo não é refeito
          (prazos mudam), e estudos anteriores à v4 sem estratégia gravada
          usam a estratégia atual. Isso só acontece quando a própria revisão
          mais recente é corrigida — nunca "por tabela" (regras 2 e 3).
   5. Contagens mudam pela DIFERENÇA entre o histórico antes e depois, nunca
      por recontagem do zero: um histórico antigo incompleto não é "consertado"
      em silêncio só porque um estudo foi editado.
   ========================================================================= */
const TopicReconciler = {
  /** Ordem cronológica estável: dia, depois o instante de início/criação, depois o id. */
  order(sessions){
    const key = s => str(s.startedAt) || str(s.createdAt);
    return (sessions || []).slice().sort((a, b) =>
      (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) ||
      (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0) ||
      (str(a.id) < str(b.id) ? -1 : str(a.id) > str(b.id) ? 1 : 0));
  },
  reviewsOf(sessions){ return this.order((sessions || []).filter(s => s && s.reviewOutcome && REVIEW[s.reviewOutcome])); },
  latestReview(sessions){ const r = this.reviewsOf(sessions); return r.length ? r[r.length - 1] : null; },
  bounds(sessions){
    let first = null, last = null;
    (sessions || []).forEach(s => {
      if(!s || !s.date) return;
      if(first === null || s.date < first) first = s.date;
      if(last === null || s.date > last) last = s.date;
    });
    return { first, last };
  },
  sameReview(a, b){
    if(!a && !b) return true;
    if(!a || !b) return false;
    return a.id === b.id && a.date === b.date && a.reviewOutcome === b.reviewOutcome;
  },

  /**
   * Percorre as revisões em ordem e devolve o estado em que o tópico fica depois
   * da última: { interval, cycleStep, mastery, streak }. É a mesma sequência de
   * contas que `afterCreate` faz revisão a revisão — por isso, com o mesmo
   * histórico, chega ao mesmo resultado.
   */
  replay(reviews, ctx){
    const valid = v => REVIEW_STRATEGIES.some(x => x.v === v);
    const first = reviews.length && valid(reviews[0].reviewStrategyAtTime) ? reviews[0].reviewStrategyAtTime : ctx.strategy;
    let interval = ReviewEngine.firstInterval(first), cycleStep = 0, mastery = REVIEW_INITIAL_MASTERY, streak = 0;
    reviews.forEach(s => {
      const next = ReviewEngine.computeNext({
        strategy: valid(s.reviewStrategyAtTime) ? s.reviewStrategyAtTime : ctx.strategy,
        prevInterval: interval, cycleStep, outcome: s.reviewOutcome, intervalModifier: ctx.intervalModifier, deadlineDays: null
      });
      const m = ReviewEngine.nextMastery(mastery, streak, s.reviewOutcome);
      interval = next.interval; cycleStep = next.cycleStep; mastery = m.mastery; streak = m.streak;
    });
    return { interval, cycleStep, mastery, streak };
  },

  /** Tópico sem nenhum estudo: nenhum vestígio de revisão. Configuração (prioridade, estratégia, revisões ligadas) fica. */
  pristine(topic){
    const t = Object.assign({}, topic, {
      firstStudiedAt:null, lastStudiedAt:null,
      reviewDueDate:null, reviewIntervalDays:null, lastReviewedAt:null, reviewRepetitions:0,
      masteryLevel:null, consecutiveSuccessfulReviews:0, reviewCycleStep:0, reviewFailures:0, lastReviewOutcome:null
    });
    delete t.lastReviewMethod;
    return t;
  },

  /**
   * Um estudo NOVO entrou no histórico do tópico.
   * ctx = { strategy, firstInterval, intervalModifier, deadlineDays }
   * → { topic (cópia), effect: 'study' | 'first' | 'applied' | 'historical' }
   */
  afterCreate(topic, session, ctx){
    const t = Object.assign({}, topic);
    const date = session.date;
    let effect = 'study';

    // Primeira revisão: só quando as revisões estão ligadas e nada foi marcado nem feito ainda.
    if(t.reviewEnabled && !t.reviewDueDate && !t.lastReviewedAt){
      t.reviewIntervalDays = ctx.firstInterval;
      t.reviewDueDate = addDaysISO(date, ctx.firstInterval);
      t.masteryLevel = REVIEW_INITIAL_MASTERY;
      t.consecutiveSuccessfulReviews = 0;
      t.reviewRepetitions = 0;
      t.reviewCycleStep = 0;
      effect = 'first';
    }

    const outcome = session.reviewOutcome;
    if(outcome && REVIEW[outcome]){
      if(t.lastReviewedAt && date < t.lastReviewedAt){
        // Regra 2 — revisão do passado: histórico e contagens; o estado atual não muda.
        t.reviewRepetitions = (t.reviewRepetitions || 0) + 1;
        if(outcome === 'forgot') t.reviewFailures = (t.reviewFailures || 0) + 1;
        effect = 'historical';
      } else {
        const next = ReviewEngine.computeNext({
          strategy: ctx.strategy, prevInterval: t.reviewIntervalDays || 1, cycleStep: t.reviewCycleStep,
          outcome, intervalModifier: ctx.intervalModifier, deadlineDays: ctx.deadlineDays
        });
        const m = ReviewEngine.nextMastery(t.masteryLevel, t.consecutiveSuccessfulReviews, outcome);
        t.reviewCycleStep = next.cycleStep;
        t.reviewIntervalDays = next.interval;
        t.masteryLevel = m.mastery;
        t.consecutiveSuccessfulReviews = m.streak;
        t.reviewRepetitions = (t.reviewRepetitions || 0) + 1;
        if(outcome === 'forgot') t.reviewFailures = (t.reviewFailures || 0) + 1;
        t.lastReviewedAt = date;
        t.lastReviewOutcome = outcome;
        t.reviewDueDate = addDaysISO(date, next.interval);
        if(CONCRETE_METHODS.includes(session.reviewMethod)) t.lastReviewMethod = session.reviewMethod;
        effect = 'applied';
      }
    }
    if(!t.firstStudiedAt || date < t.firstStudiedAt) t.firstStudiedAt = date;
    if(!t.lastStudiedAt || date > t.lastStudiedAt) t.lastStudiedAt = date;
    t.updatedAt = nowISO();
    return { topic:t, effect };
  },

  /**
   * O histórico do tópico foi CORRIGIDO (um estudo editado, movido ou excluído).
   * `before` e `after` são os estudos do tópico antes e depois da correção.
   * → { topic (cópia), effect: 'history' | 'reset' | 'reanchored' | 'rescheduled' }
   */
  afterCorrection(topic, before, after, ctx){
    if(!after || !after.length) return { topic: Object.assign(this.pristine(topic), { updatedAt: nowISO() }), effect:'reset' };

    const t = Object.assign({}, topic);
    const b = this.bounds(after);
    t.firstStudiedAt = b.first;
    t.lastStudiedAt = b.last;

    const rb = this.reviewsOf(before), ra = this.reviewsOf(after);
    const forgot = list => list.filter(s => s.reviewOutcome === 'forgot').length;
    t.reviewRepetitions = Math.max(0, (t.reviewRepetitions || 0) + ra.length - rb.length);
    t.reviewFailures = Math.max(0, (t.reviewFailures || 0) + forgot(ra) - forgot(rb));

    const lb = rb.length ? rb[rb.length - 1] : null;
    const la = ra.length ? ra[ra.length - 1] : null;
    let effect = 'history';

    if(this.sameReview(lb, la)){
      if(la){
        // a revisão mais recente é a mesma; só o jeito de revisar pode ter sido corrigido
        if(la.reviewMethod !== lb.reviewMethod && CONCRETE_METHODS.includes(la.reviewMethod)) t.lastReviewMethod = la.reviewMethod;
      } else if(!t.lastReviewedAt && t.reviewEnabled && t.reviewDueDate && isNum(t.reviewIntervalDays)){
        // Sem revisões: o primeiro agendamento nasceu de um estudo. Se esse estudo
        // saiu do histórico (ou mudou de dia), o agendamento passa a contar do mais antigo que sobrou.
        const anchor = addDaysISO(t.reviewDueDate, -t.reviewIntervalDays);
        const had = (before || []).some(s => s.date === anchor), has = after.some(s => s.date === anchor);
        if(had && !has){
          t.reviewIntervalDays = ctx.firstInterval;
          t.reviewDueDate = addDaysISO(b.first, ctx.firstInterval);
          effect = 'reanchored';
        }
      }
    } else if(!la){
      // Não sobrou nenhuma revisão: o tópico volta a "em estudo", com o primeiro agendamento.
      t.lastReviewedAt = null;
      t.lastReviewOutcome = null;
      delete t.lastReviewMethod;
      t.reviewRepetitions = 0;
      t.reviewFailures = 0;
      t.consecutiveSuccessfulReviews = 0;
      t.reviewCycleStep = 0;
      if(t.reviewEnabled){
        t.masteryLevel = REVIEW_INITIAL_MASTERY;
        t.reviewIntervalDays = ctx.firstInterval;
        t.reviewDueDate = addDaysISO(b.first, ctx.firstInterval);
      } else {
        t.masteryLevel = null;
        t.reviewIntervalDays = null;
        t.reviewDueDate = null;
      }
      effect = 'rescheduled';
    } else {
      // A revisão mais recente mudou: o estado é refeito pelas revisões que ficaram (regra 4).
      const r = this.replay(ra, ctx);
      t.masteryLevel = r.mastery;
      t.consecutiveSuccessfulReviews = r.streak;
      t.reviewCycleStep = r.cycleStep;
      t.reviewIntervalDays = r.interval;
      t.lastReviewedAt = la.date;
      t.lastReviewOutcome = la.reviewOutcome;
      t.reviewDueDate = addDaysISO(la.date, r.interval);
      if(CONCRETE_METHODS.includes(la.reviewMethod)) t.lastReviewMethod = la.reviewMethod; else delete t.lastReviewMethod;
      effect = 'rescheduled';
    }
    t.updatedAt = nowISO();
    return { topic:t, effect };
  }
};

/** Regras de revisão em vigor para um tópico (lê `state`: estratégia herdada, prioridade, prazo ligado). */
function reviewContextOf(topic){
  const strategy = ReviewEngine.effectiveStrategy(topic);
  const dl = DeadlineEngine.forTopic(topic);
  return {
    strategy,
    firstInterval: ReviewEngine.firstInterval(strategy),
    intervalModifier: PriorityEngine.reviewIntervalModifier(topic),
    deadlineDays: (dl.specific && dl.days !== null) ? dl.days : null
  };
}

/** Comparação de valores gravados (campos simples e listas/objetos pequenos, como `breaks`). */
function sameStored(a, b){
  if(a === b) return true;
  const empty = v => v === null || v === undefined || v === '';
  if(empty(a) && empty(b)) return true;
  if(typeof a === 'object' && typeof b === 'object' && a && b){
    try { return JSON.stringify(a) === JSON.stringify(b); } catch(_){ return false; }
  }
  return false;
}

/* =========================================================================
   v6.5 — SESSION COMMANDS: todo estudo entra, muda ou sai por aqui.

   Cada comando é UMA transação que lê o estado real do banco, decide e grava
   o estudo e o tópico juntos. Não mexe na tela, não mostra aviso: devolve
   { ok:true, … } ou { ok:false, reason } e quem chamou conversa com a pessoa.

     create(input)                 novo estudo
     finalizeTimer(input, runId)   novo estudo cujo id É a identidade do
                                   cronômetro — o banco recusa o segundo
     update(id, changes, {base})   edição (inclui trocar de tópico/disciplina)
     remove(id)                    exclusão

   reason: 'no-minutes' | 'bad-date' | 'no-discipline' | 'duplicate' |
           'missing' | 'conflict' | 'error'
   ========================================================================= */
const SessionCommands = {
  STORES: ['sessions','topics','disciplines'],

  async create(input, opts){
    const o = opts || {};
    const minutes = Math.max(0, Math.round(Number(input.minutes) || 0));
    if(!(minutes > 0)) return { ok:false, reason:'no-minutes' };
    const date = input.date || todayISO();
    if(!isStrictISODate(date)) return { ok:false, reason:'bad-date' };

    /* Integridade (v6.4): `minutes` é tempo de ESTUDO; descansos ficam à parte.
       v6.5: horário e duração nunca se contradizem no que é gravado. */
    const time = TimeRules.settle({ minutes, breaks: sanitizeBreaks(input.breaks), startedAt: input.startedAt || null, endedAt: input.endedAt || null });
    const session = newSession({
      disciplineId: str(input.disciplineId), topicId: input.topicId || null, date, minutes,
      breaks: sanitizeBreaks(time.breaks), type: input.type || null, difficulty: input.difficulty || null,
      comment: str(input.comment), reviewOutcome: input.reviewOutcome || null, reviewMethod: input.reviewMethod || null,
      reviewStrategyAtTime: null, startedAt: time.startedAt, endedAt: time.endedAt
    });
    if(o.id) session.id = str(o.id);

    try {
      return await DB.atomic(this.STORES, async api => {
        const disc = await api.get('disciplines', session.disciplineId);
        if(!disc) return { ok:false, reason:'no-discipline' };
        if(o.unique){
          const dup = await api.get('sessions', session.id);
          if(dup) return { ok:false, reason:'duplicate', session:dup };
        }
        let topic = session.topicId ? await api.get('topics', session.topicId) : null;
        let topicDropped = false;
        if(session.topicId && (!topic || topic.disciplineId !== session.disciplineId)){
          // o tópico saiu (ou mudou de disciplina) em outra aba: o estudo não some, fica só na disciplina
          session.topicId = null; session.reviewOutcome = null; session.reviewMethod = null;
          topic = null; topicDropped = true;
        }
        let rec = null;
        if(topic){
          const ctx = reviewContextOf(topic);
          // guarda a estratégia vigente para as análises continuarem legíveis depois
          session.reviewStrategyAtTime = ctx.strategy;
          rec = TopicReconciler.afterCreate(topic, session, ctx);
        }
        // `add` recusa um id repetido: é a garantia final de que o mesmo cronômetro não vira dois estudos.
        if(o.unique) await api.add('sessions', session); else api.put('sessions', session);
        if(rec) api.put('topics', rec.topic);
        return { ok:true, session, topic: rec ? rec.topic : null, effect: rec ? rec.effect : null, topicDropped, clockDropped: time.clockDropped };
      });
    } catch(err){
      if(err && err.name === 'ConstraintError') return { ok:false, reason:'duplicate' };
      console.error('Falha ao gravar o estudo:', err);
      return { ok:false, reason:'error', error:err };
    }
  },

  finalizeTimer(input, runId){
    return this.create(input, { id: runId, unique:true });
  },

  /**
   * Edita um estudo. `changes` traz os valores do formulário; `opts.base` é o
   * estudo como estava quando o formulário abriu. Só os campos que a pessoa
   * realmente mudou são gravados — e, se algum deles foi alterado em outra aba
   * nesse meio-tempo, nada é gravado: volta { reason:'conflict', current }.
   * `opts.force` grava mesmo assim (a pessoa viu o aviso e escolheu manter a edição).
   */
  async update(id, changes, opts){
    const o = opts || {};
    try {
      return await DB.atomic(this.STORES, async api => {
        const cur = await api.get('sessions', id);
        if(!cur) return { ok:false, reason:'missing' };
        const base = o.base || cur;
        const keys = Object.keys(changes || {}).filter(k => !sameStored(changes[k], base[k]));
        if(!keys.length) return { ok:true, unchanged:true, session:cur };
        if(o.base && !o.force){
          const clash = keys.filter(k => !sameStored(base[k], cur[k]) && !sameStored(changes[k], cur[k]));
          if(clash.length) return { ok:false, reason:'conflict', current:cur, fields:clash };
        }
        const updated = Object.assign({}, cur);
        keys.forEach(k => { updated[k] = changes[k]; });
        updated.updatedAt = nowISO();
        updated.minutes = Math.max(0, Math.round(Number(updated.minutes) || 0));
        if(!(updated.minutes > 0)) return { ok:false, reason:'no-minutes' };
        if(!isStrictISODate(updated.date)) return { ok:false, reason:'bad-date' };
        updated.breaks = sanitizeBreaks(updated.breaks);

        let clockDropped = false;
        if(keys.some(k => k === 'minutes' || k === 'breaks' || k === 'startedAt' || k === 'endedAt')){
          const time = TimeRules.settle(updated);
          updated.startedAt = time.startedAt; updated.endedAt = time.endedAt; updated.breaks = sanitizeBreaks(time.breaks);
          clockDropped = time.clockDropped;
        }
        // crédito antigo calculado sobre outro tempo/disciplina deixaria de ser verdade: não acompanha a edição
        if('credits' in updated && (updated.minutes !== cur.minutes || updated.disciplineId !== cur.disciplineId)) delete updated.credits;

        const disc = await api.get('disciplines', updated.disciplineId);
        if(!disc) return { ok:false, reason:'no-discipline' };
        // o tópico precisa existir e ser da disciplina do estudo
        let topicNow = updated.topicId ? await api.get('topics', updated.topicId) : null;
        if(!topicNow || topicNow.disciplineId !== updated.disciplineId){ updated.topicId = null; topicNow = null; }
        if(!updated.topicId && cur.topicId){ updated.reviewOutcome = null; updated.reviewMethod = null; }   // a revisão era daquele tópico

        const touchesTopic = ['topicId','date','reviewOutcome','reviewMethod'].some(k => !sameStored(cur[k], updated[k]));
        const effects = [];
        if(touchesTopic){
          if(cur.topicId && cur.topicId === updated.topicId){
            const before = await api.getAllByIndex('sessions', 'topicId', cur.topicId);
            const after = before.map(s => s.id === id ? updated : s);
            const rec = TopicReconciler.afterCorrection(topicNow, before, after, reviewContextOf(topicNow));
            api.put('topics', rec.topic);
            effects.push({ topic:rec.topic, effect:rec.effect, role:'same' });
          } else {
            if(cur.topicId){
              const oldTopic = await api.get('topics', cur.topicId);
              if(oldTopic){
                const before = await api.getAllByIndex('sessions', 'topicId', cur.topicId);
                const rec = TopicReconciler.afterCorrection(oldTopic, before, before.filter(s => s.id !== id), reviewContextOf(oldTopic));
                api.put('topics', rec.topic);
                effects.push({ topic:rec.topic, effect:rec.effect, role:'from' });
              }
            }
            if(topicNow){
              const ctx = reviewContextOf(topicNow);
              if(updated.reviewOutcome) updated.reviewStrategyAtTime = ctx.strategy;
              const rec = TopicReconciler.afterCreate(topicNow, updated, ctx);
              api.put('topics', rec.topic);
              effects.push({ topic:rec.topic, effect:rec.effect, role:'to' });
            }
          }
        }
        api.put('sessions', updated);
        return { ok:true, session:updated, previous:cur, effects, clockDropped };
      });
    } catch(err){
      console.error('Falha ao atualizar o estudo:', err);
      return { ok:false, reason:'error', error:err };
    }
  },

  async remove(id){
    try {
      return await DB.atomic(this.STORES, async api => {
        const cur = await api.get('sessions', id);
        if(!cur) return { ok:true, already:true, effects:[] };
        const effects = [];
        if(cur.topicId){
          const topic = await api.get('topics', cur.topicId);
          if(topic){
            const before = await api.getAllByIndex('sessions', 'topicId', cur.topicId);
            const rec = TopicReconciler.afterCorrection(topic, before, before.filter(s => s.id !== id), reviewContextOf(topic));
            api.put('topics', rec.topic);
            effects.push({ topic:rec.topic, effect:rec.effect, role:'same' });
          }
        }
        api.delete('sessions', id);
        return { ok:true, session:cur, effects };
      });
    } catch(err){
      console.error('Falha ao remover o estudo:', err);
      return { ok:false, reason:'error', error:err };
    }
  }
};

/** O que dizer quando uma correção mexeu (ou não) na agenda de revisão de um tópico. */
function reconcileNote(effects){
  const e = (effects || []).find(x => x.effect && x.effect !== 'history' && x.effect !== 'study');
  if(!e) return '';
  const name = e.topic ? e.topic.name : 'o tópico';
  if(e.effect === 'reset') return `${name} voltou a "não iniciado": não há mais estudos dele.`;
  if(e.effect === 'reanchored' || e.effect === 'rescheduled' || e.effect === 'applied' || e.effect === 'first'){
    return e.topic && e.topic.reviewDueDate
      ? `Próxima revisão de ${name}: ${fmtRelativeFuture(e.topic.reviewDueDate)}.`
      : `A revisão de ${name} foi atualizada.`;
  }
  if(e.effect === 'historical') return `A agenda de ${name} não mudou: ele já tem uma revisão mais recente.`;
  return '';
}

/* =========================================================================
   AÇÕES DE DOMÍNIO — a ponte entre os formulários e os comandos.
   Aqui ficam os avisos na tela; a gravação é de SessionCommands.
   ========================================================================= */
/** Atualiza a tela depois de uma gravação. Se redesenhar falhar, o dado já está salvo: não pedir para repetir. */
async function safeRefresh(){
  try { await refresh(); return true; }
  catch(err){ console.error('Falha ao atualizar a tela depois de gravar:', err); return false; }
}

function sessionFailureToast(reason, action){
  if(reason === 'no-minutes') toast('Informe quanto tempo você estudou.', 'err', { title:'Falta o tempo de estudo' });
  else if(reason === 'bad-date') toast('Escolha uma data válida para o estudo.', 'err', { title:'Data inválida' });
  else if(reason === 'no-discipline') toast('Ela pode ter sido removida em outra aba. Escolha outra disciplina e tente de novo.', 'err', { title:'Disciplina não encontrada' });
  else if(reason === 'missing') toast('Ele pode ter sido removido em outra aba.', 'err', { title:'Estudo não encontrado' });
  else if(action === 'update') toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível salvar a edição' });
  else if(action === 'remove') toast('Tente novamente. O estudo continua no histórico.', 'err', { title:'Não foi possível remover' });
  else toast('Tente novamente. Nada foi perdido.', 'err', { title:'Não foi possível salvar o estudo' });
}

/**
 * Registra um estudo e avisa a pessoa. Devolve o resultado do comando
 * ({ ok, reason, … }). Com `opts.timerRunId`, o estudo é a finalização daquele
 * cronômetro: se ele já foi registrado (outra aba, clique repetido), volta
 * { ok:false, reason:'duplicate' } SEM aviso — quem chamou explica.
 */
async function registerStudy(input, opts){
  const o = opts || {};
  const res = o.timerRunId
    ? await SessionCommands.finalizeTimer(input, o.timerRunId)
    : await SessionCommands.create(input);
  if(!res.ok){
    if(res.reason !== 'duplicate') sessionFailureToast(res.reason, 'create');
    return res;
  }
  await safeRefresh();

  const session = res.session, topic = res.topic;
  const disc = getDiscipline(session.disciplineId);
  const topicName = topic ? topic.name : '';
  if(session.reviewOutcome && topic && res.effect === 'historical'){
    toastRich('Revisão registrada no histórico', [
      topicName,
      ['Você respondeu', reviewOutcomeLabel(session.reviewOutcome)],
      'A agenda de revisão deste tópico não mudou: ele já tem uma revisão mais recente.'
    ], 'info');
  } else if(session.reviewOutcome && topic){
    toastRich('Revisão concluída', [
      topicName,
      ['Você respondeu', reviewOutcomeLabel(session.reviewOutcome)],
      ['Volta a aparecer', topic.reviewDueDate ? fmtRelativeFuture(topic.reviewDueDate) : '—'],
      ['Consolidação estimada', (topic.masteryLevel || '—') + ' de 5']
    ]);
  } else {
    const prog = PlannerEngine.getCurrentWeekProgress();
    const rows = [
      (disc ? disc.name : '') + (topicName ? ' · ' + topicName : ''),
      ['Tempo estudado', fmtDuration(session.minutes)]
    ];
    const restMin = breakMinutesOf(session);
    if(restMin > 0) rows.push(['Descanso', fmtDuration(restMin)]);
    if(prog.plannedTotal > 0) rows.push(['Plano da semana', `${fmtDuration(prog.countedTotal)} de ${fmtDuration(prog.plannedTotal)}`]);
    if(topic && topic.reviewDueDate) rows.push(['Próxima revisão', fmtRelativeFuture(topic.reviewDueDate)]);
    toastRich('Estudo registrado', rows);
  }
  if(res.topicDropped) toast('O tópico escolhido não existe mais. O estudo foi registrado só na disciplina.', 'warn', { title:'Tópico não encontrado' });
  return res;
}

/**
 * Salva um estudo. v6.3: devolve true quando gravou e false quando não — quem
 * chama só fecha o formulário depois de gravar, para nada do que foi digitado
 * se perder.
 */
async function saveSession(input){
  const res = await registerStudy(input);
  return !!res.ok;
}

/**
 * Edita um estudo. Devolve o resultado do comando. Em caso de conflito
 * ({ reason:'conflict' }) nada é gravado e nenhum aviso é mostrado: o
 * formulário mostra a escolha à pessoa.
 */
async function updateSession(id, changes, opts){
  const res = await SessionCommands.update(id, changes, opts);
  if(!res.ok){
    if(res.reason !== 'conflict') sessionFailureToast(res.reason, 'update');
    if(res.reason === 'missing') await safeRefresh();
    return res;
  }
  await safeRefresh();
  if(res.unchanged){ toast('Nada foi alterado.', 'info'); return res; }
  const note = [reconcileNote(res.effects), res.clockDropped ? 'O horário antigo não fechava com a nova duração e deixou de ser guardado.' : ''].filter(Boolean).join(' ');
  toast(note, 'ok', { title:'Estudo atualizado', duration: note ? 5200 : undefined });
  return res;
}

async function deleteSession(id){
  const res = await SessionCommands.remove(id);
  if(!res.ok){ sessionFailureToast(res.reason, 'remove'); return false; }
  await safeRefresh();
  if(res.already){ toast('Ele já tinha sido removido.', 'info', { title:'Estudo removido' }); return true; }
  const note = reconcileNote(res.effects);
  toast(note, 'ok', { title:'Estudo removido do histórico', duration: note ? 5200 : undefined });
  return true;
}

/* =========================================================================
   TELA: HOJE — v6
   Uma pergunta: "O que devo fazer agora?". Uma recomendação em destaque,
   uma ação principal e, abaixo, só o que vem a seguir (revisões, semana,
   prazo). O resto continua a um clique: "Por quê?", "Outras opções".
   ========================================================================= */
function greetingWord(){
  const hr = new Date().getHours();
  return hr < 5 ? 'Boa noite' : hr < 12 ? 'Bom dia' : hr < 18 ? 'Boa tarde' : 'Boa noite';
}
function todayDateLabel(){
  const d = new Date();
  const wd = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'][d.getDay()];
  return `${capFirst(wd)}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

function renderToday(){
  const root = $('#today-body');
  const sub = $('#view-today .page-head .sub');
  if(sub) sub.textContent = todayDateLabel();

  /* Sem nada cadastrado: uma única ação, sem métricas vazias. */
  if(!activeDisciplines().length){
    mount(root, h('div', { class:'today' },
      h('section', { class:'focus-block', 'aria-labelledby':'tf-title' },
        h('p', { class:'tf-eyebrow', text:`${greetingWord()}. Para começar:` }),
        h('h3', { class:'tf-title', id:'tf-title', text:'Adicione algo que você estuda' }),
        h('p', { class:'tf-reason', text:'Pode ser uma matéria, um idioma, uma certificação ou qualquer outra coisa que você queira aprender. Leva alguns segundos.' }),
        h('div', { class:'tf-actions' },
          h('button', { class:'btn primary lg', type:'button', text:'Adicionar o que estou estudando', onclick:() => openDisciplineModal(null) }),
          h('button', { class:'linkbtn', type:'button', text:'Como isso funciona?', onclick:() => openInteractiveGuide('ig-disciplina') }))),
      dailyQuoteCard()));
    return;
  }

  /* Tem disciplina, mas nenhuma sessão: a ação principal é estudar. */
  if(!state.sessions.length){
    mount(root, h('div', { class:'today' },
      h('section', { class:'focus-block', 'aria-labelledby':'tf-title' },
        h('p', { class:'tf-eyebrow', text:`${greetingWord()}. O que vamos estudar?` }),
        h('h3', { class:'tf-title', id:'tf-title', text:'Seu primeiro estudo' }),
        h('p', { class:'tf-reason', text:'Escolha o que vai estudar e por quanto tempo. O Ciclo conta o tempo e registra tudo para você.' }),
        h('div', { class:'tf-actions' },
          h('button', { class:'btn primary lg', type:'button', onclick:() => openQuickStart() }, icon('i-play'), 'Começar a estudar'),
          h('button', { class:'linkbtn muted', type:'button', text:'Como funciona?', onclick:() => openInteractiveGuide('ig-sessao') }))),
      dailyQuoteCard(),
      startGuideCard()));
    return;
  }

  const actions = RecommendationEngine.getNextActions(3);
  mount(root, h('div', { class:'today' },
    todayFocus(actions[0], actions.slice(1)),
    dailyQuoteCard(),       // v6.3: logo abaixo da ação principal, sem competir com ela
    todayNext(),
    todayRhythm(),          // v6.4: constância, discreta e sem cobrança — depois do que há para fazer
    startGuideCard()));
}

/**
 * "Seu ritmo" — em quantos dos últimos 7 dias houve estudo (janela corrida,
 * terminando hoje). É informação, não meta: dia sem estudo aparece neutro e
 * nenhuma sequência é "perdida". Depois de alguns dias sem registros, a frase
 * só constata e convida.
 */
function todayRhythm(){
  const r = recentRhythm(7);
  if(!r.lastStudy) return null;
  let title, sub;
  if(r.daysSinceLast !== null && r.daysSinceLast >= 4){
    title = `Você está há ${r.daysSinceLast} dias sem registrar um estudo.`;
    sub = 'Quando quiser, é só continuar.';
  } else {
    title = r.activeDays === r.days ? `Você estudou em todos os últimos ${r.days} dias.` : `Você estudou em ${r.activeDays} dos últimos ${r.days} dias.`;
    sub = `Seu último estudo foi ${fmtRelativePast(r.lastStudy)}.`;
  }
  const WD = ['D','S','T','Q','Q','S','S'];
  const WD_NAME = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const tISO = todayISO();
  const names = r.strip.filter(x => x.active).map(x => WD_NAME[parseISO(x.iso).getDay()]);
  const strip = h('ol', { class:'rhythm-strip', role:'img',
      'aria-label': names.length ? `Dias com estudo nos últimos ${r.days} dias: ${names.join(', ')}.` : `Nenhum estudo nos últimos ${r.days} dias.` },
    r.strip.map(x => h('li', { class:'rh-day' + (x.active ? ' is-on' : '') + (x.iso === tISO ? ' is-today' : ''), 'aria-hidden':'true' },
      h('span', { class:'rh-dot' }), h('span', { class:'rh-wd', text: WD[parseISO(x.iso).getDay()] }))));
  return h('section', { class:'rhythm-block', 'aria-labelledby':'rh-title' },
    h('h3', { class:'block-label', id:'rh-title', text:'Seu ritmo' }),
    h('div', { class:'rhythm' },
      h('div', { class:'rhythm-text' },
        h('p', { class:'rhythm-t', text:title }),
        h('p', { class:'rhythm-s' }, sub, ' ',
          h('button', { class:'linkbtn muted', type:'button', text:'Ver nas Análises',
            onclick:() => applyAnalyticsQuery({ scopeType:'all', scopeId:null, periodPreset:'30d', focus:'time' }) }))),
      strip));
}

/** A recomendação principal: o quê, por quê (uma frase) e uma ação. */
function todayFocus(top, alts){
  if(!top){
    return h('section', { class:'focus-block', 'aria-labelledby':'tf-title' },
      h('p', { class:'tf-eyebrow', text:`${greetingWord()}. O que vamos estudar?` }),
      h('h3', { class:'tf-title', id:'tf-title', text:'Escolha o que estudar agora' }),
      h('div', { class:'tf-actions' },
        h('button', { class:'btn primary lg', type:'button', onclick:() => openQuickStart() }, icon('i-play'), 'Começar a estudar')));
  }
  const isReview = top.suggestedType === 'revisao';
  const title = top.topic ? top.topic.name : top.discipline.name;
  // Acima do título: a disciplina (quando o foco é um tópico) ou a área — nunca "Sem área".
  const kicker = top.topic ? top.discipline.name : (top.discipline.areaId && getArea(top.discipline.areaId) ? getArea(top.discipline.areaId).name : null);
  return h('section', { class:'focus-block', 'aria-labelledby':'tf-title' },
    h('p', { class:'tf-eyebrow', text:`${greetingWord()}. ${isReview ? 'Hora de revisar.' : 'O que vamos estudar?'}` }),
    kicker ? h('p', { class:'tf-kicker', text: kicker }) : null,
    h('h3', { class:'tf-title', id:'tf-title', text: title }),
    top.reasons.length ? h('p', { class:'tf-reason', text: capFirst(top.reasons[0]) + '.' }) : null,
    h('p', { class:'tf-meta' },
      h('span', { class:'num', text: fmtDuration(top.duration) }), h('span', { text: isReview ? ' de revisão sugeridos' : ' sugeridos' })),
    h('div', { class:'tf-actions' },
      h('button', { class:'btn primary lg', type:'button',
        onclick:() => startTimer(top.discipline.id, top.topic ? top.topic.id : null, top.suggestedType) },
        icon('i-play'), isReview ? 'Começar a revisar' : 'Começar a estudar'),
      h('button', { class:'linkbtn muted', type:'button', text:'Por quê?', onclick:() => explainAction(top) }),
      alts.length ? h('button', { class:'linkbtn muted', type:'button', text:'Outras opções', onclick:() => openAlternatives(alts) }) : null));
}

/** "A seguir": no máximo três linhas — revisões, semana e o próximo prazo. */
function todayNext(){
  const rows = [];
  const due = ReviewEngine.getDueReviews();
  const overdue = due.filter(t => (daysUntilISO(t.reviewDueDate) || 0) < 0).length;
  const revMin = state.settings.defaultReviewMinutes || 20;
  if(due.length){
    rows.push(nextRow({
      label:'Revisões',
      title: due.length === 1 ? 'Você tem 1 revisão hoje' : `Você tem ${due.length} revisões hoje`,
      sub: (overdue ? `${plural(overdue, 'atrasada', 'atrasadas')} · ` : '') + due.slice(0, 2).map(t => t.name).join(', ') + (due.length > 2 ? '…' : ''),
      tone: overdue ? 'attention' : null,
      open:() => setView('reviews'),
      action: h('button', { class:'btn ghost sm', type:'button', text: due.length > 1 ? `Revisar por ${revMin} min` : 'Revisar',
        onclick:() => due.length > 1 ? startQueuedReviewSession(revMin) : startReview(due[0].id) })
    }));
  } else if(state.settings.showUpcomingReviews){
    const soon = ReviewEngine.getUpcomingReviews(7);
    if(soon.length) rows.push(nextRow({
      label:'Próxima revisão', title:`${soon[0].name} ${fmtRelativeFuture(soon[0].reviewDueDate)}`,
      sub: disciplineName(soon[0].disciplineId) + (soon.length > 1 ? ` · mais ${plural(soon.length - 1, 'revisão', 'revisões')} nos próximos 7 dias` : ''),
      open:() => openTopicDrawer(soon[0].id)
    }));
  }

  const prog = PlannerEngine.getCurrentWeekProgress();
  const todayMin = sum(state.sessions.filter(s => s.date === todayISO()), s => s.minutes);
  if(PlannerEngine.activePlan() && prog.plannedTotal > 0){
    const pct = clamp(prog.pct || 0, 0, 999);
    /* v6.5 — a barra mostra o plano CUMPRIDO (por disciplina). O que foi estudado
       além do planejado aparece à parte e não enche a barra. */
    const extraText = prog.extraTotal >= 1 ? ` · ${fmtDuration(prog.extraTotal)} além do plano` : '';
    rows.push(nextRow({
      label:'Semana',
      title:`${fmtDuration(prog.countedTotal)} de ${fmtDuration(prog.plannedTotal)} do plano desta semana`,
      sub: (prog.remainingTotal > 0 ? `Faltam ${fmtDuration(prog.remainingTotal)}` : 'Plano da semana concluído') + extraText + ` · hoje ${fmtDuration(todayMin)}`,
      bar: barWithTip(pct, pct >= 100 ? 'done' : null, 'Semana', [
        ['Planejado', fmtDuration(prog.plannedTotal)], ['Estudado no total', fmtDuration(prog.realizedTotal)],
        ['Dentro do plano', fmtDuration(prog.countedTotal)], ['Além do plano', fmtDuration(prog.extraTotal)],
        ['Falta', fmtDuration(prog.remainingTotal)], ['Plano cumprido', fmtPct(pct)]], 'today-week'),
      value: fmtPct(pct),
      open:() => setView('plan')
    }));
  } else {
    const weekMin = minutesInRange({ start:startOfWeek(today()), end:endOfWeek(today()) });
    rows.push(nextRow({
      label:'Semana',
      title:`${fmtDuration(weekMin)} estudados nesta semana`,
      sub:`hoje ${fmtDuration(todayMin)}`,
      action: h('button', { class:'linkbtn', type:'button', text:'Definir tempo semanal', onclick:() => setView('plan') })
    }));
  }

  const dls = DeadlineEngine.open().filter(dl => { const n = DeadlineEngine.daysLeft(dl); return n !== null && n <= 30; });
  if(dls.length){
    const dl = dls[0];
    const disc = dl.disciplineId ? getDiscipline(dl.disciplineId) : null;
    rows.push(nextRow({
      label:'Prazo',
      title: dl.title,
      sub:[DeadlineEngine.dueText(dl), disc ? disc.name : null].filter(Boolean).join(' · ') + (dls.length > 1 ? ` · +${dls.length - 1} nos próximos 30 dias` : ''),
      tone: DeadlineEngine.isOverdue(dl) ? 'attention' : null,
      open:() => openDeadlineDrawer(dl.id),
      action: dls.length > 1 ? h('button', { class:'linkbtn', type:'button', text:'ver prazos', onclick:() => { ui.discTab = 'deadlines'; setView('disciplines'); } }) : null
    }));
  }

  return h('section', { class:'next-block', 'aria-labelledby':'tn-title' },
    h('h3', { class:'block-label', id:'tn-title', text:'A seguir' }),
    h('ul', { class:'next-list' }, rows));
}

/** Uma linha de "A seguir": rótulo, frase, detalhe e (opcional) uma ação. */
function nextRow(o){
  const main = [
    h('span', { class:'nr-label', text:o.label }),
    h('span', { class:'nr-title', text:o.title }),
    o.sub ? h('span', { class:'nr-sub', text:o.sub }) : null
  ];
  return h('li', { class:'next-row' + (o.tone ? ' tone-' + o.tone : '') },
    o.open ? h('button', { class:'nr-main', type:'button', onclick:o.open }, main) : h('div', { class:'nr-main' }, main),
    o.bar ? h('div', { class:'nr-bar' }, o.bar, o.value ? h('span', { class:'nr-value num', text:o.value }) : null) : null,
    o.action ? h('div', { class:'nr-action' }, o.action) : null);
}

function openAlternatives(alts){
  const body = h('div', null,
    h('p', { class:'drawer-intro', text:'Outras sugestões para agora, na ordem em que fazem sentido.' }),
    h('ul', { class:'line-list' }, alts.map(a => h('li', { class:'line' },
      h('div', { class:'line-main static' },
        h('span', { class:'line-t', text: a.discipline.name + (a.topic ? ' — ' + a.topic.name : '') }),
        h('span', { class:'line-s', text: capFirst(a.reasons[0] || '') })),
      h('button', { class:'btn ghost sm', type:'button', text:'Estudar', 'aria-label':'Estudar ' + a.discipline.name,
        onclick:() => { Drawer.close(); startTimer(a.discipline.id, a.topic ? a.topic.id : null, a.suggestedType); } })))));
  Drawer.open('Outras opções agora', body);
}

function explainAction(action){
  openModal(close => ({
    title:'Por que esta sugestão?',
    content: h('div',
      h('p', { class:'modal-sub', text: `${action.discipline.name}${action.topic ? ' — ' + action.topic.name : ''} foi sugerido porque:` }),
      h('ul', { class:'reasons' }, action.reasons.map(r => h('li', { text:capFirst(r) }))),
      signalGrid(action),
      h('p', { class:'hint', style:'margin-top:14px', text:'A sugestão combina o plano da semana, a prioridade, o tempo desde o último estudo, prazos próximos, revisões pendentes e o quanto cada tópico já está consolidado. Nada é aleatório e nada sai do seu navegador.' })
    ),
    actions:[ h('button', { class:'btn ghost', type:'button', text:'Fechar', onclick:() => close() }) ]
  }));
}

/* =========================================================================
   TELA: REVISÕES — v6
   Uma pergunta: "O que preciso revisar?". Primeiro o que é para agora e a
   ação principal; as próximas revisões ficam numa segunda camada.
   Nenhum número de algoritmo aparece: só motivos em texto.
   ========================================================================= */
function renderReviews(){
  const root = $('#reviews-body');
  const ranked = ReviewEngine.rankedQueue();
  const overdue = ranked.filter(r => r.daysLate > 0);
  const upcoming = ReviewEngine.getUpcomingReviews(14);
  const anyScheduled = ReviewEngine.allScheduled().length > 0;

  if(!anyScheduled){
    mount(root, h('section', { class:'quiet-empty' }, emptyState(
      'Nada para revisar agora',
      'Quando você estuda um tópico com revisões ativadas, ele volta aqui no momento certo — você não precisa agendar nada.',
      h('div', { class:'empty-actions' },
        h('button', { class:'btn primary', type:'button', text:'Ver como funciona', onclick:() => openInteractiveGuide('ig-revisao') }),
        h('button', { class:'btn ghost', type:'button', text:'Adicionar um tópico',
          onclick:() => { const d = activeDisciplines()[0]; if(d) openTopicModal(d.id, null); else setView('disciplines'); } })))));
    return;
  }

  const parts = [];
  const revMin = state.settings.defaultReviewMinutes || 20;
  const n = ranked.length;
  const lead = h('section', { class:'focus-block compact', 'aria-labelledby':'rv-title' },
    h('h3', { class:'tf-title', id:'rv-title', text: n ? (n === 1 ? 'Você tem 1 revisão para agora.' : `Você tem ${n} revisões para agora.`) : 'Nada para revisar agora.' }),
    h('p', { class:'tf-reason', text: n
      ? (overdue.length ? `${plural(overdue.length, 'está atrasada', 'estão atrasadas')}. A lista começa pelo que corre mais risco de ser esquecido.`
                        : (n > 6 ? 'Não precisa fazer todas hoje: escolha um tempo e o Ciclo separa as mais importantes.' : 'Comece pela primeira. O resultado de cada uma ajusta quando ela volta.'))
      : (upcoming.length ? `A próxima é ${upcoming[0].name}, ${fmtRelativeFuture(upcoming[0].reviewDueDate)}.` : 'Os tópicos voltam sozinhos quando chega a hora.') }),
    n ? h('div', { class:'tf-actions' },
      h('button', { class:'btn primary lg', type:'button', onclick:() => startQueuedReviewSession(revMin) }, icon('i-play'), `Revisar por ${revMin} min`),
      h('button', { class:'btn ghost', type:'button', text:'Escolher tempo', onclick:openSessionBuilder }),
      h('button', { class:'linkbtn muted', type:'button', text:'Como funciona?', onclick:openReviewPrimer }))
      : h('div', { class:'tf-actions' }, h('button', { class:'linkbtn muted', type:'button', text:'Como funcionam as revisões?', onclick:openReviewPrimer })),
    ...reviewHints().map(t => h('p', { class:'tf-note', text:t })));
  parts.push(lead);

  const sugestoes = renderDeadlineSuggestions();
  if(sugestoes) parts.push(sugestoes);

  /* v6.2 — com muitas revisões, uma busca SÓ entre elas (agora e próximas).
     A ordem da fila (risco de esquecer) é o sentido da tela: não há "ordenar". */
  const holder = h('div', { class:'coll-results' });
  const st = ui.reviewsSearch = ui.reviewsSearch || { q:'' };
  if(n + upcoming.length >= 6){
    const search = contextSearch({ id:'rv-q', fk:'rv-q', value:st.q, placeholder:'Buscar revisão…', label:'Buscar revisão', holder,
      onInput:(v) => { st.q = v; drawReviewLists(holder, ranked, upcoming, st.q); } });
    parts.push(h('div', { class:'coll-tools' }, search.node));
  } else st.q = '';
  parts.push(holder);
  drawReviewLists(holder, ranked, upcoming, st.q);

  const active = document.activeElement;
  const keep = active && root.contains(active) && active.id === 'rv-q';
  mount(root, h('div', { class:'narrow-screen' }, parts));
  if(keep){ const i = $('#rv-q'); if(i){ i.focus(); const n2 = i.value.length; try { i.setSelectionRange(n2, n2); } catch(_){} } }
}

/** Listas de Revisões (agora + próximas), filtradas pela busca da própria tela. */
function drawReviewLists(holder, ranked, upcoming, query){
  const terms = normalizeText(query).split(' ').filter(Boolean);
  const hit = t => !terms.length || matchesTerms(normalizeText(t.name + ' ' + disciplineName(t.disciplineId)), terms);
  const now = ranked.filter(r => hit(r.topic));
  const later = upcoming.filter(hit);
  const q = terms.length ? query : '';
  clear(holder);
  if(terms.length && !now.length && !later.length){
    holder.append(h('div', { class:'coll-empty' }, h('p', { text:'Nenhuma revisão encontrada.' }),
      h('button', { class:'btn ghost sm', type:'button', text:'Limpar busca', onclick:() => { const i = $('#rv-q'); if(i){ i.value = ''; i.dispatchEvent(new Event('input')); i.focus(); } } })));
    return;
  }
  if(now.length){
    const LIMIT = 8;
    const shown = ui.reviewsShowAll || terms.length ? now : now.slice(0, LIMIT);
    holder.append(h('section', { class:'list-block', 'aria-labelledby':'rv-list' },
      h('h3', { class:'block-label', id:'rv-list', text:'Para revisar agora' }),
      h('ul', { class:'line-list' }, shown.map(e => reviewRow(e, q))),
      !terms.length && now.length > LIMIT ? h('button', { class:'linkbtn', type:'button', text: ui.reviewsShowAll ? 'Mostrar menos' : `Mostrar todas (${now.length})`,
        onclick:() => { ui.reviewsShowAll = !ui.reviewsShowAll; renderReviews(); } }) : null));
  }
  if(later.length){
    const byDay = new Map();
    later.forEach(t => { if(!byDay.has(t.reviewDueDate)) byDay.set(t.reviewDueDate, []); byDay.get(t.reviewDueDate).push(t); });
    const inner = h('div', { class:'disclosure-body' });
    Array.from(byDay.entries()).forEach(([date, list]) => {
      inner.append(h('div', { class:'day-group' },
        h('p', { class:'day-head' }, h('span', { text: capFirst(fmtRelativeFuture(date)) }), h('span', { class:'day-head-s', text: fmtDateBR(date) })),
        h('ul', { class:'line-list' }, list.map(t => h('li', { class:'line' },
          h('button', { class:'line-main', type:'button', onclick:() => openTopicDrawer(t.id) },
            h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name),
            h('span', { class:'line-s', text: disciplineName(t.disciplineId) })),
          h('button', { class:'linkbtn muted', type:'button', text:'antecipar', 'aria-label':'Antecipar revisão de ' + t.name, onclick:() => startReview(t.id) }))))));
    });
    holder.append(h('details', { class:'disclosure', open: !!terms.length },
      h('summary', null, h('span', { text:'Próximas revisões' }), h('span', { class:'disclosure-count', text: terms.length ? plural(later.length, 'encontrada', 'encontradas') : `${later.length} nos próximos 14 dias` })),
      inner));
  }
}

/** Linha da fila: nome, contexto e o principal motivo. Revisar em um clique. */
function reviewRow(entry, query){
  const t = entry.topic;
  const em = ReviewEngine.effectiveMethod(t);
  const minutes = ReviewEngine.estimateMinutes(t, em.method);
  const late = entry.daysLate > 0;
  const why = entry.reasons.find(r => /^você/.test(r)) || entry.reasons.find(r => !/^(atrasada|prevista)/.test(r)) || null;
  return h('li', { class:'line' },
    h('button', { class:'line-main', type:'button', onclick:() => openTopicDrawer(t.id), 'aria-label': `${t.name}: ver tópico` },
      h('span', { class:'line-t' }, typeof query === 'string' && query ? highlightMatch(t.name, query) : t.name),
      h('span', { class:'line-s' },
        `${disciplineName(t.disciplineId)} · ${minutes} min · `,
        h('span', { class: late ? 'is-late' : null, text: late ? `atrasada há ${plural(entry.daysLate, 'dia', 'dias')}` : 'para hoje' })),
      why ? h('span', { class:'line-why', text: capFirst(why) + '.' }) : null),
    h('button', { class:'btn ghost sm', type:'button', text:'Revisar', 'aria-label':'Revisar ' + t.name, onclick:() => startReview(t.id) }));
}

/* =========================================================================
   INICIAR UMA REVISÃO — escolha do método + roteiro curto
   ========================================================================= */
function startReview(topicId, presetMethod){
  const t = getTopic(topicId);
  if(!t){ toast('Tópico não encontrado.', 'err'); return; }
  const em = ReviewEngine.effectiveMethod(t);
  let method = presetMethod && CONCRETE_METHODS.includes(presetMethod) ? presetMethod : em.method;

  openModal(close => {
    const body = h('div');
    const build = () => {
      const guide = ReviewEngine.methodGuide(method);
      const minutes = ReviewEngine.estimateMinutes(t, method);
      clear(body);
      body.append(
        h('p', { class:'modal-sub', text: disciplineName(t.disciplineId) + ' · ' + fmtRelativeFuture(t.reviewDueDate) +
          ' · prioridade ' + PriorityEngine.text(t.priority) + ' · ~' + minutes + ' min' }),
        h('div', { class:'method-box' },
          h('p', { class:'card-title', style:'margin:0 0 4px' }, 'Como revisar: ' + guide.label, helpDot('metodo')),
          h('p', { class:'hint', style:'margin-bottom:8px', text: guide.intro }),
          method === em.method && em.auto ? h('p', { class:'hint', style:'color:var(--brass)', text: em.reason }) : null,
          h('ol', { class:'method-steps' }, guide.steps.map(st => h('li', { text:st }))),
          guide.note ? h('p', { class:'hint', style:'margin-top:8px', text:guide.note }) : null
        ),
        h('div', { class:'field', style:'margin-top:14px' },
          h('label', { text:'Prefere revisar de outro jeito?' }),
          h('div', { class:'chips' }, CONCRETE_METHODS.map(mv =>
            h('button', { class:'chip', type:'button', 'aria-pressed': mv === method ? 'true':'false', text: methodLabel(mv),
              onclick:() => { method = mv; build(); } }))))
      );
    };
    build();

    return {
      title:'Revisar: ' + t.name,
      content: body,
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn ghost', type:'button', text:'Registrar sem cronômetro',
          onclick:() => { close(); openReviewOutcomeModal(t.id, method, ReviewEngine.estimateMinutes(t, method)); } }),
        h('button', { class:'btn primary', type:'button', text:'Começar revisão',
          onclick:() => { if(startTimer(t.disciplineId, t.id, 'revisao', method)) close(); } })
      ]
    };
  }, { size:'wide' });
}

/** Registro direto do resultado, sem passar pelo cronômetro. */
function openReviewOutcomeModal(topicId, method, suggestedMinutes){
  const t = getTopic(topicId);
  if(!t) return;
  let outcome = null;
  openModal(close => {
    const minInput = h('input', { type:'number', id:'ro-min', min:'1', value:String(suggestedMinutes || 10), inputmode:'numeric' });
    return {
      title:'Como foi a revisão?',
      content: h('div',
        h('p', { class:'modal-sub', text: t.name + ' · ' + methodLabel(method) }),
        h('div', { class:'field' }, h('label', { text:'Resultado' }),
          pillGroup(REVIEW_OUTCOMES.map(o => ({ value:o.v, label:o.label })), outcome, v => { outcome = v; })),
        h('div', { class:'field' }, h('label', { for:'ro-min', text:'Tempo gasto (minutos)' }), minInput),
        h('div', { class:'field' }, h('label', { for:'ro-comment', text:'Comentário (opcional)' }), h('textarea', { id:'ro-comment' }))),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn primary', type:'button', text:'Registrar revisão', onclick: once(async () => {
          if(!outcome){ toast('Escolha como foi a revisão.', 'err'); return; }
          const minutes = Math.round(Number(minInput.value));
          if(!(minutes > 0)){ minInput.setAttribute('aria-invalid', 'true'); minInput.focus(); toast('Informe quantos minutos durou a revisão.', 'err'); return; }
          const comment = (($('#ro-comment') || {}).value || '').trim();
          /* v6.5 — SALVAR PRIMEIRO, FECHAR DEPOIS. Antes a janela fechava antes de
             gravar: se a gravação falhasse, o resultado e o comentário se perdiam. */
          const ok = await saveSession({ disciplineId:t.disciplineId, topicId:t.id, date:todayISO(), minutes,
            type:'revisao', reviewOutcome:outcome, reviewMethod:method, comment });
          if(!ok) return;
          close();
          // se veio de uma sessão de revisão montada, segue para o próximo item (como no cronômetro)
          if(ui.reviewQueue && ui.reviewQueue.length) setTimeout(runNextQueuedReview, 400);
        }) })
      ]
    };
  });
}

/* =========================================================================
   MONTAR SESSÃO DE REVISÃO — "quanto tempo você tem agora?"
   ========================================================================= */
function openSessionBuilder(){
  let minutes = 20;
  openModal(close => {
    const preview = h('div');
    const render = () => {
      const plan = ReviewEngine.buildSession(minutes);
      clear(preview);
      if(!plan.items.length){
        preview.append(h('p', { class:'hint', text:'Nenhuma revisão pendente no momento.' }));
        return;
      }
      preview.append(h('p', { class:'card-title', style:'margin-top:6px',
        text:`Revisão de ${plan.totalMinutes} min` }));
      plan.items.forEach(it => preview.append(h('div', { class:'builder-item' },
        h('div', { class:'bi-main' },
          h('div', { class:'bi-name', text: it.topic.name }),
          h('div', { class:'bi-sub', text: disciplineName(it.topic.disciplineId) + ' · ' + it.reasons.slice(0,2).join(' · ') }),
          h('div', { class:'bi-method', text: methodLabel(it.method) })),
        h('span', { class:'num bi-min', text: it.minutes + ' min' }))));
      if(plan.remaining > 0){
        preview.append(h('p', { class:'hint', style:'margin-top:10px',
          text:`Outras ${plan.remaining} revisões continuam na fila para depois. Nada é marcado como concluído sem você revisar.` }));
      }
    };

    const chips = h('div', { class:'chips', style:'margin-bottom:12px' },
      [10,20,30,45].map(v => h('button', { class:'chip', type:'button', 'aria-pressed': v === minutes ? 'true':'false', text: v + ' min',
        onclick:() => { minutes = v; $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed','false'));
                        $$('.chip', chips).find(c => c.textContent === v + ' min').setAttribute('aria-pressed','true');
                        customIn.value = ''; render(); } })));
    const customIn = h('input', { type:'number', id:'sb-custom', min:'5', step:'5', placeholder:'Outro valor', inputmode:'numeric' });
    customIn.addEventListener('input', () => {
      const v = Number(customIn.value);
      if(v >= 5){ minutes = v; $$('.chip', chips).forEach(c => c.setAttribute('aria-pressed','false')); render(); }
    });
    render();

    return {
      title:'Quanto tempo você tem agora?',
      content: h('div',
        chips,
        h('div', { class:'field' }, h('label', { for:'sb-custom', text:'Personalizado (minutos)' }), customIn),
        preview),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn primary', type:'button', text:'Começar', onclick:() => {
          const plan = ReviewEngine.buildSession(minutes);
          if(!plan.items.length){ toast('Nenhuma revisão pendente.', 'err'); return; }
          close();
          ui.reviewQueue = plan.items.map(i => ({ topicId:i.topic.id, method:i.method }));
          runNextQueuedReview();
        } })
      ]
    };
  }, { size:'wide' });
}

/** "Revisar por N minutos": monta a sessão direto, sem passar pelo seletor. */
function startQueuedReviewSession(minutes){
  const plan = ReviewEngine.buildSession(minutes);
  if(!plan.items.length){ toast('Nenhuma revisão pendente agora.', 'info'); return; }
  ui.reviewQueue = plan.items.map(i => ({ topicId:i.topic.id, method:i.method }));
  toast(`${plan.items.length} ${plan.items.length === 1 ? 'revisão' : 'revisões'} · cerca de ${plan.totalMinutes} min. Comece por ${plan.items[0].topic.name}.`, 'info',
    { title:`Revisão de ${minutes} minutos pronta` });
  runNextQueuedReview();
}

/** Encadeia as revisões escolhidas na sessão montada. */
function runNextQueuedReview(){
  if(!ui.reviewQueue || !ui.reviewQueue.length){
    toast('Todas as revisões escolhidas foram registradas.', 'ok', { title:'Revisões concluídas' });
    return;
  }
  const next = ui.reviewQueue.shift();
  const t = getTopic(next.topicId);
  if(!t){ runNextQueuedReview(); return; }
  startReview(t.id, next.method);
}

/* =========================================================================
   "COMO FUNCIONAM AS REVISÕES?" — explicação curta e visual
   ========================================================================= */
function openReviewPrimer(){
  if(!state.meta.reviewPrimerSeen) setMeta('reviewPrimerSeen', true).catch(err => console.error(err));
  const flow = ['Estude um tópico','Tente lembrar depois','Avalie como foi','O Ciclo ajusta a próxima revisão','Repita'];
  const body = h('div',
    h('p', { class:'prose', style:'margin-bottom:14px',
      text:'Revisar é voltar a um conteúdo já estudado para descobrir o que você ainda consegue lembrar. Não é reler: é tentar recuperar antes de conferir.' }),
    h('ol', { class:'flow' }, flow.map(f => h('li', { text:f }))),
    h('div', { class:'two-col', style:'margin-top:18px' },
      h('div', { class:'card elevated' },
        h('p', { class:'card-title', text:'Quando revisar' }),
        h('p', { class:'hint', text:'O Ciclo decide quantos dias esperar até a próxima revisão. Se você lembra bem, o tempo cresce; se esquece, ele encurta.' })),
      h('div', { class:'card elevated' },
        h('p', { class:'card-title', text:'Como revisar' }),
        h('p', { class:'hint', text:'Tentar lembrar, resolver exercícios, explicar em voz alta, escrever de memória… O Ciclo sugere um jeito, e você pode trocar.' }))),
    h('p', { class:'card-title', style:'margin-top:18px', text:'O que significa cada resposta' }),
    h('div', { class:'outcome-grid' },
      h('div', null, h('strong', { text:'Esqueci' }), h('span', { text:'O conteúdo volta amanhã.' })),
      h('div', null, h('strong', { text:'Lembrei com dificuldade' }), h('span', { text:'Volta em poucos dias.' })),
      h('div', null, h('strong', { text:'Lembrei bem' }), h('span', { text:'O tempo até a próxima revisão cresce.' })),
      h('div', null, h('strong', { text:'Dominei' }), h('span', { text:'O tempo até a próxima revisão cresce bastante.' }))),
    h('p', { class:'hint', style:'margin-top:16px', text:'Responder com honestidade é o que faz o sistema funcionar. Marcar "lembrei bem" sem ter lembrado só adia o problema.' }),
    h('div', { class:'row auto', style:'margin-top:16px' },
      h('button', { class:'btn ghost sm', type:'button', text:'O que é revisão?', onclick:() => openStudyGuideDrawer('o-que-e-revisao') }),
      h('button', { class:'btn ghost sm', type:'button', text:'Por que não basta reler?', onclick:() => openStudyGuideDrawer('reconhecer-x-lembrar') }))
  );
  Drawer.open('Como funcionam as revisões', body);
}

/* =========================================================================
   TELA: PLANEJAMENTO
   ========================================================================= */
function ensurePlanDraft(){
  const plan = PlannerEngine.activePlan();
  if(ui.planDraft && ui.planDraft.planId === (plan ? plan.id : null)) return ui.planDraft;
  const discs = activeDisciplines().slice().sort(sortByName);
  const existing = new Map((plan ? plan.allocations : []).map(a => [a.disciplineId, a]));
  ui.planDraft = {
    planId: plan ? plan.id : null,
    baseUpdatedAt: plan ? (plan.updatedAt || null) : null,   // v6.5: para notar se o plano mudou em outra aba

    name: plan ? plan.name : 'Meu plano',
    availableMinutes: plan ? plan.weeklyAvailableMinutes : 300,
    allocations: discs.map(d => {
      const a = existing.get(d.id);
      return {
        disciplineId: d.id,
        priority: a ? a.priority : d.priority,
        minWeeklyMinutes: a ? a.minWeeklyMinutes : 0,
        targetMinutes: a ? a.targetMinutes : 0
      };
    })
  };
  return ui.planDraft;
}

function renderPlan(){
  const root = $('#plan-body');
  const parts = [];
  const plan = PlannerEngine.activePlan();

  if(!activeDisciplines().length){
    mount(root, h('section', { class:'quiet-empty' }, emptyState('Cadastre disciplinas primeiro',
      'O planejamento distribui seu tempo semanal entre o que você estuda.',
      h('button', { class:'btn primary', type:'button', text:'Ir para Disciplinas', onclick:() => setView('disciplines') }))));
    return;
  }

  /* sem plano ainda: uma pergunta, uma sugestão, um botão. */
  if(!plan && !ui.planExpanded){
    mount(root, h('div', { class:'narrow-screen' },
      h('section', { class:'focus-block', 'aria-labelledby':'pl-q' },
        h('p', { class:'tf-eyebrow', text:'Organizar a semana' }),
        h('h3', { class:'tf-title', id:'pl-q', text:'Quanto tempo você tem por semana?' }),
        h('p', { class:'tf-reason', text:'O Ciclo divide esse tempo entre o que você estuda e passa a mostrar quanto falta. Você pode estudar sem plano — ele só torna as sugestões melhores.' }),
        (() => {
          const chips = h('div', { class:'an-chips', role:'group', 'aria-label':'Horas por semana' });
          [2,5,10].forEach(hrs => chips.append(h('button', { class:'an-chip', type:'button', text: hrs + ' h', onclick:() => createSimplePlan(hrs * 60) })));
          chips.append(h('button', { class:'an-chip', type:'button', text:'Outro valor', onclick:() => { ui.planExpanded = true; renderPlan(); } }));
          return chips;
        })(),
        h('div', { class:'tf-actions' },
          h('button', { class:'linkbtn muted', type:'button', text:'Para que serve o planejamento?', onclick:() => openInteractiveGuide('ig-plano') })))));
    return;
  }

  if(plan && !ui.planEditing){ mount(root, planOverview(plan)); return; }

  const draft = ensurePlanDraft();

  /* --- disponibilidade --- */
  const availInput = h('input', { type:'number', id:'plan-avail-h', min:'0', step:'0.5', inputmode:'decimal',
    value: String(Math.round((draft.availableMinutes / 60) * 100) / 100) });
  availInput.addEventListener('input', () => {
    const hours = Number(availInput.value);
    draft.availableMinutes = Math.max(0, Math.round((isFinite(hours) ? hours : 0) * 60));
    updateTotals();
  });

  const nameInput = h('input', { type:'text', id:'plan-name', value: draft.name, maxlength:'60' });
  nameInput.addEventListener('input', () => { draft.name = nameInput.value; });

  parts.push(h('section', { class:'edit-block' },
    h('div', { class:'edit-head' },
      h('h3', { class:'block-label', text: plan ? 'Ajustar plano' : 'Novo plano' }),
      h('button', { class:'btn ghost sm', type:'button', text: plan ? 'Cancelar' : 'Voltar',
        onclick:() => { ui.planEditing = false; ui.planExpanded = false; ui.planDraft = null; renderPlan(); } })),
    h('div', { class:'row' },
      h('div', { class:'field' }, h('label', { for:'plan-name', text:'Nome do plano' }), nameInput),
      h('div', { class:'field' }, h('label', { for:'plan-avail-h' }, 'Horas por semana', helpDot('disponibilidade')), availInput,
        h('p', { class:'hint', text:'Quanto tempo você pretende dedicar aos estudos por semana.' }))
    ),
    h('div', { class:'row auto' },
      h('button', { class:'btn ghost sm', type:'button', text:'Distribuir automaticamente', title:'Respeita mínimos, divide o resto por prioridade e fecha no total exato.', onclick:() => {
        const res = PlannerEngine.generatePlan(draft.availableMinutes, draft.allocations);
        draft.allocations = res.allocations;
        renderPlan();
        if(res.conflict) toast(`Seus mínimos ultrapassam a disponibilidade em ${fmtDuration(res.conflict.excess)}. Os valores foram reduzidos proporcionalmente.`, 'err');
        else toast('Distribuição gerada.', 'ok');
      } })
    )
  ));

  /* --- alocações --- */
  const allocCard = h('section', { class:'edit-block' });
  allocCard.append(h('div', { class:'card-head' },
    h('p', { class:'card-title', text:'Distribuição semanal', style:'margin:0' }),
    h('span', { class:'hint', text:'Edite qualquer valor livremente.' })));
  allocCard.append(h('div', { class:'alloc-head' },
    h('span', { text:'Disciplina' }),
    h('span', null, 'Prioridade', helpDot('prioridade')),
    h('span', null, 'Mínimo', helpDot('minimo')),
    h('span', { text:'Planejado' })));

  const totalEl = h('span', { class:'at-v' });
  const diffEl = h('p', { class:'hint', style:'margin:0' });

  function updateTotals(){
    const total = sum(draft.allocations, a => Number(a.targetMinutes) || 0);
    totalEl.textContent = `${fmtDuration(total)} / ${fmtDuration(draft.availableMinutes)}`;
    const d = total - draft.availableMinutes;
    if(d === 0) diffEl.textContent = 'O planejado bate exatamente com a disponibilidade.';
    else if(d > 0) diffEl.textContent = `${fmtDuration(d)} acima da disponibilidade.`;
    else diffEl.textContent = `${fmtDuration(-d)} ainda não distribuídos.`;
    diffEl.style.color = d > 0 ? 'var(--brass)' : '';
    const mins = sum(draft.allocations, a => Number(a.minWeeklyMinutes) || 0);
    if(mins > draft.availableMinutes){
      diffEl.textContent += `  ·  Seus mínimos somam ${fmtDuration(mins)}, ${fmtDuration(mins - draft.availableMinutes)} acima da disponibilidade.`;
      diffEl.style.color = 'var(--danger)';
    }
  }

  draft.allocations.forEach(a => {
    const disc = getDiscipline(a.disciplineId);
    if(!disc) return;
    const prioSel = h('select', { 'aria-label': 'Prioridade de ' + disc.name });
    [1,2,3,4,5].forEach(p => prioSel.appendChild(h('option', { value:String(p), selected: p === a.priority }, `${p} — ${PRIORITY_LABELS[p]}`)));
    prioSel.addEventListener('change', () => { a.priority = Number(prioSel.value); });

    const minIn = h('input', { type:'number', min:'0', step:'5', inputmode:'numeric', value:String(a.minWeeklyMinutes), 'aria-label':'Mínimo semanal de ' + disc.name });
    minIn.addEventListener('input', () => { a.minWeeklyMinutes = Math.max(0, Math.round(Number(minIn.value) || 0)); updateTotals(); });

    const tgtIn = h('input', { type:'number', min:'0', step:'5', inputmode:'numeric', value:String(a.targetMinutes), 'aria-label':'Minutos planejados de ' + disc.name });
    tgtIn.addEventListener('input', () => { a.targetMinutes = Math.max(0, Math.round(Number(tgtIn.value) || 0)); updateTotals(); });

    allocCard.append(h('div', { class:'alloc-row' },
      h('div', { class:'ar-id' }, h('div', { class:'ar-name', text:disc.name }), h('div', { class:'ar-area', text:areaNameOf(disc) })),
      h('div', null, h('label', { class:'sr-only', text:'Prioridade' }), prioSel),
      h('div', null, h('label', { class:'sr-only', text:'Mínimo (min)' }), minIn),
      h('div', null, h('label', { class:'sr-only', text:'Planejado (min)' }), tgtIn)
    ));
  });

  allocCard.append(h('div', { class:'alloc-total' },
    h('div', null, h('p', { class:'card-title', text:'Total planejado', style:'margin:0 0 2px' }), totalEl),
    diffEl));
  allocCard.append(h('div', { class:'row auto', style:'margin-top:14px' },
    // v6.3: once() — um duplo clique não grava duas vezes (antes podia criar dois planos ativos)
    h('button', { class:'btn primary', type:'button', text:'Salvar plano', onclick: once(() => savePlanDraft(false)) }),
    h('button', { class:'btn ghost', type:'button', text:'Salvar e aplicar nesta semana', onclick: once(() => savePlanDraft(true)) })
  ));
  updateTotals();
  const ph = planHints(draft);
  if(ph.length) allocCard.append(hintBox(ph));
  parts.push(allocCard);

  mount(root, h('div', { class:'narrow-screen wide' }, parts));
}

/** Planejamento em leitura: quanto tempo, como está dividido e como vai a semana. */
function planOverview(plan){
  const prog = PlannerEngine.getCurrentWeekProgress();
  const pct = prog.plannedTotal > 0 ? clamp(prog.pct || 0, 0, 999) : null;
  const head = h('section', { class:'focus-block compact', 'aria-labelledby':'pl-title' },
    h('p', { class:'tf-eyebrow', text: plan.name && plan.name !== 'Meu plano' ? `Plano: ${plan.name}` : 'Seu tempo semanal' }),
    h('h3', { class:'tf-title', id:'pl-title' }, h('span', { class:'num', text: fmtDuration(plan.weeklyAvailableMinutes) }), ' por semana'),
    pct !== null ? h('div', { class:'tf-progress' },
      h('p', { class:'tf-reason', text:`Nesta semana: ${fmtDuration(prog.countedTotal)} de ${fmtDuration(prog.plannedTotal)} do plano` + (prog.remainingTotal > 0 ? ` · faltam ${fmtDuration(prog.remainingTotal)}` : ' · plano concluído')
        + (prog.extraTotal >= 1 ? ` · ${fmtDuration(prog.extraTotal)} além do plano` : '') }),
      h('div', { class:'nr-bar' }, progressBar(pct, pct >= 100 ? 'done' : null, 'plan-week'), h('span', { class:'nr-value num', text: fmtPct(pct) }))) : null,
    h('div', { class:'tf-actions' },
      h('button', { class:'btn primary', type:'button', text:'Ajustar', onclick:() => { ui.planEditing = true; ui.planDraft = null; renderPlan(); } }),
      h('button', { class:'linkbtn muted', type:'button', text: state.plans.length > 1 ? `Seus planos (${state.plans.length})` : 'Criar outro plano', onclick: openPlansDrawer })));

  const rows = prog.perDiscipline.length ? prog.perDiscipline.map(x => ({ id:x.disciplineId, planned:x.planned, realized:x.realized }))
    : (plan.allocations || []).map(a => ({ id:a.disciplineId, planned:a.targetMinutes || 0,
        realized: minutesInRange({ start:startOfWeek(today()), end:endOfWeek(today()) }, a.disciplineId) }));
  const list = h('ul', { class:'alloc-list' });
  rows.filter(r => getDiscipline(r.id) && (r.planned > 0 || r.realized > 0)).sort((a,b) => b.planned - a.planned).forEach(r => {
    const d = getDiscipline(r.id);
    const p = r.planned > 0 ? (r.realized / r.planned) * 100 : 0;
    list.append(h('li', { class:'alloc-line' },
      h('span', { class:'al-name' }, h('span', { class:'al-t', text:d.name }), h('span', { class:'al-s', text:areaNameOf(d) })),
      h('span', { class:'al-bar' }, barWithTip(p, p >= 100 ? 'done' : null, d.name, [
        ['Planejado', fmtDuration(r.planned)], ['Realizado', fmtDuration(r.realized)],
        ['Restante', fmtDuration(Math.max(0, r.planned - r.realized))]])),
      h('span', { class:'al-v num', text: `${fmtDuration(r.realized)} / ${fmtDuration(r.planned)}` })));
  });
  return h('div', { class:'narrow-screen' },
    head,
    h('section', { class:'list-block', 'aria-labelledby':'pl-div' },
      h('h3', { class:'block-label', id:'pl-div' }, 'Divisão desta semana', helpDot('planosemana')),
      list,
      h('p', { class:'block-note', text:'Cada semana guarda o próprio registro: ajustar o plano não reescreve semanas que já passaram.' })));
}

/** Lista de planos (ativar, excluir, criar) — fora do caminho principal. */
function openPlansDrawer(){
  const body = h('div', null,
    h('p', { class:'drawer-intro', text:'Só um plano fica ativo por vez. Trocar de plano não altera as semanas já registradas.' }),
    h('ul', { class:'line-list' }, state.plans.slice().sort((a,b) => str(a.createdAt).localeCompare(str(b.createdAt))).map(p => h('li', { class:'line' },
      h('div', { class:'line-main static' },
        h('span', { class:'line-t', text:p.name }),
        h('span', { class:'line-s', text: `${fmtDuration(p.weeklyAvailableMinutes)} por semana · ${plural(p.allocations.length, 'disciplina', 'disciplinas')}` })),
      p.active ? h('span', { class:'state-tag', text:'ativo' })
        : h('span', { class:'row-actions' },
            h('button', { class:'btn ghost sm', type:'button', text:'Ativar', onclick:() => { Drawer.close(); activatePlan(p.id); } }),
            h('button', { class:'linkbtn danger', type:'button', text:'excluir', onclick:() => { Drawer.close(); deletePlan(p.id); } }))))),
    h('div', { class:'row auto', style:'margin-top:16px' },
      h('button', { class:'btn ghost sm', type:'button', onclick:() => { Drawer.close(); openNewPlanModal(); } }, icon('i-plus'), 'Novo plano')));
  Drawer.open('Seus planos', body);
}

/**
 * v5 — cria um plano a partir de uma única escolha (horas na semana) e mostra
 * a divisão sugerida antes de confirmar. Nenhuma outra decisão é exigida.
 */
function createSimplePlan(minutes){
  const discs = activeDisciplines();
  if(!discs.length){
    toast('Adicione o que você estuda antes de organizar a semana.', 'err');
    setView('disciplines');
    return;
  }
  const res = PlannerEngine.generatePlan(minutes, discs.map(d => ({
    disciplineId:d.id, priority:d.priority, minWeeklyMinutes:0
  })));

  openModal(close => ({
    title:'O Ciclo sugere esta divisão',
    content: h('div',
      h('p', { class:'modal-sub', text:`${fmtDuration(minutes)} por semana, distribuídas conforme a atenção que cada uma merece.` }),
      h('div', { class:'plan-preview' },
        res.allocations.map(a => {
          const d = getDiscipline(a.disciplineId);
          return h('div', { class:'demo-row' },
            h('div', null, h('div', { text: d ? d.name : '' }),
              h('div', { class:'hint', text: d ? 'Prioridade ' + PriorityEngine.text(d.priority) : '' })),
            h('span', { class:'num', text: fmtDuration(a.targetMinutes) }));
        })),
      h('p', { class:'hint', style:'margin-top:12px', text:'Isso é apenas uma sugestão. Você pode ajustar qualquer valor depois, quando quiser.' })),
    actions:[
      h('button', { class:'btn ghost', type:'button', text:'Ajustar', onclick:() => {
        close(); ui.planExpanded = true;
        ui.planDraft = { planId:null, name:'Meu plano', availableMinutes:minutes, allocations:res.allocations.map(a => ({ ...a })) };
        renderPlan();
      } }),
      h('button', { class:'btn primary', type:'button', text:'Usar esta divisão', onclick: once(async () => {
        // v6.5: grava primeiro, fecha depois; nada na memória muda antes de o banco confirmar
        const plan = newPlan('Meu plano', minutes);
        plan.allocations = res.allocations;
        try { await PlanCommands.saveActive(plan); }
        catch(err){
          console.error('Falha ao criar o plano:', err);
          toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível salvar o plano' });
          return;
        }
        close();
        ui.planDraft = null; ui.planExpanded = false;
        await safeRefresh();
        toast(`${fmtDuration(minutes)} por semana. A tela Hoje já usa esse plano.`, 'ok', { title:'Semana organizada' });
      }) })
    ]
  }), { size:'wide' });
}

let planSaveRunning = false;
async function savePlanDraft(applyToCurrentWeek){
  // Os dois botões de salvar compartilham esta trava: clicar em um e depois no
  // outro, rápido, não produz duas gravações concorrentes.
  if(planSaveRunning) return;
  const draft = ui.planDraft;
  if(!draft) return;
  planSaveRunning = true;
  try {
    const total = sum(draft.allocations, a => Number(a.targetMinutes) || 0);
    if(total > draft.availableMinutes){
      const ok = await confirmModal(
        `O total planejado (${fmtDuration(total)}) passa da sua disponibilidade (${fmtDuration(draft.availableMinutes)}). Salvar assim mesmo?`,
        { confirmLabel:'Salvar assim mesmo', danger:false });
      if(!ok) return;
    }

    /* v6.3 — tudo numa transação e sobre CÓPIAS: se a gravação falhar, nem o
       banco nem a memória ficam com um plano desativado pela metade. */
    const current = PlannerEngine.activePlan();
    const plan = current ? Object.assign({}, current) : newPlan(draft.name, draft.availableMinutes);
    plan.name = str(draft.name).trim() || 'Meu plano';
    plan.weeklyAvailableMinutes = draft.availableMinutes;
    plan.allocations = draft.allocations.map(a => ({ ...a }));
    plan.active = true;
    plan.updatedAt = nowISO();

    let wp = null;
    if(applyToCurrentWeek){
      const ws = dateToISO(startOfWeek(today()));
      wp = {
        id: ws, weekStart: ws, weekEnd: dateToISO(endOfWeek(today())),
        basePlanId: plan.id, availableMinutes: plan.weeklyAvailableMinutes,
        allocations: plan.allocations.map(a => ({ ...a })),
        createdAt: nowISO(), updatedAt: nowISO()
      };
    }

    try {
      // v6.5: os outros planos ativos são desativados DENTRO da transação, lidos do banco
      const base = current ? { baseUpdatedAt: draft.baseUpdatedAt } : {};
      let res = await PlanCommands.saveActive(plan, wp, base);
      if(!res.ok && res.reason === 'conflict'){
        const keep = await confirmModal('Este plano foi alterado em outra aba enquanto você editava. Salvar a sua versão por cima dessa alteração?',
          { title:'Os dados mudaram em outra aba.', confirmLabel:'Salvar a minha versão', cancelLabel:'Voltar', danger:false });
        if(!keep) return;
        res = await PlanCommands.saveActive(plan, wp, { force:true });
      }
      if(!res.ok) throw new Error('plano não gravado: ' + res.reason);
    } catch(err){
      console.error('Falha ao salvar o plano:', err);
      toast('Tente novamente. Seu plano anterior continua valendo.', 'err', { title:'Não foi possível salvar o plano' });
      return;
    }

    ui.planDraft = null;
    ui.planEditing = false;
    await safeRefresh();
    toast(applyToCurrentWeek ? 'Já vale para esta semana.' : 'Vale a partir da próxima semana. Para usar agora, escolha "Salvar e aplicar nesta semana".', 'ok',
      { title:'Plano salvo' });
  } finally {
    planSaveRunning = false;
  }
}

function openNewPlanModal(){
  openModal(close => {
    const nameIn = h('input', { type:'text', id:'np-name', placeholder:'Ex.: Preparação CCNA', maxlength:'60' });
    const hoursIn = h('input', { type:'number', id:'np-hours', min:'0.5', step:'0.5', value:'5', inputmode:'decimal' });
    return {
      title:'Novo plano',
      content: h('div',
        h('div', { class:'field' }, h('label', { for:'np-name', text:'Nome' }), nameIn),
        h('div', { class:'field' }, h('label', { for:'np-hours', text:'Horas por semana' }), hoursIn),
        h('p', { class:'hint', text:'O novo plano fica ativo e usa suas disciplinas atuais. Semanas já registradas não mudam.' })
      ),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn primary', type:'button', text:'Criar', onclick: once(async () => {
          const minutes = Math.round((Number(hoursIn.value) || 0) * 60);
          if(minutes <= 0){ hoursIn.setAttribute('aria-invalid', 'true'); hoursIn.focus(); toast('Informe as horas por semana.', 'err'); return; }
          const plan = newPlan(nameIn.value, minutes);
          const res = PlannerEngine.generatePlan(minutes, activeDisciplines().map(d => ({ disciplineId:d.id, priority:d.priority, minWeeklyMinutes:0 })));
          plan.allocations = res.allocations;
          // v6.5: grava primeiro, fecha depois — se falhar, o formulário continua aberto e o plano atual continua valendo
          try { await PlanCommands.saveActive(plan); }
          catch(err){
            console.error('Falha ao criar o plano:', err);
            toast('Tente novamente. Seu plano atual continua valendo.', 'err', { title:'Não foi possível criar o plano' });
            return;
          }
          close();
          ui.planDraft = null;
          await safeRefresh();
          toast(`${plan.name} · ${fmtDuration(minutes)} por semana.`, 'ok', { title:'Plano criado e ativado' });
        }) })
      ]
    };
  });
}

async function activatePlan(id){
  let res;
  try { res = await PlanCommands.activate(id); }
  catch(err){
    console.error('Falha ao ativar o plano:', err);
    toast('Tente novamente. O plano ativo não mudou.', 'err', { title:'Não foi possível ativar o plano' });
    return;
  }
  ui.planDraft = null;
  await safeRefresh();
  if(!res.ok) toast('Ele foi excluído em outra aba.', 'info', { title:'Este plano não existe mais' });
  else toast('Plano ativado.', 'ok');
}
async function deletePlan(id){
  const ok = await confirmModal('Excluir este plano? As semanas já registradas continuam com os valores históricos delas.', { confirmLabel:'Excluir' });
  if(!ok) return;
  try { await PlanCommands.remove(id); }
  catch(err){
    console.error('Falha ao excluir o plano:', err);
    toast('Tente novamente. O plano continua aqui.', 'err', { title:'Não foi possível excluir o plano' });
    return;
  }
  ui.planDraft = null;
  await safeRefresh();
  toast('Plano excluído.');
}

/* =========================================================================
   v6.1 — PRIORIDADE: UMA LINGUAGEM VISUAL PARA 1–5
   Disciplina, Tópico e Prazo usam o mesmo símbolo: cinco hastes em escada.
   A QUANTIDADE preenchida é o nível — a leitura nunca depende de cor (a cor
   só reforça os níveis 4 e 5). Todo nível existe e aparece, inclusive o 1.
   Três formas, uma linguagem:
     · priorityMark(p, {compact})  leitura (lista: só as hastes; detalhe: + "3 · Média")
     · priorityInline({...})       edição direta no detalhe (as hastes são os botões)
     · priorityPicker({...})       seletor dos formulários
   ========================================================================= */
function priorityText(p){ const v = PriorityEngine.clamp(p); return `${v} · ${PRIORITY_LABELS[v]}`; }

/** As cinco hastes. `level` controla quantas ficam preenchidas. */
function priorityGlyph(level){
  const v = PriorityEngine.clamp(level);
  return h('span', { class:'prio-glyph', 'aria-hidden':'true', dataset:{ level:String(v) } },
    [1,2,3,4,5].map(i => h('i', { class: i <= v ? 'on' : null })));
}
/** Atualiza as hastes no lugar — é o que permite preencher/esvaziar com transição. */
function setPriorityGlyph(glyph, level){
  if(!glyph) return;
  const v = PriorityEngine.clamp(level);
  glyph.dataset.level = String(v);
  Array.from(glyph.children).forEach((bar, i) => bar.classList.toggle('on', i < v));
}

/** Indicador de leitura. Compacto nas listas; completo ("3 · Média") nos detalhes. */
function priorityMark(p, opts){
  const v = PriorityEngine.clamp(p);
  const o = opts || {};
  const label = `Prioridade ${priorityText(v)}`;
  return h('span', { class:'prio-mark p' + v + (o.compact ? ' is-compact' : ''), role:'img', 'aria-label':label, title: o.compact ? label : null },
    priorityGlyph(v),
    o.compact ? null : h('span', { class:'prio-mark-t', 'aria-hidden':'true', text: priorityText(v) }));
}
/** Nome antigo, mantido para as chamadas existentes (Ajuda, Análises, Prazos). */
function priorityChip(p, opts){ return priorityMark(p, { compact: !!(opts && opts.compact) }); }

function priorityPicker(opts){
  const o = opts || {};
  let value = PriorityEngine.clamp(o.value);
  const labelId = (o.id || 'prio') + '-label';
  const wrap = h('div', { class:'prio-picker', id: o.id || null });
  const group = h('div', { class:'prio-options', role:'radiogroup', 'aria-labelledby': o.labelledBy || labelId });
  const descGlyph = priorityGlyph(value);
  const descText = h('strong');
  const descHint = h('span', { class:'prio-desc-hint' });
  const desc = h('p', { class:'prio-desc', 'aria-live':'polite' }, descGlyph, descText, descHint);

  const buttons = PRIORITY_LEVELS.map(level => {
    const b = h('button', { type:'button', class:'prio-opt p' + level.v, role:'radio', dataset:{ v:String(level.v) },
      'aria-label': `${level.v} · ${level.label}` },
      priorityGlyph(level.v),
      h('span', { class:'prio-word', text:level.label }));
    b.addEventListener('click', () => select(level.v, false));
    b.addEventListener('keydown', (e) => {
      let next = null;
      if(e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(5, value + 1);
      else if(e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, value - 1);
      else if(e.key === 'Home') next = 1;
      else if(e.key === 'End') next = 5;
      if(next !== null){ e.preventDefault(); select(next, true); }
    });
    group.appendChild(b);
    return b;
  });

  function paint(){
    buttons.forEach(b => {
      const on = Number(b.dataset.v) === value;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    setPriorityGlyph(descGlyph, value);
    descText.textContent = priorityText(value);
    descHint.textContent = PriorityEngine.hint(value, o.context);
  }
  function select(v, focus){
    value = PriorityEngine.clamp(v);
    paint();
    if(focus){ const b = buttons[value - 1]; if(b) b.focus(); }
    if(typeof o.onChange === 'function') o.onChange(value);
  }

  if(o.label){
    wrap.append(h('div', { class:'prio-label', id:labelId },
      h('span', { text:o.label }), o.helpKey ? helpDot(o.helpKey) : null));
  }
  wrap.append(group, desc);
  paint();
  wrap.getValue = () => value;
  wrap.setValue = (v) => { value = PriorityEngine.clamp(v); paint(); };
  return wrap;
}

/**
 * Prioridade editável no próprio detalhe (Disciplina e Tópico).
 * As hastes são os botões: clicar na 4ª deixa a prioridade em 4. A gravação
 * espera um instante (setas do teclado passam por vários níveis) e grava só a
 * intenção mais recente. Enquanto isso, o valor pendente sobrevive a um
 * redesenho da tela — ninguém vê o valor "voltar" antes de gravar.
 */
const PendingPriority = new Map();
function priorityInline(opts){
  const o = opts || {};
  const key = o.key || 'prio';
  let value = PriorityEngine.clamp(PendingPriority.has(key) ? PendingPriority.get(key) : o.value);
  const text = h('span', { class:'pi-text', 'aria-hidden':'true' });
  const hint = h('p', { class:'pi-hint', 'aria-live':'polite' });
  const group = h('div', { class:'pi-group', role:'radiogroup', 'aria-label': o.label || 'Prioridade' });
  const bars = PRIORITY_LEVELS.map(level => {
    const b = h('button', { type:'button', class:'pi-bar', role:'radio', 'data-fk': key + '-' + level.v,
      'aria-label': `Prioridade ${level.v} · ${level.label}` }, h('i'));
    b.addEventListener('click', () => pick(level.v, false));
    b.addEventListener('keydown', (e) => {
      let next = null;
      if(e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(5, value + 1);
      else if(e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, value - 1);
      else if(e.key === 'Home') next = 1;
      else if(e.key === 'End') next = 5;
      if(next !== null){ e.preventDefault(); pick(next, true); }
    });
    group.append(b);
    return b;
  });
  let timer = null;
  function paint(){
    group.dataset.level = String(value);
    bars.forEach((b, i) => {
      b.classList.toggle('on', i < value);
      const cur = i + 1 === value;
      b.setAttribute('aria-checked', cur ? 'true' : 'false');
      b.tabIndex = cur ? 0 : -1;
    });
    text.textContent = priorityText(value);
    hint.textContent = PriorityEngine.hint(value, o.context);
  }
  function pick(v, focus){
    const next = PriorityEngine.clamp(v);
    if(focus) bars[next - 1].focus();
    if(next === value) return;
    value = next;
    paint();
    PendingPriority.set(key, value);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const committed = value;
      try { if(typeof o.onCommit === 'function') await o.onCommit(committed); }
      finally { if(PendingPriority.get(key) === committed) PendingPriority.delete(key); }
    }, 420);
  }
  paint();
  return h('div', { class:'pi-field' },
    h('div', { class:'pi-row' }, h('span', { class:'pi-label', text:'Prioridade' }), group, text),
    hint);
}

/** "30 de setembro de 2026" */
function fmtDateLong(iso){
  const d = parseISO(iso);
  return d ? `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}` : '—';
}

/** "Tecnologia › Redes de Computadores" (ou só a disciplina, quando não há área). */
function disciplinePath(disc){
  if(!disc) return '';
  const a = disc.areaId ? getArea(disc.areaId) : null;
  return a ? `${a.name} › ${disc.name}` : disc.name;
}

/* =========================================================================
   v6.2 — NAVIGATION & FINDABILITY
   "Ir, encontrar e voltar sem pensar."

   Quatro peças pequenas, sem roteador e sem dependência:

     StudyStats   — minutos e estudos por área, disciplina e tópico, calculados
                    uma vez por geração dos dados (ordenar por "Mais estudadas"
                    não percorre as sessões a cada desenho).
     Collections  — estado de cada lista: busca, ordenação e filtro. Vive na
                    memória e no sessionStorage (nunca no IndexedDB), por
                    instância: a busca de "Tecnologia" não é a de "Faculdade".
     collectionView / contextSearch / choiceMenu — "buscar aqui" e "ordenar
                    por", com o mesmo visual e o mesmo teclado em toda lista.
     Nav          — o lugar atual vira uma entrada do history do navegador.
                    Voltar (do Ciclo ou do navegador) percorre o caminho feito
                    e só depois sai do Ciclo.

   FILTRAR esconde itens que não atendem a uma condição; ORDENAR reorganiza os
   mesmos itens. As duas coisas são separadas no código e na linguagem.
   Ordenar é sempre uma VISÃO: nunca grava `sortOrder`, prioridade ou datas.
   ========================================================================= */

/* ---------- totais de estudo por entidade ---------- */
const STUDY_ZERO = Object.freeze({ min:0, n:0 });
const StudyStats = {
  _key: null,
  _disc: new Map(), _topic: new Map(), _area: new Map(),
  _ensure(){
    // a geração muda a cada rebuildIndexes; o tamanho protege contra mutações diretas
    const key = (state.idx.gen || 0) + ':' + state.sessions.length + ':' + state.disciplines.length;
    if(key === this._key) return;
    this._key = key;
    const disc = new Map(), topic = new Map(), area = new Map();
    const total = list => ({ min: sum(list, s => Number(s.minutes) || 0), n: list.length });
    state.idx.sessionsByDisc.forEach((list, id) => disc.set(id, total(list)));
    state.idx.sessionsByTopic.forEach((list, id) => topic.set(id, total(list)));
    // Área = soma das sessões das disciplinas que estão nela (arquivadas incluídas:
    // o histórico continua sendo da área). Área vazia = 0 e continua aparecendo.
    state.disciplines.forEach(d => {
      const st = disc.get(d.id);
      if(!st) return;
      const k = areaKeyOf(d);
      const a = area.get(k) || { min:0, n:0 };
      a.min += st.min; a.n += st.n;
      area.set(k, a);
    });
    this._disc = disc; this._topic = topic; this._area = area;
  },
  discipline(id){ this._ensure(); return this._disc.get(id) || STUDY_ZERO; },
  topic(id){ this._ensure(); return this._topic.get(id) || STUDY_ZERO; },
  area(key){ this._ensure(); return this._area.get(key) || STUDY_ZERO; }
};

/* ---------- ordenações ---------- */
/* Rótulos no gênero da lista: "Mais estudadas" (áreas, disciplinas),
   "Mais estudados" (tópicos). Nada de "Relevância". */
const SORT_OPTIONS = {
  custom:        { f:'Ordem personalizada',         m:'Ordem personalizada',        desc:'A ordem que você definiu com ↑ e ↓' },
  most_studied:  { f:'Mais estudadas',              m:'Mais estudados',             desc:'Mais tempo registrado primeiro' },
  priority_desc: { f:'Prioridade: maior primeiro',  m:'Prioridade: maior primeiro', desc:'Muito alta → Muito baixa' },
  priority_asc:  { f:'Prioridade: menor primeiro',  m:'Prioridade: menor primeiro', desc:'Muito baixa → Muito alta' },
  updated:       { f:'Modificadas recentemente',    m:'Modificados recentemente',   desc:null },
  created:       { f:'Criadas recentemente',        m:'Criados recentemente',       desc:null },
  name:          { f:'Nome A–Z',                    m:'Nome A–Z',                   desc:null },
  nearest:       { f:'Mais próximas',               m:'Mais próximos',              desc:'A data mais próxima primeiro' }
};

/* Cada tipo de lista declara o que faz sentido para ELE. Área não tem
   prioridade — então não oferece ordenar por prioridade. Os padrões mantêm a
   ordem que cada lista já tinha: áreas e disciplinas por nome, tópicos na
   ordem personalizada (↑ ↓), prazos pela data. */
const COLLECTIONS = {
  areas:       { fem:true,  noun:['área','áreas'],             sorts:['most_studied','updated','created','name'], def:'name' },
  disciplines: { fem:true,  noun:['disciplina','disciplinas'], sorts:['most_studied','priority_desc','priority_asc','updated','created','name'], def:'name' },
  topics:      { fem:false, noun:['tópico','tópicos'],         sorts:['custom','most_studied','priority_desc','priority_asc','updated','created','name'], def:'custom' },
  deadlines:   { fem:false, noun:['prazo','prazos'],           sorts:['nearest','priority_desc','priority_asc','updated','created'], def:'nearest',
                 filters:[ { v:'all', label:'Todos' }, { v:'pending', label:'Pendentes' }, { v:'in_progress', label:'Em andamento' }, { v:'completed', label:'Concluídos' } ] }
};
const SEARCH_MIN_ITEMS = 4;     // listas menores que isso não ganham campo de busca (ruído sem função)

function sortLabel(kind, sort){
  const cfg = COLLECTIONS[kind], o = SORT_OPTIONS[sort];
  return o ? (cfg && cfg.fem ? o.f : o.m) : '';
}
function tsOf(v){ const t = Date.parse(v); return isFinite(t) ? t : 0; }   // data inválida/ausente = mais antiga, sem erro

/**
 * Comparador determinístico. Todo critério termina em nome e, por fim, no id:
 * empates nunca trocam de lugar entre um desenho e outro.
 *   Mais estudadas: minutos ↓ · nº de estudos ↓ · modificada mais recente · nome
 */
function collectionComparator(kind, sort){
  const nameOf = x => str(x.name != null ? x.name : x.title);
  const byName = (a, b) => nameOf(a).localeCompare(nameOf(b), 'pt-BR', { numeric:true, sensitivity:'base' });
  const byId = (a, b) => (str(a.id) < str(b.id) ? -1 : str(a.id) > str(b.id) ? 1 : 0);
  const tie = (a, b) => byName(a, b) || byId(a, b);
  StudyStats._ensure();                              // uma verificação por ordenação, não por comparação
  const statMap = kind === 'areas' ? StudyStats._area : kind === 'topics' ? StudyStats._topic : StudyStats._disc;
  const stat = x => statMap.get(x.id) || STUDY_ZERO;
  const prio = x => PriorityEngine.clamp(x.priority);
  switch(sort){
    case 'most_studied': return (a, b) => {
      const sa = stat(a), sb = stat(b);
      return (sb.min - sa.min) || (sb.n - sa.n) || (tsOf(b.updatedAt) - tsOf(a.updatedAt)) || tie(a, b);
    };
    case 'priority_desc': return (a, b) => (prio(b) - prio(a)) || tie(a, b);
    case 'priority_asc':  return (a, b) => (prio(a) - prio(b)) || tie(a, b);
    case 'updated':       return (a, b) => (tsOf(b.updatedAt) - tsOf(a.updatedAt)) || tie(a, b);
    case 'created':       return (a, b) => (tsOf(b.createdAt) - tsOf(a.createdAt)) || tie(a, b);
    case 'nearest':       return (a, b) => str(a.date).localeCompare(str(b.date)) || (prio(b) - prio(a)) || tie(a, b);
    case 'custom':        return (a, b) => ((Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)) || tie(a, b);
    default:              return tie;
  }
}

/* ---------- estado das listas (busca · ordenação · filtro) ---------- */
const COLLECTIONS_SS_KEY = 'ciclo:v6.2:collections';   // sessionStorage: sobrevive ao recarregar a aba, some ao fechá-la
const Collections = {
  map: null,
  _timer: null,
  _load(){
    if(this.map) return;
    this.map = {};
    try {
      const raw = sessionStorage.getItem(COLLECTIONS_SS_KEY);
      const o = raw ? JSON.parse(raw) : null;
      if(o && typeof o === 'object'){
        Object.keys(o).slice(0, 400).forEach(k => {
          const v = o[k];
          if(!v || typeof v !== 'object') return;
          this.map[k] = { q: typeof v.q === 'string' ? v.q.slice(0, 120) : '', sort: typeof v.sort === 'string' ? v.sort : '', f: typeof v.f === 'string' ? v.f : 'all' };
        });
      }
    } catch(_){ /* sessionStorage indisponível: fica só na memória */ }
  },
  /** Estado de UMA lista. Valores inválidos voltam ao padrão daquele tipo. */
  get(key, kind){
    this._load();
    const cfg = COLLECTIONS[kind];
    let st = this.map[key];
    if(!st){ st = { q:'', sort:cfg.def, f:'all' }; this.map[key] = st; }
    if(!cfg.sorts.includes(st.sort)) st.sort = cfg.def;
    if(!cfg.filters || !cfg.filters.some(x => x.v === st.f)) st.f = 'all';
    return st;
  },
  save(){
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      try { sessionStorage.setItem(COLLECTIONS_SS_KEY, JSON.stringify(this.map || {})); } catch(_){}
    }, 250);
  },
  reset(){
    this.map = {};
    clearTimeout(this._timer);
    try { sessionStorage.removeItem(COLLECTIONS_SS_KEY); } catch(_){}
  }
};

/* ---------- destaque seguro do trecho encontrado (sem innerHTML) ---------- */
/** Devolve um fragmento com <mark> nos trechos que casam com a busca, sem acento e sem caixa. */
function highlightMatch(text, query){
  const src = str(text);
  const terms = normalizeText(query).split(' ').filter(Boolean);
  if(!terms.length || !src) return src;
  let norm = '';
  const map = [];
  for(let i = 0; i < src.length; i++){
    const n = src[i].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for(let j = 0; j < n.length; j++){ norm += n[j]; map.push(i); }
  }
  const marks = new Array(src.length).fill(false);
  terms.forEach(t => {
    let k = norm.indexOf(t);
    while(k !== -1){
      for(let j = k; j < k + t.length; j++) marks[map[j]] = true;
      k = norm.indexOf(t, k + t.length);
    }
  });
  if(!marks.some(Boolean)) return src;
  const frag = document.createDocumentFragment();
  let buf = '', on = marks[0];
  const flush = () => { if(buf) frag.append(on ? h('mark', { class:'hl', text:buf }) : document.createTextNode(buf)); };
  for(let i = 0; i < src.length; i++){
    if(marks[i] !== on){ flush(); buf = ''; on = marks[i]; }
    buf += src[i];
  }
  flush();
  return frag;
}

/** Todos os termos aparecem no texto já normalizado? (busca "e", sem acento) */
function matchesTerms(hay, terms){ return terms.every(t => hay.includes(t)); }

/* ---------- navegação por teclado dentro de uma lista de resultados ---------- */
const RESULT_ITEM_SELECTOR = '.ix-main,.dl-line,.line-main:not(.static)';

/**
 * Setas percorrem os itens; ↑ no primeiro volta para a busca; Esc volta para a
 * busca sem apagar nada. O foco é a seleção: não há "selecionado" paralelo.
 */
function bindResultKeys(holder, input){
  holder.addEventListener('keydown', (e) => {
    if(!['ArrowDown','ArrowUp','Home','End','Escape'].includes(e.key)) return;
    const items = $$(RESULT_ITEM_SELECTOR, holder).filter(el => el.offsetParent !== null);
    const i = items.indexOf(document.activeElement);
    if(i < 0) return;
    if(e.key === 'Escape'){
      if(!input) return;
      e.preventDefault(); e.stopPropagation(); input.focus(); return;
    }
    e.preventDefault();
    let j = i;
    if(e.key === 'ArrowDown') j = Math.min(items.length - 1, i + 1);
    else if(e.key === 'ArrowUp'){ if(i === 0 && input){ input.focus(); return; } j = Math.max(0, i - 1); }
    else if(e.key === 'Home') j = 0;
    else if(e.key === 'End') j = items.length - 1;
    focusAndReveal(items[j]);
  });
}

/** Foca sem salto e garante que o item fique visível (abaixo do cabeçalho fixo do celular). */
function focusAndReveal(el){
  if(!el) return;
  try { el.focus({ preventScroll:true }); } catch(_){ el.focus(); }
  revealElement(el);
}
function revealElement(el){
  if(!el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  const head = $('.mobile-head');
  const top = head && head.offsetParent !== null ? head.getBoundingClientRect().bottom + 8 : 8;
  const bottom = window.innerHeight - 96;          // o botão Registrar fica embaixo
  if(r.top < top) window.scrollBy({ top: r.top - top, behavior:'auto' });
  else if(r.bottom > bottom) window.scrollBy({ top: r.bottom - bottom, behavior:'auto' });
}

/**
 * Campo "buscar aqui". Rótulo real para leitores de tela (o placeholder só
 * ensina o contexto), botão × acessível, Esc limpa, ↓ entra nos resultados,
 * Enter abre o primeiro resultado.
 *   o = { id, value, placeholder, label, onInput(v), holder, fk }
 */
function contextSearch(o){
  const input = h('input', { type:'search', id:o.id, value:o.value || '', placeholder:o.placeholder, autocomplete:'off', spellcheck:'false',
    enterkeyhint:'search', 'aria-label':o.label, 'data-fk':o.fk || null, 'data-context-search':'' });
  const clearBtn = h('button', { class:'ctx-clear', type:'button', 'aria-label':'Limpar busca', title:'Limpar busca', hidden: !o.value },
    icon('i-close', 'btn-icon'));
  const set = (v) => { input.value = v; clearBtn.hidden = !v; o.onInput(v); };
  input.addEventListener('input', () => { clearBtn.hidden = !input.value; o.onInput(input.value); });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      if(input.value){ e.preventDefault(); e.stopPropagation(); set(''); }
      return;
    }
    const first = () => o.holder ? $$(RESULT_ITEM_SELECTOR, o.holder).find(el => el.offsetParent !== null) : null;
    if(e.key === 'ArrowDown'){ const f = first(); if(f){ e.preventDefault(); focusAndReveal(f); } }
    else if(e.key === 'Enter'){ const f = input.value.trim() ? first() : null; if(f){ e.preventDefault(); f.click(); } }
  });
  clearBtn.addEventListener('click', () => { set(''); input.focus(); });
  if(o.holder) bindResultKeys(o.holder, input);
  const node = h('div', { class:'an-search ctx-search grow', role:'search' }, icon('i-search'), input, clearBtn);
  return { node, input, set };
}

/**
 * Menu de escolha única (ordenar por; mostrar). Um botão discreto que diz o
 * estado atual — "Mais estudadas ▾" — e abre opções com ✓ na ativa.
 *   o = { label, ariaLabel, title, fk, groups:[{ title, value, options:[{v,label,desc}], onPick(v) }] }
 * Devolve { node, update(label, values[]) } para atualizar sem redesenhar a lista.
 */
function choiceMenu(o){
  const wrap = h('div', { class:'menu-wrap choice-wrap' });
  const labelEl = h('span', { class:'cm-label', text:o.label });
  const btn = h('button', { class:'btn ghost sm choice-btn', type:'button', 'aria-haspopup':'menu', 'aria-expanded':'false',
    'aria-label':o.ariaLabel, title:o.title || null, 'data-fk':o.fk || null },
    icon('i-sort', 'btn-icon cm-icon'), labelEl, icon('i-chev', 'btn-icon menu-chev'));
  const menu = h('div', { class:'menu choice-menu', role:'menu', 'aria-label':o.title || o.ariaLabel, hidden:true });
  const values = o.groups.map(g => g.value);
  const itemsByGroup = [];
  o.groups.forEach((g, gi) => {
    const grp = h('div', { class:'cm-group', role:'group', 'aria-label':g.title });
    if(g.title) grp.append(h('p', { class:'cm-group-t', 'aria-hidden':'true', text:g.title }));
    itemsByGroup[gi] = g.options.map(opt => {
      const it = h('button', { class:'menu-item cm-item', type:'button', role:'menuitemradio', tabindex:'-1',
        'aria-checked': opt.v === values[gi] ? 'true' : 'false', 'data-v':opt.v },
        icon('i-check', 'cm-check'),
        h('span', { class:'cm-text' }, h('span', { class:'cm-l', text:opt.label }), opt.desc ? h('span', { class:'cm-d', text:opt.desc }) : null));
      it.addEventListener('click', () => {
        close(true);
        if(opt.v !== values[gi]) g.onPick(opt.v);
      });
      grp.append(it);
      return it;
    });
    menu.append(grp);
  });
  const allItems = () => $$('[role="menuitemradio"]', menu);
  /* v6.6: abrir, fechar, posicionar e clicar dentro/fora seguem menuPopover —
     o mesmo comportamento de todos os menus pequenos do Ciclo. */
  const pop = menuPopover(wrap, btn, menu, {
    onOpen(){
      const on = allItems().find(x => x.getAttribute('aria-checked') === 'true') || allItems()[0];
      if(on){ try { on.focus({ preventScroll:true }); } catch(_){ on.focus(); } }
    }
  });
  const close = (refocus) => pop.close(refocus);
  const open = () => pop.open();
  btn.addEventListener('click', () => { if(!pop.isOpen) open(); else close(true); });
  btn.addEventListener('keydown', (e) => { if((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !pop.isOpen){ e.preventDefault(); open(); } });
  menu.addEventListener('keydown', (e) => {
    const list = allItems();
    const i = list.indexOf(document.activeElement);
    if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); }
    else if(e.key === 'ArrowDown'){ e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if(e.key === 'Home'){ e.preventDefault(); list[0].focus(); }
    else if(e.key === 'End'){ e.preventDefault(); list[list.length - 1].focus(); }
    else if(e.key === 'Tab'){ close(false); }
  });
  wrap.append(btn, menu);
  return {
    node: wrap,
    update(label, newValues, ariaLabel){
      labelEl.textContent = label;
      if(ariaLabel) btn.setAttribute('aria-label', ariaLabel);
      (newValues || []).forEach((v, gi) => {
        values[gi] = v;
        (itemsByGroup[gi] || []).forEach(it => it.setAttribute('aria-checked', it.dataset.v === v ? 'true' : 'false'));
      });
    }
  };
}

/**
 * Uma lista com "buscar aqui" + "ordenar por" (+ "mostrar", quando a lista tem
 * filtro real). Digitar ou reordenar redesenha SÓ a região da lista.
 *   cfg = {
 *     key, kind, items,                 // itens desta lista (já sem arquivados)
 *     tail,                             // [{ text, render(query) }] — sempre no fim, fora da ordenação (ex.: "Sem área")
 *     placeholder, label,               // "Buscar disciplina em Tecnologia…"
 *     searchText(item),                 // campos pesquisáveis (só os relevantes)
 *     noResults,                        // "Nenhuma disciplina encontrada em Tecnologia."
 *     filterFn(item, f), emptyFiltered(f),
 *     renderItems(list, ctx)            // ctx: { query, sort, filter, filtered, tail }
 *   }
 */
function collectionView(cfg){
  const kind = COLLECTIONS[cfg.kind];
  const st = Collections.get(cfg.key, cfg.kind);
  const items = cfg.items || [];
  const tailAll = cfg.tail || [];
  const hay = new Map(items.map(x => [x, normalizeText(cfg.searchText(x))]));
  const tailHay = tailAll.map(t => normalizeText(t.text));
  const showSearch = items.length + tailAll.length >= SEARCH_MIN_ITEMS || !!st.q;
  const showMenu = items.length >= 2 || (kind.filters && st.f !== 'all');
  if(!showSearch && st.q) st.q = '';

  const holder = h('div', { class:'coll-results' });
  const live = h('p', { class:'sr-only', role:'status', 'aria-live':'polite' });
  let sorted = [];
  const resort = () => {
    const f = st.f;
    const base = kind.filters && cfg.filterFn ? items.filter(x => cfg.filterFn(x, f)) : items;
    sorted = base.slice().sort(collectionComparator(cfg.kind, st.sort));
  };
  const draw = (animate) => {
    const terms = normalizeText(st.q).split(' ').filter(Boolean);
    const list = terms.length ? sorted.filter(x => matchesTerms(hay.get(x), terms)) : sorted;
    const tail = tailAll.filter((t, i) => !terms.length || matchesTerms(tailHay[i], terms));
    clear(holder);
    if(!list.length && !tail.length){
      const msg = terms.length ? cfg.noResults : (cfg.emptyFiltered ? cfg.emptyFiltered(st.f) : '');
      holder.append(h('div', { class:'coll-empty' },
        h('p', { text: msg }),
        terms.length ? h('button', { class:'btn ghost sm', type:'button', text:'Limpar busca', onclick:() => { search.set(''); search.input.focus(); } })
          : (kind.filters && st.f !== 'all' ? h('button', { class:'btn ghost sm', type:'button', text:'Mostrar todos', onclick:() => pickFilter('all') }) : null)));
    } else {
      appendChildren(holder, [cfg.renderItems(list, { query: terms.length ? st.q : '', sort: st.sort, filter: st.f, filtered: terms.length > 0, tail })]);
    }
    live.textContent = terms.length
      ? (list.length + tail.length ? plural(list.length + tail.length, 'resultado', 'resultados') : cfg.noResults)
      : '';
    // reorganizou: uma transição global curta. Web Animations evita forçar um
    // reflow síncrono da página inteira (o truque de offsetWidth custava ~45ms com 450 linhas).
    if(animate && !prefersReducedMotion() && typeof holder.animate === 'function'){
      try { holder.animate([{ opacity:.35 }, { opacity:1 }], { duration:150, easing:'cubic-bezier(.2,.8,.2,1)' }); } catch(_){}
    }
  };

  const search = contextSearch({
    id:'cq-' + cfg.kind, fk:'coll-q', value: st.q, placeholder: cfg.placeholder, label: cfg.label, holder,
    onInput:(v) => { st.q = v; Collections.save(); draw(false); }
  });

  const menuLabel = () => {
    const s = sortLabel(cfg.kind, st.sort);
    if(!kind.filters || st.f === 'all') return s;
    return kind.filters.find(x => x.v === st.f).label + ' · ' + s;
  };
  const menuAria = () => (kind.filters ? `Mostrar e ordenar ${kind.noun[1]}: ` : `Ordenar ${kind.noun[1]}: `) + menuLabel();
  let menu = null;
  function pickSort(v){ st.sort = v; Collections.save(); resort(); draw(true); if(menu) menu.update(menuLabel(), kind.filters ? [st.f, v] : [v], menuAria()); }
  function pickFilter(v){ st.f = v; Collections.save(); resort(); draw(true); if(menu) menu.update(menuLabel(), [v, st.sort], menuAria()); }
  if(showMenu){
    const sortGroup = { title:'Ordenar por', value:st.sort, onPick:pickSort,
      options: kind.sorts.map(v => ({ v, label: sortLabel(cfg.kind, v), desc: SORT_OPTIONS[v].desc })) };
    const groups = kind.filters ? [{ title:'Mostrar', value:st.f, onPick:pickFilter, options: kind.filters }, sortGroup] : [sortGroup];
    menu = choiceMenu({ label: menuLabel(), ariaLabel: menuAria(), title: kind.filters ? `Mostrar e ordenar ${kind.noun[1]}` : `Ordenar ${kind.noun[1]}`, fk:'coll-sort', groups });
  }

  resort();
  draw(false);
  const tools = (showSearch || menu) ? h('div', { class:'coll-tools' + (showSearch ? '' : ' no-search') }, showSearch ? search.node : null, menu ? menu.node : null) : null;
  return h('div', { class:'coll', 'data-coll':cfg.key }, tools, live, holder);
}

/* =========================================================================
   Nav — histórico do navegador integrado ao Ciclo (sem roteador).

   Cada lugar é descrito por uma LOCALIZAÇÃO pequena e canônica:
     { v:'disciplines', tab:'disciplines', l:'topic', a:areaKey, d:discId, t:topicId }
     { v:'help', hr:{ kind, id, group } }       { v:'today' } …
   Mudar de lugar → pushState. Corrigir o lugar (dados mudaram, aba irmã) →
   replaceState. Restaurar (Voltar/Avançar do navegador) → nunca cria entrada,
   o que evita o laço popstate → pushState → popstate.

   O estado de cada entrada guarda também a entrada anterior (`p`) e a rolagem
   (`sy`), para o "voltar" interno usar o próprio histórico quando o destino é
   exatamente a página anterior — assim o Avançar continua funcionando.
   ========================================================================= */
function normHelpRoute(r){
  const x = r && typeof r === 'object' ? r : {};
  const kind = ['home','section','article','faq','glossary'].includes(x.kind) ? x.kind : 'home';
  return { kind, id: x.id ? String(x.id) : null, group: x.group ? String(x.group) : null };
}
/** Localização de um nível do índice de Disciplinas (para comparar com o histórico). */
function discLoc(n){
  const lvl = n && n.level ? n.level : 'root';
  const loc = { v:'disciplines', tab:'disciplines', l:lvl, a:null, d:null, t:null };
  if(lvl === 'area') loc.a = n.areaId || null;
  if(lvl === 'discipline' || lvl === 'topic'){
    const d = getDiscipline(n.disciplineId);
    loc.a = d ? areaKeyOf(d) : (n.areaId || null);
    loc.d = n.disciplineId || null;
  }
  if(lvl === 'topic') loc.t = n.topicId || null;
  return loc;
}
/** `target` é o próprio `loc` ou um nível acima dele no índice? */
function discLocContains(target, loc){
  if(!target || !loc || target.v !== 'disciplines' || loc.v !== 'disciplines') return false;
  if(target.tab === 'deadlines' || loc.tab === 'deadlines') return false;
  if(target.l === 'root') return true;
  if(target.l === 'area') return loc.l !== 'root' && loc.a === target.a;
  if(target.l === 'discipline') return (loc.l === 'discipline' || loc.l === 'topic') && loc.d === target.d;
  return loc.l === 'topic' && loc.t === target.t;
}
/** Ao voltar, o foco cai na linha (no nível de destino) que leva ao lugar de onde a pessoa veio. */
function discBackFocus(from, to){
  if(!from || from.v !== 'disciplines' || from.l === 'root') return null;
  const lvl = to && to.level ? to.level : 'root';
  if(lvl === 'root') return usesAreas() ? (from.a ? 'area-' + from.a : null) : (from.d ? 'disc-' + from.d : null);
  if(lvl === 'area') return from.d ? 'disc-' + from.d : null;
  if(lvl === 'discipline') return from.t ? 'topic-' + from.t : null;
  return null;
}

const Nav = {
  i: 0,              // índice da entrada atual (contado a partir da primeira entrada do Ciclo)
  entries: [],       // localizações conhecidas, por índice
  scrollAt: [],      // rolagem de cada entrada, atualizada enquanto a pessoa rola
  restoring: false,
  started: false,

  /** Onde a pessoa está AGORA, já validado contra os dados. */
  location(){
    const v = VIEW_TITLES[ui.view] ? ui.view : 'today';
    const loc = { v };
    if(v === 'disciplines'){
      loc.tab = ui.discTab === 'deadlines' ? 'deadlines' : 'disciplines';
      if(loc.tab === 'disciplines'){
        const r = resolveDiscNav();
        loc.l = r.level; loc.a = r.areaKey || null; loc.d = r.disc ? r.disc.id : null; loc.t = r.topic ? r.topic.id : null;
      }
    } else if(v === 'help'){
      loc.hr = normHelpRoute(helpUi.route);
    }
    return loc;
  },
  equals(a, b){
    if(!a || !b || a.v !== b.v) return false;
    if(a.v === 'disciplines'){
      const ta = a.tab === 'deadlines' ? 'deadlines' : 'disciplines', tb = b.tab === 'deadlines' ? 'deadlines' : 'disciplines';
      if(ta !== tb) return false;
      if(ta === 'deadlines') return true;
      return (a.l || 'root') === (b.l || 'root') && (a.a || null) === (b.a || null) && (a.d || null) === (b.d || null) && (a.t || null) === (b.t || null);
    }
    if(a.v === 'help') return helpRouteEquals(normHelpRoute(a.hr), normHelpRoute(b.hr));
    return true;
  },
  _stateFor(loc, sy){
    return { c:'ciclo', i:this.i, loc, p:this.entries[this.i - 1] || null,
             hs: loc.v === 'help' ? helpUi.stack.slice(-20).map(normHelpRoute) : null, sy: sy || 0 };
  },
  _replace(loc){
    try { history.replaceState(this._stateFor(loc, this.scrollAt[this.i] || 0), ''); }
    catch(err){ console.warn('Ciclo: não foi possível atualizar o histórico.', err); }
  },
  _push(loc){
    // grava a rolagem da entrada que está sendo deixada (para Voltar reencontrá-la)
    try {
      const cur = history.state;
      if(cur && cur.c === 'ciclo') history.replaceState(Object.assign({}, cur, { sy: this.scrollAt[this.i] || 0 }), '');
    } catch(_){}
    this.i++;
    this.entries.length = this.i;          // um caminho novo apaga o "Avançar" antigo, como no navegador
    this.scrollAt.length = this.i;
    this.entries[this.i] = loc;
    this.scrollAt[this.i] = 0;
    try { history.pushState(this._stateFor(loc, 0), ''); }
    catch(err){ console.warn('Ciclo: não foi possível registrar a navegação.', err); }
  },

  /** Primeira entrada: SUBSTITUI a atual (nada de uma entrada extra ao abrir). */
  start(){
    if('scrollRestoration' in history){ try { history.scrollRestoration = 'manual'; } catch(_){} }
    const s = history.state && history.state.c === 'ciclo' ? history.state : null;
    this.i = s && isNum(s.i) && s.i >= 0 ? s.i : 0;
    if(s && s.p) this.entries[this.i - 1] = s.p;
    this.entries[this.i] = this.location();
    this.scrollAt[this.i] = window.scrollY;
    this._replace(this.entries[this.i]);
    this.started = true;
    window.addEventListener('popstate', (e) => this._onPop(e));
    window.addEventListener('scroll', () => { this.scrollAt[this.i] = window.scrollY; }, { passive:true });
    // ao sair/recarregar, a rolagem atual fica guardada na própria entrada
    window.addEventListener('pagehide', () => {
      try { const cur = history.state; if(cur && cur.c === 'ciclo') history.replaceState(Object.assign({}, cur, { sy: window.scrollY }), ''); } catch(_){}
    });
  },

  /** Registra o lugar atual: 'push' cria entrada (se mudou), 'replace' só corrige. */
  sync(mode){
    if(!this.started || this.restoring) return;
    const loc = this.location();
    const cur = this.entries[this.i];
    if(mode !== 'push' || (cur && this.equals(cur, loc))){
      this.entries[this.i] = loc;
      this._replace(loc);
      return;
    }
    this._push(loc);
  },
  /** Antes de um salto direto (busca global → tópico), a página-pai entra no caminho. */
  pushParent(parentLoc){
    if(!this.started || this.restoring || !parentLoc) return;
    const cur = this.entries[this.i];
    if(cur && this.equals(cur, parentLoc)) return;
    this._push(parentLoc);
  },
  prev(){ return this.entries[this.i - 1] || null; },

  /**
   * "Voltar" interno para `target`. Se o destino já está logo atrás no
   * histórico (só com descendentes dele no meio), usa history.go — o Avançar
   * continua levando de volta. Senão, `fallback()` troca a página atual pelo
   * destino, sem empilhar (o Voltar do navegador não volta para o filho).
   */
  up(target, fallback, contains){
    const inside = contains || discLocContains;
    if(this.started){
      for(let j = this.i - 1; j >= 0 && j >= this.i - 16; j--){
        const e = this.entries[j];
        if(!e) break;
        if(this.equals(e, target)){ history.go(j - this.i); return; }
        if(!inside(target, e)) break;
      }
    }
    fallback();
  },

  _onPop(e){
    const s = e.state;
    if(!s || s.c !== 'ciclo' || !state.ready) return;     // entrada que não é do Ciclo: não mexe
    const dir = isNum(s.i) && s.i < this.i ? 'back' : 'forward';
    const from = this.entries[this.i] || this.location();
    this.i = isNum(s.i) ? s.i : this.i;
    this.entries[this.i] = s.loc;
    if(s.p && !this.entries[this.i - 1]) this.entries[this.i - 1] = s.p;
    const y = isNum(this.scrollAt[this.i]) ? this.scrollAt[this.i] : (isNum(s.sy) ? s.sy : 0);
    closeTransientLayers();
    this.restoring = true;
    try { applyLocation(s.loc, { dir, from, scrollY:y, helpStack:s.hs }); }
    catch(err){ console.error('Ciclo: falha ao restaurar a navegação.', err); }
    finally { this.restoring = false; }
    // o lugar guardado pode não existir mais (item excluído): a entrada passa a apontar para o pai válido
    const now = this.location();
    if(!this.equals(now, s.loc)){ this.entries[this.i] = now; this._replace(now); }
  },

  /** Depois de restaurar backup ou apagar tudo: nada temporário aponta para dados que sumiram. */
  resetForNewData(){
    Collections.reset();
    ui.discScroll = {};
    ui.discNav = { level:'root', areaId:null, disciplineId:null, topicId:null };
    ui.discFocus = null; ui.discNavDir = null;
    ui.areaJustCreated = null; ui.justCreated = null;
    ui.openDisciplineId = null; ui.openDeadlineId = null;
    ui.history.search = '';
    clearHistoryFilters();
  }
};

/** Voltar/Avançar do navegador fecham o que é passageiro; janelas com formulário ficam (nada digitado se perde). */
function closeTransientLayers(){
  Tooltip.hide();
  GlossaryPopover.close();
  if(Palette.isOpen) Palette.close();
  if(Drawer.isOpen) Drawer.close();
}

/** Aplica uma localização (vinda do histórico ou da recarga) sem criar entrada nova. */
function applyLocation(loc, ctx){
  const c = ctx || {};
  const l = loc && typeof loc === 'object' ? loc : { v:'today' };
  const view = VIEW_TITLES[l.v] ? l.v : 'today';
  const sameView = ui.view === view;
  // uma janela com formulário continua aberta por cima: o foco não pode sair dela
  const keepFocus = !!c.initial || Overlay.isOpen;
  if(view === 'disciplines'){
    ui.discTab = l.tab === 'deadlines' ? 'deadlines' : 'disciplines';
    if(ui.discTab === 'disciplines'){
      const target = { level: ['root','area','discipline','topic'].includes(l.l) ? l.l : 'root',
        areaId: l.a || null, disciplineId: l.d || null, topicId: l.t || null };
      const fromDisc = c.from && c.from.v === 'disciplines' && c.from.tab !== 'deadlines' ? c.from : null;
      ui.discNav = target;
      ui.discNavDir = sameView && fromDisc && !c.initial ? c.dir : null;
      ui.discFocus = keepFocus ? null
        : (c.dir === 'back' && fromDisc ? (discBackFocus(fromDisc, target) || 'level-title') : (target.level !== 'root' ? 'level-title' : null));
      if(target.level !== 'area' || target.areaId !== ui.areaJustCreated) ui.areaJustCreated = null;
    }
  } else if(view === 'help'){
    helpUi.route = normHelpRoute(l.hr);
    helpUi.stack = Array.isArray(c.helpStack) ? c.helpStack.slice(-20).map(normHelpRoute) : [];
    helpClearSearch();
  }
  if(!sameView) setView(view, { noSync:true, noScroll:true });
  else render();
  window.scrollTo({ top: Math.max(0, c.scrollY || 0), behavior:'auto' });
  if(keepFocus) return;
  // foco: nunca fica num elemento que saiu da tela; troca de tela → título da tela
  const ae = document.activeElement;
  const lost = !ae || ae === document.body || !document.contains(ae);
  if(!sameView || lost){
    if(!(view === 'disciplines' && ui.discTab === 'disciplines' && document.activeElement && $('#view-disciplines').contains(document.activeElement) && document.activeElement !== document.body)){
      focusViewHeading(view);
    }
  } else if(ae) revealElement(ae);
}

/** Foco no título da tela (ou do nível, dentro de Disciplinas), sem saltar a rolagem. */
function focusViewHeading(view){
  const sec = $('#view-' + view);
  if(!sec) return;
  const el = (sec.classList.contains('is-deep') && $('.level-title', sec)) || $('.page-head h2', sec);
  if(el){ try { el.focus({ preventScroll:true }); } catch(_){ el.focus(); } }
}

/* =========================================================================
   TELA: DISCIPLINAS — v6.1 · Calm Structure
   A aba é a entrada de toda a hierarquia, navegada como um caderno indexado:

       Disciplinas  →  Área  →  Disciplina  →  Tópico

   Cada nível mostra só o que pertence a ele; a profundidade acontece por
   navegação, nunca por uma árvore inteira aberta. Uma Área criada EXISTE,
   mesmo vazia. Quem nunca criou Área vê as disciplinas direto no primeiro
   nível (nada de um "Sem área" solitário no caminho). A aba Prazos continua
   ao lado, no primeiro nível.
   ========================================================================= */
const NO_AREA = '__none__';

/** Área de uma disciplina, ou NO_AREA quando não tem (ou a área sumiu). */
function areaKeyOf(d){ return d && d.areaId && getArea(d.areaId) ? d.areaId : NO_AREA; }
function disciplinesIn(areaKey, includeArchived){
  return state.disciplines.filter(d => areaKeyOf(d) === areaKey && (includeArchived || !d.archived)).sort(sortByName);
}
/** Existe organização por Áreas? (alguma área ativa, ou disciplina ativa dentro de uma área) */
function usesAreas(){
  return state.areas.some(a => !a.archived) || state.disciplines.some(d => !d.archived && areaKeyOf(d) !== NO_AREA);
}
/** Área visível no primeiro nível: ativa, ou arquivada mas ainda com disciplina ativa (nunca some com conteúdo). */
function areaIsListed(a){ return !a.archived || disciplinesIn(a.id, false).length > 0; }

function discLevelKey(n){
  if(!n || n.level === 'root') return 'root';
  if(n.level === 'area') return 'area:' + n.areaId;
  if(n.level === 'discipline') return 'disc:' + n.disciplineId;
  return 'topic:' + n.topicId;
}

/** Valida a posição guardada contra os dados atuais. Entidade removida → sobe um nível. */
function resolveDiscNav(){
  const n = ui.discNav || { level:'root' };
  const r = { level:'root', areaKey:null, area:null, disc:null, topic:null, areaMode: usesAreas() };
  let topic = n.level === 'topic' && n.topicId ? getTopic(n.topicId) : null;
  const discId = topic ? topic.disciplineId : ((n.level === 'discipline' || n.level === 'topic') ? n.disciplineId : null);
  const disc = discId ? getDiscipline(discId) : null;
  if(topic && !disc) topic = null;
  if(disc){
    r.disc = disc; r.topic = topic;
    r.level = topic ? 'topic' : 'discipline';
    r.areaKey = areaKeyOf(disc);
    r.area = r.areaKey !== NO_AREA ? getArea(r.areaKey) : null;
    return r;
  }
  if(n.level !== 'root' && n.areaId){
    if(n.areaId === NO_AREA){
      if(r.areaMode){ r.level = 'area'; r.areaKey = NO_AREA; }
      return r;
    }
    const a = getArea(n.areaId);
    if(a){ r.level = 'area'; r.areaKey = a.id; r.area = a; }
  }
  return r;
}

/**
 * Navega dentro da hierarquia. `dir` define o movimento ('forward' | 'back')
 * e para onde o foco vai: título do novo nível ao entrar; linha de origem ao
 * voltar. A rolagem de cada nível é lembrada para o voltar não perder o lugar.
 * v6.2: cada nível vira uma entrada do histórico do navegador.
 *   opts.replace   — corrige o lugar atual (item excluído/arquivado) sem empilhar
 *   opts.parentLoc — salto direto: a página-pai entra antes no caminho
 */
function navDisc(target, dir, opts){
  const o = (opts && typeof opts === 'object' && !(opts instanceof Event)) ? opts : {};
  const prev = ui.discNav || { level:'root' };
  const inIndex = ui.view === 'disciplines' && ui.discTab !== 'deadlines';
  const fromLoc = inIndex ? Nav.location() : null;
  if(inIndex) ui.discScroll[discLevelKey(prev)] = window.scrollY;
  const next = Object.assign({ level:'root', areaId:null, disciplineId:null, topicId:null }, target || {});
  // salto direto para dentro: a página-pai entra antes no caminho (a não ser que já estejamos no próprio destino)
  if(o.parentLoc && !(Nav.started && Nav.equals(Nav.entries[Nav.i], discLoc(next)))) Nav.pushParent(o.parentLoc);
  ui.discNav = next;
  ui.discTab = 'disciplines';
  ui.discNavDir = dir || null;
  ui.discFocus = dir === 'back' ? (discBackFocus(fromLoc, next) || 'level-title') : 'level-title';
  if(next.level !== 'area' || next.areaId !== ui.areaJustCreated) ui.areaJustCreated = null;
  Tooltip.hide();
  if(Drawer.isOpen) Drawer.close();
  if(ui.view !== 'disciplines') setView('disciplines', { noSync:true, noScroll:true });
  else renderDisciplines();
  Nav.sync(o.replace ? 'replace' : 'push');
  const y = dir === 'back' ? (ui.discScroll[discLevelKey(next)] || 0) : 0;
  window.scrollTo({ top:y, behavior:'auto' });
  if(dir === 'back' && document.activeElement) revealElement(document.activeElement);
}
/**
 * "← Destino": sobe um (ou mais) níveis. Quando o destino é exatamente a
 * página anterior do histórico, usa o próprio histórico — busca, ordenação,
 * rolagem e o Avançar do navegador continuam valendo.
 */
function navDiscUp(target){
  Nav.up(discLoc(target), () => navDisc(target, 'back', { replace:true }));
}
function openArea(areaKey){ navDisc({ level:'area', areaId:areaKey }, 'forward'); }
/** Abre a disciplina no seu lugar da hierarquia (de qualquer tela). */
function openDisciplineDetail(discId){
  const d = getDiscipline(discId);
  if(!d) return;
  ui.openDisciplineId = discId;
  navDisc({ level:'discipline', disciplineId:d.id, areaId:areaKeyOf(d) }, 'forward');
}
/** Abre o tópico como página própria dentro de Disciplinas. De fora da disciplina
 *  (busca global, painel), a disciplina-pai entra antes no caminho: Voltar leva a ela. */
function openTopicPage(topicId){
  const t = getTopic(topicId);
  if(!t) return;
  const d = getDiscipline(t.disciplineId);
  const parent = { level:'discipline', disciplineId:t.disciplineId, areaId:areaKeyOf(d) };
  navDisc({ level:'topic', topicId:t.id, disciplineId:t.disciplineId, areaId:areaKeyOf(d) }, 'forward', { parentLoc: d ? discLoc(parent) : null });
}

function renderDisciplines(){
  const root = $('#disciplines-body');
  const section = $('#view-disciplines');
  const tab = ui.discTab === 'deadlines' ? 'deadlines' : 'disciplines';
  const nav = tab === 'disciplines' ? resolveDiscNav() : null;
  const deep = !!(nav && nav.level !== 'root');
  if(section) section.classList.toggle('is-deep', deep);

  // foco: preserva o elemento equivalente depois do redesenho (setas, reordenar…)
  const active = document.activeElement;
  const keepFk = active && root.contains(active) ? active.getAttribute('data-fk') : null;

  let body;
  if(deep){
    body = nav.level === 'area' ? discAreaLevel(nav) : nav.level === 'discipline' ? discDisciplineLevel(nav) : discTopicLevel(nav);
  } else {
    const openCount = DeadlineEngine.open().length;
    const tabs = h('div', { class:'tabs', role:'tablist', 'aria-label':'Disciplinas e prazos' });
    [['disciplines', 'Disciplinas', null], ['deadlines', 'Prazos', openCount || null]].forEach(([v, label, count]) => {
      const on = tab === v;
      tabs.append(h('button', { class:'tab', type:'button', role:'tab', id:'dtab-' + v, 'aria-selected': on ? 'true' : 'false',
        'aria-controls':'dpanel', tabindex: on ? '0' : '-1',
        onclick:() => { if(ui.discTab !== v){ ui.discTab = v; if(v === 'disciplines') ui.discNav = { level:'root' }; renderDisciplines(); Nav.sync('replace'); const t = $('#dtab-' + v); if(t) t.focus(); } } },
        label, count ? h('span', { class:'tab-count', text:String(count) }) : null));
    });
    tabs.addEventListener('keydown', (e) => {
      if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      ui.discTab = tab === 'deadlines' ? 'disciplines' : 'deadlines';
      if(ui.discTab === 'disciplines') ui.discNav = { level:'root' };
      renderDisciplines();
      Nav.sync('replace');          // abas irmãs: trocam o lugar, não empilham histórico
      const t = $('#dtab-' + ui.discTab); if(t) t.focus();
    });
    body = [tabs, h('div', { class:'tab-panel', id:'dpanel', role:'tabpanel', 'aria-labelledby':'dtab-' + tab },
      tab === 'deadlines' ? deadlinesPanel() : discRootLevel(nav))];
  }

  const dir = ui.discNavDir;
  ui.discNavDir = null;
  mount(root, h('div', { class:'narrow-screen disc-screen' + (dir ? ' nav-' + dir : '') }, body));

  const wanted = ui.discFocus || keepFk;
  ui.discFocus = null;
  ui.justCreated = null;
  if(wanted){
    const sel = '[data-fk="' + (window.CSS && CSS.escape ? CSS.escape(wanted) : wanted) + '"]';
    const el = root.querySelector(sel) || (dir ? root.querySelector('[data-fk="level-title"]') : null);
    if(el){
      try { el.focus({ preventScroll:true }); } catch(_){ el.focus(); }
      // campo de busca redesenhado: o cursor volta para o fim do texto digitado
      if(el.tagName === 'INPUT' && typeof el.setSelectionRange === 'function'){ const n = el.value.length; try { el.setSelectionRange(n, n); } catch(_){} }
    }
  }
}

/* ---------- peças compartilhadas ---------- */

/** Linha navegável do índice: título, uma linha de contexto, um sinal à direita e ›. */
function indexRow(o){
  const sub = (o.sub || []).filter(Boolean).map(s => typeof s === 'string' ? { text:s } : s);
  const isNew = o.fk && ui.justCreated === o.fk;
  return h('li', { class:'ix-row' + (o.cls ? ' ' + o.cls : '') + (isNew ? ' is-new' : '') },
    h('button', { class:'ix-main', type:'button', 'data-fk':o.fk, onclick:o.onOpen, 'aria-label':o.ariaLabel || null },
      o.lead || null,
      h('span', { class:'ix-text' },
        h('span', { class:'ix-t' }, h('span', { class:'ix-name' }, o.query ? highlightMatch(o.title, o.query) : o.title), o.tag ? h('span', { class:'state-tag', text:o.tag }) : null),
        sub.length ? h('span', { class:'ix-s' }, sub.map(s => h('span', { class:s.cls || null, text:s.text }))) : null),
      o.side || null,
      icon('i-next', 'ix-go')),
    o.after || null);
}

/**
 * Cabeçalho de nível. v6.2: o "voltar" existe em toda profundidade, no
 * computador e no celular, sempre no mesmo lugar e dizendo o DESTINO
 * ("← Tecnologia"). O caminho completo aparece no computador só quando
 * acrescenta algo ao voltar (três níveis ou mais) — nunca os dois repetindo o mesmo.
 */
function levelHead(trail, title, sub, tag){
  const parent = trail[trail.length - 2];
  const crumbs = trail.length >= 3 ? h('nav', { class:'crumbs', 'aria-label':'Você está em' },
    h('ol', null, trail.map((c, i) => h('li', null, i === trail.length - 1
      ? h('span', { 'aria-current':'page', text:c.label })
      : h('button', { class:'crumb-link', type:'button', onclick:c.go, text:c.label }))))) : null;
  const back = parent ? h('button', { class:'crumb-back', type:'button', onclick:parent.go, 'data-fk':'level-back',
      'aria-label':'Voltar para ' + parent.label, title:'Voltar para ' + parent.label },
    icon('i-back', 'btn-icon'), h('span', { class:'crumb-back-l', text:parent.label })) : null;
  return h('header', { class:'level-head' },
    h('div', { class:'level-nav' + (crumbs ? ' has-crumbs' : '') }, back, crumbs),
    h('h2', { class:'level-title', tabindex:'-1', 'data-fk':'level-title' }, h('span', { text:title }), tag ? h('span', { class:'state-tag', text:tag }) : null),
    sub ? h('p', { class:'level-sub', text:sub }) : null);
}

function discTrail(r){
  const t = [{ label:'Disciplinas', go:() => navDiscUp({ level:'root' }) }];
  if(r.level === 'root') return t;
  if(r.areaKey && (r.areaKey !== NO_AREA || r.areaMode)){
    const key = r.areaKey;
    t.push({ label: r.area ? r.area.name : NO_AREA_LABEL, go:() => navDiscUp({ level:'area', areaId:key }) });
  }
  if(r.disc && r.level !== 'area'){
    const d = r.disc, key = r.areaKey;
    t.push({ label:d.name, go:() => navDiscUp({ level:'discipline', disciplineId:d.id, areaId:key }) });
  }
  if(r.topic) t.push({ label:r.topic.name });
  else t[t.length - 1] = { label:t[t.length - 1].label };   // o nível atual não é link
  return t;
}

/** "+ Adicionar": disciplina ou área, sem dois botões competindo. */
function discAddMenu(){
  return menuButton('Adicionar', [
    { label:'Nova disciplina', run:() => openDisciplineModal(null) },
    { label:'Nova área de estudo', run:() => openAreaModal(null) }
  ], { ariaLabel:'Adicionar disciplina ou área', className:'btn primary sm', icon:'i-plus', fk:'add' });
}

/* ---------- nível 1 · o índice ---------- */
function discRootLevel(r){
  const parts = [];
  parts.push(h('div', { class:'panel-bar' },
    h('p', { class:'panel-lead' }, 'Organize o que você está estudando.', helpDot('estrutura')),
    discAddMenu()));

  const nudge = areaNudgeCard('disciplines');
  if(nudge) parts.push(nudge);

  const active = activeDisciplines();
  const archivedDiscs = state.disciplines.filter(d => d.archived);
  const hiddenAreas = state.areas.filter(a => !areaIsListed(a)).sort(sortByName);

  if(r.areaMode){
    /* v6.2 — aqui a lista é de ÁREAS: a busca procura só áreas. "Sem área"
       não é uma área: fica sempre no fim, fora da ordenação. */
    const looseAll = disciplinesIn(NO_AREA, true);
    parts.push(collectionView({
      key:'areas', kind:'areas', items: state.areas.filter(areaIsListed),
      tail: looseAll.length ? [{ text:NO_AREA_LABEL, render:(q) => noAreaRow(looseAll, q) }] : [],
      placeholder:'Buscar uma área…', label:'Buscar uma área',
      searchText: a => a.name,
      noResults:'Nenhuma área encontrada.',
      renderItems:(list, ctx) => h('ul', { class:'ix-list' }, list.map(a => areaRow(a, ctx.query)), ctx.tail.map(t => t.render(ctx.query)))
    }));
  } else if(active.length){
    parts.push(collectionView({
      key:'disc-root', kind:'disciplines', items: active,
      placeholder:'Buscar uma disciplina…', label:'Buscar uma disciplina',
      searchText: d => d.name,
      noResults:'Nenhuma disciplina encontrada.',
      renderItems:(list, ctx) => h('ul', { class:'ix-list' }, list.map(d => disciplineRow(d, ctx.query)))
    }));
  } else {
    parts.push(h('section', { class:'quiet-empty' }, emptyState('O que você está estudando?',
      'Comece com uma disciplina — por exemplo Matemática, Inglês, Anatomia ou Redes de Computadores. Áreas e tópicos podem vir depois.',
      h('div', { class:'empty-actions' },
        h('button', { class:'btn primary', type:'button', text:'Adicionar uma disciplina', onclick:() => openDisciplineModal(null) }),
        h('button', { class:'linkbtn muted', type:'button', text:'Como organizar meus estudos?', onclick:() => openInteractiveGuide('ig-estrutura') })))));
  }

  const foot = [];
  // sem Áreas, as disciplinas arquivadas continuam acessíveis aqui mesmo
  if(!r.areaMode && archivedDiscs.length){
    foot.push(h('button', { class:'linkbtn muted', type:'button', 'aria-pressed': ui.showArchivedDisciplines ? 'true' : 'false',
      text: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : `Disciplinas arquivadas (${archivedDiscs.length})`,
      onclick:() => { ui.showArchivedDisciplines = !ui.showArchivedDisciplines; renderDisciplines(); } }));
  }
  if(hiddenAreas.length){
    foot.push(h('button', { class:'linkbtn muted', type:'button', 'aria-pressed': ui.showArchivedAreas ? 'true' : 'false',
      text: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : `Áreas arquivadas (${hiddenAreas.length})`,
      onclick:() => { ui.showArchivedAreas = !ui.showArchivedAreas; renderDisciplines(); } }));
  }
  if(foot.length) parts.push(h('div', { class:'panel-foot' }, foot));
  if(!r.areaMode && ui.showArchivedDisciplines && archivedDiscs.length){
    parts.push(h('section', { class:'ix-archived', 'aria-label':'Disciplinas arquivadas' },
      h('ul', { class:'ix-list' }, archivedDiscs.slice().sort(sortByName).map(d => disciplineRow(d)))));
  }
  if(ui.showArchivedAreas && hiddenAreas.length){
    parts.push(h('section', { class:'ix-archived', 'aria-label':'Áreas arquivadas' },
      h('ul', { class:'ix-list' }, hiddenAreas.map(a => areaRow(a)))));
  }
  return parts;
}

function areaRow(a, query){
  const list = disciplinesIn(a.id, false);
  const due = sum(list, d => ReviewEngine.dueCountFor(d.id));
  const sub = [
    list.length ? plural(list.length, 'disciplina', 'disciplinas') : 'Nenhuma disciplina ainda',
    due ? { text:`${plural(due, 'revisão', 'revisões')} hoje`, cls:'is-due' } : null
  ];
  return indexRow({
    fk:'area-' + a.id, title:a.name, query, tag: a.archived ? 'arquivada' : null, sub,
    cls: a.archived ? 'is-archived' : null,
    ariaLabel: `${a.name}${a.archived ? ' (arquivada)' : ''}. ${sub.filter(Boolean).map(s => s.text || s).join(', ')}. Abrir área`,
    onOpen:() => openArea(a.id)
  });
}

function noAreaRow(all, query){
  const active = all.filter(d => !d.archived).length;
  const sub = active
    ? [plural(active, 'disciplina', 'disciplinas'), active === 1 ? 'ainda não organizada' : 'ainda não organizadas']
    : [plural(all.length, 'disciplina arquivada', 'disciplinas arquivadas')];
  return indexRow({
    fk:'area-' + NO_AREA, title:NO_AREA_LABEL, query, sub, cls:'is-loose',
    ariaLabel:`${NO_AREA_LABEL}: ${sub.join(', ')}. Abrir`,
    onOpen:() => openArea(NO_AREA)
  });
}

/** Linha de disciplina: nome, contexto curto e a prioridade — sempre, de 1 a 5. */
function disciplineRow(d, query){
  const prog = disciplineProgress(d.id);
  const last = lastStudyISO(d.id);
  const due = d.archived ? 0 : ReviewEngine.dueCountFor(d.id);
  const sub = [
    prog.total ? plural(prog.total, 'tópico', 'tópicos') : 'sem tópicos',
    due > 0 ? { text:`${plural(due, 'revisão', 'revisões')} hoje`, cls:'is-due' } : null,
    last ? `estudada ${fmtRelativePast(last)}` : 'ainda não estudada'
  ];
  const p = PriorityEngine.clamp(d.priority);
  return indexRow({
    fk:'disc-' + d.id, title:d.name, query: typeof query === 'string' ? query : '', tag: d.archived ? 'arquivada' : null, sub,
    cls: d.archived ? 'is-archived' : null,
    side: priorityMark(p, { compact:true }),
    ariaLabel: `${d.name}${d.archived ? ' (arquivada)' : ''}. ${sub.filter(Boolean).map(s => s.text || s).join(', ')}. Prioridade ${priorityText(p)}. Abrir`,
    onOpen:() => openDisciplineDetail(d.id)
  });
}

/* ---------- nível 2 · uma Área (ou "Sem área") ---------- */
function discAreaLevel(r){
  const isNone = r.areaKey === NO_AREA;
  const a = r.area;
  const all = disciplinesIn(r.areaKey, true);
  const active = all.filter(d => !d.archived);
  const archived = all.filter(d => d.archived);
  const title = isNone ? NO_AREA_LABEL : a.name;
  const sub = isNone
    ? 'Disciplinas que ainda não estão em uma área.'
    : (active.length ? plural(active.length, 'disciplina', 'disciplinas') : 'Nenhuma disciplina ainda');
  const parts = [levelHead(discTrail(r), title, sub, !isNone && a.archived ? 'arquivada' : null)];

  const addBtn = h('button', { class:'btn primary sm', type:'button', 'data-fk':'add-disc',
    onclick:() => openDisciplineModal(null, { areaId: isNone ? null : a.id }) }, icon('i-plus'), 'Adicionar disciplina');
  let more = null;
  if(!isNone){
    more = menuButton('Mais', [
      { label:'Renomear', run:() => openAreaModal(a, { mode:'rename' }) },
      { label:'Escolher disciplinas desta área', run:() => openAreaModal(a) },
      { label: a.archived ? 'Reativar área' : 'Arquivar área', run:() => a.archived ? unarchiveArea(a.id) : archiveArea(a.id) },
      { label:'Excluir área', run:() => deleteArea(a.id) }
    ], { ariaLabel:'Mais ações para ' + a.name, fk:'more' });
  } else if(active.length && state.areas.some(x => !x.archived)){
    more = h('button', { class:'linkbtn muted', type:'button', text:'Organizar em uma área',
      onclick:() => openAreaModal(null, { preselect: active.map(d => d.id) }) });
  }
  parts.push(h('div', { class:'level-actions' }, a && a.archived ? null : addBtn, more));

  if(a && a.archived){
    parts.push(h('p', { class:'inline-note' },
      h('span', { class:'in-text', text:'Esta área está arquivada. Ela fica fora da lista principal, com tudo preservado.' }),
      h('span', { class:'in-actions' }, h('button', { class:'linkbtn', type:'button', text:'Reativar', onclick:() => unarchiveArea(a.id) }))));
  }

  if(active.length){
    /* v6.2 — dentro de uma área, a busca procura só as disciplinas DESTA área */
    const where = isNone ? 'sem área' : 'em ' + a.name;
    parts.push(collectionView({
      key:'area:' + r.areaKey, kind:'disciplines', items: active,
      placeholder: isNone ? 'Buscar disciplina sem área…' : `Buscar disciplina em ${a.name}…`,
      label: isNone ? 'Buscar disciplina sem área' : `Buscar disciplina em ${a.name}`,
      searchText: d => d.name,
      noResults:`Nenhuma disciplina encontrada ${where}.`,
      renderItems:(list, ctx) => h('ul', { class:'ix-list' }, list.map(d => disciplineRow(d, ctx.query)))
    }));
  } else if(a && ui.areaJustCreated === a.id){
    parts.push(h('div', { class:'invite', role:'status' },
      h('p', { class:'invite-t', text:`${a.name} criada.` }),
      h('p', { class:'invite-s', text:'Quer adicionar uma disciplina agora?' }),
      h('div', { class:'invite-actions' },
        h('button', { class:'btn primary sm', type:'button', text:'Adicionar disciplina', onclick:() => openDisciplineModal(null, { areaId:a.id }) }),
        h('button', { class:'btn ghost sm', type:'button', text:'Agora não', 'data-fk':'invite-later',
          onclick:() => { ui.areaJustCreated = null; ui.discFocus = 'add-disc'; renderDisciplines(); } }))));
  } else if(!(a && a.archived)){
    parts.push(h('div', { class:'ix-empty' },
      h('p', { text: isNone ? 'Nenhuma disciplina sem área.' : 'Nenhuma disciplina aqui ainda.' }),
      isNone ? null : h('p', { class:'ix-empty-s', text:'Disciplina é o que você estuda — por exemplo, Redes de Computadores dentro de Tecnologia.' })));
  }

  if(archived.length){
    parts.push(h('div', { class:'panel-foot' },
      h('button', { class:'linkbtn muted', type:'button', 'aria-pressed': ui.showArchivedDisciplines ? 'true' : 'false',
        text: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : `Arquivadas (${archived.length})`,
        onclick:() => { ui.showArchivedDisciplines = !ui.showArchivedDisciplines; renderDisciplines(); } })));
    if(ui.showArchivedDisciplines) parts.push(h('ul', { class:'ix-list ix-archived' }, archived.map(d => disciplineRow(d))));
  }
  return parts;
}

/* ---------- nível 3 · uma Disciplina ---------- */
function discDisciplineLevel(r){
  const d = r.disc;
  const prog = disciplineProgress(d.id);
  const weekProg = PlannerEngine.getCurrentWeekProgress().perDiscipline.find(x => x.disciplineId === d.id);
  const weekRealized = weekProg ? weekProg.realized : minutesInRange({ start:startOfWeek(today()), end:endOfWeek(today()) }, d.id);
  const topics = topicsOf(d.id, true);
  const visible = topics.filter(t => !t.archived);
  const parts = [levelHead(discTrail(r), d.name, null, d.archived ? 'arquivada' : null)];

  parts.push(priorityInline({ value:d.priority, context:'discipline', key:'dprio-' + d.id, label:'Prioridade de ' + d.name,
    onCommit: v => setDisciplinePriority(d.id, v) }));

  parts.push(h('div', { class:'facts' },
    fact(weekProg && weekProg.planned > 0 ? `${fmtDuration(weekRealized)} de ${fmtDuration(weekProg.planned)}` : fmtDuration(weekRealized), 'nesta semana'),
    fact(prog.coverage !== null ? fmtPct(prog.coverage) : '—', 'conteúdo estudado'),
    fact(capFirst(fmtRelativePast(lastStudyISO(d.id))), 'último estudo')));

  parts.push(h('div', { class:'level-actions' },
    d.archived
      ? h('button', { class:'btn primary sm', type:'button', text:'Reativar', onclick:() => toggleArchiveDiscipline(d.id) })
      : h('button', { class:'btn primary sm', type:'button', 'data-fk':'study', onclick:() => openRegisterModal({ mode:'timer', disciplineId:d.id }) }, icon('i-play'), 'Começar a estudar'),
    h('button', { class:'btn ghost sm', type:'button', text:'Editar', 'data-fk':'edit', onclick:() => openDisciplineModal(d) }),
    menuButton('Mais', [
      { label:'Adicionar prazo', run:() => openDeadlineModal(null, { disciplineId:d.id }) },
      { label:'Analisar esta disciplina', run:() => applyAnalyticsQuery({ scopeType:'discipline', scopeId:d.id, periodPreset:'30d', focus:'overview' }) },
      { label: d.archived ? 'Reativar' : 'Arquivar', run:() => toggleArchiveDiscipline(d.id) }
    ], { ariaLabel:'Mais ações para ' + d.name, fk:'more' })));

  /* tópicos: escrever o nome e confirmar (prioridade e revisão) num modal curto */
  const addInput = h('input', { type:'text', id:'dd-new-topic', maxlength:'80', autocomplete:'off', 'data-fk':'topic-new',
    placeholder: visible.length ? 'Nome do novo tópico' : 'Ex.: OSPF', 'aria-label':'Nome do novo tópico' });
  const addHint = h('p', { class:'hint warn-text', hidden:true });
  const submitAdd = () => {
    const name = addInput.value.trim();
    if(!name){ addHint.hidden = false; addHint.textContent = 'Escreva o nome do tópico primeiro.'; addInput.focus(); return; }
    openTopicModal(d.id, null, { name });
  };
  addInput.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); submitAdd(); } });

  const topicSection = h('section', { class:'level-section', 'aria-labelledby':'dd-topics' },
    h('div', { class:'section-head' },
      h('h3', { class:'section-title', id:'dd-topics' }, 'Tópicos', helpDot('prioridadeTopico')),
      visible.length ? h('span', { class:'section-count', text:String(visible.length) }) : null));
  if(!visible.length){
    topicSection.append(h('p', { class:'ix-empty-s', text:'Tópicos são as partes da disciplina — por exemplo, em Redes de Computadores: Subnetting, VLAN, OSPF. Eles entram nas revisões.' }));
  } else {
    /* v6.2 — busca só nos tópicos desta disciplina. A ordem personalizada (↑ ↓)
       continua sendo o padrão; as outras ordenações são só visões. */
    topicSection.append(collectionView({
      key:'topics:' + d.id, kind:'topics', items: visible,
      placeholder:`Buscar tópico em ${d.name}…`, label:`Buscar tópico em ${d.name}`,
      searchText: t => t.name,
      noResults:`Nenhum tópico encontrado em ${d.name}.`,
      renderItems:(list, ctx) => {
        const manual = ctx.sort === 'custom' && !ctx.filtered;     // reordenar só faz sentido na ordem manual completa
        return h('ul', { class:'ix-list is-topics' }, list.map((t, i) => topicRow(t, i, list.length, { query:ctx.query, reorder:manual })));
      }
    }));
  }
  if(!d.archived){
    topicSection.append(
      h('div', { class:'topic-add-row' }, addInput,
        h('button', { class:'btn ghost sm', type:'button', onclick:submitAdd }, icon('i-plus'), 'Adicionar tópico')),
      addHint,
      h('button', { class:'linkbtn muted topic-bulk', type:'button', text:'Adicionar vários de uma vez', onclick:() => openBulkTopicModal(d.id) }));
  }
  const archivedTopics = topics.filter(t => t.archived);
  if(archivedTopics.length){
    topicSection.append(h('details', { class:'disclosure small' },
      h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', text:String(archivedTopics.length) })),
      h('div', { class:'disclosure-body' }, h('ul', { class:'ix-list is-topics' }, archivedTopics.map(t => indexRow({
        fk:'topic-' + t.id, lead: statusMark(topicStatus(t)), title:t.name, tag:'arquivado', sub:['histórico preservado'], cls:'is-archived',
        onOpen:() => openTopicPage(t.id) }))))));
  }
  parts.push(topicSection);

  const dls = state.deadlines.filter(x => x.disciplineId === d.id && !DeadlineEngine.isDone(x))
    .sort((a,b) => str(a.date).localeCompare(str(b.date)));
  if(dls.length){
    parts.push(h('section', { class:'level-section', 'aria-labelledby':'dd-dl' },
      h('div', { class:'section-head' }, h('h3', { class:'section-title', id:'dd-dl', text:'Prazos' })),
      h('ul', { class:'dl-line-list' }, dls.slice(0, 4).map(dl => deadlineLine(dl, null, false)))));
  }
  return parts;
}

function topicRow(t, i, count, opts){
  const o = opts || { reorder:true };
  const st = topicStatus(t);
  const meta = t.reviewEnabled && t.reviewDueDate ? `revisão ${fmtRelativeFuture(t.reviewDueDate)}` : TOPIC_STATUS_LABEL[st];
  const p = PriorityEngine.clamp(t.priority);
  return indexRow({
    fk:'topic-' + t.id, lead: statusMark(st), title:t.name, query:o.query || '', sub:[meta],
    side: priorityMark(p, { compact:true }),
    ariaLabel:`${t.name}. ${TOPIC_STATUS_LABEL[st]}${meta !== TOPIC_STATUS_LABEL[st] ? ', ' + meta : ''}. Prioridade ${priorityText(p)}. Abrir`,
    onOpen:() => openTopicPage(t.id),
    after: !o.reorder ? null : h('span', { class:'row-actions' },
      h('button', { class:'icon-btn mini', type:'button', text:'↑', title:'Subir', 'aria-label':`Subir ${t.name}`, 'data-fk':'up-' + t.id, disabled: i === 0,
        onclick: once(() => moveTopic(t.id, -1)) }),
      h('button', { class:'icon-btn mini', type:'button', text:'↓', title:'Descer', 'aria-label':`Descer ${t.name}`, 'data-fk':'down-' + t.id, disabled: i === count - 1,
        onclick: once(() => moveTopic(t.id, 1)) }))
  });
}

/* ---------- nível 4 · um Tópico ---------- */
function discTopicLevel(r){
  const t = r.topic;
  const parts = [levelHead(discTrail(r), t.name, null, t.archived ? 'arquivado' : null)];
  parts.push(priorityInline({ value:t.priority, context:'topic', key:'tprio-' + t.id, label:'Prioridade de ' + t.name,
    onCommit: v => setTopicPriority(t.id, v) }));
  parts.push(...topicDetailContent(t, { inDrawer:false }));
  return parts;
}

/**
 * Conteúdo do tópico, usado em dois lugares: a página dentro de Disciplinas e
 * o painel rápido aberto de outras telas (Hoje, Revisões, Análises, Prazos).
 */
function topicDetailContent(t, ctx){
  const c = ctx || {};
  const leave = () => { if(c.inDrawer) Drawer.close(); };
  const disc = getDiscipline(t.disciplineId);
  const sess = sessionsOfTopic(t.id).slice().sort((a,b) => b.date.localeCompare(a.date));
  const totalMin = sum(sess, s => s.minutes);
  const st = topicStatus(t);

  const kv = h('dl', { class:'kv-list' });
  const add = (k, v) => kv.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
  add('Situação', TOPIC_STATUS_LABEL[st]);
  add('Próxima revisão', t.reviewEnabled ? (t.reviewDueDate ? `${capFirst(fmtRelativeFuture(t.reviewDueDate))} · ${fmtDateBR(t.reviewDueDate)}` : 'depois do primeiro estudo') : 'revisões desligadas');
  // v6.5: é uma ESTIMATIVA tirada das respostas da pessoa nas revisões — dita assim, não como medida de memória
  add('Consolidação estimada', t.masteryLevel ? `${t.masteryLevel} de 5 · pelas suas respostas nas revisões` : 'ainda sem revisões');
  add('Tempo estudado', sess.length ? `${fmtDuration(totalMin)} em ${plural(sess.length, 'vez', 'vezes')}` : 'nenhum estudo ainda');

  const actions = h('div', { class:'level-actions' },
    t.archived
      ? h('button', { class:'btn primary sm', type:'button', text:'Reativar tópico', onclick: once(async () => {
          if(!(await quickPatch('topics', t.id, { archived:false }, 'Não foi possível reativar o tópico'))) return;
          await safeRefresh(); toast(t.name, 'ok', { title:'Tópico reativado' }); }) })
      : h('button', { class:'btn primary sm', type:'button', 'data-fk':'study', onclick:() => { leave(); startTimer(t.disciplineId, t.id, null); } }, icon('i-play'), 'Começar a estudar'),
    !t.archived && t.reviewEnabled ? h('button', { class:'btn ghost sm', type:'button', text:'Revisar agora', onclick:() => { leave(); startReview(t.id); } }) : null,
    h('button', { class:'btn ghost sm', type:'button', text:'Editar', 'data-fk':'edit', onclick:() => { leave(); openTopicModal(t.disciplineId, t); } }),
    c.inDrawer ? h('button', { class:'linkbtn muted', type:'button', text:'abrir em Disciplinas', onclick:() => openTopicPage(t.id) }) : null);

  const recent = h('ul', { class:'line-list' });
  if(!sess.length){
    recent.appendChild(h('li', { class:'hint', text:'Nenhum estudo registrado neste tópico ainda.' }));
  } else {
    sess.slice(0, 6).forEach(s => {
      const diff = difficultyInfo(s.difficulty);
      recent.appendChild(h('li', { class:'line' },
        h('button', { class:'line-main', type:'button', 'aria-label':`Editar o estudo de ${fmtDateBR(s.date)}`, onclick:() => { leave(); openEditSessionModal(s.id); } },
          h('span', { class:'line-t', text: fmtDateBR(s.date) }),
          h('span', { class:'line-s', text: [s.type ? sessionTypeLabel(s.type) : null, diff ? diff.label : null, reviewOutcomeLabel(s.reviewOutcome)].filter(Boolean).join(' · ') || '—' })),
        h('span', { class:'line-v num', text: fmtDuration(s.minutes) })));
    });
  }

  const tDeadlines = state.deadlines.filter(dl => !DeadlineEngine.isDone(dl) &&
    (dl.topicId === t.id || (!dl.topicId && dl.disciplineId === t.disciplineId)))
    .sort((a,b) => str(a.date).localeCompare(str(b.date)));

  const more = h('details', { class:'disclosure small' },
    h('summary', null, h('span', { text:'Mais detalhes' })),
    h('div', { class:'disclosure-body' },
      (() => { const d2 = h('dl', { class:'kv-list' }); const a2 = (k, v) => d2.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
        a2('Último estudo', capFirst(fmtRelativePast(t.lastStudiedAt)));
        a2('Próxima revisão a cada', t.reviewIntervalDays ? plural(t.reviewIntervalDays, 'dia', 'dias') : '—');
        a2('Revisões feitas', String(t.reviewRepetitions || 0));
        a2('Vezes que esqueceu', String(t.reviewFailures || 0));
        if(disc) a2('Prioridade da disciplina', priorityText(disc.priority));
        return d2; })()));

  return [
    kv,
    actions,
    tDeadlines.length ? h('section', { class:'level-section' },
      h('div', { class:'section-head' }, h('h3', { class:'section-title', text:'Prazos relacionados' })),
      h('ul', { class:'dl-line-list' }, tDeadlines.slice(0, 3).map(dl => deadlineLine(dl, null, false)))) : null,
    h('section', { class:'level-section' },
      h('div', { class:'section-head' }, h('h3', { class:'section-title', text:'Estudos recentes' })),
      recent,
      sess.length > 6 ? h('p', { class:'hint', style:'margin-top:8px', text:`+ ${plural(sess.length - 6, 'estudo mais antigo', 'estudos mais antigos')} no Histórico.` }) : null),
    more
  ];
}

/** Painel rápido do tópico, para quem está em outra tela e só quer consultar. */
function openTopicDrawer(topicId){
  const t = getTopic(topicId);
  if(!t) return;
  const disc = getDiscipline(t.disciplineId);
  const body = h('div', { class:'topic-drawer' },
    h('p', { class:'detail-path' }, h('span', { text: disc ? disciplinePath(disc) : '' })),
    h('div', { class:'detail-prio' }, h('span', { text:'Prioridade' }), priorityMark(t.priority)),
    ...topicDetailContent(t, { inDrawer:true }));
  Drawer.open(t.name, body);
}

async function setDisciplinePriority(id, p){
  const d = getDiscipline(id);
  if(!d || PriorityEngine.clamp(d.priority) === p) return;
  // v6.5: só o campo `priority` é gravado, sobre o registro como está no banco
  if(!(await quickPatch('disciplines', id, { priority:p }, 'Não foi possível salvar a prioridade'))) return;
  ui.planDraft = null;
  await safeRefresh();
  toast(`${d.name} · ${priorityText(p)}`, 'ok', { title:'Prioridade atualizada' });
}
async function setTopicPriority(id, p){
  const t = getTopic(id);
  if(!t || PriorityEngine.clamp(t.priority) === p) return;
  if(!(await quickPatch('topics', id, { priority:p }, 'Não foi possível salvar a prioridade'))) return;
  await safeRefresh();
  toast(`${t.name} · ${priorityText(p)}`, 'ok', { title:'Prioridade atualizada' });
}

/* ---------- incentivo gentil a organizar em Áreas (nunca bloqueia) ---------- */
const AREA_NUDGE_SNOOZE_DAYS = 21;
function areaNudgeCard(where){
  if(state.settings.helpMode === 'off') return null;
  if(where !== 'disciplines') return null;
  const loose = activeDisciplines().filter(d => !d.areaId || !getArea(d.areaId));
  if(loose.length < 2) return null;
  const dismissed = state.meta.areaNudgeDismissedAt;
  if(dismissed){
    const days = Math.floor((Date.now() - new Date(dismissed).getTime()) / 86400000);
    if(days < AREA_NUDGE_SNOOZE_DAYS) return null;
  }
  return h('div', { class:'inline-note', role:'note' },
    h('span', { class:'in-text', text:`${loose.length} disciplinas ainda estão sem área. Agrupar ajuda a encontrar — por exemplo, Tecnologia › ${loose[0].name}.` }),
    h('span', { class:'in-actions' },
      h('button', { class:'linkbtn', type:'button', text:'Organizar', onclick:() => openAreaModal(null, { preselect: loose.map(d => d.id) }) }),
      h('button', { class:'linkbtn muted', type:'button', text:'Agora não', onclick: async () => {
        await setMeta('areaNudgeDismissedAt', nowISO());
        render();
        toast('Você pode criar áreas quando quiser, em Disciplinas → Adicionar.', 'info');
      } })));
}

function isDesktopUI(){
  return window.matchMedia('(min-width:861px)').matches;
}

/** Um fato em linha: valor e rótulo, sem caixa. */
function fact(value, label){
  return h('div', { class:'fact' }, h('span', { class:'fact-v', text:String(value) }), h('span', { class:'fact-l', text:label }));
}

/* ---------- CRUD: Áreas de Estudo ---------- */
/**
 * Criar, renomear ou escolher as disciplinas de uma Área.
 * opts.mode === 'rename' mostra só o nome; opts.preselect marca disciplinas.
 * Uma Área nova passa a existir imediatamente — com ou sem disciplinas — e a
 * tela abre nela, com um convite (não obrigatório) para adicionar a primeira.
 */
function openAreaModal(area, opts){
  // Só é edição quando recebemos uma área de verdade. Protege handlers que
  // repassem o Event por engano (ex.: onclick:openAreaModal).
  if(area && typeof area.id !== 'string'){
    console.warn('openAreaModal recebeu um argumento que não é uma área; tratando como nova área.', area);
    area = null;
  }
  const o = (opts && !(opts instanceof Event)) ? opts : {};
  const renameOnly = !!(area && o.mode === 'rename');
  openModal(close => {
    const nameIn = h('input', { type:'text', id:'ar-name', value: area ? area.name : '', placeholder:'Ex.: Tecnologia', maxlength:'60', autocomplete:'off' });

    // disciplinas que podem ficar nesta área: as desta área e as ainda sem área
    const candidates = renameOnly ? [] : activeDisciplines()
      .filter(d => (area && d.areaId === area.id) || !d.areaId || !getArea(d.areaId))
      .sort(sortByName);
    const preselect = new Set(o.preselect || []);
    const checks = candidates.map(d => {
      const c = h('input', { type:'checkbox', value:d.id, checked: area ? d.areaId === area.id : preselect.has(d.id) });
      return { d, c };
    });

    const content = h('div',
      area ? null : h('p', { class:'modal-sub', text:'Uma área reúne disciplinas relacionadas. Por exemplo: Tecnologia → Redes de Computadores → OSPF.' }),
      h('div', { class:'field' }, h('label', { for:'ar-name', text:'Nome da área' }), nameIn,
        area ? null : h('p', { class:'hint', text:'Outros exemplos: Faculdade, Escola, Idiomas, Música, Concurso.' })),
      checks.length ? h('fieldset', { class:'check-list' },
        h('legend', { text: area ? 'Disciplinas desta área' : 'Trazer para esta área (opcional)' }),
        checks.map(({ d, c }) => h('label', { class:'check-row' }, c, h('span', { text:d.name })))) : null
    );
    nameIn.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); saveBtn.click(); } });

    let savingArea = false;
    const saveBtn = h('button', { class:'btn primary', type:'button', text: area ? 'Salvar' : 'Criar área', onclick: async () => {
      if(savingArea) return;
      const name = nameIn.value.trim();
      if(!name){ nameIn.setAttribute('aria-invalid','true'); nameIn.focus(); toast('Escreva o nome da área.', 'err'); return; }
      const dup = state.areas.find(x => x.name.toLowerCase() === name.toLowerCase() && (!area || x.id !== area.id));
      if(dup){ nameIn.setAttribute('aria-invalid','true'); toast(`Você já tem a área "${dup.name}".`, 'err'); return; }
      const target = area ? Object.assign({}, area, { name }) : newArea(name);
      const changed = [];
      checks.forEach(({ d, c }) => {
        const want = c.checked ? target.id : (d.areaId === target.id ? null : d.areaId);
        if((d.areaId || null) !== (want || null)) changed.push({ id:d.id, areaId: want || null });
      });
      /* v6.5 — grava primeiro, fecha depois. Cada disciplina recebe só o campo
         `areaId`, sobre o registro como está no banco: uma prioridade alterada
         em outra aba não é desfeita por esta janela. */
      savingArea = true;
      saveBtn.disabled = true; saveBtn.setAttribute('aria-busy', 'true');
      try {
        await writeBatch([
          area ? { op:'patch', store:'areas', id:area.id, changes:{ name }, required:true } : { op:'put', store:'areas', value:target }
        ].concat(changed.map(d => ({ op:'patch', store:'disciplines', id:d.id, changes:{ areaId:d.areaId } }))));
      } catch(err){
        savingArea = false;
        saveBtn.disabled = false; saveBtn.removeAttribute('aria-busy');
        if(err && err.missing){ close(); await safeRefresh(); toast('Ela foi excluída em outra aba. Nada foi gravado.', 'info', { title:'Esta área não existe mais' }); return; }
        console.error('Falha ao salvar a área:', err);
        toast('Tente novamente. O que você preencheu continua aqui.', 'err', { title:'Não foi possível salvar a área' });
        return;
      }
      close();
      try {
        ui.planDraft = null;
        await refresh();
        const moved = changed.filter(d => d.areaId === target.id).length;
        if(area){
          toast(moved ? `${plural(moved, 'disciplina', 'disciplinas')} em ${name}.` : name, 'ok', { title: renameOnly ? 'Área renomeada' : 'Área atualizada' });
        } else {
          // a área nova aparece na hora: a tela abre nela
          if(!moved) ui.areaJustCreated = target.id;
          openArea(target.id);
          toast(moved ? `${plural(moved, 'disciplina organizada', 'disciplinas organizadas')} nela.` : '', 'ok', { title:`${name} criada` });
        }
      } catch(err){
        // a área JÁ foi gravada; o que falhou foi só redesenhar a tela
        console.error('Falha ao atualizar a tela depois de salvar a área:', err);
      }
    } });

    const actions = [ h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }), saveBtn ];
    return { title: renameOnly ? 'Renomear área' : area ? 'Disciplinas da área' : 'Nova área de estudo', content, actions };
  }, { size: renameOnly ? 'narrow' : null });
}

/** Excluir uma área nunca apaga disciplinas: elas voltam para "Sem área". */
async function deleteArea(id){
  const area = getArea(id);
  if(!area) return;
  const inside = state.disciplines.filter(d => d.areaId === area.id);
  const ok = await confirmModal(inside.length
    ? `Excluir a área "${area.name}"? ${inside.length === 1 ? 'A disciplina dela fica' : `As ${inside.length} disciplinas dela ficam`} sem área — nenhuma disciplina, tópico ou estudo é apagado.`
    : `Excluir a área "${area.name}"?`, { confirmLabel:'Excluir área' });
  if(!ok) return;
  try {
    // v6.5: as disciplinas da área são lidas DENTRO da transação (outra aba pode ter movido alguma)
    await DB.atomic(['areas','disciplines'], async api => {
      const discs = await api.getAllByIndex('disciplines', 'areaId', area.id);
      const ts = nowISO();
      api.delete('areas', area.id);
      discs.forEach(d => api.put('disciplines', Object.assign({}, d, { areaId:null, updatedAt: ts })));
    });
    ui.planDraft = null;
    await safeRefresh();
    // a área não existe mais: o lugar atual é corrigido (sem deixar um "voltar" para ela)
    if(ui.view === 'disciplines') navDisc(inside.length && usesAreas() ? { level:'area', areaId:NO_AREA } : { level:'root' }, 'back', { replace:true });
    toast(inside.length ? `As disciplinas continuam disponíveis em "${NO_AREA_LABEL}".` : area.name, 'info', { title:'Área excluída' });
  } catch(err){
    console.error('Falha ao excluir a área:', err);
    toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível excluir a área' });
  }
}

/**
 * Arquivar uma área arquiva junto as disciplinas ativas dela — nada fica
 * órfão numa área escondida. Todo o histórico é preservado.
 */
async function archiveArea(id){
  const area = getArea(id);
  if(!area || area.archived) return;
  const inside = state.disciplines.filter(d => d.areaId === area.id && !d.archived);
  const ok = await confirmModal(inside.length
    ? `Arquivar "${area.name}"? ${inside.length === 1 ? 'A disciplina dela também é arquivada' : `As ${inside.length} disciplinas dela também são arquivadas`}: saem do planejamento, das sugestões e das revisões. Todo o histórico é preservado.`
    : `Arquivar "${area.name}"? Ela sai da lista principal e pode ser reativada quando quiser.`,
    { confirmLabel:'Arquivar', danger:false });
  if(!ok) return;
  try {
    await writeBatch([{ op:'patch', store:'areas', id:area.id, changes:{ archived:true } }]
      .concat(inside.map(d => ({ op:'patch', store:'disciplines', id:d.id, changes:{ archived:true } }))));
    ui.planDraft = null;
    await safeRefresh();
    if(ui.view === 'disciplines') navDisc({ level:'root' }, 'back', { replace:true });
    toast(inside.length ? `${plural(inside.length, 'disciplina arquivada', 'disciplinas arquivadas')} junto. Nada foi apagado.` : area.name, 'ok', { title:'Área arquivada' });
  } catch(err){
    console.error('Falha ao arquivar a área:', err);
    toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível arquivar a área' });
  }
}

async function unarchiveArea(id){
  const area = getArea(id);
  if(!area) return;
  const archivedInside = state.disciplines.filter(d => d.areaId === area.id && d.archived);
  let alsoDiscs = false;
  if(archivedInside.length){
    alsoDiscs = await confirmModal(`Reativar também ${archivedInside.length === 1 ? 'a disciplina arquivada' : `as ${archivedInside.length} disciplinas arquivadas`} de "${area.name}"?`,
      { title:'Reativar área', confirmLabel:'Reativar tudo', cancelLabel:'Só a área', danger:false });
  }
  try {
    await writeBatch([{ op:'patch', store:'areas', id:area.id, changes:{ archived:false } }]
      .concat(alsoDiscs ? archivedInside.map(d => ({ op:'patch', store:'disciplines', id:d.id, changes:{ archived:false } })) : []));
    ui.planDraft = null;
    await safeRefresh();
    toast(alsoDiscs ? `${plural(archivedInside.length, 'disciplina reativada', 'disciplinas reativadas')} junto.` : area.name, 'ok', { title:'Área reativada' });
  } catch(err){
    console.error('Falha ao reativar a área:', err);
    toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível reativar a área' });
  }
}

/* ---------- CRUD: Disciplinas ---------- */
/**
 * Nova disciplina / editar. A relação com a Área aparece logo abaixo do nome:
 * "Onde quer organizar?". Dá para criar uma Área ali mesmo, sem sair do fluxo;
 * as duas gravações acontecem na MESMA transação.
 */
function openDisciplineModal(disc, opts){
  if(disc && typeof disc.id !== 'string') disc = null;       // Event recebido por engano
  const o = (opts && !(opts instanceof Event)) ? opts : {};
  openModal(close => {
    const nameIn = h('input', { type:'text', id:'dm-name', value: disc ? disc.name : '', placeholder:'Ex.: Redes de Computadores', maxlength:'80', autocomplete:'off' });
    let priority = disc ? PriorityEngine.clamp(disc.priority) : PRIORITY_DEFAULT;

    /* Onde organizar — opcional, com criação de Área na hora */
    const initialArea = disc ? (disc.areaId && getArea(disc.areaId) ? disc.areaId : '') : (o.areaId && getArea(o.areaId) ? o.areaId : '');
    const areaSel = h('select', { id:'dm-area' });
    state.areas.filter(a => !a.archived || a.id === initialArea).slice().sort(sortByName)
      .forEach(a => areaSel.appendChild(h('option', { value:a.id, selected: a.id === initialArea }, a.name + (a.archived ? ' (arquivada)' : ''))));
    areaSel.appendChild(h('option', { value:'', selected: !initialArea }, 'Sem área (organizar depois)'));
    areaSel.appendChild(h('option', { value:'__new__' }, '+ Criar nova área…'));
    const newAreaIn = h('input', { type:'text', id:'dm-new-area', maxlength:'60', placeholder:'Ex.: Certificações', autocomplete:'off', 'aria-label':'Nome da nova área' });
    const newAreaBox = h('div', { class:'inline-new', hidden:true },
      h('label', { for:'dm-new-area', text:'Nome da nova área' }), newAreaIn,
      h('p', { class:'hint', text:'A área é criada junto com a disciplina.' }));
    const areaHint = h('p', { class:'hint' });
    const syncArea = () => {
      const v = areaSel.value;
      newAreaBox.hidden = v !== '__new__';
      areaHint.textContent = v === '' ? 'Tudo bem deixar sem área. Ela aparece em "Sem área" e pode ser organizada depois.'
        : v === '__new__' ? '' : `Vai aparecer em ${(getArea(v) || {}).name || ''}.`;
      areaHint.hidden = !areaHint.textContent;
    };
    areaSel.addEventListener('change', () => { syncArea(); if(areaSel.value === '__new__') setTimeout(() => newAreaIn.focus(), 20); });
    syncArea();

    const prio = priorityPicker({ value:priority, context:'discipline', id:'dm-prio', label:'Prioridade', helpKey:'prioridade',
      onChange: v => { priority = v; } });

    let nature = disc ? (disc.contentNature || 'mixed') : 'mixed';
    let dStrategy = disc ? (disc.reviewStrategy || 'inherit') : 'inherit';
    let dMethod = disc ? (disc.preferredReviewMethod || 'inherit') : 'inherit';

    const natureSel = h('select', { id:'dm-nature' });
    CONTENT_NATURES.forEach(n => natureSel.appendChild(h('option', { value:n.v, selected:n.v === nature }, n.label + ' — ' + n.hint)));
    natureSel.addEventListener('change', () => { nature = natureSel.value; });

    const stratSel = h('select', { id:'dm-strategy' });
    [{ v:'inherit', label:'Padrão geral (' + strategyLabel(state.settings.defaultReviewStrategy) + ')' }]
      .concat(REVIEW_STRATEGIES.map(x => ({ v:x.v, label:x.label })))
      .forEach(x => stratSel.appendChild(h('option', { value:x.v, selected:x.v === dStrategy }, x.label)));
    stratSel.addEventListener('change', () => { dStrategy = stratSel.value; });

    const methodSel = h('select', { id:'dm-method' });
    [{ v:'inherit', label:'Padrão geral (' + methodLabel(state.settings.defaultReviewMethod) + ')' }]
      .concat(REVIEW_METHODS.map(m => ({ v:m.v, label:m.label })))
      .forEach(x => methodSel.appendChild(h('option', { value:x.v, selected:x.v === dMethod }, x.label)));
    methodSel.addEventListener('change', () => { dMethod = methodSel.value; });

    const advanced = h('details', { class:'advanced' },
      h('summary', null, 'Mais opções'),
      h('div', { class:'advanced-body' },
        h('p', { class:'hint', style:'margin:0 0 12px', text:'Tudo aqui já vem com um padrão que funciona. Mude só se quiser.' }),
        h('div', { class:'field' }, h('label', { for:'dm-nature' }, 'Tipo de conteúdo', helpDot('natureza')), natureSel,
          h('p', { class:'hint', text:'Ajuda o Ciclo a sugerir como revisar.' })),
        h('div', { class:'field' }, h('label', { for:'dm-strategy' }, 'Quando revisar', helpDot('estrategia')), stratSel),
        h('div', { class:'field tight' }, h('label', { for:'dm-method' }, 'Como revisar', helpDot('metodo')), methodSel)));

    const content = h('div',
      h('div', { class:'field' },
        h('label', { for:'dm-name', text: disc ? 'Nome' : 'O que você está estudando?' }), nameIn,
        disc ? null : h('p', { class:'hint', text:'Uma matéria, um idioma, uma certificação, um instrumento…' })),
      h('div', { class:'field' },
        h('label', { for:'dm-area' }, 'Onde quer organizar?', helpDot('areaEstudo')),
        areaSel, newAreaBox, areaHint),
      h('div', { class:'field' }, prio),
      advanced
    );
    nameIn.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); saveBtn.click(); } });

    let savingDisc = false;
    const saveBtn = h('button', { class:'btn primary', type:'button', text: disc ? 'Salvar' : 'Criar disciplina', onclick: async () => {
      if(savingDisc) return;
      const name = nameIn.value.trim();
      if(!name){ nameIn.setAttribute('aria-invalid','true'); nameIn.focus(); toast('Escreva o nome da disciplina.', 'err'); return; }
      const dup = state.disciplines.find(x => !x.archived && x.name.toLowerCase() === name.toLowerCase() && (!disc || x.id !== disc.id));
      if(dup){ nameIn.setAttribute('aria-invalid','true'); toast(`Você já tem "${dup.name}".`, 'err'); return; }

      let areaId = areaSel.value || null;
      let createdArea = null;
      if(areaId === '__new__'){
        const areaName = newAreaIn.value.trim();
        if(!areaName){ newAreaIn.setAttribute('aria-invalid','true'); newAreaIn.focus(); toast('Escreva o nome da nova área ou escolha "Sem área".', 'err'); return; }
        const existing = state.areas.find(a => a.name.toLowerCase() === areaName.toLowerCase());
        if(existing) areaId = existing.id;
        else { createdArea = newArea(areaName); areaId = createdArea.id; }
      }

      /* v6.5 — SALVAR PRIMEIRO, FECHAR DEPOIS. Se a gravação falhar, a janela
         continua aberta com tudo o que foi preenchido. Na edição, só os campos
         alterados são gravados, sobre o registro como está no banco. */
      savingDisc = true;
      saveBtn.disabled = true; saveBtn.setAttribute('aria-busy', 'true');
      const unlock = () => { savingDisc = false; saveBtn.disabled = false; saveBtn.removeAttribute('aria-busy'); };
      let entity;
      try {
        if(disc){
          if(createdArea) await DB.put('areas', createdArea);
          const res = await saveEntityEdit({ store:'disciplines', id:disc.id, base:disc, close, what:'esta disciplina',
            changes:{ name, areaId, priority, contentNature:nature, reviewStrategy:dStrategy, preferredReviewMethod:dMethod } });
          if(!res.ok){ if(!close.isClosed()) unlock(); return; }
          entity = res.entity;
        } else {
          entity = newDiscipline(name, areaId, priority);
          Object.assign(entity, { contentNature:nature, reviewStrategy:dStrategy, preferredReviewMethod:dMethod });
          await writeBatch((createdArea ? [{ op:'put', store:'areas', value:createdArea }] : []).concat([{ op:'put', store:'disciplines', value:entity }]));
        }
      } catch(err){
        console.error('Falha ao salvar a disciplina:', err);
        unlock();
        toast('Tente novamente. O que você preencheu continua aqui.', 'err', { title:'Não foi possível salvar a disciplina' });
        return;
      }
      close();
      ui.planDraft = null;
      if(!disc) ui.justCreated = 'disc-' + entity.id;     // a linha nova entra com um fade breve
      await safeRefresh();
      const areaName = areaId && getArea(areaId) ? getArea(areaId).name : null;
      if(disc){
        const moved = (disc.areaId || null) !== (areaId || null);
        toast(moved ? `Agora em ${areaName || NO_AREA_LABEL}. Tópicos, estudos e revisões continuam ligados a ela.` : `Prioridade ${priorityText(priority)}.`, 'ok',
          { title:`${name} atualizada` });
      } else {
        toast(`${areaName ? 'Em ' + areaName : NO_AREA_LABEL} · prioridade ${priorityText(priority)}. Adicione tópicos quando quiser.`, 'ok',
          { title:`${name} criada` });
      }
    } });

    const actions = [ h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }), saveBtn ];
    if(disc){
      actions.unshift(h('button', { class:'btn ghost', type:'button', text: disc.archived ? 'Reativar' : 'Arquivar',
        onclick: async () => { close(); await toggleArchiveDiscipline(disc.id); } }));
      actions.unshift(h('button', { class:'linkbtn danger', type:'button', text:'excluir definitivamente',
        onclick: async () => { close(); await deleteDisciplineForever(disc.id); } }));
    }
    return { title: disc ? 'Editar disciplina' : 'Nova disciplina', content, actions };
  }, { size:'wide' });
}

async function toggleArchiveDiscipline(id){
  const d = getDiscipline(id);
  if(!d) return;
  if(!d.archived){
    const ok = await confirmModal('Arquivar esta disciplina? Ela sai do planejamento, das sugestões e das revisões — todo o histórico é preservado.',
      { confirmLabel:'Arquivar', danger:false });
    if(!ok) return;
  }
  // v6.5: a memória só muda depois que o banco confirma (antes, `d.archived` virava antes de gravar)
  const archived = !d.archived;
  if(!(await quickPatch('disciplines', id, { archived }, archived ? 'Não foi possível arquivar a disciplina' : 'Não foi possível reativar a disciplina'))) return;
  ui.planDraft = null;
  await safeRefresh();
  toast(archived ? 'O histórico continua intacto.' : d.name, 'ok', { title: archived ? 'Disciplina arquivada' : 'Disciplina reativada' });
}

async function deleteDisciplineForever(id){
  const d = getDiscipline(id);
  if(!d) return;
  const sess = sessionsOf(id).length, tps = topicsOf(id, true).length;
  const ok = await confirmModal(
    `Excluir "${d.name}" DEFINITIVAMENTE apaga ${plural(sess, 'registro de estudo', 'registros de estudo')} e ${plural(tps, 'tópico', 'tópicos')}. Arquivar preserva tudo. Continuar mesmo assim?`,
    { confirmLabel:'Excluir definitivamente' });
  if(!ok) return;
  // Um estudo no cronômetro desta disciplina ficaria sem dono: resolve-se ele antes.
  if(TimerService.isActive && TimerService.data.disciplineId === id){
    toast('Finalize ou descarte o estudo em andamento desta disciplina antes de excluí-la.', 'err', { title:'Há um estudo em andamento' });
    return;
  }
  try {
    /* v6.5 — o que será apagado é lido DENTRO da transação, pelos índices do
       banco: um tópico ou estudo criado em outra aba um instante antes não
       sobra órfão. Ou tudo sai, ou nada sai. */
    await DB.atomic(['disciplines','topics','sessions','deadlines'], async api => {
      const [tps2, sess2, dls] = [
        await api.getAllByIndex('topics', 'disciplineId', id),
        await api.getAllByIndex('sessions', 'disciplineId', id),
        await api.getAllByIndex('deadlines', 'disciplineId', id)
      ];
      api.delete('disciplines', id);
      tps2.forEach(t => api.delete('topics', t.id));
      sess2.forEach(x => api.delete('sessions', x.id));
      dls.forEach(dl => api.delete('deadlines', dl.id));
    });
  } catch(err){
    console.error('Falha ao excluir a disciplina:', err);
    toast('Nada foi apagado. Tente novamente.', 'err', { title:'Não foi possível excluir a disciplina' });
    return;
  }
  ui.planDraft = null;
  await safeRefresh();
  toast('Disciplina excluída definitivamente.');
}

async function moveTopic(topicId, dir){
  const t = getTopic(topicId);
  if(!t) return;
  const list = topicsOf(t.disciplineId);
  const i = list.findIndex(x => x.id === topicId);
  const j = i + dir;
  if(i < 0 || j < 0 || j >= list.length) return;
  const a = list[i], b = list[j];
  // v6.5: a troca é calculada em variáveis e gravada só no campo `sortOrder`; a memória muda depois de gravar
  let orderA = b.sortOrder, orderB = a.sortOrder;
  if(orderA === orderB){ orderA = j * 10; orderB = i * 10; }
  try {
    await writeBatch([
      { op:'patch', store:'topics', id:a.id, changes:{ sortOrder: orderA } },
      { op:'patch', store:'topics', id:b.id, changes:{ sortOrder: orderB } }
    ]);
  } catch(err){
    console.error('Falha ao reordenar os tópicos:', err);
    toast('Tente novamente. A ordem não mudou.', 'err', { title:'Não foi possível mover o tópico' });
    return;
  }
  await safeRefresh();
}


/* ---------- CRUD: Tópicos ---------- */
function topicReviewOptions(disciplineId, topic){
  let tStrategy = topic ? (topic.reviewStrategy || 'inherit') : 'inherit';
  let tMethod = topic ? (topic.preferredReviewMethod || 'inherit') : 'inherit';
  const tStratSel = h('select', { id:'tm-strategy' });
  [{ v:'inherit', label:'Igual à disciplina (' + strategyLabel(ReviewEngine.effectiveStrategy({ disciplineId, reviewStrategy:'inherit' })) + ')' }]
    .concat(REVIEW_STRATEGIES.map(x => ({ v:x.v, label:x.label })))
    .forEach(x => tStratSel.appendChild(h('option', { value:x.v, selected:x.v === tStrategy }, x.label)));
  tStratSel.addEventListener('change', () => { tStrategy = tStratSel.value; });
  const tMethodSel = h('select', { id:'tm-method' });
  [{ v:'inherit', label:'Igual à disciplina' }]
    .concat(REVIEW_METHODS.map(m => ({ v:m.v, label:m.label })))
    .forEach(x => tMethodSel.appendChild(h('option', { value:x.v, selected:x.v === tMethod }, x.label)));
  tMethodSel.addEventListener('change', () => { tMethod = tMethodSel.value; });
  const node = h('details', { class:'advanced' },
    h('summary', null, 'Opções de revisão'),
    h('div', { class:'advanced-body' },
      h('p', { class:'hint', style:'margin:0 0 10px', text:'Por padrão o tópico segue a disciplina. Só mude se este conteúdo pedir algo diferente.' }),
      h('div', { class:'field' }, h('label', { for:'tm-strategy' }, 'Quando revisar', helpDot('estrategia')), tStratSel),
      h('div', { class:'field tight' }, h('label', { for:'tm-method' }, 'Como revisar', helpDot('metodo')), tMethodSel),
      topic && topic.reviewDueDate ? h('p', { class:'hint', style:'margin-top:10px', text:`Mudar isso ou a prioridade não altera a revisão já marcada (${fmtRelativeFuture(topic.reviewDueDate)}); vale a partir da próxima resposta.` }) : null));
  return { node, get strategy(){ return tStrategy; }, get method(){ return tMethod; } };
}

function reviewToggle(checked){
  const chk = h('input', { type:'checkbox', id:'tm-review', checked });
  return { chk, node: h('div', { class:'field' },
    h('label', { class:'check-row strong', for:'tm-review' }, chk, h('span', { text:'Incluir nas revisões' })),
    h('p', { class:'hint', style:'margin-left:26px', text:'O Ciclo avisa quando for hora de revisar este tópico.' })) };
}

/** Chave de comparação de nomes de tópico: sem acento, caixa ou espaços extras. */
function topicNameKey(name){ return normalizeText(name); }

/** Tópico da disciplina com o mesmo nome (ativo tem preferência sobre arquivado). */
function findTopicByName(disciplineId, name, exceptId){
  const key = topicNameKey(name);
  if(!key || !disciplineId) return null;
  const same = topicsOf(disciplineId, true).filter(t => t.id !== exceptId && topicNameKey(t.name) === key);
  return same.find(t => !t.archived) || same[0] || null;
}

/**
 * EDITOR CANÔNICO DE TÓPICO (v6.3).
 * UM formulário para: adicionar/editar pela disciplina (openTopicModal) e
 * criar um tópico no meio do registro de um estudo (subtela do registro).
 * Não existe versão simplificada paralela: nome, prioridade, revisões e
 * opções de revisão são sempre os mesmos campos, com os mesmos padrões.
 *
 *   o.disciplineId        disciplina inicial
 *   o.topic               tópico em edição (null = novo)
 *   o.name                nome pré-preenchido
 *   o.chooseDiscipline    mostra o seletor de disciplina (no registro)
 *   o.inRegistration      textos e botões pensados para quem está registrando
 *   o.close               fechar do modal (usado por "vários de uma vez" e Arquivar)
 *   o.onSaved(topic)      chamado DEPOIS de gravar com sucesso
 *   o.onCancel()          Cancelar / Voltar
 *   o.onUseExisting(t)    "Usar este tópico" diante de um nome repetido
 * Devolve { title, content, actions, focus }.
 */
function topicEditor(o){
  const topic = (o.topic && typeof o.topic.id === 'string') ? o.topic : null;
  let discId = o.disciplineId;
  let saving = false;
  let forceNext = false;              // v6.5: a pessoa viu o aviso de conflito e decidiu manter a edição
  let acceptedArchivedTwin = null;    // id do arquivado homônimo que o usuário decidiu ignorar

  const nameIn = h('input', { type:'text', id:'tm-name', value: topic ? topic.name : (o.name || ''), placeholder:'Ex.: Derivadas',
    maxlength:'80', autocomplete:'off', 'aria-describedby':'tm-name-msg' });
  const msg = h('div', { class:'tm-msg', id:'tm-name-msg', 'aria-live':'polite' });
  const clearMsg = () => { nameIn.removeAttribute('aria-invalid'); clear(msg); acceptedArchivedTwin = null; };
  nameIn.addEventListener('input', clearMsg);

  let priority = topic ? PriorityEngine.clamp(topic.priority) : PRIORITY_DEFAULT;
  const prio = priorityPicker({ value:priority, context:'topic', id:'tm-prio', label:'Prioridade', helpKey:'prioridadeTopico',
    onChange: v => { priority = v; } });
  const rev = reviewToggle(topic ? topic.reviewEnabled : !!state.settings.autoReviewNewTopics);

  // As opções de revisão mostram a estratégia da disciplina: trocam junto com ela.
  const advWrap = h('div');
  let advanced = topicReviewOptions(discId, topic);
  advWrap.append(advanced.node);
  function rebuildAdvanced(){
    const wasOpen = advanced.node.open;
    advanced = topicReviewOptions(discId, { reviewStrategy: advanced.strategy, preferredReviewMethod: advanced.method });
    advanced.node.open = wasOpen;
    mount(advWrap, advanced.node);
  }

  let where;
  if(o.chooseDiscipline){
    where = selectField('tm-disc', 'Disciplina', disciplineOptions(false), discId, (e) => {
      discId = e.target.value;
      clearMsg();
      rebuildAdvanced();
    });
  } else {
    where = h('p', { class:'modal-sub' }, h('span', { class:'muted-text', text:'Em ' }), disciplinePath(getDiscipline(discId)));
  }

  const content = h('div', { class:'topic-editor' },
    o.inRegistration ? h('p', { class:'modal-sub', text:'O estudo que você está registrando continua guardado. Ao salvar, o tópico já volta selecionado.' }) : null,
    where,
    h('div', { class:'field' }, h('label', { for:'tm-name', text:'Nome do tópico' }), nameIn,
      topic ? null : h('p', { class:'hint', text:'Uma parte específica da disciplina. Ex.: Derivadas em Cálculo, Present Perfect em Inglês.' }),
      msg),
    h('div', { class:'field' }, prio),
    rev.node,
    advWrap,
    topic && topic.reviewDueDate ? h('p', { class:'hint', style:'margin-top:12px',
      text:`Próxima revisão ${fmtRelativeFuture(topic.reviewDueDate)} · consolidação estimada ${topic.masteryLevel || '—'} de 5` }) : null,
    (!topic && !o.inRegistration && o.close) ? h('button', { class:'linkbtn muted', type:'button', style:'margin-top:12px', text:'Prefere adicionar vários tópicos de uma vez?',
      onclick:() => { o.close(); openBulkTopicModal(discId); } }) : null
  );
  nameIn.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); save(); } });

  function setBusy(on, label){
    saveBtn.disabled = on;
    if(on){ saveBtn.setAttribute('aria-busy','true'); saveBtn.textContent = label || 'Salvando…'; }
    else { saveBtn.removeAttribute('aria-busy'); saveBtn.textContent = saveLabel; }
  }

  /** Nome repetido: explica e oferece o caminho certo — nunca cria em silêncio. */
  function showTwin(t){
    nameIn.setAttribute('aria-invalid','true');
    if(!t.archived){
      mount(msg,
        h('p', { class:'err', text:`Já existe um tópico chamado “${t.name}” nesta disciplina.` }),
        o.onUseExisting ? h('button', { class:'linkbtn', type:'button', text:'Usar este tópico', onclick:() => o.onUseExisting(t) }) : null);
    } else {
      mount(msg,
        h('p', { class:'warn', text:`“${t.name}” já existe nesta disciplina, mas está arquivado.` }),
        h('div', { class:'tm-msg-actions' },
          topic ? null : h('button', { class:'linkbtn', type:'button', text: o.onUseExisting ? 'Reativar e usar' : 'Reativar', onclick:() => reactivate(t) }),
          h('button', { class:'linkbtn muted', type:'button', text: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome',
            onclick:() => { acceptedArchivedTwin = t.id; save(); } })));
    }
    nameIn.focus();
  }

  async function reactivate(t){
    if(saving) return;
    saving = true; setBusy(true, 'Reativando…');
    if(!(await quickPatch('topics', t.id, { archived:false }, 'Não foi possível reativar o tópico'))){
      saving = false; setBusy(false);
      return;
    }
    await safeRefresh();
    saving = false; setBusy(false);
    toast(t.name, 'ok', { title:'Tópico reativado' });
    const fresh = getTopic(t.id) || t;
    if(o.onUseExisting) o.onUseExisting(fresh); else if(o.onSaved) o.onSaved(fresh);
  }

  async function save(){
    if(saving) return;
    const name = nameIn.value.trim();
    const disc = getDiscipline(discId);
    if(!name){
      nameIn.setAttribute('aria-invalid','true'); nameIn.focus();
      mount(msg, h('p', { class:'err', text:'Escreva o nome do tópico.' }));
      return;
    }
    if(!disc){ toast('Escolha uma disciplina.', 'err'); return; }
    const twin = findTopicByName(discId, name, topic ? topic.id : null);
    if(twin && !(twin.archived && twin.id === acceptedArchivedTwin)){ showTwin(twin); return; }

    saving = true; setBusy(true);
    let saved;
    try {
      if(topic){
        /* v6.5 — só os campos do formulário são gravados, sobre o tópico como está
           no banco. Uma revisão registrada em outra aba enquanto este editor
           estava aberto (próxima data, domínio, contagens) não é desfeita. */
        const changes = { name, priority, reviewEnabled: rev.chk.checked, reviewStrategy: advanced.strategy, preferredReviewMethod: advanced.method };
        let res = await patchEntity('topics', topic.id, changes, { base:topic, force:forceNext });
        if(!res.ok && res.reason === 'conflict'){
          saving = false; setBusy(false);
          forceNext = true;
          mount(msg, h('p', { class:'err', role:'alert', text:'Os dados mudaram em outra aba: este tópico foi alterado enquanto você editava. Salve de novo para manter a sua edição, ou cancele para ficar com a outra.' }));
          return;
        }
        if(!res.ok && res.reason === 'missing'){
          saving = false; setBusy(false);
          if(o.close) o.close(); else if(o.onCancel) o.onCancel();
          await safeRefresh();
          toast('Ele foi removido em outra aba. Nada foi gravado.', 'info', { title:'Este tópico não existe mais' });
          return;
        }
        if(!res.ok) throw (res.error || new Error('tópico não gravado'));
        saved = res.entity;
      } else {
        const existing = topicsOf(discId, true);
        const order = existing.length ? Math.max(...existing.map(t => t.sortOrder || 0)) + 10 : 10;
        saved = newTopic(discId, name, order);
        Object.assign(saved, { priority, reviewEnabled: rev.chk.checked, reviewStrategy: advanced.strategy, preferredReviewMethod: advanced.method });
        await DB.put('topics', saved);
      }
    } catch(err){
      // O editor continua aberto com tudo o que foi preenchido.
      console.error('Falha ao salvar o tópico:', err);
      saving = false; setBusy(false);
      toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível salvar o tópico' });
      return;
    }
    if(!topic && !o.inRegistration && ui.view === 'disciplines'){ ui.discFocus = 'topic-' + saved.id; ui.justCreated = 'topic-' + saved.id; }
    try { await refresh(); } catch(err){ console.error('Falha ao atualizar a tela:', err); }
    saving = false; setBusy(false);
    if(topic) toast(`${name} · prioridade ${priorityText(priority)}`, 'ok', { title:'Tópico atualizado' });
    else if(o.inRegistration) toast(`${disc.name} › ${name}`, 'ok', { title:'Tópico criado e selecionado' });
    else toast(`${disc.name} › ${name} · prioridade ${priorityText(priority)}`, 'ok', { title:'Tópico adicionado' });
    if(o.onSaved) o.onSaved(getTopic(saved.id) || saved);
  }

  const saveLabel = topic ? 'Salvar' : (o.inRegistration ? 'Criar e selecionar' : 'Adicionar tópico');
  const saveBtn = h('button', { class:'btn primary', type:'button', text:saveLabel, onclick:() => save() });
  const actions = [
    h('button', { class:'btn ghost', type:'button', text: o.inRegistration ? 'Voltar ao registro' : 'Cancelar', onclick:() => { if(o.onCancel) o.onCancel(); } }),
    saveBtn
  ];
  if(topic && o.close){
    actions.unshift(h('button', { class:'btn ghost', type:'button', text:'Arquivar', onclick: async () => {
      o.close();
      const ok = await confirmModal('Arquivar este tópico? Ele sai das opções ativas e a revisão fica pausada — o histórico é preservado.', { confirmLabel:'Arquivar', danger:false });
      if(!ok) return;
      if(!(await quickPatch('topics', topic.id, { archived:true }, 'Não foi possível arquivar o tópico'))) return;
      await safeRefresh();
      toast(topic.name, 'info', { title:'Tópico arquivado' });
    } }));
  }
  return { title: topic ? 'Editar tópico' : (o.inRegistration ? 'Novo tópico' : 'Adicionar tópico'), content, actions, focus: nameIn };
}

/**
 * Adicionar ou editar UM tópico pela disciplina. opts.name pré-preenche o
 * nome digitado na página da disciplina. Ao salvar, a tela atual se
 * redesenha sozinha — quem estava na disciplina continua nela.
 */
function openTopicModal(disciplineId, topic, opts){
  if(topic && typeof topic.id !== 'string') topic = null;
  const o = (opts && !(opts instanceof Event)) ? opts : {};
  if(!disciplineId || disciplineId instanceof Event || !getDiscipline(disciplineId)){ toast('Escolha uma disciplina primeiro.', 'err'); return; }
  openModal(close => {
    const ed = topicEditor({ disciplineId, topic, name:o.name, close,
      onSaved: () => close(), onCancel: () => close() });
    return { title: ed.title, content: ed.content, actions: ed.actions };
  });
}

/** Opção secundária: vários tópicos de uma vez, um por linha. */
function openBulkTopicModal(disciplineId){
  const disc = getDiscipline(disciplineId);
  if(!disc) return;
  openModal(close => {
    const area = h('textarea', { id:'tm-multi', placeholder:'Subnetting\nVLAN\nOSPF', style:'min-height:120px' });
    let priority = PRIORITY_DEFAULT;
    const prio = priorityPicker({ value:priority, context:'topic', id:'tm-bulk-prio', label:'Prioridade de todos', onChange: v => { priority = v; } });
    const rev = reviewToggle(!!state.settings.autoReviewNewTopics);
    return {
      title:'Adicionar vários tópicos',
      content: h('div',
        h('p', { class:'modal-sub' }, h('span', { class:'muted-text', text:'Em ' }), disciplinePath(disc)),
        h('div', { class:'field' }, h('label', { for:'tm-multi', text:'Tópicos (um por linha)' }), area,
          h('p', { class:'hint', text:'Todos recebem a mesma prioridade. Você pode ajustar cada um depois.' })),
        h('div', { class:'field' }, prio),
        rev.node),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn primary', type:'button', text:'Adicionar tópicos', onclick: once(async () => {
          const known = new Set(topicsOf(disciplineId).map(t => t.name.toLowerCase()));
          const seen = new Set();
          const lines = area.value.split('\n').map(x => x.trim()).filter(x => {
            const k = x.toLowerCase();
            if(!x || known.has(k) || seen.has(k)) return false;
            seen.add(k); return true;
          });
          if(!lines.length){ area.setAttribute('aria-invalid','true'); area.focus(); toast('Escreva ao menos um tópico novo, um por linha.', 'err'); return; }
          const existing = topicsOf(disciplineId, true);
          let order = existing.length ? Math.max(...existing.map(t => t.sortOrder || 0)) : 0;
          const created = lines.map(name => {
            order += 10;
            return Object.assign(newTopic(disciplineId, name, order), { priority, reviewEnabled: rev.chk.checked });
          });
          // v6.5: grava primeiro, fecha depois — se falhar, a lista digitada continua na janela
          try { await DB.putMany('topics', created); }
          catch(err){
            console.error('Falha ao adicionar os tópicos:', err);
            toast('Tente novamente. A lista que você escreveu continua aqui.', 'err', { title:'Não foi possível adicionar os tópicos' });
            return;
          }
          close();
          await safeRefresh();
          toast(created.slice(0, 3).map(t => t.name).join(', ') + (created.length > 3 ? ` e mais ${created.length - 3}` : '') + ` · ${disc.name}`,
            'ok', { title: created.length === 1 ? 'Tópico adicionado' : `${created.length} tópicos adicionados` });
        }) })
      ]
    };
  }, { size:'wide' });
}

/* =========================================================================
   PRAZOS — provas, trabalhos, projetos, tarefas, demandas e entregas.
   ========================================================================= */
/** Aba Prazos: "O que está chegando?" — título, tipo, data e proximidade. */
function deadlinesPanel(){
  const parts = [h('div', { class:'panel-bar' },
    h('p', { class:'panel-help' }, 'Provas, trabalhos, projetos e entregas. Quanto mais perto e mais prioritário, mais pesa nas sugestões.', helpDot('prazo')),
    h('div', { class:'panel-actions' },
      h('button', { class:'btn primary sm', type:'button', onclick:() => openDeadlineModal(null) }, icon('i-plus'), 'Prazo')))];
  if(!state.deadlines.length){
    parts.push(h('section', { class:'quiet-empty' }, emptyState('Nenhum prazo cadastrado',
      'Use prazos para acompanhar datas importantes como provas, trabalhos, projetos, tarefas e entregas.',
      h('div', { class:'empty-actions' },
        h('button', { class:'btn primary', type:'button', onclick:() => openDeadlineModal(null) }, icon('i-plus'), 'Adicionar prazo'),
        h('button', { class:'btn ghost', type:'button', text:'Como funcionam os prazos?', onclick:() => openHelpArticle('prazos') })))));
    return parts;
  }
  const conclude = dl => h('button', { class:'icon-btn dl-check', type:'button', title:'Concluir', 'aria-label':`Concluir ${dl.title}`,
    onclick: once(() => setDeadlineStatus(dl.id, 'completed')) }, icon('i-check', 'btn-icon'));
  const reopen = dl => h('button', { class:'linkbtn muted', type:'button', text:'reabrir', 'aria-label':`Reabrir ${dl.title}`, onclick: once(() => setDeadlineStatus(dl.id, 'pending')) });

  /* v6.2 — Prazos: FILTRO real (status) + ORDENAÇÃO, num único controle discreto,
     e busca só entre os prazos (título, tipo, disciplina, tópico). */
  parts.push(collectionView({
    key:'deadlines', kind:'deadlines', items: state.deadlines.slice(),
    placeholder:'Buscar prazo…', label:'Buscar prazo',
    searchText: dl => {
      const disc = dl.disciplineId ? getDiscipline(dl.disciplineId) : null;
      const topic = dl.topicId ? getTopic(dl.topicId) : null;
      return [dl.title, deadlineTypeInfo(dl.type).label, disc ? disc.name : '', topic ? topic.name : ''].join(' ');
    },
    filterFn:(dl, f) => f === 'all' ? true : f === 'completed' ? DeadlineEngine.isDone(dl) : (!DeadlineEngine.isDone(dl) && (dl.status || 'pending') === f),
    emptyFiltered:(f) => ({ pending:'Nenhum prazo pendente.', in_progress:'Nenhum prazo em andamento.', completed:'Nenhum prazo concluído ainda.' }[f] || 'Nenhum prazo aqui.'),
    noResults:'Nenhum prazo encontrado.',
    renderItems:(list, ctx) => {
      const q = ctx.query;
      const openL = list.filter(dl => !DeadlineEngine.isDone(dl));
      let doneL = list.filter(dl => DeadlineEngine.isDone(dl));
      // "mais próximos" não diz nada sobre o que já terminou: concluídos mais recentes primeiro
      if(ctx.sort === 'nearest') doneL = doneL.slice().sort((a,b) => str(b.completedAt || b.updatedAt).localeCompare(str(a.completedAt || a.updatedAt)));
      const out = [];
      const overdue = openL.filter(dl => DeadlineEngine.isOverdue(dl));
      const next = openL.filter(dl => !DeadlineEngine.isOverdue(dl));
      if(overdue.length) out.push(h('section', { class:'list-block' },
        h('h3', { class:'block-label', text:'A data passou' }),
        h('ul', { class:'dl-line-list' }, overdue.map(dl => deadlineLine(dl, null, false, { action: conclude(dl), query:q })))));
      if(next.length) out.push(h('section', { class:'list-block' },
        h('h3', { class:'block-label', text:'Próximos' }),
        h('ul', { class:'dl-line-list' }, next.map(dl => deadlineLine(dl, null, false, { action: conclude(dl), query:q })))));
      if(ctx.filter === 'all' && !openL.length && !q) out.push(h('p', { class:'hint', text:'Nenhum prazo em aberto. Os concluídos continuam guardados abaixo.' }));
      if(doneL.length){
        const lines = h('ul', { class:'dl-line-list' }, doneL.slice(0, q || ctx.filter === 'completed' ? 200 : 40).map(dl => deadlineLine(dl, null, true, { action: reopen(dl), query:q })));
        // com busca ou com o filtro "Concluídos", o que foi encontrado aparece aberto
        out.push(ctx.filter === 'completed'
          ? h('section', { class:'list-block' }, h('h3', { class:'block-label', text:'Concluídos' }), lines)
          : h('details', { class:'disclosure', open: !!q },
              h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:String(doneL.length) })),
              h('div', { class:'disclosure-body' }, lines)));
      }
      return out;
    }
  }));
  return parts;
}

async function setDeadlineStatus(id, status){
  const dl = state.deadlines.find(d => d.id === id);
  if(!dl || !DEADLINE_STATUSES.some(x => x.v === status)) return;
  const updated = Object.assign({}, dl, {
    status,
    completedAt: status === 'completed' ? (dl.completedAt || nowISO()) : null
  });
  try {
    // v6.5: só `status` e `completedAt` são gravados, sobre o prazo como está no banco
    const res = await patchEntity('deadlines', id, { status: updated.status, completedAt: updated.completedAt });
    if(!res.ok && res.reason === 'missing'){
      if(Drawer.isOpen && ui.openDeadlineId === id) Drawer.close();
      await safeRefresh();
      toast('Ele foi excluído em outra aba.', 'info', { title:'Este prazo não existe mais' });
      return;
    }
    if(!res.ok) throw (res.error || new Error('prazo não gravado'));
    await safeRefresh();
    if(Drawer.isOpen && ui.openDeadlineId === id) openDeadlineDrawer(id);
    const msg = {
      completed:  ['Prazo concluído', 'Ele deixa de influenciar suas recomendações e continua no histórico.'],
      in_progress:['Prazo em andamento', updated.title],
      pending:    ['Prazo reaberto', 'Ele volta a influenciar as recomendações quando estiver ativo.']
    }[status];
    toast(msg[1], status === 'completed' ? 'ok' : 'info', { title: msg[0] });
  } catch(err){
    console.error(err);
    toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível atualizar o prazo' });
  }
}

async function deleteDeadline(id){
  const dl = state.deadlines.find(d => d.id === id);
  if(!dl) return;
  const ok = await confirmModal(`Excluir o prazo "${dl.title}"? Esta ação não pode ser desfeita. Se ele já foi cumprido, prefira marcá-lo como concluído.`, { confirmLabel:'Excluir prazo' });
  if(!ok) return;
  try {
    await DB.delete('deadlines', id);
    if(Drawer.isOpen && ui.openDeadlineId === id) Drawer.close();
    await safeRefresh();
    toast(dl.title, 'info', { title:'Prazo excluído' });
  } catch(err){
    console.error(err);
    toast('Tente novamente.', 'err', { title:'Não foi possível excluir o prazo' });
  }
}

/** Frase humana sobre como o prazo está pesando agora. */
function deadlineInfluenceText(dl){
  if(DeadlineEngine.isDone(dl)) return 'Concluído: não influencia mais suas recomendações.';
  if(!DeadlineEngine.hasStarted(dl)) return `Ainda não influencia suas recomendações. Passa a contar em ${fmtDateLong(dl.startDate)}.`;
  if(DeadlineEngine.isOverdue(dl)) return 'A data já passou. Marque como concluído quando terminar, ou edite a data.';
  const u = DeadlineEngine.urgency(dl);
  const level = u >= 0.6 ? 'bastante' : u >= 0.3 ? 'moderadamente' : 'pouco, por enquanto';
  const target = dl.topicId && getTopic(dl.topicId) ? `o tópico ${getTopic(dl.topicId).name}` : dl.disciplineId && getDiscipline(dl.disciplineId) ? `a disciplina ${getDiscipline(dl.disciplineId).name}` : null;
  if(!target) return 'Sem disciplina vinculada: aparece na sua lista, mas não altera recomendações.';
  return `Está influenciando ${level} as sugestões para ${target}. Quanto mais perto a data, maior o peso.`;
}

function openDeadlineDrawer(id){
  const dl = state.deadlines.find(d => d.id === id);
  if(!dl) return;
  const info = deadlineTypeInfo(dl.type);
  const disc = dl.disciplineId ? getDiscipline(dl.disciplineId) : null;
  const topic = dl.topicId ? getTopic(dl.topicId) : null;
  const statusCtl = segmented(DEADLINE_STATUSES.map(x => ({ value:x.v, label:x.label })), dl.status,
    v => setDeadlineStatus(dl.id, v), 'Status do prazo');

  const rows = [
    ['Tipo', info.label],
    ['Disciplina', disc ? disciplinePath(disc) : '—'],
    ['Tópico', topic ? topic.name : '—'],
    [info.dateLabel, fmtDateLong(dl.date)],
    ['Início', dl.startDate ? fmtDateLong(dl.startDate) : 'sem data de início']
  ];
  const body = h('div', { class:'dl-detail' },
    h('p', { class:'dl-when big' }, h('strong', { text: DeadlineEngine.dueText(dl) })),
    h('dl', { class:'kv-list' }, rows.map(([k, v]) => h('div', null, h('dt', { text:k }), h('dd', { text:v })))),
    h('div', { class:'detail-prio', style:'margin-top:14px' }, h('span', { text:'Prioridade' }), priorityChip(dl.priority)),
    h('p', { class:'hint', text: PriorityEngine.hint(dl.priority, 'deadline') }),
    h('div', { class:'field', style:'margin-top:16px' }, h('label', { text:'Status' }), statusCtl),
    h('p', { class:'influence-note' }, icon('i-info', 'nav-icon'), h('span', { text: deadlineInfluenceText(dl) })),
    dl.instructions ? h('div', { class:'text-block' }, h('p', { class:'section-label', text:'Orientações' }), h('p', { class:'pre-text', text:dl.instructions })) : null,
    dl.notes ? h('div', { class:'text-block' }, h('p', { class:'section-label', text:'Anotações' }), h('p', { class:'pre-text', text:dl.notes })) : null,
    h('div', { class:'row auto', style:'margin-top:20px' },
      DeadlineEngine.isDone(dl)
        ? h('button', { class:'btn ghost sm', type:'button', text:'Reabrir', onclick: once(() => setDeadlineStatus(dl.id, 'pending')) })
        : h('button', { class:'btn primary sm', type:'button', onclick: once(() => setDeadlineStatus(dl.id, 'completed')) }, icon('i-check'), 'Concluir'),
      h('button', { class:'btn ghost sm', type:'button', text:'Editar', onclick:() => { Drawer.close(); openDeadlineModal(dl); } }),
      topic ? h('button', { class:'btn ghost sm', type:'button', text:'Ver tópico', onclick:() => openTopicDrawer(topic.id) }) : null,
      h('button', { class:'linkbtn danger', type:'button', text:'excluir', onclick:() => deleteDeadline(dl.id) })));
  Drawer.open(dl.title, body, { onClose:() => { ui.openDeadlineId = null; } });
  ui.openDeadlineId = id;             // depois do open: trocar de conteúdo limpa o anterior
}

function openDeadlineModal(dl, preset){
  if(dl && typeof dl.id !== 'string') dl = null;
  const p = (preset && !(preset instanceof Event)) ? preset : {};
  openModal(close => {
    let type = dl ? dl.type : (p.type || 'exam');
    let priority = dl ? PriorityEngine.clamp(dl.priority) : PRIORITY_DEFAULT;
    let status = dl ? dl.status : 'pending';
    let discId = dl ? (dl.disciplineId || '') : (p.disciplineId || '');
    let topicId = dl ? (dl.topicId || '') : (p.topicId || '');

    const titleIn = h('input', { type:'text', id:'dl-title', value: dl ? dl.title : '', maxlength:'120', autocomplete:'off', placeholder:'Ex.: Prova de Redes' });
    const dateIn = h('input', { type:'date', id:'dl-date', value: dl ? dl.date : '' , required:true });
    const dateLabel = h('label', { for:'dl-date' });
    const startIn = h('input', { type:'date', id:'dl-start', value: dl && dl.startDate ? dl.startDate : '' });
    const setDateLabel = () => { clear(dateLabel); dateLabel.append(deadlineTypeInfo(type).dateLabel, h('span', { class:'req', text:' *', 'aria-hidden':'true' })); };
    setDateLabel();

    const typeChips = h('div', { class:'chips', role:'radiogroup', 'aria-label':'Tipo de prazo' });
    DEADLINE_TYPES.forEach(t => {
      const b = h('button', { class:'chip', type:'button', role:'radio', 'aria-checked': t.v === type ? 'true':'false', 'aria-pressed': t.v === type ? 'true':'false', text:t.label });
      b.addEventListener('click', () => {
        type = t.v;
        $$('.chip', typeChips).forEach(x => { x.setAttribute('aria-pressed','false'); x.setAttribute('aria-checked','false'); });
        b.setAttribute('aria-pressed','true'); b.setAttribute('aria-checked','true');
        setDateLabel();
        titleIn.placeholder = `Ex.: ${t.v === 'exam' ? 'Prova de Redes' : t.v === 'project' ? 'Projeto de Redes' : t.v === 'assignment' ? 'Trabalho de História' : t.label + ' de Inglês'}`;
      });
      typeChips.appendChild(b);
    });

    const discSel = h('select', { id:'dl-disc' });
    discSel.appendChild(h('option', { value:'' }, 'Nenhuma'));
    if(discId && !getDiscipline(discId)) discId = '';
    // v6.3: disciplina e tópico atuais aparecem mesmo arquivados — antes a tela
    // mostrava "Nenhuma" e salvar podia desligar o prazo do tópico sem aviso.
    const discOpts = disciplineOptions(false);
    if(discId && !discOpts.some(x => x.value === discId)) discOpts.push({ value:discId, label:getDiscipline(discId).name + ' (arquivada)' });
    discOpts.forEach(x => discSel.appendChild(h('option', { value:x.value, selected: x.value === discId }, x.label)));
    const topicSel = h('select', { id:'dl-topic' });
    const keepTopic = topicId ? getTopic(topicId) : null;
    const fillTopics = () => {
      clear(topicSel);
      topicSel.appendChild(h('option', { value:'' }, discId ? 'Toda a disciplina' : 'Escolha uma disciplina primeiro'));
      const list = discId ? topicsOf(discId).slice() : [];
      if(keepTopic && keepTopic.archived && keepTopic.disciplineId === discId) list.push(keepTopic);
      list.forEach(t => topicSel.appendChild(h('option', { value:t.id, selected: t.id === topicId }, t.name + (t.archived ? ' (arquivado)' : ''))));
      if(topicId && !list.some(t => t.id === topicId)) topicId = '';
      topicSel.disabled = !discId;
    };
    fillTopics();
    discSel.addEventListener('change', () => { discId = discSel.value; topicId = ''; fillTopics(); });
    topicSel.addEventListener('change', () => { topicId = topicSel.value; });

    const prio = priorityPicker({ value:priority, context:'deadline', id:'dl-prio', label:'Prioridade', helpKey:'prazo', onChange: v => { priority = v; } });
    const statusCtl = segmented(DEADLINE_STATUSES.map(x => ({ value:x.v, label:x.label })), status, v => { status = v; }, 'Status');

    const instrIn = h('textarea', { id:'dl-instr', maxlength:'5000', placeholder:'Ex.: Entregar relatório com topologia, endereçamento e testes.' });
    instrIn.value = dl ? str(dl.instructions) : '';
    const notesIn = h('textarea', { id:'dl-notes', maxlength:'5000', placeholder:'Ex.: O professor também pediu capturas do simulador.' });
    notesIn.value = dl ? str(dl.notes) : '';
    const errBox = h('p', { class:'err', role:'alert' });

    const content = h('div', { class:'dl-form' },
      h('div', { class:'field' }, h('label', { text:'Tipo' }), typeChips),
      h('div', { class:'field' }, h('label', { for:'dl-title' }, 'Título', h('span', { class:'req', text:' *', 'aria-hidden':'true' })), titleIn),
      h('div', { class:'row' },
        h('div', { class:'field' }, dateLabel, dateIn),
        h('div', { class:'field' }, h('label', { for:'dl-start' }, 'Data de início', h('span', { class:'optional', text:'opcional' })), startIn,
          h('p', { class:'hint', text:'Antes dela, o prazo não pesa nas sugestões.' }))),
      h('div', { class:'row' },
        h('div', { class:'field' }, h('label', { for:'dl-disc' }, 'Disciplina', h('span', { class:'optional', text:'opcional' })), discSel,
          h('p', { class:'hint', text:'O prazo passa a influenciar esta disciplina.' })),
        h('div', { class:'field' }, h('label', { for:'dl-topic' }, 'Tópico', h('span', { class:'optional', text:'opcional' })), topicSel,
          h('p', { class:'hint', text:'Só este tópico recebe atenção extra.' }))),
      h('div', { class:'field' }, prio),
      h('div', { class:'field' }, h('label', { text:'Status' }), statusCtl),
      h('details', { class:'advanced', open: !!(dl && (dl.instructions || dl.notes)) },
        h('summary', null, 'Orientações e anotações'),
        h('div', { class:'advanced-body' },
          h('div', { class:'field' }, h('label', { for:'dl-instr', text:'Orientações' }), instrIn,
            h('p', { class:'hint', text:'O que precisa ser feito ou quais são os requisitos.' })),
          h('div', { class:'field tight' }, h('label', { for:'dl-notes', text:'Anotações' }), notesIn,
            h('p', { class:'hint', text:'Observações pessoais sobre este prazo.' })))),
      errBox);

    const fail = (msg, field) => { errBox.textContent = msg; if(field){ field.setAttribute('aria-invalid','true'); field.focus(); } };

    const actions = [
      h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
      h('button', { class:'btn primary', type:'button', text: dl ? 'Salvar' : 'Adicionar prazo', onclick: once(async () => {
        [titleIn, dateIn, startIn].forEach(x => x.removeAttribute('aria-invalid'));
        errBox.textContent = '';
        const title = titleIn.value.trim();
        if(!title) return fail('Dê um título ao prazo. Ex.: Prova de Redes.', titleIn);
        if(!isStrictISODate(dateIn.value)) return fail(`Informe a ${deadlineTypeInfo(type).dateLabel.toLowerCase()}.`, dateIn);
        if(startIn.value && !isStrictISODate(startIn.value)) return fail('A data de início não é uma data válida.', startIn);
        const start = startIn.value || null;
        if(start && start > dateIn.value) return fail('A data de início precisa ser anterior ou igual à data do prazo.', startIn);
        const data = {
          title, type, date: dateIn.value, startDate: start,
          disciplineId: discId || null, topicId: (discId && topicId) ? topicId : null,
          priority, status,
          instructions: instrIn.value.trim(), notes: notesIn.value.trim(),
          completedAt: status === 'completed' ? ((dl && dl.completedAt) || nowISO()) : null
        };
        /* v6.5 — SALVAR PRIMEIRO, FECHAR DEPOIS. Antes a janela fechava e, se a
           gravação falhasse, tudo o que foi digitado (orientações, anotações) sumia. */
        let entity;
        if(dl){
          const res = await saveEntityEdit({ store:'deadlines', id:dl.id, base:dl, changes:data, close, what:'este prazo' });
          if(!res.ok) return;
          entity = res.entity;
        } else {
          entity = newDeadline(data);
          try { await DB.put('deadlines', entity); }
          catch(err){
            console.error('Falha ao salvar o prazo:', err);
            fail('Não foi possível salvar o prazo. Tente novamente — o que você preencheu continua aqui.');
            return;
          }
        }
        close();
        await safeRefresh();
        toast(`${deadlineTypeInfo(type).label} · ${DeadlineEngine.dueText(entity)} · prioridade ${PriorityEngine.text(priority)}`, 'ok',
          { title: dl ? 'Prazo atualizado' : `${title} adicionado` });
      }) })
    ];
    if(dl) actions.unshift(h('button', { class:'linkbtn danger', type:'button', text:'excluir', onclick: async () => { close(); await deleteDeadline(dl.id); } }));
    return { title: dl ? 'Editar prazo' : 'Novo prazo', content, actions };
  }, { size:'wide' });
}

/** Mantido por compatibilidade com chamadas antigas. */
async function completeDeadline(id){ return setDeadlineStatus(id, 'completed'); }

/* =========================================================================
   TELA: ANÁLISES — v6
   ESCOLHER → GERAR → ENTENDER → EXPLORAR.

   A tela não começa falando: primeiro pergunta o que a pessoa quer entender.
   Três escolhas (o que analisar, qual período, o que ver) formam UMA consulta
   (`ui.analyticsQuery`). Tudo o que aparece no resultado — resumo, números,
   gráfico, insights, "Explorar mais" e o relatório .txt — sai dessa mesma
   consulta, calculada uma única vez pelo AnalyticsEngine.

   `ui.period`, `ui.periodPreset` e `ui.analyticsScope` continuam existindo,
   mas só como ESPELHOS da consulta aplicada (usados pelo calendário e pelo
   filtro "Período da última análise" do Histórico). Ninguém os altera
   diretamente: toda mudança passa por applyAnalyticsQuery().
   ========================================================================= */
const ANALYTICS_PRESETS = [
  { v:'hoje',   label:'Hoje',            explain:'Só o dia de hoje.' },
  { v:'semana', label:'Esta semana',     explain:'Os dias da semana atual.' },
  { v:'7d',     label:'Últimos 7 dias',  explain:'Hoje e os seis dias anteriores.' },
  { v:'mes',    label:'Este mês',        explain:'Do dia 1 ao último dia do mês atual.' },
  { v:'30d',    label:'Últimos 30 dias', explain:'Hoje e os 29 dias anteriores.' },
  { v:'tudo',   label:'Tudo',            explain:'Desde o primeiro estudo registrado até hoje.' }
];
const CUSTOM_PERIOD_EXPLAIN = 'Você escolhe o primeiro e o último dia.';

const ANALYTICS_SCOPE_KINDS = [
  { v:'all',        label:'Todos os estudos', short:'Tudo o que você registrou.' },
  { v:'area',       label:AREA_TERM,          short:'Um grupo de disciplinas, como Faculdade ou Idiomas.' },
  { v:'discipline', label:'Disciplina',       short:'Uma matéria ou campo que você estuda.' },
  { v:'topic',      label:'Tópico',           short:'Uma parte específica de uma disciplina.' }
];

const ANALYTICS_FOCUS = [
  { v:'overview',  label:'Visão geral',        short:'Um resumo do período.' },
  { v:'time',      label:'Tempo e constância', short:'Quanto e com que frequência você estudou.' },
  { v:'planning',  label:'Planejamento',       short:'Planejado e realizado.' },
  { v:'reviews',   label:'Revisões',           short:'O que você revisou e o que precisa de atenção.' },
  { v:'content',   label:'Conteúdo',           short:'O que avançou e o que ainda falta.' },
  { v:'deadlines', label:'Prazos',             short:'Datas importantes relacionadas aos estudos.' }
];
function focusInfo(v){ return ANALYTICS_FOCUS.find(f => f.v === v) || ANALYTICS_FOCUS[0]; }

function presetRange(preset){
  const t = today();
  switch(preset){
    case 'hoje':   return { start:t, end:t };
    case '7d':     return { start:addDays(t,-6), end:t };
    case '30d':    return { start:addDays(t,-29), end:t };
    case 'semana': return { start:startOfWeek(t), end:endOfWeek(t) };
    case 'mes':    return { start:startOfMonth(t), end:endOfMonth(t) };
    case 'tudo': {
      if(!state.sessions.length) return { start:t, end:t };
      const min = state.sessions.reduce((m,s) => s.date < m ? s.date : m, state.sessions[0].date);
      const first = parseISO(min) || t;
      return { start: first > t ? t : first, end:t };
    }
    default: return { start:startOfWeek(t), end:endOfWeek(t) };
  }
}
function validPreset(p){ return ANALYTICS_PRESETS.some(x => x.v === p) ? p : 'semana'; }

/* ---------- a consulta ---------- */
function defaultAnalyticsQuery(){
  return { scopeType:'all', scopeId:null, periodPreset: validPreset(state.settings.defaultPeriod),
           startDate:null, endDate:null, focus:'overview' };
}
/** Saneia uma consulta vinda da interface ou da memória. Nunca lança. */
function normalizeAnalyticsQuery(raw){
  const q = Object.assign(defaultAnalyticsQuery(), raw || {});
  if(!ANALYTICS_SCOPE_KINDS.some(k => k.v === q.scopeType)) q.scopeType = 'all';
  if(q.scopeType === 'all') q.scopeId = null;
  q.scopeId = q.scopeId ? String(q.scopeId) : null;
  if(q.periodPreset !== 'custom') q.periodPreset = validPreset(q.periodPreset);
  if(q.periodPreset === 'custom'){
    q.startDate = parseISO(q.startDate) ? String(q.startDate).slice(0, 10) : null;
    q.endDate = parseISO(q.endDate) ? String(q.endDate).slice(0, 10) : null;
    if(q.startDate && q.endDate && q.startDate > q.endDate){ const x = q.startDate; q.startDate = q.endDate; q.endDate = x; }
  } else { q.startDate = null; q.endDate = null; }
  if(!ANALYTICS_FOCUS.some(f => f.v === q.focus)) q.focus = 'overview';
  return { scopeType:q.scopeType, scopeId:q.scopeId, periodPreset:q.periodPreset, startDate:q.startDate, endDate:q.endDate, focus:q.focus };
}
function analyticsQueryRange(q){
  if(q.periodPreset === 'custom' && q.startDate && q.endDate) return { start: parseISO(q.startDate), end: parseISO(q.endDate) };
  return presetRange(q.periodPreset === 'custom' ? 'semana' : q.periodPreset);
}
/** Consulta → escopo bruto que o AnalyticsScope entende. */
function analyticsQueryScope(q){
  if(q.scopeType === 'area') return { type:'area', areaId:q.scopeId };
  if(q.scopeType === 'discipline') return { type:'discipline', disciplineId:q.scopeId };
  if(q.scopeType === 'topic') return { type:'topic', topicId:q.scopeId };
  return { type:'all' };
}
function analyticsPeriodLabel(q){
  const p = ANALYTICS_PRESETS.find(x => x.v === q.periodPreset);
  return p ? p.label : 'Período personalizado';
}
/** O que ainda falta escolher (null = pronta para gerar). */
function analyticsQueryMissing(q){
  if(q.scopeType !== 'all'){
    if(!q.scopeId) return q.scopeType === 'area' ? 'Escolha a Área de Estudo.' : q.scopeType === 'discipline' ? 'Escolha a disciplina.' : 'Escolha o tópico.';
    if(AnalyticsScope.resolve(analyticsQueryScope(q)).fellBack) return 'O item escolhido não existe mais. Escolha outro.';
  }
  if(q.periodPreset === 'custom'){
    if(!q.startDate) return 'Escolha o primeiro dia do período.';
    if(!q.endDate) return 'Escolha o último dia do período.';
    if(rangeDays({ start:parseISO(q.startDate), end:parseISO(q.endDate) }) > 3660) return 'Escolha um intervalo de até 10 anos.';
  }
  const fa = analyticsFocusAvailability(q)[q.focus];
  if(fa && fa.disabled) return fa.reason;
  return null;
}
function analyticsQueryText(q){
  const sc = AnalyticsScope.resolve(analyticsQueryScope(q));
  return `${AnalyticsScope.pathText(sc)} · ${analyticsPeriodLabel(q)} · ${focusInfo(q.focus).label}`;
}
/* ---------- disponibilidade: só oferecer o que tem dado real ---------- */
function analyticsScopeAvailability(){
  const discs = activeDisciplines();
  const areas = activeAreas();
  const loose = discs.some(d => !d.areaId || !getArea(d.areaId) || getArea(d.areaId).archived);
  const topics = AnalyticsScope.topics({ type:'all' });
  return {
    all:        { disabled:false },
    area:       areas.length ? { disabled:false } : { disabled:true, reason:'Nenhuma Área de Estudo cadastrada ainda.' },
    discipline: discs.length ? { disabled:false } : { disabled:true, reason:'Nenhuma disciplina cadastrada ainda.' },
    topic:      topics.length ? { disabled:false } : { disabled:true, reason:'Nenhum tópico cadastrado ainda.' },
    loose
  };
}
function hasAnyPlan(){
  return state.plans.some(p => (p.allocations || []).some(a => (a.targetMinutes || 0) > 0)) ||
         state.weeklyPlans.some(w => (w.allocations || []).some(a => (a.targetMinutes || 0) > 0));
}
/** Combinações sem sentido ficam desabilitadas COM explicação, nunca geram página vazia. */
function analyticsFocusAvailability(q){
  const out = {};
  ANALYTICS_FOCUS.forEach(f => { out[f.v] = { disabled:false }; });
  if(q.scopeType === 'topic') out.planning = { disabled:true, reason:'O plano semanal é por disciplina. Para ver planejado e realizado, analise a disciplina deste tópico.' };
  else if(!hasAnyPlan()) out.planning = { disabled:true, reason:'Você ainda não definiu tempo semanal em Planejamento.' };
  const complete = q.scopeType === 'all' || !!q.scopeId;
  if(!complete) return out;
  const sc = AnalyticsScope.resolve(analyticsQueryScope(q));
  if(sc.fellBack) return out;
  const topics = AnalyticsScope.topics(sc);
  if(!topics.length){
    out.reviews = { disabled:true, reason:'Revisões acontecem por tópico, e não há tópicos aqui.' };
    out.content = { disabled:true, reason:'Não há tópicos cadastrados aqui.' };
  }
  if(!state.deadlines.some(dl => AnalyticsScope.deadlineRelation(sc, dl))) out.deadlines = { disabled:true, reason:'Nenhum prazo ligado a esta escolha.' };
  return out;
}

/* ---------- entrada única para mudar o que está sendo analisado ---------- */
/** Aplica uma consulta e mostra o resultado. Todos os caminhos passam por aqui. */
function applyAnalyticsQuery(raw, opts){
  const o = opts || {};
  const q = normalizeAnalyticsQuery(raw);
  const missing = analyticsQueryMissing(q);
  if(missing){ toast(missing, 'warn', { title:'Falta uma escolha' }); return false; }
  const range = analyticsQueryRange(q);
  ui.analyticsQuery = q;
  ui.analyticsDraft = null;
  ui.analyticsMode = 'result';
  ui.analyticsExplore = new Set(o.keepExplore && ui.analyticsExplore ? ui.analyticsExplore : []);
  ui.analyticsShowAllInsights = false;
  // espelhos (calendário e Histórico leem estes valores)
  ui.period = { start:range.start, end:range.end };
  ui.periodPreset = q.periodPreset === 'custom' ? null : q.periodPreset;
  ui.analyticsScope = analyticsQueryScope(q);
  ui.calMode = 'view'; ui.calSel = { start:null, end:null };
  ui.calMonth = new Date(range.end.getFullYear(), range.end.getMonth(), 1);
  ui.weekOffset = 0;
  setMeta('analyticsLastQuery', q).catch(err => console.error(err));
  if(ui.view !== 'analytics'){ ui.analyticsKeepMode = true; setView('analytics'); }
  else {
    renderAnalytics({ animate:true });
    window.scrollTo({ top:0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
  return true;
}
/** Muda só o período, mantendo escopo e foco (calendário, "analisar este dia"). */
function setAnalyticsPeriod(range, preset){
  const s = range.start <= range.end ? range.start : range.end;
  const e = range.start <= range.end ? range.end : range.start;
  const base = ui.analyticsQuery || defaultAnalyticsQuery();
  applyAnalyticsQuery(Object.assign({}, base, preset
    ? { periodPreset:preset }
    : { periodPreset:'custom', startDate:dateToISO(s), endDate:dateToISO(e) }));
}
/** Muda só o escopo, mantendo período e foco (drill-down). */
function setAnalyticsScope(type, ids){
  const i = ids || {};
  const id = type === 'area' ? i.areaId : type === 'discipline' ? i.disciplineId : type === 'topic' ? i.topicId : null;
  const base = ui.analyticsQuery || defaultAnalyticsQuery();
  const next = Object.assign({}, base, { scopeType:type, scopeId:id || null });
  // o foco atual pode não fazer sentido no novo escopo: volta para a visão geral
  if(analyticsFocusAvailability(next)[next.focus].disabled) next.focus = 'overview';
  applyAnalyticsQuery(next);
}
/** Atalho usado pelos detalhes: "Analisar só esta disciplina". */
function analyzeOnly(type, id){
  Drawer.close();
  const ids = type === 'area' ? { areaId:id } : type === 'discipline' ? { disciplineId:id } : { topicId:id };
  setAnalyticsScope(type, ids);
  toast('Período e foco foram mantidos.', 'info', { title:'Análise atualizada' });
}
/** Volta para o seletor com a consulta atual pré-selecionada. */
function openAnalyticsSelector(opts){
  const o = opts || {};
  ui.analyticsDraft = normalizeAnalyticsQuery(ui.analyticsQuery || defaultAnalyticsQuery());
  ui.analyticsMode = 'select';
  ui.anPick = { search:'', month:null, editing: !!ui.analyticsQuery, revealed: ui.analyticsDraft.scopeType };
  if(ui.view !== 'analytics'){ ui.analyticsKeepMode = true; setView('analytics'); }
  else renderAnalytics({ animate:true });
  const sel = o.section === 'period' ? '#an-step-period' : '#an-step-scope';
  requestAnimationFrame(() => {
    const box = $(sel);
    if(!box) return;
    box.scrollIntoView({ block:'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    const first = box.querySelector('[aria-checked="true"]:not([disabled]), button:not([disabled])');
    if(first) first.focus({ preventScroll:true });
  });
}
function cancelAnalyticsSelector(){
  if(!ui.analyticsQuery) return;
  ui.analyticsDraft = null;
  ui.analyticsMode = 'result';
  renderAnalytics({ animate:true });
}
/** Chamado pelo setView ao ENTRAR em Análises vindo de outra tela. */
function onEnterAnalytics(){
  if(ui.analyticsKeepMode){ ui.analyticsKeepMode = false; return; }
  /* v6.5 — sair de Análises e voltar não joga fora a análise montada nesta
     sessão: a pessoa reencontra o resultado onde deixou (com o período relativo
     recalculado para hoje). Se o que estava sendo analisado deixou de existir,
     a tela volta para a escolha. "Alterar análise" continua a um clique. */
  if(ui.analyticsQuery){
    const q = normalizeAnalyticsQuery(ui.analyticsQuery);
    if(!analyticsQueryMissing(q)){
      const range = analyticsQueryRange(q);
      ui.analyticsQuery = q;
      ui.analyticsDraft = null;
      ui.analyticsMode = 'result';
      ui.period = { start:range.start, end:range.end };
      ui.analyticsScope = analyticsQueryScope(q);
      return;
    }
    ui.analyticsQuery = null;
  }
  ui.analyticsMode = 'select';
  ui.analyticsDraft = defaultAnalyticsQuery();
  ui.anPick = { search:'', month:null, editing:false, revealed:'all' };
}

function renderAnalytics(opts){
  const root = $('#analytics-body');
  if(!root) return;
  const o = opts || {};
  const sub = $('#view-analytics .page-head .sub');
  if(ui.analyticsMode === 'result' && ui.analyticsQuery){
    if(sub) sub.textContent = 'O resultado da sua escolha. Explore os detalhes quando quiser.';
    renderAnalyticsResult(root);
  } else {
    ui.analyticsMode = 'select';
    if(!ui.analyticsDraft) ui.analyticsDraft = defaultAnalyticsQuery();
    if(!ui.anPick) ui.anPick = { search:'', month:null, editing:false, revealed:ui.analyticsDraft.scopeType };
    if(sub) sub.textContent = 'O que você quer entender?';
    renderAnalyticsSelector(root);
  }
  if(o.animate && !prefersReducedMotion()){
    root.classList.remove('an-swap'); void root.offsetWidth; root.classList.add('an-swap');
  }
  if(ui.calRefocus){
    const el = root.querySelector(`.cal-day[data-date="${ui.calRefocus}"]`);
    ui.calRefocus = null;
    if(el) el.focus({ preventScroll:true });
  }
}

/** Setas movem o foco em grupos de rádio feitos com botões (padrão ARIA). */
function radioKeys(group){
  group.addEventListener('keydown', (e) => {
    const items = $$('[role="radio"]:not([disabled])', group);
    const i = items.indexOf(document.activeElement);
    if(i < 0) return;
    let n = null;
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
    else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length;
    else if(e.key === 'Home') n = 0;
    else if(e.key === 'End') n = items.length - 1;
    if(n === null) return;
    e.preventDefault();
    items.forEach((it, k) => it.setAttribute('tabindex', k === n ? '0' : '-1'));
    items[n].focus();
  });
}
/** Garante um único item focável por Tab no grupo (o escolhido, senão o primeiro). */
function rovingInit(group){
  const items = $$('[role="radio"]', group);
  const on = items.find(x => x.getAttribute('aria-checked') === 'true' && !x.disabled) || items.find(x => !x.disabled);
  items.forEach(x => x.setAttribute('tabindex', x === on ? '0' : '-1'));
  radioKeys(group);
  return group;
}

/* =========================================================================
   SELETOR — "O que você quer entender?"
   ========================================================================= */
function renderAnalyticsSelector(root){
  const d = ui.analyticsDraft;
  const pick = ui.anPick;
  const parts = [];

  /* atalho discreto: repetir a última análise (só se existir e ainda for válida) */
  const last = state.meta.analyticsLastQuery ? normalizeAnalyticsQuery(state.meta.analyticsLastQuery) : null;
  if(!pick.editing && last && !analyticsQueryMissing(last) && !AnalyticsScope.resolve(analyticsQueryScope(last)).fellBack){
    parts.push(h('div', { class:'an-repeat' },
      h('span', { class:'an-repeat-l', text:'Última análise' }),
      h('span', { class:'an-repeat-v', text: analyticsQueryText(last) }),
      h('button', { class:'linkbtn', type:'button', text:'Repetir', onclick:() => applyAnalyticsQuery(last) })));
  }
  if(!state.sessions.length){
    parts.push(h('p', { class:'an-note', text:'Você ainda não registrou nenhum estudo. Prazos e conteúdo já podem ser analisados; tempo e constância aparecem depois dos primeiros estudos.' }));
  }

  const rerender = (focusKey) => {
    renderAnalytics();
    if(focusKey){ const el = root.querySelector(`[data-k="${focusKey}"]`); if(el) el.focus({ preventScroll:true }); }
  };

  /* ---------- 1. o que analisar ---------- */
  const av = analyticsScopeAvailability();
  const scopeGroup = h('div', { class:'an-options an-options-4', role:'radiogroup', 'aria-labelledby':'an-q-scope' });
  ANALYTICS_SCOPE_KINDS.forEach(k => {
    const a = av[k.v];
    const on = d.scopeType === k.v;
    scopeGroup.append(h('button', { class:'an-option', type:'button', role:'radio', 'aria-checked': on ? 'true' : 'false',
        disabled: a.disabled, dataset:{ k:'scope-' + k.v }, 'aria-describedby': 'an-sd-' + k.v,
        onclick:() => {
          if(d.scopeType === k.v) return;
          d.scopeType = k.v;
          d.scopeId = k.v === 'all' ? null : defaultScopeIdFor(k.v);
          pick.search = '';
          if(analyticsFocusAvailability(d)[d.focus].disabled) d.focus = 'overview';
          rerender('scope-' + k.v);
        } },
      h('span', { class:'an-option-t', text:k.label }),
      h('span', { class:'an-option-s', id:'an-sd-' + k.v, text: a.disabled ? a.reason : k.short })));
  });
  rovingInit(scopeGroup);

  let picker = null;
  if(d.scopeType !== 'all'){
    picker = scopePicker(d, pick, rerender);
    if(pick.revealed !== d.scopeType){ picker.classList.add('is-revealing'); pick.revealed = d.scopeType; }
  }
  parts.push(h('section', { class:'an-step', id:'an-step-scope', 'aria-labelledby':'an-q-scope' },
    h('h3', { class:'an-step-q', id:'an-q-scope' }, h('span', { class:'an-step-n', 'aria-hidden':'true', text:'1' }), 'O que você quer analisar?'),
    scopeGroup, picker));

  /* ---------- 2. período ---------- */
  const periodGroup = h('div', { class:'an-chips', role:'radiogroup', 'aria-labelledby':'an-q-period' });
  ANALYTICS_PRESETS.concat([{ v:'custom', label:'Personalizado', explain:CUSTOM_PERIOD_EXPLAIN }]).forEach(p => {
    const on = d.periodPreset === p.v;
    periodGroup.append(h('button', { class:'an-chip', type:'button', role:'radio', 'aria-checked': on ? 'true' : 'false',
      dataset:{ k:'period-' + p.v }, text:p.label,
      onclick:() => {
        if(d.periodPreset === p.v) return;
        d.periodPreset = p.v;
        if(p.v !== 'custom'){ d.startDate = null; d.endDate = null; }
        else { pick.month = null; }
        rerender('period-' + p.v);
      } }));
  });
  rovingInit(periodGroup);
  let periodExplain;
  if(d.periodPreset === 'custom'){
    periodExplain = null;
  } else {
    const r = presetRange(d.periodPreset);
    const p = ANALYTICS_PRESETS.find(x => x.v === d.periodPreset);
    periodExplain = h('p', { class:'an-step-help', 'aria-live':'polite' },
      h('strong', { text: fmtRangeLabel(r) }), ` · ${plural(rangeDays(r), 'dia', 'dias')}. ${p ? p.explain : ''}`);
  }
  parts.push(h('section', { class:'an-step', id:'an-step-period', 'aria-labelledby':'an-q-period' },
    h('h3', { class:'an-step-q', id:'an-q-period' }, h('span', { class:'an-step-n', 'aria-hidden':'true', text:'2' }), 'Qual período?'),
    periodGroup, periodExplain, d.periodPreset === 'custom' ? rangePicker(d, pick, rerender) : null));

  /* ---------- 3. o que ver ---------- */
  const fav = analyticsFocusAvailability(d);
  const focusGroup = h('div', { class:'an-options an-options-3', role:'radiogroup', 'aria-labelledby':'an-q-focus' });
  ANALYTICS_FOCUS.forEach(f => {
    const a = fav[f.v];
    const on = d.focus === f.v;
    focusGroup.append(h('button', { class:'an-option', type:'button', role:'radio', 'aria-checked': on ? 'true' : 'false',
        disabled: a.disabled, dataset:{ k:'focus-' + f.v }, 'aria-describedby': 'an-fd-' + f.v,
        onclick:() => { if(d.focus === f.v) return; d.focus = f.v; rerender('focus-' + f.v); } },
      h('span', { class:'an-option-t', text:f.label }),
      h('span', { class:'an-option-s', id:'an-fd-' + f.v, text: a.disabled ? a.reason : f.short })));
  });
  rovingInit(focusGroup);
  parts.push(h('section', { class:'an-step', id:'an-step-focus', 'aria-labelledby':'an-q-focus' },
    h('h3', { class:'an-step-q', id:'an-q-focus' }, h('span', { class:'an-step-n', 'aria-hidden':'true', text:'3' }), 'O que você quer ver?'),
    focusGroup));

  /* ---------- gerar ---------- */
  const missing = analyticsQueryMissing(d);
  parts.push(h('div', { class:'an-generate' },
    h('p', { class:'an-generate-status', role:'status', 'aria-live':'polite', id:'an-gen-status',
      text: missing || analyticsQueryText(d) }),
    h('div', { class:'an-generate-actions' },
      pick.editing ? h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick: cancelAnalyticsSelector }) : null,
      h('button', { class:'btn primary lg', type:'button', disabled: !!missing, 'aria-describedby':'an-gen-status',
        onclick:() => applyAnalyticsQuery(d) }, 'Gerar análise'))));

  mount(root, h('div', { class:'an-ask' }, parts));
}

/** Um bom padrão ao escolher o tipo: o item mais estudado recentemente — nunca um fictício. */
function defaultScopeIdFor(kind){
  const recent = analyticsRecentIds(kind);
  if(recent.length) return recent[0];
  const items = analyticsScopeItems(kind);
  return items.length === 1 ? items[0].id : null;
}

/** Itens reais de cada tipo de escopo, com o contexto que ajuda a reconhecê-los. */
function analyticsScopeItems(kind){
  if(kind === 'area'){
    const items = activeAreas().slice().sort(sortByName).map(a => {
      const n = activeDisciplines().filter(d => d.areaId === a.id).length;
      return { id:a.id, name:a.name, sub: plural(n, 'disciplina', 'disciplinas') };
    });
    if(analyticsScopeAvailability().loose){
      const n = activeDisciplines().filter(d => !d.areaId || !getArea(d.areaId) || getArea(d.areaId).archived).length;
      items.push({ id:NO_AREA_ID, name:NO_AREA_LABEL, sub:`${plural(n, 'disciplina', 'disciplinas')} ainda não organizadas` });
    }
    return items;
  }
  if(kind === 'discipline'){
    return activeDisciplines().slice().sort(sortByName).map(d => ({ id:d.id, name:d.name, sub: areaNameOf(d) }));
  }
  if(kind === 'topic'){
    return AnalyticsScope.topics({ type:'all' }).slice().sort(sortByName).map(t => {
      const d = getDiscipline(t.disciplineId);
      const a = d && d.areaId ? getArea(d.areaId) : null;
      return { id:t.id, name:t.name, sub: d ? (a ? `${d.name} › ${a.name}` : d.name) : '' };
    });
  }
  return [];
}
/** Itens estudados mais recentemente (pela data da última sessão). */
function analyticsRecentIds(kind){
  const last = new Map();
  const bump = (k, date) => { if(k && (!last.has(k) || date > last.get(k))) last.set(k, date); };
  state.sessions.forEach(s => {
    if(kind === 'topic') bump(s.topicId, s.date);
    else if(kind === 'discipline') bump(s.disciplineId, s.date);
    else if(kind === 'area'){
      const d = getDiscipline(s.disciplineId);
      bump(d && d.areaId && getArea(d.areaId) && !getArea(d.areaId).archived ? d.areaId : NO_AREA_ID, s.date);
    }
  });
  const valid = new Set(analyticsScopeItems(kind).map(i => i.id));
  return Array.from(last.entries()).filter(([k]) => valid.has(k)).sort((a,b) => b[1].localeCompare(a[1])).map(([k]) => k);
}

/**
 * Escolha do item. Poucos itens: lista direta. Muitos: busca instantânea,
 * com "Recentes" quando houver histórico. Nunca três selects encadeados.
 */
function scopePicker(d, pick, rerender){
  const kind = d.scopeType;
  const items = analyticsScopeItems(kind);
  const byId = new Map(items.map(i => [i.id, i]));
  const labels = { area:'Qual Área de Estudo?', discipline:'Qual disciplina?', topic:'Qual tópico?' };
  const box = h('div', { class:'an-picker', role:'group', 'aria-labelledby':'an-picker-l' },
    h('p', { class:'an-picker-l', id:'an-picker-l', text: labels[kind] }));
  const choose = (id) => {
    d.scopeId = id;
    if(analyticsFocusAvailability(d)[d.focus].disabled) d.focus = 'overview';
    rerender('pick-' + id);
  };
  const itemBtn = (it) => h('button', { class:'an-pick', type:'button', role:'radio',
      'aria-checked': d.scopeId === it.id ? 'true' : 'false', dataset:{ k:'pick-' + it.id }, onclick:() => choose(it.id) },
    h('span', { class:'an-pick-t', text:it.name }),
    it.sub ? h('span', { class:'an-pick-s', text:it.sub }) : null);

  const needsSearch = items.length > 6 || kind === 'topic';
  if(!needsSearch){
    const list = h('div', { class:'an-pick-list', role:'radiogroup', 'aria-labelledby':'an-picker-l' }, items.map(itemBtn));
    box.append(rovingInit(list));
    return box;
  }

  const listBox = h('div', { class:'an-pick-results' });
  // v6.3: texto de busca normalizado uma vez por abertura, não a cada tecla
  const keys = new Map(items.map(i => [i.id, normalizeText(i.name + ' ' + (i.sub || ''))]));
  const drawList = () => {
    clear(listBox);
    const q = normalizeText(pick.search);
    let shown, heading = null;
    if(q){
      shown = items.filter(i => keys.get(i.id).includes(q)).slice(0, 30);
      heading = shown.length ? null : `Nada encontrado para “${pick.search}”.`;
    } else {
      const recent = analyticsRecentIds(kind).slice(0, kind === 'topic' ? 6 : 4).map(id => byId.get(id)).filter(Boolean);
      if(recent.length){
        listBox.append(h('p', { class:'an-pick-group', text:'Recentes' }));
        listBox.append(rovingInit(h('div', { class:'an-pick-list', role:'radiogroup', 'aria-label':'Recentes' }, recent.map(itemBtn))));
      }
      if(kind === 'topic'){
        shown = [];
        heading = `Digite para buscar entre ${plural(items.length, 'tópico', 'tópicos')}.`;
      } else {
        shown = items;
        if(recent.length) listBox.append(h('p', { class:'an-pick-group', text:'Todas' }));
      }
    }
    if(shown.length) listBox.append(rovingInit(h('div', { class:'an-pick-list is-scroll', role:'radiogroup', 'aria-label': labels[kind] }, shown.map(itemBtn))));
    if(heading) listBox.append(h('p', { class:'an-pick-empty', text:heading }));
  };
  const input = h('input', { type:'search', class:'an-pick-search', value: pick.search, autocomplete:'off', spellcheck:'false', 'data-context-search':'',
    placeholder: kind === 'topic' ? 'Buscar um tópico… ex.: OSPF' : kind === 'area' ? 'Buscar uma área…' : 'Buscar uma disciplina…', 'aria-label': labels[kind] });
  input.addEventListener('input', () => { pick.search = input.value; drawList(); });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowDown'){ const f = listBox.querySelector('[role="radio"]'); if(f){ e.preventDefault(); f.focus(); } }
    if(e.key === 'Enter'){ const f = listBox.querySelector('[role="radio"]'); if(f){ e.preventDefault(); f.click(); } }
  });
  const cur = d.scopeId ? byId.get(d.scopeId) : null;
  box.append(
    cur ? h('p', { class:'an-picked' }, h('span', { class:'an-picked-k', text:'Escolhido:' }), h('strong', { text:cur.name }), cur.sub ? h('span', { class:'an-pick-s', text:cur.sub }) : null) : null,
    h('div', { class:'an-search' }, icon('i-search'), input),
    listBox);
  drawList();
  return box;
}

/**
 * Período personalizado: seleção explícita em dois passos no calendário,
 * com campos de data como alternativa completa pelo teclado.
 */
function rangePicker(d, pick, rerender){
  const t = today();
  const base = pick.month || (d.endDate ? parseISO(d.endDate) : d.startDate ? parseISO(d.startDate) : t);
  const y = base.getFullYear(), mo = base.getMonth();
  const monthStart = new Date(y, mo, 1);
  const sISO = d.startDate, eISO = d.endDate, tISO = todayISO();

  let msg;
  if(!sISO) msg = 'Escolha o primeiro dia.';
  else if(!eISO) msg = `Início: ${fmtDayMonth(parseISO(sISO))}. Agora escolha o último.`;
  else {
    const r = { start:parseISO(sISO), end:parseISO(eISO) };
    msg = `${fmtRangeLabel(r)} · ${plural(rangeDays(r), 'dia', 'dias')}`;
  }
  const status = h('p', { class:'an-range-status' + (sISO && eISO ? ' is-done' : ''), role:'status', 'aria-live':'polite', text:msg });

  const goMonth = (delta) => { pick.month = new Date(y, mo + delta, 1); rerender(delta < 0 ? 'rp-prev' : 'rp-next'); };
  const head = h('div', { class:'rp-head' },
    h('button', { class:'icon-btn', type:'button', 'aria-label':'Mês anterior', dataset:{ k:'rp-prev' }, onclick:() => goMonth(-1) }, h('span', { 'aria-hidden':'true', text:'‹' })),
    h('span', { class:'rp-month', text:`${MONTHS[mo]} de ${y}` }),
    h('button', { class:'icon-btn', type:'button', 'aria-label':'Próximo mês', dataset:{ k:'rp-next' }, onclick:() => goMonth(1) }, h('span', { 'aria-hidden':'true', text:'›' })));

  const dows = weekStartDow() === 1 ? ['S','T','Q','Q','S','S','D'] : ['D','S','T','Q','Q','S','S'];
  const grid = h('div', { class:'rp-grid', role:'group', 'aria-label': !sISO || eISO ? 'Escolha o primeiro dia do período' : 'Escolha o último dia do período' });
  dows.forEach(x => grid.append(h('span', { class:'rp-dow', 'aria-hidden':'true', text:x })));
  const blanks = (monthStart.getDay() - weekStartDow() + 7) % 7;
  for(let i = 0; i < blanks; i++) grid.append(h('span', { class:'rp-day blank', 'aria-hidden':'true' }));
  const total = new Date(y, mo + 1, 0).getDate();
  const focusISO = (sISO && sISO.slice(0, 7) === dateToISO(monthStart).slice(0, 7)) ? sISO
    : (tISO.slice(0, 7) === dateToISO(monthStart).slice(0, 7) ? tISO : dateToISO(monthStart));
  for(let day = 1; day <= total; day++){
    const iso = dateToISO(new Date(y, mo, day));
    let cls = 'rp-day';
    const lo = sISO, hi = eISO || sISO;
    if(lo && iso >= lo && iso <= hi) cls += ' inrange';
    if(iso === sISO || iso === eISO) cls += ' edge';
    if(iso === tISO) cls += ' today';
    if(iso > tISO) cls += ' future';
    grid.append(h('button', { type:'button', class:cls, dataset:{ date:iso, k:'rp-' + iso },
      tabindex: iso === focusISO ? '0' : '-1', 'aria-pressed': (iso === sISO || iso === eISO) ? 'true' : 'false',
      'aria-label': fmtDateLong(iso) + (iso === tISO ? ', hoje' : ''),
      onclick:() => {
        if(!d.startDate || d.endDate){ d.startDate = iso; d.endDate = null; }
        else if(iso < d.startDate){ d.endDate = d.startDate; d.startDate = iso; }
        else d.endDate = iso;
        pick.month = new Date(y, mo, 1);
        rerender('rp-' + iso);
      } }, String(day)));
  }
  grid.addEventListener('keydown', (e) => {
    const cur = e.target.closest && e.target.closest('.rp-day[data-date]');
    if(!cur) return;
    const step = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7 }[e.key];
    if(!step) return;
    e.preventDefault();
    const iso = dateToISO(addDays(parseISO(cur.dataset.date), step));
    const el = grid.querySelector(`.rp-day[data-date="${iso}"]`);
    if(el){ $$('.rp-day[tabindex="0"]', grid).forEach(x => x.setAttribute('tabindex', '-1')); el.setAttribute('tabindex', '0'); el.focus(); }
    else { const nd = parseISO(iso); pick.month = new Date(nd.getFullYear(), nd.getMonth(), 1); rerender('rp-' + iso); }
  });

  const startIn = h('input', { type:'date', id:'an-rs', value: sISO || '' });
  const endIn = h('input', { type:'date', id:'an-re', value: eISO || '' });
  const syncInputs = () => {
    d.startDate = parseISO(startIn.value) ? startIn.value : null;
    d.endDate = parseISO(endIn.value) ? endIn.value : null;
    if(d.startDate && d.endDate && d.startDate > d.endDate){ const x = d.startDate; d.startDate = d.endDate; d.endDate = x; }
    const ref = d.endDate || d.startDate;
    if(ref){ const r = parseISO(ref); pick.month = new Date(r.getFullYear(), r.getMonth(), 1); }
    rerender(null);
  };
  startIn.addEventListener('change', () => { syncInputs(); const x = $('#an-rs'); if(x) x.focus(); });
  endIn.addEventListener('change', () => { syncInputs(); const x = $('#an-re'); if(x) x.focus(); });

  return h('div', { class:'an-range is-revealing' },
    status,
    h('div', { class:'rp' }, head, grid),
    h('div', { class:'an-range-inputs' },
      h('div', { class:'field tight' }, h('label', { for:'an-rs', text:'Data inicial' }), startIn),
      h('div', { class:'field tight' }, h('label', { for:'an-re', text:'Data final' }), endIn),
      (sISO || eISO) ? h('button', { class:'linkbtn muted', type:'button', text:'limpar datas', dataset:{ k:'rp-clear' },
        onclick:() => { d.startDate = null; d.endDate = null; rerender(null); } }) : null));
}

/* =========================================================================
   RESULTADO — resumo → poucos números → um gráfico → insights → explorar
   ========================================================================= */
function renderAnalyticsResult(root){
  let q = ui.analyticsQuery;
  let a = AnalyticsEngine.query(q);
  if(a.scope.fellBack){
    q = ui.analyticsQuery = normalizeAnalyticsQuery(Object.assign({}, q, { scopeType:'all', scopeId:null }));
    ui.analyticsScope = analyticsQueryScope(q);
    a = AnalyticsEngine.query(q);
    toast('O item que estava sendo analisado não existe mais. Mostrando todos os estudos.', 'info', { title:'Análise ajustada' });
  }
  const focus = q.focus;
  const parts = [analyticsResultHeader(a)];
  const empty = analyticsEmptyFor(a, focus);
  if(empty){
    parts.push(empty);
    mount(root, h('div', { class:'an-result' }, parts));
    return;
  }
  parts.push(analyticsSummaryBlock(a, focus));
  const metrics = analyticsFocusMetrics(a, focus);
  if(metrics.length) parts.push(h('div', { class:'an-metrics', role:'group', 'aria-label':'Números principais' }, metrics.map(metricCard)));
  const viz = analyticsMainViz(a, focus);
  if(viz) parts.push(h('section', { class:'an-block an-viz', 'aria-labelledby':'an-viz-t' },
    h('h3', { class:'an-block-t', id:'an-viz-t', text:viz.title }), viz.node));
  const ins = analyticsInsightsBlock(a, focus);
  if(ins) parts.push(ins);
  const ex = analyticsExploreBlock(a, focus);
  if(ex) parts.push(ex);
  mount(root, h('div', { class:'an-result' }, parts));
}

function analyticsResultHeader(a){
  const q = a.query;
  const sc = a.scope;
  const kicker = sc.type === 'all' ? 'Todos os estudos'
    : sc.type === 'area' ? AREA_TERM
    : sc.path.length > 1 ? `${AnalyticsScope.kindLabel(sc)} · ${sc.path.slice(0, -1).join(' › ')}` : AnalyticsScope.kindLabel(sc);
  return h('header', { class:'an-head', id:'an-context' },
    h('div', { class:'an-head-main' },
      h('p', { class:'an-head-k', text: kicker }),
      h('h3', { class:'an-head-t', text: sc.type === 'all' ? 'Seus estudos' : sc.label }),
      h('p', { class:'an-head-meta' },
        h('span', { text: analyticsPeriodLabel(q) }),
        h('span', { class:'an-head-range', text: fmtRangeLabel(a.range) }),
        h('span', { class:'an-head-focus', text: focusInfo(q.focus).label }))),
    h('div', { class:'an-head-actions' },
      h('button', { class:'btn ghost sm', type:'button', onclick:() => openAnalyticsSelector() }, 'Alterar análise'),
      menuButton('Exportar', [
        { label:'Copiar resumo', run:() => copySummary(a) },
        { label:'Baixar relatório (.txt)', run: () => downloadReport(a) }
      ], { ariaLabel:'Exportar esta análise' })));
}

/** Sem dado para esta escolha: nada de painel zerado — uma frase e caminhos úteis. */
function analyticsEmptyFor(a, focus){
  const t = a.totals, sc = a.scope, q = a.query;
  const where = sc.type === 'all' ? '' : ` de ${sc.label}`;
  let title = null, text = '', extra = null;
  if((focus === 'overview' || focus === 'time') && t.count === 0){
    if(!state.sessions.length){
      title = 'Nada para analisar ainda';
      text = 'Registre seu primeiro estudo e o Ciclo mostra aqui quanto você estudou, com que frequência e onde o tempo foi parar.';
      extra = h('button', { class:'btn primary', type:'button', text:'Registrar estudo', onclick:() => openRegisterModal() });
    } else {
      title = `Ainda não há registros${where} neste período.`;
      text = `${analyticsPeriodLabel(q)}: ${fmtRangeLabel(a.range)}.`;
    }
  } else if(focus === 'planning' && !a.planAdherence.hasPlan){
    title = 'Não havia tempo planejado neste período.';
    text = 'O plano semanal é opcional. Quando você define quanto tempo tem por semana, esta análise compara o planejado com o realizado.';
    extra = h('button', { class:'btn ghost', type:'button', text:'Abrir Planejamento', onclick:() => setView('plan') });
  } else if(focus === 'reviews' && !a.reviews.completed && !a.reviews.overdueNow && !a.reviews.dueToday && !a.reviews.upcoming.length){
    title = `Nenhuma revisão${where} neste período.`;
    text = 'Revisões aparecem depois que você estuda um tópico. Nada está atrasado nem previsto para os próximos 7 dias.';
  } else if(focus === 'content' && !a.content.totalTopics && sc.type !== 'topic'){
    title = 'Não há tópicos cadastrados aqui.';
    text = 'Tópicos são as partes de uma disciplina, como Derivadas em Matemática.';
  } else if(focus === 'deadlines' && !a.deadlines.all.length){
    title = `Nenhum prazo${where}.`;
    text = 'Provas, trabalhos e entregas cadastrados em Disciplinas aparecem aqui.';
  }
  if(!title) return null;
  const broaden = [];
  if(sc.type === 'topic' && getDiscipline(sc.disciplineId)) broaden.push(['Analisar toda a disciplina', () => setAnalyticsScope('discipline', { disciplineId:sc.disciplineId })]);
  else if(sc.type === 'discipline' && sc.areaId && getArea(sc.areaId)) broaden.push([`Analisar ${getArea(sc.areaId).name}`, () => setAnalyticsScope('area', { areaId:sc.areaId })]);
  if(sc.type !== 'all' && (sc.type !== 'topic' || !broaden.length)) broaden.push(['Analisar todos os estudos', () => setAnalyticsScope('all')]);
  return h('section', { class:'an-empty', role:'status' },
    h('p', { class:'an-empty-t', text:title }),
    h('p', { class:'an-empty-s', text }),
    h('div', { class:'an-empty-actions' },
      extra,
      state.sessions.length || focus === 'deadlines' ? h('button', { class:'btn ghost', type:'button', text:'Escolher outro período', onclick:() => openAnalyticsSelector({ section:'period' }) }) : null,
      broaden.map(([label, run]) => h('button', { class:'btn ghost', type:'button', text:label, onclick:run }))));
}

/* ---------- 1. resumo humano ---------- */
function analyticsSummaryBlock(a, focus){
  const lines = analyticsFocusSummary(a, focus);
  return h('section', { class:'an-block an-summary', 'aria-labelledby':'an-sum-t' },
    h('h3', { class:'an-block-t', id:'an-sum-t', text:'Seu período em resumo' }),
    h('div', { class:'an-summary-text' }, lines.map((s, i) => h('p', { class: i === 0 ? 'lead' : null, text:s }))));
}

/** Frases determinísticas, na ordem em que as pessoas perguntam, para cada foco. */
function analyticsFocusSummary(a, focus){
  const t = a.totals, sc = a.scope, out = [];
  const where = sc.type === 'all' ? '' : ` em ${sc.label}`;
  if(focus === 'time'){
    out.push(`Você estudou ${fmtDuration(t.minutes)}${where} em ${t.activeDays} de ${plural(a.days, 'dia', 'dias')}.`);
    out.push(`Foram ${plural(t.count, 'estudo registrado', 'estudos registrados')}, com média de ${fmtDuration(t.avgSession)} cada.`);
    if(t.activeDays > 1) out.push(`Nos dias com estudo, a média foi ${fmtDuration(t.avgPerActiveDay)}.`);
    const best = a.byWeekday.slice().sort((x,y) => y.minutes - x.minutes)[0];
    if(a.days >= 7 && t.count >= 3 && best && best.minutes > 0) out.push(`${best.label} foi o dia da semana com mais tempo (${fmtDuration(best.minutes)}).`);
    restSentences(a).forEach(s => out.push(s));
    pushComparison(a, out);
  } else if(focus === 'planning'){
    const pa = a.planAdherence;
    out.push(`Você cumpriu ${safePct(pa.pct)} do plano: ${fmtDuration(pa.counted)} das ${fmtDuration(pa.planned)} planejadas, contando cada disciplina até o que foi planejado para ela.`);
    if(pa.extra >= 1) out.push(`Além disso, estudou ${fmtDuration(pa.extra)} fora do planejado — tempo a mais numa disciplina ou em disciplinas sem plano. No total foram ${fmtDuration(pa.realized)}.`);
    const planned = pa.perDiscipline.filter(x => x.planned > 0 && !x.archived);
    const below = planned.filter(x => x.pct !== null && x.pct < 70).slice(0, 2);
    const above = planned.filter(x => x.pct !== null && x.pct > 110).slice(0, 1);
    below.forEach(x => out.push(`${x.label} ficou abaixo do planejado: ${fmtDuration(x.realized)} de ${fmtDuration(x.planned)}.`));
    above.forEach(x => out.push(`${x.label} passou do planejado (${safePct(x.pct)}).`));
    if(planned.length > 1 && planned.every(x => (x.pct || 0) >= 100)) out.push('Todas as disciplinas alcançaram o planejado.');
  } else if(focus === 'reviews'){
    const r = a.reviews;
    out.push(r.completed ? `Você concluiu ${plural(r.completed, 'revisão', 'revisões')}${where} neste período.` : `Nenhuma revisão concluída${where} neste período.`);
    const good = sum(r.outcomes.filter(o => o.v === 'remembered' || o.v === 'mastered'), o => o.count);
    if(r.completed >= 2) out.push(`${good} de ${r.completed} terminaram como “Lembrei bem” ou “Dominei”.`);
    out.push(r.overdueNow ? `${plural(r.overdueNow, 'revisão está atrasada', 'revisões estão atrasadas')} agora.` : 'Nenhuma revisão está atrasada agora.');
    if(r.upcoming.length) out.push(`${plural(r.upcoming.length, 'revisão prevista', 'revisões previstas')} para os próximos 7 dias.`);
    if(r.avgMastery !== null && sc.type !== 'topic') out.push(`A consolidação média dos tópicos em revisão está em ${fmtNumber(r.avgMastery, 1)} de 5.`);
  } else if(focus === 'content'){
    const c = a.content;
    if(sc.type === 'topic'){
      const tp = getTopic(sc.topicId);
      const st = tp ? topicStatus(tp) : 'nao_iniciado';
      out.push(`${sc.label} está ${TOPIC_STATUS_LABEL[st].toLowerCase()}.`);
      if(tp && tp.masteryLevel) out.push(`Consolidação atual: ${tp.masteryLevel} de 5.`);
      if(tp){ const s = sessionsOfTopic(tp.id); out.push(`No total, ${fmtDuration(sum(s, x => x.minutes || 0))} de estudo, em ${plural(s.length, 'vez', 'vezes')}.`); }
    } else {
      out.push(`Você já estudou ${c.covered} de ${plural(c.totalTopics, 'tópico', 'tópicos')}${where} (${safePct(c.coverage)}).`);
      const inReview = (c.byStatus.find(x => x.key === 'em_revisao') || {}).count || 0;
      out.push(`${c.mastered} ${c.mastered === 1 ? 'está consolidado' : 'estão consolidados'}; ${inReview} em revisão.`);
      const highNs = c.notStarted.filter(tp => PriorityEngine.clamp(tp.priority) >= 4).length;
      if(highNs) out.push(`${plural(highNs, 'tópico de prioridade alta ainda não foi iniciado', 'tópicos de prioridade alta ainda não foram iniciados')}.`);
      else if(c.notStarted.length) out.push(`${plural(c.notStarted.length, 'tópico ainda não foi iniciado', 'tópicos ainda não foram iniciados')}.`);
      const top = a.byTopic.find(x => x.key !== '__none__');
      if(top) out.push(`${top.label} foi o tópico mais estudado no período (${fmtDuration(top.minutes)}).`);
    }
  } else if(focus === 'deadlines'){
    const dl = a.deadlines;
    out.push(dl.open.length ? `${plural(dl.open.length, 'prazo está em aberto', 'prazos estão em aberto')}${where}.` : `Nenhum prazo em aberto${where}.`);
    if(dl.next) out.push(`O próximo: ${DeadlineEngine.phrase(dl.next.dl)}.`);
    if(dl.overdue.length) out.push(`${plural(dl.overdue.length, 'prazo passou da data e continua em aberto', 'prazos passaram da data e continuam em aberto')}.`);
    if(dl.completedInRange.length) out.push(`${plural(dl.completedInRange.length, 'prazo foi concluído', 'prazos foram concluídos')} neste período.`);
    if(dl.dueInRange.length) out.push(`${plural(dl.dueInRange.length, 'prazo vence', 'prazos vencem')} dentro do período escolhido.`);
  } else {
    return a.summary.slice();
  }
  return out;
}
/** Descansos em frases: quanto, quantos e a relação com o estudo. Só descreve. */
/**
 * v6.5 — política de datas, dita só quando importa: se algum estudo do período
 * atravessou a meia-noite, a pessoa fica sabendo em que dia ele foi contado.
 */
function midnightNote(a){
  const crossed = (a.sessions || []).filter(x => { const c = sessionClockRange(x); return !!(c && c.nextDay); }).length;
  if(!crossed) return null;
  return h('p', { class:'hint', style:'margin-top:10px', text:
    `${plural(crossed, 'estudo deste período atravessou', 'estudos deste período atravessaram')} a meia-noite. Um estudo conta inteiro no dia em que começou.` });
}
function restSentences(a){
  const rs = a.rest, out = [];
  if(!rs.count) return out;
  out.push(rs.count === 1
    ? `Você fez 1 descanso, de ${fmtDurationWords(rs.minutes)}.`
    : `Você descansou ${fmtDuration(rs.minutes)} em ${rs.count} descansos, com média de ${fmtDurationWords(rs.avg)} cada.`);
  if(isNum(rs.studyPerRestHour) && rs.minutes >= 10) out.push(`Foram ${fmtDuration(rs.studyPerRestHour)} de estudo para cada 1h de descanso.`);
  return out;
}
function pushComparison(a, out){
  const cmp = a.previousComparison;
  if(cmp.available && isNum(cmp.minutesDelta) && a.totals.count > 0){
    const d = cmp.minutesDelta;
    out.push(Math.abs(d) >= 5
      ? `Isso é ${fmtNumber(Math.abs(d), 0)}% ${d >= 0 ? 'a mais' : 'a menos'} que no período anterior equivalente.`
      : 'O tempo ficou parecido com o do período anterior equivalente.');
  }
}

/* ---------- 2. métricas essenciais (3–4, só as úteis para o foco) ---------- */
const METRIC_WHEN = { period:'No período', now:'Situação atual', all:'Histórico inteiro' };
function metricCard(o){
  const val = String(o.value);
  const prev = UiMemory.stats.get('an:' + o.key);
  UiMemory.stats.set('an:' + o.key, val);
  const changed = prev !== undefined && prev !== val && !prefersReducedMotion();
  /* v6.5 — toda métrica diz A QUE TEMPO se refere. Algumas contam o que aconteceu
     no período escolhido; outras mostram como as coisas estão agora (e não mudam
     quando o período muda); poucas somam o histórico inteiro. Misturadas sem
     rótulo, pareciam todas "do período". */
  const whenText = METRIC_WHEN[o.when] || '';
  const inner = [
    h('span', { class:'an-metric-l', text:o.label }),
    h('span', { class:'an-metric-v' + (changed ? ' is-updated' : '') + (/\d/.test(val) ? '' : ' is-text') + (o.muted ? ' is-muted' : ''), text:val }),
    o.sub ? h('span', { class:'an-metric-s', text:o.sub }) : null,
    o.delta ? h('span', { class:'an-metric-d ' + o.delta.dir, text:o.delta.text }) : null,
    whenText ? h('span', { class:'an-metric-w', text:whenText }) : null
  ];
  if(!o.onOpen) return h('div', { class:'an-metric' }, inner);
  return h('button', { class:'an-metric is-action', type:'button', dataset:{ metric:o.key },
      'aria-label': `${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : ''}. Ver detalhes`, onclick: o.onOpen },
    inner, h('span', { class:'an-metric-go', 'aria-hidden':'true' }, icon('i-arrow', 'nav-icon')));
}

function analyticsFocusMetrics(a, focus){
  const t = a.totals, cmp = a.previousComparison, sc = a.scope;
  const delta = v => (cmp.available && isNum(v)) ? { text:`${v >= 0 ? '+' : '−'}${fmtNumber(Math.abs(v), 0)}% vs. período anterior`, dir: v >= 0 ? 'up' : 'down' } : null;
  const open = kind => () => openAnalyticsDrawer(kind, a);
  const M = {
    time:     () => ({ key:'time', when:'period', label:'Tempo estudado', value:fmtDuration(t.minutes), sub: t.activeDays ? `${fmtDuration(t.avgPerActiveDay)} por dia de estudo` : null, delta: delta(cmp.minutesDelta), onOpen:open('time') }),
    days:     () => ({ key:'days', when:'period', label:'Dias com estudo', value:String(t.activeDays), sub:`de ${plural(a.days, 'dia', 'dias')}`, delta: delta(cmp.activeDaysDelta), onOpen:open('sessions') }),
    sessions: () => ({ key:'sessions', when:'period', label:'Estudos registrados', value:String(t.count), sub: t.count ? `média de ${fmtDuration(t.avgSession)}` : null, delta: focus === 'time' ? delta(cmp.sessionsDelta) : null, onOpen:open('sessions') }),
    avgDay:   () => ({ key:'avgday', when:'period', label:'Média por dia de estudo', value:fmtDuration(t.avgPerActiveDay), sub:`${fmtDuration(t.avgPerDay)} por dia do período`, onOpen:open('time') }),
    // v6.4 — descanso é um número à parte: nunca somado ao tempo estudado
    rest:     () => ({ key:'rest', when:'period', label:'Descansos', value:fmtDuration(a.rest.minutes), sub: a.rest.count === 1 ? '1 descanso' : `${a.rest.count} descansos · média de ${fmtDurationWords(a.rest.avg)}`, onOpen:open('rest') }),
    plan:     () => ({ key:'plan', when:'period', label:METRIC_WORDS.adherence.title, value:safePct(a.planAdherence.pct), sub:`${fmtDuration(a.planAdherence.counted)} de ${fmtDuration(a.planAdherence.planned)}`, onOpen:open('plan') }),
    reviews:  () => ({ key:'reviews', when:'period', label:'Revisões concluídas', value:String(a.reviews.completed), sub: a.reviews.overdueNow ? `${plural(a.reviews.overdueNow, 'atrasada', 'atrasadas')} agora` : 'nenhuma atrasada agora', onOpen:open('reviews') }),
    coverage: () => ({ key:'content', when:'now', label:METRIC_WORDS.coverage.title, value:`${a.content.covered} de ${a.content.totalTopics}`, sub:`${safePct(a.content.coverage)} dos tópicos`, onOpen:open('content') })
  };
  const topicObj = sc.type === 'topic' ? getTopic(sc.topicId) : null;
  const masteryMetric = () => ({ key:'mastery', when:'now', label:'Consolidação estimada', value: topicObj && topicObj.masteryLevel ? `${topicObj.masteryLevel} de 5` : '—',
    sub: topicObj ? TOPIC_STATUS_LABEL[topicStatus(topicObj)] : null, muted: !(topicObj && topicObj.masteryLevel), onOpen:open('content') });
  const r = a.reviews, c = a.content, pa = a.planAdherence, dl = a.deadlines;

  if(focus === 'time') return [M.time(), M.days(), M.avgDay(), a.rest.count > 0 ? M.rest() : M.sessions()];
  if(focus === 'planning'){
    // v6.5 — volume e distribuição lado a lado, sem se confundirem: o que foi estudado no total
    // e, à parte, o que passou do planejado (não entra em "Plano cumprido").
    return [M.plan(),
      { key:'planned', when:'period', label:'Planejado', value:fmtDuration(pa.planned), onOpen:open('plan') },
      { key:'realized', when:'period', label:'Estudado no total', value:fmtDuration(pa.realized), sub: pa.volumePct !== null ? `${safePct(pa.volumePct)} do tempo planejado` : null, onOpen:open('plan') },
      { key:'pextra', when:'period', label:'Além do plano', value:fmtDuration(pa.extra), sub: pa.extra >= 1 ? 'não conta para o plano cumprido' : 'nada fora do planejado', muted: !(pa.extra >= 1), onOpen:open('plan') }];
  }
  if(focus === 'reviews'){
    return [
      { key:'rdone', when:'period', label:'Concluídas', value:String(r.completed), onOpen:open('reviews') },
      { key:'rlate', when:'now', label:'Atrasadas', value:String(r.overdueNow), onOpen:open('reviews') },
      { key:'rnext', when:'now', label:'Próximos 7 dias', value:String(r.upcoming.length), onOpen:open('reviews') },
      sc.type === 'topic' ? masteryMetric()
        : { key:'ravg', when:'now', label:'Consolidação estimada', value: r.avgMastery !== null ? `${fmtNumber(r.avgMastery, 1)} de 5` : '—', sub:'média dos tópicos em revisão', muted: r.avgMastery === null, onOpen:open('content') }
    ];
  }
  if(focus === 'content'){
    if(topicObj){
      const s = sessionsOfTopic(topicObj.id);
      return [
        { key:'tstatus', when:'now', label:'Situação', value:TOPIC_STATUS_LABEL[topicStatus(topicObj)], onOpen:open('content') },
        masteryMetric(),
        { key:'tsess', when:'all', label:'Estudos registrados', value:String(s.length), sub:fmtDuration(sum(s, x => x.minutes || 0)) },
        { key:'tnext', when:'now', label:'Próxima revisão', value: topicObj.reviewEnabled && topicObj.reviewDueDate ? fmtRelativeFuture(topicObj.reviewDueDate) : '—', sub: topicObj.reviewEnabled && topicObj.reviewDueDate ? fmtDateBR(topicObj.reviewDueDate) : null }
      ];
    }
    const cnt = k => (c.byStatus.find(x => x.key === k) || {}).count || 0;
    return [M.coverage(),
      { key:'cmast', when:'now', label:METRIC_WORDS.mastery.title, value:String(c.mastered), sub:safePct(c.masteryPct), onOpen:open('content') },
      { key:'crev', when:'now', label:'Em revisão', value:String(cnt('em_revisao')), onOpen:open('content') },
      { key:'cns', when:'now', label:'Não iniciados', value:String(cnt('nao_iniciado')), onOpen:open('content') }];
  }
  if(focus === 'deadlines'){
    const soon = dl.upcoming.filter(x => x.days <= 14).length;
    return [
      { key:'dopen', when:'now', label:'Em aberto', value:String(dl.open.length), onOpen:open('deadlines') },
      { key:'dsoon', when:'now', label:'Próximos 14 dias', value:String(soon), onOpen:open('deadlines') },
      { key:'dlate', when:'now', label:'Data passou', value:String(dl.overdue.length), sub: dl.overdue.length ? 'ainda em aberto' : null, onOpen:open('deadlines') },
      { key:'ddone', when:'period', label:'Concluídos', value:String(dl.completedInRange.length), onOpen:open('deadlines') }
    ];
  }
  // visão geral
  if(sc.type === 'topic') return [M.time(), M.sessions(), M.reviews(), masteryMetric()];
  const out = [M.time(), M.days(), M.sessions()];
  if(pa.hasPlan) out.push(M.plan());
  else if(r.completed || r.overdueNow) out.push(M.reviews());
  else if(c.totalTopics) out.push(M.coverage());
  return out;
}

/* ---------- 3. uma visualização principal ---------- */
function analyticsMainViz(a, focus){
  if(focus === 'overview' || focus === 'time'){
    if(a.days > 1) return { title:'Tempo ao longo do período', node: timeChart(a) };
    const bd = breakdownRows(a);
    if(!bd.rows.length) return null;
    const mx = Math.max(1, ...bd.rows.map(x => x.minutes));
    return { title: `Tempo ${bd.title.toLowerCase()}`, node: h('div', null, bd.rows.slice(0, 10).map(x =>
      hbarRow(x.label, x.minutes / mx * 100, `${fmtDuration(x.minutes)} · ${safePct(x.pct)}`, null, x.go))) };
  }
  if(focus === 'planning') return { title:'Planejado × realizado', node: planVsActualViz(a) };
  if(focus === 'reviews') return a.reviews.completed
    ? { title:'Como foram as revisões', node: reviewOutcomesViz(a) }
    : { title:'Para revisar agora', node: dueReviewsViz(a) };
  if(focus === 'content') return { title: a.scope.type === 'topic' ? 'Situação do tópico' : 'Situação dos tópicos', node: contentStatusViz(a) };
  if(focus === 'deadlines') return { title:'Linha do tempo', node: deadlineTimelineViz(a) };
  return null;
}

/** Planejado (contorno) × realizado (preenchido), na mesma escala. */
function planVsActualViz(a){
  const pa = a.planAdherence;
  const perDisc = pa.perDiscipline.filter(x => x.planned > 0 || x.realized > 0);
  const useWeeks = a.scope.type === 'discipline' || perDisc.length <= 1;
  const rows = useWeeks
    ? pa.weeks.filter(w => w.planned > 0 || w.realized > 0).map(w => ({
        label:`Semana ${w.weekNumber}${w.coveredDays < 7 ? ` (${plural(w.coveredDays, 'dia', 'dias')})` : ''}`, planned:w.planned, realized:w.realized, go:null }))
    : perDisc.map(x => ({ label:x.label, planned:x.planned, realized:x.realized,
        go: getDiscipline(x.disciplineId) ? () => openDistributionDrawer(
          a.byDiscipline.find(r => r.key === x.disciplineId) || { key:x.disciplineId, label:x.label, minutes:x.realized, count:0, pct:0 }, 'discipline', a) : null }));
  const mx = Math.max(1, ...rows.map(r => Math.max(r.planned, r.realized)));
  const box = h('div', { class:'pva' });
  rows.forEach(r => {
    const pct = r.planned > 0 ? (r.realized / r.planned) * 100 : null;
    const value = r.planned > 0 ? `${fmtDuration(r.realized)} de ${fmtDuration(r.planned)}` : `${fmtDuration(r.realized)} · sem plano`;
    const track = h('span', { class:'pva-track', 'aria-hidden':'true' },
      h('span', { class:'pva-plan', style:`width:${(r.planned / mx) * 100}%` }),
      h('span', { class:'pva-real' + (pct !== null && pct >= 100 ? ' is-done' : ''), style:`width:${(r.realized / mx) * 100}%` }));
    const inner = [h('span', { class:'pva-l', text:r.label }), track,
      h('span', { class:'pva-v' }, h('span', { text:value }), pct !== null ? h('span', { class:'pva-pct', text:safePct(pct) }) : null)];
    box.append(r.go
      ? h('button', { class:'pva-row is-action', type:'button', 'aria-label':`${r.label}: ${value}. Ver detalhes`, onclick:r.go }, inner)
      : h('div', { class:'pva-row', role:'img', 'aria-label':`${r.label}: ${value}` }, inner));
  });
  box.append(h('p', { class:'viz-legend' },
    h('span', { class:'lg-plan', 'aria-hidden':'true' }), 'planejado',
    h('span', { class:'lg-real', 'aria-hidden':'true' }), 'realizado',
    useWeeks ? null : h('span', { class:'viz-hint', text:'Clique numa linha para ver os detalhes.' })));
  return box;
}

function reviewOutcomesViz(a){
  const r = a.reviews;
  const mx = Math.max(1, ...r.outcomes.map(o => o.count));
  const good = new Set(['remembered','mastered']);
  return h('div', null,
    r.outcomes.map(o => hbarRow(o.label, o.count / mx * 100, `${o.count} · ${safePct(r.completed ? o.count / r.completed * 100 : 0)}`,
      good.has(o.v) ? null : 'var(--text-tertiary)')),
    h('p', { class:'viz-legend' }, h('span', { class:'viz-hint', text:'O resultado de cada revisão ajusta quando o tópico volta.' })));
}

function dueReviewsViz(a){
  const list = a.reviews.dueList.slice().sort((x,y) => str(x.reviewDueDate).localeCompare(str(y.reviewDueDate)));
  if(!list.length) return h('p', { class:'hint', text: a.reviews.upcoming.length
    ? `Nada para agora. ${plural(a.reviews.upcoming.length, 'revisão prevista', 'revisões previstas')} para os próximos 7 dias.`
    : 'Nada para revisar agora.' });
  return h('ul', { class:'line-list' }, list.slice(0, 8).map(tp => {
    const late = -(daysUntilISO(tp.reviewDueDate) || 0);
    return h('li', { class:'line' },
      h('button', { class:'line-main', type:'button', onclick:() => openTopicFromAnalytics(tp) },
        h('span', { class:'line-t', text:tp.name }),
        h('span', { class:'line-s' }, disciplineName(tp.disciplineId), ' · ',
          h('span', { class: late > 0 ? 'is-late' : null, text: late > 0 ? `atrasada há ${plural(late, 'dia', 'dias')}` : 'para hoje' }))),
      h('button', { class:'btn ghost sm', type:'button', text:'Revisar', onclick:() => startReview(tp.id) }));
  }));
}

/** Uma barra empilhada com a situação dos tópicos + detalhe por disciplina. */
function contentStatusViz(a){
  const c = a.content;
  if(a.scope.type === 'topic'){
    const tp = getTopic(a.scope.topicId);
    if(!tp) return h('p', { class:'hint', text:'Tópico não encontrado.' });
    const dl = h('dl', { class:'kv-list' });
    const kv = (k, v) => dl.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
    kv('Situação', TOPIC_STATUS_LABEL[topicStatus(tp)]);
    kv('Consolidação estimada', tp.masteryLevel ? `${tp.masteryLevel} de 5` : 'ainda sem revisões');
    kv('Próxima revisão', tp.reviewEnabled ? (tp.reviewDueDate ? `${fmtRelativeFuture(tp.reviewDueDate)} (${fmtDateBR(tp.reviewDueDate)})` : 'depois do primeiro estudo') : 'revisões desligadas');
    kv('Vezes esquecido', String(tp.reviewFailures || 0));
    kv('Prioridade', PriorityEngine.text(tp.priority));
    return dl;
  }
  const order = ['nao_iniciado','em_estudo','em_revisao','dominado'];
  const total = Math.max(1, c.totalTopics);
  const bar = h('div', { class:'stack-bar', role:'img',
    'aria-label': order.map(k => `${TOPIC_STATUS_LABEL[k]}: ${(c.byStatus.find(x => x.key === k) || {}).count || 0}`).join(', ') },
    order.map((k, i) => { const n = (c.byStatus.find(x => x.key === k) || {}).count || 0;
      return n ? h('span', { class:'sb-seg', style:`width:${n / total * 100}%;background:var(--heat-${i === 0 ? 0 : i + 1})` }) : null; }));
  const legend = h('ul', { class:'sb-legend' }, order.map((k, i) => {
    const n = (c.byStatus.find(x => x.key === k) || {}).count || 0;
    return h('li', null, h('span', { class:'sw', style:`background:var(--heat-${i === 0 ? 0 : i + 1})`, 'aria-hidden':'true' }),
      h('span', { text:TOPIC_STATUS_LABEL[k] }), h('span', { class:'num', text:String(n) }));
  }));
  const box = h('div', null, bar, legend);
  if(a.scope.type !== 'discipline' && c.perDiscipline.length > 1){
    box.append(h('p', { class:'section-label', style:'margin-top:18px', text:'Conteúdo estudado por disciplina' }));
    c.perDiscipline.slice().sort((x,y) => (y.coverage || 0) - (x.coverage || 0)).slice(0, 10).forEach(x =>
      box.append(hbarRow(x.discipline.name, x.coverage, `${x.covered}/${x.total}`, null, () => analyzeOnly('discipline', x.discipline.id))));
  }
  return box;
}

function deadlineTimelineViz(a){
  const d = a.deadlines;
  const list = d.overdue.concat(d.upcoming);
  if(!list.length){
    if(!d.completedInRange.length) return h('p', { class:'hint', text:'Nenhum prazo em aberto.' });
    return h('ul', { class:'dl-line-list' }, d.completedInRange.map(dl => deadlineLine(dl, null, true)));
  }
  return h('ul', { class:'dl-line-list' }, list.slice(0, 10).map(x => deadlineLine(x.dl, x, false)));
}
/** Linha de prazo: data à esquerda, título, contexto e proximidade. */
function deadlineLine(dl, extra, done, opts){
  const o = opts || {};
  const d = parseISO(dl.date);
  const disc = dl.disciplineId ? getDiscipline(dl.disciplineId) : null;
  const topic = dl.topicId ? getTopic(dl.topicId) : null;
  const overdue = !done && DeadlineEngine.isOverdue(dl);
  const ctx = [deadlineTypeInfo(dl.type).label, disc ? disc.name + (topic ? ' › ' + topic.name : '') : null].filter(Boolean).join(' · ');
  return h('li', { class:'dl-item' }, h('button', { class:'dl-line' + (overdue ? ' is-overdue' : '') + (done ? ' is-done' : ''), type:'button',
      onclick:() => { if(o.before) o.before(); openDeadlineDrawer(dl.id); }, 'aria-label': `${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}` },
    h('span', { class:'dl-date', 'aria-hidden':'true' },
      h('span', { class:'dl-date-d', text: d ? String(d.getDate()) : '—' }),
      h('span', { class:'dl-date-m', text: d ? MONTHS_ABBR[d.getMonth()] : '' })),
    h('span', { class:'dl-line-main' },
      h('span', { class:'dl-line-t' }, o.query ? highlightMatch(dl.title, o.query) : dl.title),
      h('span', { class:'dl-line-s', text: ctx + (extra && extra.relation === 'discipline' ? ' · prazo da disciplina' : '') })),
    h('span', { class:'dl-line-when' + (overdue ? ' is-late' : ''), text: done ? 'concluído' : DeadlineEngine.dueText(dl) })),
    o.action || null);
}

/* ---------- 4. insights: poucos, separados em atenção / positivo ---------- */
const FOCUS_INSIGHT_TAGS = {
  overview:  null,
  time:      ['time','rest','distribution','types','difficulty','projection'],
  planning:  ['plan','priority','projection'],
  reviews:   ['reviews'],
  content:   ['content','priority'],
  deadlines: ['deadlines']
};
function analyticsFocusInsights(a, focus){
  const tags = FOCUS_INSIGHT_TAGS[focus];
  const ok = it => !tags || tags.includes(it.tag);
  const seen = new Set();
  const out = [];
  // A mesma constatação pode vir como alerta e como observação ("Redes com 17%
  // do planejado" / "Redes recebeu 17% do planejado…"): assunto, primeira palavra,
  // primeiro número e o tipo de fato identificam a constatação; só a primeira fica.
  const factKey = it => {
    const n = normalizeText(it.text);
    const word = (n.split(' ').find(w => /^[a-z]/.test(w)) || '');
    const kind = /conclu/.test(n) ? 'done' : /esquec/.test(n) ? 'forgot' : /atras|venc|passou/.test(n) ? 'late' : '';
    return [it.tag, word, (n.match(/\d+/) || [''])[0], kind].join('|');
  };
  const add = (list, kind) => list.filter(ok).forEach(it => {
    const k = normalizeText(it.text), f = factKey(it);
    if(seen.has(k) || seen.has(f)) return;
    seen.add(k); seen.add(f); out.push({ text:it.text, kind });
  });
  add(a.warningItems, 'attention');
  add(a.positiveItems, 'positive');
  add(a.insightItems, 'neutral');
  // ordem inicial: até 2 de atenção, 1 positivo, depois o resto
  const att = out.filter(x => x.kind === 'attention'), pos = out.filter(x => x.kind === 'positive'), neu = out.filter(x => x.kind === 'neutral');
  const first = att.slice(0, 2).concat(pos.slice(0, 1));
  const rest = att.slice(2).concat(pos.slice(1));
  return first.concat(neu, rest);
}
function analyticsInsightsBlock(a, focus){
  const items = analyticsFocusInsights(a, focus);
  if(!items.length) return null;
  const LIMIT = 3;
  const list = h('ol', { class:'insight-list' });
  const draw = () => {
    clear(list);
    const shown = ui.analyticsShowAllInsights ? items : items.slice(0, LIMIT);
    shown.forEach(it => list.append(h('li', { class:'insight-item k-' + it.kind },
      it.kind !== 'neutral' ? h('span', { class:'insight-k', text: it.kind === 'attention' ? 'Atenção' : 'Positivo' }) : null,
      h('span', { class:'insight-t', text:it.text }))));
  };
  draw();
  const more = items.length > LIMIT ? h('button', { class:'linkbtn', type:'button', 'aria-expanded': ui.analyticsShowAllInsights ? 'true' : 'false',
    text: ui.analyticsShowAllInsights ? 'Mostrar menos' : `Ver todos os insights (${items.length})`,
    onclick:(e) => {
      ui.analyticsShowAllInsights = !ui.analyticsShowAllInsights;
      draw();
      e.currentTarget.textContent = ui.analyticsShowAllInsights ? 'Mostrar menos' : `Ver todos os insights (${items.length})`;
      e.currentTarget.setAttribute('aria-expanded', ui.analyticsShowAllInsights ? 'true' : 'false');
    } }) : null;
  return h('section', { class:'an-block an-insights', 'aria-labelledby':'an-ins-t' },
    h('h3', { class:'an-block-t', id:'an-ins-t' }, 'Principais insights', helpDot('insights')),
    list, more,
    h('p', { class:'an-foot-note', text:'Fatos calculados dos seus registros. Mostram o que aconteceu, sem adivinhar o porquê.' }));
}

/* ---------- 5. explorar mais: um nível de aprofundamento, sob demanda ---------- */
/** Tira o "card" de um componente antigo para usá-lo dentro de "Explorar mais". */
function exploreContent(cardEl){
  if(!cardEl) return null;
  const box = h('div', { class:'an-explore-content' });
  const title = cardEl.querySelector(':scope > .card-title');
  if(title) title.remove();
  const head = cardEl.querySelector(':scope > .card-head');
  if(head){ const t = head.querySelector(':scope > .card-title'); if(t) t.remove(); if(!head.children.length) head.remove(); }
  while(cardEl.firstChild) box.appendChild(cardEl.firstChild);
  return box;
}
function analyticsExploreItems(a, focus){
  const sc = a.scope, t = a.totals;
  const hasTopics = AnalyticsScope.topics(sc).length > 0;
  const lib = {
    distribution: { label:'Distribuição do tempo', meta:'por ' + (sc.type === 'all' ? 'área, disciplina ou tópico' : sc.type === 'area' ? 'disciplina ou tópico' : sc.type === 'discipline' ? 'tópico' : 'tipo de estudo'),
                    show: t.count > 0, build:() => exploreContent(analyticsDistributionCard(a)) },
    time:         { label:'Tempo ao longo do período', show: t.count > 0 && a.days > 1, build:() => h('div', { class:'an-explore-content' }, timeChart(a)) },
    weekday:      { label:'Por dia da semana', show: t.count > 0, build:() => { const mx = Math.max(1, ...a.byWeekday.map(x => x.minutes));
                    return h('div', { class:'an-explore-content' }, a.byWeekday.map(x => hbarRow(x.label, x.minutes / mx * 100, fmtDuration(x.minutes)))); } },
    calendar:     { label:'Calendário', meta:'ver um dia ou escolher um intervalo', show:true, build:() => exploreContent(analyticsCalendarCard(a)) },
    rhythm:       { label:'Dias com estudo, semana a semana', show: t.count > 0 && a.weeklyRhythm.length > 1, build:() => h('div', { class:'an-explore-content' }, weeklyRhythmViz(a)) },
    rest:         { label:'Descansos', meta:'quanto e quantos', show: a.rest.count > 0, build:() => h('div', { class:'an-explore-content' }, restDetail(a)) },
    plan:         { label:'Planejado × realizado', show: a.planAdherence.hasPlan && a.planAdherence.perDiscipline.length > 0, build:() => h('div', { class:'an-explore-content' }, planVsActualViz(a)) },
    weeks:        { label:'Semana a semana', show: sc.type !== 'topic', build:() => exploreContent(weeklyReportCard(sc)) },
    reviews:      { label:'Revisões', show: a.reviews.scheduled > 0 || a.reviews.completed > 0 || a.reviews.overdueNow > 0, build:() => exploreContent(analyticsReviewsCard(a)) },
    due:          { label:'Para revisar agora', show: a.reviews.dueList.length > 0, build:() => h('div', { class:'an-explore-content' }, dueReviewsViz(a)) },
    content:      { label:'Conteúdo', show: a.content.totalTopics > 0 && sc.type !== 'topic', build:() => exploreContent(analyticsContentCard(a)) },
    attention:    { label:'Tópicos que merecem atenção', show: hasTopics && a.attention.length > 0, build:() => exploreContent(analyticsAttentionCard(a)) },
    deadlines:    { label:'Prazos', show: a.deadlines.all.length > 0, build:() => exploreContent(analyticsDeadlinesCard(a)) },
    priority:     { label:'Tempo por prioridade', show: !!analyticsPriorityCard(a), build:() => exploreContent(analyticsPriorityCard(a)) },
    difficulty:   { label:'Dificuldade percebida', show: a.difficulty.count > 0, build:() => exploreContent(analyticsDifficultyCard(a)) },
    types:        { label:'Tipos de estudo', show: t.count > 0, build:() => exploreContent(analyticsTypesCard(a)) },
    projection:   { label:'Ritmo das últimas semanas', show:true, build:() => exploreContent(analyticsProjectionCard(a)) }
  };
  const mainIsTime = (focus === 'overview' || focus === 'time') && a.days > 1;
  const order = {
    overview:  ['distribution','calendar','rhythm','rest','plan','reviews','content','attention','deadlines','priority','weeks','projection','difficulty','types'].concat(mainIsTime ? [] : ['time']),
    time:      ['rhythm','weekday','calendar','rest','distribution','types','difficulty','weeks','projection'].concat(mainIsTime ? [] : ['time']),
    planning:  ['weeks','distribution','calendar','projection','priority'],
    reviews:   (a.reviews.completed ? ['due'] : []).concat(['attention','reviews','calendar','content']),
    content:   ['attention','priority','distribution','reviews'],
    deadlines: ['calendar','attention','distribution']
  }[focus] || [];
  return order.filter(id => lib[id] && lib[id].show).map(id => ({ id, ...lib[id] }));
}
function analyticsExploreBlock(a, focus){
  const items = analyticsExploreItems(a, focus);
  if(!items.length) return null;
  const open = ui.analyticsExplore || (ui.analyticsExplore = new Set());
  const list = h('div', { class:'an-explore-list' });
  items.forEach(it => {
    const bodyId = 'anx-' + it.id;
    const body = h('div', { class:'an-explore-body', id:bodyId, role:'region', 'aria-labelledby':bodyId + '-b', hidden: !open.has(it.id) });
    if(open.has(it.id)) mount(body, it.build());
    const btn = h('button', { class:'an-explore-toggle', type:'button', id:bodyId + '-b', 'aria-expanded': open.has(it.id) ? 'true' : 'false', 'aria-controls':bodyId,
      onclick:() => {
        const isOpen = open.has(it.id);
        if(isOpen){ open.delete(it.id); Motion.collapse(body, () => { if(!open.has(it.id)) clear(body); }); }
        else { open.add(it.id); mount(body, it.build()); Motion.expand(body); }
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      } },
      h('span', { class:'an-explore-l', text:it.label }),
      it.meta ? h('span', { class:'an-explore-m', text:it.meta }) : null,
      icon('i-chev', 'an-explore-chev'));
    list.append(h('div', { class:'an-explore-item' }, btn, body));
  });
  return h('section', { class:'an-block an-explore', 'aria-labelledby':'an-ex-t' },
    h('h3', { class:'an-block-t', id:'an-ex-t', text:'Explorar mais' }), list);
}

/* ---------- v6.4: constância por semana e descansos ---------- */
/** Em quantos dias de cada semana houve estudo. Semana cortada pelo período conta só os dias incluídos. */
function weeklyRhythmViz(a){
  const day = d => `${d.getDate()} ${MONTHS_ABBR[d.getMonth()]}`;
  return h('div', null,
    a.weeklyRhythm.map(w => hbarRow(
      dateToISO(w.start) === dateToISO(w.end) ? day(w.start) : `${day(w.start)} – ${day(w.end)}`,
      w.days > 0 ? (w.activeDays / w.days) * 100 : 0,
      `${w.activeDays} de ${plural(w.days, 'dia', 'dias')}`)),
    h('p', { class:'viz-legend' }, h('span', { class:'viz-hint', text:'Dia com estudo é um dia com pelo menos um estudo registrado. Dia sem estudo não é falha: é só um dia sem registro.' })));
}

/** Descansos do período: números, a relação com o estudo e os estudos em que aconteceram. */
function restDetail(a){
  const rs = a.rest, t = a.totals;
  const box = h('div', { class:'rest-detail' });
  if(!rs.count){
    box.append(h('p', { class:'influence-note', text:'Nenhum descanso registrado neste período. No cronômetro, use "Descansar"; num estudo que já aconteceu, "+ Adicionar descanso".' }));
    return box;
  }
  box.append(h('div', { class:'stat-grid compact' },
    statBox(fmtDuration(rs.minutes), 'tempo de descanso'),
    statBox(String(rs.count), rs.count === 1 ? 'descanso' : 'descansos'),
    statBox(fmtDurationWords(rs.avg), 'média por descanso'),
    statBox(`${rs.sessionsWithBreaks} de ${t.count}`, 'estudos com descanso')));
  const lines = [];
  if(isNum(rs.studyPerRestHour) && rs.minutes >= 10) lines.push(`Foram ${fmtDuration(rs.studyPerRestHour)} de estudo para cada 1h de descanso.`);
  if(rs.longest && rs.longest.withBreaks > 0) lines.push(`Você fez descansos em ${rs.longest.withBreaks} dos ${rs.longest.of} estudos mais longos do período.`);
  lines.forEach(x => box.append(h('p', { class:'hint', style:'margin-top:10px', text:x })));
  const list = a.sessions.filter(s => breakMinutesOf(s) > 0)
    .sort((x, y) => y.date.localeCompare(x.date) || str(y.createdAt).localeCompare(str(x.createdAt))).slice(0, 12);
  const ul = h('ul', { class:'an-sess-list' });
  list.forEach(s => {
    const topic = topicLabelOf(s);
    ul.append(h('li', null, h('button', { class:'an-sess', type:'button', 'aria-label':`Abrir o estudo de ${fmtDateBR(s.date)}`,
        onclick:() => { if(Drawer.isOpen) Drawer.close(); openEditSessionModal(s.id); } },
      h('span', { class:'an-sess-date', text: fmtDateBR(s.date) }),
      h('span', { class:'an-sess-main' },
        h('span', { class:'an-sess-title', text: disciplineName(s.disciplineId) + (topic ? ' › ' + topic : '') }),
        h('span', { class:'an-sess-sub', text: `${fmtDuration(s.minutes)} de estudo` })),
      h('span', { class:'an-sess-min', text: fmtDurationWords(breakMinutesOf(s)) }))));
  });
  box.append(drawerSection('Estudos com descanso', ul));
  box.append(h('p', { class:'hint', style:'margin-top:10px', text:'Descanso nunca entra no tempo estudado, no plano da semana nem na ordem "Mais estudadas".' }));
  return box;
}

/* ---------- menu simples (ações secundárias) ---------- */
function menuButton(label, items, opts){
  const o = opts || {};
  const wrap = h('div', { class:'menu-wrap' });
  const menu = h('div', { class:'menu', role:'menu', hidden:true });
  const btn = h('button', { class: o.className || 'btn ghost sm', type:'button', 'aria-haspopup':'menu', 'aria-expanded':'false',
    'aria-label': o.ariaLabel || label, 'data-fk': o.fk || null }, o.icon ? icon(o.icon) : null, label, icon('i-chev', 'btn-icon menu-chev'));
  const pop = menuPopover(wrap, btn, menu, {
    onOpen(){ const first = menu.querySelector('[role="menuitem"]'); if(first){ try { first.focus({ preventScroll:true }); } catch(_){ first.focus(); } } }
  });
  const close = (refocus) => pop.close(refocus);
  const openMenu = () => pop.open();
  btn.addEventListener('click', () => { if(!pop.isOpen) openMenu(); else close(true); });
  btn.addEventListener('keydown', (e) => { if(e.key === 'ArrowDown' && !pop.isOpen){ e.preventDefault(); openMenu(); } });
  items.forEach(it => menu.append(h('button', { class:'menu-item', type:'button', role:'menuitem', tabindex:'-1', text:it.label,
    onclick:() => { close(true); it.run(); } })));
  menu.addEventListener('keydown', (e) => {
    const list = $$('[role="menuitem"]', menu);
    const i = list.indexOf(document.activeElement);
    if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); }
    else if(e.key === 'ArrowDown'){ e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if(e.key === 'Tab'){ close(false); }
  });
  wrap.append(btn, menu);
  return wrap;
}

function openTopicFromAnalytics(t){ openTopicDrawer(t.id); }

function analyticsAttentionCard(a){
  const c = h('div', { class:'card an-attention' },
    h('p', { class:'card-title' }, 'Tópicos que merecem atenção', helpDot('atencao')));
  if(!a.attention.length){
    c.append(h('p', { class:'hint', text:'Nenhum tópico pede atenção especial agora: sem revisões atrasadas, esquecimentos repetidos ou prazos próximos.' }));
    return c;
  }
  c.append(h('p', { class:'hint', style:'margin-bottom:8px', text:'Revisões atrasadas, esquecimentos, pouca consolidação e prazos próximos. A prioridade ajuda a ordenar.' }));
  const list = h('ul', { class:'line-list' });
  a.attention.forEach(x => {
    list.append(h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => openTopicFromAnalytics(x.topic) },
      h('span', { class:'line-t', text:x.topic.name }),
      h('span', { class:'line-s', text: (x.discipline ? x.discipline.name + ' · ' : '') + capFirst(x.reasons.join(' · ')) }))));
  });
  c.append(list);
  if(a.reviews.dueToday) c.append(h('div', { class:'row auto', style:'margin-top:10px' },
    h('button', { class:'btn ghost sm', type:'button', text:'Abrir revisões', onclick:() => setView('reviews') })));
  return c;
}

function analyticsDeadlinesCard(a){
  const d = a.deadlines;
  const c = h('div', { class:'card an-deadlines' },
    h('div', { class:'card-head' },
      h('p', { class:'card-title', style:'margin:0' }, 'Prazos', helpDot('prazo')),
      h('button', { class:'linkbtn', type:'button', text:'+ Adicionar prazo',
        onclick:() => openDeadlineModal(null, { disciplineId: a.scope.disciplineId || null, topicId: a.scope.topicId || null }) })));
  const shown = d.overdue.concat(d.upcoming).slice(0, 6);
  if(!shown.length){
    c.append(h('p', { class:'hint', text: d.completedInRange.length
      ? `Nenhum prazo em aberto. ${plural(d.completedInRange.length, 'prazo foi concluído', 'prazos foram concluídos')} neste período.`
      : 'Nenhum prazo em aberto aqui.' }));
    return c;
  }
  c.append(h('ul', { class:'dl-line-list' }, shown.map(x => deadlineLine(x.dl, x, false))));
  if(d.completedInRange.length) c.append(h('p', { class:'hint', style:'margin-top:8px',
    text:`${plural(d.completedInRange.length, 'prazo concluído', 'prazos concluídos')} neste período.` }));
  return c;
}

/* ---------- detalhes (drawers) ---------- */
function drawerIntro(text){ return h('p', { class:'drawer-intro', text }); }
function drawerSection(title, ...children){
  return h('section', { class:'dr-section' }, h('h3', { class:'section-label', text:title }), children);
}
function hbarRow(label, pct, valueText, color, onClick){
  const bar = h('div', { class:'hbar' }, h('span', { style:`width:${clamp(isNum(pct) ? pct : 0, 0, 100)}%${color ? ';background:' + color : ''}` }));
  if(onClick){
    return h('button', { class:'hbar-row is-action', type:'button', onclick:onClick, 'aria-label': `${label}: ${valueText}` },
      h('span', { class:'hl', text:label }), bar, h('span', { class:'hv', text:valueText }));
  }
  return h('div', { class:'hbar-row' }, h('span', { class:'hl', text:label }), bar, h('span', { class:'hv', text:valueText }));
}
function scopeWords(a){ return a.scope.type === 'all' ? 'em todos os estudos' : `em ${a.scope.label}`; }

/** Linhas de tempo "um nível abaixo" do escopo, com atalho para analisar só aquele item. */
function breakdownRows(a){
  const sc = a.scope;
  if(sc.type === 'all'){
    return { title:'Por disciplina', rows: a.byDiscipline.map(x => ({ ...x, go: getDiscipline(x.key) ? () => analyzeOnly('discipline', x.key) : null })) };
  }
  if(sc.type === 'area'){
    return { title:'Por disciplina', rows: a.byDiscipline.map(x => ({ ...x, go: getDiscipline(x.key) ? () => analyzeOnly('discipline', x.key) : null })) };
  }
  if(sc.type === 'discipline'){
    return { title:'Por tópico', rows: a.byTopic.map(x => ({ ...x, go: getTopic(x.key) ? () => analyzeOnly('topic', x.key) : null })) };
  }
  return { title:'Por tipo de estudo', rows: a.byType.filter(x => x.count > 0).map(x => ({ key:x.key, label:x.label, minutes:x.minutes, count:x.count,
    pct: a.totals.minutes > 0 ? x.minutes / a.totals.minutes * 100 : 0 })) };
}

function openAnalyticsDrawer(kind, a){
  const body = h('div', { class:'an-drawer' });
  const ctx = h('p', { class:'an-drawer-ctx', text: `${AnalyticsScope.pathText(a.scope)} · ${fmtRangeLabel(a.range)}` });
  body.append(ctx);
  let title = '';
  const t = a.totals;

  if(kind === 'time'){
    title = 'Tempo estudado';
    body.append(drawerIntro(`Soma dos minutos de todos os estudos registrados ${scopeWords(a)} no período.`));
    body.append(h('div', { class:'stat-grid compact' },
      statBox(fmtDuration(t.minutes), 'total'),
      statBox(fmtDuration(t.avgPerDay), 'média por dia do período'),
      statBox(fmtDuration(t.avgPerActiveDay), 'média por dia com estudo'),
      statBox(fmtDuration(t.avgSession), 'em média, por estudo')));
    if(a.rest.count > 0) body.append(h('p', { class:'hint', style:'margin-top:10px',
      text:`Descansos ficam fora desta soma: ${fmtDuration(a.rest.minutes)} em ${plural(a.rest.count, 'descanso', 'descansos')}.` }));
    const cmp = a.previousComparison;
    body.append(h('p', { class:'hint', style:'margin-top:10px', text: cmp.available
      ? `Período anterior equivalente (${fmtRangeLabel(cmp.prevRange)}): ${fmtDuration(cmp.prev.minutes)}.`
      : 'Não há registros no período anterior equivalente para comparar.' }));
    const bd = breakdownRows(a);
    if(bd.rows.length){
      const max = Math.max(1, ...bd.rows.map(x => x.minutes));
      body.append(drawerSection(bd.title, bd.rows.slice(0, 12).map(x =>
        hbarRow(x.label, x.minutes / max * 100, `${fmtDuration(x.minutes)} · ${safePct(x.pct)}`, null, x.go))));
      if(bd.rows.some(x => x.go)) body.append(h('p', { class:'hint', text:'Clique em uma linha para analisar só aquele item.' }));
    }
    if(t.count){
      const maxW = Math.max(1, ...a.byWeekday.map(x => x.minutes));
      body.append(drawerSection('Por dia da semana', a.byWeekday.map(x =>
        hbarRow(x.label, x.minutes / maxW * 100, fmtDuration(x.minutes)))));
    }
    const mid = midnightNote(a);
    if(mid) body.append(mid);
  }

  else if(kind === 'sessions'){
    title = 'Estudos registrados';
    body.append(drawerIntro(`Cada vez que você estudou e registrou ${scopeWords(a)} no período.`));
    body.append(h('div', { class:'stat-grid compact' },
      statBox(String(t.count), t.count === 1 ? 'vez' : 'vezes'),
      statBox(`${t.activeDays}/${a.days}`, 'dias com estudo'),
      statBox(fmtDuration(t.avgSession), 'duração média'),
      statBox(a.difficulty.avg !== null ? fmtNumber(a.difficulty.avg, 1) + '/5' : '—', 'dificuldade média')));
    const list = a.sessions.slice().sort((x,y) => y.date.localeCompare(x.date) || str(y.createdAt).localeCompare(str(x.createdAt)));
    if(!list.length) body.append(h('p', { class:'hint', style:'margin-top:12px', text:'Nenhum estudo neste período.' }));
    else {
      const ul = h('ul', { class:'an-sess-list' });
      list.slice(0, 40).forEach(s => {
        const topic = topicLabelOf(s);
        ul.append(h('li', null, h('button', { class:'an-sess', type:'button', 'aria-label':`Editar o estudo de ${fmtDateBR(s.date)}`,
            onclick:() => { Drawer.close(); openEditSessionModal(s.id); } },
          h('span', { class:'an-sess-date', text: fmtDateBR(s.date) }),
          h('span', { class:'an-sess-main' },
            h('span', { class:'an-sess-title', text: disciplineName(s.disciplineId) + (topic ? ' › ' + topic : '') }),
            h('span', { class:'an-sess-sub', text: [sessionTypeLabel(s.type), s.reviewOutcome ? reviewOutcomeLabel(s.reviewOutcome) : null].filter(Boolean).join(' · ') })),
          h('span', { class:'an-sess-min', text: fmtDuration(s.minutes) }))));
      });
      body.append(drawerSection(list.length > 40 ? `As 40 mais recentes de ${list.length}` : 'Lista', ul));
      if(list.length > 40) body.append(h('button', { class:'linkbtn', type:'button', text:'Ver todas no Histórico',
        onclick:() => { Drawer.close(); ui.history.period = 'analises'; setView('history'); } }));
      const maxT = Math.max(1, ...a.byType.map(x => x.count));
      body.append(drawerSection('Tipos de estudo', a.byType.filter(x => x.count > 0).map(x =>
        hbarRow(x.label, x.count / maxT * 100, `${x.count} · ${safePct(x.pct)}`))));
      const mid = midnightNote(a);
      if(mid) body.append(mid);
    }
  }

  else if(kind === 'rest'){
    title = 'Descansos';
    body.append(drawerIntro(`Descansos feitos durante os estudos ${scopeWords(a)} no período. Eles ficam guardados à parte.`));
    body.append(restDetail(a));
  }

  else if(kind === 'plan'){
    title = METRIC_WORDS.adherence.title;
    const pa = a.planAdherence;
    body.append(drawerIntro('Quanto do que foi planejado para cada disciplina foi realmente estudado. Tempo a mais numa disciplina não compensa o que faltou em outra. Cada semana é comparada com o plano que existia naquela semana.'));
    if(!pa.applicable){
      body.append(h('p', { class:'influence-note', text:'O plano semanal distribui tempo entre disciplinas, não entre tópicos. Para ver o plano cumprido, analise a disciplina deste tópico.' }));
      if(a.scope.disciplineId) body.append(h('button', { class:'btn sm', type:'button', text:'Analisar a disciplina', onclick:() => analyzeOnly('discipline', a.scope.disciplineId) }));
    } else if(!pa.hasPlan){
      body.append(h('p', { class:'influence-note', text:'Não havia tempo planejado para este período (ou para esta seleção). O plano é opcional: as análises de tempo continuam funcionando sem ele.' }));
      body.append(h('button', { class:'btn sm', type:'button', text:'Abrir Planejamento', onclick:() => { Drawer.close(); setView('plan'); } }));
    } else {
      body.append(h('div', { class:'stat-grid compact' },
        statBox(safePct(pa.pct), 'plano cumprido'),
        statBox(fmtDuration(pa.planned), 'planejado'),
        statBox(fmtDuration(pa.realized), 'estudado no total'),
        pa.extra >= 1 ? statBox(fmtDuration(pa.extra), 'além do plano') : null));
      body.append(drawerSection('Por disciplina', pa.perDiscipline.filter(x => x.planned > 0 || x.realized > 0).map(x =>
        hbarRow(x.label, x.pct === null ? 0 : x.pct,
          x.pct === null ? `${fmtDuration(x.realized)} (sem plano)` : `${fmtDuration(x.realized)} de ${fmtDuration(x.planned)} · ${safePct(x.pct)}`,
          x.pct === null ? null : x.pct >= 100 ? 'var(--teal)' : x.pct < 60 ? 'var(--danger)' : 'var(--brass)',
          a.scope.type !== 'discipline' && getDiscipline(x.disciplineId) ? () => analyzeOnly('discipline', x.disciplineId) : null))));
      const weeks = pa.weeks.filter(w => w.planned > 0 || w.realized > 0);
      if(weeks.length > 1) body.append(drawerSection('Por semana', weeks.map(w =>
        hbarRow(`Semana ${w.weekNumber}${w.coveredDays < 7 ? ` (${w.coveredDays} ${w.coveredDays === 1 ? 'dia' : 'dias'})` : ''}`,
          w.pct === null ? 0 : w.pct, w.pct === null ? `${fmtDuration(w.realized)} (sem plano)` : `${safePct(w.pct)}` + (w.extra >= 1 ? ` · +${fmtDuration(w.extra)} além` : '')))));
      body.append(h('p', { class:'hint', style:'margin-top:8px', text:'Em semanas cortadas pelo período, o tempo planejado é proporcional aos dias incluídos.' }));
    }
  }

  else if(kind === 'reviews'){
    title = 'Revisões';
    const r = a.reviews;
    body.append(drawerIntro('Concluídas conta o que você fez no período. Marcadas, atrasadas e próximas mostram a situação de agora — o Ciclo guarda a próxima data de cada revisão, não a agenda de semanas passadas. Revisar faz o conteúdo voltar à memória antes de ser esquecido.'));
    body.append(h('div', { class:'stat-grid compact' },
      statBox(String(r.completed), 'concluídas no período'),
      statBox(String(r.scheduled), 'marcadas para o período'),
      statBox(String(r.overdueNow), 'atrasadas agora'),
      statBox(String(r.upcoming.length), 'nos próximos 7 dias')));
    if(r.completed){
      const mx = Math.max(1, ...r.outcomes.map(o => o.count));
      body.append(drawerSection('Como foram', r.outcomes.map(o => hbarRow(o.label, o.count / mx * 100, String(o.count)))));
    }
    if(r.byMethod.length){
      const mm = Math.max(1, ...r.byMethod.map(x => x.used));
      body.append(drawerSection('Como você revisou', r.byMethod.map(x => hbarRow(x.label, x.used / mm * 100, `${x.used}×`))));
    }
    if(r.dueList.length){
      body.append(drawerSection('Para revisar agora', dueReviewsViz(a)));
    }
    if(r.forgetful.length){
      body.append(drawerSection('Esquecidos com mais frequência', r.forgetful.map(tp =>
        hbarRow(tp.name, clamp((tp.reviewFailures / 5) * 100, 10, 100), `${tp.reviewFailures}×`, 'var(--danger)', () => openTopicFromAnalytics(tp)))));
    }
    if(r.avgMastery !== null) body.append(h('p', { class:'hint', style:'margin-top:10px', text:`Consolidação estimada (média dos tópicos em revisão): ${fmtNumber(r.avgMastery, 1)} de 5 — calculada pelas suas respostas nas revisões.` }));
    body.append(h('div', { class:'row auto', style:'margin-top:14px' },
      h('button', { class:'btn sm', type:'button', text:'Abrir revisões', onclick:() => { Drawer.close(); setView('reviews'); } })));
  }

  else if(kind === 'content'){
    const c = a.content;
    if(a.scope.type === 'topic'){
      const tp = getTopic(a.scope.topicId);
      title = 'Situação do tópico';
      body.append(drawerIntro('Como este tópico está agora, independentemente do período escolhido.'));
      if(tp){
        const sess = sessionsOfTopic(tp.id);
        const dl = h('dl', { class:'kv-list' });
        const kv = (k, v) => dl.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
        kv('Situação', TOPIC_STATUS_LABEL[topicStatus(tp)]);
        kv('Prioridade', PriorityEngine.text(tp.priority));
        kv('Consolidação estimada', tp.masteryLevel ? `${tp.masteryLevel} de 5` : 'ainda sem revisões');
        kv('Revisões', tp.reviewEnabled ? (tp.reviewDueDate ? `próxima em ${fmtDateBR(tp.reviewDueDate)}` : 'ativadas, começam depois do primeiro estudo') : 'desativadas');
        kv('Estudos (total)', `${sess.length} · ${fmtDuration(sum(sess, s => s.minutes || 0))}`);
        kv('Vezes esquecido', String(tp.reviewFailures || 0));
        body.append(dl);
        body.append(h('div', { class:'row auto', style:'margin-top:14px' },
          h('button', { class:'btn sm', type:'button', text:'Abrir tópico', onclick:() => openTopicFromAnalytics(tp) })));
      }
    } else {
      title = METRIC_WORDS.coverage.title;
      body.append(drawerIntro('Conteúdo estudado: tópicos que você já começou. Consolidados: tópicos que passaram por revisões com bom resultado. Mostra a situação de agora, não só do período.'));
      if(!c.totalTopics){
        body.append(h('p', { class:'influence-note', text:'Ainda não há tópicos cadastrados aqui. Tópicos são as partes de uma disciplina, como "Derivadas" em Matemática.' }));
      } else {
        body.append(h('div', { class:'stat-grid compact' },
          statBox(`${c.covered}/${c.totalTopics}`, 'estudados'),
          statBox(safePct(c.coverage), 'do conteúdo'),
          statBox(String(c.mastered), 'consolidados')));
        const mx = Math.max(1, ...c.byStatus.map(x => x.count));
        body.append(drawerSection('Situação dos tópicos', c.byStatus.map(x => hbarRow(x.label, x.count / mx * 100, String(x.count)))));
        if(c.perDiscipline.length > 1 || a.scope.type !== 'discipline'){
          body.append(drawerSection('Por disciplina', c.perDiscipline.slice().sort((x,y) => (y.coverage || 0) - (x.coverage || 0)).map(x =>
            hbarRow(x.discipline.name, x.coverage, `${x.covered}/${x.total} · ${safePct(x.coverage)}`, null,
              a.scope.type !== 'discipline' ? () => analyzeOnly('discipline', x.discipline.id) : null))));
        }
        if(c.weakest.length) body.append(drawerSection('Menos consolidados', c.weakest.map(tp =>
          hbarRow(tp.name, tp.masteryLevel / 5 * 100, `${tp.masteryLevel}/5`, tp.masteryLevel <= 2 ? 'var(--danger)' : 'var(--brass)', () => openTopicFromAnalytics(tp)))));
        const ns = c.notStarted.slice(0, 8);
        if(ns.length) body.append(drawerSection('Ainda não iniciados', h('ul', { class:'line-list' }, ns.map(tp =>
          h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => openTopicFromAnalytics(tp) },
            h('span', { class:'line-t', text:tp.name }),
            h('span', { class:'line-s', text: disciplineName(tp.disciplineId) + ' · prioridade ' + PriorityEngine.text(tp.priority) })))))));
      }
    }
  }

  else if(kind === 'deadlines'){
    title = 'Prazos';
    const d = a.deadlines;
    body.append(drawerIntro('Prazos ligados ao que está sendo analisado. Em aberto mostra a situação de agora; concluídos consideram o período escolhido.'));
    if(d.overdue.length) body.append(drawerSection('Data passou', h('ul', { class:'dl-line-list' }, d.overdue.map(x => deadlineLine(x.dl, x, false)))));
    if(d.upcoming.length) body.append(drawerSection('Próximos', h('ul', { class:'dl-line-list' }, d.upcoming.map(x => deadlineLine(x.dl, x, false)))));
    if(d.completedInRange.length) body.append(drawerSection('Concluídos no período', h('ul', { class:'dl-line-list' }, d.completedInRange.map(dl => deadlineLine(dl, null, true)))));
    if(!d.open.length && !d.completedInRange.length) body.append(h('p', { class:'influence-note', text:'Nenhum prazo em aberto nem concluído neste período.' }));
  }

  Drawer.open(title, body);
}

/* ---------- calendário ---------- */
function analyticsCalendarCard(a){
  const inSelect = ui.calMode === 'select';
  const head = h('div', { class:'card-head' },
    h('p', { class:'card-title', style:'margin:0' }, 'Calendário', helpDot('calendario')),
    inSelect
      ? h('button', { class:'btn ghost sm', type:'button', text:'Cancelar seleção', onclick:() => { ui.calMode = 'view'; ui.calSel = { start:null, end:null }; renderAnalytics(); } })
      : h('button', { class:'btn ghost sm', type:'button', text:'Selecionar intervalo',
          onclick:() => { ui.calMode = 'select'; ui.calSel = { start:null, end:null }; renderAnalytics(); const g = $('.cal-grid [tabindex="0"]'); if(g) g.focus(); } }));
  const c = h('div', { class:'card an-cal' + (inSelect ? ' is-selecting' : '') }, head);
  if(inSelect){
    const sel = ui.calSel || {};
    let msg, actions = null;
    if(!sel.start) msg = 'Clique no primeiro dia do intervalo.';
    else if(!sel.end) msg = `Início: ${fmtDateBR(sel.start)}. Agora clique no último dia.`;
    else {
      const r = { start: parseISO(sel.start), end: parseISO(sel.end) };
      msg = `${fmtRangeLabel(r)} · ${plural(rangeDays(r), 'dia', 'dias')}`;
      actions = h('div', { class:'row auto' },
        h('button', { class:'btn primary sm', type:'button', text:'Analisar este período', onclick:() => {
          setAnalyticsPeriod(r, null);
          toast(fmtRangeLabel(r), 'ok', { title:'Período aplicado' });
        } }),
        h('button', { class:'btn ghost sm', type:'button', text:'Cancelar', onclick:() => { ui.calMode = 'view'; ui.calSel = { start:null, end:null }; renderAnalytics(); } }));
    }
    c.append(h('div', { class:'cal-select-bar', role:'status', 'aria-live':'polite' }, h('span', { text:msg }), actions));
  }
  c.append(calendarHeatmap(a));
  return c;
}

function calendarHeatmap(a){
  const monthDate = ui.calMonth || new Date();
  const scope = a ? a.scope : AnalyticsScope.resolve(ui.analyticsScope);
  const y = monthDate.getFullYear(), mo = monthDate.getMonth();
  const inSelect = ui.calMode === 'select';
  const wrap = h('div', { class:'cal' });
  const goMonth = (delta) => { ui.calMonth = new Date(y, mo + delta, 1); renderAnalytics(); };
  wrap.append(h('div', { class:'cal-head' },
    h('button', { class:'btn ghost sm', type:'button', text:'‹', 'aria-label':'Mês anterior', onclick:() => goMonth(-1) }),
    h('span', { class:'cal-month', 'aria-live':'polite', text:`${MONTHS[mo]} de ${y}` }),
    h('button', { class:'btn ghost sm', type:'button', text:'›', 'aria-label':'Próximo mês', onclick:() => goMonth(1) }),
    h('button', { class:'linkbtn', type:'button', text:'mês atual', style:'margin-left:auto',
      onclick:() => { const t = new Date(); ui.calMonth = new Date(t.getFullYear(), t.getMonth(), 1); renderAnalytics(); } })));

  const dows = weekStartDow() === 1 ? ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'] : ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  wrap.append(h('div', { class:'cal-dows', 'aria-hidden':'true' }, dows.map(d => h('span', { text:d }))));

  const total = new Date(y, mo + 1, 0).getDate();
  const monthSessions = AnalyticsScope.sessions(scope, { start:new Date(y, mo, 1), end:new Date(y, mo, total) });
  const minutesByDay = new Map();
  monthSessions.forEach(s => minutesByDay.set(s.date, (minutesByDay.get(s.date) || 0) + (s.minutes || 0)));
  const max = Math.max(0, ...minutesByDay.values());
  const dueDays = new Set(state.deadlines.filter(dl => !DeadlineEngine.isDone(dl) && AnalyticsScope.deadlineRelation(scope, dl)).map(dl => dl.date));

  const firstDow = new Date(y, mo, 1).getDay();
  const blanks = (firstDow - weekStartDow() + 7) % 7;
  const grid = h('div', { class:'cal-grid', role:'group', 'aria-label': inSelect ? 'Escolha o primeiro e o último dia do intervalo' : 'Dias do mês; escolha um dia para ver os detalhes' });
  for(let i = 0; i < blanks; i++) grid.append(h('div', { class:'cal-day blank', 'aria-hidden':'true' }));

  const sISO = dateToISO(ui.period.start), eISO = dateToISO(ui.period.end), tISO = todayISO();
  const sel = ui.calSel || {};
  const selA = sel.start && sel.end ? (sel.start < sel.end ? sel.start : sel.end) : sel.start;
  const selB = sel.start && sel.end ? (sel.start < sel.end ? sel.end : sel.start) : sel.start;
  const monthISO = d => dateToISO(new Date(y, mo, d));
  // dia que recebe o foco do teclado (roving tabindex)
  let focusISO = ui.calFocus && ui.calFocus.slice(0, 7) === monthISO(1).slice(0, 7) ? ui.calFocus
    : (tISO.slice(0, 7) === monthISO(1).slice(0, 7) ? tISO : (eISO.slice(0, 7) === monthISO(1).slice(0, 7) ? eISO : monthISO(1)));

  for(let day = 1; day <= total; day++){
    const iso = monthISO(day);
    const m = minutesByDay.get(iso) || 0;
    let lvl = 0;
    if(max > 0 && m > 0){ const r = m / max; lvl = r >= .75 ? 4 : r >= .5 ? 3 : r >= .25 ? 2 : 1; }
    let cls = 'cal-day';
    if(inSelect){
      if(selA && iso >= selA && iso <= selB) cls += ' inrange';
      if(iso === selA || iso === selB) cls += ' edge';
    } else {
      if(iso >= sISO && iso <= eISO) cls += ' inrange';
      if(iso === sISO || iso === eISO) cls += ' edge';
    }
    if(iso === tISO) cls += ' today';
    if(iso > tISO) cls += ' future';
    const parts = [fmtDateLong(iso), m > 0 ? fmtDuration(m) + ' de estudo' : 'sem registros'];
    if(dueDays.has(iso)) parts.push('tem prazo');
    if(!inSelect && iso >= sISO && iso <= eISO) parts.push('dentro do período analisado');
    const btn = h('button', { type:'button', class:cls, dataset:{ date: iso }, tabindex: iso === focusISO ? '0' : '-1',
      'aria-label': parts.join(', '), 'aria-pressed': inSelect ? ((iso === selA || iso === selB) ? 'true' : 'false') : null },
      h('span', { class:'cal-num', text:String(day) }),
      dueDays.has(iso) ? h('span', { class:'cal-due', 'aria-hidden':'true' }) : null,
      h('span', { class:'lv', style: lvl ? `background:var(--heat-${lvl})` : null }));
    Tooltip.attach(btn, () => dayTip(iso, scope));
    btn.addEventListener('click', () => {
      ui.calFocus = iso;
      if(ui.calMode === 'select'){
        const s = ui.calSel || {};
        if(!s.start || s.end) ui.calSel = { start:iso, end:null };
        else ui.calSel = iso < s.start ? { start:iso, end:s.start } : { start:s.start, end:iso };
        ui.calRefocus = iso;
        renderAnalytics();
      } else {
        openDayDrawer(iso, scope);
      }
    });
    grid.append(btn);
  }
  grid.addEventListener('keydown', (e) => {
    const cur = e.target.closest && e.target.closest('.cal-day');
    if(!cur || !cur.dataset.date) return;
    const step = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7 }[e.key];
    let target = null;
    if(step) target = addDays(parseISO(cur.dataset.date), step);
    else if(e.key === 'PageUp') target = new Date(y, mo - 1, Math.min(parseISO(cur.dataset.date).getDate(), new Date(y, mo, 0).getDate()));
    else if(e.key === 'PageDown') target = new Date(y, mo + 1, Math.min(parseISO(cur.dataset.date).getDate(), new Date(y, mo + 2, 0).getDate()));
    else if(e.key === 'Home') target = new Date(y, mo, 1);
    else if(e.key === 'End') target = new Date(y, mo, total);
    if(!target) return;
    e.preventDefault();
    const iso = dateToISO(target);
    const el = grid.querySelector(`.cal-day[data-date="${iso}"]`);
    if(el){
      $$('.cal-day[tabindex="0"]', grid).forEach(x => x.setAttribute('tabindex', '-1'));
      el.setAttribute('tabindex', '0');
      el.focus();
      ui.calFocus = iso;
    } else {
      ui.calFocus = iso; ui.calRefocus = iso;
      ui.calMonth = new Date(target.getFullYear(), target.getMonth(), 1);
      renderAnalytics();
    }
  });
  wrap.append(grid);
  wrap.append(h('div', { class:'cal-legend' },
    h('span', { text:'menos' }),
    [0,1,2,3,4].map(i => h('span', { class:'sw', style:`background:var(--heat-${i})` })),
    h('span', { text:'mais tempo' }),
    dueDays.size ? h('span', { class:'cal-legend-due' }, h('span', { class:'cal-due', 'aria-hidden':'true' }), 'prazo') : null));
  wrap.append(h('p', { class:'hint', style:'margin-top:6px', text: inSelect
    ? 'Escolha o primeiro e o último dia. A ordem não importa.'
    : 'Escolha um dia para ver o que foi estudado. Para analisar vários dias, use "Selecionar intervalo". Setas do teclado movem entre os dias.' }));
  return wrap;
}

function sessionsOfDay(iso, scope){
  return state.sessions.filter(x => x.date === iso && AnalyticsScope.hasSession(scope, x));
}

/** Resumo de um dia no tooltip do calendário. */
function dayTip(iso, scope){
  const sc = scope || AnalyticsScope.resolve(ui.analyticsScope);
  const list = sessionsOfDay(iso, sc);
  if(!list.length) return tipBody(fmtDateBR(iso), [], 'Sem registros neste dia.');
  const byDisc = new Map();
  list.forEach(x => byDisc.set(x.disciplineId, (byDisc.get(x.disciplineId) || 0) + (x.minutes || 0)));
  const rows = [...byDisc.entries()].sort((a,b) => b[1] - a[1]).slice(0, 5).map(([id, min]) => [disciplineName(id), fmtDuration(min)]);
  return tipBody(fmtDateBR(iso), [
    ['Tempo', fmtDuration(sum(list, x => x.minutes || 0))],
    ['Estudos', String(list.length)],
    '-'
  ].concat(rows));
}

/** Detalhes de um dia (modo visualização do calendário). */
function openDayDrawer(iso, scope){
  const sc = scope || AnalyticsScope.resolve(ui.analyticsScope);
  const list = sessionsOfDay(iso, sc).slice().sort((x,y) => str(x.createdAt).localeCompare(str(y.createdAt)));
  const body = h('div', { class:'an-drawer' });
  body.append(h('p', { class:'an-drawer-ctx', text: AnalyticsScope.pathText(sc) }));
  const total = sum(list, x => x.minutes || 0);
  if(!list.length){
    body.append(h('p', { class:'influence-note', text: iso > todayISO() ? 'Este dia ainda não chegou.' : 'Nenhum estudo registrado neste dia.' }));
  } else {
    const restDay = sum(list, x => breakMinutesOf(x));
    body.append(h('div', { class:'stat-grid compact' },
      statBox(fmtDuration(total), 'tempo estudado'),
      statBox(String(list.length), list.length === 1 ? 'estudo' : 'estudos'),
      statBox(String(list.filter(s => s.type === 'revisao' || s.reviewOutcome).length), 'revisões'),
      restDay > 0 ? statBox(fmtDuration(restDay), 'descanso') : null));
    const ul = h('ul', { class:'an-sess-list' });
    list.forEach(s => {
      const topic = topicLabelOf(s);
      ul.append(h('li', null, h('button', { class:'an-sess', type:'button', 'aria-label':'Editar este estudo',
          onclick:() => { Drawer.close(); openEditSessionModal(s.id); } },
        h('span', { class:'an-sess-main' },
          h('span', { class:'an-sess-title', text: disciplineName(s.disciplineId) + (topic ? ' › ' + topic : '') }),
          h('span', { class:'an-sess-sub', text: [sessionTypeLabel(s.type), s.difficulty ? 'dificuldade ' + s.difficulty + '/5' : null, s.reviewOutcome ? reviewOutcomeLabel(s.reviewOutcome) : null].filter(Boolean).join(' · ') })),
        h('span', { class:'an-sess-min', text: fmtDuration(s.minutes) }))));
    });
    body.append(drawerSection('Estudos do dia', ul));
  }
  const due = state.deadlines.filter(dl => dl.date === iso && AnalyticsScope.deadlineRelation(sc, dl));
  if(due.length) body.append(drawerSection('Prazos neste dia', h('ul', { class:'dl-line-list' }, due.map(dl => deadlineLine(dl, null, DeadlineEngine.isDone(dl))))));
  body.append(h('div', { class:'row auto', style:'margin-top:16px' },
    h('button', { class:'btn primary sm', type:'button', text:'Analisar este dia', onclick:() => {
      const d = parseISO(iso);
      Drawer.close();
      setAnalyticsPeriod({ start:d, end:d }, iso === todayISO() ? 'hoje' : null);
    } }),
    iso <= todayISO() ? h('button', { class:'btn ghost sm', type:'button', text:'Registrar estudo neste dia', onclick:() => { Drawer.close(); openRegisterModal({ mode:'manual', date: iso, disciplineId: sc.disciplineId || null, topicId: sc.topicId || null }); } }) : null));
  Drawer.open(fmtDateLong(iso), body);
}

/* ---------- gráfico de tempo ---------- */

function timeChart(a){
  const days = a.days;
  const granularity = days > 180 ? 'month' : days > 31 ? 'week' : 'day';
  const buckets = new Map();
  const add = (key, label, minutes, range) => {
    if(!buckets.has(key)) buckets.set(key, { key, label, minutes:0, range });
    buckets.get(key).minutes += minutes;
  };
  if(granularity === 'day'){
    for(let i = 0; i < days; i++){ const d = addDays(a.range.start, i); add(dateToISO(d), String(d.getDate()), 0, { start:d, end:d }); }
    a.sessions.forEach(s => { const d = parseISO(s.date); if(d) add(s.date, String(d.getDate()), s.minutes || 0, { start:d, end:d }); });
  } else if(granularity === 'week'){
    let ws = startOfWeek(a.range.start);
    while(ws <= a.range.end){
      add(dateToISO(ws), `${ws.getDate()}/${ws.getMonth()+1}`, 0, { start: ws < a.range.start ? a.range.start : ws, end: addDays(ws, 6) > a.range.end ? a.range.end : addDays(ws, 6) });
      ws = addDays(ws, 7);
    }
    a.sessions.forEach(s => { const w = startOfWeek(parseISO(s.date)); const k = dateToISO(w); if(buckets.has(k)) buckets.get(k).minutes += s.minutes || 0; });
  } else {
    let m = new Date(a.range.start.getFullYear(), a.range.start.getMonth(), 1);
    while(m <= a.range.end){
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);
      add(`${m.getFullYear()}-${String(m.getMonth()).padStart(2,'0')}`, `${MONTHS_ABBR[m.getMonth()]}${m.getMonth() === 0 ? '/' + String(m.getFullYear()).slice(2) : ''}`, 0,
        { start: m < a.range.start ? a.range.start : m, end: end > a.range.end ? a.range.end : end });
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    }
    a.sessions.forEach(s => { const d = parseISO(s.date); const k = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,'0')}`; if(buckets.has(k)) buckets.get(k).minutes += s.minutes || 0; });
  }
  const series = Array.from(buckets.values()).sort((x,y) => x.key < y.key ? -1 : 1);
  if(!series.length || series.every(s => s.minutes === 0)) return h('p', { class:'hint', text:'Sem registros neste período.' });
  const max = Math.max(...series.map(s => s.minutes), 1);
  const unit = { day:'dia', week:'semana', month:'mês' }[granularity];
  const chart = h('div', { class:'tchart', role:'group', 'aria-label':`Tempo por ${unit}` });
  series.forEach(s => {
    const col = h('button', { class:'tcol' + (s.minutes ? '' : ' is-empty'), type:'button',
      'aria-label': `${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.label)}: ${fmtDuration(s.minutes)}. Ver detalhes`,
      onclick:() => openBucketDrawer(s, granularity, a) },
      h('span', { class:'tb', style:`height:${(s.minutes / max) * 100}%` }),
      h('span', { class:'tl', text:s.label }));
    Tooltip.attach(col, () => bucketTip(s, granularity, a.scope));
    chart.appendChild(col);
  });
  return h('div', null, chart,
    h('p', { class:'hint', style:'margin-top:6px', text:`Cada barra é um ${unit}. Clique em uma barra para ver os detalhes.` }));
}

function bucketSessions(bucket, scope){ return AnalyticsScope.sessions(scope, bucket.range); }

function bucketTip(bucket, granularity, scope){
  const list = bucketSessions(bucket, scope || AnalyticsScope.resolve(ui.analyticsScope));
  const byDisc = new Map();
  list.forEach(x => byDisc.set(x.disciplineId, (byDisc.get(x.disciplineId) || 0) + (x.minutes || 0)));
  const rows = [...byDisc.entries()].sort((a,b) => b[1] - a[1]).slice(0, 5).map(([id, min]) => [disciplineName(id), fmtDuration(min)]);
  const head = granularity === 'day' ? fmtDateBR(bucket.key) : fmtRangeLabel(bucket.range);
  const sub = `${fmtDuration(bucket.minutes)} · ${plural(list.length, 'estudo', 'estudos')}`;
  return tipBody(head, rows.length ? [[sub, '']].concat(['-']).concat(rows) : [], rows.length ? null : sub);
}

function openBucketDrawer(bucket, granularity, a){
  if(granularity === 'day'){ openDayDrawer(bucket.key, a.scope); return; }
  const list = bucketSessions(bucket, a.scope);
  const body = h('div', { class:'an-drawer' });
  body.append(h('p', { class:'an-drawer-ctx', text: AnalyticsScope.pathText(a.scope) }));
  body.append(h('div', { class:'stat-grid compact' },
    statBox(fmtDuration(sum(list, s => s.minutes || 0)), 'tempo'),
    statBox(String(list.length), list.length === 1 ? 'estudo' : 'estudos'),
    statBox(String(new Set(list.map(s => s.date)).size), 'dias com estudo')));
  const useTopics = a.scope.type === 'discipline' || a.scope.type === 'topic';
  const rows = AnalyticsEngine.groupMinutes(list, s => useTopics ? (s.topicId || '__none__') : s.disciplineId,
    id => useTopics ? (id === '__none__' ? 'Sem tópico definido' : ((getTopic(id) || {}).name || '(tópico removido)')) : disciplineName(id));
  if(rows.length){
    const mx = Math.max(1, ...rows.map(r => r.minutes));
    body.append(drawerSection(useTopics ? 'Por tópico' : 'Por disciplina', rows.slice(0, 12).map(r => hbarRow(r.label, r.minutes / mx * 100, `${fmtDuration(r.minutes)} · ${safePct(r.pct)}`))));
  }
  body.append(h('div', { class:'row auto', style:'margin-top:16px' },
    h('button', { class:'btn primary sm', type:'button', text:'Analisar este período', onclick:() => {
      Drawer.close(); setAnalyticsPeriod(bucket.range, null);
    } })));
  Drawer.open(fmtRangeLabel(bucket.range), body);
}

/* ---------- distribuição (rosca) ---------- */
function distributionModes(scope){
  const hasAreas = activeAreas().length > 0;
  switch(scope.type){
    case 'all':        return (hasAreas ? [['area','Áreas']] : []).concat([['discipline','Disciplinas'], ['topic','Tópicos']]);
    case 'area':       return [['discipline','Disciplinas'], ['topic','Tópicos']];
    case 'discipline': return [['topic','Tópicos'], ['type','Tipos de estudo']];
    default:           return [['type','Tipos de estudo']];
  }
}

function analyticsDistributionCard(a){
  const modes = distributionModes(a.scope);
  let mode = ui.distributionMode;
  if(!modes.some(m => m[0] === mode)) mode = modes.some(m => m[0] === 'discipline') ? 'discipline' : modes[0][0];
  const toggle = h('div', { class:'chips', role:'group', 'aria-label':'Agrupar por' }, modes.map(([v, l]) =>
    h('button', { class:'chip', type:'button', 'aria-pressed': mode === v ? 'true' : 'false', text:l,
      onclick:() => { ui.distributionMode = v; renderAnalytics(); } })));
  let rows;
  if(mode === 'area') rows = a.byArea;
  else if(mode === 'discipline') rows = a.byDiscipline;
  else if(mode === 'topic') rows = a.byTopic;
  else rows = a.byType.filter(x => x.minutes > 0).map(x => ({ key:x.key, label:x.label, minutes:x.minutes, count:x.count,
    pct: a.totals.minutes > 0 ? x.minutes / a.totals.minutes * 100 : 0 })).sort((x,y) => y.minutes - x.minutes);

  // no máximo 7 fatias + "Outros"
  let shown = rows;
  if(rows.length > 8){
    const rest = rows.slice(7);
    shown = rows.slice(0, 7).concat([{ key:'__others__', label:`Outros (${rest.length})`, minutes: sum(rest, r => r.minutes),
      count: sum(rest, r => r.count), pct: sum(rest, r => r.pct), others: rest }]);
  }
  const content = shown.length
    ? h('div', { class:'donut-wrap' }, donutChart(shown, mode, a), donutLegend(shown, mode, a))
    : h('p', { class:'hint', text:'Sem registros neste período.' });
  return cardWithAction('Para onde foi o tempo', toggle, content);
}

function distributionAction(row, mode){
  if(row.key === '__others__' || row.key === '__none__') return null;
  if(mode === 'area') return row.key === NO_AREA_ID || getArea(row.key) ? () => analyzeOnly('area', row.key) : null;
  if(mode === 'discipline') return getDiscipline(row.key) ? () => analyzeOnly('discipline', row.key) : null;
  if(mode === 'topic') return getTopic(row.key) ? () => analyzeOnly('topic', row.key) : null;
  return null;
}

function openDistributionDrawer(row, mode, a){
  const body = h('div', { class:'an-drawer' });
  body.append(h('p', { class:'an-drawer-ctx', text: `${AnalyticsScope.pathText(a.scope)} · ${fmtRangeLabel(a.range)}` }));
  body.append(h('div', { class:'stat-grid compact' },
    statBox(fmtDuration(row.minutes), 'tempo'),
    statBox(safePct(row.pct), 'do tempo do período'),
    statBox(String(row.count), row.count === 1 ? 'estudo' : 'estudos')));
  if(row.others){
    const mx = Math.max(1, ...row.others.map(r => r.minutes));
    body.append(drawerSection('Itens agrupados', row.others.map(r => hbarRow(r.label, r.minutes / mx * 100, `${fmtDuration(r.minutes)} · ${safePct(r.pct)}`, null, distributionAction(r, mode)))));
  }
  if(mode === 'discipline' && getDiscipline(row.key)){
    const d = getDiscipline(row.key);
    const dl = h('dl', { class:'kv-list' });
    const kv = (k, v) => dl.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
    kv(AREA_TERM, areaNameOf(d));
    kv('Prioridade', PriorityEngine.text(d.priority));
    const pd = a.planAdherence.perDiscipline.find(x => x.disciplineId === d.id);
    if(pd && pd.planned > 0) kv('Plano', `${fmtDuration(pd.realized)} de ${fmtDuration(pd.planned)} (${safePct(pd.pct)})`);
    body.append(dl);
  } else if(mode === 'topic' && getTopic(row.key)){
    const tp = getTopic(row.key);
    const dl = h('dl', { class:'kv-list' });
    const kv = (k, v) => dl.append(h('div', null, h('dt', { text:k }), h('dd', { text:v })));
    kv('Disciplina', disciplineName(tp.disciplineId));
    kv('Prioridade', PriorityEngine.text(tp.priority));
    kv('Situação', TOPIC_STATUS_LABEL[topicStatus(tp)]);
    body.append(dl);
  }
  const go = distributionAction(row, mode);
  const goLabel = { area:'Analisar só esta Área de Estudo', discipline:'Analisar só esta disciplina', topic:'Analisar só este tópico' }[mode];
  const view = mode === 'discipline' && getDiscipline(row.key) ? () => { Drawer.close(); openDisciplineDetail(row.key); }
             : mode === 'topic' && getTopic(row.key) ? () => openTopicFromAnalytics(getTopic(row.key)) : null;
  if(go || view) body.append(h('div', { class:'row auto', style:'margin-top:16px' },
    go ? h('button', { class:'btn primary sm', type:'button', text:goLabel, onclick:go }) : null,
    view ? h('button', { class:'btn ghost sm', type:'button', text: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico', onclick:view }) : null));
  Drawer.open(row.label, body);
}

function donutChart(rows, mode, a){
  const total = sum(rows, r => r.minutes) || 1;
  const R = 45, C = 60, circ = 2 * Math.PI * R;
  const svg = svgEl('svg', { id:'donut-svg', viewBox:'0 0 120 120', class:'donut', 'aria-hidden':'true', focusable:'false' });
  svg.append(svgEl('circle', { cx:C, cy:C, r:R, fill:'none', stroke:'var(--line-soft)', 'stroke-width':16 }));
  let offset = 0;
  rows.forEach((r, i) => {
    const seg = (r.minutes / total) * circ;
    const c = svgEl('circle', { cx:C, cy:C, r:R, fill:'none', stroke:PALETTE[i % PALETTE.length], 'stroke-width':16,
      'stroke-dasharray':`${seg} ${circ - seg}`, 'stroke-dashoffset':-offset, transform:`rotate(-90 ${C} ${C})`,
      'data-seg': String(i) });
    c.addEventListener('click', () => openDistributionDrawer(r, mode, a));
    c.addEventListener('mouseenter', () => donutHighlight(i, true));
    c.addEventListener('mouseleave', () => donutHighlight(i, false));
    svg.append(c);
    offset += seg;
  });
  svg.append(svgEl('text', { x:C, y:C - 2, 'text-anchor':'middle', class:'donut-total' }, fmtDuration(sum(rows, r => r.minutes))));
  svg.append(svgEl('text', { x:C, y:C + 13, 'text-anchor':'middle', class:'donut-sub' }, 'no total'));
  return svg;
}
function donutHighlight(i, on){
  const svg = $('#donut-svg');
  if(!svg) return;
  $$('circle[data-active]', svg).forEach(c => c.removeAttribute('data-active'));
  if(on){ svg.setAttribute('data-dim','1'); const c = svg.querySelector(`circle[data-seg="${i}"]`); if(c) c.setAttribute('data-active','1'); }
  else svg.removeAttribute('data-dim');
}
function donutLegend(rows, mode, a){
  const box = h('ul', { class:'legend', 'aria-label':'Distribuição do tempo' });
  rows.forEach((r, i) => {
    const row = h('button', { class:'legend-row', type:'button', 'data-hoverable':'1',
        'aria-label': `${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes`,
        onclick:() => openDistributionDrawer(r, mode, a) },
      h('span', { class:'sw', style:`background:${PALETTE[i % PALETTE.length]}` }),
      h('span', { class:'lb', text:r.label }),
      h('span', { class:'num', text:`${fmtDuration(r.minutes)} · ${safePct(r.pct)}` }));
    ['mouseenter','focus'].forEach(ev => row.addEventListener(ev, () => donutHighlight(i, true)));
    ['mouseleave','blur'].forEach(ev => row.addEventListener(ev, () => donutHighlight(i, false)));
    box.appendChild(h('li', null, row));
  });
  return box;
}

/* ---------- prioridades ---------- */
function analyticsPriorityCard(a){
  const pr = a.priorities;
  const sc = a.scope;
  const showDisc = (sc.type === 'all' || sc.type === 'area') && pr.total > 0 && pr.mixedDisc;
  const showTopic = sc.type !== 'topic' && pr.topicTotal > 0 && pr.mixedTopic;
  if(!showDisc && !showTopic && !pr.highDiscNoTime.length && !pr.highTopicNoTime.length){
    if(sc.type !== 'topic') return null;
    const tp = getTopic(sc.topicId), d = getDiscipline(sc.disciplineId);
    if(!tp || !d) return null;
    return h('div', { class:'card' }, h('p', { class:'card-title' }, 'Prioridade', helpDot('prioridade')),
      h('div', { class:'an-prio-pair' },
        h('div', null, h('span', { class:'section-label', text:'Deste tópico' }), priorityChip(tp.priority)),
        h('div', null, h('span', { class:'section-label', text:'Da disciplina' }), priorityChip(d.priority))),
      h('p', { class:'hint', style:'margin-top:10px', text: PriorityEngine.hint(tp.priority, 'topic') }));
  }
  const c = h('div', { class:'card' }, h('p', { class:'card-title' }, 'Tempo por prioridade', helpDot('prioridade')));
  const block = (title, rows, totalMin) => {
    const mx = Math.max(1, ...rows.map(r => r.minutes));
    return h('div', { class:'an-prio-block' },
      h('p', { class:'section-label', text:title }),
      rows.slice().reverse().filter(r => r.count > 0 || r.minutes > 0).map(r => h('div', { class:'hbar-row' },
        h('span', { class:'hl' }, priorityChip(r.p, { compact:false })),
        h('div', { class:'hbar' }, h('span', { style:`width:${r.minutes / mx * 100}%` })),
        h('span', { class:'hv', text: r.minutes ? `${fmtDuration(r.minutes)} · ${safePct(r.pct)}` : '—' }))),
      (totalMin === pr.topicTotal && totalMin !== pr.total)
        ? h('p', { class:'hint', text:'Considera só estudos com tópico definido.' })
        : null);
  };
  if(showDisc) c.append(block('Disciplinas', pr.byDisc, pr.total));
  if(showTopic) c.append(block('Tópicos', pr.byTopic, pr.topicTotal));
  if(pr.highDiscNoTime.length){
    c.append(h('p', { class:'section-label', style:'margin-top:12px', text:'Prioridade alta, sem estudo no período' }));
    c.append(h('div', { class:'chips' }, pr.highDiscNoTime.slice(0, 8).map(d =>
      h('button', { class:'chip', type:'button', text:`${d.name} · ${PriorityEngine.clamp(d.priority)}`, onclick:() => analyzeOnly('discipline', d.id) }))));
  }
  if(pr.highTopicNoTime.length && sc.type !== 'all'){
    c.append(h('p', { class:'section-label', style:'margin-top:12px', text:'Tópicos de prioridade alta não estudados no período' }));
    c.append(h('div', { class:'chips' }, pr.highTopicNoTime.slice(0, 8).map(tp =>
      h('button', { class:'chip', type:'button', text:`${tp.name} · ${PriorityEngine.clamp(tp.priority)}`, onclick:() => openTopicFromAnalytics(tp) }))));
    if(pr.highTopicNoTime.length > 8) c.append(h('p', { class:'hint', text:`e mais ${pr.highTopicNoTime.length - 8}.` }));
  }
  c.append(h('p', { class:'hint', style:'margin-top:10px', text:'Usa a prioridade atual de cada disciplina e tópico. Prioridade alta não precisa receber todo o tempo: é só uma referência.' }));
  return c;
}

/* ---------- plano, conteúdo, revisões, dificuldade, tipos ---------- */

function analyticsContentCard(a){
  const ct = a.content;
  const c = h('div', { class:'card' }, h('p', { class:'card-title' }, 'Progresso no conteúdo', helpDot('cobertura')));
  if(a.scope.type === 'topic'){
    const tp = getTopic(a.scope.topicId);
    const st = tp ? topicStatus(tp) : 'nao_iniciado';
    c.append(h('div', { class:'stat-grid compact' },
      statBox(TOPIC_STATUS_LABEL[st], 'situação'),
      statBox(tp && tp.masteryLevel ? `${tp.masteryLevel} de 5` : '—', 'consolidação'),
      statBox(tp && tp.reviewDueDate && tp.reviewEnabled ? fmtDateBR(tp.reviewDueDate) : '—', 'próxima revisão')));
    return c;
  }
  c.append(h('div', { class:'stat-grid compact', style:'margin-bottom:12px' },
    statBox(`${ct.covered} de ${ct.totalTopics}`, METRIC_WORDS.coverage.title, { text:`${safePct(ct.coverage)} dos tópicos`, dir:'' }),
    statBox(`${ct.mastered} de ${ct.totalTopics}`, METRIC_WORDS.mastery.title, { text:`${safePct(ct.masteryPct)} dos tópicos`, dir:'' })));
  if(a.scope.type === 'discipline'){
    const mx = Math.max(1, ...ct.byStatus.map(x => x.count));
    ct.byStatus.forEach(x => c.append(hbarRow(x.label, x.count / mx * 100, String(x.count))));
  } else {
    ct.perDiscipline.slice().sort((x,y) => (y.coverage || 0) - (x.coverage || 0)).slice(0, 10)
      .forEach(x => c.append(hbarRow(x.discipline.name, x.coverage, safePct(x.coverage), null, () => analyzeOnly('discipline', x.discipline.id))));
  }
  if(ct.weakest.length){
    c.append(h('p', { class:'section-label', style:'margin-top:14px', text:'Menos consolidados' }));
    ct.weakest.forEach(tp => c.append(hbarRow(tp.name, (tp.masteryLevel / 5) * 100, tp.masteryLevel + '/5',
      tp.masteryLevel <= 2 ? 'var(--danger)' : 'var(--brass)', () => openTopicFromAnalytics(tp))));
  }
  return c;
}

function analyticsReviewsCard(a){
  const r = a.reviews;
  const rc = h('div', { class:'card' }, h('p', { class:'card-title' }, 'Revisões', helpDot('dominio')),
    h('div', { class:'stat-grid compact', style:'margin-bottom:10px' },
      statBox(String(r.completed), 'concluídas no período'),
      statBox(String(r.scheduled), 'marcadas para o período'),
      statBox(String(r.overdueNow), 'atrasadas agora')));
  const outMax = Math.max(1, ...r.outcomes.map(o => o.count));
  if(r.completed > 0) r.outcomes.forEach(o => rc.append(hbarRow(o.label, o.count / outMax * 100, String(o.count))));
  if(r.forgetful.length){
    rc.append(h('p', { class:'section-label', style:'margin-top:14px', text:'Esquecidos com mais frequência' }));
    r.forgetful.forEach(tp => rc.append(hbarRow(tp.name, clamp((tp.reviewFailures / 5) * 100, 10, 100), tp.reviewFailures + '×', 'var(--danger)', () => openTopicFromAnalytics(tp))));
  }
  rc.append(h('button', { class:'linkbtn', type:'button', style:'margin-top:10px', text:'Ver detalhes das revisões', onclick:() => openAnalyticsDrawer('reviews', a) }));
  return rc;
}

function analyticsDifficultyCard(a){
  const c = h('div', { class:'card' }, h('p', { class:'card-title' }, 'Dificuldade percebida', helpDot('dificuldade')));
  if(a.difficulty.count === 0){
    c.append(h('p', { class:'hint', text:'Nenhum estudo deste período teve dificuldade informada.' }));
    return c;
  }
  c.append(h('p', { class:'hint', style:'margin-bottom:10px', text:`Média ${fmtNumber(a.difficulty.avg, 1)}/5 em ${plural(a.difficulty.count, 'registro', 'registros')}. Mostra como o estudo pareceu, não o seu desempenho.` }));
  const max = Math.max(1, ...a.difficulty.counts.map(x => x.count));
  a.difficulty.counts.forEach(d => c.append(hbarRow(d.label, d.count / max * 100, String(d.count), d.color)));
  const per = a.scope.type === 'discipline' || a.scope.type === 'topic' ? a.difficulty.perTopic : a.difficulty.perDiscipline;
  if(per.length > 1){
    c.append(h('p', { class:'section-label', style:'margin-top:14px', text: a.scope.type === 'discipline' ? 'Média por tópico' : 'Média por disciplina' }));
    per.slice(0, 8).forEach(x => c.append(hbarRow(x.label, x.avg / 5 * 100, fmtNumber(x.avg, 1) + '/5')));
  }
  return c;
}

function analyticsTypesCard(a){
  const c = h('div', { class:'card' }, h('p', { class:'card-title' }, 'Tipos de estudo', helpDot('tiposessao')));
  if(!a.totals.count){ c.append(h('p', { class:'hint', text:'Nenhum estudo neste período.' })); return c; }
  const maxType = Math.max(1, ...a.byType.map(x => x.count));
  a.byType.forEach(t => c.append(hbarRow(t.label, t.count / maxType * 100, t.count ? `${t.count} · ${safePct(t.pct)}` : '0')));
  return c;
}

function analyticsProjectionCard(a){
  const p = a.projection;
  return card('Ritmo das últimas semanas', p.available
    ? h('div',
        h('p', { text:`Média das últimas ${p.weeksConsidered} semanas: ${fmtDuration(p.avgWeeklyMinutes)} por semana.` }),
        p.target ? h('p', { class:'hint', style:'margin-top:6px', text: p.meetsTarget
          ? `Acompanha o objetivo de ${fmtDuration(p.target)} por semana.`
          : `O objetivo é ${fmtDuration(p.target)} por semana; a média está ${fmtDuration(Math.abs(p.gap))} abaixo.` }) : null,
        h('p', { class:'hint', style:'margin-top:6px', text:'Não depende do período escolhido acima: considera sempre as 4 semanas completas mais recentes.' }))
    : h('p', { class:'hint', text:p.reason }));
}



/* ---------- relatório semanal (respeita o escopo) ---------- */
function weeklyReportCard(scope){
  const sc = scope || AnalyticsScope.resolve(ui.analyticsScope);
  const ref = addDays(today(), ui.weekOffset * 7);
  const ws = startOfWeek(ref), we = endOfWeek(ref);
  const range = { start:ws, end:we };
  const wp = state.weeklyPlans.find(w => w.weekStart === dateToISO(ws));
  const sess = AnalyticsScope.sessions(sc, range);
  const allocs = wp ? (wp.allocations || []).filter(x => AnalyticsScope.hasDiscipline(sc, x.disciplineId)) : [];
  const planned = sum(allocs, x => x.targetMinutes || 0);
  const realized = sum(sess, s => s.minutes || 0);
  const reviews = sess.filter(s => s.type === 'revisao' || s.reviewOutcome).length;
  const a = dateToISO(ws), b = dateToISO(we);
  // v6.5 — plano cumprido da semana: de cada disciplina conta no máximo o planejado para ela (PlanRules)
  const plannedByDisc = new Map();
  allocs.forEach(al => plannedByDisc.set(al.disciplineId, (plannedByDisc.get(al.disciplineId) || 0) + (al.targetMinutes || 0)));
  let weekCounted = 0;
  plannedByDisc.forEach((pl, id) => { weekCounted += PlanRules.counted(pl, sum(sess.filter(x => x.disciplineId === id), x => x.minutes || 0)); });
  const weekExtra = Math.max(0, realized - weekCounted);

  const nav = h('div', { class:'row auto' },
    h('button', { class:'btn ghost sm', type:'button', text:'‹', 'aria-label':'Semana anterior', onclick:() => { ui.weekOffset--; renderAnalytics(); } }),
    h('span', { class:'hint', text:`Semana ${isoWeekNumber(ws)} · ${fmtDateBR(a)} a ${fmtDateBR(b)}` }),
    h('button', { class:'btn ghost sm', type:'button', text:'›', 'aria-label':'Próxima semana', disabled: ui.weekOffset >= 0,
      onclick:() => { if(ui.weekOffset < 0){ ui.weekOffset++; renderAnalytics(); } } }));

  const c = cardWithAction('Semana a semana', nav);
  c.append(h('div', { class:'stat-grid compact' },
    statBox(fmtDuration(realized), 'estudado'),
    statBox(planned > 0 ? fmtDuration(planned) : '—', 'planejado'),
    statBox(planned > 0 ? safePct((weekCounted / planned) * 100) : '—', 'plano cumprido'),
    statBox(String(sess.length), sess.length === 1 ? 'estudo' : 'estudos'),
    statBox(String(new Set(sess.map(s => s.date)).size), 'dias com estudo'),
    /* v6.5 — antes: "feitas/previstas". O "previstas" de uma semana passada não
       pode ser reconstruído (o tópico só guarda a PRÓXIMA data), então a fração
       era inventada. Fica o que é fato: quantas revisões foram feitas. */
    statBox(String(reviews), reviews === 1 ? 'revisão feita' : 'revisões feitas')));
  if(planned > 0 && weekExtra >= 1) c.append(h('p', { class:'hint', style:'margin-top:8px', text:`${fmtDuration(weekExtra)} além do plano nesta semana — tempo a mais numa disciplina ou fora do planejado. Não entra em "plano cumprido".` }));
  if(allocs.length){
    const perDisc = allocs.map(al => {
      const r = sum(sess.filter(s => s.disciplineId === al.disciplineId), s => s.minutes || 0);
      return { label: disciplineName(al.disciplineId), planned: al.targetMinutes || 0, realized: r,
               pct: al.targetMinutes > 0 ? (r / al.targetMinutes) * 100 : null };
    }).filter(x => x.planned > 0 || x.realized > 0).sort((x,y) => (y.pct || 0) - (x.pct || 0));
    if(perDisc.length > 1){
      c.append(h('p', { class:'section-label', style:'margin-top:14px', text:'Por disciplina' }));
      perDisc.forEach(x => c.append(hbarRow(x.label, x.pct || 0, x.pct === null ? fmtDuration(x.realized) : safePct(x.pct),
        (x.pct || 0) >= 100 ? 'var(--teal)' : 'var(--brass)')));
    }
  } else if(!wp){
    c.append(h('p', { class:'hint', style:'margin-top:10px', text:'Esta semana não tinha um plano registrado.' }));
  }
  return c;
}

/* ---------- resumo copiável e relatório .txt ---------- */
/** Rótulo do período da análise exportada (sempre o da consulta, nunca um estado solto). */
function reportPeriodLabel(a){ return a.periodLabel || (a.query ? analyticsPeriodLabel(a.query) : 'Período'); }
function reportFocus(a){ return focusInfo(a.focus || (a.query && a.query.focus) || 'overview'); }

function reportHeaderLines(a){
  return [
    `Analisando: ${a.scope.type === 'all' ? 'Todos os estudos' : AnalyticsScope.kindLabel(a.scope) + ' — ' + AnalyticsScope.pathText(a.scope)}`,
    `Período: ${reportPeriodLabel(a)} — ${fmtRangeLabel(a.range)} (${plural(a.days, 'dia', 'dias')})`,
    `Foco: ${reportFocus(a).label}`
  ];
}

function buildSummaryText(a){
  const L = ['CICLO — RESUMO DE ESTUDOS', ''];
  L.push(...reportHeaderLines(a), '');
  analyticsFocusSummary(a, reportFocus(a).v).forEach(s => L.push(`• ${s}`));
  L.push('');
  L.push(`Tempo: ${fmtDuration(a.totals.minutes)} · Estudos registrados: ${a.totals.count} · Dias com estudo: ${a.totals.activeDays} de ${a.days}`);
  if(a.planAdherence.hasPlan) L.push(`Plano cumprido: ${safePct(a.planAdherence.pct)} (${fmtDuration(a.planAdherence.counted)} de ${fmtDuration(a.planAdherence.planned)})` + (a.planAdherence.extra >= 1 ? ` · além do plano: ${fmtDuration(a.planAdherence.extra)}` : ''));
  if(a.reviews.completed || a.reviews.overdueNow) L.push(`Revisões: ${a.reviews.completed} concluídas · ${a.reviews.overdueNow} atrasadas agora`);
  if(a.deadlines.upcoming.length) L.push(`Próximos prazos: ${a.deadlines.upcoming.slice(0, 3).map(x => DeadlineEngine.phrase(x.dl)).join('; ')}`);
  const ins = analyticsFocusInsights(a, reportFocus(a).v);
  if(ins.length){
    L.push('', 'Principais insights:');
    ins.slice(0, 6).forEach(i => L.push(`• ${i.kind === 'attention' ? 'Atenção: ' : i.kind === 'positive' ? 'Positivo: ' : ''}${i.text}`));
  }
  return L.join('\n');
}

function reportSlug(scope){
  if(scope.type === 'all') return '';
  const s = normalizeText(scope.label).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '');
  return s;
}
function reportFilename(a){
  const slug = reportSlug(a.scope);
  const f = reportFocus(a);
  const fslug = f.v === 'overview' ? '' : normalizeText(f.label).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `ciclo-relatorio${slug ? '-' + slug : ''}${fslug ? '-' + fslug : ''}-${todayISO()}.txt`;
}

function buildStudyReportText(a){
  const L = [];
  const now = new Date();
  const section = (title) => { L.push('', title, '-'.repeat(title.length)); };
  const bullet = (t) => L.push(`- ${t}`);
  L.push('CICLO — RELATÓRIO DE ESTUDOS');
  L.push(`Gerado em ${fmtDateBR(dateToISO(now))} às ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);

  section('ESCOPO');
  if(a.scope.type === 'all') L.push('Todos os estudos (todas as Áreas de Estudo, disciplinas e tópicos).');
  else {
    L.push(`${AnalyticsScope.kindLabel(a.scope)}: ${a.scope.label}`);
    L.push(`Caminho: ${AnalyticsScope.pathText(a.scope)}`);
    if(a.scope.type === 'area') L.push(`Disciplinas incluídas: ${AnalyticsScope.disciplines(a.scope).map(d => d.name).sort((x,y) => x.localeCompare(y, 'pt-BR')).join(', ') || 'nenhuma'}`);
  }

  section('PERÍODO');
  L.push(`${reportPeriodLabel(a)}: ${fmtDateBR(dateToISO(a.range.start))} a ${fmtDateBR(dateToISO(a.range.end))} (${plural(a.days, 'dia', 'dias')})`);

  const focus = reportFocus(a);
  section('FOCO');
  L.push(`${focus.label} — ${focus.short}`);

  section('RESUMO');
  analyticsFocusSummary(a, focus.v).forEach(bullet);
  const fIns = analyticsFocusInsights(a, focus.v);
  if(fIns.length){
    L.push('Principais insights:');
    fIns.slice(0, 5).forEach(i => bullet(`${i.kind === 'attention' ? 'Atenção: ' : i.kind === 'positive' ? 'Positivo: ' : ''}${i.text}`));
  }

  section('PRIORIDADES');
  const pr = a.priorities;
  if(a.scope.type === 'topic'){
    const tp = getTopic(a.scope.topicId), d = getDiscipline(a.scope.disciplineId);
    if(tp) L.push(`Prioridade do tópico: ${PriorityEngine.text(tp.priority)}`);
    if(d) L.push(`Prioridade da disciplina: ${PriorityEngine.text(d.priority)}`);
  } else {
    if(a.scope.type !== 'discipline' && pr.total > 0){
      L.push('Tempo por prioridade das disciplinas:');
      pr.byDisc.slice().reverse().filter(r => r.count || r.minutes).forEach(r => bullet(`${PriorityEngine.text(r.p)}: ${fmtDuration(r.minutes)} (${safePct(r.pct)})`));
    }
    if(a.scope.type === 'discipline'){
      const d = getDiscipline(a.scope.disciplineId);
      if(d) L.push(`Prioridade da disciplina: ${PriorityEngine.text(d.priority)}`);
    }
    if(pr.topicTotal > 0){
      L.push('Tempo por prioridade dos tópicos (estudos com tópico):');
      pr.byTopic.slice().reverse().filter(r => r.count || r.minutes).forEach(r => bullet(`${PriorityEngine.text(r.p)}: ${fmtDuration(r.minutes)} (${safePct(r.pct)})`));
    }
    if(pr.highDiscNoTime.length) L.push(`Prioridade alta sem estudo no período: ${pr.highDiscNoTime.map(d => d.name).join(', ')}`);
    if(pr.total === 0 && !pr.highDiscNoTime.length) L.push('Sem estudos no período para comparar prioridades.');
  }

  section('TEMPO');
  const t = a.totals;
  L.push(`Tempo total: ${fmtDuration(t.minutes)}`);
  L.push(`Estudos registrados: ${t.count}`);
  L.push(`Dias com estudo: ${t.activeDays} de ${a.days}`);
  L.push(`Média por dia do período: ${fmtDuration(t.avgPerDay)}`);
  L.push(`Média por dia com estudo: ${fmtDuration(t.avgPerActiveDay)}`);
  L.push(`Duração média por estudo: ${fmtDuration(t.avgSession)}`);
  L.push(a.rest.count > 0
    ? `Descansos (fora do tempo de estudo): ${fmtDuration(a.rest.minutes)} em ${plural(a.rest.count, 'descanso', 'descansos')}, média de ${fmtDurationWords(a.rest.avg)}`
    : 'Descansos: nenhum registrado no período');
  const cmp = a.previousComparison;
  L.push(cmp.available
    ? `Período anterior equivalente (${fmtDateBR(dateToISO(cmp.prevRange.start))} a ${fmtDateBR(dateToISO(cmp.prevRange.end))}): ${fmtDuration(cmp.prev.minutes)}${isNum(cmp.minutesDelta) ? ` (${cmp.minutesDelta >= 0 ? '+' : '−'}${fmtNumber(Math.abs(cmp.minutesDelta), 0)}%)` : ''}`
    : 'Período anterior equivalente: sem registros para comparar.');
  if(t.count){
    L.push('Por dia da semana:');
    a.byWeekday.forEach(x => bullet(`${x.label}: ${fmtDuration(x.minutes)}`));
    const typed = a.byType.filter(x => x.count > 0);
    if(typed.length){
      L.push('Por tipo de estudo:');
      typed.forEach(x => bullet(`${x.label}: ${x.count} (${safePct(x.pct)})`));
    }
    if(a.difficulty.avg !== null) L.push(`Dificuldade percebida média: ${fmtNumber(a.difficulty.avg, 1)}/5 (${plural(a.difficulty.count, 'registro', 'registros')})`);
  }

  section('PLANEJAMENTO');
  const pa = a.planAdherence;
  if(!pa.applicable) L.push('O plano semanal é definido por disciplina; não se aplica a um tópico isolado.');
  else if(!pa.hasPlan) L.push('Sem tempo planejado para este período.');
  else {
    L.push(`Planejado: ${fmtDuration(pa.planned)}`);
    L.push(`Estudado no total: ${fmtDuration(pa.realized)}`);
    L.push(`Plano cumprido: ${safePct(pa.pct)} (${fmtDuration(pa.counted)} dentro do planejado para cada disciplina)`);
    if(pa.extra >= 1) L.push(`Além do plano: ${fmtDuration(pa.extra)} (não entra no plano cumprido)`);
    L.push('Observação: semanas cortadas pelo período contam proporcionalmente.');
  }

  section('DISCIPLINAS');
  const discRows = a.scope.type === 'topic' ? [getDiscipline(a.scope.disciplineId)].filter(Boolean) : AnalyticsScope.disciplines(a.scope);
  const extraIds = a.byDiscipline.map(x => x.key).filter(id => !discRows.some(d => d.id === id));
  const discLines = discRows.map(d => ({ d, id:d.id, name:d.name }))
    .concat(extraIds.map(id => ({ d:getDiscipline(id), id, name:disciplineName(id) })));
  if(!discLines.length) L.push('Nenhuma disciplina neste escopo.');
  discLines.map(x => ({ ...x, g: a.byDiscipline.find(r => r.key === x.id), p: pa.perDiscipline.find(r => r.disciplineId === x.id) }))
    .sort((x,y) => ((y.g ? y.g.minutes : 0) - (x.g ? x.g.minutes : 0)) || x.name.localeCompare(y.name, 'pt-BR'))
    .forEach(x => {
      const parts = [];
      if(x.d) parts.push(`${AREA_TERM}: ${areaNameOf(x.d)}`, `prioridade ${PriorityEngine.text(x.d.priority)}`);
      if(x.d && x.d.archived) parts.push('arquivada');
      parts.push(`tempo ${x.g ? `${fmtDuration(x.g.minutes)} (${safePct(x.g.pct)})` : '0min'}`);
      if(x.p && x.p.planned > 0) parts.push(`plano ${fmtDuration(x.p.realized)} de ${fmtDuration(x.p.planned)} (${safePct(x.p.pct)})`);
      const prog = x.d ? a.content.perDiscipline.find(r => r.discipline.id === x.id) : null;
      if(prog && a.scope.type !== 'topic') parts.push(`conteúdo estudado ${prog.covered}/${prog.total}`);
      bullet(`${x.name} — ${parts.join(' · ')}`);
    });

  section('TÓPICOS');
  const topicsInScope = AnalyticsScope.topics(a.scope);
  if(!topicsInScope.length) L.push('Nenhum tópico cadastrado neste escopo.');
  else {
    const mins = new Map(a.byTopic.map(r => [r.key, r.minutes]));
    const ordered = topicsInScope.slice().sort((x,y) => ((mins.get(y.id) || 0) - (mins.get(x.id) || 0)) ||
      (PriorityEngine.clamp(y.priority) - PriorityEngine.clamp(x.priority)) || sortByName(x, y));
    const limit = 40;
    ordered.slice(0, limit).forEach(tp => {
      const parts = [a.scope.type === 'discipline' || a.scope.type === 'topic' ? null : disciplineName(tp.disciplineId),
        `prioridade ${PriorityEngine.text(tp.priority)}`, TOPIC_STATUS_LABEL[a.content.status.get(tp.id) || topicStatus(tp)],
        tp.masteryLevel ? `consolidação estimada ${tp.masteryLevel} de 5` : null,
        `tempo no período ${fmtDuration(mins.get(tp.id) || 0)}`].filter(Boolean);
      bullet(`${tp.name} — ${parts.join(' · ')}`);
    });
    if(ordered.length > limit) L.push(`(e mais ${ordered.length - limit} tópicos sem tempo no período)`);
    const noTopic = mins.get('__none__');
    if(noTopic) L.push(`Estudos sem tópico definido: ${fmtDuration(noTopic)}`);
  }

  section('REVISÕES');
  const r = a.reviews;
  L.push(`Concluídas no período: ${r.completed}`);
  L.push(`Marcadas hoje para dentro do período: ${r.scheduled}`);
  L.push(`Atrasadas agora: ${r.overdueNow}`);
  L.push(`Previstas para os próximos 7 dias: ${r.upcoming.length}`);
  if(r.completed){
    L.push('Resultados:');
    r.outcomes.forEach(o => bullet(`${o.label}: ${o.count}`));
  }
  if(r.byMethod.length){
    L.push('Como você revisou:');
    r.byMethod.forEach(m => bullet(`${m.label}: ${m.used}×`));
  }
  if(r.forgetful.length) L.push(`Esquecidos com mais frequência: ${r.forgetful.map(tp => `${tp.name} (${tp.reviewFailures}×)`).join(', ')}`);
  if(r.avgMastery !== null) L.push(`Consolidação estimada (média dos tópicos em revisão): ${fmtNumber(r.avgMastery, 1)} de 5`);

  section('PRAZOS');
  const dls = a.deadlines;
  if(!dls.all.length) L.push('Nenhum prazo neste escopo.');
  else {
    const line = (dl, rel) => {
      const info = deadlineTypeInfo(dl.type);
      const where = dl.disciplineId ? disciplineName(dl.disciplineId) + (dl.topicId && getTopic(dl.topicId) ? ' › ' + getTopic(dl.topicId).name : '') : 'sem disciplina';
      return `${dl.title} — ${info.label} · ${fmtDateBR(dl.date)} (${DeadlineEngine.dueText(dl).toLowerCase()}) · prioridade ${PriorityEngine.text(dl.priority)} · ${deadlineStatusLabel(dl.status)} · ${where}${dl.startDate ? ` · início ${fmtDateBR(dl.startDate)}` : ''}${rel === 'discipline' ? ' · prazo da disciplina' : ''}`;
    };
    if(dls.open.length){ L.push('Em aberto:'); dls.open.forEach(x => bullet(line(x.dl, x.relation))); }
    if(dls.completedInRange.length){ L.push('Concluídos no período:'); dls.completedInRange.forEach(dl => bullet(line(dl))); }
    const doneOther = dls.all.filter(dl => DeadlineEngine.isDone(dl) && !dls.completedInRange.includes(dl)).length;
    if(doneOther) L.push(`Outros prazos concluídos (fora do período): ${doneOther}`);
  }

  section('PONTOS DE ATENÇÃO');
  const att = a.warnings.slice();
  a.attention.forEach(x => att.push(`${x.topic.name} (${x.discipline ? x.discipline.name : ''}): ${x.reasons.join('; ')}`));
  if(att.length) att.forEach(bullet); else L.push('Nenhum ponto de atenção.');

  section('PONTOS POSITIVOS');
  if(a.positives.length) a.positives.forEach(bullet); else L.push('Nenhum destaque positivo calculado para este período.');

  section('INSIGHTS');
  a.insights.forEach(bullet);

  section('INFORMAÇÕES');
  bullet(`Relatório gerado localmente pelo Ciclo ${APP_VERSION}. Nenhum dado foi enviado para a internet.`);
  bullet('Tempo, estudos e revisões concluídas consideram apenas o escopo e o período acima. O foco define o resumo e os destaques; as demais seções continuam completas.');
  bullet('Conteúdo, consolidação, revisões atrasadas e prazos em aberto mostram a situação no momento da geração.');
  bullet('Prioridades usam os valores atuais de cada disciplina, tópico e prazo.');
  bullet('Comentários dos estudos, orientações e anotações pessoais dos prazos não são incluídos.');
  bullet('As observações descrevem fatos dos registros; não indicam causas.');
  return L.join('\n') + '\n';
}

async function downloadReport(a){
  const data = a || AnalyticsEngine.query(ui.analyticsQuery || defaultAnalyticsQuery());
  try {
    const name = reportFilename(data);
    Backup.download(name, '\ufeff' + buildStudyReportText(data), 'text/plain;charset=utf-8');
    toast(name, 'ok', { title:'Relatório baixado' });
  } catch(err){
    console.error('Falha ao gerar o relatório:', err);
    toast('Tente novamente. Se continuar, use "Copiar resumo".', 'err', { title:'Não foi possível gerar o relatório' });
  }
}

async function copySummary(a){
  const text = buildSummaryText(a || AnalyticsEngine.query(ui.analyticsQuery || defaultAnalyticsQuery()));
  if(await copyToClipboard(text)){
    toast('Cole onde quiser: anotações, mensagem ou planilha.', 'ok', { title:'Resumo copiado' });
  } else {
    openModal(close => ({
      title:'Resumo do período',
      content: h('div',
        h('p', { class:'modal-sub', text:'Não foi possível copiar automaticamente. Selecione o texto abaixo e copie.' }),
        (() => { const ta = h('textarea', { style:'min-height:240px', readonly:true, 'aria-label':'Resumo do período' }); ta.value = text; setTimeout(() => { ta.focus(); ta.select(); }, 60); return ta; })()),
      actions:[ h('button', { class:'btn ghost', type:'button', text:'Fechar', onclick:() => close() }) ]
    }), { size:'wide' });
  }
}

/* =========================================================================
   TELA: HISTÓRICO
   ========================================================================= */
function renderHistory(){
  const root = $('#history-body');
  const f = ui.history;
  if(!state.sessions.length){
    mount(root, h('section', { class:'quiet-empty' }, emptyState('Nenhum estudo registrado ainda',
      '"Começar a estudar" liga o cronômetro. "Registrar estudo" guarda algo que você já estudou.',
      h('div', { class:'empty-actions' },
        h('button', { class:'btn primary', type:'button', onclick:() => openQuickStart() }, icon('i-play'), 'Começar a estudar'),
        h('button', { class:'btn ghost', type:'button', text:'Registrar estudo', onclick:() => openRegisterModal() })))));
    return;
  }
  /* v6.2 — busca só nos estudos registrados (disciplina, área, tópico,
     comentário), sem acento; os filtros continuam no painel. */
  const tableHolder = h('div', { id:'history-table-card' });
  let t = null;
  const search = contextSearch({ id:'hf-search', fk:'hf-search', value:f.search, holder:tableHolder,
    placeholder:'Buscar nos estudos feitos…', label:'Buscar nos estudos feitos',
    onInput:(v) => { f.search = v; ui.historyLimit = 150; clearTimeout(t); t = setTimeout(renderHistoryTable, 60); } });
  const active = historyActiveFilters();
  const filterBtn = h('button', { class:'btn ghost', type:'button', 'aria-haspopup':'dialog', onclick:openHistoryFilters },
    'Filtros', active.length ? h('span', { class:'btn-count', text:String(active.length) }) : null);
  mount(root, h('div', { class:'narrow-screen' },
    h('div', { class:'search-bar' }, search.node, filterBtn),
    active.length ? h('div', { class:'filter-chips', role:'group', 'aria-label':'Filtros ativos' },
      active.map(x => h('button', { class:'filter-chip', type:'button', 'aria-label':`Remover filtro ${x.label}`,
        onclick:() => { x.clear(); ui.historyLimit = 150; renderHistory(); } }, h('span', { text:x.label }), icon('i-close', 'btn-icon'))),
      h('button', { class:'linkbtn muted', type:'button', text:'limpar tudo', onclick:() => { clearHistoryFilters(); renderHistory(); } })) : null,
    tableHolder));
  renderHistoryTable();
}

/** Filtros ativos em linguagem simples, cada um com seu jeito de sair. */
function historyActiveFilters(){
  const f = ui.history, out = [];
  if(f.areaId){ const a = getArea(f.areaId); out.push({ label: a ? a.name : AREA_TERM, clear:() => { f.areaId = ''; f.disciplineId = ''; f.topicId = ''; } }); }
  if(f.disciplineId){ out.push({ label: disciplineName(f.disciplineId), clear:() => { f.disciplineId = ''; f.topicId = ''; } }); }
  if(f.topicId){ const tp = getTopic(f.topicId); out.push({ label: tp ? tp.name : 'Tópico', clear:() => { f.topicId = ''; } }); }
  if(f.period && f.period !== 'todos'){
    const labels = { semana:'Esta semana', mes:'Este mês', analises:'Período da última análise' };
    out.push({ label: labels[f.period] || f.period, clear:() => { f.period = 'todos'; } });
  }
  if(f.type) out.push({ label: sessionTypeLabel(f.type), clear:() => { f.type = ''; } });
  if(f.difficulty){ const d = difficultyInfo(Number(f.difficulty)); out.push({ label: d ? 'Dificuldade: ' + d.label.toLowerCase() : 'Dificuldade', clear:() => { f.difficulty = ''; } }); }
  return out;
}
function clearHistoryFilters(){
  Object.assign(ui.history, { areaId:'', disciplineId:'', topicId:'', period:'todos', type:'', difficulty:'' });
  ui.historyLimit = 150;
}

/** Filtros completos num painel: a tela principal não vira formulário. */
function openHistoryFilters(){
  const f = ui.history;
  const draft = { areaId:f.areaId, disciplineId:f.disciplineId, topicId:f.topicId, period:f.period, type:f.type, difficulty:f.difficulty };
  const body = h('div', { class:'filters-form' });
  const draw = () => {
    const areaOpts = [{ value:'', label:'Todas' }].concat(state.areas.slice().sort(sortByName).map(a => ({ value:a.id, label:a.name })));
    const discOpts = [{ value:'', label:'Todas' }].concat(
      (draft.areaId ? state.disciplines.filter(d => d.areaId === draft.areaId) : state.disciplines).slice().sort(sortByName)
        .map(d => ({ value:d.id, label:d.name + (d.archived ? ' (arquivada)' : '') })));
    const topicOpts = [{ value:'', label: draft.disciplineId ? 'Todos' : 'Escolha uma disciplina primeiro' }].concat(
      (draft.disciplineId ? topicsOf(draft.disciplineId, true) : []).map(t => ({ value:t.id, label:t.name })));
    mount(body,
      selectField('hf-area', AREA_TERM, areaOpts, draft.areaId, e => { draft.areaId = e.target.value; draft.disciplineId = ''; draft.topicId = ''; draw(); $('#hf-area') && $('#hf-area').focus(); }),
      selectField('hf-disc', 'Disciplina', discOpts, draft.disciplineId, e => { draft.disciplineId = e.target.value; draft.topicId = ''; draw(); $('#hf-disc') && $('#hf-disc').focus(); }),
      selectField('hf-topic', 'Tópico', topicOpts, draft.topicId, e => { draft.topicId = e.target.value; }),
      selectField('hf-period', 'Período', [
        { value:'todos', label:'Todo o histórico' }, { value:'semana', label:'Esta semana' }, { value:'mes', label:'Este mês' },
        { value:'analises', label:'Período da última análise' }
      ], draft.period, e => { draft.period = e.target.value; }),
      selectField('hf-type', 'Tipo de estudo', [{ value:'', label:'Todos' }].concat(SESSION_TYPES.map(t => ({ value:t.v, label:t.label }))), draft.type, e => { draft.type = e.target.value; }),
      selectField('hf-diff', 'Dificuldade', [{ value:'', label:'Todas' }].concat(DIFFICULTIES.map(d => ({ value:String(d.v), label:d.label }))), draft.difficulty, e => { draft.difficulty = e.target.value; }));
    const topicSel = $('#hf-topic', body); if(topicSel) topicSel.disabled = !draft.disciplineId;
  };
  draw();
  const wrap = h('div', null,
    h('p', { class:'drawer-intro', text:'Os filtros se combinam. A busca continua valendo junto com eles.' }),
    body,
    h('div', { class:'row auto', style:'margin-top:18px' },
      h('button', { class:'btn primary', type:'button', text:'Aplicar filtros', onclick:() => {
        Object.assign(ui.history, draft); ui.historyLimit = 150; Drawer.close(); renderHistory();
      } }),
      h('button', { class:'btn ghost', type:'button', text:'Limpar', onclick:() => { clearHistoryFilters(); Drawer.close(); renderHistory(); } })));
  Drawer.open('Filtros do histórico', wrap);
}

function filteredSessions(){
  const f = ui.history;
  let list = state.sessions.slice();
  if(f.topicId) list = list.filter(s => s.topicId === f.topicId);
  else if(f.disciplineId) list = list.filter(s => s.disciplineId === f.disciplineId);
  else if(f.areaId){
    const ids = new Set(state.disciplines.filter(d => d.areaId === f.areaId).map(d => d.id));
    list = list.filter(s => ids.has(s.disciplineId));
  }
  if(f.period === 'semana'){ const r = { start:startOfWeek(today()), end:endOfWeek(today()) }; const a = dateToISO(r.start), b = dateToISO(r.end); list = list.filter(s => s.date >= a && s.date <= b); }
  else if(f.period === 'mes'){ const a = dateToISO(startOfMonth(today())), b = dateToISO(endOfMonth(today())); list = list.filter(s => s.date >= a && s.date <= b); }
  else if(f.period === 'analises' && ui.period){ const a = dateToISO(ui.period.start), b = dateToISO(ui.period.end); list = list.filter(s => s.date >= a && s.date <= b); }
  if(f.type) list = list.filter(s => s.type === f.type);
  if(f.difficulty) list = list.filter(s => String(s.difficulty) === f.difficulty);
  const terms = normalizeText(f.search).split(' ').filter(Boolean);
  if(terms.length){
    const hay = historySearchIndex();
    list = list.filter(s => matchesTerms(hay.get(s.id) || '', terms));
  }
  return list.sort((a,b) => b.date.localeCompare(a.date) || str(b.createdAt).localeCompare(str(a.createdAt)));
}

/* v6.2 — texto pesquisável de cada estudo, normalizado UMA vez por geração dos
   dados (digitar não renormaliza milhares de registros a cada tecla). */
let historyHay = { key:null, map:new Map() };
function historySearchIndex(){
  const key = (state.idx.gen || 0) + ':' + state.sessions.length;
  if(historyHay.key === key) return historyHay.map;
  const map = new Map();
  state.sessions.forEach(s => {
    const d = getDiscipline(s.disciplineId);
    const area = d && d.areaId ? getArea(d.areaId) : null;
    map.set(s.id, normalizeText([d ? d.name : '', area ? area.name : '', topicLabelOf(s), str(s.comment)].join(' ')));
  });
  historyHay = { key, map };
  return map;
}

/** Leitura cronológica: dia → sessões. Clique numa sessão para editar. */
function renderHistoryTable(){
  const holder = $('#history-table-card');
  if(!holder) return;
  const list = filteredSessions();
  clear(holder);
  holder.append(h('p', { class:'list-summary', role:'status', 'aria-live':'polite' },
    h('strong', { text: plural(list.length, 'estudo', 'estudos') }), ` · ${fmtDuration(sum(list, s => s.minutes))}`));
  if(!list.length){
    const f = ui.history;
    holder.append(h('div', { class:'coll-empty' },
      h('p', { text: f.search.trim() ? 'Nenhum estudo encontrado com esta busca' + (historyActiveFilters().length ? ' e estes filtros.' : '.') : 'Nenhum estudo corresponde a estes filtros.' }),
      f.search.trim() ? h('button', { class:'btn ghost sm', type:'button', text:'Limpar busca', onclick:() => {
        const i = $('#hf-search'); if(i){ i.value = ''; i.dispatchEvent(new Event('input')); i.focus(); } } }) : null));
    return;
  }
  const shown = list.slice(0, ui.historyLimit);
  const tISO = todayISO(), yISO = addDaysISO(tISO, -1);
  const WD = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  const dayLabel = iso => {
    if(iso === tISO) return 'Hoje';
    if(iso === yISO) return 'Ontem';
    const d = parseISO(iso);
    return d ? `${capFirst(WD[d.getDay()])}, ${d.getDate()} de ${MONTHS[d.getMonth()]}${d.getFullYear() !== today().getFullYear() ? ' de ' + d.getFullYear() : ''}` : iso;
  };
  const byDay = new Map();
  shown.forEach(s => { if(!byDay.has(s.date)) byDay.set(s.date, []); byDay.get(s.date).push(s); });
  byDay.forEach((items, iso) => {
    holder.append(h('section', { class:'day-group', 'aria-label': dayLabel(iso) },
      h('h3', { class:'day-head' }, h('span', { text: dayLabel(iso) }), h('span', { class:'day-head-s num', text: fmtDuration(sum(items, s => s.minutes)) })),
      h('ul', { class:'line-list' }, items.map(s => {
        const topic = topicLabelOf(s);
        const diff = difficultyInfo(s.difficulty);
        const sub = [topic || null, s.type ? sessionTypeLabel(s.type) : null, diff ? diff.label : null, reviewOutcomeLabel(s.reviewOutcome)].filter(Boolean).join(' · ');
        return h('li', { class:'line' },
          h('button', { class:'line-main', type:'button', 'aria-label':`${disciplineName(s.disciplineId)}${topic ? ', ' + topic : ''}, ${fmtDuration(s.minutes)}. Editar estudo`,
              onclick:() => openEditSessionModal(s.id) },
            h('span', { class:'line-t', text: disciplineName(s.disciplineId) }),
            sub ? h('span', { class:'line-s', text: sub }) : null,
            s.comment ? h('span', { class:'line-why', text: '“' + s.comment + '”' }) : null),
          h('span', { class:'line-v num', text: fmtDuration(s.minutes) }));
      }))));
  });
  if(list.length > shown.length){
    holder.append(h('div', { class:'panel-foot' },
      h('button', { class:'btn ghost', type:'button', text:`Mostrar mais (${list.length - shown.length} restantes)`,
        onclick:() => { ui.historyLimit += 150; renderHistoryTable(); } })));
  }
}

/**
 * Detalhe + edição de um estudo. Mostra o horário registrado, o tempo estudado
 * e os descansos — e deixa corrigir cada um. Descanso nunca é somado ao tempo
 * de estudo; mudar a data desloca os horários gravados pelo mesmo número de dias.
 */
function openEditSessionModal(id){
  const s = state.sessions.find(x => x.id === id);
  if(!s) return;
  /* v6.5 — MODO HORÁRIO × MODO DURAÇÃO.
     O estudo abre em modo horário quando tem início e fim gravados, a conta
     fecha com a duração e todos os descansos têm horário. Senão, abre em modo
     duração. Sem mexer em nada do tempo, salvar não altera um segundo do que
     está gravado. Mexendo, o que é gravado é coerente: ou horário (e a
     duração sai dele), ou só a duração (e o horário antigo deixa de existir —
     a pessoa é avisada antes de salvar). */
  const clockInfo = TimeRules.clockInfo(s);
  const hasClock = clockInfo.mode === 'clock';
  const clockMode = hasClock && clockInfo.consistent && clockInfo.allBreaksTimed;
  const rawClock = hasClock ? `${fmtClockOfDay(s.startedAt)} → ${fmtClockOfDay(s.endedAt)}` : '';
  const storedBreaks = sanitizeBreaks(breaksOf(s));

  openModal(close => {
    let type = s.type, difficulty = s.difficulty, outcome = s.reviewOutcome;
    const comment = commentField({ id:'es-comment', value:s.comment });      // já tem comentário? o campo abre à mostra

    const when = studyWhenFields({ idPrefix:'es', initial:{
      date: s.date, mode: clockMode ? 'time' : 'duration',
      start: clockMode ? fmtClockOfDay(s.startedAt) : '', end: clockMode ? fmtClockOfDay(s.endedAt) : '',
      minutes: s.minutes, breaks: storedBreaks,
      startedAt: clockMode ? s.startedAt : null, endedAt: clockMode ? s.endedAt : null,
      clockLabel: clockMode ? rawClock : ''
    } });
    // horário gravado que não fecha com a duração (edições anteriores à v6.5): dito com todas as letras
    const staleClock = (hasClock && !clockMode)
      ? h('p', { class:'hint clock-note', text: clockInfo.consistent
          ? `Horário gravado: ${rawClock}. Os descansos deste estudo não têm horário, então ele é editado pela duração.`
          : `O horário gravado (${rawClock}) não fecha com a duração deste estudo. Vale a duração; se você alterar o tempo, esse horário deixa de ser guardado.` })
      : null;

    // v6.3: disciplina e tópico atuais aparecem mesmo se foram arquivados — antes
    // sumiam da lista e salvar a edição desligava o estudo do tópico sem aviso.
    const target = studyTargetFields({ close, idPrefix:'es', discId:s.disciplineId, topicId:s.topicId || '', includeArchived:true,
      allowNewTopic:false, onChange: () => renderOutcome() });
    const typePick = studyTypePicker({ id:'es-type', value:type, onChange: v => { type = v; renderOutcome(); } });
    const legacyTopic = (!s.topicId && str(s.legacyTopicText)) ? str(s.legacyTopicText) : null;

    const outcomeField = h('div', { class:'field', hidden:true });
    const outcomeHint = h('p', { class:'hint' });
    /** O que mudar este resultado faz com a agenda do tópico — dito antes de salvar. */
    function outcomeHintText(){
      const topicId = target.topicId;
      if(!topicId) return '';
      if(topicId !== s.topicId) return 'Ao salvar, esta revisão passa a contar para o tópico escolhido.';
      const latest = TopicReconciler.latestReview(sessionsOfTopic(topicId));
      return (latest && latest.id === s.id)
        ? 'Esta é a revisão mais recente do tópico: mudar o resultado recalcula a próxima revisão.'
        : 'O tópico tem uma revisão mais recente: mudar aqui corrige o histórico, sem alterar a próxima revisão.';
    }
    function renderOutcome(){
      const show = type === 'revisao' && !!target.topicId;
      outcomeField.hidden = !show;
      if(!show) return;
      outcomeHint.textContent = outcomeHintText();
      if(outcomeField.firstChild) return;
      outcomeField.append(h('label', { text:'Resultado da revisão' }),
        pillGroup(REVIEW_OUTCOMES.map(x => ({ value:x.v, label:x.label })), outcome, v => { outcome = v; }, 'Resultado da revisão'),
        outcomeHint);
    }

    const how = howGroup({ id:'es-g-how', type:typePick.node,
      difficulty: difficultyField('es', difficulty, v => { difficulty = v; }), outcome:outcomeField, comment:comment.node });
    // v6.4.1 — a mesma composição do registro: quando e o quê lado a lado; "Como foi" depois.
    const body = h('div', { class:'rm' },
      h('div', { class:'rm-grid' },
        h('section', { class:'rm-group rm-when', 'aria-labelledby':'es-g-when' },
          h('h4', { class:'rm-group-t', id:'es-g-when', text:'Quando' }),
          when.node,
          staleClock),
        h('section', { class:'rm-group rm-what', 'aria-labelledby':'es-g-what' },
          h('h4', { class:'rm-group-t', id:'es-g-what', text:'O que você estudou' }),
          target.node,
          legacyTopic ? h('p', { class:'hint', text:`Anotado na época como “${legacyTopic}”.` }) : null),
        how.node));
    renderOutcome();

    /** Desloca um instante gravado por `days` dias, mantendo a hora local (sem deslize de fuso). */
    const shiftISO = (iso, days) => {
      const t = validInstant(iso);
      if(t === null || !days) return iso || null;
      const d = new Date(t);
      d.setDate(d.getDate() + days);
      return d.toISOString();
    };

    /** O que excluir este estudo faz com o tópico dele — dito na pergunta, antes de remover. */
    function removalNote(){
      const cur = state.sessions.find(x => x.id === id);
      const topic = cur && cur.topicId ? getTopic(cur.topicId) : null;
      if(!topic) return '';
      const before = sessionsOfTopic(topic.id);
      const rec = TopicReconciler.afterCorrection(topic, before, before.filter(x => x.id !== id), reviewContextOf(topic));
      if(rec.effect === 'reset') return ` Era o único estudo de ${topic.name}: o tópico volta a "não iniciado", sem revisão marcada.`;
      if(rec.effect === 'rescheduled' || rec.effect === 'reanchored'){
        return rec.topic.reviewDueDate ? ` A próxima revisão de ${topic.name} passa a ser ${fmtRelativeFuture(rec.topic.reviewDueDate)}.` : ` A revisão de ${topic.name} é recalculada.`;
      }
      return '';
    }

    return {
      title:'Editar estudo',
      content: body,
      actions:[
        h('button', { class:'linkbtn danger', type:'button', text:'remover estudo', onclick: async () => {
          const note = removalNote();
          close();
          const ok = await confirmModal('Remover este estudo do histórico?' + note, { confirmLabel:'Remover' });
          if(ok) await deleteSession(id);
        } }),
        h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }),
        h('button', { class:'btn primary', type:'button', text:'Salvar', onclick: once(async () => {
          const w = when.evaluate();
          if(!w.complete){
            if(w.errorEl){ if('value' in w.errorEl) w.errorEl.setAttribute('aria-invalid', 'true'); w.errorEl.focus(); }
            toast(w.error || w.missing, 'err', w.errorTitle ? { title:w.errorTitle } : undefined);
            return;
          }
          const discId = await target.ensure();
          if(!discId) return;

          /* Campos de tempo. Três casos, do mais conservador ao mais amplo:
             1. nada do tempo mudou            → vão exatamente os valores gravados;
             2. só a data mudou                → os instantes gravados andam o mesmo nº de dias;
             3. horário/duração/descansos mudaram → o que o formulário calculou. */
          let time;
          if(w.pristine && !when.dateChanged()){
            time = { minutes:s.minutes, startedAt:s.startedAt, endedAt:s.endedAt, breaks:s.breaks };
          } else if(w.pristine){
            const from = parseISO(s.date), to = parseISO(w.date);
            const days = (from && to) ? diffDays(to, from) : 0;
            time = { minutes:s.minutes, startedAt: shiftISO(s.startedAt, days), endedAt: shiftISO(s.endedAt, days),
              breaks: breaksOf(s).map(b => Object.assign({}, b, { startedAt: shiftISO(b.startedAt, days), endedAt: shiftISO(b.endedAt, days) })) };
          } else {
            if(w.needsConfirm && !(await confirmLongEdit(w.minutes))) return;
            time = { minutes:w.minutes, startedAt:w.startedAt, endedAt:w.endedAt, breaks:w.breaks };
          }
          const topicId = target.topicId || null;
          const changes = {
            disciplineId: discId, topicId, date: w.date,
            minutes: time.minutes, startedAt: time.startedAt || null, endedAt: time.endedAt || null, breaks: time.breaks,
            type, difficulty, comment: comment.value,
            // sem tópico não há resultado a editar: um registro antigo sem tópico mantém o que tinha
            reviewOutcome: type !== 'revisao' ? null : (topicId ? outcome : (s.reviewOutcome || null))
          };
          let res = await updateSession(id, changes, { base:s });
          if(!res.ok && res.reason === 'conflict'){
            const choice = await askConflict(close, 'este estudo');
            if(choice === 'back') return;
            if(choice === 'discard'){ close(); await safeRefresh(); toast('Os dados mostrados são os mais recentes.', 'info', { title:'Edição descartada' }); return; }
            res = await updateSession(id, changes, { base:s, force:true });
          }
          if(res.ok || res.reason === 'missing') close();          // falhou: a edição continua aberta, com tudo preenchido
        }) })
      ]
    };
  }, { size:'study' });
}

/** Estudo muito longo numa edição: pergunta antes de gravar (não bloqueia). */
function confirmLongEdit(minutes){
  return new Promise(resolve => {
    // A pergunta abre como subtela do próprio formulário: o que foi digitado continua lá.
    const close = modalCloser;
    if(typeof close !== 'function' || !close.push){ resolve(true); return; }
    let done = false;
    const finish = v => { if(done) return; done = true; close.pop(); resolve(v); };
    close.push({
      title:'Confira a duração',
      content: h('p', { class:'modal-sub', style:'margin-bottom:0', text:`São ${fmtDuration(minutes)} de estudo neste registro. Está certo?` }),
      actions:[
        h('button', { class:'btn ghost', type:'button', text:'Voltar e corrigir', onclick:() => finish(false) }),
        h('button', { class:'btn primary', type:'button', text:'Está certo, salvar', onclick:() => finish(true) })
      ],
      onEsc:() => finish(false)
    });
  });
}

/* =========================================================================
   TELA: DADOS
   ========================================================================= */
/** Exporta o backup completo e confirma com um aviso claro. */
async function exportBackupWithFeedback(){
  try {
    await Backup.exportJSON();
  } catch(err){
    console.error('Falha ao exportar o backup:', err);
    toast('Tente novamente. Seus dados continuam intactos.', 'err', { title:'Não foi possível gerar o backup' });
    return;
  }
  await safeRefresh();
  /* v6.5 — o Ciclo sabe que GEROU o arquivo; ele não tem como saber se o
     navegador terminou de salvá-lo nem onde. O aviso diz exatamente isso. */
  toast(`ciclo_backup_${todayISO()}.json · confira se ele está nos seus downloads e guarde uma cópia fora deste aparelho.`, 'ok', { title:'Backup gerado', duration:6000 });
  if(TimerService.isActive) toast('Finalize o estudo e gere outro backup para incluí-lo.', 'warn', { title:'O estudo em andamento ainda não faz parte deste backup.', duration:7000 });
}
function exportCSVWithFeedback(){
  try { Backup.exportCSV(); }
  catch(err){ console.error(err); toast('Tente novamente.', 'err', { title:'Não foi possível exportar o CSV' }); return; }
  toast(`${plural(state.sessions.length, 'estudo', 'estudos')} em ciclo_sessoes_${todayISO()}.csv`, 'ok', { title:'Histórico exportado' });
}

/** v6.5 — diagnóstico somente leitura: as mesmas regras da restauração, sobre o que está no navegador. */
async function runIntegrityCheck(){
  let result, total = 0;
  try {
    const names = ['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines'];
    const lists = await Promise.all(names.map(n => DB.getAll(n)));
    const src = { settings: state.settings };
    names.forEach((n, i) => { src[n] = lists[i] || []; total += src[n].length; });
    result = IntegrityValidator.diagnose(src);
  } catch(err){
    console.error('Falha ao verificar a integridade:', err);
    toast('Tente novamente. Nada foi alterado.', 'err', { title:'Não foi possível verificar os dados' });
    return;
  }
  const items = result.repaired.concat(result.ignored, result.observations);
  openModal(close => ({
    title:'Verificação dos dados',
    content: h('div', { class:'restore' },
      result.fatal
        ? h('p', { class:'warn', text: result.fatal })
        : h('p', { class:'modal-sub', text: result.ok
            ? `${plural(total, 'registro conferido', 'registros conferidos')}. Nenhum problema encontrado.`
            : `${plural(total, 'registro conferido', 'registros conferidos')}. ${plural(items.length, 'ponto merece', 'pontos merecem')} atenção:` }),
      items.length ? h('ul', { class:'reasons' }, items.map(x => h('li', { text:x.text }))) : null,
      h('p', { class:'hint', text: result.ok
        ? 'A verificação confere identificadores, datas e vínculos entre áreas, disciplinas, tópicos, estudos, planos e prazos.'
        : 'Nada foi alterado: a verificação só lê. Seus estudos continuam contando normalmente. Se quiser aplicar os ajustes, gere um backup e restaure o arquivo — a restauração mostra cada ajuste antes de gravar.' })),
    actions:[ h('button', { class:'btn primary', type:'button', text:'Fechar', onclick:() => close() }) ]
  }), { size:'wide' });
}

function renderData(){
  const root = $('#data-body');
  const lastBackup = state.meta.lastBackupAt;
  // v6.5: dias de CALENDÁRIO no fuso local — um backup de ontem à noite é "há 1 dia", não "hoje"
  const daysSinceBackup = lastBackup ? daysSinceISO(localDateOfStamp(lastBackup)) : null;
  const backupText = daysSinceBackup !== null ? (daysSinceBackup <= 0 ? 'hoje' : `há ${plural(daysSinceBackup, 'dia', 'dias')}`) : null;
  const stale = daysSinceBackup === null || daysSinceBackup >= 14;

  const fileIn = h('input', { type:'file', id:'import-file', class:'sr-only', tabindex:'-1', accept:'application/json,.json' });
  fileIn.addEventListener('change', onImportFile);

  const main = h('section', { class:'focus-block compact', 'aria-labelledby':'dt-title' },
    h('p', { class:'tf-eyebrow', text:'Seus dados ficam neste navegador' }),
    h('h3', { class:'tf-title', id:'dt-title', text: backupText ? `Último backup gerado: ${backupText}` : 'Você ainda não fez nenhum backup' }),
    h('p', { class:'tf-reason' + (stale ? ' is-attention' : ''), text: stale
      ? 'Limpar os dados do navegador apaga o histórico. Um backup de vez em quando, guardado fora deste aparelho, evita isso.'
      : 'Nenhum dado de estudo sai daqui: sem conta, sem servidor, sem sincronização.' }),
    TimerService.isActive ? h('p', { class:'hint', text:'O estudo em andamento ainda não faz parte deste backup.' }) : null,
    h('div', { class:'tf-actions' },
      h('button', { class:'btn primary', type:'button', onclick: once(exportBackupWithFeedback) }, icon('i-data'), 'Fazer backup (.json)'),
      h('label', { class:'btn ghost', for:'import-file', tabindex:'0', role:'button',
        onkeydown:(e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileIn.click(); } } }, 'Restaurar backup'),
      fileIn,
      h('button', { class:'linkbtn muted', type:'button', text:'Onde meus dados ficam?', onclick:() => openHelpArticle('privacidade') })));

  const counts = [
    plural(state.areas.length, 'área', 'áreas'), plural(state.disciplines.length, 'disciplina', 'disciplinas'),
    plural(state.topics.length, 'tópico', 'tópicos'), plural(state.sessions.length, 'estudo registrado', 'estudos registrados'),
    plural(state.weeklyPlans.length, 'semana registrada', 'semanas registradas'), plural(state.deadlines.length, 'prazo', 'prazos')
  ];
  const more = h('section', { class:'list-block' },
    h('h3', { class:'block-label', text:'Outras opções' }),
    h('ul', { class:'line-list' },
      h('li', { class:'line' },
        h('div', { class:'line-main static' },
          h('span', { class:'line-t', text:'Exportar histórico (.csv)' }),
          h('span', { class:'line-s', text:'Só a lista de estudos, para abrir numa planilha.' })),
        h('button', { class:'btn ghost sm', type:'button', text:'Exportar', onclick: once(exportCSVWithFeedback) })),
      h('li', { class:'line' },
        h('div', { class:'line-main static' },
          h('span', { class:'line-t', text:'O que o backup contém' }),
          h('span', { class:'line-s', text: counts.join(' · ') + ', além de planos e configurações.' }))),
      h('li', { class:'line' },
        h('div', { class:'line-main static' },
          h('span', { class:'line-t', text:'Restauração segura' }),
          h('span', { class:'line-s', text:'O arquivo é conferido antes de gravar e você vê o que vai entrar. Nada é executado. Backups de versões anteriores, inclusive do Diário de Estudos, são aceitos.' }))),
      h('li', { class:'line' },
        h('div', { class:'line-main static' },
          h('span', { class:'line-t', text:'Verificar os dados' }),
          h('span', { class:'line-s', text:'Confere datas e vínculos do que está guardado aqui. Só lê; não altera nada.' })),
        h('button', { class:'btn ghost sm', type:'button', text:'Verificar', onclick: once(runIntegrityCheck) }))));

  const v2 = readV2Raw();
  const v2Block = v2 ? h('section', { class:'list-block' },
    h('h3', { class:'block-label', text:'Dados da versão anterior' }),
    h('p', { class:'block-note', text: state.meta.v2MigrationCompleted
      ? 'Seus dados da V2 já foram migrados. A cópia original continua guardada no navegador como segurança e não é usada pelo app.'
      : 'Foram encontrados dados da versão anterior neste navegador.' }),
    h('button', { class:'linkbtn danger', type:'button', text:'apagar cópia antiga da V2', onclick: async () => {
      const ok = await confirmModal('Apagar a cópia de segurança dos dados da V2 (localStorage)? Os dados já migrados continuam intactos. Esta ação não pode ser desfeita.', { confirmLabel:'Apagar cópia antiga' });
      if(!ok) return;
      try { localStorage.removeItem(V2_LS_KEY); toast('Cópia antiga removida.'); render(); }
      catch(_){ toast('Não foi possível remover.', 'err'); }
    } })) : null;

  const danger = h('details', { class:'disclosure danger-zone' },
    h('summary', null, h('span', { text:'Apagar todos os dados' })),
    h('div', { class:'disclosure-body' },
      h('p', { class:'block-note', text:'Apaga áreas, disciplinas, tópicos, estudos registrados, planos e prazos deste navegador. Não pode ser desfeito — faça um backup antes.' }),
      h('button', { class:'btn danger sm', type:'button', text:'Apagar todos os dados', onclick:wipeAll })));

  mount(root, h('div', { class:'narrow-screen' }, main, more, v2Block, danger));
}

/* ---------- RESTAURAR BACKUP (v6.5) ----------
   1. o arquivo é lido e conferido por inteiro, sem gravar nada;
   2. se não pode ser restaurado com segurança, a pessoa vê o motivo e os dados
      atuais ficam como estão;
   3. se há um estudo no cronômetro, ela decide o que fazer com ele ANTES;
   4. ela vê a prévia — o que entra, o que foi ajustado, o que fica de fora;
   5. só então tudo é trocado, numa única transação. A janela só fecha depois
      de gravar; se a gravação falhar, o banco continua exatamente como estava. */
const RESTORE_MAX_BYTES = 80 * 1024 * 1024;

function onImportFile(e){
  const input = e.target;
  const file = input.files && input.files[0];
  if(!file) return;
  const name = str(file.name);
  if(file.size > RESTORE_MAX_BYTES){
    input.value = '';
    restoreRefused({ title:'Arquivo grande demais', message:'Esse arquivo é muito maior que um backup do Ciclo. Confira se escolheu o arquivo certo.' });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => { input.value = ''; beginRestore(String(reader.result), name); };
  reader.onerror = () => { input.value = ''; restoreRefused({ title:'Não foi possível ler o arquivo', message:'O navegador não conseguiu abrir o arquivo escolhido. Tente selecioná-lo de novo.' }); };
  reader.readAsText(file);
}

function restoreRefused(err){
  openModal(close => ({
    title: err.title || 'Este backup não pode ser restaurado',
    content: h('div', { class:'restore' },
      h('p', { class:'modal-sub', text: err.message || 'O arquivo não pôde ser lido.' }),
      h('p', { class:'hint', text:'Nada foi alterado: seus dados continuam como estavam.' })),
    actions:[ h('button', { class:'btn primary', type:'button', text:'Entendi', onclick:() => close() }) ]
  }), { size:'narrow' });
}

function beginRestore(text, fileName){
  let parsed;
  try { parsed = Backup.parseBackup(text); }
  catch(err){
    if(!(err && err.fatal)) console.error('Falha inesperada ao conferir o backup:', err);
    restoreRefused(err && err.fatal ? err : { message:'O arquivo não pôde ser conferido. Ele pode estar danificado.' });
    return;
  }
  if(TimerService.isActive) askTimerBeforeRestore(parsed, fileName);
  else openRestorePreview(parsed, fileName, false);
}

/** Um estudo em andamento não está no banco nem no backup: a pessoa decide antes de trocar os dados. */
function askTimerBeforeRestore(parsed, fileName){
  const d = TimerService.data;
  const what = disciplineName(d.disciplineId) + ' · ' + fmtDurationWords(Math.max(1, Math.round(TimerService.getElapsed() / 60000)));
  openModal(close => ({
    title:'Há um estudo em andamento',
    content: h('div', { class:'restore' },
      h('p', { class:'modal-sub', text:`${what} no cronômetro.` }),
      h('p', { class:'hint', text:'Ele ainda não foi registrado, então não está nos dados atuais nem no backup. Restaurar troca todos os dados — decida antes o que fazer com esse tempo.' })),
    actions:[
      h('button', { class:'btn ghost', type:'button', text:'Cancelar a restauração', onclick:() => close() }),
      h('button', { class:'btn ghost', type:'button', text:'Descartar o tempo e restaurar', onclick:() => { close(); openRestorePreview(parsed, fileName, true); } }),
      h('button', { class:'btn primary', type:'button', text:'Finalizar o estudo primeiro', onclick:() => {
        close(); openFinishModal();
        toast('Depois de registrar, escolha o arquivo de backup de novo.', 'info', { title:'Restauração cancelada' });
      } })
    ]
  }), { dismissible:false });
}

function openRestorePreview(parsed, fileName, discardTimer){
  const d = parsed.data, r = parsed.report;
  const order = [['disciplines','Disciplinas'], ['topics','Tópicos'], ['sessions','Estudos registrados'], ['areas','Áreas'],
    ['deadlines','Prazos'], ['plans','Planos'], ['weeklyPlans','Semanas registradas']];
  const rows = order.map(([k, label]) => {
    const c = r.counts[k] || { found:0, accepted:0, repaired:0, ignored:0 };
    if(!c.found) return null;
    const bits = [c.accepted === c.found ? String(c.accepted) : `${c.accepted} de ${c.found}`];
    if(c.repaired) bits.push(c.repaired === 1 ? '1 ajustado' : `${c.repaired} ajustados`);
    if(c.ignored) bits.push(c.ignored === 1 ? '1 fica de fora' : `${c.ignored} ficam de fora`);
    return h('div', { class:'restore-row' }, h('span', { class:'restore-k', text:label }), h('span', { class:'restore-v num', text: bits.join(' · ') }));
  });
  const origin = [fileName || null,
    r.exportedAt ? `gerado em ${fmtDateBR(localDateOfStamp(r.exportedAt))} às ${fmtClockOfDay(r.exportedAt)}` : null,
    r.appVersion ? `Ciclo ${r.appVersion}` : null].filter(Boolean).join(' · ');
  const clean = !r.repaired.length && !r.ignored.length;
  const here = `${plural(state.disciplines.length, 'disciplina', 'disciplinas')}, ${plural(state.topics.length, 'tópico', 'tópicos')} e ${plural(state.sessions.length, 'estudo registrado', 'estudos registrados')}`;
  const hasData = state.disciplines.length || state.sessions.length || state.areas.length;
  let saving = false;

  openModal(close => {
    const errorBox = h('p', { class:'warn', role:'alert', hidden:true });
    const restoreBtn = h('button', { class:'btn danger', type:'button', text: hasData ? 'Substituir e restaurar' : 'Restaurar', onclick: async () => {
      if(saving) return;
      saving = true;
      restoreBtn.disabled = true; cancelBtn.disabled = true; restoreBtn.setAttribute('aria-busy', 'true'); restoreBtn.textContent = 'Restaurando…';
      errorBox.hidden = true;
      try {
        await Backup.restoreInto(d);
      } catch(err){
        // A transação é uma só: se algo falhou, NADA foi trocado.
        console.error('Falha ao restaurar o backup:', err);
        saving = false;
        restoreBtn.disabled = false; cancelBtn.disabled = false; restoreBtn.removeAttribute('aria-busy');
        restoreBtn.textContent = hasData ? 'Substituir e restaurar' : 'Restaurar';
        errorBox.textContent = 'Não foi possível restaurar. Nada foi alterado: seus dados continuam como estavam. Tente de novo; se continuar, pode faltar espaço no navegador.';
        errorBox.hidden = false;
        return;
      }
      // Gravado. Daqui em diante é só colocar a tela em dia.
      if(TimerService.isActive) TimerService.release(TimerService.data.runId);
      DataSync.announce('backup-restored');
      ui.planDraft = null;
      ui.reviewQueue = null;
      Nav.resetForNewData();        // v6.2: buscas, rolagens e níveis abertos apontavam para os dados antigos
      close();
      await safeRefresh();
      // v5.2.1 — a densidade vinda do backup só valia depois de recarregar a página.
      try { applySettingsEffects(); syncThemeControls(); } catch(err){ console.error(err); }
      renderTimerBar();
      toast(`${plural(d.disciplines.length, 'disciplina', 'disciplinas')} e ${plural(d.sessions.length, 'estudo', 'estudos')} de volta.`, 'ok', { title:'Backup restaurado' });
    } });
    const cancelBtn = h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => { if(!saving) close(); } });

    return {
      title:'Restaurar backup',
      content: h('div', { class:'restore' },
        origin ? h('p', { class:'modal-sub', text: origin }) : null,
        (r.notes || []).map(n => h('p', { class:'hint', text:n })),
        h('h4', { class:'restore-h', text:'O que vai entrar' }),
        h('div', { class:'restore-table' }, rows),
        clean ? h('p', { class:'hint restore-ok', text:'O arquivo foi conferido por inteiro: nenhum ajuste necessário.' }) : null,
        r.repaired.length ? h('details', { class:'advanced', open: r.repaired.length <= 4 },
          h('summary', null, `Ajustes que serão feitos (${sum(r.repaired, x => x.count)})`),
          h('div', { class:'advanced-body' }, h('ul', { class:'reasons' }, r.repaired.map(x => h('li', { text:x.text }))))) : null,
        r.ignored.length ? h('details', { class:'advanced', open: r.ignored.length <= 4 },
          h('summary', null, `O que fica de fora (${sum(r.ignored, x => x.count)})`),
          h('div', { class:'advanced-body' }, h('ul', { class:'reasons' }, r.ignored.map(x => h('li', { text:x.text }))))) : null,
        hasData ? h('p', { class:'warn', text:`Isto substitui tudo o que está neste navegador agora: ${here}.` }) : null,
        hasData ? h('p', { class:'hint' }, 'Quer guardar o que está aqui antes? ',
          h('button', { class:'linkbtn', type:'button', text:'Fazer backup dos dados atuais', onclick: once(exportBackupWithFeedback) })) : null,
        discardTimer ? h('p', { class:'hint', text:'O estudo que está no cronômetro será descartado ao restaurar.' }) : null,
        errorBox),
      actions:[ cancelBtn, restoreBtn ],
      focus: cancelBtn                 // ação destrutiva: o foco começa no caminho seguro, com a prévia no topo
    };
  }, { size:'wide', dismissible:false });
}

async function wipeAll(){
  const ok1 = await confirmModal('Apagar TODOS os dados deste navegador (disciplinas, tópicos, estudos registrados, planos e prazos)?', { confirmLabel:'Continuar' });
  if(!ok1) return;
  const ok2 = await confirmModal('Esta ação é definitiva e não pode ser desfeita. Tem certeza?', { confirmLabel:'Apagar tudo' });
  if(!ok2) return;
  try {
    await DB.clearStores(['areas','disciplines','topics','sessions','plans','weeklyPlans','deadlines']);
  } catch(err){
    console.error('Falha ao apagar os dados:', err);
    toast('Nada foi apagado. Tente novamente.', 'err', { title:'Não foi possível apagar os dados' });
    return;
  }
  if(TimerService.isActive) TimerService.release(TimerService.data.runId);
  DataSync.announce('data-wiped');
  ui.planDraft = null;
  ui.reviewQueue = null;
  Nav.resetForNewData();
  await safeRefresh();
  renderTimerBar();
  toast('Todos os dados foram apagados. A cópia antiga da V2, se existir, não foi tocada.');
}
/* =========================================================================
   RENDER — despachante por tela
   ========================================================================= */
function render(){
  DerivedCache.bump();            // consultas derivadas sempre frescas a cada desenho
  AnalyticsEngine.invalidate();   // dados podem ter mudado sem passar por loadAll
  updateBadges();
  renderTimerBar();
  renderTips();
  switch(ui.view){
    case 'today':       renderToday(); break;
    case 'plan':        renderPlan(); break;
    case 'reviews':     renderReviews(); break;
    case 'disciplines': renderDisciplines(); break;
    case 'analytics':   renderAnalytics(); break;
    case 'history':     renderHistory(); break;
    case 'help':        renderHelp(); break;
    case 'data':        renderData(); break;
    case 'settings':    renderSettings(); break;
    default:            renderToday();
  }
  ui.justCreated = null;          // o fade de "item novo" acontece uma vez só
}

/* =========================================================================
   EVENT HANDLERS
   ========================================================================= */
function bindEvents(){
  Overlay.bind();     // Esc/Tab/rolagem das camadas — antes de qualquer atalho global
  // Tocar em Disciplinas estando nela volta ao índice (como reabrir o caderno pela capa).
  const goView = (v) => {
    if(v === 'disciplines' && ui.view === 'disciplines' && (ui.discNav.level !== 'root' || ui.discTab !== 'disciplines')){ navDisc({ level:'root' }, 'back'); return; }
    setView(v);
  };
  $$('#nav-desktop .nav-item').forEach(b => b.addEventListener('click', () => goView(b.dataset.view)));
  $$('#nav-mobile .mb-item[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  $('#mb-more').addEventListener('click', () => {
    openModal(close => ({
      title:'Mais',
      content: h('div', { class:'ob-list' },
        [['disciplines','Disciplinas'], ['history','Histórico'], ['help','Ajuda'], ['data','Dados'], ['settings','Configurações']].map(([v,l]) =>
          h('button', { class:'btn ghost block more-item', type:'button', 'aria-current': ui.view === v ? 'page' : null, onclick:() => { close(); goView(v); } },
            icon(NAV_ICONS[v], 'nav-icon'), h('span', { text:l }), ui.view === v ? h('span', { class:'more-here', text:'Você está aqui' }) : null))),
      actions:[ h('button', { class:'btn ghost', type:'button', text:'Fechar', onclick:() => close() }) ]
    }), { size:'narrow' });
  });

  /* v6.5 — "Ir para o conteúdo": o foco vai para o título da tela atual. É feito
     aqui (e não pelo #main do link) para não criar uma entrada no histórico. */
  const skip = $('#skip-link');
  if(skip) skip.addEventListener('click', (e) => {
    e.preventDefault();
    const target = $('.view.active .page-head h2') || $('#main');
    if(target){ try { target.focus({ preventScroll:true }); } catch(_){ target.focus(); } try { target.scrollIntoView({ block:'start' }); } catch(_){} }
  });

  $('#theme-toggle').addEventListener('click', toggleTheme);
  $('#theme-toggle-m').addEventListener('click', toggleTheme);

  $('#open-palette').addEventListener('click', () => Palette.open());
  $('#screen-help').addEventListener('click', () => openScreenHelp());
  // v5.2.1 — no celular a barra de ferramentas é oculta; estas duas ações viviam
  // só nela e ficavam inalcançáveis. Agora existem também no cabeçalho móvel.
  const pm = $('#open-palette-m'); if(pm) pm.addEventListener('click', () => Palette.open());
  const hm = $('#screen-help-m');  if(hm) hm.addEventListener('click', () => openScreenHelp());
  $('#drawer-close').addEventListener('click', () => Drawer.close());

  // Tema 'system' acompanha o sistema operacional enquanto a página está aberta.
  if(systemThemeQuery){
    // Só reage quando a preferência é 'system'; nunca sobrescreve uma escolha explícita.
    const onSystemTheme = () => { if(state.settings.theme === 'system') applyTheme('system'); };
    if(systemThemeQuery.addEventListener) systemThemeQuery.addEventListener('change', onSystemTheme);
    else if(systemThemeQuery.addListener) systemThemeQuery.addListener(onSystemTheme);
  }


  /* v6.4 — "Registrar estudo" é uma ação global e diz o que faz: guarda algo que
     você já estudou. Funciona em qualquer tela, sem sair dela. Com o cronômetro
     ligado, o mesmo botão finaliza o estudo em andamento. */
  const fabBtn = $('#fab');
  fabBtn.addEventListener('click', () => {
    clearTimeout(fabHintTimer);
    Tooltip.hide();
    if(TimerService.isActive){ openFinishModal(); return; }
    openRegisterModal();
  });
  /* A dica aparece ao passar o mouse e no foco de TECLADO. Quando o foco só
     volta para o botão (ao fechar a janela com o mouse), ela não reaparece. */
  const fabHint = () => TimerService.isActive ? 'Registre o estudo que está no cronômetro.' : 'Adicione algo que você já estudou.';
  let fabHintTimer = null;
  fabBtn.addEventListener('mouseenter', () => { clearTimeout(fabHintTimer); fabHintTimer = setTimeout(() => { if(!Overlay.isOpen) Tooltip.show(fabBtn, fabHint); }, 350); });
  fabBtn.addEventListener('mouseleave', () => { clearTimeout(fabHintTimer); Tooltip.hide(); });
  fabBtn.addEventListener('focus', () => { let kb = false; try { kb = fabBtn.matches(':focus-visible'); } catch(_){} if(kb && !Overlay.isOpen) Tooltip.show(fabBtn, fabHint); });
  fabBtn.addEventListener('blur', () => { clearTimeout(fabHintTimer); Tooltip.hide(); });

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' ||
                   (e.target && e.target.isContentEditable);

    // Ctrl/⌘ + K funciona mesmo com foco em campo, exceto dentro da própria palette.
    if((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')){
      e.preventDefault();
      if(Palette.isOpen){ Palette.close(); return; }
      // evita empilhar a busca sobre um modal/painel já aberto
      if(Overlay.isOpen) return;
      Palette.open();
      return;
    }

    // Esc de camadas já foi tratado pela pilha (Overlay.bind, em captura).
    if(e.key === 'Escape'){ Tooltip.hide(); return; }

    if(e.ctrlKey || e.metaKey || e.altKey) return;
    if(typing) return;
    if(Overlay.isOpen) return;                 // nenhum atalho global sob uma camada

    // v6.2 — "/" busca AQUI: foca a busca da tela atual; sem busca na tela, abre a busca do Ciclo
    if(e.key === '/'){
      e.preventDefault();
      const here = $('.view.active [data-context-search]') || $('.view.active #help-q');
      if(here){ here.focus(); try { here.select(); } catch(_){} revealElement(here); }
      else Palette.open();
      return;
    }

    const k = e.key.toLowerCase();
    if(k === 'r'){ e.preventDefault(); TimerService.isActive ? openFinishModal() : openRegisterModal(); }
    else if(k === 'h'){ e.preventDefault(); setView('today'); }
    else if(k === 'p'){ e.preventDefault(); setView('plan'); }
    else if(k === 'v'){ e.preventDefault(); setView('reviews'); }
    else if(k === 'a'){ e.preventDefault(); setView('analytics'); }
    else if(e.key === '?'){ e.preventDefault(); setView('help'); }
  });

  // A busca de comandos filtra conforme você digita.
  $('#palette-input').addEventListener('input', (e) => Palette.filter(e.target.value));

  // Fecha tooltip ao rolar a página (o ancoradouro pode sair do lugar).
  window.addEventListener('scroll', () => { if(Tooltip.current) Tooltip.hide(); }, { passive:true });

  // Ao voltar para a aba, o relógio e a fila de revisões podem ter mudado de dia.
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState !== 'visible') return;
    renderTimerBar();
    updateBadges();
    DayWatch.check();
  });
  window.addEventListener('focus', () => DayWatch.check());
  DayWatch.arm();

  /* v6.3 — cronômetro em duas abas: se uma aba finaliza, descarta ou inicia
     um estudo, as outras acompanham.
     v6.5 — isto é só para a TELA ficar em dia. Quem impede o estudo de ser
     gravado duas vezes é o banco (SessionCommands.finalizeTimer): mesmo que
     este evento nunca chegue, a segunda finalização é recusada. */
  window.addEventListener('storage', async (e) => {
    if(e.key !== TIMER_LS_KEY && e.key !== null) return;      // null = o armazenamento inteiro foi limpo
    const before = TimerService.isActive ? TimerService.data.runId : null;
    const stored = TimerService.storedRunId();
    if(stored === undefined) return;                          // ilegível agora: não mexe em nada
    if(stored === null){
      if(!TimerService.persisted) return;                     // este cronômetro nunca chegou ao armazenamento: não é "encerrado em outra aba"
      // Só a memória desta aba: nada é escrito de volta no armazenamento.
      TimerService.forget();
      if(before && ui.reviewQueue) ui.reviewQueue = null;
    } else {
      // A outra aba pode ter criado a disciplina agora: recarrega os dados antes,
      // para esta aba não descartar um cronômetro válido por não conhecê-la.
      let discId = null;
      try { discId = (JSON.parse(localStorage.getItem(TIMER_LS_KEY) || '{}') || {}).disciplineId || null; } catch(_){}
      if(discId && !getDiscipline(discId)){
        try { await loadAll(); } catch(err){ console.error(err); }
      }
      TimerService.stopTicking();
      TimerService.restore();
    }
    renderTimerBar();
    if(FocusMode.isOpen) FocusMode.render();
    if(before && !TimerService.isActive) toast('Ele foi finalizado ou descartado em outra aba.', 'info', { title:'Cronômetro atualizado' });
  });

  DataSync.start();

  /* v6.5 — rede de segurança. Um erro que escape de qualquer handler não pode
     passar em branco: a pessoa fica sabendo que a ÚLTIMA ação pode não ter sido
     concluída (no máximo um aviso a cada 8 s; o detalhe técnico vai para o console). */
  let lastCrashNotice = 0;
  const crashNotice = (what) => {
    console.error('Ciclo: erro não tratado.', what);
    const now = Date.now();
    if(now - lastCrashNotice < 8000) return;
    lastCrashNotice = now;
    try { toast('A última ação pode não ter sido concluída. Confira e tente de novo; seus dados gravados não foram alterados.', 'err', { title:'Algo não saiu como esperado' }); } catch(_){}
  };
  window.addEventListener('unhandledrejection', (ev) => { crashNotice(ev && ev.reason); });
  window.addEventListener('error', (ev) => {
    if(ev && ev.target && ev.target !== window) return;       // falha de recurso (imagem etc.): não é erro do aplicativo
    crashNotice(ev && (ev.error || ev.message));
  });

  window.addEventListener('beforeunload', () => { TimerService.stopTicking(); });
}

/* =========================================================================
   v6.3 — VIRADA DO DIA
   Quem deixa o Ciclo aberto de um dia para o outro via "Hoje" com a data, a
   frase, as revisões e a semana de ontem. Agora, na virada do dia local (ou
   ao voltar para a aba num dia novo), os dados são recarregados e a tela
   redesenhada — a semana nova é criada pelo mesmo caminho de sempre.
   Não interrompe ninguém: com uma janela aberta ou digitando, espera.
   ========================================================================= */
const DayWatch = {
  day: null,
  timer: null,
  running: false,
  arm(){
    if(!this.day) this.day = todayISO();
    clearTimeout(this.timer);
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    // setTimeout longo pode atrasar com a aba em segundo plano: o foco/visibilidade cobre isso.
    this.timer = setTimeout(() => this.check(), Math.min(next - now, 6 * 3600000));
  },
  busy(){
    const a = document.activeElement;
    const typing = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
    return Overlay.isOpen || typing;
  },
  async check(){
    const today_ = todayISO();
    if(this.day === today_ || !state.ready){ this.arm(); return; }
    if(this.running) return;
    if(this.busy()){ clearTimeout(this.timer); this.timer = setTimeout(() => this.check(), 60000); return; }
    this.running = true;
    try {
      await refresh();
      this.day = today_;
    } catch(err){
      console.error('Falha ao atualizar para o novo dia:', err);
    } finally {
      this.running = false;
      this.arm();
    }
  }
};

/* =========================================================================
   INITIALIZATION
   ========================================================================= */
function showFatalError(message, detail){
  const main = $('.main');
  if(!main) return;
  mount(main, h('div', { class:'card', style:'border-color:var(--danger)' },
    h('h3', { style:'margin-bottom:8px', text:'Não foi possível abrir seus dados' }),
    h('p', { class:'hint', text:message }),
    detail ? h('p', { class:'hint', style:'margin-top:8px', text:detail }) : null,
    h('p', { class:'hint', style:'margin-top:12px', text:'Se você estiver em uma janela anônima ou com o armazenamento do site bloqueado, tente abrir em uma janela normal. Os dados ficam guardados no navegador.' })
  ));
  const fab = $('#fab'); if(fab) fab.classList.add('hidden');
}

async function init(){
  // Tema aplicado antes de tudo, para evitar piscar de cor.
  try {
    const cached = localStorage.getItem(THEME_LS_KEY);
    if(cached === 'light' || cached === 'dark') document.documentElement.setAttribute('data-theme', cached);
  } catch(_){}

  try {
    await DB.open();
  } catch(err){
    console.error(err);
    showFatalError('O navegador não liberou o banco local (IndexedDB), que é onde o aplicativo guarda tudo.', String(err && err.message || err));
    return;
  }

  let migrationV4 = null;
  let migration = null;
  try {
    migration = await runV2Migration();
  } catch(err){
    console.error('Falha na migração V2:', err);
    toast('Não foi possível migrar automaticamente os dados da versão anterior. Eles continuam salvos e podem ser importados em Dados.', 'err');
  }

  // v3 → v4: acrescenta campos novos sem tocar na agenda de revisões
  try {
    migrationV4 = await runV4Migration();
  } catch(err){
    console.error('Falha na migração v4:', err);
    toast('Não foi possível concluir a atualização do formato de dados.', 'err');
  }

  // v5.1 → v5.2: importância → prioridade (1–5) e prazos 2.0. Sem reagendar nada.
  try {
    await runV52Migration();
  } catch(err){
    console.error('Falha na migração v5.2:', err);
    toast('Seus dados continuam intactos. Recarregue a página para tentar de novo.', 'err',
      { title:'Não foi possível atualizar o formato de prioridades e prazos' });
  }

  // v6.3 → v6.4: cada estudo ganha a lista de descansos (vazia). Minutos intactos.
  try {
    await runV64Migration();
  } catch(err){
    console.error('Falha na migração v6.4:', err);
    toast('Seus dados continuam intactos. Recarregue a página para tentar de novo.', 'err',
      { title:'Não foi possível atualizar o formato dos estudos' });
  }

  try {
    await loadAll();
  } catch(err){
    // v6.5: antes, uma falha aqui deixava a tela em branco, sem explicação.
    console.error('Falha ao ler os dados:', err);
    showFatalError('O banco local abriu, mas não foi possível ler os dados guardados nele.',
      'Recarregue a página. Se continuar, feche as outras abas do Ciclo e tente de novo. Nada foi apagado.');
    return;
  }
  const vEl = $('#app-version');
  if(vEl) vEl.textContent = 'v' + APP_VERSION;     // uma única fonte de verdade
  applyTheme(state.settings.theme);
  applyDensity(state.settings.density);
  applyReduceMotion(state.settings.reduceMotion);
  // espelho inicial do período (usado pelo filtro do Histórico até a primeira análise)
  ui.period = presetRange(validPreset(state.settings.defaultPeriod));

  try { await PlannerEngine.ensureWeeklyPlan(); }
  catch(err){ console.error('Falha ao preparar a semana atual:', err); }   // a semana é criada de novo no próximo desenho

  TimerService.restore();
  /* v6.5 — a página pode ter fechado logo depois de gravar o estudo e antes de
     limpar o cronômetro. O estudo já está no histórico (o id dele é o runId):
     o cronômetro é só encerrado, nunca registrado de novo. */
  let timerAlreadySaved = false;
  if(TimerService.isActive && state.sessions.some(x => x.id === TimerService.data.runId)){
    TimerService.release(TimerService.data.runId);
    timerAlreadySaved = true;
  }
  bindEvents();
  Slider.init();      // v6.6: indicadores de seleção que deslizam
  PickFx.init();      // v6.6: a marca da escolha assenta com um pulso curto
  state.ready = true;

  // v5: o primeiro acesso depende só de existir algo cadastrado. Plano não é pré-requisito.
  const needsSetup = !state.meta.onboardingCompleted && !activeDisciplines().length && !state.sessions.length;
  /* v6.2 — recarregar a página volta para o lugar onde a pessoa estava (se ele
     ainda existir; senão, para o nível válido mais próximo). A primeira entrada
     do histórico é SUBSTITUÍDA, nunca empilhada. */
  const saved = history.state && history.state.c === 'ciclo' && history.state.loc ? history.state : null;
  if(!needsSetup && saved){
    try { applyLocation(saved.loc, { initial:true, scrollY: isNum(saved.sy) ? saved.sy : 0, helpStack: saved.hs }); }
    catch(err){ console.error('Ciclo: não foi possível restaurar a última tela.', err); setView(state.settings.startView || 'today', { noSync:true }); }
  } else {
    setView(needsSetup ? 'today' : (state.settings.startView || 'today'), { noSync:true });
  }
  Nav.start();

  if(TimerService.isActive) offerStaleSession();
  if(timerAlreadySaved) toast('O cronômetro que estava aberto já tinha sido salvo no histórico.', 'info', { title:'Esse estudo já foi registrado.' });
  if(TimerService.isActive && !TimerService.persisted) renderTimerBar();

  // Onboarding: só para quem ainda não tem plano nem disciplinas configuradas.
  if(needsSetup){
    openWelcome();
  } else if(migration && migration.migrated){
    toast(`${plural(migration.counts.disciplines, 'disciplina', 'disciplinas')} e ${plural(migration.counts.sessions, 'estudo', 'estudos')} trazidos da versão anterior.`, 'ok', { title:'Dados antigos recuperados' });
  } else {
    maybeShowWhatsNew();
  }
  void migrationV4;

  // Primeira revisão: ensina fazendo, no momento em que ela aparece.
  // Espera qualquer modal de abertura (boas-vindas/novidades) ser resolvido.
  let offerTries = 0;
  setTimeout(function waitThenOffer(){
    // espera um modal de abertura sair, mas desiste em vez de sondar para sempre
    if(Overlay.isOpen && offerTries++ < 10){ setTimeout(waitThenOffer, 1200); return; }
    maybeOfferFirstReview();
  }, 1000);
}
/* =========================================================================
   HELP ENGINE (v5.3) — índice único, busca local e tolerante a acentos.

   Um único índice cobre artigos, perguntas do FAQ e termos do glossário.
   Ele é construído UMA VEZ, na carga: digitar não renormaliza conteúdo
   nenhum, só compara strings já normalizadas.
   ========================================================================= */
function normalizeText(s){
  return String(s == null ? '' : s)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove as marcações [[termo]] deixando o texto que o leitor vê. */
function plainText(s){
  return String(s == null ? '' : s).replace(/\[\[([a-zA-Z]+)(?:\|([^\]]+))?\]\]/g,
    (_, key, label) => label || (HELP_GLOSSARY[key] ? HELP_GLOSSARY[key].term : key));
}

/** Índices auxiliares — montados uma vez. */
const HELP_SECTION_BY_ID = new Map(HELP_SECTIONS.map(s => [s.id, s]));
const HELP_GROUP_BY_KEY = (() => {
  const m = new Map();
  HELP_SECTIONS.forEach(s => s.groups.forEach(g => m.set(s.id + '/' + g.id, g)));
  return m;
})();
const HELP_ARTICLE_BY_ID = new Map(HELP_ARTICLES.map(a => [a.id, a]));
const HELP_FAQ_BY_ID = new Map(HELP_FAQ.map(f => [f.id, f]));
const GLOSSARY_KEYS = Object.keys(HELP_GLOSSARY)
  .sort((a, b) => HELP_GLOSSARY[a].term.localeCompare(HELP_GLOSSARY[b].term, 'pt-BR'));

/** "Entender domínio", mas "Entender Área de Estudo": nome próprio não desce. */
function glossaryCallLabel(key){
  const g = HELP_GLOSSARY[key];
  if(!g) return '';
  return 'Entender ' + (g.proper ? g.term : g.term.toLowerCase());
}

function getArticle(id){ return HELP_ARTICLE_BY_ID.get(id) || null; }
function helpSection(id){ return HELP_SECTION_BY_ID.get(id) || null; }
function helpGroup(sectionId, groupId){ return HELP_GROUP_BY_KEY.get(sectionId + '/' + groupId) || null; }
function articlesOf(sectionId, groupId){
  return HELP_ARTICLES.filter(a => a.section === sectionId && (!groupId || a.group === groupId));
}
/** "Usar o Ciclo › Revisando" — o caminho curto que aparece nos resultados. */
function articlePath(a){
  if(!a) return '';
  const s = helpSection(a.section), g = helpGroup(a.section, a.group);
  return [s ? s.label : null, g ? g.label : null].filter(Boolean).join(' › ');
}

/** Texto completo de um artigo, para o índice de busca. */
function articleSearchText(a){
  const parts = [a.title, a.oneLine, a.summary, a.keywords];
  const walk = (blocks) => (blocks || []).forEach(b => {
    if(b.p) parts.push(b.p);
    if(b.h) parts.push(b.h);
    if(b.note) parts.push(b.note);
    if(b.ul) parts.push(b.ul.join(' '));
    if(b.ol) parts.push(b.ol.join(' '));
    if(b.steps) parts.push(b.steps.join(' '));
    if(b.details){ parts.push(b.details.title); walk(b.details.content); }
  });
  walk(a.content);
  return plainText(parts.filter(Boolean).join(' '));
}

/**
 * ÍNDICE DE BUSCA — gerado das fontes de conteúdo, nunca mantido à mão.
 * Cada entrada já guarda título, palavras-chave e corpo normalizados.
 */
const HELP_SEARCH_INDEX = (() => {
  const out = [];

  HELP_ARTICLES.forEach(a => out.push({
    kind:'article', id:a.id, title:a.title, path:articlePath(a), snippet:a.summary,
    nTitle: normalizeText(a.title),
    nKeywords: normalizeText([a.keywords, a.summary, a.oneLine].join(' ')),
    nBody: normalizeText(articleSearchText(a))
  }));

  GLOSSARY_KEYS.forEach(key => {
    const g = HELP_GLOSSARY[key];
    out.push({
      kind:'term', id:key, title:g.term, path:'Glossário', snippet:g.short,
      nTitle: normalizeText(g.term),
      nKeywords: normalizeText([g.alias || '', g.term].join(' ')),
      nBody: normalizeText(g.term + ' ' + g.short + ' ' + (g.alias || ''))
    });
  });

  HELP_FAQ.forEach(f => {
    const grp = HELP_FAQ_GROUPS.find(x => x.id === f.g);
    out.push({
      kind:'faq', id:f.id, title:f.q, path:'Perguntas comuns' + (grp ? ' › ' + grp.label : ''), snippet:f.a,
      nTitle: normalizeText(f.q),
      nKeywords: normalizeText(f.q),
      nBody: normalizeText(f.q + ' ' + f.a)
    });
  });

  return out;
})();

/**
 * Busca por termos. Cada termo precisa aparecer em algum campo da entrada.
 * Pontuação: título exato > termo do glossário > palavras-chave > título
 * parcial > conteúdo. Sem fuzzy: o resultado é previsível e instantâneo.
 */
function searchHelp(query){
  const q = normalizeText(query);
  if(q.length < 2) return [];
  const terms = q.split(' ').filter(Boolean);

  const scored = [];
  for(const e of HELP_SEARCH_INDEX){
    let score = 0, ok = true;
    for(const t of terms){
      if(e.nTitle.includes(t)) score += 30;
      else if(e.nKeywords.includes(t)) score += 14;
      else if(e.nBody.includes(t)) score += 4;
      else { ok = false; break; }
    }
    if(!ok) continue;

    if(e.nTitle === q) score += 120;                 // título exato
    else if(e.nTitle.startsWith(q)) score += 30;
    else if(e.nTitle.includes(q)) score += 12;

    if(e.kind === 'term'){
      score += 8;
      if(e.nTitle === q) score += 50;                // "dominio" → o termo Domínio na frente
    } else if(e.kind === 'article'){
      score += 10;                                   // o artigo explica; a pergunta só responde
    }
    scored.push({ e, score });
  }

  /* Desempate: mais pontos, depois o título mais curto (costuma ser o mais
     geral: "O que é uma revisão?" antes de "Métodos de revisão: como revisar"). */
  scored.sort((a, b) => b.score - a.score ||
                        a.e.title.length - b.e.title.length ||
                        a.e.title.localeCompare(b.e.title, 'pt-BR'));

  /* Sem versões concorrentes do mesmo conteúdo: quando a pergunta do FAQ tem
     o mesmo título de um artigo que também apareceu, fica só o artigo. */
  const titles = new Set(scored.filter(x => x.e.kind === 'article').map(x => x.e.nTitle));
  return scored.filter(x => !(x.e.kind === 'faq' && titles.has(x.e.nTitle))).map(x => x.e);
}

/* =========================================================================
   TOOLTIP SERVICE — uma única raiz reutilizada, mouse e teclado.
   ========================================================================= */
const Tooltip = {
  el: null,
  timer: null,
  current: null,

  get root(){ if(!this.el) this.el = document.getElementById('tooltip-root'); return this.el; },
  get enabled(){ return state.settings.hoverHints !== false && state.settings.helpMode !== 'off'; },

  /** content: string | Node | () => (string|Node) */
  show(anchor, content, opts){
    if(!this.enabled && !(opts && opts.force)) return;
    const root = this.root;
    if(!root || !anchor) return;
    const value = typeof content === 'function' ? content() : content;
    if(!value) return;

    clear(root);
    if(value instanceof Node) root.appendChild(value);
    else root.textContent = String(value);

    root.hidden = false;
    this.current = anchor;
    this.position(anchor);
    requestAnimationFrame(() => root.setAttribute('data-show','1'));
  },

  position(anchor){
    const root = this.root;
    const r = anchor.getBoundingClientRect();
    const t = root.getBoundingClientRect();
    const gap = 9, pad = 8;
    let top = r.top - t.height - gap;
    let placeBelow = false;
    if(top < pad){ top = r.bottom + gap; placeBelow = true; }
    if(placeBelow && top + t.height > window.innerHeight - pad) top = Math.max(pad, r.top - t.height - gap);
    let left = r.left + (r.width / 2) - (t.width / 2);
    left = clamp(left, pad, Math.max(pad, window.innerWidth - t.width - pad));
    root.style.top = Math.round(top) + 'px';
    root.style.left = Math.round(left) + 'px';
  },

  hide(){
    const root = this.root;
    if(!root) return;
    root.removeAttribute('data-show');
    this.current = null;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { root.hidden = true; clear(root); }, 130);
  },

  /** Liga tooltip a um elemento (mouse + foco de teclado). */
  attach(el, content, opts){
    const o = opts || {};
    const open = () => { clearTimeout(this.timer); this.timer = setTimeout(() => this.show(el, content, o), o.delay === undefined ? 130 : o.delay); };
    const close = () => { clearTimeout(this.timer); this.hide(); };
    el.addEventListener('mouseenter', open);
    el.addEventListener('mouseleave', close);
    el.addEventListener('focus', () => this.show(el, content, o));
    el.addEventListener('blur', close);
    return el;
  }
};

/** Monta o corpo de um tooltip com título e linhas rótulo/valor. */
function tipBody(title, rows, footer){
  const box = document.createDocumentFragment();
  if(title) box.appendChild(h('strong', { text:title }));
  (rows || []).forEach(r => {
    if(r === '-'){ box.appendChild(h('div', { class:'tt-sep' })); return; }
    box.appendChild(h('div', { class:'tt-row' }, h('span', { text:r[0] }), h('span', { text:r[1] })));
  });
  if(footer) box.appendChild(h('div', { class:'tt-row', style:'margin-top:4px' }, h('span', { text:footer })));
  return box;
}

/**
 * Resolve uma chave de ajuda contextual para { title, tip, article }.
 * Quando a entrada aponta para um termo do glossário, o texto vem de lá:
 * assim a mesma palavra nunca tem duas definições diferentes no produto.
 */
function contextHelpInfo(key){
  const info = CONTEXT_HELP[key];
  if(!info) return null;
  if(info.term){
    const g = HELP_GLOSSARY[info.term];
    if(!g) return null;
    return { title: info.title || g.term, tip: info.tip || g.short, article: info.article || g.article, term: info.term };
  }
  return { title: info.title, tip: info.tip, article: info.article, term: null };
}

/** Botão "?" de ajuda contextual: tooltip no hover/foco, artigo no clique. */
function helpDot(key){
  const info = contextHelpInfo(key);
  if(!info || state.settings.helpMode === 'off') return null;
  const btn = h('button', {
    class:'helpdot', type:'button', text:'?',
    'aria-label': 'O que é ' + info.title + '?',
    onclick:(e) => { e.stopPropagation(); openHelpArticle(info.article); }
  });
  Tooltip.attach(btn, () => tipBody(info.title, [], info.tip));
  return btn;
}

/** Rótulo com "?" ao lado. */
function labelWithHelp(text, key, tag){
  return h(tag || 'span', null, text, helpDot(key));
}

/* =========================================================================
   GLOSSÁRIO CONTEXTUAL (v5.3)

   Um termo marcado no texto explica a si mesmo sem tirar a pessoa da página:
   no computador basta o mouse ou o foco do teclado; no celular, um toque abre
   o mesmo conteúdo como popover. O aprofundamento é opcional e nomeado
   ("Entender domínio"), nunca um "saiba mais" solto.

   Regra de uso: marque um termo só quando a dúvida atrapalharia a decisão
   naquele ponto — e, no máximo, uma vez por artigo.
   ========================================================================= */
const GlossaryPopover = {
  el: null, anchor: null,

  get root(){
    if(!this.el){
      this.el = h('div', { class:'gloss-pop', role:'dialog', 'aria-modal':'false', hidden:true });
      document.body.appendChild(this.el);
      document.addEventListener('mousedown', (e) => {
        if(!this.anchor) return;
        if(this.el.contains(e.target) || this.anchor.contains(e.target)) return;
        this.close();
      });
      window.addEventListener('resize', () => this.close(), { passive:true });
      /* Rolar acompanha o termo em vez de fechar: fechar sozinho parecia um bug
         (e o próprio focus() do botão já rola a página). Só sai de cena quando
         o termo deixa a janela. */
      window.addEventListener('scroll', () => {
        if(!this.anchor) return;
        const r = this.anchor.getBoundingClientRect();
        if(r.bottom < 0 || r.top > window.innerHeight) this.close();
        else this.position(this.anchor);
      }, { passive:true });
    }
    return this.el;
  },

  open(anchor, key){
    const g = HELP_GLOSSARY[key];
    if(!g) return;
    if(this.anchor === anchor){ this.close(); return; }     // segundo toque fecha
    const root = this.root;
    mount(root,
      h('p', { class:'gp-term', text:g.term }),
      h('p', { class:'gp-short', text:g.short }),
      g.article ? h('button', { class:'linkbtn', type:'button',
        text: glossaryCallLabel(key),
        onclick:() => { this.close(); openHelpArticle(g.article); } }) : null,
      h('button', { class:'gp-close icon-btn', type:'button', 'aria-label':'Fechar explicação',
        onclick:() => this.close() }, icon('i-close')));
    LayerFx.cancel(root);
    root.hidden = false;
    this.anchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    // v6.6: Esc fecha a explicação (e só ela — uma janela por baixo continua aberta)
    if(this._esc) this._esc();
    this._esc = Overlay.pushEsc(() => this.close(), root);
    this.position(anchor);
    const first = root.querySelector('button');
    if(first) setTimeout(() => { if(!root.hidden && !LayerFx.isLeaving(root)) { try { first.focus({ preventScroll:true }); } catch(_){ first.focus(); } } }, 30);
  },

  position(anchor){
    const root = this.root;
    const r = anchor.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    const pad = 10;
    let top = r.bottom + 8;
    if(top + box.height > window.innerHeight - pad) top = Math.max(pad, r.top - box.height - 8);
    let left = clamp(r.left, pad, Math.max(pad, window.innerWidth - box.width - pad));
    root.style.top = Math.round(top) + 'px';
    root.style.left = Math.round(left) + 'px';
  },

  close(){
    if(!this.el || this.el.hidden || LayerFx.isLeaving(this.el)) return;
    const el = this.el;
    LayerFx.leave(el, MOTION.popOut, () => clear(el));
    if(this._esc){ this._esc(); this._esc = null; }
    const a = this.anchor;
    this.anchor = null;
    if(a){
      a.setAttribute('aria-expanded', 'false');
      if(document.contains(a)){ try { a.focus({ preventScroll:true }); } catch(_){ a.focus(); } }
    }
  },

  get isOpen(){ return !!(this.el && !this.el.hidden && !LayerFx.isLeaving(this.el)); }
};

/** Detecta ponteiro grosso (celular/tablet): lá o hover não existe. */
function isCoarsePointer(){
  return !!(window.matchMedia && window.matchMedia('(hover:none),(pointer:coarse)').matches);
}

/**
 * Termo do glossário dentro de um texto corrido.
 * Hover e foco mostram o tooltip; clique/toque abre o popover com o
 * aprofundamento opcional. Nunca depende só do mouse.
 */
function glossaryTerm(key, label){
  const g = HELP_GLOSSARY[key];
  if(!g) return document.createTextNode(label || key);
  const btn = h('button', {
    class:'gterm', type:'button',
    'aria-expanded':'false',
    'aria-label': (label || g.term) + ' — ver explicação',
    onclick:(e) => { e.stopPropagation(); Tooltip.hide(); GlossaryPopover.open(btn, key); }
  }, h('span', { text: label || g.term }), h('span', { class:'gterm-mark', 'aria-hidden':'true', text:'?' }));
  if(!isCoarsePointer()) Tooltip.attach(btn, () => tipBody(g.term, [], g.short), { delay:220 });
  return btn;
}

/**
 * Converte um texto com marcações [[termo]] ou [[termo|rótulo]] em nós DOM.
 * Nada de innerHTML: cada pedaço vira texto ou um botão de glossário.
 */
function richText(text){
  const frag = document.createDocumentFragment();
  const src = str(text);
  const re = /\[\[([a-zA-Z]+)(?:\|([^\]]+))?\]\]/g;
  let last = 0, m;
  while((m = re.exec(src))){
    if(m.index > last) frag.appendChild(document.createTextNode(src.slice(last, m.index)));
    frag.appendChild(glossaryTerm(m[1], m[2] || null));
    last = m.index + m[0].length;
  }
  if(last < src.length) frag.appendChild(document.createTextNode(src.slice(last)));
  return frag;
}

/* =========================================================================
   DRAWER SERVICE — painel lateral para consulta e contexto.
   ========================================================================= */
const Drawer = {
  _layer: null,
  open(title, contentNode, opts){
    const root = document.getElementById('drawer-root');
    const o = opts || {};
    const leaving = LayerFx.isLeaving(root);
    LayerFx.cancel(root);                        // reabrir no meio da saída: o painel volta, sem ficar preso
    const wasOpen = !root.hidden && !leaving;
    const opener = wasOpen ? undefined : document.activeElement;
    const content = document.getElementById('drawer-content');
    document.getElementById('drawer-title').textContent = title || '';
    mount(content, contentNode || null);
    content.scrollTop = 0;                       // novo conteúdo começa do topo
    if(wasOpen){
      content.classList.remove('is-swapping');
      void content.offsetWidth;                  // reinicia a transição de troca
      content.classList.add('is-swapping');
    }
    root.hidden = false;
    if(!wasOpen){
      root.addEventListener('mousedown', this._onBackdrop);
      // Registrado na pilha: fica acima do modal que o abriu e é quem recebe o Esc.
      this._layer = Overlay.open(root, document.getElementById('drawer-panel'), () => Drawer.close(), { opener });
    }
    const focusable = document.getElementById('drawer-panel').querySelector('button,a,input,select,textarea');
    if(focusable) setTimeout(() => { if(Drawer.isOpen) focusable.focus(); }, 40);
    // trocar de conteúdo encerra o contexto anterior (ex.: prazo aberto no painel)
    if(wasOpen && this._onCloseCb){ const prev = this._onCloseCb; this._onCloseCb = null; prev(); }
    this._onCloseCb = o.onClose || null;
  },
  close(){
    const root = document.getElementById('drawer-root');
    if(!root || root.hidden || LayerFx.isLeaving(root)) return;
    LayerFx.leave(root, MOTION.layerOut, () => clear(document.getElementById('drawer-content')));
    root.removeEventListener('mousedown', this._onBackdrop);
    Tooltip.hide();
    GlossaryPopover.close();
    if(this._onCloseCb){ const cb = this._onCloseCb; this._onCloseCb = null; cb(); }
    Overlay.close(this._layer, { unlockAfter: MOTION.layerOut });   // devolve o foco a quem abriu
    this._layer = null;
  },
  get isOpen(){ const r = document.getElementById('drawer-root'); return !!r && !r.hidden && !LayerFx.isLeaving(r); },
  _onBackdrop(e){ if(e.target === document.getElementById('drawer-root')) Drawer.close(); }
};

/* =========================================================================
   COMMAND PALETTE — "encontre algo NO CICLO" (Ctrl + K).
   v6.2: continua global, mas NÃO substitui a busca de cada tela ("encontre
   algo AQUI"). Resultados agrupados por tipo — Disciplinas, Tópicos, Áreas,
   Prazos, Ações, Telas e, por último, a Ajuda — com o grupo mais relevante
   primeiro. É também a busca ampla da tela Hoje.
   ========================================================================= */
const PALETTE_GROUPS = ['Disciplinas','Tópicos','Áreas','Prazos','Ações','Telas','Ajuda','Aprender a estudar','Perguntas comuns','Glossário'];
const PALETTE_GROUP_CAP = { 'Disciplinas':5, 'Tópicos':6, 'Áreas':4, 'Prazos':4, 'Ações':5, 'Telas':4, 'Ajuda':4, 'Aprender a estudar':3, 'Perguntas comuns':3, 'Glossário':3 };
const Palette = {
  items: [],
  filtered: [],
  index: 0,
  _layer: null,

  buildIndex(){
    const items = [];
    const push = (group, label, sub, icon, run, searchExtra) => items.push({ group, label, sub, icon, run, nl: normalizeText(label), n: normalizeText(label + ' ' + (sub||'') + ' ' + (searchExtra||'')) });

    Object.keys(VIEW_TITLES).forEach(v => {
      push('Telas', VIEW_TITLES[v], null, NAV_ICONS[v] || 'i-arrow', () => setView(v), 'tela ir abrir');
    });

    appFunctions().forEach(f => push('Ações', f.label, f.sub, f.icon || 'i-arrow', f.run, f.kw));

    state.areas.filter(a => !a.archived).slice().sort(sortByName).forEach(a => {
      push('Áreas', a.name, plural(disciplinesIn(a.id, false).length, 'disciplina', 'disciplinas'), 'i-disc', () => openArea(a.id), 'area de estudo grupo');
    });
    activeDisciplines().slice().sort(sortByName).forEach(d => {
      // os tópicos entram só como contexto de busca: "ospf" também encontra a disciplina que tem OSPF
      push('Disciplinas', d.name, areaNameOf(d), 'i-disc', () => openDisciplineDetail(d.id), 'disciplina ' + areaNameOf(d) + ' ' + topicsOf(d.id).map(t => t.name).join(' '));
    });

    DeadlineEngine.open().forEach(dl => {
      const disc = dl.disciplineId ? getDiscipline(dl.disciplineId) : null;
      const topic = dl.topicId ? getTopic(dl.topicId) : null;
      push('Prazos', dl.title, DeadlineEngine.dueText(dl) + (disc ? ' · ' + disc.name : ''), 'i-plan', () => openDeadlineDrawer(dl.id),
        'prazo ' + deadlineTypeInfo(dl.type).label + ' ' + (disc ? disc.name : '') + ' ' + (topic ? topic.name : ''));
    });

    state.topics.filter(t => !t.archived).forEach(t => {
      const d = getDiscipline(t.disciplineId);
      if(!d || d.archived) return;
      push('Tópicos', t.name, disciplinePath(d), 'i-disc', () => openTopicPage(t.id), 'topico estudar ' + d.name);
    });

    /* v5.3 — a busca de comandos lê o MESMO índice da Ajuda: artigos,
       perguntas comuns e termos do glossário, sem lista paralela. */
    HELP_ARTICLES.forEach(a => {
      const group = a.section === 'aprender' ? 'Aprender a estudar' : 'Ajuda';
      push(group, a.title, articlePath(a), 'i-help', () => openHelpArticle(a.id),
           a.keywords + ' ' + a.summary + ' ' + a.oneLine);
    });
    GLOSSARY_KEYS.forEach(k => {
      const g = HELP_GLOSSARY[k];
      push('Glossário', g.term, g.short, 'i-help',
           () => { if(g.article) openHelpArticle(g.article); else { helpUi.route = { kind:'glossary', id:k }; setView('help'); } },
           (g.alias || '') + ' glossario termo significado');
    });
    HELP_FAQ.forEach(f => {
      push('Perguntas comuns', f.q, null, 'i-help',
           () => { helpUi.stack = [{ kind:'home' }]; helpUi.route = { kind:'faq', id:f.id }; helpClearSearch(); setView('help'); },
           f.a);
    });
    push('Ajuda', 'Como funcionam as revisões', 'explicação curta', 'i-help', () => openReviewPrimer(), 'revisao entender explicacao');
    push('Ajuda', 'Entrar em contato', CONTACT_EMAIL, 'i-mail', () => openContactDrawer(), 'contato email suporte duvida sugestao');
    push('Ajuda', 'Relatar um problema', 'copie o relato ou abra no e-mail', 'i-flag', () => openReportProblemDrawer(), 'bug erro problema suporte');

    this.items = items;
  },

  open(){
    if(this.isOpen) return;
    this.buildIndex();
    const root = document.getElementById('palette-root');
    const input = document.getElementById('palette-input');
    LayerFx.cancel(root);
    root.hidden = false;
    input.value = '';
    this.filter('');
    document.addEventListener('keydown', this._onKey, true);
    root.addEventListener('mousedown', this._onBackdrop);
    // Esc, Tab e rolagem de fundo ficam com a pilha; setas e Enter continuam aqui.
    this._layer = Overlay.open(root, root.querySelector('.palette'), () => Palette.close());
    // v6.2: foco imediato — quem digita logo depois do Ctrl + K não perde as primeiras letras
    try { input.focus({ preventScroll:true }); } catch(_){ input.focus(); }
    setTimeout(() => { if(this.isOpen && document.activeElement !== input) input.focus(); }, 30);
  },

  close(){
    const root = document.getElementById('palette-root');
    if(!root || root.hidden || LayerFx.isLeaving(root)) return;
    LayerFx.leave(root, MOTION.layerOut);
    document.removeEventListener('keydown', this._onKey, true);
    root.removeEventListener('mousedown', this._onBackdrop);
    Overlay.close(this._layer, { unlockAfter: MOTION.layerOut });
    this._layer = null;
  },

  get isOpen(){ const r = document.getElementById('palette-root'); return !!r && !r.hidden && !LayerFx.isLeaving(r); },

  filter(query){
    const q = normalizeText(query);
    if(!q){
      // sem texto: as telas e as ações mais comuns, nessa ordem
      this.filtered = this.items.filter(i => i.group === 'Telas').concat(this.items.filter(i => i.group === 'Ações').slice(0, 5));
    } else {
      const terms = q.split(' ').filter(Boolean);
      const groups = new Map();
      this.items.forEach(i => {
        if(!matchesTerms(i.n, terms)) return;
        let s = 0;
        if(i.nl === q) s += 30; else if(i.nl.startsWith(q)) s += 15; else if(i.nl.includes(q)) s += 8;
        s += terms.filter(t => i.nl.includes(t)).length * 2;     // termo no nome vale mais que termo no contexto
        if(!groups.has(i.group)) groups.set(i.group, []);
        groups.get(i.group).push({ i, s });
      });
      /* Agrupado por TIPO. Dentro do grupo, o melhor primeiro; entre grupos, o
         grupo com o melhor resultado primeiro (empate: dados do usuário antes da Ajuda). */
      const ordered = Array.from(groups.entries()).map(([g, list]) => {
        list.sort((a, b) => b.s - a.s || a.i.label.localeCompare(b.i.label, 'pt-BR', { numeric:true }));
        return { g, list: list.slice(0, PALETTE_GROUP_CAP[g] || 4), best: list[0].s };
      }).sort((a, b) => b.best - a.best || PALETTE_GROUPS.indexOf(a.g) - PALETTE_GROUPS.indexOf(b.g));
      this.filtered = [].concat(...ordered.map(x => x.list.map(y => y.i)));
    }
    this.index = 0;
    this.render();
  },

  render(){
    const list = document.getElementById('palette-list');
    clear(list);
    if(!this.filtered.length){
      list.appendChild(h('li', { class:'palette-empty', text:'Nada encontrado no Ciclo. Tente outra palavra.' }));
      return;
    }
    let lastGroup = null;
    const inputEl = $('#palette-input');
    const q = inputEl ? inputEl.value : '';          // v6.3: lido uma vez, não a cada item
    const frag = document.createDocumentFragment();  // um único anexo ao DOM
    this.filtered.forEach((item, i) => {
      if(item.group !== lastGroup){
        lastGroup = item.group;
        frag.appendChild(h('li', { class:'palette-group', text:item.group, role:'presentation' }));
      }
      const btn = h('button', { class:'palette-item', type:'button', role:'option', id:'pal-opt-' + i, tabindex:'-1',
        'aria-selected': i === this.index ? 'true' : 'false',
        onclick:() => this.run(i) },
        icon(item.icon, 'nav-icon'),
        h('span', { class:'pi-main' }, q.trim() ? highlightMatch(item.label, q) : item.label),
        item.sub ? h('span', { class:'pi-sub', text:item.sub }) : null);
      btn.addEventListener('mousemove', () => { if(this.index !== i){ this.index = i; this.syncSelection(); } });
      frag.appendChild(h('li', { role:'presentation' }, btn));
    });
    list.appendChild(frag);
    this.syncSelection();
  },

  syncSelection(){
    const btns = $$('#palette-list .palette-item');
    btns.forEach((b, i) => b.setAttribute('aria-selected', i === this.index ? 'true' : 'false'));
    const inp = $('#palette-input');
    if(inp){ if(btns[this.index]) inp.setAttribute('aria-activedescendant', btns[this.index].id); else inp.removeAttribute('aria-activedescendant'); }
    this.scrollToSelected();
  },

  scrollToSelected(){
    const btns = $$('#palette-list .palette-item');
    const el = btns[this.index];
    if(el && el.scrollIntoView) el.scrollIntoView({ block:'nearest' });
  },

  move(delta){
    if(!this.filtered.length) return;
    this.index = (this.index + delta + this.filtered.length) % this.filtered.length;
    this.syncSelection();
  },

  run(i){
    const item = this.filtered[i === undefined ? this.index : i];
    if(!item) return;
    this.close();
    try { item.run(); } catch(err){ console.error(err); toast('Não foi possível executar esta ação.', 'err'); }
  },

  _onKey(e){
    if(!Palette.isOpen) return;
    if(e.key === 'ArrowDown'){ e.preventDefault(); Palette.move(1); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); Palette.move(-1); }
    else if(e.key === 'Enter'){ e.preventDefault(); Palette.run(); }
  },
  _onBackdrop(e){ if(e.target === document.getElementById('palette-root')) Palette.close(); }
};

const NAV_ICONS = {
  today:'i-today', plan:'i-plan', reviews:'i-review', disciplines:'i-disc',
  analytics:'i-chart', history:'i-history', help:'i-help', data:'i-data', settings:'i-settings'
};

/* =========================================================================
   FOCUS MODE — estado visual da própria aplicação (sem Fullscreen API).
   ========================================================================= */
const FocusMode = {
  tick: null,
  _layer: null,
  _resting: null,
  enter(){
    if(!TimerService.isActive){ toast('Comece a estudar para usar o modo foco.', 'info'); return; }
    if(this.isOpen) return;
    const root = document.getElementById('focus-root');
    LayerFx.cancel(root);
    root.hidden = false;
    document.documentElement.classList.add('focus-active');
    this.render();
    this.tick = setInterval(() => this.renderClock(), 1000);
    this._layer = Overlay.open(root, root.querySelector('.focus-inner'), () => FocusMode.exit());
    const first = document.querySelector('#focus-actions button');
    if(first) setTimeout(() => { if(FocusMode.isOpen) first.focus(); }, 40);
  },
  exit(){
    const root = document.getElementById('focus-root');
    if(!root || root.hidden || LayerFx.isLeaving(root)) return;
    // a página volta a aparecer por baixo enquanto o modo foco se desfaz
    document.documentElement.classList.remove('focus-active');
    LayerFx.leave(root, MOTION.layerOut);
    clearInterval(this.tick); this.tick = null;
    Overlay.close(this._layer, { unlockAfter: MOTION.layerOut });
    this._layer = null;
  },
  get isOpen(){ const r = document.getElementById('focus-root'); return !!r && !r.hidden && !LayerFx.isLeaving(r); },
  render(opts){
    if(!TimerService.isActive){ this.exit(); return; }
    const o = opts || {};
    const d = TimerService.data;
    const disc = getDiscipline(d.disciplineId);
    const topic = d.topicId ? getTopic(d.topicId) : null;
    const resting = TimerService.isOnBreak;
    this._resting = resting;
    const root = document.getElementById('focus-root');
    root.setAttribute('data-state', resting ? 'rest' : 'study');
    document.getElementById('focus-disc').textContent = disc ? disc.name : '';
    document.getElementById('focus-topic').textContent = [topic ? topic.name : null, d.presetType ? sessionTypeLabel(d.presetType) : null].filter(Boolean).join(' · ');
    document.getElementById('focus-state').textContent = resting ? 'Descansando' : 'Estudando';
    document.getElementById('focus-sub').textContent = resting ? `Seu estudo está pausado em ${fmtTimer(TimerService.getElapsed())}.` : '';
    // v6.5: o aviso de que o cronômetro não pôde ser guardado aparece também aqui (a barra fica escondida no modo foco)
    const warn = document.getElementById('focus-warn');
    if(warn){
      const text = TimerService.persisted ? '' : 'Não foi possível garantir a recuperação deste cronômetro se a página for fechada. Finalize o estudo antes de sair.';
      if(warn.textContent !== text) warn.textContent = text;
      warn.hidden = !text;
    }
    this.renderClock();
    const actions = document.getElementById('focus-actions');
    const hadFocus = actions.contains(document.activeElement);
    mount(actions,
      h('button', { class:'btn ' + (resting ? 'primary' : 'ghost'), type:'button', 'data-fk':'focus-toggle',
        text: resting ? 'Voltar a estudar' : 'Descansar', onclick:toggleBreak }),
      h('button', { class:'btn ' + (resting ? 'ghost' : 'primary'), type:'button', text:'Finalizar estudo', onclick:() => { this.exit(); openFinishModal(); } }),
      h('button', { class:'btn ghost', type:'button', text:'Sair do foco', onclick:() => this.exit() })
    );
    if(hadFocus){ const b = actions.querySelector('[data-fk="focus-toggle"]'); if(b) b.focus(); }
    if(o.switched){ swapIn(document.getElementById('focus-state')); swapIn(document.getElementById('focus-clock')); }
  },
  /** A cada segundo, só o texto do relógio (o estado só muda nas transições). */
  renderClock(){
    if(!TimerService.isActive){ this.exit(); return; }
    const resting = TimerService.isOnBreak;
    if(resting !== this._resting){ this.render({ switched:true }); return; }    // trocado em outra aba
    const el = document.getElementById('focus-clock');
    const t = fmtTimer(resting ? TimerService.getBreakElapsed() : TimerService.getElapsed());
    if(el.textContent !== t) el.textContent = t;
  }
};

/* =========================================================================
   CENTRAL DE AJUDA (v5.3)};

/* =========================================================================
   CENTRAL DE AJUDA (v5.3)

   Princípio: a Ajuda precisa ajudar. Tem dúvida → encontra → entende →
   sabe o que fazer depois → volta a estudar.

   Uma só rota por vez, com pilha de volta. Não existe navegação circular:
   toda tela sabe de onde veio e para onde leva.

     home      pesquisa + dois caminhos + perguntas comuns + glossário
     section   um caminho, com seus grupos de tarefas
     article   um artigo, com trilha, exemplo, próximo passo e relacionados
     faq       perguntas por assunto
     glossary  todos os termos, em ordem alfabética
   ========================================================================= */
const helpUi = {
  route: { kind:'home' },
  stack: [],                 // rotas anteriores — o "voltar" nunca chuta
  query: '',                 // texto digitado na busca
  results: [],               // resultado atual (estado, não DOM)
  appResults: [],            // v6.2: funções do Ciclo relacionadas (depois das respostas)
  resultIndex: -1,           // resultado selecionado pelo teclado
  showAllResults: false,
  glossaryQuery: '',
  openFaq: null
};

const HELP_RESULTS_PREVIEW = 8;   // quantos resultados antes de "ver todos"

/* ---------- rotas ---------- */
function helpRouteEquals(a, b){
  return !!a && !!b && a.kind === b.kind && (a.id || null) === (b.id || null) && (a.group || null) === (b.group || null);
}

/** Navega para uma rota guardando a atual na pilha. */
function helpGo(route, opts){
  const o = opts || {};
  if(!helpRouteEquals(helpUi.route, route)){
    if(o.replace) helpUi.stack.pop();
    helpUi.stack.push(helpUi.route);
    if(helpUi.stack.length > 20) helpUi.stack.shift();
  }
  helpUi.route = route;
  helpClearSearch();
  renderHelp();
  helpScrollTop();
  // v6.2: cada página da Ajuda é uma entrada do histórico — o Voltar do navegador volta dentro da Ajuda
  if(ui.view === 'help') Nav.sync(o.replace ? 'replace' : 'push');
}

/** Volta um nível. Sem pilha, sobe para a Home — nunca para um lugar aleatório. */
function helpBack(){
  const target = helpUi.stack.length ? helpUi.stack[helpUi.stack.length - 1] : { kind:'home' };
  const prev = Nav.prev();
  // o destino é exatamente a página anterior do histórico: volta por ele (o Avançar continua valendo)
  if(prev && prev.v === 'help' && helpRouteEquals(normHelpRoute(prev.hr), normHelpRoute(target))){ history.back(); return; }
  helpUi.route = helpUi.stack.length ? helpUi.stack.pop() : { kind:'home' };
  helpClearSearch();
  renderHelp();
  helpScrollTop();
  Nav.sync('replace');
}

function helpClearSearch(){
  helpUi.query = '';
  helpUi.results = [];
  helpUi.appResults = [];
  helpUi.resultIndex = -1;
  helpUi.showAllResults = false;
}

function helpScrollTop(){
  window.scrollTo({ top:0, behavior:'auto' });     // v6.2: página nova começa no topo, sem esperar
}

/** Abre um artigo dentro da Central (com trilha) ou em painel, fora dela. */
function openHelpArticle(id, opts){
  const a = getArticle(id);
  if(!a) return;
  const o = opts || {};
  if(ui.view === 'help' && !o.forceDrawer){
    if(Drawer.isOpen) Drawer.close();
    helpGo({ kind:'article', id:a.id });
    return;
  }
  Drawer.open(a.title, articleBody(a, { inDrawer:true }));
}
/** Guias de "Aprender a estudar" e demonstrações viraram artigos comuns. */
function openStudyGuideDrawer(id){ openHelpArticle(id); }
function openInteractiveGuide(id){ openHelpArticle(LEGACY_GUIDE_TO_ARTICLE[id] || id); }

/* =========================================================================
   AÇÕES DE "PRÓXIMO PASSO"
   Cada botão diz o destino e leva de fato até lá. Nenhum "saiba mais".
   ========================================================================= */
/* =========================================================================
   v6.2 — FUNÇÕES DO CICLO: uma lista única de "o que dá para fazer", usada
   pela busca de comandos (grupo Ações) e pela busca da Ajuda ("No Ciclo").
   ========================================================================= */
function appFunctions(){
  const list = [
    { id:'register',   label:'Registrar estudo', sub:'guarde algo que você já estudou', icon:'i-plus', kw:'registrar lancar ja estudei passado horario duracao sessao manual', run:() => openRegisterModal() },
    { id:'quick',      label:'Começar a estudar', sub:'o Ciclo conta o tempo', icon:'i-play', kw:'estudar agora iniciar comecar timer cronometro sessao', run:() => openQuickStart() },
    { id:'addDisc',    label:'Adicionar disciplina', sub:'o que você está estudando', icon:'i-disc', kw:'disciplina materia nova criar adicionar', run:() => openDisciplineModal(null) },
    { id:'addArea',    label:'Nova área de estudo', sub:'um grupo para disciplinas relacionadas', icon:'i-disc', kw:'area organizar agrupar criar nova', run:() => openAreaModal(null) },
    { id:'addTopic',   label:'Adicionar tópico', sub:'uma parte de uma disciplina', icon:'i-disc', kw:'topico assunto novo criar adicionar', run:() => HELP_ACTIONS.addTopic() },
    { id:'addDeadline',label:'Adicionar prazo', sub:'prova, trabalho, projeto, tarefa ou entrega', icon:'i-plan', kw:'prazo prova trabalho entrega projeto tarefa data novo', run:() => openDeadlineModal(null) },
    { id:'discPrio',   label:'Editar prioridade de uma disciplina', sub:'de 1 (muito baixa) a 5 (muito alta)', icon:'i-disc', kw:'prioridade importancia disciplina mudar alterar editar', run:() => pickDisciplineForPriority() },
    { id:'topicPrio',  label:'Editar prioridade de um tópico', sub:'abre a disciplina; cada tópico tem a sua', icon:'i-disc', kw:'prioridade importancia topico mudar alterar editar', run:() => pickDisciplineThen('Em qual disciplina está o tópico?', d => openDisciplineDetail(d.id)) },
    { id:'reviewTime', label:'Revisar com o tempo que tenho', sub:'escolha quantos minutos', icon:'i-review', kw:'revisar revisao fila tempo sessao minutos', run:() => openSessionBuilder() },
    { id:'reviews',    label:'Abrir revisões pendentes', sub:null, icon:'i-review', kw:'revisar revisao fila pendentes hoje', run:() => setView('reviews') },
    { id:'deadlines',  label:'Ver prazos', sub:'em Disciplinas', icon:'i-plan', kw:'prazos provas entregas datas lista', run:() => { ui.discTab = 'deadlines'; setView('disciplines'); } },
    { id:'plan',       label:'Definir o tempo da semana', sub:'em Planejamento', icon:'i-plan', kw:'plano planejamento semana horas tempo semanal distribuir', run:() => setView('plan') },
    { id:'analyze',    label:'Analisar meus estudos', sub:'em Análises', icon:'i-chart', kw:'analise analisar relatorio progresso grafico', run:() => setView('analytics') },
    { id:'backup',     label:'Fazer backup agora', sub:'exporta o arquivo .json', icon:'i-data', kw:'backup exportar salvar copia dados', run:() => exportBackupWithFeedback() },
    { id:'restore',    label:'Restaurar um backup', sub:'em Dados', icon:'i-data', kw:'importar restaurar backup arquivo json recuperar', run:() => setView('data') },
    { id:'csv',        label:'Exportar histórico (.csv)', sub:'para planilha', icon:'i-data', kw:'planilha excel sessoes csv exportar', run:() => exportCSVWithFeedback() },
    { id:'theme',      label:'Alternar tema', sub:'claro ou escuro', icon:'i-sun', kw:'escuro claro dark light tema aparencia cor', run:() => toggleTheme() },
    { id:'settings',   label:'Abrir configurações', sub:null, icon:'i-settings', kw:'preferencias configuracoes animacoes densidade reduzir', run:() => setView('settings') }
  ];
  if(TimerService.isActive){
    list.unshift({ id:'finish', label:'Finalizar o estudo em andamento', sub:null, icon:'i-play', kw:'parar terminar sessao finalizar', run:() => openFinishModal() },
                 { id:'focus', label:'Entrar no modo foco', sub:null, icon:'i-focus', kw:'concentrar foco', run:() => FocusMode.enter() });
  }
  return list;
}
/** Funções cujo nome/descrição/palavras-chave contêm todos os termos. Nome começando pelo termo vem antes. */
function searchAppFunctions(query){
  const q = normalizeText(query);
  const terms = q.split(' ').filter(Boolean);
  if(!terms.length) return [];
  return appFunctions()
    .map(f => {
      const nl = normalizeText(f.label);
      if(!matchesTerms(normalizeText(f.label + ' ' + (f.sub || '') + ' ' + f.kw), terms)) return null;
      const score = (nl.startsWith(q) ? 20 : 0) + terms.filter(t => nl.includes(t)).length * 5;
      return { f, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.f.label.localeCompare(b.f.label, 'pt-BR'))
    .map(x => ({ kind:'app', id:x.f.id, title:x.f.label, path:'Função do Ciclo', snippet:x.f.sub || '', run:x.f.run }));
}

/** Escolher uma disciplina e seguir (uma só: segue direto). */
function pickDisciplineThen(title, fn){
  const list = activeDisciplines().slice().sort(sortByName);
  if(!list.length){ openDisciplineModal(null); return; }
  if(list.length === 1){ fn(list[0]); return; }
  openModal(close => ({
    title,
    content: h('div', { class:'ob-list pick-list' },
      list.slice(0, 60).map(d => h('button', { class:'btn ghost block', type:'button', onclick:() => { close(); fn(d); } },
        h('span', { text:d.name }), h('span', { class:'pick-sub', text: areaNameOf(d) })))),
    actions:[ h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }) ]
  }), { size:'narrow' });
}

const HELP_ACTIONS = {
  addDiscipline:   () => openDisciplineModal(null),
  addTopic:        () => { if(!activeDisciplines().length){ openDisciplineModal(null); return; } pickDisciplineThen('Em qual disciplina?', d => openTopicModal(d.id, null)); },
  addArea:         () => openAreaModal(null),
  addDeadline:     () => openDeadlineModal(null),
  quickStart:      () => openQuickStart(),
  plan:            () => setView('plan'),
  openReviews:     () => setView('reviews'),
  openDisciplines: () => setView('disciplines'),
  openAnalytics:   () => setView('analytics'),
  openHistory:     () => setView('history'),
  openToday:       () => setView('today'),
  openData:        () => setView('data'),
  openSettings:    () => setView('settings'),
  backupNow:       () => exportBackupWithFeedback(),
  reviewDemo:      () => openHelpArticle('o-que-e-revisao'),
  /* Abre o contexto certo em vez de uma tela genérica: com uma única
     disciplina, vai direto para a edição dela; com várias, deixa escolher. */
  editPriority:    () => pickDisciplineForPriority()
};

function runHelpAction(action){
  const fn = HELP_ACTIONS[action];
  if(!fn){ setView('today'); return; }
  if(Drawer.isOpen) Drawer.close();
  setTimeout(fn, Drawer.isOpen ? 180 : 0);
}

function pickDisciplineForPriority(){
  const list = activeDisciplines().slice().sort(sortByName);
  if(!list.length){ openDisciplineModal(null); return; }
  if(list.length === 1){ openDisciplineModal(list[0]); return; }
  openModal(close => ({
    title:'Qual prioridade você quer ajustar?',
    content: h('div', { class:'ob-list' },
      h('p', { class:'hint', style:'margin-bottom:10px', text:'Escolha uma disciplina para abrir a edição. A prioridade do tópico fica dentro dela.' }),
      list.slice(0, 12).map(d => h('button', { class:'btn ghost block', type:'button',
        onclick:() => { close(); openDisciplineModal(d); } },
        h('span', { text:d.name }), priorityChip(d.priority, { compact:true })))),
    actions:[ h('button', { class:'btn ghost', type:'button', text:'Cancelar', onclick:() => close() }) ]
  }), { size:'narrow' });
}

/* =========================================================================
   COMPONENTES DE ARTIGO
   ========================================================================= */

/** Parágrafo com termos de glossário. */
function proseP(text, cls){
  return h('p', { class: cls || null }, richText(text));
}

/** Modelo visual Área → Disciplina → Tópico (HTML/CSS, sem imagem). */
function guideTree(tree){
  if(!tree) return null;
  const box = h('div', { class:'tree' });
  if(tree.area) box.append(h('div', { class:'tree-area' }, h('span', { class:'tree-tag', text:AREA_TERM }), tree.area));
  box.append(h('div', { class:'tree-disc' },
    h('span', { class:'tree-tag', text:'Disciplina' }),
    h('span', { text:tree.discipline }),
    isNum(tree.priority) ? priorityChip(tree.priority, { compact:true }) : null));
  (tree.topics || []).forEach(t => {
    const name = (t && typeof t === 'object') ? t.name : t;
    const prio = (t && typeof t === 'object') ? t.priority : null;
    box.append(h('div', { class:'tree-topic' },
      h('span', { class:'tree-tag', text:'Tópico' }),
      h('span', { text:name }),
      isNum(prio) ? priorityChip(prio, { compact:true }) : null));
  });
  return box;
}

/** Aprofundamento recolhido: o artigo começa simples e cresce sob demanda. */
function detailsBlock(d){
  const body = h('div', { class:'hd-body', hidden:true }, renderHelpBlocks(d.content));
  const btn = h('button', { class:'hd-toggle', type:'button', 'aria-expanded':'false' },
    h('span', { text: d.title || 'Entenda em mais detalhes' }), icon('i-chev', 'chev'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    if(open) Motion.collapse(body); else Motion.expand(body);
  });
  return h('div', { class:'help-details' }, btn, body);
}

/** Demonstrações: 100% em memória, nunca tocam no IndexedDB. */
function demoBlock(kind){
  if(kind === 'review'){
    // o passo "ver como funciona" do checklist conta como visto
    setMeta('reviewDemoSeen', true).catch(err => console.error(err));
    return reviewDemoNode();
  }
  if(kind === 'plan')      return planDemoNode();
  if(kind === 'structure') return structureDemoNode();
  if(kind === 'priority')  return priorityDemoNode();
  return null;
}

function renderHelpBlocks(blocks){
  const out = [];
  (blocks || []).forEach(b => {
    if(b.h)     out.push(h('h4', { text:b.h }));
    if(b.p)     out.push(proseP(b.p));
    if(b.ul)    out.push(h('ul', null, b.ul.map(x => h('li', null, richText(x)))));
    if(b.ol)    out.push(h('ol', { class:'help-ol' }, b.ol.map(x => h('li', null, richText(x)))));
    if(b.steps) out.push(h('ol', { class:'help-steps' }, b.steps.map(x => h('li', null, h('span', { class:'hs-text' }, richText(x))))));
    if(b.note)  out.push(h('p', { class:'help-note' }, icon('i-info', 'nav-icon'), h('span', null, richText(b.note))));
    if(b.tree)  out.push(guideTree(b.tree));
    if(b.demo)  out.push(demoBlock(b.demo));
    if(b.details) out.push(detailsBlock(b.details));
  });
  return out.filter(Boolean);
}

/** Trilha clicável: sempre diz onde você está e como sair. */
function helpBreadcrumb(a){
  const s = helpSection(a.section), g = helpGroup(a.section, a.group);
  const crumb = (label, onClick, cls) => onClick
    ? h('button', { class:'crumb' + (cls ? ' ' + cls : ''), type:'button', text:label, onclick:onClick })
    : h('span', { class:'crumb is-current', text:label, 'aria-current':'page' });
  const sep = (cls) => h('span', { class:'crumb-sep' + (cls ? ' ' + cls : ''), 'aria-hidden':'true', text:'›' });
  /* No celular a trilha inteira ocuparia duas linhas: lá ficam só a seção e o
     grupo — o "voltar" acima já resolve o nível anterior e o título vem logo
     abaixo. As classes existem para isso, não por decoração. */
  return h('nav', { class:'help-crumbs', 'aria-label':'Você está em' },
    crumb('Ajuda', () => helpGo({ kind:'home' }), 'crumb-root'), sep('sep-root'),
    s ? [crumb(s.label, () => helpGo({ kind:'section', id:s.id })), sep()] : null,
    g ? [crumb(g.label, () => helpGo({ kind:'section', id:s.id, group:g.id })), sep('sep-current')] : null,
    crumb(a.title, null));
}

/** Corpo completo de um artigo — o MESMO na Central e no painel lateral. */
function articleBody(a, ctx){
  const c = ctx || {};
  const box = h('div', { class:'help-article prose' });

  if(c.inDrawer) box.append(h('p', { class:'hi-cat', text: articlePath(a) }));
  if(a.oneLine){
    box.append(h('p', { class:'one-line' },
      h('span', { class:'ol-tag', text:'Em uma frase' }), richText(a.oneLine)));
  }
  renderHelpBlocks(a.content).forEach(n => box.append(n));

  if(a.cta){
    box.append(h('div', { class:'help-cta' },
      h('p', { class:'card-title', text:'Próximo passo' }),
      h('button', { class:'btn primary sm', type:'button', text:a.cta.label,
        onclick:() => runHelpAction(a.cta.action) })));
  }

  const related = (a.related || []).map(getArticle).filter(Boolean).slice(0, 3);
  if(related.length){
    box.append(h('div', { class:'help-related' },
      h('p', { class:'card-title', text:'Relacionados' }),
      related.map(r => h('button', { class:'help-item', type:'button',
        onclick:() => openHelpArticle(r.id, { forceDrawer: !!c.inDrawer }) },
        h('span', { class:'hi-main' },
          h('div', { class:'hi-title', text:r.title }),
          h('div', { class:'hi-sum', text:r.summary })),
        icon('i-arrow', 'nav-icon')))));
  }

  if(c.inDrawer){
    box.append(h('div', { class:'drawer-note' },
      h('button', { class:'btn ghost sm', type:'button', text:'Ver este artigo na Central de Ajuda',
        onclick:() => { Drawer.close(); helpUi.stack = []; helpUi.route = { kind:'article', id:a.id }; helpClearSearch(); setView('help'); } })));
  }
  return box;
}

/* =========================================================================
   LISTAS E CARTÕES REUTILIZADOS
   ========================================================================= */
function helpItemButton(a, opts){
  const o = opts || {};
  return h('button', { class:'help-item', type:'button', onclick:() => openHelpArticle(a.id) },
    h('span', { class:'hi-main' },
      o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : null,
      h('div', { class:'hi-title', text:a.title }),
      h('div', { class:'hi-sum', text:a.summary })),
    icon('i-arrow', 'nav-icon'));
}

/** Pergunta do FAQ: resposta curta e, quando existe, o artigo completo. */
function faqNode(f, openByDefault){
  const item = h('div', { class:'faq-item' });
  const answer = h('div', { class:'faq-a', hidden: !openByDefault },
    h('p', { text:f.a }),
    f.article && getArticle(f.article)
      ? h('button', { class:'linkbtn', type:'button', text:'Ver explicação completa: ' + getArticle(f.article).title,
          onclick:() => openHelpArticle(f.article) })
      : null);
  const q = h('button', { class:'faq-q', type:'button', 'aria-expanded': openByDefault ? 'true' : 'false' },
    h('span', { text:f.q }), icon('i-chev', 'chev'));
  q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') === 'true';
    q.setAttribute('aria-expanded', open ? 'false' : 'true');
    if(open) Motion.collapse(answer); else Motion.expand(answer);
    helpUi.openFaq = open ? null : f.id;
  });
  item.append(q, answer);
  return item;
}

/* =========================================================================
   BUSCA — o caminho mais curto para uma resposta.
   O estado da seleção é explícito (helpUi.resultIndex); o DOM apenas reflete.
   ========================================================================= */
let helpInputEl = null;

function helpSearchCard(compact){
  const input = h('input', {
    type:'search', id:'help-q', value: helpUi.query, autocomplete:'off', spellcheck:'false',
    placeholder: (window.innerWidth < 620 ? 'Pesquise uma dúvida…' : 'Pesquise uma dúvida, função ou conceito…'),
    'aria-label':'Pesquisar na Ajuda',
    role:'combobox', 'aria-expanded': helpUi.query.trim() ? 'true' : 'false',
    'aria-controls':'help-results-list', 'aria-autocomplete':'list'
  });
  helpInputEl = input;

  input.addEventListener('input', () => {
    helpUi.query = input.value;
    helpUi.resultIndex = -1;
    helpUi.showAllResults = false;
    helpSearchAll(helpUi.query);
    renderHelpPanel();
  });
  input.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowDown'){ e.preventDefault(); helpMoveResult(1); }
    else if(e.key === 'ArrowUp'){ e.preventDefault(); helpMoveResult(-1); }
    else if(e.key === 'Enter'){
      const list = helpVisibleResults();
      if(!list.length) return;
      e.preventDefault();
      helpOpenResult(list[Math.max(0, helpUi.resultIndex)]);
    } else if(e.key === 'Escape'){
      if(helpUi.query){
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        helpClearSearch();
        renderHelpPanel();
      }
    }
  });

  const clearBtn = h('button', { class:'help-search-clear icon-btn', type:'button', 'aria-label':'Limpar busca',
    hidden: !helpUi.query,
    onclick:() => { input.value = ''; helpClearSearch(); renderHelpPanel(); input.focus(); } }, icon('i-close'));
  input.addEventListener('input', () => { clearBtn.hidden = !input.value; });

  return h('div', { class:'card help-searchcard' + (compact ? ' compact' : '') },
    h('div', { class:'help-search' }, icon('i-search'), input, clearBtn),
    compact ? null : h('p', { class:'help-search-ex' },
      h('span', { class:'hse-label', text:'Exemplos:' }),
      HELP_SEARCH_EXAMPLES.map(x =>
        h('button', { class:'linkbtn', type:'button', text:'“' + x + '”',
          onclick:() => helpRunSearch(x) }))));
}

/** Executa uma busca a partir de um atalho (sugestão, exemplo). */
function helpRunSearch(text){
  helpUi.query = text;
  helpUi.resultIndex = -1;
  helpUi.showAllResults = false;
  helpSearchAll(text);
  if(helpInputEl) helpInputEl.value = text;
  renderHelpPanel();
  if(helpInputEl) helpInputEl.focus();
}

/* v6.2 — busca HÍBRIDA da Ajuda: primeiro as respostas (artigos, perguntas,
   glossário); depois, separadas, as funções do Ciclo relacionadas à dúvida
   ("Editar prioridade de uma disciplina"). Nunca dados do usuário aqui. */
function helpSearchAll(query){
  helpUi.results = searchHelp(query);
  helpUi.appResults = normalizeText(query).length >= 2 ? searchAppFunctions(query).slice(0, 5) : [];
}
function helpVisibleResults(){
  const helpList = helpUi.showAllResults ? helpUi.results : helpUi.results.slice(0, HELP_RESULTS_PREVIEW);
  return helpList.concat(helpUi.appResults || []);
}

function helpMoveResult(delta){
  const list = helpVisibleResults();
  if(!list.length) return;
  const i = helpUi.resultIndex;
  helpUi.resultIndex = (i < 0)
    ? (delta > 0 ? 0 : list.length - 1)
    : (i + delta + list.length) % list.length;
  helpSyncResultSelection();
}

function helpSyncResultSelection(){
  const nodes = $$('#help-results-list .help-result');
  nodes.forEach((el, i) => {
    const on = i === helpUi.resultIndex;
    el.setAttribute('aria-selected', on ? 'true' : 'false');
    el.classList.toggle('is-selected', on);
  });
  const sel = nodes[helpUi.resultIndex];
  if(helpInputEl) helpInputEl.setAttribute('aria-activedescendant', sel ? sel.id : '');
  if(sel && sel.scrollIntoView) sel.scrollIntoView({ block:'nearest' });
}

function helpOpenResult(entry){
  if(!entry) return;
  if(entry.kind === 'article'){ helpGo({ kind:'article', id:entry.id }); return; }
  if(entry.kind === 'term'){ helpGo({ kind:'glossary', id:entry.id }); return; }
  if(entry.kind === 'faq'){ helpGo({ kind:'faq', id:entry.id }); return; }
  if(entry.kind === 'app'){ try { entry.run(); } catch(err){ console.error(err); toast('Não foi possível abrir esta função.', 'err'); } }
}

function helpResultsPanel(){
  const q = helpUi.query.trim();
  const box = h('div', { class:'help-results' });

  if(q.length < 2){
    box.append(h('div', { class:'card' },
      h('p', { class:'card-title', text:'Continue digitando' }),
      h('p', { class:'hint', text:'A busca começa com duas letras. Enquanto isso, estas são as dúvidas mais comuns:' }),
      helpSuggestionList()));
    return box;
  }

  const all = helpUi.results;
  const apps = helpUi.appResults || [];
  const list = helpVisibleResults();

  const head = h('div', { class:'help-results-head' },
    h('p', { class:'help-results-title', text:'Resultados para “' + q + '”' }),
    h('p', { class:'hint', text: all.length
      ? (all.length === 1 ? '1 resultado na Ajuda' : all.length + ' resultados na Ajuda')
      : (apps.length ? 'nada na Ajuda · ' + plural(apps.length, 'função do Ciclo', 'funções do Ciclo') : 'nenhum resultado') }));

  if(!all.length && !apps.length){
    box.append(h('div', { class:'card' }, head,
      h('p', { class:'prose', style:'margin-top:8px', text:'Não encontramos “' + q + '”. Tente pesquisar com menos palavras ou pelo nome da função.' }),
      h('p', { class:'card-title', style:'margin-top:16px', text:'Sugestões' }),
      helpSuggestionList(),
      h('div', { class:'row auto', style:'margin-top:14px' },
        h('button', { class:'btn ghost sm', type:'button', text:'Voltar para toda a Ajuda',
          onclick:() => { helpClearSearch(); if(helpInputEl) helpInputEl.value = ''; helpGo({ kind:'home' }); } }))));
    return box;
  }

  const ul = h('ul', { class:'help-results-list', id:'help-results-list', role:'listbox',
                       'aria-label':'Resultados da busca' });
  let appHeadDone = false;
  list.forEach((e, i) => {
    if(e.kind === 'app' && !appHeadDone){
      appHeadDone = true;
      ul.append(h('li', { class:'help-results-group', role:'presentation', text:'No Ciclo' }));
    }
    const id = 'help-result-' + i;
    const btn = h('button', {
      class:'help-result' + (e.kind === 'app' ? ' is-app' : '') + (i === helpUi.resultIndex ? ' is-selected' : ''),
      id, type:'button', role:'option', 'aria-selected': i === helpUi.resultIndex ? 'true' : 'false',
      onclick:() => helpOpenResult(e)
    },
      h('span', { class:'hr-main' },
        h('span', { class:'hr-path', text: e.path }),
        h('span', { class:'hr-title', text:e.title }),
        e.snippet ? h('span', { class:'hr-snippet', text:e.snippet }) : null));
    btn.addEventListener('mousemove', () => {
      if(helpUi.resultIndex !== i){ helpUi.resultIndex = i; helpSyncResultSelection(); }
    });
    ul.append(h('li', { role:'presentation' }, btn));
  });

  const card = h('div', { class:'card' }, head, ul);
  if(all.length > list.length - apps.length){
    card.append(h('button', { class:'btn ghost sm', type:'button', style:'margin-top:12px',
      text:'Ver todos os ' + all.length + ' resultados',
      onclick:() => { helpUi.showAllResults = true; renderHelpPanel(); if(helpInputEl) helpInputEl.focus(); } }));
  }
  card.append(h('p', { class:'hint help-keys' }, 'Use ', h('kbd', { text:'↓' }), h('kbd', { text:'↑' }),
    ' para navegar, ', h('kbd', { text:'Enter' }), ' para abrir e ', h('kbd', { text:'Esc' }), ' para limpar.'));
  box.append(card);
  return box;
}

function helpSuggestionList(){
  return h('div', { class:'help-suggest' }, HELP_SEARCH_SUGGESTIONS.map(s =>
    h('button', { class:'help-suggest-item', type:'button', onclick:() => helpRunSearch(s) },
      icon('i-search', 'nav-icon'), h('span', { text:s }))));
}

/* =========================================================================
   RENDER — a tela da Ajuda
   ========================================================================= */
function renderHelp(){
  const root = $('#help-body');
  const compact = helpUi.route.kind === 'article';
  mount(root, helpSearchCard(compact), h('div', { id:'help-panel' }));
  renderHelpPanel();
}

function renderHelpPanel(){
  const box = $('#help-panel');
  if(!box) return;
  // o popover aponta para um termo que está prestes a sair do DOM
  GlossaryPopover.close();
  clear(box);
  const searching = !!helpUi.query.trim();
  const card = $('.help-searchcard');
  if(card) card.classList.toggle('is-searching', searching);
  if(helpInputEl) helpInputEl.setAttribute('aria-expanded', searching ? 'true' : 'false');

  if(searching){ box.append(helpResultsPanel()); return; }

  switch(helpUi.route.kind){
    case 'section':  helpSectionPanel(box); break;
    case 'article':  helpArticlePanel(box); break;
    case 'faq':      helpFaqPanel(box); break;
    case 'glossary': helpGlossaryPanel(box); break;
    default:         helpHomePanel(box);
  }
}

/* ---------- HOME ---------- */
function helpHomePanel(box){
  const first = getArticle('primeiros-passos');
  /* os dois caminhos — a porta principal depois da busca */
  box.append(h('div', { class:'help-section-head' }, h('h3', { text:'O que você precisa?' })));
  box.append(h('div', { class:'help-paths' }, HELP_SECTIONS.map(s =>
    h('button', { class:'help-path', type:'button', onclick:() => helpGo({ kind:'section', id:s.id }) },
      h('span', { class:'hp-icon' }, icon(s.icon, 'nav-icon')),
      h('span', { class:'hp-title', text:s.label }),
      h('span', { class:'hp-sub', text:s.short }),
      h('span', { class:'hp-go' }, h('span', { text:'Explorar' }), icon('i-arrow', 'nav-icon'))))));

  /* perguntas comuns — lista simples, sem moldura */
  const faqs = HELP_HOME_FAQ.map(id => HELP_FAQ_BY_ID.get(id)).filter(Boolean);
  box.append(h('section', { class:'help-plain' },
    h('div', { class:'help-plain-head' },
      h('h3', { class:'block-label', text:'Perguntas comuns' }),
      h('button', { class:'linkbtn', type:'button', text:'Ver todas', onclick:() => helpGo({ kind:'faq' }) })),
    faqs.map(f => faqNode(f, false))));

  /* apoio: uma linha, sem cartões concorrentes */
  box.append(h('section', { class:'help-plain' },
    h('h3', { class:'block-label', text:'Mais ajuda' }),
    h('ul', { class:'line-list' },
      first ? h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => helpGo({ kind:'article', id:first.id }) },
        h('span', { class:'line-t', text:'Primeiros passos' }), h('span', { class:'line-s', text:'O essencial para começar em poucos minutos.' })), icon('i-arrow', 'nav-icon line-go')) : null,
      h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => helpGo({ kind:'glossary' }) },
        h('span', { class:'line-t', text:'Glossário' }), h('span', { class:'line-s', text:'Consolidação, plano semanal, revisão espaçada… cada termo em uma linha.' })), icon('i-arrow', 'nav-icon line-go')),
      h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => openContactDrawer() },
        h('span', { class:'line-t', text:'Entrar em contato' }), h('span', { class:'line-s num', text: CONTACT_EMAIL })), icon('i-mail', 'nav-icon line-go')),
      h('li', { class:'line' }, h('button', { class:'line-main', type:'button', onclick:() => openReportProblemDrawer() },
        h('span', { class:'line-t', text:'Relatar um problema' }), h('span', { class:'line-s', text:'Monte um relato técnico, sem seus dados de estudo.' })), icon('i-flag', 'nav-icon line-go')))));
}

/* ---------- UM CAMINHO ---------- */
function helpSectionPanel(box){
  const s = helpSection(helpUi.route.id);
  if(!s){ helpGo({ kind:'home' }); return; }
  const onlyGroup = helpUi.route.group || null;

  box.append(helpBackBar('Ajuda'));

  /* alternar entre os dois caminhos, com estado ativo claro */
  box.append(h('div', { class:'help-switch', role:'tablist', 'aria-label':'Caminhos da Ajuda' },
    HELP_SECTIONS.map(x => h('button', {
      class:'help-switch-btn' + (x.id === s.id ? ' is-active' : ''), type:'button',
      role:'tab', 'aria-selected': x.id === s.id ? 'true' : 'false',
      text:x.label, onclick:() => { if(x.id !== s.id) helpGo({ kind:'section', id:x.id }); } }))));

  box.append(h('div', { class:'help-section-head' },
    h('h3', { text:s.label }),
    h('p', { class:'sub', text:s.short })));

  s.groups
    .filter(g => !onlyGroup || g.id === onlyGroup)
    .forEach(g => {
      const list = articlesOf(s.id, g.id);
      if(!list.length) return;                        // nunca desenha grupo vazio
      const card = h('div', { class:'card help-group' + (onlyGroup === g.id ? ' is-active' : '') },
        h('p', { class:'help-group-title', text:g.label }));
      list.forEach(a => card.append(helpItemButton(a)));
      box.append(card);
    });

  if(onlyGroup){
    box.append(h('div', { class:'row auto' },
      h('button', { class:'btn ghost sm', type:'button', text:'Ver todo o caminho “' + s.label + '”',
        onclick:() => helpGo({ kind:'section', id:s.id }) })));
  }
}

/* ---------- UM ARTIGO ---------- */
function helpArticlePanel(box){
  const a = getArticle(helpUi.route.id);
  if(!a){ helpGo({ kind:'home' }); return; }
  box.append(helpBackBar(helpBackLabel()));
  box.append(helpBreadcrumb(a));
  box.append(h('div', { class:'card help-article-card' },
    h('h3', { class:'help-article-title', text:a.title }),
    articleBody(a, { inDrawer:false })));
}

/** O rótulo do "voltar" diz para onde vai — nunca "voltar" genérico. */
function helpBackLabel(){
  const prev = helpUi.stack.length ? helpUi.stack[helpUi.stack.length - 1] : null;
  if(!prev) return 'Ajuda';
  if(prev.kind === 'home') return 'Ajuda';
  if(prev.kind === 'faq') return 'Perguntas comuns';
  if(prev.kind === 'glossary') return 'Glossário';
  if(prev.kind === 'section'){
    const s = helpSection(prev.id);
    const g = prev.group ? helpGroup(prev.id, prev.group) : null;
    return g ? g.label : (s ? s.label : 'Ajuda');
  }
  if(prev.kind === 'article'){
    const a = getArticle(prev.id);
    return a ? a.title : 'Ajuda';
  }
  return 'Ajuda';
}

function helpBackBar(label){
  return h('div', { class:'help-back' },
    h('button', { class:'help-back-btn', type:'button', onclick:() => helpBack() },
      icon('i-chev', 'back-chev'), h('span', { text: label })));
}

/* ---------- FAQ ---------- */
function helpFaqPanel(box){
  const openId = helpUi.route.id || null;
  box.append(helpBackBar('Ajuda'));
  box.append(h('div', { class:'help-section-head' },
    h('h3', { text:'Perguntas comuns' }),
    h('p', { class:'sub', text:'Respostas curtas. Quando existe uma explicação completa, o link está dentro da resposta.' })));

  let target = null;
  HELP_FAQ_GROUPS.forEach(g => {
    const list = HELP_FAQ.filter(f => f.g === g.id);
    if(!list.length) return;
    const card = h('div', { class:'card' }, h('p', { class:'help-group-title', text:g.label }));
    list.forEach(f => {
      const node = faqNode(f, f.id === openId);
      if(f.id === openId) target = node;
      card.append(node);
    });
    box.append(card);
  });

  if(target) setTimeout(() => {
    try { target.scrollIntoView({ block:'center', behavior: state.settings.reduceMotion ? 'auto' : 'smooth' }); } catch(_){}
    const btn = target.querySelector('.faq-q');
    if(btn) btn.focus({ preventScroll:true });
  }, 60);
}

/* ---------- GLOSSÁRIO ---------- */
function helpGlossaryPanel(box){
  const focusKey = helpUi.route.id || null;
  box.append(helpBackBar('Ajuda'));
  box.append(h('div', { class:'help-section-head' },
    h('h3', { text:'Glossário' }),
    h('p', { class:'sub', text:'Os termos usados na interface, explicados em uma linha. Cada um leva à explicação completa.' })));

  const listBox = h('div', { class:'glossary-index' });
  const filterInput = h('input', { type:'search', id:'gloss-q', value: helpUi.glossaryQuery,
    placeholder:'Filtrar termos…', 'aria-label':'Filtrar termos do glossário', autocomplete:'off' });
  filterInput.addEventListener('input', () => {
    helpUi.glossaryQuery = filterInput.value;
    drawGlossary(listBox, null);
  });

  box.append(h('div', { class:'card' },
    h('div', { class:'help-search compact' }, icon('i-search'), filterInput),
    listBox));

  drawGlossary(listBox, focusKey);
}

function drawGlossary(listBox, focusKey){
  clear(listBox);
  const q = normalizeText(helpUi.glossaryQuery);
  const keys = GLOSSARY_KEYS.filter(k => {
    if(!q) return true;
    const g = HELP_GLOSSARY[k];
    return normalizeText(g.term + ' ' + g.short + ' ' + (g.alias || '')).includes(q);
  });

  if(!keys.length){
    listBox.append(h('p', { class:'hint', style:'margin-top:12px',
      text:'Nenhum termo com “' + helpUi.glossaryQuery + '”. Tente pesquisar na Ajuda inteira.' }));
    return;
  }

  let letter = null, target = null;
  keys.forEach(k => {
    const g = HELP_GLOSSARY[k];
    const L = g.term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
    if(L !== letter){
      letter = L;
      listBox.append(h('p', { class:'gloss-letter', text:L, 'aria-hidden':'true' }));
    }
    const isFocus = focusKey === k;
    const item = h('div', { class:'gloss-entry' + (isFocus ? ' is-selected' : '') },
      h('p', { class:'ge-term', text:g.term }),
      h('p', { class:'ge-def', text:g.short }),
      g.article && getArticle(g.article)
        ? h('button', { class:'linkbtn', type:'button', text: glossaryCallLabel(k),
            onclick:() => openHelpArticle(g.article) })
        : null);
    if(isFocus) target = item;
    listBox.append(item);
  });

  if(target) setTimeout(() => {
    try { target.scrollIntoView({ block:'center', behavior: state.settings.reduceMotion ? 'auto' : 'smooth' }); } catch(_){}
  }, 60);
}

/* =========================================================================
   CONTATO E RELATO DE PROBLEMA (v5.1)
   O Ciclo não envia e-mails. `mailto:` é só uma conveniência: depende de um
   aplicativo de e-mail configurado no aparelho e, sem ele, o navegador pode
   simplesmente não fazer nada. Por isso todo fluxo oferece um caminho que
   sempre funciona — copiar o endereço ou o texto — e nunca diz "enviado".
   ========================================================================= */
const MAIL_SUBJECT_CONTACT = '[Ciclo] Contato';
const MAIL_SUBJECT_REPORT = '[Ciclo] Relato de problema';

/** Abre o aplicativo de e-mail do sistema, se houver um. Não garante nada. */
function openMail(subject, body){
  // Chamado também como handler: ignora um Event recebido por engano.
  const subj = typeof subject === 'string' && subject ? subject : MAIL_SUBJECT_CONTACT;
  const text = typeof body === 'string' ? body : '';
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}${text ? '&body=' + encodeURIComponent(text) : ''}`;
  try {
    const a = document.createElement('a');
    a.href = href;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch(err){
    console.error('Falha ao acionar mailto:', err);
  }
  toast('Se nenhum aplicativo de e-mail abrir, use "Copiar" e envie pelo seu serviço de e-mail.', 'info',
    { title:'Pedimos ao sistema para abrir seu e-mail', duration:6000 });
}

/**
 * Copia texto para a área de transferência.
 * 1) Clipboard API  2) textarea temporário + execCommand('copy')  3) false.
 * Devolve true/false — quem chama decide o que mostrar se falhar.
 */
async function copyToClipboard(text){
  const value = String(text == null ? '' : text);
  try {
    if(navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext !== false){
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch(err){
    console.warn('Clipboard API indisponível ou negada; tentando alternativa.', err);
  }
  const previousFocus = document.activeElement;
  let ta = null;
  try {
    ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.setAttribute('aria-hidden', 'true');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, value.length);
    const ok = typeof document.execCommand === 'function' && document.execCommand('copy');
    return !!ok;
  } catch(err){
    console.warn('Cópia alternativa falhou.', err);
    return false;
  } finally {
    if(ta) ta.remove();
    if(previousFocus && typeof previousFocus.focus === 'function' && document.contains(previousFocus)){
      try { previousFocus.focus({ preventScroll:true }); } catch(_){ previousFocus.focus(); }
    }
  }
}

/** Seleciona o conteúdo de um campo para cópia manual (último recurso). */
function selectForManualCopy(field){
  if(!field) return;
  field.focus();
  try { field.select(); field.setSelectionRange(0, field.value.length); } catch(_){}
  const box = field.closest('.copy-box');
  if(box){
    box.classList.remove('needs-manual');
    void box.offsetWidth;                       // reinicia o destaque
    box.classList.add('needs-manual');
  }
}

function openContactDrawer(){
  const mailField = h('input', { class:'copy-field num', type:'text', readonly:true, value: CONTACT_EMAIL,
    id:'contact-mail-field', 'aria-label':'Endereço de e-mail do Ciclo', spellcheck:'false' });
  mailField.addEventListener('focus', () => mailField.select());
  mailField.addEventListener('click', () => mailField.select());

  const status = h('p', { class:'copy-status', role:'status', 'aria-live':'polite' });

  const doCopy = once(async () => {
    const ok = await copyToClipboard(CONTACT_EMAIL);
    if(ok){
      status.textContent = 'Endereço copiado. Cole no seu serviço de e-mail.';
      status.dataset.kind = 'ok';
      toast('Cole o endereço no seu serviço de e-mail.', 'ok', { title:'E-mail copiado' });
    } else {
      status.textContent = 'Não foi possível copiar automaticamente. Selecione o endereço acima e copie.';
      status.dataset.kind = 'warn';
      selectForManualCopy(mailField);
      toast('Selecione o endereço acima e copie manualmente.', 'warn', { title:'Não foi possível copiar automaticamente' });
    }
  });

  const body = h('div', { class:'contact-drawer' },
    h('p', { class:'prose', text:'Dúvidas, sugestões, ideias ou problemas — escreva para este endereço.' }),
    h('div', { class:'copy-box' },
      h('label', { for:'contact-mail-field', text:'E-mail' }),
      h('div', { class:'copy-row' },
        mailField,
        h('button', { class:'btn primary sm', type:'button', onclick:doCopy }, icon('i-copy'), 'Copiar endereço'))),
    status,
    h('div', { class:'row auto', style:'margin-top:4px' },
      h('button', { class:'btn ghost sm', type:'button', onclick:() => openMail(MAIL_SUBJECT_CONTACT) }, icon('i-mail'), 'Abrir aplicativo de e-mail')),
    h('p', { class:'hint', style:'margin-top:14px', text:'Se nenhum aplicativo abrir, copie o endereço acima e use seu serviço de e-mail normalmente.' }),
    h('div', { class:'drawer-note' },
      h('p', { class:'hint', text:'O Ciclo não envia mensagens por conta própria e não se conecta à internet. Você escolhe como e quando escrever.' }),
      h('button', { class:'linkbtn', type:'button', text:'Encontrou um problema? Relatar', onclick:() => openReportProblemDrawer() })));
  Drawer.open('Entrar em contato', body);
}

/** Informações técnicas do relato. Nunca inclui dado de estudo. */
function reportTechInfo(){
  const current = VIEW_TITLES[ui.view] || ui.view;
  const before = ui.prevView && ui.prevView !== ui.view ? VIEW_TITLES[ui.prevView] : null;
  return [
    ['Versão', APP_VERSION],
    ['Tela', before ? `${current} (antes: ${before})` : current],
    ['Navegador', navigator.userAgent || 'desconhecido'],
    ['Idioma', navigator.language || 'desconhecido'],
    ['Janela', `${window.innerWidth}×${window.innerHeight}`]
  ];
}

function buildReportText(description, info){
  const desc = str(description).trim();
  return [
    'Ciclo — Relato de problema',
    '',
    'Descrição:',
    desc || '(descreva aqui o que aconteceu)',
    '',
    'Informações técnicas:',
    ...info.map(([k, v]) => `${k}: ${v}`),
    '',
    'Nenhum dado de estudo foi incluído neste relato.'
  ].join('\n');
}

function openReportProblemDrawer(){
  const info = reportTechInfo();
  const descField = h('textarea', { id:'report-desc', rows:'6', maxlength:'4000',
    placeholder:'Ex.: O botão X não responde quando eu clico depois de registrar um estudo.' });
  const preview = h('pre', { class:'report-preview' });
  const syncPreview = () => { preview.textContent = buildReportText(descField.value, info); };
  descField.addEventListener('input', syncPreview);
  syncPreview();

  const status = h('p', { class:'copy-status', role:'status', 'aria-live':'polite' });

  const doCopy = once(async () => {
    if(!descField.value.trim()){
      status.textContent = 'Escreva o que aconteceu antes de copiar.';
      status.dataset.kind = 'warn';
      descField.setAttribute('aria-invalid', 'true');
      descField.focus();
      return;
    }
    descField.removeAttribute('aria-invalid');
    const text = buildReportText(descField.value, info);
    const ok = await copyToClipboard(text);
    if(ok){
      status.textContent = `Relato copiado. Envie para ${CONTACT_EMAIL} pelo seu serviço de e-mail.`;
      status.dataset.kind = 'ok';
      toast(`Cole o texto em um e-mail para ${CONTACT_EMAIL}.`, 'ok', { title:'Relato copiado' });
    } else {
      status.textContent = 'Não foi possível copiar automaticamente. Abra "Ver o texto completo" e copie manualmente.';
      status.dataset.kind = 'warn';
      details.open = true;
      const range = document.createRange();
      range.selectNodeContents(preview);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      toast('Abra "Ver o texto completo" e copie manualmente.', 'warn', { title:'Não foi possível copiar automaticamente' });
    }
  });

  descField.addEventListener('input', () => {
    if(descField.value.trim()){ descField.removeAttribute('aria-invalid'); if(status.dataset.kind === 'warn'){ status.textContent = ''; delete status.dataset.kind; } }
  });

  const details = h('details', { class:'report-details' },
    h('summary', { text:'Ver o texto completo' }),
    preview);

  const body = h('div', { class:'report-drawer' },
    h('p', { class:'prose', text:'Conte o que aconteceu. Quanto mais específico, mais fácil entender e corrigir.' }),
    h('div', { class:'field' }, h('label', { for:'report-desc', text:'O que aconteceu?' }), descField),
    h('div', { class:'report-tech' },
      h('p', { class:'report-tech-title', text:'Informações técnicas que serão incluídas' }),
      h('dl', { class:'tech-list' }, info.map(([k, v]) => h('div', null, h('dt', { text:k }), h('dd', { text:v })))),
      h('p', { class:'privacy-note' }, icon('i-check', 'nav-icon'),
        h('span', { text:'Nenhuma disciplina, tópico, comentário ou outro dado de estudo é incluído.' }))),
    details,
    status,
    h('div', { class:'row auto', style:'margin-top:6px' },
      h('button', { class:'btn primary sm', type:'button', onclick:doCopy }, icon('i-copy'), 'Copiar relato'),
      h('button', { class:'btn ghost sm', type:'button',
        onclick:() => openMail(MAIL_SUBJECT_REPORT, buildReportText(descField.value, info)) }, icon('i-mail'), 'Abrir no e-mail')),
    h('p', { class:'hint', style:'margin-top:12px', text:`Nada é enviado automaticamente. Se o e-mail não abrir, copie o relato e envie para ${CONTACT_EMAIL}.` }));
  Drawer.open('Relatar um problema', body);
}

/* =========================================================================
   AJUDA DESTA TELA
   ========================================================================= */
/**
 * Explicação curta da tela atual: o que dá para fazer aqui, o que os números
 * significam e qual o próximo passo. Nunca abre um artigo inteiro quando três
 * linhas resolvem — o aprofundamento fica em "Leia também", nomeado.
 */
function openScreenHelp(){
  const s = SCREEN_HELP[ui.view];
  if(!s){ setView('help'); return; }
  const articles = (s.articles || []).map(getArticle).filter(Boolean).slice(0, 4);
  const body = h('div',
    h('p', { class:'prose', style:'margin-bottom:14px', text:s.intro }),
    h('ul', { class:'reasons' }, s.points.map(p => h('li', null, richText(p)))),
    s.cta ? h('div', { class:'help-cta' },
      h('p', { class:'card-title', text:'Próximo passo' }),
      h('button', { class:'btn primary sm', type:'button', text:s.cta.label,
        onclick:() => runHelpAction(s.cta.action) })) : null,
    articles.length ? h('div', { class:'help-related' },
      h('p', { class:'card-title', text:'Leia também' }),
      articles.map(a => h('button', { class:'help-item', type:'button',
        onclick:() => openHelpArticle(a.id, { forceDrawer:true }) },
        h('span', { class:'hi-main' },
          h('div', { class:'hi-title', text:a.title }),
          h('div', { class:'hi-sum', text:a.summary })),
        icon('i-arrow', 'nav-icon')))) : null,
    h('div', { class:'drawer-note' },
      h('button', { class:'btn ghost sm', type:'button', text:'Abrir a Central de Ajuda',
        onclick:() => { Drawer.close(); helpUi.stack = []; helpUi.route = { kind:'home' }; helpClearSearch(); setView('help'); } }))
  );
  Drawer.open('Ajuda · ' + s.title, body);
}

/* =========================================================================
   DICAS DE PRIMEIRA VISITA — uma vez só, nunca bloqueiam a interface.
   ========================================================================= */
const FIRST_TIPS = {
  plan:        { id:'plan-intro',        title:'Seu plano é semanal e flexível',
                 text:'Você define quanto pretende estudar por semana; não precisa escolher horários fixos nem estudar todo dia.' },
  reviews:     { id:'reviews-intro',     title:'As revisões aparecem sozinhas',
                 text:'Depois de estudar um tópico, ele entra automaticamente no ciclo de revisão e volta aqui quando chegar a hora.' },
  disciplines: { id:'disciplines-v52',   title:'Seus estudos, organizados como um índice',
                 text:'Abra uma área para ver as disciplinas dela; abra uma disciplina para ver os tópicos. Ex.: Tecnologia › Redes de Computadores › OSPF. Áreas são opcionais.' }
};

function renderTips(){
  const slot = $('#tips-slot');
  if(!slot) return;
  clear(slot);
  if(state.settings.helpMode !== 'full') return;
  const tip = FIRST_TIPS[ui.view];
  if(!tip) return;
  const seen = Array.isArray(state.settings.seenTips) ? state.settings.seenTips : [];
  if(seen.includes(tip.id)) return;

  slot.appendChild(h('div', { class:'tip', role:'note' },
    icon('i-help', 'nav-icon'),
    h('div', { class:'tip-main' }, h('strong', { text:tip.title }),
      tip.steps ? h('ol', { class:'tip-steps' }, tip.steps.map(x => h('li', { text:x }))) : h('span', { text:tip.text })),
    h('button', { class:'btn ghost sm', type:'button', text:'Entendi', onclick: async () => {
      const list = Array.isArray(state.settings.seenTips) ? state.settings.seenTips.slice() : [];
      if(!list.includes(tip.id)) list.push(tip.id);
      state.settings.seenTips = list;
      await saveSettings();
      renderTips();
    } })));
}

/* =========================================================================
   FEEDBACK ENRIQUECIDO
   ========================================================================= */
function toastRich(headline, rows, kind){
  const k = TOAST_KINDS[kind] ? kind : 'ok';
  const el = h('div', { class:'toast rich ' + k },
    h('span', { class:'t-icon', 'aria-hidden':'true' }, icon(TOAST_KINDS[k].icon)),
    h('div', { class:'t-content' },
      h('p', { class:'t-title', text:headline }),
      h('div', { class:'t-body' }, rows.map(r => Array.isArray(r)
        ? h('div', { class:'t-row' }, h('span', { text:r[0] }), h('b', { text:r[1] }))
        : h('div', { class:'t-sub', text:r })))));
  mountToast(el, 5600);
}


/* =========================================================================
   COMPONENTES INTERATIVOS — barras com detalhe, sinais da recomendação
   ========================================================================= */

/** Barra de progresso que revela planejado/realizado/restante no hover e no foco. */
function barWithTip(pct, cls, title, rows, key){
  const wrap = h('div', { class:'bar', tabindex:'0', role:'img',
    'aria-label': title + ': ' + rows.map(r => r[0] + ' ' + r[1]).join(', ') },
    barFill(pct, cls, key));
  Tooltip.attach(wrap, () => tipBody(title, rows));
  return wrap;
}

/** Sinais da recomendação em linguagem qualitativa — nunca o score bruto. */
function signalGrid(action){
  if(!action || !action.parts) return null;
  const level = v => v >= .66 ? 'Alto' : v >= .33 ? 'Médio' : 'Baixo';
  const f = action.facts, p = action.parts;
  const rows = [
    ['Plano semanal', f.planned > 0 ? level(p.deficitScore) : 'sem plano'],
    ['Prioridade', PRIORITY_LABELS[action.discipline.priority]],
    ['Tempo sem estudar', f.lastISO === null ? 'nunca estudada' : level(p.recencyScore)]
  ];
  if(f.dueCount > 0) rows.push(['Revisões', f.dueCount + (f.dueCount === 1 ? ' pendente' : ' pendentes')]);
  // dueText já concorda com o tipo do prazo ("Prova venceu há 2 dias"),
  // enquanto fmtRelativeFuture é escrito no feminino (serve às revisões).
  if(f.deadline) rows.push(['Prazo', DeadlineEngine.dueText(f.deadline.dl)]);

  return h('dl', { class:'signals', 'aria-label':'Sinais usados na sugestão' },
    rows.map(r => h('div', { class:'signal' }, h('dt', { text:r[0] }), h('dd', { text:r[1] }))));
}


/* =========================================================================
   FRASE DO DIA — v6.3: rotação determinística, sem rede.
   · A frase depende só do DIA LOCAL do calendário: recarregar a página ou
     re-renderizar não troca; à meia-noite local, troca.
   · As frases são percorridas em ciclos: dentro de um ciclo nenhuma se
     repete. Cada ciclo tem uma ordem própria (embaralhamento com semente).
   · Na virada de um ciclo para o outro, as primeiras posições do novo
     ciclo não podem repetir as últimas do anterior — evita ver a mesma
     frase de novo poucos dias depois.
   ========================================================================= */

/** Número do dia local (dias desde 1970-01-01 no calendário do usuário).
 *  Usa Date.UTC com os campos LOCAIS: imune a horário de verão. */
function localDayNumber(d){
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

/** Gerador pseudoaleatório determinístico (mulberry32). */
function seededRandom(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ordem "crua" de um ciclo: Fisher–Yates com semente do número do ciclo. */
function rawQuoteOrder(cycle, n){
  const rnd = seededRandom((cycle + 1) * 2654435761);
  const order = Array.from({ length:n }, (_, i) => i);
  for(let i = n - 1; i > 0; i--){
    const j = Math.floor(rnd() * (i + 1));
    const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }
  return order;
}

/** Tamanho da "zona de proteção" entre ciclos: com 65 frases, 13 dias. */
function quoteGuardSize(n){ return n >= 5 ? Math.min(14, Math.floor(n / 5)) : 0; }

/** Ordem final de um ciclo. A proteção só troca itens da CABEÇA com itens
 *  do MEIO, então a CAUDA de qualquer ciclo é sempre igual à ordem crua —
 *  por isso basta consultar a ordem crua do ciclo anterior (sem recursão). */
function quoteOrderForCycle(cycle, n){
  const order = rawQuoteOrder(cycle, n);
  const k = quoteGuardSize(n);
  if(!k) return order;
  const prevTail = new Set(rawQuoteOrder(cycle - 1, n).slice(n - k));
  let j = k;                                   // cursor no meio: [k, n-k)
  for(let i = 0; i < k; i++){
    if(!prevTail.has(order[i])) continue;
    while(j < n - k && prevTail.has(order[j])) j++;
    if(j >= n - k) break;                      // não acontece com n >= 5
    const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    j++;
  }
  return order;
}

let _quoteCache = { cycle:null, n:0, order:null };
function quoteOfTheDay(date){
  const n = Array.isArray(DAILY_QUOTES) ? DAILY_QUOTES.length : 0;
  if(!n) return null;
  const day = localDayNumber(date || new Date());
  const cycle = Math.floor(day / n);
  if(_quoteCache.cycle !== cycle || _quoteCache.n !== n){
    _quoteCache = { cycle, n, order: quoteOrderForCycle(cycle, n) };
  }
  return DAILY_QUOTES[_quoteCache.order[day - cycle * n]];
}

/** Frase do dia: bloco editorial discreto, abaixo da ação principal.
 *  Não é card nem banner. O texto é dado (textContent), nunca HTML. */
function dailyQuoteCard(){
  if(!state.settings.showDailyQuote) return null;
  const q = quoteOfTheDay();
  if(!q || !q.text || !q.author) return null;
  return h('figure', { class:'daily-quote', 'aria-label':'Frase do dia' },
    h('blockquote', { class:'dq-text' }, h('p', { text: '“' + q.text + '”' })),
    h('figcaption', { class:'dq-cite' },
      h('span', { class:'dq-author', text: '— ' + q.author }),
      q.work ? h('span', { class:'dq-work', text: q.work }) : null));
}

/* =========================================================================
   COMECE POR AQUI — checklist derivada dos dados reais, nunca de checkboxes.
   ========================================================================= */
function onboardingSteps(){
  // v5.2: a Área de Estudo é opcional e tem seu próprio convite discreto;
  // por isso não entra nesta lista. O plano semanal fica por último.
  const hasPlan = !!PlannerEngine.activePlan();
  const hasDiscipline = activeDisciplines().length > 0;
  const hasTopic = state.topics.some(t => !t.archived);
  const hasSession = state.sessions.length > 0;
  const understandsReview = ReviewEngine.allScheduled().length > 0 || !!state.meta.reviewPrimerSeen;

  return [
    { id:'disc',    done:hasDiscipline, label:'Adicione uma disciplina',
      action:{ text:'Adicionar disciplina', run:() => { setView('disciplines'); setTimeout(() => openDisciplineModal(null), 250); } } },
    { id:'session', done:hasSession,    label:'Registre seu primeiro estudo',
      action:{ text:'Começar a estudar', run:() => openQuickStart() } },
    { id:'topic',   done:hasTopic,      label:'Adicione seu primeiro tópico',
      action:{ text:'Adicionar tópico', run:() => {
        const d = activeDisciplines()[0];
        if(d) openTopicModal(d.id, null); else setView('disciplines');
      } } },
    { id:'review',  done:understandsReview, label:'Entenda sua primeira revisão',
      action:{ text:'Ver como funciona', run:openReviewPrimer } },
    { id:'plan',    done:hasPlan,       label:'Defina seu tempo semanal',
      action:{ text:'Definir agora', run:() => setView('plan') } }
  ];
}

/** Versão da checklist para a Central de Ajuda: sempre visível, mesmo concluída. */
function startHereChecklistCard(){
  const steps = onboardingSteps();
  const done = steps.filter(x => x.done).length;
  const box = h('div', { class:'card' },
    h('div', { class:'card-head' },
      h('p', { class:'card-title', style:'margin:0', text:'Como começar' }),
      h('span', { class:'hint', text:`${done} de ${steps.length}` })));
  const list = h('ul', { class:'checklist' });
  steps.forEach(st => list.append(h('li', { class: st.done ? 'done' : '' },
    h('span', { class:'ck-mark', 'aria-hidden':'true', text: st.done ? '✓' : '○' }),
    h('span', { class:'ck-label', text:st.label }),
    st.done ? h('span', { class:'ck-ok', text:'feito' })
            : h('button', { class:'linkbtn', type:'button', text:st.action.text, onclick:st.action.run }))));
  box.append(list);
  return box;
}

/* =========================================================================
   NOVIDADES DA VERSÃO — uma única vez, para quem já usava.
   ========================================================================= */
function maybeShowWhatsNew(){
  if(state.settings.seenWhatsNew === APP_VERSION) return;
  // usuário realmente novo não precisa de "novidades": ele tem o onboarding
  if(!state.sessions.length && !activeDisciplines().length) return;

  const markSeen = async () => { state.settings.seenWhatsNew = APP_VERSION; await saveSettings(); };
  const seen = str(state.settings.seenWhatsNew);
  const cameFrom5 = /^5\./.test(seen);             // já usava alguma versão 5.x
  const saw52 = /^5\.[2-9]/.test(seen);            // já viu o anúncio da escala 1–5
  const mig = state.meta.v52MigrationSummary || {};
  const converted = !saw52 && isNum(mig.topics) && mig.topics > 0
    ? `A importância de ${mig.topics} ${mig.topics === 1 ? 'tópico foi convertida' : 'tópicos foi convertida'} para a escala de prioridade 1–5. Nenhuma revisão foi reagendada.`
    : null;

  const cameFrom6 = /^6\./.test(seen);             // já usava alguma versão 6.x
  const saw62 = /^6\.[2-9]/.test(seen);           // já viu a navegação da 6.2
  const saw63 = /^6\.[3-9]/.test(seen);           // já viu a captura de tópico da 6.3
  const saw64 = /^6\.[4-9]/.test(seen);           // já viu o fluxo de estudo da 6.4
  /* v6.5 — confiabilidade. Nada novo para aprender: quem já estava na 6.4.1 lê
     em cinco linhas o que ficou mais seguro; quem vem de antes vê a novidade da
     versão em que parou, com uma linha sobre a 6.5 no fim. */
  const saw641 = /^6\.4\.[1-9]/.test(seen) || /^6\.[5-9]/.test(seen);
  const hardening = [
    'O mesmo estudo não é mais registrado duas vezes — nem com o Ciclo aberto em duas abas.',
    'Editar, mover ou excluir um estudo atualiza o tópico junto: a próxima revisão acompanha o histórico, e um tópico sem estudos volta a "não iniciado".',
    'Restaurar um backup mostra antes o que vai entrar, o que foi ajustado e o que fica de fora. Um arquivo com problema não troca os seus dados.',
    '"Plano cumprido" agora mede a divisão do tempo: o que passa do planejado de uma disciplina aparece à parte, como "além do plano".',
    'As janelas só fecham depois de gravar. Se algo falhar, o que você digitou continua lá.'
  ];
  if(saw64 && !saw641) hardening.push('Também da 6.4.1: horários digitando só os números (2350 vira 23:50) e o registro em duas colunas.');
  /* v6.6 — acabamento visual e de interação. Quem já estava na 6.5 lê só isto;
     quem vem de antes vê a novidade da versão em que parou e uma linha sobre a 6.6. */
  const saw65 = /^6\.([5-9]|\d{2,})/.test(seen);
  const revival = [
    'Cores mais fechadas e sérias, no tema escuro e no claro. O verde-petróleo ficou reservado para a ação principal de cada tela.',
    'Botões, linhas e opções respondem ao mouse e ao toque — e o que está escolhido continua marcado depois que você tira o mouse.',
    'Ao escolher uma opção (tema, aba, período, prioridade), a marca desliza até ela.',
    'Menus abrem junto do botão e sempre dentro da tela; no celular, viram uma folha na parte de baixo. Clicar fora ou apertar Esc fecha.',
    'Janelas e painéis entram e saem com uma transição curta. Uma janela com algo preenchido não fecha mais com um clique fora.',
    'Tudo isso respeita "Reduzir animações", em Configurações → Aparência.'
  ];
  const items = saw65 ? revival : saw64 ? hardening : [
    '"Registrar estudo" guarda algo que você já estudou — de qualquer tela, sem sair dela. "Começar a estudar" liga o cronômetro.',
    'Em "Já estudei", diga a que horas começou e terminou: a duração sai sozinha, mesmo quando o estudo atravessa a meia-noite (23:50 → 00:12 são 22 minutos).',
    'Descansos: no cronômetro, "Descansar" pausa o estudo e conta o descanso à parte. Ele nunca entra no tempo estudado nem no plano da semana.',
    'Seu ritmo: Hoje mostra em quantos dos últimos 7 dias você estudou, e Análises ganhou os dias com estudo por semana e os descansos — sem nota e sem cobrança.',
    'Créditos saíram do Ciclo: agora tudo é medido em tempo. Seus estudos e minutos continuam exatamente como estavam.',
    'Horários no formato 24h, digitando só os números (2350 vira 23:50), e uma tipografia mais legível em todo o Ciclo.'
  ];
  if(!saw64) items.push('E, na 6.5: o mesmo estudo nunca é registrado duas vezes, editar ou excluir um estudo atualiza o tópico junto, e restaurar um backup mostra antes o que vai entrar.');
  if(!saw65) items.push('E, na 6.6: cores mais sóbrias, botões e opções que respondem ao toque, a marca da escolha deslizando até ela e menus e janelas com transições curtas.');
  if(saw64){ /* nada a acrescentar: a lista acima já é só o que ficou mais seguro */ }
  else if(cameFrom6 && !saw63) items.push('Também da 6.3: criar um tópico sem sair do registro e a frase do dia só com frases reais, com autor e obra.');
  if(!saw64 && cameFrom6 && !saw62) items.push('Também da 6.2: o Voltar do navegador volta dentro do Ciclo, e cada lista tem busca e ordenação próprias.');
  if(!cameFrom6) items.push('Também da 6.0 à 6.3: visual mais calmo, Disciplinas como um índice, Análises que começam por uma pergunta, Prazos numa aba própria e o Voltar do navegador funcionando dentro do Ciclo.');
  const cfg = {
    title: 'Ciclo 6.6',
    sub: saw65
      ? 'Uma versão de acabamento: a mesma ferramenta, mais clara de ver e mais agradável de usar. Nada para reaprender, e nenhum dado foi alterado.'
      : saw64
      ? 'Confiabilidade e acabamento: nada novo para aprender, e nenhum dado foi alterado.'
      : cameFrom5 || cameFrom6
      ? 'Estudar, registrar, descansar e acompanhar a constância ficaram mais simples. Seus dados, revisões, prazos e planos continuam exatamente como estavam.'
      : 'O Diário de Estudos agora se chama Ciclo — e ganhou uma interface nova. Seus dados, revisões e planos continuam como estavam.',
    items, note: converted
  };

  openModal(close => ({
    title: cfg.title,
    content: h('div', { class:'whats-new' },
      h('div', { class:'wn-brand', 'aria-hidden':'true' }, icon('i-brand', 'welcome-icon')),
      h('p', { class:'modal-sub', text: cfg.sub }),
      h('ul', { class:'reasons' }, cfg.items.map(x => h('li', { text:x }))),
      cfg.note ? h('p', { class:'hint', style:'margin-top:10px', text: cfg.note }) : null),
    actions:[
      h('button', { class:'btn ghost', type:'button', text:'Ver o histórico de versões', onclick: async () => {
        close(); await markSeen(); openChangelog();
      } }),
      h('button', { class:'btn primary', type:'button', text:'Continuar', onclick: async () => {
        close(); await markSeen();
      } })
    ]
  }), { size:'wide', onClose:(r) => { if(r === null) markSeen(); } });
}

/* =========================================================================
   v5 — PRIMEIRO ACESSO
   Duas telas. Nenhum conceito é exigido antes de existir motivo para ele.
   Resultado: uma disciplina criada com bons padrões, e o usuário na Home.
   ========================================================================= */
function openWelcome(){
  let step = 1;
  let name = '';
  let rebuildRef = null;

  openModal(close => {
    const body = h('div');

    function actions(){
      const acts = [];
      if(step === 2){
        acts.push(h('button', { class:'btn ghost', type:'button', text:'Voltar',
          onclick:() => { step = 1; rebuild(); } }));
        acts.push(h('button', { class:'btn primary', type:'button', text:'Continuar', onclick:finish }));
      } else {
        acts.push(h('button', { class:'btn primary lg', type:'button', text:'Começar',
          onclick:() => { step = 2; rebuild(); } }));
      }
      mount($('#modal-actions'), ...acts);
      guardModalActions($('#modal-actions'));
    }

    function stepWelcome(){
      return h('div', { class:'welcome' },
        h('div', { class:'welcome-mark', 'aria-hidden':'true' }, icon('i-brand', 'welcome-icon')),
        h('h3', { class:'welcome-title', text:'Bem-vindo ao Ciclo' }),
        h('p', { class:'welcome-tag', text:'Seu sistema de estudos' }),
        h('p', { class:'welcome-text', text:'Organize o que você estuda, acompanhe seu progresso e saiba quando revisar.' }),
        h('p', { class:'welcome-note', text:'Você não precisa configurar nada agora.' }));
    }

    function stepName(){
      const input = h('input', { type:'text', id:'wc-name', value:name, maxlength:'80',
        placeholder:'Ex.: Matemática', autocomplete:'off', 'aria-describedby':'wc-ex' });
      input.addEventListener('input', () => { name = input.value; });
      input.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ e.preventDefault(); finish(); } });

      const chips = h('div', { class:'chips', style:'margin-top:10px' },
        ['Matemática','Inglês','Direito','Anatomia','CCNA','Violão'].map(ex =>
          h('button', { class:'chip', type:'button', text:ex,
            onclick:() => { name = ex; input.value = ex; input.focus(); } })));

      return h('div',
        h('h3', { class:'welcome-title', style:'font-size:22px', text:'O que você está estudando?' }),
        h('p', { class:'hint', id:'wc-ex', style:'margin-bottom:12px', text:'Pode ser uma matéria, um idioma, uma certificação ou qualquer outra coisa que você queira aprender. Depois você adiciona mais.' }),
        h('div', { class:'field' }, input),
        chips);
    }

    let finishing = false;
    async function finish(){
      if(finishing) return;                    // v6.5: Enter duas vezes não cria duas disciplinas
      const clean = str(name).trim();
      if(!clean){ toast('Escreva o que você está estudando.', 'err'); $('#wc-name') && $('#wc-name').focus(); return; }
      finishing = true;
      try {
        // Sem área, sem prioridade, sem plano: só o mínimo, com bons padrões.
        const d = newDiscipline(clean, null, 3);
        await DB.put('disciplines', d);
        await setMeta('onboardingCompleted', true);
        await setMeta('firstDisciplineId', d.id);
        close();
        await safeRefresh();
        setView('today');
        toast('Agora é só começar a estudar.', 'ok', { title: clean + ' adicionada' });
      } catch(err){
        console.error('Falha ao criar a primeira disciplina:', err);
        toast('Não foi possível salvar agora. Tente novamente.', 'err');
      } finally {
        finishing = false;
      }
    }

    rebuild();
    function rebuild(){
      clear(body);
      body.append(step === 1 ? stepWelcome() : stepName());
      actions();
      const first = body.querySelector('input');
      if(first) setTimeout(() => first.focus(), 40);
    }
    rebuildRef = rebuild;
    return { title:'', content: body, actions: [] };
  }, { size:'narrow', dismissible:false });

  if(rebuildRef) rebuildRef();
}

/* =========================================================================
   v5 — GUIA VIVO "SEU COMEÇO"
   Derivado do estado real. Não bloqueia nada, pode ser ocultado, e some
   sozinho quando deixa de ser útil.
   ========================================================================= */
/* v5.3 — uma única tabela de ações (HELP_ACTIONS). O checklist e os artigos
   disparam exatamente os mesmos destinos, então nenhum botão fica órfão. */
const START_ACTIONS = HELP_ACTIONS;

function startProgress(){
  const hasDiscipline = activeDisciplines().length > 0;
  const hasSession = state.sessions.length > 0;
  const hasTopic = state.topics.some(t => !t.archived);
  const hasReview = state.sessions.some(x => x.reviewOutcome) || !!state.meta.reviewDemoSeen;
  const hasPlan = !!PlannerEngine.activePlan();
  const done = { discipline:hasDiscipline, session:hasSession, topic:hasTopic, review:hasReview, plan:hasPlan };
  const steps = HOW_TO_START.map(s2 => ({ ...s2, done: !!done[s2.id] }));
  return { steps, doneCount: steps.filter(x => x.done).length, total: steps.length };
}

function startGuideCard(){
  if(state.meta.startGuideHidden) return null;
  const prog = startProgress();
  if(prog.doneCount === prog.total) return null;   // some sozinho quando termina

  const next = prog.steps.find(s2 => !s2.done);
  const card = h('div', { class:'card start-guide' });
  card.append(h('div', { class:'card-head' },
    h('p', { class:'card-title', style:'margin:0', text:'Seu começo' }),
    h('div', { class:'row auto' },
      h('span', { class:'hint', text:`${prog.doneCount} de ${prog.total}` }),
      h('button', { class:'linkbtn muted', type:'button', text:'ocultar', onclick: async () => {
        await setMeta('startGuideHidden', true); render();
        toast('Guia ocultado. Ele continua em Ajuda → Como começar.');
      } }))));
  card.append(progressBar((prog.doneCount / prog.total) * 100, null, 'start-guide'));

  const list = h('ul', { class:'checklist', style:'margin-top:12px' });
  prog.steps.forEach(s2 => {
    const isNext = next && s2.id === next.id;
    list.append(h('li', { class:(s2.done ? 'done' : '') + (isNext ? ' next' : '') },
      h('span', { class:'ck-mark', 'aria-hidden':'true', text: s2.done ? '✓' : '○' }),
      h('span', { class:'ck-label' },
        h('span', { text:s2.title }),
        isNext ? h('span', { class:'ck-desc', text:s2.text }) : null),
      s2.done
        ? h('span', { class:'ck-ok', text:'feito' })
        : h('button', { class: isNext ? 'btn primary sm' : 'linkbtn', type:'button', text:s2.actionLabel,
            onclick:() => { const fn = START_ACTIONS[s2.action]; if(fn) fn(); } })));
  });
  card.append(list);
  return card;
}


/* =========================================================================
   DEMONSTRAÇÕES DA AJUDA
   Explicam mostrando. Rodam inteiramente em memória: nada aqui toca no
   IndexedDB, cria disciplina, tópico, revisão ou progresso. Recarregar a
   página não deixa vestígio de nenhuma delas.
   ========================================================================= */

/** Demonstração de revisão: o usuário clica nas respostas e vê o efeito. */
function reviewDemoNode(){
  const d = REVIEW_DEMO;
  const box = h('div', { class:'demo' });
  box.append(
    h('p', { class:'demo-label', text:'Demonstração' }),
    h('p', { class:'hint', style:'margin-bottom:12px', text:d.intro }),
    h('div', { class:'demo-card' },
      h('div', { class:'demo-topic', text:d.topic }),
      h('div', { class:'demo-disc', text:d.discipline })));

  const result = h('div', { class:'demo-result', role:'status', 'aria-live':'polite' });
  const opts = h('div', { class:'chips', style:'margin:12px 0' });
  d.outcomes.forEach(o => {
    const btn = h('button', { class:'chip', type:'button', text:o.label, 'aria-pressed':'false' });
    btn.addEventListener('click', () => {
      $$('.chip', opts).forEach(x => x.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      mount(result,
        h('p', { class:'demo-next' }, 'Próxima revisão: ', h('strong', { text:o.next })),
        h('p', { class:'hint', text:`Consolidação: ${o.mastery}. ${o.explain}` }));
    });
    opts.append(btn);
  });

  box.append(h('p', { class:'hint', style:'margin-bottom:4px', text:'Como foi lembrar?' }), opts, result,
    h('p', { class:'hint', style:'margin-top:10px', text:d.closing }),
    h('p', { class:'demo-note', text:'Este é só um exemplo. Nada aqui é salvo nos seus dados.' }));
  return box;
}

/** v5.2 — Demonstração da estrutura: troca de exemplo e vê a árvore mudar. */
function structureDemoNode(){
  const list = HIERARCHY_EXAMPLES;
  const box = h('div', { class:'demo' });
  const treeSlot = h('div', { 'aria-live':'polite' });
  const chips = h('div', { class:'chips', role:'group', 'aria-label':'Exemplos', style:'margin:8px 0 12px' });
  const show = (i) => {
    $$('.chip', chips).forEach((c, k) => c.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
    const ex = list[i];
    mount(treeSlot, guideTree({ area: ex.area, discipline: ex.discipline, topics: ex.topics }),
      h('p', { class:'hint', style:'margin-top:8px', text: ex.note }));
  };
  list.forEach((ex, i) => chips.append(h('button', { class:'chip', type:'button', 'aria-pressed':'false', text: ex.label, onclick:() => show(i) })));
  box.append(h('p', { class:'demo-label', text:'Experimente' }),
    h('p', { class:'hint', text:'Escolha um exemplo para ver como os três níveis se encaixam.' }), chips, treeSlot,
    h('p', { class:'demo-note', text:'Este é só um exemplo. Nada aqui é salvo nos seus dados.' }));
  show(0);
  return box;
}

/** v5.2 — Demonstração da escala de prioridade. */
function priorityDemoNode(){
  const box = h('div', { class:'demo' });
  const out = h('p', { class:'hint', 'aria-live':'polite', style:'margin-top:10px' });
  const update = (v) => {
    const mult = { 1:'um pouco mais espaçadas', 2:'levemente mais espaçadas', 3:'no ritmo normal', 4:'levemente mais próximas', 5:'um pouco mais próximas' }[v];
    out.textContent = `Com prioridade ${PriorityEngine.text(v)}, as revisões deste tópico ficam ${mult}. O resultado de cada revisão continua sendo o que mais pesa.`;
  };
  box.append(h('p', { class:'demo-label', text:'Experimente' }),
    h('p', { class:'hint', style:'margin-bottom:8px', text:'Tópico de exemplo: Derivadas (Matemática).' }),
    priorityPicker({ value:3, context:'topic', id:'demo-prio', label:'Prioridade do tópico', onChange: update }),
    out,
    h('p', { class:'demo-note', text:'Este é só um exemplo. Nada aqui é salvo nos seus dados.' }));
  update(3);
  return box;
}

/** Demonstração de planejamento. */
function planDemoNode(){
  const d = PLAN_DEMO;
  const box = h('div', { class:'demo' });
  box.append(
    h('p', { class:'demo-label', text:'Demonstração' }),
    h('p', { class:'hint', style:'margin-bottom:10px', text:`Imagine que você tem ${d.hours} horas nesta semana. O Ciclo sugeriria:` }));
  const total = sum(d.rows, r => r.minutes);
  d.rows.forEach(r => box.append(h('div', { class:'demo-row' },
    h('div', null, h('div', { text:r.name }), h('div', { class:'hint', text:'Prioridade ' + PriorityEngine.text(r.priority) })),
    h('span', { class:'num', text: fmtDuration(r.minutes) }))));
  box.append(h('div', { class:'demo-row demo-total' },
    h('strong', { text:'Total' }), h('span', { class:'num', text: fmtDuration(total) })));
  box.append(h('p', { class:'hint', style:'margin-top:10px', text:d.note }),
    h('p', { class:'demo-note', text:'Este é só um exemplo. Nada aqui é salvo nos seus dados.' }));
  return box;
}

/* =========================================================================
   v5 — PRIMEIRA REVISÃO COMO EXPERIÊNCIA GUIADA
   Aparece uma única vez, no momento em que a primeira revisão fica pendente.
   ========================================================================= */
function openFirstReviewIntro(topic){
  const disc = getDiscipline(topic.disciplineId);
  openModal(close => ({
    title:'Sua primeira revisão',
    content: h('div',
      h('p', { class:'first-review-topic', text: topic.name }),
      h('p', { class:'hint', style:'margin-bottom:14px', text: disc ? disc.name : '' }),
      h('p', { class:'prose', text:'Você estudou isso antes. Hoje vamos verificar o que você ainda consegue lembrar.' }),
      h('p', { class:'prose', style:'margin-top:8px', text:'Tente responder sem consultar seu material. Depois você diz como foi — e o Ciclo decide quando esse tópico deve voltar.' }),
      h('p', { class:'hint', style:'margin-top:12px', text:'Não é preciso reler tudo.' })),
    actions:[
      h('button', { class:'btn ghost', type:'button', text:'Agora não', onclick: async () => {
        close(); await setMeta('firstReviewIntroSeen', true);
      } }),
      h('button', { class:'btn primary', type:'button', text:'Começar', onclick: async () => {
        close(); await setMeta('firstReviewIntroSeen', true);
        startReview(topic.id);
      } })
    ]
  }), { size:'narrow' });
}

/**
 * Dispara a introdução da primeira revisão uma única vez, e apenas para quem
 * é realmente novo nisso. Qualquer sinal de histórico de revisão cancela:
 * um usuário que já vem de versões anteriores nunca vê esta tela.
 */
function hasReviewHistory(){
  if(state.sessions.some(x => x.reviewOutcome)) return true;
  if(state.sessions.some(x => x.type === 'revisao')) return true;
  if(state.topics.some(t => (t.reviewRepetitions || 0) > 0 || t.lastReviewedAt)) return true;
  return false;
}

function maybeOfferFirstReview(){
  if(state.meta.firstReviewIntroSeen) return;
  if(hasReviewHistory()){
    // marca como visto para não voltar a avaliar isso em toda abertura
    setMeta('firstReviewIntroSeen', true).catch(err => console.error(err));
    return;
  }
  if(state.sessions.length > 10) return;          // já usa o app há tempo
  if(Overlay.isOpen) return;                      // nunca empilha sobre outra camada
  const due = ReviewEngine.getDueReviews();
  if(!due.length) return;
  openFirstReviewIntro(due[0]);
}

/* =========================================================================
   CONFIGURAÇÕES — seções em cards, com controles apropriados.
   ========================================================================= */
function setRow(title, desc, control, helpKey){
  return h('div', { class:'set-row' },
    h('div', { class:'sr-main' },
      h('div', { class:'sr-title' }, title, helpKey ? helpDot(helpKey) : null),
      desc ? h('div', { class:'sr-desc', text:desc }) : null),
    h('div', { class:'sr-ctl' }, control));
}

function segmented(options, value, onPick, ariaLabel, id){
  const wrap = h('div', { class:'segmented', role:'group', 'aria-label': ariaLabel || '', id: id || null });
  options.forEach(o => {
    const b = h('button', { type:'button', text:o.label, dataset:{ value:String(o.value) },
      'aria-pressed': String(o.value) === String(value) ? 'true':'false' });
    b.addEventListener('click', () => {
      $$('button', wrap).forEach(x => x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true');
      onPick(o.value);
    });
    wrap.appendChild(b);
  });
  return wrap;
}

function switchControl(checked, onToggle, ariaLabel){
  const b = h('button', { class:'switch', type:'button', role:'switch',
    'aria-checked': checked ? 'true':'false', 'aria-label': ariaLabel || '' });
  b.addEventListener('click', () => {
    const next = b.getAttribute('aria-checked') !== 'true';
    b.setAttribute('aria-checked', next ? 'true':'false');
    onToggle(next);
  });
  return b;
}

function numberControl(value, min, step, onChange, ariaLabel){
  const i = h('input', { type:'number', value:String(value), min:String(min), step:String(step), inputmode:'numeric', 'aria-label': ariaLabel || '' });
  i.addEventListener('change', () => onChange(Number(i.value)));
  return i;
}

function selectControl(options, value, onChange, ariaLabel){
  const s = h('select', { 'aria-label': ariaLabel || '' });
  options.forEach(o => s.appendChild(h('option', { value:o.value, selected:String(o.value) === String(value) }, o.label)));
  s.addEventListener('change', () => onChange(s.value));
  return s;
}

function renderSettings(){
  const root = $('#settings-body');
  const s = state.settings;   // apenas leitura dos valores atuais; a escrita vai sempre em state.settings

  /* ---------- APARÊNCIA ---------- */
  const aparencia = card('Aparência',
    setRow('Tema', 'Sistema acompanha a preferência do seu computador.',
      segmented([{ value:'dark', label:'Escuro' }, { value:'light', label:'Claro' }, { value:'system', label:'Sistema' }],
        state.settings.theme, v => setThemePreference(v), 'Tema', 'theme-segmented')),
    setRow('Densidade', 'Compacta reduz espaçamentos sem diminuir o tamanho do texto.',
      segmented([{ value:'comfortable', label:'Confortável' }, { value:'compact', label:'Compacta' }],
        s.density, async v => { state.settings.density = v; await saveSettings(); }, 'Densidade')),
    setRow('Reduzir animações', 'Remove transições e efeitos decorativos. Respeita também a preferência do sistema.',
      switchControl(s.reduceMotion, async v => { state.settings.reduceMotion = v; await saveSettings(); }, 'Reduzir animações'))
  );

  /* ---------- ESTUDOS ---------- */
  const estudos = card('Estudos',
    setRow('Tempo sugerido para estudar', 'Sugestão de minutos ao registrar um estudo.',
      numberControl(s.defaultSessionMinutes, 5, 5, async v => { state.settings.defaultSessionMinutes = v; await saveSettings(); }, 'Tempo sugerido para estudar, em minutos')),
    setRow('Duração padrão da revisão', 'Revisões costumam ser mais curtas que o estudo inicial.',
      numberControl(s.defaultReviewMinutes, 5, 5, async v => { state.settings.defaultReviewMinutes = v; await saveSettings(); }, 'Duração padrão da revisão em minutos')),
    setRow('Primeiro dia da semana', 'Define o início da semana no plano e nas análises.',
      selectControl([{ value:'monday', label:'Segunda-feira' }, { value:'sunday', label:'Domingo' }],
        s.weekStart, async v => { state.settings.weekStart = v; await saveSettings(); await refresh(); }, 'Primeiro dia da semana')),
    setRow('Período padrão das Análises', 'O período que já vem escolhido quando você abre Análises.',
      selectControl([
        { value:'hoje', label:'Hoje' }, { value:'7d', label:'7 dias' }, { value:'30d', label:'30 dias' },
        { value:'semana', label:'Esta semana' }, { value:'mes', label:'Este mês' }, { value:'tudo', label:'Tudo' }
      ], s.defaultPeriod, async v => { state.settings.defaultPeriod = v; await saveSettings(); }, 'Período padrão')),
    setRow('Tela inicial', 'Onde a plataforma abre.',
      selectControl([{ value:'today', label:'Hoje' }, { value:'plan', label:'Planejamento' }, { value:'analytics', label:'Análises' }],
        s.startView, async v => { state.settings.startView = v; await saveSettings(); }, 'Tela inicial'))
  );

  /* ---------- REVISÕES ---------- */
  const revisoes = card('Revisões',
    setRow(labelWithHelp('Quando revisar', 'estrategia'),
      'Decide quando o conteúdo volta. Disciplinas e tópicos podem usar outra.',
      selectControl(REVIEW_STRATEGIES.map(x => ({ value:x.v, label: x.v === 'adaptive' ? x.label + ' — recomendada' : x.label })),
        state.settings.defaultReviewStrategy, async v => { state.settings.defaultReviewStrategy = v; await saveSettings(); renderSettings(); }, 'Quando revisar')),
    h('p', { class:'hint', style:'margin:-6px 0 10px',
      text: (REVIEW_STRATEGIES.find(x => x.v === state.settings.defaultReviewStrategy) || REVIEW_STRATEGIES[0]).short }),
    setRow(labelWithHelp('Como revisar', 'metodo'),
      'No Automático, o Ciclo sugere um jeito conforme o tipo de conteúdo da disciplina.',
      selectControl(REVIEW_METHODS.map(m => ({ value:m.v, label:m.label })),
        state.settings.defaultReviewMethod, async v => { state.settings.defaultReviewMethod = v; await saveSettings(); }, 'Como revisar')),
    setRow(labelWithHelp('Incluir novos tópicos automaticamente', 'revisao'),
      'Ao criar um tópico, ele já entra no ciclo de revisão. Pode ser alterado tópico a tópico.',
      switchControl(s.autoReviewNewTopics, async v => { state.settings.autoReviewNewTopics = v; await saveSettings(); }, 'Incluir novos tópicos nas revisões')),
    setRow('Mostrar a próxima revisão na tela Hoje',
      'Quando não há revisões para hoje, mostra a próxima que vai chegar.',
      switchControl(state.settings.showUpcomingReviews, async v => { state.settings.showUpcomingReviews = v; await saveSettings(); }, 'Mostrar revisões futuras')),
    h('div', { style:'margin-top:10px' },
      h('button', { class:'linkbtn', type:'button', text:'Como funcionam as revisões?', onclick:openReviewPrimer }))
  );

  /* ---------- INTERFACE E AJUDA ---------- */
  const ajuda = card('Interface e ajuda',
    setRow('Ajuda contextual', 'Completa inclui as dicas de primeira visita. Discreta mantém só os botões "?" ao lado dos rótulos. A Central de Ajuda, a busca e o glossário continuam disponíveis em qualquer opção.',
      segmented([{ value:'full', label:'Completa' }, { value:'discreet', label:'Discreta' }, { value:'off', label:'Desativada' }],
        s.helpMode, async v => { state.settings.helpMode = v; await saveSettings(); renderSettings(); }, 'Ajuda contextual')),
    setRow('Explicações ao passar o mouse', 'Mostra detalhes em gráficos, barras e termos do glossário. Mesmo desligado, clicar ou tocar no termo continua explicando.',
      switchControl(s.hoverHints, async v => { state.settings.hoverHints = v; await saveSettings(); }, 'Explicações ao passar o mouse')),
    setRow('Mostrar frase do dia', 'Uma frase real sobre aprender, com autor e obra, na tela Hoje. Muda uma vez por dia, sem usar internet.',
      switchControl(state.settings.showDailyQuote, async v => { state.settings.showDailyQuote = v; await saveSettings(); if(ui.view === 'today') renderToday(); }, 'Mostrar frase do dia')),
    setRow('Dicas de primeira visita', 'Reexibe as dicas que aparecem uma única vez em cada tela.',
      h('button', { class:'btn ghost sm', type:'button', text:'Mostrar novamente',
        onclick: async () => { state.settings.seenTips = []; await saveSettings(); renderTips(); toast('As dicas voltarão a aparecer.', 'ok'); } }))
  );

  /* ---------- DADOS E PRIVACIDADE ---------- */
  const lastBackup = state.meta.lastBackupAt;
  const daysBackup = lastBackup ? daysSinceISO(localDateOfStamp(lastBackup)) : null;
  const dados = card('Dados e privacidade',
    h('p', { class:'set-lead', text:'Tudo fica neste navegador: sem conta, sem servidor, sem sincronização e sem rastreamento.' }),
    h('div', { class:'facts' },
      fact(daysBackup !== null ? (daysBackup <= 0 ? 'Hoje' : `Há ${plural(daysBackup, 'dia', 'dias')}`) : 'Nunca', 'último backup gerado'),
      fact(String(state.sessions.length), 'estudos guardados')),
    h('div', { class:'row auto' },
      h('button', { class:'btn primary sm', type:'button', text:'Fazer backup agora',
        onclick: once(exportBackupWithFeedback) }),
      h('button', { class:'btn ghost sm', type:'button', text:'Abrir tela Dados', onclick:() => setView('data') }),
      h('button', { class:'linkbtn', type:'button', text:'Onde meus dados ficam?', onclick:() => openHelpArticle('privacidade') }))
  );

  /* ---------- SOBRE ---------- */
  const sobre = card('Sobre',
    h('div', { class:'about-brand' },
      icon('i-brand', 'about-mark'),
      h('div', null,
        h('p', { class:'about-name', text:'Ciclo' }),
        h('p', { class:'hint', text:'Seu sistema de estudos · ', }, h('span', { class:'num', text:'v' + APP_VERSION }), ' · formato de dados ' + APP_SCHEMA_VERSION))),
    h('p', { class:'hint', style:'margin-top:10px', text:'Antes chamado Diário de Estudos. Desenvolvido por Filipe Santana. Aplicação local-first: seus dados ficam neste navegador.' }),
    state.meta.v2MigrationDate ? h('p', { class:'hint', style:'margin-top:6px', text:'Dados da V2 migrados em ' + fmtDateBR(localDateOfStamp(state.meta.v2MigrationDate)) + '.' }) : null,
    h('p', { class:'hint', style:'margin-top:10px' }, 'Dúvidas, sugestões ou problemas: ', h('span', { class:'cc-inline num', text: CONTACT_EMAIL })),
    h('div', { class:'row auto', style:'margin-top:12px' },
      h('button', { class:'btn ghost sm', type:'button', onclick:() => openContactDrawer() }, icon('i-mail'), 'Entrar em contato'),
      h('button', { class:'btn ghost sm', type:'button', onclick:() => openReportProblemDrawer() }, icon('i-flag'), 'Relatar problema'),
      h('button', { class:'btn ghost sm', type:'button', text:'Central de Ajuda', onclick:() => setView('help') }),
      h('button', { class:'btn ghost sm', type:'button', text:'Novidades desta versão', onclick:() => openChangelog() }))
  );

  /* v6 — um grupo por vez: nada de parede de opções. */
  const groups = [
    { id:'appearance', label:'Aparência', node:aparencia },
    { id:'study',      label:'Estudos', node:estudos },
    { id:'reviews',    label:'Revisões', node:revisoes },
    { id:'help',       label:'Ajuda', node:ajuda },
    { id:'data',       label:'Dados e privacidade', node:dados },
    { id:'about',      label:'Sobre', node:sobre }
  ];
  const cur = groups.find(g => g.id === ui.settingsGroup) || groups[0];
  const nav = h('div', { class:'set-nav', role:'tablist', 'aria-label':'Grupos de configurações', 'aria-orientation':'vertical' });
  groups.forEach((g, i) => {
    const on = g === cur;
    nav.append(h('button', { class:'set-tab', type:'button', role:'tab', id:'stab-' + g.id, 'aria-selected': on ? 'true' : 'false',
      'aria-controls':'spanel', tabindex: on ? '0' : '-1', text:g.label,
      onclick:() => { ui.settingsGroup = g.id; renderSettings(); const t = $('#stab-' + g.id); if(t) t.focus(); } }));
    void i;
  });
  nav.addEventListener('keydown', (e) => {
    const k = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key];
    if(!k) return;
    e.preventDefault();
    const idx = groups.indexOf(cur);
    ui.settingsGroup = groups[(idx + k + groups.length) % groups.length].id;
    renderSettings();
    const t = $('#stab-' + ui.settingsGroup); if(t) t.focus();
  });
  cur.node.classList.add('set-panel');
  mount(root, h('div', { class:'settings-layout' },
    nav,
    h('div', { class:'set-content', id:'spanel', role:'tabpanel', 'aria-labelledby':'stab-' + cur.id }, cur.node)));
}

function openChangelog(){
  const body = h('div', CHANGELOG.map(c => h('div', { style:'margin-bottom:16px' },
    h('p', { class:'cl-version num', text:'v' + c.v }),
    h('p', { class:'hint prose', text:c.d }))));
  Drawer.open('Novidades', body);
}

/* =========================================================================
   DICAS CONTEXTUAIS DETERMINÍSTICAS — poucas, e só quando ajudam.
   ========================================================================= */
function planHints(draft){
  const out = [];
  const allocs = draft.allocations.filter(a => getDiscipline(a.disciplineId));
  if(allocs.length >= 3 && allocs.every(a => a.priority === 5)){
    out.push('Quando todas as disciplinas têm prioridade máxima, a prioridade deixa de diferenciá-las e o tempo acaba dividido quase por igual.');
  }
  if(draft.availableMinutes >= 1200){
    const perDay = draft.availableMinutes / 7;
    out.push(`${fmtDuration(draft.availableMinutes)} por semana representam cerca de ${fmtDuration(perDay)} por dia, todos os dias.`);
  }
  const mins = sum(allocs, a => Number(a.minWeeklyMinutes) || 0);
  if(mins > 0 && mins === draft.availableMinutes && allocs.length > 1){
    out.push('Os mínimos ocupam toda a disponibilidade, então a prioridade não tem tempo livre para distribuir.');
  }
  return out;
}

function reviewHints(){
  const out = [];
  const due = ReviewEngine.getDueReviews();
  const overdue = due.filter(t => (daysUntilISO(t.reviewDueDate) || 0) < 0);
  if(overdue.length >= 5){
    // v6.3: o número de atrasadas já aparece logo acima; aqui só o conselho.
    out.push('Com tantas atrasadas, vale colocar as revisões em dia antes de adicionar muito conteúdo novo — o acúmulo diminui mais rápido.');
  }
  return out;
}

/**
 * Sugestões ligadas a prazos. Nada é alterado em silêncio: o usuário decide.
 * (a) prazo próximo → oferecer revisão intensiva na disciplina;
 * (b) prazo já passou → oferecer voltar da intensiva para a estratégia normal.
 */
function renderDeadlineSuggestions(){
  const box = h('div', { class:'suggestions' });
  const hoje = todayISO();

  // (a) disciplinas com prazo ativo em até 10 dias que ainda não estão intensivas
  const candidatas = [];
  activeDisciplines().forEach(d => {
    if(d.reviewStrategy === 'intensive') return;
    if(state.meta['intensiveDismissed_' + d.id]) return;
    const x = state.deadlines
      .filter(dl => dl.disciplineId === d.id && DeadlineEngine.isActive(dl))
      .map(dl => ({ dl, days: DeadlineEngine.daysLeft(dl) }))
      .filter(e => e.days <= 10)
      .sort((a,b) => a.days - b.days)[0];
    if(x && topicsOf(d.id).some(t => t.reviewEnabled)) candidatas.push({ d, x });
  });

  /* v6 — uma sugestão de cada tipo por vez, como nota discreta: a ação
     principal da tela continua sendo revisar. */
  candidatas.slice(0, 1).forEach(({ d, x }) => {
    box.append(h('div', { class:'inline-note suggestion-note', role:'note' },
      h('span', { class:'in-text', text:`Prazo de ${d.name}: ${DeadlineEngine.phrase(x.dl)}. Quer revisões mais próximas nessa disciplina até lá? Nada muda sem a sua confirmação.` }),
      h('span', { class:'in-actions' },
        h('button', { class:'linkbtn', type:'button', text:'Usar revisão intensiva', onclick: once(async () => {
          // v6.5: a memória só muda depois que o banco confirma
          if(!(await quickPatch('disciplines', d.id, { reviewStrategy:'intensive' }, 'Não foi possível mudar a revisão'))) return;
          // uma nova escolha de intensiva reabre a sugestão de voltar ao normal no futuro
          try { if(state.meta['intensiveKeep_' + d.id]) await setMeta('intensiveKeep_' + d.id, false); } catch(err){ console.error(err); }
          await safeRefresh();
          toast(`${d.name} passou a usar revisão intensiva. Você pode voltar atrás quando quiser.`, 'ok');
        }) }),
        h('button', { class:'linkbtn muted', type:'button', text:'Manter atual', onclick: async () => {
          await setMeta('intensiveDismissed_' + d.id, true);
          renderReviews();
        } }))));
  });

  // (b) intensiva sem prazo futuro: oferecer voltar ao ritmo normal.
  // v5.1: um prazo HOJE (0 dias) conta como futuro — antes `0 || -1` o descartava —
  // e "Continuar intensiva" passa a ser respeitado (antes o aviso reaparecia sempre).
  const expiradas = activeDisciplines().filter(d => {
    if(d.reviewStrategy !== 'intensive') return false;
    if(state.meta['intensiveKeep_' + d.id]) return false;
    return !state.deadlines.some(x => {
      if(DeadlineEngine.isDone(x) || x.disciplineId !== d.id) return false;
      const days = daysUntilISO(x.date);
      return days !== null && days >= 0;
    });
  });

  expiradas.slice(0, 1).forEach(d => {
    box.append(h('div', { class:'inline-note suggestion-note', role:'note' },
      h('span', { class:'in-text', text:`${d.name} continua em revisão intensiva, mas não há mais prazo próximo. Quer voltar ao ritmo normal?` }),
      h('span', { class:'in-actions' },
        h('button', { class:'linkbtn', type:'button', text:'Voltar ao padrão', onclick: once(async () => {
          if(!(await quickPatch('disciplines', d.id, { reviewStrategy:'inherit' }, 'Não foi possível mudar a revisão'))) return;
          await safeRefresh();
          toast(`${d.name} voltou ao ritmo normal de revisão.`, 'ok');
        }) }),
        h('button', { class:'linkbtn muted', type:'button', text:'Continuar intensiva', onclick: async () => {
          await setMeta('intensiveKeep_' + d.id, true);
          renderReviews();
        } }))));
  });

  void hoje;
  return box.children.length ? box : null;
}

function hintBox(texts){
  if(!texts || !texts.length) return null;
  if(state.settings.helpMode === 'off') return null;
  return h('div', { class:'card elevated', style:'margin-top:12px' },
    texts.map(t => h('p', { class:'hint prose', style:'margin-bottom:4px', text:t })));
}

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
