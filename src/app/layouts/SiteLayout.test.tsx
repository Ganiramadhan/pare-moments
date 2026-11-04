import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { setUploads } from '@/test/test-utils'
import { MemoryRouter } from 'react-router'
import { SiteLayout } from './SiteLayout'

const renderLayout = () =>
  render(
    <MemoryRouter>
      <SiteLayout />
    </MemoryRouter>,
  )

const hrefs = (nav: HTMLElement) =>
  within(nav)
    .getAllByRole('link')
    .map((a) => a.getAttribute('href'))

describe('SiteLayout', () => {
  it('links to every page from the top navigation, with Share as the main action', () => {
    setUploads(true)
    renderLayout()

    expect(hrefs(screen.getByRole('navigation', { name: 'Main' }))).toEqual([
      '/',
      '/gallery',
      '/practice',
      '/friends',
      '/slideshow',
    ])
    const banner = screen.getByRole('banner')
    expect(within(banner).getByRole('link', { name: 'Share' })).toHaveAttribute('href', '/share')
  })

  it('has a phone dock with the same pages and a Share button in the middle', () => {
    setUploads(true)
    renderLayout()

    expect(hrefs(screen.getByRole('navigation', { name: 'Main mobile' }))).toEqual([
      '/',
      '/gallery',
      '/share',
      '/practice',
      '/friends',
      '/slideshow',
    ])
  })

  it('switches between light and dark mode', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('starts each page at the top', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    renderLayout()

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('lets keyboard users skip the navigation', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('link', { name: 'Skip to content' }))

    expect(document.getElementById('content')).toHaveFocus()
  })

  describe('while friends uploads are closed', () => {
    it('has no Share button, and tags the Friends page as coming soon', () => {
      renderLayout()

      const banner = screen.getByRole('banner')
      expect(within(banner).queryByRole('link', { name: 'Share' })).not.toBeInTheDocument()
      const nav = screen.getByRole('navigation', { name: 'Main' })
      expect(within(nav).getByRole('link', { name: /friends/i })).toHaveTextContent('Soon')
    })

    it('has a phone dock with every page and no Share button', () => {
      renderLayout()

      expect(hrefs(screen.getByRole('navigation', { name: 'Main mobile' }))).toEqual([
        '/',
        '/gallery',
        '/practice',
        '/friends',
        '/slideshow',
      ])
    })
  })

  it('has a footer with links to the pages', () => {
    renderLayout()

    expect(hrefs(screen.getByRole('navigation', { name: 'Footer' }))).toEqual([
      '/',
      '/gallery',
      '/practice',
      '/friends',
      '/slideshow',
    ])
  })
})
