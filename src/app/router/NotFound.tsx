import { LuArrowLeft, LuCompass } from 'react-icons/lu'
import { Link } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'

// Shown for any address the website does not have. Search engines are told to skip it.
export function NotFound() {
  useSeo({ title: 'Page not found', path: '/404', noindex: true })

  return (
    <main className="flex flex-col items-center gap-5 py-16 text-center">
      <span className="flex size-20 rotate-6 items-center justify-center rounded-3xl bg-secondary text-4xl text-on-secondary shadow-md">
        <LuCompass aria-hidden />
      </span>
      <h1 className="font-display text-5xl font-bold tracking-tight">Lost in Pare?</h1>
      <p className="max-w-md text-lg text-muted">
        We couldn&apos;t find that page. Let&apos;s go back to the moments.
      </p>
      <Link to="/" className={buttonStyles({ size: 'lg' })}>
        <LuArrowLeft aria-hidden />
        Back to the moments
      </Link>
    </main>
  )
}
