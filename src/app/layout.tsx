import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import { StoreHydrator } from '@/stores/StoreHydrator';
import { Toaster } from '@/components/ui/Toaster';
import { displayFont, sansFont } from '@/styles/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} · ${siteConfig.positioning}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: { siteName: siteConfig.name, locale: 'en_PK', type: 'website' },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, password
    // managers…) inject attributes into <html>/<body> before React loads. This only
    // ignores attribute differences on these two tags, not on anything inside them.
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {children}
        <Toaster />
        <StoreHydrator />
      </body>
    </html>
  );
}
