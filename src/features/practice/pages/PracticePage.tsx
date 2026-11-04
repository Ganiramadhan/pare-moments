import type { IconType } from 'react-icons'
import {
  LuBookOpen,
  LuFlame,
  LuHeadphones,
  LuPencilLine,
  LuPuzzle,
  LuStar,
  LuSun,
} from 'react-icons/lu'
import { Link } from 'react-router'
import { Reveal } from '@/shared/components/ui/Reveal'
import { useSeo } from '@/shared/hooks/useSeo'
import { cn } from '@/shared/lib/utils'
import { practiceCopy, VERSIONS } from '../constants'
import { grammarTopics } from '../data/grammar/topics'
import { usePlayer } from '../hooks/usePlayer'
import { useProgress } from '../hooks/useProgress'
import { starsFor } from '../utils/grade'
import { currentStreak, dayKey, type Progress } from '../utils/progress'

type Mode = {
  to: string
  title: string
  text: string
  icon: IconType
  // Where the best score of this mode is kept (the average of the topics for grammar).
  keys: string[]
  tone: string
}

const modes: Mode[] = [
  {
    to: '/practice/daily',
    title: practiceCopy.daily.title,
    text: practiceCopy.daily.text,
    icon: LuSun,
    keys: ['daily'],
    tone: 'bg-secondary text-on-secondary',
  },
  {
    to: '/practice/verbs',
    title: practiceCopy.verbs.title,
    text: practiceCopy.verbs.text,
    icon: LuBookOpen,
    keys: ['verbs'],
    tone: 'bg-primary text-on-primary',
  },
  {
    to: '/practice/grammar',
    title: practiceCopy.grammar.title,
    text: practiceCopy.grammar.text,
    icon: LuPencilLine,
    keys: [
      ...grammarTopics.flatMap((t) => VERSIONS.map((v) => `grammar:${t.id}:${v.id}`)),
      'grammar:mixed',
    ],
    tone: 'bg-primary text-on-primary',
  },
  {
    to: '/practice/listening',
    title: practiceCopy.listening.title,
    text: practiceCopy.listening.text,
    icon: LuHeadphones,
    keys: VERSIONS.map((v) => `listening:${v.id}`),
    tone: 'bg-secondary text-on-secondary',
  },
  {
    to: '/practice/sentences',
    title: practiceCopy.sentences.title,
    text: practiceCopy.sentences.text,
    icon: LuPuzzle,
    keys: ['sentences'],
    tone: 'bg-primary text-on-primary',
  },
]

// The best score over a mode's keys (for grammar: the best topic), or null when never tried.
const bestOf = (progress: Progress, keys: string[]) => {
  const scores = keys.flatMap((key) => (progress.scores[key] ? [progress.scores[key].best] : []))
  return scores.length > 0 ? Math.max(...scores) : null
}

// The practice home: four ways to train English, the daily streak and the best scores.
export function PracticePage() {
  const { progress } = useProgress()
  const { name, change } = usePlayer()
  const streak = currentStreak(progress, dayKey())

  useSeo({
    title: 'Practice your English',
    description:
      'Free English practice: 100 daily verbs (V1, V2, V3), grammar exercises, story listening, sentence building and a daily mix.',
    path: '/practice',
  })

  return (
    <main className="flex flex-col gap-10">
      <header className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-on-primary sm:p-12">
        <span
          aria-hidden
          className="absolute -top-16 -right-12 size-56 rounded-full bg-secondary"
        />
        <div className="relative flex flex-col gap-4">
          <h1 className="font-display text-5xl leading-tight font-bold tracking-tight sm:text-6xl">
            {practiceCopy.hubTitle}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed opacity-90">{practiceCopy.hubBody}</p>
          {name ? (
            <p className="flex flex-wrap items-center gap-3 text-lg font-bold">
              {practiceCopy.player.hello(name)}
              <button
                type="button"
                onClick={change}
                className="text-sm font-bold underline opacity-90 hover:opacity-100"
              >
                {practiceCopy.player.change}
              </button>
            </p>
          ) : null}
          <p
            className={cn(
              'inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold',
              streak > 0 ? 'bg-secondary text-on-secondary' : 'bg-white/20',
            )}
          >
            <LuFlame aria-hidden />
            {streak > 0 ? practiceCopy.streak(streak) : practiceCopy.streakEmpty}
          </p>
        </div>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map(({ to, title, text, icon: Icon, keys, tone }) => {
          const best = bestOf(progress, keys)
          return (
            <li key={to}>
              <Reveal className="h-full">
                <Link
                  to={to}
                  className="group flex h-full flex-col gap-4 rounded-[2rem] bg-surface p-6 shadow-sm ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
                >
                  <span
                    className={cn(
                      'flex size-14 -rotate-6 items-center justify-center rounded-2xl text-3xl transition group-hover:rotate-0',
                      tone,
                    )}
                  >
                    <Icon aria-hidden />
                  </span>
                  <h2 className="font-display text-3xl font-bold">{title}</h2>
                  <p className="leading-relaxed text-muted">{text}</p>
                  <p className="mt-auto flex items-center gap-2 pt-2 text-sm font-bold text-primary">
                    {best === null ? (
                      practiceCopy.notTried
                    ) : (
                      <>
                        <span className="flex" aria-hidden>
                          {[1, 2, 3].map((n) => (
                            <LuStar
                              key={n}
                              className={
                                n <= starsFor(best) ? 'fill-secondary text-secondary' : 'text-line'
                              }
                            />
                          ))}
                        </span>
                        {practiceCopy.best(best)}
                      </>
                    )}
                  </p>
                </Link>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
