import type { Locale } from './i18n';

/** The landing page's sections, which the header links to, in page order. */
export const anchors = {
  top: 'top',
  settings: 'settings',
  focusScreen: 'focus-screen',
  features: 'features',
  install: 'install',
} as const;

export type Anchor = (typeof anchors)[keyof typeof anchors];

/** A locale's landing page, at one of its sections. */
export const homeRoute = (locale: Locale, anchor?: Anchor) =>
  anchor ? `/${locale}#${anchor}` : `/${locale}`;
