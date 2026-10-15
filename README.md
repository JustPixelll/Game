# Bramblehaven · Guild & Grove

An original offline guild-town tycoon made for JustPixelll. **Version 2.0.0: Frontier.**

Build a productive town, prepare an adventuring guild, and earn the next road. This update addresses the first player's completed v1 playthrough: awkward placement, overflowing stores, nearly automatic expeditions, and a relic lottery after everything else was unlocked.

## Play and update

Install the separately supplied **signed** Android APK over the old application, without uninstalling. Export an important town from Settings first. The application ID and signing certificate must match the old release to update in place.

The portable browser edition is `dist/Bramblehaven.html`; open it in a current desktop browser. `web/` can also be served by a static HTTPS host. No account, advertising, analytics, purchases or external assets. The Android shell has no network permission and does not download updates.

**Your v1 town is preserved, not reset.** Existing resources, buildings, heroes, levels, equipment, research, relics, achievements and charter progress migrate. Production then follows v2 rules. A rich completed town is not representative of a fresh Frontier campaign.

For the new challenge, use **Settings → Start a fresh Frontier campaign**. This asks for `NEW`, archives the retiring town locally, and starts without carried wealth or discoveries. **Settings → Town archives** can restore the original v1 snapshot or the last retired town, with confirmation. Storage failures are reported; a failed retirement archive prevents replacement. These local copies do not survive clearing app data or uninstalling: keep JSON exports too.

## What changed

### Build deliberately

Choose a blueprint, tap a diamond to preview it, then **Confirm build**. Nothing is spent on the initial tap. The four diagonal nudge buttons move the draft by one tile. Drag to pan; pinch, wheel or use the zoom buttons. Relocation is free and preserves level/priority.

Plan view replaces tall roofs with named footprints, levels and connection information. It turns on during construction and can also be toggled explicitly. The blueprint preview shows staffing, roads, terrain, active neighbourhood combinations and the change in net resource flow. Cyan outlines show potential neighbours, not guaranteed active bonuses.

All building art uses a consistent `(48, 88)` ground anchor. Moving residents and buildings share depth order; selection uses actual sprite pixels.

### Make supplies and workers count

Every workplace draws from one finite workforce. Priorities allocate hands; pausing frees them. Extra buildings do not create workers. Housing adds workers but increases food consumption. Upgrades require more hands and inputs.

A continuous edge-connected path to the hearth is necessary for production. Terrain and active neighbourhood combinations improve output **without** increasing inputs. Both neighbours must be connected, unpaused and at least half staffed. A good arrangement saves labour and materials rather than merely making already-full stores fill faster.

The Ledger shows actual current rates, worker allocation and reserves. Food reserves protect stock from workshops/shops, but residents still eat. Explicit expedition departures, construction and trade spend the stock shown in their costs. Outdoor farms yield less in winter; rain helps. Early shortages can be relieved by a safe local gathering trip.

Gold finances wages, upkeep, buildings, training, research and repairs. Wood and ore feed the forge; gear is spent on equipment tiers, repairs, advanced buildings and later journeys. Insight is needed for research, briefings and stardust production. The merchant only carries a limited dawn-restocked supply of basic materials; advanced goods cannot be bought.

Storage starts at 160 per material (gold excluded). An unpaused storehouse adds 180 plus 60 per upgrade level. Existing over-cap stock is kept, but new output cannot increase it. A physically full workshop stops consuming inputs and remains eligible for equipment/research interactions when otherwise operational.

### Prepare for the frontier

Every next region requires the previous guardian. Victories unlock land permits, research, higher gear tiers and level caps. Merely accumulating crowns cannot bypass those gates. Party size remains one to three; research adds concurrent expedition slots, not extra people in one party.

Regional expertise counters terrain hazards. Protection helps on guardian encounters. Level, equipment tier, equipment condition, regional talents, research, approach and supplies affect the preview. Every party member must meet the route's equipment requirement. A minimum party-power check prevents hopeless attempts; Bold needs a power advantage.

Provisioning is separate from approach: **Light / Standard / Well supplied** changes food/spare-gear spending, odds and wear. **Careful / Steady / Bold** changes odds, duration, loot and wear. Bold is not a free upgrade: its success ceiling is 88%. Optional route decisions can make further trade-offs. The very first Steady scouting journey with normal or better supplies is guided; later trips are not guaranteed.

Wear reduces equipment power. Repairs restore it for a material cost. Retreat costs supplies and extra condition, but does not kill a character. Local gathering is free and safe, even with broken equipment; it grants basic supplies, not expedition progress or XP.

First clears of landmarks one, three and the guardian guarantee that region's three relics. Already-cleared regions can be surveyed for a specified missing relic using a staffed museum and extra insight. Return journeys do not repay first-clear progression rewards. The final guardian requires an operating Wayhome beacon.

## Included content

23 building types, 6 land expansions, 12 neighbourhood combinations, 14 research projects, 8 adventurers, 7 regions with 4 landmarks each, 21 relics, 29 achievements and 15 main charter chapters. Optional legacy towns retain relics and grant a capped production bonus. Original code-drawn art, generated optional audio, local autosaves, previous-save recovery and portable checksummed JSON backups.

Only **Pause / Resume** are available. No fast-forward. A day lasts 120 real seconds at normal speed. Away progress is capped at ten real minutes; a paused town stays paused. Existing missions can finish, but no new missions start by themselves.

## Build and test

Runtime: no package dependencies. Development: Node 22+, Python 3.11+, Chromium/Playwright. Android: JDK 21 and SDK platform 35/build-tools 35.0.0.

```sh
node --test tests/engine.test.cjs
node scripts/opening-check.cjs
node scripts/campaign-check.cjs
python3 scripts/make-icons.py
python3 scripts/bundle.py
python3 tests/ui_smoke.py
bash scripts/build-android.sh
```

The full campaign script advances simulation time and uses ordinary game actions. It does not grant resources, levels, research or victories. It is a deterministic feasibility policy, **not** an estimate of human completion time, optimal strategy, or a substitute for human balancing. The engine suite uses explicit rich fixtures only to isolate mechanics.

The UI suite tests five viewports (390×844, 360×740, 1440×960, 844×390 and 1340×1000), actual pointer interactions, confirmation, dragging, nudging, modal controls and save migration. It uses `set_content` and an in-memory localStorage shim. It is **not** a physical-phone, browser-restart or Android-document-picker persistence test. `CHROMIUM_PATH` can select an installed browser executable. CI installs Playwright and Chromium.

The migration fixture is synthetic and produced with the actual v1 engine; it is not the player's personal save.

## Source layout

- `web/content.js`: content, progression gates and tuning data.
- `web/engine.js`: deterministic simulation, transactions and save migration.
- `web/art.js`: sprite projection, depth order, hit-testing and camera input.
- `web/app.js`, `web/style.css`, `web/index.html`: interface, save handling and lifecycle.
- `android/`: permission-free native WebView with document-picker export/import.
- `scripts/`: bundling, icon generation, Android compilation and ordinary-action checks.
- `tests/`: regression tests and browser checks.

## Android signing

The pipeline builds an **unsigned** APK and emits the Android SDK's `apksigner.jar`. Unsigned APKs are not installable releases. Sign privately using the original key; **never put a keystore or its password into this public repository**.

```sh
java -jar apksigner.jar sign --ks /PRIVATE/bramblehaven.keystore \
  --ks-key-alias bramblehaven --out Bramblehaven-v2.0.0.apk \
  Bramblehaven-v2.0.0-unsigned.apk
java -jar apksigner.jar verify --verbose --print-certs Bramblehaven-v2.0.0.apk
```

The application ID remains `net.justpixelll.bramblehaven`, with versionCode `20000`. Signing prompts for the password. Verify that the resulting certificate fingerprint matches the previously installed release.

The hosted HTTPS edition uses explicit versioned service-worker updates. The portable and bundled Android editions do not fetch code from a host. Save format version and application release version are separate.

## Limits and license

This remains an independently built playable game, not a claim of commercial-scale polish. No multiplayer, action-combat minigame, cloud sync or app-store distribution. The v2 economy is intentionally a new balance pass and still needs human feedback. No physical Android phone was available in the authoring environment. Older WebViews may need updating.

MIT. All art and code are original; no Kairosoft assets or proprietary code are used.
