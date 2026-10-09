/**
 * Exports the store images (src/components/store/) as PNGs: builds the site,
 * serves it in production (no dev overlay in the pictures), and has headless
 * Chrome capture each image's page at its exact size in every language, into
 * `store-shots/<locale>/`: the carousel's slides as `<place>-<slide>.png`,
 * then the promo tiles as `tile-<tile>.png`.
 *
 * Run it from the repository root with `bun run store:shots`. Set CHROME to the
 * browser's binary when `google-chrome` is not on the PATH.
 */
import { type ChildProcess, execFileSync, spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { SLIDE_IDS, SLIDE_SIZE, TILE_IDS, TILES } from '@/components/store/catalog';
import { LOCALES } from '@/lib/i18n';
import { storeSlideRoute, storeTileRoute } from '@/lib/routes';

const PORT = 3005;
const ORIGIN = `http://localhost:${PORT}`;
const CHROME = process.env.CHROME ?? 'google-chrome';
const WEB_DIR = join(import.meta.dirname, '..');
const OUTPUT_DIR = join(WEB_DIR, 'store-shots');
const NEXT = join(WEB_DIR, 'node_modules', '.bin', 'next');

/** Whether anything answers on the port. */
async function isServing() {
  try {
    await fetch(ORIGIN);
    return true;
  } catch {
    return false;
  }
}

/** Waits until the server answers, for up to 30 seconds, failing at once if it exits. */
async function waitForServer(server: ChildProcess) {
  let exitCode: number | null = null;
  server.once('exit', (code) => {
    exitCode = code ?? 1;
  });

  for (let attempt = 0; attempt < 60; attempt++) {
    if (exitCode !== null) throw new Error(`next start exited with code ${exitCode}`);
    if (await isServing()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`The site did not start on ${ORIGIN}`);
}

/** One image's page, captured at its size once its entrances have played. */
function capture(path: string, size: { width: number; height: number }, file: string) {
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${size.width},${size.height}`,
    '--virtual-time-budget=5000',
    `--screenshot=${file}`,
    `${ORIGIN}${path}`,
  ]);
}

async function exportStoreImages() {
  // Something already on the port would be captured instead of this build.
  if (await isServing()) throw new Error(`Port ${PORT} is in use; stop whatever runs there`);

  execFileSync('bun', ['run', 'build'], { cwd: WEB_DIR, stdio: 'inherit' });

  // Its own process group, so stopping it stops every process it started.
  const server = spawn(NEXT, ['start', '-p', String(PORT)], {
    cwd: WEB_DIR,
    detached: true,
    stdio: ['ignore', 'ignore', 'inherit'],
  });

  try {
    await waitForServer(server);
    rmSync(OUTPUT_DIR, { force: true, recursive: true });

    for (const locale of LOCALES) {
      const dir = join(OUTPUT_DIR, locale);
      mkdirSync(dir, { recursive: true });
      SLIDE_IDS.forEach((id, index) => {
        const place = index + 1;
        const file = join(dir, `${String(place).padStart(2, '0')}-${id}.png`);
        capture(storeSlideRoute(locale, place), SLIDE_SIZE, file);
      });
      for (const id of TILE_IDS) {
        capture(storeTileRoute(locale, id), TILES[id], join(dir, `tile-${id}.png`));
      }
    }
  } finally {
    if (server.pid) process.kill(-server.pid);
  }
}

await exportStoreImages();
