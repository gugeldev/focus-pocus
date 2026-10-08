import { IconCopy, IconExternal, IconStreak, IconSupport } from '@/components/ui/icons';
import { cx } from '@/lib/cx';
import { shareStreak } from '@/lib/share-streak';
import { NavHint, NavLabel, navItemClasses } from '@/screens/options/partials/nav-item';

const SUPPORT_URL = 'https://www.pixme.bio/jotavetech';

const rowClasses = cx(navItemClasses, 'group hover:bg-item-hover hover:text-text');

/** The streak (click to copy it) and the support link, at the sidebar's foot. */
export function SidebarFooter({ streak }: { streak: number }) {
  return (
    <div className="mt-auto hidden flex-col gap-1.5 border-t border-border pt-4 wide:flex">
      <button
        type="button"
        className={rowClasses}
        title="Copy your streak to share it"
        onClick={() => shareStreak(streak)}
      >
        <IconStreak size={18} aria-hidden="true" className="shrink-0" />
        <NavLabel>
          <span className="tabular-nums">{streak}</span> in a row
        </NavLabel>
        <NavHint icon={IconCopy} />
      </button>
      <a className={rowClasses} href={SUPPORT_URL} target="_blank" rel="noreferrer">
        <IconSupport size={18} aria-hidden="true" className="shrink-0" />
        <NavLabel>Support FocusPocus</NavLabel>
        <NavHint icon={IconExternal} />
      </a>
    </div>
  );
}
