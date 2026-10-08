'use client';

import { cx } from '@focus-pocus/ui/cx';
import { IconExternal } from '@/components/icons';
import { Reveal } from '@/components/ui/reveal';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors } from '@/lib/routes';
import { type Review, reviews } from '../reviews';
import { Section } from './section';
import { SectionHeading } from './section-heading';

/** Two rows, alternating reviews, so neighbours in the list never sit side by side. */
const rows = [
  reviews.filter((_, index) => index % 2 === 0),
  reviews.filter((_, index) => index % 2),
];

/**
 * The reviews, sliding by in two rows that run opposite ways and stop under
 * the pointer. The edges fade into the page. Under reduced motion the rows
 * hold still and scroll sideways instead.
 */
export function Testimonials() {
  const { site } = useCopy();

  return (
    <div className="py-16 md:py-24" id={anchors.reviews}>
      <Section className="py-0 md:py-0">
        <SectionHeading
          eyebrow={site.reviews.eyebrow}
          intro={[site.reviews.intro, site.reviews.original].filter(Boolean).join(' ')}
          title={site.reviews.title}
        />
      </Section>
      <Reveal className="flex flex-col gap-4 mask-x-from-85% mask-x-to-100%" order={1}>
        {rows.map((row, index) => (
          <ReviewRow key={row[0]?.name} reverse={index === 1} row={row} />
        ))}
      </Reveal>
      <Section className="flex justify-center py-0 pt-10 md:py-0 md:pt-12">
        <a
          className="focus-ring group inline-flex items-center gap-2 rounded-sm text-base text-text-muted transition-colors duration-(--duration) ease-fluid hover:text-text"
          href={links.chromeReviews}
        >
          {site.reviews.all}
          <IconExternal
            aria-hidden="true"
            className="text-text-faint transition-[color,translate] duration-(--duration) ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text"
            size={14}
          />
        </a>
      </Section>
    </div>
  );
}

/** One row, its cards twice over so the slide loops without a seam; the copy is hidden from readers. */
function ReviewRow({ row, reverse }: { row: Review[]; reverse: boolean }) {
  return (
    <div className="overflow-x-auto [scrollbar-width:none] motion-safe:overflow-hidden [&::-webkit-scrollbar]:hidden">
      <ul
        className={cx(
          'flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {[false, true].map((isCopy) =>
          row.map((review) => (
            <li aria-hidden={isCopy || undefined} className="pr-4" key={`${isCopy}-${review.name}`}>
              <ReviewCard review={review} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

/** A review as written, under the reviewer's initial, name and date. */
function ReviewCard({ review }: { review: Review }) {
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(review.date),
  );

  return (
    <figure className="flex h-full w-80 flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-surface p-6 transition-colors duration-(--duration-layout) ease-fluid hover:border-border-strong">
      <blockquote className="text-pretty text-md text-text" lang="pt-BR">
        “{review.text}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-wash text-sm font-medium text-accent uppercase inset-ring inset-ring-accent-dim"
        >
          {review.name.charAt(0)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-base font-medium">{review.name}</span>
          <time className="text-xs text-text-faint" dateTime={review.date}>
            {date}
          </time>
        </span>
      </figcaption>
    </figure>
  );
}
