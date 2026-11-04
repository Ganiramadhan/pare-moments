import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
}

// Fades and lifts content in as it scrolls into view. Shown right away without motion support.
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const node = ref.current
    if (visible || !node) return
    // Already on screen when it mounts: show it right away instead of waiting for the observer.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      className={cn(
        'transition duration-700 ease-out motion-reduce:transition-none',
        // "translate-none", not "translate-y-0": any translate keeps a containing block for fixed children.
        visible
          ? 'translate-none opacity-100'
          : 'translate-y-6 opacity-0 motion-reduce:translate-none motion-reduce:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
