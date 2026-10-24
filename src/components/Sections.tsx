/* eslint-disable @next/next/no-img-element -- decorative brand artwork */
import type { ReactNode } from 'react';
import { ContactTrigger } from './Dialogs';

// The closing call to action on Home, About and News.
export function ClosingSection({ spaced = false }: { spaced?: boolean }) {
  return (
    <section className={spaced ? 'wrap section' : 'wrap'} id="contact" aria-labelledby="contact-heading" tabIndex={-1}>
      <div className="contact-section">
        <div className="contact-art" aria-hidden="true"><img src="/assets/gatherfund-icon.svg" alt="" width={136} height={130} loading="lazy" decoding="async" /></div>
        <p className="eyebrow on-subtle">The next chapter starts with a conversation</p>
        <h2 className="page-title" id="contact-heading">What could we build <em>together?</em></h2>
        <p className="secondary measure">A new idea. A shared ambition. A meaningful connection. We’d love to hear what you have in mind.</p>
        <ContactTrigger className="button" id="contact-trigger">Let’s start a conversation</ContactTrigger>
      </div>
    </section>
  );
}

// The heading band on every page except Home.
export function PageHead({ eyebrow, title, lead, titleId, before, children }: {
  eyebrow?: string;
  title: string;
  lead: string;
  titleId?: string;
  before?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div className="wrap page-head-in">
        {before}
        {eyebrow && <p className="eyebrow on-subtle">{eyebrow}</p>}
        <h1 className="page-title" id={titleId} tabIndex={-1}>{title}</h1>
        <p className="secondary lead">{lead}</p>
        {children}
      </div>
    </div>
  );
}

export function TemplateBanner({ title = 'Template', tone, children }: { title?: string; tone?: 'warning'; children: ReactNode }) {
  return (
    <div className={tone ? `banner ${tone}` : 'banner'}>
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}
