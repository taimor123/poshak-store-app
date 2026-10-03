import { Fraunces, Inter } from 'next/font/google';

// Brand typefaces. To change fonts, swap these two loaders; the CSS variable
// names are what tokens.css (--font-display / --font-sans) points at.

export const displayFont = Fraunces({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-display-face', display: 'swap' });
export const sansFont = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans-face', display: 'swap' });
