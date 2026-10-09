// The public origin is set at build time with SITE_URL (https://gatherfund.llc). Without it the site is treated
// as a local or preview build: absolute URLs fall back to the dev server and search engines are told not to index it.
const configuredUrl = process.env['SITE_URL']?.replace(/\/+$/, '');

export const site = {
  name: 'Gatherfund LLC',
  title: 'Gatherfund LLC — Better, together.',
  description:
    'Gatherfund LLC builds businesses that bring people, ideas, and opportunity together, starting with Gatherfund: community fundraising for Ghana and the diaspora.',
  url: configuredUrl ?? 'http://127.0.0.1:4180',
  indexable: configuredUrl !== undefined,
  themeColor: '#6941a5',
} as const;
