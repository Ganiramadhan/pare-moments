import { isVideoSource } from '@/shared/lib/media'
import type { Moment } from '../types/moment'
import { dayNumber, firstDateOf } from './days-between'

export type GalleryItem = {
  src: string
  momentId: string
  title: string
  day: number
  isVideo: boolean
  // Place of this photo inside its own moment (1-based), for alt text.
  number: number
  total: number
}

export type GalleryFilter = 'all' | 'photos' | 'videos'

// Every photo and video of every moment, in story order.
export const galleryItems = (moments: Moment[]): GalleryItem[] => {
  const first = firstDateOf(moments)

  return moments.flatMap((moment) =>
    moment.photos.map((src, index) => ({
      src,
      momentId: moment.id,
      title: moment.title,
      day: dayNumber(moment.date, first),
      isVideo: isVideoSource(src),
      number: index + 1,
      total: moment.photos.length,
    })),
  )
}

export const filterGalleryItems = (items: GalleryItem[], filter: GalleryFilter) =>
  filter === 'all' ? items : items.filter((item) => item.isVideo === (filter === 'videos'))

export const parseGalleryFilter = (value: string | null): GalleryFilter =>
  value === 'photos' || value === 'videos' ? value : 'all'
