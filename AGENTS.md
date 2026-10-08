# AGENTS.md: FocusPocus

Guide for AI agents (and humans) working in this repository. It describes **how the app works today**: features, architecture, persisted state, message flow and build. Update this file whenever you change a behavior described here.

---

## 1. Overview

**FocusPocus** ("Stay focused as if under a magical spell") is an open source browser extension for **Chrome (Manifest V3)** and **Firefox (Manifest V2)**. It helps users stay focused with a **focus timer**: while the timer runs, distracting websites are covered by a blocking screen. Completing sessions builds a **streak**; giving up resets the whole streak.

- Published name: `FocusPocus: Block Distractions & Stay Focused`
- Current version: `1.1.2` (in `package.json` and both manifests; keep the three in sync)
- Original author: `@jotavetech`. Current remote: `gugeldev/focus-pocus`
- Published on the [Chrome Web Store](https://chromewebstore.google.com/detail/focuspocus-in-magical-foc/mhfhegccdlndlipjicelombmchnpdebc) and [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/focuspocus-in-magical-focus/)
- License: **MIT** (`LICENSE`). The `license` field in `package.json` says `ISC` and is outdated.
- **Language: everything in this repository is in English**: code, comments, UI text, docs and commit messages (see section 5).

---

## 2. Features

### 2.1 Focus timer (popup)
- The popup shows the remaining time inside a circular progress ring, as `mm:ss` or `h:mm:ss` (times with hours use a smaller size so they fit the ring). The default is **15 min** (`900` s).
- **Duration presets** are a segmented control of radios: **1m, 15m, 25m, 30m, 45m, 1h**. Picking one saves `selectedTime`.
- **Custom time:** while the timer is stopped, clicking the time swaps it for a text input (up to 8 characters). `Enter` or blur parses it (`ss`, `mm:ss` or `hh:mm:ss`, digits only) and, if it is more than 0 seconds, saves it as `selectedTime`; `Esc` cancels. A custom time selects no preset (the thumb fades out) and the caption above the time reads "Custom session"; otherwise the idle caption is empty. The "Click to customize" hint below the time only appears on hover or focus.
- **Mode:** a full-width Blocklist / Allowlist segmented control, above the presets, that writes `options['allowlist-mode']`.
- **Start focusing** button: starts the session. During the session the same button becomes **Give up** (danger style).
- Everything that changes between idle and a session hangs off `body[data-state="idle" | "running"]`, set by `src/popup/index.ts`. During a session:
  - the accent progress ring appears and empties as time passes;
  - the presets, the mode control and the custom time are disabled;
  - the caption shows a random motivational message (`src/utils/do-not-giveup.ts`), picked when the session starts or when the popup opens mid-session;
  - the extension icon changes to `icon-32-active.png` (Chrome only; see 3.4).
- When `streak` goes up while the popup is open, it plays the victory sound and the streak counter bumps.
- The timer tick runs in the **background** and keeps going with the popup closed. The popup re-renders on every change to `timer`, `isRunning`, `selectedTime`, `streak` or `options`. Start, stop and give up are written by the popup itself (see section 3).

### 2.2 Website blocking (content script)
There are two modes, toggled by the Blocklist / Allowlist control in the popup or the "Allowlist mode" switch in the options:
- **Blocklist mode** (default): blocks the page if the current URL **contains** any `blocklist` entry.
- **Allowlist mode**: blocks **every** page whose URL **does not contain** any `allowlist` entry.
- Matching uses `window.location.href.includes(entry)`: substring matching, not exact domains.
- The "block" is the **focus screen** (`src/content/overlay.ts`): a `div#focus-pocus-overlay` host appended to `<html>` with an open **shadow root**, so the page's CSS cannot restyle it and its CSS cannot leak into the page. It is fixed, full screen, at the maximum `z-index`, blurs the page behind it and shows the logo and the remaining session time live. The logo comes from `assets/logo/` (a web-accessible resource in both manifests).
  - Its styles are `src/content/overlay.css`, bundled into `content.js` as a string (see section 4) and injected into the shadow root. They repeat the colors of `static/shared/base.css` because a shadow root cannot see the extension's stylesheets. The `:host` rules are `!important`: a page rule that matches the host beats a normal `:host` rule, but not an important one.
  - A shadow root cannot declare `@font-face`, so the overlay registers Plus Jakarta Sans on the page's `document.fonts` under the private name `FocusPocus Jakarta`, loaded from `assets/fonts/` (a web-accessible resource in both manifests). If it fails, the system font stack takes over.
- The content script runs on `<all_urls>`. On page load it applies the overlay if `isRunning` is already `true`. Then it reacts through `storage.onChanged`: when `isRunning` becomes `true` it applies the overlay, when it becomes `false` it fades it out, and every `timer` change updates the countdown. List or mode changes update the in-memory copy but only take effect on the next evaluation.

### 2.3 Streak
- Each **completed** session adds +1 to `streak`.
- **Giving up** (clicking Give up during a session) **resets** the streak to 0.
- The streak shows in the popup header (a flame pill) and in the options sidebar (a card at the bottom).
- **Share:** clicking either one copies a ready-made text to the clipboard (`src/utils/share-streak.ts`: "My current streak on the FocusPocus extension is N! 🎯…" or, with streak 0, "I'm starting my streak…") and confirms with a toast.

### 2.4 Sounds and notifications (opt-in)
They live in the **General** tab of the options. All start **off**, because `options` does not exist until the user flips a switch or the popup mode button:

| Switch (UI)                       | Key in `options`          | Effect                                              |
| --------------------------------- | ------------------------- | --------------------------------------------------- |
| Sounds › Start and give up        | `button-sound`            | plays `assets/sounds/press.mp3` on start/give up    |
| Sounds › Victory                  | `victorious-sound`        | plays `assets/sounds/finished.mp3` on completion (see 3.2, step 5) |
| Sounds › Giving up                | `give-up-sound`           | plays `assets/sounds/lose.wav` on give up           |
| Notifications › Session finished  | `victorious-notification` | "Finished a session! Now you can take a break!" notification (Chrome only; in Firefox `streak.ts` throws on `browser.action` before creating the notification) |
| Blocking › Allowlist mode         | `allowlist-mode`          | toggles blocklist/allowlist (see 2.2)               |

Each switch is a `label.row` wrapping a `.switch` with an `input[type=checkbox]`. **The input `id` is the key** saved in `options`, so adding a new option only takes a new row with a new id and reading `options[id]`.

### 2.5 Options page (Settings)
Opened from the popup gear (`runtime.openOptionsPage()`). In Firefox it opens in its own tab. The layout is a **sidebar** on the canvas next to a **content pane** (modeled on the maintainer's heysusi desktop settings). Below 760px wide the sidebar becomes a top bar.
- **Sidebar:** brand, three tabs (General, Blocklist, Allowlist; the lists show their entry count), the streak card (click to copy) and the support link (`https://www.pixme.bio/jotavetech`).
  - One `.nav-indicator` surface slides to the active tab (`src/options/tabs.ts`). Its offset is computed from the tab index (`--active-tab`), never measured. Each tab names its page with `aria-controls` and its hash with `data-hash`; the open tab is mirrored in the location hash, so `#blocklist` opens the blocklist directly (`#general`, `#blocklist`, `#allowlist`).
- **General:** the switches of 2.4, grouped in Sounds, Notifications and Blocking. While a session is running, the Allowlist mode switch is **disabled** and a notice explains why.
- **Blocklist / Allowlist:** a form to add a website and the list. Rows show the site icon, the entry and a remove button that appears on hover or focus. Rows animate in and collapse out. An empty list shows an empty state. The page of the active mode carries an "Active mode" badge.
  - The icon is the site's own `https://<host>/favicon.ico`, loaded straight from the site (no third-party favicon service, so the list never leaves the browser except to the listed sites). It only loads when the entry looks like a domain; otherwise, or if it fails, the tile shows the first letter of the host.
- List rules:
  - the value is trimmed; empty and duplicate values are rejected (error toast);
  - **you cannot add or remove entries while focus mode is running** (inputs and remove buttons disabled, a notice, plus an error toast);
  - otherwise the text is saved as typed, without normalization.
- `body.is-running` and `body.allowlist-mode` are the page-level switches the CSS reacts to. The running lock lives in `src/options/session-lock.ts`: every control with `data-locks-while-running` is disabled during a session (rows created later call `makeLockable`).
- Toasts come from `src/utils/toast.ts` (no dependency): bottom center, 2.4 s, red for errors. They need a page that links `static/shared/base.css`.

---

## 3. Architecture

```
src/
├── background/           # "background" entry: service worker (Chrome) / background script (Firefox)
│   ├── index.ts          # message listener, 1 s setInterval, seeds storage defaults
│   └── services/
│       ├── timer.ts      # start/stop/give up, changeSelectedTime, checkAndStopTimer
│       └── streak.ts     # increments/resets the streak and fires the victory notification
├── content/              # "content" entry
│   ├── index.ts          # decides whether the page is blocked, keeps the countdown in sync
│   ├── overlay.ts        # the focus screen: shadow-root host, font loading, show/hide
│   └── overlay.css       # focus screen styles, bundled as a string
├── popup/                # "popup" entry
│   ├── index.ts          # timer ring, presets, custom time, mode, start/give up, celebration
│   └── elements.ts       # popup querySelectors
├── options/              # "options" entry
│   ├── index.ts          # blocklist/allowlist CRUD, streak card
│   ├── session-lock.ts   # disables every [data-locks-while-running] control and sets body.is-running
│   ├── options.ts        # switches <-> storage.options
│   ├── tabs.ts           # tab switching, sliding nav indicator, location hash
│   └── elements.ts       # options querySelectors
├── types/css.d.ts        # `import css from './x.css'` is a string
└── utils/
    ├── do-not-giveup.ts
    ├── segmented.ts           # moves a segmented control's thumb to its checked radio
    ├── share-streak.ts        # bindStreakButton: shows the stored streak, copies it to share
    ├── format-time.ts         # "mm:ss" / "h:mm:ss", shared by the popup and the focus screen
    ├── play-popup-sounds.ts   # playSound("giveup" | "finished" | "button"), respects the switches
    ├── storage.ts             # typed storage.local contract: getStorage, setStorage, onStorageChanged, seedStorageDefaults
    ├── messages.ts            # typed background message contract: sendTimerMessage, onTimerMessage
    ├── toast.ts               # dependency-free toast, styled by static/shared/base.css
    └── language.ts            # en/pt dictionaries, NOT used anywhere yet (planned i18n)

static/                   # copied as-is to dist/<browser>/
├── shared/base.css       # design tokens, font, reset and shared controls (see 5.1)
├── popup/  index.html + styles.css   (320px wide popup)
├── options/ index.html + styles.css
└── assets/
    ├── logo/  icon-16/32/64/128.png, icon-32-active.png
    └── sounds/ finished.mp3, lose.wav, press.mp3
# assets/fonts/ and assets/phosphor/ are not in static/: webpack copies them from node_modules
# (@fontsource-variable/plus-jakarta-sans and @phosphor-icons/web) at build time.
```

- The code is **framework-free TypeScript**: plain DOM, `querySelector` and `innerHTML` (never with user text: list entries go through `textContent`).
- Icons come from [Phosphor](https://phosphoricons.com) through its icon font (`@phosphor-icons/web`): `<i class="ph ph-gear-six">` (regular) or `<i class="ph-fill ph-flame">` (fill). Never hand-write SVG icons. The only inline SVG is the popup's progress ring.
- Every extension API goes through **`webextension-polyfill`** (`import browser from 'webextension-polyfill'`), which provides a Promise-based API. **It does not unify `action`/`browserAction`:** the code calls `browser.action.*`, which only exists in Chrome MV3. In Firefox MV2 those calls throw `TypeError`.
- **All storage access goes through `src/utils/storage.ts`:** `getStorage(keys)`, `setStorage(values)` and `onStorageChanged(listener)` use the `StorageState` interface (table 3.1). Do not call `browser.storage.local` outside that module.
- **All background messages go through `src/utils/messages.ts`:** `sendTimerMessage(type)` on the sending side and `onTimerMessage(listener)` in the background, which ignores anything that is not a valid `TimerMessage`. Do not call `browser.runtime.sendMessage`/`onMessage` directly.
- **Heads-up:** `popup/index.ts` imports straight from `background/services/timer.ts`. In practice **start, stop and give up run in the popup context**: the popup writes to storage and messages the background. The background only runs the `setInterval` tick and handles session completion.

### 3.1 State (`browser.storage.local`)
Storage is the **source of truth**. Every context syncs through `storage.onChanged`.

| Key            | Type                      | Default | Meaning                                    |
| -------------- | ------------------------- | ------- | ------------------------------------------ |
| `timer`        | number (s)                | `0`     | seconds elapsed in the current session     |
| `selectedTime` | number (s)                | `900`   | chosen duration                            |
| `isRunning`    | boolean                   | `false` | session active                             |
| `streak`       | number                    | `0`     | consecutive completed sessions             |
| `blocklist`    | string[]                  | –       | substrings blocked in blocklist mode       |
| `allowlist`    | string[]                  | –       | substrings allowed in allowlist mode       |
| `options`      | `Record<string, boolean>` | –       | switches (see 2.4)                         |

The defaults for `timer`, `selectedTime`, `isRunning` and `streak` are written by `seedStorageDefaults()` (`src/utils/storage.ts`) when the background loads; existing values are kept. That is why those four keys are required in `StorageState` and the others are optional.

### 3.2 Session lifecycle
1. **Start** (popup → `handleStartTimer`): writes `{ isRunning: true, timer: 0 }`, sends `TIMER_STARTED` and switches to the active icon.
2. **Background** receives `TIMER_STARTED` and creates a 1 s `setInterval`. Each tick does `timer + 1`.
3. **Content scripts** see `isRunning: true` and apply the overlay if the URL matches the mode's rule.
4. **Popup** (if open) sees `timer` change and re-renders the remaining time (`selectedTime - timer`).
5. **Completion** (`timer >= selectedTime`):
   - the background calls `getStreakAndIncrement()`, which adds +1 to the streak and fires the notification if enabled;
   - writes `isRunning: false`;
   - the interval is cleared directly in the background (`src/background/index.ts`);
   - `checkAndStopTimer()` calls `stopTimer()`, which resets `timer` and restores the normal icon. The `TIMER_FINISHED` it sends from here reaches nobody, because a context does not receive its own messages;
   - victory sound: the popup plays it when it sees `streak` go up, so it only plays with the popup open. The background's own `playSound("finished")` in `checkAndStopTimer()` never plays: in Chrome `Audio` does not exist in an MV3 service worker, and in Firefox `stopTimer()` throws on `browser.action` before reaching it.
6. **Give up** (click while `isRunning`): `stopTimer()`, `resetStreak()` (streak = 0) and the give-up sound.
7. Every time the popup opens during an active session it re-sends `TIMER_STARTED`. That recreates the interval if Chrome unloaded the service worker.

### 3.3 Messages (`src/utils/messages.ts`)
| `type`           | Sent by               | Effect in the background                              |
| ---------------- | --------------------- | ----------------------------------------------------- |
| `TIMER_STARTED`  | popup                 | (re)starts the `setInterval` and sets the active icon |
| `TIMER_FINISHED` | `stopTimer()` (popup on give up; on completion it is sent by the background itself and ignored) | clears the interval and restores the normal icon |

### 3.4 Manifest differences
- `manifest.chrome.json`: **MV3**, `action`, `background.service_worker`, `options_page`.
- `manifest.firefox.json`: **MV2**, `browser_action` (with `default_icon`), `background.scripts`, `options_ui` with `open_in_tab`, CSP and `web_accessible_resources`.
- The code uses `browser.action` in both builds, but the Firefox manifest declares `browser_action` (see section 3).
- Permissions in both: `storage` and `notifications`. The content script runs on `<all_urls>` and injects `content.js` and `content/styles.css`.

---

## 4. Build and development

- **Package manager: bun only** (`bun.lock`, `"packageManager": "bun@1.4.2"`). Do not use npm, yarn or pnpm; there is no `package-lock.json`.
- **`bunfig.toml`:**
  - `install.minimumReleaseAge = 604800`: bun only installs versions published at least 7 days ago. It protects against compromised packages; do not remove it.
  - `run.shell = "bun"`: scripts run in bun's shell on every OS, so `BROWSER_TARGET=chrome webpack` works without `cross-env`.
- Build stack: **webpack 5 + webpack-cli 7 + ts-loader 9 + copy-webpack-plugin 14**. webpack runs on both Node and the bun runtime (`bun --bun run ...`).
- TypeScript **6** with `strict: true`, `target: es2022`, `module: ES2022`, `rootDir: ./src`.
- **Why not TypeScript 7:** TS 7 is the native (Go) compiler and lacks the JavaScript API that `ts-loader` uses, so the build breaks. To migrate, replace `ts-loader` with a transpile-only loader (e.g. `esbuild-loader` or `swc-loader`) and keep `tsc --noEmit` for type-checking.

```bash
bun install
bun run dev:chrome      # webpack --mode development  -> dist/chrome (watch)
bun run dev:firefox     # -> dist/firefox
bun run build:chrome    # --mode production
bun run build:firefox
bun run typecheck       # tsc --noEmit
bun run lint            # biome check .
bun run lint:fix        # biome check --write .
```

- How webpack works here (`webpack.config.js`):
  - the `BROWSER_TARGET` variable (`chrome` | `firefox`) picks the manifest, which is copied as `manifest.json`;
  - output goes to **`dist/<browser>/`**;
  - four bundles are generated: `popup.js`, `background.js`, `content.js` and `options.js`, all at the root of `dist`;
  - the HTML pages reference them as `../popup.js` and `../options.js`;
  - `static/` is copied whole, plus the Plus Jakarta Sans `latin` and `latin-ext` woff2 files into `assets/fonts/` and the Phosphor `regular` and `fill` stylesheets and woff2 files into `assets/phosphor/`;
  - `.css` files imported from `src/` are bundled as strings (`type: 'asset/source'`), which is how the focus screen gets its styles into a shadow root;
  - `output.clean` empties `dist/<browser>/` before every build, so removed files do not linger;
  - `DefinePlugin` injects `process.env.BROWSER_TARGET` into the bundles (not used in `src/` today);
  - **`watch: true` is hardcoded in the config**, so even the `build:*` scripts stay in watch mode (stop with Ctrl+C, or pass `--no-watch`: `bun run build:chrome --no-watch`);
  - `devtool: "source-map"`.
- **Loading the extension:**
  - Chrome: `chrome://extensions`, enable developer mode, "Load unpacked" and pick `dist/chrome`.
  - Firefox: `about:debugging`, "Load Temporary Add-on" and pick `dist/firefox/manifest.json`.
- **There are no automated tests.** Validate in the browser, on both builds.
- **Lint and formatting: Biome** (`biome.json`, same config as the maintainer's `obd` project):
  - single quotes, semicolons, trailing commas, 100-column lines, 2-space indentation;
  - `recommended` preset, plus `noExcessiveCognitiveComplexity`, `noUnusedVariables`/`noUnusedImports`, `useConst` and `useImportType` as errors;
  - Biome also checks HTML, CSS and JSON (`static/`, manifests);
  - override: `noDescendingSpecificity` is off for CSS. Component rules like `.toast .icon` and `.tab .icon` never match the same element, so the rule only produced false positives;
  - override: `src/content/overlay.css` may use `!important`, because the focus screen's host has to beat the page's CSS;
  - when a rule must be ignored locally, use `biome-ignore` **with the reason**.
- **Git hooks (husky):** `bun install` enables them through the `prepare` script.
  - `pre-commit`: `bunx biome check --staged --no-errors-on-unmatched --error-on-warnings`. **Warnings block the commit too**, including the rules `biome.json` sets to `warn`: `noNonNullAssertion`, `noExplicitAny` and `noConsole` (`console.error`/`warn`/`info` are allowed).
  - `commit-msg`: rejects subjects that are not Conventional Commits or that contain non-ASCII characters (a heuristic for "English only"; see section 5). It reads the subject after `git stripspace`, like git does, and lets git's default merge, revert, `fixup!`, `squash!` and `amend!` subjects through.
  - `pre-push`: `bun run typecheck`.
- **Dependencies:**
  - runtime: none;
  - dev: `webextension-polyfill`, `@fontsource-variable/plus-jakarta-sans` and `@phosphor-icons/web` are devDependencies but ship in the build (the bundle, the font and the icon font).
- `.gitignore` ignores `node_modules`, `dist`, `focus-pocus.zip`, `dist.crx` and `dist.pem`.

---

## 5. Conventions

- **Everything in English:** code, comments, UI text, docs (including this file) and commit messages.
- **Commits always follow [Conventional Commits](https://www.conventionalcommits.org):** `type(scope)!: subject`, in English, imperative mood, lowercase type.
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Examples: `feat(popup): add pause button`, `fix(content): remove overlay when session ends`, `build(deps): bump webpack`.
  - The `commit-msg` hook enforces the format. Older history does not always follow it.
- Files in `kebab-case.ts`. Popup and options each have an `elements.ts` that centralizes the type-cast `querySelector` calls.
- Functions in camelCase with verbose, descriptive names (`checkIfIsRunningAndSendAMessage`, `lockFocusSettings`).
- State is read with `getStorage([...]).then(...)` and written with `setStorage({...})` (from `src/utils/storage.ts`). Existing code uses `.then` instead of `async/await`.
- UI text is hardcoded in English in the HTML/TS. `language.ts` exists for a future i18n but is not wired up.
- Design rules: see 5.1.

### 5.1 Design system

The look is dark, violet and **minimal**, modeled on the maintainer's heysusi settings window: flat colors, no gradients, no glows, no decorative animation. Motion only explains a change of state. `static/shared/base.css` holds the tokens and the shared controls; page stylesheets only lay things out. A color, radius, duration or control that is not a token there is a smell.

- **Font:** Plus Jakarta Sans (variable), self-hosted. Never load fonts from a CDN.
- **Surfaces** stack in one direction, never pure black: `--sunken` → `--canvas` → `--surface` → `--raised` → `--raised-hover`. Separation comes from surface and space; hairlines (`--border`) only divide content inside a surface.
- **Text** has three levels plus the placeholder: `--text`, `--text-muted`, `--text-faint`, `--text-placeholder`.
- **Accent** (one flat violet, `--accent`) marks what is live, active or primary: the running ring, the active nav icon, focus rings, switches that are on. Filled violet that carries text (the primary button) uses the darker `--accent-solid` with **white** text, so it keeps 4.5:1 contrast. Never a large fill, a gradient or a glow.
- **Danger** (`--danger*`) is for giving up and errors only.
- **Controls** in `base.css`: `.btn` (`-primary`, `-secondary`, `-danger`), `.icon-btn`, `.input`, `.switch`, `.segmented` (+ `src/utils/segmented.ts`), `.toast`. Extend these instead of writing one-offs. Add `.pill` to a `.btn`, `.icon-btn` or `.segmented` to round it fully; the popup uses pills everywhere.
- **Motion:** CSS only. Entering takes `--duration-enter` (220ms), leaving `--duration-exit` (120ms), moving `--duration-layout`, all on `--ease`; `--ease-spring` is for small playful pops. `prefers-reduced-motion` is handled once at the end of `base.css` (and separately in `overlay.css`).
- **Focus:** a 2px accent ring offset by 2px on things you press (`.focus-ring`, `.btn`, `.icon-btn`); inputs only lighten their border.
- **Icons:** Phosphor icon font (see section 3), 18px by default via `.ph` / `.ph-fill` in `base.css`.
- **Logo:** the magic wand on violet (the Chrome Web Store icon, from the abandoned `gugeldev/focuspocus` project) in `static/assets/logo/` is used in the toolbar, the popup, the sidebar and the focus screen. `icon-32-active.png` is the same wand with a red dot, shown during a session.

---

## 6. Branching and releases

- **`main` = the latest released version.** It always matches what is published in the stores. Never commit to `main` directly; it only receives merges from release branches (and hotfixes).
- **One release branch per upcoming version:** `release/<version>` (e.g. `release/1.2.0`), created from `main`. Only one release branch at a time.
- **Every change goes through a pull request into the current release branch.** Work in a short-lived branch named like the commit type (`feat/pause-button`, `fix/overlay-flicker`, `build/bun-tooling`), open a PR to `release/<version>`, merge it, delete the branch.
- **Releasing:**
  1. On the release branch, bump the version in `package.json`, `manifest.chrome.json` and `manifest.firefox.json` (`chore(release): v1.2.0`).
  2. Open a PR from `release/<version>` to `main` and merge it.
  3. Tag the merge commit (`git tag v1.2.0 && git push origin v1.2.0`).
  4. Build both browsers, upload to the Chrome Web Store and Firefox Add-ons.
  5. Delete the release branch and create the next one from `main`.
- **Hotfix for the published version:** branch `fix/<name>` from `main`, PR to `main`, release it as a patch (`v1.2.1`) with a tag, then merge `main` into the current release branch so the fix is not lost.
- Current release branch: **`release/1.2.0`**.

---

## 7. Known roadmap (from the README)

- [x] Custom timer
- [x] Allowlist mode
- [x] Support for other browsers (Firefox)
- [ ] Groups for the blocklist
- [ ] Confirmation before giving up
- [ ] PT-BR language (base in `src/utils/language.ts`)

---

## 8. Checklist when changing something

- [ ] Do `bun run lint`, `bun run typecheck` and both browser builds pass?
- [ ] Changed a storage key? Update `StorageState` in `src/utils/storage.ts` and table 3.1, and check **every** context that reads it (background, content, popup, options).
- [ ] Added a permission or capability? Update **both** manifests.
- [ ] Bumped the version? Update `package.json`, `manifest.chrome.json` and `manifest.firefox.json`.
- [ ] Tested in **both** browsers (Chrome MV3 and Firefox MV2)?
- [ ] Is the commit message a Conventional Commit in English?
- [ ] Is the PR targeting the current release branch (not `main`)?
- [ ] Updated this `AGENTS.md`?

---

## 9. Maintainer workflow preferences

- **Review at the end of every task:** whenever a task is **fully finished**, run the **`thermo-nuclear-code-quality-review`** skill in a **subagent with a clean context**, i.e. a new agent that does not inherit the conversation and only reviews the diff/code. Then the main agent **fixes the reported issues** before handing off.
  - The skill is versioned in the repo, so every clone has it: the files live in `.agents/skills/thermo-nuclear-code-quality-review/` and `.claude/skills/thermo-nuclear-code-quality-review` is a symlink to it.
  - It has `disable-model-invocation: true`, so agents cannot call it through the skill tool. Users run it as `/thermo-nuclear-code-quality-review`. When an agent runs it on its own, it should tell the subagent to read `SKILL.md` and follow it.
- **Commits:** always Conventional Commits, always in English (see section 5).
- **Pull requests:** every change goes through a PR into the current release branch (see section 6).
