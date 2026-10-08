import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  id?: string;
  children: ReactNode;
  /** How the section lays out its children; the frame and padding stay. */
  className?: string;
};

/** A band of the page: centered, one gutter, and an anchor the header links to. */
export function Section({ id, children, className }: Props) {
  return (
    <section className={cx('mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24', className)} id={id}>
      {children}
    </section>
  );
}
