/** Localized English and Japanese labels used by the player. */
export const STRINGS = {
  en: {
    title: "Peg Solitaire",
    instructions:
      "Choose a peg, then an empty hole two spaces away. Jump over one peg to remove it. Leave one peg; if a hole is marked, finish there.",
    newChallenge: "New challenge",
    undo: "Undo",
    restart: "Restart",
    hint: "Hint",
    remaining: "pegs left",
    won: "Solved — one peg remains!",
    stuck: "No jumps remain. Undo a move to try another path.",
    selected: "Selected",
    peg: "Peg",
    hole: "Empty hole",
    target: "goal",
    limit: "No hint found within the search budget.",
    impossible: "This position cannot reach the goal.",
    move: "Jump made.",
    change: "Board",
    material: "Pieces",
    help: "Hints use a bounded search; they can take a moment on a full board.",
  },
  ja: {
    title: "ペグ・ソリティア",
    instructions:
      "石を選び、2つ先の空いた穴を選びます。間の石を飛び越えると、その石が取り除かれます。石を1つ残しましょう。目印がある場合は、その穴で終えます。",
    newChallenge: "新しい問題",
    undo: "戻す",
    restart: "やり直す",
    hint: "ヒント",
    remaining: "個の石",
    won: "完成！石が1つ残りました。",
    stuck: "動かせる石がありません。戻して別の道を試しましょう。",
    selected: "選択中",
    peg: "石",
    hole: "空いた穴",
    target: "ゴール",
    limit: "探索回数の上限までにヒントが見つかりませんでした。",
    impossible: "この配置からはゴールに到達できません。",
    move: "石を動かしました。",
    change: "盤",
    material: "石の素材",
    help: "ヒントには探索回数の上限があります。石が多い盤では少し時間がかかります。",
  },
} as const;
/** Supported player interface languages. */
export type Language = keyof typeof STRINGS;
