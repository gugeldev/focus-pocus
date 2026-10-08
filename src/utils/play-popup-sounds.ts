import browser from 'webextension-polyfill';
import { getStorage } from './storage';

function playFinishedSound() {
  const finishedSound = new Audio(browser.runtime.getURL('/assets/sounds/finished.mp3'));
  finishedSound.load();
  finishedSound.play();
}

function playButtonPressSound() {
  const pressSound = new Audio(browser.runtime.getURL('/assets/sounds/press.mp3'));
  pressSound.load();
  pressSound.play();
}

function playGiveUpSound() {
  const giveUpSound = new Audio(browser.runtime.getURL('/assets/sounds/lose.wav'));
  giveUpSound.load();
  giveUpSound.play();
}

function playSound(soundType: 'giveup' | 'finished' | 'button') {
  if (soundType === 'giveup') {
    getStorage('options').then((data) => {
      if (data.options?.['give-up-sound']) {
        playGiveUpSound();
      }
    });
    return;
  }

  if (soundType === 'finished') {
    getStorage('options').then((data) => {
      if (data.options?.['victorious-sound']) {
        playFinishedSound();
      }
    });
    return;
  }

  getStorage('options').then((data) => {
    if (data.options?.['button-sound']) {
      playButtonPressSound();
    }
  });
}

export default playSound;
