// Compares a typed word with the right one(s): capital letters, spaces and punctuation do not matter.
export const normalizeAnswer = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export const isBlankCorrect = (typed: string, answers: string[]) =>
  normalizeAnswer(typed) !== '' &&
  answers.some((answer) => normalizeAnswer(answer) === normalizeAnswer(typed))
