import type { GrammarQuestion, GrammarTopic, Question, VersionId } from '../types/practice'
import { draw, drawGrouped } from './draw'
import { shuffle, type Random } from './random'
import type { Seen } from './seen'
import { GENERATED_PER_ROUND, generators, templatesFor, type Template } from './grammar-generators'
import { fillSlots, makeSlots } from './slots'

type Pooled = GrammarQuestion & { id: string; seenKey?: string }

// Turns a written question into one to play: random names filled in, choices mixed up.
const toQuestion = (item: Pooled, random: Random): Question => {
  const slots = makeSlots(random)
  const options = shuffle(item.options, random).map((option) => fillSlots(option, slots))
  const answer = fillSlots(item.answer, slots)
  return {
    id: item.id,
    seenKey: item.seenKey,
    hint: 'Choose the best answer',
    prompt: fillSlots(item.sentence, slots),
    options,
    correctIndex: options.indexOf(answer),
    explanation: fillSlots(item.explanation, slots),
    speak: fillSlots(item.sentence, slots).replace('___', answer),
  }
}

const pooled = (topic: GrammarTopic, version: VersionId): Pooled[] =>
  (topic.versions.find((v) => v.id === version)?.questions ?? []).map((question, index) => ({
    ...question,
    id: `grammar-${topic.id}-${version}-${index}`,
  }))

const instanceOf = (
  topicId: string,
  template: Template,
  version: VersionId,
  random: Random,
): Pooled => ({
  ...template.make(version, random),
  id: `gen-${topicId}-${template.id}-${version}-${Math.floor(random() * 1e9)}`,
  seenKey: `gen-${topicId}-${template.id}`,
})

// New questions made from templates, the less-used templates first. A template can be used twice
// in a round, but the same sentence never twice.
const generate = (
  topicId: string,
  templates: Template[],
  count: number,
  version: VersionId,
  seen: Seen,
  random: Random,
): Pooled[] => {
  if (templates.length === 0) return []
  const ordered = draw(
    templates.map((template) => ({ template, id: `gen-${topicId}-${template.id}` })),
    templates.length,
    seen,
    random,
  ).map(({ template }) => template)
  const made: Pooled[] = []
  for (let n = 0; made.length < count && n < count * 6; n += 1) {
    const item = instanceOf(topicId, ordered[n % ordered.length]!, version, random)
    if (!made.some((other) => other.sentence === item.sentence)) made.push(item)
  }
  return made
}

/**
 * One round of a topic's version. About half of it is made fresh from templates (other words,
 * names and choices every time, so it never repeats); the rest is drawn from the written questions,
 * the ones not asked yet first. For tenses, every tense is covered.
 */
export const grammarQuestions = (
  topic: GrammarTopic,
  version: VersionId,
  random: Random = Math.random,
  seen: Seen = {},
): Question[] => {
  const pool = pooled(topic, version)
  const templates = templatesFor(topic.id, version)

  if (topic.perGroup) {
    const made = templates.flatMap((template) =>
      generate(topic.id, [template], 1, version, seen, random),
    )
    const written = drawGrouped(pool, topic.perGroup - (made.length > 0 ? 1 : 0), seen, random)
    return shuffle([...written, ...made], random).map((item) => toQuestion(item, random))
  }

  const made = generate(
    topic.id,
    templates,
    Math.min(GENERATED_PER_ROUND, topic.round),
    version,
    seen,
    random,
  )
  const written = draw(pool, topic.round - made.length, seen, random)
  return shuffle([...written, ...made], random).map((item) => toQuestion(item, random))
}

// A round with questions from every topic and every version.
export const mixedGrammarQuestions = (
  topics: GrammarTopic[],
  count: number,
  random: Random = Math.random,
  seen: Seen = {},
): Question[] => {
  const pool: Pooled[] = topics.flatMap((topic) => [
    ...topic.versions.flatMap((version) => pooled(topic, version.id)),
    ...(generators[topic.id] ?? []).flatMap((template) =>
      template.versions.map((version) => instanceOf(topic.id, template, version, random)),
    ),
  ])
  return shuffle(draw(pool, count, seen, random), random).map((item) => toQuestion(item, random))
}

export const questionCount = (topic: GrammarTopic, version: VersionId) =>
  topic.perGroup
    ? new Set(pooled(topic, version).map((item) => item.group)).size * topic.perGroup
    : topic.round
