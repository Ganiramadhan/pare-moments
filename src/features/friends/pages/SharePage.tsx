import { useState } from 'react'
import { LuPartyPopper } from 'react-icons/lu'
import { Link } from 'react-router'
import { useSeo } from '@/shared/hooks/useSeo'
import { Confetti } from '@/shared/components/ui/Confetti'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { site } from '@/shared/config/site'
import { CodeGate } from '../components/CodeGate'
import { ComingSoon } from '../components/ComingSoon'
import { ShareForm } from '../components/ShareForm'
import { Steps } from '../components/Steps'
import { friendsCopy } from '../constants'
import type { FriendMoment } from '../types/friend-moment'
import { clearUploadToken, getUploadToken, saveUploadToken } from '../utils/upload-access'

function ShareFlow() {
  useSeo({ title: 'Share your moment', path: '/share', noindex: true })
  const [token, setToken] = useState(getUploadToken)
  const [shared, setShared] = useState<FriendMoment | null>(null)
  // Changing the key gives "Share another" a fresh, empty form.
  const [round, setRound] = useState(0)

  const step = !token ? 1 : shared ? 3 : 2

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Steps current={step} />
        <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
          {friendsCopy.shareTitle}
        </h1>
        <p className="text-lg text-muted">{friendsCopy.shareBody}</p>
      </header>

      {!token ? (
        <CodeGate
          onVerified={(newToken) => {
            saveUploadToken(newToken)
            setToken(newToken)
          }}
        />
      ) : shared ? (
        <div className="flex animate-pop flex-col items-center gap-4 rounded-[2rem] bg-surface p-8 text-center shadow-lg ring-1 ring-line">
          <Confetti />
          <span className="flex size-20 rotate-6 items-center justify-center rounded-3xl bg-secondary text-5xl text-on-secondary shadow-md">
            <LuPartyPopper aria-hidden />
          </span>
          <h2 className="font-display text-3xl font-bold">
            {friendsCopy.thanksTitle(shared.name)}
          </h2>
          <p className="text-muted">{friendsCopy.thanksBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/friends" className={buttonStyles({ size: 'lg' })}>
              {friendsCopy.seeWall}
            </Link>
            <button
              type="button"
              onClick={() => {
                setShared(null)
                setRound((r) => r + 1)
              }}
              className={buttonStyles({ variant: 'ghost', size: 'lg' })}
            >
              {friendsCopy.shareAnother}
            </button>
          </div>
        </div>
      ) : (
        <ShareForm
          key={round}
          token={token}
          onShared={setShared}
          onAccessLost={() => {
            clearUploadToken()
            setToken(null)
          }}
        />
      )}
    </main>
  )
}

// While uploads are closed, the page says that sharing is coming soon instead of asking for a code.
export function SharePage() {
  return site.features.uploads ? <ShareFlow /> : <ComingSoon page="share" />
}
