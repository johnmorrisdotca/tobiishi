import type { Game } from "./game.js";
/** Built-in board and peg palettes.
 *
 * @example
 * ```ts
 * import type { Material } from "@johnmorrisdotca/tobiishi/draw";
 *
 * const value: Material = "wood";
 * console.log(value);
 * ```
 */
export type Material = "stone" | "wood" | "glass";
/** SVG color properties that can be partially overridden by a caller.
 *
 * @example
 * ```ts
 * import type { Theme } from "@johnmorrisdotca/tobiishi/draw";
 * import { THEMES } from "@johnmorrisdotca/tobiishi/draw";
 *
 * const value: Theme = THEMES.wood;
 * console.log(value);
 * ```
 */
export type Theme = { board: string; hole: string; peg: string; edge: string; accent: string };
/** Built-in palette names in player-menu order.
 *
 * @example
 * ```ts
 * import { MATERIALS } from "@johnmorrisdotca/tobiishi/draw";
 *
 * console.log(MATERIALS);
 * ```
 */
export const MATERIALS: readonly Material[] = ["stone", "wood", "glass"];
/** Palette values used by the SVG renderer.
 *
 * @example
 * ```ts
 * import { THEMES } from "@johnmorrisdotca/tobiishi/draw";
 *
 * console.log(THEMES.wood);
 * ```
 */
export const THEMES: Record<Material, Theme> = {
  stone: { board: "#f4efe4", hole: "#6b6f68", peg: "#1f2320", edge: "#141614", accent: "#b5452c" },
  wood: { board: "#e2ba7a", hole: "#725640", peg: "#ab633a", edge: "#633b25", accent: "#b5452c" },
  glass: { board: "#fbf8f1", hole: "#6b6f68", peg: "#579caa", edge: "#265865", accent: "#b5452c" },
};
/** Maps a board cell index to its SVG centre point.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @param cell - A valid index into this game’s board cells.
 * @returns Maps a board cell index to its SVG centre point.
 * @example
 * ```ts
 * import { makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 * import { pointOf } from "@johnmorrisdotca/tobiishi/draw";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(pointOf(game,0));
 * ```
 */
export function pointOf(game: Game, cell: number): { x: number; y: number } {
  const c = game.board.cells[cell]!;
  const xs = game.board.cells.map((p) => (game.board.lattice === "triangle" ? p.x - p.y / 2 : p.x));
  const minX = Math.min(...xs),
    minY = Math.min(...game.board.cells.map((p) => p.y));
  return { x: (xs[cell]! - minX) * 60 + 45, y: (c.y - minY) * (game.board.lattice === "triangle" ? 52 : 60) + 45 };
}
/** Returns the SVG view box size for the board.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @returns Returns the SVG view box size for the board.
 * @example
 * ```ts
 * import { makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 * import { boundsOf } from "@johnmorrisdotca/tobiishi/draw";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(boundsOf(game));
 * ```
 */
export function boundsOf(game: Game): { width: number; height: number } {
  return {
    width: Math.max(...game.board.cells.map((_, i) => pointOf(game, i).x)) + 45,
    height: Math.max(...game.board.cells.map((_, i) => pointOf(game, i).y)) + 45,
  };
}
/** Escapes text for safe inclusion in XML attributes and content.
 *
 * @param value - Text to escape for XML attributes or content.
 * @returns Escapes text for safe inclusion in XML attributes and content.
 * @example
 * ```ts
 * import { escapeXml } from "@johnmorrisdotca/tobiishi/draw";
 *
 * console.log(escapeXml("<peg & hole>"));
 * ```
 */
export function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
}
/** A self-contained board drawing; no browser globals and no random SVG ids.
 *
 * @param game - The immutable native peg position, board, target, history and assistance marker.
 * @param options - Optional native SVG material, palette, selected hole and title, or mount settings specified by this signature.
 * @returns A self-contained board drawing; no browser globals and no random SVG ids.
 * @example
 * ```ts
 * import { makeBoard, newGame } from "@johnmorrisdotca/tobiishi";
 * import { draw } from "@johnmorrisdotca/tobiishi/draw";
 *
 * const board = makeBoard("Three holes",[{x:0,y:0},{x:1,y:0},{x:2,y:0}]);
 * const game = newGame(board,[true,true,false],2);
 * console.log(draw(game,{material:"wood",title:"Three pegs"}).startsWith("<svg"));
 * ```
 */
export function draw(
  game: Game,
  options: { material?: Material; theme?: Partial<Theme>; selected?: number | null; title?: string } = {},
): string {
  const theme = { ...THEMES[options.material ?? "stone"], ...options.theme },
    bounds = boundsOf(game);
  const cells = game.board.cells
    .map((_, i) => {
      const p = pointOf(game, i),
        filled = game.pegs[i];
      return `<g data-cell="${i}"><circle cx="${p.x}" cy="${p.y}" r="24" fill="${escapeXml(theme.hole)}" opacity=".28"/>${i === game.target ? `<circle cx="${p.x}" cy="${p.y}" r="27" fill="none" stroke="${escapeXml(theme.accent)}" stroke-width="2" stroke-dasharray="3 4"/>` : ""}${filled ? `<circle cx="${p.x}" cy="${p.y + 2}" r="19" fill="${escapeXml(theme.edge)}"/><circle cx="${p.x}" cy="${p.y - 1}" r="19" fill="${escapeXml(theme.peg)}"/><circle cx="${p.x - 5}" cy="${p.y - 7}" r="5" fill="white" opacity=".18"/>` : ""}${i === options.selected ? `<circle cx="${p.x}" cy="${p.y}" r="25" fill="none" stroke="${escapeXml(theme.accent)}" stroke-width="4"/>` : ""}</g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bounds.width} ${bounds.height}" role="img" aria-label="${escapeXml(options.title ?? "Peg solitaire")}"><rect x="3" y="3" width="${bounds.width - 6}" height="${bounds.height - 6}" rx="16" fill="${escapeXml(theme.board)}" stroke="#a98954" stroke-width="6"/>${cells}</svg>`;
}
