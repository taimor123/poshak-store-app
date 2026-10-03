import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routes } from '@/config/routes';
import { getListing } from '@/lib/api/catalog';
import { CATEGORIES, LISTINGS, LISTING_KEYS, isCategoryKey, isListingKey } from '@/lib/catalog/categories';
import { applyFilters, parseFilters, EMPTY_FILTERS } from '@/lib/catalog/filters';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState, PageHeading } from '@/components/ui/Blocks';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { ListingControls } from '@/components/listing/ListingControls';
import { ClearFiltersButton } from '@/components/listing/ClearFiltersButton';

type Props = { params: Promise<{ category: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export function generateStaticParams() {
  return LISTING_KEYS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return isListingKey(category) ? { title: LISTINGS[category].title, description: LISTINGS[category].intro } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  if (!isListingKey(category)) notFound();
  const filters = parseFilters(await searchParams);
  const { title, intro } = LISTINGS[category];
  const subs = isCategoryKey(category) ? CATEGORIES[category].subs : [];
  const { results, fabricCounts, hasStitched } = applyFilters(await getListing(category), filters);
  const basePath = routes.category(category);

  return (
    <div className="wrap pt-2">
      <Breadcrumb items={[{ label: 'Home', href: routes.home }, { label: title }]} />
      <div className="mt-1">
        <PageHeading title={title} intro={intro} />
      </div>
      <ListingControls basePath={basePath} filters={filters} subs={subs} fabricCounts={fabricCounts} hasStitched={hasStitched} resultCount={results.length}>
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <EmptyState
            className="py-10"
            title="Nothing matches these filters"
            body="Try removing a filter, or message us on WhatsApp and we’ll tell you what’s arriving next."
            action={<ClearFiltersButton href={basePath + (filters.sort !== EMPTY_FILTERS.sort ? `?sort=${filters.sort}` : '')} />}
          />
        )}
      </ListingControls>
    </div>
  );
}
