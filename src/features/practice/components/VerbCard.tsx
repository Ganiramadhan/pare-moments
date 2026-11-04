import { useState } from 'react'
import { LuRotateCw } from 'react-icons/lu'
import { cn } from '@/shared/lib/utils'
import { practiceCopy } from '../constants'
import type { Verb } from '../types/practice'
import { SpeakButton } from './SpeakButton'

type VerbCardProps = {
  verb: Verb
  tone: 'primary' | 'secondary'
}

const tones = {
  primary: { front: 'bg-primary-soft text-fg', back: 'bg-primary text-on-primary' },
  secondary: { front: 'bg-secondary-soft text-fg', back: 'bg-secondary text-on-secondary' },
}

const faceClass =
  'absolute inset-0 flex flex-col justify-between rounded-3xl p-5 shadow-sm ring-1 ring-line [backface-visibility:hidden]'

// A flash card: V1 and what it means on the front; V1, V2 and V3 with an example on the back.
export function VerbCard({ verb, tone }: VerbCardProps) {
  const [flipped, setFlipped] = useState(false)
  const copy = practiceCopy.verbs

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
        className="block h-60 w-full cursor-pointer text-left [perspective:1000px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span
          data-flipped={flipped}
          className="relative block size-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none data-[flipped=true]:[transform:rotateY(180deg)]"
        >
          <span aria-hidden={flipped} className={cn(faceClass, tones[tone].front)}>
            <span className="text-xs font-extrabold tracking-widest text-muted uppercase">
              {verb.irregular ? copy.irregular : copy.regular}
            </span>
            <span>
              <span className="block font-display text-4xl font-bold">{verb.base}</span>
              <span className="text-lg text-muted">{verb.meaning}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              <LuRotateCw aria-hidden />
              {copy.flip}
            </span>
          </span>
          <span
            aria-hidden={!flipped}
            className={cn(faceClass, tones[tone].back, '[transform:rotateY(180deg)]')}
          >
            <span className="grid grid-cols-3 gap-2 text-center">
              {[
                ['V1', verb.base],
                ['V2', verb.past],
                ['V3', verb.participle],
              ].map(([label, form]) => (
                <span key={label} className="flex flex-col">
                  <span className="text-xs font-extrabold tracking-widest uppercase opacity-80">
                    {label}
                  </span>
                  <span className="font-display text-xl font-bold break-words">{form}</span>
                </span>
              ))}
            </span>
            <span className="text-sm leading-relaxed opacity-90">
              &ldquo;{verb.sentences.v2}&rdquo;
            </span>
          </span>
        </span>
      </button>
      <SpeakButton text={`${verb.base}, ${verb.past}, ${verb.participle}`} />
    </div>
  )
}
