import { useSyncExternalStore } from 'react'
import {
  clearPlayer,
  loadPlayerName,
  savePlayerName,
  skipPlayerName,
  subscribePlayer,
  wasNameSkipped,
} from '../utils/player'

// The visitor's name, shared by everything on the screen (the prompt, the greeting, the result).
export function usePlayer() {
  // One text holds both facts, so React sees a change when either one changes.
  const snapshot = useSyncExternalStore(
    subscribePlayer,
    () => `${wasNameSkipped() ? 1 : 0}|${loadPlayerName()}`,
    () => '0|',
  )
  const separator = snapshot.indexOf('|')

  return {
    name: snapshot.slice(separator + 1),
    skipped: snapshot.slice(0, separator) === '1',
    save: savePlayerName,
    skip: skipPlayerName,
    change: clearPlayer,
  }
}
