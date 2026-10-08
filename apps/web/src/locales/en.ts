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
    /** The title's two lines; the second is set in the accent gradient. */
    titleLead: 'Stay focused as if',
    titleAccent: 'under a magical spell',
    lead: 'A browser extension that blocks distracting sites while your focus timer runs.',
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
        tags: ['No account', 'No tracking', 'No servers'],
      },
    },
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'People who got their focus back',
    intro: 'See what people who use FocusPocus are saying.',
    rating: '5.0 on the Chrome Web Store',
    stars: (count: number) => `${count} stars`,
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
    /** Around the maintainer's linked handle: "Made by @gugeldev and contributors." */
    madeBy: 'Made by',
    andContributors: 'and contributors.',
  },
  notFound: {
    title: 'This page does not exist.',
    back: 'Back to FocusPocus',
  },
  mocks: {
    popup: 'The FocusPocus popup',
    settings: 'The FocusPocus settings page',
    focusScreen: 'A blocked site covered by the focus screen',
  },
};

export type SiteCopy = typeof en;
