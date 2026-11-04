import { buildRobots, buildSitemap } from './seo-files'

const options = {
  siteUrl: 'https://pare.example.com',
  today: '2026-10-22',
  photoUrl: (photo: string) => photo.replace('.jpeg', '-1600.webp'),
  moments: [
    {
      id: 'day-1',
      date: '2026-10-05',
      title: 'Day 1',
      photos: ['/images/a.jpeg', '/images/b.mp4'],
    },
    { id: 'day-2', date: '2026-10-06', title: 'Day 2 & more', photos: ['/images/c.jpeg'] },
  ],
}

describe('buildSitemap', () => {
  const xml = buildSitemap(options)

  it('lists the main pages and every moment with full addresses', () => {
    expect(xml).toContain('<loc>https://pare.example.com/</loc>')
    expect(xml).toContain('<loc>https://pare.example.com/gallery</loc>')
    expect(xml).toContain('<loc>https://pare.example.com/practice</loc>')
    expect(xml).toContain('<loc>https://pare.example.com/practice/grammar</loc>')
    expect(xml).toContain('<loc>https://pare.example.com/moments/day-1</loc>')
    expect(xml).toContain('<loc>https://pare.example.com/moments/day-2</loc>')
  })

  it('uses the day of the moment as its last change', () => {
    expect(xml).toMatch(/moments\/day-1<\/loc>\s*<lastmod>2026-10-05</)
  })

  it('adds the photos of each moment but not its videos', () => {
    expect(xml).toContain('<image:loc>https://pare.example.com/images/a-1600.webp</image:loc>')
    expect(xml).not.toContain('b.mp4')
  })

  it('leaves the share page out', () => {
    expect(xml).not.toContain('/share')
  })

  it('lists the Friends wall only while it is open', () => {
    expect(xml).toContain('/friends')
    expect(buildSitemap({ ...options, includeFriends: false })).not.toContain('/friends')
  })
})

describe('buildRobots', () => {
  it('allows crawling, hides the share page and points to the sitemap', () => {
    const robots = buildRobots('https://pare.example.com')

    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Disallow: /share')
    expect(robots).toContain('Sitemap: https://pare.example.com/sitemap.xml')
  })
})
