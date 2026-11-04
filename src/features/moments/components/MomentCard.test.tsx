import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import type { Moment } from '../types/moment'
import { MomentCard } from './MomentCard'

const base: Moment = { id: 'm', title: 'Story time', date: '2026-10-21', caption: 'Hi', photos: [] }

const renderCard = (photos: string[]) =>
  render(
    <MemoryRouter>
      <MomentCard moment={{ ...base, photos }} />
    </MemoryRouter>,
  )

describe('MomentCard', () => {
  it('uses the first photo as the cover even when a video comes first', () => {
    renderCard(['/clip.mp4', '/b.jpeg'])

    expect(screen.getByRole('img')).toHaveAttribute('src', '/b.jpeg')
    expect(screen.getByText('1 photo · 1 video')).toBeInTheDocument()
  })

  it('shows a video frame when the moment is only a video', () => {
    const { container } = renderCard(['/clip.mp4'])

    expect(container.querySelector('video')).toHaveAttribute('src', '/clip.mp4#t=0.1')
    expect(screen.getByText('1 video')).toBeInTheDocument()
  })

  it('counts several photos', () => {
    renderCard(['/a.jpeg', '/b.jpeg', '/c.jpeg'])

    expect(screen.getByText('3 photos')).toBeInTheDocument()
  })
})
