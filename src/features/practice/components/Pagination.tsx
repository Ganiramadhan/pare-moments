import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { cn } from '@/shared/lib/utils'
import { practiceCopy } from '../constants'
import { pageNumbers } from '../utils/pages'

type PaginationProps = {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

const buttonClass =
  'inline-flex size-11 items-center justify-center rounded-full text-sm font-bold ring-1 ring-line transition disabled:opacity-40'

// Previous / next and a few page numbers, with "…" for the ones in between.
export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  const copy = practiceCopy.pagination
  if (pageCount <= 1) return null

  return (
    <nav aria-label={copy.label} className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label={copy.previous}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(buttonClass, 'bg-surface enabled:hover:bg-primary-soft')}
      >
        <LuChevronLeft aria-hidden className="text-lg" />
      </button>
      {pageNumbers(page, pageCount).map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} aria-hidden className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={copy.page(item)}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={cn(
              buttonClass,
              item === page
                ? 'bg-primary text-on-primary ring-primary'
                : 'bg-surface hover:bg-primary-soft',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label={copy.next}
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={cn(buttonClass, 'bg-surface enabled:hover:bg-primary-soft')}
      >
        <LuChevronRight aria-hidden className="text-lg" />
      </button>
    </nav>
  )
}
