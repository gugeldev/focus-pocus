import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  id?: string;
  children: ReactNode;
  /** How it lays out its children; the frame (and a Section's padding) stays. */
  className?: string;
  /** A hairline across the page above it, between it and the band before. Off for the first. */
  divided?: boolean;
};

/** The page's column: centered, one gutter, no vertical space of its own. */
export function Container({ children, className }: Omit<Props, 'id'>) {
  return <div className={cx('mx-auto max-w-6xl px-4 sm:px-6', className)}>{children}</div>;
}

/** A band of the page: the column with room above and below, and an anchor the header links to. */
export function Section({ id, children, className, divided = true }: Props) {
  return (
    <section className={cx('py-16 md:py-24', divided && 'border-t border-guide')} id={id}>
      <Container className={className}>{children}</Container>
    </section>
  );
}
