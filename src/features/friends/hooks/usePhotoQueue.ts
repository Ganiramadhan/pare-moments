import { useCallback, useEffect, useRef, useState } from 'react'
import { compressImage } from '@/shared/lib/image-compress'

export type PhotoStatus = 'preparing' | 'done' | 'error'

export type PhotoItem = {
  id: string
  file: File
  previewUrl: string
  status: PhotoStatus
  // The compressed photo, ready to upload.
  compressed?: File
}

export function usePhotoQueue(max: number) {
  const [items, setItems] = useState<PhotoItem[]>([])
  const latest = useRef(items)

  useEffect(() => {
    latest.current = items
  }, [items])

  // Free the local previews when the form goes away.
  useEffect(() => () => latest.current.forEach((item) => URL.revokeObjectURL(item.previewUrl)), [])

  const patch = useCallback((id: string, changes: Partial<PhotoItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)))
  }, [])

  // Compress in the browser first; a failure leaves the photo retryable.
  const process = useCallback(
    async (id: string, file: File) => {
      patch(id, { status: 'preparing' })
      try {
        patch(id, { status: 'done', compressed: await compressImage(file) })
      } catch {
        patch(id, { status: 'error' })
      }
    },
    [patch],
  )

  const add = (files: File[]) => {
    const added = files.slice(0, max - items.length).map<PhotoItem>((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'preparing',
    }))
    setItems((current) => [...current, ...added])
    added.forEach((item) => void process(item.id, item.file))
  }

  const retry = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (item) void process(id, item.file)
  }

  const remove = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (item) URL.revokeObjectURL(item.previewUrl)
    setItems((current) => current.filter((i) => i.id !== id))
  }

  return { items, add, retry, remove }
}
