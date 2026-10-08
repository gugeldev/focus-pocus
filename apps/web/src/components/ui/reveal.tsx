'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Its place among siblings revealed together; each step waits 90ms more, up to six. */
  order?: number;
};

/**
 * Hidden only once the layout's inline script has marked the page as running
 * scripts (`.js` on `<html>`), so a page read without them still shows
 * everything.
 */
const hidden =
  'motion-safe:in-[.js]:translate-y-8 motion-safe:in-[.js]:opacity-0 motion-safe:in-[.js]:blur-sm';

/**
 * Rises into place the first time it scrolls into view. Under reduced motion
 * it is simply there. What is on screen at load uses `Rise` instead.
 */
export function Reveal({ children, className = '', order = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`motion-safe:transition-[opacity,translate,filter] motion-safe:duration-900 motion-safe:ease-[cubic-bezier(.2,.7,.2,1)] ${shown ? '' : hidden} ${className}`}
      ref={ref}
      style={{ transitionDelay: `${Math.min(order, 6) * 90}ms` }}
    >
      {children}
    </div>
  );
}
