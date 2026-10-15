---
title: はじめに
section: tutorial
order: 1
description: 小さい標準の問題で、使う入口を確かめます。
---

## 1回飛び越える

```ts
import { makeBoard,newGame,legalJumps,jumpAt,isGameSolved } from "@johnmorrisdotca/tobiishi";
const board=makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
const game=newGame(board,[true,true,false],2);
const jump=legalJumps(game)[0];
console.log(isGameSolved(jumpAt(game,jump.from,jump.to)),game.pegs);
```

計算部分は、ブラウザーがなくても使えます。石のある穴から1つの石を飛び越え、空いた穴に進みます。石を1つ取り除き、新しい変更不可の状態を返します。元の状態も、取り消しや比較に使えます。

## 入口を選ぶ

主な入口には、盤、状態、探索、問題生成があります。`/draw`はSVGの文字列を返し、`/play`はブラウザーのプレイヤーを表示します。`/element`は要素のクラス、`/element/define`は登録です。[移動の規則](moves-and-state.md)、[シード付きの問題](seeded-challenges.md)、[埋め込み](embed-and-mount.md)へ進めます。
