// The visitor's name, kept only on this device. There are no accounts: it is used to cheer them on.
const NAME_KEY = 'pare-moments:player-name'
const SKIPPED_KEY = 'pare-moments:player-skipped'

export const MAX_PLAYER_NAME = 30

const listeners = new Set<() => void>()

export const loadPlayerName = (): string => {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

// "Skip for now" lasts for this visit only, so the name is suggested again next time.
export const wasNameSkipped = (): boolean => {
  try {
    return sessionStorage.getItem(SKIPPED_KEY) === '1'
  } catch {
    return false
  }
}

const notify = () => listeners.forEach((listener) => listener())

export const savePlayerName = (name: string) => {
  const clean = name.trim().slice(0, MAX_PLAYER_NAME)
  try {
    if (clean) localStorage.setItem(NAME_KEY, clean)
    else localStorage.removeItem(NAME_KEY)
  } catch {
    // Without storage the name is not remembered.
  }
  notify()
}

export const skipPlayerName = () => {
  try {
    sessionStorage.setItem(SKIPPED_KEY, '1')
  } catch {
    // The suggestion will come back; that is fine.
  }
  notify()
}

// Forgets the name and the "skip", so the name is asked again at the next test.
export const clearPlayer = () => {
  try {
    localStorage.removeItem(NAME_KEY)
    sessionStorage.removeItem(SKIPPED_KEY)
  } catch {
    // Nothing to clear.
  }
  notify()
}

export const subscribePlayer = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
