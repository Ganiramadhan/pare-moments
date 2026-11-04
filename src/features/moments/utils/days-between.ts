import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Moment } from '../types/moment'

// How many days the story spans, counting both the first and the last day.
export const daysBetween = (moments: Moment[]) => {
  const dates = moments.map((m) => m.date).sort()
  const first = dates[0]
  const last = dates.at(-1)
  return first && last ? differenceInCalendarDays(parseISO(last), parseISO(first)) + 1 : 0
}

// The earliest date among the moments, as YYYY-MM-DD.
export const firstDateOf = (moments: Moment[]) => moments.map((m) => m.date).sort()[0] ?? ''

// "Day 1" is the first day of the story.
export const dayNumber = (date: string, firstDate: string) =>
  differenceInCalendarDays(parseISO(date), parseISO(firstDate)) + 1
