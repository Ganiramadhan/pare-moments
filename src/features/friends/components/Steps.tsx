import { LuCheck } from 'react-icons/lu'
import { cn } from '@/shared/lib/utils'
import { friendsCopy } from '../constants'

type StepsProps = {
  // 1-based number of the step the person is on.
  current: number
}

export function Steps({ current }: StepsProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progress">
      {friendsCopy.steps.map((name, index) => {
        const number = index + 1
        const done = number < current
        const active = number === current

        return (
          <li
            key={name}
            aria-current={active ? 'step' : undefined}
            aria-label={friendsCopy.stepLabel(number, name)}
            className="flex items-center gap-2 sm:gap-3"
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-full font-display text-base font-bold transition',
                done && 'bg-primary text-on-primary',
                active && 'bg-secondary text-on-secondary ring-4 ring-secondary-soft',
                !done && !active && 'bg-line text-muted',
              )}
            >
              {done ? <LuCheck aria-hidden /> : number}
            </span>
            <span
              className={cn(
                'hidden text-sm font-bold sm:inline',
                active ? 'text-fg' : 'text-muted',
              )}
            >
              {name}
            </span>
            {number < friendsCopy.steps.length ? (
              <span
                aria-hidden
                className={cn('h-1 w-6 rounded-full sm:w-10', done ? 'bg-primary' : 'bg-line')}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
