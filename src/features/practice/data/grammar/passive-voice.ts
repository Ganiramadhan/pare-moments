import type { GrammarTopic } from '../../types/practice'
import { q } from './helpers'

export const passiveVoice: GrammarTopic = {
  id: 'passive-voice',
  name: 'Passive voice',
  description: 'Be + past participle: when the action matters more than who does it.',
  round: 6,
  versions: [
    {
      id: 'v1',
      questions: [
        q(
          'English ___ in many countries.',
          ['speaks', 'is spoken', 'spoke', 'is speaking'],
          'is spoken',
          'Passive (present): am / is / are + past participle. English receives the action of speaking.',
        ),
        q(
          'The photos ___ by my friend yesterday.',
          ['took', 'were taken', 'are taken', 'is taking'],
          'were taken',
          'Passive (past): was / were + past participle. The photos are plural, so use were.',
        ),
        q(
          'This website ___ by many people every day.',
          ['visits', 'is visited', 'visited', 'has visit'],
          'is visited',
          'Passive (present): is + past participle. The website receives the action.',
        ),
        q(
          'The lesson ___ by the teacher at nine.',
          ['is given', 'gives', 'gave', 'giving'],
          'is given',
          'Passive (present): is + past participle. The lesson receives the action of giving.',
        ),
        q(
          'The cake ___ by my mother last night.',
          ['was made', 'is made', 'made', 'making'],
          'was made',
          'Passive (past): "last night" is a finished time, so use was + past participle.',
        ),
        q(
          'A new school ___ in our village next year.',
          ['will build', 'will be built', 'builds', 'is building'],
          'will be built',
          'Passive (future): will be + past participle.',
        ),
        q(
          'Rice ___ by farmers in Kediri.',
          ['grows', 'is grown', 'is growing', 'grew'],
          'is grown',
          'Passive (present): the farmers do the action, so rice is grown by them.',
        ),
        q(
          'My bag ___ yesterday.',
          ['stole', 'was stolen', 'is stolen', 'stolen'],
          'was stolen',
          'Passive (past): was + past participle. Steal is irregular: stolen.',
        ),
      ],
    },
    {
      id: 'v2',
      questions: [
        q(
          'The windows ___ every Friday.',
          ['are cleaned', 'clean', 'cleaned', 'are cleaning'],
          'are cleaned',
          'Passive (present): are + past participle. The windows receive the action.',
        ),
        q(
          'The winner ___ tomorrow.',
          ['will announce', 'will be announced', 'announces', 'is announcing'],
          'will be announced',
          'Passive (future): will be + past participle.',
        ),
        q(
          'The homework ___ already been checked.',
          ['has', 'have', 'is', 'did'],
          'has',
          'Passive (present perfect): has / have been + past participle. "Homework" is singular, so use has.',
        ),
        q(
          'The speech ___ by the whole class.',
          ['was enjoyed', 'enjoyed', 'enjoys', 'is enjoy'],
          'was enjoyed',
          'Passive (past): was + past participle. The speech receives the action.',
        ),
        q(
          'When ___ this temple built?',
          ['was', 'is', 'did', 'does'],
          'was',
          'Passive question (past): When + was / were + subject + past participle.',
        ),
        q(
          'These rooms ___ by students at night.',
          ['are used', 'use', 'using', 'uses'],
          'are used',
          'Passive (present): are + past participle. The rooms receive the action.',
        ),
        q(
          'The gate ___ at ten every night.',
          ['is locked', 'locks', 'locking', 'lock'],
          'is locked',
          'Passive (present): is + past participle. The gate receives the action of locking.',
        ),
        q(
          'The letters ___ yet.',
          ["haven't been sent", "didn't send", "aren't sending", "haven't sent"],
          "haven't been sent",
          "Passive (present perfect, negative): haven't been + past participle. The letters do not send themselves.",
        ),
      ],
    },
    {
      id: 'v3',
      questions: [
        q(
          'I ___ to the party by my neighbor.',
          ['invited', 'was invited', 'am inviting', 'invite'],
          'was invited',
          'Passive (past): I received the action, so use was + past participle.',
        ),
        q(
          'The new bridge ___ at the moment.',
          ['is being built', 'is built', 'builds', 'has built'],
          'is being built',
          'Passive (present continuous): is / are being + past participle, for an action happening now.',
        ),
        q(
          'The answer ___ by anyone.',
          ["hasn't been given", "didn't give", "isn't giving", "hasn't given"],
          "hasn't been given",
          "Passive (present perfect): hasn't / haven't been + past participle.",
        ),
        q(
          '{f} was ___ the first prize.',
          ['given', 'gave', 'giving', 'gives'],
          'given',
          'Passive (past): was + past participle. Give is irregular: given.',
        ),
        q(
          'English ___ at our school since 1990.',
          ['has been taught', 'teaches', 'is teaching', 'taught'],
          'has been taught',
          'Passive (present perfect): has been + past participle. "Since 1990" needs the perfect.',
        ),
        q(
          'The report must ___ by Friday.',
          ['finish', 'be finished', 'finished', 'finishing'],
          'be finished',
          'Passive with a modal: modal + be + past participle.',
        ),
        q(
          'This room ___ for a meeting tomorrow.',
          ['will use', 'will be used', 'uses', 'was used'],
          'will be used',
          'Passive (future): will be + past participle.',
        ),
        q(
          'The students ___ to speak only English in the camp.',
          ['are told', 'tell', 'are telling', 'told'],
          'are told',
          'Passive (present): are + past participle. Tell is irregular: told.',
        ),
      ],
    },
  ],
}
