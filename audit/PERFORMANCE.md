# Desempenho medido

Chromium Linux headless 154.0.8037.57. Cinco amostras por tela, mediana abaixo. Renderização significa JavaScript síncrono; não inclui pintura, FPS ou interação física. O ambiente é compartilhado, sem isolamento de carga; os números são observações locais. Reload é releitura de um contexto previamente inicializado, por servidor local; não mede rede do GitHub Pages.

Não foi identificado um gargalo que justificasse nova arquitetura. Não se atribui melhoria às diferenças de tempo ou heap: há variação de execução, aquecimento e coleta de lixo. A restauração final foi mais lenta nesta medição; a proteção transacional é prioritária e não foi apresentada como otimização.

## Seis cenários — candidato final

| Cenário | Estudos | Tópicos | Semanas | Reload (ms) | Hoje (ms) | Análises (ms) | Histórico (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| vazio | 0 | 0 | 0 | 100.7 | 0.7 | 2.9 | 0.8 |
| iniciante | 1 | 30 | 2 | 142.9 | 3.3 | 7.0 | 1.7 |
| 30-dias | 120 | 120 | 6 | 135.1 | 4.7 | 13.6 | 10.1 |
| 12-semanas | 420 | 120 | 13 | 129.6 | 7.8 | 12.1 | 20.5 |
| 52-semanas | 1820 | 400 | 53 | 163.3 | 10.3 | 31.4 | 12.8 |
| 1000-dias | 5000 | 400 | 144 | 213.1 | 13.5 | 29.7 | 14.0 |

## 5.000 estudos — antes e depois

| Operação | Original (ms) | Candidato (ms) |
|---|---:|---:|
| Hoje, mediana de JS | 15.0 | 13.5 |
| Planejamento, mediana de JS | 15.6 | 13.3 |
| Revisões, mediana de JS | 34.8 | 32.3 |
| Disciplinas, mediana de JS | 3.3 | 3.0 |
| Análises, mediana de JS | 30.5 | 29.7 |
| Histórico, mediana de JS | 17.9 | 14.0 |
| Ajuda, mediana de JS | 5.5 | 4.8 |
| Dados, mediana de JS | 4.4 | 3.6 |
| Configurações, mediana de JS | 4.2 | 5.1 |
| CSV completo, uma amostra | 43.7 | 41.1 |
| Parse + validação + checksum, uma amostra | 56.8 | 67.3 |
| Restauração IndexedDB, uma amostra | 202.7 | 298.5 |

A maior base tem 40 disciplinas, 400 tópicos, 100 prazos, 144 semanas, 324 sugestões de revisão e cerca de 3,4 MB de JSON. O fixture deriva os estados de revisão de sessões sintéticas; não consiste apenas em preencher listas vazias. Não houve erro JavaScript nos seis cenários. Backup vazio foi recusado, conforme esperado.

Arquivos brutos com todas as amostras, tamanhos e hash SHA-256 de app.js: [original](evidencias/antes/carga/benchmark.json) e [candidato](evidencias/depois/carga/benchmark.json). O heap registrado é apenas a observação daquele instante; não é uma prova de menor consumo. Os comandos estão em [BASELINE](evidencias/BASELINE.md).

Limites: não foram medidos LCP/INP/CLS em dispositivo real, rede móvel, aparelhos de entrada, bateria, décadas de histórico ou latência de armazenamento fisicamente cheio.
