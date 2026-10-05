import { writeFile, mkdir, cp } from "node:fs/promises";
import { FAMILY_SCRIPT, familyHead, familyHeader, familyFooter } from "./family-template.mjs";
// The shared family list is unchanged. This local adapter names an unpublished member.
const header = familyHeader({ id: "suido" })
  .replace('<h1>Suido<span lang="ja">水道</span></h1>', '<h1>Tobiishi<span lang="ja">飛び石</span></h1>')
  .replace("https://github.com/johnmorrisdotca/suido#the-name", "../README.md")
  .replace(
    '<a href="https://github.com/johnmorrisdotca/suido">GitHub</a>',
    '<a href="../README.md" data-say="readme"></a>',
  )
  .replace('<a href="https://www.npmjs.com/package/@johnmorrisdotca/suido">npm</a>', "");
const footer = familyFooter({ id: "suido" })
  .replace("<code>npm install @johnmorrisdotca/suido</code>", '<span data-say="release"></span>')
  .replace("https://github.com/johnmorrisdotca/suido/blob/main/LICENSE", "../LICENSE")
  .replace(' aria-current="page"', "");
const page = `<!doctype html><html lang="en"><head>${familyHead({ id: "suido", title: "Tobiishi 飛び石 · Peg solitaire", description: "Peg solitaire on nine boards, with configurable stones and seeded solvable challenges." })}<link rel="stylesheet" href="demo/family.css"><link rel="stylesheet" href="demo/tobiishi.css"></head><body><main>${header}<div class="layout"><aside><h2 data-say="settings"></h2><section class="challenge-pack fam-row"><h3 data-say="challengePacks"></h3><label><span data-say="boardPack"></span><select id="challenge-pack"></select></label><label><span data-say="difficulty"></span><select id="challenge-difficulty"><option value="easy" data-say="easy"></option><option value="medium" data-say="medium"></option><option value="hard" data-say="hard"></option></select></label><label><span data-say="goalHole"></span><select id="goal-hole"></select></label><button class="fam-button" id="play-goal" type="button" data-say="playGoal"></button><p id="challenge-status" aria-live="polite"></p></section><div id="settings"></div><p data-say="instructions"></p></aside><section class="fam-felt game-screen" aria-label="Peg solitaire"><div class="panel-head"><h2 data-say="gameTitle"></h2></div><div id="game"></div></section></div><p class="unreviewed" id="unreviewed" lang="ja" hidden>この日本語は、まだ日本語を母語とする方の確認を受けていません。</p>${footer}</main><script>${FAMILY_SCRIPT}</script><script type="module" src="demo/demo.js"></script></body></html>`;
await writeFile("demo/index.html", page);

await mkdir("site", { recursive: true });
await cp("demo", "site/demo", { recursive: true });
await cp("dist", "site/dist", { recursive: true });
await cp("README.md", "site/README.md");
await cp("LICENSE", "site/LICENSE");
await writeFile("site/index.html", page.replaceAll("../README.md", "README.md").replaceAll("../LICENSE", "LICENSE"));
