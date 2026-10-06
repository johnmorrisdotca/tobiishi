# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- The API reference page wraps a long entry path instead of running about 2 px wider than a 360 px screen. Nothing the package exports has changed.

## [0.2.2] - 2026-10-05

Nothing that was exported has changed.

### Added

- A test holds every `@johnmorrisdotca/tobiishi@N` version pin in the README to this package's major version.

### Changed

- The family's list, in the README and in the demo's footer, names all twenty-four packages, Karakuri and Houseki included.
- The npm description is one sentence of 250 characters or fewer, so npm and its search show it whole; it is also the repository's About text. `homepage` is the demo site and `author` is `"John Morris"`, the same in every package.
- The GitHub Actions workflows use the current versions of the actions (checkout 7, setup-node 7, pnpm/action-setup 6; configure-pages 6, upload-pages-artifact 5 and deploy-pages 5 for Pages), which clears GitHub's Node 20 deprecation warning.
- The README has the family's sections in the family's order (In 30 seconds, Features, Use it in your project, API, Theming, Limits, Browser support, Languages, Roadmap, Architecture, Where it comes from, Changes), the family list sits under "Where it comes from", and a test holds it to them.
- ESLint joins the checks, as in the other packages (`pnpm lint` is part of `pnpm check`), the scripts run through `pnpm` rather than `npm run`, `pnpm test:demo` builds the demo and runs the browser tests, and Playwright is 1.63.

## [0.2.1] - 2026-10-05

- A started challenge no longer says its number of jumps twice ("Hard · 9 jumps · 9 jumps").
- The pack, difficulty and target-hole selects are styled like the board and piece settings.
- One CI workflow, not two, runs on a push to main and on a pull request; the release's notes are the changelog's section.
- The demo, its README family list and its tests are the family's own: the shared header, footer and list of twenty-two, written from one template.
- Complete package presentation: desktop and phone screenshots, badges, demo/API links, targeted keywords and linked MIT licence.
- Source-derived API reference and public API comments, contribution/security files, and a package presentation gate.

## [0.2.0] - 2026-10-05

- Nine named board packs with three target holes and three short, witnessed challenge lengths per pack: 81 solvable starts.
- English/Japanese target-hole selection and device-local progress for named challenge runs.

## [0.1.0] - 2026-10-04

First release candidate: immutable peg solitaire engine, nine board shapes,
seeded proof-carrying challenges, heart/star/hexagon outlines and configurable rectangles, bounded solver, SVG materials, accessible
English/Japanese play, custom element, save/replay validation, and demo.

