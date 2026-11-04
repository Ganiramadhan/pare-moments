import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { buildRobots, buildSitemap } from './scripts/seo-files'
import { moments } from './src/features/moments/data/moments'
import imageManifest from './src/shared/lib/image-manifest.json'

type Manifest = Record<string, { variants: { src: string }[] }>

// Writes sitemap.xml (every page and photo) and robots.txt next to the built website.
const siteFiles = (siteUrl: string, includeFriends: boolean): Plugin => ({
  name: 'site-files',
  apply: 'build',
  generateBundle() {
    const photoUrl = (photo: string) =>
      (imageManifest as Manifest)[photo]?.variants.at(-1)?.src ?? photo
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: buildSitemap({
        siteUrl,
        moments,
        photoUrl,
        today: new Date().toISOString().slice(0, 10),
        includeFriends,
      }),
    })
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(siteUrl) })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL ?? 'http://localhost:3305').replace(/\/$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      siteFiles(siteUrl, env.VITE_ENABLE_UPLOADS === 'true'),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          id: '/',
          name: 'Pare Moments',
          short_name: 'Moments',
          description:
            'Photos and little stories from my English journey in Kampung Inggris, Pare.',
          lang: 'en',
          categories: ['photo', 'lifestyle', 'education'],
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#0d9488',
          background_color: '#0d9488',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            {
              src: '/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          ],
          shortcuts: [
            { name: 'Gallery', url: '/gallery' },
            { name: 'Slideshow', url: '/slideshow' },
            { name: 'Share a moment', url: '/share' },
          ],
        },
        workbox: {
          // These are real files, not pages of the app.
          navigateFallbackDenylist: [/^\/(sitemap\.xml|robots\.txt)$/],
          // Keep photos on the device after the first visit, so the memories work offline.
          runtimeCaching: [
            {
              // Videos are streamed in ranges, so only photos are cached.
              urlPattern: ({ url }) =>
                url.pathname.startsWith('/images/') && !/\.(mp4|webm|mov|m4v)$/i.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'photos',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 150 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
