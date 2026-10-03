'use client';
import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useShopper } from '@/stores/shopper';
import { SectionHeader } from '@/components/ui/Blocks';
import { ProductRail } from './ProductGrid';

/** "Recently viewed" rail from this device's history. Renders nothing when empty. */
export function RecentlyViewed({ exclude = [], limit = 4, clearable = true, className = 'pt-12' }: { exclude?: string[]; limit?: number; clearable?: boolean; className?: string }) {
  const viewed = useShopper((s) => s.viewed);
  const clear = useShopper((s) => s.clearViewed);
  const excludeKey = exclude.join(',');
  const slugs = useMemo(() => viewed.filter((s) => !excludeKey.split(',').includes(s)).slice(0, limit), [viewed, excludeKey, limit]);
  const { products, loading } = useProducts(slugs);
  if (loading || !products.length) return null;
  return (
    <section aria-labelledby="rv-h" className={className}>
      <SectionHeader
        id="rv-h"
        title="Recently viewed"
        action={
          clearable && (
            <button type="button" className="tlink text-ui" onClick={clear}>
              Clear
            </button>
          )
        }
      />
      <ProductRail products={products} />
    </section>
  );
}
