# Compatibilidade: o que foi realmente exercitado

Data da auditoria: 18/10/2026. Execução local com Chromium Linux headless 154.0.8037.57, pelo Playwright. Os relatórios brutos registram a versão usada. Viewports de 1440×1000, 1440×1400 e 360×800 em testes e capturas; isso é emulação de tamanho, não dispositivo móvel real.

| Plataforma | Situação | Evidência / limite |
|---|---|---|
| Chromium Linux headless | TESTADO em motor desktop | jornadas, IndexedDB, F5, duas abas, importação, CSV, teclado, arraste e acessibilidade automática |
| Layout móvel de 360 px | TESTADO POR EMULAÇÃO | registro real pela interface, prazo em dia oculto, capturas e checagem automática |
| Chrome desktop oficial | NÃO TESTADO como distribuição | compartilhar motor não equivale a testar essa distribuição |
| Edge desktop | NÃO TESTADO | Chromium não valida particularidades do Edge |
| Firefox | NÃO TESTADO nesta máquina | executável do Playwright ausente; job de CI preparado |
| WebKit pelo Playwright | NÃO TESTADO nesta máquina | executável ausente; job de CI preparado; não representa Safari real |
| Safari macOS | NÃO TESTADO | sem sistema/dispositivo disponível |
| Safari iOS, Chrome iOS | NÃO TESTADO em dispositivo real | validar safe areas, arquivos, clipboard, foco e retorno do app |
| Chrome Android | NÃO TESTADO em dispositivo real | validar teclado virtual, toque e downloads |
| NVDA, VoiceOver, TalkBack | NÃO TESTADO | axe e teclado automatizado não substituem leitor de tela |

O workflow quality.yml foi preparado para Chromium, Firefox e WebKit. Um job ainda não executado não é resultado aprovado.

## Checklist antes de publicar

- Em cada navegador alvo, criar Português sem tópicos, registrar 30 minutos, recarregar e conferir histórico.
- Pausar e descansar, bloquear/suspender o aparelho, voltar e conferir estudo, descanso e pausa separados. Repetir com Pomodoro no limite do bloco.
- Verificar som, notificação negada/concedida, fullscreen e Esc com usuário real.
- Baixar JSON/CSV/TXT, localizar o arquivo, restaurar num perfil de teste e conferir os resultados. Negar clipboard e usar cópia manual.
- Em telefone, abrir e salvar o formulário com teclado visível; conferir ações fixas, safe areas, scroll e volta à tela anterior.
- Com leitor de tela, percorrer modal, seletor de tópicos, calendário, tabela comparativa e os novos lotes de resultados.
- Com zoom real de 200%, conferir reflow e os controles de registro. Viewport estreito sozinho não comprova esse teste.
- Atualizar com todas as abas recarregadas. O contrato novo de reserva de timer exige código atualizado nas abas participantes.
