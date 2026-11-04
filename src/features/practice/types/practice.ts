// A daily-activity verb with its three forms: V1 (base), V2 (past simple) and V3 (past participle).
export type Verb = {
  base: string
  past: string
  participle: string
  // In Indonesian.
  meaning: string
  irregular: boolean
  // One sentence for each form, each containing that form exactly as written.
  sentences: { v1: string; v2: string; v3: string }
}

// The three versions of every test. They get harder, and each has its own questions.
export type VersionId = 'v1' | 'v2' | 'v3'

// One multiple-choice question. The same shape serves verbs, grammar and listening.
export type Question = {
  id: string
  // What is remembered as "already asked", when it is not the id itself (verbs: the verb).
  seenKey?: string
  // What is asked, e.g. "What does 'nervous' mean?" or a sentence with a blank.
  prompt: string
  // A smaller line above the prompt, e.g. "Choose the right word".
  hint?: string
  options: string[]
  correctIndex: number
  explanation?: string
  // English text that can be read out loud, after the question is answered.
  speak?: string
  // A question answered by typing one word. `options` is empty then; any of these is right.
  blank?: { answers: string[] }
}

// One answer that was not right, shown when the round is over.
export type Review = {
  prompt: string
  yours: string
  correct: string
  explanation?: string
}

export type QuizResult = {
  score: number
  total: number
  wrong: Review[]
}

export type GrammarQuestion = {
  // The sentence with ___ where the answer goes. {name}, {f} and {m} become a random name
  // (any, a girl's, a boy's) each time, so the same question looks different on every try.
  sentence: string
  options: string[]
  // The right option, as written in `options`.
  answer: string
  explanation: string
  // Questions of a group are drawn evenly, e.g. two of every tense in a round.
  group?: string
}

export type GrammarVersion = {
  id: VersionId
  // More questions than one round needs, so every round is a different mix.
  questions: GrammarQuestion[]
}

export type GrammarTopic = {
  id: string
  name: string
  description: string
  // How many questions one round has.
  round: number
  // When questions have groups: how many to take from each group in a round.
  perGroup?: number
  versions: GrammarVersion[]
}

export type SentenceItem = {
  english: string
  indonesian: string
}

// A question about a story: pick the answer, pick a detail that changes from round to round (`var`),
// or type the missing word of a sentence of the story.
export type StoryQuestion =
  | { kind: 'choice'; prompt: string; options: string[]; answer: string }
  | {
      kind: 'var'
      prompt: string
      // The name of a detail in `Story.vars`. The choices are its values.
      var: string
      // How a value is written as a choice, e.g. "By {value}".
      format: string
    }
  | { kind: 'blank'; sentence: string; answer: string }

export type Story = {
  id: string
  title: string
  // The story, read out loud. {name}, {f} and {m} become random names (any, a girl's, a boy's).
  // {key} becomes one of the values of `vars[key]`, chosen again for every round.
  text: string
  vars?: Record<string, string[]>
  questions: StoryQuestion[]
}

export type ListeningVersion = {
  id: VersionId
  stories: Story[]
}
