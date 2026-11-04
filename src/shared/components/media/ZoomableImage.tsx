import { useImperativeHandle, useRef, type PointerEvent, type Ref, type WheelEvent } from 'react'
import { imageSources } from '@/shared/lib/images'

const MAX_SCALE = 4
const TAP_ZOOM = 2.5
const DOUBLE_TAP_MS = 300
const TAP_SLOP_PX = 30
const DRAG_SLOP_PX = 6

export type ZoomHandle = {
  // Zoom in on the middle of the photo, or back out when already zoomed in.
  toggle: () => void
}

type ZoomableImageProps = {
  src: string
  alt: string
  onZoomChange: (zoomed: boolean) => void
  ref?: Ref<ZoomHandle>
}

type Point = { x: number; y: number }

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

// A photo that can be zoomed with a double tap or double click, pinched with two fingers, zoomed
// with the mouse wheel, and dragged around once it is zoomed in. Give it a `key` per photo, so each
// new photo starts fully zoomed out. The movement is written straight
// to the element (not through React state), so it stays smooth while a finger is moving.
export function ZoomableImage({ src, alt, onZoomChange, ref }: ZoomableImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const view = useRef({ scale: 1, x: 0, y: 0 })
  const pointers = useRef(new Map<number, Point>())
  const pinch = useRef({ distance: 0, scale: 1 })
  const tap = useRef({ time: 0, x: 0, y: 0 })
  const travelled = useRef(0)
  const photo = imageSources(src)

  const apply = (scale: number, x: number, y: number) => {
    const img = imgRef.current
    if (!img) return
    const next = Math.min(MAX_SCALE, Math.max(1, scale))
    // The photo can be dragged only as far as its edge, never off into empty space.
    const maxX = Math.max(0, (img.offsetWidth * next - window.innerWidth) / 2)
    const maxY = Math.max(0, (img.offsetHeight * next - window.innerHeight) / 2)
    const nx = next === 1 ? 0 : Math.min(maxX, Math.max(-maxX, x))
    const ny = next === 1 ? 0 : Math.min(maxY, Math.max(-maxY, y))
    view.current = { scale: next, x: nx, y: ny }
    img.style.transform = next === 1 ? '' : `translate3d(${nx}px, ${ny}px, 0) scale(${next})`
    img.dataset.zoomed = String(next > 1)
    onZoomChange(next > 1)
  }

  // Zoom in so that the point under the finger stays where it is.
  const zoomAt = (point: Point) => {
    const img = imgRef.current
    if (!img) return
    if (view.current.scale > 1) return apply(1, 0, 0)
    const box = img.getBoundingClientRect()
    apply(
      TAP_ZOOM,
      (box.left + box.width / 2 - point.x) * (TAP_ZOOM - 1),
      (box.top + box.height / 2 - point.y) * (TAP_ZOOM - 1),
    )
  }

  useImperativeHandle(ref, () => ({
    toggle: () => {
      if (view.current.scale > 1) apply(1, 0, 0)
      else apply(TAP_ZOOM, 0, 0)
    },
  }))

  const onPointerDown = (event: PointerEvent<HTMLImageElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId)
    if (pointers.current.size === 0) travelled.current = 0
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { distance: distance(a!, b!), scale: view.current.scale }
      travelled.current = Infinity
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLImageElement>) => {
    const before = pointers.current.get(event.pointerId)
    if (!before) return
    const now = { x: event.clientX, y: event.clientY }
    pointers.current.set(event.pointerId, now)

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      apply(
        (pinch.current.scale * distance(a!, b!)) / pinch.current.distance,
        view.current.x,
        view.current.y,
      )
      return
    }
    travelled.current += Math.abs(now.x - before.x) + Math.abs(now.y - before.y)
    if (view.current.scale > 1)
      apply(
        view.current.scale,
        view.current.x + now.x - before.x,
        view.current.y + now.y - before.y,
      )
  }

  const onPointerUp = (event: PointerEvent<HTMLImageElement>) => {
    pointers.current.delete(event.pointerId)
    // A mouse double click is handled by onDoubleClick; fingers need their own double tap.
    if (
      event.pointerType !== 'touch' ||
      travelled.current > DRAG_SLOP_PX ||
      pointers.current.size > 0
    )
      return
    const now = Date.now()
    const point = { x: event.clientX, y: event.clientY }
    const last = tap.current
    if (now - last.time < DOUBLE_TAP_MS && distance(point, last) < TAP_SLOP_PX) {
      tap.current = { time: 0, x: 0, y: 0 }
      zoomAt(point)
    } else {
      tap.current = { time: now, ...point }
    }
  }

  const onWheel = (event: WheelEvent<HTMLImageElement>) => {
    const { scale, x, y } = view.current
    apply(scale * (event.deltaY < 0 ? 1.2 : 1 / 1.2), x, y)
  }

  return (
    <img
      ref={imgRef}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? '100vw' : undefined}
      alt={alt}
      draggable={false}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => zoomAt({ x: event.clientX, y: event.clientY })}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      className="max-h-full max-w-full cursor-zoom-in touch-none rounded-2xl object-contain shadow-2xl select-none data-[zoomed=true]:cursor-grab"
    />
  )
}
