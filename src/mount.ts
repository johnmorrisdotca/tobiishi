import { SHAPES, type Shape } from "./board.js";
import { classicEnglish, classicTriangle, challengeOf, generate, type Challenge } from "./generate.js";
import {
  markHelped,
  gameCode,
  jumpAt,
  undo,
  restart,
  pegCount,
  legalJumps,
  isGameSolved,
  isGameStuck,
  type Game,
} from "./game.js";
import { draw, boundsOf, pointOf, MATERIALS, type Material, type Theme } from "./draw.js";
import { STRINGS, type Language } from "./strings.js";
import { solve } from "./solve.js";
/** Initial puzzle, display choices, optional settings host, and persistence callback. */
export type MountOptions = {
  game?: Game;
  challenge?: Challenge;
  shape?: Shape;
  seed?: string;
  challengeJumps?: number;
  language?: Language;
  material?: Material;
  theme?: Partial<Theme>;
  justBoard?: boolean;
  settingsHost?: HTMLElement;
  onChange?: (game: Game, code: string) => void;
};
/** Controls for reading, replacing, or unmounting one player instance. */
export type Player = { getGame: () => Game; setGame: (game: Game) => void; destroy: () => void };
const LABELS: Record<Shape, [string, string]> = {
  english: ["English cross", "イギリス盤"],
  triangle: ["Triangle", "三角盤"],
  european: ["European challenge", "ヨーロッパ盤チャレンジ"],
  diamond: ["Diamond challenge", "ひし形盤チャレンジ"],
  heart: ["Heart challenge", "ハート盤チャレンジ"],
  star: ["Star challenge", "星形盤チャレンジ"],
  hexagon: ["Hexagon challenge", "六角盤チャレンジ"],
  wide: ["Wide challenge · 9 × 5", "横長盤 · 9 × 5"],
  tall: ["Tall challenge · 5 × 9", "縦長盤 · 5 × 9"],
};
const SHAPE_NOTES: Record<Shape, [string, string]> = {
  english: [
    "The classic cross: jump horizontally or vertically and finish at the centre.",
    "昔ながらの十字盤。縦横に飛び越え、中央に石を1つ残します。",
  ],
  triangle: [
    "The classic triangle: six jump directions, and the last stone may be anywhere.",
    "三角盤では6方向に飛び越えます。最後の石はどの穴でもかまいません。",
  ],
  european: [
    "A generated European-board challenge. Jump horizontally or vertically; finish at the marked hole.",
    "ヨーロッパ盤の問題。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
  diamond: [
    "A generated diamond challenge. Jump horizontally or vertically; finish at the marked hole.",
    "ひし形盤の問題。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
  heart: [
    "A heart-shaped challenge. Jump horizontally or vertically; finish at the marked hole.",
    "ハート形の問題。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
  star: [
    "A star-shaped challenge. Jump horizontally or vertically; finish at the marked hole.",
    "星形の問題。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
  hexagon: [
    "A hexagonal outline with six jump directions. Finish at the marked hole.",
    "六角形の盤では6方向に飛び越えます。目印の穴に石を1つ残します。",
  ],
  wide: [
    "A wide 9 × 5 challenge. Jump horizontally or vertically; finish at the marked hole.",
    "9 × 5の横長盤。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
  tall: [
    "A tall 5 × 9 challenge. Jump horizontally or vertically; finish at the marked hole.",
    "5 × 9の縦長盤。縦横に飛び越え、目印の穴に石を1つ残します。",
  ],
};
/** Mount one independent player. The host owns persistence through onChange and setGame. */
export function mount(host: HTMLElement, options: MountOptions = {}): Player {
  let shape =
      options.shape ??
      (SHAPES.includes(options.game?.board.name as Shape) ? (options.game!.board.name as Shape) : "english"),
    material = options.material ?? "stone";
  const lang = options.language ?? "en",
    text = STRINGS[lang];
  let challenge =
    options.challenge ??
    (shape === "english"
      ? classicEnglish()
      : shape === "triangle"
        ? classicTriangle()
        : challengeOf(shape, options.seed));
  let game = options.game ?? challenge.game,
    selected: number | null = null,
    focusCell = 0,
    message = "",
    destroyed = false,
    challengeNumber = 0;
  const root = document.createElement("div");
  root.className = "tobiishi";
  host.append(root);
  function announce(next: Game): void {
    game = next;
    options.onChange?.(game, gameCode(game));
  }
  function choose(cell: number): void {
    if (selected !== null) {
      const next = jumpAt(game, selected, cell);
      if (next !== game) {
        announce(next);
        selected = null;
        message = text.move;
        render();
        return;
      }
    }
    selected = game.pegs[cell] ? cell : null;
    message = "";
    render();
  }
  function button(label: string, action: () => void): HTMLButtonElement {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fam-button";
    b.textContent = label;
    b.addEventListener("click", action);
    return b;
  }
  function render(): void {
    if (destroyed) return;
    const hadFocus = root.contains(document.activeElement) || !!options.settingsHost?.contains(document.activeElement),
      focusedAction = (document.activeElement as HTMLElement | null)?.dataset.action;
    root.replaceChildren();
    options.settingsHost?.replaceChildren();
    const style = document.createElement("style");
    style.textContent = `.tobiishi{font:16px/1.5 var(--font,system-ui,sans-serif);color:inherit;max-width:600px;margin:auto}.tobiishi *{box-sizing:border-box}.tobiishi button,.tobiishi select{font:inherit;border:1px solid var(--rule,#ddd6c6);border-radius:12px;background:var(--surface,#fbf8f1);color:var(--ink,#1f2320);padding:8px 12px;min-height:44px}.tobiishi button:focus-visible,.tobiishi select:focus-visible{outline:3px solid var(--accent,#b5452c);outline-offset:3px}.tobiishi .controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0}.tobiishi .board{position:relative;width:100%;touch-action:manipulation}.tobiishi svg{display:block;width:100%;height:auto}.tobiishi .cell{position:absolute;border:0;background:transparent;padding:0;border-radius:50%;min-height:0;aspect-ratio:1}.tobiishi .cell.legal{box-shadow:inset 0 0 0 3px var(--accent,#b5452c)}.tobiishi h2{font-weight:500;margin:0}.tobiishi .status{min-height:48px}.tobiishi [disabled]{opacity:.45}`;
    root.append(style);
    if (!options.justBoard) {
      const heading = document.createElement("h2");
      heading.textContent = text.title;
      root.append(heading);
      const description = document.createElement("p");
      description.className = "instructions";
      description.textContent = text.instructions;
      root.append(description);
      const controls = document.createElement("div");
      controls.className = "controls fam-row";
      const custom = !SHAPES.includes(game.board.name as Shape);
      controls.dataset.helpEn = custom
        ? "A custom outline. Follow its rows of holes and finish at the marked goal."
        : SHAPE_NOTES[shape][0];
      controls.dataset.helpJa = custom
        ? "自分の盤。穴の並びに沿って飛び越え、目印のゴールに石を1つ残します。"
        : SHAPE_NOTES[shape][1];
      const selector = document.createElement("select");
      selector.setAttribute("aria-label", text.change);
      selector.dataset.action = "shape";
      for (const s of SHAPES) {
        const o = document.createElement("option");
        o.value = s;
        o.textContent = LABELS[s][lang === "ja" ? 1 : 0];
        o.selected = s === shape;
        selector.append(o);
      }
      if (custom) {
        const o = document.createElement("option");
        o.value = "custom";
        o.textContent = lang === "ja" ? "自分の盤" : "Custom board";
        o.selected = true;
        selector.append(o);
      }
      selector.addEventListener("change", () => {
        if (selector.value === "custom") return;
        shape = selector.value as Shape;
        challenge =
          shape === "english"
            ? classicEnglish()
            : shape === "triangle"
              ? classicTriangle()
              : challengeOf(shape, options.seed);
        selected = null;
        message = "";
        focusCell = 0;
        announce(challenge.game);
        render();
      });
      controls.append(selector);
      const materials = document.createElement("select");
      materials.setAttribute("aria-label", text.material);
      materials.dataset.action = "material";
      for (const m of MATERIALS) {
        const o = document.createElement("option");
        o.value = m;
        o.textContent = lang === "ja" ? { stone: "石", wood: "木", glass: "ガラス" }[m] : m;
        o.selected = material === m;
        materials.append(o);
      }
      materials.addEventListener("change", () => {
        material = materials.value as Material;
        render();
      });
      controls.append(materials);
      if (options.settingsHost) {
        for (const [field, name] of [[selector, text.change], [materials, text.material]] as const) {
          const label = document.createElement("label");
          const caption = document.createElement("span");
          caption.textContent = name;
          field.classList.add("fam-field");
          label.append(caption, field);
          controls.append(label);
        }
        options.settingsHost.append(controls);
      } else root.append(controls);
    }
    const board = document.createElement("div");
    board.className = "board";
    board.setAttribute("role", "group");
    board.setAttribute("aria-label", text.title);
    board.innerHTML = draw(game, { material, theme: options.theme, selected, title: text.title });
    board.querySelector("svg")?.setAttribute("aria-hidden", "true");
    const bounds = boundsOf(game),
      destinations =
        selected === null
          ? []
          : legalJumps(game)
              .filter((j) => j.from === selected)
              .map((j) => j.to);
    game.board.cells.forEach((cell, i) => {
      const p = pointOf(game, i),
        b = button("", () => {
          focusCell = i;
          choose(i);
        });
      b.className = `cell${destinations.includes(i) ? " legal" : ""}`;
      b.dataset.cell = String(i);
      b.tabIndex = i === focusCell ? 0 : -1;
      b.setAttribute(
        "aria-label",
        `${game.pegs[i] ? text.peg : text.hole} ${cell.x + 1}, ${cell.y + 1}${i === game.target ? `, ${text.target}` : ""}`,
      );
      b.setAttribute("aria-pressed", String(i === selected));
      Object.assign(b.style, {
        left: `${((p.x - 24) / bounds.width) * 100}%`,
        top: `${((p.y - 24) / bounds.height) * 100}%`,
        width: `${(48 / bounds.width) * 100}%`,
      });
      b.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          selected = null;
          render();
        }
        const step =
          event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowUp"
              ? -1
              : 0;
        if (step) {
          event.preventDefault();
          focusCell = (i + step + game.pegs.length) % game.pegs.length;
          board.querySelectorAll<HTMLButtonElement>(".cell").forEach((node, j) => {
            node.tabIndex = j === focusCell ? 0 : -1;
            if (j === focusCell) node.focus();
          });
        }
      });
      board.append(b);
    });
    root.append(board);
    const status = document.createElement("p");
    status.className = "status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = isGameSolved(game)
      ? text.won
      : isGameStuck(game)
        ? text.stuck
        : `${pegCount(game)} ${text.remaining}. ${message}`;
    root.append(status);
    if (!options.justBoard) {
      const actions = document.createElement("div");
      actions.className = "controls fam-row";
      actions.dataset.helpEn =
        "Undo a jump, restart, grow a new solvable challenge, or ask for a proved hint. Hints mark the run as assisted.";
      actions.dataset.helpJa = "戻す、やり直す、新しい問題、ヒントを選べます。ヒントを使うと記録に残ります。";
      const back = button(text.undo, () => {
        selected = null;
        message = "";
        announce(undo(game));
        render();
      });
      back.disabled = game.history.length === 0;
      back.dataset.action = "undo";
      actions.append(back);
      const reset = button(text.restart, () => {
        selected = null;
        message = "";
        announce(restart(game));
        render();
      });
      reset.dataset.action = "restart";
      actions.append(reset);
      const fresh = button(text.newChallenge, () => {
        challengeNumber += 1;
        challenge = generate(
          game.board,
          `${options.seed ?? "tobiishi"}:${challengeNumber}`,
          Math.min(options.challengeJumps ?? 12, game.board.cells.length - 1),
        );
        selected = null;
        message = "";
        focusCell = 0;
        announce(challenge.game);
        render();
      });
      fresh.disabled = game.board.jumps.length === 0;
      fresh.dataset.action = "new";
      actions.append(fresh);
      const hint = button(text.hint, () => {
        const prefix =
          gameCode(restart(game)) === gameCode(restart(challenge.game)) &&
          game.history.every((j, i) => j.from === challenge.answer[i]?.from && j.to === challenge.answer[i]?.to);
        const remaining = challenge.answer.slice(game.history.length);
        const proofEnd = prefix ? remaining.reduce((state, jump) => jumpAt(state, jump.from, jump.to), game) : game;
        const proved =
          prefix && isGameSolved(proofEnd) && proofEnd.history.length === game.history.length + remaining.length;
        const known = proved ? remaining[0] : undefined;
        const result = known ? { status: "solved", jumps: [known] } : solve(game, 20000);
        if (result.status === "solved" && result.jumps[0]) {
          announce(markHelped(game));
          selected = result.jumps[0].from;
          focusCell = selected;
          message = `${text.hint}: ${game.board.cells[result.jumps[0].to]!.x + 1}, ${game.board.cells[result.jumps[0].to]!.y + 1}`;
        } else message = result.status === "impossible" ? text.impossible : text.limit;
        render();
      });
      hint.disabled = isGameSolved(game);
      hint.dataset.action = "hint";
      actions.append(hint);
      root.append(actions);
    }
    if (hadFocus) {
      const node = focusedAction
        ? (options.settingsHost?.querySelector<HTMLElement>(`[data-action="${focusedAction}"]`) ?? root.querySelector<HTMLElement>(`[data-action="${focusedAction}"]`))
        : root.querySelector<HTMLElement>(`[data-cell="${focusCell}"]`);
      node?.focus();
    }
  }
  render();
  return {
    getGame: () => game,
    setGame: (next) => {
      selected = null;
      message = "";
      announce(next);
      render();
    },
    destroy: () => {
      destroyed = true;
      options.settingsHost?.replaceChildren();
      root.remove();
    },
  };
}
