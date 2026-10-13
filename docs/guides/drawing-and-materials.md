---
title: Draw boards and choose materials
section: how-to
order: 7
description: Use native SVG geometry and palette overrides independently of game rules.
---

## Draw a standalone SVG

```ts
import { classicTriangle } from "@johnmorrisdotca/tobiishi";
import { draw,boundsOf,pointOf } from "@johnmorrisdotca/tobiishi/draw";
const game=classicTriangle().game;
const svg=draw(game,{material:"wood",theme:{accent:"#2f6b4f"},title:"Triangle lesson"});
console.log(svg.startsWith("<svg"),boundsOf(game),pointOf(game,0));
```

Stone, wood and glass are native palettes. Partial theme fields replace their corresponding colours. Drawing derives its geometry from the native board lattice; a cell index must belong to this game. SVG text is suitable for server output and images without a DOM. A selected hole and a goal marker are presentation, while move legality stays in the engine.

## Keep host controls separate

The browser mount can render only the board for a host with its own controls, or supply the native settings and interactions. Material/language updates preserve the game. The existing [README look examples](../../README.md#a-look-of-your-own) retain the complete palette fields and [board-only recipe](../../README.md#only-the-board-for-a-page-of-your-own).
