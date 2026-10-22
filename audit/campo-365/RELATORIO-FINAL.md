# Ciclo — auditoria de campo e preparação da v7.2.0

O Ciclo passa a encerrar o timer confirmado **antes de redesenhar Hoje**, evitando o estudo fantasma sem F5. O Foco prioriza um relógio rotulado e contexto compacto, com estudo/descanso separados. Planejamento ganha seleção visual de disciplina e vários dias, gravada integralmente numa transação, e opções avançadas progressivas.

Também foi corrigido um corte silencioso de séries após 520 semanas, encontrado na carga de 10.000 estudos. A regressão menor falhava com 520 de 617 semanas e agora exige o intervalo inteiro.

A restauração real do ano fornecido preservou **911 estudos, 77.379 minutos líquidos, 6.754 minutos de descanso, 311 dias ativos e 461 resultados**, sem reparos nem descartes. O verificador independente conferiu distribuição por disciplina, tipos, questões/acertos e semanas. Exportar e restaurar em segundo contexto preservou os dados.

Os resultados desta rodada estão separados em:

- [Diagnóstico e arquitetura](DIAGNOSTICO.md).
- [Reproduções, causa, correções e risco residual](BUGS-REPRODUZIDOS.md).
- [Importação, matemática e jornadas](TESTES-365-DIAS.md).
- [Segurança e privacidade](AUDITORIA-SEGURANCA.md).
- [Comparações visuais e acessibilidade](AUDITORIA-UX-UI.md).
- [Navegadores realmente executados e pendências](MATRIZ-CROSS-BROWSER.md).
- [Medições até 10.000 estudos](PERFORMANCE.md).

Baseline: 51 testes anteriores aprovados no Chromium. A suíte local ampliada passou em **79/79 casos**; [log local](evidencias/depois/testes.txt). A revisão final acrescentou uma regressão de redimensionamento: **80/80 testes, incluindo 29 novos, passaram em Chromium, Firefox e WebKit na CI**, com as contagens conferidas nos logs e não apenas no status do job. Também passaram, em cada motor, **95 configurações de acessibilidade/interface**, abertura de **91 artigos** e **24 combinações adicionais de Foco/seletor**, sem violações axe, overflow horizontal, exceções ou requisições externas observadas nesses percursos. [Resultados e proveniência](evidencias/ci/results-final.json), [matriz completa](MATRIZ-CROSS-BROWSER.md).

A CI adicional encontrou um aviso de ciclo do ResizeObserver no WebKit: o ajuste de colunas foi transferido para o próximo quadro, sem ocultar a ocorrência do coletor. A conferência dos logs também corrigiu duas falhas da infraestrutura desta rodada: captura com tee sem pipefail e uma asserção antes da releitura assíncrona do editor. A versão final do teste verifica banco e tela; a captura de logs preserva o código de saída. As ocorrências anteriores e a confirmação posterior estão documentadas, sem classificá-las como perda de dados do aplicativo.

Não houve teste com pessoas reais, aparelho Android/iPhone físico, Safari real, leitor de tela real, quota física esgotada ou encerramento forçado do navegador. O teste de zoom usa CSS de 200%. Suspensão e falhas de gravação têm simulação controlada, não equivalência com todos os cenários do sistema operacional. Combinações de filtros e todas as permutações de arquivamento/exclusão continuam com cobertura parcial.

Entrega na branch do [PR #2](https://github.com/filipeesantana/Ciclo/pull/2), preparada como **v7.2.0**: APP_VERSION, cabeçalhos, novidades da interface, README e identificadores de cache de app.js, content.js e styles.css atualizados. HTML/CSS/JS local, schemas lógico **10** e físico **1**, dependências de produção e identificadores legados preservados, sem necessidade de migração. O fixture sintético continua sendo o original da v7.1.0, com o mesmo checksum e metadados. Nenhum merge, tag ou deploy de GitHub Pages.

Na preparação final, o limite da CI foi ampliado de **15 para 30 minutos por motor**: a execução [39861059722](https://github.com/filipeesantana/Ciclo/actions/runs/39861059722) cancelou o WebKit durante a instalação, antes de qualquer teste. As evidências acima registram a auditoria anterior; o resultado da nova execução completa da v7.2.0 consta nos checks e na descrição do próprio PR #2, com contagens conferidas nos logs. Após a publicação, recarregue todas as abas para usar a mesma versão.

Conferência local da preparação: **80/80 testes funcionais** no Chromium, sem falhas, cancelamentos ou ignorados. Abertura do backup original na v7.2.0, recarga e nova exportação conservaram a referência matemática dos 911 estudos e 77.379 minutos; o arquivo fonte mantém SHA-256 `d44ec99061c28acdac05d0f10af3ce857d715ad12262cca65b6764686bc1bf4b`. As novidades da v7.2.0 aparecem uma vez após atualizar e não reaparecem na recarga seguinte; os três recursos retornaram HTTP 200 com `?v=7.2.0`.

Reprodução: `npm ci`, `npm run check`, `npm test`, `npm run audit:browser`, `npm run audit:field` e `npm run audit:field:performance`. `BROWSER=firefox` ou `BROWSER=webkit` seleciona o motor nas verificações funcionais/visuais; é necessário tê-lo instalado. A carga de performance é local e usa Chromium por padrão. Contextos e dados de teste são descartáveis.
