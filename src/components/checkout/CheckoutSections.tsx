'use client';
import { storeConfig } from '@/config/store';
import { deliveryRange, formatPKR } from '@/lib/format';
import { deliveryDays, deliveryLabel, isExpressCity, type DeliveryMethod } from '@/lib/shipping';
import { PK_MOBILE } from '@/lib/validation';
import { RadioCard, SelectField, TextField } from '@/components/ui/Field';

export type AddressFields = { name: string; phone: string; email: string; address: string; city: string; landmark: string };
export const EMPTY_ADDRESS: AddressFields = { name: '', phone: '', email: '', address: '', city: '', landmark: '' };
export type AddressErrors = Partial<Record<keyof AddressFields, string>>;

export function validateAddress(f: AddressFields): AddressErrors {
  const e: AddressErrors = {};
  if (f.name.trim().length < 2) e.name = 'Enter the name the rider should ask for.';
  if (!PK_MOBILE.test(f.phone.trim())) e.phone = 'Enter an 11-digit mobile number, like 0300 1234567.';
  if (f.address.trim().length < 10) e.address = 'Add house number, street and area so the rider can find you.';
  if (!f.city) e.city = 'Choose your city.';
  return e;
}

export function AddressSection({ value: f, errors, onChange }: { value: AddressFields; errors: AddressErrors; onChange: (f: AddressFields) => void }) {
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
      <TextField id="f-email" label="Email" optional="optional, for your receipt" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
      <TextField id="f-address" label="Address" autoComplete="street-address" placeholder="House number, street, area" value={f.address} onChange={set('address')} error={errors.address} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="f-city" label="City" placeholder="Select your city" options={storeConfig.cities} value={f.city} onChange={set('city')} error={errors.city} />
        <TextField id="f-landmark" label="Nearest landmark" optional="optional" placeholder="Helps the rider find you" value={f.landmark} onChange={set('landmark')} />
      </div>
    </section>
  );
}

export function DeliverySection({ method, city, subtotalPaisa, onChange }: { method: DeliveryMethod; city: string; subtotalPaisa: number; onChange: (m: DeliveryMethod) => void }) {
  const expressOk = isExpressCity(city);
  const free = subtotalPaisa >= storeConfig.freeShippingMinPaisa;
  return (
    <section aria-labelledby="sb" className="flex flex-col gap-3">
      <h2 id="sb" className="m-0 text-group font-semibold">
        Delivery
      </h2>
      <div role="radiogroup" aria-labelledby="sb" className="flex flex-col gap-2.5">
        <RadioCard
          name="delivery"
          checked={method === 'standard'}
          onChange={() => onChange('standard')}
          title={deliveryLabel('standard')}
          caption={`Arrives ${deliveryRange(deliveryDays('standard'))}`}
          trailing={free ? 'Free' : formatPKR(storeConfig.standardShippingPaisa)}
        />
        <RadioCard
          name="delivery"
          checked={method === 'express'}
          disabled={!expressOk}
          onChange={() => onChange('express')}
          title={deliveryLabel('express')}
          caption={expressOk ? `Arrives ${deliveryRange(deliveryDays('express'))}` : `${storeConfig.expressCities.slice(0, -1).join(', ')} and ${storeConfig.expressCities.at(-1)} only`}
          trailing={formatPKR(storeConfig.expressShippingPaisa)}
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
        {!storeConfig.cardPaymentsLive && <RadioCard name="payment" checked={false} disabled readOnly title="Debit or credit card" caption="Coming soon" />}
      </div>
    </section>
  );
}

export function ReviewSection({ address: f, method, onEdit }: { address: AddressFields; method: DeliveryMethod; onEdit: (step: 1 | 2) => void }) {
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
            <span className="text-ink-2">{[f.address, f.landmark, f.city].filter(Boolean).join(', ')}</span>
          </div>
          <button type="button" className="tlink self-start text-ui" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>
        <div className="flex justify-between gap-3 p-4">
          <div className="flex flex-col gap-0.5 text-body">
            <span className="mb-1 text-label font-semibold text-ink-2 uppercase">Delivery &amp; payment</span>
            <span>{deliveryLabel(method)}</span>
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
