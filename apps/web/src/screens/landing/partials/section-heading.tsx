import { Reveal } from '@/components/ui/reveal';

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Off when the heading sits beside its content rather than above it. */
  spaced?: boolean;
};

/** What a section is about: a small violet label, the claim, and a line under it. */
export function SectionHeading({ eyebrow, title, intro, spaced = true }: Props) {
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${spaced ? 'mb-12 md:mb-14' : ''}`}>
      <p className="text-sm font-medium text-accent">{eyebrow}</p>
      <h2 className="text-balance text-section font-medium tracking-section">{title}</h2>
      {intro ? <p className="text-pretty text-lead text-text-muted">{intro}</p> : null}
    </Reveal>
  );
}
