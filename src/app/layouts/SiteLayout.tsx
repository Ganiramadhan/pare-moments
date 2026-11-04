import { useEffect, useRef } from 'react'
import type { IconType } from 'react-icons'
import { LuBrain, LuCamera, LuHouse, LuLayoutGrid, LuPlay, LuPlus, LuUsers } from 'react-icons/lu'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { BackToTop } from '@/shared/components/ui/BackToTop'
import { ScrollProgress } from '@/shared/components/ui/ScrollProgress'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { site } from '@/shared/config/site'
import { cn } from '@/shared/lib/utils'

type NavItem = {
  to: string
  label: string
  icon: IconType
  end?: boolean
  // A page that is not open yet gets a small "Soon" tag.
  soon?: boolean
}

// The Friends' wall only opens when uploads are open.
const getNavItems = (uploads: boolean): NavItem[] => [
  { to: '/', label: 'Moments', icon: LuHouse, end: true },
  { to: '/gallery', label: 'Gallery', icon: LuLayoutGrid },
  { to: '/practice', label: 'Practice', icon: LuBrain },
  { to: '/friends', label: 'Friends', icon: LuUsers, soon: !uploads },
  { to: '/slideshow', label: 'Slideshow', icon: LuPlay },
]

function SoonTag() {
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] leading-none font-extrabold tracking-wide text-on-secondary uppercase">
      Soon
    </span>
  )
}

const dockLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex min-h-16 min-w-12 flex-col items-center justify-center gap-0.5 text-[11px] font-bold',
    isActive ? 'text-primary' : 'text-muted',
  )

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight"
    >
      <span
        aria-hidden
        className="flex size-10 -rotate-6 items-center justify-center rounded-2xl bg-secondary text-xl text-on-secondary shadow-sm"
      >
        <LuCamera />
      </span>
      Pare Moments
    </Link>
  )
}

function DockItem({ to, label, icon: Icon, end, soon }: NavItem) {
  return (
    <li>
      <NavLink to={to} end={end} className={dockLinkClass}>
        <span className="relative">
          <Icon aria-hidden className="text-xl" />
          {soon ? (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-1.5 size-2.5 rounded-full bg-secondary ring-2 ring-surface"
            />
          ) : null}
        </span>
        {label}
        {soon ? <span className="sr-only"> (coming soon)</span> : null}
      </NavLink>
    </li>
  )
}

export function SiteLayout() {
  const { pathname, hash } = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const uploads = site.features.uploads
  const navItems = getNavItems(uploads)

  // A new page starts at the top (unless the link points to a place on the page).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="flex min-h-svh flex-col pb-28 sm:pb-0">
      {/* First stop for keyboards and screen readers: jump over the navigation. */}
      <a
        href="#content"
        onClick={(event) => {
          event.preventDefault()
          contentRef.current?.focus()
          contentRef.current?.scrollIntoView()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-bold focus:text-on-primary"
      >
        Skip to content
      </a>

      <ScrollProgress />

      <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 rounded-full bg-surface pr-2 pl-4 shadow-sm ring-1 ring-line sm:bg-surface/85 sm:backdrop-blur-lg">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
            {navItems.map(({ to, label, icon: Icon, end, soon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold transition lg:px-4',
                    isActive ? 'bg-primary-soft text-primary' : 'text-muted hover:text-fg',
                  )
                }
              >
                <Icon aria-hidden className="text-lg" />
                <span className="sr-only lg:not-sr-only">{label}</span>
                {soon ? (
                  <span className="hidden lg:inline">
                    <SoonTag />
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {uploads ? (
              <Link
                to="/share"
                className={cn(buttonStyles({ variant: 'secondary' }), 'hidden sm:inline-flex')}
              >
                <LuPlus aria-hidden className="text-lg" />
                Share
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {/* Each page fades in as you move around. */}
      <div
        id="content"
        ref={contentRef}
        tabIndex={-1}
        key={pathname}
        className="mx-auto w-full max-w-6xl flex-1 animate-page-in focus:outline-none px-4 py-8 motion-reduce:animate-none sm:px-6 sm:py-12"
      >
        <Outlet />
      </div>

      <footer className="flex flex-col items-center gap-4 border-t border-line px-4 py-10 text-center text-sm text-muted">
        <p className="font-display text-lg font-semibold text-fg">Pare Moments</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-bold">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>Made with love in Kampung Inggris, Pare</p>
      </footer>

      <BackToTop />

      {/* Phone dock. While uploads are open, the Share button sits in the middle, a little raised. */}
      <nav
        aria-label="Main mobile"
        className="fixed inset-x-4 bottom-4 z-30 rounded-full bg-surface shadow-xl ring-1 ring-line sm:hidden"
      >
        <ul className="flex items-center justify-around px-2">
          {uploads ? (
            <>
              {navItems.slice(0, 2).map((item) => (
                <DockItem key={item.to} {...item} />
              ))}
              <li>
                <Link
                  to="/share"
                  aria-label="Share"
                  className={cn(
                    buttonStyles({ variant: 'secondary' }),
                    '-mt-8 size-16 min-h-0 px-0 text-3xl shadow-lg',
                  )}
                >
                  <LuPlus aria-hidden />
                </Link>
              </li>
              {navItems.slice(2).map((item) => (
                <DockItem key={item.to} {...item} />
              ))}
            </>
          ) : (
            navItems.map((item) => <DockItem key={item.to} {...item} />)
          )}
        </ul>
      </nav>
    </div>
  )
}
