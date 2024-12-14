# hello-world-circom-proof-to-symbol

## 前提

Node.jsをインストールしてください

https://nodejs.org/



circomをインストールしてください

https://docs.circom.io/getting-started/installation/

## circomを動かす

```
$ cd circom
$ npm i
```

ファイルをクリア

```
$ make clean
```

証明を生成

```
$ make ptau
$ make build
$ make key
$ make prove
$ make verify
```

## symbolを動かす

```
$ cd symbol
$ npm i
```

```
$ cp env.js.sample env.js
```

### 書き込み

`env.js`に`NODE_URL`と`PRIVATE_KEY`を入力してください。

必要であれば`all.json`を編集してください。

```
$ node write.js
```

### 読み込み

`env.js`に`NODE_URL`と`TRANSACTION_HASH`を入力してください。

```
$ node read.js
```

`proof.json`と`public.json`と`verification_key.json`が出力されます。

以下のコマンドで検証します。

```
$ snarkjs plonk verify verification_key.json public.json proof.json
```