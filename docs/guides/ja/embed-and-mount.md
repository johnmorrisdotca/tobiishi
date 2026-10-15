---
title: 標準のゲームを表示・埋め込みする
section: how-to
order: 8
description: 表示先を用意し、独立した状態と後始末を保ちます。
---

## 標準のプレイヤーを保持する

```ts no-run
import { classicTriangle } from "@johnmorrisdotca/tobiishi";
import { mount } from "@johnmorrisdotca/tobiishi/play";
const host=document.createElement("div");
document.body.append(host);
const player=mount(host,{challenge:classicTriangle(),language:"ja",material:"glass",onChange:(game,code)=>console.log(game.history.length,code.length)});
player.set({material:"wood"});
console.log(player.getGame().board.name);
player.destroy();
```

表示ごとに独立した状態があります。検証済みの状態は`setGame`、見た目は`set`で変えます。破棄すると、標準のイベントと操作を取り除きます。ブラウザーの例は、NodeでDOMを動かさずに型を確認します。

## ビルダーの形式を使う

ビルダーは、標準の要素、版を固定したフレーム、モジュール、フレームワークの例を出力します。盤、シード、長さ、見た目、言語、操作を選べます。独自の状態、解答、コールバックはページ側の設定です。フレームのoriginとsourceを確認します。[埋め込みの完全な仕様](../../embeds.md)に、属性、別名、イベント、入力の扱いを残しています。Docsはページとビルダーの言語に従い、APIのアンカーも保ちます。
