import { useEffect, useRef } from 'react'
import { imageSources } from '@/shared/lib/images'
import { isVideoSource } from '@/shared/lib/media'
import type { Slide } from '../types/moment'

type SlideMediaProps = {
  slide: Slide
  playing: boolean
  muted: boolean
  // Only one slide: let the video repeat instead of ending.
  loop: boolean
  onEnded: () => void
}

// The picture (or video) of one slide, filling the screen.
export function SlideMedia({ slide, playing, muted, loop, onEnded }: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const alt = `${slide.title}. ${slide.caption}`
  const photo = imageSources(slide.src)

  // Pausing the slideshow pauses the video too.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (playing) void video.play?.()?.catch(() => undefined)
    else video.pause?.()
  }, [playing, slide.src])

  if (isVideoSource(slide.src)) {
    return (
      <video
        ref={videoRef}
        key={slide.src}
        src={slide.src}
        aria-label={alt}
        autoPlay
        muted={muted}
        loop={loop}
        playsInline
        onEnded={onEnded}
        // A video that cannot play should not stall the whole slideshow.
        onError={onEnded}
        className="absolute inset-0 size-full animate-fade-in object-contain"
      />
    )
  }

  return (
    <>
      {/* A soft blurred copy fills the space around the photo. Blurring a whole screen is heavy
          for phones, so it is only drawn on bigger screens. */}
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="40vw"
        alt=""
        aria-hidden
        decoding="async"
        className="absolute inset-0 hidden size-full scale-110 animate-fade-in object-cover opacity-40 blur-2xl md:block"
      />
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="100vw"
        alt={alt}
        decoding="async"
        className="absolute inset-0 size-full animate-fade-in object-contain motion-safe:animate-kenburns"
      />
    </>
  )
}
