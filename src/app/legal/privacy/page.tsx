import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy notice',
  alternates: { canonical: '/legal/privacy' },
  // The template has not had legal review; keep it out of search results until it has.
  robots: { index: false, follow: true },
  openGraph: { url: '/legal/privacy' },
};

const SECTIONS = [
  ['Who we are and how to contact us', '[COMPANY NAME, REGISTERED ADDRESS, AND THE CONTACT FOR PRIVACY QUESTIONS: CONTACT EMAIL]'],
  ['The information we collect', '[WHAT THE WEBSITE COLLECTS, INCLUDING THE NAME, EMAIL ADDRESS, TOPIC AND MESSAGE FROM THE ENQUIRY FORM]'],
  ['How we use your information', '[EACH PURPOSE, INCLUDING REPLYING TO ENQUIRIES]'],
  ['Our legal basis for using it', '[THE LEGAL BASIS FOR EACH PURPOSE UNDER THE LAWS THAT APPLY]'],
  ['Who we share it with', '[SERVICE PROVIDERS AND ANY OTHER RECIPIENTS, OR A STATEMENT THAT THERE ARE NONE]'],
  ['Sending information to other countries', '[WHERE INFORMATION IS STORED AND PROCESSED, AND THE SAFEGUARDS FOR TRANSFERS]'],
  ['How long we keep it', '[RETENTION PERIOD FOR ENQUIRIES AND ANY OTHER RECORDS]'],
  ['How we keep it secure', '[SECURITY MEASURES, IN PLAIN WORDS]'],
  ['Cookies and similar technologies', '[WHICH COOKIES OR ANALYTICS THE WEBSITE USES, OR A STATEMENT THAT IT USES NONE]'],
  ['Your rights', '[THE RIGHTS PEOPLE HAVE OVER THEIR INFORMATION AND HOW TO USE THEM]'],
  ['How to complain', '[HOW TO COMPLAIN TO GATHERFUND LLC AND TO THE RELEVANT DATA PROTECTION AUTHORITY]'],
  ['Changes to this notice', '[HOW AND WHEN CHANGES ARE ANNOUNCED]'],
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      lead="How Gatherfund LLC collects, uses and protects personal information on this website."
      notice="This is not Gatherfund LLC’s privacy notice. It lists the sections a privacy notice needs. The text has not been written or approved by a lawyer, and it must not be published as it is."
      sections={SECTIONS}
    />
  );
}
