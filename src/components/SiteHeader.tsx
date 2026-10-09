'use client';

import { useState } from 'react';
import { Brand } from './Brand';
import { ContactTrigger, useDialogs } from './Dialogs';

const LINKS = [
  { href: '#about', label: 'Who we are' },
  { href: '#ventures', label: 'Our ventures' },
  { href: '#approach', label: 'Our approach' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openContact } = useDialogs();

  return (
    <header>
      <div className="nav-wrap">
        <Brand ariaLabel="Gatherfund LLC home" />
        <nav id="navigation" aria-label="Main navigation" className={open ? 'open' : undefined}>
          {LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          {/* On mobile the header button is hidden and this menu item takes its place. */}
          <button
            className="button nav-connect"
            onClick={() => {
              setOpen(false);
              openContact();
            }}
          >
            Let’s connect <span aria-hidden="true">↗</span>
          </button>
        </nav>
        <ContactTrigger className="button small contact-trigger header-connect">Let’s connect <span aria-hidden="true">↗</span></ContactTrigger>
        <button
          className="menu"
          aria-controls="navigation"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(value => !value)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}
