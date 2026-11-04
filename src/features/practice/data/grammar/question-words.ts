import type { GrammarTopic } from '../../types/practice'
import { q } from './helpers'

export const questionWords: GrammarTopic = {
  id: 'question-words',
  name: 'Question words',
  description: 'What, who, where, when, why, which, whose and how: ask the right question.',
  round: 6,
  versions: [
    {
      id: 'v1',
      questions: [
        q(
          '___ is your name?',
          ['What', 'Who', 'Where', 'When'],
          'What',
          'Use What to ask about things, names and information.',
        ),
        q(
          '___ is the teacher? She is the woman in the red dress.',
          ['What', 'Who', 'Whose', 'Where'],
          'Who',
          'Use Who to ask about a person.',
        ),
        q(
          '___ do you live? In Pare.',
          ['Where', 'When', 'Why', 'Who'],
          'Where',
          'Use Where to ask about a place.',
        ),
        q(
          "___ does the class start? At eight o'clock.",
          ['When', 'Where', 'Whose', 'Why'],
          'When',
          'Use When to ask about a time.',
        ),
        q(
          '___ are you late? Because the bus was slow.',
          ['Why', 'Where', 'Who', 'When'],
          'Why',
          'Use Why to ask about a reason. The answer often starts with because.',
        ),
        q(
          '___ book is this? It is mine.',
          ['Who', 'Whose', 'Which', 'What'],
          'Whose',
          'Use Whose to ask who something belongs to.',
        ),
        q(
          '___ do you go to school? By bike.',
          ['How', 'Where', 'Who', 'Why'],
          'How',
          'Use How to ask about the way something is done.',
        ),
        q(
          '___ color do you like, red or blue?',
          ['Which', 'Whose', 'Who', 'Where'],
          'Which',
          'Use Which when there is a small, known choice (red or blue).',
        ),
      ],
    },
    {
      id: 'v2',
      questions: [
        q(
          '___ time does the speaking class finish?',
          ['What', 'When', 'How', 'Where'],
          'What',
          'We say "What time" to ask about the time of day, not "When time" or "How time".',
        ),
        q(
          '___ did you come to Pare? Last month.',
          ['When', 'Where', 'Who', 'What'],
          'When',
          'Use When to ask about a time. The answer is "last month".',
        ),
        q(
          '___ is your best friend? {name} is.',
          ['Who', 'What', 'Whose', 'Where'],
          'Who',
          'Use Who to ask about a person.',
        ),
        q(
          '___ of these two dictionaries is better?',
          ['Which', 'What', 'Who', 'Whose'],
          'Which',
          'Use Which of... when you choose between known things.',
        ),
        q(
          '___ old is your sister? She is twelve.',
          ['How', 'What', 'Which', 'Who'],
          'How',
          'We ask about age with How old.',
        ),
        q(
          '___ is the nearest bank? It is next to the market.',
          ['Where', 'Who', 'Why', 'When'],
          'Where',
          'Use Where to ask about a place.',
        ),
        q(
          '___ did he say? He said he was tired.',
          ['What', 'Who', 'Where', 'Whose'],
          'What',
          'Use What to ask about the thing that was said.',
        ),
        q(
          '___ are you crying? I lost my phone.',
          ['Why', 'Who', 'Whose', 'Which'],
          'Why',
          'Use Why to ask about a reason.',
        ),
      ],
    },
    {
      id: 'v3',
      questions: [
        q(
          '___ often do you practice speaking? Every day.',
          ['How', 'When', 'What', 'Which'],
          'How',
          'We ask about frequency with How often.',
        ),
        q(
          '___ car is parked outside? It belongs to our teacher.',
          ['Whose', 'Who', 'Where', 'When'],
          'Whose',
          'Use Whose to ask who owns something.',
        ),
        q(
          '___ do you want to sit, by the window or near the door?',
          ['Where', 'Who', 'When', 'Whose'],
          'Where',
          'Use Where to ask about a place or position.',
        ),
        q(
          'Do you know ___ the exam starts?',
          ['when', 'does', 'that', 'whose'],
          'when',
          'In an indirect question the word order is normal: when the exam starts (not when does the exam start).',
        ),
        q(
          "I don't know ___ {f} is. Maybe she is in the library.",
          ['where', 'does', 'is', 'that'],
          'where',
          'In an indirect question we use the question word + subject + verb: where she is.',
        ),
        q(
          'Excuse me, ___ can I get to the station?',
          ['How', 'Who', 'Whose', 'Why'],
          'How',
          'Use How to ask about the way to do something or to get somewhere.',
        ),
        q(
          '___ of the students won the speaking contest?',
          ['Which', 'Who', 'What', 'Whose'],
          'Which',
          'Use Which of the... to ask about one in a group. We do not say "Who of the students".',
        ),
        q(
          '___ you tell me what time it is, please?',
          ['Could', 'What', 'Whose', 'Who'],
          'Could',
          'Could you...? starts a polite request.',
        ),
      ],
    },
  ],
}
