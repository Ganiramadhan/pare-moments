import { Link, useSearchParams } from 'react-router'
import { buttonStyles } from '@/shared/components/ui/button-styles'
import { useSeo } from '@/shared/hooks/useSeo'
import { useSpeech } from '@/shared/hooks/useSpeech'
import { NameGate } from '../components/NameGate'
import { PracticeHeader } from '../components/PracticeHeader'
import { StorySession } from '../components/StorySession'
import { VersionPicker } from '../components/VersionPicker'
import { practiceCopy, VERSIONS } from '../constants'
import { listeningVersions } from '../data/listening'
import { useProgress } from '../hooks/useProgress'

// Listening practice with short stories, in three versions. The browser reads the story aloud, then
// come multiple-choice and fill-in-the-blank questions.
export function ListeningPage() {
  const copy = practiceCopy.listening
  const [params] = useSearchParams()
  const { supported } = useSpeech()
  const { progress } = useProgress()
  const version = listeningVersions.find((v) => v.id === params.get('v'))

  useSeo({
    title: 'Listening practice',
    description:
      'Practice English listening with short stories, multiple-choice questions and fill-in-the-blank, in three versions.',
    path: '/practice/listening',
  })

  if (!supported) {
    return (
      <main className="flex flex-col gap-8">
        <PracticeHeader title={copy.title} text={copy.text} />
        <p
          role="alert"
          className="max-w-xl rounded-3xl bg-secondary-soft p-6 text-lg leading-relaxed ring-1 ring-secondary"
        >
          {copy.unsupported}
        </p>
      </main>
    )
  }

  if (version) {
    const meta = VERSIONS.find((v) => v.id === version.id)!
    return (
      <main className="flex flex-col gap-8">
        <PracticeHeader
          title={`${copy.title} ${meta.label}`}
          text={meta.name}
          backTo={{ to: '/practice/listening', label: copy.title }}
        />
        <NameGate>
          <StorySession
            key={version.id}
            version={version}
            progressKey={`listening:${version.id}`}
            actions={
              <Link
                to="/practice/listening"
                className={buttonStyles({ variant: 'ghost', size: 'lg' })}
              >
                {practiceCopy.pickVersion}
              </Link>
            }
          />
        </NameGate>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-8">
      <PracticeHeader title={copy.title} text={copy.text} />
      <VersionPicker
        label={practiceCopy.pickVersion}
        items={VERSIONS.map((v) => ({
          id: v.id,
          href: `/practice/listening?v=${v.id}`,
          detail: copy.detail,
          best: progress.scores[`listening:${v.id}`]?.best,
        }))}
      />
    </main>
  )
}
