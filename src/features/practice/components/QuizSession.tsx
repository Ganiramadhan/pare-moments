import { useState, type ReactNode } from 'react'
import { useProgress } from '../hooks/useProgress'
import type { Question, QuizResult } from '../types/practice'
import { percentOf } from '../utils/grade'
import { loadSeen, markSeen, type Seen } from '../utils/seen'
import { QuizRunner } from './QuizRunner'

type QuizSessionProps = {
  // Makes a fresh set of questions. It gets what was already asked, so it can prefer new questions.
  makeQuestions: (seen: Seen) => Question[]
  // Where the best score is kept, e.g. "verbs" or "grammar:tenses:v2".
  progressKey: string
  actions?: ReactNode
}

// A quiz that remembers the visitor's best score and what was asked, and can be played again with
// a new mix of questions.
export function QuizSession({ makeQuestions, progressKey, actions }: QuizSessionProps) {
  const { record } = useProgress()
  const [round, setRound] = useState(() => ({ id: 0, questions: makeQuestions(loadSeen()) }))

  return (
    <QuizRunner
      key={round.id}
      questions={round.questions}
      actions={actions}
      onFinish={(result: QuizResult) => {
        record(progressKey, percentOf(result.score, result.total))
        markSeen(round.questions.map((question) => question.seenKey ?? question.id))
      }}
      onRestart={() =>
        setRound((current) => ({ id: current.id + 1, questions: makeQuestions(loadSeen()) }))
      }
    />
  )
}
