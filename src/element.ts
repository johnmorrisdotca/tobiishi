import { mount, type Player, type MountOptions } from "./mount.js";
import { SHAPES, boardOf, type Shape } from "./board.js";
import { MATERIALS, type Material, type Theme } from "./draw.js";
import { generate } from "./generate.js";
import { gameCode, type Game } from "./game.js";
const ElementBase = typeof HTMLElement === "undefined" ? class {} as typeof HTMLElement : HTMLElement;
const isOn = (value: string | null, fallback = false): boolean => value === null ? fallback : !["false", "off", "no", "0"].includes(value.trim().toLowerCase());
/**
 * The native mounted options, checked by the shared builder.
 * @example
 * ```ts
 * import { TOBIISHI_EMBED_OPTION_KEYS } from "@johnmorrisdotca/tobiishi/element";
 * console.log(TOBIISHI_EMBED_OPTION_KEYS.includes("onChange"));
 * ```
 */
export const TOBIISHI_EMBED_OPTION_KEYS = Object.keys({ game: true, challenge: true, shape: true, seed: true, challengeJumps: true, language: true, material: true, theme: true, justBoard: true, settingsHost: true, onChange: true } satisfies Record<keyof MountOptions, boolean>);
/**
 * Host games, witnesses, palettes, external settings and the original persistence callback.
 * @example
 * ```ts
 * import type { TobiishiElementOptions } from "@johnmorrisdotca/tobiishi/element";
 * const options: TobiishiElementOptions = { material: "wood", language: "ja" };
 * console.log(options.material);
 * ```
 */
export type TobiishiElementOptions = MountOptions;
/**
 * A peg-solitaire element with reflected choices and preserved native player state.
 * @example
 * ```ts
 * import { TobiishiGame } from "@johnmorrisdotca/tobiishi/element";
 * console.log(TobiishiGame.observedAttributes.includes("lang"));
 * ```
 */
export class TobiishiGame extends ElementBase {
  static observedAttributes = ["shape", "seed", "language", "material", "just-board", "challenge-jumps", "lang", "theme", "controls", "size", "width", "label"];
  #player: Player | null = null;
  #options: TobiishiElementOptions = {};
  #gameKey = "";
  #lookKey = "";
  #media: MediaQueryList | null = null;
  #languageWatch: MutationObserver | null = null;
  #mediaChange = (): void => { if (this.isConnected) this.#refresh(); };
  #widthBefore: string | null = null;
  #widthOwned = false;
  #labelBefore: { role: string | null; label: string | null } | null = null;
  /** Host mount options; callback and presentation changes preserve the player and puzzle. */
  get options(): TobiishiElementOptions { return this.#options; }
  set options(value: TobiishiElementOptions) { if (value?.settingsHost !== this.#options.settingsHost) this.#gameKey = ""; this.#options = value ?? {}; if (this.isConnected) this.#refresh(); }
  /** The native player handle, or null before mounting. */
  get player(): Player | null { return this.#player; }
  /** Structured current peg position, or null before mounting. */
  get game(): Game | null { return this.#player?.getGame() ?? null; }
  /** Reads the native current game. */
  getGame(): Game | null { return this.game; }
  /** Replaces the native game, or supplies its initial value before connection. */
  setGame(game: Game): void { if (this.#player === null) this.options = { ...this.#options, game }; else this.#player.setGame(game); }
  connectedCallback(): void {
    this.#media?.removeEventListener("change", this.#mediaChange);
    this.#media = this.ownerDocument.defaultView?.matchMedia("(prefers-color-scheme: dark)") ?? null;
    this.#media?.addEventListener("change", this.#mediaChange);
    this.#languageWatch?.disconnect(); const Observe = this.ownerDocument.defaultView?.MutationObserver;
    if (Observe !== undefined) { this.#languageWatch = new Observe(() => { if (this.isConnected && !this.hasAttribute("lang") && !this.hasAttribute("language") && this.#options.language === undefined) this.#refresh(); }); this.#languageWatch.observe(this.ownerDocument.documentElement, { attributes: true, attributeFilter: ["lang"] }); }
    this.#refresh();
  }
  disconnectedCallback(): void { this.#languageWatch?.disconnect(); this.#languageWatch = null; this.#media?.removeEventListener("change", this.#mediaChange); this.#media = null; this.#player?.destroy(); this.#player = null; this.#gameKey = ""; this.#lookKey = ""; }
  attributeChangedCallback(): void { if (this.isConnected) this.#refresh(); }
  #write(name: string, value: unknown): void { if (value === null || value === undefined) this.removeAttribute(name); else this.setAttribute(name, String(value)); }
  /** The `shape` attribute, reflected. */
  get shape(): string | null { return this.getAttribute("shape"); }
  set shape(value: string | number | boolean | null | undefined) { this.#write("shape", value); }
  /** The `seed` attribute, reflected. */
  get seed(): string | null { return this.getAttribute("seed"); }
  set seed(value: string | number | boolean | null | undefined) { this.#write("seed", value); }
  /** The `language` attribute, reflected. */
  get language(): string | null { return this.getAttribute("language"); }
  set language(value: string | number | boolean | null | undefined) { this.#write("language", value); }
  /** The `material` attribute, reflected. */
  get material(): string | null { return this.getAttribute("material"); }
  set material(value: string | number | boolean | null | undefined) { this.#write("material", value); }
  /** The `just-board` attribute, reflected. */
  get justBoard(): string | null { return this.getAttribute("just-board"); }
  set justBoard(value: string | number | boolean | null | undefined) { this.#write("just-board", value); }
  /** The `challenge-jumps` attribute, reflected. */
  get challengeJumps(): string | null { return this.getAttribute("challenge-jumps"); }
  set challengeJumps(value: string | number | boolean | null | undefined) { this.#write("challenge-jumps", value); }
  /** The `theme` attribute, reflected. */
  get theme(): string | null { return this.getAttribute("theme"); }
  set theme(value: string | number | boolean | null | undefined) { this.#write("theme", value); }
  /** The `controls` attribute, reflected. */
  get controls(): string | null { return this.getAttribute("controls"); }
  set controls(value: string | number | boolean | null | undefined) { this.#write("controls", value); }
  /** The `size` attribute, reflected. */
  get size(): string | null { return this.getAttribute("size"); }
  set size(value: string | number | boolean | null | undefined) { this.#write("size", value); }
  /** The `width` attribute, reflected. */
  get width(): string | null { return this.getAttribute("width"); }
  set width(value: string | number | boolean | null | undefined) { this.#write("width", value); }
  /** The `label` attribute, reflected. */
  get label(): string | null { return this.getAttribute("label"); }
  set label(value: string | number | boolean | null | undefined) { this.#write("label", value); }
  #frame(): void {
    this.style.display = "block"; this.style.maxWidth = "100%";
    const width = Number(this.getAttribute("width")), size = this.getAttribute("size");
    const pixels = this.hasAttribute("width") && width > 0 && Number.isFinite(width) ? Math.min(width, 2000) : size === "small" ? 320 : size === "medium" ? 480 : size === "large" ? 640 : null;
    if (pixels !== null) { if (!this.#widthOwned) this.#widthBefore = this.style.width; this.#widthOwned = true; this.style.width = `${pixels}px`; }
    else if (this.#widthOwned) { this.style.width = this.#widthBefore ?? ""; this.#widthOwned = false; }
    const theme = this.getAttribute("theme"); this.style.colorScheme = theme === "light" || theme === "dark" ? theme : "light dark";
    this.setAttribute("data-tobiishi-embed", "");
    const root = this.getRootNode(), target: ParentNode = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : this.ownerDocument.head;
    if (target.querySelector("style[data-tobiishi-embed-style]") === null) {
      const style = this.ownerDocument.createElement("style"); style.setAttribute("data-tobiishi-embed-style", "");
      style.textContent = '[data-tobiishi-embed]{font:16px/1.5 system-ui,sans-serif;color:light-dark(#1f2320,#ece8dc);--ink:light-dark(#1f2320,#ece8dc);--surface:light-dark(#fbf8f1,#1d201e);--rule:light-dark(#ddd6c6,#3a3d38);--accent:light-dark(#b5452c,#ff8a6b)}[data-tobiishi-embed] .tobiishi select{max-width:100%;min-width:0}[data-tobiishi-embed][size] .tobiishi,[data-tobiishi-embed][width] .tobiishi{max-width:100%}';
 target.append(style);
    }
    if (this.hasAttribute("label")) { this.#labelBefore ??= { role: this.getAttribute("role"), label: this.getAttribute("aria-label") }; this.setAttribute("role", "group"); this.setAttribute("aria-label", this.getAttribute("label")!); }
    else if (this.#labelBefore !== null) { for (const [name, value] of [["role", this.#labelBefore.role], ["aria-label", this.#labelBefore.label]]) { if (value === null) this.removeAttribute(name!); else this.setAttribute(name!, value!); } this.#labelBefore = null; }
  }
  #look(): Pick<MountOptions, "language" | "material" | "theme" | "justBoard"> {
    const language = this.getAttribute("lang") ?? this.getAttribute("language") ?? this.#options.language ?? this.ownerDocument.documentElement.lang;
    const material = this.getAttribute("material") ?? this.#options.material ?? "stone";
    const chosen = MATERIALS.includes(material as Material) ? material as Material : "stone";
    const dark = this.getAttribute("theme") === "dark" || this.getAttribute("theme") !== "light" && this.#media?.matches === true;
    const palette: Record<Material, Theme> = { stone: { board: "#252e32", hole: "#6b746e", peg: "#ede8d9", edge: "#a9b3ac", accent: "#ff8a6b" }, wood: { board: "#594831", hole: "#2b2117", peg: "#ddb580", edge: "#9f784c", accent: "#ff8a6b" }, glass: { board: "#162e35", hole: "#59686b", peg: "#a3d7e3", edge: "#5893a2", accent: "#ff8a6b" } };
    return { language: language === "ja" ? "ja" : "en", material: chosen, theme: dark ? { ...palette[chosen], ...this.#options.theme } : this.#options.theme, justBoard: this.hasAttribute("controls") ? !isOn(this.getAttribute("controls"), true) : isOn(this.getAttribute("just-board"), this.#options.justBoard ?? false) };
  }
  #refresh(): void {
    this.#frame();
    try {
      const asked = this.getAttribute("shape") ?? this.#options.shape;
      const shape = SHAPES.includes(asked as Shape) ? asked as Shape : this.#options.game !== undefined && SHAPES.includes(this.#options.game.board.name as Shape) ? this.#options.game.board.name as Shape : "english";
      const seed = this.getAttribute("seed") ?? this.#options.seed;
      const jumps = this.hasAttribute("challenge-jumps") ? Number(this.getAttribute("challenge-jumps")) : this.#options.challengeJumps;
      if (jumps !== undefined && (!Number.isInteger(jumps) || jumps < 1 || jumps > 100)) throw new RangeError(this.#look().language === "ja" ? "チャレンジの長さは1〜100の整数で指定してください。" : "Use a whole challenge length from 1 to 100.");
      const key = JSON.stringify([shape, seed, jumps, this.#options.game, this.#options.challenge]);
      const look = this.#look(), lookKey = JSON.stringify(look);
      if (key === this.#gameKey && this.#player !== null) { if (lookKey !== this.#lookKey) this.#player.set(look); this.#lookKey = lookKey; return; }
      this.#player?.destroy(); this.#player = null; this.#gameKey = ""; this.#lookKey = ""; this.replaceChildren();
      const challenge = this.#options.challenge ?? (this.hasAttribute("challenge-jumps") ? generate(boardOf(shape), seed ?? "tobiishi", Math.min(jumps!, boardOf(shape).cells.length - 1)) : undefined);
      this.#player = mount(this, { ...this.#options, shape, seed, challengeJumps: jumps, challenge, ...look, onChange: (game, code) => { this.dispatchEvent(new CustomEvent("tobiishi-change", { bubbles: true, composed: true, detail: JSON.parse(JSON.stringify(game)) })); this.#options.onChange?.(game, code); } });
      this.#gameKey = key; this.#lookKey = lookKey;
      this.dispatchEvent(new CustomEvent("tobiishi-load", { bubbles: true, composed: true, detail: JSON.parse(JSON.stringify({ game: this.game, code: gameCode(this.#player.getGame()) })) }));
    } catch (error) {
      this.#player?.destroy(); this.#player = null; this.#gameKey = ""; this.#lookKey = "";
      const message = error instanceof Error ? error.message : String(error), status = this.ownerDocument.createElement("p"); status.setAttribute("role", "status"); status.textContent = message; this.replaceChildren(status); this.dispatchEvent(new CustomEvent("tobiishi-error", { bubbles: true, composed: true, detail: { message } }));
    }
  }
}
/**
 * Registers the default game or a subclass under a host's tag. Safe on a server.
 * @param tagName - The tag to define; tobiishi-game by default.
 * @param registry - The page registry, or undefined on a server.
 * @returns Nothing; an existing definition is left in place.
 * @example
 * ```ts
 * import { defineGame } from "@johnmorrisdotca/tobiishi/element";
 * defineGame();
 * console.log(typeof defineGame);
 * ```
 */
export function defineGame(tagName = "tobiishi-game", registry: CustomElementRegistry | undefined = typeof customElements === "undefined" ? undefined : customElements): void { if (registry !== undefined && registry.get(tagName) === undefined) registry.define(tagName, tagName === "tobiishi-game" ? TobiishiGame : class extends TobiishiGame {}); }
/**
 * Compatible registration name, with an optional registry. Safe on a server.
 * @param tag - The custom tag name, or tobiishi-game by default.
 * @param registry - The page registry, or undefined on a server.
 * @returns Nothing; existing definitions are left in place.
 * @example
 * ```ts
 * import { defineTobiishi } from "@johnmorrisdotca/tobiishi/element";
 * defineTobiishi();
 * console.log(typeof defineTobiishi);
 * ```
 */
export function defineTobiishi(tag = "tobiishi-game", registry: CustomElementRegistry | undefined = typeof customElements === "undefined" ? undefined : customElements): void { defineGame(tag, registry); }
