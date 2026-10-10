import type { ReactNode } from 'react';

/**
 * The settings page's and the welcome screen's content: one step up the surface
 * ladder from the canvas, scrolling on its own so what sits beside it stays put.
 */
export function ContentPane({ children }: { children: ReactNode }) {
  return (
    <main className="min-w-0 overflow-y-auto overscroll-contain rounded-xl scrollbar-thin bg-surface shadow-card">
      {children}
    </main>
  );
}
