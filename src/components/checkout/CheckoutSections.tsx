'use client';
import { formatPKR } from '@/lib/format';
import type { ShippingZone } from '@/lib/catalog/types';
import { PK_MOBILE } from '@/lib/validation';
import { RadioCard, SelectField, TextField } from '@/components/ui/Field';

export type DeliveryMethod = 'STANDARD' | 'EXPRESS';
export type AddressFields = { name: string; phone: string; email: string; address: string; city: string; notes: string };
export const EMPTY_ADDRESS: AddressFields = { name: '', phone: '', email: '', address: '', city: '', notes: '' };
export type AddressErrors = Partial<Record<keyof AddressFields, string>>;

/** Instant feedback only — the API re-validates everything (VALIDATION_RULES.md). */
export function validateAddress(f: AddressFields): AddressErrors {
  const e: AddressErrors = {};
  if (f.name.trim().length < 2) e.name = 'Enter the name the rider should ask for.';
  if (!PK_MOBILE.test(f.phone.trim())) e.phone = 'Enter an 11-digit mobile number, like 0300 1234567.';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter your email for the receipt and order updates.';
  if (f.address.trim().length < 10) e.address = 'Add house number, street and area so the rider can find you.';
  if (!f.city) e.city = 'Choose your city.';
  return e;
}

/** API field paths → form fields. */
export const API_FIELD: Record<string, keyof AddressFields> = {
  'contact.email': 'email',
  'contact.phone': 'phone',
  'address.name': 'name',
  'address.line1': 'address',
  'address.city': 'city',
  city: 'city',
  'address.notes': 'notes',
};

export function AddressSection({ value: f, errors, cities, onChange }: { value: AddressFields; errors: AddressErrors; cities: string[]; onChange: (f: AddressFields) => void }) {
  const set = (k: keyof AddressFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...f, [k]: e.target.value });
  return (
    <section aria-labelledby="sa" className="flex flex-col gap-4">
      <h2 id="sa" className="m-0 text-group font-semibold">
        Contact &amp; delivery address
      </h2>
      <TextField id="f-name" label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={errors.name} />
      <TextField
        id="f-phone"
        label="Mobile number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="0300 1234567"
        value={f.phone}
        onChange={set('phone')}
        error={errors.phone}
        hint="The rider will call this number. We’ll also confirm your order on WhatsApp."
      />
      <TextField id="f-email" label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} hint="For your receipt and a link to track the order." />
      <TextField id="f-address" label="Address" autoComplete="street-address" placeholder="House number, street, area" value={f.address} onChange={set('address')} error={errors.address} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField id="f-city" label="City" placeholder="Select your city" options={cities} value={f.city} onChange={set('city')} error={errors.city} />
        <TextField id="f-notes" label="Nearest landmark" optional="optional" placeholder="Helps the rider find you" maxLength={200} value={f.notes} onChange={set('notes')} error={errors.notes} />
      </div>
    </section>
  );
}

export function DeliverySection({ method, zone, standardFeePaisa, expressFeePaisa, onChange }: { method: DeliveryMethod; zone: ShippingZone | undefined; standardFeePaisa: number; expressFeePaisa: number; onChange: (m: DeliveryMethod) => void }) {
  const expressOk = !!zone?.expressAvailable;
  return (
    <section aria-labelledby="sb" className="flex flex-col gap-3">
      <h2 id="sb" className="m-0 text-group font-semibold">
        Delivery
      </h2>
      <div role="radiogroup" aria-labelledby="sb" className="flex flex-col gap-2.5">
        <RadioCard
          name="delivery"
          checked={method === 'STANDARD'}
          onChange={() => onChange('STANDARD')}
          title="Standard delivery"
          caption={zone ? zone.estimateText : 'Choose your city to see delivery times'}
          trailing={standardFeePaisa ? formatPKR(standardFeePaisa) : 'Free'}
        />
        <RadioCard
          name="delivery"
          checked={method === 'EXPRESS'}
          disabled={!expressOk}
          onChange={() => onChange('EXPRESS')}
          title="Express · 1–2 working days"
          caption={expressOk ? 'Dispatched first, delivered faster' : 'Karachi, Lahore and Islamabad only'}
          trailing={formatPKR(expressFeePaisa)}
        />
      </div>
    </section>
  );
}

export function PaymentSection({ totalPaisa }: { totalPaisa: number }) {
  return (
    <section aria-labelledby="sc" className="flex flex-col gap-3">
      <h2 id="sc" className="m-0 text-group font-semibold">
        Payment
      </h2>
      <div role="radiogroup" aria-labelledby="sc" className="flex flex-col gap-2.5">
        <RadioCard name="payment" checked readOnly title="Cash on delivery" caption={`Pay ${formatPKR(totalPaisa)} in cash when the rider arrives. No extra fee.`} />
        <RadioCard name="payment" checked={false} disabled readOnly title="Debit or credit card" caption="Coming soon" />
      </div>
    </section>
  );
}

export function ReviewSection({ address: f, method, estimate, onEdit }: { address: AddressFields; method: DeliveryMethod; estimate: string; onEdit: (step: 1 | 2) => void }) {
  return (
    <section aria-labelledby="sr" className="flex flex-col gap-3">
      <h2 id="sr" className="m-0 text-group font-semibold">
        Review your order
      </h2>
      <div className="card-box">
        <div className="flex justify-between gap-3 border-b border-line p-4">
          <div className="flex flex-col gap-0.5 text-body">
            <span className="mb-1 text-label font-semibold text-ink-2 uppercase">Deliver to</span>
            <span>
              {f.name} · {f.phone}
            </span>
            <span className="text-ink-2">{[f.address, f.notes, f.city].filter(Boolean).join(', ')}</span>
          </div>
          <button type="button" className="tlink self-start text-ui" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>
        <div className="flex justify-between gap-3 p-4">
          <div className="flex flex-col gap-0.5 text-body">
            <span className="mb-1 text-label font-semibold text-ink-2 uppercase">Delivery &amp; payment</span>
            <span>{method === 'EXPRESS' ? 'Express · 1–2 working days' : `Standard · ${estimate}`}</span>
            <span className="text-ink-2">Cash on delivery</span>
          </div>
          <button type="button" className="tlink self-start text-ui" onClick={() => onEdit(2)}>
            Edit
          </button>
        </div>
      </div>
    </section>
  );
}

export function StepProgress({ step }: { step: number }) {
  return (
    <ol aria-label="Checkout steps" className="m-0 mt-5 grid list-none grid-cols-3 gap-2 p-0">
      {['Address', 'Delivery & payment', 'Review'].map((l, i) => (
        <li key={l} aria-current={step === i + 1 ? 'step' : undefined} className="flex flex-col gap-2">
          <span className={`h-[3px] rounded-sm ${step >= i + 1 ? 'bg-brand' : 'bg-line'}`} />
          <span className={`text-caption font-medium ${step === i + 1 ? 'text-ink' : 'text-ink-2'}`}>
            {i + 1}. {l}
          </span>
        </li>
      ))}
    </ol>
  );
}
