# Ano fictício usado nos testes

`backup-365.json.gz` contém, sem alterar os bytes após descompressão, o arquivo sintético fornecido para esta auditoria. São 219.880 bytes comprimidos em vez de 1.910.433 bytes de JSON. O arquivo não contém dados pessoais reais, conforme a procedência informada pelo solicitante. Nenhum backup pessoal foi adicionado.

- Original: `Ciclo-Backup-Sintetico-Engenharia-Computacao-365-Dias.json`.
- SHA-256 descomprimido: `d44ec99061c28acdac05d0f10af3ce857d715ad12262cca65b6764686bc1bf4b`.
- Schema lógico 10; aplicativo 7.1.0; cyrb53 `12fdb5595ab92d`.
- 23/10/2025 a 22/10/2026; 911 estudos; 311 dias ativos; 26 disciplinas; 184 tópicos; 53 semanas.

`field-backup.cjs` descomprime o arquivo em memória e o envia ao seletor de arquivo da própria interface. `npm test` executa essas verificações nos três motores da CI, sempre em contextos novos e numa origem HTTP local efêmera. O verificador de referência usa apenas JavaScript de Node, sem chamar funções de cálculo do aplicativo.

`field-stress.cjs` produz cópias temporárias maiores com IDs próprios e deslocamentos de 364 dias, conservando o dia da semana. As semanas sobrepostas são deduplicadas pela data. Esses dados são instrumentos de carga, não simulações independentes de aprendizagem nem anos civis exatos. Nenhuma dessas cópias é persistida no repositório.

## Backup sintético específico da v7.2.0

`backup-v7.2.json` foi exportado em 25/10/2026 pelo código original do commit `e7215d8`, executado num navegador descartável. Contém duas disciplinas, três tópicos, dois estudos sintéticos (incluindo resultados e revisão multidisciplinar), configurações e checksum original. Não contém dados pessoais. É um complemento ao fixture anual, que permanece intacto.

- App 7.2.0; schema lógico 10; cyrb53 `033d0cea0bb9f5`.
- SHA-256: `a73a8c068bd6536e80fa538a96616aefb8e9f5c44898d9dd071a0957e33e33fa`.
- `flashcards.test.cjs` restaura o arquivo e compara os estudos integralmente, sem recalcular ou substituir seu checksum.
