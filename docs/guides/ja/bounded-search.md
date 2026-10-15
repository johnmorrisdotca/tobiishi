---
title: 探索の上限を決めて解答を探す
section: how-to
order: 5
description: 解答、解けない証明、上限で未完了の結果を区別します。
---

## 上限付きの証明探索を使う

```ts
import { makeBoard,newGame,solve } from "@johnmorrisdotca/tobiishi";
const board=makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
console.log(solve(newGame(board,[true,true,false],2),100));
```

`solved`は、目標までの合法な移動を返します。`impossible`は、探索を完了しても解答がなかった結果です。`limit`は、訪問数の上限に達した結果で、解けるとも解けないとも証明しません。すでに解けている盤では、解答の移動が空の場合があります。`jumps`が空でも、必ず`status`と一緒に判断します。

## 操作を重くしない

大きい盤では、正の安全な整数で探索の上限を決めます。ポインターの移動ごとに、上限を考えず探索しないでください。プレイヤーのヒント処理と使用の記録は標準の仕組みです。使える場合は、生成した問題の解答を使います。ヒントを表示した後は、保存や取り消しでも`helped`を保ちます。
