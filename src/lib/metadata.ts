import type { Metadata } from 'next';
import { site } from './site';

// The share image, rendered from scripts/og/og.html by scripts/og/render.sh into public/og-image.png.
export const SHARE_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Gatherfund LLC: Good things begin when we gather. A mother holds her daughter’s hand beside a hospital bed, beside a photo of a full classroom.',
  type: 'image/png',
};

// Next.js replaces, not merges, a parent's openGraph and twitter objects, so every page builds both here
// and none of them loses the share image.
export function pageMetadata({ title, path, description = site.description, type = 'website', indexable = true }: {
  title?: string;
  path: string;
  description?: string;
  type?: 'website' | 'article';
  indexable?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : site.title;
  return {
    title: title ?? { absolute: site.title },
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: site.name, title: fullTitle, description, locale: 'en_US', images: [SHARE_IMAGE] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [SHARE_IMAGE] },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}
