import { type IconComponent, IconGeneral } from '@/components/ui/icons';
import { type ListType, siteLists } from '@/screens/options/site-lists';

export type TabId = 'general' | ListType;

export type Tab = { id: TabId; label: string; icon: IconComponent };

/** General, then one tab per site list, named and drawn like its page. */
export const tabs: Tab[] = [
  { id: 'general', label: 'General', icon: IconGeneral },
  ...(['blocklist', 'allowlist'] as const).map((id) => ({
    id,
    label: siteLists[id].title,
    icon: siteLists[id].icon,
  })),
];

/**
 * The open tab is mirrored in the location hash, so "#blocklist" opens the
 * blocklist directly.
 */
export function getTabFromHash(): TabId {
  return tabs.find((tab) => `#${tab.id}` === location.hash)?.id ?? 'general';
}
