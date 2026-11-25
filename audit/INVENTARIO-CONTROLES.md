# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fontes: app.js, reviews.js, reports.js, learning.js, dates.js, insights.js. 642 construções de controles, 71 construções de camadas e 820 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](../audit/MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6111](../app.js#L6111) |
| askConflict | button button |  | Descartar a minha edição | [6112](../app.js#L6112) |
| askConflict | button button |  | Manter a minha edição | [6113](../app.js#L6113) |
| DataSync | button button |  | Atualizar | [6403](../app.js#L6403) |
| DataSync | button button |  | Continuar editando | [6405](../app.js#L6405) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6884](../app.js#L6884) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6885](../app.js#L6885) |
| selectField | select  | dinâmico: id |  | [7336](../app.js#L7336) |
| pillGroup | button button |  | dinâmico: it.label | [7349](../app.js#L7349) |
| setView | button button |  | dinâmico: label | [7408](../app.js#L7408) |
| renderTimerBar | button button |  | dinâmico: a.label | [7689](../app.js#L7689) |
| renderTimerBar | button button |  | Foco | [7691](../app.js#L7691) |
| renderTimerBar | button button |  | descartar | [7692](../app.js#L7692) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7883](../app.js#L7883) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7885](../app.js#L7885) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8078](../app.js#L8078) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8081](../app.js#L8081) |
| topicMultiPicker | button button |  | Pronto | [8087](../app.js#L8087) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8102](../app.js#L8102) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8393](../app.js#L8393) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8412](../app.js#L8412) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8454](../app.js#L8454) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8455](../app.js#L8455) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8610](../app.js#L8610) |
| topicSplitField | button button |  |  | [8674](../app.js#L8674) |
| topicSplitField | button button |  | Não dividir | [8678](../app.js#L8678) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8697](../app.js#L8697) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8885](../app.js#L8885) |
| commentField | textarea  | dinâmico: o.id |  | [8935](../app.js#L8935) |
| commentField | button button |  |  | [8938](../app.js#L8938) |
| commentField | button button |  | Recolher | [8939](../app.js#L8939) |
| commentField | button button |  | Remover comentário | [8940](../app.js#L8940) |
| confirmStudySubview | button button |  | Cancelar | [8962](../app.js#L8962) |
| confirmStudySubview | button button |  | dinâmico: label | [8963](../app.js#L8963) |
| howGroup | details  |  | dinâmico: h('summary', { text:'Tipo de estudo e dificuldade' }) | [8982](../app.js#L8982) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [9026](../app.js#L9026) |
| resultsField | button button |  | Recolher | [9031](../app.js#L9031) |
| resultsField | button button |  | + Adicionar resultado | [9034](../app.js#L9034) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [9061](../app.js#L9061) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [9063](../app.js#L9063) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9077](../app.js#L9077) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9078](../app.js#L9078) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9079](../app.js#L9079) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9118](../app.js#L9118) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9132](../app.js#L9132) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9134](../app.js#L9134) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9237](../app.js#L9237) |
| breaksEditor | button button |  | dinâmico: addLabel | [9375](../app.js#L9375) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9397](../app.js#L9397) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9410](../app.js#L9410) |
| FormDraft | button button |  | Começar do zero | [9588](../app.js#L9588) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9610](../app.js#L9610) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9615](../app.js#L9615) |
| studyWhenFields | button button |  |  | [9621](../app.js#L9621) |
| studyWhenFields | button button |  |  | [9623](../app.js#L9623) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9627](../app.js#L9627) |
| studyWhenFields | details  |  | dinâmico: h('summary', {text:'Data, horários e descansos'}) | [9773](../app.js#L9773) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9871](../app.js#L9871) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9895](../app.js#L9895) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9907](../app.js#L9907) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9914](../app.js#L9914) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9928](../app.js#L9928) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9940](../app.js#L9940) |
| confirmLong | button button |  | Corrigir | [10019](../app.js#L10019) |
| confirmLong | button button |  | Sim, registrar | [10034](../app.js#L10034) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [10041](../app.js#L10041) |
| openRegisterModal | details  |  | dinâmico: h('summary', null, icon('i-help', 'btn-icon'), 'Ajuda do registro') | [10134](../app.js#L10134) |
| openRegisterModal | button button |  | Cancelar | [10154](../app.js#L10154) |
| openFinishModal | input number | fin-min |  | [10217](../app.js#L10217) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10262](../app.js#L10262) |
| renderOutcome | select  | fin-method |  | [10300](../app.js#L10300) |
| openFinishModal | button button |  | Registrar estudo | [10342](../app.js#L10342) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10420](../app.js#L10420) |
| offerStaleSession | button button |  | Continuar | [10447](../app.js#L10447) |
| offerStaleSession | button button |  | Descartar | [10448](../app.js#L10448) |
| offerStaleSession | button button |  | Finalizar | [10449](../app.js#L10449) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11302](../app.js#L11302) |
| renderToday | button button |  | Quero ajuda para organizar | [11303](../app.js#L11303) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Resumo da semana'}) | [11317](../app.js#L11317) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Atalhos e organização'}) | [11318](../app.js#L11318) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Frase do dia'}) | [11322](../app.js#L11322) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11351](../app.js#L11351) |
| todayAction | button button |  | dinâmico: icon('i-focus') | [11372](../app.js#L11372) |
| todayAction | button button |  | Retomar revisão guiada | [11373](../app.js#L11373) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11374](../app.js#L11374) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11375](../app.js#L11375) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11392](../app.js#L11392) |
| todayAction | button button |  | Por quê? | [11394](../app.js#L11394) |
| todayAction | button button |  | Outras opções | [11395](../app.js#L11395) |
| todayAction | details  |  | dinâmico: h('summary', {text:'Sugestão de estudo'}) | [11399](../app.js#L11399) |
| todaySummary | button button |  | dinâmico: icon('i-history') | [11416](../app.js#L11416) |
| todaySummary | button button |  | Criar relatório | [11417](../app.js#L11417) |
| todaySummary | button button |  | Ver detalhes do dia | [11418](../app.js#L11418) |
| todayWeekPanel | button button |  | Ver nas Análises | [11467](../app.js#L11467) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11468](../app.js#L11468) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11475](../app.js#L11475) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11478](../app.js#L11478) |
| todayNextSteps | button button |  | Revisar | [11495](../app.js#L11495) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11496](../app.js#L11496) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11523](../app.js#L11523) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11554](../app.js#L11554) |
| nextRow | button button |  | dinâmico: main | [11591](../app.js#L11591) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11603](../app.js#L11603) |
| explainAction | button button |  | Fechar | [11617](../app.js#L11617) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11654](../app.js#L11654) |
| renderReviews | button button |  | Montar revisão guiada | [11655](../app.js#L11655) |
| renderReviews | button button |  | Adicionar um tópico | [11657](../app.js#L11657) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11670](../app.js#L11670) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11671](../app.js#L11671) |
| renderReviews | button button |  | Religar sugestões | [11672](../app.js#L11672) |
| renderReviews | details  |  | dinâmico: h('summary', {text:'Sugestões e adiamentos'}) | [11689](../app.js#L11689) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11714](../app.js#L11714) |
| drawReviewGroups | button button |  | Limpar busca | [11751](../app.js#L11751) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11762](../app.js#L11762) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11778](../app.js#L11778) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11781](../app.js#L11781) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11783](../app.js#L11783) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11788](../app.js#L11788) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11793](../app.js#L11793) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11796](../app.js#L11796) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11797](../app.js#L11797) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11814](../app.js#L11814) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11818](../app.js#L11818) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11833](../app.js#L11833) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11836](../app.js#L11836) |
| reviewGroupCard | button button |  | Escolher assuntos | [11837](../app.js#L11837) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11856](../app.js#L11856) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11860](../app.js#L11860) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11915](../app.js#L11915) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11927](../app.js#L11927) |
| openDisciplineReview | button button |  | Cancelar | [11949](../app.js#L11949) |
| openDisciplineReview | button button |  | Já revisei | [11950](../app.js#L11950) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11956](../app.js#L11956) |
| startReview | button button |  | Cancelar | [12003](../app.js#L12003) |
| startReview | button button |  | Registrar sem cronômetro | [12004](../app.js#L12004) |
| startReview | button button |  | Começar revisão | [12006](../app.js#L12006) |
| openReviewOutcomeModal | input number | ro-min |  | [12019](../app.js#L12019) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [12027](../app.js#L12027) |
| openReviewOutcomeModal | button button |  | Cancelar | [12029](../app.js#L12029) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [12030](../app.js#L12030) |
| openReviewPrimer | button button |  | O que é revisão? | [12081](../app.js#L12081) |
| openReviewPrimer | button button |  | Por que não basta reler? | [12082](../app.js#L12082) |
| renderPlan | button button |  | Ir para Disciplinas | [12586](../app.js#L12586) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12599](../app.js#L12599) |
| renderPlan | button button |  | Outro valor | [12600](../app.js#L12600) |
| renderPlan | button button |  | Para que serve o planejamento? | [12604](../app.js#L12604) |
| renderPlan | input number | plan-avail-h |  | [12614](../app.js#L12614) |
| renderPlan | input text | plan-name |  | [12622](../app.js#L12622) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12628](../app.js#L12628) |
| renderPlan | button button |  | Sugerir automaticamente | [12636](../app.js#L12636) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12678](../app.js#L12678) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12682](../app.js#L12682) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12685](../app.js#L12685) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12701](../app.js#L12701) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12702](../app.js#L12702) |
| openPlansDrawer | button button |  | Ativar | [12724](../app.js#L12724) |
| openPlansDrawer | button button |  | excluir | [12725](../app.js#L12725) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12727](../app.js#L12727) |
| createSimplePlan | button button |  | Personalizar distribuição | [12760](../app.js#L12760) |
| createSimplePlan | button button |  | Usar esta sugestão | [12765](../app.js#L12765) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12847](../app.js#L12847) |
| openNewPlanModal | input number | np-hours |  | [12848](../app.js#L12848) |
| openNewPlanModal | button button |  | Cancelar | [12857](../app.js#L12857) |
| openNewPlanModal | button button |  | Criar | [12858](../app.js#L12858) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12955](../app.js#L12955) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12962](../app.js#L12962) |
| planWeekHead | button button |  | Alterar meta | [13021](../app.js#L13021) |
| planWeekHead | button button |  | Personalizar distribuição | [13022](../app.js#L13022) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [13023](../app.js#L13023) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [13048](../app.js#L13048) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [13067](../app.js#L13067) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [13081](../app.js#L13081) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13085](../app.js#L13085) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13088](../app.js#L13088) |
| openWeekGoalModal | button button |  | Cancelar | [13107](../app.js#L13107) |
| openWeekGoalModal | button button |  | Salvar meta | [13108](../app.js#L13108) |
| planWeekNav | button button |  | Semana anterior | [13144](../app.js#L13144) |
| planWeekNav | button button |  | Próxima semana | [13146](../app.js#L13146) |
| planWeekNav | button button |  | Ir para esta semana | [13150](../app.js#L13150) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13151](../app.js#L13151) |
| planWeekNotices | button button |  | Ajustar os blocos | [13195](../app.js#L13195) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13196](../app.js#L13196) |
| planWeekNotices | button button |  | Manter assim | [13198](../app.js#L13198) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13237](../app.js#L13237) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13239](../app.js#L13239) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13257](../app.js#L13257) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13284](../app.js#L13284) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13288](../app.js#L13288) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13310](../app.js#L13310) |
| openSuggestionEditor | button button |  | Só nesta semana | [13311](../app.js#L13311) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13312](../app.js#L13312) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13327](../app.js#L13327) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13333](../app.js#L13333) |
| openSuggestionPicker | button button |  | Cancelar | [13353](../app.js#L13353) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13366](../app.js#L13366) |
| openWeekBlockPicker | input radio |  |  | [13377](../app.js#L13377) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13389](../app.js#L13389) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13395](../app.js#L13395) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13404](../app.js#L13404) |
| openWeekBlockPicker | button button |  | Cancelar | [13409](../app.js#L13409) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13410](../app.js#L13410) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13508](../app.js#L13508) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13539](../app.js#L13539) |
| planOffDays | button button |  | Personalizar dias | [13579](../app.js#L13579) |
| weekConflictDialog | button button |  | Ver a versão atual | [13593](../app.js#L13593) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13594](../app.js#L13594) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13711](../app.js#L13711) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13714](../app.js#L13714) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13718](../app.js#L13718) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13728](../app.js#L13728) |
| openBlockEditor | button button |  | Salvar | [13750](../app.js#L13750) |
| openBlockEditor | button button |  | Tirar deste dia | [13773](../app.js#L13773) |
| openBlockEditor | button button |  | Cancelar | [13774](../app.js#L13774) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13789](../app.js#L13789) |
| openMoveDialog | button button |  | Cancelar | [13798](../app.js#L13798) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13809](../app.js#L13809) |
| openStudyDaysModal | button button |  | Cancelar | [13823](../app.js#L13823) |
| openStudyDaysModal | button button |  | Salvar | [13824](../app.js#L13824) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13855](../app.js#L13855) |
| openAdjustBlocks | button button |  | Cancelar | [13870](../app.js#L13870) |
| openAdjustBlocks | button button |  | Salvar | [13871](../app.js#L13871) |
| openGoalUpdate | button button |  | Cancelar | [13904](../app.js#L13904) |
| openGoalUpdate | button button |  | Só nesta semana | [13905](../app.js#L13905) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13906](../app.js#L13906) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14165](../app.js#L14165) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14226](../app.js#L14226) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14535](../app.js#L14535) |
| contextSearch | button button |  | Limpar busca | [14537](../app.js#L14537) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14565](../app.js#L14565) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14575](../app.js#L14575) |
| collectionView | button button |  | Limpar busca | [14666](../app.js#L14666) |
| collectionView | button button |  | Mostrar todos | [14667](../app.js#L14667) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15157](../app.js#L15157) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15201](../app.js#L15201) |
| levelHead | button button |  | dinâmico: c.label | [15222](../app.js#L15222) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15223](../app.js#L15223) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15294](../app.js#L15294) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15295](../app.js#L15295) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15301](../app.js#L15301) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15306](../app.js#L15306) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15382](../app.js#L15382) |
| discAreaLevel | button button |  | Organizar em uma área | [15393](../app.js#L15393) |
| discAreaLevel | button button |  | Reativar | [15401](../app.js#L15401) |
| discAreaLevel | button button |  | Adicionar disciplina | [15420](../app.js#L15420) |
| discAreaLevel | button button |  | Agora não | [15421](../app.js#L15421) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15431](../app.js#L15431) |
| discDisciplineLevel | button button |  | Reativar | [15460](../app.js#L15460) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15461](../app.js#L15461) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15462](../app.js#L15462) |
| discDisciplineLevel | button button |  | Editar | [15463](../app.js#L15463) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15473](../app.js#L15473) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15509](../app.js#L15509) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15511](../app.js#L15511) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15515](../app.js#L15515) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15546](../app.js#L15546) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15548](../app.js#L15548) |
| topicDetailContent | button button |  | Reativar tópico | [15596](../app.js#L15596) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15599](../app.js#L15599) |
| topicDetailContent | button button |  | Revisar agora | [15600](../app.js#L15600) |
| topicDetailContent | button button |  | Agendar revisão | [15601](../app.js#L15601) |
| topicDetailContent | button button |  | Editar | [15602](../app.js#L15602) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15603](../app.js#L15603) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15617](../app.js#L15617) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15630](../app.js#L15630) |
| areaNudgeCard | button button |  | Organizar | [15699](../app.js#L15699) |
| areaNudgeCard | button button |  | Agora não | [15700](../app.js#L15700) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15733](../app.js#L15733) |
| openAreaModal | input checkbox |  |  | [15741](../app.js#L15741) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15756](../app.js#L15756) |
| openAreaModal | button button |  | Cancelar | [15804](../app.js#L15804) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15894](../app.js#L15894) |
| openDisciplineModal | select  | dm-area |  | [15899](../app.js#L15899) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15904](../app.js#L15904) |
| openDisciplineModal | select  | dm-nature |  | [15926](../app.js#L15926) |
| openDisciplineModal | select  | dm-strategy |  | [15930](../app.js#L15930) |
| openDisciplineModal | select  | dm-method |  | [15936](../app.js#L15936) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15942](../app.js#L15942) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15964](../app.js#L15964) |
| openDisciplineModal | button button |  | Cancelar | [16021](../app.js#L16021) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [16023](../app.js#L16023) |
| openDisciplineModal | button button |  | excluir definitivamente | [16025](../app.js#L16025) |
| topicReviewOptions | select  | tm-strategy |  | [16144](../app.js#L16144) |
| topicReviewOptions | select  | tm-method |  | [16149](../app.js#L16149) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16154](../app.js#L16154) |
| reviewToggle | input checkbox | tm-review |  | [16165](../app.js#L16165) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16210](../app.js#L16210) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16254](../app.js#L16254) |
| showTwin | button button |  | Usar este tópico | [16271](../app.js#L16271) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16276](../app.js#L16276) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16277](../app.js#L16277) |
| topicEditor | button button |  | dinâmico: saveLabel | [16358](../app.js#L16358) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16360](../app.js#L16360) |
| topicEditor | button button |  | Arquivar | [16364](../app.js#L16364) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16397](../app.js#L16397) |
| openBulkTopicModal | button button |  | Cancelar | [16410](../app.js#L16410) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16411](../app.js#L16411) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16451](../app.js#L16451) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16456](../app.js#L16456) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16457](../app.js#L16457) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16460](../app.js#L16460) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16462](../app.js#L16462) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16498](../app.js#L16498) |
| deadlinesPanel | details  |  | dinâmico: h('summary',{text:'Arquivados ('+archived.length+')'}) | [16506](../app.js#L16506) |
| openDeadlineDrawer | button button |  | Reabrir | [16601](../app.js#L16601) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16602](../app.js#L16602) |
| openDeadlineDrawer | button button |  | Editar | [16603](../app.js#L16603) |
| openDeadlineDrawer | button button |  | Ver tópico | [16605](../app.js#L16605) |
| openDeadlineDrawer | button button |  | excluir | [16606](../app.js#L16606) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16621](../app.js#L16621) |
| openDeadlineModal | input date | dl-date |  | [16622](../app.js#L16622) |
| openDeadlineModal | input date | dl-start |  | [16624](../app.js#L16624) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16630](../app.js#L16630) |
| openDeadlineModal | select  | dl-disc |  | [16642](../app.js#L16642) |
| openDeadlineModal | select  | dl-topic |  | [16650](../app.js#L16650) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16668](../app.js#L16668) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16670](../app.js#L16670) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16688](../app.js#L16688) |
| openDeadlineModal | button button |  | Cancelar | [16700](../app.js#L16700) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16701](../app.js#L16701) |
| openDeadlineModal | button button |  | excluir | [16739](../app.js#L16739) |
| renderAnalytics | button button |  | dinâmico: icon('i-download') | [17106](../app.js#L17106) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17177](../app.js#L17177) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17186](../app.js#L17186) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17202](../app.js#L17202) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17236](../app.js#L17236) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17256](../app.js#L17256) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17285](../app.js#L17285) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17313](../app.js#L17313) |
| analyticsCustomBuilder | button button |  | Cancelar | [17330](../app.js#L17330) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17331](../app.js#L17331) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17339](../app.js#L17339) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17343](../app.js#L17343) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17428](../app.js#L17428) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17436](../app.js#L17436) |
| scopePicker | button button |  | limpar | [17438](../app.js#L17438) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17471](../app.js#L17471) |
| saveCurrentAnalysis | input text | sa-name |  | [17495](../app.js#L17495) |
| saveCurrentAnalysis | button button |  | Cancelar | [17510](../app.js#L17510) |
| saveCurrentAnalysis | button button |  | Salvar | [17511](../app.js#L17511) |
| renameSavedAnalysis | input text | sa-rename |  | [17520](../app.js#L17520) |
| renameSavedAnalysis | button button |  | Cancelar | [17530](../app.js#L17530) |
| renameSavedAnalysis | button button |  | Salvar | [17530](../app.js#L17530) |
| analyticsReadingGuide | details  |  | dinâmico: h('summary', {text:'Como ler estes números'}) | [17555](../app.js#L17555) |
| resultDisclosure | details  |  | dinâmico: h('summary', {text:title}) | [17567](../app.js#L17567) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17634](../app.js#L17634) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17659](../app.js#L17659) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17676](../app.js#L17676) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17689](../app.js#L17689) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17693](../app.js#L17693) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17708](../app.js#L17708) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17709](../app.js#L17709) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17753](../app.js#L17753) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17809](../app.js#L17809) |
| milestonesViz | button button |  | ver o estudo | [17828](../app.js#L17828) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18125](../app.js#L18125) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18333](../app.js#L18333) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18399](../app.js#L18399) |
| dueReviewsViz | button button |  | Revisar | [18403](../app.js#L18403) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18459](../app.js#L18459) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18529](../app.js#L18529) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18616](../app.js#L18616) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18666](../app.js#L18666) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18685](../app.js#L18685) |
| menuButton | button button |  | dinâmico: it.label | [18695](../app.js#L18695) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18721](../app.js#L18721) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18727](../app.js#L18727) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18736](../app.js#L18736) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18759](../app.js#L18759) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18850](../app.js#L18850) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18859](../app.js#L18859) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [18884](../app.js#L18884) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [18887](../app.js#L18887) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [18936](../app.js#L18936) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [18957](../app.js#L18957) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18980](../app.js#L18980) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19006](../app.js#L19006) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19007](../app.js#L19007) |
| analyticsCalendarCard | button button |  | Analisar este período | [19019](../app.js#L19019) |
| analyticsCalendarCard | button button |  | Cancelar | [19023](../app.js#L19023) |
| calendarHeatmap | button button |  | Mês anterior | [19039](../app.js#L19039) |
| calendarHeatmap | button button |  | Próximo mês | [19041](../app.js#L19041) |
| calendarHeatmap | button button |  | mês atual | [19042](../app.js#L19042) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19087](../app.js#L19087) |
| openDayDrawer | button button |  | Editar este estudo | [19184](../app.js#L19184) |
| openDayDrawer | button button |  | Analisar este dia | [19196](../app.js#L19196) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19201](../app.js#L19201) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19244](../app.js#L19244) |
| openBucketDrawer | button button |  | Analisar este período | [19294](../app.js#L19294) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19316](../app.js#L19316) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19381](../app.js#L19381) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19382](../app.js#L19382) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19417](../app.js#L19417) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19464](../app.js#L19464) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19469](../app.js#L19469) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19521](../app.js#L19521) |
| weeklyReportCard | button button |  | Semana anterior | [19587](../app.js#L19587) |
| weeklyReportCard | button button |  | Próxima semana | [19589](../app.js#L19589) |
| copySummary | textarea  |  | Resumo do período | [19896](../app.js#L19896) |
| copySummary | button button |  | Fechar | [19897](../app.js#L19897) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20071](../app.js#L20071) |
| historyDiscoveries | button button |  | Ver registros usados | [20072](../app.js#L20072) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20075](../app.js#L20075) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20091](../app.js#L20091) |
| renderHistory | button button |  | Registrar estudo | [20092](../app.js#L20092) |
| renderHistory | button button |  | Filtros | [20103](../app.js#L20103) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20109](../app.js#L20109) |
| renderHistory | button button |  | limpar tudo | [20111](../app.js#L20111) |
| openHistoryFilters | button button |  | Aplicar filtros | [20173](../app.js#L20173) |
| openHistoryFilters | button button |  | Limpar | [20176](../app.js#L20176) |
| renderHistoryTable | button button |  | Limpar busca | [20247](../app.js#L20247) |
| renderHistoryTable | button button |  | dinâmico: label | [20277](../app.js#L20277) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20289](../app.js#L20289) |
| openEditSessionModal | button button |  | remover estudo | [20462](../app.js#L20462) |
| openEditSessionModal | button button |  | Cancelar | [20468](../app.js#L20468) |
| openEditSessionModal | button button |  | Salvar | [20469](../app.js#L20469) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20537](../app.js#L20537) |
| confirmLongEdit | button button |  | Está certo, salvar | [20538](../app.js#L20538) |
| openAIReportModal | textarea  |  | Texto do prompt | [20683](../app.js#L20683) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20684](../app.js#L20684) |
| openAIReportModal | button button |  | dinâmico: x.label | [20709](../app.js#L20709) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20723](../app.js#L20723) |
| openAIReportModal | input checkbox | air-comments |  | [20731](../app.js#L20731) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20786](../app.js#L20786) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20794](../app.js#L20794) |
| openAIReportModal | button button |  | Só baixar o CSV | [20800](../app.js#L20800) |
| openAIReportModal | button button |  | Só copiar o prompt | [20801](../app.js#L20801) |
| openAIReportModal | button button |  | Fechar | [20811](../app.js#L20811) |
| runIntegrityCheck | button button |  | Fechar | [20843](../app.js#L20843) |
| renderData | input file | import-file |  | [20855](../app.js#L20855) |
| renderData | button button |  | dinâmico: icon('i-data') | [20868](../app.js#L20868) |
| renderData | button button |  | Onde meus dados ficam? | [20872](../app.js#L20872) |
| renderData | details  |  | dinâmico: h('summary', {id:'dt-tools',text:'Exportar para planilhas ou IA'}) | [20880](../app.js#L20880) |
| renderData | button button |  | Preparar | [20887](../app.js#L20887) |
| renderData | button button |  | Exportar | [20892](../app.js#L20892) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [20893](../app.js#L20893) |
| renderData | details  |  | dinâmico: h('summary', {text:'Conferir dados e conteúdo do backup'}) | [20895](../app.js#L20895) |
| renderData | button button |  | Verificar | [20910](../app.js#L20910) |
| renderData | button button |  | Pedir ao navegador | [20915](../app.js#L20915) |
| renderData | details  |  | dinâmico: h('summary', {id:'dt-protect',text:'Armazenamento e privacidade'}) | [20916](../app.js#L20916) |
| renderData | button button |  | apagar cópia antiga da V2 | [20960](../app.js#L20960) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [20967](../app.js#L20967) |
| renderData | button button |  | Apagar todos os dados | [20971](../app.js#L20971) |
| restoreRefused | button button |  | Entendi | [21009](../app.js#L21009) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21036](../app.js#L21036) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21037](../app.js#L21037) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21038](../app.js#L21038) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21074](../app.js#L21074) |
| openRestorePreview | button button |  | Cancelar | [21112](../app.js#L21112) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21123](../app.js#L21123) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21126](../app.js#L21126) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21131](../app.js#L21131) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21210](../app.js#L21210) |
| bindEvents | button button |  | Fechar | [21212](../app.js#L21212) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21851](../app.js#L21851) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [21910](../app.js#L21910) |
| GlossaryPopover | button button |  | Fechar explicação | [21913](../app.js#L21913) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [21968](../app.js#L21968) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22189](../app.js#L22189) |
| FocusMode | input checkbox |  |  | [22349](../app.js#L22349) |
| FocusMode | button button |  | dinâmico: a.label | [22410](../app.js#L22410) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22626](../app.js#L22626) |
| pickDisciplineThen | button button |  | Cancelar | [22628](../app.js#L22628) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22709](../app.js#L22709) |
| renderReturnPill | button button |  | Fechar este atalho | [22711](../app.js#L22711) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22733](../app.js#L22733) |
| pickDisciplineForPriority | button button |  | Cancelar | [22736](../app.js#L22736) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22772](../app.js#L22772) |
| helpBreadcrumb | button button |  | dinâmico: label | [22815](../app.js#L22815) |
| articleBody | button button |  | dinâmico: x.label | [22868](../app.js#L22868) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22881](../app.js#L22881) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22895](../app.js#L22895) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22905](../app.js#L22905) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22917](../app.js#L22917) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22932](../app.js#L22932) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22935](../app.js#L22935) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22954](../app.js#L22954) |
| helpSearchCard | button button |  | Limpar busca | [22989](../app.js#L22989) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [22999](../app.js#L22999) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23084](../app.js#L23084) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23098](../app.js#L23098) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23115](../app.js#L23115) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23127](../app.js#L23127) |
| helpHomePanel | details  |  | dinâmico: h('summary', {id:'hmq-t',text:'Perguntas principais'}) | [23168](../app.js#L23168) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23173](../app.js#L23173) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23183](../app.js#L23183) |
| helpHomePanel | details  |  | dinâmico: h('summary', {id:'hg-t',text:'Guia do primeiro uso'}) | [23195](../app.js#L23195) |
| helpHomePanel | button button |  | Rever a apresentação | [23200](../app.js#L23200) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23201](../app.js#L23201) |
| helpHomePanel | button button |  | Ver o guia | [23202](../app.js#L23202) |
| helpHomePanel | details  |  | dinâmico: h('summary', {text:'Dúvidas frequentes'}) | [23206](../app.js#L23206) |
| helpHomePanel | button button |  | Ver todas as perguntas | [23209](../app.js#L23209) |
| helpHomePanel | details  |  | dinâmico: h('summary', {text:'Glossário e suporte'}) | [23212](../app.js#L23212) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23215](../app.js#L23215) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23217](../app.js#L23217) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23219](../app.js#L23219) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23221](../app.js#L23221) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23235](../app.js#L23235) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23258](../app.js#L23258) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23295](../app.js#L23295) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23336](../app.js#L23336) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23378](../app.js#L23378) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23475](../app.js#L23475) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23502](../app.js#L23502) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23505](../app.js#L23505) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23509](../app.js#L23509) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23543](../app.js#L23543) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23583](../app.js#L23583) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23598](../app.js#L23598) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23599](../app.js#L23599) |
| openScreenHelp | button button |  | Entender as sugestões de revisão | [23661](../app.js#L23661) |
| openScreenHelp | details  |  | dinâmico: h('summary', {text:'Passo a passo'}) | [23662](../app.js#L23662) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23666](../app.js#L23666) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23670](../app.js#L23670) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23677](../app.js#L23677) |
| renderTips | details  |  | dinâmico: h('summary', {text:tip.title}) | [23707](../app.js#L23707) |
| renderTips | button button |  | Entendi | [23710](../app.js#L23710) |
| toastRich | button button |  | dinâmico: a.label | [23734](../app.js#L23734) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23901](../app.js#L23901) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23932](../app.js#L23932) |
| maybeShowWhatsNew | button button |  | Continuar | [23935](../app.js#L23935) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23988](../app.js#L23988) |
| stepQuick | input text | ob-name | Ex.: Português | [24003](../app.js#L24003) |
| stepQuick | button button |  | dinâmico: ex | [24007](../app.js#L24007) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24018](../app.js#L24018) |
| stepWhat | button button |  | dinâmico: p.label | [24022](../app.js#L24022) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24028](../app.js#L24028) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24034](../app.js#L24034) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24043](../app.js#L24043) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24051](../app.js#L24051) |
| stepGoal | input date | ob-goal-d |  | [24053](../app.js#L24053) |
| stepGoal | select  | ob-goal-disc |  | [24055](../app.js#L24055) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24070](../app.js#L24070) |
| stepTime | input number | ob-hours | Outro | [24079](../app.js#L24079) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24082](../app.js#L24082) |
| buildActions | button button |  | Voltar | [24138](../app.js#L24138) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24141](../app.js#L24141) |
| buildActions | button button |  | Criar e continuar | [24145](../app.js#L24145) |
| buildActions | button button |  | Continuar | [24147](../app.js#L24147) |
| buildActions | button button |  | Continuar | [24153](../app.js#L24153) |
| buildActions | button button |  | Continuar | [24161](../app.js#L24161) |
| buildActions | button button |  | Criar e começar | [24166](../app.js#L24166) |
| guideNote | button button |  | dinâmico: a.label | [24326](../app.js#L24326) |
| guideNote | button button |  | Agora não | [24328](../app.js#L24328) |
| startGuideCard | button button |  | ocultar | [24362](../app.js#L24362) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24378](../app.js#L24378) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24407](../app.js#L24407) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24436](../app.js#L24436) |
| openFirstReviewIntro | button button |  | Agora não | [24494](../app.js#L24494) |
| openFirstReviewIntro | button button |  | Começar | [24497](../app.js#L24497) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24542](../app.js#L24542) |
| segmented | button button |  | dinâmico: o.label | [24587](../app.js#L24587) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24600](../app.js#L24600) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24611](../app.js#L24611) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24617](../app.js#L24617) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24650](../app.js#L24650) |
| renderSettings | button button |  | Rever a apresentação | [24683](../app.js#L24683) |
| renderSettings | button button |  | Mostrar novamente | [24685](../app.js#L24685) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24699](../app.js#L24699) |
| renderSettings | button button |  | Mostrar todas de novo | [24739](../app.js#L24739) |
| renderSettings | button button |  | Como funcionam as revisões? | [24744](../app.js#L24744) |
| renderSettings | button button |  | Ver | [24764](../app.js#L24764) |
| renderSettings | button button |  | Fazer backup agora | [24776](../app.js#L24776) |
| renderSettings | button button |  | Abrir tela Dados | [24778](../app.js#L24778) |
| renderSettings | button button |  | Onde meus dados ficam? | [24779](../app.js#L24779) |
| renderSettings | button button |  | Preparar | [24781](../app.js#L24781) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24797](../app.js#L24797) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24798](../app.js#L24798) |
| renderSettings | button button |  | Central de Ajuda | [24799](../app.js#L24799) |
| renderSettings | button button |  | Novidades desta versão | [24800](../app.js#L24800) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24818](../app.js#L24818) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24849](../app.js#L24849) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24857](../app.js#L24857) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24923](../app.js#L24923) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24931](../app.js#L24931) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24954](../app.js#L24954) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24959](../app.js#L24959) |
| reviewButton | button button |  | dinâmico: text | [106](../reviews.js#L106) |
| reviewSelect | select  | dinâmico: id | dinâmico: options.map(([v,text])=>h('option',{value:v,text,selected:v===value})) | [109](../reviews.js#L109) |
| openGuidedReviewBuilder | input number |  |  | [126](../reviews.js#L126) |
| draw | input number |  |  | [152](../reviews.js#L152) |
| openGuidedReviewBuilder | button button |  | dinâmico: v+' min' | [170](../reviews.js#L170) |
| openGuidedReviewBuilder | details  |  | dinâmico: h('summary',{text:'Escolher disciplinas da proposta'}) | [172](../reviews.js#L172) |
| openGuidedReviewBuilder | input checkbox |  |  | [172](../reviews.js#L172) |
| openGuidedReviewResult | input number |  |  | [221](../reviews.js#L221) |
| reviewScheduleField | input date |  |  | [315](../reviews.js#L315) |
| studyReviewSchedule | details  |  | dinâmico: h('summary', {text:'Agendar revisão dos tópicos'}) | [373](../reviews.js#L373) |
| reviewAgendaCard | input search | agenda-search | Tópico ou disciplina | [402](../reviews.js#L402) |
| draw | input checkbox |  |  | [443](../reviews.js#L443) |
| draw | input checkbox |  |  | [460](../reviews.js#L460) |
| draw | button button |  | dinâmico: 'Revisar ' + topic.name | [471](../reviews.js#L471) |
| draw | button button |  | dinâmico: 'Agendar ' + topic.name | [472](../reviews.js#L472) |
| openVisualReport | input date |  |  | [391](../reports.js#L391) |
| openVisualReport | input date |  |  | [392](../reports.js#L392) |
| openVisualReport | input search |  |  | [397](../reports.js#L397) |
| openVisualReport | input text |  |  | [411](../reports.js#L411) |
| openVisualReport | input text |  |  | [412](../reports.js#L412) |
| openVisualReport | input color |  |  | [413](../reports.js#L413) |
| openVisualReport | input checkbox |  |  | [427](../reports.js#L427) |
| openVisualReport | input text |  |  | [428](../reports.js#L428) |
| openVisualReport | input checkbox |  |  | [433](../reports.js#L433) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Título e cores'}) | [443](../reports.js#L443) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Blocos e privacidade'}) | [449](../reports.js#L449) |
| openVisualReport | details  |  | dinâmico: h('summary', {text:'Como conferir a imagem'}) | [457](../reports.js#L457) |
| scopeOptions | input checkbox |  |  | [474](../reports.js#L474) |
| drawOrder | button button | dinâmico: 'report-' + id + '-' + direction | dinâmico: labelBtn + ' bloco ' + label | [495](../reports.js#L495) |
| drawOrder | input checkbox |  |  | [500](../reports.js#L500) |
| learningInput | input dinâmico: type | dinâmico: id |  | [203](../learning.js#L203) |
| openCourseEditor | input checkbox |  |  | [212](../learning.js#L212) |
| openCourseEditor | details  |  | dinâmico: h('summary',{text:'Mais detalhes'}) | [222](../learning.js#L222) |
| openContentBlockEditor | textarea  | block-bulk | Um tópico por linha | [235](../learning.js#L235) |
| draw | input checkbox |  |  | [241](../learning.js#L241) |
| draw | input checkbox |  |  | [243](../learning.js#L243) |
| openContentBlockEditor | details  |  | dinâmico: h('summary',{text:'Adicionar tópicos em lote'}) | [272](../learning.js#L272) |
| openContentBlockEditor | details  |  | dinâmico: h('summary',{text:'Materiais relacionados'}) | [273](../learning.js#L273) |
| draw | button button |  | dinâmico: (c.favorite?'Desfavoritar ':'Favoritar ')+c.name | [291](../learning.js#L291) |
| draw | details  |  | dinâmico: h('summary',null,h('strong',{text:b.name}),h('span',{class:'hint',text:disciplineName(b.disciplineId | [315](../learning.js#L315) |
| contentBlocksPanel | input checkbox |  |  | [326](../learning.js#L326) |
| openCourseContents | button button |  | dinâmico: b.name+(b.archived?' · arquivado':'') | [333](../learning.js#L333) |
| quickMaterials | button button |  | dinâmico: 'Estudar com '+c.name | [340](../learning.js#L340) |
| refresh | details  |  | dinâmico: h('summary',{text:'Avaliação do bloco'}) | [392](../learning.js#L392) |
| draw | input checkbox |  | dinâmico: 'Selecionar '+u.name | [456](../learning.js#L456) |
| draw | details  |  | dinâmico: h('summary',{text:plural(u.topicIds.length,'tópico associado','tópicos associados')}) | [460](../learning.js#L460) |
| disciplineMasterList | input search |  | Buscar disciplina nesta lista | [484](../learning.js#L484) |
| draw | button button |  | dinâmico: d.name | [485](../learning.js#L485) |
| civilCalendar | select  | dinâmico: id+'-month' | Mês | [15](../dates.js#L15) |
| civilCalendar | input number | dinâmico: id+'-year' | Ano | [17](../dates.js#L17) |
| civilCalendar | button button | dinâmico: id+'-prev' | Mês anterior | [20](../dates.js#L20) |
| civilCalendar | button button | dinâmico: id+'-next' | Próximo mês | [21](../dates.js#L21) |
| civilCalendar | button button | dinâmico: id+'-'+iso | dinâmico: fmtDateLong(iso)+(edge?', selecionado':'')+(marks.has(iso)?', com conteúdos':'') | [33](../dates.js#L33) |
| openCivilDate | input date | civil-date |  | [56](../dates.js#L56) |
| connectedRangePicker | input date | an-rs |  | [72](../dates.js#L72) |
| connectedRangePicker | input date | an-re |  | [73](../dates.js#L73) |
| bind | button button |  | dinâmico: 'Abrir calendário: '+label | [101](../dates.js#L101) |
| resultsToolbar | details  |  | dinâmico: h('summary',{text:'Filtrar conteúdos'}) | [61](../insights.js#L61) |
| resultsToolbar | details  |  | dinâmico: h('summary',{text:'Selecionar várias disciplinas'}) | [65](../insights.js#L65) |
| resultsToolbar | input checkbox |  |  | [66](../insights.js#L66) |
| resultsToolbar | button button |  | Ver registros | [72](../insights.js#L72) |
| resultsToolbar | button button |  | Criar relatório | [72](../insights.js#L72) |
| resultsTimeline | button button |  | dinâmico: detail+'. Ver registros' | [93](../insights.js#L93) |
| resultsTimeline | details  |  | dinâmico: h('summary',{text:'Ver valores em tabela'}) | [98](../insights.js#L98) |
| draw | button button |  | dinâmico: h('span',{class:'dist-row-label',text:row.label}) | [125](../insights.js#L125) |
| renderConnectedInsights | details  |  | dinâmico: h('summary',{text:'Explorar outros resultados'}) | [141](../insights.js#L141) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6105](../app.js#L6105) |
| confirmModal | openModal | [6880](../app.js#L6880) |
| confirmStudySubview | close.push | [8961](../app.js#L8961) |
| openRegisterModal | openModal | [9866](../app.js#L9866) |
| confirmLong | close.push | [10027](../app.js#L10027) |
| openFinishModal | openModal | [10215](../app.js#L10215) |
| offerStaleSession | openModal | [10440](../app.js#L10440) |
| openAlternatives | Drawer.open | [11605](../app.js#L11605) |
| explainAction | openModal | [11609](../app.js#L11609) |
| openDisciplineReview | openModal | [11911](../app.js#L11911) |
| startReview | openModal | [11976](../app.js#L11976) |
| openReviewOutcomeModal | openModal | [12018](../app.js#L12018) |
| openReviewPrimer | Drawer.open | [12084](../app.js#L12084) |
| openPlansDrawer | Drawer.open | [12728](../app.js#L12728) |
| createSimplePlan | openModal | [12746](../app.js#L12746) |
| openNewPlanModal | openModal | [12846](../app.js#L12846) |
| openWeekGoalModal | openModal | [13079](../app.js#L13079) |
| openSuggestionEditor | openModal | [13282](../app.js#L13282) |
| openSuggestionPicker | openModal | [13326](../app.js#L13326) |
| openWeekBlockPicker | openModal | [13365](../app.js#L13365) |
| weekConflictDialog | close.push | [13597](../app.js#L13597) |
| weekConflictDialog | openModal | [13598](../app.js#L13598) |
| openBlockEditor | openModal | [13710](../app.js#L13710) |
| openMoveDialog | openModal | [13786](../app.js#L13786) |
| openStudyDaysModal | openModal | [13807](../app.js#L13807) |
| openAdjustBlocks | openModal | [13844](../app.js#L13844) |
| openGoalUpdate | openModal | [13892](../app.js#L13892) |
| openTopicDrawer | Drawer.open | [15664](../app.js#L15664) |
| openAreaModal | openModal | [15732](../app.js#L15732) |
| openDisciplineModal | openModal | [15893](../app.js#L15893) |
| openTopicModal | openModal | [16385](../app.js#L16385) |
| openBulkTopicModal | openModal | [16396](../app.js#L16396) |
| openDeadlineDrawer | Drawer.open | [16607](../app.js#L16607) |
| openDeadlineModal | openModal | [16614](../app.js#L16614) |
| saveCurrentAnalysis | openModal | [17494](../app.js#L17494) |
| renameSavedAnalysis | openModal | [17519](../app.js#L17519) |
| openAnalyticsDrawer | Drawer.open | [18997](../app.js#L18997) |
| openDayDrawer | Drawer.open | [19202](../app.js#L19202) |
| openBucketDrawer | Drawer.open | [19297](../app.js#L19297) |
| openDistributionDrawer | Drawer.open | [19383](../app.js#L19383) |
| copySummary | openModal | [19892](../app.js#L19892) |
| openHistoryFilters | Drawer.open | [20177](../app.js#L20177) |
| openEditSessionModal | openModal | [20348](../app.js#L20348) |
| confirmLongEdit | close.push | [20533](../app.js#L20533) |
| openAIReportModal | openModal | [20680](../app.js#L20680) |
| runIntegrityCheck | openModal | [20831](../app.js#L20831) |
| restoreRefused | openModal | [21004](../app.js#L21004) |
| askTimerBeforeRestore | openModal | [21030](../app.js#L21030) |
| openRestorePreview | openModal | [21072](../app.js#L21072) |
| bindEvents | openModal | [21206](../app.js#L21206) |
| openHelpArticle | Drawer.open | [22553](../app.js#L22553) |
| pickDisciplineThen | openModal | [22623](../app.js#L22623) |
| pickDisciplineForPriority | openModal | [22729](../app.js#L22729) |
| openContactDrawer | Drawer.open | [23510](../app.js#L23510) |
| openReportProblemDrawer | Drawer.open | [23602](../app.js#L23602) |
| openScreenHelp | Drawer.open | [23680](../app.js#L23680) |
| maybeShowWhatsNew | openModal | [23924](../app.js#L23924) |
| openWelcome | openModal | [23981](../app.js#L23981) |
| openFirstReviewIntro | openModal | [24485](../app.js#L24485) |
| openChangelog | Drawer.open | [24861](../app.js#L24861) |
| openGuidedReviewBuilder | openModal | [124](../reviews.js#L124) |
| openGuidedReviewPlayer | openModal | [179](../reviews.js#L179) |
| openGuidedReviewResult | openModal | [219](../reviews.js#L219) |
| openReviewSchedule | openModal | [348](../reviews.js#L348) |
| openVisualReport | openModal | [379](../reports.js#L379) |
| openCourseEditor | openModal | [207](../learning.js#L207) |
| openContentBlockEditor | openModal | [228](../learning.js#L228) |
| openCourseContents | Drawer.open | [333](../learning.js#L333) |
| openLearningSchedule | openModal | [409](../learning.js#L409) |
| openCivilDate | openModal | [53](../dates.js#L53) |
| openResultsPeriod | openModal | [40](../insights.js#L40) |

## Controles fixos em index.html

| Controle | ID | Nome / texto | Linha |
|---|---|---|---|
| button | theme-toggle | Alternar tema | [84](../index.html#L84) |
| button |  | Hoje | [90](../index.html#L90) |
| button |  | Estudar | [91](../index.html#L91) |
| button |  | Revisões | [92](../index.html#L92) |
| button |  | Organizar | [93](../index.html#L93) |
| button |  | Resultados | [94](../index.html#L94) |
| button |  | Ajuda | [99](../index.html#L99) |
| button |  | Dados e backup | [100](../index.html#L100) |
| button |  | Configurações | [101](../index.html#L101) |
| button | open-palette-m | Buscar no Ciclo | [113](../index.html#L113) |
| button | screen-help-m | Ajuda desta tela | [116](../index.html#L116) |
| button | mb-more | Ajuda, dados e configurações | [119](../index.html#L119) |
| button | theme-toggle-m | Alternar tema | [122](../index.html#L122) |
| button | open-palette | Buscar no Ciclo: disciplinas, tópicos, prazos, ações e ajuda | [130](../index.html#L130) |
| button | screen-help | Ajuda desta tela | [135](../index.html#L135) |
| button | fab | Registrar estudo | [138](../index.html#L138) |
| button |  | Hoje | [197](../index.html#L197) |
| button |  | Estudar | [198](../index.html#L198) |
| button |  | Revisões | [199](../index.html#L199) |
| button |  | Organizar | [200](../index.html#L200) |
| button |  | Resultados | [201](../index.html#L201) |
| button | drawer-close | Fechar painel | [220](../index.html#L220) |
| input | palette-input | Buscar no Ciclo | [232](../index.html#L232) |
| button | focus-presentation | Apresentação | [253](../index.html#L253) |
| button | focus-fs | Tela cheia | [256](../index.html#L256) |
| button | focus-exit | Sair do modo foco | [259](../index.html#L259) |
| details | focus-display-options | Personalizar painel              Abrir em outra janela | [264](../index.html#L264) |
| button | focus-open-window | Abrir em outra janela | [267](../index.html#L267) |
| details |  | Ajuda do Foco       O relógio acompanha a sessão. Descansar conta o intervalo à parte. Pausar interrompe a contagem.              Em Apresentação, escolha os dados visíveis nas opções de exibição. Sair do Foco mantém a sessão em andamento. | [290](../index.html#L290) |
