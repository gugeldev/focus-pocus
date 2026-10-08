import { type IconComponent, IconGeneral } from '@/components/ui/icons';
import type { Messages } from '@/lib/i18n';
import { type ListType, siteListIcons } from '@/screens/options/site-lists';

export type TabId = 'general' | ListType;

export type Tab = { id: TabId; icon: IconComponent };

/** General, then one tab per site list, drawn like its page. */
export const tabs: Tab[] = [
  { id: 'general', icon: IconGeneral },
  ...(['blocklist', 'allowlist'] as const).map((id) => ({ id, icon: siteListIcons[id] })),
];

/** A tab is named like its page. */
export function getTabLabel(id: TabId, t: Messages) {
  return id === 'general' ? t.options.general.title : t.options.siteLists[id].title;
}

/**
 * The open tab is mirrored in the location hash, so "#blocklist" opens the
 * blocklist directly.
 */
export function getTabFromHash(): TabId {
  return tabs.find((tab) => `#${tab.id}` === location.hash)?.id ?? 'general';
}
