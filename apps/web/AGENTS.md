# apps/web: the FocusPocus website

Read [`../../AGENTS.md`](../../AGENTS.md) first: its conventions (sections 5 and 8) apply here too.

## Layout

The same as the extension's (root AGENTS.md section 5.2):

- Every route sits under `src/app/[locale]/`, and **a route file is a one-line re-export**; the
  page lives in `src/screens/<name>/page.tsx`, with `partials/` for the parts only it uses.
- `src/screens/landing/mocks/` holds the **working drawings of the extension**: the popup, the
  settings page and the focus screen, in a `BrowserFrame` where the extension shows a page.
- `src/components/` is for what the page and its sections share (header, footer, store buttons,
  icons, and `motion.tsx`: `Rise` for what is on screen at load, `Reveal` for what scrolls into
  view); the design-system kit, `Brand` included, is `@focus-pocus/ui` (`packages/ui`), never a
  copy of it.
- `Section` is a band of the page, divided from the one before by a hairline; `Container` is its
  column alone. The page's background (`screens/landing/page.tsx`) draws the column's guide lines
  all the way down; the features grid sits 1px inside them, so they are its sides.
- The hero's decoration: `spell.tsx` (the faint turning vortex at the top), `silk.tsx` (the ribbon
  behind the demo) and `sparkles.tsx` (the wand logo's sparkles around the title).
- `src/proxy.ts` sends a path without a locale to the browser's best match.

## Rules

- **Tokens only**, from `@focus-pocus/ui/theme.css` plus the page-sized ones in
  `src/app/globals.css`, the one file here allowed to hold a raw color or size.
- **The site is light.** `theme-light` (on `<html>`, defined in `globals.css`) redefines the kit's
  color tokens, so every kit class (`bg-surface`, `text-text-muted`…) draws light, the drawings of
  the extension included. Shadows are the exception: Tailwind inlines their values, so
  `theme-light` overrides the kit's `shadow-subtle`/`shadow-card` classes directly.
- **The drawings mirror the extension**, in the site's light colors. They use the kit's controls
  and repeat the class strings (and small constants, like the duration presets) of the screens
  they draw; each file says which. Change a screen in `apps/extension`, change its drawing.
  They never reach storage or the network (no favicons: a letter tile instead).
- **Copy:** the page's text is in `src/locales/` (`en` the source, the others typed against it);
  the drawings speak the extension's own copy from `@focus-pocus/locales`. A component gets both
  from `useCopy()` (`src/lib/i18n-provider.tsx`): `site` and `app`.
- **Icons:** the kit's from `@focus-pocus/ui/icons`; the ones only the site uses from
  `src/components/icons.ts`, deep-imported per glyph. The Chrome and Firefox marks come from
  Simple Icons (`src/components/store-mark.tsx`).
- **Links** to the stores, GitHub and support live in `src/lib/links.ts`.
- **Reviews** (`src/screens/landing/reviews.ts`) are real ones from the Chrome Web Store, with the
  name and date. The Portuguese is exactly as written; the English and Spanish are faithful
  translations. Never invent or edit one, and never add a rating the source does not show.
- `SITE_URL` is the deployed origin; set it in production. The language alternates need absolute
  URLs, so without it they are left out of the metadata.
- Only `/en`, `/pt-BR` and `/es` exist (`dynamicParams = false`). Any other path under them hits
  `[locale]/[...rest]`, which calls `notFound()`, so the locale's `not-found` page renders in its
  language (a not-found file alone does not catch unmatched URLs).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
