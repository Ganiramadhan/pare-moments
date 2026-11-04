import type { GrammarQuestion } from '../../types/practice'

// A short way to write a question: the sentence, the choices, the right one and why.
export const q = (
  sentence: string,
  options: string[],
  answer: string,
  explanation: string,
  group?: string,
): GrammarQuestion => ({ sentence, options, answer, explanation, group })
