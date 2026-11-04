import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Lightbox } from './Lightbox'

const images = [
  { src: '/1.jpg', alt: 'First' },
  { src: '/2.jpg', alt: 'Second' },
]

function Harness({ start }: { start: number | null }) {
  const [index, setIndex] = useState<number | null>(start)
  return (
    <Lightbox
      images={images}
      index={index}
      onIndexChange={setIndex}
      onClose={() => setIndex(null)}
    />
  )
}

describe('Lightbox', () => {
  it('shows nothing while closed', () => {
    render(<Harness start={null} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('moves between photos with buttons and wraps around', async () => {
    const user = userEvent.setup()
    render(<Harness start={0} />)

    expect(screen.getByRole('img', { name: 'First' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByRole('img', { name: 'Second' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByRole('img', { name: 'First' })).toBeInTheDocument()
  })

  it('moves with the arrow keys and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Harness start={0} />)

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('img', { name: 'Second' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes with the close button', async () => {
    const user = userEvent.setup()
    render(<Harness start={1} />)

    await user.click(screen.getByRole('button', { name: 'Close photo' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers the open photo as a download', () => {
    render(<Harness start={1} />)

    expect(screen.getByRole('link', { name: 'Download photo' })).toHaveAttribute('href', '/2.jpg')
    expect(screen.getByRole('link', { name: 'Download photo' })).toHaveAttribute('download')
  })

  it('is attached to the page body, so nothing around it can push it off-center', () => {
    const { container } = render(<Harness start={0} />)

    const dialog = screen.getByRole('dialog', { name: 'Photo viewer' })
    expect(dialog.parentElement).toBe(document.body)
    expect(container).not.toContainElement(dialog)
  })

  it('zooms in and out with the zoom button', async () => {
    const user = userEvent.setup()
    render(<Harness start={0} />)
    const photo = () => screen.getByRole('img', { name: 'First' })

    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(photo().style.transform).toContain('scale(2.5)')

    await user.click(screen.getByRole('button', { name: 'Zoom out' }))
    expect(photo().style.transform).toBe('')
  })

  it('zooms with a double click on the photo', async () => {
    const user = userEvent.setup()
    render(<Harness start={0} />)

    await user.dblClick(screen.getByRole('img', { name: 'First' }))

    expect(screen.getByRole('img', { name: 'First' }).style.transform).toContain('scale(2.5)')
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
  })

  it('starts the next photo fully zoomed out', async () => {
    const user = userEvent.setup()
    render(<Harness start={0} />)
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))

    await user.click(screen.getByRole('button', { name: 'Next photo' }))

    expect(screen.getByRole('img', { name: 'Second' }).style.transform).toBe('')
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
  })
})
