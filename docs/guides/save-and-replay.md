---
title: Save and replay a game
section: how-to
order: 6
description: Validate versioned progress rather than trusting a claimed final position.
---

## Store the native replay code

```ts
import { classicTriangle,legalJumps,jumpAt,markHelped,gameCode,gameFromCode } from "@johnmorrisdotca/tobiishi";
const start=classicTriangle().game;
const move=legalJumps(start)[0];
const code=gameCode(markHelped(jumpAt(start,move.from,move.to)));
const restored=gameFromCode(code);
console.log(restored?.history.length,restored?.helped,gameFromCode("not a save"));
```

The code contains a version, board, original pegs, target, assistance marker and ordered moves. Loading validates the board/start and replays legal moves. Malformed, unsupported, oversized or illegal records return null. A host should preserve a refused record for the user to inspect rather than silently treating it as completed progress.

## Host persistence

The mount’s `onChange(game,code)` callback supplies native state and serialization. Host code chooses storage and uses `setGame` to restore a validated game. Keep board cell order stable: saved moves are native indices, not drawing pixels. The existing demo’s progress storage is its own page behavior; embeds follow their separate storage/privacy contract.
