import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  /** What the address bar shows. */
  url: string;
  /** Names the drawing for screen readers: it is a picture of the extension, not the page. */
  label: string;
  className?: string;
  children: ReactNode;
};

/** A plain browser window around a drawing of an extension page: three dots and an address. */
export function BrowserFrame({ url, label, className, children }: Props) {
  return (
    <figure
      aria-label={label}
      className={cx(
        'overflow-hidden rounded-2xl border border-border bg-canvas shadow-popover',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-sunken px-3.5 py-1 text-xs text-text-faint">
          {url}
        </span>
      </div>
      {children}
    </figure>
  );
}
