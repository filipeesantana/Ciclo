# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fontes: app.js e reviews.js. 580 construções de controles, 63 construções de camadas e 737 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6072](../app.js#L6072) |
| askConflict | button button |  | Descartar a minha edição | [6073](../app.js#L6073) |
| askConflict | button button |  | Manter a minha edição | [6074](../app.js#L6074) |
| DataSync | button button |  | Atualizar | [6364](../app.js#L6364) |
| DataSync | button button |  | Continuar editando | [6366](../app.js#L6366) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6843](../app.js#L6843) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6844](../app.js#L6844) |
| selectField | select  | dinâmico: id |  | [7295](../app.js#L7295) |
| pillGroup | button button |  | dinâmico: it.label | [7308](../app.js#L7308) |
| renderTimerBar | button button |  | dinâmico: a.label | [7642](../app.js#L7642) |
| renderTimerBar | button button |  | Foco | [7644](../app.js#L7644) |
| renderTimerBar | button button |  | descartar | [7645](../app.js#L7645) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7836](../app.js#L7836) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7838](../app.js#L7838) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8031](../app.js#L8031) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8034](../app.js#L8034) |
| topicMultiPicker | button button |  | Pronto | [8040](../app.js#L8040) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8055](../app.js#L8055) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8345](../app.js#L8345) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8363](../app.js#L8363) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8405](../app.js#L8405) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8406](../app.js#L8406) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8559](../app.js#L8559) |
| topicSplitField | button button |  |  | [8623](../app.js#L8623) |
| topicSplitField | button button |  | Não dividir | [8627](../app.js#L8627) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8646](../app.js#L8646) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8834](../app.js#L8834) |
| commentField | textarea  | dinâmico: o.id |  | [8884](../app.js#L8884) |
| commentField | button button |  |  | [8887](../app.js#L8887) |
| commentField | button button |  | Recolher | [8888](../app.js#L8888) |
| commentField | button button |  | Remover comentário | [8889](../app.js#L8889) |
| confirmStudySubview | button button |  | Cancelar | [8911](../app.js#L8911) |
| confirmStudySubview | button button |  | dinâmico: label | [8912](../app.js#L8912) |
| howGroup | details  |  | dinâmico: h('summary', { text:'Tipo de estudo e dificuldade' }) | [8931](../app.js#L8931) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8975](../app.js#L8975) |
| resultsField | button button |  | Recolher | [8980](../app.js#L8980) |
| resultsField | button button |  | + Adicionar resultado | [8983](../app.js#L8983) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [9010](../app.js#L9010) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [9012](../app.js#L9012) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9026](../app.js#L9026) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9027](../app.js#L9027) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9028](../app.js#L9028) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9067](../app.js#L9067) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9081](../app.js#L9081) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9083](../app.js#L9083) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9186](../app.js#L9186) |
| breaksEditor | button button |  | dinâmico: addLabel | [9324](../app.js#L9324) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9346](../app.js#L9346) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9359](../app.js#L9359) |
| FormDraft | button button |  | Começar do zero | [9537](../app.js#L9537) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9559](../app.js#L9559) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9564](../app.js#L9564) |
| studyWhenFields | button button |  |  | [9570](../app.js#L9570) |
| studyWhenFields | button button |  |  | [9572](../app.js#L9572) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9576](../app.js#L9576) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9815](../app.js#L9815) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9839](../app.js#L9839) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9851](../app.js#L9851) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9858](../app.js#L9858) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9872](../app.js#L9872) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9884](../app.js#L9884) |
| confirmLong | button button |  | Corrigir | [9959](../app.js#L9959) |
| confirmLong | button button |  | Sim, registrar | [9974](../app.js#L9974) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9981](../app.js#L9981) |
| openRegisterModal | button button |  | Cancelar | [10079](../app.js#L10079) |
| openFinishModal | input number | fin-min |  | [10142](../app.js#L10142) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10187](../app.js#L10187) |
| renderOutcome | select  | fin-method |  | [10221](../app.js#L10221) |
| openFinishModal | button button |  | Registrar estudo | [10263](../app.js#L10263) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10339](../app.js#L10339) |
| offerStaleSession | button button |  | Continuar | [10366](../app.js#L10366) |
| offerStaleSession | button button |  | Descartar | [10367](../app.js#L10367) |
| offerStaleSession | button button |  | Finalizar | [10368](../app.js#L10368) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11210](../app.js#L11210) |
| renderToday | button button |  | Quero ajuda para organizar | [11211](../app.js#L11211) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11259](../app.js#L11259) |
| todayAction | button button |  | dinâmico: icon('i-check') | [11280](../app.js#L11280) |
| todayAction | button button |  | Retomar revisão guiada | [11281](../app.js#L11281) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11282](../app.js#L11282) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11283](../app.js#L11283) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11300](../app.js#L11300) |
| todayAction | button button |  | Por quê? | [11302](../app.js#L11302) |
| todayAction | button button |  | Outras opções | [11303](../app.js#L11303) |
| todaySummary | button button |  | Ver detalhes do dia | [11322](../app.js#L11322) |
| todaySummary | button button |  | Ver registros de hoje | [11323](../app.js#L11323) |
| todayWeekPanel | button button |  | Ver nas Análises | [11372](../app.js#L11372) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11373](../app.js#L11373) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11380](../app.js#L11380) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11383](../app.js#L11383) |
| todayNextSteps | button button |  | Revisar | [11400](../app.js#L11400) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11401](../app.js#L11401) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11428](../app.js#L11428) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11459](../app.js#L11459) |
| nextRow | button button |  | dinâmico: main | [11496](../app.js#L11496) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11508](../app.js#L11508) |
| explainAction | button button |  | Fechar | [11522](../app.js#L11522) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11557](../app.js#L11557) |
| renderReviews | button button |  | Montar revisão guiada | [11558](../app.js#L11558) |
| renderReviews | button button |  | Como funcionam as revisões? | [11560](../app.js#L11560) |
| renderReviews | button button |  | Adicionar um tópico | [11561](../app.js#L11561) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11574](../app.js#L11574) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11575](../app.js#L11575) |
| renderReviews | button button |  | Como funciona? | [11576](../app.js#L11576) |
| renderReviews | button button |  | Religar sugestões | [11577](../app.js#L11577) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11612](../app.js#L11612) |
| drawReviewGroups | button button |  | Limpar busca | [11649](../app.js#L11649) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11660](../app.js#L11660) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11676](../app.js#L11676) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11679](../app.js#L11679) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11681](../app.js#L11681) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11686](../app.js#L11686) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11691](../app.js#L11691) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11694](../app.js#L11694) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11695](../app.js#L11695) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11712](../app.js#L11712) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11716](../app.js#L11716) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11731](../app.js#L11731) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11734](../app.js#L11734) |
| reviewGroupCard | button button |  | Escolher assuntos | [11735](../app.js#L11735) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11759](../app.js#L11759) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11763](../app.js#L11763) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11830](../app.js#L11830) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11842](../app.js#L11842) |
| openDisciplineReview | button button |  | Cancelar | [11864](../app.js#L11864) |
| openDisciplineReview | button button |  | Já revisei | [11865](../app.js#L11865) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11871](../app.js#L11871) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [11910](../app.js#L11910) |
| startReview | button button |  | Cancelar | [11920](../app.js#L11920) |
| startReview | button button |  | Registrar sem cronômetro | [11921](../app.js#L11921) |
| startReview | button button |  | Começar revisão | [11923](../app.js#L11923) |
| openReviewOutcomeModal | input number | ro-min |  | [11936](../app.js#L11936) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11944](../app.js#L11944) |
| openReviewOutcomeModal | button button |  | Cancelar | [11946](../app.js#L11946) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11947](../app.js#L11947) |
| openReviewPrimer | button button |  | O que é revisão? | [11998](../app.js#L11998) |
| openReviewPrimer | button button |  | Por que não basta reler? | [11999](../app.js#L11999) |
| renderPlan | button button |  | Ir para Disciplinas | [12503](../app.js#L12503) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12516](../app.js#L12516) |
| renderPlan | button button |  | Outro valor | [12517](../app.js#L12517) |
| renderPlan | button button |  | Para que serve o planejamento? | [12521](../app.js#L12521) |
| renderPlan | input number | plan-avail-h |  | [12531](../app.js#L12531) |
| renderPlan | input text | plan-name |  | [12539](../app.js#L12539) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12545](../app.js#L12545) |
| renderPlan | button button |  | Sugerir automaticamente | [12553](../app.js#L12553) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12595](../app.js#L12595) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12599](../app.js#L12599) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12602](../app.js#L12602) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12618](../app.js#L12618) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12619](../app.js#L12619) |
| openPlansDrawer | button button |  | Ativar | [12641](../app.js#L12641) |
| openPlansDrawer | button button |  | excluir | [12642](../app.js#L12642) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12644](../app.js#L12644) |
| createSimplePlan | button button |  | Personalizar distribuição | [12677](../app.js#L12677) |
| createSimplePlan | button button |  | Usar esta sugestão | [12682](../app.js#L12682) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12764](../app.js#L12764) |
| openNewPlanModal | input number | np-hours |  | [12765](../app.js#L12765) |
| openNewPlanModal | button button |  | Cancelar | [12774](../app.js#L12774) |
| openNewPlanModal | button button |  | Criar | [12775](../app.js#L12775) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12872](../app.js#L12872) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12879](../app.js#L12879) |
| planWeekHead | button button |  | Alterar meta | [12938](../app.js#L12938) |
| planWeekHead | button button |  | Personalizar distribuição | [12939](../app.js#L12939) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12940](../app.js#L12940) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12965](../app.js#L12965) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [12984](../app.js#L12984) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [12998](../app.js#L12998) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13002](../app.js#L13002) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13005](../app.js#L13005) |
| openWeekGoalModal | button button |  | Cancelar | [13024](../app.js#L13024) |
| openWeekGoalModal | button button |  | Salvar meta | [13025](../app.js#L13025) |
| planWeekNav | button button |  | Semana anterior | [13061](../app.js#L13061) |
| planWeekNav | button button |  | Próxima semana | [13063](../app.js#L13063) |
| planWeekNav | button button |  | Ir para esta semana | [13066](../app.js#L13066) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13067](../app.js#L13067) |
| planWeekNotices | button button |  | Ajustar os blocos | [13111](../app.js#L13111) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13112](../app.js#L13112) |
| planWeekNotices | button button |  | Manter assim | [13114](../app.js#L13114) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13153](../app.js#L13153) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13155](../app.js#L13155) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13173](../app.js#L13173) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13200](../app.js#L13200) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13204](../app.js#L13204) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13226](../app.js#L13226) |
| openSuggestionEditor | button button |  | Só nesta semana | [13227](../app.js#L13227) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13228](../app.js#L13228) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13243](../app.js#L13243) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13249](../app.js#L13249) |
| openSuggestionPicker | button button |  | Cancelar | [13269](../app.js#L13269) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13282](../app.js#L13282) |
| openWeekBlockPicker | input radio |  |  | [13293](../app.js#L13293) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13305](../app.js#L13305) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13311](../app.js#L13311) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13320](../app.js#L13320) |
| openWeekBlockPicker | button button |  | Cancelar | [13325](../app.js#L13325) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13326](../app.js#L13326) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13424](../app.js#L13424) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13455](../app.js#L13455) |
| planOffDays | button button |  | Personalizar dias | [13495](../app.js#L13495) |
| weekConflictDialog | button button |  | Ver a versão atual | [13509](../app.js#L13509) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13510](../app.js#L13510) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13627](../app.js#L13627) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13630](../app.js#L13630) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13634](../app.js#L13634) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13644](../app.js#L13644) |
| openBlockEditor | button button |  | Salvar | [13666](../app.js#L13666) |
| openBlockEditor | button button |  | Tirar deste dia | [13689](../app.js#L13689) |
| openBlockEditor | button button |  | Cancelar | [13690](../app.js#L13690) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13705](../app.js#L13705) |
| openMoveDialog | button button |  | Cancelar | [13714](../app.js#L13714) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13725](../app.js#L13725) |
| openStudyDaysModal | button button |  | Cancelar | [13739](../app.js#L13739) |
| openStudyDaysModal | button button |  | Salvar | [13740](../app.js#L13740) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13771](../app.js#L13771) |
| openAdjustBlocks | button button |  | Cancelar | [13786](../app.js#L13786) |
| openAdjustBlocks | button button |  | Salvar | [13787](../app.js#L13787) |
| openGoalUpdate | button button |  | Cancelar | [13820](../app.js#L13820) |
| openGoalUpdate | button button |  | Só nesta semana | [13821](../app.js#L13821) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13822](../app.js#L13822) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14081](../app.js#L14081) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14142](../app.js#L14142) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14451](../app.js#L14451) |
| contextSearch | button button |  | Limpar busca | [14453](../app.js#L14453) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14481](../app.js#L14481) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14491](../app.js#L14491) |
| collectionView | button button |  | Limpar busca | [14582](../app.js#L14582) |
| collectionView | button button |  | Mostrar todos | [14583](../app.js#L14583) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15063](../app.js#L15063) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15106](../app.js#L15106) |
| levelHead | button button |  | dinâmico: c.label | [15127](../app.js#L15127) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15128](../app.js#L15128) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15199](../app.js#L15199) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15200](../app.js#L15200) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15206](../app.js#L15206) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15211](../app.js#L15211) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15287](../app.js#L15287) |
| discAreaLevel | button button |  | Organizar em uma área | [15298](../app.js#L15298) |
| discAreaLevel | button button |  | Reativar | [15306](../app.js#L15306) |
| discAreaLevel | button button |  | Adicionar disciplina | [15325](../app.js#L15325) |
| discAreaLevel | button button |  | Agora não | [15326](../app.js#L15326) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15336](../app.js#L15336) |
| discDisciplineLevel | button button |  | Reativar | [15365](../app.js#L15365) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15366](../app.js#L15366) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15367](../app.js#L15367) |
| discDisciplineLevel | button button |  | Editar | [15368](../app.js#L15368) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15377](../app.js#L15377) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15413](../app.js#L15413) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15415](../app.js#L15415) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15419](../app.js#L15419) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15450](../app.js#L15450) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15452](../app.js#L15452) |
| topicDetailContent | button button |  | Reativar tópico | [15500](../app.js#L15500) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15503](../app.js#L15503) |
| topicDetailContent | button button |  | Revisar agora | [15504](../app.js#L15504) |
| topicDetailContent | button button |  | Editar | [15505](../app.js#L15505) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15506](../app.js#L15506) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15520](../app.js#L15520) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15533](../app.js#L15533) |
| areaNudgeCard | button button |  | Organizar | [15602](../app.js#L15602) |
| areaNudgeCard | button button |  | Agora não | [15603](../app.js#L15603) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15636](../app.js#L15636) |
| openAreaModal | input checkbox |  |  | [15644](../app.js#L15644) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15659](../app.js#L15659) |
| openAreaModal | button button |  | Cancelar | [15707](../app.js#L15707) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15797](../app.js#L15797) |
| openDisciplineModal | select  | dm-area |  | [15802](../app.js#L15802) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15807](../app.js#L15807) |
| openDisciplineModal | select  | dm-nature |  | [15829](../app.js#L15829) |
| openDisciplineModal | select  | dm-strategy |  | [15833](../app.js#L15833) |
| openDisciplineModal | select  | dm-method |  | [15839](../app.js#L15839) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15845](../app.js#L15845) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15867](../app.js#L15867) |
| openDisciplineModal | button button |  | Cancelar | [15924](../app.js#L15924) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15926](../app.js#L15926) |
| openDisciplineModal | button button |  | excluir definitivamente | [15928](../app.js#L15928) |
| topicReviewOptions | select  | tm-strategy |  | [16046](../app.js#L16046) |
| topicReviewOptions | select  | tm-method |  | [16051](../app.js#L16051) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16056](../app.js#L16056) |
| reviewToggle | input checkbox | tm-review |  | [16067](../app.js#L16067) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16112](../app.js#L16112) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16156](../app.js#L16156) |
| showTwin | button button |  | Usar este tópico | [16173](../app.js#L16173) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16178](../app.js#L16178) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16179](../app.js#L16179) |
| topicEditor | button button |  | dinâmico: saveLabel | [16260](../app.js#L16260) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16262](../app.js#L16262) |
| topicEditor | button button |  | Arquivar | [16266](../app.js#L16266) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16299](../app.js#L16299) |
| openBulkTopicModal | button button |  | Cancelar | [16312](../app.js#L16312) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16313](../app.js#L16313) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16353](../app.js#L16353) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16358](../app.js#L16358) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16359](../app.js#L16359) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16362](../app.js#L16362) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16364](../app.js#L16364) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16400](../app.js#L16400) |
| openDeadlineDrawer | button button |  | Reabrir | [16496](../app.js#L16496) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16497](../app.js#L16497) |
| openDeadlineDrawer | button button |  | Editar | [16498](../app.js#L16498) |
| openDeadlineDrawer | button button |  | Ver tópico | [16499](../app.js#L16499) |
| openDeadlineDrawer | button button |  | excluir | [16500](../app.js#L16500) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16515](../app.js#L16515) |
| openDeadlineModal | input date | dl-date |  | [16516](../app.js#L16516) |
| openDeadlineModal | input date | dl-start |  | [16518](../app.js#L16518) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16524](../app.js#L16524) |
| openDeadlineModal | select  | dl-disc |  | [16536](../app.js#L16536) |
| openDeadlineModal | select  | dl-topic |  | [16544](../app.js#L16544) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16562](../app.js#L16562) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16564](../app.js#L16564) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16582](../app.js#L16582) |
| openDeadlineModal | button button |  | Cancelar | [16594](../app.js#L16594) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16595](../app.js#L16595) |
| openDeadlineModal | button button |  | excluir | [16633](../app.js#L16633) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17067](../app.js#L17067) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17076](../app.js#L17076) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17092](../app.js#L17092) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17126](../app.js#L17126) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17146](../app.js#L17146) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17175](../app.js#L17175) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17203](../app.js#L17203) |
| analyticsCustomBuilder | button button |  | Cancelar | [17220](../app.js#L17220) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17221](../app.js#L17221) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17229](../app.js#L17229) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17233](../app.js#L17233) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17318](../app.js#L17318) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17326](../app.js#L17326) |
| scopePicker | button button |  | limpar | [17328](../app.js#L17328) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17361](../app.js#L17361) |
| saveCurrentAnalysis | input text | sa-name |  | [17385](../app.js#L17385) |
| saveCurrentAnalysis | button button |  | Cancelar | [17400](../app.js#L17400) |
| saveCurrentAnalysis | button button |  | Salvar | [17401](../app.js#L17401) |
| renameSavedAnalysis | input text | sa-rename |  | [17410](../app.js#L17410) |
| renameSavedAnalysis | button button |  | Cancelar | [17420](../app.js#L17420) |
| renameSavedAnalysis | button button |  | Salvar | [17420](../app.js#L17420) |
| rangePicker | button button |  | Mês anterior | [17457](../app.js#L17457) |
| rangePicker | button button |  | Próximo mês | [17459](../app.js#L17459) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17477](../app.js#L17477) |
| rangePicker | input date | an-rs |  | [17500](../app.js#L17500) |
| rangePicker | input date | an-re |  | [17501](../app.js#L17501) |
| rangePicker | button button |  | limpar datas | [17519](../app.js#L17519) |
| analyticsReadingGuide | details  |  | dinâmico: h('summary', {text:'Como ler estes números'}) | [17527](../app.js#L17527) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17649](../app.js#L17649) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17692](../app.js#L17692) |
| analyticsPanorama | button button |  | Personalizar análise | [17701](../app.js#L17701) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17708](../app.js#L17708) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17733](../app.js#L17733) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17746](../app.js#L17746) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17748](../app.js#L17748) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17753](../app.js#L17753) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17756](../app.js#L17756) |
| analyticsResultHeader | button button |  | limpar | [17767](../app.js#L17767) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17770](../app.js#L17770) |
| analyticsResultHeader | button button |  | Alterar análise | [17771](../app.js#L17771) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17790](../app.js#L17790) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17807](../app.js#L17807) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17820](../app.js#L17820) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17824](../app.js#L17824) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17839](../app.js#L17839) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17840](../app.js#L17840) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17884](../app.js#L17884) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17940](../app.js#L17940) |
| milestonesViz | button button |  | ver o estudo | [17959](../app.js#L17959) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18256](../app.js#L18256) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18464](../app.js#L18464) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18530](../app.js#L18530) |
| dueReviewsViz | button button |  | Revisar | [18534](../app.js#L18534) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18590](../app.js#L18590) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18660](../app.js#L18660) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18747](../app.js#L18747) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18797](../app.js#L18797) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18816](../app.js#L18816) |
| menuButton | button button |  | dinâmico: it.label | [18826](../app.js#L18826) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18852](../app.js#L18852) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18858](../app.js#L18858) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18867](../app.js#L18867) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18890](../app.js#L18890) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18981](../app.js#L18981) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18990](../app.js#L18990) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19015](../app.js#L19015) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19018](../app.js#L19018) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19067](../app.js#L19067) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19088](../app.js#L19088) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19111](../app.js#L19111) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19137](../app.js#L19137) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19138](../app.js#L19138) |
| analyticsCalendarCard | button button |  | Analisar este período | [19150](../app.js#L19150) |
| analyticsCalendarCard | button button |  | Cancelar | [19154](../app.js#L19154) |
| calendarHeatmap | button button |  | Mês anterior | [19170](../app.js#L19170) |
| calendarHeatmap | button button |  | Próximo mês | [19172](../app.js#L19172) |
| calendarHeatmap | button button |  | mês atual | [19173](../app.js#L19173) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19218](../app.js#L19218) |
| openDayDrawer | button button |  | Editar este estudo | [19315](../app.js#L19315) |
| openDayDrawer | button button |  | Analisar este dia | [19327](../app.js#L19327) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19332](../app.js#L19332) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19375](../app.js#L19375) |
| openBucketDrawer | button button |  | Analisar este período | [19425](../app.js#L19425) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19447](../app.js#L19447) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19512](../app.js#L19512) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19513](../app.js#L19513) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19548](../app.js#L19548) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19595](../app.js#L19595) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19600](../app.js#L19600) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19652](../app.js#L19652) |
| weeklyReportCard | button button |  | Semana anterior | [19718](../app.js#L19718) |
| weeklyReportCard | button button |  | Próxima semana | [19720](../app.js#L19720) |
| copySummary | textarea  |  | Resumo do período | [20027](../app.js#L20027) |
| copySummary | button button |  | Fechar | [20028](../app.js#L20028) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20202](../app.js#L20202) |
| historyDiscoveries | button button |  | Ver registros usados | [20203](../app.js#L20203) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20206](../app.js#L20206) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20222](../app.js#L20222) |
| renderHistory | button button |  | Registrar estudo | [20223](../app.js#L20223) |
| renderHistory | button button |  | Filtros | [20234](../app.js#L20234) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20241](../app.js#L20241) |
| renderHistory | button button |  | limpar tudo | [20243](../app.js#L20243) |
| openHistoryFilters | button button |  | Aplicar filtros | [20302](../app.js#L20302) |
| openHistoryFilters | button button |  | Limpar | [20305](../app.js#L20305) |
| renderHistoryTable | button button |  | Limpar busca | [20374](../app.js#L20374) |
| renderHistoryTable | button button |  | dinâmico: label | [20402](../app.js#L20402) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20414](../app.js#L20414) |
| openEditSessionModal | button button |  | remover estudo | [20582](../app.js#L20582) |
| openEditSessionModal | button button |  | Cancelar | [20588](../app.js#L20588) |
| openEditSessionModal | button button |  | Salvar | [20589](../app.js#L20589) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20657](../app.js#L20657) |
| confirmLongEdit | button button |  | Está certo, salvar | [20658](../app.js#L20658) |
| openAIReportModal | textarea  |  | Texto do prompt | [20803](../app.js#L20803) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20804](../app.js#L20804) |
| openAIReportModal | button button |  | dinâmico: x.label | [20829](../app.js#L20829) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20843](../app.js#L20843) |
| openAIReportModal | input checkbox | air-comments |  | [20851](../app.js#L20851) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20906](../app.js#L20906) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20914](../app.js#L20914) |
| openAIReportModal | button button |  | Só baixar o CSV | [20920](../app.js#L20920) |
| openAIReportModal | button button |  | Só copiar o prompt | [20921](../app.js#L20921) |
| openAIReportModal | button button |  | Fechar | [20931](../app.js#L20931) |
| runIntegrityCheck | button button |  | Fechar | [20963](../app.js#L20963) |
| renderData | input file | import-file |  | [20975](../app.js#L20975) |
| renderData | button button |  | dinâmico: icon('i-data') | [20988](../app.js#L20988) |
| renderData | button button |  | Onde meus dados ficam? | [20992](../app.js#L20992) |
| renderData | button button |  | Preparar | [21007](../app.js#L21007) |
| renderData | button button |  | Exportar | [21012](../app.js#L21012) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21013](../app.js#L21013) |
| renderData | button button |  | Verificar | [21030](../app.js#L21030) |
| renderData | button button |  | Pedir ao navegador | [21035](../app.js#L21035) |
| renderData | button button |  | apagar cópia antiga da V2 | [21080](../app.js#L21080) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21087](../app.js#L21087) |
| renderData | button button |  | Apagar todos os dados | [21091](../app.js#L21091) |
| restoreRefused | button button |  | Entendi | [21128](../app.js#L21128) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21155](../app.js#L21155) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21156](../app.js#L21156) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21157](../app.js#L21157) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21193](../app.js#L21193) |
| openRestorePreview | button button |  | Cancelar | [21231](../app.js#L21231) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21242](../app.js#L21242) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21245](../app.js#L21245) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21250](../app.js#L21250) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21323](../app.js#L21323) |
| bindEvents | button button |  | Fechar | [21325](../app.js#L21325) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21958](../app.js#L21958) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22017](../app.js#L22017) |
| GlossaryPopover | button button |  | Fechar explicação | [22020](../app.js#L22020) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22075](../app.js#L22075) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22296](../app.js#L22296) |
| FocusMode | button button |  | dinâmico: a.label | [22460](../app.js#L22460) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22661](../app.js#L22661) |
| pickDisciplineThen | button button |  | Cancelar | [22663](../app.js#L22663) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22742](../app.js#L22742) |
| renderReturnPill | button button |  | Fechar este atalho | [22744](../app.js#L22744) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22766](../app.js#L22766) |
| pickDisciplineForPriority | button button |  | Cancelar | [22769](../app.js#L22769) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22805](../app.js#L22805) |
| helpBreadcrumb | button button |  | dinâmico: label | [22848](../app.js#L22848) |
| articleBody | button button |  | dinâmico: x.label | [22901](../app.js#L22901) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22914](../app.js#L22914) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22928](../app.js#L22928) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22938](../app.js#L22938) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22950](../app.js#L22950) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22965](../app.js#L22965) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22968](../app.js#L22968) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22987](../app.js#L22987) |
| helpSearchCard | button button |  | Limpar busca | [23022](../app.js#L23022) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23032](../app.js#L23032) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23117](../app.js#L23117) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23131](../app.js#L23131) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23148](../app.js#L23148) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23160](../app.js#L23160) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23206](../app.js#L23206) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23216](../app.js#L23216) |
| helpHomePanel | button button |  | Rever a apresentação | [23232](../app.js#L23232) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23233](../app.js#L23233) |
| helpHomePanel | button button |  | Ver o guia | [23234](../app.js#L23234) |
| helpHomePanel | button button |  | Ver todas | [23241](../app.js#L23241) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23248](../app.js#L23248) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23250](../app.js#L23250) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23252](../app.js#L23252) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23254](../app.js#L23254) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23268](../app.js#L23268) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23291](../app.js#L23291) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23328](../app.js#L23328) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23369](../app.js#L23369) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23411](../app.js#L23411) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23508](../app.js#L23508) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23535](../app.js#L23535) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23538](../app.js#L23538) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23542](../app.js#L23542) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23576](../app.js#L23576) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23616](../app.js#L23616) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23631](../app.js#L23631) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23632](../app.js#L23632) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23655](../app.js#L23655) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23659](../app.js#L23659) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23666](../app.js#L23666) |
| renderTips | button button |  | Entendi | [23698](../app.js#L23698) |
| toastRich | button button |  | dinâmico: a.label | [23722](../app.js#L23722) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23889](../app.js#L23889) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23920](../app.js#L23920) |
| maybeShowWhatsNew | button button |  | Continuar | [23923](../app.js#L23923) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23976](../app.js#L23976) |
| stepQuick | input text | ob-name | Ex.: Português | [23991](../app.js#L23991) |
| stepQuick | button button |  | dinâmico: ex | [23995](../app.js#L23995) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24006](../app.js#L24006) |
| stepWhat | button button |  | dinâmico: p.label | [24010](../app.js#L24010) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24016](../app.js#L24016) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24022](../app.js#L24022) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24031](../app.js#L24031) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24039](../app.js#L24039) |
| stepGoal | input date | ob-goal-d |  | [24041](../app.js#L24041) |
| stepGoal | select  | ob-goal-disc |  | [24043](../app.js#L24043) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24058](../app.js#L24058) |
| stepTime | input number | ob-hours | Outro | [24067](../app.js#L24067) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24070](../app.js#L24070) |
| buildActions | button button |  | Voltar | [24126](../app.js#L24126) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24129](../app.js#L24129) |
| buildActions | button button |  | Criar e continuar | [24133](../app.js#L24133) |
| buildActions | button button |  | Continuar | [24135](../app.js#L24135) |
| buildActions | button button |  | Continuar | [24141](../app.js#L24141) |
| buildActions | button button |  | Continuar | [24149](../app.js#L24149) |
| buildActions | button button |  | Criar e começar | [24154](../app.js#L24154) |
| guideNote | button button |  | dinâmico: a.label | [24314](../app.js#L24314) |
| guideNote | button button |  | Agora não | [24316](../app.js#L24316) |
| startGuideCard | button button |  | ocultar | [24350](../app.js#L24350) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24366](../app.js#L24366) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24395](../app.js#L24395) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24424](../app.js#L24424) |
| openFirstReviewIntro | button button |  | Agora não | [24482](../app.js#L24482) |
| openFirstReviewIntro | button button |  | Começar | [24485](../app.js#L24485) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24530](../app.js#L24530) |
| segmented | button button |  | dinâmico: o.label | [24575](../app.js#L24575) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24588](../app.js#L24588) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24599](../app.js#L24599) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24605](../app.js#L24605) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24638](../app.js#L24638) |
| renderSettings | button button |  | Rever a apresentação | [24671](../app.js#L24671) |
| renderSettings | button button |  | Mostrar novamente | [24673](../app.js#L24673) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24687](../app.js#L24687) |
| renderSettings | button button |  | Mostrar todas de novo | [24727](../app.js#L24727) |
| renderSettings | button button |  | Como funcionam as revisões? | [24732](../app.js#L24732) |
| renderSettings | button button |  | Ver | [24752](../app.js#L24752) |
| renderSettings | button button |  | Fazer backup agora | [24764](../app.js#L24764) |
| renderSettings | button button |  | Abrir tela Dados | [24766](../app.js#L24766) |
| renderSettings | button button |  | Onde meus dados ficam? | [24767](../app.js#L24767) |
| renderSettings | button button |  | Preparar | [24769](../app.js#L24769) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24785](../app.js#L24785) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24786](../app.js#L24786) |
| renderSettings | button button |  | Central de Ajuda | [24787](../app.js#L24787) |
| renderSettings | button button |  | Novidades desta versão | [24788](../app.js#L24788) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24806](../app.js#L24806) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24837](../app.js#L24837) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24845](../app.js#L24845) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24911](../app.js#L24911) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24919](../app.js#L24919) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24942](../app.js#L24942) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24947](../app.js#L24947) |
| reviewButton | button button |  | dinâmico: text | [92](../reviews.js#L92) |
| reviewSelect | select  | dinâmico: id | dinâmico: options.map(([v,text])=>h('option',{value:v,text,selected:v===value})) | [95](../reviews.js#L95) |
| openGuidedReviewBuilder | input number |  |  | [112](../reviews.js#L112) |
| draw | input number |  |  | [137](../reviews.js#L137) |
| openGuidedReviewBuilder | button button |  | dinâmico: v+' min' | [155](../reviews.js#L155) |
| openGuidedReviewBuilder | details  |  | dinâmico: h('summary',{text:'Escolher disciplinas da proposta'}) | [157](../reviews.js#L157) |
| openGuidedReviewBuilder | input checkbox |  |  | [157](../reviews.js#L157) |
| openGuidedReviewResult | input number |  |  | [205](../reviews.js#L205) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6066](../app.js#L6066) |
| confirmModal | openModal | [6839](../app.js#L6839) |
| confirmStudySubview | close.push | [8910](../app.js#L8910) |
| openRegisterModal | openModal | [9810](../app.js#L9810) |
| confirmLong | close.push | [9967](../app.js#L9967) |
| openFinishModal | openModal | [10140](../app.js#L10140) |
| offerStaleSession | openModal | [10359](../app.js#L10359) |
| openAlternatives | Drawer.open | [11510](../app.js#L11510) |
| explainAction | openModal | [11514](../app.js#L11514) |
| openDisciplineReview | openModal | [11826](../app.js#L11826) |
| startReview | openModal | [11891](../app.js#L11891) |
| openReviewOutcomeModal | openModal | [11935](../app.js#L11935) |
| openReviewPrimer | Drawer.open | [12001](../app.js#L12001) |
| openPlansDrawer | Drawer.open | [12645](../app.js#L12645) |
| createSimplePlan | openModal | [12663](../app.js#L12663) |
| openNewPlanModal | openModal | [12763](../app.js#L12763) |
| openWeekGoalModal | openModal | [12996](../app.js#L12996) |
| openSuggestionEditor | openModal | [13198](../app.js#L13198) |
| openSuggestionPicker | openModal | [13242](../app.js#L13242) |
| openWeekBlockPicker | openModal | [13281](../app.js#L13281) |
| weekConflictDialog | close.push | [13513](../app.js#L13513) |
| weekConflictDialog | openModal | [13514](../app.js#L13514) |
| openBlockEditor | openModal | [13626](../app.js#L13626) |
| openMoveDialog | openModal | [13702](../app.js#L13702) |
| openStudyDaysModal | openModal | [13723](../app.js#L13723) |
| openAdjustBlocks | openModal | [13760](../app.js#L13760) |
| openGoalUpdate | openModal | [13808](../app.js#L13808) |
| openTopicDrawer | Drawer.open | [15567](../app.js#L15567) |
| openAreaModal | openModal | [15635](../app.js#L15635) |
| openDisciplineModal | openModal | [15796](../app.js#L15796) |
| openTopicModal | openModal | [16287](../app.js#L16287) |
| openBulkTopicModal | openModal | [16298](../app.js#L16298) |
| openDeadlineDrawer | Drawer.open | [16501](../app.js#L16501) |
| openDeadlineModal | openModal | [16508](../app.js#L16508) |
| saveCurrentAnalysis | openModal | [17384](../app.js#L17384) |
| renameSavedAnalysis | openModal | [17409](../app.js#L17409) |
| openAnalyticsDrawer | Drawer.open | [19128](../app.js#L19128) |
| openDayDrawer | Drawer.open | [19333](../app.js#L19333) |
| openBucketDrawer | Drawer.open | [19428](../app.js#L19428) |
| openDistributionDrawer | Drawer.open | [19514](../app.js#L19514) |
| copySummary | openModal | [20023](../app.js#L20023) |
| openHistoryFilters | Drawer.open | [20306](../app.js#L20306) |
| openEditSessionModal | openModal | [20469](../app.js#L20469) |
| confirmLongEdit | close.push | [20653](../app.js#L20653) |
| openAIReportModal | openModal | [20800](../app.js#L20800) |
| runIntegrityCheck | openModal | [20951](../app.js#L20951) |
| restoreRefused | openModal | [21123](../app.js#L21123) |
| askTimerBeforeRestore | openModal | [21149](../app.js#L21149) |
| openRestorePreview | openModal | [21191](../app.js#L21191) |
| bindEvents | openModal | [21319](../app.js#L21319) |
| openHelpArticle | Drawer.open | [22588](../app.js#L22588) |
| pickDisciplineThen | openModal | [22658](../app.js#L22658) |
| pickDisciplineForPriority | openModal | [22762](../app.js#L22762) |
| openContactDrawer | Drawer.open | [23543](../app.js#L23543) |
| openReportProblemDrawer | Drawer.open | [23635](../app.js#L23635) |
| openScreenHelp | Drawer.open | [23669](../app.js#L23669) |
| maybeShowWhatsNew | openModal | [23912](../app.js#L23912) |
| openWelcome | openModal | [23969](../app.js#L23969) |
| openFirstReviewIntro | openModal | [24473](../app.js#L24473) |
| openChangelog | Drawer.open | [24849](../app.js#L24849) |
| openGuidedReviewBuilder | openModal | [110](../reviews.js#L110) |
| openGuidedReviewPlayer | openModal | [164](../reviews.js#L164) |
| openGuidedReviewResult | openModal | [203](../reviews.js#L203) |

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
