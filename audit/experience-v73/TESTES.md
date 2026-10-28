# Testes e limites — v7.3.0

Execução local em Chromium 154.0.8037.57, com Playwright 1.62.1 e contextos descartáveis. Testes de interface simulam ações; não houve teste com pessoas reais.

| Verificação | Resultado local |
|---|---|
| Baseline funcional original | 79/80; condição de data do teste anual documentada no diagnóstico |
| Suíte ampliada | **102/102** aprovados, sem ignorados ou cancelados |
| Sintaxe de app.js, content.js e reviews.js | Aprovada |
| Inventário de controles e destinos | Sem destinos ausentes; inclui reviews.js |
| Auditoria geral de interface/axe | 95 configurações, 91 artigos; sem violações, overflow, erros ou rede externa observados |
| Auditoria de campo | 24 configurações; sem violações, overflow, erros ou rede externa observados |
| Auditoria adicional de experiência | 109 configurações de Hoje/Revisões/Análises, registro/comentário, roteiro e reflow com zoom CSS de 200% |
| Fixture anual | 911 sessões, 77.379 minutos líquidos, 6.754 de descanso, 311 dias ativos, 26 disciplinas, 184 tópicos, 53 semanas e 461 resultados preservados |
| Carga | 100, 911, 1.000, 5.000 e 10.000 estudos; séries completas, importação, recarga, filtros, busca, exportação, validação e restauração |

[Suíte completa](evidencias/depois/testes.txt) · [regressões finais](evidencias/depois/regressoes.txt) · [auditoria geral](evidencias/depois/acessibilidade/results.json) · [campo](evidencias/depois/campo/review.json) · [experiência](evidencias/depois/results.json) · [inventário](../INVENTARIO-CONTROLES.md).

Os 22 novos testes cobrem comentário visível, foco, recolher, remoção confirmada, rascunho ao cancelar/trocar modo/F5, segunda disciplina, Hoje antes/depois/edição/data/exclusão/virada, destinos do dia, filtros e F5, revisão livre, edição do roteiro, respostas individuais, pulo, pausa/F5, duas abas, retentativa idempotente, falha de IndexedDB, backup, validador e exclusão mútua dos relógios. Duas regressões adicionais verificam período do Histórico depois de outra análise e semana consultada no Planejamento, com Voltar e F5. A suíte anterior mantém onboarding, foco, Pomodoro, planejamento, integridade e fixture anual.

A matriz adicional usa os dois temas em 320, 375, 390, 430, 768, 1024, 1280, 1366, 1440 e 1920 px nas telas principais. Modais e roteiro também são ensaiados em larguras intermediárias. O zoom é CSS de 200%, não medição do zoom de todos os navegadores. Teclado e foco são ensaiados na suíte; axe verifica critérios relevantes WCAG 2.2 AA. Isso não certifica conformidade integral nem substitui leitor de tela real. O relógio usa `aria-live=off`.

## Navegadores e CI

Chromium foi executado localmente. Firefox/WebKit tiveram download bloqueado por HTTP 403 “Domain forbidden” nos domínios de distribuição do Playwright: [log](evidencias/depois/instalacao-navegadores.txt). A CI do novo PR mantém os três motores e acrescenta `audit:experience`; os resultados remotos auditáveis ficam nos checks e na descrição do [PR #4](https://github.com/filipeesantana/Ciclo/pull/4).

Chrome e Edge oficiais, Safari/iOS real, Android/iPhone físicos, teclado virtual real e leitores de tela reais não foram testados. A largura mobile é emulada; não equivale a aprovação de dispositivos físicos.

A primeira execução remota (`a105a6f`) passou em 99/99 casos funcionais no Firefox e no WebKit, mas a matriz visual adicional reprovou: alvo parcialmente coberto no roteiro em Firefox/320 px e overflow após redimensionamento em WebKit/430 px. [Firefox](evidencias/ci-primeira-execucao.json) · [WebKit](evidencias/ci-primeira-execucao-webkit.json). O rodapé dos roteiros passou a ocupar espaço próprio, com rolagem no conteúdo. A auditoria aguarda dois quadros após redimensionar/aplicar tema e registra os elementos que ultrapassarem a largura; nenhuma regra de falha foi desativada. A validação remota posterior está vinculada no PR.

## Performance

Milissegundos observados nesta máquina, com as auditorias locais concorrentes. Média de cinco renderizações síncronas por tela com cache invalidado; não mede pintura, fluidez, P95 nem desempenho de celular. Importação usa a UI; recarga termina em `state.ready`. [Método e amostras completas](evidencias/depois/carga/performance.json).

| Estudos | Importar | Recarregar | Hoje | Histórico | Análises | Revisões |
|---:|---:|---:|---:|---:|---:|---:|
| 100 | 530 | 249 | 10,6 | 26,4 | 11,8 | 33,8 |
| 911 | 735 | 398 | 24,4 | 79,4 | 101,4 | 73,6 |
| 1.000 | 1.522 | 607 | 40,8 | 128,4 | 76,0 | 83,6 |
| 5.000 | 4.019 | 969 | 82,2 | 71,8 | 85,4 | 73,6 |
| 10.000 | 5.453 | 1.649 | 61,6 | 94,6 | 75,8 | 56,8 |

O ensaio não é comparação de velocidade com a main. A ausência de crescimento monotônico em algumas medidas evidencia variação de execução/cache/JIT e concorrência; não permite concluir que mais dados tornam o aplicativo mais rápido.

## Reprodução

```
npm ci --ignore-scripts
npm run check
npm run audit:inventory
npm test
npm run audit:browser
npm run audit:field
npm run audit:experience
CICLO_PERF_COUNTS=100,911,1000,5000,10000 npm run audit:field:performance
```

`BROWSER=firefox` ou `BROWSER=webkit` seleciona o motor instalado. `AUDIT_OUTPUT` define o diretório de evidências. `CICLO_SOURCE_ROOT` permite auditar uma cópia da main com os mesmos scripts. Para medir geometria: `node tests/experience-friction.cjs`. Os históricos e todas as permutações de filtros/arquivamento ainda têm cobertura parcial.
