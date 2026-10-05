import { makeBoard, type Board, type Jump } from "./board.js";
/** Immutable peg position, target, move history, and assistance marker. */
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
/** Creates a validated immutable position with the given target hole, if any. */
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
/** Lists legal jumps from the current position. */
export function legalJumps(game: Game): Jump[] {
  return game.board.jumps.filter((j) => game.pegs[j.from] && game.pegs[j.over] && !game.pegs[j.to]);
}
/** Counts pegs remaining on the board. */
export function pegCount(game: Game): number {
  return game.pegs.filter(Boolean).length;
}
/** Checks whether one peg remains at the required target, if any. */
export function isGameSolved(game: Game): boolean {
  return pegCount(game) === 1 && (game.target === null || game.pegs[game.target] === true);
}
/** Checks whether no legal continuation remains before the goal is reached. */
export function isGameStuck(game: Game): boolean {
  return !isGameSolved(game) && legalJumps(game).length === 0;
}
/** Invalid jumps leave a game unchanged; a valid jump removes exactly one peg. */
export function jumpAt(game: Game, from: number, to: number): Game {
  const jump = legalJumps(game).find((j) => j.from === from && j.to === to);
  if (!jump) return game;
  const pegs = [...game.pegs];
  pegs[jump.from] = false;
  pegs[jump.over] = false;
  pegs[jump.to] = true;
  return Object.freeze({ ...game, pegs: Object.freeze(pegs), history: Object.freeze([...game.history, jump]) });
}
/** Returns the previous position, or the same game when history is empty. */
export function undo(game: Game): Game {
  const jump = game.history.at(-1);
  if (!jump) return game;
  const pegs = [...game.pegs];
  pegs[jump.from] = true;
  pegs[jump.over] = true;
  pegs[jump.to] = false;
  return Object.freeze({ ...game, pegs: Object.freeze(pegs), history: Object.freeze(game.history.slice(0, -1)) });
}
/** Restores the original peg arrangement and clears moves and assistance. */
export function restart(game: Game): Game {
  return newGame(game.board, game.start, game.target);
}
/** Mark an assisted run without changing pieces or history. Undo keeps this flag. */
export function markHelped(game: Game): Game {
  return game.helped ? game : Object.freeze({ ...game, helped: true });
}
/** Versioned save: replay, rather than accepting a claimed final position. */
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
/** Validates and replays a versioned save string, returning null if invalid. */
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
