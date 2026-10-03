'use client';
import { routes } from '@/config/routes';
import { useProducts } from '@/hooks/useProducts';
import { plural } from '@/lib/format';
import { useShopper } from '@/stores/shopper';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Blocks';
import { HeartIcon } from '@/components/ui/icons';
import { ProductGrid, ProductGridSkeleton } from '@/components/commerce/ProductGrid';
import { RecentlyViewed } from '@/components/commerce/RecentlyViewed';

/** Saved styles on this device. Un-hearting a card removes it. */
export function WishlistView() {
  const wishlist = useShopper((s) => s.wishlist);
  const { products, loading } = useProducts(wishlist);

  return (
    <div className="wrap pt-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="h-page m-0">Wishlist</h1>
        <p className="m-0 text-body text-ink-2" aria-live="polite">
          {loading ? ' ' : products.length ? `${plural(products.length, 'saved style')}. Stock shown is live.` : 'Pieces you save will appear here.'}
        </p>
      </div>
      <section aria-label="Saved styles" aria-busy={loading} className="mt-7">
        {loading ? (
          <ProductGridSkeleton count={Math.max(2, Math.min(wishlist.length, 4))} cols={4} />
        ) : products.length ? (
          <ProductGrid products={products} cols={4} />
        ) : (
          <EmptyState
            icon={<HeartIcon size={32} className="text-brand" />}
            title="Nothing saved yet"
            body="Tap the heart on any piece to keep it here. Your list stays on this phone."
            action={<ButtonLink href={routes.category('new')}>Shop new arrivals</ButtonLink>}
          />
        )}
      </section>
      <RecentlyViewed exclude={wishlist} className="mt-14" />
    </div>
  );
}
