import { SIZES } from '@/lib/catalog/sizes';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="wrap pt-2" aria-busy="true">
      <Skeleton className="my-3 h-[18px] w-56 rounded" />
      <div className="mt-2 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className={`rounded-card ${i > 0 ? 'hidden lg:block' : ''}`} style={{ aspectRatio: '3/4' }} />
          ))}
        </div>
        <div className="flex flex-col gap-3.5">
          <Skeleton className="h-[34px] w-[85%] rounded-btn" />
          <Skeleton className="h-[18px] w-[45%] rounded" />
          <Skeleton className="h-6 w-[30%] rounded" />
          <div className="mt-3 flex gap-2">
            {SIZES.map((z) => (
              <Skeleton key={z} className="h-12 w-[52px] rounded-btn" />
            ))}
          </div>
          <Skeleton className="h-[220px] rounded-card" />
          <Skeleton className="h-12 rounded-btn" />
        </div>
      </div>
    </div>
  );
}
