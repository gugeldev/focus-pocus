import toast from '../utils/toast';
import { streakButton, streakCounter, streakTooltip } from './elements';

streakButton.addEventListener('click', () => {
  toast('Streak copied to clipboard! 🎉');

  streakTooltip.textContent = 'Copied!';

  setTimeout(() => {
    streakTooltip.textContent = 'Copy streak';
  }, 2000);

  if (streakCounter.textContent === '0') {
    navigator.clipboard.writeText(
      "I'm starting my streak on the FocusPocus extension now! 🚀\n\nTry it at Google Web Store or Firefox Store",
    );
  } else {
    navigator.clipboard.writeText(
      `My current streak on the FocusPocus extension is ${streakCounter.textContent}! 🎯 \n\nTry it at Google Web Store or Firefox Store\n`,
    );
  }
});
