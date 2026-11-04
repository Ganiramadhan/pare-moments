import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('says the page is missing, offers a way home and keeps search engines away', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Lost in Pare?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to the moments/i })).toHaveAttribute('href', '/')
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    )
  })
})
