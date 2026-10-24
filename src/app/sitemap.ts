import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

// Template pages (news placeholders and the unreviewed legal templates) stay out of the sitemap until they hold real content.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];
}
