import { boardOf, type Board, type Jump, type Shape } from "./board.js";
import { newGame, type Game } from "./game.js";
export type Challenge = Readonly<{ game: Game; answer: readonly Jump[]; seed: string }>;
export function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (const c of seed) state = Math.imul(state ^ c.charCodeAt(0), 16777619);
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Grow backward from one peg. The reversed jumps are a proof, even on unusual boards. */
export function generate(board: Board, seed: string, jumps = 12): Challenge {
  if (!Number.isSafeInteger(jumps) || jumps < 1 || jumps >= board.cells.length)
    throw new RangeError("Invalid challenge length");
  const random = seededRandom(seed);
  let best: Challenge | null = null;
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const target = Math.floor(random() * board.cells.length);
    const pegs = board.cells.map((_, i) => i === target),
      answer: Jump[] = [];
    while (answer.length < jumps) {
      const available = board.jumps.filter((j) => !pegs[j.from] && !pegs[j.over] && pegs[j.to]);
      const jump = available[Math.floor(random() * available.length)];
      if (!jump) break;
      pegs[jump.from] = true;
      pegs[jump.over] = true;
      pegs[jump.to] = false;
      answer.unshift(jump);
    }
    const challenge = Object.freeze({ game: newGame(board, pegs, target), answer: Object.freeze(answer), seed });
    if (!best || answer.length > best.answer.length) best = challenge;
    if (answer.length === jumps) return challenge;
  }
  if (!best || best.answer.length === 0) throw new RangeError("Board has no challenge");
  return best;
}
/** The classic centre-empty English game. Bergholt's published 1912 solution is validated in tests. */
export function classicEnglish(): Challenge {
  const board = boardOf("english"),
    target = board.cells.findIndex((c) => c.x === 3 && c.y === 3);
  const paths =
    "b4-d4 c6-c4 a5-c5 d5-b5 f5-d5 e7-e5 e4-e6 c7-e7-e5 c3-c5 c1-c3 e2-e4-e6-c6-c4-c2 a3-a5-c5-e5 g3-e3 d3-f3 g5-g3-e3 e1-c1-c3 b3-d3-f3-f5-d5-d3 d2-d4";
  const index = (s: string) => board.cells.findIndex((c) => c.x === s.charCodeAt(0) - 97 && c.y === Number(s[1]) - 1);
  const answer: Jump[] = [];
  for (const path of paths.split(" ")) {
    const cells = path.split("-");
    for (let i = 1; i < cells.length; i += 1) {
      const jump = board.jumps.find((j) => j.from === index(cells[i - 1]!) && j.to === index(cells[i]!));
      if (!jump) throw new Error("Invalid classic path");
      answer.push(jump);
    }
  }
  return Object.freeze({
    game: newGame(
      board,
      board.cells.map((_, i) => i !== target),
      target,
    ),
    answer: Object.freeze(answer),
    seed: "classic",
  });
}
export function challengeOf(shape: Shape, seed = "tobiishi", jumps = 12): Challenge {
  return generate(boardOf(shape), seed, jumps);
}

/** The full fifteen-hole triangle, with the apex empty and any final hole accepted. */
export function classicTriangle(): Challenge {
  const board = boardOf("triangle");
  const pairs = [
    [3, 0],
    [5, 3],
    [0, 5],
    [6, 1],
    [9, 2],
    [11, 4],
    [12, 5],
    [1, 8],
    [2, 9],
    [14, 5],
    [5, 12],
    [13, 11],
    [10, 12],
  ];
  const answer = pairs.map(([from, to]) => board.jumps.find((j) => j.from === from && j.to === to)!);
  return Object.freeze({
    game: newGame(
      board,
      board.cells.map((_, i) => i !== 0),
    ),
    answer: Object.freeze(answer),
    seed: "classic-triangle",
  });
}
