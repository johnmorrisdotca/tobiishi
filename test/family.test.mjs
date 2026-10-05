import {test} from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
// Recorded against the unchanged family sources supplied by Kazu.
test("shared family CSS and template remain byte-identical", async () => {
  for (const [path, expected] of [['demo/family.css','cde9cd0c66eff59cac663759f110a074dc26a0640fd4d63c7b3cc7667b1346a0'],['scripts/family-template.mjs','38bd7b252045af5bac9ac40b873fdac3d0981ad29a3afc1dff88d5d0df0645b4']]) {
    assert.equal(createHash("sha256").update(await readFile(path)).digest("hex"), expected);
  }
});
