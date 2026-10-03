import Link from 'next/link';
import { routes } from '@/config/routes';
import { storeConfig } from '@/config/store';
import { deliveryRange, formatPKR } from '@/lib/format';
import { CashIcon, ReturnIcon, TruckIcon } from '@/components/ui/icons';

/** Delivery / COD / returns panel on the product page. */
export function DeliveryPromise({ stitched }: { stitched: boolean }) {
  const days = storeConfig.returnWindowDays;
  return (
    <div className="flex flex-col gap-3 rounded-card bg-alt p-4 text-ui">
      <div className="flex items-start gap-3">
        <TruckIcon size={22} className="flex-none text-brand" />
        <span>
          <strong className="font-semibold">Arrives {deliveryRange(storeConfig.standardDays)}</strong>
          <br />
          Free shipping over {formatPKR(storeConfig.freeShippingMinPaisa)}, otherwise {formatPKR(storeConfig.standardShippingPaisa)}.
        </span>
      </div>
      <div className="flex items-start gap-3">
        <CashIcon size={22} className="flex-none text-brand" />
        <span>Cash on delivery. Pay the rider when it arrives.</span>
      </div>
      <div className="flex items-start gap-3">
        <ReturnIcon size={22} className="flex-none text-brand" />
        <span>
          {stitched ? `${days}-day returns on unworn pieces with tags attached.` : `${days}-day returns on uncut fabric in its original pack.`}{' '}
          <Link href={routes.shippingReturns} className="font-semibold">
            Details
          </Link>
        </span>
      </div>
    </div>
  );
}
