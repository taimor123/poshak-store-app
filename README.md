# poshak-store-app

The Poshak storefront: **Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Zustand**.

UI only. Domain logic, the database and auth live in [`poshak-store-apis`](https://github.com/taimor123/poshak-store-apis). The spec lives in the docs repo [`poshak-store`](https://github.com/taimor123/poshak-store).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

Node 20+.

## Change the look or the brand in one place

| To change… | Edit |
|---|---|
| **Colours** (brand, buttons, backgrounds, text, status), type scale, radii, shadows | [`src/styles/tokens.css`](src/styles/tokens.css) |
| **Store name, tagline, logo**, contact details, WhatsApp number | [`src/config/site.ts`](src/config/site.ts) |
| **Fonts** | [`src/styles/fonts.ts`](src/styles/fonts.ts) |
| Favicon | [`src/app/icon.svg`](src/app/icon.svg) |
| Business numbers (free-shipping threshold, fees, low-stock threshold, return window, cities) | [`src/config/store.ts`](src/config/store.ts) |
| Header / drawer / footer menus (code-curated, never DB-driven) | [`src/config/nav.ts`](src/config/nav.ts) |
| URLs | [`src/config/routes.ts`](src/config/routes.ts) |

Components never contain raw hex values or the store name. They use token classes (`bg-brand`, `text-ink-2`, `border-line`) and `siteConfig.name`.

**Buttons** have their own tokens (`--color-btn-primary`, `--color-btn-secondary-*`, …). By default they follow `--color-brand`. Override them in `tokens.css` to give buttons a different colour.

**Logo:** with `logo.src: null` the store name renders as a text wordmark. To use an image, put it in `public/brand/`, then set `logo.src: '/brand/logo.svg'` and its `width`/`height`.

## Layout

```
src/
├── app/                      routes only: thin, compose from components
│   ├── (storefront)/         header + footer layout; every customer page
│   │   ├── page.tsx          home
│   │   ├── c/[category]/     listing (filters in the URL)
│   │   ├── p/[slug]/         product detail
│   │   ├── search/ cart/ checkout/ checkout/confirmation/
│   │   ├── sign-in/ account/ wishlist/
│   │   └── size-guide/ shipping-returns/
│   ├── globals.css           shared component classes (.btn-primary, .chip, .input, .tbl…)
│   └── layout.tsx            fonts, metadata, toaster, store hydration
├── components/
│   ├── ui/                   primitives: Button, Field, Overlay (Drawer/Modal), Table, Accordion, Skeleton, icons…
│   ├── layout/               Header, DesktopNav, MobileMenu, SearchBar, Footer, Logo, AnnouncementBar
│   ├── commerce/             ProductCard, QuickView, ProductGrid/Rail, Price, SizeSelector, MiniCart, OrderSummary…
│   ├── home/ listing/ product/ checkout/ account/ content/   page-level sections
├── config/                   site, store, nav, routes
├── hooks/                    a11y (focus trap, Esc, scroll lock), useProducts, useCartDetails
├── lib/
│   ├── api/                  server-only reads (catalog, account): demo data today, API fetches later
│   ├── actions/              server actions (place order, track, OTP): thin proxies to the API later
│   ├── catalog/              types, categories, sizes, filters, product helpers
│   ├── mock/                 demo catalogue and orders: imported only by lib/api and lib/actions
│   └── format.ts             formatPKR (money is integer paisa everywhere), dates
├── stores/                   Zustand: cart, shopper (wishlist, recently viewed, session), ui
└── styles/                   tokens.css, fonts.ts
```

## Rules this code keeps

- **Money is integer paisa.** Format only at render with `formatPKR()`. The server prices orders. Totals in the browser are a preview only.
- **No dark patterns.** "Only N left" appears only when stock ≤ `storeConfig.lowStockThreshold`. No countdowns.
- Filter, sort and sub-category state lives in the **URL**, not in stores.
- Mobile-first at 360px. Every interactive element has a visible focus ring and a hit area of at least 44px.

## Still demo-only (waiting on `poshak-store-apis`)

- The catalogue and order history come from `src/lib/mock/`. Replace the function bodies in `src/lib/api/*` with API calls and keep their signatures.
- `placeOrder`, `trackOrder` and the OTP actions in `src/lib/actions/` don't call the API yet. The demo sign-in code is `123456`.
- Cart, wishlist and session are stored on the device (localStorage). They move to the API once it exists.
- Product images are colour placeholders. Swap the inside of `ProductImage` for `next/image` at the same aspect ratios.
