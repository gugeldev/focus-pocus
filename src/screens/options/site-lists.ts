import { IconAllowlist, IconBlocklist, type IconComponent } from '@/components/ui/icons';

export type ListType = 'blocklist' | 'allowlist';

/** What sets the two list tabs apart: their copy and their icon. */
export type SiteListCopy = {
  title: string;
  description: string;
  icon: IconComponent;
  inputLabel: string;
  placeholder: string;
  addLabel: string;
  listLabel: string;
  emptyTitle: string;
  emptyText: string;
};

export const siteLists: Record<ListType, SiteListCopy> = {
  blocklist: {
    title: 'Blocklist',
    description:
      'While you focus, any page whose address contains one of these is covered by the focus screen.',
    icon: IconBlocklist,
    inputLabel: 'Website to block',
    placeholder: 'youtube.com',
    addLabel: 'Block',
    listLabel: 'Blocked websites',
    emptyTitle: 'Nothing blocked yet',
    emptyText: 'Add the sites that steal your attention, like social feeds or video platforms.',
  },
  allowlist: {
    title: 'Allowlist',
    description:
      'In allowlist mode, only pages whose address contains one of these stay reachable while you focus.',
    icon: IconAllowlist,
    inputLabel: 'Website to allow',
    placeholder: 'docs.google.com',
    addLabel: 'Allow',
    listLabel: 'Allowed websites',
    emptyTitle: 'Nothing allowed yet',
    emptyText: 'Add the tools you need to work, like your docs, editor or course platform.',
  },
};
