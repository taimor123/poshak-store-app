import type { ProductCard as Product } from '@/lib/catalog/types';
import { cn } from '@/lib/cn';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

/** 2 cols mobile → 3 cols ≥768 → (optionally) 4 cols ≥1024. */
export function ProductGrid({ products, cols = 3, className }: { products: Product[]; cols?: 3 | 4; className?: string }) {
  return (
    <div className={cn('grid-products animate-fadein', className)} data-cols={cols}>
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: 3 | 4 }) {
  return (
    <div className="grid-products" data-cols={cols}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Snap-scroll rail with peek on mobile; 4-col grid on desktop. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="rail animate-fadein">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

export function ProductRailSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="rail">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
