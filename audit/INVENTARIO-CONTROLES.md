# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fonte: app.js. 561 construções de controles, 59 construções de camadas e 716 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6054](../app.js#L6054) |
| askConflict | button button |  | Descartar a minha edição | [6055](../app.js#L6055) |
| askConflict | button button |  | Manter a minha edição | [6056](../app.js#L6056) |
| DataSync | button button |  | Atualizar | [6346](../app.js#L6346) |
| DataSync | button button |  | Continuar editando | [6348](../app.js#L6348) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6821](../app.js#L6821) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6822](../app.js#L6822) |
| selectField | select  | dinâmico: id |  | [7273](../app.js#L7273) |
| pillGroup | button button |  | dinâmico: it.label | [7286](../app.js#L7286) |
| renderTimerBar | button button |  | dinâmico: a.label | [7616](../app.js#L7616) |
| renderTimerBar | button button |  | Foco | [7618](../app.js#L7618) |
| renderTimerBar | button button |  | descartar | [7619](../app.js#L7619) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7808](../app.js#L7808) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7810](../app.js#L7810) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8003](../app.js#L8003) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8006](../app.js#L8006) |
| topicMultiPicker | button button |  | Pronto | [8012](../app.js#L8012) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8027](../app.js#L8027) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8317](../app.js#L8317) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8335](../app.js#L8335) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8372](../app.js#L8372) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8373](../app.js#L8373) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8526](../app.js#L8526) |
| topicSplitField | button button |  |  | [8590](../app.js#L8590) |
| topicSplitField | button button |  | Não dividir | [8594](../app.js#L8594) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8613](../app.js#L8613) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8801](../app.js#L8801) |
| commentField | textarea  | dinâmico: o.id |  | [8851](../app.js#L8851) |
| commentField | button button |  | + Adicionar comentário | [8854](../app.js#L8854) |
| commentField | button button |  | Remover o comentário | [8855](../app.js#L8855) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8938](../app.js#L8938) |
| resultsField | button button |  | Recolher | [8943](../app.js#L8943) |
| resultsField | button button |  | + Adicionar resultado | [8946](../app.js#L8946) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [8973](../app.js#L8973) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [8975](../app.js#L8975) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [8989](../app.js#L8989) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [8990](../app.js#L8990) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [8991](../app.js#L8991) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9030](../app.js#L9030) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9044](../app.js#L9044) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9046](../app.js#L9046) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9149](../app.js#L9149) |
| breaksEditor | button button |  | dinâmico: addLabel | [9287](../app.js#L9287) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9309](../app.js#L9309) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9322](../app.js#L9322) |
| FormDraft | button button |  | Começar do zero | [9501](../app.js#L9501) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9523](../app.js#L9523) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9528](../app.js#L9528) |
| studyWhenFields | button button |  |  | [9534](../app.js#L9534) |
| studyWhenFields | button button |  |  | [9536](../app.js#L9536) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9540](../app.js#L9540) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9779](../app.js#L9779) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9803](../app.js#L9803) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9815](../app.js#L9815) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9822](../app.js#L9822) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9836](../app.js#L9836) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9848](../app.js#L9848) |
| confirmLong | button button |  | Corrigir | [9922](../app.js#L9922) |
| confirmLong | button button |  | Sim, registrar | [9937](../app.js#L9937) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9944](../app.js#L9944) |
| openRegisterModal | button button |  | Cancelar | [10039](../app.js#L10039) |
| openFinishModal | input number | fin-min |  | [10102](../app.js#L10102) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10147](../app.js#L10147) |
| renderOutcome | select  | fin-method |  | [10181](../app.js#L10181) |
| openFinishModal | button button |  | Registrar estudo | [10223](../app.js#L10223) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10300](../app.js#L10300) |
| offerStaleSession | button button |  | Continuar | [10327](../app.js#L10327) |
| offerStaleSession | button button |  | Descartar | [10328](../app.js#L10328) |
| offerStaleSession | button button |  | Finalizar | [10329](../app.js#L10329) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11163](../app.js#L11163) |
| renderToday | button button |  | Quero ajuda para organizar | [11164](../app.js#L11164) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11195](../app.js#L11195) |
| todayAction | button button |  | dinâmico: icon('i-check') | [11209](../app.js#L11209) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11210](../app.js#L11210) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11211](../app.js#L11211) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11228](../app.js#L11228) |
| todayAction | button button |  | Por quê? | [11230](../app.js#L11230) |
| todayAction | button button |  | Outras opções | [11231](../app.js#L11231) |
| todayWeekPanel | button button |  | Ver nas Análises | [11283](../app.js#L11283) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11284](../app.js#L11284) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11291](../app.js#L11291) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11294](../app.js#L11294) |
| todayNextSteps | button button |  | Revisar | [11311](../app.js#L11311) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11312](../app.js#L11312) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11339](../app.js#L11339) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11370](../app.js#L11370) |
| nextRow | button button |  | dinâmico: main | [11407](../app.js#L11407) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11419](../app.js#L11419) |
| explainAction | button button |  | Fechar | [11433](../app.js#L11433) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11468](../app.js#L11468) |
| renderReviews | button button |  | Como funcionam as revisões? | [11469](../app.js#L11469) |
| renderReviews | button button |  | Adicionar um tópico | [11470](../app.js#L11470) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11483](../app.js#L11483) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11484](../app.js#L11484) |
| renderReviews | button button |  | Como funciona? | [11485](../app.js#L11485) |
| renderReviews | button button |  | Religar sugestões | [11486](../app.js#L11486) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11521](../app.js#L11521) |
| drawReviewGroups | button button |  | Limpar busca | [11558](../app.js#L11558) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11569](../app.js#L11569) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11585](../app.js#L11585) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11588](../app.js#L11588) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11590](../app.js#L11590) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11595](../app.js#L11595) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11600](../app.js#L11600) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11603](../app.js#L11603) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11604](../app.js#L11604) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11621](../app.js#L11621) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11625](../app.js#L11625) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11640](../app.js#L11640) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11643](../app.js#L11643) |
| reviewGroupCard | button button |  | Escolher assuntos | [11644](../app.js#L11644) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11668](../app.js#L11668) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11672](../app.js#L11672) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11739](../app.js#L11739) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11751](../app.js#L11751) |
| openDisciplineReview | button button |  | Cancelar | [11773](../app.js#L11773) |
| openDisciplineReview | button button |  | Já revisei | [11774](../app.js#L11774) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11780](../app.js#L11780) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [11819](../app.js#L11819) |
| startReview | button button |  | Cancelar | [11829](../app.js#L11829) |
| startReview | button button |  | Registrar sem cronômetro | [11830](../app.js#L11830) |
| startReview | button button |  | Começar revisão | [11832](../app.js#L11832) |
| openReviewOutcomeModal | input number | ro-min |  | [11845](../app.js#L11845) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11853](../app.js#L11853) |
| openReviewOutcomeModal | button button |  | Cancelar | [11855](../app.js#L11855) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11856](../app.js#L11856) |
| openSessionBuilder | button button |  | dinâmico: v + ' min' | [11904](../app.js#L11904) |
| openSessionBuilder | input number | sb-custom | Outro valor | [11908](../app.js#L11908) |
| openSessionBuilder | button button |  | Cancelar | [11922](../app.js#L11922) |
| openSessionBuilder | button button |  | Começar | [11923](../app.js#L11923) |
| openReviewPrimer | button button |  | O que é revisão? | [11982](../app.js#L11982) |
| openReviewPrimer | button button |  | Por que não basta reler? | [11983](../app.js#L11983) |
| renderPlan | button button |  | Ir para Disciplinas | [12469](../app.js#L12469) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12482](../app.js#L12482) |
| renderPlan | button button |  | Outro valor | [12483](../app.js#L12483) |
| renderPlan | button button |  | Para que serve o planejamento? | [12487](../app.js#L12487) |
| renderPlan | input number | plan-avail-h |  | [12497](../app.js#L12497) |
| renderPlan | input text | plan-name |  | [12505](../app.js#L12505) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12511](../app.js#L12511) |
| renderPlan | button button |  | Sugerir automaticamente | [12519](../app.js#L12519) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12561](../app.js#L12561) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12565](../app.js#L12565) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12568](../app.js#L12568) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12584](../app.js#L12584) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12585](../app.js#L12585) |
| openPlansDrawer | button button |  | Ativar | [12607](../app.js#L12607) |
| openPlansDrawer | button button |  | excluir | [12608](../app.js#L12608) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12610](../app.js#L12610) |
| createSimplePlan | button button |  | Personalizar distribuição | [12643](../app.js#L12643) |
| createSimplePlan | button button |  | Usar esta sugestão | [12648](../app.js#L12648) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12730](../app.js#L12730) |
| openNewPlanModal | input number | np-hours |  | [12731](../app.js#L12731) |
| openNewPlanModal | button button |  | Cancelar | [12740](../app.js#L12740) |
| openNewPlanModal | button button |  | Criar | [12741](../app.js#L12741) |
| planWeekHead | button button |  | Alterar meta | [12893](../app.js#L12893) |
| planWeekHead | button button |  | Personalizar distribuição | [12894](../app.js#L12894) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12895](../app.js#L12895) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12920](../app.js#L12920) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [12939](../app.js#L12939) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [12953](../app.js#L12953) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [12957](../app.js#L12957) |
| openWeekGoalModal | input checkbox | wg-redist |  | [12960](../app.js#L12960) |
| openWeekGoalModal | button button |  | Cancelar | [12979](../app.js#L12979) |
| openWeekGoalModal | button button |  | Salvar meta | [12980](../app.js#L12980) |
| planWeekNav | button button |  | Semana anterior | [13016](../app.js#L13016) |
| planWeekNav | button button |  | Próxima semana | [13018](../app.js#L13018) |
| planWeekNav | button button |  | Ir para esta semana | [13021](../app.js#L13021) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13022](../app.js#L13022) |
| planWeekNav | button button |  | dinâmico: view.hasTemplate ? 'Usar esta organização nas próximas semanas' : 'Repetir nas próximas semanas' | [13035](../app.js#L13035) |
| planWeekNav | button button |  | Voltar ao modelo | [13039](../app.js#L13039) |
| planWeekNav | button button |  | Limpar os dias | [13042](../app.js#L13042) |
| planWeekNotices | button button |  | Ajustar os blocos | [13071](../app.js#L13071) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13072](../app.js#L13072) |
| planWeekNotices | button button |  | Manter assim | [13074](../app.js#L13074) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13113](../app.js#L13113) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13115](../app.js#L13115) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13133](../app.js#L13133) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13160](../app.js#L13160) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13164](../app.js#L13164) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13186](../app.js#L13186) |
| openSuggestionEditor | button button |  | Só nesta semana | [13187](../app.js#L13187) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13188](../app.js#L13188) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13203](../app.js#L13203) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13209](../app.js#L13209) |
| openSuggestionPicker | button button |  | Cancelar | [13229](../app.js#L13229) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13305](../app.js#L13305) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13336](../app.js#L13336) |
| planOffDays | button button |  | Personalizar dias | [13376](../app.js#L13376) |
| weekConflictDialog | button button |  | Ver a versão atual | [13390](../app.js#L13390) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13391](../app.js#L13391) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13508](../app.js#L13508) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13511](../app.js#L13511) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13515](../app.js#L13515) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13525](../app.js#L13525) |
| openBlockEditor | button button |  | Salvar | [13547](../app.js#L13547) |
| openBlockEditor | button button |  | Tirar deste dia | [13570](../app.js#L13570) |
| openBlockEditor | button button |  | Cancelar | [13571](../app.js#L13571) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13586](../app.js#L13586) |
| openMoveDialog | button button |  | Cancelar | [13595](../app.js#L13595) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13606](../app.js#L13606) |
| openStudyDaysModal | button button |  | Cancelar | [13620](../app.js#L13620) |
| openStudyDaysModal | button button |  | Salvar | [13621](../app.js#L13621) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13652](../app.js#L13652) |
| openAdjustBlocks | button button |  | Cancelar | [13667](../app.js#L13667) |
| openAdjustBlocks | button button |  | Salvar | [13668](../app.js#L13668) |
| openGoalUpdate | button button |  | Cancelar | [13701](../app.js#L13701) |
| openGoalUpdate | button button |  | Só nesta semana | [13702](../app.js#L13702) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13703](../app.js#L13703) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [13962](../app.js#L13962) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14023](../app.js#L14023) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14332](../app.js#L14332) |
| contextSearch | button button |  | Limpar busca | [14334](../app.js#L14334) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14362](../app.js#L14362) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14372](../app.js#L14372) |
| collectionView | button button |  | Limpar busca | [14463](../app.js#L14463) |
| collectionView | button button |  | Mostrar todos | [14464](../app.js#L14464) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [14936](../app.js#L14936) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [14979](../app.js#L14979) |
| levelHead | button button |  | dinâmico: c.label | [15000](../app.js#L15000) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15001](../app.js#L15001) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15072](../app.js#L15072) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15073](../app.js#L15073) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15079](../app.js#L15079) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15084](../app.js#L15084) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15160](../app.js#L15160) |
| discAreaLevel | button button |  | Organizar em uma área | [15171](../app.js#L15171) |
| discAreaLevel | button button |  | Reativar | [15179](../app.js#L15179) |
| discAreaLevel | button button |  | Adicionar disciplina | [15198](../app.js#L15198) |
| discAreaLevel | button button |  | Agora não | [15199](../app.js#L15199) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15209](../app.js#L15209) |
| discDisciplineLevel | button button |  | Reativar | [15238](../app.js#L15238) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15239](../app.js#L15239) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15240](../app.js#L15240) |
| discDisciplineLevel | button button |  | Editar | [15241](../app.js#L15241) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15250](../app.js#L15250) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15286](../app.js#L15286) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15288](../app.js#L15288) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15292](../app.js#L15292) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15323](../app.js#L15323) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15325](../app.js#L15325) |
| topicDetailContent | button button |  | Reativar tópico | [15373](../app.js#L15373) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15376](../app.js#L15376) |
| topicDetailContent | button button |  | Revisar agora | [15377](../app.js#L15377) |
| topicDetailContent | button button |  | Editar | [15378](../app.js#L15378) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15379](../app.js#L15379) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15393](../app.js#L15393) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15406](../app.js#L15406) |
| areaNudgeCard | button button |  | Organizar | [15475](../app.js#L15475) |
| areaNudgeCard | button button |  | Agora não | [15476](../app.js#L15476) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15509](../app.js#L15509) |
| openAreaModal | input checkbox |  |  | [15517](../app.js#L15517) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15532](../app.js#L15532) |
| openAreaModal | button button |  | Cancelar | [15580](../app.js#L15580) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15670](../app.js#L15670) |
| openDisciplineModal | select  | dm-area |  | [15675](../app.js#L15675) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15680](../app.js#L15680) |
| openDisciplineModal | select  | dm-nature |  | [15702](../app.js#L15702) |
| openDisciplineModal | select  | dm-strategy |  | [15706](../app.js#L15706) |
| openDisciplineModal | select  | dm-method |  | [15712](../app.js#L15712) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15718](../app.js#L15718) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15740](../app.js#L15740) |
| openDisciplineModal | button button |  | Cancelar | [15797](../app.js#L15797) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15799](../app.js#L15799) |
| openDisciplineModal | button button |  | excluir definitivamente | [15801](../app.js#L15801) |
| topicReviewOptions | select  | tm-strategy |  | [15919](../app.js#L15919) |
| topicReviewOptions | select  | tm-method |  | [15924](../app.js#L15924) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [15929](../app.js#L15929) |
| reviewToggle | input checkbox | tm-review |  | [15940](../app.js#L15940) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [15985](../app.js#L15985) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16029](../app.js#L16029) |
| showTwin | button button |  | Usar este tópico | [16046](../app.js#L16046) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16051](../app.js#L16051) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16052](../app.js#L16052) |
| topicEditor | button button |  | dinâmico: saveLabel | [16133](../app.js#L16133) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16135](../app.js#L16135) |
| topicEditor | button button |  | Arquivar | [16139](../app.js#L16139) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16172](../app.js#L16172) |
| openBulkTopicModal | button button |  | Cancelar | [16185](../app.js#L16185) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16186](../app.js#L16186) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16226](../app.js#L16226) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16231](../app.js#L16231) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16232](../app.js#L16232) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16235](../app.js#L16235) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16237](../app.js#L16237) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16273](../app.js#L16273) |
| openDeadlineDrawer | button button |  | Reabrir | [16369](../app.js#L16369) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16370](../app.js#L16370) |
| openDeadlineDrawer | button button |  | Editar | [16371](../app.js#L16371) |
| openDeadlineDrawer | button button |  | Ver tópico | [16372](../app.js#L16372) |
| openDeadlineDrawer | button button |  | excluir | [16373](../app.js#L16373) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16388](../app.js#L16388) |
| openDeadlineModal | input date | dl-date |  | [16389](../app.js#L16389) |
| openDeadlineModal | input date | dl-start |  | [16391](../app.js#L16391) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16397](../app.js#L16397) |
| openDeadlineModal | select  | dl-disc |  | [16409](../app.js#L16409) |
| openDeadlineModal | select  | dl-topic |  | [16417](../app.js#L16417) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16435](../app.js#L16435) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16437](../app.js#L16437) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16455](../app.js#L16455) |
| openDeadlineModal | button button |  | Cancelar | [16467](../app.js#L16467) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16468](../app.js#L16468) |
| openDeadlineModal | button button |  | excluir | [16506](../app.js#L16506) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [16940](../app.js#L16940) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [16949](../app.js#L16949) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [16965](../app.js#L16965) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [16999](../app.js#L16999) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17019](../app.js#L17019) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17048](../app.js#L17048) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17076](../app.js#L17076) |
| analyticsCustomBuilder | button button |  | Cancelar | [17093](../app.js#L17093) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17094](../app.js#L17094) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17102](../app.js#L17102) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17106](../app.js#L17106) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17191](../app.js#L17191) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17199](../app.js#L17199) |
| scopePicker | button button |  | limpar | [17201](../app.js#L17201) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17234](../app.js#L17234) |
| saveCurrentAnalysis | input text | sa-name |  | [17258](../app.js#L17258) |
| saveCurrentAnalysis | button button |  | Cancelar | [17273](../app.js#L17273) |
| saveCurrentAnalysis | button button |  | Salvar | [17274](../app.js#L17274) |
| renameSavedAnalysis | input text | sa-rename |  | [17283](../app.js#L17283) |
| renameSavedAnalysis | button button |  | Cancelar | [17293](../app.js#L17293) |
| renameSavedAnalysis | button button |  | Salvar | [17293](../app.js#L17293) |
| rangePicker | button button |  | Mês anterior | [17330](../app.js#L17330) |
| rangePicker | button button |  | Próximo mês | [17332](../app.js#L17332) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17350](../app.js#L17350) |
| rangePicker | input date | an-rs |  | [17373](../app.js#L17373) |
| rangePicker | input date | an-re |  | [17374](../app.js#L17374) |
| rangePicker | button button |  | limpar datas | [17392](../app.js#L17392) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17513](../app.js#L17513) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17556](../app.js#L17556) |
| analyticsPanorama | button button |  | Personalizar análise | [17565](../app.js#L17565) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17572](../app.js#L17572) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17597](../app.js#L17597) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17610](../app.js#L17610) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17612](../app.js#L17612) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17617](../app.js#L17617) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17620](../app.js#L17620) |
| analyticsResultHeader | button button |  | limpar | [17631](../app.js#L17631) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17634](../app.js#L17634) |
| analyticsResultHeader | button button |  | Alterar análise | [17635](../app.js#L17635) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17654](../app.js#L17654) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17671](../app.js#L17671) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17684](../app.js#L17684) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17688](../app.js#L17688) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17703](../app.js#L17703) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17704](../app.js#L17704) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17748](../app.js#L17748) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17804](../app.js#L17804) |
| milestonesViz | button button |  | ver o estudo | [17823](../app.js#L17823) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18120](../app.js#L18120) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18328](../app.js#L18328) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18394](../app.js#L18394) |
| dueReviewsViz | button button |  | Revisar | [18398](../app.js#L18398) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18454](../app.js#L18454) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18524](../app.js#L18524) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18611](../app.js#L18611) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18661](../app.js#L18661) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18680](../app.js#L18680) |
| menuButton | button button |  | dinâmico: it.label | [18690](../app.js#L18690) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18716](../app.js#L18716) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18722](../app.js#L18722) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18731](../app.js#L18731) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18754](../app.js#L18754) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18845](../app.js#L18845) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18854](../app.js#L18854) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [18879](../app.js#L18879) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [18882](../app.js#L18882) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [18931](../app.js#L18931) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [18952](../app.js#L18952) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18975](../app.js#L18975) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19001](../app.js#L19001) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19002](../app.js#L19002) |
| analyticsCalendarCard | button button |  | Analisar este período | [19014](../app.js#L19014) |
| analyticsCalendarCard | button button |  | Cancelar | [19018](../app.js#L19018) |
| calendarHeatmap | button button |  | Mês anterior | [19034](../app.js#L19034) |
| calendarHeatmap | button button |  | Próximo mês | [19036](../app.js#L19036) |
| calendarHeatmap | button button |  | mês atual | [19037](../app.js#L19037) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19082](../app.js#L19082) |
| openDayDrawer | button button |  | Editar este estudo | [19179](../app.js#L19179) |
| openDayDrawer | button button |  | Analisar este dia | [19191](../app.js#L19191) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19196](../app.js#L19196) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19239](../app.js#L19239) |
| openBucketDrawer | button button |  | Analisar este período | [19289](../app.js#L19289) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19311](../app.js#L19311) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19376](../app.js#L19376) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19377](../app.js#L19377) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19412](../app.js#L19412) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19459](../app.js#L19459) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19464](../app.js#L19464) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19516](../app.js#L19516) |
| weeklyReportCard | button button |  | Semana anterior | [19582](../app.js#L19582) |
| weeklyReportCard | button button |  | Próxima semana | [19584](../app.js#L19584) |
| copySummary | textarea  |  | Resumo do período | [19891](../app.js#L19891) |
| copySummary | button button |  | Fechar | [19892](../app.js#L19892) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20066](../app.js#L20066) |
| historyDiscoveries | button button |  | Ver registros usados | [20067](../app.js#L20067) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20070](../app.js#L20070) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20086](../app.js#L20086) |
| renderHistory | button button |  | Registrar estudo | [20087](../app.js#L20087) |
| renderHistory | button button |  | Filtros | [20098](../app.js#L20098) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20105](../app.js#L20105) |
| renderHistory | button button |  | limpar tudo | [20107](../app.js#L20107) |
| openHistoryFilters | button button |  | Aplicar filtros | [20166](../app.js#L20166) |
| openHistoryFilters | button button |  | Limpar | [20169](../app.js#L20169) |
| renderHistoryTable | button button |  | Limpar busca | [20236](../app.js#L20236) |
| renderHistoryTable | button button |  | dinâmico: label | [20264](../app.js#L20264) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20276](../app.js#L20276) |
| openEditSessionModal | button button |  | remover estudo | [20444](../app.js#L20444) |
| openEditSessionModal | button button |  | Cancelar | [20450](../app.js#L20450) |
| openEditSessionModal | button button |  | Salvar | [20451](../app.js#L20451) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20519](../app.js#L20519) |
| confirmLongEdit | button button |  | Está certo, salvar | [20520](../app.js#L20520) |
| openAIReportModal | textarea  |  | Texto do prompt | [20665](../app.js#L20665) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20666](../app.js#L20666) |
| openAIReportModal | button button |  | dinâmico: x.label | [20691](../app.js#L20691) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20705](../app.js#L20705) |
| openAIReportModal | input checkbox | air-comments |  | [20713](../app.js#L20713) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20768](../app.js#L20768) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20776](../app.js#L20776) |
| openAIReportModal | button button |  | Só baixar o CSV | [20782](../app.js#L20782) |
| openAIReportModal | button button |  | Só copiar o prompt | [20783](../app.js#L20783) |
| openAIReportModal | button button |  | Fechar | [20793](../app.js#L20793) |
| runIntegrityCheck | button button |  | Fechar | [20825](../app.js#L20825) |
| renderData | input file | import-file |  | [20837](../app.js#L20837) |
| renderData | button button |  | dinâmico: icon('i-data') | [20850](../app.js#L20850) |
| renderData | button button |  | Onde meus dados ficam? | [20854](../app.js#L20854) |
| renderData | button button |  | Preparar | [20869](../app.js#L20869) |
| renderData | button button |  | Exportar | [20874](../app.js#L20874) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [20875](../app.js#L20875) |
| renderData | button button |  | Verificar | [20892](../app.js#L20892) |
| renderData | button button |  | Pedir ao navegador | [20897](../app.js#L20897) |
| renderData | button button |  | apagar cópia antiga da V2 | [20942](../app.js#L20942) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [20949](../app.js#L20949) |
| renderData | button button |  | Apagar todos os dados | [20953](../app.js#L20953) |
| restoreRefused | button button |  | Entendi | [20990](../app.js#L20990) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21016](../app.js#L21016) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21017](../app.js#L21017) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21018](../app.js#L21018) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21054](../app.js#L21054) |
| openRestorePreview | button button |  | Cancelar | [21091](../app.js#L21091) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21102](../app.js#L21102) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21105](../app.js#L21105) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21110](../app.js#L21110) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21183](../app.js#L21183) |
| bindEvents | button button |  | Fechar | [21185](../app.js#L21185) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21818](../app.js#L21818) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [21877](../app.js#L21877) |
| GlossaryPopover | button button |  | Fechar explicação | [21880](../app.js#L21880) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [21935](../app.js#L21935) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22156](../app.js#L22156) |
| FocusMode | button button |  | dinâmico: a.label | [22313](../app.js#L22313) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22498](../app.js#L22498) |
| pickDisciplineThen | button button |  | Cancelar | [22500](../app.js#L22500) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22579](../app.js#L22579) |
| renderReturnPill | button button |  | Fechar este atalho | [22581](../app.js#L22581) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22603](../app.js#L22603) |
| pickDisciplineForPriority | button button |  | Cancelar | [22606](../app.js#L22606) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22642](../app.js#L22642) |
| helpBreadcrumb | button button |  | dinâmico: label | [22685](../app.js#L22685) |
| articleBody | button button |  | dinâmico: x.label | [22738](../app.js#L22738) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22751](../app.js#L22751) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22765](../app.js#L22765) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22775](../app.js#L22775) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22787](../app.js#L22787) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22802](../app.js#L22802) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22805](../app.js#L22805) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22824](../app.js#L22824) |
| helpSearchCard | button button |  | Limpar busca | [22859](../app.js#L22859) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [22869](../app.js#L22869) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [22954](../app.js#L22954) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [22968](../app.js#L22968) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [22985](../app.js#L22985) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [22997](../app.js#L22997) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23043](../app.js#L23043) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23053](../app.js#L23053) |
| helpHomePanel | button button |  | Rever a apresentação | [23069](../app.js#L23069) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23070](../app.js#L23070) |
| helpHomePanel | button button |  | Ver o guia | [23071](../app.js#L23071) |
| helpHomePanel | button button |  | Ver todas | [23078](../app.js#L23078) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23085](../app.js#L23085) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23087](../app.js#L23087) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23089](../app.js#L23089) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23091](../app.js#L23091) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23105](../app.js#L23105) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23128](../app.js#L23128) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23165](../app.js#L23165) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23206](../app.js#L23206) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23248](../app.js#L23248) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23345](../app.js#L23345) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23372](../app.js#L23372) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23375](../app.js#L23375) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23379](../app.js#L23379) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23413](../app.js#L23413) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23453](../app.js#L23453) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23468](../app.js#L23468) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23469](../app.js#L23469) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23492](../app.js#L23492) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23496](../app.js#L23496) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23503](../app.js#L23503) |
| renderTips | button button |  | Entendi | [23535](../app.js#L23535) |
| toastRich | button button |  | dinâmico: a.label | [23559](../app.js#L23559) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23726](../app.js#L23726) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23757](../app.js#L23757) |
| maybeShowWhatsNew | button button |  | Continuar | [23760](../app.js#L23760) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23813](../app.js#L23813) |
| stepQuick | input text | ob-name | Ex.: Português | [23828](../app.js#L23828) |
| stepQuick | button button |  | dinâmico: ex | [23832](../app.js#L23832) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [23843](../app.js#L23843) |
| stepWhat | button button |  | dinâmico: p.label | [23847](../app.js#L23847) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [23853](../app.js#L23853) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [23859](../app.js#L23859) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [23868](../app.js#L23868) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [23876](../app.js#L23876) |
| stepGoal | input date | ob-goal-d |  | [23878](../app.js#L23878) |
| stepGoal | select  | ob-goal-disc |  | [23880](../app.js#L23880) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [23895](../app.js#L23895) |
| stepTime | input number | ob-hours | Outro | [23904](../app.js#L23904) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [23907](../app.js#L23907) |
| buildActions | button button |  | Voltar | [23963](../app.js#L23963) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [23966](../app.js#L23966) |
| buildActions | button button |  | Criar e continuar | [23970](../app.js#L23970) |
| buildActions | button button |  | Continuar | [23972](../app.js#L23972) |
| buildActions | button button |  | Continuar | [23978](../app.js#L23978) |
| buildActions | button button |  | Continuar | [23986](../app.js#L23986) |
| buildActions | button button |  | Criar e começar | [23991](../app.js#L23991) |
| guideNote | button button |  | dinâmico: a.label | [24151](../app.js#L24151) |
| guideNote | button button |  | Agora não | [24153](../app.js#L24153) |
| startGuideCard | button button |  | ocultar | [24187](../app.js#L24187) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24203](../app.js#L24203) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24232](../app.js#L24232) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24261](../app.js#L24261) |
| openFirstReviewIntro | button button |  | Agora não | [24319](../app.js#L24319) |
| openFirstReviewIntro | button button |  | Começar | [24322](../app.js#L24322) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24367](../app.js#L24367) |
| segmented | button button |  | dinâmico: o.label | [24412](../app.js#L24412) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24425](../app.js#L24425) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24436](../app.js#L24436) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24442](../app.js#L24442) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24475](../app.js#L24475) |
| renderSettings | button button |  | Rever a apresentação | [24508](../app.js#L24508) |
| renderSettings | button button |  | Mostrar novamente | [24510](../app.js#L24510) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24524](../app.js#L24524) |
| renderSettings | button button |  | Mostrar todas de novo | [24564](../app.js#L24564) |
| renderSettings | button button |  | Como funcionam as revisões? | [24569](../app.js#L24569) |
| renderSettings | button button |  | Ver | [24589](../app.js#L24589) |
| renderSettings | button button |  | Fazer backup agora | [24601](../app.js#L24601) |
| renderSettings | button button |  | Abrir tela Dados | [24603](../app.js#L24603) |
| renderSettings | button button |  | Onde meus dados ficam? | [24604](../app.js#L24604) |
| renderSettings | button button |  | Preparar | [24606](../app.js#L24606) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24622](../app.js#L24622) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24623](../app.js#L24623) |
| renderSettings | button button |  | Central de Ajuda | [24624](../app.js#L24624) |
| renderSettings | button button |  | Novidades desta versão | [24625](../app.js#L24625) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24643](../app.js#L24643) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24674](../app.js#L24674) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24682](../app.js#L24682) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24748](../app.js#L24748) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24756](../app.js#L24756) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24779](../app.js#L24779) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24784](../app.js#L24784) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6048](../app.js#L6048) |
| confirmModal | openModal | [6817](../app.js#L6817) |
| openRegisterModal | openModal | [9774](../app.js#L9774) |
| confirmLong | close.push | [9930](../app.js#L9930) |
| openFinishModal | openModal | [10100](../app.js#L10100) |
| offerStaleSession | openModal | [10320](../app.js#L10320) |
| openAlternatives | Drawer.open | [11421](../app.js#L11421) |
| explainAction | openModal | [11425](../app.js#L11425) |
| openDisciplineReview | openModal | [11735](../app.js#L11735) |
| startReview | openModal | [11800](../app.js#L11800) |
| openReviewOutcomeModal | openModal | [11844](../app.js#L11844) |
| openSessionBuilder | openModal | [11880](../app.js#L11880) |
| openReviewPrimer | Drawer.open | [11985](../app.js#L11985) |
| openPlansDrawer | Drawer.open | [12611](../app.js#L12611) |
| createSimplePlan | openModal | [12629](../app.js#L12629) |
| openNewPlanModal | openModal | [12729](../app.js#L12729) |
| openWeekGoalModal | openModal | [12951](../app.js#L12951) |
| openSuggestionEditor | openModal | [13158](../app.js#L13158) |
| openSuggestionPicker | openModal | [13202](../app.js#L13202) |
| weekConflictDialog | close.push | [13394](../app.js#L13394) |
| weekConflictDialog | openModal | [13395](../app.js#L13395) |
| openBlockEditor | openModal | [13507](../app.js#L13507) |
| openMoveDialog | openModal | [13583](../app.js#L13583) |
| openStudyDaysModal | openModal | [13604](../app.js#L13604) |
| openAdjustBlocks | openModal | [13641](../app.js#L13641) |
| openGoalUpdate | openModal | [13689](../app.js#L13689) |
| openTopicDrawer | Drawer.open | [15440](../app.js#L15440) |
| openAreaModal | openModal | [15508](../app.js#L15508) |
| openDisciplineModal | openModal | [15669](../app.js#L15669) |
| openTopicModal | openModal | [16160](../app.js#L16160) |
| openBulkTopicModal | openModal | [16171](../app.js#L16171) |
| openDeadlineDrawer | Drawer.open | [16374](../app.js#L16374) |
| openDeadlineModal | openModal | [16381](../app.js#L16381) |
| saveCurrentAnalysis | openModal | [17257](../app.js#L17257) |
| renameSavedAnalysis | openModal | [17282](../app.js#L17282) |
| openAnalyticsDrawer | Drawer.open | [18992](../app.js#L18992) |
| openDayDrawer | Drawer.open | [19197](../app.js#L19197) |
| openBucketDrawer | Drawer.open | [19292](../app.js#L19292) |
| openDistributionDrawer | Drawer.open | [19378](../app.js#L19378) |
| copySummary | openModal | [19887](../app.js#L19887) |
| openHistoryFilters | Drawer.open | [20170](../app.js#L20170) |
| openEditSessionModal | openModal | [20331](../app.js#L20331) |
| confirmLongEdit | close.push | [20515](../app.js#L20515) |
| openAIReportModal | openModal | [20662](../app.js#L20662) |
| runIntegrityCheck | openModal | [20813](../app.js#L20813) |
| restoreRefused | openModal | [20985](../app.js#L20985) |
| askTimerBeforeRestore | openModal | [21010](../app.js#L21010) |
| openRestorePreview | openModal | [21052](../app.js#L21052) |
| bindEvents | openModal | [21179](../app.js#L21179) |
| openHelpArticle | Drawer.open | [22425](../app.js#L22425) |
| pickDisciplineThen | openModal | [22495](../app.js#L22495) |
| pickDisciplineForPriority | openModal | [22599](../app.js#L22599) |
| openContactDrawer | Drawer.open | [23380](../app.js#L23380) |
| openReportProblemDrawer | Drawer.open | [23472](../app.js#L23472) |
| openScreenHelp | Drawer.open | [23506](../app.js#L23506) |
| maybeShowWhatsNew | openModal | [23749](../app.js#L23749) |
| openWelcome | openModal | [23806](../app.js#L23806) |
| openFirstReviewIntro | openModal | [24310](../app.js#L24310) |
| openChangelog | Drawer.open | [24686](../app.js#L24686) |

## Controles fixos em index.html

| Controle | ID | Nome / texto | Linha |
|---|---|---|---|
| button | theme-toggle | Alternar tema | [84](../index.html#L84) |
| button |  | Hoje | [90](../index.html#L90) |
| button |  | Planejamento | [91](../index.html#L91) |
| button |  | Revisões0 | [92](../index.html#L92) |
| button |  | Disciplinas | [93](../index.html#L93) |
| button |  | Análises | [94](../index.html#L94) |
| button |  | Histórico | [95](../index.html#L95) |
| button |  | Ajuda | [97](../index.html#L97) |
| button |  | Dados | [98](../index.html#L98) |
| button |  | Configurações | [99](../index.html#L99) |
| button | open-palette-m | Buscar no Ciclo | [113](../index.html#L113) |
| button | screen-help-m | Ajuda desta tela | [116](../index.html#L116) |
| button | theme-toggle-m | Alternar tema | [119](../index.html#L119) |
| button | open-palette | Buscar no Ciclo: disciplinas, tópicos, prazos, ações e ajuda | [127](../index.html#L127) |
| button | screen-help | Ajuda desta tela | [132](../index.html#L132) |
| button |  | Hoje | [190](../index.html#L190) |
| button |  | Plano | [191](../index.html#L191) |
| button |  | Revisões0 | [192](../index.html#L192) |
| button |  | Análises | [193](../index.html#L193) |
| button | mb-more | Mais | [194](../index.html#L194) |
| button | fab | Registrar estudo | [199](../index.html#L199) |
| button | drawer-close | Fechar painel | [216](../index.html#L216) |
| input | palette-input | Buscar no Ciclo | [228](../index.html#L228) |
| button | focus-fs | Tela cheia | [249](../index.html#L249) |
| button | focus-exit | Sair do modo foco | [252](../index.html#L252) |
