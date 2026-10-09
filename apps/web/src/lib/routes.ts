import type { TileId } from '@/components/store/catalog';
import type { Locale } from './i18n';

/** The landing page's sections, which the header links to, in page order. */
export const anchors = {
  top: 'top',
  focusScreen: 'focus-screen',
  features: 'features',
  reviews: 'reviews',
  install: 'install',
} as const;

export type Anchor = (typeof anchors)[keyof typeof anchors];

/** A locale's landing page, at one of its sections. */
export const homeRoute = (locale: Locale, anchor?: Anchor) =>
  anchor ? `/${locale}#${anchor}` : `/${locale}`;

/** The store images: all of them, a carousel slide by its place (from 1), or a promo tile. */
export const storeRoute = (locale: Locale) => `/${locale}/store`;
export const storeSlideRoute = (locale: Locale, place: number) => `${storeRoute(locale)}/${place}`;
export const storeTileRoute = (locale: Locale, tile: TileId) =>
  `${storeRoute(locale)}/tile/${tile}`;
