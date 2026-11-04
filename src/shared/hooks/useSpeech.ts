import { useCallback, useEffect, useState } from 'react'

type SpeakOptions = {
  // 1 is normal speed; 0.7 is slow.
  rate?: number
}

// Reads English out loud with the browser's own voice. Most phones and computers can do it;
// `supported` is false where they cannot (then the Listen buttons should simply not be shown).
export function useSpeech() {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  const [speaking, setSpeaking] = useState(false)

  const speak = useCallback(
    (text: string, { rate = 1 }: SpeakOptions = {}) => {
      if (!supported) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = rate
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      setSpeaking(true)
      window.speechSynthesis.speak(utterance)
    },
    [supported],
  )

  // Stop talking when the page goes away.
  useEffect(
    () => () => {
      // The browser may already be gone when a test or a page tears down.
      if (supported) window.speechSynthesis?.cancel()
    },
    [supported],
  )

  return { supported, speaking, speak }
}
