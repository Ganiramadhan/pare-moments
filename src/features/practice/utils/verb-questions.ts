import type { Question, Verb } from '../types/practice'
import { draw } from './draw'
import { regularized, withIng, withS } from './forms'
import { pick, shuffle, type Random } from './random'
import type { Seen } from './seen'

type Kind = 'v2' | 'v3' | 'sentence-v2' | 'sentence-v3' | 'meaning'

const KINDS: Kind[] = ['v2', 'v3', 'sentence-v2', 'sentence-v3', 'meaning']

const seenKeyOf = (verb: Verb) => `verb-${verb.base}`

const withBlank = (sentence: string, form: string) =>
  sentence.replace(new RegExp(`\\b${form}\\b`, 'i'), '_____')

// Other shapes of the SAME verb that are wrong in a sentence about the past: its other forms, the
// third person (reads), the -ing form (reading) and the mistake (readed). They never come from other
// verbs, because "I ___ a bike yesterday" could be completed by several real verbs.
const lookalikes = (verb: Verb) => [
  verb.base,
  verb.past,
  verb.participle,
  withS(verb.base),
  withIng(verb.base),
  regularized(verb.base),
]

const options = (correct: string, candidates: string[], random: Random) => {
  const wrong = [...new Set(candidates)].filter((candidate) => candidate !== correct)
  const all = shuffle([correct, ...pick(wrong, 3, random)], random)
  return { options: all, correctIndex: all.indexOf(correct) }
}

const summary = (verb: Verb) => `V1 ${verb.base} · V2 ${verb.past} · V3 ${verb.participle}`

/**
 * A quiz about the three forms of daily verbs. The question kinds are mixed up in a new order each
 * time: the past simple (V2), the past participle (V3), a sentence that needs V2 or V3, and which verb
 * has this meaning. Verbs that were not asked yet come first.
 */
export const verbQuestions = (
  bank: Verb[],
  count: number,
  random: Random = Math.random,
  seen: Seen = {},
): Question[] => {
  const kinds = shuffle(KINDS, random)

  return draw(
    bank.map((verb) => ({ verb, id: seenKeyOf(verb) })),
    count,
    seen,
    random,
  ).map(({ verb }, index) => {
    const kind = kinds[index % kinds.length]!
    const base = { id: `verb-${verb.base}-${kind}`, seenKey: seenKeyOf(verb) }

    if (kind === 'v2' || kind === 'v3') {
      const correct = kind === 'v2' ? verb.past : verb.participle
      return {
        ...base,
        hint: 'Choose the right form',
        prompt:
          kind === 'v2'
            ? `What is V2 (past simple) of "${verb.base}"?`
            : `What is V3 (past participle) of "${verb.base}"?`,
        ...options(
          correct,
          [...lookalikes(verb), ...pick(bank, 3, random).map((v) => v.past)],
          random,
        ),
        explanation: `${summary(verb)}. Example: ${kind === 'v2' ? verb.sentences.v2 : verb.sentences.v3}`,
        speak: `${verb.base}, ${verb.past}, ${verb.participle}`,
      }
    }

    if (kind === 'sentence-v2' || kind === 'sentence-v3') {
      const form = kind === 'sentence-v2' ? verb.past : verb.participle
      const sentence = kind === 'sentence-v2' ? verb.sentences.v2 : verb.sentences.v3
      return {
        ...base,
        hint:
          kind === 'sentence-v2'
            ? 'Past simple (V2): choose the right form'
            : 'Past participle (V3): choose the right form',
        prompt: withBlank(sentence, form),
        ...options(form, lookalikes(verb), random),
        explanation: `${summary(verb)}. ${sentence}`,
        speak: sentence,
      }
    }

    const others = bank.filter((v) => v.base !== verb.base && v.meaning !== verb.meaning)
    return {
      ...base,
      hint: 'Which verb has this meaning?',
      prompt: verb.meaning,
      ...options(
        verb.base,
        pick(others, 3, random).map((v) => v.base),
        random,
      ),
      explanation: `${summary(verb)}. Example: ${verb.sentences.v1}`,
      speak: `${verb.base}, ${verb.past}, ${verb.participle}`,
    }
  })
}
