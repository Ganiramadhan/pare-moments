import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/test-utils'
import { moments } from '../data/moments'
import { MomentDetailPage } from './MomentDetailPage'

const open = (id: string) =>
  renderWithRouter(<MomentDetailPage />, `/moments/${id}`, '/moments/:momentId')

describe('MomentDetailPage', () => {
  it('shows the moment with its photos and helpful alt text', () => {
    const moment = moments[0]!
    open(moment.id)

    expect(screen.getByRole('heading', { name: moment.title })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(moment.photos.length)
    expect(
      screen.getByRole('img', { name: `${moment.title}, photo 1 of ${moment.photos.length}` }),
    ).toBeInTheDocument()
  })

  it('can start the slideshow from this moment', () => {
    open(moments[1]!.id)

    expect(screen.getByRole('link', { name: /play from here/i })).toHaveAttribute(
      'href',
      `/slideshow?moment=${moments[1]!.id}`,
    )
  })

  it('says so and offers a way back when the moment does not exist', () => {
    open('nope')

    expect(screen.getByRole('alert')).toHaveTextContent("We couldn't find this moment.")
    expect(screen.getByRole('link', { name: /all moments/i })).toHaveAttribute('href', '/')
  })

  it('links to the previous and next moment', () => {
    open(moments[1]!.id)

    expect(screen.getByRole('link', { name: /previous/i })).toHaveAttribute(
      'href',
      `/moments/${moments[0]!.id}`,
    )
    expect(screen.getByRole('link', { name: /next/i })).toHaveAttribute(
      'href',
      `/moments/${moments[2]!.id}`,
    )
  })

  it('has no previous link on the first moment', () => {
    open(moments[0]!.id)

    expect(screen.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument()
  })

  it('opens a photo in the viewer', async () => {
    const user = userEvent.setup()
    open(moments[0]!.id)

    await user.click(screen.getByRole('button', { name: 'Open photo 1' }))

    expect(screen.getByRole('dialog', { name: 'Photo viewer' })).toBeInTheDocument()
  })
})
