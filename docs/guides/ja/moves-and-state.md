---
title: 移動・目標・ヒントの記録
section: how-to
order: 2
description: 穴の番号と変更不可の状態を、移動や取り消しで保ちます。
---

## 標準の穴番号を使う

```ts
import { classicTriangle,legalJumps,jumpAt,pegCount,undo,markHelped,restart } from "@johnmorrisdotca/tobiishi";
const start=classicTriangle().game;
const move=legalJumps(start)[0];
const next=markHelped(jumpAt(start,move.from,move.to));
console.log(pegCount(start),pegCount(next),undo(next).helped,restart(next).helped);
```

`Jump`の`from`、`over`、`to`は、盤の穴の番号です。描画の座標は別に求めます。不正な移動は元の状態を返し、履歴がない取り消しも状態を変えません。目標がnullなら、最後の石はどの穴でもかまいません。番号が指定されていれば、その穴に残す必要があります。

## ヒントを使った記録を保つ

`markHelped`は、石を動かさずにヒントを使った記録を加えます。取り消しても記録は残り、最初から始めると履歴とヒントの記録を消し、元の石の配置に戻します。`isGameStuck`は、目標に達する前に合法な移動がなくなった状態です。それより前の状態が解けなかったという証明ではありません。
