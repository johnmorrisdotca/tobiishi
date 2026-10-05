// Verify the published archive from an empty consumer project.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const scratch = mkdtempSync(join(tmpdir(), "tobiishi-package-"));
const run = (args, cwd) => execFileSync("npm", args, { cwd, encoding: "utf8", shell: process.platform === "win32" });
try {
  const packed = JSON.parse(run(["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], process.cwd()))[0];
  const files = new Set(packed.files.map(file => file.path));
  for (const target of Object.values(pkg.exports)) for (const path of Object.values(target)) assert.ok(files.has(path.replace(/^\.\//, "")), `Archive missing ${path}`);
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
  writeFileSync(join(scratch, "package.json"), '{"type":"module","private":true}');
  run(["install", "--ignore-scripts", "--no-audit", "--no-fund", join(scratch, packed.filename)], scratch);
  const entries = Object.keys(pkg.exports).filter(entry => entry !== "./element/define").map(entry => entry === "." ? pkg.name : pkg.name + entry.slice(1));
  const smoke = `import {createRequire} from "node:module"; const require=createRequire(import.meta.url); for(const entry of ${JSON.stringify(entries)}) { await import(entry); require(entry); } const {classicEnglish, jumpAt}=await import("${pkg.name}"); let game=classicEnglish().game; for(const move of classicEnglish().answer) game=jumpAt(game,move.from,move.to); if(game.pegs.filter(Boolean).length!==1) throw Error("Witness failed");`;
  writeFileSync(join(scratch, "consumer.mjs"), smoke);
  execFileSync(process.execPath, ["consumer.mjs"], { cwd: scratch, stdio: "inherit" });
  console.log("Installed archive: all four DOM-safe entries import by ESM and require; the classic witness solves. Browser registration is tested separately.");
} finally { rmSync(scratch, { recursive: true, force: true }); }
