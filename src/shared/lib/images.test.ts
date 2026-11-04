import { imageSources, imageUrl } from './images'

describe('images', () => {
  it('describes a known photo with its sizes and its real shape', () => {
    const photo = imageSources('/images/day-1-2.jpeg')

    expect(photo.srcSet).toMatch(/480w/)
    expect(photo.srcSet).toMatch(/1600w/)
    expect(photo.src).toMatch(/-1600\.webp$/)
    expect(photo.width).toBeGreaterThan(0)
    expect(photo.height).toBeGreaterThan(0)
  })

  it("leaves anything unknown untouched (friends' photos, other websites)", () => {
    expect(imageSources('data:image/webp;base64,AAA')).toEqual({
      src: 'data:image/webp;base64,AAA',
    })
    expect(imageSources('https://example.com/a.jpg')).toEqual({ src: 'https://example.com/a.jpg' })
  })

  it('picks the smallest size that is big enough', () => {
    expect(imageUrl('/images/day-1-2.jpeg', 400)).toMatch(/-480\.webp$/)
    expect(imageUrl('/images/day-1-2.jpeg', 700)).toMatch(/-960\.webp$/)
    expect(imageUrl('/images/day-1-2.jpeg', 99999)).toMatch(/-1600\.webp$/)
    expect(imageUrl('/elsewhere.jpg', 480)).toBe('/elsewhere.jpg')
  })
})
