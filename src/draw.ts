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

/** Distance between neighbouring holes on a square board, and across a row on a triangular one. */
const PITCH = 60;
/** Distance between rows on a triangular board: the pitch times √3/2, rounded. */
const TRIANGLE_ROW_PITCH = 52;
/** Space between the outermost hole centres and the edge of the drawing. */
const MARGIN = 45;
const FRAME = { inset: 3, stroke: 6, radius: 16, colour: "#a98954" } as const;
const HOLE_RADIUS = 24;
const TARGET_RING_RADIUS = 27;
const SELECTED_RING_RADIUS = 25;
const PEG_RADIUS = 19;
const PEG_SHINE_RADIUS = 5;

type Point = { x: number; y: number };

/** Every hole's centre, measured once for the whole board. */
function pointsOf(game: Game): Point[] {
  const { cells, lattice } = game.board;
  const triangle = lattice === "triangle";
  const xs = cells.map((cell) => (triangle ? cell.x - cell.y / 2 : cell.x));
  const minX = Math.min(...xs);
  const minY = Math.min(...cells.map((cell) => cell.y));
  const rowPitch = triangle ? TRIANGLE_ROW_PITCH : PITCH;
  return cells.map((cell, i) => ({ x: (xs[i]! - minX) * PITCH + MARGIN, y: (cell.y - minY) * rowPitch + MARGIN }));
}

function boundsOfPoints(points: readonly Point[]): { width: number; height: number } {
  return {
    width: Math.max(...points.map((point) => point.x)) + MARGIN,
    height: Math.max(...points.map((point) => point.y)) + MARGIN,
  };
}
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
  return pointsOf(game)[cell]!;
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
  return boundsOfPoints(pointsOf(game));
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
  const theme = { ...THEMES[options.material ?? "stone"], ...options.theme };
  const points = pointsOf(game);
  const { width, height } = boundsOfPoints(points);
  const cells = points.map((point, i) => cellSvg(point, i, game, theme, options.selected)).join("");
  const title = escapeXml(options.title ?? "Peg solitaire");
  const frame = `<rect x="${FRAME.inset}" y="${FRAME.inset}" width="${width - 2 * FRAME.inset}" height="${height - 2 * FRAME.inset}" rx="${FRAME.radius}" fill="${escapeXml(theme.board)}" stroke="${FRAME.colour}" stroke-width="${FRAME.stroke}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">${frame}${cells}</svg>`;
}

/** One hole: the hole itself, the target ring, the peg and the selection ring, each only where it applies. */
function cellSvg(point: Point, cell: number, game: Game, theme: Theme, selected: number | null | undefined): string {
  const { x, y } = point;
  const ring = (radius: number, width: number, dash = "") =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${escapeXml(theme.accent)}" stroke-width="${width}"${dash}/>`;
  const hole = `<circle cx="${x}" cy="${y}" r="${HOLE_RADIUS}" fill="${escapeXml(theme.hole)}" opacity=".28"/>`;
  const target = cell === game.target ? ring(TARGET_RING_RADIUS, 2, ` stroke-dasharray="3 4"`) : "";
  const peg = game.pegs[cell]
    ? `<circle cx="${x}" cy="${y + 2}" r="${PEG_RADIUS}" fill="${escapeXml(theme.edge)}"/>` +
      `<circle cx="${x}" cy="${y - 1}" r="${PEG_RADIUS}" fill="${escapeXml(theme.peg)}"/>` +
      `<circle cx="${x - 5}" cy="${y - 7}" r="${PEG_SHINE_RADIUS}" fill="white" opacity=".18"/>`
    : "";
  const selection = cell === selected ? ring(SELECTED_RING_RADIUS, 4) : "";
  return `<g data-cell="${cell}">${hole}${target}${peg}${selection}</g>`;
}
