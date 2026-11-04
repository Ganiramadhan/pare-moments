import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { LuArrowRight, LuCircleCheck, LuCircleX } from 'react-icons/lu'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { Field, Input } from '@/shared/components/ui/Field'
import { cn } from '@/shared/lib/utils'
import { practiceCopy } from '../constants'
import type { Question, QuizResult } from '../types/practice'
import { isBlankCorrect } from '../utils/blank'
import { ResultSummary } from './ResultSummary'
import { SpeakButton } from './SpeakButton'

type QuizRunnerProps = {
  questions: Question[]
  // Called once, when the last question has been answered and "See my result" is pressed.
  onFinish: (result: QuizResult) => void
  onRestart: () => void
  // Links shown next to "Try again" at the end.
  actions?: ReactNode
  // Shown above every question (e.g. a player to hear the story again).
  header?: ReactNode
  // Shown under the result (e.g. the text of the story).
  summaryExtra?: ReactNode
}

// What the visitor answered: whether it was right, and the answer as it is shown in the review.
type Given = { correct: boolean; shown: string }

const rightAnswer = (question: Question) =>
  question.blank ? question.blank.answers[0]! : question.options[question.correctIndex]!

const buildResult = (questions: Question[], given: Given[]): QuizResult => {
  const wrong = questions.flatMap((question, index) => {
    const answer = given[index]
    if (!answer || answer.correct) return []
    return [
      {
        prompt: question.prompt,
        yours: answer.shown,
        correct: rightAnswer(question),
        explanation: question.explanation,
      },
    ]
  })
  return { score: questions.length - wrong.length, total: questions.length, wrong }
}

const optionClass = (state: 'idle' | 'correct' | 'wrong' | 'dim') =>
  cn(
    'flex min-h-14 w-full items-center gap-3 rounded-2xl px-5 py-3 text-left text-lg font-bold ring-1 transition',
    state === 'idle' && 'bg-surface ring-line hover:bg-primary-soft hover:ring-primary',
    state === 'correct' && 'bg-primary-soft text-fg ring-2 ring-primary',
    state === 'wrong' &&
      'bg-red-50 text-red-900 ring-2 ring-red-400 dark:bg-red-950/50 dark:text-red-100 dark:ring-red-500',
    state === 'dim' && 'bg-surface text-muted opacity-60 ring-line',
  )

// Runs a round of questions: one at a time, either "pick the right answer" or "type the missing
// word", with instant feedback and an explanation, and a result with the mistakes at the end. It works
// for verbs, grammar and listening alike.
export function QuizRunner({
  questions,
  onFinish,
  onRestart,
  actions,
  header,
  summaryExtra,
}: QuizRunnerProps) {
  const copy = practiceCopy.quiz
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [given, setGiven] = useState<Given[]>([])
  const nextRef = useRef<HTMLButtonElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const question = questions[index]
  const isBlank = Boolean(question?.blank)
  const answered = isBlank ? checked : chosen !== null
  const isLast = index === questions.length - 1
  const wasRight = given[index]?.correct === true

  const choose = (option: number) => {
    if (answered || !question || isBlank) return
    setChosen(option)
    setGiven((current) => [
      ...current,
      { correct: option === question.correctIndex, shown: question.options[option]! },
    ])
  }

  const submitBlank = (event: FormEvent) => {
    event.preventDefault()
    if (answered || !question?.blank || !typed.trim()) return
    setChecked(true)
    setGiven((current) => [
      ...current,
      { correct: isBlankCorrect(typed, question.blank!.answers), shown: typed.trim() },
    ])
  }

  const next = () => {
    if (isLast) onFinish(buildResult(questions, given))
    setChosen(null)
    setTyped('')
    setChecked(false)
    setIndex((current) => current + 1)
  }

  // After answering, "Next" is ready for Enter; a new question puts the reader at its top (or in
  // the box, when the answer is typed).
  useEffect(() => {
    if (answered) nextRef.current?.focus()
  }, [answered])
  useEffect(() => {
    if (isBlank) inputRef.current?.focus()
    else questionRef.current?.focus()
  }, [index, isBlank])

  // Keys 1 to 4 pick an answer.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const number = Number(event.key)
      if (number >= 1 && number <= (question?.options.length ?? 0)) choose(number - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (!question) {
    return (
      <ResultSummary
        result={buildResult(questions, given)}
        onRestart={onRestart}
        actions={actions}
        extra={summaryExtra}
      />
    )
  }

  return (
    <section aria-label="Quiz" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <ol aria-label={copy.progress} className="flex gap-1.5">
          {questions.map((q, n) => (
            <li
              key={q.id}
              aria-current={n === index ? 'step' : undefined}
              className={cn(
                'h-2 flex-1 rounded-full transition',
                n < index ? 'bg-primary' : n === index ? 'bg-secondary' : 'bg-line',
              )}
            />
          ))}
        </ol>
        <p className="text-sm font-extrabold tracking-widest text-muted uppercase">
          {copy.questionOf(index + 1, questions.length)}
        </p>
      </div>

      {header}

      <div
        ref={questionRef}
        tabIndex={-1}
        className="flex scroll-mt-32 flex-col gap-2 focus:outline-none"
      >
        {question.hint ? <p className="font-bold text-primary">{question.hint}</p> : null}
        <h2 className="font-display text-3xl leading-snug font-bold sm:text-4xl">
          {question.prompt}
        </h2>
      </div>

      {question.blank ? (
        <form onSubmit={submitBlank} className="flex flex-col gap-4">
          <Field label={copy.typeTheWord} htmlFor="blank-answer">
            <Input
              id="blank-answer"
              ref={inputRef}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              disabled={answered}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="text-lg"
            />
          </Field>
          {answered ? null : (
            <button type="submit" disabled={!typed.trim()} className={buttonStyles({ size: 'lg' })}>
              {copy.check}
            </button>
          )}
        </form>
      ) : (
        <ul className="flex flex-col gap-3">
          {question.options.map((option, n) => {
            const state = !answered
              ? 'idle'
              : n === question.correctIndex
                ? 'correct'
                : n === chosen
                  ? 'wrong'
                  : 'dim'
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => choose(n)}
                  aria-disabled={answered}
                  className={optionClass(state)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg text-sm font-extrabold ring-1 ring-line">
                    {n + 1}
                  </span>
                  <span className="flex-1">{option}</span>
                  {state === 'correct' ? (
                    <>
                      <LuCircleCheck aria-hidden className="shrink-0 text-2xl text-primary" />
                      <span className="sr-only">{copy.correctOption}</span>
                    </>
                  ) : null}
                  {state === 'wrong' ? (
                    <>
                      <LuCircleX
                        aria-hidden
                        className="shrink-0 text-2xl text-red-600 dark:text-red-300"
                      />
                      <span className="sr-only">{copy.yourOption}</span>
                    </>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {answered ? (
        <div
          role="status"
          className={cn(
            'flex flex-col gap-3 rounded-3xl p-5 ring-1',
            wasRight ? 'bg-primary-soft ring-primary' : 'bg-secondary-soft ring-secondary',
          )}
        >
          <p className="font-display text-2xl font-bold">{wasRight ? copy.correct : copy.wrong}</p>
          {isBlank && !wasRight ? (
            <p className="leading-relaxed">
              {copy.rightAnswer}: <strong>{rightAnswer(question)}</strong>
            </p>
          ) : null}
          {question.explanation ? <p className="leading-relaxed">{question.explanation}</p> : null}
          {question.speak ? <SpeakButton text={question.speak} slow /> : null}
        </div>
      ) : isBlank ? null : (
        <p className="text-sm text-muted">{copy.keyboardTip}</p>
      )}

      {answered ? (
        <button ref={nextRef} type="button" onClick={next} className={buttonStyles({ size: 'lg' })}>
          {isLast ? copy.finish : copy.next}
          <LuArrowRight aria-hidden />
        </button>
      ) : null}
    </section>
  )
}
