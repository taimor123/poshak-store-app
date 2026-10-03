import { createJSONStorage, type PersistOptions } from 'zustand/middleware';
import { siteConfig } from '@/config/site';

/**
 * Shared persist options: namespaced localStorage key, and manual rehydration
 * (see <StoreHydrator/>) so server HTML and the first client render match.
 */
export const persistOptions = <T,>(name: string): PersistOptions<T, Partial<T>> => ({
  name: `${siteConfig.storageKey}.${name}`,
  storage: createJSONStorage(() => localStorage),
  skipHydration: true,
});
