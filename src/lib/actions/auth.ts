'use server';
import { api } from '@/lib/api/client';
import type { SessionUser } from '@/lib/api/account';
import type { ApiResult } from '@/lib/api/envelope';

// Email + password accounts (owner decision 2026-10-03; email OTP comes later).
// The API sets the session cookie; these proxies relay it to the browser.

type AuthResult = ApiResult<{ user: SessionUser }>;

export async function signIn(email: string, password: string): Promise<AuthResult> {
  return api('/auth/login', { method: 'POST', body: { email, password }, auth: true, setCookies: true });
}

export async function register(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  return api('/auth/register', { method: 'POST', body: input, auth: true, setCookies: true });
}

export async function signOut(): Promise<ApiResult<unknown>> {
  return api('/auth/logout', { method: 'POST', auth: true, setCookies: true });
}

/** Called once per page load; relays the API's rolling session refresh to the browser. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const r = await api<{ user: SessionUser | null }>('/auth/session', { auth: true, setCookies: true });
  return r.ok ? r.data.user : null;
}

export async function forgotPassword(email: string): Promise<ApiResult<{ message: string }>> {
  return api('/auth/forgot-password', { method: 'POST', body: { email } });
}

export async function resetPassword(token: string, password: string): Promise<ApiResult<{ message: string }>> {
  return api('/auth/reset-password', { method: 'POST', body: { token, password }, setCookies: true });
}
