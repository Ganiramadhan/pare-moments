import type { GrammarTopic } from '../../types/practice'
import { q } from './helpers'

export const modals: GrammarTopic = {
  id: 'modals',
  name: 'Modal verbs',
  description: 'Can, could, must, should, might and friends.',
  round: 6,
  versions: [
    {
      id: 'v1',
      questions: [
        q(
          'You ___ speak English in the dormitory. It is the rule.',
          ['must', 'might', 'would', 'could'],
          'must',
          'Must shows a strong rule or duty.',
        ),
        q(
          '___ I borrow your pen, please?',
          ['Can', 'Must', 'Should', 'Will'],
          'Can',
          'We use Can I...? to ask for permission.',
        ),
        q(
          'You look tired. You ___ rest.',
          ['should', "shouldn't", "mustn't", "won't"],
          'should',
          'Should gives advice: it is a good idea to rest.',
        ),
        q(
          'When I was a child, I ___ swim.',
          ['can', 'could', 'must', 'should'],
          'could',
          'Could is the past of can, for an ability in the past.',
        ),
        q(
          'I ___ speak three languages.',
          ['can', 'must', 'would', 'shall'],
          'can',
          'Can shows an ability that you have now.',
        ),
        q(
          'It is cold. You ___ wear a jacket.',
          ['should', "needn't", "can't", "mightn't"],
          'should',
          'Should gives advice: it is a good idea to wear a jacket.',
        ),
        q(
          '___ you help me, please?',
          ['Could', 'Must', 'Might', 'Shall'],
          'Could',
          'Could you...? is a polite request.',
        ),
        q(
          'You ___ smoke here. It is not allowed.',
          ["mustn't", "needn't", 'can', 'will'],
          "mustn't",
          "Mustn't means it is not allowed.",
        ),
      ],
    },
    {
      id: 'v2',
      questions: [
        q(
          'It is a holiday tomorrow, so we ___ get up early.',
          ["don't have to", 'must', 'have to', 'should'],
          "don't have to",
          "Don't have to means it is not necessary, and a holiday makes it unnecessary.",
        ),
        q(
          'You ___ be late for the speaking test. It starts on time.',
          ["mustn't", "needn't", 'can', 'may'],
          "mustn't",
          'Mustn\'t means "do not do this": a strong warning.',
        ),
        q(
          'I am not sure where {f} is. She ___ be in the library.',
          ['might', "mustn't", "needn't", "shouldn't"],
          'might',
          'Might shows a possibility that you are not sure about.',
        ),
        q(
          "That ___ be {f}'s bag. It has her name on it.",
          ['must', "can't", "needn't", "shouldn't"],
          'must',
          'Must shows a strong belief: the name proves it.',
        ),
        q(
          'You ___ take a taxi. The station is five minutes away.',
          ["needn't", 'must', 'shall', 'ought'],
          "needn't",
          "Needn't means it is not necessary to do it.",
        ),
        q(
          'If I were you, I ___ study harder.',
          ['would', 'will', 'can', 'must'],
          'would',
          'Would is used to give advice with "If I were you".',
        ),
        q(
          "Let's go to the beach this weekend, ___ we?",
          ['shall', 'will', 'can', 'must'],
          'shall',
          "After Let's... the question tag is shall we? It is a friendly suggestion.",
        ),
        q(
          'You ___ to see a doctor. You look sick.',
          ['ought', 'can', 'may', 'will'],
          'ought',
          'Ought to gives advice, like should. After ought we use "to".',
        ),
      ],
    },
    {
      id: 'v3',
      questions: [
        q(
          '{f} ___ have left already. Her bag is gone.',
          ['must', "needn't", "mustn't", "won't"],
          'must',
          'Must have + past participle shows a strong belief about the past.',
        ),
        q(
          'I ___ have studied harder. I failed the test.',
          ['should', 'shall', 'will', "mustn't"],
          'should',
          'Should have + past participle shows regret about the past.',
        ),
        q(
          '{m} ___ be at home. I just saw him in the market.',
          ["can't", 'must', 'should', "needn't"],
          "can't",
          "Can't shows a strong belief that something is impossible.",
        ),
        q(
          'Students ___ bring their phones to the exam. It is forbidden.',
          ["mustn't", "needn't", "don't have to", 'might'],
          "mustn't",
          "Mustn't means it is forbidden. Don't have to would mean it is not necessary.",
        ),
        q(
          'You ___ have told me earlier! I could have helped.',
          ['should', 'will', 'may', 'must'],
          'should',
          'Should have + past participle: it was a good idea, but it did not happen.',
        ),
        q(
          'I ___ rather stay at home than go out tonight.',
          ['would', 'should', 'must', 'can'],
          'would',
          'We say "would rather" to show a preference.',
        ),
        q(
          '___ I use your phone for a moment?',
          ['May', 'Must', 'Will', 'Would'],
          'May',
          'May I...? is a polite way to ask for permission.',
        ),
        q(
          'We ___ to hurry. The class starts in five minutes.',
          ['have', 'may', 'can', 'would'],
          'have',
          'Have to shows that something is necessary.',
        ),
      ],
    },
  ],
}
