import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
// Vercel preview deployments load the Vercel toolbar (comments on previews), which needs its own sources.
const isVercelPreview = process.env.VERCEL_ENV === 'preview';
const vercelLive = isVercelPreview ? ' https://vercel.live' : '';

// Content-Security-Policy without nonces, as in the Next.js CSP guide, so pages stay statically rendered.
// Scripts are limited to this site; 'unsafe-inline' covers the inline scripts Next.js adds to static pages,
// and 'unsafe-eval' is only for React's development tools. Everything else is locked to this site.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${vercelLive}`,
  // No inline event-handler attributes (onclick="…"); React attaches its handlers in script.
  "script-src-attr 'none'",
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  // data: is for the SVG brand mark inlined as a data URI (src/lib/brand-mark.ts); nothing uses blob: URLs.
  `img-src 'self' data:${isVercelPreview ? ' https://vercel.live https://vercel.com' : ''}`,
  `font-src 'self'${isVercelPreview ? ' https://vercel.live https://assets.vercel.com' : ''}`,
  `connect-src 'self'${isVercelPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
  `frame-src ${isVercelPreview ? 'https://vercel.live' : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{
      // Font files rarely change but their names carry no hash, so they are cached for 30 days rather than forever.
      source: '/fonts/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
    }, {
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      ],
    }];
  },
};

export default config;
