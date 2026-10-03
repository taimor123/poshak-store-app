import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routes } from '@/config/routes';
import { getProduct, getProducts, getRelated } from '@/lib/api/catalog';
import { CATEGORIES, subLabel } from '@/lib/catalog/categories';
import { careText, isStitched, metaLine } from '@/lib/catalog/product';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DeliveryPromise } from '@/components/commerce/DeliveryPromise';
import { Price } from '@/components/commerce/Price';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { RecentlyViewed } from '@/components/commerce/RecentlyViewed';
import { WishButton } from '@/components/commerce/WishButton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const related = await getRelated(p);

  return (
    <div className="wrap pt-2">
      <Breadcrumb
        items={[
          { label: 'Home', href: routes.home },
          { label: CATEGORIES[p.category].name, href: routes.category(p.category) },
          { label: subLabel(p.category, p.sub), href: routes.category(p.category, p.sub) },
        ]}
      />
      <section aria-label="Product" className="mt-2 grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <ProductGallery product={p} />
        <div className="flex flex-col gap-[22px] lg:sticky lg:top-[88px]">
          <div className="flex flex-col gap-2">
            {p.badge && <span className="self-start rounded-full bg-selected px-2.5 py-[5px] text-label font-semibold text-brand uppercase">{p.badge}</span>}
            <div className="flex items-start gap-2">
              <h1 className="h-page m-0 flex-1">
                {p.shortName} — {p.styleType}
              </h1>
              <WishButton product={p} variant="inline" />
            </div>
            <p className="m-0 text-ui text-ink-2">{metaLine(p)}</p>
            <div className="mt-1">
              <Price size="lg" paisa={p.pricePaisa} compareAtPaisa={p.compareAtPaisa} />
            </div>
            <p className="m-0 text-body text-ink-2">{p.description}</p>
          </div>
          <ProductPurchase product={p} />
          <DeliveryPromise stitched={isStitched(p)} />
          <Accordion
            items={[
              { title: 'Fabric & care', body: careText(p) },
              { title: 'Colour accuracy', body: 'Photographed in daylight without filters. Screens vary, so expect a slight difference in shade. If you’re unsure, ask us for a video on WhatsApp.' },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="rel-h" className="mt-14">
        <h2 id="rel-h" className="h-section mb-5">
          You may also like
        </h2>
        <ProductGrid products={related} cols={4} />
      </section>
      <RecentlyViewed exclude={[p.slug]} clearable={false} className="mt-14" />
    </div>
  );
}
