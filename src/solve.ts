import { jumpAt, isGameSolved, legalJumps, type Game } from "./game.js";
import type { Jump } from "./board.js";
/** Bounded search result; `limit` distinguishes unfinished search from proof. */
export type Solution = { status: "solved" | "impossible" | "limit"; jumps: Jump[]; visited: number };
/** A bounded depth-first proof search. A limit is never reported as impossibility. */
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
