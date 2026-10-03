/**
 * Every storefront URL is built here, so a route rename is a one-line change.
 * Paths follow docs/FRONTEND/FRONTEND_ARCHITECTURE.md (`/c/…`, `/p/…`).
 */
const withNext = (path: string, next?: string) => (next ? `${path}?next=${encodeURIComponent(next)}` : path);

export const routes = {
  home: '/',
  category: (key: string, sub?: string | null) => (sub ? `/c/${key}?s=${encodeURIComponent(sub)}` : `/c/${key}`),
  product: (slug: string) => `/p/${slug}`,
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : '/search'),
  cart: '/cart',
  checkout: '/checkout',
  confirmation: '/checkout/confirmation',
  /** Order tracking page; guests carry the order's token from their email/confirmation. */
  order: (orderNo: string, token?: string | null) => `/order/${orderNo}${token ? `?t=${encodeURIComponent(token)}` : ''}`,
  signIn: (next?: string) => withNext('/sign-in', next),
  register: (next?: string) => withNext('/register', next),
  forgotPassword: '/forgot-password',
  account: (tab?: 'orders' | 'track' | 'addr') => (tab && tab !== 'orders' ? `/account?tab=${tab}` : '/account'),
  wishlist: '/wishlist',
  sizeGuide: '/size-guide',
  shippingReturns: '/shipping-returns',
} as const;
