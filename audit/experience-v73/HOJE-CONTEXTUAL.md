# Hoje contextual

A fonte de verdade é `state.sessions`, recarregada do IndexedDB. `todaySummary()` filtra `s.date === todayISO()`, soma `minutes` uma vez por sessão e deduplica os IDs das disciplinas apenas para os nomes. Não há contador paralelo, repartição de minutos nem soma de pausas e descansos.

| Estado | Experiência |
|---|---|
| Sem disciplina ativa | Pergunta inicial e criação simples; sem gráficos vazios |
| Com disciplinas, sem estudo hoje | Convite para começar ou registrar; histórico anterior não é apresentado como atividade do dia |
| Cronômetro ativo | Estado de estudo, pausa, descanso ou bloco concluído; relógio único na barra; finalização fácil |
| Roteiro guardado ou contando | Situação explícita e retomada direta; não entra nos estudos concluídos |
| Um ou mais estudos persistidos hoje | “Seu dia até agora”: tempo líquido, número de registros, disciplinas e destinos para aprofundar |

“Ver detalhes do dia” chama o motor de Análises com `periodPreset:'hoje'`. “Ver registros de hoje” abre o Histórico com um filtro próprio de Hoje, sem herdar buscas ou disciplinas que esconderiam parte dos registros. Voltar recupera o contexto da entrada anterior.

A regra civil da v7.2 foi mantida: a data é a do início do estudo; atravessar meia-noite não reparte a sessão em dois dias. O observador de mudança de dia existente continua atualizando a tela. Registro retroativo, mudança de data, edição e exclusão atualizam a síntese após a releitura. O cronômetro só é liberado após persistência confirmada, antes de redesenhar Hoje.

Testes executados cobrem histórico de ontem, duração multidisciplinar única, descanso, cronômetro ativo, salvamento imediato, edição, alteração da data, exclusão, virada civil e ida/volta entre Hoje, Análises e Histórico. A restauração do fixture anual é coberta pela suíte de dados.

[Antes sem resumo](evidencias/antes/hoje-apos-estudo.png) · [depois do registro](evidencias/depois/hoje-apos-estudo.png) · [durante estudo](evidencias/depois/hoje-durante-estudo.png) · [mobile claro](evidencias/depois/today-light-390.png).
