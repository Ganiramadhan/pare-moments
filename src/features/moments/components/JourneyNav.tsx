import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'
import { dayNumber } from '../utils/days-between'

type JourneyNavProps = {
  moments: Moment[]
  // The first day of the whole story, so "Day 1" stays Day 1 even when the list is filtered.
  firstDate: string
}

// A strip of day chips that stays under the top bar while you read the timeline. The chip of the
// day you are reading lights up, and tapping a chip scrolls to that day.
export function JourneyNav({ moments, firstDate }: JourneyNavProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | undefined>(moments[0]?.id)

  // The day crossing a reading line near the top of the screen is the one being read.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const reading = entries.find((entry) => entry.isIntersecting)
        if (reading) setActive(reading.target.id.replace('moment-', ''))
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    moments.forEach((moment) => {
      const row = document.getElementById(`moment-${moment.id}`)
      if (row) observer.observe(row)
    })
    return () => observer.disconnect()
  }, [moments])

  // On a phone the strip scrolls sideways: keep the lit chip in view.
  useEffect(() => {
    const strip = stripRef.current
    const chip = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!strip || !chip) return
    strip.scrollTo({
      left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
      behavior: 'smooth',
    })
  }, [active])

  if (moments.length < 2) return null

  return (
    <nav
      aria-label={momentCopy.journeyLabel}
      className="sticky top-24 z-20 -mx-1 self-center rounded-full bg-surface p-1.5 shadow-md ring-1 ring-line"
    >
      <div
        ref={stripRef}
        className="flex max-w-[calc(100vw-3rem)] gap-1 overflow-x-auto [scrollbar-width:none] sm:max-w-none"
      >
        {moments.map((moment) => (
          <a
            key={moment.id}
            href={`#moment-${moment.id}`}
            aria-current={active === moment.id ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault()
              document.getElementById(`moment-${moment.id}`)?.scrollIntoView({ block: 'start' })
              setActive(moment.id)
            }}
            className={cn(
              'flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-bold transition',
              active === moment.id
                ? 'bg-secondary text-on-secondary'
                : 'text-muted hover:bg-primary-soft hover:text-primary',
            )}
          >
            {momentCopy.dayLabel} {dayNumber(moment.date, firstDate)}
          </a>
        ))}
      </div>
    </nav>
  )
}
