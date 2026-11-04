import { useRef, useState } from 'react'
import { LuImagePlus, LuX } from 'react-icons/lu'
import { cn } from '@/shared/lib/utils'
import { MAX_PHOTOS, friendsCopy } from '../constants'
import type { PhotoItem } from '../hooks/usePhotoQueue'

type PhotoPickerProps = {
  items: PhotoItem[]
  onAdd: (files: File[]) => void
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}

const imageFiles = (list: FileList | null) =>
  Array.from(list ?? []).filter((file) => file.type.startsWith('image/'))

export function PhotoPicker({ items, onAdd, onRetry, onRemove }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const full = items.length >= MAX_PHOTOS

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        data-testid="photo-input"
        onChange={(event) => {
          onAdd(imageFiles(event.target.files))
          event.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={full}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!full) onAdd(imageFiles(event.dataTransfer.files))
        }}
        className={cn(
          'flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-6 text-center transition disabled:opacity-50',
          dragging
            ? 'border-primary bg-primary-soft'
            : 'border-line bg-surface hover:border-primary hover:bg-primary-soft',
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-3xl text-on-secondary">
          <LuImagePlus aria-hidden />
        </span>
        <span className="font-display text-xl font-semibold">{friendsCopy.addPhotos}</span>
        <span className="text-sm text-muted">
          {friendsCopy.dropHint} · {friendsCopy.photosLimit}
        </span>
      </button>

      {items.length > 0 ? (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="relative aspect-square rounded-2xl bg-surface p-1.5 shadow-sm ring-1 ring-line"
            >
              <img
                src={item.previewUrl}
                alt={`Photo ${index + 1} of ${items.length}`}
                className="size-full rounded-xl object-cover"
              />
              {item.status === 'done' ? null : (
                <div className="absolute inset-1.5 flex items-center justify-center rounded-xl bg-black/60 p-1 text-center text-xs font-bold text-white">
                  {item.status === 'error' ? (
                    <button
                      type="button"
                      onClick={() => onRetry(item.id)}
                      className="min-h-11 px-1"
                    >
                      {friendsCopy.photoFailed}
                    </button>
                  ) : (
                    friendsCopy.preparing
                  )}
                </div>
              )}
              <button
                type="button"
                aria-label={`${friendsCopy.removePhoto} ${index + 1}`}
                onClick={() => onRemove(item.id)}
                className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-fg text-bg shadow-md"
              >
                <LuX aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
