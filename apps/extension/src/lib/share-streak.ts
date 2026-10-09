import type { Messages } from '@/lib/i18n';
import { toast } from '@/lib/toast';

// Copies a ready-made text about the streak, for the popup's and the options
// page's streak buttons.

function shareStreak(streak: number, copy: Messages['share']) {
  navigator.clipboard
    .writeText(streak === 0 ? copy.starting : copy.current(streak))
    .then(() => toast(copy.copied))
    .catch(() => toast(copy.copyFailed, true));
}

export { shareStreak };
