# Ciclo 8.0.0 — The Next Generation

Candidata em revisão. A base é a `main` v7.3.0 em `6a1de8e71092efb722206214109b5c800b3d6057`. Os commits deste trabalho partem dessa base. Flashcards pessoais continuam disponíveis como método de revisão.

## O que mudou

- **Hoje e navegação.** Disciplinas e Planejamento estão em Organizar. Análises e Histórico estão em Resultados. Estudar inicia o fluxo ou revela a sessão ativa. No celular, os cinco destinos ficam na barra inferior e Ajuda, Dados e Configurações ficam no cabeçalho. O resumo de Hoje mostra sessões gravadas e oferece os registros do dia. Sugestão, atalhos e frase ficam recolhidos. O guia passou a abrir sob demanda no primeiro acesso.
- **Estudos.** O registro abre por duração e permite preencher disciplina e minutos imediatamente. Horários, data, descanso, tópico, dificuldade e resultados continuam disponíveis. Comentário e segunda disciplina têm ações visíveis. O mesmo formulário e os comandos transacionais atendem os caminhos rápido e detalhado.
- **Revisões.** A agenda reúne busca, filtros e seleção em lote. Amanhã usa a virada civil. Próxima semana usa o primeiro dia da semana seguinte conforme a configuração. Sem data mantém o assunto selecionável. Não sugerir o retira da fila. A data manual prevalece até uma nova escolha, inclusive após registrar uma autoavaliação. Reativar agenda automática volta ao cálculo a partir dos estudos. Revisão livre e roteiro produzem uma sessão agregada com os resultados dos tópicos efetivamente revisados.
- **Foco e Apresentação.** Relógio e controles usam o mesmo estado do cronômetro, inclusive em outra janela. O painel mostra os blocos configurados. Tela cheia é opcional e o modo expandido funciona como fallback.
- **Resultados.** O panorama tem atalhos de período, acesso aos registros do recorte e editor PNG. A imagem usa os mesmos cálculos do `AnalyticsEngine`. O editor oferece três modelos, quatro formatos, recortes, cores, contraste e controles de visibilidade e ordem. Nomes de disciplinas começam ocultos. Comentários e nomes de sessões ficam fora da imagem.
- **Histórico.** A busca continua abrangendo comentários, tópicos, disciplinas e resultados. O primeiro lote de registros cai de 150 para 60 e os totais continuam abrangendo todos os registros filtrados. A seleção de período e filtros permanece no histórico de navegação.

[Inventário funcional e decisões](DIAGNOSTICO.md) · [Inventário dos controles](INVENTARIO-CONTROLES.md) · [Conteúdo de Ajuda](CONTEUDO.md)

A barra lateral perdeu os atalhos principais duplicados, o contador de sugestões e a entrada separada de Histórico. O registro por horário passou para os detalhes. O guia inicial, a frase e sugestões continuam acessíveis quando a pessoa decide abri-los.

## Atrito observado

Contagem manual de ações em um perfil com duas disciplinas. Digitação foi medida separadamente. O registro da v8 pede que a pessoa informe os minutos ou escolha uma duração sugerida.

| Jornada | v7.3 | v8.0 |
|---|---|---|
| Registrar disciplina e duração a partir de Hoje | 5 cliques e digitação dos minutos | 4 cliques e digitação dos minutos |
| Iniciar o roteiro no tempo padrão, com proposta disponível | 2 cliques a partir de Revisões | 2 cliques a partir de Revisões |
| Marcar uma data de revisão para um tópico | O controle adiava a sugestão, preservando a data original | 3 ações em Agenda e assuntos |
| Abrir o panorama | 1 clique em Análises | 1 clique em Resultados |
| Abrir Planejamento ou Histórico pela navegação geral | 1 clique no desktop | 2 cliques pelos grupos Organizar e Resultados. Atalhos contextuais levam direto ao recorte. |
| Criar a imagem com aparência e dados padrão | Sem exportação PNG | 2 cliques a partir das Análises |

Com o mesmo conjunto sintético, Chromium em 1440 px mediu o conteúdo do registro em 515 → 506 px. Em 390 px, 814 → 708 px. Em 320 px, 866 → 800 px. Os minutos ficaram visíveis de início nos dois temas. Esses números são alturas CSS do conteúdo do formulário. Em telas menores, o conteúdo rola numa área própria com as ações sempre visíveis. [Antes](evidencias/antes/validacao.json) · [Depois](evidencias/depois/validacao.json)

## Desempenho no histórico sintético

Chromium 154.0.8037.57, execuções consecutivas com o mesmo roteiro. Tempos de tela são medianas de cinco chamadas de renderização síncrona com os caches derivados invalidados. Inicialização mede uma recarga até o aplicativo marcar os dados como prontos. Importação mede uma execução pela interface com confirmação e verificação dos totais.

| Estudos | Inicialização, ms | Importação, ms | Hoje, ms | Revisões, ms | Histórico, ms | Análises, ms |
|---:|---:|---:|---:|---:|---:|---:|
| 911 | 326 → 264 | 1.157 → 788 | 11 → 13 | 57 → 16 | 51 → 27 | 31 → 28 |
| 1.000 | 282 → 280 | 650 → 699 | 21 → 13 | 61 → 15 | 37 → 23 | 36 → 37 |
| 5.000 | 666 → 669 | 2.814 → 2.344 | 31 → 15 | 56 → 15 | 55 → 20 | 34 → 36 |
| 10.000 | 1.116 → 1.089 | 4.586 → 4.916 | 32 → 21 | 61 → 12 | 49 → 29 | 37 → 32 |

Revisões e Histórico renderizaram mais rápido nos quatro tamanhos. As consultas frias e a importação oscilaram. Com 10.000 estudos, a primeira busca no Histórico mediu 110 → 115 ms. O primeiro índice textual e as consultas analíticas ainda fazem trabalho síncrono. Os totais de tempo, descanso e questões coincidiram e as séries alcançaram todas as semanas esperadas. Os tempos não medem FPS ou desempenho de aparelhos físicos. [Medições da v7.3](evidencias/antes/carga.json) · [Medições da v8](evidencias/depois/carga.json)

Em uma medida complementar via CDP, após recarga e coleta de lixo, o heap JavaScript foi de 4,6 → 4,7 MiB com 911 estudos e ficou em 15,5 MiB com 10.000. Para 10.000 estudos, a mediana de navegação incluindo dois frames foi de 66 → 32 ms em Revisões, 82 → 48 ms no Histórico e 49 → 64 ms em Análises. A amostra de heap exclui GPU, cache do navegador e memória do sistema. [Amostra da v7.3](evidencias/antes/memoria.json) · [Amostra da v8](evidencias/depois/memoria.json)

## Dados, recuperação e segurança

- O IndexedDB mantém a versão física **1**. O formato lógico **12** acrescenta o campo opcional `reviewSchedule` ao tópico. Registros antigos sem esse campo continuam usando a agenda reconhecida anteriormente. O carregamento dispensa regravação ou migração dos estudos. O backup novo valida, verifica o checksum e restaura as escolhas na mesma transação dos outros dados.
- A data manual não substitui o histórico nem o cálculo de intervalo interno. Um lote valida tópicos e suas disciplinas antes de gravar. Arquivamento, exclusão concorrente ou falha de gravação impedem a aplicação parcial.
- A exportação visual usa Canvas de origem local, texto literal, Blob PNG e URL temporária. A CSP existente continua ativa. Os testes verificam ausência de tráfego externo nas jornadas e igualdade dos pixels entre a prévia e o PNG baixado. O compartilhamento nativo depende do suporte do dispositivo e da ação da pessoa. A auditoria do npm não relatou vulnerabilidades nas dependências de teste.
- A abertura da v8 lê os backups anteriores. Antes de voltar à v7.3, exporte e guarde um backup da v8 para recuperar as escolhas manuais mais tarde. A v7.3 recusa o formato 12 e exibe a agenda automática que conhece. Preserve o banco do navegador durante o rollback. Para recuperar as escolhas, reabra a v8 ou restaure o arquivo com a v8.

## Capturas e verificações

Capturas de Chromium com a mesma data civil e a mesma base sintética nos dois lados. Os arquivos PNG a seguir são as imagens efetivamente baixadas.

| Tela | Antes | Depois | Depois no celular |
|---|---|---|---|
| Hoje e navegação | [Escuro](evidencias/antes/hoje-dark-1440.png) · [claro](evidencias/antes/hoje-light-1440.png) | [Escuro](evidencias/depois/hoje-dark-1440.png) · [claro](evidencias/depois/hoje-light-1440.png) | [Escuro](evidencias/depois/hoje-dark-390.png) · [claro](evidencias/depois/hoje-light-390.png) |
| Registro | [Escuro](evidencias/antes/registro-dark-1440.png) · [claro](evidencias/antes/registro-light-1440.png) | [Escuro](evidencias/depois/registro-dark-1440.png) · [claro](evidencias/depois/registro-light-1440.png) | [Escuro](evidencias/depois/registro-dark-390.png) · [claro](evidencias/depois/registro-light-390.png) |
| Revisões | [Escuro](evidencias/antes/revisoes-dark-1440.png) · [claro](evidencias/antes/revisoes-light-1440.png) | [Escuro](evidencias/depois/revisoes-dark-1440.png) · [claro](evidencias/depois/revisoes-light-1440.png) | [Escuro](evidencias/depois/revisoes-dark-390.png) · [claro](evidencias/depois/revisoes-light-390.png) |
| Agendar | — | [Escuro](evidencias/depois/agenda-dark-1440.png) · [claro](evidencias/depois/agenda-light-1440.png) | [Escuro](evidencias/depois/agenda-dark-390.png) · [claro](evidencias/depois/agenda-light-390.png) |
| Foco | [Escuro](evidencias/antes/foco-dark-1440.png) · [claro](evidencias/antes/foco-light-1440.png) | [Escuro](evidencias/depois/foco-dark-1440.png) · [claro](evidencias/depois/foco-light-1440.png) | [Escuro](evidencias/depois/foco-dark-390.png) · [claro](evidencias/depois/foco-light-390.png) |
| Apresentação | — | [Escuro](evidencias/depois/apresentacao-dark-1440.png) · [claro](evidencias/depois/apresentacao-light-1440.png) | [Escuro](evidencias/depois/apresentacao-dark-390.png) · [claro](evidencias/depois/apresentacao-light-390.png) |
| Resultados | [Escuro](evidencias/antes/resultados-dark-1440.png) · [claro](evidencias/antes/resultados-light-1440.png) | [Escuro](evidencias/depois/resultados-dark-1440.png) · [claro](evidencias/depois/resultados-light-1440.png) | [Escuro](evidencias/depois/resultados-dark-390.png) · [claro](evidencias/depois/resultados-light-390.png) |
| Editor PNG | — | [Escuro](evidencias/depois/relatorio-dark-1440.png) · [claro](evidencias/depois/relatorio-light-1440.png) | [Escuro](evidencias/depois/relatorio-dark-390.png) · [claro](evidencias/depois/relatorio-light-390.png) |
| Arquivo exportado | — | [Paisagem escura](evidencias/depois/png-exportado-dark.png) · [retrato claro](evidencias/depois/png-exportado-light.png) | — |

As auditorias automatizadas cobrem toque emulado, foco de teclado, zoom CSS a 200%, reflow, temas, contraste, semântica e reduced motion. Elas não equivalem a uma avaliação integral de conformidade WCAG nem a testes com pessoas. [49 verificações da v8](evidencias/depois/validacao.json) · [Auditoria geral](evidencias/depois/auditoria-geral.json) · [Experiência](evidencias/depois/auditoria-experiencia.json) · [Campo](evidencias/depois/verificacao-de-campo.json)

## Revisão e publicação

1. Com Node 24 e Chromium, Firefox ou WebKit instalados pelo Playwright, execute `npm ci`, `npm run check`, `npm test` e `npm run audit:next-generation`. A matriz de CI executa a suíte por motor.
2. Confira a agenda usando um backup sintético e teste o caminho Revisões → agendar → editar registro → exportar e restaurar.
3. Abra Foco → Apresentação, confira o relógio em outra janela e finalize. Em Resultados, confira o recorte e baixe a imagem.
4. Após revisão e aprovação da matriz, valide Safari em iPhone e Chrome em Android antes da publicação definitiva. Revise leitor de tela e compartilhamento nativo em pelo menos uma plataforma compatível.
5. Para uma publicação futura aprovada, guarde um backup, publique os arquivos estáticos juntos e verifique inicialização e exportação. Em caso de regressão, restaure o commit anterior dos arquivos estáticos com o mesmo endereço, preservando o IndexedDB. Mantenha o backup da v8 e a versão capaz de lê-lo disponíveis.

A suíte original passou com 103 testes no Chromium local. A v8 passou com 113 no ciclo inicial e o teste contextual seguinte também passou. As auditorias locais adicionais fizeram 95 verificações gerais, 109 de experiência, 24 de campo e 49 de jornadas e layout no desenho da v8. [Suíte original](evidencias/antes/testes.txt) · [Suíte v8](evidencias/depois/testes.txt) · [Jornadas v8](evidencias/depois/jornadas-v8.txt)

A versão está pronta para revisão em PR. As medições são de navegador automatizado. Chrome e Edge oficiais, Safari, aparelhos físicos e leitores de tela permanecem fora da execução local.
