import { useState } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'
import { NameGate } from '../components/NameGate'
import { PracticeHeader } from '../components/PracticeHeader'
import { SentenceBuilder } from '../components/SentenceBuilder'
import { practiceCopy } from '../constants'
import { sentences } from '../data/sentences'
import { useProgress } from '../hooks/useProgress'
import { percentOf } from '../utils/grade'

// Put the words in the right order to build a correct English sentence. Each round brings five
// sentences, new ones first.
export function SentencePage() {
  const copy = practiceCopy.sentences
  const { record } = useProgress()
  const [round, setRound] = useState(0)

  useSeo({
    title: 'Sentence builder',
    description: 'Practice English word order by building sentences from shuffled words.',
    path: '/practice/sentences',
  })

  return (
    <main className="flex flex-col gap-8">
      <PracticeHeader title={copy.title} text={copy.text} />
      <NameGate>
        <SentenceBuilder
          key={round}
          bank={sentences}
          onFinish={(result) => record('sentences', percentOf(result.score, result.total))}
          onRestart={() => setRound((current) => current + 1)}
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
