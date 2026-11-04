import { useEffect, useState } from 'react'
import { LuCheck, LuShare2 } from 'react-icons/lu'
import { buttonStyles } from './button-styles'

type ShareButtonProps = {
  title: string
  text?: string
}

// Uses the phone's share sheet when there is one, otherwise copies the page link.
export function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, text, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      }
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={buttonStyles({ variant: 'ghost' })}
    >
      {copied ? <LuCheck aria-hidden /> : <LuShare2 aria-hidden />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}
