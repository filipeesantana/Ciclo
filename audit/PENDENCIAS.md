# Pendências e limites

## Antes da publicação

1. Validar Chrome e Edge oficiais e Safari em dispositivo real conforme [COMPATIBILIDADE](COMPATIBILIDADE.md).
2. Fazer validação com leitor de tela, zoom real de 200%, teclado virtual e aparelho suspenso. As ferramentas desta máquina não comprovam esses cenários.
3. Validar exportação/importação com cópias consentidas de backups reais de longa duração. Aqui foram usados somente fixtures sintéticos V2/6/7/9/10.
4. Recarregar todas as abas ao atualizar. Abas antigas não conhecem a reserva transacional de timer.
5. Decidir a versão e publicar separadamente. Sugestão: 7.1.1, schema 10. Não há autorização para merge ou deploy automático.

## Cobertura parcial que não deve ser chamada de concluída

- Caminho guiado completo do onboarding, todas as cascatas de arquivamento/exclusão e todas as combinações de filtros têm inspeção e cobertura parcial, não um teste de interação para cada permutação.
- Fullscreen, permissões de notificação/som/clipboard, quota física esgotada e encerramento abrupto do navegador precisam de validação adicional. Há falhas de gravação e rollback simulados, não um aparelho real sem espaço.
- Minutos inteiros mantêm o arredondamento histórico; não houve migração para precisão de segundos.
- Preferências simultâneas continuam usando o último snapshot gravado. O controle por campo de entidades e o contrato de timer são mais fortes do que esse comportamento de preferências.
- CSS e JavaScript continuam extensos. Extração futura de módulos deve seguir contratos testados e medições, sem reescrita global.
- Guardas de loops muito longos em algumas séries históricas ainda limitam intervalos extremos. Foram medidos até 1.000 dias/5.000 estudos, não décadas de uso.
- Nenhum teste substitui pesquisa de usabilidade com iniciantes de diferentes áreas. Foram executadas jornadas sintéticas de Português, Guitarra, Artes Cênicas, planejamento, revisão e resultados.

Os bloqueadores reproduzidos de dados e timer foram corrigidos e receberam regressões. A existência destas pendências impede declarar cobertura universal ou compatibilidade total.
