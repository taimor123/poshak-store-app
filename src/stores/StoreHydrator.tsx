'use client';
import { useEffect } from 'react';
import { getSessionUser } from '@/lib/actions/auth';
import { refreshCart } from './cart';
import { useShopper } from './shopper';
import { useUi } from './ui';

/**
 * After mount: load the device's wishlist/recently-viewed, then the session
 * and the server cart. Keeps every page statically renderable.
 */
export function StoreHydrator() {
  useEffect(() => {
    void (async () => {
      await useShopper.persist.rehydrate();
      useUi.getState().setHydrated();
      const [user] = await Promise.all([getSessionUser().catch(() => null), refreshCart().catch(() => undefined)]);
      useShopper.getState().setUser(user);
    })();
  }, []);
  return null;
}
