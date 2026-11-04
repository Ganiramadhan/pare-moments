import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { PhotoPicker } from './PhotoPicker'

const image = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
const text = new File(['x'], 'a.txt', { type: 'text/plain' })

const setup = () => {
  const onAdd = vi.fn()
  render(<PhotoPicker items={[]} onAdd={onAdd} onRetry={vi.fn()} onRemove={vi.fn()} />)
  return onAdd
}

describe('PhotoPicker', () => {
  it('accepts photos dropped on the picker', () => {
    const onAdd = setup()

    fireEvent.drop(screen.getByRole('button', { name: /add photos/i }), {
      dataTransfer: { files: [image] },
    })

    expect(onAdd).toHaveBeenCalledWith([image])
  })

  it('ignores files that are not images', () => {
    const onAdd = setup()

    fireEvent.drop(screen.getByRole('button', { name: /add photos/i }), {
      dataTransfer: { files: [text, image] },
    })

    expect(onAdd).toHaveBeenCalledWith([image])
  })
})
