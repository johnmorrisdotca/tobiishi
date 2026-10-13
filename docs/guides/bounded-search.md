---
title: Ask the solver within a budget
section: how-to
order: 5
description: Distinguish solved, impossible and an unfinished limit result.
---

## Use a bounded proof search

```ts
import { makeBoard,newGame,solve } from "@johnmorrisdotca/tobiishi";
const board=makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
console.log(solve(newGame(board,[true,true,false],2),100));
```

`solved` supplies legal jumps to the goal. `impossible` means the search completed without a solution. `limit` means it ran out of nodes and proves neither solvability nor impossibility. An already solved position can return an empty witness. An empty `jumps` array must be interpreted with `status`.

## Keep interaction responsive

Give larger boards a deliberate positive safe-integer node budget. Do not run unbounded searches on every pointer move. The browser player’s hint logic and assistance marker remain native. Prefer a generated challenge’s existing witness where it is applicable. If a hint has been shown, preserve `helped` when saving or undoing.
