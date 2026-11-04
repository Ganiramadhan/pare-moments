import { LuCheck, LuConstruction, LuHammer, LuLayoutGrid, LuArrowLeft } from 'react-icons/lu'
import { Link } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'
import { friendsCopy } from '../constants'

type ComingSoonProps = {
  // Which closed page this is.
  page: 'share' | 'wall'
}

// Shown instead of the Share page and the Friends' wall while uploads are closed. It says clearly
// that the feature is still being built, and keeps search engines away from the empty page.
export function ComingSoon({ page }: ComingSoonProps) {
  const copy = friendsCopy.comingSoon
  const title = page === 'share' ? copy.shareTitle : copy.wallTitle

  useSeo({
    title,
    path: page === 'share' ? '/share' : '/friends',
    noindex: true,
  })

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 py-8 text-center sm:py-14">
      <div className="flex flex-col items-center gap-5">
        <span className="flex size-24 -rotate-6 items-center justify-center rounded-[2rem] bg-secondary text-5xl text-on-secondary shadow-lg">
          <LuConstruction aria-hidden />
        </span>
        <p
          role="status"
          className="inline-flex items-center gap-2 rounded-full bg-secondary-soft px-4 py-2 text-sm font-extrabold text-secondary-deep ring-1 ring-secondary dark:text-secondary"
        >
          <LuHammer aria-hidden />
          {copy.badge}
        </p>
        <h1 className="font-display text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">{copy.body}</p>
      </div>

      <section
        aria-labelledby="coming-title"
        className="w-full rounded-[2rem] bg-surface p-6 text-left shadow-sm ring-1 ring-line sm:p-8"
      >
        <h2 id="coming-title" className="font-display text-2xl font-bold">
          {copy.listTitle}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {copy.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm text-primary">
                <LuCheck aria-hidden />
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonStyles({ size: 'lg' })}>
          <LuArrowLeft aria-hidden />
          {copy.home}
        </Link>
        <Link to="/gallery" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
          <LuLayoutGrid aria-hidden />
          {copy.gallery}
        </Link>
      </div>
    </main>
  )
}
