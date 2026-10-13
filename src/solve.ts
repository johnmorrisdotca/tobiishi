import { jumpAt, isGameSolved, legalJumps, type Game } from "./game.js";
import type { Jump } from "./board.js";
/** Bounded search result; `limit` distinguishes unfinished search from proof.
 *
 * @example
 * ```ts
 * import { makeBoard, newGame, solve } from "@johnmorrisdotca/tobiishi";
 * import type { Solution } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * const value: Solution = solve(game,100);
 * console.log(value);
 * ```
 */
export type Solution = { status: "solved" | "impossible" | "limit"; jumps: Jump[]; visited: number };
/** A bounded depth-first proof search. A limit is never reported as impossibility.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @param maxNodes - A positive safe-integer search budget; exhausting it yields limit, not impossible.
 * @returns A bounded depth-first proof search. A limit is never reported as impossibility.
 * @example
 * ```ts
 * import { makeBoard, newGame, solve } from "@johnmorrisdotca/tobiishi";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(solve(game,100));
 * ```
 */
export function solve(game: Game, maxNodes = 100000): Solution {
  if (!Number.isSafeInteger(maxNodes) || maxNodes < 1) throw new RangeError("Invalid search budget");
  let visited = 0,
    limited = false;
  const dead = new Set<string>();
  function visit(position: Game): Jump[] | null {
    if (isGameSolved(position)) return [];
    if (visited >= maxNodes) {
      limited = true;
      return null;
    }
    const key = position.pegs.map((p) => (p ? "1" : "0")).join("");
    if (dead.has(key)) return null;
    visited += 1;
    for (const jump of legalJumps(position)) {
      const rest = visit(jumpAt(position, jump.from, jump.to));
      if (rest !== null) return [jump, ...rest];
      if (limited) return null;
    }
    dead.add(key);
    return null;
  }
  const jumps = visit(game);
  return { status: jumps !== null ? "solved" : limited ? "limit" : "impossible", jumps: jumps ?? [], visited };
}
