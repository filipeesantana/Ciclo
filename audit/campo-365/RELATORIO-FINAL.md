# Ciclo — auditoria de campo e candidato para revisão

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

Baseline: 51 testes anteriores aprovados no Chromium. A suíte ampliada passou em **79/79 casos**, incluindo 28 novos; [log final local](evidencias/depois/testes.txt). Também passaram **95 configurações de acessibilidade/interface**, abertura de **91 artigos** e **24 combinações adicionais de Foco/seletor**, sem violações axe, overflow horizontal, exceções ou requisições externas observadas nesses percursos. A matriz da CI do PR deve ser conferida antes de considerar a compatibilidade dos três motores validada nesta rodada.

Não houve teste com pessoas reais, aparelho Android/iPhone físico, Safari real, leitor de tela real, quota física esgotada ou encerramento forçado do navegador. O teste de zoom usa CSS de 200%. Suspensão e falhas de gravação têm simulação controlada, não equivalência com todos os cenários do sistema operacional. Combinações de filtros e todas as permutações de arquivamento/exclusão continuam com cobertura parcial.

Entrega em branch isolada, para PR de revisão. Nenhum merge, tag ou deploy de GitHub Pages. HTML/CSS/JS local, schemas lógico 10 e físico 1, dependências de produção e identificadores legados foram preservados. Versão real continua 7.1.0; proposta para publicação após revisão: **7.2.0**, por acrescentar um fluxo de planejamento e reformular o Foco. A publicação deve atualizar também os identificadores de cache dos recursos e recarregar todas as abas.

Reprodução: `npm ci`, `npm run check`, `npm test`, `npm run audit:browser`, `npm run audit:field` e `npm run audit:field:performance`. `BROWSER=firefox` ou `BROWSER=webkit` seleciona o motor nas verificações funcionais/visuais; é necessário tê-lo instalado. A carga de performance é local e usa Chromium por padrão. Contextos e dados de teste são descartáveis.
