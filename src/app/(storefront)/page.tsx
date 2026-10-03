import { routes } from '@/config/routes';
import { getHomeNewIn } from '@/lib/api/catalog';
import { SectionHeader, SectionLink } from '@/components/ui/Blocks';
import { ProductRail } from '@/components/commerce/ProductGrid';
import { RecentlyViewed } from '@/components/commerce/RecentlyViewed';
import { CategoryTiles, FitTrustBand, Hero, PromoBanner, ValueProps } from '@/components/home/HomeSections';

export const revalidate = 300;

export default async function HomePage() {
  const newIn = await getHomeNewIn();
  return (
    <>
      <Hero />
      <CategoryTiles />
      <section aria-labelledby="newin-h">
        <div className="wrap pt-10 pb-2">
          <SectionHeader id="newin-h" title="New in" action={<SectionLink href={routes.category('new')}>View all →</SectionLink>} />
          <ProductRail products={newIn} />
        </div>
      </section>
      <FitTrustBand />
      <PromoBanner eyebrow="The Eid Edit" title="Festive looks, from PKR 4,950" cta="Explore the edit" href={routes.category('formals')} />
      <ValueProps />
      <div className="wrap">
        <RecentlyViewed />
      </div>
    </>
  );
}
