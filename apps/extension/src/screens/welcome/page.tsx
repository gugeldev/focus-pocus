import { Brand } from '@focus-pocus/ui/brand';
import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { useMessages } from '@/lib/use-messages';
import { useStorage } from '@/lib/use-storage';
import { AllSet } from '@/screens/welcome/partials/all-set';
import { SitePicker } from '@/screens/welcome/partials/site-picker';
import { suggestedSites } from '@/screens/welcome/suggested-sites';

/**
 * The page the background opens once, when the extension is installed: a few
 * distracting sites to block in one click, then where to go next.
 */
export default function WelcomeScreen() {
  const [state, update] = useStorage('blocklist');
  const [picked, setPicked] = useState(() => suggestedSites.map((site) => site.url));
  const [isDone, setIsDone] = useState(false);
  const t = useMessages();

  useEffect(() => {
    document.title = t.welcome.pageTitle;
  }, [t]);

  if (!state) return null;

  const blocklist = state.blocklist ?? [];

  function block() {
    const added = picked.filter((url) => !blocklist.includes(url));
    update({ blocklist: [...blocklist, ...added] });
    setIsDone(true);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-160 flex-col gap-7 px-5 py-10 wide:py-16">
      <Brand logoSrc="../assets/logo/icon-64.png" size="md" />
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl leading-title font-bold tracking-title">{t.welcome.title}</h1>
        <p className="text-md text-text-muted">{t.welcome.lead}</p>
      </header>
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
    </div>
  );
}
