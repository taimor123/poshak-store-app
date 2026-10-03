import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routes } from '@/config/routes';
import { getCategoryListing, getCollection } from '@/lib/api/catalog';
import { CATEGORIES, COLLECTIONS, categoryPath, isCategoryKey, isCollectionKey, isListingKey } from '@/lib/catalog/categories';
import { EMPTY_FILTERS, parseFilters, toApiQuery } from '@/lib/catalog/filters';
import type { Listing } from '@/lib/catalog/types';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState, PageHeading } from '@/components/ui/Blocks';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { ListingControls } from '@/components/listing/ListingControls';
import { ClearFiltersButton } from '@/components/listing/ClearFiltersButton';

type Props = { params: Promise<{ category: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (isCollectionKey(category)) return { title: COLLECTIONS[category].title, description: COLLECTIONS[category].intro };
  if (isCategoryKey(category)) return { title: CATEGORIES[category].name };
  return {};
}

/** Category and collection listings. Filters, sort and sub-category live in the URL; the API filters. */
export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  if (!isListingKey(category)) notFound();
  const filters = parseFilters(await searchParams);
  const query = toApiQuery(filters);
  const basePath = routes.category(category);

  let title: string;
  let intro: string;
  let subs: { key: string; label: string }[] = [];
  let listing: Listing;
  if (isCollectionKey(category)) {
    ({ title, intro } = COLLECTIONS[category]);
    listing = await getCollection(category, query);
  } else {
    const data = await getCategoryListing(categoryPath(category, filters.sub), query);
    if (!data) notFound();
    listing = data;
    title = CATEGORIES[category].name;
    intro = data.category.description ?? '';
    subs = CATEGORIES[category].subs;
  }

  return (
    <div className="wrap pt-2">
      <Breadcrumb items={[{ label: 'Home', href: routes.home }, { label: title }]} />
      <div className="mt-1">
        <PageHeading title={title} intro={intro} />
      </div>
      <ListingControls
        basePath={basePath}
        filters={filters}
        subs={subs}
        fabricCounts={listing.facets.fabric.map((f) => ({ fabric: f.value, count: f.count }))}
        hasStitched={listing.facets.hasStitched}
        resultCount={listing.total}
      >
        {listing.items.length > 0 ? (
          <ProductGrid products={listing.items} />
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
