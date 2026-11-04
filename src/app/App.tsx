import { QueryClientProvider } from '@tanstack/react-query'
import { LuCamera } from 'react-icons/lu'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { SplashScreen } from '@/shared/components/ui/SplashScreen'
import { imageUrl } from '@/shared/lib/images'
import { queryClient } from '@/shared/lib/query-client'

// The photos the home page shows first, so the splash also warms them up.
const splashImages = ['/images/day-1-1.jpeg', '/images/day-2-1.jpeg', '/images/day-3-1.jpeg'].map(
  (src) => imageUrl(src, 480),
)

const splashMessages = [
  'Packing the photos…',
  'Dusting off the polaroids…',
  'Almost there…',
  'Ready!',
]

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <SplashScreen
        title="Pare Moments"
        tagline="Kampung Inggris, Pare"
        icon={<LuCamera aria-hidden />}
        images={splashImages}
        messages={splashMessages}
      />
    </QueryClientProvider>
  )
}
