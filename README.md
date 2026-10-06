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

<p align="center"><a href="https://johnmorrisdotca.github.io/tobiishi/"><strong>Play a board →</strong></a> · <a href="https://johnmorrisdotca.github.io/tobiishi/api.html">API reference</a></p>

<p align="center">
  <img src="docs/desktop.jpg" alt="English cross peg solitaire on green felt with board and piece settings" width="720">
  <img src="docs/phone.jpg" alt="A heart board on a phone, with Japanese controls in dark mode" width="220">
</p>

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
import { mount } from "@johnmorrisdotca/tobiishi/play";

const player = mount(document.querySelector("#game")!, { shape: "english", language: "en", material: "stone" });
```

Or in a page, with nothing else to set up:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/tobiishi@0/dist/element-define.js"></script>
<tobiishi-game shape="triangle" seed="today" language="ja"></tobiishi-game>
```

The rules need no page at all:

```ts
import { classicEnglish, jumpAt, legalJumps } from "@johnmorrisdotca/tobiishi";

let game = classicEnglish().game;
const jump = legalJumps(game)[0]!;
game = jumpAt(game, jump.from, jump.to);   // a new game; the old one is untouched
```

## Who it is for

- Puzzle sites that need a playable board and an immutable rules engine.
- Teachers exploring jumps, board geometry and solvability.
- Players who enjoy classic crosses, triangles, hearts, stars and short goal challenges.

## Features

- **Nine boards**, from the English cross and the triangle to a heart, a star and a hexagon, and any rectangle you ask for, each with its jumps, undo and a saved-game code.
- **Seeded challenges that can be solved**, grown backward from one peg, each carrying an answer that is replayed; and nine named packs of short goal challenges, 81 in all.
- **A bounded solver**, hints along a proved answer, and a `helped` mark so a host can score assisted play apart.
- **SVG drawing** in three materials (`stone`, `wood`, `glass`), and a player for touch, mouse and keyboard, in English and Japanese.
- **A pure, immutable engine** and a custom element, with no DOM in the core, so servers and workers can import it.
- **Zero runtime dependencies.**

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

## Use it in your project

```ts
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
import { draw } from '@johnmorrisdotca/tobiishi/draw';
const svg = draw(game, { material: 'wood', title: 'My board' });
```

```html
<script type="module">
  import '@johnmorrisdotca/tobiishi/element/define';
</script>
<tobiishi-game shape="triangle" seed="today" language="ja"></tobiishi-game>
```

Or import `defineTobiishi` from `/element` and register an explicit tag.
The element dispatches `tobiishi-change` with the immutable game in `detail`.
Changing its attributes starts a new player. Each vanilla mount owns its DOM
and can be cleaned up independently. The core and draw entries do not access
the DOM, so server rendering and workers can import them safely.

`mount(host, { settingsHost })` optionally places the board and piece settings in a separate host, as the demo does beside its felt panel; the action controls remain with the board.

React and other frameworks can use the vanilla API without an adapter dependency:
mount into a ref from an effect and return `player.destroy` as cleanup. Keep
state and language changes explicit through the host or recreate the mount.

## API

Every export of every entry point is in the [complete API reference](https://johnmorrisdotca.github.io/tobiishi/api.html), built from the source signatures. The [API guide](docs/API.md) explains the engine, drawing, player and browser tag.

| Entry | Purpose |
| --- | --- |
| `@johnmorrisdotca/tobiishi` | Boards, immutable play, challenges, solving and progress codes |
| `/draw` | SVG drawing and board geometry |
| `/play` | Touch, mouse and keyboard player |
| `/element` | Custom element class and registration function |
| `/element/define` | Browser-only automatic element registration |

## Theming

`material` is `stone`, `wood` or `glass`, and a partial `theme` (`board`, `hole`, `peg`, `edge`, `accent`) overrides any of its colours. The player's own controls read the page's custom properties `--ink`, `--surface`, `--rule`, `--accent` and `--font`, with the family's colours as the fallback, so one line of CSS on a parent restyles them. The stone board uses the family's ivory, ink and accent palette and a brass frame; wood and glass keep their own piece materials.

## Limits

- A rectangle has at least 3 holes per side, at most 32 per side and 128 holes overall.
- `solve` is synchronous and bounded: it answers `solved`, `impossible` or `limit`, and `limit` is not an assertion that a position is impossible. Solve large positions in a worker.
- No optimality or unique-solution claim is made, and a saved game does not authenticate a score: it is not an anti-cheat protocol.
- Apart from the two classic starts (the English cross and the triangle), a game begins from a generated partial position grown backward from one peg, and a requested challenge length is a maximum: inspect `answer.length` for the actual length.

## Browser support

Any current browser with SVG, ES modules and custom elements: Chrome, Edge, Firefox and Safari, on a phone or a desk. The demo's browser tests run in Chromium. The core and draw entries need no DOM, and development needs Node 22 or later.

## Languages

The player's words are English and Japanese, chosen with the `language` option or attribute. Corrections to the Japanese are welcome as issues.

## Roadmap

The engine, the nine boards, the packs and the player are in. Nothing else is promised for a date; ideas are welcome in the [issues](https://github.com/johnmorrisdotca/tobiishi/issues).

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

## The name

*Tobiishi* (飛び石) is Japanese for stepping stones: the stones set across a garden path or a stream so that you
cross by stepping from one to the next, read とびいし, said in four beats, *to-bi-i-shi*. It is 飛ぶ (*tobu*, to
jump) and 石 (*ishi*, stone), which is what you do here, jumping from stone to stone over the one between.
([Wiktionary: 飛び石](https://en.wiktionary.org/wiki/飛び石).)

## Where it comes from

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
pnpm check          # lint, types, tests and the presentation checks
pnpm test:package   # build, pack as npm does, install and import every entry
pnpm test:demo      # build the demo and drive it in a real browser
pnpm demo           # serve the demo on port 6718 (PORT overrides it)
```

[Public demo](https://johnmorrisdotca.github.io/tobiishi/). The demo reuses the byte-identical `family.css` and
`family-template.mjs` of the family: shared header, footer, language
pills, cloth swatches and Help switch, and it links the repository, the npm package and the source-derived API reference.
Keyboard: Tab into the board, arrow keys move focus through holes in reading order, Enter and Space select, Escape
clears the selection. Empty destinations for the selected peg are outlined. Mouse
and touch share the same controls; the interface has no drag requirement.

## Contributing

Bug reports and pull requests are welcome in the [issues](https://github.com/johnmorrisdotca/tobiishi/issues). See [CONTRIBUTING.md](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Security policy](SECURITY.md).

## Changes

Every release is written up in [CHANGELOG.md](./CHANGELOG.md).

## Licence

[MIT](LICENSE) · Copyright 2026 John Morris. The original board drawings and interface ship under the same licence.
