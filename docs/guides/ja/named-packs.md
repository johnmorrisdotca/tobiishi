---
title: 名前付きの目標問題を選ぶ
section: how-to
order: 4
description: 実際の目標を選び、解答の長さによる難しさの表示を理解します。
---

## 標準の目標を選ぶ

```ts
import { TOBIISHI_CHALLENGE_PACKS,generateTobiishiChallenge } from "@johnmorrisdotca/tobiishi";
const pack=TOBIISHI_CHALLENGE_PACKS.english;
const challenge=generateTobiishiChallenge("english",pack.goals[0].id,"easy");
console.log(pack.title.en,challenge.goal.id,challenge.answer.length,challenge.seed);
```

9種類の盤には、それぞれ3つの目標と3段階の長さがあり、81通りになります。やさしい・ふつう・むずかしいは3・6・9回の移動を指定します。解答の長さによる分類で、人が感じる難しさを測った評価ではありません。シードには、パック、目標、分類が含まれます。

## その盤にある目標を使う

目標には、穴の整数座標と各言語の名前があります。生成は実際の穴であることを確認します。不明なパック・目標・分類、または指定の長さに達しない問題は例外です。メニューには、そのパックの目標を使い、別の盤の座標を流用しないでください。
