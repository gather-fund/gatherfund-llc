import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/news';
import { site } from '@/lib/site';

// Template pages (news placeholders and the unreviewed legal templates) stay out of the sitemap until they hold real content.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
  const real = ARTICLES.filter(article => !article.isTemplate);
  if (!ARTICLES.some(article => article.isTemplate)) {
    pages.push({ url: `${site.url}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 });
    for (const article of real) pages.push({ url: `${site.url}/news/${article.slug}`, changeFrequency: 'yearly', priority: 0.5 });
  }
  return pages;
}
