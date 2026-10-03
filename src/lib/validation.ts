// Client-side validation for instant feedback. The API re-validates everything
// (docs/BACKEND/VALIDATION_RULES.md) and normalizes phones to "+923…".

/** "0300 1234567", "03001234567" or "0300-1234567". */
export const PK_MOBILE = /^03\d{2}[\s-]?\d{7}$/;

/** "+923001234567" (as the API stores it) → "0300 1234567". */
export const formatPkPhone = (phone: string) => phone.replace(/^\+92(\d{3})(\d{7})$/, '0$1 $2');
