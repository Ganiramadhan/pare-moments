import { LuVolume2 } from 'react-icons/lu'
import { useSpeech } from '@/shared/hooks/useSpeech'
import { cn } from '@/shared/lib/utils'
import { practiceCopy } from '../constants'

type SpeakButtonProps = {
  text: string
  // Also offer a slow reading, handy for long sentences.
  slow?: boolean
  // Only the speaker icon, for tight places such as a table row.
  compact?: boolean
  className?: string
}

const buttonClass =
  'inline-flex min-h-10 items-center gap-2 rounded-full bg-surface px-4 text-sm font-bold text-primary ring-1 ring-line transition hover:bg-primary-soft'

// "Listen" buttons that read an English text out loud. Nothing is shown where the browser cannot
// speak.
export function SpeakButton({ text, slow = false, compact = false, className }: SpeakButtonProps) {
  const { supported, speaking, speak } = useSpeech()
  if (!supported) return null

  return (
    <span className={cn('inline-flex gap-2', className)}>
      <button
        type="button"
        onClick={() => speak(text)}
        className={cn(buttonClass, compact && 'size-10 justify-center px-0')}
        aria-pressed={speaking}
        aria-label={compact ? practiceCopy.quiz.listen : undefined}
      >
        <LuVolume2 aria-hidden />
        {compact ? null : practiceCopy.quiz.listen}
      </button>
      {slow ? (
        <button type="button" onClick={() => speak(text, { rate: 0.65 })} className={buttonClass}>
          {practiceCopy.quiz.listenSlowly}
        </button>
      ) : null}
    </span>
  )
}
