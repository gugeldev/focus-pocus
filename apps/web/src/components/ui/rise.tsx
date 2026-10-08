import type { ReactNode } from 'react';

type Props = { children: ReactNode; className?: string; order?: number };

/**
 * Reveal's entrance for what is on screen at load: a CSS animation that starts
 * with the first paint, so the hero never waits on a script to appear. Each
 * step of `order` waits 90ms more. Nothing moves under reduced motion.
 */
export function Rise({ children, className = '', order = 0 }: Props) {
  return (
    <div
      className={`motion-safe:animate-rise ${className}`}
      style={{ animationDelay: `${Math.min(order, 6) * 90}ms` }}
    >
      {children}
    </div>
  );
}
