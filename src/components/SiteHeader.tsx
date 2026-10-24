'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { currentFor, legalCurrent } from '@/lib/nav';
import { Brand } from './Brand';
import { useDialogs } from './Dialogs';
import { CloseIcon, MenuIcon } from './Icons';

export function SiteHeader() {
  const pathname = usePathname();
  const { openContact } = useDialogs();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);

  // A new page closes the phone menu.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // The phone menu closes on Escape wherever focus is, and when the visitor presses outside the header.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
      setOpen(false);
      document.getElementById('menu-button')?.focus();
    }
    function onPointer(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const link = (href: string, label: string, current = currentFor(pathname, href)) => (
    // Closing the menu before the page changes keeps the header short when Next.js scrolls the new page into place.
    <Link className="nav-link" href={href} aria-current={current} onClick={() => setOpen(false)}>{label}</Link>
  );

  return (
    <header
      className="site-header"
      id="site-header"
      ref={headerRef}
      // The menu closes when keyboard focus leaves the header, so it is never open behind the visitor.
      onBlur={event => {
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="wrap header-in">
        <Brand />
        <nav className="site-nav" aria-label="Main">
          {link('/', 'Home')}
          {link('/about', 'About')}
          {link('/news', 'News')}
          {link('/legal/privacy', 'Legal', legalCurrent(pathname))}
          <button type="button" className="button secondary-action in-header" onClick={() => openContact()}>Contact us</button>
        </nav>
        <button
          type="button"
          className="icon-button menu-button"
          id="menu-button"
          aria-label="Menu"
          aria-controls="menu-panel"
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <nav className="menu-panel" id="menu-panel" aria-label="Main">
          <div className="wrap">
            <ul>
              <li>{link('/', 'Home')}</li>
              <li>{link('/about', 'About')}</li>
              <li>{link('/news', 'News')}</li>
              <li>{link('/legal/privacy', 'Privacy notice')}</li>
              <li>{link('/legal/terms', 'Terms of use')}</li>
            </ul>
            <button
              type="button"
              className="button secondary-action"
              onClick={() => {
                setOpen(false);
                openContact();
              }}
            >
              Contact us
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
