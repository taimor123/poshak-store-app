import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Buttons. Colours come from the --color-btn-* tokens in styles/tokens.css,
 * via the .btn-* classes in globals.css.
 *   primary   maroon fill — the one main action on a screen
 *   secondary white with maroon border
 *   ivory     outline on maroon bands
 *   link      text link styled as a button target (44px hit area)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ivory' | 'link';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ivory: 'btn-outline-ivory',
  link: 'tlink',
};

export const buttonClass = (variant: ButtonVariant = 'primary', className?: string) => cn(VARIANT[variant], className);

export function Button({ variant = 'primary', className, type = 'button', ...props }: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

/** A link that looks like a button. */
export function ButtonLink({ variant = 'primary', className, ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

/** 44×44 icon-only button. `label` is required for screen readers. */
export function IconButton({ label, className, type = 'button', ...props }: ComponentProps<'button'> & { label: string }) {
  return <button type={type} aria-label={label} className={cn('icon-btn', className)} {...props} />;
}
