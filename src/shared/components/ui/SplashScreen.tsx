import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LuSparkles, LuStar } from 'react-icons/lu'

type SplashScreenProps = {
  title: string
  tagline: string
  icon: ReactNode
  // Photos to wait for. The first three also fly in as polaroids.
  images?: string[]
  // Short messages shown one after another as loading moves along.
  messages?: string[]
  // It never closes sooner than this, so the animation always has time to play...
  minDurationMs?: number
  // ...and never stays longer than this, even on a very slow connection.
  maxDurationMs?: number
}

type Phase = 'show' | 'exit' | 'done'

const EXIT_MS = 900
const TICK_MS = 50

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Fixed positions for the three polaroids. Each one is rotated by its outer box, flies in through
// the middle box and bobs through the inner one, so the three animations don't fight each other.
const polaroids = [
  {
    place: 'top-[7%] left-[5%] -rotate-12 sm:left-[10%]',
    size: 'w-24 sm:w-36 lg:w-44',
    delay: '[animation-delay:0.3s]',
  },
  {
    place: 'right-[5%] bottom-[9%] rotate-12 sm:right-[10%]',
    size: 'w-24 sm:w-36 lg:w-44',
    delay: '[animation-delay:0.5s]',
  },
  {
    place: 'top-[14%] right-[8%] hidden rotate-6 sm:block',
    size: 'w-32 lg:w-40',
    delay: '[animation-delay:0.7s]',
  },
]

// An opening screen that plays on every load. The icon pops in, a camera-style flash goes off,
// photos fly in, and a real progress bar follows the fonts and photos actually loading. When it is
// done it fades away softly while the page fades in underneath. Tap or any key skips it, and it is left out entirely for
// people who prefer less motion.
export function SplashScreen({
  title,
  tagline,
  icon,
  images = [],
  messages = [],
  minDurationMs = 2200,
  maxDurationMs = 5000,
}: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'done' : 'show'))
  const [progress, setProgress] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(0)

  // The page is no longer covered by the pre-load color: the splash itself takes over.
  useEffect(() => {
    delete document.documentElement.dataset.splash
  }, [])

  // Wait for the fonts and photos, and never faster than `minDurationMs`.
  useEffect(() => {
    if (phase !== 'show') return
    const total = images.length + 1
    loadedRef.current = 0
    let cancelled = false
    const bump = () => {
      if (!cancelled) loadedRef.current += 1
    }

    images.forEach((src) => {
      const image = new Image()
      image.onload = bump
      image.onerror = bump
      image.src = src
    })
    const fonts = document.fonts?.ready
    if (fonts) void fonts.then(bump, bump)
    else bump()

    const startedAt = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const byTime = Math.min(1, elapsed / minDurationMs)
      const byLoading = loadedRef.current / total
      const next = Math.round(Math.min(byTime, byLoading) * 100)
      setProgress(next)
      if (next >= 100 || elapsed >= maxDurationMs) setPhase('exit')
    }, TICK_MS)

    const skip = () => setPhase('exit')
    window.addEventListener('keydown', skip)
    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('keydown', skip)
    }
  }, [phase, images, minDurationMs, maxDurationMs])

  useEffect(() => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`
  }, [progress])

  useEffect(() => {
    if (phase !== 'exit') return
    // The page fades in underneath while the splash fades out (see `splash-reveal` in the CSS).
    document.documentElement.dataset.splash = 'exit'
    const timer = setTimeout(() => {
      delete document.documentElement.dataset.splash
      setPhase('done')
    }, EXIT_MS)
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  const message = messages.length
    ? messages[Math.min(messages.length - 1, Math.floor((progress / 100) * messages.length))]
    : ''

  return (
    <div
      role="presentation"
      onClick={() => setPhase('exit')}
      className={`fixed inset-0 z-100 flex cursor-pointer items-center justify-center overflow-hidden bg-primary text-on-primary ${
        phase === 'exit' ? 'pointer-events-none animate-splash-out' : ''
      }`}
    >
      {/* Flat shapes that pop in behind everything */}
      <span
        aria-hidden
        className="absolute -top-24 -right-24 size-64 animate-splash-pop rounded-full bg-secondary [animation-delay:0.1s] sm:size-80"
      />
      <span
        aria-hidden
        className="absolute -bottom-32 -left-20 size-60 animate-splash-pop rounded-full bg-primary-deep [animation-delay:0.2s] sm:size-72"
      />
      <LuStar
        aria-hidden
        className="absolute top-[47%] left-[5%] animate-twinkle text-2xl text-secondary sm:text-3xl"
      />
      <LuSparkles
        aria-hidden
        className="absolute top-[27%] right-[18%] animate-twinkle text-3xl text-secondary [animation-delay:0.5s] sm:text-4xl"
      />

      {/* Everything on top of the backdrop fades out first, then the backdrop follows. */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          phase === 'exit' ? 'animate-splash-content-out' : ''
        }`}
      >
        {images.slice(0, polaroids.length).map((src, index) => {
          const frame = polaroids[index]
          if (!frame) return null
          return (
            <div key={src} aria-hidden className={`absolute ${frame.place} ${frame.size}`}>
              <div className={`animate-splash-fly ${frame.delay}`}>
                <div className={index % 2 === 0 ? 'animate-float' : 'animate-float-slow'}>
                  <div className="rounded-2xl bg-surface p-1.5 shadow-2xl sm:rounded-3xl sm:p-2.5">
                    <img
                      src={src}
                      alt=""
                      className="aspect-[4/5] w-full rounded-xl object-cover sm:rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="relative flex w-full max-w-md flex-col items-center gap-4 sm:max-w-2xl px-6 text-center sm:gap-5">
          <span className="flex size-20 animate-splash-pop items-center justify-center rounded-[1.75rem] bg-secondary text-4xl text-on-secondary shadow-xl [animation-delay:0.15s] sm:size-28 sm:rounded-[2.25rem] sm:text-6xl">
            {icon}
          </span>
          <p className="animate-splash-rise font-display text-4xl font-bold tracking-tight [animation-delay:0.95s] sm:text-6xl lg:text-7xl">
            {title}
          </p>
          <p className="animate-splash-rise text-base font-medium opacity-90 [animation-delay:1.2s] sm:text-xl">
            {tagline}
          </p>

          <div className="mt-3 flex w-full max-w-64 flex-col items-center gap-2 sm:max-w-80">
            <div
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-2 w-full overflow-hidden rounded-full bg-white/25"
            >
              <div
                ref={barRef}
                className="h-full origin-left scale-x-0 rounded-full bg-secondary transition-transform duration-100 ease-linear"
              />
            </div>
            <div className="flex w-full items-center justify-between text-sm font-bold">
              <span className="truncate opacity-90">{message}</span>
              <span className="font-display tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>

        <p className="absolute bottom-5 text-xs font-medium tracking-wide uppercase opacity-70">
          Tap to skip
        </p>
      </div>

      {/* The camera flash */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-splash-flash bg-white opacity-0 [animation-delay:0.75s]"
      />
    </div>
  )
}
