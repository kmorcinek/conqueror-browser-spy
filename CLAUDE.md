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

## Viewing Sentry Logs

Token is stored in `sentry.token` (gitignored). Org: `naizz`, project ID: `4511347682705408`, region: US (`sentry.io`).

When waiting for logs to appear (e.g. after manual trigger), poll for at most 1 minute. If no logs arrive within that time, assume they won't come.

```bash
TOKEN=$(cat sentry.token)

# Unresolved issues
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/organizations/naizz/issues/?limit=20&query=is:unresolved&project=4511347682705408" \
  | python3 -c "
import json, sys
for i in json.load(sys.stdin):
    print(f\"[{i['level'].upper()}] {i['title']} (count={i['count']}, last={i['lastSeen']})\")
"

# Specific issue details
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/issues/ISSUE_ID/" \
  | python3 -c "import json, sys; i = json.load(sys.stdin); print(i['title']); print(i.get('culprit','')); print(json.dumps(i.get('metadata',{}), indent=2))"

# Latest events for an issue
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://sentry.io/api/0/issues/ISSUE_ID/events/latest/" \
  | python3 -c "
import json, sys
e = json.load(sys.stdin)
for ex in e.get('entries', []):
    if ex['type'] == 'exception':
        for v in ex['data']['values']:
            print(v.get('type'), v.get('value'))
            for f in (v.get('stacktrace') or {}).get('frames', []):
                print(f'  {f.get(\"filename\")}:{f.get(\"lineno\")} in {f.get(\"function\")}')
"
```
