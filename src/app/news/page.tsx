import type { Metadata } from 'next';
import Link from 'next/link';
import { ClosingSection, PageHead, TemplateBanner } from '@/components/Sections';
import { ARTICLES } from '@/lib/news';

export const metadata: Metadata = {
  title: 'News',
  alternates: { canonical: '/news' },
  openGraph: { url: '/news' },
};

export default function NewsPage() {
  const showsTemplate = ARTICLES.some(article => article.isTemplate);
  return (
    <>
      <PageHead eyebrow="News" title="News from Gatherfund LLC" lead="Updates from Gatherfund LLC and its ventures." />
      <section className="wrap section" aria-label="Articles">
        <div className="stack">
          {ARTICLES.length === 0 ? (
            <div className="empty" id="news-empty">
              <h2 className="card-title">No news yet</h2>
              <p className="secondary measure">When Gatherfund LLC or one of its ventures has an update, you’ll find it here.</p>
              <Link className="button secondary-action" href="/about">About Gatherfund LLC</Link>
            </div>
          ) : (
            <>
              {showsTemplate && (
                <TemplateBanner>Gatherfund LLC has not published any news yet. Each entry below shows where a date, a headline and a one-sentence summary will go.</TemplateBanner>
              )}
              <ul className="news-list" id="news-list">
                {ARTICLES.map(article => (
                  <li key={article.slug}>
                    <p className="supporting secondary date">{article.date}</p>
                    <div className="news-item">
                      <h2 className="card-title"><Link href={`/news/${article.slug}`}>{article.headline}</Link></h2>
                      <p className="secondary measure">{article.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      <ClosingSection />
    </>
  );
}
