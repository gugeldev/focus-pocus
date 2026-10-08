'use client';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { anchors } from '@/lib/routes';
import { Features } from './partials/features';
import { FocusScreenShowcase } from './partials/focus-screen-showcase';
import { Hero } from './partials/hero';
import { Install } from './partials/install';
import { Spell } from './partials/spell';
import { Testimonials } from './partials/testimonials';

/**
 * The page's background: a dot grid that fades out around the hero and the foot, the violet
 * glow it opens under, and softer glows further down, at the features and the
 * install, so the page never goes flat black for long.
 */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-x-0 top-0 h-240 bg-dots mask-radial-[60%_55%] mask-radial-at-top mask-radial-from-20%" />
      <Spell />
      {/* The column's guide lines, solid at its edges and dashed at its thirds. */}
      <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 border-x border-guide md:block">
        <div className="absolute inset-y-0 left-1/3 hidden border-l border-dashed border-guide xl:block" />
        <div className="absolute inset-y-0 left-2/3 hidden border-l border-dashed border-guide xl:block" />
      </div>
      <div className="absolute top-[38%] -left-60 size-180 rounded-full bg-radial-[closest-side] from-accent-solid/17 to-transparent" />
      <div className="absolute top-[62%] -right-60 size-180 rounded-full bg-radial-[closest-side] from-accent-solid/17 to-transparent" />
      <div className="absolute bottom-0 left-1/2 h-160 w-300 -translate-x-1/2 bg-dots mask-radial-[50%_50%] mask-radial-at-bottom mask-radial-from-10%" />
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
