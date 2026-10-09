'use client';

import type { ReactNode } from 'react';
import { SLIDE_IDS, TILE_IDS } from '@/components/store/catalog';
import { Slide } from '@/components/store/slide';
import { Tile } from '@/components/store/tiles';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { storeSlideRoute, storeTileRoute } from '@/lib/routes';

/**
 * Every store image at full size, one under the other, to review them before
 * `bun run store:shots` exports each one's own page as a PNG: the carousel's
 * slides, then the promo tiles.
 */
export default function StorePage() {
  const { site } = useCopy();
  const locale = useLocale();

  return (
    // items-center-safe: on a window narrower than a slide, it starts at the left edge instead of past it.
    <main className="flex flex-col items-center-safe gap-12 overflow-x-auto bg-sunken px-4 py-12">
      <h1 className="text-2xl font-semibold">{site.store.title}</h1>
      {SLIDE_IDS.map((id, index) => (
        <StoreImage
          href={storeSlideRoute(locale, index + 1)}
          key={id}
          label={`${index + 1}. ${site.store.slides[id].title}`}
        >
          <Slide id={id} />
        </StoreImage>
      ))}
      {TILE_IDS.map((id) => (
        <StoreImage href={storeTileRoute(locale, id)} key={id} label={site.store.tiles[id]}>
          <Tile id={id} />
        </StoreImage>
      ))}
    </main>
  );
}

type StoreImageProps = {
  /** The image's own page, the one the export captures. */
  href: string;
  label: string;
  children: ReactNode;
};

/** One image in the review page, under a link to its own page. */
function StoreImage({ href, label, children }: StoreImageProps) {
  return (
    <div className="flex flex-col gap-3">
      <a className="text-sm font-medium text-text-muted hover:text-accent" href={href}>
        {label}
      </a>
      <div className="shadow-float ring-1 ring-hairline">{children}</div>
    </div>
  );
}
