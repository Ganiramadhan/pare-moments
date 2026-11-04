import { Link } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'
import { NameGate } from '../components/NameGate'
import { PracticeHeader } from '../components/PracticeHeader'
import { QuizSession } from '../components/QuizSession'
import { practiceCopy } from '../constants'
import { grammarTopics } from '../data/grammar/topics'
import { verbs } from '../data/verbs'
import { dailyQuestions } from '../utils/daily-questions'
import { dayKey } from '../utils/progress'

// Five quick questions, the same for everyone on the same day. A good small habit.
export function DailyPage() {
  const today = dayKey()

  useSeo({
    title: 'Daily mix',
    description: 'Five quick English questions that change every day.',
    path: '/practice/daily',
  })

  return (
    <main className="flex flex-col gap-8">
      <PracticeHeader title={practiceCopy.daily.title} text={practiceCopy.daily.page(today)} />
      <NameGate>
        <QuizSession
          progressKey="daily"
          makeQuestions={() => dailyQuestions(today, verbs, grammarTopics)}
          actions={
            <Link to="/practice" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
              {practiceCopy.result.backToPractice}
            </Link>
          }
        />
      </NameGate>
    </main>
  )
}
