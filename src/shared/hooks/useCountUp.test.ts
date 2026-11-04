import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts up from 0 to the target', () => {
    const { result } = renderHook(() => useCountUp(10, 300))
    expect(result.current).toBe(0)

    act(() => vi.advanceTimersByTime(150))
    expect(result.current).toBeGreaterThan(0)
    expect(result.current).toBeLessThan(10)

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe(10)
  })

  it('jumps straight to the target when motion is reduced', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(7))

    expect(result.current).toBe(7)
  })
})
