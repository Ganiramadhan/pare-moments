import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { SentenceItem } from '../types/practice'
import { SentenceBuilder } from './SentenceBuilder'

const bank: SentenceItem[] = [
  {
    english: 'We study English every morning.',
    indonesian: 'Kami belajar bahasa Inggris setiap pagi.',
  },
]

const setup = () => {
  const onFinish = vi.fn()
  const onRestart = vi.fn()
  render(<SentenceBuilder bank={bank} count={1} onFinish={onFinish} onRestart={onRestart} />)
  return { onFinish, onRestart }
}

// Taps the words of a sentence one after the other.
const tapWords = async (user: ReturnType<typeof userEvent.setup>, words: string[]) => {
  for (const word of words)
    await user.click(screen.getAllByRole('button', { name: `Add ${word}` })[0]!)
}

describe('SentenceBuilder', () => {
  it('shows the Indonesian line and every English word to build it from', () => {
    setup()

    expect(
      screen.getByRole('heading', { name: 'Kami belajar bahasa Inggris setiap pagi.' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()
  })

  it('moves tapped words into the sentence, and back out when tapped again', async () => {
    const user = userEvent.setup()
    setup()

    await tapWords(user, ['We', 'study'])
    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Remove study' }))
    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(4)
  })

  it('says a correct sentence is correct', async () => {
    const user = userEvent.setup()
    const { onFinish } = setup()

    await tapWords(user, ['We', 'study', 'English', 'every', 'morning.'])
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    await user.click(screen.getByRole('button', { name: 'See my result' }))
    expect(onFinish).toHaveBeenCalledWith({ score: 1, total: 1, wrong: [] })
  })

  it('shows the right sentence when the order is wrong, and remembers the mistake', async () => {
    const user = userEvent.setup()
    const { onFinish } = setup()

    await tapWords(user, ['study', 'We', 'English', 'every', 'morning.'])
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('status')).toHaveTextContent('Not quite.')
    expect(screen.getByRole('status')).toHaveTextContent('We study English every morning.')
    await user.click(screen.getByRole('button', { name: 'See my result' }))
    expect(onFinish).toHaveBeenCalledWith({
      score: 0,
      total: 1,
      wrong: [
        {
          prompt: 'Kami belajar bahasa Inggris setiap pagi.',
          yours: 'study We English every morning.',
          correct: 'We study English every morning.',
        },
      ],
    })
    expect(screen.getByRole('heading', { name: 'Your result' })).toBeInTheDocument()
  })

  it('can start the sentence again', async () => {
    const user = userEvent.setup()
    setup()

    await tapWords(user, ['We', 'study'])
    await user.click(screen.getByRole('button', { name: 'Start again' }))

    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(5)
  })
})
