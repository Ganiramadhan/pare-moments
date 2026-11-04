import { useCallback, useEffect, useState } from 'react'

type UseSlideshowOptions = {
  count: number
  intervalMs: number
  startIndex?: number
  // Whether the slide at this index moves on by itself after `intervalMs`. A video slide returns
  // false: it moves on when the video ends instead.
  isTimed?: (index: number) => boolean
}

export function useSlideshow({
  count,
  intervalMs,
  startIndex = 0,
  isTimed = () => true,
}: UseSlideshowOptions) {
  const [index, setIndex] = useState(startIndex)
  const [playing, setPlaying] = useState(true)

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const previous = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const toggle = useCallback(() => setPlaying((p) => !p), [])

  const timed = isTimed(index)

  // Restarting the timer on every index change gives each photo its full time, even after a swipe.
  useEffect(() => {
    if (!playing || count < 2 || !timed) return
    const timer = setTimeout(next, intervalMs)
    return () => clearTimeout(timer)
  }, [playing, count, index, timed, intervalMs, next])

  return { index, playing, next, previous, toggle }
}
