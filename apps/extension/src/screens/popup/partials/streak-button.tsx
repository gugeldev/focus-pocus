import { cx } from '@focus-pocus/ui/cx';
import { IconStreak } from '@focus-pocus/ui/icons';
import { shareStreak } from '@/lib/share-streak';
import { useMessages } from '@/lib/use-messages';

type Props = {
  streak: number;
  /** Bumps the pill once; onCelebrated fires when the bump is over. */
  isCelebrating: boolean;
  onCelebrated: () => void;
};

/** The flame pill in the top bar. Clicking it copies the streak to share it. */
export function StreakButton({ streak, isCelebrating, onCelebrated }: Props) {
  const t = useMessages();

  return (
    <button
      type="button"
      className={cx(
        'focus-ring inline-flex h-8 items-center gap-1 rounded-full pr-3 pl-2.5 text-sm font-semibold text-text-muted tabular-nums transition-colors duration-(--duration) ease-fluid hover:bg-raised-hover hover:text-text',
        isCelebrating && 'animate-bump',
      )}
      title={t.popup.streakTitle}
      onClick={() => shareStreak(streak, t.share)}
      onAnimationEnd={onCelebrated}
    >
      <IconStreak weight="fill" size={15} className="text-streak" aria-hidden="true" />
      <span>{streak}</span>
      <span className="sr-only">{t.popup.streakLabel}</span>
    </button>
  );
}
