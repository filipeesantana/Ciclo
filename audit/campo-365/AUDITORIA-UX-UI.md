# Interface e uso

## Foco

O relógio passa a ocupar o primeiro plano, com dígitos tabulares e rótulo visível: tempo estudado, descanso ou restante do bloco. Estado tem texto; disciplina, área quando útil, tópicos e tipos ficam em segundo plano. Tópicos e tipos extensos são sintetizados, com descrição completa acessível. Campos vazios ficam ocultos.

No Pomodoro e durante descanso/pausa, o apoio separa estudo líquido de descanso acumulado. Os insights descrevem somente o estado real e marcos de cinco minutos; não atribuem aprendizagem ou concentração. Pausar é a ação principal durante estudo, Retomar durante pausa/descanso; Encerrar fica disponível em posição secundária. Não foi adicionada animação periódica nem anúncio de cada segundo ao leitor de tela.

O contêiner admite rolagem em paisagem/zoom para manter os controles alcançáveis. Esc e saída de fullscreen conservam o estudo; finalizar continua abrindo o formulário antes de persistir.

| Antes | Depois |
|---|---|
| [Foco desktop](evidencias/antes/foco-1440.png) | [Foco desktop](evidencias/depois/foco-1440.png) |
| [Foco móvel](evidencias/antes/foco-390.png) | [Foco móvel](evidencias/depois/foco-390.png) |
| [Descanso](evidencias/antes/foco-descanso.png) | [Descanso com tempos separados](evidencias/depois/foco-descanso.png) |

## Planejamento

Semana e meta global continuam no topo, seguidas do progresso real e dos dias. O calendário tem ação explícita **Adicionar aos dias**: escolher disciplina e vários dias no mesmo formulário. Nome, prioridade, tópicos e sugestão ajudam a escolher; seleção usa controles nativos e busca sem acentos. Horário e duração ficam sob demanda, podendo permanecer vazios.

As sugestões ficam numa seção expansível, conservando arraste, ajustes e ações anteriores. Modelo, repetição, restauração e limpeza ficam no menu Organização da semana. Dias têm largura mínima de 180 px antes de quebrar linhas; no celular viram uma lista. Mover/editar/remover continuam disponíveis por botões, sem exigir arraste.

| Antes | Depois |
|---|---|
| [Semana com 53 registros históricos](evidencias/antes/planejamento.png) | [Nova hierarquia](evidencias/depois/planejamento.png) |
| [Planejamento móvel](evidencias/antes/planejamento-mobile.png) | [Planejamento móvel](evidencias/depois/planejamento-mobile.png) |
| Menus por dia ou arraste | [Escolher disciplina e dias](evidencias/depois/adicionar-aos-dias-390.png) |

## Verificação e limites

**TESTADO EM EXECUÇÃO:** Foco nos dois temas, em 1920×1080, 1440×900, 1366×768, 768×1024, 430×932, 390×844, 375×667, 320×568, 844×390 e 667×375. Axe, overflow horizontal, ações, teclado/Esc, automação de toque e zoom CSS de 200%. O seletor novo recebe axe nos dois temas em desktop/móvel. A bateria geral cobre as telas existentes e 13 focos de Análises.

**VALIDADO POR INSPEÇÃO:** manutenção de identidade, linguagem, estado por texto, rótulos e ausência de anúncios do relógio a cada segundo. Reduced motion é exercitado pelos contextos de teste e pelos estilos existentes.

**NÃO TESTADO:** leitor de tela real, zoom da interface do navegador real, teclado virtual, julgamento humano de conforto em aparelho físico e pesquisa com iniciantes. Zoom CSS não é apresentado como zoom real de Chrome/Safari. Capturas são do navegador executando o código e usam somente dados fictícios.
