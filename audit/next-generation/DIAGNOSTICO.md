# Diagnóstico do Ciclo 8.0

A `main` remota aponta para `6a1de8e71092efb722206214109b5c800b3d6057` (v7.3.0). A branch parte desse commit. O formato lógico encontrado é 11 e o IndexedDB usa a versão física 1. O inventário completo de domínios anterior e o mapa de controles servem como ponto de partida. [Domínios](../MATRIZ-FUNCIONALIDADES.md) · [Controles](../INVENTARIO-CONTROLES.md)

| Funcionalidade e local na v7.3 | Classificação | Caminho típico | Relação, impacto e decisão |
|---|---|---|---|
| Hoje, resumo diário | Essencial | Abrir Hoje e consultar | Lê sessões. Preservar e manter a consulta dos registros do dia em uma ação. |
| Hoje, atalhos de destinos | Redundante | Hoje → atalho | Repete navegação. Recolher os links preservando a preferência e os destinos. |
| Hoje, sugestão, metas, prazos e frase | Útil | Hoje → cartão ou ação | Lê assuntos, planos e prazos. Preservar os blocos configuráveis e reduzir competição com as ações de estudo. |
| Iniciar e registrar, Hoje e botão global | Essencial | Abrir registro → escolher disciplina → trocar horários por minutos → preencher → salvar | Sessões, rascunhos, resultados e cronômetro persistidos. Oferecer duração diretamente e recolher detalhes. |
| Comentários, múltiplas disciplinas, tópicos, tipos, dificuldade, descansos e resultados | Útil | Registrar → abrir controles opcionais → preencher → salvar | Dados históricos permanecem editáveis e pesquisáveis. Manter o formulário canônico e suas regras de distribuição. |
| Cronômetro, barra, livre e Pomodoro | Essencial | Estudar → iniciar → controlar → finalizar | Preservar a reserva entre abas, o estudo líquido, as pausas e os descansos. |
| Modo Foco, tela cheia | Útil | Barra → Foco → Tela cheia | Mesma sessão. Transformar tela cheia em opção da apresentação, com fallback expandido. |
| Revisão geral e por assunto | Essencial | Revisões → revisão livre, ou tópico → revisar | Preservar uma sessão por registro e só relacionar resultados aos assuntos escolhidos. |
| Revisões automáticas, fila, adiamento | Excessivamente complexa | Revisões → grupo → menu → adiar | O adiamento só oculta a sugestão. Preservar agenda e histórico e criar um controle explícito de data, sem data e desativação. |
| Roteiro guiado e métodos | Útil | Revisões → montar → ajustar → começar | Roteiro transacional recuperável. Preservar flashcards pessoais como método, resultados por assunto e um registro agregado. |
| Disciplinas, áreas, tópicos, prioridades, arquivamento | Essencial | Disciplinas → área ou disciplina → tópico, conforme a organização | Dados persistidos vinculados a estudos e prazos. Manter rotas internas e agrupá-las com Planejamento. |
| Planejamento, metas, dias, blocos e prazos | Útil | Planejamento → semana/meta/edição, ou Disciplinas → Prazos | Mantém snapshots e relacionamentos com disciplinas. Preservar sob Organizar. |
| Panorama e perguntas avançadas | Essencial / útil | Análises → período → panorama ou detalhamento | A mesma consulta calcula sessões, tempo, descanso, resultados, tópicos, revisões e planejamento. Preservar e aproximar do Histórico. |
| Histórico, busca, filtros, detalhes, edição e exclusão | Essencial | Histórico → busca/filtro → abrir registro | Recuperação de dados e correção transacional. Preservar com acesso direto em Resultados. |
| Resumo, TXT, CSV, relatório para IA | Útil | Análises → Mais, ou Dados → exportar | Preservar exportações existentes. Adicionar PNG com composição local e seleção explícita de conteúdo. |
| Busca global, Ajuda, glossário, atalhos e onboarding | Útil | Busca/ajuda → ação, artigo ou termo | Preservar descoberta e profundo acesso. Primeiro uso deve poder começar pela ação em Hoje. |
| Dados, backup, recuperação e diagnóstico | Essencial | Dados → exportar/importar → conferir → confirmar | Preservar checagem e restauração atômica. |
| Configurações, tema, densidade, acessibilidade e preferências | Útil | Configurações → grupo → controle | Preservar preferências/importação, com acesso secundário. |

## Arquitetura e componentes

Hoje concentra a ação atual e o resumo. Estudar abre o formulário canônico ou a sessão ativa. Revisões oferece início imediato, seleção e agenda. Organizar dá acesso a Disciplinas e Planejamento na própria tela. Resultados reúne Análises e Histórico e abre o editor de imagem com o recorte corrente. Ajuda, Dados e Configurações ficam no rodapé do desktop e no cabeçalho do celular. As rotas internas continuam acessíveis pelo histórico do navegador.

A fundação visual usa as cores de estado existentes e controles nativos, com superfícies mais espaçadas, navegação de toque, tipografia responsiva e transições de ação curta. Os painéis e modais continuam usando o mesmo controle de foco, Escape, rolagem e reduced motion. O cronômetro e as consultas analíticas continuam como fontes de verdade.
