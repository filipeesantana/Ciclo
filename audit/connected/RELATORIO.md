# Ciclo v8.2.0 — Connected Learning & Insights

Candidata a revisão, construída sobre `main` em `5bf2602` (v8.1.0, PR #6 integrado). A cópia inicial do ambiente estava na v7.3; ela foi atualizada antes da implementação. O PR #3 permanece separado. Nenhum dado pessoal foi aberto ou alterado. Não houve merge, tag, release ou publicação no GitHub Pages.

A leitura direta do site publicado e da API de builds do Pages foi bloqueada pela rede deste ambiente (HTTP 403). Portanto, a versão da `main` está confirmada; a versão efetivamente servida pelo Pages não foi confirmada aqui.

## Decisões e inventário de atritos

| Área | Constatação na v8.1 | Decisão implementada |
|---|---|---|
| Fontes | Não existia catálogo nativo de links | Cursos e materiais em Organizar; favoritos e recentes compactos em Hoje |
| Conteúdos | Só tópicos eram unidades persistentes | Blocos reutilizáveis e opcionais, sem hierarquia rígida de aulas |
| Revisões | Dez tópicos podiam gerar dez sugestões | Bloco estudado se torna unidade; políticas individuais explícitas prevalecem |
| Resultados | Filtros comuns abriam o construtor; gráficos ficavam recolhidos | Panorama novo, filtros diretos, gráficos visíveis e exploração progressiva |
| Exportação | Muitas ações no cabeçalho | Histórico e Relatório permanecem diretos; TXT, cópia e análises salvas em exploração |
| Relatório para IA | Exportação textual disponível em Dados e no cabeçalho antigo | Preservada em Dados; removida do cabeçalho de Resultados; nenhum envio automático |
| Disciplinas | Navegação exigia voltar ao índice para trocar de disciplina | Lista lateral no detalhe em desktop e conteúdos contextuais |
| Planejamento | Navegação por semanas sem salto por mês/ano | Escolher dia abre calendário e leva à semana correspondente |
| Datas | Parser aceitava dias impossíveis e sufixos | Parser civil estrito e componente compartilhado |
| Prazos | Conclusão preservava registros; faltava arquivo separado | Arquivamento reversível, fora da urgência e da lista ativa |
| Animações | O seletor recriava elementos com animação de revelação | Calendário novo sem animação bloqueante; gráfico só muda em filtros/resize |

O cronômetro, Pomodoro, pausas, descanso, Foco, revisão livre, histórico e cálculos anteriores foram preservados. A interface nova não exige curso, bloco, tópico, meta ou avaliação para registrar uma disciplina por 30 minutos. Não há LMS, player, binários, flashcards nativos, FSRS, backend ou dependência nova.

## Cursos, blocos e sessões

`learning.js` contém os contratos e comandos de aprendizagem; `insights.js` apresenta Resultados e a projeção dos novos recortes; `dates.js` compartilha a seleção civil. A persistência continua sendo IndexedDB, através de `DB.atomic` e `SessionCommands`.

- `courses`: ID estável, disciplina, nome, URL, favorito, arquivo, plataforma e descrição opcionais, carimbos e última abertura. Cadastro mínimo: nome, disciplina e link.
- `contentBlocks`: ID estável, disciplina, nome, IDs de tópicos e materiais, arquivo e política manual opcional de revisão. A relação bloco–curso é múltipla; um tópico pode estar em mais de um bloco.
- `session.contentEntries`: vínculos opcionais por disciplina, com IDs, nomes registrados, IDs dos tópicos efetivamente confirmados e resultado geral opcional. Um estudo com várias disciplinas pode ter fontes e blocos em cada segmento.

Escolher curso nunca preenche tópicos. Escolher bloco preenche seus tópicos e permite retirar, acrescentar ou registrar somente o bloco. O cadastro em lote deduplica nomes normalizados dentro da disciplina, informa existentes/novos e grava tópicos e bloco numa única transação. Não há inferência por semelhança entre conceitos.

Editar a composição de um bloco não reescreve o histórico. Nomes e vínculos selecionados são recuperados no rascunho, cronômetro após F5, finalização e edição. O Foco oferece a fonte de forma discreta. Abertura externa é um `<a target="_blank" rel="noopener noreferrer">`; somente a recência muda. O estudo não começa sozinho, não ganha minutos e não recebe progresso fictício.

A validação aceita HTTP/HTTPS e rejeita protocolos perigosos, endereços malformados, controles/espaços e credenciais embutidas. URLs viram atributos do DOM, nunca HTML executável. Não há favicon, preview remoto, scraping ou acesso a contas. O formulário explica que parâmetros privados entram no backup. URLs e comentários não entram automaticamente no PNG; nomes de fontes dependem da opção de privacidade.

Arquivar preserva referências. Exclusão de um curso ou bloco com vínculos é recusada; exclusão de disciplina com materiais/blocos orienta arquivamento. Remover uma associação de um bloco não remove tópicos nem altera sessões anteriores. Edições conferem o registro atual dentro da transação; conflito entre abas deixa o formulário disponível.

## Revisões agrupadas e precedência

O cálculo do bloco deriva dos eventos reais de `contentEntries`, em ordem civil, usando `ReviewEngine.firstInterval` e `computeNext`. Não foi criado outro algoritmo de memória. Quando um bloco novo organiza tópicos já estudados, a primeira sugestão considera tópicos com estudos sem vínculo com outro bloco e usa a menor data automática existente e é identificada como derivada dos tópicos. Isso não cria sessão, não marca o bloco como estudado e não reescreve o passado. O resultado geral do bloco não é replicado para seus tópicos nem para outro bloco que compartilhe conteúdo. Revisão sem avaliação pode registrar atividade sem inventar uma nota.

1. Uma política individual explícita (`date`, `free`, `off`) prevalece sobre a supressão por bloco.
2. Blocos ativos que já foram estudados, ou que organizam tópicos com sugestões automáticas existentes, suprimem sugestões automáticas individuais dos tópicos atualmente associados. Não há fila automática do bloco mais dez filas redundantes.
3. Tópicos sem bloco estudado continuam usando o motor anterior.
4. Datas manuais permanecem manuais depois de estudar/revisar, editar ou excluir sessões; escolher automático devolve o cálculo ao histórico.
5. Sem data permite seleção livre. Não sugerir exclui das sugestões. Nenhum dos dois apaga o histórico.
6. Blocos e disciplinas arquivados saem das unidades ativas. Arquivar um curso não apaga nem desliga um bloco de conhecimento reutilizável.
7. Rever um tópico explicitamente não conclui o bloco. Rever um bloco não conclui outro bloco compartilhado.

A tela nova reúne disponibilidade, próximos dias, todos, sem data e desativados num filtro. Mostra disciplina, unidade, data e ações diretas. Os tópicos e as fontes são contextuais. A agenda por dia consulta a mesma `ReviewSchedule.due` da lista, com marcas nos dias programados. Seleções em lote são limpas ao trocar o recorte para impedir ações em conteúdo invisível.

Revisão livre aceita segmentos com blocos; roteiros sugerem blocos e preservam duração ajustável, ordem, método pessoal, pulo, pausa, retomada e encerramento antecipado. Roteiros existentes de tópicos permanecem válidos. Somente atividades realizadas entram numa única sessão; resultados gerais ficam nos blocos e resultados individuais, nos tópicos explicitamente avaliados.

## Calendários: causas, correções e evidência

Antes da alteração, a execução da v8.1 retornou:

```text
parseISO('2026-02-31') → data aceita e normalizada para março
normalizeAnalyticsQuery(custom com início 2026-02-31) → mantém a string inválida
parseISO('2026-11-01-lixo') → data aceita
```

O parser aceitava apenas o prefixo da string e o construtor `Date` normalizava dias fora do mês. O filtro podia exibir um intervalo diferente daquele consultado. Agora o formato inteiro e os componentes do calendário precisam corresponder. Datas civis nunca passam por `new Date('YYYY-MM-DD')` nem por corte de `toISOString`.

A base nova compartilha meses, ano, validação, foco e teclado. Navegação mensal ancora o dia 1; `civilMonth` limita o dia ao último válido quando mantém a posição do teclado. Assim, 31/01 + um mês é 28/02 ou 29/02. Os calendários inline preservam seu formulário pai e mantêm escolhas temporárias separadas do valor aplicado. Cancelar/Escape não grava. O intervalo aceita o mesmo dia, ordena extremos invertidos e inclui o último dia.

Regressões adicionais encontradas durante a implementação foram corrigidas: cancelar o intervalo não podia deixar o seletor mostrando Personalizado enquanto a consulta continuava em 30 dias; filtros de bloco e tópico não podiam incluir um tópico fora do snapshot daquele bloco; as barras do gráfico precisavam respeitar o tamanho mínimo de alvo. Há testes dedicados para esses casos.

`tests/connected-dates.test.cjs` executa cliques, digitação, teclado, confirmação, cancelamento e F5. O fixture de novembro (20 min em 31/10, 40 em 1/11, 60 em 15/11, 80 em 30/11 e 100 em 1/12) confirma **180 minutos e três sessões** no mês, em Resultados, Histórico e PNG. Inclui Planejamento, Prazos, revisão por data, ano bissexto, virada de ano, São Paulo, Nova York e Auckland. Não se afirma que todo calendário possível esteja perfeito; os cenários estão delimitados nos testes.

## Resultados, cálculos e relatórios

O panorama anterior e seu cabeçalho de ações foram substituídos; o código de apresentação que ficou sem uso foi removido. O novo panorama mostra tempo, sessões, dias e disciplinas, com gráfico temporal e barras horizontais comparáveis. Exercícios aparecem quando existem. No desktop, gráficos dividem a largura; no celular, seguem a ordem de leitura. A granularidade temporal se adapta ao espaço para manter alvos acessíveis. Não há interpolação de valores.

Hover e foco mostram o mesmo detalhe. Clique, toque ou Enter consultam registros. Uma tabela oferece valores alternativos. Filtros de período e disciplina são imediatos; materiais, blocos, tópicos e múltiplas disciplinas ficam sob demanda. O recorte ativo é visível e pode ser limpo. O Histórico mantém a projeção do tempo do recorte, mas a edição abre o registro original completo. Voltar/F5 preservam a consulta.

**Semântica matemática:** seleções dentro de uma dimensão formam união; dimensões distintas se intersectam. Cada sessão aparece uma vez. Primeiro vale a repartição da disciplina já existente. Havendo vários vínculos de conteúdo na mesma disciplina, essa parcela é repartida entre eles, com estimativa indicada e distribuição determinística de minutos inteiros. Um bloco só atribui tópicos do snapshot daquela sessão. Um resultado sem tópico não é inventado como evidência de um bloco. Questões continuam usando soma de acertos / soma de questões.

As comparações nomeiam o período anterior, com datas exatas; períodos em andamento usam o mesmo número de dias decorridos. Zero anterior não gera crescimento percentual inválido. Tempo não é apresentado como domínio ou progresso de conclusão de curso.

O editor PNG herda período, disciplinas, fonte e bloco. Pode alterar esses recortes, tema, cores, modelo, proporção, ordem, marca e assinatura. Inclui elementos opcionais de materiais e blocos, com nomes ocultos por padrão. Os quatro formatos e a equivalência de pixels entre prévia e arquivo continuam cobertos pelos testes de interface. TXT/cópia continuam locais. Exportação para IA permanece opcional em Dados, sem serviço externo.

## Dados, migração e recuperação

Backup lógico **12 → 13**; IndexedDB físico **1 → 2**, com duas stores acrescentadas no upgrade e índices por disciplina. As coleções iniciam vazias: não são inventados cursos, blocos ou vínculos para estudos antigos. O nome do banco e as chaves legadas foram preservados.

O checksum inclui as novas propriedades somente quando elas existem, mantendo a canonicalização de arquivos antigos. O leitor 13 exige as duas coleções de um backup 13 e valida IDs, URLs, referências e snapshots. A prévia inclui as novas contagens. Limpeza e inserção permanecem na mesma transação, incluindo roteiros pausados. Falha após a limpeza reverte tudo. O cronômetro não é descartado antes de uma gravação confirmada.

Existe teste de upgrade físico real: um banco de versão 1 é criado num contexto isolado; a v8.2 o abre, cria as coleções e preserva estudos e agenda manual anteriores. Outros testes injetam falha na restauração e no cadastro em lote, removem bloco durante registro e editam materiais em duas abas.

**Publicação futura, sob revisão do proprietário:** conferir CI do SHA final, exportar backup local da v8.1, fechar abas antigas, publicar o código aprovado e conferir Hoje/Histórico/Revisões. Nenhuma limpeza de armazenamento é necessária. **Recuperação:** manter a versão 8.2 corrigida para ler o banco 2 e backups 13; restaurar um backup conferido pela interface. Reverter apenas o código para uma versão que abre IndexedDB 1 não é um downgrade seguro de um banco já atualizado. Voltar à v8.1 exige um contexto separado com backup anterior 12; não apagar o banco atual para fazer isso.

## Jornadas medidas

Execuções Playwright na v8.1 e na candidata, mesmo contexto sintético e período fixo. São interações semânticas confirmadas, não cliques físicos do seletor nativo nem pesquisa de usabilidade. Fontes: [antes](medicoes/jornadas-antes.json), [depois](medicoes/jornadas-depois.json), script `tests/connected-journeys.cjs`.

| Operação a partir da tela correspondente | v8.1 | v8.2 |
|---|---:|---:|
| Filtrar uma disciplina em Resultados | 3 | 1 |
| Aplicar período personalizado por calendário | 5 | 4 |
| Escolher dez tópicos | 12 | 1, selecionando o bloco |
| Abrir registros do recorte | 1 | 1 |
| Abrir editor de relatório | 1 | 1 |
| Controles iniciais no cabeçalho de Resultados | 9 | 4 |

Abrir favorito visível é um clique real, verificado com popup, `window.opener === null`, sessão intacta e recência persistida. Não existe comparação numérica com a v8.1, que não tinha esse catálogo. Dez tópicos estudados por um bloco produzem uma unidade automática, com zero sugestões individuais redundantes; uma política individual explícita continua independente. Datas de revisão mantêm a escolha manual e podem ser alteradas diretamente pela unidade.

## Performance medida

Comparação sequencial no mesmo Chromium e host, com os mesmos fixtures e condições, antes/depois em contextos isolados. Cinco amostras de renderização síncrona por tela, caches invalidados; tabela mostra medianas dessas amostras. Reload é uma amostra até `state.ready`. Não mede FPS, memória total nem apresentação real do compositor. A API de heap não ficou disponível; valores `null` foram mantidos. Arquivos completos: [antes](medicoes/antes.json), [depois](medicoes/depois.json).

| Estudos | Reload antes → depois (ms) | Resultados síncrono (ms) | Histórico síncrono (ms) | Revisões síncrono (ms) | Parse de backup (ms) |
|---:|---:|---:|---:|---:|---:|
| 100 | 168,9 → 250,8 | 18 → 15 | 20 → 18 | 17 → 18 | 19 → 11 |
| 1.000 | 238,6 → 226,9 | 27 → 25 | 33 → 21 | 21 → 14 | 39 → 41 |
| 5.000 | 629,4 → 503,8 | 29 → 37 | 34 → 35 | 16 → 21 | 155 → 172 |
| 10.000 | 732,0 → 765,6 | 31 → 23 | 40 → 38 | 16 → 10 | 283 → 329 |

A execução com 100 estudos teve reload 82 ms maior; com 5.000, Resultados síncrono subiu 8 ms. O parse de 10.000 subiu 46 ms com a validação adicional. Essas regressões são registradas; amostras pequenas não provam ganho geral. A atualização carrega três módulos locais e duas coleções adicionais, mas não acrescenta dependências ou rede de aplicação. Não foi observado bloqueio funcional nessas cargas.

O [complemento conectado](medicoes/aprendizagem-conectada.json) usa 15 disciplinas, 40 materiais, 100 blocos, 350 tópicos, sobreposição, arquivos e estudos antigos/novos. Em 100 / 1.000 / 5.000 / 10.000 estudos, os reloads foram 286 / 318 / 583 / 916 ms; consultas combinadas de curso e bloco, 4 / 8 / 15 / 23 ms; desenho e codificação PNG, 24 / 32 / 23 / 23 ms. São medições de domínio/renderização, complementadas pelas jornadas reais de interface. Duas chamadas `requestAnimationFrame` são descritas como oportunidade de pintura, sem tratá-las como apresentação comprovada.

## Validação e limites

O baseline da v8.1 passou em **117 testes** ([saída](medicoes/baseline.txt)). A suíte foi ampliada para 150 casos com testes de aprendizagem conectada, calendários, migração física, concorrência e projeção matemática. As adaptações em testes anteriores atualizam schema e controles legitimamente substituídos, preservando as verificações de comportamento. Nenhum teste crítico foi removido ou ignorado.

A execução local integral passou nos 148 casos carregados ao seu início; os casos adicionais de agrupamento legado e fluxo móvel por toque passaram separadamente. As auditorias locais de navegador, campo, experiência e v8 passaram em Chromium. A auditoria conectada executou 80 combinações de tela/tema/largura e produz capturas reais em desktop/celular e claro/escuro, verifica transbordamento, erros, backup do dataset e acessibilidade automatizada das quatro áreas novas. [Capturas reais](evidencias/INDICE.md) e saídas são preservadas em `medicoes` e `evidencias` e nos artefatos da CI. A CI executa a suíte e todas essas auditorias em Chromium, Firefox e WebKit no SHA da branch; seu resultado final é registrado na descrição do PR, sem reutilizar checks de commits anteriores.

Limitações de ambiente: downloads locais de Firefox/WebKit foram recusados pelo servidor de rede (403 Domain forbidden); esses motores dependem da execução da CI. O Chromium local é execução real automatizada; celular é emulação de viewport/toque. Chrome oficial, Edge, Safari, Android/iPhone físicos e leitores de tela reais não foram executados. Axe e teclado não constituem certificação completa de WCAG 2.2 AA. Não houve teste com o navegador pessoal nem com dados reais do proprietário.

Planejamento continua opcional e centrado na semana; não foi acrescentado um segundo calendário de aulas. Campos de curso/bloco nos blocos planejados e classificação de material por tipo foram avaliados e não acrescentados para preservar o fluxo simples. Os vínculos efetivamente estudados são escolhidos no registro. A organização por curso de uma revisão é obtida pelas fontes do bloco, busca e disciplina; não existe um painel separado de LMS.

**Prontidão:** candidata para revisão funcional e visual. Publicação depende da aprovação do proprietário, da confirmação da matriz do commit final e das verificações nos navegadores/aparelhos que ele utiliza. Este relatório não autoriza nem executa publicação.
