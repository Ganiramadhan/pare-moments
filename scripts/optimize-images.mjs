// Makes the website's photos light enough for phones.
//
//   1. Put your original photos (and videos) in `photos-src/`.
//   2. Run `pnpm images`.
//
// For every photo it writes three sizes (480, 960 and 1600px wide, WebP) into `public/images/`,
// strips private data such as GPS location, and records the sizes in
// `src/shared/lib/image-manifest.json`. The website picks the right size for each screen.
// Videos are copied as they are. Photos that did not change since the last run are skipped.
import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = path.join(root, 'photos-src')
const OUTPUT = path.join(root, 'public', 'images')
const MANIFEST = path.join(root, 'src', 'shared', 'lib', 'image-manifest.json')

const WIDTHS = [480, 960, 1600]
const QUALITY = 78
const IMAGE = /\.(jpe?g|png|webp)$/i
const VIDEO = /\.(mp4|webm|mov|m4v)$/i

const isFresh = async (input, output) => {
  try {
    return (await stat(output)).mtimeMs >= (await stat(input)).mtimeMs
  } catch {
    return false
  }
}

await mkdir(OUTPUT, { recursive: true })
const manifest = {}
let made = 0

for (const file of (await readdir(SOURCE)).sort()) {
  const input = path.join(SOURCE, file)
  const key = `/images/${file}`

  if (VIDEO.test(file)) {
    const output = path.join(OUTPUT, file)
    if (!(await isFresh(input, output))) {
      await copyFile(input, output)
      made += 1
    }
    continue
  }
  if (!IMAGE.test(file)) continue

  // Phone photos store "rotated" as a flag. Read the real, upright size.
  const meta = await sharp(input).metadata()
  const turned = (meta.orientation ?? 1) >= 5
  const width = turned ? meta.height : meta.width
  const height = turned ? meta.width : meta.height

  // Never make a size larger than the original; always make at least one.
  const sizes = WIDTHS.filter((w) => w < width)
  sizes.push(Math.min(width, WIDTHS.at(-1)))
  const base = file.replace(/\.[^.]+$/, '')

  const variants = []
  for (const w of [...new Set(sizes)].sort((a, b) => a - b)) {
    const name = `${base}-${w}.webp`
    const output = path.join(OUTPUT, name)
    if (!(await isFresh(input, output))) {
      await sharp(input)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(output)
      made += 1
    }
    variants.push({ width: w, src: `/images/${name}` })
  }
  manifest[key] = { width, height, variants }
}

await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Done. ${Object.keys(manifest).length} photos in the manifest, ${made} files written.`)
