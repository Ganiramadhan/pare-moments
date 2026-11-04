import { act, renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { compressImage } from '@/shared/lib/image-compress'
import { usePhotoQueue } from './usePhotoQueue'

vi.mock('@/shared/lib/image-compress', () => ({ compressImage: vi.fn() }))

const file = (name = 'a.jpg') => new File(['x'], name, { type: 'image/jpeg' })
const compressed = new File(['y'], 'a.webp', { type: 'image/webp' })

describe('usePhotoQueue', () => {
  beforeEach(() => vi.mocked(compressImage).mockReset())

  it('compresses each photo that is added', async () => {
    vi.mocked(compressImage).mockResolvedValue(compressed)
    const { result } = renderHook(() => usePhotoQueue(5))

    act(() => result.current.add([file()]))

    await waitFor(() => expect(result.current.items[0]?.status).toBe('done'))
    expect(result.current.items[0]?.compressed).toBe(compressed)
  })

  it('stops at the maximum number of photos', () => {
    vi.mocked(compressImage).mockResolvedValue(compressed)
    const { result } = renderHook(() => usePhotoQueue(2))

    act(() => result.current.add([file('1'), file('2'), file('3')]))

    expect(result.current.items).toHaveLength(2)
  })

  it('lets a failed photo be retried', async () => {
    vi.mocked(compressImage).mockRejectedValueOnce(new Error('boom')).mockResolvedValue(compressed)
    const { result } = renderHook(() => usePhotoQueue(5))

    act(() => result.current.add([file()]))
    await waitFor(() => expect(result.current.items[0]?.status).toBe('error'))

    act(() => result.current.retry(result.current.items[0]!.id))
    await waitFor(() => expect(result.current.items[0]?.status).toBe('done'))
  })

  it('removes a photo', () => {
    vi.mocked(compressImage).mockResolvedValue(compressed)
    const { result } = renderHook(() => usePhotoQueue(5))
    act(() => result.current.add([file()]))

    act(() => result.current.remove(result.current.items[0]!.id))

    expect(result.current.items).toHaveLength(0)
  })
})
