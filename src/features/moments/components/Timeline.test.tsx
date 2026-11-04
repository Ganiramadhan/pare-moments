import { screen, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { moments } from '../data/moments'
import { Timeline } from './Timeline'

const firstDate = moments[0]!.date

describe('Timeline', () => {
  it('lists every moment in order, with a month heading', () => {
    renderWithRouter(<Timeline moments={moments} firstDate={firstDate} />)

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(moments.map((m) => m.title))
    expect(screen.getByText('October 2026')).toBeInTheDocument()
  })

  it('numbers the days from the first day of the story, even when filtered', () => {
    const later = moments.slice(2)
    renderWithRouter(<Timeline moments={later} firstDate={firstDate} />)

    const card = screen.getAllByRole('article')[0]!
    const item = card.closest('li')!
    expect(within(item).getByText('3')).toBeInTheDocument()
  })
})
