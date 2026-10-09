# Gatherfund LLC website (Next.js)

Next.js port of the static prototype in `../gatherllc/dist`. Local-only, like the prototype: do not deploy or publish it unless the owner says otherwise.

```sh
npm install
npm run dev        # http://127.0.0.1:4180
npm run build && npm start
```

- `src/app/page.tsx`: page content (server component)
- `src/components/Dialogs.tsx`: contact and Gatherfund dialogs and their triggers (client)
- `src/components/SiteHeader.tsx`: header with the mobile menu (client)
- `src/app/globals.css`: the prototype's stylesheet, unchanged
- `public/assets/`: the prototype's images and logos

The enquiry form only prepares text to copy. It does not send anything.

## SEO

Build for production with `npm run build:prod`. It sets `SITE_URL=https://gatherfund.llc`, which drives the canonical URL, Open Graph and Twitter tags, `sitemap.xml`, `robots.txt` and the JSON-LD.

Without `SITE_URL` the build is treated as local or preview: pages are `noindex, nofollow` and `robots.txt` disallows everything.

- `src/lib/site.ts`: site name, title, description and URL
- `src/app/opengraph-image.tsx`: the social share image (1200×630), generated at build time
- `src/app/icon.svg`, `src/app/apple-icon.tsx`: favicon and Apple touch icon
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts`
