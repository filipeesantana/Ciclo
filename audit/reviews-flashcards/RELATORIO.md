# Ciclo v7.3.0 — Reviews & Flashcards

Entrega em branch separada `codex/reviews-flashcards-v7.3.0`, iniciada no commit `e7215d8` da v7.2.0. Sem merge, tag ou publicação no GitHub Pages. Auditoria executada em 25/10/2026, com dados sintéticos e contextos descartáveis.

## O que mudou

Revisões abre com três caminhos: **Começar revisão**, **Revisão guiada** e **Flashcards**. O panorama mantém sugestões por disciplina, adiamentos, datas e histórico, com detalhes recolhidos. A seleção livre usa o formulário e o cronômetro existentes para várias disciplinas e tópicos. A revisão geral continua válida sem tópicos.

O roteiro aceita 10, 20, 30 minutos ou outro orçamento, permite adicionar/remover/reordenar assuntos, escolher disciplinas, ajustar duração e método. A proposta inicial usa o ranking existente, incluindo prioridades, resultados e prazos. Atividades confirmadas ficam guardadas; pular não conclui. Encerrar permite registrar uma sessão agregada, continuar depois ou encerrar sem criar um estudo.

A biblioteca de cartões oferece seis formatos, busca, filtros, conjuntos opcionais, suspensão por direção, arquivo, edição, movimentação pelo editor, duplicação e modelos de preferências. O editor oferece seleção visual de lacunas, prévia, ajuda contextual e criação em sequência. Um cartão pode ser criado apenas com disciplina. Há uma demonstração sem gravação e conteúdo na biblioteca Como estudar.

Na prática, a pergunta vem antes da resposta. O estudante confere sua tentativa e escolhe uma das quatro avaliações. Cada direção tem sua identidade, histórico e agenda FSRS. Os eventos são gravados imediatamente; o tempo só entra no Histórico por escolha explícita. A modalidade livre inclui antecipados e preserva a agenda. Atalhos são opcionais e todos os controles existem por toque.

O [contrato técnico](ARQUITETURA.md) detalha modelos, transações, algoritmo, migração, edição, exclusões, backups, fontes e limites.

## Cobertura dos itens da entrega

| Item | Entrega / evidência |
|---|---|
| 1. Estado anterior | v7.2.0 inspecionada; `ReviewEngine`, reconciliador, filas, sugestões, métodos e 80 testes originais documentados em [ARQUITETURA.md](ARQUITETURA.md) |
| 2. Problemas identificados | Método de cartões sem cartões persistidos; proposta não editável e com primeiro item potencialmente acima do orçamento; fila volátil |
| 3. Interface | Panorama, ações claras, exploração recolhida, biblioteca e datas com texto; capturas reais abaixo |
| 4. Revisão livre | Uma ou várias disciplinas, tópicos opcionais, cronômetro ou registro manual canônico |
| 5. Revisão guiada | Proposta editável, roteiro curto, pausa, volta, avanço, pulo, progresso, retomada e encerramento |
| 6. Vários tópicos | Resultados explícitos por assunto, sem copiar um resultado aos demais |
| 7. Várias disciplinas | Um estudo e um total; divisões existentes do `SessionModel`, com estimativas identificadas |
| 8. Tipos | Pergunta/resposta, termo, idioma, lacuna, problema e sequência |
| 9. Personalização | Preferências seguras por modelo, direção, campos preferidos, dica/exemplo e restauração de padrões; sem HTML executável |
| 10. Criação | Seleção do tipo, contexto opcional, prévia, salvar/criar outro/estudar; atalho após estudo usa apenas contexto conhecido |
| 11. Prática | Frente, tentativa, revelação, quatro avaliações, atalhos, pausa, pulo, encerramento e respostas duráveis |
| 12. Algoritmo | FSRS-6 real, ts-fsrs 5.2.3 distribuído, licença MIT, configuração e vetor determinístico documentados |
| 13. Pouco histórico | Pesos gerais; nenhum ajuste pessoal ou alegação de precisão individual |
| 14. Agenda | Independente por direção; prática livre antecipada mantém estado byte a byte; suspensão e arquivo não apagam histórico |
| 15. Tópicos/cartões | Revisão geral não responde cartões; cartões não aplicam resultado ao tópico, inclusive no roteiro |
| 16. Sessões | Respostas são eventos; registro temporal cria um único estudo; gravação repetida é idempotente |
| 17. Histórico | Resumo de cartões por estudo e detalhes de resultados; histórico individual por conteúdo |
| 18. Análises | Contagens observadas por avaliação, período, disciplina e tópico, sem alterar totais de minutos |
| 19. Migração | Schema físico 1 → 2 cria stores; schema lógico 11; teste de preservação de estudos existentes |
| 20. Backup | Checksum antigo preservado, novas coleções completas, validação estrita, prévia e restauração atômica; fixtures anual e v7.2.0 |
| 21. Segurança | Conteúdo como texto, validação de limites/referências/IDs, rollback, conflitos e CSV escapado |
| 22. Acessibilidade | Critérios automatizados WCAG A/AA relevantes, teclado, foco, labels, estados textuais e reduced motion; sem teste com leitor de tela real |
| 23. Mobile | Larguras de 320 a 430 px no Chromium; controles de toque e rolagem; emulação, sem aparelhos físicos |
| 24. Navegadores | Chromium executado; Firefox/WebKit bloqueados para download neste ambiente; matriz CI mantida |
| 25. Performance | Carga sintética com 1.500 conteúdos, 2.000 direções e 10.800 respostas; métricas reais em JSON |
| 26. Funcionais | Suíte original e novos testes de domínio e jornadas reais de interface; logs abaixo |
| 27. Longa duração | Fixture de 365 dias intacto, complemento de cartões ao longo de meses, novos, difíceis, fáceis, arquivos e suspensões |
| 28. Correções | Último cartão agora abre resumo; reedição preenche textareas; transações rejeitam estado obsoleto e duplicatas |
| 29. Limites | Sem áudio, correção automática, HTML livre, mídia, otimização pessoal ou reversão de resposta; ver contrato |
| 30. Publicação | Código e evidências preparados para revisão; publicação e merge ficam separados |

## Resultados executados

O log [baseline-tests.txt](baseline-tests.txt) registra os **80 testes originais aprovados** antes da implementação. O log [tests.txt](tests.txt) registra **122 testes aprovados**, sem falhas, na execução completa. O teste adicional de Análises passou em [analytics-test.txt](analytics-test.txt): são **123 casos distintos validados**. A validação final das regras de dados passou em nove verificações direcionadas ([integrity-final.txt](integrity-final.txt)); upgrade físico, retomada e reedição também têm [log específico](upgrade-tests.txt). Não há testes com estudantes reais: primeira utilização, idiomas, programação, matemática, muitos cartões e retomadas são simulações automatizadas.

As jornadas verificam os seis tipos pela interface, direções independentes, prática livre, cartões novos, limites de fila, edições, movimentação, suspensão, exclusão, duplicidade em duas abas, reserva de tempo, F5 durante a prática, falha transacional, formulários preservados, resultados por tópico, sessão multidisciplinar, roteiro com cartões, registro único de tempo, upgrade físico e round-trip de backup. O backup específico da v7.2 foi exportado pelo código original e comparado integralmente após a restauração.

A auditoria [browser-chromium.json](browser-chromium.json), produzida por `npm run audit:flashcards`, verifica **64 combinações de tela, tema e largura** e **14 estados de acessibilidade**. Nenhum transbordamento ou erro de JavaScript; nenhuma requisição externa durante os fluxos; nenhuma violação nas regras automatizadas executadas. As regras automatizadas cobrem parte da acessibilidade e não substituem avaliação com tecnologia assistiva.

A auditoria geral do aplicativo também percorre as outras abas e os artigos de Ajuda. Os inventários [de controles](../INVENTARIO-CONTROLES.md) e [de conteúdo](../CONTEUDO.md) foram atualizados para incluir os novos módulos e conferir destinos. Os logs desta rodada ficam junto deste relatório.

### Matriz de execução

| Ambiente | Status desta rodada |
|---|---|
| Chromium do sistema, desktop | **TESTADO EM EXECUÇÃO**, testes funcionais, dados, backup, teclado, offline após abertura, layouts e axe |
| Viewports 1920, 1440, 1366, 768 px | **TESTADO EM EXECUÇÃO**, dois temas |
| Viewports 430, 390, 375, 320 px | **TESTADO POR EMULAÇÃO** no Chromium, dois temas |
| Firefox / WebKit | **NÃO TESTADO** nesta rodada: downloads recusados com HTTP 403 `Domain forbidden` pela política de rede; a CI continua configurada para ambos |
| Chrome e Edge oficiais | **NÃO TESTADO**; Chromium não equivale a esses produtos |
| Safari real, Android e iPhone físicos | **NÃO TESTADO** |
| Leitores de tela, teclado virtual e rotação em aparelho físico | **NÃO TESTADO**; sem alegação de conformidade completa WCAG |
| Modelos, licença, schema, referências e fallback de reserva | **VALIDADO POR INSPEÇÃO**, com testes automatizados dos contratos aplicáveis |

### Performance

Os números completos ficam no campo `performance` de [browser-chromium.json](browser-chromium.json). São amostras de uma máquina de desenvolvimento compartilhada, com outros testes em execução; não representam percentis nem promessa para celulares.

O complemento sintético tem 1.500 conteúdos, 2.000 direções e 10.800 respostas distribuídas em encontros ao longo de 365 dias, além dos exemplos usados na jornada. Algumas direções permanecem novas; outras estão suspensas ou arquivadas. Eventos antecipados usam prática livre. O JSON inclui todos os eventos e passa por validação e restauração. Não contém dados pessoais.


| Operação | Amostra medida |
|---|---|
| Carregar snapshot local | 1905.2 ms |
| Selecionar fila | 3.5 ms |
| Renderizar biblioteca | 15.2 ms |
| Buscar conteúdo | 12.4 ms |
| Confirmar uma resposta | 55.9 ms |
| Gerar JSON e checksum | 360.7 ms |
| Validar JSON | 616.2 ms |
| Restaurar atomicamente | 3930.8 ms |

A fila usa mapas de conteúdo/conjunto, e responder um cartão lê apenas os registros relacionados, sem redesenhar todas as Análises. O inventário e a exportação completos têm custo proporcional ao histórico; a resposta interativa não recalcula esse histórico inteiro.

## Capturas reais

- [Revisões na v7.2.0](screenshots/reviews-before.png) e [panorama da v7.3](screenshots/reviews-after.png). Os datasets sintéticos não são idênticos: a versão anterior não tinha cartões nativos.
- [Escolha dos seis tipos](screenshots/types.png).
- Editores: [pergunta/resposta](screenshots/editor-basic.png), [termos](screenshots/editor-term.png), [idiomas](screenshots/editor-language.png), [lacunas](screenshots/editor-cloze.png), [problemas](screenshots/editor-problem.png), [sequências](screenshots/editor-sequence.png).
- [Configuração guiada](screenshots/guided-builder.png) e [atividade guiada](screenshots/guided-player.png).
- [Resposta e avaliação no desktop](screenshots/study-1440-dark.png) e [resultado](screenshots/result.png).
- [Prática em 320 px](screenshots/study-320-light.png), [editor mobile claro](screenshots/editor-mobile-light.png) e [escuro](screenshots/editor-mobile-dark.png).

São screenshots de Playwright, não mockups. Em modais longos, a imagem registra a posição de rolagem alcançada durante a jornada; os demais campos continuam acessíveis por rolagem.

## Reproduzir

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run audit:inventory
npm run audit:flashcards
npm run audit:browser
```

Node.js 24, Playwright 1.62.1 e Chromium disponível em `/usr/bin/chromium` nesta execução. A CI instala o motor selecionado e executa a mesma suíte e auditorias sem publicar o site.

Para outro motor, instale-o pelo Playwright e use `BROWSER=firefox` ou `BROWSER=webkit`. Esta instrução descreve como reproduzir; não afirma que a execução local desses motores ocorreu.
