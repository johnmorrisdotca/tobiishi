---
title: シード付きの問題を作って確かめる
section: how-to
order: 3
description: 逆向きに作った解答を使い、実際の長さを確かめます。
---

## 用意された解答を再生する

```ts
import { challengeOf,jumpAt,isGameSolved } from "@johnmorrisdotca/tobiishi";
const challenge=challengeOf("triangle","lesson-1",3);
let game=challenge.game;
for(const jump of challenge.answer) game=jumpAt(game,jump.from,jump.to);
console.log(challenge.answer.length,isGameSolved(game),challenge.seed);
```

問題は、石1つの状態から逆向きに作り、その逆の移動を完全な解答として返します。教材を再現する場合は、形、シード、指定した長さ、任意の目標、パッケージの版をそろえます。状態は、自分の盤と石の配列を持ちます。

## 指定した長さと結果の長さを確かめる

一般の生成は、指定した長さを目指しますが、見つかった短い問題を返す場合があります。`answer.length`を確認してください。不正な長さや目標、問題を作れない盤は例外です。名前付きの目標問題は、[問題パック](named-packs.md)のとおり、指定どおりの解答の長さも確認します。大きい生成の例には、実行の上限を設けるか、型だけの確認を使います。
