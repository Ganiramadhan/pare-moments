import type { Moment } from '../types/moment'
import { formatMonth } from './format-date'

export type MonthGroup = {
  label: string
  moments: Moment[]
}

export const groupByMonth = (moments: Moment[]): MonthGroup[] => {
  const groups: MonthGroup[] = []

  for (const moment of moments) {
    const label = formatMonth(moment.date)
    const last = groups.at(-1)
    if (last?.label === label) last.moments.push(moment)
    else groups.push({ label, moments: [moment] })
  }

  return groups
}
