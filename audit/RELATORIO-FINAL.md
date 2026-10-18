# Ciclo — auditoria e candidato para revisão

Foi entregue uma evolução localizada sobre a v7.1.0, com correções de integridade, cronômetro, importação, estatísticas e acessibilidade, além de exploração mais útil dos resultados. A versão e os schemas continuam 7.1.0 / 10 / 1. Não houve merge, tag ou publicação do GitHub Pages.

## Resultado de produto

O caminho mínimo continua curto: criar uma disciplina, estudar ou registrar minutos. Português no móvel, Guitarra com marco opcional e disciplina ainda não criada tiveram jornadas automatizadas. Tópicos, metas, tipos e resultados continuam opcionais. O usuário avançado mantém sessões múltiplas, revisões, planejamento, CSV e análise por recorte.

O ganho principal para iniciantes é não perder nem reinterpretar o que preencheram. Para uso prolongado, resultados antes cortados passam a ser acessíveis por lotes; a distribuição de acerto aparece diretamente e permite aprofundar mantendo o período. Em desktop, distribuição e semanas aproveitam duas colunas; no móvel, seguem em uma coluna.

## Dados e confiança

- Backups V2 deixam de perder estudos por diferença entre ID numérico e textual; duplicatas ambíguas são recusadas.
- Restauração não descarta um cronômetro iniciado depois da prévia. Início, descarte autorizado e finalização usam uma identidade conferida na fila transacional.
- Reserva de cronômetro sem relógio recuperável tem saída explícita, com nova conferência de identidade antes do descarte.
- Recuperar um estudo de uma hora com 15 minutos de descanso mantém 45 minutos líquidos.
- Pomodoro aplica o limite do bloco antes de uma ação percebida depois da suspensão.
- Semana parcial não inclui registros futuros que podiam elevar dias ativos a 133%.
- Revisão sem autoavaliação deixa de produzir a descoberta contraditória de revisão ausente.
- Resultado, duração e vínculos conservam os contratos matemáticos já bons no aplicativo.

Os detalhes, reproduções e riscos residuais estão em [DIAGNOSTICO](DIAGNOSTICO.md) e [INTEGRIDADE-DADOS](INTEGRIDADE-DADOS.md).

## Design, interpretação e conteúdo

Foram mantidos a identidade visual, a sans-serif do sistema, os dois temas, a divulgação progressiva e as animações existentes. As mudanças visuais têm propósito: alvos de toque maiores, contraste, tabela alcançável por teclado, lista semântica e melhor uso horizontal na análise de resultados. Não foi adicionada uma camada decorativa nem novas preferências.

O estado calculado agora explicita autoavaliação. A Ajuda deixa de dizer que percentuais revelam “quanto realmente ficou” ou provam que faltou revisar. Exemplos e nomes de controles foram alinhados à interface. Afirmações educativas universais e equivalências arbitrárias entre minutos foram substituídas por orientação contextual.

Todos os 91 artigos foram abertos no navegador; destinos e glossário foram conferidos. Não houve estudo com usuários reais nem revisão científica sistemática. A [revisão de UX](UX-UI-REVIEW.md) reúne capturas reais com dados sintéticos.

## Qualidade e desempenho

A suíte contém 51 casos de integridade, jornadas, datas e concorrência; a checagem ampliada cobre 95 configurações de acessibilidade automática. Os logs e resultados estão em [TESTES-EXECUTADOS](TESTES-EXECUTADOS.md). Os três motores — Chromium, Firefox e WebKit — aprovaram os 51 casos e as 95 configurações na CI. O transbordamento inicial do quadro semanal detectado no WebKit foi corrigido e revalidado. A documentação separa esse resultado da validação de Safari, Edge ou telefone real.

Foram medidas seis bases, do vazio a 5.000 estudos em 1.000 dias, incluindo 400 tópicos, 100 prazos e 144 semanas. Tempos reais de renderização, reload, CSV, validação e restauração estão em [PERFORMANCE](PERFORMANCE.md). A variação entre execuções não foi apresentada como ganho comprovado. Não houve reescrita de arquitetura ou cache complexo sem gargalo demonstrado.

## Entrega

Proposta de revisão: [PR #1 em rascunho](https://github.com/filipeesantana/Ciclo/pull/1), na branch `audit/product-engineering-2026-10`.

Produção: app.js, content.js e styles.css. Documentação: README e audit/. Desenvolvimento: package.json/lock, tests/, .gitignore e workflow de qualidade. index.html, identificadores legados, stores, schema físico e dependências de produção foram preservados.

O mapa está na [matriz funcional](MATRIZ-FUNCIONALIDADES.md), com [561 construções de controles e 59 camadas](INVENTARIO-CONTROLES.md), mais 25 controles fixos do HTML. O catálogo de conteúdo está em [CONTEUDO](CONTEUDO.md). Esse inventário não significa que cada combinação de estados recebeu teste manual.

Próxima versão sugerida: **7.1.1**, depois da revisão. Antes de publicar: conferir a CI do PR, executar a validação real indicada em [COMPATIBILIDADE](COMPATIBILIDADE.md), conferir backups reais consentidos e recarregar todas as abas. As frentes parcialmente validadas permanecem expressamente em [PENDENCIAS](PENDENCIAS.md).
