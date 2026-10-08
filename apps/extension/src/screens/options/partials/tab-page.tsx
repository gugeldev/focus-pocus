import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  id: string;
  title: string;
  description: ReactNode;
  /** Next to the title, like the "Active mode" badge. */
  badge?: ReactNode;
  children: ReactNode;
};

/** A settings tab's page: title, description and content in one centered column. */
export function TabPage({ id, title, description, badge, children }: Props) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="mx-auto flex w-full max-w-160 animate-page-in flex-col gap-7 px-5 py-8 wide:px-8 wide:py-12"
    >
      <header>
        <div className="flex items-center gap-3.5">
          <h1 id={titleId} className="text-2xl leading-title font-bold tracking-title">
            {title}
          </h1>
          {badge}
        </div>
        <p className={cx('text-md text-text-muted', badge ? 'mt-3' : 'mt-2')}>{description}</p>
      </header>
      {children}
    </section>
  );
}
