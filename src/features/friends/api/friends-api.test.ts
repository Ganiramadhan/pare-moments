import { InvalidCodeError, friendsApi } from './friends-api'

const photo = () => new File(['x'], 'p.webp', { type: 'image/webp' })

describe('friendsApi (on-device version)', () => {
  it('accepts the class code in any case and rejects a wrong one', async () => {
    await expect(friendsApi.verifyCode(' pare2026 ')).resolves.toHaveProperty('token')
    await expect(friendsApi.verifyCode('nope')).rejects.toBeInstanceOf(InvalidCodeError)
  })

  it('lists the newest moment first', async () => {
    const { token } = await friendsApi.verifyCode('PARE2026')
    await friendsApi.createFriendMoment({ name: 'Ayu', caption: 'First', photos: [photo()] }, token)
    await friendsApi.createFriendMoment(
      { name: 'Budi', caption: 'Second', photos: [photo()] },
      token,
    )

    const list = await friendsApi.listFriendMoments()

    expect(list.map((m) => m.caption)).toEqual(['Second', 'First'])
    expect(list[0]?.photos[0]).toMatch(/^data:/)
  })

  it('refuses to save without a valid token', async () => {
    await expect(
      friendsApi.createFriendMoment({ name: 'X', caption: 'Y', photos: [photo()] }, 'bad'),
    ).rejects.toBeInstanceOf(InvalidCodeError)
    expect(await friendsApi.listFriendMoments()).toHaveLength(0)
  })
})
