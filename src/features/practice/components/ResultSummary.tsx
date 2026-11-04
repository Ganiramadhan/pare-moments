import { Fireworks } from '@/shared/components/ui/Fireworks'
import { useEffect, useRef } from 'react'
import { LuCheck, LuRotateCcw, LuStar, LuX } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { cn } from '@/shared/lib/utils'
import { practiceCopy } from '../constants'
import { usePlayer } from '../hooks/usePlayer'
import type { QuizResult } from '../types/practice'
import { messageFor, percentOf, starsFor } from '../utils/grade'
import type { ReactNode } from 'react'

type ResultSummaryProps = {
  result: QuizResult
  onRestart: () => void
  restartLabel?: string
  // Links to other places, e.g. back to practice.
  actions?: ReactNode
  // Extra content under the mistakes, e.g. the text of a story.
  extra?: ReactNode
}

// The end of a round: the score, stars, a kind message and every mistake explained.
export function ResultSummary({
  result,
  onRestart,
  restartLabel,
  actions,
  extra,
}: ResultSummaryProps) {
  const copy = practiceCopy.result
  const percent = percentOf(result.score, result.total)
  const stars = starsFor(percent)
  const { name } = usePlayer()
  const titleRef = useRef<HTMLHeadingElement>(null)

  // The result appears at the top of the screen, not wherever the last question left the page.
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <section aria-labelledby="result-title" className="flex flex-col gap-8">
      <Fireworks />
      <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-surface p-8 text-center shadow-sm ring-1 ring-line">
        <h2
          id="result-title"
          ref={titleRef}
          tabIndex={-1}
          className="scroll-mt-32 font-display text-3xl font-bold focus:outline-none"
        >
          {copy.title}
        </h2>
        <p role="img" aria-label={copy.stars(stars)} className="flex gap-2 text-5xl">
          {[1, 2, 3].map((n) => (
            <LuStar
              key={n}
              aria-hidden
              className={cn(n <= stars ? 'fill-secondary text-secondary' : 'text-line')}
            />
          ))}
        </p>
        <p className="font-display text-5xl font-bold text-primary">
          {copy.score(result.score, result.total)}
        </p>
        <p className="max-w-md text-lg text-muted">
          {name && percent >= 70 ? `${copy.congratulate(name)} ` : ''}
          {messageFor(percent)}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button type="button" onClick={onRestart} className={buttonStyles({ size: 'lg' })}>
            <LuRotateCcw aria-hidden />
            {restartLabel ?? copy.tryAgain}
          </button>
          {actions}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {result.wrong.length === 0 ? (
          <p className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
            <LuCheck aria-hidden />
            {copy.perfect}
          </p>
        ) : (
          <>
            <h3 className="font-display text-2xl font-bold">{copy.review}</h3>
            <ul className="flex flex-col gap-3">
              {result.wrong.map((item) => (
                <li
                  key={item.prompt}
                  className="flex flex-col gap-2 rounded-3xl bg-surface p-5 shadow-sm ring-1 ring-line"
                >
                  <p className="text-lg font-bold">{item.prompt}</p>
                  <p className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <LuX aria-hidden className="shrink-0" />
                    <span>
                      <span className="sr-only">{practiceCopy.quiz.yourOption}: </span>
                      {item.yours}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 font-bold text-primary">
                    <LuCheck aria-hidden className="shrink-0" />
                    <span>
                      <span className="sr-only">{practiceCopy.quiz.correctOption}: </span>
                      {item.correct}
                    </span>
                  </p>
                  {item.explanation ? <p className="text-muted">{item.explanation}</p> : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {extra}
    </section>
  )
}
