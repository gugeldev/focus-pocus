import { useEffect, useState } from 'react';
import { useStorage } from '@/lib/use-storage';
import { GeneralTab } from '@/screens/options/partials/general-tab';
import { Sidebar } from '@/screens/options/partials/sidebar';
import { SiteListTab } from '@/screens/options/partials/site-list-tab';
import { getTabFromHash } from '@/screens/options/tabs';

/**
 * The settings page: a sidebar on the canvas next to a content pane one step
 * up the surface ladder. Only the open tab is rendered, so its entrance plays
 * on every switch.
 */
export default function OptionsScreen() {
  const [state, update] = useStorage('blocklist', 'allowlist', 'options', 'isRunning', 'streak');
  const [activeTab, setActiveTab] = useState(getTabFromHash);

  useEffect(() => {
    history.replaceState(null, '', `#${activeTab}`);
  }, [activeTab]);

  if (!state) return null;

  const { options = {}, isRunning, streak } = state;
  const isAllowlistMode = Boolean(options['allowlist-mode']);

  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] gap-3 p-3 wide:grid-cols-[248px_minmax(0,1fr)]">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          blocklist: state.blocklist?.length ?? 0,
          allowlist: state.allowlist?.length ?? 0,
        }}
        streak={streak}
      />

      <main className="min-w-0 rounded-xl bg-surface shadow-card">
        {activeTab === 'general' && (
          <GeneralTab
            options={options}
            isRunning={isRunning}
            onChange={(next) => update({ options: next })}
          />
        )}
        {activeTab !== 'general' && (
          <SiteListTab
            // A fresh list per tab, so the rows' entrance plays again.
            key={activeTab}
            type={activeTab}
            urls={state[activeTab] ?? []}
            onChange={(urls) => update({ [activeTab]: urls })}
            isActiveMode={(activeTab === 'allowlist') === isAllowlistMode}
            isRunning={isRunning}
          />
        )}
      </main>
    </div>
  );
}
