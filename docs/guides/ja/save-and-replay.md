---
title: 状態を保存して再生する
section: how-to
order: 6
description: 最終状態の申告ではなく、版付きの移動を検証します。
---

## 標準の再生コードを保存する

```ts
import { classicTriangle,legalJumps,jumpAt,markHelped,gameCode,gameFromCode } from "@johnmorrisdotca/tobiishi";
const start=classicTriangle().game;
const move=legalJumps(start)[0];
const code=gameCode(markHelped(jumpAt(start,move.from,move.to)));
const restored=gameFromCode(code);
console.log(restored?.history.length,restored?.helped,gameFromCode("not a save"));
```

コードには、版、盤、元の石、目標、ヒントの記録、移動順が入ります。読み込みは、盤と最初の状態を確認し、合法な移動を再生します。不正な形式、未対応の版、大きすぎる記録、不正な移動は null です。読めない記録を、完了した進み具合として扱わないでください。

## ページ側の保存

表示の `onChange(game,code)` は、標準の状態と保存文字列を渡します。保存先はページ側で選び、検証した状態を `setGame` で戻します。移動は描画のピクセルではなく穴の番号なので、盤の穴順を保ちます。デモの進み具合の保存は、そのページの機能です。埋め込みには、別に記載された保存と入力の扱いの仕様があります。
