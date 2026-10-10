import { Brand } from '@focus-pocus/ui/brand';
import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { ContentPane } from '@/components/content-pane';
import { TabPage } from '@/components/tab-page';
import { useMessages } from '@/lib/use-messages';
import { useStorage } from '@/lib/use-storage';
import { AllSet } from '@/screens/welcome/partials/all-set';
import { SitePicker } from '@/screens/welcome/partials/site-picker';
import { suggestedSites } from '@/screens/welcome/suggested-sites';

/**
 * The page the background opens once, when the extension is installed: a few
 * distracting sites to block in one click, then where to go next. Laid out like
 * the settings page below its `wide` breakpoint: the brand on the canvas over
 * a content pane that scrolls on its own.
 */
export default function WelcomeScreen() {
  const [state, update] = useStorage('blocklist');
  const [picked, setPicked] = useState(() => suggestedSites.map((site) => site.url));
  const [isDone, setIsDone] = useState(false);
  const t = useMessages();

  useEffect(() => {
    document.title = t.welcome.title;
  }, [t]);

  if (!state) return null;

  const blocklist = state.blocklist ?? [];

  function block() {
    const added = picked.filter((url) => !blocklist.includes(url));
    update({ blocklist: [...blocklist, ...added] });
    setIsDone(true);
  }

  return (
    <div className="grid h-screen grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-3 p-3">
      <Brand logoSrc="../assets/logo/icon-64.png" size="md" className="px-1 pt-3 pb-3" />
      <ContentPane>
        <TabPage id="welcome-page" title={t.welcome.title} description={t.welcome.lead}>
          {isDone ? (
            <AllSet
              blockedCount={blocklist.length}
              onOpenSettings={() => browser.runtime.openOptionsPage()}
            />
          ) : (
            <SitePicker
              picked={picked}
              onPickedChange={setPicked}
              onBlock={block}
              onSkip={() => setIsDone(true)}
            />
          )}
        </TabPage>
      </ContentPane>
    </div>
  );
}
