# Tobiishi integration handoff

## Deliverable

Independent `@johnmorrisdotca/tobiishi` 0.1.0 release candidate. No existing
Itsutsu files, dependencies, catalogue, database, or live deployment were changed.
Keep it as its own repository under John Morris's account; no runtime dependencies.
The repository URL and npm publication should be added only after the actual
repository is created and the package name is confirmed available.

## Games to register in Itsutsu

| Suggested key | English name | Japanese name | Start and objective |
| --- | --- | --- | --- |
| peg-solitaire | Peg Solitaire | ペグ・ソリティア | English 33 holes, centre empty, finish at centre |
| triangle-pegs | Triangle Solitaire | 三角ソリティア | 15 holes, apex empty, finish anywhere |
| european-pegs | European Pegs | ヨーロッパ盤 | Seeded partial position, finish at marked goal |
| diamond-pegs | Diamond Pegs | ひし形盤 | Seeded partial position, finish at marked goal |

Each board also offers new seeded challenges generated backward from one peg.
European and diamond positions are explicitly challenges rather than assumed
single-vacancy classics. The familiar European centre-complement is impossible.

## Adapter

Use the same host pattern as Suido: pure engine imported from the main entry,
board artwork from `/draw`, and browser interaction from `/play`. React can
mount into a ref in an effect and destroy on cleanup; no React dependency is
required. Optional custom element is `/element/define`.

```
import { mount } from '@johnmorrisdotca/tobiishi/play';
import { gameFromCode, isGameSolved } from '@johnmorrisdotca/tobiishi';

const player = mount(host, {
  shape: 'english', language: 'en', material: 'stone',
  onChange(game, code) {
    // Host saves `code` and applies its own win/XP policy.
    // isGameSolved(game) includes the required final hole, when present.
    // game.helped exposes assistance for the host scoring policy.
  }
});
// player.setGame(gameFromCode(savedCode)) after checking for null.
// player.destroy() on navigation/unmount.
```

Pass `justBoard:true` when Itsutsu supplies its own title and controls. It keeps
live status and the interactive board; `getGame`/`setGame` let the host supply
undo, restart, new challenges, settings, and persistence. `theme` accepts board,
hole, peg, edge and accent colours. Holes, occupancy and goal are configurable
through `makeBoard` and `newGame`; geometry and pieces are frozen copies.

To create daily puzzles, use `generate(boardOf(shape), dateSeed, jumpBudget)`;
store the same seed and chosen board. `answer` is a replayable winning witness.
Inspect its actual length: the requested jump budget is a maximum, since some
reverse branches stall. Game saves replay every jump; host scoring must not
trust them as authentication or anti-cheat evidence. `game.helped` is false
initially and becomes true when a proved hint is shown; the player emits the
change callback immediately. Moves, undo and save restoration preserve it.
Restart/new challenge begin a fresh unassisted run. Legacy saves without this
boolean restore as false; invalid field types are rejected.

## Verification completed

- Strict TypeScript check and distribution build.
- Thirteen Node test groups: geometry, immutable move/undo/restart, invalid input,
  solver solved/impossible/limit states, corrupted saves, safe SVG escaping,
  full English 31-jump and triangle 13-jump winning witnesses.
- 450 seeded challenge witnesses independently replayed across all nine shapes.
- Every package export and declaration resolves; core/draw/play/element imports
  work in Node without browser globals; no runtime dependencies.
- npm package contents verified; the actual tarball installed into a separate
  smoke project. All main/draw/play/element imports and the complete classic
  winning replay passed through that installed package.
- Live in-app browser: English hint/jump/undo, nine shapes, three materials,
  English/Japanese, keyboard arrow focus, new diamond challenge, and all thirteen
  triangular classic jumps through actual cell clicks to the solved state.
- Visual inspection and screenshot: ../tobiishi-preview.png.

## Remaining release checks

The included four Playwright scenarios are ready for CI. Their native local
runner could not bind the loopback server from the initial subagent sandbox;
the parent agent separately encountered macOS browser bootstrap permission
limits. They have not been reported as passed. The actual UI was exercised in
the built-in browser instead. Automated 390px mobile fitting is therefore a CI
check still to run; no physical phone or screen reader certification is claimed.

Use `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:package`,
`pnpm exec playwright install chromium`, `pnpm test:browser`, then repeat the
installed tarball check on the release machine. CI repeats checks on Node 22. The solver is bounded
and synchronous; generous searches should run in a host-owned worker. Hints
follow the supplied proof instantly when possible and otherwise search only
20,000 states. Neither optimal solutions nor unique solutions are claimed.

Do not merge an adapter into Claude's active working directory until coordinated.
Publish npm/GitHub and update Itsutsu through the project's usual release flow.

## Demo family styling

The demo now reuses unchanged family.css and scripts/family-template.mjs copies
from the existing Kazu package. A local adapter supplies the new unpublished name
without modifying the shared family list or linking nonexistent package/repo
pages. The shared page palette, sans-serif header, language pills, five cloth
swatches, Help switch and footer are used. The game sits on fam-felt; chrome
inherits family surface/ink/felt variables. The stone board uses family ivory
(#f4efe4), ink (#1f2320), muted (#6b6f68), accent (#b5452c) and frame (#a98954).
Wood and glass remain material-specific pieces. Run pnpm site to rebuild the shell.

Shared styling is protected by a recorded byte-hash test. The updated Chrome
preview was inspected visually; cloth switching, Help notes, Japanese and
hint assistance callback were rechecked live. Screenshot replaced with the
family-styled board.

## Additional shaped boards

Heart (40 holes), star (49 holes), hexagon (37 holes, six jump directions), wide
(9 × 5), and tall (5 × 9) are generated partial challenges. None advertises an
unverified single-vacancy classic. All include replayable winning witnesses;
English and triangle retain their two proved classic starts. UI names and Help
descriptions are bilingual. rectangleBoard(width,height) adds configurable wide
or tall square-lattice boards (3–32 per side, at most 128 holes). Passing one as
a challenge keeps its geometry when New challenge is used. Preset connectedness,
every-hole jump participation, SVG bounds, and 30 custom-rectangle witnesses
are tested as well as 450 seeded preset witnesses.

Shape previews were checked in the live Chrome demo after the additions.
Heart, star, hexagonal outline and wide/tall choices remain on the same family
felt and use the same configured materials.
