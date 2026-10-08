import { Brand } from '@focus-pocus/ui/brand';
import type { ListType } from '@/components/site-lists';
import { useMessages } from '@/lib/use-messages';
import { NavTabs } from '@/screens/options/partials/nav-tabs';
import { SidebarFooter } from '@/screens/options/partials/sidebar-footer';
import type { TabId } from '@/screens/options/tabs';

type Props = {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  counts: Record<ListType, number>;
  streak: number;
};

/**
 * Quiet on purpose: text and icons only. Below the `wide` breakpoint it
 * becomes a top bar with just the brand and the tabs.
 */
export function Sidebar({ activeTab, onSelectTab, counts, streak }: Props) {
  const t = useMessages();

  return (
    <nav
      aria-label={t.options.sections}
      className="flex flex-col p-1 wide:px-3 wide:pt-2 wide:pb-3"
    >
      <Brand logoSrc="../assets/logo/icon-64.png" size="md" className="pt-2 pb-3 wide:pb-7" />
      <NavTabs activeTab={activeTab} onSelect={onSelectTab} counts={counts} />
      <SidebarFooter streak={streak} />
    </nav>
  );
}
