/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Brand identity — THE single place for the store's name, logo and contact.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every component reads from here: header, footer, page titles, metadata,
 *  copy that mentions the store. Rename the store or swap the logo here only.
 *
 *  Logo:
 *    - `logo.src: null` renders the name as a text wordmark (the default).
 *    - To use an image, drop the file in /public/brand/ and set `logo.src`
 *      (e.g. '/brand/logo.svg') plus its intrinsic `width` / `height`.
 *  Favicon: replace src/app/icon.svg (it carries its own colours).
 *  Colours: see src/styles/tokens.css.
 */
export const siteConfig = {
  name: 'Poshak',
  tagline: 'Pehno apni pehchaan',
  positioning: 'Eastern wear you can trust to fit',
  description:
    'Unstitched fabrics and ready-to-wear pret with real measurements, delivered across Pakistan. Cash on delivery.',

  logo: {
    src: null as string | null,
    width: 132,
    height: 32,
  },

  /** Mobile browser chrome colour. Keep in sync with --color-band in tokens.css. */
  themeColor: '#3e1122',

  location: 'Karachi, Pakistan',
  copyrightYear: 2026,

  contact: {
    /** International format, digits only, for wa.me links. */
    whatsapp: '923001234567',
    email: 'hello@poshak.pk',
    hours: '10am–8pm, every day except Sunday',
  },

  /** Public URL, used for metadata. Override with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  /**
   * Prefix for browser-storage keys. Deliberately separate from `name` so
   * renaming the store doesn't wipe shoppers' carts and wishlists.
   */
  storageKey: 'poshak',
} as const;

export type SiteConfig = typeof siteConfig;
