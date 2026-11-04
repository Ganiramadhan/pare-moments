import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SLIDE_MS } from '../constants'
import type { Slide } from '../types/moment'
import { SlideshowViewer } from './SlideshowViewer'

const slide = (src: string, title: string): Slide => ({
  src,
  momentId: title,
  title,
  day: 1,
  caption: `${title} caption`,
  date: '2026-10-21',
})

const slides = [slide('/a.jpeg', 'First'), slide('/clip.mp4', 'Clip'), slide('/c.jpeg', 'Third')]

const getVideo = (container: HTMLElement) => container.querySelector('video')!

describe('SlideshowViewer with a video', () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause')

  beforeEach(() => {
    play.mockResolvedValue(undefined)
    pause.mockImplementation(() => {})
  })
  afterEach(() => {
    play.mockReset()
    pause.mockReset()
    vi.useRealTimers()
  })

  it('stays on the video until it ends, then moves on', () => {
    vi.useFakeTimers()
    const { container } = render(
      <SlideshowViewer slides={slides} startIndex={1} onClose={vi.fn()} />,
    )

    act(() => vi.advanceTimersByTime(SLIDE_MS * 3))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()

    fireEvent.ended(getVideo(container))
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('starts muted and lets you turn the sound on', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SlideshowViewer slides={slides} startIndex={1} onClose={vi.fn()} />,
    )
    expect(getVideo(container)).toHaveProperty('muted', true)

    await user.click(screen.getByRole('button', { name: 'Unmute' }))

    expect(getVideo(container)).toHaveProperty('muted', false)
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument()
  })

  it('only offers the sound button on a video', async () => {
    const user = userEvent.setup()
    render(<SlideshowViewer slides={slides} startIndex={0} onClose={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /mute/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next photo' }))

    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument()
  })

  it('pauses the video when the slideshow is paused', async () => {
    const user = userEvent.setup()
    render(<SlideshowViewer slides={slides} startIndex={1} onClose={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Pause' }))

    expect(pause).toHaveBeenCalled()
  })

  it('moves on if a video cannot be played', () => {
    const { container } = render(
      <SlideshowViewer slides={slides} startIndex={1} onClose={vi.fn()} />,
    )

    fireEvent.error(getVideo(container))

    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })
})
