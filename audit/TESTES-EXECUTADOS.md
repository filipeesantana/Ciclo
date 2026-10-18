# Testes executados

18/10/2026, Chromium Linux headless 154.0.8037.57. Dados inteiramente sintéticos, perfis descartáveis e servidor local. Nenhum histórico pessoal foi utilizado.

| Verificação | Resultado | Evidência |
|---|---|---|
| Sintaxe de app.js/content.js | aprovado | npm run check |
| Integridade, exportação e compatibilidade | 21 casos | tests/integrity.test.cjs |
| Jornadas reais pela interface e comandos de concorrência | 22 casos | tests/journeys.test.cjs |
| Planejamento, arraste, períodos, preferências e fusos | 6 casos | tests/planning-periods.test.cjs |
| Total da suíte | 49 casos | [log completo](evidencias/depois/testes.txt) |
| Acessibilidade automática | 95 configurações; nenhuma violação detectada | [relatório bruto](evidencias/depois/acessibilidade/results.json) |
| Ajuda | 91 artigos abertos sem falha | mesmo relatório |
| Destinos de artigos, ações e glossário | nenhum destino ausente | npm run audit:inventory e [catálogo](CONTEUDO.md) |
| Console e conexões externas no percurso auditado | nenhum erro JavaScript; nenhuma requisição externa observada | campo errors/outgoing no relatório do navegador |
| Carga | seis cenários, até 5.000 estudos/1.000 dias | [PERFORMANCE](PERFORMANCE.md) e JSONs brutos |
| Diff | sem erros de whitespace | git diff --check |

As 95 configurações são nove telas × dois temas × dois tamanhos (36), treze focos de Análises nas mesmas combinações (52), e sete formulários (7). Há estados vazios e preenchidos, mas isso não é o produto cartesiano de todos os estados possíveis. Axe não comprova conformidade integral com WCAG.

## Antes e depois

Os testes com prefixo REGRESSÃO foram executados contra os quatro arquivos do commit original, em diretório separado: falham nos problemas descritos em [DIAGNOSTICO](DIAGNOSTICO.md). Veja o [log anterior](evidencias/antes/regressoes.txt). A reprodução de restauração concorrente usou duas páginas do mesmo contexto, com um timer iniciado depois de abrir a prévia.

Uma comparação inicial de backup falhou apenas porque o fixture comparava strings de instantes equivalentes, com e sem `.000Z`; esse fixture foi corrigido para o formato canônico. Isso não foi classificado como bug do produto. A checagem de rádio também foi ajustada para aguardar o foco inicial assíncrono do modal; não se confundiu a corrida do teste com o comportamento final do usuário.

## O que os testes comprovam

Valores esperados independentes incluem 120=70+50, 90=30+30+30, 51/101 para acerto ponderado, 50/5 no Pomodoro, 45 min líquidos com 15 min de descanso, semana parcial de três dias e rollback que preserva duas disciplinas. Há duas abas reais no mesmo navegador, recarregamentos reais de página, clique nos formulários, teclado, arraste com ponteiro e persistência em IndexedDB real.

Falhas de gravação foram provocadas por resposta controlada de comando e por duplicata que aborta uma transação depois da limpeza. Isso não equivale a esgotar fisicamente a quota do aparelho. Passagem de tempo/suspensão foi simulada por relógio e timestamps; não equivale a suspender o sistema operacional.

## Como repetir

```sh
npm ci --ignore-scripts
npx playwright install chromium
npm run check
npm test
npm run audit:browser
npm run audit:inventory
npm run audit:benchmark
```

As dependências são somente de desenvolvimento. Firefox e WebKit podem ser selecionados por BROWSER depois da instalação correspondente. O workflow contém os três motores, mas os resultados deste relatório se referem às execuções registradas, não a jobs ainda não observados. Veja [COMPATIBILIDADE](COMPATIBILIDADE.md).
