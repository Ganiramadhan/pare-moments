import { renderHook } from '@testing-library/react'
import { site } from '@/shared/config/site'
import { useSeo } from './useSeo'

const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute('content')

describe('useSeo', () => {
  it('gives the page its own title, description, address and share picture', () => {
    renderHook(() =>
      useSeo({
        title: 'Gallery',
        description: 'All the photos.',
        path: '/gallery',
        image: '/x.webp',
      }),
    )

    expect(document.title).toBe('Gallery · Pare Moments')
    expect(meta('meta[name="description"]')).toBe('All the photos.')
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${site.url}/gallery`,
    )
    expect(meta('meta[property="og:title"]')).toBe('Gallery · Pare Moments')
    expect(meta('meta[property="og:image"]')).toBe(`${site.url}/x.webp`)
    expect(meta('meta[name="twitter:description"]')).toBe('All the photos.')
    expect(meta('meta[name="robots"]')).toMatch(/^index/)
  })

  it('can keep a page out of search results', () => {
    renderHook(() => useSeo({ title: 'Not found', path: '/nope', noindex: true }))

    expect(meta('meta[name="robots"]')).toBe('noindex, follow')
  })

  it('brings the website defaults back when the page goes away', () => {
    const { unmount } = renderHook(() => useSeo({ title: 'Gallery', path: '/gallery' }))

    unmount()

    expect(document.title).toBe(site.title)
    expect(meta('meta[name="description"]')).toBe(site.description)
    expect(meta('meta[name="robots"]')).toMatch(/^index/)
  })

  it('uses a full address for the share picture when one is given', () => {
    renderHook(() => useSeo({ path: '/', image: 'https://cdn.example.com/a.jpg' }))

    expect(meta('meta[property="og:image"]')).toBe('https://cdn.example.com/a.jpg')
  })
})
