import { notFound } from 'next/navigation';
import { isTileId, TILE_IDS } from '@/components/store/catalog';
import { Tile } from '@/components/store/tiles';

export function generateStaticParams() {
  return TILE_IDS.map((tile) => ({ tile }));
}

/** One promo tile alone, at the top left: what `bun run store:shots` captures. */
export default async function StoreTilePage({ params }: PageProps<'/[locale]/store/tile/[tile]'>) {
  const { tile } = await params;
  if (!isTileId(tile)) notFound();

  return <Tile id={tile} />;
}
