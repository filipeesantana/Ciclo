# Restauração do ano fictício

**TESTADO EM EXECUÇÃO**, por seletor de arquivo da tela Dados, em origem HTTP local efêmera e contextos Playwright novos. O perfil do criador não foi aberto. O JSON original não precisou de correção. O fixture comprimido preserva seus bytes e checksum; procedência e comandos estão em [tests/fixtures](../../tests/fixtures/README.md).

Prévia: schema 10, formato v3, app 7.1.0, cyrb53 conferido, **zero reparos e zero descartes**. Captura: [prévia real](evidencias/depois/previa-365.png). Relatório legível por máquina: [importacao-365.json](evidencias/depois/importacao-365.json).

| Indicador | Valor independente | Resultado |
|---|---:|---|
| Áreas / disciplinas / tópicos | 5 / 26 / 184 | Preservados |
| Estudos únicos / dias ativos | 911 / 311 | Preservados |
| Minutos líquidos | 77.379 (1.289h39) | Igual às Análises |
| Descansos | 681 intervalos; 6.754 min (112h34) | Fora dos minutos líquidos |
| Resultados | 461 | Preservados |
| Questões / acertos | 5.962 / 3.887 | 65,1962428715%; soma sobre soma |
| Estudos multidisciplinares / sem tópicos | 170 / 256 | Sem multiplicar tempo |
| Resumos Pomodoro / estudos com Revisão | 242 / 181 | Preservados |
| Planos / semanas / prazos | 2 / 53 / 63 | IDs únicos, datas e relações preservadas |
| Minutos por disciplina vindos de estimativa | 5.010 | Igual ao agregado identificado como estimado |

O oráculo em `field-backup.cjs` não usa funções do aplicativo. Confere totais, divisão de minutos por disciplina, frequência por tipo, questões, descansos e dias. Todos os 26 recortes de disciplina são comparados com referências independentes. Frequência por tipo pode somar mais de 100%; os minutos por tipo continuam somando 77.379.

Todos os campos originais das entidades são confrontados por ID. A única normalização estrutural observada é a ordem canônica dos blocos semanais: o arquivo usa índices globais e o Ciclo renumera por dia. IDs, conteúdo e ordem relativa dentro de cada dia permanecem iguais; nenhum bloco é descartado. Isso é o contrato anterior do importador, não um reparo introduzido nesta rodada.

As 53 semanas são percorridas na interface e conferidas quanto a meta histórica, estudos reais e blocos. Comparações **parciais** usam quatro dias iguais numa quinta-feira; **completas** usam sete dias das duas últimas semanas encerradas. Editar uma sessão múltipla acrescenta só os minutos informados; excluí-la retira uma única sessão e sua duração.

Exportação e restauração em segundo contexto, seguidas de F5, preservam as coleções. Comentários, timestamps, resultados e vínculos são confrontados, além de suas somas. A exportação do aplicativo recalcula a integridade normalmente.

O backup representa estudos concluídos. Timer, Foco, pausa, descanso, Pomodoro ativo, fullscreen e concorrência são verificados por ações de navegador em testes separados. Não se infere estado ativo a partir dos resumos históricos.

Verificação suplementar do serviço Pomodoro em Chromium, com relógio controlado: presets clássico, prolongado e personalizado completam os ciclos, escolhem o descanso longo correto e avançam automaticamente sem somar descansos ao estudo. Uma suspensão simulada de três horas conserva somente 25 min de estudo, zero descanso e um bloco, aguardando decisão. [Valores e método](evidencias/depois/pomodoro-adicional.json). Esses quatro casos de serviço não são contados como jornadas de interface nem como teste de suspensão física.

Jornadas complementares: primeiro uso só com o nome; estudo sem tópicos e sem meta; marco de Guitarra; revisão geral sem alterar tópicos; revisão específica; edição/exclusão; prazo; filtros; Voltar/Avançar/F5; rascunho; falha de gravação e duas abas. São jornadas automatizadas, **não pesquisa com usuários reais**.
