export type Random = () => number

// A fair shuffle (Fisher-Yates). The source list is left untouched.
export const shuffle = <T>(items: readonly T[], random: Random = Math.random): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

export const pick = <T>(items: readonly T[], count: number, random: Random = Math.random): T[] =>
  shuffle(items, random).slice(0, count)

// A small random generator that always gives the same numbers for the same seed. It makes the
// daily mix the same for everyone all day long.
export const seededRandom = (seed: number): Random => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Turns a text such as "2026-10-22" into a number to start the generator from.
export const textSeed = (text: string) => {
  let hash = 2166136261
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return hash >>> 0
}
