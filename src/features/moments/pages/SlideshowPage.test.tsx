import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '@/test/test-utils'
import { SLIDE_MS } from '../constants'
import { moments } from '../data/moments'
import { buildSlides } from '../utils/build-slides'
import { SlideshowPage } from './SlideshowPage'

const slides = buildSlides(moments)
const open = (route = '/slideshow') => renderWithRouter(<SlideshowPage />, route, '/slideshow')

describe('SlideshowPage', () => {
  it('starts at the first photo and moves with the buttons', async () => {
    const user = userEvent.setup()
    open()

    expect(screen.getByText(`1 / ${slides.length}`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByText(`2 / ${slides.length}`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous photo' }))
    expect(screen.getByText(`1 / ${slides.length}`)).toBeInTheDocument()
  })

  it('moves with the arrow keys and pauses with space', async () => {
    const user = userEvent.setup()
    open()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(`2 / ${slides.length}`)).toBeInTheDocument()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('plays on its own', () => {
    vi.useFakeTimers()
    open()

    act(() => vi.advanceTimersByTime(SLIDE_MS))

    expect(screen.getByText(`2 / ${slides.length}`)).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('can start from a given moment', () => {
    const target = moments[1]!
    open(`/slideshow?moment=${target.id}`)

    const start = slides.findIndex((s) => s.momentId === target.id) + 1
    expect(screen.getByText(`${start} / ${slides.length}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: target.title })).toBeInTheDocument()
  })

  it('leaves the slideshow on Escape', async () => {
    const user = userEvent.setup()
    open()

    await user.keyboard('{Escape}')

    expect(screen.getByText('elsewhere')).toBeInTheDocument()
  })
})
