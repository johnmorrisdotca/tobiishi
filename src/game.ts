import { makeBoard, type Board, type Jump } from "./board.js";
/** Immutable peg position, target, move history, and assistance marker.
 *
 * @example
 * ```ts
 * import { makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 * import type { Game } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * const value: Game = game;
 * console.log(value);
 * ```
 */
export type Game = Readonly<{
  board: Board;
  start: readonly boolean[];
  pegs: readonly boolean[];
  target: number | null;
  history: readonly Jump[];
  /** Whether a proved hint has been shown during this run. */
  helped: boolean;
}>;

/** A game owns its board and pieces. A target of null permits any last hole. */
/** Creates a validated immutable position with the given target hole, if any.
 *
 * @param board - The validated native board and all its legal jump triples.
 * @param pegs - One boolean per native hole; at least one peg must be present.
 * @param target - The required final hole index, or null to permit any final hole.
 * @returns Creates a validated immutable position with the given target hole, if any. The game’s target is null when any final hole is permitted.
 * @example
 * ```ts
 * import { makeBoard, newGame, pegCount } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * console.log(pegCount(newGame(board,[true,true,false],2)));
 * ```
 */
export function newGame(board: Board, pegs: readonly boolean[], target: number | null = null): Game {
  if (
    pegs.length !== board.cells.length ||
    !pegs.every((p) => typeof p === "boolean") ||
    !pegs.some(Boolean) ||
    (target !== null && (!Number.isInteger(target) || target < 0 || target >= pegs.length))
  )
    throw new RangeError("Invalid position");
  const ownBoard = makeBoard(board.name, board.cells, board.lattice);
  const start = Object.freeze([...pegs]);
  return Object.freeze({ board: ownBoard, start, pegs: start, target, history: Object.freeze([]), helped: false });
}
/** Lists legal jumps from the current position.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Lists legal jumps from the current position.
 * @example
 * ```ts
 * import { legalJumps, makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(legalJumps(game));
 * ```
 */
export function legalJumps(game: Game): Jump[] {
  return game.board.jumps.filter((j) => game.pegs[j.from] && game.pegs[j.over] && !game.pegs[j.to]);
}
/** Counts pegs remaining on the board.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Counts pegs remaining on the board.
 * @example
 * ```ts
 * import { makeBoard, newGame, pegCount } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(pegCount(game));
 * ```
 */
export function pegCount(game: Game): number {
  return game.pegs.filter(Boolean).length;
}
/** Checks whether one peg remains at the required target, if any.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Checks whether one peg remains at the required target, if any.
 * @example
 * ```ts
 * import { isGameSolved, jumpAt, makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(isGameSolved(jumpAt(game,0,2)));
 * ```
 */
export function isGameSolved(game: Game): boolean {
  return pegCount(game) === 1 && (game.target === null || game.pegs[game.target] === true);
}
/** Checks whether no legal continuation remains before the goal is reached.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Checks whether no legal continuation remains before the goal is reached.
 * @example
 * ```ts
 * import { isGameStuck, makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(isGameStuck(game));
 * ```
 */
export function isGameStuck(game: Game): boolean {
  return !isGameSolved(game) && legalJumps(game).length === 0;
}
/** Invalid jumps leave a game unchanged; a valid jump removes exactly one peg.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @param from - The occupied starting hole’s native index.
 * @param to - The empty destination hole’s native index.
 * @returns Invalid jumps leave a game unchanged; a valid jump removes exactly one peg. The game’s target is null when any final hole is permitted.
 * @example
 * ```ts
 * import { jumpAt, makeBoard, newGame, pegCount } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(pegCount(jumpAt(game,0,2)));
 * ```
 */
export function jumpAt(game: Game, from: number, to: number): Game {
  const jump = legalJumps(game).find((j) => j.from === from && j.to === to);
  if (!jump) return game;
  const pegs = [...game.pegs];
  pegs[jump.from] = false;
  pegs[jump.over] = false;
  pegs[jump.to] = true;
  return Object.freeze({ ...game, pegs: Object.freeze(pegs), history: Object.freeze([...game.history, jump]) });
}
/** Returns the previous position, or the same game when history is empty.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Returns the previous position, or the same game when history is empty. The game’s target is null when any final hole is permitted.
 * @example
 * ```ts
 * import { jumpAt, makeBoard, newGame, pegCount, undo } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(pegCount(undo(jumpAt(game,0,2))));
 * ```
 */
export function undo(game: Game): Game {
  const jump = game.history.at(-1);
  if (!jump) return game;
  const pegs = [...game.pegs];
  pegs[jump.from] = true;
  pegs[jump.over] = true;
  pegs[jump.to] = false;
  return Object.freeze({ ...game, pegs: Object.freeze(pegs), history: Object.freeze(game.history.slice(0, -1)) });
}
/** Restores the original peg arrangement and clears moves and assistance.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Restores the original peg arrangement and clears moves and assistance. The game’s target is null when any final hole is permitted.
 * @example
 * ```ts
 * import { jumpAt, makeBoard, newGame, pegCount, restart } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(pegCount(restart(jumpAt(game,0,2))));
 * ```
 */
export function restart(game: Game): Game {
  return newGame(game.board, game.start, game.target);
}
/** Mark an assisted run without changing pieces or history. Undo keeps this flag.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Mark an assisted run without changing pieces or history. Undo keeps this flag. The game’s target is null when any final hole is permitted.
 * @example
 * ```ts
 * import { makeBoard, markHelped, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(markHelped(game).helped);
 * ```
 */
export function markHelped(game: Game): Game {
  return game.helped ? game : Object.freeze({ ...game, helped: true });
}
/** Versioned save: replay, rather than accepting a claimed final position.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Versioned save: replay, rather than accepting a claimed final position.
 * @example
 * ```ts
 * import { gameCode, makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(gameCode(game));
 * ```
 */
export function gameCode(game: Game): string {
  return JSON.stringify({
    v: 1,
    board: { name: game.board.name, cells: game.board.cells, lattice: game.board.lattice },
    start: game.start,
    target: game.target,
    helped: game.helped,
    moves: game.history.map((j) => [j.from, j.to]),
  });
}
/** Validates and replays a versioned save string, returning null if invalid.
 *
 * @param code - A versioned native save string to validate and replay.
 * @returns The validated and replayed native game, or null for malformed, unsupported or illegal saved data.
 * @example
 * ```ts
 * import { gameCode, gameFromCode, makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(gameFromCode(gameCode(game))?.pegs);
 * ```
 */
export function gameFromCode(code: string): Game | null {
  try {
    if (code.length > 50000) return null;
    const data = JSON.parse(code);
    if (
      data.v !== 1 ||
      !Array.isArray(data.moves) ||
      data.moves.length > 127 ||
      (data.helped !== undefined && typeof data.helped !== "boolean")
    )
      return null;
    let game = newGame(makeBoard(data.board.name, data.board.cells, data.board.lattice), data.start, data.target);
    for (const move of data.moves) {
      if (!Array.isArray(move) || move.length !== 2 || !move.every(Number.isInteger)) return null;
      const next = jumpAt(game, move[0], move[1]);
      if (next === game) return null;
      game = next;
    }
    return data.helped === true ? markHelped(game) : game;
  } catch {
    return null;
  }
}
