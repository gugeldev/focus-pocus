import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

/** A titled group of setting rows, divided from the one before it by a hairline. */
export function SettingsSection({ title, children }: Props) {
  const titleId = `${title.toLowerCase()}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3 not-first-of-type:border-t not-first-of-type:border-border not-first-of-type:pt-7"
    >
      <h2 id={titleId} className="text-xs font-semibold tracking-label text-text-faint uppercase">
        {title}
      </h2>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}
