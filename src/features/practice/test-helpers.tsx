import { vi } from 'vitest'

// A browser that can read aloud, for tests of the listening features. Returns what was spoken.
export const stubSpeech = () => {
  const spoken: { text: string; rate: number }[] = []
  class Utterance {
    lang = ''
    rate = 1
    text: string
    onend: (() => void) | null = null
    onerror: (() => void) | null = null
    constructor(text: string) {
      this.text = text
    }
  }
  vi.stubGlobal('speechSynthesis', {
    speak: (utterance: Utterance) => spoken.push({ text: utterance.text, rate: utterance.rate }),
    cancel: vi.fn(),
  })
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance)
  return spoken
}

// The visitor already gave a name, so tests do not stop at the name question.
export const withName = (name = 'Ayu') => localStorage.setItem('pare-moments:player-name', name)
