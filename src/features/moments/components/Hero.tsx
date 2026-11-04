import {
  LuArrowDown,
  LuCalendarDays,
  LuImages,
  LuMapPin,
  LuPlay,
  LuSparkles,
  LuStar,
  LuVideo,
} from 'react-icons/lu'
import { Link } from 'react-router'
import { Polaroid } from '@/shared/components/ui/Polaroid'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { imageSources } from '@/shared/lib/images'
import { isVideoSource } from '@/shared/lib/media'
import { cn } from '@/shared/lib/utils'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'
import { daysBetween } from '../utils/days-between'
import { countMedia, coverSource } from '../utils/media'
import { Stat } from './Stat'

type HeroProps = {
  moments: Moment[]
}

// The photo stack: each one tilted and bobbing at its own pace. The first photo (Day 1) takes the
// middle spot and sits in front of the other two.
const stack = [
  {
    tilt: 'none' as const,
    place: 'z-20 left-1/2 -translate-x-1/2 top-24 rotate-2 animate-float-slow',
    size: 'w-56 lg:w-64',
  },
  {
    tilt: 'left' as const,
    place: 'z-0 left-0 top-4 -rotate-6 animate-float-slow',
    size: 'w-52 lg:w-60',
  },
  {
    tilt: 'right' as const,
    place: 'z-10 right-0 top-0 rotate-6 animate-float',
    size: 'w-52 lg:w-60',
  },
]

export function Hero({ moments }: HeroProps) {
  // Only photos go in the floating stack; a video cover would just be a still frame.
  const covers = moments
    .map((moment) => ({ src: coverSource(moment), title: moment.title }))
    .map((cover) => ({ ...cover, photo: imageSources(cover.src) }))
    .filter((cover) => !isVideoSource(cover.src))
    .slice(0, 3)
  const { photos, videos } = countMedia(moments)

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-6 text-on-primary sm:p-10 lg:p-14">
      {/* Flat decorative shapes */}
      <span aria-hidden className="absolute -top-16 -right-16 size-64 rounded-full bg-secondary" />
      <span
        aria-hidden
        className="absolute -bottom-24 -left-10 size-56 rounded-full bg-primary-deep"
      />
      <LuStar
        aria-hidden
        className="absolute top-8 left-[45%] hidden animate-spin-slow text-4xl text-secondary lg:block"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit -rotate-2 items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-extrabold text-on-secondary shadow-md">
            <LuMapPin aria-hidden />
            {momentCopy.heroEyebrow}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {momentCopy.heroTitle}{' '}
            <span className="relative inline-block">
              <span className="relative z-10">{momentCopy.heroTitleAccent}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 rounded-full bg-secondary sm:h-5"
              />
            </span>
            <LuSparkles aria-hidden className="ml-2 hidden text-secondary sm:inline" />
          </h1>
          <p className="max-w-xl text-lg leading-relaxed opacity-90">{momentCopy.heroBody}</p>

          <div className="flex flex-wrap gap-3">
            <Stat icon={LuImages} value={photos} label={momentCopy.statPhotos} />
            {videos > 0 ? (
              <Stat icon={LuVideo} value={videos} label={momentCopy.statVideos} />
            ) : null}
            <Stat icon={LuCalendarDays} value={daysBetween(moments)} label={momentCopy.statDays} />
            <Stat icon={LuStar} value={moments.length} label={momentCopy.statMoments} />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/slideshow" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
              <LuPlay aria-hidden />
              {momentCopy.play}
            </Link>
            <a
              href="#moments"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white/15 px-7 text-base font-bold transition hover:bg-white/25"
            >
              {momentCopy.browse}
              <LuArrowDown aria-hidden />
            </a>
          </div>
        </div>

        <div
          aria-hidden
          className="relative mx-auto hidden h-96 w-full max-w-md sm:block lg:h-[28rem]"
        >
          {covers.map((cover, index) => {
            const item = stack[index]
            if (!item) return null
            return (
              <div key={cover.src} className={cn('absolute', item.place, item.size)}>
                <Polaroid tilt={item.tilt} tape className="text-fg">
                  <img
                    src={cover.photo.src}
                    srcSet={cover.photo.srcSet}
                    sizes="(min-width: 1024px) 256px, 224px"
                    alt=""
                    decoding="async"
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                </Polaroid>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
