import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useSpeech } from './useSpeech'

describe('useSpeech', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('says it is not supported where the browser cannot speak', () => {
    const { result } = renderHook(() => useSpeech())

    expect(result.current.supported).toBe(false)
    act(() => result.current.speak('Hello'))
    expect(result.current.speaking).toBe(false)
  })

  it('reads the text in English at the asked speed', () => {
    const speak = vi.fn()
    class Utterance {
      lang = ''
      rate = 1
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
      text: string
      constructor(text: string) {
        this.text = text
      }
    }
    vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn() })
    vi.stubGlobal('SpeechSynthesisUtterance', Utterance)
    const { result } = renderHook(() => useSpeech())

    act(() => result.current.speak('Good morning', { rate: 0.7 }))

    expect(result.current.supported).toBe(true)
    expect(result.current.speaking).toBe(true)
    const utterance = speak.mock.calls[0]![0] as Utterance
    expect(utterance).toMatchObject({ text: 'Good morning', lang: 'en-US', rate: 0.7 })

    act(() => utterance.onend?.())
    expect(result.current.speaking).toBe(false)
  })
})
