// The one place that knows the website's name, texts and address. Keep the default title and
// description equal to the ones in index.html (what crawlers that don't run JavaScript see).
const address = import.meta.env.VITE_SITE_URL ?? ''

export const site = {
  features: {
    // Friends can add their own photos (the Share page and the Friends' wall). It is closed for
    // now, because it needs a backend that is not built yet. Open it with VITE_ENABLE_UPLOADS=true.
    uploads: import.meta.env.VITE_ENABLE_UPLOADS === 'true',
  },
  name: 'Pare Moments',
  // No trailing slash.
  url: address.replace(/\/$/, ''),
  title: 'Pare Moments · My English journey in Kampung Inggris',
  description:
    'Photos, videos and little stories from my English learning journey in Kampung Inggris, Pare (Kediri, East Java). Follow the day-by-day timeline, browse the gallery, play the slideshow and share your own moments.',
  image: '/og-image.png',
}

// Turns "/gallery" into "https://your-domain.com/gallery".
export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${site.url}${path}`
