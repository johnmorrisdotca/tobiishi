---
title: Getting started
section: tutorial
order: 1
description: Play a small native puzzle and choose an entry point.
---

## Play one jump

```ts
import { makeBoard,newGame,legalJumps,jumpAt,isGameSolved } from "@johnmorrisdotca/tobiishi";
const board=makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
const game=newGame(board,[true,true,false],2);
const jump=legalJumps(game)[0];
console.log(isGameSolved(jumpAt(game,jump.from,jump.to)),game.pegs);
```

The engine works without a browser. A jump starts on an occupied hole, crosses one peg and lands on an empty hole. It removes exactly one peg and returns a new immutable game. The original game remains available for an undo stack or a comparison.

## Choose the entry

The main entry supplies boards, games, search and challenges. `/draw` returns SVG text; `/play` mounts an accessible browser player. `/element` exposes the custom element, and `/element/define` registers it. Start with [move rules](moves-and-state.md), [seeded challenges](seeded-challenges.md) or [embedding](embed-and-mount.md).
