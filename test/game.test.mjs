import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SHAPES,
  SQUARE_STEPS,
  TRIANGLE_STEPS,
  rectangleBoard,
  boardOf,
  makeBoard,
  newGame,
  legalJumps,
  jumpAt,
  undo,
  restart,
  pegCount,
  isGameSolved,
  isGameStuck,
  markHelped,
  classicEnglish,
  classicTriangle,
  generate,
  solve,
  gameCode,
  gameFromCode,
} from "../dist/index.js";
import { draw, boundsOf, pointOf } from "../dist/draw-entry.js";
test("board geometry and exact hole counts", () => {
  for (const [shape, n] of [
    ["english", 33],
    ["european", 37],
    ["triangle", 15],
    ["diamond", 25],
  ]) {
    const b = boardOf(shape);
    assert.equal(b.cells.length, n);
    for (const j of b.jumps) {
      const [f, o, t] = [b.cells[j.from], b.cells[j.over], b.cells[j.to]];
      assert.equal(f.x + t.x, 2 * o.x);
      assert.equal(f.y + t.y, 2 * o.y);
    }
  }
});
test("classic centre-empty proof solves all 31 jumps", () => {
  const c = classicEnglish();
  let g = c.game;
  assert.equal(pegCount(g), 32);
  assert.equal(c.answer.length, 31);
  for (const j of c.answer) {
    const next = jumpAt(g, j.from, j.to);
    assert.notEqual(next, g);
    assert.equal(pegCount(next), pegCount(g) - 1);
    g = next;
  }
  assert.ok(isGameSolved(g));
  assert.equal(g.pegs[g.target], true);
  assert.deepEqual(gameFromCode(gameCode(g)), g);
});
test("every generated shape and seed has a verified proof", () => {
  for (const shape of SHAPES)
    for (let s = 0; s < 50; s++) {
      const c = generate(boardOf(shape), String(s), 12);
      assert.ok(c.answer.length > 0);
      let g = c.game;
      for (const j of c.answer) {
        const n = jumpAt(g, j.from, j.to);
        assert.notEqual(n, g);
        g = n;
      }
      assert.ok(isGameSolved(g));
      assert.deepEqual(generate(boardOf(shape), String(s), 12), c);
    }
});
test("immutable move, undo, reset, and illegal moves", () => {
  const g = classicEnglish().game;
  const before = gameCode(g);
  const j = legalJumps(g)[0];
  const moved = jumpAt(g, j.from, j.to);
  assert.equal(gameCode(g), before);
  assert.equal(jumpAt(g, -1, 99), g);
  assert.deepEqual(undo(moved), g);
  assert.deepEqual(restart(moved), g);
  assert.throws(() => {
    g.pegs[0] = false;
  });
});
test("search finds a proof, distinguishes failure and budget", () => {
  const c = generate(boardOf("triangle"), "test", 9);
  const r = solve(c.game, 100000);
  assert.equal(r.status, "solved");
  let g = c.game;
  for (const j of r.jumps) g = jumpAt(g, j.from, j.to);
  assert.ok(isGameSolved(g));
  const b = makeBoard("line", [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ]);
  assert.equal(solve(newGame(b, [true, false, true])).status, "impossible");
  assert.ok(isGameStuck(newGame(b, [true, false, true])));
  assert.equal(solve(classicEnglish().game, 1).status, "limit");
});
test("save rejects corrupt, illegal, oversized, and wrong version payloads", () => {
  const data = JSON.parse(gameCode(classicEnglish().game));
  for (const d of [
    { ...data, v: 2 },
    { ...data, start: [true] },
    { ...data, moves: [[0, 1]] },
    { ...data, moves: [[0, 1, 2]] },
    { ...data, target: -1 },
  ])
    assert.equal(gameFromCode(JSON.stringify(d)), null);
  assert.equal(gameFromCode("bad"), null);
  assert.equal(gameFromCode("a".repeat(50001)), null);
});
test("configurable cells copy inputs and validate holes", () => {
  const cells = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const b = makeBoard("custom", cells);
  cells[0].x = 9;
  assert.equal(b.cells[0].x, 0);
  assert.throws(() =>
    makeBoard("bad", [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]),
  );
  assert.throws(() => makeBoard("bad", [{ x: NaN, y: 0 }]));
  assert.throws(() => generate(b, "x", 3));
});
test("draw is deterministic and escapes user theme and title", () => {
  const g = classicEnglish().game;
  assert.equal(draw(g), draw(g));
  const svg = draw(g, { title: "<script>", theme: { peg: '"><script>' } });
  assert.ok(svg.includes("&lt;script&gt;"));
  assert.ok(!svg.includes("<script>"));
  assert.equal((svg.match(/data-cell=/g) || []).length, 33);
});

test("full triangular classic has a legal thirteen-jump solution", () => {
  const c = classicTriangle();
  assert.equal(pegCount(c.game), 14);
  assert.equal(c.answer.length, 13);
  let g = c.game;
  for (const j of c.answer) {
    const next = jumpAt(g, j.from, j.to);
    assert.notEqual(next, g);
    g = next;
  }
  assert.ok(isGameSolved(g));
});

test("assisted runs survive moves, undo and saves; restart and legacy saves start clean", () => {
  const original = classicEnglish().game;
  assert.equal(original.helped, false);
  const helped = markHelped(original);
  assert.equal(helped.helped, true);
  assert.equal(original.helped, false);
  const jump = legalJumps(helped)[0];
  const moved = jumpAt(helped, jump.from, jump.to);
  assert.equal(moved.helped, true);
  assert.equal(undo(moved).helped, true);
  assert.deepEqual(gameFromCode(gameCode(moved)), moved);
  assert.equal(restart(moved).helped, false);
  const legacy = JSON.parse(gameCode(moved));
  delete legacy.helped;
  assert.equal(gameFromCode(JSON.stringify(legacy)).helped, false);
  for (const invalid of [null, 1, "false"]) {
    assert.equal(gameFromCode(JSON.stringify({ ...legacy, helped: invalid })), null);
  }
});

test("shaped outlines are connected, have usable jumps, and fit their SVG bounds", () => {
  const counts = {
    english: 33,
    triangle: 15,
    european: 37,
    diamond: 25,
    heart: 40,
    star: 49,
    hexagon: 37,
    wide: 45,
    tall: 45,
  };
  for (const shape of SHAPES) {
    const board = boardOf(shape);
    assert.equal(board.cells.length, counts[shape]);
    const steps = board.lattice === "triangle" ? TRIANGLE_STEPS : SQUARE_STEPS;
    const reached = new Set([0]),
      queue = [0];
    while (queue.length) {
      const cell = board.cells[queue.shift()];
      for (const [dx, dy] of steps) {
        const next = board.cells.findIndex((c) => c.x === cell.x + dx && c.y === cell.y + dy);
        if (next >= 0 && !reached.has(next)) {
          reached.add(next);
          queue.push(next);
        }
      }
    }
    assert.equal(reached.size, board.cells.length, `${shape} must have no disconnected holes`);
    const usable = new Set(board.jumps.flatMap((j) => [j.from, j.over, j.to]));
    assert.equal(usable.size, board.cells.length, `${shape} must have no hole absent from every jump`);
    const game = generate(board, "bounds", 12).game,
      bounds = boundsOf(game);
    for (let cell = 0; cell < board.cells.length; cell++) {
      const point = pointOf(game, cell);
      assert.ok(point.x >= 24 && point.y >= 24 && point.x + 24 <= bounds.width && point.y + 24 <= bounds.height);
    }
    if (shape === "wide") assert.ok(bounds.width > bounds.height);
    if (shape === "tall") assert.ok(bounds.height > bounds.width);
    assert.equal(board.lattice === "triangle", ["triangle", "hexagon"].includes(shape));
  }
});
test("custom wide and tall rectangles generate replayable challenges and reject invalid sizes", () => {
  for (const [width, height] of [
    [11, 5],
    [5, 11],
    [16, 8],
  ]) {
    const board = rectangleBoard(width, height);
    assert.equal(board.cells.length, width * height);
    for (let seed = 0; seed < 10; seed++) {
      const challenge = generate(board, String(seed), 12);
      let game = challenge.game;
      for (const jump of challenge.answer) {
        const next = jumpAt(game, jump.from, jump.to);
        assert.notEqual(next, game);
        game = next;
      }
      assert.ok(isGameSolved(game));
      assert.deepEqual(gameFromCode(gameCode(game)), game);
    }
  }
  for (const [width, height] of [
    [2, 5],
    [5, 2],
    [33, 3],
    [12, 12],
    [NaN, 5],
    [5.5, 4],
  ])
    assert.throws(() => rectangleBoard(width, height), RangeError);
});
