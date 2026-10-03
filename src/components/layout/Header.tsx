'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { useEscape } from '@/hooks/a11y';
import { cartCount, useCart } from '@/stores/cart';
import { useShopper } from '@/stores/shopper';
import { useUi } from '@/stores/ui';
import { IconButton } from '@/components/ui/Button';
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from '@/components/ui/icons';
import { MiniCart } from '@/components/commerce/MiniCart';
import { DesktopNav } from './DesktopNav';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';

/** Sticky header: burger (<1024), logo, desktop nav, search / wishlist / account / cart. */
export function Header() {
  const pathname = usePathname();
  const active = pathname.match(/^\/c\/([^/?]+)/)?.[1];
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEscape(searchOpen, () => setSearchOpen(false));

  const hydrated = useUi((s) => s.hydrated);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const count = useCart((s) => cartCount(s.lines));
  const wishCount = useShopper((s) => s.wishlist.length);
  const signedIn = useShopper((s) => !!s.session);

  return (
    <>
      <header className="sticky top-0 z-60 border-b border-line bg-surface">
        <div className="wrap flex min-h-16 items-center gap-0.5">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Logo href={routes.home} />
          <DesktopNav active={active} />
          <div className="ml-auto flex items-center gap-0.5">
            <IconButton label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}>
              <SearchIcon />
            </IconButton>
            <Link href={routes.wishlist} className="icon-btn hidden md:inline-flex" aria-label={`Wishlist, ${wishCount} saved`}>
              <HeartIcon filled={hydrated && wishCount > 0} />
            </Link>
            <Link href={signedIn ? routes.account() : routes.signIn()} className="icon-btn" aria-label="Account">
              <UserIcon />
            </Link>
            <IconButton label={`Cart, ${count} items`} onClick={() => setCartOpen(true)}>
              <BagIcon />
              {hydrated && count > 0 && (
                <span aria-hidden="true" className="absolute top-0.5 right-0 h-5 min-w-5 rounded-full bg-brand px-[5px] text-center text-[13px] leading-5 font-semibold text-page">
                  {count}
                </span>
              )}
            </IconButton>
          </div>
        </div>
        {searchOpen && <SearchBar onDone={() => setSearchOpen(false)} />}
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} signedIn={signedIn} wishCount={wishCount} />
      <MiniCart />
    </>
  );
}
