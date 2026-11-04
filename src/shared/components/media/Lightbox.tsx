import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LuChevronLeft, LuChevronRight, LuDownload, LuX, LuZoomIn, LuZoomOut } from 'react-icons/lu'
import { imageSources } from '@/shared/lib/images'
import { ZoomableImage, type ZoomHandle } from './ZoomableImage'

export type LightboxImage = {
  src: string
  alt: string
}

type LightboxProps = {
  images: LightboxImage[]
  // The open photo, or null when closed.
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
}

const buttonClass =
  'flex size-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition hover:bg-white/30'

// Shown full screen. It is attached straight to <body> (a portal), so no page layout, animation
// or transform around the photo can ever push it off-center.
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const zoomRef = useRef<ZoomHandle>(null)
  const touchStartX = useRef<number | null>(null)
  const multiTouch = useRef(false)
  // Which photo is zoomed in, if any. Tied to the photo, so moving on never keeps a stale zoom.
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null)
  const isOpen = index !== null
  const count = images.length

  const go = (step: number) => {
    if (index !== null) onIndexChange((index + step + count) % count)
  }

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  useEffect(() => {
    if (index === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onIndexChange((index + 1) % count)
      else if (event.key === 'ArrowLeft') onIndexChange((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [index, count, onClose, onIndexChange])

  const image = index === null ? undefined : images[index]
  if (!image) return null
  const zoomed = zoomedSrc === image.src

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-40 flex animate-fade-in items-center justify-center overflow-hidden bg-black/90 p-4"
      onClick={onClose}
      onTouchStart={(event) => {
        if (event.touches.length > 1) multiTouch.current = true
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (event.touches.length > 0) return
        const start = touchStartX.current
        const end = event.changedTouches[0]?.clientX
        const wasPinch = multiTouch.current
        touchStartX.current = null
        multiTouch.current = false
        // While zoomed in, a drag moves the photo; it should not flip to the next one.
        if (zoomed || wasPinch || start === null || end === undefined || Math.abs(end - start) < 50)
          return
        go(end < start ? 1 : -1)
      }}
    >
      <ZoomableImage
        key={image.src}
        ref={zoomRef}
        src={image.src}
        alt={image.alt}
        onZoomChange={(isZoomed) => setZoomedSrc(isZoomed ? image.src : null)}
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white backdrop-blur">
          {(index ?? 0) + 1} / {count}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              zoomRef.current?.toggle()
            }}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
            className={buttonClass}
          >
            {zoomed ? <LuZoomOut aria-hidden /> : <LuZoomIn aria-hidden />}
          </button>
          <a
            href={imageSources(image.src).src}
            download
            aria-label="Download photo"
            onClick={(event) => event.stopPropagation()}
            className={buttonClass}
          >
            <LuDownload aria-hidden />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className={buttonClass}
          >
            <LuX aria-hidden />
          </button>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation()
              go(-1)
            }}
            className={`${buttonClass} absolute top-1/2 left-3 -translate-y-1/2`}
          >
            <LuChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation()
              go(1)
            }}
            className={`${buttonClass} absolute top-1/2 right-3 -translate-y-1/2`}
          >
            <LuChevronRight aria-hidden />
          </button>
        </>
      ) : null}
    </div>,
    document.body,
  )
}
