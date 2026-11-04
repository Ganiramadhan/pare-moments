import type { Moment } from '../types/moment'
import { dayNumber, daysBetween } from './days-between'

const at = (date: string): Moment => ({
  id: date,
  title: date,
  date,
  caption: '',
  photos: ['/p.jpg'],
})

describe('days-between', () => {
  it('counts both the first and the last day', () => {
    expect(daysBetween([at('2026-10-05'), at('2026-10-08')])).toBe(4)
    expect(daysBetween([at('2026-10-05')])).toBe(1)
    expect(daysBetween([])).toBe(0)
  })

  it('numbers days from the first day of the story', () => {
    expect(dayNumber('2026-10-05', '2026-10-05')).toBe(1)
    expect(dayNumber('2026-10-08', '2026-10-05')).toBe(4)
  })
})
