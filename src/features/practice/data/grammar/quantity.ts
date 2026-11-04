import type { GrammarTopic } from '../../types/practice'
import { q } from './helpers'

export const quantity: GrammarTopic = {
  id: 'how-questions',
  name: 'How much, how many & more',
  description: 'How much, how many, how long, how far, how often, how old and other how-questions.',
  round: 6,
  versions: [
    {
      id: 'v1',
      questions: [
        q(
          '___ students are in your class?',
          ['How much', 'How many', 'How long', 'How far'],
          'How many',
          'Use How many with things you can count (students).',
        ),
        q(
          '___ water do you drink every day?',
          ['How many', 'How much', 'How far', 'How old'],
          'How much',
          'Use How much with things you cannot count (water).',
        ),
        q(
          '___ is the walk to the market? About ten minutes.',
          ['How long', 'How many', 'How much', 'How old'],
          'How long',
          'Use How long to ask about time or length.',
        ),
        q(
          '___ is your village from here? About five kilometers.',
          ['How far', 'How long', 'How many', 'How often'],
          'How far',
          'Use How far to ask about distance.',
        ),
        q(
          '___ do you have English class? Three times a week.',
          ['How often', 'How long', 'How far', 'How much'],
          'How often',
          'Use How often to ask about frequency.',
        ),
        q(
          '___ is your brother? He is fifteen.',
          ['How old', 'How long', 'How many', 'How much'],
          'How old',
          'Use How old to ask about age.',
        ),
        q(
          '___ is this book? Fifty thousand rupiah.',
          ['How much', 'How many', 'How far', 'How old'],
          'How much',
          'Use How much to ask about a price.',
        ),
        q(
          '___ is the tower? It is 100 meters.',
          ['How tall', 'How old', 'How many', 'How often'],
          'How tall',
          'Use How tall (or How high) to ask about height.',
        ),
      ],
    },
    {
      id: 'v2',
      questions: [
        q(
          '___ people came to the party?',
          ['How much', 'How many', 'How long', 'How often'],
          'How many',
          'People can be counted, so use How many.',
        ),
        q(
          '___ sugar do you put in your tea?',
          ['How much', 'How many', 'How long', 'How far'],
          'How much',
          'Sugar cannot be counted, so use How much.',
        ),
        q(
          '___ does the film last? Two hours.',
          ['How long', 'How far', 'How often', 'How many'],
          'How long',
          'Use How long to ask how much time something takes.',
        ),
        q(
          '___ is it from Pare to Kediri City? About 25 km.',
          ['How far', 'How many', 'How much', 'How old'],
          'How far',
          'Use How far to ask about distance.',
        ),
        q(
          '___ do you wake up? At five every morning.',
          ['What time', 'How often', 'How long', 'How many'],
          'What time',
          'Use What time to ask about the time of day.',
        ),
        q(
          '___ homework do we have today?',
          ['How much', 'How many', 'How often', 'How far'],
          'How much',
          'Homework is uncountable in English, so use How much.',
        ),
        q(
          '___ have you lived in Pare? Since January.',
          ['How long', 'How far', 'How many', 'How much'],
          'How long',
          'Use How long + present perfect to ask about a period until now.',
        ),
        q(
          '___ is the room? It is six meters wide.',
          ['How wide', 'How old', 'How many', 'How often'],
          'How wide',
          'Use How wide to ask about width.',
        ),
      ],
    },
    {
      id: 'v3',
      questions: [
        q(
          '___ money do you need for the bus ticket?',
          ['How much', 'How many', 'How far', 'How long'],
          'How much',
          'Money is uncountable, so use How much.',
        ),
        q(
          '___ times have you visited Malang?',
          ['How many', 'How much', 'How often', 'How long'],
          'How many',
          '"Times" can be counted: How many times...?',
        ),
        q(
          '___ do you go to the library? Twice a week.',
          ['How often', 'How long', 'How far', 'How tall'],
          'How often',
          'Twice a week is a frequency, so ask How often.',
        ),
        q(
          '___ is the lake? Ten meters at the deepest point.',
          ['How deep', 'How many', 'How often', 'How much'],
          'How deep',
          'Use How deep to ask about depth.',
        ),
        q(
          '___ will the trip take? About three hours.',
          ['How long', 'How far', 'How many', 'How old'],
          'How long',
          'Use How long to ask about the time something takes.',
        ),
        q(
          'Excuse me, ___ is this jacket? It is one hundred thousand rupiah.',
          ['How much', 'How many', 'How old', 'How far'],
          'How much',
          'Use How much to ask about a price.',
        ),
        q(
          '___ pages did you read last night?',
          ['How many', 'How much', 'How long', 'How far'],
          'How many',
          'Pages can be counted, so use How many.',
        ),
        q(
          '___ is the bag? Five kilos.',
          ['How heavy', 'How many', 'How often', 'How long'],
          'How heavy',
          'Use How heavy to ask about weight.',
        ),
      ],
    },
  ],
}
