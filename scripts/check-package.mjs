import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0);
for (const [entry, target] of Object.entries(pkg.exports)) {
  await access(target.types);
  await access(target.import);
  if (entry !== "./element/define") await import("../" + target.import);
}
console.log(
  "All exports and declarations resolve; core/draw/play/element imports are safe without a DOM. No runtime dependencies.",
);
