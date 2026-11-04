import type { Moment } from '../types/moment'
import { groupByMonth } from './group-by-month'

const at = (id: string, date: string): Moment => ({
  id,
  title: id,
  date,
  caption: '',
  photos: ['/p.jpg'],
})

describe('groupByMonth', () => {
  it('groups neighbouring moments of the same month under one heading', () => {
    const groups = groupByMonth([
      at('a', '2026-10-05'),
      at('b', '2026-10-20'),
      at('c', '2026-11-02'),
    ])

    expect(groups.map((g) => g.label)).toEqual(['October 2026', 'November 2026'])
    expect(groups[0]?.moments.map((m) => m.id)).toEqual(['a', 'b'])
  })
})
