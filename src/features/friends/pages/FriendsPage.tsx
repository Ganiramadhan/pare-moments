import { LuCamera, LuPlus } from 'react-icons/lu'
import { Link } from 'react-router'
import { useSeo } from '@/shared/hooks/useSeo'
import { Reveal } from '@/shared/components/ui/Reveal'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { site } from '@/shared/config/site'
import { ComingSoon } from '../components/ComingSoon'
import { useFriendMoments } from '../api/get-friend-moments'
import { FriendMomentCard } from '../components/FriendMomentCard'
import { friendsCopy } from '../constants'

function FriendsWall() {
  useSeo({
    title: "Friends' wall",
    description: 'Photos and memories shared by friends from Kampung Inggris, Pare.',
    path: '/friends',
  })
  const { data: moments, isPending, isError } = useFriendMoments()

  return (
    <main className="flex flex-col gap-10">
      <header className="relative overflow-hidden rounded-[2.5rem] bg-secondary-soft p-8 sm:p-12">
        <span
          aria-hidden
          className="absolute -top-10 -right-10 size-48 rounded-full bg-secondary"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {friendsCopy.wallTitle}
            </h1>
            <p className="max-w-lg text-lg text-muted">{friendsCopy.wallBody}</p>
          </div>
          <Link to="/share" className={`${buttonStyles({ size: 'lg' })} w-fit`}>
            <LuPlus aria-hidden />
            {friendsCopy.share}
          </Link>
        </div>
      </header>

      {isPending ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading">
          {[0, 1, 2].map((n) => (
            <li key={n} className="aspect-[4/5] animate-pulse rounded-3xl bg-line" />
          ))}
        </ul>
      ) : isError ? (
        <p role="alert" className="text-center text-muted">
          {friendsCopy.loadFailed}
        </p>
      ) : moments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[2.5rem] border-2 border-dashed border-line p-12 text-center">
          <span className="flex size-16 rotate-6 items-center justify-center rounded-3xl bg-primary-soft text-3xl text-primary">
            <LuCamera aria-hidden />
          </span>
          <p className="font-display text-2xl font-semibold">{friendsCopy.empty}</p>
          <p className="text-muted">{friendsCopy.emptyBody}</p>
        </div>
      ) : (
        <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {moments.map((moment, index) => (
            <li key={moment.id} className="mb-6 break-inside-avoid">
              <Reveal>
                <FriendMomentCard moment={moment} tilt={index % 2 === 0 ? 'left' : 'right'} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

// While uploads are closed there is nothing to show, so the page says it is coming soon.
export function FriendsPage() {
  return site.features.uploads ? <FriendsWall /> : <ComingSoon page="wall" />
}
