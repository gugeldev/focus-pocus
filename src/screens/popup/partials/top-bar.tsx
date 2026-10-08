import browser from 'webextension-polyfill';
import { Brand } from '@/components/brand';
import { IconButton } from '@/components/ui/icon-button';
import { IconSettings } from '@/components/ui/icons';
import { useMessages } from '@/lib/use-messages';
import { StreakButton } from '@/screens/popup/partials/streak-button';

type Props = {
  streak: number;
  isCelebrating: boolean;
  onCelebrated: () => void;
};

/** The brand on the left; the streak and the way to the settings on the right. */
export function TopBar({ streak, isCelebrating, onCelebrated }: Props) {
  const t = useMessages();

  return (
    <header className="flex items-center justify-between pt-4 pr-3 pl-4">
      <Brand size="sm" />
      <div className="flex items-center gap-1">
        <StreakButton streak={streak} isCelebrating={isCelebrating} onCelebrated={onCelebrated} />
        <IconButton
          pill
          icon={IconSettings}
          aria-label={t.popup.settings}
          title={t.popup.settings}
          onClick={() => browser.runtime.openOptionsPage()}
        />
      </div>
    </header>
  );
}
