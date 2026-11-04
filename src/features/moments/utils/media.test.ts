import type { Moment } from '../types/moment'
import { countMedia, coverSource } from './media'

const moment = (photos: string[]): Moment => ({
  id: 'm',
  title: 'T',
  date: '2026-10-05',
  caption: '',
  photos,
})

describe('media utils', () => {
  it('uses the first photo as the cover, even when a video comes first', () => {
    expect(coverSource(moment(['/a.mp4', '/b.jpeg']))).toBe('/b.jpeg')
  })

  it('falls back to the first video when there are no photos', () => {
    expect(coverSource(moment(['/a.mp4']))).toBe('/a.mp4')
  })

  it('counts photos and videos separately', () => {
    expect(countMedia([moment(['/a.jpeg', '/b.mp4']), moment(['/c.jpeg'])])).toEqual({
      photos: 2,
      videos: 1,
    })
  })
})
