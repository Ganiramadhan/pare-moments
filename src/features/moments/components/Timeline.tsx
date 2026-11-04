import { Reveal } from '@/shared/components/ui/Reveal'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'
import { dayNumber } from '../utils/days-between'
import { groupByMonth } from '../utils/group-by-month'
import { MomentCard } from './MomentCard'

type TimelineProps = {
  moments: Moment[]
  // The first day of the whole story, so "Day 1" stays Day 1 even when the list is filtered.
  firstDate: string
}

// A path that runs down the left of the page: every day has its "Day N" marker on the line, and
// its card to the right of it. The same on phones and on big screens, so the markers always sit
// beside their own day.
export function Timeline({ moments, firstDate }: TimelineProps) {
  return (
    <ol className="relative flex flex-col gap-10 before:absolute before:top-0 before:bottom-0 before:left-5 before:w-1 before:rounded-full before:bg-line">
      {groupByMonth(moments).flatMap((group) => [
        <li key={group.label} className="relative pl-14">
          <span className="relative z-10 inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold tracking-widest text-on-primary uppercase">
            {group.label}
          </span>
        </li>,
        ...group.moments.map((moment) => (
          <li key={moment.id} id={`moment-${moment.id}`} className="relative scroll-mt-40 pl-14">
            <span className="absolute top-4 left-0 z-10 flex size-11 flex-col items-center justify-center rounded-full bg-secondary leading-none font-extrabold text-on-secondary ring-4 ring-bg">
              <span className="text-[9px] tracking-wider uppercase">{momentCopy.dayLabel}</span>
              <span className="font-display text-base">{dayNumber(moment.date, firstDate)}</span>
            </span>
            <div className="max-w-4xl">
              <Reveal>
                <MomentCard moment={moment} tilt={moment.id.length % 2 ? 'left' : 'right'} />
              </Reveal>
            </div>
          </li>
        )),
      ])}
    </ol>
  )
}
