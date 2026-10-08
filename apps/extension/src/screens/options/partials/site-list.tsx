import { type MouseEvent, type ReactNode, useRef, useState } from 'react';
import { SiteRow } from '@/screens/options/partials/site-row';

const STAGGER_MS = 30;

/** A removed row stays on screen, at its old place and height, until it has collapsed. */
type LeavingSite = { url: string; index: number; height: number };

/**
 * The rows to draw: the stored entries plus the removed ones still on their
 * way out, each back at the index it had.
 */
function useLeavingRows(urls: string[]) {
  const [leaving, setLeaving] = useState<LeavingSite[]>([]);

  const rows: { url: string; leavingHeight?: number }[] = urls.map((url) => ({ url }));
  for (const site of leaving) {
    if (!urls.includes(site.url)) {
      rows.splice(Math.min(site.index, rows.length), 0, {
        url: site.url,
        leavingHeight: site.height,
      });
    }
  }

  // One ghost per url: a site removed, re-added and removed again replaces its old ghost.
  const startLeaving = (site: LeavingSite) =>
    setLeaving((current) => [...current.filter(({ url }) => url !== site.url), site]);
  const finishLeaving = (url: string) =>
    setLeaving((current) => current.filter((site) => site.url !== url));

  return { rows, startLeaving, finishLeaving };
}

type Props = {
  urls: string[];
  label: string;
  isRunning: boolean;
  onRemove: (url: string) => void;
  /** Shown once the list is empty and every row has left. */
  empty: ReactNode;
};

/** The entries, animating in and collapsing out. */
export function SiteList({ urls, label, isRunning, onRemove, empty }: Props) {
  const { rows, startLeaving, finishLeaving } = useLeavingRows(urls);
  // The rows on screen when the tab opened come in one after another.
  const initialUrls = useRef(new Set(urls));

  const handleRemove = (url: string, event: MouseEvent<HTMLButtonElement>) => {
    const height = event.currentTarget.closest('li')?.offsetHeight ?? 0;
    const index = urls.indexOf(url);
    onRemove(url);
    startLeaving({ url, index, height });
  };

  if (rows.length === 0) return empty;

  return (
    <ul className="flex flex-col border-t border-border" aria-label={label}>
      {rows.map(({ url, leavingHeight }, index) => (
        <SiteRow
          key={url}
          url={url}
          enterDelay={initialUrls.current.has(url) ? index * STAGGER_MS : 0}
          isRunning={isRunning}
          leavingHeight={leavingHeight}
          onRemove={(event) => handleRemove(url, event)}
          onLeft={() => finishLeaving(url)}
        />
      ))}
    </ul>
  );
}
