import { useCallback, useState } from 'react'
import { applyResult, dayKey, loadProgress, saveProgress, type Progress } from '../utils/progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  // Remembers a finished round, and returns the new progress.
  const record = useCallback((key: string, percent: number) => {
    setProgress((current) => {
      const next = applyResult(current, key, percent, dayKey())
      saveProgress(next)
      return next
    })
  }, [])

  return { progress, record }
}
