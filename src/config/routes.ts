/**
 * Every storefront URL is built here, so a route rename is a one-line change.
 * Paths follow docs/FRONTEND/FRONTEND_ARCHITECTURE.md (`/c/…`, `/p/…`).
 */
export const routes = {
  home: '/',
  category: (key: string, sub?: string | null) => (sub ? `/c/${key}?s=${encodeURIComponent(sub)}` : `/c/${key}`),
  product: (slug: string) => `/p/${slug}`,
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : '/search'),
  cart: '/cart',
  checkout: '/checkout',
  confirmation: '/checkout/confirmation',
  signIn: (next?: string) => (next ? `/sign-in?next=${encodeURIComponent(next)}` : '/sign-in'),
  account: (tab?: 'orders' | 'track' | 'addr') => (tab && tab !== 'orders' ? `/account?tab=${tab}` : '/account'),
  wishlist: '/wishlist',
  sizeGuide: '/size-guide',
  shippingReturns: '/shipping-returns',
} as const;
