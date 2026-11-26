# Ciclo v8.3.0 — Learning Hub & Home Refinement

## Base e escopo

Base verificada: `origin/main` em `77e443a621a93ebadfb14a619e27bd1be337f43c`, com o PR #7 incorporado. O checkout inicial estava em v7.3; a branch desta entrega foi criada diretamente da main atualizada. O PR #3 não foi incorporado. Nenhum merge, tag, release ou deploy foi realizado.

Na base: APP_VERSION 8.2.0, backup lógico 13 e IndexedDB físico 2. Baseline local: 151 testes, 151 aprovados no Chromium, sem falhas ou ignorados. O anexo recebido contém o pedido textual; as duas imagens citadas nele não estavam disponíveis. As comparações usam capturas reais da base v8.2, em contextos sintéticos isolados.

## Cadastro e contratos

| Entidade | Fonte de verdade | Comportamento |
|---|---|---|
| Material | `courses.disciplineIds` | IDs únicos; uma ou várias disciplinas. `disciplineId` não é persistido em paralelo. |
| Tópicos diretos | `courses.topicIds` | Tópicos existentes e das disciplinas associadas. Não exigem bloco. |
| Blocos relacionados | `contentBlocks.courseIds` | Relação inversa existente preservada; sem `course.blockIds` concorrente. |
| Conteúdo estudado | `sessions.contentEntries`, `topicEntries`, `disciplineEntries` | Somente seleção real da sessão, com nomes e emoji em snapshot. |

O cadastro mínimo continua sendo nome, disciplina e link. O emoji é opcional e pode ser colado, escolhido nas sugestões locais ou pelo seletor do sistema. `Intl.Segmenter` valida um único grafema, preservando famílias, bandeiras, modificadores, keycaps e profissões com ZWJ. Não há biblioteca ou consulta externa. Sem emoji, o nome permanece suficiente para identificar o material.

As disciplinas adicionais ficam em um seletor pesquisável recolhido. Chips permitem consultar e retirar associações. Tópicos e blocos aparecem agrupados pela disciplina de origem; busca, paginação de tópicos e listas delimitadas mantêm o formulário utilizável. A visão contextual de tópicos usa união por ID para não duplicar um tópico direto também presente em bloco.

Novos tópicos podem ser preparados no editor sem abandonar o formulário. Nada é gravado antes de Salvar material; cancelar descarta somente essa preparação. Nomes duplicados são conferidos no banco dentro da transação, inclusive quando duas abas criam o mesmo tópico. Criação, vínculos diretos e alterações nos blocos são atômicos. Rascunhos de nomes ainda não associados permanecem ao redesenhar a lista.

Retirar disciplina não apaga tópicos, blocos, comentários, estudos, resultados ou revisões. Havendo vínculos afetados, o editor mostra a contagem e exige a ação explícita de remover esses vínculos, ou adicionar a disciplina novamente, antes de salvar. Os tópicos e blocos continuam disponíveis em Organizar.

## Estudo, cronômetro e histórico

Hoje → Meus materiais → Estudar e Hoje → Começar a estudar usam `openRegisterModal` e os mesmos componentes de registro. O primeiro caminho sugere apenas a primeira disciplina ativa do curso; o usuário pode trocá-la e adicionar outras voluntariamente. A continuação por disciplina preserva o atalho imediato da v8.2.

Escolher um material não seleciona todas as disciplinas nem seus tópicos. O formulário oferece tópicos da disciplina atual, blocos e uma ação explícita de selecionar todos os tópicos pertinentes daquela disciplina. Tópicos de outras disciplinas não entram automaticamente. Adicionar outra disciplina do curso mantém o material escolhido, inclusive quando ele foi trocado durante o preenchimento.

Abrir material fica junto ao seletor, sem URL extensa. O acesso permanece em Hoje durante a sessão, no Foco e na Apresentação. O link usa HTTP/HTTPS validados, `target="_blank"` e `rel="noopener noreferrer"`; o símbolo externo usa SVG local. Abrir a fonte grava somente o acesso recente, sem re-renderizar o formulário, iniciar, pausar, finalizar ou duplicar cronômetro. Não há scraping, player, favicons ou previews remotos.

O relógio continua usando runId, reserva atômica e persistência da v8.2. Os testes cobrem abertura antes e depois de iniciar, nova guia sem opener, retorno, F5, retomada e finalização de uma única sessão. Material ou bloco em uso não pode ser excluído antes de finalizar; arquivar preserva os dados. Mudanças posteriores nos tópicos do curso ou bloco não substituem a seleção do relógio.

Uma sessão mantém uma duração total. As parcelas por disciplina e as estimativas por blocos/fontes dividem esse total; relações não multiplicam minutos. Filtros de Resultados, Histórico e PNG usam os vínculos efetivamente gravados. Os filtros de materiais e blocos reconhecem tanto as associações atuais quanto os vínculos dos snapshots históricos, inclusive depois de remover uma disciplina do curso. Os nomes históricos permanecem no snapshot após renomear ou desassociar o material; a validação de backup não exige que o catálogo atual ainda tenha a associação histórica.

Blocos continuam sendo unidades de revisão. Cadastro de tópicos ou associação a curso não cria estudo nem agenda nova. Políticas individuais, sem data, desativadas, manuais e roteiros permanecem. Revisões de tópicos e blocos oferecem fontes relacionadas sob demanda. Avaliar o bloco não inventa avaliações de cada tópico.

## Hoje e composição visual

A frase local fica junto ao título e à data, discreta, com autor e obra; respeita `showDailyQuote` e não ocupa mais um painel lateral. O painel de boas-vindas mantém saudação, ação principal e grafismo circular com proporções menores. A sugestão de estudo permanece sob demanda.

Meus materiais mostra três cursos, priorizando favoritos, recentes e depois demais ativos. O catálogo completo fica a um clique. Sem material, um convite curto permite cadastrar o primeiro. Nomes quebram linhas naturalmente, sem ellipsis que esconda conteúdos.

Continuar usa duas linhas com largura e ações alinhadas, sem a fileira irregular de chips. Durante o estudo essa área sai de cena; o material da sessão ganha acesso direto. Em Hoje, a barra não repete o nome do curso já exibido no painel; seu arranjo flexível acomoda fontes mais largas sem empurrar as ações para fora da janela. O dia aparece uma vez; seu total é um botão para os detalhes do dia, preservando a navegação anterior sem outro botão redundante. Histórico e PNG continuam acessíveis.

Resumo semanal e gráfico ficam visíveis. Foram retiradas observações repetidas da semana e a lista lateral que reproduzia toda a navegação. Prazos, revisões e planejamento relevante ficam em A seguir; a criação de conteúdos fica em Organizar conteúdos, ambos recolhíveis. Preferências de ocultação dos blocos e da frase são respeitadas.

A auditoria verifica as ações contra o limite visível real de `#today-body`, além da janela, evitando aceitar controles cortados por rolagem interna. Há capturas de 1920×1080, 1440×900, 1366×768, 1280×720 e 1024×768, além de 430, 390, 375 e 320 px, em temas claro e escuro. Mobile mantém rolagem natural. O estado ativo também é verificado em 1280 e 1024 px com a fonte alternativa DejaVu Sans, para exercitar a variação de métricas entre sistemas. Casos adicionais incluem novo usuário, ausência de materiais, um material de nome longo, primeiro estudo, frase oculta, sessão ativa/pausada, Foco, Apresentação e zoom CSS de 125%. Isso não representa teste de zoom do sistema ou da barra real de um navegador físico.

## Persistência, concorrência e recuperação

Backup lógico: **14**. IndexedDB físico: **2**, sem novos stores ou índices. A migração lógica é atômica e idempotente: preserva ID, nome, URL, plataforma, descrição, favorito, acessos e blocos; converte a disciplina original para uma lista. Emoji e tópicos diretos antigos iniciam vazios. Nenhuma sessão é reescrita. A leitura tolera registros legados e a migração revalida o registro atual dentro da transação.

Backup inclui emoji, disciplinas, tópicos, blocos, snapshots, agendas e preferências. O checksum é verificado no arquivo original, antes da normalização. Backups 13 e anteriores suportados continuam importáveis. Referências inexistentes ou tópicos de outra disciplina são recusados. Falhas de restauração ou criação em lote não deixam gravações parciais.

Editor usa comparação otimista do conteúdo original com o banco atual; alterações de acesso recente não geram conflito falso e o timestamp mais recente é preservado. Alterar um bloco relacionado em outra aba também impede sobrescrita silenciosa. Em conflito ou falha, a janela mantém o preenchimento para conferir e tentar novamente. Remover uma disciplina durante o registro recusa gravação parcial. Exclusão definitiva da disciplina revalida vínculos na transação.

**Recuperação:** gere e guarde backup antes de atualizar. Em falha, preserve o navegador e o arquivo; recarregue para retentar a migração ou reabra o editor para conferir conflito. Para voltar aos dados antigos, use o backup anterior à atualização com a versão compatível, em contexto separado. Voltar somente o código para v8.2 não é downgrade seguro de um catálogo multidisciplinar. Arquivos 14 exigem v8.3 ou posterior. Não limpar IndexedDB e não editar manualmente a versão do backup.

## Medições reais

Cinco amostras síncronas por interação, em contextos locais isolados. Medianas em milissegundos; gravação tem uma amostra real por cenário. Mesmos 15 disciplinas, 40 materiais, 100 blocos e 350 tópicos. A coluna multidisciplinar amplia cada curso para três disciplinas e 12 tópicos diretos; sessões existentes não mudam. Não inclui pintura, rede real, FPS ou estudo com usuários. As diferenças pequenas são ruído possível, não garantias de ganho.

| Estudos | Interação | v8.2 | v8.3 equivalente | v8.3 multidisciplinar | Δ equivalente |
|---:|---|---:|---:|---:|---:|
| 1,000 | Abrir Hoje | 14.4 | 15.6 | 10.0 | +1.2 |
| 1,000 | Catálogo | 15.7 | 22.8 | 12.5 | +7.1 |
| 1,000 | Editor do curso | 13.2 | 21.3 | 12.1 | +8.1 |
| 1,000 | Formulário de estudo | 7.8 | 10.4 | 6.9 | +2.6 |
| 1,000 | Selecionar curso | 0.5 | 1.3 | 0.8 | +0.8 |
| 1,000 | Configurar duas disciplinas | 8.2 | 11.2 | 7.9 | +3.0 |
| 1,000 | Histórico | 24.7 | 30.8 | 15.2 | +6.1 |
| 1,000 | Resultados | 25.6 | 32.5 | 19.8 | +6.9 |
| 1,000 | Gravar estudo | 24.9 | 39.6 | 24.7 | +14.7 |
| 10,000 | Abrir Hoje | 37.2 | 17.4 | 22.3 | -19.8 |
| 10,000 | Catálogo | 17.7 | 19.8 | 22.7 | +2.1 |
| 10,000 | Editor do curso | 12.4 | 16.6 | 26.3 | +4.2 |
| 10,000 | Formulário de estudo | 8.5 | 9.1 | 10.6 | +0.6 |
| 10,000 | Selecionar curso | 0.5 | 1.0 | 1.4 | +0.5 |
| 10,000 | Configurar duas disciplinas | 10.2 | 11.3 | 13.3 | +1.1 |
| 10,000 | Histórico | 23.0 | 31.7 | 33.3 | +8.7 |
| 10,000 | Resultados | 33.5 | 39.1 | 51.4 | +5.6 |
| 10,000 | Gravar estudo | 37.9 | 34.0 | 39.3 | -3.9 |

O editor mais rico, os relacionamentos adicionais e a busca têm custo; a tabela registra também regressões, sem declarar ganho universal. O catálogo usa índices derivados por curso e tópico, invalidados no carregamento dos dados. A escolha de emoji não recalcula a aplicação. Busca e seleção atualizam listas locais, sem reconstruir o formulário inteiro. Nenhuma dependência foi adicionada.

Os arquivos `before/interactions.json` e `after/interactions.json` contêm amostras, navegador e hashes de fonte. `before/performance.json` e `after/performance.json` medem também inicialização, consultas, exportação, parse, restauração e PNG, com até 10.000 estudos. O primeiro benchmark da base foi executado durante a auditoria inicial, com outras verificações em curso; sua comparação é indicativa e não isola causalidade. A medição de interações foi refeita de forma sequencial para comparação mais controlada. Busca de tópicos dentro do curso é nova e não tem equivalente direto na v8.2.

## Validação e limites

A suíte final contém **176 casos**, dos quais 25 são novos testes do Learning Hub. Preserva os 151 testes da base; expectativas do schema passaram para 14 e o teste de arquivo verifica especificamente a retirada do curso arquivado. Não há casos removidos ou desabilitados. A suíte cobre emojis compostos, migração, cadastro progressivo, vínculos, snapshots, backup 13/14, duas abas, falhas atômicas, source links, relógio, mudança de fonte e distribuição sem duplicação.

Verificações locais: sintaxe; inventário; suíte funcional Chromium; auditorias de navegador, campo, experiência, v8, aprendizagem conectada e Learning Hub. A rodada inicial detectou regressões de navegação e expectativas antigas do schema; foram corrigidas e reexecutadas. A primeira CI aprovou os 175 funcionais no Chromium e no Firefox, mas detectou corte em 1280 px durante o estudo com outra fonte. A barra foi ajustada e o teste de enquadramento foi mantido, com uma verificação adicional de fonte alternativa. A aprovação válida é a da matriz no SHA final, registrada no PR. A suíte completa local inicial aprovou 175 casos. A correção final do foco acrescentou o caso 176; os 35 casos de calendário e Learning Hub passaram após ela. Um teste com relógio controlado falha no commit anterior porque a abertura rouba o foco do link para o nome; na correção, o foco escolhido e a digitação permanecem. A segunda CI aprovou toda a suíte e auditorias no Chromium, mas expôs essa corrida intermitente em Firefox/WebKit; a matriz do commit final continua sendo a referência de aprovação. O caso de remoção de associação confirma agora os filtros de material e bloco no histórico. Um reprodutor no commit anterior escondia ambas as opções apesar de manter 45 minutos; na correção, ambas aparecem e os mesmos 45 minutos permanecem. Os resultados completos e hashes ficam nos artefatos. Os resultados da **matriz Chromium, Firefox e WebKit sobre o commit final** são registrados no corpo do PR e nos checks desse SHA, evitando tratar execuções anteriores como prova do commit final.

Firefox e WebKit não foram executados neste ambiente local: o download oficial foi recusado pela política de rede e a alteração de configuração não foi concluída. A matriz remota do PR é necessária para esses motores. Não foram testados aparelhos físicos, leitores de tela reais, fullscreen em hardware, throttling móvel ou interrupção física de energia. O axe automatizado detectou zero violações nos recortes testados; isso não substitui avaliação com tecnologia assistiva real.

Capturas são reais e foram inspecionadas; ver [índice visual](EVIDENCIAS.md). Fixtures são sintéticas. Nenhum acesso ao material ocorre sem clique do usuário. Não foi feita publicação de teste ou produção. Prontidão para merge/publicação exige a matriz final verde e revisão do proprietário; este PR entrega a candidata para essa revisão.
