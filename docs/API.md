# API reference

The complete source-derived reference is published at https://johnmorrisdotca.github.io/tobiishi/api.html.

The root engine exposes immutable game rules and progress. `/draw` draws an SVG board; `/play` mounts the browser player; `/element` exposes the custom element. `/element/define` automatically registers it in a browser and requires browser globals.


## Embed additions

`@johnmorrisdotca/tobiishi/element` exports `TobiishiGame`, `TobiishiElementOptions`, `TOBIISHI_EMBED_OPTION_KEYS`, `defineGame(tagName?, registry?)` and the compatible `defineTobiishi(tag?, registry?)`. `element/define` registers the default tag when a registry exists and reexports these names. Imports and definition calls are safe on a server.

The player returned by `mount` adds `set({ language, material, theme, justBoard })`, which updates presentation without losing progress or challenge state. Existing `getGame`, `setGame` and `destroy` remain. The element exposes that handle as `player`, its structured position as `game`, and full native host options through `options`. See [the embed guide](embeds.md) for reflected attributes, compatibility aliases, events and validated frame parameters.
