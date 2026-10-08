'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { StoreMark } from './store-mark';

/** Both store listings, Chrome first: most installs come from there. */
export function StoreButtons() {
  const { site } = useCopy();

  return (
    <>
      <ButtonLink href={links.chrome} pill size="lg" variant="primary">
        <StoreMark store="chrome" />
        {site.stores.chrome}
      </ButtonLink>
      <ButtonLink href={links.firefox} pill size="lg" variant="secondary">
        <StoreMark store="firefox" />
        {site.stores.firefox}
      </ButtonLink>
    </>
  );
}
