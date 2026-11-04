import { useEffect, useRef } from 'react'

// A thin bar that fills as you read down the page. It reads the page height only when the size
// changes (reading it on every scroll forces the browser to re-measure the page and makes
// scrolling feel heavy), and draws at most once per frame.
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    let max = 0
    let frame = 0

    const measure = () => {
      max = root.scrollHeight - root.clientHeight
    }
    const draw = () => {
      frame = 0
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    // The page grows as photos and sections load, so measure again when its size changes.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize)
    observer?.observe(root)
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-secondary will-change-transform"
      />
    </div>
  )
}
