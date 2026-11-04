// Builds sitemap.xml and robots.txt when the website is built (see vite.config.ts).
type SitemapMoment = { id: string; date: string; title: string; photos: string[] }

type SitemapOptions = {
  siteUrl: string
  moments: SitemapMoment[]
  // Gives the address of the best size of a photo, e.g. '/images/day-1-1.jpeg' -> '/images/day-1-1-1600.webp'.
  photoUrl: (photo: string) => string
  // The build date, as YYYY-MM-DD.
  today: string
  // Whether the Friends' wall is open. A closed page is not worth listing.
  includeFriends?: boolean
}

const escapeXml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const isVideo = (src: string) => /\.(mp4|webm|mov|m4v)$/i.test(src)

export const buildSitemap = ({
  siteUrl,
  moments,
  photoUrl,
  today,
  includeFriends = true,
}: SitemapOptions) => {
  const page = (path: string, priority: string, lastmod: string, images: string[] = []) => `  <url>
    <loc>${escapeXml(siteUrl + path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>${images
      .map(
        (src) => `
    <image:image><image:loc>${escapeXml(siteUrl + photoUrl(src))}</image:loc></image:image>`,
      )
      .join('')}
  </url>`

  const pages = [
    page('/', '1.0', today),
    page('/gallery', '0.8', today),
    page('/practice', '0.8', today),
    page('/practice/verbs', '0.6', today),
    page('/practice/grammar', '0.6', today),
    page('/practice/listening', '0.6', today),
    page('/practice/sentences', '0.6', today),
    page('/practice/daily', '0.6', today),
    ...(includeFriends ? [page('/friends', '0.6', today)] : []),
    ...moments.map((moment) =>
      page(
        `/moments/${moment.id}`,
        '0.7',
        moment.date,
        moment.photos.filter((src) => !isVideo(src)),
      ),
    ),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.join('\n')}
</urlset>
`
}

export const buildRobots = (siteUrl: string) => `User-agent: *
Allow: /
Disallow: /share

Sitemap: ${siteUrl}/sitemap.xml
`
