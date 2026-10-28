# Diagnóstico — Ciclo v7.3.0

Inspeção em 28/10/2026. Base: `origin/main` em `e7215d8271945c678a215ea78630a9a5622cae3c` (v7.2.0), árvore inicialmente limpa. Nenhum AGENTS.md encontrado em `/workspace`. Lidos README, código, testes, CI e auditorias anteriores. Branch independente: `codex/ciclo-v7.3-experience-reviews`.

O PR #3 estava aberto, sem merge, em `3751e05ba6e2839cce4f7659e97325618cc29bb7`. O seu `reviews.js` foi inspecionado fora da árvore de trabalho. Não houve merge nem cherry-pick. As ideias recuperadas e o novo contrato estão em [REVISOES.md](REVISOES.md).

## Evidência inicial

- [Suíte original](evidencias/antes/testes.txt): 79/80 no Chromium. O teste de ida e volta do fixture anual instala 22/10 no primeiro contexto, mas usa a data real no segundo. A abertura da semana de 26/10 acrescenta um snapshot legítimo e quebra a comparação das coleções. Corrigido instalando a mesma data no segundo contexto; nenhuma regra do Planejamento foi alterada.
- [Auditoria geral](evidencias/antes/browser.txt): 95 verificações de interface/acessibilidade, 91 artigos abertos, sem erros, rede externa ou overflow observados.
- [Auditoria de campo](evidencias/antes/campo.txt): 24 configurações adicionais aprovadas.
- [Matriz visual ampliada](evidencias/antes/results.json): 60 combinações, com um contraste insuficiente no subtítulo de atalho de Hoje em 1280 px/escuro. Corrigido com o token de texto secundário.
- `npm run check` e inventário passaram antes da implementação.

## Jornadas e atritos

| Jornada | Constatação confirmada no código e/ou interface | Decisão |
|---|---|---|
| Primeiro uso → disciplina → estudo | Tópico e plano já eram opcionais; criação rápida existente | Preservar, com regressões da suíte original |
| Registro rápido | Seis tipos e cinco dificuldades à vista antes do comentário | Tipo e dificuldade sob demanda; comentário e resultado como botões |
| Comentário | `value` devolvia vazio se recolhido; “Remover” apenas fechava o campo | Recolher preserva; remover confirma em subtela |
| Outra disciplina | Link pequeno; ação desaparecia antes da primeira seleção | Botão próximo do seletor, explicação visível antes de habilitar |
| Cronômetro/Foco → finalizar | Persistência e liberação transacional já corrigidas na v7.2 | Preservar; testar sucesso, erro, F5 e abas |
| Hoje depois do estudo | Existia resumo semanal, sem síntese própria da data | Resumo diário dos registros persistidos |
| Hoje → Análises/Histórico | Não havia caminho direto para os registros do dia | Dois destinos explícitos com período pronto |
| Revisão livre | Entrada principal escolhia só uma disciplina numa janela intermediária | Reutilizar formulário multidisciplinar canônico |
| Revisar com tempo disponível | Fila antiga abria um cronômetro por tópico | Um roteiro e uma sessão agregada |
| Histórico → outra tela → retorno | Filtros viviam apenas no estado global da tela | Capturar filtros, busca e recorte em cada entrada de navegação |
| Análises → aprofundar → voltar | Consulta e período já estavam no History API | Preservar e testar; explicar métricas e mostrar datas da comparação |
| Planejamento, Dados, Ajuda | Fluxos estabelecidos e cobertura existente | Conferir regressões; incluir roteiro no backup e atualizar textos |

A contagem de cliques não caiu artificialmente: expandir comentário continua exigindo um clique; adicionar outra disciplina e escolhê-la continua exigindo dois. A mudança melhora visibilidade, reduz decisões expostas e corrige perda de conteúdo. O caminho Hoje → detalhes do dia passa a exigir um único atalho com período pronto. Não medimos tempo de descoberta nem realizamos pesquisa com pessoas.
