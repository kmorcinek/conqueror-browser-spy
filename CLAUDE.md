# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                    # run all tests (Mocha + ts-node)
npm run build               # TypeScript compile to lib/
npm run lint                # ESLint check
npm run lint-and-fix        # ESLint with auto-fix
npm run format              # Prettier format src/test/types
npm run browserify          # bundle to lib/output.js (for browser deployment)
```

Run a single test file:
```bash
npx mocha -r ts-node/register tests/ArmyMarcher.test.ts
```

## Architecture

Browser extension/bookmarklet for the online strategy game conquerorgame.com. TypeScript compiled via Browserify into a single `output.js`, served from AWS S3. A bookmark injects the script into the game page.

**Entry point:** `src/index.ts` — instantiates `ConquerorSpy` with all subsystems.

**Layers:**

- **Core game state** (`src/*.ts`) — `Province`, `ProvinceOwnership`, `Season`, `ProvincesParser`, `Globals` — parses and tracks live game DOM state
- **AI** (`src/ai/`) — `AiManager` orchestrates `ArmyMoverAi`, `OpponentAttacker`, `NeutralAttacker`, `ProvinceProductionAi`; `backland/` handles remote territories
- **Map analysis** (`src/ProvinceNeighborhood/`) — graph of adjacent provinces; `EuropeMapProvinceNeighborhoodProvider` and `TinyMap...` are the two concrete maps
- **Strategic distances** (`src/StrategicDistance/`) — BFS-style distance calculations from capitals
- **UI/automation** (`src/*.ts`) — `Hud`, `Clicker`, `BuildingChanger` automate browser clicks and display overlays
- **Statistics** (`src/statistics/`) — per-game and cross-game analytics

**Test framework:** Mocha + Chai, TypeScript via `ts-node/register`. Tests live in `tests/`.

**Deployment:** `sh build_deploy.sh` (requires AWS credentials) then tag: `git tag v1.x && git push origin --tags`.
