import { LuGraduationCap, LuImages, LuMapPin } from 'react-icons/lu'
import { Link } from 'react-router'
import { LazyImage } from '@/shared/components/media/LazyImage'
import { Polaroid } from '@/shared/components/ui/Polaroid'
import { isVideoSource } from '@/shared/lib/media'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'
import { formatDay } from '../utils/format-date'
import { countMedia, coverSource } from '../utils/media'

type MomentCardProps = {
  moment: Moment
  tilt?: 'left' | 'right' | 'none'
}

export function MomentCard({ moment, tilt = 'none' }: MomentCardProps) {
  const cover = coverSource(moment)
  const { photos, videos } = countMedia([moment])

  return (
    <article className="group">
      <Polaroid tilt={tilt} tape>
        <Link
          to={`/moments/${moment.id}`}
          className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
        >
          <div className="relative md:w-5/12 md:shrink-0">
            <LazyImage
              src={cover}
              alt={
                isVideoSource(cover)
                  ? momentCopy.videoLabel(moment.title)
                  : momentCopy.photoAlt(moment.title, 1, moment.photos.length)
              }
              className="aspect-[4/3] rounded-2xl"
              sizes="(min-width: 768px) 400px, calc(100vw - 7rem)"
              imgClassName="transition duration-500 group-hover:scale-105"
            />
            <span className="absolute top-3 left-3 rounded-full bg-bg/90 px-3 py-1 text-xs font-bold">
              {formatDay(moment.date)}
            </span>
            {moment.milestone ? (
              <span className="absolute -top-3 -right-3 flex size-12 rotate-12 items-center justify-center rounded-full bg-secondary text-xl text-on-secondary shadow-lg ring-4 ring-surface">
                <LuGraduationCap aria-hidden />
                <span className="sr-only">{momentCopy.milestoneBadge}</span>
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 px-1 pb-1 md:flex-1 md:pr-4">
            <h3 className="font-display text-2xl leading-tight font-semibold">{moment.title}</h3>
            <p className="line-clamp-3 leading-relaxed text-muted">{moment.caption}</p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm font-bold text-primary">
              {moment.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <LuMapPin aria-hidden />
                  {moment.location}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <LuImages aria-hidden />
                {momentCopy.mediaCount(photos, videos)}
              </span>
            </p>
          </div>
        </Link>
      </Polaroid>
    </article>
  )
}
