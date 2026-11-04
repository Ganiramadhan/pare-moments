import {
  COLLOCATIONS,
  COUNTABLE,
  HOW_PAIRS,
  PLACES,
  PLACE_FRAMES,
  THINGS,
  TIMES,
  TIME_FRAMES,
  UNCOUNTABLE,
  WH_PAIRS,
  WHY_PREP,
  type QuestionWord,
} from '../data/grammar/generator-data'
import { verbs } from '../data/verbs'
import type { GrammarQuestion, VersionId } from '../types/practice'
import { pick, type Random } from './random'
import { tenseTemplates } from './tense-generators'

// A template makes a brand new question every time it is used, from word lists. So the same
// grammar point comes back with other words, names and choices, and rounds do not repeat.
export type Template = {
  id: string
  // Only for tenses: questions of a group are drawn evenly.
  group?: string
  // The versions this template is used in.
  versions: VersionId[]
  make: (version: VersionId, random: Random) => GrammarQuestion
}

const one = <T>(items: readonly T[], random: Random) => pick(items, 1, random)[0]!

// The right answer plus three wrong ones from the candidates.
export const withChoices = (answer: string, wrong: string[], random: Random) => {
  const others = [...new Set(wrong)].filter((option) => option !== answer)
  return { options: [answer, ...pick(others, 3, random)], answer }
}

const ALL: VersionId[] = ['v1', 'v2', 'v3']

const timeQuestion: Template = {
  id: 'prep-time',
  versions: ALL,
  make: (_, random) => {
    const [time, prep] = one(TIMES, random)
    return {
      sentence: one(TIME_FRAMES, random).replace('{t}', time),
      ...withChoices(prep, ['in', 'on', 'at', 'to'], random),
      explanation: WHY_PREP[prep as keyof typeof WHY_PREP],
    }
  },
}

const placeQuestion: Template = {
  id: 'prep-place',
  versions: ALL,
  make: (_, random) => {
    const [place, prep] = one(PLACES, random)
    return {
      sentence: one(PLACE_FRAMES, random).replace('{p}', place),
      ...withChoices(prep, ['in', 'on', 'at', 'of'], random),
      explanation: WHY_PREP[prep as keyof typeof WHY_PREP],
    }
  },
}

const collocationQuestion: Template = {
  id: 'prep-word',
  versions: ['v2', 'v3'],
  make: (_, random) => {
    const [sentence, answer, wrong, why] = one(COLLOCATIONS, random)
    return { sentence, ...withChoices(answer, wrong, random), explanation: why }
  },
}

const forms = (base: string) => verbs.find((verb) => verb.base === base)!

const thingQuestion = (id: string, tense: 'present' | 'past' | 'future'): Template => ({
  id,
  versions:
    tense === 'present' ? ['v1', 'v3'] : tense === 'past' ? ['v1', 'v2', 'v3'] : ['v2', 'v3'],
  make: (_, random) => {
    const thing = one(THINGS, random)
    const verb = forms(thing.verb)
    const marker = one(
      tense === 'present'
        ? ['every day', 'every week']
        : tense === 'past'
          ? ['yesterday', 'last week']
          : ['tomorrow', 'next week'],
      random,
    )
    const beNow = thing.plural ? 'are' : 'is'
    const beThen = thing.plural ? 'were' : 'was'
    const active = thing.plural ? verb.base : `${verb.base}s`
    const forTense = {
      present: {
        answer: `${beNow} ${verb.participle}`,
        wrong: [
          `${beThen} ${verb.participle}`,
          active,
          `will be ${verb.participle}`,
          `${beNow} ${verb.base}ing`,
        ],
        why: 'Present passive: am / is / are + the past participle (V3). Every day is a clue for a habit.',
      },
      past: {
        answer: `${beThen} ${verb.participle}`,
        wrong: [
          `${beNow} ${verb.participle}`,
          verb.past,
          `will be ${verb.participle}`,
          `${beThen} ${verb.base}ing`,
        ],
        why: 'Past passive: was / were + the past participle (V3). Yesterday and last week are finished times.',
      },
      future: {
        answer: `will be ${verb.participle}`,
        wrong: [
          `${beThen} ${verb.participle}`,
          `will ${verb.base}`,
          verb.past,
          `${beNow} ${verb.base}ing`,
        ],
        why: 'Future passive: will be + the past participle (V3).',
      },
    }[tense]
    // "-ing" forms of these verbs are all regular (no doubled letter), so base + ing is safe, except for a final -e.
    const fixed = forTense.wrong.map((option) =>
      option.endsWith('eing') ? option.replace('eing', 'ing') : option,
    )
    return {
      sentence: `${thing.object} ___ by ${thing.agent} ${marker}.`,
      ...withChoices(forTense.answer, fixed, random),
      explanation: forTense.why,
    }
  },
})

const muchManyQuestion: Template = {
  id: 'how-much-many',
  versions: ['v1', 'v3'],
  make: (_, random) => {
    const countable = random() < 0.5
    const noun = one(countable ? COUNTABLE : UNCOUNTABLE, random)
    const sentence = one(
      [
        `How ___ ${noun} do you need?`,
        `How ___ ${noun} ${countable ? 'are' : 'is'} there in the kitchen?`,
      ],
      random,
    )
    return {
      sentence,
      ...withChoices(countable ? 'many' : 'much', ['much', 'many', 'long', 'often'], random),
      explanation: countable
        ? 'Use how many with things you can count: books, eggs, students.'
        : 'Use how much with things you cannot count: water, rice, time, money.',
    }
  },
}

const howQuestion: Template = {
  id: 'how-other',
  versions: ['v2', 'v3'],
  make: (_, random) => {
    const [question, answer, word] = one(HOW_PAIRS, random)
    return {
      sentence: `${question} — ${answer}`,
      ...withChoices(word, ['much', 'many', 'long', 'far', 'often', 'old'], random),
      explanation: `The answer tells us: ${answer.replace(/\.$/, '')}. So the question is how ${word}.`,
    }
  },
}

const whQuestion: Template = {
  id: 'wh-answer',
  versions: ALL,
  make: (version, random) => {
    const allowed: QuestionWord[] =
      version === 'v1'
        ? ['Where', 'When', 'Who', 'What']
        : ['Where', 'When', 'Who', 'What', 'Why', 'How']
    const [question, answer, word] = one(
      WH_PAIRS.filter(([, , w]) => allowed.includes(w)),
      random,
    )
    return {
      sentence: `${question} — ${answer}`,
      ...withChoices(word, allowed, random),
      explanation: `The answer "${answer.replace(/\.$/, '')}" tells us to ask with ${word.toLowerCase()}.`,
    }
  },
}

export const generators: Record<string, Template[]> = {
  tenses: tenseTemplates,
  'question-words': [whQuestion],
  'passive-voice': [
    thingQuestion('passive-present', 'present'),
    thingQuestion('passive-past', 'past'),
    thingQuestion('passive-future', 'future'),
  ],
  'how-questions': [muchManyQuestion, howQuestion],
  prepositions: [timeQuestion, placeQuestion, collocationQuestion],
}

export const GENERATED_PER_ROUND = 3

export const templatesFor = (topicId: string, version: VersionId) =>
  (generators[topicId] ?? []).filter((template) => template.versions.includes(version))
