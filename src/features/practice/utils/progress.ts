// What the visitor has achieved, kept only in this browser (there are no accounts).
export type Best = { best: number; attempts: number }

export type Progress = {
  // Best percent per kind of practice: "verbs", "sentences", "daily", "grammar:tenses"...
  scores: Record<string, Best>
  // How many days in a row the visitor practiced.
  streak: { count: number; last: string }
}

const KEY = 'pare-moments:practice'

export const emptyProgress = (): Progress => ({ scores: {}, streak: { count: 0, last: '' } })

// Today as YYYY-MM-DD in the visitor's own time zone.
export const dayKey = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const yesterdayOf = (day: string) => {
  const [year, month, date] = day.split('-').map(Number)
  return dayKey(new Date(year!, month! - 1, date! - 1))
}

// Adds one finished round: keeps the best percent and counts the day for the streak.
export const applyResult = (
  progress: Progress,
  key: string,
  percent: number,
  today: string,
): Progress => {
  const before = progress.scores[key]
  const streak =
    progress.streak.last === today
      ? progress.streak
      : {
          count: progress.streak.last === yesterdayOf(today) ? progress.streak.count + 1 : 1,
          last: today,
        }

  return {
    scores: {
      ...progress.scores,
      [key]: { best: Math.max(before?.best ?? 0, percent), attempts: (before?.attempts ?? 0) + 1 },
    },
    streak,
  }
}

const isBest = (value: unknown): value is Best =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Best).best === 'number' &&
  typeof (value as Best).attempts === 'number'

// Reads what was saved. Anything damaged or missing simply starts fresh.
export const loadProgress = (): Progress => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (typeof saved !== 'object' || saved === null) return emptyProgress()
    const { scores, streak } = saved as Partial<Progress>
    const valid = Object.entries(scores ?? {}).filter(([, value]) => isBest(value))
    return {
      scores: Object.fromEntries(valid),
      streak:
        typeof streak?.count === 'number' && typeof streak.last === 'string'
          ? { count: streak.count, last: streak.last }
          : { count: 0, last: '' },
    }
  } catch {
    return emptyProgress()
  }
}

export const saveProgress = (progress: Progress) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Without storage the progress just is not remembered.
  }
}

// The streak is only alive if the visitor practiced today or yesterday.
export const currentStreak = (progress: Progress, today: string) =>
  progress.streak.last === today || progress.streak.last === yesterdayOf(today)
    ? progress.streak.count
    : 0
