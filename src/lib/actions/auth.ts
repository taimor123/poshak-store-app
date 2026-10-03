'use server';
import { isPkMobileNational, nationalDigits } from '@/lib/validation';

/**
 * Phone-OTP sign-in, demo implementation. Replace with the API's OTP endpoints
 * (the API sets the session cookie). Demo code: 123456.
 *
 * NOTE: docs/BACKEND/AUTHENTICATION.md specifies credentials + Google sign-in;
 * the design handoff specifies phone OTP. Decide before wiring the API.
 */
const DEMO_CODE = '123456';

export async function sendOtp(phone: string): Promise<{ ok: boolean }> {
  return { ok: isPkMobileNational(nationalDigits(phone)) };
}

export async function verifyOtp(phone: string, code: string): Promise<{ ok: boolean }> {
  return { ok: isPkMobileNational(nationalDigits(phone)) && code === DEMO_CODE };
}
