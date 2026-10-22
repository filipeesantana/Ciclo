# Desempenho e longevidade

**TESTADO EM EXECUÇÃO.** Chromium 154.0.8037.57 em Linux; contextos novos; cinco amostras de renderização síncrona por tela, com caches invalidados. Os tempos de renderização abaixo são medianas em milissegundos e não incluem pintura. Importação usa o seletor de arquivo e espera restauração/estado pronto; reload espera `state.ready`. Não são números de celular físico nem de laboratório com máquina dedicada.

| Estudos | Semanas persistidas | Importação UI (ms) | Reload (ms) | Hoje | Planejamento | Histórico | Análises |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 911 | 53 | 723 | 236 | 13 | 17 | 34 | 24 |
| 1822 | 105 | 852 | 305 | 15 | 16 | 34 | 28 |
| 2733 | 157 | 1074 | 390 | 15 | 13 | 32 | 22 |
| 5000 | 313 | 1769 | 539 | 17 | 13 | 31 | 22 |
| 10000 | 573 | 3611 | 891 | 22 | 17 | 37 | 27 |

| Estudos | CSV (ms) | Validar JSON (ms) | Restaurar no banco (ms) | Busca (ms) | Filtro (ms) | Recuperar timer (ms) |
|---:|---:|---:|---:|---:|---:|---:|
| 911 | 21 | 36 | 221 | 19 | 3 | 2 |
| 1822 | 36 | 56 | 328 | 27 | 5 | 1 |
| 2733 | 58 | 80 | 493 | 33 | 11 | 2 |
| 5000 | 82 | 131 | 701 | 49 | 11 | 1 |
| 10000 | 228 | 259 | 1203 | 108 | 12 | 1 |

As cópias de carga partem do arquivo de 911 estudos. Os dois e três ciclos contêm 1.822/2.733 registros, com deslocamento de 364 dias para conservar dias da semana. A base de 10.000 estudos cobre 05/11/2015–22/10/2026. São clones com IDs próprios, não anos independentes de aprendizagem. Nenhuma cópia de carga foi adicionada ao repositório.

O instrumento confirma minutos, descansos, questões e contagem após cada importação. Todas as prévias têm zero ajustes. O maior caso revelou três séries cortadas em 520 semanas; a execução final contém as **573 semanas esperadas**, coerentes com os totais. A regressão de 617 semanas verifica também as somas e a semana mais recente.

A busca mede o campo real `ui.history.search` e a renderização da tabela; o filtro usa uma disciplina. São chamadas síncronas do componente, não latência de digitação/toque de ponta a ponta. Exportação JSON, consulta fria por disciplina, recuperação e estimativa de heap também estão no JSON. `performance.memory` é específico do Chromium e não mede a memória total do processo.

Amostras brutas: [antes](evidencias/antes/carga/performance.json) e [depois](evidencias/depois/carga/performance.json), com SHA-256 de app.js. Houve variação entre execuções e processos concorrentes no ambiente compartilhado; os valores não demonstram ganho geral de velocidade. Não foi acrescentado cache complexo ou reescrita arquitetural.

O tick do Foco só lê timestamps/descansos da sessão e atualiza texto/progresso. A sincronização de Hoje troca somente sua ação principal quando a chave de estado muda. Não consulta/reagrega os milhares de estudos a cada segundo.

**Limites:** intervalos artificiais de séculos, profiling detalhado de CPU/heap, energia e suspensão física do aparelho não foram medidos. O arquivo original de 365 dias foi restaurado e conferido antes da ampliação.
