import type { ReactNode } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { Link } from 'react-router'
import { practiceCopy } from '../constants'

type PracticeHeaderProps = {
  title: string
  text?: string
  // Shown at the right of the title, e.g. a switch between modes.
  children?: ReactNode
  // Where "back" goes. Defaults to the practice home.
  backTo?: { to: string; label: string }
}

export function PracticeHeader({ title, text, children, backTo }: PracticeHeaderProps) {
  const back = backTo ?? { to: '/practice', label: practiceCopy.back }

  return (
    <header className="flex flex-col gap-4">
      <Link
        to={back.to}
        className="inline-flex min-h-11 w-fit items-center gap-2 font-bold text-primary hover:underline"
      >
        <LuArrowLeft aria-hidden />
        {back.label}
      </Link>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          {text ? <p className="max-w-xl text-lg text-muted">{text}</p> : null}
        </div>
        {children}
      </div>
    </header>
  )
}
