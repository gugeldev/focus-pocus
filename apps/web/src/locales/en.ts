// The website's English copy, and the shape every other locale must match: a
// missing or extra key in pt-br.ts or es.ts is a type error. The drawings of
// the extension speak the extension's own copy (packages/locales), not this.

export const en = {
  meta: {
    title: 'FocusPocus: block distractions and stay focused',
    description:
      'A free, open source browser extension for Chrome and Firefox. Start a focus timer and the sites that steal your attention are blocked until it ends.',
  },
  nav: {
    home: 'FocusPocus, home',
    reviews: 'Reviews',
    focusScreen: 'Focus screen',
    features: 'Features',
    github: 'GitHub',
    install: 'Install',
  },
  stores: {
    chrome: 'Add to Chrome',
    firefox: 'Add to Firefox',
  },
  hero: {
    badge: 'Free and open source',
    /** The title's two lines; the second is set in the accent gradient. */
    titleLead: 'Stay focused as if',
    titleAccent: 'under a magical spell',
    lead: 'FocusPocus is a browser extension with a focus timer. While it runs, the sites that distract you are blocked. Finish the session to grow your streak; give up and you lose it.',
    github: 'View the code on GitHub',
    tryIt: 'Go ahead, it works: pick a time and start.',
  },
  focusScreen: {
    eyebrow: 'Focus screen',
    title: 'A blocked site waits for you to finish',
    intro:
      'Open a blocked site during a session and it is covered by the focus screen, with the time left. It goes away by itself when the session ends.',
  },
  features: {
    eyebrow: 'Features',
    title: 'Small, and does the job',
    items: {
      lists: {
        title: 'Blocklist or allowlist',
        body: 'Block a handful of sites, or block everything except the tools you work with.',
      },
      timer: {
        title: 'Any session length',
        body: 'Presets from 1 minute to 1 hour, or click the time and type your own.',
      },
      streak: {
        title: 'A streak to protect',
        body: 'Every finished session adds one. Giving up takes two clicks and resets it to zero.',
      },
      alerts: {
        title: 'Sounds and notifications',
        body: 'A notification when it is time for a break, and optional sounds. All off until you turn them on.',
      },
      languages: {
        title: 'In your language',
        body: 'English, Portuguese and Spanish, following your browser or your choice.',
      },
      private: {
        title: 'Nothing leaves your browser',
        body: 'No account, no tracking, no servers. Your lists and your streak are stored on your device.',
      },
    },
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'People who got their focus back',
    intro: 'Real reviews from the Chrome Web Store, as they were written.',
    /** Under the intro on the pages whose language is not the reviews' own; empty on pt-BR. */
    original: 'In their original Portuguese.',
    all: 'See them all on the Chrome Web Store',
  },
  install: {
    title: 'Ready to focus?',
    body: 'FocusPocus is free on Chrome and Firefox.',
    openSource: 'Open source under the MIT license. Found a bug or have an idea?',
    contribute: 'Contribute on GitHub',
  },
  footer: {
    tagline: 'A browser extension that blocks distractions while you focus.',
    get: 'Get it',
    project: 'Project',
    languages: 'Languages',
    source: 'Source code',
    issues: 'Report a bug',
    support: 'Support FocusPocus',
    license: 'MIT license',
    credits: 'Made by @jotavetech and contributors.',
  },
  mocks: {
    popup: 'The FocusPocus popup',
    settings: 'The FocusPocus settings page',
    focusScreen: 'A blocked site covered by the focus screen',
  },
};

export type SiteCopy = typeof en;
