import { cx } from '@focus-pocus/ui/cx';
import { IconButton } from '@focus-pocus/ui/icon-button';
import { IconRemove } from '@focus-pocus/ui/icons';
import type { MouseEvent } from 'react';
import { useMessages } from '@/lib/use-messages';
import { SiteIcon } from '@/screens/options/partials/site-icon';

type Props = {
  url: string;
  /** Staggers the rows that are there when the tab opens. */
  enterDelay: number;
  isRunning: boolean;
  /** Set once removed: the row collapses from this height, then calls onLeft. */
  leavingHeight?: number;
  onRemove: (event: MouseEvent<HTMLButtonElement>) => void;
  onLeft: () => void;
};

/** One entry: its icon, the text as typed, and a remove button shown on hover or focus. */
export function SiteRow({ url, enterDelay, isRunning, leavingHeight, onRemove, onLeft }: Props) {
  const t = useMessages();
  const isLeaving = leavingHeight !== undefined;

  return (
    <li
      className={cx(
        'group flex min-h-14 items-center gap-3 border-b border-border py-2',
        isLeaving ? 'pointer-events-none animate-site-out' : 'animate-site-in',
      )}
      style={{
        animationDelay: !isLeaving && enterDelay ? `${enterDelay}ms` : undefined,
        height: leavingHeight,
      }}
      onAnimationEnd={(event) => {
        if (isLeaving && event.target === event.currentTarget) onLeft();
      }}
    >
      <SiteIcon url={url} />
      <span className="min-w-0 flex-1 truncate text-md font-medium" title={url}>
        {url}
      </span>
      <IconButton
        icon={IconRemove}
        tone="danger"
        aria-label={t.options.siteList.remove(url)}
        className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
        disabled={isRunning}
        onClick={onRemove}
      />
    </li>
  );
}
