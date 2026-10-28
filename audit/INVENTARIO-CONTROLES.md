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
| renderTimerBar | button button |  | dinâmico: a.label | [7643](../app.js#L7643) |
| renderTimerBar | button button |  | Foco | [7645](../app.js#L7645) |
| renderTimerBar | button button |  | descartar | [7646](../app.js#L7646) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7837](../app.js#L7837) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7839](../app.js#L7839) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8032](../app.js#L8032) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8035](../app.js#L8035) |
| topicMultiPicker | button button |  | Pronto | [8041](../app.js#L8041) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8056](../app.js#L8056) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8346](../app.js#L8346) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8364](../app.js#L8364) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8406](../app.js#L8406) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8407](../app.js#L8407) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8560](../app.js#L8560) |
| topicSplitField | button button |  |  | [8624](../app.js#L8624) |
| topicSplitField | button button |  | Não dividir | [8628](../app.js#L8628) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8647](../app.js#L8647) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8835](../app.js#L8835) |
| commentField | textarea  | dinâmico: o.id |  | [8885](../app.js#L8885) |
| commentField | button button |  |  | [8888](../app.js#L8888) |
| commentField | button button |  | Recolher | [8889](../app.js#L8889) |
| commentField | button button |  | Remover comentário | [8890](../app.js#L8890) |
| confirmStudySubview | button button |  | Cancelar | [8912](../app.js#L8912) |
| confirmStudySubview | button button |  | dinâmico: label | [8913](../app.js#L8913) |
| howGroup | details  |  | dinâmico: h('summary', { text:'Tipo de estudo e dificuldade' }) | [8932](../app.js#L8932) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8976](../app.js#L8976) |
| resultsField | button button |  | Recolher | [8981](../app.js#L8981) |
| resultsField | button button |  | + Adicionar resultado | [8984](../app.js#L8984) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [9011](../app.js#L9011) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [9013](../app.js#L9013) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9027](../app.js#L9027) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9028](../app.js#L9028) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9029](../app.js#L9029) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9068](../app.js#L9068) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9082](../app.js#L9082) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9084](../app.js#L9084) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9187](../app.js#L9187) |
| breaksEditor | button button |  | dinâmico: addLabel | [9325](../app.js#L9325) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9347](../app.js#L9347) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9360](../app.js#L9360) |
| FormDraft | button button |  | Começar do zero | [9538](../app.js#L9538) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9560](../app.js#L9560) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9565](../app.js#L9565) |
| studyWhenFields | button button |  |  | [9571](../app.js#L9571) |
| studyWhenFields | button button |  |  | [9573](../app.js#L9573) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9577](../app.js#L9577) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9816](../app.js#L9816) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9840](../app.js#L9840) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9852](../app.js#L9852) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9859](../app.js#L9859) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9873](../app.js#L9873) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9885](../app.js#L9885) |
| confirmLong | button button |  | Corrigir | [9960](../app.js#L9960) |
| confirmLong | button button |  | Sim, registrar | [9975](../app.js#L9975) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9982](../app.js#L9982) |
| openRegisterModal | button button |  | Cancelar | [10080](../app.js#L10080) |
| openFinishModal | input number | fin-min |  | [10143](../app.js#L10143) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10188](../app.js#L10188) |
| renderOutcome | select  | fin-method |  | [10222](../app.js#L10222) |
| openFinishModal | button button |  | Registrar estudo | [10264](../app.js#L10264) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10340](../app.js#L10340) |
| offerStaleSession | button button |  | Continuar | [10367](../app.js#L10367) |
| offerStaleSession | button button |  | Descartar | [10368](../app.js#L10368) |
| offerStaleSession | button button |  | Finalizar | [10369](../app.js#L10369) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11211](../app.js#L11211) |
| renderToday | button button |  | Quero ajuda para organizar | [11212](../app.js#L11212) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11260](../app.js#L11260) |
| todayAction | button button |  | dinâmico: icon('i-check') | [11281](../app.js#L11281) |
| todayAction | button button |  | Retomar revisão guiada | [11282](../app.js#L11282) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11283](../app.js#L11283) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11284](../app.js#L11284) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11301](../app.js#L11301) |
| todayAction | button button |  | Por quê? | [11303](../app.js#L11303) |
| todayAction | button button |  | Outras opções | [11304](../app.js#L11304) |
| todaySummary | button button |  | Ver detalhes do dia | [11323](../app.js#L11323) |
| todaySummary | button button |  | Ver registros de hoje | [11324](../app.js#L11324) |
| todayWeekPanel | button button |  | Ver nas Análises | [11373](../app.js#L11373) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11374](../app.js#L11374) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11381](../app.js#L11381) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11384](../app.js#L11384) |
| todayNextSteps | button button |  | Revisar | [11401](../app.js#L11401) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11402](../app.js#L11402) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11429](../app.js#L11429) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11460](../app.js#L11460) |
| nextRow | button button |  | dinâmico: main | [11497](../app.js#L11497) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11509](../app.js#L11509) |
| explainAction | button button |  | Fechar | [11523](../app.js#L11523) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11558](../app.js#L11558) |
| renderReviews | button button |  | Montar revisão guiada | [11559](../app.js#L11559) |
| renderReviews | button button |  | Como funcionam as revisões? | [11561](../app.js#L11561) |
| renderReviews | button button |  | Adicionar um tópico | [11562](../app.js#L11562) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11575](../app.js#L11575) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11576](../app.js#L11576) |
| renderReviews | button button |  | Como funciona? | [11577](../app.js#L11577) |
| renderReviews | button button |  | Religar sugestões | [11578](../app.js#L11578) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11613](../app.js#L11613) |
| drawReviewGroups | button button |  | Limpar busca | [11650](../app.js#L11650) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11661](../app.js#L11661) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11677](../app.js#L11677) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11680](../app.js#L11680) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11682](../app.js#L11682) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11687](../app.js#L11687) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11692](../app.js#L11692) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11695](../app.js#L11695) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11696](../app.js#L11696) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11713](../app.js#L11713) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11717](../app.js#L11717) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11732](../app.js#L11732) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11735](../app.js#L11735) |
| reviewGroupCard | button button |  | Escolher assuntos | [11736](../app.js#L11736) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11760](../app.js#L11760) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11764](../app.js#L11764) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11831](../app.js#L11831) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11843](../app.js#L11843) |
| openDisciplineReview | button button |  | Cancelar | [11865](../app.js#L11865) |
| openDisciplineReview | button button |  | Já revisei | [11866](../app.js#L11866) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11872](../app.js#L11872) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [11911](../app.js#L11911) |
| startReview | button button |  | Cancelar | [11921](../app.js#L11921) |
| startReview | button button |  | Registrar sem cronômetro | [11922](../app.js#L11922) |
| startReview | button button |  | Começar revisão | [11924](../app.js#L11924) |
| openReviewOutcomeModal | input number | ro-min |  | [11937](../app.js#L11937) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11945](../app.js#L11945) |
| openReviewOutcomeModal | button button |  | Cancelar | [11947](../app.js#L11947) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11948](../app.js#L11948) |
| openReviewPrimer | button button |  | O que é revisão? | [11999](../app.js#L11999) |
| openReviewPrimer | button button |  | Por que não basta reler? | [12000](../app.js#L12000) |
| renderPlan | button button |  | Ir para Disciplinas | [12504](../app.js#L12504) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12517](../app.js#L12517) |
| renderPlan | button button |  | Outro valor | [12518](../app.js#L12518) |
| renderPlan | button button |  | Para que serve o planejamento? | [12522](../app.js#L12522) |
| renderPlan | input number | plan-avail-h |  | [12532](../app.js#L12532) |
| renderPlan | input text | plan-name |  | [12540](../app.js#L12540) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12546](../app.js#L12546) |
| renderPlan | button button |  | Sugerir automaticamente | [12554](../app.js#L12554) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12596](../app.js#L12596) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12600](../app.js#L12600) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12603](../app.js#L12603) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12619](../app.js#L12619) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12620](../app.js#L12620) |
| openPlansDrawer | button button |  | Ativar | [12642](../app.js#L12642) |
| openPlansDrawer | button button |  | excluir | [12643](../app.js#L12643) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12645](../app.js#L12645) |
| createSimplePlan | button button |  | Personalizar distribuição | [12678](../app.js#L12678) |
| createSimplePlan | button button |  | Usar esta sugestão | [12683](../app.js#L12683) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12765](../app.js#L12765) |
| openNewPlanModal | input number | np-hours |  | [12766](../app.js#L12766) |
| openNewPlanModal | button button |  | Cancelar | [12775](../app.js#L12775) |
| openNewPlanModal | button button |  | Criar | [12776](../app.js#L12776) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12873](../app.js#L12873) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12880](../app.js#L12880) |
| planWeekHead | button button |  | Alterar meta | [12939](../app.js#L12939) |
| planWeekHead | button button |  | Personalizar distribuição | [12940](../app.js#L12940) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12941](../app.js#L12941) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12966](../app.js#L12966) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [12985](../app.js#L12985) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [12999](../app.js#L12999) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13003](../app.js#L13003) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13006](../app.js#L13006) |
| openWeekGoalModal | button button |  | Cancelar | [13025](../app.js#L13025) |
| openWeekGoalModal | button button |  | Salvar meta | [13026](../app.js#L13026) |
| planWeekNav | button button |  | Semana anterior | [13062](../app.js#L13062) |
| planWeekNav | button button |  | Próxima semana | [13064](../app.js#L13064) |
| planWeekNav | button button |  | Ir para esta semana | [13067](../app.js#L13067) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13068](../app.js#L13068) |
| planWeekNotices | button button |  | Ajustar os blocos | [13112](../app.js#L13112) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13113](../app.js#L13113) |
| planWeekNotices | button button |  | Manter assim | [13115](../app.js#L13115) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13154](../app.js#L13154) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13156](../app.js#L13156) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13174](../app.js#L13174) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13201](../app.js#L13201) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13205](../app.js#L13205) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13227](../app.js#L13227) |
| openSuggestionEditor | button button |  | Só nesta semana | [13228](../app.js#L13228) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13229](../app.js#L13229) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13244](../app.js#L13244) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13250](../app.js#L13250) |
| openSuggestionPicker | button button |  | Cancelar | [13270](../app.js#L13270) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13283](../app.js#L13283) |
| openWeekBlockPicker | input radio |  |  | [13294](../app.js#L13294) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13306](../app.js#L13306) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13312](../app.js#L13312) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13321](../app.js#L13321) |
| openWeekBlockPicker | button button |  | Cancelar | [13326](../app.js#L13326) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13327](../app.js#L13327) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13425](../app.js#L13425) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13456](../app.js#L13456) |
| planOffDays | button button |  | Personalizar dias | [13496](../app.js#L13496) |
| weekConflictDialog | button button |  | Ver a versão atual | [13510](../app.js#L13510) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13511](../app.js#L13511) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13628](../app.js#L13628) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13631](../app.js#L13631) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13635](../app.js#L13635) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13645](../app.js#L13645) |
| openBlockEditor | button button |  | Salvar | [13667](../app.js#L13667) |
| openBlockEditor | button button |  | Tirar deste dia | [13690](../app.js#L13690) |
| openBlockEditor | button button |  | Cancelar | [13691](../app.js#L13691) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13706](../app.js#L13706) |
| openMoveDialog | button button |  | Cancelar | [13715](../app.js#L13715) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13726](../app.js#L13726) |
| openStudyDaysModal | button button |  | Cancelar | [13740](../app.js#L13740) |
| openStudyDaysModal | button button |  | Salvar | [13741](../app.js#L13741) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13772](../app.js#L13772) |
| openAdjustBlocks | button button |  | Cancelar | [13787](../app.js#L13787) |
| openAdjustBlocks | button button |  | Salvar | [13788](../app.js#L13788) |
| openGoalUpdate | button button |  | Cancelar | [13821](../app.js#L13821) |
| openGoalUpdate | button button |  | Só nesta semana | [13822](../app.js#L13822) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13823](../app.js#L13823) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14082](../app.js#L14082) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14143](../app.js#L14143) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14452](../app.js#L14452) |
| contextSearch | button button |  | Limpar busca | [14454](../app.js#L14454) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14482](../app.js#L14482) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14492](../app.js#L14492) |
| collectionView | button button |  | Limpar busca | [14583](../app.js#L14583) |
| collectionView | button button |  | Mostrar todos | [14584](../app.js#L14584) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15072](../app.js#L15072) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15115](../app.js#L15115) |
| levelHead | button button |  | dinâmico: c.label | [15136](../app.js#L15136) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15137](../app.js#L15137) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15208](../app.js#L15208) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15209](../app.js#L15209) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15215](../app.js#L15215) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15220](../app.js#L15220) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15296](../app.js#L15296) |
| discAreaLevel | button button |  | Organizar em uma área | [15307](../app.js#L15307) |
| discAreaLevel | button button |  | Reativar | [15315](../app.js#L15315) |
| discAreaLevel | button button |  | Adicionar disciplina | [15334](../app.js#L15334) |
| discAreaLevel | button button |  | Agora não | [15335](../app.js#L15335) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15345](../app.js#L15345) |
| discDisciplineLevel | button button |  | Reativar | [15374](../app.js#L15374) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15375](../app.js#L15375) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15376](../app.js#L15376) |
| discDisciplineLevel | button button |  | Editar | [15377](../app.js#L15377) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15386](../app.js#L15386) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15422](../app.js#L15422) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15424](../app.js#L15424) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15428](../app.js#L15428) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15459](../app.js#L15459) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15461](../app.js#L15461) |
| topicDetailContent | button button |  | Reativar tópico | [15509](../app.js#L15509) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15512](../app.js#L15512) |
| topicDetailContent | button button |  | Revisar agora | [15513](../app.js#L15513) |
| topicDetailContent | button button |  | Editar | [15514](../app.js#L15514) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15515](../app.js#L15515) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15529](../app.js#L15529) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15542](../app.js#L15542) |
| areaNudgeCard | button button |  | Organizar | [15611](../app.js#L15611) |
| areaNudgeCard | button button |  | Agora não | [15612](../app.js#L15612) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15645](../app.js#L15645) |
| openAreaModal | input checkbox |  |  | [15653](../app.js#L15653) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15668](../app.js#L15668) |
| openAreaModal | button button |  | Cancelar | [15716](../app.js#L15716) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15806](../app.js#L15806) |
| openDisciplineModal | select  | dm-area |  | [15811](../app.js#L15811) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15816](../app.js#L15816) |
| openDisciplineModal | select  | dm-nature |  | [15838](../app.js#L15838) |
| openDisciplineModal | select  | dm-strategy |  | [15842](../app.js#L15842) |
| openDisciplineModal | select  | dm-method |  | [15848](../app.js#L15848) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15854](../app.js#L15854) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15876](../app.js#L15876) |
| openDisciplineModal | button button |  | Cancelar | [15933](../app.js#L15933) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15935](../app.js#L15935) |
| openDisciplineModal | button button |  | excluir definitivamente | [15937](../app.js#L15937) |
| topicReviewOptions | select  | tm-strategy |  | [16055](../app.js#L16055) |
| topicReviewOptions | select  | tm-method |  | [16060](../app.js#L16060) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16065](../app.js#L16065) |
| reviewToggle | input checkbox | tm-review |  | [16076](../app.js#L16076) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16121](../app.js#L16121) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16165](../app.js#L16165) |
| showTwin | button button |  | Usar este tópico | [16182](../app.js#L16182) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16187](../app.js#L16187) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16188](../app.js#L16188) |
| topicEditor | button button |  | dinâmico: saveLabel | [16269](../app.js#L16269) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16271](../app.js#L16271) |
| topicEditor | button button |  | Arquivar | [16275](../app.js#L16275) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16308](../app.js#L16308) |
| openBulkTopicModal | button button |  | Cancelar | [16321](../app.js#L16321) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16322](../app.js#L16322) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16362](../app.js#L16362) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16367](../app.js#L16367) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16368](../app.js#L16368) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16371](../app.js#L16371) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16373](../app.js#L16373) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16409](../app.js#L16409) |
| openDeadlineDrawer | button button |  | Reabrir | [16505](../app.js#L16505) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16506](../app.js#L16506) |
| openDeadlineDrawer | button button |  | Editar | [16507](../app.js#L16507) |
| openDeadlineDrawer | button button |  | Ver tópico | [16508](../app.js#L16508) |
| openDeadlineDrawer | button button |  | excluir | [16509](../app.js#L16509) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16524](../app.js#L16524) |
| openDeadlineModal | input date | dl-date |  | [16525](../app.js#L16525) |
| openDeadlineModal | input date | dl-start |  | [16527](../app.js#L16527) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16533](../app.js#L16533) |
| openDeadlineModal | select  | dl-disc |  | [16545](../app.js#L16545) |
| openDeadlineModal | select  | dl-topic |  | [16553](../app.js#L16553) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16571](../app.js#L16571) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16573](../app.js#L16573) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16591](../app.js#L16591) |
| openDeadlineModal | button button |  | Cancelar | [16603](../app.js#L16603) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16604](../app.js#L16604) |
| openDeadlineModal | button button |  | excluir | [16642](../app.js#L16642) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17076](../app.js#L17076) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17085](../app.js#L17085) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17101](../app.js#L17101) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17135](../app.js#L17135) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17155](../app.js#L17155) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17184](../app.js#L17184) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17212](../app.js#L17212) |
| analyticsCustomBuilder | button button |  | Cancelar | [17229](../app.js#L17229) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17230](../app.js#L17230) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17238](../app.js#L17238) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17242](../app.js#L17242) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17327](../app.js#L17327) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17335](../app.js#L17335) |
| scopePicker | button button |  | limpar | [17337](../app.js#L17337) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17370](../app.js#L17370) |
| saveCurrentAnalysis | input text | sa-name |  | [17394](../app.js#L17394) |
| saveCurrentAnalysis | button button |  | Cancelar | [17409](../app.js#L17409) |
| saveCurrentAnalysis | button button |  | Salvar | [17410](../app.js#L17410) |
| renameSavedAnalysis | input text | sa-rename |  | [17419](../app.js#L17419) |
| renameSavedAnalysis | button button |  | Cancelar | [17429](../app.js#L17429) |
| renameSavedAnalysis | button button |  | Salvar | [17429](../app.js#L17429) |
| rangePicker | button button |  | Mês anterior | [17466](../app.js#L17466) |
| rangePicker | button button |  | Próximo mês | [17468](../app.js#L17468) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17486](../app.js#L17486) |
| rangePicker | input date | an-rs |  | [17509](../app.js#L17509) |
| rangePicker | input date | an-re |  | [17510](../app.js#L17510) |
| rangePicker | button button |  | limpar datas | [17528](../app.js#L17528) |
| analyticsReadingGuide | details  |  | dinâmico: h('summary', {text:'Como ler estes números'}) | [17536](../app.js#L17536) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17658](../app.js#L17658) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17701](../app.js#L17701) |
| analyticsPanorama | button button |  | Personalizar análise | [17710](../app.js#L17710) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17717](../app.js#L17717) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17742](../app.js#L17742) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17755](../app.js#L17755) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17757](../app.js#L17757) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17762](../app.js#L17762) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17765](../app.js#L17765) |
| analyticsResultHeader | button button |  | limpar | [17776](../app.js#L17776) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17779](../app.js#L17779) |
| analyticsResultHeader | button button |  | Alterar análise | [17780](../app.js#L17780) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17799](../app.js#L17799) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17816](../app.js#L17816) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17829](../app.js#L17829) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17833](../app.js#L17833) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17848](../app.js#L17848) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17849](../app.js#L17849) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17893](../app.js#L17893) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17949](../app.js#L17949) |
| milestonesViz | button button |  | ver o estudo | [17968](../app.js#L17968) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18265](../app.js#L18265) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18473](../app.js#L18473) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18539](../app.js#L18539) |
| dueReviewsViz | button button |  | Revisar | [18543](../app.js#L18543) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18599](../app.js#L18599) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18669](../app.js#L18669) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18756](../app.js#L18756) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18806](../app.js#L18806) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18825](../app.js#L18825) |
| menuButton | button button |  | dinâmico: it.label | [18835](../app.js#L18835) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18861](../app.js#L18861) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18867](../app.js#L18867) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18876](../app.js#L18876) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18899](../app.js#L18899) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18990](../app.js#L18990) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18999](../app.js#L18999) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19024](../app.js#L19024) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19027](../app.js#L19027) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19076](../app.js#L19076) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19097](../app.js#L19097) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19120](../app.js#L19120) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19146](../app.js#L19146) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19147](../app.js#L19147) |
| analyticsCalendarCard | button button |  | Analisar este período | [19159](../app.js#L19159) |
| analyticsCalendarCard | button button |  | Cancelar | [19163](../app.js#L19163) |
| calendarHeatmap | button button |  | Mês anterior | [19179](../app.js#L19179) |
| calendarHeatmap | button button |  | Próximo mês | [19181](../app.js#L19181) |
| calendarHeatmap | button button |  | mês atual | [19182](../app.js#L19182) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19227](../app.js#L19227) |
| openDayDrawer | button button |  | Editar este estudo | [19324](../app.js#L19324) |
| openDayDrawer | button button |  | Analisar este dia | [19336](../app.js#L19336) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19341](../app.js#L19341) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19384](../app.js#L19384) |
| openBucketDrawer | button button |  | Analisar este período | [19434](../app.js#L19434) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19456](../app.js#L19456) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19521](../app.js#L19521) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19522](../app.js#L19522) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19557](../app.js#L19557) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19604](../app.js#L19604) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19609](../app.js#L19609) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19661](../app.js#L19661) |
| weeklyReportCard | button button |  | Semana anterior | [19727](../app.js#L19727) |
| weeklyReportCard | button button |  | Próxima semana | [19729](../app.js#L19729) |
| copySummary | textarea  |  | Resumo do período | [20036](../app.js#L20036) |
| copySummary | button button |  | Fechar | [20037](../app.js#L20037) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20211](../app.js#L20211) |
| historyDiscoveries | button button |  | Ver registros usados | [20212](../app.js#L20212) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20215](../app.js#L20215) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20231](../app.js#L20231) |
| renderHistory | button button |  | Registrar estudo | [20232](../app.js#L20232) |
| renderHistory | button button |  | Filtros | [20243](../app.js#L20243) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20250](../app.js#L20250) |
| renderHistory | button button |  | limpar tudo | [20252](../app.js#L20252) |
| openHistoryFilters | button button |  | Aplicar filtros | [20311](../app.js#L20311) |
| openHistoryFilters | button button |  | Limpar | [20314](../app.js#L20314) |
| renderHistoryTable | button button |  | Limpar busca | [20383](../app.js#L20383) |
| renderHistoryTable | button button |  | dinâmico: label | [20411](../app.js#L20411) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20423](../app.js#L20423) |
| openEditSessionModal | button button |  | remover estudo | [20591](../app.js#L20591) |
| openEditSessionModal | button button |  | Cancelar | [20597](../app.js#L20597) |
| openEditSessionModal | button button |  | Salvar | [20598](../app.js#L20598) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20666](../app.js#L20666) |
| confirmLongEdit | button button |  | Está certo, salvar | [20667](../app.js#L20667) |
| openAIReportModal | textarea  |  | Texto do prompt | [20812](../app.js#L20812) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20813](../app.js#L20813) |
| openAIReportModal | button button |  | dinâmico: x.label | [20838](../app.js#L20838) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20852](../app.js#L20852) |
| openAIReportModal | input checkbox | air-comments |  | [20860](../app.js#L20860) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20915](../app.js#L20915) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20923](../app.js#L20923) |
| openAIReportModal | button button |  | Só baixar o CSV | [20929](../app.js#L20929) |
| openAIReportModal | button button |  | Só copiar o prompt | [20930](../app.js#L20930) |
| openAIReportModal | button button |  | Fechar | [20940](../app.js#L20940) |
| runIntegrityCheck | button button |  | Fechar | [20972](../app.js#L20972) |
| renderData | input file | import-file |  | [20984](../app.js#L20984) |
| renderData | button button |  | dinâmico: icon('i-data') | [20997](../app.js#L20997) |
| renderData | button button |  | Onde meus dados ficam? | [21001](../app.js#L21001) |
| renderData | button button |  | Preparar | [21016](../app.js#L21016) |
| renderData | button button |  | Exportar | [21021](../app.js#L21021) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21022](../app.js#L21022) |
| renderData | button button |  | Verificar | [21039](../app.js#L21039) |
| renderData | button button |  | Pedir ao navegador | [21044](../app.js#L21044) |
| renderData | button button |  | apagar cópia antiga da V2 | [21089](../app.js#L21089) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21096](../app.js#L21096) |
| renderData | button button |  | Apagar todos os dados | [21100](../app.js#L21100) |
| restoreRefused | button button |  | Entendi | [21137](../app.js#L21137) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21164](../app.js#L21164) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21165](../app.js#L21165) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21166](../app.js#L21166) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21202](../app.js#L21202) |
| openRestorePreview | button button |  | Cancelar | [21240](../app.js#L21240) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21251](../app.js#L21251) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21254](../app.js#L21254) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21259](../app.js#L21259) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21332](../app.js#L21332) |
| bindEvents | button button |  | Fechar | [21334](../app.js#L21334) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21967](../app.js#L21967) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22026](../app.js#L22026) |
| GlossaryPopover | button button |  | Fechar explicação | [22029](../app.js#L22029) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22084](../app.js#L22084) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22305](../app.js#L22305) |
| FocusMode | button button |  | dinâmico: a.label | [22469](../app.js#L22469) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22670](../app.js#L22670) |
| pickDisciplineThen | button button |  | Cancelar | [22672](../app.js#L22672) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22751](../app.js#L22751) |
| renderReturnPill | button button |  | Fechar este atalho | [22753](../app.js#L22753) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22775](../app.js#L22775) |
| pickDisciplineForPriority | button button |  | Cancelar | [22778](../app.js#L22778) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22814](../app.js#L22814) |
| helpBreadcrumb | button button |  | dinâmico: label | [22857](../app.js#L22857) |
| articleBody | button button |  | dinâmico: x.label | [22910](../app.js#L22910) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22923](../app.js#L22923) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22937](../app.js#L22937) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22947](../app.js#L22947) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22959](../app.js#L22959) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22974](../app.js#L22974) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22977](../app.js#L22977) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22996](../app.js#L22996) |
| helpSearchCard | button button |  | Limpar busca | [23031](../app.js#L23031) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23041](../app.js#L23041) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23126](../app.js#L23126) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23140](../app.js#L23140) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23157](../app.js#L23157) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23169](../app.js#L23169) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23215](../app.js#L23215) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23225](../app.js#L23225) |
| helpHomePanel | button button |  | Rever a apresentação | [23241](../app.js#L23241) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23242](../app.js#L23242) |
| helpHomePanel | button button |  | Ver o guia | [23243](../app.js#L23243) |
| helpHomePanel | button button |  | Ver todas | [23250](../app.js#L23250) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23257](../app.js#L23257) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23259](../app.js#L23259) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23261](../app.js#L23261) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23263](../app.js#L23263) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23277](../app.js#L23277) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23300](../app.js#L23300) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23337](../app.js#L23337) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23378](../app.js#L23378) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23420](../app.js#L23420) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23517](../app.js#L23517) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23544](../app.js#L23544) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23547](../app.js#L23547) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23551](../app.js#L23551) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23585](../app.js#L23585) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23625](../app.js#L23625) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23640](../app.js#L23640) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23641](../app.js#L23641) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23664](../app.js#L23664) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23668](../app.js#L23668) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23675](../app.js#L23675) |
| renderTips | button button |  | Entendi | [23707](../app.js#L23707) |
| toastRich | button button |  | dinâmico: a.label | [23731](../app.js#L23731) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23898](../app.js#L23898) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23929](../app.js#L23929) |
| maybeShowWhatsNew | button button |  | Continuar | [23932](../app.js#L23932) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23985](../app.js#L23985) |
| stepQuick | input text | ob-name | Ex.: Português | [24000](../app.js#L24000) |
| stepQuick | button button |  | dinâmico: ex | [24004](../app.js#L24004) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24015](../app.js#L24015) |
| stepWhat | button button |  | dinâmico: p.label | [24019](../app.js#L24019) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24025](../app.js#L24025) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24031](../app.js#L24031) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24040](../app.js#L24040) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24048](../app.js#L24048) |
| stepGoal | input date | ob-goal-d |  | [24050](../app.js#L24050) |
| stepGoal | select  | ob-goal-disc |  | [24052](../app.js#L24052) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24067](../app.js#L24067) |
| stepTime | input number | ob-hours | Outro | [24076](../app.js#L24076) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24079](../app.js#L24079) |
| buildActions | button button |  | Voltar | [24135](../app.js#L24135) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24138](../app.js#L24138) |
| buildActions | button button |  | Criar e continuar | [24142](../app.js#L24142) |
| buildActions | button button |  | Continuar | [24144](../app.js#L24144) |
| buildActions | button button |  | Continuar | [24150](../app.js#L24150) |
| buildActions | button button |  | Continuar | [24158](../app.js#L24158) |
| buildActions | button button |  | Criar e começar | [24163](../app.js#L24163) |
| guideNote | button button |  | dinâmico: a.label | [24323](../app.js#L24323) |
| guideNote | button button |  | Agora não | [24325](../app.js#L24325) |
| startGuideCard | button button |  | ocultar | [24359](../app.js#L24359) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24375](../app.js#L24375) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24404](../app.js#L24404) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24433](../app.js#L24433) |
| openFirstReviewIntro | button button |  | Agora não | [24491](../app.js#L24491) |
| openFirstReviewIntro | button button |  | Começar | [24494](../app.js#L24494) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24539](../app.js#L24539) |
| segmented | button button |  | dinâmico: o.label | [24584](../app.js#L24584) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24597](../app.js#L24597) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24608](../app.js#L24608) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24614](../app.js#L24614) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24647](../app.js#L24647) |
| renderSettings | button button |  | Rever a apresentação | [24680](../app.js#L24680) |
| renderSettings | button button |  | Mostrar novamente | [24682](../app.js#L24682) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24696](../app.js#L24696) |
| renderSettings | button button |  | Mostrar todas de novo | [24736](../app.js#L24736) |
| renderSettings | button button |  | Como funcionam as revisões? | [24741](../app.js#L24741) |
| renderSettings | button button |  | Ver | [24761](../app.js#L24761) |
| renderSettings | button button |  | Fazer backup agora | [24773](../app.js#L24773) |
| renderSettings | button button |  | Abrir tela Dados | [24775](../app.js#L24775) |
| renderSettings | button button |  | Onde meus dados ficam? | [24776](../app.js#L24776) |
| renderSettings | button button |  | Preparar | [24778](../app.js#L24778) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24794](../app.js#L24794) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24795](../app.js#L24795) |
| renderSettings | button button |  | Central de Ajuda | [24796](../app.js#L24796) |
| renderSettings | button button |  | Novidades desta versão | [24797](../app.js#L24797) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24815](../app.js#L24815) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24846](../app.js#L24846) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24854](../app.js#L24854) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24920](../app.js#L24920) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24928](../app.js#L24928) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24951](../app.js#L24951) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24956](../app.js#L24956) |
| reviewButton | button button |  | dinâmico: text | [95](../reviews.js#L95) |
| reviewSelect | select  | dinâmico: id | dinâmico: options.map(([v,text])=>h('option',{value:v,text,selected:v===value})) | [98](../reviews.js#L98) |
| openGuidedReviewBuilder | input number |  |  | [115](../reviews.js#L115) |
| draw | input number |  |  | [140](../reviews.js#L140) |
| openGuidedReviewBuilder | button button |  | dinâmico: v+' min' | [158](../reviews.js#L158) |
| openGuidedReviewBuilder | details  |  | dinâmico: h('summary',{text:'Escolher disciplinas da proposta'}) | [160](../reviews.js#L160) |
| openGuidedReviewBuilder | input checkbox |  |  | [160](../reviews.js#L160) |
| openGuidedReviewResult | input number |  |  | [208](../reviews.js#L208) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6066](../app.js#L6066) |
| confirmModal | openModal | [6839](../app.js#L6839) |
| confirmStudySubview | close.push | [8911](../app.js#L8911) |
| openRegisterModal | openModal | [9811](../app.js#L9811) |
| confirmLong | close.push | [9968](../app.js#L9968) |
| openFinishModal | openModal | [10141](../app.js#L10141) |
| offerStaleSession | openModal | [10360](../app.js#L10360) |
| openAlternatives | Drawer.open | [11511](../app.js#L11511) |
| explainAction | openModal | [11515](../app.js#L11515) |
| openDisciplineReview | openModal | [11827](../app.js#L11827) |
| startReview | openModal | [11892](../app.js#L11892) |
| openReviewOutcomeModal | openModal | [11936](../app.js#L11936) |
| openReviewPrimer | Drawer.open | [12002](../app.js#L12002) |
| openPlansDrawer | Drawer.open | [12646](../app.js#L12646) |
| createSimplePlan | openModal | [12664](../app.js#L12664) |
| openNewPlanModal | openModal | [12764](../app.js#L12764) |
| openWeekGoalModal | openModal | [12997](../app.js#L12997) |
| openSuggestionEditor | openModal | [13199](../app.js#L13199) |
| openSuggestionPicker | openModal | [13243](../app.js#L13243) |
| openWeekBlockPicker | openModal | [13282](../app.js#L13282) |
| weekConflictDialog | close.push | [13514](../app.js#L13514) |
| weekConflictDialog | openModal | [13515](../app.js#L13515) |
| openBlockEditor | openModal | [13627](../app.js#L13627) |
| openMoveDialog | openModal | [13703](../app.js#L13703) |
| openStudyDaysModal | openModal | [13724](../app.js#L13724) |
| openAdjustBlocks | openModal | [13761](../app.js#L13761) |
| openGoalUpdate | openModal | [13809](../app.js#L13809) |
| openTopicDrawer | Drawer.open | [15576](../app.js#L15576) |
| openAreaModal | openModal | [15644](../app.js#L15644) |
| openDisciplineModal | openModal | [15805](../app.js#L15805) |
| openTopicModal | openModal | [16296](../app.js#L16296) |
| openBulkTopicModal | openModal | [16307](../app.js#L16307) |
| openDeadlineDrawer | Drawer.open | [16510](../app.js#L16510) |
| openDeadlineModal | openModal | [16517](../app.js#L16517) |
| saveCurrentAnalysis | openModal | [17393](../app.js#L17393) |
| renameSavedAnalysis | openModal | [17418](../app.js#L17418) |
| openAnalyticsDrawer | Drawer.open | [19137](../app.js#L19137) |
| openDayDrawer | Drawer.open | [19342](../app.js#L19342) |
| openBucketDrawer | Drawer.open | [19437](../app.js#L19437) |
| openDistributionDrawer | Drawer.open | [19523](../app.js#L19523) |
| copySummary | openModal | [20032](../app.js#L20032) |
| openHistoryFilters | Drawer.open | [20315](../app.js#L20315) |
| openEditSessionModal | openModal | [20478](../app.js#L20478) |
| confirmLongEdit | close.push | [20662](../app.js#L20662) |
| openAIReportModal | openModal | [20809](../app.js#L20809) |
| runIntegrityCheck | openModal | [20960](../app.js#L20960) |
| restoreRefused | openModal | [21132](../app.js#L21132) |
| askTimerBeforeRestore | openModal | [21158](../app.js#L21158) |
| openRestorePreview | openModal | [21200](../app.js#L21200) |
| bindEvents | openModal | [21328](../app.js#L21328) |
| openHelpArticle | Drawer.open | [22597](../app.js#L22597) |
| pickDisciplineThen | openModal | [22667](../app.js#L22667) |
| pickDisciplineForPriority | openModal | [22771](../app.js#L22771) |
| openContactDrawer | Drawer.open | [23552](../app.js#L23552) |
| openReportProblemDrawer | Drawer.open | [23644](../app.js#L23644) |
| openScreenHelp | Drawer.open | [23678](../app.js#L23678) |
| maybeShowWhatsNew | openModal | [23921](../app.js#L23921) |
| openWelcome | openModal | [23978](../app.js#L23978) |
| openFirstReviewIntro | openModal | [24482](../app.js#L24482) |
| openChangelog | Drawer.open | [24858](../app.js#L24858) |
| openGuidedReviewBuilder | openModal | [113](../reviews.js#L113) |
| openGuidedReviewPlayer | openModal | [167](../reviews.js#L167) |
| openGuidedReviewResult | openModal | [206](../reviews.js#L206) |

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
