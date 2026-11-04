import { render, screen } from '@testing-library/react'
import { Steps } from './Steps'

describe('Steps', () => {
  it('marks the current step', () => {
    render(<Steps current={2} />)

    expect(screen.getByRole('listitem', { current: 'step' })).toHaveAccessibleName(
      'Step 2: Your moment',
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
