import { useEffect, useState } from 'react'
import { LuArrowUp } from 'react-icons/lu'

const SHOW_AFTER_PX = 600

// A round button that appears once you have scrolled down, and takes you back to the top.
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-4 bottom-28 z-20 flex size-12 animate-pop items-center justify-center rounded-full border-b-4 border-primary-deep bg-primary text-xl text-on-primary shadow-lg transition hover:brightness-110 active:translate-y-0.5 active:border-b-2 sm:right-6 sm:bottom-6"
    >
      <LuArrowUp aria-hidden />
    </button>
  )
}
