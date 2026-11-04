import { useEffect, useState } from 'react'

const STEP_MS = 30

// Counts from 0 up to `target`. Jumps straight to the end when the visitor prefers less motion.
export function useCountUp(target: number, durationMs = 1200) {
  const [reduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  const [counted, setCounted] = useState(0)

  useEffect(() => {
    if (reduced) return
    const steps = Math.max(1, Math.round(durationMs / STEP_MS))
    let step = 0
    const timer = setInterval(() => {
      step += 1
      setCounted(Math.round((target * step) / steps))
      if (step >= steps) clearInterval(timer)
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [reduced, target, durationMs])

  return reduced ? target : counted
}
