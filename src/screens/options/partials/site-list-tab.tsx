import { toast } from '@/lib/toast';
import { ActiveModeBadge } from '@/screens/options/partials/active-mode-badge';
import { AddSiteForm } from '@/screens/options/partials/add-site-form';
import { EmptyList } from '@/screens/options/partials/empty-list';
import { LockedNotice } from '@/screens/options/partials/locked-notice';
import { SiteList } from '@/screens/options/partials/site-list';
import { TabPage } from '@/screens/options/partials/tab-page';
import { type ListType, siteLists } from '@/screens/options/site-lists';

type Props = {
  type: ListType;
  urls: string[];
  onChange: (urls: string[]) => void;
  isActiveMode: boolean;
  /** Locks the list: the content scripts already decided what to block. */
  isRunning: boolean;
};

/** The blocklist or the allowlist: add an entry, see them all, remove one. */
export function SiteListTab({ type, urls, onChange, isActiveMode, isRunning }: Props) {
  const copy = siteLists[type];

  // Returns whether the entry was added, so the form knows to clear itself.
  const addSite = (url: string) => {
    if (!url) toast('Enter a website first.', true);
    else if (urls.includes(url)) toast(`This website is already in your ${type}.`, true);
    else {
      onChange([...urls, url]);
      return true;
    }
    return false;
  };

  return (
    <TabPage
      id={`${type}-page`}
      title={copy.title}
      description={copy.description}
      badge={isActiveMode && <ActiveModeBadge />}
    >
      <LockedNotice isRunning={isRunning}>
        A focus session is running. This list unlocks when it ends.
      </LockedNotice>
      <AddSiteForm type={type} copy={copy} disabled={isRunning} onAdd={addSite} />
      <SiteList
        urls={urls}
        label={copy.listLabel}
        isRunning={isRunning}
        onRemove={(url) => onChange(urls.filter((entry) => entry !== url))}
        empty={<EmptyList icon={copy.icon} title={copy.emptyTitle} text={copy.emptyText} />}
      />
    </TabPage>
  );
}
