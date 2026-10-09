import browser from 'webextension-polyfill';
import { getStorage } from './storage';

/** Each sound's file in assets/sounds/ and the switch in `options` that turns it on. */
const sounds = {
  giveup: { file: 'lose.wav', option: 'give-up-sound' },
  finished: { file: 'finished.mp3', option: 'victorious-sound' },
  button: { file: 'press.mp3', option: 'button-sound' },
} as const;

/**
 * Plays a sound if its switch is on. From the popup, or the focus screen, where
 * a page's CSP or autoplay policy may refuse it; the session goes on without it.
 */
function playSound(soundType: keyof typeof sounds) {
  const { file, option } = sounds[soundType];

  getStorage('options').then(({ options }) => {
    if (!options?.[option]) return;
    new Audio(browser.runtime.getURL(`/assets/sounds/${file}`)).play().catch(() => {});
  });
}

export { playSound };
