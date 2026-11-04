import { LuArrowRight, LuStar } from 'react-icons/lu'
import { Link } from 'react-router'
import { cn } from '@/shared/lib/utils'
import { practiceCopy, VERSIONS } from '../constants'
import { starsFor } from '../utils/grade'

type VersionOption = {
  id: string
  // Extra line under the version's name, e.g. "12 words" or "6 questions".
  detail?: string
  // The best percent so far, or undefined when never tried.
  best?: number
  href: string
  // A name other than V1 / V2 / V3 (e.g. "All words").
  label?: string
  name?: string
  text?: string
}

type VersionPickerProps = {
  // Which test this is, for the screen reader.
  label: string
  items: VersionOption[]
}

// The versions of a test as cards: V1 (basic), V2 (intermediate), V3 (challenge), each with the
// best score so far.
export function VersionPicker({ label, items }: VersionPickerProps) {
  return (
    <section aria-label={label} className="flex flex-col gap-4">
      <p className="text-muted">{practiceCopy.versionHint}</p>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const meta = VERSIONS.find((v) => v.id === item.id)
          const title = item.label ?? meta?.label ?? item.id
          const name = item.name ?? meta?.name
          const text = item.text ?? meta?.text
          return (
            <li key={item.id}>
              <Link
                to={item.href}
                className="group flex h-full flex-col gap-3 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex size-14 -rotate-6 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-bold text-on-secondary transition group-hover:rotate-0">
                    {title}
                  </span>
                  <LuArrowRight
                    aria-hidden
                    className="text-2xl text-primary transition group-hover:translate-x-1"
                  />
                </span>
                <h2 className="font-display text-2xl font-bold">{name}</h2>
                {text ? <p className="leading-relaxed text-muted">{text}</p> : null}
                <p className="mt-auto flex items-center justify-between gap-2 pt-2 text-sm font-bold text-primary">
                  <span>{item.detail}</span>
                  <span className="inline-flex items-center gap-1.5">
                    {item.best === undefined ? (
                      practiceCopy.notTried
                    ) : (
                      <>
                        <span className="flex" aria-hidden>
                          {[1, 2, 3].map((n) => (
                            <LuStar
                              key={n}
                              className={cn(
                                n <= starsFor(item.best!)
                                  ? 'fill-secondary text-secondary'
                                  : 'text-line',
                              )}
                            />
                          ))}
                        </span>
                        {practiceCopy.best(item.best)}
                      </>
                    )}
                  </span>
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
