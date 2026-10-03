import 'server-only';
import { cookies } from 'next/headers';
import { fail, type ApiResult, type ErrorCode } from './envelope';

/**
 * The one way this app talks to poshak-store-apis (FRONTEND_ARCHITECTURE.md §Data flow).
 * Server-side only: forwards the browser's cookies (session + guest cart) to
 * the API, parses the { ok, data | error } envelope, and — inside server
 * actions — copies the API's Set-Cookie headers back to the browser.
 */

const API_URL = (process.env.API_URL ?? 'http://localhost:4000').replace(/\/$/, '');
const FORWARDED_COOKIES = ['psk_session', 'psk_anon'];

type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  /** Forward the shopper's cookies (needed for cart, session, orders). */
  auth?: boolean;
  /** Copy Set-Cookie from the API to the browser. Only valid in server actions / route handlers. */
  setCookies?: boolean;
  /** Next.js data cache: seconds to revalidate (public catalogue reads only). */
  revalidate?: number;
};

export async function api<T>(path: string, opts: Options = {}): Promise<ApiResult<T>> {
  const url = new URL(`${API_URL}/api/v1${path}`);
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));

  const headers: Record<string, string> = { Accept: 'application/json', ...opts.headers };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.auth) {
    const jar = await cookies();
    const cookie = FORWARDED_COOKIES.flatMap((n) => {
      const v = jar.get(n)?.value;
      return v ? [`${n}=${v}`] : [];
    }).join('; ');
    if (cookie) headers.Cookie = cookie;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      ...(opts.auth || opts.method && opts.method !== 'GET' ? { cache: 'no-store' as const } : { next: { revalidate: opts.revalidate ?? 60 } }),
    });
  } catch {
    return fail('INTERNAL', 'We can’t reach the store right now. Please try again in a moment.');
  }

  if (opts.setCookies) await relayCookies(res);

  try {
    const json = (await res.json()) as ApiResult<T>;
    if (typeof json === 'object' && json && 'ok' in json) return json;
  } catch {
    /* fall through */
  }
  return fail((res.status === 404 ? 'NOT_FOUND' : 'INTERNAL') as ErrorCode, 'Something went wrong. Please try again.');
}

/** Unwraps a result for Server Component reads; throws on failure (caught by error.tsx / notFound). */
export async function apiData<T>(path: string, opts: Options = {}): Promise<T> {
  const r = await api<T>(path, opts);
  if (!r.ok) throw Object.assign(new Error(r.error.message), { code: r.error.code });
  return r.data;
}

/** Re-sets the API's cookies on the app's own domain. */
async function relayCookies(res: Response) {
  const raw = res.headers.getSetCookie?.() ?? [];
  if (!raw.length) return;
  const jar = await cookies();
  for (const line of raw) {
    const [pair, ...attrs] = line.split(';').map((s) => s.trim());
    const eq = pair!.indexOf('=');
    const name = pair!.slice(0, eq);
    const value = decodeURIComponent(pair!.slice(eq + 1));
    if (!FORWARDED_COOKIES.includes(name)) continue;
    const opt: Parameters<typeof jar.set>[2] = { path: '/', httpOnly: false, sameSite: 'lax' };
    for (const a of attrs) {
      const [k, v] = a.split('=');
      const key = k!.toLowerCase();
      if (key === 'httponly') opt.httpOnly = true;
      else if (key === 'secure') opt.secure = true;
      else if (key === 'max-age') opt.maxAge = Number(v);
      else if (key === 'expires') opt.expires = new Date(v!);
      else if (key === 'samesite') opt.sameSite = v!.toLowerCase() as 'lax' | 'strict' | 'none';
      else if (key === 'path') opt.path = v;
    }
    if (!value || opt.maxAge === 0 || (opt.expires !== undefined && new Date(opt.expires).getTime() < Date.now())) jar.delete(name);
    else jar.set(name, value, opt);
  }
}
