# Proveniência e reprodução das evidências

O ponto de partida foi `1a211feaaedb8431738904731d715ba6c9afbac7`, v7.1.0. README, app.js, content.js, index.html e styles.css estavam sem alterações locais. `git ls-remote --symref origin HEAD` confirmou main nesse commit. Não havia AGENTS.md nem suíte versionada.

Antes de alterar o produto, foi executado um smoke externo já presente no ambiente: assets HTTP, primeiro uso rápido, criação de Português, persistência após F5, viewport de 360 px e ausência de erros JavaScript. Foram capturadas as nove telas e uma primeira carga de 5.000 registros; seu resumo está em [antes/baseline.json](antes/baseline.json).

A comparação de carga mais representativa usa tests/workload.cjs: até 40 disciplinas, 400 tópicos, 5.000 estudos, 100 prazos, 144 semanas e 324 revisões sugeridas. A versão anterior foi servida a partir dos quatro arquivos extraídos do commit original, em diretório separado. Nenhuma alteração no branch principal ou dado real de usuário foi necessária.

```sh
# Preparar uma cópia estática do original, sem mexer no checkout de trabalho:
mkdir -p /tmp/ciclo-original
git show 1a211fe:app.js > /tmp/ciclo-original/app.js
git show 1a211fe:content.js > /tmp/ciclo-original/content.js
git show 1a211fe:index.html > /tmp/ciclo-original/index.html
git show 1a211fe:styles.css > /tmp/ciclo-original/styles.css
CICLO_SOURCE_ROOT=/tmp/ciclo-original AUDIT_OUTPUT=/tmp/ciclo-antes npm run audit:benchmark

# Mesmas cargas no código alterado:
AUDIT_OUTPUT=/tmp/ciclo-depois npm run audit:benchmark
```

As falhas anteriores dos testes REGRESSÃO foram também reproduzidas contra essa cópia. A versão alterada é verificada por npm test. O relatório final e os logs indicam os testes que de fato terminaram.

As pastas antes/depois contêm JSONs e PNGs reais. Algumas capturas iniciais não foram incluídas no Git para evitar duplicação; o inventário de controles e a matriz funcional preservam o mapa. Não há screenshots simuladas, dados de uma pessoa real, benchmark estimado ou declaração de execução em navegador inexistente.
