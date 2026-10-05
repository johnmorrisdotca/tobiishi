import { mount, type Player } from "./mount.js";
import { SHAPES, type Shape } from "./board.js";
import { MATERIALS, type Material } from "./draw.js";
/** Registers a custom element on explicit browser calls; importing this module alone is inert. */
export function defineTobiishi(tag = "tobiishi-game"): void {
  if (customElements.get(tag)) return;
  class TobiishiElement extends HTMLElement {
    static observedAttributes = ["shape", "seed", "language", "material", "just-board"];
    private player: Player | null = null;
    connectedCallback(): void {
      this.refresh();
    }
    disconnectedCallback(): void {
      this.player?.destroy();
      this.player = null;
    }
    attributeChangedCallback(): void {
      if (this.isConnected) this.refresh();
    }
    private refresh(): void {
      this.player?.destroy();
      const shape = this.getAttribute("shape") as Shape,
        material = this.getAttribute("material") as Material;
      this.player = mount(this, {
        shape: SHAPES.includes(shape) ? shape : "english",
        seed: this.getAttribute("seed") ?? undefined,
        language: this.getAttribute("language") === "ja" ? "ja" : "en",
        material: MATERIALS.includes(material) ? material : "stone",
        justBoard: this.hasAttribute("just-board"),
        onChange: (game) => this.dispatchEvent(new CustomEvent("tobiishi-change", { detail: game, bubbles: true })),
      });
    }
  }
  customElements.define(tag, TobiishiElement);
}
