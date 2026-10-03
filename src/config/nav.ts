import { CATEGORIES, type CategoryKey, type ListingKey } from '@/lib/catalog/categories';
import { routes } from './routes';

/**
 * Storefront navigation — CODE-CURATED, never DB-driven
 * (docs/FASHION_DOMAIN/CATEGORY_TAXONOMY.md §Header navigation).
 * Admin category CRUD changes category pages, not this menu.
 */

export type NavItem = { label: string; href: string };
export type NavMenu = { kind: 'menu'; key: CategoryKey; label: string; allLabel: string; href: string; items: NavItem[] };
export type NavLink = { kind: 'link'; key: ListingKey; label: string; href: string; tone?: 'sale' };
export type NavEntry = NavMenu | NavLink;

const menu = (key: CategoryKey, label: string): NavMenu => ({
  kind: 'menu',
  key,
  label,
  allLabel: `All ${CATEGORIES[key].name.toLowerCase()}`,
  href: routes.category(key),
  items: CATEGORIES[key].subs.map((s) => ({ label: s.label, href: routes.category(key, s.key) })),
});

export const headerNav: NavEntry[] = [
  menu('unstitched', 'Unstitched'),
  menu('ready-to-wear', 'Ready to Wear'),
  menu('formals', 'Formals'),
  { kind: 'link', key: 'new', label: 'New In', href: routes.category('new') },
  { kind: 'link', key: 'sale', label: 'Sale', href: routes.category('sale'), tone: 'sale' },
];

/** Secondary links at the bottom of the mobile drawer. */
export const drawerLinks = (signedIn: boolean, wishCount: number): NavItem[] => [
  { label: `Wishlist (${wishCount})`, href: routes.wishlist },
  { label: signedIn ? 'Your account' : 'Sign in', href: signedIn ? routes.account() : routes.signIn() },
  { label: 'Track your order', href: routes.account('track') },
  { label: 'Size guide', href: routes.sizeGuide },
  { label: 'Shipping & returns', href: routes.shippingReturns },
];

/**
 * Footer columns. `external` opens in a new tab; `soon` marks pages that
 * don't exist yet (they show a "coming soon" toast instead of a 404).
 */
export type FooterLink = NavItem & { external?: boolean; soon?: boolean };

export const footerNav = (whatsappHref: string, emailHref: string): { title: string; links: FooterLink[] }[] => [
  {
    title: 'Shop',
    links: [
      { label: 'Unstitched', href: routes.category('unstitched') },
      { label: 'Ready to Wear', href: routes.category('ready-to-wear') },
      { label: 'Formals', href: routes.category('formals') },
      { label: 'New In', href: routes.category('new') },
      { label: 'Sale', href: routes.category('sale') },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & Returns', href: routes.shippingReturns },
      { label: 'Size Guide', href: routes.sizeGuide },
      { label: 'Track your order', href: routes.account('track') },
      { label: 'Contact', href: emailHref, external: true },
      { label: 'WhatsApp', href: whatsappHref, external: true },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', href: '#', soon: true },
      { label: 'Why real measurements', href: routes.sizeGuide },
      { label: 'Fabric sourcing', href: '#', soon: true },
    ],
  },
];
