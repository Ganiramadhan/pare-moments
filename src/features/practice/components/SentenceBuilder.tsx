import { useMemo, useState, type ReactNode } from 'react'
import { LuArrowRight, LuCircleCheck, LuCircleX, LuRotateCcw } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { cn } from '@/shared/lib/utils'
import { practiceCopy, SENTENCE_ROUND } from '../constants'
import type { QuizResult, SentenceItem } from '../types/practice'
import { draw } from '../utils/draw'
import { shuffle } from '../utils/random'
import { loadSeen, markSeen } from '../utils/seen'
import { ResultSummary } from './ResultSummary'
import { SpeakButton } from './SpeakButton'

type SentenceBuilderProps = {
  bank: SentenceItem[]
  onFinish: (result: QuizResult) => void
  onRestart: () => void
  actions?: ReactNode
  // Only for tests: how many sentences are in a round.
  count?: number
}

type Round = { item: SentenceItem; words: string[] }

const chipClass =
  'inline-flex min-h-11 items-center rounded-full px-4 text-base font-bold ring-1 transition'

// Builds a sentence from shuffled words: tap the words in order, check, and see the right answer.
export function SentenceBuilder({
  bank,
  onFinish,
  onRestart,
  actions,
  count = SENTENCE_ROUND,
}: SentenceBuilderProps) {
  const copy = practiceCopy.sentences
  const rounds = useMemo<Round[]>(
    () =>
      draw(
        bank.map((item) => ({ item, id: `sentence-${item.english}` })),
        count,
        loadSeen(),
        Math.random,
      ).map(({ item }) => ({ item, words: shuffle(item.english.split(' ')) })),
    [bank, count],
  )
  const [index, setIndex] = useState(0)
  // The words tapped so far, as places in the shuffled list (so a repeated word is not mixed up).
  const [placed, setPlaced] = useState<number[]>([])
  const [checked, setChecked] = useState<boolean | null>(null)
  const [wrong, setWrong] = useState<QuizResult['wrong']>([])

  const round = rounds[index]
  const isLast = index === rounds.length - 1

  if (!round) {
    return (
      <ResultSummary
        result={{ score: rounds.length - wrong.length, total: rounds.length, wrong }}
        onRestart={onRestart}
        restartLabel={practiceCopy.result.newRound}
        actions={actions}
      />
    )
  }

  const sentence = placed.map((place) => round.words[place]).join(' ')
  const complete = placed.length === round.words.length
  const locked = checked !== null

  const check = () => {
    const right = sentence === round.item.english
    setChecked(right)
    if (!right) {
      setWrong((current) => [
        ...current,
        { prompt: round.item.indonesian, yours: sentence, correct: round.item.english },
      ])
    }
  }

  const next = () => {
    if (isLast) {
      const finalWrong = wrong
      markSeen(rounds.map((r) => `sentence-${r.item.english}`))
      onFinish({
        score: rounds.length - finalWrong.length,
        total: rounds.length,
        wrong: finalWrong,
      })
    }
    setIndex((current) => current + 1)
    setPlaced([])
    setChecked(null)
  }

  return (
    <section aria-label="Sentence builder" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-extrabold tracking-widest text-muted uppercase">
          {practiceCopy.quiz.questionOf(index + 1, rounds.length)}
        </p>
        <p className="font-bold text-primary">{copy.prompt}</p>
        <h2 className="font-display text-3xl leading-snug font-bold sm:text-4xl">
          {round.item.indonesian}
        </h2>
      </div>

      <div
        aria-label={copy.yourSentence}
        className={cn(
          'flex min-h-24 flex-wrap items-center gap-2 rounded-3xl border-2 border-dashed p-4',
          checked === true && 'border-primary bg-primary-soft',
          checked === false && 'border-red-400 bg-red-50 dark:bg-red-950/40',
          checked === null && 'border-line bg-surface',
        )}
      >
        {placed.length === 0 ? <span className="text-muted">{copy.emptyAnswer}</span> : null}
        {placed.map((place, position) => (
          <button
            key={`${place}-${position}`}
            type="button"
            disabled={locked}
            onClick={() => setPlaced((current) => current.filter((_, n) => n !== position))}
            aria-label={copy.remove(round.words[place]!)}
            className={cn(chipClass, 'bg-primary text-on-primary ring-primary disabled:opacity-90')}
          >
            {round.words[place]}
          </button>
        ))}
      </div>

      <div role="group" aria-label={copy.wordBank} className="flex flex-wrap gap-2">
        {round.words.map((word, place) =>
          placed.includes(place) ? (
            <span
              key={place}
              aria-hidden
              className={cn(chipClass, 'bg-line text-transparent ring-line select-none')}
            >
              {word}
            </span>
          ) : (
            <button
              key={place}
              type="button"
              disabled={locked}
              onClick={() => setPlaced((current) => [...current, place])}
              aria-label={copy.add(word)}
              className={cn(
                chipClass,
                'bg-surface ring-line hover:bg-primary-soft hover:ring-primary',
              )}
            >
              {word}
            </button>
          ),
        )}
      </div>

      {locked ? (
        <div
          role="status"
          className={cn(
            'flex flex-col gap-3 rounded-3xl p-5 ring-1',
            checked ? 'bg-primary-soft ring-primary' : 'bg-secondary-soft ring-secondary',
          )}
        >
          <p className="flex items-center gap-2 font-display text-2xl font-bold">
            {checked ? (
              <LuCircleCheck aria-hidden className="text-primary" />
            ) : (
              <LuCircleX aria-hidden className="text-red-600 dark:text-red-300" />
            )}
            {checked ? copy.correct : copy.wrong}
          </p>
          {!checked ? (
            <p className="leading-relaxed">
              {copy.rightAnswer} <strong>{round.item.english}</strong>
            </p>
          ) : null}
          <SpeakButton text={round.item.english} slow />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {locked ? (
          <button type="button" onClick={next} className={buttonStyles({ size: 'lg' })}>
            {isLast ? copy.finish : copy.next}
            <LuArrowRight aria-hidden />
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={check}
              disabled={!complete}
              className={buttonStyles({ size: 'lg' })}
            >
              {copy.check}
            </button>
            <button
              type="button"
              onClick={() => setPlaced([])}
              disabled={placed.length === 0}
              className={buttonStyles({ variant: 'ghost', size: 'lg' })}
            >
              <LuRotateCcw aria-hidden />
              {copy.reset}
            </button>
          </>
        )}
      </div>
    </section>
  )
}
