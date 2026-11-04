import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { isVideoSource } from '@/shared/lib/media'
import { renderWithRouter } from '@/test/test-utils'
import { moments } from '../data/moments'
import { GalleryPage } from './GalleryPage'

const all = moments.flatMap((m) => m.photos)
const photoCount = all.filter((src) => !isVideoSource(src)).length
const videoCount = all.length - photoCount

const open = (route = '/gallery') => renderWithRouter(<GalleryPage />, route, '/gallery')

describe('GalleryPage', () => {
  it('shows every photo and video of the story', () => {
    open()

    expect(screen.getAllByRole('listitem')).toHaveLength(all.length)
    expect(screen.getByRole('button', { name: /everything/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('can show only photos or only videos', async () => {
    const user = userEvent.setup()
    open()

    await user.click(screen.getByRole('button', { name: 'Videos' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(videoCount)

    await user.click(screen.getByRole('button', { name: 'Photos' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(photoCount)
  })

  it('starts on the filter named in the link', () => {
    open('/gallery?type=videos')

    expect(screen.getAllByRole('listitem')).toHaveLength(videoCount)
    expect(screen.getByRole('button', { name: 'Videos' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens a photo in the viewer, which also offers a download', async () => {
    const user = userEvent.setup()
    open('/gallery?type=photos')

    await user.click(screen.getAllByRole('button', { name: /photo \d+ of \d+/i })[0]!)

    const dialog = screen.getByRole('dialog', { name: 'Photo viewer' })
    expect(within(dialog).getByRole('link', { name: 'Download photo' })).toHaveAttribute('download')
    expect(screen.getByText(`1 / ${photoCount}`)).toBeInTheDocument()
  })

  it('sends a video to its moment instead of the viewer', () => {
    open('/gallery?type=videos')

    const video = moments.find((m) => m.photos.some(isVideoSource))!
    expect(screen.getByRole('link', { name: `Open ${video.title}` })).toHaveAttribute(
      'href',
      `/moments/${video.id}`,
    )
  })
})
