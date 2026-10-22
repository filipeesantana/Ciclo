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
| planBoard | button button |  | dinâmico: icon('i-plus') | [12895](../app.js#L12895) |
| planBoard | details  |  | dinâmico: h('summary', null, h('span', { text:'Disciplinas e sugestões' }), h('span', { class:'hint', text:'Di | [12902](../app.js#L12902) |
| planWeekHead | button button |  | Alterar meta | [12961](../app.js#L12961) |
| planWeekHead | button button |  | Personalizar distribuição | [12962](../app.js#L12962) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12963](../app.js#L12963) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12988](../app.js#L12988) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [13007](../app.js#L13007) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [13021](../app.js#L13021) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [13025](../app.js#L13025) |
| openWeekGoalModal | input checkbox | wg-redist |  | [13028](../app.js#L13028) |
| openWeekGoalModal | button button |  | Cancelar | [13047](../app.js#L13047) |
| openWeekGoalModal | button button |  | Salvar meta | [13048](../app.js#L13048) |
| planWeekNav | button button |  | Semana anterior | [13084](../app.js#L13084) |
| planWeekNav | button button |  | Próxima semana | [13086](../app.js#L13086) |
| planWeekNav | button button |  | Ir para esta semana | [13089](../app.js#L13089) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [13090](../app.js#L13090) |
| planWeekNotices | button button |  | Ajustar os blocos | [13134](../app.js#L13134) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13135](../app.js#L13135) |
| planWeekNotices | button button |  | Manter assim | [13137](../app.js#L13137) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13176](../app.js#L13176) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13178](../app.js#L13178) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13196](../app.js#L13196) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13223](../app.js#L13223) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13227](../app.js#L13227) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13249](../app.js#L13249) |
| openSuggestionEditor | button button |  | Só nesta semana | [13250](../app.js#L13250) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13251](../app.js#L13251) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13266](../app.js#L13266) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13272](../app.js#L13272) |
| openSuggestionPicker | button button |  | Cancelar | [13292](../app.js#L13292) |
| openWeekBlockPicker | input search | wb-search | Buscar disciplina | [13305](../app.js#L13305) |
| openWeekBlockPicker | input radio |  |  | [13316](../app.js#L13316) |
| openWeekBlockPicker | input checkbox |  | dinâmico: WeekPlan.dayFull(iso) | [13328](../app.js#L13328) |
| openWeekBlockPicker | input number | wb-minutes | Só o dia | [13334](../app.js#L13334) |
| openWeekBlockPicker | details  |  | dinâmico: h('summary', { text:'Duração e horário (opcionais)' }) | [13343](../app.js#L13343) |
| openWeekBlockPicker | button button |  | Cancelar | [13348](../app.js#L13348) |
| openWeekBlockPicker | button button |  | Adicionar aos dias | [13349](../app.js#L13349) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13438](../app.js#L13438) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13469](../app.js#L13469) |
| planOffDays | button button |  | Personalizar dias | [13509](../app.js#L13509) |
| weekConflictDialog | button button |  | Ver a versão atual | [13523](../app.js#L13523) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13524](../app.js#L13524) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13641](../app.js#L13641) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13644](../app.js#L13644) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13648](../app.js#L13648) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13658](../app.js#L13658) |
| openBlockEditor | button button |  | Salvar | [13680](../app.js#L13680) |
| openBlockEditor | button button |  | Tirar deste dia | [13703](../app.js#L13703) |
| openBlockEditor | button button |  | Cancelar | [13704](../app.js#L13704) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13719](../app.js#L13719) |
| openMoveDialog | button button |  | Cancelar | [13728](../app.js#L13728) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13739](../app.js#L13739) |
| openStudyDaysModal | button button |  | Cancelar | [13753](../app.js#L13753) |
| openStudyDaysModal | button button |  | Salvar | [13754](../app.js#L13754) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13785](../app.js#L13785) |
| openAdjustBlocks | button button |  | Cancelar | [13800](../app.js#L13800) |
| openAdjustBlocks | button button |  | Salvar | [13801](../app.js#L13801) |
| openGoalUpdate | button button |  | Cancelar | [13834](../app.js#L13834) |
| openGoalUpdate | button button |  | Só nesta semana | [13835](../app.js#L13835) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13836](../app.js#L13836) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [14095](../app.js#L14095) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [14156](../app.js#L14156) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14465](../app.js#L14465) |
| contextSearch | button button |  | Limpar busca | [14467](../app.js#L14467) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14495](../app.js#L14495) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14505](../app.js#L14505) |
| collectionView | button button |  | Limpar busca | [14596](../app.js#L14596) |
| collectionView | button button |  | Mostrar todos | [14597](../app.js#L14597) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [15069](../app.js#L15069) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [15112](../app.js#L15112) |
| levelHead | button button |  | dinâmico: c.label | [15133](../app.js#L15133) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [15134](../app.js#L15134) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15205](../app.js#L15205) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15206](../app.js#L15206) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15212](../app.js#L15212) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15217](../app.js#L15217) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15293](../app.js#L15293) |
| discAreaLevel | button button |  | Organizar em uma área | [15304](../app.js#L15304) |
| discAreaLevel | button button |  | Reativar | [15312](../app.js#L15312) |
| discAreaLevel | button button |  | Adicionar disciplina | [15331](../app.js#L15331) |
| discAreaLevel | button button |  | Agora não | [15332](../app.js#L15332) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15342](../app.js#L15342) |
| discDisciplineLevel | button button |  | Reativar | [15371](../app.js#L15371) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15372](../app.js#L15372) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15373](../app.js#L15373) |
| discDisciplineLevel | button button |  | Editar | [15374](../app.js#L15374) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15383](../app.js#L15383) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15419](../app.js#L15419) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15421](../app.js#L15421) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15425](../app.js#L15425) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15456](../app.js#L15456) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15458](../app.js#L15458) |
| topicDetailContent | button button |  | Reativar tópico | [15506](../app.js#L15506) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15509](../app.js#L15509) |
| topicDetailContent | button button |  | Revisar agora | [15510](../app.js#L15510) |
| topicDetailContent | button button |  | Editar | [15511](../app.js#L15511) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15512](../app.js#L15512) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15526](../app.js#L15526) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15539](../app.js#L15539) |
| areaNudgeCard | button button |  | Organizar | [15608](../app.js#L15608) |
| areaNudgeCard | button button |  | Agora não | [15609](../app.js#L15609) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15642](../app.js#L15642) |
| openAreaModal | input checkbox |  |  | [15650](../app.js#L15650) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15665](../app.js#L15665) |
| openAreaModal | button button |  | Cancelar | [15713](../app.js#L15713) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15803](../app.js#L15803) |
| openDisciplineModal | select  | dm-area |  | [15808](../app.js#L15808) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15813](../app.js#L15813) |
| openDisciplineModal | select  | dm-nature |  | [15835](../app.js#L15835) |
| openDisciplineModal | select  | dm-strategy |  | [15839](../app.js#L15839) |
| openDisciplineModal | select  | dm-method |  | [15845](../app.js#L15845) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15851](../app.js#L15851) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15873](../app.js#L15873) |
| openDisciplineModal | button button |  | Cancelar | [15930](../app.js#L15930) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15932](../app.js#L15932) |
| openDisciplineModal | button button |  | excluir definitivamente | [15934](../app.js#L15934) |
| topicReviewOptions | select  | tm-strategy |  | [16052](../app.js#L16052) |
| topicReviewOptions | select  | tm-method |  | [16057](../app.js#L16057) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [16062](../app.js#L16062) |
| reviewToggle | input checkbox | tm-review |  | [16073](../app.js#L16073) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [16118](../app.js#L16118) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [16162](../app.js#L16162) |
| showTwin | button button |  | Usar este tópico | [16179](../app.js#L16179) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16184](../app.js#L16184) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16185](../app.js#L16185) |
| topicEditor | button button |  | dinâmico: saveLabel | [16266](../app.js#L16266) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16268](../app.js#L16268) |
| topicEditor | button button |  | Arquivar | [16272](../app.js#L16272) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16305](../app.js#L16305) |
| openBulkTopicModal | button button |  | Cancelar | [16318](../app.js#L16318) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16319](../app.js#L16319) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16359](../app.js#L16359) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16364](../app.js#L16364) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16365](../app.js#L16365) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16368](../app.js#L16368) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16370](../app.js#L16370) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16406](../app.js#L16406) |
| openDeadlineDrawer | button button |  | Reabrir | [16502](../app.js#L16502) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16503](../app.js#L16503) |
| openDeadlineDrawer | button button |  | Editar | [16504](../app.js#L16504) |
| openDeadlineDrawer | button button |  | Ver tópico | [16505](../app.js#L16505) |
| openDeadlineDrawer | button button |  | excluir | [16506](../app.js#L16506) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16521](../app.js#L16521) |
| openDeadlineModal | input date | dl-date |  | [16522](../app.js#L16522) |
| openDeadlineModal | input date | dl-start |  | [16524](../app.js#L16524) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16530](../app.js#L16530) |
| openDeadlineModal | select  | dl-disc |  | [16542](../app.js#L16542) |
| openDeadlineModal | select  | dl-topic |  | [16550](../app.js#L16550) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16568](../app.js#L16568) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16570](../app.js#L16570) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16588](../app.js#L16588) |
| openDeadlineModal | button button |  | Cancelar | [16600](../app.js#L16600) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16601](../app.js#L16601) |
| openDeadlineModal | button button |  | excluir | [16639](../app.js#L16639) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [17073](../app.js#L17073) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [17082](../app.js#L17082) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [17098](../app.js#L17098) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [17132](../app.js#L17132) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [17152](../app.js#L17152) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17181](../app.js#L17181) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17209](../app.js#L17209) |
| analyticsCustomBuilder | button button |  | Cancelar | [17226](../app.js#L17226) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17227](../app.js#L17227) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17235](../app.js#L17235) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17239](../app.js#L17239) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17324](../app.js#L17324) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17332](../app.js#L17332) |
| scopePicker | button button |  | limpar | [17334](../app.js#L17334) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17367](../app.js#L17367) |
| saveCurrentAnalysis | input text | sa-name |  | [17391](../app.js#L17391) |
| saveCurrentAnalysis | button button |  | Cancelar | [17406](../app.js#L17406) |
| saveCurrentAnalysis | button button |  | Salvar | [17407](../app.js#L17407) |
| renameSavedAnalysis | input text | sa-rename |  | [17416](../app.js#L17416) |
| renameSavedAnalysis | button button |  | Cancelar | [17426](../app.js#L17426) |
| renameSavedAnalysis | button button |  | Salvar | [17426](../app.js#L17426) |
| rangePicker | button button |  | Mês anterior | [17463](../app.js#L17463) |
| rangePicker | button button |  | Próximo mês | [17465](../app.js#L17465) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17483](../app.js#L17483) |
| rangePicker | input date | an-rs |  | [17506](../app.js#L17506) |
| rangePicker | input date | an-re |  | [17507](../app.js#L17507) |
| rangePicker | button button |  | limpar datas | [17525](../app.js#L17525) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17646](../app.js#L17646) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17689](../app.js#L17689) |
| analyticsPanorama | button button |  | Personalizar análise | [17698](../app.js#L17698) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17705](../app.js#L17705) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17730](../app.js#L17730) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17743](../app.js#L17743) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17745](../app.js#L17745) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17750](../app.js#L17750) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17753](../app.js#L17753) |
| analyticsResultHeader | button button |  | limpar | [17764](../app.js#L17764) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17767](../app.js#L17767) |
| analyticsResultHeader | button button |  | Alterar análise | [17768](../app.js#L17768) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17787](../app.js#L17787) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17804](../app.js#L17804) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17817](../app.js#L17817) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17821](../app.js#L17821) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17836](../app.js#L17836) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17837](../app.js#L17837) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17881](../app.js#L17881) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17937](../app.js#L17937) |
| milestonesViz | button button |  | ver o estudo | [17956](../app.js#L17956) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18253](../app.js#L18253) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18461](../app.js#L18461) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18527](../app.js#L18527) |
| dueReviewsViz | button button |  | Revisar | [18531](../app.js#L18531) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18587](../app.js#L18587) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18657](../app.js#L18657) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18744](../app.js#L18744) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18794](../app.js#L18794) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18813](../app.js#L18813) |
| menuButton | button button |  | dinâmico: it.label | [18823](../app.js#L18823) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18849](../app.js#L18849) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18855](../app.js#L18855) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18864](../app.js#L18864) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18887](../app.js#L18887) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18978](../app.js#L18978) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18987](../app.js#L18987) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [19012](../app.js#L19012) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [19015](../app.js#L19015) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [19064](../app.js#L19064) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [19085](../app.js#L19085) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [19108](../app.js#L19108) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [19134](../app.js#L19134) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [19135](../app.js#L19135) |
| analyticsCalendarCard | button button |  | Analisar este período | [19147](../app.js#L19147) |
| analyticsCalendarCard | button button |  | Cancelar | [19151](../app.js#L19151) |
| calendarHeatmap | button button |  | Mês anterior | [19167](../app.js#L19167) |
| calendarHeatmap | button button |  | Próximo mês | [19169](../app.js#L19169) |
| calendarHeatmap | button button |  | mês atual | [19170](../app.js#L19170) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19215](../app.js#L19215) |
| openDayDrawer | button button |  | Editar este estudo | [19312](../app.js#L19312) |
| openDayDrawer | button button |  | Analisar este dia | [19324](../app.js#L19324) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19329](../app.js#L19329) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19372](../app.js#L19372) |
| openBucketDrawer | button button |  | Analisar este período | [19422](../app.js#L19422) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19444](../app.js#L19444) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19509](../app.js#L19509) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19510](../app.js#L19510) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19545](../app.js#L19545) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19592](../app.js#L19592) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19597](../app.js#L19597) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19649](../app.js#L19649) |
| weeklyReportCard | button button |  | Semana anterior | [19715](../app.js#L19715) |
| weeklyReportCard | button button |  | Próxima semana | [19717](../app.js#L19717) |
| copySummary | textarea  |  | Resumo do período | [20024](../app.js#L20024) |
| copySummary | button button |  | Fechar | [20025](../app.js#L20025) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20199](../app.js#L20199) |
| historyDiscoveries | button button |  | Ver registros usados | [20200](../app.js#L20200) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20203](../app.js#L20203) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20219](../app.js#L20219) |
| renderHistory | button button |  | Registrar estudo | [20220](../app.js#L20220) |
| renderHistory | button button |  | Filtros | [20231](../app.js#L20231) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20238](../app.js#L20238) |
| renderHistory | button button |  | limpar tudo | [20240](../app.js#L20240) |
| openHistoryFilters | button button |  | Aplicar filtros | [20299](../app.js#L20299) |
| openHistoryFilters | button button |  | Limpar | [20302](../app.js#L20302) |
| renderHistoryTable | button button |  | Limpar busca | [20369](../app.js#L20369) |
| renderHistoryTable | button button |  | dinâmico: label | [20397](../app.js#L20397) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20409](../app.js#L20409) |
| openEditSessionModal | button button |  | remover estudo | [20577](../app.js#L20577) |
| openEditSessionModal | button button |  | Cancelar | [20583](../app.js#L20583) |
| openEditSessionModal | button button |  | Salvar | [20584](../app.js#L20584) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20652](../app.js#L20652) |
| confirmLongEdit | button button |  | Está certo, salvar | [20653](../app.js#L20653) |
| openAIReportModal | textarea  |  | Texto do prompt | [20798](../app.js#L20798) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20799](../app.js#L20799) |
| openAIReportModal | button button |  | dinâmico: x.label | [20824](../app.js#L20824) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20838](../app.js#L20838) |
| openAIReportModal | input checkbox | air-comments |  | [20846](../app.js#L20846) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20901](../app.js#L20901) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20909](../app.js#L20909) |
| openAIReportModal | button button |  | Só baixar o CSV | [20915](../app.js#L20915) |
| openAIReportModal | button button |  | Só copiar o prompt | [20916](../app.js#L20916) |
| openAIReportModal | button button |  | Fechar | [20926](../app.js#L20926) |
| runIntegrityCheck | button button |  | Fechar | [20958](../app.js#L20958) |
| renderData | input file | import-file |  | [20970](../app.js#L20970) |
| renderData | button button |  | dinâmico: icon('i-data') | [20983](../app.js#L20983) |
| renderData | button button |  | Onde meus dados ficam? | [20987](../app.js#L20987) |
| renderData | button button |  | Preparar | [21002](../app.js#L21002) |
| renderData | button button |  | Exportar | [21007](../app.js#L21007) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [21008](../app.js#L21008) |
| renderData | button button |  | Verificar | [21025](../app.js#L21025) |
| renderData | button button |  | Pedir ao navegador | [21030](../app.js#L21030) |
| renderData | button button |  | apagar cópia antiga da V2 | [21075](../app.js#L21075) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [21082](../app.js#L21082) |
| renderData | button button |  | Apagar todos os dados | [21086](../app.js#L21086) |
| restoreRefused | button button |  | Entendi | [21123](../app.js#L21123) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [21149](../app.js#L21149) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [21150](../app.js#L21150) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [21151](../app.js#L21151) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21187](../app.js#L21187) |
| openRestorePreview | button button |  | Cancelar | [21224](../app.js#L21224) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21235](../app.js#L21235) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21238](../app.js#L21238) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21243](../app.js#L21243) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21316](../app.js#L21316) |
| bindEvents | button button |  | Fechar | [21318](../app.js#L21318) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21951](../app.js#L21951) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [22010](../app.js#L22010) |
| GlossaryPopover | button button |  | Fechar explicação | [22013](../app.js#L22013) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [22068](../app.js#L22068) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22289](../app.js#L22289) |
| FocusMode | button button |  | dinâmico: a.label | [22453](../app.js#L22453) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22654](../app.js#L22654) |
| pickDisciplineThen | button button |  | Cancelar | [22656](../app.js#L22656) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22735](../app.js#L22735) |
| renderReturnPill | button button |  | Fechar este atalho | [22737](../app.js#L22737) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22759](../app.js#L22759) |
| pickDisciplineForPriority | button button |  | Cancelar | [22762](../app.js#L22762) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22798](../app.js#L22798) |
| helpBreadcrumb | button button |  | dinâmico: label | [22841](../app.js#L22841) |
| articleBody | button button |  | dinâmico: x.label | [22894](../app.js#L22894) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22907](../app.js#L22907) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22921](../app.js#L22921) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22931](../app.js#L22931) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22943](../app.js#L22943) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22958](../app.js#L22958) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22961](../app.js#L22961) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22980](../app.js#L22980) |
| helpSearchCard | button button |  | Limpar busca | [23015](../app.js#L23015) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [23025](../app.js#L23025) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [23110](../app.js#L23110) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [23124](../app.js#L23124) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [23141](../app.js#L23141) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [23153](../app.js#L23153) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23199](../app.js#L23199) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23209](../app.js#L23209) |
| helpHomePanel | button button |  | Rever a apresentação | [23225](../app.js#L23225) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23226](../app.js#L23226) |
| helpHomePanel | button button |  | Ver o guia | [23227](../app.js#L23227) |
| helpHomePanel | button button |  | Ver todas | [23234](../app.js#L23234) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23241](../app.js#L23241) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23243](../app.js#L23243) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23245](../app.js#L23245) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23247](../app.js#L23247) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23261](../app.js#L23261) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23284](../app.js#L23284) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23321](../app.js#L23321) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23362](../app.js#L23362) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23404](../app.js#L23404) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23501](../app.js#L23501) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23528](../app.js#L23528) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23531](../app.js#L23531) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23535](../app.js#L23535) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23569](../app.js#L23569) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23609](../app.js#L23609) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23624](../app.js#L23624) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23625](../app.js#L23625) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23648](../app.js#L23648) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23652](../app.js#L23652) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23659](../app.js#L23659) |
| renderTips | button button |  | Entendi | [23691](../app.js#L23691) |
| toastRich | button button |  | dinâmico: a.label | [23715](../app.js#L23715) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23882](../app.js#L23882) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23913](../app.js#L23913) |
| maybeShowWhatsNew | button button |  | Continuar | [23916](../app.js#L23916) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23969](../app.js#L23969) |
| stepQuick | input text | ob-name | Ex.: Português | [23984](../app.js#L23984) |
| stepQuick | button button |  | dinâmico: ex | [23988](../app.js#L23988) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [23999](../app.js#L23999) |
| stepWhat | button button |  | dinâmico: p.label | [24003](../app.js#L24003) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [24009](../app.js#L24009) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [24015](../app.js#L24015) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24024](../app.js#L24024) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [24032](../app.js#L24032) |
| stepGoal | input date | ob-goal-d |  | [24034](../app.js#L24034) |
| stepGoal | select  | ob-goal-disc |  | [24036](../app.js#L24036) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [24051](../app.js#L24051) |
| stepTime | input number | ob-hours | Outro | [24060](../app.js#L24060) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [24063](../app.js#L24063) |
| buildActions | button button |  | Voltar | [24119](../app.js#L24119) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [24122](../app.js#L24122) |
| buildActions | button button |  | Criar e continuar | [24126](../app.js#L24126) |
| buildActions | button button |  | Continuar | [24128](../app.js#L24128) |
| buildActions | button button |  | Continuar | [24134](../app.js#L24134) |
| buildActions | button button |  | Continuar | [24142](../app.js#L24142) |
| buildActions | button button |  | Criar e começar | [24147](../app.js#L24147) |
| guideNote | button button |  | dinâmico: a.label | [24307](../app.js#L24307) |
| guideNote | button button |  | Agora não | [24309](../app.js#L24309) |
| startGuideCard | button button |  | ocultar | [24343](../app.js#L24343) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24359](../app.js#L24359) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24388](../app.js#L24388) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24417](../app.js#L24417) |
| openFirstReviewIntro | button button |  | Agora não | [24475](../app.js#L24475) |
| openFirstReviewIntro | button button |  | Começar | [24478](../app.js#L24478) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24523](../app.js#L24523) |
| segmented | button button |  | dinâmico: o.label | [24568](../app.js#L24568) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24581](../app.js#L24581) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24592](../app.js#L24592) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24598](../app.js#L24598) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24631](../app.js#L24631) |
| renderSettings | button button |  | Rever a apresentação | [24664](../app.js#L24664) |
| renderSettings | button button |  | Mostrar novamente | [24666](../app.js#L24666) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24680](../app.js#L24680) |
| renderSettings | button button |  | Mostrar todas de novo | [24720](../app.js#L24720) |
| renderSettings | button button |  | Como funcionam as revisões? | [24725](../app.js#L24725) |
| renderSettings | button button |  | Ver | [24745](../app.js#L24745) |
| renderSettings | button button |  | Fazer backup agora | [24757](../app.js#L24757) |
| renderSettings | button button |  | Abrir tela Dados | [24759](../app.js#L24759) |
| renderSettings | button button |  | Onde meus dados ficam? | [24760](../app.js#L24760) |
| renderSettings | button button |  | Preparar | [24762](../app.js#L24762) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24778](../app.js#L24778) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24779](../app.js#L24779) |
| renderSettings | button button |  | Central de Ajuda | [24780](../app.js#L24780) |
| renderSettings | button button |  | Novidades desta versão | [24781](../app.js#L24781) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24799](../app.js#L24799) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24830](../app.js#L24830) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24838](../app.js#L24838) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24904](../app.js#L24904) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24912](../app.js#L24912) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24935](../app.js#L24935) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24940](../app.js#L24940) |

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
| openWeekGoalModal | openModal | [13019](../app.js#L13019) |
| openSuggestionEditor | openModal | [13221](../app.js#L13221) |
| openSuggestionPicker | openModal | [13265](../app.js#L13265) |
| openWeekBlockPicker | openModal | [13304](../app.js#L13304) |
| weekConflictDialog | close.push | [13527](../app.js#L13527) |
| weekConflictDialog | openModal | [13528](../app.js#L13528) |
| openBlockEditor | openModal | [13640](../app.js#L13640) |
| openMoveDialog | openModal | [13716](../app.js#L13716) |
| openStudyDaysModal | openModal | [13737](../app.js#L13737) |
| openAdjustBlocks | openModal | [13774](../app.js#L13774) |
| openGoalUpdate | openModal | [13822](../app.js#L13822) |
| openTopicDrawer | Drawer.open | [15573](../app.js#L15573) |
| openAreaModal | openModal | [15641](../app.js#L15641) |
| openDisciplineModal | openModal | [15802](../app.js#L15802) |
| openTopicModal | openModal | [16293](../app.js#L16293) |
| openBulkTopicModal | openModal | [16304](../app.js#L16304) |
| openDeadlineDrawer | Drawer.open | [16507](../app.js#L16507) |
| openDeadlineModal | openModal | [16514](../app.js#L16514) |
| saveCurrentAnalysis | openModal | [17390](../app.js#L17390) |
| renameSavedAnalysis | openModal | [17415](../app.js#L17415) |
| openAnalyticsDrawer | Drawer.open | [19125](../app.js#L19125) |
| openDayDrawer | Drawer.open | [19330](../app.js#L19330) |
| openBucketDrawer | Drawer.open | [19425](../app.js#L19425) |
| openDistributionDrawer | Drawer.open | [19511](../app.js#L19511) |
| copySummary | openModal | [20020](../app.js#L20020) |
| openHistoryFilters | Drawer.open | [20303](../app.js#L20303) |
| openEditSessionModal | openModal | [20464](../app.js#L20464) |
| confirmLongEdit | close.push | [20648](../app.js#L20648) |
| openAIReportModal | openModal | [20795](../app.js#L20795) |
| runIntegrityCheck | openModal | [20946](../app.js#L20946) |
| restoreRefused | openModal | [21118](../app.js#L21118) |
| askTimerBeforeRestore | openModal | [21143](../app.js#L21143) |
| openRestorePreview | openModal | [21185](../app.js#L21185) |
| bindEvents | openModal | [21312](../app.js#L21312) |
| openHelpArticle | Drawer.open | [22581](../app.js#L22581) |
| pickDisciplineThen | openModal | [22651](../app.js#L22651) |
| pickDisciplineForPriority | openModal | [22755](../app.js#L22755) |
| openContactDrawer | Drawer.open | [23536](../app.js#L23536) |
| openReportProblemDrawer | Drawer.open | [23628](../app.js#L23628) |
| openScreenHelp | Drawer.open | [23662](../app.js#L23662) |
| maybeShowWhatsNew | openModal | [23905](../app.js#L23905) |
| openWelcome | openModal | [23962](../app.js#L23962) |
| openFirstReviewIntro | openModal | [24466](../app.js#L24466) |
| openChangelog | Drawer.open | [24842](../app.js#L24842) |

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
