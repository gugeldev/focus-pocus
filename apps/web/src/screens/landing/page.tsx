'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { anchors } from '@/lib/routes';
import { Features } from './partials/features';
import { Hero } from './partials/hero';
import { Install } from './partials/install';
import { FocusScreenShowcase, SettingsShowcase } from './partials/showcase';

/**
 * The landing page. A client tree on purpose: every part reads its copy
 * through `useCopy()`, and the drawings of the extension run. It still renders
 * on the server, once per locale (the layout's `generateStaticParams`).
 */
export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id={anchors.top}>
        <Hero />
        <SettingsShowcase />
        <FocusScreenShowcase />
        <Features />
        <Install />
      </main>
      <SiteFooter />
    </>
  );
}
