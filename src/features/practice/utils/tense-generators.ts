import {
  FUTURE_MARKERS,
  GENERAL,
  LONG,
  NOW,
  NOW_MARKERS,
  PAST_MARKERS,
  PRESENT_MARKERS,
  SINCE_MARKERS,
  type Activity,
} from '../data/grammar/generator-data'
import { verbs } from '../data/verbs'
import type { GrammarQuestion, VersionId } from '../types/practice'
import { withIng, withS } from './forms'
import { pick, type Random } from './random'
import type { Template } from './grammar-generators'

type Person = 'i' | 's3' | 'pl'
type Subject = { text: string; person: Person }

const BASIC: Subject[] = [
  { text: 'I', person: 'i' },
  { text: 'You', person: 'pl' },
  { text: 'We', person: 'pl' },
  { text: 'They', person: 'pl' },
]
const MORE: Subject[] = [
  { text: '{name}', person: 's3' },
  { text: 'My brother', person: 's3' },
  { text: 'Our teacher', person: 's3' },
  { text: 'My parents', person: 'pl' },
  { text: 'The students', person: 'pl' },
  { text: 'My friends', person: 'pl' },
]

// V1 uses I / you / we / they, V2 uses he-she-it and plural nouns, V3 uses all of them.
const subjectsFor = (version: VersionId) =>
  version === 'v1' ? BASIC : version === 'v2' ? MORE : [...BASIC, ...MORE]

const one = <T>(items: readonly T[], random: Random) => pick(items, 1, random)[0]!

const beOf = (person: Person) => (person === 'i' ? 'am' : person === 's3' ? 'is' : 'are')
const haveOf = (person: Person) => (person === 's3' ? 'has' : 'have')
const middle = (subject: Subject) =>
  subject.text === 'I' || subject.text.startsWith('{')
    ? subject.text
    : subject.text.charAt(0).toLowerCase() + subject.text.slice(1)

const formsOf = (activity: Activity) => {
  const verb = verbs.find((v) => v.base === activity.base)!
  return {
    base: verb.base,
    s: withS(verb.base),
    ing: withIng(verb.base),
    past: verb.past,
    part: verb.participle,
  }
}

type Build = (context: {
  subject: Subject
  f: ReturnType<typeof formsOf>
  activity: Activity
  random: Random
}) => { sentence: string; answer: string; wrong: string[]; explanation: string }

const tense = (group: string, activities: Activity[], build: Build): Template => ({
  id: `tense-${group}`,
  group,
  versions: ['v1', 'v2', 'v3'],
  make: (version, random): GrammarQuestion => {
    const subject = one(subjectsFor(version), random)
    const activity = one(activities, random)
    const { sentence, answer, wrong, explanation } = build({
      subject,
      f: formsOf(activity),
      activity,
      random,
    })
    const options = [
      answer,
      ...pick(
        [...new Set(wrong)].filter((w) => w !== answer),
        3,
        random,
      ),
    ]
    return { sentence, options, answer, explanation, group }
  },
})

const agree = (subject: Subject, f: ReturnType<typeof formsOf>) =>
  subject.person === 's3' ? f.s : f.base
const wrongAgree = (subject: Subject, f: ReturnType<typeof formsOf>) =>
  subject.person === 's3' ? f.base : f.s

export const tenseTemplates: Template[] = [
  tense('present-simple', GENERAL, ({ subject, f, activity, random }) => ({
    sentence: `${subject.text} ___ ${activity.comp} ${one(PRESENT_MARKERS, random)}.`,
    answer: agree(subject, f),
    wrong: [wrongAgree(subject, f), f.ing, f.past, `will ${f.base}`],
    explanation:
      'Present simple: use the base form for habits (add -s after he, she, it or a name). Every day is a clue.',
  })),
  tense('present-continuous', NOW, ({ subject, f, activity, random }) => {
    const be = beOf(subject.person)
    return {
      sentence: `${subject.text} ___ ${activity.comp} ${one(NOW_MARKERS, random)}.`,
      answer: `${be} ${f.ing}`,
      wrong: [
        `${one(
          ['am', 'is', 'are'].filter((b) => b !== be),
          random,
        )} ${f.ing}`,
        agree(subject, f),
        f.past,
        `${haveOf(subject.person)} ${f.part}`,
      ],
      explanation:
        'Present continuous: am / is / are + verb-ing for actions happening now. Right now is a clue.',
    }
  }),
  tense('past-simple', GENERAL, ({ subject, f, activity, random }) => ({
    sentence: `${subject.text} ___ ${activity.comp} ${one(PAST_MARKERS, random)}.`,
    answer: f.past,
    wrong: [
      agree(subject, f),
      f.ing,
      `${haveOf(subject.person)} ${f.part}`,
      `will ${f.base}`,
      `would ${f.base}`,
    ],
    explanation:
      'Simple past: use V2 for a finished action. Yesterday and last week are finished times.',
  })),
  tense('future-simple', GENERAL, ({ subject, f, activity, random }) => ({
    sentence: `${subject.text} ___ ${activity.comp} ${one(FUTURE_MARKERS, random)}.`,
    answer: `will ${f.base}`,
    wrong: [f.past, `${haveOf(subject.person)} ${f.part}`, `will ${f.ing}`, `had ${f.part}`],
    explanation:
      'Simple future: will + the base form for plans and predictions. Tomorrow is a clue.',
  })),
  tense('present-perfect', LONG, ({ subject, f, activity, random }) => ({
    sentence: `${subject.text} ___ ${activity.comp} ${one(SINCE_MARKERS, random)}.`,
    answer: `${haveOf(subject.person)} ${f.part}`,
    wrong: [f.past, `${beOf(subject.person)} ${f.ing}`, agree(subject, f), `will ${f.base}`],
    explanation:
      'Present perfect: have / has + V3 for something that started in the past and goes on until now. Since is a clue.',
  })),
  tense('present-perfect-continuous', LONG, ({ subject, f, activity, random }) => ({
    sentence: `${subject.text} ___ ${activity.comp} ${one(SINCE_MARKERS, random)}.`,
    answer: `${haveOf(subject.person)} been ${f.ing}`,
    wrong: [f.past, `${beOf(subject.person)} ${f.ing}`, agree(subject, f), `will be ${f.ing}`],
    explanation:
      'Present perfect continuous: have / has been + verb-ing for an action that began in the past and is still going on.',
  })),
  tense(
    'past-perfect',
    GENERAL.filter((activity) => activity.base !== 'sleep'),
    ({ subject, f, activity }) => ({
      sentence: `By the time the class ended, ${middle(subject)} ___ ${activity.comp} already.`,
      answer: `had ${f.part}`,
      wrong: [`${haveOf(subject.person)} ${f.part}`, agree(subject, f), `will ${f.base}`, f.ing],
      explanation:
        'Past perfect: had + V3 for an action that was finished before another moment in the past.',
    }),
  ),
]
