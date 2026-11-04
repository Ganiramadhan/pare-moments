import { LuStar } from 'react-icons/lu'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'
import { dayNumber, firstDateOf } from '../utils/days-between'

type MarqueeProps = {
  moments: Moment[]
}

// A slowly scrolling ribbon of the day titles. Decorative, so hidden from screen readers.
export function Marquee({ moments }: MarqueeProps) {
  if (moments.length === 0) return null
  const first = firstDateOf(moments)

  // The row is shown twice so that it can loop without a gap.
  const row = (suffix: string) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" key={suffix}>
      {moments.map((moment) => (
        <li key={moment.id} className="flex items-center gap-8 whitespace-nowrap">
          <span className="font-display text-xl font-semibold">
            {momentCopy.dayLabel} {dayNumber(moment.date, first)}: {moment.title}
          </span>
          <LuStar className="text-xl" />
        </li>
      ))}
    </ul>
  )

  return (
    <div aria-hidden className="-mx-4 overflow-hidden py-4 sm:-mx-6">
      <div className="-rotate-1 bg-secondary py-4 text-on-secondary shadow-md">
        <div className="flex w-max animate-marquee will-change-transform motion-reduce:animate-none">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </div>
  )
}
