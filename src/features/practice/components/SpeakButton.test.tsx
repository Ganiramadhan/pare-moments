import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SpeakButton } from './SpeakButton'

describe('SpeakButton', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows nothing where the browser cannot read aloud', () => {
    const { container } = render(<SpeakButton text="Hello" slow />)

    expect(container).toBeEmptyDOMElement()
  })

  it('reads the text out loud, normally or slowly', async () => {
    const speak = vi.fn()
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
    vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn() })
    vi.stubGlobal('SpeechSynthesisUtterance', Utterance)
    const user = userEvent.setup()
    render(<SpeakButton text="Good morning" slow />)

    await user.click(screen.getByRole('button', { name: 'Listen' }))
    await user.click(screen.getByRole('button', { name: 'Slow' }))

    expect(speak.mock.calls.map(([u]) => [u.text, u.rate])).toEqual([
      ['Good morning', 1],
      ['Good morning', 0.65],
    ])
  })
})
