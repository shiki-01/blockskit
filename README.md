# Blockskit

## はじめに

このリポジトリは、「フレームワークってこんなことできるよ」「 TypeScript はここまでできたらいいね！」というサンプルのために作られたものです。

HTML などを学習し終えて行き悩んでいる場合はぜひ一通り見てみてください。

## ファイル構造

```
/Blockskit
┣ /.idea            IDE の設定用フォルダです。無視でいいので中身は割愛します。
┣ /src              プロジェクトのコードを書いていく一番頭。 `source` の略
┣ .gitignore        Git にアップロードしたくないフォルダ・ファイルを指定する。秘密鍵等は公開してはいけないものだから `.env` ファイルに書いておいてここに `.env` にファイル名をかく。
┣ .npmrc            npm の設定ファイルの一つ。
┣ .nvmrc            npm のバージョンを指定するもの。バージョンが違うと動かないことがあるからそれを防ぐ。
┣ .pettierignore    pettier という機能を適応させないファイルの設定。適応させても意味ないもの等を含めておく。
┣ .pettierrc        pettier という機能の設定。 pettier はソースコードのルールやフォーマットの設定をしてくれる機能。
┣ eslint.config.js  eslint という機能の設定。 pettier とほとんど一緒。
┣ package-lock.json npm で入れたものの詳細がかかれる。基本的に自分で編集することはない。
┣ package.json      npm の設定ファイル。プロジェクトに入ってるパッケージの一覧やコマンドの設定が書かれている。
┣ README.md
┣ svelte.config.js
┣ tsconfig.json
┗ vite.config.ts
```