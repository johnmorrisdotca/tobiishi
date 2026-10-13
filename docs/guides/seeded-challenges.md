---
title: Generate and verify seeded challenges
section: how-to
order: 3
description: Use reverse-growth witnesses and inspect the actual returned length.
---

## Replay the supplied witness

```ts
import { challengeOf,jumpAt,isGameSolved } from "@johnmorrisdotca/tobiishi";
const challenge=challengeOf("triangle","lesson-1",3);
let game=challenge.game;
for(const jump of challenge.answer) game=jumpAt(game,jump.from,jump.to);
console.log(challenge.answer.length,isGameSolved(game),challenge.seed);
```

The generator grows backwards from one peg and returns the reverse jumps as a complete legal witness. Fix board shape, seed, requested length, optional goal and package version to recreate a lesson. The generated game owns its board and peg arrays.

## Inspect requested and actual length

The general generator tries to grow to the requested length and can return its best shorter nonempty challenge. Check `answer.length`. Invalid length/goal inputs or a board with no challenge throw. Named goal packs additionally require their exact requested witness length, as described in [named packs](named-packs.md). Large generation examples should remain bounded or typechecked without running.
