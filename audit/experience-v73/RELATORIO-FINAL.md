# Ciclo v7.3.0 — Experience & Reviews

Esta versão substitui a proposta anterior de Reviews & Flashcards por uma evolução mais enxuta do Ciclo. **Flashcards nativos não foram incorporados. Flashcards como método pessoal continuam disponíveis. Revisão guiada e melhorias selecionadas do PR #3 foram adaptadas.**

## O que ficou mais simples

- **Registro:** comentário, outra disciplina e resultado são ações visíveis. Tipo e dificuldade ficam sob demanda. Recolher mantém o comentário; remover é uma escolha explícita. Cancelar conserva o rascunho.
- **Hoje:** síntese de sessões persistidas do dia, com tempo líquido único e disciplinas. Ações levam às Análises e ao Histórico já no dia correto. Sessão ativa permanece separada do que foi registrado.
- **Revisões:** revisão livre multidisciplinar pelo formulário existente; roteiro por tempo disponível com assuntos, ordem, métodos e duração editáveis, pausa, pulo e retomada. Cada tópico realizado conserva sua resposta; a finalização grava uma única sessão.
- **Navegação:** retorno e F5 recuperam filtros e busca do Histórico. Sidebar tem hierarquia e seleção mais legíveis, preservando a navegação mobile.
- **Análises:** explicação opcional das métricas e datas visíveis das comparações, sem acrescentar gráficos nem conclusões sobre domínio.

O modal inicial medido em desktop passou de 821 para 730 px. Em 390×844, a rolagem excedente passou de 617 para 305 px, com alvos de 44 px para comentário e outra disciplina. A contagem de cliques dessas duas ações foi mantida; não afirmamos melhora de tempo de descoberta por pessoas.

## Dados e validação

O banco físico continua na versão 1. O formato lógico passa para 11 para incluir um roteiro opcional na store `meta` e no backup. Não foram criadas stores, dependências de produção nem conversões de estudos. A canonicalização de backups anteriores é preservada. Restauração é atômica e recupera o roteiro pausado; falhas não confirmam sucesso.

**102/102 testes funcionais passaram no Chromium**, incluindo 22 novos. Auditoria geral: 95 configurações e 91 artigos. Auditoria de campo: 24 configurações. Experiência: 109 configurações, incluindo dois temas, larguras de 320–1920 px, modais, roteiro e zoom CSS de 200%. Resultados completos, repetições após refinamentos e limitações estão em [TESTES.md](TESTES.md).

O fixture anual manteve 911 estudos, 77.379 minutos líquidos, 6.754 minutos de descanso e 461 resultados, com ida/volta do backup. A carga percorreu de 100 a 10.000 estudos e manteve as séries históricas completas. As medições são específicas desta máquina e não equivalem a benchmarks de dispositivos reais.

Firefox/WebKit não foram executados localmente: os downloads foram bloqueados pela rede. A CI do PR executa os três motores; os resultados remotos e sua proveniência estão nos checks e na descrição do [PR #4](https://github.com/filipeesantana/Ciclo/pull/4). Não houve teste em Safari/Chrome/Edge oficiais, aparelhos físicos ou leitores de tela reais.

## Evidências e decisões

- [Inspeção da main, baseline e jornadas](DIAGNOSTICO.md).
- [Registro, navegação, design e medidas](REGISTRO-UX.md).
- [Hoje e semântica civil](HOJE-CONTEXTUAL.md).
- [Reaproveitamento seletivo, roteiro e resultados](REVISOES.md).
- [Persistência, backup, segurança e riscos residuais](DADOS-SEGURANCA.md).
- [Testes, navegadores e performance](TESTES.md).

As capturas são do aplicativo executado em navegador, não mockups. Usamos exclusivamente dados sintéticos e contextos descartáveis. Não houve modificação de dados pessoais, merge na main, tag, alteração do PR #3 nem publicação no GitHub Pages. A entrega é um novo PR independente para revisão.
