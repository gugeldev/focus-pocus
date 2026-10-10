import { Button } from '@focus-pocus/ui/button';
import { IconSuccess } from '@focus-pocus/ui/icons';
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
    <section className="flex animate-page-in flex-col items-center gap-3 rounded-xl bg-surface px-6 py-10 text-center shadow-card">
      <IconSuccess aria-hidden="true" className="text-accent" size={40} weight="fill" />
      <h2 className="text-lg font-bold tracking-title">{copy.doneTitle}</h2>
      <p className="text-md text-text-muted">{copy.doneText(blockedCount)}</p>
      <p className="max-w-110 text-sm text-text-muted">{copy.pinTip}</p>
      <Button variant="secondary" className="mt-3" onClick={onOpenSettings}>
        {copy.openSettings}
      </Button>
    </section>
  );
}
