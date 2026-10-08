// The English copy, and the shape every other locale must match: a missing or
// extra key in pt-br.ts or es.ts is a type error. Functions take what the text
// interpolates.

export const en = {
  popup: {
    settings: 'Settings',
    streakTitle: 'Copy your streak',
    streakLabel: 'sessions in a row, copy to share',
    timer: 'Timer',
    customSession: 'Custom session',
    customTimeTitle: 'Set a custom time',
    customTimeLabel: 'Custom time, as hh:mm:ss, mm:ss or seconds',
    customTimeHint: 'Click to customize',
    customTimeEditingHint: 'Enter to save · Esc to cancel',
    sessionSettings: 'Session settings',
    modes: { blocklist: 'Blocklist', allowlist: 'Allowlist' },
    start: 'Start focusing',
    giveUp: 'Give up',
    /** One is picked at random as the caption while a session runs. */
    encouragements: [
      'Keep going!',
      'Never quit!',
      'Stay focused!',
      'You can do it!',
      "Don't give up!",
      'Reach your goals!',
      'Stay motivated!',
      'You got this!',
    ],
  },
  options: {
    pageTitle: 'FocusPocus · Settings',
    sections: 'Settings sections',
    streakTitle: 'Copy your streak to share it',
    /** Follows the streak count in the sidebar: "12 in a row". */
    inARow: 'in a row',
    support: 'Support FocusPocus',
    general: {
      title: 'General',
      description: 'Choose how FocusPocus speaks, sounds, notifies and blocks while you focus.',
      locked: 'A focus session is running. Blocking settings unlock when it ends.',
      language: {
        title: 'Language',
        description: 'Automatic follows your browser’s language.',
        auto: 'Automatic',
      },
      sounds: {
        title: 'Sounds',
        button: {
          label: 'Start and give up',
          description: 'A soft click when you start or stop a session.',
        },
        victory: {
          label: 'Victory',
          description: 'Plays when a session finishes while the popup is open.',
        },
        giveUp: {
          label: 'Giving up',
          description: 'A reminder that quitting costs your streak.',
        },
      },
      notifications: {
        title: 'Notifications',
        finished: {
          label: 'Session finished',
          description: "A system notification telling you it's time for a break.",
        },
      },
      blocking: {
        title: 'Blocking',
        allowlistMode: {
          label: 'Allowlist mode',
          description:
            'Block every site except the ones on your allowlist, instead of only the ones on your blocklist.',
        },
      },
    },
    siteList: {
      activeMode: 'Active mode',
      locked: 'A focus session is running. This list unlocks when it ends.',
      emptyEntry: 'Enter a website first.',
      remove: (url: string) => `Remove ${url}`,
    },
    siteLists: {
      blocklist: {
        title: 'Blocklist',
        description:
          'While you focus, any page whose address contains one of these is covered by the focus screen.',
        inputLabel: 'Website to block',
        placeholder: 'youtube.com',
        addLabel: 'Block',
        listLabel: 'Blocked websites',
        emptyTitle: 'Nothing blocked yet',
        emptyText: 'Add the sites that steal your attention, like social feeds or video platforms.',
        duplicate: 'This website is already in your blocklist.',
      },
      allowlist: {
        title: 'Allowlist',
        description:
          'In allowlist mode, only pages whose address contains one of these stay reachable while you focus.',
        inputLabel: 'Website to allow',
        placeholder: 'docs.google.com',
        addLabel: 'Allow',
        listLabel: 'Allowed websites',
        emptyTitle: 'Nothing allowed yet',
        emptyText: 'Add the tools you need to work, like your docs, editor or course platform.',
        duplicate: 'This website is already in your allowlist.',
      },
    },
  },
  share: {
    starting:
      "I'm starting my streak on the FocusPocus extension now! 🚀\n\nTry it at Chrome Web Store or Firefox Store",
    current: (streak: number) =>
      `My current streak on the FocusPocus extension is ${streak}! 🎯\n\nTry it at Chrome Web Store or Firefox Store`,
    copied: 'Streak copied to your clipboard',
    copyFailed: "Couldn't copy your streak.",
  },
  overlay: {
    eyebrow: 'Focus mode',
    title: 'This site is under a focus spell',
    lead: 'It will be back when your session ends. Until then, the work in front of you deserves your attention.',
    timeLabel: 'left in this session',
    warning: 'Giving up resets your streak.',
  },
  notification: {
    title: 'Finished a session!',
    message: 'Now you can take a break!',
  },
};

export type Messages = typeof en;
