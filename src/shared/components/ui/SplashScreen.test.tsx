import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { SplashScreen } from './SplashScreen'

// Photos "load" after 100ms, or never when `slow` is set.
const stubImages = (slow = false) => {
  class FakeImage {
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(_value: string) {
      if (!slow) setTimeout(() => this.onload?.(), 100)
    }
  }
  vi.stubGlobal('Image', FakeImage)
}

const messages = ['Packing…', 'Almost…', 'Ready!']

const renderSplash = () =>
  render(
    <SplashScreen
      title="Pare Moments"
      tagline="Hello Pare"
      icon={<span>icon</span>}
      images={['/a.jpeg', '/b.jpeg']}
      messages={messages}
      minDurationMs={1000}
      maxDurationMs={3000}
    />,
  )

// Moves time forward in small steps, because each state change schedules the next timer only
// after React has re-rendered.
const goneAfter = (ms: number) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 50) act(() => vi.advanceTimersByTime(50))
  return screen.queryByText('Pare Moments') === null
}

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubImages()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows the title, tagline and a progress bar starting at 0%', () => {
    renderSplash()

    expect(screen.getByText('Pare Moments')).toBeInTheDocument()
    expect(screen.getByText('Hello Pare')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
    expect(screen.getByText('Packing…')).toBeInTheDocument()
  })

  it('fills the progress and changes its message as loading moves along', () => {
    renderSplash()

    act(() => vi.advanceTimersByTime(500))
    const midway = Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'))
    expect(midway).toBeGreaterThan(30)
    expect(midway).toBeLessThan(100)

    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('Ready!')).toBeInTheDocument()
  })

  it('fades the page in while it leaves, then lets go of the page', () => {
    renderSplash()

    goneAfter(1000)
    expect(document.documentElement.dataset.splash).toBe('exit')

    goneAfter(950)
    expect(document.documentElement.dataset.splash).toBeUndefined()
  })

  it('closes after the minimum time and the closing animation', () => {
    renderSplash()

    expect(goneAfter(1000)).toBe(false)
    expect(goneAfter(950)).toBe(true)
  })

  it('keeps waiting for photos that are slow, until the maximum time', () => {
    stubImages(true)
    renderSplash()

    expect(goneAfter(2500)).toBe(false)
    expect(Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(100)

    expect(goneAfter(500 + 1000)).toBe(true)
  })

  it('plays again on every load, not just the first', () => {
    const first = renderSplash()
    expect(goneAfter(2000)).toBe(true)
    first.unmount()

    renderSplash()

    expect(screen.getByText('Pare Moments')).toBeInTheDocument()
  })

  it('can be skipped with a tap', () => {
    const { container } = renderSplash()

    fireEvent.click(container.firstElementChild!)

    expect(goneAfter(950)).toBe(true)
  })

  it('can be skipped with any key', () => {
    renderSplash()

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(goneAfter(950)).toBe(true)
  })

  it('is left out for people who prefer less motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)

    renderSplash()

    expect(screen.queryByText('Pare Moments')).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('stops covering the page with the pre-load color', () => {
    document.documentElement.dataset.splash = 'pending'

    renderSplash()

    expect(document.documentElement.dataset.splash).toBeUndefined()
  })
})
