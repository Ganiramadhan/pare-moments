import { createBrowserRouter } from 'react-router'
import { NotFound } from '@/app/router/NotFound'
import { SiteLayout } from '@/app/layouts/SiteLayout'

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/features/moments')).HomePage }),
      },
      {
        path: '/gallery',
        lazy: async () => ({ Component: (await import('@/features/moments')).GalleryPage }),
      },
      {
        path: '/friends',
        lazy: async () => ({ Component: (await import('@/features/friends')).FriendsPage }),
      },
      {
        path: '/share',
        lazy: async () => ({ Component: (await import('@/features/friends')).SharePage }),
      },
      {
        path: '/moments/:momentId',
        lazy: async () => ({ Component: (await import('@/features/moments')).MomentDetailPage }),
      },
      {
        path: '/practice',
        lazy: async () => ({ Component: (await import('@/features/practice')).PracticePage }),
      },
      {
        path: '/practice/verbs',
        lazy: async () => ({ Component: (await import('@/features/practice')).VerbsPage }),
      },
      {
        path: '/practice/grammar',
        lazy: async () => ({ Component: (await import('@/features/practice')).GrammarPage }),
      },
      {
        path: '/practice/listening',
        lazy: async () => ({ Component: (await import('@/features/practice')).ListeningPage }),
      },
      {
        path: '/practice/sentences',
        lazy: async () => ({ Component: (await import('@/features/practice')).SentencePage }),
      },
      {
        path: '/practice/daily',
        lazy: async () => ({ Component: (await import('@/features/practice')).DailyPage }),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    // Full screen, so it lives outside the site layout.
    path: '/slideshow',
    lazy: async () => ({ Component: (await import('@/features/moments')).SlideshowPage }),
  },
])
