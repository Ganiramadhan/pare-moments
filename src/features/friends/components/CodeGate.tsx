import { useState, type FormEvent } from 'react'
import { LuKeyRound } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { Field, Input } from '@/shared/components/ui/Field'
import { useVerifyCode } from '../api/verify-code'
import { friendsCopy } from '../constants'

type CodeGateProps = {
  onVerified: (token: string) => void
}

export function CodeGate({ onVerified }: CodeGateProps) {
  const [code, setCode] = useState('')
  const [empty, setEmpty] = useState(false)
  const { mutate, isPending, isError } = useVerifyCode()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const isEmpty = code.trim() === ''
    setEmpty(isEmpty)
    if (!isEmpty) mutate(code, { onSuccess: ({ token }) => onVerified(token) })
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-[2rem] bg-surface p-6 shadow-lg ring-1 ring-line sm:p-8"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 -rotate-6 items-center justify-center rounded-3xl bg-secondary text-3xl text-on-secondary shadow-md">
          <LuKeyRound aria-hidden />
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight">{friendsCopy.gateTitle}</h2>
        <p className="text-muted">{friendsCopy.gateBody}</p>
      </div>
      <Field
        label={friendsCopy.code}
        htmlFor="class-code"
        error={empty ? friendsCopy.codeRequired : isError ? friendsCopy.codeInvalid : undefined}
      >
        <Input
          id="class-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          className="text-center font-display text-2xl font-semibold tracking-[0.3em] uppercase"
        />
      </Field>
      <button type="submit" disabled={isPending} className={buttonStyles({ size: 'lg' })}>
        {isPending ? friendsCopy.codeChecking : friendsCopy.codeSubmit}
      </button>
    </form>
  )
}
