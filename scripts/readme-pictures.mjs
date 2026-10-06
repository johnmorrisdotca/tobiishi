// Takes the pictures the README shows, from the built demo in `site/`: `pnpm screenshots:readme` (builds the demo, then runs this).
// The family's standard is in johnmorrisdotca/.github (README-STANDARD.md); the shared part is readme-pictures-lib.mjs.
// The page is served to a browser without a port and never fetched from the live site. Every board is the one the demo opens
// on when it is chosen from the board menu, whose challenges are seeded, so two runs give the same pictures.
// Output: docs/images/<subject>-<desk|phone>-<light|dark>.webp.
import { takePictures } from "./readme-pictures-lib.mjs";

const BOARD = ".tobiishi .board";

/** Choose a board in the demo's board menu and wait for it to be drawn. */
const choose = (shape, material) => async (page) => {
  await page.locator('[data-action="shape"]').selectOption(shape);
  if (material) await page.locator('[data-action="material"]').selectOption(material);
  await page.waitForSelector(`${BOARD} svg`);
};

/** One board, cropped to the board. */
const board = (subject, shape, material) => ({ subject, views: ["desk"], scale: 2, ready: `${BOARD} svg`, target: BOARD, prepare: choose(shape, material) });

await takePictures({
  shots: [
    // The page from the top, on a desk: the English cross after its first jump. On a phone, in Japanese, the heart board.
    {
      subject: "hero",
      views: ["desk", "phone"],
      height: 1100,
      ready: `${BOARD} svg`,
      async prepare(page, { view }) {
        if (view === "phone") {
          await page.getByRole("button", { name: "日本語", exact: true }).click();
          await choose("heart")(page);
          await page.locator(".game-screen").evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 8));
        } else {
          const move = await page.evaluate(async () => (await import("/dist/index.js")).classicEnglish().answer[0]);
          await page.locator(`.cell[data-cell="${move.from}"]`).click();
          await page.locator(`.cell[data-cell="${move.to}"]`).click();
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      },
    },
    board("english", "english"),
    board("triangle", "triangle"),
    board("european", "european"),
    board("diamond", "diamond"),
    board("heart", "heart"),
    board("star", "star"),
    board("hexagon", "hexagon"),
    board("wide", "wide"),
    board("tall", "tall"),
    // The three materials, on the same hexagon.
    board("wood", "hexagon", "wood"),
    board("glass", "hexagon", "glass"),
    // A short goal challenge: the pack, the goal and the difficulty chosen, then played.
    {
      subject: "challenge",
      views: ["desk"],
      url: "/?lang=en&pack=heart&goal=north&difficulty=medium",
      ready: `${BOARD} svg`,
      target: ".layout",
    },
    // A selected peg: its empty destinations are outlined.
    {
      subject: "selected-peg",
      views: ["desk"],
      scale: 2,
      ready: `${BOARD} svg`,
      target: BOARD,
      async prepare(page) {
        await choose("english")(page);
        const move = await page.evaluate(async () => (await import("/dist/index.js")).classicEnglish().answer[0]);
        await page.locator(`.cell[data-cell="${move.from}"]`).click();
        await page.locator(".cell.legal").first().waitFor();
      },
    },
  ],
});
