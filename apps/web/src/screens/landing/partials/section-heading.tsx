type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
};

/** What a section is about: a small violet label, the claim, and a line under it. */
export function SectionHeading({ eyebrow, title, intro }: Props) {
  return (
    <header className="mb-10 flex max-w-2xl flex-col gap-3 md:mb-12">
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="text-balance text-section font-bold tracking-title">{title}</h2>
      {intro ? <p className="text-pretty text-lead text-text-muted">{intro}</p> : null}
    </header>
  );
}
