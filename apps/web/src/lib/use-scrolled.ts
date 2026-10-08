'use client';

import { useEffect, useState } from 'react';

/** Whether the page has scrolled past `offset` pixels. */
export function useScrolled(offset: number): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });

    return () => window.removeEventListener('scroll', update);
  }, [offset]);

  return scrolled;
}
