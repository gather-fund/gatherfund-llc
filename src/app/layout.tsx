import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { DialogProvider } from '@/components/Dialogs';
import { RouteFocus } from '@/components/RouteFocus';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ['Gatherfund LLC', 'Gatherfund', 'community fundraising', 'Ghana', 'diaspora giving', 'social impact ventures'],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  robots: site.indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Smooth scrolling is for in-page section links; data-scroll-behavior lets Next.js jump straight to the top on a page change.
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <DialogProvider>
          <a className="skip" href="#main">Skip to content</a>
          <SiteHeader />
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter />
          <RouteFocus />
        </DialogProvider>
      </body>
    </html>
  );
}
