# Reproduções e regressões

## Hoje depois da finalização — P1

**TESTADO EM EXECUÇÃO.** Base `e972eb1`, origem local e contexto vazio. Criar Português, iniciar pela janela, avançar o relógio controlado dois minutos, entrar em Foco, Encerrar e Registrar. O timer já não estava ativo, mas o título de Hoje continuava “Você está estudando agora”. O caminho sem Foco também falhava. Logs: [antes](evidencias/antes/bug-hoje.txt). Captura real: [Hoje com aviso obsoleto](evidencias/antes/hoje-apos-foco.png).

**Causa:** a transação confirmava a sessão, `registerStudy` redesenhava a página ainda com o timer em memória e somente depois o modal liberava o runId. Limpar a barra não redesenhava a ação de Hoje. O evento de storage não é emitido na própria aba que gravou.

**Solução:** após sucesso do comando transacional, liberar exclusivamente o runId daquele registro antes de atualizar os módulos. Falhas retornam antes dessa liberação. A ação principal de Hoje acompanha início, pausa, descanso, término de bloco e descarte; o restante do dashboard não é reconstruído a cada segundo. A reconciliação com o histórico também alcança snapshots atrasados de outra aba.

O caso de snapshot atrasado também foi executado na base: depois de uma gravação confirmada, regravar o snapshot antigo e chamar restore fazia `isActive` voltar a true. [Falha anterior](evidencias/antes/snapshot-atrasado.txt); a regressão nova exige false e preserva uma única sessão.

**Regressão:** `field-timer.test.cjs`, cenários A–J, transições de Hoje e snapshot atrasado. Verificações: cartão e barra imediatamente corretos; id da sessão igual ao runId; uma gravação com clique duplo; falha simulada de IndexedDB conserva timer/comentário e admite retentativa; nova sessão recebe identidade distinta. Pomodoro exercita pausa, retomada, descanso e novo bloco: **29 min líquidos + 5 min de descanso + 3 min de pausa**. F5, Histórico/Voltar e aba observadora também são exercitados.

**Risco residual:** sinais entre abas podem atrasar; abas executando código antigo não participam integralmente do contrato novo. Quota foi simulada, não esgotada fisicamente. Estado que o navegador não permite persistir continua sujeito às limitações de armazenamento já comunicadas pelo aplicativo.

## Histórico superior a dez anos — P2

**TESTADO EM EXECUÇÃO.** Dois registros, em 01/01/2015 e 22/10/2026, deveriam gerar 617 semanas. As séries retornavam 520 e omitiam a ponta recente: [falha anterior](evidencias/antes/limite-semanas.txt). O estresse derivado do ano fictício reproduziu o corte em 10.000 estudos, com 573 semanas no intervalo.

**Causa:** três loops tinham `guard++ < 520`, começando pela semana mais antiga. Os totais gerais continuavam corretos, escondendo a divergência com as séries.

**Solução:** percorrer o intervalo civil validado inteiro, avançando sete dias a cada passo. Não houve alteração de minutos ou dados persistidos.

**Teste e resultado:** `field-longevity.test.cjs` exige última semana, quantidade total, soma de questões, minutos e realizado do planejamento. [Depois](evidencias/depois/limite-semanas.txt): 617 semanas, 100 minutos e 50 questões. A carga final conserva as 573 semanas dos 10.000 estudos.

**Risco residual:** intervalos artificiais de séculos não receberam benchmark. As medições cobrem até aproximadamente onze anos e 10.000 estudos, sem promessa de limite universal.
