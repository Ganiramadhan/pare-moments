// The page numbers to show: the first, the last and the ones around the current page. `null` is a gap ("…").
export const pageNumbers = (page: number, pageCount: number): (number | null)[] => {
  const wanted = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)
  return sorted.flatMap((n, index) => {
    const previous = sorted[index - 1]
    return previous !== undefined && n - previous > 1 ? [null, n] : [n]
  })
}

export const paginate = <T>(items: readonly T[], page: number, size: number) => {
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(page, 1), pageCount)
  return { pageCount, page: current, items: items.slice((current - 1) * size, current * size) }
}
