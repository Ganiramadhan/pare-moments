import { useMemo } from 'react'
import { useSeo } from '@/shared/hooks/useSeo'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { SlideshowViewer } from '../components/SlideshowViewer'
import { moments } from '../data/moments'
import { buildSlides } from '../utils/build-slides'

export function SlideshowPage() {
  useSeo({
    title: 'Slideshow',
    description: 'Watch the English journey in Kampung Inggris, Pare, as a full-screen slideshow.',
    path: '/slideshow',
  })
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const slides = useMemo(() => buildSlides(moments), [])

  if (slides.length === 0) return <Navigate to="/" replace />

  // "Play from here" starts at the first photo of that moment.
  const startIndex = Math.max(
    0,
    slides.findIndex((s) => s.momentId === params.get('moment')),
  )

  return <SlideshowViewer slides={slides} startIndex={startIndex} onClose={() => navigate('/')} />
}
