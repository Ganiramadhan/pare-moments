import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ShareButton } from './ShareButton'

describe('ShareButton', () => {
  it('copies the link when the share sheet is not available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<ShareButton title="Day 1" />)

    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(await screen.findByText('Link copied')).toBeInTheDocument()
    vi.unstubAllGlobals()
  })

  it('uses the share sheet when the phone has one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { share })
    const user = userEvent.setup()
    render(<ShareButton title="Day 1" text="Hello" />)

    await user.click(screen.getByRole('button', { name: /share/i }))

    expect(share).toHaveBeenCalledWith({ title: 'Day 1', text: 'Hello', url: window.location.href })
    vi.unstubAllGlobals()
  })
})
