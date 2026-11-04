import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { FriendsPage } from '../pages/FriendsPage'
import { SharePage } from '../pages/SharePage'
import { ComingSoon } from './ComingSoon'

describe('ComingSoon (uploads are closed)', () => {
  it('warns clearly that the feature is under development', () => {
    renderWithRouter(<ComingSoon page="share" />)

    expect(screen.getByRole('status')).toHaveTextContent('Under development')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sharing is coming soon' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/still building this part/i)).toBeInTheDocument()
  })

  it('lists what is coming and offers somewhere else to go', () => {
    renderWithRouter(<ComingSoon page="wall" />)

    expect(screen.getByRole('heading', { name: "What's coming" })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('link', { name: /back to the moments/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /open the gallery/i })).toHaveAttribute(
      'href',
      '/gallery',
    )
  })

  it('keeps search engines away from the closed page', () => {
    renderWithRouter(<ComingSoon page="share" />)

    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    )
  })

  it('replaces the Share page: no class code, no form', () => {
    renderWithRouter(<SharePage />)

    expect(screen.getByRole('heading', { name: 'Sharing is coming soon' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Class code')).not.toBeInTheDocument()
    expect(screen.queryByTestId('photo-input')).not.toBeInTheDocument()
  })

  it("replaces the Friends' wall", () => {
    renderWithRouter(<FriendsPage />)

    expect(
      screen.getByRole('heading', { name: "The Friends' wall is coming soon" }),
    ).toBeInTheDocument()
    expect(screen.queryByText("No friends' moments yet.")).not.toBeInTheDocument()
  })
})
