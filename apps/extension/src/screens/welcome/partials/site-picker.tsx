import { Button } from '@focus-pocus/ui/button';
import { useMessages } from '@/lib/use-messages';
import { SiteOption } from '@/screens/welcome/partials/site-option';
import { suggestedSites } from '@/screens/welcome/suggested-sites';

type Props = {
  /** The urls of the picked suggestions. */
  picked: string[];
  onPickedChange: (picked: string[]) => void;
  onBlock: () => void;
  onSkip: () => void;
};

/** The suggestions to tick, then Block (with how many) or Skip. */
export function SitePicker({ picked, onPickedChange, onBlock, onSkip }: Props) {
  const t = useMessages();
  const copy = t.welcome;

  function toggle(url: string, checked: boolean) {
    onPickedChange(checked ? [...picked, url] : picked.filter((entry) => entry !== url));
  }

  return (
    <section className="flex animate-page-in flex-col gap-5 rounded-xl bg-surface p-5 shadow-card wide:p-6">
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-3 text-xs font-semibold tracking-label text-text-faint uppercase">
          {copy.sitesTitle}
        </legend>
        <div className="grid grid-cols-1 gap-2.5 wide:grid-cols-2">
          {suggestedSites.map((site) => (
            <SiteOption
              key={site.url}
              site={site}
              checked={picked.includes(site.url)}
              onCheckedChange={(checked) => toggle(site.url, checked)}
            />
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-text-muted">{copy.sitesHint}</p>
      <div className="flex flex-col-reverse gap-2.5 wide:flex-row wide:justify-end">
        <Button variant="secondary" onClick={onSkip}>
          {copy.skip}
        </Button>
        <Button variant="primary" disabled={picked.length === 0} onClick={onBlock}>
          {picked.length === 0 ? copy.pickOne : copy.block(picked.length)}
        </Button>
      </div>
    </section>
  );
}
