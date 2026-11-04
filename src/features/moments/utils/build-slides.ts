import type { Moment, Slide } from '../types/moment'
import { dayNumber, firstDateOf } from './days-between'

// One slide per photo, in story order, each carrying its moment's text.
export const buildSlides = (moments: Moment[]): Slide[] => {
  const first = firstDateOf(moments)

  return moments.flatMap((moment) =>
    moment.photos.map((src) => ({
      src,
      day: dayNumber(moment.date, first),
      momentId: moment.id,
      title: moment.title,
      caption: moment.caption,
      date: moment.date,
      location: moment.location,
    })),
  )
}
