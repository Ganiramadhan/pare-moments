// Word lists the grammar generators mix into new questions. Every list is written so that ANY
// combination reads naturally and has one clearly right answer: edit with care and run the tests.

export type Activity = { base: string; comp: string }

const a = (base: string, comp: string): Activity => ({ base, comp })

// Everyday things to do. The verb forms come from the daily verbs (`verbs.ts`).
export const GENERAL: Activity[] = [
  a('go', 'to the market'),
  a('eat', 'fried rice'),
  a('drink', 'iced tea'),
  a('buy', 'fresh vegetables'),
  a('cook', 'dinner'),
  a('wash', 'the dishes'),
  a('clean', 'the room'),
  a('walk', 'to school'),
  a('ride', 'a bike'),
  a('study', 'grammar'),
  a('write', 'a letter'),
  a('take', 'many photos'),
  a('make', 'a cake'),
  a('speak', 'English'),
  a('watch', 'a movie'),
  a('play', 'football'),
  a('help', 'the new students'),
  a('visit', 'the museum'),
  a('sing', 'a song'),
  a('swim', 'in the river'),
  a('learn', 'new words'),
  a('work', 'in a shop'),
  a('practice', 'speaking'),
  a('teach', 'English'),
  a('meet', 'new friends'),
  a('bring', 'a notebook'),
  a('send', 'a message'),
  a('draw', 'a picture'),
  a('sell', 'fried rice'),
  a('open', 'the window'),
]

// Things you can be doing right now.
export const NOW: Activity[] = [
  a('go', 'to the market'),
  a('eat', 'fried rice'),
  a('drink', 'iced tea'),
  a('cook', 'dinner'),
  a('wash', 'the dishes'),
  a('clean', 'the room'),
  a('walk', 'to school'),
  a('ride', 'a bike'),
  a('study', 'grammar'),
  a('write', 'a letter'),
  a('make', 'a cake'),
  a('watch', 'a movie'),
  a('play', 'football'),
  a('help', 'the new students'),
  a('sing', 'a song'),
  a('swim', 'in the river'),
  a('work', 'in a shop'),
  a('practice', 'speaking'),
  a('draw', 'a picture'),
]

// Things that go on for a long time ("since Monday").
export const LONG: Activity[] = [
  a('study', 'grammar'),
  a('work', 'in a shop'),
  a('practice', 'speaking'),
  a('learn', 'English'),
  a('live', 'in Pare'),
  a('play', 'football'),
  a('teach', 'English'),
  a('wait', 'for the bus'),
  a('write', 'English stories'),
  a('sing', 'in a choir'),
]

export const PRESENT_MARKERS = ['every day', 'every morning', 'every weekend', 'on Sundays']
export const NOW_MARKERS = ['right now', 'at the moment']
export const PAST_MARKERS = ['yesterday', 'last night', 'two days ago', 'last week', 'last Sunday']
export const FUTURE_MARKERS = ['tomorrow', 'next week', 'next month', 'tomorrow morning']
export const SINCE_MARKERS = ['since Monday', 'since 2024', 'since last month', 'since January']

// Things that happen to something: "The cake is made by my mother." The verb forms come from
// `verbs.ts`; `plural` decides between is / are and was / were.
export type Thing = { verb: string; object: string; plural: boolean; agent: string }

export const THINGS: Thing[] = [
  { verb: 'make', object: 'The cake', plural: false, agent: 'my mother' },
  { verb: 'write', object: 'The letters', plural: true, agent: 'my brother' },
  { verb: 'clean', object: 'The room', plural: false, agent: 'the students' },
  { verb: 'open', object: 'The windows', plural: true, agent: 'the teacher' },
  { verb: 'wash', object: 'The dishes', plural: true, agent: '{name}' },
  { verb: 'take', object: 'The photos', plural: true, agent: 'my friend' },
  { verb: 'sing', object: 'The song', plural: false, agent: 'the whole class' },
  { verb: 'build', object: 'The bridge', plural: false, agent: 'local workers' },
  { verb: 'paint', object: 'The house', plural: false, agent: 'my uncle' },
  { verb: 'cook', object: 'The rice', plural: false, agent: 'my aunt' },
  { verb: 'buy', object: 'The tickets', plural: true, agent: 'my father' },
  { verb: 'send', object: 'The message', plural: false, agent: 'our teacher' },
  { verb: 'tell', object: 'The story', plural: false, agent: 'my grandmother' },
  { verb: 'draw', object: 'The picture', plural: false, agent: 'my sister' },
]

// [time phrase, the right preposition]. Phrases are read after "___" in many frames.
export const TIMES: [string, string][] = [
  ["7 o'clock", 'at'],
  ['noon', 'at'],
  ['midnight', 'at'],
  ['night', 'at'],
  ['lunchtime', 'at'],
  ['Monday', 'on'],
  ['Friday morning', 'on'],
  ['my birthday', 'on'],
  ['Saturday night', 'on'],
  ['5 October', 'on'],
  ['July', 'in'],
  ['2026', 'in'],
  ['the morning', 'in'],
  ['the afternoon', 'in'],
  ['the evening', 'in'],
  ['winter', 'in'],
]

export const TIME_FRAMES = [
  'We have English class ___ {t}.',
  '{name} usually calls home ___ {t}.',
  'I will meet you ___ {t}.',
  'The party starts ___ {t}.',
]

export const PLACES: [string, string][] = [
  ['the bus stop', 'at'],
  ['school', 'at'],
  ['home', 'at'],
  ['the party', 'at'],
  ['the table', 'on'],
  ['the wall', 'on'],
  ['the second floor', 'on'],
  ['the roof', 'on'],
  ['the shelf', 'on'],
  ['Pare', 'in'],
  ['Kediri', 'in'],
  ['Indonesia', 'in'],
  ['the kitchen', 'in'],
  ['the garden', 'in'],
  ['a small room', 'in'],
  ['the box', 'in'],
]

export const PLACE_FRAMES = ['My phone is ___ {p}.', 'My keys are ___ {p}.']

export const WHY_PREP = {
  at: "We use at for exact times and small points: at 7 o'clock, at night, at the bus stop.",
  on: 'We use on for days, dates and surfaces: on Monday, on my birthday, on the table.',
  in: 'We use in for months, years, parts of the day and bigger places: in July, in the morning, in Pare.',
} as const

// [sentence, right word, three wrong words, why]
export const COLLOCATIONS: [string, string, string[], string][] = [
  ['I am interested ___ music.', 'in', ['on', 'at', 'of'], 'We say interested in something.'],
  ['{name} is afraid ___ spiders.', 'of', ['in', 'to', 'at'], 'We say afraid of something.'],
  ['We are waiting ___ the bus.', 'for', ['to', 'at', 'of'], 'We say wait for something.'],
  ['{name} is good ___ drawing.', 'at', ['in', 'of', 'to'], 'We say good at something.'],
  ['Please listen ___ the teacher.', 'to', ['at', 'for', 'of'], 'We say listen to something.'],
  [
    'They arrived ___ Pare yesterday.',
    'in',
    ['on', 'at', 'to'],
    'We say arrive in a city or town.',
  ],
  ['This depends ___ the weather.', 'on', ['in', 'of', 'at'], 'We say depend on something.'],
  ['I am looking ___ my keys.', 'for', ['to', 'at', 'of'], 'Look for means to try to find.'],
  ['{name} is married ___ a teacher.', 'to', ['with', 'at', 'of'], 'We say married to someone.'],
  ['We are proud ___ our class.', 'of', ['in', 'at', 'for'], 'We say proud of something.'],
  ['Thank you ___ your help.', 'for', ['of', 'at', 'to'], 'We say thank you for something.'],
  ['I agree ___ you.', 'with', ['to', 'at', 'of'], 'We say agree with someone.'],
  ['I am worried ___ the test.', 'about', ['of', 'at', 'to'], 'We say worried about something.'],
  [
    'Are you ready ___ the speaking test?',
    'for',
    ['of', 'at', 'in'],
    'We say ready for something.',
  ],
  ["Don't laugh ___ me.", 'at', ['on', 'of', 'to'], 'We say laugh at someone.'],
  [
    '{name} is excited ___ the trip.',
    'about',
    ['of', 'at', 'to'],
    'We say excited about something.',
  ],
  ['I am tired ___ waiting.', 'of', ['at', 'on', 'to'], 'We say tired of doing something.'],
  ['{name} is late ___ class.', 'for', ['of', 'at', 'to'], 'We say late for something.'],
]

export const COUNTABLE = [
  'books',
  'eggs',
  'students',
  'friends',
  'chairs',
  'oranges',
  'photos',
  'words',
  'cups',
]
export const UNCOUNTABLE = ['water', 'rice', 'time', 'money', 'sugar', 'milk', 'homework', 'coffee']

// [question with ___, how it is answered, the right word]
export const HOW_PAIRS: [string, string, string][] = [
  ['How ___ is it from Pare to Kediri?', 'About 25 kilometers.', 'far'],
  ['How ___ did you stay in Pare?', 'For two months.', 'long'],
  ['How ___ do you practice speaking?', 'Three times a week.', 'often'],
  ['How ___ is your little brother?', 'He is seven years old.', 'old'],
  ['How ___ is the English class?', 'It is one hour.', 'long'],
  ['How ___ does the bus come?', 'Every ten minutes.', 'often'],
  ['How ___ is the market from your house?', 'About two kilometers.', 'far'],
  ['How ___ is a bottle of water?', 'Three thousand rupiah.', 'much'],
  ['How ___ students are in your class?', 'There are twenty.', 'many'],
  ['How ___ does it take to get there?', 'About an hour.', 'long'],
  ['How ___ does {name} visit the market?', 'Twice a week.', 'often'],
  ['How ___ is {name}?', 'Sixteen years old.', 'old'],
]

export type QuestionWord = 'What' | 'Who' | 'Where' | 'When' | 'Why' | 'How'

// [the question with ___, the answer, the right question word]
export const WH_PAIRS: [string, string, QuestionWord][] = [
  ['___ do you live?', 'I live in Pare.', 'Where'],
  ['___ is the market?', 'It is near the station.', 'Where'],
  ['___ did {name} go yesterday?', '{name} went to Kediri.', 'Where'],
  ['___ are you from?', 'I am from Medan.', 'Where'],
  ['___ does the class start?', 'It starts at 7 a.m.', 'When'],
  ['___ is your birthday?', 'It is on 5 May.', 'When'],
  ['___ did you arrive in Pare?', 'I arrived last Monday.', 'When'],
  ['___ will we have the test?', 'We will have it next week.', 'When'],
  ['___ is your teacher?', 'Mr. Adi is my teacher.', 'Who'],
  ['___ called you last night?', 'My mother called me.', 'Who'],
  ['___ is that girl?', 'She is my classmate.', 'Who'],
  ['___ taught you grammar?', 'Ms. Rina taught me.', 'Who'],
  ['___ are you late?', 'Because the bus was slow.', 'Why'],
  ['___ did you study English?', 'Because I want to travel.', 'Why'],
  ['___ is {name} so happy?', 'Because {name} passed the test.', 'Why'],
  ['___ do you practice every day?', 'Because practice makes me better.', 'Why'],
  ['___ do you go to school?', 'I go by bike.', 'How'],
  ['___ is your mother?', 'She is fine, thank you.', 'How'],
  ['___ do you spell your name?', 'A-Y-U.', 'How'],
  ['___ did you learn so fast?', 'I learned by speaking every day.', 'How'],
  ['___ do you eat for breakfast?', 'I eat fried rice.', 'What'],
  ['___ is your favorite food?', 'My favorite food is soto.', 'What'],
  ['___ did you do last night?', 'I studied grammar.', 'What'],
  ['___ does "nervous" mean?', 'It means gugup.', 'What'],
]
