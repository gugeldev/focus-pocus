import { cx } from '@focus-pocus/ui/cx';
import { IconCopy, IconStreak } from '@focus-pocus/ui/icons';
import { shareStreak } from '@/lib/share-streak';
import { useMessages } from '@/lib/use-messages';
import { NavHint, NavLabel, navItemClasses } from '@/screens/options/partials/nav-item';

const rowClasses = cx(navItemClasses, 'group hover:bg-item-hover hover:text-text');

/** The streak (click to copy it), at the sidebar's foot. */
export function SidebarFooter({ streak }: { streak: number }) {
  const t = useMessages();

  return (
    <div className="mt-auto hidden flex-col gap-1.5 border-t border-border pt-4 wide:flex">
      <button
        type="button"
        className={rowClasses}
        title={t.options.streakTitle}
        onClick={() => shareStreak(streak, t.share)}
      >
        <IconStreak size={18} aria-hidden="true" className="shrink-0" />
        <NavLabel>
          <span className="tabular-nums">{streak}</span> {t.options.inARow}
        </NavLabel>
        <NavHint icon={IconCopy} />
      </button>
    </div>
  );
}
