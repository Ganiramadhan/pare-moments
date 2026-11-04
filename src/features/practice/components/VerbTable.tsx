import { practiceCopy } from '../constants'
import type { Verb } from '../types/practice'
import { cn } from '@/shared/lib/utils'
import { SpeakButton } from './SpeakButton'

type VerbTableProps = {
  verbs: Verb[]
}

// The verbs as a table: V1, V2, V3 and the meaning. Irregular forms stand out, and every row can be
// read aloud.
export function VerbTable({ verbs }: VerbTableProps) {
  const copy = practiceCopy.verbs

  return (
    <div className="overflow-x-auto rounded-3xl bg-surface shadow-sm ring-1 ring-line">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{copy.tableCaption}</caption>
        <thead>
          <tr className="border-b border-line text-sm font-extrabold tracking-wide uppercase">
            <th scope="col" className="px-1.5 py-3 sm:px-4">
              V1 <span className="font-medium text-muted normal-case">{copy.base}</span>
            </th>
            <th scope="col" className="px-1.5 py-3 sm:px-4">
              V2 <span className="font-medium text-muted normal-case">{copy.past}</span>
            </th>
            <th scope="col" className="px-1.5 py-3 sm:px-4">
              V3 <span className="font-medium text-muted normal-case">{copy.participle}</span>
            </th>
            <th scope="col" className="hidden px-1.5 py-3 sm:table-cell sm:px-4">
              {copy.meaning}
            </th>
            <th scope="col" className="px-1.5 py-3 sm:px-4">
              <span className="sr-only">{copy.listen}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {verbs.map((verb) => (
            <tr key={verb.base} className="border-b border-line last:border-b-0 even:bg-bg/60">
              <th
                scope="row"
                className="px-1.5 py-3 font-display text-lg font-bold sm:px-4 sm:text-xl"
              >
                {verb.base}
                <span className="block font-body text-xs font-medium text-muted sm:hidden">
                  {verb.meaning}
                </span>
              </th>
              <td
                className={cn(
                  'px-2 py-3 text-base sm:px-4 sm:text-lg',
                  verb.irregular && 'font-bold text-primary',
                )}
              >
                {verb.past}
              </td>
              <td
                className={cn(
                  'px-2 py-3 text-base sm:px-4 sm:text-lg',
                  verb.irregular && 'font-bold text-primary',
                )}
              >
                {verb.participle}
              </td>
              <td className="hidden px-1.5 py-3 text-muted sm:table-cell sm:px-4">
                {verb.meaning}
              </td>
              <td className="px-1 py-2 sm:px-4">
                <SpeakButton compact text={`${verb.base}, ${verb.past}, ${verb.participle}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
