# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project: Pare Moments

A memories website for my English learning journey at **Kampung Inggris, Pare (Kediri, East Java)**. It has three parts:

1. **My story (static).** Moments I wrote myself in `src/features/moments/data/moments.ts`: a scrapbook gallery, a detail page per day, and a full-screen slideshow (autoplay, like a video).
2. **English practice.** The daily verbs (100 verbs, V1/V2/V3 in a paginated table and flip cards, plus a quiz), grammar exercises (tenses, question words, passive voice, how-questions, modals, prepositions), listening with short stories (multiple choice and typed blanks), a sentence builder and a daily mix, with fireworks when a round ends. Only grammar and listening come in three versions (V1 basic, V2 intermediate, V3 challenge). Content is kept small on purpose, only what is used a lot: static content with instant feedback, scores and a daily streak kept on the visitor's own device. No accounts, no backend.
3. **Friends' wall (uploads).** My classmates can add their own photos and captions. They need the **class code** first. No accounts, no login: just a code, a name, a caption and photos.

Visitors never edit or delete my moments. Friends can only add to the wall.

**Friends' uploads are CLOSED for now.** The Share page and the Friends' wall show an "Under development / coming soon" page (`friends/components/ComingSoon.tsx`), the Share button is gone from the navigation, Friends carries a "Soon" tag, and the home page banner says it is coming soon. One switch controls it all: `site.features.uploads` (`shared/config/site.ts`), set by `VITE_ENABLE_UPLOADS` (default `false` in `.env` and the Dockerfile). The real upload code (class code, form, wall, `friendsApi`) is kept and tested; to open it set `VITE_ENABLE_UPLOADS=true` once the backend exists. Closed pages are `noindex` and left out of the sitemap.

- **Frontend only for now.** I will build the backend myself later. Until then, friends' uploads are saved on the device (IndexedDB), so they are **not shared between people yet**. All of that is isolated in one file (see "Backend contract").
- Most visitors use a **phone**, often on a slow connection. The site is an installable PWA and my own photos work offline after the first visit.

**Goals:**

- Personal and photo-first, modern and clean, not a corporate site.
- Sharing a moment takes under a minute.
- Adding a memory of mine = drop photos in `public/images/` + add one entry in `moments.ts`.

## Domain Glossary

Use these terms consistently in code, UI copy, and file names.

| Term              | Meaning                                                                               |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Moment**        | One of my memories (static): title, date, caption, optional location, 1+ photos       |
| **Milestone**     | A special moment (first day, first presentation, graduation) with a badge             |
| **Slide**         | One photo in the slideshow, carrying its moment's text                                |
| **Friend moment** | A memory shared by a friend: name, caption, 1–5 photos                                |
| **Wall**          | The Friends' wall, the page listing friend moments                                    |
| **Word**          | One English word I learned, with its Indonesian meaning and an example (a flash card) |
| **Class code**    | The shared secret a friend types before they can share                                |

## Data Models

```ts
// My moments (static, src/features/moments)
type Moment = {
  id: string
  title: string // short, WITHOUT a "Day N:" prefix (the Day number is computed from the date)
  date: string // YYYY-MM-DD
  caption: string
  location?: string
  photos: string[] // photos AND videos in public/images; the first photo is the cover
  milestone?: boolean
}

// Friends' moments (src/features/friends)
type FriendMoment = {
  id: string
  name: string // free text, no accounts
  caption: string
  photos: string[] // image URLs
  createdAt: string
}
```

## Features (feature folders)

```
src/features/
├── moments/   # my static story: home, detail, slideshow
├── practice/  # English practice: daily verbs, grammar, listening, sentence builder, daily mix
└── friends/   # friends' wall + class code + share form
```

`moments`, `practice` and `friends` do not import from each other (the home page's practice teaser is plain links, no import). Shared pieces (Lightbox, Reveal, ShareButton, Field, theme) live in `shared/`.

## Tech Stack

- **Build:** Vite + React 19 + TypeScript (strict)
- **Routing:** React Router v7 (data router, lazy routes)
- **Async state:** TanStack Query v5 (friends' wall and uploads)
- **Styling:** Tailwind CSS v4 (tokens and animations in `styles/index.css`)
- **Icons:** react-icons, Lucide set (`react-icons/lu`). Never use emoji or text glyphs (▶ ✕ ＋) as icons.
- **Dates:** date-fns
- **PWA:** vite-plugin-pwa (installable, offline, `/images/` cached)
- **Testing:** Vitest + React Testing Library + fake-indexeddb
- **Lint/format:** ESLint (flat config) + `eslint-plugin-boundaries` + Prettier
- **Package manager:** pnpm

No form library, no state library, no HTTP library: forms are small and use plain state. Do not add any without asking.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # type-check + production build
pnpm preview      # preview production build
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
pnpm format       # prettier --write
pnpm typecheck    # tsc -b
pnpm test         # vitest
pnpm test:run     # vitest run (CI)
pnpm images       # make light, right-sized copies of photos-src/ into public/images/ (run after adding photos)
pnpm brand        # redraw the icons and the share picture (public/favicon.svg, icons, og-image.png)
```

### Docker

```bash
docker build -t pare-moments --build-arg VITE_SITE_URL=https://your-domain.com .   # add --build-arg VITE_ENABLE_UPLOADS=true to open uploads   # type-check + bundle + nginx
docker run -d --name pare-moments -p 3305:3305 pare-moments   # then open http://localhost:3305
```

- Multi-stage `Dockerfile`: Node 22 + pnpm (pinned by `PNPM_VERSION`, keep it equal to the version that wrote `pnpm-lock.yaml`) builds `dist`, then `nginx:alpine` serves it on **port 3305** (`nginx.conf`, `EXPOSE`, healthcheck; ~120 MB image).
- `nginx.conf`: unknown paths fall back to `index.html` (SPA routes), `/assets/` cached 1 year (hashed names), `/images/` 7 days, `index.html` / `sw.js` / manifest never cached (so updates reach visitors), gzip on, video range requests work.
- `VITE_SITE_URL` (build argument, default `http://localhost:3305`, also in `.env`) is the public address used for the share preview, canonical links and the sitemap. Set the real one when you deploy.
- `nginx.conf` also sends a strict Content-Security-Policy (own files, Google Fonts, `data:`/`blob:` images only; no inline scripts), `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`. If you add a new outside service (fonts, analytics, a backend API), allow it in the CSP.
- Photos in `public/images/` are baked into the image, so rebuild after adding photos. `photos-src/` (the big originals) is not copied into the image.
- The service worker (PWA, offline) only works over **HTTPS** (or `localhost`): put the container behind a TLS proxy in production.
- There is no backend yet, so no other services. Add them (e.g. a `docker-compose.yml`) when the friends' upload API exists.

Before finishing any task, run `pnpm typecheck && pnpm lint && pnpm test:run` and fix all errors.

## Folder Structure

```
src/
├── app/                  # app-level wiring only
│   ├── router/           # route tree, lazy-loaded pages
│   ├── layouts/          # SiteLayout (header nav, mobile bottom nav, theme toggle, footer)
│   ├── App.tsx           # QueryClientProvider + router
│   └── main.tsx
├── features/
│   ├── moments/
│   │   ├── data/         # moments.ts: ALL my content
│   │   ├── components/   # Hero, Stat, Marquee, JourneyNav, Timeline, MomentCard, PhotoGallery, SlideshowViewer
│   │   ├── hooks/        # useSlideshow
│   │   ├── pages/        # HomePage, GalleryPage, MomentDetailPage, SlideshowPage
│   │   ├── utils/        # build-slides, group-by-month, days-between, format-date
│   │   ├── types/
│   │   ├── constants.ts  # all UI copy + SLIDE_MS
│   │   └── index.ts      # PUBLIC API
│   ├── practice/
│   │   ├── data/         # ALL practice content: verbs, sentences, listening (stories), grammar/<topic>.ts (+ topics.ts)
│   │   ├── utils/        # random (shuffle, seeded), slots (random names), draw + seen (no repeats), *-questions builders, blank (typed answers), pages, grade, progress, player
│   │   ├── hooks/        # useProgress, usePlayer
│   │   ├── components/   # QuizRunner, QuizSession, ResultSummary, NameGate, VersionPicker, AudioPlayer, StorySession, SentenceBuilder, VerbCard, VerbTable, Pagination, SpeakButton, PracticeHeader
│   │   ├── pages/        # PracticePage, VerbsPage, GrammarPage, ListeningPage, SentencePage, DailyPage
│   │   ├── types/, constants.ts (all copy, VERSIONS), test-helpers.tsx, index.ts
│   └── friends/
│       ├── api/          # friends-api.ts (THE backend seam) + query hooks + keys
│       ├── components/   # Steps, CodeGate, ShareForm, PhotoPicker, FriendMomentCard
│       ├── hooks/        # usePhotoQueue
│       ├── pages/        # FriendsPage, SharePage
│       ├── utils/        # upload-access (token in sessionStorage)
│       ├── types/
│       ├── constants.ts  # all UI copy + limits
│       └── index.ts      # PUBLIC API
├── shared/               # generic, business-agnostic code
│   ├── components/ui/    # button-styles, Field/Input/Textarea, Polaroid, ThemeToggle, Reveal, ShareButton, Confetti, ScrollProgress, BackToTop, SplashScreen
│   ├── components/media/ # LazyImage (srcset), Lightbox (portal + zoom), ZoomableImage
│   ├── config/           # site.ts (name, texts, address for SEO)
│   ├── hooks/            # useTheme, useCountUp, useSeo, useSpeech
│   └── lib/              # cn, images (+ image-manifest.json, generated), media, query-client, local-db, image-compress
├── styles/
└── test/                 # setup (fake IndexedDB), test utils
photos-src/               # my ORIGINAL photos and videos (big files; not shipped)
scripts/                  # optimize-images.mjs, make-brand-assets.mjs, seo-files.ts (build helpers)
public/images/            # light copies made by `pnpm images` (480/960/1600px WebP) + videos
public/                   # favicon, icons, og-image.png, boot.js
```

Only create subfolders a feature actually needs. Do not scaffold empty folders.

## Routes

```
/                       → hero (animated stats), ribbon, day-by-day timeline, filter (All / Milestones via ?filter=), "Surprise me", "Share yours" banner
/moments/:momentId      → photos (tap to open the Lightbox), Play from here, Share, previous/next day
/practice               → practice home: Daily mix, Daily verbs, Grammar, Listening, Sentence builder, greeting, streak and best scores
/practice/daily         → 5 quick questions, the same all day (seeded by the date)
/practice/verbs         → the 100 daily verbs: table (default) or flip cards (?mode=cards), 12 per page (paginated), or a 10-question quiz (?mode=quiz); search and Regular/Irregular filter, no versions
/practice/grammar       → pick a topic or Mixed (?topic=<id>), then a version (&v=v1|v2|v3), exercises with an explanation each
/practice/listening     → story listening in V1/V2/V3 (?v=): hear the story, 3 multiple-choice + 2 typed-blank questions
/practice/sentences     → sentence builder (one pool, no versions): tap shuffled words in order
/gallery                → every photo and video in one mosaic (?type=photos|videos), photos open in the Lightbox
/friends                → Friends' wall (while uploads are closed: the "coming soon" page)
/share                  → class code gate, then the share form, then a thank-you screen (while uploads are closed: the "coming soon" page)
/slideshow              → full-screen slideshow (?moment=<id> starts at that moment), no site layout
```

Navigation: floating top bar from `sm` (Moments, Gallery, Practice, Friends, Slideshow; icons only until `lg`, so five items fit on tablets, a Share button), light/dark toggle always in the top bar. On phones a floating dock at the bottom (Moments, Gallery, a raised Share button in the middle, Friends, Slideshow).

## Backend contract (friends)

`src/features/friends/api/friends-api.ts` is the **only** file that knows where friends' moments live. Today it uses IndexedDB. To plug in my real backend, replace the bodies and keep the signatures:

```
verifyCode(code)              POST /class-code/verify   { code }                    -> { token }
listFriendMoments()           GET  /friend-moments                                  -> FriendMoment[] (newest first)
createFriendMoment(m, token)  POST /friend-moments      multipart: name, caption, photos[]
                              header: Authorization: Bearer <token>                 -> FriendMoment
```

- Throw `InvalidCodeError` when the code or token is rejected (the UI then asks for the code again).
- **The backend must do the real checking:** class code, file type and size, rate limiting, moderation. The class-code screen in the app is only a doorway, never the lock. Never trust the browser.
- The on-device version uses the dev class code `PARE2026`. Do not ship that to production.
- Photos arrive already compressed by the browser, but the backend should still validate and re-process them.

## Photos

**The website never loads the big originals.** Phone photos are 4000px and 1–2 MB; showing them in small cards made scrolling janky (a phone-sized Gallery used to load 16.7 MB and decode 151 megapixels). Now every photo has right-sized copies, and the browser downloads only the one that fits (Gallery: 0.6 MB, home: 0.3 MB).

- **Adding my photos:** put the originals in `photos-src/` (any file name, no spaces; e.g. `day-3-1.jpeg`), then run `pnpm images`. It writes `day-3-1-480.webp`, `-960.webp` and `-1600.webp` into `public/images/`, removes private data such as GPS location, and records the sizes in `src/shared/lib/image-manifest.json` (commit these generated files). Then list `'/images/day-3-1.jpeg'` (the ORIGINAL file name) in `moments.ts`.
- **Videos** go in `photos-src/` too (`pnpm images` copies them as they are) and in the same `photos` list in `moments.ts` (`.mp4`, `.webm`, `.mov`, `.m4v`; the extension tells them apart, see `shared/lib/media.ts`). Use H.264 MP4, short clips, ideally under ~10 MB. The gallery plays them in place with controls, cards show a still frame with a play badge (only when the moment has no photo for a cover), and the slideshow plays them muted (with a sound button) and moves on when they end. Videos are not cached offline.
- **Always show photos through the helpers, never a bare `<img src>`:** `LazyImage` (cards, gallery, detail) and `imageSources()` / `imageUrl()` (hero, slideshow, viewer, splash) from `shared/lib/images.ts` give `srcset`, the real width/height (so the page does not jump while photos load) and `decoding="async"`. Pass a correct `sizes` (how wide the photo is on each screen) to `LazyImage`. Use `priority` only for a photo visible as soon as the page opens. A path that is not in the manifest (friends' photos, other websites) is shown as it is.
- **Friends' photos:** compressed in the browser before upload (`shared/lib/image-compress.ts`: max 1600px, ~0.8 quality, WebP with JPEG fallback). Re-encoding drops EXIF, including GPS location. Max 5 photos per friend moment.
- Local previews use `URL.createObjectURL` and are revoked when the form unmounts. A photo that fails to process stays in the list with a retry button.
- Every photo needs good `alt` text (`"<title>, photo 2 of 5"`, `"Photo 1 of 3 shared by <name>"`).
- Cards use `loading="lazy"` and a skeleton while loading. The slideshow shows the whole photo (`object-contain`; a blurred copy behind it only from `md` up). The service worker caches `/images/` photos after the first view.
- **Photo viewer (`Lightbox`):** attached to `<body>` with a portal, so no wrapper can push it off-center. Double tap / double click, pinch, the mouse wheel or the zoom button zoom in; drag moves a zoomed photo; swiping flips photos only when not zoomed. Download gets the largest copy.

## Performance (keep scrolling smooth on phones)

- **No `backdrop-blur` on anything that scrolls with the content** (header, dock, badges on every card): it re-blurs every frame. The header and dock are opaque on phones and frosted only from `sm`. Blur is fine on one-off overlays (viewer buttons).
- **No `content-visibility: auto` on the timeline:** estimated heights made the scroll position jump.
- **Scroll listeners:** read page size only when it changes (`ResizeObserver`), write at most once per frame (`requestAnimationFrame`), and write transforms straight to the element (`ScrollProgress`, `ZoomableImage`).
- **Never leave a transform, translate, rotate or scale on a wrapper that contains `position: fixed` UI.** Any such value, even `translate-y-0`, `scale(1)` or a finished animation with `both`/`forwards` fill, makes fixed children position against that wrapper instead of the screen. Use `backwards` fill for enter animations (`animate-page-in`, `animate-pop`) and `translate-none` for the shown state (`Reveal`). Fixed overlays (`Lightbox`, `Confetti`) are portaled to `<body>` anyway.
- Infinite animations are compositor-only (`transform`/`opacity`) and respect `motion-reduce`.
- To check: scroll a page on a phone-sized screen and compare the image MB / decoded megapixels (DevTools Network + Performance).

## SEO & best practices

- **Per-page meta:** every page calls `useSeo({ title, description, path, image?, noindex? })` (`shared/hooks/useSeo.ts`): title, description, canonical link, Open Graph and Twitter tags. Defaults come from `shared/config/site.ts` and must equal the ones in `index.html` (what crawlers without JavaScript see). Moment pages use their caption and cover photo. `/share` and the 404 page are `noindex`.
- **`index.html`:** description, canonical, Open Graph / Twitter (picture `og-image.png`, 1200×630), light and dark `theme-color`, `color-scheme`, JSON-LD `WebSite`, a `<noscript>` message, icons (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`). Addresses use `%VITE_SITE_URL%`.
- **Build output:** `sitemap.xml` (all pages, every moment with its photos as image entries) and `robots.txt` (blocks `/share`, links the sitemap) are generated by the `siteFiles` plugin in `vite.config.ts` from `moments.ts`.
- **PWA manifest:** id, lang, categories, icons (192, 512, maskable 512), shortcuts (Gallery, Slideshow, Share).
- **Accessibility:** "Skip to content" link, `<main>`/landmarks, labels, alt text, focus rings, reduced-motion support, `aria-current` on active chips and nav.
- **404:** unknown addresses show a friendly page (`app/router/NotFound.tsx`).
- **Known limit:** this is a client-rendered app, so crawlers that do not run JavaScript only see `index.html` (plus the `<noscript>` text). Google runs JavaScript; for other crawlers a pre-rendering step could be added later.
- `boot.js` (theme + splash) is an external file so the Content-Security-Policy can forbid inline scripts.

## Slideshow

- Autoplay every `SLIDE_MS` (5s, keep in sync with `--animate-progress` in `styles/index.css`), loops at the end.
- Controls: previous / next, play / pause, full screen, close. Keyboard: ← → Space Esc. Touch: swipe.
- Soft crossfade and a slow zoom (`motion-safe` only). Preloads the next photo.

## Design Direction

- Feel: **modern, playful and fun**, photo-first. Think scrapbook: polaroid frames with tape, slight tilts that straighten on hover, sticker-like badges, bold rounded headings. **Flat solid colors, no gradients.**
- **Colors come from tokens in `styles/index.css`; never hard-code colors in components.**
  - `primary` (teal): main actions, links, active states, accents. `primary-deep`: its pressed edge. `primary-soft`: light tint.
  - `secondary` (amber): highlights, day markers, milestone stickers, the second call to action. `secondary-deep`, `secondary-soft` likewise.
  - `on-primary` / `on-secondary`: text on those colors.
  - `bg`, `surface`, `fg`, `muted`, `line`: page, cards, text, secondary text, borders.
  - Error text uses Tailwind `red-600` / `dark:red-400` (no token yet).
- **Light and dark mode:** the toggle sets `data-theme` on `<html>` and remembers the choice; an inline script in `index.html` applies it before first paint; without a saved choice it follows the system. Both palettes are in `styles/index.css`. All toggles on screen stay in sync (`useTheme` reads the page, not its own state).
- **Fonts:** Fredoka (`font-display`) for headings and numbers, Plus Jakarta Sans for text. System fallbacks.
- **Buttons** use `buttonStyles()`: chunky pills with a darker bottom edge that squashes when pressed.
- **Navigation:** floating pill bar on top from `sm` (Moments, Friends, Slideshow, theme toggle, a Share button). On phones a floating dock at the bottom with a raised Share button in the middle. A thin scroll-progress bar at the very top.
- **Opening screen (`SplashScreen`):** plays on **every load** (first open and reload), not on in-app navigation. The camera icon pops in, a flash goes off, three polaroids fly in, and a **real progress bar** follows the fonts and the home page's first photos actually loading (`images` prop; keep `splashImages` in `app/App.tsx` equal to the photos the hero shows first), with messages that change along the way. It never closes sooner than 2.2 s or later than 5 s, then leaves softly: the logo, title and photos float up and fade first, then the backdrop fades while the page fades in underneath (`data-splash="exit"` on `<html>`, opacity only). Tap or any key skips it; it is left out for `prefers-reduced-motion`. It is responsive (smaller icon and polaroids on phones, the third polaroid only from `sm`). `index.html` marks `<html data-splash="pending">` so the page is covered in the primary color until the splash mounts.
- **Timeline:** left-aligned on every screen size. The "Day N" marker sits on the line to the left of its own card; from `md` the card is horizontal (photo beside the text).
- **Day chips (`JourneyNav`):** a sticky strip of Day 1…7 chips above the timeline; the day being read lights up and tapping a chip scrolls to it (the strip scrolls sideways on phones).
- **Page transitions:** each page fades and slides in on navigation (keyed by path) and starts at the top. A round back-to-top button appears after scrolling. The Lightbox has a download button.
- **Fun touches:** day-by-day timeline with Day markers, scrolling ribbon of day titles, count-up stats, "Surprise me" random moment, floating polaroids in the hero, confetti after sharing, drag-and-drop photos. Keep all motion behind `motion-reduce` / `motion-safe`. The hero's polaroid stack puts the first day's photo in the middle and in front.
- Milestone moments get a round secondary-colored sticker.

## English practice

All content is static and lives in `src/features/practice/data/`; edit it freely. Tests check the rules below (run `pnpm test:run` after editing).

**Grammar and listening come in three versions** (`VERSIONS` in `constants.ts`): V1 Basic, V2 Intermediate, V3 Challenge. Verbs, the sentence builder and the daily mix have one version. Each version has its own questions, and every round is a new mix, so questions do not repeat:

- A version holds **more questions than a round needs** (e.g. 8 for a round of 6; tenses: 21 for a round of 14). A round draws from the pool, and **questions not asked yet come first** (`utils/draw.ts` + `utils/seen.ts`: how many times each question was asked, in `localStorage` `pare-moments:practice-seen`).
- **Choices are shuffled** every time, and **random names** fill `{name}` (any), `{f}` (a girl's, use with she/her) and `{m}` (a boy's, use with he/him) (`utils/slots.ts`). One name per question; never mix `{name}` with pronouns.
- Retrying a round (`Try again`) builds a new draw; Daily mix is seeded by the date (same all day).

**Name before a test** (`NameGate`): every test first suggests entering a name ("We use it to cheer you on"; kept on this device only). It can be skipped ("Skip for now" lasts for the visit). The name greets the visitor on the practice home (with "Not you? Change name") and in good results.

**Content and its rules**

- **Daily verbs (`verbs.ts`):** 100 rows `[V1, V2, V3, meaning (Indonesian), V1 sentence, V2 sentence, V3 sentence]`; a verb is regular when V2 ends in -ed. Each sentence must contain its form exactly (it becomes the fill-in question); every V1 and every meaning is unique (tests check it). The quiz (`utils/verb-questions.ts`) takes 10 verbs per round, **verbs not asked yet first**, so about ten rounds pass before a verb returns, and mixes five kinds in a new order each round: V2, V3, a sentence that needs V2, one that needs V3, and which verb has this meaning. Wrong choices for the sentence kinds are only look-alikes of the SAME verb (base, -s, -ing, "goed"), never other verbs. The table and cards share a search box, a filter and pagination (`VERBS_PER_PAGE`, `components/Pagination.tsx`).
- **Grammar (`data/grammar/<topic>.ts`, helper `q(sentence, options, answer, explanation, group?)`):** topics Tenses, Question words, Passive voice, How much/many/long/far…, Modal verbs, Prepositions, plus a Mixed round (all topics and versions). **Each question must have exactly ONE clearly right answer**: leave out any option that could also be correct (for example when testing "since", do not offer the simple past if it would also fit). Explanations are short, simple English, and for tenses start with the tense's name. **Tenses** cover the seven basic tenses (simple present, present continuous, simple past, simple future, present perfect, present perfect continuous, past perfect) with 3 questions per tense in each version (the `group` field) and 2 of each per round (14 questions).
- **Listening (`listening.ts`):** per version two stories, each with 5 multiple-choice (`choice` or `var`) and 3 typed-blank questions; a round reads one story aloud (browser `useSpeech`, text hidden until the end), then asks 3 choice + 2 blank questions (`utils/listening-questions.ts`, story chosen by least seen). For a blank, `sentence` with `answer` put back must appear word for word in the story (a test checks it) and the answer is ONE word. Typed answers (`utils/blank.ts`) ignore capitals and punctuation. Where the browser cannot read aloud, the page says which browsers to use.
- **Sentence builder (`sentences.ts`):** `{ english, indonesian }`, one pool of twelve, five per round.
- **Daily mix:** 3 verb + 2 grammar questions.
- **Made fresh every round (templates):** about half of every grammar round is generated, not written. `utils/grammar-generators.ts` and `utils/tense-generators.ts` combine word lists (`data/grammar/generator-data.ts`: activities, subjects, time markers, places, collocations, how-pairs, question-word pairs, passive things) into new questions, so the same grammar point returns with other words, names and choices. Covered: all seven tenses (one generated question per tense, V1 uses I/you/we/they, V2 third person and plural nouns, V3 all), question words, passive voice, how-questions, prepositions; modals are written by hand. **Rules for a template:** any combination of its lists must read naturally and have ONE right answer, and wrong choices must be clearly wrong (never offer a neighbouring tense that could also fit, for example no "have studied" next to "have been studying"). The verb forms come from `verbs.ts`; the tests build thousands of questions and check them (4 different choices, a blank, no leftover braces).
- **Stories change too:** a story has `vars` (e.g. `transport: ['bike', 'bus', …]`); `{transport}` in its text, questions and blanks becomes a new value each round, and a `var` question asks about it with four of the values as choices (so a list needs 4+ values; a value used in a blank is one word; tests check every telling).
- **Variety is limited by the size of each pool** (verbs 100, written grammar questions 8 per topic version plus the templates, 2 stories per version with changing details, sentences 12). Grow the word lists and templates first: one new activity or story adds many new questions.

**Progress** (`utils/progress.ts`): best percent per test (`verbs`, `grammar:<topic>:<version>`, `grammar:mixed`, `listening:v1`, `sentences`, `daily`), attempts and a day streak in `localStorage` (`pare-moments:practice`), on this device only. Damaged data starts fresh.

**Quiz UX:** one question at a time, keys 1–4 answer, instant feedback with the right answer and an explanation, "Listen" after answering (hidden where speech is unsupported), a result with 0–3 stars and every mistake explained (focus moves to the result title), and fireworks (`shared/components/ui/Fireworks.tsx`, hidden for `motion-reduce`) on every result. `Random` is injectable (`utils/random.ts`) so builders are tested with a fixed seed. No new libraries: speech uses the browser's own `speechSynthesis`.

## Layers (z-index scale)

Content and decorations stay at `z-10` or below. Sticky Day chips and the back-to-top button are `z-20`. The header and the phone dock are `z-30`. The photo viewer and confetti are `z-40`, the scroll bar `z-50`, the skip link `z-60`, the opening screen `z-100`. Never put a sticky or fixed bar at the same level as the content it floats over: a later `z-10` marker would paint on top of an earlier `z-10` bar.

## Writing style (keep every text consistent)

- **Captions in `moments.ts`:** one or two short sentences in simple past tense, first person (I / we), ending with a full stop. No serial (Oxford) comma, no exclamation marks. Titles are short noun phrases in sentence case, with no "Day N:" prefix; the Day label is shown separately (marker, chip, slideshow label, page title).
- **UI copy:** warm and short, around B1 level. Straight apostrophes (`'`) in code strings, and the real ellipsis character `…` (not three dots) for "loading" texts. Buttons say what they do (`Share yours`, `Play slideshow`, `Back to the moments`). Keep strings in `constants.ts`, and delete keys that are no longer used.
- **Consistent names:** "moment", "Day", "Friends' wall", "Gallery", "Slideshow".

## Responsive

- Mobile first. 1 column on phones, 2 from `sm`, 3 from `lg`; content max width `max-w-6xl`.
- Hero: text only on phones, text + floating polaroids from `sm`.
- Timeline: one column with the line on the left on phones; from `md` the line is centered and cards alternate left and right.
- Detail page: masonry photos, sticky info panel beside them from `lg`.
- Friends' wall: CSS columns masonry (1 / 2 / 3).
- Slideshow: caption and controls stack on phones, side by side from `md`.
- Tap targets ≥ 44px. Test at 360px, 768px and 1280px wide.

## Architecture Rules (MUST follow)

1. **Import direction is one-way:** `app → features → shared`.
   - `shared` NEVER imports from `features` or `app`.
   - `features` NEVER import from `app`.
2. **No deep cross-feature imports.** Import other features only through their `index.ts`. Inside a feature, use relative imports. (Enforced by ESLint boundaries.)
3. **Colocation first.** Move code to `shared/` only once it is used by 2+ features AND contains no business logic.
4. **Always use the `@/` alias** for imports outside the current feature.
5. **Pages stay thin.** Pages compose feature components and hooks; logic lives in hooks/components/utils.
6. **Data access goes through `api/`.** Components never call storage or the network directly.

## UI Copy & Language

- **The UI is in English** (it's part of practicing English). Short, simple sentences, around B1 level. Friendly, warm tone.
- Captions in `moments.ts` are mine, in any language I choose.
- Dates use the `en` locale (`"Mon, 21 Oct 2026"`).
- Keep all UI strings in the feature's `constants.ts`. Page titles and descriptions for SEO are written next to the `useSeo` call.

## Code Conventions

- **TypeScript strict.** No `any`; use `unknown` + narrowing.
- **Components:** function declarations, named exports only.
- **Naming:** components `PascalCase.tsx`; hooks `useCamelCase.ts`; others `kebab-case.ts`; folders `kebab-case`.
- **Props:** `type MomentCardProps = {...}` right above the component.
- **Styling:** Tailwind + `cn()`. No inline style objects.
- **Fixed overlays and transforms, blur on scrolling areas, photo helpers:** see "Performance" and "Photos" above.
- **Accessibility:** alt text on photos, labels on fields, `role="alert"` on errors, dialogs get `role="dialog"` and Escape to close.
- Keep files under ~200 lines; split when larger.
- No `console.log` in committed code.

## Testing

- Tests live next to the code.
- Test behavior from the visitor's perspective (queries by role/label).
- Storage is real code on top of `fake-indexeddb` (fresh database per test). Mock only `@/shared/lib/image-compress` where compression is not the subject.
- Tests read the real `moments.ts`, so they use the data itself instead of hard-coded captions.
- Practice: data rules for every bank (one right answer per question, no duplicates, names match pronouns, three questions per tense, verb forms inside their sentences, blanks that come from the story), the builders (round sizes, no repeats, versions apart, names filled), typed-answer checking, drawing and seen counts, name gate, version picker, audio player, quiz runner (feedback, keys, result, review, typed blanks), story session, sentence builder, verb table and cards, progress and streak, and every practice page.
- Must-have tests: slideshow behavior; gallery filter and order; detail not-found and previous/next; class-code gate (right, wrong, empty); share form validation and success; photo queue (limit, retry, remove); wall empty state and list; Lightbox; theme toggle; `friendsApi` rejects bad tokens.

## Adding a New Feature (checklist)

1. Create `src/features/<name>/` with only the subfolders needed.
2. Put data access in `api/`, then components, then the page.
3. Export the public surface from `index.ts`.
4. Register the lazy route in `src/app/router/` and add it to the navigation if needed.
5. Add tests.
6. Run typecheck, lint, tests.

## Do NOT

- Add login or accounts, or let visitors edit or delete moments, without being asked.
- Trust the class code check in the browser. The backend is the lock.
- Add new dependencies without asking first.
- Open friends' uploads (`VITE_ENABLE_UPLOADS=true`) before the backend exists: photos would only stay on the visitor's own device.
- Hard-code colors or my memories in components; content goes in `data/moments.ts` (and verbs in `practice/data/verbs.ts`).
- Put the big original photos in `public/` (they would be shipped to every visitor); originals live in `photos-src/`.
- Show a photo with a bare `<img src>` or a huge file; use `LazyImage` / `imageSources()`.
- Add `backdrop-blur` to things that scroll with the page.
- Put business logic in `shared/`.
- Disable ESLint rules (especially boundaries) to make an import work; fix the architecture instead.
- Create barrel files (`index.ts`) anywhere except feature roots.
- Use gradients, emoji or text glyphs as icons, corporate/dashboard-style UI or lorem ipsum; write real, warm English copy.
