'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHead, TemplateBanner } from './Sections';

// The shared layout of the privacy notice and the terms of use. Both are templates awaiting legal review.
export function LegalPage({ title, lead, notice, sections }: {
  title: string;
  lead: string;
  notice: string;
  sections: readonly (readonly [string, string])[];
}) {
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? 'page' : undefined);
  return (
    <>
      <PageHead eyebrow="Legal" title={title} lead={lead}>
        <div className="page-meta supporting secondary">
          <p>Last updated [DATE]</p>
          <p>Version [VERSION]</p>
        </div>
        <nav className="local-nav" aria-label="Legal pages">
          <ul>
            <li><Link className="nav-link" href="/legal/privacy" aria-current={current('/legal/privacy')}>Privacy notice</Link></li>
            <li><Link className="nav-link" href="/legal/terms" aria-current={current('/legal/terms')}>Terms of use</Link></li>
          </ul>
        </nav>
      </PageHead>
      <div className="wrap section">
        <div className="prose">
          <TemplateBanner tone="warning" title="Template awaiting legal review">{notice}</TemplateBanner>
          {sections.map(([heading, body], index) => (
            <section key={heading}>
              <h2 className="card-title">{index + 1}. {heading}</h2>
              <p className="secondary">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
