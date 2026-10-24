import Link from 'next/link';

export function Brand({ lazy = false }: { lazy?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Gatherfund LLC home">
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand artwork; the link carries the name */}
      <img src="/assets/gatherfund-logo.svg" alt="" width={160} height={37} loading={lazy ? 'lazy' : undefined} decoding="async" />
      <span className="llc" aria-hidden="true">LLC</span>
    </Link>
  );
}
