import browser from 'webextension-polyfill';
import { onTimerMessage } from '../utils/messages';
import { getStorage, seedStorageDefaults, setStorage } from '../utils/storage';
import { getStreakAndIncrement } from './services/streak';
import { checkAndStopTimer } from './services/timer';

let interval: ReturnType<typeof setInterval>;

onTimerMessage((type) => {
  if (type === 'TIMER_STARTED') {
    startTimer();
    browser.action.setIcon({ path: 'assets/logo/icon-32-active.png' });
  } else if (type === 'TIMER_FINISHED') {
    stopTimer();
    browser.action.setIcon({ path: 'assets/logo/icon-32.png' });
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

function stopTimer() {
  if (interval) clearInterval(interval);
}

seedStorageDefaults();
