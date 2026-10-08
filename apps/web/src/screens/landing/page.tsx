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
 * The page's background: a dot grid over the whole page (`mask-page-dots`), the violet
 * glow it opens under, and softer glows further down, at the features and the
 * install, so the page never goes flat black for long.
 */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-dots mask-page-dots" />
      <div className="absolute -top-90 left-1/2 h-215 w-325 -translate-x-1/2 rounded-full bg-radial-[closest-side] from-glow to-transparent" />
      <div className="absolute top-[38%] -left-60 size-180 rounded-full bg-radial-[closest-side] from-glow/60 to-transparent" />
      <div className="absolute top-[62%] -right-60 size-180 rounded-full bg-radial-[closest-side] from-glow/60 to-transparent" />
    </div>
  );
}

/**
 * The landing page. A client tree on purpose: every part reads its copy
 * through `useCopy()`, and the drawings of the extension run. It still renders
 * on the server, once per locale (the layout's `generateStaticParams`).
 */
export default function LandingPage() {
  return (
    <div className="relative isolate overflow-clip">
      <Backdrop />
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
