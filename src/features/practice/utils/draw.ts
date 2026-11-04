import { shuffle, type Random } from './random'
import type { Seen } from './seen'

type Drawable = { id: string; seenKey?: string }

const keyOf = (item: Drawable) => item.seenKey ?? item.id

/**
 * Picks `count` items for a round. Items that were asked the fewest times come first, so a new round
 * prefers what the visitor has not seen; among equals the order is random.
 */
export const draw = <T extends Drawable>(
  pool: readonly T[],
  count: number,
  seen: Seen,
  random: Random,
): T[] =>
  shuffle(pool, random)
    .map((item, order) => ({ item, order, times: seen[keyOf(item)] ?? 0 }))
    .sort((a, b) => a.times - b.times || a.order - b.order)
    .slice(0, count)
    .map(({ item }) => item)

// The same, but taking `perGroup` items from every group (e.g. two questions of every tense).
export const drawGrouped = <T extends Drawable & { group?: string }>(
  pool: readonly T[],
  perGroup: number,
  seen: Seen,
  random: Random,
): T[] => {
  const groups = new Map<string, T[]>()
  pool.forEach((item) => {
    const key = item.group ?? ''
    groups.set(key, [...(groups.get(key) ?? []), item])
  })
  return shuffle(
    [...groups.values()].flatMap((items) => draw(items, perGroup, seen, random)),
    random,
  )
}
