/** A hole is addressed by its place in the board's cells, never by a drawing. */
export type Cell = Readonly<{ x: number; y: number }>;
export type Jump = Readonly<{ from: number; over: number; to: number }>;
export type Board = Readonly<{
  name: string;
  lattice: "square" | "triangle";
  cells: readonly Cell[];
  jumps: readonly Jump[];
}>;
export type Shape = "english" | "european" | "triangle" | "diamond" | "heart" | "star" | "hexagon" | "wide" | "tall";
export const SHAPES: readonly Shape[] = [
  "english",
  "triangle",
  "european",
  "diamond",
  "heart",
  "star",
  "hexagon",
  "wide",
  "tall",
];
export const SQUARE_STEPS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;
export const TRIANGLE_STEPS = [...SQUARE_STEPS, [1, 1], [-1, -1]] as const;

/** Make a board from holes and a lattice; absent holes cannot be crossed. */
export function makeBoard(name: string, cells: readonly Cell[], lattice: Board["lattice"] = "square"): Board {
  if (
    typeof name !== "string" ||
    !name ||
    name.length > 100 ||
    !Array.isArray(cells) ||
    cells.length < 1 ||
    cells.length > 128 ||
    !["square", "triangle"].includes(lattice)
  )
    throw new RangeError("Invalid board");
  const keys = new Map<string, number>();
  cells.forEach((cell, i) => {
    const key = `${cell.x},${cell.y}`;
    if (
      !Number.isSafeInteger(cell.x) ||
      !Number.isSafeInteger(cell.y) ||
      Math.abs(cell.x) > 100 ||
      Math.abs(cell.y) > 100 ||
      keys.has(key)
    )
      throw new RangeError("Invalid hole");
    keys.set(key, i);
  });
  const jumps: Jump[] = [];
  cells.forEach(({ x, y }, from) => {
    for (const [dx, dy] of lattice === "triangle" ? TRIANGLE_STEPS : SQUARE_STEPS) {
      const over = keys.get(`${x + dx},${y + dy}`),
        to = keys.get(`${x + dx * 2},${y + dy * 2}`);
      if (over !== undefined && to !== undefined) jumps.push(Object.freeze({ from, over, to }));
    }
  });
  return Object.freeze({
    name,
    lattice,
    cells: Object.freeze(cells.map((cell) => Object.freeze({ ...cell }))),
    jumps: Object.freeze(jumps),
  });
}

/** A rectangular square-lattice board; dimensions can be wide, tall, or square. */
export function rectangleBoard(width: number, height: number): Board {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width < 3 ||
    height < 3 ||
    width > 32 ||
    height > 32 ||
    width * height > 128
  )
    throw new RangeError("Invalid rectangle dimensions");
  return makeBoard(
    `rectangle-${width}x${height}`,
    Array.from({ length: width * height }, (_, i) => ({ x: i % width, y: Math.floor(i / width) })),
  );
}
/** A familiar lattice or a shaped outline. Shapes describe holes, never a different capture rule. */
export function boardOf(shape: Shape = "english"): Board {
  if (!SHAPES.includes(shape)) throw new RangeError("Unknown shape");
  if (shape === "wide" || shape === "tall") {
    const board = rectangleBoard(shape === "wide" ? 9 : 5, shape === "wide" ? 5 : 9);
    return makeBoard(shape, board.cells);
  }
  const cells: Cell[] = [];
  if (shape === "heart" || shape === "star") {
    const rows =
      shape === "heart"
        ? [".###.###.", "#########", "#########", ".#######.", "..#####..", "...###...", "....#...."]
        : [
            ".....#.....",
            "....###....",
            "....###....",
            ".#########.",
            "..#######..",
            "...#####...",
            "...#####...",
            "..###.###..",
            "..##...##..",
            ".###...###.",
          ];
    rows.forEach((row, y) =>
      [...row].forEach((cell, x) => {
        if (cell === "#") cells.push({ x, y });
      }),
    );
    return makeBoard(shape, cells);
  }
  if (shape === "hexagon") {
    for (let y = -3; y <= 3; y += 1)
      for (let x = -3; x <= 3; x += 1)
        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(x - y)) <= 3) cells.push({ x: x + 3, y: y + 3 });
    return makeBoard(shape, cells, "triangle");
  }
  for (let y = 0; y < (shape === "triangle" ? 5 : 7); y += 1)
    for (let x = 0; x < (shape === "triangle" ? 5 : 7); x += 1) {
      const cross = (x >= 2 && x <= 4) || (y >= 2 && y <= 4);
      if (
        (shape === "triangle" && x <= y) ||
        (shape === "english" && cross) ||
        (shape === "european" && (cross || ([1, 5].includes(x) && [1, 5].includes(y)))) ||
        (shape === "diamond" && Math.abs(x - 3) + Math.abs(y - 3) <= 3)
      )
        cells.push({ x, y });
    }
  return makeBoard(shape, cells, shape === "triangle" ? "triangle" : "square");
}
