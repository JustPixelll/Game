# Bramblehaven · Guild & Grove

An original, offline guild-town tycoon made for JustPixelll. Build a little frontier town, make its production chains work, send adventurers into the wilderness, and collect the things they bring home. Version **1.0.0**.

## Play

Open `dist/Bramblehaven.html` in a current desktop browser, or install the separately supplied **signed Android APK**. The browser edition can also be served from `web/` using any static HTTPS host, with no backend. No account, advertising, analytics, purchases, downloaded assets, or network permissions in the Android app.

Start by founding your town and following the gold **Town charter** card. Your first lumber camp and smallholding open the way to a guild. Stone paths are free. Tap buildings to inspect their production, upgrade, move, pause, or dismantle them. A disconnected workplace still runs, but less efficiently. Expedition decisions are optional; rewards are awarded once, even when you are away. Try 2× speed once you have your bearings.

### What is in this build

- An animated, pannable/zoomable isometric island with **23 building types** (including the hearth and free paths), six land expansions, production chains, staffing, happiness, seasons, and four upgrade levels; research opens level five.
- **12 discoverable neighbourhood combinations**, **14 research projects**, trade, repeatable contracts, and visiting events.
- **8 recruitable adventurers**, party composition and regional talents, training, five equipment tiers, three expedition approaches, optional route decisions, and **7 regions with 4 landmarks each**.
- **21 collectible relics**, a museum that benefits from discoveries, **29 achievements**, and **15 main charter chapters** with an ending and optional legacy towns. Legacy retains relics and grants a capped permanent production bonus.
- Synthesized optional music and sound effects. Original code-drawn buildings, portraits, moving residents, weather, and day/night effects. No external art or font dependency.
- Autosave, previous-save recovery, checksummed JSON backups, confirmation before import/reset, offline progress capped at two real hours at half simulation speed. Pause disables away progression.

## Controls

Phone: tap plots or buttons, drag the map, pinch to zoom. The map remains above the management panel. Desktop: drag/pinch/wheel, use `1`–`5` for tabs, Escape to cancel/close, and Space to pause when no input is focused. The map also has explicit zoom and centre controls.

## Saves and updates

Saves are local to this browser profile or Android installation. **Export a backup from Settings before uninstalling, clearing application/browser data, changing devices, or replacing an APK.** Exported JSON is interchangeable between the two editions. Import is validated and asks before replacing a town. A checksum detects accidental damage; it is not anti-cheat or encryption.

Android uses a stable application ID (`net.justpixelll.bramblehaven`). Installing a higher-version APK signed with the **same private key** preserves the installation's save. A different signing key will not update it in place. Keep the separately supplied private signing backup confidential and outside this public repository. Never commit a keystore or password. The checked-in pipeline builds an **unsigned** APK by default. It is not an installable release until signed.

The hosted HTTPS web edition includes a versioned service worker. It offers a ready update in Settings instead of silently reloading mid-game. The portable HTML and bundled Android edition do not fetch web updates.

## Source layout

```
web/content.js       Buildings, heroes, regions, relics, research, objectives
web/engine.js        Deterministic simulation; no DOM, network, or timers
web/art.js           Original canvas art, portraits, map renderer and input
web/app.js           Interface, sounds, save handling and lifecycle
web/style.css        Responsive desktop/phone interface
web/sw.js            Explicit, versioned offline web updates
android/             Permission-free native WebView + Android document picker
scripts/bundle.py    Produce one portable HTML from the same sources
scripts/build-android.sh  Compile without Gradle or runtime dependencies
tests/               Engine regression suite and browser interaction checks
```

## Build and test

Node 22+, Python 3.11+, and a recent Chromium are used for development. The shipped browser game has no package install step.

```sh
node --test tests/engine.test.cjs
python scripts/bundle.py
python -m http.server 8765 --directory web
# Open http://localhost:8765 on your own computer.
```

The UI test uses Playwright (`pip install playwright`; `playwright install chromium`). Set `CHROMIUM_PATH` to a specific executable if necessary. Run `python tests/ui_smoke.py` after bundling. It loads the portable HTML into a real Chromium page, with an in-memory localStorage shim because the original test environment blocked URL navigation. Engine tests independently verify serialization and corruption recovery. This smoke test is not a physical-device or browser-restart persistence test.

To build Android, install JDK 21 and Android SDK platform 35/build-tools 35.0.0, set `ANDROID_HOME`, then run `bash scripts/build-android.sh`. The GitHub Actions workflow does this and preserves unsigned build artifacts. It also emits the SDK's `apksigner.jar`, so the owner can sign the APK privately. The private key is deliberately not created inside a public CI log or committed to the repo.

```sh
java -jar apksigner.jar sign --ks /PRIVATE/bramblehaven.keystore \
  --ks-key-alias bramblehaven --out Bramblehaven-v1.0.0.apk \
  Bramblehaven-v1.0.0-unsigned.apk
java -jar apksigner.jar verify --verbose --print-certs Bramblehaven-v1.0.0.apk
```

Signing prompts for the secret password. For future versions, bump the Android manifest's versionCode/versionName, the game version, and the web cache version together; update artifact filenames in the build script/workflow. Saves use a separate schema version.

## Scope and known limits

This is a complete first playable build, not a claim of commercial-scale polish. It has no combat minigame, multiplayer, cloud sync, notifications, or app-store distribution. Expeditions are management decisions resolved by party strength, approach, and seeded chance. In-game time is deliberately compressed. The balance has automated opening-loop checks, but has not been validated by weeks of human playtesting. Older WebViews may need updating. No physical Android device was available in the authoring environment.

## License

MIT. Original game code and art are in this repository; no Kairosoft assets or proprietary code are used. The genre reference informed the management/progression direction, not a recreation of a particular game.
