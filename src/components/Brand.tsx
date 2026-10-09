import Link from 'next/link';

export function Brand({ ariaLabel }: { ariaLabel?: string }) {
  return (
    <Link className="brand" href="/" aria-label={ariaLabel ?? 'Gatherfund LLC home'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/gatherfund-icon.svg" alt="" width={38} height={38} />
      <span>gatherfund<span className="llc">LLC</span></span>
    </Link>
  );
}
