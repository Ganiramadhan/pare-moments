import type { GrammarTopic } from '../../types/practice'
import { q } from './helpers'

export const prepositions: GrammarTopic = {
  id: 'prepositions',
  name: 'Prepositions',
  description: 'In, on, at, to, for: small words, big difference.',
  round: 6,
  versions: [
    {
      id: 'v1',
      questions: [
        q(
          "The class starts ___ 8 o'clock.",
          ['in', 'on', 'at', 'to'],
          'at',
          "We use at for exact times: at 8 o'clock, at noon.",
        ),
        q(
          'My birthday is ___ October.',
          ['in', 'on', 'at', 'by'],
          'in',
          'We use in for months, years and seasons: in October, in 2026.',
        ),
        q(
          'We met ___ Monday.',
          ['in', 'on', 'at', 'for'],
          'on',
          'We use on for days and dates: on Monday, on 5 October.',
        ),
        q(
          'I am good ___ speaking English.',
          ['in', 'at', 'on', 'for'],
          'at',
          'The adjective good goes with at: good at something.',
        ),
        q(
          '{f} lives ___ a small room near the market.',
          ['in', 'on', 'at', 'by'],
          'in',
          'We use in for a space with walls around it, like a room.',
        ),
        q(
          'We walked ___ the fountain after class.',
          ['to', 'in', 'on', 'at'],
          'to',
          'To shows movement toward a place: walk to the fountain.',
        ),
        q(
          'The book is ___ the table.',
          ['on', 'in', 'at', 'from'],
          'on',
          'We use on for something that touches a surface.',
        ),
        q(
          'I go to school ___ bike.',
          ['by', 'with', 'on', 'in'],
          'by',
          'We use by with a means of transport: by bike, by bus, by car.',
        ),
      ],
    },
    {
      id: 'v2',
      questions: [
        q(
          '{name} is afraid ___ spiders.',
          ['of', 'from', 'at', 'for'],
          'of',
          'The adjective afraid goes with of: afraid of something.',
        ),
        q(
          'We arrived ___ Pare in the evening.',
          ['in', 'to', 'on', 'for'],
          'in',
          'We say arrive in a town or a city, and arrive at a small place.',
        ),
        q(
          "I'm interested ___ learning new words.",
          ['in', 'on', 'at', 'about'],
          'in',
          'The adjective interested goes with in: interested in something.',
        ),
        q(
          '{f} has lived here ___ 2020.',
          ['for', 'since', 'from', 'at'],
          'since',
          'Use since with a starting point (2020).',
        ),
        q(
          'The teacher is angry ___ the noise.',
          ['about', 'of', 'to', 'in'],
          'about',
          'We say angry about something, and angry with someone.',
        ),
        q(
          'We stayed at home ___ the rain.',
          ['because of', 'because', 'although', 'so'],
          'because of',
          'Because of is followed by a noun (the rain). Because is followed by a clause.',
        ),
        q(
          'Please wait ___ me at the gate.',
          ['for', 'to', 'at', 'on'],
          'for',
          'The verb wait goes with for: wait for someone.',
        ),
        q(
          "I'm looking forward ___ the holiday.",
          ['to', 'for', 'at', 'in'],
          'to',
          'The phrase look forward is followed by to: look forward to something.',
        ),
      ],
    },
    {
      id: 'v3',
      questions: [
        q(
          '{f} is married ___ a doctor.',
          ['to', 'with', 'by', 'for'],
          'to',
          'The adjective married goes with to: married to someone.',
        ),
        q(
          'The meeting was cancelled ___ the bad weather.',
          ['due to', 'because', 'so that', 'in case'],
          'due to',
          'Due to is followed by a noun (the bad weather).',
        ),
        q(
          'We talked ___ our plans for hours.',
          ['about', 'at', 'to', 'with'],
          'about',
          'We talk about a topic.',
        ),
        q(
          '{m} is responsible ___ the project.',
          ['for', 'of', 'to', 'at'],
          'for',
          'The adjective responsible goes with for: responsible for something.',
        ),
        q(
          'I prefer tea ___ coffee.',
          ['to', 'than', 'over', 'from'],
          'to',
          'The verb prefer is followed by to: prefer A to B.',
        ),
        q(
          '{f} apologized ___ being late.',
          ['for', 'of', 'at', 'about'],
          'for',
          'The verb apologize goes with for: apologize for something.',
        ),
        q(
          'The students are fed up ___ the noise.',
          ['with', 'by', 'from', 'of'],
          'with',
          'The phrase fed up goes with with: fed up with something.',
        ),
        q(
          'Pare is famous ___ its English courses.',
          ['for', 'at', 'with', 'by'],
          'for',
          'The adjective famous goes with for: famous for something.',
        ),
      ],
    },
  ],
}
