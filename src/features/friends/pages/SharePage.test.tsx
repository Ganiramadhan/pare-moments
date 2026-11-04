import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter, setUploads } from '@/test/test-utils'
import { friendsApi } from '../api/friends-api'
import { SharePage } from './SharePage'

vi.mock('@/shared/lib/image-compress', () => ({
  compressImage: vi.fn(async () => new File(['y'], 'p.webp', { type: 'image/webp' })),
}))

const open = () => renderWithRouter(<SharePage />, '/share', '/share')

const unlock = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Class code'), 'PARE2026')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('SharePage', () => {
  beforeEach(() => setUploads(true))

  it('asks for the class code before showing the form', () => {
    open()

    expect(screen.getByRole('heading', { name: 'Enter the class code' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Your name')).not.toBeInTheDocument()
  })

  it('shows which step you are on', async () => {
    const user = userEvent.setup()
    open()
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveAccessibleName(
      'Step 1: Class code',
    )

    await unlock(user)

    expect(await screen.findByRole('listitem', { current: 'step' })).toHaveAccessibleName(
      'Step 2: Your moment',
    )
  })

  it('remembers the code for this tab', async () => {
    const user = userEvent.setup()
    const { unmount } = open()
    await unlock(user)
    expect(await screen.findByLabelText('Your name')).toBeInTheDocument()
    unmount()

    open()
    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
  })

  it('asks for a name, a caption and a photo before sharing', async () => {
    const user = userEvent.setup()
    open()
    await unlock(user)

    await user.click(await screen.findByRole('button', { name: 'Share moment' }))

    expect(screen.getByText('Please tell us your name.')).toBeInTheDocument()
    expect(screen.getByText('Please write a short caption.')).toBeInTheDocument()
    expect(screen.getByText('Add at least one photo.')).toBeInTheDocument()
    expect(await friendsApi.listFriendMoments()).toHaveLength(0)
  })

  it('shares a moment and says thank you', async () => {
    const user = userEvent.setup()
    open()
    await unlock(user)

    await user.upload(
      await screen.findByTestId('photo-input'),
      new File(['x'], 'camp.jpg', { type: 'image/jpeg' }),
    )
    await user.type(screen.getByLabelText('Your name'), 'Ayu')
    await user.type(screen.getByLabelText('Caption'), 'Study time with friends')
    const share = screen.getByRole('button', { name: 'Share moment' })
    await waitFor(() => expect(share).toBeEnabled())
    await user.click(share)

    expect(await screen.findByRole('heading', { name: 'Thank you, Ayu!' })).toBeInTheDocument()
    const saved = await friendsApi.listFriendMoments()
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({ name: 'Ayu', caption: 'Study time with friends' })

    await user.click(screen.getByRole('button', { name: 'Share another' }))
    expect(screen.getByLabelText('Your name')).toHaveValue('')
  })
})
