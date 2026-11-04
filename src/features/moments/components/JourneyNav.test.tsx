import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { Moment } from '../types/moment'
import { JourneyNav } from './JourneyNav'

const at = (date: string): Moment => ({
  id: `m-${date}`,
  title: date,
  date,
  caption: '',
  photos: ['/p.jpeg'],
})
const days = [at('2026-10-05'), at('2026-10-06'), at('2026-10-09')]

describe('JourneyNav', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    Element.prototype.scrollTo = vi.fn()
  })

  it('has one chip per day, numbered from the first day of the story', () => {
    render(<JourneyNav moments={days} firstDate="2026-10-05" />)

    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual([
      'Day 1',
      'Day 2',
      'Day 5',
    ])
    expect(screen.getByRole('link', { name: 'Day 5' })).toHaveAttribute(
      'href',
      '#moment-m-2026-10-09',
    )
  })

  it('keeps the numbers of the whole story when only some days are shown', () => {
    render(<JourneyNav moments={days.slice(1)} firstDate="2026-10-05" />)

    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(['Day 2', 'Day 5'])
  })

  it('lights up the first day at the start', () => {
    render(<JourneyNav moments={days} firstDate="2026-10-05" />)

    expect(screen.getByRole('link', { name: 'Day 1' })).toHaveAttribute('aria-current', 'true')
  })

  it('scrolls to a day when its chip is tapped and lights that chip up', async () => {
    const user = userEvent.setup()
    const row = document.createElement('li')
    row.id = 'moment-m-2026-10-09'
    document.body.appendChild(row)
    render(<JourneyNav moments={days} firstDate="2026-10-05" />)

    await user.click(screen.getByRole('link', { name: 'Day 5' }))

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Day 5' })).toHaveAttribute('aria-current', 'true')
    row.remove()
  })

  it('is left out when there is only one day to show', () => {
    const { container } = render(<JourneyNav moments={days.slice(0, 1)} firstDate="2026-10-05" />)

    expect(container).toBeEmptyDOMElement()
  })
})
