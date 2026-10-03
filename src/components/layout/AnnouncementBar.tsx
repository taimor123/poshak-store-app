'use client';
import { useSyncExternalStore } from 'react';
import { siteConfig } from '@/config/site';
import { storeConfig } from '@/config/store';
import { formatPKR } from '@/lib/format';
import { CloseIcon } from '@/components/ui/icons';

const KEY = `${siteConfig.storageKey}.announcement`;
const listeners = new Set<() => void>();
const read = () => {
  try {
    return sessionStorage.getItem(KEY) !== 'dismissed';
  } catch {
    return true;
  }
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

/** Maroon band above the header. Dismissal lasts for the browser session. */
export function AnnouncementBar() {
  const show = useSyncExternalStore(subscribe, read, () => true);
  if (!show) return null;
  const dismiss = () => {
    try {
      sessionStorage.setItem(KEY, 'dismissed');
    } catch {}
    listeners.forEach((l) => l());
  };
  return (
    <div className="bg-band">
      <div className="wrap relative flex min-h-11 items-center justify-center py-[5px]">
        {/* The ONE gold element on the site. */}
        <p className="m-0 pr-11 pl-7 text-center text-ui font-medium text-gold">
          Free shipping on orders over {formatPKR(storeConfig.freeShippingMinPaisa)} · Cash on delivery available
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={dismiss}
          className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-card text-page hover:bg-page/10"
        >
          <CloseIcon size={18} />
        </button>
      </div>
    </div>
  );
}
