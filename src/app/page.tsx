/* eslint-disable @next/next/no-img-element -- decorative SVG marks are sized by the stylesheet */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContactTrigger, VentureTrigger } from '@/components/Dialogs';
import { ArrowUpRightIcon, PeopleIcon, PlusIcon, TargetIcon, TrendIcon } from '@/components/Icons';
import { ClosingSection } from '@/components/Sections';
import { VentureCarousel } from '@/components/VentureCarousel';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({ path: '/' });

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: `${site.url}/`,
      logo: `${site.url}/assets/gatherfund-logo.svg`,
      description: site.description,
      brand: { '@type': 'Brand', name: 'Gatherfund' },
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      name: site.name,
      url: `${site.url}/`,
      inLanguage: 'en',
      publisher: { '@id': `${site.url}/#organization` },
    },
  ],
};

const PRINCIPLES = [
  { icon: <PeopleIcon />, title: 'Start with people.', body: 'Listen first. Understand the everyday needs behind an idea, and keep the people it serves at the centre.' },
  { icon: <TargetIcon />, title: 'Build with intention.', body: 'Give every venture a clear reason to exist. Make thoughtful choices that turn useful ideas into practical experiences.' },
  { icon: <TrendIcon />, title: 'Move forward, together.', body: 'Create space for collaboration. Bring different perspectives together and grow through shared effort.' },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script element early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c') }}
      />
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" aria-hidden="true" />Many possibilities. One shared purpose.</p>
          <h1 className="display" id="hero-title" tabIndex={-1}>Good things begin when we <em>gather.</em></h1>
          <p className="secondary measure">We bring people, ideas, and opportunity together to build businesses that move communities forward.</p>
          <div className="button-row">
            <a className="button" href="#ventures">Explore our ventures</a>
            <Link className="button secondary-action" href="/about">Get to know Gatherfund LLC</Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-circle" />
          <Image
            className="hero-photo"
            src="/assets/mother-daughter.jpg"
            alt="A mother in a patterned dress holds her daughter's hand beside a hospital bed, both smiling"
            width={1536}
            height={1024}
            sizes="(max-width: 1023px) 68vw, 330px"
            loading="eager"
            fetchPriority="high"
          />
          <div className="mini-photo">
            <Image src="/assets/classroom.jpg" alt="Students gathered in a classroom" width={1100} height={732} sizes="170px" />
          </div>
          <p className="gather-card supporting">
            <img src="/assets/gatherfund-icon.svg" alt="" width={36} height={34} />
            <span>Many hands. <strong>Shared progress.</strong></span>
          </p>
        </div>
      </section>

      <div className="purpose-strip">
        <div className="wrap purpose-in">
          <p className="supporting secondary">A company built around connection.</p>
          <ul className="purpose-list supporting">
            <li>People</li>
            <li>Ideas</li>
            <li>Opportunity</li>
            <li>Community</li>
          </ul>
        </div>
      </div>

      <section id="about" className="about wrap section" aria-labelledby="about-title" tabIndex={-1}>
        <div className="heading-group">
          <p className="eyebrow">01 / Who we are</p>
          <h2 className="section-title" id="about-title">A shared home. A bigger possibility.</h2>
        </div>
        <div className="about-copy">
          <p>Gatherfund LLC is the parent company behind a growing vision: businesses that make it easier for people to come together and move forward.</p>
          <p className="secondary">We see connection as a starting point for progress. Our role is to give each venture a clear purpose and a shared foundation, while leaving room for its own ideas, identity, and community.</p>
          <a className="button secondary-action" href="#approach">Discover what guides us</a>
        </div>
      </section>

      <section id="ventures" className="ventures section" aria-labelledby="ventures-title" tabIndex={-1}>
        <div className="wrap">
          <div className="section-heading">
            <div className="heading-group">
              <p className="eyebrow on-subtle">02 / Our ventures</p>
              <h2 className="section-title" id="ventures-title">One family. Purpose in different forms.</h2>
            </div>
            <p className="secondary">Distinct ideas, connected by a belief in what people can achieve together.</p>
          </div>
          <article className="venture-feature" aria-labelledby="venture-title">
            <div className="venture-story">
              <div className="venture-top">
                <img src="/assets/gatherfund-logo.svg" alt="Gatherfund" width={160} height={37} loading="lazy" decoding="async" />
                <span className="eyebrow">Featured venture</span>
              </div>
              <h3 className="card-title" id="venture-title">Gather support for what matters.</h3>
              <p className="secondary measure">A fundraising platform designed around Ghana and diaspora giving — connecting causes with the people who want to help.</p>
              <ul className="chips" aria-label="Focus areas">
                <li>Community fundraising</li>
                <li>Ghana &amp; diaspora</li>
              </ul>
              <VentureTrigger className="text-action" id="venture-trigger">Meet Gatherfund <ArrowUpRightIcon /></VentureTrigger>
            </div>
            <VentureCarousel />
          </article>
          <div className="future-line">
            <span className="future-icon" aria-hidden="true"><PlusIcon /></span>
            <div className="future-text">
              <strong>Room for what comes next.</strong>
              <p className="supporting secondary">Our family begins with Gatherfund. Our ambition leaves room for new ideas.</p>
            </div>
            <ContactTrigger className="button secondary-action" topic="A new venture idea">Build with us</ContactTrigger>
          </div>
        </div>
      </section>

      <section id="approach" className="wrap section" aria-labelledby="approach-title" tabIndex={-1}>
        <div className="section-heading">
          <div className="heading-group">
            <p className="eyebrow">03 / Our approach</p>
            <h2 className="section-title" id="approach-title">Different ventures. The same guiding principles.</h2>
          </div>
          <p className="secondary">The way we build matters as much as what we build.</p>
        </div>
        <ol className="principles">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title}>
              <span className="principle-symbol" aria-hidden="true">{principle.icon}</span>
              <span className="index micro secondary" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="card-title">{principle.title}</h3>
              <p className="secondary">{principle.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <ClosingSection />
    </>
  );
}
