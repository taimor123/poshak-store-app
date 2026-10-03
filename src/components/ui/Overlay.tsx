'use client';
import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useEscape, useFocusTrap, useLockScroll } from '@/hooks/a11y';
import { cn } from '@/lib/cn';
import { IconButton } from './Button';
import { CloseIcon } from './icons';

type OverlayProps = { open: boolean; onClose: () => void; label: string; children: ReactNode };

/**
 * Side drawer: scrim, slide-in panel, focus trap, Esc to close, scroll lock.
 * Used by the mobile menu (left), mini-cart (right) and filter sheet.
 */
export function Drawer({ open, onClose, label, side = 'left', title, width = 'w-[min(340px,86vw)]', children }: OverlayProps & { side?: 'left' | 'right'; title?: ReactNode; width?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  useLockScroll(open);
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-80">
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          'absolute inset-y-0 flex flex-col overflow-y-auto bg-surface shadow-panel',
          width,
          side === 'left' ? 'left-0 animate-slide-left' : 'right-0 animate-slide-right',
        )}
      >
        <div className="flex flex-none items-center justify-between border-b border-line py-2.5 pr-2 pl-5">
          {title ?? <span className="text-group font-semibold">{label}</span>}
          <IconButton label={`Close ${label.toLowerCase()}`} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/** Centered modal dialog (quick view). */
export function Modal({ open, onClose, label, className, children }: OverlayProps & { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  useLockScroll(open);
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-95 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={cn('relative max-h-[calc(100vh-32px)] animate-fadein overflow-y-auto rounded-card bg-surface shadow-panel', className)}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
