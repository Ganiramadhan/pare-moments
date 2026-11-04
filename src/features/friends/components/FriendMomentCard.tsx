import { useState } from 'react'
import { LuImages } from 'react-icons/lu'
import { LazyImage } from '@/shared/components/media/LazyImage'
import { Lightbox } from '@/shared/components/media/Lightbox'
import { Polaroid } from '@/shared/components/ui/Polaroid'
import { cn } from '@/shared/lib/utils'
import { friendsCopy } from '../constants'
import type { FriendMoment } from '../types/friend-moment'

type FriendMomentCardProps = {
  moment: FriendMoment
  tilt?: 'left' | 'right' | 'none'
}

// A friend's avatar color follows the first letter, so each person keeps their own color.
const avatarColors = [
  'bg-primary-soft text-primary',
  'bg-secondary text-on-secondary',
  'bg-primary text-on-primary',
  'bg-secondary-soft text-secondary-deep',
]

export function FriendMomentCard({ moment, tilt = 'none' }: FriendMomentCardProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [cover] = moment.photos
  const images = moment.photos.map((src, index) => ({
    src,
    alt: friendsCopy.photoAlt(moment.name, index + 1, moment.photos.length),
  }))
  const initial = moment.name.charAt(0).toUpperCase()
  const color = avatarColors[initial.charCodeAt(0) % avatarColors.length]

  return (
    <article className="pt-3">
      <Polaroid tilt={tilt} tape>
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl text-left"
        >
          <LazyImage src={cover} alt={images[0]?.alt ?? ''} natural />
          {moment.photos.length > 1 ? (
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">
              <LuImages aria-hidden />
              {friendsCopy.photoCount(moment.photos.length)}
            </span>
          ) : null}
        </button>
        <div className="flex items-start gap-3 px-1 pt-4 pb-1">
          <span
            aria-hidden
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold',
              color,
            )}
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight font-semibold">{moment.name}</p>
            <p className="leading-relaxed break-words text-muted">{moment.caption}</p>
          </div>
        </div>
      </Polaroid>
      <Lightbox
        images={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </article>
  )
}
