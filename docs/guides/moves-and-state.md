---
title: Moves, goals and assistance
section: how-to
order: 2
description: Keep stable cell indices and immutable state through moves, undo and restart.
---

## Work with native indices

```ts
import { classicTriangle,legalJumps,jumpAt,pegCount,undo,markHelped,restart } from "@johnmorrisdotca/tobiishi";
const start=classicTriangle().game;
const move=legalJumps(start)[0];
const next=markHelped(jumpAt(start,move.from,move.to));
console.log(pegCount(start),pegCount(next),undo(next).helped,restart(next).helped);
```

A `Jump` uses `from`, `over` and `to` indices into its board’s stable cells. Drawing coordinates are derived separately. Invalid jumps return the same game; an undo with no history also returns it unchanged. A target of null permits any final hole. A non-null target requires the last peg at that exact native index.

## Preserve the assistance flag

`markHelped` records a proved hint without changing pieces. Undo retains this marker; restart clears history and assistance while restoring the original peg arrangement. `isGameStuck` means no legal continuation remains before the goal is reached. It does not prove that an earlier position was unsolvable.
