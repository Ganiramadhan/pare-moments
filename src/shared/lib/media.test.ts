import { isVideoSource } from './media'

describe('isVideoSource', () => {
  it('recognizes common video files', () => {
    expect(isVideoSource('/images/day-17-story.mp4')).toBe(true)
    expect(isVideoSource('/images/clip.WEBM')).toBe(true)
    expect(isVideoSource('/images/clip.mov?v=2')).toBe(true)
  })

  it('treats everything else as a photo', () => {
    expect(isVideoSource('/images/day-1.jpeg')).toBe(false)
    expect(isVideoSource('https://example.com/photo.png')).toBe(false)
    expect(isVideoSource('/images/mp4-notes.jpeg')).toBe(false)
  })
})
