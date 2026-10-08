'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { anchors } from '@/lib/routes';
import { Features } from './partials/features';
import { FocusScreenShowcase } from './partials/focus-screen-showcase';
import { Hero } from './partials/hero';
import { Install } from './partials/install';
import { Testimonials } from './partials/testimonials';

/**
 * The landing page. A client tree on purpose: every part reads its copy
 * through `useCopy()`, and the drawings of the extension run. It still renders
 * on the server, once per locale (the layout's `generateStaticParams`).
 */
export default function LandingPage() {
  return (
    <div className="relative isolate overflow-clip">
      {/* The violet glow the page opens under, behind the header and the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-90 left-1/2 -z-10 h-215 w-325 -translate-x-1/2 rounded-full bg-radial-[closest-side] from-glow to-transparent"
      />
      <SiteHeader />
      <main id={anchors.top}>
        <Hero />
        <FocusScreenShowcase />
        <Features />
        <Testimonials />
        <Install />
      </main>
      <SiteFooter />
    </div>
  );
}
