# Navegadores e dispositivos

| Ambiente | Situação desta rodada | Limite |
|---|---|---|
| Chromium 154.0.8037.57, Linux/Playwright 1.62.1 | TESTADO EM EXECUÇÃO local: suíte de 79 casos; revisão final de Planejamento em 15 casos, além das verificações de interface | Não equivale a uso em aparelho físico |
| Chromium / Chrome for Testing 151.0.7922.34, CI | **80/80**, 95 configurações gerais e 24 adicionais aprovados; [log](evidencias/ci/chromium-final.txt) | Automação headless em Linux |
| Firefox 153.0, CI/Playwright | **80/80**, 95 configurações gerais e 24 adicionais aprovados; [log](evidencias/ci/firefox-final.txt) | Instalação local bloqueada; execução real na CI |
| WebKit 26.5, CI/Playwright | **80/80**, 95 configurações gerais e 24 adicionais aprovados; [log](evidencias/ci/webkit-final.txt) | Não equivale a Safari de iOS/macOS |
| Chrome e Edge oficiais desktop | NÃO TESTADO | Validar antes da publicação |
| Chrome Android / Samsung Internet físicos | NÃO TESTADO | Viewport e toque automatizado não são aparelho real |
| Safari iOS / Chrome iOS físicos | NÃO TESTADO | WebKit Linux não comprova esses produtos |
| Leitor de tela e teclado virtual reais | NÃO TESTADO | Axe não substitui tecnologia assistiva real |

O bloqueio local foi HTTP 403 “Domain forbidden” ao baixar os motores Playwright. Não houve alteração da política de rede nem tentativa de contorná-la. A CI usa runners e instalação próprios, com a matriz já existente do projeto.

As contagens foram conferidas nos logs: 80 testes, 80 aprovados, zero falhas/cancelamentos/ignorados em cada motor. [Proveniência por commit, job e execução](evidencias/ci/results-final.json). Chromium foi conferido na execução [39859228316](https://github.com/filipeesantana/Ciclo/actions/runs/39859228316), Firefox/WebKit na [39860179167](https://github.com/filipeesantana/Ciclo/actions/runs/39860179167); app.js é idêntico nessas revisões (SHA-256 registrado no JSON). A revisão posterior muda somente espera do teste e pipefail, não o aplicativo. O aviso inicial do WebKit e a falha de sincronização do próprio teste são preservados e explicados em [reproduções](BUGS-REPRODUZIDOS.md). O resultado não se baseia apenas na cor do job.

Fullscreen: o cenário J testa entrada/saída quando a API está disponível. Quando o motor não oferece a API, o teste informa a limitação e exercita sair/voltar ao Foco por Esc; isso não é registrado como fullscreen aprovado naquele motor. Sons, permissões reais de notificação, clipboard do sistema, suspensão de aparelho e retomada do sistema operacional continuam sem validação física nesta rodada.
