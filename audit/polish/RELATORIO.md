# Ciclo v8.1.0 — Polish, Clarity & Identity

A base é a main após a integração do PR #5, commit `4113f8e`. As alterações se concentram na apresentação, nos pontos de entrada e na leitura dos registros. A versão conserva o formato lógico 12 e a versão física do IndexedDB.

| Área | Atrito observado na v8.0 | Mudança |
| --- | --- | --- |
| Hoje e Histórico | O atalho para os registros vinha depois das ações de análise. As descobertas precediam a busca e os registros. | O resumo do dia abre os registros filtrados. A busca vem antes da lista, com indicação de edição em cada linha. |
| Estudar e registrar | Os tipos opcionais abriam automaticamente no cronômetro e a configuração do tempo ocupava outra linha. | Disciplina e relógio dividem a largura. Campos complementares se expandem por escolha e mostram os valores recuperados do rascunho. |
| Revisões | Assuntos com data anterior apareciam depois dos futuros. Três controles de lote inativos ocupavam espaço antes da primeira seleção. | A agenda distingue hoje, datas anteriores e próximas. Selecionar um assunto revela as ações em lote. A agenda e as alternativas de revisão compartilham a largura disponível. |
| Resultados | Gráficos, observações e perguntas disputavam atenção com o total. | O panorama abre com o resumo e o período. Gráficos e exploração se abrem separadamente. Ver registros acompanha o recorte. |
| Organizar, Planejamento e Configurações | A navegação desaparecia durante a consulta a listas e ajustes longos. | A moldura da área permanece na tela. Planejamento mantém a ação do calendário junto aos dias e Configurações conserva o índice de grupos. |
| Ajuda e Dados | O guia era idêntico para todos e o backup dividia uma coluna longa com os detalhes técnicos. | A ajuda de cada tela combina explicação e exemplo local. A Central usa busca lateral no desktop. Dados coloca as ações de backup ao lado das opções. |
| Foco e Apresentação | Faltava distinção visual entre o estado do relógio, os controles e a identificação do Ciclo. | Marca, linha de cabeçalho e sinal de estado acompanham o mesmo cronômetro nas duas apresentações. |
| Relatório PNG | A marca ficava isolada ao pé da imagem e faltava assinatura pessoal. | A marca opcional integra o cabeçalho, o tempo ganha hierarquia e o rodapé aceita uma assinatura opcional. Desmarcar a assinatura retira o texto do modelo de exportação. |

## Dimensões e evidências

A moldura de desktop se aplica a partir de 861 × 580 pixels CSS. Listas, artigos e formulários expandidos permitem consultar dados de extensão variável dentro da área correspondente. Em janelas menores e no celular, o documento mantém a rolagem natural.

O teste `tests/polish.test.cjs` mede a altura e a largura do documento e os limites de uma ação por área em 1440 × 900, 1366 × 768, 1280 × 720 e 390 × 844. Ele salva as medidas em `test-results/polish/layout.json` e captura todas as áreas em notebook e celular. A auditoria existente da v8 também gera imagens dos dois temas e arquivos PNG exportados com dados sintéticos.

A matriz do PR executa `npm run check`, `npm test` e as auditorias do repositório em Chromium, Firefox e WebKit. Cada motor entrega seu diretório `test-results` como artefato. Resultados da execução são registrados no PR.
