'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { HoverArrow } from './hover-arrow';
import { StoreMark } from './store-mark';

/** Both store listings, Chrome first: most installs come from there. */
export function StoreButtons() {
  const { site } = useCopy();

  return (
    // Stacked and as wide as each other on a phone, side by side from `sm`.
    <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
      <ButtonLink className="group" href={links.chrome} pill size="lg" variant="primary">
        <StoreMark store="chrome" />
        {site.stores.chrome}
        <HoverArrow />
      </ButtonLink>
      <ButtonLink className="group" href={links.firefox} pill size="lg" variant="secondary">
        <StoreMark store="firefox" />
        {site.stores.firefox}
        <HoverArrow />
      </ButtonLink>
    </div>
  );
}
