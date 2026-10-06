<h1 align="center">Tobiishi <sub>飛び石</sub></h1>

<p align="center"><strong>Peg solitaire on classic boards and playful shapes.</strong><br>
Nine outlines, custom rectangles, seeded solvable challenges and accessible English/Japanese play. No runtime dependencies.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/tobiishi/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/tobiishi/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/tobiishi"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/tobiishi?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No runtime dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/tobiishi/"><strong>Play a board →</strong></a> · <a href="https://johnmorrisdotca.github.io/tobiishi/api.html">API reference</a> · <a href="docs/API.md">API guide</a></p>

<table align="center">
<tr>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hero-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hero-desk-light.webp" alt="The demo on a desk: Tobiishi's header with its language chooser and cloth swatches, the short goal challenge menus beside the board settings, and the English cross on green felt with one jump made, thirty-one pegs left and the goal hole at the centre ringed with a dotted line" width="600">
</picture>
<br><em>The demo on a desk: the English cross after its first jump, thirty-one pegs left.</em>
</td>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hero-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hero-phone-light.webp" alt="The demo on a phone, in Japanese: the heart board on green felt with thirteen stones left and one hole ringed as the goal, and the four buttons 戻す, やり直す, 新しい問題 and ヒント under it" width="190">
</picture>
<br><em>On a phone, in Japanese, in the device's light or dark.</em>
</td>
</tr>
</table>

Peg solitaire for JavaScript and TypeScript. Jump one peg over another into an
empty hole. Remove the jumped peg. Leave one peg in the dotted goal hole.

A pure immutable engine, custom boards, SVG drawing, and English/Japanese play.
Zero runtime dependencies. Node 22+ for development; modern browsers for play.
The Japanese name means stepping stones; it is a project name rather than a
claim about the game's historical Japanese name.

## In 30 seconds

```sh
npm install @johnmorrisdotca/tobiishi
```

```ts
import { classicEnglish, isGameSolved, jumpAt, legalJumps, pegCount } from "@johnmorrisdotca/tobiishi";

let { game } = classicEnglish();           // the traditional 33-hole cross, the centre empty
console.log(pegCount(game), legalJumps(game).length);   // 32 pegs, 4 jumps to choose from
const jump = legalJumps(game)[0]!;
game = jumpAt(game, jump.from, jump.to);   // a new game; the old one is untouched
console.log(pegCount(game), isGameSolved(game));        // 31 false
```

Or in a page, with nothing else to set up:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/tobiishi@0/dist/element-define.js"></script>
<tobiishi-game shape="triangle" language="en" material="wood"></tobiishi-game>
```

The player takes the board, the jumps, Undo, Restart, a new challenge and a hint, and speaks English or Japanese. The same game from a script, in a page you already have:

```ts no-run
import { mount } from "@johnmorrisdotca/tobiishi/play";

const player = mount(document.querySelector("#game")!, { shape: "english", language: "en", material: "stone" });
// player.getGame(), player.setGame(game), player.destroy()
```

## Who it is for

- **Puzzle sites and apps** that need a playable board and an immutable rules engine: the position, the jump, Undo, a saved-game code and a check that a position is solved, as plain functions with no DOM.
- **Teachers and learners** exploring jumps, board geometry and solvability: nine outlines on a square lattice and a triangular one, a bounded solver and challenges whose answers can be replayed.
- **Players** who enjoy the classic cross, the triangle, hearts, stars and short goal challenges, in English or Japanese, by touch, mouse or keyboard.
- **Anyone who needs a board of their own**: `makeBoard` takes any set of integer holes, and the player and the drawing follow its geometry.

## Features

- **Nine boards**, from the English cross and the triangle to a heart, a star and a hexagon, and any rectangle you ask for, each with its jumps, undo and a saved-game code. See [Boards](#boards).
- **Seeded challenges that can be solved**, grown backward from one peg, each carrying an answer that is replayed; and nine named packs of short goal challenges, 81 in all. See [Short goal challenge packs](#short-goal-challenge-packs).
- **A bounded solver**, hints along a proved answer, and a `helped` mark so a host can score assisted play apart. See [The engine](#the-engine).
- **SVG drawing** in three materials (`stone`, `wood`, `glass`), and a player for touch, mouse and keyboard, in English and Japanese. See [Draw and custom element](#draw-and-custom-element) and [Accessibility](#accessibility).
- **A pure, immutable engine** and a custom element, with no DOM in the core, so servers and workers can import it.
- **Zero runtime dependencies.**

### What's in it

Each picture is a real board, drawn by the package, taken from [the demo](https://johnmorrisdotca.github.io/tobiishi/) with `pnpm screenshots:readme`, in light and dark. A dotted ring is the goal hole; a solid ring is the peg you have chosen.

<table>
<tr>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/english-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/english-desk-light.webp" alt="The English cross: a plus-shaped board of thirty-three round holes on cream, the centre hole empty and ringed with a dotted line as the goal, and thirty-two black pegs in the others" width="250">
</picture>
<br><em><strong>English cross.</strong> The traditional 33 holes, the centre empty; finish at the centre.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/triangle-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/triangle-desk-light.webp" alt="The triangle board: fifteen holes in five rows of one to five, the apex hole empty and fourteen black pegs, drawn on an equilateral lattice" width="250">
</picture>
<br><em><strong>Triangle.</strong> Fifteen holes, six jump directions, the apex empty; finish in any hole.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/european-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/european-desk-light.webp" alt="A European board challenge: a cross with its four corners rounded in, thirty-seven holes in all, a handful of pegs left scattered across it and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>European.</strong> Thirty-seven holes; a seeded challenge to finish at a marked hole.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/diamond-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/diamond-desk-light.webp" alt="A diamond-shaped board of twenty-five holes in rows of one, three, five, seven, five, three and one, with a few pegs placed and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Diamond.</strong> A compact 25-hole board; a seeded challenge.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/heart-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/heart-desk-light.webp" alt="A heart-shaped board of forty holes with two lobes at the top and a point at the bottom, a few pegs placed and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Heart.</strong> A 40-hole heart outline on a square lattice; generated partial challenges.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/star-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/star-desk-light.webp" alt="A star-shaped board of forty-nine holes on a square lattice with a point at the top and two legs at the bottom, a few pegs placed and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Star.</strong> A 49-hole star outline on a square lattice; generated partial challenges.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hexagon-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/hexagon-desk-light.webp" alt="A hexagonal board of thirty-seven holes on a triangular lattice with offset rows, a scatter of pegs and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Hexagon.</strong> Thirty-seven holes, six jump directions, generated partial challenges.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/wide-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/wide-desk-light.webp" alt="A wide rectangular board nine holes across and five down, a few pegs placed and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Wide.</strong> A 9 × 5 rectangle; generated partial challenges.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/tall-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/tall-desk-light.webp" alt="A tall rectangular board five holes across and nine down, a few pegs placed and one hole ringed as the goal" width="250">
</picture>
<br><em><strong>Tall.</strong> A 5 × 9 rectangle; generated partial challenges.</em>
</td>
</tr>
</table>

The pieces come in three materials, and the player shows what you can do with a peg and a challenge.

<table>
<tr>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/wood-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/wood-desk-light.webp" alt="The hexagon board with orange-brown wooden pegs on a tan wooden board with a darker rim" width="250">
</picture>
<br><em><strong>Wood.</strong> A warm board and brown pegs.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/glass-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/glass-desk-light.webp" alt="The hexagon board with teal glass pegs on a pale board" width="250">
</picture>
<br><em><strong>Glass.</strong> A pale board and teal pegs.</em>
</td>
<td align="center" valign="top" width="33%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/selected-peg-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/selected-peg-desk-light.webp" alt="The English cross after a peg has been chosen: that peg is circled in red and the empty holes it can jump into are outlined" width="250">
</picture>
<br><em><strong>A chosen peg.</strong> Its empty destinations are outlined; there is no dragging.</em>
</td>
</tr>
</table>

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/challenge-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/tobiishi/main/docs/images/challenge-desk-light.webp" alt="The demo with a short goal challenge started: the Heart Steps pack, medium difficulty and the north lobe as the target hole chosen in the left column, and the heart board with seven pegs left and the goal ringed" width="640">
</picture>
<br><em>A short goal challenge: pack, difficulty and target hole chosen, then played.</em>
</p>

## Use it in your project

Tobiishi is three things, each usable without the others: **the engine** (boards, jumps, saves, challenges and the solver, as pure functions with no DOM), **the drawing** (a board as SVG text) and **the player** (one function call or one tag). The table under [API](#entry-points) says which entry holds which.

### Install

```sh
npm install @johnmorrisdotca/tobiishi
# or: pnpm add @johnmorrisdotca/tobiishi
# or: yarn add @johnmorrisdotca/tobiishi
```

It is ES modules only, with its types included, and needs Node 22 or later outside a browser. For a page with no bundler, the same files are on a CDN: `https://cdn.jsdelivr.net/npm/@johnmorrisdotca/tobiishi@0/dist/element-define.js` defines the `<tobiishi-game>` tag.

### 1. The engine on a server

Every function takes a game and returns a new one; an illegal jump returns the game it was given. Nothing here touches a page, so a server or a worker can import it.

```ts
import { classicEnglish, gameCode, gameFromCode, isGameSolved, jumpAt } from "@johnmorrisdotca/tobiishi";

const { game, answer } = classicEnglish();    // the position, and a complete answer in 31 jumps
let played = game;
for (const jump of answer) played = jumpAt(played, jump.from, jump.to);
console.log(isGameSolved(played));                        // true
console.log(gameFromCode(gameCode(played))?.history.length);   // 31: a save is replayed, not trusted
```

### 2. One tag, no bundler

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/tobiishi@0/dist/element-define.js"></script>
<tobiishi-game shape="hexagon" seed="2026-10-06" language="ja" material="glass"></tobiishi-game>
<script>
  document.querySelector("tobiishi-game").addEventListener("tobiishi-change", (event) => console.log(event.detail.history.length));
</script>
```

### 3. A bundler, and a framework

`import "@johnmorrisdotca/tobiishi/element/define"` once, in code that runs in the browser, and `<tobiishi-game>` is a tag like any other. It draws in the page's own DOM, so the page's CSS reaches it. It speaks through one DOM event, `tobiishi-change`, whose `detail` is the new immutable game.

```jsx
// React 19
import { useEffect, useRef } from "react";
import "@johnmorrisdotca/tobiishi/element/define";

export function Board({ shape, onChange }) {
  const board = useRef(null);
  useEffect(() => {
    const listen = (event) => onChange(event.detail);
    board.current?.addEventListener("tobiishi-change", listen);
    return () => board.current?.removeEventListener("tobiishi-change", listen);
  }, [onChange]);
  return <tobiishi-game ref={board} shape={shape} language="en" />;
}
```

```vue
<!-- Vue 3: tell the compiler the tag is not a Vue component -->
<script setup>
import "@johnmorrisdotca/tobiishi/element/define";
defineProps({ shape: String });
</script>
<template>
  <tobiishi-game :shape="shape" language="en" @tobiishi-change="(event) => console.log(event.detail.history.length)" />
</template>
<!-- in vite.config: vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tobiishi-") } } }) -->
```

```svelte
<!-- Svelte 5 -->
<script>
  import "@johnmorrisdotca/tobiishi/element/define";
  let { shape = "english" } = $props();
  let board;
  $effect(() => {
    const listen = (event) => console.log(event.detail.history.length);
    board.addEventListener("tobiishi-change", listen);
    return () => board.removeEventListener("tobiishi-change", listen);
  });
</script>
<tobiishi-game bind:this={board} shape={shape} language="en"></tobiishi-game>
```

```ts no-check
// Angular: a standalone component with CUSTOM_ELEMENTS_SCHEMA
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@johnmorrisdotca/tobiishi/element/define";

@Component({
  selector: "app-board",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<tobiishi-game shape="star" language="en" (tobiishi-change)="changed($event)"></tobiishi-game>`,
})
export class Board {
  changed(event: Event) { console.log((event as CustomEvent).detail.history.length); }
}
```

In Next.js or any server-rendering framework, import the define entry from a client component, so the tag is defined in the browser. Or skip the tag and call `mount(element, options)` from `@johnmorrisdotca/tobiishi/play` in an effect: the handle it returns has `destroy()`, which a framework's cleanup should call.

```ts no-run
import { mount } from '@johnmorrisdotca/tobiishi/play';
const player = mount(document.querySelector('#game')!, {
  shape: 'english', language: 'en', material: 'stone',
  onChange(game, code) { localStorage.setItem('tobiishi', code); }
});
// player.getGame(), player.setGame(game), player.destroy()
```

A `game` overrides the initial position; a `challenge` supplies both game and
proof for instant hints along its answer. Configure `shape`, `seed`, `language`,
`material` (`stone`, `wood`, `glass`), partial `theme`, `challengeJumps`, or `justBoard`.
New challenge grows a fresh proved position on the selected board, including the
English and triangular shapes; its requested length defaults to twelve jumps. Just-board
mode retains the board and live status; host controls can call `setGame` with
`undo`, `restart`, or a new game. The engine has no automatic persistence or telemetry; the demo saves its selected pack and current game to local storage on this device.

React and other frameworks can use the vanilla API without an adapter dependency:
mount into a ref from an effect and return `player.destroy` as cleanup. Keep
state and language changes explicit through the host or recreate the mount.

## Examples

Each example is a whole recipe: copy it, and it works. The ones that need no page are run against the built package (`pnpm test:readme`), so none is a guess, and their output is shown in a comment.

### A page with nothing else

Save this as `board.html` and open it. One script, one tag, and a board to play, with the buttons, the words and a line under the board that says how many pegs are left.

```html
<!doctype html>
<meta charset="utf-8">
<title>Peg solitaire</title>
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/tobiishi@0/dist/element-define.js"></script>
<tobiishi-game shape="heart" seed="garden" language="en" material="wood"></tobiishi-game>
```

### Play the classic game through

The English cross has a known answer in 31 jumps (Ernest Bergholt's 1912 solution, replayed here rather than trusted). Every jump is checked by the same `jumpAt` a player uses.

```ts
import { classicEnglish, isGameSolved, jumpAt, pegCount } from "@johnmorrisdotca/tobiishi";

const { game, answer } = classicEnglish();
let state = game;
for (const jump of answer) state = jumpAt(state, jump.from, jump.to);
console.log(answer.length, pegCount(state), isGameSolved(state)); // 31 1 true
console.log(state.history.length, state.target === state.pegs.findIndex(Boolean)); // 31 true: the last peg is in the centre
```

### See the jumps, take one, take it back

`legalJumps` lists every jump as indexes into the board's holes: the peg it starts from, the peg it crosses and the hole it lands in. An illegal jump returns the very same game.

```ts
import { classicEnglish, jumpAt, legalJumps, restart, undo } from "@johnmorrisdotca/tobiishi";

const { game } = classicEnglish();
console.log(legalJumps(game));        // [ { from: 4, over: 9, to: 16 }, { from: 14, over: 15, to: 16 }, … ]: four ways into the centre
const after = jumpAt(game, 4, 16);
console.log(after.history.length, after.pegs[16], after.pegs[9]); // 1 true false
console.log(jumpAt(after, 4, 16) === after);   // true: that jump is no longer legal, so nothing changes
console.log(undo(after).history.length, restart(after).history.length); // 0 0
```

### Keep a game, and come back to it

A saved game is a short string, versioned, and it is rebuilt by replaying the jumps: a string that claims a position the rules cannot reach is refused with `null`, so a score is never read from a save.

```ts
import { classicEnglish, gameCode, gameFromCode, jumpAt } from "@johnmorrisdotca/tobiishi";

let { game } = classicEnglish();
game = jumpAt(game, 4, 16);
const code = gameCode(game);
console.log(code.length, code.slice(0, 40)); // 745 {"v":1,"board":{"name":"english","cells":
const back = gameFromCode(code);
console.log(back?.history.length, back?.pegs.filter(Boolean).length); // 1 31
console.log(gameFromCode('{"v":1,"moves":[[0,1]]}')); // null
```

### Ask the solver, within a budget

`solve` is a bounded depth-first search. `limit` means "did not finish", never "impossible"; give a larger budget, or run it in a worker.

```ts
import { classicTriangle, solve } from "@johnmorrisdotca/tobiishi";

const { game } = classicTriangle();
const found = solve(game, 100000);
console.log(found.status, found.jumps.length, found.visited); // solved 13 115
console.log(solve(game, 5).status);   // limit: five nodes were not enough to say
```

### A seeded challenge that can be solved

`challengeOf` grows a position backward from one peg, so the jumps it returns are a proof that it can be solved. The same seed gives the same challenge on every machine. The package never reads the date: for a challenge of the day, pass the date as the seed.

```ts
import { challengeOf, isGameSolved, jumpAt, pegCount } from "@johnmorrisdotca/tobiishi";

const today = challengeOf("heart", "2026-10-06", 8);   // a heart board, eight jumps at most
console.log(pegCount(today.game), today.answer.length, today.seed); // 9 8 2026-10-06
let state = today.game;
for (const jump of today.answer) state = jumpAt(state, jump.from, jump.to);
console.log(isGameSolved(state));   // true: the answer reaches one peg in the goal hole
```

### A named goal challenge

The nine packs have three goals each and three lengths (3, 6 or 9 jumps), 81 challenges, each with a complete answer.

```ts
import { TOBIISHI_CHALLENGE_PACKS, generateTobiishiChallenge } from "@johnmorrisdotca/tobiishi";

console.log(Object.keys(TOBIISHI_CHALLENGE_PACKS).length);   // 9
const challenge = generateTobiishiChallenge("wide", "north", "medium");
console.log(challenge.packTitle, challenge.goal.names.ja, challenge.answer.length); // Long Table 北の列 6
console.log(challenge.game.board.cells[challenge.game.target!]);   // { x: 4, y: 1 }: the North lane
```

### A board of your own

`rectangleBoard` makes any square-lattice rectangle from 3 to 32 holes a side (128 holes at most); `makeBoard` takes any set of integer holes, with `"square"` or `"triangle"` jumps.

```ts
import { legalJumps, makeBoard, newGame, rectangleBoard, solve } from "@johnmorrisdotca/tobiishi";

console.log(rectangleBoard(4, 4).cells.length, rectangleBoard(4, 4).jumps.length); // 16 32
const row = makeBoard("row", [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }]);
const game = newGame(row, [true, true, false, false], 3);   // two pegs; the last must end in hole 3
console.log(legalJumps(game));   // [ { from: 0, over: 1, to: 2 } ]
console.log(solve(game).status); // impossible: one jump leaves a peg in hole 2, not 3
```

### Draw a board as SVG text

`draw` returns a string with no page and no random ids, so a server can render a picture of any position, and the same position always gives the same text.

```ts
import { classicEnglish, jumpAt } from "@johnmorrisdotca/tobiishi";
import { draw } from "@johnmorrisdotca/tobiishi/draw";

const { game } = classicEnglish();
const svg = draw(jumpAt(game, 4, 16), { material: "wood", selected: 16, title: "After one jump" });
console.log(svg.length, svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450"')); // 8058 true
```

### A look of your own

Pick a material and override any of its five colours (`board`, `hole`, `peg`, `edge`, `accent`).

```ts
import { classicTriangle } from "@johnmorrisdotca/tobiishi";
import { MATERIALS, THEMES, draw } from "@johnmorrisdotca/tobiishi/draw";

const { game } = classicTriangle();
console.log(MATERIALS.join(", "), THEMES.glass.peg);   // stone, wood, glass #579caa
const svg = draw(game, { material: "stone", theme: { peg: "#2f5d4a", accent: "#8a1c1c" } });
console.log(svg.includes("#2f5d4a"), svg.includes("#8a1c1c"));   // true true
```

### Mark an assisted run

The built-in hint marks the game `helped`, and the mark survives moves, Undo, saves and restores, and clears on Restart or a new challenge. A host can set it for hints of its own.

```ts
import { classicEnglish, gameCode, gameFromCode, markHelped, restart } from "@johnmorrisdotca/tobiishi";

const helped = markHelped(classicEnglish().game);
console.log(helped.helped, gameFromCode(gameCode(helped))?.helped, restart(helped).helped); // true true false
```

### Listen to the board

```ts no-run
import "@johnmorrisdotca/tobiishi/element/define";

const board = document.createElement("tobiishi-game");
board.setAttribute("shape", "star");
board.setAttribute("seed", "2026-10-06");
board.addEventListener("tobiishi-change", (event) => {
  const game = (event as CustomEvent).detail;   // the new immutable game
  console.log(game.history.length, game.pegs.filter(Boolean).length);
});
document.body.append(board);
```

### Only the board, for a page of your own

`justBoard` keeps the board and its status line and leaves the controls to the host, which drives the player with `setGame`.

```ts no-run
import { classicEnglish, restart, undo } from "@johnmorrisdotca/tobiishi";
import { mount } from "@johnmorrisdotca/tobiishi/play";

const host = document.querySelector<HTMLElement>("#game")!;
const player = mount(host, { challenge: classicEnglish(), justBoard: true, language: "en" });
document.querySelector("#undo")!.addEventListener("click", () => player.setGame(undo(player.getGame())));
document.querySelector("#again")!.addEventListener("click", () => player.setGame(restart(player.getGame())));
```

## Boards

- **English cross:** the traditional 33-hole board, empty centre, finish at centre.
- **Triangle:** the classic 15-hole triangular lattice, empty apex; finish in any hole. Six jump directions.
- **European:** a 37-hole board; seeded challenges with a specified final hole.
- **Diamond:** a compact 25-hole board; seeded challenges.
- **Heart:** a 40-hole heart outline on a square lattice; generated partial challenges.
- **Star:** a 49-hole star outline on a square lattice; generated partial challenges.
- **Hexagon:** a 37-hole hexagonal outline on a triangular lattice; six jump directions and generated partial challenges.
- **Wide:** a 9 × 5 rectangle; generated partial challenges.
- **Tall:** a 5 × 9 rectangle; generated partial challenges.

`rectangleBoard(width, height)` supplies other square-lattice rectangles (at least
3 holes per side, at most 32 per side and 128 holes overall). Pass its result to
`generate` and supply the returned challenge to the player. `makeBoard` also
supports custom integer-coordinate outlines; the SVG bounds follow their geometry.

All modes other than the two classic starts begin with a partial board, generated backward from
one peg. Each includes an independently replayable answer. They do **not** claim
to reproduce every traditional single-vacancy start. In particular, the European
centre-vacancy/centre-finish problem is impossible under ordinary orthogonal rules.
A requested challenge length is a maximum; if backward growth stalls, the best
of 160 deterministic attempts is returned. Inspect `answer.length` for actual length.

### Short goal challenge packs

The demo also has nine named board packs, one for each built-in shape. Each pack
offers three distinct target holes and three short levels: 3, 6, or 9 jumps.
Choose the board pack, difficulty, and target hole before starting. Every one of
the 81 combinations has a deterministic original starting layout and a complete
legal witness sequence; the built-in Hint follows that witness. Difficulty here
means the length of the witness, not a claim about solving skill. Challenge saves
keep the selected pack, goal, difficulty, current game and assisted flag on the
device. Sharing the challenge URL restores the named starting challenge.

```ts
import { generateTobiishiChallenge } from '@johnmorrisdotca/tobiishi';

const challenge = generateTobiishiChallenge('wide', 'north', 'medium');
// challenge.game.target names the North lane; challenge.answer has six legal jumps.
```

The pack definitions are in `src/challenges.ts`; tests replay every witness and
check that its final peg occupies the selected hole.

### The engine

```ts
import { classicEnglish, jumpAt, legalJumps, undo,
  gameCode, gameFromCode, isGameSolved, solve,
  makeBoard, newGame, generate } from '@johnmorrisdotca/tobiishi';
let game = classicEnglish().game;
const jump = legalJumps(game)[0]!;
game = jumpAt(game, jump.from, jump.to);
game = undo(game);
const restored = gameFromCode(gameCode(game));
const result = solve(game, 100000); // solved | impossible | limit
```

Cells are integer `(x,y)` coordinates. Square boards use horizontal/vertical
jumps. Triangular boards also permit `(1,1)` and `(-1,-1)`; drawing maps these
to an equilateral lattice. A jump crosses exactly one existing hole.
`makeBoard(name, cells, lattice)` creates validated frozen geometry;
`newGame(board, booleanPegs, target)` copies and freezes pieces. Null target
accepts any last hole. Every successful move produces a new game; illegal moves
return the original reference. Save format version 1 rebuilds the board and
replays legal moves, rejecting an invalid history. Saves do not authenticate
scores and are not an anti-cheat protocol. `game.helped` becomes true only when
the built-in player shows a proved hint, survives moves, undo and saved-game
restoration, and resets on restart or a new challenge. The hint emits `onChange`
so a host can persist this field and apply its assisted-scoring policy. Legacy
version-1 saves without `helped` restore as false. Hosts supplying their own
proved hints can call `markHelped(game)` and `player.setGame` explicitly.

`solve` is synchronous and bounded. Large positions can reach the limit and
should be solved in a worker for generous budgets. `limit` is not an assertion
that a position is impossible. No optimality or unique-solution claim is made.

### Draw and custom element

```ts
import { classicEnglish } from '@johnmorrisdotca/tobiishi';
import { draw } from '@johnmorrisdotca/tobiishi/draw';
const game = classicEnglish().game;
const svg = draw(game, { material: 'wood', title: 'My board' });
```

```html
<script type="module">
  import '@johnmorrisdotca/tobiishi/element/define';
</script>
<tobiishi-game shape="triangle" seed="2026-10-06" language="ja"></tobiishi-game>
```

Or import `defineTobiishi` from `/element` and register an explicit tag.
The element dispatches `tobiishi-change` with the immutable game in `detail`.
Changing its attributes starts a new player. Each vanilla mount owns its DOM
and can be cleaned up independently. The core and draw entries do not access
the DOM, so server rendering and workers can import them safely.

`mount(host, { settingsHost })` optionally places the board and piece settings in a separate host, as the demo does beside its felt panel; the action controls remain with the board.

The `seed` is any text, and the same text gives the same challenge. It is read only for the boards that begin from a generated challenge: the English cross and the triangle begin from their classic positions whatever the seed. The package never reads the date, so a challenge of the day is `seed="2026-10-06"`, written by the page.

## API

Every export of every entry point is in the [complete API reference](https://johnmorrisdotca.github.io/tobiishi/api.html), built from the source signatures. The [API guide](docs/API.md) explains the engine, drawing, player and browser tag.

### Entry points

| Entry | Purpose |
| --- | --- |
| `@johnmorrisdotca/tobiishi` | Boards, immutable play, challenges, solving and progress codes |
| `@johnmorrisdotca/tobiishi/draw` | SVG drawing and board geometry |
| `@johnmorrisdotca/tobiishi/play` | Touch, mouse and keyboard player |
| `@johnmorrisdotca/tobiishi/element` | Custom element class and registration function |
| `@johnmorrisdotca/tobiishi/element/define` | Browser-only automatic element registration |

### The calls to learn first

| Export | What it does |
| --- | --- |
| `classicEnglish()`, `classicTriangle()` | The two traditional starts, each with a complete answer |
| `challengeOf(shape, seed, jumps, goal)`, `generate(board, seed, jumps, goal)` | A seeded challenge grown backward from one peg, with its answer |
| `generateTobiishiChallenge(pack, goal, difficulty)` | One of the 81 named goal challenges |
| `boardOf(shape)`, `rectangleBoard(w, h)`, `makeBoard(name, cells, lattice)` | A built-in board, a rectangle, or a board of your own |
| `newGame(board, pegs, target)` | A validated position, with the hole the last peg must end in or `null` |
| `legalJumps(game)`, `jumpAt(game, from, to)`, `undo`, `restart` | Play, as pure functions |
| `isGameSolved`, `isGameStuck`, `pegCount` | What a position amounts to |
| `gameCode(game)`, `gameFromCode(code)` | A versioned save, rebuilt by replaying its jumps |
| `solve(game, maxNodes)` | A bounded search that answers `solved`, `impossible` or `limit` |
| `markHelped(game)` | Mark a run as assisted |
| `draw(game, options)` | The board as SVG text |
| `mount(host, options)` | The player, in one call |

## Theming

`material` is `stone`, `wood` or `glass`, and a partial `theme` (`board`, `hole`, `peg`, `edge`, `accent`) overrides any of its colours. The player's own controls read the page's custom properties `--ink`, `--surface`, `--rule`, `--accent` and `--font`, with the family's colours as the fallback, so one line of CSS on a parent restyles them. The stone board uses the family's ivory, ink and accent palette and a brass frame; wood and glass keep their own piece materials.

| Material | `board` | `hole` | `peg` | `edge` | `accent` |
| --- | --- | --- | --- | --- | --- |
| `stone` | `#f4efe4` | `#6b6f68` | `#1f2320` | `#141614` | `#b5452c` |
| `wood` | `#e2ba7a` | `#725640` | `#ab633a` | `#633b25` | `#b5452c` |
| `glass` | `#fbf8f1` | `#6b6f68` | `#579caa` | `#265865` | `#b5452c` |

| Custom property | What it colours | Fallback |
| --- | --- | --- |
| `--ink` | text and the buttons' text | `#1f2320` |
| `--surface` | the buttons and menus | `#fbf8f1` |
| `--rule` | their borders | `#ddd6c6` |
| `--accent` | the focus ring, the chosen peg and the jumps it can make | `#b5452c` |
| `--font` | the player's type | the system's own |

```css
tobiishi-game { --accent: #8a1c1c; --surface: #fffdf8; }
```

## Limits

- A rectangle has at least 3 holes per side, at most 32 per side and 128 holes overall.
- `solve` is synchronous and bounded: it answers `solved`, `impossible` or `limit`, and `limit` is not an assertion that a position is impossible. Solve large positions in a worker.
- No optimality or unique-solution claim is made, and a saved game does not authenticate a score: it is not an anti-cheat protocol.
- Apart from the two classic starts (the English cross and the triangle), a game begins from a generated partial position grown backward from one peg, and a requested challenge length is a maximum: inspect `answer.length` for the actual length.
- A board has at most 128 holes, and a name of at most 100 characters; a coordinate is an integer from -100 to 100.
- A saved game of more than 50,000 characters, or of more than 127 jumps, is refused.

## Accessibility

- **Every hole is a button.** Each hole is a real `button` with a label that says what is in it and where: "Peg 3, 4", "Empty hole 3, 4", and ", goal" on the goal hole, in the player's language. The chosen peg is `aria-pressed`. The drawing itself is hidden from a screen reader, so the buttons are what it hears.
- **The keyboard.** Tab goes into the board once, to one hole; the arrow keys then move through the holes in reading order (right and down go to the next, left and up to the previous, wrapping round at the ends); Enter or Space chooses a peg and then the hole it jumps to; Escape clears the choice. There is no drag.
- **The state is spoken.** The line under the board is a `role="status"` live region (`aria-live="polite"`): it says how many pegs are left, "Jump made.", when the game is solved and when no jump remains, so each change is heard without moving focus. The hint's answer is spoken there too.
- **Colour is not the only cue.** The goal is a dotted ring and the chosen peg a solid one, and a hole's label says what is in it. The holes a chosen peg can reach are outlined, but a screen reader is not told which they are: it can try a hole, and a jump that is not legal does nothing.
- **Contrast.** On the `stone` board a peg is 13.9:1 against the board and the accent ring 4.8:1. The `wood` and `glass` pegs are 2.5:1 and 2.9:1 against their boards, under the 3:1 that WCAG 2.2 asks of a graphic, so `stone` is the default and the material to use where that matters.
- **Touch targets.** Buttons and menus are at least 44 px high. A hole is a button about 10% of the board's width: 64 px on the English cross at the player's full width of 600 px, but about 28 px on a phone on a board nine holes across (the heart, the wide board), which is under the 44 px that is the usual minimum. The buttons of two neighbouring holes do not overlap, but the gap between them is only a fifth of a hole's width, so on a phone a tap can land on the wrong hole. It is a known shortfall.
- **Reduced motion.** Nothing in the drawing or the player moves, so `prefers-reduced-motion` has nothing to change.
- **Language.** The player's words are English and Japanese, chosen by `language`; set the host page's `lang` to match.

## Browser support

Any current browser with SVG, ES modules and custom elements: Chrome, Edge, Firefox and Safari, on a phone or a desk. The demo's browser tests run in Chromium. The core and draw entries need no DOM, and development needs Node 22 or later.

## Languages

The player's words are English and Japanese, chosen with the `language` option or attribute. The Japanese has not been reviewed by a native reader; corrections to it are welcome as issues. Every string is `STRINGS` in `src/strings.ts`, and the names of the boards are beside them in `src/mount.ts`.

## Roadmap

The engine, the nine boards, the packs and the player are in. Nothing else is promised for a date; ideas are welcome in the [issues](https://github.com/johnmorrisdotca/tobiishi/issues). What is deliberately not planned: a score or a leaderboard (a host keeps its own, and a save is not an anti-cheat protocol), and a rule other than the single orthogonal or triangular jump over one peg.

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

## The name

*Tobiishi* (飛び石) is Japanese for stepping stones: the stones set across a garden path or a stream so that you
cross by stepping from one to the next, read とびいし, said in four beats, *to-bi-i-shi*. It is 飛ぶ (*tobu*, to
jump) and 石 (*ishi*, stone), which is what you do here, jumping from stone to stone over the one between.
([Wiktionary: 飛び石](https://en.wiktionary.org/wiki/飛び石).)

## Where it comes from, and where it is used

Peg solitaire is an old game whose rules are common property, and every board, drawing, challenge and word here is the package's own.

[Simon Tatham's Pegs](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/doc/pegs.html)
provides a useful benchmark for configurable boards and guaranteed solvability.
[George Bell's research](https://www.gibell.net/pegsolitaire/) and
[triangular boards](https://www.gibell.net/pegsolitaire/tindex.html) explain board
geometry, position classes, and the distinction between jumps and multi-jump moves.
The English witness is the mathematical move sequence of Ernest Bergholt's 1912
solution, also described by [Bell](https://www.gibell.net/pegsolitaire/English/index.html).
It is checked by replay, not treated as trusted executable code. No implementation,
artwork, or level collection from these projects has been copied.

Tobiishi was made for [Itsutsu](https://itsutsu.com), a site for board games, puzzles, card games and dice games played at your own pace. *Itsutsu* (五つ) is Japanese for "five", after five in a row, the game the site began with.

### Used by

Nothing is listed yet. Using Tobiishi in something? Open an *Add my project* issue and we will add you.

### The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Tobiishi is one of twenty-four packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).

**This package is Tobiishi.** The demos of all twenty-four share one header and footer, so each links the rest.
<!-- family:end -->

## Development

```sh
pnpm install --frozen-lockfile
pnpm check            # lint, types, tests and the presentation checks
pnpm test:package     # build, pack as npm does, install and import every entry
pnpm test:readme      # run every example in this README against the built package
pnpm test:demo        # build the demo and drive it in a real browser
pnpm screenshots:readme   # build the demo and retake the README's pictures in docs/images
pnpm demo             # serve the demo on port 6718 (PORT overrides it)
```

[Public demo](https://johnmorrisdotca.github.io/tobiishi/). The demo reuses the byte-identical `family.css` and
`family-template.mjs` of the family: shared header, footer, language
pills, cloth swatches and Help switch, and it links the repository, the npm package and the source-derived API reference.
Keyboard: Tab into the board, arrow keys move focus through holes in reading order, Enter and Space select, Escape
clears the selection. Empty destinations for the selected peg are outlined. Mouse
and touch share the same controls; the interface has no drag requirement.

The pictures in this README are in `docs/images`, taken from the built demo by `scripts/readme-pictures.mjs` on one machine, and retaken only when the look changes. They are shown by address, are not in the tarball, and `pnpm test:package` fails if one is.

## Contributing

Bug reports and pull requests are welcome in the [issues](https://github.com/johnmorrisdotca/tobiishi/issues). See [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Security policy](SECURITY.md).

## Changes

Every release is written up in [CHANGELOG.md](./CHANGELOG.md). The latest, 0.2.3, is the README made fuller: pictures of every board, runnable examples and an Accessibility section, with nothing in the package changed.

## Licence

[MIT](LICENSE) · Copyright 2026 John Morris. The original board drawings and interface ship under the same licence.
