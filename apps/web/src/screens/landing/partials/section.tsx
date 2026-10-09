import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  id?: string;
  children: ReactNode;
  /** How it lays out its children; the frame (and a Section's padding) stays. */
  className?: string;
};

/**
 * The page's column: centered, one gutter, no vertical space of its own. The
 * gutter is `--gutter`, so what has to reach the column's edges (the features
 * grid) can step out by exactly that much.
 */
export function Container({ children, className }: Omit<Props, 'id'>) {
  return (
    <div
      className={cx(
        'mx-auto max-w-6xl px-(--gutter) [--gutter:--spacing(4)] sm:[--gutter:--spacing(6)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A band of the page: the column with room above and below, and an anchor the header links to. */
export function Section({ id, children, className }: Props) {
  return (
    <section className="py-16 md:py-24" id={id}>
      <Container className={className}>{children}</Container>
    </section>
  );
}
