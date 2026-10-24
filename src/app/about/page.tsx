import type { Metadata } from 'next';
import Link from 'next/link';
import { PersonIcon } from '@/components/Icons';
import { ClosingSection, PageHead, TemplateBanner } from '@/components/Sections';
import { pageMetadata } from '@/lib/metadata';
import { company } from '@/lib/site';

export const metadata: Metadata = pageMetadata({ title: 'About us', path: '/about' });

const WAYS = [
  { title: 'A clear purpose.', body: 'We give every venture a clear reason to exist and keep the people it serves at the centre.' },
  { title: 'A shared foundation.', body: '[WHAT GATHERFUND LLC PROVIDES TO ITS VENTURES, FOR EXAMPLE FUNDING, SHARED SERVICES OR GOVERNANCE]' },
  { title: 'Room to be itself.', body: 'Each venture keeps its own ideas, identity and community.' },
];

const DETAILS = [
  ['Registered name', 'Gatherfund LLC'],
  ['Registered address', company.registeredAddress],
  ['Registration number', company.registrationNumber],
  ['Place of registration', company.placeOfRegistration],
  ['Contact email', company.contactEmail],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About"
        title="About Gatherfund LLC"
        lead="Gatherfund LLC builds businesses that bring people, ideas and opportunity together, starting with Gatherfund: community fundraising for Ghana and the diaspora."
      />

      <section className="about wrap section" aria-labelledby="who-title">
        <div className="heading-group">
          <p className="eyebrow">Who we are</p>
          <h2 className="section-title" id="who-title">A parent company with a shared purpose.</h2>
        </div>
        <div className="about-copy">
          <p>Gatherfund LLC is the parent company behind a growing vision: businesses that make it easier for people to come together and move forward.</p>
          <p className="secondary">We see connection as a starting point for progress. Our first venture is Gatherfund, a fundraising platform designed around Ghana and diaspora giving. It is in development and is not open to the public yet.</p>
          <Link className="button secondary-action" href="/#ventures">See our ventures</Link>
        </div>
      </section>

      <section className="ventures section" aria-labelledby="work-title">
        <div className="wrap">
          <div className="section-heading">
            <div className="heading-group">
              <p className="eyebrow on-subtle">How we work with our ventures</p>
              <h2 className="section-title" id="work-title">A shared foundation. Room to grow.</h2>
            </div>
            <p className="secondary">Each venture is its own business. Gatherfund LLC is the home they share.</p>
          </div>
          <ol className="principles">
            {WAYS.map((way, index) => (
              <li key={way.title}>
                <span className="index micro secondary" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="card-title">{way.title}</h3>
                <p className="secondary">{way.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="team-title">
        <div className="section-heading">
          <div className="heading-group">
            <p className="eyebrow">Our team</p>
            <h2 className="section-title" id="team-title">The people behind Gatherfund LLC.</h2>
          </div>
          <p className="secondary">[ONE SENTENCE ABOUT THE TEAM]</p>
        </div>
        <div className="stack">
          <TemplateBanner>Gatherfund LLC has not supplied its team details yet. Each card below shows where one person’s name, role and short biography will go.</TemplateBanner>
          <ul className="team">
            {[1, 2, 3].map(n => (
              <li key={n}>
                <span className="future-icon" aria-hidden="true"><PersonIcon /></span>
                <h3 className="card-title">[TEAM MEMBER NAME]</h3>
                <p className="supporting">[ROLE]</p>
                <p className="supporting secondary">[SHORT BIOGRAPHY, TWO OR THREE SENTENCES]</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ventures section" aria-labelledby="details-title">
        <div className="wrap">
          <div className="section-heading">
            <div className="heading-group">
              <p className="eyebrow on-subtle">Company details</p>
              <h2 className="section-title" id="details-title">Gatherfund LLC on record.</h2>
            </div>
          </div>
          <dl className="details">
            {DETAILS.map(([term, value]) => (
              <div key={term}><dt className="supporting secondary">{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <ClosingSection spaced />
    </>
  );
}
