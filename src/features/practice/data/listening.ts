import type { ListeningVersion, StoryQuestion } from '../types/practice'

// Listening practice with short stories. The browser reads the story out loud and it is not shown
// until the end. After it, a round asks three multiple-choice questions and two fill-in-the-blank
// questions (type the missing word you heard), drawn from the story's questions.
//
// Stories change from round to round:
//  - {name}, {f} and {m} become random names (any, a girl's, a boy's); use she / her after {f}
//    and he / him after {m},
//  - {key} becomes one of the values of the story's `vars[key]` (a different one every round). A
//    `var` question asks about it, with four of its values as choices, so a list used by a `var`
//    question needs at least four values. A value used in a blank is ONE word.
//  - for a `blank`, `sentence` with `answer` put back must be written exactly like that in the
//    story (the tests check it, for every value).
const choice = (prompt: string, options: string[], answer: string): StoryQuestion => ({
  kind: 'choice',
  prompt,
  options,
  answer,
})
const detail = (prompt: string, variable: string, format = '{value}'): StoryQuestion => ({
  kind: 'var',
  prompt,
  var: variable,
  format,
})
const blank = (sentence: string, answer: string): StoryQuestion => ({
  kind: 'blank',
  sentence,
  answer,
})

export const listeningVersions: ListeningVersion[] = [
  {
    id: 'v1',
    stories: [
      {
        id: 'a-day-in-pare',
        title: 'A day in Pare',
        text: "{f} lives in Pare. Every morning she wakes up at {wake} o'clock. She takes a shower and eats {food}. Then she goes to the English course by {transport}. The class starts at {start} o'clock. She studies grammar and speaking for {hours} hours.",
        vars: {
          wake: ['four', 'five', 'six', 'seven'],
          food: [
            'fried rice with an egg',
            'noodles with an egg',
            'bread with butter',
            'rice with chicken',
          ],
          transport: ['bike', 'motorbike', 'bus', 'angkot'],
          start: ['eight', 'nine', 'ten', 'eleven'],
          hours: ['two', 'three', 'four', 'five'],
        },
        questions: [
          detail('What time does she wake up?', 'wake', "At {value} o'clock"),
          detail('What does she eat for breakfast?', 'food'),
          detail('How does she go to the course?', 'transport', 'By {value}'),
          detail('What time does the class start?', 'start', "At {value} o'clock"),
          detail('How long does she study at the course?', 'hours', '{value} hours'),
          blank("Every morning she ___ up at {wake} o'clock.", 'wakes'),
          blank('Then she goes to the English course by ___.', '{transport}'),
          blank('She studies grammar and ___ for {hours} hours.', 'speaking'),
        ],
      },
      {
        id: 'at-the-warung',
        title: 'At the warung',
        text: '{m} and {f} are hungry after class. They go to a small warung near the camp. {m} orders {order}. {f} orders chicken soup and hot tea. The food is {taste}. They pay {price} thousand rupiah each and walk back to the {home}.',
        vars: {
          order: [
            'nasi pecel and iced tea',
            'fried rice and hot tea',
            'noodles and coffee',
            'gado-gado and orange juice',
          ],
          taste: ['delicious and cheap', 'hot and spicy', 'fresh and tasty', 'sweet and small'],
          price: ['five', 'ten', 'twelve', 'fifteen'],
          home: ['dormitory', 'camp', 'hostel', 'hotel'],
        },
        questions: [
          choice(
            'Where do they go?',
            ['To a big restaurant', 'To a small warung', 'To the market', 'To the library'],
            'To a small warung',
          ),
          detail('What does {m} order?', 'order'),
          detail('How much does each person pay?', 'price', '{value} thousand rupiah'),
          detail('How is the food?', 'taste'),
          detail('Where do they walk back to?', 'home', 'To the {value}'),
          blank('{m} and {f} are hungry after ___.', 'class'),
          blank('They go to a small ___ near the camp.', 'warung'),
          blank('They pay ___ thousand rupiah each and walk back to the {home}.', '{price}'),
        ],
      },
    ],
  },
  {
    id: 'v2',
    stories: [
      {
        id: 'a-busy-weekend',
        title: 'A busy weekend',
        text: "Last {day}, {f} and her friends visited a {place} near Pare. They left at {leave} o'clock in the morning and traveled by {vehicle}. The road was long, but the view was beautiful. When they arrived, they swam for an hour and had a picnic. Unfortunately, it started to rain in the afternoon, so they went home early. {f} said it was the best day of her trip.",
        vars: {
          day: ['Friday', 'Saturday', 'Sunday', 'Monday'],
          place: ['waterfall', 'beach', 'lake', 'river'],
          leave: ['six', 'seven', 'eight', 'nine'],
          vehicle: ['motorbike', 'car', 'bus', 'bicycle'],
        },
        questions: [
          detail('When did they go on the trip?', 'day', 'Last {value}'),
          detail('Where did they go?', 'place', 'To a {value}'),
          detail('What time did they leave?', 'leave', "At {value} o'clock"),
          detail('How did they travel?', 'vehicle', 'By {value}'),
          choice(
            'Why did they go home early?',
            ['It was too hot', 'They were hungry', 'It started to rain', 'The road was closed'],
            'It started to rain',
          ),
          blank("They left at {leave} o'clock in the ___ and traveled by {vehicle}.", 'morning'),
          blank('The road was long, but the ___ was beautiful.', 'view'),
          blank('When they arrived, they swam for an hour and had a ___.', 'picnic'),
        ],
      },
      {
        id: 'the-speaking-test',
        title: 'The speaking test',
        text: '{m} was very nervous about his speaking test. He practiced every night for {weeks} weeks with his {partner}. On the day of the test, he woke up early and drank a glass of water. The teacher asked him three questions about his family and his {topic}. He answered slowly and clearly. When he saw his score, he was surprised. He got {score} out of one hundred!',
        vars: {
          weeks: ['one', 'two', 'three', 'four'],
          partner: ['roommate', 'sister', 'cousin', 'friend'],
          topic: ['hobbies', 'school', 'city', 'food'],
          score: ['seventy', 'eighty', 'ninety', 'ninety-five'],
        },
        questions: [
          detail('How long did he practice?', 'weeks', '{value} weeks'),
          detail('Who did he practice with?', 'partner', 'His {value}'),
          detail('What did the teacher ask about?', 'topic', 'His family and his {value}'),
          detail('What was his score?', 'score'),
          choice(
            'How did he answer?',
            ['Quickly and loudly', 'Slowly and clearly', 'Quietly and shyly', 'Badly'],
            'Slowly and clearly',
          ),
          blank('He practiced every ___ for {weeks} weeks with his {partner}.', 'night'),
          blank('The teacher asked him three questions about his family and his ___.', '{topic}'),
          blank('He answered slowly and ___.', 'clearly'),
        ],
      },
    ],
  },
  {
    id: 'v3',
    stories: [
      {
        id: 'the-lost-wallet',
        title: 'The lost wallet',
        text: '{f} was walking to the market when she realized that she had lost her {item}. She had already bought some vegetables, so she thought she must have dropped it near the {stall}. She went back and asked the seller, but the seller had not seen it. Feeling worried, she reported it to the police office nearby. Two hours later, {person} called her. The person had found the {item} on the road and wanted to return it. {f} thanked the person and promised to buy lunch.',
        vars: {
          item: ['wallet', 'phone', 'bag', 'umbrella'],
          stall: ['fruit stall', 'fish stall', 'rice stall', 'egg stall'],
          person: ['a young man', 'an old woman', 'a school boy', 'a taxi driver'],
        },
        questions: [
          detail('What did {f} lose?', 'item', 'Her {value}'),
          detail('Where did she think she had dropped it?', 'stall', 'Near the {value}'),
          detail('Who found it and called her?', 'person'),
          choice(
            'What did she do after the seller said he had not seen it?',
            [
              'She went home',
              'She bought more vegetables',
              'She reported it to the police',
              'She called a friend',
            ],
            'She reported it to the police',
          ),
          choice(
            'How did {f} thank the person?',
            [
              'She gave money',
              'She promised to buy lunch',
              'She bought flowers',
              'She wrote a letter',
            ],
            'She promised to buy lunch',
          ),
          blank(
            '{f} was walking to the market when she realized that she had ___ her {item}.',
            'lost',
          ),
          blank('Feeling worried, she reported it to the ___ office nearby.', 'police'),
          blank('The person had found the {item} on the ___ and wanted to return it.', 'road'),
        ],
      },
      {
        id: 'a-new-habit',
        title: 'A new habit',
        text: 'About {months} months ago, {m} decided to improve his English. He had always been afraid of speaking, so he started with small steps. First, he listened to English {listen} every day. Then he began to write a {write} before going to bed. After a month, he joined a {club} club, where he met many friendly people. Now he speaks with much more confidence, and he is planning to join a speech contest next year.',
        vars: {
          months: ['two', 'three', 'four', 'five'],
          listen: ['songs', 'podcasts', 'stories', 'news'],
          write: ['diary', 'letter', 'story', 'poem'],
          club: ['speaking', 'debate', 'drama', 'reading'],
        },
        questions: [
          detail('When did he decide to improve his English?', 'months', '{value} months ago'),
          detail('What did he listen to every day?', 'listen', 'English {value}'),
          detail('What did he write before going to bed?', 'write', 'A {value}'),
          detail('Which club did he join?', 'club', 'A {value} club'),
          choice(
            'What was he afraid of?',
            ['Writing', 'Listening', 'Speaking', 'Reading'],
            'Speaking',
          ),
          blank('First, he listened to English ___ every day.', '{listen}'),
          blank(
            'After a month, he joined a {club} ___, where he met many friendly people.',
            'club',
          ),
          blank(
            'Now he speaks with much more ___, and he is planning to join a speech contest next year.',
            'confidence',
          ),
        ],
      },
    ],
  },
]
