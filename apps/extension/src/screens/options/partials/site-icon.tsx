import { cx } from '@focus-pocus/ui/cx';
import { useState } from 'react';

/**
 * The host part of an entry, without the scheme or "www.". Entries are free
 * substrings, so this is a best guess.
 */
function getHost(url: string) {
  return url
    .trim()
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#]/)[0];
}

/**
 * The row's tile: the first letter of the host, covered by the site's own
 * /favicon.ico when the entry looks like a domain and the icon loads. No
 * third-party favicon service, so the list never leaves the browser except to
 * the listed sites.
 */
export function SiteIcon({ url }: { url: string }) {
  const host = getHost(url);
  const [hasFavicon, setHasFavicon] = useState(false);
  const looksLikeDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?$/i.test(host);

  return (
    <span
      aria-hidden="true"
      className={cx(
        'relative flex size-8 shrink-0 items-center justify-center rounded-md bg-raised-hover text-sm font-bold uppercase',
        hasFavicon ? 'text-transparent' : 'text-text-muted',
      )}
    >
      {host.charAt(0) || '?'}
      {looksLikeDomain && (
        <img
          className={cx(
            'absolute inset-0 m-auto size-4.5 transition-opacity duration-(--duration) ease-fluid',
            !hasFavicon && 'opacity-0',
          )}
          src={`https://${host}/favicon.ico`}
          alt=""
          referrerPolicy="no-referrer"
          onLoad={() => setHasFavicon(true)}
        />
      )}
    </span>
  );
}
