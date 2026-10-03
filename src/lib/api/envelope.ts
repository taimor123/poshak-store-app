// This repo's copy of the API contract envelope + error-code registry
// (docs/BACKEND/API_ENDPOINTS.md §Error codes). Keep in sync with poshak-store-apis.

export const ERROR_CODES = [
  'VALIDATION',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VARIANT_GONE',
  'STOCK_CONFLICT',
  'PRICE_MISMATCH',
  'ILLEGAL_TRANSITION',
  'RETURN_WINDOW_CLOSED',
  'ITEM_FINAL_SALE',
  'RATE_LIMITED',
  'IDEMPOTENT_REPLAY',
  'INTERNAL',
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export type ApiError = { code: ErrorCode; message: string; fieldErrors?: Record<string, string> };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export const ok = <T,>(data: T): ApiResult<T> => ({ ok: true, data });
export const fail = <T = never,>(code: ErrorCode, message: string, fieldErrors?: Record<string, string>): ApiResult<T> => ({
  ok: false,
  error: { code, message, ...(fieldErrors && { fieldErrors }) },
});
