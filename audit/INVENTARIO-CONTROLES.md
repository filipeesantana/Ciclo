# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fonte: app.js. 567 construções de controles, 60 construções de camadas e 719 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6062](../app.js#L6062) |
| askConflict | button button |  | Descartar a minha edição | [6063](../app.js#L6063) |
| askConflict | button button |  | Manter a minha edição | [6064](../app.js#L6064) |
| DataSync | button button |  | Atualizar | [6354](../app.js#L6354) |
| DataSync | button button |  | Continuar editando | [6356](../app.js#L6356) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6833](../app.js#L6833) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6834](../app.js#L6834) |
| selectField | select  | dinâmico: id |  | [7285](../app.js#L7285) |
| pillGroup | button button |  | dinâmico: it.label | [7298](../app.js#L7298) |
| renderTimerBar | button button |  | dinâmico: a.label | [7631](../app.js#L7631) |
| renderTimerBar | button button |  | Foco | [7633](../app.js#L7633) |
| renderTimerBar | button button |  | descartar | [7634](../app.js#L7634) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7823](../app.js#L7823) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7825](../app.js#L7825) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [8018](../app.js#L8018) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [8021](../app.js#L8021) |
| topicMultiPicker | button button |  | Pronto | [8027](../app.js#L8027) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [8042](../app.js#L8042) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8332](../app.js#L8332) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8350](../app.js#L8350) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8387](../app.js#L8387) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8388](../app.js#L8388) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8541](../app.js#L8541) |
| topicSplitField | button button |  |  | [8605](../app.js#L8605) |
| topicSplitField | button button |  | Não dividir | [8609](../app.js#L8609) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8628](../app.js#L8628) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8816](../app.js#L8816) |
| commentField | textarea  | dinâmico: o.id |  | [8866](../app.js#L8866) |
| commentField | button button |  | + Adicionar comentário | [8869](../app.js#L8869) |
| commentField | button button |  | Remover o comentário | [8870](../app.js#L8870) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8953](../app.js#L8953) |
| resultsField | button button |  | Recolher | [8958](../app.js#L8958) |
| resultsField | button button |  | + Adicionar resultado | [8961](../app.js#L8961) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [8988](../app.js#L8988) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [8990](../app.js#L8990) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [9004](../app.js#L9004) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [9005](../app.js#L9005) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [9006](../app.js#L9006) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9045](../app.js#L9045) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9059](../app.js#L9059) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9061](../app.js#L9061) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9164](../app.js#L9164) |
| breaksEditor | button button |  | dinâmico: addLabel | [9302](../app.js#L9302) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9324](../app.js#L9324) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9337](../app.js#L9337) |
| FormDraft | button button |  | Começar do zero | [9516](../app.js#L9516) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9538](../app.js#L9538) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9543](../app.js#L9543) |
| studyWhenFields | button button |  |  | [9549](../app.js#L9549) |
| studyWhenFields | button button |  |  | [9551](../app.js#L9551) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9555](../app.js#L9555) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9794](../app.js#L9794) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9818](../app.js#L9818) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9830](../app.js#L9830) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9837](../app.js#L9837) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9851](../app.js#L9851) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9863](../app.js#L9863) |
| confirmLong | button button |  | Corrigir | [9937](../app.js#L9937) |
| confirmLong | button button |  | Sim, registrar | [9952](../app.js#L9952) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9959](../app.js#L9959) |
| openRegisterModal | button button |  | Cancelar | [10054](../app.js#L10054) |
| openFinishModal | input number | fin-min |  | [10117](../app.js#L10117) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10162](../app.js#L10162) |
| renderOutcome | select  | fin-method |  | [10196](../app.js#L10196) |
| openFinishModal | button button |  | Registrar estudo | [10238](../app.js#L10238) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10314](../app.js#L10314) |
| offerStaleSession | button button |  | Continuar | [10341](../app.js#L10341) |
| offerStaleSession | button button |  | Descartar | [10342](../app.js#L10342) |
| offerStaleSession | button button |  | Finalizar | [10343](../app.js#L10343) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11185](../app.js#L11185) |
| renderToday | button button |  | Quero ajuda para organizar | [11186](../app.js#L11186) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11231](../app.js#L11231) |
| todayAction | button button |  | dinâmico: icon('i-check') | [11249](../app.js#L11249) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11250](../app.js#L11250) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11251](../app.js#L11251) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11268](../app.js#L11268) |
| todayAction | button button |  | Por quê? | [11270](../app.js#L11270) |
| todayAction | button button |  | Outras opções | [11271](../app.js#L11271) |
| todayWeekPanel | button button |  | Ver nas Análises | [11323](../app.js#L11323) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11324](../app.js#L11324) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11331](../app.js#L11331) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11334](../app.js#L11334) |
| todayNextSteps | button button |  | Revisar | [11351](../app.js#L11351) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11352](../app.js#L11352) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11379](../app.js#L11379) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11410](../app.js#L11410) |
| nextRow | button button |  | dinâmico: main | [11447](../app.js#L11447) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11459](../app.js#L11459) |
| explainAction | button button |  | Fechar | [11473](../app.js#L11473) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11508](../app.js#L11508) |
| renderReviews | button button |  | Como funcionam as revisões? | [11509](../app.js#L11509) |
| renderReviews | button button |  | Adicionar um tópico | [11510](../app.js#L11510) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11523](../app.js#L11523) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11524](../app.js#L11524) |
| renderReviews | button button |  | Como funciona? | [11525](../app.js#L11525) |
| renderReviews | button button |  | Religar sugestões | [11526](../app.js#L11526) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11561](../app.js#L11561) |
| drawReviewGroups | button button |  | Limpar busca | [11598](../app.js#L11598) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11609](../app.js#L11609) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11625](../app.js#L11625) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11628](../app.js#L11628) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11630](../app.js#L11630) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11635](../app.js#L11635) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11640](../app.js#L11640) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11643](../app.js#L11643) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11644](../app.js#L11644) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11661](../app.js#L11661) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11665](../app.js#L11665) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11680](../app.js#L11680) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11683](../app.js#L11683) |
| reviewGroupCard | button button |  | Escolher assuntos | [11684](../app.js#L11684) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11708](../app.js#L11708) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11712](../app.js#L11712) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11779](../app.js#L11779) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11791](../app.js#L11791) |
| openDisciplineReview | button button |  | Cancelar | [11813](../app.js#L11813) |
| openDisciplineReview | button button |  | Já revisei | [11814](../app.js#L11814) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11820](../app.js#L11820) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [11859](../app.js#L11859) |
| startReview | button button |  | Cancelar | [11869](../app.js#L11869) |
| startReview | button button |  | Registrar sem cronômetro | [11870](../app.js#L11870) |
| startReview | button button |  | Começar revisão | [11872](../app.js#L11872) |
| openReviewOutcomeModal | input number | ro-min |  | [11885](../app.js#L11885) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11893](../app.js#L11893) |
| openReviewOutcomeModal | button button |  | Cancelar | [11895](../app.js#L11895) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11896](../app.js#L11896) |
| openSessionBuilder | button button |  | dinâmico: v + ' min' | [11944](../app.js#L11944) |
| openSessionBuilder | input number | sb-custom | Outro valor | [11948](../app.js#L11948) |
| openSessionBuilder | button button |  | Cancelar | [11962](../app.js#L11962) |
| openSessionBuilder | button button |  | Começar | [11963](../app.js#L11963) |
| openReviewPrimer | button button |  | O que é revisão? | [12022](../app.js#L12022) |
| openReviewPrimer | button button |  | Por que não basta reler? | [12023](../app.js#L12023) |
| renderPlan | button button |  | Ir para Disciplinas | [12527](../app.js#L12527) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12540](../app.js#L12540) |
| renderPlan | button button |  | Outro valor | [12541](../app.js#L12541) |
| renderPlan | button button |  | Para que serve o planejamento? | [12545](../app.js#L12545) |
| renderPlan | input number | plan-avail-h |  | [12555](../app.js#L12555) |
| renderPlan | input text | plan-name |  | [12563](../app.js#L12563) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12569](../app.js#L12569) |
| renderPlan | button button |  | Sugerir automaticamente | [12577](../app.js#L12577) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12619](../app.js#L12619) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12623](../app.js#L12623) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12626](../app.js#L12626) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12642](../app.js#L12642) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12643](../app.js#L12643) |
| openPlansDrawer | button button |  | Ativar | [12665](../app.js#L12665) |
| openPlansDrawer | button button |  | excluir | [12666](../app.js#L12666) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12668](../app.js#L12668) |
| createSimplePlan | button button |  | Personalizar distribuição | [12701](../app.js#L12701) |
| createSimplePlan | button button |  | Usar esta sugestão | [12706](../app.js#L12706) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12788](../app.js#L12788) |
| openNewPlanModal | input number | np-hours |  | [12789](../app.js#L12789) |
| openNewPlanModal | button button |  | Cancelar | [12798](../app.js#L12798) |
| openNewPlanModal | button button |  | Criar | [12799](../app.js#L12799) |
| planBoard | button button |  | dinâmico: icon('i-plus') | [12896](../app.js#L12896) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12903](../app.js#L12903) |
| planWeekHead | button button |  | Alterar meta | [12962](../app.js#L12962) |
| planWeekHead | button button |  | Personalizar distribuição | [12963](../app.js#L12963) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12964](../app.js#L12964) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12989](../app.js#L12989) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [13008](../app.js#L13008) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [13022](../app.js#L13022) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13026](../app.js#L13026) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13029](../app.js#L13029) |
| openWeekGoalModal | button button |  | Cancelar | [13048](../app.js#L13048) |
| openWeekGoalModal | button button |  | Salvar meta | [13049](../app.js#L13049) |
| planWeekNav | button button |  | Semana anterior | [13085](../app.js#L13085) |
| planWeekNav | button button |  | Próxima semana | [13087](../app.js#L13087) |
| planWeekNav | button button |  | Ir para esta semana | [13090](../app.js#L13090) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13091](../app.js#L13091) |
| planWeekNotices | button button |  | Ajustar os blocos | [13135](../app.js#L13135) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13136](../app.js#L13136) |
| planWeekNotices | button button |  | Manter assim | [13138](../app.js#L13138) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13177](../app.js#L13177) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13179](../app.js#L13179) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13197](../app.js#L13197) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13224](../app.js#L13224) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13228](../app.js#L13228) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13250](../app.js#L13250) |
| openSuggestionEditor | button button |  | Só nesta semana | [13251](../app.js#L13251) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13252](../app.js#L13252) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13267](../app.js#L13267) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13273](../app.js#L13273) |
| openSuggestionPicker | button button |  | Cancelar | [13293](../app.js#L13293) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13306](../app.js#L13306) |
| openWeekBlockPicker | input radio |  |  | [13317](../app.js#L13317) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13329](../app.js#L13329) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13335](../app.js#L13335) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13344](../app.js#L13344) |
| openWeekBlockPicker | button button |  | Cancelar | [13349](../app.js#L13349) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13350](../app.js#L13350) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13448](../app.js#L13448) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13479](../app.js#L13479) |
| planOffDays | button button |  | Personalizar dias | [13519](../app.js#L13519) |
| weekConflictDialog | button button |  | Ver a versão atual | [13533](../app.js#L13533) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13534](../app.js#L13534) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13651](../app.js#L13651) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13654](../app.js#L13654) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13658](../app.js#L13658) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13668](../app.js#L13668) |
| openBlockEditor | button button |  | Salvar | [13690](../app.js#L13690) |
| openBlockEditor | button button |  | Tirar deste dia | [13713](../app.js#L13713) |
| openBlockEditor | button button |  | Cancelar | [13714](../app.js#L13714) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13729](../app.js#L13729) |
| openMoveDialog | button button |  | Cancelar | [13738](../app.js#L13738) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13749](../app.js#L13749) |
| openStudyDaysModal | button button |  | Cancelar | [13763](../app.js#L13763) |
| openStudyDaysModal | button button |  | Salvar | [13764](../app.js#L13764) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13795](../app.js#L13795) |
| openAdjustBlocks | button button |  | Cancelar | [13810](../app.js#L13810) |
| openAdjustBlocks | button button |  | Salvar | [13811](../app.js#L13811) |
| openGoalUpdate | button button |  | Cancelar | [13844](../app.js#L13844) |
| openGoalUpdate | button button |  | Só nesta semana | [13845](../app.js#L13845) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13846](../app.js#L13846) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14105](../app.js#L14105) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14166](../app.js#L14166) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14475](../app.js#L14475) |
| contextSearch | button button |  | Limpar busca | [14477](../app.js#L14477) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14505](../app.js#L14505) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14515](../app.js#L14515) |
| collectionView | button button |  | Limpar busca | [14606](../app.js#L14606) |
| collectionView | button button |  | Mostrar todos | [14607](../app.js#L14607) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15079](../app.js#L15079) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15122](../app.js#L15122) |
| levelHead | button button |  | dinâmico: c.label | [15143](../app.js#L15143) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15144](../app.js#L15144) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15215](../app.js#L15215) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15216](../app.js#L15216) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15222](../app.js#L15222) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15227](../app.js#L15227) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15303](../app.js#L15303) |
| discAreaLevel | button button |  | Organizar em uma área | [15314](../app.js#L15314) |
| discAreaLevel | button button |  | Reativar | [15322](../app.js#L15322) |
| discAreaLevel | button button |  | Adicionar disciplina | [15341](../app.js#L15341) |
| discAreaLevel | button button |  | Agora não | [15342](../app.js#L15342) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15352](../app.js#L15352) |
| discDisciplineLevel | button button |  | Reativar | [15381](../app.js#L15381) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15382](../app.js#L15382) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15383](../app.js#L15383) |
| discDisciplineLevel | button button |  | Editar | [15384](../app.js#L15384) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15393](../app.js#L15393) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15429](../app.js#L15429) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15431](../app.js#L15431) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15435](../app.js#L15435) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15466](../app.js#L15466) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15468](../app.js#L15468) |
| topicDetailContent | button button |  | Reativar tópico | [15516](../app.js#L15516) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15519](../app.js#L15519) |
| topicDetailContent | button button |  | Revisar agora | [15520](../app.js#L15520) |
| topicDetailContent | button button |  | Editar | [15521](../app.js#L15521) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15522](../app.js#L15522) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15536](../app.js#L15536) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15549](../app.js#L15549) |
| areaNudgeCard | button button |  | Organizar | [15618](../app.js#L15618) |
| areaNudgeCard | button button |  | Agora não | [15619](../app.js#L15619) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15652](../app.js#L15652) |
| openAreaModal | input checkbox |  |  | [15660](../app.js#L15660) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15675](../app.js#L15675) |
| openAreaModal | button button |  | Cancelar | [15723](../app.js#L15723) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15813](../app.js#L15813) |
| openDisciplineModal | select  | dm-area |  | [15818](../app.js#L15818) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15823](../app.js#L15823) |
| openDisciplineModal | select  | dm-nature |  | [15845](../app.js#L15845) |
| openDisciplineModal | select  | dm-strategy |  | [15849](../app.js#L15849) |
| openDisciplineModal | select  | dm-method |  | [15855](../app.js#L15855) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15861](../app.js#L15861) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15883](../app.js#L15883) |
| openDisciplineModal | button button |  | Cancelar | [15940](../app.js#L15940) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15942](../app.js#L15942) |
| openDisciplineModal | button button |  | excluir definitivamente | [15944](../app.js#L15944) |
| topicReviewOptions | select  | tm-strategy |  | [16062](../app.js#L16062) |
| topicReviewOptions | select  | tm-method |  | [16067](../app.js#L16067) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16072](../app.js#L16072) |
| reviewToggle | input checkbox | tm-review |  | [16083](../app.js#L16083) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16128](../app.js#L16128) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16172](../app.js#L16172) |
| showTwin | button button |  | Usar este tópico | [16189](../app.js#L16189) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16194](../app.js#L16194) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16195](../app.js#L16195) |
| topicEditor | button button |  | dinâmico: saveLabel | [16276](../app.js#L16276) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16278](../app.js#L16278) |
| topicEditor | button button |  | Arquivar | [16282](../app.js#L16282) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16315](../app.js#L16315) |
| openBulkTopicModal | button button |  | Cancelar | [16328](../app.js#L16328) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16329](../app.js#L16329) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16369](../app.js#L16369) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16374](../app.js#L16374) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16375](../app.js#L16375) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16378](../app.js#L16378) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16380](../app.js#L16380) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16416](../app.js#L16416) |
| openDeadlineDrawer | button button |  | Reabrir | [16512](../app.js#L16512) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16513](../app.js#L16513) |
| openDeadlineDrawer | button button |  | Editar | [16514](../app.js#L16514) |
| openDeadlineDrawer | button button |  | Ver tópico | [16515](../app.js#L16515) |
| openDeadlineDrawer | button button |  | excluir | [16516](../app.js#L16516) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16531](../app.js#L16531) |
| openDeadlineModal | input date | dl-date |  | [16532](../app.js#L16532) |
| openDeadlineModal | input date | dl-start |  | [16534](../app.js#L16534) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16540](../app.js#L16540) |
| openDeadlineModal | select  | dl-disc |  | [16552](../app.js#L16552) |
| openDeadlineModal | select  | dl-topic |  | [16560](../app.js#L16560) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16578](../app.js#L16578) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16580](../app.js#L16580) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16598](../app.js#L16598) |
| openDeadlineModal | button button |  | Cancelar | [16610](../app.js#L16610) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16611](../app.js#L16611) |
| openDeadlineModal | button button |  | excluir | [16649](../app.js#L16649) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17083](../app.js#L17083) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17092](../app.js#L17092) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17108](../app.js#L17108) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17142](../app.js#L17142) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17162](../app.js#L17162) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17191](../app.js#L17191) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17219](../app.js#L17219) |
| analyticsCustomBuilder | button button |  | Cancelar | [17236](../app.js#L17236) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17237](../app.js#L17237) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17245](../app.js#L17245) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17249](../app.js#L17249) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17334](../app.js#L17334) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17342](../app.js#L17342) |
| scopePicker | button button |  | limpar | [17344](../app.js#L17344) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17377](../app.js#L17377) |
| saveCurrentAnalysis | input text | sa-name |  | [17401](../app.js#L17401) |
| saveCurrentAnalysis | button button |  | Cancelar | [17416](../app.js#L17416) |
| saveCurrentAnalysis | button button |  | Salvar | [17417](../app.js#L17417) |
| renameSavedAnalysis | input text | sa-rename |  | [17426](../app.js#L17426) |
| renameSavedAnalysis | button button |  | Cancelar | [17436](../app.js#L17436) |
| renameSavedAnalysis | button button |  | Salvar | [17436](../app.js#L17436) |
| rangePicker | button button |  | Mês anterior | [17473](../app.js#L17473) |
| rangePicker | button button |  | Próximo mês | [17475](../app.js#L17475) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17493](../app.js#L17493) |
| rangePicker | input date | an-rs |  | [17516](../app.js#L17516) |
| rangePicker | input date | an-re |  | [17517](../app.js#L17517) |
| rangePicker | button button |  | limpar datas | [17535](../app.js#L17535) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17656](../app.js#L17656) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17699](../app.js#L17699) |
| analyticsPanorama | button button |  | Personalizar análise | [17708](../app.js#L17708) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17715](../app.js#L17715) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17740](../app.js#L17740) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17753](../app.js#L17753) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17755](../app.js#L17755) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17760](../app.js#L17760) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17763](../app.js#L17763) |
| analyticsResultHeader | button button |  | limpar | [17774](../app.js#L17774) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17777](../app.js#L17777) |
| analyticsResultHeader | button button |  | Alterar análise | [17778](../app.js#L17778) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17797](../app.js#L17797) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17814](../app.js#L17814) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17827](../app.js#L17827) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17831](../app.js#L17831) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17846](../app.js#L17846) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17847](../app.js#L17847) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17891](../app.js#L17891) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17947](../app.js#L17947) |
| milestonesViz | button button |  | ver o estudo | [17966](../app.js#L17966) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18263](../app.js#L18263) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18471](../app.js#L18471) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18537](../app.js#L18537) |
| dueReviewsViz | button button |  | Revisar | [18541](../app.js#L18541) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18597](../app.js#L18597) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18667](../app.js#L18667) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18754](../app.js#L18754) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18804](../app.js#L18804) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18823](../app.js#L18823) |
| menuButton | button button |  | dinâmico: it.label | [18833](../app.js#L18833) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18859](../app.js#L18859) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18865](../app.js#L18865) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18874](../app.js#L18874) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18897](../app.js#L18897) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18988](../app.js#L18988) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18997](../app.js#L18997) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19022](../app.js#L19022) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19025](../app.js#L19025) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19074](../app.js#L19074) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19095](../app.js#L19095) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19118](../app.js#L19118) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19144](../app.js#L19144) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19145](../app.js#L19145) |
| analyticsCalendarCard | button button |  | Analisar este período | [19157](../app.js#L19157) |
| analyticsCalendarCard | button button |  | Cancelar | [19161](../app.js#L19161) |
| calendarHeatmap | button button |  | Mês anterior | [19177](../app.js#L19177) |
| calendarHeatmap | button button |  | Próximo mês | [19179](../app.js#L19179) |
| calendarHeatmap | button button |  | mês atual | [19180](../app.js#L19180) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19225](../app.js#L19225) |
| openDayDrawer | button button |  | Editar este estudo | [19322](../app.js#L19322) |
| openDayDrawer | button button |  | Analisar este dia | [19334](../app.js#L19334) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19339](../app.js#L19339) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19382](../app.js#L19382) |
| openBucketDrawer | button button |  | Analisar este período | [19432](../app.js#L19432) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19454](../app.js#L19454) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19519](../app.js#L19519) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19520](../app.js#L19520) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19555](../app.js#L19555) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19602](../app.js#L19602) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19607](../app.js#L19607) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19659](../app.js#L19659) |
| weeklyReportCard | button button |  | Semana anterior | [19725](../app.js#L19725) |
| weeklyReportCard | button button |  | Próxima semana | [19727](../app.js#L19727) |
| copySummary | textarea  |  | Resumo do período | [20034](../app.js#L20034) |
| copySummary | button button |  | Fechar | [20035](../app.js#L20035) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20209](../app.js#L20209) |
| historyDiscoveries | button button |  | Ver registros usados | [20210](../app.js#L20210) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20213](../app.js#L20213) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20229](../app.js#L20229) |
| renderHistory | button button |  | Registrar estudo | [20230](../app.js#L20230) |
| renderHistory | button button |  | Filtros | [20241](../app.js#L20241) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20248](../app.js#L20248) |
| renderHistory | button button |  | limpar tudo | [20250](../app.js#L20250) |
| openHistoryFilters | button button |  | Aplicar filtros | [20309](../app.js#L20309) |
| openHistoryFilters | button button |  | Limpar | [20312](../app.js#L20312) |
| renderHistoryTable | button button |  | Limpar busca | [20379](../app.js#L20379) |
| renderHistoryTable | button button |  | dinâmico: label | [20407](../app.js#L20407) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20419](../app.js#L20419) |
| openEditSessionModal | button button |  | remover estudo | [20587](../app.js#L20587) |
| openEditSessionModal | button button |  | Cancelar | [20593](../app.js#L20593) |
| openEditSessionModal | button button |  | Salvar | [20594](../app.js#L20594) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20662](../app.js#L20662) |
| confirmLongEdit | button button |  | Está certo, salvar | [20663](../app.js#L20663) |
| openAIReportModal | textarea  |  | Texto do prompt | [20808](../app.js#L20808) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20809](../app.js#L20809) |
| openAIReportModal | button button |  | dinâmico: x.label | [20834](../app.js#L20834) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20848](../app.js#L20848) |
| openAIReportModal | input checkbox | air-comments |  | [20856](../app.js#L20856) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20911](../app.js#L20911) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20919](../app.js#L20919) |
| openAIReportModal | button button |  | Só baixar o CSV | [20925](../app.js#L20925) |
| openAIReportModal | button button |  | Só copiar o prompt | [20926](../app.js#L20926) |
| openAIReportModal | button button |  | Fechar | [20936](../app.js#L20936) |
| runIntegrityCheck | button button |  | Fechar | [20968](../app.js#L20968) |
| renderData | input file | import-file |  | [20980](../app.js#L20980) |
| renderData | button button |  | dinâmico: icon('i-data') | [20993](../app.js#L20993) |
| renderData | button button |  | Onde meus dados ficam? | [20997](../app.js#L20997) |
| renderData | button button |  | Preparar | [21012](../app.js#L21012) |
| renderData | button button |  | Exportar | [21017](../app.js#L21017) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21018](../app.js#L21018) |
| renderData | button button |  | Verificar | [21035](../app.js#L21035) |
| renderData | button button |  | Pedir ao navegador | [21040](../app.js#L21040) |
| renderData | button button |  | apagar cópia antiga da V2 | [21085](../app.js#L21085) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21092](../app.js#L21092) |
| renderData | button button |  | Apagar todos os dados | [21096](../app.js#L21096) |
| restoreRefused | button button |  | Entendi | [21133](../app.js#L21133) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21159](../app.js#L21159) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21160](../app.js#L21160) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21161](../app.js#L21161) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21197](../app.js#L21197) |
| openRestorePreview | button button |  | Cancelar | [21234](../app.js#L21234) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21245](../app.js#L21245) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21248](../app.js#L21248) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21253](../app.js#L21253) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21326](../app.js#L21326) |
| bindEvents | button button |  | Fechar | [21328](../app.js#L21328) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21961](../app.js#L21961) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22020](../app.js#L22020) |
| GlossaryPopover | button button |  | Fechar explicação | [22023](../app.js#L22023) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22078](../app.js#L22078) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22299](../app.js#L22299) |
| FocusMode | button button |  | dinâmico: a.label | [22463](../app.js#L22463) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22664](../app.js#L22664) |
| pickDisciplineThen | button button |  | Cancelar | [22666](../app.js#L22666) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22745](../app.js#L22745) |
| renderReturnPill | button button |  | Fechar este atalho | [22747](../app.js#L22747) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22769](../app.js#L22769) |
| pickDisciplineForPriority | button button |  | Cancelar | [22772](../app.js#L22772) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22808](../app.js#L22808) |
| helpBreadcrumb | button button |  | dinâmico: label | [22851](../app.js#L22851) |
| articleBody | button button |  | dinâmico: x.label | [22904](../app.js#L22904) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22917](../app.js#L22917) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22931](../app.js#L22931) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22941](../app.js#L22941) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22953](../app.js#L22953) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22968](../app.js#L22968) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22971](../app.js#L22971) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22990](../app.js#L22990) |
| helpSearchCard | button button |  | Limpar busca | [23025](../app.js#L23025) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23035](../app.js#L23035) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23120](../app.js#L23120) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23134](../app.js#L23134) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23151](../app.js#L23151) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23163](../app.js#L23163) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23209](../app.js#L23209) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23219](../app.js#L23219) |
| helpHomePanel | button button |  | Rever a apresentação | [23235](../app.js#L23235) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23236](../app.js#L23236) |
| helpHomePanel | button button |  | Ver o guia | [23237](../app.js#L23237) |
| helpHomePanel | button button |  | Ver todas | [23244](../app.js#L23244) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23251](../app.js#L23251) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23253](../app.js#L23253) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23255](../app.js#L23255) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23257](../app.js#L23257) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23271](../app.js#L23271) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23294](../app.js#L23294) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23331](../app.js#L23331) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23372](../app.js#L23372) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23414](../app.js#L23414) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23511](../app.js#L23511) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23538](../app.js#L23538) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23541](../app.js#L23541) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23545](../app.js#L23545) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23579](../app.js#L23579) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23619](../app.js#L23619) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23634](../app.js#L23634) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23635](../app.js#L23635) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23658](../app.js#L23658) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23662](../app.js#L23662) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23669](../app.js#L23669) |
| renderTips | button button |  | Entendi | [23701](../app.js#L23701) |
| toastRich | button button |  | dinâmico: a.label | [23725](../app.js#L23725) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23892](../app.js#L23892) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23923](../app.js#L23923) |
| maybeShowWhatsNew | button button |  | Continuar | [23926](../app.js#L23926) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23979](../app.js#L23979) |
| stepQuick | input text | ob-name | Ex.: Português | [23994](../app.js#L23994) |
| stepQuick | button button |  | dinâmico: ex | [23998](../app.js#L23998) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [24009](../app.js#L24009) |
| stepWhat | button button |  | dinâmico: p.label | [24013](../app.js#L24013) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24019](../app.js#L24019) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24025](../app.js#L24025) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24034](../app.js#L24034) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24042](../app.js#L24042) |
| stepGoal | input date | ob-goal-d |  | [24044](../app.js#L24044) |
| stepGoal | select  | ob-goal-disc |  | [24046](../app.js#L24046) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24061](../app.js#L24061) |
| stepTime | input number | ob-hours | Outro | [24070](../app.js#L24070) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24073](../app.js#L24073) |
| buildActions | button button |  | Voltar | [24129](../app.js#L24129) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24132](../app.js#L24132) |
| buildActions | button button |  | Criar e continuar | [24136](../app.js#L24136) |
| buildActions | button button |  | Continuar | [24138](../app.js#L24138) |
| buildActions | button button |  | Continuar | [24144](../app.js#L24144) |
| buildActions | button button |  | Continuar | [24152](../app.js#L24152) |
| buildActions | button button |  | Criar e começar | [24157](../app.js#L24157) |
| guideNote | button button |  | dinâmico: a.label | [24317](../app.js#L24317) |
| guideNote | button button |  | Agora não | [24319](../app.js#L24319) |
| startGuideCard | button button |  | ocultar | [24353](../app.js#L24353) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24369](../app.js#L24369) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24398](../app.js#L24398) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24427](../app.js#L24427) |
| openFirstReviewIntro | button button |  | Agora não | [24485](../app.js#L24485) |
| openFirstReviewIntro | button button |  | Começar | [24488](../app.js#L24488) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24533](../app.js#L24533) |
| segmented | button button |  | dinâmico: o.label | [24578](../app.js#L24578) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24591](../app.js#L24591) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24602](../app.js#L24602) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24608](../app.js#L24608) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24641](../app.js#L24641) |
| renderSettings | button button |  | Rever a apresentação | [24674](../app.js#L24674) |
| renderSettings | button button |  | Mostrar novamente | [24676](../app.js#L24676) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24690](../app.js#L24690) |
| renderSettings | button button |  | Mostrar todas de novo | [24730](../app.js#L24730) |
| renderSettings | button button |  | Como funcionam as revisões? | [24735](../app.js#L24735) |
| renderSettings | button button |  | Ver | [24755](../app.js#L24755) |
| renderSettings | button button |  | Fazer backup agora | [24767](../app.js#L24767) |
| renderSettings | button button |  | Abrir tela Dados | [24769](../app.js#L24769) |
| renderSettings | button button |  | Onde meus dados ficam? | [24770](../app.js#L24770) |
| renderSettings | button button |  | Preparar | [24772](../app.js#L24772) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24788](../app.js#L24788) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24789](../app.js#L24789) |
| renderSettings | button button |  | Central de Ajuda | [24790](../app.js#L24790) |
| renderSettings | button button |  | Novidades desta versão | [24791](../app.js#L24791) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24809](../app.js#L24809) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24840](../app.js#L24840) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24848](../app.js#L24848) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24914](../app.js#L24914) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24922](../app.js#L24922) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24945](../app.js#L24945) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24950](../app.js#L24950) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6056](../app.js#L6056) |
| confirmModal | openModal | [6829](../app.js#L6829) |
| openRegisterModal | openModal | [9789](../app.js#L9789) |
| confirmLong | close.push | [9945](../app.js#L9945) |
| openFinishModal | openModal | [10115](../app.js#L10115) |
| offerStaleSession | openModal | [10334](../app.js#L10334) |
| openAlternatives | Drawer.open | [11461](../app.js#L11461) |
| explainAction | openModal | [11465](../app.js#L11465) |
| openDisciplineReview | openModal | [11775](../app.js#L11775) |
| startReview | openModal | [11840](../app.js#L11840) |
| openReviewOutcomeModal | openModal | [11884](../app.js#L11884) |
| openSessionBuilder | openModal | [11920](../app.js#L11920) |
| openReviewPrimer | Drawer.open | [12025](../app.js#L12025) |
| openPlansDrawer | Drawer.open | [12669](../app.js#L12669) |
| createSimplePlan | openModal | [12687](../app.js#L12687) |
| openNewPlanModal | openModal | [12787](../app.js#L12787) |
| openWeekGoalModal | openModal | [13020](../app.js#L13020) |
| openSuggestionEditor | openModal | [13222](../app.js#L13222) |
| openSuggestionPicker | openModal | [13266](../app.js#L13266) |
| openWeekBlockPicker | openModal | [13305](../app.js#L13305) |
| weekConflictDialog | close.push | [13537](../app.js#L13537) |
| weekConflictDialog | openModal | [13538](../app.js#L13538) |
| openBlockEditor | openModal | [13650](../app.js#L13650) |
| openMoveDialog | openModal | [13726](../app.js#L13726) |
| openStudyDaysModal | openModal | [13747](../app.js#L13747) |
| openAdjustBlocks | openModal | [13784](../app.js#L13784) |
| openGoalUpdate | openModal | [13832](../app.js#L13832) |
| openTopicDrawer | Drawer.open | [15583](../app.js#L15583) |
| openAreaModal | openModal | [15651](../app.js#L15651) |
| openDisciplineModal | openModal | [15812](../app.js#L15812) |
| openTopicModal | openModal | [16303](../app.js#L16303) |
| openBulkTopicModal | openModal | [16314](../app.js#L16314) |
| openDeadlineDrawer | Drawer.open | [16517](../app.js#L16517) |
| openDeadlineModal | openModal | [16524](../app.js#L16524) |
| saveCurrentAnalysis | openModal | [17400](../app.js#L17400) |
| renameSavedAnalysis | openModal | [17425](../app.js#L17425) |
| openAnalyticsDrawer | Drawer.open | [19135](../app.js#L19135) |
| openDayDrawer | Drawer.open | [19340](../app.js#L19340) |
| openBucketDrawer | Drawer.open | [19435](../app.js#L19435) |
| openDistributionDrawer | Drawer.open | [19521](../app.js#L19521) |
| copySummary | openModal | [20030](../app.js#L20030) |
| openHistoryFilters | Drawer.open | [20313](../app.js#L20313) |
| openEditSessionModal | openModal | [20474](../app.js#L20474) |
| confirmLongEdit | close.push | [20658](../app.js#L20658) |
| openAIReportModal | openModal | [20805](../app.js#L20805) |
| runIntegrityCheck | openModal | [20956](../app.js#L20956) |
| restoreRefused | openModal | [21128](../app.js#L21128) |
| askTimerBeforeRestore | openModal | [21153](../app.js#L21153) |
| openRestorePreview | openModal | [21195](../app.js#L21195) |
| bindEvents | openModal | [21322](../app.js#L21322) |
| openHelpArticle | Drawer.open | [22591](../app.js#L22591) |
| pickDisciplineThen | openModal | [22661](../app.js#L22661) |
| pickDisciplineForPriority | openModal | [22765](../app.js#L22765) |
| openContactDrawer | Drawer.open | [23546](../app.js#L23546) |
| openReportProblemDrawer | Drawer.open | [23638](../app.js#L23638) |
| openScreenHelp | Drawer.open | [23672](../app.js#L23672) |
| maybeShowWhatsNew | openModal | [23915](../app.js#L23915) |
| openWelcome | openModal | [23972](../app.js#L23972) |
| openFirstReviewIntro | openModal | [24476](../app.js#L24476) |
| openChangelog | Drawer.open | [24852](../app.js#L24852) |

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
