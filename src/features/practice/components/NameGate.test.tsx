import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NameGate } from './NameGate'

const setup = () =>
  render(
    <NameGate>
      <p>The test</p>
    </NameGate>,
  )

describe('NameGate', () => {
  it('suggests entering a name before the test, and says it stays on the device', () => {
    setup()

    expect(screen.getByRole('heading', { name: /what is your name/i })).toBeInTheDocument()
    expect(screen.getByText(/stays on this device/i)).toBeInTheDocument()
    expect(screen.queryByText('The test')).not.toBeInTheDocument()
  })

  it('starts the test after a name is saved, and remembers it', async () => {
    const user = userEvent.setup()
    setup()

    await user.type(screen.getByLabelText('Your name'), '  Ayu ')
    await user.click(screen.getByRole('button', { name: 'Save and start' }))

    expect(screen.getByText('The test')).toBeInTheDocument()
    expect(localStorage.getItem('pare-moments:player-name')).toBe('Ayu')
  })

  it('does not accept an empty name, but can be skipped', async () => {
    const user = userEvent.setup()
    setup()
    expect(screen.getByRole('button', { name: 'Save and start' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Skip for now' }))

    expect(screen.getByText('The test')).toBeInTheDocument()
    expect(localStorage.getItem('pare-moments:player-name')).toBeNull()
  })

  it('goes straight to the test when a name is already known', () => {
    localStorage.setItem('pare-moments:player-name', 'Budi')

    setup()

    expect(screen.getByText('The test')).toBeInTheDocument()
  })

  it('does not ask again in the same visit after skipping', async () => {
    const user = userEvent.setup()
    const first = setup()
    await user.click(screen.getByRole('button', { name: 'Skip for now' }))
    first.unmount()

    setup()

    expect(screen.getByText('The test')).toBeInTheDocument()
  })
})
