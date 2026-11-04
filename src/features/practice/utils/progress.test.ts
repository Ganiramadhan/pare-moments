import { applyResult, currentStreak, emptyProgress, loadProgress, saveProgress } from './progress'

describe('progress', () => {
  it('keeps the best percent and counts every try', () => {
    let progress = applyResult(emptyProgress(), 'vocab', 60, '2026-10-22')
    progress = applyResult(progress, 'vocab', 90, '2026-10-22')
    progress = applyResult(progress, 'vocab', 40, '2026-10-22')

    expect(progress.scores.vocab).toEqual({ best: 90, attempts: 3 })
  })

  it('builds a streak over days in a row and restarts after a gap', () => {
    let progress = applyResult(emptyProgress(), 'daily', 100, '2026-10-20')
    expect(progress.streak).toEqual({ count: 1, last: '2026-10-20' })

    progress = applyResult(progress, 'vocab', 80, '2026-10-21')
    progress = applyResult(progress, 'vocab', 80, '2026-10-22')
    expect(progress.streak.count).toBe(3)

    progress = applyResult(progress, 'vocab', 80, '2026-10-22')
    expect(progress.streak.count).toBe(3)

    progress = applyResult(progress, 'vocab', 80, '2026-10-25')
    expect(progress.streak.count).toBe(1)
  })

  it('counts the streak as alive only if the last day was today or yesterday', () => {
    const progress = applyResult(emptyProgress(), 'daily', 100, '2026-10-21')

    expect(currentStreak(progress, '2026-10-21')).toBe(1)
    expect(currentStreak(progress, '2026-10-22')).toBe(1)
    expect(currentStreak(progress, '2026-10-24')).toBe(0)
  })

  it('saves and loads, and starts fresh from damaged data', () => {
    const progress = applyResult(emptyProgress(), 'sentences', 80, '2026-10-22')
    saveProgress(progress)
    expect(loadProgress()).toEqual(progress)

    localStorage.setItem('pare-moments:practice', '{not json')
    expect(loadProgress()).toEqual(emptyProgress())
    localStorage.setItem(
      'pare-moments:practice',
      JSON.stringify({ scores: { a: 'oops', b: { best: 5, attempts: 1 } } }),
    )
    expect(loadProgress().scores).toEqual({ b: { best: 5, attempts: 1 } })
  })
})
