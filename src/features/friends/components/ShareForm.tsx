import { useState, type FormEvent } from 'react'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { Field, Input, Textarea } from '@/shared/components/ui/Field'
import { useCreateFriendMoment } from '../api/create-friend-moment'
import { InvalidCodeError } from '../api/friends-api'
import { MAX_CAPTION, MAX_NAME, MAX_PHOTOS, friendsCopy } from '../constants'
import { usePhotoQueue } from '../hooks/usePhotoQueue'
import type { FriendMoment } from '../types/friend-moment'
import { PhotoPicker } from './PhotoPicker'

type ShareFormProps = {
  token: string
  onShared: (moment: FriendMoment) => void
  // The backend no longer accepts the saved code, so ask for it again.
  onAccessLost: () => void
}

export function ShareForm({ token, onShared, onAccessLost }: ShareFormProps) {
  const [name, setName] = useState('')
  const [caption, setCaption] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const queue = usePhotoQueue(MAX_PHOTOS)
  const { mutate, isPending, isError } = useCreateFriendMoment()

  const ready = queue.items.flatMap((item) => (item.compressed ? [item.compressed] : []))
  const isPreparing = queue.items.some((item) => item.status === 'preparing')
  const hasFailed = queue.items.some((item) => item.status === 'error')

  const errors = {
    name: !name.trim()
      ? friendsCopy.nameRequired
      : name.trim().length > MAX_NAME
        ? friendsCopy.nameTooLong
        : undefined,
    caption: !caption.trim()
      ? friendsCopy.captionRequired
      : caption.trim().length > MAX_CAPTION
        ? friendsCopy.captionTooLong
        : undefined,
    photos: ready.length === 0 ? friendsCopy.photosRequired : undefined,
  }
  const isValid = !errors.name && !errors.caption && !errors.photos

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    if (!isValid) return

    mutate(
      { moment: { name, caption, photos: ready }, token },
      {
        onSuccess: onShared,
        onError: (error) => {
          if (error instanceof InvalidCodeError) onAccessLost()
        },
      },
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <section aria-labelledby="photos-label" className="flex flex-col gap-2">
        <h2 id="photos-label" className="text-sm font-bold">
          {friendsCopy.photos}
        </h2>
        <PhotoPicker
          items={queue.items}
          onAdd={queue.add}
          onRetry={queue.retry}
          onRemove={queue.remove}
        />
        {showErrors && errors.photos ? (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            {errors.photos}
          </p>
        ) : null}
      </section>

      <Field label={friendsCopy.name} htmlFor="name" error={showErrors ? errors.name : undefined}>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={friendsCopy.namePlaceholder}
          autoComplete="given-name"
        />
      </Field>
      <Field
        label={friendsCopy.caption}
        htmlFor="caption"
        error={showErrors ? errors.caption : undefined}
      >
        <Textarea
          id="caption"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder={friendsCopy.captionHint}
        />
      </Field>

      {isPreparing ? <p className="text-sm text-muted">{friendsCopy.waitForPhotos}</p> : null}
      {isError ? (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {friendsCopy.submitFailed}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || isPreparing || hasFailed}
        className={buttonStyles({ size: 'lg' })}
      >
        {isPending ? friendsCopy.submitting : friendsCopy.submit}
      </button>
    </form>
  )
}
