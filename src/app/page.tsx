/* eslint-disable @next/next/no-img-element -- decorative SVG marks are sized by the stylesheet */
import Image from 'next/image';
import { Brand } from '@/components/Brand';
import { ContactTrigger, DialogProvider, VentureTrigger } from '@/components/Dialogs';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';

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
  { symbol: '◎', title: 'Start with people.', body: 'Listen first. Understand the everyday needs behind an idea, and keep the people it serves at the centre.' },
  { symbol: '↗', title: 'Build with intention.', body: 'Give every venture a clear reason to exist. Make thoughtful choices that turn useful ideas into practical experiences.' },
  { symbol: '✳', title: 'Move forward, together.', body: 'Create space for collaboration. Bring different perspectives together and grow through shared effort.' },
];

export default function HomePage() {
  return (
    <DialogProvider>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can never close the script element early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c') }}
      />
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="dot" /> MANY POSSIBILITIES. ONE SHARED PURPOSE.</div>
            <h1>Good things<br />begin when<br />we <em>gather.</em></h1>
            <p>We bring people, ideas, and opportunity together to build businesses that move communities forward.</p>
            <div className="hero-actions">
              <a className="button" href="#ventures">Explore our ventures <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#about">Get to know Gather <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-note"><span className="note-line" />People at the heart. Possibility ahead.</div>
          </div>
          <div className="hero-art">
            <div className="art-circle" />
            <div className="art-label">THE POWER OF TOGETHER</div>
            <Image className="hero-photo" src="/assets/sewing.jpg" alt="A woman working at a sewing machine" width={1100} height={733} sizes="(max-width: 760px) 71vw, 340px" priority />
            <div className="photo-caption">Ideas become opportunity.</div>
            <div className="gather-card">
              <img src="/assets/gatherfund-icon.svg" alt="" />
              <span>Many hands.<br /><strong>Shared progress.</strong></span>
              <span className="spark" aria-hidden="true">✳</span>
            </div>
            <div className="mini-photo">
              <Image src="/assets/classroom.jpg" alt="Students gathered in a classroom" width={1100} height={732} sizes="170px" />
            </div>
            <div className="orbit" aria-hidden="true">↗</div>
          </div>
        </section>

        <div className="purpose-strip">
          <div className="wrap">
            <span>A company built around connection.</span>
            <span>People <i>✳</i> Ideas <i>✳</i> Opportunity <i>✳</i> Community</span>
          </div>
        </div>

        <section id="about" className="about wrap section">
          <div>
            <div className="eyebrow">01 / WHO WE ARE</div>
            <h2>A shared home.<br />A bigger possibility.</h2>
          </div>
          <div className="about-copy">
            <p className="lead">Gatherfund LLC is the parent company behind a growing vision: businesses that make it easier for people to come together and move forward.</p>
            <p>We see connection as a starting point for progress. Our role is to give each venture a clear purpose and a shared foundation, while leaving room for its own ideas, identity, and community.</p>
            <a className="text-link" href="#approach">Discover what guides us <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section id="ventures" className="ventures section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">02 / OUR VENTURES</div>
                <h2>One family.<br />Purpose in different forms.</h2>
              </div>
              <p>Distinct ideas, connected by a belief<br />in what people can achieve together.</p>
            </div>
            <article className="venture-feature">
              <div className="venture-story">
                <div className="venture-top">
                  <img src="/assets/gatherfund-logo.svg" alt="Gatherfund" />
                  <span className="tag">FEATURED VENTURE</span>
                </div>
                <h3>Gather support<br />for what matters.</h3>
                <p>A fundraising platform designed around Ghana and diaspora giving — connecting causes with the people who want to help.</p>
                <div className="chips"><span>Community fundraising</span><span>Ghana &amp; diaspora</span></div>
                <VentureTrigger className="text-link venture-trigger">Meet Gatherfund <span aria-hidden="true">↗</span></VentureTrigger>
              </div>
              <div className="venture-image">
                <Image src="/assets/classroom.jpg" alt="A classroom full of students" fill sizes="(max-width: 760px) 100vw, 560px" />
                <div className="image-note"><span className="dot" /> Small contributions. Shared possibility.</div>
              </div>
            </article>
            <div className="future-line">
              <span className="future-icon" aria-hidden="true">+</span>
              <div>
                <strong>Room for what comes next.</strong>
                <p>Our family begins with Gatherfund. Our ambition leaves room for new ideas.</p>
              </div>
              <ContactTrigger className="text-link contact-trigger">Build with us <span aria-hidden="true">↗</span></ContactTrigger>
            </div>
          </div>
        </section>

        <section id="approach" className="approach wrap section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">03 / OUR APPROACH</div>
              <h2>Different ventures.<br />The same guiding principles.</h2>
            </div>
            <p>The way we build matters<br />as much as what we build.</p>
          </div>
          <div className="principles">
            {PRINCIPLES.map((principle, index) => (
              <article key={principle.title}>
                <div className="principle-symbol" aria-hidden="true">{principle.symbol}</div>
                <span className="index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap" id="contact">
          <div className="contact-section">
            <div className="contact-art" aria-hidden="true"><img src="/assets/gatherfund-icon.svg" alt="" /></div>
            <div className="eyebrow">THE NEXT CHAPTER STARTS WITH A CONVERSATION</div>
            <h2>What could we<br />build <em>together?</em></h2>
            <p>A new idea. A shared ambition. A meaningful connection.{' '}<br />We’d love to hear what you have in mind.</p>
            <ContactTrigger className="button light contact-trigger">Let’s start a conversation <span aria-hidden="true">↗</span></ContactTrigger>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand />
            <p>Bringing possibility together.</p>
          </div>
          <nav aria-label="Footer">
            <a href="#about">Who we are</a>
            <a href="#ventures">Our ventures</a>
            <a href="#contact">Connect</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gatherfund LLC.</span>
          <span>People. Purpose. Possibility.</span>
        </div>
      </footer>
    </DialogProvider>
  );
}
