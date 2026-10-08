import browser from 'webextension-polyfill';
import { getStorage, setStorage } from '@/lib/storage';

function pushFinishedSessionNotification() {
  browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('/assets/logo/icon-64.png'),
    title: 'Finished a session!',
    message: `Now you can take a break!`,
  });
}

async function getStreakAndIncrement() {
  getStorage(['streak']).then((res) => {
    const streak = res.streak || 0;
    setStorage({ streak: streak + 1 });
    browser.action.setIcon({ path: 'assets/logo/icon-32.png' });

    getStorage(['options']).then((res) => {
      if (res.options?.['victorious-notification']) pushFinishedSessionNotification();
    });
  });
}

function resetStreak() {
  setStorage({ streak: 0 });
}

export { getStreakAndIncrement, resetStreak };
