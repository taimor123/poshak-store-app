import { Skeleton } from '@/components/ui/Skeleton';
import { ProductGridSkeleton } from '@/components/commerce/ProductGrid';

export default function Loading() {
  return (
    <div className="wrap pt-2" aria-busy="true">
      <Skeleton className="my-3 h-[18px] w-40 rounded" />
      <Skeleton className="mt-1 h-[34px] w-[min(320px,70%)] rounded-btn" />
      <Skeleton className="mt-2 h-[22px] w-[min(560px,90%)] rounded" />
      <Skeleton className="mt-5 h-[60px] rounded-card" />
      <div className="mt-6">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
