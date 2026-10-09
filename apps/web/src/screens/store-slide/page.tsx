import { notFound } from 'next/navigation';
import { SLIDE_IDS } from '@/components/store/catalog';
import { Slide } from '@/components/store/slide';

export function generateStaticParams() {
  return SLIDE_IDS.map((_, index) => ({ slide: String(index + 1) }));
}

/** One carousel slide alone, at the top left: what `bun run store:shots` captures. */
export default async function StoreSlidePage({ params }: PageProps<'/[locale]/store/[slide]'>) {
  const { slide } = await params;
  const id = SLIDE_IDS[Number(slide) - 1];
  if (!id) notFound();

  return <Slide id={id} />;
}
