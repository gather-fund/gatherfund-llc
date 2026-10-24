import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContactTrigger } from '@/components/Dialogs';
import { ChevronLeftIcon } from '@/components/Icons';
import { TemplateBanner } from '@/components/Sections';
import { ARTICLES, findArticle } from '@/lib/news';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<'/news/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  return {
    title: `${article.headline} | News`,
    description: article.summary,
    alternates: { canonical: `/news/${slug}` },
    openGraph: { url: `/news/${slug}`, type: 'article' },
    // Placeholder articles stay out of search results until they hold real news.
    ...(article.isTemplate ? { robots: { index: false, follow: true } } : {}),
  };
}

function AllNews() {
  return (
    <Link className="text-link" href="/news">
      <ChevronLeftIcon size={16} />
      <span>All news</span>
    </Link>
  );
}

export default async function ArticlePage({ params }: PageProps<'/news/[slug]'>) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  return (
    <article aria-labelledby="article-title">
      <div className="page-head">
        <div className="wrap page-head-in">
          <AllNews />
          <h1 className="page-title" id="article-title" tabIndex={-1}>{article.headline}</h1>
          <p className="secondary lead">{article.summary}</p>
          <div className="page-meta supporting secondary">
            <p>Published {article.date}</p>
            <p>By {article.author}</p>
          </div>
        </div>
      </div>
      <div className="wrap section">
        <div className="prose">
          <TemplateBanner>This is the layout for one news article. Gatherfund LLC has not supplied any article text or images yet.</TemplateBanner>
          <figure className="image-placeholder">
            <p className="supporting">[ARTICLE IMAGE, WITH A SHORT DESCRIPTION FOR PEOPLE WHO CANNOT SEE IT]</p>
          </figure>
          <p>[OPENING PARAGRAPH: THE NEWS IN ONE OR TWO SENTENCES]</p>
          <section>
            <h2 className="card-title">[SECTION HEADING]</h2>
            <p>[BODY PARAGRAPH]</p>
            <p>[BODY PARAGRAPH]</p>
          </section>
          <section>
            <h2 className="card-title">[SECTION HEADING]</h2>
            <p>[BODY PARAGRAPH]</p>
          </section>
          <div className="article-end">
            <p className="secondary">Have a question about this update?</p>
            <ContactTrigger className="button secondary-action" id="article-contact">Contact us</ContactTrigger>
            <AllNews />
          </div>
        </div>
      </div>
    </article>
  );
}
