'use client';

import { cx } from '@focus-pocus/ui/cx';
import { useCopy } from '@/lib/i18n-provider';
import { Backdrop } from './backdrop';
import type { SlideId } from './catalog';
import { type Layout, slides } from './slides';

/** The section, the copy and the drawing's box, for each layout. */
const layouts: Record<Layout, { section: string; copy: string; visual: string }> = {
  side: {
    section: 'items-center gap-12 px-24',
    copy: 'w-100',
    visual: 'items-center',
  },
  stacked: {
    section: 'flex-col items-center pt-18',
    copy: 'max-w-220 items-center text-center',
    visual: 'mt-14 items-start',
  },
};

/**
 * One carousel slide at the store's size (SLIDE_SIZE, 1280x800): the site's
 * backdrop, the slide's claim and its drawing of the extension.
 */
export function Slide({ id }: { id: SlideId }) {
  const { site } = useCopy();
  const copy = site.store.slides[id];
  const { layout, Visual } = slides[id];
  const classes = layouts[layout];

  return (
    <section
      className={cx(
        'relative isolate flex h-200 w-320 shrink-0 overflow-hidden bg-canvas',
        classes.section,
      )}
    >
      <Backdrop />
      <div className={cx('flex shrink-0 flex-col gap-5', classes.copy)}>
        <p className="text-md font-medium text-accent">{copy.eyebrow}</p>
        <h2 className="text-balance text-slide-title font-medium tracking-section">{copy.title}</h2>
        <p className="max-w-170 text-balance text-slide-lead text-text-muted">{copy.lead}</p>
      </div>
      <div className={cx('flex flex-1 justify-center', classes.visual)}>
        <Visual />
      </div>
    </section>
  );
}
