import { grammarTopics } from '../data/grammar/topics'
import { listeningVersions } from '../data/listening'
import { sentences } from '../data/sentences'
import { verbs } from '../data/verbs'
import { VERSIONS } from '../constants'
import { dailyQuestions } from './daily-questions'
import { isBlankCorrect, normalizeAnswer } from './blank'
import { draw, drawGrouped } from './draw'
import { grammarQuestions, mixedGrammarQuestions, questionCount } from './grammar-questions'
import { messageFor, percentOf, starsFor } from './grade'
import { fillDetails, storyRound } from './listening-questions'
import { pageNumbers, paginate } from './pages'
import { seededRandom, shuffle, textSeed } from './random'
import { loadSeen, markSeen } from './seen'
import { fillSlots, makeSlots } from './slots'
import { verbQuestions } from './verb-questions'

const topicsRound = (seed: number) =>
  grammarTopics.map((topic) => grammarQuestions(topic, 'v3', seededRandom(seed)))

const allGrammar = grammarTopics.flatMap((topic) =>
  topic.versions.flatMap((version) =>
    version.questions.map((question) => ({ topic, version, question })),
  ),
)

describe('shuffle and the seeded generator', () => {
  it('keeps every item and leaves the original list alone', () => {
    const list = [1, 2, 3, 4, 5, 6]

    expect([...shuffle(list, seededRandom(7))].sort()).toEqual(list)
    expect(list).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('gives the same numbers for the same seed, and others for another seed', () => {
    const a = seededRandom(textSeed('2026-10-22'))
    const b = seededRandom(textSeed('2026-10-22'))
    const c = seededRandom(textSeed('2026-10-23'))

    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(a()).not.toBe(c())
  })
})

describe('random names', () => {
  it('fills {name}, {f} and {m}, with the same name each time within one question', () => {
    const slots = makeSlots(seededRandom(4))

    const text = fillSlots('{f} and {f} met {m} and {name}.', slots)

    expect(text).not.toMatch(/[{}]/)
    expect(text.startsWith(`${slots.f} and ${slots.f} met ${slots.m}`)).toBe(true)
  })
})

describe('drawing questions so they do not repeat', () => {
  const pool = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id }))

  it('prefers questions that were asked the fewest times', () => {
    const seen = { a: 3, b: 3, c: 3, d: 1, e: 0, f: 0 }

    const picked = draw(pool, 3, seen, seededRandom(1)).map((item) => item.id)

    expect(picked).toContain('e')
    expect(picked).toContain('f')
    expect(picked).toContain('d')
  })

  it('takes the same number from every group', () => {
    const grouped = [
      ...['a1', 'a2', 'a3'].map((id) => ({ id, group: 'A' })),
      ...['b1', 'b2', 'b3'].map((id) => ({ id, group: 'B' })),
    ]

    const picked = drawGrouped(grouped, 2, {}, seededRandom(2))

    expect(picked.filter((item) => item.group === 'A')).toHaveLength(2)
    expect(picked.filter((item) => item.group === 'B')).toHaveLength(2)
  })

  it('remembers what was asked', () => {
    markSeen(['x', 'y'])
    markSeen(['x'])

    expect(loadSeen()).toEqual({ x: 2, y: 1 })
  })
})

describe('the daily verbs', () => {
  it('has a hundred verbs, regular and irregular', () => {
    expect(verbs).toHaveLength(100)
    expect(verbs.filter((v) => v.irregular).length).toBeGreaterThan(40)
    expect(verbs.filter((v) => !v.irregular).length).toBeGreaterThan(20)
  })

  it('has no verb or meaning used twice', () => {
    expect(new Set(verbs.map((v) => v.base)).size).toBe(verbs.length)
    expect(new Set(verbs.map((v) => v.meaning)).size).toBe(verbs.length)
  })

  it('has an example for each form that contains exactly that form', () => {
    verbs.forEach((verb) => {
      const has = (sentence: string, form: string) =>
        new RegExp(`\\b${form}\\b`, 'i').test(sentence)
      expect(has(verb.sentences.v1, verb.base)).toBe(true)
      expect(has(verb.sentences.v2, verb.past)).toBe(true)
      expect(has(verb.sentences.v3, verb.participle)).toBe(true)
    })
  })

  it('writes regular verbs with -ed in V2 and V3', () => {
    verbs
      .filter((v) => !v.irregular)
      .forEach((verb) => {
        expect(verb.past).toBe(verb.participle)
        expect(verb.past.endsWith('ed')).toBe(true)
      })
  })
})

describe('verbQuestions', () => {
  const questions = verbQuestions(verbs, 10, seededRandom(1))

  it('makes the asked number of questions about different verbs, each with four different choices', () => {
    expect(questions).toHaveLength(10)
    expect(new Set(questions.map((q) => q.seenKey)).size).toBe(10)
    questions.forEach((q) => {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.explanation).toMatch(/V1 .* · V2 .* · V3 /)
    })
  })

  it('points at a right choice that really is the asked form of the verb', () => {
    questions.forEach((q) => {
      const verb = verbs.find((v) => `verb-${v.base}` === q.seenKey)!
      const right = q.options[q.correctIndex]
      expect([verb.base, verb.past, verb.participle]).toContain(right)
    })
  })

  it('mixes the kinds of question, in a different order each time', () => {
    const kinds = (seed: number) =>
      verbQuestions(verbs, 5, seededRandom(seed)).map((q) => q.id.split('-').slice(2).join('-'))

    expect(new Set(kinds(1)).size).toBe(5)
    expect(kinds(1)).not.toEqual(kinds(2))
  })

  it('asks about verbs that were not asked yet before the ones that were', () => {
    const seen = Object.fromEntries(verbs.slice(0, 12).map((v) => [`verb-${v.base}`, 5]))

    const next = verbQuestions(verbs, 8, seededRandom(9), seen)

    next.forEach((q) => expect(verbs.slice(12).map((v) => `verb-${v.base}`)).toContain(q.seenKey))
  })

  it('gives a different set of verbs in the next ten rounds until all of them were asked', () => {
    let seen: Record<string, number> = {}
    const asked = new Set<string>()
    for (let round = 0; round < 10; round += 1) {
      const questions = verbQuestions(verbs, 10, seededRandom(round + 1), seen)
      questions.forEach((q) => {
        asked.add(q.seenKey!)
        seen = { ...seen, [q.seenKey!]: (seen[q.seenKey!] ?? 0) + 1 }
      })
    }
    expect(asked.size).toBe(100)
  })

  it('always has four different choices with the right one among them, for every verb', () => {
    for (let seed = 1; seed <= 5; seed += 1) {
      verbQuestions(verbs, 100, seededRandom(seed)).forEach((q) => {
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
        expect(q.options[q.correctIndex]).toBeTruthy()
        expect(q.prompt).not.toMatch(/undefined/)
      })
    }
  })
})

describe('the grammar bank', () => {
  it('has six topics, each with three versions', () => {
    expect(grammarTopics.map((t) => t.id)).toEqual([
      'tenses',
      'question-words',
      'passive-voice',
      'how-questions',
      'modals',
      'prepositions',
    ])
    grammarTopics.forEach((topic) =>
      expect(topic.versions.map((v) => v.id)).toEqual(VERSIONS.map((v) => v.id)),
    )
  })

  it('has a blank in every sentence', () => {
    allGrammar.forEach(({ question }) => expect(question.sentence).toContain('___'))
  })

  it('lists the right answer among the choices exactly once, with no duplicate choices', () => {
    allGrammar.forEach(({ question }) => {
      expect(question.options.filter((o) => o === question.answer)).toHaveLength(1)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.options.length).toBeGreaterThanOrEqual(3)
      expect(question.explanation.length).toBeGreaterThan(10)
    })
  })

  it('has no question written twice, in any topic or version', () => {
    const sentencesList = allGrammar.map(
      ({ question }) => `${question.sentence}|${question.answer}`,
    )
    expect(new Set(sentencesList).size).toBe(sentencesList.length)
  })

  it('gives every version more questions than a round needs, so rounds differ', () => {
    grammarTopics.forEach((topic) =>
      topic.versions.forEach((version) =>
        expect(version.questions.length).toBeGreaterThan(topic.perGroup ? 14 : topic.round),
      ),
    )
  })

  it('covers the seven basic tenses with three questions each in every version', () => {
    const tenses = grammarTopics.find((t) => t.id === 'tenses')!
    const groups = [
      'present-simple',
      'present-continuous',
      'past-simple',
      'future-simple',
      'present-perfect',
      'present-perfect-continuous',
      'past-perfect',
    ]
    tenses.versions.forEach((version) =>
      groups.forEach((group) =>
        expect(version.questions.filter((q) => q.group === group)).toHaveLength(3),
      ),
    )
  })

  it('only uses the random-name placeholders that match the pronouns around them', () => {
    allGrammar.forEach(({ question }) => {
      const text = ` ${question.sentence} ${question.options.join(' ')} `.toLowerCase()
      const words = (pattern: string) => new RegExp(`\\b(${pattern})\\b`).test(text)
      if (question.sentence.includes('{name}')) expect(words('she|her|he|his|him')).toBe(false)
      if (question.sentence.includes('{f}')) expect(words('he|his|him')).toBe(false)
      if (question.sentence.includes('{m}')) expect(words('she|her')).toBe(false)
      const used = (question.sentence + question.explanation).match(/\{[^}]*\}/g) ?? []
      used.forEach((slot) => expect(['{name}', '{f}', '{m}']).toContain(slot))
    })
  })
})

describe('grammar rounds', () => {
  const topic = (id: string) => grammarTopics.find((t) => t.id === id)!

  it('keeps the right answer in place after mixing the choices and filling in names', () => {
    const round = grammarQuestions(topic('modals'), 'v1', seededRandom(3))

    expect(round).toHaveLength(6)
    round.forEach((q) => {
      expect(q.prompt + q.options.join('')).not.toMatch(/[{}]/)
      expect(q.options[q.correctIndex]).toBeTruthy()
      expect(new Set(q.options).size).toBe(q.options.length)
    })
  })

  it('gives a tense round of 14 with two questions of every tense', () => {
    const tenses = topic('tenses')
    const round = grammarQuestions(tenses, 'v2', seededRandom(5))
    const bank = tenses.versions[1]!.questions

    expect(round).toHaveLength(14)
    expect(questionCount(tenses, 'v2')).toBe(14)
    const written = round.filter((q) => q.id.startsWith('grammar-'))
    const groups = written.map((q) => bank[Number(q.id.split('-').pop())]!.group)
    expect(new Set(groups).size).toBe(7)
    expect(round.filter((q) => q.id.startsWith('gen-'))).toHaveLength(7)
  })

  it('makes a different round every time', () => {
    const a = grammarQuestions(topic('prepositions'), 'v1', seededRandom(1)).map((q) => q.id)
    const b = grammarQuestions(topic('prepositions'), 'v1', seededRandom(2)).map((q) => q.id)

    expect(a).not.toEqual(b)
  })

  it('asks questions that were not seen yet before the ones that were', () => {
    const modals = topic('modals')
    const bank = modals.versions[0]!.questions
    const seen = Object.fromEntries(bank.slice(0, 6).map((_, i) => [`grammar-modals-v1-${i}`, 4]))

    const round = grammarQuestions(modals, 'v1', seededRandom(8), seen)

    const asked = round
      .filter((q) => q.id.startsWith('grammar-'))
      .map((q) => Number(q.id.split('-').pop()))
    expect(asked).toContain(6)
    expect(asked).toContain(7)
  })

  it('keeps the versions apart: V1 and V2 never share a question', () => {
    const v1 = grammarQuestions(topic('modals'), 'v1').map((q) => q.id)
    const v2 = grammarQuestions(topic('modals'), 'v2').map((q) => q.id)

    expect(v1.filter((id) => v2.includes(id))).toEqual([])
  })

  it('can mix topics and versions', () => {
    const round = mixedGrammarQuestions(grammarTopics, 10, seededRandom(5))

    expect(round).toHaveLength(10)
    expect(new Set(round.map((q) => q.id.split('-')[1])).size).toBeGreaterThan(2)
  })
})

describe('questions made from templates', () => {
  const made = grammarTopics.flatMap((topic) =>
    (['v1', 'v2', 'v3'] as const).flatMap((version) =>
      Array.from({ length: 40 }, (_, n) =>
        grammarQuestions(topic, version, seededRandom(n + 1), {}).filter((q) =>
          q.id.startsWith('gen-'),
        ),
      ).flat(),
    ),
  )

  it('makes questions for five topics, in every version', () => {
    expect(new Set(made.map((q) => q.id.split('-')[1])).size).toBe(5)
  })

  it('always has four different choices, a blank and the right answer among them', () => {
    expect(made.length).toBeGreaterThan(1000)
    made.forEach((q) => {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBeTruthy()
      expect(q.prompt).toContain('___')
      expect(q.prompt + q.options.join('')).not.toMatch(/[{}]|undefined|eing| {2}/)
      expect(q.explanation?.length).toBeGreaterThan(10)
    })
  })

  it('makes many different questions, not the same few', () => {
    const prompts = (topicId: string) =>
      new Set(made.filter((q) => q.id.startsWith(`gen-${topicId}-`)).map((q) => q.prompt))

    expect(prompts('tenses').size).toBeGreaterThan(500)
    expect(prompts('passive-voice').size).toBeGreaterThan(30)
    expect(prompts('prepositions').size).toBeGreaterThan(30)
  })

  it('never asks the same sentence twice in one round', () => {
    for (let seed = 1; seed <= 30; seed += 1) {
      topicsRound(seed).forEach((round) =>
        expect(new Set(round.map((q) => q.prompt)).size).toBe(round.length),
      )
    }
  })

  it('writes the right form for each tense', () => {
    const answerOf = (q: { options: string[]; correctIndex: number }) => q.options[q.correctIndex]
    const tenses = made.filter((q) => q.id.startsWith('gen-tenses-'))
    const past = tenses.filter((q) => q.id.includes('past-simple'))
    const perfect = tenses.filter((q) => q.id.includes('present-perfect-continuous'))

    past.forEach((q) => expect(answerOf(q)).toMatch(/^[a-z]+ed$|^(?!will|have|has|had)[a-z]+$/))
    perfect.forEach((q) => expect(answerOf(q)).toMatch(/^(have|has) been \w+ing$/))
  })
})

describe('the listening stories', () => {
  const stories = listeningVersions.flatMap((v) => v.stories)
  // Every combination of details a story can be told with (the first values, the second, …).
  const tellings = (story: (typeof stories)[number]) =>
    Array.from({ length: 4 }, (_, n) =>
      Object.fromEntries(
        Object.entries(story.vars ?? {}).map(([key, values]) => [key, values[n % values.length]!]),
      ),
    )

  it('has three versions with two stories each', () => {
    expect(listeningVersions.map((v) => v.id)).toEqual(['v1', 'v2', 'v3'])
    listeningVersions.forEach((v) => expect(v.stories).toHaveLength(2))
    expect(new Set(stories.map((s) => s.id)).size).toBe(6)
  })

  it('has five choice-type and three fill-in-the-blank questions for every story', () => {
    stories.forEach((story) => {
      expect(story.questions.filter((q) => q.kind !== 'blank')).toHaveLength(5)
      expect(story.questions.filter((q) => q.kind === 'blank')).toHaveLength(3)
    })
  })

  it('lists the right answer among four different choices', () => {
    stories.forEach((story) =>
      story.questions.forEach((q) => {
        if (q.kind === 'choice') {
          expect(q.options).toHaveLength(4)
          expect(new Set(q.options).size).toBe(4)
          expect(q.options.filter((o) => o === q.answer)).toHaveLength(1)
        }
        if (q.kind === 'var') {
          const values = story.vars![q.var]!
          expect(new Set(values).size).toBe(values.length)
          expect(values.length).toBeGreaterThanOrEqual(4)
          expect(story.text).toContain(`{${q.var}}`)
        }
      }),
    )
  })

  it('has blanks that are one word and really come from the story, whatever the details', () => {
    stories.forEach((story) =>
      tellings(story).forEach((details) => {
        const text = fillDetails(story.text, details)
        expect(text).not.toMatch(/\{(?!name|f|m)\w+\}/)
        story.questions.forEach((q) => {
          if (q.kind !== 'blank') return
          const answer = fillDetails(q.answer, details)
          expect(q.sentence.split('___')).toHaveLength(2)
          expect(answer).not.toContain(' ')
          expect(text).toContain(fillDetails(q.sentence.replace('___', answer), details))
        })
      }),
    )
  })
})

describe('storyRound', () => {
  const version = listeningVersions[0]!

  it('makes three multiple-choice and two fill-in-the-blank questions about one story', () => {
    const round = storyRound(version, seededRandom(6))

    expect(round.questions).toHaveLength(5)
    expect(round.questions.filter((q) => q.blank)).toHaveLength(2)
    expect(round.text).not.toMatch(/[{}]/)
    round.questions.forEach((q) => expect(q.prompt + q.options.join('')).not.toMatch(/[{}]/))
  })

  it('points at the right choice, and keeps the typed answer out of the question', () => {
    const round = storyRound(version, seededRandom(3))

    round.questions.forEach((q) => {
      if (q.blank) {
        expect(q.prompt).toContain('___')
        expect(q.blank.answers[0]).toBeTruthy()
        expect(round.text).toContain(q.blank.answers[0])
      } else {
        expect(q.options[q.correctIndex]).toBeTruthy()
      }
    })
  })

  it('tells another story when the first one was asked about already', () => {
    const first = storyRound(version, seededRandom(1))
    const seen = Object.fromEntries(first.questions.map((q) => [q.id, 3]))

    const next = storyRound(version, seededRandom(1), seen)

    expect(next.title).not.toBe(first.title)
  })
})

describe('pages of a long list', () => {
  it('cuts a list into pages and keeps the page inside the limits', () => {
    const list = Array.from({ length: 100 }, (_, i) => i)

    expect(paginate(list, 1, 12)).toMatchObject({ pageCount: 9, page: 1 })
    expect(paginate(list, 9, 12).items).toHaveLength(4)
    expect(paginate(list, 99, 12).page).toBe(9)
    expect(paginate([], 3, 12)).toMatchObject({ pageCount: 1, page: 1, items: [] })
  })

  it('shows the first, the last and the pages around the current one', () => {
    expect(pageNumbers(1, 3)).toEqual([1, 2, 3])
    expect(pageNumbers(5, 9)).toEqual([1, null, 4, 5, 6, null, 9])
    expect(pageNumbers(2, 9)).toEqual([1, 2, 3, null, 9])
  })
})

describe('typed answers', () => {
  it('ignore capital letters, spaces and punctuation', () => {
    expect(normalizeAnswer('  Rice! ')).toBe('rice')
    expect(isBlankCorrect('RICE.', ['rice'])).toBe(true)
    expect(isBlankCorrect('rise', ['rice'])).toBe(false)
    expect(isBlankCorrect('', ['rice'])).toBe(false)
  })
})

describe('the sentence bank', () => {
  it('has twelve different sentences, each with an Indonesian hint', () => {
    expect(sentences).toHaveLength(12)
    expect(new Set(sentences.map((s) => s.english)).size).toBe(sentences.length)
    sentences.forEach((s) => {
      expect(s.english.split(' ').length).toBeGreaterThan(3)
      expect(s.indonesian.length).toBeGreaterThan(5)
    })
  })
})

describe('dailyQuestions', () => {
  it('is the same all day, different the next day, and has five questions', () => {
    const today = dailyQuestions('2026-10-22', verbs, grammarTopics)

    expect(today).toHaveLength(5)
    expect(today.map((q) => q.id)).toEqual(
      dailyQuestions('2026-10-22', verbs, grammarTopics).map((q) => q.id),
    )
    expect(today.map((q) => q.id)).not.toEqual(
      dailyQuestions('2026-10-23', verbs, grammarTopics).map((q) => q.id),
    )
  })
})

describe('grading', () => {
  it('turns a score into a percent, stars and a message', () => {
    expect(percentOf(7, 10)).toBe(70)
    expect(percentOf(0, 0)).toBe(0)
    expect([95, 75, 55, 20].map(starsFor)).toEqual([3, 2, 1, 0])
    expect(messageFor(95)).toMatch(/Excellent/)
    expect(messageFor(10)).toMatch(/Keep going/)
  })
})
