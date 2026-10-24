'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { company } from '@/lib/site';
import { currentFor } from '@/lib/nav';
import { Brand } from './Brand';
import { ContactTrigger } from './Dialogs';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/news', label: 'News' },
  { href: '/legal/privacy', label: 'Privacy notice' },
  { href: '/legal/terms', label: 'Terms of use' },
];

export function SiteFooter() {
  const pathname = usePathname();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand lazy />
            <p className="supporting secondary">Bringing possibility together.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <ul>
              {LINKS.map(item => (
                <li key={item.href}><Link href={item.href} aria-current={currentFor(pathname, item.href)}>{item.label}</Link></li>
              ))}
              <li><ContactTrigger className="" id="footer-contact">Contact us</ContactTrigger></li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom supporting secondary">
          <p>© {new Date().getFullYear()} Gatherfund LLC. {company.registeredAddress}. Registration number {company.registrationNumber}.</p>
          <p>People. Purpose. Possibility.</p>
        </div>
      </div>
    </footer>
  );
}
