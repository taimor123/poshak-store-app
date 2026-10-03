import Link from 'next/link';
import { routes } from '@/config/routes';
import { getNewThisWeek, searchProducts } from '@/lib/api/catalog';
import { plural } from '@/lib/format';
import { Eyebrow } from '@/components/ui/Blocks';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { SearchForm } from '@/components/layout/SearchBar';

export const metadata = { title: 'Search' };

const SUGGESTIONS = ['Lawn', 'Kurti', 'Unstitched 3-piece', 'Co-ord', 'Chiffon', 'Khaddar', 'Maxi'];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? '').trim();
  const results = await searchProducts(q);
  const shown = results.length ? results : await getNewThisWeek();
  const title = !q ? 'Search' : results.length ? `Results for “${q}”` : `No results for “${q}”`;
  const sub = !q ? 'Search by fabric, style, colour or name.' : results.length ? plural(results.length, 'style') : 'Check the spelling, or try a fabric or style instead.';

  return (
    <div className="wrap pt-7">
      <SearchForm key={q} defaultValue={q} className="max-w-[640px]" />
      <div className="mt-6 flex flex-col gap-1.5">
        <h1 className="h-page m-0">{title}</h1>
        <p className="m-0 text-body text-ink-2" aria-live="polite">
          {sub}
        </p>
      </div>
      <div className="mt-4">
        <Eyebrow className="mb-2.5">{results.length ? 'Related searches' : 'Popular searches'}</Eyebrow>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {SUGGESTIONS.map((g) => (
            <Link key={g} href={routes.search(g.toLowerCase())} className="chip" data-on={g.toLowerCase() === q.toLowerCase()}>
              {g}
            </Link>
          ))}
        </div>
      </div>
      <section aria-label="Results" className="mt-8">
        {!results.length && <h2 className="h-section mb-5">New this week</h2>}
        <ProductGrid products={shown} cols={4} />
      </section>
    </div>
  );
}
