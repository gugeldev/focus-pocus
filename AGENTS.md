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
- The popup shows the timer as `hh:mm:ss`. The default is **15 min** (`900` s).
- The `<select>` has presets: **1 MIN, 15 MIN, 25 MIN, 30 MIN, 45 MIN, 1 HOUR**.
- **Custom time:** while the timer is stopped, clicking the display swaps it for a text input (`hh:mm:ss`, up to 8 characters). On `Enter` or blur the value is parsed (`ss`, `mm:ss` or `hh:mm:ss` are accepted). If it is more than 0 seconds, it becomes a new `<option>` in the select, sorted by duration, with a generated label such as `"1 HOUR 30 MIN"` or `"2 HOURS 5 S"`. The label is saved in `timeLabel`, so the custom option reappears when the popup is reopened.
- **START FOCUSING** button: starts the session. During the session the same button becomes **GIVE UP!**.
- During a session:
  - the popup turns **red** (`src/utils/change-popup-color.ts` swaps the CSS vars `--bg`, `--header-bg`, `--action-bg`, `--action-text`);
  - the select, the mode button and the custom input are disabled, and the display ignores clicks;
  - a random motivational message shows up (`src/utils/do-not-giveup.ts`: "Keep going!", "Never quit!" etc.), picked on the start click. If the popup is reopened mid-session, the message area is empty;
  - the extension icon changes to `icon-32-active.png` (Chrome only; see 3.4).
- The timer tick runs in the **background** and keeps going with the popup closed. The popup re-renders on every `timer` change and plays the victory sound when `streak` goes up. Start, stop and give up are written by the popup itself (see section 3).

### 2.2 Website blocking (content script)
There are two modes, toggled by the `Blocklist Mode` / `Allowlist Mode` button in the popup or the "Allowlist Mode" switch in the options:
- **Blocklist mode** (default): blocks the page if the current URL **contains** any `blocklist` entry.
- **Allowlist mode**: blocks **every** page whose URL **does not contain** any `allowlist` entry.
- Matching uses `window.location.href.includes(entry)`: substring matching, not exact domains.
- The "block" is a `div#focus-page > div#focus-page-content` overlay appended to `<body>` (the full-screen styles are on the child): fixed, full screen, 96% black background, `z-index: 10000`, with the texts "Focus Mode", "Time to focus on your work." and "If you give up, your streak will be reset." Styles live in `static/content/styles.css`.
- The content script runs on `<all_urls>`. On page load it applies the overlay if `isRunning` is already `true`. Then it reacts through `storage.onChanged`: when `isRunning` becomes `true` it applies the overlay, when it becomes `false` it removes it. List or mode changes update the in-memory copy but only take effect on the next evaluation.

### 2.3 Streak
- Each **completed** session adds +1 to `streak`.
- **Giving up** (clicking GIVE UP! during a session) **resets** the streak to 0.
- The streak shows in the popup header (with a flame icon) and in the options page header.
- **Share:** clicking the streak copies a ready-made text to the clipboard ("My current streak on the FocusPocus extension is N! 🎯…" or, with streak 0, "I'm starting my streak…"). In the popup the feedback is a browser notification; in the options page it is a toast plus the "Copied!" tooltip.

### 2.4 Sounds and notifications (opt-in)
They live in the **Main** tab of the options. All start **off**, because `options` does not exist until the user flips a switch or the popup mode button:

| Switch (UI)          | Key in `options`          | Effect                                              |
| -------------------- | ------------------------- | --------------------------------------------------- |
| Give Up Sound        | `give-up-sound`           | plays `assets/sounds/lose.wav` on give up           |
| Victory Sound        | `victorious-sound`        | plays `assets/sounds/finished.mp3` on completion (see 3.2, step 5) |
| Victory Notification | `victorious-notification` | "Finished a session! Now you can take a break!" notification (Chrome only; in Firefox `streak.ts` throws on `browser.action` before creating the notification) |
| Start Button Sound   | `button-sound`            | plays `assets/sounds/press.mp3` on start/give up    |
| Allowlist Mode       | `allowlist-mode`          | toggles blocklist/allowlist (see 2.2)               |

The switches are `input[type=checkbox]`. **The input `id` is the key** saved in `options`, so adding a new option only takes a checkbox with a new id and reading `options[id]`.

### 2.5 Options page (Settings)
Opened from the popup gear (`runtime.openOptionsPage()`). In Firefox it opens in its own tab. It has three tabs:
- **Main:** alert switches and the "Focus Settings" section (Allowlist Mode). That section is **hidden** while a session is running.
- **Blocklist:** a form to add a URL and a list with remove buttons.
- **Allowlist:** same, for the allowlist.
- List rules:
  - empty and duplicate values are rejected (error toast);
  - **you cannot add or remove entries while focus mode is running** (inputs disabled, plus an error toast);
  - text is saved as typed, without normalization.
- The header has the streak counter (click to copy) and a donate button (`https://www.pixme.bio/jotavetech`).
- Toasts use `toastify-js` (`src/utils/toast.ts`): top right, 2 s, red for errors.

---

## 3. Architecture

```
src/
├── background/           # "background" entry: service worker (Chrome) / background script (Firefox)
│   ├── index.ts          # message listener, 1 s setInterval, seeds storage defaults
│   └── services/
│       ├── timer.ts      # start/stop/give up, changeSelectedTime, checkAndStopTimer
│       └── streak.ts     # increments/resets the streak and fires the victory notification
├── content/index.ts      # "content" entry: blocking overlay on pages
├── popup/                # "popup" entry
│   ├── index.ts          # timer UI, custom time, mode toggle
│   ├── elements.ts       # popup querySelectors
│   └── streak.ts         # copy streak + notification
├── options/              # "options" entry
│   ├── index.ts          # blocklist/allowlist CRUD
│   ├── options.ts        # switches <-> storage.options
│   ├── tabs.ts           # tab switching (.hidden-page / .active-tab classes)
│   ├── streak.ts         # copy streak + toast
│   └── elements.ts       # options querySelectors
└── utils/
    ├── change-popup-color.ts
    ├── do-not-giveup.ts
    ├── play-popup-sounds.ts   # playSound("giveup" | "finished" | "button"), respects the switches
    ├── storage.ts             # typed storage.local contract: getStorage, setStorage, onStorageChanged, seedStorageDefaults
    ├── messages.ts            # typed background message contract: sendTimerMessage, onTimerMessage
    ├── toast.ts
    └── language.ts            # en/pt dictionaries, NOT used anywhere yet (planned i18n)

static/                   # copied as-is to dist/<browser>/
├── popup/  index.html + styles.css   (290px wide popup, dark theme, Roboto from Google Fonts)
├── options/ index.html + styles.css
├── content/styles.css    # overlay styles
└── assets/
    ├── logo/  icon-16/32/64/128.png, icon-32-active.png
    ├── img/   SVGs (clock, flame, settings, plus, remove, trash-2, heart-handshake)
    └── sounds/ finished.mp3, lose.wav, press.mp3
```

- The code is **framework-free TypeScript**: plain DOM, `querySelector` and `innerHTML`.
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
| `timeLabel`    | string                    | –       | label of the selected/custom option        |
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
- TypeScript **6** with `strict: true`, `target: es2016`, `module: ES2022`, `rootDir: ./src`.
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
  - `static/` is copied whole;
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
  - override: `static/content/styles.css` may use `!important`, because the overlay has to beat the host page's CSS;
  - when a rule must be ignored locally, use `biome-ignore` **with the reason**.
- **Git hooks (husky):** `bun install` enables them through the `prepare` script.
  - `pre-commit`: `bunx biome check --staged --no-errors-on-unmatched --error-on-warnings`. **Warnings block the commit too**, including the rules `biome.json` sets to `warn`: `noNonNullAssertion`, `noExplicitAny` and `noConsole` (`console.error`/`warn`/`info` are allowed).
  - `commit-msg`: rejects subjects that are not Conventional Commits or that contain non-ASCII characters (a heuristic for "English only"; see section 5). It reads the subject after `git stripspace`, like git does, and lets git's default merge, revert, `fixup!`, `squash!` and `amend!` subjects through.
  - `pre-push`: `bun run typecheck`.
- **Dependencies:**
  - runtime: `toastify-js` (the options tooltips are plain CSS);
  - dev: `webextension-polyfill` is a devDependency but ships in the bundle.
- `.gitignore` ignores `node_modules`, `dist`, `focus-pocus.zip`, `dist.crx` and `dist.pem`.

---

## 5. Conventions

- **Everything in English:** code, comments, UI text, docs (including this file) and commit messages.
- **Commits always follow [Conventional Commits](https://www.conventionalcommits.org):** `type(scope)!: subject`, in English, imperative mood, lowercase type.
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Examples: `feat(popup): add pause button`, `fix(content): remove overlay when session ends`, `build(deps): bump webpack`.
  - The `commit-msg` hook enforces the format. Older history does not always follow it.
- Files in `kebab-case.ts`. Popup and options each have an `elements.ts` that centralizes the type-cast `querySelector` calls.
- Functions in camelCase with verbose, descriptive names (`checkIfIsRunningAndSendAMessage`, `hiddenFocusSettings`).
- State is read with `getStorage([...]).then(...)` and written with `setStorage({...})` (from `src/utils/storage.ts`). Existing code uses `.then` instead of `async/await`.
- UI text is hardcoded in English in the HTML/TS. `language.ts` exists for a future i18n but is not wired up.
- Theme colors: background `#0d0d0d`, header `#0b0b0b`, action `#171717`, focus red `#b51026` / `#9f0017`.

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
