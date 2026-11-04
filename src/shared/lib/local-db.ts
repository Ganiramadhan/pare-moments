// A tiny key-value layer over IndexedDB, used while there is no backend.
// Photos are too big for localStorage, so uploads are kept here on the device.
const DB_NAME = 'pare-moments'
const DB_VERSION = 1

export type StoreName = 'friendMoments'

const open = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore('friendMoments', { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const run = async <T>(
  store: StoreName,
  mode: IDBTransactionMode,
  action: (s: IDBObjectStore) => IDBRequest<T>,
) => {
  const db = await open()
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(db.transaction(store, mode).objectStore(store))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } finally {
    db.close()
  }
}

export const dbGetAll = <T>(store: StoreName) =>
  run(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>)

export const dbPut = <T extends { id: string }>(store: StoreName, value: T) =>
  run(store, 'readwrite', (s) => s.put(value))
