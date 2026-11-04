import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

describe('Reveal', () => {
  it('leaves no translate behind once shown, so fixed children stay tied to the screen', () => {
    // jsdom has no IntersectionObserver, so content is shown right away.
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    )

    const box = screen.getByText('Hello').parentElement!
    expect(box).toHaveClass('translate-none', 'opacity-100')
    expect(box).not.toHaveClass('translate-y-0')
  })
})
