import type { Moment } from '../types/moment'

/**
 * All the memories live here. To add one:
 *  1. Put the original photos (and videos) in `photos-src/`, then run `pnpm images`.
 *     It makes light, right-sized copies in `public/images/` for phones.
 *  2. Add an entry below (order doesn't matter, they are sorted by date).
 * Use the original file name, e.g. '/images/day-1-1.jpeg'. Videos go in the same `photos` list
 * (.mp4, .webm, .mov). The first photo is the cover.
 */
const entries: Moment[] = [
  {
    id: 'day-1',
    title: 'First day in Pare',
    date: '2026-10-05',
    caption:
      'A new town, new faces and a big group photo in front of our house. I was nervous, but it felt good to start.',
    photos: ['/images/day-1-1.jpeg', '/images/day-1-2.jpeg'],
    milestone: true,
  },
  {
    id: 'day-2',
    title: 'Studying outside',
    date: '2026-10-06',
    caption:
      'Notebooks open, pens ready and a lot of smiles. We studied in the open air with the whiteboard right behind us.',
    photos: ['/images/day-2-1.jpeg', '/images/day-2-2.jpeg'],
  },
  {
    id: 'day-3',
    title: 'Study, lunch and a night session',
    date: '2026-10-07',
    caption:
      'Practice, snacks and lunch with the whole group. Later we studied again under the night sky.',
    photos: ['/images/day-3-1.jpeg', '/images/day-3-2.jpeg'],
  },
  {
    id: 'day-4',
    title: 'Evening by the corn field',
    date: '2026-10-08',
    caption:
      'We sat by the corn field in the afternoon light with our papers and our peace signs. A friend told us a story, so press play on the video.',
    photos: ['/images/day-4-1.jpeg', '/images/day-4-2.mp4'],
  },
  {
    id: 'day-5',
    title: 'Class on the grass',
    date: '2026-10-09',
    caption:
      'A lesson on the grass, silly poses by the fountain and a quiet smile between two classes.',
    photos: ['/images/day-5-1.jpeg', '/images/day-5-2.jpeg', '/images/day-5-3.jpeg'],
  },
  {
    id: 'day-6',
    title: 'Group photo, again',
    date: '2026-10-10',
    caption:
      'Everyone was back in front of the house with peace signs up. By now we felt like a real team.',
    photos: ['/images/day-6-1.jpeg', '/images/day-6-2.jpeg'],
  },
  {
    id: 'day-7',
    title: 'Public speaking night',
    date: '2026-10-11',
    caption:
      'Weekly Public Speaking night with a big banner, a certificate and a lot of cheering. We had dinner together afterwards and took one last selfie.',
    photos: ['/images/day-7-1.jpeg', '/images/day-7-2.jpeg', '/images/day-7-3.jpeg'],
    milestone: true,
  },
]

// Oldest first, so the story reads from the first day to the last.
export const moments: Moment[] = [...entries].sort((a, b) => a.date.localeCompare(b.date))

export const getMoment = (id: string) => moments.find((moment) => moment.id === id)

// The first day of the whole story: "Day 1" is counted from here.
export const firstDate = moments[0]?.date ?? ''
