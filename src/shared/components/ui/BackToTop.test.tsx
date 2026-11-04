import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BackToTop } from './BackToTop'

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  act(() => {
    fireEvent.scroll(window)
  })
}

describe('BackToTop', () => {
  afterEach(() => scrollTo(0))

  it('stays hidden near the top and appears after scrolling down', () => {
    render(<BackToTop />)
    expect(screen.queryByRole('button', { name: 'Back to top' })).not.toBeInTheDocument()

    scrollTo(900)

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument()
  })

  it('scrolls smoothly to the top', async () => {
    const user = userEvent.setup()
    const spy = vi.spyOn(window, 'scrollTo')
    render(<BackToTop />)
    scrollTo(900)

    await user.click(screen.getByRole('button', { name: 'Back to top' }))

    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
