# Registro, navegação e leitura

O formulário mantém modo, data/tempo, disciplina, tópicos opcionais e confirmação. As duas primeiras perguntas continuam lado a lado no desktop. “Complementar registro” oferece comentário e resultado como botões. Tipo e dificuldade ficam numa seção expansível; no modo Estudar agora, somente o tipo é oferecido.

Comentário é um valor independente da expansão: `Recolher` não muda o texto enviado. A ação indica conteúdo existente. `Remover comentário` abre uma subtela de confirmação, preservando os nós, valores e foco do formulário. Expandir foca o textarea; recolher devolve foco ao botão. Registrar, finalizar e editar usam o mesmo componente.

Outra disciplina fica junto da seleção, com alvo de 40 px no desktop e 44 px no mobile. Antes da primeira escolha, uma explicação visível acompanha o botão desabilitado. O seletor canônico continua excluindo disciplinas já utilizadas, separando tópicos por disciplina, avisando quando trocas invalidam tópicos e preservando a duração única. Inclusão foca e abre o novo seletor.

Cancelar passa a guardar o rascunho; “Começar do zero” continua sendo a remoção explícita. Alternar modo mantém os campos e o rascunho. A confirmação de estudo permanece posterior ao commit, com formulário e cronômetro preservados em falhas.

## Medidas reproduzíveis

Mesmo formulário, Português pré-selecionado, sem tempo nem detalhes. Chromium 154.0.8037.57. [Antes](evidencias/antes/atrito.json) · [Depois](evidencias/depois/atrito.json). Medidas de geometria, sem inferir desempenho humano.

| Medida | v7.2 | v7.3 |
|---|---:|---:|
| Altura do modal em 1440×1000 | 821 px | 730 px |
| Rolagem excedente em 390×844 | 617 px | 305 px |
| Rolagem excedente em 320×844 | 877 px | 338 px |
| Altura de comentário / outra disciplina no mobile | 24 / 22 px | 44 / 44 px |
| Escolhas iniciais de tipo / dificuldade | 6 / 5 | 0 / 0, disponíveis ao expandir |

Ainda é necessário rolar no celular; a medição não afirma que todas as ações ficam acima da dobra. As opções de modo ficam lado a lado com rótulos curtos. O rodapé de confirmação permanece fixo no modal.

## Caminhos e apresentação

A barra lateral mantém as seis seções principais e separa utilidades por espaço e divisor. A seção atual usa superfície, borda, peso e marcador, além de `aria-current`. Itens têm pelo menos 44 px; alturas menores têm composição mais compacta e rolagem vertical. A navegação inferior mobile e o menu Mais são preservados.

O History API agora guarda busca, filtros e seleção de registros do Histórico em cada entrada, inclusive na recarga. A mudança foi testada indo de um Histórico filtrado a outro recorte e voltando. Uma regressão encontrada durante a implementação foi corrigida: o desenho do Histórico só substitui a entrada quando ela já pertence ao Histórico, preservando a página anterior.

Análises mantém o motor, gráficos e aprofundamento existentes. “Como ler estes números” explica tempo líquido, sessões, dias ativos, estimativas e acerto ponderado. As datas dos dois períodos comparados deixam de depender de tooltip; períodos parciais são identificados. Nenhum novo gráfico foi adicionado.

## Capturas reais

[Registro antes](evidencias/antes/registro.png) · [depois](evidencias/depois/registro.png) · [comentário](evidencias/depois/comentario.png) · [segunda disciplina](evidencias/depois/segunda-disciplina.png) · [registro mobile](evidencias/depois/registro-dark-mobile.png) · [comentário mobile claro](evidencias/depois/comentario-light-mobile.png).

[Sidebar antes](evidencias/antes/hoje-sem-estudo-sidebar.png) · [depois](evidencias/depois/hoje-sem-estudo-sidebar.png) · [Análises antes](evidencias/antes/analises.png) · [depois](evidencias/depois/analises.png).
