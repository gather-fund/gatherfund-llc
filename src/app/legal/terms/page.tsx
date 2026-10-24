import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { pageMetadata } from '@/lib/metadata';

// The template has not had legal review; keep it out of search results until it has.
export const metadata: Metadata = pageMetadata({ title: 'Terms of use', path: '/legal/terms', indexable: false });

const SECTIONS = [
  ['About these terms', '[WHAT THESE TERMS COVER AND WHEN THEY APPLY]'],
  ['Who we are', '[COMPANY NAME, REGISTERED ADDRESS, REGISTRATION NUMBER AND PLACE OF REGISTRATION]'],
  ['Using this website', '[WHAT VISITORS MAY AND MAY NOT DO]'],
  ['Our ventures and their own terms', '[A STATEMENT THAT GATHERFUND AND ANY OTHER VENTURE HAS ITS OWN TERMS, AND WHERE TO FIND THEM]'],
  ['Intellectual property', '[WHO OWNS THE CONTENT, NAMES AND LOGOS, AND WHAT USE IS ALLOWED]'],
  ['Links to other websites', '[RESPONSIBILITY FOR WEBSITES THIS ONE LINKS TO]'],
  ['Information on this website', '[HOW FAR VISITORS MAY RELY ON THE CONTENT]'],
  ['Our responsibility to you', '[LIMITS OF LIABILITY, AS THE LAW ALLOWS]'],
  ['The law that applies', '[GOVERNING LAW AND WHERE DISPUTES ARE HEARD]'],
  ['Changes to these terms', '[HOW AND WHEN CHANGES ARE ANNOUNCED]'],
  ['Contact us', '[CONTACT EMAIL] and [REGISTERED ADDRESS]'],
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      lead="The terms that apply when you use the Gatherfund LLC website."
      notice="These are not Gatherfund LLC’s terms of use. This page lists the sections the terms need. The text has not been written or approved by a lawyer, and it must not be published as it is."
      sections={SECTIONS}
    />
  );
}
