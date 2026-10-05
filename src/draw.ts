import type { Game } from "./game.js";
export type Material = "stone" | "wood" | "glass";
export type Theme = { board: string; hole: string; peg: string; edge: string; accent: string };
export const MATERIALS: readonly Material[] = ["stone", "wood", "glass"];
export const THEMES: Record<Material, Theme> = {
  stone: { board: "#f4efe4", hole: "#6b6f68", peg: "#1f2320", edge: "#141614", accent: "#b5452c" },
  wood: { board: "#e2ba7a", hole: "#725640", peg: "#ab633a", edge: "#633b25", accent: "#b5452c" },
  glass: { board: "#fbf8f1", hole: "#6b6f68", peg: "#579caa", edge: "#265865", accent: "#b5452c" },
};
export function pointOf(game: Game, cell: number): { x: number; y: number } {
  const c = game.board.cells[cell]!;
  const xs = game.board.cells.map((p) => (game.board.lattice === "triangle" ? p.x - p.y / 2 : p.x));
  const minX = Math.min(...xs),
    minY = Math.min(...game.board.cells.map((p) => p.y));
  return { x: (xs[cell]! - minX) * 60 + 45, y: (c.y - minY) * (game.board.lattice === "triangle" ? 52 : 60) + 45 };
}
export function boundsOf(game: Game): { width: number; height: number } {
  return {
    width: Math.max(...game.board.cells.map((_, i) => pointOf(game, i).x)) + 45,
    height: Math.max(...game.board.cells.map((_, i) => pointOf(game, i).y)) + 45,
  };
}
export function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
}
/** A self-contained board drawing; no browser globals and no random SVG ids. */
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
