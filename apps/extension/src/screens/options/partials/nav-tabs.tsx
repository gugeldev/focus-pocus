import { cx } from '@focus-pocus/ui/cx';
import type { CSSProperties } from 'react';
import type { ListType } from '@/components/site-lists';
import { useMessages } from '@/lib/use-messages';
import { NavLabel, navItemClasses } from '@/screens/options/partials/nav-item';
import { getTabLabel, type Tab, type TabId, tabs } from '@/screens/options/tabs';

type Props = {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
  /** Entry counts shown next to the list tabs. */
  counts: Record<ListType, number>;
};

type NavTabProps = {
  tab: Tab;
  isActive: boolean;
  /** The entry count, for the list tabs. */
  count?: number;
  onSelect: () => void;
};

/** One tab of the sidebar: the active one gets the weight and an accent icon. */
function NavTab({ tab, isActive, count, onSelect }: NavTabProps) {
  const t = useMessages();
  const { id, icon: Icon } = tab;

  return (
    <li className="flex-1">
      <button
        type="button"
        // Only the open tab's page is rendered, so only it can be controlled.
        aria-controls={isActive ? `${id}-page` : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          navItemClasses,
          isActive
            ? 'bg-item-active font-semibold text-text wide:bg-transparent'
            : 'hover:bg-item-hover hover:text-text',
        )}
        onClick={onSelect}
      >
        <Icon
          size={18}
          aria-hidden="true"
          className={cx(
            'shrink-0 transition-colors duration-(--duration) ease-fluid',
            isActive && 'text-accent',
          )}
        />
        <NavLabel>{getTabLabel(id, t)}</NavLabel>
        {count !== undefined && (
          <span className="hidden text-xs font-medium text-text-faint tabular-nums wide:inline">
            {count}
          </span>
        )}
      </button>
    </li>
  );
}

/**
 * The settings sections. With the sidebar, one surface slides to the active
 * tab; its offset is computed from the tab index, never measured, so a resize
 * cannot strand it. As a top bar, the active tab fills itself instead.
 */
export function NavTabs({ activeTab, onSelect, counts }: Props) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <ul
      className="relative flex gap-1.5 wide:flex-col"
      style={{ '--active-tab': activeIndex } as CSSProperties}
    >
      <li
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-10 translate-y-[calc(var(--active-tab)*(--spacing(10)+--spacing(1.5)))] rounded-md bg-item-active transition-transform duration-(--duration-layout) ease-fluid wide:block"
      />
      {tabs.map((tab) => (
        <NavTab
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTab}
          count={tab.id === 'general' ? undefined : counts[tab.id]}
          onSelect={() => onSelect(tab.id)}
        />
      ))}
    </ul>
  );
}
