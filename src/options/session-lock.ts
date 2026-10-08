import { getStorage, onStorageChanged } from '../utils/storage';

// While a session runs, the lists and the allowlist mode are locked: the
// content scripts already decided what to block. Every control marked
// [data-locks-while-running] is disabled, and body.is-running shows the
// notices.

const LOCKABLE = '[data-locks-while-running]';

let isRunning = false;

function lockWhileRunning(running: boolean) {
  isRunning = running;
  document.body.classList.toggle('is-running', running);

  for (const control of document.querySelectorAll<HTMLInputElement | HTMLButtonElement>(LOCKABLE)) {
    control.disabled = running;
  }
}

function isSessionRunning() {
  return isRunning;
}

// Marks a control created after load, so it follows the lock too.
function makeLockable(control: HTMLInputElement | HTMLButtonElement) {
  control.toggleAttribute('data-locks-while-running', true);
  control.disabled = isRunning;
}

getStorage(['isRunning']).then((data) => lockWhileRunning(data.isRunning));

onStorageChanged((changes) => {
  if (changes.isRunning) lockWhileRunning(Boolean(changes.isRunning.newValue));
});

export { isSessionRunning, makeLockable };
