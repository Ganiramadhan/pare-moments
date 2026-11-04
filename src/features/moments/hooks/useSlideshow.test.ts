import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useSlideshow } from './useSlideshow'

describe('useSlideshow', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const setup = (count = 3) => renderHook(() => useSlideshow({ count, intervalMs: 1000 }))

  it('advances by itself and loops back to the start', () => {
    const { result } = setup()

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.index).toBe(1)
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.index).toBe(2)
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.index).toBe(0)
  })

  it('stops advancing while paused', () => {
    const { result } = setup()

    act(() => result.current.toggle())
    act(() => vi.advanceTimersByTime(5000))

    expect(result.current.index).toBe(0)
    expect(result.current.playing).toBe(false)
  })

  it('wraps around when going back from the first photo', () => {
    const { result } = setup()

    act(() => result.current.previous())

    expect(result.current.index).toBe(2)
  })

  it('gives a manually chosen photo its full time', () => {
    const { result } = setup()

    act(() => vi.advanceTimersByTime(900))
    act(() => result.current.next())
    act(() => vi.advanceTimersByTime(900))

    expect(result.current.index).toBe(1)
  })

  it('does not advance by itself on a slide that is not timed', () => {
    const { result } = renderHook(() =>
      useSlideshow({ count: 3, intervalMs: 1000, isTimed: (i) => i !== 0 }),
    )

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.index).toBe(0)

    act(() => result.current.next())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.index).toBe(2)
  })
})
