import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuGraduationCap,
  LuMapPin,
  LuPlay,
} from 'react-icons/lu'
import { Link, useParams } from 'react-router'
import { useSeo } from '@/shared/hooks/useSeo'
import { imageSources } from '@/shared/lib/images'
import { ShareButton } from '@/shared/components/ui/ShareButton'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { PhotoGallery } from '../components/PhotoGallery'
import { momentCopy } from '../constants'
import { firstDate, moments } from '../data/moments'
import { dayNumber } from '../utils/days-between'
import { formatDay } from '../utils/format-date'
import { coverSource } from '../utils/media'

export function MomentDetailPage() {
  const { momentId = '' } = useParams()
  const index = moments.findIndex((m) => m.id === momentId)
  const moment = moments[index]
  const day = moment ? dayNumber(moment.date, firstDate) : 0

  useSeo({
    title: moment ? `${momentCopy.dayLabel} ${day}: ${moment.title}` : 'Moment not found',
    description: moment?.caption,
    path: `/moments/${momentId}`,
    image: moment ? imageSources(coverSource(moment)).src : undefined,
    noindex: !moment,
  })

  if (!moment) {
    return (
      <main className="flex flex-col items-center gap-5 py-16 text-center">
        <p role="alert" className="text-lg text-muted">
          {momentCopy.notFound}
        </p>
        <Link to="/" className={buttonStyles({ variant: 'ghost' })}>
          <LuArrowLeft aria-hidden />
          {momentCopy.back}
        </Link>
      </main>
    )
  }

  const previous = moments[index - 1]
  const next = moments[index + 1]

  return (
    <main className="flex flex-col gap-8">
      <Link
        to="/"
        className="inline-flex min-h-11 w-fit items-center gap-2 font-bold text-primary hover:underline"
      >
        <LuArrowLeft aria-hidden />
        {momentCopy.back}
      </Link>

      <div className="grid gap-10 lg:grid-cols-[24rem_1fr] lg:gap-14">
        <header className="flex flex-col gap-5 self-start rounded-[2rem] bg-surface p-6 shadow-md ring-1 ring-line sm:p-8 lg:sticky lg:top-28">
          <span className="flex size-16 -rotate-6 flex-col items-center justify-center rounded-3xl bg-secondary leading-none font-extrabold text-on-secondary shadow-md">
            <span className="text-[10px] tracking-wider uppercase">{momentCopy.dayLabel}</span>
            <span className="font-display text-3xl">{day}</span>
          </span>

          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight">
            {moment.title}
          </h1>

          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-primary">
              <LuCalendarDays aria-hidden />
              {formatDay(moment.date)}
            </span>
            {moment.location ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-primary">
                <LuMapPin aria-hidden />
                {moment.location}
              </span>
            ) : null}
            {moment.milestone ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-on-secondary">
                <LuGraduationCap aria-hidden />
                {momentCopy.milestoneBadge}
              </span>
            ) : null}
          </div>

          <p className="text-lg leading-relaxed">{moment.caption}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              to={`/slideshow?moment=${moment.id}`}
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              <LuPlay aria-hidden />
              {momentCopy.playFromHere}
            </Link>
            <ShareButton title={moment.title} text={moment.caption} />
          </div>
        </header>

        <PhotoGallery moment={moment} />
      </div>

      <nav
        aria-label="Other moments"
        className="mt-4 flex justify-between gap-3 border-t border-line pt-8"
      >
        {previous ? (
          <Link
            to={`/moments/${previous.id}`}
            className={buttonStyles({ variant: 'ghost', size: 'lg' })}
          >
            <LuArrowLeft aria-hidden />
            {momentCopy.previousMoment}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/moments/${next.id}`}
            className={buttonStyles({ variant: 'secondary', size: 'lg' })}
          >
            {momentCopy.nextMoment}
            <LuArrowRight aria-hidden />
          </Link>
        ) : null}
      </nav>
    </main>
  )
}
