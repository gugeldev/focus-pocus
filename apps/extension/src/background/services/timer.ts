import browser from 'webextension-polyfill';
import { sendTimerMessage } from '@/lib/messages';
import { playSound } from '@/lib/play-sound';
import { getStorage, setStorage } from '@/lib/storage';

import { resetStreak } from './streak';

function stopTimer() {
  sendTimerMessage('TIMER_FINISHED');

  setStorage({
    isRunning: false,
    timer: 0,
  });

  browser.action.setIcon({
    path: browser.runtime.getURL('assets/logo/icon-32.png'),
  });
}

function startTimer() {
  setStorage({
    isRunning: true,
    timer: 0,
  });

  sendTimerMessage('TIMER_STARTED');

  browser.action.setIcon({
    path: browser.runtime.getURL('assets/logo/icon-32-active.png'),
  });
}

// Runs in the background, which the popup and the focus screen ask with
// TIMER_GIVEN_UP. The streak is reset first: in Firefox stopTimer() throws on
// browser.action (AGENTS.md section 3) after it has stopped the session.
function giveUp() {
  resetStreak();
  stopTimer();
}

function handleStartTimer() {
  getStorage(['isRunning']).then((res) => {
    if (res.isRunning) {
      sendTimerMessage('TIMER_GIVEN_UP');
      playSound('giveup');
      return;
    }

    startTimer();
  });
}

function checkAndStopTimer() {
  getStorage(['timer', 'selectedTime']).then((res) => {
    if (res.timer >= res.selectedTime) {
      stopTimer();
      playSound('finished');
    }
  });
}

export { checkAndStopTimer, giveUp, handleStartTimer, stopTimer };
