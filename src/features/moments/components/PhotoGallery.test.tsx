import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import type { Moment } from '../types/moment'
import { PhotoGallery } from './PhotoGallery'

const moment: Moment = {
  id: 'm',
  title: 'Story time',
  date: '2026-10-21',
  caption: '',
  photos: ['/a.jpeg', '/clip.mp4', '/c.jpeg'],
}

describe('PhotoGallery', () => {
  it('plays a video in place, with controls', () => {
    const { container } = render(<PhotoGallery moment={moment} />)

    const video = container.querySelector('video')!
    expect(video).toHaveAttribute('src', '/clip.mp4')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAccessibleName('Story time, video')
  })

  it('opens only the photos in the viewer, skipping the video', async () => {
    const user = userEvent.setup()
    render(<PhotoGallery moment={moment} />)

    await user.click(screen.getByRole('button', { name: 'Open photo 3' }))

    const dialog = screen.getByRole('dialog', { name: 'Photo viewer' })
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    expect(dialog.querySelector('img')).toHaveAttribute('alt', 'Story time, photo 3 of 3')
  })
})
