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
    <>
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
    </>
  );
}
