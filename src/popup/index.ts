import browser from 'webextension-polyfill';
import { sendTimerMessage } from '../utils/messages';
import { getStorage, onStorageChanged, setStorage } from '../utils/storage';
import './streak';

import { changeSelectedTime, handleStartTimer } from '../background/services/timer';
import changePopupColor from '../utils/change-popup-color';
import getDoNotGiveUpMessage from '../utils/do-not-giveup';
import playSound from '../utils/play-popup-sounds';

import {
  configButton,
  customInput,
  doNotGiveUpMessage,
  focusMode,
  selectTime,
  startButton,
  streakCounter,
  timerDisplay,
} from './elements';

let isTimerRunning = false;

function changeAppStyleMode(isRunning: boolean) {
  changePopupColor(isRunning);
  startButton.innerHTML = isRunning ? 'GIVE UP!' : 'START FOCUSING';
  timerDisplay.style.pointerEvents = isRunning ? 'none' : 'auto';
  doNotGiveUpMessage.style.display = isRunning ? 'block' : 'none';
  selectTime.disabled = isRunning;
  focusMode.disabled = isRunning;
  customInput.disabled = isRunning;
}

function updateFocusModeButton(isAllowlistMode: boolean) {
  focusMode.textContent = isAllowlistMode ? 'Allowlist Mode' : 'Blocklist Mode';
}

function getRandomDoNotGiveUpMessage() {
  doNotGiveUpMessage.textContent = getDoNotGiveUpMessage();
}

function updateTimer() {
  getStorage(['timer', 'selectedTime', 'timeLabel', 'isRunning', 'streak', 'options']).then(
    (res) => {
      const { timer, selectedTime, timeLabel, isRunning, streak, options: settings } = res;

      selectTime.value = selectedTime.toString() || '60';
      streakCounter.innerHTML = streak.toString() || '0';

      const options = Array.from(selectTime.options);
      const matchingOption = options.find((option) => option.value === selectedTime.toString());
      if (matchingOption) {
        matchingOption.selected = true;
      } else {
        updateSelectOption(selectedTime, timeLabel || 'Custom Time');
      }

      const totalSecondsLeft = selectedTime - timer;
      if (totalSecondsLeft <= 0) {
        handleTimerEnd();
      } else {
        timerDisplay.innerHTML = formatTime(totalSecondsLeft);
      }
      isTimerRunning = isRunning;

      if (settings) updateFocusModeButton(settings['allowlist-mode']);

      changeAppStyleMode(isRunning);
    },
  );
}

function checkIfIsRunningAndSendAMessage() {
  getStorage(['isRunning']).then((res) => {
    if (res.isRunning) {
      sendTimerMessage('TIMER_STARTED');
    }
  });
}

checkIfIsRunningAndSendAMessage();

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    hours > 0 ? `${hours < 10 ? `0${hours}` : hours}` : '00',
    `${minutes < 10 ? `0${minutes}` : minutes}`,
    `${seconds < 10 ? `0${seconds}` : seconds}`,
  ];

  return parts.join(':');
}

function handleStartTimerButton() {
  playSound('button');
  const customTime = parseCustomTime();
  if (customTime !== null) {
    changeSelectedTime(customTime.totalSeconds, customTime.label);
    updateSelectOption(customTime.totalSeconds, customTime.label);
  }
  handleStartTimer();
}

const TIME_UNITS = [
  { seconds: 1, label: (n: number) => `${n} S` },
  { seconds: 60, label: (n: number) => `${n} MIN` },
  { seconds: 3600, label: (n: number) => `${n} HOUR${n > 1 ? 'S' : ''}` },
];

// Parses "ss", "mm:ss" or "hh:mm:ss" into seconds and a label like "1 HOUR 30 MIN".
function parseCustomTime() {
  if (customInput.style.display === 'none') return null;

  const timeParts = customInput.value.split(':').reverse();
  let totalSeconds = 0;
  const labelParts: string[] = [];

  TIME_UNITS.forEach((unit, index) => {
    const value = parseInt(timeParts[index], 10);
    if (Number.isNaN(value)) return;

    totalSeconds += value * unit.seconds;
    if (value > 0) labelParts.unshift(unit.label(value));
  });

  return totalSeconds > 0 ? { totalSeconds, label: labelParts.join(' ') } : null;
}

function handleTimerSelect(e: Event) {
  const selectElement = e.target as HTMLSelectElement;
  const totalSeconds = parseInt(selectElement.value, 10);
  const option = selectElement.options[selectElement.selectedIndex];
  const label = option.textContent || '';

  timerDisplay.innerHTML = formatTime(totalSeconds);
  changeSelectedTime(totalSeconds, label);
}

function applyCustomTime() {
  const timeData = parseCustomTime();
  if (timeData) {
    const { totalSeconds, label } = timeData;
    timerDisplay.innerHTML = formatTime(totalSeconds);
    updateSelectOption(totalSeconds, label);
    changeSelectedTime(totalSeconds, label);
  }
  customInput.style.display = 'none';
  timerDisplay.style.display = 'block';
}

function updateSelectOption(seconds: number, label: string) {
  let options = Array.from(selectTime.options).map((option) => ({
    value: parseInt(option.value, 10),
    label: option.textContent || '',
  }));

  const newOption = { value: seconds, label };
  options = options.filter((option) => option.value !== newOption.value);
  options.push(newOption);
  options.sort((a, b) => a.value - b.value);

  selectTime.innerHTML = '';
  options.forEach((option) => {
    const optionElement = document.createElement('option') as HTMLOptionElement;
    optionElement.value = option.value.toString();
    optionElement.textContent = option.label;
    selectTime.appendChild(optionElement);
  });

  selectTime.value = seconds.toString();
}

function handleTimerEnd() {
  isTimerRunning = false;
  startButton.textContent = 'START FOCUSING';
  selectTime.disabled = false;
  focusMode.disabled = false;
  customInput.disabled = false;
  customInput.style.display = 'none';
  timerDisplay.style.display = 'block';
  timerDisplay.style.pointerEvents = 'auto';
}

onStorageChanged((changes) => {
  const { oldValue, newValue } = changes.streak ?? {};
  if (oldValue !== undefined && newValue !== undefined && oldValue < newValue) {
    playSound('finished');
  }
  if (changes.timer && changes.timer.oldValue !== changes.timer.newValue) {
    updateTimer();
  }
});

startButton.addEventListener('click', handleStartTimerButton);
selectTime.addEventListener('change', handleTimerSelect);
configButton.addEventListener('click', () => browser.runtime.openOptionsPage());

focusMode.addEventListener('click', () => {
  getStorage('options').then((res) => {
    if (res.options?.['allowlist-mode']) {
      setStorage({
        options: { ...res.options, 'allowlist-mode': false },
      });
      updateFocusModeButton(false);
    } else {
      setStorage({
        options: { ...res.options, 'allowlist-mode': true },
      });
      updateFocusModeButton(true);
    }
  });
});

timerDisplay.addEventListener('click', () => {
  if (!isTimerRunning) {
    customInput.style.display = 'block';
    timerDisplay.style.display = 'none';
    customInput.value = timerDisplay.textContent || '00:00';
    customInput.focus();
  }
});

customInput.addEventListener('blur', applyCustomTime);
customInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    applyCustomTime();
  }
});

startButton.addEventListener('click', () => {
  isTimerRunning = !isTimerRunning;
  startButton.textContent = isTimerRunning ? 'GIVE UP!' : 'START FOCUSING';
  timerDisplay.style.pointerEvents = isTimerRunning ? 'none' : 'auto';
  getRandomDoNotGiveUpMessage();
});

updateTimer();
