// Builds the demo for GitHub Pages into ./site: the page, written here from the family's shared head, header and
// footer, with the family's stylesheet, Tobiishi's own, the page's script and the compiled library beside it.
// The same page is written to demo/index.html (not tracked) for `pnpm demo`, which serves the repository root.
import { writeFile, mkdir, cp } from "node:fs/promises";
import { FAMILY_SCRIPT, familyHead, familyHeader, familyFooter, familyUnreviewed } from "./family-template.mjs";
import { API_CSS, apiPage } from "./api.mjs";

const id = "tobiishi";
const icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%232f5d4a'/%3E%3Ctext x='50' y='68' font-size='34' text-anchor='middle' fill='%23f3efe4'%3E飛び石%3C/text%3E%3C/svg%3E";
const head = familyHead({
  id,
  title: "Tobiishi 飛び石 · Peg solitaire",
  description: "Peg solitaire on nine boards, with configurable stones and seeded solvable challenges. Free and open source, in English and Japanese.",
});
const page = `<!doctype html><html lang="en"><head>${head}<link rel="icon" href="${icon}"><link rel="stylesheet" href="demo/family.css"><link rel="stylesheet" href="demo/tobiishi.css"></head><body><main>${familyHeader({ id, links: [{ href: "api.html", say: "pageApi" }] })}<div class="layout"><aside><h2 data-say="settings"></h2><section class="challenge-pack fam-row" data-help-en="Pick a board pack, how hard it is and the hole the last peg must end in, then play that challenge." data-help-ja="盤のパック、むずかしさ、最後の石を残す穴を選んで、その問題を始めます。"><h3 data-say="challengePacks"></h3><label><span data-say="boardPack"></span><select id="challenge-pack"></select></label><label><span data-say="difficulty"></span><select id="challenge-difficulty"><option value="easy" data-say="easy"></option><option value="medium" data-say="medium"></option><option value="hard" data-say="hard"></option></select></label><label><span data-say="goalHole"></span><select id="goal-hole"></select></label><button class="fam-button" id="play-goal" type="button" data-say="playGoal"></button><p id="challenge-status" aria-live="polite"></p></section><div id="settings"></div><p data-say="instructions"></p></aside><section class="fam-felt game-screen" aria-label="Peg solitaire"><div class="panel-head"><h2 data-say="gameTitle"></h2></div><div id="game"></div></section></div>${familyUnreviewed({ id })}${familyFooter({ id })}</main><script>${FAMILY_SCRIPT}</script><script type="module" src="demo/demo.js"></script></body></html>`;
await writeFile("demo/index.html", page);

await mkdir("site", { recursive: true });
await cp("demo", "site/demo", { recursive: true });
await cp("dist", "site/dist", { recursive: true });
await cp("README.md", "site/README.md");
await cp("LICENSE", "site/LICENSE");
await writeFile("site/index.html", page);

await cp("demo/family.css", "site/family.css");
await writeFile("site/api.css", API_CSS);
await writeFile("site/api.html", apiPage({ id, name: "Tobiishi", icon }));
