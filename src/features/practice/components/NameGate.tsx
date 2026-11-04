import { useState, type FormEvent, type ReactNode } from 'react'
import { LuSmile } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { Field, Input } from '@/shared/components/ui/Field'
import { practiceCopy } from '../constants'
import { usePlayer } from '../hooks/usePlayer'
import { MAX_PLAYER_NAME } from '../utils/player'

type NameGateProps = {
  children: ReactNode
}

// Before a test, we suggest entering a name (skipping is fine). Once there is a name, or the visitor
// skipped for now, the test starts.
export function NameGate({ children }: NameGateProps) {
  const { name, skipped, save, skip } = usePlayer()
  const [draft, setDraft] = useState('')
  const copy = practiceCopy.player

  if (name || skipped) return children

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (draft.trim()) save(draft)
    else skip()
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-[2rem] bg-surface p-6 shadow-lg ring-1 ring-line sm:p-8"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 -rotate-6 items-center justify-center rounded-3xl bg-secondary text-3xl text-on-secondary shadow-md">
          <LuSmile aria-hidden />
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight">{copy.title}</h2>
        <p className="text-muted">{copy.text}</p>
      </div>
      <Field label={copy.label} htmlFor="player-name">
        <Input
          id="player-name"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_PLAYER_NAME}
          placeholder={copy.placeholder}
          autoComplete="given-name"
          autoFocus
        />
      </Field>
      <div className="flex flex-col gap-3">
        <button type="submit" disabled={!draft.trim()} className={buttonStyles({ size: 'lg' })}>
          {copy.save}
        </button>
        <button
          type="button"
          onClick={skip}
          className={buttonStyles({ variant: 'ghost', size: 'lg' })}
        >
          {copy.skip}
        </button>
      </div>
    </form>
  )
}
