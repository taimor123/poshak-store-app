'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { routes } from '@/config/routes';
import { sendOtp, verifyOtp } from '@/lib/actions/auth';
import { displayPhone, isPkMobileNational, nationalDigits } from '@/lib/validation';
import { useShopper } from '@/stores/shopper';
import { toast } from '@/stores/ui';

const RESEND_SECONDS = 30;
const focus = (id: string) => {
  setTimeout(() => document.getElementById(id)?.focus(), 40);
};

/** Phone → 6-digit OTP sign-in. Demo code: 123456 (see lib/actions/auth.ts). */
export function SignInView({ next }: { next?: string }) {
  const router = useRouter();
  const signIn = useShopper((s) => s.signIn);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [tried, setTried] = useState(false);
  const [codeErr, setCodeErr] = useState('');
  const [verifying, startVerify] = useTransition();
  const { left, restart, stop } = useCountdown();

  const digits = nationalDigits(phone);
  const valid = isPkMobileNational(digits);
  const showErr = tried && !valid;
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : routes.account();

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setTried(true);
      return focus('si-phone');
    }
    await sendOtp(digits);
    setStep('otp');
    setCode('');
    setCodeErr('');
    restart();
    focus('si-otp');
    toast('Code sent by SMS');
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeErr('Enter all 6 digits.');
      return focus('si-otp');
    }
    startVerify(async () => {
      const res = await verifyOtp(digits, code);
      if (!res.ok) {
        setCodeErr('That code doesn’t match. Check the SMS and try again.');
        return focus('si-otp');
      }
      signIn(displayPhone(digits));
      router.push(safeNext);
    });
  };

  return (
    <div className="wrap pt-10">
      <div className="card-box mx-auto flex max-w-[420px] flex-col gap-5 px-6 py-7">
        {step === 'phone' ? (
          <form noValidate className="flex flex-col gap-5" onSubmit={submitPhone}>
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-display text-title font-semibold">Sign in or create an account</h1>
              <p className="m-0 text-body text-ink-2">No password. We’ll send a 6-digit code to your mobile by SMS.</p>
            </div>
            <div>
              <label className="field-label" htmlFor="si-phone">
                Mobile number
              </label>
              <div className="flex gap-2">
                <span className="inline-flex min-h-12 flex-none items-center rounded-card border border-line bg-alt px-3 text-body font-medium text-ink-2">+92</span>
                <input
                  id="si-phone"
                  className="input min-w-0 flex-1"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={showErr}
                  aria-describedby="si-phone-h"
                />
              </div>
              <p id="si-phone-h" className={`m-0 mt-1.5 text-caption ${showErr ? 'font-medium text-sale' : 'text-ink-2'}`}>
                {showErr ? 'Enter a 10-digit mobile number starting with 3, like 300 1234567.' : 'Pakistani mobile numbers only for now.'}
              </p>
            </div>
            <button type="submit" className="btn-primary">
              Send code
            </button>
            <p className="m-0 text-caption text-ink-2">By continuing you agree to receive order updates by SMS and WhatsApp. We never share your number.</p>
          </form>
        ) : (
          <form noValidate className="flex flex-col gap-5" onSubmit={submitCode}>
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-display text-title font-semibold">Enter your code</h1>
              <p className="m-0 text-body text-ink-2">
                Sent to +92 {digits.slice(0, 3)} {digits.slice(3)}.{' '}
                <button
                  type="button"
                  className="font-semibold text-brand hover:underline"
                  onClick={() => {
                    stop();
                    setStep('phone');
                    focus('si-phone');
                  }}
                >
                  Change
                </button>
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="si-otp">
                6-digit code
              </label>
              <input
                id="si-otp"
                className="input text-center text-[22px] leading-7 font-semibold tracking-[0.5em] tabular-nums"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setCodeErr('');
                }}
                aria-invalid={!!codeErr}
                aria-describedby="si-otp-h"
              />
              <p id="si-otp-h" aria-live="polite" className={`m-0 mt-1.5 text-caption ${codeErr ? 'font-medium text-sale' : 'text-ink-2'}`}>
                {codeErr || 'The code expires in 10 minutes.'}
              </p>
            </div>
            <button type="submit" className="btn-primary" disabled={verifying}>
              {verifying ? 'Checking…' : 'Verify and sign in'}
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {left > 0 ? (
                <span className="inline-flex min-h-11 items-center text-ui text-ink-2">Resend in 0:{String(left).padStart(2, '0')}</span>
              ) : (
                <button type="button" className="tlink text-ui" onClick={() => { restart(); toast('New code sent'); }}>
                  Resend code
                </button>
              )}
              <button type="button" className="tlink text-ui" onClick={() => { restart(); toast('Code sent on WhatsApp'); }}>
                Get it on WhatsApp
              </button>
            </div>
            {process.env.NODE_ENV !== 'production' && <p className="m-0 rounded-card border border-dashed border-mute bg-alt px-3 py-2.5 text-caption font-medium text-ink-2">Demo: use code 123456</p>}
          </form>
        )}
      </div>
      <p className="mx-auto mt-5 max-w-[420px] text-center text-ui text-ink-2">
        Just want to check an order?{' '}
        <Link href={routes.account('track')} className="font-semibold">
          Track without signing in
        </Link>
      </p>
    </div>
  );
}

function useCountdown() {
  const [left, setLeft] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);
  const stop = () => clearInterval(timer.current);
  const restart = () => {
    stop();
    setLeft(RESEND_SECONDS);
    timer.current = setInterval(() => setLeft((s) => (s <= 1 ? (stop(), 0) : s - 1)), 1000);
  };
  return { left, restart, stop };
}
