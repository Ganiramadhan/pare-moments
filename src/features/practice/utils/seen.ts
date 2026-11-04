// How many times each question has already been asked on this device, so that new rounds prefer
// questions the visitor has not seen yet.
export type Seen = Record<string, number>

const KEY = 'pare-moments:practice-seen'
// Enough for every question of the website; older entries are dropped if it ever grows.
const MAX_ENTRIES = 1000

export const loadSeen = (): Seen => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (typeof saved !== 'object' || saved === null) return {}
    return Object.fromEntries(
      Object.entries(saved).filter(([, count]) => typeof count === 'number'),
    ) as Seen
  } catch {
    return {}
  }
}

// Adds one to the count of every asked question.
export const markSeen = (keys: string[]) => {
  const seen = loadSeen()
  keys.forEach((key) => {
    seen[key] = (seen[key] ?? 0) + 1
  })
  const entries = Object.entries(seen)
  const kept = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(kept)))
  } catch {
    // Without storage, rounds simply are not remembered.
  }
}
