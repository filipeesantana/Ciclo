# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fontes: app.js, reviews.js, reports.js. 610 construções de controles, 65 construções de camadas e 768 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](../../audit/MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6079](../../app.js#L6079) |
| askConflict | button button |  | Descartar a minha edição | [6080](../../app.js#L6080) |
| askConflict | button button |  | Manter a minha edição | [6081](../../app.js#L6081) |
| DataSync | button button |  | Atualizar | [6371](../../app.js#L6371) |
| DataSync | button button |  | Continuar editando | [6373](../../app.js#L6373) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6850](../../app.js#L6850) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6851](../../app.js#L6851) |
| selectField | select  | dinâmico: id |  | [7302](../../app.js#L7302) |
| pillGroup | button button |  | dinâmico: it.label | [7315](../../app.js#L7315) |
| setView | button button |  | dinâmico: label | [7364](../../app.js#L7364) |
| renderTimerBar | button button |  | dinâmico: a.label | [7644](../../app.js#L7644) |
| renderTimerBar | button button |  | Foco | [7646](../../app.js#L7646) |
| renderTimerBar | button button |  | descartar | [7647](../../app.js#L7647) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7838](../../app.js#L7838) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7840](../../app.js#L7840) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8033](../../app.js#L8033) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8036](../../app.js#L8036) |
| topicMultiPicker | button button |  | Pronto | [8042](../../app.js#L8042) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8057](../../app.js#L8057) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8347](../../app.js#L8347) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8365](../../app.js#L8365) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8407](../../app.js#L8407) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8408](../../app.js#L8408) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8561](../../app.js#L8561) |
| topicSplitField | button button |  |  | [8625](../../app.js#L8625) |
| topicSplitField | button button |  | Não dividir | [8629](../../app.js#L8629) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8648](../../app.js#L8648) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8836](../../app.js#L8836) |
| commentField | textarea  | dinâmico: o.id |  | [8886](../../app.js#L8886) |
| commentField | button button |  |  | [8889](../../app.js#L8889) |
| commentField | button button |  | Recolher | [8890](../../app.js#L8890) |
| commentField | button button |  | Remover comentário | [8891](../../app.js#L8891) |
| confirmStudySubview | button button |  | Cancelar | [8913](../../app.js#L8913) |
| confirmStudySubview | button button |  | dinâmico: label | [8914](../../app.js#L8914) |
| howGroup | details  |  | dinâmico: h('summary', { text:'Tipo de estudo e dificuldade' }) | [8933](../../app.js#L8933) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8977](../../app.js#L8977) |
| resultsField | button button |  | Recolher | [8982](../../app.js#L8982) |
| resultsField | button button |  | + Adicionar resultado | [8985](../../app.js#L8985) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [9012](../../app.js#L9012) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [9014](../../app.js#L9014) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9028](../../app.js#L9028) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9029](../../app.js#L9029) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9030](../../app.js#L9030) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9069](../../app.js#L9069) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9083](../../app.js#L9083) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9085](../../app.js#L9085) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9188](../../app.js#L9188) |
| breaksEditor | button button |  | dinâmico: addLabel | [9326](../../app.js#L9326) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9348](../../app.js#L9348) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9361](../../app.js#L9361) |
| FormDraft | button button |  | Começar do zero | [9539](../../app.js#L9539) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9561](../../app.js#L9561) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9566](../../app.js#L9566) |
| studyWhenFields | button button |  |  | [9572](../../app.js#L9572) |
| studyWhenFields | button button |  |  | [9574](../../app.js#L9574) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9578](../../app.js#L9578) |
| studyWhenFields | details  |  | dinâmico: h('summary', {text:'Data, horários e descansos'}) | [9724](../../app.js#L9724) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9822](../../app.js#L9822) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9846](../../app.js#L9846) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9858](../../app.js#L9858) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9865](../../app.js#L9865) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9879](../../app.js#L9879) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9891](../../app.js#L9891) |
| confirmLong | button button |  | Corrigir | [9968](../../app.js#L9968) |
| confirmLong | button button |  | Sim, registrar | [9983](../../app.js#L9983) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9990](../../app.js#L9990) |
| openRegisterModal | button button |  | Cancelar | [10090](../../app.js#L10090) |
| openFinishModal | input number | fin-min |  | [10153](../../app.js#L10153) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10198](../../app.js#L10198) |
| renderOutcome | select  | fin-method |  | [10234](../../app.js#L10234) |
| openFinishModal | button button |  | Registrar estudo | [10276](../../app.js#L10276) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10354](../../app.js#L10354) |
| offerStaleSession | button button |  | Continuar | [10381](../../app.js#L10381) |
| offerStaleSession | button button |  | Descartar | [10382](../../app.js#L10382) |
| offerStaleSession | button button |  | Finalizar | [10383](../../app.js#L10383) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11234](../../app.js#L11234) |
| renderToday | button button |  | Quero ajuda para organizar | [11235](../../app.js#L11235) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Atalhos e organização'}) | [11250](../../app.js#L11250) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Frase do dia'}) | [11254](../../app.js#L11254) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11284](../../app.js#L11284) |
| todayAction | button button |  | dinâmico: icon('i-focus') | [11305](../../app.js#L11305) |
| todayAction | button button |  | Retomar revisão guiada | [11306](../../app.js#L11306) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11307](../../app.js#L11307) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11308](../../app.js#L11308) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11325](../../app.js#L11325) |
| todayAction | button button |  | Por quê? | [11327](../../app.js#L11327) |
| todayAction | button button |  | Outras opções | [11328](../../app.js#L11328) |
| todayAction | details  |  | dinâmico: h('summary', {text:'Sugestão de estudo'}) | [11332](../../app.js#L11332) |
| todaySummary | button button |  | Criar relatório | [11349](../../app.js#L11349) |
| todaySummary | button button |  | Ver detalhes do dia | [11350](../../app.js#L11350) |
| todaySummary | button button |  | Ver registros de hoje | [11351](../../app.js#L11351) |
| todayWeekPanel | button button |  | Ver nas Análises | [11400](../../app.js#L11400) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11401](../../app.js#L11401) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11408](../../app.js#L11408) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11411](../../app.js#L11411) |
| todayNextSteps | button button |  | Revisar | [11428](../../app.js#L11428) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11429](../../app.js#L11429) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11456](../../app.js#L11456) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11487](../../app.js#L11487) |
| nextRow | button button |  | dinâmico: main | [11524](../../app.js#L11524) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11536](../../app.js#L11536) |
| explainAction | button button |  | Fechar | [11550](../../app.js#L11550) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11586](../../app.js#L11586) |
| renderReviews | button button |  | Montar revisão guiada | [11587](../../app.js#L11587) |
| renderReviews | button button |  | Como funcionam as revisões? | [11589](../../app.js#L11589) |
| renderReviews | button button |  | Adicionar um tópico | [11590](../../app.js#L11590) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11603](../../app.js#L11603) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11604](../../app.js#L11604) |
| renderReviews | button button |  | Como funciona? | [11605](../../app.js#L11605) |
| renderReviews | button button |  | Religar sugestões | [11606](../../app.js#L11606) |
| renderReviews | details  |  | dinâmico: h('summary', {text:'Sugestões e adiamentos'}) | [11623](../../app.js#L11623) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11648](../../app.js#L11648) |
| drawReviewGroups | button button |  | Limpar busca | [11685](../../app.js#L11685) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11696](../../app.js#L11696) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11712](../../app.js#L11712) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11715](../../app.js#L11715) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11717](../../app.js#L11717) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11722](../../app.js#L11722) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11727](../../app.js#L11727) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11730](../../app.js#L11730) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11731](../../app.js#L11731) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11748](../../app.js#L11748) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11752](../../app.js#L11752) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11767](../../app.js#L11767) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11770](../../app.js#L11770) |
| reviewGroupCard | button button |  | Escolher assuntos | [11771](../../app.js#L11771) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11790](../../app.js#L11790) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11794](../../app.js#L11794) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11849](../../app.js#L11849) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11861](../../app.js#L11861) |
| openDisciplineReview | button button |  | Cancelar | [11883](../../app.js#L11883) |
| openDisciplineReview | button button |  | Já revisei | [11884](../../app.js#L11884) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11890](../../app.js#L11890) |
| startReview | button button |  | Cancelar | [11937](../../app.js#L11937) |
| startReview | button button |  | Registrar sem cronômetro | [11938](../../app.js#L11938) |
| startReview | button button |  | Começar revisão | [11940](../../app.js#L11940) |
| openReviewOutcomeModal | input number | ro-min |  | [11953](../../app.js#L11953) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11961](../../app.js#L11961) |
| openReviewOutcomeModal | button button |  | Cancelar | [11963](../../app.js#L11963) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11964](../../app.js#L11964) |
| openReviewPrimer | button button |  | O que é revisão? | [12015](../../app.js#L12015) |
| openReviewPrimer | button button |  | Por que não basta reler? | [12016](../../app.js#L12016) |
| renderPlan | button button |  | Ir para Disciplinas | [12520](../../app.js#L12520) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12533](../../app.js#L12533) |
| renderPlan | button button |  | Outro valor | [12534](../../app.js#L12534) |
| renderPlan | button button |  | Para que serve o planejamento? | [12538](../../app.js#L12538) |
| renderPlan | input number | plan-avail-h |  | [12548](../../app.js#L12548) |
| renderPlan | input text | plan-name |  | [12556](../../app.js#L12556) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12562](../../app.js#L12562) |
| renderPlan | button button |  | Sugerir automaticamente | [12570](../../app.js#L12570) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12612](../../app.js#L12612) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12616](../../app.js#L12616) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12619](../../app.js#L12619) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12635](../../app.js#L12635) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12636](../../app.js#L12636) |
| openPlansDrawer | button button |  | Ativar | [12658](../../app.js#L12658) |
| openPlansDrawer | button button |  | excluir | [12659](../../app.js#L12659) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12661](../../app.js#L12661) |
| createSimplePlan | button button |  | Personalizar distribuição | [12694](../../app.js#L12694) |
| createSimplePlan | button button |  | Usar esta sugestão | [12699](../../app.js#L12699) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12781](../../app.js#L12781) |
| openNewPlanModal | input number | np-hours |  | [12782](../../app.js#L12782) |
| openNewPlanModal | button button |  | Cancelar | [12791](../../app.js#L12791) |
| openNewPlanModal | button button |  | Criar | [12792](../../app.js#L12792) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12889](../../app.js#L12889) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12896](../../app.js#L12896) |
| planWeekHead | button button |  | Alterar meta | [12955](../../app.js#L12955) |
| planWeekHead | button button |  | Personalizar distribuição | [12956](../../app.js#L12956) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12957](../../app.js#L12957) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12982](../../app.js#L12982) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [13001](../../app.js#L13001) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [13015](../../app.js#L13015) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13019](../../app.js#L13019) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13022](../../app.js#L13022) |
| openWeekGoalModal | button button |  | Cancelar | [13041](../../app.js#L13041) |
| openWeekGoalModal | button button |  | Salvar meta | [13042](../../app.js#L13042) |
| planWeekNav | button button |  | Semana anterior | [13078](../../app.js#L13078) |
| planWeekNav | button button |  | Próxima semana | [13080](../../app.js#L13080) |
| planWeekNav | button button |  | Ir para esta semana | [13083](../../app.js#L13083) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13084](../../app.js#L13084) |
| planWeekNotices | button button |  | Ajustar os blocos | [13128](../../app.js#L13128) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13129](../../app.js#L13129) |
| planWeekNotices | button button |  | Manter assim | [13131](../../app.js#L13131) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13170](../../app.js#L13170) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13172](../../app.js#L13172) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13190](../../app.js#L13190) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13217](../../app.js#L13217) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13221](../../app.js#L13221) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13243](../../app.js#L13243) |
| openSuggestionEditor | button button |  | Só nesta semana | [13244](../../app.js#L13244) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13245](../../app.js#L13245) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13260](../../app.js#L13260) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13266](../../app.js#L13266) |
| openSuggestionPicker | button button |  | Cancelar | [13286](../../app.js#L13286) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13299](../../app.js#L13299) |
| openWeekBlockPicker | input radio |  |  | [13310](../../app.js#L13310) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13322](../../app.js#L13322) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13328](../../app.js#L13328) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13337](../../app.js#L13337) |
| openWeekBlockPicker | button button |  | Cancelar | [13342](../../app.js#L13342) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13343](../../app.js#L13343) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13441](../../app.js#L13441) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13472](../../app.js#L13472) |
| planOffDays | button button |  | Personalizar dias | [13512](../../app.js#L13512) |
| weekConflictDialog | button button |  | Ver a versão atual | [13526](../../app.js#L13526) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13527](../../app.js#L13527) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13644](../../app.js#L13644) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13647](../../app.js#L13647) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13651](../../app.js#L13651) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13661](../../app.js#L13661) |
| openBlockEditor | button button |  | Salvar | [13683](../../app.js#L13683) |
| openBlockEditor | button button |  | Tirar deste dia | [13706](../../app.js#L13706) |
| openBlockEditor | button button |  | Cancelar | [13707](../../app.js#L13707) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13722](../../app.js#L13722) |
| openMoveDialog | button button |  | Cancelar | [13731](../../app.js#L13731) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13742](../../app.js#L13742) |
| openStudyDaysModal | button button |  | Cancelar | [13756](../../app.js#L13756) |
| openStudyDaysModal | button button |  | Salvar | [13757](../../app.js#L13757) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13788](../../app.js#L13788) |
| openAdjustBlocks | button button |  | Cancelar | [13803](../../app.js#L13803) |
| openAdjustBlocks | button button |  | Salvar | [13804](../../app.js#L13804) |
| openGoalUpdate | button button |  | Cancelar | [13837](../../app.js#L13837) |
| openGoalUpdate | button button |  | Só nesta semana | [13838](../../app.js#L13838) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13839](../../app.js#L13839) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14098](../../app.js#L14098) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14159](../../app.js#L14159) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14468](../../app.js#L14468) |
| contextSearch | button button |  | Limpar busca | [14470](../../app.js#L14470) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14498](../../app.js#L14498) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14508](../../app.js#L14508) |
| collectionView | button button |  | Limpar busca | [14599](../../app.js#L14599) |
| collectionView | button button |  | Mostrar todos | [14600](../../app.js#L14600) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15088](../../app.js#L15088) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15131](../../app.js#L15131) |
| levelHead | button button |  | dinâmico: c.label | [15152](../../app.js#L15152) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15153](../../app.js#L15153) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15224](../../app.js#L15224) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15225](../../app.js#L15225) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15231](../../app.js#L15231) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15236](../../app.js#L15236) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15312](../../app.js#L15312) |
| discAreaLevel | button button |  | Organizar em uma área | [15323](../../app.js#L15323) |
| discAreaLevel | button button |  | Reativar | [15331](../../app.js#L15331) |
| discAreaLevel | button button |  | Adicionar disciplina | [15350](../../app.js#L15350) |
| discAreaLevel | button button |  | Agora não | [15351](../../app.js#L15351) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15361](../../app.js#L15361) |
| discDisciplineLevel | button button |  | Reativar | [15390](../../app.js#L15390) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15391](../../app.js#L15391) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15392](../../app.js#L15392) |
| discDisciplineLevel | button button |  | Editar | [15393](../../app.js#L15393) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15402](../../app.js#L15402) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15438](../../app.js#L15438) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15440](../../app.js#L15440) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15444](../../app.js#L15444) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15475](../../app.js#L15475) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15477](../../app.js#L15477) |
| topicDetailContent | button button |  | Reativar tópico | [15525](../../app.js#L15525) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15528](../../app.js#L15528) |
| topicDetailContent | button button |  | Revisar agora | [15529](../../app.js#L15529) |
| topicDetailContent | button button |  | Agendar revisão | [15530](../../app.js#L15530) |
| topicDetailContent | button button |  | Editar | [15531](../../app.js#L15531) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15532](../../app.js#L15532) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15546](../../app.js#L15546) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15559](../../app.js#L15559) |
| areaNudgeCard | button button |  | Organizar | [15628](../../app.js#L15628) |
| areaNudgeCard | button button |  | Agora não | [15629](../../app.js#L15629) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15662](../../app.js#L15662) |
| openAreaModal | input checkbox |  |  | [15670](../../app.js#L15670) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15685](../../app.js#L15685) |
| openAreaModal | button button |  | Cancelar | [15733](../../app.js#L15733) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15823](../../app.js#L15823) |
| openDisciplineModal | select  | dm-area |  | [15828](../../app.js#L15828) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15833](../../app.js#L15833) |
| openDisciplineModal | select  | dm-nature |  | [15855](../../app.js#L15855) |
| openDisciplineModal | select  | dm-strategy |  | [15859](../../app.js#L15859) |
| openDisciplineModal | select  | dm-method |  | [15865](../../app.js#L15865) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15871](../../app.js#L15871) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15893](../../app.js#L15893) |
| openDisciplineModal | button button |  | Cancelar | [15950](../../app.js#L15950) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15952](../../app.js#L15952) |
| openDisciplineModal | button button |  | excluir definitivamente | [15954](../../app.js#L15954) |
| topicReviewOptions | select  | tm-strategy |  | [16072](../../app.js#L16072) |
| topicReviewOptions | select  | tm-method |  | [16077](../../app.js#L16077) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16082](../../app.js#L16082) |
| reviewToggle | input checkbox | tm-review |  | [16093](../../app.js#L16093) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16138](../../app.js#L16138) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16182](../../app.js#L16182) |
| showTwin | button button |  | Usar este tópico | [16199](../../app.js#L16199) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16204](../../app.js#L16204) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16205](../../app.js#L16205) |
| topicEditor | button button |  | dinâmico: saveLabel | [16286](../../app.js#L16286) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16288](../../app.js#L16288) |
| topicEditor | button button |  | Arquivar | [16292](../../app.js#L16292) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16325](../../app.js#L16325) |
| openBulkTopicModal | button button |  | Cancelar | [16338](../../app.js#L16338) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16339](../../app.js#L16339) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16379](../../app.js#L16379) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16384](../../app.js#L16384) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16385](../../app.js#L16385) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16388](../../app.js#L16388) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16390](../../app.js#L16390) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16426](../../app.js#L16426) |
| openDeadlineDrawer | button button |  | Reabrir | [16522](../../app.js#L16522) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16523](../../app.js#L16523) |
| openDeadlineDrawer | button button |  | Editar | [16524](../../app.js#L16524) |
| openDeadlineDrawer | button button |  | Ver tópico | [16525](../../app.js#L16525) |
| openDeadlineDrawer | button button |  | excluir | [16526](../../app.js#L16526) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16541](../../app.js#L16541) |
| openDeadlineModal | input date | dl-date |  | [16542](../../app.js#L16542) |
| openDeadlineModal | input date | dl-start |  | [16544](../../app.js#L16544) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16550](../../app.js#L16550) |
| openDeadlineModal | select  | dl-disc |  | [16562](../../app.js#L16562) |
| openDeadlineModal | select  | dl-topic |  | [16570](../../app.js#L16570) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16588](../../app.js#L16588) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16590](../../app.js#L16590) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16608](../../app.js#L16608) |
| openDeadlineModal | button button |  | Cancelar | [16620](../../app.js#L16620) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16621](../../app.js#L16621) |
| openDeadlineModal | button button |  | excluir | [16659](../../app.js#L16659) |
| renderAnalytics | button button |  | dinâmico: icon('i-download') | [17024](../../app.js#L17024) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17095](../../app.js#L17095) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17104](../../app.js#L17104) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17120](../../app.js#L17120) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17154](../../app.js#L17154) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17174](../../app.js#L17174) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17203](../../app.js#L17203) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17231](../../app.js#L17231) |
| analyticsCustomBuilder | button button |  | Cancelar | [17248](../../app.js#L17248) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17249](../../app.js#L17249) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17257](../../app.js#L17257) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17261](../../app.js#L17261) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17346](../../app.js#L17346) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17354](../../app.js#L17354) |
| scopePicker | button button |  | limpar | [17356](../../app.js#L17356) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17389](../../app.js#L17389) |
| saveCurrentAnalysis | input text | sa-name |  | [17413](../../app.js#L17413) |
| saveCurrentAnalysis | button button |  | Cancelar | [17428](../../app.js#L17428) |
| saveCurrentAnalysis | button button |  | Salvar | [17429](../../app.js#L17429) |
| renameSavedAnalysis | input text | sa-rename |  | [17438](../../app.js#L17438) |
| renameSavedAnalysis | button button |  | Cancelar | [17448](../../app.js#L17448) |
| renameSavedAnalysis | button button |  | Salvar | [17448](../../app.js#L17448) |
| rangePicker | button button |  | Mês anterior | [17485](../../app.js#L17485) |
| rangePicker | button button |  | Próximo mês | [17487](../../app.js#L17487) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17505](../../app.js#L17505) |
| rangePicker | input date | an-rs |  | [17528](../../app.js#L17528) |
| rangePicker | input date | an-re |  | [17529](../../app.js#L17529) |
| rangePicker | button button |  | limpar datas | [17547](../../app.js#L17547) |
| analyticsReadingGuide | details  |  | dinâmico: h('summary', {text:'Como ler estes números'}) | [17555](../../app.js#L17555) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17677](../../app.js#L17677) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17720](../../app.js#L17720) |
| analyticsPanorama | button button |  | Personalizar análise | [17729](../../app.js#L17729) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17736](../../app.js#L17736) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17761](../../app.js#L17761) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17782](../../app.js#L17782) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17784](../../app.js#L17784) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17790](../../app.js#L17790) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Personalizado…' | [17793](../../app.js#L17793) |
| analyticsResultHeader | button button |  | limpar | [17804](../../app.js#L17804) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-download') | [17807](../../app.js#L17807) |
| analyticsResultHeader | button button |  | Ver registros | [17808](../../app.js#L17808) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17809](../../app.js#L17809) |
| analyticsResultHeader | button button |  | Alterar análise | [17810](../../app.js#L17810) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17829](../../app.js#L17829) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17846](../../app.js#L17846) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17859](../../app.js#L17859) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17863](../../app.js#L17863) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17878](../../app.js#L17878) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17879](../../app.js#L17879) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17923](../../app.js#L17923) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17979](../../app.js#L17979) |
| milestonesViz | button button |  | ver o estudo | [17998](../../app.js#L17998) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18295](../../app.js#L18295) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18503](../../app.js#L18503) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18569](../../app.js#L18569) |
| dueReviewsViz | button button |  | Revisar | [18573](../../app.js#L18573) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18629](../../app.js#L18629) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18699](../../app.js#L18699) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18786](../../app.js#L18786) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18836](../../app.js#L18836) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18855](../../app.js#L18855) |
| menuButton | button button |  | dinâmico: it.label | [18865](../../app.js#L18865) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18891](../../app.js#L18891) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18897](../../app.js#L18897) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18906](../../app.js#L18906) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18929](../../app.js#L18929) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [19020](../../app.js#L19020) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [19029](../../app.js#L19029) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19054](../../app.js#L19054) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19057](../../app.js#L19057) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19106](../../app.js#L19106) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19127](../../app.js#L19127) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19150](../../app.js#L19150) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19176](../../app.js#L19176) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19177](../../app.js#L19177) |
| analyticsCalendarCard | button button |  | Analisar este período | [19189](../../app.js#L19189) |
| analyticsCalendarCard | button button |  | Cancelar | [19193](../../app.js#L19193) |
| calendarHeatmap | button button |  | Mês anterior | [19209](../../app.js#L19209) |
| calendarHeatmap | button button |  | Próximo mês | [19211](../../app.js#L19211) |
| calendarHeatmap | button button |  | mês atual | [19212](../../app.js#L19212) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19257](../../app.js#L19257) |
| openDayDrawer | button button |  | Editar este estudo | [19354](../../app.js#L19354) |
| openDayDrawer | button button |  | Analisar este dia | [19366](../../app.js#L19366) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19371](../../app.js#L19371) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19414](../../app.js#L19414) |
| openBucketDrawer | button button |  | Analisar este período | [19464](../../app.js#L19464) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19486](../../app.js#L19486) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19551](../../app.js#L19551) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19552](../../app.js#L19552) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19587](../../app.js#L19587) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19634](../../app.js#L19634) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19639](../../app.js#L19639) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19691](../../app.js#L19691) |
| weeklyReportCard | button button |  | Semana anterior | [19757](../../app.js#L19757) |
| weeklyReportCard | button button |  | Próxima semana | [19759](../../app.js#L19759) |
| copySummary | textarea  |  | Resumo do período | [20066](../../app.js#L20066) |
| copySummary | button button |  | Fechar | [20067](../../app.js#L20067) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20241](../../app.js#L20241) |
| historyDiscoveries | button button |  | Ver registros usados | [20242](../../app.js#L20242) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20245](../../app.js#L20245) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20261](../../app.js#L20261) |
| renderHistory | button button |  | Registrar estudo | [20262](../../app.js#L20262) |
| renderHistory | button button |  | Filtros | [20273](../../app.js#L20273) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20280](../../app.js#L20280) |
| renderHistory | button button |  | limpar tudo | [20282](../../app.js#L20282) |
| openHistoryFilters | button button |  | Aplicar filtros | [20344](../../app.js#L20344) |
| openHistoryFilters | button button |  | Limpar | [20347](../../app.js#L20347) |
| renderHistoryTable | button button |  | Limpar busca | [20417](../../app.js#L20417) |
| renderHistoryTable | button button |  | dinâmico: label | [20447](../../app.js#L20447) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20459](../../app.js#L20459) |
| openEditSessionModal | button button |  | remover estudo | [20631](../../app.js#L20631) |
| openEditSessionModal | button button |  | Cancelar | [20637](../../app.js#L20637) |
| openEditSessionModal | button button |  | Salvar | [20638](../../app.js#L20638) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20706](../../app.js#L20706) |
| confirmLongEdit | button button |  | Está certo, salvar | [20707](../../app.js#L20707) |
| openAIReportModal | textarea  |  | Texto do prompt | [20852](../../app.js#L20852) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20853](../../app.js#L20853) |
| openAIReportModal | button button |  | dinâmico: x.label | [20878](../../app.js#L20878) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20892](../../app.js#L20892) |
| openAIReportModal | input checkbox | air-comments |  | [20900](../../app.js#L20900) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20955](../../app.js#L20955) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20963](../../app.js#L20963) |
| openAIReportModal | button button |  | Só baixar o CSV | [20969](../../app.js#L20969) |
| openAIReportModal | button button |  | Só copiar o prompt | [20970](../../app.js#L20970) |
| openAIReportModal | button button |  | Fechar | [20980](../../app.js#L20980) |
| runIntegrityCheck | button button |  | Fechar | [21012](../../app.js#L21012) |
| renderData | input file | import-file |  | [21024](../../app.js#L21024) |
| renderData | button button |  | dinâmico: icon('i-data') | [21037](../../app.js#L21037) |
| renderData | button button |  | Onde meus dados ficam? | [21041](../../app.js#L21041) |
| renderData | button button |  | Preparar | [21056](../../app.js#L21056) |
| renderData | button button |  | Exportar | [21061](../../app.js#L21061) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21062](../../app.js#L21062) |
| renderData | button button |  | Verificar | [21079](../../app.js#L21079) |
| renderData | button button |  | Pedir ao navegador | [21084](../../app.js#L21084) |
| renderData | button button |  | apagar cópia antiga da V2 | [21129](../../app.js#L21129) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21136](../../app.js#L21136) |
| renderData | button button |  | Apagar todos os dados | [21140](../../app.js#L21140) |
| restoreRefused | button button |  | Entendi | [21177](../../app.js#L21177) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21204](../../app.js#L21204) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21205](../../app.js#L21205) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21206](../../app.js#L21206) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21242](../../app.js#L21242) |
| openRestorePreview | button button |  | Cancelar | [21280](../../app.js#L21280) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21291](../../app.js#L21291) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21294](../../app.js#L21294) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21299](../../app.js#L21299) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21378](../../app.js#L21378) |
| bindEvents | button button |  | Fechar | [21380](../../app.js#L21380) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [22017](../../app.js#L22017) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22076](../../app.js#L22076) |
| GlossaryPopover | button button |  | Fechar explicação | [22079](../../app.js#L22079) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22134](../../app.js#L22134) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22355](../../app.js#L22355) |
| FocusMode | input checkbox |  |  | [22514](../../app.js#L22514) |
| FocusMode | button button |  | dinâmico: a.label | [22566](../../app.js#L22566) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22782](../../app.js#L22782) |
| pickDisciplineThen | button button |  | Cancelar | [22784](../../app.js#L22784) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22863](../../app.js#L22863) |
| renderReturnPill | button button |  | Fechar este atalho | [22865](../../app.js#L22865) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22887](../../app.js#L22887) |
| pickDisciplineForPriority | button button |  | Cancelar | [22890](../../app.js#L22890) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22926](../../app.js#L22926) |
| helpBreadcrumb | button button |  | dinâmico: label | [22969](../../app.js#L22969) |
| articleBody | button button |  | dinâmico: x.label | [23022](../../app.js#L23022) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [23035](../../app.js#L23035) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [23049](../../app.js#L23049) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [23059](../../app.js#L23059) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [23071](../../app.js#L23071) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [23086](../../app.js#L23086) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [23089](../../app.js#L23089) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [23108](../../app.js#L23108) |
| helpSearchCard | button button |  | Limpar busca | [23143](../../app.js#L23143) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23153](../../app.js#L23153) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23238](../../app.js#L23238) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23252](../../app.js#L23252) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23269](../../app.js#L23269) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23281](../../app.js#L23281) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23327](../../app.js#L23327) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23337](../../app.js#L23337) |
| helpHomePanel | button button |  | Rever a apresentação | [23353](../../app.js#L23353) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23354](../../app.js#L23354) |
| helpHomePanel | button button |  | Ver o guia | [23355](../../app.js#L23355) |
| helpHomePanel | button button |  | Ver todas | [23362](../../app.js#L23362) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23369](../../app.js#L23369) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23371](../../app.js#L23371) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23373](../../app.js#L23373) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23375](../../app.js#L23375) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23389](../../app.js#L23389) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23412](../../app.js#L23412) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23449](../../app.js#L23449) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23490](../../app.js#L23490) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23532](../../app.js#L23532) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23629](../../app.js#L23629) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23656](../../app.js#L23656) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23659](../../app.js#L23659) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23663](../../app.js#L23663) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23697](../../app.js#L23697) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23737](../../app.js#L23737) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23752](../../app.js#L23752) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23753](../../app.js#L23753) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23776](../../app.js#L23776) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23780](../../app.js#L23780) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23787](../../app.js#L23787) |
| renderTips | button button |  | Entendi | [23819](../../app.js#L23819) |
| toastRich | button button |  | dinâmico: a.label | [23843](../../app.js#L23843) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [24010](../../app.js#L24010) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [24041](../../app.js#L24041) |
| maybeShowWhatsNew | button button |  | Continuar | [24044](../../app.js#L24044) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [24097](../../app.js#L24097) |
| stepQuick | input text | ob-name | Ex.: Português | [24112](../../app.js#L24112) |
| stepQuick | button button |  | dinâmico: ex | [24116](../../app.js#L24116) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24127](../../app.js#L24127) |
| stepWhat | button button |  | dinâmico: p.label | [24131](../../app.js#L24131) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24137](../../app.js#L24137) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24143](../../app.js#L24143) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24152](../../app.js#L24152) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24160](../../app.js#L24160) |
| stepGoal | input date | ob-goal-d |  | [24162](../../app.js#L24162) |
| stepGoal | select  | ob-goal-disc |  | [24164](../../app.js#L24164) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24179](../../app.js#L24179) |
| stepTime | input number | ob-hours | Outro | [24188](../../app.js#L24188) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24191](../../app.js#L24191) |
| buildActions | button button |  | Voltar | [24247](../../app.js#L24247) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24250](../../app.js#L24250) |
| buildActions | button button |  | Criar e continuar | [24254](../../app.js#L24254) |
| buildActions | button button |  | Continuar | [24256](../../app.js#L24256) |
| buildActions | button button |  | Continuar | [24262](../../app.js#L24262) |
| buildActions | button button |  | Continuar | [24270](../../app.js#L24270) |
| buildActions | button button |  | Criar e começar | [24275](../../app.js#L24275) |
| guideNote | button button |  | dinâmico: a.label | [24435](../../app.js#L24435) |
| guideNote | button button |  | Agora não | [24437](../../app.js#L24437) |
| startGuideCard | button button |  | ocultar | [24471](../../app.js#L24471) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24487](../../app.js#L24487) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24516](../../app.js#L24516) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24545](../../app.js#L24545) |
| openFirstReviewIntro | button button |  | Agora não | [24603](../../app.js#L24603) |
| openFirstReviewIntro | button button |  | Começar | [24606](../../app.js#L24606) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24651](../../app.js#L24651) |
| segmented | button button |  | dinâmico: o.label | [24696](../../app.js#L24696) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24709](../../app.js#L24709) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24720](../../app.js#L24720) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24726](../../app.js#L24726) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24759](../../app.js#L24759) |
| renderSettings | button button |  | Rever a apresentação | [24792](../../app.js#L24792) |
| renderSettings | button button |  | Mostrar novamente | [24794](../../app.js#L24794) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24808](../../app.js#L24808) |
| renderSettings | button button |  | Mostrar todas de novo | [24848](../../app.js#L24848) |
| renderSettings | button button |  | Como funcionam as revisões? | [24853](../../app.js#L24853) |
| renderSettings | button button |  | Ver | [24873](../../app.js#L24873) |
| renderSettings | button button |  | Fazer backup agora | [24885](../../app.js#L24885) |
| renderSettings | button button |  | Abrir tela Dados | [24887](../../app.js#L24887) |
| renderSettings | button button |  | Onde meus dados ficam? | [24888](../../app.js#L24888) |
| renderSettings | button button |  | Preparar | [24890](../../app.js#L24890) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24906](../../app.js#L24906) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24907](../../app.js#L24907) |
| renderSettings | button button |  | Central de Ajuda | [24908](../../app.js#L24908) |
| renderSettings | button button |  | Novidades desta versão | [24909](../../app.js#L24909) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24927](../../app.js#L24927) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24958](../../app.js#L24958) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24966](../../app.js#L24966) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [25032](../../app.js#L25032) |
| renderDeadlineSuggestions | button button |  | Manter atual | [25040](../../app.js#L25040) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [25063](../../app.js#L25063) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [25068](../../app.js#L25068) |
| reviewButton | button button |  | dinâmico: text | [95](../../reviews.js#L95) |
| reviewSelect | select  | dinâmico: id | dinâmico: options.map(([v,text])=>h('option',{value:v,text,selected:v===value})) | [98](../../reviews.js#L98) |
| openGuidedReviewBuilder | input number |  |  | [115](../../reviews.js#L115) |
| draw | input number |  |  | [140](../../reviews.js#L140) |
| openGuidedReviewBuilder | button button |  | dinâmico: v+' min' | [158](../../reviews.js#L158) |
| openGuidedReviewBuilder | details  |  | dinâmico: h('summary',{text:'Escolher disciplinas da proposta'}) | [160](../../reviews.js#L160) |
| openGuidedReviewBuilder | input checkbox |  |  | [160](../../reviews.js#L160) |
| openGuidedReviewResult | input number |  |  | [208](../../reviews.js#L208) |
| reviewScheduleField | input date |  |  | [301](../../reviews.js#L301) |
| studyReviewSchedule | details  |  | dinâmico: h('summary', {text:'Agendar revisão dos tópicos'}) | [359](../../reviews.js#L359) |
| reviewAgendaCard | input search | agenda-search | Tópico ou disciplina | [388](../../reviews.js#L388) |
| draw | input checkbox |  |  | [427](../../reviews.js#L427) |
| draw | input checkbox |  |  | [444](../../reviews.js#L444) |
| draw | button button |  | dinâmico: 'Revisar ' + topic.name | [454](../../reviews.js#L454) |
| draw | button button |  | dinâmico: 'Agendar ' + topic.name | [455](../../reviews.js#L455) |
| openVisualReport | input date |  |  | [327](../../reports.js#L327) |
| openVisualReport | input date |  |  | [328](../../reports.js#L328) |
| openVisualReport | input search |  |  | [333](../../reports.js#L333) |
| openVisualReport | input text |  |  | [344](../../reports.js#L344) |
| openVisualReport | input text |  |  | [345](../../reports.js#L345) |
| openVisualReport | input color |  |  | [346](../../reports.js#L346) |
| openVisualReport | input checkbox |  |  | [360](../../reports.js#L360) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Título e cores'}) | [366](../../reports.js#L366) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Blocos e privacidade'}) | [372](../../reports.js#L372) |
| scopeOptions | input checkbox |  |  | [395](../../reports.js#L395) |
| drawOrder | button button | dinâmico: 'report-' + id + '-' + direction | dinâmico: labelBtn + ' bloco ' + label | [416](../../reports.js#L416) |
| drawOrder | input checkbox |  |  | [421](../../reports.js#L421) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6073](../../app.js#L6073) |
| confirmModal | openModal | [6846](../../app.js#L6846) |
| confirmStudySubview | close.push | [8912](../../app.js#L8912) |
| openRegisterModal | openModal | [9817](../../app.js#L9817) |
| confirmLong | close.push | [9976](../../app.js#L9976) |
| openFinishModal | openModal | [10151](../../app.js#L10151) |
| offerStaleSession | openModal | [10374](../../app.js#L10374) |
| openAlternatives | Drawer.open | [11538](../../app.js#L11538) |
| explainAction | openModal | [11542](../../app.js#L11542) |
| openDisciplineReview | openModal | [11845](../../app.js#L11845) |
| startReview | openModal | [11910](../../app.js#L11910) |
| openReviewOutcomeModal | openModal | [11952](../../app.js#L11952) |
| openReviewPrimer | Drawer.open | [12018](../../app.js#L12018) |
| openPlansDrawer | Drawer.open | [12662](../../app.js#L12662) |
| createSimplePlan | openModal | [12680](../../app.js#L12680) |
| openNewPlanModal | openModal | [12780](../../app.js#L12780) |
| openWeekGoalModal | openModal | [13013](../../app.js#L13013) |
| openSuggestionEditor | openModal | [13215](../../app.js#L13215) |
| openSuggestionPicker | openModal | [13259](../../app.js#L13259) |
| openWeekBlockPicker | openModal | [13298](../../app.js#L13298) |
| weekConflictDialog | close.push | [13530](../../app.js#L13530) |
| weekConflictDialog | openModal | [13531](../../app.js#L13531) |
| openBlockEditor | openModal | [13643](../../app.js#L13643) |
| openMoveDialog | openModal | [13719](../../app.js#L13719) |
| openStudyDaysModal | openModal | [13740](../../app.js#L13740) |
| openAdjustBlocks | openModal | [13777](../../app.js#L13777) |
| openGoalUpdate | openModal | [13825](../../app.js#L13825) |
| openTopicDrawer | Drawer.open | [15593](../../app.js#L15593) |
| openAreaModal | openModal | [15661](../../app.js#L15661) |
| openDisciplineModal | openModal | [15822](../../app.js#L15822) |
| openTopicModal | openModal | [16313](../../app.js#L16313) |
| openBulkTopicModal | openModal | [16324](../../app.js#L16324) |
| openDeadlineDrawer | Drawer.open | [16527](../../app.js#L16527) |
| openDeadlineModal | openModal | [16534](../../app.js#L16534) |
| saveCurrentAnalysis | openModal | [17412](../../app.js#L17412) |
| renameSavedAnalysis | openModal | [17437](../../app.js#L17437) |
| openAnalyticsDrawer | Drawer.open | [19167](../../app.js#L19167) |
| openDayDrawer | Drawer.open | [19372](../../app.js#L19372) |
| openBucketDrawer | Drawer.open | [19467](../../app.js#L19467) |
| openDistributionDrawer | Drawer.open | [19553](../../app.js#L19553) |
| copySummary | openModal | [20062](../../app.js#L20062) |
| openHistoryFilters | Drawer.open | [20348](../../app.js#L20348) |
| openEditSessionModal | openModal | [20518](../../app.js#L20518) |
| confirmLongEdit | close.push | [20702](../../app.js#L20702) |
| openAIReportModal | openModal | [20849](../../app.js#L20849) |
| runIntegrityCheck | openModal | [21000](../../app.js#L21000) |
| restoreRefused | openModal | [21172](../../app.js#L21172) |
| askTimerBeforeRestore | openModal | [21198](../../app.js#L21198) |
| openRestorePreview | openModal | [21240](../../app.js#L21240) |
| bindEvents | openModal | [21374](../../app.js#L21374) |
| openHelpArticle | Drawer.open | [22709](../../app.js#L22709) |
| pickDisciplineThen | openModal | [22779](../../app.js#L22779) |
| pickDisciplineForPriority | openModal | [22883](../../app.js#L22883) |
| openContactDrawer | Drawer.open | [23664](../../app.js#L23664) |
| openReportProblemDrawer | Drawer.open | [23756](../../app.js#L23756) |
| openScreenHelp | Drawer.open | [23790](../../app.js#L23790) |
| maybeShowWhatsNew | openModal | [24033](../../app.js#L24033) |
| openWelcome | openModal | [24090](../../app.js#L24090) |
| openFirstReviewIntro | openModal | [24594](../../app.js#L24594) |
| openChangelog | Drawer.open | [24970](../../app.js#L24970) |
| openGuidedReviewBuilder | openModal | [113](../../reviews.js#L113) |
| openGuidedReviewPlayer | openModal | [167](../../reviews.js#L167) |
| openGuidedReviewResult | openModal | [206](../../reviews.js#L206) |
| openReviewSchedule | openModal | [334](../../reviews.js#L334) |
| openVisualReport | openModal | [315](../../reports.js#L315) |

## Controles fixos em index.html

| Controle | ID | Nome / texto | Linha |
|---|---|---|---|
| button | theme-toggle | Alternar tema | [84](../../index.html#L84) |
| button |  | Hoje | [90](../../index.html#L90) |
| button |  | Estudar | [91](../../index.html#L91) |
| button |  | Revisões | [92](../../index.html#L92) |
| button |  | Organizar | [93](../../index.html#L93) |
| button |  | Resultados | [94](../../index.html#L94) |
| button |  | Ajuda | [99](../../index.html#L99) |
| button |  | Dados e backup | [100](../../index.html#L100) |
| button |  | Configurações | [101](../../index.html#L101) |
| button | open-palette-m | Buscar no Ciclo | [113](../../index.html#L113) |
| button | mb-more | Ajuda, dados e configurações | [116](../../index.html#L116) |
| button | theme-toggle-m | Alternar tema | [119](../../index.html#L119) |
| button | open-palette | Buscar no Ciclo: disciplinas, tópicos, prazos, ações e ajuda | [127](../../index.html#L127) |
| button | screen-help | Ajuda desta tela | [132](../../index.html#L132) |
| button |  | Hoje | [191](../../index.html#L191) |
| button |  | Estudar | [192](../../index.html#L192) |
| button |  | Revisões | [193](../../index.html#L193) |
| button |  | Organizar | [194](../../index.html#L194) |
| button |  | Resultados | [195](../../index.html#L195) |
| button | fab | Registrar estudo | [200](../../index.html#L200) |
| button | drawer-close | Fechar painel | [217](../../index.html#L217) |
| input | palette-input | Buscar no Ciclo | [229](../../index.html#L229) |
| button | focus-presentation | Apresentação | [250](../../index.html#L250) |
| button | focus-fs | Tela cheia | [253](../../index.html#L253) |
| button | focus-exit | Sair do modo foco | [256](../../index.html#L256) |
| details | focus-display-options | Personalizar painel              Abrir em outra janela | [261](../../index.html#L261) |
| button | focus-open-window | Abrir em outra janela | [264](../../index.html#L264) |
