import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

type PolaroidProps = {
  children: ReactNode
  tilt?: 'left' | 'right' | 'none'
  // A strip of "tape" holding the photo, like a scrapbook.
  tape?: boolean
  className?: string
}

const tilts = {
  left: '-rotate-1 hover:rotate-0',
  right: 'rotate-1 hover:rotate-0',
  none: '',
}

// A white frame around a photo, with a little tilt that straightens on hover.
export function Polaroid({ children, tilt = 'none', tape = false, className }: PolaroidProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl bg-surface p-3 shadow-md ring-1 ring-line transition duration-300 hover:shadow-xl',
        tilts[tilt],
        className,
      )}
    >
      {tape ? (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-sm bg-secondary/80"
        />
      ) : null}
      {children}
    </div>
  )
}
