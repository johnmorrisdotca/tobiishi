---
title: Mount or embed a native game
section: how-to
order: 8
description: Use a real host, preserve independent instances and clean up native controls.
---

## Keep a native player handle

```ts no-run
import { classicTriangle } from "@johnmorrisdotca/tobiishi";
import { mount } from "@johnmorrisdotca/tobiishi/play";
const host=document.createElement("div");
document.body.append(host);
const player=mount(host,{challenge:classicTriangle(),language:"ja",material:"glass",onChange:(game,code)=>console.log(game.history.length,code.length)});
player.set({material:"wood"});
console.log(player.getGame().board.name);
player.destroy();
```

Each mount has independent state. Use `setGame` to restore an already validated game and `set` for presentation. Cleanup removes native listeners and controls. Browser examples are typechecked without executing a DOM in Node.

## Copy the builder’s format

The builder outputs native custom-element, version-pinned frame, module and framework recipes. Its settings include board, seed, length, look, language and controls. Custom game/challenge objects and host callbacks belong in host options. Validate a frame message’s origin/source. The [complete embed contract](../embeds.md) preserves reflected aliases, events and privacy rules. The Docs link follows the native page/builder language; the API index preserves export anchors.
