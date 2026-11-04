import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, setUploads } from '@/test/test-utils'
import { moments } from '../data/moments'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('lets you play the slideshow', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('link', { name: /play slideshow/i })).toHaveAttribute(
      'href',
      '/slideshow',
    )
  })

  it('shows every moment, oldest first, each linking to its page', () => {
    renderWithRouter(<HomePage />)

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(moments.length)
    expect(within(cards[0]!).getByRole('heading', { level: 3 })).toHaveTextContent(
      moments[0]!.title,
    )
    expect(within(cards[0]!).getByRole('link')).toHaveAttribute(
      'href',
      `/moments/${moments[0]!.id}`,
    )
  })

  it('can show only milestones', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)

    await user.click(screen.getByRole('button', { name: /milestones/i }))

    const expected = moments.filter((m) => m.milestone).length
    expect(screen.getAllByRole('article')).toHaveLength(expected)
    expect(screen.getByRole('button', { name: /milestones/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: /all moments/i }))
    expect(screen.getAllByRole('article')).toHaveLength(moments.length)
  })

  it('invites visitors to share their own moments when uploads are open', () => {
    setUploads(true)
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('link', { name: /share yours/i })).toHaveAttribute('href', '/share')
  })

  it('jumps to a random moment with "Surprise me"', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />, '/', '/')

    await user.click(screen.getByRole('button', { name: /surprise me/i }))

    expect(screen.getByText('elsewhere')).toBeInTheDocument()
  })

  it('counts the photos, days and moments in the hero', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByText('photos')).toBeInTheDocument()
    expect(screen.getByText('videos')).toBeInTheDocument()
    expect(screen.getByText('days')).toBeInTheDocument()
    expect(screen.getByText('moments')).toBeInTheDocument()
  })

  it('says sharing is coming soon while uploads are closed', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /share yours/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /what's coming/i })).toHaveAttribute('href', '/friends')
  })

  it('has the day-by-day chips and a way into English practice', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('navigation', { name: 'Jump to a day' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Practice your English' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open practice' })).toHaveAttribute('href', '/practice')
    expect(screen.getByRole('link', { name: /grammar/i })).toHaveAttribute(
      'href',
      '/practice/grammar',
    )
  })
})
