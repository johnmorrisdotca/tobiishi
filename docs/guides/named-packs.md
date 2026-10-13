---
title: Choose named goal packs
section: how-to
order: 4
description: Pick a real pack goal and understand witness-length difficulty labels.
---

## Choose a native goal

```ts
import { TOBIISHI_CHALLENGE_PACKS,generateTobiishiChallenge } from "@johnmorrisdotca/tobiishi";
const pack=TOBIISHI_CHALLENGE_PACKS.english;
const challenge=generateTobiishiChallenge("english",pack.goals[0].id,"easy");
console.log(pack.title.en,challenge.goal.id,challenge.answer.length,challenge.seed);
```

Nine shapes each have three curated goal holes and three requested length categories, making 81 named combinations. Easy/medium/hard request 3/6/9 jumps; they are witness-length categories rather than a measured human difficulty rating. The seed incorporates pack, goal and category.

## Keep a goal on its board

A goal carries native integer coordinates and localized labels. The generator validates that it is a real hole, and throws for an unknown pack/goal/category or a challenge that does not reach the intended length. Use the pack’s own goal choices when building a menu; do not reuse another shape’s coordinates.
