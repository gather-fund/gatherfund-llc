'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// After moving to another page, keyboard and screen-reader focus starts at that page's heading.
// A link to a section (/#ventures) leaves focus to the browser's own fragment handling.
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.location.hash) return;
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#main h1')?.focus({ preventScroll: true }));
  }, [pathname]);
  return null;
}
