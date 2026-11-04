import { LuShuffle, LuStar } from 'react-icons/lu'
import { Link, useSearchParams } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'
import { NameGate } from '../components/NameGate'
import { PracticeHeader } from '../components/PracticeHeader'
import { QuizSession } from '../components/QuizSession'
import { VersionPicker } from '../components/VersionPicker'
import { MIXED_GRAMMAR_LENGTH, practiceCopy, VERSIONS } from '../constants'
import { grammarTopics } from '../data/grammar/topics'
import { useProgress } from '../hooks/useProgress'
import type { VersionId } from '../types/practice'
import { starsFor } from '../utils/grade'
import { grammarQuestions, mixedGrammarQuestions, questionCount } from '../utils/grammar-questions'

const MIXED = 'mixed'

const isVersion = (value: string | null): value is VersionId =>
  VERSIONS.some((version) => version.id === value)

// Pick a grammar topic, then a version (V1, V2 or V3) of it, then answer short exercises with an
// explanation each. "Mixed" is a round with questions from every topic and every version.
export function GrammarPage() {
  const copy = practiceCopy.grammar
  const [params] = useSearchParams()
  const { progress } = useProgress()
  const topicId = params.get('topic')
  const versionParam = params.get('v')
  const topic = grammarTopics.find((t) => t.id === topicId)

  useSeo({
    title: topic ? `${topic.name}: grammar practice` : 'Grammar practice',
    description:
      'English grammar exercises in three versions: tenses, question words, passive voice, how-questions, modals and prepositions.',
    path: '/practice/grammar',
  })

  const anotherTopic = (
    <Link to="/practice/grammar" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
      {copy.another}
    </Link>
  )

  // A mixed round
  if (topicId === MIXED) {
    return (
      <main className="flex flex-col gap-8">
        <PracticeHeader
          title={copy.mixed}
          backTo={{ to: '/practice/grammar', label: copy.another }}
        />
        <NameGate>
          <QuizSession
            progressKey="grammar:mixed"
            makeQuestions={(seen) =>
              mixedGrammarQuestions(grammarTopics, MIXED_GRAMMAR_LENGTH, Math.random, seen)
            }
            actions={anotherTopic}
          />
        </NameGate>
      </main>
    )
  }

  // One version of a topic
  if (topic && isVersion(versionParam)) {
    const meta = VERSIONS.find((v) => v.id === versionParam)!
    return (
      <main className="flex flex-col gap-8">
        <PracticeHeader
          title={`${topic.name} ${meta.label}`}
          text={meta.name}
          backTo={{ to: `/practice/grammar?topic=${topic.id}`, label: topic.name }}
        />
        <NameGate>
          <QuizSession
            key={`${topic.id}-${versionParam}`}
            progressKey={`grammar:${topic.id}:${versionParam}`}
            makeQuestions={(seen) => grammarQuestions(topic, versionParam, Math.random, seen)}
            actions={
              <Link
                to={`/practice/grammar?topic=${topic.id}`}
                className={buttonStyles({ variant: 'ghost', size: 'lg' })}
              >
                {practiceCopy.pickVersion}
              </Link>
            }
          />
        </NameGate>
      </main>
    )
  }

  // The versions of a topic
  if (topic) {
    return (
      <main className="flex flex-col gap-8">
        <PracticeHeader
          title={topic.name}
          text={topic.description}
          backTo={{ to: '/practice/grammar', label: copy.another }}
        />
        <VersionPicker
          label={practiceCopy.pickVersion}
          items={VERSIONS.map((v) => ({
            id: v.id,
            href: `/practice/grammar?topic=${topic.id}&v=${v.id}`,
            detail: copy.questions(questionCount(topic, v.id)),
            best: progress.scores[`grammar:${topic.id}:${v.id}`]?.best,
          }))}
        />
      </main>
    )
  }

  // The topics
  const cards = [
    ...grammarTopics.map((t) => ({
      id: t.id,
      name: t.name,
      text: t.description,
      keys: VERSIONS.map((v) => `grammar:${t.id}:${v.id}`),
    })),
    { id: MIXED, name: copy.mixed, text: copy.mixedText, keys: ['grammar:mixed'] },
  ]

  return (
    <main className="flex flex-col gap-8">
      <PracticeHeader title={copy.title} text={copy.text} />
      <section aria-label={copy.pickTopic}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const scores = card.keys.flatMap((key) =>
              progress.scores[key] ? [progress.scores[key].best] : [],
            )
            const best = scores.length > 0 ? Math.max(...scores) : null
            return (
              <li key={card.id}>
                <Link
                  to={`/practice/grammar?topic=${card.id}`}
                  className="group flex h-full flex-col gap-3 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-bold">{card.name}</h2>
                    {card.id === MIXED ? (
                      <LuShuffle aria-hidden className="text-2xl text-secondary" />
                    ) : null}
                  </span>
                  <span className="leading-relaxed text-muted">{card.text}</span>
                  <span className="mt-auto flex items-center justify-between pt-2 text-sm font-bold text-primary">
                    <span>
                      {card.id === MIXED ? copy.questions(MIXED_GRAMMAR_LENGTH) : '3 versions'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {best !== null ? (
                        <>
                          <LuStar aria-hidden className="fill-secondary text-secondary" />
                          {starsFor(best)}/3 · {practiceCopy.best(best)}
                        </>
                      ) : (
                        practiceCopy.notTried
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
