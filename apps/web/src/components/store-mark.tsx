import { type SimpleIcon, siFirefoxbrowser, siGooglechrome } from 'simple-icons';

/** The browsers' own marks, which Phosphor does not draw, from Simple Icons. */
const marks = { chrome: siGooglechrome, firefox: siFirefoxbrowser } satisfies Record<
  string,
  SimpleIcon
>;

export type Store = keyof typeof marks;

/** A browser's mark in the current text color, sized like an icon. */
export function StoreMark({ store, size = 18 }: { store: Store; size?: number }) {
  return (
    <svg aria-hidden="true" fill="currentColor" height={size} viewBox="0 0 24 24" width={size}>
      <path d={marks[store].path} />
    </svg>
  );
}
