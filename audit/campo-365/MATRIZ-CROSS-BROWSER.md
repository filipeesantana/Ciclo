# Navegadores e dispositivos

| Ambiente | Situação desta rodada | Limite |
|---|---|---|
| Chromium 154.0.8037.57, Linux/Playwright 1.62.1 | TESTADO EM EXECUÇÃO local; logs funcionais, visuais e axe em evidencias/depois | Não equivale a Chrome ou Edge oficiais |
| Chromium da CI | A conferir no PR e nos artefatos da execução | Registrar resultado final após término |
| Firefox Playwright | Instalação local bloqueada pela política de rede; execução solicitada na CI do PR | Não declarado aprovado por testes antigos |
| WebKit Playwright | Instalação local bloqueada pela política de rede; execução solicitada na CI do PR | Não equivale a Safari de iOS/macOS |
| Chrome e Edge oficiais desktop | NÃO TESTADO | Validar antes da publicação |
| Chrome Android / Samsung Internet físicos | NÃO TESTADO | Viewport e toque automatizado não são aparelho real |
| Safari iOS / Chrome iOS físicos | NÃO TESTADO | WebKit Linux não comprova esses produtos |
| Leitor de tela e teclado virtual reais | NÃO TESTADO | Axe não substitui tecnologia assistiva real |

O bloqueio local foi HTTP 403 “Domain forbidden” ao baixar os motores Playwright. Não houve alteração da política de rede nem tentativa de contorná-la. A CI usa runners e instalação próprios, com a matriz já existente do projeto.

Fullscreen: o cenário J testa entrada/saída quando a API está disponível. Quando o motor não oferece a API, o teste informa a limitação e exercita sair/voltar ao Foco por Esc; isso não é registrado como fullscreen aprovado naquele motor. Sons, permissões reais de notificação, clipboard do sistema, suspensão de aparelho e retomada do sistema operacional continuam sem validação física nesta rodada.
