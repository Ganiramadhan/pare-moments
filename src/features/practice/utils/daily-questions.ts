import type { GrammarTopic, Question, Verb } from '../types/practice'
import { mixedGrammarQuestions } from './grammar-questions'
import { seededRandom, shuffle, textSeed } from './random'
import { verbQuestions } from './verb-questions'

export const DAILY_VERBS = 3
export const DAILY_GRAMMAR = 2

// Five quick questions that are the same for everyone on the same day and change tomorrow.
export const dailyQuestions = (day: string, bank: Verb[], topics: GrammarTopic[]): Question[] => {
  const random = seededRandom(textSeed(day))
  return shuffle(
    [
      ...verbQuestions(bank, DAILY_VERBS, random),
      ...mixedGrammarQuestions(topics, DAILY_GRAMMAR, random),
    ],
    random,
  )
}
