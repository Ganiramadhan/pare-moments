import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '@/test/test-utils'
import { VERSIONS } from '../constants'
import { grammarTopics } from '../data/grammar/topics'
import { verbs } from '../data/verbs'
import { stubSpeech, withName } from '../test-helpers'
import { applyResult, dayKey, emptyProgress, saveProgress } from '../utils/progress'
import { DailyPage } from './DailyPage'
import { GrammarPage } from './GrammarPage'
import { ListeningPage } from './ListeningPage'
import { PracticePage } from './PracticePage'
import { SentencePage } from './SentencePage'
import { VerbsPage } from './VerbsPage'

const open = (page: React.ReactElement, route: string) =>
  renderWithRouter(page, route, '/practice/*')

const answerAll = async (user: ReturnType<typeof userEvent.setup>, count: number) => {
  for (let n = 0; n < count; n += 1) {
    await user.keyboard('1')
    await user.click(screen.getByRole('button', { name: /Next question|See my result/ }))
  }
}

const progressOf = () => JSON.parse(localStorage.getItem('pare-moments:practice')!)

describe('PracticePage', () => {
  it('offers the five ways to practice', () => {
    open(<PracticePage />, '/practice')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Practice your English' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual([
      '/practice/daily',
      '/practice/verbs',
      '/practice/grammar',
      '/practice/listening',
      '/practice/sentences',
    ])
    expect(screen.getByText('Practice today to start your streak')).toBeInTheDocument()
  })

  it('shows your streak and best scores', () => {
    let progress = applyResult(emptyProgress(), 'verbs', 80, dayKey())
    progress = applyResult(progress, 'grammar:tenses:v2', 100, dayKey())
    saveProgress(progress)

    open(<PracticePage />, '/practice')

    expect(screen.getByText('1 day in a row')).toBeInTheDocument()
    expect(screen.getByText('Best: 80%')).toBeInTheDocument()
    expect(screen.getByText('Best: 100%')).toBeInTheDocument()
  })

  it('greets you by name, and lets you change it', async () => {
    withName('Citra')
    const user = userEvent.setup()
    open(<PracticePage />, '/practice')

    expect(screen.getByText(/Hi, Citra!/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Not you? Change name' }))

    expect(screen.queryByText(/Hi, Citra!/)).not.toBeInTheDocument()
    expect(localStorage.getItem('pare-moments:player-name')).toBeNull()
  })
})

describe('VerbsPage', () => {
  it('starts with a table of every verb in three forms', () => {
    open(<VerbsPage />, '/practice/verbs')

    expect(
      screen.getByRole('table', { name: 'Daily verbs with their three forms' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(12 + 1)
    expect(screen.getByText('100 verbs')).toBeInTheDocument()
    expect(screen.getByText('Showing 1–12 of 100')).toBeInTheDocument()
  })

  it('searches by any form or by the meaning, and filters irregular verbs', async () => {
    const user = userEvent.setup()
    open(<VerbsPage />, '/practice/verbs')

    await user.type(screen.getByLabelText('Search verbs'), 'went')
    expect(screen.getByText('1 verb')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search verbs'))
    await user.click(screen.getByRole('button', { name: 'Regular' }))
    expect(
      screen.getByText(`${verbs.filter((v) => !v.irregular).length} verbs`),
    ).toBeInTheDocument()
  })

  it('moves through the pages of verbs', async () => {
    const user = userEvent.setup()
    open(<VerbsPage />, '/practice/verbs')

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Showing 13–24 of 100')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Page 9' }))
    expect(screen.getByText('Showing 97–100 of 100')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('goes back to the first page when you search', async () => {
    const user = userEvent.setup()
    open(<VerbsPage />, '/practice/verbs')
    await user.click(screen.getByRole('button', { name: 'Next page' }))

    await user.type(screen.getByLabelText('Search verbs'), 'go')

    expect(screen.queryByText(/Showing 13/)).not.toBeInTheDocument()
  })

  it('shows the same verbs as flip cards', async () => {
    const user = userEvent.setup()
    open(<VerbsPage />, '/practice/verbs')

    await user.click(screen.getByRole('button', { name: 'Cards' }))

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getAllByText('Tap to flip').length).toBeGreaterThan(0)
  })

  it('asks for a name before the quiz, then runs ten questions and saves the score', async () => {
    const user = userEvent.setup()
    open(<VerbsPage />, '/practice/verbs?mode=quiz')

    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByRole('heading', { name: /what is your name/i })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Your name'), 'Ayu')
    await user.click(screen.getByRole('button', { name: 'Save and start' }))
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument()

    await answerAll(user, 10)

    expect(screen.getByRole('heading', { name: 'Your result' })).toBeInTheDocument()
    expect(progressOf().scores.verbs.attempts).toBe(1)
  })
})

describe('GrammarPage', () => {
  it('lists every topic and a mixed round', () => {
    open(<GrammarPage />, '/practice/grammar')

    grammarTopics.forEach((topic) =>
      expect(screen.getByRole('heading', { name: topic.name })).toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { name: 'Mixed' })).toBeInTheDocument()
    expect(screen.getAllByText('Not tried yet')).toHaveLength(grammarTopics.length + 1)
    expect(screen.getAllByText('3 versions')).toHaveLength(grammarTopics.length)
  })

  it('has the topics the course needs', () => {
    open(<GrammarPage />, '/practice/grammar')

    ;[
      'Tenses',
      'Question words',
      'Passive voice',
      'How much, how many & more',
      'Modal verbs',
      'Prepositions',
    ].forEach((name) => expect(screen.getByRole('heading', { name })).toBeInTheDocument())
  })

  it('shows V1, V2 and V3 of a topic with the number of questions', () => {
    open(<GrammarPage />, '/practice/grammar?topic=tenses')

    expect(screen.getByRole('heading', { level: 1, name: 'Tenses' })).toBeInTheDocument()
    const picker = screen.getByRole('region', { name: 'Pick a version' })
    expect(
      within(picker)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(VERSIONS.map((v) => `/practice/grammar?topic=tenses&v=${v.id}`))
    expect(within(picker).getAllByText('14 questions')).toHaveLength(3)
  })

  it('runs a tense round of fourteen questions and saves the score under the version', async () => {
    withName()
    const user = userEvent.setup()
    open(<GrammarPage />, '/practice/grammar?topic=tenses&v=v1')

    expect(screen.getByRole('heading', { level: 1, name: 'Tenses V1' })).toBeInTheDocument()
    expect(screen.getByText('Question 1 of 14')).toBeInTheDocument()
    await answerAll(user, 14)

    expect(screen.getByRole('heading', { name: 'Your result' })).toBeInTheDocument()
    expect(progressOf().scores['grammar:tenses:v1']).toBeTruthy()
  })

  it('runs six questions for the other topics', () => {
    withName()
    open(<GrammarPage />, '/practice/grammar?topic=passive-voice&v=v3')

    expect(screen.getByText('Question 1 of 6')).toBeInTheDocument()
  })

  it('does not repeat the same six questions in the next round', async () => {
    withName()
    const user = userEvent.setup()
    open(<GrammarPage />, '/practice/grammar?topic=modals&v=v1')
    const first: string[] = []
    for (let n = 0; n < 6; n += 1) {
      first.push(screen.getByRole('heading', { level: 2 }).textContent!)
      await user.keyboard('1')
      await user.click(screen.getByRole('button', { name: /Next question|See my result/ }))
    }

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    const second: string[] = []
    for (let n = 0; n < 6; n += 1) {
      second.push(screen.getByRole('heading', { level: 2 }).textContent!)
      await user.keyboard('1')
      await user.click(screen.getByRole('button', { name: /Next question|See my result/ }))
    }

    // Eight questions exist, six are asked: the next round must bring in the two not asked yet.
    expect(new Set([...first, ...second]).size).toBeGreaterThan(6)
  })

  it('has a mixed round of ten questions', () => {
    withName()
    open(<GrammarPage />, '/practice/grammar?topic=mixed')

    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument()
  })
})

describe('ListeningPage', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('explains what is needed when the browser cannot read aloud', () => {
    open(<ListeningPage />, '/practice/listening')

    expect(screen.getByRole('alert')).toHaveTextContent(/browser that can read English aloud/i)
  })

  it('offers three versions of story listening', () => {
    stubSpeech()
    open(<ListeningPage />, '/practice/listening')

    const picker = screen.getByRole('region', { name: 'Pick a version' })
    expect(
      within(picker)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(VERSIONS.map((v) => `/practice/listening?v=${v.id}`))
    expect(within(picker).getAllByText('2 stories · 5 questions')).toHaveLength(3)
  })

  it('reads a story aloud first, then asks multiple-choice and typed questions', async () => {
    const spoken = stubSpeech()
    withName()
    const user = userEvent.setup()
    open(<ListeningPage />, '/practice/listening?v=v1')

    expect(screen.getByText('First, listen to the story')).toBeInTheDocument()
    expect(spoken[0]!.text.length).toBeGreaterThan(80)

    await user.click(screen.getByRole('button', { name: /ready for the questions/i }))
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()

    for (let n = 0; n < 3; n += 1) {
      await user.keyboard('1')
      await user.click(screen.getByRole('button', { name: 'Next question' }))
    }
    expect(screen.getByLabelText('Type the missing word')).toBeInTheDocument()
  })
})

describe('SentencePage and DailyPage', () => {
  it('builds sentences, five to a round, without versions', () => {
    withName()

    open(<SentencePage />, '/practice/sentences')

    expect(screen.getByRole('heading', { level: 1, name: 'Sentence builder' })).toBeInTheDocument()
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Pick a version' })).not.toBeInTheDocument()
  })

  it('has five quick questions for today', () => {
    withName()

    open(<DailyPage />, '/practice/daily')

    expect(screen.getByRole('heading', { level: 1, name: 'Daily mix' })).toBeInTheDocument()
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })
})
