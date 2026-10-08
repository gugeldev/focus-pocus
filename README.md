# FocusPocus

[Demo Video](https://www.youtube.com/watch?v=AeRzctRV-4s)

### Download

The last published version:

- [Google Web Store](https://chromewebstore.google.com/detail/focuspocus-in-magical-foc/mhfhegccdlndlipjicelombmchnpdebc?hl=en)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/focuspocus-in-magical-focus/)

### About

<div>
    <img src="https://img.shields.io/github/languages/top/jotavetech/focus-pocus" alt="Most used language" />
    <img src="https://img.shields.io/github/last-commit/jotavetech/focus-pocus" alt="Last commit" />
    <img src="https://img.shields.io/badge/browser-extension-8A2BE2" alt="Browser extension" />
</div>

> FocusPocus is a browser extension created to help you maintain focus on your studies by blocking access to pages that may distract you during focus mode.

![FocusPocus icon (a clock) with the text 'FocusPocus' and below a slogan 'Stay focused as if under a magical spell'](https://i.imgur.com/pn5aZcT.png)

### Features

1. Focus Mode: Activate focus mode to block access to distracting websites while studying.
2. Custom Blocking: FocusPocus allows you to choose which sites to block during focus mode.
3. Scheduling: You can set the duration of your focus mode timer.
4. Streak: You earn a point every time the timer finishes, but if you give up halfway through, you lose everything.

### Todo

- [x] Add custom timer settings.
- [x] Add allowed list mode.
- [ ] Add groups for the blocked websites list.
- [ ] Add a verification prompt before giving up.
- [x] Add support for other browsers.
- [ ] Add PT-BR language support.

### How to run locally

Requires [Bun](https://bun.sh).

1. Clone this repository.
2. Install the dependencies (this also sets up the git hooks).
3. Run the dev script.
4. Activate developer mode on your browser and load the extension from the _/dist_ folder that will be generated (Chrome: _dist/chrome_, Firefox: _dist/firefox/manifest.json_).

```bash
git clone https://github.com/jotavetech/focus-pocus.git
cd focus-pocus

bun install #install the dependencies

# chrome:
bun run dev:chrome #compile to /dist/chrome folder

# firefox:
bun run dev:firefox #compile to /dist/firefox folder
```

The git hooks check your work: pre-commit runs Biome on the staged files, commit-msg enforces [Conventional Commits](https://www.conventionalcommits.org) in English, and pre-push runs the type-check.

### How to contribute

`main` always matches the latest published version. The next version is built in a `release/<version>` branch (currently `release/1.2.0`), and every change reaches it through a pull request.

1. Fork this repository and clone your fork.
2. Create a branch from the current release branch, named after the kind of change (e.g. `feat/pause-button`, `fix/overlay-flicker`).
3. Make your changes. Write commit messages in English following [Conventional Commits](https://www.conventionalcommits.org) (e.g. `feat(popup): add pause button`). The git hooks check this for you.
4. Make sure `bun run lint`, `bun run typecheck` and both builds pass.
5. Open a pull request **to the current release branch, not to `main`**, describing what you changed.

### Contributors

A big thank you to everyone who contributed to FocusPocus

<a href="https://github.com/jotavetech" target="_blank"><img src="https://avatars.githubusercontent.com/u/92704272?v=4" alt="jotavetech picture" style="width: 80px" /></a>
<a href="https://github.com/Ryrden" target="_blank"><img src="https://avatars.githubusercontent.com/u/76923948?v=4" alt="ryrden picture" style="width: 80px" /></a>
<a href="https://github.com/gabireze" target="_blank"><img src="https://avatars.githubusercontent.com/u/31194373?v=4" alt="gabizere picture" style="width: 80px" /></a>
<a href="https://github.com/fatekkl" target="_blank"><img src="https://avatars.githubusercontent.com/u/111793799?v=4" alt="gabizere picture" style="width: 80px" /></a>


[Support Me 💛](https://www.pixme.bio/jotavetech)
