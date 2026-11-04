import { createPortal } from 'react-dom'

// A few fireworks that burst over the page for a happy moment. Purely decorative.
// Every class is written out in full, so nothing random happens while rendering.
const bursts = [
  'left-[20%] top-[26%] [animation-delay:0.1s]',
  'left-[78%] top-[20%] [animation-delay:0.5s]',
  'left-[50%] top-[38%] [animation-delay:0.9s]',
  'left-[30%] top-[55%] [animation-delay:1.3s]',
  'left-[70%] top-[52%] [animation-delay:1.7s]',
]

const angles = [
  'rotate-0 bg-primary',
  'rotate-30 bg-secondary',
  'rotate-60 bg-primary-deep',
  'rotate-90 bg-secondary-deep',
  'rotate-120 bg-primary',
  'rotate-150 bg-secondary',
  'rotate-180 bg-primary-deep',
  'rotate-210 bg-secondary-deep',
  'rotate-240 bg-primary',
  'rotate-270 bg-secondary',
  'rotate-300 bg-primary-deep',
  'rotate-330 bg-secondary-deep',
]

export function Fireworks() {
  // Attached to <body> so no wrapper's transform can pull it out of the screen.
  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden motion-reduce:hidden"
    >
      {bursts.map((burst) =>
        angles.map((angle) => (
          <span
            key={`${burst}-${angle}`}
            className={`absolute h-4 w-1.5 animate-firework rounded-full ${burst} ${angle}`}
          />
        )),
      )}
    </div>,
    document.body,
  )
}
