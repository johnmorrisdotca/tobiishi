---
title: Troubleshooting and upgrading
section: troubleshooting
order: 9
description: Explain invalid inputs, search limits, witness lengths and replay failures.
---

## Diagnose a refused operation

- Invalid boards, positions, budgets or challenge inputs throw the native validation errors.
- An invalid jump returns the original game; inspect `legalJumps` instead of assuming a click succeeded.
- `gameFromCode` returning null means validation/replay failed.
- Solver `limit` means unfinished search; it is not `impossible`.
- A generated challenge may be shorter than requested; inspect its witness. Named packs enforce exact category lengths.
- Ending with one peg in the wrong non-null target hole is not a solved game.
