# Dados e segurança

APP_VERSION 7.3.0; formato lógico 11; IndexedDB 1. Nenhuma store nova. Estudos, tópicos, duração, descansos, resultados, planos e demais contratos da main permanecem. A mudança lógica é `guidedReview`, um objeto opcional no backup e uma chave na store `meta` existente. Não há migração em massa nem recálculo de datas antigas.

O validador do roteiro limita itens, IDs, durações, orçamento, cursor, tempo, status, métodos e resultados. Um roteiro inválido recusa a restauração integral. Referências a assuntos removidos são preservadas como ausentes para permitir pular; não são religadas por nome. O backup inclui os dados confirmados, nunca o texto ainda não aceito de um editor de proposta.

A canonicalização de backups antigos é exatamente a anterior quando `guidedReview` não existe. Novos backups incluem essa parte no checksum. O backup exportado pausa seu retrato de tempo, sem pausar a atividade em uso. A restauração guarda esse retrato pausado na mesma transação das demais coleções. Um roteiro contando impede a substituição dos dados, inclusive se tiver começado em outra aba durante a prévia.

Testes conferem ida/volta do roteiro e seus resultados, checksum, rejeição de conteúdo inválido, ausência de stores de cartões, concorrência e sessão única. A suíte original cobre restauração atômica após falha de escrita, esquemas anteriores, campos adversariais, referências, datas civis, backup anual e CSV. O fixture original não foi modificado.

A interface nova usa `h(...,{text:...})`, labels e opções nativas; não usa HTML livre, `innerHTML`, `eval`, URLs fornecidas pelo usuário ou acesso à rede. Comentários continuam limitados a 2000 caracteres. CSP e dependências de produção foram preservadas. A auditoria geral percorreu telas, modais e 91 artigos sem observar requisições externas.

Limites: checksum detecta alteração acidental, não autentica arquivos. Quota física esgotada e encerramento do processo do navegador não foram ensaiados em aparelho real; há injeção controlada de falhas de escrita e testes de F5. O controle otimista entre abas recusa a alteração e orienta reabrir; não mescla respostas concorrentes automaticamente. Versões até 7.2 recusam backups do formato 11.
