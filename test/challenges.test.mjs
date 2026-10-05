import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOBIISHI_CHALLENGE_PACKS,
  generateTobiishiChallenge,
  isGameSolved,
  pegCount,
} from "../dist/index.js";

const expectedJumps = { easy: 3, medium: 6, hard: 9 };

test("every named goal and difficulty has a complete legal witness", () => {
  const layouts = new Set();
  for (const [packKey, pack] of Object.entries(TOBIISHI_CHALLENGE_PACKS)) {
    assert.equal(pack.goals.length, 3, `${packKey} has three distinct goals`);
    for (const goal of pack.goals) {
      for (const [difficulty, jumpCount] of Object.entries(expectedJumps)) {
        const challenge = generateTobiishiChallenge(packKey, goal.id, difficulty);
        assert.equal(challenge.game.board.name, pack.shape);
        assert.equal(challenge.game.target, challenge.game.board.cells.findIndex(cell => cell.x === goal.x && cell.y === goal.y));
        assert.equal(challenge.answer.length, jumpCount);
        assert.equal(pegCount(challenge.game), jumpCount + 1);
        let pegs = [...challenge.game.pegs];
        for (const jump of challenge.answer) {
          assert.equal(challenge.game.board.jumps.some(candidate => candidate.from === jump.from && candidate.over === jump.over && candidate.to === jump.to), true);
          assert.equal(pegs[jump.from], true, "the jumping hole holds a peg");
          assert.equal(pegs[jump.over], true, "the crossed hole holds a peg");
          assert.equal(pegs[jump.to], false, "the destination is empty");
          pegs[jump.from] = false;
          pegs[jump.over] = false;
          pegs[jump.to] = true;
        }
        assert.equal(pegs.filter(Boolean).length, 1);
        assert.equal(pegs[challenge.game.target], true, "the final peg occupies the selected goal");
        assert.equal(isGameSolved({ ...challenge.game, pegs }), true);
        layouts.add(`${packKey}:${goal.id}:${challenge.game.start.map(Boolean).map(value => Number(value)).join("")}`);
        assert.deepEqual(generateTobiishiChallenge(packKey, goal.id, difficulty), challenge, "the same pack entry is repeatable");
      }
    }
  }
  assert.equal(layouts.size, 81, "goal and level entries produce distinct witnessed starts");
});

test("goal challenges reject unknown entries and classic shapes without the named hole", () => {
  assert.throws(() => generateTobiishiChallenge("english", "not-a-goal", "easy"), RangeError);
  assert.throws(() => generateTobiishiChallenge("english", "centre", "expert"), RangeError);
});
