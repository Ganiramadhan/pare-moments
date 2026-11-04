import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { imageSources } from '@/shared/lib/images'
import { moments } from '../data/moments'
import { Hero } from './Hero'

describe('Hero', () => {
  it('puts the first day in front of the other photos in the stack', () => {
    const { container } = render(
      <MemoryRouter>
        <Hero moments={moments} />
      </MemoryRouter>,
    )

    const frames = Array.from(container.querySelectorAll('img[alt=""]')).map((img) =>
      img.closest('div.absolute'),
    )
    const [first, ...others] = frames
    expect(first?.querySelector('img')).toHaveAttribute(
      'src',
      imageSources(moments[0]!.photos[0]!).src,
    )
    expect(first).toHaveClass('z-20')
    others.forEach((frame) => expect(frame).not.toHaveClass('z-20'))
  })
})
