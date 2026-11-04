import { useRef, useState } from 'react'
import { LuLayers, LuSearch, LuTable2, LuTarget } from 'react-icons/lu'
import { Link, useSearchParams } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { Field, Input } from '@/shared/components/ui/Field'
import { useSeo } from '@/shared/hooks/useSeo'
import { cn } from '@/shared/lib/utils'
import { NameGate } from '../components/NameGate'
import { Pagination } from '../components/Pagination'
import { PracticeHeader } from '../components/PracticeHeader'
import { QuizSession } from '../components/QuizSession'
import { VerbCard } from '../components/VerbCard'
import { VerbTable } from '../components/VerbTable'
import { practiceCopy, QUIZ_LENGTH, VERBS_PER_PAGE } from '../constants'
import { verbs } from '../data/verbs'
import { paginate } from '../utils/pages'
import { verbQuestions } from '../utils/verb-questions'

type Filter = 'all' | 'irregular' | 'regular'
type Mode = 'table' | 'cards' | 'quiz'

const chipClass = (active: boolean) =>
  cn(
    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold ring-1 transition',
    active
      ? 'bg-primary text-on-primary ring-primary'
      : 'bg-surface ring-line hover:bg-primary-soft',
  )

const modes = [
  { id: 'table', label: practiceCopy.verbs.table, icon: LuTable2 },
  { id: 'cards', label: practiceCopy.verbs.cards, icon: LuLayers },
  { id: 'quiz', label: practiceCopy.verbs.quiz, icon: LuTarget },
] as const

// The table and the cards share a search box and a filter.
function Study({ mode }: { mode: 'table' | 'cards' }) {
  const copy = practiceCopy.verbs
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [requestedPage, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)
  const query = search.trim().toLowerCase()

  const shown = verbs.filter(
    (verb) =>
      (filter === 'all' || (filter === 'irregular') === verb.irregular) &&
      [verb.base, verb.past, verb.participle, verb.meaning].some((text) =>
        text.toLowerCase().includes(query),
      ),
  )

  const { page, pageCount, items } = paginate(shown, requestedPage, VERBS_PER_PAGE)
  const goTo = (next: number) => {
    setPage(next)
    listRef.current?.scrollIntoView?.({ block: 'start' })
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-muted">{copy.legend}</p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-80">
          <Field label={copy.searchLabel} htmlFor="verb-search" hint={copy.count(shown.length)}>
            <div className="relative">
              <LuSearch
                aria-hidden
                className="absolute top-1/2 left-4 -translate-y-1/2 text-muted"
              />
              <Input
                id="verb-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder={copy.search}
                className="pl-11"
              />
            </div>
          </Field>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter verbs">
          {(['all', 'irregular', 'regular'] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => {
                setFilter(id)
                setPage(1)
              }}
              className={chipClass(filter === id)}
            >
              {copy[id]}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="scroll-mt-32">
        {shown.length === 0 ? (
          <p className="text-muted">{copy.noVerbs}</p>
        ) : mode === 'table' ? (
          <VerbTable verbs={items} />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((verb, index) => (
              <li key={verb.base}>
                <VerbCard verb={verb} tone={index % 2 === 0 ? 'primary' : 'secondary'} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {shown.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <Pagination page={page} pageCount={pageCount} onChange={goTo} />
          <p className="text-sm text-muted">
            {practiceCopy.pagination.showing(
              (page - 1) * VERBS_PER_PAGE + 1,
              (page - 1) * VERBS_PER_PAGE + items.length,
              shown.length,
            )}
          </p>
        </div>
      ) : null}
    </div>
  )
}

function VerbQuiz() {
  const [started, setStarted] = useState(false)
  const copy = practiceCopy.verbs

  if (!started) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-5 rounded-[2rem] bg-surface p-8 shadow-sm ring-1 ring-line">
        <p className="text-lg leading-relaxed">{copy.quizIntro}</p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className={buttonStyles({ size: 'lg' })}
        >
          {practiceCopy.start}
        </button>
      </div>
    )
  }

  return (
    <NameGate>
      <QuizSession
        progressKey="verbs"
        makeQuestions={(seen) => verbQuestions(verbs, QUIZ_LENGTH, Math.random, seen)}
        actions={
          <Link to="/practice/verbs" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
            {copy.studyFirst}
          </Link>
        }
      />
    </NameGate>
  )
}

// The daily verbs: study them in a table or as flash cards, then take the quiz.
export function VerbsPage() {
  const copy = practiceCopy.verbs
  const [params, setParams] = useSearchParams()
  const requested = params.get('mode')
  const mode: Mode = requested === 'cards' || requested === 'quiz' ? requested : 'table'

  useSeo({
    title: 'Daily verbs: V1, V2 and V3',
    description:
      'Learn the verbs we use every day with their three forms (V1, V2, V3) in a table and flash cards, then take a quiz.',
    path: '/practice/verbs',
  })

  return (
    <main className="flex flex-col gap-8">
      <PracticeHeader title={copy.title} text={copy.text}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Verbs mode">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setParams(id === 'table' ? {} : { mode: id }, { replace: true })}
              className={chipClass(mode === id)}
            >
              <Icon aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </PracticeHeader>
      {mode === 'quiz' ? <VerbQuiz /> : <Study key={mode} mode={mode} />}
    </main>
  )
}
