// The public origin, fixed at build time. Share previews (Open Graph, X), canonical links, the sitemap and JSON-LD
// all need it as an absolute address that crawlers can reach.
//  1. SITE_URL, when set (npm run build:prod, or the hosting platform's environment variables).
//  2. On Vercel, its own system variables: the production domain for production builds, the deployment's address
//     for previews. Without this a Vercel build would point crawlers at the local dev server.
//  3. Otherwise the local dev server.
// Only SITE_URL or a Vercel production build is indexable; everything else is told to stay out of search results.
const trim = (url: string) => url.replace(/\/+$/, '');
const env = process.env;
const configuredUrl = env['SITE_URL'] ? trim(env['SITE_URL']) : undefined;
const vercelProduction = env['VERCEL_ENV'] === 'production' && env['VERCEL_PROJECT_PRODUCTION_URL'];
const vercelUrl = vercelProduction
  ? `https://${env['VERCEL_PROJECT_PRODUCTION_URL']}`
  : env['VERCEL_BRANCH_URL'] || env['VERCEL_URL']
    ? `https://${env['VERCEL_BRANCH_URL'] || env['VERCEL_URL']}`
    : undefined;

export const site = {
  name: 'Gatherfund LLC',
  title: 'Gatherfund LLC — Better, together.',
  description:
    'Gatherfund LLC builds businesses that bring people, ideas, and opportunity together, starting with Gatherfund: community fundraising for Ghana and the diaspora.',
  url: configuredUrl ?? vercelUrl ?? 'http://127.0.0.1:4180',
  indexable: configuredUrl !== undefined || Boolean(vercelProduction),
  themeColor: '#6941a5',
} as const;

// Company facts the design shows in brackets because Gatherfund LLC has not supplied them yet.
// Replace each value here once it is known; every page reads them from this one place.
export const company = {
  contactEmail: '[CONTACT EMAIL]',
  responseTime: '[RESPONSE TIME]',
  registeredAddress: '[REGISTERED ADDRESS]',
  registrationNumber: '[REGISTRATION NUMBER]',
  placeOfRegistration: '[PLACE OF REGISTRATION]',
} as const;

export const TOPICS = ['Partnership opportunities', 'A new venture idea', 'Gatherfund', 'A general enquiry'] as const;
export type Topic = (typeof TOPICS)[number];
