import { useState, type FormEvent } from "react";
import type { PaymentMethod } from "../../types";
import { PAYMENT_METHODS } from "../../types";
import { formatCurrency, formatEnum } from "../../utils/format";
import { hasErrors, isValidCardNumber, isValidExpiry, type FieldErrors } from "../../utils/validation";
import { InputField } from "../common/FormField";

/** Demo card that the simulated gateway declines, so the failure path can be tested. */
export const DECLINED_TEST_CARD = "4000000000000002";

interface Props {
  amount: number;
  busy: boolean;
  onPay: (method: PaymentMethod, gatewayApproved: boolean) => void;
}

type CardState = { holder: string; number: string; expiry: string; cvv: string };

export default function PaymentForm({ amount, busy, onPay }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [card, setCard] = useState<CardState>({ holder: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<FieldErrors<CardState>>({});
  const set = (patch: Partial<CardState>) => setCard((c) => ({ ...c, ...patch }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (method === "CARD") {
      const errs: FieldErrors<CardState> = {
        holder: !card.holder.trim() ? "Name on card is required" : undefined,
        number: !isValidCardNumber(card.number) ? "Enter a valid card number" : undefined,
        expiry: !isValidExpiry(card.expiry) ? "Use MM/YY and a date that has not passed" : undefined,
        cvv: !/^\d{3,4}$/.test(card.cvv) ? "CVV is 3 or 4 digits" : undefined,
      };
      setErrors(errs);
      if (hasErrors(errs)) return;
      // Card details are only validated here; they are never sent to the backend.
      onPay(method, card.number.replace(/\s/g, "") !== DECLINED_TEST_CARD);
      return;
    }
    onPay(method, true);
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <form onSubmit={submit} noValidate className="panel p-5 sm:p-6">
      <fieldset>
        <legend className="label">Payment method</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                method === m ? "border-ink bg-mist" : "border-line hover:border-ink/40"
              }`}
            >
              <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="accent-velvet" />
              {formatEnum(m)}
            </label>
          ))}
        </div>
      </fieldset>

      {method === "CARD" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InputField id="p-holder" label="Name on card" autoComplete="cc-name" value={card.holder} error={errors.holder} onChange={(e) => set({ holder: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <InputField
              id="p-number"
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              error={errors.number}
              onChange={(e) => set({ number: formatCardNumber(e.target.value) })}
            />
          </div>
          <InputField id="p-expiry" label="Expiry" placeholder="MM/YY" inputMode="numeric" autoComplete="cc-exp" value={card.expiry} error={errors.expiry} onChange={(e) => set({ expiry: formatExpiry(e.target.value) })} />
          <InputField id="p-cvv" label="CVV" inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={card.cvv} error={errors.cvv} onChange={(e) => set({ cvv: e.target.value.replace(/\D/g, "") })} />
        </div>
      )}

      {method !== "CARD" && (
        <p className="mt-5 text-sm text-muted">
          {method === "CASH" ? "Pay at the counter. Your booking is confirmed once the payment is recorded." : "Transfer the amount to the cinema account. Your booking is confirmed once the payment is recorded."}
        </p>
      )}

      <p className="mt-5 rounded-lg bg-brass-soft px-3 py-2 text-xs text-ink">
        Demo payments: no money is charged. Use 4242 4242 4242 4242 for a successful card payment, or 4000 0000 0000 0002 to see a declined payment.
      </p>

      <button type="submit" className="btn-primary mt-5 w-full py-3 text-base" disabled={busy}>
        {busy ? "Processing payment…" : `Pay ${formatCurrency(amount)}`}
      </button>
    </form>
  );
}
