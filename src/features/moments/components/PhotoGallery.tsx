import { useState } from 'react'
import { LazyImage } from '@/shared/components/media/LazyImage'
import { Lightbox } from '@/shared/components/media/Lightbox'
import { Polaroid } from '@/shared/components/ui/Polaroid'
import { isVideoSource } from '@/shared/lib/media'
import { cn } from '@/shared/lib/utils'
import { momentCopy } from '../constants'
import type { Moment } from '../types/moment'

type PhotoGalleryProps = {
  moment: Moment
}

// Photos and videos as polaroids in a masonry layout. Tapping a photo opens the full-screen
// viewer; a video plays right where it is.
export function PhotoGallery({ moment }: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const total = moment.photos.length

  // The viewer only shows photos, so remember each photo's place among them.
  const photoSources = moment.photos.filter((src) => !isVideoSource(src))
  const viewerImages = photoSources.map((src) => ({
    src,
    alt: momentCopy.photoAlt(moment.title, moment.photos.indexOf(src) + 1, total),
  }))

  return (
    <>
      <ul className={cn('columns-1 gap-6', total > 1 && 'sm:columns-2')}>
        {moment.photos.map((src, index) => (
          <li key={src} className="mb-6 break-inside-avoid pt-3">
            <Polaroid tilt={index % 2 === 0 ? 'left' : 'right'} tape>
              {isVideoSource(src) ? (
                <video
                  src={src}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={momentCopy.videoLabel(moment.title)}
                  className="max-h-[80svh] w-full rounded-2xl bg-black object-contain"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenIndex(photoSources.indexOf(src))}
                  aria-label={momentCopy.openPhoto(index + 1)}
                  className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl"
                >
                  <LazyImage
                    src={src}
                    alt={momentCopy.photoAlt(moment.title, index + 1, total)}
                    natural
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                    imgClassName="transition duration-500 group-hover:scale-[1.03]"
                  />
                </button>
              )}
            </Polaroid>
          </li>
        ))}
      </ul>
      <Lightbox
        images={viewerImages}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  )
}
