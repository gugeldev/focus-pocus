import { toast } from '@/lib/toast';

// Copies a ready-made text about the streak, for the popup's and the options
// page's streak buttons.

function getShareText(streak: number) {
  return streak === 0
    ? "I'm starting my streak on the FocusPocus extension now! 🚀\n\nTry it at Google Web Store or Firefox Store"
    : `My current streak on the FocusPocus extension is ${streak}! 🎯 \n\nTry it at Google Web Store or Firefox Store\n`;
}

function shareStreak(streak: number) {
  navigator.clipboard
    .writeText(getShareText(streak))
    .then(() => toast('Streak copied to your clipboard'))
    .catch(() => toast("Couldn't copy your streak.", true));
}

export { shareStreak };
