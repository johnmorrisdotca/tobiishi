import { mount } from "../dist/play-entry.js";
import { gameCode, gameFromCode, restart } from "../dist/index.js";
import { TOBIISHI_CHALLENGE_PACKS, generateTobiishiChallenge } from "../dist/index.js";

const WORDS = {
  en: {
    pageApi: "API reference", settings: "Your board", gameTitle: "Peg Solitaire", instructions: "Jump over a neighbouring peg into an empty hole. Leave one peg at the marked goal.",
    pitch: "Peg solitaire: jump a stone over its neighbour, and leave just one.", name: "Tobiishi means stepping stones.",
    nameLink: "The name", readme: "Readme", foot: "Nine boards · Three stone materials · Keyboard and touch",
    release: "Open source · @johnmorrisdotca/tobiishi", challengePacks: "Short goal challenges",
    boardPack: "Board pack", difficulty: "Difficulty", goalHole: "Target hole", playGoal: "Play this challenge",
    easy: "Easy · 3 jumps", medium: "Medium · 6 jumps", hard: "Hard · 9 jumps",
    challengeStarted: "{pack} · {goal} · {difficulty}. A complete answer is built into the hint.",
    challengeSaved: "Challenge progress is saved on this device.", freePlay: "Free play. Choose a board below or start a goal challenge.",
  },
  ja: {
    pageApi: "APIリファレンス", settings: "盤を選ぶ", gameTitle: "ペグ・ソリティア", instructions: "隣の石を飛び越え、空いた穴へ。目印の穴に石を1つ残します。",
    pitch: "隣の石を飛び越え、最後に石を1つ残すペグ・ソリティア。", name: "飛び石。石から石へ進む名前です。",
    nameLink: "名前について", readme: "説明書", foot: "9種類の盤・3種類の石・キーボードとタッチ操作",
    release: "オープンソース · @johnmorrisdotca/tobiishi", challengePacks: "ゴール付きの短い問題",
    boardPack: "盤のパック", difficulty: "難易度", goalHole: "ゴールの穴", playGoal: "この問題を始める",
    easy: "やさしい · 3手", medium: "ふつう · 6手", hard: "むずかしい · 9手",
    challengeStarted: "{pack} · {goal} · {difficulty}。ヒントには完成までの手順が入っています。",
    challengeSaved: "問題の進行をこの端末に保存しました。", freePlay: "自由に遊ぶモードです。下から盤を選ぶか、ゴール付きの問題を始めます。",
  },
};
const SAVE_KEY = "tobiishi-progress-v1";
const params = new URLSearchParams(location.search);
const select = id => document.getElementById(id);
const gameHost = select("game");
const status = select("challenge-status");
const packSelector = select("challenge-pack");
const goalSelector = select("goal-hole");
const difficultySelector = select("challenge-difficulty");
let player;
let activeChallenge = null;
let languageState;
let preferredMaterial = "stone";

function populatePacks(language) {
  const selected = packSelector.value;
  packSelector.replaceChildren(...Object.entries(TOBIISHI_CHALLENGE_PACKS).map(([key, pack]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = pack.title[language];
    return option;
  }));
  if (selected && TOBIISHI_CHALLENGE_PACKS[selected]) packSelector.value = selected;
  populateGoals(language);
}

function populateGoals(language) {
  const pack = TOBIISHI_CHALLENGE_PACKS[packSelector.value];
  if (!pack) return;
  const selected = goalSelector.value;
  goalSelector.replaceChildren(...pack.goals.map(goal => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = goal.names[language] + " · " + String.fromCharCode(97 + goal.x) + (goal.y + 1);
    return option;
  }));
  if (pack.goals.some(goal => goal.id === selected)) goalSelector.value = selected;
}

function selectedChallenge() {
  return generateTobiishiChallenge(packSelector.value, goalSelector.value, difficultySelector.value);
}

function saveProgress(next) {
  const matchesStart = activeChallenge && gameCode(restart(next)) === gameCode(restart(activeChallenge.game));
  if (activeChallenge && !matchesStart) {
    activeChallenge = null;
    status.textContent = WORDS[languageState.lang].freePlay;
  }
  const material = select("settings").querySelector('[data-action="material"]')?.value ?? preferredMaterial;
  preferredMaterial = material;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      progress: gameCode(next),
      challenge: activeChallenge ? { pack: activeChallenge.pack, goal: activeChallenge.goal.id, difficulty: activeChallenge.difficulty } : null,
      material,
      language: languageState.lang,
    }));
  } catch { /* Browser storage is optional. */ }
  gameHost.dataset.helped = String(next.helped);
}

function show(language, game, challenge = activeChallenge) {
  const material = select("settings").querySelector('[data-action="material"]')?.value ?? preferredMaterial;
  preferredMaterial = material;
  player?.destroy();
  activeChallenge = challenge;
  player = mount(gameHost, {
    language,
    settingsHost: select("settings"),
    ...(challenge ? { challenge, shape: challenge.game.board.name } : {}),
    ...(game ? { game } : {}),
    material,
    onChange: saveProgress,
  });
  saveProgress(player.getGame());
  familyHelp.refresh();
}

function playSelectedChallenge() {
  try {
    const challenge = selectedChallenge();
    const words = WORDS[languageState.lang];
  status.textContent = words.challengeStarted
      .replace("{pack}", TOBIISHI_CHALLENGE_PACKS[challenge.pack].title[languageState.lang])
      .replace("{goal}", challenge.goal.names[languageState.lang])
      .replace("{difficulty}", words[challenge.difficulty]);
    show(languageState.lang, challenge.game, challenge);
    const query = new URLSearchParams({
      pack: challenge.pack,
      goal: challenge.goal.id,
      difficulty: challenge.difficulty,
      lang: languageState.lang,
    });
    history.replaceState(history.state, "", location.pathname + "?" + query);
  } catch {
    status.textContent = WORDS[languageState.lang].freePlay;
  }
}

packSelector.addEventListener("change", () => populateGoals(languageState.lang));
goalSelector.addEventListener("change", () => { status.textContent = ""; });
difficultySelector.addEventListener("change", () => { status.textContent = ""; });
select("play-goal").addEventListener("click", playSelectedChallenge);
select("settings").addEventListener("change", event => {
  if (event.target?.dataset.action === "material" && player) saveProgress(player.getGame());
});

function restore(language) {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null"); } catch { saved = null; }
  if (["stone", "wood", "glass"].includes(saved?.material)) preferredMaterial = saved.material;
  const savedChallenge = saved?.challenge;
  const queryPack = params.get("pack");
  const pack = queryPack && queryPack in TOBIISHI_CHALLENGE_PACKS ? queryPack : savedChallenge?.pack;
  const goalId = params.get("goal") ?? savedChallenge?.goal;
  const difficulty = params.get("difficulty") ?? savedChallenge?.difficulty;
  if (pack && goalId && ["easy", "medium", "hard"].includes(difficulty)) {
    try {
      activeChallenge = generateTobiishiChallenge(pack, goalId, difficulty);
      packSelector.value = pack;
      populateGoals(language);
      goalSelector.value = goalId;
      difficultySelector.value = difficulty;
      const sameSavedChallenge = savedChallenge?.pack === pack && savedChallenge?.goal === goalId && savedChallenge?.difficulty === difficulty;
      const game = saved?.progress && (!params.has("pack") || sameSavedChallenge) ? gameFromCode(saved.progress) : null;
      status.textContent = WORDS[language].challengeSaved;
      show(language, game ?? activeChallenge.game, activeChallenge);
      return;
    } catch { activeChallenge = null; }
  }
  const game = !params.has("pack") && saved?.progress ? gameFromCode(saved.progress) : null;
  status.textContent = WORDS[language].freePlay;
  show(language, game ?? undefined, null);
}

languageState = familyLanguage({
  id: "tobiishi",
  words: WORDS,
  onChange: language => {
    populatePacks(language);
    show(language, player?.getGame(), activeChallenge);
  },
});
populatePacks(languageState.lang);
if (params.has("pack") && params.get("pack") in TOBIISHI_CHALLENGE_PACKS) packSelector.value = params.get("pack");
populateGoals(languageState.lang);
if (params.has("goal")) goalSelector.value = params.get("goal");
if (params.has("difficulty")) difficultySelector.value = params.get("difficulty");
restore(languageState.lang);
window.tobiishi = { getGame: () => player.getGame() };
