# Changelog

## 2.0.0 — Frontier

Built around the first complete v1 playthrough: messy placement, runaway production, irrelevant preparations, and a relic-retry endgame.

### A readable town
- Rebuilt every building around the same projected ground anchor. Footprints, walls, roofs and attached details now use a consistent projection.
- Buildings and moving residents share depth order. Building selection tests opaque sprite pixels instead of overlapping rectangular roof boxes.
- Flat plan view hides tall buildings while retaining named footprints, levels and road access.
- Selecting a plot creates a reversible draft. Only **Confirm build/move** spends resources or changes the town. Nudges adjust the exact plot; dragging only pans.
- Blueprint preview shows road access, actual staffing, terrain/neighbourhood effects, input costs and the change to the town's net production, including displaced workers.

### A constrained economy
- Each workplace is assigned a finite number of residents. High/Normal/Low priorities decide which workplaces receive scarce hands. Pausing frees them.
- Buildings without a connected road produce nothing. Housing creates workers **and** mouths to feed. Upgrades increase staffing and inputs as well as output.
- Neighbourhood and terrain bonuses improve **yield**, not input consumption. They are useful ways to conserve scarce supplies and workers.
- Reduced starting capital, fixed hearth output, moderated level scaling, smaller rewards and storage, wages and upkeep. No passive renown growth or repeat-building renown farming.
- Food reserves stop shops and workshops consuming the residents' protected provisions. Ledger rates include actual shortages and storage limits.
- Merchant stocks are finite and basic-only. Advanced equipment, insight and stardust need local production or field rewards.

### A frontier worth preparing for
- Each next region requires the previous guardian. Research, higher gear tiers, guild level caps, advanced buildings and land permits are tied to victories rather than wealth alone.
- Region hazards favour Scouting, Engineering or Lore; Protection helps against guardians. Minimum power and equipment checks prevent naked retry-spam past preparation.
- Light / Standard / Well supplied provisions change real departure costs, success odds and equipment wear. Bold requires an advantage, has lower odds, higher wear, and a ceiling of 88% success.
- Condition affects equipment power. Repairs consume materials. Retreat loses supplies and condition but never permanently removes a hero.
- Free local gathering provides a recovery route without campaign progress or XP.
- First, third and guardian landmarks guarantee the region's three relics. Museum surveys can deliberately recover a missing relic in an already-cleared region.
- The last guardian requires a connected, staffed and fuelled Wayhome beacon.

### One speed and safe updates
- Removed 2x/4x. Only **Pause / Resume** remain. Old speed-up settings migrate to normal; old pause stays paused.
- Versioned v1-to-v2 save migration preserves towns, stock, heroes, gear, research, relics, achievements and progress. A v1 original snapshot is retained on-device when storage is available.
- Fresh Frontier start has explicit confirmation and archives the retiring town. Archives can be restored through an import confirmation. Important towns should still be exported as files.
- Away simulation is capped at ten real minutes at normal speed, instead of two hours of surplus generation. A paused town stays paused.
- Same Android package ID. Updates must retain the original private signing key. No secrets are committed or created in CI.

### Verification
Engine regression tests, an ordinary-action opening, a full deterministic campaign policy, five Chromium viewport interaction checks, and migration/archive/restore checks. These are not physical Android device tests or a guarantee of human balance. See build artifacts and README for the exact scope.

## 1.0.0
Original Guild & Grove playable release: town building, production, guild expeditions, relics, research, charter, achievements and optional legacy towns.
