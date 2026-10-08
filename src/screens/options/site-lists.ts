import { IconAllowlist, IconBlocklist } from '@/components/ui/icons';
import type { Messages } from '@/lib/i18n';

export type ListType = 'blocklist' | 'allowlist';

/** What sets the two list tabs' copy apart (src/locales/). */
export type SiteListCopy = Messages['options']['siteLists'][ListType];

/** Each list's icon, shared by its tab and its empty state. */
export const siteListIcons = { blocklist: IconBlocklist, allowlist: IconAllowlist };
