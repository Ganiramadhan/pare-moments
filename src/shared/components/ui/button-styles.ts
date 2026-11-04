import { cn } from '@/shared/lib/utils'

type ButtonStyleOptions = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
}

// Chunky "pressable" pill: a darker bottom edge that squashes when pressed.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full border-b-4 font-bold transition active:translate-y-0.5 active:border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'border-primary-deep bg-primary text-on-primary hover:brightness-110',
  secondary: 'border-secondary-deep bg-secondary text-on-secondary hover:brightness-105',
  ghost: 'border-line bg-surface text-fg ring-1 ring-line hover:bg-primary-soft',
}

const sizes = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-13 px-7 text-base',
}

// Used on <Link> and <button> alike, so buttons look the same everywhere.
export const buttonStyles = ({ variant = 'primary', size = 'md' }: ButtonStyleOptions = {}) =>
  cn(base, variants[variant], sizes[size])
