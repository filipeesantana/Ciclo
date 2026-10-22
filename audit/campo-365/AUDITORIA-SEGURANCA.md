# Segurança, privacidade e integridade

## TESTADO EM EXECUÇÃO

- JSON truncado enviado ao seletor de arquivo com base existente: recusa na interface, 911 estudos mantidos. Schema futuro e IDs ambíguos são recusados antes da escrita.
- Referências órfãs e datas inválidas: relatório de reparos/descartes; os dados existentes permanecem intactos durante a prévia. O importador não foi relaxado para aceitar o fixture.
- Transação de restauração que falha após limpar stores: rollback conserva os dados anteriores. Timer iniciado em outra aba durante a prévia impede descarte sem decisão sobre sua identidade.
- Falha simulada `QuotaExceededError` ao finalizar: nenhuma sessão nem sucesso falso; timer e comentário preservados; retentativa grava uma vez.
- Comentários com HTML, aspas, acentos, quebras e valor semelhante a fórmula são texto inerte na interface. Não é criado um `<img>` nem executado seu evento.
- CSV protege prefixos `=`, `+`, `-`, `@` e tab; conserva aspas/vírgulas/quebras. Exportação sem textos privados os exclui. Comentário de 500.000 caracteres é processado pelo validador sem descarte silencioso; sua renderização integral não foi uma jornada de interface.
- 95 configurações de interface e 91 artigos percorridos no Chromium: nenhuma requisição HTTP externa nem exceção não tratada observada. O monitor foi ligado após a carga inicial; os recursos iniciais são locais conforme inspeção abaixo.
- `npm audit` executado nas dependências instaladas em 22/10/2026: zero vulnerabilidades reportadas, incluindo desenvolvimento. [Resultado](evidencias/depois/dependencias.json).

## VALIDADO POR INSPEÇÃO

`index.html` carrega JS/CSS locais e favicon data URL. CSP mantém `script-src 'self'`, `connect-src 'none'`, `object-src 'none'`, `frame-src 'none'` e `form-action 'none'`. A construção de elementos usa DOM/textContent; não foi encontrado caminho de inserção de texto livre com innerHTML. Não há dependência de produção, fetch, XHR, beacon ou WebSocket no aplicativo.

Backup e CSV são downloads por Blob/URL local, com revogação posterior. Ciclo + IA gera arquivo e prompt localmente; compartilhar continua sendo ação explícita da pessoa. Não foram adicionados login, upload, telemetria ou infraestrutura externa. IndexedDB/localStorage não são criptografia nem proteção contra acesso à própria origem/perfil do navegador.

`cyrb53` detecta alterações acidentais e não autentica autoria. A inclusão em vários dias usa uma transação com validação de disciplina, revisão da semana, limite e IDs; conflito, disciplina removida e limite excedido não produzem inclusão parcial.

## NÃO TESTADO

Esgotamento físico de disco/quota, encerramento forçado do processo do navegador durante fsync, extensão maliciosa e alteração do relógio do sistema em dispositivo real. Não houve pentest de serviço externo, upload de dados do usuário, nem análise de um backup pessoal. A CSP por meta não oferece todos os controles de um cabeçalho HTTP; o comportamento do GitHub Pages não foi alterado.
