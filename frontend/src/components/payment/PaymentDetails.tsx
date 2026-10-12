import type { Payment } from "../../types";
import { formatCurrency, formatDateTime, formatEnum } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";

export default function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Payment</h2>
        <StatusBadge status={payment.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-muted">Payment ID</dt>
          <dd className="font-semibold">#{payment.id}</dd>
        </div>
        <div>
          <dt className="text-muted">Amount</dt>
          <dd className="font-semibold">{formatCurrency(payment.amount)}</dd>
        </div>
        <div>
          <dt className="text-muted">Method</dt>
          <dd className="font-semibold">{formatEnum(payment.paymentMethod)}</dd>
        </div>
        <div>
          <dt className="text-muted">Paid on</dt>
          <dd className="font-semibold">{formatDateTime(payment.paymentDate)}</dd>
        </div>
      </dl>
      {payment.status === "REFUNDED" && <p className="mt-4 text-sm text-muted">This payment was refunded because the booking was cancelled.</p>}
      {payment.status === "FAILED" && <p className="mt-4 text-sm text-velvet">The last payment attempt failed. The booking is still pending until a payment succeeds.</p>}
    </section>
  );
}
