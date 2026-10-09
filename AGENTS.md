# AGENTS.md: FocusPocus

Guide for AI agents (and humans) working in this repository. It describes **how the app works today**: features, architecture, persisted state, message flow and build. Update this file whenever you change a behavior described here.

---

## 1. Overview

**FocusPocus** ("Stay focused as if under a magical spell") is an open source browser extension for **Chrome (Manifest V3)** and **Firefox (Manifest V2)**. It helps users stay focused with a **focus timer**: while the timer runs, distracting websites are covered by a blocking screen. Completing sessions builds a **streak**; giving up resets the whole streak.

- Published name: `FocusPocus: Block Distractions & Stay Focused`
- Current version: `1.1.2` (in `apps/extension/package.json` and both manifests; keep the three in sync)
- Original author: `@jotavetech`. Current remote: `gugeldev/focus-pocus`
- Published on the [Chrome Web Store](https://chromewebstore.google.com/detail/focuspocus-in-magical-foc/mhfhegccdlndlipjicelombmchnpdebc) and [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/focuspocus-in-magical-focus/)
- License: **MIT** (`LICENSE`).
- Website: a landing page in `apps/web` (Next.js) that links to the stores and GitHub, with working drawings of the popup, the settings page and the focus screen (see section 3.5).
- **Language: everything in this repository is in English**: code, comments, docs and commit messages (see section 5). The UI is translated into English, Brazilian Portuguese and Spanish (see 2.6).

### 1.1 Repository layout (bun workspaces)

```
apps/
├── extension/   # @focus-pocus/extension: the browser extension (webpack). Sections 2 to 5 describe it.
└── web/         # @focus-pocus/web: the website (Next.js), see 3.5 and apps/web/AGENTS.md
packages/
├── ui/          # @focus-pocus/ui: the design system, tokens (theme.css) and the shared controls
└── locales/     # @focus-pocus/locales: the extension's UI copy in every language
```

- **Paths in sections 2 to 5 are relative to `apps/extension/`** (`src/lib/storage.ts` is `apps/extension/src/lib/storage.ts`) unless they start with `packages/` or `apps/web/`.
- The packages ship TypeScript source, no build step: webpack (ts-loader) and Next compile them with the app. Each exports its files one by one (`@focus-pocus/ui/button`, `@focus-pocus/ui/icons`…; see its `package.json` `exports`).
- Biome, husky, `bunfig.toml`, `tsconfig.base.json` and the root scripts are shared by every workspace; dependencies are declared by the workspace that uses them.

---

## 2. Features

### 2.1 Focus timer (popup)
- The popup shows the remaining time inside a circular progress ring, as `mm:ss` or `h:mm:ss` (times with hours use a smaller size so they fit the ring). The default is **15 min** (`900` s).
- **Duration presets** are a segmented control of radios: **1m, 15m, 25m, 30m, 45m, 1h**. Picking one saves `selectedTime`.
- **Custom time:** while the timer is stopped, clicking the time swaps it for a text input (up to 8 characters). `Enter` or blur parses it (`ss`, `mm:ss` or `hh:mm:ss`, digits only) and, if it is more than 0 seconds, saves it as `selectedTime`; `Esc` cancels. A custom time selects no preset (the thumb fades out) and the caption above the time reads "Custom session"; otherwise the idle caption is empty. The "Click to customize" hint below the time only appears on hover or focus.
- **Mode:** a full-width Blocklist / Allowlist segmented control, above the presets, that writes `options['allowlist-mode']`.
- **Start focusing** button: starts the session. During the session the same button becomes **Give up** (danger style).
- **Give up takes two clicks** (`src/screens/popup/partials/start-button.tsx`), because it resets the streak: the first click arms the button (solid red, "Click again to give up", `popup.confirmGiveUp` in the locales); a second click within 3 s gives up (a click sooner than 400 ms is ignored, so a double-click does not give up). It disarms on its own after 3 s, on blur, or when the session ends.
- Everything that changes between idle and a session follows the stored `isRunning` (`src/screens/popup/page.tsx`). During a session:
  - the accent progress ring appears and empties as time passes;
  - the presets, the mode control and the custom time are disabled;
  - the caption shows a random motivational message (`popup.encouragements` in the locales), picked when the session starts or when the popup opens mid-session;
  - the extension icon changes to `icon-32-active.png` (Chrome only; see 3.4).
- When `streak` goes up while the popup is open, it plays the victory sound and the streak counter bumps.
- The timer tick runs in the **background** and keeps going with the popup closed. The popup re-renders on every change to `timer`, `isRunning`, `selectedTime`, `streak` or `options`. Start is written by the popup itself; give up is asked of the background (see section 3).

### 2.2 Website blocking (content script)
There are two modes, toggled by the Blocklist / Allowlist control in the popup or the "Allowlist mode" switch in the options:
- **Blocklist mode** (default): blocks the page if the current URL **contains** any `blocklist` entry.
- **Allowlist mode**: blocks **every** page whose URL **does not contain** any `allowlist` entry.
- Matching uses `window.location.href.includes(entry)`: substring matching, not exact domains.
- The "block" is the **focus screen** (`src/content/overlay.ts`): a `div#focus-pocus-overlay` host appended to `<html>` with an open **shadow root**, so the page's CSS cannot restyle it and its CSS cannot leak into the page. It is fixed, full screen, at the maximum `z-index`, blurs the page behind it and shows the logo, the copy and the remaining session time live inside a ring that empties as the session runs (measured against `selectedTime`). The logo comes from `assets/logo/` (a web-accessible resource in both manifests).
  - Motion: the card's parts rise in turn (each has an `--order`), two violet clouds drift behind it, the "Focus mode" pill has a pulsing live dot and a faint dotted ring turns around the countdown. The logo stays still. Under `prefers-reduced-motion` the card only fades in and nothing loops.
  - **Give up** sits under the countdown and takes two clicks, like the popup's button (same timing, `packages/ui/src/confirm-timing.ts`; copy in `overlay.giveUp` / `overlay.confirmGiveUp`). The confirming click sends `TIMER_GIVEN_UP` to the background (a content script cannot reach `browser.action`) and plays the give-up sound if its switch is on; `assets/sounds/` is a web-accessible resource in both manifests for that. A page's CSP or autoplay policy may still block the sound, which is ignored.
  - It follows the user's theme (2.7), live: `data-theme` on the `.overlay` element.
  - Its styles are `src/content/overlay.css`, bundled into `content.js` as a string (see section 4) and injected into the shadow root. They repeat the colors of `packages/ui/src/theme.css` (as the same `light-dark()` pairs) because a shadow root cannot see the extension's stylesheets. The `:host` rules are `!important`: a page rule that matches the host beats a normal `:host` rule, but not an important one.
  - A shadow root cannot declare `@font-face`, so the overlay registers Plus Jakarta Sans on the page's `document.fonts` under the private name `FocusPocus Jakarta`, loaded from `assets/fonts/` (a web-accessible resource in both manifests). If it fails, the system font stack takes over.
- The content script runs on `<all_urls>`. On page load it applies the overlay if `isRunning` is already `true`. Then it reacts through `storage.onChanged`: when `isRunning` becomes `true` it applies the overlay, when it becomes `false` it fades it out, every `timer` change updates the countdown and its ring, and a `theme` change repaints it. List or mode changes update the in-memory copy but only take effect on the next evaluation.

### 2.3 Streak
- Each **completed** session adds +1 to `streak`.
- **Giving up** (confirming Give up during a session) **resets** the streak to 0.
- The streak shows in the popup header (a flame pill) and in the options sidebar (a card at the bottom).
- **Share:** clicking either one copies a ready-made text to the clipboard (`src/lib/share-streak.ts`, with the `share` copy of the user's language: "My current streak on the FocusPocus extension is N! 🎯…" or, with streak 0, "I'm starting my streak…") and confirms with a toast.

### 2.4 Sounds and notifications (opt-in)
They live in the **General** tab of the options. All start **off**, because `options` does not exist until the user flips a switch or the popup mode button:

| Switch (UI)                       | Key in `options`          | Effect                                              |
| --------------------------------- | ------------------------- | --------------------------------------------------- |
| Sounds › Start and give up        | `button-sound`            | plays `assets/sounds/press.mp3` on start/give up    |
| Sounds › Victory                  | `victorious-sound`        | plays `assets/sounds/finished.mp3` on completion (see 3.2, step 5) |
| Sounds › Giving up                | `give-up-sound`           | plays `assets/sounds/lose.wav` on give up           |
| Notifications › Session finished  | `victorious-notification` | "Finished a session! Now you can take a break!" notification (Chrome only; in Firefox `streak.ts` throws on `browser.action` before creating the notification) |
| Blocking › Allowlist mode         | `allowlist-mode`          | toggles blocklist/allowlist (see 2.2)               |

Each switch is a `<SettingRow optionKey="...">` in `src/screens/options/partials/general-tab.tsx` (a `<label>` wrapping a `<Switch>`). **`optionKey` is the key** saved in `options`, so adding a new option only takes a new row and reading `options[key]`.

### 2.5 Options page (Settings)
Opened from the popup gear (`runtime.openOptionsPage()`). In Firefox it opens in its own tab. The layout is a **sidebar** on the canvas next to a **content pane** (modeled on the maintainer's heysusi desktop settings). Below 760px wide the sidebar becomes a top bar. The page fills the window and never scrolls: the content pane scrolls on its own, so the sidebar (or top bar) stays put.
- **Sidebar:** brand, three tabs (General, Blocklist, Allowlist; the lists show their entry count) and the streak card (click to copy).
  - One indicator surface slides to the active tab (`src/screens/options/partials/nav-tabs.tsx`). Its offset is computed from the tab index (`--active-tab`), never measured. Only the active page is rendered, so its entrance animation replays on every tab switch. The open tab is mirrored in the location hash, so `#blocklist` opens the blocklist directly (`#general`, `#blocklist`, `#allowlist`).
- **General:** the appearance picker (2.7), the language picker (2.6), then the switches of 2.4, grouped in Sounds, Notifications and Blocking. While a session is running, the Allowlist mode switch is **disabled** and a notice explains why.
- **Blocklist / Allowlist:** a form to add a website and the list. Rows show the site icon, the entry and a remove button that appears on hover or focus. Rows animate in and collapse out. An empty list shows an empty state. The page of the active mode carries an "Active mode" badge.
  - The icon is the site's own `https://<host>/favicon.ico`, loaded straight from the site (no third-party favicon service, so the list never leaves the browser except to the listed sites). It only loads when the entry looks like a domain; otherwise, or if it fails, the tile shows the first letter of the host.
- List rules:
  - the value is trimmed; empty and duplicate values are rejected (error toast);
  - **you cannot add or remove entries while focus mode is running** (the input, the add button and the remove buttons are disabled, and a notice says why);
  - otherwise the text is saved as typed, without normalization.
- The running lock is the stored `isRunning`, passed down as a prop: the list inputs, add/remove buttons and the Allowlist mode switch are disabled while it is `true`.
- Toasts come from `src/lib/toast.ts` (no dependency): `toast(message, error?)` from anywhere, drawn by the `<Toaster />` (`src/components/toaster.tsx`) that `mount()` adds to every page. Bottom center, 2.4 s, red for errors.

### 2.6 Languages (i18n)
- The UI speaks **English** (`en`), **Brazilian Portuguese** (`pt-BR`) and **Spanish** (`es`): the popup, the options page, the toasts, the focus screen, the share text and the notification.
- The **Language** section of the General tab is a segmented control: **Automatic** (the default) and each language, named in its own words. It writes `language` (table 3.1); every open page and every page's focus screen switch live through `storage.onChanged` (a focus screen already on screen keeps its text until it is shown again).
- **Automatic** follows `browser.i18n.getUILanguage()`: any `pt-*` gets `pt-BR`, any `es-*` gets `es`, everything else English (`src/lib/i18n.ts`, on top of `findLocaleForTag` from `packages/locales`).
- **The copy lives in `packages/locales/src/`** (shared with the website's drawings of the extension): `en.ts` is the source and its shape is the `Messages` type; `pt-br.ts` and `es.ts` are typed `Messages`, so a missing or extra key fails `typecheck`. Text that interpolates is a function (`remove: (url) => ...`).
  - React reads it with `useMessages()` (`src/lib/use-messages.tsx`); `mount()` wraps every page in the `MessagesProvider`, which reads `language`, sets `<html lang>` and renders nothing until the language is known (no English flash).
  - Outside React: the content script keeps the resolved `Locale` and passes it to `showOverlay()`; the background calls `loadMessages()` for the notification.
  - Lib helpers that show text take the copy as an argument (`shareStreak(streak, t.share)`) instead of reading the language themselves.
- **The manifest** name and description come from `static/_locales/<en|pt_BR|es>/messages.json` (`__MSG_extName__`, `__MSG_extDescription__`, `default_locale: "en"`), so the browser and the stores show them in the browser's language. That follows the browser, not the in-app setting.
- **Adding a language:** add `packages/locales/src/<code>.ts` typed `Messages`, add one row to `languages` in `packages/locales/src/index.ts` (its copy, its native name and the language-tag prefix it answers to), add `static/_locales/<code>/messages.json`, and add the website's copy in `apps/web/src/locales/`.

### 2.7 Appearance (light and dark)
- The popup, the options page and the focus screen come in a **light** and a **dark** theme. The **Appearance** section of the General tab is a segmented control: **Automatic** (the default: the system's light or dark mode), **Light** and **Dark**. It writes `theme` (table 3.1); every open page and every focus screen switch live through `storage.onChanged`.
- How it works: every color token in `packages/ui/src/theme.css` is a `light-dark(light, dark)` pair, so `color-scheme` picks the side. The kit's base styles set `color-scheme: light dark` on `:root` (the system decides) and pin it on any element with `data-theme="light"` or `"dark"`. `applyTheme(element, theme)` (`packages/ui/src/theme.ts`, with the `ThemeSetting` type) sets or removes that attribute: `mount()` applies it to `<html>` before the first render (so a page never flashes the wrong theme) and keeps it in sync; the focus screen applies it to its `.overlay`.
- The light colors are the website's (it is always light, see 3.5); the dark ones are the extension's original look.

---

## 3. Architecture

```
apps/extension/src/
├── background/           # "background" entry: service worker (Chrome) / background script (Firefox)
│   ├── index.ts          # message listener, 1 s setInterval, seeds storage defaults
│   └── services/
│       ├── timer.ts      # start/stop/give up, checkAndStopTimer
│       └── streak.ts     # increments/resets the streak and fires the victory notification
├── content/              # "content" entry
│   ├── index.ts          # decides whether the page is blocked, keeps the countdown in sync
│   ├── overlay.ts        # the focus screen: shadow-root host, font loading, show/hide, give up
│   └── overlay.css       # focus screen styles, bundled as a string
├── popup/index.tsx       # "popup" entry: mount(<PopupScreen />), nothing else
├── options/index.tsx     # "options" entry: mount(<OptionsScreen />), nothing else
├── screens/              # one folder per page (see 5.2)
│   ├── popup/
│   │   ├── page.tsx      # PopupScreen: reads storage, composes the partials
│   │   ├── parse-custom-time.ts
│   │   └── partials/     # top-bar, streak-button, dial, time-field, session-settings, start-button
│   └── options/
│       ├── page.tsx      # OptionsScreen: tab state + location hash, sidebar + the open tab
│       ├── tabs.ts       # the tabs and getTabFromHash
│       └── partials/     # sidebar, nav-tabs, nav-item, sidebar-footer, tab-page, settings-section,
│                         # setting-row, locked-notice, active-mode-badge, general-tab,
│                         # language-picker, theme-picker, site-list-tab, add-site-form, site-list, site-row,
│                         # site-icon, empty-list
├── components/           # used by two or more screens: toaster, site-lists (ListType, list icons)
├── styles/theme.css      # Tailwind entry: Tailwind, the design system (packages/ui) and the font (see 5.1)
├── types/css.d.ts        # `import css from './x.css?raw'` is a string; plain `.css` imports are side effects
└── lib/                  # logic and hooks, shared by every context
    ├── mount.tsx              # renders a screen into #root with the Toaster, the theme CSS, the stored theme and the MessagesProvider
    ├── use-storage.ts         # useStorage(...keys): a storage slice kept in sync, plus an optimistic update
    ├── toast.ts               # toast(message, error?) and the store the Toaster reads
    ├── share-streak.ts        # shareStreak(streak, copy): copies a ready-made text, confirms with a toast
    ├── play-sound.ts          # playSound("giveup" | "finished" | "button"), respects the switches (popup and focus screen)
    ├── storage.ts             # typed storage.local contract: getStorage, setStorage, onStorageChanged, seedStorageDefaults
    ├── messages.ts            # typed background message contract: sendTimerMessage, onTimerMessage
    ├── i18n.ts                # locales, browser-language detection, getMessages, loadMessages (see 2.6)
    └── use-messages.tsx       # MessagesProvider and useMessages(): the copy in the user's language

static/                   # copied as-is to dist/<browser>/
├── _locales/             # en, pt_BR, es: the manifest's name and description (see 2.6)
├── popup/index.html      # just #root, ../popup.css and ../popup.js (320px wide popup)
├── options/index.html    # just #root, ../options.css and ../options.js
└── assets/
    ├── logo/  icon-16/32/64/128.png, icon-32-active.png
    └── sounds/ finished.mp3, lose.wav, press.mp3 (web-accessible, for the focus screen's give up)
# assets/fonts/ is not in static/: webpack copies it from @fontsource-variable/plus-jakarta-sans.

packages/ui/src/          # @focus-pocus/ui, shared with the website
├── theme.css             # design tokens (@theme, light-dark() pairs), the focus-ring utility, base styles (see 5.1)
├── button.tsx            # Button and ButtonLink (a link that looks like a Button)
├── brand.tsx             # the wand logo and the name; each app passes its own logo URL
├── icon-button.tsx, input.tsx, switch.tsx, segmented.tsx, progress-ring.tsx
├── progress-ring-geometry.ts  # the ring's radius and length, shared with the focus screen (no React)
├── theme.ts              # ThemeSetting and applyTheme (see 2.7)
├── confirm-timing.ts     # the two-click give up's timing (no React, so the content script can use it)
├── use-confirm-twice.ts  # useConfirmTwice: the popup's and the website's two-click give up
├── icons.ts              # every Phosphor icon the extension uses, with domain names
├── cx.ts                 # joins class names, skipping the falsy ones
└── format-time.ts        # "mm:ss" / "h:mm:ss", shared by the popup, the focus screen and the website

packages/locales/src/     # @focus-pocus/locales: en.ts (source + Messages type), pt-br.ts, es.ts,
                          # index.ts (the languages table, getMessages, findLocaleForTag) (see 2.6)
```

- **The popup and the options page are React 19 + Tailwind CSS 4.** The background and the content script (including the focus screen) stay plain TypeScript: the focus screen lives in a shadow root on every page, where Tailwind 4 does not work (it relies on `@property`, which only registers at document level) and React would be dead weight.
- Pages read storage through `useStorage(...keys)` (`src/lib/use-storage.ts`): `null` until the first read, then kept in sync by `storage.onChanged`. Its `update(values)` writes storage and the local copy at once.
- Icons come from [Phosphor](https://phosphoricons.com) (`@phosphor-icons/react`), re-exported with domain names by `packages/ui/src/icons.ts`: `<IconSettings size={18} />` or `<IconStreak weight="fill" />`. Never hand-write SVG icons. The only inline SVGs are the progress rings (the popup's and the focus screen's) and, on the website, the Chrome and Firefox marks (paths from Simple Icons).
- Every extension API goes through **`webextension-polyfill`** (`import browser from 'webextension-polyfill'`), which provides a Promise-based API. **It does not unify `action`/`browserAction`:** the code calls `browser.action.*`, which only exists in Chrome MV3. In Firefox MV2 those calls throw `TypeError`.
- **All storage access goes through `src/lib/storage.ts`:** `getStorage(keys)`, `setStorage(values)` and `onStorageChanged(listener)` use the `StorageState` type (table 3.1). Do not call `browser.storage.local` outside that module.
- **All background messages go through `src/lib/messages.ts`:** `sendTimerMessage(type)` on the sending side and `onTimerMessage(listener)` in the background, which ignores anything that is not a valid `TimerMessage`. Do not call `browser.runtime.sendMessage`/`onMessage` directly.
- **Heads-up:** `screens/popup/page.tsx` imports straight from `background/services/timer.ts`. In practice **start runs in the popup context**: the popup writes to storage and messages the background. **Give up runs in the background** (`TIMER_GIVEN_UP`, see 3.2), which also runs the `setInterval` tick and handles session completion.

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
| `language`     | `'auto' \| 'en' \| 'pt-BR' \| 'es'` | – (`auto`) | UI language (see 2.6)          |
| `theme`        | `'auto' \| 'light' \| 'dark'` | – (`auto`) | light or dark look (see 2.7)        |

The defaults for `timer`, `selectedTime`, `isRunning` and `streak` are written by `seedStorageDefaults()` (`src/lib/storage.ts`) when the background loads; existing values are kept. That is why those four keys are required in `StorageState` and the others are optional.

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
6. **Give up** (confirmed second click while `isRunning`, from the popup (2.1) or the focus screen (2.2)): the page sends `TIMER_GIVEN_UP` and plays the give-up sound; the background clears its interval and runs `giveUp()` (`src/background/services/timer.ts`: `resetStreak()`, so streak = 0, then `stopTimer()`). The streak is reset first because in Firefox `stopTimer()` throws on `browser.action`.
7. Every time the popup opens during an active session it re-sends `TIMER_STARTED`. That recreates the interval if Chrome unloaded the service worker.

### 3.3 Messages (`src/lib/messages.ts`)
| `type`           | Sent by               | Effect in the background                              |
| ---------------- | --------------------- | ----------------------------------------------------- |
| `TIMER_STARTED`  | popup                 | (re)starts the `setInterval` and sets the active icon |
| `TIMER_FINISHED` | `stopTimer()` (always in the background, on completion or give up, so it reaches nobody) | clears the interval and restores the normal icon |
| `TIMER_GIVEN_UP` | Give up, in the popup or on the focus screen | clears the interval and runs `giveUp()` (resets the streak, stops the session, restores the icon) |

### 3.4 Manifest differences
- `manifest.chrome.json`: **MV3**, `action`, `background.service_worker`, `options_page`.
- `manifest.firefox.json`: **MV2**, `browser_action` (with `default_icon`), `background.scripts`, `options_ui` with `open_in_tab`, CSP and `web_accessible_resources`.
- The code uses `browser.action` in both builds, but the Firefox manifest declares `browser_action` (see section 3).
- Permissions in both: `storage` and `notifications`. The content script runs on `<all_urls>` and injects `content.js` (the focus screen's styles are bundled into it as a string).

### 3.5 Website (`apps/web`)
- **Next.js 16** (App Router, Turbopack) + Tailwind CSS 4, statically rendered once per language. `apps/web/AGENTS.md` has its layout and rules.
- One light page (the site pins the kit's `light-dark()` colors to their light side, see `apps/web/AGENTS.md`): a centered hero over the **settings page** in a browser with the **popup** hanging off its edge, the **focus screen**, the features on a grid laid over the page's guide lines, real Chrome Web Store reviews sliding by (translated), and the install links (Chrome Web Store, Firefox Add-ons, GitHub), in English, Brazilian Portuguese and Spanish (`/en`, `/pt-BR`, `/es`; `src/proxy.ts` sends `/` to the browser's best match).
- **The drawings of the extension are working React copies** (`apps/web/src/screens/landing/mocks/`), built from `@focus-pocus/ui` and the extension's copy from `@focus-pocus/locales`, run by local state. They repeat the class strings (and small constants such as the duration presets) of the screens they draw, and each file names its source. **When you change the popup, the settings page or the focus screen, update its drawing.**
- Store and GitHub links live in `apps/web/src/lib/links.ts`.

---

## 4. Build and development

- **Package manager: bun only** (`bun.lock`, `"packageManager": "bun@1.4.2"`). Do not use npm, yarn or pnpm; there is no `package-lock.json`.
- **`bunfig.toml`:**
  - `install.minimumReleaseAge = 604800`: bun only installs versions published at least 7 days ago. It protects against compromised packages; do not remove it.
  - `run.shell = "bun"`: scripts run in bun's shell on every OS, so `BROWSER_TARGET=chrome webpack` works without `cross-env`.
- Build stack: **webpack 5 + webpack-cli 7 + ts-loader 9 + copy-webpack-plugin 14**, plus **postcss-loader + `@tailwindcss/postcss` + css-loader + mini-css-extract-plugin** for the pages' CSS. There is no dev server or HMR: `dev:*` rebuilds `dist/` on save (TSX and CSS, including new Tailwind classes) and you reopen the popup or reload the page. webpack runs on both Node and the bun runtime (`bun --bun run ...`).
- TypeScript **6** with `strict: true`, `target: es2022`, `moduleResolution: bundler`, `verbatimModuleSyntax`, shared by every workspace through `tsconfig.base.json`.
- **Why not TypeScript 7:** TS 7 is the native (Go) compiler and lacks the JavaScript API that `ts-loader` uses, so the build breaks. To migrate, replace `ts-loader` with a transpile-only loader (e.g. `esbuild-loader` or `swc-loader`) and keep `tsc --noEmit` for type-checking.

Run everything from the repository root; the root scripts forward to the workspace with `bun --filter`.

```bash
bun install             # every workspace, and the git hooks
bun run dev:chrome      # webpack --mode development  -> apps/extension/dist/chrome (watch)
bun run dev:firefox     # -> apps/extension/dist/firefox
bun run build:chrome    # --mode production
bun run build:firefox
bun run dev:web         # next dev on http://localhost:3003
bun run build:web       # next build
bun run typecheck       # tsc --noEmit in every workspace
bun run lint            # biome check . (the whole repository)
bun run lint:fix        # biome check --write .
```

- How webpack works here (`apps/extension/webpack.config.js`):
  - the `BROWSER_TARGET` variable (`chrome` | `firefox`) picks the manifest, which is copied as `manifest.json`;
  - output goes to **`apps/extension/dist/<browser>/`**;
  - four bundles are generated: `popup.js`, `background.js`, `content.js` and `options.js`, all at the root of `dist`;
  - the HTML pages reference them as `../popup.js` and `../options.js`;
  - `static/` is copied whole, plus the Plus Jakarta Sans `latin` and `latin-ext` woff2 files into `assets/fonts/`;
  - `import './x.css'` goes through Tailwind (`postcss.config.mjs`; `packages/ui/src/theme.css` adds its own folder as a Tailwind `@source`, so the kit's classes are generated) and is extracted next to its bundle as `popup.css` / `options.css`. css-loader runs with `url: false`, so the font URLs (`/assets/fonts/...`, absolute from the extension root) stay as written. CSS is minified in `production` mode only;
  - `import css from './x.css?raw'` is the file as a string (`type: 'asset/source'`), which is how the focus screen gets its styles into a shadow root;
  - `performance.hints` is off: the extension loads from disk, so the web bundle-size warnings do not apply;
  - `output.clean` empties `dist/<browser>/` before every build, so removed files do not linger;
  - `DefinePlugin` injects `process.env.BROWSER_TARGET` into the bundles (not used in `src/` today);
  - only the `dev:*` scripts watch (`--watch`); `build:*` builds once and exits, which the release workflow relies on;
  - `devtool: "source-map"`.
- **Loading the extension:**
  - Chrome: `chrome://extensions`, enable developer mode, "Load unpacked" and pick `apps/extension/dist/chrome`.
  - Firefox: `about:debugging`, "Load Temporary Add-on" and pick `apps/extension/dist/firefox/manifest.json`.
- **There are no automated tests.** Validate in the browser, on both builds.
- **Lint and formatting: Biome** (`biome.json`, same config as the maintainer's `obd` project):
  - single quotes, semicolons, trailing commas, 100-column lines, 2-space indentation;
  - `recommended` preset, plus `noExcessiveCognitiveComplexity`, `noUnusedVariables`/`noUnusedImports`, `useConst` and `useImportType` as errors;
  - Biome also checks HTML, CSS (with Tailwind directives enabled) and JSON (`static/`, manifests);
  - `noLabelWithoutControl` knows `Switch` and `Input` are inputs, so `<label>` can wrap them;
  - override: `apps/extension/src/content/overlay.css` may use `!important`, because the focus screen's host has to beat the page's CSS;
  - when a rule must be ignored locally, use `biome-ignore` **with the reason**.
- **Git hooks (husky):** `bun install` enables them through the `prepare` script.
  - `pre-commit`: `bunx biome check --staged --no-errors-on-unmatched --error-on-warnings`. **Warnings block the commit too**, including the rules `biome.json` sets to `warn`: `noNonNullAssertion`, `noExplicitAny` and `noConsole` (`console.error`/`warn`/`info` are allowed).
  - `commit-msg`: rejects subjects that are not Conventional Commits or that contain non-ASCII characters (a heuristic for "English only"; see section 5). It reads the subject after `git stripspace`, like git does, and lets git's default merge, revert, `fixup!`, `squash!` and `amend!` subjects through.
  - `pre-push`: `bun run typecheck`.
- **Dependencies:** each workspace declares what it uses (bun's isolated installs only link a package's own dependencies into it).
  - root: Biome, husky, TypeScript;
  - extension: everything is a devDependency, including what ships in the build (`react`, `react-dom`, `@phosphor-icons/react`, `webextension-polyfill` in the bundles, Tailwind in the CSS, `@fontsource-variable/plus-jakarta-sans` as the font files);
  - web: `next`, `react`, `react-dom`, `@phosphor-icons/react` and `simple-icons` (the Chrome and Firefox marks, which Phosphor does not draw);
  - `packages/ui`: `@phosphor-icons/react`, with `react` as a peer.
- `.gitignore` ignores `node_modules`, `dist`, `.next`, `next-env.d.ts`, `focus-pocus.zip`, `dist.crx` and `dist.pem`.

---

## 5. Conventions

- **Everything in English:** code, comments, docs (including this file) and commit messages. UI text is never hardcoded: the extension's goes in `packages/locales/src/`, the website's in `apps/web/src/locales/`, in all three languages (see 2.6).
- **Commits always follow [Conventional Commits](https://www.conventionalcommits.org):** `type(scope)!: subject`, in English, imperative mood, lowercase type.
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Examples: `feat(popup): add pause button`, `fix(content): remove overlay when session ends`, `build(deps): bump webpack`.
  - The `commit-msg` hook enforces the format. Older history does not always follow it.
- Files in `kebab-case.ts` / `kebab-case.tsx`; React components in PascalCase inside them. React rules: see 5.2.
- **TS:** `type` over `interface`; no `any`; `import type` for types. Imports use the `@/` alias (`@/lib/storage` is `src/lib/storage`; `tsconfig.json` and `webpack.config.js` both resolve it); only a sibling in the same folder is imported with `./`.
- **Exports are named** (`export function Button`), except a screen's `page.tsx`, whose default export is the screen.
- Functions in camelCase with verbose, descriptive names (`checkIfIsRunningAndSendAMessage`, `lockFocusSettings`).
- Outside React, state is read with `getStorage([...]).then(...)` and written with `setStorage({...})` (from `src/lib/storage.ts`); existing code uses `.then` instead of `async/await`. In React, use `useStorage`.
- Design rules: see 5.1.

### 5.1 Design system

The look is violet and **minimal**, in a light and a dark theme (2.7), modeled on the maintainer's heysusi settings window: flat colors, no gradients, no glows, no decorative animation. Motion only explains a change of state. **One exception: the focus screen** (2.2) may use ambient motion and a soft violet aura (drifting clouds, a pulsing live dot, a slowly turning ring), because it is a full-screen moment rather than a tool, and it stops all of it under reduced motion. `packages/ui/src/theme.css` holds the tokens as Tailwind theme variables (`bg-surface`, `text-text-muted`, `rounded-md`, `shadow-card`, `ease-fluid`, `duration-(--duration-enter)`, `animate-fade-up`…) and `packages/ui/src/` the shared controls (used by the extension and the website); pages only lay things out with utilities. Tailwind's default palette, type scale, letter spacing, radii, shadows and easings are switched off, so an off-token color, font size or radius has no utility; spacing and sizes keep Tailwind's 4px scale (`size-8`, `px-3.5`). An arbitrary value for any of those (`text-[#...]`, `text-[44px]`, `tracking-[...]`) is a smell: add a token. Arbitrary values are fine for layout math (`grid-cols-[...]`, `w-[calc(...)]`).
- **Cascade layers:** Chrome gives extension pages its own *unlayered* stylesheet (`body { font-family: <system>; font-size: 75% }`), which beats anything Tailwind puts in a layer. That is why the `body` rules in `theme.css` sit outside `@layer`.
- **Each app's stylesheet** imports Tailwind, then `@focus-pocus/ui/theme.css`, then adds its font: the extension's `src/styles/theme.css` self-hosts it with `@font-face`, the website sets `--font-sans` to `next/font`'s variable. The website adds its page-sized tokens in `apps/web/src/app/globals.css` and sets `color-scheme: light`, so the kit always draws light there.

- **Font:** Plus Jakarta Sans (variable), self-hosted. Never load fonts from a CDN.
- **Colors** are `light-dark(light, dark)` pairs in `theme.css`; a new color token needs both sides. Shadows hold both looks as two layers (a hairline ring in the light, a soft drop in the dark), one of them transparent per scheme.
- **Surfaces** stack in one direction, never pure black: `--sunken` → `--canvas` → `--surface` → `--raised` → `--raised-hover`. Separation comes from surface and space; hairlines (`--border`) only divide content inside a surface.
- **Text** has three levels plus the placeholder: `--text`, `--text-muted`, `--text-faint`, `--text-placeholder`.
- **Accent** (one flat violet, `--accent`) marks what is live, active or primary: the running ring, the active nav icon, focus rings, switches that are on. Filled violet that carries text (the primary button) uses the darker `--accent-solid` with **white** text, so it keeps 4.5:1 contrast. Never a large fill, a gradient or a glow.
- **Danger** (`--danger*`) is for giving up and errors only.
- **Controls** in `packages/ui/src/`: `Button` and `ButtonLink` (`variant` primary/secondary/danger/danger-solid, `size` md/lg), `ProgressRing`, `IconButton` (`icon`, `tone` neutral/danger), `Input`, `Switch`, `Segmented`, `Brand`; toasts are `toast()` from `src/lib/toast.ts`, drawn by `src/components/toaster.tsx`. Extend these instead of writing one-offs. Pass `pill` to `Button`, `IconButton` or `Segmented` to round it fully; the popup uses pills everywhere. A control's variants never set the same property as its base, so there is no class-order fight (and no `tailwind-merge`).
- **Motion:** CSS only. Entering takes `--duration-enter` (220ms), leaving `--duration-exit` (120ms), moving `--duration-layout`, all on `ease-fluid`; `ease-spring` is for small playful pops. Keyframes are `--animate-*` tokens in `theme.css`. `prefers-reduced-motion` is handled once at the end of `theme.css` (and separately in `overlay.css`).
- **Focus:** a 2px accent ring offset by 2px on things you press (the `focus-ring` utility, built into `Button` and `IconButton`); inputs only lighten their border.
- **Icons:** Phosphor, always through `packages/ui/src/icons.ts` (see 5.2), 18px by default; pass `size` explicitly.
- **Logo:** the magic wand on violet (the Chrome Web Store icon, from the abandoned `gugeldev/focuspocus` project) in `static/assets/logo/` is used in the toolbar, the popup, the sidebar and the focus screen. `icon-32-active.png` is the same wand with a red dot, shown during a session.

### 5.2 React: layout and components

Same rules as the maintainer's `obd` project.

- **An entry file only mounts.** `src/popup/index.tsx` and `src/options/index.tsx` are `mount(<XScreen />)` and nothing else. The page lives in `src/screens/<name>/page.tsx` (default export `XScreen`), with `partials/` for the components only that screen uses. Screen-only helpers and config (`tabs.ts`, `parse-custom-time.ts`) sit next to `page.tsx`.
- **`packages/ui` is the design-system kit; `src/components/` is only what two or more screens use** (`Toaster`, `site-lists`). When a partial gains a second user, move it up rather than importing across screen folders; when the website needs it too, it goes to `packages/ui`. Never import from one app into another.
- **Logic and hooks live in `src/lib/`** (`useStorage`, `toast`, `shareStreak`…). A hook only one file needs lives in that file (`useCelebration` in the popup's `page.tsx`, `useTimeEditor` in `time-field.tsx`).
- **Icons come from `packages/ui/src/icons.ts` (`@focus-pocus/ui/icons`), never from the package directly.** Add one there with a domain name (`IconBlocklist`, not `Prohibit`), deep-imported per glyph (`@phosphor-icons/react/dist/csr/<Name>`): the package's root re-exports ~1500 icons and a development build bundles them all.
- **A screen is a composition of named parts**, not one function full of ternaries. When a component crosses Biome's `noExcessiveCognitiveComplexity` (15), split it (a helper, a lookup table, a partial); never suppress it.
- **Props are a `type Props`** next to the component (a second component in the same file names its own, e.g. `NavTabProps`); a one-prop component may type it inline (`{ streak }: { streak: number }`). Every component, and every prop whose meaning is not obvious, gets a `/** … */` comment saying what it is.
- **Storage in React goes through `useStorage`**; a screen reads it once and passes values and callbacks down. Partials never reach storage, not even through a helper that does (`handleStartTimer`, `playSound` are called from the screen and handed down as callbacks).
- **Text comes from `useMessages()`** in whichever component shows it, partials included: it is context, not storage (see 2.6).
- **Tokens only** (5.1): no hex in a component file. Class variants are lookup objects (`variants`, `sizes`, `tones`) joined with `cx`.

---

## 6. Branching and releases

- **`main` = the latest released version.** It always matches what is published in the stores. Never commit to `main` directly; it only receives merges from release branches (and hotfixes).
- **One release branch per upcoming version:** `release/<version>` (e.g. `release/1.2.0`), created from `main`. Only one release branch at a time.
- **Every change goes through a pull request into the current release branch.** Work in a short-lived branch named like the commit type (`feat/pause-button`, `fix/overlay-flicker`, `build/bun-tooling`), open a PR to `release/<version>`, merge it, delete the branch.
- **Releasing:**
  1. On the release branch, bump the version in `apps/extension/package.json`, `manifest.chrome.json` and `manifest.firefox.json` (`chore(release): v1.2.0`).
  2. Open a PR from `release/<version>` to `main` and merge it with a **merge commit** (not squash or rebase), so the changelog sees every commit; the workflow fails otherwise.
  3. The **Release** workflow (`.github/workflows/release.yml`) does the rest: it checks that the branch name and the three version fields agree, builds both browsers, zips them as `focus-pocus-<browser>-<version>.zip`, and creates the GitHub release `v<version>` (which also creates the tag on the merge commit). The changelog is generated by `.github/scripts/release-notes.sh` from the Conventional Commits since the previous `v*` tag, grouped by type; merges and `chore(release)` are left out.
  4. Download the zips from the release and upload them to the Chrome Web Store and Firefox Add-ons.
  5. Delete the release branch and create the next one from `main`.
- **Re-running a release:** Actions > Release > Run workflow on `main` releases the version in `apps/extension/package.json`; if that release already exists at the same commit, its zips and notes are replaced; if `main` has moved since, the run fails and asks for a version bump.
- **Hotfix for the published version:** branch `fix/<name>` from `main`, PR to `main`, bump the patch version (`v1.2.1`) in the PR, release it by running the Release workflow by hand on `main`, then merge `main` into the current release branch so the fix is not lost.
- Current release branch: **`release/1.2.0`**.

---

## 7. Known roadmap (from the README)

- [x] Custom timer
- [x] Allowlist mode
- [x] Support for other browsers (Firefox)
- [ ] Groups for the blocklist
- [x] Confirmation before giving up
- [x] Languages: English, Brazilian Portuguese and Spanish

---

## 8. Checklist when changing something

- [ ] Do `bun run lint`, `bun run typecheck`, both browser builds and `bun run build:web` pass?
- [ ] Changed a storage key? Update `StorageState` in `src/lib/storage.ts` and table 3.1, and check **every** context that reads it (background, content, popup, options).
- [ ] New or changed UI follows 5.1 (tokens) and 5.2 (screens, partials, kit, icons)?
- [ ] New or changed UI text is in `packages/locales/src/` (or the website's `apps/web/src/locales/`) in **all three** languages (see 2.6)?
- [ ] Changed the popup, the settings page or the focus screen? Update its drawing on the website (see 3.5).
- [ ] Added a permission or capability? Update **both** manifests.
- [ ] Bumped the version? Update `apps/extension/package.json`, `manifest.chrome.json` and `manifest.firefox.json`.
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
