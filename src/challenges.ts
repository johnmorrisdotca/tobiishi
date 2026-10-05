import { boardOf, type Shape } from "./board.js";
import { challengeOf, type Challenge } from "./generate.js";

export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type GoalHole = Readonly<{ id: string; names: Readonly<Record<"en" | "ja", string>>; x: number; y: number }>;
export type ChallengePack = Readonly<{
  title: Readonly<Record<"en" | "ja", string>>;
  shape: Shape;
  goals: readonly GoalHole[];
}>;
export type GoalChallenge = Challenge & Readonly<{
  pack: Shape;
  packTitle: string;
  difficulty: ChallengeDifficulty;
  goal: GoalHole;
}>;

const goal = (id: string, en: string, ja: string, x: number, y: number): GoalHole => ({
  id,
  names: { en, ja },
  x,
  y,
});

/** Short, named routes. Each goal is a distinct hole; every route has a legal witness. */
export const TOBIISHI_CHALLENGE_PACKS: Readonly<Record<Shape, ChallengePack>> = {
  english: {
    title: { en: "Crossroads", ja: "交差点" }, shape: "english",
    goals: [goal("centre", "Centre", "中央", 3, 3), goal("north", "North crossing", "北の交差点", 3, 2), goal("west", "West crossing", "西の交差点", 2, 3)],
  },
  triangle: {
    title: { en: "Three Peaks", ja: "三つの峰" }, shape: "triangle",
    goals: [goal("middle", "Middle row", "中央の段", 2, 2), goal("west", "West slope", "西の斜面", 1, 2), goal("east", "East slope", "東の斜面", 2, 3)],
  },
  european: {
    title: { en: "European Crossings", ja: "ヨーロッパの交差点" }, shape: "european",
    goals: [goal("centre", "Centre", "中央", 3, 3), goal("north", "North crossing", "北の交差点", 3, 2), goal("west", "West crossing", "西の交差点", 2, 3)],
  },
  diamond: {
    title: { en: "Diamond Routes", ja: "ひし形の道" }, shape: "diamond",
    goals: [goal("centre", "Centre", "中央", 3, 3), goal("north", "North path", "北の道", 3, 2), goal("west", "West path", "西の道", 2, 3)],
  },
  heart: {
    title: { en: "Heart Steps", ja: "ハートの道" }, shape: "heart",
    goals: [goal("centre", "Heart centre", "ハートの中央", 4, 3), goal("north", "North lobe", "北のふくらみ", 4, 2), goal("west", "West lobe", "西のふくらみ", 3, 3)],
  },
  star: {
    title: { en: "Star Points", ja: "星の先" }, shape: "star",
    goals: [goal("centre", "Centre", "中央", 5, 4), goal("north", "North arm", "北の腕", 5, 5), goal("south", "South arm", "南の腕", 5, 3)],
  },
  hexagon: {
    title: { en: "Hexagon Paths", ja: "六角形の道" }, shape: "hexagon",
    goals: [goal("centre", "Centre", "中央", 3, 3), goal("north", "North path", "北の道", 3, 2), goal("west", "West path", "西の道", 2, 3)],
  },
  wide: {
    title: { en: "Long Table", ja: "長いテーブル" }, shape: "wide",
    goals: [goal("centre", "Centre", "中央", 4, 2), goal("north", "North lane", "北の列", 4, 1), goal("west", "West lane", "西の列", 3, 2)],
  },
  tall: {
    title: { en: "Narrow Garden", ja: "細長い庭" }, shape: "tall",
    goals: [goal("centre", "Centre", "中央", 2, 4), goal("north", "North lane", "北の列", 2, 3), goal("west", "West lane", "西の列", 1, 4)],
  },
};

const DIFFICULTY_JUMPS: Readonly<Record<ChallengeDifficulty, number>> = {
  easy: 3,
  medium: 6,
  hard: 9,
};

/** Creates one fixed-goal puzzle with a complete, replayable legal answer. */
export function generateTobiishiChallenge(
  packKey: Shape,
  goalId: string,
  difficulty: ChallengeDifficulty,
): GoalChallenge {
  const pack = Object.prototype.hasOwnProperty.call(TOBIISHI_CHALLENGE_PACKS, packKey)
    ? TOBIISHI_CHALLENGE_PACKS[packKey]
    : undefined;
  const goalHole = pack?.goals.find(item => item.id === goalId);
  if (!pack || !goalHole || !Object.prototype.hasOwnProperty.call(DIFFICULTY_JUMPS, difficulty)) {
    throw new RangeError("Unknown Tobiishi challenge");
  }
  const board = boardOf(pack.shape);
  if (!board.cells.some(cell => cell.x === goalHole.x && cell.y === goalHole.y)) {
    throw new RangeError("The challenge goal is not a hole on its board");
  }
  const jumps = DIFFICULTY_JUMPS[difficulty];
  const seed = `tobiishi-pack:${packKey}:${goalId}:${difficulty}`;
  const challenge = challengeOf(pack.shape, seed, jumps, goalHole);
  if (challenge.answer.length !== jumps) {
    throw new Error("This challenge did not reach its intended length");
  }
  return Object.freeze({
    ...challenge,
    pack: packKey,
    packTitle: pack.title.en,
    difficulty,
    goal: goalHole,
  });
}
