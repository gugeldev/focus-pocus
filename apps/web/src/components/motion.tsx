'use client';

import { cx } from '@focus-pocus/ui/cx';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Its place among siblings that enter together; each step waits 90ms more, up to six. */
  order?: number;
};

/** How long an entrance waits for its place among its siblings. */
const staggerDelay = (order: number) => `${Math.min(order, 6) * 90}ms`;

/**
 * The entrance for what is on screen at load: a CSS animation that starts with
 * the first paint, so the hero never waits on a script to appear. Nothing
 * moves under reduced motion.
 */
export function Rise({ children, className, order = 0 }: Props) {
  const style: CSSProperties = { animationDelay: staggerDelay(order) };

  return (
    <div className={cx('motion-safe:animate-rise', className)} style={style}>
      {children}
    </div>
  );
}

/**
 * Hidden only once the layout's inline script has marked the page as running
 * scripts (`.js` on `<html>`), so a page read without them still shows
 * everything.
 */
const hidden =
  'motion-safe:in-[.js]:translate-y-8 motion-safe:in-[.js]:opacity-0 motion-safe:in-[.js]:blur-sm';

/**
 * Rise's entrance for the rest of the page: it plays the first time the
 * element scrolls into view. Under reduced motion it is simply there.
 */
export function Reveal({ children, className, order = 0 }: Props) {
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
      className={cx(
        'motion-safe:transition-[opacity,translate,filter] motion-safe:duration-(--duration-rise) motion-safe:ease-rise',
        !shown && hidden,
        className,
      )}
      ref={ref}
      style={{ transitionDelay: staggerDelay(order) }}
    >
      {children}
    </div>
  );
}
