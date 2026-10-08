import { getStorage, onStorageChanged } from '../utils/storage';
import { hideOverlay, showOverlay, updateOverlayTime } from './overlay';

let blocklist: string[] = [];
let allowlist: string[] = [];
let allowlistMode = false;
let selectedTime = 0;

function shouldBlock() {
  const url = window.location.href;
  return allowlistMode
    ? !allowlist.some((entry) => url.includes(entry))
    : blocklist.some((entry) => url.includes(entry));
}

function applyFocusMode(timer: number) {
  if (shouldBlock()) showOverlay(selectedTime - timer);
  else hideOverlay();
}

function initialize() {
  getStorage(['blocklist', 'allowlist', 'isRunning', 'options', 'selectedTime', 'timer']).then(
    (res) => {
      blocklist = res.blocklist ?? [];
      allowlist = res.allowlist ?? [];
      allowlistMode = Boolean(res.options?.['allowlist-mode']);
      selectedTime = res.selectedTime;

      if (res.isRunning) applyFocusMode(res.timer);
    },
  );
}

onStorageChanged((changes) => {
  if (changes.blocklist) blocklist = changes.blocklist.newValue ?? [];
  if (changes.allowlist) allowlist = changes.allowlist.newValue ?? [];
  if (changes.options) allowlistMode = Boolean(changes.options.newValue?.['allowlist-mode']);
  if (changes.selectedTime?.newValue) selectedTime = changes.selectedTime.newValue;

  if (changes.isRunning) {
    if (changes.isRunning.newValue) applyFocusMode(0);
    else hideOverlay();
  }

  if (changes.timer?.newValue !== undefined)
    updateOverlayTime(selectedTime - changes.timer.newValue);
});

initialize();
