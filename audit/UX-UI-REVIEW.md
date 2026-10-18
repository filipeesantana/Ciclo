# Revisão de experiência, interface e conteúdo

O primeiro uso já tem dois caminhos opcionais e uma ação clara para estudar. Hoje já separa ação, semana e próximos passos. A navegação, a tipografia sans-serif, o tema escuro/claro e a organização progressiva foram preservados. Não há evidência para trocar toda a identidade visual.

## Mudanças verificáveis

| Antes | Depois | Benefício |
|---|---|---|
| Recuperação de registro omitindo descanso e partes | Recuperação completa, inclusive nome ainda não criado e último preenchimento antes do F5 | Menos retrabalho e tempo líquido coerente |
| Distribuição de acerto recolhida e sem ação | Distribuição visível junto da evolução; clique aprofunda no mesmo período | Menos passos para uma pergunta natural |
| Cortes em 12/30/40 itens | Contagem e carregamento em lotes | Histórico acessível sem desenhar tudo inicialmente |
| Séries diárias com barras de 14 px | Barras de pelo menos 24 px; abertura no trecho recente quando há rolagem | Melhor toque e teclado |
| Rádio de prazo com estados ARIA incompatíveis | aria-checked, Tab roving e setas para percorrer | Semântica coerente |
| Comparação horizontal inacessível por Tab | Região nomeada e focável | Tabela rolável por teclado |
| li do planejamento assumindo papel de imagem | Item de lista nativo | Estrutura legível por tecnologia assistiva |
| Texto futuro desbotado e aviso claro abaixo de 4,5:1 | Número sem opacidade global; acento claro discretamente mais escuro | Contraste automatizado aprovado nos cenários verificados |
| “Consolidação é quanto realmente ficou” | Indicador de autoavaliação com critério explícito | Interpretação honesta |
| Equivalências universais entre minutos de técnicas | Orientações com contexto, exemplos e limites | Melhor conteúdo educativo |

## Conteúdo

Foram percorridos os textos dos artigos e FAQs em content.js; todos os 91 artigos também foram abertos automaticamente no navegador. Links relacionados, ações declaradas e referências do glossário tiveram conferência estática. O catálogo completo está em [CONTEUDO](CONTEUDO.md).

Foram corrigidas instruções que citavam controles antigos, o exemplo ambíguo de cinco horas semanais, o flashcard genérico de redes, a exclusão antiga de descansos do rascunho, a confusão entre revisão e resposta de revisão e explicações que inferiam aprendizagem ou causas sem evidência. Referências existentes foram preservadas; não foi feita uma revisão sistemática da literatura nem pesquisa com estudantes reais.

## Capturas reais

Todas usam bases sintéticas. A origem exata e os comandos estão em [BASELINE](evidencias/BASELINE.md).

- [Primeiro uso original](evidencias/antes/primeiro-uso.png) e [Hoje iniciante original](evidencias/antes/hoje-iniciante.png): preservar o caminho breve foi uma decisão consciente.
- [Resultados anteriores](evidencias/antes/carga/resultados.png) e [resultados alterados](evidencias/depois/carga/resultados.png): distribuição visível e acesso ao restante.
- [Resultados no móvel antes](evidencias/antes/carga/resultados-mobile.png) e [depois](evidencias/depois/carga/resultados-mobile.png).
- [Planejamento móvel](evidencias/depois/carga/planejamento-mobile.png), com base grande e prazos reais do fixture.

As capturas não comprovam toque físico, teclado virtual, leitor de tela, suspensão do aparelho ou funcionamento em Safari/Edge reais. Esses itens estão separados em [COMPATIBILIDADE](COMPATIBILIDADE.md).
