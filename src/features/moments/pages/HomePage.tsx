import {
  LuBookOpen,
  LuHammer,
  LuHeadphones,
  LuHeart,
  LuPencilLine,
  LuPlus,
  LuPuzzle,
  LuShuffle,
  LuSun,
  LuTrophy,
} from 'react-icons/lu'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { site } from '@/shared/config/site'
import { useSeo } from '@/shared/hooks/useSeo'
import { Reveal } from '@/shared/components/ui/Reveal'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { cn } from '@/shared/lib/utils'
import { Hero } from '../components/Hero'
import { JourneyNav } from '../components/JourneyNav'
import { Marquee } from '../components/Marquee'
import { Timeline } from '../components/Timeline'
import { momentCopy } from '../constants'
import { moments } from '../data/moments'

const chipClass = (active: boolean) =>
  cn(
    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 transition',
    active
      ? 'bg-primary text-on-primary ring-primary'
      : 'bg-surface ring-line hover:bg-primary-soft',
  )

export function HomePage() {
  useSeo({ path: '/' })
  const uploads = site.features.uploads
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const onlyMilestones = params.get('filter') === 'milestones'

  const visible = onlyMilestones ? moments.filter((m) => m.milestone) : moments

  const setFilter = (milestones: boolean) =>
    setParams(milestones ? { filter: 'milestones' } : {}, { replace: true })

  // A little fun: jump to any memory at random.
  const surprise = () => {
    const pick = moments[Math.floor(Math.random() * moments.length)]
    if (pick) navigate(`/moments/${pick.id}`)
  }

  return (
    <main className="flex flex-col gap-12">
      <Hero moments={moments} />
      <Marquee moments={moments} />

      <section id="moments" className="flex scroll-mt-28 flex-col gap-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {momentCopy.momentsTitle}
            </h2>
            <p className="text-lg text-muted">{momentCopy.momentsSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter moments">
            <button
              type="button"
              aria-pressed={!onlyMilestones}
              onClick={() => setFilter(false)}
              className={chipClass(!onlyMilestones)}
            >
              {momentCopy.filterAll}
            </button>
            <button
              type="button"
              aria-pressed={onlyMilestones}
              onClick={() => setFilter(true)}
              className={chipClass(onlyMilestones)}
            >
              <LuTrophy aria-hidden />
              {momentCopy.filterMilestones}
            </button>
            <button type="button" onClick={surprise} className={chipClass(false)}>
              <LuShuffle aria-hidden />
              {momentCopy.surprise}
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-muted">
            {moments.length === 0 ? momentCopy.empty : momentCopy.filterEmpty}
          </p>
        ) : (
          <>
            <JourneyNav moments={visible} firstDate={moments[0]?.date ?? ''} />
            <Timeline moments={visible} firstDate={moments[0]?.date ?? ''} />
          </>
        )}
      </section>

      <section aria-labelledby="practice-title" className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h2
              id="practice-title"
              className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
            >
              {momentCopy.practice.title}
            </h2>
            <p className="max-w-xl text-lg text-muted">{momentCopy.practice.subtitle}</p>
          </div>
          <Link to="/practice" className={buttonStyles({ size: 'lg' })}>
            {momentCopy.practice.open}
          </Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {momentCopy.practice.cards.map((card, index) => {
            const Icon =
              [LuSun, LuBookOpen, LuPencilLine, LuHeadphones, LuPuzzle][index] ?? LuBookOpen
            return (
              <li key={card.to}>
                <Reveal className="h-full">
                  <Link
                    to={card.to}
                    className="group flex h-full flex-col gap-3 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span
                      className={cn(
                        'flex size-12 -rotate-6 items-center justify-center rounded-2xl text-2xl transition group-hover:rotate-0',
                        index % 2 === 0
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-primary text-on-primary',
                      )}
                    >
                      <Icon aria-hidden />
                    </span>
                    <h3 className="font-display text-2xl font-bold">{card.title}</h3>
                    <p className="leading-relaxed text-muted">{card.text}</p>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary-soft p-8 text-center sm:p-14">
        <LuHeart
          aria-hidden
          className="absolute -top-4 -left-4 size-24 -rotate-12 text-secondary"
        />
        <LuHeart
          aria-hidden
          className="absolute -right-4 -bottom-6 size-28 rotate-12 text-primary"
        />
        <div className="relative flex flex-col items-center gap-4">
          {uploads ? null : (
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-extrabold text-on-secondary">
              <LuHammer aria-hidden />
              {momentCopy.joinSoonBadge}
            </p>
          )}
          <h2 className="font-display text-4xl font-bold tracking-tight">{momentCopy.joinTitle}</h2>
          <p className="max-w-md text-lg text-muted">
            {uploads ? momentCopy.joinBody : momentCopy.joinSoonBody}
          </p>
          {uploads ? (
            <Link to="/share" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
              <LuPlus aria-hidden />
              {momentCopy.joinAction}
            </Link>
          ) : (
            <Link to="/friends" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
              {momentCopy.joinSoonAction}
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
