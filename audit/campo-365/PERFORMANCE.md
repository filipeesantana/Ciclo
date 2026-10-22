# Desempenho e longevidade

**TESTADO EM EXECUÇÃO.** Chromium 154.0.8037.57 em Linux; contextos novos; cinco amostras de renderização síncrona por tela, com caches invalidados. Os tempos de renderização abaixo são medianas em milissegundos e não incluem pintura. Importação usa o seletor de arquivo e espera restauração/estado pronto; reload espera `state.ready`. Não são números de celular físico nem de laboratório com máquina dedicada.

| Estudos | Semanas persistidas | Importação UI (ms) | Reload (ms) | Hoje | Planejamento | Histórico | Análises |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 911 | 53 | 809 | 272 | 13 | 16 | 42 | 27 |
| 1822 | 105 | 987 | 310 | 15 | 14 | 35 | 39 |
| 2733 | 157 | 1221 | 433 | 17 | 16 | 36 | 24 |
| 5000 | 313 | 2100 | 571 | 17 | 20 | 51 | 32 |
| 10000 | 573 | 3624 | 936 | 24 | 17 | 40 | 26 |

| Estudos | CSV (ms) | Validar JSON (ms) | Restaurar no banco (ms) | Busca (ms) | Filtro (ms) | Recuperar timer (ms) |
|---:|---:|---:|---:|---:|---:|---:|
| 911 | 40 | 62 | 198 | 26 | 4 | 1 |
| 1822 | 71 | 82 | 387 | 25 | 6 | 1 |
| 2733 | 54 | 77 | 447 | 41 | 10 | 1 |
| 5000 | 99 | 149 | 804 | 53 | 13 | 1 |
| 10000 | 186 | 371 | 1588 | 113 | 12 | 1 |

As cópias de carga partem do arquivo de 911 estudos. Os dois e três ciclos contêm 1.822/2.733 registros, com deslocamento de 364 dias para conservar dias da semana. A base de 10.000 estudos cobre 05/11/2015–22/10/2026. São clones com IDs próprios, não anos independentes de aprendizagem. Nenhuma cópia de carga foi adicionada ao repositório.

O instrumento confirma minutos, descansos, questões e contagem após cada importação. Todas as prévias têm zero ajustes. O maior caso revelou três séries cortadas em 520 semanas; a execução final contém as **573 semanas esperadas**, coerentes com os totais. A regressão de 617 semanas verifica também as somas e a semana mais recente.

A busca mede o campo real `ui.history.search` e a renderização da tabela; o filtro usa uma disciplina. São chamadas síncronas do componente, não latência de digitação/toque de ponta a ponta. Exportação JSON, consulta fria por disciplina, recuperação e estimativa de heap também estão no JSON. `performance.memory` é específico do Chromium e não mede a memória total do processo.

Amostras brutas: [antes](evidencias/antes/carga/performance.json) e [depois](evidencias/depois/carga/performance.json), com SHA-256 de app.js. Houve variação entre execuções e processos concorrentes no ambiente compartilhado; os valores não demonstram ganho geral de velocidade. Não foi acrescentado cache complexo ou reescrita arquitetural.

O tick do Foco só lê timestamps/descansos da sessão e atualiza texto/progresso. A sincronização de Hoje troca somente sua ação principal quando a chave de estado muda. Não consulta/reagrega os milhares de estudos a cada segundo.

**Limites:** intervalos artificiais de séculos, profiling detalhado de CPU/heap, energia e suspensão física do aparelho não foram medidos. O arquivo original de 365 dias foi restaurado e conferido antes da ampliação.
