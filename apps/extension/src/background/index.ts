import browser from 'webextension-polyfill';
import { onTimerMessage } from '@/lib/messages';
import { getStorage, seedStorageDefaults, setStorage } from '@/lib/storage';
import { getStreakAndIncrement } from './services/streak';
import { checkAndStopTimer, giveUp } from './services/timer';

let interval: ReturnType<typeof setInterval>;

onTimerMessage((type) => {
  if (type === 'TIMER_STARTED') {
    startTimer();
    browser.action.setIcon({ path: 'assets/logo/icon-32-active.png' });
  } else if (type === 'TIMER_FINISHED') {
    clearTickInterval();
    browser.action.setIcon({ path: 'assets/logo/icon-32.png' });
  } else if (type === 'TIMER_GIVEN_UP') {
    // Every give up lands here, from the popup or the focus screen.
    clearTickInterval();
    giveUp();
  }
});

function startTimer() {
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    getStorage(['timer', 'isRunning', 'selectedTime']).then((res) => {
      if (res.isRunning) {
        const timer = res.timer + 1;
        let isRunning = true;

        if (timer >= res.selectedTime) {
          isRunning = false;
          getStreakAndIncrement();
        }

        setStorage({ timer, isRunning });

        if (!isRunning) {
          checkAndStopTimer();
          clearInterval(interval);
        }
      }
    });
  }, 1000);
}

function clearTickInterval() {
  if (interval) clearInterval(interval);
}

// The welcome screen, once: on a fresh install, not on updates.
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install')
    browser.tabs.create({ url: browser.runtime.getURL('welcome/index.html') });
});

seedStorageDefaults();
