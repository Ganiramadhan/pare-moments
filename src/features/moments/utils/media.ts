import { isVideoSource } from '@/shared/lib/media'
import type { Moment } from '../types/moment'

// The cover is the first photo; a moment with only videos uses its first video.
export const coverSource = (moment: Moment) =>
  moment.photos.find((src) => !isVideoSource(src)) ?? moment.photos[0]

export const countMedia = (moments: Moment[]) => {
  const all = moments.flatMap((moment) => moment.photos)
  const videos = all.filter(isVideoSource).length
  return { photos: all.length - videos, videos }
}
