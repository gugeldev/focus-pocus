'use client';

import { cx } from '@focus-pocus/ui/cx';
import { IconExternal } from '@focus-pocus/ui/icons';
import { useMemo } from 'react';
import { IconStar } from '@/components/icons';
import { Reveal } from '@/components/motion';
import type { Locale } from '@/lib/i18n';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors } from '@/lib/routes';
import { type Review, reviewStars, reviews } from '../reviews';
import { Container } from './section';
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
  const locale = useLocale();
  // One formatter for every card: there are dozens of them.
  const formatDate = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    return (date: string) => format.format(new Date(date));
  }, [locale]);

  return (
    <section className="py-16 md:py-24" id={anchors.reviews}>
      <Container>
        <SectionHeading
          eyebrow={site.reviews.eyebrow}
          intro={site.reviews.intro}
          title={site.reviews.title}
        />
      </Container>
      <Reveal className="mb-10 flex justify-center px-4" order={1}>
        <p className="inline-flex items-center gap-2.5 rounded-full bg-surface py-2 pr-4 pl-3 text-sm text-text-muted">
          <Stars />
          {site.reviews.rating}
        </p>
      </Reveal>
      <Reveal
        className="mx-auto flex max-w-6xl flex-col gap-3 mask-x-from-88% mask-x-to-100%"
        order={2}
      >
        {rows.map((row, index) => (
          <ReviewRow
            formatDate={formatDate}
            key={row[0]?.name}
            locale={locale}
            reverse={index === 1}
            row={row}
          />
        ))}
      </Reveal>
      <Container className="flex justify-center pt-10 md:pt-12">
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
      </Container>
    </section>
  );
}

/**
 * Each half of a row repeats its reviews this many times, so a half is wider
 * than any screen and the loop never shows an end.
 */
const REPEATS_PER_HALF = 2;

/**
 * One row: two identical halves, each its reviews repeated, sliding by one
 * half per turn. Only the first pass is read out; the repeats are hidden.
 */
type RowProps = { row: Review[]; reverse: boolean; locale: Locale; formatDate: DateFormatter };

type DateFormatter = (date: string) => string;

function ReviewRow({ row, reverse, locale, formatDate }: RowProps) {
  const passes = Array.from({ length: REPEATS_PER_HALF * 2 }, (_, pass) => pass);

  return (
    <div className="overflow-x-auto py-2 [scrollbar-width:none] motion-safe:overflow-hidden [&::-webkit-scrollbar]:hidden">
      <ul
        className={cx(
          'flex w-max hover:[animation-play-state:paused]',
          reverse ? 'motion-safe:animate-marquee-reverse' : 'motion-safe:animate-marquee',
        )}
      >
        {passes.map((pass) =>
          row.map((review) => (
            <li aria-hidden={pass > 0 || undefined} className="pr-3" key={`${pass}-${review.name}`}>
              <ReviewCard
                date={formatDate(review.date)}
                review={review}
                text={review.text[locale]}
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

/** The five stars every review gave, named once for screen readers. */
function Stars() {
  const { site } = useCopy();

  return (
    <span
      className="flex gap-0.5 text-star"
      role="img"
      aria-label={site.reviews.stars(reviewStars)}
    >
      {Array.from({ length: reviewStars }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical stars, never reordered
        <IconStar aria-hidden="true" key={index} size={14} weight="fill" />
      ))}
    </span>
  );
}

/** A review in the page's language, opened by a violet quote mark, under its stars, name and date. */
type CardProps = {
  review: Review;
  /** The review in the page's language. */
  text: string;
  /** The review's date, formatted for the page's language. */
  date: string;
};

function ReviewCard({ review, text, date }: CardProps) {
  return (
    <figure className="flex h-full w-80 flex-col gap-4 rounded-panel bg-surface p-7 ring-1 ring-hairline">
      <div className="flex items-center justify-between">
        <span
          aria-hidden="true"
          className="h-6 text-quote-mark leading-none font-medium text-accent"
        >
          “
        </span>
        <Stars />
      </div>
      <blockquote className="flex-1 text-pretty text-md text-text">{text}</blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-raised text-base font-medium uppercase"
        >
          {review.name.charAt(0)}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{review.name}</span>
          <time className="text-xs text-text-faint" dateTime={review.date}>
            {date}
          </time>
        </span>
      </figcaption>
    </figure>
  );
}
