import { screen } from '@testing-library/react'
import { renderWithRouter, setUploads } from '@/test/test-utils'
import { friendsApi } from '../api/friends-api'
import { FriendsPage } from './FriendsPage'

describe('FriendsPage', () => {
  beforeEach(() => setUploads(true))

  it('invites you to share when the wall is empty', async () => {
    renderWithRouter(<FriendsPage />)

    expect(await screen.findByText("No friends' moments yet.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /share yours/i })).toHaveAttribute('href', '/share')
  })

  it("shows friends' moments with the name and caption", async () => {
    const { token } = await friendsApi.verifyCode('PARE2026')
    await friendsApi.createFriendMoment(
      { name: 'Budi', caption: 'Lunch after class', photos: [new File(['x'], 'p.webp')] },
      token,
    )

    renderWithRouter(<FriendsPage />)

    expect(await screen.findByText('Lunch after class')).toBeInTheDocument()
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Photo 1 of 1 shared by Budi' })).toBeInTheDocument()
  })
})
