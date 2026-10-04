import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routes } from '@/config/routes';
import { getProduct, getPublicConfig } from '@/lib/api/catalog';
import { CATEGORIES, topLevelOf } from '@/lib/catalog/categories';
import { careText, isStitched, metaLine, splitName } from '@/lib/catalog/product';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb';
import { DeliveryPromise } from '@/components/commerce/DeliveryPromise';
import { Price } from '@/components/commerce/Price';
import { ProductGrid } from '@/components/commerce/ProductGrid';
import { RecentlyViewed } from '@/components/commerce/RecentlyViewed';
import { WishButton } from '@/components/commerce/WishButton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug).catch(() => null);
  return p ? { title: p.name, description: p.description, openGraph: p.image ? { images: [p.image.url] } : undefined } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const config = await getPublicConfig();
  const [short, style] = splitName(p.name);
  const top = topLevelOf(p.parentCategory?.slug) ?? topLevelOf(p.category.slug);
  const crumbs: Crumb[] = [
    { label: 'Home', href: routes.home },
    ...(top ? [{ label: CATEGORIES[top].name, href: routes.category(top) }] : []),
    { label: p.category.name, href: top ? routes.category(top, p.category.slug) : undefined },
  ];

  return (
    <div className="wrap pt-2">
      <Breadcrumb items={crumbs} />
      <section aria-label="Product" className="mt-2 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <ProductGallery product={p} />
        <div className="flex min-w-0 flex-col gap-[22px] lg:sticky lg:top-[88px]">
          <div className="flex flex-col gap-2">
            {p.badge && <span className="self-start rounded-full bg-selected px-2.5 py-[5px] text-label font-semibold text-brand uppercase">{p.badge === 'NEW' ? 'New' : 'Sale'}</span>}
            <div className="flex items-start gap-2">
              <h1 className="h-page m-0 flex-1">{style ? `${short} — ${style}` : short}</h1>
              <WishButton product={p} variant="inline" />
            </div>
            <p className="m-0 text-ui text-ink-2">{metaLine(p)}</p>
            <div className="mt-1">
              <Price size="lg" paisa={p.pricePaisa} compareAtPaisa={p.compareAtPaisa ?? undefined} />
            </div>
            <p className="m-0 text-body text-ink-2">{p.description}</p>
            {p.isFinalSale && <p className="m-0 text-ui font-medium text-ink">Final sale — this piece can’t be returned.</p>}
          </div>
          <ProductPurchase product={p} maxQtyPerLine={config.maxQtyPerLine} lowStockThreshold={config.lowStockThreshold} />
          <DeliveryPromise stitched={isStitched(p)} config={config} />
          <Accordion
            items={[
              { title: 'Fabric & care', body: careText(p.fabric) },
              { title: 'Colour accuracy', body: 'Photographed in daylight without filters. Screens vary, so expect a slight difference in shade. If you’re unsure, ask us for a video on WhatsApp.' },
            ]}
          />
        </div>
      </section>

      {p.related.length > 0 && (
        <section aria-labelledby="rel-h" className="mt-14">
          <h2 id="rel-h" className="h-section mb-5">
            You may also like
          </h2>
          <ProductGrid products={p.related} cols={4} />
        </section>
      )}
      <RecentlyViewed exclude={[p.slug]} clearable={false} className="mt-14" />
    </div>
  );
}
