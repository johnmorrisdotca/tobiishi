import { test, expect } from "@playwright/test";
test("classic play, undo, keyboard, persistence callback and reset", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("32 pegs");
  const first = await page.evaluate(async () => {
    const m = await import("/dist/index.js");
    return m.legalJumps(window.tobiishi.getGame())[0];
  });
  await page.locator(`.cell[data-cell="${first.from}"]`).click();
  const dest = await page.locator(".cell.legal").first().getAttribute("data-cell");
  await page.locator(`.cell[data-cell="${dest}"]`).click();
  await expect(page.getByRole("status")).toContainText("31 pegs");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("32 pegs");
  await page.locator('.cell[data-cell="0"]').focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('.cell[data-cell="1"]')).toBeFocused();
  await page.getByRole("button", { name: "Hint", exact: true }).click();
  await expect(page.locator('.cell[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator("#game")).toHaveAttribute("data-helped", "true");
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("32 pegs");
  expect(errors).toEqual([]);
});
test("all boards, Japanese, materials and mobile fit", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const [shape, n] of [
    ["triangle", 15],
    ["european", 37],
    ["diamond", 25],
    ["english", 33],
    ["heart", 40],
    ["star", 49],
    ["hexagon", 37],
    ["wide", 45],
    ["tall", 45],
  ]) {
    await page.getByLabel("Board", { exact: true }).selectOption(shape);
    await expect(page.locator(".cell")).toHaveCount(n);
  }
  await page.getByLabel("Pieces", { exact: true }).selectOption("glass");
  await page.getByRole("button", { name: "日本語", exact: true }).click();
  await expect(page.getByLabel("盤", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
test("engine replay completes classic through UI", async ({ page }) => {
  await page.goto("/");
  const answer = await page.evaluate(async () => (await import("/dist/index.js")).classicEnglish().answer);
  for (const j of answer) {
    await page.locator(`.cell[data-cell="${j.from}"]`).click();
    await page.locator(`.cell[data-cell="${j.to}"]`).click();
  }
  await expect(page.getByRole("status")).toContainText("Solved");
});

test("new challenges and keyboard selection work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New challenge", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("13 pegs");
  await page.getByRole("button", { name: "Hint", exact: true }).click();
  const from = await page.locator('.cell[aria-pressed="true"]').getAttribute("data-cell");
  await page.locator(`.cell[data-cell="${from}"]`).press("Escape");
  await expect(page.locator('.cell[aria-pressed="true"]')).toHaveCount(0);
});

test("named packs select a fixed goal, show its witness and restore assisted progress", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.locator("#challenge-pack").selectOption("wide");
  await page.locator("#challenge-difficulty").selectOption("easy");
  await page.locator("#goal-hole").selectOption("north");
  await page.getByRole("button", { name: "Play this challenge", exact: true }).click();
  await expect(page.locator("#challenge-status")).toContainText("Long Table");
  expect(((await page.locator("#challenge-status").textContent()) ?? "").match(/jumps/g)).toHaveLength(1);
  const selected = await page.evaluate(async () => {
    const api = await import("/dist/index.js");
    const challenge = api.generateTobiishiChallenge("wide", "north", "easy");
    return { target: window.tobiishi.getGame().target, expected: challenge.game.target, jumps: challenge.answer.length };
  });
  expect(selected.target).toBe(selected.expected);
  expect(selected.jumps).toBe(3);
  await page.getByRole("button", { name: "Hint", exact: true }).click();
  await expect(page.locator("#game")).toHaveAttribute("data-helped", "true");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("tobiishi-progress-v1")));
  expect(saved.challenge).toEqual({ pack: "wide", goal: "north", difficulty: "easy" });
  expect(saved.progress).toContain('"helped":true');
  await page.reload();
  await expect(page.locator("#game")).toHaveAttribute("data-helped", "true");
  expect(errors).toEqual([]);
});
