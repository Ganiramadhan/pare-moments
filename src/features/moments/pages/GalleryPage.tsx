import { useState } from 'react'
import { LuImages, LuLayoutGrid, LuVideo } from 'react-icons/lu'
import { Link, useSearchParams } from 'react-router'
import { LazyImage } from '@/shared/components/media/LazyImage'
import { Lightbox } from '@/shared/components/media/Lightbox'
import { useSeo } from '@/shared/hooks/useSeo'
import { cn } from '@/shared/lib/utils'
import { momentCopy } from '../constants'
import { moments } from '../data/moments'
import {
  filterGalleryItems,
  galleryItems,
  parseGalleryFilter,
  type GalleryFilter,
} from '../utils/gallery-items'

const filters: { value: GalleryFilter; label: string; icon: typeof LuImages }[] = [
  { value: 'all', label: momentCopy.galleryAll, icon: LuLayoutGrid },
  { value: 'photos', label: momentCopy.galleryPhotos, icon: LuImages },
  { value: 'videos', label: momentCopy.galleryVideos, icon: LuVideo },
]

// How wide a tile is on each screen, so phones download the small files.
const GALLERY_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'

const chipClass = (active: boolean) =>
  cn(
    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 transition',
    active
      ? 'bg-primary text-on-primary ring-primary'
      : 'bg-surface ring-line hover:bg-primary-soft',
  )

const tileClass =
  'group relative block w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-primary'

const captionClass =
  'absolute inset-x-2 bottom-2 truncate rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100'

// Every photo and video of the story in one mosaic. A photo opens the full-screen viewer;
// a video opens its moment, where it can be played.
export function GalleryPage() {
  useSeo({
    title: 'Gallery',
    description:
      'Every photo and video from the English journey in Kampung Inggris, Pare, in one place.',
    path: '/gallery',
  })
  const [params, setParams] = useSearchParams()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const filter = parseGalleryFilter(params.get('type'))

  const items = filterGalleryItems(galleryItems(moments), filter)
  const photos = items.filter((item) => !item.isVideo)
  const viewerImages = photos.map((item) => ({
    src: item.src,
    alt: momentCopy.photoAlt(item.title, item.number, item.total),
  }))

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            {momentCopy.galleryTitle}
          </h1>
          <p className="max-w-xl text-lg text-muted">{momentCopy.gallerySubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the gallery">
          {filters.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setParams(value === 'all' ? {} : { type: value }, { replace: true })}
              className={chipClass(filter === value)}
            >
              <Icon aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </header>

      {items.length === 0 ? (
        <p className="text-center text-muted">{momentCopy.galleryEmpty}</p>
      ) : (
        <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {items.map((item) => (
            <li key={item.src} className="mb-3 break-inside-avoid sm:mb-4">
              {item.isVideo ? (
                <Link
                  to={`/moments/${item.momentId}`}
                  aria-label={momentCopy.galleryOpenMoment(item.title)}
                  className={tileClass}
                >
                  <LazyImage
                    src={item.src}
                    alt={momentCopy.videoLabel(item.title)}
                    natural
                    sizes={GALLERY_SIZES}
                    className="aspect-[3/4]"
                    imgClassName="h-full object-cover"
                  />
                  <span className={captionClass}>
                    {momentCopy.dayLabel} {item.day} · {item.title}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenIndex(photos.indexOf(item))}
                  className={cn(tileClass, 'cursor-zoom-in text-left')}
                >
                  <LazyImage
                    src={item.src}
                    alt={momentCopy.photoAlt(item.title, item.number, item.total)}
                    natural
                    sizes={GALLERY_SIZES}
                    imgClassName="transition duration-500 group-hover:scale-105"
                  />
                  <span className={captionClass}>
                    {momentCopy.dayLabel} {item.day} · {item.title}
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        images={viewerImages}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </main>
  )
}
