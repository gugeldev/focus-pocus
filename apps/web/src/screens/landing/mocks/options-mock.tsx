'use client';

import { cx } from '@focus-pocus/ui/cx';
import {
  IconAllowlist,
  IconBlocklist,
  type IconComponent,
  IconExternal,
  IconGeneral,
  IconStreak,
  IconSupport,
} from '@focus-pocus/ui/icons';
import { type CSSProperties, useState } from 'react';
import { Brand } from '@/components/brand';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { BrowserFrame } from './browser-frame';
import { GeneralPane, ListPane, type ListType, type Switches } from './options-panes';

// A working drawing of the settings page (apps/extension/src/screens/options/),
// built from the same kit and the same classes, and run by local state instead
// of the extension's storage. Change the settings page, change this.

type TabId = 'general' | ListType;

const tabs: { id: TabId; icon: IconComponent }[] = [
  { id: 'general', icon: IconGeneral },
  { id: 'blocklist', icon: IconBlocklist },
  { id: 'allowlist', icon: IconAllowlist },
];

const initialLists: Record<ListType, string[]> = {
  blocklist: ['youtube.com', 'instagram.com', 'x.com', 'reddit.com', 'netflix.com'],
  allowlist: ['docs.google.com', 'github.com', 'notion.so'],
};

/** nav-item.tsx's row, shared by the tabs and the sidebar's foot. */
const navItemClasses =
  'focus-ring relative flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-base font-medium text-text-muted transition-colors duration-(--duration) ease-fluid';

/** The settings page, working: switch tabs, flip the switches, add and remove sites. */
export function OptionsMock() {
  const { app, site } = useCopy();
  const [activeTab, setActiveTab] = useState<TabId>('blocklist');
  const [lists, setLists] = useState(initialLists);
  const [switches, setSwitches] = useState<Switches>({ 'victorious-notification': true });

  return (
    <BrowserFrame label={site.mocks.settings} url="chrome-extension://focuspocus/options">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 p-3 wide:h-160 wide:grid-cols-[248px_minmax(0,1fr)]">
        <nav
          aria-label={app.options.sections}
          className="flex flex-col p-1 wide:px-3 wide:pt-2 wide:pb-3"
        >
          <Brand className="pt-2 pb-3 wide:pb-7" size="md" />
          <NavTabs
            activeTab={activeTab}
            counts={{ blocklist: lists.blocklist.length, allowlist: lists.allowlist.length }}
            onSelect={setActiveTab}
          />
          <SidebarFooter />
        </nav>
        <div className="min-w-0 overflow-y-auto rounded-xl bg-surface shadow-card">
          {activeTab === 'general' ? (
            <GeneralPane onChange={setSwitches} switches={switches} />
          ) : (
            <ListPane
              isActiveMode={(activeTab === 'allowlist') === Boolean(switches['allowlist-mode'])}
              key={activeTab}
              onChange={(urls) => setLists({ ...lists, [activeTab]: urls })}
              type={activeTab}
              urls={lists[activeTab]}
            />
          )}
        </div>
      </div>
    </BrowserFrame>
  );
}

type NavTabsProps = {
  activeTab: TabId;
  counts: Record<ListType, number>;
  onSelect: (tab: TabId) => void;
};

/** The tabs, with the one surface that slides to the active one (nav-tabs.tsx). */
function NavTabs({ activeTab, counts, onSelect }: NavTabsProps) {
  const { app } = useCopy();
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const labels: Record<TabId, string> = {
    general: app.options.general.title,
    blocklist: app.options.siteLists.blocklist.title,
    allowlist: app.options.siteLists.allowlist.title,
  };

  return (
    <ul
      className="relative flex gap-1.5 wide:flex-col"
      style={{ '--active-tab': activeIndex } as CSSProperties}
    >
      <li
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-10 translate-y-[calc(var(--active-tab)*(--spacing(10)+--spacing(1.5)))] rounded-md bg-item-active transition-transform duration-(--duration-layout) ease-fluid wide:block"
      />
      {tabs.map(({ id, icon: Icon }) => {
        const isActive = id === activeTab;

        return (
          // min-w-0 lets a label truncate when the tabs share a phone-wide top bar.
          <li className="min-w-0 flex-1" key={id}>
            <button
              aria-current={isActive ? 'page' : undefined}
              className={cx(
                navItemClasses,
                isActive
                  ? 'bg-item-active font-semibold text-text wide:bg-transparent'
                  : 'hover:bg-item-hover hover:text-text',
              )}
              onClick={() => onSelect(id)}
              type="button"
            >
              <Icon
                aria-hidden="true"
                className={cx(
                  'shrink-0 transition-colors duration-(--duration) ease-fluid',
                  isActive && 'text-accent',
                )}
                size={18}
              />
              <span className="min-w-0 flex-1 truncate">{labels[id]}</span>
              {id !== 'general' && (
                <span className="hidden text-xs font-medium text-text-faint tabular-nums wide:inline">
                  {counts[id]}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** The streak and the support link at the sidebar's foot (sidebar-footer.tsx). */
function SidebarFooter() {
  const { app } = useCopy();

  return (
    <div className="mt-auto hidden flex-col gap-1.5 border-t border-border pt-4 wide:flex">
      <span className={navItemClasses}>
        <IconStreak aria-hidden="true" className="shrink-0" size={18} />
        <span className="min-w-0 flex-1 truncate">
          <span className="tabular-nums">12</span> {app.options.inARow}
        </span>
      </span>
      <a
        className={cx(navItemClasses, 'group hover:bg-item-hover hover:text-text')}
        href={links.support}
        rel="noreferrer"
        target="_blank"
      >
        <IconSupport aria-hidden="true" className="shrink-0" size={18} />
        <span className="min-w-0 flex-1 truncate">{app.options.support}</span>
        <IconExternal
          aria-hidden="true"
          className="shrink-0 text-text-faint opacity-0 transition-opacity duration-(--duration) ease-fluid group-hover:opacity-100 group-focus-visible:opacity-100"
          size={14}
        />
      </a>
    </div>
  );
}
