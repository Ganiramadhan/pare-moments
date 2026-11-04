import { render, screen } from '@testing-library/react'
import { LazyImage } from './LazyImage'

describe('LazyImage', () => {
  it('shows a photo with its alt text', () => {
    render(<LazyImage src="/a.jpeg" alt="Friends at the camp" />)

    expect(screen.getByRole('img', { name: 'Friends at the camp' })).toHaveAttribute(
      'src',
      '/a.jpeg',
    )
  })

  it('shows a video as a still frame with a play badge, not as an image', () => {
    const { container } = render(<LazyImage src="/clip.mp4" alt="Story time, video" />)

    const video = container.querySelector('video')!
    expect(video).toHaveAttribute('src', '/clip.mp4#t=0.1')
    expect(video).toHaveAttribute('aria-label', 'Story time, video')
    expect(video).toHaveProperty('muted', true)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('downloads a size that fits the screen and keeps its place before it loads', () => {
    render(
      <LazyImage
        src="/images/day-1-2.jpeg"
        alt="Group"
        natural
        sizes="(min-width: 768px) 480px, 90vw"
      />,
    )

    const img = screen.getByRole('img', { name: 'Group' })
    expect(img.getAttribute('srcset')).toMatch(/480w.*960w.*1600w/)
    expect(img).toHaveAttribute('sizes', '(min-width: 768px) 480px, 90vw')
    expect(img).toHaveAttribute('width')
    expect(img).toHaveAttribute('height')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('loads right away, and first, when the photo is on screen from the start', () => {
    render(<LazyImage src="/images/day-1-2.jpeg" alt="Group" priority />)

    const img = screen.getByRole('img', { name: 'Group' })
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })
})
