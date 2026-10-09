import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** The store screenshots are a tool for the maintainers, not a page for search engines. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StoreLayout({ children }: { children: ReactNode }) {
  return children;
}
