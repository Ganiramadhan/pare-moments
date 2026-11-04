import { useCallback, useEffect, useRef, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuMaximize,
  LuPause,
  LuPlay,
  LuVolume2,
  LuVolumeX,
  LuX,
} from 'react-icons/lu'
import { imageSources } from '@/shared/lib/images'
import { isVideoSource } from '@/shared/lib/media'
import { SLIDE_MS, momentCopy } from '../constants'
import { useSlideshow } from '../hooks/useSlideshow'
import type { Slide } from '../types/moment'
import { formatDay } from '../utils/format-date'
import { SlideMedia } from './SlideMedia'

type SlideshowViewerProps = {
  slides: Slide[]
  startIndex?: number
  onClose: () => void
}

const controlClass =
  'flex size-11 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/30'

export function SlideshowViewer({ slides, startIndex = 0, onClose }: SlideshowViewerProps) {
  // A video moves on when it ends, so only photos run on the timer.
  const isTimed = useCallback((i: number) => !isVideoSource(slides[i]?.src ?? ''), [slides])
  const { index, playing, next, previous, toggle } = useSlideshow({
    count: slides.length,
    intervalMs: SLIDE_MS,
    startIndex,
    isTimed,
  })
  const [muted, setMuted] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const slide = slides[index]
  const showingVideo = isVideoSource(slide.src)
  const copy = momentCopy.slideshow

  // Keyboard: arrows to move, space to pause, Escape to leave.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      else if (event.key === 'ArrowLeft') previous()
      else if (event.key === ' ') {
        event.preventDefault()
        toggle()
      } else if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, previous, toggle, onClose])

  // Load the next photo early so the change feels instant on a slow connection.
  const upcoming = slides[(index + 1) % slides.length]
  useEffect(() => {
    if (!upcoming || isVideoSource(upcoming.src)) return
    const photo = imageSources(upcoming.src)
    const next = new Image()
    // Same srcset and sizes as the slide itself, so the browser fetches the very same file.
    if (photo.srcSet) {
      next.srcset = photo.srcSet
      next.sizes = '100vw'
    }
    next.src = photo.src
  }, [upcoming])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  return (
    <div
      className="fixed inset-0 z-20 overflow-hidden bg-black text-white select-none"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current
        const end = event.changedTouches[0]?.clientX
        touchStartX.current = null
        if (start === null || end === undefined || Math.abs(end - start) < 50) return
        if (end < start) next()
        else previous()
      }}
    >
      <SlideMedia
        key={index}
        slide={slide}
        playing={playing}
        muted={muted}
        loop={slides.length === 1}
        onEnded={next}
      />

      <div className="absolute inset-x-0 top-0 h-1 bg-white/20">
        <div
          key={`${index}-${playing}`}
          className={
            showingVideo
              ? 'h-full w-full bg-white/60'
              : playing
                ? 'h-full origin-left animate-progress bg-white'
                : 'h-full origin-left bg-white/60'
          }
        />
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-5 md:px-10">
        <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-bold">
          {copy.counter(index + 1, slides.length)}
        </span>
        <div className="flex gap-2">
          {showingVideo ? (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? copy.unmute : copy.mute}
              className={controlClass}
            >
              {muted ? <LuVolumeX aria-hidden /> : <LuVolume2 aria-hidden />}
            </button>
          ) : null}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={copy.fullscreen}
            className={controlClass}
          >
            <LuMaximize aria-hidden />
          </button>
          <button type="button" onClick={onClose} aria-label={copy.close} className={controlClass}>
            <LuX aria-hidden />
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-black/70 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-10 md:pb-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="md:max-w-2xl">
            <p className="text-sm font-extrabold tracking-widest text-secondary uppercase">
              {momentCopy.dayLabel} {slide.day}
            </p>
            <h2 className="font-display text-3xl font-bold md:text-5xl">{slide.title}</h2>
            <p className="mt-1 leading-relaxed text-white/90 md:text-lg">{slide.caption}</p>
            <p className="mt-1 text-sm text-white/70">
              {formatDay(slide.date)}
              {slide.location ? ` · ${slide.location}` : ''}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={previous}
              aria-label={copy.previous}
              className={controlClass}
            >
              <LuChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? copy.pause : copy.play}
              className={controlClass}
            >
              {playing ? <LuPause aria-hidden /> : <LuPlay aria-hidden />}
            </button>
            <button type="button" onClick={next} aria-label={copy.next} className={controlClass}>
              <LuChevronRight aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
