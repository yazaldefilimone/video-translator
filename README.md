### Video Translator

> Este projeto foi testado em uma máquina Linux. Caso haja problemas em outros sistemas operacionais, por favor, abra uma issue e tentaremos resolver o mais rápido possível.

##### Configuração

Este projeto é baseado no ffmpeg, uma biblioteca de manipulação de vídeo e áudio que utiliza os recursos da sua máquina. Portanto, é importante verificar se o ffmpeg está instalado. Caso não esteja, você pode baixá-lo em [ffmpeg.org](ffmpeg.org).

**Observação**: Por padrão, o projeto procura pelo ffmpeg na sua pasta raiz em todos os sistemas operacionais (Linux, Windows e macOS). Teoricamente, após a instalação, ele deve funcionar automaticamente. Caso não funcione, pesquise o diretório onde o `ffmpeg` se encontra e verifique se está no local esperado.

Este projeto utiliza o node.js na versão `v16.17.0` ou `superior`. Caso não tenha o `node.js` instalado, você pode baixá-lo em [nodejs.org.](nodejs.org)

1.Clone o repositório e acesse a pasta:

```bash

git clone https://github.com/yazaldefilimonepinto/video-translator && cd video-translator
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
# ou
pnpm install
```

3. Em seguida, acesse o site [AssemblyAI](https://www.assemblyai.com/), crie uma conta e pegue a chave de autenticação. No arquivo `.env`, você encontrará a variável `ASSEMBLY_AUTH`. Cole a chave nessa variável.

4. Depois, acesse o site [Narakeet](https://narakeet.com), crie uma conta e pegue a chave de autenticação. No arquivo `.env`, você encontrará a variável `NARAKEET_AUTH`. Cole a chave nessa variável.

5. Crie uma pasta `./videos` e coloque quantos vídeos quiser. O projeto suporta quase todos os idiomas, mas, no momento, só é possível traduzir do inglês para o português.

6. Por fim, execute o seguinte comando:

```bash
yarn dev
# ou
npm run dev

```

**Observação**: Aguarde até que o processo seja concluído. Dependendo do tamanho do vídeo, pode levar muito tempo (aproximadamente 50% a 70% do tempo total do vídeo).

[MIT](https://github.com/yazaldefilimonepinto/video-translator/blob/main/license) © [Yazalde Filimone](https://www.linkedin.com/in/yazalde-filimone/)
