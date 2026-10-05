import { mount } from "../dist/play-entry.js";
const WORDS = {
  en: {
    settings: "Your board", gameTitle: "Peg Solitaire", instructions: "Jump over a neighbouring peg into an empty hole. Leave one peg at the marked goal.",
    pitch: "Peg solitaire: jump a stone over its neighbour, and leave just one.",
    name: "Tobiishi means stepping stones.",
    nameLink: "The name",
    readme: "Readme",
    foot: "Nine boards · Three stone materials · Keyboard and touch",
    release: "Local release candidate · @johnmorrisdotca/tobiishi",
  },
  ja: {
    settings: "盤を選ぶ", gameTitle: "ペグ・ソリティア", instructions: "隣の石を飛び越え、空いた穴へ。目印の穴に石を1つ残します。",
    pitch: "隣の石を飛び越え、最後に石を1つ残すペグ・ソリティア。",
    name: "飛び石。石から石へ進む名前です。",
    nameLink: "名前について",
    readme: "説明書",
    foot: "9種類の盤・3種類の石・キーボードとタッチ操作",
    release: "ローカル版 · @johnmorrisdotca/tobiishi",
  },
};
let player;
function show(language) {
  const host = document.querySelector("#game");
  const game = player?.getGame(),
    material = document.querySelector("#settings").querySelector('[data-action="material"]')?.value;
  player?.destroy();
  player = mount(host, {
    language,
    settingsHost: document.querySelector("#settings"),
    game,
    material,
    onChange(next) {
      host.dataset.helped = String(next.helped);
    },
  });
  host.dataset.helped = String(player.getGame().helped);
  familyHelp.refresh();
}
const language = familyLanguage({ id: "tobiishi", words: WORDS, onChange: show });
show(language.lang);
window.tobiishi = { getGame: () => player.getGame() };
