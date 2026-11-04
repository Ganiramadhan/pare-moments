export const percentOf = (score: number, total: number) =>
  total === 0 ? 0 : Math.round((score / total) * 100)

// 0 to 3 stars for a round.
export const starsFor = (percent: number) =>
  percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0

export const messageFor = (percent: number) =>
  percent >= 90
    ? 'Excellent! Your English is shining.'
    : percent >= 70
      ? 'Great job! Keep it up.'
      : percent >= 50
        ? 'Good try. A little more practice and you will get there.'
        : 'Keep going. Every mistake teaches you something.'
