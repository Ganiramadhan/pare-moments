import { createPortal } from 'react-dom'

// A short burst of falling confetti for happy moments. Purely decorative.
// Each piece is a fixed set of classes, so nothing random happens while rendering.
const pieces = [
  'left-[5%] bg-primary [animation-delay:0s] [animation-duration:2.4s]',
  'left-[12%] bg-secondary [animation-delay:0.3s] [animation-duration:2.8s] rounded-full',
  'left-[19%] bg-primary-deep [animation-delay:0.1s] [animation-duration:2.6s]',
  'left-[26%] bg-secondary-deep [animation-delay:0.5s] [animation-duration:2.3s] rounded-full',
  'left-[33%] bg-secondary [animation-delay:0.2s] [animation-duration:3s]',
  'left-[40%] bg-primary [animation-delay:0.6s] [animation-duration:2.5s] rounded-full',
  'left-[47%] bg-primary-deep [animation-delay:0.05s] [animation-duration:2.7s]',
  'left-[54%] bg-secondary [animation-delay:0.4s] [animation-duration:2.4s] rounded-full',
  'left-[61%] bg-primary [animation-delay:0.15s] [animation-duration:3s]',
  'left-[68%] bg-secondary-deep [animation-delay:0.55s] [animation-duration:2.6s]',
  'left-[75%] bg-primary [animation-delay:0.25s] [animation-duration:2.9s] rounded-full',
  'left-[82%] bg-secondary [animation-delay:0.1s] [animation-duration:2.5s]',
  'left-[89%] bg-primary-deep [animation-delay:0.45s] [animation-duration:2.7s] rounded-full',
  'left-[95%] bg-secondary [animation-delay:0.35s] [animation-duration:2.4s]',
]

export function Confetti() {
  // Attached to <body> so no wrapper's transform can pull it out of the screen.
  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden motion-reduce:hidden"
    >
      {pieces.map((classes) => (
        <span
          key={classes}
          className={`absolute top-0 h-4 w-2.5 animate-confetti rounded-sm opacity-0 ${classes}`}
        />
      ))}
    </div>,
    document.body,
  )
}
