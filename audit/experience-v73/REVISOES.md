# Revisões — adaptação seletiva do PR #3

Aproveitados: revisão livre de várias disciplinas, proposta por tempo disponível, seleção manual, ordem, método e duração editáveis, orientação curta, pausa/retomada, voltar, pular, respostas individuais e um registro agregado. A proposta usa `ReviewEngine.rankedQueue`, `effectiveMethod` e `estimateMinutes`: as estratégias, prioridades, prazos, adiamentos e resultados anteriores continuam pertencendo ao motor existente.

Descartados: biblioteca de cartões, formatos/editor/conjuntos/modelos, FSRS e `ts-fsrs`, direções, eventos, sessões e estatísticas de cartões, stores e helpers do módulo de flashcards. Nenhum arquivo desse módulo foi copiado. `reviews.js` é uma implementação menor, com componentes próprios de formulário e as APIs já existentes do Ciclo. Não depende de `FlashcardModel`, `FlashcardCommands`, `flashcardRuns`, `flashcardResponses` nem helpers `fc*`.

`flashcards` permanece em `REVIEW_METHODS`. No roteiro, orienta usar cartões pessoais físicos ou de outra ferramenta; pode receber autoavaliação do tópico, como os demais métodos. Não abre biblioteca nem promete cartões internos.

## Uso

“Revisão livre” abre diretamente o formulário canônico com tipo Revisão. Pode usar cronômetro ou trocar para Já estudei. Tópicos são opcionais. Uma revisão geral não ajusta agendas individuais.

“Montar revisão guiada” oferece 10/20/30 minutos ou duração própria. O estudante aceita a proposta ou adiciona/remove assuntos, escolhe disciplinas da proposta, reordena e troca métodos/durações. As durações precisam caber no orçamento. Limites defensivos existentes: 40 tópicos e 12 disciplinas. Durante a atividade, método e resultado individual podem ser ajustados.

Selecionar um resultado é uma confirmação explícita de atividade realizada; também é possível concluir sem autoavaliação. Pular limpa a resposta daquela atividade. Na finalização, apenas `status:'done'` entra no estudo; pendentes e pulados ficam fora. Nenhum resultado é espalhado automaticamente por outros tópicos.

## Continuidade e uma única sessão

Há um roteiro durável por vez em `meta.guidedReview`, contendo identidade, revisão, data civil, orçamento, cursor, itens, tempo acumulado e início da contagem. Cada ação confirmada é uma transação com conferência da revisão atual. Uma aba obsoleta recebe erro e precisa reabrir a versão atual. Não há lease nem segundo algoritmo de memória.

O tempo corre por timestamps até pausar. F5 conserva o estado confirmado e a contagem; **Guardar e sair** pausa antes de fechar. A exportação tira um retrato pausado; a restauração não conta o tempo entre exportar e importar. Cronômetro e roteiro não podem contar simultaneamente; as duas partidas disputam a mesma store `meta` transacionalmente.

Finalizar grava sessão, reconciliação dos tópicos e marca de conclusão do roteiro na mesma transação. O ID `guided:<id>` e a leitura do estado concluído tornam retentativas idempotentes. Uma revisão de 45 minutos com vários tópicos gera 45 minutos no total. A distribuição por disciplina/tópico continua usando as estimativas existentes, explicitadas na interface. A data é a do início do roteiro. Encerrar sem registrar exige escolha explícita e não altera agendas.

Falhas não apagam o roteiro nem confirmam sucesso. Assunto excluído é indicado no player e pode ser pulado; ele nunca é substituído por outro. Um roteiro concluído é substituído somente ao criar o próximo. Não há biblioteca de roteiros nem edição de um roteiro já registrado: o estudo correspondente usa o editor do Histórico.

[Revisões antes](evidencias/antes/revisoes.png) · [depois](evidencias/depois/revisoes.png) · [editor](evidencias/depois/roteiro-editor.png) · [atividade](evidencias/depois/roteiro-guiado.png) · [mobile](evidencias/depois/roteiro-light-mobile.png) · [resultado agregado](evidencias/depois/roteiro-resultados.png).
