import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { Question } from '../types/practice'
import { QuizRunner } from './QuizRunner'

const questions: Question[] = [
  {
    id: 'q1',
    hint: 'Choose the best answer',
    prompt: 'Yesterday we ___ English.',
    options: ['study', 'studied', 'studying', 'studies'],
    correctIndex: 1,
    explanation: 'Yesterday is finished, so use the simple past.',
  },
  {
    id: 'q2',
    prompt: 'I saw ___ elephant.',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 1,
    explanation: 'Elephant starts with a vowel sound.',
  },
]

// The button of an answer, found by the text of the answer.
const option = (text: string) => screen.getByText(text).closest('button')!

const setup = () => {
  const onFinish = vi.fn()
  const onRestart = vi.fn()
  render(<QuizRunner questions={questions} onFinish={onFinish} onRestart={onRestart} />)
  return { onFinish, onRestart }
}

describe('QuizRunner', () => {
  it('shows one question at a time with its choices and your place in the round', () => {
    setup()

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Yesterday we ___ English.' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /study|studied|studying|studies/ })).toHaveLength(
      4,
    )
    expect(screen.getByRole('list', { name: 'Progress' }).children).toHaveLength(2)
  })

  it('tells you a right answer is right and explains it', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(option('studied'))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    expect(screen.getByRole('status')).toHaveTextContent('simple past')
  })

  it('shows the right answer when yours is wrong', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(option('study'))

    expect(screen.getByRole('status')).toHaveTextContent('Not quite.')
    expect(within(option('studied')).getByText('Correct answer')).toBeInTheDocument()
    expect(within(option('study')).getByText('Your answer')).toBeInTheDocument()
  })

  it('does not let you change an answer once it is given', async () => {
    const user = userEvent.setup()
    const { onFinish } = setup()

    await user.click(option('study'))
    await user.click(option('studied'))
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.keyboard('2')
    await user.click(screen.getByRole('button', { name: 'See my result' }))

    expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ score: 1, total: 2 }))
  })

  it('takes the keys 1 to 4 as answers', async () => {
    const user = userEvent.setup()
    setup()

    await user.keyboard('2')

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
  })

  it('ends with the score, stars and every mistake explained', async () => {
    const user = userEvent.setup()
    const { onFinish } = setup()

    await user.keyboard('1')
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.keyboard('2')
    await user.click(screen.getByRole('button', { name: 'See my result' }))

    expect(screen.getByRole('heading', { name: 'Your result' })).toBeInTheDocument()
    expect(screen.getByText('1 out of 2')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '1 out of 3 stars' })).toBeInTheDocument()
    expect(screen.getByText('Let us look at the mistakes')).toBeInTheDocument()
    expect(screen.getByText('Yesterday we ___ English.')).toBeInTheDocument()
    expect(screen.getByText(/simple past/)).toBeInTheDocument()
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onFinish.mock.calls[0]![0].wrong).toEqual([
      expect.objectContaining({ yours: 'study', correct: 'studied' }),
    ])
  })

  it('celebrates a round with no mistakes and can start again', async () => {
    const user = userEvent.setup()
    const { onRestart } = setup()

    await user.keyboard('2')
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.keyboard('2')
    await user.click(screen.getByRole('button', { name: 'See my result' }))

    expect(screen.getByText('No mistakes. Perfect round!')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '3 out of 3 stars' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRestart).toHaveBeenCalled()
  })

  it('asks for a typed word, and accepts it whatever the capital letters', async () => {
    const user = userEvent.setup()
    const typed: Question[] = [
      {
        id: 'b1',
        prompt: 'She eats fried ___ every morning.',
        options: [],
        correctIndex: 0,
        blank: { answers: ['rice'] },
        explanation: 'In the story: "She eats fried rice every morning."',
      },
    ]
    const onFinish = vi.fn()
    render(<QuizRunner questions={typed} onFinish={onFinish} onRestart={vi.fn()} />)

    await user.type(screen.getByLabelText('Type the missing word'), 'Rice')
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    await user.click(screen.getByRole('button', { name: 'See my result' }))
    expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ score: 1, total: 1 }))
  })

  it('shows the right word when the typed one is wrong', async () => {
    const user = userEvent.setup()
    const typed: Question[] = [
      {
        id: 'b1',
        prompt: 'She eats fried ___ every morning.',
        options: [],
        correctIndex: 0,
        blank: { answers: ['rice'] },
      },
    ]
    render(<QuizRunner questions={typed} onFinish={vi.fn()} onRestart={vi.fn()} />)

    await user.type(screen.getByLabelText('Type the missing word'), 'noodles')
    await user.click(screen.getByRole('button', { name: 'Check' }))

    expect(screen.getByRole('status')).toHaveTextContent('Not quite.')
    expect(screen.getByRole('status')).toHaveTextContent('rice')
  })
})
