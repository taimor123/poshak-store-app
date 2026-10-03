import type { CSSProperties, SVGProps } from 'react';

// Inline 24px line icons (1.5–2px stroke), coloured by `currentColor`.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, strokeWidth = 1.8): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export type Icon = (p: IconProps) => React.JSX.Element;

export const SearchIcon: Icon = ({ size = 21, ...p }) => <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>;
export const UserIcon: Icon = ({ size = 21, ...p }) => <svg {...base(size)} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20.5c1.6-3.6 4.6-5.5 8-5.5s6.4 1.9 8 5.5" /></svg>;
export const BagIcon: Icon = ({ size = 21, ...p }) => <svg {...base(size)} {...p}><path d="M6 8h12l-1.2 12.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 8z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>;
export const MenuIcon: Icon = ({ size = 22, ...p }) => <svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const CloseIcon: Icon = ({ size = 20, ...p }) => <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const ChevronDownIcon: Icon = ({ size = 14, ...p }) => <svg {...base(size)} {...p}><path d="M6 9l6 6 6-6" /></svg>;
export const MinusIcon: Icon = ({ size = 16, ...p }) => <svg {...base(size, 2)} {...p}><path d="M6 12h12" /></svg>;
export const PlusIcon: Icon = ({ size = 16, ...p }) => <svg {...base(size, 2)} {...p}><path d="M6 12h12M12 6v12" /></svg>;
export const CheckIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 2.2)} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const FilterIcon: Icon = ({ size = 18, ...p }) => <svg {...base(size)} {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>;
export const TruckIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><path d="M2.5 7h11v10h-11zM13.5 10h4l3 3v4h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>;
export const CashIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><rect x="2.5" y="6.5" width="19" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5h.01M18 14.5h.01" /></svg>;
export const ReturnIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><path d="M3 11a9 9 0 1 1 2.6 6.4" /><path d="M3 6v5h5" /></svg>;
export const RulerIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><rect x="2.5" y="8.5" width="19" height="7" rx="1.2" /><path d="M6.5 8.5v3M10.5 8.5v4.5M14.5 8.5v3M18.5 8.5v4.5" /></svg>;
export const BoxIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><path d="M4 8l8-4 8 4v9l-8 4-8-4V8z" /><path d="M4 8l8 4 8-4M12 12v9" /><path d="M8.5 5.8l7.5 3.7" /></svg>;
export const ChatIcon: Icon = ({ size = 24, ...p }) => <svg {...base(size, 1.5)} {...p}><path d="M21 12a9 9 0 1 1-4.4-7.7L21 3l-1.2 4.3A8.9 8.9 0 0 1 21 12z" /><path d="M8.5 10.5h7M8.5 13.5h4.5" /></svg>;

export function HeartIcon({ size = 21, filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, 1.7)} fill={filled ? 'currentColor' : 'none'} {...p}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

/** Placeholder-only kameez line art (ivory at 25%). Remove once real photography exists. */
export function KameezMotif({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 96 132" className={`text-page ${className ?? ''}`} style={style} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25" strokeLinejoin="round" strokeLinecap="round">
        <path d="M39 12 Q48 20 57 12" />
        <path d="M39 12 L26 18 L10 32 L17 50 L27 42 L27 116 Q48 124 69 116 L69 42 L79 50 L86 32 L70 18 L57 12" />
        <path d="M48 21 V44" />
        <path d="M27 96 Q48 103 69 96" />
      </g>
    </svg>
  );
}
