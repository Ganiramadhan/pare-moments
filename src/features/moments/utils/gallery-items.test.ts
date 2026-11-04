import type { Moment } from '../types/moment'
import { filterGalleryItems, galleryItems, parseGalleryFilter } from './gallery-items'

const moments: Moment[] = [
  { id: 'a', title: 'A', date: '2026-10-05', caption: '', photos: ['/1.jpeg', '/2.jpeg'] },
  { id: 'b', title: 'B', date: '2026-10-06', caption: '', photos: ['/clip.mp4'] },
]

describe('gallery items', () => {
  it('lists every photo and video in story order, with its place in its moment', () => {
    const items = galleryItems(moments)

    expect(items.map((i) => i.src)).toEqual(['/1.jpeg', '/2.jpeg', '/clip.mp4'])
    expect(items[1]).toMatchObject({ momentId: 'a', number: 2, total: 2, isVideo: false })
    expect(items[2]).toMatchObject({ momentId: 'b', isVideo: true })
  })

  it('filters photos and videos', () => {
    const items = galleryItems(moments)

    expect(filterGalleryItems(items, 'photos')).toHaveLength(2)
    expect(filterGalleryItems(items, 'videos')).toHaveLength(1)
    expect(filterGalleryItems(items, 'all')).toHaveLength(3)
  })

  it('falls back to everything for an unknown filter', () => {
    expect(parseGalleryFilter('videos')).toBe('videos')
    expect(parseGalleryFilter('nonsense')).toBe('all')
    expect(parseGalleryFilter(null)).toBe('all')
  })
})
