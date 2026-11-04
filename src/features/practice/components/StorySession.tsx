import { useState, type ReactNode } from 'react'
import { LuArrowRight, LuBookOpen } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { practiceCopy } from '../constants'
import { useProgress } from '../hooks/useProgress'
import type { ListeningVersion, QuizResult } from '../types/practice'
import { percentOf } from '../utils/grade'
import { storyRound } from '../utils/listening-questions'
import { loadSeen, markSeen } from '../utils/seen'
import { AudioPlayer } from './AudioPlayer'
import { QuizRunner } from './QuizRunner'

type StorySessionProps = {
  version: ListeningVersion
  progressKey: string
  actions?: ReactNode
}

const newRound = (version: ListeningVersion, id: number) => ({
  id,
  ...storyRound(version, Math.random, loadSeen()),
})

// A listening round: first the story is read aloud, then come multiple-choice and fill-in-the-blank
// questions about it. The story can be heard again during the questions, and its text is shown at the
// end.
export function StorySession({ version, progressKey, actions }: StorySessionProps) {
  const copy = practiceCopy.listening
  const { record } = useProgress()
  const [round, setRound] = useState(() => newRound(version, 0))
  const [listening, setListening] = useState(true)

  if (listening) {
    return (
      <section aria-label={copy.storyLabel} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-primary">{copy.listenFirst}</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{round.title}</h2>
          <p className="text-muted">{copy.storyHelp}</p>
        </div>
        <AudioPlayer key={round.id} text={round.text} autoPlay />
        <button
          type="button"
          onClick={() => setListening(false)}
          className={buttonStyles({ size: 'lg' })}
        >
          {copy.ready}
          <LuArrowRight aria-hidden />
        </button>
      </section>
    )
  }

  return (
    <QuizRunner
      key={round.id}
      questions={round.questions}
      actions={actions}
      header={<AudioPlayer text={round.text} />}
      summaryExtra={
        <details className="rounded-3xl bg-surface p-5 ring-1 ring-line">
          <summary className="flex cursor-pointer items-center gap-2 font-bold text-primary">
            <LuBookOpen aria-hidden />
            {copy.readStory}
          </summary>
          <p className="mt-3 leading-relaxed">{round.text}</p>
        </details>
      }
      onFinish={(result: QuizResult) => {
        record(progressKey, percentOf(result.score, result.total))
        markSeen(round.questions.map((question) => question.seenKey ?? question.id))
      }}
      onRestart={() => {
        setRound((current) => newRound(version, current.id + 1))
        setListening(true)
      }}
    />
  )
}
