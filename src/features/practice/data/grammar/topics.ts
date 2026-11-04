import type { GrammarTopic } from '../../types/practice'
import { modals } from './modals'
import { passiveVoice } from './passive-voice'
import { prepositions } from './prepositions'
import { quantity } from './quantity'
import { questionWords } from './question-words'
import { tenses } from './tenses'

// Every grammar topic, in the order they are shown.
export const grammarTopics: GrammarTopic[] = [
  tenses,
  questionWords,
  passiveVoice,
  quantity,
  modals,
  prepositions,
]
