const MAX_SIDE = 1600
const QUALITY = 0.8

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY))

/**
 * Shrinks a photo before upload: max 1600px on the long side, ~0.8 quality, WebP (JPEG where
 * WebP isn't supported). Re-encoding through a canvas drops EXIF data, including GPS location.
 */
export const compressImage = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not supported')
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  // Some browsers silently answer with PNG when asked for WebP, which would be huge.
  const webp = await toBlob(canvas, 'image/webp')
  const blob = webp?.type === 'image/webp' ? webp : await toBlob(canvas, 'image/jpeg')
  if (!blob) throw new Error('Could not compress the image')

  const name = file.name.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${name}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`, {
    type: blob.type,
  })
}
