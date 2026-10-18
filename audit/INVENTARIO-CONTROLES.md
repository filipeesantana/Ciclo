# Inventário dos controles e camadas

Gerado por `npm run audit:inventory`. Fonte: app.js. 561 construções de controles, 59 construções de camadas e 715 funções declaradas. Uma construção pode gerar vários controles conforme os dados. Este índice não afirma que todos os estados foram exercitados. Os controles fixos de navegação estão em index.html; as opções dinâmicas e a cobertura estão na [matriz](MATRIZ-FUNCIONALIDADES.md).

| Contexto | Controle | ID / nome | Rótulo ou expressão | Linha |
|---|---|---|---|---|
| askConflict | button button |  | Voltar à edição | [6053](../app.js#L6053) |
| askConflict | button button |  | Descartar a minha edição | [6054](../app.js#L6054) |
| askConflict | button button |  | Manter a minha edição | [6055](../app.js#L6055) |
| DataSync | button button |  | Atualizar | [6345](../app.js#L6345) |
| DataSync | button button |  | Continuar editando | [6347](../app.js#L6347) |
| confirmModal | button button |  | dinâmico: o.cancelLabel \|\| 'Cancelar' | [6820](../app.js#L6820) |
| confirmModal | button button |  | dinâmico: o.confirmLabel \|\| 'Confirmar' | [6821](../app.js#L6821) |
| selectField | select  | dinâmico: id |  | [7272](../app.js#L7272) |
| pillGroup | button button |  | dinâmico: it.label | [7285](../app.js#L7285) |
| renderTimerBar | button button |  | dinâmico: a.label | [7615](../app.js#L7615) |
| renderTimerBar | button button |  | Foco | [7617](../app.js#L7617) |
| renderTimerBar | button button |  | descartar | [7618](../app.js#L7618) |
| entityPicker | button button | dinâmico: o.id | dinâmico: main | [7778](../app.js#L7778) |
| entityPicker | input search | dinâmico: o.id + '-q' | dinâmico: o.searchPlaceholder \|\| 'Buscar' | [7780](../app.js#L7780) |
| topicMultiPicker | button button | dinâmico: o.id | dinâmico: icon('i-plus', 'btn-icon') | [7973](../app.js#L7973) |
| topicMultiPicker | input search | dinâmico: o.id + '-q' | Buscar tópico | [7976](../app.js#L7976) |
| topicMultiPicker | button button |  | Pronto | [7982](../app.js#L7982) |
| drawChips | button button |  | dinâmico: ′Remover ${name}′ | [7997](../app.js#L7997) |
| makeBlock | button button |  | Remover esta disciplina do estudo | [8287](../app.js#L8287) |
| studyTargetFields | button button |  | + Adicionar outra disciplina | [8305](../app.js#L8305) |
| studyTargetFields | input text | dinâmico: prefix + '-newdisc' | Ex.: História | [8342](../app.js#L8342) |
| studyTargetFields | button button |  | Escolher uma disciplina que já existe | [8343](../app.js#L8343) |
| studyTypePicker | button button |  | dinâmico: h('span', { class:'type-ic', 'aria-hidden':'true' }, icon(t.icon, 'nav-icon')) | [8496](../app.js#L8496) |
| topicSplitField | button button |  |  | [8560](../app.js#L8560) |
| topicSplitField | button button |  | Não dividir | [8564](../app.js#L8564) |
| input | input number | dinâmico: ′${p}-${kind === 'd' ? 'dsplit' : 'split'}-${id}′ | dinâmico: ′Minutos de ${label}′ | [8583](../app.js#L8583) |
| draw | button button |  | dinâmico: ′${x.label} para todos os tópicos′ | [8771](../app.js#L8771) |
| commentField | textarea  | dinâmico: o.id |  | [8821](../app.js#L8821) |
| commentField | button button |  | + Adicionar comentário | [8824](../app.js#L8824) |
| commentField | button button |  | Remover o comentário | [8825](../app.js#L8825) |
| resultsField | button button |  | dinâmico: icon(k.v === 'milestone' ? 'i-milestone' : k.v === 'concept' ? 'i-help' : 'i-t-exercise', 'btn-icon' | [8908](../app.js#L8908) |
| resultsField | button button |  | Recolher | [8913](../app.js#L8913) |
| resultsField | button button |  | + Adicionar resultado | [8916](../app.js#L8916) |
| addCard | button button |  | dinâmico: 'Remover este resultado: ' + k.label | [8943](../app.js#L8943) |
| addCard | select  | dinâmico: ′${p}-${id}-t′ |  | [8945](../app.js#L8945) |
| addCard | input number | dinâmico: ′${p}-${id}-q′ |  | [8959](../app.js#L8959) |
| addCard | input number | dinâmico: ′${p}-${id}-c′ |  | [8960](../app.js#L8960) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Frações | [8961](../app.js#L8961) |
| addCard | input text | dinâmico: ′${p}-${id}-a′ | Ex.: Uso da crase | [9000](../app.js#L9000) |
| addCard | textarea  | dinâmico: ′${p}-${id}-n′ | dinâmico: milestoneExample() | [9014](../app.js#L9014) |
| addCard | input text | dinâmico: ′${p}-${id}-b′ | Ex.: precisava parar entre um acorde e outro | [9016](../app.js#L9016) |
| timeField | input text | dinâmico: o.id | dinâmico: o.ariaLabel \|\| null | [9119](../app.js#L9119) |
| breaksEditor | button button |  | dinâmico: addLabel | [9257](../app.js#L9257) |
| draw | button button |  | dinâmico: ′Remover o descanso ${n}′ | [9279](../app.js#L9279) |
| draw | input number | dinâmico: ′${p}-bm-${r.key}′ | dinâmico: ′Descanso ${n}, em minutos′ | [9292](../app.js#L9292) |
| FormDraft | button button |  | Começar do zero | [9471](../app.js#L9471) |
| studyWhenFields | input date | dinâmico: p + '-date' |  | [9493](../app.js#L9493) |
| studyWhenFields | input number | dinâmico: p + '-min' |  | [9498](../app.js#L9498) |
| studyWhenFields | button button |  |  | [9504](../app.js#L9504) |
| studyWhenFields | button button |  |  | [9506](../app.js#L9506) |
| studyWhenFields | button button |  | dinâmico: v + ' min' | [9510](../app.js#L9510) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'mode-ic', 'aria-hidden':'true' }, icon(ic, 'nav-icon')) | [9749](../app.js#L9749) |
| openRegisterModal | button button |  | dinâmico: v === null ? 'Livre' : v + ' min' | [9773](../app.js#L9773) |
| openRegisterModal | button button |  | dinâmico: pr.v === 'custom' ? pr.label : ′${pr.label} · ${pr.focusMin}/${pr.shortMin}′ | [9785](../app.js#L9785) |
| openRegisterModal | input number | dinâmico: 'rm-pomo-' + key |  | [9792](../app.js#L9792) |
| openRegisterModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:title }) | [9806](../app.js#L9806) |
| openRegisterModal | button button |  | Começar sem escolher a disciplina — você escolhe ao finalizar | [9818](../app.js#L9818) |
| confirmLong | button button |  | Corrigir | [9892](../app.js#L9892) |
| confirmLong | button button |  | Sim, registrar | [9907](../app.js#L9907) |
| openRegisterModal | button button |  | dinâmico: primaryLabel() | [9914](../app.js#L9914) |
| openRegisterModal | button button |  | Cancelar | [10009](../app.js#L10009) |
| openFinishModal | input number | fin-min |  | [10072](../app.js#L10072) |
| openFinishModal | details  |  | dinâmico: fixToggle | [10117](../app.js#L10117) |
| renderOutcome | select  | fin-method |  | [10151](../app.js#L10151) |
| openFinishModal | button button |  | Registrar estudo | [10193](../app.js#L10193) |
| openFinishModal | button button |  | dinâmico: snap.paused ? 'Voltar ao cronômetro' : snap.onBreak ? 'Voltar ao descanso' : 'Continuar estudando' | [10270](../app.js#L10270) |
| offerStaleSession | button button |  | Continuar | [10297](../app.js#L10297) |
| offerStaleSession | button button |  | Descartar | [10298](../app.js#L10298) |
| offerStaleSession | button button |  | Finalizar | [10299](../app.js#L10299) |
| renderToday | button button |  | dinâmico: icon('i-plus') | [11133](../app.js#L11133) |
| renderToday | button button |  | Quero ajuda para organizar | [11134](../app.js#L11134) |
| todayAction | button button |  | dinâmico: ′Começar a estudar ${d.name} agora′ | [11165](../app.js#L11165) |
| todayAction | button button |  | dinâmico: icon('i-check') | [11179](../app.js#L11179) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11180](../app.js#L11180) |
| todayAction | button button |  | dinâmico: icon('i-plus') | [11181](../app.js#L11181) |
| todayAction | button button |  | dinâmico: icon('i-play') | [11198](../app.js#L11198) |
| todayAction | button button |  | Por quê? | [11200](../app.js#L11200) |
| todayAction | button button |  | Outras opções | [11201](../app.js#L11201) |
| todayWeekPanel | button button |  | Ver nas Análises | [11253](../app.js#L11253) |
| todayWeekPanel | button button |  | dinâmico: ′${fmtDuration(weekMin)} estudadas nesta semana, em ${plural(active.size, 'dia', 'dias')}. Abrir nas | [11254](../app.js#L11254) |
| todayWeekPanel | button button |  | dinâmico: ′Resultados desta semana: ${resultsLine}. Ver nas Análises′ | [11261](../app.js#L11261) |
| todayWeekPanel | button button |  | Definir uma meta para a semana | [11264](../app.js#L11264) |
| todayNextSteps | button button |  | Revisar | [11281](../app.js#L11281) |
| todayNextSteps | button button |  | dinâmico: ′Ver ${plural(nTopics, 'assunto', 'assuntos')}′ | [11282](../app.js#L11282) |
| todayNextSteps | button button |  | dinâmico: ′ver ${dls.length}′ | [11309](../app.js#L11309) |
| todayShortcuts | button button |  | dinâmico: icon(NAV_ICONS[v] \|\| 'i-arrow', 'nav-icon sc-ic') | [11340](../app.js#L11340) |
| nextRow | button button |  | dinâmico: main | [11377](../app.js#L11377) |
| openAlternatives | button button |  | dinâmico: 'Estudar ' + a.discipline.name | [11389](../app.js#L11389) |
| explainAction | button button |  | Fechar | [11403](../app.js#L11403) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11438](../app.js#L11438) |
| renderReviews | button button |  | Como funcionam as revisões? | [11439](../app.js#L11439) |
| renderReviews | button button |  | Adicionar um tópico | [11440](../app.js#L11440) |
| renderReviews | button button |  | dinâmico: icon('i-play') | [11453](../app.js#L11453) |
| renderReviews | button button |  | dinâmico: icon('i-review') | [11454](../app.js#L11454) |
| renderReviews | button button |  | Como funciona? | [11455](../app.js#L11455) |
| renderReviews | button button |  | Religar sugestões | [11456](../app.js#L11456) |
| reviewSituation | details  |  | dinâmico: h('summary', null, 'Situação detalhada') | [11491](../app.js#L11491) |
| drawReviewGroups | button button |  | Limpar busca | [11528](../app.js#L11528) |
| drawReviewGroups | button button |  | dinâmico: ui.reviewsShowAll ? 'Mostrar menos' : ′Mostrar todos (${all.length})′ | [11539](../app.js#L11539) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t' }, q ? highlightMatch(t.name, q) : t.name) | [11555](../app.js#L11555) |
| drawReviewGroups | button button |  | dinâmico: 'Revisar agora ' + t.name | [11558](../app.js#L11558) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Próximas sugestões' }), h('span', { class:'disclosure-count', t | [11560](../app.js#L11560) |
| drawReviewGroups | details  |  | dinâmico: h('summary', null, h('span', { text:'Deixados para depois' }), h('span', { class:'disclosure-count', | [11565](../app.js#L11565) |
| drawReviewGroups | button button |  | dinâmico: h('span', { class:'line-t', text:t.name }) | [11570](../app.js#L11570) |
| drawReviewGroups | button button |  | dinâmico: 'Mostrar de novo ' + t.name | [11573](../app.js#L11573) |
| drawReviewGroups | button button |  | Mostrar todos de novo | [11574](../app.js#L11574) |
| reviewGroupCard | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11591](../app.js#L11591) |
| reviewGroupCard | button button |  | dinâmico: 'Revisar agora ' + t.name | [11595](../app.js#L11595) |
| reviewGroupCard | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver os ${all.length} assuntos′ | [11610](../app.js#L11610) |
| reviewGroupCard | button button |  | dinâmico: icon('i-review') | [11613](../app.js#L11613) |
| reviewGroupCard | button button |  | Escolher assuntos | [11614](../app.js#L11614) |
| reviewRow | button button |  | dinâmico: ′${t.name}: ver assunto′ | [11638](../app.js#L11638) |
| reviewRow | button button |  | dinâmico: 'Revisar agora ' + t.name | [11642](../app.js#L11642) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [11709](../app.js#L11709) |
| openDisciplineReview | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [11721](../app.js#L11721) |
| openDisciplineReview | button button |  | Cancelar | [11743](../app.js#L11743) |
| openDisciplineReview | button button |  | Já revisei | [11744](../app.js#L11744) |
| openDisciplineReview | button button |  | dinâmico: icon('i-play') | [11750](../app.js#L11750) |
| startReview | button button |  | dinâmico: methodLabel(mv) | [11789](../app.js#L11789) |
| startReview | button button |  | Cancelar | [11799](../app.js#L11799) |
| startReview | button button |  | Registrar sem cronômetro | [11800](../app.js#L11800) |
| startReview | button button |  | Começar revisão | [11802](../app.js#L11802) |
| openReviewOutcomeModal | input number | ro-min |  | [11815](../app.js#L11815) |
| openReviewOutcomeModal | textarea  | ro-comment |  | [11823](../app.js#L11823) |
| openReviewOutcomeModal | button button |  | Cancelar | [11825](../app.js#L11825) |
| openReviewOutcomeModal | button button |  | Registrar revisão | [11826](../app.js#L11826) |
| openSessionBuilder | button button |  | dinâmico: v + ' min' | [11874](../app.js#L11874) |
| openSessionBuilder | input number | sb-custom | Outro valor | [11878](../app.js#L11878) |
| openSessionBuilder | button button |  | Cancelar | [11892](../app.js#L11892) |
| openSessionBuilder | button button |  | Começar | [11893](../app.js#L11893) |
| openReviewPrimer | button button |  | O que é revisão? | [11952](../app.js#L11952) |
| openReviewPrimer | button button |  | Por que não basta reler? | [11953](../app.js#L11953) |
| renderPlan | button button |  | Ir para Disciplinas | [12439](../app.js#L12439) |
| renderPlan | button button |  | dinâmico: hrs + ' h' | [12452](../app.js#L12452) |
| renderPlan | button button |  | Outro valor | [12453](../app.js#L12453) |
| renderPlan | button button |  | Para que serve o planejamento? | [12457](../app.js#L12457) |
| renderPlan | input number | plan-avail-h |  | [12467](../app.js#L12467) |
| renderPlan | input text | plan-name |  | [12475](../app.js#L12475) |
| renderPlan | button button |  | dinâmico: plan ? 'Cancelar' : 'Voltar' | [12481](../app.js#L12481) |
| renderPlan | button button |  | Sugerir automaticamente | [12489](../app.js#L12489) |
| renderPlan | select  |  | dinâmico: 'Prioridade de ' + disc.name | [12531](../app.js#L12531) |
| renderPlan | input number |  | dinâmico: 'Mínimo semanal sugerido de ' + disc.name | [12535](../app.js#L12535) |
| renderPlan | input number |  | dinâmico: 'Minutos sugeridos de ' + disc.name | [12538](../app.js#L12538) |
| renderPlan | button button |  | Salvar e usar nesta semana | [12554](../app.js#L12554) |
| renderPlan | button button |  | Salvar só a partir da próxima semana | [12555](../app.js#L12555) |
| openPlansDrawer | button button |  | Ativar | [12577](../app.js#L12577) |
| openPlansDrawer | button button |  | excluir | [12578](../app.js#L12578) |
| openPlansDrawer | button button |  | dinâmico: icon('i-plus') | [12580](../app.js#L12580) |
| createSimplePlan | button button |  | Personalizar distribuição | [12613](../app.js#L12613) |
| createSimplePlan | button button |  | Usar esta sugestão | [12618](../app.js#L12618) |
| openNewPlanModal | input text | np-name | Ex.: Preparação para a prova de Inglês | [12700](../app.js#L12700) |
| openNewPlanModal | input number | np-hours |  | [12701](../app.js#L12701) |
| openNewPlanModal | button button |  | Cancelar | [12710](../app.js#L12710) |
| openNewPlanModal | button button |  | Criar | [12711](../app.js#L12711) |
| planWeekHead | button button |  | Alterar meta | [12863](../app.js#L12863) |
| planWeekHead | button button |  | Personalizar distribuição | [12864](../app.js#L12864) |
| planWeekHead | button button |  | dinâmico: state.plans.length > 1 ? ′Seus planos (${state.plans.length})′ : 'Criar outro plano' | [12865](../app.js#L12865) |
| planUsage | button button |  | dinâmico: compare ? 'Esconder a sugestão' : 'Comparar com a sugestão' | [12890](../app.js#L12890) |
| planUsage | button button |  | dinâmico: ui.planUsageAll ? 'Mostrar menos' : ′Mostrar todas (${rows.length})′ | [12909](../app.js#L12909) |
| openWeekGoalModal | input number | wg-h | Outro valor, em horas | [12923](../app.js#L12923) |
| openWeekGoalModal | button button |  | dinâmico: fmtDuration(v) | [12927](../app.js#L12927) |
| openWeekGoalModal | input checkbox | wg-redist |  | [12930](../app.js#L12930) |
| openWeekGoalModal | button button |  | Cancelar | [12949](../app.js#L12949) |
| openWeekGoalModal | button button |  | Salvar meta | [12950](../app.js#L12950) |
| planWeekNav | button button |  | Semana anterior | [12986](../app.js#L12986) |
| planWeekNav | button button |  | Próxima semana | [12988](../app.js#L12988) |
| planWeekNav | button button |  | Ir para esta semana | [12991](../app.js#L12991) |
| planWeekNav | button button |  | dinâmico: icon('i-plan') | [12992](../app.js#L12992) |
| planWeekNav | button button |  | dinâmico: view.hasTemplate ? 'Usar esta organização nas próximas semanas' : 'Repetir nas próximas semanas' | [13005](../app.js#L13005) |
| planWeekNav | button button |  | Voltar ao modelo | [13009](../app.js#L13009) |
| planWeekNav | button button |  | Limpar os dias | [13012](../app.js#L13012) |
| planWeekNotices | button button |  | Ajustar os blocos | [13041](../app.js#L13041) |
| planWeekNotices | button button |  | dinâmico: x.goal > 0 ? ′Sugerir ${fmtDuration(x.scheduled)}′ : ′Incluir com ${fmtDuration(x.scheduled)}′ | [13042](../app.js#L13042) |
| planWeekNotices | button button |  | Manter assim | [13044](../app.js#L13044) |
| planTray | button button |  | dinâmico: icon('i-plus') | [13083](../app.js#L13083) |
| planTray | button button |  | dinâmico: ui.planTrayAll ? 'Mostrar menos' : ′Mostrar todas (${discs.length})′ | [13085](../app.js#L13085) |
| trayCard | button button |  | dinâmico: ′Sugestão para ${d.name}: ${sug > 0 ? fmtDuration(sug) : 'nenhuma'}. Ajustar′ | [13103](../app.js#L13103) |
| openSuggestionEditor | input number | sg-min | Outro valor, em minutos | [13130](../app.js#L13130) |
| openSuggestionEditor | button button |  | dinâmico: fmtDuration(v) | [13134](../app.js#L13134) |
| openSuggestionEditor | button button |  | Tirar da sugestão | [13156](../app.js#L13156) |
| openSuggestionEditor | button button |  | Só nesta semana | [13157](../app.js#L13157) |
| openSuggestionEditor | button button |  | Nesta e nas próximas | [13158](../app.js#L13158) |
| openSuggestionPicker | input search | sp-q | Buscar disciplina | [13173](../app.js#L13173) |
| openSuggestionPicker | button button |  | dinâmico: h('span', { class:'sp-name' }, terms.length ? highlightMatch(d.name, input.value) : d.name) | [13179](../app.js#L13179) |
| openSuggestionPicker | button button |  | Cancelar | [13199](../app.js#L13199) |
| deadlineChip | button button |  | dinâmico: ′${info.dueWord}: ${dl.title}${where ? ', ' + where : ''}${done ? ', concluído' : ''}. Abrir prazo′ | [13275](../app.js#L13275) |
| blockItem | button button |  | dinâmico: label + (view.editable ? ' Editar' : '') | [13306](../app.js#L13306) |
| planOffDays | button button |  | Personalizar dias | [13346](../app.js#L13346) |
| weekConflictDialog | button button |  | Ver a versão atual | [13360](../app.js#L13360) |
| weekConflictDialog | button button |  | Aplicar a minha mudança | [13361](../app.js#L13361) |
| openBlockEditor | select  | be-day | dinâmico: view.dates.map(iso => h('option', { value:iso, selected: iso === b.date }, WeekPlan.dayLong(iso) + ( | [13478](../app.js#L13478) |
| openBlockEditor | input number | be-min | Outra duração, em minutos | [13481](../app.js#L13481) |
| openBlockEditor | button button |  | dinâmico: v === null ? 'Só o dia' : fmtDurationWords(v) | [13485](../app.js#L13485) |
| openBlockEditor | button button |  | dinâmico: timeOn ? 'Tirar o horário' : '+ Definir um horário (opcional)' | [13495](../app.js#L13495) |
| openBlockEditor | button button |  | Salvar | [13517](../app.js#L13517) |
| openBlockEditor | button button |  | Tirar deste dia | [13540](../app.js#L13540) |
| openBlockEditor | button button |  | Cancelar | [13541](../app.js#L13541) |
| openMoveDialog | button button |  | dinâmico: h('span', { class:'md-name', text: WeekPlan.dayLong(iso) }) | [13556](../app.js#L13556) |
| openMoveDialog | button button |  | Cancelar | [13565](../app.js#L13565) |
| openStudyDaysModal | input checkbox | dinâmico: 'sd-' + dow |  | [13576](../app.js#L13576) |
| openStudyDaysModal | button button |  | Cancelar | [13590](../app.js#L13590) |
| openStudyDaysModal | button button |  | Salvar | [13591](../app.js#L13591) |
| openAdjustBlocks | input number | dinâmico: 'ab-' + b.id | dinâmico: ′Minutos em ${WeekPlan.dayFull(b.date)}′ | [13622](../app.js#L13622) |
| openAdjustBlocks | button button |  | Cancelar | [13637](../app.js#L13637) |
| openAdjustBlocks | button button |  | Salvar | [13638](../app.js#L13638) |
| openGoalUpdate | button button |  | Cancelar | [13671](../app.js#L13671) |
| openGoalUpdate | button button |  | Só nesta semana | [13672](../app.js#L13672) |
| openGoalUpdate | button button |  | Nesta e nas próximas | [13673](../app.js#L13673) |
| priorityPicker | button button |  | dinâmico: ′${level.v} · ${level.label}′ | [13932](../app.js#L13932) |
| priorityInline | button button |  | dinâmico: ′Prioridade ${level.v} · ${level.label}′ | [13993](../app.js#L13993) |
| contextSearch | input search | dinâmico: o.id | dinâmico: o.label | [14302](../app.js#L14302) |
| contextSearch | button button |  | Limpar busca | [14304](../app.js#L14304) |
| choiceMenu | button button |  | dinâmico: o.ariaLabel | [14332](../app.js#L14332) |
| choiceMenu | button button |  | dinâmico: icon('i-check', 'cm-check') | [14342](../app.js#L14342) |
| collectionView | button button |  | Limpar busca | [14433](../app.js#L14433) |
| collectionView | button button |  | Mostrar todos | [14434](../app.js#L14434) |
| renderDisciplines | button button | dinâmico: 'dtab-' + v | dinâmico: label | [14906](../app.js#L14906) |
| indexRow | button button |  | dinâmico: o.ariaLabel \|\| null | [14949](../app.js#L14949) |
| levelHead | button button |  | dinâmico: c.label | [14970](../app.js#L14970) |
| levelHead | button button |  | dinâmico: 'Voltar para ' + parent.label | [14971](../app.js#L14971) |
| discRootLevel | button button |  | Adicionar uma disciplina | [15042](../app.js#L15042) |
| discRootLevel | button button |  | Como organizar meus estudos? | [15043](../app.js#L15043) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Disciplinas arquivadas (${archivedDiscs.length} | [15049](../app.js#L15049) |
| discRootLevel | button button |  | dinâmico: ui.showArchivedAreas ? 'Ocultar áreas arquivadas' : ′Áreas arquivadas (${hiddenAreas.length})′ | [15054](../app.js#L15054) |
| discAreaLevel | button button |  | dinâmico: icon('i-plus') | [15130](../app.js#L15130) |
| discAreaLevel | button button |  | Organizar em uma área | [15141](../app.js#L15141) |
| discAreaLevel | button button |  | Reativar | [15149](../app.js#L15149) |
| discAreaLevel | button button |  | Adicionar disciplina | [15168](../app.js#L15168) |
| discAreaLevel | button button |  | Agora não | [15169](../app.js#L15169) |
| discAreaLevel | button button |  | dinâmico: ui.showArchivedDisciplines ? 'Ocultar arquivadas' : ′Arquivadas (${archived.length})′ | [15179](../app.js#L15179) |
| discDisciplineLevel | button button |  | Reativar | [15208](../app.js#L15208) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-play') | [15209](../app.js#L15209) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-review') | [15210](../app.js#L15210) |
| discDisciplineLevel | button button |  | Editar | [15211](../app.js#L15211) |
| discDisciplineLevel | input text | dd-new-topic | Nome do novo tópico | [15220](../app.js#L15220) |
| discDisciplineLevel | button button |  | dinâmico: icon('i-plus') | [15256](../app.js#L15256) |
| discDisciplineLevel | button button |  | Adicionar vários de uma vez | [15258](../app.js#L15258) |
| discDisciplineLevel | details  |  | dinâmico: h('summary', null, h('span', { text:'Tópicos arquivados' }), h('span', { class:'disclosure-count', t | [15262](../app.js#L15262) |
| topicRow | button button |  | dinâmico: ′Subir ${t.name}′ | [15293](../app.js#L15293) |
| topicRow | button button |  | dinâmico: ′Descer ${t.name}′ | [15295](../app.js#L15295) |
| topicDetailContent | button button |  | Reativar tópico | [15343](../app.js#L15343) |
| topicDetailContent | button button |  | dinâmico: icon('i-play') | [15346](../app.js#L15346) |
| topicDetailContent | button button |  | Revisar agora | [15347](../app.js#L15347) |
| topicDetailContent | button button |  | Editar | [15348](../app.js#L15348) |
| topicDetailContent | button button |  | abrir em Disciplinas | [15349](../app.js#L15349) |
| topicDetailContent | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [15363](../app.js#L15363) |
| topicDetailContent | details  |  | dinâmico: h('summary', null, h('span', { text:'Mais detalhes' })) | [15376](../app.js#L15376) |
| areaNudgeCard | button button |  | Organizar | [15445](../app.js#L15445) |
| areaNudgeCard | button button |  | Agora não | [15446](../app.js#L15446) |
| openAreaModal | input text | ar-name | Ex.: Escola, Faculdade ou Concurso | [15479](../app.js#L15479) |
| openAreaModal | input checkbox |  |  | [15487](../app.js#L15487) |
| openAreaModal | button button |  | dinâmico: area ? 'Salvar' : 'Criar área' | [15502](../app.js#L15502) |
| openAreaModal | button button |  | Cancelar | [15550](../app.js#L15550) |
| openDisciplineModal | input text | dm-name | Ex.: Português, Matemática ou Inglês | [15640](../app.js#L15640) |
| openDisciplineModal | select  | dm-area |  | [15645](../app.js#L15645) |
| openDisciplineModal | input text | dm-new-area | Nome da nova área | [15650](../app.js#L15650) |
| openDisciplineModal | select  | dm-nature |  | [15672](../app.js#L15672) |
| openDisciplineModal | select  | dm-strategy |  | [15676](../app.js#L15676) |
| openDisciplineModal | select  | dm-method |  | [15682](../app.js#L15682) |
| openDisciplineModal | details  |  | dinâmico: h('summary', null, 'Mais opções') | [15688](../app.js#L15688) |
| openDisciplineModal | button button |  | dinâmico: disc ? 'Salvar' : 'Criar disciplina' | [15710](../app.js#L15710) |
| openDisciplineModal | button button |  | Cancelar | [15767](../app.js#L15767) |
| openDisciplineModal | button button |  | dinâmico: disc.archived ? 'Reativar' : 'Arquivar' | [15769](../app.js#L15769) |
| openDisciplineModal | button button |  | excluir definitivamente | [15771](../app.js#L15771) |
| topicReviewOptions | select  | tm-strategy |  | [15889](../app.js#L15889) |
| topicReviewOptions | select  | tm-method |  | [15894](../app.js#L15894) |
| topicReviewOptions | details  |  | dinâmico: h('summary', null, 'Opções de revisão') | [15899](../app.js#L15899) |
| reviewToggle | input checkbox | tm-review |  | [15910](../app.js#L15910) |
| topicEditor | input text | tm-name | dinâmico: 'Ex.: ' + exTopic | [15955](../app.js#L15955) |
| topicEditor | button button |  | Prefere adicionar vários tópicos de uma vez? | [15999](../app.js#L15999) |
| showTwin | button button |  | Usar este tópico | [16016](../app.js#L16016) |
| showTwin | button button |  | dinâmico: o.onUseExisting ? 'Reativar e usar' : 'Reativar' | [16021](../app.js#L16021) |
| showTwin | button button |  | dinâmico: topic ? 'Salvar mesmo assim' : 'Criar outro com o mesmo nome' | [16022](../app.js#L16022) |
| topicEditor | button button |  | dinâmico: saveLabel | [16103](../app.js#L16103) |
| topicEditor | button button |  | dinâmico: o.inRegistration ? 'Voltar ao registro' : 'Cancelar' | [16105](../app.js#L16105) |
| topicEditor | button button |  | Arquivar | [16109](../app.js#L16109) |
| openBulkTopicModal | textarea  | tm-multi | Pontuação Uso da crase Concordância verbal | [16142](../app.js#L16142) |
| openBulkTopicModal | button button |  | Cancelar | [16155](../app.js#L16155) |
| openBulkTopicModal | button button |  | Adicionar tópicos | [16156](../app.js#L16156) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16196](../app.js#L16196) |
| deadlinesPanel | button button |  | dinâmico: icon('i-plus') | [16201](../app.js#L16201) |
| deadlinesPanel | button button |  | Como funcionam os prazos? | [16202](../app.js#L16202) |
| deadlinesPanel | button button |  | dinâmico: ′Concluir ${dl.title}′ | [16205](../app.js#L16205) |
| deadlinesPanel | button button |  | dinâmico: ′Reabrir ${dl.title}′ | [16207](../app.js#L16207) |
| deadlinesPanel | details  |  | dinâmico: h('summary', null, h('span', { text:'Concluídos' }), h('span', { class:'disclosure-count', text:Stri | [16243](../app.js#L16243) |
| openDeadlineDrawer | button button |  | Reabrir | [16339](../app.js#L16339) |
| openDeadlineDrawer | button button |  | dinâmico: icon('i-check') | [16340](../app.js#L16340) |
| openDeadlineDrawer | button button |  | Editar | [16341](../app.js#L16341) |
| openDeadlineDrawer | button button |  | Ver tópico | [16342](../app.js#L16342) |
| openDeadlineDrawer | button button |  | excluir | [16343](../app.js#L16343) |
| openDeadlineModal | input text | dl-title | Ex.: Prova de Inglês | [16358](../app.js#L16358) |
| openDeadlineModal | input date | dl-date |  | [16359](../app.js#L16359) |
| openDeadlineModal | input date | dl-start |  | [16361](../app.js#L16361) |
| openDeadlineModal | button button |  | dinâmico: t.label | [16367](../app.js#L16367) |
| openDeadlineModal | select  | dl-disc |  | [16379](../app.js#L16379) |
| openDeadlineModal | select  | dl-topic |  | [16387](../app.js#L16387) |
| openDeadlineModal | textarea  | dl-instr | Ex.: Entregar relatório com topologia, endereçamento e testes. | [16405](../app.js#L16405) |
| openDeadlineModal | textarea  | dl-notes | Ex.: O professor também pediu capturas do simulador. | [16407](../app.js#L16407) |
| openDeadlineModal | details  |  | dinâmico: h('summary', null, 'Orientações e anotações') | [16425](../app.js#L16425) |
| openDeadlineModal | button button |  | Cancelar | [16437](../app.js#L16437) |
| openDeadlineModal | button button |  | dinâmico: dl ? 'Salvar' : 'Adicionar prazo' | [16438](../app.js#L16438) |
| openDeadlineModal | button button |  | excluir | [16476](../app.js#L16476) |
| renderAnalyticsSelector | button button |  | dinâmico: p.label | [16910](../app.js#L16910) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-ready-ic', 'aria-hidden':'true' }, icon(it.icon, 'nav-icon')) | [16919](../app.js#L16919) |
| renderAnalyticsSelector | button button |  | dinâmico: h('span', { class:'an-custom-t', text:'Personalizar análise' }) | [16935](../app.js#L16935) |
| analyticsShelf | button button |  | dinâmico: it.saved ? icon('i-bookmark', 'btn-icon an-shelf-ic') : icon('i-history', 'btn-icon an-shelf-ic') | [16969](../app.js#L16969) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:k.label }) | [16989](../app.js#L16989) |
| analyticsCustomBuilder | button button |  | dinâmico: p.label | [17018](../app.js#L17018) |
| analyticsCustomBuilder | button button |  | dinâmico: h('span', { class:'an-option-t', text:f.label }) | [17046](../app.js#L17046) |
| analyticsCustomBuilder | button button |  | Cancelar | [17063](../app.js#L17063) |
| analyticsCustomBuilder | button button |  | Gerar análise | [17064](../app.js#L17064) |
| analyticsTypeFilter | button button |  | Todos os tipos | [17072](../app.js#L17072) |
| analyticsTypeFilter | button button |  | dinâmico: t.label | [17076](../app.js#L17076) |
| scopePicker | button button |  | dinâmico: h('span', { class:'an-pick-box', 'aria-hidden':'true' }, icon('i-check', 'btn-icon')) | [17161](../app.js#L17161) |
| scopePicker | button button |  | dinâmico: ′Tirar ${byId.get(id).name}′ | [17169](../app.js#L17169) |
| scopePicker | button button |  | limpar | [17171](../app.js#L17171) |
| scopePicker | input search |  | dinâmico: labels[kind] | [17204](../app.js#L17204) |
| saveCurrentAnalysis | input text | sa-name |  | [17228](../app.js#L17228) |
| saveCurrentAnalysis | button button |  | Cancelar | [17243](../app.js#L17243) |
| saveCurrentAnalysis | button button |  | Salvar | [17244](../app.js#L17244) |
| renameSavedAnalysis | input text | sa-rename |  | [17253](../app.js#L17253) |
| renameSavedAnalysis | button button |  | Cancelar | [17263](../app.js#L17263) |
| renameSavedAnalysis | button button |  | Salvar | [17263](../app.js#L17263) |
| rangePicker | button button |  | Mês anterior | [17300](../app.js#L17300) |
| rangePicker | button button |  | Próximo mês | [17302](../app.js#L17302) |
| rangePicker | button button |  | dinâmico: fmtDateLong(iso) + (iso === tISO ? ', hoje' : '') | [17320](../app.js#L17320) |
| rangePicker | input date | an-rs |  | [17343](../app.js#L17343) |
| rangePicker | input date | an-re |  | [17344](../app.js#L17344) |
| rangePicker | button button |  | limpar datas | [17362](../app.js#L17362) |
| analyticsPanorama | button button |  | dinâmico: distMode === 'topic' ? 'Ver todos os tópicos' : 'Ver todas as disciplinas' | [17483](../app.js#L17483) |
| analyticsPanorama | button button |  | dinâmico: ′${pth.title}: ${f.disabled ? f.reason : (teaser[pth.focus] ? teaser[pth.focus]() : '')}′ | [17526](../app.js#L17526) |
| analyticsPanorama | button button |  | Personalizar análise | [17535](../app.js#L17535) |
| heroFact | button button |  | dinâmico: ′${label}: ${value} ${sub \|\| ''}. Ver detalhes′ | [17542](../app.js#L17542) |
| analyticsNextQuestions | button button |  | dinâmico: h('span', { class:'an-next-t', text: focusInfo(f).question }) | [17567](../app.js#L17567) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro ${sc.label}: analisar todos os estudos′ | [17580](../app.js#L17580) |
| analyticsResultHeader | button button |  | dinâmico: ′Tirar o filtro de tipos ${sc.typesLabel}′ | [17582](../app.js#L17582) |
| analyticsResultHeader | button button |  | dinâmico: p.label | [17587](../app.js#L17587) |
| analyticsResultHeader | button button |  | dinâmico: q.periodPreset === 'custom' ? fmtRangeLabel(a.range) : 'Outro…' | [17590](../app.js#L17590) |
| analyticsResultHeader | button button |  | limpar | [17601](../app.js#L17601) |
| analyticsResultHeader | button button |  | dinâmico: icon('i-back') | [17604](../app.js#L17604) |
| analyticsResultHeader | button button |  | Alterar análise | [17605](../app.js#L17605) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17624](../app.js#L17624) |
| analyticsEmptyFor | button button |  | Abrir Planejamento | [17641](../app.js#L17641) |
| analyticsEmptyFor | button button |  | Registrar estudo | [17654](../app.js#L17654) |
| analyticsEmptyFor | button button |  | Abrir o Histórico | [17658](../app.js#L17658) |
| analyticsEmptyFor | button button |  | Escolher outro período | [17673](../app.js#L17673) |
| analyticsEmptyFor | button button |  | dinâmico: label | [17674](../app.js#L17674) |
| resultPages | button button |  | dinâmico: o.more \|\| 'Mostrar mais' | [17718](../app.js#L17718) |
| conceptsViz | button button |  | dinâmico: ′${x.r.label}: ${EvidenceModel.conceptLabel(x.r.status)}. Ver o estudo′ | [17774](../app.js#L17774) |
| milestonesViz | button button |  | ver o estudo | [17793](../app.js#L17793) |
| metricCard | button button |  | dinâmico: ′${o.label}${whenText ? ' (' + whenText.toLowerCase() + ')' : ''}: ${val}${o.sub ? '. ' + o.sub : '' | [18090](../app.js#L18090) |
| planVsActualViz | button button |  | dinâmico: ′${r.label}: ${value}. Ver detalhes′ | [18298](../app.js#L18298) |
| dueReviewsViz | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18364](../app.js#L18364) |
| dueReviewsViz | button button |  | Revisar | [18368](../app.js#L18368) |
| deadlineLine | button button |  | dinâmico: ′${dl.title}, ${done ? 'concluído' : DeadlineEngine.dueText(dl)}, ${fmtDateLong(dl.date)}′ | [18424](../app.js#L18424) |
| analyticsInsightsBlock | button button |  | dinâmico: ui.analyticsShowAllInsights ? 'Mostrar menos' : ′Ver todos os insights (${items.length})′ | [18494](../app.js#L18494) |
| analyticsExploreBlock | button button | dinâmico: bodyId + '-b' | dinâmico: h('span', { class:'an-explore-l', text:it.label }) | [18581](../app.js#L18581) |
| restDetail | button button |  | dinâmico: ′Abrir o estudo de ${fmtDateBR(s.date)}′ | [18631](../app.js#L18631) |
| menuButton | button button |  | dinâmico: o.ariaLabel \|\| label | [18650](../app.js#L18650) |
| menuButton | button button |  | dinâmico: it.label | [18660](../app.js#L18660) |
| analyticsAttentionCard | button button |  | dinâmico: h('span', { class:'line-t', text:x.topic.name }) | [18686](../app.js#L18686) |
| analyticsAttentionCard | button button |  | Abrir revisões | [18692](../app.js#L18692) |
| analyticsDeadlinesCard | button button |  | + Adicionar prazo | [18701](../app.js#L18701) |
| hbarRow | button button |  | dinâmico: ′${label}: ${valueText}′ | [18724](../app.js#L18724) |
| openAnalyticsDrawer | button button |  | dinâmico: ′Editar o estudo de ${fmtDateBR(s.date)}′ | [18815](../app.js#L18815) |
| openAnalyticsDrawer | button button |  | Ver todas no Histórico | [18824](../app.js#L18824) |
| openAnalyticsDrawer | button button |  | Analisar todos os estudos | [18849](../app.js#L18849) |
| openAnalyticsDrawer | button button |  | Abrir Planejamento | [18852](../app.js#L18852) |
| openAnalyticsDrawer | button button |  | Abrir revisões | [18901](../app.js#L18901) |
| openAnalyticsDrawer | button button |  | Abrir tópico | [18922](../app.js#L18922) |
| openAnalyticsDrawer | button button |  | dinâmico: h('span', { class:'line-t', text:tp.name }) | [18945](../app.js#L18945) |
| analyticsCalendarCard | button button |  | Cancelar seleção | [18971](../app.js#L18971) |
| analyticsCalendarCard | button button |  | Selecionar intervalo | [18972](../app.js#L18972) |
| analyticsCalendarCard | button button |  | Analisar este período | [18984](../app.js#L18984) |
| analyticsCalendarCard | button button |  | Cancelar | [18988](../app.js#L18988) |
| calendarHeatmap | button button |  | Mês anterior | [19004](../app.js#L19004) |
| calendarHeatmap | button button |  | Próximo mês | [19006](../app.js#L19006) |
| calendarHeatmap | button button |  | mês atual | [19007](../app.js#L19007) |
| calendarHeatmap | button button |  | dinâmico: parts.join(', ') | [19052](../app.js#L19052) |
| openDayDrawer | button button |  | Editar este estudo | [19149](../app.js#L19149) |
| openDayDrawer | button button |  | Analisar este dia | [19161](../app.js#L19161) |
| openDayDrawer | button button |  | Registrar estudo neste dia | [19166](../app.js#L19166) |
| timeChart | button button |  | dinâmico: ′${granularity === 'day' ? fmtDateBR(s.key) : (granularity === 'week' ? 'Semana de ' + s.label : s.l | [19209](../app.js#L19209) |
| openBucketDrawer | button button |  | Analisar este período | [19259](../app.js#L19259) |
| analyticsDistributionCard | button button |  | dinâmico: l | [19281](../app.js#L19281) |
| openDistributionDrawer | button button |  | dinâmico: goLabel | [19346](../app.js#L19346) |
| openDistributionDrawer | button button |  | dinâmico: mode === 'discipline' ? 'Ver disciplina' : 'Ver tópico' | [19347](../app.js#L19347) |
| donutLegend | button button |  | dinâmico: ′${r.label}: ${fmtDuration(r.minutes)}, ${safePct(r.pct)} do tempo. Ver detalhes′ | [19382](../app.js#L19382) |
| analyticsPriorityCard | button button |  | dinâmico: ′${d.name} · ${PriorityEngine.clamp(d.priority)}′ | [19429](../app.js#L19429) |
| analyticsPriorityCard | button button |  | dinâmico: ′${tp.name} · ${PriorityEngine.clamp(tp.priority)}′ | [19434](../app.js#L19434) |
| analyticsReviewsCard | button button |  | Ver detalhes das revisões | [19486](../app.js#L19486) |
| weeklyReportCard | button button |  | Semana anterior | [19552](../app.js#L19552) |
| weeklyReportCard | button button |  | Próxima semana | [19554](../app.js#L19554) |
| copySummary | textarea  |  | Resumo do período | [19861](../app.js#L19861) |
| copySummary | button button |  | Fechar | [19862](../app.js#L19862) |
| historyDiscoveries | button button |  | dinâmico: a.label | [20036](../app.js#L20036) |
| historyDiscoveries | button button |  | Ver registros usados | [20037](../app.js#L20037) |
| historyDiscoveries | button button |  | dinâmico: open ? 'Mostrar menos' : ′Ver mais descobertas (${list.length - LIMIT})′ | [20040](../app.js#L20040) |
| renderHistory | button button |  | dinâmico: icon('i-play') | [20056](../app.js#L20056) |
| renderHistory | button button |  | Registrar estudo | [20057](../app.js#L20057) |
| renderHistory | button button |  | Filtros | [20068](../app.js#L20068) |
| renderHistory | button button |  | dinâmico: ′Remover filtro ${x.label}′ | [20075](../app.js#L20075) |
| renderHistory | button button |  | limpar tudo | [20077](../app.js#L20077) |
| openHistoryFilters | button button |  | Aplicar filtros | [20136](../app.js#L20136) |
| openHistoryFilters | button button |  | Limpar | [20139](../app.js#L20139) |
| renderHistoryTable | button button |  | Limpar busca | [20206](../app.js#L20206) |
| renderHistoryTable | button button |  | dinâmico: label | [20234](../app.js#L20234) |
| renderHistoryTable | button button |  | dinâmico: ′Mostrar mais (${list.length - shown.length} restantes)′ | [20246](../app.js#L20246) |
| openEditSessionModal | button button |  | remover estudo | [20414](../app.js#L20414) |
| openEditSessionModal | button button |  | Cancelar | [20420](../app.js#L20420) |
| openEditSessionModal | button button |  | Salvar | [20421](../app.js#L20421) |
| confirmLongEdit | button button |  | Voltar e corrigir | [20489](../app.js#L20489) |
| confirmLongEdit | button button |  | Está certo, salvar | [20490](../app.js#L20490) |
| openAIReportModal | textarea  |  | Texto do prompt | [20635](../app.js#L20635) |
| openAIReportModal | details  |  | dinâmico: h('summary', null, h('span', { text:'Ver o prompt' })) | [20636](../app.js#L20636) |
| openAIReportModal | button button |  | dinâmico: x.label | [20661](../app.js#L20661) |
| openAIReportModal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:p.label }) | [20675](../app.js#L20675) |
| openAIReportModal | input checkbox | air-comments |  | [20683](../app.js#L20683) |
| openAIReportModal | button button |  | dinâmico: retry.label | [20738](../app.js#L20738) |
| openAIReportModal | button button |  | dinâmico: icon('i-download', 'btn-icon') | [20746](../app.js#L20746) |
| openAIReportModal | button button |  | Só baixar o CSV | [20752](../app.js#L20752) |
| openAIReportModal | button button |  | Só copiar o prompt | [20753](../app.js#L20753) |
| openAIReportModal | button button |  | Fechar | [20763](../app.js#L20763) |
| runIntegrityCheck | button button |  | Fechar | [20795](../app.js#L20795) |
| renderData | input file | import-file |  | [20807](../app.js#L20807) |
| renderData | button button |  | dinâmico: icon('i-data') | [20820](../app.js#L20820) |
| renderData | button button |  | Onde meus dados ficam? | [20824](../app.js#L20824) |
| renderData | button button |  | Preparar | [20839](../app.js#L20839) |
| renderData | button button |  | Exportar | [20844](../app.js#L20844) |
| renderData | button button |  | Como usar meus dados com IA ou planilhas? | [20845](../app.js#L20845) |
| renderData | button button |  | Verificar | [20862](../app.js#L20862) |
| renderData | button button |  | Pedir ao navegador | [20867](../app.js#L20867) |
| renderData | button button |  | apagar cópia antiga da V2 | [20912](../app.js#L20912) |
| renderData | details  |  | dinâmico: h('summary', null, h('span', { text:'Apagar todos os dados' })) | [20919](../app.js#L20919) |
| renderData | button button |  | Apagar todos os dados | [20923](../app.js#L20923) |
| restoreRefused | button button |  | Entendi | [20960](../app.js#L20960) |
| askTimerBeforeRestore | button button |  | Cancelar a restauração | [20986](../app.js#L20986) |
| askTimerBeforeRestore | button button |  | Descartar o tempo e restaurar | [20987](../app.js#L20987) |
| askTimerBeforeRestore | button button |  | Finalizar o estudo primeiro | [20988](../app.js#L20988) |
| openRestorePreview | button button |  | dinâmico: hasData ? 'Substituir e restaurar' : 'Restaurar' | [21024](../app.js#L21024) |
| openRestorePreview | button button |  | Cancelar | [21061](../app.js#L21061) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′Ajustes que serão feitos (${sum(r.repaired, x => x.count)})′) | [21072](../app.js#L21072) |
| openRestorePreview | details  |  | dinâmico: h('summary', null, ′O que fica de fora (${sum(r.ignored, x => x.count)})′) | [21075](../app.js#L21075) |
| openRestorePreview | button button |  | Fazer backup dos dados atuais | [21080](../app.js#L21080) |
| bindEvents | button button |  | dinâmico: icon(NAV_ICONS[v], 'nav-icon') | [21153](../app.js#L21153) |
| bindEvents | button button |  | Fechar | [21155](../app.js#L21155) |
| helpDot | button button |  | dinâmico: 'O que é ' + info.title + '?' | [21788](../app.js#L21788) |
| GlossaryPopover | button button |  | dinâmico: glossaryCallLabel(key) | [21847](../app.js#L21847) |
| GlossaryPopover | button button |  | Fechar explicação | [21850](../app.js#L21850) |
| glossaryTerm | button button |  | dinâmico: (label \|\| g.term) + ' — ver explicação' | [21905](../app.js#L21905) |
| Palette | button button | dinâmico: 'pal-opt-' + i | dinâmico: icon(item.icon, 'nav-icon') | [22126](../app.js#L22126) |
| FocusMode | button button |  | dinâmico: a.label | [22283](../app.js#L22283) |
| pickDisciplineThen | button button |  | dinâmico: h('span', { text:d.name }) | [22468](../app.js#L22468) |
| pickDisciplineThen | button button |  | Cancelar | [22470](../app.js#L22470) |
| renderReturnPill | button button |  | dinâmico: 'Voltar à Ajuda: ' + r.label | [22549](../app.js#L22549) |
| renderReturnPill | button button |  | Fechar este atalho | [22551](../app.js#L22551) |
| pickDisciplineForPriority | button button |  | dinâmico: h('span', { text:d.name }) | [22573](../app.js#L22573) |
| pickDisciplineForPriority | button button |  | Cancelar | [22576](../app.js#L22576) |
| detailsBlock | button button |  | dinâmico: h('span', { text: d.title \|\| 'Entenda em mais detalhes' }) | [22612](../app.js#L22612) |
| helpBreadcrumb | button button |  | dinâmico: label | [22655](../app.js#L22655) |
| articleBody | button button |  | dinâmico: x.label | [22708](../app.js#L22708) |
| articleBody | button button |  | dinâmico: h('span', { text:'Entenda melhor' }) | [22721](../app.js#L22721) |
| articleBody | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:r.title }), h('div', { class:'hi-su | [22735](../app.js#L22735) |
| articleBody | button button |  | Ver este artigo na Central de Ajuda | [22745](../app.js#L22745) |
| helpItemButton | button button |  | dinâmico: h('span', { class:'hi-main' }, o.showPath ? h('div', { class:'hi-cat', text: articlePath(a) }) : nul | [22757](../app.js#L22757) |
| faqNode | button button |  | dinâmico: 'Ver explicação completa: ' + getArticle(f.article).title | [22772](../app.js#L22772) |
| faqNode | button button |  | dinâmico: h('span', { text:f.q }) | [22775](../app.js#L22775) |
| helpSearchCard | input search | help-q | Pesquisar na Ajuda | [22794](../app.js#L22794) |
| helpSearchCard | button button |  | Limpar busca | [22829](../app.js#L22829) |
| helpSearchCard | button button |  | dinâmico: '“' + x + '”' | [22839](../app.js#L22839) |
| helpResultsPanel | button button |  | Voltar para toda a Ajuda | [22924](../app.js#L22924) |
| helpResultsPanel | button button | dinâmico: id | dinâmico: h('span', { class:'hr-main' }, h('span', { class:'hr-path', text: e.path }), h('span', { class:'hr-t | [22938](../app.js#L22938) |
| helpResultsPanel | button button |  | dinâmico: 'Ver todos os ' + all.length + ' resultados' | [22955](../app.js#L22955) |
| helpSuggestionList | button button |  | dinâmico: icon('i-search', 'nav-icon') | [22967](../app.js#L22967) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hmq-q', text:mq.q }) | [23013](../app.js#L23013) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'hp-icon' }, icon(sec.icon, 'nav-icon')) | [23023](../app.js#L23023) |
| helpHomePanel | button button |  | Rever a apresentação | [23039](../app.js#L23039) |
| helpHomePanel | button button |  | Mostrar as dicas de novo | [23040](../app.js#L23040) |
| helpHomePanel | button button |  | Ver o guia | [23041](../app.js#L23041) |
| helpHomePanel | button button |  | Ver todas | [23048](../app.js#L23048) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Ciclo + outras ferramentas' }) | [23055](../app.js#L23055) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Glossário' }) | [23057](../app.js#L23057) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Entrar em contato' }) | [23059](../app.js#L23059) |
| helpHomePanel | button button |  | dinâmico: h('span', { class:'line-t', text:'Relatar um problema' }) | [23061](../app.js#L23061) |
| helpSectionPanel | button button |  | dinâmico: x.label | [23075](../app.js#L23075) |
| helpSectionPanel | button button |  | dinâmico: 'Ver todo o caminho “' + s.label + '”' | [23098](../app.js#L23098) |
| helpBackBar | button button |  | dinâmico: icon('i-chev', 'back-chev') | [23135](../app.js#L23135) |
| helpGlossaryPanel | input search | gloss-q | Filtrar termos do glossário | [23176](../app.js#L23176) |
| drawGlossary | button button |  | dinâmico: glossaryCallLabel(k) | [23218](../app.js#L23218) |
| openContactDrawer | input text | contact-mail-field | Endereço de e-mail do Ciclo | [23315](../app.js#L23315) |
| openContactDrawer | button button |  | dinâmico: icon('i-copy') | [23342](../app.js#L23342) |
| openContactDrawer | button button |  | dinâmico: icon('i-mail') | [23345](../app.js#L23345) |
| openContactDrawer | button button |  | Encontrou um problema? Relatar | [23349](../app.js#L23349) |
| openReportProblemDrawer | textarea  | report-desc | Ex.: O botão X não responde quando eu clico depois de registrar um estudo. | [23383](../app.js#L23383) |
| openReportProblemDrawer | details  |  | dinâmico: h('summary', { text:'Ver o texto completo' }) | [23423](../app.js#L23423) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-copy') | [23438](../app.js#L23438) |
| openReportProblemDrawer | button button |  | dinâmico: icon('i-mail') | [23439](../app.js#L23439) |
| openScreenHelp | button button |  | dinâmico: s.cta.label | [23462](../app.js#L23462) |
| openScreenHelp | button button |  | dinâmico: h('span', { class:'hi-main' }, h('div', { class:'hi-title', text:a.title }), h('div', { class:'hi-su | [23466](../app.js#L23466) |
| openScreenHelp | button button |  | Abrir a Central de Ajuda | [23473](../app.js#L23473) |
| renderTips | button button |  | Entendi | [23505](../app.js#L23505) |
| toastRich | button button |  | dinâmico: a.label | [23529](../app.js#L23529) |
| startHereChecklistCard | button button |  | dinâmico: st.action.text | [23696](../app.js#L23696) |
| maybeShowWhatsNew | button button |  | Ver todas as novidades | [23727](../app.js#L23727) |
| maybeShowWhatsNew | button button |  | Continuar | [23730](../app.js#L23730) |
| stepIntro | button button |  | dinâmico: h('span', { class:'ob-choice-t', text:title }) | [23783](../app.js#L23783) |
| stepQuick | input text | ob-name | Ex.: Português | [23798](../app.js#L23798) |
| stepQuick | button button |  | dinâmico: ex | [23802](../app.js#L23802) |
| stepWhat | input text | ob-add | Escreva e tecle Enter — ex.: Matemática | [23813](../app.js#L23813) |
| stepWhat | button button |  | dinâmico: p.label | [23817](../app.js#L23817) |
| stepWhat | button button |  | dinâmico: 'Tirar ' + n | [23823](../app.js#L23823) |
| stepWhat | button button |  | dinâmico: icon('i-plus') | [23829](../app.js#L23829) |
| stepGoal | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [23838](../app.js#L23838) |
| stepGoal | input text | ob-goal-t | Ex.: Prova de Inglês | [23846](../app.js#L23846) |
| stepGoal | input date | ob-goal-d |  | [23848](../app.js#L23848) |
| stepGoal | select  | ob-goal-disc |  | [23850](../app.js#L23850) |
| stepTime | button button |  | dinâmico: h('span', { class:'ob-opt-t', text:t }) | [23865](../app.js#L23865) |
| stepTime | input number | ob-hours | Outro | [23874](../app.js#L23874) |
| stepTime | button button |  | dinâmico: fmtDuration(v) | [23877](../app.js#L23877) |
| buildActions | button button |  | Voltar | [23933](../app.js#L23933) |
| buildActions | button button |  | dinâmico: o.revisit ? 'Fechar' : 'Prefiro explorar sozinho' | [23936](../app.js#L23936) |
| buildActions | button button |  | Criar e continuar | [23940](../app.js#L23940) |
| buildActions | button button |  | Continuar | [23942](../app.js#L23942) |
| buildActions | button button |  | Continuar | [23948](../app.js#L23948) |
| buildActions | button button |  | Continuar | [23956](../app.js#L23956) |
| buildActions | button button |  | Criar e começar | [23961](../app.js#L23961) |
| guideNote | button button |  | dinâmico: a.label | [24121](../app.js#L24121) |
| guideNote | button button |  | Agora não | [24123](../app.js#L24123) |
| startGuideCard | button button |  | ocultar | [24157](../app.js#L24157) |
| startGuideCard | button button |  | dinâmico: s2.actionLabel | [24173](../app.js#L24173) |
| reviewDemoNode | button button |  | dinâmico: o.label | [24202](../app.js#L24202) |
| structureDemoNode | button button |  | dinâmico: ex.label | [24231](../app.js#L24231) |
| openFirstReviewIntro | button button |  | Agora não | [24289](../app.js#L24289) |
| openFirstReviewIntro | button button |  | Começar | [24292](../app.js#L24292) |
| pomodoroSettingsRows | input number |  | dinâmico: label | [24337](../app.js#L24337) |
| segmented | button button |  | dinâmico: o.label | [24382](../app.js#L24382) |
| switchControl | button button |  | dinâmico: ariaLabel \|\| '' | [24395](../app.js#L24395) |
| numberControl | input number |  | dinâmico: ariaLabel \|\| '' | [24406](../app.js#L24406) |
| selectControl | select  |  | dinâmico: ariaLabel \|\| '' | [24412](../app.js#L24412) |
| renderSettings | input checkbox | dinâmico: 'tb-' + b.id |  | [24445](../app.js#L24445) |
| renderSettings | button button |  | Rever a apresentação | [24478](../app.js#L24478) |
| renderSettings | button button |  | Mostrar novamente | [24480](../app.js#L24480) |
| renderSettings | button button |  | dinâmico: plan ? 'Abrir Planejamento' : 'Definir uma meta' | [24494](../app.js#L24494) |
| renderSettings | button button |  | Mostrar todas de novo | [24534](../app.js#L24534) |
| renderSettings | button button |  | Como funcionam as revisões? | [24539](../app.js#L24539) |
| renderSettings | button button |  | Ver | [24559](../app.js#L24559) |
| renderSettings | button button |  | Fazer backup agora | [24571](../app.js#L24571) |
| renderSettings | button button |  | Abrir tela Dados | [24573](../app.js#L24573) |
| renderSettings | button button |  | Onde meus dados ficam? | [24574](../app.js#L24574) |
| renderSettings | button button |  | Preparar | [24576](../app.js#L24576) |
| renderSettings | button button |  | dinâmico: icon('i-mail') | [24592](../app.js#L24592) |
| renderSettings | button button |  | dinâmico: icon('i-flag') | [24593](../app.js#L24593) |
| renderSettings | button button |  | Central de Ajuda | [24594](../app.js#L24594) |
| renderSettings | button button |  | Novidades desta versão | [24595](../app.js#L24595) |
| renderSettings | button button | dinâmico: 'stab-' + g.id | dinâmico: g.label | [24613](../app.js#L24613) |
| openChangelog | details  |  | dinâmico: h('summary', null, sec.title) | [24644](../app.js#L24644) |
| openChangelog | details  |  | dinâmico: h('summary', null, h('span', { class:'num', text:'v' + c.v }), c.title ? h('span', { class:'cl-old-t | [24652](../app.js#L24652) |
| renderDeadlineSuggestions | button button |  | Usar revisão intensiva | [24718](../app.js#L24718) |
| renderDeadlineSuggestions | button button |  | Manter atual | [24726](../app.js#L24726) |
| renderDeadlineSuggestions | button button |  | Voltar ao padrão | [24749](../app.js#L24749) |
| renderDeadlineSuggestions | button button |  | Continuar intensiva | [24754](../app.js#L24754) |

## Camadas

| Contexto | Abertura | Linha |
|---|---|---|
| askConflict | close.push | [6047](../app.js#L6047) |
| confirmModal | openModal | [6816](../app.js#L6816) |
| openRegisterModal | openModal | [9744](../app.js#L9744) |
| confirmLong | close.push | [9900](../app.js#L9900) |
| openFinishModal | openModal | [10070](../app.js#L10070) |
| offerStaleSession | openModal | [10290](../app.js#L10290) |
| openAlternatives | Drawer.open | [11391](../app.js#L11391) |
| explainAction | openModal | [11395](../app.js#L11395) |
| openDisciplineReview | openModal | [11705](../app.js#L11705) |
| startReview | openModal | [11770](../app.js#L11770) |
| openReviewOutcomeModal | openModal | [11814](../app.js#L11814) |
| openSessionBuilder | openModal | [11850](../app.js#L11850) |
| openReviewPrimer | Drawer.open | [11955](../app.js#L11955) |
| openPlansDrawer | Drawer.open | [12581](../app.js#L12581) |
| createSimplePlan | openModal | [12599](../app.js#L12599) |
| openNewPlanModal | openModal | [12699](../app.js#L12699) |
| openWeekGoalModal | openModal | [12921](../app.js#L12921) |
| openSuggestionEditor | openModal | [13128](../app.js#L13128) |
| openSuggestionPicker | openModal | [13172](../app.js#L13172) |
| weekConflictDialog | close.push | [13364](../app.js#L13364) |
| weekConflictDialog | openModal | [13365](../app.js#L13365) |
| openBlockEditor | openModal | [13477](../app.js#L13477) |
| openMoveDialog | openModal | [13553](../app.js#L13553) |
| openStudyDaysModal | openModal | [13574](../app.js#L13574) |
| openAdjustBlocks | openModal | [13611](../app.js#L13611) |
| openGoalUpdate | openModal | [13659](../app.js#L13659) |
| openTopicDrawer | Drawer.open | [15410](../app.js#L15410) |
| openAreaModal | openModal | [15478](../app.js#L15478) |
| openDisciplineModal | openModal | [15639](../app.js#L15639) |
| openTopicModal | openModal | [16130](../app.js#L16130) |
| openBulkTopicModal | openModal | [16141](../app.js#L16141) |
| openDeadlineDrawer | Drawer.open | [16344](../app.js#L16344) |
| openDeadlineModal | openModal | [16351](../app.js#L16351) |
| saveCurrentAnalysis | openModal | [17227](../app.js#L17227) |
| renameSavedAnalysis | openModal | [17252](../app.js#L17252) |
| openAnalyticsDrawer | Drawer.open | [18962](../app.js#L18962) |
| openDayDrawer | Drawer.open | [19167](../app.js#L19167) |
| openBucketDrawer | Drawer.open | [19262](../app.js#L19262) |
| openDistributionDrawer | Drawer.open | [19348](../app.js#L19348) |
| copySummary | openModal | [19857](../app.js#L19857) |
| openHistoryFilters | Drawer.open | [20140](../app.js#L20140) |
| openEditSessionModal | openModal | [20301](../app.js#L20301) |
| confirmLongEdit | close.push | [20485](../app.js#L20485) |
| openAIReportModal | openModal | [20632](../app.js#L20632) |
| runIntegrityCheck | openModal | [20783](../app.js#L20783) |
| restoreRefused | openModal | [20955](../app.js#L20955) |
| askTimerBeforeRestore | openModal | [20980](../app.js#L20980) |
| openRestorePreview | openModal | [21022](../app.js#L21022) |
| bindEvents | openModal | [21149](../app.js#L21149) |
| openHelpArticle | Drawer.open | [22395](../app.js#L22395) |
| pickDisciplineThen | openModal | [22465](../app.js#L22465) |
| pickDisciplineForPriority | openModal | [22569](../app.js#L22569) |
| openContactDrawer | Drawer.open | [23350](../app.js#L23350) |
| openReportProblemDrawer | Drawer.open | [23442](../app.js#L23442) |
| openScreenHelp | Drawer.open | [23476](../app.js#L23476) |
| maybeShowWhatsNew | openModal | [23719](../app.js#L23719) |
| openWelcome | openModal | [23776](../app.js#L23776) |
| openFirstReviewIntro | openModal | [24280](../app.js#L24280) |
| openChangelog | Drawer.open | [24656](../app.js#L24656) |

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
