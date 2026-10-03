// Client-side validation for instant feedback. The API re-validates everything
// (docs/BACKEND/VALIDATION_RULES.md).

/** "0300 1234567", "03001234567" or "0300-1234567". */
export const PK_MOBILE = /^03\d{2}[\s-]?\d{7}$/;

/** Strips +92 / 92 / 0 prefixes → "3001234567". */
export const nationalDigits = (input: string) => input.replace(/\D/g, '').replace(/^92/, '').replace(/^0/, '');

export const isPkMobileNational = (digits: string) => /^3\d{9}$/.test(digits);

/** "3001234567" → "0300 1234567" */
export const displayPhone = (digits: string) => `0${digits.slice(0, 3)} ${digits.slice(3)}`;

/** "3001234567" → "+923001234567" (canonical key, per CLAUDE.md conventions). */
export const e164 = (digits: string) => `+92${digits}`;
