import type { IconType } from 'react-icons'
import { useCountUp } from '@/shared/hooks/useCountUp'

type StatProps = {
  icon: IconType
  value: number
  label: string
}

export function Stat({ icon: Icon, value, label }: StatProps) {
  const shown = useCountUp(value)

  return (
    <div className="flex min-w-24 flex-col items-center gap-0.5 rounded-3xl bg-white/15 px-4 py-3">
      <Icon aria-hidden className="text-xl opacity-90" />
      <span aria-hidden className="font-display text-3xl leading-none font-bold">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
      <span className="text-xs font-bold tracking-wide uppercase opacity-80">{label}</span>
    </div>
  )
}
