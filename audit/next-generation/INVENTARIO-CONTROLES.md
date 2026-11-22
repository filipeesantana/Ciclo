# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fontes: app.js, reviews.js, reports.js. 610 construções de controles, 65 construções de camadas e 769 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](../../audit/MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6079](../../app.js#L6079) |
| askConflict | button button |  | Descartar a minha edição | [6080](../../app.js#L6080) |
| askConflict | button button |  | Manter a minha edição | [6081](../../app.js#L6081) |
| DataSync | button button |  | Atualizar | [6371](../../app.js#L6371) |
| DataSync | button button |  | Continuar editando | [6373](../../app.js#L6373) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6852](../../app.js#L6852) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6853](../../app.js#L6853) |
| selectField | select  | dinâmico: id |  | [7304](../../app.js#L7304) |
| pillGroup | button button |  | dinâmico: it.label | [7317](../../app.js#L7317) |
| setView | button button |  | dinâmico: label | [7366](../../app.js#L7366) |
| renderTimerBar | button button |  | dinâmico: a.label | [7646](../../app.js#L7646) |
| renderTimerBar | button button |  | Foco | [7648](../../app.js#L7648) |
| renderTimerBar | button button |  | descartar | [7649](../../app.js#L7649) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7840](../../app.js#L7840) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7842](../../app.js#L7842) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8035](../../app.js#L8035) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8038](../../app.js#L8038) |
| topicMultiPicker | button button |  | Pronto | [8044](../../app.js#L8044) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8059](../../app.js#L8059) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8349](../../app.js#L8349) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8367](../../app.js#L8367) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8409](../../app.js#L8409) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8410](../../app.js#L8410) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8563](../../app.js#L8563) |
| topicSplitField | button button |  |  | [8627](../../app.js#L8627) |
| topicSplitField | button button |  | Não dividir | [8631](../../app.js#L8631) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8650](../../app.js#L8650) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8838](../../app.js#L8838) |
| commentField | textarea  | dinâmico: o.id |  | [8888](../../app.js#L8888) |
| commentField | button button |  |  | [8891](../../app.js#L8891) |
| commentField | button button |  | Recolher | [8892](../../app.js#L8892) |
| commentField | button button |  | Remover comentário | [8893](../../app.js#L8893) |
| confirmStudySubview | button button |  | Cancelar | [8915](../../app.js#L8915) |
| confirmStudySubview | button button |  | dinâmico: label | [8916](../../app.js#L8916) |
| howGroup | details  |  | dinâmico: h('summary', { text:'Tipo de estudo e dificuldade' }) | [8935](../../app.js#L8935) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8979](../../app.js#L8979) |
| resultsField | button button |  | Recolher | [8984](../../app.js#L8984) |
| resultsField | button button |  | + Adicionar resultado | [8987](../../app.js#L8987) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [9014](../../app.js#L9014) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [9016](../../app.js#L9016) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9030](../../app.js#L9030) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9031](../../app.js#L9031) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9032](../../app.js#L9032) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9071](../../app.js#L9071) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9085](../../app.js#L9085) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9087](../../app.js#L9087) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9190](../../app.js#L9190) |
| breaksEditor | button button |  | dinâmico: addLabel | [9328](../../app.js#L9328) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9350](../../app.js#L9350) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9363](../../app.js#L9363) |
| FormDraft | button button |  | Começar do zero | [9541](../../app.js#L9541) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9563](../../app.js#L9563) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9568](../../app.js#L9568) |
| studyWhenFields | button button |  |  | [9574](../../app.js#L9574) |
| studyWhenFields | button button |  |  | [9576](../../app.js#L9576) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9580](../../app.js#L9580) |
| studyWhenFields | details  |  | dinâmico: h('summary', {text:'Data, horários e descansos'}) | [9726](../../app.js#L9726) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9824](../../app.js#L9824) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9848](../../app.js#L9848) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9860](../../app.js#L9860) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9867](../../app.js#L9867) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9881](../../app.js#L9881) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9893](../../app.js#L9893) |
| confirmLong | button button |  | Corrigir | [9970](../../app.js#L9970) |
| confirmLong | button button |  | Sim, registrar | [9985](../../app.js#L9985) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9992](../../app.js#L9992) |
| openRegisterModal | button button |  | Cancelar | [10092](../../app.js#L10092) |
| openFinishModal | input number | fin-min |  | [10155](../../app.js#L10155) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10200](../../app.js#L10200) |
| renderOutcome | select  | fin-method |  | [10236](../../app.js#L10236) |
| openFinishModal | button button |  | Registrar estudo | [10278](../../app.js#L10278) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10356](../../app.js#L10356) |
| offerStaleSession | button button |  | Continuar | [10383](../../app.js#L10383) |
| offerStaleSession | button button |  | Descartar | [10384](../../app.js#L10384) |
| offerStaleSession | button button |  | Finalizar | [10385](../../app.js#L10385) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11236](../../app.js#L11236) |
| renderToday | button button |  | Quero ajuda para organizar | [11237](../../app.js#L11237) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Atalhos e organização'}) | [11252](../../app.js#L11252) |
| renderToday | details  |  | dinâmico: h('summary', {text:'Frase do dia'}) | [11256](../../app.js#L11256) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11286](../../app.js#L11286) |
| todayAction | button button |  | dinâmico: icon('i-focus') | [11307](../../app.js#L11307) |
| todayAction | button button |  | Retomar revisão guiada | [11308](../../app.js#L11308) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11309](../../app.js#L11309) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11310](../../app.js#L11310) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11327](../../app.js#L11327) |
| todayAction | button button |  | Por quê? | [11329](../../app.js#L11329) |
| todayAction | button button |  | Outras opções | [11330](../../app.js#L11330) |
| todayAction | details  |  | dinâmico: h('summary', {text:'Sugestão de estudo'}) | [11334](../../app.js#L11334) |
| todaySummary | button button |  | Criar relatório | [11351](../../app.js#L11351) |
| todaySummary | button button |  | Ver detalhes do dia | [11352](../../app.js#L11352) |
| todaySummary | button button |  | Ver registros de hoje | [11353](../../app.js#L11353) |
| todayWeekPanel | button button |  | Ver nas Análises | [11402](../../app.js#L11402) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11403](../../app.js#L11403) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11410](../../app.js#L11410) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11413](../../app.js#L11413) |
| todayNextSteps | button button |  | Revisar | [11430](../../app.js#L11430) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11431](../../app.js#L11431) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11458](../../app.js#L11458) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11489](../../app.js#L11489) |
| nextRow | button button |  | dinâmico: main | [11526](../../app.js#L11526) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11538](../../app.js#L11538) |
| explainAction | button button |  | Fechar | [11552](../../app.js#L11552) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11588](../../app.js#L11588) |
| renderReviews | button button |  | Montar revisão guiada | [11589](../../app.js#L11589) |
| renderReviews | button button |  | Como funcionam as revisões? | [11591](../../app.js#L11591) |
| renderReviews | button button |  | Adicionar um tópico | [11592](../../app.js#L11592) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11605](../../app.js#L11605) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11606](../../app.js#L11606) |
| renderReviews | button button |  | Como funciona? | [11607](../../app.js#L11607) |
| renderReviews | button button |  | Religar sugestões | [11608](../../app.js#L11608) |
| renderReviews | details  |  | dinâmico: h('summary', {text:'Sugestões e adiamentos'}) | [11625](../../app.js#L11625) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11650](../../app.js#L11650) |
| drawReviewGroups | button button |  | Limpar busca | [11687](../../app.js#L11687) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11698](../../app.js#L11698) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11714](../../app.js#L11714) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11717](../../app.js#L11717) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11719](../../app.js#L11719) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11724](../../app.js#L11724) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11729](../../app.js#L11729) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11732](../../app.js#L11732) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11733](../../app.js#L11733) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11750](../../app.js#L11750) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11754](../../app.js#L11754) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11769](../../app.js#L11769) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11772](../../app.js#L11772) |
| reviewGroupCard | button button |  | Escolher assuntos | [11773](../../app.js#L11773) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11792](../../app.js#L11792) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11796](../../app.js#L11796) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11851](../../app.js#L11851) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11863](../../app.js#L11863) |
| openDisciplineReview | button button |  | Cancelar | [11885](../../app.js#L11885) |
| openDisciplineReview | button button |  | Já revisei | [11886](../../app.js#L11886) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11892](../../app.js#L11892) |
| startReview | button button |  | Cancelar | [11939](../../app.js#L11939) |
| startReview | button button |  | Registrar sem cronômetro | [11940](../../app.js#L11940) |
| startReview | button button |  | Começar revisão | [11942](../../app.js#L11942) |
| openReviewOutcomeModal | input number | ro-min |  | [11955](../../app.js#L11955) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11963](../../app.js#L11963) |
| openReviewOutcomeModal | button button |  | Cancelar | [11965](../../app.js#L11965) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11966](../../app.js#L11966) |
| openReviewPrimer | button button |  | O que é revisão? | [12017](../../app.js#L12017) |
| openReviewPrimer | button button |  | Por que não basta reler? | [12018](../../app.js#L12018) |
| renderPlan | button button |  | Ir para Disciplinas | [12522](../../app.js#L12522) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12535](../../app.js#L12535) |
| renderPlan | button button |  | Outro valor | [12536](../../app.js#L12536) |
| renderPlan | button button |  | Para que serve o planejamento? | [12540](../../app.js#L12540) |
| renderPlan | input number | plan-avail-h |  | [12550](../../app.js#L12550) |
| renderPlan | input text | plan-name |  | [12558](../../app.js#L12558) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12564](../../app.js#L12564) |
| renderPlan | button button |  | Sugerir automaticamente | [12572](../../app.js#L12572) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12614](../../app.js#L12614) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12618](../../app.js#L12618) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12621](../../app.js#L12621) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12637](../../app.js#L12637) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12638](../../app.js#L12638) |
| openPlansDrawer | button button |  | Ativar | [12660](../../app.js#L12660) |
| openPlansDrawer | button button |  | excluir | [12661](../../app.js#L12661) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12663](../../app.js#L12663) |
| createSimplePlan | button button |  | Personalizar distribuição | [12696](../../app.js#L12696) |
| createSimplePlan | button button |  | Usar esta sugestão | [12701](../../app.js#L12701) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12783](../../app.js#L12783) |
| openNewPlanModal | input number | np-hours |  | [12784](../../app.js#L12784) |
| openNewPlanModal | button button |  | Cancelar | [12793](../../app.js#L12793) |
| openNewPlanModal | button button |  | Criar | [12794](../../app.js#L12794) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12891](../../app.js#L12891) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12898](../../app.js#L12898) |
| planWeekHead | button button |  | Alterar meta | [12957](../../app.js#L12957) |
| planWeekHead | button button |  | Personalizar distribuição | [12958](../../app.js#L12958) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12959](../../app.js#L12959) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12984](../../app.js#L12984) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [13003](../../app.js#L13003) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [13017](../../app.js#L13017) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13021](../../app.js#L13021) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13024](../../app.js#L13024) |
| openWeekGoalModal | button button |  | Cancelar | [13043](../../app.js#L13043) |
| openWeekGoalModal | button button |  | Salvar meta | [13044](../../app.js#L13044) |
| planWeekNav | button button |  | Semana anterior | [13080](../../app.js#L13080) |
| planWeekNav | button button |  | Próxima semana | [13082](../../app.js#L13082) |
| planWeekNav | button button |  | Ir para esta semana | [13085](../../app.js#L13085) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13086](../../app.js#L13086) |
| planWeekNotices | button button |  | Ajustar os blocos | [13130](../../app.js#L13130) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13131](../../app.js#L13131) |
| planWeekNotices | button button |  | Manter assim | [13133](../../app.js#L13133) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13172](../../app.js#L13172) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13174](../../app.js#L13174) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13192](../../app.js#L13192) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13219](../../app.js#L13219) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13223](../../app.js#L13223) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13245](../../app.js#L13245) |
| openSuggestionEditor | button button |  | Só nesta semana | [13246](../../app.js#L13246) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13247](../../app.js#L13247) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13262](../../app.js#L13262) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13268](../../app.js#L13268) |
| openSuggestionPicker | button button |  | Cancelar | [13288](../../app.js#L13288) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13301](../../app.js#L13301) |
| openWeekBlockPicker | input radio |  |  | [13312](../../app.js#L13312) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13324](../../app.js#L13324) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13330](../../app.js#L13330) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13339](../../app.js#L13339) |
| openWeekBlockPicker | button button |  | Cancelar | [13344](../../app.js#L13344) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13345](../../app.js#L13345) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13443](../../app.js#L13443) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13474](../../app.js#L13474) |
| planOffDays | button button |  | Personalizar dias | [13514](../../app.js#L13514) |
| weekConflictDialog | button button |  | Ver a versão atual | [13528](../../app.js#L13528) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13529](../../app.js#L13529) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13646](../../app.js#L13646) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13649](../../app.js#L13649) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13653](../../app.js#L13653) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13663](../../app.js#L13663) |
| openBlockEditor | button button |  | Salvar | [13685](../../app.js#L13685) |
| openBlockEditor | button button |  | Tirar deste dia | [13708](../../app.js#L13708) |
| openBlockEditor | button button |  | Cancelar | [13709](../../app.js#L13709) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13724](../../app.js#L13724) |
| openMoveDialog | button button |  | Cancelar | [13733](../../app.js#L13733) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13744](../../app.js#L13744) |
| openStudyDaysModal | button button |  | Cancelar | [13758](../../app.js#L13758) |
| openStudyDaysModal | button button |  | Salvar | [13759](../../app.js#L13759) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13790](../../app.js#L13790) |
| openAdjustBlocks | button button |  | Cancelar | [13805](../../app.js#L13805) |
| openAdjustBlocks | button button |  | Salvar | [13806](../../app.js#L13806) |
| openGoalUpdate | button button |  | Cancelar | [13839](../../app.js#L13839) |
| openGoalUpdate | button button |  | Só nesta semana | [13840](../../app.js#L13840) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13841](../../app.js#L13841) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14100](../../app.js#L14100) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14161](../../app.js#L14161) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14470](../../app.js#L14470) |
| contextSearch | button button |  | Limpar busca | [14472](../../app.js#L14472) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14500](../../app.js#L14500) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14510](../../app.js#L14510) |
| collectionView | button button |  | Limpar busca | [14601](../../app.js#L14601) |
| collectionView | button button |  | Mostrar todos | [14602](../../app.js#L14602) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15090](../../app.js#L15090) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15133](../../app.js#L15133) |
| levelHead | button button |  | dinâmico: c.label | [15154](../../app.js#L15154) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15155](../../app.js#L15155) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15226](../../app.js#L15226) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15227](../../app.js#L15227) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15233](../../app.js#L15233) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15238](../../app.js#L15238) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15314](../../app.js#L15314) |
| discAreaLevel | button button |  | Organizar em uma área | [15325](../../app.js#L15325) |
| discAreaLevel | button button |  | Reativar | [15333](../../app.js#L15333) |
| discAreaLevel | button button |  | Adicionar disciplina | [15352](../../app.js#L15352) |
| discAreaLevel | button button |  | Agora não | [15353](../../app.js#L15353) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15363](../../app.js#L15363) |
| discDisciplineLevel | button button |  | Reativar | [15392](../../app.js#L15392) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15393](../../app.js#L15393) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15394](../../app.js#L15394) |
| discDisciplineLevel | button button |  | Editar | [15395](../../app.js#L15395) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15404](../../app.js#L15404) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15440](../../app.js#L15440) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15442](../../app.js#L15442) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15446](../../app.js#L15446) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15477](../../app.js#L15477) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15479](../../app.js#L15479) |
| topicDetailContent | button button |  | Reativar tópico | [15527](../../app.js#L15527) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15530](../../app.js#L15530) |
| topicDetailContent | button button |  | Revisar agora | [15531](../../app.js#L15531) |
| topicDetailContent | button button |  | Agendar revisão | [15532](../../app.js#L15532) |
| topicDetailContent | button button |  | Editar | [15533](../../app.js#L15533) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15534](../../app.js#L15534) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15548](../../app.js#L15548) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15561](../../app.js#L15561) |
| areaNudgeCard | button button |  | Organizar | [15630](../../app.js#L15630) |
| areaNudgeCard | button button |  | Agora não | [15631](../../app.js#L15631) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15664](../../app.js#L15664) |
| openAreaModal | input checkbox |  |  | [15672](../../app.js#L15672) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15687](../../app.js#L15687) |
| openAreaModal | button button |  | Cancelar | [15735](../../app.js#L15735) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15825](../../app.js#L15825) |
| openDisciplineModal | select  | dm-area |  | [15830](../../app.js#L15830) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15835](../../app.js#L15835) |
| openDisciplineModal | select  | dm-nature |  | [15857](../../app.js#L15857) |
| openDisciplineModal | select  | dm-strategy |  | [15861](../../app.js#L15861) |
| openDisciplineModal | select  | dm-method |  | [15867](../../app.js#L15867) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15873](../../app.js#L15873) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15895](../../app.js#L15895) |
| openDisciplineModal | button button |  | Cancelar | [15952](../../app.js#L15952) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15954](../../app.js#L15954) |
| openDisciplineModal | button button |  | excluir definitivamente | [15956](../../app.js#L15956) |
| topicReviewOptions | select  | tm-strategy |  | [16074](../../app.js#L16074) |
| topicReviewOptions | select  | tm-method |  | [16079](../../app.js#L16079) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16084](../../app.js#L16084) |
| reviewToggle | input checkbox | tm-review |  | [16095](../../app.js#L16095) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16140](../../app.js#L16140) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16184](../../app.js#L16184) |
| showTwin | button button |  | Usar este tópico | [16201](../../app.js#L16201) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16206](../../app.js#L16206) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16207](../../app.js#L16207) |
| topicEditor | button button |  | dinâmico: saveLabel | [16288](../../app.js#L16288) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16290](../../app.js#L16290) |
| topicEditor | button button |  | Arquivar | [16294](../../app.js#L16294) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16327](../../app.js#L16327) |
| openBulkTopicModal | button button |  | Cancelar | [16340](../../app.js#L16340) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16341](../../app.js#L16341) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16381](../../app.js#L16381) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16386](../../app.js#L16386) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16387](../../app.js#L16387) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16390](../../app.js#L16390) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16392](../../app.js#L16392) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16428](../../app.js#L16428) |
| openDeadlineDrawer | button button |  | Reabrir | [16524](../../app.js#L16524) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16525](../../app.js#L16525) |
| openDeadlineDrawer | button button |  | Editar | [16526](../../app.js#L16526) |
| openDeadlineDrawer | button button |  | Ver tópico | [16527](../../app.js#L16527) |
| openDeadlineDrawer | button button |  | excluir | [16528](../../app.js#L16528) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16543](../../app.js#L16543) |
| openDeadlineModal | input date | dl-date |  | [16544](../../app.js#L16544) |
| openDeadlineModal | input date | dl-start |  | [16546](../../app.js#L16546) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16552](../../app.js#L16552) |
| openDeadlineModal | select  | dl-disc |  | [16564](../../app.js#L16564) |
| openDeadlineModal | select  | dl-topic |  | [16572](../../app.js#L16572) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16590](../../app.js#L16590) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16592](../../app.js#L16592) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16610](../../app.js#L16610) |
| openDeadlineModal | button button |  | Cancelar | [16622](../../app.js#L16622) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16623](../../app.js#L16623) |
| openDeadlineModal | button button |  | excluir | [16661](../../app.js#L16661) |
| renderAnalytics | button button |  | dinâmico: icon('i-download') | [17026](../../app.js#L17026) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17097](../../app.js#L17097) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17106](../../app.js#L17106) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17122](../../app.js#L17122) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17156](../../app.js#L17156) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17176](../../app.js#L17176) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17205](../../app.js#L17205) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17233](../../app.js#L17233) |
| analyticsCustomBuilder | button button |  | Cancelar | [17250](../../app.js#L17250) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17251](../../app.js#L17251) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17259](../../app.js#L17259) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17263](../../app.js#L17263) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17348](../../app.js#L17348) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17356](../../app.js#L17356) |
| scopePicker | button button |  | limpar | [17358](../../app.js#L17358) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17391](../../app.js#L17391) |
| saveCurrentAnalysis | input text | sa-name |  | [17415](../../app.js#L17415) |
| saveCurrentAnalysis | button button |  | Cancelar | [17430](../../app.js#L17430) |
| saveCurrentAnalysis | button button |  | Salvar | [17431](../../app.js#L17431) |
| renameSavedAnalysis | input text | sa-rename |  | [17440](../../app.js#L17440) |
| renameSavedAnalysis | button button |  | Cancelar | [17450](../../app.js#L17450) |
| renameSavedAnalysis | button button |  | Salvar | [17450](../../app.js#L17450) |
| rangePicker | button button |  | Mês anterior | [17487](../../app.js#L17487) |
| rangePicker | button button |  | Próximo mês | [17489](../../app.js#L17489) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17507](../../app.js#L17507) |
| rangePicker | input date | an-rs |  | [17530](../../app.js#L17530) |
| rangePicker | input date | an-re |  | [17531](../../app.js#L17531) |
| rangePicker | button button |  | limpar datas | [17549](../../app.js#L17549) |
| analyticsReadingGuide | details  |  | dinâmico: h('summary', {text:'Como ler estes números'}) | [17557](../../app.js#L17557) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17679](../../app.js#L17679) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17722](../../app.js#L17722) |
| analyticsPanorama | button button |  | Personalizar análise | [17731](../../app.js#L17731) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17738](../../app.js#L17738) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17763](../../app.js#L17763) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17788](../../app.js#L17788) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17790](../../app.js#L17790) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17796](../../app.js#L17796) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Personalizado…' | [17799](../../app.js#L17799) |
| analyticsResultHeader | button button |  | limpar | [17811](../../app.js#L17811) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-download') | [17814](../../app.js#L17814) |
| analyticsResultHeader | button button |  | Ver registros | [17815](../../app.js#L17815) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17816](../../app.js#L17816) |
| analyticsResultHeader | button button |  | Alterar análise | [17817](../../app.js#L17817) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17836](../../app.js#L17836) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17853](../../app.js#L17853) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17866](../../app.js#L17866) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17870](../../app.js#L17870) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17885](../../app.js#L17885) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17886](../../app.js#L17886) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17930](../../app.js#L17930) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17986](../../app.js#L17986) |
| milestonesViz | button button |  | ver o estudo | [18005](../../app.js#L18005) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18302](../../app.js#L18302) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18510](../../app.js#L18510) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18576](../../app.js#L18576) |
| dueReviewsViz | button button |  | Revisar | [18580](../../app.js#L18580) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18636](../../app.js#L18636) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18706](../../app.js#L18706) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18793](../../app.js#L18793) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18843](../../app.js#L18843) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18862](../../app.js#L18862) |
| menuButton | button button |  | dinâmico: it.label | [18872](../../app.js#L18872) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18898](../../app.js#L18898) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18904](../../app.js#L18904) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18913](../../app.js#L18913) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18936](../../app.js#L18936) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [19027](../../app.js#L19027) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [19036](../../app.js#L19036) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19061](../../app.js#L19061) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19064](../../app.js#L19064) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19113](../../app.js#L19113) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19134](../../app.js#L19134) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19157](../../app.js#L19157) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19183](../../app.js#L19183) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19184](../../app.js#L19184) |
| analyticsCalendarCard | button button |  | Analisar este período | [19196](../../app.js#L19196) |
| analyticsCalendarCard | button button |  | Cancelar | [19200](../../app.js#L19200) |
| calendarHeatmap | button button |  | Mês anterior | [19216](../../app.js#L19216) |
| calendarHeatmap | button button |  | Próximo mês | [19218](../../app.js#L19218) |
| calendarHeatmap | button button |  | mês atual | [19219](../../app.js#L19219) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19264](../../app.js#L19264) |
| openDayDrawer | button button |  | Editar este estudo | [19361](../../app.js#L19361) |
| openDayDrawer | button button |  | Analisar este dia | [19373](../../app.js#L19373) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19378](../../app.js#L19378) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19421](../../app.js#L19421) |
| openBucketDrawer | button button |  | Analisar este período | [19471](../../app.js#L19471) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19493](../../app.js#L19493) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19558](../../app.js#L19558) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19559](../../app.js#L19559) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19594](../../app.js#L19594) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19641](../../app.js#L19641) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19646](../../app.js#L19646) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19698](../../app.js#L19698) |
| weeklyReportCard | button button |  | Semana anterior | [19764](../../app.js#L19764) |
| weeklyReportCard | button button |  | Próxima semana | [19766](../../app.js#L19766) |
| copySummary | textarea  |  | Resumo do período | [20073](../../app.js#L20073) |
| copySummary | button button |  | Fechar | [20074](../../app.js#L20074) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20248](../../app.js#L20248) |
| historyDiscoveries | button button |  | Ver registros usados | [20249](../../app.js#L20249) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20252](../../app.js#L20252) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20268](../../app.js#L20268) |
| renderHistory | button button |  | Registrar estudo | [20269](../../app.js#L20269) |
| renderHistory | button button |  | Filtros | [20280](../../app.js#L20280) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20287](../../app.js#L20287) |
| renderHistory | button button |  | limpar tudo | [20289](../../app.js#L20289) |
| openHistoryFilters | button button |  | Aplicar filtros | [20351](../../app.js#L20351) |
| openHistoryFilters | button button |  | Limpar | [20354](../../app.js#L20354) |
| renderHistoryTable | button button |  | Limpar busca | [20424](../../app.js#L20424) |
| renderHistoryTable | button button |  | dinâmico: label | [20454](../../app.js#L20454) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20466](../../app.js#L20466) |
| openEditSessionModal | button button |  | remover estudo | [20638](../../app.js#L20638) |
| openEditSessionModal | button button |  | Cancelar | [20644](../../app.js#L20644) |
| openEditSessionModal | button button |  | Salvar | [20645](../../app.js#L20645) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20713](../../app.js#L20713) |
| confirmLongEdit | button button |  | Está certo, salvar | [20714](../../app.js#L20714) |
| openAIReportModal | textarea  |  | Texto do prompt | [20859](../../app.js#L20859) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20860](../../app.js#L20860) |
| openAIReportModal | button button |  | dinâmico: x.label | [20885](../../app.js#L20885) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20899](../../app.js#L20899) |
| openAIReportModal | input checkbox | air-comments |  | [20907](../../app.js#L20907) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20962](../../app.js#L20962) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20970](../../app.js#L20970) |
| openAIReportModal | button button |  | Só baixar o CSV | [20976](../../app.js#L20976) |
| openAIReportModal | button button |  | Só copiar o prompt | [20977](../../app.js#L20977) |
| openAIReportModal | button button |  | Fechar | [20987](../../app.js#L20987) |
| runIntegrityCheck | button button |  | Fechar | [21019](../../app.js#L21019) |
| renderData | input file | import-file |  | [21031](../../app.js#L21031) |
| renderData | button button |  | dinâmico: icon('i-data') | [21044](../../app.js#L21044) |
| renderData | button button |  | Onde meus dados ficam? | [21048](../../app.js#L21048) |
| renderData | button button |  | Preparar | [21063](../../app.js#L21063) |
| renderData | button button |  | Exportar | [21068](../../app.js#L21068) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21069](../../app.js#L21069) |
| renderData | button button |  | Verificar | [21086](../../app.js#L21086) |
| renderData | button button |  | Pedir ao navegador | [21091](../../app.js#L21091) |
| renderData | button button |  | apagar cópia antiga da V2 | [21136](../../app.js#L21136) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21143](../../app.js#L21143) |
| renderData | button button |  | Apagar todos os dados | [21147](../../app.js#L21147) |
| restoreRefused | button button |  | Entendi | [21184](../../app.js#L21184) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21211](../../app.js#L21211) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21212](../../app.js#L21212) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21213](../../app.js#L21213) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21249](../../app.js#L21249) |
| openRestorePreview | button button |  | Cancelar | [21287](../../app.js#L21287) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21298](../../app.js#L21298) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21301](../../app.js#L21301) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21306](../../app.js#L21306) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21385](../../app.js#L21385) |
| bindEvents | button button |  | Fechar | [21387](../../app.js#L21387) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [22024](../../app.js#L22024) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22083](../../app.js#L22083) |
| GlossaryPopover | button button |  | Fechar explicação | [22086](../../app.js#L22086) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22141](../../app.js#L22141) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22362](../../app.js#L22362) |
| FocusMode | input checkbox |  |  | [22521](../../app.js#L22521) |
| FocusMode | button button |  | dinâmico: a.label | [22573](../../app.js#L22573) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22789](../../app.js#L22789) |
| pickDisciplineThen | button button |  | Cancelar | [22791](../../app.js#L22791) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22870](../../app.js#L22870) |
| renderReturnPill | button button |  | Fechar este atalho | [22872](../../app.js#L22872) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22894](../../app.js#L22894) |
| pickDisciplineForPriority | button button |  | Cancelar | [22897](../../app.js#L22897) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22933](../../app.js#L22933) |
| helpBreadcrumb | button button |  | dinâmico: label | [22976](../../app.js#L22976) |
| articleBody | button button |  | dinâmico: x.label | [23029](../../app.js#L23029) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [23042](../../app.js#L23042) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [23056](../../app.js#L23056) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [23066](../../app.js#L23066) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [23078](../../app.js#L23078) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [23093](../../app.js#L23093) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [23096](../../app.js#L23096) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [23115](../../app.js#L23115) |
| helpSearchCard | button button |  | Limpar busca | [23150](../../app.js#L23150) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23160](../../app.js#L23160) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23245](../../app.js#L23245) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23259](../../app.js#L23259) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23276](../../app.js#L23276) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23288](../../app.js#L23288) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23334](../../app.js#L23334) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23344](../../app.js#L23344) |
| helpHomePanel | button button |  | Rever a apresentação | [23360](../../app.js#L23360) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23361](../../app.js#L23361) |
| helpHomePanel | button button |  | Ver o guia | [23362](../../app.js#L23362) |
| helpHomePanel | button button |  | Ver todas | [23369](../../app.js#L23369) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23376](../../app.js#L23376) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23378](../../app.js#L23378) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23380](../../app.js#L23380) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23382](../../app.js#L23382) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23396](../../app.js#L23396) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23419](../../app.js#L23419) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23456](../../app.js#L23456) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23497](../../app.js#L23497) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23539](../../app.js#L23539) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23636](../../app.js#L23636) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23663](../../app.js#L23663) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23666](../../app.js#L23666) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23670](../../app.js#L23670) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23704](../../app.js#L23704) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23744](../../app.js#L23744) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23759](../../app.js#L23759) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23760](../../app.js#L23760) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23783](../../app.js#L23783) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23787](../../app.js#L23787) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23794](../../app.js#L23794) |
| renderTips | button button |  | Entendi | [23826](../../app.js#L23826) |
| toastRich | button button |  | dinâmico: a.label | [23850](../../app.js#L23850) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [24017](../../app.js#L24017) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [24048](../../app.js#L24048) |
| maybeShowWhatsNew | button button |  | Continuar | [24051](../../app.js#L24051) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [24104](../../app.js#L24104) |
| stepQuick | input text | ob-name | Ex.: Português | [24119](../../app.js#L24119) |
| stepQuick | button button |  | dinâmico: ex | [24123](../../app.js#L24123) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24134](../../app.js#L24134) |
| stepWhat | button button |  | dinâmico: p.label | [24138](../../app.js#L24138) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24144](../../app.js#L24144) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24150](../../app.js#L24150) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24159](../../app.js#L24159) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24167](../../app.js#L24167) |
| stepGoal | input date | ob-goal-d |  | [24169](../../app.js#L24169) |
| stepGoal | select  | ob-goal-disc |  | [24171](../../app.js#L24171) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24186](../../app.js#L24186) |
| stepTime | input number | ob-hours | Outro | [24195](../../app.js#L24195) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24198](../../app.js#L24198) |
| buildActions | button button |  | Voltar | [24254](../../app.js#L24254) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24257](../../app.js#L24257) |
| buildActions | button button |  | Criar e continuar | [24261](../../app.js#L24261) |
| buildActions | button button |  | Continuar | [24263](../../app.js#L24263) |
| buildActions | button button |  | Continuar | [24269](../../app.js#L24269) |
| buildActions | button button |  | Continuar | [24277](../../app.js#L24277) |
| buildActions | button button |  | Criar e começar | [24282](../../app.js#L24282) |
| guideNote | button button |  | dinâmico: a.label | [24442](../../app.js#L24442) |
| guideNote | button button |  | Agora não | [24444](../../app.js#L24444) |
| startGuideCard | button button |  | ocultar | [24478](../../app.js#L24478) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24494](../../app.js#L24494) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24523](../../app.js#L24523) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24552](../../app.js#L24552) |
| openFirstReviewIntro | button button |  | Agora não | [24610](../../app.js#L24610) |
| openFirstReviewIntro | button button |  | Começar | [24613](../../app.js#L24613) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24658](../../app.js#L24658) |
| segmented | button button |  | dinâmico: o.label | [24703](../../app.js#L24703) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24716](../../app.js#L24716) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24727](../../app.js#L24727) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24733](../../app.js#L24733) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24766](../../app.js#L24766) |
| renderSettings | button button |  | Rever a apresentação | [24799](../../app.js#L24799) |
| renderSettings | button button |  | Mostrar novamente | [24801](../../app.js#L24801) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24815](../../app.js#L24815) |
| renderSettings | button button |  | Mostrar todas de novo | [24855](../../app.js#L24855) |
| renderSettings | button button |  | Como funcionam as revisões? | [24860](../../app.js#L24860) |
| renderSettings | button button |  | Ver | [24880](../../app.js#L24880) |
| renderSettings | button button |  | Fazer backup agora | [24892](../../app.js#L24892) |
| renderSettings | button button |  | Abrir tela Dados | [24894](../../app.js#L24894) |
| renderSettings | button button |  | Onde meus dados ficam? | [24895](../../app.js#L24895) |
| renderSettings | button button |  | Preparar | [24897](../../app.js#L24897) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24913](../../app.js#L24913) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24914](../../app.js#L24914) |
| renderSettings | button button |  | Central de Ajuda | [24915](../../app.js#L24915) |
| renderSettings | button button |  | Novidades desta versão | [24916](../../app.js#L24916) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24934](../../app.js#L24934) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24965](../../app.js#L24965) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24973](../../app.js#L24973) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [25039](../../app.js#L25039) |
| renderDeadlineSuggestions | button button |  | Manter atual | [25047](../../app.js#L25047) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [25070](../../app.js#L25070) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [25075](../../app.js#L25075) |
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
| openVisualReport | input date |  |  | [334](../../reports.js#L334) |
| openVisualReport | input date |  |  | [335](../../reports.js#L335) |
| openVisualReport | input search |  |  | [340](../../reports.js#L340) |
| openVisualReport | input text |  |  | [351](../../reports.js#L351) |
| openVisualReport | input text |  |  | [352](../../reports.js#L352) |
| openVisualReport | input color |  |  | [353](../../reports.js#L353) |
| openVisualReport | input checkbox |  |  | [367](../../reports.js#L367) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Título e cores'}) | [373](../../reports.js#L373) |
| openVisualReport | details  |  | dinâmico: h('summary',{text:'Blocos e privacidade'}) | [379](../../reports.js#L379) |
| scopeOptions | input checkbox |  |  | [402](../../reports.js#L402) |
| drawOrder | button button | dinâmico: 'report-' + id + '-' + direction | dinâmico: labelBtn + ' bloco ' + label | [423](../../reports.js#L423) |
| drawOrder | input checkbox |  |  | [428](../../reports.js#L428) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6073](../../app.js#L6073) |
| confirmModal | openModal | [6848](../../app.js#L6848) |
| confirmStudySubview | close.push | [8914](../../app.js#L8914) |
| openRegisterModal | openModal | [9819](../../app.js#L9819) |
| confirmLong | close.push | [9978](../../app.js#L9978) |
| openFinishModal | openModal | [10153](../../app.js#L10153) |
| offerStaleSession | openModal | [10376](../../app.js#L10376) |
| openAlternatives | Drawer.open | [11540](../../app.js#L11540) |
| explainAction | openModal | [11544](../../app.js#L11544) |
| openDisciplineReview | openModal | [11847](../../app.js#L11847) |
| startReview | openModal | [11912](../../app.js#L11912) |
| openReviewOutcomeModal | openModal | [11954](../../app.js#L11954) |
| openReviewPrimer | Drawer.open | [12020](../../app.js#L12020) |
| openPlansDrawer | Drawer.open | [12664](../../app.js#L12664) |
| createSimplePlan | openModal | [12682](../../app.js#L12682) |
| openNewPlanModal | openModal | [12782](../../app.js#L12782) |
| openWeekGoalModal | openModal | [13015](../../app.js#L13015) |
| openSuggestionEditor | openModal | [13217](../../app.js#L13217) |
| openSuggestionPicker | openModal | [13261](../../app.js#L13261) |
| openWeekBlockPicker | openModal | [13300](../../app.js#L13300) |
| weekConflictDialog | close.push | [13532](../../app.js#L13532) |
| weekConflictDialog | openModal | [13533](../../app.js#L13533) |
| openBlockEditor | openModal | [13645](../../app.js#L13645) |
| openMoveDialog | openModal | [13721](../../app.js#L13721) |
| openStudyDaysModal | openModal | [13742](../../app.js#L13742) |
| openAdjustBlocks | openModal | [13779](../../app.js#L13779) |
| openGoalUpdate | openModal | [13827](../../app.js#L13827) |
| openTopicDrawer | Drawer.open | [15595](../../app.js#L15595) |
| openAreaModal | openModal | [15663](../../app.js#L15663) |
| openDisciplineModal | openModal | [15824](../../app.js#L15824) |
| openTopicModal | openModal | [16315](../../app.js#L16315) |
| openBulkTopicModal | openModal | [16326](../../app.js#L16326) |
| openDeadlineDrawer | Drawer.open | [16529](../../app.js#L16529) |
| openDeadlineModal | openModal | [16536](../../app.js#L16536) |
| saveCurrentAnalysis | openModal | [17414](../../app.js#L17414) |
| renameSavedAnalysis | openModal | [17439](../../app.js#L17439) |
| openAnalyticsDrawer | Drawer.open | [19174](../../app.js#L19174) |
| openDayDrawer | Drawer.open | [19379](../../app.js#L19379) |
| openBucketDrawer | Drawer.open | [19474](../../app.js#L19474) |
| openDistributionDrawer | Drawer.open | [19560](../../app.js#L19560) |
| copySummary | openModal | [20069](../../app.js#L20069) |
| openHistoryFilters | Drawer.open | [20355](../../app.js#L20355) |
| openEditSessionModal | openModal | [20525](../../app.js#L20525) |
| confirmLongEdit | close.push | [20709](../../app.js#L20709) |
| openAIReportModal | openModal | [20856](../../app.js#L20856) |
| runIntegrityCheck | openModal | [21007](../../app.js#L21007) |
| restoreRefused | openModal | [21179](../../app.js#L21179) |
| askTimerBeforeRestore | openModal | [21205](../../app.js#L21205) |
| openRestorePreview | openModal | [21247](../../app.js#L21247) |
| bindEvents | openModal | [21381](../../app.js#L21381) |
| openHelpArticle | Drawer.open | [22716](../../app.js#L22716) |
| pickDisciplineThen | openModal | [22786](../../app.js#L22786) |
| pickDisciplineForPriority | openModal | [22890](../../app.js#L22890) |
| openContactDrawer | Drawer.open | [23671](../../app.js#L23671) |
| openReportProblemDrawer | Drawer.open | [23763](../../app.js#L23763) |
| openScreenHelp | Drawer.open | [23797](../../app.js#L23797) |
| maybeShowWhatsNew | openModal | [24040](../../app.js#L24040) |
| openWelcome | openModal | [24097](../../app.js#L24097) |
| openFirstReviewIntro | openModal | [24601](../../app.js#L24601) |
| openChangelog | Drawer.open | [24977](../../app.js#L24977) |
| openGuidedReviewBuilder | openModal | [113](../../reviews.js#L113) |
| openGuidedReviewPlayer | openModal | [167](../../reviews.js#L167) |
| openGuidedReviewResult | openModal | [206](../../reviews.js#L206) |
| openReviewSchedule | openModal | [334](../../reviews.js#L334) |
| openVisualReport | openModal | [322](../../reports.js#L322) |

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
