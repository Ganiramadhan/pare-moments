import manifest from './image-manifest.json'

type Variant = { width: number; src: string }
type Entry = { width: number; height: number; variants: Variant[] }

// Made by `pnpm images`: every photo of the website with its sizes.
const entries = manifest as Record<string, Entry>

export type ImageSources = {
  // The biggest size, used when the browser does not understand srcset.
  src: string
  // Several sizes, so each screen downloads only what it needs.
  srcSet?: string
  // The real shape of the photo, which lets the page keep its place before the photo has loaded.
  width?: number
  height?: number
}

export const imageSources = (src: string): ImageSources => {
  const entry = entries[src]
  const best = entry?.variants.at(-1)
  if (!entry || !best) return { src }

  return {
    src: best.src,
    srcSet: entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
    width: entry.width,
    height: entry.height,
  }
}

// One size, for places that cannot use srcset (preloading, downloads, a fixed small thumbnail).
export const imageUrl = (src: string, minWidth: number) => {
  const variants = entries[src]?.variants
  if (!variants) return src
  return (variants.find((variant) => variant.width >= minWidth) ?? variants.at(-1))?.src ?? src
}
