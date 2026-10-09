'use client';

import { Brand } from '@focus-pocus/ui/brand';
import { ProgressRing } from '@focus-pocus/ui/progress-ring';
import logo from '@/assets/logo.png';
import { OptionsMock } from '@/components/mocks/options-mock';
import { PopupMock } from '@/components/mocks/popup-mock';
import { useCopy } from '@/lib/i18n-provider';
import { Backdrop } from './backdrop';
import type { TileId } from './catalog';
import { MID_SESSION_SECONDS } from './slides';

/** The small promo tile, 440x280: the logo inside a running ring, the name and one line. */
function SmallTile() {
  const { site } = useCopy();

  return (
    <section className="relative isolate flex h-70 w-110 flex-col items-center justify-center overflow-hidden bg-canvas text-center">
      <Backdrop />
      <div className="relative grid size-28 place-items-center">
        <div className="absolute inset-0">
          <ProgressRing isRunning progress={0.62} />
        </div>
        {/* biome-ignore lint/performance/noImgElement: a fixed-size logo in a screenshot, next/image would add nothing */}
        <img alt="" className="size-14 rounded-overlay-logo" src={logo.src} />
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-brand">FocusPocus</p>
      <p className="mt-1 text-md text-text-muted">{site.store.tagline}</p>
    </section>
  );
}

/**
 * The marquee promo tile, 1400x560: the landing page's headline beside its
 * demo, the settings page with the popup in front of it, running off the edges.
 */
function MarqueeTile() {
  const { site } = useCopy();

  return (
    <section className="relative isolate flex h-140 w-350 items-center overflow-hidden bg-canvas px-24">
      <Backdrop />
      <div className="flex w-130 shrink-0 flex-col gap-6">
        <Brand logoSrc={logo.src} size="lg" />
        <h2 className="text-balance text-slide-title font-medium tracking-section">
          {site.hero.titleLead} <span className="text-text-muted">{site.hero.titleAccent}</span>
        </h2>
        <p className="text-balance text-slide-lead text-text-muted">{site.hero.lead}</p>
      </div>
      <div className="relative h-full flex-1">
        <div className="absolute top-20 left-50 w-215">
          <OptionsMock />
        </div>
        <div className="absolute top-12 left-36">
          <PopupMock runningFrom={MID_SESSION_SECONDS} />
        </div>
      </div>
    </section>
  );
}

const tiles = { small: SmallTile, marquee: MarqueeTile };

/** One promo tile at the size the store asks for (TILES in catalog.ts). */
export function Tile({ id }: { id: TileId }) {
  const Content = tiles[id];
  return <Content />;
}
