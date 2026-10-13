---
title: 盤を描いて素材を選ぶ
section: how-to
order: 7
description: 標準の SVG の形と配色を、ゲームの規則から分けて使います。
---

## 盤を SVG として描く

```ts
import { classicTriangle } from "@johnmorrisdotca/tobiishi";
import { draw,boundsOf,pointOf } from "@johnmorrisdotca/tobiishi/draw";
const game=classicTriangle().game;
const svg=draw(game,{material:"wood",theme:{accent:"#2f6b4f"},title:"Triangle lesson"});
console.log(svg.startsWith("<svg"),boundsOf(game),pointOf(game,0));
```

石、木、ガラスには標準の配色があります。テーマの一部を指定すると、対応する色を置き換えます。描画は、盤の格子から形を求めます。穴番号は、その盤にある番号を使います。SVG は DOM のないサーバー出力や画像にも使えます。選択した穴や目標の目印は表示で、合法な移動は計算部分が判断します。

## ページ側の操作を分ける

自分の操作画面がある場合は盤だけを表示でき、標準の設定と操作も使えます。素材や言語を変えても、ゲームの状態は保ちます。[README の配色の例](../../../README.md#a-look-of-your-own)と[盤だけの例](../../../README.md#only-the-board-for-a-page-of-your-own)には、元の詳しい設定を残しています。
