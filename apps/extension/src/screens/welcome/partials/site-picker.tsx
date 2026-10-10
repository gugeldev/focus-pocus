import { Button } from '@focus-pocus/ui/button';
import { SettingRow } from '@/components/setting-row';
import { SettingsSection } from '@/components/settings-section';
import { SiteIcon } from '@/components/site-icon';
import { useMessages } from '@/lib/use-messages';
import { suggestedSites } from '@/screens/welcome/suggested-sites';

type Props = {
  /** The urls of the picked suggestions. */
  picked: string[];
  onPickedChange: (picked: string[]) => void;
  onBlock: () => void;
  onSkip: () => void;
};

/** The suggestions as setting rows, each with its switch, then Skip or Block (with how many). */
export function SitePicker({ picked, onPickedChange, onBlock, onSkip }: Props) {
  const t = useMessages();
  const copy = t.welcome;

  function toggle(url: string, checked: boolean) {
    onPickedChange(checked ? [...picked, url] : picked.filter((entry) => entry !== url));
  }

  return (
    <>
      <SettingsSection title={copy.sitesTitle}>
        {suggestedSites.map((site) => (
          <SettingRow
            key={site.url}
            icon={<SiteIcon url={site.url} />}
            label={site.name}
            description={site.url}
            checked={picked.includes(site.url)}
            onCheckedChange={(checked) => toggle(site.url, checked)}
          />
        ))}
      </SettingsSection>
      <footer className="flex flex-col gap-4 border-t border-border pt-7 wide:flex-row wide:items-center wide:justify-between">
        <p className="text-sm text-text-muted">{copy.sitesHint}</p>
        <div className="flex shrink-0 gap-2.5">
          <Button variant="secondary" onClick={onSkip}>
            {copy.skip}
          </Button>
          <Button variant="primary" disabled={picked.length === 0} onClick={onBlock}>
            {picked.length === 0 ? copy.pickOne : copy.block(picked.length)}
          </Button>
        </div>
      </footer>
    </>
  );
}
