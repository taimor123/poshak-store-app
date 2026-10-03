import Form from 'next/form';
import { cn } from '@/lib/cn';
import { routes } from '@/config/routes';

export const SEARCH_PLACEHOLDER = 'Try ‘lawn 3-piece’ or ‘kurti’';

/** Search form that submits to /search?q=. Used in the header and on the search page. */
export function SearchForm({ defaultValue, autoFocus, compact, className, onSubmit }: { defaultValue?: string; autoFocus?: boolean; compact?: boolean; className?: string; onSubmit?: () => void }) {
  return (
    <Form action={routes.search()} role="search" className={cn('flex gap-2', className)} onSubmit={onSubmit}>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        aria-label="Search products"
        placeholder={SEARCH_PLACEHOLDER}
        className={cn('input min-w-0 flex-1', compact && 'min-h-11 bg-page')}
      />
      <button type="submit" className={cn('btn-primary', compact && 'min-h-11 px-5')}>
        Search
      </button>
    </Form>
  );
}

/** Full-width bar that drops under the header. */
export function SearchBar({ onDone }: { onDone: () => void }) {
  return (
    <div className="border-t border-line bg-surface">
      <SearchForm autoFocus compact className="wrap pt-2.5 pb-3" onSubmit={onDone} />
    </div>
  );
}
