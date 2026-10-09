<div align="center">

<img src="apps/extension/static/assets/logo/icon-128.png" alt="FocusPocus logo" width="88" />

# FocusPocus

**Transform your productivity like magic.**<br />
A free, open source browser extension that blocks distracting sites while your focus timer runs.

<a href="https://chromewebstore.google.com/detail/focuspocus-in-magical-foc/mhfhegccdlndlipjicelombmchnpdebc"><img src="https://img.shields.io/badge/Chrome_Web_Store-Add_to_Chrome-6d28d9?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Add to Chrome" /></a>
<a href="https://addons.mozilla.org/firefox/addon/focuspocus-in-magical-focus/"><img src="https://img.shields.io/badge/Firefox_Add--ons-Add_to_Firefox-6d28d9?style=for-the-badge&logo=firefoxbrowser&logoColor=white" alt="Add to Firefox" /></a>

<img src="https://img.shields.io/badge/license-MIT-6d28d9" alt="MIT license" />
<img src="https://img.shields.io/badge/Chrome-MV3-6d28d9" alt="Chrome Manifest V3" />
<img src="https://img.shields.io/badge/Firefox-MV2-6d28d9" alt="Firefox Manifest V2" />

<br />
<br />

<img src="assets/store/en/tile-marquee.png" alt="The FocusPocus popup mid-session in front of its settings page" />

</div>

## Features

- **Focus timer:** presets from 1 minute to 1 hour, or type your own time.
- **Focus screen:** during a session, distracting sites are covered by a screen with the time left.
- **Blocklist or allowlist:** block a handful of sites, or everything except the tools you work with.
- **Streak:** every finished session adds one. Giving up takes two clicks and resets it to zero.
- **Sounds and notifications:** optional, and all off until you turn them on.
- **Light and dark, in your language:** English, Brazilian Portuguese and Spanish.
- **Private:** no account, no tracking, no servers. Your lists and your streak stay in your browser.

Watch the [demo video](https://www.youtube.com/watch?v=AeRzctRV-4s).

## Run it locally

Requires [Bun](https://bun.sh).

```bash
git clone https://github.com/gugeldev/focus-pocus.git
cd focus-pocus
bun install            # dependencies and git hooks

bun run dev:chrome     # builds to apps/extension/dist/chrome on every save
bun run dev:firefox    # builds to apps/extension/dist/firefox
bun run dev:web        # the website, on http://localhost:3003
```

Then load the build in your browser:

- **Chrome:** open `chrome://extensions`, turn on developer mode, click _Load unpacked_ and pick `apps/extension/dist/chrome`.
- **Firefox:** open `about:debugging`, click _Load Temporary Add-on_ and pick `apps/extension/dist/firefox/manifest.json`.

| Folder              | What it is                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| `apps/extension`    | The browser extension (React, Tailwind CSS, webpack)                         |
| `apps/web`          | The website (Next.js), with working copies of the extension's screens        |
| `packages/ui`       | The design system both apps are built with                                   |
| `packages/locales`  | The extension's text in English, Portuguese and Spanish                      |
| `assets/store`      | The store images, exported from the website by `bun run store:shots`         |

## Contributing

`main` always matches the published version. The next one is built in a `release/<version>` branch (currently `release/1.2.0`), and every change reaches it through a pull request.

1. Fork the repository and branch off the current release branch, named after the kind of change (`feat/pause-button`, `fix/overlay-flicker`).
2. Write commit messages in English following [Conventional Commits](https://www.conventionalcommits.org) (`feat(popup): add pause button`).
3. Make sure `bun run lint`, `bun run typecheck`, both extension builds and `bun run build:web` pass.
4. Open a pull request **to the current release branch, not to `main`**.

The git hooks check most of this for you: Biome on commit, the commit message format, and the type-check on push.

## Contributors

Thanks to everyone who has contributed to FocusPocus.

<a href="https://github.com/gugeldev"><img src="https://github.com/gugeldev.png?size=128" alt="gugeldev" width="64" /></a>
<a href="https://github.com/Ryrden"><img src="https://avatars.githubusercontent.com/u/76923948?v=4" alt="Ryrden" width="64" /></a>
<a href="https://github.com/gabireze"><img src="https://avatars.githubusercontent.com/u/31194373?v=4" alt="gabireze" width="64" /></a>
<a href="https://github.com/fatekkl"><img src="https://avatars.githubusercontent.com/u/111793799?v=4" alt="fatekkl" width="64" /></a>

## License

[MIT](LICENSE)
