import { dbGetAll, dbPut } from '@/shared/lib/local-db'
import type { FriendMoment, NewFriendMoment } from '../types/friend-moment'

/**
 * The only place that knows where friends' moments live.
 *
 * Right now everything is kept on this device (IndexedDB), so uploads are NOT shared between
 * people yet. To connect a real backend, replace the bodies below and keep the signatures:
 *
 *   verifyCode(code)              POST /class-code/verify   { code }          -> { token }
 *   listFriendMoments()           GET  /friend-moments                        -> FriendMoment[] (newest first)
 *   createFriendMoment(m, token)  POST /friend-moments      multipart: name, caption, photos[]
 *                                 with header "Authorization: Bearer <token>" -> FriendMoment
 *
 * The backend must do the real checking (class code, file type and size, rate limits). The
 * class-code screen in the app is only a doorway, never the lock.
 */

// Development-only code for the on-device version. The real code belongs to the backend.
const LOCAL_CLASS_CODE = 'PARE2026'

export class InvalidCodeError extends Error {
  constructor() {
    super('Invalid class code')
    this.name = 'InvalidCodeError'
  }
}

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export const friendsApi = {
  async verifyCode(code: string) {
    if (code.trim().toUpperCase() !== LOCAL_CLASS_CODE) throw new InvalidCodeError()
    return { token: LOCAL_CLASS_CODE }
  },

  async listFriendMoments() {
    const all = await dbGetAll<FriendMoment>('friendMoments')
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async createFriendMoment(input: NewFriendMoment, token: string) {
    if (token !== LOCAL_CLASS_CODE) throw new InvalidCodeError()

    const moment: FriendMoment = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      caption: input.caption.trim(),
      photos: await Promise.all(input.photos.map(readAsDataUrl)),
      createdAt: new Date().toISOString(),
    }
    await dbPut('friendMoments', moment)
    return moment
  },
}
