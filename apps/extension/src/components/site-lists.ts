import { IconAllowlist, IconBlocklist } from '@focus-pocus/ui/icons';
import type { Messages } from '@/lib/i18n';

/** The two lists, which are also the two blocking modes. */
export type ListType = 'blocklist' | 'allowlist';

/** What sets the two list tabs' copy apart (packages/locales). */
export type SiteListCopy = Messages['options']['siteLists'][ListType];

/** Each list's icon: the popup's mode control, the options tabs and empty states. */
export const siteListIcons = { blocklist: IconBlocklist, allowlist: IconAllowlist };
