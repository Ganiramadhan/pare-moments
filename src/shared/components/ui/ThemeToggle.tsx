import { LuMoon, LuSun } from 'react-icons/lu'
import { useTheme } from '@/shared/hooks/useTheme'
import { cn } from '@/shared/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex size-11 items-center justify-center rounded-full text-xl text-muted transition hover:bg-primary-soft hover:text-primary',
        className,
      )}
    >
      {isDark ? <LuSun aria-hidden /> : <LuMoon aria-hidden />}
    </button>
  )
}
