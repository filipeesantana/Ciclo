# Auditoria de campo — 22/10/2026

Base real: `e972eb1`, já incorporada em `origin/main` nesta data. Aplicativo **7.1.0**, schema lógico **10**, IndexedDB físico **1**. A auditoria anterior foi lida; seus resultados não foram usados como substitutos das execuções desta rodada. Não havia AGENTS.md nem alterações locais no checkout inicial. Trabalho na branch `codex/auditoria-campo-foco-365`.

O problema central foi reproduzido em Chromium: tanto estudo livre quanto Foco → Encerrar → Registrar deixavam Hoje com “Você está estudando agora”. Os 51 testes anteriores passavam, pois verificavam persistência e barra sem verificar esse cartão no mesmo instante.

| Achado | Evidência e consequência | Tratamento |
|---|---|---|
| Hoje obsoleto após salvar | `registerStudy` chamava `safeRefresh` antes de `TimerService.release`; o chamador limpava só a barra depois. | Liberar o runId confirmado antes do refresh; sincronizar a ação de Hoje nas transições. |
| Início/pausa/descanso/descarte não acompanhados por Hoje | Cartão dependia do timer, mas a atualização era restrita à barra. Inspeção do fluxo anterior e testes novos das transições. | Atualização localizada com chave de estado, sem consulta ao histórico a cada segundo. |
| Snapshot de aba atrasada podia restaurar runId salvo | Reconciliação com sessões concluídas existia somente no boot. | Conferir também no restore e refresh, sem encerrar um runId novo. |
| Séries cortadas em 520 semanas | Regressão: 520 semanas retornadas num intervalo de 617. Carga de 10.000 estudos: 520 de 573. | Percorrer todo o intervalo validado em constância, resultados e planejamento. |
| Foco com hierarquia fraca e contexto extenso | Relógio sem rótulo visível, assunto antes do tempo, finalização como ação principal, tópicos/tipos sem síntese. | Relógio em primeiro plano, rótulo, contexto compacto, totais separados e controles reorganizados. |
| Planejamento exigia menus/arraste para organizar vários dias | Disciplinas em cartões altos, ações de modelo sempre expostas, sete colunas estreitas. | Seletor de disciplina e vários dias, inclusão atômica, opções progressivas e colunas com mínimo de 180 px. |

Modelo preservado: HTML/CSS/JS sem framework; IndexedDB para entidades e reserva; localStorage para snapshot do timer; runId como identidade idempotente do estudo; BroadcastChannel/storage para sincronização. Não há dependências de produção novas, backend, telemetria, migração de schema, merge ou publicação.

Veja [reproduções](BUGS-REPRODUZIDOS.md), [dados](TESTES-365-DIAS.md), [segurança](AUDITORIA-SEGURANCA.md), [interface](AUDITORIA-UX-UI.md), [compatibilidade](MATRIZ-CROSS-BROWSER.md) e [relatório final](RELATORIO-FINAL.md).
