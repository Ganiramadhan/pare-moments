import { useEffect, useRef, useState } from 'react'
import { LuPlay } from 'react-icons/lu'
import { imageSources } from '@/shared/lib/images'
import { isVideoSource } from '@/shared/lib/media'
import { cn } from '@/shared/lib/utils'

type LazyImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  // Show the whole photo at its own proportions instead of cropping it to the box.
  natural?: boolean
  // How wide the photo is shown, as a CSS `sizes` value. It lets the phone download a small file.
  sizes?: string
  // For photos that are visible as soon as the page opens: load right away, before the rest.
  priority?: boolean
}

// A photo with a skeleton while it loads. It downloads the size that fits the screen, keeps its
// place on the page before it arrives (no jumping), and loads only when it is about to be seen.
// A video source shows its first frame with a play badge, so cards can use either one as a cover.
export function LazyImage({
  src,
  alt,
  className,
  imgClassName,
  natural = false,
  sizes,
  priority = false,
}: LazyImageProps) {
  const mediaRef = useRef<HTMLImageElement & HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const isVideo = isVideoSource(src)
  const photo = imageSources(src)

  // A cached photo can finish loading before the load event is hooked up, so check on mount too.
  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const ready = isVideo ? media.readyState >= 2 : media.complete && media.naturalWidth > 0
    if (ready) setLoaded(true)
  }, [src, isVideo])

  const mediaClass = cn(
    'w-full transition duration-500',
    natural ? 'h-auto' : 'size-full object-cover',
    loaded ? 'opacity-100' : 'opacity-0',
    imgClassName,
  )

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-line',
        !loaded && 'animate-pulse',
        // Without known proportions the box needs some height before the photo arrives.
        !loaded && natural && !photo.height && 'min-h-48',
        className,
      )}
    >
      {isVideo ? (
        <>
          <video
            ref={mediaRef}
            // "#t=0.1" makes the browser show a frame instead of a black box.
            src={`${src}#t=0.1`}
            aria-label={alt}
            muted
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={mediaClass}
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-2xl text-white"
          >
            <LuPlay />
          </span>
        </>
      ) : (
        <img
          ref={mediaRef}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={photo.srcSet ? sizes : undefined}
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          // A broken photo should show its alt text, not an endless skeleton.
          onError={() => setLoaded(true)}
          className={mediaClass}
        />
      )}
    </div>
  )
}
