# Pare Moments

A memories website for an English learning journey at **Kampung Inggris, Pare** (Kediri, East Java).
Photo-first, playful and made for phones.

- **My story:** a day-by-day timeline, a gallery of every photo and video, a detail page for each day and a full-screen slideshow.
- **English practice:** 100 daily verbs (V1, V2, V3) in a table, flip cards and a quiz; grammar exercises; story listening; a sentence builder and a daily mix. Scores and a daily streak stay on the visitor's own device.
- **Friends' wall:** classmates can share their own photos with a class code. This is closed for now ("coming soon") until a backend exists.

It is an installable PWA: the photos work offline after the first visit.

## Tech

Vite, React 19, TypeScript (strict), React Router 7, TanStack Query, Tailwind CSS 4, react-icons,
date-fns, vite-plugin-pwa, Vitest and React Testing Library. Package manager: pnpm.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `pnpm dev`       | Start the dev server                                                |
| `pnpm build`     | Type-check and make the production build in `dist/`                 |
| `pnpm preview`   | Serve the production build locally                                  |
| `pnpm lint`      | Run ESLint (also checks the import rules between folders)           |
| `pnpm format`    | Format the code with Prettier                                       |
| `pnpm typecheck` | Run the TypeScript compiler                                         |
| `pnpm test:run`  | Run all tests once                                                  |
| `pnpm images`    | Make light, right-sized copies of `photos-src/` in `public/images/` |
| `pnpm brand`     | Redraw the icons and the share picture                              |

Before you finish a change, run `pnpm typecheck && pnpm lint && pnpm test:run`.

## Adding a memory

1. Put the original photos or videos in `photos-src/` (no spaces in file names, e.g. `day-8-1.jpeg`).
2. Run `pnpm images`. It writes the small copies and removes private data such as GPS location.
3. Add one entry to `src/features/moments/data/moments.ts` and list the photos as `'/images/day-8-1.jpeg'`.

## Project structure

```
src/
├── app/          # routes, layout, app wiring
├── features/
│   ├── moments/  # my story: home, gallery, detail, slideshow
│   ├── practice/ # English practice (all content is in data/)
│   └── friends/  # friends' wall and share form (closed for now)
├── shared/       # generic components, hooks and helpers
└── styles/       # Tailwind tokens and animations
```

Features do not import from each other, and `shared` never imports from a feature. ESLint enforces it.

## Configuration

Set in `.env` (or as Docker build arguments):

| Variable              | Default                 | Meaning                                                                   |
| --------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `VITE_SITE_URL`       | `http://localhost:3305` | Public address, used for the share preview and the sitemap                |
| `VITE_ENABLE_UPLOADS` | `false`                 | Opens the Friends' wall and sharing. Keep it off until there is a backend |

## Docker

```bash
docker build -t pare-moments --build-arg VITE_SITE_URL=https://your-domain.com .
docker run -d --name pare-moments -p 3305:3305 pare-moments   # http://localhost:3305
```

The image builds the site and serves it with nginx on port 3305. Photos in `public/images/` are
included, so rebuild after adding photos. The offline mode (service worker) needs HTTPS, so put the
container behind a TLS proxy in production.

## Friends' uploads and the backend

`src/features/friends/api/friends-api.ts` is the only file that knows where friends' moments are
stored. Today it uses the browser's IndexedDB, so uploads are not shared between people. When a
backend exists, replace the bodies of its three functions (`verifyCode`, `listFriendMoments`,
`createFriendMoment`) and keep the signatures. The backend must do the real checks (class code, file
type and size, rate limits, moderation); the class code screen in the app is only a doorway.
