// Draws the website's icon and social preview image. Run it with `pnpm brand` after changing the
// design below. It writes into `public/`: favicon.svg, favicon.ico, apple-touch-icon.png, the PWA
// icons (icon-192.png, icon-512.png, icon-maskable-512.png) and og-image.png (the picture shown
// when the link is shared on WhatsApp, Twitter, etc.).
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = (name) => path.join(root, 'public', name)

const TEAL = '#0d9488'
const TEAL_DEEP = '#0a6b62'
const TEAL_LIGHT = '#2dd4bf'
const AMBER = '#f59e0b'

// A tilted polaroid with a little landscape in it, on the brand color.
const polaroid = `
  <g transform="rotate(-8 256 262)">
    <rect x="132" y="104" width="248" height="304" rx="30" fill="#fff"/>
    <rect x="154" y="126" width="204" height="196" rx="18" fill="${TEAL_DEEP}"/>
    <circle cx="298" cy="190" r="31" fill="${AMBER}"/>
    <path d="M154 322V274l52-48 42 44 38-32 72 60v24z" fill="${TEAL_LIGHT}"/>
    <rect x="178" y="352" width="116" height="14" rx="7" fill="${TEAL}" opacity="0.4"/>
  </g>`

const icon = ({ rounded, scale = 1 }) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" ${rounded ? 'rx="112"' : ''} fill="${TEAL}"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <circle cx="410" cy="102" r="86" fill="${AMBER}"/>
    ${polaroid}
  </g>
</svg>`

const png = (svg, size, file) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(out(file))

await writeFile(out('favicon.svg'), icon({ rounded: true }).trim() + '\n')
await png(icon({ rounded: true }), 192, 'icon-192.png')
await png(icon({ rounded: true }), 512, 'icon-512.png')
// "Maskable" icons are cut into a circle or rounded shape by the phone: keep the art in the middle.
await png(icon({ rounded: false, scale: 0.78 }), 512, 'icon-maskable-512.png')
// iPhones round the corners themselves, so the icon is a full square.
await png(icon({ rounded: false, scale: 0.9 }), 180, 'apple-touch-icon.png')

// favicon.ico is a small header around a PNG picture.
const ico = await sharp(Buffer.from(icon({ rounded: true })))
  .resize(48, 48)
  .png()
  .toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // one image
header.writeUInt8(48, 6) // width
header.writeUInt8(48, 7) // height
header.writeUInt16LE(1, 10) // color planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(ico.length, 14) // image size
header.writeUInt32LE(22, 18) // image offset
await writeFile(out('favicon.ico'), Buffer.concat([header, ico]))

// The social preview: brand color, a fan of three real photos and the name.
const W = 1200
const H = 630
const frame = (file, x, y, rotate) =>
  sharp(path.join(root, 'public', 'images', file))
    .resize(236, 300, { fit: 'cover' })
    .extend({ top: 16, left: 16, right: 16, bottom: 16, background: '#ffffff' })
    .png()
    .toBuffer()
    .then((input) =>
      sharp(input)
        .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
        .then((rotated) => ({ input: rotated, left: x, top: y })),
    )

const text = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <circle cx="1130" cy="40" r="190" fill="${AMBER}"/>
  <circle cx="60" cy="640" r="170" fill="${TEAL_DEEP}"/>
  <rect x="80" y="150" width="330" height="48" rx="24" fill="${AMBER}"/>
  <text x="245" y="184" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#1c1203" text-anchor="middle">Kampung Inggris, Pare</text>
  <text x="80" y="330" font-family="Arial Rounded MT Bold, Arial, Helvetica, sans-serif" font-size="108" font-weight="800" fill="#06302c">Pare</text>
  <text x="80" y="440" font-family="Arial Rounded MT Bold, Arial, Helvetica, sans-serif" font-size="108" font-weight="800" fill="#06302c">Moments</text>
  <rect x="80" y="456" width="440" height="14" rx="7" fill="${AMBER}"/>
  <text x="80" y="525" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#06302c">Photos and stories from my English journey</text>
</svg>`

await sharp({ create: { width: W, height: H, channels: 4, background: TEAL } })
  .composite([
    { input: Buffer.from(text), left: 0, top: 0 },
    await frame('day-1-1-960.webp', 690, 215, -9),
    await frame('day-3-1-960.webp', 905, 235, 8),
    await frame('day-2-1-960.webp', 800, 60, 1),
  ])
  .png()
  .toFile(out('og-image.png'))

console.log('Brand assets written to public/.')
