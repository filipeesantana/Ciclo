# Compatibilidade: o que foi realmente exercitado

Data da auditoria: 18/10/2026. Execução local com Chromium Linux headless 154.0.8037.57, pelo Playwright. Os relatórios brutos registram a versão usada. Viewports de 1440×1000, 1440×1400 e 360×800 em testes e capturas; isso é emulação de tamanho, não dispositivo móvel real.

| Plataforma | Situação | Evidência / limite |
|---|---|---|
| Chromium Linux headless | TESTADO localmente e na CI | local 154.0.8037.57; Chrome Headless Shell for Testing 151.0.7922.34 na CI; 51 casos e 95 configurações |
| Layout móvel de 360 px | TESTADO POR EMULAÇÃO | registro real pela interface, prazo em dia oculto, capturas e checagem automática |
| Chrome desktop instalado para uso cotidiano | NÃO TESTADO com interface gráfica real | Headless Shell for Testing na CI não comprova integração com o sistema e perfil do usuário |
| Edge desktop | NÃO TESTADO | Chromium não valida particularidades do Edge |
| Firefox 153 pelo Playwright | TESTADO na CI Linux | 51 casos funcionais e 95 configurações de interface; distribuição do Playwright, não instalação pessoal |
| WebKit 26.5 pelo Playwright | TESTADO na CI Linux | 51 casos e 95 configurações aprovados; transbordamento inicial corrigido; não equivale a Safari real |
| Safari macOS | NÃO TESTADO | sem sistema/dispositivo disponível |
| Safari iOS, Chrome iOS | NÃO TESTADO em dispositivo real | validar safe areas, arquivos, clipboard, foco e retorno do app |
| Chrome Android | NÃO TESTADO em dispositivo real | validar teclado virtual, toque e downloads |
| NVDA, VoiceOver, TalkBack | NÃO TESTADO | axe e teclado automatizado não substituem leitor de tela |

A CI foi efetivamente executada nos três motores. A [execução inicial de 51 casos](https://github.com/filipeesantana/Ciclo/actions/runs/39149057449) aprovou os casos funcionais em cada motor; a checagem visual do WebKit falhou em dois estados do Planejamento a 360 px, sem violações axe ou erros JavaScript. A [evidência anterior](evidencias/ci/webkit-antes.txt) foi preservada. A correção muda a grade inicial de sete colunas para uma, antes de medir a largura. A [execução da correção](https://github.com/filipeesantana/Ciclo/actions/runs/39149396389), no código `77f8b1d`, aprovou **51 testes e 95 configurações em cada motor**, sem transbordamento, violações axe, erro JavaScript ou requisição externa no percurso. O [resumo da CI](evidencias/ci/results.json) e os logs de [Chromium](evidencias/ci/chromium-depois.txt), [Firefox](evidencias/ci/firefox-depois.txt) e [WebKit](evidencias/ci/webkit-depois.txt) preservam os resultados observados.

## Checklist antes de publicar

- Em cada navegador alvo, criar Português sem tópicos, registrar 30 minutos, recarregar e conferir histórico.
- Pausar e descansar, bloquear/suspender o aparelho, voltar e conferir estudo, descanso e pausa separados. Repetir com Pomodoro no limite do bloco.
- Verificar som, notificação negada/concedida, fullscreen e Esc com usuário real.
- Baixar JSON/CSV/TXT, localizar o arquivo, restaurar num perfil de teste e conferir os resultados. Negar clipboard e usar cópia manual.
- Em telefone, abrir e salvar o formulário com teclado visível; conferir ações fixas, safe areas, scroll e volta à tela anterior.
- Com leitor de tela, percorrer modal, seletor de tópicos, calendário, tabela comparativa e os novos lotes de resultados.
- Com zoom real de 200%, conferir reflow e os controles de registro. Viewport estreito sozinho não comprova esse teste.
- Atualizar com todas as abas recarregadas. O contrato novo de reserva de timer exige código atualizado nas abas participantes.
