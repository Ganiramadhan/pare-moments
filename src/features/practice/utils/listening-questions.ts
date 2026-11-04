import type { ListeningVersion, Question, Story } from '../types/practice'
import { draw } from './draw'
import { pick, shuffle, type Random } from './random'
import type { Seen } from './seen'
import { fillSlots, makeSlots } from './slots'

export const STORY_CHOICES = 3
export const STORY_BLANKS = 2
export const STORY_QUESTIONS = STORY_CHOICES + STORY_BLANKS

// One value for every detail of a story, e.g. { transport: 'bike' }.
export const chooseDetails = (story: Story, random: Random) =>
  Object.fromEntries(
    Object.entries(story.vars ?? {}).map(([key, values]) => [key, pick(values, 1, random)[0]!]),
  )

// Puts the chosen details in a text: "by {transport}" -> "by bike".
export const fillDetails = (text: string, details: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (whole, key: string) => details[key] ?? whole)

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export type StoryRound = {
  title: string
  // The story as it is read out loud, with the random names filled in.
  text: string
  questions: Question[]
}

/**
 * One listening round: a story of the version is read aloud, then come three multiple-choice
 * questions and two fill-in-the-blank questions about it. The story, the questions, the names and the
 * order of the choices change from round to round, and what was not asked yet comes first.
 */
export const storyRound = (
  version: ListeningVersion,
  random: Random = Math.random,
  seen: Seen = {},
): StoryRound => {
  // The story that was asked about the least comes first.
  const storySeen: Seen = Object.fromEntries(
    version.stories.map((story) => [
      `story-${story.id}`,
      story.questions.reduce((sum, _, index) => sum + (seen[`${story.id}-q${index}`] ?? 0), 0),
    ]),
  )
  const story: Story = draw(
    version.stories.map((s) => ({ story: s, id: `story-${s.id}` })),
    1,
    storySeen,
    random,
  )[0]!.story

  const slots = makeSlots(random)
  const details = chooseDetails(story, random)
  const fill = (text: string) => fillSlots(fillDetails(text, details), slots)
  const numbered = story.questions.map((question, index) => ({
    question,
    id: `${story.id}-q${index}`,
  }))
  const choices = draw(
    numbered.filter((item) => item.question.kind !== 'blank'),
    STORY_CHOICES,
    seen,
    random,
  )
  const blanks = draw(
    numbered.filter((item) => item.question.kind === 'blank'),
    STORY_BLANKS,
    seen,
    random,
  )

  const questions = [...choices, ...blanks].map(({ question, id }): Question => {
    if (question.kind === 'choice') {
      const options = shuffle(question.options, random).map(fill)
      return {
        id,
        hint: 'Listen to the story, then answer',
        prompt: fill(question.prompt),
        options,
        correctIndex: options.indexOf(fill(question.answer)),
      }
    }
    if (question.kind === 'var') {
      const values = story.vars?.[question.var] ?? []
      const right = details[question.var]!
      const shown = shuffle(
        [
          right,
          ...pick(
            values.filter((value) => value !== right),
            3,
            random,
          ),
        ],
        random,
      )
      const options = shown.map((value) => capital(question.format.replace('{value}', value)))
      return {
        id,
        hint: 'Listen to the story, then answer',
        prompt: fill(question.prompt),
        options,
        correctIndex: shown.indexOf(right),
      }
    }
    const heard = fill(question.sentence.replace('___', question.answer))
    return {
      id,
      hint: 'Type the missing word you heard in the story',
      prompt: fill(question.sentence),
      options: [],
      correctIndex: 0,
      blank: { answers: [fill(question.answer)] },
      explanation: `In the story: "${heard}"`,
    }
  })

  return { title: story.title, text: fill(story.text), questions }
}
