type Current = 'page' | 'true' | undefined;

// aria-current is "page" on the link to this page and "true" on the link to the section this page sits in.
export function currentFor(pathname: string, href: string): Current {
  if (href === '/') return pathname === '/' ? 'page' : undefined;
  if (pathname === href) return 'page';
  if (href === '/news' && pathname.startsWith('/news/')) return 'true';
  return undefined;
}

// The header's single "Legal" link stands for both legal pages.
export function legalCurrent(pathname: string): Current {
  return pathname.startsWith('/legal/') ? 'true' : undefined;
}
