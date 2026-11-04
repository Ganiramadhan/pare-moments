import { useEffect } from 'react'
import { LuHeadphones, LuPlay, LuTurtle } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSpeech } from '@/shared/hooks/useSpeech'
import { practiceCopy } from '../constants'

type AudioPlayerProps = {
  // The English text to read out loud. It is never shown here.
  text: string
  // Start reading as soon as the question appears.
  autoPlay?: boolean
}

// A big "play" button for listening questions, with a slow reading too.
export function AudioPlayer({ text, autoPlay = false }: AudioPlayerProps) {
  const { supported, speaking, speak } = useSpeech()
  const copy = practiceCopy.listening

  // A new question starts talking by itself (the visitor just pressed a button to get here).
  useEffect(() => {
    if (autoPlay) speak(text)
  }, [autoPlay, speak, text])

  if (!supported)
    return (
      <p role="alert" className="text-muted">
        {copy.unsupported}
      </p>
    )

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-primary-soft p-4 ring-1 ring-line">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-2xl bg-primary text-2xl text-on-primary"
      >
        <LuHeadphones />
      </span>
      <span className="mr-auto font-bold">{copy.audioLabel}</span>
      <button
        type="button"
        onClick={() => speak(text)}
        aria-pressed={speaking}
        className={buttonStyles({ size: 'md' })}
      >
        <LuPlay aria-hidden />
        {speaking ? copy.replay : copy.play}
      </button>
      <button
        type="button"
        onClick={() => speak(text, { rate: 0.6 })}
        className={buttonStyles({ variant: 'ghost', size: 'md' })}
      >
        <LuTurtle aria-hidden />
        {copy.playSlowly}
      </button>
    </div>
  )
}
