# poshak-store-app

The Poshak storefront: **Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Zustand**.

UI only. Domain logic, the database and auth live in [`poshak-store-apis`](https://github.com/taimor123/poshak-store-apis). The spec lives in the docs repo [`poshak-store`](https://github.com/taimor123/poshak-store).

## Run it

The storefront reads everything from the API, so start that first. In `poshak-store-apis`, run `docker compose up -d --build`; that brings up Postgres and the API on :4000, migrated and seeded.

```bash
cp .env.example .env.local   # API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
npm run build                # production build (reads the API at build time)
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
│   ├── api/                  server-only API client (client.ts forwards cookies, parses the envelope) + reads
│   ├── actions/              server actions: thin proxies to the API (cart, orders, auth); relay Set-Cookie
│   ├── catalog/              API DTO types, curated categories, URL filters, product helpers
│   └── format.ts             formatPKR (money is integer paisa everywhere), dates
├── stores/                   Zustand: cart (mirror of the server cart), shopper (wishlist, recently viewed, session), ui
└── styles/                   tokens.css, fonts.ts
```

## Rules this code keeps

- **Money is integer paisa.** Format only at render with `formatPKR()`. The server prices orders. Totals in the browser are a preview only.
- **No dark patterns.** "Only N left" appears only when stock ≤ `storeConfig.lowStockThreshold`. No countdowns.
- Filter, sort and sub-category state lives in the **URL**, not in stores.
- Mobile-first at 360px. Every interactive element has a visible focus ring and a hit area of at least 44px.

## How it talks to the API

- **Reads** (catalogue, product, search, config, zones) come from Server Components through `lib/api/*`. Public reads sit in the Next data cache for 30–300 s.
- **Writes** (cart, checkout, sign-in, cancel) go through `lib/actions/*` server actions. They forward the shopper's `psk_session` / `psk_anon` cookies to the API and relay the API's `Set-Cookie` back. The browser never calls the API directly.
- **The cart lives on the server.** The Zustand cart store only mirrors the last cart the API returned. Every cart and checkout view re-reads it, so the current price always wins.
- **Checkout** sends one `Idempotency-Key` per attempt, so a retry can never create a second order. `PRICE_MISMATCH` and `STOCK_CONFLICT` refresh the cart and show a banner.
- **Guests** get a signed token in their confirmation and tracking links (`/order/PSK-…?t=…`), or track with order number + mobile.

## Not built yet

- Email OTP verification and Google sign-in (deferred by the owner until testing).
- The admin panel UI. The admin API exists in `poshak-store-apis`.
- Saving addresses from the account page (the API endpoints exist).
- Real product photos. Cards fall back to colour placeholders until images are uploaded to Cloudinary.
