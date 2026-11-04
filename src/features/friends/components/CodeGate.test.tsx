import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '@/test/test-utils'
import { CodeGate } from './CodeGate'

describe('CodeGate', () => {
  it('lets you in with the right code', async () => {
    const onVerified = vi.fn()
    const user = userEvent.setup()
    renderWithRouter(<CodeGate onVerified={onVerified} />)

    await user.type(screen.getByLabelText('Class code'), 'pare2026')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(onVerified).toHaveBeenCalledWith('PARE2026'))
  })

  it('explains a wrong code', async () => {
    const onVerified = vi.fn()
    const user = userEvent.setup()
    renderWithRouter(<CodeGate onVerified={onVerified} />)

    await user.type(screen.getByLabelText('Class code'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/isn't right/i)
    expect(onVerified).not.toHaveBeenCalled()
  })

  it('asks for a code when the field is empty', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CodeGate onVerified={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByText('Please enter the class code.')).toBeInTheDocument()
  })
})
