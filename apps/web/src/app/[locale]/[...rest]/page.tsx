import { notFound } from 'next/navigation';

/**
 * Any other path under a locale. A not-found file only catches `notFound()`,
 * not an unmatched URL, so this route makes the call and the locale's
 * not-found page renders, in its language and frame.
 */
export default function UnknownPage() {
  notFound();
}
