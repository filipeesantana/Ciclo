# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fontes: app.js, flashcards.js e reviews.js. 595 construções de controles, 73 construções de camadas e 753 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [app.js:6100](../app.js#L6100) |
| askConflict | button button |  | Descartar a minha edição | [app.js:6101](../app.js#L6101) |
| askConflict | button button |  | Manter a minha edição | [app.js:6102](../app.js#L6102) |
| DataSync | button button |  | Atualizar | [app.js:6392](../app.js#L6392) |
| DataSync | button button |  | Continuar editando | [app.js:6394](../app.js#L6394) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [app.js:6871](../app.js#L6871) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [app.js:6872](../app.js#L6872) |
| selectField | select  | dinâmico: id |  | [app.js:7323](../app.js#L7323) |
| pillGroup | button button |  | dinâmico: it.label | [app.js:7336](../app.js#L7336) |
| renderTimerBar | button button |  | dinâmico: a.label | [app.js:7669](../app.js#L7669) |
| renderTimerBar | button button |  | Foco | [app.js:7671](../app.js#L7671) |
| renderTimerBar | button button |  | descartar | [app.js:7672](../app.js#L7672) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [app.js:7861](../app.js#L7861) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [app.js:7863](../app.js#L7863) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [app.js:8056](../app.js#L8056) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [app.js:8059](../app.js#L8059) |
| topicMultiPicker | button button |  | Pronto | [app.js:8065](../app.js#L8065) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [app.js:8080](../app.js#L8080) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [app.js:8370](../app.js#L8370) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [app.js:8388](../app.js#L8388) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [app.js:8425](../app.js#L8425) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [app.js:8426](../app.js#L8426) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [app.js:8579](../app.js#L8579) |
| topicSplitField | button button |  |  | [app.js:8643](../app.js#L8643) |
| topicSplitField | button button |  | Não dividir | [app.js:8647](../app.js#L8647) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [app.js:8666](../app.js#L8666) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [app.js:8854](../app.js#L8854) |
| commentField | textarea  | dinâmico: o.id |  | [app.js:8904](../app.js#L8904) |
| commentField | button button |  | + Adicionar comentário | [app.js:8907](../app.js#L8907) |
| commentField | button button |  | Remover o comentário | [app.js:8908](../app.js#L8908) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [app.js:8991](../app.js#L8991) |
| resultsField | button button |  | Recolher | [app.js:8996](../app.js#L8996) |
| resultsField | button button |  | + Adicionar resultado | [app.js:8999](../app.js#L8999) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [app.js:9026](../app.js#L9026) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [app.js:9028](../app.js#L9028) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [app.js:9042](../app.js#L9042) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [app.js:9043](../app.js#L9043) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [app.js:9044](../app.js#L9044) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [app.js:9083](../app.js#L9083) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [app.js:9097](../app.js#L9097) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [app.js:9099](../app.js#L9099) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [app.js:9202](../app.js#L9202) |
| breaksEditor | button button |  | dinâmico: addLabel | [app.js:9340](../app.js#L9340) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [app.js:9362](../app.js#L9362) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [app.js:9375](../app.js#L9375) |
| FormDraft | button button |  | Começar do zero | [app.js:9554](../app.js#L9554) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [app.js:9576](../app.js#L9576) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [app.js:9581](../app.js#L9581) |
| studyWhenFields | button button |  |  | [app.js:9587](../app.js#L9587) |
| studyWhenFields | button button |  |  | [app.js:9589](../app.js#L9589) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [app.js:9593](../app.js#L9593) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [app.js:9833](../app.js#L9833) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [app.js:9857](../app.js#L9857) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [app.js:9869](../app.js#L9869) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [app.js:9876](../app.js#L9876) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [app.js:9890](../app.js#L9890) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [app.js:9902](../app.js#L9902) |
| confirmLong | button button |  | Corrigir | [app.js:9976](../app.js#L9976) |
| confirmLong | button button |  | Sim, registrar | [app.js:9991](../app.js#L9991) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [app.js:9998](../app.js#L9998) |
| openRegisterModal | button button |  | Cancelar | [app.js:10093](../app.js#L10093) |
| openFinishModal | input number | fin-min |  | [app.js:10156](../app.js#L10156) |
| openFinishModal | details  |  | dinâmico: fixToggle | [app.js:10201](../app.js#L10201) |
| renderOutcome | select  | fin-method |  | [app.js:10235](../app.js#L10235) |
| openFinishModal | button button |  | Registrar estudo | [app.js:10277](../app.js#L10277) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [app.js:10353](../app.js#L10353) |
| offerStaleSession | button button |  | Continuar | [app.js:10380](../app.js#L10380) |
| offerStaleSession | button button |  | Descartar | [app.js:10381](../app.js#L10381) |
| offerStaleSession | button button |  | Finalizar | [app.js:10382](../app.js#L10382) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [app.js:11226](../app.js#L11226) |
| renderToday | button button |  | Quero ajuda para organizar | [app.js:11227](../app.js#L11227) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [app.js:11272](../app.js#L11272) |
| todayAction | button button |  | dinâmico: icon('i-check') | [app.js:11290](../app.js#L11290) |
| todayAction | button button |  | dinâmico: icon('i-play') | [app.js:11291](../app.js#L11291) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [app.js:11292](../app.js#L11292) |
| todayAction | button button |  | dinâmico: icon('i-play') | [app.js:11309](../app.js#L11309) |
| todayAction | button button |  | Por quê? | [app.js:11311](../app.js#L11311) |
| todayAction | button button |  | Outras opções | [app.js:11312](../app.js#L11312) |
| todayWeekPanel | button button |  | Ver nas Análises | [app.js:11364](../app.js#L11364) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [app.js:11365](../app.js#L11365) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [app.js:11372](../app.js#L11372) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [app.js:11375](../app.js#L11375) |
| todayNextSteps | button button |  | Revisar | [app.js:11392](../app.js#L11392) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [app.js:11393](../app.js#L11393) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [app.js:11420](../app.js#L11420) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [app.js:11451](../app.js#L11451) |
| nextRow | button button |  | dinâmico: main | [app.js:11488](../app.js#L11488) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [app.js:11500](../app.js#L11500) |
| explainAction | button button |  | Fechar | [app.js:11514](../app.js#L11514) |
| renderReviews | button button |  | Como funcionam as revisões? | [app.js:11544](../app.js#L11544) |
| renderReviews | details  |  | dinâmico: h('summary',{text:'Explorar disciplinas'}) | [app.js:11556](../app.js#L11556) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [app.js:11574](../app.js#L11574) |
| drawReviewGroups | button button |  | Limpar busca | [app.js:11611](../app.js#L11611) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [app.js:11622](../app.js#L11622) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [app.js:11638](../app.js#L11638) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [app.js:11641](../app.js#L11641) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [app.js:11643](../app.js#L11643) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [app.js:11648](../app.js#L11648) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [app.js:11653](../app.js#L11653) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [app.js:11656](../app.js#L11656) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [app.js:11657](../app.js#L11657) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [app.js:11674](../app.js#L11674) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [app.js:11678](../app.js#L11678) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [app.js:11693](../app.js#L11693) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [app.js:11696](../app.js#L11696) |
| reviewGroupCard | button button |  | Escolher assuntos | [app.js:11697](../app.js#L11697) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [app.js:11721](../app.js#L11721) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [app.js:11725](../app.js#L11725) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [app.js:11792](../app.js#L11792) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [app.js:11804](../app.js#L11804) |
| openDisciplineReview | button button |  | Cancelar | [app.js:11826](../app.js#L11826) |
| openDisciplineReview | button button |  | Já revisei | [app.js:11827](../app.js#L11827) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [app.js:11833](../app.js#L11833) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [app.js:11872](../app.js#L11872) |
| startReview | button button |  | Cancelar | [app.js:11882](../app.js#L11882) |
| startReview | button button |  | Registrar sem cronômetro | [app.js:11884](../app.js#L11884) |
| startReview | button button |  | Começar revisão | [app.js:11886](../app.js#L11886) |
| openReviewOutcomeModal | input number | ro-min |  | [app.js:11899](../app.js#L11899) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [app.js:11907](../app.js#L11907) |
| openReviewOutcomeModal | button button |  | Cancelar | [app.js:11909](../app.js#L11909) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [app.js:11910](../app.js#L11910) |
| openReviewPrimer | button button |  | O que é revisão? | [app.js:11974](../app.js#L11974) |
| openReviewPrimer | button button |  | Por que não basta reler? | [app.js:11975](../app.js#L11975) |
| renderPlan | button button |  | Ir para Disciplinas | [app.js:12479](../app.js#L12479) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [app.js:12492](../app.js#L12492) |
| renderPlan | button button |  | Outro valor | [app.js:12493](../app.js#L12493) |
| renderPlan | button button |  | Para que serve o planejamento? | [app.js:12497](../app.js#L12497) |
| renderPlan | input number | plan-avail-h |  | [app.js:12507](../app.js#L12507) |
| renderPlan | input text | plan-name |  | [app.js:12515](../app.js#L12515) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [app.js:12521](../app.js#L12521) |
| renderPlan | button button |  | Sugerir automaticamente | [app.js:12529](../app.js#L12529) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [app.js:12571](../app.js#L12571) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [app.js:12575](../app.js#L12575) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [app.js:12578](../app.js#L12578) |
| renderPlan | button button |  | Salvar e usar nesta semana | [app.js:12594](../app.js#L12594) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [app.js:12595](../app.js#L12595) |
| openPlansDrawer | button button |  | Ativar | [app.js:12617](../app.js#L12617) |
| openPlansDrawer | button button |  | excluir | [app.js:12618](../app.js#L12618) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [app.js:12620](../app.js#L12620) |
| createSimplePlan | button button |  | Personalizar distribuição | [app.js:12653](../app.js#L12653) |
| createSimplePlan | button button |  | Usar esta sugestão | [app.js:12658](../app.js#L12658) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [app.js:12740](../app.js#L12740) |
| openNewPlanModal | input number | np-hours |  | [app.js:12741](../app.js#L12741) |
| openNewPlanModal | button button |  | Cancelar | [app.js:12750](../app.js#L12750) |
| openNewPlanModal | button button |  | Criar | [app.js:12751](../app.js#L12751) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [app.js:12848](../app.js#L12848) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [app.js:12855](../app.js#L12855) |
| planWeekHead | button button |  | Alterar meta | [app.js:12914](../app.js#L12914) |
| planWeekHead | button button |  | Personalizar distribuição | [app.js:12915](../app.js#L12915) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [app.js:12916](../app.js#L12916) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [app.js:12941](../app.js#L12941) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [app.js:12960](../app.js#L12960) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [app.js:12974](../app.js#L12974) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [app.js:12978](../app.js#L12978) |
| openWeekGoalModal | input checkbox | wg-redist |  | [app.js:12981](../app.js#L12981) |
| openWeekGoalModal | button button |  | Cancelar | [app.js:13000](../app.js#L13000) |
| openWeekGoalModal | button button |  | Salvar meta | [app.js:13001](../app.js#L13001) |
| planWeekNav | button button |  | Semana anterior | [app.js:13037](../app.js#L13037) |
| planWeekNav | button button |  | Próxima semana | [app.js:13039](../app.js#L13039) |
| planWeekNav | button button |  | Ir para esta semana | [app.js:13042](../app.js#L13042) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [app.js:13043](../app.js#L13043) |
| planWeekNotices | button button |  | Ajustar os blocos | [app.js:13087](../app.js#L13087) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [app.js:13088](../app.js#L13088) |
| planWeekNotices | button button |  | Manter assim | [app.js:13090](../app.js#L13090) |
| planTray | button button |  | dinâmico: icon('i-plus') | [app.js:13129](../app.js#L13129) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [app.js:13131](../app.js#L13131) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [app.js:13149](../app.js#L13149) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [app.js:13176](../app.js#L13176) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [app.js:13180](../app.js#L13180) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [app.js:13202](../app.js#L13202) |
| openSuggestionEditor | button button |  | Só nesta semana | [app.js:13203](../app.js#L13203) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [app.js:13204](../app.js#L13204) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [app.js:13219](../app.js#L13219) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [app.js:13225](../app.js#L13225) |
| openSuggestionPicker | button button |  | Cancelar | [app.js:13245](../app.js#L13245) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [app.js:13258](../app.js#L13258) |
| openWeekBlockPicker | input radio |  |  | [app.js:13269](../app.js#L13269) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [app.js:13281](../app.js#L13281) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [app.js:13287](../app.js#L13287) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [app.js:13296](../app.js#L13296) |
| openWeekBlockPicker | button button |  | Cancelar | [app.js:13301](../app.js#L13301) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [app.js:13302](../app.js#L13302) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [app.js:13400](../app.js#L13400) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [app.js:13431](../app.js#L13431) |
| planOffDays | button button |  | Personalizar dias | [app.js:13471](../app.js#L13471) |
| weekConflictDialog | button button |  | Ver a versão atual | [app.js:13485](../app.js#L13485) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [app.js:13486](../app.js#L13486) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [app.js:13603](../app.js#L13603) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [app.js:13606](../app.js#L13606) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [app.js:13610](../app.js#L13610) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [app.js:13620](../app.js#L13620) |
| openBlockEditor | button button |  | Salvar | [app.js:13642](../app.js#L13642) |
| openBlockEditor | button button |  | Tirar deste dia | [app.js:13665](../app.js#L13665) |
| openBlockEditor | button button |  | Cancelar | [app.js:13666](../app.js#L13666) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [app.js:13681](../app.js#L13681) |
| openMoveDialog | button button |  | Cancelar | [app.js:13690](../app.js#L13690) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [app.js:13701](../app.js#L13701) |
| openStudyDaysModal | button button |  | Cancelar | [app.js:13715](../app.js#L13715) |
| openStudyDaysModal | button button |  | Salvar | [app.js:13716](../app.js#L13716) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [app.js:13747](../app.js#L13747) |
| openAdjustBlocks | button button |  | Cancelar | [app.js:13762](../app.js#L13762) |
| openAdjustBlocks | button button |  | Salvar | [app.js:13763](../app.js#L13763) |
| openGoalUpdate | button button |  | Cancelar | [app.js:13796](../app.js#L13796) |
| openGoalUpdate | button button |  | Só nesta semana | [app.js:13797](../app.js#L13797) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [app.js:13798](../app.js#L13798) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [app.js:14057](../app.js#L14057) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [app.js:14118](../app.js#L14118) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [app.js:14427](../app.js#L14427) |
| contextSearch | button button |  | Limpar busca | [app.js:14429](../app.js#L14429) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [app.js:14457](../app.js#L14457) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [app.js:14467](../app.js#L14467) |
| collectionView | button button |  | Limpar busca | [app.js:14558](../app.js#L14558) |
| collectionView | button button |  | Mostrar todos | [app.js:14559](../app.js#L14559) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [app.js:15031](../app.js#L15031) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [app.js:15074](../app.js#L15074) |
| levelHead | button button |  | dinâmico: c.label | [app.js:15095](../app.js#L15095) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [app.js:15096](../app.js#L15096) |
| discRootLevel | button button |  | Adicionar uma disciplina | [app.js:15167](../app.js#L15167) |
| discRootLevel | button button |  | Como organizar meus estudos? | [app.js:15168](../app.js#L15168) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [app.js:15174](../app.js#L15174) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [app.js:15179](../app.js#L15179) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [app.js:15255](../app.js#L15255) |
| discAreaLevel | button button |  | Organizar em uma área | [app.js:15266](../app.js#L15266) |
| discAreaLevel | button button |  | Reativar | [app.js:15274](../app.js#L15274) |
| discAreaLevel | button button |  | Adicionar disciplina | [app.js:15293](../app.js#L15293) |
| discAreaLevel | button button |  | Agora não | [app.js:15294](../app.js#L15294) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [app.js:15304](../app.js#L15304) |
| discDisciplineLevel | button button |  | Reativar | [app.js:15333](../app.js#L15333) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [app.js:15334](../app.js#L15334) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [app.js:15335](../app.js#L15335) |
| discDisciplineLevel | button button |  | Editar | [app.js:15336](../app.js#L15336) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [app.js:15345](../app.js#L15345) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [app.js:15381](../app.js#L15381) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [app.js:15383](../app.js#L15383) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [app.js:15387](../app.js#L15387) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [app.js:15418](../app.js#L15418) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [app.js:15420](../app.js#L15420) |
| topicDetailContent | button button |  | Reativar tópico | [app.js:15468](../app.js#L15468) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [app.js:15471](../app.js#L15471) |
| topicDetailContent | button button |  | Revisar agora | [app.js:15472](../app.js#L15472) |
| topicDetailContent | button button |  | Editar | [app.js:15473](../app.js#L15473) |
| topicDetailContent | button button |  | abrir em Disciplinas | [app.js:15474](../app.js#L15474) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [app.js:15488](../app.js#L15488) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [app.js:15501](../app.js#L15501) |
| areaNudgeCard | button button |  | Organizar | [app.js:15570](../app.js#L15570) |
| areaNudgeCard | button button |  | Agora não | [app.js:15571](../app.js#L15571) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [app.js:15604](../app.js#L15604) |
| openAreaModal | input checkbox |  |  | [app.js:15612](../app.js#L15612) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [app.js:15627](../app.js#L15627) |
| openAreaModal | button button |  | Cancelar | [app.js:15675](../app.js#L15675) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [app.js:15765](../app.js#L15765) |
| openDisciplineModal | select  | dm-area |  | [app.js:15770](../app.js#L15770) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [app.js:15775](../app.js#L15775) |
| openDisciplineModal | select  | dm-nature |  | [app.js:15797](../app.js#L15797) |
| openDisciplineModal | select  | dm-strategy |  | [app.js:15801](../app.js#L15801) |
| openDisciplineModal | select  | dm-method |  | [app.js:15807](../app.js#L15807) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [app.js:15813](../app.js#L15813) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [app.js:15835](../app.js#L15835) |
| openDisciplineModal | button button |  | Cancelar | [app.js:15892](../app.js#L15892) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [app.js:15894](../app.js#L15894) |
| openDisciplineModal | button button |  | excluir definitivamente | [app.js:15896](../app.js#L15896) |
| topicReviewOptions | select  | tm-strategy |  | [app.js:16015](../app.js#L16015) |
| topicReviewOptions | select  | tm-method |  | [app.js:16020](../app.js#L16020) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [app.js:16025](../app.js#L16025) |
| reviewToggle | input checkbox | tm-review |  | [app.js:16036](../app.js#L16036) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [app.js:16081](../app.js#L16081) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [app.js:16125](../app.js#L16125) |
| showTwin | button button |  | Usar este tópico | [app.js:16142](../app.js#L16142) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [app.js:16147](../app.js#L16147) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [app.js:16148](../app.js#L16148) |
| topicEditor | button button |  | dinâmico: saveLabel | [app.js:16229](../app.js#L16229) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [app.js:16231](../app.js#L16231) |
| topicEditor | button button |  | Arquivar | [app.js:16235](../app.js#L16235) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [app.js:16268](../app.js#L16268) |
| openBulkTopicModal | button button |  | Cancelar | [app.js:16281](../app.js#L16281) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [app.js:16282](../app.js#L16282) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [app.js:16322](../app.js#L16322) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [app.js:16327](../app.js#L16327) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [app.js:16328](../app.js#L16328) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [app.js:16331](../app.js#L16331) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [app.js:16333](../app.js#L16333) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [app.js:16369](../app.js#L16369) |
| openDeadlineDrawer | button button |  | Reabrir | [app.js:16465](../app.js#L16465) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [app.js:16466](../app.js#L16466) |
| openDeadlineDrawer | button button |  | Editar | [app.js:16467](../app.js#L16467) |
| openDeadlineDrawer | button button |  | Ver tópico | [app.js:16468](../app.js#L16468) |
| openDeadlineDrawer | button button |  | excluir | [app.js:16469](../app.js#L16469) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [app.js:16484](../app.js#L16484) |
| openDeadlineModal | input date | dl-date |  | [app.js:16485](../app.js#L16485) |
| openDeadlineModal | input date | dl-start |  | [app.js:16487](../app.js#L16487) |
| openDeadlineModal | button button |  | dinâmico: t.label | [app.js:16493](../app.js#L16493) |
| openDeadlineModal | select  | dl-disc |  | [app.js:16505](../app.js#L16505) |
| openDeadlineModal | select  | dl-topic |  | [app.js:16513](../app.js#L16513) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [app.js:16531](../app.js#L16531) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [app.js:16533](../app.js#L16533) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [app.js:16551](../app.js#L16551) |
| openDeadlineModal | button button |  | Cancelar | [app.js:16563](../app.js#L16563) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [app.js:16564](../app.js#L16564) |
| openDeadlineModal | button button |  | excluir | [app.js:16602](../app.js#L16602) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [app.js:17036](../app.js#L17036) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [app.js:17045](../app.js#L17045) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [app.js:17061](../app.js#L17061) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [app.js:17095](../app.js#L17095) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [app.js:17115](../app.js#L17115) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [app.js:17144](../app.js#L17144) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [app.js:17172](../app.js#L17172) |
| analyticsCustomBuilder | button button |  | Cancelar | [app.js:17189](../app.js#L17189) |
| analyticsCustomBuilder | button button |  | Gerar análise | [app.js:17190](../app.js#L17190) |
| analyticsTypeFilter | button button |  | Todos os tipos | [app.js:17198](../app.js#L17198) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [app.js:17202](../app.js#L17202) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [app.js:17287](../app.js#L17287) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [app.js:17295](../app.js#L17295) |
| scopePicker | button button |  | limpar | [app.js:17297](../app.js#L17297) |
| scopePicker | input search |  | dinâmico: labels[kind] | [app.js:17330](../app.js#L17330) |
| saveCurrentAnalysis | input text | sa-name |  | [app.js:17354](../app.js#L17354) |
| saveCurrentAnalysis | button button |  | Cancelar | [app.js:17369](../app.js#L17369) |
| saveCurrentAnalysis | button button |  | Salvar | [app.js:17370](../app.js#L17370) |
| renameSavedAnalysis | input text | sa-rename |  | [app.js:17379](../app.js#L17379) |
| renameSavedAnalysis | button button |  | Cancelar | [app.js:17389](../app.js#L17389) |
| renameSavedAnalysis | button button |  | Salvar | [app.js:17389](../app.js#L17389) |
| rangePicker | button button |  | Mês anterior | [app.js:17426](../app.js#L17426) |
| rangePicker | button button |  | Próximo mês | [app.js:17428](../app.js#L17428) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [app.js:17446](../app.js#L17446) |
| rangePicker | input date | an-rs |  | [app.js:17469](../app.js#L17469) |
| rangePicker | input date | an-re |  | [app.js:17470](../app.js#L17470) |
| rangePicker | button button |  | limpar datas | [app.js:17488](../app.js#L17488) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [app.js:17617](../app.js#L17617) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [app.js:17660](../app.js#L17660) |
| analyticsPanorama | button button |  | Personalizar análise | [app.js:17669](../app.js#L17669) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [app.js:17676](../app.js#L17676) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [app.js:17701](../app.js#L17701) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [app.js:17714](../app.js#L17714) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [app.js:17716](../app.js#L17716) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [app.js:17721](../app.js#L17721) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [app.js:17724](../app.js#L17724) |
| analyticsResultHeader | button button |  | limpar | [app.js:17735](../app.js#L17735) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [app.js:17738](../app.js#L17738) |
| analyticsResultHeader | button button |  | Alterar análise | [app.js:17739](../app.js#L17739) |
| analyticsEmptyFor | button button |  | Registrar estudo | [app.js:17758](../app.js#L17758) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [app.js:17775](../app.js#L17775) |
| analyticsEmptyFor | button button |  | Registrar estudo | [app.js:17788](../app.js#L17788) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [app.js:17792](../app.js#L17792) |
| analyticsEmptyFor | button button |  | Escolher outro período | [app.js:17807](../app.js#L17807) |
| analyticsEmptyFor | button button |  | dinâmico: label | [app.js:17808](../app.js#L17808) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [app.js:17852](../app.js#L17852) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [app.js:17908](../app.js#L17908) |
| milestonesViz | button button |  | ver o estudo | [app.js:17927](../app.js#L17927) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [app.js:18224](../app.js#L18224) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [app.js:18432](../app.js#L18432) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [app.js:18498](../app.js#L18498) |
| dueReviewsViz | button button |  | Revisar | [app.js:18502](../app.js#L18502) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [app.js:18558](../app.js#L18558) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [app.js:18628](../app.js#L18628) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [app.js:18715](../app.js#L18715) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [app.js:18765](../app.js#L18765) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [app.js:18784](../app.js#L18784) |
| menuButton | button button |  | dinâmico: it.label | [app.js:18794](../app.js#L18794) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [app.js:18820](../app.js#L18820) |
| analyticsAttentionCard | button button |  | Abrir revisões | [app.js:18826](../app.js#L18826) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [app.js:18835](../app.js#L18835) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [app.js:18858](../app.js#L18858) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [app.js:18949](../app.js#L18949) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [app.js:18958](../app.js#L18958) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [app.js:18983](../app.js#L18983) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [app.js:18986](../app.js#L18986) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [app.js:19035](../app.js#L19035) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [app.js:19056](../app.js#L19056) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [app.js:19079](../app.js#L19079) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [app.js:19105](../app.js#L19105) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [app.js:19106](../app.js#L19106) |
| analyticsCalendarCard | button button |  | Analisar este período | [app.js:19118](../app.js#L19118) |
| analyticsCalendarCard | button button |  | Cancelar | [app.js:19122](../app.js#L19122) |
| calendarHeatmap | button button |  | Mês anterior | [app.js:19138](../app.js#L19138) |
| calendarHeatmap | button button |  | Próximo mês | [app.js:19140](../app.js#L19140) |
| calendarHeatmap | button button |  | mês atual | [app.js:19141](../app.js#L19141) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [app.js:19186](../app.js#L19186) |
| openDayDrawer | button button |  | Editar este estudo | [app.js:19283](../app.js#L19283) |
| openDayDrawer | button button |  | Analisar este dia | [app.js:19295](../app.js#L19295) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [app.js:19300](../app.js#L19300) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [app.js:19343](../app.js#L19343) |
| openBucketDrawer | button button |  | Analisar este período | [app.js:19393](../app.js#L19393) |
| analyticsDistributionCard | button button |  | dinâmico: l | [app.js:19415](../app.js#L19415) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [app.js:19480](../app.js#L19480) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [app.js:19481](../app.js#L19481) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [app.js:19516](../app.js#L19516) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [app.js:19563](../app.js#L19563) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [app.js:19568](../app.js#L19568) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [app.js:19620](../app.js#L19620) |
| weeklyReportCard | button button |  | Semana anterior | [app.js:19686](../app.js#L19686) |
| weeklyReportCard | button button |  | Próxima semana | [app.js:19688](../app.js#L19688) |
| copySummary | textarea  |  | Resumo do período | [app.js:19995](../app.js#L19995) |
| copySummary | button button |  | Fechar | [app.js:19996](../app.js#L19996) |
| historyDiscoveries | button button |  | dinâmico: a.label | [app.js:20170](../app.js#L20170) |
| historyDiscoveries | button button |  | Ver registros usados | [app.js:20171](../app.js#L20171) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [app.js:20174](../app.js#L20174) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [app.js:20190](../app.js#L20190) |
| renderHistory | button button |  | Registrar estudo | [app.js:20191](../app.js#L20191) |
| renderHistory | button button |  | Filtros | [app.js:20202](../app.js#L20202) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [app.js:20209](../app.js#L20209) |
| renderHistory | button button |  | limpar tudo | [app.js:20211](../app.js#L20211) |
| openHistoryFilters | button button |  | Aplicar filtros | [app.js:20270](../app.js#L20270) |
| openHistoryFilters | button button |  | Limpar | [app.js:20273](../app.js#L20273) |
| renderHistoryTable | button button |  | Limpar busca | [app.js:20340](../app.js#L20340) |
| renderHistoryTable | button button |  | dinâmico: label | [app.js:20368](../app.js#L20368) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [app.js:20380](../app.js#L20380) |
| openEditSessionModal | button button |  | remover estudo | [app.js:20549](../app.js#L20549) |
| openEditSessionModal | button button |  | Cancelar | [app.js:20555](../app.js#L20555) |
| openEditSessionModal | button button |  | Salvar | [app.js:20556](../app.js#L20556) |
| confirmLongEdit | button button |  | Voltar e corrigir | [app.js:20624](../app.js#L20624) |
| confirmLongEdit | button button |  | Está certo, salvar | [app.js:20625](../app.js#L20625) |
| openAIReportModal | textarea  |  | Texto do prompt | [app.js:20770](../app.js#L20770) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [app.js:20771](../app.js#L20771) |
| openAIReportModal | button button |  | dinâmico: x.label | [app.js:20796](../app.js#L20796) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [app.js:20810](../app.js#L20810) |
| openAIReportModal | input checkbox | air-comments |  | [app.js:20818](../app.js#L20818) |
| openAIReportModal | button button |  | dinâmico: retry.label | [app.js:20873](../app.js#L20873) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [app.js:20881](../app.js#L20881) |
| openAIReportModal | button button |  | Só baixar o CSV | [app.js:20887](../app.js#L20887) |
| openAIReportModal | button button |  | Só copiar o prompt | [app.js:20888](../app.js#L20888) |
| openAIReportModal | button button |  | Fechar | [app.js:20898](../app.js#L20898) |
| runIntegrityCheck | button button |  | Fechar | [app.js:20930](../app.js#L20930) |
| renderData | input file | import-file |  | [app.js:20942](../app.js#L20942) |
| renderData | button button |  | dinâmico: icon('i-data') | [app.js:20955](../app.js#L20955) |
| renderData | button button |  | Onde meus dados ficam? | [app.js:20959](../app.js#L20959) |
| renderData | button button |  | Preparar | [app.js:20975](../app.js#L20975) |
| renderData | button button |  | Exportar | [app.js:20980](../app.js#L20980) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [app.js:20981](../app.js#L20981) |
| renderData | button button |  | Verificar | [app.js:20998](../app.js#L20998) |
| renderData | button button |  | Pedir ao navegador | [app.js:21003](../app.js#L21003) |
| renderData | button button |  | apagar cópia antiga da V2 | [app.js:21048](../app.js#L21048) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [app.js:21055](../app.js#L21055) |
| renderData | button button |  | Apagar todos os dados | [app.js:21059](../app.js#L21059) |
| restoreRefused | button button |  | Entendi | [app.js:21096](../app.js#L21096) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [app.js:21122](../app.js#L21122) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [app.js:21123](../app.js#L21123) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [app.js:21124](../app.js#L21124) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [app.js:21161](../app.js#L21161) |
| openRestorePreview | button button |  | Cancelar | [app.js:21198](../app.js#L21198) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [app.js:21209](../app.js#L21209) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [app.js:21212](../app.js#L21212) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [app.js:21217](../app.js#L21217) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [app.js:21290](../app.js#L21290) |
| bindEvents | button button |  | Fechar | [app.js:21292](../app.js#L21292) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [app.js:21925](../app.js#L21925) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [app.js:21984](../app.js#L21984) |
| GlossaryPopover | button button |  | Fechar explicação | [app.js:21987](../app.js#L21987) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [app.js:22042](../app.js#L22042) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [app.js:22263](../app.js#L22263) |
| FocusMode | button button |  | dinâmico: a.label | [app.js:22427](../app.js#L22427) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [app.js:22628](../app.js#L22628) |
| pickDisciplineThen | button button |  | Cancelar | [app.js:22630](../app.js#L22630) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [app.js:22710](../app.js#L22710) |
| renderReturnPill | button button |  | Fechar este atalho | [app.js:22712](../app.js#L22712) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [app.js:22734](../app.js#L22734) |
| pickDisciplineForPriority | button button |  | Cancelar | [app.js:22737](../app.js#L22737) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [app.js:22773](../app.js#L22773) |
| helpBreadcrumb | button button |  | dinâmico: label | [app.js:22816](../app.js#L22816) |
| articleBody | button button |  | dinâmico: x.label | [app.js:22869](../app.js#L22869) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [app.js:22882](../app.js#L22882) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [app.js:22896](../app.js#L22896) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [app.js:22906](../app.js#L22906) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [app.js:22918](../app.js#L22918) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [app.js:22933](../app.js#L22933) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [app.js:22936](../app.js#L22936) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [app.js:22955](../app.js#L22955) |
| helpSearchCard | button button |  | Limpar busca | [app.js:22990](../app.js#L22990) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [app.js:23000](../app.js#L23000) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [app.js:23085](../app.js#L23085) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [app.js:23099](../app.js#L23099) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [app.js:23116](../app.js#L23116) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [app.js:23128](../app.js#L23128) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [app.js:23174](../app.js#L23174) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [app.js:23184](../app.js#L23184) |
| helpHomePanel | button button |  | Rever a apresentação | [app.js:23200](../app.js#L23200) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [app.js:23201](../app.js#L23201) |
| helpHomePanel | button button |  | Ver o guia | [app.js:23202](../app.js#L23202) |
| helpHomePanel | button button |  | Ver todas | [app.js:23209](../app.js#L23209) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [app.js:23216](../app.js#L23216) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [app.js:23218](../app.js#L23218) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [app.js:23220](../app.js#L23220) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [app.js:23222](../app.js#L23222) |
| helpSectionPanel | button button |  | dinâmico: x.label | [app.js:23236](../app.js#L23236) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [app.js:23259](../app.js#L23259) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [app.js:23296](../app.js#L23296) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [app.js:23337](../app.js#L23337) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [app.js:23379](../app.js#L23379) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [app.js:23476](../app.js#L23476) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [app.js:23503](../app.js#L23503) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [app.js:23506](../app.js#L23506) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [app.js:23510](../app.js#L23510) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [app.js:23544](../app.js#L23544) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [app.js:23584](../app.js#L23584) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [app.js:23599](../app.js#L23599) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [app.js:23600](../app.js#L23600) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [app.js:23623](../app.js#L23623) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [app.js:23627](../app.js#L23627) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [app.js:23634](../app.js#L23634) |
| renderTips | button button |  | Entendi | [app.js:23666](../app.js#L23666) |
| toastRich | button button |  | dinâmico: a.label | [app.js:23690](../app.js#L23690) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [app.js:23857](../app.js#L23857) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [app.js:23888](../app.js#L23888) |
| maybeShowWhatsNew | button button |  | Continuar | [app.js:23891](../app.js#L23891) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [app.js:23944](../app.js#L23944) |
| stepQuick | input text | ob-name | Ex.: Português | [app.js:23959](../app.js#L23959) |
| stepQuick | button button |  | dinâmico: ex | [app.js:23963](../app.js#L23963) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [app.js:23974](../app.js#L23974) |
| stepWhat | button button |  | dinâmico: p.label | [app.js:23978](../app.js#L23978) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [app.js:23984](../app.js#L23984) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [app.js:23990](../app.js#L23990) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [app.js:23999](../app.js#L23999) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [app.js:24007](../app.js#L24007) |
| stepGoal | input date | ob-goal-d |  | [app.js:24009](../app.js#L24009) |
| stepGoal | select  | ob-goal-disc |  | [app.js:24011](../app.js#L24011) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [app.js:24026](../app.js#L24026) |
| stepTime | input number | ob-hours | Outro | [app.js:24035](../app.js#L24035) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [app.js:24038](../app.js#L24038) |
| buildActions | button button |  | Voltar | [app.js:24094](../app.js#L24094) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [app.js:24097](../app.js#L24097) |
| buildActions | button button |  | Criar e continuar | [app.js:24101](../app.js#L24101) |
| buildActions | button button |  | Continuar | [app.js:24103](../app.js#L24103) |
| buildActions | button button |  | Continuar | [app.js:24109](../app.js#L24109) |
| buildActions | button button |  | Continuar | [app.js:24117](../app.js#L24117) |
| buildActions | button button |  | Criar e começar | [app.js:24122](../app.js#L24122) |
| guideNote | button button |  | dinâmico: a.label | [app.js:24282](../app.js#L24282) |
| guideNote | button button |  | Agora não | [app.js:24284](../app.js#L24284) |
| startGuideCard | button button |  | ocultar | [app.js:24318](../app.js#L24318) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [app.js:24334](../app.js#L24334) |
| reviewDemoNode | button button |  | dinâmico: o.label | [app.js:24363](../app.js#L24363) |
| structureDemoNode | button button |  | dinâmico: ex.label | [app.js:24392](../app.js#L24392) |
| openFirstReviewIntro | button button |  | Agora não | [app.js:24450](../app.js#L24450) |
| openFirstReviewIntro | button button |  | Começar | [app.js:24453](../app.js#L24453) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [app.js:24498](../app.js#L24498) |
| segmented | button button |  | dinâmico: o.label | [app.js:24543](../app.js#L24543) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [app.js:24556](../app.js#L24556) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [app.js:24567](../app.js#L24567) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [app.js:24573](../app.js#L24573) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [app.js:24606](../app.js#L24606) |
| renderSettings | button button |  | Rever a apresentação | [app.js:24639](../app.js#L24639) |
| renderSettings | button button |  | Mostrar novamente | [app.js:24641](../app.js#L24641) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [app.js:24655](../app.js#L24655) |
| renderSettings | button button |  | Mostrar todas de novo | [app.js:24695](../app.js#L24695) |
| renderSettings | button button |  | Como funcionam as revisões? | [app.js:24700](../app.js#L24700) |
| renderSettings | button button |  | Ver | [app.js:24720](../app.js#L24720) |
| renderSettings | button button |  | Fazer backup agora | [app.js:24732](../app.js#L24732) |
| renderSettings | button button |  | Abrir tela Dados | [app.js:24734](../app.js#L24734) |
| renderSettings | button button |  | Onde meus dados ficam? | [app.js:24735](../app.js#L24735) |
| renderSettings | button button |  | Preparar | [app.js:24737](../app.js#L24737) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [app.js:24753](../app.js#L24753) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [app.js:24754](../app.js#L24754) |
| renderSettings | button button |  | Central de Ajuda | [app.js:24755](../app.js#L24755) |
| renderSettings | button button |  | Novidades desta versão | [app.js:24756](../app.js#L24756) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [app.js:24774](../app.js#L24774) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [app.js:24805](../app.js#L24805) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [app.js:24813](../app.js#L24813) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [app.js:24879](../app.js#L24879) |
| renderDeadlineSuggestions | button button |  | Manter atual | [app.js:24887](../app.js#L24887) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [app.js:24910](../app.js#L24910) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [app.js:24915](../app.js#L24915) |
| fcButton | button button |  | dinâmico: text | [flashcards.js:350](../flashcards.js#L350) |
| fcSelect | select  | dinâmico: id | dinâmico: options.map(([v,t])=>h('option',{value:v,text:t})) | [flashcards.js:353](../flashcards.js#L353) |
| flashcardToolbar | button button |  | dinâmico: label | [flashcards.js:359](../flashcards.js#L359) |
| renderFlashcardLibrary | input search |  | Buscar conteúdo, idioma ou conjunto… | [flashcards.js:368](../flashcards.js#L368) |
| renderFlashcardLibrary | details  |  | dinâmico: h('summary',{text:'Outras sessões interrompidas'}) | [flashcards.js:399](../flashcards.js#L399) |
| renderFlashcardLibrary | details  |  | dinâmico: h('summary',{text:'Conjuntos e modelos salvos'}) | [flashcards.js:401](../flashcards.js#L401) |
| openFlashcardTypePicker | button button |  | dinâmico: h('strong',{text:t.name}) | [flashcards.js:409](../flashcards.js#L409) |
| preview | details  |  | dinâmico: h('summary',{text:'Mostrar resposta da prévia'}) | [flashcards.js:451](../flashcards.js#L451) |
| openFlashcardEditor | input text |  | Ex.: Meu vocabulário de inglês | [flashcards.js:458](../flashcards.js#L458) |
| openFlashcardEditor | input checkbox |  |  | [flashcards.js:459](../flashcards.js#L459) |
| openFlashcardEditor | input checkbox |  |  | [flashcards.js:459](../flashcards.js#L459) |
| openFlashcardEditor | input checkbox |  |  | [flashcards.js:460](../flashcards.js#L460) |
| openFlashcardEditor | details  |  | dinâmico: h('summary',{text:'Salvar preferências como modelo'}) | [flashcards.js:461](../flashcards.js#L461) |
| openFlashcardEditor | details  |  | dinâmico: h('summary',{text:'Dica, exemplos e outros campos (opcionais)'}) | [flashcards.js:482](../flashcards.js#L482) |
| openFlashcardEditor | details  |  | dinâmico: h('summary',{text:'Prévia do cartão'}) | [flashcards.js:483](../flashcards.js#L483) |
| openFlashcardSetEditor | input text |  |  | [flashcards.js:489](../flashcards.js#L489) |
| openFlashcardSetEditor | input checkbox |  |  | [flashcards.js:491](../flashcards.js#L491) |
| openFlashcardSetEditor | input checkbox |  |  | [flashcards.js:491](../flashcards.js#L491) |
| openFlashcardTemplateManager | input text |  |  | [flashcards.js:508](../flashcards.js#L508) |
| openFlashcardStudyOptions | input number |  |  | [flashcards.js:545](../flashcards.js#L545) |
| openFlashcardStudyOptions | input number |  |  | [flashcards.js:545](../flashcards.js#L545) |
| openFlashcardStudyOptions | input checkbox |  |  | [flashcards.js:545](../flashcards.js#L545) |
| openFlashcardPlayer | details  |  | dinâmico: h('summary',{text:note.type==='problem'?'Ver resolução passo a passo':'Ver explicação'}) | [flashcards.js:606](../flashcards.js#L606) |
| openFlashcardPlayer | details  |  | dinâmico: h('summary',{text:'Mostrar dica'}) | [flashcards.js:618](../flashcards.js#L618) |
| openFlashcardResult | input number |  |  | [flashcards.js:642](../flashcards.js#L642) |
| flashcardSessionDetail | details  |  | dinâmico: h('summary',{text:plural(events.length,'cartão respondido','cartões respondidos')+' neste estudo'}) | [flashcards.js:657](../flashcards.js#L657) |
| flashcardSessionDetail | button button |  | dinâmico: e.disciplineName+' · '+(e.direction==='reverse'?'Inversa':'Direta')+' · '+FLASHCARD_RATINGS.find(r=> | [flashcards.js:660](../flashcards.js#L660) |
| flashcardStatsPanel | details  |  | dinâmico: h('summary',{text:'Respostas de flashcards'+(options.from?' no período':' · todo o histórico')}) | [flashcards.js:665](../flashcards.js#L665) |
| openFlashcardPrimer | details  |  | dinâmico: h('summary',{text:'Referências e limites'}) | [flashcards.js:681](../flashcards.js#L681) |
| openGuidedReviewBuilder | input number |  |  | [reviews.js:109](../reviews.js#L109) |
| openGuidedReviewBuilder | input number |  |  | [reviews.js:126](../reviews.js#L126) |
| openGuidedReviewBuilder | button button |  | dinâmico: v+' min' | [reviews.js:137](../reviews.js#L137) |
| openGuidedReviewBuilder | details  |  | dinâmico: h('summary',{text:'Escolher disciplinas'}) | [reviews.js:138](../reviews.js#L138) |
| openGuidedReviewBuilder | input checkbox |  |  | [reviews.js:139](../reviews.js#L139) |
| openGuidedReviewResult | input number |  |  | [reviews.js:206](../reviews.js#L206) |
| reviewsRecentHistory | details  |  | dinâmico: h('summary',{text:'Histórico recente de revisões'}) | [reviews.js:220](../reviews.js#L220) |
| reviewsRecentHistory | button button |  | dinâmico: h('span',{class:'line-t',text:SessionModel.title(s)}) | [reviews.js:221](../reviews.js#L221) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [app.js:6094](../app.js#L6094) |
| confirmModal | openModal | [app.js:6867](../app.js#L6867) |
| openRegisterModal | openModal | [app.js:9828](../app.js#L9828) |
| confirmLong | close.push | [app.js:9984](../app.js#L9984) |
| openFinishModal | openModal | [app.js:10154](../app.js#L10154) |
| offerStaleSession | openModal | [app.js:10373](../app.js#L10373) |
| openAlternatives | Drawer.open | [app.js:11502](../app.js#L11502) |
| explainAction | openModal | [app.js:11506](../app.js#L11506) |
| openDisciplineReview | openModal | [app.js:11788](../app.js#L11788) |
| startReview | openModal | [app.js:11853](../app.js#L11853) |
| openReviewOutcomeModal | openModal | [app.js:11898](../app.js#L11898) |
| openReviewPrimer | Drawer.open | [app.js:11977](../app.js#L11977) |
| openPlansDrawer | Drawer.open | [app.js:12621](../app.js#L12621) |
| createSimplePlan | openModal | [app.js:12639](../app.js#L12639) |
| openNewPlanModal | openModal | [app.js:12739](../app.js#L12739) |
| openWeekGoalModal | openModal | [app.js:12972](../app.js#L12972) |
| openSuggestionEditor | openModal | [app.js:13174](../app.js#L13174) |
| openSuggestionPicker | openModal | [app.js:13218](../app.js#L13218) |
| openWeekBlockPicker | openModal | [app.js:13257](../app.js#L13257) |
| weekConflictDialog | close.push | [app.js:13489](../app.js#L13489) |
| weekConflictDialog | openModal | [app.js:13490](../app.js#L13490) |
| openBlockEditor | openModal | [app.js:13602](../app.js#L13602) |
| openMoveDialog | openModal | [app.js:13678](../app.js#L13678) |
| openStudyDaysModal | openModal | [app.js:13699](../app.js#L13699) |
| openAdjustBlocks | openModal | [app.js:13736](../app.js#L13736) |
| openGoalUpdate | openModal | [app.js:13784](../app.js#L13784) |
| openTopicDrawer | Drawer.open | [app.js:15535](../app.js#L15535) |
| openAreaModal | openModal | [app.js:15603](../app.js#L15603) |
| openDisciplineModal | openModal | [app.js:15764](../app.js#L15764) |
| openTopicModal | openModal | [app.js:16256](../app.js#L16256) |
| openBulkTopicModal | openModal | [app.js:16267](../app.js#L16267) |
| openDeadlineDrawer | Drawer.open | [app.js:16470](../app.js#L16470) |
| openDeadlineModal | openModal | [app.js:16477](../app.js#L16477) |
| saveCurrentAnalysis | openModal | [app.js:17353](../app.js#L17353) |
| renameSavedAnalysis | openModal | [app.js:17378](../app.js#L17378) |
| openAnalyticsDrawer | Drawer.open | [app.js:19096](../app.js#L19096) |
| openDayDrawer | Drawer.open | [app.js:19301](../app.js#L19301) |
| openBucketDrawer | Drawer.open | [app.js:19396](../app.js#L19396) |
| openDistributionDrawer | Drawer.open | [app.js:19482](../app.js#L19482) |
| copySummary | openModal | [app.js:19991](../app.js#L19991) |
| openHistoryFilters | Drawer.open | [app.js:20274](../app.js#L20274) |
| openEditSessionModal | openModal | [app.js:20435](../app.js#L20435) |
| confirmLongEdit | close.push | [app.js:20620](../app.js#L20620) |
| openAIReportModal | openModal | [app.js:20767](../app.js#L20767) |
| runIntegrityCheck | openModal | [app.js:20918](../app.js#L20918) |
| restoreRefused | openModal | [app.js:21091](../app.js#L21091) |
| askTimerBeforeRestore | openModal | [app.js:21116](../app.js#L21116) |
| openRestorePreview | openModal | [app.js:21159](../app.js#L21159) |
| bindEvents | openModal | [app.js:21286](../app.js#L21286) |
| openHelpArticle | Drawer.open | [app.js:22555](../app.js#L22555) |
| pickDisciplineThen | openModal | [app.js:22625](../app.js#L22625) |
| pickDisciplineForPriority | openModal | [app.js:22730](../app.js#L22730) |
| openContactDrawer | Drawer.open | [app.js:23511](../app.js#L23511) |
| openReportProblemDrawer | Drawer.open | [app.js:23603](../app.js#L23603) |
| openScreenHelp | Drawer.open | [app.js:23637](../app.js#L23637) |
| maybeShowWhatsNew | openModal | [app.js:23880](../app.js#L23880) |
| openWelcome | openModal | [app.js:23937](../app.js#L23937) |
| openFirstReviewIntro | openModal | [app.js:24441](../app.js#L24441) |
| openChangelog | Drawer.open | [app.js:24817](../app.js#L24817) |
| openFlashcardTypePicker | openModal | [flashcards.js:409](../flashcards.js#L409) |
| openFlashcardEditor | openModal | [flashcards.js:419](../flashcards.js#L419) |
| openFlashcardEditor | close.push | [flashcards.js:472](../flashcards.js#L472) |
| openFlashcardSetEditor | openModal | [flashcards.js:488](../flashcards.js#L488) |
| openFlashcardTemplateManager | openModal | [flashcards.js:507](../flashcards.js#L507) |
| openFlashcardNoteDetail | openModal | [flashcards.js:522](../flashcards.js#L522) |
| openFlashcardStudyOptions | openModal | [flashcards.js:539](../flashcards.js#L539) |
| openFlashcardPlayer | openModal | [flashcards.js:579](../flashcards.js#L579) |
| openFlashcardResult | openModal | [flashcards.js:641](../flashcards.js#L641) |
| openFlashcardPrimer | openModal | [flashcards.js:672](../flashcards.js#L672) |
| openFreeReview | openModal | [reviews.js:92](../reviews.js#L92) |
| openGuidedReviewBuilder | openModal | [reviews.js:107](../reviews.js#L107) |
| openGuidedReviewPlayer | openModal | [reviews.js:159](../reviews.js#L159) |
| openGuidedReviewResult | openModal | [reviews.js:205](../reviews.js#L205) |

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
