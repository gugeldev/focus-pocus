import browser from 'webextension-polyfill';
import { sendTimerMessage } from '../../utils/messages';
import playSound from '../../utils/play-popup-sounds';
import { getStorage, setStorage } from '../../utils/storage';

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

function handleStartTimer() {
  getStorage(['isRunning']).then((res) => {
    if (res.isRunning) {
      stopTimer();
      resetStreak();
      playSound('giveup');
      return;
    }

    startTimer();
  });
}

function changeSelectedTime(seconds: number, label: string) {
  setStorage({
    selectedTime: seconds,
    timeLabel: label,
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

export { changeSelectedTime, checkAndStopTimer, handleStartTimer, stopTimer };
