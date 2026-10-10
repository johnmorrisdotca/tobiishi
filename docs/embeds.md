# Peg-solitaire embeds

The shared builder covers every observed attribute and native mounted option, with explicit host-only reasons for structured games, custom witnesses/palettes, external settings hosts and callbacks. Copied code pins the installed package's major version. Choose shape, seed, optional challenge length, material, controls, language, size, pixel width, theme and label. Setup is kept in the URL; play is never stored by the embed.

## Compatibility and state

The default tag remains tobiishi-game. defineTobiishi(tag?, registry?) remains compatible; defineGame and TobiishiGame are also exported. Definition is idempotent and safe on a server, and custom tag names use subclasses. The definition entry reexports the element API. Existing language is an alias for lang; just-board is an alias for controls=false, with explicit controls taking priority. All off/false/no/0 spellings work. Every attribute reflects as a property; hyphenated names use justBoard and challengeJumps. Native lang already reflects its attribute.

The native player handle and structured game are available through player and game. GetGame and setGame delegate to the SDK. Options accepts every native MountOptions field, including validated host Game/Challenge values, custom palette, settingsHost and the original onChange(game, code) callback. Callback and presentation changes retain the same player and progress; puzzle inputs and structural settings-host changes start a new player. The SDK Player adds set for language/material/theme/justBoard updates, preserving internal challenge witnesses and selection.

## Puzzles, presentation and accessibility

Without an explicit challenge-jumps attribute, the classic English and triangle starts remain their classic positions; other shapes and subsequent new challenges use the seed. An explicit challenge length creates the initial solvable puzzle using the native generator, capped to one less than the board's holes. The original core engine, witness generation, hints and keyboard play are unchanged.

Display size is small/medium/large (320/480/640px). Width and label restore previous host values when removed. Theme follows the device or is light/dark, with separate native-material dark palettes; host palette overrides remain available. Page language changes are followed when no explicit language is given. Device/language listeners are removed on disconnect. Native keyboard controls, focus restoration and status announcements are preserved; no animation or timer is added.

## Events and frame validation

Tobiishi-change preserves its original game-shaped detail, now a JSON-safe snapshot that bubbles and composes. Tobiishi-load carries game and code, and tobiishi-error carries a plain message and a visible status. Host callbacks retain their original signature and immutable engine data. Frame messages use { type, detail }; hosts should verify the sender origin and frame.

The embed route validates shapes, materials, looks, both language aliases, booleans, bounded widths/challenge lengths, seeds and labels and ignores malformed fields. It has noindex, transparent margins, a device colour-scheme and no document scrolling. Builder heights allow switching to taller native boards. It reads no storage or external services; copied package imports use jsDelivr. The local preview/browser checks use port 6901 by default (PORT/TEST_PORT can select another allowed package port).
