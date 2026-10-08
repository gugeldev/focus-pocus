import browser from 'webextension-polyfill';
import { changeSelectedTime, handleStartTimer } from '../background/services/timer';
import getDoNotGiveUpMessage from '../utils/do-not-giveup';
import formatTime from '../utils/format-time';
import { sendTimerMessage } from '../utils/messages';
import playSound from '../utils/play-popup-sounds';
import { checkSegmentedValue, syncSegmented } from '../utils/segmented';
import bindStreakButton from '../utils/share-streak';
import { getStorage, onStorageChanged, setStorage } from '../utils/storage';

import {
  configButton,
  controls,
  customInput,
  dialCaption,
  dialHint,
  modeControl,
  presets,
  ringProgress,
  startButton,
  startLabel,
  streakButton,
  streakCounter,
  timerDisplay,
} from './elements';

const CUSTOM_CAPTION = 'Custom session';
const SHORT_TIME_LENGTH = 5; // "mm:ss"

let isTimerRunning = false;

// Parses "ss", "mm:ss" or "hh:mm:ss" into seconds. Returns null for anything
// that is not a positive duration.
function parseCustomTime(value: string) {
  const units = [1, 60, 3600];
  const parts = value.trim().split(':').reverse();
  if (parts.length > units.length) return null;

  let totalSeconds = 0;
  for (const [index, part] of parts.entries()) {
    if (!/^\d+$/.test(part)) return null;
    totalSeconds += parseInt(part, 10) * units[index];
  }

  return totalSeconds > 0 ? totalSeconds : null;
}

function fitTime(element: HTMLElement, text: string) {
  element.classList.toggle('time-long', text.length > SHORT_TIME_LENGTH);
}

function renderRunningState(isRunning: boolean) {
  const changed = isRunning !== isTimerRunning;
  isTimerRunning = isRunning;
  document.body.dataset.state = isRunning ? 'running' : 'idle';

  controls.disabled = isRunning;
  timerDisplay.disabled = isRunning;
  startButton.classList.toggle('btn-primary', !isRunning);
  startButton.classList.toggle('btn-danger', isRunning);

  if (!changed) return;

  startLabel.textContent = isRunning ? 'Give up' : 'Start focusing';
  startButton.classList.remove('swap');
  // Restart the label animation on the next frame.
  requestAnimationFrame(() => startButton.classList.add('swap'));

  if (isRunning) {
    closeCustomInput();
    dialCaption.textContent = getDoNotGiveUpMessage();
  }
}

function render() {
  getStorage(['timer', 'selectedTime', 'isRunning', 'options']).then((res) => {
    const { timer, selectedTime, isRunning, options } = res;

    const isPreset = checkSegmentedValue(presets, selectedTime.toString());
    checkSegmentedValue(modeControl, options?.['allowlist-mode'] ? 'allowlist' : 'blocklist');

    const secondsLeft = isRunning ? Math.max(selectedTime - timer, 0) : selectedTime;
    timerDisplay.textContent = formatTime(secondsLeft);
    fitTime(timerDisplay, timerDisplay.textContent);
    ringProgress.style.setProperty('--progress', (secondsLeft / selectedTime).toString());

    renderRunningState(isRunning);

    if (!isRunning) {
      dialCaption.textContent = isPreset ? '' : CUSTOM_CAPTION;
    }
  });
}

function openCustomInput() {
  if (isTimerRunning) return;

  customInput.value = timerDisplay.textContent ?? '';
  fitTime(customInput, customInput.value);
  customInput.hidden = false;
  timerDisplay.hidden = true;
  dialHint.textContent = 'Enter to save · Esc to cancel';
  customInput.focus();
  customInput.select();
}

function closeCustomInput() {
  if (customInput.hidden) return;

  customInput.hidden = true;
  timerDisplay.hidden = false;
  dialHint.textContent = 'Click to customize';
}

function applyCustomTime() {
  if (customInput.hidden) return;

  const totalSeconds = parseCustomTime(customInput.value);
  closeCustomInput();
  if (totalSeconds !== null) changeSelectedTime(totalSeconds);
}

function celebrate() {
  streakButton.classList.remove('bump');
  requestAnimationFrame(() => streakButton.classList.add('bump'));
}

function checkIfIsRunningAndSendAMessage() {
  getStorage(['isRunning']).then((res) => {
    if (res.isRunning) sendTimerMessage('TIMER_STARTED');
  });
}

onStorageChanged((changes) => {
  const { oldValue, newValue } = changes.streak ?? {};
  if (oldValue !== undefined && newValue !== undefined && oldValue < newValue) {
    playSound('finished');
    celebrate();
  }

  if (changes.timer || changes.isRunning || changes.selectedTime || changes.options) {
    render();
  }
});

startButton.addEventListener('click', () => {
  playSound('button');
  applyCustomTime();
  handleStartTimer();
});

presets.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  syncSegmented(presets);
  changeSelectedTime(parseInt(input.value, 10));
});

modeControl.addEventListener('change', () => {
  syncSegmented(modeControl);
  const allowlistMode =
    modeControl.querySelector<HTMLInputElement>('input:checked')?.value === 'allowlist';
  getStorage('options').then((res) => {
    setStorage({ options: { ...res.options, 'allowlist-mode': allowlistMode } });
  });
});

timerDisplay.addEventListener('click', openCustomInput);
customInput.addEventListener('input', () => fitTime(customInput, customInput.value));
customInput.addEventListener('blur', applyCustomTime);
customInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') applyCustomTime();
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCustomInput();
    timerDisplay.focus();
  }
});

configButton.addEventListener('click', () => browser.runtime.openOptionsPage());

bindStreakButton(streakButton, streakCounter);

checkIfIsRunningAndSendAMessage();
render();
