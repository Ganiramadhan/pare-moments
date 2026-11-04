import type { Moment } from '../types/moment'
import { buildSlides } from './build-slides'

const moment = (id: string, photos: string[]): Moment => ({
  id,
  title: `Title ${id}`,
  date: '2026-10-05',
  caption: `Caption ${id}`,
  photos,
})

describe('buildSlides', () => {
  it('makes one slide per photo, carrying the moment text', () => {
    const slides = buildSlides([moment('a', ['/1.jpg', '/2.jpg']), moment('b', ['/3.jpg'])])

    expect(slides.map((s) => s.src)).toEqual(['/1.jpg', '/2.jpg', '/3.jpg'])
    expect(slides[1]).toMatchObject({ momentId: 'a', title: 'Title a', caption: 'Caption a' })
    expect(slides[2]?.momentId).toBe('b')
  })

  it('returns nothing when there are no moments', () => {
    expect(buildSlides([])).toEqual([])
  })
})
