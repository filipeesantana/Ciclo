# Desempenho medido

Chromium Linux headless 154.0.8037.57. Cinco amostras por tela, mediana abaixo. Renderização significa JavaScript síncrono; não inclui pintura, FPS ou interação física. Reload é releitura de um contexto previamente inicializado, por servidor local; não mede rede do GitHub Pages.

Não foi identificado um gargalo que justificasse nova arquitetura. Não se atribui melhoria às diferenças de tempo ou heap: há variação de execução, aquecimento e coleta de lixo. A restauração final foi mais lenta nesta medição; a proteção transacional é prioritária e não foi apresentada como otimização.

## Seis cenários — candidato final

| Cenário | Estudos | Tópicos | Semanas | Reload (ms) | Hoje (ms) | Análises (ms) | Histórico (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| vazio | 0 | 0 | 0 | 121.3 | 1.1 | 2.9 | 0.5 |
| iniciante | 1 | 30 | 2 | 131.1 | 2.6 | 6.5 | 1.3 |
| 30-dias | 120 | 120 | 6 | 186.0 | 5.0 | 13.5 | 9.7 |
| 12-semanas | 420 | 120 | 13 | 129.6 | 5.0 | 11.6 | 15.0 |
| 52-semanas | 1820 | 400 | 53 | 162.2 | 10.7 | 27.8 | 11.7 |
| 1000-dias | 5000 | 400 | 144 | 210.6 | 11.8 | 29.0 | 13.2 |

## 5.000 estudos — antes e depois

| Operação | Original (ms) | Candidato (ms) |
|---|---:|---:|
| Hoje, mediana de JS | 15.0 | 11.8 |
| Planejamento, mediana de JS | 15.6 | 13.3 |
| Revisões, mediana de JS | 34.8 | 32.6 |
| Disciplinas, mediana de JS | 3.3 | 4.3 |
| Análises, mediana de JS | 30.5 | 29.0 |
| Histórico, mediana de JS | 17.9 | 13.2 |
| Ajuda, mediana de JS | 5.5 | 4.6 |
| Dados, mediana de JS | 4.4 | 3.6 |
| Configurações, mediana de JS | 4.2 | 3.3 |
| CSV completo, uma amostra | 43.7 | 42.4 |
| Parse + validação + checksum, uma amostra | 56.8 | 53.1 |
| Restauração IndexedDB, uma amostra | 202.7 | 262.9 |

A maior base tem 40 disciplinas, 400 tópicos, 100 prazos, 144 semanas, 324 sugestões de revisão e cerca de 3,4 MB de JSON. O fixture deriva os estados de revisão de sessões sintéticas; não consiste apenas em preencher listas vazias. Não houve erro JavaScript nos seis cenários. Backup vazio foi recusado, conforme esperado.

Arquivos brutos com todas as amostras, tamanhos e hash SHA-256 de app.js: [original](evidencias/antes/carga/benchmark.json) e [candidato](evidencias/depois/carga/benchmark.json). O heap registrado é apenas a observação daquele instante; não é uma prova de menor consumo. Os comandos estão em [BASELINE](evidencias/BASELINE.md).

Limites: não foram medidos LCP/INP/CLS em dispositivo real, rede móvel, aparelhos de entrada, bateria, décadas de histórico ou latência de armazenamento fisicamente cheio.
