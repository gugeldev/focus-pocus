import { getStorage, onStorageChanged } from './storage';
import toast from './toast';

// The streak counter shared by the popup and the options page: it shows the
// stored streak and, on click, copies a ready-made text to share it.

function getShareText(streak: number) {
  return streak === 0
    ? "I'm starting my streak on the FocusPocus extension now! 🚀\n\nTry it at Google Web Store or Firefox Store"
    : `My current streak on the FocusPocus extension is ${streak}! 🎯 \n\nTry it at Google Web Store or Firefox Store\n`;
}

function bindStreakButton(button: HTMLButtonElement, counter: HTMLElement) {
  let streak = 0;

  const render = (value: number) => {
    streak = value;
    counter.textContent = value.toString();
  };

  getStorage(['streak']).then((data) => render(data.streak));

  onStorageChanged((changes) => {
    if (changes.streak) render(changes.streak.newValue ?? 0);
  });

  button.addEventListener('click', () => {
    navigator.clipboard
      .writeText(getShareText(streak))
      .then(() => toast('Streak copied to your clipboard'))
      .catch(() => toast("Couldn't copy your streak.", true));
  });
}

export default bindStreakButton;
