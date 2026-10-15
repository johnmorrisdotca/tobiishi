---
title: How the board, engine and player fit together
section: explanation
order: 10
description: Preserved architecture and the separation of proof, replay and drawing.
---

## Architecture

```text
src/
├── board.ts
├── challenges.ts
├── draw-entry.ts
├── draw.ts
├── element-define.ts
├── element.ts
├── game.ts
├── generate.ts
├── index.ts
├── mount.ts
├── play-entry.ts
├── solve.ts
└── strings.ts
```

The engine is `board.ts` (the lattice and every legal jump of a board, frozen), `game.ts` (a position and what a jump does to it), `solve.ts` (the bounded search), `generate.ts` (the backward growth of a challenge and the two classic starts) and `challenges.ts` (the 81 named challenges). `draw.ts` is the SVG and `mount.ts` the player, which uses both; `strings.ts` is its words. `element.ts` defines the tag and `element-define.ts` registers it as an effect of being imported. The three `*-entry.ts` and `index.ts` files are the package's entry points. None of the engine files touches the DOM.

## Documentation and development

The shared generator reads the public TypeScript declarations and checks concrete examples. It builds paired references/guides, Markdown twins, llms files and local search. The demo server serves the same built docs beside the game; browser commands build the site before starting that server.
