import { useState } from "react";
import { Link } from "react-router-dom";
import { paymentService } from "../../api/paymentService";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import { useApi } from "../../hooks/useApi";
import type { PaymentStatus } from "../../types";
import { formatCurrency, formatDateTime, formatEnum } from "../../utils/format";

const STATUSES: PaymentStatus[] = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"];

export default function AdminPaymentsPage() {
  const { data, loading, error, reload } = useApi(paymentService.getAll);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const list = (data ?? []).filter((p) => !statusFilter || p.status === statusFilter).sort((a, b) => b.id - a.id);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Payments</h2>
        <select className="input w-auto" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "")}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatEnum(s)}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (list.length === 0 ? (
          <EmptyState title="No payments" message={data.length === 0 ? "Payments appear here when customers pay for bookings." : "No payments with this status."} />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Booking</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold">#{p.id}</td>
                    <td>
                      <Link to={`/bookings/${p.bookingId}`} className="font-semibold text-velvet hover:underline">
                        #{p.bookingId}
                      </Link>
                      <span className="ml-2">
                        <StatusBadge status={p.bookingStatus} />
                      </span>
                    </td>
                    <td>{formatCurrency(p.amount)}</td>
                    <td>{formatEnum(p.paymentMethod)}</td>
                    <td>{formatDateTime(p.paymentDate)}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
