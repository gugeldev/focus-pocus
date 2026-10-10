import { Button } from '@focus-pocus/ui/button';
import { IconSuccess } from '@focus-pocus/ui/icons';
import { EmptyState } from '@/components/empty-state';
import { useMessages } from '@/lib/use-messages';

type Props = {
  /** How many sites the blocklist holds now. */
  blockedCount: number;
  onOpenSettings: () => void;
};

/** What comes after the picker: what was saved and where to go next. */
export function AllSet({ blockedCount, onOpenSettings }: Props) {
  const t = useMessages();
  const copy = t.welcome;

  return (
    <EmptyState icon={IconSuccess} title={copy.doneTitle} text={copy.doneText(blockedCount)}>
      <p className="mt-3 max-w-90 text-sm text-text-faint">{copy.pinTip}</p>
      <Button variant="secondary" className="mt-6" onClick={onOpenSettings}>
        {copy.openSettings}
      </Button>
    </EmptyState>
  );
}
