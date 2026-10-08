import { Brand } from '@focus-pocus/ui/brand';
import { IconButton } from '@focus-pocus/ui/icon-button';
import { IconSettings } from '@focus-pocus/ui/icons';
import browser from 'webextension-polyfill';
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
      <Brand logoSrc="../assets/logo/icon-64.png" size="sm" />
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
