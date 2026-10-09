import type { SiteCopy } from '@/locales/en';

// The store images and their sizes, apart from their drawings (client
// modules), so the server can list their pages and the export script their
// files. Sizes are in CSS pixels, exactly what the Chrome Web Store asks for.

/** A carousel slide's copy key in `site.store.slides`. */
export type SlideId = keyof SiteCopy['store']['slides'];

/** The carousel, in order; a slide's place, from 1, is its URL and its file's number. */
export const SLIDE_IDS = [
  'timer',
  'focusScreen',
  'lists',
  'streak',
  'yours',
] as const satisfies readonly SlideId[];

export const SLIDE_SIZE = { width: 1280, height: 800 };

/** The two promo tiles. */
export const TILES = {
  small: { width: 440, height: 280 },
  marquee: { width: 1400, height: 560 },
};

export type TileId = keyof typeof TILES;

export const TILE_IDS = Object.keys(TILES) as TileId[];

export function isTileId(value: string): value is TileId {
  return value in TILES;
}
