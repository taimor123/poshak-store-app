'use client';
import { useEffect } from 'react';
import { useCart } from './cart';
import { useShopper } from './shopper';
import { useUi } from './ui';

/** Loads persisted stores after mount, so SSR markup and first paint agree. */
export function StoreHydrator() {
  useEffect(() => {
    Promise.all([useCart.persist.rehydrate(), useShopper.persist.rehydrate()]).then(() => useUi.getState().setHydrated());
  }, []);
  return null;
}
